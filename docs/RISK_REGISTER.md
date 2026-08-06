# RISK REGISTER — HUYỀN TÂM MINH ĐẠO

**International Name:** HuyenTam Wisdom  
**Document Version:** 1.0.0  
**Date:** 2026-08-06  

---

## 1. RISK ASSESSMENT MATRIX OVERVIEW

| Priority Level | Response Standard |
| :--- | :--- |
| **CRITICAL** | Immediate architectural block; mandatory automated test enforcement. |
| **HIGH** | Mitigation required in Phase 1 / Phase 2 before production release. |
| **MEDIUM** | Monitored with scheduled mitigations during core development. |
| **LOW** | Documented and reviewed periodically. |

---

## 2. COMPREHENSIVE RISK REGISTER

| Risk ID | Category | Description | Prob. | Impact | Priority | Mitigation Strategy | Detection Method | Owner Role | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-001** | Payments | **Payment Duplication / Double Crediting**: Webhook replay or duplicate network calls grant multiple credit top-ups for a single payment. | Medium | Critical | **CRITICAL** | Enforce strict server-side webhook signature validation and unique idempotency keys in `credit_ledger`. | Automated integration test & webhook idempotency log audits. | Lead Backend Engineer | Open |
| **RSK-002** | AI Safety | **AI Hallucination**: AI invents fake holy scriptures, historical quotes, or medical facts. | High | High | **HIGH** | Use strict structured JSON output with Evidence Labels (`[SYMC]`, `[PHIL]`, `[FACT]`) and post-execution safety filters. | Post-execution schema validation & safety reviewer. | AI Lead Engineer | Open |
| **RSK-003** | Health | **Harmful Health / Medical Advice**: AI gives medical diagnoses, treatment recommendations, or herbal dosages. | Medium | Critical | **CRITICAL** | Enforce strict health boundaries in Dưỡng Đạo; run automated pre/post safety filters; attach mandatory health disclaimers. | Pre-execution safety classifier & automated regression tests. | Compliance Officer | Open |
| **RSK-004** | AI Safety | **Fear-Based Content / Spiritual Exploitation**: AI generates fear-inducing fatalistic predictions or curse warnings. | Medium | High | **HIGH** | Bake "Compassionate Candor" into core system prompt; test output against 50+ adversarial test prompts. | Post-execution Safety Reviewer. | Lead Prompt Engineer | Open |
| **RSK-005** | Security | **Data Leakage**: Sensitive user birth data, health notes, or consultation text exposed via API or logs. | Low | Critical | **CRITICAL** | Field-level AES-256 encryption at rest for birth data; automatic PII log scrubber in FastAPI middleware. | Security static analysis (SAST) & log inspection checks. | Security Engineer | Open |
| **RSK-006** | Security | **Prompt Injection**: User crafts malicious input to bypass safety filters or extract system prompts. | High | Medium | **HIGH** | Separate user input from system instructions using structured message roles; run pre-execution prompt sanitizer. | Safety classifier anomaly logs. | AI Security Specialist | Open |
| **RSK-007** | Security | **Account Takeover**: Brute force or credential stuffing attacks target user accounts. | Medium | High | **HIGH** | Supabase Auth rate limiting, strong password policies, multi-factor authentication (MFA) option. | Redis rate-limit metrics & failed login alerts. | Security Engineer | Open |
| **RSK-008** | Operations | **Cost Explosion**: Excessive API token usage due to long sessions or abuse loops. | Medium | High | **HIGH** | Token accounting per request in `ai_usage`; hard caps on session token context; user rate limits. | Real-time cost monitoring dashboard & budget alerts. | DevOps / Infra Lead | Open |
| **RSK-009** | Operations | **Model Outage**: Primary AI provider (e.g., Anthropic or OpenAI) experiences service downtime. | Medium | Medium | **MEDIUM** | Implement multi-provider fallback adapter (`BaseAIProvider`) with automatic provider failover. | Real-time API latency & HTTP 5xx error rate monitoring. | Systems Architect | Open |
| **RSK-010** | Product | **Translation / Localization Error**: Misaligned nuances between Vietnamese and English spiritual terms. | High | Medium | **MEDIUM** | Centralized `next-intl` translation catalogs reviewed by native Vietnamese/English technical writers. | i18n key audit tests & manual UI reviews. | Technical Writer / i18n Lead | Open |
| **RSK-011** | Compliance | **Legal / Regulatory Uncertainty**: Shifting regulations around AI disclosure or digital spiritual services. | Low | High | **MEDIUM** | Explicit AI content disclaimers on every page; zero supernatural claims; robust terms of service. | Legal compliance reviews. | Product Manager | Open |
| **RSK-012** | Payments | **International Payment Limitations**: Foreign cards rejected by local domestic payment gateways. | Medium | Medium | **MEDIUM** | Dual gateway strategy: Stripe for international cards, MoMo/VNPay/Bank Transfer for domestic users. | Payment conversion & drop-off analytics. | Product Manager | Open |
| **RSK-013** | Security | **Admin Privilege Abuse**: Admin staff inspecting private user consultation text. | Low | High | **HIGH** | Enforce RBAC; restrict raw message view permissions; log all admin actions in immutable `audit_logs`. | Automated audit log anomaly detector. | Security Engineer | Open |
| **RSK-014** | Privacy | **Sensitive Analytics Exposure**: Product analytics tracking PII or raw user prompts. | Medium | Medium | **MEDIUM** | Ban tracking PII in analytics; use privacy-conscious analytics (e.g., Plausible / PostHog self-hosted). | Code review audit on tracking events. | Privacy Lead | Open |
| **RSK-015** | Product | **User Emotional Dependency**: Users relying excessively on AI consultations for daily decisions. | Medium | Medium | **MEDIUM** | Include resolution paths (Point 7-9) encouraging real-world human action; cap daily session allowances. | Session frequency analytics. | UX Architect | Open |
| **RSK-016** | Content | **Inaccurate Traditional Claims**: Distorting historical Nam Y, TCM, or Asian philosophical traditions. | Medium | Low | **LOW** | Tag traditional content with `[PHIL]` or `[SYMC]` evidence labels; reference documented source materials. | Knowledge base content audits. | Content Lead | Open |
| **RSK-017** | UX | **Mobile Accessibility Failure**: UI unusable on small mobile devices popular in Vietnam. | High | Medium | **HIGH** | Mobile-first responsive design in Tailwind CSS; manual viewport testing across iOS Safari and Android Chrome. | Mobile automated UI tests (Playwright). | QA Lead | Open |
| **RSK-018** | Management | **Project Scope Explosion**: Attempting full product build at once instead of phased micro-tasks. | High | High | **HIGH** | Strict adherence to single-task backlog execution (`HT-001`, `HT-002`); mandatory Phase 0 stop condition. | Task Backlog review & release gate audits. | Principal Architect | Open |
