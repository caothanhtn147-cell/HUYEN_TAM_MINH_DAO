import json
import logging
import uuid
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.router import AIRouter
from app.ai.safety_reviewer import DualPassSafetyEngine, SafetyAction
from app.ai.schemas import AICompletionRequest
from app.schemas.consultation import (
    MinhKienConsultationRequest,
    MinhKienConsultationResponse,
)
from app.services.ledger_service import deduct_credits, get_wallet_balance

logger = logging.getLogger(__name__)

CONSULTATION_BASE_CREDIT_COST = 10


async def execute_minh_kien_consultation(
    db: AsyncSession,
    user_id: uuid.UUID,
    request: MinhKienConsultationRequest,
    ai_router: AIRouter | None = None,
) -> MinhKienConsultationResponse:
    """Execute Minh Kiến consultation session with balance check and safety review."""
    current_balance = await get_wallet_balance(db, user_id)
    if current_balance < CONSULTATION_BASE_CREDIT_COST:
        raise ValueError(
            f"Insufficient Linh Điểm credit balance. Current: {current_balance}, "
            f"Required: {CONSULTATION_BASE_CREDIT_COST}."
        )

    session_id = uuid.uuid4()
    router = ai_router or AIRouter()

    ai_req = AICompletionRequest(
        messages=request.messages,
        temperature=request.temperature,
        max_tokens=request.max_tokens,
        model=request.model,
        system_prompt=request.system_prompt,
    )

    completion = await router.generate_completion(
        ai_req, primary_provider=request.provider
    )

    # 1. Pre-execution crisis check
    last_user_query = ""
    for msg in reversed(request.messages):
        if msg.role == "user":
            last_user_query = msg.content
            break

    crisis_result = DualPassSafetyEngine.evaluate_pre_execution(last_user_query)

    # 2. AI completion generation
    completion = await router.generate_completion(
        ai_req, primary_provider=request.provider
    )

    # 3. Post-execution boundary review
    safety_review = DualPassSafetyEngine.evaluate_post_execution(completion.content)

    processed_content = completion.content
    safety_action = safety_review.action.value
    hotlines = None

    if crisis_result.is_crisis:
        safety_action = "EMERGENCY_HOTLINE"
        hotlines = crisis_result.hotlines
        processed_content = (
            f"{completion.content}\n\n---\n"
            "⚠️ **CẢNH BÁO KHỦNG HOẢNG TÂM LÝ & HỖ TRỢ KHẨN CẤP**:\n"
            "Nếu bạn hoặc ai đó đang trải qua khủng hoảng tâm lý hoặc "
            "có ý định tự hại, hãy liên hệ ngay tổng đài hỗ trợ 111 hoặc 19009247."
        )
    elif safety_review.action in (SafetyAction.BLOCK, SafetyAction.REWRITE):
        processed_content = safety_review.sanitized_content

    # Deduct Linh Điểm credits upon successful generation & safety review
    await deduct_credits(
        db,
        user_id=user_id,
        amount=CONSULTATION_BASE_CREDIT_COST,
        reference_id=str(session_id),
        idempotency_key=f"session:{session_id}",
    )

    logger.info(
        f"Completed Minh Kiến consultation session {session_id} for user {user_id}. "
        f"Deducted {CONSULTATION_BASE_CREDIT_COST} credits."
    )

    return MinhKienConsultationResponse(
        session_id=session_id,
        content=processed_content,
        structured_candor=completion.structured_candor,
        model=completion.model,
        provider=completion.provider,
        credits_deducted=CONSULTATION_BASE_CREDIT_COST,
        usage=completion.usage,
        safety_action=safety_action,
        hotline_contacts=hotlines,
    )


async def stream_minh_kien_consultation(
    db: AsyncSession,
    user_id: uuid.UUID,
    request: MinhKienConsultationRequest,
    ai_router: AIRouter | None = None,
) -> AsyncGenerator[str, None]:
    """Stream token chunks asynchronously via SSE for Minh Kiến consultation session."""
    current_balance = await get_wallet_balance(db, user_id)
    if current_balance < CONSULTATION_BASE_CREDIT_COST:
        err_event = {
            "error": (
                f"Insufficient Linh Điểm credit balance. Current: {current_balance}, "
                f"Required: {CONSULTATION_BASE_CREDIT_COST}."
            )
        }
        yield f"data: {json.dumps(err_event)}\n\n"
        return

    session_id = uuid.uuid4()
    router = ai_router or AIRouter()

    # Deduct credits upfront for stream reservation
    await deduct_credits(
        db,
        user_id=user_id,
        amount=CONSULTATION_BASE_CREDIT_COST,
        reference_id=str(session_id),
        idempotency_key=f"session_stream:{session_id}",
    )

    ai_req = AICompletionRequest(
        messages=request.messages,
        temperature=request.temperature,
        max_tokens=request.max_tokens,
        model=request.model,
        system_prompt=request.system_prompt,
    )

    async for chunk in router.generate_stream(
        ai_req, primary_provider=request.provider
    ):
        payload = {"chunk": chunk, "session_id": str(session_id)}
        yield f"data: {json.dumps(payload)}\n\n"

    done_event = {"done": True, "session_id": str(session_id)}
    yield f"data: {json.dumps(done_event)}\n\n"
