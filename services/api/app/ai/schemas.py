from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class AIMessage(BaseModel):
    """Single chat message within AI prompt payload."""

    role: str = Field(..., description="Message role: 'system', 'user', or 'assistant'")
    content: str = Field(..., description="Message body text content")


class AICompletionRequest(BaseModel):
    """Provider-agnostic request payload for AI completion generation."""

    messages: list[AIMessage] = Field(
        ..., description="Chronological conversation turn history"
    )
    temperature: float = Field(
        default=0.7, ge=0.0, le=2.0, description="Sampling temperature"
    )
    max_tokens: int | None = Field(
        default=None, description="Max output completion tokens limit"
    )
    model: str | None = Field(
        default=None, description="Optional target model override"
    )
    system_prompt: str | None = Field(
        default=None, description="Optional top-level system instruction"
    )
    response_format: dict[str, Any] | None = Field(
        default=None, description="Optional JSON schema constraint"
    )
    extra_params: dict[str, Any] = Field(
        default_factory=dict, description="Provider-specific extended parameters"
    )


class AIUsage(BaseModel):
    """Token usage and cost accounting metrics."""

    prompt_tokens: int = Field(default=0, ge=0)
    completion_tokens: int = Field(default=0, ge=0)
    total_tokens: int = Field(default=0, ge=0)
    estimated_cost_usd: float = Field(default=0.0, ge=0.0)


class TenPointCompassionateCandor(BaseModel):
    """The 10-Point Response Structure ('Thẳng Thắn Có Lòng Từ') for Minh Sư AI."""

    user_emotional_state: str = Field(
        ...,
        description=(
            "Point 1: Acknowledging user emotional state without harmful validation"
        ),
    )
    honest_reality: str = Field(
        ..., description="Point 2: Direct, objective, and realistic facing of reality"
    )
    factually_known: str = Field(
        ..., description="Point 3: Objective facts established directly by user input"
    )
    uncertainty_and_unknowns: str = Field(
        ...,
        description="Point 4: Explicit statement of unknown variables and predictions",
    )
    inaction_consequence: str = Field(
        ...,
        description="Point 5: Realistic consequences if no action or change is taken",
    )
    perspective_and_wisdom: str = Field(
        ..., description="Point 6: Philosophical, spiritual, or psychological framing"
    )
    resolution_path: str = Field(
        ..., description="Point 7: Realistic step-by-step resolution mindset"
    )
    immediate_action_24h: str = Field(
        ..., description="Point 8: One concrete action to complete within 24 hours"
    )
    short_term_action_7d: str = Field(
        ..., description="Point 9: One practical habit or step within 7 days"
    )
    professional_referral_boundary: str = Field(
        ...,
        description=(
            "Point 10: Clear indicator of when professional medical/legal help is"
            " required"
        ),
    )

    model_config = ConfigDict(extra="ignore")


class AICompletionResponse(BaseModel):
    """Provider-agnostic response payload returned by AI adapters."""

    content: str = Field(..., description="Raw text response content")
    structured_candor: TenPointCompassionateCandor | None = Field(
        default=None,
        description="Optional validated 10-Point Compassionate Candor payload",
    )
    model: str = Field(..., description="Actual model identifier used for generation")
    provider: str = Field(
        ..., description="Name of AI provider adapter (e.g. 'mock', 'openai')"
    )
    usage: AIUsage = Field(
        default_factory=AIUsage, description="Token usage and cost accounting"
    )
    finish_reason: str = Field(
        default="stop", description="Model execution termination reason"
    )

    model_config = ConfigDict(extra="ignore")
