# Sprint 93 — START HERE

**Sprint:** 93 — Assessment Pack Educational Contract  
**Status:** **OPEN**  
**Opened:** 2026-10-07  
**Type:** Product discovery → educational architecture → implementation  
**Active gate:** Output-to-spec slices 1–4 implemented (2026-10-09). Gate 10 is not complete. Gates 1–9 **COMPLETE / PASSED**.  
**Opening decision:** [S93-D01](decisions.md#s93-d01--open-sprint-93--assessment-pack-educational-contract)  
**Charter:** [SPRINT-93-CHARTER.md](SPRINT-93-CHARTER.md)  
**Design map:** [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md)  
**Gate 8 pipeline:** [GATE-8-ASSESSMENT-PACK-PREDETERMINED-PIPELINE.md](GATE-8-ASSESSMENT-PACK-PREDETERMINED-PIPELINE.md)  
**Gate 9 artefact:** [GATE-9-ASSESSMENT-PACK-CANONICAL-STRUCTURED-ARTEFACT.md](GATE-9-ASSESSMENT-PACK-CANONICAL-STRUCTURED-ARTEFACT.md)  
**Output-to-spec contract:** [ASSESSMENT-PACK-OUTPUT-TO-SPEC-CONTRACT.md](ASSESSMENT-PACK-OUTPUT-TO-SPEC-CONTRACT.md)  
**Work log:** [PLAN.md](PLAN.md)  
**Validation:** [VALIDATION.md](VALIDATION.md)  
**Debt:** [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)  
**Predecessor:** [Sprint 92 — COMPLETE / CLOSED](../2026-10-07-sprint-92-situated-learning-activity-first-class-product/SPRINT-92-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-017](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-017--assessment-pack-first-class-product-revisit)  
**Closure (placeholder):** [SPRINT-93-CLOSURE.md](SPRINT-93-CLOSURE.md) — **NOT CLOSED**

---

## Hard invariant — NON-SUMMATIVE

> **Assessment Pack in PRISM is NON-SUMMATIVE.**  
> PRISM is not going anywhere near summative assessment.

**Out of scope for this sprint and for the product boundary under investigation:**

summative assessment; grading and marks; pass/fail decisions; certification; formal progression decisions; high-stakes assessment; formal marking workflows; moderation; gradebooks; proctoring; plagiarism / academic-integrity enforcement; institutional assessment-management workflows.

Do **not** investigate how PRISM might support these later. They are outside the intended product boundary.

---

## If you are starting a new session

> **Sprint 93 is OPEN.** Gates 1–9 **COMPLETE / PASSED**. Output-to-spec slices 1–4 are implemented (validator, omission of the legacy summary control, browser-local response persistence, learner artefact assembly, and Design Page authoring). Canonical object: **`assessment_evidence`**. Do **not** reopen Gates 1–9. Client-side delivery only (no runtime LLM). Gate 10 is not complete. Sprint 92 remains **CLOSED**.

| Fact | State |
| ---- | ----- |
| Sprint 92 | **COMPLETE / CLOSED** — Situated Task |
| Sprint 93 | **OPEN** — Assessment Pack educational contract |
| Gates 1–9 | **COMPLETE / PASSED** |
| Output-to-spec | **Slices 1–4 implemented** — [ASSESSMENT-PACK-OUTPUT-TO-SPEC-CONTRACT.md](ASSESSMENT-PACK-OUTPUT-TO-SPEC-CONTRACT.md) |
| Production code | **Slices 1–4 implemented.** Gate 10 is not complete. |

---

## Working objective

Discover what Assessment Pack must be responsible for at meaningful stopping points within substantial Learning Journeys — and where that responsibility must stop — using the same evidence-led method as Sprint 92.

**Primary question:**

> What must Assessment Pack be able to do to fulfil its educational responsibility at meaningful stopping points within substantial Learning Journeys, and where should that responsibility stop?

Do **not** assume Assessment Pack = MCQ generator. Do **not** begin from “what widgets should we build?”
