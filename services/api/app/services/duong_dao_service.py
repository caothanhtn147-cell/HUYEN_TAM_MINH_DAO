import uuid
from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.duong_dao import DuongDaoArticle
from app.schemas.duong_dao import (
    DuongDaoCategoryEnum,
    SleepHygieneGuideInput,
    SleepHygieneGuideResponse,
)
from seeds.duong_dao_seed import MANDATORY_DISCLAIMER, seed_duong_dao_articles


async def get_all_articles(
    db: AsyncSession, category: DuongDaoCategoryEnum | None = None
) -> Sequence[DuongDaoArticle]:
    """Retrieve active Dưỡng Đạo educational articles."""
    stmt = select(DuongDaoArticle).where(DuongDaoArticle.is_active.is_(True))
    if category:
        stmt = stmt.where(DuongDaoArticle.category == category.value)

    result = await db.execute(stmt)
    articles = result.scalars().all()

    if not articles:
        await seed_duong_dao_articles(db)
        result = await db.execute(stmt)
        articles = result.scalars().all()

    return articles


async def get_article_by_id(
    db: AsyncSession, article_id: uuid.UUID
) -> DuongDaoArticle | None:
    """Retrieve single educational article by ID."""
    stmt = select(DuongDaoArticle).where(
        DuongDaoArticle.id == article_id, DuongDaoArticle.is_active.is_(True)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


def calculate_sleep_hygiene_guide(
    input_data: SleepHygieneGuideInput,
) -> SleepHygieneGuideResponse:
    """Calculate educational sleep hygiene habit score & rhythm recommendations."""
    score = 100

    # Deduct points for unoptimized habits
    if input_data.target_sleep_hours < 6.5 or input_data.target_sleep_hours > 9.5:
        score -= 15

    if input_data.bedtime_hour >= 23 or input_data.bedtime_hour < 4:
        score -= 20

    if input_data.blue_light_exposure:
        score -= 20

    if input_data.caffeine_after_3pm:
        score -= 15

    if input_data.evening_stress_level == "high":
        score -= 20
    elif input_data.evening_stress_level == "medium":
        score -= 10

    score = max(20, min(100, score))

    habit_tips: list[str] = []
    rhythm_tips: list[str] = []

    if input_data.blue_light_exposure:
        habit_tips.append(
            "Tắt điện thoại/máy tính 45-60 phút trước khi ngủ để não tiết "
            "Melatonin tự nhiên."
        )
    else:
        habit_tips.append(
            "Duy trì thói quen không dùng thiết bị điện tử trước khi ngủ rất "
            "tốt cho giấc ngủ sâu."
        )

    if input_data.caffeine_after_3pm:
        habit_tips.append(
            "Tránh caffeine sau 15h để hạn chế sự kích thích hệ thần kinh vào ban đêm."
        )

    if input_data.bedtime_hour >= 23:
        rhythm_tips.append(
            "Tập thói quen ngủ trước 23h (Giờ Hợi) giúp gan và mật có thời gian "
            "tự tái tạo năng lượng."
        )
    else:
        rhythm_tips.append(
            "Đi ngủ trước 23h là khung giờ vàng giúp tạng phủ thư giãn "
            "và phục hồi sinh lực."
        )

    rhythm_tips.append(
        "Tạo thói quen thức dậy cùng một giờ cố định mỗi sáng để "
        "ổn định đồng hồ sinh học."
    )
    habit_tips.append(
        "Thực hành bài tập thở sâu 4-7-8 hoặc ngâm chân nước ấm nhẹ nhàng "
        "giúp hạ nhiệt độ cơ thể trước khi đi ngủ."
    )

    return SleepHygieneGuideResponse(
        sleep_score=score,
        habit_recommendations_vi=habit_tips,
        daily_rhythm_tips_vi=rhythm_tips,
        educational_disclaimer_vi=MANDATORY_DISCLAIMER,
    )
