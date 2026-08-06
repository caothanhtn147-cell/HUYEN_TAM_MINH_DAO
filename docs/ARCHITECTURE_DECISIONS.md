# ARCHITECTURE DECISION RECORDS (ADR) — HUYỀN TÂM MINH ĐẠO

**International Name:** HuyenTam Wisdom  
**Document Version:** 1.0.0  
**Date:** 2026-08-06  

---

## ADR-001: Workspace Repository Structure — Monorepo Architecture

- **Status**: **ACCEPTED**
- **Context**: We need to manage code for the Next.js frontend (`apps/web`), FastAPI backend (`services/api`), shared environment variables, and documentation.
- **Decision**: Adopt a lightweight Monorepo structure with `/apps/web` for frontend and `/services/api` for backend.
- **Consequences**:
  - *Positive*: Single repository for end-to-end versioning, simplified CI/CD, unified documentation.
  - *Negative*: Requires clear directory scoping in CI scripts to prevent unnecessary full builds.

---

## ADR-002: Frontend Framework — Next.js App Router & TypeScript Strict

- **Status**: **ACCEPTED**
- **Context**: The web application requires high SSR performance, SEO optimization for public Dưỡng Đạo educational articles, dynamic routing, and strict type safety.
- **Decision**: Use Next.js 14+ with App Router, React 18, Tailwind CSS, shadcn/ui, and TypeScript in strict mode.
- **Consequences**:
  - *Positive*: Excellent SEO, fast page loads, rich UI components via shadcn/ui, type safety.
  - *Negative*: Strict SSR vs Client Component boundary management required.

---

## ADR-003: Backend Framework — FastAPI (Python 3.11+)

- **Status**: **ACCEPTED**
- **Context**: Backend requires high-performance asynchronous request handling, native Pydantic validation for structured AI outputs, and rich ecosystem support for data processing.
- **Decision**: Use FastAPI with Python 3.11+ and Pydantic v2 schemas.
- **Consequences**:
  - *Positive*: Outstanding speed, automatic OpenAPI/Swagger documentation, seamless integration with AI provider SDKs and Pydantic schemas.
  - *Negative*: Asynchronous DB patterns (`asyncpg`) must be carefully managed to avoid thread blocking.

---

## ADR-004: Primary Database — PostgreSQL with Async SQLAlchemy & Alembic

- **Status**: **ACCEPTED**
- **Context**: Financial transactions, credit ledgers, user accounts, and session data require strict relational ACID guarantees and version-controlled schema migrations.
- **Decision**: Use PostgreSQL 15+ managed instance with async SQLAlchemy 2.0 ORM and Alembic migrations.
- **Consequences**:
  - *Positive*: Robust ACID transactions, JSONB column support for metadata, rock-solid reliability for financial ledgers.
  - *Negative*: DB connection pool tuning required for high-concurrency SSE streaming sessions.

---

## ADR-005: Authentication Strategy — Supabase Auth Foundation / JWT

- **Status**: **ACCEPTED**
- **Context**: User login needs to support email/password authentication, social logins, role-based access control (RBAC), and secure JWT tokens.
- **Decision**: Use Supabase Auth (or compatible OAuth/JWT server engine) with backend FastAPI JWT token verification middleware.
- **Consequences**:
  - *Positive*: Fast implementation of secure password hashing, social logins, and RBAC token claims.
  - *Negative*: Deep dependency on JWT expiration lifecycle; refresh token rotation must be implemented securely.

---

## ADR-006: AI Provider Layer — Multi-Provider Adapter Engine

- **Status**: **ACCEPTED**
- **Context**: Single LLM provider dependency introduces downtime risks and vendor lock-in.
- **Decision**: Build an internal `BaseAIProvider` abstraction supporting OpenAI, Anthropic Claude, and Google Gemini with automatic failover.
- **Consequences**:
  - *Positive*: Zero vendor lock-in; operational redundancy; cost optimization per task.
  - *Negative*: Must maintain normalization layer for provider-specific structured JSON output modes.

---

