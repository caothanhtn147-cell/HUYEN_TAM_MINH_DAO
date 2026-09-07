import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.duong_dao import DuongDaoArticle

logger = logging.getLogger(__name__)

MANDATORY_DISCLAIMER = (
    "CẢNH BÁO BẮT BUỘC: Tất cả nội dung trong mô-đun Dưỡng Đạo chỉ mang tính "
    "giáo dục tri thức văn hóa, y học cổ truyền lịch sử và khoa học nhịp sinh "
    "học đời sống. Nội dung NÓI KHÔNG VỚI CHẨN ĐOÁN VÀ ĐIỀU TRỊ BỆNH LÝ. Khi có "
    "triệu chứng y khoa hoặc rối loạn sức khỏe, "
    "hãy tham khảo ý kiến bác sĩ chuyên khoa."
)

DUONG_DAO_SEED_ARTICLES: list[dict[str, Any]] = [
    {
        "category": "SLEEP_HYGIENE",
        "title_vi": "Vệ Sinh Giấc Ngủ & Tĩnh Tâm Ban Đêm",
        "summary_vi": (
            "Hướng dẫn khoa học nhịp sinh học và thói quen tĩnh tâm ban đêm "
            "giúp cơ thể tái tạo năng lượng tự nhiên."
        ),
        "content_vi": (
            "## 1. Nguyên Lý Vệ Sinh Giấc Ngủ (Sleep Hygiene)\n"
            "Giấc ngủ chất lượng không bắt đầu từ lúc đặt lưng xuống giường, "
            "mà bắt đầu từ cách bạn sinh hoạt buổi tối. "
            "Tắt thiết bị điện tử phát ánh sáng xanh 60 phút trước khi ngủ "
            "giúp não bộ tiết ra Melatonin tự nhiên.\n\n"
            "## 2. Thói Quản Tĩnh Tâm Trước Khi Ngủ\n"
            "- Ngâm chân nước ấm nhẹ nhàng 10-15 phút.\n"
            "- Thở bụng sâu 4-7-8 để giải tỏa căng thẳng thần kinh.\n"
            "- Giữ phòng ngủ tối, mát (20-24 độ C) và yên tĩnh."
        ),
        "historical_context_vi": (
            "Y học cổ truyền Nam Y nhấn mạnh: 'Đêm ngủ dưỡng Âm, ngày hoạt động "
            "dưỡng Dương'. Việc ngủ đúng giờ giúp tạng phủ tự thanh lọc."
        ),
        "educational_disclaimer_vi": MANDATORY_DISCLAIMER,
        "tags": ["Giấc Ngủ", "Vệ Sinh Giấc Ngủ", "Melatonin", "Tĩnh Tâm"],
    },
    {
        "category": "DAILY_RHYTHMS",
        "title_vi": "Nhịp Sinh Học 12 Giờ Tự Nhiên & Đông Y Dưỡng Sinh",
        "summary_vi": (
            "Khám phá sự tương đồng giữa đồng hồ sinh học hiện đại và "
            "thời khí dưỡng sinh 12 canh giờ cổ truyền."
        ),
        "content_vi": (
            "## 1. Nhịp Sinh Học Chu Kỳ 24 Giờ\n"
            "Cơ thể con người được vận hành bởi đồng hồ sinh học trung ương "
            "(Suprachiasmatic Nucleus). "
            "Mỗi khung giờ trong ngày tương ứng với sự hoạt động mạnh mẽ "
            "của từng hệ cơ quan.\n\n"
            "## 2. Các Khung Giờ Vàng Dưỡng Sinh\n"
            "- **5h - 7h (Giờ Mão)**: Khởi động ngày mới, uống nước ấm, nhuận tràng.\n"
            "- **11h - 13h (Giờ Ngọ)**: Chợp mắt 15-20 phút dưỡng tâm khí.\n"
            "- **21h - 23h (Giờ Hợi)**: Thả lỏng toàn bộ cơ thể, chuẩn bị đi ngủ."
        ),
        "historical_context_vi": (
            "Đông y cổ truyền đúc kết quy luật 'Tý Ngọ Lưu Chú', "
            "khuyên người đời sống thuận theo tự nhiên để nuôi dưỡng sức bền."
        ),
        "educational_disclaimer_vi": MANDATORY_DISCLAIMER,
        "tags": ["Nhịp Sinh Học", "Đồng Hồ Sinh Học", "Dưỡng Sinh", "12 Canh Giờ"],
    },
    {
        "category": "SEASONAL_WELLNESS",
        "title_vi": "Dưỡng Sinh Theo 24 Tiết Khí Tự Nhiên",
        "summary_vi": (
            "Biết cách thích ứng lối sống, dinh dưỡng và sinh hoạt "
            "theo sự thay đổi khí hậu 4 mùa."
        ),
        "content_vi": (
            "## 1. Triết Lý Thích Ứng Tiết Khí\n"
            "Tự nhiên có 4 mùa Xuân - Hạ - Thu - Đông và 24 Tiết Khí. "
            "Con người là một tiểu vũ trụ, biết nếp sống theo mùa "
            "giúp duy trì trạng thái cân bằng.\n\n"
            "## 2. Nguyên Tắc 4 Mùa\n"
            "- **Mùa Xuân**: Dưỡng Mộc, mở rộng tâm trí, đi bộ thư thái.\n"
            "- **Mùa Hạ**: Dưỡng Hỏa, giữ tâm bình thản, tránh giận dữ.\n"
            "- **Mùa Thu**: Dưỡng Kim, giữ ấm đường hô hấp, sống chậm lại.\n"
            "- **Mùa Đông**: Dưỡng Thủy, ngủ sớm dậy muộn, cất giữ năng lượng."
        ),
        "historical_context_vi": (
            "Sách Nội Kinh cổ đại ghi nhận: 'Thuận thiên thời, ứng địa lợi' "
            "là chìa khóa duy trì sinh lực bền bỉ."
        ),
        "educational_disclaimer_vi": MANDATORY_DISCLAIMER,
        "tags": ["24 Tiết Khí", "4 Mùa", "Lối Sống Tự Nhiên", "Nội Kinh"],
    },
    {
        "category": "TRADITIONAL_HERITAGE",
        "title_vi": "Triết Lý Nam Dược Trị Nam Nhân — Thầy Thuốc Tuệ Tĩnh",
        "summary_vi": (
            "Tìm hiểu di sản tư tưởng dưỡng sinh và thảo dược dân gian "
            "của Đại thiền sư Tuệ Tĩnh."
        ),
        "content_vi": (
            "## 1. Tư Tưởng 'Nam Dược Trị Nam Nhân'\n"
            "Đại thiền sư Tuệ Tĩnh (thế kỷ 14) là người khởi xướng tư tưởng "
            "dùng cây thuốc Nam và lối sống lành mạnh thích ứng với "
            "thổ nhưỡng khí hậu người Việt.\n\n"
            "## 2. Phương Nhàn Dưỡng Sinh Tuệ Tĩnh\n"
            "'Bế tinh, dưỡng khí, tồn thần / "
            "Thanh tâm, quả dục, thủ chân, luyện hình'. "
            "Đây là 14 chữ vàng tóm lược nghệ thuật làm chủ thân tâm "
            "mà không lệ thuộc vào ngoại vật."
        ),
        "historical_context_vi": (
            "Bộ sách 'Nam Dược Thần Hiệu' và 'Hồng Nghĩa Giác Tư Y Thư' "
            "là kho tàng tri thức y học dân tộc Việt Nam."
        ),
        "educational_disclaimer_vi": MANDATORY_DISCLAIMER,
        "tags": ["Tuệ Tĩnh", "Nam Dược", "Lịch Sử Y Học", "Di Sản Dưỡng Sinh"],
    },
]


async def seed_duong_dao_articles(db: AsyncSession) -> int:
    """Seed initial Dưỡng Đạo educational articles into database if missing."""
    seeded_count = 0

    for item in DUONG_DAO_SEED_ARTICLES:
        stmt = select(DuongDaoArticle).where(
            DuongDaoArticle.title_vi == item["title_vi"]
        )
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if not existing:
            article = DuongDaoArticle(
                category=item["category"],
                title_vi=item["title_vi"],
                summary_vi=item["summary_vi"],
                content_vi=item["content_vi"],
                historical_context_vi=item["historical_context_vi"],
                educational_disclaimer_vi=item["educational_disclaimer_vi"],
                tags=item["tags"],
                is_active=True,
            )
            db.add(article)
            seeded_count += 1

    if seeded_count > 0:
        await db.commit()
        logger.info(f"Seeded {seeded_count} Dưỡng Đạo educational articles.")

    return seeded_count
