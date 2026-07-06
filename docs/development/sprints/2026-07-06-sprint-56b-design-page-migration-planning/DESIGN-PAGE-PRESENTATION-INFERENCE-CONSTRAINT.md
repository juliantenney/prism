# Design Page — Presentation Inference Constraint

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Planning artefact — normative boundary constraint  
**Date:** 2026-07-06  
**Version:** 1.0  

**Governs:** Assembly-time ownership (OQ-02) · Renderer inference (OQ-14) · All downstream presentation layers  

**Related:**
- [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) v1.0
- [DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md)
- [DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md)

**Citable during:** Workstream 2 boundary reviews · OQ-14 · Sprint 57 presentation scope · Architecture approval **CP-2** · **CP-4**

**This document does not propose implementation, prompt changes, code changes, renderer changes, or workflow modifications.**

---

## 1. Normative constraint

> **Assembly-time ownership and renderer inference are limited to organisation, navigation, presentation, and rendering concerns.**
>
> **Neither Design Page nor downstream renderers may create new instructional, explanatory, summarising, interpretive, or pedagogical content.**
>
> **Educational intent remains upstream.**  
> **Educational substance remains upstream.**  
> **Rendering concerns remain downstream.**

---

## 2. Purpose

OQ-02 established **when** Design Page may own assembly-coherence prose. OQ-14 relocated visual affordance specification to **renderer inference** by default. Together these decisions risk a **downstream authoring backdoor**: presentation or inference stages re-introducing the instructional generation that upstream ownership and transport identity were designed to prevent.

The Presentation Inference Constraint closes that gap. It applies **symmetrically**:

| Stage | Bounded to |
| ----- | ---------- |
| **Design Page** (assembly-time generative obligations) | Organisation · navigation · presentation framing · assembly coherence |
| **Renderer / UI / export** (inference and presentation) | Layout · hierarchy · typography · visual placement · structural rendering of **existing** upstream substance |

Neither stage may cross into **educational authoring**.

---

## 3. Scope definitions

| Term | Meaning | Owner |
| ---- | ------- | ----- |
| **Educational intent** | Pedagogical purpose, learning design rationale, what the learner should achieve | **Upstream** — DLA, LC/KM, LO, DEP, workflow brief |
| **Educational substance** | Teachable content: explanations, worked examples, scenarios, tables, assessment items, task instructions | **Upstream** — primarily **GAM** (`materials.*`) and DLA scaffold fields |
| **Organisation** | Membership, ordering, section slots, artefact binding, schema shape | **Design Page** (Layer 2) |
| **Navigation** | Journey sequencing signals, cross-activity pointers, section-to-section movement | **Design Page** (bounded assembly-coherence) or **renderer** (UI chrome) |
| **Presentation** | How existing content is **framed** without changing its instructional meaning — headings, spacing, activity boundaries, table readability | **Renderer** |
| **Rendering** | Transforming transported JSON into learner-visible output without adding teachable prose | **Renderer** |

---

## 4. Allowed vs disallowed

### Design Page (assembly-time)

| Allowed | Disallowed |
| ------- | ---------- |
| Assembly-coherence prose per [Assembly-Time Ownership Test](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) §4 Allowed categories | Instructional explanations, summaries, interpretations |
| Structural framing of relationships between **already-transported** activities | LC/KM re-synthesis, GAM paraphrase, knowledge summary authoring (OQ-17) |
| Passive transport of upstream fields | VA specification records (OQ-13), `source_basis` citations (OQ-15) |

### Renderer / downstream inference

| Allowed | Disallowed |
| ------- | ---------- |
| Infer **layout** and **presentation** from embedded `materials.*` and `sections[]` | Generate new explanatory prose, summaries, or pedagogical commentary |
| Place visual hooks, typography, hierarchy, activity boundaries | Invent figures, diagrams, or tables not present in upstream substance |
| Reorder **presentation** of materials per role-precedence rules when substance is preserved | Condense, paraphrase, or substitute bodies with interpretive labels |
| Render empty or optional metadata slots without filling them with teachable content | Use inference to satisfy Layer 1 completeness without embedded bodies |

