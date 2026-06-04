# Sprint 38 — fixtures folder

Sprint 38 does **not** duplicate stable regression fixtures. Authoritative composed-page contracts live under:

```text
tests/fixtures/page-render/
```

Use **this folder** for:

- **Generate vs reject** affordance examples (`visual_decision`, `rejection_reason`)  
- **Affordance audit probes** — shallow vs enriched brief excerpts  
- **VEU analyse JSON samples** (tier lists, rejected decorative)  
- **Enriched affordance examples** (YAML/JSON spec shapes for 38-4)  
- **Inflation validation notes** linked from 38-1  

---

## Primary evaluation fixtures (repo — do not copy)

| Fixture | Path | Visual affordance focus |
|---------|------|-------------------------|
| **Inflation workshop (full)** | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | CPI/deflator, scenarios, worksheets |
| **Inflation CSV worksheets** | `tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json` | Table pair hooks, comparison matrices |
| **Climate misconception** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Evidence structure, mechanism |
| **CI golden** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Interval overlap, level–width |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` | Comparison framework, causal chain |

---

## Sprint 38 probe files (this folder)

| File | Slice | Purpose |
|------|-------|---------|
| [probe-38-1-inflation-visual-affordance-audit.md](probe-38-1-inflation-visual-affordance-audit.md) | 38-1 | Audit worksheet for inflation + hook inventory |
| [probe-38-2-purpose-taxonomy-seed.md](probe-38-2-purpose-taxonomy-seed.md) | 38-2 | Activity → purpose seed matrix |
| [probe-38-4-enriched-affordance-example.yaml](probe-38-4-enriched-affordance-example.yaml) | 38-4 | North-star affordance shape (A2 CPI vs deflator) |
| [probe-38-5-visual-enhancement-consumer-checklist.md](probe-38-5-visual-enhancement-consumer-checklist.md) | 38-5 | VEU analyse/embed consumption checklist |

Optional additions during implementation:

| Pattern | Purpose |
|---------|---------|
| `probe-38-1-ci-hook-inventory.md` | CI paired-table slot + inferred opportunity |
| `probe-38-2-purpose-mapping-table.md` | Activity × purpose matrix |
| `probe-38-5-veu-analyse-output-sample.json` | Post–38-4 expected analyse JSON |

---

## Promotion rule

1. Capture affordance contracts and probe output here.  
2. Link from `observations/38-X-….md`.  
3. **Promote** to `tests/fixtures/` + targeted test only when affordance JSON shape is stable.  
4. Do **not** weaken Sprint 36 placement tests (`utility-visual-affordance-hooks.test.js`) for experimental metadata.  

---

## How to render for affordance review

```text
loadPrismTestApi() → buildUtilityStructuredHtmlForTest(parsed)
```

Inspect:

- Hidden `.util-visual-affordance` hooks (`data-visual-slot`, `data-visual-subject`)  
- Upstream page JSON for `visual_affordances` (post–38-4)  
- VEU step 1 output when running enhancement on export HTML  

Reference: `tests/utility-visual-affordance-hooks.test.js`, `docs/workflow/exports/visual-enhancement-utility-v1.1.1.json`.
