# design-page.schema.vNext — Schema Freeze Proposal

**Sprint:** 56F  
**Status:** **Frozen** — see [design-page-schema-freeze-signoff.md](design-page-schema-freeze-signoff.md) and [design-page.schema.vNext.json](design-page.schema.vNext.json)  
**Date:** 2026-07-07  
**Schema version string:** `2.0.0` (alias: vNext)

---

## Executive summary

| Decision | Choice |
|----------|--------|
| Architecture | Progressive enrichment; **no Design Page merge** |
| Page synthesis | `page_synthesis` object — not `sections[]` wrappers |
| Activities | Top-level `activities[]` |
| Materials | `activities[].materials[]` array with stable `material_id` |
| Assessment / sequence | Top-level `assessment_check`, `learning_sequence` |
| `sections[]` | Deprecated persistence; renderer adapter during migration |
| `finalise_page` | Sole writer of `page_synthesis` |
| 56E orphan journey arrays | Removed |

---

# 1. Proposed schema structure

## Top-level Page

```
Page
├── artifact_type          = "page"              [required]
├── schema_version         = "2.0.0"              [required]
├── title                  string                [required]
├── audience               string                [required]
├── page_profile           PageProfile           [required]
├── assembly_state         AssemblyState         [required]
├── page_synthesis         PageSynthesis         [required object; keys optional]
├── activities             Activity[]            [required, min 1]
├── learning_sequence      LearningSequence      [optional]
├── assessment_check       AssessmentCheck       [optional]
├── learning_outcomes      LearningOutcome[]     [required, may be []]
├── episode_plans          EpisodePlan[]         [required if EP in workflow]
├── source_artefacts       SourceArtefact[]      [required]
├── constraints_applied    ConstraintsApplied    [optional]
└── generation_notes       GenerationNotes       [required]
```

## PageProfile

```
profile_type       [required]   learner | facilitator | assessment
mode, level, delivery_context   [optional]
```

## AssemblyState

```
enriched_by        string[]     append-only per stage
current_stage      string       [optional]
page_shell_id      string       [optional]
```

## PageSynthesis (owner: finalise_page)

```
overview           SynthesisText         [optional; recommended learner]
learning_purpose   SynthesisText         [optional; recommended learner]
knowledge_summary  KnowledgeSummary      [optional]
study_tips         SynthesisText         [optional]
support_notes      SynthesisText         [optional]
```

**SynthesisText:** `body` (required when present), `format` (markdown | plain_text), `heading` (optional).

**KnowledgeSummary:** `concepts[]` { name, definition }, `relationships`, `use_in_activities`, optional prose `body` fallback.

**No** reflection / transfer / consolidation keys at page_synthesis level.

## Activity (owner: Episode Plan shell + DLA + GAM)

**Required:** activity_id, title, learner_task, expected_output, activity_preamble (learner), required_materials[], materials[] (after GAM).

**PEL orientation (DLA):** study_orientation, intellectual_frame, intellectual_coherence_bridge.

**Cognition (DLA):** reasoning_orientation, self_explanation_prompt, evidence_use_prompt, argument_structure_hint, conceptual_contrast_prompt, disciplinary_lens, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt, prior_knowledge_activation.

**Cognition packs (conditional):** misconception_claim, reconciliation_prompt, evidence_contrast, peer-instruction fields, transformation fields.

**Task:** support_note (singular), purpose, duration_minutes, learning_outcome_ids.

**Materials:** see Material model.

**Episode linkage:** episode_plan_id, episode_plan_source_activity_id, episode_plan { archetype, beats[] }.

**Deprecated (reject on new emit):** orienting_preamble, activity_framing, row support_notes, facilitator_moves, pel_links, journey_extensions, schema-only journey arrays.

## Material (owner: GAM)

```
material_id, material_type, title, body, body_format
```

Write-once at GAM. Immutable after GAM stage.

## LearningSequence (owner: Learning Sequence)

```
ordered_activity_ids   [required when present]
is_binding, notes
timeline[]: activity_id, phase_type, transition_to_next, timing fields
```

## AssessmentCheck (owner: Assessment)

