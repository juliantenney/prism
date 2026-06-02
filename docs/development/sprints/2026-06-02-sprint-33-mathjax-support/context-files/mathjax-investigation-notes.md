# MathJax Investigation Notes

## Relevant Functions
- `utilityRenderMarkdownInline()`
- `utilityRenderMarkdownBlock()`
- `utilityRenderPrimitive()`
- `utilityRenderExportFieldValue()`
- `buildUtilityStructuredHtml()`
- `applyUtilityPreviewHtml()`
- `handleUtilitiesGenerate()`

## Findings
- Current markdown/render path does not typeset TeX.
- Delimiter handling is preservation-sensitive in normalization flow.
- Preview/export currently lack MathJax lifecycle parity hooks.

## Likely Integration Points
- Post-render typeset hook in preview path.
- Export HTML wrapper with matching MathJax config and lifecycle.
