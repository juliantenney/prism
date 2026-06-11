# Sprint 41 Slice 5 Finalisation — Mandatory Learner Framing for Learner Pages

## Purpose

Complete Sprint 40/41 integration by making learner-framing scaffolds **mandatory at DLA** for all learner-facing pages (workshop handouts and self-study), not optional enrichments. Preservation (Slice 5 follow-up) and renderer behaviour were already correct when fields were present; this slice ensures DLA emits them consistently.

## Root cause

Learner-page DLA prompts treated `activity_preamble` and cognition-orientation fields as **coverage targets** (“at least half of activities”, “use selectively”) rather than per-activity requirements. Workshop and self-study workflows could therefore emit procedural-only activity rows (`title`, `learner_task`, `expected_output`, `required_materials`) with nothing for Design Page preservation to carry forward.

## Implementation summary

### `app.js`

**Prompt contract (DLA)**

- `buildSelfDirectedLearnerPageActivityFramingPromptBlock` — mandatory per activity: `activity_preamble` + at least one cognition field; removed “selective / half coverage” language.
- `buildLearnerPageActivityFramingArchetypePromptBlock` — **new** archetype guidance (understanding, application, analysis, evaluation, synthesis).
- `buildLearnerPageDlaOutputContractOverrideBlock` — explicit MUST for preamble and cognition field on every activity; forbids procedural-only rows.
- `augmentSelfDirectedDlaDraftOutputSection` — output pointer updated to require cognition field, not “may include”.

**Validation**

- `LEARNER_PAGE_MANDATORY_COGNITION_FIELD_IDS` — reasoning_orientation, self_explanation_prompt, conceptual_contrast_prompt, uncertainty_tension_prompt, argument_structure_hint, transfer_or_application_task.
- `evaluateLearnerPageDlaActivityFramingCoverage` — per-activity checks; `meetsMandatoryFraming` when every row has preamble + cognition.
- `applyLearnerPageDlaFramingValidationToCapture` — run-mode capture gate for learner-page DLA steps; surfaces `workflowRunLearnerPageFramingValidation` on step status.

**Unchanged**

- Facilitator-only outputs (`page_profile: facilitator`, facilitator guide / slide deck briefs) — no mandatory framing scaffold.
- Renderer, GAM, schema — no changes.

## Tests added/updated

| File | Change |
| ---- | ------ |
| `tests/workflow-learner-page-mandatory-framing.test.js` | **New** — prompt mandates, evaluation, capture validation, facilitator exclusion |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | Updated coverage expectations and prompt assertions |

## Before vs after

| Aspect | Before | After |
| ------ | ------ | ----- |
| DLA framing | Optional / partial coverage | **Every** learner-page activity: `activity_preamble` + ≥1 cognition field |
| Workshop learner handout | Inconsistent DLA emit | Same minimum as self-study |
| Capture validation | None for framing | Fails step when procedural-only DLA pasted |
| Facilitator guide / deck | Unchanged | Unchanged |

## Acceptance criteria

| # | Criterion | Status |
| - | --------- | ------ |
| 1 | Learner-page DLA always requires `activity_preamble` | Met (prompt + validation) |
| 2 | Learner-page DLA requires ≥1 cognition field per activity | Met |
| 3 | Workshop = self-study minimum guarantees | Met |
| 4 | Facilitator-only unaffected | Met |
| 5 | No renderer / schema / GAM / Sprint 42 work | Met |

## Remaining limitations

1. **Prompt compliance** — Validation flags missing framing on capture; it does not auto-generate fields (generation remains model-dependent).
2. **Archetype matching** — Archetype lines guide field choice; validation checks minimum presence, not archetype-specific field combinations.
3. **Page-level fields** — `study_orientation`, `intellectual_frame`, etc. remain page-level additive rules in OUTPUT CONTRACT.

## Files changed

- `app.js`
- `tests/workflow-learner-page-mandatory-framing.test.js` (new)
- `tests/workflow-self-directed-activity-framing-adoption.test.js`
- `docs/.../sprint-41-slice-5-mandatory-learner-framing.md`
