# Sprint 78 — Next chat briefing

**Paste this to start a fresh session on Sprint 78.**

---

## Sprint 78 — Learner Resource Quality Recovery — OPEN

**Opened:** 2026-08-17  
**Pack:** `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/SPRINT-78-START-HERE.md`  
**Predecessor:** Sprint 77 **CLOSED** — do not reopen.  
**Reliability:** [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)

### Goal

Restore generated learner-resource quality by repairing instructional relationships exposed by the Lagrangian QA baseline:

`MODEL → ATTEMPT → CHECK → REVISE / TRANSFER`

Target **regeneration quality**, not hand-editing one Lagrangian artefact. Exit: fresh from-top Lagrangian **≥ 90** uncapped; **0 Critical**; **0 Major** — via general architectural reliability.

### Where we are

- **WS1 CLOSED** (fresh **87/100**).
- **WS2** architecture has strong positive evidence; **T-013 remains OPEN** (operational-suitability failures + malformed-output recurrences on the same path). Candidate 4: **WS2 PASS + suitability FAIL**.
- **T-018 complete.** T-017/T-017A/T-018 review is **temporary instrumentation** — not rejected, not final architecture.
- Intended GAM contract: valid capture → Step complete → Next. A verifier FAIL is a **generation failure**. **“Regenerate until it passes” is not acceptable.**
- **T-003 complete** (earlier 88/100 exhibit; A5 Strong Check; A1–A4 Weak). **T-021/T-022 complete.** **T-019** queued.
- **Candidate 6 attempt 2:** QA **88/100**, F&S **92**, Subject **84**, all Check Strong. [Disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) complete. Next quality task: **S78-T-025** (not started). Attempt 1 E2 remains a separate reliability track.

### Immediate next work

Authorise **S78-T-025 — general disciplinary-precision authoring solution design**. Do not expand the T-017/T-018 verifier. Do not start T-019. Do not close T-013.

Read: HANDOVER.md → STATUS.md → PLAN.md → [S78-T-013](S78-T-013-workstream-2-integration-verification.md) → [C6 disciplinary](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) → [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification).
