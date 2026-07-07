# Design Page Contract

## Purpose
Design Page is a packaging/assembly stage that composes a learner-facing page artefact from authoritative upstream workflow outputs. Its core role is to carry forward already-authored instructional content and structure into a single page representation that can be rendered and reviewed.

Design Page is not a content-design stage. It should preserve upstream intent and payload fidelity while producing a complete, self-contained JSON artefact suitable for downstream use.

## Inputs
Authoritative upstream artefacts:
- Learning Outcomes
- Learning Sequence
- DLA output (`learning_activities`)
- GAM output (`activity_materials`)
- Episode Plans (`episode_plans`)

Other required input context used by the current implementation:
- Page/profile metadata (for example `page_profile`, audience, section layout expectations)
- Assessment artefacts when present (`assessment_items`, optional related feedback/rubric structures)

## Output
A valid Design Page JSON artefact (`artifact_type = page`) that assembles authoritative upstream records into a learner-facing page representation, including activities, materials, ordering, and attached episode plan context where applicable.

At a behavioral level, the output must be complete and self-contained: required activity/material content is embedded in the artefact itself, not deferred through placeholders or references.

## Responsibilities
- Assemble a learner-facing page object from authoritative upstream artefacts.
- Preserve required activity IDs and activity membership.
- Preserve required material IDs and material mapping per activity.
- Copy full GAM material bodies into corresponding page material fields.
- Attach episode plans to corresponding activities when provided.
- Preserve sequence order from Learning Sequence where sequence is binding/provided.
- Preserve required metadata needed for downstream rendering/review.
- Emit valid JSON conforming to the Design Page schema.

## Non-responsibilities
- Authoring new learning content.
- Rewriting learner-facing material bodies.
- Summarising or condensing GAM content.
- Regenerating activities or materials.
- Redesigning pedagogy.
- Re-planning episodes/choreography.
- Altering upstream activity structure.
- Inferring missing learner-facing bodies unless explicitly permitted by schema/contract.

## Required Invariants
- Every required activity is present.
- Every required material ID is present.
- Every required material body is preserved (whole-body fidelity).
- Activity order matches Learning Sequence when provided as binding input.
- Episode plans are attached to the correct activities.
- Output is self-contained (no deferred material placeholders/references).
- Output conforms to the Design Page schema.

## Failure Conditions
- Missing required activities.
- Missing required materials/material IDs.
- Summarised, truncated, or excerpted material bodies.
- Replaced material content (descriptions/placeholders/references instead of bodies).
- Detached, mismatched, or missing episode plans where required.
- Invalid JSON or schema non-conformance.
- False validation claims (for example, success/completeness flags despite failed invariants).
