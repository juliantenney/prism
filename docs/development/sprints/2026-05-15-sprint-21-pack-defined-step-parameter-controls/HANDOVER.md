# Session Handover — Sprint 21 (closed)

**Role:** historical pack handover after Sprint 21 close.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`

**Date:** 2026-05-15

**Status:** **Closed — complete for scoped Settings operability programme**

**Consolidation closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Predecessor closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 21** | **Closed** — **149 tests** |
| **Sprint 20** | **Closed** — **135 tests** |
| **Sprint 19** | **Closed** — **118 tests** |
| **Sprint 18** | **Closed** — **100 tests** |

---

## What Sprint 21 delivered

Sprint 21 completed the **parameterised workflow Settings front-end**:

- Pack-defined `stepParams` → first-class editable Settings controls (generic renderer)
- Persistence via existing `[PRISM_STEP_PARAMS]` contract
- LD pilot: **7** `stepParameterControls` entries
- Workflow-mode Prompt Factory: **deterministic editor** (parameters, editable draft, save to step, read-only context)
- Standalone Prompt Factory: **unchanged** (full refinement + authoring)

**Not delivered (deferred):** provenance relabelling when Settings override brief-derived values (Slice 21-3).

---

## Interaction model after Sprint 21

**Factory / workflow design (unchanged layers):**

1. Lightweight brief (elicited tier)  
2. Essentials gate  
3. Workflow synthesis  
4. Planning adequacy (advisory)  
5. Provenance + step relevance (Sprint 20)  
6. **Settings = full pack-defined parameter editor** (Sprint 21)

**Workflow step Settings (Prompt Factory workflow mode):**

1. Configure workflow parameters  
2. Edit prompt draft directly  
3. Save to step  
4. Inspect workflow context (read-only, collapsed)

No conversational refinement, **New brief**, or **Refine manually** in workflow mode.

---

## Metadata contract (for extenders)

Add entries to `workflowBriefConfig.stepParameterControls[]` on a domain pack.

| Field | Purpose |
|-------|---------|
| `key` | `stepParams` leaf name |
| `canonicalStepId` | Step pattern id |
| `label` / `description` | Settings copy |
| `controlType` | `select` \| `boolean` \| `number` \| `text` |
| `default` | Fallback value |
| `options` | Select choices |
| `visible` | `false` hides control |
| `advanced` | Advanced group, collapsed by default |
| `elicitation` | `elicited` \| `settings-only` (documentary) |
| `group` | Optional section title |

Runtime: **no per-key branches** in `app.js`.

---

## Preserved (do not regress)

- Lightweight elicitation  
- Essentials gating  
- Advisory adequacy only  
- No synthesis redesign  
- No `applyWorkflowBriefMappings` redesign  
- No provenance redesign  
- Research pack frozen  
- No wizard / profile required-tier regression  

---

## Verification

```bash
node --test tests/*.test.js
```

**Floor at close:** **149 passed**, 0 failed.

---

## Recommended next session

Open **Sprint 22** with an explicit charter — choose one:

1. **Provenance alignment** — Settings override source labels (deferred 21-3), **or**  
2. **Parameter audit / adoption** — broader LD or Research pack metadata

Do **not** continue Sprint 21 implementation without a new sprint charter.

---

## Pack artefacts

| File | Role |
|------|------|
| [`sprint-21-index.md`](sprint-21-index.md) | Index + links |
| [`review-log.md`](review-log.md) | Decisions and slice log |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Closed snapshot |
| [`slice-21-1-closeout.md`](slice-21-1-closeout.md) | Slice 21-1 detail |
| [`slice-21-2-charter.md`](slice-21-2-charter.md) | Slice 21-2 detail |
