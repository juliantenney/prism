# Schema-to-Prompt Mapping

## Mapping Philosophy

Design Page is an assembler.

Its primary responsibilities are:
- preserve
- copy
- attach
- order
- validate
- emit

It is not responsible for:
- authoring
- summarising
- improving
- redesigning
- regenerating

---

## Top-Level Artefact Mapping

| Schema Field | Upstream Source | DP Action | Ownership |
| ------------ | --------------- | --------- | --------- |
| `artifact_type` | Design Page contract/schema constant | emit | Design Page |
| `title` | DLA (activity framing) + Learning Outcomes/Learning Sequence context | derive | Design Page |
| `audience` | Upstream profile metadata | preserve | Design Page |
| `page_profile` | Upstream profile metadata | preserve | Design Page |
| `learning_outcomes` | Learning Outcomes | preserve | Learning Outcomes |
| `learning_sequence` | Learning Sequence | preserve | Learning Sequence |
| `source_artefacts` | IDs/labels of consumed upstream artefacts | attach | Design Page |
| `generation_notes` | DP assembly process + external validation reporting summary | validate | Design Page |

---

## Section Mapping

| Section | Upstream Source | DP Action | Notes |
| ------- | --------------- | --------- | ----- |
| `overview` | Learning Outcomes + Learning Sequence + DLA context | derive | Assembled wrapper section; conditionally content-derived from upstream facts, not authored pedagogy. |
| `learning_purpose` | Learning Outcomes + DLA purpose statements | preserve | Prefer copied/aligned purpose language from upstream when present. |
| `knowledge_summary` | DLA/GAM summary-level upstream artefacts | preserve | Assembled section; no regeneration of material bodies. |
| `learning_activities` | DLA activities + GAM materials + Episode Plans + Learning Sequence | attach | Canonical container; activities and embedded materials are core transport zone. |
| `assessment_check` | Upstream assessment artefacts | attach | Conditionally included with content when upstream assessment items are provided. |
| `support_notes` | Upstream support/scaffold signals | preserve | Conditionally included; may aggregate upstream learner-support cues. |

For all sections:
- Content is copied where authoritative upstream payload exists.
- Content is assembled only for container/wrapper organization.
- Inclusion is conditional on upstream availability and schema constraints.

---

## Activity Mapping

| Field | Source | DP Action | Notes |
| ----- | ------ | --------- | ----- |
| `activity_id` | DLA | preserve | Must remain stable for mapping/sequence/episode attachment. |
| `title` | DLA | preserve | No redesign/rewrite beyond formatting normalization. |
| `learner_task` | DLA | preserve | Transport of task intent. |
| `expected_output` | DLA (and/or assessment upstream) | preserve | Supports evidence-of-learning checks. |
| `learning_outcome_ids` | Learning Outcomes + DLA mapping | attach | DP attaches outcome linkage to activity rows. |
| learner-journey fields (`pel_links`, `reflection_prompts`, `metacognition_checks`, `confidence_checks`, `transfer_prompts`, `consolidation_prompts`, `evidence_of_learning`, `feedback_guidance`, `success_criteria`, `journey_extensions`) | Primarily DLA/Episode Plans/assessment upstream, optionally GAM where explicit | preserve | DP represents these if present upstream; DP does not invent learner-journey content. |
| `episode_plan_id` / `episode_plan_source_activity_id` | Episode Plans | attach | Linkage fields connect activity rows to episode plans. |

---

## Material Mapping

| Field | Source | DP Action | Notes |
| ----- | ------ | --------- | ----- |
| `material_id` | GAM | preserve | Required for traceability and mapping integrity. |
| `material_type` | GAM | preserve | Preserve upstream type semantics. |
| `title` | GAM | preserve | Preserve upstream title/label. |
| `body` | GAM `Content:` body | copy | Must be embedded full body in activity materials (no placeholders/references/summaries). |

Explicit mapping rules:
- Material body source: authoritative GAM content bodies.
- Preservation requirement: full-body fidelity is required; excerpting/summarization is invalid.
- Mapping requirement: materials remain attached to the correct `activity_id` container.

---

## Episode Plan Mapping

