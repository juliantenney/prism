# Sprint 59 — Decision Records

**Updated:** 2026-07-15

---

## S59-D01 — Remain in Sprint 59 (no Sprint 60)

**Decision:** Continue Instructional Archetype Framework work inside Sprint 59. Do not create a Sprint 60 folder from this investigation alone.

**Rationale:** Investigation is continuous from richness audit → depth iterations → archetype root-cause. Splitting mid-stream would fragment evidence and handoff.

**Date:** 2026-07-14

---

## S59-D02 — Primary explanation is archetype support asymmetry

**Decision:** Accept instructional-archetype support differences as the **primary** explanation of quality variation (heteroscedasticity vs enzymes). Accept domain exemplar bias as **secondary**. Reject biology-specific routing / domain GAM path divergence (no evidence).

**Evidence:** [instructional-archetype-audit.md](instructional-archetype-audit.md)

**Date:** 2026-07-14

---

## S59-D03 — Material Type ≠ Instructional Archetype

**Decision:** Treat material type as presentation format and instructional archetype as pedagogical function. Contracts and backlog must address both, but must not conflate them.

**Implications:** Improving only `text` / `worked_example` wording without archetype packages will under-serve mechanism and process teaching.

**Date:** 2026-07-14

---

## S59-D04 — Priority 1 teaching archetypes

**Decision:** Start framework implementation with:

1. `mechanism_explanation`  
2. `process_walkthrough`  
3. `mental_model_building`  

Priority 2: `concept_exposition`, `recommendation`, `modelling_note` instructional contracts.

**Date:** 2026-07-14

---

## S59-D05 — Preserve Evaluate / diagnostic strength

**Decision:** Do not weaken SP-02..07, Evaluate PRES density, verification, or transfer support while adding teaching archetypes. Retain Iterations 4–7 anti-gaming and anti-exemplar-leakage rules.

**Date:** 2026-07-14

---

## S59-D06 — Scope evolution (prompts allowed after first audit)

**Decision:** Original diagnostic non-goal (“no prompt changes”) is superseded for **approved** Sprint 59 Iterations 1–7 and for subsequent archetype-package work. Renderer redesign and Sprint 58 architecture reopen remain out of scope.

**Date:** 2026-07-14

---

## S59-D07 — Soft validators until packages defined

**Decision:** Do not ship hard body↔mechanism capture validators until archetype packages define purpose, components, criteria, and validation strategy.

**Date:** 2026-07-14

---

## S59-D08 — GAM Copy recognition context must be unified

**Decision:** Treat `buildWorkflowStepRecognitionContext(...)` as the canonical step recognition shape for GAM recognition, instructional-archetype routing injection, and final-prompt snapshot publication. Do not pass raw workflow step rows (`title` / `canonical_step_id`) into gates that expect shaped fields (`stepTitle` / `stepCanonicalStepId`) without normalisation.

**Rationale:** Process transfer appeared to fail while the V2 GAM brief reached the clipboard without `LD-INSTRUCTIONAL-ARCHETYPE-ROUTING`. Root cause was outer gate true / inner gate false — not the process rule text. Earlier negative process runs that lacked routing in the Copy prompt are **invalid tests** of rule quality.

**Evidence:** Live Copy snapshots after fix; `lib/workflow-step-recognition-context.js`; tests in `tests/ld-instructional-archetype-gam-copy-context.test.js`.

**Date:** 2026-07-15

---

## S59-D09 — Mechanism and process MVP transfer accepted; mental model next

**Decision:** Accept Priority-1 MVP transfer as **PASS** for `mechanism_explanation` and `process_walkthrough` (rule version `20260715-4`). Treat `mental_model_building` transfer as **NOT STARTED**. Keep fuller purpose…validation packages open for all Priority-1 IDs.

**Date:** 2026-07-15

---

## S59-D10 — Do not rewrite process rule v20260715-4 without new evidence

**Decision:** Freeze process rule text at script version `20260715-4` unless a genuine post-delivery realisation failure is observed with routing confirmed present in `__PRISM_S59_FINAL_GAM_PROMPT.prompt`.

**Date:** 2026-07-15
