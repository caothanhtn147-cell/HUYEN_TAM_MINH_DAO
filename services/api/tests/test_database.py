import pytest
from sqlalchemy import make_url, text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.db.base import Base
from app.db.session import get_db_session


def test_base_declarative_metadata() -> None:
    """Verify that Base is a valid DeclarativeBase with registered domain tables."""
    assert Base.metadata is not None
    assert len(Base.metadata.tables) == 4
    assert "users" in Base.metadata.tables


def test_alembic_special_character_url_handling() -> None:
    """Verify special characters (e.g. '%') in DATABASE_URL do not fail parsing."""
    synthetic_url = (
        "postgresql+asyncpg://huyentam_user:p%25ssword%40secret@127.0.0.1:5432/huyentam"
    )
    url_obj = make_url(synthetic_url)
    assert url_obj.username == "huyentam_user"
    assert url_obj.password == "p%ssword@secret"

    # Ensure engine initialization succeeds without ConfigParser interpolation errors
    test_engine = create_async_engine(synthetic_url, poolclass=NullPool)
    assert test_engine.url.drivername == "postgresql+asyncpg"


def test_settings_cache_clear() -> None:
    """Verify get_settings.cache_clear() supports dynamic test overrides."""
    get_settings.cache_clear()
    settings = get_settings()
    assert settings.APP_NAME == "HUYỀN TÂM MINH ĐẠO API"
    get_settings.cache_clear()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_database_connection() -> None:
    """Verify async engine connectivity with SELECT 1 query."""
    settings = get_settings()
    test_engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    try:
        async with test_engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            scalar = result.scalar()
            assert scalar == 1
    finally:
        await test_engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_async_session_factory() -> None:
    """Verify async_sessionmaker creates and closes an active AsyncSession."""
    settings = get_settings()
    test_engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    session_factory = async_sessionmaker(
        bind=test_engine, class_=AsyncSession, expire_on_commit=False
    )
    try:
        async with session_factory() as session:
            assert isinstance(session, AsyncSession)
            result = await session.execute(text("SELECT 1"))
            assert result.scalar() == 1
    finally:
        await test_engine.dispose()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_get_db_session_dependency() -> None:
    """Verify get_db_session dependency yields an active session."""
    session_generator = get_db_session()
    session = await anext(session_generator)
    try:
        assert isinstance(session, AsyncSession)
        result = await session.execute(text("SELECT 1"))
        assert result.scalar() == 1
    finally:
        with pytest.raises(StopAsyncIteration):
            await anext(session_generator)
