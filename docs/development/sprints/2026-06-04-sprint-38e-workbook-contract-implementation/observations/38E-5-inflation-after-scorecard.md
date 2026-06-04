# Slice 38E-5 — Inflation AFTER run and scorecard

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) § 38E-5  
**Authority:** [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38E-4](38E-4-contract-regression-fixture-check.md)  
**Out of scope:** Further pack/`app.js`/renderer changes during scoring

---

## 1. Purpose

Execute the **post-contract Inflation self-study learner** pipeline capture (same brief intent as frozen **EV-01**), store **AFTER** artefacts under this sprint pack only, and complete the [38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) before/after scorecard with **separate Workbook and Preservation verdicts**.

**Success for this slice:** AFTER artefacts saved; explicit dual verdicts; BEFORE unchanged; outcome interpreted via [38D-5 §9 Cases](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) A–D.

---

## 2. Inputs and run context

| Field | Value |
|-------|--------|
| **Run ID** | `EV-38E5-AFTER` |
| **Captured** | 2026-06-04T14:47:19Z |
| **Model** | `gpt-4.1-mini` (`PRISM_PROBE_MODEL` default) |
| **Brief** | Same inflation self-study intent as EV-01 ([38D-5 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md)) |
| **Pack state** | 38E-2 §5 DLA-WB + 38E-3 §6 GAM-WB in `domain-learning-design-step-patterns.md` |
| **Harness** | [artefacts/ev-38e5-inflation-pipeline-capture-once.mjs](../artefacts/ev-38e5-inflation-pipeline-capture-once.mjs) |
| **Pipeline** | LO (minimal) → DLA → GAM (`sanitizeSelfDirectedGamMaterialsOutput`) → Design Page (`applyPedagogicCognitionSemanticsToComposedPage`) → render excerpt via `buildUtilityStructuredHtmlForTest` |
| **Runtime** | `app.js` + `lib/*` loaded in VM (read-only for scoring — no edits this phase) |
| **DLA user gate** | Mandatory `resource_intent: self_study_workbook`, `workbook_contract_applied: true`, 60 min target |
| **BEFORE** | Frozen **NEG-EV-01** — [38B fixtures](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/) — **not overwritten** |

**Prompt surface (chars):** DLA augmented **10 145** (vs EV-01 capture ~4 690); GAM **10 090** (vs ~5 033); Design Page **20 555** (vs ~22 560).

---

## 3. Artefacts captured

| Artefact | Path |
|----------|------|
| GAM output | [artefacts/EV-38E5-AFTER-gam.txt](../artefacts/EV-38E5-AFTER-gam.txt) |
| Design Page JSON | [artefacts/EV-38E5-AFTER-design-page.json](../artefacts/EV-38E5-AFTER-design-page.json) |
| DLA JSON | [artefacts/EV-38E5-AFTER-dla-learning-activities.json](../artefacts/EV-38E5-AFTER-dla-learning-activities.json) |
| Render excerpt | [artefacts/EV-38E5-AFTER-render-excerpt.html](../artefacts/EV-38E5-AFTER-render-excerpt.html) |
| Run log / metrics | [artefacts/EV-38E5-AFTER-run-log.json](../artefacts/EV-38E5-AFTER-run-log.json) |
| Reproduce | `node docs/development/sprints/2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/ev-38e5-inflation-pipeline-capture-once.mjs` (requires `.env.local` `OPENAI_API_KEY`) |

---

## 4. BEFORE summary (frozen EV-01)

Per [38D-5 §3](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) and [negative-exemplar-ev01-index.md](../../2026-06-04-sprint-38d-workbook-authoring-contracts/fixtures/negative-exemplar-ev01-index.md):

| Dimension | EV-01 |
|-----------|-------|
| **Workbook** | **FAIL** |
| **Preservation** | **PASS** |
| **GAM types** | 4 table types only |
| **Families** | 1 (table) |
| **AP-01 … AP-04** | All **FAIL** |
| **Duration** | 125 min |
| **R4 / R5** | Absent |

