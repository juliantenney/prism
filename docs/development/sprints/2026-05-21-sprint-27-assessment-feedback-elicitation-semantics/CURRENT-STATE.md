# Sprint 27 — current state

**Date:** 2026-05-21  
**Pack path:** `docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/`  
**Status:** **Implementation complete** (27-4a–4f)

**Handover:** [`HANDOVER.md`](HANDOVER.md)  
**Implementation charter:** [`slice-27-4-charter.md`](slice-27-4-charter.md)

---

## At a glance

| Item | State |
|------|--------|
| **Investigation (27-1–27-3)** | **Complete** |
| **27-4 implementation** | **Complete** (27-4a–4f) |
| **Tests** | **284 passing** |
| **Runtime** | Semantic path **E → O → G → C → R** in `app.js` + LD pack prompts |

---

## Slice status

| Slice | Status |
|-------|--------|
| 27-1 Evidence matrix | Complete |
| 27-2 Elicitation audit | Complete |
| 27-3 Workflow probes | Complete |
| 27-4 Charter | Complete |
| **27-4a** Elicitation & extract | **Complete** |
| **27-4b** Topology | **Complete** |
| **27-4c** Generation prompts | **Complete** |
| **27-4d** Composition metadata | **Complete** |
| **27-4e** Renderer policy | **Complete** |
| **27-4f** Regression + docs | **Complete** |
| 27-4g Design Assessment (optional) | **Deferred** |

---

## Semantic path (delivered)

1. **E:** Factors + negation-safe extract + `deriveAssessmentSemanticFactors`.  
2. **O:** Design Feedback injection; DLA → GAM → GAI ordering.  
3. **G:** Pack prompts preserve answer keys; mode-specific instructions.  
4. **C:** Visibility/timing → `include_answers` / `feedback_display` on composed pages.  
5. **R:** `none`, `reflection_then_answers`, `answer_grid_end` render modes.

---

## Test coverage

| Track | Test file |
|-------|-----------|
| 27-4a | `tests/workflow-ld-assessment-semantics-extract.test.js` |
| 27-4b | `tests/workflow-ld-assessment-semantics-topology.test.js` |
| 27-4d/4e | `tests/utility-ld-assessment-visibility-render.test.js` |
| 27-4f | `tests/workflow-ld-assessment-semantics-e2e.test.js` |

**Command:** `node --test tests/*.test.js` → **284 passed**.

---

## Resume / optional backlog

1. Optional live Factory runs for P27-02/03 G-layer artefact capture (see probe catalogue).  
2. **27-4g** Design Assessment when `diagnostic_misconception` + item count — not started.  
3. Confidence/CARS semantics — explicitly deferred (R27-040).
