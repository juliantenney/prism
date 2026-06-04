# Sprint 38-C candidate — Design Page richness review (Inflation)

**Date:** 2026-06-04  
**Type:** Observation and evidence only — **no** runtime, prompt, test, or contract changes  
**Primary artefacts:** [EV-38B4-01](../fixtures/ev-38b4-01-design-page.json) same-run pipeline (DLA → GAM → Design Page)  
**Reference:** [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) · [38B-W3](38B-W3-design-page-authority-review.md) · [38B-3](38B-3-design-page-consolidation-plan.md) · [B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md) · `LD-DESIGN-PAGE-COMPOSE-CONTRACT` · `LD-MATERIALS-COPY`  
**Comparator run:** [EV-38B4-03](../fixtures/ev-38b4-03-inflation-gam-live.txt) (GAM with golden upstream DLA) · golden page `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`

---

## 1. Executive answers

| Research question | Answer | Confidence |
|-------------------|--------|------------|
| Is richness loss **real** for self-study quality? | **Yes** relative to programme intent (scenarios, cards, prompts, worked examples) | **High** (golden + EV-03 GAM) |
| Is richness loss **real** on GAM → Design Page for EV-01? | **No** for `materials.*` bodies — tables copied **verbatim** | **High** (artefact diff + [EV-38B4-02](EV-38B4-02-table-preservation-analysis.md)) |
| **Where** does loss occur? | Primarily **GAM authoring** under thin DLA `required_materials` in same run; secondarily **DLA/model task framing** (facilitated wording); **not** compose-contract stripping | **High** |
| Is loss **intentional**? | **Partially** — capture brief emphasised table types only; contracts intend **preserve**, not **thin** | **Medium** |
| Self-study quality impact? | Page reads as **reference tables + short tasks**, not a full **self-study workbook** | **High** |
| Future enhancement sprint justified? | **Yes** — likely **GAM + DLA material spec** track; **weak** evidence that Design Page compose alone caused the gap on this run | **Medium–high** |

---

## 2. Artefact inventory

