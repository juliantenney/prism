# Sprint 59 — Roadmap

**Updated:** 2026-07-15  
**Status:** Priority-1 MVP **complete** (mechanism + process + mental model transfer **PASS**). Proposed successor: [Sprint 60 — Instructional Archetype Operationalisation](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md)

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

## Phase B — Instructional Archetype Framework (Priority-1 MVP complete)

| Step | Status |
| ---- | ------ |
| Framework charter + inventory | Done — [instructional-archetype-framework.md](instructional-archetype-framework.md) |
| Backlog P1/P2 tickets | Done — [backlog.md](backlog.md) |
| **MVP routing (Priority 1)** | **PASS** — `lib/ld-instructional-archetype.js`; GAM conditional rules; DLA plan validation; fixtures |
| **GAM Copy delivery (recognition context)** | **PASS** — `buildWorkflowStepRecognitionContext`; unified recognition + `__PRISM_S59_FINAL_GAM_PROMPT` snapshot |
| **Manual mechanism transfer** | **PASS** — A2-M1; link → causal transition → outcome |
| **Manual process transfer** | **PASS** — A4-M1; rule `v20260715-4`; finding-transfer walkthrough |
| **Manual mental model transfer** | **PASS** — thermostat MVP; coherent model from relationships + governing constraint + contrast |
| Design full P1 packages (purpose…validation strategy) | Deferred to Sprint 60+ (beyond MVP routing/transfer) |
| Implement fuller P1 generation contracts | Deferred pending package design / operationalisation |
| Design P2 (concept_exposition, recommendation, modelling_note) | After operationalisation stabilises Priority-1 production path |
| Preserve Evaluate/diagnostic strength regression check | Continuous |

### Validated chain (Priority-1)

```text
DLA contract generation
  → persistence (archetype + archetype_plan on required_materials)
  → GAM routing (conditional archetype rules)
  → generated materials
```

All three Priority-1 archetypes validated end-to-end on this chain.

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
| Mental model transfer test | PASS |

### Runtime cache-bust (verified path)

```text
lib/ld-instructional-archetype.js?v=20260715-5
lib/workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1
app.js?v=20260715-s59-mental-1
```

Process rule **text** remains frozen at script lineage `20260715-4` wording (`PROCESS_RULE_FROZEN_VERSION`); later script versions may add mental-model wiring without rewriting process rule text.

### Process validation note

Earlier process failures were often invalid tests: outer GAM gate used shaped context (`stepTitle` / `stepCanonicalStepId`); inner routing received the raw step object and skipped injection. The process rule was not at fault — delivery was. Fixed 2026-07-15; see [SPRINT-59-CONTEXT-FOR-NEW-CHAT.md](SPRINT-59-CONTEXT-FOR-NEW-CHAT.md) and [decisions.md](decisions.md) S59-D08.

---

## Deferred / optional

| Item | Note |
| ---- | ---- |
| Full 12–15 lesson scoring matrix | Optional; not blocking |
| Renderer input pack | Needs Full HTML evidence |
| Hard capture validators | Only after package validation strategy |
| Fuller P1/P2 support packages | Carry into Sprint 60+ after operationalisation |
| Production archetype selection (replace `S59_*_TEST`) | **Sprint 60** |

---

## Exit toward sprint close

Priority-1 MVP transfer validated for **mechanism**, **process**, and **mental model** on the DLA → persistence → GAM routing → materials chain. Remaining work (production activation, observability, mixed-archetype workflows, fuller packages) is proposed for [Sprint 60](../2026-07-15-sprint-60-instructional-archetype-operationalisation/SPRINT-60-CHARTER.md). Formal Sprint 59 closure docs may follow this handoff.
