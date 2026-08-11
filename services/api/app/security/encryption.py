import os
from typing import Final

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.config import get_settings

ENCRYPTION_VERSION_V1: Final[bytes] = b"\x01"
NONCE_SIZE_BYTES: Final[int] = 12


def _resolve_key(key: bytes | None) -> bytes:
    """Resolve and validate 32-byte encryption key material."""
    if key is not None:
        if len(key) != 32:
            raise ValueError(
                f"Encryption key must be exactly 32 bytes (got {len(key)} bytes)."
            )
        return key
    return get_settings().get_profile_encryption_key_bytes()


def encrypt_sensitive_value(
    value: str | None, key: bytes | None = None
) -> bytes | None:
    """Encrypt plaintext string into AES-256-GCM authenticated ciphertext envelope.

    Envelope Format:
    - Byte 0: Version (0x01)
    - Bytes 1..12: 12-byte random nonce
    - Bytes 13..: Ciphertext + 16-byte GCM authentication tag
    """
    if value is None:
        return None

    key_bytes = _resolve_key(key)
    aesgcm = AESGCM(key_bytes)
    nonce = os.urandom(NONCE_SIZE_BYTES)
    plaintext_bytes = value.encode("utf-8")

    ciphertext_with_tag = aesgcm.encrypt(
        nonce, plaintext_bytes, associated_data=ENCRYPTION_VERSION_V1
    )
    return ENCRYPTION_VERSION_V1 + nonce + ciphertext_with_tag


def decrypt_sensitive_value(
    ciphertext: bytes | None, key: bytes | None = None
) -> str | None:
    """Decrypt authenticated AES-256-GCM ciphertext envelope to plaintext string."""
    if ciphertext is None:
        return None

    if len(ciphertext) < 1 + NONCE_SIZE_BYTES + 16:
        raise ValueError("Invalid ciphertext length.")

    version = ciphertext[:1]
    if version != ENCRYPTION_VERSION_V1:
        raise ValueError(f"Unsupported encryption envelope version: {version!r}.")

    key_bytes = _resolve_key(key)
    nonce = ciphertext[1 : 1 + NONCE_SIZE_BYTES]
    encrypted_data = ciphertext[1 + NONCE_SIZE_BYTES :]
    aesgcm = AESGCM(key_bytes)

    try:
        decrypted_bytes = aesgcm.decrypt(
            nonce, encrypted_data, associated_data=ENCRYPTION_VERSION_V1
        )
        return decrypted_bytes.decode("utf-8")
    except InvalidTag as err:
        raise ValueError(
            "Ciphertext authentication failed (data tampered or wrong key)."
        ) from err
