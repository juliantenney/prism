# Material Ownership Inventory

## Purpose

Complete inventory of learner-facing content types, current generator, proposed owner, and whether each belongs in the evolving page artefact.

## Inventory

| Content type | Current generator | Proposed owner | In page artefact? | Notes |
| ------------ | ----------------- | -------------- | ----------------- | ----- |
| Explanations / exposition text | GAM | GAM | Yes — `materials[].body` | `material_type: text` |
| Worked examples | GAM | GAM | Yes | Full step-by-step body |
| Worked thinking | GAM | GAM | Yes | Not synopsis |
| Annotated examples | GAM | GAM | Yes | |
| Scenarios | GAM | GAM | Yes | Full scenario text |
| Guided practice | GAM | GAM | Yes | |
| Guided practice tables | GAM | GAM | Yes | Pipe/markdown table in body |
| Verification activities | GAM | GAM | Yes | |
| Checklists | GAM | GAM | Yes | All items, not header only |
| Transfer activities / prompts | GAM | GAM | Yes | |
| Consolidation activities / summaries | GAM | GAM | Yes | Reflection + closure content |
| Templates (memo, etc.) | GAM | GAM | Yes | Full template body |
| Comparison / analysis tables | GAM | GAM | Yes | Full table in body |
| Learner instructions (`learner_task`) | DLA | DLA | Yes — `activities[]` | |
| Expected outputs | DLA | DLA | Yes | |
| Activity titles | DLA | DLA | Yes | |
| Activity preamble / scaffold fields | DLA | DLA | Yes | Optional per activity |
| Learning outcome mappings | DLA | DLA | Yes | `mapped_learning_outcomes` |
| Required material IDs (spec only) | DLA | DLA | Yes — `required_materials` | IDs/types, not bodies |
| Sequence metadata (order) | Learning Sequence | Learning Sequence | Yes — `learning_sequence` | |
| Timing metadata | Learning Sequence / Episode Plan | Learning Sequence + Episode Plan | Yes | |
| Episode choreography (beats) | Episode Plan | Episode Plan | Yes — `episode_plans[]` | Structural, not learner prose |
| Page-level overview | Design Page (derived) | finalise_page | Yes — `sections.overview` | Wrapper only |
| Page-level learning purpose | Design Page (derived) | finalise_page | Yes | Transport upstream if present |
| Knowledge summary | LC/KM or Design Page | Upstream or finalise_page | Yes | Not substitute for materials |
| Assessment check items | Assessment step | Assessment → page enrich | Yes — `assessment_check` | When provided |
| Support notes | Upstream / Design Page | Upstream → finalise_page | Yes | Scaffold transport |
| Navigation labels | Design Page | finalise_page | Yes | Renderer-facing |
| Page title | Design Page | finalise_page / profile | Yes | |

## Anti-patterns (must not occur)

| Anti-pattern | Why invalid |
| ------------ | ----------- |
| DLA `required_materials.specification` used as `material.body` | Spec is not learner content |
| Design Page summarises GAM body | Transport failure |
| Material ID as title when body exists | Metadata-as-payload |
| `LO1-M1` mapped to `A1-M1` by meaning | ID scheme reconciliation forbidden |
| Empty `body` when GAM content exists | Enrichment failure |

## GAM enrichment shape (target)

```json
{
  "material_id": "A1-M1",
  "material_type": "text",
  "title": "HR as a Strategic Function",
  "body": "## HR as a Strategic Function...\n\nFull markdown content..."
}
```

Minimise metadata. `body` is the fidelity surface.

## Open inventory questions

- Exact mapping of legacy GAM `Material: X (type)` destination fields to JSON `material_type`
- Whether scaffold fields stay on activity row vs nested journey object
- Assessment embedding shape in progressive model

See [context/open-questions.md](context/open-questions.md).
