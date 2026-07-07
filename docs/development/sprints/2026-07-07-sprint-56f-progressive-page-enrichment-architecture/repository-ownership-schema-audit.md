# Repository Ownership & Schema Audit

**Sprint:** 56F  
**Status:** Investigation complete (read-only)  
**Date:** 2026-07-07  
**Purpose:** Evidence base for `design-page.schema.vNext` freeze — field ownership, scope, and `finalise_page` boundary.

---

## Executive summary

| Finding | Implication |
|--------|-------------|
| Learner-support content is upstream-owned (DLA row fields, GAM material bodies) | No Design Page merge |
| Design Page LLM merge failed fidelity (56E) | Retire DP step |
| Page wrapper prose historically synthesized at DP via journey assimilation (removed 56C) | Belongs in `finalise_page` → `page_synthesis` |
| 56E schema orphan fields (`pel_links`, `confidence_checks`, etc.) have no producers | Remove from vNext |
| Reflection/transfer/consolidation at page level decompose to activity/material fields + `study_tips` | No separate page keys |

---

## Architectural categories

| Cat | Scope | Owner | Examples |
|-----|-------|-------|----------|
| **A** | Material | GAM | `materials[].body`, checklist, transfer_prompt, consolidation_summary |
| **B** | Activity | DLA | PEL/cognition row fields, learner_task, support_note |
| **C** | Section / multi-activity | Learning Sequence | timeline, transition_to_next, phase_type |
| **D** | Page | finalise_page | overview, learning_purpose, knowledge_summary, study_tips, support_notes |

---

## Activity-row fields (Category B — DLA)

**SSOT:** `lib/ld-design-page-compose-contract.js` `FIELD_PRESERVATION_FIELD_IDS`, `app.js` PEL_ORIENTATION / PEL_REASONING registries, Sprint 53 audit matrix.

| Field | Renderer | In evolving page? | vNext path |
|-------|----------|-------------------|------------|
| activity_preamble | util-activity-framing | Yes | activities[].activity_preamble |
| reasoning_orientation | util-pel-reasoning-cue | Yes | activities[].reasoning_orientation |
| self_explanation_prompt | util-cognition--explain | Yes | activities[].self_explanation_prompt |
| evidence_use_prompt, argument_structure_hint, conceptual_contrast_prompt | framing/Think | Yes | activities[] |
| transfer_or_application_task | util-cognition--transfer | Yes | activities[] (distinct from materials.transfer_prompt) |
| scaffold_hint_sequence, uncertainty_tension_prompt | util-cognition | Yes | activities[] |
| study_orientation, intellectual_frame, intellectual_coherence_bridge | PEL orientation | Yes | activities[] |
| prior_knowledge_activation | framing | Yes | activities[] |
| learner_task, expected_output, support_note | task/output/guard | Yes | activities[] |
| Cognition packs (misconception, peer instruction, transformation) | util-cognition packs | Conditional | activities[] flat keys |

**intellectual_coherence_bridge:** DLA at authoring (A2+); must not be assimilated into overview (`ld-thin-assembly-coherence.js`).

---

## GAM material types (Category A)

**SSOT:** `lib/page-role-registry.js`, Sprint 44 contracts, Sprint 50 inventory.

Canonical vNext: `activities[].materials[]` with `material_id`, `material_type`, `title`, `body`, `body_format`.

Key types: text, worked_example, checklist, scenario, prompt_set, template, tables, transfer_prompt, consolidation_summary, reflection_prompt, modelling_note, sample_output.

Embedded cognition cues in material bodies (GAM non-text materials only) remain inside `body`.

---

## Page wrapper fields (Category D)

| Field | Requires full page context? | Historical producer | vNext owner |
|-------|----------------------------|---------------------|-------------|
| overview | Yes | DP + journey assimilation | finalise_page → page_synthesis.overview |
| learning_purpose | Yes | DP + rhetoric | finalise_page → page_synthesis.learning_purpose |
| knowledge_summary | Partial (KM + activity map) | DP projection of KM/LC | finalise_page → page_synthesis.knowledge_summary |
| study_tips | Yes | DP closure synthesis | finalise_page → page_synthesis.study_tips |
| support_notes | Weak | DP / facilitator | finalise_page → page_synthesis.support_notes |

LC produces governing question upstream; KM produces `knowledge_model` — not page fields directly.

---

## Schema-only orphans (remove from vNext)

Found only in `design-page.schema.json` (56E), no runtime producers:

- pel_links, metacognition_checks, confidence_checks
- transfer_prompts[], consolidation_prompts[], reflection_prompts[] (arrays on Activity)
- journey_extensions

Use existing DLA + GAM fields instead.

---

## finalise_page boundary (evidence-based)

**May generate:** `page_synthesis` slots when transport absent (capped per LD-THIN-ASSEMBLY-COHERENCE); title if empty; provenance append.

**Must not generate:** material bodies, row pedagogy, episode replanning, assessment items, ID remap.

**May read:** full page, LC/KM/LO upstream, GAM closure signals (for study_tips transport).

**Must not modify after prior stages:** activities[], materials[].body, learning_sequence, assessment_check, episode_plans[].

See [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md).

---

## Ownership matrix additions

See [ownership-matrix-vnext.md](ownership-matrix-vnext.md) and [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md).

---

## Evidence sources

- `lib/ld-journey-assimilation.js`, `lib/ld-authorial-exposition.js`, `lib/ld-thin-assembly-coherence.js`
- `lib/ld-design-page-compose-contract.js`, `lib/ld-cognition-orientation.js`
- Sprint 50 pedagogic manifestation inventory, Sprint 53 fidelity matrix
- Sprint 56E schema-source-audit, schema-to-prompt-mapping
- Sprint 42-5 journey context investigation
- `app.js` renderer: PAGE_BODY_SECTION_IDS, buildJourneyCompassFromPage
