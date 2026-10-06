# Sprint 91 — Charter

**Sprint:** 91 — Learning Journey First-Class Implementation  
**Status:** **OPEN**  
**Opened:** 2026-10-06  
**Type:** Implementation  
**Predecessor:** [Sprint 90 — COMPLETE / CLOSED](../2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-014](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-014--outcomes-map) · [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines)  
**Opening:** [S91-D01](decisions.md#s91-d01--open-sprint-91--learning-journey-first-class-implementation)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Start here:** [SPRINT-91-START-HERE.md](SPRINT-91-START-HERE.md)  
**Authoritative foundation:** [LEARNING-JOURNEY-FOUNDATIONS.md](../2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)  
**Architecture:** [Sprint 89](../2026-10-02-sprint-89-architectural-consolidation/SPRINT-89-CLOSURE.md) · S89-D02

---

## Mission

Implement **Learning Journey** as a first-class PRISM product and establish the modular **commission→product** boundary so Learning Journey outputs can initialise downstream first-class product creation.

Prefer the smallest end-to-end proof of the architecture established in Sprint 90. Do not redesign settled architecture unless implementation exposes a concrete contradiction.

---

## Accepted target (summary)

```text
Create (Learning Journey)
  → Journey Requirements
  → Journey Progression
  → Journey Elements
  → Journey Commissioning
  → Design Page (same-chat GPT constrained synthesis of shared page + commissions sidecar)
  → PRISM validates / renders / publishes
  → Rationale / Journey / Elements (commissions)
  → shared commission intake → Interactive Create (first proof)
```

Product id: **`learning_journey`** ([S91-D02](decisions.md#s91-d02--learning-journey-product-identity)).

---

## Guardrails

- Sprint 90 remains **CLOSED**.
- Predetermined pipeline; Learning Journey commissions; products design.
- Port experimental Prompt Studio prompts — do not reconstruct or improve them ([S91-D03](decisions.md#s91-d03--experimental-prompt-source)).
- First commission-intake proof: **Interactive** ([S91-D04](decisions.md#s91-d04--first-commission-intake-target)).
- Commissionability is family-declared (`acceptsCommission` or equivalent) — not implied by first-class status alone ([S91-D05](decisions.md#s91-d05--commissionability-is-family-declared)).
- Do not redesign Interactive / Expository; do not expand Assessment Pack beyond integration needs; no Course Home; no programme design; no speculative persistence platform.

---

## Stopping condition

Sprint 91 may close when the vertical slice in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) is proven, focused validation is recorded in [VALIDATION.md](VALIDATION.md), debt is recorded in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md), and [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md) is written. Closure is **not** authorised by this charter alone.
