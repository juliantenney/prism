# Sprint 67 — Backlog

**Status:** Closed — Sprint 67.10 complete (2026-07-21)  
**Charter:** [SPRINT-67-CHARTER.md](SPRINT-67-CHARTER.md)

| ID | Milestone | Item | Status | Deliverable |
| -- | --------- | ---- | ------ | ----------- |
| S67-BL-001 | M0–M1 | Model freeze + HTML renderer skeleton | **Done** | `render-*.js` stubs emitting structure |
| S67-BL-002 | M2 | Material renderers (text, tables, scenarios, checklist, expected output) | **Done** | Material HTML from model |
| S67-BL-003 | M2 | Activity framing + page orientation / assessment / tips | **Done** | Full page HTML from model |
| S67-BL-004 | M3 | Golden fixture HTML + structural invariant tests | **Done** | Test file(s) |
| S67-BL-005 | M3 | Extend architecture exclusion tests to render modules | **Done** | Updated architecture tests |
| S67-BL-006 | M4 | Feature-flag entry point; default legacy | **Done** | Production hook + tests |
| S67-BL-006A | M4 | Browser runtime registration for vNext | **Done** | UMD bundle + `index.html` + browser tests |
| S67-BL-007 | M5 | Human review of heteroscedasticity vNext export | **Done** | **PASS WITH MINOR FINDINGS** — [`artefacts/M5-human-review-record.md`](artefacts/M5-human-review-record.md) |
| S67-BL-008 | M6 | Rollout readiness checklist + sprint close prep | **Done** | [SPRINT-67-CLOSURE.md](SPRINT-67-CLOSURE.md) |

**Gate:** Do not delete legacy renderer in this sprint.  
**Gate:** Rule changes require decision-log entry and model-test updates.
