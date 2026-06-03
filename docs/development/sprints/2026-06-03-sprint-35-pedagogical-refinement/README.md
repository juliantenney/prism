# Sprint 35 — Pedagogical refinement

**Pack path:** `docs/development/sprints/2026-06-03-sprint-35-pedagogical-refinement/`  
**Status:** **SETUP** — documentation bootstrap only (no `app.js` changes yet)  
**Date:** 2026-06-03  
**Predecessor:** [Sprint 34 — refinement forward plan](../2026-06-03-sprint-34-refinement-forward-plan/) (**COMPLETE**)

---

## Sprint overview

Sprint 35 improves the **pedagogical quality** of generated learning experiences using structures PRISM already has: page sections, learning activities, materials, assessment items, cognition/PEL fields, and the consolidated renderer.

The programme asks: *does the output read as intentionally taught learning design*, not only as structurally valid JSON that renders without errors?

Work proceeds through **prompt shaping**, **rhetorical sequencing**, **material composition**, **instructional framing**, **renderer semantics**, and **activity ordering** — not through new orchestration layers or artefact types.

---

## Architectural boundaries

| Allowed | Not allowed |
|---------|-------------|
| Producer prompt blocks and step-runner copy | New workflow steps |
| Domain pack guidance (`domains/learning-design/…`) | Schema / PEC expansion |
| Material field usage and ordering within existing shapes | Adaptive branching systems |
| Renderer presentation semantics (copy boundaries, field routing) | AI tutoring loops |
| Activity rhetoric and assessment wording patterns | Sprint 32 diagram orchestration |
| Fixture-backed evaluation of composed pages | Major renderer restructuring |

**Workflow topology and renderer architecture are stable foundations** after Sprint 34 (consolidation, MathJax hardening, golden fixtures, V31_7 typography).

---

## Success criteria

1. **0-fail test floor** maintained (`node --test tests/*.test.js`).
2. **Measurable pedagogical gains** on realistic self-study fixtures (see [fixtures/README.md](fixtures/README.md)) — documented in `observations/` per slice.
3. **No scope creep** into workflow expansion, schema, or Sprint 32 diagram pipeline.
4. **Regression contracts preserved** — especially `confidence-interval-a2-multitable-page.json` and existing MathJax/table/assessment tests.
5. Each slice ships with **before/after observation notes** and explicit non-goals.

---

## Relationship to Sprint 34

Sprint 34 delivered **technical and presentational stability**:

| Slice | Outcome |
|-------|---------|
| 34-1 | Test floor restored (kitchen-sink CSS alignment) |
| 34-2 | Custom `materials.scenario` headings (`entry.heading`) |
| 34-3 | `renderMaterialMarkdownBlock` consolidation |
| 34-4 | Golden composed page fixture + MathJax restore `kind` fix |
| 34-5 | `getUtilityPagePresentationCssV31_7()` typography/spacing |

Sprint 35 **builds on** that stability: pedagogical refinement can be evaluated against fixed renderer contracts instead of chasing render bugs.

---

## Relationship to deferred Sprint 32

[Sprint 32 — pedagogic diagram enhancement](../2026-06-02-sprint-32-pedagogic-diagram-enhancement/) remains **PLANNED / NOT STARTED**.

- Sprint 32 = workflow-side **visual artefact** programme (figures, self-contained embed export).
- Sprint 35 = **instructional rhetoric and learning-process expression** inside existing page JSON.

Do not conflate the two programmes. Sprint 35 must not become a back-door diagram sprint.

---

## Pack contents

| File / folder | Purpose |
|---------------|---------|
| [SPRINT-35-CHARTER.md](SPRINT-35-CHARTER.md) | Governance, slices, evaluation strategy |
| [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) | Sprint 34 carry-forward + technical snapshot |
| [NOTES.md](NOTES.md) | Running programme notes |
| [observations/](observations/) | Slice reviews, statistics/Marx/RNA observation logs |
| [fixtures/](fixtures/) | Pointer to evaluation fixtures and rubrics |

---

## Suggested opening prompt (35-1)

> Context: Sprint 35 chartered; Sprint 34 complete (589 pass / 0 fail; golden fixture; V31_7 CSS). Task: Sprint 35-1 — instructional clarity and learner-action rhetoric on producer prompts and/or page copy patterns. Scope: prompt/domain copy and observation notes; renderer only if a tiny class hook is required. Non-goals: workflow steps, schema, Sprint 32 diagrams, renderer restructuring. Success: documented observation delta on confidence-interval + one RNA/Marx fixture; 0-fail suite.

---

## Linked artefacts

| Path | Use |
|------|-----|
| `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` | Primary quantitative self-study golden page |
| `tests/fixtures/page-render/marx-self-study-page.json` | Humanities self-study shape |
| `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/context-files/presentation-review-rubric.md` | Manual HTML review rubric (Marx/RNA/stats) |
| `docs/development/sprints/2026-06-03-sprint-34-refinement-forward-plan/` | Renderer/MathJax/fixture baseline |
