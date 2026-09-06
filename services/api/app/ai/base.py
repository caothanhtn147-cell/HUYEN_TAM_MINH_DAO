from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator

from app.ai.schemas import AICompletionRequest, AICompletionResponse


class BaseAIProvider(ABC):
    """Abstract base class interface for provider-agnostic LLM adapters."""

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return unique provider identifier (e.g. 'mock', 'openai')."""
        pass

    @abstractmethod
    async def generate_completion(
        self, request: AICompletionRequest
    ) -> AICompletionResponse:
        """Generate a complete text or structured response for a completion request."""
        pass

    @abstractmethod
    def generate_stream(
        self, request: AICompletionRequest
    ) -> AsyncGenerator[str, None]:
        """Stream token text chunks asynchronously for a completion request."""
        pass
