import hashlib
import hmac
import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.ledger import TransactionType
from app.schemas.payment import PaymentWebhookPayload, PaymentWebhookResponse
from app.services.ledger_service import deposit_credits

logger = logging.getLogger(__name__)


def verify_webhook_signature(
    raw_body: bytes,
    signature_header: str | None,
    secret: str | None = None,
) -> bool:
    """Verify HMAC-SHA256 signature for payment webhook requests.

    Supports raw hex digest or prefixed signatures (e.g. 'sha256=<hex>' or 'v1=<hex>').
    """
    if not signature_header:
        logger.warning("Payment webhook missing signature header.")
        return False

    settings = get_settings()
    webhook_secret = secret or settings.PAYMENT_WEBHOOK_SECRET
    if not webhook_secret:
        logger.error("PAYMENT_WEBHOOK_SECRET is not configured.")
        return False

    # Extract hex string if prefixed
    received_sig = signature_header.strip()
    if "=" in received_sig:
        parts = received_sig.split("=", 1)
        received_sig = parts[1].strip()

    expected_sig = hmac.new(
        key=webhook_secret.encode("utf-8"),
        msg=raw_body,
        digestmod=hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(expected_sig.lower(), received_sig.lower())


async def process_payment_webhook(
    db: AsyncSession,
    payload: PaymentWebhookPayload,
) -> PaymentWebhookResponse:
    """Process verified webhook payload by depositing credits into user wallet.

    Protects against replay attacks by reusing transaction_id or idempotency_key.
    """
    idempotency_key = (
        payload.idempotency_key
        or f"webhook:{payload.event_type}:{payload.transaction_id}"
    )

    try:
        await deposit_credits(
            db=db,
            user_id=payload.user_id,
            amount=payload.amount_credits,
            transaction_type=TransactionType.TOPUP,
            reference_id=payload.transaction_id,
            idempotency_key=idempotency_key,
        )

        logger.info(
            f"Successfully processed payment webhook {payload.transaction_id} "
            f"for user {payload.user_id} (+{payload.amount_credits} credits)."
        )

        return PaymentWebhookResponse(
            success=True,
            status="processed",
            transaction_id=payload.transaction_id,
            credited_amount=payload.amount_credits,
            message="User wallet successfully credited.",
        )
    except ValueError as err:
        err_msg = str(err)
        if (
            "Duplicate transaction idempotency key" in err_msg
            or "idempotency" in err_msg
        ):
            logger.info(
                f"Ignored duplicate payment webhook {payload.transaction_id} "
                f"(Idempotency key: '{idempotency_key}')."
            )
            return PaymentWebhookResponse(
                success=True,
                status="already_processed",
                transaction_id=payload.transaction_id,
                credited_amount=0,
                message="Webhook event already recorded.",
            )
        logger.error(f"Failed to process payment webhook: {err}")
        raise
