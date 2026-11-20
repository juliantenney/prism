# Sprint 101 — Decisions

## S101-D01 — Open Sprint 101 — Practice as a Learning Journey Component

**Date:** 2026-11-19  
**Status:** Accepted  
**Depends on:** [Sprint 100 CLOSED — ACCEPTED WITH QUALIFICATIONS](../2026-11-17-sprint-100-learner-workload-and-timing-realism/SPRINT-100-CLOSURE.md)

**Decision:** Open **Sprint 101 — Practice as a Learning Journey Component**.

**Objective:** Introduce Practice as the leaner activity-oriented Learning Journey component, reusing Interactive machinery where practical, without disturbing standalone Interactive or existing journeys that commission Interactive.

**Phases:** 101A (investigation — complete at documentation opening), 101B, 101C, 101D, 101E.

**Gates:** **101B and 101C require design review and approval before 101D implementation.**

**Locked product decisions:** see [SPRINT-101-CHARTER.md](SPRINT-101-CHARTER.md).

**Not authorised by opening alone:** Practice product registration; prompt/schema/renderer edits; GLC/MK/DLO redesign; exemplar regeneration; git commit/push; choosing an implementation approach solely for fewest edits.

**101A outcome recorded with opening:** read-only investigation complete; provisional recommendation Approach 2 (shared Interactive/Practice pipeline with type-specific gated contracts) — subject to 101B/101C review ([INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)).

---

## S101-D02 — Propose Practice instructional contract (101B)

