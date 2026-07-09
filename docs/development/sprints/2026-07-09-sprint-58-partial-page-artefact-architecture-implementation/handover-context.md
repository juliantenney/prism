# Handover Context — Sprint 58

## Sprint status

**Active** — implementation sprint opened 2026-07-09

## Predecessors

| Sprint | Outcome |
| ------ | ------- |
| 56F | v2 schema frozen; ownership defined; full-page enrichment planned |
| 57A | Instructional budgeting defined; full-page enrichment **failed** E2E testing |

## Architecture decision

Partial page artefacts + deterministic assembly. See [ADR-partial-page-artefact-assembly.md](ADR-partial-page-artefact-assembly.md).

## Code baseline at sprint open

- Full-page v2 partially implemented in `app.js` and enrich libs
- `isPageEnrichmentV2WorkflowEnabled()` hard-coded `true`
- Upstream JSON embeds active for DLA→GAM→LS→DP
- No `page-vnext-assemble.js`
- Uncommitted: LS/DP full-page v2 tests and app.js changes

## Immediate priority

Phase 1: assembly module + gates (see [implementation-plan.md](implementation-plan.md))

## New chat entry

[SPRINT-58-CONTEXT-FOR-NEW-CHAT.md](SPRINT-58-CONTEXT-FOR-NEW-CHAT.md)

## Constraints (non-negotiable)

- No API
- No LLM reconciliation
- No upstream capture injection (post-EP)
- No full-page enrich-in-place (post-EP)

## Reference material (read-only)

- 57A budgeting docs — prompt authoring guidance only
- 56F schema and ownership matrix — unchanged
