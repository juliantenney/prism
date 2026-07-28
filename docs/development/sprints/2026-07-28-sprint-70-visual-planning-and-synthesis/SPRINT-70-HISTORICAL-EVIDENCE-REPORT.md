# Sprint 70 Historical Evidence Report

This report separates:

- verified repository evidence,
- inference from evidence,
- and new recommendations for the redesigned Sprint 70.

---

## A) Verified repository evidence

## Commit-level evidence

- `2e44803` created the first Sprint 70 documentation pack and described Visual Affordance Pipeline initialization.
- `541285e` reverted `2e44803`, deleting the Sprint 70 docs created in that commit.
- `6853376` established the post-recovery Sprint 69 stable baseline and documented renderer/DOM identity repairs.
- `9aa0d5d` exists on branch `sprint-70-abandoned-debug-state` as a WIP snapshot with substantial Sprint 70 code/docs/tests.

## File-level evidence from prior attempt (history/diff)

Previously added or modified Sprint 70-related surfaces included:

- docs under `docs/development/sprints/2026-07-27-sprint-70-visual-affordance-pipeline/*`
- top-level summary `docs/sprints/sprint-70-visual-affordance-pipeline.md`
- modules under `lib/visual-affordance-pipeline/*`
- renderer and integration touchpoints:
  - `lib/learner-renderer-vnext-browser.js`
  - `lib/learner-renderer-vnext/archetype-canonical-binding.js`
  - `lib/page-vnext-assemble.js`
  - `lib/sprint38-visual-affordances.js`
  - `app.js`, `index.html`, `style.css`
- tests such as:
  - `tests/visual-affordance-pipeline-*.test.js`
  - `tests/sprint-70-visual-affordance-*.test.js`
  - hook/export pipeline tests and assorted regression additions

## Baseline recovery evidence

From `6853376` and current tree:

- duplicate DOM material identity issue was fixed by separating wrapper/source marker from canonical material marker.
- hash-locked regression fixture introduced:
  - `tests/fixtures/page-render/hetero-dup-investigation-source.json`
- hash-locked regression tests introduced:
  - `tests/hetero-dup-material-dom-identity.test.js`
  - `tests/heteroscedasticity-attached-browser-pipeline-regression.test.js`

## Stable architecture evidence (current baseline)

- Page assembly seam: `lib/page-vnext-assemble.js`
- Page model seam: `lib/learner-renderer-vnext/build-page-model.js`
- Sprint 38 visual affordance contract and plan:
  - `lib/sprint38-visual-affordances.js`
  - `lib/learner-renderer-vnext/sprint38-visual-affordance-plan.js`
- Hook placement and hook renderer:
  - `lib/learner-renderer-vnext/build-visual-affordance-placements.js`
  - `lib/learner-renderer-vnext/render-visual-affordance.js`
- Utilities preview test boundary present in `app.js`:
  - `runUtilityPageExportPipelineForTest`

---

## B) Inference from verified evidence

- The previous Sprint 70 attempt was broad and cross-cutting (docs + pipeline modules + UI + tests), increasing rollback risk.
- The prior effort focused heavily on activity-level affordance job orchestration and package export.
- Knowledge Summary page-level synthesis visual planning was not clearly established as a first-class default in historical artifacts.
- Recovery uncovered architectural sensitivity around identity semantics and browser/runtime parity; Sprint 70 must treat these as core constraints, not edge cases.

---

## C) New recommendations carried forward

## What to retain from prior attempt

- Deterministic job generation mindset.
- Strong testing orientation around affordance pipeline and package boundaries.
- Separation of planning, job building, prompt building, manifesting, and packaging modules.

## What not to resurrect without redesign

- Any legacy assumptions that only activity-level visuals matter.
- Any path that conflates planning/evidence identities with DOM identity.
- Any broad renderer changes bundled with pipeline/UI work in a single slice.
- Any implementation that cannot prove graceful learner-page fallback.

## Unsafe assumptions now identified

- "If semantics are correct, DOM identity is automatically correct." (false)
- "Visual planning can be treated as purely activity-scoped." (insufficient)
- "One large Sprint 70 integration commit is manageable." (high risk)

## Outstanding unknowns requiring explicit design decisions

- Page-level visual planning storage location and schema.
- Job persistence boundary (run-state vs workflow-state vs separate session).
- Export policy for missing high-priority synthesis visual assets.
- Placement strategy for Knowledge Summary visual in both browser and exported HTML.

---

## D) Recommendation summary for Sprint 70 redesign

- Rebuild Sprint 70 as slice-based delivery from recovered baseline.
- Prioritize contract clarity and deterministic identity before UI and export.
- Treat Knowledge Summary synthesis as strong-default planning behavior with explicit skip rationale.
- Preserve current renderer ownership and fail-closed validation behavior unless a slice explicitly requires otherwise.
