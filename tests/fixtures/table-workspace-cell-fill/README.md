# Table workspace editable cell fill

Deterministic layout probe for editable cells that must stretch with wrapped-row height.

## Generate

```bash
node tests/fixtures/table-workspace-cell-fill/build-layout-probe.js
```

## Verify in a browser

Open `layout-probe.html` and check `window.__cellFillMetrics` (or `#metrics`).

Expected for every body row:

- `insetDelta` ≈ `4` (2px cell padding top + bottom)
- `ok: true` (`|cellH - inputH - 4| ≤ 2.5`)

One-line rows stay compact; wrapped label rows deepen and the control height tracks the cell.
