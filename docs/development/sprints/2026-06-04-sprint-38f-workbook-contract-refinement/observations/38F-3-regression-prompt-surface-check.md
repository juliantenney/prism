# Slice 38F-3 — Regression prompt-surface check

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38F-3  
**Authority:** [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38E-4](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-4-contract-regression-fixture-check.md) · [38F-2](38F-2-contract-refinement.md)  
**Out of scope:** Inflation pipeline run · `app.js` · preservation module edits · artefact capture

---

## 1. Purpose

Verify that [38F-2](38F-2-contract-refinement.md) pack deltas are **present**, **testable**, and do **not** remove [38E-8](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-8-dla-workbook-function-strengthening.md) / [38E-9](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-9-gam-workbook-function-enforcement.md) obligations or weaken **V-13** preservation commitments — before **38F-4** Inflation re-run.

---

## 2. Inputs and authority

| Source | Role |
|--------|------|
| [38F-2](38F-2-contract-refinement.md) | Implemented §5/§6 deltas |
| [38F-1](38F-1-v01-v05-forensic-analysis.md) | V-01/V-05 break points |
| [38E-4](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-4-contract-regression-fixture-check.md) | Regression method pattern |
| [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | V-01, V-05, V-13 targets |

**Method:** Static pack review · automated prompt-surface tests · preservation `lib/` grep — **no** live pipeline.

---

## 3. Files inspected

| File | Role |
|------|------|
| `domains/learning-design/domain-learning-design-step-patterns.md` §5 · §6 | 38F-2 + 38E-8/9 pack text |
| `tests/workbook-contract-prompt-surface.test.js` | Automated surface checks |
| `lib/ld-table-fidelity.js` | V-13 — unchanged |
| `lib/ld-materials-copy.js` | V-13 — unchanged |
| `lib/ld-design-page-compose-contract.js` | V-13 — unchanged |

---

## 4. Tests changed

| Change | Detail |
|--------|--------|
| **Extended** | `tests/workbook-contract-prompt-surface.test.js` |
| **Added** | 8 tests (38F-2 V-01/V-05, 38E-8/9 preservation, defaultPromptNotes) |
| **Retained** | 4 tests from 38E-4 (DLA-WB block, GAM-WB block, CW-REF tokens, preservation lib) |
| **Total** | **12** tests |

**Not changed:** `app.js` · Design Page pack §13 body · renderer · preservation modules · artefacts.

---

## 5. V-01 coverage

| Check | Pack evidence | Automated test |
|-------|---------------|----------------|
| DLA requires ≥1 table/reference when `workbook_contract_applied` | **DLA-WB-06a (38F-2)** | `pack §5 38F-2: V-01 DLA-WB-06a…` |
| Coexists with worked_example / sample_output / consolidation_summary | 06a + output rows (1)–(4) | Same + `output schema co-presence` |
| GAM authors pipe table for DLA table types | **GAM-WB-38F-01**; **F6** | `pack §6 38F-2: V-01 GAM-WB-38F-01…` |
| Table = support, not reference dump | GAM-WB-20 cited; 38F-01 anti-dump | `support-not-dump` / `not a reference dump` |
| Empty learner judgement cells | AP-03 in table guidance; 38F-01 | `judgement cells empty` |

**Verdict:** **Full** prompt-surface coverage for V-01 (runtime manifestation still requires 38F-4).

---

## 6. V-05 coverage

| Check | Pack evidence | Automated test |
|-------|---------------|----------------|
| DLA distinct `scenario` row when case language | **DLA-WB-18 (38F-2)**; ≥2 cases | `pack §5 38F-2: V-05 DLA-WB-18…` |
| `task_cards` not sole case carrier | WB-18 anti-substitution | `sole carrier` / `task_cards-only FAIL` |
| GAM `Material: scenario` | **GAM-WB-10 (38F-2)** | `Material:.*(scenario)` |
| task_cards cannot replace scenario | **F5**; AP-04 | `pack §6 38F-2: V-05 GAM-WB-10…` |

**Verdict:** **Full** prompt-surface coverage for V-05.

---

## 7. 38E-8/9 preservation check

| Obligation | Still in pack? | Test |
|------------|----------------|------|
| **worked_example** + **sample_output** (WB-08) | **Yes** — mandatory row | `pack §5 38E-8/9: worked example…` |
| **modelling_note** alternate | **Yes** — WB-08 | Same test (`modelling_note`) |
| **consolidation_summary** (WB-12) | **Yes** — ≥80 words, ≥3 ideas | Same + GAM test |
| **prompt_set ≠ consolidation** | **Yes** — WB-12, MIX-03, F2 | GAM 38E-8/9 test |
| **template/ranking ≠ worked** | **Yes** — WB-08, MIX-04, F4 | Both DLA + GAM tests |
| **GAM-WB-02 / 06** mandatory | **Yes** — F3, F1 | GAM 38E-8/9 test |
| **Co-presence (38F-2)** | **Yes** — do not drop (1)–(2) | `output schema co-presence` |

**Verdict:** **Pass** — 38F-2 additive; 38E-8/9 clauses and fail rules remain asserted.

---

## 8. V-13 preservation check

| Check | Result |
|-------|--------|
| **LD-MATERIALS-COPY** referenced in §5/§6 GAM | **Yes** — `obey` / `do not weaken` |
| **LD-TABLE-FIDELITY** referenced in §5/§6 GAM | **Yes** — GAM primary table author |
| **No GAM-WB/DLA-WB IDs in preservation libs** | **Yes** — `lib/ld-table-fidelity.js`, `ld-materials-copy.js`, `ld-design-page-compose-contract.js` unchanged; test `doesNotMatch` |
| **Preservation module files modified** | **No** |

**Verdict:** **Pass** — V-13 stack untouched.

---

## 9. Test results

**Command:**

```bash
node --test tests/workbook-contract-prompt-surface.test.js
```

**Result (2026-06-04):**

| Metric | Value |
|--------|-------|
| Tests | **12** |
| Pass | **12** |
| Fail | **0** |
| Duration | ~324 ms |

---

## 10. Inflation readiness decision

| Decision | **READY** for **38F-4** Inflation re-run |
|----------|------------------------------------------|

| Criterion | Met? |
|-----------|------|
| V-01 / V-05 prompt-surface covered | **Yes** |
| 38E-8/9 still covered | **Yes** |
| V-13 preservation untouched | **Yes** |
| Tests recorded and green | **Yes** |
| Pack-only scope respected | **Yes** |

**Note:** READY means **contract surface** is verified — not a guarantee of Workbook PASS on the next run (model compliance remains to be scored in 38F-4).

---

## 11. Risks / watchpoints

| Watchpoint | Mitigation already in pack |
|------------|----------------------------|
| Model may still omit table/scenario rows despite pack | Output JSON MUST rows (1)–(4); F5/F6 GAM fail rules |
| Token budget drops table again | Co-presence explicit in 06a + output schema |
| Scenario duplicated in task_cards + scenario | Pack allows task_cards **after** scenario, not instead |
| 38F-4 preservation regression | Score V-13 separately; compare GAM→page for new types |

---

## 12. Completion statement

| Criterion | Met? |
|-----------|------|
| V-01 and V-05 covered by checks | **Yes** — §5–§6, tests |
| 38E-8/9 obligations covered | **Yes** — §7 |
| V-13 stack untouched | **Yes** — §8 |
| Test result recorded | **Yes** — §9 |
| READY / NOT READY explicit | **Yes** — **READY** §10 |
| Slice 38F-3 | **COMPLETE** |

**Next:** **38F-4** — Inflation re-run and scorecard (`EV-38F-AFTER-*`).
