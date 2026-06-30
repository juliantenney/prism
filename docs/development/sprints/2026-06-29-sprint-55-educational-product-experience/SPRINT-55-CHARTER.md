# Sprint 55 — Charter

**Sprint:** 55 — Educational Product Experience  
**Opened:** 2026-06-29  
**Predecessor:** Sprint 54 (closed)

---

## Objective

Transform the exported learner page from a **well-designed educational document** into a **fully realised educational product experience** — improving journey visibility, navigation, progress, orientation, affordances, cognitive accessibility, visual hierarchy, and revision support.

---

## In scope

* Product-layer improvements to exported learner HTML (and minimal supporting renderer/export code)  
* Learning Journey Navigator, TOC/anchors, progress visibility, output affordances (P1)  
* Revision support, visual hierarchy, cognitive accessibility (P2)  
* Typography refinement where it serves hierarchy (P3)  
* Evidence-led slices validated on **fresh** workflow exports  
* Regression anchors from Sprint 50/51 instructional grammar suites  

---

## Out of scope

Unless explicitly required by user rescope:

* Workflow redesign  
* Knowledge model redesign  
* Pedagogic redesign  
* Learning architecture redesign  
* Theme system development  
* Live workshop / facilitator product mode  
* Prompt contract redesign  
* Copilot retrieval / auto-repair layers  
* Reopening Sprint 54 closed questions (see closure report)  

---

## P1 Definition of Done

A first-time learner can:

* See the overall learning journey  
* Identify their current position  
* Navigate directly to major sections  
* Understand the next required action  
* Understand expected outputs  

…without needing to scroll-search or infer structure from prose.

This definition acts as the **evaluation lens** for all P1 implementation decisions.

---

## Success criteria

| # | Criterion | Measure |
| - | --------- | ------- |
| 1 | **Learning Journey Navigator** shipped for learner exports | Visible activity list with current position; keyboard reachable |
| 2 | **TOC + anchor navigation** | Page-level and activity-level jump targets; deep links work in export |
| 3 | **Progress visibility** | Resource-level and per-activity progress discernible without reading full prose |
| 4 | **Output affordances** | Print-friendly export; clear “what to do next” cues |
| 5 | **P2 slice** (one of): revision support **or** hierarchy **or** cognitive accessibility landmark set | Documented + tested |
| 6 | **No regression** | Sprint 50/51 grammar + material preservation tests green |
| 7 | **Fresh-run validation** | At least one Marx or inflation export walked as learner on current codebase |

---

## Exit

Sprint 55 closes when criteria 1–7 are met and a closure report is written.

---

*Sprint 55 charter — 2026-06-29.*
