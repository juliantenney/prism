# Fixture References — Sprint 67

## Primary golden fixture

| Field | Value |
| ----- | ----- |
| Path | `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` |
| Role | Primary validation fixture for model + HTML |
| Lesson | Heteroscedasticity self-study (A1–A5) |
| Why primary | Explicit authored episode plans, materials-by-id, numbered tasks with non-array material order, prompt fields, expected outputs, empty orientations |

## Supporting references

| Path | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/MODEL_REVIEW.md` | Expected A1/A5 model projections |
| `tests/learner-renderer-vnext-model.test.js` | Executable model + architecture assertions |
| Sprint 66 evidence log | Historical investigation pointers |

## Usage rules

1. Prefer this fixture for acceptance gates.  
2. Do not treat unrelated historical HTML exports as association proof.  
3. Additional fixtures may be added in Sprint 67 only to widen archetype coverage — document each in this file and the evidence log.  
4. When rules change, update model tests **before** HTML goldens.
