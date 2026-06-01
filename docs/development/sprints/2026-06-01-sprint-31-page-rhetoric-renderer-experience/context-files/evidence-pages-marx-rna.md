# Evidence pages — Marx, RNA, quantitative (Sprint 31)

**Purpose:** Representative rendered-page profiles for manual review and fixture-backed tests.

---

## P31-01 — Marx self-study (humanities)

| Item | Location |
|------|----------|
| Live page JSON | [`../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json`](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json) |
| Live HTML capture | [`marx-render.html`](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-render.html) |
| Test fixture | `tests/fixtures/page-render/marx-self-study-page.json` |
| Render test | `tests/utility-marx-page-render.test.js` |

**Sprint 31 signals:** high PEL cue density; `source_artefacts` at page root; multi-activity coherence bridges; tables in materials.

**Re-render command (dev):** `buildUtilityStructuredHtmlForTest(marx-page.json)` via `__PRISM_TEST_API`.

---

## P31-02 — RNA / HCV self-study (STEM)

| Item | Location |
|------|----------|
| Live page JSON | [`rna-page.json`](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-page.json) |
| Live HTML capture | [`rna-render.html`](../../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-render.html) |
| Assessment fixture | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |
| Render test | `tests/utility-ld-rna-assessment-page-render.test.js` |

**Sprint 31 signals:** evidence/contrast reasoning cues; long GAM materials in cards; `source_artefacts` as array + `generation_notes` at root.

---

## P31-03 — Quantitative / statistical interpretation (placeholder)

**Status:** No dedicated repo fixture yet.

**Intent:** Third domain profile — methods vocabulary, numeric tables, hypothesis/significance framing.

**Interim coverage until capture:**

- `tests/fixtures/page-render/shape-markdown-table.json`
- `tests/fixtures/page-render/shape-structured-assessment-mcq.json`
- Kitchen-sink assessment/table sections

**When captured:** add `tests/fixtures/page-render/stats-significance-self-study-page.json` (name TBD) and `probe-31-03-stats-page-capture.md` in this folder.

---

## Synthetic anchor

| Item | Location |
|------|----------|
| Kitchen-sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| Tests | `tests/utility-renderer-kitchen-sink.test.js` |

Covers: `util-meta` fold, metadata section in `sections[]`, PEL KS-A6/A7, materials, MCQ.

---

## Before/after protocol (each slice)

1. Render live JSON → HTML (test API or Factory export).  
2. Score [`presentation-review-rubric.md`](presentation-review-rubric.md).  
3. Run full test suite — floor **471+**.  
4. Note deltas in `probe-31-0x-*.md` (create on first implementation run).
