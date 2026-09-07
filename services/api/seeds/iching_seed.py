import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.iching import IChingHexagram

logger = logging.getLogger(__name__)

ICHING_SEED_CATALOG: list[dict[str, Any]] = [
    {
        "hexagram_number": 1,
        "binary_code": "111111",
        "name_vi": "Quẻ 1: Thuần Càn (Bát Thuần Càn)",
        "name_en": "Hexagram 1: The Creative (Qian)",
        "pinyin_name": "Qian",
        "upper_trigram": "Càn (Trời)",
        "lower_trigram": "Càn (Trời)",
        "judgement_vi": (
            "Thoán Từ: Càn Nguyên Hanh Lợi Trinh. "
            "Biểu tượng cho sức mạnh khởi tạo, ý chí kiên định và hành động duy lý. "
            "Kinh Dịch nhắc nhở: Sức mạnh thật sự đến từ sự tự cường liên tục "
            "kết hợp với đức tính khiêm nhường."
        ),
        "image_vi": (
            "Tượng Dịch: Thiên hành kiện, quân tử dĩ tự cường bất tức. "
            "(Trời vận chuyển mạnh mẽ, người quân tử "
            "phải tự lực tự cường không ngừng nghỉ)."
        ),
        "lines_interpretation_vi": {
            "1": (
                "Hào 1 (Tiềm Long Vật Dụng): Rồng ẩn mình chưa nên hành động. "
                "Cần tích lũy nội lực."
            ),
            "2": (
                "Hào 2 (Kiến Long Tại Điền): Rồng xuất hiện ở đồng bằng. "
                "Tìm kiếm sự hợp tác đúng đắn."
            ),
            "3": (
                "Hào 3 (Quân Tử Chung Nhật Càn Càn): Thận trọng học hỏi ngày đêm, "
                "giữ gìn nguyên tắc."
            ),
            "4": "Hào 4 (Hoặc Khiêu Tại Uyên): Cân nhắc thời cơ tiến lùi linh hoạt.",
            "5": (
                "Hào 5 (Phi Long Tại Thiên): Rồng bay trên trời. "
                "Thời điểm phát huy tài năng và sự ảnh hưởng."
            ),
            "6": (
                "Hào 6 (Kháng Long Hữu Hối): Rồng lên quá cao sẽ có hối hận. "
                "Tránh kiêu ngạo quá đà."
            ),
        },
        "wisdom_reflection_vi": (
            "Bạn đang ở giai đoạn nào trong hành trình tích lũy nội lực "
            "hay phát huy năng lực?"
        ),
    },
    {
        "hexagram_number": 2,
        "binary_code": "000000",
        "name_vi": "Quẻ 2: Thuần Khôn (Bát Thuần Khôn)",
        "name_en": "Hexagram 2: The Receptive (Kun)",
        "pinyin_name": "Kun",
        "upper_trigram": "Khôn (Đất)",
        "lower_trigram": "Khôn (Đất)",
        "judgement_vi": (
            "Thoán Từ: Khôn Nguyên Hanh, Lợi Mã Trinh. "
            "Biểu tượng của sự bao dung, lắng nghe, tiếp nhận và kiên nhẫn nuôi dưỡng. "
            "Sức mạnh của Đất là sự điềm tĩnh và dẻo dai thích ứng."
        ),
        "image_vi": (
            "Tượng Dịch: Địa thế khôn, quân tử dĩ hậu đức tải vật. "
            "(Đất dày nâng đỡ vạn vật, người quân tử "
            "lấy đức dày để dung chứa muôn người)."
        ),
        "lines_interpretation_vi": {
            "1": (
                "Hào 1 (Lý Sương Cập Băng Chí): Đi trên sương sương kết thành băng. "
                "Cần nhận diện dấu hiệu sớm."
            ),
            "2": (
                "Hào 2 (Trực Phương Đại): Thẳng thắn, vuông vắn, rộng lớn. "
                "Giữ sự chân thật tự nhiên."
            ),
            "3": (
                "Hào 3 (Hàm Chương Khả Trinh): Giấu vẻ đẹp bên trong, "
                "làm tốt công việc không cần phô trương."
            ),
            "4": (
                "Hào 4 (Quát Nang Vô Cữu Vô Dự): Kín kẽ như buộc miệng túi. "
                "Tránh thị phi."
            ),
            "5": (
                "Hào 5 (Hoàng Thường Nguyên Cát): Xiêm áo màu vàng. "
                "Sự khiêm tốn mang lại bình an."
            ),
            "6": (
                "Hào 6 (Long Chiến Vu Dã): Rồng đánh nhau ở đồng bãi. "
                "Tránh xung đột tư tưởng quá đà."
            ),
        },
        "wisdom_reflection_vi": (
            "Góc nhìn nào đòi hỏi bạn phải lắng nghe và bao dung "
            "thay vì tranh chấp hơn thua?"
        ),
    },
    {
        "hexagram_number": 11,
        "binary_code": "111000",
        "name_vi": "Quẻ 11: Địa Thiên Thái",
        "name_en": "Hexagram 11: Peace (Tai)",
        "pinyin_name": "Tai",
        "upper_trigram": "Khôn (Đất)",
        "lower_trigram": "Càn (Trời)",
        "judgement_vi": (
            "Thoán Từ: Thái, Tiểu Lai Đại Vãng, Cát Hanh. "
            "Trời ở dưới Đất ở trên, khí âm dương giao hòa. "
            "Biểu thị sự thông suốt, hòa hợp giữa các luồng ý kiến và nguồn lực."
        ),
        "image_vi": (
            "Tượng Dịch: Thiên địa giao Thái, hậu dĩ tài thành thiên địa chi đạo. "
            "(Trời đất giao hòa tạo thành thời Thái, quân tử cân bằng trật tự)."
        ),
        "lines_interpretation_vi": {
            "1": "Hào 1: Nhổ cỏ tranh kéo theo cả rễ. Đồng tâm hiệp lực tiến bước.",
            "2": "Hào 2: Bao dung sự thô giáp, dùng sự chân thành kết nối.",
            "3": (
                "Hào 3: Không có bằng phẳng nào mà không có độ dốc. "
                "Chuẩn bị tâm lý thích ứng."
            ),
            "4": "Hào 4: Bay lượn không cậy giàu sang, chân thành giao tiếp.",
            "5": "Hào 5: Đế Ất gả con gái, sự nhún nhường đem lại kết quả tốt.",
            "6": (
                "Hào 6: Thành đổ xuống hào, thời vận chuyển biến "
                "cần phòng thủ cẩn trọng."
            ),
        },
        "wisdom_reflection_vi": (
            "Bạn có đang tận dụng thời điểm thuận lợi "
            "để xây dựng sự hòa hợp bền vững không?"
        ),
    },
    {
        "hexagram_number": 12,
        "binary_code": "000111",
        "name_vi": "Quẻ 12: Thiên Địa Bĩ",
        "name_en": "Hexagram 12: Standstill (Pi)",
        "pinyin_name": "Pi",
        "upper_trigram": "Càn (Trời)",
        "lower_trigram": "Khôn (Đất)",
        "judgement_vi": (
            "Thoán Từ: Bĩ chi dĩ nhân, bất lợi quân tử trinh. "
            "Trời bốc lên cao, Đất chìm xuống thấp, khí không giao nhau gây ngưng trệ. "
            "Cần giữ vững nguyên tắc và không hành động nôn nóng."
        ),
        "image_vi": (
            "Tượng Dịch: Thiên địa bất giao Bĩ, quân tử dĩ kiệm đức bích nạn. "
            "(Trời đất không giao hòa là thời Bĩ, người quân tử giữ đức kiệm "
            "ẩn mình né tránh tai họa)."
        ),
        "lines_interpretation_vi": {
            "1": "Hào 1: Nhổ cỏ tranh cả rễ, kiên trì giữ vững lập trường.",
            "2": "Hào 2: Khéo léo nhẫn nại, không du nhập vào sự hỗn loạn.",
            "3": "Hào 3: Thấy điều thẹn thùng, nhận ra sai lầm để điều chỉnh.",
            "4": "Hào 4: Có mệnh lệnh hành động, làm việc minh bạch.",
            "5": "Hào 5: Bĩ sắp hết, buộc vào cây dâu vương vững vàng.",
            "6": "Hào 6: Thời Bĩ nghiêng đổ, bế tắc qua đi bình an tới.",
        },
        "wisdom_reflection_vi": (
            "Trong thời điểm bế tắc, thái độ nhẫn nại và giữ vững nguyên tắc "
            "có giá trị như thế nào?"
        ),
    },
    {
        "hexagram_number": 63,
        "binary_code": "101010",
        "name_vi": "Quẻ 63: Thủy Hỏa Ký Tế",
        "name_en": "Hexagram 63: After Completion (Ji Ji)",
        "pinyin_name": "Ji Ji",
        "upper_trigram": "Khảm (Nước)",
        "lower_trigram": "Ly (Lửa)",
        "judgement_vi": (
            "Thoán Từ: Ký Tế Hanh Tiểu, Lợi Trinh, Sơ Cát Chung Loạn. "
            "Nước ở trên Lửa ở dưới, công việc đã hoàn thành ngăn nắp. "
            "Cảnh báo: Ban đầu tốt đẹp nhưng nếu lơ là phòng bị "
            "thì kết cục sẽ hỗn loạn."
        ),
        "image_vi": (
            "Tượng Dịch: Thủy tại hỏa thượng Ký Tế, quân tử dĩ tư hại "
            "nhi dự phòng chi. "
            "(Nước trên lửa là Ký Tế, người quân tử suy tính tai hại "
            "để lo phòng ngừa)."
        ),
        "lines_interpretation_vi": {
            "1": "Hào 1: Kéo phanh xe, ướt đuôi, giữ sự cẩn trọng ban đầu.",
            "2": "Hào 2: Mất bức rèm tạ, không cần đuổi theo 7 ngày sẽ tự về.",
            "3": "Hào 3: Cao Tông đánh quỷ phương, phải mất 3 năm kiên trì.",
            "4": "Hào 4: Áo quần có chỗ rách phải chắp vá ngay.",
            "5": (
                "Hào 5: Hàng xóm phía Đông mổ bò không bằng "
                "hàng xóm phía Tây cúng lễ nhỏ mà chân thành."
            ),
            "6": "Hào 6: Ướt đầu, đi qua nước mà không cẩn thận sẽ nguy hiểm.",
        },
        "wisdom_reflection_vi": (
            "Sau khi hoàn thành mục tiêu, bạn có đang duy trì sự tỉnh giác "
            "để tránh lơ là không?"
        ),
    },
    {
        "hexagram_number": 64,
        "binary_code": "010101",
        "name_vi": "Quẻ 64: Hỏa Thủy Vị Tế",
        "name_en": "Hexagram 64: Before Completion (Wei Ji)",
        "pinyin_name": "Wei Ji",
        "upper_trigram": "Ly (Lửa)",
        "lower_trigram": "Khảm (Nước)",
        "judgement_vi": (
            "Thoán Từ: Vị Tế Hanh, Tiểu Cáo Nhuệ Ước. "
            "Lửa ở trên Nước ở dưới, mọi thứ chưa xong xuôi hoàn toàn. "
            "Mở ra tiềm năng mới và đòi hỏi sự cẩn trọng ở bước cuối cùng."
        ),
        "image_vi": (
            "Tượng Dịch: Hỏa tại thủy thượng Vị Tế, quân tử dĩ thận biện vật "
            "cư phương. "
            "(Lửa trên nước là Vị Tế, người quân tử thận trọng "
            "phân biệt vạn vật ở đúng vị trí)."
        ),
        "lines_interpretation_vi": {
            "1": "Hào 1: Ướt đuôi, hành động hấp tấp chưa đúng thời.",
            "2": "Hào 2: Hãm phanh xe, giữ sự điềm tĩnh chờ thời cơ.",
            "3": "Hào 3: Chưa xong mà tiến thì nguy hiểm, cần người hỗ trợ.",
            "4": "Hào 4: Kiên trì chính đáng mang lại kết quả tốt.",
            "5": "Hào 5: Thắng lợi rực rỡ, niềm tin được củng cố.",
            "6": "Hào 6: Uống rượu tin tưởng nhưng không lơ là giữ mình.",
        },
        "wisdom_reflection_vi": (
            "Bước đi cuối cùng nào đòi hỏi bạn phải hết sức tỉ mỉ và cẩn trọng?"
        ),
    },
]


async def seed_iching_hexagrams(db: AsyncSession) -> int:
    """Seed initial I Ching Hexagram catalog into database if missing."""
    seeded_count = 0

    for item in ICHING_SEED_CATALOG:
        stmt = select(IChingHexagram).where(
            IChingHexagram.hexagram_number == item["hexagram_number"]
        )
        result = await db.execute(stmt)
        existing = result.scalar_one_or_none()

        if existing is None:
            hexagram = IChingHexagram(**item)
            db.add(hexagram)
            seeded_count += 1

    if seeded_count > 0:
        await db.commit()
        logger.info(f"Seeded {seeded_count} I Ching Hexagrams into catalog.")

    return seeded_count
