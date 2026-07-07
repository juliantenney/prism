# Design Page v2 Specification

## Sprint
- ID: 56E
- Title: Design Page Minimal Refactor
- Type: Architecture / Prompt Refactor

## Objective
Replace the existing Design Page implementation with a schema-led minimal implementation derived from explicit responsibilities rather than accumulated defensive instructions.

> Note: The Design Page specification should be reconciled against `design-page-contract.md` before the schema or minimal prompt is frozen.

## Responsibilities (extracted)
1. Assemble a valid page object from authoritative upstream artefacts.
2. Preserve activity membership and identifiers.
3. Preserve material IDs and material-to-activity mapping.
4. Preserve ordering from Learning Sequence (when provided).
5. Copy full GAM material bodies into destination material fields.
6. Attach episode plans to corresponding activity records.
7. Preserve required metadata needed for downstream rendering/review.
8. Produce a self-contained Design Page artefact; required content is embedded, not referenced.
9. Emit structurally valid JSON compliant with schema.

## Required Metadata
- `page_profile`: TBD
- `audience`: TBD
- section layout metadata: TBD
- source/validation metadata scope: TBD

Required metadata is limited to metadata needed for learner journey, rendering, traceability, or validation.

Avoid unconstrained metadata dumps.

`metadata` as a page section is treated as legacy unless explicitly required by downstream rendering.

## Section Shape Policy
- Canonical sections in v2:
  - `overview`
  - `learning_purpose`
  - `knowledge_summary`
  - `learning_activities`
  - `assessment_check`
  - `support_notes`
- `learning_activities` is the canonical container for activity rows and embedded material payloads.
- Page-level `activity_materials` must not be used as the primary material container in v2.

## Learner Journey Support Fields
The schema should support, where present upstream:
- PEL / prior experience links
- reflection prompts
- metacognitive checks
- confidence checks
- consolidation prompts
- transfer/application prompts
- feedback moments
- evidence-of-learning fields
- expected learner outputs
- success criteria

Design Page represents these fields only when provided by upstream artefacts. It does not author them.

## Conditional Requirements
- Episode plans are required when upstream episode plans are provided.
- Episode plans must be attached to the correct activity IDs.
- Assessment check items are required when upstream assessment items are provided.
- Sequence/order metadata is required when Learning Sequence is provided and binding.
- Omission notes are required when any expected upstream content is missing or explicitly omitted.

## Source Artefact Policy
`source_artefacts` is a normalized array, not an ambiguous object.

Each source artefact should include at minimum:
- `artefact_type`
- `artefact_id` or `source_label`
- `role`

Do not rely on freeform metadata dumps for provenance.

## Non-responsibilities
- Do not author new learner content.
- Do not rewrite, summarize, improve, or regenerate upstream material bodies.
- Do not redesign pedagogy, choreography, or sequence logic.
- Do not infer replacement content for missing upstream bodies.
- Do not alter upstream activity structure.

## Required invariants
- Activity preservation invariant.
- Material ID preservation invariant.
- Material-to-activity mapping preservation invariant.
- Material preservation invariant (whole-body fidelity).
- Episode-plan attachment invariant.
- Ordering preservation invariant.
- Self-containment invariant (required content embedded, not deferred/referenced).
- Schema validity invariant.

## Validation requirements
- Objective checks must independently verify each invariant.
- Validation must detect false-positive self-reports.
- Validation must treat summarized/placeholder/referenced materials as failure.

## Failure conditions
- Any activity required upstream missing downstream without explicit, allowed omission authority.
- Any required material IDs missing from output.
- Any required material-to-activity mapping broken/mismatched.
- Any material body truncated, summarized, replaced, or referenced instead of embedded.
- Any excerpt-only material copy (for example opening-only copy instead of whole body).
- Episode plans missing or misattached where required.
- Order divergence from authoritative sequence (when sequence is present and binding).
- Output is invalid JSON.
- Output fails schema.
- False validation claims (for example, success/completeness flags despite failed invariants).

## Legacy Structure Policy
- Page-level `activity_materials` is legacy and should not be the primary v2 material location.
- Unconstrained `metadata` sections are legacy unless a downstream dependency is identified.
- Defensive prompt-control structures do not belong in the schema.
- Compatibility with old fixtures should be considered separately from the v2 contract.

## Open Questions
- Strict vs extensible section model.
- Exact canonical learner-journey field names.
- Whether `constraints_applied` is first-class or optional.
- Compatibility strategy for existing fixtures.
- Whether `metadata` section is supported or rejected in v2.
- Wrapper text policy (when, if ever, wrapper generation is allowed).
- Derived section policy (whether sections not explicitly present upstream are allowed).
- Metadata scope (which metadata fields are mandatory vs optional).
- Canonical minimal schema boundaries for optional sections.
- Normalization policy for strict body-equality checks.
- Legacy ID handling / ID-mapping strategy when upstream and composed IDs differ.
- Required minimum validation evidence fields inside generation notes.

## Definition of Done mapping
- Responsibilities explicitly defined: this spec.
- Schema exists: `design-page.schema.json`.
- Minimal prompt exists: `design-page-minimal.prompt.md`.
- Test strategy exists: `test-plan.md` + `test-fixtures/`.
- First comparison against current Design Page: tracked in workstream E output.
- Recommendation produced: sprint closure decision note.
