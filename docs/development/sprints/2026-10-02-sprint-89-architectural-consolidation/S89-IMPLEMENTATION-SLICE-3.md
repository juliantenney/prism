# Sprint 89 — Implementation slice 3

**Status:** Landed. Sprint 89 remains **OPEN**. S88-AD-005 was not implemented.

## What changed

Create can no longer answer a workflow-design elicitation. `continueWorkflowDesignGeneration` and `handleWorkflowAnswer` are gone. The design-answer control is no longer wired. Nothing in current Create starts a question queue whose purpose is inventing workflow topology.

`workflowGenerationContext.js` no longer builds a model workflow-design prompt, no longer loads a `workflowPolicy` graph, and no longer exports an unused artefact-option catalogue. It still loads the domain list, selected-domain persistence, the step-pattern catalogue, the prompt-rule cache, the artefact render catalogue, prompt-refinement context, and workflow brief config used by current Create and Prompt Studio.

The Learning Design step-pattern file no longer contains the `workflowPolicy` object, or the prompt-factory sections for Design Assessment, Design Feedback, Generate Assessment Items, Validate Learning Design, Revise Assessment Based on QA, and Design Marking Rubric.

Research is not in `domains/domain-manifest.json` and not in the fallback domain list. The Research markdown files are still on disk. The running application does not load them.

New first-class saves store `product`. They do not store `ldCreateOutputType`. When an older record is normalised, a stored `product` wins. If there is no stored product, `ldCreateOutputType` is mapped once, `product` is written, and `ldCreateOutputType` is removed. `readFirstClassIdentity` still maps an un-normalised legacy record. Goal text, workflow name, and step ids do not assign a product. Custom stays without a first-class product.

## Historical assessment-step identity that remains

`isWorkflowStepGenerateAssessmentItems`, `isWorkflowStepAssessmentProducer`, and `isWorkflowStepDesignAssessment` still recognise those titles and ids.

They remain because Sprint 80 Adjustments still projects Quantity and Difficulty for a step with that identity, and page-partial code still calls them. Turning the predicates off failed 15 first-class tests in `s80-s2` and `s80-s8`. That is a current Adjustments consumer, not Assessment Pack and not Interactive diagnostic feedback.

The old prompt-factory sections for those stages are no longer in the Learning Design catalogue. A Custom step does not receive those catalogue contracts by title.

## `workflowGenerationContext.js`

| Kept | Removed |
| ---- | ------- |
| Domain list and fallback without Research | `buildWorkflowGenerationContext` |
| Selected-domain persistence | `getWorkflowPolicy` |
| Step-pattern catalogue | `extractWorkflowPolicyFromText` |
| Prompt-rule cache | `getDomainArtefactOptions` |
| Artefact render catalogue | `extractArtefactCatalogFromText` |
| Prompt Studio refinement context | |
| Workflow brief config for current Create / settings | |

## Identity

`product` is the saved first-class identity.

The Create control still uses the historical output-type value to choose which predetermined family to build. That value is not written onto the saved workflow.

Legacy shim: `readFirstClassIdentity` and `normalizeWorkflowForV1`. Used when a record still has `ldCreateOutputType` and no `product`. After normalisation, later reads use `product`.

## Research

Not a current product and not a selectable domain. No replacement was designed. The files under `domains/research/` were not deleted, so existing tests that read them as files can still open them. Runtime domain loading does not include them.

## Tests

Obsolete generated-topology tests that called `applyWorkflowDesignHeuristics` were deleted or trimmed. `s85` topology now uses the family builder. Focused boundary tests: **39 passed**. First-class gate: **339 passed, 0 failed**.

Full suite `npm run test:full`: **4214 tests, 3696 passed, 517 failed, 1 skipped**. Failures are concentrated in learner-renderer and page-render files this slice did not edit. They do not assert the removed topology generator. The suite is not green.

## Debt after this slice

| ID | Status |
| -- | ------ |
| S88-AD-001 | Resolved. The heuristic and Design Assessment authority policy are gone. Historical step predicates remain only for the Adjustments consumer above. |
| S88-AD-002 | Resolved. There is no generated-graph Expository rewriter. |
| S88-AD-003 | Resolved for saved identity. `product` is written. `ldCreateOutputType` is a legacy read, then removed on normalisation. The Create control name is unchanged. |
| S88-AD-004 | Resolved as an architecture. Nothing starts model topology design or its elicitation. Catalogue and brief-config loading remain for current products and Prompt Studio. |
| S88-AD-005 | **Open.** Not started. |
| S88-AD-006 | Resolved as a responsibility statement. The Learning Design pack supplies catalogues, brief config, and prompt material for current stages. It is not a topology policy. |

## LOC

Physical lines, same rule as the diagnostic (count `0x0A`; count a last line with no trailing newline).

| | Baseline | Slice 2 | Slice 3 | Versus baseline | Versus Slice 2 |
| - | -------: | ------: | ------: | --------------: | -------------: |
| `app.js` | 60110 | 57176 | 56593 | −3517 (−5.9%) | −583 (−1.0%) |
| Cluster | 64154 | 61220 | 60418 | −3736 (−5.8%) | −802 (−1.3%) |
| `workflowGenerationContext.js` | 1009 | 1009 | 790 | −219 (−21.7%) | −219 |
| Learning Design pack + manifest | 5192 | 5173 | 4276 | −916 (−17.6%) | −897 (−17.3%) |

Step patterns: 3824 at baseline, 2917 now.

Application JavaScript under the written exclusions (no `node_modules`, docs, tests, generated renderer bundles): **127995** lines in **222** files. The recorded Slice 2 total was **149205** in **224** files. That gap is larger than the source deleted in this slice, so the reliable Slice 3 reductions are the named files above.

No new architecture files. Temporary counting scripts were removed.

## Not done

S88-AD-005. No product registry, router, schema, or universal publisher.
