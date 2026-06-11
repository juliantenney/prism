# Sprint 41 File Collection

Collected for **Educational Quality Framework integration** review.

**Goal:** Identify where the Sprint 40 framework should be injected into existing prompt assembly — not redesign PRISM architecture.

**Expected first slice:** A reusable Educational Quality Framework prompt contract injected through `applyWorkflowStepRuntimePromptAugmentations` (and related runtime augmentation hooks).

**Primary focus:** learner journey, understanding, capability, judgement, independence, metacognition, learning success, progressive independence.

---

## Priority 1 — Prompt architecture

| File | Source | Notes |
|------|--------|-------|
| `app-prompt-augmentation-extract.js` | `app.js` | Extract: `buildSeededStepPromptForWorkflowStep`, `resolveStepPromptText`, `applyWorkflowStepRuntimePromptAugmentations`, `applyPedagogicEnrichmentContractScaffoldToDraft`, augment context helpers |
| `step-patterns-prompt-templates-extract.md` | `domain-learning-design-step-patterns.md` | Extract: complete Prompt Factory blocks for DLA, GAM, Design Assessment, Design Feedback, Construct Learning Sequence, Design Page |
| `domain-learning-design-prompt-rules.md` | `domains/learning-design/` | Full copy |
| `domain-learning-design-principles.md` | `domains/learning-design/` | Full copy |
| `domain-learning-design-artefacts.md` | `domains/learning-design/` | Full copy |

Full `app.js` (~1.6 MB) and full `domain-learning-design-step-patterns.md` (~214 KB) are **not** duplicated here; use repository paths when wider context is needed.

---

## Priority 2 — Runtime prompt contracts

| File | Source |
|------|--------|
| `ld-self-directed-rhetoric.js` | `lib/` |
| `episode-plan-dla-integration.js` | `lib/` |
| `episode-plan-population-contract.js` | `lib/` |
| `ld-design-page-compose-contract.js` | `lib/` |
| `gam-output-format.js` | `lib/` |

These modules are appended at runtime by `applyWorkflowStepRuntimePromptAugmentations` in `app.js`.

---

## Priority 3 — PEL / metacognition

| File | Source |
|------|--------|
| `workflow-pel-orientation.test.js` | `tests/` |
| `workflow-pel-reasoning.test.js` | `tests/` |

PEL prompt insertion and post-compose sanitization logic lives in `app.js` (see extract); tests document expected orientation and reasoning contract behaviour.

---

## Key injection point (read first)

```text
resolveStepPromptText(step)
  → applyWorkflowStepRuntimePromptAugmentations(draft, step, wf)
       → applyPedagogicCognitionContractScaffoldToDraft
       → applySelfDirectedLearnerPageStepScaffoldsToDraft
       → applyLdTableFidelityContractToDraft
       → applyLdMaterialsCopyContractToDraft
       → applyPedagogicEnrichmentContractScaffoldToDraft   ← PEL / metacognition
       → applyLdDesignPageComposeContractToDraft
       → … (visual affordance, math, JSON strict, episode plan DLA block)
```

Sprint 41 framework contract should follow the same pattern as existing `lib/*` modules and register in this chain.

---

## Framework documents (not copied — read in repo)

- `docs/educational design/framework/north-star.md`
- `docs/educational design/framework/educational-quality-framework.md`
- `docs/educational design/framework/educational-prompting-guide.md`
- `docs/educational design/framework/framework-overview.md`
- `docs/educational design/framework/sprint-40-validation-report.md`
