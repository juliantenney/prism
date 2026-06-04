# Slice 38C-2 — Workbook gap analysis (Inflation)

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Authority:** [38C-1-workbook-pedagogy-model.md](38C-1-workbook-pedagogy-model.md) (§3 rubric, §4–5 pass/fail)  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38C-2  
**Hypothesis:** Wrong **instructional genre** for self-study — **not** Design Page stripping ([HANDOVER.md](../HANDOVER.md), [38C richness](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md)).

**Constraints:** Observation only — no runtime, prompt, pack, test, probe, or fixture changes; no implementation proposals.

---

## 1. Purpose and scope

| In scope | Out of scope |
|----------|--------------|
| Apply 38C-1 §6 template to **Inflation EV-01** composed page | Prompt-size or B4 table-fidelity programmes |
| Compare **same-run GAM**, **EV-03 GAM**, **golden workshop page** | Live LLM reruns |
| Gap taxonomy, severity, **likely origin** (DLA / GAM / Design Page / vision) | Pack text, `app.js`, renderer PRs |
| Requirements **signals** for 38C-3 … 38C-5 (no specs) | Execution charter |

**Primary artefact:** Learner-facing **Design Page** from 2026-06-04 same-run capture. Upstream GAM and comparators explain **where gaps arise**, not whether DP deleted content on this run.

---

## 2. Inputs inspected

| ID | Asset | Path | Role in analysis |
|----|-------|------|------------------|
| **EV-01-P** | Design Page JSON | [ev-38b4-01-design-page.json](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-design-page.json) | **Primary** — workbook scoring |
| **EV-01-G** | GAM text (same run) | [ev-38b4-01-pipeline-gam.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-pipeline-gam.txt) | Upstream genre ceiling |
| **EV-03-G** | GAM text (rich comparator) | [ev-38b4-03-inflation-gam-live.txt](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-03-inflation-gam-live.txt) | GAM can author multi-type materials |
| **GOLDEN** | Workshop page fixture | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | Programme reference shape (60 min workshop) |
| **EV-01-H** | Render excerpt | [ev-38b4-01-render-excerpt.html](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/fixtures/ev-38b4-01-render-excerpt.html) | Learner-visible tables; truncated |
| — | DLA JSON | **Not committed** | Origin inferred from page + capture brief |

**Supporting reviews:** [38C self-study quality](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md) · [38B-W3-4 gate](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W3-4-inflation-gate-evidence.md) (syntax preserve PASS).

---

## 3. Method

1. Load **EV-01-P**; locate `Learning Activities` section (`heading`-based, not `section_id`).  
2. Score each of **11 functions** per [38C-1 §3](38C-1-workbook-pedagogy-model.md) → **Present** / **Partial** / **Absent**.  
3. Record **evidence path** (JSON field or HTML pattern).  
4. Assign **severity** (cosmetic · usability · pedagogical · critical self-study).  
5. Assign **likely origin** (DLA · GAM · Design Page · vision/product · unknown).  
6. Apply **§5 pass/fail** and **§2 genre** tree.  
7. Compare **EV-01-G**, **EV-03-G**, **GOLDEN** `activity_materials` types — not full re-score unless noted.  
8. Separate **authoring gap** (never created) vs **preserve/render gap** (created upstream, missing on page).

---

## 4. EV-01 summary metrics

| Metric | Value | 38C-1 §4 reference |
|--------|------:|-------------------|
| `page_profile` | `learner` | Self-study target |
| Top-level sections | **3** (intro, outcomes, activities) | MVP asks ≥3 incl. consolidation |
| Sum `duration_minutes` | **125** | MVP band 50–70 |
| Intro prose words | **~69** | Teaching Present needs ≥120 |
| `materials` types on page | **4** (all `*_table`) | MVP needs ≥2 types |
| Solo-blocking tasks | A2 *partner*, A4 *group* | §4 solo feasibility |

---

## 5. Function-by-function scoring — Inflation EV-01

### 5.1 Summary table

