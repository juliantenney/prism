# Sprint 89 — implementation slice 2

**Status:** Landed. Sprint remains **OPEN**. AD-005 was not redesigned.

## Deleted

- `callOpenAIForWorkflowDesign` — no remaining caller.
- `applyWorkflowDesignHeuristics` — the pass-through and the test export are gone. Create does not rewrite a generated graph because it no longer generates one.
- The Generate Assessment Items hard lock that discarded a step’s own prompt and forced an `assessment_check` page contract.
- `assessmentPolicy` (Design Assessment as the authority for item generation) from the Learning Design brief config.
- Those names from `workflowPolicy.canonicalSteps`: Generate Assessment Items, Design Assessment, Design Feedback, Validate Learning Design, Revise Assessment Based on QA, Design Marking Rubric, plus slide deck, VLE, and learning-object set entries that sat in the same obsolete list.

## Still present, and why

- `continueWorkflowDesignGeneration` is a short refusal. `handleWorkflowAnswer` still calls it if an old elicitation state is in memory. It does not call a model.
- `workflowGenerationContext.js` stays. First-class and Prompt Studio still use it for the domain list, selected-domain persistence, step-pattern catalogue, prompt-rule cache, artefact render catalogue, and prompt-refinement context. `buildWorkflowGenerationContext` is no longer called from `app.js`.
- `isWorkflowStepGenerateAssessmentItems` remains because page-partial and copy code still branches on that historical step id. It is not how Interactive or Assessment Pack is created.
- Prompt sections for those old stages may still sit in the step-pattern markdown. They are not the first-class stage list.
- `ldCreateOutputType` is still saved. S88-AD-003 stays open.
- No product-family router was added.

## Domain Pack now

The Learning Design pack still supplies prompt-factory templates and prompt rules that Interactive seeding and Expository guidance consume. It no longer states a Design Assessment authority policy, and the workflow-policy step list no longer names the old assessment-question stages.

## Checks

`npm run test:first-class`: **339 passed**.  
Focused Sprint 88 instantiation, first-slice, boundary, and the rewritten Expository topology test: **21 passed**.

Files that still call `applyWorkflowDesignHeuristics` are obsolete topology tests. They are not in the first-class gate. They fail if run, because that behaviour was removed on purpose.
