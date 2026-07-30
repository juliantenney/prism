# Sprint 70 Handover (Recovery Baseline)

**Status:** Closed (2026-07-30) — [SPRINT-70-CLOSURE.md](SPRINT-70-CLOSURE.md)  
**Successor (active):** [Sprint 71 — START HERE](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-START-HERE.md)

This document is the **historical** recovery-baseline handover for the visual-planning charter. For programme close outcomes, decisions, and Sprint 71 carry-over, use [SPRINT-70-CLOSURE.md](SPRINT-70-CLOSURE.md). Do not treat this file as an instruction to reopen Sprint 70 implementation.

---

## Baseline and intent

This Sprint 70 pack starts from the recovered stable baseline lineage:

- baseline commit: `6853376` (`Stabilise Sprint 69 renderer baseline`)
- recovery code baseline commit placeholder: `6853376`
- Sprint 70 documentation-pack commit placeholder: `pending`
- current slice commit placeholder: `none`
- predecessor boundary: `541285e` (revert of previous Sprint 70 start)
- prior Sprint 70 initialisation: `2e44803`
- abandoned debug snapshot branch observed: `sprint-70-abandoned-debug-state` (`9aa0d5d`)

Sprint 70 is **redesigned**, not resumed blindly. Historical Sprint 70 work is treated as evidence, not authority.

## Why Sprint 70 is being recreated

- The previous Sprint 70 startup and partial implementation were rolled back and superseded by recovery work.
- Recovery exposed critical renderer and identity lessons:
  - duplicate DOM identity can exist without beat ambiguity;
  - planning/evidence identities and rendered DOM identities must be explicit and separate;
  - deterministic hash-locked regression fixtures are essential for reliable diagnosis.
- The stable baseline now includes explicit safeguards that Sprint 70 must preserve.

## Current trusted technical state

- Learner renderer baseline is stable and deterministic (`6853376`).
- Table workspace identity repair is in place:
  - canonical material identity remains `data-material-id` on material article;
  - workspace wrapper uses `data-material-source-id`.
- Heteroscedasticity regression fixture is hash-locked and used in renderer checks:
  - `tests/fixtures/page-render/hetero-dup-investigation-source.json`
  - SHA-256: `df7cc025ece109280c46e0422a9e3cb99e34c945929dba92b80987eb678e62f5`
  - `tests/hetero-dup-material-dom-identity.test.js`
- Utilities preview pipeline test boundary is available:
  - `runUtilityPageExportPipelineForTest` in `app.js`.

## Sprint 70 goal (revised)

Introduce a deterministic visual planning and visual package pipeline that:

- plans visuals only when pedagogically justified;
- supports both activity-level and page-level synthesis visuals;
- includes a strong default Knowledge Summary synthesis visual (with explicit skip reasons);
- preserves complete learner-page usability when visual generation/rendering/storage fails.

## Non-goals (for this sprint plan)

- No external image-generation API integration.
- No forced visuals for every activity.
- No requirement that Knowledge Summary visual always exists.
- No changes to beat ownership or composition ownership as part of initial slices.
- No weakening of uniqueness/validation invariants.

## Architecture summary (starting point)

Existing stable seams to preserve:

- page assembly: `lib/page-vnext-assemble.js`
- page model build: `lib/learner-renderer-vnext/build-page-model.js`
- Sprint 38 affordance logic: `lib/sprint38-visual-affordances.js`
- hook placement: `lib/learner-renderer-vnext/build-visual-affordance-placements.js`
- hook rendering: `lib/learner-renderer-vnext/render-visual-affordance.js`
- utilities preview path and run-state persistence: `app.js`

Historical Sprint 70 modules (evidence only, not yet adopted) exist in branch history under:

- `lib/visual-affordance-pipeline/*`
- associated tests `tests/visual-affordance-pipeline-*.test.js` (historical)

## Key risks

- Identity conflation: `planning_id` vs `evidence_anchor_id` vs `job_id` vs `asset_id` vs `placement_key` vs DOM identity.
- Renderer destabilisation from broad cross-cutting changes.
- Browser and Node pipeline divergence.
- Underspecified page-level visual contract (especially Knowledge Summary synthesis placement).
- Silent prompt drift introducing unsupported or invented visual claims.

## Delivery strategy

Delivery must be in narrow, reversible slices with independent acceptance gates and clean commits.

Reference implementation plan:

- `SPRINT-70-IMPLEMENTATION-PLAN.md`

Each slice must:

- touch minimum surface area;
- include dedicated tests;
- run targeted renderer regressions before merge;
- preserve locked heteroscedasticity regression fixture unchanged.

## Verification discipline

- Always run hash-locked fixture checks before Sprint 70 behavior tests touching learner rendering.
- Any test that relies on the locked fixture must verify hash before execution and fail clearly on mutation.
- Keep a stable smoke path through Utilities preview.
- Prefer deterministic fakes over live generation for most Sprint 70 tests.
- No slice proceeds until prior slice regression gate is green.

## First recommended task (after review)

~~Start Slice 1 only after explicit review approval~~ — **superseded.** Sprint 70 is closed. Continue in [Sprint 71](../2026-07-30-sprint-71-learner-facing-pipeline-quality-evidence-and-prompt-attribution/SPRINT-71-START-HERE.md).

## Hard constraints

- Sprint 70 is **closed** — do not reopen implementation under this pack.
- Do not alter locked heteroscedasticity fixture to satisfy tests without explicit review.
- Do not change beat/composition ownership unless a dedicated engineering decision requires it and regression evidence supports it.
- Learner-facing QA evidence work belongs in **Sprint 71**, not here.