| Function | Score | Severity | Likely origin |
|----------|-------|----------|---------------|
| Explanatory teaching | **Partial** | Pedagogical | GAM + vision; DP intro only |
| Worked examples | **Absent** | Pedagogical | GAM |
| Modelling | **Absent** | Pedagogical | GAM |
| Guided practice | **Partial** | Pedagogical / usability | GAM + DLA + DP (task wording) |
| Fading | **Absent** | Pedagogical | GAM + DP (A5 shape) |
| Misconceptions | **Absent** | Cosmetic → pedagogical if relied on | DP / DLA (JSON-only `failure_mode`) |
| Retrieval | **Partial** | Pedagogical | GAM |
| Consolidation | **Absent** | **Critical** (self-study) | GAM + DP page structure |
| Synthesis | **Present** | — | DLA + DP (A5 task) |
| Transfer | **Partial** | Pedagogical | DP (A5 task text) |
| Evaluative judgement | **Partial** | Pedagogical | GAM (pre-filled ratings) + DLA |

---

### 5.2 Explanatory teaching — **Partial**

| | |
|--|--|
| **Evidence** | Intro § `Introduction to Inflation…` ≈ **69 words** — promises journey but does not teach mechanisms ([EV-01-P] `sections[0].content`). Definitions live in table cells (~1,100 words total) — 38C-1 §3.1 **Partial** pattern. No `knowledge_summary` section. |
| **Severity** | **Pedagogical** |
| **Origin** | **GAM** — no exposition material type authored. **Vision** — title/copy promises teaching arc. **Design Page** — did not add teaching section (compose is preserve-first). **Not** stripping. |

---

### 5.3 Worked examples — **Absent**

| | |
|--|--|
| **Evidence** | No `materials.worked_example` / stepped solution. A4 `impact_table` includes **Effectiveness Rating** values (4, 5, 3, 4) learner did not produce — anti-pattern per 38C-1 §3.2. |
| **Severity** | **Pedagogical** |
| **Origin** | **GAM** — not in EV-01-G (table types only). **EV-03-G** also has no `worked_example` type. |

---

### 5.4 Modelling — **Absent**

| | |
|--|--|
| **Evidence** | No think-aloud / criteria prose. A3 `Notes on Impact` column interprets rows but does not model **process**. A5 `reasoning_orientation` in JSON — **not confirmed** in [EV-01-H] excerpt. |
| **Severity** | **Pedagogical** |
| **Origin** | **GAM**. Possible **render** gap for cognition fields → 38C-5. |

---

### 5.5 Guided practice — **Partial**

| | |
|--|--|
| **Evidence** | All five activities have `learner_task` + `expected_output` + table `materials`. **Gaps:** A3 preamble cites “**scenarios**” — no `materials.scenario`. A2: *“Work with your partner…”*; A4: *“In your group…”* on solo page. A1 classification column empty (OK); A4 ratings pre-filled (reduces practice). |
| **Severity** | **Pedagogical** (missing scenarios); **Usability** (partner/group) |
| **Origin** | **GAM** — no scenario bodies. **DLA / model** — social task wording (DLA JSON not saved). **Design Page** — composed tasks verbatim; not deletion. |

---

### 5.6 Fading — **Absent**

| | |
|--|--|
| **Evidence** | Support density flat A1–A4; A5 attaches **all four** prior tables again (~5.5k chars duplicate) — inverse of fading (38C-1 §3.5 anti-pattern). |
| **Severity** | **Pedagogical** |
| **Origin** | **GAM** (A5 reference dump) + **Design Page** merge. Not compression. |

---

### 5.7 Misconceptions — **Absent**

| | |
|--|--|
| **Evidence** | `failure_mode` on activities (e.g. A1 misclassification) — facilitator-facing strings, not learner “common mistake” blocks. |
| **Severity** | **Cosmetic** on page; **pedagogical** if programme expects self-correction |
| **Origin** | **DLA/DP** — field present but not learner genre. **38C-5** render visibility TBD. |

---

### 5.8 Retrieval — **Partial**

