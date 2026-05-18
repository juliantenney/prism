# Session Handover — Sprint 22 portable pack

**Role:** authoritative for **this pack** until Sprint 22 closes.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-22-unified-workflow-settings/`

**Date:** 2026-05-15 (bootstrap)

**Status:** **Proposed / ready for charter** — bootstrap only; **no implementation**

**Predecessor closeout:** [`docs/consolidation/sprint-21-closeout.md`](../../../consolidation/sprint-21-closeout.md)

**Fresh-chat bootstrap:** [`GPT-bootstrap-sprint-22.md`](GPT-bootstrap-sprint-22.md)

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 22** | **Bootstrap** — no implementation |
| **Sprint 21** | **Closed** — **149 tests** |
| **Sprint 20** | **Closed** — **135 tests** |

---

## Why Sprint 22 exists

Sprint 21 completed **per-step** pack-defined parameter controls and clarified workflow-mode Prompt Factory as **draft-centric**.

**Gap:** Operational tuning of a **whole workflow** still requires visiting each step. Users need one **unified Settings** view for:

- workflow-level pedagogical parameters (when packs declare them), and  
- parameters for **steps included in this workflow instance** only.

**UI direction:** `[Run] [Settings] [Edit]` — Settings is a **mode**, not a modal.

---

## Sprint 22 thesis (one sentence)

*Aggregate pack-declared workflow and included-step parameter controls into a unified Settings surface, reusing Sprint 21 generic rendering and existing persistence — without prompt editing, refinement, or a global parameter catalogue.*

---

## What Sprint 21 already provides (do not rebuild)

| Capability | Source |
|------------|--------|
| `stepParameterControls` metadata contract | Sprint 21 |
| Generic renderer (`controlType` branches) | Sprint 21 `app.js` |
| Grouping, visibility, advanced collapse | Sprint 21 Slice 21-2 |
| `[PRISM_STEP_PARAMS]` persistence | Pre-21 + 21 |
| Workflow-mode PF (draft + save + read-only context) | Sprint 21 UX |
| Provenance + discoverability | Sprint 20 |

Sprint 22 **aggregates and navigates** — it does not replace the parameter contract.

---

## Conceptual model (carry forward)

After synthesis, primary authority:

| Surface | Content |
|---------|---------|
| **Settings** | Structured parameters (workflow + included steps) |
| **Edit** | Step prompt drafts, implementation detail |
| **Run** | Execution and outcomes |
| **Prose brief** | Not primary operational editor |

---

## In scope (programme intent)

- Unified Settings **surface** (mode or panel — charter decides)  
- Included-step control aggregation (instance-scoped)  
- Workflow-level parameter section when pack metadata exists  
- Reuse Sprint 21 renderer and persistence  
- `[Run] [Settings] [Edit]` navigation alignment (charter scope)  

---

## Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Implementation in bootstrap | Planning only |
| Modal Settings redesign | Mode-based model |
| Prompt editing in unified Settings | Edit only |
| Conversational refinement | Not in Settings |
| Provenance redesign | Sprint 20 preserved |
| Parameter AI review/refine | No new AI |
| Workflow graph redesign | Navigation only |
| Manual workflow parameter authoring | Future candidate |
| Research pack changes | Frozen |
| Schema / mapping / synthesis overhaul | Preserve 18–21 |

---

## Architectural continuity (must preserve)

- Lightweight elicitation  
- Essentials gating  
- Advisory adequacy only  
- Pack-driven metadata  
- Generic runtime (no per-key UI branches)  
- Domain-pack-driven aggregation only for **included** steps  
- No wizard regression  

---

## Future-looking notes (not Sprint 22 commitments)

- Workflows as structured pedagogical state  
- Packs as structured reasoning systems (pedagogical vs epistemic)  
- Repurposable workflows  
- Manual workflow parameter authoring (later)  
- Inspectable / editable knowledge structures  

---

## Verification

```bash
node --test tests/*.test.js
```

**Floor at bootstrap:** **149 passed**, 0 failed.

---

## Recommended first task

Read **`sprint-22-bootstrap.md`**, investigate Factory navigation and step inclusion resolution, then draft **Slice 22-1 charter**.
