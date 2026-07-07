# Progressive Enrichment Architecture

## Concept

One `page` artefact evolves through the workflow. Each stage owns specific fields and may only mutate its owned slice. Downstream stages never re-import independent parallel artefacts for merge.

## Pipeline

```
Episode Plan
  → creates skeletal page (activity slots, episode choreography shell)

DLA
  → enriches page.activities[] (structure, tasks, outcomes mapping)

GAM
  → enriches page.activities[].materials[] (full bodies by material_id)

Learning Sequence
  → enriches page.learning_sequence (order, timing)

finalise_page (optional)
  → page-level metadata, navigation, introductions — not material bodies

Renderer
  → renders final page JSON
```

## Evolving artefact (conceptual)

```json
{
  "artifact_type": "page",
  "assembly_state": {
    "enriched_by": ["episode_plan", "dla", "gam", "learning_sequence"]
  },
  "title": "",
  "audience": "",
  "page_profile": {},
  "sections": [],
  "activities": [],
  "episode_plans": [],
  "learning_sequence": {},
  "learning_outcomes": [],
  "source_artefacts": []
}
```

Note: final schema to be frozen in implementation phase; 56E `design-page.schema.json` is a reference starting point.

## Enrichment rules

1. **Create once:** Episode Plan creates the page shell and activity_id slots.
2. **Enrich in place:** DLA/GAM/Sequence write into the same artefact.
3. **No parallel truth:** GAM does not emit a separate markdown pack that Design Page must re-parse.
4. **ID immutability:** `activity_id` and `material_id` set at first assignment; never renamed downstream.
5. **Body write-once:** GAM writes full `body` into `materials[]`; no later summarisation pass.
6. **Fail explicit:** missing required ID at enrichment time → structured failure, not inferred substitute.

## Stage responsibilities

| Stage | Creates | Enriches | Must not |
| ----- | ------- | -------- | -------- |
| Episode Plan | Page shell, activity slots, episode_plans | Choreography metadata | Author full material bodies |
| DLA | — | Activity structure, tasks, required_materials IDs | Write GAM bodies |
| GAM | — | materials[].body, material metadata | Rename activity IDs |
| Learning Sequence | — | Order, timing | Rewrite materials |
| finalise_page | — | Page wrapper, nav, metadata | Generate/regenerate materials |
| Renderer | — | — | Recover missing upstream content |

## Transport vs generation

- **Generation:** DLA designs activities; GAM authors learner-facing bodies.
- **Transport:** Each stage copies its output into the page artefact fields it owns.
- **Assembly:** Implicit in enrichment — not a separate LLM step.

## Validation model

PRISM does not post-validate workflow outputs. External audit compares exported page JSON against:

- required activity_id set
- required material_id set per activity
- body length/hash vs GAM source (when fixtures available)
- no ID remapping
