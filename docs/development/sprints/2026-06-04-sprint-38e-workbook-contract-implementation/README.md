# Sprint 38-E — Workbook Contract Implementation

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38e-workbook-contract-implementation/`  
**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-04) — final closure [38E-11](observations/38E-11-final-evaluation-and-sprint-closure.md)  
**Predecessor:** [Sprint 38-D — Workbook Authoring Contracts](../2026-06-04-sprint-38d-workbook-authoring-contracts/) (**CLOSED** — 38D-1 … 38D-5)  
**Trigger:** [38D-5 §11](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) — execution justified

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

**Operationalise** Sprint **38-D** workbook authoring contracts in learning-design **prompts/contracts** so `self_directed` + `page_profile: learner` workbook briefs produce **multi-genre** upstream material — not table-only activity sheets or reference notes.

**Primary success condition:**

> **Workbook PASS** + **Preservation PASS**

(report separately — never conflated)

**Primary hypothesis:**

> If DLA workbook obligations and GAM workbook genre obligations are added to the relevant learning-design prompts/contracts, then an Inflation self-study learner run will move from **EV-01 FAIL** to **workbook PASS** without regressing Design Page preservation or B4 table fidelity.

**Programme question:**

> Can we implement 38-D contracts in the live pipeline and prove workbook uplift on the Inflation anchor while holding 38-B preservation?

---

## Scope

| In scope | Out of scope (non-goals) |
|----------|---------------------------|
| Implementation target audit (38E-1) | Renderer redesign |
| DLA workbook contract in packs (38E-2) | Learner page UX redesign |
| GAM workbook genre contract in packs (38E-3) | Broad runtime refactor |
| Contract regression / fixture check (38E-4) | Prompt-size reduction |
| Inflation AFTER run + scorecard (38E-5) | Reopening 38-B preservation architecture |
| Gap analysis (38E-6) · Sprint closure (38E-7) | Sprint 39 reasoning cues |
| Sprint-local evidence under `artefacts/` | Composition-first work before upstream genres exist |
| Dual reporting: Workbook vs Preservation | Changing `app.js` without 38E-1 justification + charter amendment |

---

## Phase table

| Phase | Focus | Planned deliverable | Status |
|-------|--------|-------------------|--------|
| **38E-1** | Implementation target audit | [observations/38E-1-implementation-target-audit.md](observations/38E-1-implementation-target-audit.md) | **COMPLETE** |
| **38E-2** | DLA contract implementation | [observations/38E-2-dla-contract-implementation.md](observations/38E-2-dla-contract-implementation.md) + §5 pack | **COMPLETE** |
| **38E-3** | GAM genre contract implementation | [observations/38E-3-gam-contract-implementation.md](observations/38E-3-gam-contract-implementation.md) + §6 pack | **COMPLETE** |
| **38E-4** | Contract regression & fixture check | [observations/38E-4-contract-regression-fixture-check.md](observations/38E-4-contract-regression-fixture-check.md) | **COMPLETE** |
| **38E-5** | Inflation AFTER + scorecard | [observations/38E-5-inflation-after-scorecard.md](observations/38E-5-inflation-after-scorecard.md) + `artefacts/` | **COMPLETE** |
| **38E-6** | Remaining workbook function gap analysis | [observations/38E-6-remaining-workbook-function-gap-analysis.md](observations/38E-6-remaining-workbook-function-gap-analysis.md) | **COMPLETE** |
| **38E-7** | Sprint closure (initial) | [observations/38E-7-sprint-closure.md](observations/38E-7-sprint-closure.md) | **COMPLETE** |
| **38E-8** | DLA workbook function strengthening | [observations/38E-8-dla-workbook-function-strengthening.md](observations/38E-8-dla-workbook-function-strengthening.md) + §5 pack | **COMPLETE** |
| **38E-9** | GAM workbook function enforcement | [observations/38E-9-gam-workbook-function-enforcement.md](observations/38E-9-gam-workbook-function-enforcement.md) + §6 pack | **COMPLETE** |
| **38E-10** | Inflation AFTER re-run | [observations/38E-10-inflation-rerun-scorecard.md](observations/38E-10-inflation-rerun-scorecard.md) + `artefacts/EV-38E10-AFTER-*` | **COMPLETE** |
| **38E-11** | Final evaluation and closure | [observations/38E-11-final-evaluation-and-sprint-closure.md](observations/38E-11-final-evaluation-and-sprint-closure.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Current status

| Item | Status |
|------|--------|
| Sprint folder and charter docs | **DONE** (2026-06-04) |
| 38E-1 | **COMPLETE** (2026-06-04) |
| 38E-2 | **COMPLETE** (2026-06-04) — §5 DLA |
| 38E-3 | **COMPLETE** (2026-06-04) — §6 GAM |
| 38E-4 | **COMPLETE** (2026-06-04) |
| 38E-5 | **COMPLETE** (2026-06-04) — Workbook **FAIL**, Preservation **PASS**, Case **C** |
| 38E-6 | **COMPLETE** (2026-06-04) — [gap analysis](observations/38E-6-remaining-workbook-function-gap-analysis.md) |
| 38E-7 | **COMPLETE** (2026-06-04) — initial closure |
| 38E-8 | **COMPLETE** (2026-06-04) — §5 DLA function strengthening |
| 38E-9 | **COMPLETE** (2026-06-04) — §6 GAM function enforcement |
| 38E-10 | **COMPLETE** — Workbook **FAIL** (V-03/V-04 fixed); Preservation **PASS** |
| 38E-11 | **COMPLETE** — [final closure](observations/38E-11-final-evaluation-and-sprint-closure.md); hypothesis **partially supported**; Case **A** at 38E10 |
| **Sprint exit** | Workbook **FAIL** · Preservation **PASS** · [38E-11 §14](observations/38E-11-final-evaluation-and-sprint-closure.md) |

**Successor sprint:** [Sprint 38-F — Workbook Contract Refinement](../2026-06-04-sprint-38f-workbook-contract-refinement/) (**CHARTERED** — start **38F-1**).

---

## Key inherited findings (38-D)

| Slice | Role for 38-E |
|-------|----------------|
| [38D-1](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) | DLA-WB-01 … 19 — implement in packs (38E-2) |
| [38D-2](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) | GAM-WB-* · AP-01 invalid — implement in packs (38E-3) |
| [38D-3](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-3-canonical-workbook-fixture.md) | `CW-REF-38D3` PASS target |
| [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V-01 … V-13 · V1–V4 layers |
| [38D-5](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) | BEFORE frozen · §6 scorecard · §7 success tiers |

**38-C authority (read-only):** [38C-1 … 38C-6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/) — pedagogy model; do not redefine.

**BEFORE baseline:** `NEG-EV-01` — [38D-5 §3](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38B EV fixtures](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/).

---

## Implementation boundaries

| Rule | Detail |
|------|--------|
| **Separate DLA and GAM** | 38E-2 then 38E-3 — distinct PRs or commits where possible |
| **Dual verdict** | Always report **Workbook:** PASS/FAIL and **Preservation:** PASS/FAIL |
| **38-B frozen** | Use `LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`, compose contract — no architecture reopen |
| **`app.js`** | **No change** unless 38E-1 documents requirement + charter amended |
| **Validation** | [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5 §6](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) scorecard |
| **Composition** | Deferred until AFTER V2 Pass (multi-genre GAM) |

---

## Key documents

| Document | Role |
|----------|------|
| [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) | Phases, permissions, success criteria |
| [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) | Agent resume |
| [HANDOVER.md](HANDOVER.md) | 38-D → 38-E |
| [NOTES.md](NOTES.md) | Sprint log |
| [observations/](observations/) | Phase observations |
| [artefacts/](artefacts/) | AFTER captures (38E-5) |
| [fixtures/](fixtures/) | Links to 38-D `CW-REF-38D3` |
| [proposals/](proposals/) | Implementation PR notes |

---

## Evidence references

| Asset | Role |
|-------|------|
| EV-01 (BEFORE) | [38B fixtures](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/) |
| CW-REF-38D3 | [38D fixtures](../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/) |
| B4 gate | [38B-W3-4](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W3-4-inflation-gate-evidence.md) |
