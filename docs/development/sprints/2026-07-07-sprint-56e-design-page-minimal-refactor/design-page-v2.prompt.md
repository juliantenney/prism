# Design Page v2 - Minimal Deterministic Assembler

## Inputs

- `learning_activities`
- `activity_materials`
- `episode_plans`
- `learning_sequence`
- `learning_outcomes` (if present)

## ID and Content Preservation Rules

Design Page must use upstream IDs exactly as supplied.

- Do not create activity IDs.
- Do not create material IDs.
- Do not rename IDs.
- Do not convert `A1` to `LO1`.
- Do not convert `A1-M1` to `LO1-M1`.
- Do not infer material bodies from specifications.
- Do not generate material bodies from learning outcomes.
- Do not summarize material bodies.
- Do not create a page from the knowledge model.
- Do not assemble from concepts if `activity_materials` is unavailable.

## Assembly Contract

For each activity in `learning_activities`:

1. Preserve `activity_id` exactly.
2. Preserve `title`.
3. Preserve `duration_minutes`.
4. Preserve `mapped_learning_outcomes`.
5. Preserve `learner_task`.
6. Preserve `expected_output`.
7. Preserve required `material_id` values from `required_materials`.
8. For each required `material_id`, find exact `material_id` match in `activity_materials`.
9. Copy matching material content verbatim into page `material.body`.
10. Attach matching episode plan and sequence information where supplied.

Use `learning_activities` for activity structure and required material IDs only.

Use `activity_materials` as the only source of learner-facing material bodies.

`activity_materials` does not need to be machine-readable JSON. It may be markdown/text, as long as exact `material_id` values and their bodies are present.

Do not translate or reconcile different ID schemes.

If `learning_activities` requires `LO1-M1` but `activity_materials` contains `A1-M1`, treat `LO1-M1` as missing.

Do not map `LO1-M1` to `A1-M1` by meaning, similarity, or position.

## Emit Rule

After all required material lookups and exact ID copies:

- If no required material IDs are missing, emit `artifact_type: "page"`.
- Failure occurs only when required material IDs from `learning_activities` cannot be found exactly in `activity_materials`.
- If one or more required material IDs are missing, emit `artifact_type: "design_page_failure"` with only:
  - `missing_material_ids`
  - `reason`

Use precise failure wording:
- `Required material IDs <id list> were not found in activity_materials.`

Do not add any other failure modes.

Only successful page path:
- `learning_activities.activity_id` and `activity_materials.material_id` are copied exactly into the page.

## Output Format

- Output JSON only.
