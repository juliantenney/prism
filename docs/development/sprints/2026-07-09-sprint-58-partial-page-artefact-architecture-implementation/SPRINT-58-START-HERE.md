# Sprint 58 — START HERE

**Partial Page Artefact Architecture Implementation**

## Status

- **Sprint:** 58 (active)
- **Type:** Implementation
- **Predecessor:** Sprint 57A (closed)
- **New chat entry:** [SPRINT-58-CONTEXT-FOR-NEW-CHAT.md](SPRINT-58-CONTEXT-FOR-NEW-CHAT.md)

---

## Why this sprint exists

Sprint 56F froze the v2 page schema and ownership model. Sprint 57A showed that asking LLMs to preserve and return complete pages across post-Episode-Plan stages fails in practice. Sprint 58 implements the revised model: **partial page artefacts per stage** + **deterministic assembly**.

## Read first (order)

1. [SPRINT-58-CONTEXT-FOR-NEW-CHAT.md](SPRINT-58-CONTEXT-FOR-NEW-CHAT.md) — full handover if no prior context
2. [ADR-partial-page-artefact-assembly.md](ADR-partial-page-artefact-assembly.md) — architecture decision
3. [architecture-summary.md](architecture-summary.md) — target pipeline
4. [ownership-model.md](ownership-model.md) — field ownership
5. [implementation-plan.md](implementation-plan.md) — phased tasks
6. [context/current-implementation-state.md](context/current-implementation-state.md) — what exists in code today

### Predecessor closure (reference only)

- [Sprint 57A closure report](../2026-07-08-sprint-57a-instructional-sufficiency-content-budgeting/SPRINT-57A-CLOSURE-REPORT.md)
- [Sprint 56F schema freeze](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/design-page-schema-freeze-signoff.md)

## Authoritative principle

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.

## In scope

- Partial output prompts (DLA, GAM, LS, DP)
- Remove upstream artefact injection from post-EP prompts
- Partial capture validation
- `lib/page-vnext-assemble.js` deterministic assembly
- Render path integration
- Legacy workflow gating
- Tests

## Out of scope

- Instructional-budget research (57A reference only)
- API integration
- Runtime LLM repair/reconciliation
- Schema changes without ADR
- Assessment stages (stub assembly slots only)

## Definition of done

[definition-of-done.md](definition-of-done.md)
