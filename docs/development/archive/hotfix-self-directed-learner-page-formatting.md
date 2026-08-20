# Hotfix — self-directed learner-page formatting and material sufficiency

**Date:** 2026-05-21

## Issues addressed

| Issue | Fix layer | Notes |
|-------|-----------|--------|
| Learning Purpose bullets with literal `- ` prefixes | **Renderer** | `utilityNormalizeEmbeddedListItemText` applied when building `<li>` in learning-purpose and markdown bullet lists |
| Undersized mapping/timeline tables | **Generation (GAM)** | Table row adequacy prompt block on self-directed learner-page GAM step |
| Ultra-short source readings | **Generation (GAM)** | Reading sufficiency prompt block; heuristic `evaluateSelfDirectedSourceReadingSufficiency` for tests |
| Generic headings (`Text`, `Support Text`, …) | **Renderer** (+ generation guidance) | Extended `utilityMaterialHeadingRedundantWithInner` generic set; GAM prompt asks for specific titles |
| Timeline source already chronological while task asks learners to sequence | **Generation (DLA + GAM)** | **Timeline sequencing alignment** prompt block; `required_materials.specification` should say unordered event list; interpretation tasks may keep chronological reference text |

## Tests

- `tests/workflow-self-directed-learner-page-formatting.test.js` (includes `evaluateTimelineSequencingMaterialAlignment` Marx-style cases)
- Existing `tests/utility-marx-page-render.test.js` (generic heading suppression fixture)

**Related:** [`hotfix-marx-self-study-design-quality-investigation.md`](hotfix-marx-self-study-design-quality-investigation.md) (Activity A1 ordering issue)

## Remaining risks

- **LLM compliance** — GAM may still emit thin readings or single-row tables despite prompts; no runtime blocking.
- **Table row inference** — `evaluateTableRowAdequacyForLearnerTask` is test/monitoring only; renderer does not pad rows automatically.
- **List normalisation** — only strips accidental embedded markers, not malformed nested markdown structures.
