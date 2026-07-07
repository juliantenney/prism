# Schema Source Audit

## Sources Inspected

- `domains/learning-design/domain-learning-design-step-patterns.md` (Design Page Prompt Factory, output keys, section guidance)
- `domains/learning-design/domain-learning-design-artefacts.md` (`page` artefact definition and requirements)
- `lib/ld-design-page-compose-contract.js` (compose contract obligations, field preservation, episode-plan handling)
- `app.js` (page section kind resolution, learning activities render/ordering/material merge behavior)
- `docs/architecture/renderer-export-behavior.md` (active page export/render behavior)
- `tests/utility-page-render.test.js` (consumer expectations and metadata rendering behavior)
- `tests/utility-page-composition-closure.test.js` (activity closure/composition validation behavior)
- `tests/page-episode-plans-preserve.test.js` (episode plan attachment semantics)
- `tests/workflow-learner-page-design-page-preservation.test.js` (material/transfer/consolidation preservation expectations)
- `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` (rich page shape examples)
- `tests/fixtures/page-render/marx-self-study-page.json` (journey/scaffold/cognition-rich page shape)
- `tests/fixtures/page-render/metadata-full.json` (metadata shape variant)
- `docs/development/sprints/2026-07-07-sprint-56e-design-page-minimal-refactor/design-page-contract.md`
- `docs/development/sprints/2026-07-07-sprint-56e-design-page-minimal-refactor/design-page-spec.md`

## Current Implied Schema

Repository sources imply a **page-root object** (`artifact_type = "page"`) with core top-level metadata (`title`, `audience`, `page_profile`) and a `sections[]` array using `{ section_id, heading, content }`.

Beyond that minimal root shape, sources imply a richer structure:
- canonical section IDs (`overview`, `learning_purpose`, `knowledge_summary`, `learning_activities`, `assessment_check`, `support_notes`, optional `metadata`)
- `learning_activities` rows keyed by `activity_id`, with learner-facing task/scaffold fields and structured `materials`
- `episode_plans[]` top-level plus optional per-activity `episode_plan` fields when episode plans are supplied
- provenance/constraint fields (`source_artefacts`, `constraints_applied`, `generation_notes`)

Current implementation sources also allow some shape variability (object/array forms for certain sections, optional metadata variants), which suggests schema decisions must separate **contract-required core** from **legacy/renderer-compatible variants**.

## Learner Journey Elements Found

