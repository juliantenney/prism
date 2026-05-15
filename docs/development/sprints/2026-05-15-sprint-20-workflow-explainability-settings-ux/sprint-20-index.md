# Sprint 20 index — Workflow Explainability and Settings UX

**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Date:** 2026-05-15  
**Status:** **Closed**

**Programme closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

**Entry point (historical):** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

**Verification at close:** **135 passed**, 0 failed

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Fresh-chat entry (historical) |
| [`HANDOVER.md`](HANDOVER.md) | Final handover — points to programme closeout |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Goals, scope, risks |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Closed state + test floor |
| [`sprint-20-bootstrap.md`](sprint-20-bootstrap.md) | Thesis and slice outlines |
| [`sprint-20-index.md`](sprint-20-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions R20-001–R20-031 |

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 20** | **Closed** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — [`SPRINT-19-CHECKPOINT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md) |
| **Sprint 18** | **Closed** — [`SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) |

---

## Slice sequence (complete)

| Slice | Focus | Closeout / charter |
|-------|--------|-------------------|
| **20-1** | Settings Discoverability | [`sprint-20-slice-1-closeout.md`](../../../consolidation/sprint-20-slice-1-closeout.md) |
| **20-2** | Workflow Assumptions / Provenance | [`sprint-20-slice-2-closeout.md`](../../../consolidation/sprint-20-slice-2-closeout.md) |
| **20-3** | Adequacy UX Refinement | [`sprint-20-slice-3-charter.md`](../../../consolidation/sprint-20-slice-3-charter.md) |

---

## Implementation sources (Sprint 20)

| Area | Path |
|------|------|
| Factory UI | `index.html`, `style.css` |
| Runtime (UI-only) | `app.js` |
| Tests | `workflow-settings-discoverability.test.js`, `workflow-brief-provenance.test.js`, `workflow-brief-panel-ux.test.js` |
| LD / Research packs | **Unchanged** in Sprint 20 |
| Research regression | `tests/workflow-research-*.test.js` — **frozen** |

---

## Architecture reference

| Document | Path |
|----------|------|
| Programme closeout | [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| Parameterisation reflection | [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) |
| Contextual refinement architecture | [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) |
| Sprint 19 closeout | [`docs/consolidation/sprint-19-closeout.md`](../../../consolidation/sprint-19-closeout.md) |

---

## Test progression

| Milestone | Result |
|-----------|--------|
| Sprint 20 bootstrap | 118 passed |
| After 20-1 | 124 passed |
| After 20-2 | 132 passed |
| **Sprint 20 close** | **135 passed** |

---

## Next work (not Sprint 20)

**Sprint 21 candidate:** Pack-defined Step Parameter Controls — see [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) §11.

**Not started.** Do not treat Sprint 21 as in progress from this index.

---

## Verification

```bash
node --test tests/*.test.js
```

**At close:** **135 passed**, 0 failed.
