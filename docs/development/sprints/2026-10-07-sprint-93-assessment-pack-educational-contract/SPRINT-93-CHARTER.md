# Sprint 93 — Charter

**Sprint:** 93 — Assessment Pack Educational Contract  
**Status:** **OPEN**  
**Opened:** 2026-10-07  
**Type:** Product discovery → educational architecture (no implementation until later gates)  
**Predecessor:** [Sprint 92 — COMPLETE / CLOSED](../2026-10-07-sprint-92-situated-learning-activity-first-class-product/SPRINT-92-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-017--assessment-pack-first-class-product-revisit)  
**Opening:** [S93-D01](decisions.md#s93-d01--open-sprint-93--assessment-pack-educational-contract)  
**Design map:** [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md)  
**Start here:** [SPRINT-93-START-HERE.md](SPRINT-93-START-HERE.md)

---

## Objective

Re-elicit the **educational contract** for Assessment Pack as a first-class PRISM product using the evidence-led method proven in Sprint 92.

Assessment Pack already exists and can produce useful low-stakes multiple-choice / closed-form checks with feedback. That capability is **valid but incomplete as a product definition**. This sprint must discover the broader educational responsibility before deciding what (if anything) must change.

Treat the current implementation as:

- evidence of current capability;
- a source of compatibility / migration constraints;
- reusable components where still useful;

**not** as the specification of what the mature Assessment Pack must be.

---

## Hard invariant — NON-SUMMATIVE

**Assessment Pack in PRISM is NON-SUMMATIVE.** PRISM is not going anywhere near summative assessment.

Out of scope (do not investigate later support):

- summative assessment; grading and marks; pass/fail; certification; formal progression decisions;
- high-stakes assessment; formal marking / moderation; gradebooks; proctoring;
- plagiarism / academic-integrity enforcement; institutional assessment-management workflows.

---

## Primary product question

> What must Assessment Pack be able to do to fulfil its educational responsibility at meaningful stopping points within substantial Learning Journeys, and where should that responsibility stop?

**Working hypothesis (to investigate, not yet a definition):**

Assessment Pack may provide deliberate stopping points at which the Learning Journey needs to **elicit** something from the learner and do something **educationally useful** with that elicitation.

---

## Method

Use **Learning Journey as the evidence generator** (same pattern as Situated Task discovery):

1. Design a small number of deliberately contrasting, substantial Learning Journeys.
2. Observe where assessment-shaped experiences arise, why, what they elicit, what happens after, and what Assessment Pack must own vs sibling products.
3. Unsupported or awkward commissions are **evidence**, not automatic defects.
4. Derive purpose → boundary → learner contract → authoring responsibilities → invariants → pipeline → artefact — only then implementation.

Do **not** design Assessment Pack from hypothetical feature lists where Learning Journey evidence can answer the question.

### Exploring varied stopping points

Evidence should allow assessment-shaped experiences near the beginning, after conceptual development, mid-sequence, after Interactive / Expository / Situated Task, before more demanding work, near the end, and during consolidation/reflection. Do **not** assume Assessment Pack always belongs at the end.

### Role vs item form

Explicitly investigate **educational role** vs **response / item form**. Familiar formats (MCQ, short answer, essay) are not assumed to be the primary architecture.

### After elicitation

Pay particular attention to what happens after the learner responds: deterministic checking, making a position explicit, model/criteria comparison, self-review, preservation without automatic judgement, etc. Do **not** assume PRISM should automatically judge free-text.

### Cross-product boundaries

Pressure-test against Expository, Interactive, Situated Task, and Learning Journey. Need a discriminator at least as useful as Sprint 92 centre-of-gravity tests. Investigate Assessment Pack vs Interactive; vs Situated Task; assessment-shaped reflection vs reflection inside another product; production for learning vs production for checking.

### Educational handoffs (from Sprint 92)

Constituents may have explicit educational dependencies **without** learner-state interoperability. Distinguish educational handoff from runtime learner-state transport. Do not introduce cross-product learner-state persistence unless later evidence shows an unavoidable requirement.

---

## Exploratory role examples (NOT a taxonomy)

pre-test / diagnostic; prior-knowledge elicitation; opinion; confidence; prediction; misconception exposure; knowledge / conceptual check-in; readiness; short questions; short constructed responses; explanation / reasoning; application; critique; model-answer comparison; self-review against criteria; essay / extended response; reflection; synthesis.

Do **not** turn this list into schema enums, product modes, pipeline stages, UI controls, or implementation requirements.

---

## Explicit non-decisions at open

Do **not** currently decide: final Assessment Pack definition; final pipeline; taxonomy of assessment types; supported response types; feedback modes; essay/model-answer policy; AI feedback on free text; learner-response persistence; new schemas; new widgets; new rendering/publishing behaviour.

Those are outputs of discovery, not inputs.

---

## Exit posture (later)

Implementation (Gate 10) only for capabilities justified by preceding evidence. Live acceptance required before close. No successor opened by this charter alone.

---

## Related

- [PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-017--assessment-pack-first-class-product-revisit)
- Near-term calibration of *current* pack (narrower): [Assessment Pack real-use calibration](../../../backlog/PRODUCT-BACKLOG.md#assessment-pack-real-use-calibration-sprint-88-remainder)
- Sprint 88 architecture: [SPRINT-88-CLOSURE.md](../2026-09-28-sprint-88-default-product-workflows-and-assessment-architecture/SPRINT-88-CLOSURE.md)
- Sprint 92 method precedent: [SPRINT-92-CLOSURE.md](../2026-10-07-sprint-92-situated-learning-activity-first-class-product/SPRINT-92-CLOSURE.md)
