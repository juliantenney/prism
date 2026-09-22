# Sprint 85 — Charter

**Sprint:** 85 — Expository Resource Implementation  
**Status:** **COMPLETE / CLOSED** (closed 2026-09-22)  
**Type:** Implementation  
**Predecessor:** Sprint 84 — COMPLETE / CLOSED ([SPRINT-84-CLOSURE.md](../2026-09-21-sprint-84-expository-resource-planning/SPRINT-84-CLOSURE.md))  
**Backlog item:** [PB-FA-011 — Expository Resource](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Closure:** [SPRINT-85-CLOSURE.md](SPRINT-85-CLOSURE.md) · [S85-D08](decisions.md#s85-d08--close-sprint-85--expository-resource-implementation-complete)  
**Start here:** [SPRINT-85-START-HERE.md](SPRINT-85-START-HERE.md)  
**Opening decision:** [S85-D01](decisions.md#s85-d01--open-sprint-85--expository-resource-implementation)  
**Authoritative design:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## Mission

Implement the accepted Sprint 84 design for a first-class Expository Resource in PRISM.

Sprint 85 turns the accepted Planning design into working Create → Run → assemble → render/export behaviour for Expository, while protecting Interactive and reusing applicable PRISM capabilities.

Detailed implementation brief (bounded work packages / task list) will be supplied separately after this pack is reviewed. Opening the pack does **not** invent that task list and does **not** authorise production work ahead of the brief.

---

## Accepted implementation target

### Topology

```text
[Normalize Content?]
  → Generate Learning Content
  → Model Knowledge
  → Learning Outcomes
  → Expository Journey Plan
  → Expository Development
  → Expository Materials
  → Design Page
  → deterministic assembly
  → learner-renderer-vnext
```

Interactive Episode Plan, DLA, GAM and Learning Sequence are **bypassed** for Expository.

### Learner-facing semantic structure

```text
Resource / chapter
  → ordered exposition sections
    → explanation
    → supporting intellectual materials
```

`section` is the accepted semantic learner-facing unit. Do not introduce an abstract `exposition unit` merely for implementation convenience. Do not fake Expository through Interactive activities, workspaces or evidence-production semantics.

---

## Binding pedagogical north star

> An Expository Resource should progressively construct a coherent mental model of its subject, moving the learner from appropriate orientation and foundational understanding towards increasingly connected, discriminating, qualified and usable understanding.

| Stage | Owns |
| ----- | ---- |
| **Expository Journey Plan (EJP)** | *What intellectual journey will construct the intended understanding?* |
| **Expository Development (XD)** | *How should each step in that journey be explained so the learner can make the intended conceptual move?* |
| **Expository Materials (XM)** | *What actual intellectual material is required to make that explanation work?* |

Do **not** replace this with a fixed Expository beat sequence. Do **not** reduce EJP to a table-of-contents generator. Do **not** allow independently competent sections to become merely serial A→B→C explanation without planned relationships, recurrence, qualification and synthesis.

---

## Three binding implementation guardrails

### 1. Protect Interactive

Existing Interactive prompts and pedagogical behaviour are the protected baseline ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)).

Do **not**:

- modify Interactive prompts merely to enable Expository;
- add `if Expository` branches to Interactive prompts;
- generalise DLA/GAM/EP prompts for both products;
- weaken Interactive contracts or pedagogy;
- change existing Interactive behaviour merely for implementation convenience.

The existing first-class Interactive engineering gate must remain green.

### 2. Reuse PRISM capabilities

Expository should receive applicable existing product-independent PRISM capabilities rather than becoming a reduced-capability path.

Preserve/reuse where applicable: source and attachment handling; normalization; `learning_content`; Model Knowledge; Learning Outcomes artefact; grounding and authority protections; graphics / visual representation; mathematics / formal notation; accessibility behaviour; material rendering; page rendering; export/output behaviour; deterministic assembly; validation; provenance / claim-scope protections; other established cross-cutting first-class capabilities.

Use additive adaptation where shared infrastructure needs to understand the new product.

**Test:** Is this genuinely Interactive-specific, or is it a PRISM capability Expository should also receive?

### 3. Give Expository its own pedagogy

Implement sibling Expository prompts/contracts where the accepted design requires them.

Sibling prompt behaviour: Generate Learning Content · Learning Outcomes · Design Page.  
Sibling stages/contracts: Expository Journey Plan · Expository Development · Expository Materials.

---

## Authority model (accepted — do not reopen)

```text
source / attachments
  → normalization where needed
  → learning_content as explanatory-richness spine
  → Model Knowledge as conceptual graph
  → Learning Outcomes
  → Expository planning / development / materials
```

Do not turn Model Knowledge into a proto-textbook. Do not force all explanatory richness through MK. Do not allow Design Page or assembly to become a final unrestricted AI rewrite for coherence.

---

## Shared vs sibling (accepted Planning direction)

| Disposition | Items |
| ----------- | ----- |
| Shared / reusable | Normalize; Model Knowledge; LO contract; `learning_content` shape; deterministic assembly (additive Expository support); learner-renderer-vnext; applicable cross-cutting capabilities |
| Sibling prompt behaviour | Generate Learning Content; Learning Outcomes; Design Page |
| Sibling stages/contracts | EJP; XD; XM |
| Bypassed for Expository | Interactive Episode Plan; DLA; GAM contract/pedagogy; Learning Sequence |

Implementation may investigate how much lower-level GAM body-authoring machinery can safely be reused behind XM, but must **not** inherit Interactive GAM semantics or contract coupling merely for code reuse.

---

## Known implementation-level questions (do not reopen Sprint 84)

- Exact field-level section/page schema mechanics  
- Exact IDs / nesting / capture / enrich mechanics  
- How much lower-level GAM body-authoring machinery can safely support XM  
- Zero-workspace export/package edge cases  

Expository-specific Adjustments remain deferred unless implementation evidence makes them necessary.  
Research Synthesis identity remains open and non-blocking.

---

## First-class quality requirement

Successful implementation is **not** merely: pipeline completes; all LOs appear somewhere; every section is individually competent; page renders.

The first-class manual journey must demonstrate a deliberate intellectual progression that builds increasingly coherent, connected and usable understanding across the resource. Quality judgement includes the resource as a whole.

---

## Non-goals at open (binding until brief accepted)

- Inventing the detailed implementation task list ahead of the separate brief  
- Production code / prompt / schema / UI / renderer / test changes in this opening step  
- Authoring production Expository prompts in this opening step  
- Reopening settled Sprint 84 architecture  
- Reopening Sprint 83  
- Solving Expository→Interactive / Workshop packaging / Podcast / Presentation / Research Synthesis as blockers  

---

## Authoritative predecessor inputs

| Input | Path |
| ----- | ---- |
| Accepted design | [S84-EXPOSITORY-RESOURCE-DESIGN.md](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) |
| Sprint 84 closure | [SPRINT-84-CLOSURE.md](../2026-09-21-sprint-84-expository-resource-planning/SPRINT-84-CLOSURE.md) |
| Sprint 84 decisions | [decisions.md](../2026-09-21-sprint-84-expository-resource-planning/decisions.md) (S84-D03…D12) |
| Sprint 84 handover | [HANDOVER.md](../2026-09-21-sprint-84-expository-resource-planning/HANDOVER.md) |
| Sibling / protected baseline | [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) |
| Backlog | [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource) |

Field-level schema and code choices are implementation detail **within** the accepted architecture — not grounds to reopen Planning.
