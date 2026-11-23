# Sprint 103 — Decisions

## S103-D01 — Learning Journey-first architecture

**Date:** 2026-11-23 (recorded at Sprint 102 close)  
**Status:** **Accepted** (architectural policy)  
**Canonical record:** [Sprint 102 decisions — S103-D01](../2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture)

**Summary:** Learning Journey is PRISM’s primary educational design and construction unit. Commissioning family for new journeys: Expository, Practice, Assessment Pack, Situated Task. Interactive remains for legacy and standalone authoring and should not be selected for new LJ commissions. LJ owns progression, outcomes, commissioning and continuity; unified shell should increasingly connect learner work and evidence across components.

**Sprint 103 posture:** This sprint **implements commissioning alignment** and verifies runtime continuity under that policy. It does **not** reopen product taxonomy, introduce new product types, or treat S103-D01 as already fully implemented in the product UI/defaults until Workstream D evidence is recorded.

---

## S103-D02 — Open Sprint 103 — Learning Journey Runtime Continuity and Commissioning Fidelity

**Date:** 2026-11-23  
**Status:** **Accepted**  
**Depends on:** [Sprint 102 CLOSED](../2026-11-20-sprint-102-learning-journey-owned-outcomes/SPRINT-102-CLOSURE.md); inter-sprint backlog reconciliation committed (`2c9450f`); [S103-D01](#s103-d01--learning-journey-first-architecture)

**Decision:** Open **Sprint 103 — Learning Journey Runtime Continuity and Commissioning Fidelity**.

**Objective:** Establish that Learning Journeys function as coherent, connected educational experiences across Expository, Practice, Assessment Pack and Situated Task — via commissioning fidelity, journal/runtime round-tripping, cross-component actual-response continuity investigation, and product-family alignment.

**Workstreams:** A Commissioning fidelity · B Journal/runtime round-tripping · C Cross-component continuity · D Product-family alignment — see [SPRINT-103-CHARTER.md](SPRINT-103-CHARTER.md).

**Phases:** **103A** bounded investigation (authorised with opening); later verification/correction phases require findings + separate gates before implementation.

**Authorised by opening:**

- Development pack and programme index updates.  
- **103A** read-only investigation / evidence mapping / observable acceptance criteria refinement (no speculative application coding).  
- Opening documentation commit (requested with this open instruction).

**Not authorised by opening alone:**

- Application / prompt / schema / workflow implementation.  
- Regenerating all LJ Test 3 children for design-only revalidation.  
- Clear run data, workspace folders, Practice interaction surfaces, precision graphics, assisted briefs, release packaging, adaptive branching, wholesale prompt migration.  
- Push to remote without separate request.  
- Reopening Sprint 102.

**Setup outcome:** Pack created under `docs/development/sprints/2026-11-23-sprint-103-learning-journey-runtime-continuity-and-commissioning-fidelity/`; programme pointers updated; [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) records the smallest first investigation.
