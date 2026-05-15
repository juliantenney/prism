# Sprint 21 Slice 21-1 — closeout (Parameter Metadata + Generic Settings Renderer MVP)

**Date:** 2026-05-15  
**Status:** **Closed** — implementation + tests complete  
**Charter:** [`slice-21-1-charter.md`](slice-21-1-charter.md)  
**Sprint pack:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Predecessor:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) — **135 tests** at Sprint 20 closeout

**Verification:**

```bash
node --test tests/*.test.js
```

**Result:** **145 passed**, 0 failed (**+10** from Slice 21-1)

---

## 1. Slice objective

For a **narrow LD pilot**, attach minimal human-readable and control metadata to `stepParams` that already matter, render them **generically** in Factory Settings, and **persist** edits through the existing `[PRISM_STEP_PARAMS]` block — without bespoke UI per parameter, synthesis changes, or mapping interpreter changes.

**Essential task delivered:**

1. Identify pack-defined params that already matter (from `mappingRules` + Sprint 20 summary keys).  
2. Describe each with `label`, `description`, `elicitation` (`elicited` | `settings-only`).  
3. Declare minimal control metadata (`controlType`, `default` / `options`, `visible`, `advanced`).  
4. Render controls generically in Settings (one path per `controlType`).  
5. Persist edits back into `stepParams`.

---

## 2. Implementation summary

| Deliverable | Outcome |
|-------------|---------|
| **LD pack metadata** | `workflowBriefConfig.stepParameterControls` — five pilot entries |
| **Runtime helpers** | Normalise, filter by step, resolve values, dedupe `userOptions` |
| **Settings UI** | **Workflow parameters** section renders **independently of** `promptFactory.configurationMode` |
| **Design Page fix** | `configurationMode: "none"` steps now expose mapped params (e.g. `page_profile`, `tone_style`, `depth_level`) |
| **Dedupe** | Legacy `userOptions` skipped when pack owns the same `key` |
| **Persistence** | Pack control values merged into existing `[PRISM_STEP_PARAMS]` via `upsertWorkflowStepParamBlock` |
| **Tests** | `tests/workflow-step-parameter-controls.test.js` — 10 new cases |

---

## 3. Files changed

| File | Role |
|------|------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | `stepParameterControls` array (LD only) |
| `app.js` | Helpers, `renderWorkflowStepPromptConfigUI`, `collectWorkflowStepPromptOptionSelections`, `normalizeWorkflowBriefConfig`, `__PRISM_TEST_API` exports |
| `tests/workflow-step-parameter-controls.test.js` | **New** — metadata, filter, resolve, dedupe, serialisation |
| `review-log.md` | Slice 21-1 closeout entry |

**Not changed:** Research pack, `applyWorkflowBriefMappings`, adequacy/mapping interpreters, provenance UI, synthesis paths.

---

## 4. Metadata contract implemented

**Location:** `workflowBriefConfig.stepParameterControls[]` on the Learning Design pack.

**Per-entry fields (v1):**

| Field | Required | Notes |
|-------|----------|--------|
| `key` | Yes | Leaf `stepParams` name |
| `canonicalStepId` | Yes | e.g. `step_design_page` |
| `label` | Yes | Settings label |
| `description` | Yes | Helper text under control |
| `elicitation` | Yes | `elicited` \| `settings-only` (documentary in 21-1) |
| `controlType` | Yes | `select` \| `boolean` \| `number` \| `text` |
| `default` | Yes | When absent from notes |
| `options` | For `select` | `{ value, label? }[]` |
| `visible` | Yes | `false` omits control |
| `advanced` | Yes | Label suffix `(advanced)`; collapse UI deferred to 21-2 |

**Pilot entries:**

| `canonicalStepId` | `key` | `controlType` | `elicitation` |
|-------------------|-------|---------------|---------------|
| `step_design_page` | `page_profile` | `select` | `elicited` |
| `step_design_page` | `tone_style` | `select` | `settings-only` |
| `step_design_page` | `depth_level` | `select` | `settings-only` |
| `step_design_assessment` | `activity_type` | `select` | `elicited` |
| `step_generate_assessment_items` | `number_of_items` | `number` | `elicited` |

---

## 5. Runtime behaviour implemented

| Behaviour | Implementation |
|-----------|----------------|
| **Load metadata** | `getWorkflowStepParameterControlsFromBriefConfig` ← `normalizeWorkflowBriefConfig` |
| **Filter** | `filterWorkflowStepParameterControlsForStep` — match `canonicalStepId`, `visible !== false` |
| **Normalise** | `normalizeWorkflowStepParameterControl` — reject unknown `controlType`, invalid `select` without `options` |
| **Resolve value** | `resolveWorkflowStepParameterValue` — `[PRISM_STEP_PARAMS]` then `default` |
| **Render** | `renderWorkflowPackParameterControlsSection` + `appendWorkflowPackParameterControlDom` — branches on `controlType` only |
| **Dedupe** | `buildPackOwnedUserOptionIdMap` + `filterUserOptionsExcludingPackKeys` |
| **Collect from DOM** | `data-workflow-pack-param="1"` + `data-param-key` in `collectWorkflowStepPromptOptionSelections` |