| Field | Source | DP Action | Notes |
| ----- | ------ | --------- | ----- |
| `episode_plan_id` | Episode Plans | preserve | Stable plan identity. |
| `activity_id` | Episode Plans (must reference DLA activity) | attach | Used to bind plans to activity rows. |
| `body` | Episode Plans | copy | Preserve plan content; no replanning/regeneration by DP. |
| `timing_metadata` | Episode Plans | preserve | Preserve timing fields if present. |
| `choreography_metadata` | Episode Plans | preserve | Preserve choreography/phase/beat metadata if present. |

---

## Learner Journey Mapping

- **PEL**
  - Source owner: DLA / Learning Outcomes context
  - DP responsibility: preserve and place in activity structure
  - May DP create it: no
- **reflection**
  - Source owner: DLA / upstream prompts
  - DP responsibility: preserve and attach
  - May DP create it: no
- **metacognition**
  - Source owner: DLA / support upstream
  - DP responsibility: preserve and attach
  - May DP create it: no
- **confidence checks**
  - Source owner: DLA / assessment-support upstream
  - DP responsibility: preserve and attach
  - May DP create it: no
- **transfer**
  - Source owner: DLA / Episode Plans
  - DP responsibility: preserve and attach
  - May DP create it: no
- **consolidation**
  - Source owner: DLA / GAM closure content
  - DP responsibility: preserve and attach
  - May DP create it: no
- **feedback**
  - Source owner: assessment / feedback upstream artefacts
  - DP responsibility: preserve and attach
  - May DP create it: no
- **evidence of learning**
  - Source owner: DLA / assessment upstream
  - DP responsibility: preserve and attach
  - May DP create it: no
- **success criteria**
  - Source owner: DLA / assessment upstream
  - DP responsibility: preserve and attach
  - May DP create it: no

---

## Design Page-Owned Fields

Fields genuinely owned by Design Page (minimized set):
- `artifact_type` (contract identity emission)
- `source_artefacts` (provenance assembly of consumed inputs)
- `generation_notes` (reporting envelope)
- `generation_notes.validation` (reporting structure only; external validation outcomes can be represented)
- optional `constraints_applied` (assembly/provenance notes)

All pedagogical or learner-facing content fields are upstream-owned and transported/attached by DP.

---

## Fields With No Clear Owner

| Field | Why unclear | Recommendation |
| ----- | ----------- | -------------- |
| `title` (page-level) | Can be synthesized from multiple upstream artefacts; no single authoritative producer explicitly named in contract | assign owner (define deterministic derivation policy under DP assembly) |
| `audience` | Treated as required metadata but authoritative upstream producer not explicitly fixed | assign owner (likely upstream profile metadata contract) |
| `page_profile` subfields (`profile_type`, `mode`, `level`, `delivery_context`) | Required in schema but upstream contract lists only general page/profile metadata | investigate (formalize exact upstream source and required subset) |
| `journey_extensions` | Intentionally extensible; source system not enumerated | investigate (define allowed upstream contributors or constrain usage) |
| `constraints_applied` | Optional by decision; utility known, authoritative source not fixed | assign owner (Design Page provenance emission) |

---

## Prompt Responsibilities

Design Page must:
- emit a schema-valid `artifact_type = page` artefact
- preserve upstream activity identities and activity membership
- copy GAM material bodies into embedded activity material records
- preserve material IDs/types/titles and maintain material-to-activity mapping
- attach episode plans to correct activity IDs
- preserve learning sequence structure/order metadata
- preserve and represent learner-journey fields when provided upstream
- attach normalized provenance (`source_artefacts`)
- emit typed generation reporting (`generation_notes.validation`)
- keep output self-contained with embedded required content

Design Page must not:
- author learner-facing instructional content
- summarize, truncate, or replace material bodies
- regenerate activities/materials/episode choreography
- redesign pedagogy or sequence intent
- output placeholder/reference text in place of required embedded material bodies
- depend on legacy primary structures (for example page-level `activity_materials`)

---

## Prompt Rewrite Readiness

**Yes**

The schema plus this mapping now define a direct implementation contract for prompt rewrite:
- each major schema field has source, DP action, and ownership guidance,
- DP-owned fields are minimized and explicit,
- transport vs authoring boundaries are clear,
- and remaining ambiguity points are isolated as owner-assignment follow-ups rather than architecture redesign.

This makes prompt rewrite a mechanical implementation task against the schema contract, not a new architecture phase.
