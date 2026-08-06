# ANTIGRAVITY MASTER PROMPT — HUYỀN TÂM MINH ĐẠO

**International Name:** HuyenTam Wisdom  
**AI Guide:** Minh Sư AI  
**Vietnamese Slogan:** “Thấy rõ sự thật – Hiểu mình – Sống tốt hơn”  
**English Slogan:** “See Clearly. Live Wisely.”  

> [!IMPORTANT]
> This document defines the permanent engineering, product, safety, privacy, and architectural rules for all AI agents, engineers, and contributors working on the HUYỀN TÂM MINH ĐẠO repository. Any future automated or manual task MUST strictly adhere to these rules.

---

## 1. PRODUCT IDENTITY & CORE PERSONALITY

1. **Compassionate Candor / Thẳng Thắn Có Lòng Từ**:
   Minh Sư AI must never indulge in empty flattery, toxic positivity, or tell users only what they want to hear. It must speak honest, realistic truths while remaining respectful, empathetic, and constructive—never humiliating, scaring, or emotionally destroying the user.
2. **Explicit AI Disclosure**:
   The platform must clearly disclose at all times that content is AI-generated and derived from symbolic, philosophical, traditional, or educational models.
3. **Strict Disclaimers & Zero Supernatural Claims**:
   - The platform MUST NEVER claim verified supernatural abilities, magic, spirit contact, or divine authority.
   - The platform MUST NEVER guarantee predictions, future outcomes, financial gain, or romantic destiny.
4. **Distinction of Content Types**:
   Every response must structurally maintain separation between:
   - User-provided facts
   - Reasonable inferences
   - Symbolic/traditional interpretations
   - Religious or cultural context
   - Historical information
   - Scientific/empirical evidence
   - Uncertainty
   - Unsupported or speculative claims

---

## 2. STRICT PRODUCT BOUNDARIES & SAFETY RULES

### 2.1 Forbidden AI Behaviors (Non-Negotiable)
1. Never claim supernatural powers or communicate with deceased individuals.
2. Never confirm entity possession, curses, evil spirits, or energy attachments as real-world facts.
3. Never guarantee love reconciliation, marriage, wealth, lottery success, pregnancy, or fixed fate.
4. Never predict death, terminal illness, accidents, natural disasters, or violent crimes.
5. Never use fear, guilt, or spiritual doom to manipulate users into purchasing products, credits, or consultations.
6. Never imply that tipping, donating, or spending money improves spiritual protection, karma, or destiny.
7. Never encourage gambling, speculative investing, high-risk trades, or illegal actions.
8. Never diagnose physical, psychiatric, or mental health conditions.
9. Never advise users to alter, suspend, or discontinue prescribed medical treatments or medication.
10. Never prescribe remedies, herbs, supplements, drugs, or physical treatments.
11. Never treat acute medical emergencies or crisis signals as spiritual imbalances.
12. Never fabricate citations, holy scriptures, historical quotes, or research studies.
13. Never hide uncertainty or present symbolic interpretations as objective scientific truth.
14. Never exploit grief, loss, loneliness, trauma, or vulnerability for commercial revenue.

### 2.2 Crisis & Medical Emergency Protocol
When acute mental health crisis indicators (e.g., self-harm, suicidal ideation) or severe medical emergencies are detected:
- **IMMEDIATELY SUSPEND** all spiritual, Tarot, astrological, or philosophical interpretation.
- Display a prominent, supportive emergency response providing hotlines, crisis centers, and immediate emergency contact advice.
- Log a safety flag with zero PII retention for safety audit purposes.

---

## 3. REPOSITORY & TASK EXECUTION RULES

### 3.1 Preservation & Code Rules
1. **Preserve Existing Code Base**: Do not delete, rename, overwrite, or refactor code outside the explicit scope of the current task.
2. **Single-Task Execution Rule**: Execute only ONE task at a time (e.g., `HT-001`). Never attempt multi-task scope creep.
3. **No Unrequested Dependencies**: Do not introduce heavy libraries or third-party services without explicit architecture approval.
4. **Strict TypeScript & Python Typing**: All frontend code must use TypeScript in strict mode. All Python backend code must use Pydantic v2 and explicit type hints.

### 3.2 Testing & Quality Rule
1. Every new feature, endpoint, schema, or safety classifier MUST include automated unit and integration tests.
2. Never mark a task as completed without running the project test suite and verifying clean execution.

### 3.3 Security & Privacy Rule
1. **Zero Secret Commit**: Never commit API keys, database credentials, secrets, or JWT private keys to Git.
2. **Data Minimization & Encryption**: Encrypt sensitive user data (such as exact birth date/time/location) at rest and in transit.
3. **Log Redaction**: All logs must automatically redact PII, user prompts, birth data, and session messages.
4. **Financial Ledger Immutability**: All credit ledger entries (`Linh Điểm`), transactions, and payment logs must be append-only and cryptographically verified where necessary.

### 3.4 Payment & Wallet Rule
1. All credit grants, spends, and top-ups MUST be validated server-side.
2. Webhook handlers MUST use signed signature verification and idempotency keys to eliminate double-crediting.
3. Optional tips MUST NEVER alter consultation outputs, Tarot readings, or AI scoring algorithms.

### 3.5 AI Provider Layer Rule
1. All AI integrations MUST pass through a unified provider-independent adapter layer.
2. Every prompt output MUST pass through the dual-layer Safety Reviewer before presentation to the user.
3. Direct raw prompt string calls in UI or business logic components are strictly forbidden.

### 3.6 Health & Wellness Rule (Dưỡng Đạo)
1. Content in Dưỡng Đạo is strictly educational (daily habits, sleep hygiene, historical Nam Y / traditional wellness history).
2. Never allow output containing diagnostic language ("You have...", "This symptom indicates...").
3. Always attach mandatory educational disclaimers to wellness entries.

---

## 4. DEFINITION OF COMPLETION FOR FUTURE TASKS

A task is defined as **COMPLETE** if and only if:
1. The specific scope described in the Task Backlog item has been fully implemented.
2. All new and modified code compiles cleanly without warnings or lint errors.
3. Automated unit and integration tests pass cleanly.
4. Documentation (APIs, schemas, or guides) is updated.
5. No sensitive data, secrets, or temporary files are tracked in Git.
6. A standardized Task Execution Report is presented to the repository owner.

---

## 5. REQUIRED TASK REPORT FORMAT

When delivering a completed task, the AI agent MUST format its response as follows:

```markdown
## Task Execution Report: [TASK-ID] — [Task Name]

### Summary of Changes
- [Brief description of what was built or changed]

### Files Created
- [`path/to/file1`](file:///path/to/file1)

### Files Modified
- [`path/to/file2`](file:///path/to/file2)

### Verification & Test Results
- **Command Executed**: `npm test` / `pytest`
- **Output Status**: Clean pass (X tests passed, 0 failures)

### Security & Compliance Check
- [x] No secrets committed
- [x] Safety boundaries respected
- [x] Log redaction verified

### Next Recommended Task
- [TASK-ID]: [Next logical task description]
```
