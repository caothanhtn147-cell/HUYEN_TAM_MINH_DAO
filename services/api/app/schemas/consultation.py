import uuid

from pydantic import BaseModel, Field

from app.ai.crisis_detector import HotlineContact
from app.ai.schemas import AIMessage, AIUsage, TenPointCompassionateCandor


class MinhKienConsultationRequest(BaseModel):
    """Request payload for Minh Kiến consultation session."""

    messages: list[AIMessage] = Field(
        ...,
        min_length=1,
        description="Chronological conversation turn history",
    )
    model: str | None = Field(
        default=None,
        description="Target model identifier override",
    )
    provider: str | None = Field(
        default=None,
        description="Target AI provider adapter (e.g. 'openai', 'gemini', 'mock')",
    )
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=2.0,
        description="Sampling temperature",
    )
    max_tokens: int | None = Field(
        default=None,
        description="Max token limit for completion",
    )
    system_prompt: str | None = Field(
        default=None,
        description="Optional custom system prompt override",
    )


class MinhKienConsultationResponse(BaseModel):
    """Response payload returned by Minh Kiến consultation endpoint."""

    session_id: uuid.UUID = Field(
        ...,
        description="Unique consultation session tracking ID",
    )
    content: str = Field(..., description="Processed consultation text content")
    structured_candor: TenPointCompassionateCandor | None = Field(
        default=None,
        description="Validated 10-Point Compassionate Candor payload",
    )
    model: str = Field(..., description="Actual LLM model used for generation")
    provider: str = Field(..., description="Actual AI provider adapter name used")
    credits_deducted: int = Field(
        ...,
        ge=0,
        description="Amount of Linh Điểm credits deducted for consultation",
    )
    usage: AIUsage = Field(
        default_factory=AIUsage,
        description="Token usage metrics",
    )
    safety_action: str = Field(
        ...,
        description=(
            "Safety pipeline outcome ('ALLOW', 'WARN', 'BLOCK', 'EMERGENCY_HOTLINE')"
        ),
    )
    hotline_contacts: list[HotlineContact] | None = Field(
        default=None,
        description="Emergency helpline contacts attached if crisis detected",
    )
