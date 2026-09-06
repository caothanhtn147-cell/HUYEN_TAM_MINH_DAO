import re
from enum import StrEnum

from pydantic import BaseModel, Field

from app.ai.crisis_detector import CrisisDetectionResult, detect_crisis


class SafetyAction(StrEnum):
    """Action recommendation based on safety review."""

    ALLOW = "ALLOW"
    REWRITE = "REWRITE"
    BLOCK = "BLOCK"


class BoundaryViolationType(StrEnum):
    """Post-execution boundary violation categories."""

    FEAR_MANIPULATION = "FEAR_MANIPULATION"
    FATALISTIC_PREDICTION = "FATALISTIC_PREDICTION"
    MEDICAL_DIAGNOSIS = "MEDICAL_DIAGNOSIS"
    FINANCIAL_PROMISE = "FINANCIAL_PROMISE"
    SUPERNATURAL_MEDIUMSHIP = "SUPERNATURAL_MEDIUMSHIP"


class SafetyReviewResult(BaseModel):
    """Evaluation result from post-execution Safety Reviewer."""

    flagged: bool = Field(
        default=False, description="True if forbidden content is detected"
    )
    violations: list[BoundaryViolationType] = Field(
        default_factory=list, description="List of detected boundary violations"
    )
    action: SafetyAction = Field(
        default=SafetyAction.ALLOW, description="Enforcement action"
    )
    sanitized_content: str = Field(..., description="Sanitized content text payload")
    risk_score: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Evaluated safety risk score"
    )


FORBIDDEN_PATTERNS: dict[BoundaryViolationType, list[str]] = {
    BoundaryViolationType.FEAR_MANIPULATION: [
        r"bị yểm bùa",
        r"bị trúng ngải",
        r"bị trúng lời nguyền",
        r"bị ma ám",
        r"nghiệp quật sắp chết",
        r"mua bùa giải hạn",
        r"cursed by dark magic",
        r"possessed by evil spirit",
    ],
    BoundaryViolationType.FATALISTIC_PREDICTION: [
        r"chắc chắn sẽ chết",
        r"số mạng đã định không thể đổi",
        r"tử vong vào năm",
        r"tai nạn thảm khốc chắc chắn xảy ra",
        r"will definitely die in",
        r"doomed to fail",
    ],
    BoundaryViolationType.MEDICAL_DIAGNOSIS: [
        r"chẩn đoán bạn bị ung thư",
        r"bỏ thuốc kê đơn",
        r"bỏ điều trị tây y",
        r"chữa khỏi ung thư bằng",
        r"thay thế phác đồ bác sĩ",
        r"cure your cancer",
        r"stop taking prescribed drugs",
    ],
    BoundaryViolationType.FINANCIAL_PROMISE: [
        r"cam kết x10 tài sản",
        r"chắc chắn làm giàu",
        r"đầu tư coin này chắc thắng",
        r"guaranteed 100x return",
    ],
    BoundaryViolationType.SUPERNATURAL_MEDIUMSHIP: [
        r"nói chuyện với linh hồn",
        r"vong linh người thân phán rằng",
        r"giao tiếp với hồn ma",
    ],
}

SAFETY_DISCLAIMER_HEADER = (
    "\n\n---"
    "\n💡 *[Thông báo ranh giới an toàn]*: Minh Sư AI là công cụ chiêm "
    "nghiệm tâm lý và biểu tượng triết học. Mọi kết quả không mang tính "
    "chất chẩn đoán y tế, tiên đoán định mệnh hay cam kết tài chính."
)


def review_response_content(content: str) -> SafetyReviewResult:
    """Scan AI response content for boundary violations and sanitize output."""
    normalized_text = content.lower()
    detected_violations: list[BoundaryViolationType] = []

    for violation_type, patterns in FORBIDDEN_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, normalized_text, re.IGNORECASE):
                if violation_type not in detected_violations:
                    detected_violations.append(violation_type)
                break

    if not detected_violations:
        return SafetyReviewResult(
            flagged=False,
            violations=[],
            action=SafetyAction.ALLOW,
            sanitized_content=content,
            risk_score=0.0,
        )

    # Calculate risk score based on number of violations
    risk_score = min(1.0, len(detected_violations) * 0.4)
    action = SafetyAction.BLOCK if risk_score >= 0.8 else SafetyAction.REWRITE

    # Sanitize content by stripping forbidden claims and appending safety disclaimer
    sanitized = content
    for violation_type in detected_violations:
        for pattern in FORBIDDEN_PATTERNS[violation_type]:
            sanitized = re.sub(
                pattern,
                "[Nội dung đã được tinh lọc theo quy chuẩn an toàn]",
                sanitized,
                flags=re.IGNORECASE,
            )

    if SAFETY_DISCLAIMER_HEADER not in sanitized:
        sanitized += SAFETY_DISCLAIMER_HEADER

    return SafetyReviewResult(
        flagged=True,
        violations=detected_violations,
        action=action,
        sanitized_content=sanitized,
        risk_score=risk_score,
    )


class DualPassSafetyEngine:
    """Unified dual-pass safety pipeline combining pre and post execution checks."""

    @staticmethod
    def evaluate_pre_execution(user_input: str) -> CrisisDetectionResult:
        """Run Layer 1: Pre-Execution Crisis Detector on incoming user prompt."""
        return detect_crisis(user_input)

    @staticmethod
    def evaluate_post_execution(response_content: str) -> SafetyReviewResult:
        """Run Layer 2: Post-Execution Boundary Enforcer on generated AI output."""
        return review_response_content(response_content)
