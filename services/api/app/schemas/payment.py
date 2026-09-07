import uuid

from pydantic import BaseModel, Field


class PaymentWebhookPayload(BaseModel):
    """Payload schema for payment gateway webhook callbacks."""

    event_type: str = Field(
        ...,
        description="Event type, e.g. 'payment.succeeded' or 'topup.completed'",
    )
    transaction_id: str = Field(
        ...,
        description="Unique gateway transaction ID used as ledger reference_id",
    )
    user_id: uuid.UUID = Field(
        ...,
        description="Target user UUID receiving Linh Điểm credits",
    )
    amount_credits: int = Field(
        ...,
        gt=0,
        description="Positive Linh Điểm credit amount to deposit",
    )
    idempotency_key: str | None = Field(
        default=None,
        description="Optional explicit idempotency key (defaults to transaction_id)",
    )


class PaymentWebhookResponse(BaseModel):
    """Response schema returned by the payment webhook handler endpoint."""

    success: bool = Field(..., description="Execution status boolean flag")
    status: str = Field(
        ...,
        description="Execution status detail ('processed' or 'already_processed')",
    )
    transaction_id: str = Field(..., description="Gateway transaction ID")
    credited_amount: int = Field(
        ...,
        ge=0,
        description="Amount of credits added in this request execution",
    )
    message: str = Field(..., description="Human-readable execution message")
