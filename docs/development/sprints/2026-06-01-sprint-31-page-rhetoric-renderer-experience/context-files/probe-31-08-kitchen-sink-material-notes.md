# Probe 31-08 — Kitchen-sink material rendering (Slice 31-4)

**Date:** 2026-06-01  
**Fixture:** `tests/fixtures/page-render/renderer-kitchen-sink-page.json`  
**Rubric row:** 11 + regression 31-1–31-3

## Observations

- `.util-materials-stack` groups dense activity materials under stabilisation edge-case activity.
- Templates: `.util-template-block.util-material-template`; prompts: `.util-prompt-set.util-material-prompt`.
- Multiple markdown tables → `.util-table-scroll.util-material-table` (no pipe-in-`<p>` in edge section).
- 31-3 knowledge blocks: `.util-knowledge-summary`, `.util-definition-list` still present.
- Metadata fold: `About this page` (31-1) intact.

## RNA note (manual follow-up)

Long `reference_text` / table templates in RNA live artefact remain card-heavy; 31-4 adds stack/table tiers only — no prose rewrite (see `probe-31-04-rna-render-notes.md`).
