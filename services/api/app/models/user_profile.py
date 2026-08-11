from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, LargeBinary, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.security.encryption import (
    decrypt_sensitive_value,
    encrypt_sensitive_value,
)

if TYPE_CHECKING:
    from app.models.user import User


class UserProfile(Base):
    """Extended user profile including encrypted sensitive birth attributes."""

    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )
    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    preferred_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    locale: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="vi",
    )
    gender_identity: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    # Sensitive fields stored as AES-256-GCM ciphertext
    birth_date_encrypted: Mapped[bytes | None] = mapped_column(
        LargeBinary,
        nullable=True,
    )
    birth_time_encrypted: Mapped[bytes | None] = mapped_column(
        LargeBinary,
        nullable=True,
    )
    birth_location_encrypted: Mapped[bytes | None] = mapped_column(
        LargeBinary,
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

    user: Mapped[User] = relationship(
        "User",
        back_populates="profile",
    )

    # Application-layer helper methods for encrypted birth attributes
    def get_birth_date(self, key: bytes | None = None) -> str | None:
        """Decrypt birth_date_encrypted back to plaintext string."""
        return decrypt_sensitive_value(self.birth_date_encrypted, key=key)

    def set_birth_date(self, value: str | None, key: bytes | None = None) -> None:
        """Encrypt plaintext birth date string and store into birth_date_encrypted."""
        self.birth_date_encrypted = encrypt_sensitive_value(value, key=key)

    def get_birth_time(self, key: bytes | None = None) -> str | None:
        """Decrypt birth_time_encrypted back to plaintext string."""
        return decrypt_sensitive_value(self.birth_time_encrypted, key=key)

    def set_birth_time(self, value: str | None, key: bytes | None = None) -> None:
        """Encrypt plaintext birth time string and store into birth_time_encrypted."""
        self.birth_time_encrypted = encrypt_sensitive_value(value, key=key)

    def get_birth_location(self, key: bytes | None = None) -> str | None:
        """Decrypt birth_location_encrypted back to plaintext string."""
        return decrypt_sensitive_value(self.birth_location_encrypted, key=key)

    def set_birth_location(self, value: str | None, key: bytes | None = None) -> None:
        """Encrypt plaintext birth location string and store into ciphertext column."""
        self.birth_location_encrypted = encrypt_sensitive_value(value, key=key)
