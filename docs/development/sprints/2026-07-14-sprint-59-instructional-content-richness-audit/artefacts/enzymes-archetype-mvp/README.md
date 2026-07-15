# Enzymes Archetype MVP Fixtures

Narrowly scoped `required_materials` planning fixtures for the Sprint 59 Instructional Archetype Framework transfer test (Enzymes and Reaction Rates).

These are **DLA planning payloads**, not learner-facing bodies and not a full workflow export.

**Updated:** 2026-07-15

| File | Archetype | Transfer status |
| ---- | --------- | --------------- |
| `mechanism-explanation.required-material.json` | `mechanism_explanation` | **PASS** |
| `process-walkthrough.required-material.json` | `process_walkthrough` | **PASS** (rule text frozen as `20260715-4`) |
| `mental-model-building.required-material.json` | `mental_model_building` | **PASS** — thermostat MVP |

Handoffs: [MANUAL-MECHANISM-TEST.md](MANUAL-MECHANISM-TEST.md) · [MANUAL-PROCESS-TEST.md](MANUAL-PROCESS-TEST.md) · [MANUAL-MENTAL-MODEL-TEST.md](MANUAL-MENTAL-MODEL-TEST.md)

## How to use for transfer test

1. On a DLA capture (partial or enriched), attach the relevant object into an activity’s `required_materials[]` (or paste fields onto an existing row while keeping `material_id` / `material_type`).
2. Ensure DLA capture validation passes (`instructional_archetype` + complete `archetype_plan`).
3. Copy/generate the GAM prompt — PRISM appends only the selected compact rule(s) plus planning JSON for materials present in the DLA capture. Confirm via `window.__PRISM_S59_FINAL_GAM_PROMPT` that routing reached the clipboard string **before** judging instructional quality.
4. Inspect GAM bodies for intervening-process / finding-transfer / relationship+constraint teaching without rubric labels.

**Runtime:** `ld-instructional-archetype.js?v=20260715-5` · `workflow-step-recognition-context.js?v=20260715-s59-gam-ctx-1` · `app.js?v=20260715-s59-mental-1`

**Note:** No complete enzymes/thermostat workflow artefact is archived in-repo; these fixtures supply the planning half needed for a clean re-run. Mental-model MVP uses the thermostat fixture (not enzyme parts).

