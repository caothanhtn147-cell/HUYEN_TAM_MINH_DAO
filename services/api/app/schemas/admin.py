from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SystemHealthMetricsResponse(BaseModel):
    """Schema representing real-time system health & operational metrics."""

    api_status: str = Field(
        ..., description="Trạng thái API (healthy/degraded/unhealthy)"
    )
    uptime_seconds: float = Field(..., description="Thời gian hoạt động (seconds)")
    active_users_count: int = Field(..., description="Số người dùng active")
    total_consultations_count: int = Field(
        ..., description="Tổng lượt tư vấn Minh Kiến"
    )
    total_tarot_draws_count: int = Field(..., description="Tổng lượt rút Tarot")
    total_iching_tosses_count: int = Field(..., description="Tổng lượt gieo Kinh Dịch")
    total_astrology_charts_count: int = Field(
        ..., description="Tổng lượt lập Bát Tự & Tử Vi"
    )
    safety_alerts_count: int = Field(..., description="Số cảnh báo Safety Pipeline")
    ai_providers_status: dict[str, str] = Field(
        ..., description="Trạng thái các AI Provider (Gemini, Claude, OpenAI)"
    )
    database_connected: bool = Field(..., description="Trạng thái kết nối PostgreSQL")
    redis_connected: bool = Field(..., description="Trạng thái kết nối Redis")


class SystemAuditLogSchema(BaseModel):
    """Schema representing an audit log entry."""

    id: UUID
    actor_id: UUID | None = None
    action: str
    module: str
    severity: str
    details: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
