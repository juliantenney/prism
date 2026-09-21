# Sprint 85 — Architectural debt ledger

Debt relevant to Sprint 85 scope. This file records **current status only**.

**Sprint 85 is OPEN (2026-09-21).** Detailed implementation brief pending — no implementation findings yet.

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 82 | **CLOSED** |
| Sprint 83 | **CLOSED** — investigation accepted |
| Sprint 84 | **CLOSED** — Planning design accepted |
| First-class gate at alpha close | **339/339** — Interactive gate must remain green |
| Interactive prompt family | **Protected baseline** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Accepted Expository design | [S84 design](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) — do not reopen |

## Binding handoff (not debt)

| Source | Constraint |
| ------ | ---------- |
| S83-D04 | Sibling Expository prompt family; do not modify Interactive prompts to enable Expository |
| S84-D03…D12 | Product, topology, authority, north star, sections, contracts, quality — accepted |
| S84 §15 | Implementation handoff guidance — map via implementation brief, not invent ahead |

## Carried implementation questions (from S84 — not Sprint 84 reopeners)

| ID | Finding | Notes |
| -- | ------- | ----- |
| S85-AD-001 | Field-level section/page schema mechanics | Implementation within S84-D11 |
| S85-AD-002 | GAM body-authoring reuse behind XM | Spike — no Interactive contract coupling |
| S85-AD-003 | Zero-workspace export/package edge cases | Implementation verification |
| S85-AD-004 | Research Synthesis identity | Open, non-blocking |
| S85-AD-005 | Expository-specific Adjustments | Defer unless evidence requires |

## Sprint 85 open findings

| ID | Finding | Notes |
| -- | ------- | ----- |
| S85-AD-006 | Domain-pack guidance consumption in sibling **prompts** | Create/design context preserved; verifiable only after WP3 prompt authoring |
| S85-AD-007 | `expository_extent` factor persistence beyond resolved factors / EJP artefact | WP2 stamps EJP `extent` on capture when factors available; full WOS mapsTo optional later if needed |
| S85-AD-008 | Zero-workspace renderer / export for Expository pages | WP5 |

## Explicitly out of sprint (at open / until brief)

- Inventing detailed tasks ahead of the implementation brief  
- Production changes in the opening step  
- Reopening Sprint 83 or Sprint 84 architecture  
- Solving Expository→Interactive / Podcast / Presentation / Research Synthesis as blockers  
- Generic token-budget / content-budget frameworks (S85-D05)  
