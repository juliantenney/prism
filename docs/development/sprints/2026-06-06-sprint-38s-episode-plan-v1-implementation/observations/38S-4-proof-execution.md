# 38S-4 — Proof execution

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Proof execution — EV-38S-AFTER generation + 38R-4 metric evaluation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38S-4  
**Framework:** [38R-4 proof design](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md)  
**Predecessor:** [38S-3 obligation tagging](38S-3-dla-obligation-tagging.md)  
**Successor:** [38S-5 Evaluation and recommendation](38S-5-evaluation-and-recommendation.md)

---

## Executive summary

**Proof verdict: B — Partial success**

| Lane | Result |
|------|--------|
| **Educational structure (G3/G5/G4 on merged DLA)** | **PASS** — M-01 100%; M-02/M-03 100%; M-05 0; all T-families Pass |
| **Fidelity (fullOk on EV-38S pipeline replay)** | **FAIL** — `fullOk: false` (incomplete page compose; RF-8) |
| **Regression suite (58/58 + 38S tests)** | **PASS** — 76/76 |
| **End-to-end harness** | **FAIL** — stopped at 38L gate after population merge |

Episode Plan architecture **delivers predicted structural improvements** when population contract is applied. **Fidelity preservation on the full generated workbook was not demonstrated** in this run — the continue-path page lacked four composed activities and `material_role_index` (38P merge not applied to LLM page output).

---

## Task 1 — Proof run inventory

## Proof run inventory

**Run ID:** `EV-38S-AFTER`  
**Harness:** `ev-38l-inflation-pipeline-capture-once.mjs` (v38S-3a) + `ev-38s-proof-continue.mjs` + `ev-38s-proof-replay.mjs`

### Gate activities

| ID | Archetype | Episode Plan | DLA lane | Notes |
|----|-----------|:------------:|----------|-------|
| **A1** | Understand | ✓ | Merged | 12 beats → 7 OBL-M tagged |
| **A2** | Apply | ✓ | Merged | T1 triple Pass |
| **A3** | Analyse | ✓ | Merged | T1 Pass; 8 OBL-M |
| **A4** | Evaluate | ✓ | Merged | T2 + T4 Pass |
| **T3-MICRO** | Understand (5-beat) | ✓ | Scaffold | Structural Pass (population contract) |

### Artefacts captured

| Artefact | Path | Status |
|----------|------|:------:|
| Episode Plans | `38l/artefacts/EV-38S-AFTER-episode-plans.json` | **Written** |
| DLA (structural / merged) | `38l/artefacts/EV-38S-AFTER-dla-learning-activities.json` | **Written** |
| DLA (fidelity lane / raw LLM) | `38l/artefacts/EV-38S-AFTER-dla-learning-activities-fidelity-lane.json` | **Written** |
| DLA raw capture | `38l/artefacts/EV-38S-AFTER-dla-learning-activities-raw.txt` | **Written** |
| GAM | `38l/artefacts/EV-38S-AFTER-gam.json` | **Written** (continue path) |
| Page | `38l/artefacts/EV-38S-AFTER-design-page.json` | **Written** (continue path) |
| Proof metrics | `artefacts/EV-38S-AFTER-proof-metrics.json` | **Written** |
| Fidelity replay log | `artefacts/EV-38S-AFTER-run-log.json` | **Written** |
| Render | `artefacts/EV-38S-AFTER-render.html` | **Written** |

### Run notes (honest)

1. **KM first attempt failed** — OpenAI prose-after-fence; resumed with seeded `EV-38L-AFTER` KM/LC.  
2. **Full harness failed post-population** — `validateDla38LObligations` Fail on **merged** DLA (A3 DLA-WB-27, A4 DLA-WB-28/31). Raw LLM DLA **passed** 38L before merge.  
3. **GAM/Page** completed via `ev-38s-proof-continue.mjs` using fidelity-lane (raw) DLA for 38L compatibility.  
4. **Fidelity replay** applied 38M merge + 38N + 38P validators — **fullOk false** due to incomplete LLM page structure.

---

## Task 2 — Structural metrics

Metrics evaluated on **population-merged DLA** (`EV-38S-AFTER-dla-learning-activities.json`) against frozen A1–A4 plans. Thresholds from [38R-4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md).

| Metric | Result | Pass/Fail |
|--------|--------|:---------:|
| **M-01** Transition coverage | **100%** (5/5 families Pass: T1,T2,T3,T4,T5) | **PASS** (≥80%) |
| **M-02** Beat survival | **100%** all gate activities (12/12, 12/12, 13/13, 15/15) | **PASS** (≥95%) |
| **M-03** Ordered obligation survival | **100%** all activities | **PASS** (=100%) |
| **M-04** Episode continuity | **100%** all adjacent beat pairs (A1–A4) | **PASS** (=100%) |
| **M-05** AC violation count | **0** | **PASS** (=0) |
| **M-06** OBL-M inflation ratio | A1 **1.75×**, A2 **1.75×**, A3 **2.0×**, A4 **1.25×** | **PARTIAL** (A4 <1.5× target) |
| **M-07** Orphan materials | **0** | **PASS** (=0) |
| **M-08** Plan traceability / GAP closure | Traceability **100%**; GAP-13 closed all four; GAP-01/02/06 closed where applicable | **PASS** (programme level) |

