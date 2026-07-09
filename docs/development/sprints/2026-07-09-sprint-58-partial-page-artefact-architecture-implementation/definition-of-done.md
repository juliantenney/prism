# Sprint 58 — Definition of Done

Sprint 58 is complete when all criteria below are met.

## Architecture

- [ ] ADR `ADR-partial-page-artefact-assembly.md` approved and linked from 56F/57A successors
- [ ] `isPartialPageOutputWorkflowEnabled(wf)` gates partial behaviour
- [ ] `isPageEnrichmentV2WorkflowEnabled(wf)` no longer unconditionally `true`
- [ ] Legacy compose workflows pass existing tests with flags off

## Prompts

- [ ] DLA, GAM, LS, DP Copy prompts request **partial** page artefacts only
- [ ] Post-EP prompts contain **no fenced upstream page JSON**
- [ ] Post-EP prompts state: use conversation context; PRISM does not embed prior outputs
- [ ] Episode Plan prompt/shell behaviour unchanged

## Capture

- [ ] User can paste partial JSON into each step's `runStepOutput`
- [ ] Partial captures stored in `workflowRunCapturedOutputs` / `Raw` without compose mutation
- [ ] Partial validators accept owned-field-only artefacts
- [ ] Full-page validators do not reject valid partial captures

## Assembly

- [ ] `assembleVNextPageFromWorkflowCaptures(wf)` produces full v2 page from EP+DLA+GAM+LS+DP captures
- [ ] Activities merged by `activity_id`; materials by `material_id`
- [ ] Assembly is deterministic — no LLM calls
- [ ] Assembly errors are explicit (unknown `activity_id`, missing envelope)

## Render

- [ ] Assembled page renders via `getPageForRender` → Utilities HTML path
- [ ] At least one fixture-based E2E: partial captures → assemble → render smoke test passes

## Tests

- [ ] `tests/page-vnext-assemble.test.js` — green
- [ ] `tests/page-partial-capture-validate.test.js` — green
- [ ] `tests/page-prompt-no-upstream-injection.test.js` — green
- [ ] Updated `page-gam-enrich.test.js`, `page-learning-sequence-enrich.test.js`, `page-design-page-enrich.test.js` — green
- [ ] Legacy workflow unchanged test — green
- [ ] Full existing test suite — no new regressions

## Documentation

- [ ] Sprint 58 README and handover pack current
- [ ] `context/current-implementation-state.md` updated at sprint close

## Explicit non-requirements

- Copilot reliably following partial contracts on every run (human review remains)
- Numeric instructional-budget calibration
- Assessment stages fully implemented
