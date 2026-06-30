# Sprint 53 — Canonical Pedagogic Fidelity Audit Matrix

**Status:** Sprint scoping / audit-design only (no fixes, no tickets)  
**Source of truth:** Committed `lib/`, `domains/learning-design/`, `app.js` renderer wiring  
**Baseline reference:** Prior PRISM canonical pedagogic support elements audit (2026-06-29)

**Stage codes:** EP · DLA · GAM · LS · DP · Renderer/HTML

**Risk codes:** O omission · SS synopsis substitution · BR body-ratio loss · KC key collapse · WS wrapper synthesis · DS dedup stripping · RD renderer deprioritisation · VS validator skip

**Legend — Requiredness:** `required` · `optional` · `suggested` · `conditional` (pack/factor/workflow) · `renderer-only` · `weak` (named in sprint docs, not in committed `lib/` registry)

**Legend — Preservation:** `verbatim` · `when upstream` · `may synthesise` · `display transform` · `not learner-facing`

---

## Matrix — PEL bundle label

| # | Canonical element | Family | Source of truth | Expected stages | Requiredness | Preservation | Renderer mapping | Aliases | Fidelity risks | Audit check instruction |
|---|-------------------|--------|-----------------|-----------------|--------------|--------------|------------------|---------|----------------|-------------------------|
| 1 | **PEL** | PEL bundle label | `lib/ld-self-directed-rhetoric.js` PRESERVATION BOUNDARY; `lib/ld-journey-assimilation.js`; `app.js` `pelGamStripRedundantParagraphsFromText`, `pelSanitizeLearnerPageActivityRow` | DLA · GAM · DP · R | suggested (authoring target); conditional preserve on DP | when upstream (`FIELD_PRESERVATION_FIELD_IDS`) | `util-pel-orientation-cue`, `util-pel-reasoning-cue`, `util-activity-framing` (`app.js` ~30571) | “PEL/cognition”, “cognition-orientation fields” | DS, WS | For each activity: compare DLA row PEL/cognition fields to DP `learning_activities.content[]` row — same keys, same body text; compare GAM connective prose to row fields for unintended overlap removal |

---

## Matrix — Activity-row fields

