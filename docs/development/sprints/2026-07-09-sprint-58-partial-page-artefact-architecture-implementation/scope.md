# Sprint 58 — Scope

## In scope

### Prompts and contracts

- Rewrite `lib/ld-dla-page-enrich-contract.js` for partial DLA output
- Rewrite `lib/ld-gam-page-enrich-contract.js` for partial GAM output
- Rewrite LS/DP authoring briefs in `app.js`
- Update `buildWorkflowStepInstructions` post-EP runner contracts
- Remove/disable upstream JSON embed sections for post-EP steps

### Binding and prompt assembly

- `shouldInjectUpstreamCaptureIntoPrompt` gate
- Suppress verbatim capture injection in `buildWorkflowStepInstructions` (~26967–27026)
- Skip embed in `applyEpisodePlanDlaPopulationPromptBlockToDraft`, `applyGamPageEnrichPromptBlockToDraft`
- Retain binding metadata on workflow steps for future UI; no body injection

### Capture and validation

- Partial validators: DLA, GAM, LS, DP
- Update `validateStrictJsonWorkflowRunStepCapture` paths
- Gate `applyPageCompositionValidationForCapturedPage` off for partial post-EP captures
- Stage-subset validation on paste

### Assembly

- New `lib/page-vnext-assemble.js`
- Merge by `activity_id` and `material_id`
- Assembly order: EP → DLA → GAM → LS → DP
- `resolvePageForRenderOrAssembly` integration

### UI (minimal)

- `runStepOutput` label/help text updates
- Runner summary note: paste per step; do not paste into downstream prompts

### Tests

- `tests/page-vnext-assemble.test.js` (new)
- `tests/page-partial-capture-validate.test.js` (new)
- `tests/page-prompt-no-upstream-injection.test.js` (new)
- Updates to `page-*-enrich.test.js`
- Legacy regression tests with v2/partial flags off

### Documentation

- ADR, architecture summary, ownership model (this sprint folder)
- Update 56F `progressive-enrichment-architecture.md` supersession note (link to ADR only)

---

## Out of scope

| Item | Reason |
| ---- | ------ |
| Instructional-budget research | Closed in 57A |
| API integration | Explicit constraint |
| LLM reconciliation / repair merge | Explicit constraint |
| Full-page enrich-in-place (post-EP) | Abandoned architecture |
| Schema `2.0.0` changes | Frozen unless ADR amendment |
| Assessment design/items stages | Future; stub assembly slots only |
| `finalise_page` | Future sprint |
| Automated Copilot paste | Manual paste workflow retained |

---

## Upstream of Episode Plan — unchanged

- Learning Outcomes, Knowledge Model, Learning Content prompts
- Deterministic Episode Plan shell derive (`deriveDesignEpisodePlanCaptureJson`)
- Strict JSON contracts for upstream artefacts
