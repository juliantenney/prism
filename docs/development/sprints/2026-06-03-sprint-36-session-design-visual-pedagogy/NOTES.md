# Sprint 36 — programme notes

**Date:** 2026-06-03

---

## Founding note

PRISM should now move from **instructionally intentional pages** to **visually choreographed learning experiences**, while preserving its calm academic tone and stable semantics.

Structural and rhetorical quality (Sprints 34–35) remains the floor. Sprint 36 raises the ceiling for **session design**, **visual hierarchy**, **pacing**, **scanability**, and **purposeful visual cognition** — without cosmetic churn or architectural expansion.

---

## Stable foundations (post–Sprint 35)

| Foundation | Detail |
|------------|--------|
| Renderer contracts | Sprint 34 golden fixture, MathJax restore, `renderMaterialMarkdownBlock` |
| Presentation CSS | V31_7 … **V31_11** (pacing V31_8, roles V31_9, figures V31_10, print/narrow V31_11) |
| Pedagogical copy | Sprint 35 auto-applied blocks on self-directed flows |
| **Test floor** | `589 pass / 0 fail` (`node --test tests/*.test.js`) |

---

## Evaluation anchors

| Anchor | Location |
|--------|----------|
| Confidence-interval golden page | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study page | `tests/fixtures/page-render/marx-self-study-page.json` |
| Renderer kitchen sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| Climate misconception page | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| Presentation review rubric (Sprint 31) | `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` |
| Pedagogical observations (Sprint 35) | `docs/development/sprints/2026-06-03-sprint-35-pedagogical-refinement/observations/` |

---

## Slice log

| Slice | Status | Notes file |
|-------|--------|------------|
| 36-1 Visual hierarchy and scanability review | Complete | [observations/36-1-hierarchy-scanability-ci-marx-climate.md](observations/36-1-hierarchy-scanability-ci-marx-climate.md) |
| 36-2 Activity pacing and density choreography | Complete | [observations/36-2-pacing-density-choreography.md](observations/36-2-pacing-density-choreography.md) |
| 36-3 Semantic visual grammar for pedagogical roles | Complete | [observations/36-3-semantic-visual-grammar.md](observations/36-3-semantic-visual-grammar.md) |
| 36-4 Image/graph/diagram opportunity placement | Complete | [observations/36-4-imaging-placement-affordances.md](observations/36-4-imaging-placement-affordances.md) |
| 36-5 Print/session polish and final visual review | Complete | [observations/36-5-print-session-polish-final-review.md](observations/36-5-print-session-polish-final-review.md) |

**Sprint 36 slice set:** **Complete** (2026-06-03). Final test floor: **589 pass / 0 fail**.

---

## Programme constraints (repeat)

- **No workflow expansion**
- **No schema expansion**
- **No Sprint 32 diagram workflow** (unless explicitly re-chartered)
- **No adaptive visual systems**
- **No major renderer restructuring**
- **No decorative image generation for its own sake**
- **Preserve Sprint 34/35 regression contracts**
