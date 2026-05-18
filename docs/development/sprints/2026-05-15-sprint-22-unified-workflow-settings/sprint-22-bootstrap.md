# Sprint 22 bootstrap — Unified Workflow Settings surface

**Date:** 2026-05-15  
**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Sprint title:** Sprint 22 — Unified Workflow Settings surface  
**Status:** **Proposed / ready for charter** — bootstrap pack only; **no implementation** until explicitly chartered.

**Portable handover:** **`GPT-bootstrap-sprint-22.md`** + **`HANDOVER.md`**.

**Predecessor:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

---

## 1. Executive summary

**Sprint 21 (closed)** established pack-defined **step** parameter controls, generic Settings rendering, and a **deterministic workflow-mode** Prompt Factory (parameters → editable draft → save → read-only context). **149 tests** green at closeout.

**Sprint 22 (bootstrap)** proposes a **unified workflow-level Settings surface** that aggregates **workflow-level** and **included-step** parameter controls in one pedagogical tuning view — without redesigning the parameter system, modals, or prompt editing.

**One-sentence thesis:**  
*After synthesis, operational workflow state lives in structured parameters and step prompt drafts; Settings becomes the primary workflow tuning surface ([Run] [Settings] [Edit]), aggregating only controls for steps actually in the current workflow instance.*

**Framing:** Sprint 22 is a **presentation and navigation** programme on top of Sprint 21’s generic renderer and persistence — **not** a parameter-semantics rewrite.

---

## 2. Why Sprint 22 follows Sprint 21

| Sprint 21 outcome | Sprint 22 use |
|-------------------|---------------|
| Generic pack metadata + renderer | **Reuse** for aggregated controls |
| `[PRISM_STEP_PARAMS]` persistence | **Unchanged** pathways |
| Per-step Settings (Prompt Factory) | **Complement** — prompt editing stays in step Edit |
| Workflow-mode PF simplification | **Align** — no refinement/prose in unified Settings |
| LD pilot `stepParameterControls` | **Expand aggregation** to workflow + all included steps |

**Do not reopen** Sprint 21 step-level Settings architecture except as the rendering/persistence substrate.

---

## 3. Conceptual model — workflows as pedagogical state

After workflow generation, the **primary editable authority** is no longer the original prose workflow brief.

| Layer | Role after synthesis |
|-------|----------------------|
| **Workflow parameters** | Workflow-level pedagogical assumptions (pack-declared, when present) |
| **Included step parameters** | Per-step tuning for steps **in this workflow instance** |
| **Step prompt drafts** | Implementation / local override layer (Edit surface) |
| **Original prose brief** | **Historical / provenance context** — not the main tuning surface |

**Prompts** are **implementation detail**: editable in **Step Settings / Edit**, not in unified workflow Settings.

**Settings** exposes **structured pedagogical state** — not raw prompt bodies, not conversational refinement, not verbose prose brief editing.

---

## 4. Intended UI model — [Run] [Settings] [Edit]

```text
┌──────────────────────────────────────────────────────────────┐
│  [ Run ]    [ Settings ]    [ Edit ]                          │
└──────────────────────────────────────────────────────────────┘
```

| Mode | Primary user orientation |
|------|---------------------------|
| **Run** | Default workflow interaction — execute, observe, complete steps |
| **Settings** | Unified pedagogical tuning — workflow + included-step parameters |
| **Edit** | Advanced implementation inspection — step prompts, step-level detail |

### Why Settings is not a modal

- Settings is a **durable workflow mode**, not a transient dialog over Run.
- Users need to **compare** tuning choices with run behaviour and step output without modal stack confusion.
- Aggregation across steps requires **spatial layout** (grouped sections), not a narrow overlay.

### Why prompts remain outside unified Settings

- Sprint 21 established **prompt authority** on the editable draft in step-level Edit.
- Mixing prompt bodies into workflow Settings would **reintroduce ambiguity** about what persists and what runs.
- Unified Settings = **parameters only**; prompts = **implementation layer**.

### Why the prose brief is not primary after synthesis

- Synthesis materialises assumptions into **parameters** and **step structure**.
- Provenance (Sprint 20) explains assumptions; Settings **edits** the structured form.
- Long-form brief editing belongs to **design-time** or explicit Edit flows — not operational tuning.

### Why included-step aggregation matters

- Users must not see a **global catalogue** of every parameter the pack could ever define.
- Only steps **present in the current workflow** (`canonicalStepId` / step identity from instance) qualify.
- Empty workflows and partial designs must degrade gracefully (no phantom controls).

---

## 5. Division of responsibility (unchanged principle)

