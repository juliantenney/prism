# Sprint 38-C — Self-Study Workbook Pedagogy

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38c-self-study-workbook-pedagogy/`  
**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-04) — planning complete; execution **recommended** as Sprint 38-D  
**Predecessor:** [Sprint 38-B — Learning Design Prompt Architecture](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/) (**COMPLETE** — Waves 1–3, B4 MONITORING)  
**Trigger:** [38C self-study quality review](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md) (Inflation anchor)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [PLANNING-CHARTER.md](PLANNING-CHARTER.md)

---

## Sprint purpose

Establish how PRISM Learning Design workflows produce **genuinely effective self-study workbooks** — not only structurally valid pages with preserved tables.

**Primary question:**

> How do we move from activity sheets and reference notes to self-study workbooks that support explanatory teaching, practice progression, and consolidation?

This sprint assumes **Sprint 38-B succeeded** on architecture, preservation, governance, and prompt footprint. The remaining gap is **instructional genre and workbook pedagogy**.

---

## Scope

| In scope | Out of scope (non-goals) |
|----------|---------------------------|
| Workbook pedagogy model and gap analysis | Prompt architecture consolidation (38-B territory) |
| DLA material requirements for self-study | Prompt-size / token reduction programmes |
| GAM instructional genres (scenario, worked example, cards, …) | Automation, CI probes, or new test harnesses |
| Learner experience and render implications (observation) | Runtime, pack, or `app.js` changes in planning phase |
| Evidence from Inflation and future anchors | Sprint 39 reasoning cues (still gated separately) |
| Phase charters 38C-1 … 38C-6 (planning only) | Implementation PRs (38-D execution charter) |

---

## Current status

| Item | Status |
|------|--------|
| Sprint folder and planning docs | **DONE** (2026-06-04) |
| 38C-1 Workbook pedagogy model | **COMPLETE** — [observations/38C-1-workbook-pedagogy-model.md](observations/38C-1-workbook-pedagogy-model.md) |
| 38C-2 Workbook gap analysis | **COMPLETE** — [observations/38C-2-workbook-gap-analysis.md](observations/38C-2-workbook-gap-analysis.md) |
| 38C-3 DLA workbook requirements | **COMPLETE** — [observations/38C-3-dla-workbook-requirements.md](observations/38C-3-dla-workbook-requirements.md) |
| 38C-4 GAM instructional genres | **COMPLETE** — [observations/38C-4-gam-instructional-genres.md](observations/38C-4-gam-instructional-genres.md) |
| 38C-5 Workbook experience & rendering | **COMPLETE** — [observations/38C-5-workbook-experience-rendering.md](observations/38C-5-workbook-experience-rendering.md) |
| 38C-6 Planning synthesis & execution recommendation | **COMPLETE** — [observations/38C-6-planning-synthesis-and-execution-recommendation.md](observations/38C-6-planning-synthesis-and-execution-recommendation.md) |
| **Recommended next sprint** | **38-D — Workbook Authoring Contracts** (see 38C-6 §7) |
| Implementation | **Not chartered** — await 38-D execution charter |

---

## Workstreams (planning phases)

| Phase | Focus | Observation (planned) |
|-------|--------|-------------------------|
| **38C-1** | Workbook pedagogy model | [38C-1-workbook-pedagogy-model.md](observations/38C-1-workbook-pedagogy-model.md) |
| **38C-2** | Workbook gap analysis | [38C-2-workbook-gap-analysis.md](observations/38C-2-workbook-gap-analysis.md) |
| **38C-3** | DLA workbook requirements | [38C-3-dla-workbook-requirements.md](observations/38C-3-dla-workbook-requirements.md) |
| **38C-4** | GAM instructional genres | [38C-4-gam-instructional-genres.md](observations/38C-4-gam-instructional-genres.md) |
| **38C-5** | Workbook experience and rendering | [38C-5-workbook-experience-rendering.md](observations/38C-5-workbook-experience-rendering.md) |
| **38C-6** | Planning synthesis & execution recommendation | [38C-6-planning-synthesis-and-execution-recommendation.md](observations/38C-6-planning-synthesis-and-execution-recommendation.md) |

Detail: [PLANNING-CHARTER.md](PLANNING-CHARTER.md) · Closure: [38C-6](observations/38C-6-planning-synthesis-and-execution-recommendation.md)

---

## Key planning documents

| Document | Role |
|----------|------|
| [PLANNING-CHARTER.md](PLANNING-CHARTER.md) | Phases, boundaries, success criteria (planning) |
| [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) | Concise resume for agents and humans |
| [HANDOVER.md](HANDOVER.md) | 38-B outcomes → 38-C hypotheses |
| [NOTES.md](NOTES.md) | Dated sprint log |
| [observations/](observations/) | Slice observations and evidence synthesis |
| [fixtures/](fixtures/) | Probe templates and anchor fixtures (TBD) |
| [artefacts/](artefacts/) | Captured pipeline outputs for workbook review (TBD) |
| [proposals/](proposals/) | Future execution proposals — **not** implementation yet |

---

## Evidence inherited from 38-B

| Review | Location |
|--------|----------|
| Design Page richness (GAM vs DP) | [38B/observations/38C-design-page-richness-review.md](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md) |
| Self-study resource quality | [38B/observations/38C-self-study-resource-quality-review.md](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md) |
| Inflation EV captures | [38B/fixtures/ev-38b4-01-design-page.json](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) |

---

## Programme boundaries

- **Do not** reopen Sprint 38-B Wave 3 prompt consolidation except where workbook pedagogy requires a **new** contract (future execution).
- **Do not** treat B4 table syntax as the primary 38-C problem — preservation is **working** on Inflation evidence.
- **Do** treat wrong **instructional genre** (reference sheet vs workbook) as the working hypothesis.
