# Sprint 35 — evaluation fixtures

Sprint 35 does **not** duplicate fixture JSON in this folder by default. Authoritative regression fixtures live under `tests/fixtures/page-render/`.

Use this folder for **Sprint 35–specific probe briefs**, captured producer outputs, or observation-linked snapshots when a test fixture is not yet warranted.

---

## Primary regression fixtures (repo)

| Fixture | Path | Pedagogical surfaces exercised |
|---------|------|--------------------------------|
| **Confidence intervals (golden)** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Overview MathJax; key ideas block+inline math; A2 dual template tables; A4 scenario heading+table; formative numbered MCQ; expected output + support note |
| **Renderer kitchen sink** | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` | Material type diversity, assessment, framing, edge shapes |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` | Custom scenario headings, humanities rhetoric |
| **MathJax baseline** | `tests/fixtures/` (see `mathjax-delimiter-preservation.test.js`) | Delimiter preservation, prose block math |

---

## How to render for manual review

Same path as automated tests:

```text
loadPrismTestApi() → buildUtilityStructuredHtmlForTest(parsed, sectionOrder)
```

Reference: `tests/utility-page-render.test.js`, golden test `confidence-interval-a2-multitable-page.json`.

Inspect: heading hierarchy, multi-table spacing, scenario card, assessment prompt `<ol>`, output/support rhythm, print preview.

---

## Optional additions in this folder

When a slice needs a **pedagogy-only probe** that should not yet be CI-gated:

1. Add `brief-35-X-….json` or `notes-35-X-….md` here.
2. Link from `observations/35-X-….md`.
3. Promote to `tests/fixtures/page-render/` only when the shape is stable enough to regression-lock.