| | |
|--|--|
| **Evidence** | Implicit retrieval: A1 classify terms, A3 calculate % changes. **Absent:** `task_cards`, `checklist`, `prompt_set`, MCQ — none in EV-01-P or EV-01-G. 38C-1 §3.7 needs ≥2 explicit retrieval episodes for **Present**. |
| **Severity** | **Pedagogical** |
| **Origin** | **GAM** — genres not authored (EV-01-G types: 4 tables only). |

---

### 5.9 Consolidation — **Absent**

| | |
|--|--|
| **Evidence** | No `study_tips`, `reflection`, `key_takeaways`, or summary section after activities. Page ends at A5. Outcomes list is **forward-looking**, not closure. |
| **Severity** | **Critical** (self-study) |
| **Origin** | **GAM** — no closure material. **Design Page** — no consolidation section composed. **Vision** — “journey” copy without closure artefact. |

---

### 5.10 Synthesis — **Present**

| | |
|--|--|
| **Evidence** | A5 `learner_task` requires integrated personal finance plan (3 numbered parts); `expected_output` specifies written plan document. |
| **Severity** | — (strength) |
| **Origin** | **DLA + Design Page** — capstone present. **Undermined** by missing prior scenarios (GAM). |

---

### 5.11 Transfer — **Partial**

| | |
|--|--|
| **Evidence** | A5: “**your** household budget”, “**your** finances” in task — 38C-1 §3.10 **Partial**→borderline **Present**. `transfer_or_application_task` in JSON; render visibility uncertain. |
| **Severity** | **Pedagogical** |
| **Origin** | **Design Page** / DLA framing. Materials do not scaffold personal data gathering. |

---

### 5.12 Evaluative judgement — **Partial**

| | |
|--|--|
| **Evidence** | A4 ranking task with justification in `expected_output`. **No** rubric/exemplar. Pre-filled **Effectiveness Rating** column supplies model judgement — learner ranks pre-scored strategies (§3.11 anti-pattern). |
| **Severity** | **Pedagogical** |
| **Origin** | **GAM** table content. **DLA** task design. |

---

## 6. Workbook rules and genre verdict — EV-01

### 6.1 Rule checklist

| Rule | Result | Notes |
|------|--------|-------|
| **R1** Explanatory teaching Present | **Fail** | Partial only |
| **R2** Guided practice Present | **Fail** | Partial |
| **R3** Retrieval Present | **Fail** | Partial |
| **R4** Consolidation Present | **Fail** | Absent |
| **R5** Worked example OR modelling Present | **Fail** | Both absent |
| **R6** Synthesis OR transfer Present | **Pass** | Synthesis present; transfer partial counts for integration path if scored Present — **R6 Pass** via synthesis |
| **R7** §4 60-min + solo + variety | **Fail** | 125 min; partner/group; tables-only |
| **F1** Teaching Absent AND consolidation Absent | **Not triggered** | Teaching is Partial, not Absent — F1 does not force genre via that branch |
| **F2–F4** | **Fail** workbook | Multiple mandatory functions absent/partial |

### 6.2 Workbook PASS

**FAIL** — does not meet 38C-1 §5.1.

### 6.3 Genre classification

| Genre | Selected |
|-------|:--------:|
| Self-study workbook | |
| **Activity sheet** | **✓** (primary) |
| **Reference notes** | **✓** (secondary) |
| Guided tutorial | |
| Revision sheet | |

**Hybrid:** **activity_sheet + reference_notes** — aligns with [38C self-study quality §3](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md).

### 6.4 One-paragraph verdict

> **Solo 60-minute fit (1–5): 2** — Logical sequence but **125 min** labels, thin coaching prose, and social task wording make a credible one-hour self-study session unlikely without skipping or shallow table completion.  
> **Primary gap:** No **consolidation**, no **modelling/worked example** path, **table-only** materials (no scenarios/cards/checklists), weak **retrieval** and **teaching** prose.  
> **Origin:** **GAM authoring genre** (EV-01-G = 4 table types only) + **product/brief** (self-directed journey copy) + minor **DP/DLA** task framing; **not** materials stripping (GAM ↔ page tables verbatim per [38B-4 EV-02](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/EV-38B4-02-table-preservation-analysis.md)).

---

## 7. Comparator notes

### 7.1 Same-run GAM (EV-01-G)

