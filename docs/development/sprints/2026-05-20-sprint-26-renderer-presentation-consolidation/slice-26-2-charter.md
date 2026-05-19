# Slice 26-2 — Global visual rhythm (spacing, hierarchy, density)

**Date:** 2026-05-20  
**Status:** **Complete**  
**Scope:** Presentation/CSS/HTML only — no composition or export authority changes

---

## Charter

| Item | Detail |
|------|--------|
| **Focus** | Renderer spacing, hierarchy, and density using kitchen sink (especially **KS-A3** density/print stress) |
| **Fixture** | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| **Design input** | [`renderer-kitchen-sink-fixture-design.md`](renderer-kitchen-sink-fixture-design.md) §5.2 |
| **Backlog** | B26-001–005 (P0), partial B26-010, B26-014, B26-023, B26-030 |
| **Code** | `getUtilityPagePresentationCssV26_2()`, `utilityWrapExportTableHtml()` in `app.js` |

---

## Issues identified (KS-A3 and cross-fixture)

| Area | Before | After (26-2) |
|------|--------|----------------|
| Section rhythm | Uneven `h2` → content gaps | `h2.util-section-heading` + `section` margin-bottom unified |
| Activity blocks | Heavy padding stacked with nested cards | `article.util-task-block` padding/margin tuned; activity header border separates title row |
| Material headings | `h4` crowded against grids/lists | Increased top margin; tighter gap to following pattern block |
| Nested cards | Grid min width tight; uneven bottom margins | `auto-fill` minmax(260px); last-child margin zeroed in stacks |
| Prompt/checklist | Dense line height | Prompt set + checkbox list line-height and `li` spacing |
| Tables | Full-width overflow on narrow/print | `.util-table-scroll` wrapper + print `overflow:visible` |
| Output vs support | Visually similar vertical stack | Distinct margins; support note separated after output block |
| Long text | Prompt lines could overflow container | `overflow-wrap:anywhere` on prompt list items |
| Print | Activities/cards could split awkwardly | `@media print` `break-inside:avoid-page` on task blocks, scenarios, prompt sets, card grid |

---

## Implementation

1. **`getUtilityPagePresentationCssV26_2()`** — Appended to inline `<style>` in both `buildUtilityStructuredHtml` and `buildUtilityLearningObjectHtml` so single-page export and LO mode share rhythm.
2. **`utilityWrapExportTableHtml()`** — Wraps column-row tables in `<div class="util-table-scroll">` (all three table emit paths).
3. **Tests** — Two smoke assertions in `tests/utility-renderer-kitchen-sink.test.js` (table wrapper + print CSS markers).

No changes to `utilityRenderPageSections` composition logic, `strictCompositionClosure`, or activity membership.

---

## Verification

```bash
node --test tests/*.test.js
```

| Check | Result |
|-------|--------|
| Full suite | **238 passed**, 0 failed |
| Kitchen sink | 9 tests (incl. 26-2 presentation) |
| Inflation render | Unchanged semantics; existing tests green |

---

## Out of scope (deferred)

- B26-051–055 (feedback variant fixture, TRACE logs, comparison_table key, icon differentiation, worksheet intro config)
- B26-022 badge contrast, B26-016 metadata print rule (26-4)
- LO shell chrome spacing parity beyond shared v26-2 CSS block (B26-034)

---

## Review references

See [`review-log.md`](review-log.md) — R26-012–R26-015.
