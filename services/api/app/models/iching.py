import uuid
from datetime import UTC, datetime

from sqlalchemy import JSON, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class IChingHexagram(Base):
    """I Ching Hexagram catalog entity representing
    64 Kinh Dịch philosophical hexagrams.
    """

    __tablename__ = "iching_hexagrams"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    hexagram_number: Mapped[int] = mapped_column(
        Integer,
        unique=True,
        nullable=False,
        index=True,
    )
    binary_code: Mapped[str] = mapped_column(
        String(6),
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
    pinyin_name: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    upper_trigram: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    lower_trigram: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    judgement_vi: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    image_vi: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    lines_interpretation_vi: Mapped[dict[str, str]] = mapped_column(
        JSON,
        nullable=False,
        default=dict,
    )
    wisdom_reflection_vi: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
