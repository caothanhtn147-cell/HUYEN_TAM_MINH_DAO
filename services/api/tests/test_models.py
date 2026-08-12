import base64
import os
from collections.abc import Generator

import pytest

from app.config import get_settings
from app.db.base import Base
from app.models import Role, User, UserProfile

TEST_KEY_BYTES: bytes = os.urandom(32)
TEST_KEY_B64: str = base64.b64encode(TEST_KEY_BYTES).decode("utf-8")


@pytest.fixture(autouse=True)
def setup_models_test_key() -> Generator[None, None, None]:
    get_settings.cache_clear()
    settings = get_settings()
    settings.PROFILE_ENCRYPTION_KEY = TEST_KEY_B64
    try:
        yield
    finally:
        get_settings.cache_clear()


def test_base_metadata_contains_ht006_tables() -> None:
    """Verify Base.metadata registers users, roles, user_roles, and profiles tables."""
    tables = Base.metadata.tables
    assert "users" in tables
    assert "roles" in tables
    assert "user_roles" in tables
    assert "profiles" in tables


def test_user_profile_encrypted_columns_exist() -> None:
    """Verify encrypted columns exist and plaintext birth attributes do NOT exist."""
    profile_columns = UserProfile.__table__.columns.keys()

    assert "birth_date_encrypted" in profile_columns
    assert "birth_time_encrypted" in profile_columns
    assert "birth_location_encrypted" in profile_columns

    # Plaintext birth fields MUST NOT exist as DB columns
    assert "birth_date" not in profile_columns
    assert "birth_time" not in profile_columns
    assert "birth_location" not in profile_columns


def test_user_profile_helper_methods() -> None:
    """Verify set_birth_* and get_birth_* helper methods on UserProfile."""
    profile = UserProfile()

    profile.set_birth_date("1990-05-20", key=TEST_KEY_BYTES)
    profile.set_birth_time("08:30", key=TEST_KEY_BYTES)
    profile.set_birth_location("Thành phố Hà Nội", key=TEST_KEY_BYTES)

    assert profile.birth_date_encrypted is not None
    assert profile.birth_time_encrypted is not None
    assert profile.birth_location_encrypted is not None

    # Confirm ciphertext does not leak plaintext
    assert b"1990-05-20" not in profile.birth_date_encrypted
    assert b"08:30" not in profile.birth_time_encrypted
    assert "Hà Nội".encode() not in profile.birth_location_encrypted

    # Confirm decryption round trip
    assert profile.get_birth_date(key=TEST_KEY_BYTES) == "1990-05-20"
    assert profile.get_birth_time(key=TEST_KEY_BYTES) == "08:30"
    assert profile.get_birth_location(key=TEST_KEY_BYTES) == "Thành phố Hà Nội"


def test_model_relationships_and_email_normalization() -> None:
    """Verify ORM relationships and User.email automatic normalization."""
    user = User(email="  Test.User@Example.COM  ")
    assert user.email == "test.user@example.com"

    role = Role(name="USER")
    profile = UserProfile(full_name="Nguyễn Văn A")

    user.profile = profile
    user.roles.append(role)

    assert profile.user is user
    assert role in user.roles
