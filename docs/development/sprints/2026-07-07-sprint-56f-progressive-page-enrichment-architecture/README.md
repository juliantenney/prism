# Sprint 56F — Progressive Page Enrichment Architecture

- **Sprint ID:** 56F
- **Type:** Architecture / Content Transport Redesign
- **Status:** Investigation complete — schema freeze proposal on disk; implementation not started
- **Predecessor:** [Sprint 56E — Design Page Minimal Refactor](../2026-07-07-sprint-56e-design-page-minimal-refactor/README.md)

## Entry

Start here: [SPRINT-56F-START-HERE.md](SPRINT-56F-START-HERE.md)

## Objective

Replace the current multi-artefact merge architecture with a single progressively enriched page artefact that flows through the PRISM workflow.

This is an architectural redesign of content transport and ownership — not a pedagogy redesign.

## Deliverables index

### Authoritative (post-audit)

| Document | Purpose |
| -------- | ------- |
| [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md) | **Schema freeze proposal** |
| [ownership-matrix-vnext.md](ownership-matrix-vnext.md) | Canonical ownership |
| [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md) | finalise_page boundary |
| [page-synthesis-vs-sections-investigation.md](page-synthesis-vs-sections-investigation.md) | page_synthesis rationale |
| [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md) | Field audit |
| [next-chat-briefing.md](next-chat-briefing.md) | New chat entry point |

### Context and planning

| Document | Purpose |
| -------- | ------- |
| [sprint-overview.md](sprint-overview.md) | Sprint scope, goals, constraints |
| [problem-statement.md](problem-statement.md) | Why 56F exists |
| [architecture-decision.md](architecture-decision.md) | ADR-style decision record |
| [progressive-enrichment-architecture.md](progressive-enrichment-architecture.md) | Target architecture |
| [architectural-options-comparison.md](architectural-options-comparison.md) | Options 1–3 comparison |
| [material-ownership-inventory.md](material-ownership-inventory.md) | Learner-facing content inventory |
| [design-page-responsibility-audit.md](design-page-responsibility-audit.md) | DP retirement analysis |
| [agent-assisted-assembly.md](agent-assisted-assembly.md) | Deterministic assembly via structured artefacts |
| [migration-plan.md](migration-plan.md) | Phased cutover |
| [risk-register.md](risk-register.md) | Risks and mitigations |
| [test-strategy.md](test-strategy.md) | External audit strategy |
| [handover-context.md](handover-context.md) | Handover pack |
| [glossary.md](glossary.md) | Artefact and stage definitions |
| [backlog.md](backlog.md) | Sprint workstreams |

### Superseded scaffold

| Document | Use instead |
| -------- | ----------- |
| [ownership-matrix.md](ownership-matrix.md) | ownership-matrix-vnext.md |
| [finalise-page-investigation.md](finalise-page-investigation.md) | finalise-page-responsibility-definition.md |

## Context

| File | Purpose |
| ---- | ------- |
| [context/current-state.md](context/current-state.md) | As-is architecture |
| [context/lessons-learned-56e.md](context/lessons-learned-56e.md) | 56E outcomes |
| [context/assumptions.md](context/assumptions.md) | Working assumptions |
| [context/open-questions.md](context/open-questions.md) | Unresolved decisions |

## Constraints

- No production implementation in Sprint 56F setup phase.
- PRISM does not validate workflow outputs post-run; validation is external audit only.
- LLMs generate content; artefacts transport content; renderer renders content.
