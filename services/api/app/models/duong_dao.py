import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DuongDaoArticle(Base):
    """Duong Dao Educational Wellness Article Entity."""

    __tablename__ = "duong_dao_articles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    title_vi: Mapped[str] = mapped_column(String(255), nullable=False)
    summary_vi: Mapped[str] = mapped_column(Text, nullable=False)
    content_vi: Mapped[str] = mapped_column(Text, nullable=False)
    historical_context_vi: Mapped[str | None] = mapped_column(Text, nullable=True)
    educational_disclaimer_vi: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
