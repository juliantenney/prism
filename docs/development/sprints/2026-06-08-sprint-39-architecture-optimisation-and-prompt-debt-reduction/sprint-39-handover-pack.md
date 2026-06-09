# Sprint 39 Continuation Handover

**Date:** 2026-06-08  
**Status:** **CHARTERED — not started**  
**Type:** Architecture optimisation and prompt debt reduction  
**Predecessor:** [Sprint 38S](../2026-06-06-sprint-38s-episode-plan-v1-implementation/) (**CLOSED**)  
**Authority:** [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md)  
**Sprint plan:** [sprint-39-plan.md](sprint-39-plan.md)

---

## Executive Summary

Sprint 39 is a **short, finite optimisation sprint** that completes non-blocking cleanup identified at 38S closure. Sprint 38S delivered and proved the frozen pipeline; Sprint 39 **reduces prompt sediment** and **documents current artefact pathways** without relitigating ownership.

**Four workstreams:**

1. **GAM Wave B** — runtime augmentation dedupe (reading/voice/timeline merge; inactive PEL removal)
2. **design_page hygiene** — preservation/VA dedupe; compose-before-VA runtime reorder
3. **Prompt debt reduction** — optional bounded DLA runtime trim
4. **Architecture inventory** — current-state pathway documentation

**Not in scope:** Episode Plan redesign, DLA population contract changes, GAM/Page ownership changes, workbook contract, PF-11, visual affordance implementation, educational quality work.

---

## Current Architecture State

| Layer | Status | Sprint 39 touch? |
|-------|--------|:----------------:|
| **Episode Plan V1** | **Settled / frozen** | **No** |
| **DLA population** | **Settled** — pack 13,983 chars; runtime ~17.7k augmentation audited | **Optional** runtime trim only |
| **PF-11 chain** | **Settled** — fixes in code; stale-override user mitigation | **No** |
| **GAM realisation** | **Settled** — pack 15,712 chars post–Wave A; runtime ~12.5k augmentation | **Yes** — Wave B |
| **Design Page** | **Settled** — compose/render; ~27k augmented prompt | **Yes** — hygiene |
| **Page renderer** | **Stable** — Phase A complete | **No** (unless regression) |
| **Harness** | **Green** — `EV-38S-AFTER-4` fullOk | **Must stay green** |

### Frozen pipeline

```text
KM → LO → Episode Plan → DLA → GAM → Design Page → Render
```

### Prompt size baseline (post–38S)

| Step | Pack combined | Augmented (self-directed, probe) |
|------|-------------:|--------------------------------:|
| DLA | 13,983 | ~42,190 (pre-final-runtime-trim) |
| GAM | 15,712 | ~32,692–35,349 |
| Design Page | ~11,302 | ~27,092 |

---

## Settled Architecture Decisions

**Do not reopen without new regression evidence:**

| Decision | Settlement |
|----------|------------|
| **Episode Plan ownership** | Plans archetype + beat order only. V1 schema frozen. |
| **DLA ownership** | Populates obligations from `episode_plans`. No replanning. |
| **GAM ownership** | Realises `required_materials` bodies. GAM-PRES canonical. |
| **Page ownership** | Compose/preserve only. Renderer owns HTML. |
| **Workflow chaining** | Authoritative upstream JSON; fenced capture; PF-11 guards. |
| **Workbook contract** | DLA-WB / GAM-WB / GAM-PRES co-presence. Validators complement prompts. |
| **PF-11 architecture** | `### Upstream episode_plans` block; V1 enforcement; stale-override detection. |

Any proposal that changes the above is **out of Sprint 39 charter** and requires a new design sprint.

---

## Current Workstreams

### WS-A — GAM Wave B (priority 1)

**Authority:** [38S-final-gam-cleanup-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-gam-cleanup-audit.md) § Wave B

| Step | Action | Owner |
|:----:|--------|-------|
| B1 | Merge reading sufficiency + material voice + timeline → single self-study materials marker (preserve all semantic bullets) | `app.js` runtime augmentation |
| B2 | Rewrite `buildSelfDirectedGamPelReasoningMaterialPromptBlock` → PRES-08 back-refs **or** remove from path if inactive | `app.js` |
| B3 | Remove `buildPelReasoningContractPromptBlock` from GAM augmentation path | `app.js` |
| B4 | Measure augmented GAM before/after; run regression suite | Tests + metrics artefact |

**Do not touch:** GAM pack §6 template (Wave A complete); `gam-output-format.js`; PEC gate logic.

### WS-B — design_page Hygiene (priority 2)

**Authority:** [38S-design-page-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-design-page-audit.md)

