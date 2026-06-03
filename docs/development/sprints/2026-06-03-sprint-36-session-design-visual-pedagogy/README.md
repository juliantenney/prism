# Sprint 36 — Session design and visual pedagogy refinement

**Pack path:** `docs/development/sprints/2026-06-03-sprint-36-session-design-visual-pedagogy/`  
**Status:** **COMPLETE** — slices 36-1–36-5; presentation CSS V31_7–V31_11  
**Date:** 2026-06-03  
**Test floor:** **589 pass / 0 fail**  
**Predecessor:** [Sprint 35 — pedagogical refinement](../2026-06-03-sprint-35-pedagogical-refinement/) (**COMPLETE**)

---

## Sprint overview

Sprint 36 reviews and improves PRISM **rendered learner pages** from the perspective of **session design**, **visual pedagogy**, **graphic communication**, **cognitive rhythm**, and **learner attention**.

This is **not** a generic “make it prettier” sprint. The programme asks whether a page **looks, paces, and scans** like an intentionally designed learning session — while keeping PRISM’s calm academic tone and stable HTML semantics.

Work proceeds through **observation-led review**, **presentation CSS refinements**, **renderer presentation semantics** (small, justified hooks only), and **imaging-opportunity guidance** — not through new workflow steps, schema fields, or decorative asset generation.

---

## Relationship to Sprint 34

Sprint 34 stabilised **renderer contracts** that Sprint 36 must preserve:

| Outcome | Relevance to Sprint 36 |
|---------|------------------------|
| `renderMaterialMarkdownBlock` consolidation | Table/template markdown paths stay predictable |
| Golden composed page fixture | Quantitative visual baseline |
| MathJax restore `kind: inline\|block` | Prose + equation hierarchy unchanged |
| `getUtilityPagePresentationCssV31_7()` | Typography/spacing layer to extend, not replace |

**Test floor:** `589 pass / 0 fail` (`node --test tests/*.test.js`).

---

## Relationship to Sprint 35

Sprint 35 made pages **instructionally intentional** (learner-action rhetoric, worked-example fading, embedded feedback, concept/procedure integration, metacognitive closure) **inside existing JSON shapes**.

Sprint 36 **does not reopen** that pedagogical copy programme. It asks whether the **same content** is **visually choreographed**: hierarchy, pacing, scan paths, density, and affordances for diagrams/charts/images where they would aid cognition.

---

## Relationship to deferred Sprint 32

[Sprint 32 — pedagogic diagram enhancement](../2026-06-02-sprint-32-pedagogic-diagram-enhancement/) remains **PLANNED / NOT STARTED**.

| Programme | Focus |
|-----------|--------|
| **Sprint 32** | Workflow-side visual artefact generation (figures, embed export, diagram steps) |
| **Sprint 36** | Session-design and visual-pedagogy review of **existing** rendered pages |

Do not use Sprint 36 as a back-door diagram workflow sprint. Imaging work here is **opportunity placement**, **inspection cues**, and **semantic visual grammar** — not new diagram orchestration unless explicitly re-chartered.

---

## Visual-design principles

1. **Hierarchy before decoration** — primary task and section rhythm must read before ornament.
2. **Scanability** — learners orient in under ~30s; no competing “loud” blocks per activity.
3. **Pacing** — cognitive rhythm across activities; density varies with purpose, not uniformly.
4. **Semantic visual grammar** — icons, borders, and cues signal pedagogical role (task, materials, cognition, assessment), not brand flair.
5. **Affordance, not filler** — tables, matrices, uncertainty bands, and policy trade-offs suggest *where* visuals help; do not generate decorative images.
6. **Calm academic tone** — whitespace, restrained colour, print-safe session handouts.
7. **Accessibility** — contrast, heading order, focus order, and text alternatives for visual-only meaning.
8. **Regression respect** — golden fixture, MathJax, assessment `<ol>`, and Sprint 35 copy contracts stay green.

---

## Architectural boundaries

| Allowed | Not allowed |
|---------|-------------|
| Observation notes and visual review rubric | New workflow steps |
| Targeted CSS in `getUtilityPagePresentationCssV31_*` (small deltas) | Schema / PEC expansion |
| Renderer class hooks for presentation semantics (minimal) | Adaptive visual systems |
| Imaging-opportunity guidance in prompts/docs | Major renderer restructuring |
| Probe snapshots in `fixtures/` (non-CI) | Decorative image generation for its own sake |
| Manual HTML review (climate, CI golden, Marx, kitchen sink) | Reopening Sprint 32 unless chartered |

---

## Success criteria

1. **0-fail test floor** maintained on every slice that touches code.
2. **Documented visual review** per slice in `observations/` using the Sprint 36 rubric.
3. **Measurable hierarchy/pacing/density gains** on evaluation anchors — not subjective “prettier.”
4. **No scope creep** into workflow, schema, Sprint 32, or tutoring/adaptive UI.
5. Stable contracts promoted to `tests/fixtures/page-render/` only when shapes are regression-ready.

---

## Proposed slices

| Slice | Title |
|-------|--------|
| **36-1** | Visual hierarchy and scanability review |
| **36-2** | Activity pacing and density choreography |
| **36-3** | Semantic visual grammar for pedagogical roles |
| **36-4** | Image/graph/diagram opportunity placement and inspection cues |
| **36-5** | Print/session polish and final visual review |

See [SPRINT-36-CHARTER.md](SPRINT-36-CHARTER.md) for governance detail.

---

## Suggested first slice (36-1)

> **Context:** Sprint 36 setup complete after Sprint 35.  
> **Task:** 36-1 — visual hierarchy and scanability review.  
> **Anchors:** climate-change generated page / HTML from latest probe, `confidence-interval-a2-multitable-page.json`, `marx-self-study-page.json`.  
> **Method:** Identify where learner attention is well directed and where hierarchy is too flat. Prefer observation notes first; CSS/presentation changes only if clearly justified.  
> **Non-goals:** workflow/schema expansion, Sprint 32 diagrams, decorative styling, major renderer restructuring.  
> **Success:** visual observation note plus proposed small presentation refinements; full suite remains 0 fail if code changes occur.

---

## Pack contents

| File / folder | Purpose |
|---------------|---------|
| [SPRINT-36-CHARTER.md](SPRINT-36-CHARTER.md) | Governance, lenses, slices, regression |
| [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) | Post–Sprint 35 snapshot + visual opportunities |
| [NOTES.md](NOTES.md) | Programme notes and slice log |
| [observations/](observations/) | Visual review notes per slice |
| [fixtures/](fixtures/) | Probe snapshots only (not duplicate CI fixtures) |

---

## Evaluation anchors

| Anchor | Path |
|--------|------|
| Confidence-interval golden page | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study page | `tests/fixtures/page-render/marx-self-study-page.json` |
| Renderer kitchen sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| Climate misconception discussion (fixture proxy) | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| Sprint 31 presentation rubric | `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` |
| Sprint 35 observations | `docs/development/sprints/2026-06-03-sprint-35-pedagogical-refinement/observations/` |
