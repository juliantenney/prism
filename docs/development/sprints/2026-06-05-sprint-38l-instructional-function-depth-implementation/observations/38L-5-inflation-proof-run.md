# Slice 38L-5 — Inflation proof run

**Date:** 2026-06-05  
**Status:** **COMPLETE** (evidence capture)  
**Type:** Proof run evaluation — no implementation changes  
**Harness:** `artefacts/ev-38l-inflation-pipeline-capture-once.mjs`  
**Run ID:** `EV-38L-AFTER`  
**Model:** `gpt-4.1-mini`  
**Predecessor:** [38L-4 closure integration](38L-4-closure-integration-and-evaluate-alignment.md)

---

## §1 Executive summary

The 38L proof harness executed successfully (~4 min). All `EV-38L-AFTER-*` artefacts were captured.

| Metric | EV-38G-AFTER | EV-38J-AFTER | EV-38L-AFTER |
|--------|--------------|--------------|--------------|
| GAM materials | 10 | 14 | **19** |
| A4 materials | 2 (consolidation capstone) | 5 (policy Evaluate form) | **8** (household closure pack) |
| LO4 driver | multi-LO consolidation | Summarize policy communication | **Evaluate household strategy** |
| Verification checklists (all activities) | 1 (A3 only) | 0 | **4** |
| A4 independent memo + transfer | Absent | Absent | **Present** |

**Primary question answer:** Yes — 38L moved the inflation workbook **materially closer** to 38I-4 target-state episodes. The page artefact now carries a visible instructional episode model: verification everywhere, Analyse worked analytic pass, and a household-strategy Evaluate capstone with independent judgement, verification, and transfer — not a policy-summary capstone.

**Verdict: C — Substantial improvement** (vs 38J/38G). Not **D — Near-target** vs 38I-4 A4: criteria rubric, Maya scenario fidelity, and guided-table discipline remain gaps.

**Artefacts:** `artefacts/EV-38L-AFTER-*` · `artefacts/EV-38L-vs-38J-comparison.json`

---

## §2 DLA comparison (38J vs 38L)

### Session structure

Both runs produce four activities (~60 min workbook). 38L maps **one primary LO per activity**; 38J stacks LOs on A1/A3 and uses a Summarize LO4.

### Material row counts

| Activity | 38J rows | 38L rows | Delta |
|----------|----------|----------|-------|
| A1 Understand | 3 | 4 | +verification checklist |
| A2 Apply | 3 | 3 | −sample_output (38L omits) |
| A3 Analyse | 3 | 4 | +worked analytic pass; +checklist; −prompt_set |
| A4 Evaluate | 5 | **8** | +template, +checklist, +transfer_prompt; substance change |

### New instructional functions in 38L DLA

| Function | 38J | 38L | Pack driver |
|----------|-----|-----|-------------|
| Universal verification | Absent | **Every activity** `checklist` | DLA-WB-26 |
| Analyse worked analytic pass | Absent | **M8** before `analysis_table` | DLA-WB-27 |
| Evaluate independent judgement | Absent | **M16** `template` | DLA-WB-28 / EV-CAP-04 |
| Evaluate verification | Absent | **M17** `checklist` | DLA-WB-28 |
| Evaluate transfer | Cognition field only | **M18** `transfer_prompt` | DLA-WB-28 / IFP-10 G2 |
| Household Evaluate anchor | Policy LO4 | **Evaluate LO4** household strategy | INF-EVAL-01 |

### A4 DLA substance shift (critical)

| | 38J A4 | 38L A4 |
|--|--------|--------|
| **Title** | Evaluate Inflation Management Strategies Using **Policy Communication** Criteria | Evaluating **Household Strategies** for Managing Inflation |
| **Mapped LO** | Summarize policy communication… | Evaluate strategies households can use… |
| **Criteria** | Clarity, credibility, expectations, stability (policy) | Depth, adaptability, transferability (generic) |
| **Scenario** | Central bank vs government communication | Maya household strategy menu A–E |
| **expected_output** | Decision table + consolidation only | **Independent memo** + checklist + transfer + consolidation |

38L DLA terminates Evaluate at independent memo + verification + transfer — not guided comparison alone (`EV-CAP-04` reflected in learner_task and expected_output).

---

## §3 GAM comparison (38J vs 38L)

### Volume and type coverage

