# Prompt-to-Schema Traceability

## Reduced Assembler Traceability

| Prompt Instruction | Schema Field(s) | Contract Responsibility | Invariant(s) |
| --- | --- | --- | --- |
| Use `learning_activities` as activity source | `sections[section_id=learning_activities].content[]`, `Activity.activity_id` | Preserve activity structure and membership | Activity preservation |
| Copy activity IDs exactly as supplied | `Activity.activity_id` | Preserve upstream activity identity exactly | Activity preservation |
| Use `activity_materials` as material-body source | `Activity.materials[]`, `Material.material_id`, `Material.body` | Copy learner-facing material bodies from upstream materials | Material body preservation |
| Copy material IDs exactly as supplied | `Material.material_id`, `Activity.materials[]` | Preserve upstream material identity exactly | Material ID preservation |
| Lookup by required `material_id` then attach | `Activity.materials[]`, `Material.material_id` | Preserve material ID mapping per activity | Material-to-activity mapping preservation |
| Lookup success means copy verbatim body | `Material.body` | Copy full material content into page | Self-containment; material body preservation |
| Attach episode and sequence info where supplied | `episode_plans[]`, `learning_sequence` | Attach choreography/order context | Episode-plan attachment; ordering preservation |
| Emit `artifact_type: "page"` when all lookups succeed | `artifact_type` | Emit final assembled artefact | Schema validity |
| Emit `artifact_type: "design_page_failure"` when required IDs are missing or IDs/content would need invention/renaming/normalization/inference/regeneration | `artifact_type` (failure object contract), missing ID list | Explicit missing/unsafe-transform failure behavior | Failure-condition handling |
| Design Page does not derive/regenerate/rename/normalise IDs or content | `Activity.activity_id`, `Material.material_id`, `Material.body` | Non-responsibility boundary (assembler only) | ID fidelity and material fidelity boundary |
