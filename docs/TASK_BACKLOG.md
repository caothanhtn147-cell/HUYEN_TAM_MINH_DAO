# TASK BACKLOG — HUYỀN TÂM MINH ĐẠO

**International Name:** HuyenTam Wisdom  
**Document Version:** 1.0.0  
**Date:** 2026-08-06  

---

## 1. BACKLOG RULES & TASK GRANULARITY

All development work is divided into small, independent tasks. Each task must have clear completion boundaries, explicit file lists, automated test requirements, and a defined model capability recommendation.

---

## 2. DETAILED TASK LIST

### HT-001: Initialize Monorepo & Git Repository Foundation
- **Task ID**: `HT-001`
- **Name**: Monorepo & Git Repository Foundation Setup
- **Objective**: Initialize Git tracking, standard `.gitignore`, `.editorconfig`, and create initial directory layout for `/apps/web` and `/services/api`.
- **Scope**: Git initialization, directory structure creation, root documentation setup.
- **Out of Scope**: Framework package installations, database setup.
- **Dependencies**: None.
- **Files Involved**: `.gitignore`, `.editorconfig`, `README.md`.
- **Required Tests**: `git status` verification.
- **Definition of Done**: Clean git status with correct untracked rule exclusions.
- **Risk Level**: Low.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: No.

---

### HT-002: Next.js Frontend Package Initialization
- **Task ID**: `HT-002`
- **Name**: Next.js 14 App Router Framework Initialization
- **Objective**: Initialize `/apps/web` with Next.js 14, TypeScript strict mode, Tailwind CSS, and base ESLint config.
- **Scope**: Frontend bootstrap, TypeScript config validation, build setup.
- **Out of Scope**: Custom pages, backend connection.
- **Dependencies**: `HT-001`.
- **Files Involved**: `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/tailwind.config.js`.
- **Required Tests**: `npm run build` inside `apps/web`.
- **Definition of Done**: Frontend compiles without TypeScript or ESLint errors.
- **Risk Level**: Low.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: No.

---

### HT-003: FastAPI Backend Service Initialization
- **Task ID**: `HT-003`
- **Name**: FastAPI Python Package & Healthcheck Endpoint
- **Objective**: Bootstrap `/services/api` with Python 3.11, FastAPI, Pydantic v2, and a `/health` endpoint.
- **Scope**: FastAPI service entrypoint, healthcheck router, Pydantic settings.
- **Out of Scope**: Database ORM, Auth logic.
- **Dependencies**: `HT-001`.
- **Files Involved**: `services/api/pyproject.toml`, `services/api/main.py`, `services/api/app/config.py`.
- **Required Tests**: `pytest` verifying HTTP 200 on `/health`.
- **Definition of Done**: FastAPI server boots cleanly and `/health` returns `{ "status": "ok" }`.
- **Risk Level**: Low.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: No.

---

### HT-004: PostgreSQL & Redis Docker Local Environment Setup
- **Task ID**: `HT-004`
- **Name**: Docker Compose Local Infrastructure Setup
- **Objective**: Create `docker-compose.yml` for local PostgreSQL 15 and Redis 7 services.
- **Scope**: Container configuration, health check scripts, environment variable bindings.
- **Out of Scope**: Production infrastructure.
- **Dependencies**: `HT-001`.
- **Files Involved**: `docker-compose.yml`, `.env.example`.
- **Required Tests**: Container boot and port connectivity check (`5432` and `6379`).
- **Definition of Done**: Local DB and Redis containers launch cleanly via `docker compose up`.
- **Risk Level**: Low.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: Yes (run Docker desktop).

---

### HT-005: Database Migration Foundation (Alembic & SQLAlchemy)
- **Task ID**: `HT-005`
- **Name**: Alembic & SQLAlchemy 2.0 Engine Setup
- **Objective**: Configure async SQLAlchemy engine and Alembic migration environment in backend.
- **Scope**: Alembic `env.py` configuration, base model declaration, initial empty migration test.
- **Out of Scope**: Business entity schemas.
- **Dependencies**: `HT-003`, `HT-004`.
- **Files Involved**: `services/api/alembic.ini`, `services/api/app/db/session.py`, `services/api/app/db/base.py`.
- **Required Tests**: `alembic upgrade head` test against local PostgreSQL container.
- **Definition of Done**: Alembic runs migrations up and down cleanly without SQL errors.
- **Risk Level**: Medium.
- **Recommended Model**: Flash / Pro.
- **Owner Manual Testing Required**: No.