| Layer | Committed artefact? | Path / note |
|-------|---------------------|-------------|
| **DLA** | **No** JSON saved in EV-01 capture | Inferred from Design Page activity rows + capture hint (table-only `required_materials`) |
| **GAM (same run)** | **Yes** | [ev-38b4-01-pipeline-gam.txt](../fixtures/ev-38b4-01-pipeline-gam.txt) — **1,360** words; **8** pipe tables; **0** scenario / task_card / prompt_set blocks |
| **Design Page** | **Yes** | [ev-38b4-01-design-page.json](../fixtures/ev-38b4-01-design-page.json) |
| **Rendered page** | **Partial** (first ~8k HTML) | [ev-38b4-01-render-excerpt.html](../fixtures/ev-38b4-01-render-excerpt.html) — pipe tables styled; no scenario cards (none in JSON) |
| **GAM (rich comparator)** | **Yes** | [ev-38b4-03-inflation-gam-live.txt](../fixtures/ev-38b4-03-inflation-gam-live.txt) — scenarios + cards + prompts when upstream matches golden DLA |
| **Golden workshop page** | **Yes** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` — multi-type `activity_materials` |

**Important:** W3-4 B4 gate validated **table syntax preservation** on EV-01; this review asks a **different** question — **instructional body richness**, not pipe fidelity.

---

## 3. Activity-by-activity comparison (GAM → Design Page, EV-01)

Classification key: **preserved verbatim** · **lightly edited** · **compressed** · **omitted** · **transformed**

### 3.1 Summary table

| Activity | GAM material elements | Design Page `materials` | GAM→DP disposition | Notes |
|----------|----------------------|-------------------------|--------------------|-------|
| **A1** | `classification_table` only | `classification_table` | **Preserved verbatim** | No scenario / task cards in GAM |
| **A2** | `comparison_table` only | `comparison_table` | **Preserved verbatim** | No `prompt_set`, checklist, worked example |
| **A3** | `analysis_table` only | `analysis_table` | **Preserved verbatim** | No household **scenario** prose in GAM (cf. EV-03, golden) |
| **A4** | `impact_table` only | `impact_table` | **Preserved verbatim** | No scenario narrative |
| **A5** | All four tables (reference) | Same four tables attached | **Preserved verbatim** (×4) | **Redundant duplication**, not compression |

### 3.2 Activity metadata (not in GAM text; composed on page)

| Activity | Fields present on page | vs self-directed intent | Disposition |
|----------|------------------------|-------------------------|-------------|
| A1–A4 | `activity_preamble`, `learner_task`, `expected_output`, `failure_mode` | A2 task says *"Work with your partner"*; A4 *"In your group"* | **Transformed** — facilitated interaction language on `page_profile: learner` |
| A5 | Above + `prior_knowledge_activation`, `reasoning_orientation`, `self_explanation_prompt`, `scaffold_hint_sequence`, `uncertainty_tension_prompt`, `transfer_or_application_task` | Adds PEL-style scaffolding | **Added** by Design Page / cognition pass — **increases** meta richness, not materials body |

### 3.3 Quantified materials (EV-01)

| Metric | GAM (`ev-38b4-01-pipeline-gam.txt`) | Design Page `materials.*` | Δ |
|--------|------------------------------------|---------------------------|---|
| Total words (all activities) | **~1,360** | **~1,106** in `materials` only* | Tables **match**; word delta from counting scope / normalisation |
| Table fields A1–A4 | 4 | 4 | 0 loss |
| Table fields A5 | 4 (duplicate set) | 4 | 0 loss; **+300%** redundancy vs A1–A4 |
| Scenario sections | **0** | **0** | — |
| Task cards | **0** | **0** | — |
| Discussion / self-check prompts in materials | **0** | **0** | — |
| Worked examples in materials | **0** | **0** | — |

\*Per-field char counts in [EV-38B4-01](EV-38B4-01-design-page-evidence.md): A1 **1,161**, A2 **1,343**, A3 **1,246**, A4 **1,727** — **identical** GAM ↔ page for primary tables.

### 3.4 Richness elements checklist (A1–A5)

| Element | GAM EV-01 | Design Page EV-01 | vs golden workshop | vs EV-03 GAM |
|---------|-----------|-------------------|--------------------|--------------|
| Named scenarios with numbers/names | **Absent** | **Absent** | **Lost** (never authored) | Present A1, A3, A4 |
| Task cards | **Absent** | **Absent** | **Lost** | Present A1 |
| Discussion / prompt sets | **Absent** | **Absent** | **Lost** | Present A2, A5 |
| Submission / self-check checklist | **Absent** | **Absent** | **Lost** | Present A2 |
| Worked example (facilitator note upstream) | **Absent** | **Absent** | **Lost** (support_note not in materials) | — |
| Pipe tables | **Present** | **Present** (verbatim) | Partial overlap | Present |
| Closure / reflection section on page | — | **Absent** (no dedicated section) | **Lost** | Partial in A5 prompts |

---

## 4. Richness-loss taxonomy

| ID | Pattern | Seen in EV-01? | Typical source (observed) |
|----|---------|----------------|---------------------------|
| **RL-01** | **Upstream never authored** — scenarios, cards, prompts missing before Design Page | **Yes** (primary) | GAM generation + DLA spec only listing `*_table` types in capture |
| **RL-02** | **Design Page omitted** `materials` bodies that existed in GAM | **No** on this run | — |
| **RL-03** | **Design Page compressed** table or prose bodies | **No** on this run | — |
| **RL-04** | **Task framing transformed** — facilitated “partner/group” on learner page | **Yes** (A2, A4) | Model + DLA activity JSON (not saved); not materials-copy contract |
| **RL-05** | **Redundant reference dump** — A5 carries full A1–A4 tables again | **Yes** | Design Page merge / model interpretation of synthesis as “reference all tables” |
| **RL-06** | **Metadata–content mismatch** — affordance assumes scenarios not in `materials` | **Yes** (A3 `va-A3-classification-01`) | Sprint 38 + thin GAM; not renderer |
| **RL-07** | **Programme shape gap** — encyclopaedic tables vs workbook narrative | **Yes** (whole page) | End-to-end brief + DLA material types vs golden workshop fixture |

---

## 5. Source-of-loss attribution

| Finding | GAM | DLA / capture brief | Design Page compose | `LD-MATERIALS-COPY` preserve | Page schema | Renderer | Model compression |
|---------|-----|---------------------|----------------------|------------------------------|-------------|----------|-------------------|
| No scenario prose A3 | **Primary** | **Primary** (spec) | Not observed | N/A (nothing to copy) | Allows `materials.scenario` | Would render if present | Possible at GAM |
| No task cards A1 | **Primary** | **Primary** | Not observed | — | — | — | GAM |
| Tables verbatim | Author OK | — | **Preserve OK** | Contract aligned | `materials.<key>` | Tables in HTML excerpt | — |
| Partner/group tasks | — | **Likely** | Composed fields | L5 fields, not L4 | — | — | **Likely** |
| A5 four-table repeat | **Primary** (GAM listed all four) | — | **Merged** all | Preserve = copy upstream | — | — | — |
| A3 affordance vs no scenarios | — | — | **Metadata only** | — | Sprint 38 root | No figure in excerpt | Model |

**Contract read-through:** `LD-DESIGN-PAGE-COMPOSE-CONTRACT` and `LD-MATERIALS-COPY` **preserve** role explicitly forbid summarising `materials` bodies; EV-01 behaviour **matches** preserve intent. Loss is **not** explained by Wave 3 compose consolidation **on this evidence**.

---

## 6. Severity assessment

| Finding | Severity | Rationale |
|---------|----------|-----------|
| Missing scenario narratives (A1, A3, A4) | **Pedagogical** · **Usability** | Self-study learners lack situated cases referenced in golden upstream tasks |
| Missing task cards / prompt sets / checklists | **Pedagogical** | Reduces scaffolding and self-check paths |
| Table-only materials (definitions filled in) | **Usability** | Reads as **reference sheet**; some cells pre-filled (A1 category column empty OK; EV-03 A1 table partly filled) |
| Facilitated learner_task wording | **Usability** · minor **Pedagogical** | Conflicts with `page_profile: learner` / self-directed rhetoric |
| A5 duplicate four tables | **Usability** | Scroll weight; not wrong syntax |
| A3 visual affordance without scenario material | **Pedagogical** (if figure generated) | Risk of generic or misaligned visual |
| No page-level study tips / knowledge summary | **Cosmetic** · **Usability** | Thinner navigation than golden fixture |
| B4 table syntax | **N/A** here | Addressed in W3-4 — **no regression** |

---

## 7. Project intent — page category

| Intended resource type | EV-01 Design Page fit |
|------------------------|----------------------|
| **Self-study learning resource** | **Weak** — tables + brief tasks; little narrative, reflection, or phased workbook |
| **Workshop support resource** | **Weak** — no facilitator_moves; wrong grouping language in tasks |
| **Reference sheet** | **Strong** — dense definitional / comparison tables |
| **Activity worksheet** | **Partial** — tables could be completed but lack scenario context and card prompts |

**Closest category today:** **Reference sheet with activity framing**, not a full **self-study workbook**.

**Alignment with 38B intent:** [38B-3](38B-3-design-page-consolidation-plan.md) targets **read-only compose** and **preserve** — achieved for tables. [LD-MATERIALS-COPY](../lib/ld-materials-copy.js) expects *“concrete scenarios, worked examples, … prompt sets”* when upstream provides them — **upstream did not** on EV-01.

---

## 8. Comparator evidence (confidence builders)

### 8.1 EV-38B4-03 GAM (richer upstream)

When GAM receives golden-shaped DLA (`buildInflationLearningActivities` from workshop fixture), output includes:

```text
A1: scenario + task_cards + classification_table
A2: comparison_table + prompt_set + checklist
A3: scenario (4 cases) + analysis_table
A4: scenario + impact_table
A5: prompt_set
```

**Implication:** GAM **can** author multi-type richness; EV-01 gap is **run-specification**, not an absolute platform ceiling. **Confidence: High.**

### 8.2 Golden workshop page

Merged golden page carries **~6 material types** across activities (scenario, task_cards, tables, prompt_set, checklist, …). EV-01 page carries **1 type** (tables only) in `materials`.

**Implication:** Gap vs **project reference** is large; gap vs **same-run GAM** is nil. **Confidence: High.**

---

## 9. Rendered page (EV-01 excerpt)

| Observation | Detail |
|-------------|--------|
| Pipe tables | CSS `table`, `th`, `td` present — tables **do** render |
| Scenario / task-card UI classes | Styles exist in CSS but **no** matching content in excerpt (consistent with JSON) |
| Sprint 38 figures | Not observed in excerpt (affordance metadata only; generation out of scope) |

**Confidence: Medium** — excerpt length-limited; full-page render not re-run.

---

## 10. Evidence excerpts

### 10.1 GAM EV-01 — table-only A3 (no scenario)

```text
Activity: Analyze Inflation Impact on Household Budgeting
Material: M3 (analysis_table)
Content:
| Expense Category | Price Before Inflation ($) | ...
```

### 10.2 GAM EV-03 — A3 with scenario + table (contrast)

```text
Material: M1 (scenario)
**Scenario A:** Retired couple living on a fixed pension...
Material: M2 (analysis_table)
| Scenario | Who is affected? | ...
```

### 10.3 Design Page EV-01 — A2 facilitated leakage in task (not materials)

```text
learner_task: "### Task\nWork with your partner to complete the comparison table..."
page_profile: "learner"
```

### 10.4 Compose contract (preserve intent)

```text
- MATERIALS FIDELITY (compose): visual_affordances[] are additive page-root metadata only
  — must not replace learning_activities.content[].materials
