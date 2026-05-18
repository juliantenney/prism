# GPT bootstrap — Sprint 22 (Unified Workflow Settings)

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`

**Use this document** to start a **fresh chat** for Sprint **22**: **Unified Workflow Settings** — expose **workflow-level** and **included-step** pack-defined parameter controls in one **unified Settings surface**, reusing Sprint 21 generic rendering and persistence.

**Snapshots:** Read from **`context-files/`** when added; until then use canonical paths in §3.

---

## 1. Assistant role

You advance **Sprint 22** for PRISM: make **Settings the primary workflow tuning surface** by aggregating pack-declared parameters for the **current workflow instance** (workflow-level + included steps only) — without prompt editing, conversational refinement, modal redesign, or new parameter semantics.

You preserve **Sprint 18–21 architecture**: lightweight elicitation, essentials blocking, advisory adequacy, provenance model, pack-driven policy, generic runtime, Sprint 21 renderer/persistence, no wizard regression.

You **do not** implement changes, redesign synthesis, merge prompt editing into unified Settings, overhaul schema, or expand Research packs until a slice is **explicitly chartered**.

---

## 2. Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 22** | **Proposed / ready for charter** — bootstrap pack only; **no implementation** until Slice 22-1 chartered |
| **Sprint 21** | **Closed** — pack-defined step parameter controls + workflow-mode PF simplification; **149 tests** — [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) |
| **Sprint 20** | **Closed** — explainability + Settings UX; **135 tests** |
| **Sprint 19** | **Closed** — LD rationalisation; **118 tests** |
| **Sprint 18** | **Closed** — Research contextual refinement; **100 tests** |

---

## 3. Read-first order

1. **`CURRENT-STATE.md`** — verification floor and gap statement  
2. **`HANDOVER.md`** — purpose, boundaries, recommended slice sequence  
3. **`sprint-22-bootstrap.md`** — thesis, `[Run] [Settings] [Edit]`, likely approach  
4. [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md) — predecessor outcome and deferrals  
5. [`../2026-05-15-sprint-21-pack-defined-step-parameter-controls/sprint-21-bootstrap.md`](../2026-05-15-sprint-21-pack-defined-step-parameter-controls/sprint-21-bootstrap.md) — metadata contract and renderer baseline  
6. [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) — provenance + discoverability  
7. [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md) — parameterisation thesis  
8. [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) — guidance layers  
9. **`domains/learning-design/domain-learning-design-step-patterns.md`** — `stepParameterControls`, `mappingRules` (LD pilot)  
10. **`review-log.md`** — decisions log  

---

## 4. Architectural headline

Sprint 21 established: *pack-defined step parameters are first-class editable controls; workflow-mode Prompt Factory is draft-centric; prompt authority is unambiguous.*

Sprint 22 asks: *Can users tune a **whole workflow** in one **unified Settings** surface — workflow parameters plus **included-step** controls only — using `[Run] [Settings] [Edit]` without revisiting each step or editing prompts there?*

**Core principle:** After synthesis, operational state lives in **structured parameters** and **step prompt drafts**; the **prose brief** is not the primary editable authority. **Settings** = pedagogical tuning; **Edit** = implementation/prompts; **Run** = default orientation.

**Rule:** Packs declare parameters and metadata; runtime **aggregates for included steps**, **renders generically**, **persists** through Sprint 21 pathways — **not** a parameter-system rewrite.

---

## 5. UI model — [Run] [Settings] [Edit]

```text
[ Run ]    [ Settings ]    [ Edit ]
```

| Mode | Role |
|------|------|
| **Run** | Primary default workflow interaction |
| **Settings** | Unified pedagogical tuning (parameters only) |
| **Edit** | Step prompts and implementation inspection |

**Settings is a mode, not a modal.** Prompts and conversational refinement stay **outside** unified Settings (Edit / standalone Prompt Factory).

---

## 6. Core principles

| Principle | Intent |
|-----------|--------|
| **Pack-driven architecture** | Workflow and step params + metadata declared in domain packs |
| **Instance-scoped aggregation** | Controls only for steps **included in the current workflow** — no global catalogue |
| **Generic rendering** | Reuse Sprint 21 `controlType` renderer — no per-key UI branches |
| **Existing persistence** | `[PRISM_STEP_PARAMS]` and related pathways — no new parameter semantics |
| **Progressive disclosure** | Basic/advanced grouping, visibility, optional `group` labels (Sprint 21) |
| **No modal redesign** | Unified surface as durable Factory mode/panel — charter decides chrome |
| **Workflow retuning / repurposing** | Structured state editable for reuse — not prose-brief editing |

---

## 7. Architectural inheritance (do not regress)

| Layer | Role |
|-------|------|
| **Required essentials** | **Blocking** when missing — unchanged |
| **Workflow synthesis** | Creates concrete workflow — unchanged |
| **Planning adequacy** | **Advisory / non-blocking** |
| **Provenance** | Read-only explainability — **no redesign** in Sprint 22 bootstrap |
| **Sprint 21 step controls** | Substrate for aggregation and render |
| **Step / Edit prompt editing** | **Outside** unified Settings |
| **Optional profile refinement** | **Convenience only** — standalone PF |

---

## 8. Scope / out-of-scope

### In scope (when chartered)

- Unified **Settings** surface (workflow + included-step parameter aggregation)  
- Grouped parameter rendering (workflow section + per-step sections)  
- Reuse Sprint 21 renderer and persistence  
- `[Run] [Settings] [Edit]` navigation alignment (charter scope)  
- Workflow **retuning** and **repurposing** via structured parameters  

### Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Prompt editing redesign | Edit surface only |
| AI refinement in Settings | Not in model |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Navigation only |
| Schema / parameter-semantics overhaul | Reuse Sprint 21 contract |
| Manual workflow parameter authoring UI | Future candidate |
| Research pack expansion | Frozen unless chartered |
| Modal Settings redesign | Mode-based model |
| Implementation in bootstrap | Planning only |

---

## 9. Sprint 22 bootstrap deliverables

| Deliverable | Status |
|-------------|--------|
| Sprint 22 portable pack | **Done** — this folder |
| `GPT-bootstrap-sprint-22.md` | **Done** — this file |
| `SPRINT-CONTEXT.md` | **Done** |
| `context-files/` placeholder | **Done** — add bounded snapshots when chartering |
| Slice 22-1 charter | **Next** — when starting implementation |

---

## 10. Verification

```bash
node --test tests/*.test.js
```

**Expected:** **149 passed**, 0 failed (docs-only bootstrap).

---

## 11. Recommended first task

Charter **Slice 22-1** — **Unified Settings shell + included-step aggregation MVP** (see `sprint-22-bootstrap.md` §8).

Investigate: Factory navigation hook for Settings mode; resolve included `canonicalStepId` from workflow `steps[]`; reuse `renderWorkflowStepPromptConfigUI` / Sprint 21 grouping helpers.

---

## Copy-paste block for the assistant

You are assisting with Sprint 22 — Unified Workflow Settings for PRISM.

Sprint 21 (closed): Pack-defined step parameter controls, generic Settings renderer, `[PRISM_STEP_PARAMS]` persistence, workflow-mode Prompt Factory simplified to parameters + editable draft + save + read-only context. 149 tests passed.

Sprint 22 (bootstrap): Aggregate workflow-level and included-step pack-defined parameters into a unified Settings surface. UI direction: [Run] [Settings] [Edit]. Settings = primary pedagogical tuning (parameters only); Edit = prompts/implementation; Run = default. After synthesis, prose brief is not primary editable authority. Runtime aggregates controls for included workflow steps only; reuse Sprint 21 renderer/persistence; no new parameter semantics, no prompt editing in Settings, no modal redesign.

Preserve: lightweight elicitation, essentials, advisory adequacy, provenance (no redesign), pack-driven architecture, generic runtime, Research frozen. Do not implement until Slice 22-1 is chartered.

Out of scope unless chartered: prompt editing redesign, AI refinement, provenance redesign, workflow graph redesign, schema overhaul, manual workflow parameter authoring, Research expansion.

Start by reading:
1. docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/sprint-22-bootstrap.md
2. docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md
3. docs/consolidation/sprint-21-closeout.md
4. docs/development/sprints/2026-05-15-sprint-21-pack-defined-step-parameter-controls/sprint-21-bootstrap.md

Baseline: node --test tests/*.test.js → 149 passed.
