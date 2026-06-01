# Presentation review rubric (Sprint 31)

**Use:** Manual review of Marx/RNA (and future stats) HTML after each slice.  
**Scale:** Pass / Partial / Fail per row.

---

## Calmness and density

| # | Criterion | Pass when |
|---|-----------|-----------|
| 1 | Page feels studyable, not overwhelming | Learner can orient in &lt;30s without scrolling entire page |
| 2 | Perceived density | No more than one “loud” cue block competing with task per activity |
| 3 | Whitespace rhythm | Sections and cards breathe; no wall of borders |

---

## Hierarchy

| # | Criterion | Pass when |
|---|-----------|-----------|
| 4 | Primary action obvious | “What to do” / task is visually dominant |
| 5 | Secondary cues subordinate | Orientation/reasoning cues scan as support, not headlines |
| 6 | Background demoted | Production metadata not in main reading flow |

---

## Metadata boundary (31-1 focus)

| # | Criterion | Pass when |
|---|-----------|-----------|
| 7 | No upstream keys in body | `source_artefacts`, raw generation keys not visible as H2 body sections |
| 8 | Meta fold appropriate | `details.util-meta` present when production metadata exists; collapsed by default |
| 9 | Learner vs developer tone | Meta fold labelled for traceability, not mistaken for lesson content |

---

## Consistency (later slices)

| # | Criterion | Pass when |
|---|-----------|-----------|
| 10 | Concepts | Knowledge summary / concept lists use one visual pattern |
| 11 | Materials | Tables and worked examples render cleanly (no raw pipe soup) |
| 12 | Assessment | MCQ/options readable; not checkbox-list confusion |

---

## Pedagogic preservation (non-negotiable)

| # | Criterion | Pass when |
|---|-----------|-----------|
| 13 | Sprint 30 value retained | Orientation/reasoning content still present in HTML when in JSON |
| 14 | No facilitator leakage | No facilitator choreography in learner self-directed render |

---

## Record template

```markdown
## Review — [slice] — [page] — [date]

| # | Score | Notes |
|---|-------|-------|
| 1 | | |
...

**Overall:** Pass / Blocked
**Tester:**
```
