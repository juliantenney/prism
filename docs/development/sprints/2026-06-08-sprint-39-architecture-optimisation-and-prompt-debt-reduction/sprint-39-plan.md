# Sprint 39 — Architecture Optimisation and Prompt Debt Reduction

**Date:** 2026-06-08  
**Status:** **CHARTERED — not started**  
**Type:** Short architecture optimisation sprint  
**Predecessor:** [Sprint 38S — Episode Plan V1 Implementation](../2026-06-06-sprint-38s-episode-plan-v1-implementation/) (**CLOSED** — [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md))  
**Authoritative continuation:** [sprint-39-handover-pack.md](sprint-39-handover-pack.md)

---

## Executive Summary

Sprint 39 follows successful closure of Sprint 38S. That sprint delivered and validated the frozen learning-design pipeline:

```text
KM → LO → Episode Plan → DLA → GAM → Design Page → Render
```

with settled step ownership: Episode Plan **plans**, DLA **populates**, GAM **realises**, Page **composes and renders**. Harness proof remains green (`fullOk`, `proofOk`, `roleOk` on `EV-38S-AFTER-4`).

Sprint 38S also completed major pack sanitisation (DLA −48%, GAM Wave A −29.5%) and Page Rendering Phase A. **Residual debt is non-blocking prompt sediment** — duplicated preservation rules, runtime augmentation overlap, and attention competition — not missing architecture.

Sprint 39 is a **finite optimisation sprint**. It clears remaining prompt debt, refreshes the architecture inventory, and positions Prism for the subsequent **educational quality programme**. It is **not** an architecture discovery sprint. Ownership boundaries established in 38S must not be reopened.

---

## Workstream A — GAM Wave B

### Background

[GAM Wave A](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-gam-wave-a-implementation-report.md) (pack-only) reduced GAM combined prompt **22,084 → 15,712 chars** while preserving GAM-PRES-07/08/09/10. Post–Wave A, **~12.5k chars** of runtime augmentation still inject on self-directed Inflation GAM runs, with partial duplication against pack one-line LD-* refs.

### Review areas

| Area | Issue | Authority |
|------|-------|-----------|
| Pack/runtime duplication | Table + anti-catalogue rules appear in pack preamble and `LD-TABLE-FIDELITY` runtime author block | [38S-final-gam-cleanup-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-gam-cleanup-audit.md) |
| Preservation-rule duplication | `LD-MATERIALS-COPY` embedded in pack; runtime append skipped by dedup guard — verify single authoritative injection | Same |
| Runtime augmentation overlap | Reading sufficiency (~717), material voice (~1,405), timeline (~1,522) — partial restatement of GAM-PRES-08 / WB-01 | Same |
| Authority-source simplification | One runtime marker for self-study material scaffolds; pack carries refs only | Wave B plan B1 |
| Prompt competition reduction | Remove inactive PEL blocks from GAM augmentation path | Wave B plan B3 |
| PEL reasoning materials block | `buildSelfDirectedGamPelReasoningMaterialPromptBlock` conflicts PRES-08 if enabled — **rewrite with PRES-08 back-refs only if block remains in path** | [38S-phase-2b-b2-gam-reasoning-alignment-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-phase-2b-b2-gam-reasoning-alignment-audit.md) |

### Goal

Achieve **DLA-style ownership clarity** on GAM prompts: pack = contract summary + GAM-PRES authority; runtime = single authoritative LD-* bodies without semantic duplication.

### Preservation requirements (non-negotiable)

- `fullOk`, `proofOk`, `roleOk` on production chase
- GAM-PRES-07/08/09/10 semantics unchanged in meaning
- Evaluate trio + EV-GAM-FAIL-07 behaviour
- Obligation order/membership (GAM-PRES-01/02)
- Material body fidelity through GAM → Page chain
- `LD-TABLE-FIDELITY` author role for tables
- `gam-output-format.js` validators unchanged unless evidence-driven

### Out of scope for Workstream A

- GAM pack PRES compaction beyond Wave A
- PEC `workshop` gate logic changes
- North Star depth expansion
- `buildSelfDirectedGamPelReasoningMaterialPromptBlock` expansion (rewrite-or-remove only)

---

## Workstream B — design_page Hygiene

### Background

[38S-design-page-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-design-page-audit.md) found **no architecture blockers**. Design Page correctly compose/render-only. Augmented self-directed prompt ~**27k chars** (~40% duplicate sediment).

### Review areas

| ID | Issue | Class |
|----|-------|:-----:|
| DP-07 | Materials preservation triplicated: pack + notes + runner + compose + L4 embed | B |
| DP-08 | Sprint 38 VA rules inline in pack **and** ~6.6k runtime block | B |
| DP-09 | Runtime order: VA block **before** `LD-DESIGN-PAGE-COMPOSE-CONTRACT` | B |
| DP-10 | `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock()` dead code | B |
| DP-11 | PEL orientation/reasoning on non-workshop Design Page duplicates DLA OUTPUT CONTRACT | B |
| DP-17 | *Readable page* cue vs strict verbatim — residual signal competition | B |
| DP-20 | ~27k augmented prompt — attention decay risk | B |

### Goal

Reduce prompt debt and clarify authority sources **without changing ownership or compose behaviour**:

