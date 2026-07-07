# finalise_page Responsibility Definition

**Sprint:** 56F  
**Status:** Approved investigation outcome (supersedes wrapper-only framing in early 56F scaffold)  
**Date:** 2026-07-07

---

## Summary

`finalise_page` is **not** headings-only. It is the **sole writer** of `page_synthesis` — page-level framing and closure that requires cross-activity context. It is **not** a merge step and does not touch materials or activity pedagogy.

---

## May generate

| Content | Condition | Caps |
|---------|-----------|------|
| page_synthesis.overview | No LC/upstream body transported | ≤80 words gap-fill (thin assembly) |
| page_synthesis.learning_purpose | No upstream body | ≤80 words; structural orientation only |
| page_synthesis.knowledge_summary | KM/LC bound, no projection yet | Structured concepts preferred; no glossary dump |
| page_synthesis.study_tips | No GAM closure to transport | 2–4 bullets; epistemic synthesis; no diary tone |
| page_synthesis.support_notes | Profile/facilitator needs | Transport or minimal |
| title | Empty after Profile/EP | Deterministic derivation preferred |
| source_artefacts | Always | Append provenance entry |
| generation_notes | Always | Stage slice only |

**Transport-first:** If upstream body exists, copy verbatim — do not paraphrase for coherence.

---

## Must not generate

- activities[].materials[].body (any type)
- learner_task, expected_output, PEL/cognition row fields
- episode_plans[] beats or replanning
- learning_sequence.ordered_activity_ids / timeline facts
- assessment_check.items[]
- Activity membership changes or ID remapping
- Summaries of material bodies in wrapper slots (PREC-02)

---

## May read

- Complete enriched `page` artefact
- Upstream `learning_content`, `knowledge_model`, `learning_outcomes` (when bound)
- GAM closure/debrief material **text** for study_tips transport only (not rewrite)
- page_profile, constraints_applied

---

## Must not modify (immutable before finalise)

| Field | Locked by |
|-------|-----------|
| activity_id, material_id | Episode Plan / DLA / GAM |
| activities[].* pedagogy | DLA |
| materials[].body | GAM |
| learning_sequence | Learning Sequence |
| assessment_check | Assessment |
| episode_plans[] | Episode Plan |

---

## Implementation preference

1. **Deterministic** finalise for title, provenance, verbatim transport
2. **Optional bounded LLM** for gap-fill on empty page_synthesis slots only (journey assimilation caps)
3. **Valid:** Skip finalise if LC/KM pre-supply all synthesis bodies and product accepts empty study_tips

---

## Historical modules (successor role)

Removed from Design Page path (56C) but define intended semantics:

- `LD-JOURNEY-ASSIMILATION` — inquiry arc, closure
- `LD-AUTHORIAL-EXPOSITION` — rhetorical role separation
- `LD-THIN-ASSEMBLY-COHERENCE` — transport-first, prohibited synthesis on DP

These inform **finalise_page** contracts, not Design Page.
