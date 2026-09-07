import hashlib
import hmac
import json
import uuid
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.config import get_settings
from app.db.session import get_db_session
from app.main import create_app
from app.schemas.payment import PaymentWebhookPayload, PaymentWebhookResponse
from app.services.payment_service import (
    process_payment_webhook,
    verify_webhook_signature,
)


def test_verify_webhook_signature_unit() -> None:
    """Verify HMAC-SHA256 signature verification logic."""
    secret = "test_webhook_secret_key"
    payload = b'{"event_type":"payment.succeeded","amount_credits":100}'

    # Compute valid signature
    valid_sig = hmac.new(
        key=secret.encode("utf-8"),
        msg=payload,
        digestmod=hashlib.sha256,
    ).hexdigest()

    # 1. Direct hex signature
    assert verify_webhook_signature(payload, valid_sig, secret=secret) is True

    # 2. Prefixed signature format
    assert (
        verify_webhook_signature(payload, f"sha256={valid_sig}", secret=secret) is True
    )
    assert verify_webhook_signature(payload, f"v1={valid_sig}", secret=secret) is True

    # 3. Invalid signature
    assert verify_webhook_signature(payload, "invalid_sig_hex", secret=secret) is False

    # 4. Missing signature
    assert verify_webhook_signature(payload, None, secret=secret) is False


def test_payment_webhook_missing_signature(client: TestClient) -> None:
    """Verify HTTP 401 response when signature header is missing."""
    payload = {
        "event_type": "payment.succeeded",
        "transaction_id": "tx_missing_sig_123",
        "user_id": str(uuid.uuid4()),
        "amount_credits": 500,
    }
    response = client.post("/api/v1/payments/webhook", json=payload)
    assert response.status_code == 401
    assert "Invalid payment webhook HMAC signature" in response.json()["detail"]


def test_payment_webhook_invalid_signature(client: TestClient) -> None:
    """Verify HTTP 401 response when signature is invalid."""
    payload = {
        "event_type": "payment.succeeded",
        "transaction_id": "tx_invalid_sig_123",
        "user_id": str(uuid.uuid4()),
        "amount_credits": 500,
    }
    headers = {"X-Signature": "invalid_hmac_signature_hex"}
    response = client.post("/api/v1/payments/webhook", json=payload, headers=headers)
    assert response.status_code == 401
    assert "Invalid payment webhook HMAC signature" in response.json()["detail"]


def test_payment_webhook_invalid_json_payload(client: TestClient) -> None:
    """Verify HTTP 400 response when body is invalid JSON or breaks schema."""
    raw_body = b"invalid json payload body"
    settings = get_settings()

    valid_sig = hmac.new(
        key=settings.PAYMENT_WEBHOOK_SECRET.encode("utf-8"),
        msg=raw_body,
        digestmod=hashlib.sha256,
    ).hexdigest()

    headers = {"X-Signature": valid_sig, "Content-Type": "application/json"}
    response = client.post(
        "/api/v1/payments/webhook", content=raw_body, headers=headers
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_process_payment_webhook_service_success_and_idempotency() -> None:
    """Verify process_payment_webhook credits user and handles idempotency events."""
    mock_db = AsyncMock()
    user_id = uuid.uuid4()

    payload = PaymentWebhookPayload(
        event_type="payment.succeeded",
        transaction_id="tx_idempotency_999",
        user_id=user_id,
        amount_credits=500,
        idempotency_key="unique_idempotency_key_999",
    )

    # 1. First execution -> successfully processed
    with pytest.MonkeyPatch.context() as mp:

        async def mock_deposit_credits(*args, **kwargs):
            return AsyncMock()

        mp.setattr("app.services.payment_service.deposit_credits", mock_deposit_credits)

        res1 = await process_payment_webhook(mock_db, payload)
        assert isinstance(res1, PaymentWebhookResponse)
        assert res1.success is True
        assert res1.status == "processed"
        assert res1.credited_amount == 500
        assert res1.transaction_id == "tx_idempotency_999"

    # 2. Duplicate execution -> idempotency replay protection
    with pytest.MonkeyPatch.context() as mp:

        async def mock_deposit_duplicate_error(*args, **kwargs):
            raise ValueError(
                "Duplicate transaction idempotency key: 'unique_idempotency_key_999'."
            )

        mp.setattr(
            "app.services.payment_service.deposit_credits", mock_deposit_duplicate_error
        )

        res2 = await process_payment_webhook(mock_db, payload)
        assert isinstance(res2, PaymentWebhookResponse)
        assert res2.success is True
        assert res2.status == "already_processed"
        assert res2.credited_amount == 0
        assert res2.transaction_id == "tx_idempotency_999"


def test_payment_webhook_full_endpoint_flow() -> None:
    """Verify full HTTP endpoint flow with valid HMAC signature and mock DB."""
    app = create_app()
    mock_db = AsyncMock()

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db

    settings = get_settings()
    user_id = str(uuid.uuid4())
    payload_dict = {
        "event_type": "payment.succeeded",
        "transaction_id": "tx_full_flow_001",
        "user_id": user_id,
        "amount_credits": 1000,
    }
    raw_body = json.dumps(payload_dict).encode("utf-8")

    sig = hmac.new(
        key=settings.PAYMENT_WEBHOOK_SECRET.encode("utf-8"),
        msg=raw_body,
        digestmod=hashlib.sha256,
    ).hexdigest()

    with TestClient(app) as tc:
        with pytest.MonkeyPatch.context() as mp:

            async def mock_deposit(*args, **kwargs):
                return AsyncMock()

            mp.setattr("app.services.payment_service.deposit_credits", mock_deposit)

            headers = {"X-Signature": sig, "Content-Type": "application/json"}
            response = tc.post(
                "/api/v1/payments/webhook", content=raw_body, headers=headers
            )

            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["status"] == "processed"
            assert data["credited_amount"] == 1000
            assert data["transaction_id"] == "tx_full_flow_001"
