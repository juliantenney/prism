# Sprint 21 index — Pack-defined Step Parameter Controls

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Date:** 2026-05-15  
**Status:** **Closed — complete for scoped Settings operability programme**

**Consolidation closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Entry point (historical):** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

**Predecessor closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

**Verification at close:** **149 passed**, 0 failed

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Historical fresh-chat entry |
| [`HANDOVER.md`](HANDOVER.md) | Post-close handover |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Original goals, scope, risks |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Closed snapshot + test floor |
| [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md) | Programme thesis, two-tier model |
| [`sprint-21-index.md`](sprint-21-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions R21-001+ and implementation log |
| [`slice-21-1-closeout.md`](slice-21-1-closeout.md) | Slice 21-1 closeout |
| [`slice-21-1-charter.md`](slice-21-1-charter.md) | Slice 21-1 charter |
| [`slice-21-2-charter.md`](slice-21-2-charter.md) | Slice 21-2 charter |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Closed** — [`sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — **149 tests** |
| **Sprint 20** | **Closed** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — [`SPRINT-19-CHECKPOINT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md) |
| **Sprint 18** | **Closed** — [`SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) |

---

## Programme thesis (achieved)

**Settings = full workflow parameter editor** for pack-declared step parameters. Packs declare metadata; runtime renders generic controls, persists through `[PRISM_STEP_PARAMS]`, and workflow-mode Prompt Factory is draft-centric.

**Not:** new synthesis architecture.

---

## Slice sequence (final)

| Slice | Focus | Status |
|-------|--------|--------|
| **21-1** | Parameter metadata + generic Settings renderer | **Closed** |
| **21-2** | Grouping, visibility, summary labels, LD expansion | **Closed** |
| **21-3** | Provenance alignment for Settings overrides | **Not started** (deferred) |
| **PF workflow-mode UX** | Deterministic editor; refinement removed from workflow mode | **Closed** |

---

## Test progression

| Milestone | Result |
|-----------|--------|
| Sprint 20 close | **135 passed** |
| Sprint 21 bootstrap | **135 passed** (docs only) |
| Slice 21-1 | **145 passed** (+10) |
| Sprint 21 close | **149 passed** (+4) |

---

## Architecture references

| Document | Path |
|----------|------|
| Sprint 21 closeout | [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| Sprint 20 closeout | [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| Parameterisation reflection | [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) |
| Contextual refinement | [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) |

---

## Implementation touchpoints

| Area | Path |
|------|------|
| Settings UI | `app.js` — pack parameter controls, workflow-mode PF UX |
| LD pack metadata | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Tests | `tests/workflow-step-parameter-controls.test.js` |
| Sprint 20 discoverability | `tests/workflow-settings-discoverability.test.js` |
| Sprint 20 provenance | `tests/workflow-brief-provenance.test.js` |

---

## Recommended next sprint

**Sprint 22** — charter one of:

- Provenance alignment for explicit Settings overrides, **or**
- Parameter audit / adoption expansion

---

## Verification

```bash
node --test tests/*.test.js
```

**At close:** **149 passed**, 0 failed.
