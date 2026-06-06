# 38N-3 — Validator schema alignment

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Residual:** R3 (from [38M-6](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md))  
**Type:** Code + tests

---

## Problem

Fresh composed pages from `EV-38M-AFTER` use schema variants that 38M/38L validators did not resolve:

| Canonical key | Fresh page variants |
|---------------|---------------------|
| `scenario_maya_strategy_menu` | `scenario`, `scenarios[]` |
| `worked_judgement_weak_strong` | `worked_example`, `modelling_note` |
| `guided_judgement_table` | `decision_table` |
| `scenario_maya_households` | `scenario`, `scenarios[]` |
| `worked_analytic_pass` | `worked_example` |
| `checklist` | `checklist_evaluate`, `verification_checklist`, `evaluation_checklist` |

Effects:

- `measurePageGamFidelity` read empty bodies when only alias keys populated → marker false negatives.
- `validate38LPageGamPreservation` reported missing A4 worked judgement despite full `worked_example` body.
- G3 strategy markers not evaluated when content lived under `scenarios[]`.

---

## Design

### `PAGE_MATERIAL_KEY_ALIASES`

Maps canonical fidelity-contract keys to ordered alias key lists. First non-empty alias wins.

### `pageMaterialText(materials, pageKey)`

Single resolver used by:

- `measurePageGamFidelity` (ratio + marker evaluation)
- `validate38MPageFidelity` (G5 guided body shell check)
- `materialsHasSubstantiveA4WorkedJudgement`
- `materialsHasSubstantiveA4Scenario`

### Substantive A4 checks (38L regression)

Now require semantic markers + length threshold via `pageMaterialText`, not canonical key presence alone.

---

## Strictness preserved

- Alias resolution does **not** lower ratio thresholds.
- Anti-synopsis detectors unchanged.
- Empty alias chains still fail gates.
- Tier-D literal markers (A3 worked pass) retained where phrasing is stable.

---

## Verification

| Validator | `EV-38M-AFTER` replay |
|-----------|----------------------|
| `validate38MPageFidelity` | **ok: true** (0 errors) |
| `validate38LPageGamPreservation` | **ok: true** (0 errors) |
| All Tier-A `substantive: true` in metrics | **PASS** |

`tests/page-38n-fidelity-hardening.test.js` — R3 alias resolution + combined validator test.
