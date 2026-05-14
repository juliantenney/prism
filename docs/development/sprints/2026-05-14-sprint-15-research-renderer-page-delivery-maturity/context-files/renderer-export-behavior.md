# Utilities Page Export Renderer (Current Behavior)

This document captures the current behavior of the active Utilities HTML export path for page artifacts.

## Active Export Path

For `artifact_type = "page"`:

1. `handleUtilitiesGenerate()`
2. `resolveUtilityRenderPlan(...)`
3. `runUtilityRendererByPlan(...)`
4. `buildUtilityStructuredHtml(...)`
5. `utilityRenderPageSections(...)`
6. section helpers such as `renderLearningActivitiesBlocks(...)`, `renderQuestionBlocks(...)`, and nested material renderers
7. `sanitizeUtilityHtmlOutput(...)` final pass before returning HTML

`handleUtilitiesDownloadHtml()` only downloads `state.utilitiesLastHtml`; it does not re-render content.

## Material Rendering Rules (Current)

- Structured material content is rendered in cards/blocks where possible.
- Markdown-like headings (`##`, `###`) are converted to subheadings in material contexts.
- Bullet-like content is normalized into list output.
- Checkbox marker lines (`☐`, `☑`, `☒`, `[ ]`, `[x]`) are rendered as checkbox lists:
  - `<ul class="util-checkbox-list">...`
- Placeholder-only markers are suppressed in sanitizer when isolated:
  - `--`, `-`, `—`, `___`, `...`
- Markdown pipe tables with a valid divider row are rendered as HTML `<table>` blocks.

## Assessment Rendering Rules (Current)

- Assessment sections use `renderQuestionBlocks(...)`.
- `feedback_display` controls answer visibility modes (including end-of-section answer grid behavior).
- Literal token leaks such as bare `assessment_check` are sanitized/omitted.

## Sanitization Pass

`sanitizeUtilityHtmlOutput(...)` performs conservative post-render cleanup for residual artifacts:

- placeholder-only list items/paragraphs
- checkbox list normalization
- adjacent `<ul>` merge where safe
- selected heading-marker cleanup

This pass is intentionally narrow and should not alter valid assessment option labels (for example `A. ...`) or normal content structure.

## Regression Checklist

When changing renderer behavior, verify exported HTML for:

- no literal markdown heading markers (`##`/`###`)
- no placeholder-only artifacts (`--`, `___`, `...`)
- checkbox lists render without bullet markers
- markdown tables render as HTML tables
- empty sections are omitted
- assessment sections render item content (not token placeholders)