**Settings open path:** Unchanged entry (**Settings...** → Prompt Factory). Pack section renders **before** the legacy `configurationMode === "simple"` gate so **Design Page** (`none`) and other mapped steps get editors.

**Hint copy:** When pack controls exist — *"Workflow parameters are stored on the step and applied when the step runs."*

---

## 6. Persistence model

| Step | Mechanism |
|------|-----------|
| **Read** | `parseWorkflowStepParamBlock(ctx.stepNotes)` / step `notes` |
| **Write** | `applyWorkflowStepPromptDefaults` (skip on `workflow_step_open_prefill`) |
| **Merge** | `mergeWorkflowStepParamValueMap` — pack + `userOptions` rows |
| **Serialize** | `upsertWorkflowStepParamBlock` → `[PRISM_STEP_PARAMS]` key=value lines in `step.notes` |
| **Save** | Existing workflow step record + `saveWorkflows()` |

**Not in 21-1:** Writing Settings edits back to brief `resolvedFactors` (dual-writer deferred).

**Execution:** Unchanged — step runs already consume `[PRISM_STEP_PARAMS]`; no execution-engine redesign.

---

## 7. Tests

**New file:** `tests/workflow-step-parameter-controls.test.js`

| Area | Covered |
|------|---------|
| Metadata normalisation | Valid select; unsupported types rejected |
| Dedupe | Duplicate `(canonicalStepId, key)` |
| Visibility / step filter | `visible: false`; filter by `canonicalStepId` |
| Value resolution | Stored param overrides `default` |
| LD pack | Five pilot controls present |
| `userOptions` dedupe | `page_profile` excluded when pack owns key |
| Serialisation | `mergeWorkflowStepParamValueMap` + `upsertWorkflowStepParamBlock` round-trip |
| Select options | Preserved through normalisation |

**Regression:** Full suite **145 passed**, 0 failed.

---

## 8. Manual validation checklist

Run with `npm run dev` and an **LD-only** workflow (save design before library Settings where required).

| # | Check | Pass |
|---|--------|------|
| 1 | Design a workflow with **Design Page**, **Design Assessment**, **Generate Assessment Items** | ☐ |
| 2 | Save workflow; open **Settings** on **Design Page** (`configurationMode: none`) | ☐ |
| 3 | **Workflow parameters** shows `page_profile`, `tone_style`, `depth_level` | ☐ |
| 4 | Change `tone_style`; save step; step summary cue updates | ☐ |
| 5 | Step `notes` contains `[PRISM_STEP_PARAMS]` with updated keys | ☐ |
| 6 | **Design Assessment** — edit `activity_type`; persists | ☐ |
| 7 | **Generate Assessment Items** — edit `number_of_items`; persists; no duplicate `userOptions` row for same key | ☐ |
| 8 | Resolved brief / provenance still loads; no new blocking questions | ☐ |
| 9 | Research workflow (if opened) — no new pack controls (LD only) | ☐ |

---

## 9. Confirmed non-regressions

| Area | Status |
|------|--------|
| **Workflow synthesis** | **No changes** |
| **`applyWorkflowBriefMappings`** | **No changes** |
| **Research pack / fixtures S1–S13** | **No changes** |
| **Provenance UI / view model** | **No redesign** |
| **Wizard / elicitation** | **No expansion** — no new brief factors or required post-gen queues |
| **Planning adequacy interpreters** | **Unchanged** |
| **Ready non-blocking** | **Preserved** |
| **Sprint 20 discoverability** | **Preserved** — badges, summaries, planning → Settings links |

---

## 10. Known deferrals

| Item | Target |
|------|--------|
| **Advanced/basic grouping UI** (collapse by default) | Slice **21-2** |
| **`visible: false` at scale** / internal param hiding | Slice **21-2** |
| **Broader LD parameter coverage** | Slices **21-2** / **21-3** |
| **Provenance source relabelling after Settings edits** | Slice **21-3** |
| **Pack validation framework** | Future programme |
| **Research pack adoption** | Separate charter |
| **Brief ↔ step param sync** | Slice **21-3** or later |
| **`userOptions` migration** | Optional follow-on — bridge only in 21-1 |

---

## 11. Recommended next slice

**Slice 21-2 — Grouping, visibility, and control polish**

- Collapse **advanced** controls by default.  
- Honour `visible: false` for low-value / internal params.  
- Expand LD metadata coverage incrementally.  
- Reduce Settings panel noise without new elicitation or synthesis changes.

**Do not start 21-2** until this closeout is accepted and manual checklist is satisfied.

---

## 12. References

| Document | Role |
|----------|------|
| [`slice-21-1-charter.md`](slice-21-1-charter.md) | Charter |
| [`sprint-21-bootstrap.md`](sprint-21-bootstrap.md) | Programme context |
| [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) | Prior closeout |
| [`sprint-20-slice-1-closeout.md`](../../../consolidation/sprint-20-slice-1-closeout.md) | Summaries + Settings navigation |
