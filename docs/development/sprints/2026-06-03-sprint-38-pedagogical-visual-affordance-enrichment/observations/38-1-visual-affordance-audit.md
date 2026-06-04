# Slice 38-1 — Visual affordance audit

**Date:** 2026-06-03  
**Status:** **COMPLETE** (observation only)  
**Reviewer lens:** learning designer (lead); enhancement operator  
**Anchors:** Inflation workshop (full + CSV), climate misconception, CI golden, Marx self-study  
**Change type:** observation only — no code, schema, prompt, or VEU architecture changes

**Probe:** [../fixtures/probe-38-1-inflation-visual-affordance-audit.md](../fixtures/probe-38-1-inflation-visual-affordance-audit.md)

**Method:** Fixture JSON review; `buildUtilityStructuredHtmlForTest` render inventory (same path as `tests/utility-visual-affordance-hooks.test.js`); `utilityRenderVisualAffordanceHook` source review (`app.js`); VEU v1.1.1 analyse-step prompt (`docs/workflow/exports/visual-enhancement-utility-v1.1.1.json`). Cross-check Sprint 36-4 opportunity inventory.

---

## Executive summary

| Finding | Verdict |
|---------|---------|
| Upstream JSON affordances | **None** — no `visual_affordances`, `activity_visual_value`, or `visual_decision` on any anchor fixture |
| Renderer hooks (Sprint 36) | **Present** — placement-only hidden `<div class="util-visual-affordance">` |
| Hook metadata today | `data-visual-slot`, `data-visual-subject` (≈ activity title), `data-visual-activity-id` |
| VEU analyse input | **Rendered HTML primary**; infers purpose, representation, tier, anti-spoiler from DOM + titles + prose |
| Human-designer test (hook-only) | **Fail** on all four anchors |
| Primary bottleneck | **Confirmed upstream** affordance semantics — not image model or DOM placement |

Sprint 38 v2 would reduce **44 rendered hooks** across five fixtures to roughly **6 generate**, **2 defer**, **7 reject** at the **pedagogical opportunity** level (not one figure per hook).

---

## 1. What metadata exists today?

### 1.1 Page / activity JSON (all anchors)

| Field (Sprint 38 v2 target) | Inflation full | Inflation CSV | Climate | CI golden | Marx |
|----------------------------|----------------|---------------|---------|-----------|------|
| `page.visual_affordances[]` | absent | absent | absent | absent | absent |
| `activity_visual_value` | absent | absent | absent | absent | absent |
| `visual_decision` / `rejection_reason` | absent | absent | absent | absent | absent |
| Activity `purpose` | A1 only | absent | CC-MIS-1 | A1, A2, A4 | A2–A4 |
| Rich `materials` | section `activity_materials` | inline on activities | inline | inline | inline |

**Inflation full** splits `learning_activities` (empty `materials: []` on rows) from `activity_materials` section — merge at render time (`getPageSectionsForRender` / pipeline). Pedagogical content **exists in JSON** but **not** in affordance brief fields.

### 1.2 Renderer hooks (`utilityRenderVisualAffordanceHook`)

Emitted attributes (factual):

```text
class="util-visual-affordance util-visual-affordance--{slot}"
data-visual-slot="{slot}"
data-visual-subject="{activity title}"   // optional
data-visual-activity-id="{id}"         // optional
hidden aria-hidden="true"
```

**Not emitted:** `purpose`, `preferred_representation`, `anti_spoiler`, `spoiler_boundary`, `must_show`, `source_basis`, `visual_decision`, discipline fidelity fields.

**Slot types observed in audit renders:**

| Slot | Typical trigger |
|------|-----------------|
| `activity-after-header` | Per activity header |
| `activity-framing-after` | Framing block present (CI A2/A4, Marx A3) |
| `materials-entry` | Materials stack opens |
| `materials-card-grid-after` | Task cards grid (Inflation A1, Climate) |
| `materials-table-pair-between` | Two `util-table-scroll` in one activity (CI A2) |
| `materials-model` / `materials-practice` / `materials-scenario` | Role-specific material bands |
| `materials-thinking` | Cognition band (sometimes missing `activity-id`) |
| `assessment-before-checkpoint` | Page-level assessment section |

### 1.3 Rendered hook counts (audit run)

