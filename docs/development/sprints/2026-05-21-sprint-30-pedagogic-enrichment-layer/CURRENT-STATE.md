# Sprint 30 — current state

**Date:** 2026-06-01  
**Pack path:** `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/`  

## Programme status

| Programme | Status |
|-----------|--------|
| **Sprint 30** | **CLOSED** — see [`SPRINT-30-RETROSPECTIVE.md`](SPRINT-30-RETROSPECTIVE.md) · [R30-999](review-log.md) |
| **Phase 1** (`orientation_contract`) | **CLOSED** |
| **Phase 2** (`reasoning_contract` + stabilisation) | **CLOSED** |
| **Phase 3** (`metacognition_contract`) | **Deferred / not authorised** — [`phase-3-design-constraints.md`](phase-3-design-constraints.md) |
| **Sprint 31** | **Planning seed only** — [`sprint-31-seed-notes.md`](sprint-31-seed-notes.md) |

**Sprint 31 next focus (not implementation):** presentation quality, visual hierarchy, pacing, calmness, renderer rhetoric, density management, cue prominence tuning.

**Handover:** [`HANDOVER.md`](HANDOVER.md)  
**Charter:** [`sprint-30-charter.md`](sprint-30-charter.md)  
**Close-out:** [`SPRINT-30-RETROSPECTIVE.md`](SPRINT-30-RETROSPECTIVE.md)

---

## At a glance (frozen)

| Item | State |
|------|--------|
| **30-0** Architecture + pack | **Complete** |
| **30-1** Orientation (`orientation_contract`) | **Complete** |
| **30-1b / 30-1c** Renderer + GAM voice guard | **Complete** |
| **30-2** Reasoning (`reasoning_contract`) | **Complete** |
| **30-2r / 30-2b / 30-2c** Stabilisation | **Complete** |
| **30-3** Metacognition | **Deferred** |
| **30-close** | **Complete** |
| **Tests (final floor)** | **471 pass** / **0 fail** |
| **Runtime PECs shipped** | `orientation_contract` + `reasoning_contract` |

---

## What shipped (summary)

- **Generation:** PEC prompts on DLA/GAM; Design Page preservation; warn-only evaluators.
- **Renderer:** Passive orientation + reasoning cue passthrough (no synthesis).
- **Sanitisation:** GAM materials (30-2b); Design Page activity rows (30-2c) — self-directed learner pages only.
- **Validation:** Factory P30-01 Marx, P30-02 RNA; kitchen-sink renderer regression.

Full detail: [`SPRINT-30-RETROSPECTIVE.md`](SPRINT-30-RETROSPECTIVE.md), [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md).

---

## Slice tracker (final)

| Slice | Name | Status |
|-------|------|--------|
| 30-0 | Pack + PEC architecture | **Complete** |
| 30-1 | `orientation_contract` | **Complete** |
| 30-1b | Renderer passthrough (orientation) | **Complete** |
| 30-1c | GAM learner voice guard | **Complete** |
| 30-2 | `reasoning_contract` | **Complete** |
| 30-2r | Reasoning renderer passthrough | **Complete** |
| 30-2b | GAM facilitator stabilisation | **Complete** |
| 30-2c | Design Page row sanitisation | **Complete** |
| 30-3 | `metacognition_contract` | **Deferred** |
| 30-close | Retrospective + consolidation | **Complete** |

---

## Test coverage (frozen)

| Track | Test file |
|-------|-----------|
| PEL orientation | `tests/workflow-pel-orientation.test.js` |
| PEL reasoning + sanitisation | `tests/workflow-pel-reasoning.test.js` |
| Renderer | `tests/utility-renderer-kitchen-sink.test.js`, `tests/utility-self-directed-activity-framing.test.js` |
| Self-directed formatting | `tests/workflow-self-directed-learner-page-formatting.test.js` |

**Command:** `node --test tests/*.test.js` — expect **471** pass.

**Floor:** [`context-files/baseline-test-floor.md`](context-files/baseline-test-floor.md)

---

## Resume (post–Sprint 30)

1. **Sprint 31:** Draft charter from [`sprint-31-seed-notes.md`](sprint-31-seed-notes.md) — presentation/rhetoric only.
2. **Do not** implement `metacognition_contract` without a new approved charter.
3. **Do not** change workflow topology or add PECs under Sprint 31 seed scope.

---

## Archive pointers

| Phase | Charters |
|-------|----------|
| Phase 1 | [`slice-30-1-charter.md`](slice-30-1-charter.md) |
| Phase 2 | [`slice-30-2-charter.md`](slice-30-2-charter.md), [`slice-30-2b-charter.md`](slice-30-2b-charter.md) |
| Phase 3 (deferred) | [`phase-3-design-constraints.md`](phase-3-design-constraints.md) |
