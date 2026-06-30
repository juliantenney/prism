# Sprint 55 — Product Backlog

**Source:** [Sprint 54 closure — Product experience findings](../2026-06-29-sprint-54-pedagogic-fidelity-audit/SPRINT-54-CLOSURE-REPORT.md#product-experience-findings)  
**Principles:** [SPRINT-55-DESIGN-PRINCIPLES.md](./SPRINT-55-DESIGN-PRINCIPLES.md)

---

## P1 — Must ship (Sprint 55 core)

| ID | Item | Description | Acceptance sketch |
| -- | ---- | ----------- | ----------------- |
| P1-01 | **Learning Journey Navigator** | Persistent or top-level control listing activities in sequence with current position | Jump to activity; shows LO/activity title; works on mobile width |
| P1-02 | **TOC + anchor navigation** | Page TOC + per-activity anchors for major sections (Orient, Study, Do, Check, …) | Click/jump lands correct section; URL hash or export-stable ids |
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

## Suggested implementation order

```
P1-03 Progress (extends existing compass)
  → P1-02 TOC / anchors
  → P1-01 Journey Navigator
  → P1-04 Output affordances
  → P2 (pick one based on fresh-run audit)
```

## Recommended First Slice

### P1-03 Progress Visibility

**Reason:**

* Extends the existing activity compass rather than creating a new system  
* Lowest architectural risk  
* Creates foundations for Learning Journey Navigator  
* Directly addresses orientation findings from Sprint 54  
* Provides visible learner value quickly  

**Acceptance focus:**

A learner should be able to identify their position within the resource and activity sequence without scroll-searching.

---

*Sprint 55 product backlog — 2026-06-29.*
