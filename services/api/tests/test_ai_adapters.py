import json

import httpx
import pytest

from app.ai.anthropic_adapter import AnthropicAdapter
from app.ai.base import BaseAIProvider
from app.ai.gemini_adapter import GeminiAdapter
from app.ai.mock_provider import MockAIProvider
from app.ai.openai_adapter import OpenAIAdapter
from app.ai.router import AIRouter
from app.ai.schemas import AICompletionRequest, AIMessage


@pytest.mark.asyncio
async def test_openai_adapter_completion_success() -> None:
    """Verify OpenAIAdapter sends correct headers/payload and parses response."""

    def mock_handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["Authorization"] == "Bearer test-sk-openai"
        payload = json.loads(request.content.decode("utf-8"))
        assert payload["model"] == "gpt-4o-mini"
        assert payload["messages"][0]["content"] == "Hello OpenAI"

        body = {
            "choices": [
                {
                    "message": {"content": "Hello user, I am GPT-4o."},
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": 12,
                "completion_tokens": 18,
                "total_tokens": 30,
            },
        }
        return httpx.Response(200, json=body)

    transport = httpx.MockTransport(mock_handler)
    client = httpx.AsyncClient(transport=transport)
    adapter = OpenAIAdapter(api_key="test-sk-openai", http_client=client)

    req = AICompletionRequest(
        messages=[AIMessage(role="user", content="Hello OpenAI")],
        model="gpt-4o-mini",
    )
    res = await adapter.generate_completion(req)

    assert res.provider == "openai"
    assert res.model == "gpt-4o-mini"
    assert res.content == "Hello user, I am GPT-4o."
    assert res.usage.prompt_tokens == 12
    assert res.usage.completion_tokens == 18
    assert res.usage.total_tokens == 30
    assert res.usage.estimated_cost_usd > 0


@pytest.mark.asyncio
async def test_openai_adapter_missing_key() -> None:
    """Verify OpenAIAdapter raises ValueError when API key is missing."""
    adapter = OpenAIAdapter(api_key="")
    req = AICompletionRequest(messages=[AIMessage(role="user", content="Hi")])
    with pytest.raises(ValueError, match="OpenAI API key is missing"):
        await adapter.generate_completion(req)


@pytest.mark.asyncio
async def test_openai_adapter_http_error() -> None:
    """Verify OpenAIAdapter raises RuntimeError on HTTP failure."""

    def mock_handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(500, json={"error": "Internal Server Error"})

    transport = httpx.MockTransport(mock_handler)
    client = httpx.AsyncClient(transport=transport)
    adapter = OpenAIAdapter(api_key="test-key", http_client=client)

    req = AICompletionRequest(messages=[AIMessage(role="user", content="Hi")])
    with pytest.raises(RuntimeError, match="OpenAI request failed"):
        await adapter.generate_completion(req)


@pytest.mark.asyncio
async def test_anthropic_adapter_completion_success() -> None:
    """Verify AnthropicAdapter sends correct headers/payload and parses response."""

    def mock_handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["x-api-key"] == "test-sk-anthropic"
        payload = json.loads(request.content.decode("utf-8"))
        assert payload["model"] == "claude-3-5-haiku-20241022"
        assert payload["system"] == "You are a helpful assistant."

        body = {
            "content": [{"type": "text", "text": "Greetings from Claude!"}],
            "stop_reason": "end_turn",
            "usage": {
                "input_tokens": 15,
                "output_tokens": 25,
            },
        }
        return httpx.Response(200, json=body)

    transport = httpx.MockTransport(mock_handler)
    client = httpx.AsyncClient(transport=transport)
    adapter = AnthropicAdapter(api_key="test-sk-anthropic", http_client=client)

    req = AICompletionRequest(
        messages=[AIMessage(role="user", content="Hello Anthropic")],
        system_prompt="You are a helpful assistant.",
    )
    res = await adapter.generate_completion(req)

    assert res.provider == "anthropic"
    assert res.model == "claude-3-5-haiku-20241022"
    assert res.content == "Greetings from Claude!"
    assert res.usage.prompt_tokens == 15
    assert res.usage.completion_tokens == 25
    assert res.usage.total_tokens == 40


@pytest.mark.asyncio
async def test_anthropic_adapter_missing_key() -> None:
    """Verify AnthropicAdapter raises ValueError when API key is missing."""
    adapter = AnthropicAdapter(api_key="")
    req = AICompletionRequest(messages=[AIMessage(role="user", content="Hi")])
    with pytest.raises(ValueError, match="Anthropic API key is missing"):
        await adapter.generate_completion(req)


@pytest.mark.asyncio
async def test_gemini_adapter_completion_success() -> None:
    """Verify GeminiAdapter constructs request URL/payload and parses response."""

    def mock_handler(request: httpx.Request) -> httpx.Response:
        assert "key=test-sk-gemini" in str(request.url)
        payload = json.loads(request.content.decode("utf-8"))
        assert "contents" in payload

        body = {
            "candidates": [
                {
                    "content": {
                        "parts": [{"text": "Hello from Gemini 1.5!"}],
                    },
                    "finishReason": "STOP",
                }
            ],
            "usageMetadata": {
                "promptTokenCount": 20,
                "candidatesTokenCount": 30,
                "totalTokenCount": 50,
            },
        }
        return httpx.Response(200, json=body)

    transport = httpx.MockTransport(mock_handler)
    client = httpx.AsyncClient(transport=transport)
    adapter = GeminiAdapter(api_key="test-sk-gemini", http_client=client)

    req = AICompletionRequest(
        messages=[AIMessage(role="user", content="Hello Gemini")],
        model="gemini-1.5-flash",
    )
    res = await adapter.generate_completion(req)

    assert res.provider == "gemini"
    assert res.model == "gemini-1.5-flash"
    assert res.content == "Hello from Gemini 1.5!"
    assert res.usage.prompt_tokens == 20
    assert res.usage.completion_tokens == 30
    assert res.usage.total_tokens == 50


@pytest.mark.asyncio
async def test_gemini_adapter_missing_key() -> None:
    """Verify GeminiAdapter raises ValueError when API key is missing."""
    adapter = GeminiAdapter(api_key="")
    req = AICompletionRequest(messages=[AIMessage(role="user", content="Hi")])
    with pytest.raises(ValueError, match="Gemini API key is missing"):
        await adapter.generate_completion(req)


@pytest.mark.asyncio
async def test_ai_router_registration_and_fallback() -> None:
    """Verify AIRouter registers providers and automatically falls back on failure."""

    # 1. Failing OpenAI adapter mock
    def failing_openai_handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(500, json={"error": "OpenAI unavailable"})

    openai_client = httpx.AsyncClient(
        transport=httpx.MockTransport(failing_openai_handler)
    )
    openai_adapter = OpenAIAdapter(api_key="key", http_client=openai_client)

    # 2. Functional Mock Provider
    mock_adapter = MockAIProvider()

    router = AIRouter(
        providers=[openai_adapter, mock_adapter], default_provider="openai"
    )

    assert router.registered_providers == ["openai", "mock"]
    assert isinstance(router.get_provider("openai"), BaseAIProvider)

    req = AICompletionRequest(
        messages=[AIMessage(role="user", content="Test fallback failover")]
    )

    # Request primary "openai" with fallback to "mock"
    res = await router.generate_completion(
        req, primary_provider="openai", fallback_providers=["mock"]
    )

    # Output should come from fallback "mock" provider!
    assert res.provider == "mock"
    assert "Thực tế là" in res.content


@pytest.mark.asyncio
async def test_ai_router_all_failed_raises_exception() -> None:
    """Verify AIRouter raises RuntimeError if all candidate providers fail."""

    def failing_handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(503, json={"error": "Service unavailable"})

    client1 = httpx.AsyncClient(transport=httpx.MockTransport(failing_handler))
    openai_adapter = OpenAIAdapter(api_key="key", http_client=client1)

    client2 = httpx.AsyncClient(transport=httpx.MockTransport(failing_handler))
    anthropic_adapter = AnthropicAdapter(api_key="key", http_client=client2)

    router = AIRouter(providers=[openai_adapter, anthropic_adapter])

    req = AICompletionRequest(messages=[AIMessage(role="user", content="Hi")])

    with pytest.raises(RuntimeError, match="All AI provider execution attempts failed"):
        await router.generate_completion(
            req, primary_provider="openai", fallback_providers=["anthropic"]
        )
