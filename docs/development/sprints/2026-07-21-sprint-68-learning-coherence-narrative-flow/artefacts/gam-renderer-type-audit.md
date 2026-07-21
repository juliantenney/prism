# GAM / Learner-Renderer Type Audit (S68-IMP-012)

**Date:** 2026-07-21  
**Task:** S68-IMP-012 — evidence-based inventory and kitchen-sink fixture

## Methodology

1. **Registry scan** — `lib/beat-material-registry.js` (`MATERIAL_BEAT_REGISTRY`, 50 material types)
2. **vNext allowlist** — `lib/learner-renderer-vnext/parse-material.js` (`MATERIAL_RENDERER_TYPES`, 13 types)
3. **Fixture emission scan** — all `tests/fixtures/**/*.json` for `material_type` values
4. **Renderer path review** — `render-material.js`, `render-composed-moment.js`, `render-table-workspace.js`, `compose-activity-moments.js`
5. **Cross-reference** — Sprint 63 activity-type inventory, episode-plan population contract, DLA prompt fields

Machine-readable output: `artefacts/gam-renderer-type-inventory.json` (regenerated via `node scripts/build-gam-renderer-type-inventory.js`).

## Summary totals

| Metric | Count |
|--------|------:|
| Canonical material types (registry + fixtures + vNext union) | 51 |
| vNext-supported material types | 13 |
| Registry-only (not in fixtures) | ~35 |
| Observed in fixtures (all types) | 16 distinct values |
| Kitchen-sink vNext coverage | 13/13 (100%) |
| Unsupported in full-page vNext path | 38 |

## vNext-supported material types

| Type | Interaction | Learner surface | Renderer path |
|------|-------------|-----------------|---------------|
| `text` | static | static | `renderMaterial` |
| `worked_example` | static | static | `renderMaterial` |
| `sample_output` | static | static | `renderMaterial` |
| `modelling_note` | static | static | `renderMaterial` |
| `scenario` | static | static | `renderMaterial` |
| `checklist` | static | static | `renderMaterial` (checklist parser) |
| `prompt_set` | static | static | `renderMaterial` |
| `template` | static | static | `renderMaterial` |
| `transfer_prompt` | static | static | `renderMaterial` |
| `consolidation_summary` | static | static | `renderMaterial` |
| `analysis_table` | conditional | static / `table_entry` | `renderMaterial` / `renderTableWorkspace` in composed Do |
| `decision_table` | conditional | static / `table_entry` | same |
| `comparison_table` | conditional | static / `table_entry` | same |

## Type-to-surface mapping (many-to-one)

**text_entry** (via `determineWorkspaceRequirement()` step patterns, not material type):

- reflection, explanation, prediction, justification, recommendation task wording

**table_entry** (via `shouldComposeTableWorkspaceMaterial()` in composed Do):

- `analysis_table`, `decision_table`, `comparison_table`

**static** (default for all vNext types in beats / non-composed path):

- All thirteen types when not routed to a workspace

## Schema-only vs observed

| Type | Status |
|------|--------|
| `classification_table` | Registry + fixtures (RNA); **vNext validation blocked** |
| `planning_table` | Fixtures only; **vNext validation blocked** |
| `discussion_prompts` | Fixtures (inflation workshop); **vNext validation blocked** |
| `rubric`, `task_cards`, `video`, … | Registry; rarely observed in vNext fixtures |

**Discrepancy:** `renderMaterial()` includes an unsupported fallback, but `validate-input.js` rejects unknown types before page render. Unsupported types do not reach the fallback in the normal application path.

## Ordering / ranking / sequencing

| Mechanism | GAM name | Data structure | Current treatment |
|-----------|----------|----------------|-------------------|
| Activity interaction | `sequencing`, `ranking`, `classification` | `activity_interaction_type` (artefacts) | No dedicated surface; material + task wording |
| Material | `classification_table` | Markdown pipe table; blank cells imply completion | Validation blocked in vNext |
| Material | `planning_table` | Sequenced action rows | Validation blocked in vNext |
| Material | `decision_table`, `comparison_table` | Row/column grid with blank cells | Static in beats; `table_entry` when composed (A2/A3/A5 heteroscedasticity) |
| Archetype | `process_walkthrough` | `archetype_plan.stages[]` | GAM-only; not consumed by vNext renderer |

No GAM enum named `ordering_type` or `ranking_type`. Order is encoded in table rows, task step numbering, and interaction-type metadata.

## Kitchen-sink fixture

**Path:** `tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json`  
**Generator:** `node scripts/build-learner-renderer-kitchen-sink-fixture.js`

| Activity | Archetype variant | Types demonstrated |
|----------|-------------------|-------------------|
| KS01 | understand-explain-check | text, worked_example, sample_output, checklist |
| KS02 | understand-explain-apply-check | text, modelling_note, prompt_set, checklist |
| KS03 | analyse-model-analyse-check | worked_example, scenario, analysis_table, checklist |
| KS04 | apply-model-practise-transfer | worked_example, scenario, decision_table, checklist |
| KS05 | evaluate-explain-model-practise-transfer | text, scenario, comparison_table, template, checklist, consolidation_summary, transfer_prompt |

KS01–KS05 use **beats-mode rendering** within the moments default page (no A1–A5 composition hardcoding). Interactive `table_entry` / `text_entry` behaviour remains demonstrated by the heteroscedasticity reference lesson (IMP-005–011).

## Maintenance rule

When GAM emits a new `material_type`:

1. `node scripts/build-gam-renderer-type-inventory.js` — inventory test fails if unclassified
2. Add classification entry (renderer path, surface capabilities)
3. Add representative case to kitchen-sink fixture (if vNext-supported) or `gam-unsupported-learner-interactions.json`
4. Confirm existing surface reuse or record unsupported interaction

## Architectural statements

> GAM activity and manifestation types do not map one-to-one to learner surfaces. Different educational activities may reuse the same learner-surface capability.

> Learner surfaces are an open-ended renderer-owned capability set. The kitchen-sink inventory records current coverage but does not define a permanent closed taxonomy.

> New learner surfaces should be introduced only when a real emitted activity cannot be represented well using an existing surface capability.

## Recommended next exception-led tasks

1. **classification_table / planning_table** — decide alias-to-supported-type vs dedicated renderer vs validation relaxation for static render
2. **Generic composition** — extend beyond A1–A5 so kitchen-sink table types can exercise `table_entry` in Do without heteroscedasticity IDs
3. **Ordering/ranking interaction** — design surface only when a concrete emitted lesson cannot use `table_entry` or `text_entry`