| # | Canonical element | Family | Source of truth | Expected stages | Requiredness | Preservation | Renderer mapping | Aliases | Fidelity risks | Audit check instruction |
|---|-------------------|--------|-----------------|-----------------|--------------|--------------|------------------|---------|----------------|-------------------------|
| 2 | `activity_preamble` | Activity-row field | `lib/ld-design-page-compose-contract.js` `FIELD_PRESERVATION_FIELD_IDS`; `lib/ld-cognition-orientation.js`; `lib/ld-activity-preamble-exposition.js`; EP map `orientation` in `lib/episode-plan-population-contract.js` `COGNITION_FIELD_MAP` | EP · DLA · DP · R | required (learner-page DLA) | verbatim on DP | `util-activity-preamble`; Orient bucket (`lib/ld-instructional-manifestation-render.js`) | `orienting_preamble`, `activity_framing` | O, WS | Trace `activity_preamble` from DLA JSON → DP activity row → rendered HTML preamble block; byte-compare or diff |
| 3 | `reasoning_orientation` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS` (`lib/ld-cognition-orientation.js`); EP `framing` map | EP · DLA · DP · R | required (≥1 cognition field set) | verbatim on DP | `util-pel-reasoning-cue`; Think bucket | `reasoning_orientation_prompt` | O, WS | Confirm non-empty on DLA; same string on DP row; visible in framing/Think HTML |
| 4 | `reasoning_orientation_prompt` | Activity-row field | `MANDATORY_COGNITION_FIELD_IDS`; `THINK_ROW_FIELDS` | DLA · DP · R | optional (counts toward ≥1 cognition) | verbatim on DP | Framing fallback in `renderActivityFramingForActivity` | — | O | If present on DLA, must appear on DP row and in framing render |
| 5 | `self_explanation_prompt` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS`; EP `reflection` map; `SPRINT_28_COGNITION_PACK_CONTRACT.self_study_cognition_pack` (`app.js`) | EP · DLA · DP · R | required (≥1 cognition) or conditional (pack) | verbatim on DP | `util-cognition--explain`; pre-check Reflect slot | — | O | DLA → DP string match; HTML contains cognition Reflect block when checklist/sample_output present |
| 6 | `prior_knowledge_activation` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; EP `activation` map | EP · DLA · DP · R | optional | verbatim on DP | Orient/framing render | `prior_knowledge_prompt` | O | If on DLA, copy to DP unchanged; check framing HTML |
| 7 | `evidence_use_prompt` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS` | DLA · DP · R | optional (cognition set) | verbatim on DP | Framing / Think render | — | O | DLA → DP → HTML framing block |
| 8 | `argument_structure_hint` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS` | DLA · DP · R | optional (cognition set) | verbatim on DP | Think bucket | — | O | DLA → DP → Think HTML |
| 9 | `conceptual_contrast_prompt` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS` | DLA · DP · R | optional (cognition set) | verbatim on DP | Think bucket | — | O | DLA → DP → Think HTML |
| 10 | `disciplinary_lens` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS` | DLA · DP · R | optional | verbatim on DP | Framing render | — | O | DLA → DP → framing HTML |
| 11 | `transfer_or_application_task` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS`; `self_study_cognition_pack` | DLA · DP · R | optional (cognition) or conditional (pack) | verbatim on DP | `util-cognition--transfer` | — | O (confused with `transfer_prompt` material) | Verify row field distinct from `materials.transfer_prompt*`; both preserved if upstream has both |
| 12 | `scaffold_hint_sequence` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `SPRINT_28_COGNITION_FACTOR_CONTRACT.adaptive_scaffolding_required` | DLA · DP · R | conditional (`adaptive_scaffolding_required`) | verbatim on DP | `util-cognition--scaffold` | `scaffold_hint` (role family) | O | When factor true: field on DLA, DP, cognition scaffold HTML |
| 13 | `uncertainty_tension_prompt` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `MANDATORY_COGNITION_FIELD_IDS`; `productive_uncertainty_required` | DLA · DP · R | optional or conditional (factor) | verbatim on DP | `util-cognition--uncertainty` | — | O | DLA → DP → uncertainty cognition HTML |
| 14 | `study_orientation` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `lib/ld-self-directed-rhetoric.js` | DLA · DP · R | optional | verbatim on DP | `util-activity-study-orientation` | — | WS (wrapper overlap) | DLA → DP; confirm not duplicated verbatim in `overview` |
| 15 | `intellectual_frame` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `ORIENT_ROW_FIELDS` | DLA · DP · R | optional | verbatim on DP | Framing render | — | O | DLA → DP → HTML |
| 16 | `intellectual_coherence_bridge` | Activity-row field | `FIELD_PRESERVATION_FIELD_IDS`; `lib/ld-journey-assimilation.js` | DLA · DP · R | optional | verbatim on DP | Framing render | — | WS | DLA → DP unchanged; journey assimilation must not rewrite field text |
| 17 | `learner_task` | Activity-row field | `lib/page-role-registry.js` `learner_task`; `domains/.../domain-learning-design-artefacts.md` §5 | DLA · DP · R | required (DLA) | verbatim on DP | `util-activity-task`; Do bucket | — | O, KC (merge into materials) | DLA `learner_task` === DP row `learner_task` === primary task HTML; not inside `materials` |
| 18 | `expected_output` | Activity-row field | Domain artefacts §5; compose contract | DLA · DP · R | required (DLA) | verbatim on DP | Triggers post-check Reflect when checklist present | — | O, KC | DLA → DP; visible near task/output cues in HTML |
| 19 | `support_note` | Activity-row field | Domain artefacts; `lib/ld-self-directed-rhetoric.js`; compose contract | DLA · DP · R | optional | verbatim on DP | Support / “Watch for this mistake” bucket | `support_notes` (page section name) | O, WS (shortened to guard) | DLA → DP per-activity `support_note`; distinct from page `support_notes` section |
| 20 | `facilitator_moves` | Activity-row field | Domain artefacts §5 | DLA · GAM | optional | not learner-facing | Stripped in GAM sanitizer (`pelGamLineIsFacilitatorHeading`) | `facilitation_notes` | DS | Confirm absent from learner HTML; may exist on DLA for GAM context only |
| 21 | `misconception_claim` | Activity-row field | `SPRINT_28_COGNITION_PACK_CONTRACT.misconception_repair_pack` | DLA · DP · R | conditional (pack / `misconception_reconciliation_required`) | verbatim on DP | `util-cognition--repair` | — | O | When pack active: DLA → DP → repair cognition HTML |
| 22 | `reconciliation_prompt` | Activity-row field | `misconception_repair_pack` | DLA · DP · R | conditional (pack) | verbatim on DP | `util-cognition--repair` | — | O | Same as #21 |
| 23 | `evidence_contrast` | Activity-row field | `misconception_repair_pack` | DLA · DP · R | conditional (pack) | verbatim on DP | `util-cognition--repair` | — | O | Same as #21 |
| 24 | `reasoning_revision_prompt` | Activity-row field | `peer_instruction_pack` | DLA · DP · R | conditional (pack / `reasoning_revision_required`) | verbatim on DP | `util-cognition--revision` | — | O | When pack active: DLA → DP → revision HTML |
| 25 | `initial_position_prompt` | Activity-row field | `peer_instruction_pack` | DLA · DP · R | conditional (pack) | verbatim on DP | `util-cognition--revision` | — | O | Same as #24 |
| 26 | `revision_trigger` | Activity-row field | `peer_instruction_pack` | DLA · DP · R | conditional (pack) | verbatim on DP | `util-cognition--revision` | — | O | Same as #24 |
| 27 | `transformation_activity` | Activity-row field | `transcript_transformation_pack` | DLA · DP · R | conditional (pack) | verbatim on DP | `util-cognition--transformation` | — | O | When pack active: DLA → DP → transformation HTML |
| 28 | `source_to_application_prompt` | Activity-row field | `transcript_transformation_pack` | DLA · DP · R | conditional (pack) | verbatim on DP | `util-cognition--transformation` | — | O | Same as #27 |

---

## Matrix — GAM / page material types

| # | Canonical element | Family | Source of truth | Expected stages | Requiredness | Preservation | Renderer mapping | Aliases | Fidelity risks | Audit check instruction |
|---|-------------------|--------|-----------------|-----------------|--------------|--------------|------------------|---------|----------------|-------------------------|
| 29 | `task_cards` | GAM/page material type | `domain-learning-design-artefacts.md` §5–6; `app.js` `utilityNormalizeMaterialTypeKey` | DLA · GAM · DP · R | optional (per `required_materials`) | verbatim (`LD-MATERIALS-COPY`) | `util-task-card-icon`; `task_cards` bucket | `cards`, `task_card` | O, SS, BR, KC, RD | For each `material_id` typed `task_cards`: GAM body → DP `materials` key → HTML card list; count cards |
| 30 | `prompt_set` | GAM/page material type | Domain §6; `DO_MATERIAL_KEYS` | DLA · GAM · DP · R | optional | verbatim | `util-prompt-set`, `fa-comments` | `prompts`, `discussion_prompts`, `wrap_up_prompts` | O, SS, BR | GAM `Material:` block → DP materials → prompt-set HTML; no answer keys on learner page |
| 31 | `scenario` | GAM/page material type | Domain §6; `page-role-registry` `scenario`; `pageFieldKeyForMaterial` | DLA · GAM · DP · R | optional | verbatim | Scenario heading; Study bucket | `scenarios`, `scenario_maya_households`, `scenario_maya_strategy_menu` | O, SS, BR, KC | Per `material_id`: GAM content length ≥ closure threshold vs DP; named scenario text present in HTML |
| 32 | `checklist` | GAM/page material type | Domain §6; `verification_checklist` role family | DLA · GAM · DP · R | optional (mandatory under some workbook/evaluate contracts) | verbatim | `util-checklist-block`; Sprint 51 diagnostic split | `checklist_evaluate`, `verification_checklist`, `evaluation_checklist` | O, SS, BR, KC, display transform | GAM checklist sections → DP → checkbox HTML; verify `## Common mistakes` / verification split preserved |
| 33 | `template` | GAM/page material type | Domain §6; `independent_template` role family | DLA · GAM · DP · R | optional | verbatim | `util-template-block` | `independent_judgement_template`, `analysis_template`, `worksheet_template` | O, SS, BR, KC | GAM template body with blank cells → DP → template HTML |
| 34 | `sample_output` | GAM/page material type | Domain §6; role registry `sample_output` | DLA · GAM · DP · R | optional | verbatim | Study or Check bucket (grammar placement) | — | O, BR | GAM sample → DP → HTML in Study or Check phase |
| 35 | `text` | GAM/page material type | Domain §6; `explanatory_guidance` role family | DLA · GAM · DP · R | optional | verbatim | Concept/criteria exposition headings | `concept_text`, `concept_exposition`, `criteria_text`, `criteria_exposition_evaluate` | SS, BR, KC | GAM text body vs DP; reject catalogue-only synopsis |
| 36 | `worked_example` | GAM/page material type | `domain-learning-design-prompt-rules.md`; `page-role-registry`; `pageFieldKeyForMaterial` | DLA · GAM · DP · R | optional (DLA/workbook may require) | verbatim | “Worked example”; Study bucket; salience callouts | `worked_analytic_pass`, `worked_judgement_weak_strong` (purpose keys) | O, SS, BR, KC | GAM worked body with step markers → DP → HTML; check `## What experts notice` / `## Why this works` if upstream has them |
| 37 | `modelling_note` | GAM/page material type | `page-role-registry` `reasoning_support` / `worked_judgement_support`; `GAM_ROLE_RULES` | DLA · GAM · DP · R | optional | verbatim | “Modelling note” / worked judgement heading | `modeling_note`; may map to `worked_judgement_weak_strong` | O, SS, BR, KC | GAM modelling body → DP key → HTML; weak/strong markers if specified |
| 38 | `worked_analytic_pass` | GAM/page material type | `page-role-registry` `worked_analytic_pass`; `pageFieldKeyForMaterial` (purpose) | DLA · GAM · DP · R | optional | verbatim | Study bucket | alias of `worked_example` type | O, SS, BR, marker loss | Purpose `worked analytic pass` → `worked_analytic_pass` key on DP; scaffold markers present |
| 39 | `worked_judgement_weak_strong` | GAM/page material type | `PAGE_MATERIAL_KEY_ALIASES`; role registry | DLA · GAM · DP · R | optional | verbatim | Study bucket | `modelling_note`, `worked_example` | O, SS, BR, KC | Weak/strong judgement sections in GAM === DP === HTML |
| 40 | `decision_table` | GAM/page material type | `pageFieldKeyForMaterial`; `guided_judgement_table` family | DLA · GAM · DP · R | optional | verbatim | Do bucket; pipe table render | `guided_judgement_table` | O, BR | GAM pipe table → DP → HTML table unchanged |
| 41 | `analysis_table` | GAM/page material type | `pageFieldKeyForMaterial`; `practice_table` family | DLA · GAM · DP · R | optional | verbatim | Do / worksheet render | `classification_table`, `comparison_table`, `impact_table`, `worksheet`, `table` | O, BR, KC | Per material_id table body preserved; not collapsed to one type key |
| 42 | `classification_table` | GAM/page material type | `GAM_ROLE_RULES`; `practice_table` | DLA · GAM · DP · R | optional | verbatim | Do bucket | maps to `classification_table` page key | O, KC | Same as #41 |
| 43 | `comparison_table` | GAM/page material type | `GAM_ROLE_RULES` | DLA · GAM · DP · R | optional | verbatim | Do bucket | — | O, KC | Same as #41 |
| 44 | `impact_table` | GAM/page material type | `GAM_ROLE_RULES` | DLA · GAM · DP · R | optional | verbatim | Do bucket | — | O, KC | Same as #41 |
| 45 | `consolidation_summary` | GAM/page material type | Role registry; `REFLECT_MATERIAL_KEYS`; workbook DLA-WB-12 (tests/docs) | DLA · GAM · DP · R | conditional (workbook final activity) | verbatim | Reflect “What to take away” | — | O, SS, BR | GAM ≥80-word consolidation → DP → reflect HTML; not replaced by `prompt_set` only |
| 46 | `transfer_prompt` | GAM/page material type | Role registry; `TRANSFER_MATERIAL_KEYS` | DLA · GAM · DP · R | optional | verbatim | Transfer bucket | `transfer_prompt_evaluate` | O, SS, BR, KC | GAM transfer body (≥80 words if marker expected) → DP → Transfer HTML |
| 47 | `reflection_prompt` | GAM/page material type | `lib/ld-instructional-manifestation-render.js` `REFLECT_MATERIAL_KEYS` | DP · R | **renderer-only** (not in domain §6 strict schemas) | when upstream / if emitted | Reflect material slot | — | RD, O | If key present on DP materials, appears in Reflect HTML bucket |
| 48 | `misconception_note` | GAM/page material type | Sprint-44 docs only (**weak**) | — | **weak** (unevaluated in committed `lib/`) | unspecified in committed registry | **none** in `page-role-registry.js` | — | O, VS | Flag if present in GAM; no committed validator/renderer mapping — manual review only |

