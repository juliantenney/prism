# Slice 38F-6 — Retrieval validation calibration

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Type:** **Analysis only** — no pack edits · no code · no tests · no pipeline run · **do not charter 38-G yet**  
**Authority:** [38C-1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) · [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-1](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) · [38F-4](38F-4-inflation-after-scorecard.md)  
**Artefacts inspected:** `EV-38F-AFTER-design-page.json` · `EV-38F-AFTER-dla-learning-activities.json` · `EV-38F-AFTER-gam.txt` · `EV-38F-AFTER-run-log.json` · `EV-38F-AFTER-render-excerpt.html`

---

## 1. Purpose

Before chartering **Sprint 38-G**, determine whether **`EV-38F-AFTER`** genuinely lacks learner retrieval, or whether [38F-4](38F-4-inflation-after-scorecard.md) **V-10 / R3** scoring is **too narrow** because it ignores page-level **`assessment_check`** formative items.

**Calibration questions:**

1. What do **38C-1 R3**, **38D-4 V-10**, and **DLA-WB-11** each require?
2. What retrieval evidence exists on the **frozen 38F page**?
3. Under **strict material** vs **learner-visible** interpretation, does R3 flip?
4. Should programme action be **38-G pack sprint**, **validation recalibration**, **both**, or **none**?

---

## 2. Inputs and authority

