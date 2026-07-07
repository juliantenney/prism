# Sprint 56D — Context Locks

**Sprint:** 56D — Design Page Material Preservation Fix  
**Date:** 2026-07-06  
**Status:** **Binding for all 56D work**

These locks are **non-negotiable**. They inherit frozen Sprint 56C architecture and CP-4 decisions.

---

## Architecture locks

| Lock | Rule |
| ---- | ---- |
| **CP-4 frozen** | Do not reopen CP-4 approval brief or reverse D1–D7 decisions |
| **Transport-first identity** | Design Page preserves and embeds upstream learner-facing content |
| **Bounded assembly-coherence only** | Thin bridge remains wrapper-gap-only; do not expand generative scope |
| **OQ-02** | Organisation boundary — no broad authoring restoration |
| **OQ-17** | Knowledge transport-or-omit — no synthesis mandates |
| **OQ-13–16** | No DP generative VA mandate |
| **56C closure** | Do not modify 56C closure artefacts or reclassify wave outcomes |

---

## Preservation locks

| Lock | Rule |
| ---- | ---- |
| **No DP authoring** | Do not reintroduce Design Page content authoring, summarisation, or synthesis |
| **No regeneration fix** | Do not solve truncation by asking Design Page to regenerate material bodies |
| **No summarisation** | Do not summarise material bodies for brevity, readability, or page size |
| **No ellipses** | Do not rely on ellipses (`...`) as stand-ins for omitted body text |
| **No LLM substitutes** | Do not replace GAM material bodies with LLM-composed equivalents |
| **Verbatim transport** | GAM `Content:` body must equal Design Page `activity.materials.<field>` body (JSON escaping only) |

---

## Structural locks

| Lock | Rule |
| ---- | ---- |
| **Material IDs** | Preserve material IDs and mapping to field keys |
| **Activity IDs** | Preserve activity IDs and row membership |
| **Purposes** | Preserve material purpose lines where present in upstream |
| **Order** | Preserve material order within activities |
| **Full bodies** | Every required material body must be physically present in page JSON |

---

## Renderer locks

| Lock | Rule |
| ---- | ---- |
| **Render only** | Renderer may render, layout, and support interaction |
| **No substance change** | Renderer must not alter educational substance (summarise, paraphrase, substitute) |
| **No renderer-first fix** | Do not patch preservation failure in renderer when JSON is already thin |

---

## Implementation locks

| Lock | Rule |
| ---- | ---- |
| **Proven path only** | Fix the execution path proven by OQ-56D-00 and runtime analysis — workflow compose first; application hooks only if proven to execute |
| **Evidence before patch** | Identify truncation source with length/hash evidence before changing code |
| **Tests required** | Every fix must include regression tests |
| **No upstream churn** | Do not modify DLA or GAM unless evidence proves upstream failure |
| **No workflow regen** | Do not regenerate workflow as first-line fix |

---

## Validation lock

> Prism validates architecture and artefact compliance.  
> Prism does **not** validate runtime generation quality.

Sprint 56D may add **deterministic artefact tests** (GAM JSON vs page JSON equality). Live Copilot compose quality remains outside Prism runtime validation unless captured artefacts are compared structurally.

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56D-CONTEXT-LOCKS.md` |
| Sprint | 56D |
| Authority | Inherited from [56C Governance Sign-Off](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-GOVERNANCE-SIGNOFF.md) |
