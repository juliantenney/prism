# Current Implementation State — Sprint 58 (closed)

**Snapshot date:** 2026-07-14 (sprint close)  
**Closure:** [../SPRINT-58-CLOSURE.md](../SPRINT-58-CLOSURE.md)

---

## Implemented in codebase

| Component | Path | Notes |
| --------- | ---- | ----- |
| Page shell create | `lib/page-shell-create.js` | EP deterministic shell — **keep** |
| DLA enrich (deterministic) | `lib/page-dla-enrich.js` | Partial validator on capture path |
| GAM enrich (deterministic) | `lib/page-gam-enrich.js` | Partial validator on capture path |
| DLA contract | `lib/ld-dla-page-enrich-contract.js` | Partial output contract active |
| GAM contract | `lib/ld-gam-page-enrich-contract.js` | Partial output contract active |
| Design Page partial contract | `lib/ld-design-page-partial-contract.js` | Canonical when `partialPageOutputs: true` |
| Design Page domain §13 | `domain-learning-design-step-patterns.md` §13 | `page_synthesis`-first; compose rollback/legacy-only in seed |
| Design Page compose contract | `lib/ld-design-page-compose-contract.js` | Rollback / legacy only at runtime |
| Render normalize | `lib/page-render-normalize.js` | Adapter — keep until renderer sprint |
| Partial validation routing | `app.js` | Step-identity via `validatePartialPageCaptureForStep` |
| v2 gate | `isPageEnrichmentV2WorkflowEnabled` | Workflow-config + heuristic |
| Partial gate | `isPartialPageOutputWorkflowEnabled` | Requires v2 + `partialPageOutputs` |
| Workflow flag merge | `resolveWorkflowForUpstreamArtefacts` | Explicit / persisted / run-mode gather merge |
| No-injection gate | `shouldInjectUpstreamCaptureIntoPrompt` | Active for post-EP partial stages |
| Assembly | `lib/page-vnext-assemble.js` | Deterministic merge — **keep** |
| Render assembly hook | `resolvePageForRenderOrAssembly` | Assembles before render in partial mode |
| Compose closure | `applyPageCompositionValidationForCapturedPage` | Gated off for partial post-EP captures |

---

## Assessment partial scope

| Canonical step ID | Assembly stage | Status |
| ----------------- | -------------- | ------ |
| `step_design_assessment` | `assessment_design` | Partial path implemented |
| `step_generate_assessment_items` | `assessment_items` | Partial path implemented |

---

## Close-out test suites

- `tests/sprint-58-stabilisation-e2e.test.js`
- `tests/sprint-58-phase0-design-page-partial-gates.test.js`
- `tests/sprint-58-phase1-design-page-domain-gates.test.js`
- `tests/sprint-58-flag-preservation-gates.test.js`
- `tests/page-vnext-assemble.test.js`
- `tests/page-partial-capture-validate.test.js`
- `tests/page-prompt-no-upstream-injection.test.js`

---

## Known limitations (intentional at close)

- No API artefact passing; manual Copilot paste remains.
- No runtime LLM reconciliation, repair, or merge.
- `sections[]` optional dual-read; renderer still legacy-shaped in places.
- Rollback and legacy compose paths intentionally retained.
- Assessment and instructional richness remain human-reviewed / deferred.
