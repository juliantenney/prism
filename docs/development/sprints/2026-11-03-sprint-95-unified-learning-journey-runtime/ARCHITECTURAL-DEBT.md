# Sprint 95 — Architectural debt

**Sprint:** 95 — Unified Learning Journey Runtime  
**Status:** **CLOSED — ACCEPTED** (debt retained for successors)

Ledger for findings during Sprint 95. Deferred items are **not** reopen triggers.

---

## Protected prior state

| Item | State |
| ---- | ----- |
| Sprint 91 | **COMPLETE / CLOSED** — Learning Journey first-class + multi-doc package |
| Sprint 92 | **COMPLETE / CLOSED** — Situated Task |
| Sprint 93 | **CLOSED — ACCEPTED** — Assessment Pack |
| Sprint 94 | **CLOSED — ACCEPTED** — Continuity commissioning contract |
| Sprint 95 | **CLOSED — ACCEPTED** — Unified LJ runtime + author publishing |

---

## Known exclusions / deferred

| ID | Finding | Status | Notes |
| -- | ------- | ------ | ----- |
| S95-AD-001 | Interactive V1 expansion / transfer beats | **Out of scope** | PB-FA-019 |
| S95-AD-002 | Multi-document LJ ZIP remains default until explicitly superseded | **Active baseline** | Unified shell additive (S95-D03/D06); multi-doc must keep working |
| S95-AD-003 | Manual C5 → C6 response retrieval | **Resolved for unified shell** | Explicit contract + live read-only refs; multi-doc path still manual |
| S95-AD-004 | Document-scoped assessment/guided-review/math listeners | **Largely resolved (M1/M4)** | Container-scoped install/dispose; standalone auto-boot retained |
| S95-AD-008 | Unified shell not yet the default Learning Journey download | **Deferred** | Author-facing Unified control shipped; default replacement needs explicit decision |
| S95-AD-009 | Non-AP constituents in unified shell lack full runtime dispose/init | **Resolved for known products (M4)** | unknown product_id still warned |
| S95-AD-010 | Live DUU / seven-component journey HTML not on disk | **Accepted via author store** | Live verification used browser store; not committed as HTML fixture |
| S95-AD-013 | Artefact produce/reference contract not persisted on LJ design page | **Open / acceptable** | Derived at assemble time from dependencies + constructed workspaces |
| S95-AD-014 | Real DUU unified-shell verification (nav, C5→C6) | **Resolved (author)** | Live UI download accepted under S95-D06 |
| S95-AD-011 | MathLive remount stability inside unified shell | **Open — compatibility debt** | Fallback path verified; full MathLive remount not claimed |
| S95-AD-012 | MathJax / MathLive assets not auto-bundled in unified ZIP | **Open — compatibility debt** | Include when a constituent requires them |
| S95-AD-015 | Component navigation overlapping scrolling content | **Deferred — presentation sprint** | |
| S95-AD-016 | Journey sidebar and Previous/Next visual refinement | **Deferred — presentation sprint** | |
| S95-AD-017 | Accessible collapsible journey TOC | **Deferred — presentation sprint** | |
| S95-AD-018 | Responsive layout and zoom behaviour | **Deferred — presentation sprint** | |
| S95-AD-019 | Context-sensitive C5/C6 instructions about manual artefact transfer | **Deferred — presentation sprint** | Multi-doc / instructional copy |
| S95-AD-020 | Further keyboard and screen-reader verification | **Deferred — presentation sprint** | Beyond automated landmarks + author smoke |
| S95-AD-005 | User-controlled themes | **Later** | Token readiness only this sprint |
| S95-AD-006 | Server-side learner accounts / LMS gradebook | **Out of scope** | |
| S95-AD-007 | Course Home / programme assembly | **Later** | PB-FA-016 |

---

## Explicitly out of sprint (at close)

AI marking of shared artefacts; new application frameworks; wholesale visual redesign beyond deferred presentation polish; regenerating *Deciding Under Uncertainty*; Learning Journey prompt-pipeline changes; reopening Sprint 94 commissioning prompts without demonstrated need.
