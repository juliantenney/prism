# Slice 38-2 — Pedagogical visual purpose taxonomy

**Date:** 2026-06-03  
**Status:** **COMPLETE** (observation + taxonomy only)  
**Reviewer lens:** learning designer; discipline expert  
**Primary evidence:** [38-1-visual-affordance-audit.md](38-1-visual-affordance-audit.md)  
**Change type:** taxonomy — no schema, prompts, renderer, VEU, or code

**Probe:** [../fixtures/probe-38-2-purpose-taxonomy-seed.md](../fixtures/probe-38-2-purpose-taxonomy-seed.md)

---

## Success criterion

Every audited candidate opportunity from 38-1 classifies unambiguously as `visual_decision: generate | defer | reject` with a taxonomy **`purpose`** (if generate), **`defer_reason`** (if defer), or **`rejection_reason`** (if reject).

**No "other" category** is required for the 38-1 matrix.

| Roll-up (38-1 conclusion) | Count |
|---------------------------|-------|
| **generate** (pedagogical opportunities) | **6** |
| **defer** | **2** |
| **reject** | **7** |
| **Meaningful opportunities** | **15** (= 6 + 2 + 7) |

The 38-1 matrix lists **17 rows** where Inflation A2 appears twice (full workshop + CSV fixture); taxonomy treats that as **one** generate opportunity, two fixtures (see crosswalk).

---

## Definition — what counts as a visual opportunity?

**Adopted definition (programme):**

> A visual opportunity is a place where a visual **performs a pedagogical function not already adequately performed** by surrounding materials — **not** a place where a visual **can be inserted**.

**38-6 generic QA (generate):** A generated visual must contribute **reasoning support** not already adequately provided by activity materials. **Fail** when the figure would be: duplicate worksheet, duplicate table, duplicate answer structure, topic poster, illustrated summary, or generic infographic. `purpose` + `preferred_representation` alone do not satisfy this rule — author `pedagogical_added_value` (38-4, 38-6).

| Counts as opportunity | Does **not** count |
|----------------------|-------------------|
| Reduces load for a **named cognitive job** (discriminate indices, trace mechanism, read overlap) | DOM hook exists (`util-visual-affordance`) |
| Supports reasoning **without** replacing table/worksheet/prose | Activity title mentions a topic |
| Could brief a designer with **purpose + constraints** | Materials already encode the representation adequately |

**38-1 evidence:** 44 hooks vs **15** meaningful opportunities — hook multiplicity is **F5 indiscriminate**, not opportunity multiplicity.

---

## Visual decision model (formal sequence)

Apply **per activity** (or per single pedagogical function within an activity), after `activity_visual_value` gate.

```text
START: Activity reviewed for visual need

1. Can a visual perform a distinct pedagogical function here?
   NO  → visual_decision: reject
         (rejection_reason: see Rejection taxonomy)
   YES → continue

2. Is the pedagogical function already adequately performed by
   existing materials (table, worksheet, cards, worked example, prose)?
   YES → visual_decision: reject
         (rejection_reason: duplicate_existing_structure)
   NO  → continue

3. Would a figure reveal learner work, classification keys, or model
   solutions before the intended learner move?
   YES → visual_decision: defer
         (defer_reason: see Defer taxonomy)
         OR generate with anti_spoiler + spoiler_boundary (38-4)
         when structural hint only (38-1: Inflation A3 CSV → generate)
   NO  → continue

4. Should the learner attempt / complete the move using existing
   materials first, with optional figure only after?
   YES → visual_decision: defer
   NO  → continue

5. Does a figure support reasoning not already adequately supported?
   YES → visual_decision: generate
         (purpose: see Generate taxonomy)
   NO  → visual_decision: reject
         (rejection_reason: low_pedagogical_value)

END
```

**Defer vs generate with anti-spoiler:** If the cognitive job **requires** a structural diagram **before** the worksheet (e.g. mechanism before evidence lines), choose **generate** with `anti_spoiler: true`. If the diagram only helps **after** attempt, choose **defer**.

**Not an image-generation decision:** `generate` means “author a pedagogical visual brief,” not “call the image model.”

