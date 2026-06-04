# Sprint 38-D — Workbook Authoring Contracts

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38d-workbook-authoring-contracts/`  
**Date:** 2026-06-04  
**Status:** **CLOSED** (planning complete — 2026-06-04) · **Implementation not started**  
**Predecessor:** [Sprint 38-C — Self-Study Workbook Pedagogy](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/) (**CLOSED** — 38C-1 … 38C-6)  
**Trigger:** [38C-6 execution recommendation](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [PLANNING-CHARTER.md](PLANNING-CHARTER.md)

---

## Sprint purpose

Translate Sprint **38-C** findings into **executable authoring contracts** so self-study workbook requests produce **workbook genres** (scenarios, worked examples, cards, checklists, consolidation) rather than **activity sheets** or **reference notes**.

**Primary hypothesis:**

> If DLA explicitly specifies workbook obligations and GAM is contractually required to author workbook genres, then Design Page can preserve and compose richer self-study workbook material **without inventing pedagogy downstream**.

**Programme question:**

> What must DLA and GAM **commit to** so a `page_profile: learner` self-study brief reliably yields workbook-grade upstream output?

This sprint assumes **38-B preservation** and **38-C pedagogy model** are correct. The gap is **enforceable upstream contracts**, not Design Page stripping.

---

## Scope

| In scope | Out of scope (non-goals) |
|----------|---------------------------|
| DLA workbook authoring contract (38D-1) | Renderer redesign |
| GAM workbook genre contract (38D-2) | Learner page UX implementation |
| Canonical self-study workbook fixture (38D-3) | Broad runtime refactor |
| Workbook validation criteria (38D-4) | Prompt-size reduction |
| Inflation before/after evaluation plan (38D-5) | Reopening Sprint 38-B preservation work |
| Contract observations and sprint-local fixtures | Sprint 39 reasoning cues |
| Inflation anchor (EV-01 before; post-contract after) | Composition-first / 38-E track (deferred) |

---

## Phase table

| Phase | Focus | Planned deliverable | Status |
|-------|--------|-------------------|--------|
| **38D-1** | DLA workbook contract | [observations/38D-1-dla-workbook-contract.md](observations/38D-1-dla-workbook-contract.md) | **COMPLETE** |
| **38D-2** | GAM workbook genre contract | [observations/38D-2-gam-workbook-genre-contract.md](observations/38D-2-gam-workbook-genre-contract.md) | **COMPLETE** |
| **38D-3** | Canonical workbook fixture | [observations/38D-3-canonical-workbook-fixture.md](observations/38D-3-canonical-workbook-fixture.md) · [fixtures/](fixtures/) (`CW-REF-38D3`) | **COMPLETE** |
| **38D-4** | Workbook validation criteria | [observations/38D-4-workbook-validation-criteria.md](observations/38D-4-workbook-validation-criteria.md) | **COMPLETE** |
| **38D-5** | Inflation before/after evaluation | [observations/38D-5-inflation-before-after-evaluation.md](observations/38D-5-inflation-before-after-evaluation.md) | **COMPLETE** |

Detail: [PLANNING-CHARTER.md](PLANNING-CHARTER.md)

---

## Current status

| Item | Status |
|------|--------|
| Sprint folder and charter docs | **DONE** (2026-06-04) |
| 38D-1 … 38D-5 | **COMPLETE** |
| Pack / prompt / runtime implementation | **Not started** — see [38D-5 §10–11](observations/38D-5-inflation-before-after-evaluation.md) |
| Inflation AFTER rerun | **Pending** implementation |

**Planning complete.** **Next programme step:** [Sprint 38-E — Workbook Contract Implementation](../2026-06-04-sprint-38e-workbook-contract-implementation/) — pack/DLA/GAM enactment + Inflation AFTER per [38D-5](observations/38D-5-inflation-before-after-evaluation.md).

---

## Key inherited findings (38-C)

| Slice | Role for 38-D |
|-------|----------------|
| [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Normative workbook model, 11 functions, PASS/FAIL (R1–R7) |
| [38C-2](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) | EV-01 **FAIL**; activity_sheet + reference_notes; origins |
| [38C-3](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) | Planning DLA requirements → **38D-1 executable contract** |
| [38C-4](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-4-gam-instructional-genres.md) | 16 genres, table-only insufficient → **38D-2 executable contract** |
| [38C-5](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) | Learner journey, E1–E17 checklist → **38D-4 / 38D-5** |
| [38C-6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) | Execution recommendation; ranked candidates |

**Inflation baseline (before):** EV-01-G **4** table types only; EV-01 workbook **FAIL** ([38C-2](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)).

**Ceiling comparators:** EV-03-G **8** types; golden workshop `activity_materials` richness ([38C-2 §7](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)).

---

## Key planning documents

| Document | Role |
|----------|------|
| [PLANNING-CHARTER.md](PLANNING-CHARTER.md) | Phases, boundaries, success criteria |
| [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) | Operational resume for agents |
| [HANDOVER.md](HANDOVER.md) | 38-C → 38-D handoff |
| [NOTES.md](NOTES.md) | Dated sprint log |
| [observations/](observations/) | Phase contract observations |
| [fixtures/](fixtures/) | Canonical workbook fixture (38D-3) |
| [artefacts/](artefacts/) | Pipeline captures for before/after (38D-5) |
| [proposals/](proposals/) | Implementation proposals when chartered |

---

## Evidence inherited from 38-B / 38-C

| Asset | Path |
|-------|------|
| EV-01 Design Page | [ev-38b4-01-design-page.json](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) |
| EV-01 GAM (same run) | [ev-38b4-01-pipeline-gam.txt](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) |
| EV-03 GAM comparator | [ev-38b4-03-inflation-gam-live.txt](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) |
| Render excerpt | [ev-38b4-01-render-excerpt.html](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-render-excerpt.html) |
| Golden workshop page | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |

---

## Programme boundaries

- **Do** build on existing `LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`, and domain `required_materials` — **workbook contracts**, not a second 38-B architecture sprint.
- **Do not** treat Design Page stripping or B4 syntax as the primary workbook fix ([38C-6 §3](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md)).
- **Do not** implement renderer UX or composition-first changes until upstream multi-genre output exists ([38C-6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) defers Candidate B).
- **Do** scope contracts to `self_directed` + `page_profile: learner` workbook briefs unless charter expands.
