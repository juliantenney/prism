# Schema Review Report

## Executive Summary

**Mostly Aligned**

The implemented schema is strongly aligned with the approved contract, specification, and freeze decisions: canonical section model, activity/material structures, episode-plan support, learner-journey fields, normalized provenance, and typed validation reporting are all present.  
The remaining gaps are mostly about **constraint strictness and semantic verification boundaries** (for example, unconditional required canonical sections versus conditional requirements, and invariants/failure modes that require external validation rather than JSON Schema-only enforcement).

---

## Freeze Decision Verification

| Decision | Implemented | Notes | Status |
| -------- | ----------- | ----- | ------ |
| Strict vs extensible section model | Yes | Canonical section IDs are enforced via `contains`; additional section IDs allowed by `section_id` pattern. | Match |
| Canonical learner-journey field names | Yes | Canonical activity-level fields implemented plus `journey_extensions` for controlled extension. | Match |
| `constraints_applied` first-class vs optional | Yes | Present as optional typed top-level field. | Match |
| Metadata section supported vs rejected | Yes | `metadata` not canonical/required; bounded legacy support via `LegacyMetadataContent`. | Match |
| Compatibility strategy for old fixtures | Partially | Bounded legacy support exists (`metadata`), but schema itself does not encode migration window/sunset policy. | Partial Match |
| `source_artefacts` required shape | Yes | Array-only normalized form; item requires `artefact_type`, `role`, and one of `artefact_id`/`source_label`. | Match |
| `generation_notes.validation` required shape | Yes | Typed object with required keys (`activity_coverage`, `material_coverage`, `episode_plan_attachment`, `self_containment`, `schema_compliance`, `known_issues`). | Match |

---

## Contract Coverage Review

| Contract Requirement | Schema Support | Status | Notes |
| -------------------- | -------------- | ------ | ----- |
| Assemble learner-facing page object from authoritative inputs | Top-level required contract fields + section model | Match | Structural assembly surface is explicit. |
| Preserve activity IDs/membership | `learning_activities` section uses typed `Activity` rows with required `activity_id` | Match | Presence of activities is representable and type-enforced. |
| Preserve material IDs and mappings | `Activity.materials[]` with required `material_id` | Match | Mapping is structural (materials embedded per activity). |
| Preserve full material bodies | Required non-empty `Material.body` | Partial Match | Body presence enforced; semantic “full fidelity” requires external validation. |
| Attach episode plans to correct activities | `EpisodePlan.activity_id` + row linkage fields | Partial Match | Link fields exist; referential correctness across arrays requires external validation. |
| Preserve sequence order when binding/provided | Required `learning_sequence.ordered_activity_ids` | Partial Match | Structure enforced; equality to emitted activity order requires external validation. |
| Preserve required metadata for rendering/review | Required `page_profile`, `audience`, `source_artefacts`, `generation_notes` | Match | Core traceability/reporting metadata represented. |
| Emit valid JSON conforming to schema | Strict typed schema (`additionalProperties: false`) | Match | Schema validity invariant is enforceable. |
| Non-responsibilities (no authoring/rewriting/summarization/regeneration) | Not directly enforceable in JSON shape | Partial Match | Correctly not encoded as behavior; validated externally. |
| Failure conditions (missing IDs, summaries, placeholders, false claims) | Partial structural support | Partial Match | Missing fields invalidated by schema; semantic failures require external review. |

---

## Specification Coverage Review

| Specification Item | Schema Support | Status | Notes |
| ------------------ | -------------- | ------ | ----- |
| Canonical sections | Enforced via `sections` `contains` for 6 canonical IDs | Match | Hybrid model with extensibility present. |
| Activities | `learning_activities` section content typed as `Activity[]` | Match | Canonical container behavior represented. |
| Materials | Typed `Material` with required `material_id`, `material_type`, `title`, `body` | Match | Self-contained embedded material model present. |
| Episode plans | `episode_plans[]` typed with link + body + timing/choreography metadata | Match | Attachment surfaces represented. |
| Learner-journey fields | Canonical activity fields + extension container | Match | Directly supports requested journey surfaces. |
| Provenance | `source_artefacts` normalized array-only typed items | Match | No object/array dual shape. |
| Validation reporting | Typed `generation_notes.validation` object with required keys | Match | External validation reporting surface represented. |
| Legacy exclusions | Page-level `activity_materials` excluded; defensive fields excluded; metadata bounded legacy only | Match | Matches freeze/spec legacy policy. |

---

## Learner Journey Coverage

- **PEL**: represented directly (`pel_links`)
- **reflection**: represented directly (`reflection_prompts`)
- **metacognition**: represented directly (`metacognition_checks`)
- **confidence checks**: represented directly (`confidence_checks`)
- **transfer/application**: represented directly (`transfer_prompts`)
- **consolidation**: represented directly (`consolidation_prompts`)
- **feedback**: represented directly (`feedback_guidance`, plus assessment-level feedback guidance)
- **evidence of learning**: represented directly (`evidence_of_learning`, `expected_evidence`)
- **success criteria**: represented directly (`success_criteria` on activities/assessment items)

---

## Invariant Coverage

- **Activity preservation**: **Representable by Schema** (typed activity rows + IDs; completeness against upstream requires external validation)
- **Material ID preservation**: **Representable by Schema** (required material IDs; exact upstream set matching external)
- **Material-to-activity mapping preservation**: **Representable by Schema** (embedded per activity; upstream equivalence external)
- **Material body preservation**: **Requires External Validation** (schema enforces presence/non-empty body, not fidelity vs source)
- **Episode-plan attachment**: **Representable by Schema** (linkage fields present; attachment correctness external)
- **Sequence preservation**: **Representable by Schema** (sequence field present; ordering equivalence external)
- **Self-containment**: **Representable by Schema** (embedded bodies and no primary top-level `activity_materials`; semantic placeholder detection external)
- **Schema validity**: **Enforced by Schema**

---

## Legacy Structure Review

- **page-level `activity_materials`**: excluded
- **metadata dump structures**: supported for compatibility (bounded legacy `metadata` section content only)
- **defensive prompt artefacts**: excluded
- **legacy provenance variants**: excluded (array-only canonical `source_artefacts`)

---

## Gaps and Risks

- Canonical section presence is enforced unconditionally; spec language suggests some sections may be conditional by upstream applicability.
- `learning_outcomes`, `learning_sequence`, and `episode_plans` are required at top level; this may be stricter than some compatibility scenarios.
- Cross-reference integrity is not enforceable with current schema alone (for example episode plan `activity_id` existence in activity rows).
- Fidelity failure modes (summarization, excerpt-only copying, placeholder substitution) remain external-validation concerns by design.
- Migration policy details (sunset window, deprecation gates) are not encoded in schema and must remain in sprint governance/test docs.

---

## Recommendation

**READY FOR PROMPT REFACTOR**

Rationale:
- The implemented schema is sufficiently authoritative for v2 prompt rewrite: it captures the approved contract shape, freeze decisions, learner-journey support, provenance normalization, and validation reporting surface.
- Remaining issues are minor and mostly external-validation/governance concerns rather than blockers to prompt refactor.
- Prompt refactor can proceed while tracking the identified strictness and migration caveats in follow-up schema/test iterations.
