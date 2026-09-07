import logging
from collections.abc import AsyncGenerator

from app.ai.base import BaseAIProvider
from app.ai.mock_provider import MockAIProvider
from app.ai.schemas import AICompletionRequest, AICompletionResponse

logger = logging.getLogger(__name__)


class AIRouter:
    """Multi-Provider AI Router supporting model fallback and failover execution."""

    def __init__(
        self,
        providers: list[BaseAIProvider] | None = None,
        default_provider: str = "mock",
    ) -> None:
        self._providers: dict[str, BaseAIProvider] = {}
        self._default_provider_name = default_provider

        if providers:
            for p in providers:
                self.register_provider(p)
        else:
            # Register MockAIProvider by default for offline/CI resilience
            self.register_provider(MockAIProvider())

    def register_provider(self, provider: BaseAIProvider) -> None:
        """Register an AI provider adapter instance."""
        self._providers[provider.provider_name] = provider
        logger.info(f"Registered AI provider adapter: '{provider.provider_name}'")

    def get_provider(self, name: str) -> BaseAIProvider:
        """Retrieve registered AI provider adapter by name."""
        if name not in self._providers:
            raise KeyError(f"AI provider '{name}' is not registered in AIRouter.")
        return self._providers[name]

    @property
    def registered_providers(self) -> list[str]:
        """Return names of all currently registered AI providers."""
        return list(self._providers.keys())

    async def generate_completion(
        self,
        request: AICompletionRequest,
        primary_provider: str | None = None,
        fallback_providers: list[str] | None = None,
    ) -> AICompletionResponse:
        """Execute completion request with multi-provider fallback failover."""
        target_providers: list[str] = []
        first_choice = primary_provider or self._default_provider_name
        target_providers.append(first_choice)

        if fallback_providers:
            for fb in fallback_providers:
                if fb not in target_providers:
                    target_providers.append(fb)

        errors: list[str] = []

        for provider_name in target_providers:
            if provider_name not in self._providers:
                logger.warning(
                    f"Requested provider '{provider_name}' is not registered; skipping."
                )
                errors.append(f"{provider_name}: Not registered")
                continue

            provider = self._providers[provider_name]
            try:
                logger.info(f"Attempting completion via provider '{provider_name}'")
                response = await provider.generate_completion(request)
                return response
            except Exception as err:
                msg = f"Provider '{provider_name}' failed: {err}"
                logger.warning(msg)
                errors.append(msg)

        failure_summary = " | ".join(errors)
        raise RuntimeError(
            f"All AI provider execution attempts failed. Details: {failure_summary}"
        )

    async def generate_stream(
        self,
        request: AICompletionRequest,
        primary_provider: str | None = None,
        fallback_providers: list[str] | None = None,
    ) -> AsyncGenerator[str, None]:
        """Stream completion text with automatic multi-provider fallback failover."""
        target_providers: list[str] = []
        first_choice = primary_provider or self._default_provider_name
        target_providers.append(first_choice)

        if fallback_providers:
            for fb in fallback_providers:
                if fb not in target_providers:
                    target_providers.append(fb)

        for provider_name in target_providers:
            if provider_name not in self._providers:
                continue

            provider = self._providers[provider_name]
            try:
                async for chunk in provider.generate_stream(request):
                    yield chunk
                return
            except Exception as err:
                logger.warning(
                    f"Streaming failed for provider '{provider_name}': {err}"
                )

        raise RuntimeError("All AI provider streaming attempts failed.")
