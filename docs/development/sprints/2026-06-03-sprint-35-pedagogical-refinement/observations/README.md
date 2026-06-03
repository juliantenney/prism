# Sprint 35 — observations

Store **slice-level pedagogical review notes** here: before/after comparisons, manual HTML review outcomes, and producer-output probes.

Do not commit large generated artefacts unless necessary; prefer short markdown captures with fixture IDs and dates.

---

## Statistics and quantitative self-study review

Sprint 35 evaluation for **statistics / RNA-style quantitative pages** should reference:

| Source | Path | Use |
|--------|------|-----|
| **Golden composed page (CI / intervals)** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | End-to-end renderer + pedagogy probe (multi-table template, scenario table, formative MCQ, MathJax) |
| **Page render regression** | `tests/utility-page-render.test.js` | Automated contract for composed-page shapes |
| **Markdown / live LD shapes** | `tests/utility-markdown-bullet.test.js` | A2 template strings, A4 scenario, assessment prompt lists |
| **Presentation rubric** | `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` | Manual Pass/Partial/Fail review (applies to “future stats” pages) |

Add slice observations under this folder, e.g.:

- `35-1-confidence-interval-clarity.md`
- `35-3-statistics-assessment-feedback-rhetoric.md`

---

## Other domain anchors

| Domain | Fixture / probe | Notes |
|--------|-----------------|-------|
| RNA transcript self-study | `docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/probe-brief-rna-transcript-self-study.md` | Brief + orientation patterns |
| Marx self-study page | `tests/fixtures/page-render/marx-self-study-page.json` | Scenario heading, materials density |
| Assessment feedback semantics | `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/` | Formative wording boundaries |
| Manual validation log | `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/manual-validation-observation-log.md` | Cross-sprint manual findings |

---

## Observation template (copy per slice)

```markdown
# Slice 35-X — [title]

**Date:** YYYY-MM-DD  
**Fixtures:** [list]  
**Change type:** prompt | domain copy | renderer semantics | ordering

## Before
- …

## After
- …

## Rubric scores (if manual)
| Criterion | Score |
|-----------|-------|

## Regression
- `node --test tests/*.test.js` → pass / fail count
```