---

## Part A — Generate taxonomy (6 purposes)

Six purposes cover all **6** generate decisions in 38-1. Each is evidenced by at least one anchor activity.

---

### 1. `distinction`

| Field | Value |
|-------|--------|
| **Definition** | Separate concepts learners conflate, on **named dimensions**, without collapsing them into one topic label. |
| **Cognitive job** | Discriminate — tell apart two or more constructs that share surface similarity. |
| **Learner move** | Name what differs, on which dimension, and what mistake follows from conflation. |
| **Representative audit example** | **Inflation A2** — CPI vs PPI vs GDP deflator (`comparison_table`); **CI A2** — procedure vs single-interval interpretation vs confidence **level vs width** (paired tables, `materials-table-pair-between`). |
| **Preferred representation family** (38-3) | `comparison_framework`, `side_by_side_distinction`, `bar_strip_ordered` |

```yaml
purpose: distinction
cognitive_job: discriminate_conflated_constructs
typical_representation: comparison_framework | bar_strip_ordered
example_fixture:
  - tests/fixtures/page-render/ld-inflation-workshop-page-full.json (A2)
  - tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json (A2)
  - tests/fixtures/page-render/confidence-interval-a2-multitable-page.json (A2)
```

---

### 2. `comparison`

| Field | Value |
|-------|--------|
| **Definition** | Align **two or more cases or texts** on explicit criteria (purpose, difference, impact) — not a topic overview. |
| **Cognitive job** | Compare — judge similarity and difference on defensible dimensions. |
| **Learner move** | Complete or interpret rows/columns using criteria; defend one difference or purpose claim. |
| **Representative audit example** | **Marx A3** — Manifesto vs *Kapital* (`template` comparison table, purpose-and-difference move). |
| **Preferred representation family** | `comparison_framework` (2×2 aim × audience optional) |

```yaml
purpose: comparison
cognitive_job: compare_cases_on_criteria
typical_representation: comparison_framework
example_fixture:
  - tests/fixtures/page-render/marx-self-study-page.json (A3)
```

---

### 3. `classification`

| Field | Value |
|-------|--------|
| **Definition** | Support **sorting or typing** into categories where empty cells must stay empty (anti-spoiler). |
| **Cognitive job** | Classify — place items or aspects into types without pre-filled answers. |
| **Learner move** | Fill classification grid (cause, mechanism, example, difference) from evidence. |
| **Representative audit example** | **Inflation CSV A3** — demand-pull / cost-push / built-in grid with empty cells (`comparison_table` rows). |
| **Preferred representation family** | `classification_matrix` |

```yaml
purpose: classification
cognitive_job: classify_into_types
typical_representation: classification_matrix
example_fixture:
  - tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json (A3)
```

---

### 4. `mechanism`

| Field | Value |
|-------|--------|
| **Definition** | Show **how parts interact** to produce an outcome (inputs/outputs, flows) — not a slogan or decorative scene. |
| **Cognitive job** | Trace mechanism — connect components to an effect learners will later evaluate. |
| **Learner move** | Use mechanism to interpret claims before filling evidence or classification lines. |
| **Representative audit example** | **Climate CC-MIS-1** — radiative balance / greenhouse framing **after** misconception cards, **before** analysis template (`materials-card-grid-after` slot). |
| **Preferred representation family** | `causal_model` |

```yaml
purpose: mechanism
cognitive_job: trace_mechanism
typical_representation: causal_model
example_fixture:
  - tests/fixtures/page-render/ld-climate-misconception-discussion-page.json (CC-MIS-1)
```

---

### 5. `evidence_structure`

| Field | Value |
|-------|--------|
| **Definition** | Make **for/against / supported vs misconception** structure visible before learners write prose lines. |
| **Cognitive job** | Weigh evidence — organise claims relative to data strength. |
| **Learner move** | Complete analysis template using visible evidence scaffold. |
| **Representative audit example** | **Climate CC-MIS-1** — `analysis_template` (evidence for/against, classification checkboxes). |
| **Preferred representation family** | `evidence_t_chart` |

