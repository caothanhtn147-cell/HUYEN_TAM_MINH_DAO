import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TarotCardSchema(BaseModel):
    """Schema representing a single Tarot card catalog item."""

    id: uuid.UUID
    card_code: str
    name_vi: str
    name_en: str
    arcana: str
    suit: str | None = None
    card_number: int
    upright_keywords: list[str]
    reversed_keywords: list[str]
    upright_meaning_vi: str
    reversed_meaning_vi: str
    wisdom_reflection_vi: str
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)


class TarotDrawRequest(BaseModel):
    """Request payload for drawing Tarot cards."""

    count: int = Field(
        default=1,
        ge=1,
        le=10,
        description="Number of cards to draw (1 to 10)",
    )
    intention: str | None = Field(
        default=None,
        description="Optional user intention or question for psychological reflection",
    )


class DrawnCardItem(BaseModel):
    """Payload representing a single drawn card in a Tarot reading session."""

    card_code: str
    name_vi: str
    name_en: str
    arcana: str
    suit: str | None = None
    is_reversed: bool = Field(
        ...,
        description="True if card is drawn in reversed orientation",
    )
    orientation: str = Field(
        ...,
        description="Human readable orientation: 'Upright' or 'Reversed'",
    )
    keywords: list[str]
    meaning_vi: str = Field(
        ...,
        description="Non-predictive psychological mirror interpretation",
    )
    wisdom_reflection_vi: str = Field(
        ...,
        description="Philosophical self-inquiry reflection question",
    )
    image_url: str | None = None


class TarotDrawResponse(BaseModel):
    """Response payload for Tarot card draw endpoint."""

    draw_id: uuid.UUID = Field(..., description="Unique draw session tracking ID")
    drawn_at: datetime = Field(..., description="Timestamp of card draw execution")
    intention: str | None = Field(
        default=None,
        description="User reflection intention parameter if provided",
    )
    cards: list[DrawnCardItem] = Field(
        ...,
        description="List of drawn cards with psychological interpretations",
    )
