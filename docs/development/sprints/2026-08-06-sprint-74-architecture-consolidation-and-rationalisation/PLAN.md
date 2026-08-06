# Sprint 74 — Plan

**Status:** **OPEN** (2026-08-06) — programme wrapper; Sprint 74A **OPEN**  
**Theme:** Architecture Consolidation and Rationalisation  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Binding constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, **`S74-D07`**)  
**Active implementation:** [Sprint 74A PLAN](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/PLAN.md)

Task IDs: `S74-T-###`. Decision IDs: `S74-D##` in [decisions.md](decisions.md).

Sprint 74A / 74B / 74C implementation work lives in **sub-sprint packs**. Do not schedule Domain A tasks under this wrapper.

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
| **74A** | Authoring → learner export path integrity (sole vNext; remove obsolete renderer) | **OPEN** — [pack](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md) (`S74-D06` / `S74A-D02` / `S74-D07`) |
| **74B** | Generation-contract & capture-validator hygiene | **Not opened** |
| **74C** | Repository & fixture hygiene | **Not opened** |

---

## Explicit non-scope (wrapper)

- Runtime implementation under this wrapper (use 74A pack)  
- Opening 74B / 74C without readiness  
- Altering accepted discovery findings  
