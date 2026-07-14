# Enzymes Archetype MVP Fixtures

Narrowly scoped `required_materials` planning fixtures for the Sprint 59 Instructional Archetype Framework transfer test (Enzymes and Reaction Rates).

These are **DLA planning payloads**, not learner-facing bodies and not a full workflow export.

| File | Archetype |
| ---- | --------- |
| `mechanism-explanation.required-material.json` | `mechanism_explanation` |
| `process-walkthrough.required-material.json` | `process_walkthrough` |
| `mental-model-building.required-material.json` | `mental_model_building` |

## How to use for transfer test

1. On a DLA capture (partial or enriched), attach the relevant object into an activity’s `required_materials[]` (or paste fields onto an existing row while keeping `material_id` / `material_type`).
2. Ensure DLA capture validation passes (`instructional_archetype` + complete `archetype_plan`).
3. Copy/generate the GAM prompt — PRISM appends only the selected compact rule(s) plus planning JSON for materials present in the DLA capture.
4. Inspect GAM bodies for intervening-process / stage / relationship teaching without rubric labels.

**Note:** No complete enzymes workflow artefact is archived in-repo from the prior investigation; these fixtures supply the planning half needed for a clean re-run.