| Source | Role in calibration |
|--------|---------------------|
| [38C-1 §3.7 R3](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Normative **Retrieval** function — Present / Partial / Absent |
| [38C-1 §5.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Workbook PASS requires **R3 Present** (with R1–R4) |
| [38C-5 §4 stage 6](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-5-workbook-experience-rendering.md) | Learner journey — retrieval via `checklist`, `retrieval_check`, `prompt_set` |
| [38C-3 §4 Q5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) | **Open:** MCQ / `assessment_check` — DLA vs separate assessment step |
| [38D-4 V-10](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) | Page layer — score **R1–R7** on composed page JSON |
| [38D-1 DLA-WB-11](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md) | DLA layer — `task_cards` / `prompt_set` / `checklist` on **≥2 activities** |
| [38D-2 GAM-WB-05](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-2-gam-workbook-genre-contract.md) | GAM retrieval minimums (aligned to WB-11 genres) |
| [38F-4](38F-4-inflation-after-scorecard.md) | Prior score: R3 **Partial** · V-10 **Fail** · WB-11 **Fail** |

**Capture scope note:** [ev-38f-inflation-pipeline-capture-once.mjs](../artefacts/ev-38f-inflation-pipeline-capture-once.mjs) runs **Learning Outcomes → DLA → GAM → Design Page** only. It does **not** run **Generate Assessment Items** or pass `assessment_items` into Design Page. Any `assessment_check` on a page would have to be invented by Design Page from GAM/DLA alone, or come from a **different** workflow capture.

---

## 3. R3 / V-10 / DLA-WB-11 rule comparison

### 3.1 What 38C-1 R3 requires

| Aspect | Requirement |
|--------|-------------|
| **Pedagogical intent** | Prompt recall and low-stakes verification **before moving on** |
| **Present** | **≥2 retrieval episodes** — e.g. `task_cards`, self-check questions, cover-and-recall, **checklist**, explicit quiz prompts **with expected check** |
| **Partial** | One implicit retrieval without answer check; **or** checklist without confirmation step |
| **Absent** | No recall/self-check; learner only reads and fills tables once |
| **Evidence (JSON)** | `materials.task_cards`, `prompt_set`, `checklist`, `self_explanation_prompt` — **learner-visible** |
| **Evidence (HTML)** | Card grid, numbered prompts, “Before you continue” block |
| **Anti-pattern** | **Only summative capstone**; pre-filled tables removing retrieval need |

**Answer (Q1):** R3 is defined on **learner-visible retrieval anywhere on the workbook product**, not “inside activity JSON only” — but the **documented evidence types** are **activity `materials.*` genres**, not `sections[].assessment_check`. The model does **not** name `assessment_check` in §3.7 evidence lists; [38C-3 Q5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) leaves MCQ / page assessment as a **programme open question**.

### 3.2 What 38D-4 V-10 checks

| Aspect | Content |
|--------|---------|
| **Layer** | **V3 Page** — composed `design-page.json` |
| **Pass** | **R1–R4** all **Present**; **R5** or modelling Present; **R6** synthesis or transfer Present; **R7** met |
| **Fail** | Any of **R1–R4 Absent** |
| **Evidence** | Composed page JSON |
| **Derivation** | Outcome of V1–V2; [38C-2 §7.1](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-2-workbook-gap-analysis.md): if GAM omitted a genre, page cannot Pass that function |

**Answer (Q2):** V-10 does **not** explicitly list `assessment_check` as retrieval evidence. It applies the **38C-1 function rubric** to page JSON. [38F-4](38F-4-inflation-after-scorecard.md) applied a **practical scorer heuristic** aligned with **38C-1 §3.7 evidence types** and **38C-5 E9** (self-checks in **activity materials**): no `checklist` / `task_cards` / `prompt_set` on **≥2 activities**. That heuristic is **narrower than “any formative retrieval on the page”** if `assessment_check` were present and scored.

**Is validation narrower than pedagogy?** **Partially yes** — pedagogy R3 cares about **≥2 episodes**; contracts and [38F-4](38F-4-inflation-after-scorecard.md) scoring emphasise **named GAM/DLA retrieval genres** in **activity materials**. Page-level formative MCQ is **recognised in product compose** ([Design Page canonical `section_id`](../../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-export-contract.md)) but **not wired** into 38D-4 V-10 text or DLA-WB-11.

### 3.3 What DLA-WB-11 requires

| Aspect | Content |
|--------|-------------|
| **Level** | **Mandatory** (DLA contract) |
| **Pass** | **≥2 activities** with `required_materials.type` ∈ **`task_cards`**, **`prompt_set`**, **`checklist`**; each linked `expected_output` states what learner verifies |
| **Fail** | Fewer than two activities with those types; retrieval only implied via “complete table” |
| **Maps to** | [38D-4 V-09](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) — all DLA-WB Mandatory Pass |

**Answer (Q3):**

- **Must DLA specify retrieval in `required_materials`?** **Yes** — WB-11 is explicit and type-enumerated.
- **Can `assessment_check` satisfy WB-11?** **No** — WB-11 does not mention `assessment_check` or `assessment_items`; it is a **DLA activity-spec** rule, not a page-section rule.
- **DLA vs page issue?** **Both layers:** WB-11 is **DLA**; V-10 R3 is **page function** — they can diverge if a **downstream** assessment step populates `assessment_check` without DLA rows (see §5–§6).

---

## 4. EV-38F-AFTER retrieval evidence

### 4.1 Artefact premise check (critical)

**Stakeholder premise:** Design Page contains **`assessment_check`** with **10 formative** items.

**Frozen capture finding:** **`EV-38F-AFTER-design-page.json` does not contain `assessment_check`.**

| Check | Result |
|-------|--------|
| `section_id === "assessment_check"` | **Absent** — sections use **heading-only** objects (no `section_id`) |
| `assessment_check` key anywhere in JSON | **Absent** |
| `source_artefacts` | **`learning_activities`**, **`activity_materials` only** — no `assessment_items` |
| Formative / MCQ / “Formative Assessment” strings | **Absent** in page JSON and render excerpt |
| `EV-38F-AFTER-run-log.json` `gam.hasTaskCards/hasChecklist/hasPromptSet` | **false** / **false** / **false** |

**Sections present (4):**

1. Welcome to Your Inflation Workbook  
2. Learning Purpose and Outcomes  
3. Study Tips  
4. Learning Activities (array of **3** activities)

**Conclusion:** [38F-4](38F-4-inflation-after-scorecard.md) scoring against **this frozen artefact** is **consistent** with the file contents. If a **different** export (full UI workflow with **Generate Assessment Items**) shows 10 formative items, that is **not** represented in `EV-38F-AFTER-*`; reconcile with a **new capture** before overturning the 38F scorecard.

### 4.2 Formative item count (actual capture)

| Location | Formative / self-check items |
|----------|------------------------------|
| **`assessment_check` section** | **0** (section missing) |
| **Activity `materials.checklist`** | **0** |
| **Activity `materials.task_cards`** | **0** |
| **Activity `materials.prompt_set`** | **0** |
| **Implicit prompts** | A1 `learner_task` says “answer questions” but **no** question list in materials — **not** countable as ≥2 retrieval episodes |

### 4.3 Weak retrieval signals (not WB-11 genres)

| Signal | Classification | Notes |
|--------|----------------|-------|
| A2 empty `analysis_table` (learner fills cells) | **Guided practice** (R2), not R3 | [38C-1 §3.7](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) anti-pattern: “only reads and fills tables once” — here table is practice scaffold, not self-check with verification |
| A1 “answer questions about…” | **Partial at best** | No authored questions or answer check — below R3 **Present** bar |
| A3 consolidation reflection | **R4 closure** | Not retrieval |

**Learner-visible retrieval on frozen page:** **Absent** (or at best **Partial** with a generous rubric — still **not Present**).

### 4.4 DLA / GAM inspection

| Layer | Retrieval in activity materials? |
|-------|----------------------------------|
| **DLA** `required_materials` | **No** `task_cards`, `checklist`, `prompt_set` on any of 3 activities |
| **GAM** `Material:` lines | **6** materials — worked_example, sample_output, text, scenario, analysis_table, consolidation_summary only |
| **Page** `learning_activities[].materials` | Same 6 keys — **no** retrieval genres |
| **Separate pipeline step** | **Not run** in 38F-4 harness — no `assessment_items` → no composed `assessment_check` |

**Comparison — 38E10 (retrieval Pass on same scorer):** `EV-38E10-AFTER-design-page.json` includes activity-level **`task_cards`** and **`checklist`** on practice activity — satisfies the [38F-4](38F-4-inflation-after-scorecard.md) heuristic and WB-11. **38F dropped those** when compressing to 3 activities and prioritising table + scenario rows.

### 4.5 Hypothetical: 10-item `assessment_check` (if present on another export)

If a page **did** include `assessment_check.content.items[]` with **10** low-stakes formative prompts (recall / discrimination / calculation / explanation / application), a **learner-visible** reading of **38C-1 R3** could argue **≥2 retrieval episodes** **Present** on the **page layer**.

| Item type (typical inflation MCQ mix) | Maps to |
|---------------------------------------|---------|
| Recall (CPI definition, formula) | Retrieval |
| Concept discrimination (demand-pull vs cost-push) | Retrieval |
| Calculation (inflation rate) | Retrieval + practice |
| Explanation (interpret CPI change) | Retrieval |
| Application / evaluation (household strategy) | Retrieval / transfer edge |

That would **not** automatically fix:

| Rule | Still fails? |
|------|----------------|
| **DLA-WB-11** | **Yes** — unless DLA also lists retrieval types on ≥2 activities |
| **V-09** | **Yes** — Mandatory DLA fails until WB-11 Pass |
| **GAM-WB-05** | **Yes** — no retrieval `Material:` types in GAM on frozen run |
| **V-01 retrieval family** (GAM type families) | **Maybe** — `checklist`/`task_cards` family still absent in GAM inventory on 38F run |

---

## 5. Strict vs learner-visible scoring

### 5.1 Strict material interpretation

**Definition:** R3 / V-10 / WB-11 Pass only if **≥2 activities** carry **`task_cards`**, **`checklist`**, or **`prompt_set`** in DLA → GAM → page `materials` (per [38D-1 WB-11](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-1-dla-workbook-contract.md), [38F-4](38F-4-inflation-after-scorecard.md)).

| Measure | 38F frozen artefact |
|---------|---------------------|
| **R3** | **Partial** (weak table-fill / vague “answer questions”) or **Absent** (strict) |
| **V-10** | **Fail** (R3 not Present) |
| **DLA-WB-11** | **Fail** |
| **V-09** | **Fail** |
| **Workbook overall** | **FAIL** ([38D-4 G2–G4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md)) |

**Matches [38F-4](38F-4-inflation-after-scorecard.md).**

### 5.2 Learner-visible interpretation (includes `assessment_check` when present)

**Definition:** R3 **Present** if the learner sees **≥2** low-stakes verification episodes **anywhere** on the page, including **`assessment_check`** formative items when aligned to session outcomes ([38C-3 Q5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md) direction).

| Measure | **Frozen EV-38F-AFTER** | **Hypothetical page + 10 formative `assessment_check`** |
|---------|-------------------------|--------------------------------------------------------|
| **R3 (page)** | **Absent** / **Partial** — no section, no items | **Present** (likely) |
| **V-10** | **Fail** | **May Pass** R3 if R1–R4 otherwise Present |
| **DLA-WB-11** | **Fail** | **Still Fail** unless DLA amended |
| **V-09** | **Fail** | **Still Fail** |
| **Workbook overall** | **FAIL** | **Likely still FAIL** (G2 V-09) unless DLA also fixed |

### 5.3 Scoring summary table

| Interpretation | R3 | V-10 | WB-11 | Workbook (frozen 38F) | Workbook (hypothetical + assessment_check only) |
|----------------|-----|------|-------|-------------------------|--------------------------------------------------|
| **Strict material** | Partial/Absent | Fail | Fail | **FAIL** | **FAIL** (DLA/GAM unchanged) |
| **Learner-visible** | Partial | Fail | Fail | **FAIL** | **FAIL** at G2; V-10 may improve |

---

## 6. Interpretation

1. **Pedagogically absent on frozen capture?** **Yes** — for the **scored pipeline path**, retrieval genres that satisfied 38E10 are **missing** from DLA, GAM, and page activity materials. There is **no** `assessment_check` on `EV-38F-AFTER-design-page.json`.

2. **Validation too narrow?** **Partially** — for **product workflows** that include **Generate Assessment Items** and a populated **`assessment_check`** section, the **current 38F-4 manual scorer** and **WB-11** do **not** count that evidence toward R3/V-10. That is a **spec gap** ([38C-3 Q5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md)), not proof that **this** anchor run had retrieval.

3. **Artefact vs stakeholder view:** If stakeholders see 10 formative items in **UI**, the gap is likely **capture scope** (harness omitting assessment step) or **a different run** — not a false negative on the frozen JSON. **Do not** recalibrate closure on UI-only evidence without aligning artefacts.

4. **38F trade-off stands:** Restoring table + scenario ([38F-2](38F-2-contract-refinement.md)) correlated with **loss** of in-activity `task_cards`/`checklist` vs 38E10 — independent of assessment_check.

---

## 7. Recommendation

**Choice: C — Both: calibrate validation to count `assessment_check` when present, and still require in-activity retrieval for full DLA/GAM contract PASS**

| Option | Verdict | Rationale |
|--------|---------|-----------|
| **A. 38-G retrieval-density sprint only** | **Premature** | Frozen artefact has **no** assessment_check; pack co-presence still needed for WB-11 on **DLA→GAM** path |
| **B. Validation calibration only** | **Insufficient alone** | Frozen 38F still lacks retrieval materials **and** lacks assessment section |
| **C. Both (calibrate + contract path)** | **Yes** | Resolve [38C-3 Q5](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-3-dla-workbook-requirements.md); update **38D-4 / 38D-5** scorer notes for V-10 R3 + `assessment_check`; keep WB-11 for activity-level spec on workbook **contract** runs |
| **D. No action; keep 38F FAIL** | **Correct for frozen artefact** | **Wrong** as programme end-state if full workflow includes formative assessment |

**Ordered programme actions (no 38-G charter yet):**

1. **Validation calibration slice** (planning-only): Amend [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) V-10 / AF-04 evidence row to include **`sections[].assessment_check`** formative items when `source_artefacts` includes `assessment_items`; document **dual paths** (activity materials vs assessment section).
2. **Artefact alignment:** If product standard includes assessment step, add **optional** harness branch or separate **`EV-38F-FULL`** capture before re-judging Workbook PASS.
3. **Then** decide **38-G**: Still warranted for **contract-first** anchor (DLA-WB-11 + GAM-WB-05 co-presence with 38F table/scenario rows) on the **LD-only** capture path.

---

## 8. Impact on 38F closure

| Question | Answer |
|----------|--------|
| **Does Workbook remain FAIL on frozen `EV-38F-AFTER`?** | **Yes** — under **both** strict and learner-visible scoring **for this JSON** |
| **Does Workbook become PASS if we only recalibrate V-10?** | **No** — no `assessment_check` to count; **V-09** / **WB-11** still Fail |
| **Does Workbook become PASS if UI had 10 MCQs not in capture?** | **Unknown** — requires **aligned artefact**; even then **V-09** may Fail until DLA lists retrieval types |
| **Is a new run required?** | **Yes** for any revised Workbook verdict — either **full workflow** capture or **38-G** pack rerun on LD path |
| **[38F-5](38F-5-final-evaluation-and-sprint-closure.md) closure valid?** | **Yes** for frozen evidence and V-01/V-05 hypothesis; retrieval blocker **stands** on scored artefacts |

**Do not reopen 38-F CLOSED status** on calibration alone; treat this slice as **governance input** for the next charter decision.

---

## 9. Decision point: charter 38-G or recalibrate validation

```text
Frozen EV-38F-AFTER
  │
  ├─ assessment_check present? ──NO──► 38F-4 FAIL consistent
  │
  └─ IF future capture HAS assessment_check (10 formative)
        │
        ├─ Recalibrate 38D-4 V-10? ──YES──► R3 may Present (page)
        │
        └─ DLA-WB-11 without DLA rows? ──FAIL──► Workbook still FAIL (V-09)
              │
              └─ 38-G pack co-presence OR full-workflow DLA assessment spec
```

| Gate | Action |
|------|--------|
| **Before 38-G charter** | Adopt **§7 C** policy in writing (38D programme note or sprint-38G charter prerequisite) |
| **Charter 38-G when** | Programme accepts **LD-path** anchor needs **task_cards/checklist** alongside 38F-06a/18 **or** commits to **full-workflow** scoring with calibrated `assessment_check` rules |
| **Do not charter yet** | Per task constraint — this slice completes first |

---

## 10. Completion statement

| Criterion | Met? |
|-----------|------|
| Clear answer: retrieval pedagogically absent on **frozen** capture? | **Yes** — §4 |
| Clear answer: validation narrower than possible page assessment? | **Yes** — §3, §6 |
| Explicit recommendation before 38-G charter | **Yes** — **C** + ordered actions §7 |
| No implementation | **Yes** |
| 38F verdict impact stated | **Yes** — §8 |

**Slice 38F-6:** **COMPLETE**  
**Next (programme, not started):** Validation spec amendment (38D) **then** charter decision for **38-G** or **full-workflow** re-capture.
