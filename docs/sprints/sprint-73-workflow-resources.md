# Sprint 73 — Workflow Resources

**Status:** **OPEN** (planning / discovery)  
**Opened:** 2026-08-06  
**Type:** Discovery-led implementation sprint (maturation phase)  
**Backlog anchor:** [PB-FA-001 — Workflow Resources](../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)  
**Portable pack:** [docs/development/sprints/2026-08-06-sprint-73-workflow-resources/](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-START-HERE.md)  
**Predecessor:** [sprint-72-closeout.md](sprint-72-closeout.md) — **Closed**

## Theme

Provide first-class **Workflow Resources** for Prism by investigating durable persistence for learner-facing resources, beginning with generated images.

## Broader direction

Workflow Resources are expected ultimately to encompass **generated media**, **uploaded documents**, and **embedded external resources**. Sprint 73 does not commit to all types — PDF, Word, and video remain anticipated consumers only.

## Sprint 73 purpose (authoritative)

Investigate whether robust **workflow asset persistence** is achievable as the foundation for Workflow Resources; if so, implement persistent generated images first, then generalise into an extensible resource model. **Implementation is not assumed.**

## Entry state

- Sprint 72 **complete** — instructional architecture productised.  
- Sprint 71 findings **fully dispositioned**.  
- Prism approaching v1.0 feature completeness; emphasis on durability, workflow continuity, content quality, author experience, polish.  
- Inherited binding decisions: `S72-D09` (shared asset persistence model), `S72-D10` (attachment bytes deferred).

## Phase overview

| Phase | Focus |
| ----- | ----- |
| 1 | Architecture discovery (incl. canonical ownership) |
| Gate | Feasibility decision |
| 2 | Persistent generated images *(conditional — blocked)* |
| 3 | Generalise Workflow Resources architecture *(conditional — blocked)* |

## Boundaries

Not in initial scope: programming resources (PB-FA-002), pipeline integrity (PB-FA-003), evidence architecture changes, learner renderer redesign, unrelated UI polish, PDF/Word/video implementation.

## Authoritative docs

- [SPRINT-73-START-HERE.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-START-HERE.md)  
- [SPRINT-73-CHARTER.md](../development/sprints/2026-08-06-sprint-73-workflow-resources/SPRINT-73-CHARTER.md)
