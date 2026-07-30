# Sprint 70 Context (Compact)

**Status:** Closed (2026-07-30) — [SPRINT-70-CLOSURE.md](SPRINT-70-CLOSURE.md)  
**Successor:** [Sprint 71](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-START-HERE.md)

## Baseline

- Recovery code baseline commit: `6853376` (`Stabilise Sprint 69 renderer baseline`).
- Sprint 70 previous init commit: `2e44803`.
- Previous init reverted by `541285e`.
- Historical abandoned snapshot branch: `sprint-70-abandoned-debug-state` (`9aa0d5d`).

## Immutable constraints (still apply to renderer work)

- Do not destabilize recovered Sprint 69 renderer behavior.
- Preserve locked recovery fixture:
  - `tests/fixtures/page-render/hetero-dup-investigation-source.json`
- Fixture SHA-256:
  - `df7cc025ece109280c46e0422a9e3cb99e34c945929dba92b80987eb678e62f5`
- Tests depending on this fixture must verify hash before execution and fail clearly on mutation.
- Preserve DOM identity safety (`data-material-id` vs `data-material-source-id` separation).
- Do not weaken uniqueness or ambiguity validation.

## Existing architecture seams

- Page assembly: `lib/page-vnext-assemble.js`
- Page model build: `lib/learner-renderer-vnext/build-page-model.js`
- Sprint 38 affordance contract: `lib/sprint38-visual-affordances.js`
- Visual hook placement: `lib/learner-renderer-vnext/build-visual-affordance-placements.js`
- Visual hook rendering: `lib/learner-renderer-vnext/render-visual-affordance.js`
- Utilities preview export test boundary: `runUtilityPageExportPipelineForTest` in `app.js`

## Sprint 70 direction (charter — historical)

- Support activity-level and page-level visual planning.
- Add strong-default Knowledge Summary synthesis visual planning with explicit skip reasons.
- Implement in narrow slices; progressive enhancement mandatory.

## Closure outcome (programme)

Sprint 70 closed on the Resource Quality QA methodology track: Benchmark v2.1, Validation Review v2.0, production vs instructional separation, educational priority, stage attribution before prompt change. Active work continues in **Sprint 71** (evidence + attribution only).

## Current status

- **Sprint 70 Complete.**
- Formal closure: [SPRINT-70-CLOSURE.md](SPRINT-70-CLOSURE.md).
- Visual-planning slice log remains **partially unreconciled** (E1–E6 recorded complete; Slices 1–10 template rows not fully ledgered) — see closure gaps.
- Do not start new Sprint 70 implementation; use Sprint 71 pack for QA evidence work.
