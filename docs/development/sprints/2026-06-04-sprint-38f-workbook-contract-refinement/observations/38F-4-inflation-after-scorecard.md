# Slice 38F-4 — Inflation AFTER re-run and scorecard

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38F-2](38F-2-contract-refinement.md) · [38F-3](38F-3-regression-prompt-surface-check.md)  
**Prior scorecards:** [38E-10](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) · [38E-5](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-5-inflation-after-scorecard.md)  
**Out of scope:** Pack edits · `app.js` · renderer changes during scoring

---

## 1. Purpose

Execute the **post-38F-2** Inflation self-study learner pipeline, capture **`EV-38F-AFTER`**, and score against [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) with a **four-way** comparison to frozen comparators — **Workbook** and **Preservation** reported separately.

**Frozen (not overwritten):** `NEG-EV-01` · `EV-38E5-AFTER` · `EV-38E10-AFTER`.

---

## 2. Run context

| Field | Value |
|-------|--------|
| **Run ID** | `EV-38F-AFTER` |
| **Captured** | 2026-06-04T15:30:18Z |
| **Model** | `gpt-4.1-mini` |
| **Harness** | [artefacts/ev-38f-inflation-pipeline-capture-once.mjs](../artefacts/ev-38f-inflation-pipeline-capture-once.mjs) |
| **Pack state** | 38E-8/9 + **38F-2** §5/§6 |
| **Brief** | Same inflation self-study lineage as EV-01 / 38E5 / 38E10 ([harness BRIEF](../artefacts/ev-38f-inflation-pipeline-capture-once.mjs)) |
| **Prompt chars** | DLA **13 676** · GAM **13 966** · Design Page **20 555** |
| **Activities** | **3** (compressed vs 4 on 38E5/38E10) |
| **Duration sum** | **55 min** |

---

## 3. Artefacts captured

| File | Path |
|------|------|
| GAM | [artefacts/EV-38F-AFTER-gam.txt](../artefacts/EV-38F-AFTER-gam.txt) |
| DLA | [artefacts/EV-38F-AFTER-dla-learning-activities.json](../artefacts/EV-38F-AFTER-dla-learning-activities.json) |
| Page | [artefacts/EV-38F-AFTER-design-page.json](../artefacts/EV-38F-AFTER-design-page.json) |
| Render | [artefacts/EV-38F-AFTER-render-excerpt.html](../artefacts/EV-38F-AFTER-render-excerpt.html) |
| Log | [artefacts/EV-38F-AFTER-run-log.json](../artefacts/EV-38F-AFTER-run-log.json) |

---

## 4. EV-38F-AFTER summary

| Dimension | 38F AFTER |
|-----------|-----------|
| **DLA types** | `worked_example`, `sample_output`, `text`, `scenario`, `analysis_table`, `consolidation_summary` (6) |
| **GAM types** | Same 6 — **1:1 with DLA** |
| **GAM families** | **4** — `table`, `narrative`, `structured_practice`, `closure` |
| **Table family** | **Yes** — `analysis_table` pipe table (learner impact columns empty) |
| **`scenario` Material** | **Yes** — 2 households (Smith, Lee) |
| **worked_example / sample_output** | **Yes** — A1, 4 steps + formula |
| **consolidation_summary** | **Yes** — A3, ~1 204 chars, ≥3 ideas |
| **Retrieval genres** | **No** `task_cards`, `checklist`, `prompt_set` on any activity |

---

## 5. Workbook assessment (38F)

### 5.1 Layer verdicts ([38D-4 §6.3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md))

| Layer | Verdict | Rationale |
|-------|---------|-----------|
| **V1 DLA** | **Partial** | WB-08/12/06a/18 rows present; **DLA-WB-11 Fail** — no second activity with `task_cards`/`checklist`/`prompt_set`; 3 activities only |
| **V2 GAM** | **Pass** | **V-01 Pass** (4 families) · **V-02 Pass** · **V-03 Pass** · **V-04 Pass** · **V-05 Pass** · **V-06 Pass** · **V-07 N/A** · **V-12 Pass** |
| **V3 Page** | **Fail** | **V-10 Fail** — R3 retrieval **Partial** (no learner-check checklist/cards/prompt_set on ≥2 activities) |
| **V4 Render** | **Partial** | Excerpt captured; utility HTML — JSON primary |
| **Workbook overall** | **FAIL** | G3 requires **V-10 Pass**; sprint **38F targets** (V-01, V-05, 38E-8/9) **met** at GAM/page |

