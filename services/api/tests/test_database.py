import pytest
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.db.base import Base
from app.db.session import get_db_session

settings = get_settings()


def test_base_declarative_metadata() -> None:
    """Verify that Base is a valid DeclarativeBase with clean metadata."""
    assert Base.metadata is not None
    assert len(Base.metadata.tables) == 0


@pytest.mark.asyncio
async def test_database_connection() -> None:
    """Verify async engine connectivity with SELECT 1 query."""
    test_engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    try:
        async with test_engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            scalar = result.scalar()
            assert scalar == 1
    finally:
        await test_engine.dispose()


@pytest.mark.asyncio
async def test_async_session_factory() -> None:
    """Verify async_sessionmaker creates and closes an active AsyncSession."""
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
        # Cleanup generator gracefully
        with pytest.raises(StopAsyncIteration):
            await anext(session_generator)
