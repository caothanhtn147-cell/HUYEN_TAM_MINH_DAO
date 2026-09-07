from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.astrology import BirthDataInput
from app.services.astrology_calculator import (
    calculate_can_chi_day,
    calculate_can_chi_hour,
    calculate_can_chi_month,
    calculate_can_chi_year,
    calculate_five_elements_balance,
    calculate_tuvi_palaces,
)
from app.services.astrology_service import (
    analyze_full_astrology,
    calculate_batu_chart,
    calculate_tuvi_chart,
)

client = TestClient(app)


def test_can_chi_calculation_engine() -> None:
    """Test Can Chi calculation for 1995-05-15 08:30."""
    year_stem, year_branch = calculate_can_chi_year(1995)
    assert year_stem == "Ất"
    assert year_branch == "Hợi"

    month_stem, month_branch = calculate_can_chi_month(year_stem, 5)
    assert month_branch == "Ngọ"
    assert month_stem == "Nhâm"

    day_stem, day_branch = calculate_can_chi_day(1995, 5, 15)
    assert day_stem in [
        "Giáp",
        "Ất",
        "Bính",
        "Đinh",
        "Mậu",
        "Kỷ",
        "Canh",
        "Tân",
        "Nhâm",
        "Quý",
    ]
    assert day_branch in [
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

    hour_stem, hour_branch = calculate_can_chi_hour(day_stem, 8)
    assert hour_branch == "Thìn"
    assert hour_stem != ""


def test_five_elements_balance_distribution() -> None:
    """Test Five Elements balance percentages sum to 100%."""
    pillars_sample = [
        ("Giáp", "Tý"),
        ("Bính", "Dần"),
        ("Canh", "Thân"),
        ("Nhâm", "Thìn"),
    ]
    res = calculate_five_elements_balance(pillars_sample)
    total_pct = (
        res["wood_percentage"]
        + res["fire_percentage"]
        + res["earth_percentage"]
        + res["metal_percentage"]
        + res["water_percentage"]
    )
    assert abs(total_pct - 100.0) < 0.2
    assert res["dominant_element"] in ["Mộc", "Hỏa", "Thổ", "Kim", "Thủy"]
    assert res["lacking_element"] in ["Mộc", "Hỏa", "Thổ", "Kim", "Thủy"]


def test_tuvi_palaces_placement() -> None:
    """Test Tử Vi 12 palaces generation and Mệnh/Thân branch assignment."""
    menh, than, cuc, palaces = calculate_tuvi_palaces(5, "Thìn")
    assert len(palaces) == 12
    assert menh in [
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
    assert than in [
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
    assert cuc in [
        "Thủy Nhị Cục",
        "Mộc Tam Cục",
        "Kim Tứ Cục",
        "Thổ Ngũ Cục",
        "Hỏa Lục Cục",
    ]


def test_astrology_service_functions() -> None:
    """Test astrology service layer for Bát Tự and Tử Vi."""
    input_data = BirthDataInput(
        name="Nguyễn Văn Minh",
        gender="male",
        birth_year=1995,
        birth_month=5,
        birth_day=15,
        birth_hour=8,
        birth_minute=30,
    )
    batu = calculate_batu_chart(input_data)
    assert batu.year_pillar.combined_name == "Ất Hợi"
    assert (
        "Giáp" in batu.day_master
        or "Ất" in batu.day_master
        or "Bính" in batu.day_master
        or "Đinh" in batu.day_master
        or "Mậu" in batu.day_master
        or "Kỷ" in batu.day_master
        or "Canh" in batu.day_master
        or "Tân" in batu.day_master
        or "Nhâm" in batu.day_master
        or "Quý" in batu.day_master
    )

    tuvi = calculate_tuvi_chart(input_data)
    assert len(tuvi.palaces) == 12

    full = analyze_full_astrology(input_data)
    assert full.batu_chart is not None
    assert full.tuvi_chart is not None
    assert len(full.overall_synthesis_vi) > 20


def test_astrology_api_endpoints() -> None:
    """Test FastAPI endpoints /api/v1/astrology/batu, /tuvi, and /full-analysis."""
    payload = {
        "name": "Trần Thị Hoa",
        "gender": "female",
        "birth_year": 1998,
        "birth_month": 10,
        "birth_day": 20,
        "birth_hour": 14,
        "birth_minute": 0,
        "time_zone": 7.0,
        "is_lunar": False,
    }

    # Bát Tự endpoint
    res_batu = client.post("/api/v1/astrology/batu", json=payload)
    assert res_batu.status_code == status.HTTP_200_OK
    data_batu = res_batu.json()
    assert "year_pillar" in data_batu
    assert "five_elements_balance" in data_batu

    # Tử Vi endpoint
    res_tuvi = client.post("/api/v1/astrology/tuvi", json=payload)
    assert res_tuvi.status_code == status.HTTP_200_OK
    data_tuvi = res_tuvi.json()
    assert len(data_tuvi["palaces"]) == 12

    # Full Analysis endpoint
    res_full = client.post("/api/v1/astrology/full-analysis", json=payload)
    assert res_full.status_code == status.HTTP_200_OK
    data_full = res_full.json()
    assert "batu_chart" in data_full
    assert "tuvi_chart" in data_full
    assert "overall_synthesis_vi" in data_full
