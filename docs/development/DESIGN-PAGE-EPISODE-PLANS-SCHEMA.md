# Design Page episode plans — portable page schema

**Status:** canonical (2026-06-29)  
**Problem:** Episode-plan choreography lived in workflow captures and was injected post-compose. A page artefact alone could not reconstruct activity order, archetype, or beat sequence.

**Target flow:**

```
Episode Plans → Design Page → Page artefact → Renderer
```

## Where episode plans live in the page schema

Top-level and per-activity (dual carry for portability and convenience):

```json
{
  "artifact_type": "page",
  "episode_plans": [
    {
      "activity_id": "A1",
      "mapped_learning_outcome_ids": ["LO1"],
      "episode_plan": {
        "archetype": "analyse",
        "beats": [
          { "function": "explanation" },
          { "function": "worked_thinking" },
          { "function": "verification" }
        ]
      }
    }
  ],
  "sections": [
    {
      "section_id": "learning_activities",
      "content": [
        {
          "activity_id": "A1",
          "episode_plan": { "archetype": "analyse", "beats": [{ "function": "explanation" }] },
          "episode_plan_source_activity_id": "LO1"
        }
      ]
    }
  ],
  "source_artefacts": ["learning_activities", "activity_materials", "episode_plans"]
}
```

**Authoritative fields for reconstruction (no workflow lookup):**

| Need | Source on page |
|------|----------------|
| Activity order | `sections[].learning_activities.content[]` order (+ `learning_sequence` timing when present) |
| Activity → plan mapping | `episode_plans[].activity_id` aligned to each content row; `mapped_learning_outcome_ids` when LO-aligned upstream ids differ |
| Archetype | `episode_plan.archetype` (top-level row or per-activity) |
| Beat sequence | `episode_plan.beats[].function` verbatim |

`episode_plan_source_activity_id` on an activity row records when the plan was mapped from a different upstream id (e.g. `LO1` → page `A1`).

Schema documented in `domains/learning-design/domain-learning-design-artefacts.md` §18 (page).

## What changed in the Design Page prompt / template

1. **`lib/ld-design-page-compose-contract.js`** — `EPISODE_PLAN_LINES` appended to the runtime compose block (`buildLdDesignPageComposePromptBlock`). Hard requirements when upstream `episode_plans` exist: top-level array, per-activity `episode_plan`, `source_artefacts`, no beat replanning, not learner-facing prose.

2. **`domains/learning-design/domain-learning-design-step-patterns.md` §13 (Design Page)** — Input lists `episode_plans`; `optionalRequires` includes `episode_plans`; `defaultOutputStructure.keys` includes `episode_plans`; prompt template and validation bullets require portable carry-through.

3. **`app.js` bindings** — `ensureEpisodePlanInputBindingsForSteps` wires `episode_plans` from Design Episode Plan to **both** DLA and Design Page so upstream JSON is embedded in step instructions.

## Backward compatibility (fallback only)

`lib/page-episode-plans-preserve.js` + `applyComposedPageEpisodePlansPreserve` in `app.js` still run **only when** the composed page lacks portable episode plans (`pageArtefactHasPortableEpisodePlans`). Legacy pages without `episode_plans` continue to receive injection from workflow captures at compose time.

## Renderer changes required?

**None for this fix.** The export renderer already treats `episode_plans` as metadata (not emitted as learner-facing HTML). Beat-driven visual choreography in HTML is a separate sprint concern; consumers that read page JSON directly can use `episode_plans` immediately.
