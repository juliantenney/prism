# Probe 31-12 — RNA assessment section (Slice 31-6)

**Date:** 2026-06-01  
**Fixture:** `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json`  
**Rubric row:** 12

## Observations

- Ten `assessment_check` items render with new prompt/choices wrappers.
- Stems and option text unchanged; no `Correct answer:` in learner render (existing visibility).
- `.util-assessment-item--formative` on all items.
- No `util-checkbox-list` inside assessment section scope.

## Pass criteria

| Check | Result |
|-------|--------|
| 10 questions preserved | Pass |
| MCQ structure intact | Pass |
| Presentation calmer vs pre-31-6 | Pass (manual) |