**Baseline comparison (EV-38M):**

| Activity | EV-38M materials | EV-38S tagged OBL-M | Tagged |
|----------|-----------------:|--------------------:|:------:|
| A1 | 4 | 7 | 7/7 |
| A2 | 4 | 7 | 7/7 |
| A3 | 4 | 8 | 8/8 |
| A4 | 8 | 10 | 10/10 |

**Raw LLM DLA (pre-merge) for contrast:** M-01 **0%**; M-05 **34** violations; M-02 Fail — confirms improvement is **contract-driven**, not prompt-only.

---

## Task 3 — Claims A–E

| Claim | Result | Evidence |
|-------|:------:|----------|
| **A — G3 reduction** | **PASS** | M-01 100%; T1 Pass A2+A3; T2 Pass A4; T4/T5 Pass; vs EV-38M ~0% transition coverage |
| **B — G5 reduction** | **PASS** | M-02/M-03/M-04 100%; M-07 0; ordered plan-tagged obligations; vs EV-38M parallel bundles (GAP-13) |
| **C — G4 reduction** | **PASS** (merged lane) | M-05 0; no AC-01–AC-10 violations after merge; raw lane M-05 34 |
| **D — fullOk preserved** | **FAIL** | `EV-38S-AFTER-run-log.json`: proofOk **false**, roleOk **false**, fullOk **false**; vs EV-38P fullOk **true** |
| **E — No prompt-accretion dependency** | **PASS** | Plan gate + merge enforced; V1 unchanged; structural metrics fail on raw LLM without merge |

---

## Task 4 — Transition-family audit

| Family | Status | Evidence |
|--------|:------:|----------|
| **T1** Worked → Guided → Independent | **Pass** | A2 indices 4→5→6; A3 indices 5→7→8; 3 distinct tagged OBL-M each; merged **false** |
| **T2** Perspective → Criteria → Judgement | **Pass** | A4 perspective_construction, criteria_construction, evaluative_judgement distinct |
| **T3** Predict → Evidence → Revision | **Pass** | T3-MICRO scaffold; prediction, observation, revision obligations distinct |
| **T4** Judgement → Transfer → Reflection | **Pass** | A4 evaluative_judgement precedes transfer and reflection |
| **T5** Perform → Verify → Reflect | **Pass** | A1/A2/A3 independent_performance → verification → reflection chains Pass |

---

## Task 5 — AC rule audit

Evaluated on **population-merged DLA**. All rules **Pass** — zero violations detected.

| Rule | Status | Evidence |
|------|:------:|----------|
| **AC-01** | **Pass** | T1 triple ≥3 OBL-M on A2/A3 |
| **AC-02** | **Pass** | No checklist-only verification without rubric spec |
| **AC-03** | **Pass** | Reflection via cognition/task segment; no consolidation substitution |
| **AC-04** | **Pass** | perspective_construction specs include construct/pause language |
| **AC-05** | **Pass** | criteria_construction specs include learner weighting |
| **AC-06** | **Pass** | evaluative_judgement specs include defend/compar language |
| **AC-07** | **Pass** | No independent_performance as sample_output |
| **AC-08** | **Pass** | All materials carry plan_beat_index + episode_plan_ref |
| **AC-09** | **Pass** | Teaching beats have OBL-M rows |
| **AC-10** | **Pass** | No pre-filled guided_reasoning tables |

**Documented failure (integration, not AC rule):** Population **merge replaces** LLM materials → 38L depth rows lost (A3 worked analytic pass type, A4 independent judgement template). This is a **merge/38L coexistence** defect, not an AC false-negative.

---

## Task 6 — Fidelity replay

**Command:** `node artefacts/ev-38s-proof-replay.mjs`

| Fidelity check | Result |
|----------------|--------|
| **proofOk** | **false** |
| **roleOk** | **false** |
| **fullOk** | **false** |
| **38M validate38MPageFidelity** | **Pass** |
| **38L page GAM preservation** | **Fail** — "expected at least 4 learning activities on page" |
| **RF-1..RF-7** | **Pass** |
| **RF-8 compose transparency** | **Fail** — no `material_role_index` on page activities |
| **A3 sequencing (38N)** | **Fail** — activity row not found on composed page |
| **58/58 + 38S suite** | **76/76 Pass** |

**Interpretation:** Shared 38M–38P **machinery** is intact (suite passes). This EV-38S **artefact set** did not traverse the full `applyGamMaterialsToComposedPage` + 38P merge path on a complete four-activity page — the continue-path LLM page was structurally incomplete. **Not a regression in fidelity code**; **artefact/pipeline completion failure**.

---

## Task 7 — Comparative findings

## Comparative findings

### EV-38P-AFTER vs EV-38S-AFTER

