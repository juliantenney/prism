# Sprint 85 — Plan

**Status:** **OPEN** — Implementation brief accepted ([S85-D02](decisions.md#s85-d02--accept-detailed-sprint-85-implementation-brief)); execution in progress  
**Dashboard:** [STATUS.md](STATUS.md) · **Design:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md)  
**Charter:** [SPRINT-85-CHARTER.md](SPRINT-85-CHARTER.md)

Gate/task IDs: `S85-T-###`, `S85-D##`.

---

## Programme posture

```text
Sprint pack / opening decision     COMPLETE (S85-D01)
Detailed implementation brief      ACCEPTED (S85-D02)
Bounded implementation tasks       POPULATED (T-001…T-020 → WP1–WP7)
Production implementation          AUTHORISED WITHIN S85 SCOPE — in progress
Sprint 84 architecture             ACCEPTED — do not reopen
Interactive baseline               PROTECTED (S83-D04)
```

---

## Work packages

| WP | Focus | Gate (summary) | Status |
| -- | ----- | -------------- | ------ |
| WP1 | Product entry + workflow routing | Create Expository constructs Expository topology; Self-study/Workshop unaffected | **COMPLETE** |
| WP2 | Contracts + pipeline spine | Sibling pipeline → assembly without Interactive activity semantics | **COMPLETE** |
| WP3 | Pedagogical sibling prompts | Real topic yields coherent north-star journey | **PENDING** |
| WP4 | Materials + representation + domain packs | Supporting materials without GAM Interactive semantics | **PENDING** |
| WP5 | Page / renderer / a11y / export | Zero-workspace Expository renders and exports | **PENDING** |
| WP6 | Capability-preservation verification | No silent capacity loss on sibling path | **PENDING** |
| WP7 | First-class journey + Interactive gate | Manual journey + tests + Interactive gate green | **PENDING** |

---

## Task index

| ID | Title | WP | Status |
| -- | ----- | -- | ------ |
| S85-T-001 | Add `expository_resource` Create product option + constants/validation | WP1 | **COMPLETE** |
| S85-T-002 | Factor seed + workflow design intent for Expository (elicitation unchanged) | WP1 | **COMPLETE** |
| S85-T-003 | Heuristics/topology: construct EJP→XD→XM path; bypass EP/DLA/GAM/LS | WP1 | **COMPLETE** |
| S85-T-004 | Register Expository canonical steps in LD step-patterns / workflow policy | WP1 | **COMPLETE** |
| S85-T-005 | Domain-pack propagation initial trace (General + selected domain → stages) | WP1 | **PARTIAL** — Create/design context path preserved; sibling-prompt consumption **not** verifiable until WP3 |
| S85-T-006 | Section-based primary schema (minimum fields) | WP2 | **COMPLETE** (lib/expository-contracts.js; verified) |
| S85-T-007 | EJP / XD / XM contracts + capture/enrich/validation wiring | WP2 | **COMPLETE** — native capture normalize/validate; extent on EJP |
| S85-T-008 | Additive assembly stage keys + pipeline plumbing | WP2 | **COMPLETE** — Expository section merge path; Interactive unchanged |
| S85-T-008a | Expository Scale/scope → extent normalisation (S85-D05) | WP2 | **COMPLETE** — before WP3 prompt authoring |
| S85-T-009 | Expository sibling prompts: GLC, LO | WP3 | **PENDING** |
| S85-T-010 | Expository sibling prompts: EJP, XD, XM | WP3 | **PENDING** |
| S85-T-011 | Expository sibling prompt: Design Page | WP3 | **PENDING** |
| S85-T-012 | XD commissioning + XM commission lock + material bodies | WP4 | **PENDING** |
| S85-T-013 | Graphics binding to sections; maths/formal; grounding behaviour | WP4 | **PENDING** |
| S85-T-014 | Decide GAM body-authoring reuse behind XM (document decision) | WP4 | **PENDING** |
| S85-T-015 | Expository page shape + deterministic assembly + zero-workspace validation | WP5 | **PENDING** |
| S85-T-016 | Shared renderer + accessibility baseline + export/package | WP5 | **PENDING** |
| S85-T-017 | E2E capability-preservation matrix + verification evidence | WP6 | **PENDING** |
| S85-T-018 | Focused Expository regression tests | WP7 | **PENDING** |
| S85-T-019 | Manual first-class Expository journey (north-star judgement) | WP7 | **PENDING** |
| S85-T-020 | Interactive first-class engineering gate non-regression | WP7 | **PENDING** |

---

## Related

- Brief acceptance: [S85-D02](decisions.md#s85-d02--accept-detailed-sprint-85-implementation-brief)  
- Opening: [S85-D01](decisions.md#s85-d01--open-sprint-85--expository-resource-implementation)  
- Design: [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md)  
- Protected Interactive: [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)  
- Backlog: [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)
