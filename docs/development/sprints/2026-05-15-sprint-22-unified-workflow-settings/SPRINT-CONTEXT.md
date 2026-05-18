# Sprint 22 — Unified Workflow Settings (context)

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`  
**Date:** 2026-05-15  
**Phase:** **Proposed / ready for charter** — bootstrap pack only

**Fresh-chat entry:** [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md)

---

## Problem statement

Sprint 21 closed the **per-step parameter editor** gap: pack-defined `stepParams` are generic, editable Settings controls with grouped rendering and `[PRISM_STEP_PARAMS]` persistence.

**Remaining gap:** Tuning a **whole workflow** still requires opening **each step** separately. There is no **unified workflow-level Settings surface** that shows workflow parameters and **included-step** controls together for the **current workflow instance** only.

Without Sprint 22, the parameterised model is **operable per step** but not **efficient at workflow scale**.

---

## Sprint goal

Expose **workflow-level** and **included-step** pack-defined parameter controls in a **unified Settings surface**, using `[Run] [Settings] [Edit]` — reusing Sprint 21 rendering and persistence.

**Outcome:** Settings = primary workflow tuning; Edit = prompts; Run = default — **not** a modal or parameter-semantics rewrite.

---

## Core thesis

| Responsibility | Owner |
|----------------|-------|
| Which parameters exist | **Pack** |
| Labels, visibility, groups, control types | **Pack** |
| Which steps contribute controls | **Workflow instance** (included steps only) |
| Aggregate + render + persist | **Runtime** (generic; reuse Sprint 21) |
| Prompt bodies | **Edit** / step Settings — **not** unified Settings |

**Not:** global pack parameter catalogue or bespoke UI per parameter.

---

## UI model

```text
[ Run ]    [ Settings ]    [ Edit ]
```

| Mode | Content |
|------|---------|
| **Settings** | Structured pedagogical parameters |
| **Edit** | Step prompt drafts, implementation detail |
| **Run** | Execution and outcomes |

**Prose workflow brief:** historical / provenance context — **not** primary operational editor after synthesis.

---

## Candidate programme goals

| ID | Goal | Description |
|----|------|-------------|
| **A** | **Unified Settings shell** | Factory mode/panel for workflow tuning |
| **B** | **Included-step aggregation** | Controls only for steps in current workflow |
| **C** | **Grouped rendering** | Workflow section + per-step sections |
| **D** | **Sprint 21 reuse** | Renderer, grouping, persistence unchanged |
| **E** | **Navigation alignment** | [Run][Settings][Edit] discoverability |

---

## Success criteria (programme — bootstrap targets)

| Criterion | Target |
|-----------|--------|
| Unified surface shows included-step params | Yes — instance-scoped |
| No global parameter list | Yes |
| No prompt editing in Settings | Yes |
| Sprint 21 contract reused | Yes — no new semantics |
| Architecture preserved | Essentials, adequacy, elicitation, provenance |
| Test floor | **149+** passed, 0 failed |
| Research regression | **Frozen** unless chartered |

---

## In scope (when chartered)

- Unified Settings surface (not a modal)  
- Workflow + included-step parameter aggregation  
- Grouped generic rendering (reuse Sprint 21)  
- Existing persistence pathways  
- Workflow retuning / repurposing via structured state  

---

## Out of scope (bootstrap and default programme)

| Item | Reason |
|------|--------|
| Bootstrap implementation | Planning only |
| Prompt editing redesign | Edit only |
| Conversational / AI refinement | Outside Settings |
| Provenance redesign | Sprint 20 layer |
| Workflow graph redesign | Navigation only |
| Schema / mapping / synthesis overhaul | Preserve |
| Manual workflow parameter authoring | Future candidate |
| Research pack expansion | Frozen |
| `context-files/` full snapshots | Add when chartering slices |

---

## Dependencies

| Dependency | Notes |
|------------|--------|
| Sprint 21 closed | **149 tests**; renderer + metadata live |
| Sprint 21 closeout | Deferred provenance-after-override → Sprint 22 candidate |
| Sprint 20 provenance | Read-only; link targets may shift |
| `stepParameterControls` contract | Sprint 21 — extend only if workflow-level metadata chartered |
| Manual validation | `npm run dev` + Factory workflow with LD pilot |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Duplicate surfaces (per-step PF vs unified) | Charter migration path in 22-1 |
| Multi-domain workflow packs | Charter aggregation rules |
| Unsaved / design-preview workflows | Aggregate from draft steps only |
| Settings scope creep (prompts, brief) | Explicit exclusions in charter |
| Global parameter list temptation | Instance filter in runtime |

---

## Future-looking notes (not commitments)

- Workflows as structured pedagogical state  
- Domain packs as structured reasoning systems  
- Pedagogical vs epistemic packs  
- Repurposable workflows  
- Manual workflow parameter authoring  
- Inspectable knowledge structures  

---

## References

- [`sprint-22-bootstrap.md`](sprint-22-bootstrap.md)  
- [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md)  
- [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)  
- [`docs/consolidation/sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md)
