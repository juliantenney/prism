# Sprint 73 — Workflow Resources

**Status:** **OPEN** (Phase 2 implementation complete; verification next)  
**Opened:** 2026-08-06  
**Predecessor:** Sprint 72 — **COMPLETE / Closed** (do not reopen)  
**Backlog anchor:** [PB-FA-001 — Workflow Resources](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)  
**Charter:** [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md)

| Authority | Path |
| --------- | ---- |
| Start here | [SPRINT-73-START-HERE.md](SPRINT-73-START-HERE.md) |
| Charter | [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md) |
| Context | [CONTEXT.md](CONTEXT.md) |
| Handover | [HANDOVER.md](HANDOVER.md) |
| Plan | [PLAN.md](PLAN.md) |
| Status dashboard | [STATUS.md](STATUS.md) |
| Decisions | [decisions.md](decisions.md) |
| Discovery (Phase 1) | [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) · [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) · [S73-T-003](S73-T-003-persistence-strategy-evaluation.md) · [S73-T-004](S73-T-004-export-and-regeneration-path-implications.md) · [S73-T-005](S73-T-005-feasibility-synthesis.md) |
| Phase 2 acceptance criteria | [S73-T-010](S73-T-010-phase-2-acceptance-criteria.md) |
| Phase 2 implementation | [S73-T-011](S73-T-011-generated-image-persistence-implementation.md) |
| Predecessor links | [links-to-predecessors.md](links-to-predecessors.md) |
| Next-chat briefing | [next-chat-briefing.md](next-chat-briefing.md) |
| Canonical product backlog | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |
| Top-level overview | [sprint-73-workflow-resources.md](../../../sprints/sprint-73-workflow-resources.md) |

## Decision-gate and Phase 2 status

- Feasibility synthesis: [S73-T-005](S73-T-005-feasibility-synthesis.md)
- Feasibility decision: [S73-D02 — feasible with explicit conditions](decisions.md#s73-d02-workflow-resource-persistence-is-feasible-with-explicit-conditions)
- Acceptance criteria: [S73-T-010](S73-T-010-phase-2-acceptance-criteria.md) — complete
- Implementation: [S73-T-011](S73-T-011-generated-image-persistence-implementation.md) — complete
- Next task: [S73-T-012](PLAN.md#phase-2--persistent-generated-images-conditional) (verification)

## Reading order (open)

1. [SPRINT-73-START-HERE.md](SPRINT-73-START-HERE.md)  
2. [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md)  
3. [next-chat-briefing.md](next-chat-briefing.md) · [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md)  

## Theme

Provide first-class **Workflow Resources** for Prism by investigating durable persistence for learner-facing resources, beginning with generated images.

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Ideas and possible future enhancements remain in the product backlog until they are ready for planning.

## Boundaries at open

- Discovery-led; **implementation not assumed**  
- Scoped to **PB-FA-001 — Workflow Resources** only — no unrelated backlog absorption  
- No programming resources, pipeline integrity, evidence-architecture changes, learner-renderer redesign, or unrelated UI polish  
- PDF / Word / video — anticipated architecture consumers only; **not scheduled**
