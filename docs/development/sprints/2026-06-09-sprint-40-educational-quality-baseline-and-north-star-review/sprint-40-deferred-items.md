# Sprint 40 — Deferred Items Register

**Date:** 2026-06-09  
**Authority:** [38S-architecture-closure-note.md](../2026-06-06-sprint-38s-episode-plan-v1-implementation/phase-3/38S-architecture-closure-note.md) · [sprint-39-closure-note.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-closure-note.md) · [sprint-40-plan.md](sprint-40-plan.md)

Sprint 40 intentionally **does not** pursue the items below. Deferral is **scope control** for a baseline-and-review sprint. Deferred items may be addressed in **successor educational quality implementation sprints** after Sprint 40 priorities are published.

---

## Architecture Deferred

Items that remain part of Prism's architecture backlog. Sprint 40 **must not** implement these. Any item that appears to require ownership change belongs here — not in Sprint 40 gap fixes.

| ID | Item | Origin | Notes |
|----|------|--------|-------|
| ARCH-01 | **Page Phase B compose** — generalise `materials_order` from DLA / episode plan | 38S design_page audit DP-12 | Compose metadata; not quality prose |
| ARCH-02 | **`activity_preamble` upstream population** — DLA emit + Page copy enforcement | 38S PAGE-04 | Population gap, not exposition quality alone |
| ARCH-03 | **`page-gam-materials-preserve` merge extension** | 38S Phase 2C | Code backstop |
| ARCH-04 | **GAM Wave C** — further pack compaction | 38S GAM audit | Post–Sprint 39 Wave B |
| ARCH-05 | **PEC gate review** — when to inject PEL on self-study vs workshop briefs | 38S 2B-b audit | Policy sprint; affects benchmark interpretation |
| ARCH-06 | **DLA combined optimisation** — pack IFP trim + bounded runtime dedupe | 38S final DLA audit · Sprint 39 OPTION B | Population contract must remain authoritative |
| ARCH-07 | **Compose-before-VA general pattern** | Sprint 39 DP hygiene | Page-specific in 39 |
| ARCH-08 | **Harness render HTML supply** — RF2/RF3 warnings on proof replay | EV-38S-AFTER-4-run-log | Quality-of-proof; note in benchmark suite |
| ARCH-09 | **`app.js` technical architecture review** | Platform maintenance | Monolith structure; not educational quality |

**Sprint 40 action:** Record architecture-related observations in gap analysis as **deferred architecture candidates** — do not conflate with educational quality priorities unless explicitly tagged.

---

## Educational Quality Deferred (Implementation)

Sprint 40 **documents** quality gaps and **prioritises** future work. It does **not** implement improvements.

### North Star implementation

| Item | Description | Sprint 40 status |
|------|-------------|----------------|
| EQ-IMP-01 | Implement North Star v2 criteria in prompts or contracts | **Deferred** — priorities only in 40S-4 |
| EQ-IMP-02 | Prompt rewrites to improve exposition, worked examples, transfer | **Deferred** |
| EQ-IMP-03 | Contract floor changes (GAM-PRES, workbook, DLA OUTPUT CONTRACT) | **Deferred** — architecture-sensitive |
| EQ-IMP-04 | New validators for educational quality (beyond structural gates) | **Deferred** |
| EQ-IMP-05 | Exemplar-driven generation programmes | **Deferred** |

### PEL and teacherly reasoning

| Item | Description |
|------|-------------|
| EQ-PEL-01 | PEL expansion beyond current OUTPUT CONTRACT fields |
| EQ-PEL-02 | Teacherly reasoning implementation in materials and page overviews |
| EQ-PEL-03 | PEL reasoning-material depth when enrichment gate active |
| EQ-PEL-04 | Minimum viable L3 vs rich L3 operational distinction in prompts |

### Thematic areas (from Sprint 39 EQ register — implementation deferred)

| ID | Theme |
|----|-------|
| EQ-01–03 | Explanation and exposition; misconception interrupts |
| EQ-04–06 | Worked reasoning and modelling |
| EQ-07–09 | Practice, verification, transfer |
| EQ-10–12 | Evaluation and judgement |
| EQ-13–15 | Assessment and feedback |
| EQ-16–19 | North Star instructional depth; PEL; L3 distinction |