**Date:** 2026-11-19  
**Status:** **Accepted** (design review, 2026-11-19)  
**Depends on:** [S101-D01](#s101-d01--open-sprint-101--practice-as-a-learning-journey-component); [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

**Decision:** Adopt the Practice instructional contract documented in [PRACTICE-INSTRUCTIONAL-CONTRACT.md](PRACTICE-INSTRUCTIONAL-CONTRACT.md) as the design baseline for 101C wireframing and subsequent implementation design.

**Contract highlights proposed for approval:**

1. Practice centre of gravity: capability via meaningful action, feedback and improvement inside a Learning Journey — not a self-contained teaching resource.  
2. Practice has its own product/workflow identity; **LJ-commissioned only in v1**; new journeys prefer Practice for activity-oriented components; existing Interactive LJ commissions remain valid; standalone Interactive unchanged.  
3. Learner-facing furniture classified required / optional / omitted (refined in 101C-3: retain instructional sophistication; drop mandatory Interactive ceremony).  
4. Commissioning uses existing fields with stronger `specification_text` / `journey_context_text` guidance; **no new commission JSON keys in v1** unless review finds prose insufficient.  
5. Internal GLC → MK → DLO retained; EP/DLA/GAM/LS/DP lean toward task-led Practice behaviour via **Practice-owned** contracts — not Interactive conditionals.  
6. 101A Approach 2 clarified: safe reuse of machinery + Practice-owned instructional behaviour; **not** an instruction to add context-sensitive branches throughout Interactive.

**Gates:** **101B accepted.** Later gates: 101C wireframe (accepted as foundation); 101C-3 technical audit (blocks 101D).

**Not authorised by 101B alone:** Application code, prompts, schemas, renderer, tests, product registration, exemplar changes, commit/push.

---

## S101-D03 — Propose Practice C2 learner-experience wireframe (101C)

**Date:** 2026-11-19  
**Status:** **Accepted** (design foundation; refined by 101C-3)  
**Depends on:** [S101-D02](#s101-d02--propose-practice-instructional-contract-101b) **Accepted**; C2 Interactive export `seeing-gradients-and-tangency.zip`

**Decision:** Accept the Practice learner-experience baseline demonstrated by:

- Prototype: [wireframe/practice-c2-seeing-gradients-and-tangency.html](wireframe/practice-c2-seeing-gradients-and-tangency.html)  
- Comparison / inspection: [WIREFRAME-C2-COMPARISON.md](WIREFRAME-C2-COMPARISON.md)

as an illustrative design reference for Practice — **not** a mandatory four-activity template.

**Wireframe commitments:**

1. Lean, task-led opening; no mandatory Overview / Learning purpose / Knowledge summary / LO list / Study tips ceremony.  
2. Retain essential mathematics and learning demands of the C2 case.  
3. Meaningful activities with response interactions, hints, feedback, and optional revision.  
4. Natural end returning to the Learning Journey.

**Refinement (101C-3):** Purposeful preambles, conceptual imagery, essential working knowledge, scaffolding, justified tables and revision remain available; presentation stays lighter than Interactive defaults.

**Not authorised by 101C alone:** 101D implementation.

---

## S101-D04 — Propose Practice technical capability audit (101C-3)

**Date:** 2026-11-19  
**Status:** **Accepted** (authorised 101D)  
**Depends on:** [S101-D02](#s101-d02--propose-practice-instructional-contract-101b); [S101-D03](#s101-d03--propose-practice-c2-learner-experience-wireframe-101c)

**Decision:** Accept [PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md](PRACTICE-TECHNICAL-CAPABILITY-AUDIT.md) as the implementation-readiness baseline for 101D, including:

1. Consolidated capability classes (required / optional / omitted / future).  
2. Capability-retention matrix across generation→renderer→package.  
3. Architecture: first-class `practice` product, own `promptRoute`, Practice-owned contracts, reuse of GLC…DP topology and shared runtime — without Interactive conditionals or silent fallbacks.  
4. Existing commission fields sufficient for v1.  
5. 101D slices D0–D5 prioritising a complete working path.  
6. 101E validation via a **new** Learning Journey; Lagrange baseline untouched.

**101D authorised and implemented** — see [101D-IMPLEMENTATION-REPORT.md](101D-IMPLEMENTATION-REPORT.md) and [S101-D05](#s101-d05--complete-practice-v1-implementation-101d).

---

## S101-D05 — Complete Practice v1 implementation (101D)

**Date:** 2026-11-19  
**Status:** **Accepted** (implementation complete; awaiting 101E)  
**Depends on:** [S101-D04](#s101-d04--propose-practice-technical-capability-audit-101c-3) **Accepted**

**Decision:** Record Sprint 101D Practice v1 as implemented per approved architecture:

1. First-class `practice` product with `promptRoute: "practice"`, `publishRoute: "learner_page"`, LJ-commissioned only.  
2. Reused GLC→MK→DLO→EP→DLA→GAM→LS→DP topology with Practice-owned presentation contracts.  
3. Explicit `pageKind: "practice"`; no Interactive promptRoute reuse; Interactive behaviour unchanged.  
4. Focused tests in `tests/s101-practice-*.test.js` plus Interactive intake/design-page regressions.

**Next:** 101E — new Learning Journey validation (not Lagrange retrofit).  
**Not done by this decision:** git commit/push (requires explicit author request).

---

## S101-D06 — Close Sprint 101 — Accepted with qualifications

**Date:** 2026-11-20  
**Status:** **Accepted**  
**Depends on:** [S101-D05](#s101-d05--complete-practice-v1-implementation-101d) **Accepted**; Practice work through 101H complete

**Decision:** Close Sprint 101 as **CLOSED — ACCEPTED WITH QUALIFICATIONS**.

Practice is established as an LJ-commissioned first-class product (identity, contracts, selection Do surfaces, workload gates, image-brief precision/completeness). Standalone Interactive / Expository / Assessment Pack isolation is preserved. Commission-native GLC/MK/DLO omission remains investigation-only (101G).

**Non-blocking follow-ups (do not reopen Sprint 101):**

1. C4 A3 — three linked judgements as three independent, clearly labelled radio questions.  
2. C4 A3 — shorter, more focused written justification; remove redundant closure text.  
3. Image precision extraction — remaining duplicated/malformed fragments (exact equations already preserved).  
4. C4 image — prompt contains all three authorised equations; corrected render not yet independently verified.  

**Next programme theme (not Sprint 101):** Learning Journey–owned outcomes and their transmission through component commissioning. Journey-level QA is a subsequent concern.

**Explicitly not done by this close:** regenerate components; further implementation; commit/push.

**Closure record:** [SPRINT-101-CLOSURE.md](SPRINT-101-CLOSURE.md).
