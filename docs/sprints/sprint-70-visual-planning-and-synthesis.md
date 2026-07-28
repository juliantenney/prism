# Sprint 70 — Visual Planning and Synthesis

**Status:** Planned (documentation pack prepared; implementation not started)  
**Opened:** 2026-07-28  
**Type:** Visual-planning architecture and progressive enhancement pipeline  
**Detailed pack:** [docs/development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/](../development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/)  
**Baseline:** `6853376` (`Stabilise Sprint 69 renderer baseline`)

---

## Objective

Design Sprint 70 so Prism can plan and integrate pedagogically useful visuals deterministically, without destabilizing the recovered Sprint 69 learner renderer baseline.

## Architectural direction

- keep renderer ownership and composition safety constraints intact;
- separate planning identity, job identity, asset identity, placement identity, and DOM identity;
- support both activity-level visual planning and page-level synthesis planning;
- enforce evidence-grounded prompts and no invented claims;
- preserve complete learner-page usability when visual generation/storage/rendering fails.

## Knowledge Summary synthesis requirement

Sprint 70 treats a Knowledge Summary synthesis visual as a **strong default**:

- plan one high-priority page-level synthesis visual when content supports it;
- skip only with explicit, defensible reason categories.

## Delivery strategy

Implementation is intentionally slice-based:

1. contract baseline
2. deterministic job extraction
3. Knowledge Summary synthesis planning
4. activity-level reconciliation
5. deterministic prompt construction
6. asset persistence
7. placement integration
8. fallback hardening
9. browser Utilities integration
10. end-to-end certification

## Non-goals

- no external image-generation API integration in initial sprint slices;
- no forced visual for every activity;
- no unconditional Knowledge Summary visual;
- no broad beat/composition ownership changes.

## Principal risks

- identity conflation across source/job/asset/placement/DOM layers;
- browser/Node pipeline divergence;
- silent prompt invention or unsupported claims;
- renderer regressions from over-broad changes.

## Current status

- detailed Sprint 70 redesign pack prepared in `docs/development/sprints/2026-07-28-sprint-70-visual-planning-and-synthesis/`;
- awaiting review approval before Slice 1 implementation begins.
