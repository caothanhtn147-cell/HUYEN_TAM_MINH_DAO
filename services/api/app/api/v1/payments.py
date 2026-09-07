import json
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.payment import PaymentWebhookPayload, PaymentWebhookResponse
from app.services.payment_service import (
    process_payment_webhook,
    verify_webhook_signature,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])


@router.post(
    "/webhook",
    response_model=PaymentWebhookResponse,
    status_code=status.HTTP_200_OK,
    summary="Receive payment gateway webhook callbacks",
)
async def receive_payment_webhook(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    x_signature: Annotated[str | None, Header(alias="X-Signature")] = None,
    x_webhook_signature: Annotated[
        str | None, Header(alias="X-Webhook-Signature")
    ] = None,
) -> PaymentWebhookResponse:
    """Receive, authenticate via HMAC-SHA256, and credit user wallet idempotently."""
    signature = x_signature or x_webhook_signature

    raw_body = await request.body()
    if not verify_webhook_signature(raw_body, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid payment webhook HMAC signature.",
        )

    try:
        json_data = json.loads(raw_body.decode("utf-8"))
        payload = PaymentWebhookPayload.model_validate(json_data)
    except (json.JSONDecodeError, ValidationError) as err:
        logger.warning(f"Invalid payment webhook payload format: {err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid webhook JSON payload: {err}",
        ) from err

    try:
        response = await process_payment_webhook(db=db, payload=payload)
        return response
    except Exception as err:
        logger.error(f"Internal error executing payment webhook: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing payment webhook transaction.",
        ) from err
