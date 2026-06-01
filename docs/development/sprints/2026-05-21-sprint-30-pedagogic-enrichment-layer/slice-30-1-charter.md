# Slice 30-1 charter — Orientation & narrative coherence

**Status:** **Draft** — ready for implementation approval  
**PEC:** `orientation_contract`  
**Date:** 2026-05-21

**Parent:** [`sprint-30-charter.md`](sprint-30-charter.md) Phase 1

---

## Goal

Self-directed learner pages give independent students a **clear intellectual entry point** and **coherent progression** across activities — without facilitator voice, tutoring chat, or new workflow steps.

---

## In scope

| Item | Detail |
|------|--------|
| PEC implementation | `orientation_contract` only |
| Steps | **Design Learning Activities**, **Design Page** (GAM optional: realise orientation text if `required_materials` specifies) |
| Activation | `delivery_context: self_directed` + learner page signals (existing gates) |
| Fields | Strengthen `activity_preamble`; add optional `study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge` per [`pec-registry.md`](pec-registry.md) |
| Prompts | Append `pel_orientation_contract_v1` block (name TBD) via new scaffold hook |
| Tests | Marx + RNA brief resolution unchanged; new orientation coverage tests |
| Renderer | **30-1b** — only if new page-level keys; reuse preamble/cognition display where possible |

---

## Out of scope (30-1)

- `reasoning_contract`, `metacognition_contract`
- New workflow steps
- Cognition pack changes
- Broad renderer/CSS work
- Brief resolver changes (unless blocking — escalate)

---

## Field policy

| Field | Policy |
|-------|--------|
| `activity_preamble` | **Required** non-empty on every activity (align with existing self-directed OUTPUT CONTRACT) |
| `study_orientation` | **Page-level** 2–4 sentences when ≥2 activities; topic-specific |
| `intellectual_frame` | Optional; one per page or first activity |
| `intellectual_coherence_bridge` | Optional; on activities 2+ when multi-activity page |
| `prior_knowledge_activation` | Optional; only if not redundant with preamble |

**Anti-patterns to prompt against:** “Welcome to this module”; “In this session we will”; facilitator timing (“minutes 5–15”).

---

## Implementation checklist

- [ ] `SPRINT_30_PEC_REGISTRY` + `resolvePedagogicEnrichmentContractIds` in `app.js`
- [ ] `applyPedagogicEnrichmentContractScaffoldToDraft` wired through `applyWorkflowStepRuntimePromptAugmentations`
- [ ] DLA OUTPUT CONTRACT lists orientation fields
- [ ] Design Page preservation scaffold lists orientation fields
- [ ] `evaluatePedagogicEnrichmentContractSatisfaction` (orientation subset) for tests
- [ ] `__PRISM_TEST_API` exports
- [ ] Tests: `tests/workflow-pel-orientation.test.js` (or extend framing adoption)
- [ ] `node --test tests/*.test.js` ≥ **430**
- [ ] Update [`enrichment-evidence-matrix.md`](enrichment-evidence-matrix.md) after live probe

---

## Regression probes (must pass)

| Probe | Test / check |
|-------|----------------|
| P30-03 Workshop | `tests/workflow-brief-learner-resource-defaults.test.js` (workshop row) |
| P30-03 Peer cognition | `tests/workflow-ld-cognition-contracts.test.js` |
| Facilitated DLA | No self-directed OUTPUT CONTRACT on workshop brief |

---

## Success rubric (manual, live page)

| Criterion | Pass |
|-----------|------|
| Learner understands page purpose in &lt;30s reading | Yes / No |
| Activities feel sequentially connected | Yes / No |
| No facilitator choreography language | Yes / No |
| Topic-specific (not generic boilerplate) | Yes / No |

Record in `context-files/probe-p30-01-marx-live.md` when run.
