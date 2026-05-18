# Sprint 22 — current state

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Sprint:** 22 — Unified Workflow Settings surface  
**Status:** **Proposed / ready for charter** — bootstrap only; **no implementation**

**Predecessor closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Entry point:** [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md) · [`sprint-22-bootstrap.md`](sprint-22-bootstrap.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 22** | **Bootstrap** — charter pending |
| **Sprint 21** | **Closed** — **149 tests** — [`../../../consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| **Sprint 20** | **Closed** — **135 tests** |
| **Sprint 19** | **Closed** — **118 tests** |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **149 passed**, 0 failed (at bootstrap) |
| **Baseline** | Sprint 21 closeout (**149**) |
| **Research fixtures** | S1–S13 — **frozen** unless chartered |

---

## Problem statement (entry gap)

Sprint 21 made **per-step** pack-defined parameters editable in step Settings with a generic renderer.

**Remaining gap:** Users tuning a **whole workflow** must open step Settings repeatedly. There is no **single workflow-level surface** that shows:

- workflow-level pedagogical parameters (when pack-defined), and  
- **included-step** parameter controls for steps actually in the current workflow instance.

Sprint 22 proposes **[Run] [Settings] [Edit]** — with **Settings** as the unified pedagogical tuning mode.

---

## Sprint 22 goal (bootstrap)

Expose **workflow-level** and **included-step** parameter controls together in a **unified Settings surface**, aggregating only steps in the current workflow — reusing Sprint 21 rendering and persistence.

**Not:** modal redesign, parameter-semantics rewrite, or prompt editing in Settings.

---

## Intended UI model

```text
[ Run ]    [ Settings ]    [ Edit ]
```

| Mode | Purpose |
|------|---------|
| **Run** | Primary default workflow interaction |
| **Settings** | Unified pedagogical tuning (parameters only) |
| **Edit** | Implementation / prompt / step inspection |

---

## Architectural position

| Layer | Sprint 22 touch |
|-------|-----------------|
| Pack metadata | **Extend only as needed** for workflow-scoped controls (charter) |
| Sprint 21 renderer | **Reuse** |
| Persistence | **Existing pathways** |
| Synthesis / mappings / adequacy | **Unchanged** |
| Provenance | **Unchanged** |
| Prompt editing | **Edit / step Settings only** |

---

## Likely approach (hypothesis — not implemented)

1. Collect `canonicalStepId` (or equivalent) from **included workflow steps** only.  
2. Aggregate visible controls from active domain pack(s).  
3. Render grouped: workflow section + per-step sections.  
4. Persist through Sprint 21 / existing `stepParams` mechanisms.  
5. No prompt editing, refinement, or global parameter catalogue.

---

## Out of scope (bootstrap)

- Prompt editing redesign  
- Provenance redesign  
- Parameter AI review/refine  
- Workflow graph redesign  
- Manual workflow parameter authoring (future note)  
- Research pack expansion  
- Schema overhaul  

---

## Recommended first task

Read **`sprint-22-bootstrap.md`**, then draft **Slice 22-1 charter** (unified Settings shell + included-step aggregation MVP).

---

## References

| Document | Role |
|----------|------|
| [`sprint-22-index.md`](sprint-22-index.md) | Pack index |
| [`HANDOVER.md`](HANDOVER.md) | Boundaries and handover |
| [`review-log.md`](review-log.md) | Decisions log |
| Sprint 21 pack | Renderer and metadata reference |
