from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.duong_dao import SleepHygieneGuideInput
from app.services.duong_dao_service import calculate_sleep_hygiene_guide
from seeds.duong_dao_seed import DUONG_DAO_SEED_ARTICLES, MANDATORY_DISCLAIMER

client = TestClient(app)


def test_calculate_sleep_hygiene_guide_logic() -> None:
    """Test sleep hygiene habit score calculation and disclaimer inclusion."""
    input_good = SleepHygieneGuideInput(
        target_sleep_hours=8.0,
        bedtime_hour=22,
        blue_light_exposure=False,
        caffeine_after_3pm=False,
        evening_stress_level="low",
    )
    res_good = calculate_sleep_hygiene_guide(input_good)
    assert res_good.sleep_score == 100
    assert len(res_good.habit_recommendations_vi) > 0
    assert MANDATORY_DISCLAIMER in res_good.educational_disclaimer_vi

    input_bad = SleepHygieneGuideInput(
        target_sleep_hours=5.0,
        bedtime_hour=1,
        blue_light_exposure=True,
        caffeine_after_3pm=True,
        evening_stress_level="high",
    )
    res_bad = calculate_sleep_hygiene_guide(input_bad)
    assert res_bad.sleep_score < 50
    assert len(res_bad.daily_rhythm_tips_vi) > 0


def test_duong_dao_seed_articles_integrity() -> None:
    """Test seed dataset items contain required disclaimers."""
    assert len(DUONG_DAO_SEED_ARTICLES) >= 4
    for article in DUONG_DAO_SEED_ARTICLES:
        assert article["category"] in [
            "SLEEP_HYGIENE",
            "DAILY_RHYTHMS",
            "SEASONAL_WELLNESS",
            "TRADITIONAL_HERITAGE",
        ]
        assert MANDATORY_DISCLAIMER in article["educational_disclaimer_vi"]


def test_duong_dao_api_endpoints() -> None:
    """Test API endpoints /api/v1/duong-dao/articles and /sleep-guide."""
    # Sleep Guide Endpoint
    payload = {
        "target_sleep_hours": 7.5,
        "bedtime_hour": 23,
        "blue_light_exposure": True,
        "caffeine_after_3pm": False,
        "evening_stress_level": "medium",
    }
    res_guide = client.post("/api/v1/duong-dao/sleep-guide", json=payload)
    assert res_guide.status_code == status.HTTP_200_OK
    data_guide = res_guide.json()
    assert "sleep_score" in data_guide
    assert "educational_disclaimer_vi" in data_guide
