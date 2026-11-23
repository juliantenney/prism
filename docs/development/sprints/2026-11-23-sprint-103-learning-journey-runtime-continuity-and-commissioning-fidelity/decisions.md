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

---

## S103-D03 — Close Sprint 103 — Complete / accepted with documented qualifications

**Date:** 2026-11-23  
**Status:** **Accepted**  
**Depends on:** [S103-D02](#s103-d02--open-sprint-103--learning-journey-runtime-continuity-and-commissioning-fidelity) **Accepted**; closure evidence in [VALIDATION.md](VALIDATION.md) and [STATUS.md](STATUS.md)

**Decision:** Close Sprint 103 as **CLOSED — COMPLETE — ACCEPTED WITH DOCUMENTED QUALIFICATIONS**.

**Delivered capabilities:**

1. Four-product artefact consumers and Learning Journey-first commissioning alignment (Interactive excluded on new LJs; standalone/legacy preserved).  
2. Learner-response persistence, cross-resource continuity, and four-entry Learning Journal on the clinical journey.  
3. Clear run data isolation for learner drafts / journal acknowledgements.  
4. Multi-question selection / radio grouping expand (manual re-export verified).  
5. Assessment Pack JSON fencing.  
6. Duration-fidelity guidance refinement (familiar/revisit + commissioning guidance) without changing authoritative 180/40 allocations.

**Validation:** Focused automated batch **107 pass / 0 fail / 0 skipped**. Manual *Judging Evidence in Clinical Decisions* — five commissions, four first-class products, persistence, Journal, Clear run data, multi-question radios.

**Non-blocking follow-ups (do not reopen Sprint 103):**

1. [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting) measured learner-time validation — remains open.  
2. Formal accessibility audit of the clinical journey — not claimed.  
3. Response-aware adaptive activity — intentionally unsupported.

**Post-close posture:** Feature freeze until Connect More (Wed 2 Dec 12:00) — create Learning Journeys → test → fix demonstrated defects → verify. No new backlog features or major architecture.

**Canonical closure record:** [SPRINT-103-CLOSURE.md](SPRINT-103-CLOSURE.md).
