# Implementation Plan — Sprint 58

Function-by-function plan. **No code in this document** — implementation tasks only.

---

## Phase 1 — Gates and assembly foundation

| ID | Task | Files / functions |
| -- | ---- | ----------------- |
| 1.1 | Add `isPartialPageOutputWorkflowEnabled(wf)` | `app.js` |
| 1.2 | Restore `isPageEnrichmentV2WorkflowEnabled(wf)` workflow flag | `app.js` |
| 1.3 | Add `isPostEpisodePlanPartialOutputStep(step, wf)` | `app.js` |
| 1.4 | Add `shouldInjectUpstreamCaptureIntoPrompt(step, wf)` | `app.js` |
| 1.5 | Create `lib/page-vnext-assemble.js` | `assembleVNextPageFromWorkflowCaptures`, `assembleVNextPageFromPartials`, `mergeActivitiesById`, `attachMaterialsToActivities`, `mergeAssemblyState`, `validateAssembledPageForRender` |
| 1.6 | Add `resolvePageVnextAssembleLib()` | `app.js` |
| 1.7 | Unit tests for assembly | `tests/page-vnext-assemble.test.js` |
| 1.8 | Fixture partials under `tests/fixtures/page-assemble/` | new fixtures |

---

## Phase 2 — Partial validation and capture

| ID | Task | Files / functions |
| -- | ---- | ----------------- |
| 2.1 | `validateDlaPartialPageCapture` | `lib/page-dla-enrich.js` or `lib/page-partial-capture-validate.js` |
| 2.2 | `validateGamPartialPageCapture` | `lib/page-gam-enrich.js` or shared validate lib |
| 2.3 | `validateLearningSequencePartialPageCapture` | extend `validateLearningSequenceOrPageCapture` |
| 2.4 | `validateDesignPagePartialPageCapture` | extend `validateDesignPageOrPageCapture` |
| 2.5 | Branch `validateDlaOrPageCapture`, `validateGamOrPageCapture` | `app.js` |
| 2.6 | Update `validateStrictJsonWorkflowRunStepCapture` | `app.js` — remove baseline from upstream resolve for partial |
| 2.7 | Gate `applyPageCompositionValidationForCapturedPage` in `syncWorkflowRunCapturedOutputToState` | `app.js` |
| 2.8 | Partial capture tests | `tests/page-partial-capture-validate.test.js` |

---

## Phase 3 — Prompt and binding changes

| ID | Task | Files / functions |
| -- | ---- | ----------------- |
| 3.1 | Rewrite DLA contract for partial output | `lib/ld-dla-page-enrich-contract.js` |
| 3.2 | Rewrite GAM contract for partial output | `lib/ld-gam-page-enrich-contract.js` |
| 3.3 | Rewrite `buildLearningSequenceV2CopyAuthoringBrief` | `app.js` |
| 3.4 | Rewrite `buildDesignPageV2CopyAuthoringBrief` | `app.js` |
| 3.5 | Rewrite `buildGamV2CopyMaterialAuthoringBrief`; retire count invariant embed | `app.js` |
| 3.6 | Update post-EP branches in `buildWorkflowStepInstructions` | `app.js` |
| 3.7 | Gate binding body injection (~26992–27025) | `buildWorkflowStepInstructions` |
| 3.8 | Disable embeds: `buildUpstreamPageShellEmbedSectionForDlaCopy`, `buildUpstreamDlaPageEmbedSectionForGamCopy`, `buildUpstreamGamPageEmbedSectionForLearningSequenceCopy`, `buildUpstreamLearningSequencePageEmbedSectionForDesignPageCopy` | `app.js` |
| 3.9 | Update `applyEpisodePlanDlaPopulationPromptBlockToDraft`, `applyGamPageEnrichPromptBlockToDraft` | `app.js` |
| 3.10 | No-injection tests | `tests/page-prompt-no-upstream-injection.test.js` |
| 3.11 | Update enrich tests | `page-gam-enrich.test.js`, `page-learning-sequence-enrich.test.js`, `page-design-page-enrich.test.js` |

---

## Phase 4 — Render integration and UI

| ID | Task | Files / functions |
| -- | ---- | ----------------- |
| 4.1 | `resolvePageForRenderOrAssembly(parsed, wf)` | `app.js` |
| 4.2 | Wire assembly into `handleUtilitiesGenerate` or test API | `app.js` |
| 4.3 | `readWorkflowStepCaptureByCanonicalId` helper for assembly | `app.js` |
| 4.4 | UI label/help: `runStepOutput` textarea | `app.js` ~26116–26123 |
| 4.5 | E2E smoke: partial fixtures → assemble → render | `tests/page-vnext-assemble.test.js` or extend `page-render-vnext-adapter.test.js` |
| 4.6 | Export test API helpers | `__PRISM_TEST_API` |

---

## Phase 5 — Regression and documentation

| ID | Task | Files / functions |
| -- | ---- | ----------------- |
| 5.1 | Legacy workflow test (`pageEnrichmentV2: false`) | new test |
| 5.2 | Run full `node --test tests/*.test.js` | CI manual |
| 5.3 | Update `context/current-implementation-state.md` | sprint 58 context |
| 5.4 | Supersession banner on 56F progressive-enrichment doc | link to ADR |

---

## Recommended implementation order

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
```

Within Phase 3, update contracts before disabling embeds so Copy prompts always have valid partial instructions.

---

## Out of scope (defer)

- Assessment partial stages
- `finalise_page`
- Utilities "Assemble from workflow" button (optional future)
- `estimated_learner_minutes` in DLA output
