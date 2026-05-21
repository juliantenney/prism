# Sprint 28-5a — implementation baseline

**Date:** 2026-05-21  
**Scope:** Typed pedagogic cognition factors + cognition packs (E/O trace only; no topology redesign).

## Before (28-4 investigation)

- Cognition concepts class **D** in ontology audit — no `workflowBriefConfig` factors.
- `leanAssessmentItemIntent` could prune DLA/GAM when MCQ + assessment cues dominated.
- Sprint 27 assessment semantics merged at runtime via `augmentWorkflowBriefConfigAssessmentSemantics`.

## After (28-5a)

### Factors (boolean, runtime-merged optionalFactors)

| ID | Extract cues (conservative) |
|----|----------------------------|
| `cognitive_engagement_required` | Dialogic/learning-process phrases; activities + scaffold/misconception/revise |
| `reasoning_revision_required` | Revise answers; predict→discuss→revise; peer_instruction_phase |
| `misconception_reconciliation_required` | Misconception/false claims + confront/evidence; diagnostic workshop + activities |
| `adaptive_scaffolding_required` | Step-by-step hints; if learners struggle; contingent moves |
| `productive_uncertainty_required` | Conflicting evidence; uncertainty; debate |

### Cognition packs (intentClasses, runtime-merged)

| Pack | Activation (summary) |
|------|----------------------|
| `peer_instruction_pack` | `reasoning_revision_required` |
| `misconception_repair_pack` | `misconception_reconciliation_required` |
| `transcript_transformation_pack` | `provided_source_content` + `activities_required` |
| `self_study_cognition_pack` | Self-study/CPD cues + cognitive or scaffolding factors |

### Orchestration (minimal)

- `hasPedagogicCognitionIntent` suppresses `leanAssessmentItemIntent` and blocks lean step pruning when cognition active.
- Heuristic trace logs `pedagogicCognitionIntent`, `activeCognitionPacks`.

### Tests

- `tests/workflow-ld-cognition-factors-extract.test.js`
- `tests/workflow-ld-cognition-pack-propagation.test.js`

### Not in 28-5a

- No DLA/GAM schema changes
- No composition parity
- No renderer changes
- No learner model / adaptive runtime

**Next slice:** 28-5b — cognition-preserving topology guards (pack-driven step inclusion rules).
