# Sprint 74 — Architecture Consolidation and Rationalisation

**Status:** **OPEN** (discovery)  
**Opened:** 2026-08-06  
**Type:** Discovery-led wrapper sprint (maturation phase)  
**Portable pack:** [docs/development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md)  
**Predecessor:** [sprint-73-closeout.md](sprint-73-closeout.md) — **COMPLETE / Closed**  
**Successor sub-sprints:** 74A / 74B / 74C **not opened**

## Theme

Understand the current supported Prism architecture and establish a sequence of evidence-based rationalisation sprints. Not indiscriminate code cleanup.

## Purpose

Discovery-led wrapper: map supported runtime path, ownership, schemas, bundles, and tests; classify compatibility/duplication; recommend coherent domains for later implementation sprints.

## Entry state

- Sprint 73 **complete** — Workflow Resources shipped.  
- Sprint 74 opened under [S74-D01](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md).  
- Discovery [S74-T-001](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md) **complete**.  
- Domain refinement [S74-T-010](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md) **complete** (`S74-D02`).

## Phase overview

| Phase | Focus | Status |
| ----- | ----- | ------ |
| 1 | Codebase rationalisation discovery | **Complete** (S74-T-001) |
| 2 | Domain sequencing / readiness | **Complete** (S74-T-010) |
| — | Sprint 74A / 74B / 74C implementation | **Not opened** (74A recommended; operator-gated) |

## Boundaries

No runtime changes in discovery/planning under the wrapper. No Sprint 73 reopen. Binding constraints: [ARCHITECTURAL-CONSTRAINTS.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`) — browser-only runtime; one supported path; `app.js` by ownership; static deployment. Related backlog (PB-FA-003, PB-S-004) informs domains but is not auto-consumed. Sprint 74A remains **unopened**.

## Authoritative docs

- [SPRINT-74-START-HERE.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md)  
- [SPRINT-74-CHARTER.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-CHARTER.md)  
- [ARCHITECTURAL-CONSTRAINTS.md](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
- [S74-T-001 discovery](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md)  
- [S74-T-010 refinement](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md)  
