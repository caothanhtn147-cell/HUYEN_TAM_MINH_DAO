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


class OpenAIAdapter(BaseAIProvider):
    """OpenAI API Provider Adapter for GPT-4o and related models."""

    def __init__(
        self,
        api_key: str | None = None,
        default_model: str = "gpt-4o-mini",
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.OPENAI_API_KEY
        self.default_model = default_model
        self.http_client = http_client
        self.api_url = "https://api.openai.com/v1/chat/completions"

    @property
    def provider_name(self) -> str:
        return "openai"

    def _get_headers(self) -> dict[str, str]:
        if not self.api_key:
            raise ValueError("OpenAI API key is missing or not configured.")
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _build_payload(self, request: AICompletionRequest) -> dict[str, Any]:
        model = request.model or self.default_model
        messages: list[dict[str, str]] = []

        if request.system_prompt:
            messages.append({"role": "system", "content": request.system_prompt})

        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": request.temperature,
        }

        if request.max_tokens is not None:
            payload["max_tokens"] = request.max_tokens

        if request.response_format:
            payload["response_format"] = request.response_format

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

        prompt_tokens = usage_data.get("prompt_tokens", 0)
        completion_tokens = usage_data.get("completion_tokens", 0)
        total_tokens = usage_data.get("total_tokens", prompt_tokens + completion_tokens)

        # Pricing per 1,000 tokens
        if "gpt-4o-mini" in model:
            cost = (prompt_tokens * 0.00015 / 1000) + (
                completion_tokens * 0.0006 / 1000
            )
        elif "gpt-4o" in model:
            cost = (prompt_tokens * 0.0025 / 1000) + (completion_tokens * 0.010 / 1000)
        else:
            cost = (prompt_tokens * 0.001 / 1000) + (completion_tokens * 0.002 / 1000)

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

            choice = data["choices"][0]
            content = choice["message"]["content"] or ""
            finish_reason = choice.get("finish_reason", "stop")

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
            logger.error(f"OpenAI completion request failed: {err}")
            raise RuntimeError(f"OpenAI request failed: {err}") from err
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
                    if not line or line.startswith(":") or line == "data: [DONE]":
                        continue
                    if line.startswith("data: "):
                        raw_json = line[6:]
                        try:
                            chunk_data = json.loads(raw_json)
                            delta = chunk_data["choices"][0].get("delta", {})
                            content_chunk = delta.get("content")
                            if content_chunk:
                                yield content_chunk
                        except Exception:
                            continue
        finally:
            if not client_provided:
                await client.aclose()