---

### HT-006: User & Profile Database Schema Implementation
- **Task ID**: `HT-006`
- **Name**: Users and Encrypted Profiles Migration & Models
- **Objective**: Implement SQLAlchemy models and Alembic migration for `users` and `profiles` tables with AES-256 encrypted birth fields.
- **Scope**: Database models, Pydantic schemas, field encryption helper.
- **Out of Scope**: Auth API routes.
- **Dependencies**: `HT-005`.
- **Files Involved**: `services/api/app/models/user.py`, `services/api/app/models/profile.py`, `services/api/app/core/security.py`.
- **Required Tests**: Pytest testing creation of user with encrypted birth date and decryption verification.
- **Definition of Done**: Unit tests verify field encryption at rest in PostgreSQL.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-007: Supabase / Local JWT Authentication Foundation
- **Task ID**: `HT-007`
- **Name**: Authentication Service & Password Hashing
- **Objective**: Implement user registration, login, JWT token issuance, and password hashing (Argon2 / bcrypt).
- **Scope**: `/api/v1/auth/register` and `/api/v1/auth/login` endpoints, bearer token dependency.
- **Out of Scope**: UI integration.
- **Dependencies**: `HT-006`.
- **Files Involved**: `services/api/app/api/v1/endpoints/auth.py`, `services/api/app/core/jwt.py`.
- **Required Tests**: Integration tests for valid login, wrong password rejection, and expired JWT handling.
- **Definition of Done**: Auth endpoints return valid JWT access tokens upon correct authentication.
- **Risk Level**: High.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-008: Frontend Multilingual Localization Setup (next-intl)
- **Task ID**: `HT-008`
- **Name**: Frontend Localization Catalog & Provider Setup
- **Objective**: Integrate `next-intl` into `/apps/web` with initial Vietnamese (`vi`) and English (`en`) message dictionaries.
- **Scope**: Locale middleware, translation JSON files, header language switcher component.
- **Out of Scope**: Complete page copy translation.
- **Dependencies**: `HT-002`.
- **Files Involved**: `apps/web/i18n.ts`, `apps/web/messages/vi.json`, `apps/web/messages/en.json`, `apps/web/middleware.ts`.
- **Required Tests**: Next.js build verification and locale routing test (`/vi` vs `/en`).
- **Definition of Done**: Switching locale URL alters rendered navigation text accurately without errors.
- **Risk Level**: Low.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: Yes.

---

