# Slice 38E-10 — Inflation AFTER re-run and scorecard

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38E-8](38E-8-dla-workbook-function-strengthening.md) · [38E-9](38E-9-gam-workbook-function-enforcement.md)  
**Prior scorecards:** [38E-5](38E-5-inflation-after-scorecard.md) · [38E-6](38E-6-remaining-workbook-function-gap-analysis.md)  
**Out of scope:** Pack edits · `app.js` · renderer changes during scoring

---

## 1. Purpose

Re-run the Inflation self-study learner pipeline **after** [38E-8](38E-8-dla-workbook-function-strengthening.md) (DLA §5) and [38E-9](38E-9-gam-workbook-function-enforcement.md) (GAM §6), capture **`EV-38E10-AFTER`**, and score against [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) with three-way comparison to **EV-01** and **`EV-38E5-AFTER`**.

**Frozen (not overwritten):** `NEG-EV-01` (38-B) · `EV-38E5-AFTER-*`.

---

## 2. Run context

| Field | Value |
|-------|--------|
| **Run ID** | `EV-38E10-AFTER` |
| **Captured** | 2026-06-04T15:05:14Z |
| **Model** | `gpt-4.1-mini` |
| **Harness** | [artefacts/ev-38e10-inflation-pipeline-capture-once.mjs](../artefacts/ev-38e10-inflation-pipeline-capture-once.mjs) |
| **Pack state** | 38E-8 §5 + 38E-9 §6 |
| **Prompt chars** | DLA **11 816** · GAM **12 511** · Design Page **20 555** |

**Artefacts:**

| File | Path |
|------|------|
| GAM | [artefacts/EV-38E10-AFTER-gam.txt](../artefacts/EV-38E10-AFTER-gam.txt) |
| DLA | [artefacts/EV-38E10-AFTER-dla-learning-activities.json](../artefacts/EV-38E10-AFTER-dla-learning-activities.json) |
| Page | [artefacts/EV-38E10-AFTER-design-page.json](../artefacts/EV-38E10-AFTER-design-page.json) |
| Render | [artefacts/EV-38E10-AFTER-render-excerpt.html](../artefacts/EV-38E10-AFTER-render-excerpt.html) |
| Log | [artefacts/EV-38E10-AFTER-run-log.json](../artefacts/EV-38E10-AFTER-run-log.json) |

---

## 3. Three-way outcome table

| Measure | EV-01 (BEFORE) | 38E5 (`EV-38E5-AFTER`) | 38E10 (`EV-38E10-AFTER`) |
|---------|----------------|-------------------------|---------------------------|
| **Workbook overall** | **FAIL** | **FAIL** | **FAIL** |
| **Preservation overall** | **PASS** | **PASS** | **PASS** |
| **GAM / DLA type count** | 4 | 7 | **8** |
| **Type families** | 1 (table) | 3 | **3** (narrative, practice, closure) |
| **AP-01 table-only** | FAIL | PASS | **PASS** |
| **AP-02 capstone dump** | FAIL | PASS | **PASS** |
| **AP-03 pre-fill rank** | FAIL | PASS | **PASS** (no rank table) |
| **AP-04 scenario gap** | FAIL | PASS | **Partial** — scenario language; no `scenario` type |
| **Duration sum** | 125 min | 65 min | **60 min** |
| **worked_example (GAM)** | No | No | **Yes** (A1 M1, 3 steps + formula) |
| **sample_output (GAM)** | No | No | **Yes** (A1 M2) |
| **modelling_note (GAM)** | No | No | **Yes** (A3 M7) |
| **consolidation_summary (GAM)** | No | No | **Yes** (A4 M8, ~1 078 chars, ≥3 ideas) |
| **DLA worked types in spec** | No | No | **Yes** (worked_example, sample_output, modelling_note) |
| **DLA consolidation_summary spec** | No | No | **Yes** (A4 M8) |
| **scenario (GAM type)** | No | Yes | **No** (scenarios in task_cards) |
| **Pipe tables (GAM)** | Yes (4 types) | Yes | **No** (0 table materials) |
| **checklist / retrieval** | No | prompt_set only | **checklist** (A2 M5) |
| **R1 Teaching** | Partial | Present | **Present** |
| **R2 Practice** | Present | Present | **Present** |
| **R3 Retrieval** | Partial | Partial | **Present** |
| **R4 Consolidation** | Absent | Partial | **Present** |
| **R5 Worked example** | Absent | Absent | **Present** |
| **R6 Transfer** | Partial | Partial | **Partial** (A4 transfer task) |
| **R7 Session** | Fail | Pass | **Pass** |
| **V-03 consolidation** | Fail | Fail | **Pass** |
| **V-04 worked example** | Fail | Fail | **Pass** |
| **V-01 ≥4 families** | Fail | Fail | **Fail** (3 families; no table family) |
| **V-05 scenario align** | Fail | Pass | **Fail** (case language; no `scenario` Material) |
| **V-10 page functions** | Fail | Fail | **Pass** (R1–R4 Present) |
| **V-13 preservation** | PASS | PASS | **PASS** |

---

## 4. What changed between 38E5 and 38E10

| Dimension | Δ 38E5 → 38E10 |
|-----------|----------------|
| **DLA** | Now lists `worked_example`, `sample_output`, `modelling_note`, `consolidation_summary` in `required_materials` — [38E-8](38E-8-dla-workbook-function-strengthening.md) **manifest** |
| **GAM** | Authors `Material: worked_example`, `sample_output`, `consolidation_summary` with full bodies — [38E-9](38E-9-gam-workbook-function-enforcement.md) **manifest** |
| **Critical fixes** | **V-03**, **V-04**, **V-10** (R4/R5) flip **Fail → Pass** |
| **Trade-off** | **Lost table family** — no `classification_table` / `analysis_table` in this run (38E5 had 2 table types) |
| **Scenario** | 38E5 had `scenario` type; 38E10 embeds scenarios in **task_cards** only |
| **Duration** | 65 → **60 min** (target met) |

