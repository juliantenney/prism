# Slice 38F-2 — Minimal DLA/GAM contract refinement

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38F-2  
**Authority:** [38F-1](38F-1-v01-v05-forensic-analysis.md) · [38E-8](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-8-dla-workbook-function-strengthening.md) · [38E-9](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-9-gam-workbook-function-enforcement.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)  
**Out of scope:** `app.js` · Design Page · renderer · tests · preservation modules · artefacts · pipeline run

---

## 1. Purpose

Apply **minimal pack-only** refinements from [38F-1 §7](38F-1-v01-v05-forensic-analysis.md) to close **V-01** (table/reference family) and **V-05** (explicit `scenario` Material) on the Inflation anchor while **preserving** 38E-8/9 worked-example and consolidation obligations.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38F-1](38F-1-v01-v05-forensic-analysis.md) | Break points + recommended deltas |
| [38E-10](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) | V-01/V-05 Fail evidence |
| [38E-8](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-8-dla-workbook-function-strengthening.md) | WB-08/WB-12 mandatory rows — must retain |
| [38E-9](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-9-gam-workbook-function-enforcement.md) | GAM-WB-02/06, F1–F4 — must retain |

---

## 3. Files changed

| File | Section | Change |
|------|---------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§5 only** | DLA-WB-06a, WB-18 (38F-2), output JSON co-presence, type enum, intro + `defaultPromptNotes` |
| `domains/learning-design/domain-learning-design-step-patterns.md` | **§6 only** | GAM-WB-38F-01, GAM-WB-10 (38F-2), table/scenario guidance, F5/F6, `defaultPromptNotes` |

**Not changed:** `app.js` · §13 Design Page · `lib/*` · tests · 38-E artefacts · 38-B fixtures

---

## 4. V-01 refinement

### 4.1 DLA (§5)

| Clause | Content |
|--------|---------|
| **DLA-WB-06a (38F-2)** | When `workbook_contract_applied: true`, **MUST** include ≥1 `required_materials` row with table/reference type (`classification_table`, `comparison_table`, `analysis_table`, `impact_table`, `reference_table`, `data_table`, `decision_table`, `planning_table`) on a **practice** activity (not capstone alone); learner-work columns; coexist with WB-08/WB-12 |
| **Output schema** | JSON MUST row (3): table/reference on practice activity |
| **Type enum** | Added `reference_table`, `data_table`, `decision_table`, `planning_table` |

### 4.2 GAM (§6)

| Clause | Content |
|--------|---------|
| **GAM-WB-38F-01** | When DLA lists any table/reference type → `Material: <id> (<exact type>)` with LD-TABLE-FIDELITY pipe table; empty learner judgement cells (AP-03); support material not dump; coexists with worked/consolidation Materials |
| **Material guidance** | Extended `*_table` + new table tokens; anti-dump + coexistence |
| **F6** | DLA lists table type but no pipe-table Material = FAIL |

---

## 5. V-05 refinement

### 5.1 DLA (§5)

| Clause | Content |
|--------|---------|
| **DLA-WB-18 (38F-2)** | Distinct `scenario` row when case/household/persona/dilemma language; **≥2 cases** in specification; `task_cards` cannot be sole narrative carrier; prefer `scenario` + `analysis_table` on practice activity |
| **Output schema** | JSON MUST row (4): `scenario` when session uses case language |

### 5.2 GAM (§6)

| Clause | Content |
|--------|---------|
| **GAM-WB-10 (38F-2)** | `Material: scenario` with ≥2 named cases; task_cards may reference scenario but **cannot replace** scenario Material |
| **scenario guidance** | Explicit AP-04 / task_cards-only = FAIL |
| **F5** | Cases only in task_cards when DLA listed `scenario` = FAIL |

---

## 6. 38E-8/9 preservation check

| Obligation | Preserved? | How |
|------------|------------|-----|
| **DLA-WB-08** worked_example + sample_output | **Yes** | Unchanged; output row (1) still mandatory |
| **DLA-WB-12** consolidation_summary | **Yes** | Unchanged; output row (2) still mandatory |
| **modelling_note** alternate | **Yes** | WB-08 alternate path unchanged |
| **GAM-WB-02 / F3** worked bodies | **Yes** | F3 retained; 38F-01 adds coexistence note only |
| **GAM-WB-06 / F1–F2** consolidation | **Yes** | F1–F2 retained |
| **prompt_set ≠ consolidation** | **Yes** | WB-12 / MIX-03 / F2 unchanged |
| **template/ranking ≠ worked** | **Yes** | WB-08 anti-ambiguity / MIX-04 / F4 unchanged |
| **Capstone table dump** | **Yes** | WB-16 / GAM-WB-20 unchanged |

**Co-presence rule (new):** Output schema explicitly forbids dropping rows (1)–(2) when adding (3)–(4) — addresses 38E5→38E10 trade-off.

---

## 7. Clause mapping

| Validation | DLA pack | GAM pack |
|------------|----------|----------|
| **V-01** | DLA-WB-06a · output (3) | GAM-WB-38F-01 · F6 · table guidance |
| **V-05** | DLA-WB-18 · output (4) | GAM-WB-10 · F5 · scenario guidance |
| **V-03** | WB-12 (unchanged) | GAM-WB-06 · F1–F2 (unchanged) |
| **V-04** | WB-08 (unchanged) | GAM-WB-02 · F3–F4 (unchanged) |
| **V-13** | No change | LD-MATERIALS-COPY / LD-TABLE-FIDELITY cited, not weakened |

---

## 8. Non-goals respected

| Non-goal | Status |
|----------|--------|
| `app.js` | **Not edited** |
| Design Page / renderer | **Not edited** |
| Tests | **Not edited** (38F-3) |
| Preservation modules | **Not edited** |
| 38-E artefacts | **Not modified** |
| 38-B fixtures | **Not modified** |
| Broad workbook rewrite | **Avoided** — additive clauses only |

---

## 9. Risks / expected trade-offs

| Risk | Mitigation in pack |
|------|-------------------|
| Table reintroduction as dump | Single practice table; WB-16/GAM-WB-20 on capstone |
| Scenario duplication | scenario = narrative; task_cards = steps referencing scenario |
| Token pressure | Rows on practice activity (A2 pattern), not capstone |
| Over-constraining non-quantitative briefs | Gated on `workbook_contract_applied` + existing workbook brief trigger |
| Losing worked/consolidation | Explicit coexistence in 06a, 38F-01, output schema |

**Expected on 38F-4:** DLA A2 should list `scenario` + `analysis_table` (or similar) + retain A1/A4 38E10 types; GAM should emit distinct Materials.

---

## 10. Handoff to 38F-3

| Item | Action |
|------|--------|
| **Regression** | Extend or run `tests/workbook-contract-prompt-surface.test.js` for 38F-2 strings (DLA-WB-06a, WB-18 38F-2, GAM-WB-38F-01, F5, F6) |
| **V-13** | Confirm pack still references LD-MATERIALS-COPY / LD-TABLE-FIDELITY without architecture edits |
| **Readiness** | **READY** for 38F-4 Inflation re-run when 38F-3 passes |

---

## 11. Completion statement

| Criterion | Met? |
|-----------|------|
| V-01 explicit DLA + GAM coverage | **Yes** — §4 |
| V-05 explicit DLA + GAM coverage | **Yes** — §5 |
| 38E-8/9 intact | **Yes** — §6 |
| Only §5/§6 changed | **Yes** — §3 |
| No forbidden edits | **Yes** — §8 |
| Slice 38F-2 | **COMPLETE** |

**Next:** **38F-3** — regression prompt-surface check.
