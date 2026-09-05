import hashlib
import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.user_session import UserSession
from app.security.jwt import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)


def hash_refresh_token(raw_token: str) -> str:
    """Compute SHA-256 hash of a raw refresh token string."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


async def create_session(
    db: AsyncSession,
    user_id: uuid.UUID,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> tuple[UserSession, str]:
    """Create a new UserSession record and return (session, raw_refresh_token)."""
    settings = get_settings()
    session_id = uuid.uuid4()
    raw_refresh_token = create_refresh_token(subject=user_id, session_id=session_id)
    token_hash = hash_refresh_token(raw_refresh_token)
    expires_at = datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    session = UserSession(
        id=session_id,
        user_id=user_id,
        refresh_token_hash=token_hash,
        ip_address=ip_address,
        user_agent=user_agent,
        is_revoked=False,
        expires_at=expires_at,
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session, raw_refresh_token


async def rotate_session(
    db: AsyncSession,
    raw_refresh_token: str,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> tuple[UserSession, str, str]:
    """Verify refresh token, revoke active session, and issue new session tokens.

    Returns:
        (new_session, new_access_token, new_refresh_token)
    """
    payload = decode_refresh_token(raw_refresh_token)
    session_id = uuid.UUID(str(payload["sid"]))
    user_id = uuid.UUID(str(payload["sub"]))

    stmt = select(UserSession).where(UserSession.id == session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if session is None:
        raise ValueError("Session not found.")

    if session.is_revoked:
        # Revoke all sessions for security against token theft
        await revoke_all_user_sessions(db, user_id)
        raise ValueError("Session has been revoked.")

    token_hash = hash_refresh_token(raw_refresh_token)
    if session.refresh_token_hash != token_hash:
        session.is_revoked = True
        await db.commit()
        raise ValueError("Invalid refresh token signature.")

    now = datetime.now(UTC)
    if session.expires_at <= now:
        session.is_revoked = True
        await db.commit()
        raise ValueError("Refresh token has expired.")

    # Revoke current session
    session.is_revoked = True

    # Issue new session
    new_session, new_refresh_token = await create_session(
        db, user_id=user_id, ip_address=ip_address, user_agent=user_agent
    )
    new_access_token = create_access_token(user_id)

    return new_session, new_access_token, new_refresh_token


async def revoke_session(db: AsyncSession, session_id: uuid.UUID) -> bool:
    """Revoke a single session by its UUID."""
    stmt = select(UserSession).where(UserSession.id == session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()

    if session is None or session.is_revoked:
        return False

    session.is_revoked = True
    await db.commit()
    return True


async def revoke_session_by_token(db: AsyncSession, raw_refresh_token: str) -> bool:
    """Revoke session bound to the provided raw refresh token."""
    try:
        payload = decode_refresh_token(raw_refresh_token)
        session_id = uuid.UUID(str(payload["sid"]))
        return await revoke_session(db, session_id)
    except ValueError:
        return False


async def revoke_all_user_sessions(db: AsyncSession, user_id: uuid.UUID) -> int:
    """Revoke all active sessions for a given user."""
    stmt = (
        update(UserSession)
        .where(UserSession.user_id == user_id, UserSession.is_revoked.is_(False))
        .values(is_revoked=True)
    )
    result = await db.execute(stmt)
    await db.commit()
    rowcount = getattr(result, "rowcount", 0)
    return int(rowcount)
