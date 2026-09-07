import logging
import random
import uuid
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.iching import IChingHexagram
from app.schemas.iching import (
    CoinTossLine,
    IChingHexagramSchema,
    IChingTossResponse,
)
from seeds.iching_seed import seed_iching_hexagrams

logger = logging.getLogger(__name__)


async def get_all_hexagrams(db: AsyncSession) -> list[IChingHexagram]:
    """Retrieve all I Ching Hexagrams from database (seeds automatically if empty)."""
    stmt = select(IChingHexagram).order_by(IChingHexagram.hexagram_number)
    result = await db.execute(stmt)
    hexagrams = list(result.scalars().all())

    if not hexagrams:
        await seed_iching_hexagrams(db)
        result = await db.execute(stmt)
        hexagrams = list(result.scalars().all())

    return hexagrams


async def get_hexagram_by_number(
    db: AsyncSession, number: int
) -> IChingHexagram | None:
    """Retrieve single I Ching Hexagram by hexagram_number (1 to 64)."""
    stmt = select(IChingHexagram).where(IChingHexagram.hexagram_number == number)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_hexagram_by_binary(
    db: AsyncSession, binary_code: str
) -> IChingHexagram | None:
    """Retrieve single I Ching Hexagram by 6-character binary_code."""
    stmt = select(IChingHexagram).where(IChingHexagram.binary_code == binary_code)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def simulate_coin_toss(
    db: AsyncSession,
    intention: str | None = None,
) -> IChingTossResponse:
    """Simulate 3-coin 6-toss Kinh Dịch reading
    with primary and transformed hexagrams.
    """
    await get_all_hexagrams(db)

    tosses: list[CoinTossLine] = []
    primary_bits: list[str] = []
    transformed_bits: list[str] = []
    changing_line_numbers: list[int] = []

    for line_num in range(1, 7):
        # 3 coins: Heads=2 (Yin), Tails=3 (Yang)
        coins = [random.choice([2, 3]) for _ in range(3)]
        total = sum(coins)

        if total == 6:
            # Old Yin (Thái Âm) -> Changes to Yang (1)
            line_type = "OLD_YIN"
            primary_bit = 0
            is_changing = True
            transformed_bit = 1
            changing_line_numbers.append(line_num)
        elif total == 7:
            # Young Yang (Thiếu Dương) -> Remains Yang (1)
            line_type = "YOUNG_YANG"
            primary_bit = 1
            is_changing = False
            transformed_bit = 1
        elif total == 8:
            # Young Yin (Thiếu Âm) -> Remains Yin (0)
            line_type = "YOUNG_YIN"
            primary_bit = 0
            is_changing = False
            transformed_bit = 0
        else:
            # total == 9: Old Yang (Thái Dương) -> Changes to Yin (0)
            line_type = "OLD_YANG"
            primary_bit = 1
            is_changing = True
            transformed_bit = 0
            changing_line_numbers.append(line_num)

        primary_bits.append(str(primary_bit))
        transformed_bits.append(str(transformed_bit))

        tosses.append(
            CoinTossLine(
                toss_number=line_num,
                coin_values=coins,
                sum_value=total,
                line_type=line_type,
                primary_binary=primary_bit,
                is_changing=is_changing,
                transformed_binary=transformed_bit,
            )
        )

    primary_binary_code = "".join(primary_bits)
    transformed_binary_code = "".join(transformed_bits)

    primary_hex = await get_hexagram_by_binary(db, primary_binary_code)
    if primary_hex is None:
        # Fallback to hexagram 1 if binary code not present in seed subset
        primary_hex = (await get_hexagram_by_number(db, 1)) or (
            await get_all_hexagrams(db)
        )[0]

    transformed_hex = None
    if changing_line_numbers:
        transformed_hex_model = await get_hexagram_by_binary(
            db, transformed_binary_code
        )
        if transformed_hex_model:
            transformed_hex = IChingHexagramSchema.model_validate(transformed_hex_model)

    return IChingTossResponse(
        session_id=uuid.uuid4(),
        tossed_at=datetime.now(UTC),
        intention=intention,
        tosses=tosses,
        primary_hexagram=IChingHexagramSchema.model_validate(primary_hex),
        transformed_hexagram=transformed_hex,
        changing_line_numbers=changing_line_numbers,
    )
