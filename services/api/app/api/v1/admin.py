import logging
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.admin import SystemAuditLogSchema, SystemHealthMetricsResponse
from app.services.admin_service import (
    get_audit_logs,
    get_system_health_metrics,
    log_audit_event,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/admin", tags=["Admin Governance & Audit Metrics"])


@router.get(
    "/health-metrics",
    response_model=SystemHealthMetricsResponse,
    summary="Trạng thái sức khỏe hệ thống & chỉ số hoạt động",
    status_code=status.HTTP_200_OK,
)
async def get_health_metrics(
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> SystemHealthMetricsResponse:
    """Retrieve real-time operational, safety, and health metrics."""
    try:
        metrics = await get_system_health_metrics(db)
        return metrics
    except Exception as err:
        logger.error(f"Error compiling system health metrics: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể lấy chỉ số sức khỏe hệ thống.",
        ) from err


@router.get(
    "/audit-logs",
    response_model=list[SystemAuditLogSchema],
    summary="Danh sách nhật ký kiểm toán hệ thống (System Audit Logs)",
    status_code=status.HTTP_200_OK,
)
async def list_audit_logs(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    severity: Annotated[
        str | None,
        Query(description="Lọc theo mức độ nghiêm trọng (info, warning, safety_alert)"),
    ] = None,
    limit: Annotated[int, Query(ge=1, le=200)] = 50,
) -> list[SystemAuditLogSchema]:
    """Retrieve audit logs timeline."""
    try:
        logs = await get_audit_logs(db, severity=severity, limit=limit)
        return [SystemAuditLogSchema.model_validate(log) for log in logs]
    except Exception as err:
        logger.error(f"Error fetching audit logs: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể tải nhật ký kiểm toán hệ thống.",
        ) from err


@router.post(
    "/audit-logs",
    response_model=SystemAuditLogSchema,
    summary="Ghi nhận sự kiện kiểm toán mới",
    status_code=status.HTTP_201_CREATED,
)
async def create_audit_log(
    action: str,
    module: str,
    details: dict[str, Any],
    db: Annotated[AsyncSession, Depends(get_db_session)],
    severity: str = "info",
) -> SystemAuditLogSchema:
    """Manually trigger a system audit log event."""
    try:
        log_entry = await log_audit_event(
            db, action=action, module=module, details=details, severity=severity
        )
        return SystemAuditLogSchema.model_validate(log_entry)
    except Exception as err:
        logger.error(f"Error creating audit log event: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể ghi nhận sự kiện kiểm toán.",
        ) from err
