import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool

from app.config import get_settings
from app.main import create_app

app = create_app()


@pytest.mark.integration
def test_user_registration_login_and_me_flow() -> None:
    """Integration test verifying full register, login, and /auth/me flow."""
    with TestClient(app) as client:
        test_email = "ht007_user@example.com"
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
        reg_data = reg_response.json()
        assert reg_data["email"] == test_email
        assert reg_data["is_active"] is True

        # 2. Attempt duplicate registration (case-insensitive check)
        dup_response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "HT007_USER@EXAMPLE.COM",
                "password": test_password,
            },
        )
        assert dup_response.status_code == 400
        assert "already registered" in dup_response.json()["detail"]

        # 3. Login with wrong password
        failed_login = client.post(
            "/api/v1/auth/login",
            json={
                "email": test_email,
                "password": "WrongPassword999",
            },
        )
        assert failed_login.status_code == 401

        # 4. Login with correct password
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
        assert token_data["token_type"] == "bearer"

        access_token = token_data["access_token"]

        # 5. Access /auth/me with valid Bearer token
        me_response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert me_response.status_code == 200
        me_data = me_response.json()
        assert me_data["email"] == test_email

        # 6. Access /auth/me with invalid token
        invalid_me = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid.jwt.token"},
        )
        assert invalid_me.status_code == 401


@pytest.mark.integration
@pytest.mark.asyncio
async def test_cleanup_ht007_test_data() -> None:
    """Clean up test user created during auth integration tests."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, poolclass=NullPool)
    try:
        async with engine.begin() as conn:
            await conn.execute(
                text("DELETE FROM users WHERE email = 'ht007_user@example.com'")
            )
    finally:
        await engine.dispose()
