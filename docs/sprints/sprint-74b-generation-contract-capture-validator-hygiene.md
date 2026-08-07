# Sprint 74B — Generation-contract & capture-validator hygiene

**Status:** **OPEN**  
**Opened:** 2026-08-07  
**Type:** Implementation sprint  
**Parent:** [sprint-74-architecture-consolidation-and-rationalisation.md](sprint-74-architecture-consolidation-and-rationalisation.md) — **OPEN**  
**Portable pack:** [SPRINT-74B-START-HERE.md](../development/sprints/2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md)  
**Predecessor:** [sprint-74a-closeout.md](sprint-74a-closeout.md) — Sprint 74A **COMPLETE / Closed**  
**Opening:** [S74B-D01](../development/sprints/2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/decisions.md#s74b-d01-open-sprint-74b-for-generation-contract--capture-validator-hygiene)  
**Programme principle:** [S74-D07](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../development/ENGINEERING-DISCIPLINES.md) *(inherited)*

## Theme

Reduce dead or dual generation surfaces — deprecated prompt builders, legacy capture validators, duplicate contract ownership — while preserving supported prompt behaviour and leaving Authoring learner export (sole vNext) unchanged.

## Task posture

- T-001: **Done** (pack init)  
- T-010: **Done** — [architectural discovery](../development/sprints/2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-T-010-generation-pipeline-architectural-discovery.md)  
- **Next:** `S74B-T-020` — compose vs partial contract role documentation (**Not started**)  
- T-030…T-050: **Not started**  
- Removals / runtime changes: **Not started**  
- Sprint 74C: **Not opened**

## Methodology

Ownership inventory first ([S74-T-010 post-74A refinement](../development/sprints/2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#post-74a-implementation-refinement-2026-08-07)). Removal follows ownership proof, not zero-call-site proof alone.
