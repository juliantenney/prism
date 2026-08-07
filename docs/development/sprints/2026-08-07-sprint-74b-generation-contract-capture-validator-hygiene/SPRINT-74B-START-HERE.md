# Sprint 74B — START HERE

**Sprint:** 74B — Generation-contract & capture-validator hygiene  
**Status:** **OPEN**  
**Opened:** 2026-08-07  
**Type:** Implementation sprint  
**Parent:** [Sprint 74](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md) — **OPEN**  
**Charter:** [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md)  
**Opening:** [S74B-D01](decisions.md#s74b-d01-open-sprint-74b-for-generation-contract--capture-validator-hygiene)  
**Page construction:** [S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture) — **Accepted**  
**Pre-release Compatibility:** [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation) — **Accepted** · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Methodology:** [S74-T-010 post-74A refinement](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#post-74a-implementation-refinement-2026-08-07)

---

## Mission

Establish **definitive ownership** across prompt generation, generation contracts, capture validation, and compose / partial contract roles — then remove or consolidate only where ownership and behavioural responsibility are evidenced.

One definitive codebase — not zero-call-site deletion alone.

## Product spine (unchanged — out of scope)

```text
Create Workflow → Run / prompt assembly → (contracts / validators / builders)
Authoring → learner export remains on sole vNext (Sprint 74A)
```

## Hard constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

## Engineering disciplines (inherited)

[ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) — **do not duplicate** in this pack. Architectural constraints define what Prism must remain; Engineering Disciplines define how consolidation work is carried out safely.

## Scope / non-scope (summary)

| In | Out |
| -- | --- |
| Ownership / duplicate-path inventory first | Indiscriminate deletion |
| Deprecated prompt helpers; legacy capture validators | Learner-renderer-vNext internals |
| Compose vs partial role clarity (docs-first) | Authoring export-path changes |
| Evidenced removal / consolidation | Pedagogy redesign; forced compose/partial merge |
| Focused contract/generation tests | Prompt Library IndexedDB model changes |
| | Workflow Resources persistence; WR orphans |
| | Repository / fixture hygiene (**74C**) |
| | Size-driven `app.js` split |

## Current task

**S74B-T-050** — Verification and sprint closure (**Not started**).

T-001…**T-040** are **Done**. Evidence: [S74B-T-040](S74B-T-040-execute-evidenced-removals-evidence.md).

## Reading order

1. [S74B-T-040 evidence](S74B-T-040-execute-evidenced-removals-evidence.md)  
2. [STATUS.md](STATUS.md) · [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md)  

## Immediate next action

When authorised: begin **S74B-T-050**. Do not open 74C.

