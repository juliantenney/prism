# Sprint 22 Slice 22-1 — Unified Settings shell + included-step aggregation MVP

**Date:** 2026-05-15  
**Status:** **Closed**  
**Sprint:** 22 — Unified Workflow Settings surface  
**Slice:** 22-1

**Bootstrap:** [`sprint-22-bootstrap.md`](sprint-22-bootstrap.md)  
**Predecessor:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — **149 tests**

---

## Objective

Deliver a **domain-pack-agnostic** workflow **Settings** mode that aggregates pack-defined parameter controls for **included steps only** (steps with `canonical_step_id`), reusing Sprint 21 renderer, grouping, visibility, and `[PRISM_STEP_PARAMS]` persistence.

**Thesis (slice):** *One workflow mode tab surfaces all step-level pack parameters for the current instance; edits sync to step notes; Save workflow persists.*

---

## Scope

| In scope | Detail |
|----------|--------|
| **`[Run] [Settings] [Edit]`** mode tabs | Settings is a durable mode, not a modal |
| **Aggregation helpers** | `collectIncludedWorkflowStepRows`, `aggregateUnifiedWorkflowParameterSections`, `resolveWorkflowBriefConfigForWorkflow` |
| **Unified panel UI** | `#unifiedWorkflowSettingsPanel` + per-step cards via `renderWorkflowPackParameterControlsSection` |
| **Change sync** | `syncUnifiedWorkflowSettingsToStepNotes` on control change |
| **Renderer opts** | `sectionHeading`, `onPackParamChange` on shared Sprint 21 renderer |
| **Tests** | `tests/unified-workflow-settings.test.js` (5 cases) |
| **Settings-mode CSS** | Hide edit/run chrome; style unified panel |

| Out of scope (later slices) | Detail |
|-----------------------------|--------|
| Workflow-level `workflowParameterControls` | Slice 22-2 |
| Async brief-config load when missing on saved workflow | MVP empty-state only |
| Prompt editing in unified Settings | Edit / per-step PF only |
| Global pack parameter catalogue | — |
| LD-specific runtime branching | — |

---

## Implementation summary

| Area | Change |
|------|--------|
| `app.js` | Aggregation helpers, `renderUnifiedWorkflowSettingsUI`, `setWorkflowMode("settings")`, test API exports |
| `index.html` | Run \| Settings \| Edit tabs; unified settings panel |
| `style.css` | `.workflow-detail.settings-mode` + `.unified-workflow-settings-*` |
| `tests/unified-workflow-settings.test.js` | Aggregation + briefConfig resolution |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **154 passed**, 0 failed (149 baseline + 5 new).

**Slice 22-1.1:** **157 passed** — null `briefConfig` test, sync-to-notes test, documented re-render staleness test.

---

## Accepted limitations (22-1 / 22-1.1)

| Limitation | Notes |
|------------|--------|
| Workflow-level pack parameters | Deferred to Slice **22-2** |
| Empty Settings without persisted `briefConfig` | Saved workflows may lack `workflowBriefResolution.briefConfig`; recovery starts in **22-2** |
| Re-render vs DOM sync | `renderUnifiedWorkflowSettingsUI` reads in-memory workflow params; unsaved unified edits sync to hidden step notes but re-entering Settings may show stale values until **Save** |
| Prompt refresh on param change | Unified Settings does not call `applyWorkflowStepPromptDefaults` (by design) |

---

## Manual smoke (recommended)

1. My Workflows → open an LD workflow with `workflowBriefResolution.briefConfig` and canonical steps.
2. Click **Settings** — per-step parameter cards appear.
3. Change a control → **Save** workflow → confirm `[PRISM_STEP_PARAMS]` in step notes.

---

## Handoff to Slice 22-2

- Add workflow-level parameter section when packs declare workflow-scoped controls.
- Consider async `getWorkflowBriefConfig` when saved workflows lack persisted `briefConfig`.
