# Sprint 101 — Charter

**Sprint:** 101 — Practice as a Learning Journey Component  
**Status:** **CLOSED — ACCEPTED WITH QUALIFICATIONS**  
**Opened:** 2026-11-19  
**Closed:** 2026-11-20  
**Type:** Component architecture / instructional product design  
**Opening:** [S101-D01](decisions.md#s101-d01--open-sprint-101--practice-as-a-learning-journey-component)  
**Close:** [S101-D06](decisions.md#s101-d06--close-sprint-101--accepted-with-qualifications) · [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Problem statement

PRISM supports standalone Interactive resources and composite Learning Journeys. Learning Journeys are becoming the primary instructional design product. Interactive remains valuable as a standalone self-study/workshop resource, but commissioning full Interactive resources inside new journeys tends to carry more orientation furniture, knowledge-summary ceremony, and repeated instructional prose than a journey-embedded practice component needs.

A leaner **Practice** component is required: activity-focused, able to inherit instructional context from its LJ commission, and able to reuse Interactive’s proven activity, feedback and rendering machinery without destabilising standalone Interactive or existing journeys.

---

## Sprint objective

Establish Practice as the activity-oriented Learning Journey component — via investigation, instructional contract, wireframe approval, then implementation — while preserving standalone Interactive and all existing Learning Journeys that commission Interactive.

---

## Agreed product decisions (locked at opening)

1. Learning Journeys are PRISM’s primary instructional design product.  
2. Standalone Interactive remains available and must not be disturbed.  
3. Practice replaces Interactive as the activity-oriented component commissioned within **new** Learning Journeys.  
4. Practice is a leaner, activity-focused adaptation of Interactive; reuse generation/activity/feedback/rendering machinery where practical.  
5. Practice should inherit more explicit instructional context from its LJ commission.  
6. Explanation is included only when needed to support activities; reduce introductory prose, knowledge summaries, activity preambles and repeated context where they do not serve a clear instructional purpose.  
7. Generate Learning Content → Model Knowledge → Define Learning Outcomes remains intact this sprint.  
8. Wider pipeline efficiency and the future role of standalone component types are deferred.

---

## Planned phases

| Phase | Intent | State |
| ----- | ------ | ----- |
| **101A** | Architectural investigation (read-only) | **COMPLETE** |
| **101B** | Practice instructional contract | **ACCEPTED** (refined by 101C-3) |
| **101C** | Learner-facing wireframe and worked example | **ACCEPTED** as design foundation |
| **101C-3** | Technical capability audit / implementation readiness | **ACCEPTED** |
| **101D** | Implementation | **COMPLETE** |
| **101E** | Validation (selection, persistence, progressive design, export) | **COMPLETE** |
| **101F** | Practice workload proportion | **COMPLETE** |
| **101G** | Commission-native feasibility (read-only) | **COMPLETE** — not implemented |
| **101H** | Image-brief precision / completeness | **COMPLETE** |

---

## Guardrails

- Existing Learning Journeys and Interactive resources must remain valid.  
- No silent schema breakage for `product_id: "interactive"`.  
- No redesign of GLC / MK / DLO this sprint.  
- No changes to `prism-exemplars` unless separately authorised.  
- Do not choose an implementation approach solely because it requires the fewest initial edits.  
- Documentation-first for 101A–101C; implementation only after design approval.

---

## Non-goals (this sprint)

- Removing or deprecating standalone Interactive  
- Migrating all existing LJ Interactive commissions to Practice automatically  
- Redesigning Expository, Assessment Pack or Situated Task pipelines  
- Broader “component economy” / pipeline efficiency programme  
- Empirically measuring Practice completion times  
- Committing or pushing without explicit author request
