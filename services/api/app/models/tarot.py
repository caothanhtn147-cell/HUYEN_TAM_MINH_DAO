import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class TarotCard(Base):
    """Tarot card catalog entity representing psychological mirror symbols."""

    __tablename__ = "tarot_cards"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    card_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )
    name_vi: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    name_en: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    arcana: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="MAJOR",
    )
    suit: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )
    card_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    upright_keywords: Mapped[list[str]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )
    reversed_keywords: Mapped[list[str]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )
    upright_meaning_vi: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    reversed_meaning_vi: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    wisdom_reflection_vi: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
