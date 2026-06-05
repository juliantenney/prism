# 38L — Instructional function loss trace (forensic)

**Date:** 2026-06-05  
**Run:** `EV-38L-AFTER` · harness `ev-38l-inflation-pipeline-capture-once.mjs` (38L-4b)  
**Captured:** `2026-06-05T12:14:01Z` · model `gpt-4.1-mini`  
**Method:** Read-only inspection of frozen pipeline artefacts + `buildUtilityStructuredHtmlForTest` render of `EV-38L-AFTER-design-page.json` (no code/pack changes, no re-run).

**Comparator:** 38I-4 A4 evaluate learner episode (`38I-4-a4-evaluate-learner-episode.md`) — stepped instructional episode vs 38L function-chain workbook contract.

---

## §1 Executive summary

**Primary finding:** Instructional functions are **not lost uniformly**. The trace splits into two different failure modes:

| Activity | Where richness survives | Where it breaks | Learner-facing symptom |
|----------|-------------------------|-----------------|----------------------|
| **A3 Analyse** | DLA → GAM → Page JSON (full bodies) | **Episode shape + render order** | Functions exist but **do not read as a 38I-style episode** (checklist appears before worked pass; guided/independent analysis are fused into one `analysis_table`) |
| **A4 Evaluate** | DLA → GAM (19 materials, full chain) | **Page composition** (LLM thin/replace) | Rendered page shows **keys for every function** but bodies are **catalogue stubs** — feels like “worksheet + checklist” not stepped judgement episode |

**Critical evidence:**

- `EV-38L-AFTER-workbook.md` (built from **GAM text**) shows **full A4 episode materials** (strategy menu A–E, weak/strong worked judgement, rich guided table).
- `EV-38L-AFTER-design-page.json` + rendered HTML show **A4 scenario 222 chars vs GAM 817**, **worked judgement 248 vs 1050**, **guided table collapsed to generic “Partial example” cells**.
- A3 page JSON **matches GAM lengths** (worked pass 1616, analysis table 1901) — loss is **structural/sequencing**, not missing upstream emission.

**Run path note:** This artefact predates the post-run `page-gam-materials-preserve` merge (`gam_materials_preserve_applied` absent in page metadata). Forensic conclusion for A4 thinning remains **Page composition** as the drop stage for GAM-rich bodies.

---

## §2 A3 trace — Analyse inflation household impact

**Activity ID:** `A3_Analyse_Inflation_Household_Impact`  
**Expected 38I-style trajectory:** worked_analytic_pass → guided analysis → independent analysis → verification

### KM / LO (upstream anchors)

| Stage | Household / Analyse anchor | Instructional relevance |
|-------|---------------------------|-------------------------|
| **LO** | Outcome 3: Analyse household budgets (fixed vs variable); notes reference distribution, adaptation, time-horizon lenses | ✓ Supports analytic episode |
| **KM** | Concepts: fixed-income household, variable-income household, household budget impact; relations on purchasing-power erosion; evaluation criteria concepts present for downstream A4 | ✓ Substance available for worked pass + table |

Neither KM nor LO emits instructional **functions** — they anchor content only. **Not a loss stage.**

### DLA inspection — `required_materials` (complete)

| material_id | type | purpose | Maps to target function |
|-------------|------|---------|-------------------------|
| M8_Worked_Analytic_Pass_Household_Inflation | worked_example | worked analytic pass | **worked_analytic_pass** ✓ |
| M9_Scenario_Maya_Households | scenario | practice scenario with multiple household types | **scenario** (context, not in 9-function list) |
| M10_Analysis_Table_Household_Comparison | analysis_table | learner completes analysis of inflation effects | **guided_analysis** + **independent_analysis** (fused) |
| M11_Checklist_Analyse | checklist | verification and self-check | **verification_checklist** ✓ |

**DLA does not emit** separate `guided_analysis` or `independent_analysis` material rows — both are **structurally conflated** into `analysis_table` (partial exemplar rows + learner entry rows). `scaffold_hint_sequence` correctly orders: worked pass → scenarios → table → checklist.

**Target function check (DLA):**

| Function | DLA |
|----------|-----|
| worked_analytic_pass | ✓ M8 |
| guided_analysis | ✓ (as analysis_table exemplar rows, not separate type) |
| analysis_table | ✓ M10 |
| criteria_rubric | — (A4 only) |
| worked_judgement | — |
| guided_judgement | — |
| independent_judgement_template | — |
| verification_checklist | ✓ M11 |
| transfer_prompt | — |

### GAM inspection — `EV-38L-AFTER-gam.json` activity materials

