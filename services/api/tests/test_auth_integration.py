from collections.abc import AsyncIterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.db.session import get_db_session
from app.main import create_app

app = create_app()


@pytest.fixture(autouse=True)
def override_db_dependency() -> AsyncIterator[None]:
    """Override get_db_session dependency with NullPool engine."""
    settings = get_settings()
    test_engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    test_session_factory = async_sessionmaker(
        bind=test_engine, class_=AsyncSession, expire_on_commit=False
    )

    async def _get_test_db_session() -> AsyncIterator[AsyncSession]:
        async with test_session_factory() as session:
            yield session

    app.dependency_overrides[get_db_session] = _get_test_db_session
    yield
    app.dependency_overrides.clear()


@pytest.mark.integration
def test_user_registration_login_and_session_flow() -> None:
    """Integration test verifying full register, login, refresh, me, and logout flow."""
    settings = get_settings()
    with TestClient(app) as client:
        test_email = "ht008_user@example.com"
        test_password = "SecurePassword123"

        # 1. Register new user
        reg_response = client.post(
            "/api/v1/auth/register",
            json={
                "email": test_email,
                "password": test_password,
                "full_name": "Nguyễn Minh Châu",
            },
        )
        assert reg_response.status_code == 201

        # 2. Login
        login_response = client.post(
            "/api/v1/auth/login",
            json={
                "email": test_email,
                "password": test_password,
            },
        )
        assert login_response.status_code == 200
        token_data = login_response.json()
        assert "access_token" in token_data
        assert "refresh_token" in token_data

        # Check HTTP-Only Cookie
        cookies = login_response.cookies
        assert settings.REFRESH_TOKEN_COOKIE_NAME in cookies
        cookie_refresh_token = cookies[settings.REFRESH_TOKEN_COOKIE_NAME]

        access_token = token_data["access_token"]

        # 3. Access /auth/me with valid Bearer token
        me_response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert me_response.status_code == 200
        assert me_response.json()["email"] == test_email

        # 4. Refresh token rotation (using Cookie)
        client.cookies.set(settings.REFRESH_TOKEN_COOKIE_NAME, cookie_refresh_token)
        refresh_response = client.post("/api/v1/auth/refresh")
        assert refresh_response.status_code == 200
        new_token_data = refresh_response.json()

        assert new_token_data["refresh_token"] != cookie_refresh_token
        new_access_token = new_token_data["access_token"]

        # 5. Verify old refresh token fails (token reuse prevention)
        client.cookies.set(settings.REFRESH_TOKEN_COOKIE_NAME, cookie_refresh_token)
        reused_refresh = client.post("/api/v1/auth/refresh")
        assert reused_refresh.status_code == 401

        # 6. Logout using active refresh token
        new_cookie_token = refresh_response.cookies[settings.REFRESH_TOKEN_COOKIE_NAME]
        client.cookies.set(settings.REFRESH_TOKEN_COOKIE_NAME, new_cookie_token)
        logout_response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {new_access_token}"},
        )
        assert logout_response.status_code == 200
        assert "Logged out successfully" in logout_response.json()["message"]


@pytest.mark.integration
def test_logout_all_sessions_flow() -> None:
    """Integration test verifying /logout-all revokes all sessions."""
    with TestClient(app) as client:
        test_email = "ht008_logout_all@example.com"
        test_password = "SecurePassword123"

        client.post(
            "/api/v1/auth/register",
            json={"email": test_email, "password": test_password},
        )

        # Session 1
        login1 = client.post(
            "/api/v1/auth/login",
            json={"email": test_email, "password": test_password},
        )
        # Session 2
        login2 = client.post(
            "/api/v1/auth/login",
            json={"email": test_email, "password": test_password},
        )
        token2 = login2.json()["access_token"]

        # Logout all sessions
        logout_all = client.post(
            "/api/v1/auth/logout-all",
            headers={"Authorization": f"Bearer {token2}"},
        )
        assert logout_all.status_code == 200
        assert "Revoked" in logout_all.json()["message"]

        # Attempt refresh on Session 1 refresh token
        rf1 = login1.json()["refresh_token"]
        refresh_attempt = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": rf1},
        )
        assert refresh_attempt.status_code == 401


@pytest.mark.integration
@pytest.mark.asyncio
async def test_cleanup_ht008_test_data() -> None:
    """Clean up test users created during auth integration tests."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    try:
        async with engine.begin() as conn:
            await conn.execute(
                text(
                    "DELETE FROM users WHERE email IN ("
                    "'ht008_user@example.com', 'ht008_logout_all@example.com')"
                )
            )
    finally:
        await engine.dispose()