| | 38J | 38L |
|--|-----|-----|
| Total Materials | 14 | **19** |
| `checklist` | 0 | **4** |
| `transfer_prompt` | 0 | **1** (A4) |
| `template` | 0 | **1** (A4) |

### Per-activity GAM realisation

**A1:** 38L adds **M4_Verification_Checklist_Understand** (4 items + repair path). 38J stops at sample_output.

**A2:** Both realise strong worked_example + practice table. 38J includes sample_output; **38L omits sample_output** on A2 (DLA gap). 38L adds **M7** verification checklist.

**A3:** 38J: scenario + empty analysis_table + prompt_set. **38L:** worked analytic pass (**M8**, ~1540 chars) → scenario → analysis_table → **verification checklist (M11, 5 items)**. This is the largest Analyse teaching upgrade vs 38J.

**A4:** 38J ends at guided decision_table + consolidation (policy scenarios). **38L realises full closure pack:**

| Material | Type | Present 38J | Present 38L |
|----------|------|-------------|-------------|
| Scenario | scenario | Policy scenarios | **Maya strategy menu** |
| Criteria | text/modelling_note | Policy criteria | Household criteria |
| Worked judgement | modelling_note | Weak/strong policy | Weak/strong household |
| Guided judgement | decision_table | Empty cells | **Partial exemplar scores** |
| Independent judgement | template | — | **M16 memo scaffold** |
| Verification | checklist | — | **M17 rubric audit** |
| Transfer | transfer_prompt | — | **M18 own-context** |
| Closure | consolidation_summary | Session summary | Scaffold reflection |

### Anti-depth-collapse observation

38L generally avoids merging checklist/template/transfer into consolidation. **Exception:** A4 guided table (**M15**) pre-fills Depth/Adaptability/Transferability scores for strategies A–E — approaches AP-03 pre-ranked judgement risk; 38I-4 guided table leaves learner cells empty with hints only.

---

## §4 Page artefact comparison (38J vs 38L)

*Most important section — what the learner page now carries.*

### A4 page materials keys

**38J** (`EV-38J-AFTER-design-page.json`):

- `evaluation_criteria` (policy)
- `policy_scenarios`
- `modelling_note`
- `decision_table`
- *No* `independent_judgement_template`, `verification_checklist_evaluate`, `transfer_prompt_evaluate`

**38L** (`EV-38L-AFTER-design-page.json`):

- `scenario_maya_strategy_menu`
- `criteria_exposition_evaluate`
- `worked_judgement_weak_vs_strong`
- `guided_judgement_table`
- **`independent_judgement_template`** ← new on page
- **`verification_checklist_evaluate`** ← new on page
- **`transfer_prompt_evaluate`** ← new on page
- `consolidation_summary_evaluate`

### New instructional functions visible on page (38L vs 38J)

| Function | First appears on page (38L) |
|----------|----------------------------|
| Verification checklist (A1) | A1 materials block |
| Verification checklist (A2) | A2 materials block |
| Worked analytic pass | A3 — precedes scenario/table in GAM order; referenced in learner_task |
| Verification checklist (A3) | A3 materials block |
| Evaluate independent memo scaffold | **A4** — dedicated template section |
| Evaluate verification rubric | **A4** — checklist section |
| Evaluate transfer | **A4** — transfer prompt section |
| Household Evaluate cognition | A4 `cognitive_level: Evaluate`, household concepts |

### expected_output shift (page-level contract)

| Run | A4 expected_output |
|-----|-------------------|
| 38J | Decision table + consolidation summary |
| 38L | **Independent judgement memo** + verified checklist + transfer response + consolidation |

The page artefact now encodes the **instructional episode model** from 38I: teach → model → guide → perform → verify → transfer — not LO→task shell ending at guided comparison.

### Rendered workbook

`EV-38L-AFTER-workbook.md` mirrors GAM bodies activity-by-activity (436 lines). All 19 Materials appear with purpose labels. Workbook is delivery-ready evidence of function survival through Page composition.

---

## §5 Activity-by-activity evaluation (A1–A4)

Classification: **Absent** · **Partial** · **Substantial** · **Near-target**

### A1 — Understand

| Function | 38J | 38L | 38I-4 E1 ref |
|----------|-----|-----|--------------|
| Exposition | Substantial | Substantial | Near-target |
| Worked example | Substantial | Substantial | Near-target |
| Sample output | Substantial | Substantial | Partial |
| Verification | **Absent** | **Substantial** | Partial |
| Non-example / discrimination | Partial (misconception in spec) | Partial | Substantial |

