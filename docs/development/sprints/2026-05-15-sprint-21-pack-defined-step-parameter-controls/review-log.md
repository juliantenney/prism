# Sprint 21 review log — Pack-defined Step Parameter Controls

**Pack path:** `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/`  
**Date:** 2026-05-15  
**Status:** **Closed — complete for scoped Settings operability programme**

**Consolidation closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

---

## 2026-05-15 — Bootstrap session

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R21-001 | Sprint 21 follows **closed Sprint 20** operability gap | Explainability complete; Settings editor incomplete |
| R21-002 | **Settings = full workflow parameter editor** | Programme thesis from closeout §11 |
| R21-003 | **Pack metadata + generic runtime renderer** | Avoid bespoke `app.js` per parameter |
| R21-004 | **Two-tier model** — elicited vs Settings-only | Preserve lightweight synthesis; rich post-gen tuning |
| R21-005 | **Slice 21-1 first** — metadata + generic renderer MVP | Foundation before grouping and LD pilot |
| R21-006 | **Slice 21-2** — advanced/basic + visibility | Progressive disclosure; hide internal params |
| R21-007 | **Slice 21-3** — LD pilot + provenance alignment | Integrate with Sprint 20 explainability |
| R21-008 | Sprint 21 completes **parameterised front-end**, not synthesis | Architectural framing |
| R21-009 | Research **frozen** unless chartered | S1–S13 regression anchor |
| R21-010 | No blocking elicitation or profile **required** tier regression | Continuity from 18–20 |
| R21-011 | Pack audit **deferred** | Reflection §5 — informs packs, not 21-1 blocker |

### Artefacts created

| Artefact | Path |
|----------|------|
| Sprint 21 portable pack (7 files) | `docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/` |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **135 passed**, 0 failed (docs-only bootstrap).

### Open questions (for Slice 21-1 charter)

1. Metadata location — pack root `stepParameterControls` vs per-step `promptFactory` extension vs `workflowBriefConfig` sibling?  
2. Minimum control types for v1 — `select`, `number`, `boolean`, `text` only?  
3. Coexistence with existing `userOptions` / `configurationMode: simple` — migrate or bridge?  
4. LD pilot step list — assessment + page first, or activity scaffolding params?  
5. Provenance source label when user edits in Settings — **explicit** override vs new tier?

---

## 2026-05-15 — Slice 21-1 charter simplicity framing

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R21-012 | Sprint 21 = **minimal metadata + generic Settings**, not schema/synthesis | User framing: identify existing params, describe, render, persist |
| R21-013 | **`elicitation`**: only `elicited` \| `settings-only`** | Must-ask = small tier; settings-only = default for richer tuning |
| R21-014 | **No extra categories** in v1 | Avoid versioning enums, validation framework, new elicitation types unless code requires |
| R21-015 | Pack controls render **outside** `configurationMode: simple` gate | Investigation: Design Page `none` + mapped params not editable today |

### Artefacts updated

- [`slice-21-1-charter.md`](slice-21-1-charter.md) — deliberate simplicity section + simplified metadata tables

---

## 2026-05-15 — Slice 21-1 implementation

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R21-016 | **`stepParameterControls` on `workflowBriefConfig`** | Co-locate with `mappingRules`; single LD contract |
| R21-017 | Pack controls render **before** `configurationMode` gate | Design Page `none` + mapped params editable |
| R21-018 | **`userOptions` dedupe** by pack-owned `key` | Avoid duplicate editors for pilot params |
| R21-019 | Persist via **`upsertWorkflowStepParamBlock`** only | No brief `resolvedFactors` dual-writer in 21-1 |
| R21-020 | Four **`controlType`** branches only | No per-param pedagogy branches in runtime |

### Artefacts created / updated

| Artefact | Path |
|----------|------|
| LD pack metadata | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Runtime + UI | `app.js` |
| Tests | `tests/workflow-step-parameter-controls.test.js` |
| Closeout | [`slice-21-1-closeout.md`](slice-21-1-closeout.md) |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **145 passed**, 0 failed (**+10** from 135).

---

## 2026-05-15 — Slice 21-1 closeout

Slice **21-1 closed** — pack-defined parameter metadata + generic Settings renderer MVP for five LD pilot `stepParams`. Programme closeout: [`slice-21-1-closeout.md`](slice-21-1-closeout.md). **Next:** Slice **21-2** (grouping, visibility, control polish) — not started.

---

## 2026-05-15 — Sprint 21 workflow-mode Prompt Factory UX adjunct

Presentation-only refinement when Prompt Factory opens from Workflow step **Settings…** (`index.html`, `style.css`, `app.js` — `applyWorkflowPromptFactoryStepUx()`).

### Purpose

Clarify the editing hierarchy when Prompt Factory is opened from Workflow step Settings.

### Problem addressed

Users could not clearly distinguish between:

- workflow context
- AI refinement
- direct prompt editing
- workflow parameter editing

The previous hierarchy visually implied that:

- “Review or refine” was the primary action
- upper task/context textareas were editable prompt surfaces
- “Final Prompt” was secondary, despite being the real editable prompt

### Changes implemented