```
items[]: item_id, prompt, options?, expected_evidence?, success_criteria[]
feedback_guidance[]
```

---

# 2. Ownership matrix (summary)

| Object | Owner | Immutable after |
|--------|-------|-----------------|
| page_profile, audience, constraints_applied | Profile | Profile |
| activity_id slots, episode_plans[] | Episode Plan | Episode Plan |
| activities[] pedagogy, required_materials | DLA | DLA |
| activities[].materials[] | GAM | GAM |
| learning_sequence | Learning Sequence | Learning Sequence |
| assessment_check | Assessment | Assessment |
| learning_outcomes[] copy | Learning Outcomes | LO copy |
| page_synthesis | finalise_page | finalise_page |
| title (if unset) | finalise_page | finalise_page |
| source_artefacts | append per stage | — |

LC/KM: upstream only; read by finalise_page for transport — **do not write page directly**.

---

# 3. Enrichment lifecycle

```
Profile → Episode Plan → DLA → GAM → Learning Sequence → Assessment? → finalise_page? → Renderer
```

| Stage | Writes | Locks |
|-------|--------|-------|
| Profile | audience, page_profile, constraints_applied, default title | profile fields |
| Episode Plan | page shell, activities[] ids, episode_plans[] | activity_id, membership |
| DLA | row pedagogy, required_materials | row fields |
| GAM | materials[].body | material bodies |
| Learning Sequence | learning_sequence | order/timeline |
| Assessment | assessment_check | items |
| finalise_page | page_synthesis, title if empty, provenance | page_synthesis |
| Renderer | (none persisted) | — |

---

# 4. Migration plan

| Legacy | vNext |
|--------|-------|
| sections[].overview … study_tips | page_synthesis.* |
| sections[].learning_activities.content | activities[] |
| sections[].assessment_check | assessment_check |
| sections[].learning_sequence | learning_sequence |
| materials.text (object map) | materials[] entries |
| activity_materials markdown pack | GAM writes JSON in page |
| sections[] persistence | deprecated |

**Renderer:** `normalizePageForRender()` dual-read; inject synthetic sections from page_synthesis for existing HTML path.

**Workflow:** Retire Design Page step; add finalise_page.

---

# 5. Open decisions — resolved 2026-07-07

| ID | Issue | Resolution |
|----|-------|------------|
| OD-01 | finalise_page mandatory? | **Optional step;** `page_synthesis` object required, child keys optional |
| OD-02 | knowledge_summary prose-only allowed? | **Yes** with `prose_only_fallback` audit flag when KM bound |
| OD-03 | activities[] top-level vs nested | **Top-level** (frozen) |
| OD-04 | title owner | **Profile** default; **finalise_page** if empty |
| OD-05 | learning_outcomes always [] vs omit | **Always present** array |
| OD-06 | episode_plans conditional | **Required iff** EP step in workflow (optional in JSON Schema) |
| OD-07 | cognition pack namespace | **Flat keys** on Activity (frozen) |
| OD-08 | material_type enum | **Open string** + documented vocabulary |
| OD-09 | LC/KM write page_synthesis? | **No** — finalise transport only |
| OD-10 | schema_version value | **`"2.0.0"`** (frozen) |

---

# Freeze checklist

- [x] Approve page_synthesis model
- [x] Approve top-level activities[]
- [x] Approve finalise_page as sole page_synthesis writer
- [x] Approve removal of 56E orphan fields
- [x] Approve Design Page step retirement
- [x] Approve renderer dual-read scope
- [x] Resolve OD-01–OD-10
- [x] Generate JSON Schema — [design-page.schema.vNext.json](design-page.schema.vNext.json)

**Next step:** Implementation sprint (Episode Plan shell, GAM JSON enrich, renderer adapter, retire DP step).

---

## Related documents

- [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md)
- [page-synthesis-vs-sections-investigation.md](page-synthesis-vs-sections-investigation.md)
- [finalise-page-responsibility-definition.md](finalise-page-responsibility-definition.md)
- [ownership-matrix-vnext.md](ownership-matrix-vnext.md)
- [architecture-decision.md](architecture-decision.md)
