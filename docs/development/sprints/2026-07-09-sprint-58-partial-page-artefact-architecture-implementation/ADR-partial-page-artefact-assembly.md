# ADR: Partial v2 Page Artefacts with Deterministic Assembly

**Status:** Accepted (Sprint 58)  
**Date:** 2026-07-09  
**Supersedes:** Full-page enrich-in-place sections of [progressive-enrichment-architecture.md](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/progressive-enrichment-architecture.md) for post-EP runtime behaviour  
**Preserves:** [design-page.schema.vNext.json](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/design-page.schema.vNext.json), [ownership-matrix-vnext.md](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/ownership-matrix-vnext.md)

---

## Context

Sprint 56F defined progressive page enrichment: one `page` artefact enriched in place at each stage. Sprint 57A tested this end-to-end. LLMs failed to preserve non-owned fields when returning complete pages — especially at GAM scale.

Extensive prompt hardening reduced some failure modes but did not provide durable preservation across fresh runs.

---

## Decision

### Authoritative principle

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.

### Rules

1. **Episode Plan** still produces the initial complete v2 page shell.
2. **Post-EP stages** emit `artifact_type: "page"` partial artefacts:
   - `artifact_type`, `schema_version`, `assembly_state`
   - owned fields only
3. Stages **do not** preserve, replay, reconstruct, or copy-forward fields owned by other stages.
4. Users paste each generated artefact into that step's **`runStepOutput`** field.
5. PRISM stores captures against workflow step identity.
6. **Stored step outputs are not downstream prompt inputs.**
7. Downstream prompts rely on **conversation/chat context** for instructional context.
8. **Upstream artefact injection into downstream prompts is removed** for post-EP steps.
9. **Final page assembly is deterministic code** (`lib/page-vnext-assemble.js`).
10. **No** runtime LLM reconciliation, repair, or merge.

### Explicit non-decisions

- No API integration
- No runtime LLM inspection
- No asking models to preserve full pages (post-EP)
- No reconciliation layer that asks the LLM to fix missing content

---

## Consequences

### Positive

- Removes impossible full-page preservation burden from LLMs
- Smaller post-EP outputs reduce truncation risk
- Assembly correctness is testable in code
- Aligns with 56F ownership model (each stage owns fields)

### Negative

- Downstream stages depend on Copilot conversation memory for context
- Assembly module must implement merge rules correctly
- Two sources of truth during transition (chat vs stored captures) — only captures are authoritative for render

### Neutral

- v2 schema unchanged; per-stage subset validation is new implementation concern
- Legacy compose workflows coexist behind flags

---

## Alternatives considered

| Alternative | Rejected because |
| ----------- | ---------------- |
| Continue full-page enrich-in-place + more prompts | 57A evidence: non-durable failures |
| LLM reconciliation pass | Violates prompt-only + no-repair constraints |
| Separate artefact types per stage (non-page) | Breaks 56F `page` transport model; assembly harder |
| Inject stored captures into downstream prompts | Causes reconstruction; user constraint |
| API-based artefact passing | Explicitly out of scope |

---

## Implementation references

- [implementation-plan.md](implementation-plan.md)
- [ownership-model.md](ownership-model.md)
- [migration-strategy.md](migration-strategy.md)
