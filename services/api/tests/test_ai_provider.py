import pytest

from app.ai.base import BaseAIProvider
from app.ai.mock_provider import MockAIProvider
from app.ai.schemas import (
    AICompletionRequest,
    AICompletionResponse,
    AIMessage,
    AIUsage,
    TenPointCompassionateCandor,
)


@pytest.mark.asyncio
async def test_mock_provider_identity_and_instantiation() -> None:
    """Verify MockAIProvider satisfies BaseAIProvider interface contract."""
    provider: BaseAIProvider = MockAIProvider(default_model="test-mock-model")

    assert provider.provider_name == "mock"
    assert isinstance(provider, BaseAIProvider)


@pytest.mark.asyncio
async def test_mock_provider_generate_completion() -> None:
    """Verify MockAIProvider returns structured 10-Point Candor output."""
    provider = MockAIProvider()

    request = AICompletionRequest(
        messages=[
            AIMessage(role="system", content="You are Minh Sư AI."),
            AIMessage(
                role="user",
                content="Tôi cảm thấy lo lắng về định hướng sự nghiệp.",
            ),
        ],
        temperature=0.5,
        model="mock-model-custom",
    )

    response = await provider.generate_completion(request)

    assert isinstance(response, AICompletionResponse)
    assert response.provider == "mock"
    assert response.model == "mock-model-custom"
    assert response.finish_reason == "stop"
    assert len(response.content) > 100

    # Verify structured 10-Point Compassionate Candor payload
    candor = response.structured_candor
    assert isinstance(candor, TenPointCompassionateCandor)
    assert "lo lắng" in candor.user_emotional_state
    assert len(candor.honest_reality) > 0
    assert len(candor.factually_known) > 0
    assert len(candor.uncertainty_and_unknowns) > 0
    assert len(candor.inaction_consequence) > 0
    assert len(candor.perspective_and_wisdom) > 0
    assert len(candor.resolution_path) > 0
    assert (
        "24 giờ" in candor.immediate_action_24h or "24h" in candor.immediate_action_24h
    )
    assert "7 ngày" in candor.short_term_action_7d
    assert len(candor.professional_referral_boundary) > 0

    # Verify usage metrics
    assert isinstance(response.usage, AIUsage)
    assert response.usage.prompt_tokens > 0
    assert response.usage.completion_tokens > 0
    assert response.usage.total_tokens == (
        response.usage.prompt_tokens + response.usage.completion_tokens
    )


@pytest.mark.asyncio
async def test_mock_provider_generate_stream() -> None:
    """Verify MockAIProvider streams token text chunks asynchronously."""
    provider = MockAIProvider()

    request = AICompletionRequest(
        messages=[
            AIMessage(role="user", content="Xin lời khuyên về cuộc sống."),
        ],
    )

    chunks: list[str] = []
    async for chunk in provider.generate_stream(request):
        chunks.append(chunk)

    assert len(chunks) > 5
    full_reconstructed = "".join(chunks).strip()
    assert "**1. Cảm xúc**" in full_reconstructed
    assert "**10. Giới hạn tham vấn**" in full_reconstructed


@pytest.mark.asyncio
async def test_provider_interface_swappability() -> None:
    """Verify polymorphic dependency injection works with BaseAIProvider abstraction."""

    async def _execute_ai_consultation(ai_provider: BaseAIProvider, query: str) -> str:
        req = AICompletionRequest(messages=[AIMessage(role="user", content=query)])
        res = await ai_provider.generate_completion(req)
        return res.content

    mock_adapter: BaseAIProvider = MockAIProvider()
    output = await _execute_ai_consultation(mock_adapter, "Tháo gỡ mâu thuẫn gia đình")

    assert isinstance(output, str)
    assert "Góc nhìn minh triết" in output


def test_ai_schemas_validation() -> None:
    """Verify Pydantic models enforce field types and validation boundaries."""
    msg = AIMessage(role="user", content="Hello AI")
    assert msg.role == "user"
    assert msg.content == "Hello AI"

    req = AICompletionRequest(
        messages=[msg],
        temperature=0.2,
    )
    assert req.temperature == 0.2
    assert req.messages[0].content == "Hello AI"

    usage = AIUsage(prompt_tokens=15, completion_tokens=25, total_tokens=40)
    assert usage.total_tokens == 40
