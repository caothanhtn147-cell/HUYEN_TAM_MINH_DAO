import random
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tarot import TarotCard
from app.schemas.tarot import DrawnCardItem, TarotDrawResponse
from seeds.tarot_seed import seed_tarot_cards


async def get_all_tarot_cards(db: AsyncSession) -> list[TarotCard]:
    """Retrieve all Tarot cards from catalog database (seeds automatically if empty)."""
    stmt = select(TarotCard).order_by(TarotCard.card_number)
    result = await db.execute(stmt)
    cards = list(result.scalars().all())

    if not cards:
        await seed_tarot_cards(db)
        result = await db.execute(stmt)
        cards = list(result.scalars().all())

    return cards


async def get_tarot_card_by_code(db: AsyncSession, card_code: str) -> TarotCard | None:
    """Retrieve single Tarot card by card_code."""
    stmt = select(TarotCard).where(TarotCard.card_code == card_code)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def draw_tarot_cards(
    db: AsyncSession,
    count: int = 1,
    intention: str | None = None,
) -> TarotDrawResponse:
    """Draw random Tarot cards with orientation and psychological mirror reflections."""
    all_cards = await get_all_tarot_cards(db)
    if not all_cards:
        raise ValueError("Tarot card catalog is empty.")

    actual_count = min(count, len(all_cards))
    selected_cards = random.sample(all_cards, actual_count)

    drawn_items: list[DrawnCardItem] = []
    for card in selected_cards:
        is_reversed = random.choice([True, False])
        orientation_str = "Ngược (Reversed)" if is_reversed else "Chuẩn (Upright)"

        keywords = card.reversed_keywords if is_reversed else card.upright_keywords
        meaning = card.reversed_meaning_vi if is_reversed else card.upright_meaning_vi

        drawn_items.append(
            DrawnCardItem(
                card_code=card.card_code,
                name_vi=card.name_vi,
                name_en=card.name_en,
                arcana=card.arcana,
                suit=card.suit,
                is_reversed=is_reversed,
                orientation=orientation_str,
                keywords=keywords,
                meaning_vi=meaning,
                wisdom_reflection_vi=card.wisdom_reflection_vi,
                image_url=card.image_url,
            )
        )

    return TarotDrawResponse(
        draw_id=uuid.uuid4(),
        drawn_at=datetime.now(UTC),
        intention=intention,
        cards=drawn_items,
    )
