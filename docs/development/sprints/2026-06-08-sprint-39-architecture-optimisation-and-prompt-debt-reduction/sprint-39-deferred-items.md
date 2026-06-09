# Sprint 39 — Deferred Items Register

**Date:** 2026-06-08  
**Authority:** [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md) · [sprint-39-plan.md](sprint-39-plan.md)

Sprint 39 intentionally **does not** pursue the items below. They remain part of Prism's broader capability landscape or future programmes. Deferral here is **not** a rejection of value — it is scope control after 38S architecture closure.

---

## Future Architecture Optimisation

Items that may be addressed in a **future architecture or compose sprint** after Sprint 39, still without reopening 38S ownership boundaries unless new regression evidence appears.

| ID | Item | Origin | Notes |
|----|------|--------|-------|
| ARCH-01 | **Page Phase B compose** — generalise `materials_order` from DLA / episode plan | 38S design_page audit DP-12 | Renderer fallback exists (Phase A) |
| ARCH-02 | **`activity_preamble` upstream population** — DLA emit + Page copy enforcement | 38S PAGE-04 | Compose metadata gap, not ownership violation |
| ARCH-03 | **`page-gam-materials-preserve` merge extension** — generic teaching-key overlay | 38S Phase 2C | Code backstop only |
| ARCH-04 | **GAM Wave C** — further pack compaction if sediment returns post–Wave B | 38S GAM audit | Only if probe shows regression |
| ARCH-05 | **PEC gate review** — when to inject PEL on GAM for self-study briefs | 38S 2B-b.2 audit | Requires gate policy sprint, not prompt trim |
| ARCH-06 | **DLA pack further trim** — if runtime dedupe insufficient | 38S final DLA audit | Population contract must remain authoritative |
| ARCH-07 | **Compose-before-VA general pattern** — apply to other steps if duplicated | Sprint 39 DP hygiene | Page-specific in 39 |
| ARCH-08 | **Harness render HTML supply** — RF2/RF3 warnings on proof replay | EV-38S-AFTER-4-run-log | Quality-of-proof, not architecture |

---

## Educational Quality Programme

**Explicitly deferred until after Sprint 39 optimisation.** These items concern **teaching and learning quality**, not step ownership or pipeline structure.

### Explanation and exposition

| Item | Description |
|------|-------------|
| EQ-01 | Richer concept exposition beyond ≥120w contract floor |
| EQ-02 | Criteria exposition depth on Evaluate activities |
| EQ-03 | Misconception interrupt tutoring quality |

### Worked reasoning and modelling

| Item | Description |
|------|-------------|
| EQ-04 | Expert walkthrough quality beyond GAM-PRES-08 (A1) minimum |
| EQ-05 | Worked judgement weak/strong contrast richness |
| EQ-06 | Analyse worked analytic pass pedagogic depth |

### Practice, verification, transfer

| Item | Description |
|------|-------------|
| EQ-07 | Verification checklist repair-path quality |
| EQ-08 | Transfer_prompt own-context application richness |
| EQ-09 | Guided judgement exemplar row quality |

### Evaluation and judgement

| Item | Description |
|------|-------------|
| EQ-10 | Evaluate independent judgement memo scaffold depth |
| EQ-11 | Evaluate trio integration quality (beyond structural gate) |
| EQ-12 | Household Evaluate benchmark prose quality (38I-4 A4) |

### Assessment and feedback

| Item | Description |
|------|-------------|
| EQ-13 | Assessment item quality beyond blueprint alignment |
| EQ-14 | Feedback pack pedagogic depth |
| EQ-15 | Marking rubric descriptor richness |

### Teacherly reasoning and PEL

| Item | Description |
|------|-------------|
| EQ-16 | North Star instructional-depth programme (38Q teaching architecture) |
| EQ-17 | PEL reasoning-material depth when enrichment gate active |
| EQ-18 | Teacherly reasoning exposition in materials and page overviews |
| EQ-19 | Minimum viable L3 vs rich L3 operational distinction |

### Programme framing

The educational quality programme should assume **frozen architecture** from 38S and optimised prompts from Sprint 39. It improves **what the model does within contracts**, not **who owns which step**.

---

## Visual Affordances Programme

**Explicitly deferred.** Sprint 38 established visual affordance **metadata contracts** on composed pages. Sprint 39 may dedupe VA **prompt prose** on Design Page but does **not** implement visual generation.

| ID | Item | Description |
|----|------|-------------|
| VA-01 | Activity visuals — illustrative images per activity | Image generation pipeline |
| VA-02 | Diagrams — concept/process diagrams in learner materials | Asset authoring |
| VA-03 | Visual learning support — icons, affordance cues in render | Renderer enhancement |
| VA-04 | Visual affordance generation — automated image brief → asset | Sprint 38 charter scope, not 39 |
| VA-05 | `pedagogical_added_value` field population quality | Upstream DLA + compose |
| VA-06 | VA metadata placement — `sections[]` vs page-root normalisation | Partial Phase A mitigation only |

---

## Future Artefact Pathways

Prism supports multiple artefact types. Sprint 39 **inventories** these; it does **not** implement or prioritise them.

| Pathway | Artefact(s) | Typical step(s) | Sprint 39 status |
|---------|-------------|-----------------|------------------|
| **Slideshows** | `slide_deck` | Generate Slide Deck | Inventory only |
| **VLE / modules** | `vle_structure`, `module_map` | Generate VLE Structure; Construct Learning Sequence | Inventory only |
| **Learning objects** | `learning_object_set` | Generate Learning Object Set | Inventory only |
| **Assessment items** | `assessment_items`, `mcq_items` | Generate Assessment Items | Inventory only; feeds page `assessment_check` |
| **Session planning** | `learning_sequence` | Construct Learning Sequence | Inventory only; timing/order, not membership |
| **Session materials** | `session_materials` | GAM (conditional) | Lightweight cross-activity support |
| **Feedback / rubrics** | `feedback_pack`, `marking_rubric` | Design Feedback; Design Marking Rubric | Inventory only |
| **QA / validation** | QA outputs | Validate Learning Design | Meta-pathway |
| **Alternative page profiles** | `page` (facilitator, assessment) | Design Page | Supported; self-study learner profile is current priority |

### Strategic note

These pathways remain **part of Prism's broader capability landscape**. Current product development priority is:

1. High-quality **self-study** learning materials (workbook contract path)
2. High-quality **workshop** learning materials (facilitated delivery)

Slideshow, module packaging, and alternative LO delivery are **not current roadmap priorities** following Sprint 39.

---

## Items explicitly not deferred to Sprint 39 (already settled at 38S)

Do not list these as Sprint 39 backlog — they are **closed**:

- Episode Plan V1 implementation
- DLA population-only contract
- PF-11 remediation architecture
- GAM realisation contract (GAM-PRES)
- Page compose/render ownership
- Page Rendering Phase A
- GAM Cleanup Wave A (pack)
- Workbook contract validators (baseline)

---

## How to use this register

| Audience | Use |
|----------|-----|
| Sprint 39 implementers | **Do not** pull items from this register into Sprint 39 without charter amendment |
| Sprint 40+ planners | Educational quality programme should start from EQ-* items |
| Architecture reviewers | ARCH-* items require evidence of regression or explicit new sprint charter |
| Product | VA-* and Future Artefact Pathways inform long-term capability, not Sprint 39 delivery |

---

*End of Sprint 39 deferred items register.*