| Fixture | Activities | Hook count | Notes |
|---------|------------|------------|-------|
| `ld-inflation-workshop-page-full.json` | A1–A5 | **14** | A1: 4 hooks; A2: 2; A3–A4: 3 each; A5: 1; +1 assessment |
| `ld-inflation-workshop-csv-worksheet-page.json` | A2, A3 | **2** | `materials-entry` only — no `table-pair-between` (single table each) |
| `ld-climate-misconception-discussion-page.json` | CC-MIS-1 | **5** | Includes `card-grid-after`, `materials-practice` |
| `confidence-interval-a2-multitable-page.json` | A1, A2, A4 | **13** | A2 has `materials-table-pair-between`; 2× `materials-thinking` without activity id |
| `marx-self-study-page.json` | A2–A4 | **10** | No table-pair hook (comparison table is markdown template) |

---

## 2. What must VEU infer today?

From **Analyse pedagogic visual opportunities** (v1.1.1) instructions:

| Must infer (not in hooks) | Inference source today | Risk |
|---------------------------|------------------------|------|
| Pedagogical purpose | Activity title, headings, table headers | Topic-level (“inflation”, “climate”) |
| Tier (essential/valuable/optional) | Heuristic on DOM complexity | **F5** indiscriminate — one opportunity per slot-like region |
| `suggested_figure_type` | Keyword + discipline guess | **F4** non-canonical clip-art |
| Anti-spoiler | Rarely explicit | **F6** spoiler on pre-task worksheets |
| Pedagogic justification | Scraped from nearby prose | **F3** illustrated summary |
| Canonical economics/stats form | Model training bias | **F2** unsupported claims |
| Duplicate vs existing table | Must compare table markdown to proposal | **F1** duplicate |

**Authoritative JSON:** Not referenced in current VEU prompt — HTML-only contract.

**Inflation validation alignment:** Enhancement can place figures correctly (v1.1.1 DOM) yet still choose **topic posters** because analyse step has no `purpose`, `must_not_show`, or `visual_decision: reject`.

---

## 3. Charter questions (by anchor programme)

| Question | Inflation | Climate | CI | Marx |
|----------|-----------|---------|-----|------|
| Why is this visual here? | **Fail** — hooks silent | **Fail** | **Fail** | **Fail** |
| Cognitive job explicit? | **Fail** at hook; **Partial** in materials JSON | **Partial** in `purpose` + template | **Partial** in `purpose` + scenario | **Partial** in `purpose` + template |
| Purpose explicit vs inferred? | **Fail** | **Fail** | **Fail** | **Fail** |
| Anti-spoiler explicit? | **Fail** | **Fail** | **Fail** | **Fail** |
| LD-actionable without page? | **Fail** (hooks); **Partial** (materials) | **Partial** | **Partial** (A4 endpoints in JSON) | **Partial** |

---

## Human-designer test

> Could a competent learning designer create the **correct instructional diagram** from the **currently emitted affordance alone**, without reading the page?

| Anchor | Score | Rationale |
|--------|-------|-----------|
| **Inflation** | **Fail** | Hooks expose only activity title + slot. Designer cannot know CPI vs deflator distinction, anti-spoiler on empty cells, or rejection of warm-up/debrief. Materials exist in JSON but are **not** in affordance payload. |
| **Climate** | **Fail** | `card-grid-after` hook does not specify mechanism vs evidence roles, classification spoiler, or reject assessment figure. Activity `purpose` is in JSON but **not** on hooks. |
| **CI** | **Fail** | `materials-table-pair-between` signals **where** but not level–width **distinction** or A4 **number-line** with exact endpoints. Quantitative fidelity requirements absent. |
| **Marx** | **Fail** | Hooks carry escaped titles only. Comparison framework and purpose-vs-plot move live in template markdown — not in affordance metadata. |

**Programme read:** **0/4 Pass**, **0/4 Partial** at emitted-affordance-only bar. Reading full page JSON raises several activities to **Partial**, but that is exactly what VEU does today via HTML scrape — inconsistent and lossy.

---

## Affordance quality rubric (representative hooks)

Score **0–2** per criterion (max **10**). Representative = highest-value hook per anchor from Sprint 36-4 inventory.

| Representative hook | Purpose | Representation | Discipline | Spoiler | Designer action | **Total** |
|---------------------|---------|----------------|------------|---------|-----------------|-----------|
| Inflation A2 `activity-after-header` | 1 | 0 | 0 | 0 | 1 | **2** |
| Climate `materials-card-grid-after` | 1 | 0 | 0 | 0 | 1 | **2** |
| CI A2 `materials-table-pair-between` | 1 | 1 | 0 | 0 | 1 | **3** |
| Marx A3 `materials-entry` | 1 | 0 | 0 | 0 | 1 | **2** |

**Interpretation:** Scores reflect **topic/slot hints only**. No hook reaches designer-sufficient (**≥8**) threshold from Sprint 38 v2.

---

