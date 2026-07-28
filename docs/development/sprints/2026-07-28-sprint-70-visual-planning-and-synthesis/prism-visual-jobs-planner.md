# Prism Visual Jobs Planner — Sprint 70 Slice 4

**Status:** Frozen planner boundary (planner version **70.4**, schema **38.4**)  
**Module:** `lib/prism-visual-jobs-planner.js`  
**Public API:** `planPrismVisualJobs(page)`  
**Depends on:** `lib/visual-planning-contract.js` → `validateVisualPlanningContract(page)`

---

## Responsibility

Deterministic compiler from **validated** Design Page visual affordances into **canonical Prism visual jobs** with resolved evidence source content.

```
assembled page
  → validateVisualPlanningContract(page)
  → planPrismVisualJobs(page)
  → future Prism Prompt Builder
```

This slice does **not** build prompts, call image providers, create assets, or change learner rendering.

---

## Input boundary

- **Sole input:** one assembled page object
- **Required dependency:** Slice 3 validator (called first; contract logic is not duplicated)
- **Must not read:** workflow state, Design Page partials, prompt text, model responses, renderer state, HTML

---

## Decision handling

| `visual_decision` | Behaviour |
|-------------------|-----------|
| `generate` | Create exactly one visual job when all evidence anchors resolve |
| `defer` | No job; recorded in `diagnostics.deferred` |
| `skip` (legacy `reject`) | No job; recorded in `diagnostics.skipped` |

Authoritative planning present ⇒ legacy visual heuristics are **not** invoked.

---

## Visual-job schema (minimum)

Each job includes:

- `job_id`, `affordance_id`, `schema_version`, `scope`
- `activity_id` when activity-scoped; `region` when page-scoped
- `visual_slot`, `tier`, `purpose`, `preferred_representation`
- `pedagogical_added_value`, `rationale`, `subject`, `context`
- `evidence_anchors` (original authored list)
- `resolved_sources` (one record per anchor)
- spoiler / claim / representation constraint fields (preserved exactly)
- `provenance`
- `authored_passthrough` — additional authored affordance keys not in the core job field list

Educational meaning is not rewritten. Arrays are not converted to prose. No generated claims are added.

---

## Provenance

```json
{
  "source": "design-page-visual-affordance",
  "schema_version": "38.4",
  "affordance_index": 0,
  "affordance_id": "va-A1-generate-01",
  "scope": "activity",
  "activity_id": "A1"
}
```

Page-scoped jobs set `page_scope: true` and omit required `activity_id`.

---

## Deterministic job IDs

```
vj-{schema}-{affordance_id}-{scope}-{activity_id|page}-{visual_slot}
```

- Slug tokens: lowercase, non-alphanumerics → `-`
- No timestamps, randomness, or array-index-only identity
- Duplicate derived IDs → error `VPC_PLANNER_DUPLICATE_JOB_ID`

---

## Evidence-anchor formats supported

Observed authored / fixture forms:

| Anchor | Resolution |
|--------|------------|
| `A1.learner_task` | Activity field on `page.activities[]` (or learning_activities section) |
| `A1.materials.scenarios` | Material matched by type / key / material_id / title aliases |
| `A1.materials.text`, `.worked_example`, `.comparison_table`, `.analysis_table`, `.scenario`, `.debrief`, … | Same material lookup |
| `A1.instructions`, `A1.prompts`, other activity fields | Direct activity field when present |
| `page_synthesis.overview` | `page.page_synthesis.overview` |
| `page_synthesis.learning_purpose` | same |
| `page_synthesis.knowledge_summary` | same |
| `page_synthesis.study_tips` | same |

Materials may be:

- object map (`materials.scenarios = …`), or
- array entries with `material_type` / `type` / `material_id` / `title`, or
- legacy `sections[activity_materials].content[]` rows keyed by `activity_id`

Only explicitly referenced anchors are resolved. No nearby-field substitution.

---

## Resolved source schema

```json
{
  "anchor": "A1.learner_task",
  "source_type": "activity_field",
  "scope": "activity",
  "activity_id": "A1",
  "field": "learner_task",
  "content": "...",
  "content_structured": null,
  "content_text": "...",
  "content_type": "markdown",
  "source_kind": "learner_task"
}
```

**Structured content choice:** when the assembled value is an object/array (or a wrapper with nested structured `content`), the planner sets:

- `content` — string body when a clear string body exists; otherwise `null`
- `content_structured` — deep clone of the structured value
- `content_text` — deterministic `JSON.stringify` of the structured value (or the string body)

Downstream prompt construction can distinguish learner task, materials, feedback, answers, and page synthesis via `source_type` + `source_kind`.

`source_kind` values include: `learner_task`, `learner_visible_material`, `feedback`, `answer`, `model_answer`, `classification_key`, `knowledge_summary`, `page_synthesis`, `activity_metadata`.

---

## Spoiler safety

The planner does not invent pedagogical safety beyond the authored contract.

When `anti_spoiler: true` and `spoiler_boundary` forbids answers / model solutions / classification keys, an anchor whose resolved `source_kind` is prohibited yields:

`VPC_PLANNER_SPOILER_SOURCE_PROHIBITED`

No silent substitution with another source.

---

## Unresolved anchors — atomicity policy

| Situation | Behaviour |
|-----------|-----------|
| Slice 3 contract invalid | `valid: false`, **no jobs** |
| One generate affordance has an unresolved/empty/prohibited anchor | That affordance produces **no job**; sibling generate affordances may still produce jobs |
| Any such failure | `valid: false`, `diagnostics.partial_planning: true` when some jobs were still created |

Errors use stable codes: `VPC_PLANNER_SOURCE_UNRESOLVED`, `VPC_PLANNER_SOURCE_EMPTY`, `VPC_PLANNER_SPOILER_SOURCE_PROHIBITED`.

---

## Ordering policy

1. Sort jobs by canonical `VISUAL_SLOTS` order (from Sprint 38 / Slice 3 contract).
2. Within the same slot, preserve authoritative `visual_affordances[]` order (`affordance_index`).

Page-scoped and activity-scoped jobs share the same slot ordering.

---

## Legacy behaviour

No authoritative visual-planning fields:

```json
{
  "valid": true,
  "authoritative_planning_present": false,
  "jobs": [],
  "diagnostics": { "legacy_path_applicable": true }
}
```

No authoritative jobs from legacy heuristics. Renderer / handover behaviour elsewhere is unchanged.

---

## Non-mutating guarantee

The planner does not mutate the assembled page, `visual_affordances`, reviews, `page_synthesis`, activities, or nested source content. Clones are used only for planner-owned output.

---

## Explicit non-goals

No image prompts, provider calls, assets, manifests beyond jobs, Design Page prompt changes, assembly changes, schema-version migration, renderer changes, HTML placeholders, caption generation, style selection beyond preserving `preferred_representation`, caching, retries, provider routing, or file persistence.
