import base64
import os
from collections.abc import Generator

import pytest

from app.config import get_settings
from app.models.user_profile import (
    CONTEXT_BIRTH_DATE,
    CONTEXT_BIRTH_LOCATION,
    CONTEXT_BIRTH_TIME,
)
from app.security.encryption import (
    decrypt_sensitive_value,
    encrypt_sensitive_value,
)
from app.security.identity import normalize_email

# Test key (32 bytes Base64)
TEST_KEY_BYTES: bytes = os.urandom(32)
TEST_KEY_B64: str = base64.b64encode(TEST_KEY_BYTES).decode("utf-8")
WRONG_KEY_BYTES: bytes = os.urandom(32)


@pytest.fixture(autouse=True)
def setup_test_encryption_key() -> Generator[None, None, None]:
    """Fixture configuring test PROFILE_ENCRYPTION_KEY with teardown."""
    get_settings.cache_clear()
    settings = get_settings()
    settings.PROFILE_ENCRYPTION_KEY = TEST_KEY_B64
    try:
        yield
    finally:
        get_settings.cache_clear()


def test_encryption_decryption_round_trip() -> None:
    """Verify basic encrypt and decrypt round trip with context."""
    plaintext = "1995-08-17"
    ciphertext = encrypt_sensitive_value(
        plaintext, context=CONTEXT_BIRTH_DATE, key=TEST_KEY_BYTES
    )
    assert ciphertext is not None
    assert ciphertext != plaintext.encode()

    decrypted = decrypt_sensitive_value(
        ciphertext, context=CONTEXT_BIRTH_DATE, key=TEST_KEY_BYTES
    )
    assert decrypted == plaintext


def test_unicode_vietnamese_round_trip() -> None:
    """Verify Unicode Vietnamese text round trip with location context."""
    vietnamese_text = "TP. Hồ Chí Minh"
    ciphertext = encrypt_sensitive_value(
        vietnamese_text, context=CONTEXT_BIRTH_LOCATION, key=TEST_KEY_BYTES
    )
    assert ciphertext is not None

    decrypted = decrypt_sensitive_value(
        ciphertext, context=CONTEXT_BIRTH_LOCATION, key=TEST_KEY_BYTES
    )
    assert decrypted == vietnamese_text


def test_random_nonce_uniqueness() -> None:
    """Verify encrypting identical plaintext produces distinct ciphertexts."""
    plaintext = "23:45"
    c1 = encrypt_sensitive_value(
        plaintext, context=CONTEXT_BIRTH_TIME, key=TEST_KEY_BYTES
    )
    c2 = encrypt_sensitive_value(
        plaintext, context=CONTEXT_BIRTH_TIME, key=TEST_KEY_BYTES
    )

    assert c1 is not None and c2 is not None
    assert c1 != c2


def test_cross_field_swap_decryption_fails() -> None:
    """Verify decrypting ciphertext with wrong context fails AEAD authentication."""
    location_plaintext = "Thành phố Đà Nẵng"
    location_ciphertext = encrypt_sensitive_value(
        location_plaintext, context=CONTEXT_BIRTH_LOCATION, key=TEST_KEY_BYTES
    )
    assert location_ciphertext is not None

    # Attempting to decrypt birth location ciphertext using birth date context MUST fail
    with pytest.raises(ValueError, match="Ciphertext authentication failed"):
        decrypt_sensitive_value(
            location_ciphertext, context=CONTEXT_BIRTH_DATE, key=TEST_KEY_BYTES
        )

    # Attempting to decrypt using birth time context MUST fail
    with pytest.raises(ValueError, match="Ciphertext authentication failed"):
        decrypt_sensitive_value(
            location_ciphertext, context=CONTEXT_BIRTH_TIME, key=TEST_KEY_BYTES
        )


def test_tampered_ciphertext_fails_authentication() -> None:
    """Verify modifying ciphertext bytes raises ValueError."""
    plaintext = "Sensitive Data"
    ciphertext = encrypt_sensitive_value(
        plaintext, context="test:context", key=TEST_KEY_BYTES
    )
    assert ciphertext is not None

    # Tamper with byte in ciphertext body
    tampered = bytearray(ciphertext)
    tampered[-1] ^= 0xFF

    with pytest.raises(ValueError, match="Ciphertext authentication failed"):
        decrypt_sensitive_value(
            bytes(tampered), context="test:context", key=TEST_KEY_BYTES
        )


def test_wrong_key_decryption_fails() -> None:
    """Verify decrypting with a wrong key raises ValueError."""
    plaintext = "Secret Location"
    ciphertext = encrypt_sensitive_value(
        plaintext, context=CONTEXT_BIRTH_LOCATION, key=TEST_KEY_BYTES
    )
    assert ciphertext is not None

    with pytest.raises(ValueError, match="Ciphertext authentication failed"):
        decrypt_sensitive_value(
            ciphertext, context=CONTEXT_BIRTH_LOCATION, key=WRONG_KEY_BYTES
        )


def test_invalid_key_length_raises_error() -> None:
    """Verify providing non-32-byte key raises ValueError."""
    short_key = b"short_key_16_byte!"
    with pytest.raises(ValueError, match="must be exactly 32 bytes"):
        encrypt_sensitive_value("data", key=short_key)


def test_none_value_handling() -> None:
    """Verify None input returns None for both encrypt and decrypt."""
    assert encrypt_sensitive_value(None, key=TEST_KEY_BYTES) is None
    assert decrypt_sensitive_value(None, key=TEST_KEY_BYTES) is None


def test_ciphertext_does_not_contain_plaintext() -> None:
    """Verify raw ciphertext byte sequence does not contain plaintext string."""
    sensitive_word = "Ha_Noi_Capital_12345"
    ciphertext = encrypt_sensitive_value(
        sensitive_word, context=CONTEXT_BIRTH_LOCATION, key=TEST_KEY_BYTES
    )
    assert ciphertext is not None
    assert sensitive_word.encode("utf-8") not in ciphertext


def test_email_normalization_canonicalization() -> None:
    """Verify email normalization strips whitespace and converts to lower/casefold."""
    assert normalize_email("  Test.User@Example.COM  ") == "test.user@example.com"
    assert normalize_email("MINH.LE@HUYENTAM.VN") == "minh.le@huyentam.vn"

    with pytest.raises(ValueError, match="cannot be empty"):
        normalize_email("   ")

    with pytest.raises(ValueError, match="Invalid email address"):
        normalize_email("notanemail")
