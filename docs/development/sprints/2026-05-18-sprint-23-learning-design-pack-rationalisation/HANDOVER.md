# Session Handover — Sprint 23 portable pack

**Role:** authoritative for **this pack** until Sprint 23 closes.

**Pack path:** `docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/`

**Date:** 2026-05-18 (bootstrap)

**Status:** **Proposed / ready for charter** — bootstrap only; **no implementation**

**Predecessor:** [`../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md`](../2026-05-15-sprint-22-unified-workflow-settings/CURRENT-STATE.md)

**Fresh-chat bootstrap:** [`GPT-bootstrap-sprint-23.md`](GPT-bootstrap-sprint-23.md)

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 23** | **Bootstrap** — no implementation |
| **Sprint 22** | **Feature-complete (chartered slices)** — **185 tests** documented |
| **Sprint 21** | **Closed** — **149 tests** |

---

## Why Sprint 23 exists

Sprint 22 delivered **unified Settings** and expanded **LD pack metadata** so workflow-scale parameter tuning works through a generic runtime.

**Gap:** Pack semantics are not yet fully rationalised:

- Elicitation may **duplicate** Settings/synthesis commitments.  
- **Design Assessment** spans bespoke runtime logic, pack controls, and brief mappings without a single precedence story.  
- **Prompt Factory** may still expose **bespoke controls** not declared in `stepParameterControls`.  
- **Workflow vs step** ownership for assessment and delivery params needs explicit rules.  

Sprint 23 is a **pack semantics** programme — **not** a Settings or runtime architecture sprint.

---

## Sprint 23 thesis (one sentence)

*Rationalise the Learning Design domain pack so elicitation initialises persistent pedagogical state, pack metadata is declarative authority, and bespoke controls are audited — preserving Sprint 22 unified Settings and generic runtime architecture.*

---

## What Sprint 22 already provides (do not rebuild)

| Capability | Source |
|------------|--------|
| Unified Settings `[Run] [Settings] [Edit]` | Sprint 22 |
| Workflow + included-step aggregation | Sprint 22 |
| `workflowParameterControls` / `stepParameterControls` | Sprint 22 LD expansion |
| Generic renderer + persistence | Sprint 21–22 |
| Pack-agnostic discovery | Sprint 22 `discoverPackBriefConfigForWorkflow` |
| Provenance + discoverability | Sprint 20 |

Sprint 23 **rationalises pack meaning** consumed by these surfaces — it does not replace them.

---

## Conceptual model (carry forward)

| Surface | Content |
|---------|---------|
| **Elicitation** | Initialises structured state (reduced burden over time) |
| **Settings** | Operational parameter authority (workflow + included steps) |
| **Edit** | Step prompt drafts, implementation detail |
| **Run** | Execution and outcomes |
| **Prose brief** | Provenance / history — not sole semantic authority |

**Domain pack = declarative pedagogy.** Runtime = generic interpreter.

---

## In scope (programme intent)

- LD pack inventory and semantics matrix  
- Elicitation alignment and burden-reduction plan  
- Prompt Factory bespoke-control audit (`app.js` + pack)  
- Workflow vs step parameter ownership (documented rules)  
- Design Assessment priority review  
- Pack metadata rationalisation (chartered slices)  
- Minimal runtime cleanup **only** when parity proven  

---

## Out of scope (bootstrap default)

| Item | Reason |
|------|--------|
| Implementation in bootstrap | Planning only |
| Runtime rewrite | Pack-first |
| Unified Settings redesign | Sprint 22 delivered |
| Provenance redesign | Sprint 20 preserved |
| Workflow graph redesign | Out of scope |
| New synthesis architecture | Preserve WGC |
| Research pack changes | Frozen |
| `mappingRules` auto-promotion to controls | Sprint 22 rejected |

---

## Architectural continuity (must preserve)

- Sprint 22 unified Settings and mode chrome  
- Lightweight elicitation (aligned, not removed wholesale)  
- Essentials gating  
- Advisory adequacy only  
- Pack-driven metadata  
- Generic runtime (no new per-key UI branches without charter)  
- No wizard regression  

---

## Recommended slice sequence

| Order | Slice | Focus |
|-------|-------|--------|
| 1 | **23-1** | LD pack inventory + semantics matrix |
| 2 | **23-2** | Elicitation alignment + burden reduction |
| 3 | **23-3** | Prompt Factory bespoke-control audit |
| 4 | **23-4** | Workflow vs step parameter ownership |
| 5 | **23-5** | Design Assessment semantics + controls |
| 6 | **23-6** | Pack metadata rationalisation (apply edits) |

Charter **23-1** first. Defer runtime deletion of bespoke branches until **23-5** parity is documented.

---

## Verification

```bash
node --test tests/*.test.js
```

**Floor at bootstrap:** **185+** passed, 0 failed (Sprint 22 documented **185**).

---

## Recommended first task

Read **`sprint-23-bootstrap.md`**, export LD `workflowBriefConfig` inventory, grep `app.js` for `step_design_assessment`, then draft **Slice 23-1 charter** from [`slice-23-1-charter.md`](slice-23-1-charter.md) template.
