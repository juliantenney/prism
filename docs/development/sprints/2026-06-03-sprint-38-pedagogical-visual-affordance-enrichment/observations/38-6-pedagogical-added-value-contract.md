# Slice 38-6 — Pedagogical added-value contract

**Date:** 2026-06-03  
**Status:** **COMPLETE** (guidance + schema extension — no renderer/VEU topology/validation strictness change)  
**Authority:** [38-2](38-2-visual-purpose-taxonomy.md) · [38-3](38-3-representation-guidance.md) · [38-4](38-4-affordance-enrichment-design.md) · [38-5](38-5-workflow-alignment.md)  
**Catalog:** `lib/sprint38-representation-pedagogical-value.js`

---

## Root lesson (Inflation A3)

`preferred_representation: classification_matrix` correctly names a **layout family** but does not specify **what reasoning support** the figure must add. A model can comply with the token yet produce a **blank worksheet duplicate** — representation-correct, pedagogically weak.

**Fix:** Separate **layout token** from **pedagogical added value**.

---

## New field (generate affordances)

```yaml
pedagogical_added_value: string   # recommended on every generate row
```

**Purpose:** State what **new cognitive support** the visual provides that surrounding materials do **not** already supply adequately.

**Relationship to existing fields:**

| Field | Role |
|-------|------|
| `purpose` | Cognitive job category (38-2) |
| `preferred_representation` | Layout / diagram family (38-3) |
| `reasoning_supported` | How the figure supports the learner task |
| `pedagogical_added_value` | **Incremental** reasoning support vs materials (38-6) |
| `must_show` / `must_not_show` | Artist/model brief boundaries |
| `representation_avoid` | Hard negatives (includes duplicate-structure tokens) |

Compose validation **unchanged** — field is **recommended**, not required, so existing affordances remain valid.

---

## Generic QA rule

> A generated visual must contribute a reasoning support not already adequately provided by the activity materials.

**Fail when the figure would be:**

- duplicate worksheet  
- duplicate table  
- duplicate answer structure  
- topic poster  
- illustrated summary  
- generic infographic  

**Inflation A3 example:** Empty classification grid mirroring `analysis_table` ⇒ **Fail** (duplicate worksheet / duplicate answer structure).

---

## Human-designer test (enhanced)

| Step | Question |
|------|----------|
| 1 (existing) | Could a competent learning designer **draw** the figure from the record? |
| 2 (new) | Could they **explain what cognitive support** the figure provides beyond materials? |

If step 2 fails, the affordance is **incomplete** even when `purpose` + `preferred_representation` are allow-listed.

---

## Per-representation contract (38-3 extension)

Each existing token has `must_add` and `must_not_duplicate` guidance (no new tokens). See 38-3 §1 and `REPRESENTATION_PEDAGOGICAL_VALUE` in the lib catalog.

| Token | must_add (summary) | must_not_duplicate (summary) |
|-------|-------------------|------------------------------|
| `comparison_framework` | dimensions, salient differences, confusable features | decorative columns, duplicated table |
| `classification_matrix` | discriminating cues, decision criteria, category distinctions | blank worksheet, filled key |
| `causal_model` | mechanism visibility, directionality, intermediate links | isolated labels, topic diagram |
| `evidence_t_chart` | evaluation criteria, strength distinctions | copied evidence list |
| `number_line_segments` | exact quantitative relationships | invented intervals |
| `ordered_bar_strip` | ordered magnitude / level–width cue | pie duplicate, fabricated widths |
| `labelled_contrast_panel` | named contrast dimension | decorative two-column poster |

---

## VEU guidance (prompt only)

Step 1 / Step 2: **Generate the pedagogical support, not merely the visual structure.** When `pedagogical_added_value` is present, it anchors the image_queue prompt. Do not queue figures that only mirror empty learner worksheets or tables.

---

## Implementation map

| Layer | Action |
|-------|--------|
| LD Design Page | Author `pedagogical_added_value`; align `must_show` with must_add cues |
| 38-3 / 38-4 docs | Token must_add / must_not_duplicate + QA |
| VEU v1.2.1 | Prompt patch (38-6 block) — topology unchanged |
| Tests | Catalog coverage + doc presence |

**Out of scope:** renderer, CSS, image model, workflow topology, validator required-field changes.
