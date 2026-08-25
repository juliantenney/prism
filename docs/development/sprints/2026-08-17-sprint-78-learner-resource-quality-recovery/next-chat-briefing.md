# Sprint 78 — Next chat briefing

**Paste this to start a fresh session on Sprint 78.**

---

## Sprint 78 — Learner Resource Quality Recovery — OPEN

**Opened:** 2026-08-17  
**Pack:** `docs/development/sprints/2026-08-17-sprint-78-learner-resource-quality-recovery/SPRINT-78-START-HERE.md`  
**Predecessor:** Sprint 77 **CLOSED** — do not reopen.  
**Reliability:** [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification) · [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp) · [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport)

### Goal

Restore generated learner-resource quality by repairing instructional relationships exposed by the Lagrangian QA baseline:

`MODEL → ATTEMPT → CHECK → REVISE / TRANSFER`

Target **regeneration quality**, not hand-editing one Lagrangian artefact. Exit: fresh from-top Lagrangian **≥ 90** uncapped; **0 Critical**; **0 Major** — via general architectural reliability.

### Where we are

- **WS1 CLOSED** (fresh **87/100**).
- **WS2** architecture has strong positive evidence; **T-013 remains OPEN** (first-pass/E2 reliability). Candidate 4: **WS2 PASS + suitability FAIL**. Candidate 6 attempt 2: QA **88/100**, suitability PASS, Check Strong, Subject **84**.
- **T-018 complete.** T-017/T-017A/T-018 review is **temporary instrumentation** — not rejected, not final architecture.
- Intended GAM contract: valid capture → Step complete → Next. A verifier FAIL is a **generation failure**. **“Regenerate until it passes” is not acceptable.**
- **T-003 / T-021 / T-022 complete.** **T-036** timing diagnostic complete (supersedes queued T-019). **T-037** timing restore complete.
- **T-025–T-032 complete**: maths salience (T-028/T-029), disciplinary warrant (T-026), page-closure packaging (T-032 / S78-D04 — GAM `### Page learner-resource closure` → DP `study_tips` transport-only). Do not expand verifier.
- **T-033 … T-048 complete**: composition follow-ons + image fidelity ([T-045](S78-T-045-image-instructional-fidelity-diagnostic.md) / [T-047](S78-T-047-harden-image-instructional-fidelity-synthesis.md)) + visual consistency ([T-046](S78-T-046-resource-level-image-consistency-diagnostic.md) / [T-048](S78-T-048-harden-resource-visual-consistency.md)). Do not expand verifier. Learner-workspace/interactivity PARKED.

### Immediate next work

**Re-copy Graphics prompts and regenerate/reassociate images** to pick up T-047 claim bounds + T-048 house visual language. Do not close T-013. Do not redesign learner workspaces opportunistically.

Read: HANDOVER.md → STATUS.md → [S78-T-048](S78-T-048-harden-resource-visual-consistency.md).
