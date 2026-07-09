# Ownership Model — Sprint 58

Derived from Sprint 56F [ownership-matrix-vnext.md](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/ownership-matrix-vnext.md), adjusted for **partial output** semantics.

---

## Stage ownership (partial artefact contents)

| Stage | `assembly_state.current_stage` | Partial artefact contains | Must NOT contain |
| ----- | -------------------------------- | ------------------------- | ---------------- |
| **Episode Plan** | `episode_plan` | **Full shell:** `title`, `audience`, `page_profile`, `learning_outcomes`, `episode_plans`, `activities[]` skeleton, `page_synthesis {}`, `source_artefacts`, `generation_notes`, `assembly_state` | DLA pedagogy, `materials[].body`, `learning_sequence`, populated `page_synthesis` |
| **DLA** | `dla` | `activities[]` instructional fields, `required_materials`, cognition/scaffold fields, `assembly_state` | Shell top-level (title, LO, EP arrays), `materials[].body`, `page_synthesis`, `sections[]`, `learning_sequence` |
| **GAM** | `gam` | `activities[{ activity_id, materials[] }]`, `assembly_state` | DLA text fields, shell top-level, `page_synthesis`, `sections[]`, `learning_sequence` |
| **Learning Sequence** | `learning_sequence` | `learning_sequence`, `assembly_state` | `activities`, materials, shell, `page_synthesis` |
| **Design Page** | `design_page` | `page_synthesis` (vNext) and/or `sections[]`, `assembly_state` | Activity/material regeneration |
| **Assessment design** (future) | `assessment_design` | `assessment_check` or equivalent, `assembly_state` | TBD |
| **Assessment items** (future) | `assessment_items` | assessment item fields, `assembly_state` | TBD |

---

## Assembly merge order

```
1. Episode Plan capture     → base document
2. DLA partial              → merge activities[] by activity_id (overlay DLA fields)
3. GAM partial              → merge activities[].materials[] by activity_id + material_id
4. Learning Sequence        → set learning_sequence (top-level)
5. Design Page              → set page_synthesis / sections[]
6. Assessment (future)      → set assessment_check
```

Later stages never delete earlier owned fields unless explicitly overwritten by same field path in assembly rules.

---

## Activity merge rules

| Field source | Merge key | Behaviour |
| ------------ | --------- | --------- |
| EP shell | `activity_id` | Creates activity row skeleton |
| DLA partial | `activity_id` | Overlays instructional + `required_materials`; preserves `episode_plan` from shell if absent in partial |
| GAM partial | `activity_id` | Sets/replaces `materials[]` only; does not remove DLA scalars |

Unknown `activity_id` in partial → assembly **error**.

---

## Material merge rules

- Match `material_id` exactly (no LO→A remapping).
- GAM partial may emit only `{ activity_id, materials[] }` per activity.
- `required_materials` from DLA/EP must survive GAM merge.

---

## Assembly metadata

`assembly_state.enriched_by` — union of all contributed stages, ordered by `STAGE_ORDER`.

`assembly_state.current_stage` — last stage present in captures.

---

## Prompt ownership reminder

Stages own **generation** of their fields in Copilot. They do **not** own preservation of other stages' fields in output JSON. PRISM owns **assembly** of the final page.

---

## Schema note

vNext schema describes the **complete** assembled page. Per-stage partial shapes are a validation subset — see [test-strategy.md](test-strategy.md).

There is no `page_layout` field in the frozen schema. Design Page partial output uses `page_synthesis` (and optionally legacy `sections[]` for renderer dual-read).
