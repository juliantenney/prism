# Risk Register — Sprint 58

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
| -- | ---- | ---------- | ------ | ---------- | ----- |
| R1 | Chat-only context insufficient for downstream stages | Medium | High | Strong prompt instructions; manual E2E validation | Implementation |
| R2 | Assembly merge bugs (activity/material ID) | Medium | High | Comprehensive unit tests | Implementation |
| R3 | Legacy workflow regression | Low | High | Flag gating + regression test | Implementation |
| R4 | Partial capture mutated by compose closure | High | High | Gate `syncWorkflowRunCapturedOutputToState` | Phase 2 |
| R5 | Full-page v2 code conflicts with partial path | Medium | Medium | Phased gating; retire embed paths | Phase 3 |
| R6 | DP partial shape ambiguity (`page_synthesis` vs `sections`) | Medium | Medium | ADR + ownership model | Phase 1 |
| R7 | Renderer receives unassembled partial | Medium | High | `resolvePageForRenderOrAssembly` | Phase 4 |
| R8 | Copilot emits full page despite partial contract | Medium | Low | Partial validator accepts or strips; human review | Ongoing |

## Review cadence

Update at end of each implementation phase.

## Escalation

Architecture escalation (re-introduce injection) requires ADR amendment — not sprint scope change without approval.
