import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Boolean, DateTime, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AstrologyReadingRecord(Base):
    """Astrology (Bát Tự / Tử Vi) reading record entity for user self-observation."""

    __tablename__ = "astrology_reading_records"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), nullable=True, index=True
    )
    person_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    gender: Mapped[str] = mapped_column(String(10), default="male")

    birth_year: Mapped[int] = mapped_column(Integer, nullable=False)
    birth_month: Mapped[int] = mapped_column(Integer, nullable=False)
    birth_day: Mapped[int] = mapped_column(Integer, nullable=False)
    birth_hour: Mapped[int] = mapped_column(Integer, nullable=False)
    birth_minute: Mapped[int] = mapped_column(Integer, default=0)
    time_zone: Mapped[float] = mapped_column(Float, default=7.0)
    is_lunar: Mapped[bool] = mapped_column(Boolean, default=False)

    batu_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    tuvi_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    synthesis_summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
