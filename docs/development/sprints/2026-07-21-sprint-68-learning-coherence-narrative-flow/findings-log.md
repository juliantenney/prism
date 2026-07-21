# Sprint 68 — Findings Log

Settled findings only. Active investigation notes live in [investigation-log.md](investigation-log.md).

| ID | Date | Finding | Severity | Status |
| -- | ---- | ------- | -------- | ------ |
| S68-F01 | 2026-07-21 | Sprint 67 renderer is functionally complete; Sprint 68 focuses on learner experience not fidelity | High | **Settled inheritance** |
| S68-F02 | 2026-07-21 | Heteroscedasticity fixture contains one `intellectual_coherence_bridge` on Activity A5; rendered inside A5 orientation beat, not between activities | Medium | **Under investigation (S68-BL-001)** |
| S68-F03 | 2026-07-21 | Each activity A1–A5 has an `activity_preamble` in fixture JSON; these render at activity start via `render-activity.js` | Info | **Confirmed** — may partially substitute for bridges |
| S68-F04 | 2026-07-21 | `intellectual_coherence_bridge` is a beat prompt field in archetype rules, not a page-level inter-activity slot | Medium | **Under investigation** |

## Inherited from Sprint 67 (do not reopen without cause)

| ID | Note |
| -- | ---- |
| S67-F03 | Duplicate orientation markdown headings — accepted for rollout |
| S67-F05 | Page-level `learning_outcomes[]` not surfaced as dedicated region — deferred |
