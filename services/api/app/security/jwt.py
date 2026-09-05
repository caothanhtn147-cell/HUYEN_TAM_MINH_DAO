import uuid
from datetime import UTC, datetime, timedelta

import jwt

from app.config import get_settings


def create_access_token(
    subject: str | uuid.UUID, expires_delta: timedelta | None = None
) -> str:
    """Create signed JWT access token for a given user subject."""
    settings = get_settings()
    now = datetime.now(UTC)

    if expires_delta is not None:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "type": "access",
    }

    return jwt.encode(
        payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def decode_access_token(token: str) -> dict[str, str | int]:
    """Decode and verify signed JWT access token."""
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        if payload.get("type") != "access":
            raise ValueError("Invalid token type claim.")
        return payload
    except jwt.ExpiredSignatureError as err:
        raise ValueError("Token has expired.") from err
    except jwt.PyJWTError as err:
        raise ValueError("Invalid access token.") from err