| material_id | type | contentLen | Target function |
|-------------|------|------------|-----------------|
| M8 | worked_example | 1616 | worked_analytic_pass ✓ |
| M9 | scenario | 733 | scenario context ✓ |
| M10 | analysis_table | 1901 | guided + independent analysis ✓ (pipe table, 2 exemplar rows + 2 learner rows) |
| M11 | checklist | 604 | verification_checklist ✓ |

All four DLA rows realised with depth-shaped bodies. **No loss at GAM generation for A3.**

### Page inspection — `EV-38L-AFTER-design-page.json` materials keys

```
worked_analytic_pass, scenario_maya_households, analysis_table, checklist
```

| Key | Body length | vs GAM | Present? |
|-----|-------------|--------|----------|
| worked_analytic_pass | 1616 | = GAM | ✓ full |
| scenario_maya_households | 733 | = GAM | ✓ full |
| analysis_table | 1901 | = GAM | ✓ full pipe table |
| checklist | 604 | = GAM | ✓ full |

**No A3 material loss at Page composition** in this run.

### Render inspection — `buildUtilityStructuredHtmlForTest` (A3 activity block)

**Visible material blocks (in render order):**

1. **Checklist** (verification) — rendered **first**
2. **Worksheet** — full analysis table
3. **Worked Analytic Pass** — full stepwise pass
4. **Scenario Maya Households** — full Maya/Carlos scenarios

**Not visible as separate blocks:** guided_analysis, independent_analysis (embedded inside Worksheet table).

**Why it feels like “scenario + template + checklist”:**

- Learners may label the **Worksheet** block as “template.”
- **Checklist-first ordering** (`app.js` materials render: canonical `checklist` early path before `resolveWorksheetTableSource` and before `worked_analytic_pass` fallback) inverts the DLA `scaffold_hint_sequence`.
- No stepped **episode headings** (38I “Step 1 / Step 2”) — flat material stack.

### A3 per-function verdict

| Function | DLA | GAM | Page | Render | Lost At |
|----------|-----|-----|------|--------|---------|
| worked_analytic_pass | ✓ | ✓ | ✓ | ✓ (body present; **wrong order**) | **Not lost** (sequencing) |
| guided_analysis | ✓† | ✓† | ✓† | ✓† (inside Worksheet) | **Structural** — fused into analysis_table |
| analysis_table | ✓ | ✓ | ✓ | ✓ | **Not lost** |
| verification_checklist | ✓ | ✓ | ✓ | ✓ (renders **before** worked pass) | **Not lost** (renderer ordering) |

†Same material row; not a distinct function slot in DLA/GAM schema.

---

## §3 A4 trace — Evaluate household inflation strategy

**Activity ID:** `A4_Evaluate_Household_Inflation_Strategy`  
**Expected 38I-style trajectory:** scenario → criteria → worked judgement → guided judgement → independent judgement → verification → transfer

### KM / LO

| Stage | Evaluate anchor | Relevance |
|-------|-----------------|-----------|
| **LO** | Outcome 4: Evaluate household strategies with criteria and trade-offs; 38I-4 A4 benchmark note | ✓ |
| **KM** | Household inflation management strategy, evaluation criteria, scenario-based evaluation, transferability | ✓ |

### DLA inspection — `required_materials` (complete)

| material_id | type | purpose | Target function |
|-------------|------|---------|-----------------|
| M12_Scenario_Maya_Strategy_Menu | scenario | Maya household + neutral strategy menu A–E | **scenario** ✓ |
| M13_Criteria_Exposition_Evaluate | text | criteria exposition | **criteria_rubric** ✓ |
| M14_Worked_Judgement_Weak_Strong | modelling_note | worked judgement weak/strong | **worked_judgement** ✓ |
| M15_Guided_Judgement_Table | decision_table | guided judgement partial exemplar | **guided_judgement** ✓ |
| M16_Independent_Judgement_Template | template | independent judgement memo scaffold | **independent_judgement_template** ✓ |
| M17_Checklist_Evaluate | checklist | verification rubric | **verification_checklist** ✓ |
| M18_Transfer_Prompt_Evaluate | transfer_prompt | transfer to learner context | **transfer_prompt** ✓ |
| M19_Consolidation_Summary | consolidation_summary | closure (not in 9-function list) | session closure |

Full **8-function Evaluate chain** present in DLA with depth_floor L3 specs. **No loss at DLA emission.**

### GAM inspection

| material_id | type | contentLen | Substantive? |
|-------------|------|------------|--------------|
| M12 scenario | scenario | 817 | ✓ Strategy A–E menu |
| M13 criteria | text | 720 | ✓ depth/adaptability/transferability |
| M14 worked judgement | modelling_note | 1050 | ✓ weak + strong exemplars |
| M15 guided table | decision_table | 1711 | ✓ rich partial exemplar rows |
| M16 independent template | template | **218** | **⚠ thin** — memo header only; no section bodies/word-band scaffold |
| M17 checklist | checklist | 621 | ✓ |
| M18 transfer | transfer_prompt | 684 | ✓ ≥80-word task |
| M19 consolidation | consolidation_summary | 1029 | ✓ |

