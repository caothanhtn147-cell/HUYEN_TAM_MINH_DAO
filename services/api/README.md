# HUYỀN TÂM MINH ĐẠO — Backend API Service (`services/api`)

FastAPI backend service foundation for HUYỀN TÂM MINH ĐẠO (HuyenTam Wisdom).

---

## 1. ENVIRONMENT SETUP & INSTALLED VERSIONS

- **Python Version:** `3.12.10`
- **Virtual Environment:** `services/api/.venv`
- **Framework:** FastAPI (`0.141.1`), Pydantic v2 (`2.13.4`), Pydantic Settings (`2.14.2`), Uvicorn (`0.52.1`).
- **Testing & Quality:** Pytest (`9.1.1`), Ruff (`0.16.1`), Mypy (`2.3.0`), HTTPX (`0.28.1`).

---

## 2. COMMAND REFERENCE

### Activate Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

### Run Local Development Server
```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Run Tests
```powershell
python -m pytest
```

### Run Code Quality Checks
```powershell
# Lint check
python -m ruff check .

# Format check
python -m ruff format --check .

# Type check
python -m mypy app
```

---

## 3. HEALTH ENDPOINTS

- `GET /health` — Root service health check (`{ "status": "ok", "service": "huyentam-api" }`).
- `GET /api/v1/health` — Versioned API health check (`{ "status": "ok", "service": "huyentam-api", "api_version": "v1" }`).
- `GET /docs` — OpenAPI / Swagger UI documentation.
- `GET /openapi.json` — OpenAPI JSON specification.

---

## 4. CURRENT STATUS

This package contains the backend API service foundation. No database connection, authentication, AI provider integrations, payment code, or business features exist yet.
