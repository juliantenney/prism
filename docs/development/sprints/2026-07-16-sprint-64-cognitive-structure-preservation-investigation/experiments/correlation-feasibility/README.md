# Correlation feasibility — Sprint 64 S64-BL-002b

Diagnostic-only survey of `required_materials` retention and `material_id` correlation.

| File | Role |
| ---- | ---- |
| `samples.json` | Sample inventory |
| `correlation-report.json` | Join rows + metrics |
| `unmatched-cases.json` | Non-1:1 / orphan rows |
| `run-analysis.js` | Regenerates the above |
| `_analysis-summary.json` | Full machine summary |

**Report:** [../../source-to-material-correlation-and-retention-feasibility.md](../../source-to-material-correlation-and-retention-feasibility.md)

Regenerate:

```bash
node run-analysis.js
```

Do not treat outputs as production behaviour changes.
