# Sprint 91 — START HERE

**Sprint:** 91 — Learning Journey First-Class Implementation  
**Status:** **COMPLETE / CLOSED**  
**Opened:** 2026-10-06  
**Closed:** 2026-10-06  
**Type:** **Implementation** — first-class Learning Journey + modular commission→product boundary  
**Opening decision:** [S91-D01](decisions.md#s91-d01--open-sprint-91--learning-journey-first-class-implementation)  
**Close decision:** [S91-D06](decisions.md#s91-d06--close-sprint-91--learning-journey-first-class-implementation-complete)  
**Review decisions:** [S91-D02](decisions.md#s91-d02--learning-journey-product-identity) … [S91-D05](decisions.md#s91-d05--commissionability-is-family-declared)  
**Charter:** [SPRINT-91-CHARTER.md](SPRINT-91-CHARTER.md)  
**Implementation map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Work log:** [PLAN.md](PLAN.md)  
**Validation:** [VALIDATION.md](VALIDATION.md)  
**Debt:** [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md)  
**Predecessor:** [Sprint 90 — COMPLETE / CLOSED](../2026-10-05-sprint-90-learning-journey-foundations/SPRINT-90-CLOSURE.md) — **do not reopen**  
**Authoritative foundation:** [LEARNING-JOURNEY-FOUNDATIONS.md](../2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md)  
**Architecture:** [Sprint 89](../2026-10-02-sprint-89-architectural-consolidation/SPRINT-89-CLOSURE.md) · S89-D02 predetermined pipelines  
**Authoritative closure:** [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md)

---

## If you are starting a new session

> **Sprint 91 is COMPLETE / CLOSED.** Read [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md) for architecture and live E2E evidence. Do **not** reopen this sprint. Select next work from the product backlog via an explicit opening decision.

| Fact | State |
| ---- | ----- |
| Sprint 90 | **COMPLETE / CLOSED** |
| Sprint 91 | **COMPLETE / CLOSED** — live E2E **PASSED** |
| Product id | `learning_journey` (S91-D02) |
| Prompt bodies | [JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json](JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json) — top-level current `body` (S91-D03; B1 resolved) |
| Design Page | Shared `artifact_type: "page"` (`product_id: learning_journey`) + `commissions[]` sidecar |
| Commission intake | Shared first-class intake; Interactive / Expository / Assessment Pack |
| Production status | Derived; prepare boundary shared by Preview + package preflight |
| Final package | Journey Home + nested `cN/` constituent packages |
| Independent Task | Future work — not started |
| Interactive / Expository / Assessment Pack | **Not redesigned** |
| Course Home / programme design | **Out of scope** / future |
| Closure | [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md) — **COMPLETE / CLOSED** |

---

## Working objective

Implement **Learning Journey** as a first-class PRISM product and establish the modular **commission→product** boundary so Learning Journey outputs can initialise downstream first-class product creation.

Prefer the smallest end-to-end proof of the established architecture.

---

## Architectural invariants (preserve)

1. Learning Journey is a first-class PRISM product.  
2. Its pipeline is predetermined.  
3. Reasoning sequence: Requirements → Progression → Elements → Commissioning → Design Page (same-chat GPT constrained synthesis of shared `artifact_type: "page"` with `product_id: "learning_journey"`), then deterministic validate/render/publish.  
4. Bring the four experimentally exercised reasoning prompts into production with **minimum adaptation** — port authenticated Prompt Studio bodies only (S91-D03).  
5. Dynamic educational structure is allowed; workflow topology is predetermined.  
6. Journey owns journey-level reasoning; products own product-level design.  
7. Learning Journey commissions; product workflows design.  
8. Product-to-product transfer is source/input ingestion, not workflow splicing.  
9. Do not hard-code a closed product catalogue into Learning Journey; commissionability is family-declared (S91-D05).  
10. Learning Journey is optional orchestration — direct Interactive / Expository / Assessment creation remains intact.  
11. Learning time and duration remain distinct author inputs.  
12. Constituent journeys follow educational coherence / manageability, not fixed thresholds.  
13. Learning Elements are educational jobs, not automatically products.  
14. Commissioning sets product/experience boundaries independently of element boundaries.  
15. Unsupported commissions remain explicit.  
16. Persistence is cross-product capability, not a product.

---

## Hard non-goals

Do **not**: redesign Interactive or Expository; expand Assessment Pack beyond integration needs; build Course Home; programme-level curriculum design; invent generic workflow generation; speculative Research architecture; build a comprehensive persistence platform before the vertical slice requires it; fixed duration rules; convert human-readable intermediate artefacts to JSON merely for neatness; fabricate experimental prompts.

---

## Current stop rule

**Sprint 91 is COMPLETE / CLOSED.** Do not reopen. Authoritative record: [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md). Next work requires an explicit backlog opening decision — do not begin Sprint 92 or Situated Task from this pack alone.

---

## Read order

1. [SPRINT-91-CLOSURE.md](SPRINT-91-CLOSURE.md)  
2. [decisions.md](decisions.md) (S91-D01…D06)  
3. [VALIDATION.md](VALIDATION.md) / [STATUS.md](STATUS.md)  
4. [LEARNING-JOURNEY-FOUNDATIONS.md](../2026-10-05-sprint-90-learning-journey-foundations/LEARNING-JOURNEY-FOUNDATIONS.md) as needed  

Programme: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)  
Backlog: [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)