---

## Matrix — Page wrapper / session elements

| # | Canonical element | Family | Source of truth | Expected stages | Requiredness | Preservation | Renderer mapping | Aliases | Fidelity risks | Audit check instruction |
|---|-------------------|--------|-----------------|-----------------|--------------|--------------|------------------|---------|----------------|-------------------------|
| 49 | `overview` | Page wrapper/session | `domain-learning-design-artefacts.md` §18 `section_id` | DP · R | suggested (learner profile) | may synthesise (`LD-AUTHORIAL-EXPOSITION`, `LD-JOURNEY-ASSIMILATION`) | Document section | — | WS | Compare overview prose to upstream journey signals — acceptable synthesis; must not replace activity materials |
| 50 | `learning_purpose` | Page wrapper/session | Domain §18 | DP · R | suggested | may synthesise | Section render | — | WS | Section exists with learner-appropriate purpose text |
| 51 | `knowledge_summary` | Page wrapper/session | Domain §18 | DP · R | optional (when KM/LC upstream) | may synthesise (preview only) | Section render | — | WS | If KM upstream: section reflects KM; not a substitute for activity materials |
| 52 | `study_tips` | Page wrapper/session | `lib/ld-authorial-exposition.js`; `lib/ld-journey-assimilation.js` | DP · R | optional | may synthesise | Section render | — | WS | Closure synthesis allowed; must not duplicate full `overview` per authorial contract |
| 53 | `learning_activities` | Page wrapper/session | Domain §18 | DLA · GAM · DP · R | required (page section) | membership: all upstream `activity_id` unless `activities_omitted[]` | Activity loop + manifestation grammar | — | O, VS | Set-diff upstream DLA `activity_id` vs DP section content; check `generation_notes.activities_omitted[]` |
| 54 | `assessment_check` | Page wrapper/session | Domain §18; renderConfig | Assessment → DP · R | optional (`omitIfMissing`) | structure preserve (stem/options) | `util-assessment` | — | O | If upstream assessment_items: DP section with valid items; HTML MCQ structure |
| 55 | `support_notes` | Page wrapper/session | Domain §18 renderConfig | DP · R | optional | when upstream | Page section (not per-activity field) | distinct from `support_note` | O | Section-level notes if present; do not confuse with row `support_note` |
| 56 | `feedback_pack` | Page wrapper/session | Domain §12 | Assessment → DP | optional upstream | when upstream | Incorporated per domain §18 | — | O | If workflow includes feedback step: trace items into DP/HTML |
| 57 | `marking_rubric` | Page wrapper/session | Domain §19 | Assessment → DP | optional | not learner-facing (tutor) | Tutor/facilitator profile | `rubric` in artefact | O | Learner page should not expose full rubric unless profile=assessment/tutor |
| 58 | `learning_sequence` | Page wrapper/session | Domain; LS step prompt | LS · DP | optional upstream | order/timing reference only on DP | Sequence references in wrapper | — | O (LS may omit activities) | LS activity set ⊆ DLA; DP activity set must match DLA not LS omissions |

