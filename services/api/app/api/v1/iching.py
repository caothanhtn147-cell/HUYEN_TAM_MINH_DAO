import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.iching import (
    IChingHexagramSchema,
    IChingTossRequest,
    IChingTossResponse,
)
from app.services.iching_service import (
    get_all_hexagrams,
    get_hexagram_by_number,
    simulate_coin_toss,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/iching", tags=["I Ching Hexagrams"])


@router.get(
    "/hexagrams",
    response_model=list[IChingHexagramSchema],
    status_code=status.HTTP_200_OK,
    summary="List all I Ching hexagrams in catalog",
)
async def list_hexagrams(
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[IChingHexagramSchema]:
    """Retrieve full I Ching 64 Hexagram catalog with philosophical interpretations."""
    hexagrams = await get_all_hexagrams(db)
    return [IChingHexagramSchema.model_validate(h) for h in hexagrams]


@router.get(
    "/hexagrams/{number}",
    response_model=IChingHexagramSchema,
    status_code=status.HTTP_200_OK,
    summary="Retrieve single I Ching hexagram by number (1 to 64)",
)
async def get_hexagram(
    number: int,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> IChingHexagramSchema:
    """Retrieve single I Ching hexagram by hexagram_number (1 to 64)."""
    hexagram = await get_hexagram_by_number(db, number=number)
    if hexagram is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"I Ching hexagram with number {number} not found.",
        )
    return IChingHexagramSchema.model_validate(hexagram)


@router.post(
    "/toss",
    response_model=IChingTossResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate 3-coin 6-toss Kinh Dịch reading",
)
async def toss_coins_endpoint(
    request: IChingTossRequest,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> IChingTossResponse:
    """Simulate 3-coin 6-toss Kinh Dịch reading
    with primary and transformed hexagrams.
    """
    try:
        response = await simulate_coin_toss(db=db, intention=request.intention)
        return response
    except Exception as err:
        logger.error(f"Error executing 3-coin toss reading: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to execute 3-coin toss reading.",
        ) from err
