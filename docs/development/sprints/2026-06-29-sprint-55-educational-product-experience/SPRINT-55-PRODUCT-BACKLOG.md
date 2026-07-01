# Sprint 55 — Product Backlog

**Source:** [Sprint 54 closure — Product experience findings](../2026-06-29-sprint-54-pedagogic-fidelity-audit/SPRINT-54-CLOSURE-REPORT.md#product-experience-findings)  
**Principles:** [SPRINT-55-DESIGN-PRINCIPLES.md](./SPRINT-55-DESIGN-PRINCIPLES.md)  
**Current state:** [SPRINT-55-CURRENT-STATE.md](./SPRINT-55-CURRENT-STATE.md)

---

## Completed — structural rendering (2026-06-29)

| ID | Item | Outcome |
| -- | ---- | ------- |
| **S55-STRUCT-01** | Beat-first activity rendering | `activity.episode_plan.beats` drives render order |
| **S55-STRUCT-02** | Material–beat registry | `lib/beat-material-registry.js` — single source of truth |
| **S55-STRUCT-03** | Beat section markup + diagnostics | `.util-beat-section`; `[PRISM beat-render]` logging |
| **S55-STRUCT-04** | Acceptance tests | `tests/beat-first-activity-render.test.js`, `tests/beat-material-registry.test.js` |

Do not re-implement material-order progression heuristics for activities with episode plans.

---

## P1 — Must ship (Sprint 55 core)

| ID | Item | Description | Acceptance sketch |
| -- | ---- | ----------- | ----------------- |
| P1-01 | **Learning Journey Navigator** | Persistent or top-level control listing activities in sequence with current position | Jump to activity; shows LO/activity title; works on mobile width |
| P1-02 | **TOC + anchor navigation** | Page TOC + per-activity anchors for major sections (Orient, beats, Check, …) | Click/jump lands correct section; URL hash or export-stable ids |
| P1-03 | **Progress visibility** | Resource % or step N of M **plus** activity compass alignment | Learner states position without scrolling search |
| P1-04 | **Output affordances** | Print stylesheet; explicit next-step cue; optional “mark complete” local state (no LMS) | Print hides nav chrome appropriately; next action visible at activity end |

### P1-04 — Output affordances

#### Example affordances

* Writing task → answer lines  
* Reflection task → reflection box  
* Comparison task → comparison table  
* Checklist task → tickable checklist  
* Revision task → revision marker  
* Output task → clearly separated response area  

**Purpose:** The page should visually embody the action expected of the learner.

Affordances should reduce interpretation effort **without changing pedagogy**.

---

## P2 — Should ship (one slice minimum for closure)

| ID | Item | Description |
| -- | ---- | ----------- |
| P2-01 | **Revision support** | “Return to model”, “Jump to check”, activity summary strip for returning learners |
| P2-02 | **Visual hierarchy** | Section spacing, heading scale, materials stack scanability — without theme system |
| P2-03 | **Cognitive accessibility** | Landmarks (`main`, `nav`), skip link, focus order, heading level discipline |
| P2-04 | **Beat presentation quality** | Beat heading discipline; suppress redundant material headings; spacing rhythm inside `.util-beat-section` |

### P2 — Primary focus after structural milestone

Sprint 55 should prioritise **presentation quality** on the explicit Journey → Activity → Beat → Material structure:

* Typography (body, beat, activity, tables)  
* Line length and line height  
* Spacing rhythm between beats and materials  
* Visual hierarchy and clutter reduction  

**Guiding principle:** *Beat heading survives. Everything else must justify itself.*

The export is structurally correct but still visually noisy — simplify the presentation layer before adding more chrome.

---

## P3 — Could ship (defer unless low-cost)

| ID | Item | Notes |
| -- | ---- | ----- |
| P3-01 | **Typography refinement** | Font scale, line length, prose rhythm |
| P3-02 | **Theme exploration** | **Out of scope** unless user rescopes — document ideas only |
| P3-03 | **Visual polish** | Micro-interactions, icons — after P1/P2 |

---

## Explicitly deferred (from Sprint 54)

| Item | Reason |
| ---- | ------ |
| Live workshop facilitator mode | ED-54-07; D-54-09 |
| Design Page capacity / `material_bank` packaging | Compose sprint — not product UX |
| Workflow Next material-closure gate | Workflow plumbing sprint |
| Prompt redesign | Fidelity implementation track |

---

## Suggested implementation order (updated 2026-06-29)

```
[COMPLETE] Beat-first rendering + registry
  → P2-04 Beat presentation / hierarchy slice
  → P1-03 Progress (extends existing compass)
  → P1-02 TOC / anchors (include beat-level targets)
  → P1-01 Journey Navigator
  → P1-04 Output affordances
  → P2-01 / P2-03 (pick based on fresh-run audit)
```

## Recommended next slice

### P2-04 Beat presentation quality

**Reason:**

* Structural progression is now explicit — visual noise is the main learner-facing gap  
* Low risk to pedagogy — presentation-only changes inside existing beat sections  
* Directly implements “beat heading survives” design principle  
* Improves Marx / inflation exports without new architecture  

**Acceptance focus:**

A learner scanning an activity with episode plan sees a **clear beat ladder** with minimal redundant headings, icons, and wrapper chrome under each beat heading.

---

*Sprint 55 product backlog — 2026-06-29. Structural milestone update — 2026-06-29.*
