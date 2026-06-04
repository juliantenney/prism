# Slice 38F-7 — Retrieval definition and page-review setup

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Type:** **Analysis only** — no pack/code/tests · no pipeline run · **do not charter 38-G yet**  
**Builds on:** [38F-4](38F-4-inflation-after-scorecard.md) · [38F-5](38F-5-final-evaluation-and-sprint-closure.md) · [38F-6](38F-6-retrieval-validation-calibration.md)  
**Authority:** [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)

---

## 1. Purpose

Clarify whether **38C/38D** treat retrieval as an explicit **material-type** obligation or as a **learner-facing workbook function** that can be satisfied by active tasks (recall, application, classification, calculation, explanation, comparison, evaluation).

Use that clarification to:

1. Judge whether the **38F retrieval FAIL** is primarily **pedagogical** or **validation-policy** drift.  
2. Recommend whether to charter **38-G** now or **defer** for a detailed Inflation page review.  
3. Prepare a **manual page-quality checklist** for the next step.

---

## 2. Authority review

| Document | What it defines |
|----------|-----------------|
| **[38C-1 §1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)** | Workbook = what the **learner sees** on the composed page — functions, not upstream-only JSON |
| **[38C-1 §3.4 R2](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)** | **Guided practice** — structured attempt with task, materials, completable output |
| **[38C-1 §3.7 R3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)** | **Retrieval** — recall + low-stakes **verification before moving on**; ≥2 **episodes** |
| **[38C-1 §4–§5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)** | **60-min MVP** and **PASS** require R3 **Present** (with R1–R4) — **mandatory function** |
| **[38D-4 V-10](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)** | Page layer: score **38C-1 R1–R7** on composed page JSON — **no material-type enumeration** in V-10 text |
| **[38D-1 DLA-WB-11](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md)** | **Contract layer** — mandatory `task_cards` / `prompt_set` / `checklist` on ≥2 DLA activities ([38F-6](38F-6-retrieval-validation-calibration.md)) |
| **[38F-4](38F-4-inflation-after-scorecard.md)** | Operational score: R3 **Partial** · V-10 **Fail** — heuristic tied to retrieval **genres** in activity `materials` |
| **[38F-6](38F-6-retrieval-validation-calibration.md)** | Frozen page has **no** `assessment_check`; harness omits assessment step |

**Layering:**

```text
38C-1 R3          = normative FUNCTION (learner-visible episodes + verification)
38D-4 V-10        = applies R3 on PAGE JSON (function rubric)
38D-1 WB-11       = upstream CONTRACT (named retrieval material types on DLA)
38F-4 scorer      = practical shortcut (genre checklist) — can be narrower than 38C-1
```

---

## 3. Retrieval: function vs material type

### 3.1 Does 38C-1 define retrieval as function, desirable, or material-type?

| Lens | Answer |
|------|--------|
| **Workbook function?** | **Yes — required.** [38C-1 §5.1 R3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md): retrieval must be **Present** for genre **PASS**; §4 MVP lists retrieval **Present** (≥2 episodes). Not optional/desirable-only. |
| **Material-type requirement?** | **No — not in the definition.** §3.7 **Present** bar is behavioural: “≥2 retrieval episodes” with examples (`task_cards`, checklist, quiz **with expected check**). |
| **Evidence list role** | **Illustrative convenience**, not exhaustive closure. §3.7 JSON evidence names `materials.task_cards`, `prompt_set`, `checklist`, `self_explanation_prompt` — **typical** carriers, not the only way to satisfy the function. |
| **Distinct from R2** | **Guided practice** (§3.4) = structured **attempt** with completable artefact. **Retrieval** (§3.7) = **recall / verify before moving on**. Same activity can contribute to **both** only if the task includes an explicit **check** step, not merely “fill the table”. |

**Answer (Q1):** **Required workbook function** (R3). Material types in §3.7 are **evidence hints** for reviewers; they are **not** the normative definition.

### 3.2 Does 38D-4 V-10 over-constrain retrieval?

