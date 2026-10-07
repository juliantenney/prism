# Sprint 92 — Product design map

**Status:** **COMPLETE / CLOSED with sprint** — gates 1–7 complete; Gate 8 **PASS**  
**Sprint:** 92 — Situated Task First-Class Product *(pack folder retains historical discovery title)*  
**Charter:** [SPRINT-92-CHARTER.md](SPRINT-92-CHARTER.md)  
**Opening:** [S92-D01](decisions.md#s92-d01--open-sprint-92--situated-learning-activity-first-class-product)  
**Close:** [S92-D10](decisions.md#s92-d10--close-sprint-92--situated-task-first-class-product-complete) · [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md)

This map is the **design gate** for Sprint 92. Design gates **1–7** and Gate **8** (implementation + live E2E) are complete.

---

## Design gate checklist

| Step | Topic | Status | Notes / artefact |
| ---- | ----- | ------ | ---------------- |
| 1 | Educational purpose | **COMPLETE** | [S92-D02](decisions.md#s92-d02--product-design-gate-1--educational-purpose) |
| 2 | Boundary against sibling products | **COMPLETE** | [S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products) |
| 3 | Learner contract | **COMPLETE** | [S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract) |
| 4 | Authoring / design responsibilities | **COMPLETE** | [S92-D05](decisions.md#s92-d05--product-design-gate-4--authoring--design-responsibilities) |
| 5 | Product invariants | **COMPLETE** | [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants) |
| 6 | Predetermined design pipeline | **COMPLETE** | [S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline) |
| 7 | Structured artefact / Design Page contract | **COMPLETE** | [S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract) |
| 8 | Implementation | **COMPLETE / PASS** | [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) · live E2E in [SPRINT-92-CLOSURE.md](SPRINT-92-CLOSURE.md) |
| 9 | Commissioning integration | **COMPLETE** | Shared intake; ordinary Situated constituent workflow |
| 10 | Authoring / publishing integration | **COMPLETE** | Shared Authoring / graphics / package path |
| 11 | Learning Journey assembly integration | **COMPLETE** | LJ package nests Complete Situated under `cN/` |
| 12 | Live end-to-end acceptance | **PASS** | Standalone accessibility Situated Task (Gate 8) |

**Rule:** Sprint 92 is **CLOSED**. Do not reopen design gates for opportunistic redesign.

---

## Design Page contract summary (Gate 7)

Authoritative detail: [S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract).

| Topic | Decision |
| ----- | -------- |
| Artefact | Ordinary `page` / `2.0.0` — no special artefact type |
| Semantic core | Product-specific `situated_learning`: Purpose · Activity · Record · Reconnection |
| Conditional content | Omit when irrelevant (boundaries, attention, adaptation, social, scaffolding, …) |
| Learner composition | `sections[]` — not a mechanical mirror of the four semantics |
| Activities | Default `activities: []`; situated activity owned by `situated_learning`, not Interactive activities |
| Provenance | Workflow/family identity; no duplicate page provenance; no page-level `product_id` for symmetry |
| Record | Educational specification only — not persistence mechanism |
| Graphics | Optional shared pipeline; do not persist briefs/ledgers; compatibility **B** — additive shared visual `purpose` (working `action_support`) |
| Maths | Shared TeX `\(...\)` / `\[...\]` — no situated maths schema; entry not in canonical contract |

---

## Predetermined design pipeline summary (Gate 6)

```text
Situation → Activity → Support → Learning Return → Design Page
```

Authoritative detail: [S92-D07](decisions.md#s92-d07--product-design-gate-6--predetermined-design-pipeline).

| Stage | Core question |
| ----- | ------------- |
| Situation | What learning needs to happen through action, and in what real circumstances will that action occur? |
| Activity | What should the learner actually undertake so that doing it develops the intended learning? |
| Support | What support does this learner need to act productively without PRISM taking over the substantive learning? |
| Learning Return | What must survive the experience, and how will subsequent learning use it? |
| Design Page | Synthesize the resolved design into the constrained structured artefact ([S92-D08](decisions.md#s92-d08--product-design-gate-7--structured-artefact--design-page-contract)). |

Continuous conversation across all five stages (LJ pattern; product-specific prompts). Classification challenge: do not manufacture a situated product when centre of gravity belongs to a sibling. Compact pipeline — not a 1:1 map of Gates 3–5 lists.

---

## Product invariants summary (Gate 5)

Truths that must hold for a valid instance regardless of pipeline, schema, UI or persistence. Authoritative detail: [S92-D06](decisions.md#s92-d06--product-design-gate-5--product-invariants).

1. **Activity-as-learning** — purposeful doing in context is a principal learning vehicle  
2. **Purposeful-action** — educational orientation, not mere task instruction  
3. **Contextual-agency** — preserve meaningful agency (not solitary by definition)  
4. **Context-fit** — designed for actual circumstances; adaptation where variation is foreseeable (replaces candidate “productive variation”)  
5. **Consequential-record** — something educationally meaningful survives (educational, not technological)  
6. **Reconnection** — explicit educational destination beyond task completion  

**Signature:** purposeful doing as learning vehicle; meaningful agency in context; consequential retention; learning carried forward.

Pressure-tested: UG investigation / evidence / bounded test and workplace enquiry **admitted**; facilitated workshop, planning-as-Interactive, Assessment Pack judgement, generic worksheet **rejected**.

---

## Authoring / design responsibilities summary (Gate 4)

Intellectual design work to satisfy the learner contract — **not** a 1:1 map to Gate 3 categories, pipeline stages, or schema. Authoritative detail: [S92-D05](decisions.md#s92-d05--product-design-gate-4--authoring--design-responsibilities).

1. Interpret learning purpose and situated opportunity  
2. Design the activity  
3. Design the boundaries  
4. Design attention and adaptation  
5. Design the record  
6. Design the reconnection  

Cross-cutting judgements: **scaffolding** (support without taking over substantive work); **social configuration** (encounter/participation where relevant; Gate 2 centre of gravity retained).

Invariant: design from intended learning and situated activity outward — not from UI/capture templates. Educational judgement belongs on the model side; deterministic processing must not invent missing design after the structured artefact boundary.

---

## Learner contract summary (Gate 3)

Central question: what must PRISM provide so the learner can act productively **without the resource becoming the activity**? Authoritative detail: [S92-D04](decisions.md#s92-d04--product-design-gate-3--learner-contract).

Responsibilities: **Purpose · Action · Context/opportunity · Boundaries · Attention · Adaptation · Record · Reconnect** (+ effort/stopping as design consideration, not a separate universal category).

Invariant: orient the learner to act purposefully, safely and productively; support adaptation without losing purpose; clear about what to notice and retain; able to carry learning forward. Do **not** confuse autonomy with instructional absence.

Social learning: learner-directed ≠ learner-alone; Gate 2 centre-of-gravity still applies.

Grammar: Brief → Activity → Record → Reconnect remains hypothesis — not schema, headings, pipeline, or UI.

---

## Boundary summary (Gate 2)

Educational **centre of gravity** determines ownership — not delivery modality. Authoritative detail: [S92-D03](decisions.md#s92-d03--product-design-gate-2--boundary-against-sibling-products).

| Product | Principal learning vehicle / educational job |
| ------- | -------------------------------------------- |
| Expository | Understanding principally through explanation / representation |
| Interactive | Learning principally mediated by designed / facilitated experience |
| Assessment Pack | Eliciting interpretable evidence of learner capability |
| New situated product | Purposeful activity in context; product prepares, bounds, supports, records, reconnects |
| Learning Journey | Composes progression; does not own constituent activity production |

---

## Hypothesis to resolve (not decided)

- Working grammar: **Brief → Activity → Record → Reconnect** (educational hypothesis; Design Page uses `situated_learning` Purpose / Activity / Record / Reconnection — not mandatory learner headings)
- Adaptation during Activity may be required; not necessarily a separate pipeline stage or schema field
- Provisional names (Independent Task, Self-Directed, Situated Activity, …) are **working language only**
- Final `product_id` / Create label — Gate 8 implementation decision

---

## Acceptance case matrix (resolved at Gate 2; reused at live step 12)

| Case type | Classification | Notes |
| --------- | -------------- | ----- |
| Situated investigation / observation | **New product** when carrying out the investigation / observation is the principal learning vehicle | Centre of gravity = doing the investigation |
| Evidence gathering / enquiry | **New product** when carrying out the enquiry is the principal learning vehicle | — |
| Learner-conducted bounded test | **New product** when conducting the test and learning from what happens is the principal learning vehicle | Design/planning the test may be Interactive |
| Workplace situated activity | **New product** when the workplace activity itself carries the substantive learning | — |
| Facilitated workshop reasoning | **Interactive** | Designed / facilitated experience mediates learning |
| Enquiry / test planning where designed interaction is central | **Interactive** | Planning ≠ doing; planning can be Interactive |
| Independent performance principally intended as interpretable capability evidence | **Assessment Pack** | Producing evidence alone ≠ Assessment; judging capability is the job |
| Deliberate practice | **Boundary case — not forced** | Designed/facilitated mediation → Interactive; sustained purposeful practice in context as principal vehicle → new product may apply |

---

## Evidence pointers (inputs to gates 1–2)

- Sprint 90 / 91 Learning Journey foundations and closure
- Post–S91 live journeys: credibility; Product Ways of Working (UG); Product Judgement (workplace CPD)
- [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines) — including programme principle **Learning Journey as a product-discovery mechanism** (not a Sprint 92 gate)
