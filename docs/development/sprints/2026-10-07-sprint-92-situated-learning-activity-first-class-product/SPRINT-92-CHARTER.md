# Sprint 92 — Charter

**Sprint:** 92 — Situated Learning Activity First-Class Product *(working title)*  
**Status:** **OPEN**  
**Opened:** 2026-10-07  
**Type:** Product definition → first-class implementation (design before code)  
**Predecessor:** [Sprint 91 — COMPLETE / CLOSED](../2026-10-06-sprint-91-learning-journey-first-class-implementation/SPRINT-91-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines)  
**Opening:** [S92-D01](decisions.md#s92-d01--open-sprint-92--situated-learning-activity-first-class-product)  
**Design map:** [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md)  
**Start here:** [SPRINT-92-START-HERE.md](SPRINT-92-START-HERE.md)

---

## Objective

Define and implement PRISM's next first-class educational product for the recurring capability gap demonstrated by Learning Journey commissioning:

**purposeful learner activity undertaken substantially in an authentic / external / situated context**, where the **learner** (not the generated resource) carries out the substantive activity — while PRISM frames, bounds, supports, records, and reconnects that activity.

The sprint must **derive the product from educational requirements** before defining implementation architecture.

Final product name and `product_id` are **not settled** at sprint open.

---

## Evidence base

The product hypothesis is grounded in **repeated Learning Journey evidence**, not speculative catalogue expansion. Programme-level discovery pattern: [PB-FA-015 — Learning Journey as a product-discovery mechanism](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines) (not a Sprint 92 gate decision).

| Source | Observation |
| ------ | ------------- |
| Original Online Information Credibility journey | Unsupported external investigation / research experiences |
| 50-hour undergraduate **Product Ways of Working** journey | Investigating a product situation; gathering evidence for a product question; conducting a bounded product test |
| 50-hour workplace CPD **Product Judgement** journey | Seven-hour sustained workplace enquiry |
| Both recent 50-hour experiments | The Learning Journey model **independently refused** to force these experiences into Expository, Interactive, or Assessment Pack |

**What sibling products legitimately cover:**

- **Interactive** — individual reasoning, authentic-context application where designed interaction is structurally central, enquiry/test **planning**, facilitated workshop / cohort experiences.
- **Assessment Pack** — independent integrated performance when the principal educational purpose is **interpretable evidence of capability**.

**Therefore:** “independent” alone is **not** the product discriminator.

### Emerging boundary (hypothesis)

| Product | Principal educational vehicle / job |
| ------- | ----------------------------------- |
| Expository | Explanation |
| Interactive | Engagement with a deliberately designed / facilitated experience is structurally central |
| Assessment Pack | Producing interpretable evidence of learner capability |
| **New product (hypothesis)** | Substantive learning activity is **purposeful action in an authentic / situated context**; PRISM frames, bounds, supports, records, and reconnects that activity |

### Strongest current educational grammar (hypothesis — not schema)

```text
Brief → Activity → Record → Reconnect
```

**Workplace refinement (hypothesis):**

- Activity may require **learner adaptation** when access, circumstances, or emerging evidence differ from the plan.
- Adaptation should preserve educational purpose and the relevant reasoning / evidence chain.
- Do **not** automatically make “Adapt” a separate pipeline stage or schema field.

---

## Architectural principles / constraints

Carry forward explicitly:

- The **product determines the pipeline**. Pipeline is part of product definition.
- Model stages own **intellectual work**; AI belongs in intellectual work, not deterministic plumbing.
- Final structured artefacts cross into PRISM; validation / rendering / publishing after that boundary should be **deterministic**.
- Learning Journey **owns composition**; constituent products **own production**; PRISM owns deterministic commissioning, association, readiness, and assembly ([Sprint 91](../2026-10-06-sprint-91-learning-journey-first-class-implementation/SPRINT-91-CLOSURE.md)).
- A commissioned instance must become an **ordinary first-class workflow** using existing shared **commission-intake** architecture.
- **Persistence** is a capability, not a first-class educational product.
- Do **not** stretch Interactive into a generic container merely to remove unsupported commissions.
- Do **not** create a new product merely to eliminate every unsupported commission.
- Do **not** split Interactive into individual / workshop product families.
- **Delivery context** is not automatically product identity.
- No speculative generic workflow engine.
- **No schema-first design.**
- **No implementation** until the educational product definition is sufficiently stable (design gates 1–7, including Design Page contract). Gate 8 Implementation is authorised only after that.

---

## Required design sequence

Canonical gate order: [PRODUCT-DESIGN-MAP.md](PRODUCT-DESIGN-MAP.md).

1. Educational purpose  
2. Boundary against sibling products  
3. Learner contract  
4. Authoring / design responsibilities  
5. Product invariants  
6. Predetermined design pipeline  
7. Structured artefact / Design Page contract  
8. Implementation  
9. Commissioning integration  
10. Authoring / publishing integration as required  
11. Learning Journey deterministic assembly integration  
12. Live end-to-end acceptance  

**Implementation WP1 must not start until steps 1–6 are deliberately resolved and documented.**

---

## Acceptance evidence (eventual)

Live acceptance should include **commissioning and producing representative cases**, not synthetic tests alone.

The product definition should be tested against at least:

- situated investigation / observation;
- evidence gathering / enquiry;
- learner-conducted bounded test;
- workplace situated activity;
- a contrasting **deliberate-practice** case (should **not** belong here if Interactive is the right home).

**Reject** cases that properly belong to sibling products:

- facilitated workshop reasoning → **Interactive**;
- enquiry / test planning where designed interaction is the educational centre → **Interactive**;
- independent integrated judgement produced as interpretable evidence of capability → **Assessment Pack**.

---

## Guardrails

- Sprint 91 remains **CLOSED**.
- Do not redesign Interactive / Expository / Assessment Pack unless this sprint's boundary work exposes a concrete, scoped need (not assumed at open).
- Do not encode provisional names (`Independent Task`, `Self-Directed`, `Situated Activity`, …) as final `product_id` until a deliberate naming decision is recorded.

---

## Stopping condition

Sprint 92 may close when the product is first-class, commissionable from Learning Journey where appropriate, live acceptance cases are recorded, validation is in [VALIDATION.md](VALIDATION.md), and [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md) is written. Closure is **not** authorised by this charter alone.