### Visual affordances (OQ-14 default path)

Under renderer inference, VA is **presentation inference only**:

| Allowed | Disallowed |
| ------- | ---------- |
| Decide **whether** and **where** to surface visuals **already present** in GAM materials | Decide to **generate** new instructional visuals not realised upstream |
| Presentation slots, hooks, hierarchy for existing content | `pedagogical_added_value` reasoning that substitutes for material embed |
| Legacy/heuristic placement when explicit VA records absent (as-built) | Authoritative mode that treats metadata as substitute for missing bodies |

---

## 5. Relationship to Assembly-Time Ownership Test

The Assembly-Time Ownership Test governs **Design Page prose** obligations. This constraint **extends the same boundary logic downstream**:

| Assembly-Time principle | Presentation Inference expression |
| ----------------------- | --------------------------------- |
| T1/T2 → transport only | Renderer consumes transported substance; does not replace DLA/GAM |
| §4 Allowed: relationships, sequencing, navigation | Renderer may present navigation chrome; not re-teach content |
| §4 Disallowed: instructional substance | Renderer may not summarise, explain, or interpret for the learner |
| Corollary 3: explicit denial | Applies to **all** downstream presentation, not only Design Page |

**Assembly-coherence prose** on Design Page remains the **only** permitted generative learner-facing text category — and only where T3 = Yes and §4 Allowed applies. Renderer inference does **not** inherit a parallel generative licence.

---

## 6. Relationship to OQ-14 (VA relocation)

OQ-14 placed visual **specification** on renderer inference by default. This constraint **qualifies** that decision:

| OQ-14 element | Under Presentation Inference Constraint |
| ------------- | --------------------------------------- |
| Renderer inference as default VA target | **Presentation and placement inference** — not instructional visual authoring |
| GAM owns visual **substance** | Unchanged — figures and tables must exist in `materials.*` |
| DLA owns visual **intent** | Unchanged — intent is upstream, not inferred at render |
| Dedicated VA artefact (conditional) | Must not produce records that substitute for embed or author new pedagogy |
| Remove `source_basis` (OQ-15) | Consistent — path citation is not presentation inference |

Renderer inference **does not** reopen OQ-13. It cannot turn the renderer into a second Design Page.

---

## 7. Pipeline invariant (summary)

```
Educational intent     →  UPSTREAM (DLA, LC/KM, LO, brief)
Educational substance  →  UPSTREAM (GAM materials, DLA scaffold)
Organisation           →  DESIGN PAGE (transport + assemble)
Assembly-coherence     →  DESIGN PAGE (bounded, OQ-02 only)
Presentation           →  DOWNSTREAM (renderer)
Rendering              →  DOWNSTREAM (renderer)
```

**Forbidden zone for Design Page and renderer alike:** new instructional, explanatory, summarising, interpretive, or pedagogical content.

---

## 8. Sprint 56A alignment

| Finding | How constraint supports |
| ------- | ----------------------- |
| Transport-and-organisation identity | Prevents renderer from becoming alternate author |
| Layer 1 preservation | Substance must be embedded before presentation |
| Layer 3 narrowing | No downstream expansion of generative scope |
| Failure modes A, G | Blocks summarisation and index-without-embed at render |
| Audit §I VA demotion | VA inference limited to presentation of existing substance |

---

## 9. Approval and tracker

### Proposed entry — SPRINT-56B-ARCHITECTURE-APPROVAL-TRACKER.md

| Field | Value |
| ----- | ----- |
| **Finding** | F3h — Presentation Inference Constraint adopted |
| **Status** | **Resolved (planning)** — pending CP-4 |
| **Governs** | OQ-02 assembly-coherence bounds · OQ-14 renderer inference bounds |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md` |
| Version | 1.0 |
| Owner sprint | 56B |
| Consumers | W2 · OQ-14 · Sprint 57 · CP-2 · CP-4 |
| Change policy | Planning revision only; no implementation implied |

**Planning and approval artefact only.**