### 5.2 Anti-patterns (AP-01 … AP-04)

| AP | Verdict | Evidence |
|----|---------|----------|
| **AP-01 table-only** | **PASS** | 6 types; 4 families |
| **AP-02 capstone dump** | **PASS** | Capstone = `consolidation_summary` only |
| **AP-03 pre-filled judgement** | **PASS** | Analysis table learner columns empty |
| **AP-04 scenario not authored** | **PASS** | `Material: scenario` + 2 cases |

### 5.3 38C-1 functions (R1–R7)

| Rule | Score | Notes |
|------|-------|-------|
| **R1 Teaching** | **Present** | `text` + worked path |
| **R2 Practice** | **Present** | `scenario` + `analysis_table` |
| **R3 Retrieval** | **Partial** | No `checklist` / `task_cards` / `prompt_set` |
| **R4 Consolidation** | **Present** | `consolidation_summary` body on page |
| **R5 Worked example** | **Present** | 4-step CPI worked + sample_output |
| **R6 Transfer** | **Partial** | Consolidation discusses household strategies |
| **R7 Session** | **Pass** | 55 min; solo tasks |

### 5.4 V-01 … V-12 checklist (38F)

| ID | Result |
|----|--------|
| **V-01** | **Pass** (4 families incl. **table**) |
| **V-02** | **Pass** |
| **V-03** | **Pass** |
| **V-04** | **Pass** |
| **V-05** | **Pass** |
| **V-06** | **Pass** |
| **V-07** | **N/A** |
| **V-08** | **Pass** (55 min) |
| **V-09** | **Partial** (WB-11 retrieval density) |
| **V-10** | **Fail** (R3) |
| **V-11** | **Partial** |
| **V-12** | **Pass** |

### 5.5 Workbook verdict (explicit)

> **Workbook: FAIL** ([38D-4 G3/G4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) — **V-10** blocked by R3 / DLA-WB-11)

> **38F refinement targets (V-01, V-05, 38E-8/9): PASS** at DLA, GAM, and page layers

---

## 6. Preservation assessment (38F)

| Check | Result |
|-------|--------|
| **B4-01 comma-row** | **Pass** — run-log `B4_01: false` |
| **B4-02 Headers/Rows** | **Pass** — `B4_02: false` |
| **GAM → Design Page** | **Pass** — `worked_example`, `sample_output`, `text`, `scenarios` (scenario body), `analysis_table`, `consolidation_summary` bodies match GAM |
| **Pipe table** | **Pass** — `analysis_table` pipe markdown preserved on page (learner cells empty) |
| **LD-MATERIALS-COPY** | **Pass** — no summarisation stripping of new genres |
| **LD-TABLE-FIDELITY** | **Pass** — valid pipe table when table authored |
| **Design Page inventing bodies** | **No** |

**Note:** Page key `materials.scenarios` (compose convention) holds verbatim scenario prose from GAM `scenario` type.

### 6.1 Preservation verdict (explicit)

> **Preservation: PASS**

---

## 7. Four-way scorecard

| Measure | EV-01 | 38E5 | 38E10 | **38F** |
|---------|-------|------|-------|---------|
| **Workbook overall** | FAIL | FAIL | FAIL | **FAIL** |
| **Preservation overall** | PASS | PASS | PASS | **PASS** |
| **Activity count** | 5 | 4 | 4 | **3** |
| **GAM type count** | 4 | 7 | 8 | **6** |
| **Genre families** | 1 | 3 | 3 | **4** |
| **Table family** | Yes | Yes | **No** | **Yes** |
| **`scenario` Material** | No | Yes | No | **Yes** |
| **worked_example** | No | No | Yes | **Yes** |
| **sample_output** | No | No | Yes | **Yes** |
| **consolidation_summary** | No | No | Yes | **Yes** |
| **task_cards / checklist** | No | Yes | Yes | **No** |
| **Duration (min)** | 125 | 65 | 60 | **55** |
| **V-01** | Fail | Fail | Fail | **Pass** |
| **V-03** | Fail | Fail | Pass | **Pass** |
| **V-04** | Fail | Fail | Pass | **Pass** |
| **V-05** | Fail | Pass | Fail | **Pass** |
| **V-10** | Fail | Fail | Pass | **Fail** |
| **AP-01** | Fail | Pass | Pass | **Pass** |
| **AP-04** | Fail | Pass | Partial | **Pass** |
| **R4 consolidation** | Absent | Partial | Present | **Present** |
| **R5 worked** | Absent | Absent | Present | **Present** |
| **R3 retrieval** | Partial | Partial | Present | **Partial** |

