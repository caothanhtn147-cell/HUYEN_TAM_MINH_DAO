# PRIVACY MODEL & DATA GOVERNANCE — HUYỀN TÂM MINH ĐẠO

**International Name:** HuyenTam Wisdom  
**Document Version:** 1.0.0  
**Date:** 2026-08-06  

---

## 1. PRIVACY PHILOSOPHY & SENSITIVE DATA CATEGORIES

Personal self-reflection, spiritual inquiries, birth details, and lifestyle notes represent deeply personal data. HUYỀN TÂM MINH ĐẠO treats privacy as a fundamental engineering requirement.

### Sensitive Data Classification Matrix

| Data Category | Examples | Sensitivity Level | Storage & Encryption Standard |
| :--- | :--- | :--- | :--- |
| **Birth & Identity Data** | Exact birth date, time, location, full name. | High | Field-level AES-256 encryption at rest. Restricted admin access. |
| **Consultation Messages** | User inquiries regarding relationships, grief, career stress. | High | Encrypted at rest. Excluded from general telemetry and AI model training. |
| **Financial Transactions** | Credit purchases, wallet balance, payment gateway IDs. | Critical | Append-only ledger. Tax-compliant retention with strict PII decoupling. |
| **Health & Lifestyle Notes**| Sleep patterns, stress levels, daily habit entries. | High | Isolated storage; encrypted at rest. |
| **System Telemetry** | API response latency, error codes, token counts. | Low | Anonymous structured JSON logs with automatic PII redaction. |

---

## 2. DATA MINIMIZATION & CONSENT MANAGEMENT

1. **Principle of Data Minimization**: The platform only requests birth time or personal background details when strictly necessary for specific symbolic or philosophical consultations.
2. **Explicit Consent Records**: User consent for terms of service, AI content generation disclosure, and privacy terms is recorded in `consent_records` with IP timestamp and policy version hash.
3. **Zero AI Training on User Data**: User consultation sessions, prompts, and personal notes are NEVER shared with third-party LLM providers for model training. Provider contracts MUST enforce zero data retention (ZDR) policies where available.

---

## 3. LOG REDACTION & TELEMETRY RESTRICTIONS

Application logging systems (FastAPI stdout, Redis logs, Sentry error trackers) MUST automatically scrub sensitive fields using middleware filters:

```python
# Conceptual PII Scrubbing Rules
SENSITIVE_PATTERNS = [
    r"birth_date", r"birth_time", r"password", 
    r"credit_card", r"prompt_text", r"user_message"
]
# Transformed to: [REDACTED_PII] in all production logs
```

---

## 4. ACCOUNT DELETION, SESSION PURGE & DATA EXPORT

- **Right to be Forgotten (Account Deletion)**:
  - Users can request complete account deletion from the dashboard.
  - Triggers deletion of `profiles`, `consultation_sessions`, `session_messages`, `tarot_draws`, and `dream_entries`.
  - Financial records (`credit_ledger`, `payments`, `orders`) are **anonymized** (stripping user email/name and replacing with `ANONYMIZED_USER_UUID`) to maintain statutory financial audit compliance without retaining PII.
- **Session Purge**: Users may delete individual consultation sessions at any time.
- **Data Export**: Users can export their personal notes, session logs, and reports in a structured JSON/ZIP archive.

---

## 5. ADMINISTRATIVE ACCESS & INTERNATIONAL PRIVACY

- **Role-Based Access**: Platform admins have zero access to raw user session text or birth details unless performing explicit compliance investigations backed by audit logging.
- **International Compliance Readiness**: Architecture is designed for compliance with Vietnam Cyber Security regulations, EU GDPR, and regional privacy frameworks (PDPA).
