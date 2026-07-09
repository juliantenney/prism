# Sprint 58 Backlog

## Phase 1 — Gates and assembly

- [ ] `isPartialPageOutputWorkflowEnabled` + related gates
- [ ] Restore `isPageEnrichmentV2WorkflowEnabled` workflow flag
- [ ] `lib/page-vnext-assemble.js`
- [ ] `tests/page-vnext-assemble.test.js`
- [ ] Partial fixtures

## Phase 2 — Validation and capture

- [ ] Partial validators (DLA, GAM, LS, DP)
- [ ] Branch `validate*OrPageCapture` in app.js
- [ ] Gate compose closure on partial paste
- [ ] `tests/page-partial-capture-validate.test.js`

## Phase 3 — Prompts and bindings

- [ ] Rewrite DLA/GAM contracts (partial)
- [ ] Rewrite LS/DP briefs
- [ ] Update `buildWorkflowStepInstructions`
- [ ] Disable upstream embed sections
- [ ] `tests/page-prompt-no-upstream-injection.test.js`
- [ ] Update `page-*-enrich.test.js`

## Phase 4 — Render and UI

- [ ] `resolvePageForRenderOrAssembly`
- [ ] Utilities / test API assembly path
- [ ] `runStepOutput` UI copy updates
- [ ] E2E assemble → render smoke

## Phase 5 — Regression and close

- [ ] Legacy workflow regression test
- [ ] Full test suite green
- [ ] Update `context/current-implementation-state.md`
- [ ] 56F supersession link

## Deferred

- Assessment partial stages
- `finalise_page`
- Utilities "Assemble" button (optional)
- Instructional-budget experiments
