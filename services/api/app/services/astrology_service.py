from app.schemas.astrology import (
    BaTuChartResponse,
    BirthDataInput,
    FiveElementsBalance,
    FullAstrologyAnalysisResponse,
    PillarDetail,
    TuViChartResponse,
    TuViPalace,
)
from app.services.astrology_calculator import (
    BRANCH_ELEMENTS,
    STEM_ELEMENTS,
    calculate_can_chi_day,
    calculate_can_chi_hour,
    calculate_can_chi_month,
    calculate_can_chi_year,
    calculate_five_elements_balance,
    calculate_tuvi_palaces,
)


def _build_pillar_detail(stem: str, branch: str) -> PillarDetail:
    stem_elem, stem_pol = STEM_ELEMENTS[stem]
    branch_elem, _ = BRANCH_ELEMENTS[branch]
    return PillarDetail(
        stem=stem,
        branch=branch,
        stem_element=stem_elem,
        branch_element=branch_elem,
        combined_name=f"{stem} {branch}",
        polarity=stem_pol,
    )


def calculate_batu_chart(birth_data: BirthDataInput) -> BaTuChartResponse:
    """Calculate 4 Pillars (Năm, Tháng, Ngày, Giờ) & Five Elements balance."""
    year_stem, year_branch = calculate_can_chi_year(birth_data.birth_year)
    month_stem, month_branch = calculate_can_chi_month(
        year_stem, birth_data.birth_month
    )
    day_stem, day_branch = calculate_can_chi_day(
        birth_data.birth_year, birth_data.birth_month, birth_data.birth_day
    )
    hour_stem, hour_branch = calculate_can_chi_hour(day_stem, birth_data.birth_hour)

    year_pillar = _build_pillar_detail(year_stem, year_branch)
    month_pillar = _build_pillar_detail(month_stem, month_branch)
    day_pillar = _build_pillar_detail(day_stem, day_branch)
    hour_pillar = _build_pillar_detail(hour_stem, hour_branch)

    day_master_elem, day_master_pol = STEM_ELEMENTS[day_stem]
    day_master = f"{day_stem} {day_master_elem} ({day_master_pol})"

    pillars_raw = [
        (year_stem, year_branch),
        (month_stem, month_branch),
        (day_stem, day_branch),
        (hour_stem, hour_branch),
    ]
    elements_data = calculate_five_elements_balance(pillars_raw)
    five_elements = FiveElementsBalance(**elements_data)

    reflections = [
        (
            f"Bản thể Nhật Chủ của bạn là {day_master}, "
            "biểu trưng cho trục nhận thức và phản xạ hành vi."
        ),
        (
            f"Sự vượng nhược của {five_elements.dominant_element} "
            "nhắc nhở bạn quan sát cảm xúc khi đối mặt với thử thách."
        ),
        (
            "Huyền Tâm Minh Đạo nhấn mạnh: Mọi cấu trúc Bát Tự là công cụ "
            "tự soi chiếu tâm lý, không phải định mệnh an bài."
        ),
    ]

    lunar_str = (
        f"Năm {year_pillar.combined_name}, Tháng {month_pillar.combined_name}, "
        f"Ngày {day_pillar.combined_name}, Giờ {hour_pillar.combined_name}"
    )

    return BaTuChartResponse(
        birth_data=birth_data,
        lunar_date_str=lunar_str,
        year_pillar=year_pillar,
        month_pillar=month_pillar,
        day_pillar=day_pillar,
        hour_pillar=hour_pillar,
        day_master=day_master,
        five_elements_balance=five_elements,
        philosophical_reflections=reflections,
    )


def calculate_tuvi_chart(birth_data: BirthDataInput) -> TuViChartResponse:
    """Calculate Tử Vi 12 Palaces, Menh & Than placement, and main star archetypes."""
    _, hour_branch = calculate_can_chi_hour(
        "Giáp", birth_data.birth_hour
    )  # hour branch

    menh_branch, than_branch, cuc_name, raw_palaces = calculate_tuvi_palaces(
        birth_data.birth_month, hour_branch
    )

    palaces = [TuViPalace(**p) for p in raw_palaces]

    menh_palace = next((p for p in palaces if p.palace_name == "Mệnh"), palaces[0])
    main_star = menh_palace.main_stars[0] if menh_palace.main_stars else "Tử Vi"

    archetype = (
        f"Mô hình tính cách cốt lõi (Cung Mệnh tại {menh_branch} - "
        f"Chủ tinh {main_star}): "
        "Biểu hiện năng lượng lãnh đạo, trí tuệ tự sát và khả năng tổ chức."
    )

    reflections = [
        (
            f"Cung Mệnh đóng tại {menh_branch} đại diện cho thiên hướng "
            "nhận thức tự nhiên."
        ),
        (
            f"Cung Thân đóng tại {than_branch} đại diện cho hành động "
            "và thói quen rèn luyện trong thực tế."
        ),
        (
            "Mỗi ngôi sao trong Tử Vi là một biểu tượng tâm lý giúp bạn "
            "hiểu điểm mạnh và chuyển hóa điểm yếu."
        ),
    ]

    year_stem, year_branch = calculate_can_chi_year(birth_data.birth_year)
    lunar_str = (
        f"Âm lịch năm {year_stem} {year_branch}, Tháng {birth_data.birth_month}, "
        f"Giờ {hour_branch}"
    )

    return TuViChartResponse(
        birth_data=birth_data,
        lunar_date_str=lunar_str,
        menh_palace_branch=menh_branch,
        than_palace_branch=than_branch,
        cuc_name=cuc_name,
        palaces=palaces,
        core_archetype_vi=archetype,
        wisdom_reflections=reflections,
    )


def analyze_full_astrology(
    birth_data: BirthDataInput,
) -> FullAstrologyAnalysisResponse:
    """Synthesize Bát Tự and Tử Vi charts into a holistic self-observation reading."""
    batu = calculate_batu_chart(birth_data)
    tuvi = calculate_tuvi_chart(birth_data)

    synthesis = (
        f"Tổng quan lá số: Nhật Chủ {batu.day_master} kết hợp với Cung Mệnh "
        f"{tuvi.menh_palace_branch} ({tuvi.cuc_name}). "
        f"Năng lượng ngũ hành của bạn nổi bật với "
        f"{batu.five_elements_balance.dominant_element}. "
        "Huyền Tâm Minh Đạo khuyên bạn: Hãy làm chủ tâm trí, giữ sự điềm tĩnh "
        "và không bị chi phối bởi bất kỳ lời bói toán định mệnh nào."
    )

    return FullAstrologyAnalysisResponse(
        batu_chart=batu, tuvi_chart=tuvi, overall_synthesis_vi=synthesis
    )
