# Sprint 56F — START HERE

**Progressive Page Enrichment Architecture**

## Status

- **Sprint:** 56F (investigation complete — schema freeze proposal on disk)
- **Phase:** Schema frozen (`2.0.0`); implementation not started
- **Entry point for new chat:** [next-chat-briefing.md](next-chat-briefing.md)

## Why this sprint exists

Sprint 56E demonstrated that Design Page is being used for deterministic join/copy work that LLMs perform unreliably. Sprint 56F redesigns transport so the workflow progressively builds one page artefact instead of merging separate artefacts at the end.

## Read first (order)

1. [next-chat-briefing.md](next-chat-briefing.md)
2. [design-page-schema-freeze-signoff.md](design-page-schema-freeze-signoff.md)
3. [design-page.schema.vNext.json](design-page.schema.vNext.json)
4. [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md)
5. [ownership-matrix-vnext.md](ownership-matrix-vnext.md)
6. [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md)
7. [context/lessons-learned-56e.md](context/lessons-learned-56e.md)
8. [architecture-decision.md](architecture-decision.md)

### Authoritative audit artefacts

- [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md)
- [page-synthesis-vs-sections-investigation.md](page-synthesis-vs-sections-investigation.md)

### Superseded scaffold (do not use for decisions)

- [ownership-matrix.md](ownership-matrix.md) → use ownership-matrix-vnext.md
- [finalise-page-investigation.md](finalise-page-investigation.md) → use finalise-page-responsibility-definition.md

## Core decision direction

Adopt **Option 3: Progressive enrichment** — one evolving `page` artefact enriched by Episode Plan → DLA → GAM → Learning Sequence → optional `finalise_page`.

Design Page LLM merge is a candidate for **retirement**.

## What is in scope

- Architecture definition
- Ownership boundaries
- Evolving page artefact schema design
- Design Page responsibility audit
- `finalise_page` investigation
- GAM structured enrichment investigation
- Migration plan
- External validation strategy

## What is out of scope

- Production workflow changes
- Production prompt rewrites
- Repository Python service implementation
- Pedagogy redesign

## Predecessor

[Sprint 56E](../2026-07-07-sprint-56e-design-page-minimal-refactor/README.md) — frozen at commit `Sprint 56E complete: freeze Design Page investigation before progressive enrichment architecture`.
