from __future__ import annotations

import uuid
from datetime import UTC, datetime
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.wallet import Wallet


class TransactionType(StrEnum):
    """Credit ledger transaction types."""

    TOPUP = "TOPUP"
    SPEND = "SPEND"
    PROMO = "PROMO"
    REFUND = "REFUND"
    TIP = "TIP"


class CreditLedger(Base):
    """Append-only transaction record for credit ledger auditing."""

    __tablename__ = "credit_ledger"
    __table_args__ = (
        Index("ix_credit_ledger_wallet_id", "wallet_id"),
        Index("ix_credit_ledger_user_id", "user_id"),
        Index("ix_credit_ledger_idempotency_key", "idempotency_key", unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    wallet_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("wallets.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    transaction_type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType, native_enum=False, length=20),
        nullable=False,
    )
    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    balance_after: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    reference_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    idempotency_key: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(UTC),
    )

    # Relationships
    wallet: Mapped[Wallet] = relationship(
        "Wallet",
        back_populates="ledger_entries",
    )
    user: Mapped[User] = relationship(
        "User",
        back_populates="credit_ledger_entries",
    )
