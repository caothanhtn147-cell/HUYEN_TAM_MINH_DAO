import logging
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.reflection_journal import (
    ConsultationHistoryItemResponse,
    JournalEntryCreate,
    JournalEntryResponse,
    JournalEntryUpdate,
)
from app.services.reflection_service import (
    create_journal_entry,
    delete_journal_entry,
    get_journal_entry_by_id,
    get_user_consultation_history,
    get_user_journal_entries,
    update_journal_entry,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/journal", tags=["Self-Reflection Journal & History"])


@router.post(
    "/entries",
    response_model=JournalEntryResponse,
    summary="Tạo nhật ký tự soi chiếu mới",
    status_code=status.HTTP_201_CREATED,
)
async def create_entry(
    data: JournalEntryCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> JournalEntryResponse:
    """Create a new self-reflection journal entry for authenticated user."""
    try:
        entry = await create_journal_entry(db, current_user.id, data)
        return JournalEntryResponse.model_validate(entry)
    except Exception as err:
        logger.error(f"Error creating journal entry: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể tạo nhật ký soi chiếu.",
        ) from err


@router.get(
    "/entries",
    response_model=list[JournalEntryResponse],
    summary="Danh sách nhật ký tự soi chiếu của người dùng",
    status_code=status.HTTP_200_OK,
)
async def list_entries(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    source_module: Annotated[
        str | None, Query(description="Lọc theo mô-đun nguồn (minh_kien, tarot...)")
    ] = None,
) -> list[JournalEntryResponse]:
    """List all self-reflection journal entries for authenticated user."""
    try:
        entries = await get_user_journal_entries(
            db, current_user.id, source_module=source_module
        )
        return [JournalEntryResponse.model_validate(e) for e in entries]
    except Exception as err:
        logger.error(f"Error listing journal entries: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể lấy danh sách nhật ký.",
        ) from err


@router.get(
    "/entries/{entry_id}",
    response_model=JournalEntryResponse,
    summary="Chi tiết nhật ký theo ID",
    status_code=status.HTTP_200_OK,
)
async def get_entry(
    entry_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> JournalEntryResponse:
    """Retrieve single journal entry detail by ID."""
    entry = await get_journal_entry_by_id(db, current_user.id, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhật ký không tồn tại.",
        )
    return JournalEntryResponse.model_validate(entry)


@router.put(
    "/entries/{entry_id}",
    response_model=JournalEntryResponse,
    summary="Cập nhật nhật ký tự soi chiếu",
    status_code=status.HTTP_200_OK,
)
async def update_entry(
    entry_id: uuid.UUID,
    data: JournalEntryUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> JournalEntryResponse:
    """Update existing journal entry by ID."""
    entry = await update_journal_entry(db, current_user.id, entry_id, data)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhật ký không tồn tại.",
        )
    return JournalEntryResponse.model_validate(entry)


@router.delete(
    "/entries/{entry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa nhật ký tự soi chiếu",
)
async def delete_entry(
    entry_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> None:
    """Delete journal entry by ID."""
    success = await delete_journal_entry(db, current_user.id, entry_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nhật ký không tồn tại.",
        )


@router.get(
    "/consultation-history",
    response_model=list[ConsultationHistoryItemResponse],
    summary="Lịch sử chiêm nghiệm & tư vấn tổng hợp",
    status_code=status.HTTP_200_OK,
)
async def list_consultation_history(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[ConsultationHistoryItemResponse]:
    """Retrieve aggregated timeline history across all modules."""
    try:
        history = await get_user_consultation_history(db, current_user.id)
        return history
    except Exception as err:
        logger.error(f"Error fetching consultation history: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể lấy lịch sử chiêm nghiệm.",
        ) from err
