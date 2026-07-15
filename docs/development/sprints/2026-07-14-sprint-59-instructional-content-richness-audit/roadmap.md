# Sprint 59 — Roadmap

**Updated:** 2026-07-15  
**Status:** Phase B active — Priority-1 MVP transfer PASS for mechanism + process; mental-model validation pending

---

## Phase A — Diagnostic (complete)

| Step | Outcome |
| ---- | ------- |
| Pack hardening + evidence inventory | Done |
| First audit FA-01…03 | [FIRST-AUDIT-SUMMARY.md](FIRST-AUDIT-SUMMARY.md) |
| Generation-constraint audit | [GENERATION-CONSTRAINT-AUDIT.md](GENERATION-CONSTRAINT-AUDIT.md) |
| Iterations 1–7 GAM depth | DEPTH contract live |
| Heteroscedasticity vs enzymes | Comparative evidence |
| Formal archetype audit | [instructional-archetype-audit.md](instructional-archetype-audit.md) |

---

## Phase B — Instructional Archetype Framework (active)

| Step | Status |
| ---- | ------ |
| Framework charter + inventory | Done — [instructional-archetype-framework.md](instructional-archetype-framework.md) |
| Backlog P1/P2 tickets | Done — [backlog.md](backlog.md) |
| **MVP routing (Priority 1 only)** | **PASS** — `lib/ld-instructional-archetype.js`; GAM conditional rules; DLA plan validation; enzymes fixtures |
| **GAM Copy delivery (recognition context)** | **PASS (2026-07-15)** — `buildWorkflowStepRecognitionContext`; unified recognition + `__PRISM_S59_FINAL_GAM_PROMPT` snapshot |
| **Manual mechanism transfer** | **PASS** — A2-M1; link → causal transition → outcome |
| **Manual process transfer** | **PASS** — A4-M1; rule `v20260715-4`; finding-transfer walkthrough |
| **Mental model transfer** | **READY TO RUN** (MVP thermostat; not PASS) |
| Design full P1 packages (purpose…validation strategy) | Open (beyond MVP routing/transfer) |
| Implement fuller P1 generation contracts | Pending package design |
| Design P2 (concept_exposition, recommendation, modelling_note) | After P1 outline |
| Preserve Evaluate/diagnostic strength regression check | Continuous |

### Component status table

| Component | Status |
| --------- | ------ |
| DLA contract generation | PASS |
| Contract persistence | PASS |
| Archetype routing | PASS |
| GAM Copy delivery | PASS |
| Runtime verification | PASS |
| Mechanism transfer test | PASS |
| Process transfer test | PASS |
| Mental model validation | NOT STARTED |

### Runtime cache-bust (verified)

```text
lib/ld-instructional-archetype.js?v=20260715-4
lib/workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1
app.js?v=20260715-s59-gam-ctx-1
```

### Process validation note

Earlier process failures were often invalid tests: outer GAM recognition passed with shaped context, but inner routing received the raw step object and skipped injection. The process rule was not at fault — delivery was. Fixed 2026-07-15; see [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md) and [decisions.md](decisions.md) S59-D08.

---

## Deferred / optional

| Item | Note |
| ---- | ---- |
| Full 12–15 lesson scoring matrix | Optional; not blocking Phase B |
| Renderer input pack | Needs Full HTML evidence |
| Hard capture validators | Only after package validation strategy |
| Sprint 60 | **Do not create** from this roadmap |

---

## Exit toward sprint close

Phase B packages shipped (or scoped with acceptance evidence) + docs/handoff updated + [definition-of-done.md](definition-of-done.md) Phase B checks complete. Mental-model transfer and fuller support packages remain before close.
