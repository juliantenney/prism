# Source Documents for Sprint 41

## Framework Documents

Review these first:

- `/docs/framework/north-star.md`
- `/docs/framework/educational-quality-framework.md`
- `/docs/framework/educational-prompting-guide.md`
- `/docs/framework/framework-overview.md`
- `/docs/framework/sprint-40-validation-report.md`

**Repository paths** (current on-disk locations):

- `docs/educational design/framework/north-star.md`
- `docs/educational design/framework/educational-quality-framework.md`
- `docs/educational design/framework/educational-prompting-guide.md`
- `docs/educational design/framework/framework-overview.md`
- `docs/educational design/framework/sprint-40-validation-report.md`

## Discovery Documents

Review if more background is needed:

- `/docs/discovery/educational-philosophy-and-quality-notes.md`

**Repository path:** `docs/educational design/discovery/educational-philosophy-and-quality-notes.md`

## Sprint 40 Handover

- `docs/development/sprints/2026-06-09-sprint-40-educational-quality-baseline-and-north-star-review/sprint-40-handover-pack.md`
- `docs/development/sprints/2026-06-09-sprint-40-educational-quality-baseline-and-north-star-review/sprint-40-plan.md`

## Existing PRISM Areas Likely to Matter

Sprint 41 should inspect the current prompt and generation architecture, especially:

- workflow prompt construction
- page generation prompts
- activity generation prompts
- learning sequence generation
- assessment generation
- PEL / metacognitive prompt handling
- output rendering patterns for learning guidance and activities

## Existing Controls and Factors Likely Relevant

Look for existing concepts such as:

- `activity_pattern_mix`
- `sequencing_granularity`
- `difficulty_profile`
- `assessment_cadence`
- `feedback_granularity`
- activity type / activity pattern controls
- learning activity generation steps
- construct learning sequence steps
- page/content generation steps

## Candidate Files to Locate

Cursor should identify the concrete files responsible for:

- system-level generation prompts
- workflow-level prompt assembly
- activity-generation prompt templates
- page-generation prompt templates
- assessment prompt templates
- PEL/metacognition prompt insertion
- output rendering templates/components

Add links or paths to those files below once identified.

## Sprint 41 Context File Collection

Review copies and extracts are in:

`docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/context-files/`

See `context-files/README.md` for the file index.

## Located Implementation Files

### System- and workflow-level prompt assembly

- `workflowGenerationContext.js` — loads platform + domain docs into workflow factory / generation context (`buildWorkflowGenerationContext`, `buildPromptRefinementContext`)
- `domains/domain-manifest.json` — declares which domain pack files are injected into generation context
- `app.js` — workflow brief elicitation, step prompt seeding, runtime resolution, and augmentation pipeline (see functions below)

Key `app.js` entry points:

- `buildSeededStepPromptForWorkflowStep` — seeds step prompts from pack step patterns + brief parameters
- `resolveStepPromptText` — resolves library override vs local override; applies runtime augmentations
- `applyWorkflowStepRuntimePromptAugmentations` — central augmentation chain for all resolved step prompts
- `augmentWorkflowBriefConfigPedagogicCognition` / `augmentWorkflowBriefConfigAssessmentSemantics` — brief-level pedagogic and assessment semantics

### Domain pack — step prompt templates and parameter controls

Primary authoritative pack for LD step prompts, artefact contracts, and workflow factors (`activity_pattern_mix`, `sequencing_granularity`, `difficulty_profile`, `assessment_cadence`, `feedback_granularity`, etc.):

- `domains/learning-design/domain-learning-design-step-patterns.md` — step definitions, `promptTemplate` bodies, parameter controls, topology
- `domains/learning-design/domain-learning-design-prompt-rules.md` — cross-step prompt design rules
- `domains/learning-design/domain-learning-design-principles.md` — instructional design principles referenced by prompts
- `domains/learning-design/domain-learning-design-artefacts.md` — artefact schemas and reuse contracts

Supporting platform workflow docs (injected via manifest):

- `docs/workflow/workflow-spec.md`
- `docs/workflow/workflow-authoring.md`
- `docs/workflow/pattern-library.md`

### Step-specific prompt augmentation (runtime contracts)

Injected by `applyWorkflowStepRuntimePromptAugmentations` in `app.js`:

