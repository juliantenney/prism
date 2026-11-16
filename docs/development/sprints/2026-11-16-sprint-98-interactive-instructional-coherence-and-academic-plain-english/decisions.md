# Sprint 98 — Decisions

## S98-D01 — Open Sprint 98 — Interactive Instructional Coherence and Academic Plain English

**Date:** 2026-11-16  
**Status:** Accepted  
**Depends on:** [Sprint 97 CLOSED — ACCEPTED](../2026-11-12-sprint-97-learning-journal-and-design-pattern-foundations/SPRINT-97-CLOSURE.md) (qualified)  
**Baseline HEAD:** `54774cde3810bea1f666b2456c6edff4bb6181ee`  
**Numbering authority:** [docs/sprints/NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) (no open sprint; last closed = 97 → allocate **98**)

**Decision:** Open **Sprint 98 — Interactive Instructional Coherence and Academic Plain English** as a bounded, evidence-led Interactive instructional-quality sprint.

**Objective:** Improve clarity, economy and pedagogical coherence of standalone Interactive resources while preserving instructional completeness, disciplinary precision and intellectual challenge — starting from verified Design Page guidance and the *Why the constraint matters* case study.

**Authoritative basis:**

- Programme pointer showed **no open sprint**; Sprint 97 closed accepted (qualified).  
- Uncommitted Interactive guidance work already present in the working tree (Design Page page-synthesis roles; GAM Academic Plain English; commissioned-title preservation) required a documented baseline rather than silent continuation.  
- Author-reported instructional duplication in Overview / Learning purpose on the *Why the constraint matters* regeneration.

**Agreed principles locked by opening:** see [SPRINT-98-CHARTER.md](SPRINT-98-CHARTER.md).

**Not authorised by opening alone:**

- M2 regeneration or prose-quality claims about the new Design Page guidance;  
- M3 cross-stage DLA / Learning Sequence / GAM / renderer changes;  
- fixing `s96-interactive-editorial-opening` figcaption mismatch;  
- broader product-route guidance changes;  
- Git commit / push;  
- reopening Sprint 96–97.

**First deliverable:** Documentation pack + [EVIDENCE-REGISTER.md](EVIDENCE-REGISTER.md) + verified file/test baseline (M1).

**Predecessor:** Sprint 97 remains **CLOSED — ACCEPTED** (qualified). Do not reopen.

---

## S98-D02 — Accept M1 — sprint opening, verification and evidence baseline

