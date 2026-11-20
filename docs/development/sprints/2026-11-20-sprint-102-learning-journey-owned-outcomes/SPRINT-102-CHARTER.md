# Sprint 102 — Charter

**Sprint:** 102 — Learning Journey–Owned Outcomes and Commission-Native Component Authoring  
**Status:** **OPEN**  
**Opened:** 2026-11-20  
**Type:** Learning Journey curriculum coherence / commission-native component authoring  
**Opening:** [S102-D01](decisions.md#s102-d01--open-sprint-102)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Investigation plan:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Problem statement

Learning Journeys commission components that still typically run a full foundation chain (GLC → MK → DLO) before Episode Plan. That can re-author outcomes and content modelling the journey already intended to own, risking duplication, competing LO sets, and unnecessary model calls.

Sprint 101 established Practice and investigated commission-native EP entry (101G). Feasibility evidence exists (including a successful C4 five-stage path with supplied structured outcomes), but production still needs a coherent journey-owned outcomes model and a safe commission-native path that does not break standalone products.

---

## Sprint objective

Investigate and then implement a simpler Learning Journey component-authoring workflow in which:

1. The Learning Journey generates a coherent set of **journey-level learning outcomes**.  
2. It allocates specific outcomes and responsibilities to individual components.  
3. Component commissioning briefs carry those outcomes and relevant journey context as text, using the **existing commissioning mechanism** where possible.  
4. Component **Episode Plan (EP)** consumes the commissioned outcomes as **authoritative** rather than generating competing outcomes.  
5. The existing **EP → DLA → GAM → LS → DP** pipeline is reused wherever possible.  
6. **Standalone products retain** their existing GLC → MK → DLO workflow.

**Design principle:** The Learning Journey owns curriculum coherence; components realise their commissioned contribution.

---

## Agreed product decisions (locked at opening)

1. Learning Journeys remain PRISM’s primary instructional design product.  
2. Standalone Interactive, Practice (standalone-path products), Expository, Assessment Pack and Situated Task must not lose their existing foundation workflows where those apply today.  
3. Prefer text-based commission fields already in use over inventing new commission JSON keys, unless investigation proves they are insufficient.  
4. EP must not invent competing learning outcomes when commissioned journey outcomes are authoritative and sufficient.  
5. Journey-level QA is a **subsequent** workstream — not Sprint 102.  
6. Sprint 101 is **closed**; do not reopen it for polish.  
7. Do not regenerate Lagrange / C-series components as part of this sprint setup or investigation.

---

## Planned phases

| Phase | Intent | State |
| ----- | ------ | ----- |
| **102A** | Read-only investigation (outcomes, commissioning, EP binding, skip-foundation safety) | **PLANNED** — not yet authorised |
| **102B** | Design / contract for journey-owned outcomes + commission-native EP entry | Pending 102A |
| **102C** | Implementation readiness / gated design approval | Pending 102B |
| **102D** | Implementation (authorised after design gates) | Pending |
| **102E** | Validation and qualified close | Pending |

Exact phase labels may be refined after 102A; **102A requires separate authorisation** before execution.

---

## Guardrails

- Do not implement or change application code until authorised after investigation/design gates.  
- Do not modify prompts, validators, schemas or workflow definitions in the setup / 102A investigation phase.  
- Preserve standalone products and existing Learning Journeys.  
- Prefer existing commission text channels (`specification_text`, `journey_context_text`, dependencies, shared source) where they can supply EP.  
- Fail closed: do not invent disciplinary knowledge or LO statements to force a five-stage path.  
- Do not commit or push without explicit author request.

---

## Non-goals (this sprint)

- Journey-level QA programme  
- Reopening Sprint 101 deliverables (C4 A3 radios/prose, image-fragment hygiene, C4 image render verify) as Sprint 102 scope — carry forward as references only  
- Regenerating Lagrange / Practice C1–C4 packages  
- Deprecating standalone GLC → MK → DLO for Create-from-topic workflows  
- Broader pipeline redesign beyond commission-native component authoring
