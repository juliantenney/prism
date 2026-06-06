# 38M-5 — Inflation proof run

**Date:** 2026-06-05  
**Status:** **COMPLETE** (evidence capture)  
**Type:** Proof run evaluation — harness + artefacts  
**Harness:** `artefacts/ev-38m-inflation-pipeline-capture-once.mjs`  
**Run ID:** `EV-38M-AFTER`  
**Model:** `gpt-4.1-mini`  
**Captured:** `2026-06-05T14:10:09Z`  
**Predecessor:** [38M-4 A3 sequencing](38M-4-a3-analyse-sequencing-fidelity.md)

---

## §1 Executive summary

The 38M proof harness executed the full inflation pipeline (~4 min). All `EV-38M-AFTER-*` artefacts were captured.

| Question | Answer |
|----------|--------|
| Has the **L4 compose fidelity cliff** (38M-1) been closed? | **Yes** — post-merge GAM→Page aggregate ratio is **100%** for A1–A4, including A4 capstone materials |
| Does raw LLM Design Page still thin bodies? | **Yes** — pre-merge A4 aggregate ratio **7%** (worse than EV-38L’s 45%); compose merge restores full GAM bodies |
| Do hard gates G1–G10 pass on fresh run? | **Partial** — ratio/substance gates pass; **G4/G5 marker literals** fail on fresh GAM phrasing despite 100% body parity |
| Is A3 sequencing preserved? | **Page JSON yes** · **Render no** — duplicate alias keys bypass `materials_order` early-path ordering |
| Regression tests | **17/17 pass** (`page-38m-a3-sequencing` + `page-38m-gam-preservation` + `page-38l-gam-preservation`) |

**Verdict:** **CONDITIONAL SUCCESS** for Sprint 38-M mission (page composition fidelity). The gap identified in 38M-1 is **resolved at compose output**. Residual harness-gate and render-order issues are documented for 38M-6 closure — they do not reopen the L4 synopsis-replacement failure mode.

**Artefacts:** `artefacts/EV-38M-AFTER-*` · `artefacts/EV-38M-vs-38L-comparison.json`

---

## §2 Harness configuration

| Setting | Value |
|---------|-------|
| Script | `artefacts/ev-38m-inflation-pipeline-capture-once.mjs` |
| Version | `38M-5` |
| Run prefix | `EV-38M-AFTER` |
| Model | `gpt-4.1-mini` |
| Frozen LO | `../2026-06-05-sprint-38l-…/artefacts/ev-38l-frozen-learning-outcomes.json` |
| Output dir | `artefacts/` (this sprint) |
| Comparator | `EV-38L-AFTER-*` (38L sprint artefacts) |

**Pipeline path:**

```text
Brief → Learning Content → Knowledge Model → frozen LO → DLA → GAM → Design Page (LLM)
  → applyPedagogicCognitionSemanticsToComposedPage
      → applyGamMaterialsToComposedPage (38M-2 merge)
      → applyA3MaterialsSequencingToComposedPage (38M-4)
  → validate38MPageFidelity
  → validate38LPageGamPreservation (regression)
  → validateA3MaterialsSequencing
  → buildUtilityStructuredHtmlForTest → validateA3RenderMaterialOrder
```

**Libs loaded in sandbox:** `page-gam-materials-preserve.js`, `page-a3-materials-sequencing.js`, `app.js` (compose + render test API).

**Command:**

```bash
node docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/artefacts/ev-38m-inflation-pipeline-capture-once.mjs
```

**Regression tests (run separately):**

```bash
node --test tests/page-38m-a3-sequencing.test.js tests/page-38m-gam-preservation.test.js tests/page-38l-gam-preservation.test.js
```

---

## §3 Artefacts written