---

## 5. AFTER workbook assessment

### 5.1 Layer verdicts ([38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md))

| Layer | Verdict | Rationale |
|-------|---------|-----------|
| **V1 DLA** | **Partial / Pass-major** | `delivery_notes` correct; `required_materials` lists 7 non-table-cap types; duration **65 min** (**V-08 Pass**); 4 activities (spec allows 4–6). Some DLA-WB closure types not specified (`consolidation_summary`, `worked_example`, `retrieval_check`). |
| **V2 GAM** | **FAIL** | **V-02 Pass** (not table-only). **V-03 Fail** — no `consolidation_summary` body ≥80 words. **V-04 Fail** — no `sample_output` / `worked_example`. **V-01 Fail** — 3 families, not ≥4 (missing **closure** family). **V-12 Pass**. **V-05 Pass** (Johnson scenario authored). **V-06 Pass** (capstone template + prompts, not table dump). **V-07 Pass** (ranking cells empty). |
| **V3 Page** | **FAIL** | GAM omissions block **V-10**: R4/R5 not Present on page; genre uplift visible but not full workbook PASS. |
| **V4 Render** | **Partial** | Excerpt captured; structured HTML utility path shows content but limited semantic `<table>` in excerpt — JSON review primary. |
| **Workbook overall** | **FAIL** | Critical **V-03**, **V-04**, **V-10** not satisfied. |

### 5.2 Anti-patterns (AP-01 … AP-04)

| AP | Verdict | Evidence |
|----|---------|----------|
| **AP-01 table-only** | **PASS** | 7 GAM types; families: narrative, table, structured_practice |
| **AP-02 reference-dump capstone** | **PASS** | A4 = `template` + `prompt_set` only (no four-table dump) |
| **AP-03 pre-filled judgement** | **PASS** | A3 ranking/justification columns empty |
| **AP-04 scenario not authored** | **PASS** | A2 `scenario` + `analysis_table` + `prompt_set` |

### 5.3 Genre and inventory

| Metric | AFTER |
|--------|-------|
| **GAM unique types** | `text`, `classification_table`, `scenario`, `analysis_table`, `prompt_set`, `task_cards`, `template` (7) |
| **Type families** | **3** (narrative, table, structured_practice) — **not** 4 |
| **Material lines** | 10 across 4 activities |
| **38C-1 genre label** | **Partial self_study_workbook** (teaching + practice + eval; thin closure) |

### 5.4 38C-1 functions (R1–R7)

| Rule | Score | Notes |
|------|-------|-------|
| **R1 Teaching** | **Present** | A1 `text` exposition (~1.4k chars) |
| **R2 Practice** | **Present** | Tables, scenario, task_cards, templates |
| **R3 Retrieval** | **Partial** | `prompt_set` reflection; no `checklist` / `retrieval_check` / `self_check` |
| **R4 Consolidation** | **Absent / Partial** | A4 reflection prompts + page “Consolidation and Reflection” section text; **no** `consolidation_summary` genre body |
| **R5 Worked example** | **Absent** | No stepped `sample_output` / `worked_example` |
| **R6 Transfer** | **Partial** | `transfer_or_application_task` in DLA A3/A4; capstone template |
| **R7 Session design** | **Pass** | 65 min; solo-feasible tasks |

### 5.5 V-01 … V-12 checklist

| ID | Result |
|----|--------|
| V-01 | **Fail** (3 families) |
| V-02 | **Pass** |
| V-03 | **Fail** |
| V-04 | **Fail** |
| V-05 | **Pass** |
| V-06 | **Pass** |
| V-07 | **Pass** |
| V-08 | **Pass** (65 min) |
| V-09 | **Pass** (non-table DLA spec) |
| V-10 | **Fail** (R4/R5) |
| V-11 | **Partial** (not fully audited on render) |
| V-12 | **Pass** |

### 5.6 Workbook verdict (explicit)

> **Workbook: FAIL** (material uplift vs EV-01; not [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) PASS)

