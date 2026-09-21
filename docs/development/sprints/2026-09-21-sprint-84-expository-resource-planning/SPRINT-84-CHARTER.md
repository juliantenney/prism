# Sprint 84 — Charter

**Sprint:** 84 — Expository Resource Planning  
**Status:** **COMPLETE / CLOSED** (2026-09-21)  
**Closure:** [SPRINT-84-CLOSURE.md](SPRINT-84-CLOSURE.md)  
**Type:** Planning — not implementation  
**Predecessor:** Sprint 83 — CLOSED ([SPRINT-83-CLOSURE.md](../2026-09-21-sprint-83-expository-resource-investigation/SPRINT-83-CLOSURE.md))  
**Backlog item:** [PB-FA-011 — Expository Resource](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Start here:** [SPRINT-84-START-HERE.md](SPRINT-84-START-HERE.md)  
**Opening decision:** [S84-D01](decisions.md#s84-d01--open-sprint-84--expository-resource-planning)  
**Close decision:** [S84-D12](decisions.md#s84-d12--accept-refined-planning-design-and-close-sprint-84)  
**Accepted design:** [S84-EXPOSITORY-RESOURCE-DESIGN.md](S84-EXPOSITORY-RESOURCE-DESIGN.md)

---

## Mission

Turn the accepted Sprint 83 investigation evidence into the **smallest coherent design** for a first-class Expository Resource.

Sprint 84 should determine:

- what Expository Resource is within PRISM;
- how it should use the proven PRISM subsystem architecture;
- where it requires its own pedagogical stages / prompts / contracts;
- what an implementation sprint would subsequently be authorised to build.

The goal is a design that can be implemented deliberately — **not** implementation during Planning.

---

## Product conception (working definition)

> An Expository Resource develops a learner's understanding of a body of knowledge through a deliberately structured, sufficiently rich explanation.

Approximately: an excellent illustrated educational book chapter.

**Not** an Interactive Learning Resource with activities removed.

A strong Expository Resource may construct understanding through conceptual structure and deliberate intellectual progression; explanation of what/why/how/relationships/consequences where appropriate; appropriate elaboration (examples, non-examples, cases, comparisons, worked demonstrations, evidence, applications, analogies, counterexamples, boundary cases, misconceptions); appropriate representations; source grounding and evidential/provenance discipline; narrative continuity; invitations to think, predict, inspect, compare or reflect where useful.

These are pedagogical possibilities — **not** a checklist or schema.

Preserve:

> Expository may invite thought; Interactive requires and supports learner action.

> Expository richness is sufficient explanatory, evidential, representational and contextual material for constructing useful understanding — not simply quantity of content.

---

## Binding design constraint — protected Interactive baseline

Carry [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) forward as **binding**.

> Existing Interactive prompts are not to be modified in order to make Expository Resource possible.

Expository should receive its **own coherent sibling prompt family**.

**Do not plan to:**

- add Expository branches or conditionals to Interactive prompts;
- generalise Interactive prompts merely so both products can use them;
- weaken Interactive-specific pedagogy;
- turn DLA/GAM into generic prompts serving both products;
- generalise an Interactive-specific contract merely to avoid a sibling Expository contract.

Study and reuse applicable hard-won Interactive principles (grounding, authority, depth, source fidelity, claim scope, formal fidelity, representation, graphics, material quality, attachment honesty, …) — but express them **independently** in the Expository family.

Shared infrastructure may later be appropriate where genuinely product-independent; must be **additive** and **preserve** Interactive behaviour.

**Test:** Would this change alter an existing Interactive prompt or its pedagogical behaviour merely so Expository can work? → Prefer a sibling Expository solution.

---

## Core Planning questions (to be decided in this sprint — not now)

1. First-class Expository product definition and Create-level representation.  
2. Expository topology (retained stages; bypassed/sibling stages; authority flow).  
3. Expository prompt family (which stages need distinct prompts; pedagogical ownership) — without authoring production prompt text unless later authorised.  
4. Contracts (product-independent reuse vs sibling Expository contracts; avoid premature schema detail).  
5. Knowledge/richness authority (source, `learning_content`, MK, LOs, downstream exposition).  
6. Whole-resource narrative continuity ownership (no chunk+thin-glue default; no final AI rewrite that compromises stage authority).  
7. Supporting intellectual materials and representation without Interactive activity semantics.  
8. Page / assembly / renderer — minimum adaptations for reading/viewing.  
9. Naming — shared subsystem concepts vs Interactive-specific names (e.g. DLA/GAM).  
10. Quality / acceptance — judgement framework for an excellent first Expository Resource.

Detailed Planning brief (task list, decision gates) will be supplied separately after this pack is reviewed.

---

## Deliberately non-blocking

Do **not** require Sprint 84 to solve: Expository→Interactive transformation; Workshop consumption of Expository; Podcast/Presentation; final Research Synthesis identity. Record implications if they arise; do not enlarge the first Expository design.

---

## Planning posture

- Prefer the **smallest coherent architecture**.  
- Do **not** create a generic output/product extensibility framework.  
- Do **not** preserve Interactive terminology merely to avoid a better Expository sibling concept.  
- Do **not** invent new abstractions where existing product-independent machinery fits.

**Repeated test:**

> Is this shared because the responsibility is genuinely the same, or merely because sharing looks architecturally tidy?

Optimise for pedagogical coherence, authority clarity, implementation safety, and comprehensibility.

---

## Non-goals (binding at open)

- Implementation of Expository Resource  
- Production code / prompt / schema / UI / renderer / test changes  
- Authoring production Expository prompts  
- Detailed Planning task list invented ahead of the separate brief  
- Opening an implementation sprint  
- Reopening Sprint 83  

---

## Authoritative Sprint 83 inputs

| Input | Path |
| ----- | ---- |
| Closure | [SPRINT-83-CLOSURE.md](../2026-09-21-sprint-83-expository-resource-investigation/SPRINT-83-CLOSURE.md) |
| Investigation report | [S83-INVESTIGATION-REPORT.md](../2026-09-21-sprint-83-expository-resource-investigation/S83-INVESTIGATION-REPORT.md) |
| Sibling / protected baseline | [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline) |
| Backlog | [PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource) |

Do **not** reinterpret Sprint 83 findings as implementation decisions. Findings remain evidence for Planning decisions to be made under the forthcoming brief.
