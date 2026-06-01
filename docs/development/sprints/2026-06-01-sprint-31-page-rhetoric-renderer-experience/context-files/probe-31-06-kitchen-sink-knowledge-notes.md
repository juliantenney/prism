# Probe 31-06 — Kitchen-sink knowledge shapes (slice 31-3)

**Date:** 2026-06-01  
**Source:** `tests/fixtures/page-render/renderer-kitchen-sink-page.json`

## Shapes verified

| Section | Shape | Wrapper |
|---------|-------|---------|
| Key ideas (object) | `concepts[]` + `relationships` | `.util-knowledge-summary` |
| Key ideas (array) | `knowledge_summary_array` | `.util-knowledge-summary` (via extended section id match) |

## Rubric row 10

**Pass** — object and array knowledge sections share concept-group / definition-list rhythm.
