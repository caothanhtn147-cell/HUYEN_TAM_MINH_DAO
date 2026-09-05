from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.models.user_profile import UserProfile
from app.schemas.auth import (
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

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


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

    # Check for existing email in DB (case-insensitive check)
    result = await db.execute(select(User).where(User.email == normalized_email))
    existing_user = result.scalar_one_or_none()
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already registered.",
        )

    # Create new User instance with hashed password
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
    summary="Authenticate user and issue JWT access token",
)
async def login_user(
    payload: UserLoginRequest,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TokenResponse:
    """Authenticate user credentials and issue JWT Bearer access token."""
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

    access_token = create_access_token(user.id)
    return TokenResponse(access_token=access_token, token_type="bearer")


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
