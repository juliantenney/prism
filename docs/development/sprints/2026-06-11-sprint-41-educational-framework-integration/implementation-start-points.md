# Sprint 41 Implementation Start Points

**Status: Sprint closed — this document records completed implementation and Sprint 42 pointers.**

---

## What was implemented

Sprint 41 applied the Educational Quality Framework through **prompt architecture**, **diagnostic tooling**, and **learner-framing contracts** — not major system redesign.

### Slices 1–4 — EQF integration

| Component | Path |
| --------- | ---- |
| EQF prompt contract | `lib/educational-quality-framework-prompt.js` |
| Runtime injection | `app.js` → `applyEducationalQualityFrameworkPromptBlockToDraft` |
| Step manifestation | `educational-quality-framework-prompt.js` (`TARGET_CANONICAL_STEP_IDS`) |
| Evaluator | `lib/educational-quality-framework-evaluator.js` |
| CLI diagnostic | `tools/evaluate-educational-quality-framework.js` |
| Benchmark helper | `tools/evaluate-sprint41-benchmarks.js` |

### Slices 5 — Learner framing pipeline

| Component | Path / symbol |
| --------- | ------------- |
| Learner-page framing gate | `shouldApplyLearnerPagePedagogicFramingScaffold` (`app.js`) |
| DLA OUTPUT CONTRACT | `buildLearnerPageDlaOutputContractOverrideBlock` |
| Mandatory framing | `evaluateLearnerPageDlaActivityFramingCoverage`, `applyLearnerPageDlaFramingValidationToCapture` |
| Design Page repair | `repairLearnerPageCompositionFromUpstream` |
| Compose contract | `lib/ld-design-page-compose-contract.js` |

### Augmentation entry point

All resolved LD step prompts flow through:

`applyWorkflowStepRuntimePromptAugmentations` → `buildWorkflowStepInstructions` / `resolveStepPromptText`

---

## Prompt entry points (unchanged architecture)

| Concern | Location |
| ------- | -------- |
| Workflow prompt assembly | `app.js` — `buildSeededStepPromptForWorkflowStep`, `resolveStepPromptText` |
| Domain step templates | `domains/learning-design/domain-learning-design-step-patterns.md` |
| PEL | `applyPedagogicEnrichmentContractScaffoldToDraft` |
| Self-directed rhetoric | `lib/ld-self-directed-rhetoric.js` |
| Episode plan population | `lib/episode-plan-dla-integration.js` |
| Page compose | `lib/ld-design-page-compose-contract.js` |

---

## Validation and diagnostics

```bash
# Single artefact
node tools/evaluate-educational-quality-framework.js tests/fixtures/page-render/marx-self-study-page.json

# Compare before/after
node tools/evaluate-educational-quality-framework.js baseline.json --compare candidate.json

# Inflation benchmark pair
node tools/evaluate-sprint41-benchmarks.js
```

**Constraint:** PRISM does not see external LLM outputs during run mode. Evaluator operates on saved JSON/HTML only.

**Recommended capture path for impact validation:** `captures/sprint-41-impact/`

---

## Benchmark workflows (validation reference)

| Workflow | Fixture | Typical EQF score |
| -------- | ------- | ----------------- |
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page.json` | 5/8 |
| Marx workshop | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | 5/8 |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | 7/8 |

---

## Sprint 42 starting point — Authorial Quality / Educational Exposition

**Do not extend EQF or framework architecture unless explicitly rescoped.**

### Likely focus

1. **Exposition prompts** — richer learner-facing prose without new schema fields
2. **Narrative flow** — inter-section and inter-activity readability on composed pages
3. **Framing readability** — preserve mandatory `activity_preamble` and cognition fields while improving natural language
4. **Publication quality** — redundancy reduction, professional instructional voice

### Files to read first

- `lib/ld-self-directed-rhetoric.js`
- `app.js` — `buildLearnerPageDlaOutputContractOverrideBlock`, `buildSelfDirectedLearnerPageActivityFramingPromptBlock`
- `tests/fixtures/page-render/marx-self-study-page.json` — structural exemplar
- `sprint-41-closure-report.md` — principal conclusion and limitations

### Regression suites to keep green

- `tests/workflow-learner-page-mandatory-framing.test.js`
- `tests/workflow-learner-page-design-page-preservation.test.js`
- `tests/workflow-learner-page-framing-delivery-mode.test.js`
- `tests/workflow-self-directed-activity-framing-adoption.test.js`

---

## Key principle (retained from Sprint 41)

Optimise for **cognitive activity**, not interface activity. The learner should think, compare, evaluate, justify, reflect, decide, and transfer.

Sprint 42 adds: optimise for **readable exposition** that carries that cognitive demand clearly.
