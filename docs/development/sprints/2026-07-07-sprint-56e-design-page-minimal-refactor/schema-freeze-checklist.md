# Schema Freeze Checklist

## Freeze Preconditions

- [x] Contract extracted (`design-page-contract.md`)
- [x] Contract reconciled with specification (`contract-spec-gap-analysis.md` + applied spec updates)
- [x] Schema source audit completed (`schema-source-audit.md`)
- [x] Learner-journey fields identified (`schema-source-audit.md`, `design-page-spec.md`)
- [x] Legacy structures identified (`schema-source-audit.md`, `design-page-spec.md`)
- [x] Validation constraints understood (external audit model and false-positive detection expectations)
- [x] Open questions recorded (`design-page-spec.md`)

## Required Schema Capabilities

The frozen schema must support:

- page identity (`artifact_type = "page"`)
- canonical sections (`overview`, `learning_purpose`, `knowledge_summary`, `learning_activities`, `assessment_check`, `support_notes`)
- activity rows under `learning_activities`
- activity ID preservation
- material ID preservation
- embedded material bodies (full-body fidelity, not placeholders/references)
- material-to-activity mapping
- episode-plan attachment (conditional on upstream episode plans)
- learning outcomes / sequence metadata support where provided and binding
- learner-journey fields where present upstream:
  - PEL / prior experience links
  - metacognition, reflection, confidence checks
  - transfer/application prompts
  - consolidation prompts
- assessment / evidence / feedback fields where present upstream
- source artefact provenance via normalized `source_artefacts`
- generation notes and validation status surface (`generation_notes`, including `generation_notes.validation` shape)

## Decisions Required Before Freeze

| Decision | Options | Recommendation | Status |
| -------- | ------- | -------------- | ------ |
| Strict vs extensible section model | Strict canonical-only; Extensible with controlled additional sections | Extensible with strict canonical core (`section_id` enum baseline + controlled extension policy) | Pending |
| Canonical learner-journey field names | Minimal generic fields; Expanded explicit field set from audit patterns | Define a canonical core set + allow optional namespaced extensions | Pending |
| `constraints_applied` first-class vs optional | Required first-class field; Optional provenance/metadata field | Optional field, documented semantics, not a contract-critical invariant | Pending |
| Metadata section supported vs rejected | Reject entirely; Support as legacy-compatible; Keep fully supported | Support as legacy-compatible only (non-primary, bounded use) | Pending |
| Compatibility strategy for old fixtures | Hard break and migrate; Dual-shape support window; Long-term permissive compatibility | Dual-shape transition window with explicit migration path and sunset criteria | Pending |
| `source_artefacts` required shape | Object or array; Normalized array only | Normalized array only, each item requires `artefact_type`, `artefact_id` or `source_label`, and `role` | Pending |
| `generation_notes.validation` required shape | Freeform notes; Typed object with required keys | Typed object with minimum required keys for auditable status/evidence | Pending |

## Legacy Structures Decision

| Structure | Keep / Remove / Support as Legacy | Rationale |
| --------- | --------------------------------- | --------- |
| page-level `activity_materials` | Support as Legacy | Contract/spec define `learning_activities` as canonical material container; legacy fixtures may still include page-level projection |
| unconstrained `metadata` section | Support as Legacy | Useful for compatibility/rendering edge cases, but unconstrained dumps are out-of-scope for v2 normalized core |
| defensive prompt-control structures | Remove | Defensive prompt controls are implementation guidance, not schema contract surface |
| object-vs-array source artefact variants | Remove (object), Keep (array) | Normalize to array for deterministic provenance validation and reduced shape ambiguity |

## Freeze Recommendation

**Ready after listed decisions**

Rationale:
- Preconditions are met: contract, reconciliation, and schema-source audit are complete, with learner-journey and legacy surfaces identified.
- The specification now captures core invariants and policies required for a fuller normalized schema.
- Schema freeze should proceed only after the pending structural decisions above are resolved, especially section extensibility, learner-journey naming, and normalized shapes for `source_artefacts` and `generation_notes.validation`.
