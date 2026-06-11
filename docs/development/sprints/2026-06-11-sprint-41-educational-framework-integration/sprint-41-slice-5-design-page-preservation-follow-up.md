# Sprint 41 Slice 5 Follow-up — Preserve Learner Framing Through Design Page

## Purpose

Close the gap between DLA-emitted learner framing and final Design Page JSON for workshop learner handouts/pages. Slice 5 widened prompt scaffolds; this follow-up adds **runtime composition repair** so framing fields and full activity membership survive LLM compose variance.

## Root cause

Two independent failures in the Design Page compose path:

### Issue 1 — Framing fields dropped

| Layer | Behaviour |
| ----- | --------- |
| **Prompt** | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` already instructs field preservation, but the model may still emit only procedural fields (`instructions`, `learner_task`) |
| **Runtime merge (pre-fix)** | `mergeSelfDirectedActivityFramingFieldsIntoPageActivities` filled missing fields from upstream **only when the activity row already existed** on the page — it did not create missing rows |
| **Field list gap** | `SELF_DIRECTED_ACTIVITY_FRAMING_FIELD_IDS` omitted `support_note`, `support_notes`, and `expected_output` |

DLA correctly placed `activity_preamble` on `learning_activities` rows; Design Page compose copied task prose but dropped orientation fields before the renderer ever saw them.

### Issue 2 — Activities omitted for output size

Design Page LLM responses recorded `generation_notes.activities_omitted[]` with `authority: output_size` / reason `output size constraint`, leaving only LO1–LO2 in `learning_activities.content[]`. The compose contract treats membership as hard, but there was **no runtime enforcement** — only validation warnings.

## Implementation summary

### `app.js`

- Added `LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS` (extends framing list with `support_note`, `support_notes`, `expected_output`)
- Added learner-page composition repair pipeline:
  - `stripUnauthorizedOutputSizeActivityOmissions` — removes output-size/token-limit omissions; records a `generation_notes.limitations` line
  - `restoreMissingLearnerPageActivitiesFromUpstream` — inserts activity shells from upstream `learning_activities` when absent from composed page and not explicitly authorised omitted
  - `mergeLearnerPageActivityFramingFieldsIntoPageActivities` — copies framing fields from upstream `learning_activities` onto matching composed rows
  - `repairLearnerPageCompositionFromUpstream` — orchestrates the above for `page_profile: learner` only
- `applyPedagogicCognitionSemanticsToComposedPage` now calls repair **before** cognition merge/sanitization
- Facilitator pages (`page_profile: facilitator`) are **not** repaired (acceptance criterion 6)

### `lib/ld-design-page-compose-contract.js`

- `MEMBERSHIP_LINES`: explicitly forbids omission for output size / token limit; instructs retaining activity shells and recording limitations instead
- `FIELD_PRESERVATION_LINES`: clarifies source is upstream `learning_activities`, not only `activity_materials`

## Tests added/updated

| File | Change |
| ---- | ------ |
| `tests/workflow-learner-page-design-page-preservation.test.js` | **New** — preamble, `reasoning_orientation`, activity restoration, output-size omission strip, facilitator non-repair, end-to-end via `applyPedagogicCognitionSemanticsToComposedPage` |
| `tests/ld-design-page-compose-contract.test.js` | Asserts new membership and field-source prompt lines |

Existing renderer coverage unchanged: `tests/utility-learner-workshop-material-visibility.test.js` already confirms framing HTML when fields are present.

## Before vs after behaviour

### Workshop learner page (LO1 with DLA `activity_preamble`)

| Aspect | Before | After |
| ------ | ------ | ----- |
| `activity_preamble` in page JSON | Dropped (only `instructions` retained) | Restored from upstream `learning_activities` |
| Cognition fields (`reasoning_orientation`, etc.) | Dropped when absent on composed row | Merged from upstream when present |
| LO3–LO5 with `activities_omitted` / output size | Omitted from `content[]` | Shells restored; unauthorized omissions stripped |
| Facilitator guide / slide deck page | Unchanged | Unchanged (repair skipped) |

### Self-study learner pages

Repair uses the same upstream merge path; existing `workflow-self-directed-activity-framing-adoption` tests continue to pass.

## Acceptance criteria

| # | Criterion | Status |
| - | --------- | ------ |
| 1 | Workshop learner page preserves `activity_preamble` | Met (runtime repair + tests) |
| 2 | Other learner-framing fields preserved when present | Met |
| 3 | Renderer shows framing when fields present | Met (pre-existing; no renderer change) |
| 4 | Design Page no longer omits activities solely for output size | Met (prompt + runtime strip/restore) |
| 5 | Regression tests added | Met |
| 6 | No facilitator-only output changes | Met |
| 7 | No schema redesign | Met |
| 8 | No Sprint 42 authoring work | Met |

## Remaining limitations

1. **LLM compose variance** — Repair runs after Design Page generation; if the model paraphrases rather than omits framing fields, repair does not overwrite existing composed values (fill-missing-only semantics).
2. **Authorised omission** — User-requested subset omission still requires explicit `activities_omitted` with non-output-size authority; repair respects traced omissions that are not output-size/token-limit.
3. **Material body fidelity** — When output pressure forces shorter wrapper prose, `generation_notes.limitations` may record the repair; full GAM/material embed fidelity remains governed by separate L4 contracts.
4. **Facilitator pages** — No framing restoration on `page_profile: facilitator` by design.

## Files changed

- `app.js`
- `lib/ld-design-page-compose-contract.js`
- `tests/workflow-learner-page-design-page-preservation.test.js` (new)
- `tests/ld-design-page-compose-contract.test.js`
