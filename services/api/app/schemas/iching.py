import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class IChingHexagramSchema(BaseModel):
    """Schema representing an I Ching Hexagram catalog item."""

    id: uuid.UUID
    hexagram_number: int
    binary_code: str
    name_vi: str
    name_en: str
    pinyin_name: str
    upper_trigram: str
    lower_trigram: str
    judgement_vi: str
    image_vi: str
    lines_interpretation_vi: dict[str, str]
    wisdom_reflection_vi: str

    model_config = ConfigDict(from_attributes=True)


class CoinTossLine(BaseModel):
    """Payload representing a single 3-coin toss line outcome (Line 1 to Line 6)."""

    toss_number: int = Field(
        ..., ge=1, le=6, description="Line position from bottom (1) to top (6)"
    )
    coin_values: list[int] = Field(
        ..., description="Array of 3 coin faces (2=Heads/Yin, 3=Tails/Yang)"
    )
    sum_value: int = Field(
        ...,
        ge=6,
        le=9,
        description="Sum of 3 coins (6=Old Yin, 7=Young Yang, 8=Young Yin, 9=Old Yang)",
    )
    line_type: str = Field(
        ..., description="'OLD_YIN', 'YOUNG_YANG', 'YOUNG_YIN', or 'OLD_YANG'"
    )
    primary_binary: int = Field(
        ..., ge=0, le=1, description="Primary binary bit (1=Yang, 0=Yin)"
    )
    is_changing: bool = Field(
        ..., description="True if line is Old Yin (6) or Old Yang (9)"
    )
    transformed_binary: int = Field(
        ..., ge=0, le=1, description="Transformed binary bit after line change"
    )


class IChingTossRequest(BaseModel):
    """Request payload for 3-coin 6-toss Kinh Dịch reading."""

    intention: str | None = Field(
        default=None,
        description="Optional user intention or question for philosophical reflection",
    )


class IChingTossResponse(BaseModel):
    """Response payload for Kinh Dịch 3-coin toss simulation endpoint."""

    session_id: uuid.UUID = Field(..., description="Unique reading session tracking ID")
    tossed_at: datetime = Field(..., description="Timestamp of 3-coin toss execution")
    intention: str | None = Field(
        default=None, description="User reflection intention parameter"
    )
    tosses: list[CoinTossLine] = Field(
        ..., description="Chronological array of 6 coin toss lines (bottom to top)"
    )
    primary_hexagram: IChingHexagramSchema = Field(
        ..., description="Primary Hexagram (Quẻ Gốc)"
    )
    transformed_hexagram: IChingHexagramSchema | None = Field(
        default=None,
        description="Transformed Hexagram (Quẻ Biến) if changing lines exist",
    )
    changing_line_numbers: list[int] = Field(
        default_factory=list,
        description="Line numbers (1-6) that underwent changing transformation",
    )
