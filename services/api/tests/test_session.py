import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.models.user import User
from app.models.user_session import UserSession
from app.security.jwt import (
    decode_access_token,
    decode_refresh_token,
)
from app.services.session_service import (
    create_session,
    hash_refresh_token,
    revoke_all_user_sessions,
    revoke_session_by_token,
    rotate_session,
)


@pytest.mark.integration
@pytest.mark.asyncio
async def test_session_lifecycle_and_rotation() -> None:
    """Test session creation, token hashing, rotation, and revocation in Postgres."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        async with session_factory() as db_session:
            user = User(
                email="session_user@example.com",
                hashed_password="test_hashed_password",
                is_active=True,
            )
            db_session.add(user)
            await db_session.commit()
            await db_session.refresh(user)

            # 1. Create session
            session, raw_refresh_token = await create_session(
                db_session,
                user_id=user.id,
                ip_address="127.0.0.1",
                user_agent="PyTestAgent",
            )

            assert session.id is not None
            assert session.user_id == user.id
            assert session.is_revoked is False
            assert session.refresh_token_hash == hash_refresh_token(raw_refresh_token)

            # Decode refresh token payload
            payload = decode_refresh_token(raw_refresh_token)
            assert payload["sub"] == str(user.id)
            assert payload["sid"] == str(session.id)
            assert payload["type"] == "refresh"

            # 2. Rotate session
            new_session, new_access_token, new_refresh_token = await rotate_session(
                db_session, raw_refresh_token=raw_refresh_token, ip_address="127.0.0.1"
            )

            # Old session should now be revoked
            await db_session.refresh(session)
            assert session.is_revoked is True

            # New session active
            assert new_session.id != session.id
            assert new_session.is_revoked is False

            decoded_access = decode_access_token(new_access_token)
            assert decoded_access["sub"] == str(user.id)

            decoded_refresh = decode_refresh_token(new_refresh_token)
            assert decoded_refresh["sid"] == str(new_session.id)

            # 3. Revoke session by token
            revoked = await revoke_session_by_token(db_session, new_refresh_token)
            assert revoked is True

            await db_session.refresh(new_session)
            assert new_session.is_revoked is True

            # 4. Rotation on revoked token should fail and trigger revocation
            with pytest.raises(ValueError, match="Session has been revoked."):
                await rotate_session(db_session, raw_refresh_token=new_refresh_token)

            # Cleanup
            await db_session.delete(user)
            await db_session.commit()
    finally:
        await engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_revoke_all_user_sessions_integration() -> None:
    """Test revoking all sessions for a user in Postgres."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    try:
        async with session_factory() as db_session:
            user = User(
                email="multi_session@example.com",
                hashed_password="test_hashed_password",
                is_active=True,
            )
            db_session.add(user)
            await db_session.commit()
            await db_session.refresh(user)

            s1, _ = await create_session(db_session, user.id)
            s2, _ = await create_session(db_session, user.id)
            s3, _ = await create_session(db_session, user.id)

            count = await revoke_all_user_sessions(db_session, user.id)
            assert count == 3

            result = await db_session.execute(
                select(UserSession).where(UserSession.user_id == user.id)
            )
            sessions = result.scalars().all()
            assert all(s.is_revoked for s in sessions)

            # Cleanup
            await db_session.delete(user)
            await db_session.commit()
    finally:
        await engine.dispose()
