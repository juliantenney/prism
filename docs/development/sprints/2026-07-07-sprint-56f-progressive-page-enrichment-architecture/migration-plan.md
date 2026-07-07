# Migration Plan

## Strategy

Phased cutover from **separate artefacts + Design Page LLM merge** to **progressive page enrichment**. No backward compatibility requirement (no production users).

## Phase 0 — Freeze and document (Sprint 56F) ✅

- Commit 56E investigation artefacts
- Architecture decision and ownership matrix
- Migration plan and test strategy
- No production changes

## Phase 1 — Schema freeze

- Define `page` evolving artefact schema (extend 56E `design-page.schema.json`)
- Define per-stage enrichment contract (what each step may write)
- Define GAM material record shape (`material_id`, `title`, `body`)
- Define failure object for missing IDs at enrich time

**Exit:** Schema and contracts approved.

## Phase 2 — GAM JSON cutover

- Change GAM prompt to emit structured material enrichment (into page or structured JSON consumed at enrich)
- Remove markdown pack-text as canonical output (`lib/gam-output-format.js` constraints)
- Update GAM validation to require JSON material records with non-empty `body`

**Exit:** GAM produces structured materials with stable IDs.

## Phase 3 — Episode Plan page shell

- Episode Plan creates initial `page` artefact with activity slots and `episode_plans`
- Workflow binding passes `page` artefact forward

**Exit:** Page shell exists before DLA.

## Phase 4 — DLA / Sequence enrichment

- DLA enriches `activities[]` in page (structure, tasks, required_material IDs)
- Learning Sequence enriches `learning_sequence`

**Exit:** Activity structure lives in page; no separate DLA-only merge needed.

## Phase 5 — GAM enrichment into page

- GAM writes `materials[].body` into page by exact `material_id`
- Fail on missing required ID — no inference

**Exit:** HR Essentials path (`A1-M1`..`A6-M7`) bodies embedded without Design Page.

## Phase 6 — Retire Design Page LLM step

- Remove or bypass `step_design_page` LLM compose
- Deprecate `LD-DESIGN-PAGE-COMPOSE-CONTRACT` merge prompts
- Optional: add bounded `finalise_page` for wrapper only

**Exit:** No LLM merge in workflow path.

## Phase 7 — Renderer verification

- Confirm renderer consumes final page JSON without recovery logic
- External audit pass on exported artefacts

**Exit:** End-to-end render with full material bodies.

## Deprecation register (to update in implementation)

| Asset | Action |
| ----- | ------ |
| Design Page production prompt | Deprecate |
| GAM markdown pack format | Remove |
| `parseGamMaterialsFromText` as canonical | Secondary/removed |
| Design Page v2 prompt (56E) | Archive — investigation only |
| Page-level `activity_materials` section | Remove |

## Rollback

Not required (no users). Keep 56E artefacts and git history for reference.

## Success metrics

- Zero ID remapping in audit (`A*` stays `A*`)
- 100% required material_id presence
- Body hash match vs GAM source (fixture-based external audit)
- No Design Page step in workflow
