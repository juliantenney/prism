# Schema Implementation Notes

## Decisions Applied

1. **Strict vs extensible section model**
   - Implemented as strict canonical core plus controlled extension.
   - `sections` enforces presence of canonical section IDs and still allows additional `section_id` values (pattern-constrained).

2. **Canonical learner-journey field names**
   - Implemented canonical learner-journey fields on `Activity`:
     - `pel_links`
     - `reflection_prompts`
     - `metacognition_checks`
     - `confidence_checks`
     - `transfer_prompts`
     - `consolidation_prompts`
     - `evidence_of_learning`
     - `feedback_guidance`
     - `success_criteria`
   - Implemented optional `journey_extensions` for controlled non-core journey payloads.

3. **`constraints_applied` first-class vs optional**
   - Implemented `constraints_applied` as optional top-level object with typed shape.

4. **Metadata section supported vs rejected**
   - `metadata` is not a required canonical section.
   - Legacy-compatible support is bounded via section `section_id = metadata` with constrained `LegacyMetadataContent`.

5. **Compatibility strategy for old fixtures**
   - Implemented v2 canonical target with bounded legacy allowances:
     - optional constrained `metadata` section
     - canonical section core required
   - No primary legacy structures were promoted into v2 core.

6. **`source_artefacts` required shape**
   - Implemented as normalized array only.
   - Each item requires `artefact_type`, `role`, and one of `artefact_id` or `source_label`.

7. **`generation_notes.validation` required shape**
   - Implemented as typed object with required keys:
     - `activity_coverage`
     - `material_coverage`
     - `episode_plan_attachment`
     - `self_containment`
     - `schema_compliance`
     - `known_issues`

## Responsibilities Covered

- **Assemble valid page object from upstream artefacts**
  - Covered by required top-level structure (`artifact_type`, profile/context fields, sections, sequence, episode plans, provenance, generation notes).

- **Preserve activity IDs and membership**
  - Covered by canonical `learning_activities` section and required `Activity.activity_id`.

- **Preserve material IDs and material-to-activity mapping**
  - Covered by required `Activity.materials[]` with required `Material.material_id`.
  - Mapping is represented structurally by embedding materials under each activity row.

- **Preserve full material bodies**
  - Covered by required non-empty `Material.body` as embedded content field.

- **Attach episode plans to corresponding activities**
  - Covered by `episode_plans[]` requiring `episode_plan_id`, `activity_id`, `body`.
  - Activity-level linkage supported via `episode_plan_id` and `episode_plan_source_activity_id`.

- **Preserve sequence order when provided**
  - Covered by required `learning_sequence.ordered_activity_ids`.

- **Preserve required metadata**
  - Covered by required `page_profile`, `audience`, `source_artefacts`, and typed `generation_notes.validation`.

- **Emit schema-valid JSON**
  - Covered by `additionalProperties: false` at top level and typed definitions throughout.

## Invariants Covered

- **Activity preservation invariant**
  - `learning_activities` canonical section with typed `Activity[]` rows and required `activity_id`.

- **Material ID preservation invariant**
  - `Material.material_id` required.

- **Material-to-activity mapping invariant**
  - Materials are embedded under each activity row, not separated into independent top-level material dumps.

- **Whole-body material preservation invariant**
  - `Material.body` required and non-empty.

- **Episode-plan attachment invariant**
  - `EpisodePlan.activity_id` required; activity linkage fields available.

- **Ordering preservation invariant**
  - `learning_sequence.ordered_activity_ids` required.

- **Self-containment invariant**
  - Material representation is embedded (`body`) within the page object.
  - No canonical top-level deferred `activity_materials` structure exists.

- **Schema validity invariant**
  - Strongly typed schema with bounded structures and required contract surfaces.

## Legacy Structures Excluded

- **Page-level `activity_materials` primary structure**
  - Excluded from top-level schema.
  - Rationale: v2 canonical container is `learning_activities` with embedded materials.

- **Unconstrained metadata dump structures**
  - Excluded.
  - Rationale: metadata is only legacy-compatible in bounded `LegacyMetadataContent` form.

- **Defensive prompt-control artefacts**
  - Excluded from schema.
  - Rationale: schema encodes data contract, not prompt safety instructions.

- **Object/array dual representations for `source_artefacts`**
  - Excluded.
  - Rationale: canonical normalized array-only shape is enforced.

## Remaining Open Questions

- Whether canonical learner-journey field names should be further narrowed before broader fixture migration.
- Whether to enforce cross-field referential checks (for example `episode_plans[].activity_id` must exist in activity rows) in external validators only or also in schema extensions.
- Whether legacy `metadata` support should be sunset in a defined schema version after fixture migration.

Final assessment:

**Partially**

Why:
- The implemented schema covers the full responsibility/invariant surface structurally, including canonical sections, embedded materials, episode linkage, sequence/provenance, and typed validation reporting.
- Some failure conditions (for example semantic summarization/truncation detection, false validation claims, and cross-reference correctness) are not fully enforceable by JSON Schema alone and require external validation logic by design.