---

## Matrix — Episode-plan instructional functions

*These are EP beat `function` values in `lib/episode-plan-population-contract.js` `FUNCTION_SPECS` — obligations for DLA population, not direct learner JSON keys.*

| # | Canonical element | Family | Source of truth | Expected stages | Requiredness | Preservation | Renderer mapping | Aliases | Fidelity risks | Audit check instruction |
|---|-------------------|--------|-----------------|-----------------|--------------|--------------|------------------|---------|----------------|-------------------------|
| 59 | `orientation` | Episode-plan function | `FUNCTION_SPECS.orientation`; `COGNITION_FIELD_MAP` | EP · DLA | required beat when in plan | → `activity_preamble` | via row field #2 | — | SS (`generic_boilerplate_only`) | EP beat → DLA `activity_preamble` non-generic |
| 60 | `framing` | Episode-plan function | `FUNCTION_SPECS.framing` | EP · DLA | beat-dependent | → `reasoning_orientation` | via #3 | — | — | EP beat → DLA cognition framing field |
| 61 | `activation` | Episode-plan function | `FUNCTION_SPECS.activation` | EP · DLA | beat-dependent | → `prior_knowledge_activation` | via #6 | — | — | EP beat → DLA prior-knowledge field |
| 62 | `explanation` | Episode-plan function | `FUNCTION_SPECS.explanation` | EP · DLA · GAM | beat-dependent | → `required_materials` (material class) | via GAM `text`/exposition | — | SS (`synopsis_only`) | DLA spec requires substantive material; GAM body not synopsis |
| 63 | `example` | Episode-plan function | `FUNCTION_SPECS.example` | EP · DLA · GAM | beat-dependent | → material obligation | via worked/sample materials | — | — | Beat → DLA `required_materials` → GAM positive instance |
| 64 | `non_example` | Episode-plan function | `FUNCTION_SPECS.non_example` | EP · DLA · GAM | beat-dependent | material obligation | — | — | merged into example | Separate material obligation not merged away |
| 65 | `misconception_confrontation` | Episode-plan function | `FUNCTION_SPECS.misconception_confrontation` | EP · DLA · GAM | beat-dependent | material + cognition | repair pack fields / materials | — | `single_support_note_line` | Beat → material body + not only one-line `support_note` |
| 66 | `criteria_exposition` | Episode-plan function | `FUNCTION_SPECS.criteria_exposition` | EP · DLA · GAM | beat-dependent | material obligation | `criteria_exposition_evaluate` | — | — | Beat → GAM criteria text with depth |
| 67 | `criteria_construction` | Episode-plan function | `FUNCTION_SPECS.criteria_construction` | EP · DLA · GAM | beat-dependent | material + task | — | — | `read_only_rubric_prose` | Learner must construct criteria, not read-only rubric |
| 68 | `perspective_construction` | Episode-plan function | `FUNCTION_SPECS.perspective_construction` | EP · DLA · GAM | beat-dependent | material + task | — | — | `scenario_menu_only` | Beat → learner-write perspective task + material |
| 69 | `worked_thinking` | Episode-plan function | `FUNCTION_SPECS.worked_thinking` | EP · DLA · GAM | beat-dependent | material obligation | `worked_example` / analytic pass | — | merge with guided/independent | GAM stepwise model present on DP |
| 70 | `worked_judgement` | Episode-plan function | `FUNCTION_SPECS.worked_judgement` | EP · DLA · GAM | beat-dependent | material obligation | modelling / weak-strong | — | `slogan_contrast_only` | Weak vs strong exemplar in GAM → DP |
| 71 | `guided_inquiry` | Episode-plan function | `FUNCTION_SPECS.guided_inquiry` | EP · DLA · GAM | beat-dependent | material obligation | prompt/scenario materials | — | — | Uncertainty/trade-off prompts in GAM |
| 72 | `guided_reasoning` | Episode-plan function | `FUNCTION_SPECS.guided_reasoning` | EP · DLA · GAM | beat-dependent | material obligation | partial table/template | — | `pre_filled_decision_table` | Learner justifications required in material |
| 73 | `guided_practice` | Episode-plan function | `FUNCTION_SPECS.guided_practice` | EP · DLA · GAM | beat-dependent | material obligation | faded scaffold materials | — | merge with worked/independent | Distinct partial-attempt material on GAM |
| 74 | `independent_performance` | Episode-plan function | `FUNCTION_SPECS.independent_performance` | EP · DLA · GAM | beat-dependent | material + task | template without model copy | — | `sample_output_as_copy_source` | No copy-path from sample_output |
| 75 | `evaluative_judgement` | Episode-plan function | `FUNCTION_SPECS.evaluative_judgement` | EP · DLA · GAM | beat-dependent | material + task | template / decision_table | — | `template_only_memo` | Defended judgement material + task |
| 76 | `verification` | Episode-plan function | `FUNCTION_SPECS.verification` | EP · DLA · GAM | beat-dependent | → checklist material | checklist bucket | — | `checklist_only_tick` | Checklist with rubric/repair spec per population contract |
| 77 | `revision` | Episode-plan function | `FUNCTION_SPECS.revision` | EP · DLA · GAM | beat-dependent | material + task | — | — | — | Rework obligation after audit |
| 78 | `reflection` | Episode-plan function | `FUNCTION_SPECS.reflection`; maps to `self_explanation_prompt` | EP · DLA · R | beat-dependent | → cognition field | Reflect slots | — | `consolidation_summary`, designer prose | Beat → `self_explanation_prompt` not designer-only prose |
| 79 | `transfer` | Episode-plan function | `FUNCTION_SPECS.transfer` | EP · DLA · GAM | beat-dependent | → `transfer_prompt` material | Transfer bucket | — | `single_optional_sentence` | Full transfer_prompt body on GAM → DP |
| 80 | `prediction` | Episode-plan function | `FUNCTION_SPECS.prediction` | EP · DLA · GAM | beat-dependent | material obligation | — | — | — | Anticipation material before evidence |
| 81 | `observation` | Episode-plan function | `FUNCTION_SPECS.observation` | EP · DLA · GAM | beat-dependent | material obligation | — | — | — | Evidence confrontation material |
| 82 | `transition` | Episode-plan function | `FUNCTION_SPECS.transition` | EP · DLA | beat-dependent | task_segment | — | — | — | Bridge segment in DLA task, not membership loss |