```yaml
purpose: evidence_structure
cognitive_job: structure_evidence_for_against
typical_representation: evidence_t_chart
example_fixture:
  - tests/fixtures/page-render/ld-climate-misconception-discussion-page.json (CC-MIS-1)
```

**Note:** Same activity as `mechanism` but **distinct pedagogical function** — Climate therefore has **two** generate opportunities (mechanism + evidence), not one combined poster.

---

### 6. `data_pattern_reading`

| Field | Value |
|-------|--------|
| **Definition** | Help learners **read a quantitative pattern** (overlap, width, endpoints) faithful to source data. |
| **Cognitive job** | Interpret pattern — judge overlap, spread, or relative position on a shared scale. |
| **Learner move** | Quote endpoints; decide overlap/narrow-wide using table values. |
| **Representative audit example** | **CI A4** — Control vs Treatment intervals in scenario table (`requires_exact_data_match` in 38-4). |
| **Preferred representation family** | `number_line_segments` |

```yaml
purpose: data_pattern_reading
cognitive_job: interpret_quantitative_pattern
typical_representation: number_line_segments
example_fixture:
  - tests/fixtures/page-render/confidence-interval-a2-multitable-page.json (A4)
```

---

### Purposes removed (no 38-1 generate evidence)

| Removed purpose | Reason |
|-----------------|--------|
| `process`, `system_interaction` | No audited activity required ordered/process diagram generate |
| `causal_chain` | Marx knowledge summary → **reject** (prose adequate), not generate |
| `framework` | Folded into **distinction** / **comparison** as representation family, not separate purpose |
| `hierarchy` | No generate case |
| `misconception_challenge` | Cards support evaluation but 38-1 assigned **mechanism** + **evidence_structure**; card content is material, not separate figure type |
| `synthesis`, `transfer` | No generate case; debrief/transfer rows → **reject** or **defer** |
| `threshold_or_boundary`, `scale_mapping`, `case_mapping`, `model_limitations` | Not needed to classify 38-1 matrix; CI α assessment → **reject** (text-first) |

---

## Part B — Defer taxonomy (2 reasons)

Defer is **normal** — prefer defer over speculative **generate** when materials already carry the first pedagogical step.

| `defer_reason` | Definition | Prefer defer over generate when | Audit example |
|----------------|------------|----------------------------------|---------------|
| **`worked_example_sufficient_first`** | Worked example / model row in markdown already demonstrates the reasoning move; figure would duplicate or front-run reading. | Learner must read modelled row before practice; figure adds little beyond prose+table. | **CI A1** — `worked_example` procedure vs interval (`materials-model` hook) |
| **`model_row_sufficient_first`** | One modelled table row is the canonical demonstration; full figure before learner row completion is optional. | Same as above for humanities comparison model. | **Marx A2** — model row in `worked_example` before A3 table |

**Alias (prompt-friendly):** `learner_must_attempt_first` maps to both rows above.

| Defer rule | |
|------------|--|
| After defer condition clears | Re-evaluate → often **reject** (still duplicate) or **generate** with `learner_stage: post-reasoning` |
| Do not defer indefinitely | If activity ends without learner attempt, defer should have become **reject** |

```yaml
# CI A1 — 38-1 defer
visual_decision: defer
defer_reason: worked_example_sufficient_first
purpose: distinction  # latent — procedure vs single-interval probability
example_fixture: tests/fixtures/page-render/confidence-interval-a2-multitable-page.json (A1)
```

```yaml
# Marx A2 — 38-1 defer
visual_decision: defer
defer_reason: model_row_sufficient_first
purpose: comparison
example_fixture: tests/fixtures/page-render/marx-self-study-page.json (A2)
```

**Not used in 38-1 matrix (reserved for 38-3/38-4):** `worksheet_completion_required`, `post_classification_only`, `synthesis_after_activity` — no audited row required them; Inflation A3 household was **reject** (table canonical), not defer.

---

## Part C — Rejection taxonomy (7 reasons)

Rejection is a **first-class authored outcome** — not absence of hooks.

