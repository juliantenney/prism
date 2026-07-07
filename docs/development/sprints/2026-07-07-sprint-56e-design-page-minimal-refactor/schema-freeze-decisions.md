# Schema Freeze Decisions

This document resolves all pending decisions listed in `schema-freeze-checklist.md` and provides schema/prompt/migration implications for implementation readiness.

## Decision 1: Strict vs extensible section model

- Chosen option: **Extensible with strict canonical core** (`section_id` canonical baseline with controlled extension policy)
- Rationale:
  - Contract/spec require a stable canonical learner page shape.
  - Audit shows real fixtures and renderer behavior include variation; hard-strict canonical-only risks unnecessary breakage.
  - Controlled extensibility preserves forward compatibility without losing normalization.
- Impact on schema:
  - Define canonical `section_id` set as required/recognized core.
  - Allow additional sections via constrained extension rule (for example, pattern-validated non-canonical `section_id` values).
  - Keep `learning_activities` canonical and required as material container.
- Impact on prompt:
  - Prompt must always emit canonical sections when applicable.
  - Prompt may include additional sections only when explicitly backed by upstream artefacts or explicit omission/context needs.
- Migration implications:
  - Existing canonical fixtures remain valid.
  - Non-canonical legacy sections can remain during transition if they satisfy extension constraints.
  - Downstream consumers can rely on canonical core while ignoring unsupported extensions.

## Decision 2: Canonical learner-journey field names

- Chosen option: **Canonical core set + optional namespaced extensions**
- Rationale:
  - Learner-journey signals are required by audit/spec, but field naming is not fully stable across historical artefacts.
  - A core set provides consistency for validation and rendering; namespaced extensions prevent schema churn for emerging fields.
- Impact on schema:
  - Add explicit optional core fields for learner-journey support in activity rows/sections (reflection, metacognition, confidence, transfer, consolidation, evidence/output/success criteria surfaces).
  - Allow optional extension container (for example `journey_extensions`) for non-core fields.
- Impact on prompt:
  - Prompt should map upstream journey fields into canonical names where clear mapping exists.
  - Prompt should not invent new journey content; it may pass through unmapped upstream signals into extension slots if allowed.
- Migration implications:
  - Existing fixtures with near-equivalent field names can be normalized progressively.
  - Validation can begin asserting canonical core immediately while tolerating extension payloads during migration.

## Decision 3: `constraints_applied` first-class vs optional

- Chosen option: **Optional provenance/metadata field**
- Rationale:
  - It is useful for auditability but not contract-critical for content fidelity invariants.
  - Making it required would create false failures in otherwise valid historical outputs.
- Impact on schema:
  - Keep `constraints_applied` optional with a defined shape when present.
  - Exclude it from required invariant enforcement for pass/fail on core contract.
- Impact on prompt:
  - Prompt may emit `constraints_applied` when available/meaningful.
  - Prompt must not use missing `constraints_applied` as justification for incomplete output.
- Migration implications:
  - No forced backfill required for old fixtures.
  - Teams can adopt richer constraints provenance incrementally.

## Decision 4: Metadata section supported vs rejected

- Chosen option: **Support as legacy-compatible only (non-primary)**
- Rationale:
  - Spec marks unconstrained `metadata` section as legacy.
  - Full rejection now would likely break fixture/renderer compatibility without improving contract fidelity.
- Impact on schema:
  - Do not require page `metadata` section.
  - Allow legacy `metadata` in bounded form (or as permissive legacy branch), marked non-canonical.
  - Keep core required metadata in normalized top-level/canonical structures.
- Impact on prompt:
  - Prompt should prioritize normalized core metadata fields.
  - Prompt should avoid freeform metadata dumps; include legacy metadata only when downstream compatibility requires it.
- Migration implications:
  - Existing metadata-heavy fixtures can continue to validate in legacy-compatible mode.
  - Migration path can phase out legacy metadata section once downstream dependency is removed.

## Decision 5: Compatibility strategy for old fixtures

- Chosen option: **Dual-shape support window with explicit migration path and sunset criteria**
- Rationale:
  - Contract/spec goals require normalization, but immediate hard-break would reduce confidence and slow adoption.
  - A bounded transition allows deterministic migration with measurable closure criteria.
- Impact on schema:
  - Support v2 canonical shape as target.
  - Provide compatibility allowances for documented legacy structures during transition.
  - Add explicit deprecation notes and sunset expectations in sprint docs/tests.
- Impact on prompt:
  - Prompt should emit v2 canonical shape now (forward-only behavior).
  - Prompt should not intentionally emit legacy variants except for explicit compatibility requirement.
- Migration implications:
  - Maintain a legacy fixture set plus normalized fixture set.
  - Add migration scripts/manual mapping guidance for legacy to canonical conversion.
  - Remove compatibility allowances at sunset milestone.

## Decision 6: `source_artefacts` required shape

- Chosen option: **Normalized array only**
- Rationale:
  - Audit identifies object-vs-array drift as a primary ambiguity.
  - Array form gives deterministic validation and supports multiple source artefacts naturally.
- Impact on schema:
  - Require `source_artefacts` as an array of objects.
  - Each item requires: `artefact_type`, and either `artefact_id` or `source_label`, plus `role`.
  - Disallow object-form as canonical v2 shape (legacy acceptance only if explicitly scoped).
- Impact on prompt:
  - Prompt must always emit normalized array form.
  - Prompt should include minimally required provenance keys for each consumed upstream artefact.
- Migration implications:
  - Legacy object-form fixtures need one-time normalization mapping.
  - Validation should include a migration warning for object-form payloads during transition.

## Decision 7: `generation_notes.validation` required shape

- Chosen option: **Typed object with minimum required keys**
- Rationale:
  - Freeform validation notes are not reliable for auditable checks and false-positive detection.
  - A small typed structure supports external review without over-constraining implementation.
- Impact on schema:
  - Define `generation_notes.validation` object with required minimal keys (for example: status/result, checks summary, and limitations/omissions linkage).
  - Keep additional detail optional but typed where possible.
- Impact on prompt:
  - Prompt should emit the minimal validation object consistently.
  - Prompt must not claim pass/completeness when omissions or invariant failures exist.
- Migration implications:
  - Legacy freeform validation notes require mapping into typed fields.
  - During transition, unmapped freeform notes can be retained in auxiliary text fields if schema allows.

## Final Recommendation

**READY FOR SCHEMA IMPLEMENTATION**

All freeze decisions from `schema-freeze-checklist.md` are now resolved with explicit chosen options and implementation implications. The schema can proceed to implementation using:
- canonical core + controlled extension policy,
- normalized provenance structures,
- typed validation note shape,
- and bounded legacy compatibility during migration.
