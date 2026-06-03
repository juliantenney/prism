# Sprint 36 charter — Session design and visual pedagogy refinement

**Pack path:** `docs/development/sprints/2026-06-03-sprint-36-session-design-visual-pedagogy/`  
**Status:** **COMPLETE** — all slices 36-1–36-5 delivered; see `NOTES.md`  
**Date:** 2026-06-03  
**Test floor:** **589 pass / 0 fail**

---

## 1. Rationale

Sprints 34–35 established **stable renderer contracts** and **instructionally intentional copy** on self-directed learner pages.

Learners can still encounter pages that are **correct and well worded** but **visually flat**: uniform activity cards, table-heavy materials, under-signalled cognition blocks, weak section rhythm, and missed moments where a diagram, chart, or matrix would reduce cognitive load.

Sprint 36 addresses **session design and visual pedagogy** — how attention, pacing, and graphic structure support learning — **without** expanding workflow topology or reopening the Sprint 32 diagram programme.

---

## 2. Core question

> Does the page look, pace, and scan like an intentionally designed learning session?

Not: “Is it prettier?”  
But: “Can a learner orient, prioritise, and progress through the session with appropriate visual and temporal choreography?”

---

## 3. Design lenses

Reviews should rotate these perspectives (one lead lens per slice is fine):

| Lens | Asks |
|------|------|
| **Learning designer** | Does activity sequence and section order support the learning arc? |
| **Session designer** | Does time-on-task, breaks, and closure feel paced for a single study sitting? |
| **Graphic designer** | Is typographic hierarchy, alignment, and visual weight intentional? |
| **Cognitive load reviewer** | Are tables, lists, and cues chunked so extraneous load stays low? |
| **Accessibility reviewer** | Headings, contrast, focus, and non-text alternatives sufficient? |

---

## 4. In scope

- Manual visual review using Sprint 36 rubric (`observations/README.md`)
- Observation-backed before/after notes on evaluation anchors
- Small, justified **presentation CSS** deltas (V31_* layer or successor)
- Minimal **renderer presentation semantics** (class hooks, role labels) when hierarchy cannot be achieved by CSS alone
- **Imaging-opportunity guidance** — where charts, matrices, uncertainty visuals, or diagrams would help (copy/docs; not Sprint 32 workflow)
- Prompt/domain notes that encourage **visual choreography** in existing fields (e.g. when to use a matrix vs prose) — wording only
- Tests only when a visual contract is stable enough to regression-lock

---

## 5. Out of scope

| Item | Reason |
|------|--------|
| New workflow steps | Charter constraint |
| Schema / PEC expansion | Charter constraint |
| Adaptive visual systems | Charter constraint |
| Major renderer restructuring | Sprint 34 consolidation |
| Decorative image generation | Not instructional |
| Sprint 32 diagram orchestration | Deferred programme |
| Generic beautification (fonts, gradients, hero imagery) | Not session design |
| MathJax policy changes | Sprint 33 closed |
| Re-litigating Sprint 35 pedagogical copy | Separate completed programme |
| AI tutoring / dialogue UI | Not visual pedagogy |

---

## 6. Proposed slices

| Slice | Title | Primary deliverable |
|-------|-------|---------------------|
| **36-1** | Visual hierarchy and scanability review | Observation on CI golden, Marx, climate HTML; hierarchy flat-spots |
| **36-2** | Activity pacing and density choreography | Density map; spacing/rhythm CSS or class tweaks |
| **36-3** | Semantic visual grammar for pedagogical roles | Icon/border/label semantics for task, materials, cognition, assessment |
| **36-4** | Image/graph/diagram opportunity placement | Inspection cues; opportunity list (no Sprint 32 pipeline) |
| **36-5** | Print/session polish and final visual review | Print CSS, session handout review, charter close-out |

Each slice should end with:

1. Observation markdown in `observations/`
2. `node --test tests/*.test.js` → 0 fail (if code touched)
3. Explicit rejected scope creep

**Preferred order:** observation first; code second only when justified.

---

## 7. Regression expectations

**Mandatory when code changes:**

```bash
node --test tests/*.test.js
```

**Targeted suites:**

| Suite | Why |
|-------|-----|
| `tests/utility-page-render.test.js` | Golden composed page + material shapes |
| `tests/utility-markdown-bullet.test.js` | List/table markdown paths |
| `tests/mathjax-delimiter-preservation.test.js` | Equation presentation unchanged |
| `tests/utility-marx-page-render.test.js` | Humanities layout |
| `tests/utility-ld-climate-misconception-page-render.test.js` | Climate fixture fidelity |

**Contracts to preserve:**

- `confidence-interval-a2-multitable-page.json` golden assertions
- Sprint 35 pedagogical fields rendered in expected regions (task, materials, output, support, cognition)
- No facilitator leakage in learner self-directed render

---

## 8. Manual review method

1. Render fixture: `buildUtilityStructuredHtmlForTest` (see `tests/utility-page-render.test.js`).
2. Open HTML in browser; optional print preview.
3. Score rubric categories in `observations/README.md` (Pass / Partial / Fail).
4. Capture **before** screenshot or HTML snippet reference; record **after** when CSS changes land.
5. Cross-check Sprint 31 presentation rubric for overlap; Sprint 36 rubric adds pacing, density, visual affordance, print/session.
6. File `observations/36-X-….md` with proposed changes sized as **small** (one concern per PR where possible).

---

## 9. Evaluation anchors

| Anchor | Use |
|--------|-----|
| `confidence-interval-a2-multitable-page.json` | Quantitative multi-table, MathJax, assessment, Sprint 35 closure |
| `marx-self-study-page.json` | Humanities density, checklist, comparison table |
| `renderer-kitchen-sink-page.json` | Material-type diversity |
| `ld-climate-misconception-discussion-page.json` | Rich facilitated/discussion materials shape |
| Climate probe HTML (latest) | Strong generated page: data/models/decision-making rhetoric |
| Sprint 31 `presentation-review-rubric.md` | Baseline calmness/hierarchy |
| Sprint 35 `observations/` | Pedagogical intent to preserve while adjusting visuals |

---

## 10. Success definition (programme)

Sprint 36 succeeds when evaluation anchors show **clearer hierarchy**, **better scanability**, **purposeful pacing**, and **documented visual affordances** — with **589 pass / 0 fail** and **no charter violations**.
