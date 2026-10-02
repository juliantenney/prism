# Sprint 89 — implementation slice

**Status:** In progress. Not closed.  
**Authorisation:** [S89-D06](decisions.md#s89-d06--authorise-consolidation-implementation)

This slice removed the generated-workflow rewriter and closed the Create path that called a model to invent topology. Product routing for prompts now requires Interactive, Expository, or Assessment identity. It does not finish every stopping condition.

## Done

- `applyWorkflowDesignHeuristics` no longer rewrites graphs. The previous body, including `keepDesignAssessmentStep` and the nested Expository replacement, is gone. The name remains as a pass-through so older callers do not throw.
- Create no longer enters model workflow design. If the selection is not a first-class Learning Design product, the author is told to use a first-class product or a Custom workflow from Prompt Studio.
- `continueWorkflowDesignGeneration` does not call the model.
- Expository and Assessment identity for routing use `readFirstClassIdentity` (`product`, or legacy `ldCreateOutputType` mapped once). Goal text, workflow name, step-id prefix, and `expository_extent` no longer classify a workflow as Expository.
- Prompt augmentation runs the Interactive scaffold chain only when the product is Interactive. Assessment returns the stored prompt unchanged. Custom and unknown workflows get math and JSON overlays only, not Interactive Design Page contracts.

## Not done in this slice

- Learning Design pack files are unchanged, including `canonicalSteps` and `assessmentPolicy`.
- `callOpenAIForWorkflowDesign` is still defined and unused.
- Old assessment-question step names remain in the pack catalogue and in `isWorkflowStepAssessmentProducer`.
- `ldCreateOutputType` is still written on save.
- No new product-family router module. Routing is the identity helper that already existed, used at the prompt boundary.
- Outcomes Map, Course Home, and a new product were not implemented.

## Checks

Focused Sprint 88 tests plus `tests/s89-consolidation-boundary.test.js`: 19 passed.  
`npm run test:first-class`: 339 passed.

Tests outside that gate that still expect the old heuristic to rewrite a generated graph will fail if run. They describe behaviour this slice removed.
