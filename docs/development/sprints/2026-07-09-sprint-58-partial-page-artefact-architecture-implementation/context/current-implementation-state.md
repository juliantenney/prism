# Current Implementation State — Sprint 58 Phase 5

**Snapshot date:** 2026-07-14 (stabilisation + Phase 0 Design Page partial contract)

---

## Implemented in codebase

| Component | Path | Notes |
| --------- | ---- | ----- |
| Page shell create | `lib/page-shell-create.js` | EP deterministic shell — **keep** |
| DLA enrich (deterministic) | `lib/page-dla-enrich.js` | Partial validator implemented and used in capture path |
| GAM enrich (deterministic) | `lib/page-gam-enrich.js` | Partial validator implemented and used in capture path |
| DLA contract | `lib/ld-dla-page-enrich-contract.js` | Partial output contract active |
| GAM contract | `lib/ld-gam-page-enrich-contract.js` | Partial output contract active |
| **Design Page partial contract (Phase 0)** | `lib/ld-design-page-partial-contract.js` | Injected on DP when `partialPageOutputs: true`; replaces compose contract in partial mode |
| **Design Page domain §13 (Phase 1)** | `domain-learning-design-step-patterns.md` §13 | page_synthesis-first seed; compose described as rollback/legacy only |
| Render normalize | `lib/page-render-normalize.js` | **keep** |
| v2 prompt assembly | `app.js` | Post-EP partial-mode prompt instructions active |
| **Partial validation routing** | `app.js` | Step-identity routing via `validatePartialPageCaptureForStep` |
| v2 gate | `isPageEnrichmentV2WorkflowEnabled` | Restored workflow-config gate |
| Partial gate | `isPartialPageOutputWorkflowEnabled` | Requires `pageEnrichmentV2 && partialPageOutputs` |
| **Workflow flag merge (final)** | `resolveWorkflowForUpstreamArtefacts` | Preserves Sprint 58 flags across explicit / persisted / run-mode gather |
| No-injection gate | `shouldInjectUpstreamCaptureIntoPrompt` | Active for post-EP partial stages |
| Stage detection | `isPostEpisodePlanPartialOutputStep` | Includes DLA, GAM, LS, DP, Design Assessment, Generate Assessment Items |
| Assessment partial validators | `app.js` | `validateDesignAssessmentPartialPageCapture`, `validateGenerateAssessmentItemsPartialPageCapture` |
| Assembly module | `lib/page-vnext-assemble.js` | Deterministic assembly from stored partial captures |
| Render assembly hook | `resolvePageForRenderOrAssembly` in `app.js` | Assembles before render in partial mode |
| Capture storage | `runStepOutput`, `workflowRunCapturedOutputs*` | **keep** |
| Compose closure | `applyPageCompositionValidationForCapturedPage` | Gated off for partial post-EP captures |
| Tests | `tests/page-vnext-assemble.test.js`, `tests/page-partial-capture-validate.test.js`, `tests/page-prompt-no-upstream-injection.test.js`, `tests/sprint-58-stabilisation-e2e.test.js`, `tests/sprint-58-phase0-design-page-partial-gates.test.js`, `tests/sprint-58-phase1-design-page-domain-gates.test.js`, `tests/sprint-58-flag-preservation-gates.test.js` | Sprint 58 regression + E2E + Phase 0/1 + flag-preservation gates |

---

## Implemented assessment partial scope

| Canonical step ID | Assembly stage | Status |
| --------- | ------------ |
| `step_design_assessment` | `assessment_design` | Implemented in partial path |
| `step_generate_assessment_items` | `assessment_items` | Implemented in partial path |

---

## Regression status (Phase 5)

- Targeted Sprint 58 regression:
  - `node --test tests/page-vnext-assemble.test.js tests/page-partial-capture-validate.test.js tests/page-prompt-no-upstream-injection.test.js`
  - **Pass**
- Directly affected v2 tests:
  - `node --test tests/page-dla-enrich.test.js tests/page-gam-enrich.test.js tests/page-learning-sequence-enrich.test.js tests/page-design-page-enrich.test.js tests/page-render-vnext-adapter.test.js`
  - **Pass** (one LS prompt assertion updated to match current documented wording)
- Full suite:
  - `node --test tests/*.test.js`
  - **1513 pass / 56 fail** (remaining failures are outside Sprint 58 hardening scope)

---

## Workflow UI mapping

| User term | Code |
| --------- | ---- |
| stepOutput | `data-field="runStepOutput"` |
| Capture state | `state.workflowRunCapturedOutputs` / `Raw` |
| Step identity | `step.id` on workflow step row |

---

## Known limitations (intentional)

- No API artefact passing.
- No runtime LLM reconciliation, repair, or merge.
- No `finalise_page` stage.
- Assessment partial support is limited to:
  - `step_design_assessment` → `assessment_design`
  - `step_generate_assessment_items` → `assessment_items`
- Manual Copilot paste workflow remains.