- **PEL:** Present via reasoning/scaffold fields (`reasoning_orientation`, `self_explanation_prompt`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`) and preservation tests.
- **reflection:** Present via `self_explanation_prompt`, reflection prompts in materials/checklists, and study tips.
- **metacognition:** Present via “check your thinking” cues, `uncertainty_tension_prompt`, and self-explanation fields.
- **confidence checks:** Present behaviorally through checklist/support-note “check your thinking” patterns; no single dedicated canonical `confidence_*` field found.
- **consolidation:** Present via `consolidation_summary`/closure-oriented material fields and tests.
- **assessment:** Present via `assessment_check.content.items[]` and assessment rendering tests.
- **progression:** Present via `learning_sequence`, ordered activity rendering, and coherence bridge fields.
- **transfer:** Present via `transfer_or_application_task`, transfer prompts/material types, and episode beat functions (`transfer`).
- **feedback:** Present via optional upstream `feedback_pack`, prompt options (`include_feedback_guidance`), and assessment explanation rendering.
- **evidence of learning:** Present via `expected_output`, `evidence_use_prompt`, checklist completion criteria, and output-oriented assertions.

## Fields and Structures Inventory

| Field / Structure | Source File | Purpose | Classification | Notes |
| ----------------- | ----------- | ------- | -------------- | ----- |
| `artifact_type = "page"` | `domain-learning-design-step-patterns.md`, fixtures, tests | Page root identity | Required | Stable across sources |
| `title` | prompt factory + fixtures | Page label | Likely Required | Always present in primary fixtures/spec |
| `audience` | prompt factory + fixtures | Target learner profile context | Likely Required | Missing in some legacy fixtures |
| `page_profile` | prompt factory + fixtures/tests | Learner/facilitator/assessment mode | Required | Mode-dependent behavior |
| `sections[]` | prompt factory + renderer/tests | Primary page content container | Required | Core transport container |
| `sections[].section_id` | prompt factory + renderer | Section semantics/routing | Required | Canonical IDs used by renderer |
| `sections[].heading` | prompt factory + renderer | Display heading | Required | Used in fallback kind detection |
| `sections[].content` | prompt factory + renderer | Section payload | Required | Type varies by section |
| canonical IDs: `overview`, `learning_purpose`, `knowledge_summary`, `learning_activities`, `assessment_check`, `support_notes` | prompt factory + artefact docs + renderer | Canonical page structure | Likely Required | “when applicable”; omit if unsupported |
| `learning_activities.content[]` | prompt factory + contract + renderer | Activity rows | Required | Critical contract surface |
| `learning_activities.content[].activity_id` | contract + compose + closure tests | Activity membership traceability | Required | Used for closure/order checks |
| `learning_activities.content[].materials` | contract + compose + preservation tests | Embedded GAM payload bodies | Required | Core fidelity invariant |
| material IDs (preserved in mapping/path) | contract + artefact docs + tests | Traceability from GAM requirements | Required | Often implicit via field mapping; must be explicit in v2 schema strategy |
| `episode_plans[]` (top-level) | prompt factory + compose contract + preserve tests | Portable choreography payload | Likely Required | Required when upstream plans provided |
| per-row `episode_plan` (+ optional `episode_plan_source_activity_id`) | compose contract + preserve tests | Activity-level choreography attachment | Likely Required | Conditional on upstream episode plans |
| `source_artefacts` | prompt factory + artefact docs + tests | Provenance of consumed inputs | Likely Required | Type variance seen (array/object) |
| `constraints_applied` | prompt factory + fixtures | Declared option constraints | Optional | Useful but not core fidelity |
| `generation_notes.limitations` | prompt + compose + tests | Explicit gap/omission reporting | Likely Required | Important for auditable omissions |
| `generation_notes.activities_omitted[]` | compose contract + closure tests | Traceable omission authority | Likely Required | Required when omissions occur |
| `assessment_check.content.items[]` | prompt + renderer tests | Formative assessment embedding | Optional | Required only when upstream assessment items exist |
| scaffold fields (`activity_preamble`, `learner_task`, `expected_output`, `reasoning_orientation`, `self_explanation_prompt`, `evidence_use_prompt`, `transfer_or_application_task`, `intellectual_coherence_bridge`, etc.) | compose contract + fixtures/tests | Learner journey/cognition support | Optional | Strongly used in learner journey pages |
| `study_tips` section | prompt + fixtures/tests | Closure/reflection/transfer cues | Optional | Common but not always required |
| `learning_sequence` section | fixtures + renderer + compose contract | Activity order/timing display | Optional | Binding for order if present |
| `metadata` section | renderer + fixtures | Production/debug metadata | Legacy | Not in contract; appears for compatibility |
| `activity_materials` section on page | some fixtures | Legacy duplicate material projection | Legacy | Contract prefers materials embedded per activity row |

## Contract Alignment

### Fields clearly required by contract/spec
- page root identity (`artifact_type`)
- activity preservation (`activity_id` membership)
- material preservation (full bodies embedded in activity materials)
- material ID + material-to-activity mapping preservation
- sequence preservation (when provided/binding)
- episode-plan attachment (when provided)
- self-containment (no placeholders/references for required content)
- schema-conformant JSON

### Fields useful for learner journey but not yet explicit in spec
- scaffold/cognition fields (`reasoning_orientation`, `self_explanation_prompt`, `evidence_use_prompt`, `argument_structure_hint`, `conceptual_contrast_prompt`)
- `transfer_or_application_task`
- structured closure/consolidation fields (`consolidation_summary`, study tips closure prompts)
- explicit confidence-check semantics (currently pattern-based, not explicit field-level contract)
- richer assessment explanation/feedback structures beyond minimal `assessment_check.items`

### Fields that appear legacy or defensive
- page-level `activity_materials` section duplication
- `metadata` section as general catch-all
- extensive defensive generation-note and anti-pattern wording from historical incidents (implementation guidance vs schema shape)

### Fields requiring decision before schema freeze
- canonical type/shape of `source_artefacts` (array vs object seen in fixtures)
- whether `constraints_applied` is required or optional in v2
- whether per-row scaffold/cognition fields are core schema or extensible optional
- whether `metadata` remains supported in v2
- strict section set vs extensible section model

## Missing From Current Spec

Potential additions/clarifications for `design-page-spec.md` before schema freeze:

1. Explicit section-shape policy for `learning_activities` (array rows under canonical section).
2. Conditional requirements:
   - `episode_plans[]` and per-row `episode_plan` when upstream episode plans exist.
   - `assessment_check.content.items[]` when upstream assessment items exist.
3. `source_artefacts` shape decision and minimal required values.
4. Explicit handling of learner journey support fields as optional-but-supported contract surface.
5. Explicit stance on legacy page-level `activity_materials` section (allow/reject/migrate).
6. Explicit stance on `metadata` section in v2 schema.

## Candidate v2 Schema Recommendations

### Keep
- Core page root: `artifact_type`, `title`, `audience`, `page_profile`, `sections`
- Activity membership + IDs
- Embedded activity materials fidelity requirements
- Material ID/mapping preservation requirements
- Conditional episode-plan attachment model
- Self-containment and schema-valid JSON invariants
- Omission/provenance notes (`generation_notes` / `source_artefacts`) in a normalized form

### Remove
- Legacy dependence on top-level/page-level `activity_materials` section as primary material container
- Ambiguous metadata-only sections that are not contract-critical (`metadata` as unconstrained dump)
- Defensive implementation wording from schema surface (keep in guidance/tests, not core schema)

### Investigate
- Normalized canonical shape for `source_artefacts` and `generation_notes.validation`
- Minimum learner journey field set needed for contract-compliant “learner-facing” outputs
- Whether `constraints_applied` should be first-class schema field or optional metadata
- Compatibility strategy for existing fixtures with object-vs-array shape drift
