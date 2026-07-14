# Sprint 58 — Definition of Done

Sprint 58 is **complete** (2026-07-14). Criteria below reflect close-out status.

## Architecture

- [x] ADR `ADR-partial-page-artefact-assembly.md` approved and linked from 56F/57A successors
- [x] `isPartialPageOutputWorkflowEnabled(wf)` gates partial behaviour
- [x] `isPageEnrichmentV2WorkflowEnabled(wf)` no longer unconditionally `true`
- [x] Legacy compose workflows pass existing tests with flags off

## Prompts

- [x] DLA, GAM, LS, DP Copy prompts request **partial** page artefacts only (when `partialPageOutputs` enabled)
- [x] Post-EP prompts contain **no fenced upstream page JSON** in partial mode
- [x] Post-EP prompts state: use conversation context; PRISM does not embed prior outputs
- [x] Episode Plan prompt/shell behaviour unchanged
- [x] Design Page domain §13 aligned to `page_synthesis` partial contract (Phase 1)
- [x] Run-mode resolution preserves Sprint 58 flags (final fix)

## Capture

- [x] User can paste partial JSON into each step's `runStepOutput`
- [x] Partial captures stored in `workflowRunCapturedOutputs` / `Raw` without compose mutation (partial post-EP gated)
- [x] Partial validators accept owned-field-only artefacts
- [x] Full-page validators do not reject valid partial captures (step-identity routing)

## Assembly

- [x] `assembleVNextPageFromWorkflowCaptures(wf)` produces full v2 page from EP+DLA+GAM+LS+DP captures
- [x] Activities merged by `activity_id`; materials by `material_id`
- [x] Assembly is deterministic — no LLM calls
- [x] Assembly errors are explicit (unknown `activity_id`, missing envelope)

## Render

- [x] Assembled page renders via `getPageForRender` → Utilities HTML path
- [x] Fixture-based E2E: partial captures → assemble → render smoke test passes

## Tests

- [x] `tests/page-vnext-assemble.test.js` — green
- [x] `tests/page-partial-capture-validate.test.js` — green
- [x] `tests/page-prompt-no-upstream-injection.test.js` — green
- [x] Enrich stage tests and Sprint 58 gate suites — green at close
- [x] Legacy / rollback workflow prompt tests — green
- [x] Sprint 58 stabilisation E2E + flag-preservation gates — green

## Documentation

- [x] Sprint 58 README and handover pack current
- [x] `context/current-implementation-state.md` updated at sprint close
- [x] Closure report: [SPRINT-58-CLOSURE.md](SPRINT-58-CLOSURE.md)

## Explicit non-requirements

- Copilot reliably following partial contracts on every run (human review remains)
- Numeric instructional-budget calibration
- Assessment stages fully feature-complete (stubs + partial path present; quality remains human-reviewed)
- Renderer redesign / instructional-content richness (deferred)
