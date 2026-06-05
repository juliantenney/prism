# Sprint 38-G — Activity Component Quality

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38g-activity-component-quality/`  
**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-05) — [38G-6 closure](observations/38G-6-sprint-closure-and-retrospective.md) · **SIGNIFICANT SUCCESS**  
**Predecessor:** [Sprint 38-F — Workbook Contract Refinement](../2026-06-04-sprint-38f-workbook-contract-refinement/) (**CLOSED** — [38F-5](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-5-final-evaluation-and-sprint-closure.md), [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md))

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Improve **workbook quality** by strengthening the **pedagogical composition of activities** — especially:

- teaching preambles  
- learner guidance (“what to do”)  
- scenario richness  
- workload and **realistic timings**  
- self-check / verification beats  
- activity coherence and coaching voice  

**Not** a retrieval-density-only sprint. Success is a page that **teaches enough** for solo study, not only one that lists the right material types.

**Primary success condition:**

> **Professional self-study workbook PASS** (first-glance + [38C-1 R1–R7](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) + **Preservation PASS** (reported separately)

**Secondary (hold gains from 38-F):**

> Retain **V-01**, **V-05**, **38E-8/9** types (`worked_example`, `sample_output`, `consolidation_summary`, table family, `scenario` Material) on the Inflation anchor.

---

## What 38-F proved (inherited)

| Proven | Evidence |
|--------|----------|
| Workbook contracts **influence** live output | EV-01 → 38E → 38F progression |
| **V-01** fixed | Table family on `EV-38F-AFTER` |
| **V-05** fixed | `scenario` Material |
| **worked_example** retained | 38F run |
| **sample_output** retained | 38F run |
| **consolidation_summary** retained | 38F run |
| **Preservation** architecture stable | V-13 PASS |
| **Design Page** not primary cause | GAM→page fidelity when genres authored |
| **Renderer** not primary cause | Quality gaps trace to activity composition |

Detail: [38F-5](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-5-final-evaluation-and-sprint-closure.md) · [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md)

---

## Sprint outcome (closed)

| Verdict | **SIGNIFICANT SUCCESS** |
|---------|-------------------------|
| Mechanism | ACM prompt-layer approach **validated** (`EV-38G-AFTER` vs `EV-38F-AFTER`) |
| Professional workbook PASS | **Partial** — major uplift; spoiler consolidation and compose trims remain |
| Preservation | **PASS** |

Detail: [38G-6](observations/38G-6-sprint-closure-and-retrospective.md)

**Next workstream (proposed):** **38-H — Workbook Realisation Fidelity** (GAM spoiler, page material fidelity, KM-in-harness).

---

## Phase table

| Phase | Focus | Planned deliverable | Status |
|-------|--------|-------------------|--------|
| **38G-1** | First-glance workbook quality analysis | [observations/38G-1-first-glance-workbook-quality-analysis.md](observations/38G-1-first-glance-workbook-quality-analysis.md) | **COMPLETE** |
| **38G-2** | Activity component model | [observations/38G-2-activity-component-model.md](observations/38G-2-activity-component-model.md) | **COMPLETE** |
| **38G-3** | DLA/GAM implementation | [observations/38G-3-dla-gam-implementation.md](observations/38G-3-dla-gam-implementation.md) + pack §5/§6 | **COMPLETE** |
| **38G-4** | Regression + preservation review | [observations/38G-4-regression-and-preservation-review.md](observations/38G-4-regression-and-preservation-review.md) | **COMPLETE** |
| **38G-5** | ACM realisation trace | [observations/38G-5-acm-realisation-trace.md](observations/38G-5-acm-realisation-trace.md) + [artefacts/EV-38G-AFTER-*](artefacts/) | **COMPLETE** |
| **38G-6** | Sprint closure and retrospective | [observations/38G-6-sprint-closure-and-retrospective.md](observations/38G-6-sprint-closure-and-retrospective.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Current status

| Item | Status |
|------|--------|
| Sprint folder and charter docs | **DONE** (setup only — no implementation) |
| **38G-1** | **COMPLETE** — [analysis](observations/38G-1-first-glance-workbook-quality-analysis.md) |
| **38G-2** | **COMPLETE** — [model](observations/38G-2-activity-component-model.md) |
| **38G-3** | **COMPLETE** — [implementation](observations/38G-3-dla-gam-implementation.md) |
| **38G-4** | **COMPLETE** — [review](observations/38G-4-regression-and-preservation-review.md) |
| **38G-5** | **COMPLETE** — [ACM trace](observations/38G-5-acm-realisation-trace.md) + `EV-38G-AFTER` |
| **38G-6** | **COMPLETE** — [closure](observations/38G-6-sprint-closure-and-retrospective.md) |
| Pack edits | **§5/§6 updated** (38G-3) — **38G-2/3 + 38F-2** |
| Pipeline run | **`EV-38G-AFTER`** captured |

**Sprint 38-G:** **CLOSED**. See [38G-6 §9](observations/38G-6-sprint-closure-and-retrospective.md) for forward plan.

---

## Scope boundaries

| In scope | Out of scope |
|----------|----------------|
| Activity preambles, guidance, scenarios, timings, self-checks | Design Page investigation |
| DLA/GAM pack §5/§6 quality clauses | Renderer / layout sprint |
| Inflation anchor re-run (`EV-38G-AFTER`) | Preservation architecture reopening |
| Retain 38F structural rows (V-01/V-05) | Re-litigating V-01 table family |
| Regression + V-13 monitor | `app.js` unless charter amendment |
| Optional 38D V-10 scorer notes (docs) | Sprint 39 reasoning cues |

---

## Key documents

| Document | Role |
|----------|------|
| [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) | Phases, permissions, success criteria |
| [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) | Agent resume |
| [HANDOVER.md](HANDOVER.md) | 38-F → 38-G |
| [NOTES.md](NOTES.md) | Sprint log |
| [observations/](observations/) | Phase observations (TBD) |

---

## Authority (read-only)

| Programme | Role |
|-----------|------|
| [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Workbook definition · R1–R7 |
| [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | Validation rules |
| [38F-8](../2026-06-04-sprint-38f-workbook-contract-refinement/observations/38F-8-inflation-page-quality-review.md) | **Trigger** — page quality diagnosis |

**Frozen comparators (do not overwrite):** EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` ([38-F artefacts](../2026-06-04-sprint-38f-workbook-contract-refinement/artefacts/))

**Pack state (exit):** `domains/learning-design/domain-learning-design-step-patterns.md` — 38E-2/3 + 38E-8/9 + **38F-2** + **38G-3** (DLA-WB-20/21 · GAM-WB-21)
