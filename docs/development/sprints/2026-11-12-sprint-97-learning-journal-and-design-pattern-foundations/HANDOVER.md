# Sprint 97 — Handover

**From:** M1 compatibility principle (S97-D05, 2026-11-12)  
**To:** Explicit **M2 authorisation** chat  
**Status:** OPEN — documentation only; do not implement M2 yet

## Load first

1. [SPRINT-97-START-HERE.md](SPRINT-97-START-HERE.md)  
2. [STATUS.md](STATUS.md)  
3. [S97-D03](decisions.md#s97-d03--resolve-q1q7-and-lock-m1-contract) — Q1–Q7  
4. [S97-D04](decisions.md#s97-d04--incremental-journal-development--pedagogical-north-star) — Levels 1–3 + north star  
5. [S97-D05](decisions.md#s97-d05--learning-journey-data-model-extensibility-compatibility-principle) — data-model compatibility  
6. [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)

## Locked for M2 planning

- Spec: `learning_journey.journal`  
- TOC: Overview → resources → journal  
- Notifications: content fingerprints; journey-scoped acknowledgement  
- **Level 1 (M2):** fixtures OK for runtime  
- **Level 2 (M3):** Design Page journal commission/revise **without** constituent regen  
- **Level 3 (M5):** journey-level pipeline journals from original briefs + incremental reassembly  
- Catalogue: `docs/design-patterns/`  
- Producer artefacts eligible even without a later consumer  
- Pedagogical north star informs M3/M4 docs only (not new runtime)  
- Extend existing journey/artefact/journal contracts additively; keep data separate from shell presentation; no speculative abstractions

## Do not

- Implement journal code until **M2 is explicitly authorised**.  
- Treat fixture journals as sufficient for sprint acceptance.  
- Regenerate entire Learning Journeys or unchanged constituents for journal iteration.  
- Introduce a new caching/regeneration framework.  
- Implement conditional logic, branching, rules engines, or extra learner-state in Sprint 97.  
- Reopen Sprint 96.  
- Absorb PB-FA-026.

## Predecessor

[Sprint 96 CLOSED — ACCEPTED](../2026-11-03-sprint-96-unified-learning-journey-experience/SPRINT-96-CLOSURE.md)