| Owner | Responsibility |
|-------|----------------|
| **Pack** | Declare workflow params, step params, metadata (labels, visibility, groups, advanced/basic, control types) |
| **Runtime** | Collect included steps → aggregate visible controls → render generically → persist via existing pathways |

**Rule:** Runtime interprets policy; packs declare policy. **No per-parameter bespoke UI** in `app.js`.

---

## 6. Likely implementation approach (architecture only — not committed)

Bootstrap hypothesis for charter refinement:

### 6.1 Collect included steps

- From **current workflow instance** `steps[]` (or equivalent normalized shape).
- Derive `canonicalStepId` (or stable pattern id) per included step.
- **Exclude** steps not in the active workflow — no global parameter list.

### 6.2 Aggregate controls

- Load `stepParameterControls` (and future **workflow-level** control arrays when pack-defined) from active domain pack(s).
- Filter: `visible !== false`, step id ∈ included set.
- Optional: workflow-level section separate from per-step sections.

### 6.3 Render grouped UI

- **Workflow parameters** group (when pack provides workflow-scoped controls).
- **Per included step** groups (step title + pack metadata `group` / basic-advanced from Sprint 21).
- Reuse Sprint 21 helpers: normalise, group, render by `controlType`, `resolveWorkflowSettingsParamLabel`.

### 6.4 Persist

- **No new parameter semantics.**
- Continue `[PRISM_STEP_PARAMS]` / existing step notes blocks and workflow-level storage patterns as chartered per pack.
- Do not dual-write brief `resolvedFactors` without explicit charter.

### 6.5 Explicit non-features in unified Settings

| Excluded | Reason |
|----------|--------|
| Raw prompt editing | Edit / step Settings only |
| Conversational refinement | Standalone PF only; removed from workflow PF in 21 |
| Verbose prose brief editing | Not operational authority |
| Global pack parameter catalogue | Instance-scoped only |

---

## 7. Relationship to Sprint 20–21 surfaces

| Surface | Sprint 22 relationship |
|---------|-------------------------|
| Factory provenance panel | **Read-only** explainability — not replaced by Settings |
| Per-step Settings (PF workflow mode) | May **narrow** to prompt draft + save; parameters **hoist** to unified Settings over time (charter decision) |
| Step summaries / Tunable badges | Should **align** with aggregated controls |
| Planning adequacy | **Unchanged** interpreters — links may target unified Settings |

Charter must decide **migration path** from per-step PF parameter panel vs unified surface (parallel vs replace).

---

## 8. Proposed slice sketch (for charter — not approved)

| Slice | Hypothesis | Notes |
|-------|------------|-------|
| **22-1** | Unified Settings shell + included-step aggregation MVP | LD workflow pilot; reuse 21 renderer |
| **22-2** | Workflow-level parameter section (when pack metadata exists) | Pack contract extension if needed |
| **22-3** | Navigation ([Run][Settings][Edit]) + discoverability alignment | Factory chrome; no graph redesign |

Slices are **placeholders** until investigation confirms boundaries.

---

## 9. Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Modal redesign of Settings | Settings = mode, not modal |
| Parameter-system / schema rewrite | Reuse Sprint 21 contract |
| Prompt editing in unified Settings | Edit surface only |
| Conversational refinement in Settings | Out of model |
| Provenance redesign | Sprint 20 layer preserved |
| Parameter AI review / refine | No new AI logic |
| Workflow graph redesign | Navigation only |
| Manual workflow parameter authoring UI | **Future candidate** — note only |
| Research pack expansion | Frozen unless chartered |
| `applyWorkflowBriefMappings` redesign | Preserve |
| Synthesis / adequacy interpreter changes | Preserve |
| Utilities / page renderer programme | Separate |

---

## 10. Future-looking notes (not commitments)

Emerging ideas to inform later charters — **do not implement under Sprint 22 bootstrap**:

| Idea | Note |
|------|------|
| Workflows as **structured pedagogical state** | Parameters + drafts, not prose |
| Domain packs as **structured reasoning systems** | Declarative pedagogy + epistemology |
| **Pedagogical vs epistemic** packs | LD vs Research separation |
| **Repurposable workflows** | Templates with inspectable parameter state |
| **Manual workflow parameter authoring** | Author defines workflow-level params without synthesis |
| Workflows as **inspectable knowledge structures** | Export, diff, teach — long horizon |

---

## 11. Verification floor at bootstrap

```bash
node --test tests/*.test.js
```

**Expected:** **149 passed**, 0 failed (no code delta in bootstrap).

---

## 12. References

| Document | Role |
|----------|------|
| [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) | Predecessor outcome |
| [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) | Explainability layer |
| [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) | Parameterisation thesis |
| Sprint 21 pack | Generic renderer reference |
| [`docs/development/shared-vocabulary.md`](../../shared-vocabulary.md) | Operational phrases |
