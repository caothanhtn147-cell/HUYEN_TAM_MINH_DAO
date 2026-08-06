# HUYỀN TÂM MINH ĐẠO — Local Infrastructure Guide (`infra/`)

This directory and root `compose.yaml` define the containerized local development infrastructure for **HUYỀN TÂM MINH ĐẠO** (HuyenTam Wisdom).

---

## 1. INFRASTRUCTURE OVERVIEW

- **PostgreSQL Database:** `postgres:16-alpine` (Container: `huyentam_postgres`)
- **Redis Cache & Session Store:** `redis:7-alpine` (Container: `huyentam_redis`)
- **Network:** Isolated bridge network `huyentam_network`
- **Port Bindings:** Bound strictly to `127.0.0.1` (localhost only)
  - PostgreSQL: `127.0.0.1:5432`
  - Redis: `127.0.0.1:6379`
- **Data Persistence:** Named Docker volumes (`huyentam_postgres_data`, `huyentam_redis_data`)

---

## 2. PREREQUISITES & SETUP

1. Install **Docker Desktop** on Windows with WSL2 backend.
2. Start Docker Desktop and verify the daemon is running.
3. Copy `.env.example` to `.env` in the repository root to customize local passwords:
   ```powershell
   Copy-Item .env.example .env
   ```

---

## 3. CONTAINER MANAGEMENT COMMANDS

### Validate Configuration
```powershell
docker compose config
```

### Pull Container Images
```powershell
docker compose pull
```

### Start Local Services in Background
```powershell
docker compose up -d
```

### Check Container Status & Health
```powershell
docker compose ps
```

### Inspect Container Logs
```powershell
# PostgreSQL logs
docker compose logs postgres

# Redis logs
docker compose logs redis

# Follow live logs
docker compose logs -f
```

### Stop Local Services (Preserving Data)
```powershell
docker compose down
```

> [!WARNING]
> **DATA LOSS WARNING:** Running `docker compose down -v` will **permanently delete** your local PostgreSQL and Redis development data volumes. Use standard `docker compose down` for normal development stops.

---

## 4. HEALTHCHECK & CONNECTION VERIFICATION

### PostgreSQL
- **Host:** `127.0.0.1` (Port `5432`)
- **Database:** `huyentam`
- **User:** `huyentam`
- **Healthcheck Command:**
  ```powershell
  docker compose exec -T postgres pg_isready -U huyentam -d huyentam
  ```
- **Test Query:**
  ```powershell
  docker compose exec -T postgres psql -U huyentam -d huyentam -c "SELECT 1;"
  ```

### Redis
- **Host:** `127.0.0.1` (Port `6379`)
- **Healthcheck Command:**
  ```powershell
  docker compose exec -T redis redis-cli ping
  ```
  *(Expected output: `PONG`)*

---

## 5. LOCAL SECURITY & TROUBLESHOOTING

- **Local Development Security Only:** Database and Redis services bind only to `127.0.0.1` (localhost) to prevent external network exposure. Production deployments require TLS encryption, private VPC networking, and strict access controls.
- **Port Conflict Troubleshooting:** If port `5432` or `6379` is already in use by a local PostgreSQL or Redis service on your host machine, update `POSTGRES_PORT` or `REDIS_PORT` in your local `.env` file before running `docker compose up -d`.