---

## 6. AFTER preservation assessment

| Check | Result | Evidence |
|-------|--------|----------|
| **B4-01 comma-row / CSV table** | **Pass** | No comma-row or Headers/Rows patterns in page `materials` |
| **B4-02 Headers/Rows dump** | **Pass** | Not observed |
| **Pipe tables** | **Pass** | `classification_table`, `analysis_table`, ranking `template` retain `\|…\|` markdown on page |
| **GAM → Design Page copy** | **Pass** | A1 classification table and A2 scenario/analysis_table bodies match GAM verbatim (modulo `prompt_set` → array normalisation) |
| **New genres on page** | **Allowed** | `explanatory_text`, `scenario`, `task_cards` — not a preservation regression |
| **Design Page inventing table bodies** | **No** | Tables sourced from GAM |

### 6.1 Preservation verdict (explicit)

> **Preservation: PASS** ([38D-4 V-13](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md))

*Preservation PASS does not imply workbook PASS.*

---

## 7. Before/after scorecard

Per [38D-5 §6](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md). Comparator columns from planning authority.

| Metric | BEFORE (EV-01) | AFTER (38E-5) | EV-03 | CW-REF |
|--------|----------------|---------------|-------|--------|
| **Run ID** | `NEG-EV-01` | `EV-38E5-AFTER` | `EV-03-G` | `CW-REF-38D3` |
| **Date** | 2026-06-04 | 2026-06-04 | — | planning |
| **Workbook overall** | **FAIL** | **FAIL** | Partial | **PASS** |
| **38C-1 genre** | activity_sheet + ref notes | partial workbook | partial workbook | self_study_workbook |
| **V1 DLA** | FAIL | Partial/Pass-major | Partial/Unk | PASS |
| **V2 GAM** | FAIL | FAIL (uplift) | Partial | PASS |
| **V3 Page** | FAIL | FAIL (uplift) | FAIL | PASS |
| **V4 Render** | FAIL | Partial | Partial | PASS |
| **V13 Preservation** | **PASS** | **PASS** | PASS | PASS |
| **Genre type count** | 4 | **7** | 8 | ≥10 |
| **Type families** | 1 | **3** | ≥4 | ≥4 |
| **AP-01 table-only** | **FAIL** | **PASS** | PASS | PASS |
| **AP-02 capstone dump** | **FAIL** | **PASS** | PASS | PASS |
| **AP-03 pre-fill rank** | **FAIL** | **PASS** | Unk | PASS |
| **AP-04 scenario gap** | **FAIL** | **PASS** | PASS | PASS |
| **Retrieval (R3)** | Partial | Partial | Present | Present |
| **Consolidation (R4)** | Absent | Partial | Partial | Present |
| **Worked ex. (R5)** | Absent | Absent | Absent | Present |
| **Transfer (R6)** | Partial | Partial | Partial | Present |
| **Teaching (R1)** | Partial | **Present** | Partial | Present |
| **Duration sum** | 125 min | **65 min** | — | 60 min |
| **consolidation_summary** | No | No | No | Yes |
| **sample_output / example** | No | No | No | Yes |
| **scenario** | No | **Yes** | Yes | Yes |
| **task_cards / checklist** | No | task_cards only | Yes | Yes |
| **R1** | Partial | **Present** | Partial | Present |
| **R2** | Present | Present | Present | Present |
| **R3** | Partial | Partial | Present | Present |
| **R4** | Absent | Partial | Partial | Present |
| **R5** | Absent | Absent | Absent | Present |
| **R6** | Partial | Partial | Partial | Present |
| **R7** | Fail | **Pass** | — | Pass |

### 7.1 Delta (AFTER vs BEFORE)

| Δ | Value |
|---|--------|
| **Workbook flip** | FAIL → FAIL (no overall PASS) |
| **Family Δ** | +2 (1 → 3) |
| **Type Δ** | +3 types (4 → 7) |
| **AP fixes** | 4/4 anti-patterns cleared |
| **Duration** | 125 → 65 min (**V-08** fixed) |
| **Preserve hold** | **Yes** (V-13 PASS) |
| **Critical gaps remain** | V-03, V-04, closure family, R5 |

