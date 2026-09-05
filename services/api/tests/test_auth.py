import uuid
from datetime import timedelta

import pytest

from app.security.jwt import create_access_token, decode_access_token
from app.security.password import (
    hash_password,
    validate_password_strength,
    verify_password,
)


def test_argon2_password_hashing_and_verification() -> None:
    """Verify password hashing with Argon2id and verification logic."""
    raw_password = "SecurePassword123!"
    hashed = hash_password(raw_password)

    assert hashed is not None
    assert hashed.startswith("$argon2id$")
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPassword123", hashed) is False
    assert verify_password("", hashed) is False


def test_password_strength_validation() -> None:
    """Verify password strength validation rules."""
    validate_password_strength("ValidPass123")

    with pytest.raises(ValueError, match="at least 8 characters"):
        validate_password_strength("Short1")

    with pytest.raises(ValueError, match="at least one letter"):
        validate_password_strength("123456789")

    with pytest.raises(ValueError, match="at least one number"):
        validate_password_strength("NoDigitsHere")


def test_jwt_access_token_lifecycle() -> None:
    """Verify JWT access token creation and decoding."""
    user_id = uuid.uuid4()
    token = create_access_token(user_id)

    assert token is not None
    assert isinstance(token, str)

    payload = decode_access_token(token)
    assert payload["sub"] == str(user_id)
    assert payload["type"] == "access"


def test_jwt_expired_token_handling() -> None:
    """Verify expired JWT access token raises ValueError."""
    user_id = uuid.uuid4()
    expired_token = create_access_token(user_id, expires_delta=timedelta(seconds=-10))

    with pytest.raises(ValueError, match="Token has expired"):
        decode_access_token(expired_token)
