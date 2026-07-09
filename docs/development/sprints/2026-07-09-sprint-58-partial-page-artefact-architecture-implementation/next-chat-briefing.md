# Sprint 58 — Next Chat Briefing

## Start here

1. [SPRINT-58-START-HERE.md](SPRINT-58-START-HERE.md)
2. [SPRINT-58-CONTEXT-FOR-NEW-CHAT.md](SPRINT-58-CONTEXT-FOR-NEW-CHAT.md)
3. [implementation-plan.md](implementation-plan.md)

## One-line context

57A proved full-page enrich-in-place fails; Sprint 58 implements partial page artefacts per stage + deterministic assembly.

## Authoritative principle

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.

## First implementation task

Phase 1: `lib/page-vnext-assemble.js` + workflow gates.

## Do not

- Re-open instructional-budget research
- Re-introduce upstream JSON embed for post-EP steps
- Implement API or LLM reconciliation
