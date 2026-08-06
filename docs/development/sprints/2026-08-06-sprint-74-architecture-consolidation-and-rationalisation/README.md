# Sprint 74 — Architecture Consolidation and Rationalisation

**Status:** **OPEN** (discovery)  
**Opened:** 2026-08-06  
**Predecessor:** Sprint 73 — **COMPLETE / Closed** (do not reopen)  
**Theme:** Discovery-led wrapper — map supported architecture; sequence rationalisation domains  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Decision:** [S74-D01](decisions.md#s74-d01-sprint-74-scope--architecture-consolidation-and-rationalisation-discovery-led-wrapper)

| Authority | Path |
| --------- | ---- |
| Start here | [SPRINT-74-START-HERE.md](SPRINT-74-START-HERE.md) |
| Charter | [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md) |
| Context | [CONTEXT.md](CONTEXT.md) |
| Handover | [HANDOVER.md](HANDOVER.md) |
| Plan | [PLAN.md](PLAN.md) |
| Status dashboard | [STATUS.md](STATUS.md) |
| Decisions | [decisions.md](decisions.md) |
| **Architectural constraints** | [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) |
| Discovery (S74-T-001) | [S74-T-001-codebase-rationalisation-discovery.md](S74-T-001-codebase-rationalisation-discovery.md) |
| Domain refinement (S74-T-010) | [S74-T-010-rationalisation-domain-refinement.md](S74-T-010-rationalisation-domain-refinement.md) |
| Next-chat briefing | [next-chat-briefing.md](next-chat-briefing.md) |
| Predecessor (Sprint 73) | [SPRINT-73-FINAL-REPORT.md](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md) |
| Canonical product backlog | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |
| Top-level overview | [sprint-74-architecture-consolidation-and-rationalisation.md](../../../sprints/sprint-74-architecture-consolidation-and-rationalisation.md) |

## Reading order (open)

1. [SPRINT-74-START-HERE.md](SPRINT-74-START-HERE.md)  
2. [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
3. [S74-T-001](S74-T-001-codebase-rationalisation-discovery.md) · [S74-T-010](S74-T-010-rationalisation-domain-refinement.md)  
4. [next-chat-briefing.md](next-chat-briefing.md) · [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md)  

## Theme

Understand the current supported Prism architecture and establish a sequence of evidence-based rationalisation sprints (**74A / 74B / 74C**). Not indiscriminate cleanup.

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

## Boundaries

- Discovery / planning only under this wrapper — no runtime changes  
- Binding constraints: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`) — browser-only runtime; one supported path; `app.js` by ownership; static deployment  
- Sprint 74A / 74B / 74C **not opened** (74A recommended; operator-gated)  
- Sprint 73 remains closed predecessor authority for Workflow Resources / Authoring  