| Dimension | EV-01-G | EV-01-P | Gap at DP? |
|-----------|---------|---------|------------|
| Material types | `classification_table`, `comparison_table`, `analysis_table`, `impact_table` | Same four keys | **No** — verbatim preserve |
| Word count | ~1,360 | ~1,106 in `materials` | None (tables match) |
| Scenarios / cards / prompts | **0** | **0** | N/A — never authored |

**Conclusion:** Design Page **cannot** add workbook genres that GAM did not author on this run. DP gap = **0** for L4 bodies; learner gap = **100%** of missing genres vs workbook bar.

### 7.2 Richer GAM comparator (EV-03-G)

| Material types in EV-03-G | Maps to 38C-1 functions |
|---------------------------|-------------------------|
| `scenario` (A1, A3, A4) | Guided practice, transfer context |
| `task_cards` (A1) | Retrieval, guided practice |
| `prompt_set` (A2, A5) | Retrieval, evaluative judgement |
| `checklist` (A2) | Retrieval |
| `*_table` | Reference + practice |

**8 types** vs **4** on EV-01-G. Same inflation topic with golden-shaped upstream DLA ([EV-03 capture](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/EV-38B4-03-inflation-gam-evidence.md)).

**Implication:** Platform **can** author workbook-adjacent genres; EV-01 failure is **run specification / DLA requirements**, not hard ceiling.

### 7.3 Golden workshop page (GOLDEN)

| Dimension | GOLDEN | vs EV-01-P |
|-----------|--------|------------|
| Stated duration | **60 min** (`learning_sequence` sum) | EV-01 **125 min** |
| Sections | overview, purpose, **knowledge_summary**, activities, **activity_materials**, sequence, **assessment_check** | 3 sections only |
| `activity_materials` types | scenario, task_cards, tables, prompt_set, checklist, discussion_prompts | Tables only on activity rows |
| Workshop signals | Group tasks in cards, `support_note` on DLA upstream, whole-group A5 | EV-01 mimics some social wording without workshop materials |

**Hypothetical 38C-1 score if materials merged to activities (planning estimate):**

| Function | Likely score |
|----------|--------------|
| Explanatory teaching | **Partial** (`knowledge_summary` short) |
| Worked examples | **Absent** |
| Modelling | **Absent** |
| Guided practice | **Present** |
| Retrieval | **Present** (cards + checklist + MCQ) |
| Consolidation | **Absent** (no reflection section) |
| Synthesis | **Absent** (A5 discussion only) |
| Workbook PASS | Still **Fail** (R1, R5, R4…) |

**Role:** Reference for **material variety** and **60 min** pacing — **not** a self-study workbook PASS. Shows target **genre mix** workshop pipeline expects vs EV-01 self-directed capture.

---

## 8. Gap taxonomy (EV-01)

| ID | Gap | Evidenced? | Severity |
|----|-----|:----------:|----------|
| **GAP-01** | Missing **teaching arc** (prose exposition) | Yes — intro 69 words, table defs only | Pedagogical |
| **GAP-02** | Weak **practice progression** (no scenarios → worksheet) | Yes — A3 preamble mismatch | Pedagogical |
| **GAP-03** | **Absent consolidation** | Yes — no closure section | **Critical** |
| **GAP-04** | Insufficient **solo-learner checks** (retrieval) | Yes — no cards/checklist/MCQ | Pedagogical |
| **GAP-05** | Over-reliance on **tables/reference** | Yes — 4/4 material keys are tables | Pedagogical |
| **GAP-06** | **Duration mismatch** | Yes — 125 min vs 60-min product question | Structural / usability |
| **GAP-07** | **Social task** on solo page | Yes — A2, A4 | Usability |
| **GAP-08** | **Anti-fading** A5 reference dump | Yes — four tables repeated | Usability |
| **GAP-09** | **Pre-filled judgement** (A4 ratings) | Yes | Pedagogical |

---

## 9. Origin analysis

### 9.1 Authoring vs preserve vs render