## Generate / Defer / Reject matrix

Applied Sprint 38 v2 **mentally** to pedagogical opportunities (36-4 + fixture materials), not to every hook.

| Anchor | Activity / opportunity | Current state | **Decision** | Reason |
|--------|------------------------|---------------|--------------|--------|
| Inflation | A1 warm-up | 4 hooks; task_cards + scenarios + classification table | **reject** | `low_value_activity` — cards/table carry inquiry |
| Inflation | A2 indicator comparison | 2 hooks; `comparison_table` (CPI/PPI/deflator) | **generate** | `distinction` + `comparison_framework`; supports table, `anti_spoiler` |
| Inflation | A3 household scenarios | scenario + empty `analysis_table` | **reject** | `duplicate_existing_material` — table is canonical |
| Inflation | A4 variable costs | scenario + `impact_table` | **reject** | `duplicate_existing_material` |
| Inflation | A5 debrief | 1 hook; discussion prompts only | **reject** | `low_value_activity` |
| Inflation CSV | A2 index table | 1 hook; CSV `comparison_table` | **generate** | Same as A2 full |
| Inflation CSV | A3 types grid | 1 hook; empty classification rows | **generate** | `classification` matrix; strict `spoiler_boundary` |
| Climate | Mechanism (post cards) | `materials-card-grid-after` hook | **generate** | `mechanism` / `causal_model`; pre-template |
| Climate | Evidence structure | `analysis_template` + `materials-practice` | **generate** | `evidence_structure`; for/against scaffold |
| Climate | Formative T/F check | `assessment-before-checkpoint` | **reject** | `decorative_only` / `spoiler_risk` on answers |
| CI | A4 interval overlap | scenario table; no overlap-specific hook on A4 | **generate** | `data_pattern_reading`; `requires_exact_data_match: true` |
| CI | A2 level vs width | `materials-table-pair-between` present | **generate** | `distinction`; `bar_strip_ordered` |
| CI | A1 procedure move | `materials-model` hook | **defer** | Worked-example prose sufficient first pass |
| CI | Assessment p-value tree | assessment hook | **reject** | `low_value_activity` — text-first checkpoint |
| Marx | A3 text comparison | template comparison table | **generate** | `comparison` + `comparison_framework` |
| Marx | A2 model row | `materials-model` | **defer** | Model row in markdown — figure optional |
| Marx | Knowledge summary chain | prose relationships only | **reject** | `duplicate_existing_material` |
| Marx | A4 factory scenario | checklist + scenario text | **reject** | `low_value_activity` unless sparse labelled sketch — default reject |

### Purpose-gating survival (opportunity level)

| Decision | Count (representative set) |
|----------|----------------------------|
| **generate** | **6** |
| **defer** | **2** |
| **reject** | **7** |

**Hooks vs opportunities:** 44 hooks would wrongly suggest up to **44** analyse paths; v2 gating leaves **6** generate-worthy instructional diagrams for these anchors.

---

## Failure-mode mapping (by activity)

Legend: **O** = observed in inflation programme / likely on HTML-only VEU; **P** = possible without upstream brief; **U** = unlikely if v2 followed.

| Activity | F1 duplicate | F2 unsupported claim | F3 illustrated summary | F4 non-canonical | F5 indiscriminate | F6 spoiler |
|----------|--------------|---------------------|------------------------|------------------|-------------------|------------|
| Inflation A1 | P | U | P | P | **O** | P |
| Inflation A2 | **O** | P | **O** | **O** | **O** | **O** |
| Inflation A3 | P | U | P | P | P | **O** |
| Inflation A5 | P | U | P | P | **O** | U |
| Climate CC-MIS-1 | P | P | **O** | **O** | **O** | **O** |
| CI A2 | P | P | P | P | **O** | P |
| CI A4 | P | **O** | P | P | P | P |
| Marx A3 | P | U | P | P | **O** | P |

**F5** is systemic: hook emission is **material-type-driven** (`utilityMaterialsWarrantVisualAffordances`), not purpose-gated.

---

## Per-anchor notes

### Inflation workshop (`ld-inflation-workshop-page-full.json`)

- **Materials:** A2 `comparison_table` (CPI, PPI, GDP deflator); A1 task cards + classification; A3–A4 scenario tables — strong tabular pedagogy.
- **Hooks:** Multiple per activity without rejection records → VEU may propose **hero + table + scenario** visuals.
- **CSV fixture:** Worksheets on activities; fewer hooks (2) but same A2/A3 generate/reject logic.
- **Gap vs live project:** Live validation reported topic-level enhancement; audit confirms hooks cannot prevent it.

