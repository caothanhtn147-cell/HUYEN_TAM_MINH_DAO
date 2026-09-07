import uuid
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.db.session import get_db_session
from app.main import create_app
from app.models.iching import IChingHexagram
from app.schemas.iching import IChingTossResponse
from app.services.iching_service import (
    simulate_coin_toss,
)
from seeds.iching_seed import ICHING_SEED_CATALOG


def _create_mock_hexagrams() -> list[IChingHexagram]:
    hexagrams = []
    for item in ICHING_SEED_CATALOG:
        hex_item = IChingHexagram(**item)
        hex_item.id = uuid.uuid4()
        hexagrams.append(hex_item)
    return hexagrams


def test_iching_seed_catalog_integrity() -> None:
    """Verify seed catalog items contain valid hexagram definitions."""
    assert len(ICHING_SEED_CATALOG) >= 5
    for item in ICHING_SEED_CATALOG:
        assert isinstance(item["hexagram_number"], int)
        assert len(item["binary_code"]) == 6
        assert item["name_vi"]
        assert item["judgement_vi"]
        assert item["image_vi"]
        assert len(item["lines_interpretation_vi"]) >= 6
        assert item["wisdom_reflection_vi"]


@pytest.mark.asyncio
async def test_simulate_coin_toss_service() -> None:
    """Verify 3-coin 6-toss simulator calculates primary and transformed hexagrams."""
    mock_db = AsyncMock()
    mock_hexagrams = _create_mock_hexagrams()

    with pytest.MonkeyPatch.context() as mp:

        async def mock_get_all(*args, **kwargs):
            return mock_hexagrams

        async def mock_get_by_binary(db, binary_code):
            for h in mock_hexagrams:
                if h.binary_code == binary_code:
                    return h
            return mock_hexagrams[0]

        async def mock_get_by_number(db, number):
            for h in mock_hexagrams:
                if h.hexagram_number == number:
                    return h
            return mock_hexagrams[0]

        mp.setattr("app.services.iching_service.get_all_hexagrams", mock_get_all)
        mp.setattr(
            "app.services.iching_service.get_hexagram_by_binary", mock_get_by_binary
        )
        mp.setattr(
            "app.services.iching_service.get_hexagram_by_number", mock_get_by_number
        )

        intention = "Tôi nên chọn phương án ứng xử nào trong hợp tác?"
        res = await simulate_coin_toss(mock_db, intention=intention)

        assert isinstance(res, IChingTossResponse)
        assert res.intention == intention
        assert len(res.tosses) == 6

        # Check line toss details
        for i, toss in enumerate(res.tosses, start=1):
            assert toss.toss_number == i
            assert len(toss.coin_values) == 3
            assert all(c in (2, 3) for c in toss.coin_values)
            assert toss.sum_value == sum(toss.coin_values)
            assert toss.line_type in ("OLD_YIN", "YOUNG_YANG", "YOUNG_YIN", "OLD_YANG")

        assert res.primary_hexagram is not None


def test_iching_api_endpoints() -> None:
    """Verify FastAPI iching endpoints list hexagrams and execute coin toss reading."""
    app = create_app()
    mock_db = AsyncMock()
    mock_hexagrams = _create_mock_hexagrams()

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db

    with TestClient(app) as tc:
        with pytest.MonkeyPatch.context() as mp:

            async def mock_get_all(*args, **kwargs):
                return mock_hexagrams

            async def mock_get_by_num(db, number):
                for h in mock_hexagrams:
                    if h.hexagram_number == number:
                        return h
                return None

            async def mock_get_by_bin(db, binary_code):
                for h in mock_hexagrams:
                    if h.binary_code == binary_code:
                        return h
                return mock_hexagrams[0]

            mp.setattr("app.api.v1.iching.get_all_hexagrams", mock_get_all)
            mp.setattr("app.api.v1.iching.get_hexagram_by_number", mock_get_by_num)
            mp.setattr("app.services.iching_service.get_all_hexagrams", mock_get_all)
            mp.setattr(
                "app.services.iching_service.get_hexagram_by_binary", mock_get_by_bin
            )
            mp.setattr(
                "app.services.iching_service.get_hexagram_by_number", mock_get_by_num
            )

            # 1. GET /api/v1/iching/hexagrams
            res1 = tc.get("/api/v1/iching/hexagrams")
            assert res1.status_code == 200
            data1 = res1.json()
            assert isinstance(data1, list)
            assert len(data1) >= 5

            # 2. GET /api/v1/iching/hexagrams/1
            res2 = tc.get("/api/v1/iching/hexagrams/1")
            assert res2.status_code == 200
            data2 = res2.json()
            assert data2["hexagram_number"] == 1
            assert "Thuần Càn" in data2["name_vi"]

            # 3. GET /api/v1/iching/hexagrams/999 -> 404
            res3 = tc.get("/api/v1/iching/hexagrams/999")
            assert res3.status_code == 404

            # 4. POST /api/v1/iching/toss
            toss_payload = {"intention": "Hỏi về quyết định sự nghiệp"}
            res4 = tc.post("/api/v1/iching/toss", json=toss_payload)
            assert res4.status_code == 200
            data4 = res4.json()
            assert data4["intention"] == "Hỏi về quyết định sự nghiệp"
            assert len(data4["tosses"]) == 6
            assert data4["primary_hexagram"] is not None
