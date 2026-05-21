# Sprint 29 — investigation plan (29-0)

**Date:** 2026-05-21  
**Mode:** Evidence + framing only — **no renderer implementation**

---

## Objective

Establish whether **renderer-level semantic presentation** can improve learner orientation for cognition-bearing pages **already structurally sound** after Sprint 28 — before any CSS/HTML implementation.

---

## Preconditions

| Precondition | Evidence |
|--------------|----------|
| Sprint 28 closed | [`sprint-28-closure.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-closure.md) |
| Cognition fields in page JSON | Post-5d probes; composition tests |
| Test floor stable | **350** tests |

---

## Investigation tasks (29-0)

### A. Renderer code audit (read-only)

| Task | Owner | Output |
|------|-------|--------|
| Trace `renderLearningActivitiesBlocks` field allow-list | Agent/docs | Notes in `renderer-semantics-notes.md` §2 |
| Confirm cognition field IDs **not** first-class in render path | Agent/docs | R29-H3 evidence |
| Map assessment render path (`assessment_check`) visual weight | Agent/docs | Matrix column |
| Note existing tokens: `util-task-block`, `util-badge`, section icons | Agent/docs | Baseline inventory |

**Finding (seed):** Explicit row keys: `learner_task`, `expected_output`, `materials`, badges for duration/grouping. Cognition fields (`reasoning_revision_prompt`, etc.) are **not** enumerated — they may appear only if embedded in markdown strings or generic fallbacks.

### B. Evidence probes (documentary capture)

For each probe in [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md):

1. Source JSON (`page` from post-5d MD or fixture)  
2. Run `buildUtilityStructuredHtmlForTest` (manual or test harness) — **optional in 29-1**  
3. Document **current visual structure** (section order, card density, assessment prominence)  
4. List cognition fields present in JSON vs visible hierarchy in HTML  
5. Identify flattening and assessment dominance  

**29-0 deliverable:** Matrix rows with **documentary** scores (0–2), not live HTML screenshots required.

### C. Evidence matrix

Populate [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md):

- Dimensions D-R1–D-R10  
- Probes R29-P01, P02, P07, P08, P09  
- Before/after Sprint 28 column (structural) vs current renderer (visual)

### D. Semantic opportunity catalogue

[`renderer-semantics-notes.md`](renderer-semantics-notes.md) — map each cognition field → candidate class → layout pattern (callout, pair, ladder, cycle).

### E. Hypothesis adjudication (draft)

| ID | 29-0 working verdict |
|----|----------------------|
| R29-H1 | **Supported** (assessment blocks use dedicated section + item styling) |
| R29-H2 | **Open** — pending 29-1 HTML capture |
| R29-H3 | **Supported** (code audit) |
| R29-H4 | **Open** |
| R29-H5 | **Partial** — profile present post-5d; renderer does not read it yet |

### F. Programme governance

- Review log R29-001/002  
- Update repo `docs/development/current-state.md`  
- Confirm **350** tests unchanged  

---

## Exit criteria (29-0 complete)

| # | Criterion |
|---|-----------|
| 1 | Sprint pack files listed in charter exist and cross-link |
| 2 | Matrix has ≥5 probes × ≥8 dimensions |
| 3 | Semantic classes documented, not implemented |
| 4 | Explicit non-goals recorded |
| 5 | No `app.js` renderer diff in 29-0 commit scope |
| 6 | Handover states next slice (29-1 audit HTML) |

---

## Suggested follow-on slices

| Slice | Work |
|-------|------|
| **29-1** | HTML export captures + side-by-side screenshots; score matrix |
| **29-2** | CSS token + class spec; kitchen-sink cognition fixture |
| **29-3** | Implement `renderCognitionFieldsForActivity` (bounded); tests |

---

## Commands

```bash
node --test tests/*.test.js
```

Optional (29-1+):

```bash
node tests/utility-ld-assessment-visibility-render.test.js
node tests/utility-ld-inflation-page-render.test.js
```