### Climate (`ld-climate-misconception-discussion-page.json`)

- Single activity with rich cards + template + hidden T/F answers in JSON.
- `materials-card-grid-after` is the right **slot** for mechanism; no `purpose: mechanism` on hook.
- Assessment hook risks **F6** if analyse treats checkpoint as visual opportunity.

### CI golden (`confidence-interval-a2-multitable-page.json`)

- Strong quantitative materials: dual tables on A2, interval endpoints on A4.
- Only anchor with `materials-table-pair-between` — best **placement** signal, still **0** pedagogical semantics.
- `requires_exact_data_match` mandatory for A4 generate in v2.

### Marx (`marx-self-study-page.json`)

- Comparison pedagogy in A3 template; A2 worked example models row.
- No `table-pair-between` despite two table-like regions in template (markdown) — placement heuristic under-emits vs over-emits on inflation.

---

## VEU opportunity assumptions (visible)

| Assumption in v1.1.1 analyse prompt | Audit verdict |
|-------------------------------------|---------------|
| HTML DOM is sufficient input | **Insufficient** for discipline fidelity |
| Activity title anchors description | Drives **topic inference** |
| Tier from analyse judgement | No upstream `visual_decision: reject` |
| `decorative-rejected` from model discretion | Not tied to authored `rejection_reason` |
| `placement_hint` from slot classes | **Aligned** with Sprint 36 — keep |
| JSON affordances authoritative | **Not implemented** — required for 38-5 |

---

## Answers to audit success criteria

| # | Question | Answer |
|---|----------|--------|
| 1 | What metadata exists today? | Placement hooks only: slot, activity id, title-as-subject. No page-level affordance JSON. |
| 2 | What must VEU infer? | Purpose, tier, figure type, justification, spoiler policy, canonical form, duplicate detection, claim boundaries. |
| 3 | Which opportunities should be rejected? | **7** in representative matrix (warm-ups, debriefs, table-duplicates, assessment decoration, prose chain). |
| 4 | How many survive purpose-gating? | **6 generate**, **2 defer** (not 44 hook-scale opportunities). |
| 5 | Human-designer test? | **Fail** all anchors at emitted affordance; materials save Partial only when reading full JSON/HTML. |
| 6 | Primary bottleneck upstream? | **Yes — confirmed.** Placement adequate; semantic brief absent. |

---

## Rejected scope creep (38-1)

- No `app.js` / renderer / CSS changes  
- No schema implementation  
- No prompt patches (38-5)  
- No live HTML re-run of production inflation export (fixture + programme notes suffice)

---

### Sprint 38-1 conclusion

| Metric | Value |
|--------|-------|
| **generate** (purpose-gated opportunities) | **6** |
| **defer** | **2** |
| **reject** | **7** |
| **Human-designer pass rate** (emitted affordance only) | **0/4 Pass** (0 Pass, 0 Partial, 4 Fail) |
| **Representative affordance quality (avg)** | **~2.25 / 10** |

**Affordance quality findings**

- Hooks implement **Sprint 36 placement** correctly but are **pedagogically empty**.
- **`data-visual-subject` ≈ topic label** — encodes the failure mode inflation validation found.
- **No intentional rejection** — absence of hooks is not `visual_decision: reject`.
- **Hook multiplicity** encodes false “need for visuals” (**F5**).
- Page JSON often contains enough for a designer to work **after reading the page** — upstream must **emit** that into affordance objects.

**Recommendation for 38-2 (taxonomy)**

- Bind every `generate` to one taxonomy purpose; map warm-up/debrief/overview to **reject** paths with `low_value_activity`.
- Add quantitative purposes (`data_pattern_reading`, `threshold_or_boundary`) explicitly for CI.
- Document `unclassified` / title-only as QA failure.

**Recommendation for 38-3 (representation guidance)**

- Tie inflation A2 to `comparison_framework`; A3 CSV grid to `classification_matrix` with spoiler rules.
- Tie CI A2 pair-slot to `bar_strip_ordered`; A4 to `number_line_segments` + `requires_exact_data_match`.
- Tie climate card-grid slot to `causal_model`; template to `evidence_t_chart`.

**Recommendation for 38-4 (schema implementation)**

- Implement `activity_visual_value` + `visual_decision` on every reviewed activity before hooks emit.
- Emit **no hook** for `reject` (fix F5); passthrough minimal `data-*` for `generate` only.
- Enforce full designer-actionable field set on `tier: essential | valuable`.
- Wire **Validate Learning Design** QA per charter §10.

**Regression:** Not run — observation-only slice; entry floor remains **642 pass / 0 fail** when implementation begins.