| Artefact | Purpose |
|----------|---------|
| `EV-38M-AFTER-learning-content.json` | Upstream LC |
| `EV-38M-AFTER-knowledge-model.json` | KM (7 concepts) |
| `EV-38M-AFTER-learning-outcomes.json` | Frozen LO contract |
| `EV-38M-AFTER-dla-learning-activities.json` | DLA with IFP §5 obligations |
| `EV-38M-AFTER-gam.json` / `gam.txt` | **20** GAM materials |
| `EV-38M-AFTER-design-page-raw.txt` | LLM compose **before** 38M merge |
| `EV-38M-AFTER-design-page.json` | Composed page **after** merge + A3 sequencing |
| `EV-38M-AFTER-render.html` | `buildUtilityStructuredHtmlForTest` output |
| `EV-38M-AFTER-workbook.md` | Workbook assembly |
| `EV-38M-AFTER-run-log.json` | Validation metrics + comparator |
| `EV-38M-vs-38L-comparison.json` | Structured EV-38L vs EV-38M summary |

---

## §4 Validation results

### 4.1 Overall proof status

| Check | Result |
|-------|--------|
| `proofOk` (harness) | **false** |
| `validation38M.ok` | **false** (3 errors) |
| `validation38LRegression.ok` | **false** (1 error — schema false negative) |
| `a3Sequencing.pageJson.ok` | **true** |
| `a3Sequencing.render.ok` | **false** |
| Regression tests | **17/17 pass** |

### 4.2 Gate matrix (charter proof requirements)

| Requirement | Target | EV-38M-AFTER post-merge | Notes |
|-------------|--------|-------------------------|-------|
| **G1** M14 ratio ≥90% | Tier-A | **PASS** (100%) | `worked_judgement_weak_strong` body restored from GAM |
| **G2** M15 ratio ≥90% | Tier-A | **PASS** (100%) | `guided_judgement_table` / decision table restored |
| **G3** Strategy A + E | Tier-A | **PASS** (content) | Strategy menu in `scenarios[]`; marker gate not invoked when key is `scenarios` not `scenario_maya_strategy_menu` |
| **G4** Weak/Strong exemplars | Tier-A | **FAIL** (markers) | GAM uses “Weak Judgement (Slogan-style)” not “Weak Evaluation Example” |
| **G5** Budget Tightening exemplar | Tier-A | **FAIL** (markers) | Fresh guided table has no “Budget Tightening” literal; body at 100% ratio |
| **G6** Transfer ≥80% | Tier-B | **PASS** (100%) | “at least 80 words” marker present |
| **G7** A3 M8–M10 ≥99% | — | **PASS** (100%) | Bodies intact post-merge |
| **G8** Checklists ≥80 chars | — | **PASS** | All activities |
| **G9** `gam_materials_preserve_applied` | — | **PASS** | `metadata.gam_materials_preserve_schema: "38M-2"` |
| **G10** No synopsis on Tier-A | — | **PASS** | `lossType: none` on Tier-A rows post-merge |
| **G15/G16** A3 `materials_order` | 38M-4 | **PASS** (page JSON) | Order: worked_analytic_pass → analysis_table → scenario_maya_households → checklist |
| **A3 render order** | 38M-4 | **FAIL** | Checklist h4 at pos 44691 precedes worked pass at 74201 |

### 4.3 `validate38M` errors (fresh run)

```text
A4:M14_Worked_Judgement_Weak_Strong:G4:missing marker Weak Evaluation Example
A4:M14_Worked_Judgement_Weak_Strong:G4:missing marker Strong Evaluation Example
A4:M15_Guided_Judgement_Table:G5:missing Budget Tightening exemplar
```

These are **marker literal** failures only. Corresponding `fidelityMetrics` rows show **100% char ratio** and `lossType: none`.

### 4.4 Page metadata (post-compose)

```json
{
  "gam_materials_preserve_applied": true,
  "gam_materials_preserve_schema": "38M-2",
  "a3_materials_sequencing_applied": true
}
```

---

## §5 Fidelity metrics

### 5.1 Aggregate GAM→Page ratio by activity

