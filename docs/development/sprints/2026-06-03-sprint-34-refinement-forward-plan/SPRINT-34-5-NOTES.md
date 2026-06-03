# Sprint 34-5 — Typography and spacing refinement

**Date:** 2026-06-03  
**Outcome:** `node --test tests/*.test.js` → **589 pass / 0 fail** (no new tests; presentation-only)

## Scope

CSS via new `getUtilityPagePresentationCssV31_7()` appended to `getUtilityPagePresentationCss()`. No HTML, workflow, schema, MathJax, or table-parsing changes.

## Visual decisions

### 1. Heading hierarchy

| Level | Treatment |
|-------|-----------|
| Page `h1` | Slightly tighter line-height (1.2), 1.8125rem size, 14px bottom margin |
| Section `h2.util-section-heading` | 1.1875rem, 36px top rhythm, 2px bottom rule for clearer band separation |
| Activity `h3` (in card header) | 1.075rem / 700 weight — reads as the task title inside the card |
| Material `h4.util-material-heading` | Uppercase micro-label (`.8125rem`, letter-spacing) — subordinate to activity title |
| In-card `h4/h5.util-card-subheading` | Sentence case, darker `#334155` — template/scenario interior titles |

### 2. Activity card rhythm

- Activity card padding increased slightly (`20px 22px`).
- Materials block: softer top rule (`#eef2f6`), 16px top padding.
- Primary learner task → expected output → support note: `18px` / `10px` vertical gaps so footer blocks read as one sequence.

### 3. Material stack (less double-border)

Inside `.util-activity-materials .util-materials-stack`:

- Template / scenario / prompt blocks: `box-shadow: none`, lighter fills.
- Table scroll wrapper: no outer border/background (table cells keep borders; avoids card-in-card frame).
- Stack gap `16px` for clearer separation without stacked shadows.

Left-accent colours from earlier slices remain; only weight and fill were toned down.

### 4. Multi-table template spacing

- First `.util-card-subheading` in a template: no extra top margin.
- Subheading → table: 4px top, 16px bottom margin on the table wrapper.
- Table → next subheading: 20px top margin (clear pause between template sections).

### 5. Print safety

- Explicit `break-inside: auto` on material tables inside activities so long tables are not forced into fragile avoid-page boxes.
- Card-level `break-inside: avoid-page` rules from V26_2 unchanged.
- Print still clears box-shadow on nested material blocks.

## Manual check

Render `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` via `buildUtilityStructuredHtmlForTest` (same path as `utility-page-render.test.js` golden test) and inspect export HTML in browser print preview.

## Regression surface

- `utility-renderer-kitchen-sink.test.js` — V31_5 pacing assertions unchanged (V31_7 does not override those selectors).
- `utility-page-render.test.js` — golden composed page (semantics/CSS class markers only).
- Full suite.