| `rejection_reason` | Definition | Audit example |
|--------------------|------------|---------------|
| **`low_pedagogical_value`** | Activity type does not gain a distinct reasoning step from a figure (warm-up, debrief, checklist-only application). | **Inflation A1** warm-up; **Inflation A5** debrief; **Marx A4** factory checklist scenario |
| **`debrief_without_new_reasoning`** | Whole-group or closing discussion prompts; figure would summarize rather than support new inference. | **Inflation A5** (sub-reason of low value; cite when debrief-specific) |
| **`duplicate_existing_structure`** | Table, worksheet, cards, or prose already perform the representation adequately; figure would duplicate (**F1**). | **Inflation A3** household `analysis_table`; **Inflation A4** `impact_table`; **Marx** `knowledge_summary` relationships prose |
| **`decorative_only`** | No cognitive job; topic/hero illustration (**F3/F4**). | **Climate** formative T/F block — assessment decoration |
| **`spoiler_risk`** | Figure would expose answers, T/F keys, or classification outcomes (**F6**). | **Climate** assessment (paired with decorative_only); reinforces **reject** not generate for checkpoint visuals |
| **`assessment_text_sufficient`** | Checkpoint is prose/Q&A-first; visual adds no disciplined function. | **CI** assessment `assessment-before-checkpoint` hook |
| **`insufficient_source_basis`** | Cannot brief canonical diagram from materials alone (not observed as primary reject in 38-1, but reserved for quantitative **F2** guard). | — (no row; CI A4 **generate** requires `source_basis` instead) |

**38-1 seven reject rows → seven reasons:**

| # | Activity | `rejection_reason` |
|---|----------|-------------------|
| 1 | Inflation A1 | `low_pedagogical_value` |
| 2 | Inflation A3 household | `duplicate_existing_structure` |
| 3 | Inflation A4 | `duplicate_existing_structure` |
| 4 | Inflation A5 | `debrief_without_new_reasoning` |
| 5 | Climate formative check | `decorative_only` (+ `spoiler_risk`) |
| 6 | CI assessment | `assessment_text_sufficient` |
| 7 | Marx knowledge summary | `duplicate_existing_structure` |

**Marx A4** (factory checklist): classify as **`low_pedagogical_value`** — same roll-up family as A1; listed in crosswalk for traceability (38-1 matrix row 17).

**Topic-only / title-only:** Not a rejection reason — **compose defect** (unclassified → must repair or reject with explicit reason above).

---

## Part D — Audit crosswalk (38-1 → taxonomy)

| Anchor | Activity / opportunity | Decision | `purpose` / `defer_reason` / `rejection_reason` | Reason (one line) |
|--------|------------------------|----------|--------------------------------------------------|-------------------|
| Inflation | A1 warm-up | **reject** | `low_pedagogical_value` | Cards + scenarios + table carry activation |
| Inflation | A2 indicator comparison | **generate** | `distinction` | Indices conflated; table needs framework support |
| Inflation | A3 household scenarios | **reject** | `duplicate_existing_structure` | `analysis_table` is canonical |
| Inflation | A4 variable costs | **reject** | `duplicate_existing_structure` | `impact_table` is canonical |
| Inflation | A5 debrief | **reject** | `debrief_without_new_reasoning` | Discussion prompts only |
| Inflation CSV | A3 types grid | **generate** | `classification` | Empty type grid; anti-spoiler |
| Climate | Mechanism (post cards) | **generate** | `mechanism` | Mechanism before template |
| Climate | Evidence template | **generate** | `evidence_structure` | For/against + classification scaffold |
| Climate | Formative T/F | **reject** | `decorative_only` | Answers in JSON; no figure job |
| CI | A4 interval overlap | **generate** | `data_pattern_reading` | Endpoints in table; number line |
| CI | A2 level vs width | **generate** | `distinction` | Paired tables; level–width conflation |
| CI | A1 worked example | **defer** | `worked_example_sufficient_first` | Prose model row first |
| CI | Assessment checkpoint | **reject** | `assessment_text_sufficient` | Text-first formative |
| Marx | A3 text comparison | **generate** | `comparison` | Purpose/difference table |
| Marx | A2 model row | **defer** | `model_row_sufficient_first` | Model row before full table |
| Marx | Knowledge summary chain | **reject** | `duplicate_existing_structure` | Prose relationships adequate |
| Marx | A4 factory scenario | **reject** | `low_pedagogical_value` | Checklist + scenario text adequate |

