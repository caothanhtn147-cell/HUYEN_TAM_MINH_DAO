# HUYỀN TÂM MINH ĐẠO — Backend API Service (`services/api`)

FastAPI backend service foundation for HUYỀN TÂM MINH ĐẠO (HuyenTam Wisdom).

---

## 1. ENVIRONMENT SETUP & INSTALLED VERSIONS

- **Python Version:** `3.12.10`
- **Virtual Environment:** `services/api/.venv`
- **Framework:** FastAPI (`0.141.1`), Pydantic v2 (`2.13.4`), Pydantic Settings (`2.14.2`), Uvicorn (`0.52.1`).
- **Database Stack:** SQLAlchemy 2.0 (`2.0.51`), asyncpg (`0.31.0`), Alembic (`1.19.0`), PostgreSQL 16 (`16.8`).
- **Cryptography & Security:** `cryptography` (`50.0.0`) implementing AES-256-GCM authenticated encryption for sensitive profile fields.
- **Testing & Quality:** Pytest (`9.1.1`), pytest-asyncio (`1.4.0`), Ruff (`0.16.1`), Mypy (`2.3.0`), HTTPX (`0.28.1`).

---

## 2. COMMAND REFERENCE

### Activate Virtual Environment
```powershell
.\.venv\Scripts\Activate.ps1
```

### Generating Local Encryption Key (Development Only)
```powershell
python -c "import base64, os; print(base64.b64encode(os.urandom(32)).decode('utf-8'))"
```

> [!CAUTION]
> **ENCRYPTION KEY SECURITY:** `PROFILE_ENCRYPTION_KEY` must be a valid Base64-encoded 32-byte string supplied via environment variable or local ignored `.env`. **NEVER commit real encryption keys or reuse local development keys in staging/production environment.**

### Start PostgreSQL Local Container
```powershell
cd ../..
docker compose up -d postgres
cd services/api
```

### Database Migration Commands (Alembic)
```powershell
# View current migration revision
python -m alembic current

# View migration history
python -m alembic history

# Apply all pending migrations to head (creates users, roles, user_roles, profiles)
python -m alembic upgrade head

# Downgrade to base (empty schema)
python -m alembic downgrade base
```

### Run Local Development Server
```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Run Tests
```powershell
# Unit, crypto & non-database tests (runs cleanly without Docker or PostgreSQL)
python -m pytest -m "not integration"

# Database integration tests (requires PostgreSQL container)
python -m pytest -m integration

# Full test suite (requires PostgreSQL container)
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

> [!IMPORTANT]
> **DATABASE CREDENTIAL SECURITY:** `DATABASE_URL` is loaded dynamically from your local environment or `.env` file at runtime. **NEVER hard-code database passwords or live secrets in source code (`config.py`, `env.py`, `alembic.ini`).** The default `DATABASE_URL` in `Settings` contains an invalid placeholder to ensure secrets are never committed.

---

## 3. HEALTH ENDPOINTS

- `GET /health` — Root service health check (`{ "status": "ok", "service": "huyentam-api" }`).
- `GET /api/v1/health` — Versioned API health check (`{ "status": "ok", "service": "huyentam-api", "api_version": "v1" }`).
- `GET /docs` — OpenAPI / Swagger UI documentation.
- `GET /openapi.json` — OpenAPI JSON specification.

---

## 4. CURRENT STATUS

Task `HT-006` completed. Core domain persistence models (`User`, `Role`, `UserRole`, `UserProfile`) and Alembic migration `63b0608fd00a_users_and_encrypted_profiles` are operational. Sensitive birth-related attributes (`birth_date`, `birth_time`, `birth_location`) are protected using application-layer AES-256-GCM authenticated encryption stored in `BYTEA` columns with zero plaintext leakage. **Authentication endpoints, passwords, JWT, AI routers, and payment systems do NOT exist yet.**
