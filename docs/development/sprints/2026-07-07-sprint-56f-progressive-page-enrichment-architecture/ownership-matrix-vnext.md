# Ownership Matrix — vNext

**Sprint:** 56F  
**Status:** Freeze proposal companion  
**Supersedes:** Preliminary rows in [ownership-matrix.md](ownership-matrix.md) where they conflict.

---

## Field / structure ownership

| Field / structure | Owner | Write stage | Read stages | Immutable after |
|-------------------|-------|-------------|-------------|-----------------|
| artifact_type, schema_version | Episode Plan | EP create | all | EP |
| title | Profile → finalise_page | Profile; finalise if empty | all | finalise_page |
| audience, page_profile | Profile | Profile | all | Profile |
| constraints_applied | Profile | Profile | all | Profile |
| assembly_state.enriched_by | (system) | each stage append | audit | — |
| page_synthesis.* | finalise_page | finalise_page | Renderer, audit | finalise_page |
| activities[].activity_id | Episode Plan | EP | all | EP |
| activities[].title (shell) | Episode Plan | EP | DLA | DLA |
| activities[].learner_task, expected_output | DLA | DLA | Renderer | DLA |
| activities[].activity_preamble, PEL, cognition | DLA | DLA | Renderer | DLA |
| activities[].required_materials[] | DLA | DLA | GAM | DLA |
| activities[].materials[] | GAM | GAM | Renderer, finalise (read) | GAM |
| activities[].episode_plan* | Episode Plan | EP | Renderer | EP |
| learning_sequence | Learning Sequence | LS | Renderer, finalise (read) | LS |
| assessment_check | Assessment | Assessment | Renderer | Assessment |
| learning_outcomes[] | Learning Outcomes | LO copy-in | DLA, finalise, Renderer | LO copy |
| episode_plans[] | Episode Plan | EP | DLA, Renderer | EP |
| source_artefacts[] | (provenance) | each stage | audit | append-only |
| generation_notes | (audit) | each stage slice | audit | merge only |

---

## Explicit non-owners

| Former owner | Field | New owner |
|--------------|-------|-----------|
| Design Page | Merge all artefacts | **None** — enrichment replaces |
| Design Page | page_synthesis / wrapper sections | **finalise_page** |
| Design Page | Copy GAM markdown | **GAM** (JSON in page) |
| Design Page | Material body transport | **GAM** |
| Renderer | Journey Compass fields | **Derived** — not in schema |

---

## Category map

| Category | Owner | vNext location |
|----------|-------|----------------|
| A Material | GAM | activities[].materials[] |
| B Activity pedagogy | DLA | activities[] |
| C Sequence / transitions | Learning Sequence | learning_sequence |
| D Page synthesis | finalise_page | page_synthesis |