**GAM preserves function **order** and **count**.** Independent template is the **first depth gap** (richness/calibration at GAM generation vs DLA spec).

### Page inspection — materials keys vs GAM body lengths

| Page key | Page len | GAM len | Δ | Substantive content? |
|----------|----------|---------|---|----------------------|
| scenario_maya_strategy_menu | 222 | 817 | **−73%** | ✗ catalogue sentence |
| criteria_exposition_evaluate | 429 | 720 | −40% | ⚠ shortened rubric |
| worked_judgement_weak_strong | 248 | 1050 | **−76%** | ✗ synopsis only |
| guided_judgement_table | 687 | 1711 | **−60%** | ✗ generic “Partial example” shell |
| independent_judgement_template | 255 | 218 | +17% | ✗ meta scaffold description (not memo) |
| checklist_evaluate | 591 | 621 | −5% | ✓ largely preserved |
| transfer_prompt_evaluate | 280 | 684 | **−59%** | ⚠ shortened prompt |
| consolidation_summary | (present) | 1029 | thinned | ⚠ |

**All function keys survive on page** — loss is **body fidelity**, not omission. Stage: **Page composition** (LLM compose thinned/replaced despite LD-MATERIALS-COPY prompt contract). Artefact has no `gam_materials_preserve_applied` metadata.

### Render inspection — visible to learners

Rendered HTML includes **all eight material headings** for A4:

- Scenario Maya Strategy Menu — **stub body** (no Strategy A–E list)
- Criteria Exposition Evaluate — shortened
- Worked Judgement Weak Strong — **one-paragraph synopsis** (no weak/strong exemplars)
- Guided Judgement Table — **collapsed 5×5 shell** (not GAM exemplar judgements)
- Independent Judgement Template — **bullet list of what memo should contain** (not writable memo scaffold)
- Checklist Evaluate — visible
- Transfer Prompt Evaluate — visible (shortened)
- Consolidation Summary — visible (shortened)

**Renderer mapping:** Non-canonical keys (`checklist_evaluate`, `guided_judgement_table`, etc.) render via `Object.keys(materials).forEach` fallback in `app.js` — **not dropped at render**. `guided_judgement_table` is outside `resolveWorksheetTableSource` key order but still renders as a table.

**Workbook.md vs rendered page:** `EV-38L-AFTER-workbook.md` Activity 4 sections quote **full GAM bodies** (e.g. Strategy A–E, weak/strong judgement, full guided table). If stakeholders compare workbook export to **composed page render**, they will see a sharp **Page-stage** fidelity cliff.

---

## §4 Survival matrix

### A3 — Analyse

| Function | DLA | GAM | Page | Render | Lost At |
|----------|-----|-----|------|--------|---------|
| worked_analytic_pass | ✓ | ✓ | ✓ | ✓ | **Not lost** (episode order inverted in render) |
| guided_analysis | ✓† | ✓† | ✓† | ✓† | **Structural** — no separate function row |
| analysis_table | ✓ | ✓ | ✓ | ✓ | **Not lost** |
| criteria_rubric | — | — | — | — | N/A (A3) |
| worked_judgement | — | — | — | — | N/A |
| guided_judgement | — | — | — | — | N/A |
| independent_judgement_template | — | — | — | — | N/A |
| verification_checklist | ✓ | ✓ | ✓ | ✓ | **Not lost** (renders before model pass) |
| transfer_prompt | — | — | — | — | N/A |

### A4 — Evaluate

| Function | DLA | GAM | Page | Render | Lost At |
|----------|-----|-----|------|--------|---------|
| worked_analytic_pass | — | — | — | — | N/A |
| guided_analysis | — | — | — | — | N/A |
| analysis_table | — | — | — | — | N/A |
| criteria_rubric | ✓ | ✓ | ✓ | ✓ | **Page composition** (richness/calibration) |
| worked_judgement | ✓ | ✓ | ✓‡ | ✓‡ | **Page composition** |
| guided_judgement | ✓ | ✓ | ✓‡ | ✓‡ | **Page composition** |
| independent_judgement_template | ✓ | ✓† | ✓‡ | ✓‡ | **GAM generation** (thin) + **Page composition** (meta replace) |
| verification_checklist | ✓ | ✓ | ✓ | ✓ | **Not lost** |
| transfer_prompt | ✓ | ✓ | ✓‡ | ✓‡ | **Page composition** (richness/calibration) |