**Interpretation:** 38E-8/38E-9 addressed the **primary 38E-6 failure paths** (worked example + consolidation). A **new gap** appeared: **table-family absence** (V-01) and **AP-04 / V-05** scenario-type alignment.

---

## 5. Workbook assessment (38E10)

### 5.1 Layer verdicts

| Layer | Verdict | Notes |
|-------|---------|-------|
| **V1 DLA** | **Pass** | WB-08/WB-12 rows present; V-08 (60 min); V-09 Pass |
| **V2 GAM** | **Fail** | V-03 **Pass** · V-04 **Pass** · V-02 **Pass** · **V-01 Fail** (3/4 families) · **V-05 Fail** |
| **V3 Page** | **Pass** | V-10: R1–R4 **Present**; worked_example, sample_output, consolidation_summary on `materials` |
| **V4 Render** | **Partial** | Excerpt captured; utility HTML path |
| **Workbook overall** | **FAIL** | [38D-4 §6.3 G3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md): **V2** requires V-01–V-07 Pass |

### 5.2 Explicit answers (task checklist)

| Question | Answer |
|----------|--------|
| **Worked examples now appear?** | **Yes** — GAM A1 `worked_example` (3 steps, CPI formula) + `sample_output`; page copies verbatim |
| **consolidation_summary now appears?** | **Yes** — GAM A4 `consolidation_summary` (~1 078 chars, 3 ideas + reflection); page `materials.consolidation_summary` |
| **Workbook verdict changed vs 38E5?** | **Overall label unchanged (FAIL)**; **critical sub-rules flipped** (V-03, V-04, V-10); new **V-01** regression (no tables) |
| **Preservation stable?** | **Yes** — V-13 **PASS**; no B4 comma/Headers-Rows; LD-MATERIALS-COPY match for authored genres |

### 5.3 Workbook verdict (explicit)

> **Workbook: FAIL** (function-completion targets met; **V-01** and **V-05** block [38D-4 §6.3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) PASS)

> **Workbook (partial — strong):** R4/R5 **Present**; prior 38E-5 critical workbook-function gaps **closed**

---

## 6. Preservation assessment (38E10)

| Check | Result |
|-------|--------|
| **B4-01 / B4-02** | **Pass** — no comma-row or Headers/Rows |
| **GAM → Design Page** | **Pass** — worked_example, sample_output, consolidation_summary bodies match GAM on page |
| **LD-MATERIALS-COPY** | **Pass** — new genres copied; no summarisation stripping |
| **LD-TABLE-FIDELITY** | **N/A** — no pipe tables this run (not a syntax regression) |
| **Design Page inventing bodies** | **No** |

### 6.1 Preservation verdict (explicit)

> **Preservation: PASS**

---

## 7. Case interpretation ([38D-5 §9](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md))

| Case | Fit |
|------|-----|
| **A** | **Primary** — workbook **improves materially** (38E6 targets fixed); preservation **holds**; not full 38D-4 PASS |
| **B** | **No** |
| **C** | **Superseded for 38E-6 gaps** — no longer “no consolidation / no worked example” |
| **D** | **No** |

```text
V-13 PASS → V-03/V-04 PASS → V-01 FAIL → overall FAIL with Case A uplift
```

---

## 8. Success tiers ([38D-5 §7](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md))

| Tier | Met? | Notes |
|------|------|-------|
| **Not met** | — | — |
| **Minimum** | **Met (expanded)** | AP-01 Pass · V-13 Pass · **V-03/V-04 fixed** · ≥2 families · overall still FAIL (V-01) |
| **Strong** | **Not met** | G3 requires V2 Pass — blocked by V-01/V-05 |
| **Exceptional** | **Not met** | Below CW-REF (tables + full mix) |

---

## 9. Recommendation for 38E-11 (final closure)

| Item | Recommendation |
|------|----------------|
| **Sprint outcome** | **Partial success** — 38E-8/38E-9 **validated** on anchor for worked example + consolidation; **not** full workbook PASS |
| **38E-11 closure** | Document **Case A**; dual verdicts; do **not** claim workbook PASS |
| **Optional pack follow-up (same sprint programme, not 38E-10 scope)** | DLA: retain `consolidation_summary` + worked rows **and** require ≥1 practice `analysis_table` or `scenario` type when brief uses household cases — restore **table family** without dropping closure genres |
| **Runtime** | Defer `app.js` unless 38E-11 documents repeated V-01 miss |
| **Preservation** | **No reopen** — V-13 held across three runs |

**Do not overwrite:** EV-01 · EV-38E5-AFTER.

---

## 10. Completion statement

| Criterion | Met? |
|-----------|------|
| New artefacts saved | **Yes** — `EV-38E10-AFTER-*` |
| Workbook verdict explicit | **Yes** — **FAIL** (strong partial) |
| Preservation verdict explicit | **Yes** — **PASS** |
| Comparison vs 38E5 complete | **Yes** — §3–§4 |
| Case + tiers documented | **Yes** |
| 38E-11 recommendation | **Yes** — §9 |
| Slice 38E-10 | **COMPLETE** |

**Next:** **38E-11** — Final evaluation and sprint closure.
