# Sprint 83 — Architectural debt ledger

Debt relevant to Sprint 83 scope. Definitions live in the investigation report; this file records **current status only**.

**Sprint 83 is CLOSED / COMPLETE (2026-09-21).** Accepted findings: [S83-INVESTIGATION-REPORT.md](S83-INVESTIGATION-REPORT.md) · Closure: [SPRINT-83-CLOSURE.md](SPRINT-83-CLOSURE.md).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 82 | **CLOSED** |
| Sprint 83 | **CLOSED** — investigation accepted |
| First-class gate at alpha close | **339/339** |
| Interactive / Workshop alpha paths | Settled — reopen only with evidence |
| Interactive prompt family | **Protected baseline** ([S83-D04](decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Implementation of Expository | **Not authorised** |

## Sprint 83 findings as Planning inputs (not defects to “fix” here)

| ID | Finding | Notes |
| -- | ------- | ----- |
| **S83-F-001** | Interactive DLA/GAM contracts are production/evidence/workspace-bound | Prefer sibling Expository prompts/contracts (S83-D04) |
| **S83-F-002** | Episode Plan V1 encodes Interactive choreography without content-journey payload | Planning input |
| **S83-F-003** | Model Knowledge compresses examples/evidence/formalisms vs `learning_content` | Planning input — undecided whether to extend MK |
| **S83-F-004** | Whole-resource narrative continuity is activity-chained / thin glue | Planning input |
| **S83-F-005** | Renderer display path appears reusable | New renderer architecture not indicated |

## Explicitly out of this closed sprint

Implementing S83-F-*; modifying Interactive prompts for Expository; opening Planning without a new decision; historical S81/RC3–RC8/Group F debt as automatic work.
