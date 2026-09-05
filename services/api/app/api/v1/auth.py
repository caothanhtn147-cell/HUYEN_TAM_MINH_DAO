from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.config import get_settings
from app.db.session import get_db_session
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.auth import (
    RefreshRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.security.identity import normalize_email
from app.security.jwt import create_access_token
from app.security.password import (
    hash_password,
    validate_password_strength,
    verify_password,
)
from app.services.session_service import (
    create_session,
    revoke_all_user_sessions,
    revoke_session_by_token,
    rotate_session,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """Set HTTP-Only secure cookie for refresh token."""
    settings = get_settings()
    response.set_cookie(
        key=settings.REFRESH_TOKEN_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=(settings.APP_ENV != "development"),
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/api/v1/auth",
    )


def clear_refresh_cookie(response: Response) -> None:
    """Clear HTTP-Only refresh token cookie."""
    settings = get_settings()
    response.delete_cookie(
        key=settings.REFRESH_TOKEN_COOKIE_NAME,
        path="/api/v1/auth",
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user account",
)
async def register_user(
    payload: UserRegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> User:
    """Register a new user account with normalized email and Argon2id hash."""
    try:
        normalized_email = normalize_email(payload.email)
        validate_password_strength(payload.password)
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err),
        ) from err

    result = await db.execute(select(User).where(User.email == normalized_email))
    existing_user = result.scalar_one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered.",
        )

    hashed_pwd = hash_password(payload.password)
    user = User(
        email=normalized_email,
        hashed_password=hashed_pwd,
        is_active=True,
        is_verified=False,
    )

    if payload.full_name:
        user.profile = UserProfile(full_name=payload.full_name)

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and issue access/refresh session tokens",
)
async def login_user(
    payload: UserLoginRequest,
    request: Request,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TokenResponse:
    """Authenticate credentials, create UserSession, and issue tokens."""
    try:
        normalized_email = normalize_email(payload.email)
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        ) from err

    result = await db.execute(select(User).where(User.email == normalized_email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account.",
        )

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    _, refresh_token = await create_session(
        db, user_id=user.id, ip_address=client_ip, user_agent=user_agent
    )
    access_token = create_access_token(user.id)

    set_refresh_cookie(response, refresh_token)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        refresh_token=refresh_token,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Rotate refresh token session and issue new access token",
)
async def refresh_tokens(
    request: Request,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    payload: RefreshRequest | None = None,
) -> TokenResponse:
    """Rotate refresh token and issue new session access token."""
    settings = get_settings()
    token = request.cookies.get(settings.REFRESH_TOKEN_COOKIE_NAME)
    if not token and payload and payload.refresh_token:
        token = payload.refresh_token

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token cookie or payload is required.",
        )

    client_ip = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    try:
        _, new_access_token, new_refresh_token = await rotate_session(
            db,
            raw_refresh_token=token,
            ip_address=client_ip,
            user_agent=user_agent,
        )
    except ValueError as err:
        clear_refresh_cookie(response)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(err),
        ) from err

    set_refresh_cookie(response, new_refresh_token)

    return TokenResponse(
        access_token=new_access_token,
        token_type="bearer",
        refresh_token=new_refresh_token,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Revoke current user session",
)
async def logout_user(
    request: Request,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db_session)],
    payload: RefreshRequest | None = None,
) -> dict[str, str]:
    """Revoke active user refresh token session and clear HTTP cookie."""
    settings = get_settings()
    token = request.cookies.get(settings.REFRESH_TOKEN_COOKIE_NAME)
    if not token and payload and payload.refresh_token:
        token = payload.refresh_token

    if token:
        await revoke_session_by_token(db, token)

    clear_refresh_cookie(response)
    return {"message": "Logged out successfully."}


@router.post(
    "/logout-all",
    status_code=status.HTTP_200_OK,
    summary="Revoke all active user sessions",
)
async def logout_all_user_sessions(
    response: Response,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> dict[str, str]:
    """Revoke all active sessions for current user and clear HTTP cookie."""
    count = await revoke_all_user_sessions(db, current_user.id)
    clear_refresh_cookie(response)
    return {"message": f"Revoked {count} session(s) successfully."}


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get authenticated current user profile",
)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Return identity and status of currently authenticated user."""
    return current_user
