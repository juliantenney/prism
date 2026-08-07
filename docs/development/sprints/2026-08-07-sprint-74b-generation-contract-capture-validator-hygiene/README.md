# Sprint 74B — Generation-contract & capture-validator hygiene

**Status:** **COMPLETE / Closed**  
**Opened:** 2026-08-07  
**Closed:** 2026-08-07  
**Type:** Implementation sprint  
**Parent programme:** [Sprint 74](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/README.md) — **OPEN**  
**Opening:** [S74B-D01](decisions.md)  
**Page construction:** [S74B-D02](decisions.md#s74b-d02--partial--deterministic-assemble-is-the-sole-definitive-page-construction-architecture) — **Accepted**  
**Pre-release Compatibility:** [S74B-D03](decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation) — **Accepted** · programme [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(inherited — not duplicated)*  
**Domain authority:** [S74-T-010 Domain B](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#domain-b--generation-contract--capture-validator-hygiene-recommended-sprint-74b)  
**Predecessor:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md) — **COMPLETE / Closed**

| Authority | Path |
| --------- | ---- |
| Start here | [SPRINT-74B-START-HERE.md](SPRINT-74B-START-HERE.md) |
| Charter | [SPRINT-74B-CHARTER.md](SPRINT-74B-CHARTER.md) |
| Context | [CONTEXT.md](CONTEXT.md) |
| Plan | [PLAN.md](PLAN.md) |
| Status | [STATUS.md](STATUS.md) |
| Decisions | [decisions.md](decisions.md) |
| Handover | [HANDOVER.md](HANDOVER.md) |
| Closure evidence | [S74B-T-050-final-verification-and-sprint-closure.md](S74B-T-050-final-verification-and-sprint-closure.md) |
| T-040 evidence | [S74B-T-040-execute-evidenced-removals-evidence.md](S74B-T-040-execute-evidenced-removals-evidence.md) |
| Top-level overview | [sprint-74b-generation-contract-capture-validator-hygiene.md](../../../sprints/sprint-74b-generation-contract-capture-validator-hygiene.md) |

## Mission

Reduce dead or dual **generation** surfaces — deprecated prompt builders, legacy capture-validator shims, and duplicate ownership across contracts — without changing instructional pedagogy or the Authoring learner-export path.

## Outcome

- **Partial contract + deterministic assemble** is the sole supported page-construction architecture.  
- Design Page compose, PR-W aliases, and legacy always-pass capture shims **removed** (T-040).  
- Acceptance verified (T-050): **134/134** supporting Node; production browser spot-check.  
- Sprint 74C **Not opened**.