**Function matrix (38L):** Orientation ✓ · Explanation ✓ · Example ✓ · Verification ✓ · Non-example ○

### A2 — Apply

| Function | 38J | 38L | 38I-4 E2 ref |
|----------|-----|-----|--------------|
| Worked example (L4) | Substantial | Substantial | Near-target |
| Process exposition | Substantial | Substantial | Substantial |
| Practice table | Substantial | Substantial | Near-target |
| Sample output | Substantial | **Absent** | Partial |
| Verification | **Absent** | **Substantial** | Partial |
| Transfer | Absent | Absent | Partial |

**Function matrix (38L):** Worked thinking ✓ · Guided practice ✓ · Verification ✓ · Transfer ○

**Note:** 38L retains Apply strength; adds verification. Minor regression: no A2 `sample_output` row.

### A3 — Analyse

| Function | 38J | 38L | 38I-4 E3 ref |
|----------|-----|-----|--------------|
| Worked analytic pass | **Absent** | **Substantial** | Near-target |
| Scenario (Maya/household) | Substantial | Substantial | Partial (less numeric detail) |
| Criteria lenses | Partial | **Substantial** (3 lenses) | Near-target |
| Guided analysis table | Substantial | Substantial | Substantial |
| Verification | Partial (prompt_set) | **Substantial** (checklist) | Substantial |

**Function matrix (38L):** Worked analytic pass ✓ · Lenses ✓ · Scenario ✓ · Guided matrix ✓ · Verification ✓

**Largest non-A4 upgrade:** A3 moves from empty worksheet risk (38J) to modelled walkthrough before matrix (38L).

### A4 — Evaluate (summary; detail §6)

| Function | 38J | 38L |
|----------|-----|-----|
| Perspectives | Substantial (policy) | Partial (household scenario) |
| Criteria | Substantial (policy) | Substantial (generic) |
| Worked judgement | Substantial | Substantial |
| Guided judgement | Substantial | Partial (pre-filled scores) |
| Independent judgement | **Absent** | **Substantial** |
| Verification | **Absent** | **Substantial** |
| Transfer | **Absent** | **Substantial** |

---

## §6 A4 Evaluate benchmark assessment

**Benchmark:** [38I-4 A4 household strategy episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)  
**Do not use:** policy-summary quality (38J capstone).

### Function-by-function classification

| Required function | EV-38J-AFTER A4 | EV-38L-AFTER A4 | 38I-4 A4 benchmark |
|-------------------|-----------------|-----------------|---------------------|
| **Perspectives** | Substantial *(wrong domain: policy scenarios)* | **Partial** — Maya menu + strategy list; lacks Step 1 competing household/saver/income-seeker lenses | **Near-target** |
| **Criteria** | Substantial *(policy rubric)* | **Partial** — 3 criteria (depth/adaptability/transferability) not household-operational (purchasing-power, essential resilience, feasibility, downside risk) | **Near-target** |
| **Worked judgement** | Substantial | **Substantial** — weak slogan vs criteria-led contrast with trade-offs | **Near-target** |
| **Guided judgement** | Substantial — empty learner cells | **Partial** — table structure good but **pre-filled 1–5 scores** for A–E | **Near-target** |
| **Independent judgement** | **Absent** | **Substantial** — memo template with sections, starters, word band | **Near-target** |
| **Verification** | **Absent** | **Substantial** — 4-item criteria-linked checklist + repair | **Near-target** |
| **Transfer** | **Absent** (cognition hint only) | **Substantial** — ≥80 word own-household prompt | **Near-target** |

### Substance alignment (household benchmark)

| Check | 38J | 38L | 38I-4 |
|-------|-----|-----|-------|
| Evaluate LO = household strategy | ✗ Summarize policy | ✓ Evaluate household | ✓ |
| Maya named scenario | ✗ | ✓ (generic Maya household) | ✓ (£2,400, essentials split) |
| Strategy menu A–E budget actions | ✗ | Partial (different option set) | ✓ |
| Policy communication as capstone driver | ✗ (was driver) | ✓ demoted | ✓ context only |
| Independent memo required | ✗ | ✓ | ✓ 220–280 words |

**38L vs 38J on A4:** Correct benchmark **domain** (household) and **closure completeness** (memo + verify + transfer). **38L vs 38I-4:** Form chain largely present; **rubric and scenario depth** not yet near-target.

---

## §7 Success criteria review

