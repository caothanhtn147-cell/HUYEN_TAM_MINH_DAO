from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application runtime settings backed by environment variables."""

    APP_ENV: str = "development"
    APP_NAME: str = "HUYỀN TÂM MINH ĐẠO API"
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"
    LOG_LEVEL: str = "INFO"
    DATABASE_URL: str = (
        "postgresql+asyncpg://invalid_user:invalid_password@127.0.0.1:5432/invalid_db"
    )
    DB_ECHO: bool = False
    PROFILE_ENCRYPTION_KEY: str = ""

    def get_profile_encryption_key_bytes(self) -> bytes:
        """Decode and validate 32-byte AES-256 key from PROFILE_ENCRYPTION_KEY."""
        import base64

        raw_key = self.PROFILE_ENCRYPTION_KEY.strip()
        if not raw_key:
            raise ValueError(
                "PROFILE_ENCRYPTION_KEY is required for sensitive profile operations."
            )
        try:
            decoded = base64.b64decode(raw_key, validate=True)
        except Exception as err:
            raise ValueError(
                "PROFILE_ENCRYPTION_KEY must be a valid Base64-encoded string."
            ) from err

        if len(decoded) != 32:
            raise ValueError(
                "PROFILE_ENCRYPTION_KEY must decode to exactly 32 bytes "
                f"(got {len(decoded)} bytes)."
            )
        return decoded

    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings instance."""
    return Settings()
