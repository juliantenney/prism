# Probe 31-07 — Marx material rendering (Slice 31-4)

**Date:** 2026-06-01  
**Fixture:** `tests/fixtures/page-render/marx-self-study-page.json`  
**Rubric row:** 11 (tables and worked examples; no pipe soup)

## Observations

- Activity materials render inside `.util-activity-materials` > `.util-materials-stack`.
- Comparison prompts preserve list strings (`What is the purpose of each work?`, `Key Difference:`, etc.); no `--- - Key Difference` separator artefact.
- Parseable tables use `.util-table-scroll.util-material-table` where `utilityWrapExportTableHtml` applies.
- Checklist remains `.util-checklist-block` / `.util-checkbox-list` (no regression).
- Knowledge summary (31-3): `.util-knowledge-summary`, `.util-definition-list` unchanged in section scope.

## Pass criteria (row 11)

| Check | Result |
|-------|--------|
| No raw pipe paragraphs in material blocks | Pass |
| Tables in scroll wrapper when parsed | Pass |
| Wording unchanged | Pass |