| Aspect | Finding |
|--------|---------|
| **V-10 rule text** | **No** — Pass = **R3 Present** per [38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); evidence = composed page JSON. |
| **[38F-4](38F-4-inflation-after-scorecard.md) application** | **Yes — operational over-constraint.** Scorer treated absence of `checklist` / `task_cards` / `prompt_set` on ≥2 activities as R3 **Partial** → V-10 **Fail**, without scoring **learner_task** + **expected_output** as retrieval/application episodes. |
| **DLA-WB-11** | **Separate layer** — explicitly **material-type** on DLA; drives **V-09**, not the text of V-10. Conflating WB-11 with V-10 caused programme confusion ([38F-6](38F-6-retrieval-validation-calibration.md)). |

**Answer (Q2):** **V-10 does not** over-constrain in spec; **38F-4 manual scoring** (and contract-first automation bias toward WB-11 genres) **did** over-constrain relative to 38C-1.

### 3.3 Can active tasks (classification, calculation, …) count as retrieval/application?

| Task type | Typical function | Count toward R3 **Present**? |
|-----------|------------------|------------------------------|
| **Classification / comparison** (with criteria, learner justifies) | R2 practice + possibly R3 if **self-check** | **Partial** if no answer key/check; **Present** if ≥2 episodes with explicit verification |
| **Calculation** (formula apply, show working) | R2 (+ R5 if modelled) | **Partial** unless learner verifies against sample/check |
| **Explanation** (explain CPI to a peer) | R2 / R1 overlap | **Partial** without check; **Present** if prompt_set-style verification |
| **Evaluation** (rank strategies + criteria) | R2 + [§3.11 evaluative judgement](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | **Not R3 alone** unless framed as recall/check before next section |
| **Table completion only** | R2 guided practice | **Absent for R3** per §3.7 anti-pattern: “learner only reads and fills tables once” |
| **“Answer questions” without authored questions** | Weak R2 | **Absent** or **Partial** (one implicit episode) — **not Present** |

**Answer (Q3):** **Yes, in principle** — active tasks **can** satisfy R3 when they are **learner-facing**, require **recall/application**, and include **verification before moving on** (≥2 episodes). They **do not** automatically satisfy R3 when they are only **guided practice** (table fill, scenario read + notes) without a check episode.

**EV-38F-AFTER (preview):** A2 (scenario + empty analysis table + notes) supports **R2 Present**; **R3** at best **Partial** (no check). A1 (“answer questions” with no question list) does not reach R3 **Present**.

---

## 4. Assessment_check policy

| Principle | Recommendation |
|-----------|----------------|
| **When present** | **Count** toward R3 (and [38C-5 §9 E9](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) self-check visibility) when `assessment_check` holds **≥2** low-stakes formative items aligned to session outcomes — per [38F-6](38F-6-retrieval-validation-calibration.md) learner-visible interpretation. |
| **When absent** | **Do not Fail** R3 solely for missing `assessment_check` if the **brief** did not request assessment and the workflow did not run **Generate Assessment Items** ([38C-3 Q5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md); Design Page `omitIfMissing` pattern). |
| **Frozen 38F capture** | **No** `assessment_check` on [EV-38F-AFTER-design-page.json](../artefacts/EV-38F-AFTER-design-page.json) — policy is **forward-looking** for calibration and full-workflow runs, not a reason to overturn 38F-4 on this artefact. |

**Answer (Q4):** **Yes** — count when present and formative; **not required** when assessment is out of brief/workflow scope. Programme should document this in **38D-4** scorer notes (planning amendment — not done in this slice).

---

## 5. Implications for V-10 / R3

### 5.1 Calibrated scoring model (for manual review)

| Step | Action |
|------|--------|
| 1 | Score **R1–R7** on **learner-visible page** per [38C-1 §6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) template |
| 2 | For **R3**, count **episodes** from: retrieval materials **or** tasks with explicit recall/check **or** `assessment_check` items (if section exists) |
| 3 | Map to **V-10**: R3 **Present** → contributes to V-10 Pass; **Partial/Absent** → V-10 Fail for R3 |
| 4 | Record **WB-11** separately on DLA export — **V-09** gate; do not substitute for step 2 |

### 5.2 Is 38F retrieval failure pedagogical or policy-related?

| Factor | Verdict |
|--------|---------|
| **On frozen `EV-38F-AFTER`** | **Primarily pedagogical** — even under a **function-first** rubric, ≥2 verification episodes are **not** evidenced; table-fill + vague “answer questions” ≤ **Partial** |
| **Policy component** | **Secondary** — [38F-4](38F-4-inflation-after-scorecard.md) did not assess task-level retrieval; if a generous function read still yields **Partial**, policy calibration **changes documentation**, not this artefact’s PASS |
| **vs 38E10** | 38E10 had explicit **checklist** + **task_cards** → R3 **Present** under **either** strict or function-first read — regression is **real output**, not scorer artefact alone |

---

## 6. Recommendation about 38-G

| Option | Fit | Notes |
|--------|-----|-------|
| **A. Retrieval-density contract refinement** | **Later** | Only if page review confirms DLA/GAM need co-presence of WB-11 genres **with** 38F table/scenario rows |
| **B. Validation calibration** | **Yes — planning track** | Amend 38D-4 / scorer guide: V-10 R3 function-first; `assessment_check` optional path; separate V-09 |
| **C. Page-output quality review** | **Yes — immediate next step** | Manual review of frozen page + render; score R1–R7 properly |
| **D. Defer 38-G charter** | **Yes — primary** | Do not charter until **C** completes and **B** policy is written |

**Chosen sequence:** **D → C → B → (maybe) A**

- **Do not charter 38-G yet.**  
- **Next:** **C** — detailed Inflation page review using §7 checklist.  
- **Parallel (docs-only):** **B** — validation calibration note in 38D programme.  
- **A** only if review finds **contract** gap (missing retrieval genres **and** insufficient task-level checks).

---

## 7. Setup for detailed Inflation page review

### 7.1 Exact artefact to inspect

| Priority | Path | Role |
|----------|------|------|
| **Primary** | [artefacts/EV-38F-AFTER-design-page.json](../artefacts/EV-38F-AFTER-design-page.json) | Composed page JSON — **V-10 / R1–R7** authority |
| **Secondary** | [artefacts/EV-38F-AFTER-render-excerpt.html](../artefacts/EV-38F-AFTER-render-excerpt.html) | Learner-visible layout (utility HTML); **V-11** hints |
| **Comparator** | [38E artefacts/EV-38E10-AFTER-design-page.json](../../2026-06-04-sprint-38e-workbook-contract-implementation/artefacts/EV-38E10-AFTER-design-page.json) | Retrieval-rich prior run (checklist, task_cards) |
| **Upstream (trace only)** | [EV-38F-AFTER-dla-learning-activities.json](../artefacts/EV-38F-AFTER-dla-learning-activities.json) · [EV-38F-AFTER-gam.txt](../artefacts/EV-38F-AFTER-gam.txt) | Contract vs page drift |

**Run ID:** `EV-38F-AFTER` · **Captured:** 2026-06-04 ([38F-4](38F-4-inflation-after-scorecard.md))

### 7.2 Page structure to review

| # | Section / block | Review focus |
|---|-----------------|--------------|
| 1 | **Welcome** | Orientation (R1 partial?); tone; session promise vs delivery |
| 2 | **Learning Purpose and Outcomes** | Outcomes vs activities alignment; not mistaken for consolidation |
| 3 | **Study Tips** | Learner support; pacing; missing misconception / check guidance |
| 4 | **Learning Activities** (container) | **3 activities**, 55 min total — compression vs 38E10 (4 × 60) |
| 4a | **A1** — Worked example activity | R1 teaching · R5 worked · **R3?** (“answer questions” without items) · materials grouping (`explanatory_text` key) |
| 4b | **A2** — Scenario + analysis table | R2 practice · R5? · **R3?** (table fill only) · scenario in `materials.scenarios` · empty learner cells · interaction_type `practice` |
| 4c | **A3** — Consolidation | R4 — pre-filled consolidation body vs learner-written task · R6 synthesis/transfer (reflection on strategies) |
| 5 | **`assessment_check`** | **Absent** — confirm; note N/A for R3 from MCQ |
| 6 | **Metadata** | `source_artefacts` (no assessment_items) · `visual_affordances` / review validation errors in JSON tail |

### 7.3 Per-activity materials checklist

| Activity | Materials keys | Page-quality questions |
|----------|----------------|------------------------|
| **A1** | `worked_example`, `sample_output`, `explanatory_text` | Are steps + formula visible? Is teaching separable from task? Are the promised “questions” authored anywhere? |
| **A2** | `scenarios`, `analysis_table` | Do scenarios support comparison? Is table pipe-valid and learner-empty? Any checklist/cards missing vs 38E10? |
| **A3** | `consolidation_summary` | Is closure **learner-written** or mostly **model text** (spoiler)? ≥80 words learner output feasible? |

### 7.4 Function scoring sheet (manual — next step)

Copy for reviewer; score **Present / Partial / Absent** per [38C-1 §6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md):

| Function | EV-38F-AFTER (hypothesis) | Evidence pointers |
|----------|---------------------------|-------------------|
| **R1** Teaching | **Present** | A1 `explanatory_text` + worked |
| **R2** Guided practice | **Present** | A2 task + empty table |
| **R3** Retrieval | **Partial** or **Absent** | No checklist/cards; weak A1 prompt; no assessment_check |
| **R4** Consolidation | **Present** (task) / **Partial** (material) | A3 task asks learner write; material is full model summary |
| **R5** Worked example | **Present** | A1 worked + sample |
| **R6** Synthesis / transfer | **Partial** | Reflection on strategies; no personal transfer prompt |
| **R7** Duration / solo | **Pass** | 55 min; solo wording |

### 7.5 Likely issues beyond retrieval (for page review)

| Theme | Likely issue on EV-38F-AFTER |
|-------|------------------------------|
| **Sequencing** | Teach → practice → closure **present** but **compressed** (3 activities); no mid-session self-check beat between A1 and A2 |
| **Compression** | Dropped 4th activity and retrieval genres vs 38E10; 55 min labelled vs 60 target |
| **Missing learner support** | No misconceptions block; no checklist; Study Tips generic |
| **Material grouping** | `explanatory_text` vs `text` naming; `scenarios` compose key; consolidation **model answer** bundled as material |
| **Coherent workbook feel** | Strong **tutorial + worksheet** arc; weaker **verify-before-continue** rhythm; risk of **activity-sheet** feel on A2 without teaching beat before table |
| **Section contract** | Heading-only sections (no canonical `section_id`); no `knowledge_summary`; no `assessment_check` |
| **Render / affordances** | `generation_notes.visual_affordance_validation.valid: false` — schema errors on visual review entries |

### 7.6 Comparator prompts (38E10)

When reviewing, ask:

1. What did 38E10 include that made **R3 Present** (checklist + task_cards)?  
2. Did 38F trade those for **table + scenario** ([38F-2](38F-2-contract-refinement.md))?  
3. Under **function-first** R3, does 38F still fall below **Present** even counting A2 notes + A1 task wording?

**Deliverable for next chat:** Completed §7.4 sheet + short narrative (workbook coherence / genre classification) — observation file TBD (e.g. `38F-8-inflation-page-quality-review.md`), still **analysis only**.

---

## 8. Completion statement

| Criterion | Met? |
|-----------|------|
| Retrieval = function vs material-type clarified | **Yes** — §3 |
| V-10 over-constraint vs 38F-4 scorer clarified | **Yes** — §3.2, §5 |
| Active tasks and assessment_check policy | **Yes** — §3.3, §4 |
| 38-G recommendation (hold; D→C→B) | **Yes** — §6 |
| Pedagogical vs policy judgement | **Yes** — §5.2: **primarily pedagogical** on frozen artefact; **policy drift** in how 38F-4 was scored |
| Page-review checklist ready | **Yes** — §7 |
| No implementation | **Yes** |

**Slice 38F-7:** **COMPLETE**  
**Next step:** Manual **38F-8** (or equivalent) page-quality review on `EV-38F-AFTER-design-page.json` — **do not charter 38-G** until that review and validation calibration (**B**) are done.
