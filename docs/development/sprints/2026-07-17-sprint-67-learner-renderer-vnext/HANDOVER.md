# Sprint 67 — Handover Pack

**Sprint:** 67 — Learner Renderer vNext  
**Pack date:** 2026-07-17  
**Predecessor close:** [Sprint 66 closure](../2026-07-16-sprint-66-grounded-renderer-learner-experience/SPRINT-66-CLOSURE.md)

---

## Why Sprint 67 exists

Sprint 66 grounded renderer work exposed that learner-facing beat structure was not a presentation problem alone:

| Problem | Effect |
| ------- | ------ |
| Dual planner architecture | Compose path vs registry diagnostics / residual synthetics disagree |
| Heuristic assignment | English scoring and soft fixture coupling; silent sink fallbacks |
| Empty beat emission | Empty orientation sections (e.g. A3/A4 Reflect wrappers) |
| Global label map | `orientation → Reflect` mislabels study-bearing orientations (A5) |
| Post-render insertion | Expected output / checklist consumption after HTML exists |

**Decision (S66-D10):** build a deterministic, model-driven **learner-renderer-vNext** instead of patching the legacy path.

---

## Current vNext status

### Completed (Sprint 66)

| Area | Location |
| ---- | -------- |
| Type definitions (JSDoc) | `lib/learner-renderer-vnext/types.js` |
| Learner role labels | `lib/learner-renderer-vnext/labels.js` |
| Declarative archetype rules | `lib/learner-renderer-vnext/archetype-rules.js` |
| Input + model validation | `validate-input.js`, `validate-model.js` |
| Page / activity / beat builders | `build-page-model.js`, `build-activity-model.js`, `build-beat-model.js` |
| Task + material parsing | `parse-learner-task.js`, `parse-material.js` |
| Model review write-up | `lib/learner-renderer-vnext/MODEL_REVIEW.md` |
| Architecture + model tests | `tests/learner-renderer-vnext-model.test.js` |
| Primary fixture | `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json` |

### Not completed (this sprint)

* HTML renderer modules  
* CSS integration (class reuse only)  
* Feature flag / entry selector  
* Legacy coexistence wiring  
* Golden HTML / parity validation  
* Migration / rollout execution  

---

## Architectural principles (agreed)

* Deterministic pipeline: JSON → validated page model → HTML  
* Single canonical page model; one render path  
* No heuristic beat scoring  
* No activity-specific mappings (`if (activityId === "A1")`)  
* No post-render content insertion  
* No material-consumption flag machines  
* Render from view model only  
* Empty beats omitted via `hasLearnerFacingContent`  
* Explicit ownership of task steps, prompts, materials, expected output  

Full context: [context/architectural-principles.md](context/architectural-principles.md) · [context/known-invariants.md](context/known-invariants.md)

---

## What not to reuse

| Legacy surface | Reason |
| -------------- | ------ |
| `lib/ld-beat-assignment-compose.js` scoring / sinks | Heuristic association |
| `resolveBeatMaterialPlan` for emit | Dual planner / synthetic beats |
| `orderedMaterialKeysRendered` / `checklistRendered` | Consumption flags |
| `insertExpectedOutputGuidanceBeforeChecklist` | Post-render insertion |
| Global `orientation: "Reflect"` as sole label rule | Role-blind labelling |

---

## Start here for implementation

1. Read [MODEL_REVIEW.md](../../../../lib/learner-renderer-vnext/MODEL_REVIEW.md)  
2. Confirm A1/A5 model expectations still match product intent  
3. Implement logic-free renderers that consume `LearnerPageModel` only  
4. Add golden HTML assertions from [acceptance-criteria.md](acceptance-criteria.md)  
5. Add feature flag last; default remains legacy  

---

## Immediate backlog item

**S67-BL-001** — Model freeze + HTML renderer skeleton (page → activity → beat → material).
