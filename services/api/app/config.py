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
        "postgresql+asyncpg://huyentam:huyentam_dev_pass_123@127.0.0.1:5432/huyentam"
    )
    DB_ECHO: bool = False

    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings instance."""
    return Settings()