| Step | Action | Owner |
|:----:|--------|-------|
| B1 | Trim `defaultPromptNotes` + `runnerInstructions.what_to_check` → pointers to compose contract | Pack §13 |
| B2 | Remove inline Sprint 38 VA prose from pack; one-line runtime ref | Pack §13 |
| B3 | Reorder runtime: `LD-DESIGN-PAGE-COMPOSE-CONTRACT` before VA block | `app.js` |
| B4 | Delete or wire `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | `app.js` |
| B5 | Remove PEL orientation/reasoning from Design Page augmentation (workshop already gated on GAM; dedupe on Page) | `app.js` |
| B6 | Probe + fidelity tests | `scripts/probe-38b1-design-page-prompt-size.js` |

**Do not touch:** `LD-DESIGN-PAGE-COMPOSE-CONTRACT` semantics; `page-gam-materials-preserve.js` merge logic; Page Phase B compose fields.

### WS-C — Architecture Inventory (priority 3)

**Deliverable:** `sprint-39-artefact-pathway-inventory.md`

Document primary pathway + secondary pathways (assessment, sequence, slides, VLE, learning objects, visual affordance metadata). Inventory only — no redesign.

### WS-D — DLA Runtime Trim (optional, priority 4)

**Authority:** [38S-final-dla-residual-architecture-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-dla-residual-architecture-audit.md)

Bounded dedupe of runtime PEL orientation/reasoning duplication with pack OUTPUT CONTRACT. **Only if WS-A and WS-B complete with harness green.**

---

## Scope Boundaries

### In scope

- GAM runtime prompt augmentation changes (Wave B)
- Design Page pack notes trim + runtime reorder/dedupe
- Prompt size measurement artefacts
- Architecture inventory document
- Regression tests on existing harness path

### Out of scope

| Area | Reason |
|------|--------|
| Episode Plan V1 schema / derive / validation | Frozen at 38S |
| DLA population contract / OBLIGATION POPULATION pack | Frozen at 38S |
| GAM pack Wave A / GAM-PRES semantics | Frozen at 38S |
| Page compose Phase B (`materials_order`, `activity_preamble`) | Deferred compose work |
| Workflow chaining / PF-11 | Settled at 38S |
| Workbook contract / validator tightening | Evidence-driven future sprint |
| PEC `workshop` gate changes | Architecture — not optimisation |
| Visual affordance image generation | Separate programme |
| Educational quality / depth / pedagogy | Post–Sprint 39 programme |

---

## Deferred Work

See [sprint-39-deferred-items.md](sprint-39-deferred-items.md) for full register.

**Summary:**

- **Future architecture optimisation:** Page Phase B compose, GAM Wave C (pack), PEC gate review
- **Educational quality programme:** explanation, worked example, transfer, evaluation depth
- **Visual affordances programme:** activity visuals, diagrams, VA generation
- **Future artefact pathways:** slideshows, modules, alternative LO delivery — inventory only in Sprint 39

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| GAM runtime merge drops semantic bullet | Medium | Preserve bullet checklist in merged marker; prompt-surface + gam-output tests |
| PEL block removal breaks brief-specific runs | Low | Gate-aware tests; only remove dup/inactive paths |
| design_page VA reorder breaks VA emission | Medium | Sprint 38 VA contract tests; manual VA field spot-check |
| DLA runtime trim weakens population | Medium | Defer to optional WS-D; keep `buildDlaPopulationOnlyPromptBlock` |
| Stale `local_override` on user workflows | Medium | Document reseed requirement; not Sprint 39 code fix |
| Confusing optimisation with ownership change | High | Charter + closure note explicitly forbid reopening 38S decisions |

---

## Validation Requirements

### Automated (every workstream completion)

```bash
node --test tests/workbook-contract-prompt-surface.test.js
node --test tests/gam-output-format.test.js
node --test tests/ld-design-page-compose-contract.test.js
node --test tests/design-page-materials-fidelity.test.js
node --test tests/page-38s-phase-a-render-fixes.test.js
node docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/ev-38s-production-pipeline-chase.mjs
```

**Required gates:** `proofOk: true`, `roleOk: true`, `fullOk: true`

### Prompt measurement

| Step | Script / method |
|------|-----------------|
| GAM | `scripts/probe-38b1-ld-workflow-prompt-audit.js` or Wave B metrics script |
| Design Page | `scripts/probe-38b1-design-page-prompt-size.js` |
| DLA (optional) | Same LD workflow probe |

### Manual (recommended at sprint end)

- Inflation workbook LO1–LO5 spot-check: DLA copy diagnostic green; GAM types beat-aligned; Page bodies preserved
- No materials collapse on Design Page export

---

## Closure Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | GAM Wave B complete | B1–B3 implemented; augmented Δ measured |
| 2 | design_page hygiene complete | B1–B5 implemented; probe Δ measured |
| 3 | Architecture inventory published | `sprint-39-artefact-pathway-inventory.md` |
| 4 | Harness green | `fullOk: true` post-all changes |
| 5 | No ownership regression | No changes to population contract, PRES semantics, EP V1, chaining |
| 6 | Sprint 39 closure note | Published; README status CLOSED |

---

## Recommended Execution Sequence

Execute in order:

1. **Baseline probes** — capture GAM, Design Page, (optional) DLA augmented sizes before any edit
2. **GAM Wave B** — runtime only; tests after each sub-step
3. **design_page hygiene** — pack trim then runtime reorder; tests
4. **Architecture inventory** — can run in parallel with 2–3 (read-only)
5. **Optional DLA runtime trim** — only if 2–3 green
6. **Inflation spot-check** — manual or fixture replay
7. **Sprint 39 closure note** — update sprint status

---

## Files To Read First

Read in this order to resume Sprint 39:

1. **This document** — `sprint-39-handover-pack.md`
2. [sprint-39-plan.md](sprint-39-plan.md)
3. [sprint-39-work-packages.md](sprint-39-work-packages.md)
4. [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md)
5. [38S-final-gam-cleanup-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-gam-cleanup-audit.md) — Wave B spec
6. [38S-design-page-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-design-page-audit.md)
7. [38S-gam-wave-a-implementation-report.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-gam-wave-a-implementation-report.md) — Wave A baseline
8. `domains/learning-design/domain-learning-design-artefacts.md` — inventory authority
9. `domains/learning-design/domain-learning-design-step-patterns.md` — step catalogue

**Key code entry points:** `app.js` (`applyWorkflowStepRuntimePromptAugmentations`); `lib/ld-self-directed-rhetoric.js`; `lib/ld-design-page-compose-contract.js`; `lib/ld-materials-copy.js`; `lib/ld-table-fidelity.js`

---

*End of Sprint 39 continuation handover pack.*
