import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tarot import TarotCard

logger = logging.getLogger(__name__)

TAROT_SEED_CATALOG: list[dict[str, Any]] = [
    {
        "card_code": "MAJOR_00_FOOL",
        "name_vi": "0. Kẻ Khờ (The Fool)",
        "name_en": "The Fool",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 0,
        "upright_keywords": ["Khởi đầu mới", "Sự ngây thơ", "Tiềm năng", "Tự do"],
        "reversed_keywords": ["Liều lĩnh", "Sợ hãi thay đổi", "Do dự", "Ngây ngô"],
        "upright_meaning_vi": (
            "Biểu tượng cho bước đi đầu tiên vào hành trình mới. "
            "Tâm lý học xem đây là trạng thái sẵn sàng học hỏi, buông bỏ định kiến "
            "để đón nhận trải nghiệm thực tại với góc nhìn thuần khiết."
        ),
        "reversed_meaning_vi": (
            "Nhắc nhở về sự bốc đồng hoặc nỗi sợ hãi bước ra khỏi vùng an toàn. "
            "Cần phân biệt giữa dũng khí minh triết và sự liều lĩnh thiếu chuẩn bị."
        ),
        "wisdom_reflection_vi": (
            "Bắt đầu mới nào đang chờ đợi bạn, và rào cản tâm lý nào đang ngăn bạn?"
        ),
    },
    {
        "card_code": "MAJOR_01_MAGICIAN",
        "name_vi": "I. Nhà Ảo Thuật (The Magician)",
        "name_en": "The Magician",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 1,
        "upright_keywords": ["Ý chí", "Nguồn lực", "Tập trung", "Hành động"],
        "reversed_keywords": ["Phân tán", "Trì hoãn", "Thiếu tự tin", "Thao túng"],
        "upright_meaning_vi": (
            "Phản chiếu năng lực biến ý tưởng thành hiện thực qua nguồn lực sẵn có. "
            "Bạn đang có đủ công cụ để chủ động giải quyết bài toán hiện tại."
        ),
        "reversed_meaning_vi": (
            "Cảnh báo sự phân tán năng lượng hoặc thiếu niềm tin vào bản thân. "
            "Hãy rà soát lại các nguồn lực thực tế thay vì chờ đợi cơ hội hoàn hảo."
        ),
        "wisdom_reflection_vi": (
            "Nguồn lực hoặc kỹ năng nào bạn đang sở hữu mà chưa tận dụng tối đa?"
        ),
    },
    {
        "card_code": "MAJOR_02_HIGH_PRIESTESS",
        "name_vi": "II. Nữ Tư Tế (The High Priestess)",
        "name_en": "The High Priestess",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 2,
        "upright_keywords": ["Trực giác", "Nội tâm", "Minh triết", "Tĩnh lặng"],
        "reversed_keywords": ["Bỏ qua trực giác", "Nhiễu loạn tâm trí", "Bí mật"],
        "upright_meaning_vi": (
            "Đại diện cho sự lắng nghe tiếng nói nội tâm và quan sát tĩnh lặng. "
            "Câu trả lời nằm ở chiều sâu nhận thức chứ không ở sự ồn ào bên ngoài."
        ),
        "reversed_meaning_vi": (
            "Cho thấy sự xao nhãng khỏi cảm xúc thật hoặc bị chi phối bởi dư luận. "
            "Dành thời gian yên tĩnh để tái kết nối với bản thân."
        ),
        "wisdom_reflection_vi": (
            "Thông điệp nào từ nội tâm mà bạn đang cố tình phớt lờ?"
        ),
    },
    {
        "card_code": "MAJOR_03_EMPRESS",
        "name_vi": "III. Hoàng Hậu (The Empress)",
        "name_en": "The Empress",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 3,
        "upright_keywords": ["Nuôi dưỡng", "Trù phú", "Sáng tạo", "Lòng từ"],
        "reversed_keywords": ["Bỏ mặc bản thân", "Phụ thuộc", "Nghẽn sáng tạo"],
        "upright_meaning_vi": (
            "Biểu tượng của tình yêu thương và chăm sóc bản thân lẫn môi trường. "
            "Khuyến khích nuôi dưỡng các mối quan hệ và dự án bằng sự kiên nhẫn."
        ),
        "reversed_meaning_vi": (
            "Nhắc nhở về việc kiệt sức do cho đi quá nhiều hoặc thiếu tự chăm sóc. "
            "Hãy học cách đặt ranh giới và yêu thương chính mình."
        ),
        "wisdom_reflection_vi": (
            "Bạn cần chăm sóc góc nhỏ nào trong tâm hồn hoặc cuộc sống ngay hôm nay?"
        ),
    },
    {
        "card_code": "MAJOR_04_EMPEROR",
        "name_vi": "IV. Hoàng Đế (The Emperor)",
        "name_en": "The Emperor",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 4,
        "upright_keywords": ["Kỷ luật", "Cấu trúc", "Nguyên tắc", "Trách nhiệm"],
        "reversed_keywords": ["Cứng nhắc", "Kiểm soát quá đà", "Hỗn loạn"],
        "upright_meaning_vi": (
            "Đại diện cho kỷ luật bản thân, tính duy lý và ranh giới lành mạnh. "
            "Sự ổn định đến từ kế hoạch rõ ràng và tinh thần trách nhiệm."
        ),
        "reversed_meaning_vi": (
            "Cảnh báo thái độ cố chấp, độc đoán hoặc thiếu kiểm soát cuộc sống. "
            "Cần cân bằng giữa nguyên tắc và tính linh hoạt thích ứng."
        ),
        "wisdom_reflection_vi": (
            "Khung khổ hoặc kỷ luật nào cần thiết lập lại để mang lại sự an tâm?"
        ),
    },
    {
        "card_code": "MAJOR_05_HIEROPHANT",
        "name_vi": "V. Giáo Hoàng (The Hierophant)",
        "name_en": "The Hierophant",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 5,
        "upright_keywords": [
            "Truyền thống",
            "Học hỏi",
            "Giá trị cốt lõi",
            "Chiêm nghiệm",
        ],
        "reversed_keywords": ["Cố chấp quy chuẩn", "Gia trưởng", "Đổi mới"],
        "upright_meaning_vi": (
            "Gợi mở việc tìm kiếm tri thức từ hệ giá trị minh triết bền vững. "
            "Hướng tới sự thấu hiểu nguyên lý cuộc sống thay vì trào lưu ngắn hạn."
        ),
        "reversed_meaning_vi": (
            "Khuyên bạn hoài nghi lành mạnh đối với những giáo điều không phù hợp."
        ),
        "wisdom_reflection_vi": (
            "Giá trị cốt lõi nào đang định hình mọi quyết định quan trọng của bạn?"
        ),
    },
    {
        "card_code": "MAJOR_06_LOVERS",
        "name_vi": "VI. Tình Nhân (The Lovers)",
        "name_en": "The Lovers",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 6,
        "upright_keywords": ["Lựa chọn", "Hòa hợp", "Đồng điệu", "Giao ước"],
        "reversed_keywords": ["Mâu thuẫn giá trị", "Bất hòa", "Tránh né lựa chọn"],
        "upright_meaning_vi": (
            "Phản chiếu những quyết định quan trọng dựa trên sự chân thật. "
            "Biểu thị sự kết nối sâu sắc khi các bên tôn trọng giá trị của nhau."
        ),
        "reversed_meaning_vi": (
            "Nhấn mạnh sự mâu thuẫn nội tâm giữa mong muốn cá nhân và kỳ vọng."
        ),
        "wisdom_reflection_vi": (
            "Lựa chọn nào thể hiện sự trung thực nhất với giá trị sống của bạn?"
        ),
    },
    {
        "card_code": "MAJOR_07_CHARIOT",
        "name_vi": "VII. Cỗ Xe (The Chariot)",
        "name_en": "The Chariot",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 7,
        "upright_keywords": ["Quyết tâm", "Định hướng", "Vượt thách thức", "Làm chủ"],
        "reversed_keywords": ["Mất phương hướng", "Nóng vội", "Xung đột nội tâm"],
        "upright_meaning_vi": (
            "Tượng trưng cho việc điều hòa luồng suy nghĩ đối lập để tiến lên. "
            "Làm chủ cảm xúc là chìa khóa để vượt qua chướng ngại."
        ),
        "reversed_meaning_vi": (
            "Cảnh báo sự mất kiểm soát hoặc tiêu tốn năng lượng vào tranh chấp."
        ),
        "wisdom_reflection_vi": (
            "Mục tiêu ưu tiên nhất mà bạn cần dồn toàn bộ sự tập trung là gì?"
        ),
    },
    {
        "card_code": "MAJOR_08_STRENGTH",
        "name_vi": "VIII. Sức Mạnh (Strength)",
        "name_en": "Strength",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 8,
        "upright_keywords": ["Sức mạnh mềm", "Kiên nhẫn", "Nhiệt thành", "Chấp nhận"],
        "reversed_keywords": ["Nghi ngờ bản thân", "Nóng giận", "Yếu đuối"],
        "upright_meaning_vi": (
            "Biểu thị sức mạnh của sự thấu hiểu và lòng bao dung thay vì bạo lực. "
            "Làm chủ nỗi sợ bằng sự dịu dàng và kiên định."
        ),
        "reversed_meaning_vi": (
            "Nhắc nhở rằng sự bối rối xuất phát từ nỗi sợ hãi chưa nhận diện."
        ),
        "wisdom_reflection_vi": (
            "Thách thức nào đòi hỏi ứng xử bằng kiên nhẫn thay vì phản ứng gắt?"
        ),
    },
    {
        "card_code": "MAJOR_09_HERMIT",
        "name_vi": "IX. Ẩn Sĩ (The Hermit)",
        "name_en": "The Hermit",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 9,
        "upright_keywords": ["Soi chiếu nội tâm", "Độc lập", "Tìm kiếm sự thật"],
        "reversed_keywords": ["Cô lập tiêu cực", "Cố chấp", "Né tránh thực tại"],
        "upright_meaning_vi": (
            "Khuyên bạn tạm rời xa sự ồn ào để quay về quan sát nội tâm. "
            "Sự tĩnh lặng mang lại câu trả lời sâu sắc."
        ),
        "reversed_meaning_vi": (
            "Cảnh báo việc tự cô lập bản thân quá mức dẫn đến bế tắc."
        ),
        "wisdom_reflection_vi": (
            "Dành 15 phút tĩnh lặng mỗi ngày sẽ giúp bạn nhìn rõ điều gì?"
        ),
    },
    {
        "card_code": "MAJOR_10_WHEEL_OF_FORTUNE",
        "name_vi": "X. Bánh Xe Số Phận (Wheel of Fortune)",
        "name_en": "Wheel of Fortune",
        "arcana": "MAJOR",
        "suit": None,
        "card_number": 10,
        "upright_keywords": ["Biến thiên", "Thích ứng", "Vòng tuần hoàn", "Chấp nhận"],
        "reversed_keywords": ["Káng cự thay đổi", "Bất an", "Cố bám chấp"],
        "upright_meaning_vi": (
            "Gợi nhắc quy luật thăng trầm tự nhiên của vạn vật. "
            "Tâm bình thản trước biến động là chìa khóa thích ứng với hoàn cảnh."
        ),
        "reversed_meaning_vi": (
            "Nhấn mạnh sự mệt mỏi khi cố chống lại những thay đổi tất yếu."
        ),
        "wisdom_reflection_vi": (
            "Điều gì đã qua mà bạn cần học cách buông bỏ để đón nhận điều mới?"
        ),
    },
    {
        "card_code": "CUPS_01_ACE",
        "name_vi": "Ace of Cups (Ách Cốc)",
        "name_en": "Ace of Cups",
        "arcana": "MINOR",
        "suit": "CUPS",
        "card_number": 1,
        "upright_keywords": [
            "Cảm xúc đong đầy",
            "Trái tim rộng mở",
            "Trần ngập lòng từ",
        ],
        "reversed_keywords": [
            "Nén cảm xúc",
            "Tổn thương chưa lành",
            "Đóng cửa trái tim",
        ],
        "upright_meaning_vi": (
            "Đại diện cho sự mở lòng đón nhận tình yêu thương và thấu hiểu. "
            "Nuôi dưỡng lòng trắc ẩn với chính mình và mọi người xung quanh."
        ),
        "reversed_meaning_vi": (
            "Cảnh báo việc kìm nén cảm xúc tiêu cực kéo dài gây kiệt quệ tâm lý."
        ),
        "wisdom_reflection_vi": (
            "Bạn có đang cho phép mình trải nghiệm cảm xúc thật an toàn không?"
        ),
    },
    {
        "card_code": "SWORDS_01_ACE",
        "name_vi": "Ace of Swords (Ách Kiếm)",
        "name_en": "Ace of Swords",
        "arcana": "MINOR",
        "suit": "SWORDS",
        "card_number": 1,
        "upright_keywords": [
            "Minh mẫn",
            "Nhận thức rõ ràng",
            "Sự thật",
            "Tư duy sắc bén",
        ],
        "reversed_keywords": ["Nhiễu loạn suy nghĩ", "Lời nói sát thương", "Hiểu lầm"],
        "upright_meaning_vi": (
            "Biểu thị sự bừng sáng của trí tuệ khi cắt đứt những ngộ nhận. "
            "Nhìn nhận sự việc bằng góc nhìn trung lập và khách quan."
        ),
        "reversed_meaning_vi": (
            "Cảnh báo sự suy nghĩ quá nhiều làm lu mờ sự thật."
        ),
        "wisdom_reflection_vi": (
            "Suy đoán nào đang làm bạn bối rối mà thiếu bằng chứng thực tế?"
        ),
    },
    {
        "card_code": "WANDS_01_ACE",
        "name_vi": "Ace of Wands (Ách Gậy)",
        "name_en": "Ace of Wands",
        "arcana": "MINOR",
        "suit": "WANDS",
        "card_number": 1,
        "upright_keywords": ["Cảm hứng", "Động lực", "Khởi phát năng lượng", "Đam mê"],
        "reversed_keywords": ["Thiếu năng lượng", "Nhiệt huyết ngắn hạn", "Trì hoãn"],
        "upright_meaning_vi": (
            "Tượng trưng cho ngọn lửa đam mê và cảm hứng khởi tạo dự án mới. "
            "Hãy chuyển hóa ý tưởng thành hành động cụ thể."
        ),
        "reversed_meaning_vi": (
            "Gợi ý việc rà soát lại động lực cốt lõi khi cảm thấy chán nản."
        ),
        "wisdom_reflection_vi": (
            "Ý tưởng nào đang thôi thúc bạn nhưng chưa dám bắt tay thực hiện?"
        ),
    },
    {
        "card_code": "PENTACLES_01_ACE",
        "name_vi": "Ace of Pentacles (Ách Tiền)",
        "name_en": "Ace of Pentacles",
        "arcana": "MINOR",
        "suit": "PENTACLES",
        "card_number": 1,
        "upright_keywords": [
            "Cơ hội thực tế",
            "Nền tảng vững chắc",
            "Giá trị vật chất",
        ],
        "reversed_keywords": ["Bỏ lỡ cơ hội", "Đầu cơ rủi ro", "Thiếu thực tế"],
        "upright_meaning_vi": (
            "Đại diện cho cơ hội gieo mầm hạt giống thực tế mang lại giá trị. "
            "Tập trung vào các bước đi thiết thực có thể đo lường."
        ),
        "reversed_meaning_vi": (
            "Nhắc nhở tránh theo đuổi những lời hứa hẹn giàu nhanh thiếu cơ sở."
        ),
        "wisdom_reflection_vi": (
            "Hành động nhỏ vững chắc nào bạn có thể làm ngay hôm nay?"
        ),
    },
]


async def seed_tarot_cards(db: AsyncSession) -> int:
    """Seed initial Tarot card catalog into database if missing."""
    seeded_count = 0

    for item in TAROT_SEED_CATALOG:
        stmt = select(TarotCard).where(TarotCard.card_code == item["card_code"])
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing is None:
            card = TarotCard(**item)
            db.add(card)
            seeded_count += 1

    if seeded_count > 0:
        await db.commit()
        logger.info(f"Seeded {seeded_count} Tarot cards into catalog.")

    return seeded_count