```

---

## 11. Observation-level recommendations (no fixes)

| # | What appears lost | Where | Likely cause | Evidence confidence |
|---|-------------------|-------|--------------|---------------------|
| 1 | Scenario narratives, named households | `materials` A1, A3, A4 | GAM did not author; DLA spec/capture emphasised tables | **High** |
| 2 | Task cards, prompt sets, checklists | `materials` | Same | **High** |
| 3 | Worked-example-style support | `materials` | Upstream `support_note` on workshop DLA not realised as GAM body in EV-01 | **Medium** |
| 4 | Self-check / closure prompts | Page sections + A5 materials | Not in GAM; no page `study_tips` / reflection section | **Medium** |
| 5 | Verbatim table bodies | — | **Not lost** GAM→DP | **High** |
| 6 | Facilitated task wording | `learner_task` | DLA/model; outside L4 preserve | **Medium** (no DLA JSON) |
| 7 | Synthesis workbook shape | A5 | Four-table reference dump vs plan template | **Medium** |

**Do not target first:** Design Page compose-contract stripping of table text — **unsupported** on EV-01.

**Candidate future sprint focus (observation only):** DLA `required_materials` completeness for self-directed Inflation; GAM author enforcement when spec lists `scenario` + `task_cards`; learner_task self-directed lint; optional A5 synthesis template — **not** Design Page dedupe.

---

## 12. Open questions

1. **DLA JSON** — commit `ev-38b4-01-pipeline-dla.json` on next capture to confirm `required_materials` vs composed `learner_task` provenance.  
2. **Post–Wave 3 live rerun** — does richer GAM appear when DLA lists non-table types under **24,771** char Design Page stack?  
3. **Sanitizer** — does `sanitizeSelfDirectedGamMaterialsOutput` drop non-table blocks? (Not inspected in this slice.)  
4. **Renderer** — full HTML for A3 without scenarios: learner experience vs golden workshop export.  
5. **Intentional table encyclopaedia** — is the self-directed Inflation brief meant to be table-first, making “loss” a **spec** debate not a **bug**?

---

## 13. Success criteria mapping

| Criterion | Met? |
|-----------|------|
| Richness loss real? | **Yes** vs programme/golden; **No** GAM→DP on same run |
| Where it occurs? | **GAM author** (+ DLA spec); minor **task framing** on page |
| Intentional? | **Partly** (capture brief); contracts say otherwise for upstream-provided bodies |
| Self-study quality affected? | **Yes** — page is reference-heavy, workbook-light |
| Future sprint justified? | **Yes** — upstream authoring track; **not** primarily Design Page preserve |

---

## 14. Sign-off

| Item | Status |
|------|--------|
| Sprint 38-C candidate review | **COMPLETE** (observation) |
| Code / prompt / test changes | **None** (per charter) |
| Implementation proposals | **Out of scope** |

**Cross-reference:** [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) (syntax gate PASS) · [EV-38B4-02](EV-38B4-02-table-preservation-analysis.md) (no D2 preserve failure).
