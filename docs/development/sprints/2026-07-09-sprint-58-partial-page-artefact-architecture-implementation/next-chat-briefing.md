# Sprint 58 — Next Chat Briefing

## Status

Sprint 58 is **closed** (2026-07-14). Read [SPRINT-58-CLOSURE.md](SPRINT-58-CLOSURE.md) for what shipped.

**Active successor:** [Sprint 59 — Instructional Content Richness Audit](../2026-07-14-sprint-59-instructional-content-richness-audit/SPRINT-59-START-HERE.md)  
Paste briefing: [../2026-07-14-sprint-59-instructional-content-richness-audit/next-chat-briefing.md](../2026-07-14-sprint-59-instructional-content-richness-audit/next-chat-briefing.md)

## One-line context

Post-Episode-Plan stages emit owned-field-only partial v2 page artefacts; PRISM assembles deterministically. Design Page owns `page_synthesis`; compose contract is rollback/legacy-only.

## Do not

- Begin renderer redesign (deferred until Sprint 59 audit + renderer input pack)
- Begin prompt / scenario-depth generation changes without Sprint 59 criteria
- Remove rollback or legacy infrastructure
- Re-introduce upstream JSON embed for post-EP partial steps
- Re-open instructional-budget research from 57A as active scope
- Reopen Sprint 58 Phase 0/1 / validators / assembly unless a proven regression

## Sensible next slices

1. **Sprint 59** — diagnostic richness audit (preferred next work)
2. Soak live transcript + simple workflows on commits `d5e8fbd`…`961ba2f`
3. Later (not Sprint 59): evidence-gated DP hard ownership validation **or** compose-contract reduction

## Authoritative principle

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.