---

## 8. Success tier

Per [38D-5 §7](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md):

| Tier | Met? | Notes |
|------|------|-------|
| **Minimum** | **Partially met** | **AP-01 cleared** ✓ · **≥2 families** ✓ (3) · **V-13 Pass** ✓ · Overall still **FAIL**; R4 not **Present** |
| **Strong** | **Not met** | No workbook PASS; no V-03/V-04; V-01 Fail |
| **Exceptional** | **Not met** | Far from CW-REF-38D3 |
| **Overall 38E-5 scoring slice** | **Met** | Artefacts + dual verdicts + case interpretation delivered |

---

## 9. Case interpretation

Decision tree [38D-5 §9](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md):

```text
V-13 AFTER? PASS
  → V-02 AFTER? PASS
    → V-10 AFTER? FAIL (R4/R5)
      → Case C — genres exist, functions still thin
```

| Case | Fit |
|------|-----|
| **A** | Partial — workbook **improves materially**; preservation **holds**; hypothesis **directionally** supported but not full PASS |
| **B** | **No** — preservation did not regress |
| **C** | **Primary** — preservation **PASS**, workbook **still FAIL** (missing consolidation + worked example + 4th family) |
| **D** | **No** — meaningful change vs table-only EV-01 |

**Interpretation:** Pack contracts **reached the live prompt surface** and changed GAM/DLA output (not Case D). Upstream genre mix improved and all EV-01 anti-patterns cleared, but **GAM did not author mandatory closure/worked-example genres** → Case **C** with strong partial uplift toward Case A.

---

## 10. Risks and caveats

| Risk | Detail |
|------|--------|
| **Single run** | One `gpt-4.1-mini` capture; no multi-run variance study |
| **Harness ≠ product UI** | VM pipeline with explicit DLA workbook flags; product brief path may differ |
| **Render excerpt** | Utility HTML builder; full learner render UX not re-validated (38-E out of scope) |
| **Activity count** | 4 activities vs EV-01’s 5 — still within DLA band |
| **Closure via prompts** | Reflection `prompt_set` may be mistaken for consolidation — does not satisfy **V-03** `consolidation_summary` |
| **38E-6 scope** | Further pack tightening or runtime gating may be needed before declaring programme success |

---

## 11. Follow-up recommendations

| Priority | Action |
|----------|--------|
| 1 | **38E-6** — Sprint closure: record Case C, recommend whether second implementation wave (GAM closure/example enforcement) is charter-amended or new sprint |
| 2 | **GAM pack** — Strengthen mandatory `consolidation_summary` + `worked_example` / `sample_output` realisation (38E-3 follow-up, pack-only unless 38E-1 amendment) |
| 3 | **DLA pack** — Require closure + example types in `required_materials` for capstone/opening activities (38E-2 follow-up) |
| 4 | **Optional** | Re-run AFTER with same harness after pack tweak; keep EV-01 BEFORE frozen |
| 5 | **Defer** | Renderer / Design Page composition UX (38-E non-goal until V2 stable) |

**Do not:** Treat preservation PASS as workbook PASS; overwrite 38-B EV-01 fixtures.

---

## 12. Completion statement

| Criterion | Met? |
|-----------|------|
| AFTER artefacts saved | **Yes** — `artefacts/EV-38E5-AFTER-*` |
| Workbook verdict explicit | **Yes** — **FAIL** |
| Preservation verdict explicit | **Yes** — **PASS** |
| BEFORE frozen | **Yes** — 38-B fixtures untouched |
| 38D-5 Cases A–D interpreted | **Yes** — **Case C** (partial uplift toward A) |
| No implementation during scoring | **Yes** |
| Slice 38E-5 | **COMPLETE** |

**Next:** **38E-6** — Sprint closure and programme recommendation.