### HT-009: Immutable Credit Ledger & Wallet Schema
- **Task ID**: `HT-009`
- **Name**: Wallets & Append-Only Credit Ledger DB Engine
- **Objective**: Implement `wallets` and `credit_ledger` tables with DB triggers blocking `UPDATE`/`DELETE` on ledger entries.
- **Scope**: Models, migration, idempotency key constraint, transaction service functions.
- **Out of Scope**: Payment gateway integration.
- **Dependencies**: `HT-006`.
- **Files Involved**: `services/api/app/models/wallet.py`, `services/api/app/models/ledger.py`, `services/api/app/services/ledger_service.py`.
- **Required Tests**: Pytest testing credit deposit, credit deduction, balance calculation, and rejection of duplicate idempotency key.
- **Definition of Done**: Tests pass for wallet balance integrity and ledger immutability enforcement.
- **Risk Level**: Critical.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-010: AI Provider Adapter Interface & Mock Provider
- **Task ID**: `HT-010`
- **Name**: Provider-Agnostic AI Adapter Interface
- **Objective**: Create `BaseAIProvider` abstract class and a `MockAIProvider` for testing without API keys.
- **Scope**: Interface definition, Pydantic response models, mock provider implementation.
- **Out of Scope**: Live OpenAI/Anthropic network calls.
- **Dependencies**: `HT-003`.
- **Files Involved**: `services/api/app/ai/base.py`, `services/api/app/ai/mock_provider.py`, `services/api/app/ai/schemas.py`.
- **Required Tests**: Pytest verifying `MockAIProvider` returns expected structured consultation output.
- **Definition of Done**: Clean unit tests demonstrating provider interface swappability.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-011: Pre & Post AI Safety Reviewer Engine
- **Task ID**: `HT-011`
- **Name**: Dual-Pass AI Safety Pipeline Engine
- **Objective**: Build pre-execution crisis classifier and post-execution "Compassionate Candor" enforcer.
- **Scope**: Safety classifier, crisis keyword rules, emergency response payload generator.
- **Out of Scope**: Live LLM fine-tuning.
- **Dependencies**: `HT-010`.
- **Files Involved**: `services/api/app/ai/safety_reviewer.py`, `services/api/app/ai/crisis_detector.py`.
- **Required Tests**: Suite of 20+ safety test prompts verifying crisis detection and forbidden output masking.
- **Definition of Done**: 100% pass on crisis redirection tests; forbidden claims automatically flagged.
- **Risk Level**: Critical.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-012: Live AI Provider Adapters (OpenAI & Anthropic & Gemini)
- **Task ID**: `HT-012`
- **Name**: Live LLM Provider Adapters Integration
- **Objective**: Implement concrete adapters for OpenAI (`GPT-4o`), Anthropic (`Claude 3.5 Sonnet`), and Google (`Gemini 1.5 Pro`).
- **Scope**: SDK wrappers, structured JSON mode parsing, fallback mechanism.
- **Out of Scope**: UI components.
- **Dependencies**: `HT-010`.
- **Files Involved**: `services/api/app/ai/openai_adapter.py`, `services/api/app/ai/anthropic_adapter.py`, `services/api/app/ai/gemini_adapter.py`.
- **Required Tests**: Unit tests with mocked HTTP network responses.
- **Definition of Done**: Adapters parse structured output correctly and handle API network failures gracefully.
- **Risk Level**: High.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-013: Payment Webhook Handler & Signed Validation
- **Task ID**: `HT-013`
- **Name**: Secure Payment Webhook Receiver
- **Objective**: Build `/api/v1/payments/webhook` endpoint with HMAC-SHA256 signature verification and credit ledger execution.
- **Scope**: Webhook signature verification, idempotency tracking, wallet top-up call.
- **Out of Scope**: Direct bank integration.
- **Dependencies**: `HT-009`.
- **Files Involved**: `services/api/app/api/v1/endpoints/payments.py`, `services/api/app/services/payment_service.py`.
- **Required Tests**: Pytest verifying invalid signatures are rejected (HTTP 401) and valid webhooks credit the user wallet exactly once.
- **Definition of Done**: Replay attack test fails; valid payload correctly credits user ledger.
- **Risk Level**: Critical.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-014: Minh Kiến Session Backend API & Token Streaming
- **Task ID**: `HT-014`
- **Name**: Minh Kiến Consultation Session Endpoint & SSE Streaming
- **Objective**: Implement `/api/v1/sessions/minh-kien` supporting credit check, safety pipeline execution, SSE streaming, and ledger deduction.
- **Scope**: Session creation endpoint, SSE response generator, usage token accounting.
- **Out of Scope**: Frontend UI rendering.
- **Dependencies**: `HT-009`, `HT-011`, `HT-012`.
- **Files Involved**: `services/api/app/api/v1/endpoints/sessions.py`, `services/api/app/services/consultation_service.py`.
- **Required Tests**: Pytest testing complete session lifecycle from balance check to stream completion.
- **Definition of Done**: Session endpoint streams valid 10-point structured output and deducts correct Linh Điểm balance.
- **Risk Level**: High.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-015: Minh Kiến Consultation Frontend UI & Stream View
- **Task ID**: `HT-015`
- **Name**: Minh Kiến Interactive Consultation UI Component
- **Objective**: Build responsive Next.js consultation interface displaying real-time SSE stream, 10-point output cards, and wallet balance indicator.
- **Scope**: Client component, EventSource streaming hook, responsive card layout, tailwind styling.
- **Out of Scope**: Custom PDF export.
- **Dependencies**: `HT-008`, `HT-014`.
- **Files Involved**: `apps/web/app/[locale]/minh-kien/page.tsx`, `apps/web/components/consultation/StreamView.tsx`.
- **Required Tests**: Next.js client component build and render test.
- **Definition of Done**: UI renders 10-point cards dynamically as tokens stream from backend API.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: Yes.

