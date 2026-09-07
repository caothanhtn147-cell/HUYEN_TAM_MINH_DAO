import uuid
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.ai.mock_provider import MockAIProvider
from app.ai.router import AIRouter
from app.ai.schemas import AIMessage
from app.schemas.consultation import (
    MinhKienConsultationRequest,
    MinhKienConsultationResponse,
)
from app.services.consultation_service import (
    execute_minh_kien_consultation,
    stream_minh_kien_consultation,
)


@pytest.mark.asyncio
async def test_execute_consultation_insufficient_credits() -> None:
    """Verify ValueError is raised when user wallet has insufficient credits."""
    mock_db = AsyncMock()
    user_id = uuid.uuid4()

    with pytest.MonkeyPatch.context() as mp:

        async def mock_get_balance(*args, **kwargs):
            return 5  # Less than required 10 credits

        mp.setattr(
            "app.services.consultation_service.get_wallet_balance", mock_get_balance
        )

        req = MinhKienConsultationRequest(
            messages=[AIMessage(role="user", content="Tôi cần lời khuyên.")]
        )

        with pytest.raises(ValueError, match="Insufficient Linh Điểm credit balance"):
            await execute_minh_kien_consultation(mock_db, user_id=user_id, request=req)


@pytest.mark.asyncio
async def test_execute_consultation_success_and_ledger_deduction() -> None:
    """Verify consultation session deducts 10 credits and returns 10-point
    response."""
    mock_db = AsyncMock()
    user_id = uuid.uuid4()

    deducted_calls = []

    with pytest.MonkeyPatch.context() as mp:

        async def mock_get_balance(*args, **kwargs):
            return 50  # Sufficient balance

        async def mock_deduct(*args, **kwargs):
            deducted_calls.append(kwargs)
            return AsyncMock()

        mp.setattr(
            "app.services.consultation_service.get_wallet_balance", mock_get_balance
        )
        mp.setattr("app.services.consultation_service.deduct_credits", mock_deduct)

        router = AIRouter(providers=[MockAIProvider()])
        req = MinhKienConsultationRequest(
            messages=[AIMessage(role="user", content="Tôi bế tắc trong công việc.")],
            provider="mock",
        )

        response = await execute_minh_kien_consultation(
            mock_db, user_id=user_id, request=req, ai_router=router
        )

        assert isinstance(response, MinhKienConsultationResponse)
        assert response.credits_deducted == 10
        assert response.provider == "mock"
        assert response.structured_candor is not None
        assert len(response.content) > 50

        # Verify ledger deduction was executed with correct amount
        assert len(deducted_calls) == 1
        assert deducted_calls[0]["amount"] == 10
        assert deducted_calls[0]["user_id"] == user_id


@pytest.mark.asyncio
async def test_execute_consultation_safety_crisis_trigger() -> None:
    """Verify safety pipeline attaches hotlines when crisis query is submitted."""
    mock_db = AsyncMock()
    user_id = uuid.uuid4()

    with pytest.MonkeyPatch.context() as mp:

        async def mock_get_balance(*args, **kwargs):
            return 100

        async def mock_deduct(*args, **kwargs):
            return AsyncMock()

        mp.setattr(
            "app.services.consultation_service.get_wallet_balance", mock_get_balance
        )
        mp.setattr("app.services.consultation_service.deduct_credits", mock_deduct)

        router = AIRouter(providers=[MockAIProvider()])
        req = MinhKienConsultationRequest(
            messages=[
                AIMessage(role="user", content="Tôi muốn tự tử và kết thúc tất cả.")
            ],
            provider="mock",
        )

        response = await execute_minh_kien_consultation(
            mock_db, user_id=user_id, request=req, ai_router=router
        )

        assert response.safety_action == "EMERGENCY_HOTLINE"
        assert response.hotline_contacts is not None
        assert len(response.hotline_contacts) > 0
        assert "⚠️ **CẢNH BÁO KHỦNG HOẢNG TÂM LÝ" in response.content


@pytest.mark.asyncio
async def test_stream_consultation_session() -> None:
    """Verify streaming consultation yields SSE data chunks."""
    mock_db = AsyncMock()
    user_id = uuid.uuid4()

    with pytest.MonkeyPatch.context() as mp:

        async def mock_get_balance(*args, **kwargs):
            return 100

        async def mock_deduct(*args, **kwargs):
            return AsyncMock()

        mp.setattr(
            "app.services.consultation_service.get_wallet_balance", mock_get_balance
        )
        mp.setattr("app.services.consultation_service.deduct_credits", mock_deduct)

        router = AIRouter(providers=[MockAIProvider()])
        req = MinhKienConsultationRequest(
            messages=[AIMessage(role="user", content="Xin quẻ Minh Kiến.")],
            provider="mock",
        )

        chunks: list[str] = []
        async for chunk in stream_minh_kien_consultation(
            mock_db, user_id=user_id, request=req, ai_router=router
        ):
            chunks.append(chunk)

        assert len(chunks) > 5
        full_stream = "".join(chunks)
        assert "data: {" in full_stream
        assert '"done": true' in full_stream


def test_session_endpoints_unauthorized(client: TestClient) -> None:
    """Verify HTTP 401 Unauthorized for unauthenticated session endpoint access."""
    payload = {
        "messages": [{"role": "user", "content": "Hello"}],
    }
    res1 = client.post("/api/v1/sessions/minh-kien", json=payload)
    assert res1.status_code == 401

    res2 = client.post("/api/v1/sessions/minh-kien/stream", json=payload)
    assert res2.status_code == 401