- One authoritative preserve surface (`LD-DESIGN-PAGE-COMPOSE-CONTRACT` + L4 embed)
- Pack + notes = pointers, not second essays
- Compose contract precedes VA metadata injection in runtime order
- Dead helpers removed or wired

### Explicitly deferred (not Workstream B)

| Item | Class | Reason |
|------|:-----:|--------|
| `materials_order` generalised compose | C | Page Phase B — ownership unchanged |
| `activity_preamble` upstream population | C | DLA + compose copy gap |
| `page-gam-materials-preserve` merge extension | C | Code backstop only |

---

## Workstream C — Architecture Inventory

### Purpose

Produce a **current-state inventory** of Prism learning-design artefact pathways. This is documentation only — no redesign, removal, or roadmap elevation.

### Primary pathway (current development priority)

```text
normalized_content / learning_content
  → knowledge_model
    → learning_outcomes
      → episode_plans
        → learning_activities
          → activity_materials
            → page
              → HTML render (learner / facilitator / assessment profiles)
```

### Additional pathways to document

From `domain-learning-design-step-patterns.md` and `domain-learning-design-artefacts.md`:

| Pathway | Steps (typical) | Artefact(s) | Notes |
|---------|-----------------|-------------|-------|
| **Assessment design** | Design Assessment → Generate Assessment Items | `assessment_blueprint`, `assessment_items` / `mcq_items` | Parallel to page pathway; feeds `assessment_check` on page |
| **Feedback** | Design Feedback | `feedback_pack` | Linked to assessment items |
| **Learning sequence** | Construct Learning Sequence | `learning_sequence`, `module_map` | Session/module timing; does not replace activity membership |
| **Slide deck** | Generate Slide Deck | `slide_deck` | Delivery support; complements materials |
| **VLE structure** | Generate VLE Structure | `vle_structure` | Platform-agnostic organisation |
| **Learning objects** | Generate Learning Object Set | `learning_object_set` | Interactive LO source artefact |
| **Validation / QA** | Validate Learning Design; Revise Assessment Based on QA | QA outputs | Meta-pathway |
| **Marking** | Design Marking Rubric | `marking_rubric` | Tutor-facing |
| **Visual affordances** | Runtime augmentation on Design Page | `visual_affordance_*`, `pedagogical_added_value` on page JSON | Sprint 38 programme; not current implementation priority |

### Deliverable

`sprint-39-artefact-pathway-inventory.md` (or equivalent section in handover) — tables of steps, artefacts, render hints, and relationship to primary pathway.

---

## Workstream D — Prompt Debt Reduction (cross-cutting)

Sprint 38S deferred **DLA runtime augmentation dedupe** (~17.7k runtime chars on self-directed DLA, partial duplication of pack OBLIGATION POPULATION and OUTPUT CONTRACT).

Sprint 39 may apply **bounded** DLA runtime trim **only if**:

- No population contract semantics change
- No IFP-04/05/06 removal
- `buildDlaPopulationOnlyPromptBlock` retained
- Harness green after change

This is **optional within Sprint 39** — complete GAM Wave B and design_page hygiene first.

---

## Strategic Position

Prism remains capable of supporting **multiple learning artefact types** (page, slide deck, VLE structure, learning objects, assessment items, sequence plans, rubrics).

**Current development priority:**

1. **High-quality self-study learning materials** — workbook contract, GAM-PRES realisation, Page compose/preserve
2. **High-quality workshop learning materials** — facilitated delivery_context, facilitator_moves, session materials

**Not current roadmap priorities:**

- Slideshow production programmes
- Module/VLE packaging programmes
- Visual affordance generation implementation
- Educational quality depth beyond L3 contract floors

Future artefact types remain **in scope for the platform** but are **inventory-only** in Sprint 39.

---

## Exit Criteria

Sprint 39 completes when **all** of the following are true:

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | GAM Wave B recommendations implemented | Augmented GAM char reduction measured; PRES-07..10 preserved; no new pack sections |
| 2 | design_page hygiene recommendations implemented | Probe shows reduced duplication; compose contract ordering fixed |
| 3 | Prompt debt reduced | Before/after metrics for GAM runtime + Design Page (+ optional DLA runtime) |
| 4 | Architecture inventory refreshed | `sprint-39-artefact-pathway-inventory.md` published |
| 5 | No regression in Inflation validation workflow | `ev-38s-production-pipeline-chase.mjs` `fullOk: true`; `workbook-contract-prompt-surface.test.js` pass; Inflation manual spot-check or Phase A render tests |
| 6 | Sprint 39 closure note published | Ownership boundaries unchanged; deferred items documented |

---

## Reference index

| Document | Role |
|----------|------|
| [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md) | Settled architecture |
| [38S-design-page-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-design-page-audit.md) | Workstream B authority |
| [38S-gam-wave-a-implementation-report.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-gam-wave-a-implementation-report.md) | Wave A baseline |
| [38S-final-gam-cleanup-audit.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-2/38S-final-gam-cleanup-audit.md) | Wave B specification |
| [sprint-39-handover-pack.md](sprint-39-handover-pack.md) | Continuation authority |
| [sprint-39-work-packages.md](sprint-39-work-packages.md) | Implementation packages |
| [sprint-39-deferred-items.md](sprint-39-deferred-items.md) | Out-of-scope register |

---

*End of Sprint 39 plan.*
