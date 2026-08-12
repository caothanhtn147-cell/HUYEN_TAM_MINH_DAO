import base64
import os
from collections.abc import Generator

import pytest
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.models import Role, User, UserProfile

TEST_KEY_BYTES: bytes = os.urandom(32)
TEST_KEY_B64: str = base64.b64encode(TEST_KEY_BYTES).decode("utf-8")


@pytest.fixture(autouse=True)
def setup_integration_encryption_key() -> Generator[None, None, None]:
    get_settings.cache_clear()
    settings = get_settings()
    settings.PROFILE_ENCRYPTION_KEY = TEST_KEY_B64
    try:
        yield
    finally:
        get_settings.cache_clear()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_user_role_profile_persistence_lifecycle() -> None:
    """Verify persisting and querying User, Role, and Profile in PostgreSQL."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        async with session_factory() as session:
            # 1. Create Role
            role = Role(name="USER", description="Standard User")
            session.add(role)
            await session.commit()

            # 2. Create User with Profile and Role
            user = User(email="test_ht006@example.com")
            profile = UserProfile(
                full_name="Lê Văn Minh",
                preferred_name="Minh",
                locale="vi",
            )
            profile.set_birth_date("1992-11-05", key=TEST_KEY_BYTES)
            profile.set_birth_location("Thành phố Đà Nẵng", key=TEST_KEY_BYTES)

            user.profile = profile
            user.roles.append(role)

            session.add(user)
            await session.commit()

            # 3. Query back User and Profile from DB
            result = await session.execute(
                select(User).where(User.email == "test_ht006@example.com")
            )
            fetched_user = result.scalar_one()

            assert fetched_user.id == user.id
            assert fetched_user.profile is not None
            assert fetched_user.profile.full_name == "Lê Văn Minh"
            assert (
                fetched_user.profile.get_birth_date(key=TEST_KEY_BYTES) == "1992-11-05"
            )
            assert (
                fetched_user.profile.get_birth_location(key=TEST_KEY_BYTES)
                == "Thành phố Đà Nẵng"
            )
            assert len(fetched_user.roles) == 1
            assert fetched_user.roles[0].name == "USER"

            # Cleanup
            await session.delete(fetched_user)
            await session.delete(role)
            await session.commit()
    finally:
        await engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_plaintext_leak_prevention_in_db() -> None:
    """Verify raw DB column contains ciphertext and NEVER sensitive plaintext."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    sensitive_birth_place = "Quận 1, TP. Hồ Chí Minh"

    try:
        async with session_factory() as session:
            user = User(email="privacy_leak_test@example.com")
            profile = UserProfile(full_name="Test Leak User")
            profile.set_birth_location(sensitive_birth_place, key=TEST_KEY_BYTES)
            user.profile = profile

            session.add(user)
            await session.commit()

            # Execute raw SQL query directly against DB table
            raw_result = await session.execute(
                text(
                    "SELECT birth_location_encrypted FROM profiles "
                    "WHERE user_id = :user_id"
                ),
                {"user_id": user.id},
            )
            raw_bytes = raw_result.scalar_one()

            assert raw_bytes is not None
            assert isinstance(raw_bytes, bytes)
            # CRITICAL ASSERTION: Plaintext sensitive string must NOT exist in raw bytes
            assert sensitive_birth_place.encode("utf-8") not in raw_bytes

            # Cleanup
            await session.delete(user)
            await session.commit()
    finally:
        await engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_unique_user_email_constraint() -> None:
    """Verify PostgreSQL enforces UNIQUE constraint on User.email."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        async with session_factory() as session:
            u1 = User(email="duplicate@example.com")
            session.add(u1)
            await session.commit()

            u2 = User(email="duplicate@example.com")
            session.add(u2)

            with pytest.raises(IntegrityError):
                await session.commit()

            await session.rollback()
            await session.delete(u1)
            await session.commit()
    finally:
        await engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_case_insensitive_email_uniqueness_constraint() -> None:
    """Verify lower(email) uniqueness constraint in PostgreSQL."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        async with session_factory() as session:
            u1 = User(email="Case.Sensitive@Example.com")
            session.add(u1)
            await session.commit()

            assert u1.email == "case.sensitive@example.com"

            # Attempt inserting raw un-normalized SQL string directly
            with pytest.raises(IntegrityError):
                await session.execute(
                    text(
                        "INSERT INTO users (id, email, is_active, is_verified, "
                        "created_at, updated_at) VALUES (gen_random_uuid(), "
                        "'CASE.SENSITIVE@EXAMPLE.COM', true, false, now(), now())"
                    )
                )
                await session.commit()

            await session.rollback()
            await session.delete(u1)
            await session.commit()
    finally:
        await engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_one_to_one_user_profile_constraint() -> None:
    """Verify PostgreSQL enforces unique user_id constraint on UserProfile."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        async with session_factory() as session:
            user = User(email="one_to_one_test@example.com")
            session.add(user)
            await session.commit()

            p1 = UserProfile(user_id=user.id, full_name="Profile 1")
            session.add(p1)
            await session.commit()

            p2 = UserProfile(user_id=user.id, full_name="Profile 2")
            session.add(p2)

            with pytest.raises(IntegrityError):
                await session.commit()

            await session.rollback()
            await session.delete(user)
            await session.commit()
    finally:
        await engine.dispose()
