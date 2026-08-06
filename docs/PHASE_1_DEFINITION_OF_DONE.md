# PHASE 1 DEFINITION OF DONE — HUYỀN TÂM MINH ĐẠO

**International Name:** HuyenTam Wisdom  
**Document Version:** 1.0.0  
**Date:** 2026-08-06  

---

## 1. OBJECTIVE & COMPLIANCE STATEMENT

This document defines the mandatory exit criteria for **Phase 1: Foundation Setup**. Before any business features, AI consultations, payments, or Tarot modules are built in Phase 2 and beyond, ALL items in this Definition of Done MUST be satisfied, tested, and verified.

---

## 2. PHASE 1 EXIT CRITERIA CHECKLIST

### 2.1 Repository & Workspace Structure
- [ ] Git repository initialized (`git init`) with standard `.gitignore` and `.editorconfig`.
- [ ] Monorepo workspace directories established:
  - `/apps/web` (Next.js 14 frontend)
  - `/services/api` (FastAPI backend)
  - `/docs` (Architecture and specification documentation)
- [ ] Clean isolation from unrelated legacy or sample directories.

### 2.2 Frontend Foundation (`/apps/web`)
- [ ] Next.js 14 (App Router) initialized with TypeScript in strict mode.
- [ ] Tailwind CSS and shadcn/ui base design tokens configured.
- [ ] `next-intl` localization provider configured with base `vi` and `en` dictionaries.
- [ ] Command `npm run build` inside `apps/web` executes with zero compilation, lint, or type errors.

### 2.3 Backend Foundation (`/services/api`)
- [ ] Python 3.11+ FastAPI service initialized with Pydantic v2 settings management.
- [ ] `/health` endpoint returning HTTP 200 `{ "status": "ok" }`.
- [ ] Pydantic env validation enforcing required environment keys at startup.
- [ ] Pytest test runner configured and executing cleanly.

### 2.4 Database & Cache Connectivity
- [ ] Local `docker-compose.yml` providing PostgreSQL 15 and Redis 7 containers.
- [ ] Async SQLAlchemy 2.0 engine connected to PostgreSQL with connection pooling.
- [ ] Redis client initialized for caching and rate limiting.
- [ ] Database migration environment initialized via Alembic (`alembic upgrade head` runs cleanly).

### 2.5 Authentication & RBAC Foundation
- [ ] User and Profile SQLAlchemy models and migrations created.
- [ ] Password hashing mechanism (Argon2 / bcrypt) implemented.
- [ ] JWT token generation and verification middleware active.
- [ ] Role-Based Access Control (RBAC) claims (`user`, `admin`, `auditor`) supported in token payloads.

### 2.6 Error Handling & PII Log Scrubbing
- [ ] Global FastAPI exception handler active, returning standardized JSON error payloads.
- [ ] Middleware logging active, automatically redacting PII fields (passwords, birth dates, credit card numbers, prompt strings).

### 2.7 Security & Secret Baseline
- [ ] Zero secrets, API keys, or database passwords committed to Git.
- [ ] `.env.example` created documenting all mandatory environment variables with dummy values.
- [ ] SAST / secret scanner verification run with zero security findings.

### 2.8 Local Verification Command Suite
To confirm Phase 1 completion, the following command suite MUST execute cleanly with zero errors:

```bash
# 1. Verify Frontend Build & Lint
cd apps/web
npm run lint
npm run build

# 2. Verify Backend Tests & Migrations
cd ../../services/api
alembic upgrade head
pytest

# 3. Verify Docker Containers
docker compose ps
```
