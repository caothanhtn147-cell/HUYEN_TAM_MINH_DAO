import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegisterRequest(BaseModel):
    """Schema for user registration payload."""

    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(
        ..., min_length=8, description="Plaintext password (min 8 chars)"
    )
    full_name: str | None = Field(
        default=None, max_length=255, description="Optional profile full name"
    )


class UserLoginRequest(BaseModel):
    """Schema for user login credentials."""

    email: str = Field(..., description="User login email address")
    password: str = Field(..., description="User plaintext password")


class TokenResponse(BaseModel):
    """Schema for authentication token issuance response."""

    access_token: str = Field(..., description="JWT Bearer access token")
    token_type: str = Field(default="bearer", description="Token authorization type")
    refresh_token: str | None = Field(
        default=None, description="Optional raw refresh token for non-cookie clients"
    )


class RefreshRequest(BaseModel):
    """Schema for manual refresh token payload when cookies are disabled."""

    refresh_token: str | None = Field(
        default=None, description="Raw refresh token string"
    )


class UserResponse(BaseModel):
    """Schema for user identity representation."""

    id: uuid.UUID
    email: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