†GAM M16 only 218 chars (header stub vs DLA “memo structure + word band” spec).  
‡Key present; body thinned vs GAM — learner sees stub/synopsis not instructional episode.

### Scenario (A4 capstone context)

| Function | DLA | GAM | Page | Render | Lost At |
|----------|-----|-----|------|--------|---------|
| scenario (strategy menu) | ✓ | ✓ | ✓‡ | ✓‡ | **Page composition** |

---

## §5 Root-cause classification

### A3

| Issue | Classification | Responsible path | Explanation |
|-------|----------------|------------------|-------------|
| No separate guided/independent analysis materials | **Structural** | DLA `required_materials` design (`EV-38L-AFTER-dla-learning-activities.json` M10) | 38L packs guided + independent into one `analysis_table`; 38I episode uses distinct steps |
| Checklist renders before worked pass | **Renderer mapping** (ordering) | `app.js` `renderActivityMaterials` early checklist path (~L29999) before worksheet/worked fallback loop | Bodies present; pedagogical sequence inverted |
| “Worksheet + checklist” feel | **Richness/calibration** (presentation) | Render stack + absence of episode framing | Not missing JSON fields; missing 38I-style step choreography |

### A4

| Function | Why it disappeared | File / path | Loss type |
|----------|-------------------|-------------|-----------|
| scenario (A–E menu) | LLM compose replaced 817-char GAM scenario with 222-char catalogue sentence | `EV-38L-AFTER-design-page.json` ← Design Page LLM step (`step_design_page`) | **Page composition** / prompt compliance failure |
| criteria_rubric | Shortened exposition (429 vs 720 chars) | Same | **Page composition** / richness |
| worked_judgement | Synopsis replaced weak/strong exemplars (248 vs 1050) | Same | **Page composition** |
| guided_judgement | Collapsed decision table to generic partial cells (687 vs 1711) | Same | **Page composition** |
| independent_judgement_template | GAM already thin (218); page replaced with meta bullet scaffold (255) | GAM: `EV-38L-AFTER-gam.json` M16; Page: compose | **GAM generation** + **Page composition** |
| transfer_prompt | Shortened vs GAM (280 vs 684) | Page compose | **Page composition** |
| verification_checklist | Largely preserved | — | **Not lost** |

**Not responsible in this trace:**

- DLA obligation validator (passes — functions declared)
- GAM sanitiser (19 materials, types match DLA)
- Renderer omission (A4 keys all appear in HTML)
- KM / LO (anchors present)

---

## §6 Highest-leverage next intervention

**Ranked by evidence from this trace only** (no solution design here):

1. **Page composition fidelity for A4 (and any activity where page len ≪ GAM len)**  
   - **Evidence:** A3 page lengths = GAM; A4 page lengths 40–76% below GAM on scenario, worked judgement, guided table, transfer.  
   - **Leverage:** Restores capstone instructional episode in **rendered learner page** without changing DLA/GAM packs.  
   - **Stage label:** Page composition (+ programmatic GAM→page merge on compose path for runs like `EV-38L-AFTER`).

2. **GAM depth calibration for `independent_judgement_template` (M16)**  
   - **Evidence:** DLA spec requires memo sections + word band; GAM delivers 218-char header only.  
   - **Leverage:** Fixes independent judgement **before** page stage; required for 38I-4 A4 episode parity even with perfect page copy.

3. **A3 episode shape (structural + render order)**  
   - **Evidence:** Functions exist end-to-end; checklist-first render and fused analysis_table prevent 38I-style stepped episode reading.  
   - **Leverage:** Lower than A4 body loss — pedagogical **presentation** not upstream emission failure.

4. **Workbook vs page export clarity**  
   - **Evidence:** `EV-38L-AFTER-workbook.md` is GAM-faithful; rendered page is not. Stakeholders reviewing workbook may think pipeline is healthy while page export is thin.  
   - **Leverage:** Diagnostic — align “source of truth” for learner-facing QA on **design-page.json + render**, not workbook.md alone.

---

## Success criterion check

We can now state **exactly** where 38I-style instructional episodes fail to appear in the final rendered workbook:

| Activity | Blocking stage | Mechanism |
|----------|----------------|-----------|
| **A3** | Structural DLA shape + renderer ordering | Functions exist with full bodies; episode choreography and material order do not match 38I stepped model |
| **A4** | **Page composition** (primary) | GAM-rich judgement chain thinned to stubs in `EV-38L-AFTER-design-page.json`; render faithfully exposes stubs; GAM-only workbook still looks complete |

**Artefacts used:**  
`EV-38L-AFTER-{knowledge-model,learning-outcomes,dla-learning-activities,gam,gam.txt,design-page,workbook,run-log}.json|md`  
**Harness:** `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` (official 38L path; not 38H).
