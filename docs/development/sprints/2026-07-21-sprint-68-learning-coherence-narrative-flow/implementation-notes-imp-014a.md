# S68-IMP-014A — classification_table and planning_table

## Summary

Registered `classification_table` and `planning_table` with the existing generic
markdown table material renderer and conditional `table_entry` workspace routing.

## Schema comparison

Both types use the same stored GAM shape as existing completion tables:

| Field | classification_table / planning_table | analysis_table / decision_table / comparison_table |
|-------|--------------------------------------|---------------------------------------------------|
| `material_id` | string | string |
| `material_type` | type discriminator | type discriminator |
| `title` | string | string |
| `body_format` | `"markdown"` | `"markdown"` |
| `body` | pipe markdown table (+ optional marker column) | pipe markdown table (+ optional marker column) |
| Columns | header row + `---` divider + data rows | same |
| Rows | `| cell | cell |` | same |
| Completion signal | blank cells in body markdown | blank cells in body markdown |
| Editable metadata | none in schema (inferred from blanks) | same |

They are **structural aliases** for rendering: the static table renderer and
table workspace parser consume them unchanged. Semantic role differs upstream
(classification vs planning vs analysis) but not at the vNext material layer.

## Static vs table_entry routing

| Type group | Do-moment routing rule |
|------------|------------------------|
| `analysis_table`, `decision_table`, `comparison_table` | Always `table_entry` (unchanged) |
| `classification_table`, `planning_table` | `table_entry` only when markdown table contains ≥1 blank cell; otherwise static |

Learn-moment tables always render statically regardless of type.

## Verification

```bash
node --test tests/learner-renderer-vnext-table-material-types-imp014a.test.js
node scripts/capture-imp-014a-rna-table-artefacts.js
node --test tests/learner-renderer-vnext*.test.js
```

## Remaining capability gap

RNA lesson sequencing/ordering requirements (if present in upstream activity
interaction metadata) are **not** implemented. This change only enables table
material rendering so the ordering gap can be inspected on a fully rendered page.
