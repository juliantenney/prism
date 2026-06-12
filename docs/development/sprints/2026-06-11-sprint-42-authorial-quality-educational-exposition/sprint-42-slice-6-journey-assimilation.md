# Sprint 42 Slice 6 — Journey Assimilation

**Date:** 2026-06-11  
**Type:** Prompt/composition guidance only (Design Page)  
**Basis:** [42-5 Design Page journey context investigation](./observations/42-5-design-page-journey-context-investigation.md)

---

## Summary

Adds **LD-JOURNEY-ASSIMILATION** runtime contract so Design Page composition assimilates existing upstream journey signals into wrapper prose (overview, learning purpose, knowledge summary, transitions, study tips) without mutating GAM materials or changing repair/preservation behaviour.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-journey-assimilation.js` | **New** — canonical journey assimilation prompt module (42-6) |
| `app.js` | Resolve/apply journey assimilation on Design Page compose path; test API exports |
| `lib/ld-design-page-compose-contract.js` | Reference LD-JOURNEY-ASSIMILATION in compose contract header |
| `lib/ld-self-directed-rhetoric.js` | `design_page` rider points to journey assimilation |
| `domains/learning-design/domain-learning-design-step-patterns.md` | §13 Design Page Input, `promptTemplate`, learner-profile output notes |
| `index.html` | Script tag for `ld-journey-assimilation.js` |
| `tests/prism-vm-lib-bootstrap.js` | Load journey assimilation lib in VM tests |
| `tests/ld-journey-assimilation.test.js` | **New** — unit tests |
| `tests/workflow-learner-page-journey-assimilation.test.js` | **New** — workflow prompt + preservation smoke |
| `tests/ld-design-page-compose-contract.test.js` | Assert compose contract references journey module |
| `tests/ld-self-directed-rhetoric.test.js` | Assert design_page rider references journey assimilation |

---

## Prompt changes

### Runtime — `LD-JOURNEY-ASSIMILATION-CONTRACT`

Appended to Design Page prompts when `shouldApplyLearnerPagePedagogicFramingScaffold` is true (same gate as authorial exposition). Covers:

- **Upstream signals:** `learning_content`, `knowledge_model`, `learning_outcomes`, `learning_activities`, `activity_materials`, `learning_sequence` (`transition_to_next`, `phase_type`)
- **Overview / learning purpose:** central inquiry, capability progression, anti run-sheet
- **Knowledge summary:** orienting conceptual problem when LC/KM bound; avoid glossary dump
- **Activity wrappers / transitions:** cumulative intellectual movement; LS transitions into wrapper prose only
- **Journey voice:** inquiry / investigation / judgement phrasing; avoid procedural sequencing as primary voice
- **Closure / study tips:** synthesis from GAM/DLA consolidation and transfer structures
- **Preservation boundary:** wrapper prose only; PREC-02; never mutate `activity.materials.*`

Wiring: `applyLdDesignPageComposeContractToDraft` → `applyLdJourneyAssimilationContractToDraft` after compose + authorial blocks.

### Domain pack — §13 Design Page

- **Input list:** optional `learning_content`, `knowledge_model`
- **promptTemplate Context:** optional `learning_content`, `knowledge_model`
- **learning_sequence:** timeline for order/timing **and** assimilate `transition_to_next` / `phase_type` into overview, bridges, study_tips (not materials)
- **Canonical contracts:** LD-JOURNEY-ASSIMILATION listed for learner `page_profile`
- **Learner profile output:** `knowledge_summary` when LC/KM captures provided

### Related modules (no body duplication)

- `LD-DESIGN-PAGE-COMPOSE-CONTRACT` — sibling reference only
- `LD-SELF-DIRECTED-RHETORIC` — design_page rider cross-reference

**Unchanged:** EQF, PEL, repair (`repairLearnerPageCompositionFromUpstream`), materials/table fidelity bodies, renderer.

---

## Tests added / updated

| Test file | Purpose |
| --------- | ------- |
| `tests/ld-journey-assimilation.test.js` | Module content, markers, preservation boundary |
| `tests/workflow-learner-page-journey-assimilation.test.js` | DP prompt includes journey + authorial contracts; facilitator exclusion; idempotency; domain pack strings; repair smoke |
| `tests/ld-design-page-compose-contract.test.js` | Journey sibling reference |
| `tests/ld-self-directed-rhetoric.test.js` | design_page rider |

---

## Test results

Executed locally (no workflow captures):

```
node --test tests/ld-journey-assimilation.test.js \
  tests/workflow-learner-page-journey-assimilation.test.js \
  tests/workflow-learner-page-authorial-exposition.test.js \
  tests/ld-authorial-exposition.test.js \
  tests/ld-design-page-compose-contract.test.js \
  tests/design-page-materials-fidelity.test.js \
  tests/ld-self-directed-rhetoric.test.js
