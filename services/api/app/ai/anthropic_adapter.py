import json
import logging
from collections.abc import AsyncGenerator
from typing import Any

import httpx

from app.ai.base import BaseAIProvider
from app.ai.schemas import (
    AICompletionRequest,
    AICompletionResponse,
    AIUsage,
    TenPointCompassionateCandor,
)
from app.config import get_settings

logger = logging.getLogger(__name__)


class AnthropicAdapter(BaseAIProvider):
    """Anthropic API Provider Adapter for Claude 3.5 Sonnet / Haiku models."""

    def __init__(
        self,
        api_key: str | None = None,
        default_model: str = "claude-3-5-haiku-20241022",
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.ANTHROPIC_API_KEY
        self.default_model = default_model
        self.http_client = http_client
        self.api_url = "https://api.anthropic.com/v1/messages"

    @property
    def provider_name(self) -> str:
        return "anthropic"

    def _get_headers(self) -> dict[str, str]:
        if not self.api_key:
            raise ValueError("Anthropic API key is missing or not configured.")
        return {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

    def _build_payload(self, request: AICompletionRequest) -> dict[str, Any]:
        model = request.model or self.default_model
        messages: list[dict[str, str]] = []

        for msg in request.messages:
            # Anthropic expects 'user' or 'assistant'
            role = "user" if msg.role not in ("user", "assistant") else msg.role
            messages.append({"role": role, "content": msg.content})

        max_tokens = request.max_tokens or 1024

        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": request.temperature,
        }

        if request.system_prompt:
            payload["system"] = request.system_prompt

        if request.extra_params:
            payload.update(request.extra_params)

        return payload

    def _calculate_usage(
        self, usage_data: dict[str, Any] | None, model: str
    ) -> AIUsage:
        if not usage_data:
            return AIUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost_usd=0.0,
            )

        prompt_tokens = usage_data.get("input_tokens", 0)
        completion_tokens = usage_data.get("output_tokens", 0)
        total_tokens = prompt_tokens + completion_tokens

        if "haiku" in model:
            cost = (prompt_tokens * 0.0008 / 1000) + (completion_tokens * 0.004 / 1000)
        elif "sonnet" in model:
            cost = (prompt_tokens * 0.003 / 1000) + (completion_tokens * 0.015 / 1000)
        else:
            cost = (prompt_tokens * 0.003 / 1000) + (completion_tokens * 0.015 / 1000)

        return AIUsage(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            estimated_cost_usd=round(cost, 6),
        )

    async def generate_completion(
        self, request: AICompletionRequest
    ) -> AICompletionResponse:
        headers = self._get_headers()
        payload = self._build_payload(request)

        client_provided = self.http_client is not None
        client = self.http_client or httpx.AsyncClient(timeout=30.0)

        try:
            response = await client.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

            # Extract content from text blocks
            content_blocks = data.get("content", [])
            content_pieces = [
                b.get("text", "") for b in content_blocks if b.get("type") == "text"
            ]
            content = "".join(content_pieces)
            finish_reason = data.get("stop_reason", "end_turn")

            usage = self._calculate_usage(data.get("usage"), payload["model"])

            structured_candor = None
            try:
                candor_data = json.loads(content)
                if isinstance(candor_data, dict):
                    structured_candor = TenPointCompassionateCandor.model_validate(
                        candor_data
                    )
            except Exception:
                pass

            return AICompletionResponse(
                content=content,
                structured_candor=structured_candor,
                model=payload["model"],
                provider=self.provider_name,
                usage=usage,
                finish_reason=finish_reason,
            )
        except Exception as err:
            logger.error(f"Anthropic completion request failed: {err}")
            raise RuntimeError(f"Anthropic request failed: {err}") from err
        finally:
            if not client_provided:
                await client.aclose()

    async def generate_stream(
        self, request: AICompletionRequest
    ) -> AsyncGenerator[str, None]:
        headers = self._get_headers()
        payload = self._build_payload(request)
        payload["stream"] = True

        client_provided = self.http_client is not None
        client = self.http_client or httpx.AsyncClient(timeout=30.0)

        try:
            async with client.stream(
                "POST", self.api_url, headers=headers, json=payload
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    line = line.strip()
                    if not line or not line.startswith("data: "):
                        continue
                    raw_json = line[6:]
                    try:
                        event = json.loads(raw_json)
                        event_type = event.get("type")
                        if event_type == "content_block_delta":
                            delta = event.get("delta", {})
                            if delta.get("type") == "text_delta":
                                text_chunk = delta.get("text")
                                if text_chunk:
                                    yield text_chunk
                    except Exception:
                        continue
        finally:
            if not client_provided:
                await client.aclose()
