# Sprint 56C — Execution Checklist

**Sprint:** 56C — Design Page Migration Execution  
**Status:** Active governance control  
**Date:** 2026-07-06  
**Authority:** [CP-4 approval](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Implementation plan](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md) · [Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)

**Use this checklist for every migration work package and review gate in Sprint 56C.**

**Validation scope:** Prism/Cursor validates architecture, prompts, implementation alignment, and artefact structures — not Copilot runtime outputs. See [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md).

---

## A. Governing principles verification

| Principle | Verification question | Pass? |
| --------- | --------------------- | ----- |
| **Assembly-Time Ownership** | Does any new DP generative prose pass T1→T2→T3 and §4 Allowed? | ☐ |
| **Preservation First** | Is educational substance transported from upstream — not re-authored on DP? | ☐ |
| **Presentation Inference Constraint** | Do DP and renderer changes limit themselves to organise/transport/present? | ☐ |
| **Renderer Independence Principle** | Does learner output remain complete without API-key or downstream generative services? | ☐ |

**Artefacts:** [Assembly-Time Ownership Test](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) · [Presentation Inference Constraint](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-PRESENTATION-INFERENCE-CONSTRAINT.md)

---

## B. Design Page ownership checks

| Check | Pass? |
| ----- | ----- |
| No knowledge synthesis (`knowledge_summary` authoring removed per OQ-17) | ☐ |
| No pedagogical summaries in wrapper/overview sections | ☐ |
| No study-tip generation from GAM signals (transport only) | ☐ |
| No instructional authoring on Design Page emit path | ☐ |
| Any remaining generative prose passes Assembly-Time Ownership Test | ☐ |
| No generative VA (OQ-13–16) | ☐ |
| No brevity params as content-shaping controls | ☐ |
| Triple wrapper stack not reintroduced | ☐ |

---

## C. Renderer boundary checks

| Check | Pass? |
| ----- | ----- |
| Renderer does not author educational content | ☐ |
| Renderer does not require API-backed content creation for correct output | ☐ |
| Renderer does not alter educational substance (summarise, paraphrase, substitute) | ☐ |
| Presentation inference remains presentation-only (layout, hierarchy, hooks) | ☐ |
| Assessment display uses provided artefact data only (no render-time question authoring) | ☐ |

**Artefact:** [Guardrails §B–D](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)

---

## D. Migration checks

Reference: [Implementation plan §4](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md)

### Removals (§4A)

| Check | Pass? |
| ----- | ----- |
| R-39, R-71 knowledge authoring removed from DP path | ☐ |
| R-41 synthesis / R-42 reference-without-embed removed | ☐ |
| R-43, R-49, R-51 wrapper rhetoric stack removed | ☐ |
| R-56–R-59 generative VA removed from DP | ☐ |
| R-78–R-80 brevity controls removed from DP | ☐ |
| Mandatory schema 38.4 / `source_basis` default path removed | ☐ |

### Retained (§4B)

| Check | Pass? |
| ----- | ----- |
| Layer 1 preservation (R-17–R-23, R-28–R-30) intact | ☐ |
| Layer 2 organisation intact | ☐ |
| Thin assembly-coherence only (R-40, R-44, R-45, R-47) | ☐ |
| R-83 narrowed to Layer 2 delimiter | ☐ |
| Preservation guardrails (R-22, R-24, R-46, R-50) active | ☐ |

### Relocations (§4C)

| Check | Pass? |
| ----- | ----- |
| Knowledge: transport-or-omit (not DP synthesis) | ☐ |
| VA: renderer inference default; no DP generative VA | ☐ |
| Voice/facilitator: profile/brief policy — not DP content ownership | ☐ |

---

## E. Validation readiness checks

*Prism/Cursor scope only — runtime output evaluation occurs in Copilot.*

| Check | Pass? |
| ----- | ----- |
| **OQ-24** dual-path **review framework** documented | ☐ |
| **OQ-25** canonical fixtures **identified** (definitions recorded) | ☐ |
| Fixture coverage defined for multi-activity, knowledge-bound, assessment, Copilot + PRISM artefact sources | ☐ |
| Acceptance invariant **structural** review checklist prepared for fixtures (learner-completable from page JSON) | ☐ |
| Failure modes A–G mapped to structural review criteria | ☐ |
| Compliance evidence recorded per wave exit (architecture/prompt/artefact — not runtime generation quality) | ☐ |
| Runtime acceptance testing delegated to Copilot environment where artefact capture requires generation | ☐ |

---

## F. Completion review

| Check | Pass? |
| ----- | ----- |
| Implemented state aligns with **CP-4 Approval Brief** (D1–D7) | ☐ |
| [Architecture Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) §A–D satisfied | ☐ |
| Frozen governing principles not reinterpreted | ☐ |
| SQ-1, SQ-2, SQ-F1, SQ-F2 outcomes recorded (or explicit deferral) | ☐ |
| Wave 1–4 exit criteria from implementation plan met | ☐ |

---

## G. Escalation rule

> **If implementation conflicts with a governing principle or ownership decision, stop implementation and raise a new architecture decision.**

Do not:

- Patch around the conflict in prompts or code without architecture review
- Reopen OQ-02, OQ-17, or OQ-13–16 without formal architecture decision
- Treat scope creep as an implementation detail

**Escalation path:** Record in tracker → architecture review → CP-4-level decision if principles affected.

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-EXECUTION-CHECKLIST.md` |
| Sprint | 56C |
| Wave gates | W1–W4 per implementation plan |
