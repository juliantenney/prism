# Sprint 36 — fixtures folder

Sprint 36 does **not** duplicate stable regression fixtures. Authoritative composed-page contracts live under:

```text
tests/fixtures/page-render/
```

Use **this folder** only for:

- Visual review **snapshots** (short HTML excerpts, annotated screenshots described in markdown)
- **Probe pages** from live runs (climate data/models/decision-making, etc.) before CI promotion
- Slice-linked **brief notes** (`probe-36-X-….md`) that are not yet test-gated

---

## Primary evaluation fixtures (repo — do not copy)

| Fixture | Path | Visual surfaces |
|---------|------|-----------------|
| **Confidence intervals (golden)** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Multi-table template, scenario, MathJax, assessment `<ol>`, closure/debrief, study_tips |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` | Checklist → meaning pairs, comparison table, study_tips |
| **Renderer kitchen sink** | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` | Material diversity, assessment modes |
| **Climate misconception** | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` | Discussion prompts, task cards, formative check |

---

## Promotion rule

1. Capture probe output or visual contract notes here.
2. Link from `observations/36-X-….md`.
3. **Promote** to `tests/fixtures/page-render/` + `utility-page-render.test.js` (or sibling) only when the visual shape is **stable** and **regression-worthy**.

Do not weaken golden CI assertions to accommodate experimental layout.

---

## How to render for manual review

```text
loadPrismTestApi() → buildUtilityStructuredHtmlForTest(parsed, sectionOrder)
```

Reference: `tests/utility-page-render.test.js`.

Inspect: hierarchy, table wrappers, cognition regions, assessment spacing, print preview, climate vs quantitative vs humanities density.

---

## Optional additions

| File pattern | Purpose |
|--------------|---------|
| `probe-36-1-climate-render-notes.md` | Latest climate HTML review pointers |
| `snapshot-36-2-density-before.md` | Density map narrative before CSS |

Keep files small; large HTML belongs outside git or in local review only unless essential.
