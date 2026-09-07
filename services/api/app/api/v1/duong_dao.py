import logging
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.duong_dao import (
    DuongDaoArticleSchema,
    DuongDaoCategoryEnum,
    SleepHygieneGuideInput,
    SleepHygieneGuideResponse,
)
from app.services.duong_dao_service import (
    calculate_sleep_hygiene_guide,
    get_all_articles,
    get_article_by_id,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/duong-dao", tags=["Dưỡng Đạo & Health Wellness"])


@router.get(
    "/articles",
    response_model=list[DuongDaoArticleSchema],
    summary="Danh sách bài viết giáo dục Dưỡng Đạo & Nhịp sinh học",
    status_code=status.HTTP_200_OK,
)
async def list_articles(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    category: Annotated[
        DuongDaoCategoryEnum | None,
        Query(description="Lọc theo danh mục bài viết Dưỡng Đạo"),
    ] = None,
) -> list[DuongDaoArticleSchema]:
    """Retrieve educational health & wellness articles."""
    try:
        articles = await get_all_articles(db, category=category)
        return [DuongDaoArticleSchema.model_validate(a) for a in articles]
    except Exception as err:
        logger.error(f"Error fetching Dưỡng Đạo articles: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể tải danh sách bài viết Dưỡng Đạo.",
        ) from err


@router.get(
    "/articles/{article_id}",
    response_model=DuongDaoArticleSchema,
    summary="Chi tiết bài viết Dưỡng Đạo theo ID",
    status_code=status.HTTP_200_OK,
)
async def get_article_detail(
    article_id: uuid.UUID,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> DuongDaoArticleSchema:
    """Retrieve detailed educational article by ID."""
    article = await get_article_by_id(db, article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bài viết Dưỡng Đạo không tồn tại.",
        )
    return DuongDaoArticleSchema.model_validate(article)


@router.post(
    "/sleep-guide",
    response_model=SleepHygieneGuideResponse,
    summary="Đánh giá thói quen Vệ sinh Giấc ngủ & Nhịp sinh học",
    status_code=status.HTTP_200_OK,
)
async def get_sleep_hygiene_guide(
    input_data: SleepHygieneGuideInput,
) -> SleepHygieneGuideResponse:
    """Calculate educational sleep hygiene habit recommendations (Non-diagnostic)."""
    try:
        guide = calculate_sleep_hygiene_guide(input_data)
        return guide
    except Exception as err:
        logger.error(f"Error generating sleep hygiene guide: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể tính toán gợi ý vệ sinh giấc ngủ.",
        ) from err