---

### HT-016: Tarot Cards Deck Library & Draw API
- **Task ID**: `HT-016`
- **Name**: Tarot Card Catalog Schema & Draw Endpoint
- **Objective**: Database seed for standard 78 Tarot cards (with psychological mirror interpretations) and card draw API endpoint.
- **Scope**: Tarot card model, seed script, random draw service with user intention parameter.
- **Out of Scope**: Graphical card flip animation.
- **Dependencies**: `HT-006`.
- **Files Involved**: `services/api/app/models/tarot.py`, `services/api/app/services/tarot_service.py`, `services/api/seeds/tarot_seed.py`.
- **Required Tests**: Pytest testing card draw mechanics and seed verification.
- **Definition of Done**: API returns valid card draw payloads containing non-predictive psychological mirror copy.
- **Risk Level**: Medium.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: No.

---

### HT-017: Tarot Draw Interactive UI Component
- **Task ID**: `HT-017`
- **Name**: Interactive Tarot Draw & Card Presentation UI
- **Objective**: Build animated card draw UI with Framer Motion card flips and symbolic interpretation view.
- **Scope**: Client component, card flip animation, evidence label tags (`[SYMC]`).
- **Out of Scope**: Paid custom Tarot report PDF.
- **Dependencies**: `HT-008`, `HT-016`.
- **Files Involved**: `apps/web/app/[locale]/tarot/page.tsx`, `apps/web/components/tarot/CardFlip.tsx`.
- **Required Tests**: UI build test and mobile viewport rendering check.
- **Definition of Done**: Card flip micro-animations perform smoothly on mobile and desktop viewports.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: Yes.

---

### HT-018: Dưỡng Đạo Lifestyle Knowledge Base API
- **Task ID**: `HT-018`
- **Name**: Dưỡng Đạo Educational Content API & Health Boundary Filter
- **Objective**: Build educational content endpoints for daily lifestyle, Nam Y history, and seasonal wellness with mandatory disclaimer enforcement.
- **Scope**: Knowledge base models, API endpoints, automated disclaimer injection.
- **Out of Scope**: Medical symptom checker (forbidden).
- **Dependencies**: `HT-006`.
- **Files Involved**: `services/api/app/models/wellness.py`, `services/api/app/api/v1/endpoints/wellness.py`.
- **Required Tests**: Pytest verifying mandatory medical disclaimer is attached to every output.
- **Definition of Done**: Endpoints return educational articles with verified disclaimers and zero diagnostic language.
- **Risk Level**: High.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-019: Dưỡng Đạo Public UI Pages & Article Viewer
- **Task ID**: `HT-019`
- **Name**: Dưỡng Đạo Public Knowledge Portal UI
- **Objective**: Build clean, modern UI for Dưỡng Đạo lifestyle portal, seasonal routine guides, and pre-doctor question helper.
- **Scope**: Responsive landing page, article viewer, prominent educational disclaimers.
- **Out of Scope**: Prescription calculators (forbidden).
- **Dependencies**: `HT-008`, `HT-018`.
- **Files Involved**: `apps/web/app/[locale]/duong-dao/page.tsx`, `apps/web/components/wellness/DisclaimerFooter.tsx`.
- **Required Tests**: Mobile responsiveness check and i18n copy verification.
- **Definition of Done**: Educational layout renders cleanly with fixed disclaimer footer on all devices.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: Yes.

---

