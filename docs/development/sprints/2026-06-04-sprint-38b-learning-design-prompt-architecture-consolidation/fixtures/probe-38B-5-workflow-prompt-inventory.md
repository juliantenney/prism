# Probe 38B-5 — Workflow prompt inventory

Measured 2026-06-04 via `node scripts/probe-38b1-ld-workflow-prompt-audit.js` (self-directed brief).

---

## Inventory

| § | Step | canonical_step_id | Pack template | Pack notes | Seeded | Augmented (SD) | Blocks (SD) | Risk |
|---|------|-------------------|--------------:|-----------:|-------:|---------------:|------------:|------|
| 3 | Model Knowledge | step_model_knowledge | 1358 | 236 | 1293 | 1293 | 0 | LOW |
| 4 | Define Learning Outcomes | step_define_learning_outcomes | 1786 | 133 | 1569 | 1569 | 0 | LOW |
| 5 | Design Learning Activities | step_design_learning_activities | 3805 | 2703 | 3470 | **39201** | **14** | CRITICAL |
| 6 | Generate Activity Materials | step_generate_activity_materials | 4473 | 1675 | 4377 | **34482** | **15** | CRITICAL |
| 9 | Generate Assessment Items | step_generate_assessment_items | 6454 | 1073 | 6350 | **32308** | **11** | HIGH |
| 10 | Construct Learning Sequence | step_construct_learning_sequence | 4619 | 168 | 4462 | 4462 | 0 | LOW |
| 13 | Design Page | step_design_page | 9818 | 8476 | 9648 | **45791** | **15** | CRITICAL |

SD = self-directed brief (`delivery_context: self_directed`).

---

## Shared modules (from audit)

| Module | Steps |
|--------|-------|
| Self-directed rhetoric (9 blocks) | DLA, GAM, Assessment, Design Page |
| GAM table/reading/voice | GAM only |
| DLA material shape/framing/timeline | DLA only |
| Sprint 38 + materials fidelity | Design Page only |
| Math notation | DLA, GAM, Assessment, Design Page |

---

## Consolidation waves

- [x] Wave 1 — Design Page  
- [x] Wave 2 — GAM + DLA  
- [x] Wave 3 — Assessment Items  
- [x] Wave 4 — Sequence + foundation  

See [observations/38B-5-workflow-wide-review.md](../observations/38B-5-workflow-wide-review.md).
