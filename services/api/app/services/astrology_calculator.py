from typing import Any

STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]

BRANCHES = [
    "Tý",
    "Sửu",
    "Dần",
    "Mão",
    "Thìn",
    "Tỵ",
    "Ngọ",
    "Mùi",
    "Thân",
    "Dậu",
    "Tuất",
    "Hợi",
]

STEM_ELEMENTS = {
    "Giáp": ("Mộc", "Dương"),
    "Ất": ("Mộc", "Âm"),
    "Bính": ("Hỏa", "Dương"),
    "Đinh": ("Hỏa", "Âm"),
    "Mậu": ("Thổ", "Dương"),
    "Kỷ": ("Thổ", "Âm"),
    "Canh": ("Kim", "Dương"),
    "Tân": ("Kim", "Âm"),
    "Nhâm": ("Thủy", "Dương"),
    "Quý": ("Thủy", "Âm"),
}

BRANCH_ELEMENTS = {
    "Tý": ("Thủy", "Dương"),
    "Sửu": ("Thổ", "Âm"),
    "Dần": ("Mộc", "Dương"),
    "Mão": ("Mộc", "Âm"),
    "Thìn": ("Thổ", "Dương"),
    "Tỵ": ("Hỏa", "Âm"),
    "Ngọ": ("Hỏa", "Dương"),
    "Mùi": ("Thổ", "Âm"),
    "Thân": ("Kim", "Dương"),
    "Dậu": ("Kim", "Âm"),
    "Tuất": ("Thổ", "Dương"),
    "Hợi": ("Thủy", "Âm"),
}

PALACE_NAMES = [
    "Mệnh",
    "Phụ Mẫu",
    "Phúc Đức",
    "Điền Trạch",
    "Quan Lộc",
    "Nô Bộc",
    "Thiên Di",
    "Tật Ách",
    "Tài Bạch",
    "Tử Tức",
    "Phu Thê",
    "Huynh Đệ",
]

MAIN_STARS = [
    "Tử Vi",
    "Thiên Cơ",
    "Thái Dương",
    "Vũ Khúc",
    "Thiên Đồng",
    "Liêm Trinh",
    "Thiên Phủ",
    "Thái Âm",
    "Tham Lang",
    "Cự Môn",
    "Thiên Tướng",
    "Thiên Lương",
    "Thất Sát",
    "Phá Quân",
]


def calculate_can_chi_year(year: int) -> tuple[str, str]:
    """Calculate Heavenly Stem and Earthly Branch for a solar year."""
    stem_idx = (year - 4) % 10
    branch_idx = (year - 4) % 12
    return STEMS[stem_idx], BRANCHES[branch_idx]


def calculate_can_chi_month(year_stem: str, month: int) -> tuple[str, str]:
    """Calculate Stem and Branch for a given month index (1-12)."""
    # Month branch starts at Dần (index 2) for Month 1
    branch_idx = (month + 1) % 12
    branch = BRANCHES[branch_idx]

    # Year stem offset mapping for month stem
    stem_start_map = {
        "Giáp": 2,  # Bính Dần
        "Kỷ": 2,
        "Ất": 4,  # Mậu Dần
        "Canh": 4,
        "Bính": 6,  # Canh Dần
        "Tân": 6,
        "Đinh": 8,  # Nhâm Dần
        "Nhâm": 8,
        "Mậu": 0,  # Giáp Dần
        "Quý": 0,
    }
    start_stem_idx = stem_start_map.get(year_stem, 0)
    stem_idx = (start_stem_idx + month - 1) % 10
    stem = STEMS[stem_idx]

    return stem, branch


def calculate_can_chi_day(year: int, month: int, day: int) -> tuple[str, str]:
    """Calculate Stem and Branch for a specific calendar day using epoch offset."""
    # Julian day number algorithm
    a = (14 - month) // 12
    y = year + 4800 - a
    m = month + 12 * a - 3
    jdn = day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045

    # Offset to reference epoch
    stem_idx = (jdn + 9) % 10
    branch_idx = (jdn + 1) % 12

    return STEMS[stem_idx], BRANCHES[branch_idx]


def calculate_hour_branch(hour: int) -> str:
    """Determine Earthly Branch for birth hour (24h format)."""
    if hour == 23 or hour == 0:
        return "Tý"
    branch_idx = (hour + 1) // 2
    return BRANCHES[branch_idx % 12]