| Step / concern | Contract module | Role |
|---|---|---|
| Design Learning Activities | `lib/ld-self-directed-rhetoric.js` | Learner-facing rhetoric, judgement stems, progression vocabulary |
| Generate Activity Materials (GAM) | `lib/ld-materials-copy.js`, `lib/ld-table-fidelity.js`, `lib/gam-output-format.js` | Materials fidelity, table realisation, GAM body validation |
| Design Learning Activities (PF-11) | `lib/episode-plan-dla-integration.js`, `lib/episode-plan-population-contract.js`, `lib/episode-plan-v1-templates.js` | Episode-plan obligation population; beat order authority |
| Design Page | `lib/ld-design-page-compose-contract.js`, `lib/page-gam-materials-preserve.js`, `lib/design-page-materials-fidelity.js` | Read-only compose, materials preservation, fidelity checks |
| Visual affordances | `lib/sprint38-visual-affordances.js` | Pedagogical visual metadata guidance |
| Maths rendering | `lib/ld-math-render.js` | Math-safe output contract |

`app.js` orchestration helpers for the above:

- `applyLdDesignPageComposeContractToDraft`, `buildLdDesignPageComposePromptBlock`
- `applySelfDirectedLearnerPageStepScaffoldsToDraft` (DLA / GAM / Design Page / assessment producer scaffolds)
- `applyEpisodePlanDlaPopulationPromptBlockToDraft`
- `applyLdMaterialsCopyContractToDraft`, `applyLdTableFidelityContractToDraft`

### PEL / metacognitive and pedagogic enrichment handling

Runtime PEL (Pedagogic Enrichment Layer) logic lives in `app.js`:

- `applyPedagogicEnrichmentContractScaffoldToDraft` — prompt-side PEL contract insertion
- `resolvePedagogicEnrichmentContractIds`, `evaluatePedagogicEnrichmentContractSatisfaction`
- `PEL_ORIENTATION_FIELD_IDS`, `PEL_REASONING_FIELD_IDS` — orientation and reasoning field sets
- `collectPelOrientationRowsFromPage`, `pelSanitizeLearnerPageActivityRow`, `sanitizeSelfDirectedLearnerPageActivityRows` — post-compose PEL sanitization on learner pages

Regression tests:

- `tests/workflow-pel-orientation.test.js`
- `tests/workflow-pel-reasoning.test.js`

Related cognition / assessment semantics tests:

- `tests/workflow-ld-cognition-topology.test.js`
- `tests/workflow-ld-cognition-contracts.test.js`
- `tests/workflow-ld-assessment-semantics-e2e.test.js`
- `tests/workflow-ld-orchestration.test.js`
- `tests/workflow-ld-episode-plan-step.test.js`

### Assessment, sequence, and activity generation steps

Step prompt templates and contracts for these canonical steps are defined in `domain-learning-design-step-patterns.md`:

- **Design Episode Plan** — archetype + beat planning (`episode_plans`)
- **Design Learning Activities** — obligation population from episode plans (`learning_activities`)
- **Generate Activity Materials** — realises `required_materials` (`activity_materials`)
- **Construct Learning Sequence** — sequencing and timing (`learning_sequence`; `sequencing_granularity` control)
- **Design Assessment** / **Generate Assessment Items** / **Design Feedback** — assessment blueprint, items, feedback pack

### Output rendering — learning guidance and activities

Page JSON → HTML rendering is implemented in `app.js`:

- `renderUtilitiesArtefactHtmlAsync` — main async render entry (exposed to tests as `renderUtilitiesArtefactHtmlAsyncForTest`)
- `renderLearningActivitiesBlocks` — activity cards, materials, learner guidance fields
- `renderLearningSequenceBlocks` — sequence presentation
- `applySelfDirectedLearnerPageActivityRowSanitizationToComposedPage` — learner-page PEL cleanup before render
- `applyAssessmentSemanticsToComposedPage` — assessment visibility semantics on composed pages

Render sequencing and role fidelity libraries:

- `lib/page-role-registry.js` — instructional role → heading → sequence mapping
- `lib/page-role-render-sequencing.js` — role-precedence render order
- `lib/page-a3-materials-sequencing.js` — materials ordering within activities
- `lib/page-role-fidelity.js` — role fidelity validation

Renderer documentation:

- `docs/architecture/renderer-export-behavior.md`

### Inflation comparison case (Sprint 40 benchmark)

Use for before/after framework integration testing:

- `tests/fixtures/page-render/ld-inflation-workshop-page.json`
- `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`
- `tests/utility-ld-inflation-page-render.test.js`
- `docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-AFTER-4-render.html` — primary inflation proof render
