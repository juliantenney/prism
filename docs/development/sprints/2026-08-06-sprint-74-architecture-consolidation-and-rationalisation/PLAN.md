# Sprint 74 — Plan

**Status:** **OPEN** (2026-08-06) — programme wrapper; **replanning after 74B**  
**Theme:** Architecture Consolidation and Rationalisation  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Binding constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, **`S74-D07`**)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Post-74B review:** [S74-programme-post-74B-review.md](S74-programme-post-74B-review.md)  
**Closed:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/PLAN.md) · [Sprint 74B](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/PLAN.md)

Task IDs: `S74-T-###`. Decision IDs: `S74-D##` in [decisions.md](decisions.md).

Sprint 74A / 74B / 74C implementation work lives in **sub-sprint packs**. Do not schedule Domain A/B/C tasks under this wrapper.

---

## Phase 1 — Codebase rationalisation discovery

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S74-T-001 | Codebase Rationalisation Discovery | **Done** | [S74-T-001](S74-T-001-codebase-rationalisation-discovery.md) |

---

## Phase 2 — Domain sequencing

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S74-T-010 | Prioritise and refine recommended domains | **Done** | [S74-T-010](S74-T-010-rationalisation-domain-refinement.md) · `S74-D02` |
| S74-T-011 | Optional thinner AC seed before 74A | **Superseded** | Domain A AC carried into Sprint 74A charter; not required |

---

## Implementation sub-sprints

| Sprint | Theme | Status |
| ------ | ----- | ------ |
| **74A** | Authoring → learner export path integrity | **COMPLETE / Closed** |
| **74B** | Generation-contract & capture-validator hygiene | **COMPLETE / Closed** |
| **74C** | Repository & fixture hygiene (original Domain C) | **Not opened** — **do not proceed unchanged** ([post-74B review](S74-programme-post-74B-review.md)) |

---

## Post-74B posture

Supported page-path ownership is consolidated (74A + 74B). Original Domain C mixes ready scratch hygiene with **not-sprint-ready** PB-S-001 fixture work. Programme must be **replanned** before any next pack: narrowed hygiene (R1), pause/close architectural programme (R2), or PB-S-001 investigation first (R3).

---

## Explicit non-scope (wrapper)

- Runtime implementation under this wrapper  
- Opening 74C without revised boundary + operator approval  
- Creating a 74C pack from this plan alone  
- Altering accepted discovery findings without a supersession note  