## ADR-007: Credit Ledger Architecture — Append-Only Double-Entry Ledger

- **Status**: **ACCEPTED**
- **Context**: Wallet balances ("Linh Điểm") must be audit-proof and immune to race conditions or duplicate top-ups.
- **Decision**: Implement an append-only transaction ledger (`credit_ledger`) with database triggers preventing `UPDATE` or `DELETE` operations.
- **Consequences**:
  - *Positive*: Complete auditability; zero lost funds; clear idempotency tracking.
  - *Negative*: Wallet balance queries require snapshot caching (`wallets.cached_balance`) to optimize read performance.

---

## ADR-008: Payment Gateway Integration Strategy

- **Status**: **PROPOSED**
- **Context**: Target users include both domestic Vietnamese users (preferring MoMo, VNPay, domestic bank transfers) and international/overseas Vietnamese users (preferring international credit cards).
- **Decision**: Implement a dual adapter interface: Stripe for international credit cards, domestic payment gateway adapters for Vietnam.
- **Consequences**:
  - *Positive*: High conversion across all target demographics.
  - *Negative*: Maintenance of two distinct payment adapter integrations.

---

## ADR-009: Localization Framework — next-intl

- **Status**: **ACCEPTED**
- **Context**: The product must support Vietnamese (`vi`) and English (`en`) with seamless URL routing (`/vi/minh-kien` vs `/en/minh-kien`).
- **Decision**: Use `next-intl` for Next.js App Router localization.
- **Consequences**:
  - *Positive*: Native App Router support, type-safe translation keys, clean SSR rendering.
  - *Negative*: Translation key maintenance discipline required across both languages.

---

## ADR-010: Sensitive Data Handling — Field-Level Encryption & Redaction

- **Status**: **ACCEPTED**
- **Context**: Birth date, birth time, and personal consultation reflections are highly sensitive PII.
- **Decision**: Encrypt birth data at rest using AES-256; automatically redact PII from all application logs and telemetry.
- **Consequences**:
  - *Positive*: High user trust and compliance with privacy regulations.
  - *Negative*: Slightly complex query logic for birth data (decryption required prior to symbolic processing).

---

## ADR-011: Admin Separation Strategy

- **Status**: **ACCEPTED**
- **Context**: Administrative staff need access to audit logs, financial reports, and system settings, but must not browse private user consultation prompts.
- **Decision**: Separate administrative API routes (`/api/v1/admin`) with strict RBAC middleware; block raw user prompt text inspection by default; log all admin actions in immutable `audit_logs`.
- **Consequences**:
  - *Positive*: Strict privacy preservation and protection against insider misuse.
  - *Negative*: Admins cannot debug individual user prompt issues directly without explicit user escalation consent.

---

## ADR-012: Document & Report Generation Engine ("Lá Thư")

- **Status**: **PROPOSED**
- **Context**: Users can request custom synthesized PDF roadmaps ("Lá Thư Huyền Tâm").
- **Decision**: Use a Python-based HTML-to-PDF engine (WeasyPrint / ReportLab) rendering Jinja2 HTML templates, uploaded to Cloudflare R2 / Supabase Storage with short-lived signed download URLs.
- **Consequences**:
  - *Positive*: Beautiful HTML/CSS-styled PDF rendering; secure storage.
  - *Negative*: HTML-to-PDF rendering requires C-library dependencies (Pango/Cairo) in backend containers.

---

## ADR-013: Knowledge-Source Traceability & Evidence Labels

- **Status**: **ACCEPTED**
- **Context**: Users must never confuse traditional Eastern philosophical concepts or Tarot symbolism with scientific medical claims.
- **Decision**: Enforce Evidence Label tagging (`[SYMC]`, `[PHIL]`, `[FACT]`, `[UNCT]`) on key AI statements in Minh Kiến consultations and Dưỡng Đạo articles.
- **Consequences**:
  - *Positive*: Complete transparency, high credibility, zero deceptive claims.
  - *Negative*: System prompt engineering must strictly train the AI to apply tags correctly.
