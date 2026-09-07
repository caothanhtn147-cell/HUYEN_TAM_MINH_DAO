import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.astrology import (
    BaTuChartResponse,
    BirthDataInput,
    FullAstrologyAnalysisResponse,
    TuViChartResponse,
)
from app.services.astrology_service import (
    analyze_full_astrology,
    calculate_batu_chart,
    calculate_tuvi_chart,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/astrology", tags=["Astrology & Bát Tự / Tử Vi"])


@router.post(
    "/batu",
    response_model=BaTuChartResponse,
    summary="Tính toán Lá số Bát Tự (Tứ Trụ & Ngũ Hành)",
    status_code=status.HTTP_200_OK,
)
async def get_batu_chart(
    birth_data: BirthDataInput,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> BaTuChartResponse:
    """Calculate 4 Pillars (Năm, Tháng, Ngày, Giờ) and Five Elements balance."""
    try:
        chart = calculate_batu_chart(birth_data)
        return chart
    except Exception as err:
        logger.error(f"Error calculating Bát Tự chart: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể tính toán lá số Bát Tự. Vui lòng kiểm tra ngày giờ sinh.",
        ) from err


@router.post(
    "/tuvi",
    response_model=TuViChartResponse,
    summary="Tính toán Lá số Tử Vi 12 Cung & Biểu tượng Cốt lõi",
    status_code=status.HTTP_200_OK,
)
async def get_tuvi_chart(
    birth_data: BirthDataInput,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TuViChartResponse:
    """Calculate Tử Vi 12 Palaces, Menh/Than placement, and star archetypes."""
    try:
        chart = calculate_tuvi_chart(birth_data)
        return chart
    except Exception as err:
        logger.error(f"Error calculating Tử Vi chart: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể tính toán lá số Tử Vi. Vui lòng kiểm tra ngày giờ sinh.",
        ) from err


@router.post(
    "/full-analysis",
    response_model=FullAstrologyAnalysisResponse,
    summary="Phân tích tổng hợp Bát Tự & Tử Vi tự soi chiếu nhận thức",
    status_code=status.HTTP_200_OK,
)
async def get_full_astrology_analysis(
    birth_data: BirthDataInput,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> FullAstrologyAnalysisResponse:
    """Synthesize Bát Tự and Tử Vi charts into a holistic self-observation reading."""
    try:
        analysis = analyze_full_astrology(birth_data)
        return analysis
    except Exception as err:
        logger.error(f"Error executing full astrology analysis: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể phân tích tổng hợp lá số. Vui lòng thử lại sau.",
        ) from err
