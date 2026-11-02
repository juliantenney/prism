# Sprint 94 — Charter

**Sprint:** 94 — Learning Journey Continuity  
**Status:** **OPEN** — WP0–WP5 complete; WP6 ready; not started  
**Opened:** 2026-11-02  
**Type:** Bounded implementation  
**Predecessor:** [Sprint 93 — CLOSED — ACCEPTED](../2026-10-07-sprint-93-assessment-pack-educational-contract/SPRINT-93-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-022](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-022--learning-journey-continuity-contract)  
**Opening:** [S94-D01](decisions.md#s94-d01--open-sprint-94--learning-journey-continuity)  
**Contract:** [S94-D02](decisions.md#s94-d02--retain-existing-commission-fields-p-1) … [S94-D06](decisions.md#s94-d06--author-only-inspectability-p-5) accepted  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Start here:** [SPRINT-94-START-HERE.md](SPRINT-94-START-HERE.md)

---

## Mission

Make independently generated Learning Journey components form coherent educational experiences by turning continuity into an authoritative commissioning contract.

Each constituent product remains standalone. Later components must receive enough information to understand:

- which relevant components came before;
- what those components asked learners to do;
- which scenarios, facts, options, and terminology must remain consistent where continuity requires them;
- how learners should refer back to their own earlier work;
- what educational contribution the current component makes to the journey.

Later components may introduce new evidence or developments. They must not contradict the established scenario where one exists.

---

## Programme context

Sprint 93 is closed. PRISM is in the alpha-use period, progressing toward beta, with a conference demonstration on **1–2 December 2026**. Several short focused sprints are expected before that milestone. This sprint is the immediate Learning Journey coherence slice.

Learning Journey home-page improvements (editorial imagery, optional introductory video, learner-facing styling) are complete and accepted. They are **not** this sprint.

---

## Established findings (do not re-investigate)

- Commissions already contain `specification_text`, `journey_context_text`, and `dependencies`.
- Continuity fields are optional and can be lost or weakened between Step 4 commissioning prose and Step 5 Design Page.
- Situated Task already treats commissioning context as binding via `composeSituatedTaskOriginalBrief` and Stage 1–2 prompts.
- Interactive, Expository, and Assessment Pack do not consistently receive or honour that context in live first-stage prompts.
- Interactive V1's forced activity structure and transfer exercises are a separate architectural issue ([PB-FA-019](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-019--interactive-v2-educational-and-architectural-discovery)).

---

## Architectural invariants (preserve)

1. Learning Journey commissions; product workflows design.  
2. Constituents are ordinary first-class workflows with provenance (`sourceWorkflowId` / `sourceCommissionId`).  
3. Shared intake remains `commissionToIntakeEnvelope` → `intakeCommission` → `applyAcceptedCommissionIntake`.  
4. Educational handoff is not learner-state interoperability (Sprint 92 / Sprint 93 Gate 4).  
5. Recurring scenario is optional. The contract distinguishes established facts, a deliberate no-recurring-scenario journey, and omitted required continuity.  
6. Commissioning Preview remains an authoring interface, not the published learner home.  
7. ZIP assembly and Journey Home publication remain unchanged except where inspectability of commissioning metadata is author-facing only.  
8. Continuity uses existing `specification_text` / `journey_context_text` / `dependencies` unless implementation later proves those fields insufficient.

---

## Scope

1. **Shared continuity contract** — preserve required scenario facts; allow legitimate educational progression; do not force a recurring scenario on every journey.  
2. **Preceding-activity context** — earlier components and their learner tasks; what to bring forward; never imply access to earlier published outputs or individual responses.  
3. **Reliable commissioning handoff** — survive planning, Design Page, and product intake; become authoritative in relevant generation prompts from the earliest content-generating stage; reuse the Situated Task pattern.  
4. **Validation and visibility** — required information must not disappear silently; validation checks meaningful context; authors inspect the contract through existing conventions; no new schema unless the existing fields prove insufficient.  
5. **Verification** — *Making Decisions Under Uncertainty* regression; standalone products unaffected.

---

## Stopping condition

Sprint 94 may close when the acceptance criteria in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) are met, focused validation is recorded in [VALIDATION.md](VALIDATION.md), remaining issues are in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md), and a closure record is written. Closure is **not** authorised by this charter alone.

---

## Explicitly outside Sprint 94

- Interactive V2 / PB-FA-019  
- Cross-component learner-response sharing  
- Unified Learning Journey runtime  
- Learning Journey home-page redesign  
- Narrated slideshow product  
- General graphics-to-embed media substitution  
- Unrelated Assessment Pack calibration or publishing fixes  
- Jazz thirteen-product assembly  
- Course Home / programme assembly