→ 47 pass, 0 fail

node --test tests/workflow-educational-quality-framework-prompt.test.js \
  tests/educational-quality-framework-evaluator.test.js \
  tests/educational-quality-framework-diagnostic.test.js \
  tests/workflow-pel-reasoning.test.js \
  tests/workbook-contract-prompt-surface.test.js
→ 103 pass, 0 fail
```

---

## Implementation notes

1. **Same activation gate as 42-2** — Journey assimilation applies only on learner-page / self-study / workshop handout framing paths, not facilitator-only deliverables.
2. **Idempotent** — `assimilationAlreadyPresent` prevents duplicate blocks on re-apply.
3. **LS at compose time** — When `learning_sequence` is bound, full capture (including `transition_to_next`) is already embedded by `buildWorkflowRunStepCopyPrompt`; 42-6 instructs the model to use those fields in wrapper prose while keeping activity order/timing rules from the compose contract.
4. **LC/KM** — No new bindings or workflow wiring; when captures are already bound, prompt guidance directs assimilation into overview and `knowledge_summary`.
5. **No repair changes** — Post-compose repair still uses DLA only; journey expression is prompt-time guidance for the LLM compose step.

---

## Risks and limitations

| Risk | Mitigation / note |
| ---- | ----------------- |
| Model may still prioritise materials volume over wrapper prose | Guidance only; human review on fresh runs required |
| LC/KM not bound in some workflows | Assimilation falls back to DLA/LO/LS/GAM signals already in prompt |
| Topic drift upstream (LO/KM null) | Out of scope for 42-6; journey guidance cannot fix missing captures |
| Prompt length | Single focused module; no duplication of authorial exposition bodies |
| Over-long overview | Anti-redundancy remains in LD-AUTHORIAL-EXPOSITION |

---

## Required verdict

### 1. Journey-bearing signals now in Design Page composition guidance

| Signal | Incorporated |
| ------ | ------------ |
| Central inquiry (`learning_content`, DLA `study_orientation` / `intellectual_frame`) | Yes — overview assimilation |
| Capability progression (`learning_outcomes`) | Yes — learning purpose |
| Activity progression (DLA bridges, preambles, reasoning fields) | Yes — transitions + preserve verbatim |
| Phase / transition (`learning_sequence` `transition_to_next`, `phase_type`) | Yes — wrapper prose (not materials) |
| KM concepts / relationships | Yes — `knowledge_summary` orientation when bound |
| GAM consolidation, transfer, judgement scaffolds | Yes — closure / study tips (reference; materials still verbatim) |

### 2. Schema, workflow, or renderer changes?

**No.** Prompt template text and runtime prompt modules only. No new workflow stages, schema fields, renderer changes, EQF/PEL edits, or repair logic changes.

### 3. Preservation and Sprint 41 regression tests?

**Yes — all executed suites passed** (150 tests across journey/preservation/EQF/PEL/workbook surfaces). Materials fidelity, authorial exposition, field preservation repair, and EQF prompt tests unchanged in outcome.

---

**Human validation:** Fresh manual workflow runs required to assess learner experience improvement (explicitly out of scope for this slice).
