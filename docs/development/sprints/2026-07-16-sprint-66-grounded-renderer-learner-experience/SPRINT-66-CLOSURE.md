# Sprint 66 — Closure Report

**Sprint:** 66 — Grounded Renderer Learner Experience  
**Working title:** Current Inputs First  
**Opened:** 2026-07-16  
**Paused / closed for succession:** 2026-07-17  
**Status:** **Paused — investigation and model-boundary milestone complete; renderer rewrite deferred to Sprint 67**  
**Successor:** [Sprint 67 — Learner Renderer vNext](../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-START-HERE.md)

This document is the authoritative close for Sprint 66 active work. Do **not** continue renderer implementation inside Sprint 66.

---

## Outcome (summary)

| Item | Result |
| ---- | ------ |
| Renderer investigation | **Completed** |
| Architectural audit | **Completed** |
| Root-cause analysis | **Completed** |
| Decision: build learner-renderer-vNext | **Accepted** (S66-D10) |
| vNext model layer | **Completed** under `lib/learner-renderer-vnext/` |
| vNext HTML / CSS / feature flag | **Intentionally deferred** to Sprint 67 |
| Legacy production renderer | **Unchanged as default path** (investigation and heuristic experiments remain in tree; not rolled out as the long-term architecture) |
| Phase A–C LX optimisation as originally chartered | **Superseded** by rewrite decision |

---

## What Sprint 66 accomplished

1. **Renderer investigation** — Traced learner-facing beat emission against authored PRISM page JSON (episode plan, learner task, materials, prompts, expected output).
2. **Architectural audit** — Mapped every function involved in parsing tasks, reading episode plans, labelling beats, assigning steps/materials, emit gates, material consumption, expected-output insertion, and checklist rendering.
3. **Root-cause analysis** — Established that failures were structural (dual planners, heuristic scoring, unconditional empty-beat emission, global orientation→Reflect labelling), not CSS or fixture-only labelling errors.
4. **Architecture decision** — Stop extending the legacy heuristic composer; build an isolated deterministic **learner-renderer-vNext**.
5. **vNext model milestone** — Delivered types, declarative archetype rules, validation, page/activity/beat builders, model-review artefacts, and architecture exclusion tests. HTML rendering intentionally not started.

---

## Retrospective

### Key discoveries

* Live JSON already carries enough structure for coherent beats when association is explicit.
* The activity-local `episode_plan` is authoritative; top-level `episode_plans[]` must not be merged for render.
* Numbered `learner_task` order can differ from raw `materials[]` order (e.g. A2-M3 before A2-M2; A5-M8 before A5-M7).
* Empty episode-plan orientation rows must not emit empty `.util-beat-section` wrappers.
* Learner labels must follow resolved **role**, not a global `orientation → Reflect` map.

### Architectural risks identified

* **Dual planner** — compose path vs `resolveBeatMaterialPlan` diagnostics / residual registry synthetics.
* **Heuristic assignment** — English regex scoring and soft fixture coupling.
* **Post-render insertion** — expected-output / checklist consumption flags after HTML exists.
* **Silent fallbacks** — sink beats and first/last-index placement hide ambiguity.
* **In-place refactor hazard** — further patches to the legacy path increase brittleness without a canonical model.

### Why a dedicated rewrite sprint

Phase A “best LX with current renderer” could not be completed safely while the association algorithm itself was non-deterministic. A clean vNext boundary (JSON → validated view model → HTML) is required before presentation optimisation resumes.

### Deferred to Sprint 67

* HTML renderer (`render-page` / activity / beat / material)
* CSS integration (reuse existing utility classes; no layout hacks)
* Feature flag `rendererVersion: "legacy" | "vnext"`
* Legacy coexistence and parity validation
* Golden HTML fixture assertions against heteroscedasticity primary fixture
* Rollout and migration sequencing

### Deferred beyond Sprint 67 (draft Sprint 68)

* Legacy renderer retirement
* Heuristic composer / dual-planner removal
* Dead-code cleanup
* Long-horizon migration validation

---

## Repository disposition (at pause)

| Surface | Disposition |
| ------- | ----------- |
| `lib/learner-renderer-vnext/` | **Canonical model boundary** — keep; continue in Sprint 67 |
| `lib/ld-beat-assignment-compose.js` | Legacy experiment — do not extend as production architecture |
| `lib/beat-material-registry.js` | Legacy registry / diagnostics — unchanged default |
| Production default render path | Remains **legacy** until Sprint 67 feature-flag rollout |
| Sprint 66 docs | Closed / paused; successor is Sprint 67 |

---

## Backlog disposition

| ID | Final status |
| -- | ------------ |
| S66-BL-001 … S66-BL-003 | **Superseded** by investigation + rewrite decision (fresh-input discipline retained as process inheritance) |
| S66-BL-004 | **Stopped** — no further legacy Phase A implementation in Sprint 66 |
| S66-BL-005 … S66-BL-006 | **Deferred / reframed** under Sprint 67 north-star = deterministic model-driven render |
| S66-BL-007 | **Complete** as this closure + successor charter |

---

## Binding handoff

Continue in **Sprint 67** only. Do not implement HTML or feature flags under Sprint 66 numbering.

**START HERE:** [../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-START-HERE.md](../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-START-HERE.md)
