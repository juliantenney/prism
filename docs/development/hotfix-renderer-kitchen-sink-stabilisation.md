# Hotfix — renderer kitchen-sink stabilisation sweep

**Date:** 2026-05-21

## Scope

Renderer-only determinism pass using `tests/fixtures/page-render/renderer-kitchen-sink-page.json`. No DLA/GAM/workflow changes; no new renderer concepts or CSS redesign.

## Inconsistent paths fixed

| Area | Issue | Fix |
|------|--------|-----|
| **Template sections** | Multiline markdown tables in template `sections[]` strings were escaped into a single `<h5>` (literal pipe rows). | Split `###` heading from body; render body via `renderPlainStructuredText` / table block. |
| **Text-like materials** | `support_text` / `reading_text` objects rendered a stray `<h5>Body</h5>`. | Dedicated `text` / `reading_text` / `support_text` / `summary_text` object path → `util-card-subheading` + paragraph. |
| **Generic headings** | Redundant check only matched `util-card-subheading`. | Also match plain inner `<h5>` titles for suppression of `Text` / `Support Text` labels. |
| **Assessment items** | `explanation` leaked inline under `answer_grid_end` via detail text and `utilityRenderObject` extras. | Suppress inline feedback/explanation when `gridAtEnd`; skip `extraHtml` in that mode; keep fields consumed for answer grid. |
| **Bullet lists** | Template follow-up items kept embedded `1.` prefixes. | `utilityNormalizeEmbeddedListItemText` on all `renderBulletArray` bullet-line paths. |
| **Config scalars** | `answer_grid_end` in metadata/footer became `answer<em>grid</em>end` via markdown emphasis. | `utilityRenderPlainConfigScalar` for snake_case tokens when `humanizeEnumValues`; hide page-level presentation keys from body sections. |
| **Generic Body heading** | `body`/`content`/`value` keys still emitted `<h5>Body</h5>` under titled materials. | Suppress generic field headings when object already has a meaningful title. |

Existing normalisation (prior hotfixes) already covered: learning-purpose list markers, `renderPlainStructuredText` tables, comparison `--- -` separators, checklist heading-only lines.

## Fixture + tests

- Extended `renderer-kitchen-sink-page.json` (KS-A5 edge-case activity, knowledge-summary variants, answer-grid assessment, cognition fields, `feedback_display` under `constraints_applied`).
- Added 13 stabilisation assertions in `tests/utility-renderer-kitchen-sink.test.js` (including five second-pass regressions: template table split, ordered-list markers, answer-grid explanation suppression, Body heading suppression, plain config scalars).

## Remaining limits

- **Answer grid end** shows placeholders (`Q1 ___`) only, not rationales (by design for `answer_grid_end`).
- **checklist_array** non-canonical key still renders via generic material path (two small checkbox lists).
- **Pipe rows inside escaped HTML** in malformed inputs may still appear if content is not passed through structured-text/table parsers.