| Layer | Authoring gap (never created) | Preserve gap (created, lost on page) | Render gap (on page JSON, not HTML) |
|-------|------------------------------|--------------------------------------|-------------------------------------|
| **GAM** | **Primary** — scenarios, cards, prompts, closure, worked example | **No** on EV-01 — tables match | — |
| **DLA** | **Likely** — `required_materials` table-only (capture brief); social tasks | Unknown — no JSON | — |
| **Design Page** | Consolidation section not composed | **No** L4 body loss | Cognition fields may not render |
| **Vision / brief** | “Self-directed journey” without workbook spec | — | — |

### 9.2 Hypothesis verdict

| Hypothesis | 38C-2 verdict |
|------------|---------------|
| Design Page stripping content | **Not supported** — EV-01-G ↔ EV-01-P table identity |
| Wrong instructional genre for self-study | **Supported** — table encyclopaedia + tasks; comparators show alternative genres exist |
| Primary fix locus for planning | **DLA requirements** + **GAM genres** + **page structure/consolidation** — not 38-B preserve modules |

---

## 10. Requirements emerging (for later phases — not implementation)

### 10.1 → 38C-3 DLA workbook requirements

| Signal | Source gap |
|--------|------------|
| `required_materials` must list **non-table** types when self-study (scenario, task_cards, checklist, …) | GAP-02, GAP-04; EV-03-G |
| Solo-feasible `learner_task` lint (no required partner/group) | GAP-07 |
| Duration budget **50–70 min** sum or explicit pacing note | GAP-06 |
| Capstone must not only repeat table keys | GAP-08 |
| Optional: require `failure_mode` → learner misconception block | GAP — misconceptions |

### 10.2 → 38C-4 GAM instructional genres

| Signal | Source gap |
|--------|------------|
| Author **scenario** before analysis/classification tables | GAP-02, A3 |
| Author **task_cards** + **checklist** for retrieval | GAP-04 |
| Forbid **pre-filled judgement columns** when task is rank/justify | GAP-09 |
| Author **worked_example** or **modelling** block before parallel practice | R5 fail |
| Author **consolidation** material or section payload | GAP-03 |
| Anti-pattern: **reference dump** of all tables on synthesis activity | GAP-08 |

### 10.3 → 38C-5 Workbook experience and rendering

| Signal | Source gap |
|--------|------------|
| Page needs **consolidation** section visible in HTML | GAP-03 |
| `knowledge_summary` / teaching section for R1 | GAP-01 |
| Verify A5 cognition fields render | Modelling partial in JSON only |
| Material variety → scenario cards, prompt sets in HTML | GAP-05 |
| Canonical `section_id` vs `heading` (38-B note) — workshop render parity | Comparator only |

---

## 11. Explicit non-recommendations

- **No** `app.js`, pack, or test changes in this slice.  
- **No** prompt edits or 38-B module rewrites.  
- **No** renderer/CSS implementation.  
- **No** new probes or fixtures (analysis references existing paths only).  
- **No** execution PR list — deferred to future charter after 38C-3 … 38C-5 planning.

---

## 12. Final verdict

| Question | Answer |
|----------|--------|
| Does Inflation EV-01 pass the workbook bar? | **No** — fails R1–R5, R7; synthesis alone insufficient |
| Is the resource genuinely thin for self-study? | **Yes** |
| Is the issue pedagogical or structural? | **Both** (missing functions + 125 min labels) |
| Primary origin | **GAM genre** + **DLA/brief** + **vision**; **not** Design Page stripping |
| Wrong-genre hypothesis | **Refined and supported** — activity sheet + reference notes, not workbook |
| Ready for 38C-3 / 38C-4? | **Yes** — §10 signals are sufficient to draft requirements without implementation |

---

## 13. Sign-off

| Item | Status |
|------|--------|
| 38C-1 §6 applied to EV-01 | **Done** §5–6 |
| Comparators documented | **Done** §7 |
| Gap taxonomy + origins | **Done** §8–9 |
| Phase signals (no impl) | **Done** §10–11 |
| Slice 38C-2 | **COMPLETE** |

**Next:** [38C-3 DLA workbook requirements](38C-3-dla-workbook-requirements.md) (TBD).
