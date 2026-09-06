import asyncio
from collections.abc import AsyncGenerator

from app.ai.base import BaseAIProvider
from app.ai.schemas import (
    AICompletionRequest,
    AICompletionResponse,
    AIUsage,
    TenPointCompassionateCandor,
)


class MockAIProvider(BaseAIProvider):
    """Mock AI Provider for keyless local testing and CI/CD validation."""

    def __init__(self, default_model: str = "mock-minh-su-v1") -> None:
        self._default_model = default_model

    @property
    def provider_name(self) -> str:
        """Return unique provider identifier."""
        return "mock"

    async def generate_completion(
        self, request: AICompletionRequest
    ) -> AICompletionResponse:
        """Generate mock completion adhering to 10-Point Compassionate Candor."""
        model_name = request.model or self._default_model

        # Extract last user query or fallback
        user_query = "bạn đang gặp chuyện gì"
        for msg in reversed(request.messages):
            if msg.role == "user":
                user_query = msg.content
                break

        candor = TenPointCompassionateCandor(
            user_emotional_state=(
                f"Minh Sư AI nhận thấy bạn đang trăn trở về: '{user_query[:50]}'. "
                "Cảm xúc bối rối hoặc lo âu này hoàn toàn dễ hiểu."
            ),
            honest_reality=(
                "Thực tế là không có quẻ bói hay lời sấm truyền nào quyết định "
                "thay bạn. Kết quả hoàn toàn phụ thuộc vào nhận thức và hành "
                "động trực tiếp của bạn."
            ),
            factually_known=(
                "Dữ liệu thực tế ghi nhận: Bạn đang tìm kiếm giải pháp cho bài "
                f"toán '{user_query[:40]}'."
            ),
            uncertainty_and_unknowns=(
                "Tương lai xa chưa định hình và có vô số biến số ngoài tầm kiểm soát "
                "mà không mô hình hay công cụ nào có thể dự đoán chính xác 100%."
            ),
            inaction_consequence=(
                "Nếu tiếp tục trì hoãn và không có sự thay đổi, trạng thái bế tắc "
                "và áp lực hiện tại sẽ tiếp tục kéo dài."
            ),
            perspective_and_wisdom=(
                "Theo triết lý Huyền Tâm Minh Đạo: 'Tâm bình thế giới bình, ý tĩnh "
                "vạn sự an'. Hãy quay về quan sát nội tâm thay vì tìm kiếm giải pháp."
            ),
            resolution_path=(
                "Lộ trình tháo gỡ: 1. Nhận diện góc khuất -> 2. Chấp nhận thực tại -> "
                "3. Lập kế hoạch hành động nhỏ -> 4. Đánh giá và điều chỉnh."
            ),
            immediate_action_24h=(
                "Trong 24 giờ tới: Dành 15 phút yên tĩnh ghi ra giấy 3 việc quan trọng "
                "nhất cần giải quyết và thực hiện ngay việc nhỏ nhất."
            ),
            short_term_action_7d=(
                "Trong 7 ngày tới: Duy trì thói quen quan sát cảm xúc hàng ngày và "
                "không đưa ra quyết định quan trọng khi tâm trạng đang dao động."
            ),
            professional_referral_boundary=(
                "Lưu ý: Minh Sư AI là công cụ chiêm nghiệm tâm lý. Nếu bạn gặp vấn "
                "đề y tế, pháp lý hoặc khủng hoảng tâm lý nghiêm trọng, hãy liên hệ "
                "chuyên gia chuyên môn."
            ),
        )

        content_text = (
            f"**1. Cảm xúc**: {candor.user_emotional_state}\n\n"
            f"**2. Sự thật**: {candor.honest_reality}\n\n"
            f"**3. Dữ liệu thực tế**: {candor.factually_known}\n\n"
            f"**4. Điều chưa biết**: {candor.uncertainty_and_unknowns}\n\n"
            f"**5. Hệ quả trì hoãn**: {candor.inaction_consequence}\n\n"
            f"**6. Góc nhìn minh triết**: {candor.perspective_and_wisdom}\n\n"
            f"**7. Lộ trình giải quyết**: {candor.resolution_path}\n\n"
            f"**8. Hành động 24h**: {candor.immediate_action_24h}\n\n"
            f"**9. Hành động 7 ngày**: {candor.short_term_action_7d}\n\n"
            f"**10. Giới hạn tham vấn**: {candor.professional_referral_boundary}"
        )

        # Calculate mock token usage
        prompt_len = sum(len(m.content) for m in request.messages)
        completion_len = len(content_text)
        prompt_tokens = max(10, prompt_len // 4)
        completion_tokens = max(20, completion_len // 4)

        usage = AIUsage(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            estimated_cost_usd=0.0,
        )

        return AICompletionResponse(
            content=content_text,
            structured_candor=candor,
            model=model_name,
            provider=self.provider_name,
            usage=usage,
            finish_reason="stop",
        )

    async def generate_stream(
        self, request: AICompletionRequest
    ) -> AsyncGenerator[str, None]:
        """Stream token text chunks asynchronously for SSE client testing."""
        completion_resp = await self.generate_completion(request)
        words = completion_resp.content.split(" ")

        for word in words:
            yield word + " "
            await asyncio.sleep(0.01)