**Programme framing:** Successor sprints should assume **frozen architecture** (38S) and **optimised prompts** (39). Sprint 40 priorities (`40S-4`) become the authoritative backlog for implementation ordering.

---

## Visual Affordances Deferred

Sprint 40 may **reference** VA metadata in benchmark review. It does **not** implement visual generation.

| ID | Item | Description |
|----|------|-------------|
| VA-01 | Activity visuals — illustrative images per activity | Image generation pipeline |
| VA-02 | Diagrams — concept/process diagrams in learner materials | Asset authoring |
| VA-03 | Visual learning support — icons, affordance cues in render | Renderer enhancement |
| VA-04 | Visual affordance generation — automated image brief → asset | Sprint 38 charter scope |
| VA-05 | `pedagogical_added_value` field population quality | Upstream DLA + compose |
| VA-06 | VA metadata placement normalisation | Partial Phase A mitigation only |

**Note:** Sprint 38 VA **metadata contracts** on composed pages are **implemented**. Sprint 39 deduped VA **prompt prose** on Design Page. Image generation remains deferred.

---

## Future Artefact Pathways Deferred

Prism supports multiple artefact types ([sprint-39-artefact-pathway-inventory.md](../2026-06-08-sprint-39-architecture-optimisation-and-prompt-debt-reduction/sprint-39-artefact-pathway-inventory.md)). Sprint 40 benchmarks focus on **primary materials pathway** outputs. The following remain **out of Sprint 40 scope**:

| Pathway | Artefact(s) | Sprint 40 status |
|---------|-------------|------------------|
| **Slideshow programme** | `slide_deck` | Deferred — may note in workshop benchmarks only |
| **Module / VLE packaging** | `vle_structure`, `module_map` | Deferred |
| **Learning object programme** | `learning_object_set` | Deferred |
| **Assessment / rubric enhancement** | `assessment_items`, `marking_rubric`, `feedback_pack` | Deferred beyond benchmark analysis if not in B1–B3 |
| **QA automation** | Validate Learning Design outputs | Deferred |
| **Research terminal workflows** | Research Design Page paths | Optional benchmark only (B4) |

### Strategic note

Current development priority remains:

1. High-quality **self-study** learning materials  
2. High-quality **workshop** learning materials  

Sprint 40 benchmarks align to these priorities. Other pathways stay in the capability inventory — not Sprint 40 delivery.

---

## Educational Quality Benchmark Suite (Maintenance Deferred)

Sprint 40 **defines** the initial benchmark suite. The following are deferred to future programme work:

| Item | Description |
|------|-------------|
| BENCH-01 | Automated benchmark re-run harness |
| BENCH-02 | Research Methods self-study benchmark (B4) |
| BENCH-03 | Cross-domain benchmark expansion beyond Inflation/Marx |
| BENCH-04 | Quantitative quality scoring rubric automation |
| BENCH-05 | Render-complete proof replay (RF2/RF3 HTML supply) |

---

## Items Explicitly Not Deferred to Sprint 40 (Settled)

Do not list these as Sprint 40 backlog — they are **closed**:

| Item | Closed at |
|------|-----------|
| Episode Plan V1 implementation | Sprint 38S |
| DLA population-only contract | Sprint 38S |
| PF-11 remediation architecture | Sprint 38S |
| GAM realisation contract (GAM-PRES) | Sprint 38S |
| Page compose/render ownership | Sprint 38S |
| Page Rendering Phase A | Sprint 38S |
| GAM Cleanup Wave A + Wave B | Sprint 38S / 39 |
| Design Page hygiene | Sprint 39 |
| Artefact pathway inventory | Sprint 39 |
| Body/role fidelity (`proofOk`, `roleOk`) | Sprint 38P |

---

## How to Use This Register

| Audience | Use |
|----------|-----|
| Sprint 40 implementers | **Do not** pull deferred implementation items into Sprint 40 without charter amendment |
| Gap analysis authors | Tag gaps as **quality-implementable** vs **architecture-deferred** vs **VA-deferred** |
| Sprint 41+ planners | Start from `40S-4` priorities; pull EQ-IMP and EQ-* themes as chartered |
| Architecture reviewers | ARCH-* items require separate sprint charter — not quality sprint scope |

---

*End of Sprint 40 deferred items register.*
