# Handover from Sprint 41

**Sprint 41: Educational Framework Integration — closed (implementation complete)**

Use this document as the entry point for Sprint 42 or continuation work.

---

## Sprint 41 outcome

Sprint 41 integrated the Sprint 40 Educational Quality Framework into PRISM generation and completed the learner-framing pipeline for all learner-facing pages (workshop handouts and self-study).

### Delivered

| Layer | Status |
| ----- | ------ |
| EQF prompt contract (Slices 1–2) | Complete — `lib/educational-quality-framework-prompt.js` |
| EQF evaluator (Slice 3) | Complete — `lib/educational-quality-framework-evaluator.js` |
| Diagnostics CLIs (Slice 4) | Complete — `tools/evaluate-educational-quality-framework.js` |
| Delivery-mode-independent learner framing (Slice 5) | Complete |
| Design Page preservation repair (Slice 5 follow-up) | Complete — `repairLearnerPageCompositionFromUpstream` |
| Mandatory DLA framing (Slice 5 finalisation) | Complete — per-activity preamble + cognition |

### Explicitly complete — do not reopen without rescoping

- EQF integration into prompt augmentation
- PEL/EQF learner framing for learner-facing pages
- Framework architecture (no further framework work recommended)

---

## Current architectural state

### Prompt augmentation chain (`app.js`)

Resolved step prompts pass through:

1. `applyPedagogicCognitionContractScaffoldToDraft`
2. `applyEducationalQualityFrameworkPromptBlockToDraft` — **EQF (Sprint 41)**
3. `applySelfDirectedLearnerPageStepScaffoldsToDraft` — learner-page framing, rhetoric (delivery-gated)
4. `applyLdTableFidelityContractToDraft` / `applyLdMaterialsCopyContractToDraft`
5. `applyPedagogicEnrichmentContractScaffoldToDraft` — PEL
6. `applyLdDesignPageComposeContractToDraft`
7. Episode plan, visual affordance, math, strict JSON contracts

### Learner-page framing gates

| Gate | Applies when |
| ---- | ------------ |
| `shouldApplyLearnerPagePedagogicFramingScaffold` | Learner page/handout in workflow outputs (any delivery mode) |
| `shouldApplySelfDirectedLearnerPageScaffoldBase` | Self-directed/async + learner page (GAM, rhetoric, material shape) |

### Compose and preservation

- `applyPedagogicCognitionSemanticsToComposedPage` calls `repairLearnerPageCompositionFromUpstream` for learner `page_profile`
- Framing fields merge from upstream `learning_activities`, not only `activity_materials`
- Unauthorized `activities_omitted` for output size stripped; missing activity shells restored

### DLA mandatory minimum (learner pages)

Every activity must include:

1. `activity_preamble`
2. At least one of: `reasoning_orientation`, `self_explanation_prompt`, `conceptual_contrast_prompt`, `uncertainty_tension_prompt`, `argument_structure_hint`, `transfer_or_application_task`

Capture validation: `applyLearnerPageDlaFramingValidationToCapture`

---

## Validation findings (summary)

Full reports: `sprint-41-validation-report.md`, `sprint-41-framework-impact-report.md`, `sprint-41-closure-report.md`.

### Three benchmark workflows

| Workflow | Key artefacts | EQF score (baseline fixtures) | Notes |
| -------- | ------------- | ----------------------------- | ----- |
| **Inflation workshop** | `ld-inflation-workshop-page.json` | 5/8 | Strong understanding/capability; weak independence/learning success |
| **Marx workshop** | `ld-climate-misconception-discussion-page.json` | 5/8 | Judgement/discussion structure sound; pre-41 framing inconsistent |
| **Marx self-study** | `marx-self-study-page.json` | 7/8 | Strong journey + PEL; learning success still weakest dimension |

### Principal conclusion

Educational **architecture** is functioning well. Remaining weakness is **learner-facing exposition** — prose quality, narrative flow, explanatory depth — not structure, alignment, sequencing, judgement, transfer, or metacognitive scaffolding.

---

## Known limitations

1. No automatic evaluation of external LLM outputs during workflow run
2. Sprint 41 impact captures not yet stored (`captures/sprint-41-impact/` recommended)
3. EQF evaluator is heuristic and profile-agnostic
4. Mandatory framing validated on paste; generation compliance depends on augmented prompts + model behaviour
5. Compose repair fills missing fields only — does not fix paraphrased or weak prose

---

## Recommended Sprint 42 starting point

### Theme: Authorial Quality / Educational Exposition

**Goal:** Improve how learner resources read — richer prose, explanatory depth, narrative flow, publication-ready quality — while **preserving** existing framing fields and educational structure.

### Likely investigation areas

- DLA and Design Page **exposition** prompts (not new schema fields)
- Reducing redundant/orchestral phrasing across preamble, orientation, and task
- Section-level narrative coherence on composed pages
- Workshop vs self-study voice without losing framing minimums
- Optional: readability regression fixtures (before/after prose samples)

### Do not start Sprint 42 with

- New EQF dimensions
- New workflow steps
- Renderer structural redesign
- GAM redesign (unless narrowly scoped for exposition in materials bodies)

### Key files to review first

| File | Why |
| ---- | --- |
| `lib/ld-self-directed-rhetoric.js` | Existing rhetoric and closure vocabulary |
| `app.js` — `buildLearnerPageDlaOutputContractOverrideBlock` | DLA framing contract |
| `lib/ld-design-page-compose-contract.js` | Compose preservation |
| `tests/fixtures/page-render/marx-self-study-page.json` | Strong structural exemplar — exposition baseline |
| `sprint-41-closure-report.md` | Full closure context |

### Regression test clusters (Sprint 41)

- `tests/workflow-learner-page-mandatory-framing.test.js`
- `tests/workflow-learner-page-design-page-preservation.test.js`
- `tests/workflow-learner-page-framing-delivery-mode.test.js`
- `tests/educational-quality-framework-*.test.js` (if present)
- `tests/workflow-self-directed-activity-framing-adoption.test.js`

---

## Closure artefact

**Authoritative closure:** [`sprint-41-closure-report.md`](sprint-41-closure-report.md)
