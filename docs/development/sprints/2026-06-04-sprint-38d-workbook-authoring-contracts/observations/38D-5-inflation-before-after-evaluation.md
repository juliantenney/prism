# Slice 38D-5 — Inflation before/after evaluation

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38D-5  
**Authority:** [38D-1](38D-1-dla-workbook-contract.md) · [38D-2](38D-2-gam-workbook-genre-contract.md) · [38D-3](38D-3-canonical-workbook-fixture.md) · [38D-4](38D-4-workbook-validation-criteria.md) · [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)  
**Out of scope:** Live rerun · pack/prompt/runtime changes · probes · CI

---

## 1. Purpose

Define **how Inflation anchor EV-01** will be evaluated **before** and **after** workbook contract **implementation**, using the [38D-4](38D-4-workbook-validation-criteria.md) model — without executing a post-contract pipeline run in this slice.

**Success for this slice:** A reviewer can run a **before/after evaluation** with §6 scorecard, interpret outcomes via §9, and judge **minimum / strong / exceptional** success per §7 — while **separately** recording **38-B preservation** (V-13).

---

## 2. Inputs and authority

| Document | Role |
|----------|------|
| [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | R1–R7 · genre classification |
| [38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) | EV-01 gap taxonomy · origins |
| [38D-1](38D-1-dla-workbook-contract.md) | V1 DLA contract |
| [38D-2](38D-2-gam-workbook-genre-contract.md) | V2 GAM contract · AP-01–04 |
| [38D-3](38D-3-canonical-workbook-fixture.md) | `CW-REF-38D3` PASS target |
| [38D-4](38D-4-workbook-validation-criteria.md) | V-01 … V-13 · workflow |
| [38C-5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) | E1–E17 |

### Evidence artefacts (read-only)

| ID | Layer | Path |
|----|-------|------|
| **EV-01-G** | GAM | [ev-38b4-01-pipeline-gam.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) |
| **EV-01-P** | Page | [ev-38b4-01-design-page.json](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) |
| **EV-01-H** | Render | [ev-38b4-01-render-excerpt.html](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-render-excerpt.html) |
| **EV-03-G** | GAM comparator | [ev-38b4-03-inflation-gam-live.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) |
| **CW-REF** | Planning PASS | [fixtures/](../fixtures/) · `CW-REF-38D3` |
| **NEG index** | FAIL reference | [negative-exemplar-ev01-index.md](../fixtures/negative-exemplar-ev01-index.md) |

**After run:** Capture to [artefacts/](../artefacts/) as `EV-38D5-AFTER-*` when implementation completes (not in this slice).

---

## 3. Baseline definition — EV-01 (BEFORE)

**Official BEFORE state:** `NEG-EV-01` / **EV-01** (2026-06-04 same-run capture).

| Field | Baseline value |
|-------|----------------|
| **Workbook verdict** | **FAIL** ([38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md) · [38D-4 §8.1](38D-4-workbook-validation-criteria.md)) |
| **38C-1 genre** | **activity_sheet + reference_notes** |
| **Genre profile (GAM)** | **4** types only: `classification_table`, `comparison_table`, `analysis_table`, `impact_table` |
| **Type families** | **1** (table only) |
| **Material lines (GAM)** | 12 `Material:` entries across 5 activities |
| **Duration (page)** | **125** min sum |
| **Major failures** | No consolidation · no worked example · no exposition · weak retrieval · capstone table dump · solo-blocking tasks · A3 scenario mismatch · A4 pre-filled ratings |
| **AP-01 (table-only)** | **FAIL** — triggered |
| **AP-02 (reference dump)** | **FAIL** — A5 four tables |
| **AP-03 (pre-filled judgement)** | **FAIL** — A4 ratings |
| **AP-04 (scenario not authored)** | **FAIL** — A3 |
| **Preservation (V-13 / B4)** | **PASS** — GAM→page tables **verbatim**; B4 gate PASS on committed artefacts |
| **38D-4 layers** | V1 **FAIL** · V2 **FAIL** · V3 **FAIL** · V4 **FAIL** · Overall **FAIL** |

**Baseline immutability:** EV-01 artefacts remain the **frozen BEFORE** column in §6; do not overwrite 38-B fixtures.

---

## 4. Evaluation model

| Role | Run / reference | Use |
|------|-----------------|-----|
| **Before** | **EV-01** | Official baseline — §3 |
| **After** | **Post-contract Inflation** (TBD) | Same brief intent: self-study workbook, inflation topic, `page_profile: learner` — **same evaluation rubric** |
| **Comparator A** | **EV-03-G** | Proof partial uplift is **possible** without full PASS |
| **Comparator B** | **CW-REF-38D3** | Structural PASS target — not expected on first after run |

```text
EV-01 (BEFORE)  →  [Implementation: DLA/GAM contract in packs]  →  AFTER (TBD)
         ↓                              ↓
    EV-03 (partial ceiling?)      CW-REF-38D3 (PASS target)
```

**Evaluation rule:** Score **AFTER** with [38D-4 §9](38D-4-workbook-validation-criteria.md); compare columns in §6; apply §7 success tiers.

---

## 5. Measurement framework

### A. DLA compliance

| Measure | Evidence | Pass criteria |
|---------|----------|---------------|
| DLA-WB Mandatory clauses | DLA JSON export | All **Pass** ([38D-1 §8](38D-1-dla-workbook-contract.md)) |
| Duration budget | `duration_minutes` sum | **V-08** Pass: 50–70 min |
| Material diversity spec | `required_materials` types | **V-09** Pass; non-table types listed |
| Capstone anti-dump spec | A5 `required_materials` | No “all table types” spec ([DLA-WB-16](38D-1-dla-workbook-contract.md)) |

### B. GAM compliance

| Measure | Evidence | Pass criteria |
|---------|----------|---------------|
| Genre family count | GAM type inventory | **V-01** ≥4 families |
| Not table-only | GAM types | **V-02** Pass (no AP-01) |
| Consolidation body | GAM text | **V-03** ≥80 words |
| Worked example | GAM | **V-04** stepped sample |
| Scenario alignment | GAM per activity | **V-05** Pass where applicable |
| Capstone shape | GAM A5 | **V-06** Pass |
| Judgement cells | GAM tables | **V-07** Pass |
| ≠ EV-01-only set | Type list | **V-12** Pass |

### C. Workbook functions (38C-1)

| Measure | Evidence | Pass criteria |
|---------|----------|---------------|
| R1–R7 | Composed page JSON | **V-10** Pass — all rules [38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) |
| Function scores | Page + GAM | Present/Partial/Absent per [38C-1 §3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) |
| Genre label | Derived | **self_study_workbook** not activity_sheet only |

### D. Learner experience

| Measure | Evidence | Pass criteria |
|---------|----------|---------------|
| Experience checklist | HTML export | **V-11** mandatory E-items **Y** ([38C-5 §9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md)) |
| Journey stages | Render + page | Teaching before practice · closure visible |
| Solo feasibility | Tasks + cards | **E15** Y |

### E. Preservation integrity

| Measure | Evidence | Pass criteria |
|---------|----------|---------------|
| B4 table syntax | Gate / manual | **V-13** **PASS** |
| GAM→DP body match | Diff GAM vs page `materials` | No unintended loss ([38B preserve](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/)) |
| Ownership | Process review | GAM authors; DP composes — no role swap |

**Dual report required:** **Workbook: PASS/FAIL** and **Preservation: PASS/FAIL** — never conflated.

---

## 6. Before/after scorecard

*Fill **AFTER** when post-contract artefacts exist. **BEFORE** frozen from §3.*

| Metric | BEFORE (EV-01) | AFTER (TBD) | EV-03 | CW-REF |
|--------|----------------|-------------|-------|--------|
| **Run ID** | `NEG-EV-01` | | `EV-03-G` | `CW-REF-38D3` |
| **Date** | 2026-06-04 | | — | planning |
| **Workbook overall** | **FAIL** | | Partial | **PASS** |
| **38C-1 genre** | activity_sheet + ref notes | | partial workbook | self_study_workbook |
| **V1 DLA** | FAIL | | Partial/Unk | PASS |
| **V2 GAM** | FAIL | | Partial | PASS |
| **V3 Page** | FAIL | | FAIL | PASS |
| **V4 Render** | FAIL | | Partial | PASS |
| **V13 Preservation** | **PASS** | | PASS | PASS |
| **Genre type count** | 4 | | 8 | ≥10 |
| **Type families** | 1 | | ≥4 | ≥4 |
| **AP-01 table-only** | **FAIL** | | PASS | PASS |
| **AP-02 capstone dump** | **FAIL** | | PASS | PASS |
| **AP-03 pre-fill rank** | **FAIL** | | Unk | PASS |
| **AP-04 scenario gap** | **FAIL** | | PASS | PASS |
| **Retrieval (R3)** | Partial | | Present | Present |
| **Consolidation (R4)** | Absent | | Partial | Present |
| **Worked ex. (R5)** | Absent | | Absent | Present |
| **Transfer (R6)** | Partial | | Partial | Present |
| **Teaching (R1)** | Partial | | Partial | Present |
| **Duration sum** | 125 min | | — | 60 min |
| **consolidation_summary** | No | | No | Yes |
| **sample_output / example** | No | | No | Yes |
| **scenario** | No | | Yes | Yes |
| **task_cards / checklist** | No | | Yes | Yes |
| **E2 teaching** | Partial | | Partial | Y |
| **E5 worked example** | N | | N | Y |
| **E9 self-check** | N | | Partial | Y |
| **E13 consolidation** | N | | N | Y |
| **E14 closure** | N | | N | Y |
| **E15 solo** | N | | Partial | Y |
| **E16 table overload** | N | | Partial | Y |
| **E17 ref dump end** | N | | PASS | Y |
| **R1** | Partial | | Partial | Present |
| **R2** | Present | | Present | Present |
| **R3** | Partial | | Present | Present |
| **R4** | Absent | | Absent | Present |
| **R5** | Absent | | Absent | Present |
| **R6** | Partial | | Partial | Present |
| **R7** | Fail (duration/solo) | | — | Pass |

### 6.1 Delta columns (AFTER vs BEFORE)

| Δ field | How to compute |
|---------|----------------|
| **Workbook flip** | FAIL → PASS on overall |
| **Family Δ** | AFTER families − 1 |
| **Critical rules fixed** | Count V-02, V-03, V-04, V-10 R4/R5 restored |
| **Preserve hold** | V-13 AFTER = PASS |

---

## 7. Success signals

### 7.1 Minimum success (first after run)

| Signal | Criterion |
|--------|-----------|
| **AP-01 cleared** | **V-02 Pass** — not table-only |
| **Workbook flip** | Overall **FAIL → PASS** OR **FAIL → Partial** with R4 Present |
| **Preservation** | **V-13 Pass** — no B4 regression |
| **Genre families** | **≥2** (improvement from 1) |

*Minimum does **not** require full `CW-REF-38D3` match.*

### 7.2 Strong success

| Signal | Criterion |
|--------|-----------|
| **Workbook PASS** | [38D-4 §6.3](38D-4-workbook-validation-criteria.md) G1–G6 |
| **R1–R4 Present** | V-10 Pass on mandatory functions |
| **Consolidation** | **V-03 Pass** · R4 Present |
| **Retrieval** | R3 Present · V-05 Pass |
| **Families** | **≥4** · **V-01 Pass** |
| **Duration** | **V-08 Pass** (50–70 min) |
| **Preservation** | V-13 Pass |

### 7.3 Exceptional success

| Signal | Criterion |
|--------|-----------|
| **Near-canonical** | AFTER scorecard ≥90% match to [CW-REF-38D3](../fixtures/canonical-workbook-reference-manifest.md) rows |
| **All V-01–V-12 Pass** | Full GAM contract |
| **E1–E17** | All mandatory **Y** on render |
| **Exceeds EV-03** | Passes clauses EV-03 still fails (exposition, example, full consolidation) |

---

## 8. Regression protection (38-B)

**Must not regress** when implementing workbook contracts:

| Protected gain | Check on AFTER | Source |
|----------------|----------------|--------|
| **GAM→DP table preserve** | `materials.*` bodies match GAM for table keys | [38B-W3-4](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W3-4-inflation-gate-evidence.md) |
| **B4 pipe-table syntax** | **V-13 Pass** | 38-B MONITORING programme |
| **Step ownership** | DLA specs · GAM authors · DP composes | [38C-3 §3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) |
| **Prompt architecture** | No reopen of 38-B Wave 3 size programme | [38C-6 §3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-6-planning-synthesis-and-execution-recommendation.md) |
| **LD-MATERIALS-COPY** | New genres copied verbatim — not summarised | 38-B modules |
| **LD-TABLE-FIDELITY** | Tables still valid when used | 38-B modules |

**Allowed:** New **non-table** genres on page — not a preservation regression.

**Forbidden:** Fixing workbook by moving pedagogy into Design Page inventing bodies GAM did not author ([38D-2 §5.1](38D-2-gam-workbook-genre-contract.md)).

---

## 9. Interpretation guide

| Case | Pattern | Implications |
|------|---------|--------------|
| **A** | Workbook **improves** · Preservation **holds** | **Hypothesis confirmed** — contracts effective; proceed to harden gates / optional 38-E composition |
| **B** | Workbook **improves** · Preservation **regresses** | **Stop** — fix preserve before workbook rollout; do not accept genre gain at cost of B4 |
| **C** | Preservation **holds** · Workbook **still FAIL** | Contracts **not yet in pipeline** or DLA still under-specifies; diagnose V1 vs V2 ([38D-4 §9](38D-4-workbook-validation-criteria.md)) |
| **D** | **No meaningful change** | Table-only persists — implementation did not reach GAM/DLA packs or brief not workbook-flagged |

### Decision tree (AFTER run)

```text
V-13 AFTER?
  FAIL → Case B path — preserve fix first
  PASS → V-02 AFTER?
    FAIL → Case C/D — still table-only
    PASS → V-10 AFTER?
      PASS → Case A — strong/minimal per §7
      FAIL → Case C — genres exist but functions thin
```

---

## 10. Execution readiness

**This slice does not run AFTER.** Before rerun, implementation evidence should include:

| # | Evidence required | Validates |
|---|-------------------|-----------|
| 1 | Pack/step changes enacting [38D-1](38D-1-dla-workbook-contract.md) + [38D-2](38D-2-gam-workbook-genre-contract.md) | V1/V2 obligations reachable |
| 2 | Brief or DLA path sets `resource_intent: self_study_workbook` | Workbook scope |
| 3 | Inflation capture brief aligned to workbook (not workshop-only DLA) | Same anchor, fair compare |
| 4 | Committed **DLA JSON** for after run | V-09 auditable |
| 5 | GAM + Design Page + render captures stored under [artefacts/](../artefacts/) | §6 scorecard fill |
| 6 | B4 gate re-run on AFTER artefacts | V-13 |
| 7 | Optional: genre-mix probe (planning concept [38D-4 §10](38D-4-workbook-validation-criteria.md)) | V-02 early exit |
| 8 | Product sign-off that **38-D planning** is accepted | Charter → implementation |

**Not required for planning closure:** Live AFTER artefacts.

---

## 11. Sprint 38-D closure recommendation

### 11.1 Contract work status

| Phase | Status |
|-------|--------|
| 38D-1 DLA contract | **COMPLETE** |
| 38D-2 GAM contract | **COMPLETE** |
| 38D-3 Canonical fixture `CW-REF-38D3` | **COMPLETE** |
| 38D-4 Validation model | **COMPLETE** |
| 38D-5 Evaluation plan | **COMPLETE** |

**Sprint 38-D planning charter:** **FULFILLED** — all phases delivered.

### 11.2 Is execution justified?

| Question | Answer |
|----------|--------|
| Problem evidenced? | **Yes** — EV-01 FAIL with preserve PASS ([38C-2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md)) |
| Contracts defined? | **Yes** — [38D-1](38D-1-dla-workbook-contract.md) · [38D-2](38D-2-gam-workbook-genre-contract.md) |
| PASS target defined? | **Yes** — [38D-3](38D-3-canonical-workbook-fixture.md) |
| Validation repeatable? | **Yes** — [38D-4](38D-4-workbook-validation-criteria.md) |
| Evaluation planned? | **Yes** — this document |
| **Execution justified?** | **Yes** — subject to product approval of implementation sprint |

### 11.3 Recommended next programme step

| Step | Recommendation |
|------|----------------|
| **1** | Charter **Sprint 38-D-EXEC** (or **38-E Implementation**) — pack/prompt changes for DLA/GAM workbook contracts on self-study briefs |
| **2** | Run Inflation **AFTER** with §6 scorecard |
| **3** | Record Case A/B/C/D per §9 |
| **4** | Keep **38-E** deferred: composition/renderer UX until AFTER V2 Pass |
| **5** | Do **not** reopen 38-B except V-13 regression checks |

---

## 12. Completion statement

| Criterion | Met? |
|-----------|------|
| Reviewer can run before/after evaluation | §4–§6 · §9 |
| Success criteria explicit | §7 |
| Preservation + workbook both assessed | §5E · §8 · dual columns |
| Implementation out of scope | §10 |
| EV-01 frozen as BEFORE | §3 |
| Complete evaluation framework | §5 |
| Reusable scorecard | §6 |
| 38-B gains protected | §8 |
| Transition to execution | §11 |
| Slice 38D-5 | **COMPLETE** |

**Sprint 38-D:** **CLOSED** (planning) — 2026-06-04.

**Reviewer check:** Open §6 — BEFORE column is complete for EV-01; run AFTER pipeline only when §10 evidence exists, then fill AFTER column and apply §7 tiers.
