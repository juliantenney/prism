# Sprint 34-3 — Renderer consolidation (shared material markdown helper)

**Date:** 2026-06-03  
**Outcome:** `node --test tests/*.test.js` → **587 pass / 0 fail** (no HTML output changes intended)

## Helper added

`renderMaterialMarkdownBlock(rawText, opts)` in `app.js` (module scope, after `utilityRenderMarkdownBlock`):

1. Optional `structuredRender(raw, structuredOpts)` — e.g. `renderPlainStructuredText` with `materialHint: "table"`.
2. `utilityRenderMarkdownBlock(raw)` unless `blockBeforeStructured` (structured tried second).
3. `<p>` + `utilityRenderMarkdownInline` fallback unless `inlineFallback: false`.

## Call sites consolidated

| Site | Previous pattern | Notes |
|------|------------------|-------|
| `renderResourceMarkdownBlock` | block \|\| inline `<p>` | Linked activity resources |
| `renderCognitionFieldBodyForActivity` | block \|\| inline `<p>` | Cognition scalar bodies |
| Assessment `promptHtml` | block \|\| inline `<p>` | Formative prompt block |
| `renderMaterialValue` template string + table | structured \|\| block | `structuredFirst` (default) |
| `renderMaterialValue` scenario string + table | block \|\| structured | `blockBeforeStructured: true` |

## Deliberately left alone

| Path | Reason |
|------|--------|
| `renderPlainStructuredText` implementation | Worksheet mode, checkbox lists, `renderTableHintHeadingSections`, table blocks |
| `renderCardScopedMarkdown` | Card-scoped chunking + math protection |
| Default `renderMaterialValue` string branch | `structured \|\| renderCardScopedMarkdown` (no inline fallback) |
| `template.sections[]` section mapper | Per-section heading/table split logic |
| `renderScenarioBlocks` / task cards / prompt sets | Specialized card/list shapes |
| `utilityRenderMarkdownBlock` direct calls | Stages, timeline, linked journey prose, analysis_table shortcut |
| `renderMaterialValue` array `onlyStrings` map | Per-item `materialHint` on structured path |
| Mini-card `renderPlainStructuredText \|\| inline` | Nested object mini-cards |

Further consolidation should route through the helper only when the three-step precedence matches exactly.
