# Sprint 58 — Next Chat Briefing

## Status

Sprint 58 is **closed** (2026-07-14). Read [SPRINT-58-CLOSURE.md](SPRINT-58-CLOSURE.md) before starting successor work.

## One-line context

Post-Episode-Plan stages emit owned-field-only partial v2 page artefacts; PRISM assembles deterministically. Design Page owns `page_synthesis`; compose contract is rollback/legacy-only.

## Do not (until a new sprint opens)

- Begin renderer redesign
- Begin instructional-content richness / scenario-depth changes
- Remove rollback or legacy infrastructure
- Re-introduce upstream JSON embed for post-EP partial steps
- Re-open instructional-budget research from 57A as active scope

## Sensible next slices (pick one)

1. Soak live transcript + simple workflows on commits `d5e8fbd`…`961ba2f`
2. Evidence-gated Design Page hard ownership validation
3. Compose-contract module scope reduction (rollback/legacy only)

## Authoritative principle

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.
