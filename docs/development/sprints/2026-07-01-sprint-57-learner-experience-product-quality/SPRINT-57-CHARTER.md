# Sprint 57 — Charter

**Sprint:** 57 — Learner Experience & Product Quality  
**Opened:** 2026-07-01  
**Predecessor:** [Sprint 56 closure](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/SPRINT-56-CLOSURE-REPORT.md)  
**Baseline:** [SPRINT-57-BASELINE-METRICS.md](SPRINT-57-BASELINE-METRICS.md)  
**Architecture state:** [SPRINT-57-ARCHITECTURE-STATE.md](SPRINT-57-ARCHITECTURE-STATE.md)

---

## Primary goal

Improve the **learner-facing product experience** of exported educational content — journey visibility, readability, cognitive load, navigation, presentation quality, and instructional clarity — **without** redesigning pedagogy, workflow architecture, or prompt orchestration.

---

## Mission statement

Sprint 56 established trustworthy generation orchestration (DLA specifies → GAM realises → Design Page assembles). Sprint 57 converts that foundation into a **fully realised educational product experience** for the learner who opens the exported page.

Success is measured by **learner-visible outcomes** on fresh exports, not by prompt character counts.

---

## Guiding principles

1. **Evidence before implementation** — observe on real exports; hypothesise; slice; validate.
2. **Product layer first** — HTML, CSS, export structure, navigation affordances.
3. **Architecture programme closed** — prompt changes only when evidence shows authority breach or learner defect traceable to generation; otherwise **evidence-triggered only**.
4. **Preserve Sprint 55 design principles** — beat-first structure, journey visibility, no pedagogy redesign by default.
5. **Capture/repair remains trusted** — do not weaken validation to make pages “pass.”

---

## In scope

| Area | Examples |
| ---- | -------- |
| **Learner experience** | Duplication reduction, over-scaffolding visibility, page flow, cognitive load |
| **Presentation** | Typography, hierarchy, spacing, table readability, visual rhythm |
| **Navigation** | Progression clarity, section guidance, transitions, anchors / TOC |
| **Quality** | Consistency across activities, instructional clarity, learner confidence signals |
| **Supporting code** | Renderer, export pipeline, minimal JSON→HTML improvements |
| **Evidence** | Fresh workflow runs; regression suites for Sprint 50/51/55 grammar |

---

## Out of scope

Unless explicitly rescoped by product owner:

- Workflow redesign or new workflow steps
- Knowledge model / episode plan architecture changes
- Prompt rationalisation programmes (DLA, GAM, Design Page)
- New prompt contracts or governance layers without supersession
- Copilot auto-repair / retrieval layers
- Full theme system development
- Live facilitator / workshop product mode
- Reopening Sprint 56 architecture audits without new evidence

---

## Success criteria (discovery-first)

| # | Criterion | Measure |
| - | --------- | ------- |
| 1 | Learner journey legible on fresh export | Qualitative review + defined heuristics |
| 2 | Presentation hierarchy improved vs Sprint 57 baseline | Before/after screenshots or audit rubric |
| 3 | No regression in materials fidelity | Existing closure / preservation tests green |
| 4 | No architecture drift | No unauthorised prompt authority moves |
| 5 | Documented slices | Each improvement has evidence + test or fixture |

Specific numeric targets emerge from discovery — not preset in this charter.

---

## Non-goals

- Prompt size reduction as primary objective
- Schema changes to `learning_activities` or page JSON without product justification
- Replacing capture-side repair with prompt-only fixes
- “Audit for audit’s sake” on GAM/Design Page/DLA

---

## Exit

Sprint 57 exits when prioritised learner-experience slices are implemented and validated on fresh exports, backlog is updated with deferred items, and closure report records outcomes against baseline metrics.

Architecture review programme remains **closed** unless exit review identifies evidence-triggered exception.
