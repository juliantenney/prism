# Sprint 21 — current state

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Sprint:** 21 — Pack-defined Step Parameter Controls  
**Status:** **Closed — complete for scoped Settings operability programme**

**Consolidation closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Entry point (historical):** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

**Predecessor:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Closed** — **149 tests** — [`../../../consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| **Sprint 20** | **Closed** — **135 tests** — [`../../../consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — **118 tests** |
| **Sprint 18** | **Closed** — **100 tests** |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **149 passed**, 0 failed |
| **Baseline** | Sprint 20 closeout (**135**) |
| **Slice 21-1** | **Closed** — +10 tests → 145 |
| **Slice 21-2** | **Closed** — +4 tests → 149 |
| **Research fixtures** | S1–S13 — **frozen** unless chartered |

---

## Programme outcome (closed)

Sprint 21 delivered the **parameterised workflow Settings front-end**:

| Property | State |
|----------|--------|
| Pack-defined `stepParams` | First-class editable Settings controls (LD pilot) |
| Runtime | Generic, metadata-driven renderer |
| Workflow-mode Prompt Factory | Deterministic: parameters → draft → save → context |
| Prompt authority | Editable Prompt Draft only |
| Workflow context | Read-only provenance; Copy context |

---

## Slice status

| Slice | Status |
|-------|--------|
| **21-1** | **Closed** — [`slice-21-1-closeout.md`](slice-21-1-closeout.md) |
| **21-2** | **Closed** — [`slice-21-2-charter.md`](slice-21-2-charter.md) |
| **21-3** | **Not started** — provenance relabelling deferred |
| **PF workflow-mode UX** | **Closed** — see [`review-log.md`](review-log.md) |

---

## Metadata contract (implemented)

`workflowBriefConfig.stepParameterControls[]` — fields: `key`, `canonicalStepId`, `label`, `description`, `controlType`, `default`, `options`, `visible`, `advanced`, `elicitation`, optional `group`.

**Control types:** `select`, `boolean`, `number`, `text`.

---

## Key runtime / pack touchpoints

| Area | Path |
|------|------|
| Settings UI | `app.js` — `renderWorkflowStepPromptConfigUI`, `[PRISM_STEP_PARAMS]` |
| LD pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Tests | `tests/workflow-step-parameter-controls.test.js` |
| Mappings | `applyWorkflowBriefMappings` — **unchanged** |
| Research pack | **Frozen** |

---

## Recommended next work

1. **Sprint 22 charter** — provenance alignment for Settings overrides **or** parameter audit/adoption  
2. Do **not** reopen Sprint 21 UX without new charter  

---

## References

| Document | Role |
|----------|------|
| [`sprint-21-index.md`](sprint-21-index.md) | Pack index |
| [`review-log.md`](review-log.md) | Implementation log |
| [`HANDOVER.md`](HANDOVER.md) | Session handover |
| [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md) | Original programme thesis |
