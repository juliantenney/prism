# Key Decisions — Sprint 67 Context

## Why vNext was created

Sprint 66 showed the live learner path could not reliably associate episode-plan beats, learner-task steps, and materials without:

* a dual planner (compose vs registry);  
* heuristic English scoring;  
* empty beat wrappers;  
* role-blind global labels;  
* post-render expected-output insertion.

The product decision was to stop extending that architecture and build an isolated deterministic pipeline.

## What is intentionally not being reused

| Not reused for emit | Why |
| ------------------- | --- |
| `ld-beat-assignment-compose` scoring / sinks | Heuristics and soft fixture coupling |
| `resolveBeatMaterialPlan` as emit planner | Dual planner / synthetic beats |
| Material consumption flag machines | Stateful post-association |
| `insertExpectedOutputGuidanceBeforeChecklist` | Post-render mutation |
| Global `orientation → Reflect` only | Mislabels study-bearing orientations |
| Activity-ID switch tables | Brittle, non-generic |

Reusable **ideas** (not code paths): authored JSON hierarchy; utility CSS class vocabulary; heteroscedasticity fixture as oracle.

## Lessons learned from Sprint 66

1. Fresh-input discipline (from Sprint 65) remains necessary but insufficient if association is wrong.  
2. Auditing beats against JSON beats guessing from HTML.  
3. Empty episode-plan rows are valid structurally but must not become empty learner sections.  
4. Model-before-HTML prevents renderers from inventing ownership.  
5. Rewrite boundaries beat endless in-place patches.

## Binding Sprint 67 stance

Implement HTML on the existing model. Change rules only with tests + decision log — never by reintroducing scoring.
