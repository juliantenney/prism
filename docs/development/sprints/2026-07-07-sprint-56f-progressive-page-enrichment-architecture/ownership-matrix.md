# Ownership Matrix

> **SUPERSEDED (2026-07-07)** — Early scaffold (pre-audit). Rows below use `sections[]` framing and incomplete synthesis ownership.
>
> **Authoritative replacement:** [ownership-matrix-vnext.md](ownership-matrix-vnext.md)
>
> See also [repository-ownership-schema-audit.md](repository-ownership-schema-audit.md) and [design-page-schema-vnext-freeze-proposal.md](design-page-schema-vnext-freeze-proposal.md).

---

## Legend
- **Current:** who produces the field today (typical workflow)
- **Proposed:** who should own the field in progressive enrichment
- **Rationale:** why

| Field / structure | Current owner | Proposed owner | Rationale |
| ----------------- | ------------- | -------------- | --------- |
| `artifact_type: page` | Design Page | Episode Plan (create) | Page exists from first enrichment stage |
| Page shell / activity slots | Design Page (implicit) | Episode Plan | Choreography defines activity presence |
| `activity_id` | DLA | DLA (set once) | Activity identity originates in design |
| `activity.title` | DLA | DLA | Activity naming |
| `duration_minutes` | DLA / Sequence | DLA + Sequence | Structure from DLA; timing from Sequence |
| `learner_task` | DLA | DLA | Activity design |
| `expected_output` | DLA | DLA | Activity design |
| `mapped_learning_outcomes` | DLA | DLA | Outcome alignment |
| `required_materials[]` (IDs only) | DLA | DLA | Specifies which materials GAM must fill |
| `material_id` | GAM | GAM (immutable) | Material identity at authoring |
| `material_type` | GAM | GAM | Material classification |
| `material.title` | GAM | GAM | Material label |
| `material.body` | GAM (markdown pack) | GAM (JSON in page) | Full learner content — write once |
| `episode_plans[]` | Episode Plan | Episode Plan | Choreography ownership |
| `learning_sequence` | Learning Sequence | Learning Sequence | Order/timing authority |
| `learning_outcomes` | Learning Outcomes step | Learning Outcomes (reference) | Upstream authority; copied into page |
| Page `title` | Design Page (derived) | finalise_page or profile metadata | Page-level wrapper |
| `audience` | Profile / Design Page | Profile metadata | Delivery context |
| `page_profile` | Profile / Design Page | Profile metadata | Mode/context |
| `sections[]` wrapper | Design Page | finalise_page | Navigation/structure labels only |
| `overview` / `learning_purpose` | Design Page (derived) | finalise_page (transport upstream if present) | Wrapper only — not material substitute |
| `assessment_check` | Assessment step | Assessment step → page enrich | When assessment artefacts exist |
| `source_artefacts` | Design Page | Each enriching stage | Provenance appended per stage |
| `generation_notes` | Design Page | Per-stage or finalise_page | Reporting only — not fidelity authority |

## Fields explicitly not owned by Design Page / finalise_page

- All `material.body` content
- Activity pedagogical redesign
- Episode choreography replanning
- Sequence logic changes
- ID renaming or normalisation

## Merge responsibilities (retired)

| Former Design Page responsibility | New owner |
| --------------------------------- | --------- |
| Merge DLA + GAM + EP + Sequence | **None** — enrichment replaces merge |
| Parse GAM markdown blocks | **Removed** — GAM writes JSON into page |
| Copy material bodies | GAM enrichment (write-once) |
| Attach episode plans | Episode Plan + DLA linkage at enrich time |
| Preserve sequence order | Learning Sequence enrichment |