---

## Matrix — Workflow constraint

| # | Canonical element | Family | Source of truth | Expected stages | Requiredness | Preservation | Renderer mapping | Aliases | Fidelity risks | Audit check instruction |
|---|-------------------|--------|-----------------|-----------------|--------------|--------------|------------------|---------|----------------|-------------------------|
| 83 | `accessibility` | Workflow constraint | `domains/learning-design/domain-learning-design-step-patterns.md` brief constraints template | Brief → prompts | optional hard constraint | N/A (brief policy) | none | — | — | If brief mentions accessibility: confirm constraint reflected in step notes/outputs (manual) |

---

## Minimal sprint audit checklist

Use this reduced checklist to answer **A / B / C** for a representative workflow run. Collect artefacts: EP JSON · DLA JSON · GAM (pack/JSON) · LS (if used) · DP JSON · rendered HTML.

### A. Does required learner-support information exist upstream of Design Page?

| ID | Check | Elements covered | Pass criterion |
|----|-------|------------------|----------------|
| A1 | **Episode plan beats populated** | EP functions #59–82 | Each EP `beats[].function` in `FUNCTION_SPECS`; archetype frozen V1 |
| A2 | **DLA activity row completeness** | #2–19, #17–18 | Every activity: `learner_task`, `expected_output`, `required_materials[]`; learner-page: `activity_preamble` + ≥1 `MANDATORY_COGNITION_FIELD_IDS` |
| A3 | **DLA obligations match beats** | EP → DLA trace | Each beat class (`material` / `cognition` / `task_segment`) has matching `required_materials` row or cognition field per population contract |
| A4 | **GAM realises every `required_materials` entry** | #29–46 | For each DLA `material_id`: matching GAM block with non-placeholder `content`; `usage` present |
| A5 | **GAM body depth (spot)** | worked, checklist, transfer, consolidation | No catalogue synopsis; worked steps visible; checklist ≥ verification pattern; transfer not label-only (`LD-MATERIALS-COPY` forbidden patterns) |
| A6 | **Conditional packs/factors** | #21–28, #12–13 | If workflow activates cognition packs/factors: corresponding row fields present on DLA |
| A7 | **Learning sequence does not drop activities** | #58 | LS references ⊆ DLA `activity_id` set (LS omits are not membership authority for DP) |

