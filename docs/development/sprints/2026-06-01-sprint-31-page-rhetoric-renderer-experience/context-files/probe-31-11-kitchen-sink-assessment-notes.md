# Probe 31-11 — Kitchen-sink formative assessment (Slice 31-6)

**Date:** 2026-06-01  
**Fixture:** `tests/fixtures/page-render/renderer-kitchen-sink-page.json`  
**Rubric row:** 12 (MCQ/options readable; no checkbox confusion)

## Observations

- Formative section uses `.util-assessment-prompt` + `.util-assessment-choices` + `.util-assessment-options`.
- Items carry `.util-assessment-item--formative`.
- Answer-grid mode: inline `Correct answer:` hidden; `.util-assessment-key` present (unchanged semantics).
- MCQ and true/false items distinguish prompt from choices.

## Pass criteria

| Check | Result |
|-------|--------|
| Options not checkbox lists in assessment section | Pass |
| Question stems preserved | Pass |
| Answer-grid behaviour unchanged | Pass |
