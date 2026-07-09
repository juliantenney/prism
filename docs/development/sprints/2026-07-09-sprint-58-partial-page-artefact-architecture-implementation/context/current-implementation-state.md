# Current Implementation State — Sprint 58 Open

**Snapshot date:** 2026-07-09 (sprint open)

---

## Exists in codebase

| Component | Path | Notes |
| --------- | ---- | ----- |
| Page shell create | `lib/page-shell-create.js` | EP deterministic shell — **keep** |
| DLA enrich (deterministic) | `lib/page-dla-enrich.js` | Dev/fixture helper — **keep** |
| GAM enrich (deterministic) | `lib/page-gam-enrich.js` | Dev/fixture helper — **keep** |
| DLA contract | `lib/ld-dla-page-enrich-contract.js` | Full-page — **rewrite** |
| GAM contract | `lib/ld-gam-page-enrich-contract.js` | Full-page — **rewrite** |
| Render normalize | `lib/page-render-normalize.js` | **keep** |
| v2 prompt assembly | `app.js` | Full-page embeds — **refactor** |
| v2 always on | `isPageEnrichmentV2WorkflowEnabled` | `return true` — **fix** |
| Upstream embeds | `buildUpstream*EmbedSection*` | **disable** for partial |
| Capture storage | `runStepOutput`, `workflowRunCapturedOutputs*` | **keep** |
| Compose closure | `applyPageCompositionValidationForCapturedPage` | **gate off** partial post-EP |
| Tests | `tests/page-*-enrich.test.js` | Full-page assertions — **update** |

---

## Not implemented

| Component | Planned path |
| --------- | ------------ |
| Page assembly | `lib/page-vnext-assemble.js` |
| Partial validators | extend enrich libs or new validate lib |
| Partial workflow gate | `isPartialPageOutputWorkflowEnabled` |
| Assembly render path | `resolvePageForRenderOrAssembly` |
| No-injection tests | `tests/page-prompt-no-upstream-injection.test.js` |

---

## Uncommitted at sprint open (git)

```
M app.js
M tests/page-gam-enrich.test.js
?? tests/page-design-page-enrich.test.js
?? tests/page-learning-sequence-enrich.test.js
```

These reflect full-page v2 LS/DP work — to be revised per Sprint 58 plan.

---

## Workflow UI mapping

| User term | Code |
| --------- | ---- |
| stepOutput | `data-field="runStepOutput"` |
| Capture state | `state.workflowRunCapturedOutputs` / `Raw` |
| Step identity | `step.id` on workflow step row |

---

## Update instruction

Update this file at Sprint 58 closure with final implementation status.