**Date:** 2026-11-16  
**Status:** Accepted (documentation + verification)  
**Depends on:** [S98-D01](#s98-d01--open-sprint-98--interactive-instructional-coherence-and-academic-plain-english)

**Decision:** Accept **M1** as complete for sprint-opening purposes.

**Delivered:**

- Sprint 98 portable pack and programme stub; NEXT-SPRINT updated to open Sprint 98.  
- Repository state recorded (branch `master`, HEAD `54774cd…`, uncommitted related Interactive work left intact).  
- Design Page guidance files and diffs verified; Interactive Design Page route confirmed to inject `LD-DESIGN-PAGE-PARTIAL-CONTRACT`.  
- Targeted / related tests run; `s96-interactive-editorial-opening` failure characterised as **pre-existing / independent** of the Design Page role-separation change.  
- Evidence register and milestone map established.

**Does not authorise M2.** Do not claim that the latest guidance has improved generated prose until a new output has been evaluated.

---

## S98-D03 — Provisionally accept M2 — educational improvement observed

**Date:** 2026-11-16  
**Status:** Accepted (provisional)  
**Depends on:** [S98-D02](#s98-d02--accept-m1--sprint-opening-verification-and-evidence-baseline)

**Decision:** Record **M2** as **provisionally accepted** on the regenerated *Why the constraint matters* learner package, based on educational comparison of page-synthesis fields — **not** as proof that Design Page guidance alone caused every observed improvement.

**Observed (regenerated learner HTML package):**

| Field | Assessment |
| ----- | ---------- |
| Overview | Improved orientation and practical instructions; less itinerary repetition |
| Learning purpose | Partially improved; some itinerary language remains; better distinguishes prediction, calculation and mathematical justification |
| Knowledge Summary | Improved instructional economy; preserves advance organisation, conceptual precision, methodological preparation and discovery protection |
| Title | Preserved: *Why the constraint matters* |
| Study tips | Potentially useful reinforcement; no defect established |
| Reading volume | Monitoring only (~7.3k approximate HTML words in this package) |

**Explicit limits:**

- Effective Design Page prompt was not supplied → newly authored vs transported provenance for Overview / Purpose / KS remains **unverified**.  
- Do **not** attribute every improvement solely to the Design Page role-separation guidance.  
- M2 provisional acceptance **authorises bounded M3 investigation** of Learning Sequence intentions vs rendered order; it does **not** authorise code, prompt, schema, assembly or renderer changes.

---

## S98-D04 — Accept M3 investigation findings (read-only) — architectural gap, no automatic learner-facing defect

**Date:** 2026-11-16  
**Status:** Accepted (investigation)  
**Depends on:** [S98-D03](#s98-d03--provisionally-accept-m2--educational-improvement-observed)

**Decision:** Accept the bounded M3 read-only investigation of Learning Sequence study-flow intentions versus Interactive assembly/render behaviour.

**Confirmed:**

1. Three surfaces: prompt `learner_study_flow`; authored `learning_sequence.timeline[].learner_study_flow` (step/action/material_ids/disclosure) on this assembled page; optional top-level `study_flow` (phase labels) — **absent** here.  
2. Assembly copies `learning_sequence` wholesale (so timeline study flows survive in JSON) and projects timeline durations; it does **not** execute study-flow steps for materials/moments.  
3. Renderer does **not** read `timeline[].learner_study_flow`. Top-level `study_flow`, if present, is Orient framing only.  
4. Within-activity order is fixed: Orient → Learn → Do → Check → Transfer.  
5. Worked answers (A2-M4, A3-M3, A4-M5) are Check-deferred with voluntary closed disclosure — not attempt-gated.  
6. Renderer has no pedagogy taxonomy matching LS `disclosure` values (`optional_scaffold`, `conceptual_scaffold`, …).

**Pedagogical implication:** Destination-answer withholding can succeed via material types while LS step order for scaffolds is ignored.

**Case-study implication (refined with JSON):** A3 is a **genuine presentation mismatch** (A3-M1 before intended A3-M2 first attempt). A1/A2 milder mismatches. Complete worked-answer spoiling not established. Architectural non-executability of LS study-flow remains; not a mandate for gates/redesign.

**Amendment (same day):** Author-supplied Design Page + assembled JSON closed S98-E11 shape; confirmed DP `page_synthesis` passthrough to assembly; see [evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md](evidence/M2-PAGE-SYNTHESIS-AND-LS-SUMMARY.md).

**Not authorised:** code/prompt/schema/renderer changes; mandatory interaction gates; moving Knowledge Summary; fixing S98-E07 figcaption; commit/push.

---

## S98-D05 — Close Sprint 98 — ACCEPTED — QUALIFIED

**Date:** 2026-11-16  
**Status:** Accepted  
**Depends on:** [S98-D02](#s98-d02--accept-m1--sprint-opening-verification-and-evidence-baseline) · [S98-D03](#s98-d03--provisionally-accept-m2--educational-improvement-observed) · [S98-D04](#s98-d04--accept-m3-investigation-findings-read-only--architectural-gap-no-automatic-learner-facing-defect)  
**Closure:** [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md)

**Decision:** Close **Sprint 98 — Interactive Instructional Coherence and Academic Plain English** as **ACCEPTED — QUALIFIED**.

**Milestone outcomes at close:**

| Milestone | Outcome |
| --------- | ------- |
| M1 | **Complete** |
| M2 | **Provisionally accepted** on observed educational improvement (DP-alone causation not claimed; provenance unverified) |
| M3 | **Investigation complete** (architectural / presentation limitation recorded; no automatic answer-spoiling defect) |
| M4 | **Complete** — consolidation + verification |

**Qualification grounds:** provisional M2 causation/provenance limits; non-executable LS study-flow / A3 scaffold mismatch as future consideration only; reading-volume monitoring-only; independent figcaption debt unrepaired; uncommitted guidance tree not committed by this close.

**Explicit future considerations (not authorised implementation):**

1. Authored Learning Sequence intentions versus rendered activity order.  
2. Optional scaffold presentation and learner control.  
3. Distinguishing required reading from optional, hidden and feedback content when evaluating duration.  
4. Design Page authorship/transport provenance.  
5. Residual Overview / Learning purpose overlap.

**Verification:** M4 suite **67 pass / 1 fail** (known S98-E07 figcaption). No new regressions in Sprint 98 guidance suites.

**Does not reopen** Sprint 97. Does **not** authorise commit/push, prompt/assembly/renderer changes, regeneration, or opening a successor sprint.

---

## S98-D06 — Reopen Sprint 98 for M5 instructional sequencing resolution

**Date:** 2026-11-16  
**Status:** Accepted  
**Depends on:** [S98-D05](decisions.md#s98-d05--close-sprint-98--accepted--qualified) (historical close retained) · [S98-D04](#s98-d04--accept-m3-investigation-findings-read-only--architectural-gap-no-automatic-learner-facing-defect)  
**Options:** [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md)

**Decision:** Explicitly **reopen Sprint 98 — Interactive Instructional Coherence and Academic Plain English** for **M5 — Instructional sequencing resolution**. The prior M4 close ([S98-D05](#s98-d05--close-sprint-98--accepted--qualified) / [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md)) is **preserved as history** and marked superseded for operational status — not silently overwritten.

**Reason:** Confirmed instructional sequencing discrepancy (authored `timeline[].learner_study_flow` vs rendered Learn→Do presentation, especially A3) remained unexamined for a possible **targeted** correction. M4 closure was premature relative to that programme need.

**Preserved:** M1 complete; M2 provisionally accepted; M3 investigation complete; M4 verification/consolidation evidence and test results (67 pass / 1 known fail).

**Now open:** M5 — recommend-then-authorise a narrow correction; **implementation not authorised by this reopen alone**.

**Recommended direction (pending separate implementation authorisation):** Option C in [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md) — material-level collapsed presentation for scaffolds whose first LS disclosure is `optional_scaffold` | `conceptual_scaffold` after an attempt step; optional Option B fallback via `practice_independence`. Do **not** invert global Learn/Do. A1 dual-use material residual accepted unless separately authored.

**Still not authorised:** commit/push; regeneration; general sequencing engine; mandatory gates; other product types; Sprint 97 reopen.

---

## S98-D07 — Authorise and implement M5 Option C (bounded scaffold sequencing)

**Date:** 2026-11-16  
**Status:** Accepted (implementation complete; sprint not closed)  
**Depends on:** [S98-D06](#s98-d06--reopen-sprint-98-for-m5-instructional-sequencing-resolution) · [M5-SEQUENCING-OPTIONS.md](M5-SEQUENCING-OPTIONS.md)

**Decision:** Implement **Option C only** for Interactive resources: when `learning_sequence.timeline[].learner_study_flow` marks a material’s **first** disclosure as `optional_scaffold` or `conceptual_scaffold` after an earlier attempt disclosure (`initial_attempt` / `independent_*`) that omits that material, relocate it from open Learn into collapsed learner-controlled `<details>` associated with Do. Do **not** implement Option B (`practice_independence` fallback) — Option C reliably identifies A2 and A3 scaffolds via explicit material ids + disclosure allow-list.

**Behaviour preserved:** missing study-flow → unchanged; no global Learn/Do swap; no mandatory gates; Check deferral unchanged; Knowledge Summary before activities; Expository / Assessment Pack / Situated Task untouched; DLA / GAM / Design Page / authored LS unchanged.

**A1 residual (authoring/structural):** A1-M1 is dual-purpose (listed in `initial_attempt` and later conceptual support). Prediction-before-explanation cannot be fully realised by moving that single material. Do **not** split, rewrite or duplicate A1-M1 automatically. Recorded as [S98-AD-012](ARCHITECTURAL-DEBT.md).

**Still not authorised:** regenerate case resource; commit; push; close Sprint 98.

---

## S98-D08 — Global ban on discretionary inline emphasis in learner-facing prose

**Date:** 2026-11-16  
**Status:** Accepted (guidance implemented; sprint not closed)  
**Depends on:** Sprint 98 Academic Plain English programme · [S98-D07](#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing) (independent of M5 sequencing)

**Decision:** Continuous learner-facing explanatory prose must not use discretionary inline bold, italic or underline for emphasis. Importance and distinctions are conveyed through wording and structure. Legitimate structural/semantic formatting (headings, interface/response-field labels including template `**Label:**`, tables, maths, conventional title italics) remains permitted.

**Implementation:** Shared contract `LD-LEARNER-FACING-PROSE-TYPOGRAPHY` injected once before route branching in `applyWorkflowStepRuntimePromptAugmentations` (Interactive, Learning Journey, Expository, Assessment Pack, Situated Task) and into GAM V2 canonical assembler. Contradictory “ordinary inline emphasis remains valid” wording removed from GAM enrich + assembler briefs.

**Not done:** renderer stripping; schema/definitions changes; M5 sequencing changes; regen/commit/push/close.

---

## S98-D09 — Close Sprint 98 — ACCEPTED WITH QUALIFICATIONS

**Date:** 2026-11-16  
**Status:** Accepted  
**Depends on:** [S98-D07](#s98-d07--authorise-and-implement-m5-option-c-bounded-scaffold-sequencing) · [S98-D08](#s98-d08--global-ban-on-discretionary-inline-emphasis-in-learner-facing-prose) · [SPRINT-98-CLOSURE.md](SPRINT-98-CLOSURE.md)

**Decision:** Close **Sprint 98 — Interactive Instructional Coherence and Academic Plain English** as **CLOSED — ACCEPTED WITH QUALIFICATIONS**.

**Accepted:** Interactive APE improvements; three-activity case educational quality (current-output evidence); KS-before-activities; M5 Option C with focused regressions; S98-D08 global typography standard with multi-route / GAM V2 reach (40-test set green).

**Qualifications:** three- vs four-activity packages are not a controlled A/B; original M5 case unreproducible (accept on regressions); no full study-flow engine; residual Overview/Purpose overlap; current A3 guidance density is a design difference; S98-D08 not yet generation-validated; baseline failures (S98-E07, A5 compose) remain distinguished; Sprint 97 deferred items stay on Sprint 97 ledger.

**Does not claim** all sequencing or editorial issues eliminated.  
**Does not reopen** Sprint 97.  
**Does not authorise** commit/push of uncommitted trees as part of this close.  
**Successor:** Sprint 99 — Expository Instructional Quality and Academic Plain English.
