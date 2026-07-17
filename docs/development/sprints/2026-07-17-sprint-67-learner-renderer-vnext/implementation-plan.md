# Sprint 67 — Implementation Plan

## Order of work

1. **Model freeze** — confirm `MODEL_REVIEW.md` + A1/A5 tests remain the contract.  
2. **Render material** — map model materials to existing utility markup patterns (checklist criteria vs revision instruction already parsed).  
3. **Render beat** — heading from `learnerLabel`; instructions; prompts; materials; expected output inside materials region.  
4. **Render activity** — framing fields outside beat stream; then beats.  
5. **Render page** — orientation sections, activities in learning-sequence order, assessment, study tips.  
6. **Wire entry** — `renderLearnerPage(json, { rendererVersion })` (minimal production hook).  
7. **Tests** — golden + structural + architecture exclusions.  
8. **Human review** — fixture walk.  
9. **Rollout docs** — enablement criteria; default remains legacy.

## Coding constraints

* Render functions must not call assignment logic.  
* No imports from `ld-beat-assignment-compose` for emit.  
* Prefer existing CSS utility classes already used by learner export.  
* Do not hide incorrect structure with CSS.

## Suggested module additions

```text
lib/learner-renderer-vnext/
  render-page.js
  render-activity.js
  render-beat.js
  render-material.js
  render-html-utils.js   # escape / thin markdown helpers if needed
```

Exact filenames may vary; keep responsibilities separate.