- Workflow parameters moved to the top of workflow-mode Prompt Factory
- “Final Prompt” renamed to **Editable Prompt Draft**
- Direct-editing helper text added
- “Refine the Brief” reframed as **Optional AI refinement**
- “Start refinement” renamed to **Refine with AI** (demoted from primary styling in workflow mode)
- Workflow context presented as read-only generated context
- Workflow-mode hierarchy clarified:

  1. Workflow parameters
  2. Editable prompt draft
  3. Optional AI refinement
  4. Workflow context / provenance

### Constraints preserved

- No synthesis changes
- No provenance redesign
- No `stepParams` changes
- No pack metadata changes
- No Prompt Factory architecture rewrite

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **145 passed**, 0 failed.

### Note

This adjunct resolves a major workflow-mode UX ambiguity exposed by Sprint 21 parameter controls: once pack-defined parameters appeared at the top of Settings, the rest of the Prompt Factory surface no longer matched user mental models for what to edit vs what to read. Slice **21-2** not started.

---

## 2026-05-15 — Slice 21-2 implementation

### Changes

| Area | Detail |
|------|--------|
| Visibility | `visible: false` excluded from render; hidden keys still dedupe `userOptions`; `[PRISM_STEP_PARAMS]` unchanged |
| Grouping | `groupWorkflowStepParameterControlsForSettings` — Basic / Advanced (`<details>`); Advanced collapsed by default |
| `group` metadata | Optional section label; fallback Basic / Advanced |
| Summaries | `resolveWorkflowSettingsParamLabel` prefers pack `label` |
| LD pack | +`include_examples` (Design Page), +`total_items` (Design Assessment) — **7** controls |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed (**+4** from 145).

---

## 2026-05-15 — Workflow-mode Prompt Factory micro-polish (final UX pass)

### Purpose

Remove inactive conversational refinement clutter and make refinement fully on-demand in workflow-mode Prompt Factory.

### Problem addressed

When refinement had not started, disabled controls and empty answer fields implied unfinished work; workflow context competed visually with the editable draft.

### Changes implemented

| Area | Detail |
|------|--------|
| Idle refinement | Hide conversation log, answer field, Send/Finish buttons, session badge, and section headings until activation; show **Need help improving this prompt?** + **Refine with AI** only |
| Activation | `handleStartRefinement` sets `workflowRefinementUiActivated` and expands panel with focus on first available control |
| Workflow context | `<details>` disclosure collapsed by default in workflow mode; read-only copyable textarea when expanded |
| Standalone | Unchanged interaction flow; disclosure stays open with summary hidden |

### Constraints preserved

No synthesis, provenance, `stepParams`, pack metadata, persistence, or parameter-control changes.

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed.

---

---

## 2026-05-15 — Workflow-mode UX consistency cleanup (final)

### Purpose

Remove ambiguity between editable prompt state and generated workflow context; keep **Refine with AI** enabled as optional on-demand activation.

### Changes

| Area | Detail |
|------|--------|
| Workflow context | Replaced read-only textarea affordance with scrollable `<pre class="workflow-context-document">` provenance block (selectable, non-editable) |
| Copy | **Copy context** button copies generated workflow context text only |
| Refine with AI | Stays **enabled** in idle workflow mode (ghost styling); API key still required before refinement runs |
| Hidden textarea | `#initialPrompt` retained for existing read paths; hidden in workflow mode |

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed.

---

---

## 2026-05-15 — Workflow-mode simplification (final)

### Purpose

Remove conversational refinement and standalone authoring controls from workflow-mode Prompt Factory; keep a deterministic parameter → draft → save model.

### Removed in workflow mode only

- Entire **Optional AI refinement** card (Refine with AI, conversation log, answers, finish flow, session badge)
- **New brief** / **Refine manually**
- Standalone brief fields, summary aside, prompt version selector, Copy prompt (brief card authoring chrome)

### Preserved in workflow mode

- Workflow parameters
- Editable Prompt Draft + **Save to step** (primary)
- Collapsed workflow context (read-only document + Copy context)
- Workflow wizard notice (lightweight helper)

Standalone Prompt Factory unchanged (full refinement + authoring).

### Verification

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed.

---

---

## 2026-05-15 — Sprint 21 programme closeout

### Summary

Sprint 21 completed the parameterised workflow Settings front-end. Pack-defined `stepParams` are editable via generic metadata-driven controls; workflow-mode Prompt Factory is deterministic (parameters → draft → save → read-only context). Standalone Prompt Factory unchanged.

### Verification (final)

```bash
node --test tests/*.test.js
```

**Result:** **149 passed**, 0 failed.

### Closeout artefacts

| Artefact | Path |
|----------|------|
| Consolidation closeout | [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| Pack current state | [`CURRENT-STATE.md`](CURRENT-STATE.md) |
| Handover | [`HANDOVER.md`](HANDOVER.md) |
| Index | [`sprint-21-index.md`](sprint-21-index.md) |

### Deferred to Sprint 22 candidate

- Provenance relabelling after Settings overrides (Slice 21-3)
- Broader LD / Research parameter adoption
- Pack validation framework
- Legacy `userOptions` migration

---

## Status

**Closed — complete for scoped Settings operability programme** — **149 tests**. **Slice 21-3** not implemented (deferred).
