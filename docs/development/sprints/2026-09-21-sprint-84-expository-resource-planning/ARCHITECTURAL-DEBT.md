# Sprint 84 — Architectural debt ledger

Debt relevant to Sprint 84 scope. This file records **current status only**.

**Sprint 84 is CLOSED / COMPLETE (2026-09-21).** Accepted design: [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md) · Closure: [SPRINT-84-CLOSURE.md](SPRINT-84-CLOSURE.md).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 82 | **CLOSED** |
| Sprint 83 | **CLOSED** — investigation accepted |
| Sprint 84 | **CLOSED** — Planning design accepted |
| First-class gate at alpha close | **339/339** |
| Interactive prompt family | **Protected baseline** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Implementation of Expository | **Not authorised** |

## Binding handoff (not debt)

| Source | Constraint |
| ------ | ---------- |
| S83-D04 | Sibling Expository prompt family; do not modify Interactive prompts to enable Expository |
| S84 accepted design | Topology, authority, north star, sections, contracts — do not reopen without new programme decision |
| S84-D10 | Instructional-design north star — progressive construction of understanding |
| S84-D11 | Ordered learner-facing exposition **sections** as semantic primary structure |

## Deferred / open (carry to implementation or later — not Sprint 84 blockers)

| ID | Finding | Notes |
| -- | ------- | ----- |
| S84-AD-001a | Field-level section/page schema mechanics | Implementation within S84-D11 |
| S84-AD-002 | GAM body-authoring reuse behind XM | Implementation spike — avoid Interactive contract coupling |
| S84-AD-003 | Export package edge cases for zero-workspace | Implementation verification |
| S84-AD-004 | Research Synthesis identity | Open, non-blocking |
| S84-AD-005 | Expository-specific Adjustments | Defer until evidence requires |

## Explicitly out of closed sprint

- Implementing Expository  
- Production prompt/schema/UI/renderer changes  
- Reopening Sprint 83 or Sprint 84 architecture  
- Opening implementation sprint without separate operator decision  
- Solving Expository→Interactive / Podcast / Presentation / Research Synthesis as blockers  
