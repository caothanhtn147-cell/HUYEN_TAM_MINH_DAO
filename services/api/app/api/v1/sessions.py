import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.consultation import (
    MinhKienConsultationRequest,
    MinhKienConsultationResponse,
)
from app.services.consultation_service import (
    execute_minh_kien_consultation,
    stream_minh_kien_consultation,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/sessions", tags=["Consultation Sessions"])


@router.post(
    "/minh-kien",
    response_model=MinhKienConsultationResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute Minh Kiến consultation session",
)
async def create_minh_kien_session(
    request: MinhKienConsultationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> MinhKienConsultationResponse:
    """Execute Minh Kiến consultation session with credit check and safety review."""
    try:
        response = await execute_minh_kien_consultation(
            db=db, user_id=current_user.id, request=request
        )
        return response
    except ValueError as err:
        err_msg = str(err)
        if "Insufficient Linh Điểm credit balance" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=err_msg,
            ) from err
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=err_msg,
        ) from err
    except Exception as err:
        logger.error(f"Error creating Minh Kiến consultation session: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing consultation session request.",
        ) from err


@router.post(
    "/minh-kien/stream",
    status_code=status.HTTP_200_OK,
    summary="Stream Minh Kiến consultation session via SSE",
)
async def stream_minh_kien_session(
    request: MinhKienConsultationRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> StreamingResponse:
    """Stream token chunks for Minh Kiến consultation session via SSE."""
    return StreamingResponse(
        stream_minh_kien_consultation(db=db, user_id=current_user.id, request=request),
        media_type="text/event-stream",
    )