| Activity | EV-38L-AFTER (raw page) | EV-38M pre-merge | EV-38M post-merge |
|----------|-------------------------|------------------|-------------------|
| A1 | 100% | 56% | **100%** |
| A2 | 99% | 54% | **100%** |
| A3 | 100% | 30% | **100%** |
| A4 | **45%** | **7%** | **100%** |

**Interpretation:** Fresh LLM compose on this run produced a **more severely thinned** raw page than frozen EV-38L (A4 7% vs 45%). The 38M compose merge consistently restores **full GAM bodies** regardless of upstream thinning severity.

### 5.2 A4 capstone materials (post-merge, EV-38M-AFTER)

| Contract key | Tier | GAM len | Page len | Ratio | Substantive | lossType |
|--------------|------|---------|----------|-------|-------------|----------|
| `worked_judgement_weak_strong` | A | 1,082 | 1,082 | 100% | ratio ✓ / markers ✗ | none |
| `guided_judgement_table` | A | 1,542 | 1,542 | 100% | ratio ✓ / markers ✗ | none |
| `transfer_prompt_evaluate` | B | 752 | 752 | 100% | ✓ | none |
| `independent_judgement_template` | C | 1,352 | 1,352 | 100% | ✓ | none |
| `consolidation_summary` | B2 | 738 | 738 | 100% | ratio ✓ | none |

**Tier-A/B parity targets (≥90% / ≥80%):** **Met on character ratio** for all capstone fields after merge.

**No synopsis replacement post-merge:** All Tier-A `lossType` values are `none` (pre-merge raw page showed `severe_compression` and `synopsis_replacement` patterns on the same run).

### 5.3 Pre-merge cliff (same run — design-page-raw)

Raw LLM output before `applyPedagogicCognitionSemanticsToComposedPage`:

- A4 aggregate ratio **7%** — confirms L4 compose remains the loss stage
- A3 `worked_analytic_pass` ratio **0%** on raw page — merge restores from GAM
- Multiple activities show `severe_compression` on checklist/classification keys — merge restores

This replicates the 38M-1 finding on a **fresh** pipeline execution, not only on frozen EV-38L.

---

## §6 Comparator analysis vs EV-38L-AFTER

| Dimension | EV-38L-AFTER | EV-38M-AFTER |
|-----------|--------------|--------------|
| GAM materials | 19 | **20** |
| Raw page `gam_materials_preserve_applied` | absent | N/A (raw) |
| Composed page preserve flag | absent | **true** (`38M-2`) |
| A3 `materials_order` | absent | **present** |
| A4 GAM→Page (no 38M merge) | 45% | 7% pre-merge |
| A4 GAM→Page (with 38M merge) | N/A | **100%** |
| `validate38M` on page | 13 errors (38L raw) | 3 marker errors (fresh merged) |
| A3 render pedagogical order | inverted (38M-1) | **still inverted** on fresh page |

**38L baseline (from run-log `comparator38L`):** Frozen EV-38L design-page without 38M merge fails all A4 Tier-A gates — consistent with [38M-1](38M-1-baseline-page-fidelity-analysis.md).

**38M improvement:** Compose merge closes the fidelity cliff that 38L left at L4. Upstream DLA/GAM depth from this run is comparable (20 vs 19 materials; household Evaluate capstone present).

**Frozen-workload proof (regression tests):** Replaying `EV-38L-AFTER` artefacts through the compose path passes `validate38MPageFidelity` and A3 render order (17/17 tests). Fresh-run gaps are **phrasing and alias-key variance**, not merge logic failure.

---

## §7 Render spot-check

`EV-38M-AFTER-render.html` generated from composed page JSON.

| Check | Result |
|-------|--------|
| A4 Strategy A–E menu in output | **Present** (from `scenarios[]` merge) |
| A4 weak/strong judgement prose | **Present** (full modelling-note body) |
| A4 guided decision table | **Present** (full table, not shell) |
| A4 transfer prompt | **Present** (≥80 words instruction) |
| A3 material h4 order | **Incorrect** — checklist precedes worked pass |