| Dimension | EV-38P-AFTER | EV-38S-AFTER |
|-----------|--------------|--------------|
| **Planning authority** | DLA prompt-internal | Episode Plan V1 + merge |
| **instructional_function tags** | 0 / activity | 7–10 / activity |
| **Material count (A2)** | 4 parallel | 7 ordered |
| **T1 fade (A2)** | Collapsed (M7 table) | **Pass** — 3 distinct obligations |
| **T2 chain (A4)** | Collapsed parallel | **Pass** |
| **Beat traceability** | None | `_population_trace` + matrix |
| **fullOk** | **true** | **false** |
| **Worksheet character** | Checklist/table bundle | Plan-ordered obligation scaffold + LLM specs |
| **Episode character** | Weak transitions | Transition families Pass |

### Evidence-backed conclusion

Episode Plan + population contract **demonstrably improves instructional structure** vs EV-38M baseline on every 38R-4 educational metric tested. **Fidelity floor was not maintained on the generated EV-38S workbook replay** — blocking Claim D and overall proof success.

---

## Task 8 — Failure catalogue (PF-01–PF-14)

| Failure | Present? | Severity |
|---------|:--------:|:--------:|
| **PF-01** Transition collapse | **No** | — |
| **PF-02** Parallel bundle | **No** (merged lane) | — |
| **PF-03** Checklist substitution | **No** | — |
| **PF-04** Reflection degradation | **No** | — |
| **PF-05** Order drift | **No** | — |
| **PF-06** fullOk regression | **Yes** | **Blocking** |
| **PF-07** Beat drop | **No** (merged lane) | — |
| **PF-08** Perspective/menu substitution | **No** | — |
| **PF-09** Criteria exposition substitution | **No** | — |
| **PF-10** Sample-output spoiler | **No** | — |
| **PF-11** Decorative plan | **No** | — |
| **PF-12** Cognition substitution | **No** | — |
| **PF-13** Learner_task shell | **Partial** — LLM prose rich; segments present post-merge | **Non-blocking** |
| **PF-14** Suite regression | **No** | — |

**Additional integration failure (unnamed in PF list):** **Merge supersedes 38L depth rows** — causes harness abort and forces dual-lane split (structural vs fidelity). **High / Critical for single-lane pipeline.**

---

## Task 9 — Proof verdict

| # | Question | Answer |
|---|----------|--------|
| 1 | Was G3 reduced? | **Yes** — M-01 100%; all T-families Pass |
| 2 | Was G5 reduced? | **Yes** — beat/order survival 100%; orphan 0; vs parallel EV-38M |
| 3 | Was G4 reduced? | **Yes** on merged lane — AC violations 0 (vs 34 raw) |
| 4 | Was fullOk preserved? | **No** — EV-38S replay fullOk false |
| 5 | Did Episode Plan survive implementation? | **Yes** — V1 unchanged; plans derived; gate active |
| 6 | Is architecture behaving as predicted? | **Partially** — educational lane matches 38R prediction; fidelity lane blocked by pipeline completion + merge/38L tension |

### Outcome classification

**B — Partial success**

- **Proceed to 38S-5** with recommendation: fix **additive merge** (plan tags + 38L rows coexist); complete **single-lane harness** through GAM → 38P merge → replay before closure gate.

---

## Task 10 — Inputs to 38S-5

## Evaluation inputs

### Metric summary

- Educational gate: **PASS** (M-01–M-05, M-07, M-08; M-06 partial A4)  
- Fidelity gate: **FAIL** (fullOk)  
- Suite: **PASS** (76/76)

### Claim outcomes

- A, B, C, E: **PASS**  
- D: **FAIL**

### Fidelity outcomes

- RF-1..RF-7: Pass on replay artefact  
- RF-8: Fail (no material_role_index — page not fully merged)  
- 38L preservation: Fail (incomplete page)

### Remaining risks

1. **Merge vs 38L** — replace → additive population (**Critical**)  
2. **Incomplete proof pipeline** — continue path ≠ production harness (**High**)  
3. **M-06 A4** — inflation ratio 1.25× below 1.5× target (**Low**)  
4. **KM capture reliability** — prose-after-fence (**Medium**)

### Unresolved failures

- Harness abort at 38L post-merge  
- EV-38S fullOk false  
- Dual-lane split (structural merged vs fidelity raw) — not acceptable for closure

---

## Success condition assessment

> "Did the implemented Episode Plan architecture deliver the educational improvements predicted by 38Q and 38R while preserving fidelity?"

**Educational improvements: Yes** — structurally proven on merged DLA vs EV-38M.  
**Fidelity preservation: No** — not demonstrated on complete EV-38S workbook replay.

---

## Tooling delivered

| Tool | Path |
|------|------|
| Proof metrics | `lib/episode-plan-proof-metrics.js` |
| Evaluation harness | `artefacts/ev-38s-proof-evaluation.mjs` |
| Pipeline continue | `artefacts/ev-38s-proof-continue.mjs` |
| Fidelity replay | `artefacts/ev-38s-proof-replay.mjs` |

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38S-4 |
| Status | **COMPLETE** |
| Proof verdict | **B — Partial success** |
| Next | [38S-5 Evaluation and recommendation](38S-5-evaluation-and-recommendation.md) |
