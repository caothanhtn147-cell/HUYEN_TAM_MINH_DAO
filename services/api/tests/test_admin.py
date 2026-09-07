from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.db.session import get_db_session
from app.main import app
from app.models.audit_log import SystemAuditLog
from app.services.admin_service import (
    get_audit_logs,
    get_system_health_metrics,
    log_audit_event,
)

client = TestClient(app)


def get_mock_db_session():
    mock_db = AsyncMock()
    mock_db.add = MagicMock()
    mock_result = MagicMock()
    mock_result.scalar.return_value = 10
    mock_result.scalars.return_value.all.return_value = []
    mock_db.execute.return_value = mock_result
    return mock_db


async def override_get_db_session():
    yield get_mock_db_session()


app.dependency_overrides[get_db_session] = override_get_db_session


@pytest.mark.asyncio
async def test_admin_service_health_metrics() -> None:
    """Test compiling system health metrics."""
    mock_db = get_mock_db_session()

    metrics = await get_system_health_metrics(mock_db)
    assert metrics.api_status == "healthy"
    assert metrics.uptime_seconds >= 0.0
    assert metrics.database_connected is True
    assert metrics.redis_connected is True
    assert "gemini_flash_2.5" in metrics.ai_providers_status


@pytest.mark.asyncio
async def test_admin_audit_log_event() -> None:
    """Test creating and reading audit logs."""
    mock_db = get_mock_db_session()

    # Test log audit event
    log_entry = await log_audit_event(
        mock_db,
        action="SAFETY_PIPELINE_TRIGGERED",
        module="safety",
        details={"reason": "Self-harm classifier alert"},
        severity="safety_alert",
    )
    assert log_entry.action == "SAFETY_PIPELINE_TRIGGERED"
    assert log_entry.severity == "safety_alert"

    # Test get audit logs
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [
        SystemAuditLog(
            action="AI_FAILOVER",
            module="router",
            severity="warning",
            details={},
        )
    ]
    mock_db.execute.return_value = mock_result

    logs = await get_audit_logs(mock_db, severity="warning")
    assert len(logs) == 1
    assert logs[0].action == "AI_FAILOVER"


def test_admin_api_endpoints() -> None:
    """Test API endpoints /api/v1/admin/health-metrics and /audit-logs."""
    res_metrics = client.get("/api/v1/admin/health-metrics")
    assert res_metrics.status_code == status.HTTP_200_OK
    data_metrics = res_metrics.json()
    assert data_metrics["api_status"] == "healthy"
    assert "ai_providers_status" in data_metrics

    res_logs = client.get("/api/v1/admin/audit-logs")
    assert res_logs.status_code == status.HTTP_200_OK
    data_logs = res_logs.json()
    assert isinstance(data_logs, list)