| Criterion | 38J | 38L | Pass/Fail (38L) |
|-----------|-----|-----|-----------------|
| Verification on **all** activities | Fail (0 checklist Materials) | **Pass** (M4, M7, M11, M17) | **PASS** |
| Analyse worked pass present | Fail | **Pass** (M8) | **PASS** |
| Evaluate memo present | Fail | **Pass** (M16 template) | **PASS** |
| Evaluate verification present | Fail | **Pass** (M17) | **PASS** |
| Evaluate transfer present | Fail | **Pass** (M18) | **PASS** |

**38L: 5/5 pass** on implementation sprint success checks.

---

## §8 Remaining gap (EV-38L-AFTER → 38I-4)

**Estimated distance: moderate** — function **architecture** near 38I-4; function **substance and depth** partial.

| Gap | Evidence |
|-----|----------|
| **Criteria rubric mismatch** | 38L uses depth/adaptability/transferability; 38I-4 uses purchasing-power protection, essential-expense resilience, feasibility, downside risk tied to Maya's fixed income |
| **Scenario numerics** | 38I-4: £2,400 income, £950 rent, 5% inflation, £800 buffer; 38L: qualitative Maya household without budget constants |
| **Competing perspectives** | 38I-4 Step 1 explicit household/cautious-saver/income-seeker lenses; 38L jumps to strategy menu |
| **Strategy menu content** | 38I-4 options are budget actions (cut discretionary, renegotiate tariffs, pause saving, pay review, inflation-linked assets); 38L options are higher-level (maintain spending, increase income, invest, etc.) |
| **Guided table anti-spoiler** | M15 pre-fills ratings; 38I-4 leaves scores empty with justification prompts |
| **A1 discrimination ladder** | No dedicated non-example Material (optional O1 in 38K) |
| **A2 sample_output** | DLA omitted row present in 38J |

**Material count:** 38L 19 vs 38I-4 estimated ~20–22 — count near parity; **teaching depth per function** is the remaining delta.

---

## §9 Verdict

### Choice: **C — Substantial improvement**

### Evidence summary

**vs EV-38J-AFTER (primary comparator)**

- GAM materials **14 → 19** (+5); A4 **5 → 8** Materials  
- LO4 **Summarize policy** → **Evaluate household strategy** (frozen LO + INF-EVAL-01 effect)  
- Page artefact gains **three new A4 instructional functions** never present in 38J: independent judgement template, verification checklist, transfer prompt  
- Universal verification and Analyse worked analytic pass appear for the first time in the inflation proof lineage  
- A4 substance shifts from policy communication judgement to household strategy evaluation — aligning with 38L-4 benchmark intent  

**vs EV-38G-AFTER**

- 38G capstone is consolidation-only; no dedicated Evaluate episode  
- 38L introduces full Evaluate-shaped capstone with instructional function chain  

**vs 38I-4 target-state**

- Episode **model** (perspectives → criteria → worked → guided → independent → verify → transfer) is **visible on page and in workbook**  
- Episode **calibration** (Maya constants, household rubric, empty guided cells, competing perspectives) remains **partial** — not yet **D — Near-target**  

### Conclusion

Instructional sufficiency obligations (R1–R7) **did produce materially richer workbook episodes**. The page artefact now visibly carries the instructional episode model defined in 38I — especially on A3 and A4. The proof run validates 38L implementation; remaining work is **depth calibration toward 38I-4 prose**, not architectural change.

---

## Artefacts index

| Artefact | Path |
|----------|------|
| Run log | `artefacts/EV-38L-AFTER-run-log.json` |
| DLA | `artefacts/EV-38L-AFTER-dla-learning-activities.json` |
| GAM | `artefacts/EV-38L-AFTER-gam.txt` · `artefacts/EV-38L-AFTER-gam.json` |
| Page | `artefacts/EV-38L-AFTER-design-page.json` |
| Workbook | `artefacts/EV-38L-AFTER-workbook.md` |
| LO (frozen) | `artefacts/EV-38L-AFTER-learning-outcomes.json` |
| Comparison | `artefacts/EV-38L-vs-38J-comparison.json` |

**Comparators (unchanged):** `../2026-06-05-sprint-38j-instructional-function-planning/artefacts/EV-38J-AFTER-*` · `../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-*` · [38I-4 A4 benchmark](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)

---

**Parent:** [38L observations index](README.md) · **Sprint:** 38-L · **Next:** **38L-6** Sprint closure (not started — evidence-only slice complete)
