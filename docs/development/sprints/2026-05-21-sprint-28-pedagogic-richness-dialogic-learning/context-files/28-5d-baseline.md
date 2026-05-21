# Sprint 28-5d baseline — cognition-aware composition parity

**Date:** 2026-05-21  
**Slice:** 28-5d (Theme E — composition preservation)  
**Test floor:** **350** (`node --test tests/*.test.js`)

---

## What shipped

`applyPedagogicCognitionSemanticsToComposedPage(page, options)` — bounded post-composition pass when cognition packs/factors are active:

1. **Section ID normalisation** — drifted headings (`section_2`, workshop labels) → canonical `section_id` (`learning_activities`, `assessment_check`, …).
2. **Activity section injection** — if upstream `learning_activities` exists but page lacks a section, inject `learning_activities` (anti-assessment-only collapse).
3. **Cognition field merge** — copy typed DLA cognition fields from upstream into composed activity rows when missing.
4. **Assessment deduplication** — remove MCQ-like rows duplicated in both `learning_activities` and `assessment_check` (P28-018).
5. **Section reorder** — `learning_activities` before `assessment_check` via `COGNITION_PAGE_CANONICAL_SECTION_ORDER`.
6. **Trace + metadata** — `generation_notes.cognition_composition`, `metadata.cognition_profile`.

**Semantics:** `resolvePedagogicCognitionCompositionSemantics` — `cognitionActivityPriority`, `preserveCognitionAdjacency`, `cognitionSectionRequired`.

**Wiring:** `applyPageCompositionValidationForUtilitiesPage` and captured-page validation call cognition apply then merge in-place via `assignComposedPageMutations`.

---

## Trace fields (`generation_notes.cognition_composition`)

| Field | Meaning |
|-------|---------|
| `cognitionSectionsPreserved` | Canonical section kinds present after pass |
| `cognitionCompositionParity` | Activity priority ordering active |
| `cognitionActivitySuppressed` | Duplicate assessment rows stripped from activities |
| `cognitionAssessmentDominancePrevented` | Injected missing `learning_activities` section |
| `cognitionFieldsMerged` | Count of upstream cognition fields copied |
| `duplicateAssessmentRowsRemoved` | Rows removed from activities |

---

## Tests

`tests/workflow-ld-cognition-composition.test.js` — 7 cases (peer, misconception, transcript, dedup, assessment+cognition, utilities path, lean RNA unchanged).

---

## Explicit non-goals (28-5d)

- No renderer redesign or new section render types
- No adaptive tutoring UI or learner-state engine
- No dynamic branching presentation layouts
- No visual pedagogy framework / illustration workflow
- No automatic rubric enforcement (28-5e)

---

## Recommended programme next step

**28-5e** — evaluation harness / rubric automation; then stabilise Sprint 28 before new themes.
