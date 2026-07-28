# Sprint 70 Context (Compact)

## Baseline

- Recovery code baseline commit: `6853376` (`Stabilise Sprint 69 renderer baseline`).
- Sprint 70 documentation-pack commit: `pending`
- Current slice commit: `none`
- Sprint 70 previous init commit: `2e44803`.
- Previous init reverted by `541285e`.
- Historical abandoned snapshot branch: `sprint-70-abandoned-debug-state` (`9aa0d5d`).

## Immutable constraints

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

## Sprint 70 direction

- Support activity-level and page-level visual planning.
- Add strong-default Knowledge Summary synthesis visual planning with explicit skip reasons.
- Use recommended initial Knowledge Summary placement after full summary prose.
- Implement in narrow slices.
- Progressive enhancement is mandatory.

## Known risk clusters

- Identity conflation (`planning_id` / `evidence_anchor_id` / `job_id` / `asset_id` / `placement_key` / DOM identity).
- Browser/Node divergence.
- Hidden prompt invention.
- Renderer regression from broad coupling.

## Required artifacts

- Handover, design spec, implementation plan, test plan, decisions, checklist, historical evidence report, slice log.

## Current status

- Documentation pack recreated.
- Sprint 70 production implementation intentionally not started.
