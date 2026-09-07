from datetime import datetime
from enum import StrEnum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DuongDaoCategoryEnum(StrEnum):
    """Categories of educational health & wellness articles."""

    SLEEP_HYGIENE = "SLEEP_HYGIENE"
    DAILY_RHYTHMS = "DAILY_RHYTHMS"
    SEASONAL_WELLNESS = "SEASONAL_WELLNESS"
    TRADITIONAL_HERITAGE = "TRADITIONAL_HERITAGE"


class DuongDaoArticleSchema(BaseModel):
    """Schema for educational wellness articles."""

    id: UUID
    category: DuongDaoCategoryEnum
    title_vi: str
    summary_vi: str
    content_vi: str
    historical_context_vi: str | None = None
    educational_disclaimer_vi: str
    tags: list[str] = Field(default_factory=list)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SleepHygieneGuideInput(BaseModel):
    """Input parameters for educational sleep hygiene self-assessment."""

    target_sleep_hours: float = Field(
        default=7.5, ge=4.0, le=12.0, description="Số giờ ngủ mục tiêu mỗi đêm"
    )
    bedtime_hour: int = Field(default=23, ge=0, le=23, description="Giờ đi ngủ (0-23h)")
    blue_light_exposure: bool = Field(
        default=True, description="Dùng thiết bị điện tử trước khi ngủ"
    )
    caffeine_after_3pm: bool = Field(
        default=False, description="Dùng cà phê/trà đậm sau 15h"
    )
    evening_stress_level: Literal["low", "medium", "high"] = Field(
        default="medium", description="Mức độ căng thẳng buổi tối"
    )


class SleepHygieneGuideResponse(BaseModel):
    """Educational sleep hygiene & daily rhythm recommendations response."""

    sleep_score: int = Field(
        ..., ge=0, le=100, description="Chỉ số tối ưu thói quen giấc ngủ"
    )
    habit_recommendations_vi: list[str] = Field(
        default_factory=list, description="Khuyên rèn luyện thói quen buổi tối"
    )
    daily_rhythm_tips_vi: list[str] = Field(
        default_factory=list, description="Gợi ý nhịp sinh học tự nhiên"
    )
    educational_disclaimer_vi: str = Field(
        ..., description="Cảnh báo bắt buộc: Thông tin chỉ mang tính giáo dục"
    )
