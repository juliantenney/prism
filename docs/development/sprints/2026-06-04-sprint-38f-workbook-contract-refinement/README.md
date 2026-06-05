# Sprint 38-F — Workbook Contract Refinement

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38f-workbook-contract-refinement/`  
**Date:** 2026-06-04  
**Status:** **CLOSED** — [38F-5](observations/38F-5-final-evaluation-and-sprint-closure.md) (2026-06-04)  
**Predecessor:** [Sprint 38-E — Workbook Contract Implementation](../2026-06-04-sprint-38e-workbook-contract-implementation/) (**CLOSED** — [38E-11](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md))  
**Trigger:** [38E-11 §12](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md) — V-01 and V-05 blockers remain after 38E-10

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

**Refine** the Sprint **38-E** workbook contracts in learning-design **prompts/contracts** so the Inflation self-study learner anchor can satisfy **V-01** (≥4 genre families, including table/reference) and **V-05** (explicit `scenario` Material) **while retaining** 38E-8/9 gains (`worked_example`, `sample_output`, `consolidation_summary`).

**Primary success condition:**

> **Workbook PASS** + **Preservation PASS**

(report separately — never conflated)

**Primary hypothesis:**

> If the workbook contracts explicitly preserve at least one table/reference family and require scenario content to be authored as a distinct `scenario` Material, then Inflation will pass [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) workbook validation without regressing preservation.

**Programme question:**

> Can minimal pack-only refinements close the last two V-rules on the Inflation anchor while holding 38-E workbook function and 38-B preservation?

---

## Scope

| In scope | Out of scope (non-goals) |
|----------|---------------------------|
| V-01 / V-05 forensic analysis (38F-1) | Design Page changes |
| Minimal DLA/GAM pack refinement — §5/§6 only (38F-2) | Renderer changes |
| Regression prompt-surface check (38F-3) | `app.js` unless 38F-1 proves need + charter amendment |
| Inflation re-run + scorecard (38F-4) | New pedagogy model |
| Sprint closure with dual verdicts (38F-5) | Reopening 38-B preservation architecture |
| New artefacts under `artefacts/` (`EV-38F-AFTER-*`) | Prompt-size work |
| Dual reporting: Workbook vs Preservation | Broad runtime refactor |
| Score against [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) / [38D-5](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) | Sprint 39 reasoning cues |

---

## Inherited evidence

| Run / ID | Workbook | Preservation | Notes for 38-F |
|----------|----------|--------------|----------------|
| **EV-01** (38-B BEFORE) | **FAIL** | **PASS** | Table-only baseline — frozen |
| **EV-38E5-AFTER** | **FAIL** | **PASS** | AP-01–04 cleared; worked/consolidation missing — [38E-5](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-5-inflation-after-scorecard.md) |
| **EV-38E10-AFTER** | **FAIL** | **PASS** | V-03/V-04/V-10 Pass; **V-01**, **V-05** Fail; worked + consolidation present — [38E-10](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) |

**Do not overwrite:** EV-01 fixtures · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` (38-E [artefacts](../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/)).

**Pack state at 38-F entry:** `domains/learning-design/domain-learning-design-step-patterns.md` §5 (38E-2 + 38E-8) and §6 (38E-3 + 38E-9).

---

## Phase table

| Phase | Focus | Planned deliverable | Status |
|-------|--------|-------------------|--------|
| **38F-1** | V-01 / V-05 forensic analysis | [observations/38F-1-v01-v05-forensic-analysis.md](observations/38F-1-v01-v05-forensic-analysis.md) | **COMPLETE** |
| **38F-2** | Minimal DLA/GAM contract refinement | [observations/38F-2-contract-refinement.md](observations/38F-2-contract-refinement.md) + pack §5/§6 | **COMPLETE** |
| **38F-3** | Regression prompt-surface check | [observations/38F-3-regression-prompt-surface-check.md](observations/38F-3-regression-prompt-surface-check.md) | **COMPLETE** |
| **38F-4** | Inflation re-run and scorecard | [observations/38F-4-inflation-after-scorecard.md](observations/38F-4-inflation-after-scorecard.md) + `artefacts/EV-38F-AFTER-*` | **COMPLETE** |
| **38F-5** | Final evaluation and sprint closure | [observations/38F-5-final-evaluation-and-sprint-closure.md](observations/38F-5-final-evaluation-and-sprint-closure.md) | **COMPLETE** |
| **38F-6** | Retrieval validation calibration (pre–38-G) | [observations/38F-6-retrieval-validation-calibration.md](observations/38F-6-retrieval-validation-calibration.md) | **COMPLETE** |
| **38F-7** | Retrieval definition and page-review setup | [observations/38F-7-retrieval-definition-and-page-review-setup.md](observations/38F-7-retrieval-definition-and-page-review-setup.md) | **COMPLETE** |
| **38F-8** | Inflation page quality review | [observations/38F-8-inflation-page-quality-review.md](observations/38F-8-inflation-page-quality-review.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Current status

| Item | Status |
|------|--------|
| Sprint folder and charter docs | **DONE** (2026-06-04) |
| 38F-1 | **COMPLETE** — [forensic analysis](observations/38F-1-v01-v05-forensic-analysis.md) |
| 38F-2 | **COMPLETE** (2026-06-04) — [contract refinement](observations/38F-2-contract-refinement.md); §5 DLA-WB-06a/18 · §6 GAM-WB-38F-01/10 |
| 38F-3 | **COMPLETE** — 12/12 tests pass |
| 38F-4 | **COMPLETE** — `EV-38F-AFTER`; Workbook **FAIL** (V-10); **V-01/V-05 Pass**; Preservation **PASS** |
| 38F-5 | **COMPLETE** — sprint **CLOSED** |
| 38F-6 … 38F-8 | **COMPLETE** — calibration + [page quality review](observations/38F-8-inflation-page-quality-review.md) |
| Proposed 38-G | **Activity Component Quality** — **not chartered** |
| Pack edits | **§5 + §6** (`domain-learning-design-step-patterns.md`) |
| Tests | `tests/workbook-contract-prompt-surface.test.js` (12 pass) |

**Exit verdicts:** Workbook **FAIL** (V-10) · Preservation **PASS** · V-01/V-05 **Pass** · 38E-8/9 **retained**

**Post-closure review:** [38F-6](observations/38F-6-retrieval-validation-calibration.md) · [38F-7](observations/38F-7-retrieval-definition-and-page-review-setup.md) · [38F-8](observations/38F-8-inflation-page-quality-review.md)

**Successor:** [Sprint 38-G — Activity Component Quality](../2026-06-04-sprint-38g-activity-component-quality/) (**CHARTERED**)

---

## Key documents

| Document | Role |
|----------|------|
| [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) | Phases, permissions, success criteria |
| [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) | Agent resume |
| [HANDOVER.md](HANDOVER.md) | 38-E → 38-F |
| [NOTES.md](NOTES.md) | Sprint log |
| [observations/](observations/) | Phase observations |
| [artefacts/](artefacts/) | AFTER captures (38F-4) |
| [fixtures/](fixtures/) | Links to 38-D / 38-E comparators |

---

## Authority (read-only)

| Slice | Role |
|-------|------|
| [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V-01 … V-13 · V1–V4 layers |
| [38D-5](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) | Scorecard · tiers · Cases A–D |
| [38E-10](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) | Last AFTER · blocker evidence |
| [38E-11](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md) | Programme handoff |

**38-C / 38-B:** Pedagogy and preservation — cite only; do not redefine.
