# app.js generation hooks (Sprint 30 reference)

**Authoritative source:** `app.js` — search symbols below; line numbers drift.

**Test exports:** `window.__PRISM_TEST_API`

---

## Brief resolution (E)

| Function | Role |
|----------|------|
| `extractWorkflowBriefExplicitFactors` | Parse goal/inputs → explicit factors |
| `applyWorkflowBriefInferenceRules` | Domain pack inference rules |
| `resolveWorkflowBriefFactors` | Merge explicit + inferred + defaults |
| `reconcileWorkflowBriefPedagogicFactors` | Pedagogic precedence, learner-resource alignment, topic |
| `applyLearnerResourceBriefDeliveryAlignment` | Self-study defaults (not classroom) |
| `reconcileFacilitatedBriefDeliveryOverrides` | Workshop/seminar restore facilitated |
| `reconcileWorkflowBriefTopicFromSource` | Placeholder topic → semantic subject |
| `isWorkflowBriefFacilitatedDeliveryIntent` | Gate facilitated vs self-directed |

---

## Topology (O) — frozen for Sprint 30

| Function | Role |
|----------|------|
| `applyWorkflowDesignHeuristics` | Step inclusion/exclusion from brief + policy |

---

## Generation scaffolds (G) — extend here for PECs

| Function | Role |
|----------|------|
| `applyWorkflowStepRuntimePromptAugmentations` | **Run** prompt parity with Factory |
| `resolveStepPromptText` | Step prompt resolution |
| `buildWorkflowStepInstructions` | Workflow run instructions |
| `applySelfDirectedLearnerPageStepScaffoldsToDraft` | OUTPUT CONTRACT, timeline alignment |
| `applyPedagogicCognitionContractScaffoldToDraft` | Sprint 28 cognition blocks |
| `buildSelfDirectedLearnerPageMaterialShapePromptBlock` | Material shape guidance |
| `buildSelfDirectedTimelineSequencingAlignmentPromptBlock` | Timeline order vs task |

**Planned (30-1):**

| Function | Role |
|----------|------|
| `resolvePedagogicEnrichmentContractIds` | Active PEC list |
| `applyPedagogicEnrichmentContractScaffoldToDraft` | Append PEC prompt blocks |

---

## Sprint 28 cognition (related, do not break)

| Function | Role |
|----------|------|
| `resolvePedagogicCognitionPackIds` | Active cognition packs |
| `resolvePedagogicCognitionContractRequirements` | DLA/GAM field contracts |
| `evaluatePedagogicCognitionContractSatisfaction` | Contract tests |
| `buildPedagogicCognitionContractPromptBlock` | Cognition prompt text |

---

## Composition (C)

| Function | Role |
|----------|------|
| `mergeSelfDirectedActivityFramingFieldsIntoPageActivities` | Preserve framing fields on page |
| `applyPedagogicCognitionSemanticsToComposedPage` | Cognition merge on compose |

**Planned:** `mergePedagogicEnrichmentFieldsIntoPageActivities`

---

## Renderer (R) — minimal Sprint 30

| Function | Role |
|----------|------|
| `utilityRenderPageSectionsForTest` | Test HTML render |
| Cognition blocks | `util-cognition*` classes (Sprint 29) |

---

## Scaffold order (when implementing PECs)

1. Base step / library prompt  
2. `applyPedagogicCognitionContractScaffoldToDraft` (if packs active)  
3. `applySelfDirectedLearnerPageStepScaffoldsToDraft` (if self-directed page)  
4. **`applyPedagogicEnrichmentContractScaffoldToDraft`** (planned)  
5. `applyWorkflowStepRuntimePromptAugmentations` wrapper

Document any order change in [`../review-log.md`](../review-log.md).
