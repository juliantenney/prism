# Sprint 56B — Architecture Guardrails

**Sprint:** 56B — Design Page Migration Planning & Architecture Approval  
**Status:** Governance artefact — **Sprint 56C** execution guardrail checklist  
**Date:** 2026-07-06  
**Authority:** [SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md](SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) (CP-4 approved)

**Governing principles (frozen at CP-4):**

- [Assembly-Time Ownership](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md)
- Preservation First
- [Presentation Inference Constraint](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md)
- Renderer Independence Principle

**This document does not propose implementation. It defines boundaries for implementation planning and review.**

---

## A. Design Page must not

- Re-synthesise knowledge (including `knowledge_summary` authoring — [OQ-17](DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) transport-or-omit only)
- Generate study tips from GAM signals instead of transporting material bodies
- Generate instructional explanations in wrapper or overview sections
- Generate pedagogical summaries of activity or material content
- Generate visual affordance specifications (`visual_affordances[]`, `source_basis`, schema 38.4 emission — [OQ-13–16](DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md))
- Perform wrapper rhetoric optimisation (progression vocabulary, epistemic closure bullets, editorial polish)
- Condense or shorten upstream educational content for readability, brevity, or token budget
- Reintroduce the **triple wrapper stack** (journey + authorial + rhetoric as separate generative mandates)
- Depend on **brevity parameters** as content-shaping controls on the emit path

---

## B. Renderer must not

- Generate educational content
- Require API-key-backed content creation for correct learner output
- Alter educational substance (summarise, paraphrase, or substitute bodies)
- Create assessment questions, feedback, hints, summaries, or explanations at render time
- Turn presentation inference into pedagogical authoring ([Presentation Inference Constraint](DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md))

---

## C. Design Page may

- Preserve upstream content (DLA scaffold fields, GAM `Content:` bodies)
- Embed materials verbatim into `activity.materials.*`
- Organise page structure (schema, membership, ordering, `page_profile`, section slots)
- Apply meaningful headings (structural — not instructional front-load)
- Transport upstream bodies verbatim (LC/KM excerpts, LO framing, assessment items, episode plans)
- Create **thin assembly-coherence prose** only where the [Assembly-Time Ownership Test](DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) applies (navigation, sequencing, relationships — not instructional substance)

---

## D. Renderer may

- Present content (typography, hierarchy, spacing, activity boundaries)
- Apply layout and visual structure
- Support browser interactivity using **provided** artefact data
- Display provided assessment content (stems, options, structured items)
- Score or reveal feedback **only** from provided artefact fields — not invented at render time
- Infer presentation behaviour (placement, hooks, hierarchy) **without** creating new educational substance ([OQ-14](DESIGN-PAGE-OQ-14-VISUAL-AFFORDANCES-RELOCATION-TARGET-REVIEW.md) default path)

---

## E. Future architecture topic — Assessment & Interactive Delivery

**Status:** Recorded for future planning — **not** a CP-4 reopening.

Current Sprint 56B workflows under-test MCQs and formative assessment items as **transported** structured content.

Future assessment work may require browser interactivity, scoring, feedback reveal, or attempt handling.

**This must not be interpreted as permission for renderer-side assessment authoring.**

Assessment content, answers, rubrics, hints, and feedback must be **authored upstream** and **preserved in the artefact**. The renderer may **present** and **interact with** provided data only.

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56B-ARCHITECTURE-GUARDRAILS.md` |
| Consumers | CP-5 implementation planning · **Sprint 56C** · [execution checklist](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-EXECUTION-CHECKLIST.md) |
| Change policy | Amendments that relax §A–B require new architecture decision (post-CP-4) |

**Governance artefact only.**
