# Sprint 67 — Charter

**Sprint:** 67 — Learner Renderer vNext  
**Status:** Chartered  
**Opened:** 2026-07-17  
**Type:** Isolated learner-page renderer rewrite  
**Canonical pointer:** [docs/sprints/sprint-67-learner-renderer-vnext.md](../../../sprints/sprint-67-learner-renderer-vnext.md)  
**Predecessor:** [Sprint 66 closure](../2026-07-16-sprint-66-grounded-renderer-learner-experience/SPRINT-66-CLOSURE.md)

---

## Background

Sprint 66 investigated the learner beat renderer against authored PRISM JSON and found a dual-planner, heuristic assignment path that emitted empty beats, mislabelled roles, and relied on post-render insertion. Extending that path was rejected. An isolated **learner-renderer-vNext** model layer was completed; HTML rendering was deferred to this sprint.

---

## Primary goal

Ship a feature-flagged, deterministic learner-page renderer that:

1. builds one validated canonical page model;  
2. renders HTML only from that model;  
3. coexists with legacy (default remains legacy until rollout criteria pass);  
4. proves the heteroscedasticity golden fixture invariants.

---

## In scope

* `render-page.js`, `render-activity.js`, `render-beat.js`, `render-material.js`
* Checklist / expected-output / markdown material rendering from model fields
* Reuse of existing utility CSS classes (no flex-order / hide-incorrect-section hacks)
* `renderLearnerPage(json, { rendererVersion: "legacy" | "vnext" })` (or equivalent) entry point
* Golden fixture + structural + architecture exclusion tests
* Human review of rendered HTML against the primary fixture
* Documentation of parity gaps vs legacy

## Out of scope

* Extending `lib/ld-beat-assignment-compose.js` as production architecture
* Retiring / deleting the legacy renderer (Sprint 68 draft)
* Schema / GAM / Design Page pipeline redesign
* Inventing instructional content absent from the JSON
* Broad multi-lesson visual redesign beyond class reuse

---

## Success criteria

1. vNext HTML path produces coherent beats for the heteroscedasticity fixture.  
2. No empty `.util-beat-section`.  
3. Every material ID, numbered learner-task step, expected output, and checklist appears exactly once.  
4. Critical orders hold (A2-M3 before A2-M2; A5-M8 before A5-M7).  
5. Associations match the agreed label/material matrix.  
6. Architecture tests continue to forbid legacy planner tokens in vNext.  
7. Default render remains legacy until explicit rollout approval.  
8. Definition of done checklist signed in [definition-of-done.md](definition-of-done.md).

---

## First task

**S67-BL-001** — Confirm model freeze; implement logic-free HTML renderers.