### B. Does the Design Page preserve it?

| ID | Check | Elements covered | Pass criterion |
|----|-------|------------------|----------------|
| B1 | **Activity membership closure** | #53 | Every upstream DLA `activity_id` in DP `learning_activities.content[]` unless traceable `generation_notes.activities_omitted[]` |
| B2 | **Row-field verbatim (PEL/cognition/task)** | #2–19, #1 | `FIELD_PRESERVATION_FIELD_IDS` + `learner_task` + `expected_output` + `support_note`: DLA string === DP row string (per `activity_id`) |
| B3 | **Material bodies verbatim (per `material_id`)** | #29–46 | For each substantive GAM material: body on DP row `materials` (by `material_id` or mapped page key); no empty/placeholder; no `generation_notes.limitations` material-excuse lines |
| B4 | **No type-key collapse** | KC risk | Count upstream GAM materials per activity vs substantive keys on DP; multiple `Mxx` not reduced to single `scenario`/`checklist`/type alias only |
| B5 | **Closure validator (when GAM in PRISM state)** | VS risk | `validatePageMaterialsClosure` outcome ≠ `fail` when upstream supplied; if `skip`, record “validator not run” |
| B6 | **Wrapper sections** | #49–52 | `overview` / `learning_purpose` / `study_tips` may differ (synthesis); must not replace B2/B3 content |
| B7 | **Assessment / support sections** | #54–55 | If upstream assessment: `assessment_check` structured; `support_notes` section if provided |

