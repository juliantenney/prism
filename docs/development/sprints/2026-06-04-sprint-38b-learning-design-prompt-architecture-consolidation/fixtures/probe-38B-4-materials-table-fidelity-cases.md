# Probe 38B-4 — Materials and table fidelity cases

Populate [observations/38B-4-materials-and-table-fidelity.md](../observations/38B-4-materials-and-table-fidelity.md).

---

## Case matrix

| Case ID | Anchor | Activity | Field | Bad shape | Good shape | Upstream reference | Status |
|---------|--------|----------|-------|-----------|------------|-------------------|--------|
| B4-01 | Inflation | A2/A3/A4 | `comparison_table` / `analysis_table` / `impact_table` | `Scenario 1,,,` comma rows | Pipe markdown in named field | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | **OPEN** |
| B4-02 | Inflation | Policy mechanism table | table | `Headers` / `Rows` prose blocks | Single `materials.<table_key>` pipe string | Live Inflation rerun | **OPEN** |
| B4-03 | Inflation | A3 | `scenario` + `analysis_table` | Table CSV; scenarios OK | Scenario markdown + pipe `analysis_table` | Fixture + rerun | **PARTIAL** |
| B4-04 | CI | A2 | multi-table | _TBD_ | `confidence-interval-a2-multitable-page.json` | Fixture | PENDING |
| B4-05 | — | any | placeholder | "Set of scenarios" only | Full scenario text | `lib/design-page-materials-fidelity.js` | **MITIGATED** |
| B4-06 | — | any | table label | "Calculation table" only | Pipe table body | materials fidelity tests | **MITIGATED** |

---

## Bad pattern signatures (for future tests)

```text
/^[^\n|]+,,,\s*$/m          # comma-row line (e.g. Scenario 1,,,)
/^Headers\s*$/m             # prose header block (bad decomposition)
/^Rows\s*$/m                # prose row block
```

## Good pattern signatures

```text
/\|[^\n]+\|\n\|[-:\s|]+\|/  # markdown table header + separator
materials\.(analysis_table|comparison_table|impact_table|classification_table|template)
```

---

## Evidence attachments

| Run | Date | File path / note |
|-----|------|------------------|
| Inflation Design Page rerun | 2026-06-03+ | Comma-row / Headers-Rows in learner `materials` (user validation) |
| Upstream reference | 2026-06-04 | `ld-inflation-workshop-page-full.json` activity_materials pipes |
| Placeholder regression | 2026-06-03 | Partial fix — materials fidelity runtime block |

---

## Questions per case

1. Is bad shape present in **raw LLM JSON** or introduced post-compose? → **Audit: likely LLM** (renderer can display CSV if present).  
2. Does upstream `activity_materials` already have correct pipes? → **Yes in fixture**.  
3. Which prompt block last mentions tables before model stops? → Pack + materials fidelity; **no anti-CSV rule**.  
4. Is `materials: []` on activities while tables live elsewhere? → **Check live export** (pending).
