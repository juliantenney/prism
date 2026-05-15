# Sprint 20 — current state

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Sprint:** 20 — Workflow Explainability and Settings UX  
**Status:** **Closed** — Slices **20-1**, **20-2**, and **20-3** complete

**Programme closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

**Entry point (historical):** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md)

---

## Active sprint summary

| Sprint | Status |
|--------|--------|
| **Sprint 20** | **Closed** — **135 tests** — [`../../../consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
| **Sprint 19** | **Closed** — **118 tests** — [`../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md`](../2026-05-15-sprint-19-ld-workflow-rationalisation/SPRINT-19-CHECKPOINT.md) |
| **Sprint 18** | **Closed** — **100 tests** — Research reference |

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **135 passed**, 0 failed |
| **Baseline at Sprint 20 bootstrap** | 118 passed |
| **Slice 20-1 delta** | +6 (`workflow-settings-discoverability.test.js`) |
| **Slice 20-2 delta** | +8 (`workflow-brief-provenance.test.js`) |
| **Slice 20-3 delta** | +3 (`workflow-brief-panel-ux.test.js`) |
| **Research fixtures** | S1–S13 — **do not modify** without charter |

---

## Consolidated Factory interaction model (Sprint 20 complete)

| Stage | Mechanism |
|-------|-----------|
| **Lightweight brief** | Essentials + optional fields; minimal chat |
| **Essentials gate** | Blocking when unsafe or incomplete |
| **Workflow synthesis** | Concrete step graph after design |
| **Planning adequacy** | **Planning guidance** — advisory, action-led, non-blocking |
| **Provenance** | Source labels, step relevance, workflow-level mappings |
| **Settings tuning** | Authoritative via **Settings...** / **Open step Settings** |

Workflows are **parameterised systems** (packs + `mappingRules` + `stepParams`); Sprint 20 made that **visible** in the Factory. **Full Settings parameter editing** for all mapped params is a **Sprint 21 candidate** — see programme closeout §11.

---

## Slice summaries

| Slice | Closeout | Key hooks / tests |
|-------|----------|-------------------|
| **20-1** | [`sprint-20-slice-1-closeout.md`](../../../consolidation/sprint-20-slice-1-closeout.md) | `focusWorkflowStepSettings`, discoverability decoration |
| **20-2** | [`sprint-20-slice-2-closeout.md`](../../../consolidation/sprint-20-slice-2-closeout.md) | `buildWorkflowBriefProvenanceViewModel`, provenance UI |
| **20-3** | [`sprint-20-slice-3-charter.md`](../../../consolidation/sprint-20-slice-3-charter.md) | Status strip, planning tiers, panel section order |

---

## Factory UX surfaces (final)

| Surface | Path / element |
|---------|----------------|
| Workflow Factory tab | `index.html` — `workflowFactoryPanel` |
| Resolved brief | `wfBriefResolvedDetails` — status strip, planning guidance, provenance sections |
| Design preview | `wfDesignSteps` — **Tunable** |
| Saved steps | `workflowSteps` — **Settings** badges + summaries |
| Step Settings | **Settings...** → Prompt Factory step config |
| Runtime | `app.js` — UI-only presentation and navigation |

---

## Sprint 20 deliverables

| Artefact | Status |
|----------|--------|
| Portable pack | **Done** |
| Slices 20-1 / 20-2 / 20-3 | **Done** |
| Programme closeout | **Done** — [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |

---

## Recommended next work (not Sprint 20)

| Item | Document |
|------|----------|
| **Sprint 21 candidate** — Pack-defined Step Parameter Controls | [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) §11 |
| Pack parameter audit | [`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) |
