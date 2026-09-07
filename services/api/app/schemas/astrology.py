from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class BirthDataInput(BaseModel):
    """Input payload for birth date and time calculations."""

    name: str | None = Field(default=None, description="Person name (optional)")
    gender: Literal["male", "female", "other"] = Field(
        default="male", description="Gender for palace and direction mapping"
    )
    birth_year: int = Field(
        ..., ge=1900, le=2100, description="Birth solar year (e.g. 1995)"
    )
    birth_month: int = Field(..., ge=1, le=12, description="Birth solar month (1-12)")
    birth_day: int = Field(..., ge=1, le=31, description="Birth solar day (1-31)")
    birth_hour: int = Field(
        ..., ge=0, le=23, description="Birth hour (0-23 in 24h format)"
    )
    birth_minute: int = Field(default=0, ge=0, le=59, description="Birth minute (0-59)")
    time_zone: float = Field(
        default=7.0, description="Timezone offset (default +7.0 for Vietnam)"
    )
    is_lunar: bool = Field(
        default=False, description="Whether provided date is already lunar"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Nguyễn Văn Minh",
                "gender": "male",
                "birth_year": 1995,
                "birth_month": 5,
                "birth_day": 15,
                "birth_hour": 8,
                "birth_minute": 30,
                "time_zone": 7.0,
                "is_lunar": False,
            }
        }
    )


class PillarDetail(BaseModel):
    """Details of a single pillar (Trụ) in Bát Tự (Year, Month, Day, or Hour)."""

    stem: str = Field(..., description="Thiên Can (e.g. Giáp, Ất...)")
    branch: str = Field(..., description="Địa Chi (e.g. Tý, Sửu...)")
    stem_element: str = Field(
        ..., description="Ngũ hành của Can (Mộc, Hỏa, Thổ, Kim, Thủy)"
    )
    branch_element: str = Field(
        ..., description="Ngũ hành của Chi (Mộc, Hỏa, Thổ, Kim, Thủy)"
    )
    combined_name: str = Field(..., description="Tên Can Chi đầy đủ (e.g. Giáp Tý)")
    polarity: str = Field(..., description="Âm / Dương")


class FiveElementsBalance(BaseModel):
    """Distribution percentages and analysis of Five Elements (Ngũ Hành)."""

    wood_percentage: float = Field(..., description="Tỷ lệ % Ngũ hành Mộc")
    fire_percentage: float = Field(..., description="Tỷ lệ % Ngũ hành Hỏa")
    earth_percentage: float = Field(..., description="Tỷ lệ % Ngũ hành Thổ")
    metal_percentage: float = Field(..., description="Tỷ lệ % Ngũ hành Kim")
    water_percentage: float = Field(..., description="Tỷ lệ % Ngũ hành Thủy")
    dominant_element: str = Field(..., description="Ngũ hành vượng nhất")
    lacking_element: str = Field(..., description="Ngũ hành suy/nhược nhất")
    balance_analysis_vi: str = Field(
        ..., description="Phân tích sự cân bằng ngũ hành theo triết học"
    )


class BaTuChartResponse(BaseModel):
    """Complete Bát Tự (Four Pillars of Destiny) chart response."""

    birth_data: BirthDataInput
    lunar_date_str: str = Field(..., description="Ngày tháng năm âm lịch tương ứng")
    year_pillar: PillarDetail = Field(..., description="Trụ Năm")
    month_pillar: PillarDetail = Field(..., description="Trụ Tháng")
    day_pillar: PillarDetail = Field(..., description="Trụ Ngày")
    hour_pillar: PillarDetail = Field(..., description="Trụ Giờ")
    day_master: str = Field(
        ..., description="Nhật Chủ (Can Ngày - Biểu tượng cốt lõi bản thể)"
    )
    five_elements_balance: FiveElementsBalance
    philosophical_reflections: list[str] = Field(
        default_factory=list,
        description="Gợi mở nhận thức & cân bằng cuộc sống",
    )


class TuViPalace(BaseModel):
    """Details of one of the 12 Cung in Tử Vi chart."""

    palace_name: str = Field(..., description="Tên Cung (Mệnh, Phụ Mẫu, Phúc Đức...)")
    earthly_branch: str = Field(..., description="Vị trí Địa Chi (Tý, Sửu...)")
    main_stars: list[str] = Field(
        default_factory=list, description="Các Chính Tinh tọa thủ"
    )
    symbolic_meaning_vi: str = Field(
        ..., description="Ý nghĩa biểu tượng tâm lý của Cung"
    )


class TuViChartResponse(BaseModel):
    """Complete Tử Vi 12 Cung chart response."""

    birth_data: BirthDataInput
    lunar_date_str: str = Field(..., description="Ngày tháng năm âm lịch tương ứng")
    menh_palace_branch: str = Field(..., description="Địa chi Cung Mệnh (e.g. Dần)")
    than_palace_branch: str = Field(..., description="Địa chi Cung Thân (e.g. Ngọ)")
    cuc_name: str = Field(..., description="Cục (e.g. Thủy Nhị Cục, Mộc Tam Cục...)")
    palaces: list[TuViPalace] = Field(
        default_factory=list, description="Danh sách 12 Cung Tử Vi"
    )
    core_archetype_vi: str = Field(
        ..., description="Mô hình tính cách & biểu tượng cốt lõi"
    )
    wisdom_reflections: list[str] = Field(
        default_factory=list,
        description="Gợi mở tự quan sát & phát triển bản thân",
    )


class FullAstrologyAnalysisResponse(BaseModel):
    """Synthesized analysis combining Bát Tự and Tử Vi charts."""

    batu_chart: BaTuChartResponse
    tuvi_chart: TuViChartResponse
    overall_synthesis_vi: str = Field(
        ..., description="Tổng hợp góc nhìn triết học & lời khuyên thực tế"
    )
