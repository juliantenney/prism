# Sprint 38-R — Instructional Episode Plan Design Proof

**Pack path:** `docs/development/sprints/2026-06-06-sprint-38r-instructional-episode-plan-design-proof/`  
**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Closure:** [38R-6](observations/38R-6-sprint-closure.md)  
**Predecessor:** [Sprint 38-Q](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/) (**CLOSED** — [38Q-6](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md) · **SUCCESS**)  
**Successor:** [Sprint 38-S — Episode Plan V1 Implementation](../2026-06-06-sprint-38s-episode-plan-v1-implementation/) (**CHARTERED**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Programme framing

```text
38Q discovered the missing planning abstraction.
38R proved the smallest viable form of that abstraction.
```

**38Q answered:** Episode planning is required — Option F Hybrid.  
**38R proved:** Episode Plan V1 = `archetype` + ordered `function` beats — nothing more.

---

## Sprint outcome

| Field | Value |
|-------|-------|
| **Verdict** | **CLOSED — SUCCESS** |
| **SC-1–SC-8** | **ALL PASS** |
| **V1 schema** | **Frozen** |
| **Recommendation** | **Proceed with constraints** |
| **Unproven** | Runtime G3/G5 reduction; `fullOk` on plan-driven replay |

---

## Frozen architecture

```text
LO → Episode Plan V1 → DLA → GAM → Page
```

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

Beat order is pedagogically authoritative.

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38R-1** | Minimum viable Episode Plan | [38R-1](observations/38R-1-minimum-viable-episode-plan.md) | **COMPLETE** |
| **38R-2** | Archetype fit test (A1–A4) | [38R-2](observations/38R-2-archetype-fit-test.md) | **COMPLETE** |
| **38R-3** | Plan-to-DLA mapping | [38R-3](observations/38R-3-plan-to-dla-mapping.md) | **COMPLETE** |
| **38R-4** | Proof and validation design | [38R-4](observations/38R-4-proof-validation-design.md) | **COMPLETE** |
| **38R-5** | Implementation recommendation | [38R-5](observations/38R-5-implementation-recommendation.md) | **COMPLETE** |
| **38R-6** | Closure | [38R-6](observations/38R-6-sprint-closure.md) | **COMPLETE** |

---

## Success criteria (final)

| ID | Criterion | Status |
|----|-----------|--------|
| **SC-1** | Minimum viable Episode Plan schema defined | **PASS** |
| **SC-2** | Schema expresses all five transition families | **PASS** |
| **SC-3** | Schema expresses A1–A4 target episode structures | **PASS** |
| **SC-4** | Plan-to-DLA mapping specified at design level | **PASS** |
| **SC-5** | Fidelity preservation strategy documented | **PASS** |
| **SC-6** | G3/G5 reduction proof approach defined | **PASS** |
| **SC-7** | Prompt accretion explicitly avoided | **PASS** |
| **SC-8** | Implementation recommendation made | **PASS** |

---

## Hold conditions (historical)

Design-proof sprint — no code; no 38M–38P reopen; `fullOk` floor preserved in specification.

---

## What next

**[Sprint 38-S — Episode Plan V1 Implementation](../2026-06-06-sprint-38s-episode-plan-v1-implementation/)** — **CHARTERED**. Start [38S-1](../2026-06-06-sprint-38s-episode-plan-v1-implementation/observations/38S-1-episode-plan-v1-integration.md).
