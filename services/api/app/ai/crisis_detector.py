import re
from enum import StrEnum

from pydantic import BaseModel, Field


class CrisisCategory(StrEnum):
    """Safety crisis classification categories."""

    NONE = "NONE"
    SELF_HARM = "SELF_HARM"
    MEDICAL_EMERGENCY = "MEDICAL_EMERGENCY"
    DOMESTIC_VIOLENCE = "DOMESTIC_VIOLENCE"
    FINANCIAL_RUIN_PANIC = "FINANCIAL_RUIN_PANIC"


class HotlineContact(BaseModel):
    """Emergency contact hotline payload."""

    name: str = Field(..., description="Hotline authority or organization name")
    number: str = Field(..., description="Phone number or emergency code")
    description: str = Field(..., description="Scope of support")


class CrisisDetectionResult(BaseModel):
    """Result payload of pre-execution crisis classification."""

    is_crisis: bool = Field(
        default=False, description="True if acute crisis is detected"
    )
    category: CrisisCategory = Field(
        default=CrisisCategory.NONE, description="Matched crisis category"
    )
    matched_keywords: list[str] = Field(
        default_factory=list, description="Keywords triggering crisis classification"
    )
    emergency_response: str | None = Field(
        default=None, description="Standard emergency redirection response"
    )
    hotlines: list[HotlineContact] = Field(
        default_factory=list, description="Emergency support contact numbers"
    )


CRISIS_HOTLINES: dict[CrisisCategory, list[HotlineContact]] = {
    CrisisCategory.SELF_HARM: [
        HotlineContact(
            name="Cấp cứu Y tế Khẩn cấp (Việt Nam)",
            number="115",
            description="Hỗ trợ y tế & cấp cứu 24/7",
        ),
        HotlineContact(
            name="Tổng đài Quốc gia Bảo vệ Trẻ em & Tâm lý",
            number="111",
            description="Hỗ trợ tư vấn tâm lý & khủng hoảng miễn phí 24/7",
        ),
        HotlineContact(
            name="Đường dây nóng Hỗ trợ Tâm lý Ngày Mới",
            number="1900 599 930",
            description="Tư vấn tâm lý & lắng nghe khủng hoảng",
        ),
    ],
    CrisisCategory.MEDICAL_EMERGENCY: [
        HotlineContact(
            name="Cấp cứu Y tế Khẩn cấp",
            number="115",
            description="Đội ngũ xe cấp cứu & can thiệp y tế khẩn cấp 24/7",
        ),
    ],
    CrisisCategory.DOMESTIC_VIOLENCE: [
        HotlineContact(
            name="Tổng đài Bảo vệ Phụ nữ & Trẻ em (Ngôi nhà Bình Yên)",
            number="1900 969 680",
            description="Hỗ trợ nạn nhân bạo lực gia đình & xâm hại",
        ),
        HotlineContact(
            name="Tổng đài Khẩn cấp Công an",
            number="113",
            description="Can thiệp an ninh & bảo vệ khẩn cấp",
        ),
    ],
    CrisisCategory.FINANCIAL_RUIN_PANIC: [
        HotlineContact(
            name="Đường dây nóng Hỗ trợ Khủng hoảng Tâm lý",
            number="1900 599 930",
            description="Tư vấn lắng nghe & giải tỏa áp lực khủng hoảng",
        ),
        HotlineContact(
            name="Cấp cứu Y tế Khẩn cấp",
            number="115",
            description="Hỗ trợ y tế khi có dấu hiệu kiệt quệ tâm lý",
        ),
    ],
}

# Specific categories evaluated FIRST before general SELF_HARM
CRISIS_PATTERNS: dict[CrisisCategory, list[str]] = {
    CrisisCategory.FINANCIAL_RUIN_PANIC: [
        r"vỡ nợ",
        r"trắng tay",
        r"tất tay hết tiền",
        r"phá sản",
        r"nợ nần",
        r"thua hết tiền",
    ],
    CrisisCategory.DOMESTIC_VIOLENCE: [
        r"bị đánh đập",
        r"bạo lực gia đình",
        r"bị bạo hành",
        r"bạo hành",
        r"đánh đập dã man",
        r"bị nhốt hành hạ",
        r"domestic violence",
        r"physically abused",
        r"physical abuse",
    ],
    CrisisCategory.MEDICAL_EMERGENCY: [
        r"cấp cứu",
        r"đau ngực dữ dội",
        r"co giật",
        r"ngừng thở",
        r"nôn ra máu",
        r"bắt đầu ngất",
        r"uống nhầm thuốc độc",
        r"chest pain",
        r"stop breathing",
        r"seizure",
        r"medical emergency",
    ],
    CrisisCategory.SELF_HARM: [
        r"tự tử",
        r"muốn chết",
        r"kết liễu",
        r"tự hại",
        r"cắt cổ tay",
        r"uống thuốc độc",
        r"nhảy cầu",
        r"không muốn sống nữa",
        r"chết đi cho xong",
        r"suicide",
        r"kill myself",
        r"end my life",
        r"want to die",
        r"self-harm",
    ],
}


def detect_crisis(text: str) -> CrisisDetectionResult:
    """Scan user prompt for acute mental health crisis or emergency triggers."""
    normalized_text = text.lower()

    for category, patterns in CRISIS_PATTERNS.items():
        matched_keywords: list[str] = []
        for pattern in patterns:
            if re.search(pattern, normalized_text, re.IGNORECASE):
                matched_keywords.append(pattern)

        if matched_keywords:
            hotlines = CRISIS_HOTLINES.get(category, [])
            emergency_msg = (
                "Chúng tôi nhận thấy bạn có thể đang trải qua khoảng thời "
                "gian rất khó khăn. Minh Sư AI là công cụ chiêm nghiệm triết "
                "lý và KHÔNG THỂ thay thế cho hỗ trợ y tế hoặc tâm lý chuyên "
                "nghiệp. Xin hãy liên hệ ngay với các đường dây nóng hỗ trợ "
                "khẩn cấp:\n"
                "- Hotline Cấp cứu Y tế: 115\n"
                "- Tổng đài Quốc gia Tư vấn Tâm lý: 111 hoặc 1900 599 930\n\n"
                "English: We care about your safety. Minh Sư AI is a self-reflection "
                "tool and cannot replace professional emergency support. If you are "
                "in distress, please contact emergency services (115 / 111 / 911) "
                "immediately."
            )
            return CrisisDetectionResult(
                is_crisis=True,
                category=category,
                matched_keywords=matched_keywords,
                emergency_response=emergency_msg,
                hotlines=hotlines,
            )

    return CrisisDetectionResult(
        is_crisis=False,
        category=CrisisCategory.NONE,
        matched_keywords=[],
        emergency_response=None,
        hotlines=[],
    )
