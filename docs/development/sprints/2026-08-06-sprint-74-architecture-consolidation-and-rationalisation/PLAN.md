# Sprint 74 — Plan

**Status:** **OPEN** (2026-08-06) — programme wrapper; Sprint 74B **OPEN**  
**Theme:** Architecture Consolidation and Rationalisation  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Binding constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, **`S74-D07`**)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Active implementation:** [Sprint 74B PLAN](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/PLAN.md)  
**Closed predecessor:** [Sprint 74A PLAN](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/PLAN.md)

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
| **74A** | Authoring → learner export path integrity | **COMPLETE / Closed** — [pack](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md) |
| **74B** | Generation-contract & capture-validator hygiene | **OPEN** — [pack](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md) (`S74-D08` / `S74B-D01`) |
| **74C** | Repository & fixture hygiene | **Not opened** |

---

## Explicit non-scope (wrapper)

- Runtime implementation under this wrapper (use the 74B pack)  
- Opening 74C without readiness and operator approval  
- Altering accepted discovery findings  
