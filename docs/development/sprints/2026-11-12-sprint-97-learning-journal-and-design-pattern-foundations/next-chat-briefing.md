# Sprint 97 — Next chat briefing

**Sprint:** 97 — Learning Journal and Design Pattern Foundations  
**Status:** OPEN — M1 complete (S97-D03–D05); awaiting **explicit M2 authorisation**  
**Start:** [SPRINT-97-START-HERE.md](SPRINT-97-START-HERE.md)

## One-screen summary

Learning Journal (unified shell; declared producers; content-fingerprint notifications) + design-pattern catalogue at `docs/design-patterns/`. Q1–Q7 locked. Journal work is **incremental**. Journey data model (constituents ↔ artefacts ↔ references ↔ journal) must stay presentation-separable and additively evolvable ([S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle)) — **not** a licence for branching/rules in S97. **No journal code yet.**

## Before implementing M2

Require an explicit M2 authorisation message. Implement Level 1 against [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md).

## Hard stops

No new learner-work persistence; no AI marking/editing/export; no constituent regen for journal iteration; no new caching/regeneration framework; no conditional/branching/rules/extra learner-state; no speculative data abstractions; fixtures ≠ sprint acceptance; preserve standalone + carry-forward.

## Key files

- Shell: `lib/learning-journey-unified-shell.js`  
- Artefacts: `lib/learner-renderer-vnext/learner-artefact-contract.js`  
- Design page: `lib/learning-journey-design-page.js`  
- Catalogue (M4): `docs/design-patterns/`
