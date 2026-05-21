# Sprint 29 index — Renderer cognition semantics

**Pack:** `docs/development/sprints/2026-05-21-sprint-29-renderer-cognition-semantics/`  
**Title:** Renderer cognition semantics (visual presentation evidence)  
**Date:** 2026-05-21  
**Status:** **Closed** (29-0–29-2)  
**Test floor:** **355** passing

---

## Framing

Sprint 28 closed the **structural** gap: cognition-bearing fields survive into composed `page` JSON.

Sprint 29 opens the **presentation** gap: `renderLearningActivitiesBlocks` in `app.js` renders `learner_task`, `materials`, and `expected_output` explicitly — **not** Sprint 28 cognition field IDs. Those strings appear as **flat markdown** inside generic `util-task-block` cards unless future renderer logic surfaces them.

**Layers:** E → O → G → C → **R** (this sprint)

---

## Pack contents

| Document | Purpose |
|----------|---------|
| [`sprint-29-charter.md`](sprint-29-charter.md) | Scope, principles, phases |
| [`investigation-plan.md`](investigation-plan.md) | 29-0 tasks and exit criteria |
| [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md) | Probe × dimension scoring |
| [`renderer-semantics-notes.md`](renderer-semantics-notes.md) | Semantic class → CSS opportunities |
| [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) | Renderer probe briefs |
| [`review-log.md`](review-log.md) | R29-001+ |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Slice status |
| [`HANDOVER.md`](HANDOVER.md) | Entry points |
| [`sprint-29-closure.md`](sprint-29-closure.md) | Programme closure (**R29-005**) |

---

## Hypotheses (R29)

| ID | Statement |
|----|-----------|
| **R29-H1** | Cognition-bearing activities remain **visually subordinate** to assessment blocks |
| **R29-H2** | Semantic differentiation may improve legibility **without** altering pedagogy |
| **R29-H3** | Current hierarchy **flattens** cognition fields into generic activity content |
| **R29-H4** | Lightweight semantic rendering may yield **disproportionate** orientation gains |
| **R29-H5** | `metadata.cognition_profile` is sufficient to gate renderer semantics without new ontology |

---

## Probe index (renderer)

| ID | Source page | Role |
|----|-------------|------|
| R29-P01 | P28-01 post-5d climate | Misconception + uncertainty fields |
| R29-P02 | P28-02 post-5d peer | Revision cycle fields |
| R29-P07 | P28-07 post-5d transcript | Transformation + misconception |
| R29-P08 | Lean retrieval / RNA sparse | Negative control — no cognition |
| R29-P09 | Kitchen sink fixture | Pattern baseline (no cognition classes) |

---

## Non-goals (29-0)

- No `app.js` renderer edits  
- No new workflows or factors  
- No illustration pipeline  
- No adaptive UI  

---

## Entry (closed programme)

Archive: [`sprint-29-closure.md`](sprint-29-closure.md) → [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md).
