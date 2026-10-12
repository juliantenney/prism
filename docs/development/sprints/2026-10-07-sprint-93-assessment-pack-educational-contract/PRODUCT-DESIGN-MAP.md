# Sprint 93 — Product design map

**Status:** **CLOSED — ACCEPTED** — Gates 1–10 accepted  
**Sprint:** 93 — Assessment Pack Educational Contract  
**Charter:** [SPRINT-93-CHARTER.md](SPRINT-93-CHARTER.md)  
**Opening:** [S93-D01](decisions.md#s93-d01--open-sprint-93--assessment-pack-educational-contract)  
**Close:** [S93-D12](decisions.md#s93-d12--close-sprint-93--assessment-pack-accepted)

Evidence-first dependency: later gates must not invent educational decisions that earlier gates have not earned. Implementation is **last**.

---

## Hard invariant (all gates)

**NON-SUMMATIVE.** Assessment Pack in PRISM is non-summative. Summative / grading / certification / high-stakes / institutional assessment-management concerns are out of scope. See [SPRINT-93-START-HERE.md](SPRINT-93-START-HERE.md).

---

## Design / discovery gate checklist

| Gate | Topic | Status | Notes / artefact |
| ---- | ----- | ------ | ---------------- |
| 1 | Current Assessment Pack baseline | **COMPLETE / ACCEPTED** | [GATE-1-ASSESSMENT-PACK-BASELINE.md](GATE-1-ASSESSMENT-PACK-BASELINE.md) |
| 2 | Long-journey evidence | **COMPLETE / PASSED** | [GATE-2-LONG-JOURNEY-EVIDENCE.md](GATE-2-LONG-JOURNEY-EVIDENCE.md) · [GATE-2-EVIDENCE-LEDGER.md](GATE-2-EVIDENCE-LEDGER.md) · [S93-D03](decisions.md#s93-d03--gate-2-long-journey-evidence-complete--passed) |
| 3 | Educational roles | **COMPLETE / PASSED** | [GATE-3-ASSESSMENT-PACK-EDUCATIONAL-ROLES.md](GATE-3-ASSESSMENT-PACK-EDUCATIONAL-ROLES.md) · [S93-D04](decisions.md#s93-d04--gate-3-assessment-pack-educational-roles-complete--passed) — R1 state inspection · R2 capability-evidence elicitation |
| 4 | Product boundary | **COMPLETE / PASSED** | [GATE-4-ASSESSMENT-PACK-PRODUCT-BOUNDARY.md](GATE-4-ASSESSMENT-PACK-PRODUCT-BOUNDARY.md) · [S93-D05](decisions.md#s93-d05--gate-4-assessment-pack-product-boundary-complete--passed) |
| 5 | Learner contract | **COMPLETE / PASSED** | [GATE-5-ASSESSMENT-PACK-LEARNER-CONTRACT.md](GATE-5-ASSESSMENT-PACK-LEARNER-CONTRACT.md) · [S93-D06](decisions.md#s93-d06--gate-5-assessment-pack-learner-contract-complete--passed) |
| 6 | Authoring responsibilities | **COMPLETE / PASSED** | [GATE-6-ASSESSMENT-PACK-AUTHORING-RESPONSIBILITIES.md](GATE-6-ASSESSMENT-PACK-AUTHORING-RESPONSIBILITIES.md) · [S93-D07](decisions.md#s93-d07--gate-6-assessment-pack-authoring-responsibilities-complete--passed) — AR1–AR5 |
| 7 | Product invariants | **COMPLETE / PASSED** | [GATE-7-ASSESSMENT-PACK-PRODUCT-INVARIANTS.md](GATE-7-ASSESSMENT-PACK-PRODUCT-INVARIANTS.md) · [S93-D08](decisions.md#s93-d08--gate-7-assessment-pack-product-invariants-complete--passed) — AP-I1…I6 |
| 8 | Predetermined pipeline | **COMPLETE / PASSED** | [GATE-8-ASSESSMENT-PACK-PREDETERMINED-PIPELINE.md](GATE-8-ASSESSMENT-PACK-PREDETERMINED-PIPELINE.md) · [S93-D09](decisions.md#s93-d09--gate-8-assessment-pack-predetermined-pipeline-complete--passed) — Interpret → Design Elicitation → Author Formative Return → Design Page |
| 9 | Canonical structured artefact | **COMPLETE / PASSED** | [GATE-9-ASSESSMENT-PACK-CANONICAL-STRUCTURED-ARTEFACT.md](GATE-9-ASSESSMENT-PACK-CANONICAL-STRUCTURED-ARTEFACT.md) · [S93-D10](decisions.md#s93-d10--gate-9-assessment-pack-canonical-structured-artefact-complete--passed) — `assessment_evidence` |
| 10 | Implementation and live acceptance | **COMPLETE / ACCEPTED** | [SPRINT-93-CLOSURE.md](SPRINT-93-CLOSURE.md) — APTest1 and C13 |

**Rule:** Gates 1–10 are accepted. Do not reopen them. Sprint 93 is **CLOSED — ACCEPTED**.

**Pipeline:** Interpret Evidence Purpose → Design Evidence Elicitation → Author Formative Return → Design Page  
**Canonical object:** `assessment_evidence`

---

## Primary question (carried through all gates)

> What must Assessment Pack be able to do to fulfil its educational responsibility at meaningful stopping points within substantial Learning Journeys, and where should that responsibility stop?

**Gate 3 role model (educational architecture — not schema):** Assessment Pack creates a deliberate progression stopping point whose centre of gravity is eliciting interpretable evidence about the learner and using it formatively — **R1** formative state inspection · **R2** formative capability-evidence elicitation. Response form and formative treatment remain separate dimensions.

---

## Sibling centre-of-gravity (starting distinctions — under investigation for Assessment)

| Product | Principal learning vehicle (current accepted) |
| ------- | ----------------------------------------------- |
| Expository | Explanation / representation |
| Interactive | Engagement with a designed/facilitated experience |
| Situated Task | Purposeful learner action in authentic/situated context |
| Assessment Pack | Deliberate progression stop whose centre of gravity is **interpretable formative evidence about the learner** (R1/R2) — [Gate 4](GATE-4-ASSESSMENT-PACK-PRODUCT-BOUNDARY.md) |
| Learning Journey | Progression / composition across experiences |

**Gate 4 discriminator:** principal job = inspectable formative evidence about the learner → Assessment Pack; develop via consequential engagement → Interactive; authentic situated doing → Situated Task; develop via explanation → Expository.

---

## Discovery constraint (historical)

Until the gates earned them, the sprint withheld a final definition, a final pipeline, an assessment-type taxonomy, response-type and feedback-mode catalogues, an essay/AI-feedback policy, a persistence policy, and new schemas, widgets, or publish behaviour. The accepted result is [SPRINT-93-CLOSURE.md](SPRINT-93-CLOSURE.md).