A4 render faithfully exposes merged page JSON richness. A3 render regression is caused by **duplicate alias keys** on the fresh composed page (`checklist_evaluate`, `worked_example`, `verification_checklist`, `scenarios`) that trigger renderer early paths before the `materials_order` declared-order loop. EV-38L replay tests avoid this because the frozen page has a leaner key set.

---

## §8 Residual issues (for 38M-6)

| ID | Issue | Severity | Recommended 38M-6 action |
|----|-------|----------|--------------------------|
| **R1** | Marker gates G4/G5 use EV-38L literal strings | Harness false negative | Generalize markers to semantic patterns (e.g. `/Weak.{0,20}Judgement/i`) or gate on ratio+anti-synopsis only |
| **R2** | `scenario_maya_strategy_menu` vs `scenarios[]` key mapping | G3 coverage gap on variant schemas | Extend `FIDELITY_CONTRACTS` / page-key resolver for `scenarios` array |
| **R3** | A3 render order fails when alias keys proliferate | Learner-facing sequencing | Mark alias keys consumed when `materials_order` path renders; suppress duplicate checklist/scenario early paths |
| **R4** | `validate38LPageGamPreservation` false negative on fresh schema | Harness noise | Scope 38L validator to EV-38L key layout or run only on frozen comparator |
| **R5** | M19 consolidation marker “Reflect on the key” | Soft warning | Accept variant phrasing or downgrade to soft gate |
| **R6** | Fresh raw page thinner than EV-38L (A4 7% vs 45%) | Upstream variance | Monitor L4 prompt; out of 38M scope unless 38M-1 identifies prompt gap |

---

## §9 Closure recommendation for 38M-6

| Criterion | Met? |
|-----------|------|
| Page composition fidelity gap (38M-1) resolved | **Yes** — post-merge 100% A4 body parity |
| Tier-A ≥90% parity | **Yes** (ratio) |
| Tier-B ≥80% parity | **Yes** (ratio) |
| No synopsis replacement (post-merge) | **Yes** |
| No table-shell collapse (post-merge) | **Yes** |
| A3 body fidelity 100% | **Yes** |
| A3 sequencing in page JSON | **Yes** |
| A3 sequencing in render (fresh run) | **No** — R3 |
| G1–G10 all pass (harness, fresh run) | **No** — R1/R2 marker literals |
| No 38L/38M test regression | **Yes** — 17/17 |

**Recommendation:** Proceed to **38M-6 sprint closure** with **SUCCESS (mission)** and **documented residuals (R1–R4)**. The sprint mission — prevent Design Page compose from summarising GAM instructional bodies — is **proven** on `EV-38M-AFTER`. Closure should:

1. Record **CONDITIONAL SUCCESS** on F5 proof gates (ratio/substance pass; marker/render qualifiers).
2. Carry R1–R3 as **post-sprint harness hardening** or **38N** if render alias suppression exceeds 38M hold scope.
3. Retain `EV-38M-AFTER-*` and `EV-38L-AFTER-*` as frozen comparators.
4. Not reopen 38-L DLA/GAM depth work — upstream GAM on this run is substantively rich.

---

## §10 References

- [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
- [38M-1 baseline](38M-1-baseline-page-fidelity-analysis.md)  
- [38M-2 preservation model](38M-2-page-composition-preservation-model.md)  
- [38M-3 A4 implementation](38M-3-a4-evaluate-fidelity-implementation.md)  
- [38M-4 A3 sequencing](38M-4-a3-analyse-sequencing-fidelity.md)  
- [38L-5 proof run](../../2026-06-05-sprint-38l-instructional-function-depth-implementation/observations/38L-5-inflation-proof-run.md)  
- `artefacts/EV-38M-AFTER-run-log.json`  
- `artefacts/EV-38M-vs-38L-comparison.json`
