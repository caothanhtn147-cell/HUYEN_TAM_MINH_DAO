import uuid
from datetime import datetime

from sqlalchemy import DateTime, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ReflectionJournalEntry(Base):
    """Self-Reflection Journal Entry Entity for user self-observation notes."""

    __tablename__ = "reflection_journal_entries"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), nullable=False, index=True
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    mood_tag: Mapped[str] = mapped_column(
        String(50), default="reflective", nullable=False
    )
    source_module: Mapped[str] = mapped_column(
        String(50), default="general", nullable=False, index=True
    )
    source_reference_id: Mapped[str | None] = mapped_column(String(255), nullable=True)

    insights: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
