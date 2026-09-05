from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.ledger import CreditLedger
    from app.models.user import User


class Wallet(Base):
    """User credit wallet entity maintaining current balance snapshot."""

    __tablename__ = "wallets"
    __table_args__ = (Index("ix_wallets_user_id", "user_id", unique=True),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    cached_balance: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    last_reconciled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    # Relationships
    user: Mapped[User] = relationship(
        "User",
        back_populates="wallet",
    )
    ledger_entries: Mapped[list[CreditLedger]] = relationship(
        "CreditLedger",
        back_populates="wallet",
        cascade="all, delete-orphan",
    )