### C. Does the renderer display it?

| ID | Check | Elements covered | Pass criterion |
|----|-------|------------------|----------------|
| C1 | **Framing / PEL visible** | #1–16 | Per activity HTML: preamble, reasoning cue, study orientation when on DP row |
| C2 | **Cognition packs visible** | #21–28 | Pack fields on DP row → matching `util-cognition--*` blocks |
| C3 | **Task / output visible** | #17–18 | `util-activity-task` primary task; expected output cues present |
| C4 | **Material buckets / order** | #29–46, manifestation grammar | Study/Do/Check/Reflect/Transfer sections contain corresponding material HTML; pipe tables render |
| C5 | **Pedagogic salience markers** | #36–37, #32 | Worked/checklist markdown headings (`What experts notice`, `Common mistakes`, etc.) render as callouts when in source |
| C6 | **No facilitator leakage** | #20 | `facilitator_moves` / facilitator headings absent from learner HTML |
| C7 | **Display-only transforms flagged** | #32, #29 | Checklist diagnostic split and task-card instruction suppression are display-only — source JSON unchanged (compare DP JSON to HTML, not re-audit B3) |

### Sprint exit questions (one line each)

1. **A** — For each activity, does the upstream chain (EP→DLA→GAM) contain the learner-support elements the workflow claims?  
2. **B** — Does DP JSON preserve those elements verbatim (row fields + material bodies), with no undocumented omission?  
3. **C** — Does rendered HTML surface the preserved DP content in the expected manifestation buckets?

---

*End of audit matrix. No fixes or implementation tickets — scoping only.*
