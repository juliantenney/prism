# Key fixtures and tests (Sprint 31)

**Focus:** utility page renderer and presentation — not workflow generation.

---

## Page render fixtures

| Fixture | Path | Sprint 31 use |
|---------|------|----------------|
| Kitchen-sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` | Metadata fold, materials, MCQ, PEL cues |
| Production metadata shape | `tests/fixtures/page-render/shape-production-metadata.json` | `util-meta` fold only |
| Metadata + body shape | `tests/fixtures/page-render/shape-metadata-with-body.json` | Body vs meta separation |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` | Framing + materials |
| Marx design quality | `tests/fixtures/page-render/marx-self-study-design-quality-page.json` | Timeline / section order |
| RNA HCV assessment | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | Assessment section |
| Self-directed framing | `tests/fixtures/page-render/self-directed-activity-framing-page.json` | PEL cue order |
| Structured MCQ | `tests/fixtures/page-render/shape-structured-assessment-mcq.json` | Assessment presentation (31-6) |
| Markdown table | `tests/fixtures/page-render/shape-markdown-table.json` | Table polish (31-4) |
| Activity echo dedupe | `tests/fixtures/page-render/shape-activity-echo-dedupe.json` | Exact-match suppression (31-5) |
| Knowledge summary prose | `tests/fixtures/page-render/shape-knowledge-summary-prose.json` | Prose-only knowledge_summary (31-3) |
| Inflation workshop | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` | Facilitated regression guard |

**Live exports (Sprint 30):**  
`docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json`, `rna-page.json`

---

## Test files (run before/after each slice)

| File | Covers |
|------|--------|
| `tests/utility-renderer-kitchen-sink.test.js` | Synthetic renderer smoke + metadata fold |
| `tests/utility-page-render.test.js` | Page shapes, production metadata, tables, MCQ |
| `tests/utility-self-directed-activity-framing.test.js` | PEL orientation/reasoning cues |
| `tests/utility-renderer-cognition-fields.test.js` | Cognition chrome |
| `tests/utility-marx-page-render.test.js` | Marx HTML |
| `tests/utility-ld-rna-assessment-page-render.test.js` | RNA assessment order |
| `tests/utility-ld-inflation-page-render.test.js` | Workshop regression |
| `tests/utility-ld-assessment-visibility-render.test.js` | Assessment visibility |
| `tests/utility-ld-climate-misconception-page-render.test.js` | Facilitated page |

**PEL / workflow (regression only — do not extend for Sprint 31):**  
`tests/workflow-pel-reasoning.test.js`, `tests/workflow-self-directed-activity-framing-adoption.test.js`

---

## Commands

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
node --test tests/utility-renderer-kitchen-sink.test.js tests/utility-page-render.test.js
```

**Floor:** **497** pass — [`../baseline-test-floor.md`](../baseline-test-floor.md)