---

## 8. 38E-8/9 retention check

| Type | 38E10 | 38F | Retained? |
|------|-------|-----|-----------|
| **worked_example** | Yes | **Yes** | **Yes** |
| **sample_output** | Yes | **Yes** | **Yes** |
| **consolidation_summary** | Yes | **Yes** | **Yes** |
| **text exposition** | Yes | **Yes** | **Yes** |

**Trade-off vs 38E10:** 38F restored **table + scenario** but **dropped** `task_cards` and `checklist` when the model compressed to **3 activities**.

---

## 9. V-01 / V-05 result (38F sprint focus)

| Rule | 38E10 | 38F | Δ |
|------|-------|-----|---|
| **V-01** | **Fail** (no table family) | **Pass** (4 families) | **Fixed** |
| **V-05** | **Fail** (cases in task_cards) | **Pass** (`Material: scenario`, 2 households) | **Fixed** |

**Evidence:** DLA A2 `scenario` + `analysis_table`; GAM `inflation_wb_scen1 (scenario)` + pipe `analysis_table`; page `scenarios` + `analysis_table` verbatim.

---

## 10. Success tier and Case interpretation ([38D-5 §7](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [§9](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md))

| Tier | Met? | Notes |
|------|------|-------|
| **Not met** | — | — |
| **Minimum** | **Met** | AP-01 Pass · V-13 Pass · V-01/V-05/38E-8/9 targets Pass |
| **Strong** | **Not met** | V-10 Fail; not full [38D-4 G3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) PASS |
| **Exceptional** | **Not met** | Below `CW-REF-38D3` retrieval density |

| Case | Fit |
|------|-----|
| **A** | **Primary** — material uplift on **V-01/V-05** + 38E-8/9; preservation holds; **not** full workbook PASS |
| **B** | **No** — Workbook FAIL |
| **C** | **Superseded** for V-01/V-05 on 38F run |
| **D** | **No** |

**Classification change:** 38E10 was **A** with V-01/V-05 fail; 38F is **A+** (same case family, **stronger** on sprint blockers, still not **B**).

---

## 11. Risks and caveats

| Risk | Observation |
|------|-------------|
| **3-activity compression** | Model merged practice + dropped retrieval genres — WB-11 not met |
| **Token budget trade-off** | Adding table+scenario may have displaced task_cards/checklist vs 38E10 |
| **Page key `scenarios`** | Compose maps `scenario` → `scenarios` — not a preservation failure if body verbatim |
| **Single-run variance** | Re-run may restore 4 activities + retrieval |

---

## 12. Recommendation for 38F-5 closure

| Item | Recommendation |
|------|----------------|
| **Sprint 38-F hypothesis (38F-2)** | **Supported** for **V-01 + V-05** — pack refinements manifest in live output |
| **Primary success condition** | **Not met** — Workbook FAIL (V-10); Preservation PASS |
| **Programme** | **Partial success** — close 38-F documenting dual verdicts; optional follow-up: DLA-WB-11 co-presence in output schema **without** dropping 38F-6a/18 rows, or accept 3-activity workbook with explicit retrieval row on A1/A2 |
| **Do not** | Conflate Preservation PASS with Workbook PASS |
| **38F-5** | Final closure with executive summary; do not overwrite comparators |

---

## 13. Completion statement

| Criterion | Met? |
|-----------|------|
| `EV-38F-AFTER` artefacts saved | **Yes** |
| Workbook verdict explicit | **Yes** — **FAIL** (38F targets **PASS**) |
| Preservation verdict explicit | **Yes** — **PASS** |
| V-01 / V-05 scored | **Yes** — §9 |
| 38E-8/9 checked | **Yes** — §8 |
| Frozen comparators untouched | **Yes** |
| Four-way table | **Yes** — §7 |
| Slice 38F-4 | **COMPLETE** |

**Next:** **38F-5** — Final evaluation and sprint closure.
