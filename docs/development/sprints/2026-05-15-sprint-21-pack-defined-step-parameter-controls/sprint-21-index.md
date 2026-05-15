# Sprint 21 index — Pack-defined Step Parameter Controls

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Date:** 2026-05-15  
**Status:** **Proposed / ready for charter**

**Entry point:** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

**Predecessor closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

**Verification at bootstrap:** **135 passed**, 0 failed

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Fresh-chat entry |
| [`HANDOVER.md`](HANDOVER.md) | Purpose, boundaries, slice sequence |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Goals, scope, risks |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Gap statement + test floor |
| [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md) | Thesis, two-tier model, slice outlines |
| [`sprint-21-index.md`](sprint-21-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions R21-001+ |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Bootstrap** — no implementation |
| **Sprint 20** | **Closed** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — [`SPRINT-19-CHECKPOINT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md) |
| **Sprint 18** | **Closed** — [`SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) |

---

## Programme thesis

**Settings = full workflow parameter editor.** Packs declare parameters and rendering metadata; runtime renders generic controls, persists values, propagates execution, and keeps provenance aligned.

**Not:** new synthesis architecture.

---

## Proposed slice sequence

| Slice | Focus | Status |
|-------|--------|--------|
| **21-1** | Parameter metadata + generic Settings renderer | Charter pending |
| **21-2** | Advanced/basic grouping + visibility | Deferred |
| **21-3** | LD pilot + provenance integration | Deferred |

---

## Architecture references

| Document | Path |
|----------|------|
| Sprint 20 closeout | [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| Parameterisation reflection | [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) |
| Contextual refinement | [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) |
| Sprint 20 pack (closed) | [`../2026-05-15-sprint-20-workflow-explainability-settings-ux/`](../2026-05-15-sprint-20-workflow-explainability-settings-ux/) |

---

## Investigation starting points (when chartered)

| Area | Path |
|------|------|
| Factory Settings UI | `app.js` — step config, `userOptions`, `[PRISM_STEP_PARAMS]` |
| Sprint 20 discoverability | `decorateWorkflowStepSettingsDiscoverability` |
| Mappings | `applyWorkflowBriefMappings`, pack `mappingRules` |
| LD pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Tests | `workflow-settings-discoverability.test.js`, `workflow-brief-provenance.test.js` |

---

## Test baseline

| Milestone | Result |
|-----------|--------|
| Sprint 20 close | **135 passed** |
| Sprint 21 bootstrap | **135 passed** (no code delta expected) |

---

## Verification

```bash
node --test tests/*.test.js
```

**At bootstrap:** **135 passed**, 0 failed.
