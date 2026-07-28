# Sprint 70 Test and Regression Plan

## Principles

- Deterministic outputs over heuristic acceptance.
- Evidence-grounded visual planning only.
- Progressive enhancement: learner page must remain usable without visual assets.
- Baseline safety: recovered Sprint 69 behavior must stay stable.
- Accessibility is mandatory, not optional.

## Fixture policy

- Preserve recovered locked fixture unchanged:  
  `tests/fixtures/page-render/hetero-dup-investigation-source.json`
- SHA-256 (must match exactly):  
  `df7cc025ece109280c46e0422a9e3cb99e34c945929dba92b80987eb678e62f5`
- Tests relying on this fixture must verify hash before execution and fail clearly on mismatch/mutation.
- Preserve its regression lock tests:
  - `tests/hetero-dup-material-dom-identity.test.js`
  - `tests/heteroscedasticity-attached-browser-pipeline-regression.test.js`
- Sprint 70 tests must not rewrite this fixture to pass.
- Add Sprint 70-specific fixtures separately; never replace this recovery fixture.

## Test categories

## 1) Contract/schema tests

- Activity-level visual planning contract validation.
- Page-level synthesis planning contract validation.
- Skip-reason taxonomy validation.
- Version mismatch and unknown field policy tests.

## 2) Deterministic-output tests

- Same input payload yields same job list.
- Same input yields same prompt text and same selected visual form taxonomy entry.
- Stable sort order in manifests and job arrays.
- Stable ID generation across repeated runs.
- Stable deterministic package filenames/paths.

## 3) Evidence-grounding tests

- Prompt construction rejects unsupported claims.
- Prompt includes only source-backed relationships.
- No invented entities/facts in generated prompt sections.
- Negative tests for thin/unsuitable Knowledge Summary.
- `evidence_anchor_id` always references supplied learning content and is never used as DOM identity.

## 4) Accessibility tests

- Alt text is present, meaningful, and source-grounded.
- Caption is required when additional explanation is needed.
- No essential learning information exists only inside visual content.
- Visual meaning is not color-only.
- Generated visuals avoid dense paragraph text.
- Placement omission leaves complete readable prose path.

## 5) Knowledge Summary synthesis tests

- Eligible Knowledge Summary produces one high-priority synthesis plan by default.
- Skip paths require explicit reason.
- Page-level planning survives assembly/preview path.
- Recommended placement behavior is after complete summary prose and outside paragraph splits.

## 6) Renderer and DOM identity tests

- No duplicate `data-material-id` regression.
- `planning_id`/`evidence_anchor_id`/`job_id`/`asset_id`/`placement_key` are not reused as DOM identity.
- No duplicate visual placement for same placement key.
- Activity and page-level visuals do not collide in DOM identities.

## 7) Browser-pipeline tests

- Utilities preview path renders with no visuals, partial visuals, and complete visuals.
- Visual planning unavailable/failing does not break page rendering.
- Browser path and Node path parity for placement and manifest summaries.
- Alt text and caption output are visible to assistive-technology paths.
- Color-only meaning and low-contrast rendering are rejected by test heuristics/checklist.

## 8) Persistence tests

- Asset attach/replace/remove survives state transitions.
- Reassembly merge does not orphan valid assets.
- Orphan and stale asset handling is explicit and non-destructive.
- Asset metadata persists (`asset_id`, digest, mime, alt text, caption, provenance fields).

## 9) Failure-mode tests

- Missing asset: page still renders text content completely.
- Invalid asset type/size/path: rejected with clear diagnostics.
- Missing planning contract: fallback behavior remains safe.
- Partial package export policy (warn/block) tested and documented.

## 10) End-to-end acceptance scenarios

- Activity-only visual planning page.
- Knowledge Summary synthesis-only page.
- Mixed page with activity + Knowledge Summary visual plans.
- Zero visual jobs (all `defer`/`skip`/`none`) page.

## Regression suites and commands

### Current baseline gates (mandatory now; verified existing)

- `npm run pretest:learner-renderer-vnext`
- `node --test tests/hetero-dup-material-dom-identity.test.js`
- `node --test tests/utility-utilities-page-export-pipeline.test.js`
- `node --test tests/utility-visual-affordance-hooks.test.js`
- `node --test tests/sprint-38-visual-affordances.test.js`
- `node --test tests/learner-renderer-vnext-visual-affordances.test.js`

### Known broad-suite caveat

`node --test "tests/learner-renderer-vnext*.test.js"` runs on Windows/PowerShell but currently reports unrelated pre-existing failures in this working tree. Treat as optional broad audit, not per-slice blocker, until separately stabilized.

### Planned Sprint 70 suites (exist, but run when corresponding slice code exists)

- `node --test tests/visual-affordance-pipeline-jobs.test.js`
- `node --test tests/visual-affordance-pipeline-prompt.test.js`
- `node --test tests/visual-affordance-pipeline-package.test.js`
- `node --test tests/visual-affordance-pipeline-workspace.test.js`
- `node --test tests/sprint-70-visual-affordance-certification.test.js`
- `node --test tests/sprint-70-visual-affordance-restoration.test.js`

Note: avoid wildcard-only invocations like `tests/visual-affordance-pipeline-*.test.js` in PowerShell documentation because wildcard handling can silently run zero tests.

## Browser verification checklist (manual)

- App loads and Utilities opens.
- Preview renders full learner page with no visual assets.
- Knowledge Summary text still visible when synthesis visual absent.
- Asset attach/remove updates expected visual count/status.
- No duplicate visual DOM identities.
- No beat ambiguity or fallback activity render regression.
- Alt text is present and meaningful for each rendered visual.
- Captions are shown when explanation beyond alt text is needed.
- Essential learning path remains complete when visuals are omitted.
- Color is never the only encoding of a key distinction.

## Exit criteria for Sprint 70 certification

- All slice gates pass.
- Core renderer regression suite remains green.
- Locked heteroscedasticity fixture tests remain green with hash verification.
- Browser smoke checklist passes with documented evidence.
- Residual risks are documented; no hidden blocker remains.
