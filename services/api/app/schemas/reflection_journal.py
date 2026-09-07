from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class JournalEntryCreate(BaseModel):
    """Payload for creating a new self-reflection journal entry."""

    title: str = Field(..., min_length=1, max_length=255, description="Tiêu đề nhật ký")
    content: str = Field(..., min_length=1, description="Nội dung soi chiếu tâm lý")
    mood_tag: str = Field(
        default="reflective",
        description="Nhãn trạng thái cảm xúc (calm, seeking, grateful, anxious...)",
    )
    source_module: str = Field(
        default="general",
        description="Mô-đun nguồn (minh_kien, tarot, iching, astrology, general)",
    )
    source_reference_id: str | None = Field(
        default=None, description="Mã tham chiếu kết quả rút bài / gieo quẻ / lá số"
    )
    insights: list[str] = Field(
        default_factory=list, description="Danh sách từ khóa nhận thức"
    )


class JournalEntryUpdate(BaseModel):
    """Payload for updating an existing self-reflection journal entry."""

    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = Field(default=None, min_length=1)
    mood_tag: str | None = Field(default=None)
    insights: list[str] | None = Field(default=None)


class JournalEntryResponse(BaseModel):
    """Response representation of a self-reflection journal entry."""

    id: UUID
    user_id: UUID
    title: str
    content: str
    mood_tag: str
    source_module: str
    source_reference_id: str | None = None
    insights: list[str] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConsultationHistoryItemResponse(BaseModel):
    """Response representing a historical reading event across modules."""

    id: str = Field(..., description="Mã sự kiện lịch sử")
    module_type: str = Field(..., description="minh_kien | tarot | iching | astrology")
    title_vi: str = Field(..., description="Tiêu đề hiển thị")
    summary_vi: str = Field(..., description="Tóm tắt ngắn kết quả")
    timestamp: datetime = Field(..., description="Thời gian thực hiện")
    reference_id: str = Field(..., description="Mã tham chiếu dữ liệu gốc")
