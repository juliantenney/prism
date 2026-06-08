# Sprint 38-S — Episode Plan V1 Implementation

**Pack path:** `docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/`  
**Date:** 2026-06-06  
**Status:** **OPEN** — production workflow step integrated  
**Latest:** [observations/38S-first-class-episode-plan-step.md](observations/38S-first-class-episode-plan-step.md)  
**Harness closure:** [observations/38S-6-sprint-closure.md](observations/38S-6-sprint-closure.md) (superseded for workflow/UI gate)  
**Predecessor:** [Sprint 38-R — Instructional Episode Plan Design Proof](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/) (**CLOSED** — [38R-6](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [phase-2/38S-handover-pack.md](phase-2/38S-handover-pack.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Programme framing

```text
38Q discovered the missing planning abstraction.
38R proved the smallest viable form of that abstraction.
38S implements that abstraction and executes the proof framework.
```

**38Q answered:** Episode planning is required — Option F Hybrid.  
**38R proved:** Episode Plan V1 = `archetype` + ordered `function` beats — nothing more.  
**38S must:** Implement V1 in the Prism pipeline and prove G3/G5 reduction while preserving `fullOk`.  
**38S delivered:** V1 integrated and proof-gated (`EV-38S-AFTER-4` — **fullOk: true**).

This is the **first implementation sprint** for Episode Plan V1. Do not redesign the plan. Do not expand the schema.

---

## Frozen architecture

```text
KM → LO → Episode Plan V1 → DLA → GAM → Page
```

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative.

**Explicitly excluded:** transition graph · learner-state engine · branching · orchestration framework · V2 schema

---

## Core implementation objectives

1. Introduce Episode Plan V1 between LO and DLA  
2. Implement plan-before-populate gate ([38Q-5 M-13](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md))  
3. Implement `instructional_function` obligation tagging  
4. Preserve P1–P10 mapping principles ([38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md))  
5. Preserve AC-01–AC-10 anti-collapse rules  
6. Execute [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) proof framework  
7. Preserve `fullOk` and 58/58 regression suite  

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38S-1** | Episode Plan V1 integration | [38S-1](observations/38S-1-episode-plan-v1-integration.md) | **COMPLETE** |
| **38S-2** | Population contract | [38S-2](observations/38S-2-population-contract-implementation.md) | **COMPLETE** |
| **38S-3** | DLA obligation tagging | [38S-3](observations/38S-3-dla-obligation-tagging.md) | **COMPLETE** |
| **38S-4** | Proof execution | [38S-4](observations/38S-4-proof-execution.md) | **COMPLETE** — **Partial success (B)** |
| **38S-5** | Evaluation and recommendation | [38S-5](observations/38S-5-evaluation-and-recommendation.md) | **COMPLETE** |
| **38S-6** | Closure | [38S-6](observations/38S-6-sprint-closure.md) | **COMPLETE** (harness) |
| **Phase 2** | Prompt sanitisation + manual workflow | [phase-2/](phase-2/README.md) | **IN PROGRESS** |

---

## Success criteria (38S-6 closure)

| ID | Criterion |
|----|-----------|
| **SC-1** | Episode Plan V1 integrated |
| **SC-2** | Plan-before-populate gate implemented |
| **SC-3** | `instructional_function` tagging implemented |
| **SC-4** | P1–P10 enforced |
| **SC-5** | AC-01–AC-10 enforced |
| **SC-6** | Claims A–E evaluated |
| **SC-7** | `fullOk` remains true |
| **SC-8** | 58/58 suite preserved |
| **SC-9** | Implementation recommendation produced |

---

## Hard constraints

| Hold | Source |
|------|--------|
| **V1 frozen** | [38R-6](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) |
| **No schema expansion** | Any V1 change requires future design sprint |
| **No learner-state / transition graph / branching / orchestration** | [38R-5](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md) |
| **No prompt-accretion primary strategy** | [38Q-5 M-7](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **Preserve 38M–38P path** | [38Q-5 M-2](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **`fullOk` regression floor** | EV-38P-AFTER · [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) |

---

## Authoritative inputs (read-only)

| Input | Location |
|-------|----------|
| V1 schema | [38R-1](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md) |
| A1–A4 reference plans | [38R-2](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) |
| Mapping contract | [38R-3](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) |
| Proof framework | [38R-4](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) |
| Implementation constraints IC-1–IC-12 | [38R-5](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-5-implementation-recommendation.md) |
| Handoff package | [38R-6 §Task 10](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-6-sprint-closure.md) |

---

Open with **38S-1**. Cite [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md).