### HT-020: "Lá Thư Huyền Tâm" PDF Report Generator Engine
- **Task ID**: `HT-020`
- **Name**: PDF Synthesizer Engine & Cloud Storage Upload
- **Objective**: Build backend service generating customized PDF reports synthesizing consultation history, life action plans, and philosophical reflections.
- **Scope**: PDF template renderer, R2 / Supabase Storage upload, signed URL generator.
- **Out of Scope**: Direct printing service.
- **Dependencies**: `HT-014`.
- **Files Involved**: `services/api/app/services/pdf_service.py`, `services/api/templates/reports/la_thu.html`.
- **Required Tests**: Pytest generating valid sample PDF binary and verifying non-empty output.
- **Definition of Done**: Engine generates clean, multi-page PDF document stored in storage bucket.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-021: Admin Dashboard API & Immutable Audit Logs Viewer
- **Task ID**: `HT-021`
- **Name**: Admin Management API & Audit Logging Endpoint
- **Objective**: Build `/api/v1/admin` endpoints for viewing system metrics, user RBAC management, and immutable audit logs.
- **Scope**: Admin endpoints, RBAC middleware checks, audit log query router.
- **Out of Scope**: Raw user prompt text viewing (privacy restricted).
- **Dependencies**: `HT-007`.
- **Files Involved**: `services/api/app/api/v1/endpoints/admin.py`, `services/api/app/services/audit_service.py`.
- **Required Tests**: Pytest verifying non-admin users receive HTTP 403 Forbidden.
- **Definition of Done**: Strict RBAC enforcement verified by automated tests.
- **Risk Level**: High.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-022: User Account Deletion & Anonymization Engine
- **Task ID**: `HT-022`
- **Name**: Account Deletion & Financial Anonymization Worker
- **Objective**: Build GDPR-compliant "Right to be Forgotten" service that deletes personal profiles while anonymizing financial ledger records.
- **Scope**: `/api/v1/users/me/delete` endpoint, database anonymization query.
- **Out of Scope**: Third-party payment gateway deletion.
- **Dependencies**: `HT-006`, `HT-009`.
- **Files Involved**: `services/api/app/services/user_service.py`, `services/api/app/api/v1/endpoints/users.py`.
- **Required Tests**: Pytest verifying profile records are deleted and credit ledger records are anonymized without breaking FK integrity.
- **Definition of Done**: Account deletion succeeds cleanly while leaving financial audit logs intact and un-linkable to user PII.
- **Risk Level**: Critical.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-023: Automated AI Safety Regression Test Suite
- **Task ID**: `HT-023`
- **Name**: Safety & Compliance Automated Regression Suite
- **Objective**: Build automated test runner executing 50+ synthetic test cases verifying safety boundaries (crisis detection, zero fortune telling, zero medical advice).
- **Scope**: Test runner script, test prompt dataset, compliance report exporter.
- **Out of Scope**: Manual QA testing.
- **Dependencies**: `HT-011`, `HT-014`.
- **Files Involved**: `services/api/tests/safety/test_safety_suite.py`, `services/api/tests/safety/fixtures/prompt_cases.json`.
- **Required Tests**: Executing full safety regression suite in CI.
- **Definition of Done**: 100% pass rate on safety test cases; zero violation leakage.
- **Risk Level**: High.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: No.

---

### HT-024: End-to-End Integration & Load Testing Setup
- **Task ID**: `HT-024`
- **Name**: E2E Integration Suite & Performance Baseline
- **Objective**: Configure Playwright E2E tests for web client and Locust scripts for API performance benchmarking.
- **Scope**: E2E user flow tests (register -> top-up mock -> consultation -> history view), load testing scripts.
- **Out of Scope**: Production stress testing.
- **Dependencies**: `HT-015`, `HT-017`, `HT-019`.
- **Files Involved**: `apps/web/e2e/consultation.spec.ts`, `services/api/tests/locustfile.py`.
- **Required Tests**: Clean execution of Playwright test suite.
- **Definition of Done**: E2E test passes cleanly on local development build.
- **Risk Level**: Medium.
- **Recommended Model**: Pro.
- **Owner Manual Testing Required**: Yes.

---

### HT-025: Production Environment Documentation & CI Checkers
- **Task ID**: `HT-025`
- **Name**: Production Deployment Runbook & GitHub Actions Workflow
- **Objective**: Create GitHub Actions CI workflow (linting, typechecks, tests) and production deployment guide.
- **Scope**: `.github/workflows/ci.yml`, `docs/DEPLOYMENT_RUNBOOK.md`.
- **Out of Scope**: Live domain provisioning.
- **Dependencies**: All prior tasks.
- **Files Involved**: `.github/workflows/ci.yml`, `docs/DEPLOYMENT_RUNBOOK.md`.
- **Required Tests**: GitHub Actions CI workflow validation.
- **Definition of Done**: CI pipeline triggers and executes tests cleanly on pull requests.
- **Risk Level**: Medium.
- **Recommended Model**: Flash.
- **Owner Manual Testing Required**: No.
