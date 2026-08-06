from fastapi import APIRouter, status
from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Root health check response payload."""

    status: str = "ok"
    service: str = "huyentam-api"


class VersionedHealthResponse(BaseModel):
    """API v1 versioned health check response payload."""

    status: str = "ok"
    service: str = "huyentam-api"
    api_version: str = "v1"


router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Root Service Health Check",
)
async def root_health_check() -> HealthResponse:
    """Return top-level service health status."""
    return HealthResponse()


@router.get(
    "/api/v1/health",
    response_model=VersionedHealthResponse,
    status_code=status.HTTP_200_OK,
    summary="API v1 Health Check",
)
async def versioned_health_check() -> VersionedHealthResponse:
    """Return versioned API health status."""
    return VersionedHealthResponse()
