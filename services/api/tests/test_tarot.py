import uuid
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.db.session import get_db_session
from app.main import create_app
from app.models.tarot import TarotCard
from app.schemas.tarot import TarotDrawResponse
from app.services.tarot_service import (
    draw_tarot_cards,
)
from seeds.tarot_seed import TAROT_SEED_CATALOG


def _create_mock_cards() -> list[TarotCard]:
    cards = []
    for item in TAROT_SEED_CATALOG:
        card = TarotCard(**item)
        card.id = uuid.uuid4()
        cards.append(card)
    return cards


@pytest.mark.asyncio
async def test_tarot_seed_catalog_integrity() -> None:
    """Verify seed catalog items contain psychological mirror interpretations."""
    assert len(TAROT_SEED_CATALOG) >= 15
    for item in TAROT_SEED_CATALOG:
        assert item["card_code"]
        assert item["name_vi"]
        assert item["name_en"]
        assert item["arcana"] in ("MAJOR", "MINOR")
        assert len(item["upright_keywords"]) > 0
        assert len(item["reversed_keywords"]) > 0
        assert len(item["upright_meaning_vi"]) > 20
        assert len(item["reversed_meaning_vi"]) > 20
        assert len(item["wisdom_reflection_vi"]) > 10


@pytest.mark.asyncio
async def test_tarot_service_draw_cards() -> None:
    """Verify draw_tarot_cards returns random orientation and reflections."""
    mock_db = AsyncMock()
    mock_cards = _create_mock_cards()

    with pytest.MonkeyPatch.context() as mp:

        async def mock_get_all(*args, **kwargs):
            return mock_cards

        mp.setattr("app.services.tarot_service.get_all_tarot_cards", mock_get_all)

        intention = "Tôi nên ứng xử ra sao với áp lực công việc?"
        res = await draw_tarot_cards(mock_db, count=3, intention=intention)

        assert isinstance(res, TarotDrawResponse)
        assert res.intention == intention
        assert len(res.cards) == 3

        for drawn in res.cards:
            assert drawn.card_code in [c.card_code for c in mock_cards]
            assert isinstance(drawn.is_reversed, bool)
            assert drawn.orientation in ("Chuẩn (Upright)", "Ngược (Reversed)")
            assert len(drawn.keywords) > 0
            assert len(drawn.meaning_vi) > 0
            assert len(drawn.wisdom_reflection_vi) > 0


def test_tarot_api_endpoints() -> None:
    """Verify FastAPI tarot endpoints return catalog and execute card draw."""
    app = create_app()
    mock_db = AsyncMock()
    mock_cards = _create_mock_cards()

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db_session] = override_get_db

    with TestClient(app) as tc:
        with pytest.MonkeyPatch.context() as mp:

            async def mock_get_all(*args, **kwargs):
                return mock_cards

            async def mock_get_single(db, card_code):
                for c in mock_cards:
                    if c.card_code == card_code:
                        return c
                return None

            mp.setattr("app.api.v1.tarot.get_all_tarot_cards", mock_get_all)
            mp.setattr("app.api.v1.tarot.get_tarot_card_by_code", mock_get_single)

            # 1. GET /api/v1/tarot/cards
            res1 = tc.get("/api/v1/tarot/cards")
            assert res1.status_code == 200
            data1 = res1.json()
            assert isinstance(data1, list)
            assert len(data1) >= 15

            # 2. GET /api/v1/tarot/cards/MAJOR_00_FOOL
            res2 = tc.get("/api/v1/tarot/cards/MAJOR_00_FOOL")
            assert res2.status_code == 200
            data2 = res2.json()
            assert data2["card_code"] == "MAJOR_00_FOOL"
            assert data2["name_vi"] == "0. Kẻ Khờ (The Fool)"

            # 3. GET /api/v1/tarot/cards/UNKNOWN_CODE -> 404
            res3 = tc.get("/api/v1/tarot/cards/UNKNOWN_CODE")
            assert res3.status_code == 404

            # 4. POST /api/v1/tarot/draw
            async def mock_draw_service(db, count, intention):
                return await draw_tarot_cards(db, count=count, intention=intention)

            mp.setattr("app.services.tarot_service.get_all_tarot_cards", mock_get_all)

            draw_payload = {"count": 2, "intention": "Chiêm nghiệm hôm nay"}
            res4 = tc.post("/api/v1/tarot/draw", json=draw_payload)
            assert res4.status_code == 200
            data4 = res4.json()
            assert data4["intention"] == "Chiêm nghiệm hôm nay"
            assert len(data4["cards"]) == 2
