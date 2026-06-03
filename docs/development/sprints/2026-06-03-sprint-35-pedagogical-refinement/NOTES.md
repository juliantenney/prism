# Sprint 35 — programme notes

**Date:** 2026-06-03

---

## Founding note

PRISM should become better at expressing **intentionally taught pedagogy**, not merely structurally correct learning content.

Structural correctness (valid page JSON, renderable tables, preserved MathJax delimiters, assessment `<ol>` semantics) is necessary but not sufficient. Sprint 35 targets the gap between *valid* and *instructionally purposeful*.

---

## Stable foundations (post–Sprint 34)

Pedagogical refinement now has **stable renderer contracts** to build upon:

- Consolidated material markdown path (`renderMaterialMarkdownBlock`)
- Golden composed page: `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json`
- MathJax: inline `\(...\)`, block `\[...\]`; restore `kind: inline|block` fix for prose paragraphs
- Presentation CSS through `getUtilityPagePresentationCssV31_7()`
- **Test floor:** `589 pass / 0 fail` (`node --test tests/*.test.js`)

---

## Evaluation anchors

| Anchor | Location |
|--------|----------|
| Confidence-interval golden page | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Golden page test | `tests/utility-page-render.test.js` |
| Kitchen-sink material diversity | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| Presentation review rubric | `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` |
| Statistics / quantitative review observations | `observations/` (see [observations/README.md](observations/README.md)) |

---

## Slice log

| Slice | Status | Notes file |
|-------|--------|------------|
| 35-1 Instructional clarity & learner-action rhetoric | Complete | [observations/35-1-instructional-clarity.md](observations/35-1-instructional-clarity.md) |
| 35-2 Worked-example & faded-support patterns | Complete | [observations/35-2-worked-example-fading.md](observations/35-2-worked-example-fading.md) |
| 35-3 Embedded feedback & misconception interruption | Complete | [observations/35-3-feedback-misconception.md](observations/35-3-feedback-misconception.md) |
| 35-4 Concept/procedure integration cues | Complete | [observations/35-4-concept-procedure-integration.md](observations/35-4-concept-procedure-integration.md) |
| 35-5 Metacognitive closure & evaluative judgement prompts | Complete | [observations/35-5-metacognitive-judgement.md](observations/35-5-metacognitive-judgement.md) |

---

## Programme constraints (repeat)

- **No workflow expansion**
- **No schema expansion**
- **No Sprint 32 diagram work**
- **No adaptive branching / tutoring loops**
