# Sprint 39 — Work Packages

**Date:** 2026-06-08  
**Authority:** [sprint-39-handover-pack.md](sprint-39-handover-pack.md) · [sprint-39-plan.md](sprint-39-plan.md)

---

## Package 1 — GAM Wave B (Runtime Optimisation)

### Purpose

Reduce GAM augmented prompt sediment by consolidating runtime self-study blocks and removing inactive/duplicate PEL injection — **without** changing GAM realisation ownership or GAM-PRES contract semantics.

### Scope

| In | Out |
|----|-----|
| Merge reading sufficiency + material voice + timeline runtime markers | GAM pack §6 `promptTemplate` edits |
| Remove `buildPelReasoningContractPromptBlock` from GAM path | PEC `workshop` gate logic |
| Rewrite or remove `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | `gam-output-format.js` validator changes |
| Before/after augmented char metrics | North Star depth expansion |
| Tests + production chase | New prompt sections or contracts |

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| GAM-B1 | Audit current GAM augmentation order and char spans per block | Baseline artefact `EV-39S-GAM-RUNTIME-BASELINE.json` |
| GAM-B2 | Implement merged self-study materials marker (reading + voice + timeline bullets preserved) | Target ~500 net reduction per 38S audit |
| GAM-B3 | Remove `buildPelReasoningContractPromptBlock` from GAM augmentation | Dup of DLA OUTPUT CONTRACT pointer |
| GAM-B4 | Rewrite PEL reasoning materials block with GAM-PRES-08 back-refs **or** remove from path if gated inactive | Do not leave thinness cues (*short*, *concise*, *2–3 items*) |
| GAM-B5 | Verify `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` single injection (pack ref + runtime author) | Dedup guard behaviour unchanged |
| GAM-B6 | Post-metrics + regression run | See validation below |

### Exclusions

- Episode Plan, DLA, Design Page packs
- GAM-PRES-07/08/09/10 text changes
- Output organisation / Scope blocks
- Workflow chaining
- Pedagogy programme content

### Deliverables

| Deliverable | Location |
|-------------|----------|
| Runtime augmentation changes | `app.js` (+ possible `lib/ld-*.js` if marker extracted) |
| Before/after metrics | `artefacts/EV-39S-GAM-WAVE-B-metrics.json` |
| Implementation report | `observations/39S-1-gam-wave-b-implementation.md` (at completion) |

### Validation requirements

```bash
node --test tests/workbook-contract-prompt-surface.test.js
node --test tests/gam-output-format.test.js
node --test tests/workflow-pel-reasoning.test.js
node docs/.../ev-38s-production-pipeline-chase.mjs
```

**Assert:**

- GAM-PRES-08 referenced in material voice / merged block (no thinness conflict)
- No `short worked micro-example` in active GAM path (if reasoning block retained)
- `fullOk: true`
- Augmented GAM combined reduction ≥500 chars (conservative) or documented if lower with justification

### Completion criteria

- [ ] GAM-B1–B6 complete
- [ ] Harness green
- [ ] GAM-PRES semantics preserved (manual grep + tests)
- [ ] Evaluate pathway artefacts unchanged in proof replay
- [ ] Implementation report published

---

## Package 2 — design_page Hygiene Cleanup

### Purpose

Reduce Design Page prompt duplication and clarify runtime authority ordering — **without** changing compose ownership, verbatim preservation semantics, or Page JSON shape contracts.

### Scope

| In | Out |
|----|-----|
| Trim pack `defaultPromptNotes` + `runnerInstructions` preserve duplication | `materials_order` compose (Phase B) |
| Remove inline VA prose from pack; runtime ref only | `activity_preamble` population enforcement |
| Reorder runtime: compose contract before VA block | Episode Plan / DLA / GAM changes |
| Remove or wire dead preservation helper | Renderer changes |
| Remove PEL orientation/reasoning dup on Design Page | VA image generation |
| Probe before/after | Sprint 38 VA semantic expansion |

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| DP-B1 | Baseline probe — pack + augmented Design Page chars | `scripts/probe-38b1-design-page-prompt-size.js` |
| DP-B2 | Rewrite `defaultPromptNotes` — 5–8 lines; pointer to `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | Remove second preserve essay |
| DP-B3 | Trim `runnerInstructions.what_to_check` — preserve checklist → compose contract refs | Pack §13 |
| DP-B4 | Remove inline VISUAL AFFORDANCES / VA prose from pack template; one-line runtime ref | Keep VA emission via runtime |
| DP-B5 | Reorder `applyWorkflowStepRuntimePromptAugmentations` — compose before VA | 38S audit DP-09 |
| DP-B6 | Delete or inject `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | Currently dead code |
| DP-B7 | Remove PEL orientation/reasoning blocks from Design Page path (non-workshop) | Dedupe DLA OUTPUT CONTRACT |
| DP-B8 | Post-probe + fidelity tests | See validation |

### Exclusions

- `LD-DESIGN-PAGE-COMPOSE-CONTRACT` body semantics
- `lib/page-gam-materials-preserve.js` merge heuristics
- `lib/page-a3-materials-sequencing.js` (A3-only helper)
- Page renderer (`app.js` render path beyond augmentation order)

### Deliverables

| Deliverable | Location |
|-------------|----------|
| Pack hygiene edits | `domain-learning-design-step-patterns.md` §13 |
| Runtime reorder / dedupe | `app.js` |
| Before/after metrics | `artefacts/EV-39S-DESIGN-PAGE-HYGIENE-metrics.json` |
| Implementation report | `observations/39S-2-design-page-hygiene.md` |

### Validation requirements

```bash
node scripts/probe-38b1-design-page-prompt-size.js
node --test tests/ld-design-page-compose-contract.test.js
node --test tests/design-page-materials-fidelity.test.js
node --test tests/page-38s-phase-a-render-fixes.test.js
node docs/.../ev-38s-production-pipeline-chase.mjs
```

**Assert:**

- `LD-DESIGN-PAGE-COMPOSE-CONTRACT` still injected
- Strict verbatim / FORBIDDEN collapse language retained in pack
- VA metadata fields still achievable on composed page (contract tests)
- `fullOk: true`
- Combined pack+notes or augmented reduction documented

### Completion criteria

- [ ] DP-B1–B8 complete
- [ ] No architecture blocker introduced (ownership audit checklist pass)
- [ ] Harness green
- [ ] Implementation report published

---

## Package 3 — Architecture Inventory Refresh

### Purpose

Document the **current-state** artefact pathway landscape in Prism for engineering continuity and programme planning. Inventory only — no redesign, removal, or priority elevation of secondary pathways.

### Scope

| In | Out |
|----|-----|
| Primary LO → Page pathway documentation | Workflow redesign |
| Secondary pathway catalogue (assessment, sequence, slides, VLE, LO set, QA) | Deprecating legacy steps |
| Artefact → step → render hint mapping | Roadmap commitments for slideshows/modules |
| Relationship notes (feeds page vs parallel) | Visual affordance implementation spec |
| Visual affordance **metadata** pathway (Sprint 38) as inventory row | VA image pipeline |

### Detailed tasks

| ID | Task | Notes |
|----|------|-------|
| INV-1 | Extract canonical step list from `domain-learning-design-step-patterns.md` workflowPolicy | 19 steps |
| INV-2 | Map steps → output artefacts from pack `outputName` / artefact doc | Cross-ref `domain-learning-design-artefacts.md` |
| INV-3 | Document **primary pathway** with ownership annotations per step | EP plans / DLA populates / etc. |
| INV-4 | Document **secondary pathways** with typical workflow position | Assessment, sequence, slides, VLE, LO set |
| INV-5 | Document **render surfaces** (page HTML, slide_deck, document variants) | From renderHints |
| INV-6 | Document **Sprint 38 visual affordance** as metadata-on-page pathway | Not generation pipeline |
| INV-7 | Note **historical / optional** steps (Validate LD, Revise Assessment, Marking Rubric) | Present but not current priority |
| INV-8 | Strategic position paragraph — self-study + workshop priority | From sprint plan |

### Exclusions

- Code changes
- Prompt changes
- Removing or merging workflow steps
- Committing to future sprint scope for secondary artefacts

### Deliverables

| Deliverable | Location |
|-------------|----------|
| **Architecture inventory** | `sprint-39-artefact-pathway-inventory.md` |
| Optional cross-link | Update `domain-learning-design-artefacts.md` README pointer only if requested |

### Validation requirements

- Peer review: inventory matches `domain-learning-design-step-patterns.md` § workflowPolicy
- No step ownership statements contradict [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md)
- Primary pathway diagram present

### Completion criteria

- [ ] `sprint-39-artefact-pathway-inventory.md` published
- [ ] All INV-1–INV-8 sections present
- [ ] Secondary pathways explicitly marked **not current roadmap priority**

---

## Package 4 — DLA Runtime Trim (Optional)

### Purpose

Bounded reduction of DLA runtime augmentation duplication with pack OBLIGATION POPULATION / OUTPUT CONTRACT — **only after** Packages 1–2 are green.

### Scope

| In | Out |
|----|-----|
| Trim duplicate PEL orientation/reasoning on DLA runtime | Pack §5 template rewrites |
| Consolidate material-shape checklist with pack pointers | Population contract / merge code |
| Metrics | IFP-04/05/06 removal |

### Deliverables

- `artefacts/EV-39S-DLA-RUNTIME-TRIM-metrics.json` (if executed)
- `observations/39S-3-dla-runtime-trim.md` (if executed)

### Validation

Same harness suite + `tests/workflow-ld-episode-plan-step.test.js`

### Completion criteria

- [ ] Optional — sprint can close without this package if WS-A/B complete and harness green

---

## Package dependency graph

```text
INV (read-only) ──────────────────────────────┐
                                               ├──► Sprint 39 closure
GAM-B (WS-A) ──► design_page hygiene (WS-B) ──┤
                     │                         │
                     └──► DLA runtime trim (opt)┘
```

**Recommended order:** Baseline probes → GAM-B → DP-B → INV (parallel OK) → optional DLA trim → closure note

---

*End of Sprint 39 work packages.*
