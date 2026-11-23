# Sprint 103 — Implementation map

**Status:** **CLOSED — COMPLETE — ACCEPTED WITH DOCUMENTED QUALIFICATIONS**  
**Charter:** [SPRINT-103-CHARTER.md](SPRINT-103-CHARTER.md)  
**Opening:** [S103-D02](decisions.md#s103-d02--open-sprint-103--learning-journey-runtime-continuity-and-commissioning-fidelity)  
**Manual pack:** [MANUAL-JOURNEY-BRIEF-AND-CHECKLIST.md](MANUAL-JOURNEY-BRIEF-AND-CHECKLIST.md)

---

## Milestone posture

```text
103A  Bounded investigation / evidence map / continuity boundary     COMPLETE
103B  Commissioning fidelity verification + targeted corrections     COMPLETE
103C  Journal / runtime round-trip (all four products)               COMPLETE (manual clinical journey)
103D  Cross-component actual-response continuity                     COMPLETE (manual clinical journey)
103E  Product-family alignment (S103-D01 commissioning)              COMPLETE
103F  Validation ledger + qualified close                            COMPLETE (S103-D03)
```

---

## Milestones

| ID | Milestone | Workstreams | State |
| -- | --------- | ----------- | ----- |
| **103A** | Map contracts and evidence; define observable acceptance probes; identify smallest runtime continuity experiment | A–D (plan) | **Complete** |
| **103B** | Commissioning fidelity checks; targeted handoff corrections | A | **Complete** |
| **103C** | Capture → persist → restore → journal/shell for four products | B | **Complete** (manual *Judging Evidence in Clinical Decisions*) |
| **103D** | Cross-component actual-response continuity (auto wiring + live probe) | C | **Complete** (wiring + manual continuity) |
| **103E** | Align new-LJ commissioning with four-product family; protect standalone Interactive | D | **Complete** |
| **103F** | Validation evidence complete; residual debt recorded; qualified close | All | **Complete** — [S103-D03](decisions.md#s103-d03--close-sprint-103--complete-accepted-with-documented-qualifications) |

---

## Acceptance criteria (observable)

### Workstream A — Commissioning fidelity

1. New LJ commissions use Expository / Practice / Assessment Pack / Situated Task — not Interactive.  
2. Commission handoff preserves journey-owned and component-specific outcomes where Sprint 102 markers are present.  
3. Product-specific purpose, activity/interaction opportunities, shared sources, and journal/evidence opportunities are visible in the commission brief / intake for each product type exercised.  
4. Defects are logged as confirmed defects vs enhancement proposals; no wholesale prompt rewrite.

### Workstream B — Journal and runtime round-tripping

For **each** of Expository, Practice, Assessment Pack, Situated Task (where a runnable constituent exists):

1. Learner work is **captured** in the component.  
2. Work is associated with the correct component and journal/evidence identifier.  
3. Work **persists** across in-journey navigation and browser reload.  
4. Work **restores** when the learner returns.  
5. Work is **surfaced** correctly in the unified Learning Journey (journal and/or constituent).  

**Hard rule:** Authoring success ≠ rendering success ≠ runtime persistence. Evidence must name which layer was proven.

### Workstream C — Cross-component continuity

1. A concrete test path (e.g. Practice initial judgement → Expository → later Practice/AP revisit) is executed with **actual** learner input.  
2. Evidence distinguishes: design-time shared context; journal visibility; runtime retrieval of earlier response; response-aware subsequent activity.  
3. If runtime response-aware behaviour is unsupported, the precise boundary is documented and the smallest viable approach proposed — **no** automatic adaptive/branching architecture.

### Workstream D — Product-family alignment

1. Learning Journey creation/commissioning reflects S103-D01 four-product family for **new** journeys.  
2. Standalone Interactive Create and existing Interactive LJ commissions remain intact.  
3. No new product types introduced.

---

## Evidence classification (use in VALIDATION.md)

| Class | Meaning |
| ----- | ------- |
| **S102 demonstrated** | Proven in Sprint 102 (design and/or Interactive/Practice journal paths as recorded) |
| **Needs runtime verify** | Claimed or authored but not proven with actual learner round-trip |
| **Confirmed defect** | Observable failure under a defined probe |
| **Enhancement proposal** | Gap beyond minimal continuity; out of sprint unless separately authorised |

---

## Non-goals until separately authorised

- Application implementation (post-103A)  
- Broad repository test suites as a substitute for learner-work probes  
- Exclusions listed in the charter  