**Inflation A2 CSV** merges into **Inflation A2** row (same `purpose: distinction`).

**Classification check:** 6 generate + 2 defer + 7 reject = **15** programme opportunities; **17** matrix rows with A2 duplicate + Marx A4 explicit.

---

## Part E — Tier promotion criteria (`essential` | `valuable` | `optional`)

Tier applies only when `visual_decision: generate`.

| Tier | Promotion requires | Audit examples |
|------|-------------------|----------------|
| **essential** | (1) Named **F5/F6** risk without figure — learners systematically fail without visual support; (2) mechanism or evidence job **before** worksheet; (3) discipline stakes high (misconception + mechanism). | **Climate** `mechanism` (weather vs climate / radiative balance before template) |
| **valuable** | (1) Clear `purpose` reduces load but table/prose **can** complete job; (2) `anti_spoiler` generate; (3) duplicate risk managed via `representation_avoid`. | **Inflation A2** distinction; **CI A2** distinction; **CI A4** data_pattern_reading; **Marx A3** comparison; **Inflation A3** classification; **Climate** evidence_structure |
| **optional** | (1) Defer path almost as good; (2) post-hoc enrichment only; (3) not used in 38-1 generate set. | — (none promoted from audit — prefer **defer** instead of optional generate) |

**Rule:** Do not assign `tier: optional` to avoid deciding — use **`defer`** or **`reject`**.

**Downstream:** `tier: decorative-rejected` is only for **`visual_decision: reject`** outputs in VEU, not LD compose.

---

## Purpose selection rules (prompt-ready summary)

1. **One primary `purpose` per generate affordance** — Climate CC-MIS-1 may have **two** affordances (`mechanism` + `evidence_structure`), not one combined purpose.  
2. **Bind to `learner_task` + materials**, not activity title.  
3. **`duplicate_existing_structure` → reject**, not generate — even when hooks exist (Inflation A3/A4).  
4. **Hook slot ≠ opportunity** — apply Definition section first.  
5. **`unclassified` / topic-only → compose defect**, not a taxonomy bucket.

---

## Mapping: shallow signals → taxonomy (repair)

| Shallow signal | Decision | Taxonomy field |
|----------------|----------|----------------|
| `topic: inflation` | reject | `decorative_only` or repair → `distinction` |
| Activity title only | reject / defect | — |
| 44 hooks, no purpose | reject per activity gate | multiple `rejection_reason` |
| Empty worksheet + headers | generate | `classification` or `comparison` + anti-spoiler |
| Worked example present | defer | `worked_example_sufficient_first` |
| Table fills entire job | reject | `duplicate_existing_structure` |

---

## Sprint 38-2 conclusion

| Outcome | Status |
|---------|--------|
| Every 38-1 opportunity classifies without "other" | **Yes** — 6 purposes + 2 defer + 7 reject reasons |
| Generate / defer / reject = pedagogical decision | **Yes** — formal sequence in Part B/C |
| Rejection normal | **Yes** — 7/15 audited outcomes |
| Evidence-based purposes | **Yes** — 6 generate purposes, 10 speculative removed |
| Ready for 38-3 | **Yes** — `typical_representation` families named per purpose |

**Recommendation for 38-3:** Map each purpose’s `typical_representation` to tokens; add discipline notes for `data_pattern_reading` (`requires_exact_data_match`) and `classification` (`spoiler_boundary`).

**Recommendation for 38-4:** Encode `defer_reason` / `rejection_reason` enums exactly as above; lint `purpose` against allow-list of six generate values.

---

## Rejected scope creep (38-2)

- Schema / prompt / renderer / VEU implementation  
- New purposes without new audit evidence  
- Image-tier or model-selection taxonomy  

---

## Regression

Observation-only — **642 pass / 0 fail** unchanged.
