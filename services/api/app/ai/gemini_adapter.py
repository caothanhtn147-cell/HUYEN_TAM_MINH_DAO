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


class GeminiAdapter(BaseAIProvider):
    """Google Gemini API Provider Adapter for Gemini 1.5 Pro / Flash models."""

    def __init__(
        self,
        api_key: str | None = None,
        default_model: str = "gemini-1.5-flash",
        http_client: httpx.AsyncClient | None = None,
    ) -> None:
        settings = get_settings()
        self.api_key = api_key if api_key is not None else settings.GEMINI_API_KEY
        self.default_model = default_model
        self.http_client = http_client

    @property
    def provider_name(self) -> str:
        return "gemini"

    def _get_api_url(self, model: str, stream: bool = False) -> str:
        if not self.api_key:
            raise ValueError("Gemini API key is missing or not configured.")
        action = "streamGenerateContent" if stream else "generateContent"
        return f"https://generativelanguage.googleapis.com/v1beta/models/{model}:{action}?key={self.api_key}"

    def _build_payload(self, request: AICompletionRequest) -> dict[str, Any]:
        contents: list[dict[str, Any]] = []

        for msg in request.messages:
            role = "model" if msg.role == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": msg.content}]})

        generation_config: dict[str, Any] = {
            "temperature": request.temperature,
        }
        if request.max_tokens is not None:
            generation_config["maxOutputTokens"] = request.max_tokens

        payload: dict[str, Any] = {
            "contents": contents,
            "generationConfig": generation_config,
        }

        if request.system_prompt:
            payload["systemInstruction"] = {"parts": [{"text": request.system_prompt}]}

        if request.extra_params:
            payload.update(request.extra_params)

        return payload

    def _calculate_usage(
        self, usage_metadata: dict[str, Any] | None, model: str
    ) -> AIUsage:
        if not usage_metadata:
            return AIUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost_usd=0.0,
            )

        prompt_tokens = usage_metadata.get("promptTokenCount", 0)
        completion_tokens = usage_metadata.get("candidatesTokenCount", 0)
        total_tokens = usage_metadata.get(
            "totalTokenCount", prompt_tokens + completion_tokens
        )

        if "flash" in model:
            cost = (prompt_tokens * 0.000075 / 1000) + (
                completion_tokens * 0.0003 / 1000
            )
        elif "pro" in model:
            cost = (prompt_tokens * 0.00125 / 1000) + (completion_tokens * 0.005 / 1000)
        else:
            cost = (prompt_tokens * 0.0005 / 1000) + (completion_tokens * 0.0015 / 1000)

        return AIUsage(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            estimated_cost_usd=round(cost, 6),
        )

    async def generate_completion(
        self, request: AICompletionRequest
    ) -> AICompletionResponse:
        model = request.model or self.default_model
        api_url = self._get_api_url(model, stream=False)
        payload = self._build_payload(request)

        client_provided = self.http_client is not None
        client = self.http_client or httpx.AsyncClient(timeout=30.0)

        try:
            response = await client.post(
                api_url, headers={"Content-Type": "application/json"}, json=payload
            )
            response.raise_for_status()
            data = response.json()

            candidates = data.get("candidates", [])
            content = ""
            finish_reason = "stop"

            if candidates:
                candidate = candidates[0]
                finish_reason = candidate.get("finishReason", "STOP").lower()
                parts = candidate.get("content", {}).get("parts", [])
                content = "".join(p.get("text", "") for p in parts)

            usage = self._calculate_usage(data.get("usageMetadata"), model)

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
                model=model,
                provider=self.provider_name,
                usage=usage,
                finish_reason=finish_reason,
            )
        except Exception as err:
            logger.error(f"Gemini completion request failed: {err}")
            raise RuntimeError(f"Gemini request failed: {err}") from err
        finally:
            if not client_provided:
                await client.aclose()

    async def generate_stream(
        self, request: AICompletionRequest
    ) -> AsyncGenerator[str, None]:
        model = request.model or self.default_model
        api_url = self._get_api_url(model, stream=True)
        payload = self._build_payload(request)

        client_provided = self.http_client is not None
        client = self.http_client or httpx.AsyncClient(timeout=30.0)

        try:
            async with client.stream(
                "POST",
                api_url,
                headers={"Content-Type": "application/json"},
                json=payload,
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
                            candidates = chunk_data.get("candidates", [])
                            if candidates:
                                parts = (
                                    candidates[0].get("content", {}).get("parts", [])
                                )
                                text_chunk = "".join(p.get("text", "") for p in parts)
                                if text_chunk:
                                    yield text_chunk
                        except Exception:
                            continue
        finally:
            if not client_provided:
                await client.aclose()
