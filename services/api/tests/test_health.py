from fastapi.testclient import TestClient


def test_root_health_endpoint(client: TestClient) -> None:
    """Verify HTTP 200 response and JSON payload for /health."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "huyentam-api"


def test_versioned_health_endpoint(client: TestClient) -> None:
    """Verify HTTP 200 response and JSON payload for /api/v1/health."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "huyentam-api"
    assert data["api_version"] == "v1"


def test_unknown_route_returns_404(client: TestClient) -> None:
    """Verify unknown route returns HTTP 404."""
    response = client.get("/api/v1/unknown-route")
    assert response.status_code == 404
