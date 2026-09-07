import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.tarot import (
    TarotCardSchema,
    TarotDrawRequest,
    TarotDrawResponse,
)
from app.services.tarot_service import (
    draw_tarot_cards,
    get_all_tarot_cards,
    get_tarot_card_by_code,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/tarot", tags=["Tarot Cards"])


@router.get(
    "/cards",
    response_model=list[TarotCardSchema],
    status_code=status.HTTP_200_OK,
    summary="List all Tarot cards in catalog",
)
async def list_tarot_cards(
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[TarotCardSchema]:
    """Retrieve full Tarot card catalog with psychological mirror interpretations."""
    cards = await get_all_tarot_cards(db)
    return [TarotCardSchema.model_validate(c) for c in cards]


@router.get(
    "/cards/{card_code}",
    response_model=TarotCardSchema,
    status_code=status.HTTP_200_OK,
    summary="Retrieve single Tarot card details by code",
)
async def get_tarot_card(
    card_code: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TarotCardSchema:
    """Retrieve single Tarot card definition by card_code."""
    card = await get_tarot_card_by_code(db, card_code=card_code)
    if card is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tarot card with code '{card_code}' not found.",
        )
    return TarotCardSchema.model_validate(card)


@router.post(
    "/draw",
    response_model=TarotDrawResponse,
    status_code=status.HTTP_200_OK,
    summary="Draw random Tarot cards with psychological mirror interpretations",
)
async def draw_cards_endpoint(
    request: TarotDrawRequest,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TarotDrawResponse:
    """Draw random Tarot cards with psychological mirror reflections."""
    try:
        response = await draw_tarot_cards(
            db=db, count=request.count, intention=request.intention
        )
        return response
    except Exception as err:
        logger.error(f"Error executing Tarot card draw: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to execute Tarot card draw.",
        ) from err
