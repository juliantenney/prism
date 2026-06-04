# Sprint 38 — programme notes

**Date:** 2026-06-03

---

## Founding note

Visuals should be selected because they **support thinking**, not because a **topic** is present.

The Visual Enhancement Utility is not the primary bottleneck; **upstream pedagogical visual briefs** are.

**Pack v2:** Rejection is first-class (`visual_decision`, `rejection_reason`); activities carry `activity_visual_value`; generate-tier affordances must pass the human-designer test (see 38-4).

---

## Stable foundations (entry)

| Foundation | Detail |
|------------|--------|
| Renderer contracts | Sprint 34 golden fixture, MathJax, material paths |
| Activity + session pedagogy | Sprint 35 fields; Sprint 37 §6g–6k framing |
| Visual placement | Sprint 36 `.util-visual-affordance` + `data-visual-slot`; VEU v1.1.1 embed rules |
| Workshop policy | Sprint 37-6 learner-supportive vs facilitator-only materials |
| **Test floor** | **642 pass / 0 fail** (`node --test tests/*.test.js`) |

---

## Economics Inflation validation (programme trigger)

Qualitative findings from live/regenerated inflation workshop + enhancement pass:

| Failure mode | Sprint 38 response |
|--------------|-------------------|
| Visuals duplicate reasoning | `reasoning_supported`, `representation_avoid: summary_table` |
| Unsupported relationships | `preferred_representation`, canonical discipline notes |
| Illustrated summaries | `purpose` ≠ decoration; tier reject decorative |
| Indiscriminate opportunities | Activity-aware + purpose-required generation |
| Topic-only briefs | Enriched `concepts`, `learner_stage`, `anti_spoiler` |

---

## Evaluation anchors

| Anchor | Location |
|--------|----------|
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Inflation CSV worksheets | `tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json` |
| Climate | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| CI golden | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx | `tests/fixtures/page-render/marx-self-study-page.json` |
| Affordance hooks test | `tests/utility-visual-affordance-hooks.test.js` |

---

## Slice log

| Slice | Status | Notes file |
|-------|--------|------------|
| 38-1 Visual affordance audit | **Complete** | [observations/38-1-visual-affordance-audit.md](observations/38-1-visual-affordance-audit.md) |
| 38-2 Affordance purpose taxonomy | **Complete** | [observations/38-2-visual-purpose-taxonomy.md](observations/38-2-visual-purpose-taxonomy.md) |
| 38-3 Representation guidance | **Complete** | [observations/38-3-representation-guidance.md](observations/38-3-representation-guidance.md) |
| 38-4 Affordance enrichment design | **Complete** | [observations/38-4-affordance-enrichment-design.md](observations/38-4-affordance-enrichment-design.md) |
| 38-5 Workflow alignment | **Complete** | [observations/38-5-workflow-alignment.md](observations/38-5-workflow-alignment.md) |
| 38-6 LD affordance emission | **Complete** | §38-6 below |
| 38-7 Renderer alignment | **Complete** | §38-7 below |
| 38-8 VEU v1.2.1 patch | **Complete** | §38-8 below |

---

## 38-6 implementation (LD compose emission)

**Date:** 2026-06-03

| Area | Path |
|------|------|
| Validation + normalize | `lib/sprint38-visual-affordances.js` |
| Compose hook | `app.js` — `applySprint38VisualAffordancesToComposedPage` (via `applyPedagogicCognitionSemanticsToComposedPage`) |
| Design Page prompt | `domains/learning-design/domain-learning-design-step-patterns.md` §13 |
| Browser load | `index.html` — script before `app.js` |
| Tests | `tests/sprint-38-visual-affordances.test.js` |
| Probe records | `tests/fixtures/sprint-38/affordance-records.json` |

**Schema:** `visual_affordance_schema_version: "38.4"`, `activities_visual_review[]`, `visual_affordances[]` on `page` root per [38-4](observations/38-4-affordance-enrichment-design.md).

**Compromises:** Runtime drops invalid affordance rows (logged in `generation_notes.visual_affordance_validation`); LD prompt instructs emission — no deterministic synthesizer from HTML. Empty arrays default to `[]` on compose pass.

**Follow-up (not 38-6):** ~~Renderer hook filter~~ — done in 38-7; VEU v1.2.1 Step 1/2 prompt patch remains.

---

## 38-7 implementation (renderer alignment)

**Date:** 2026-06-03

| Area | Path |
|------|------|
| Render plan | `lib/sprint38-visual-affordances.js` — `buildVisualAffordanceRenderPlan`, `resolveSlotGenerate` |
| Hook gating | `app.js` — `utilityMaybeRenderVisualAffordanceHook`, `utilityBuildVisualAffordanceRenderPlan` |
| Passthrough | `data-affordance-id`, `data-activity-id` (+ existing `data-visual-slot`, `data-visual-activity-id`, `data-visual-subject`) |
| Tests | `tests/sprint-38-renderer-visual-affordances.test.js` |

**Hook behaviour**

| Mode | When | Hooks |
|------|------|-------|
| **Legacy** | `visual_affordances[]` missing or empty | Sprint 36 heuristics unchanged (placement unchanged) |
| **Authoritative** | Non-empty `visual_affordances[]` | Emit **only** `visual_decision: generate` rows with matching `activity_id` + `visual_slot` |
| **Defer / reject** | Authored rows | No hook for that slot; no substitute hooks |

**Follow-up:** End-to-end validation (38 validation slice) — inflation/climate/CI/Marx vs 38-1 baseline.

---

## 38-8 implementation (VEU v1.2.1 prompt patch)

**Date:** 2026-06-03

| Area | Path |
|------|------|
| Bundle | `utilities/visual-enhancement-utility/visual-enhancement-utility-v1.2.1.json` |
| Frozen v1.2 | `visual-enhancement-utility-v1.2.json` (unchanged) |
| Builder | `scripts/build-veu-v121-json.js` |
| Handover modes | `lib/sprint38-visual-affordances.js` — `detectVisualAffordanceHandoverMode` |
| Tests | `tests/sprint-38-veu-v121.test.js` |

**Modes:** legacy (no JSON) · hybrid (partial) · authoritative (full 38.4 handover).

**No changes:** workflow step count, image models, renderer, CSS, topology.

---

## Programme constraints (repeat)

- **No image model changes**
- **No renderer/CSS/UI** unless 38-4 documents minimal `data-*` passthrough on existing hooks
- **No VEU architecture redesign** in 38-5 (prompt/handover only)
- **Preserve** Sprint 36 placement tests and Sprint 37 rhetoric
- **Prefer** instructional diagrams over decorative illustration
