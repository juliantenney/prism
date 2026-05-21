# Sprint 28-5b — cognition-aware orchestration baseline

**Date:** 2026-05-21  
**Builds on:** 28-5a factors/packs + lean guards

## Orchestration semantics (runtime)

`resolvePedagogicCognitionOrchestrationSemantics(activePacks, resolved, explicit, base)` returns:

| Field | Meaning |
|-------|---------|
| `cognitionTopologyRequired` | Any cognition pack active |
| `preserveLearningActivityChain` | Protect DLA/GAM (and pack-specific stages) from optional pruning |
| `cognitionAwareAssessmentFlow` | Apply DLA → GAM → GAI ordering (extends `discussionOrientedAssessmentWorkflow`) |
| `preservedCognitionStages` | Canonical steps to inject if missing |
| `cognitionPruningPrevented` | Trace: `inject:*`, `protect:activity_chain` |

## Pack → preserved stages (minimal)

| Pack | Stages ensured |
|------|----------------|
| `peer_instruction_pack` | DLO, DLA, GAM |
| `misconception_repair_pack` | DLO, DLA, GAM, CLS |
| `transcript_transformation_pack` | NC, MK, DLO, DLA, GAM |
| `self_study_cognition_pack` | GLC, DLA, GAM |

## Behaviour changes

- Inject missing cognition stages before pruning
- `explicitlyRequiredStepSet` closure protects cognition stages
- CLS retained when `misconception_repair_pack` active
- Lean `learning_outcomes` bypass blocked when cognition topology required
- Transcript/peer packs force `activities_required` for chain viability

## Trace (`[PRISM][Trace][Heuristics]`)

Adds: `cognitionTopologyRequired`, `preserveLearningActivityChain`, `cognitionAwareAssessmentFlow`, `preservedCognitionStages`, `cognitionPruningPrevented`

## Tests

`tests/workflow-ld-cognition-topology.test.js` (+8)

## Not in 28-5b

- Typed reconciliation schema (28-5c)
- Composition parity (28-5d)
- Scaffold engine / learner model
- Adaptive sequencing engine