def calculate_can_chi_hour(day_stem: str, hour: int) -> tuple[str, str]:
    """Calculate Stem and Branch for a birth hour."""
    branch = calculate_hour_branch(hour)
    branch_idx = BRANCHES.index(branch)

    # Day stem offset mapping for hour stem
    stem_start_map = {
        "Giáp": 0,  # Giáp Tý
        "Kỷ": 0,
        "Ất": 2,  # Bính Tý
        "Canh": 2,
        "Bính": 4,  # Mậu Tý
        "Tân": 4,
        "Đinh": 6,  # Canh Tý
        "Nhâm": 6,
        "Mậu": 8,  # Nhâm Tý
        "Quý": 8,
    }
    start_stem_idx = stem_start_map.get(day_stem, 0)
    stem_idx = (start_stem_idx + branch_idx) % 10
    stem = STEMS[stem_idx]

    return stem, branch


def calculate_five_elements_balance(
    pillars: list[tuple[str, str]],
) -> dict[str, Any]:
    """Compute distribution percentage of Five Elements across Stems & Branches."""
    counts = {"Mộc": 0.0, "Hỏa": 0.0, "Thổ": 0.0, "Kim": 0.0, "Thủy": 0.0}

    for stem, branch in pillars:
        stem_elem, _ = STEM_ELEMENTS[stem]
        branch_elem, _ = BRANCH_ELEMENTS[branch]
        counts[stem_elem] += 1.25
        counts[branch_elem] += 1.25

    total = sum(counts.values()) or 1.0

    percentages = {
        elem: round((val / total) * 100.0, 1) for elem, val in counts.items()
    }

    sorted_elems = sorted(percentages.items(), key=lambda x: x[1], reverse=True)
    dominant = sorted_elems[0][0]
    lacking = sorted_elems[-1][0]

    analysis = (
        f"Lá số của bạn mang năng lượng vượng {dominant} ({percentages[dominant]}%) "
        f"và nhược {lacking} ({percentages[lacking]}%). "
        f"Theo nguyên lý Huyền Tâm Minh Đạo, đây không phải định mệnh cố định "
        f"mà là xu hướng tính cách tự nhiên. Hãy dùng sự tự nhận thức để "
        f"bổ sung sự điềm tĩnh ({lacking}) và tiết chế sự nôn nóng ({dominant})."
    )

    return {
        "wood_percentage": percentages["Mộc"],
        "fire_percentage": percentages["Hỏa"],
        "earth_percentage": percentages["Thổ"],
        "metal_percentage": percentages["Kim"],
        "water_percentage": percentages["Thủy"],
        "dominant_element": dominant,
        "lacking_element": lacking,
        "balance_analysis_vi": analysis,
    }


def calculate_tuvi_palaces(
    month: int, hour_branch: str
) -> tuple[str, str, str, list[dict[str, Any]]]:
    """Calculate Tử Vi Menh & Than Palace branches, Cuc, and 12 Palaces mapping."""
    hour_idx = BRANCHES.index(hour_branch)

    # Mệnh Palace branch: (Month - Hour + 1) mod 12
    menh_idx = (month - 1 - hour_idx + 12) % 12
    menh_branch = BRANCHES[menh_idx]

    # Thân Palace branch: (Month + Hour - 1) mod 12
    than_idx = (month - 1 + hour_idx) % 12
    than_branch = BRANCHES[than_idx]

    cuc_names = [
        "Thủy Nhị Cục",
        "Mộc Tam Cục",
        "Kim Tứ Cục",
        "Thổ Ngũ Cục",
        "Hỏa Lục Cục",
    ]
    cuc_name = cuc_names[(menh_idx + month) % 5]

    # Map 12 Palaces counter-clockwise or clockwise starting from Mệnh Palace
    palaces: list[dict[str, Any]] = []
    for i, p_name in enumerate(PALACE_NAMES):
        branch_pos = (menh_idx - i + 12) % 12
        branch = BRANCHES[branch_pos]

        # Distribute main stars symbolically across palaces
        assigned_stars: list[str] = []
        star_idx_1 = (menh_idx + i * 2) % len(MAIN_STARS)
        assigned_stars.append(MAIN_STARS[star_idx_1])

        if i % 3 == 0:
            star_idx_2 = (menh_idx + i + 7) % len(MAIN_STARS)
            if MAIN_STARS[star_idx_2] not in assigned_stars:
                assigned_stars.append(MAIN_STARS[star_idx_2])

        meaning = (
            f"Cung {p_name} tọa tại {branch}, "
            f"biểu hiện năng lượng {assigned_stars[0]}. "
            f"Gợi mở sự chiêm nghiệm về mảng {p_name.lower()} trong cuộc sống."
        )

        palaces.append(
            {
                "palace_name": p_name,
                "earthly_branch": branch,
                "main_stars": assigned_stars,
                "symbolic_meaning_vi": meaning,
            }
        )

    return menh_branch, than_branch, cuc_name, palaces
