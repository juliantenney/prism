# Activity Type System Inventory

**Sprint:** 63 — Cognitive Flow & Reasoning Visibility  
**Type:** Discovery only (no production changes)  
**Date:** 2026-07-16  
**Status:** Evidence inventory  

**Related:** [Sprint 63 charter](../../../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md) · [Learning Experience Evolution](../../../architecture/learning-experience-evolution.md) · [HANDOVER](HANDOVER.md)

**Method:** Repository-wide search of `lib/`, schemas/artefacts docs, prompts, fixtures, tests, and sprint records. RNA A1–A6 used only as **test cases**, not as authoritative pattern definitions.

---

## 1. Executive Summary

PRISM does **not** have a single centralised “activity type” model. Activity identity is **distributed** across several independent vocabularies that are only loosely coupled:

| Vocabulary | Count (production) | Role |
| ---------- | ------------------ | ---- |
| Episode archetypes | **4** | Activity Bloom / episode shell (`understand` \| `apply` \| `analyse` \| `evaluate`) |
| Instructional archetypes | **4** | Material pedagogy + `archetype_plan` |
| Beat / episode functions | **24** | Episode choreography (`beats[].function`) |
| Pedagogical renderer beats | **10** | Material→UI family (READ, EXAMPLE, PRACTICE, …) |
| Material types (registry) | **50** | Presentation / storage format |
| Activity interaction types | **7** | Interaction modality (sequencing, ranking, …) |
| Assessment / item types | **6+** | Assessment strategy (mcq, essay, …) — **not** pedagogic activity kinds |
| Docs-only instructional candidates | **~13** | Sprint 59 inventory; not in production allowlist |

**Headline finding:** Activity differences that learners experience are driven primarily by **material types + beat functions + framing fields**, not by a first-class activity-type enum. **Instructional archetypes** are the richest explicit cognitive contracts upstream, but they are **material-level**, optional, and **not consumed by the learner renderer**. Episode archetypes are explicit but often **under-used** in rendered pages relative to their full V1 templates (fixtures frequently emit shortened beat lists that look alike across families).

**Where identity lives today**

1. **Most explicit (upstream pedagogy):** `required_materials[].instructional_archetype` + `archetype_plan` — `lib/ld-instructional-archetype.js`  
2. **Most explicit (activity structure):** `episode_plan.archetype` + `beats[].function` — `lib/episode-plan-v1-*.js`  
3. **Most visible (renderer):** `material_type` + beat grouping + Sprint 62 learner-facing labels — `lib/beat-material-registry.js`, `app.js`  
4. **Most inferred:** learner_task / expected_output wording; LO cognitive verbs; material combinations

**Implication for Sprint 63:** There is enough **distributed** information to support differentiated manifestation *experiments* that recombine existing signals — but there is **no** single activity-type SoT, and instructional-archetype meaning currently **stops before the renderer**.

---

## 2. Vocabulary Inventory

Confidence legend: **High** = code allowlist/validation; **Medium** = artefacts/docs controlled lists; **Low** = free text / inferred.

### 2.1 Explicit activity or task types

| Value | Concept | Defined In | Produced By | Consumed By | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ------- | ---------- |
| `sequencing` | Activity interaction | Domain LD artefacts | DLA / authoring | Workbook / page UI | timeline reorder fixtures | High (artefacts) |
| `ranking` | Activity interaction | Domain LD artefacts | DLA | Workbook ranking | workbook fixtures | High |
| `classification` | Activity interaction | Domain LD artefacts | DLA (documented) | Sparse fixture use | artefacts controlled list | Medium |
| `discussion` | Activity interaction | Domain LD artefacts | DLA | Page / session | sequencing-rollout fixture | Medium |
| `analysis` | Activity interaction | Domain LD artefacts | DLA | Sparse | artefacts list | Medium |
| `practice` | Activity interaction | Domain LD artefacts | DLA | EV-38F fixtures | Medium |
| `reflection` | Activity interaction | Domain LD artefacts | DLA | Sparse | Medium |
| `mcq` / `short_answer` / `essay` / `problem` / `case_study` / `mixed` | **Assessment** `activity_type` / `assessment_type` | Domain step-patterns; `app.js` maps | Brief / Design Assessment | Assessment item generation | **Not** pedagogic activity kind | High |
| *(none)* | `activity_kind` | — | — | — | **Field absent** | High |
| *(free text)* | `task_type` | Assessment render meta | Assessment step | Assessment UI | Synonym of item type | Low |
| *(free text)* | `transformation_activity` | Design-page Activity schema | DLA cognition | Manifestation REFLECT fields | Cognition prose, not enum | High (as open string) |
| `guided` / `balanced` / `applied_collaborative` | `activity_pattern_mix` | Step-patterns | Brief / DLA | Planning | Pattern mix, not activity type | Medium |

**Note:** There is **no** production field named `activity_type` that means pedagogic family (classification / causal analysis / …).

### 2.2 Episode archetypes

| Value | Concept | Defined In | Produced By | Consumed By | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ------- | ---------- |
| `understand` | Episode Bloom shell | `lib/episode-plan-v1-templates.js` `ARCHETYPE_TEMPLATES`; `FROZEN_ARCHETYPES` in validation | Episode Plan step; LO `cognitive_level` map | Page compose; role fidelity; framing prompts | RNA A1 | High |
| `apply` | Episode Bloom shell | same | same | same | RNA A3 | High |
| `analyse` | Episode Bloom shell | same | same | same | RNA A2, A4, A5 | High |
| `evaluate` | Episode Bloom shell | same | same | same | RNA A6 | High |

**Default / recommended beat sequences** (`lib/episode-plan-v1-templates.js` lines 11–84):

| Archetype | Template beat sequence (recommended; not hard-enforced as full sequence) |
| --------- | ------------------------------------------------------------------------ |
| `understand` | orientation → framing → activation → explanation → example → non_example → misconception_confrontation → guided_practice → independent_performance → verification → reflection → transition |
| `apply` | orientation → framing → activation → criteria_exposition → worked_thinking → guided_practice → independent_performance → verification → revision → reflection → transfer → transition |
| `analyse` | orientation → framing → activation → criteria_exposition → explanation → worked_thinking → guided_inquiry → guided_practice → independent_performance → verification → reflection → transfer → transition |
| `evaluate` | orientation → framing → activation → perspective_construction → criteria_exposition → criteria_construction → worked_judgement → guided_inquiry → guided_reasoning → independent_performance → evaluative_judgement → verification → reflection → transfer → transition |

**Aliases** (`COGNITIVE_TO_ARCHETYPE`, same file ~86–98): `explain`/`remember*` → understand; `analyze`/`analysis` → analyse; `evaluating`/`evaluation` → evaluate.

**Related field:** `activity_archetype` appears on some design-page artefacts (understand/apply/analyse/evaluate) as an inferred/parallel Bloom label — e.g. Sprint 38P EV fixtures — **not** the same as instructional_archetype.

**Renderer use:** Episode archetype is **not** the primary learner-visible branch. Renderer uses `beats[].function` (+ materials). Archetype influences upstream planning and some framing prompt text (`app.js` self-directed framing by archetype ~7799).

### 2.3 Instructional archetypes (material-level)

**Production allowlist** — `lib/ld-instructional-archetype.js` `ALLOWED` / `ALLOWED_ARCHETYPES` (lines 118–123); `SCRIPT_VERSION` `20260715-e01w`:

| Value | Concept | Defined In | Produced By | Consumed By | Plan keys (`PLAN_KEYS`) | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ----------------------- | ------- | ---------- |
| `mechanism_explanation` | Causal chain pedagogy | `ld-instructional-archetype.js` | DLA `required_materials[]` | GAM compact `RULES.*`; validation | `start`, `outcome`, `required_links` | Enzymes S59 test material | High |
| `process_walkthrough` | Staged investigation walkthrough | same | DLA | GAM | `process_goal`, `stages` | Enzymes process test | High |
| `mental_model_building` | System model + contrast | same | DLA | GAM | `system`, `key_relationships`, `governing_constraint`, `contrast{state_a,state_b}` | Thermostat test | High |
| `evaluation_judgement` | Criteria-based judgement | same (Sprint 61-E01) | DLA | GAM | `question`, `criteria`, `evidence`, `tradeoffs`, `judgement_focus` | Evaluative materials | High |

**Docs-only / deferred** (Sprint 59 framework — **not** in `ALLOWED`):  
`concept_exposition`, `worked_analysis`, `evidence_interpretation`, `diagnostic_comparison`, `worked_judgement` *(alias)*, `guided_practice`, `independent_performance`, `evaluation` *(alias)*, `recommendation`, `verification`, `transfer`, `consolidation`, `misconception_repair`.

**Naming collisions**

| String | System |
| ------ | ------ |
| `evaluation_judgement` | Instructional archetype ID |
| `evaluative_judgement` | Beat function |
| `worked_judgement` | Beat function (+ docs alias for instructional) |

**Critical consumption gap:** `lib/ld-instructional-manifestation-render.js` has **no** references to `instructional_archetype` / `archetype_plan`. Learner HTML does not branch on instructional archetype.

### 2.4 Beat functions (episode FunctionEnum)

**Authoritative:** keys of `FUNCTION_SPECS` in `lib/episode-plan-population-contract.js` (~23–144); enforced by `lib/episode-plan-v1-validation.js`.

| Value | Concept | Defined In | Produced By | Consumed By | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ------- | ---------- |
| `orientation` | Cognition beat | population contract | Episode Plan | Cognition map → `activity_preamble`; registry REFLECT | templates | High |
| `framing` | Cognition / task | same | Episode Plan | → `reasoning_orientation` | templates | High |
| `activation` | Cognition | same | Episode Plan | → `prior_knowledge_activation` | templates | High |
| `explanation` | Material | same | Episode Plan | Beat-first render; label Understand | RNA A1–A6 | High |
| `example` | Material | same | Episode Plan | EXAMPLE materials | templates | High |
| `non_example` | Material | same | Episode Plan | EXAMPLE | templates | High |
| `misconception_confrontation` | Material | same | Episode Plan | DISCUSS / prompt_set | templates | High |
| `criteria_exposition` | Material | same | Episode Plan | READ | apply/analyse/evaluate templates | High |
| `criteria_construction` | Material / task | same | Episode Plan | CREATE / template | evaluate template | High |
| `perspective_construction` | Material / task | same | Episode Plan | CREATE | evaluate template | High |
| `worked_thinking` | Material | same | Episode Plan | EXAMPLE; label See it modelled | RNA A1–A2 | High |
| `worked_judgement` | Material | same | Episode Plan | EXAMPLE | RNA A6 | High |
| `guided_inquiry` | Material | same | Episode Plan | DISCUSS | analyse/evaluate templates | High |
| `guided_reasoning` | Material | same | Episode Plan | PRACTICE | evaluate template | High |
| `guided_practice` | Material | same | Episode Plan | PRACTICE; label Your turn | RNA A1–A6 | High |
| `independent_performance` | Material / task | same | Episode Plan | PRACTICE | templates | High |
| `evaluative_judgement` | Material / task | same | Episode Plan | EVALUATE | evaluate template | High |
| `verification` | Material | same | Episode Plan | CHECK; label Check your work | RNA A1–A6 | High |
| `revision` | Material / task | same | Episode Plan | PRACTICE | apply template | High |
| `reflection` | Cognition / task | same | Episode Plan | → `self_explanation_prompt`; REFLECT | templates | High |
| `transfer` | Material / task | same | Episode Plan | PRACTICE; label Apply elsewhere | RNA A6 | High |
| `prediction` | Material / task | same | Episode Plan | REFLECT; T3 chain | transition chains | High |
| `observation` | Material | same | Episode Plan | READ; T3 | transition chains | High |
| `transition` | Task segment | same | Episode Plan | NOTE | templates | High |

**Transition chains** (documented, not hard full-sequence validation) — `TRANSITION_CHAINS` T1–T5 in population contract.

**Learner-facing presentation labels** (Sprint 62) — `LEARNER_FACING_EPISODE_FUNCTION_LABELS` in `lib/beat-material-registry.js`: maps subsets of the above to Understand / See it modelled / Your turn / Check your work / Apply elsewhere. Unknown functions fall back to structural `episodeFunctionLabel`.

**Label-only gap:** `guided_judgement` appears in structural label maps but **not** in `FUNCTION_SPECS` / `EPISODE_FUNCTION_BEATS`.

### 2.5 Instructional / pedagogical beats (renderer material families)

| Value | Concept | Defined In | Produced By | Consumed By | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ------- | ---------- |
| `READ` | Material family | `beat-material-registry.js` | Material type mapping | Icons / ordering | text, scenario | High |
| `EXAMPLE` | Material family | same | same | same | worked_example | High |
| `CHECK` | Material family | same | same | same | checklist | High |
| `DISCUSS` | Material family | same | same | same | prompt_set | High |
| `CREATE` | Material family | same | same | same | template | High |
| `PRACTICE` | Material family | same | same | same | analysis_table | High |
| `EVALUATE` | Material family | same | same | same | rubric | High |
| `REFLECT` | Material family | same | same | same | consolidation_summary | High |
| `NOTE` | Material family | same | same | same | support_note | High |
| `WATCH` | Material family | same | same | same | video | High |

Fallback text classifier: `lib/utility-pedagogical-beats.js` `BEAT_RULES`.

### 2.6 Material types (registry — 50)

**Source:** `MATERIAL_BEAT_REGISTRY` in `lib/beat-material-registry.js`.

| Value | Concept | Defined In | Produced By | Consumed By | Associated beat / episodeFunctions (registry) | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ----------------------------------------------- | ------- | ---------- |
| `text` | Exposition body | registry | GAM / assemble | Renderer | READ; explanation, observation | RNA A*-M1 | High |
| `exposition` | Exposition | registry | GAM | Renderer | READ; explanation | — | High |
| `reading` / `reading_text` | Reading | registry | GAM | Renderer | READ | — | High |
| `criteria_exposition` | Criteria text | registry | GAM | Renderer | READ; criteria_exposition | — | High |
| `scenario` / `scenarios` / `study_scenarios` | Scenario | registry | GAM | Scenario cards | READ; guided_* / transfer | RNA A3, A4, A6 | High |
| `worked_example` / `worked_examples` | Worked model | registry | GAM | Worked UI | EXAMPLE; example, worked_thinking, worked_judgement, non_example | RNA A1, A2, A5, A6 | High |
| `modelling_note` | Model note | registry | GAM | EXAMPLE | EXAMPLE; worked_thinking, worked_judgement | RNA A4 | High |
| `sample_output` | Model answer | registry | GAM | EXAMPLE | EXAMPLE; worked_thinking, example | RNA A1 | High |
| `examples` | Examples | registry | GAM | EXAMPLE | EXAMPLE | — | High |
| `checklist` / `checklists` | Checklist | registry | GAM | Checklist UI | CHECK; verification | RNA all | High |
| `output` / `expected_output` | Deliverable meta | registry | Activity fields / materials | Output / Success looks like | CHECK | Activity `expected_output` | High |
| `prompt_set` / `prompt` / `prompts` / `discussion` | Prompts | registry | GAM | Prompt UI | DISCUSS; guided_inquiry, misconception_confrontation | — | High |
| `template` / `templates` / `worksheet_template` | Template | registry | GAM | Template UI | CREATE; criteria_construction, perspective_construction, independent_performance, evaluative_judgement, guided_practice | RNA A6 memo | High |
| `task_card` / `task_cards` / `cards` | Task cards | registry | GAM | Card grid | PRACTICE; guided_practice, guided_reasoning, independent_performance | kitchen-sink | High |
| `what_to_do` / `guidance` / `instructions` | Task instructions | registry | Activity / materials | What to do / Your goal | PRACTICE | learner_task path | High |
| `transfer_prompt` | Transfer | registry | GAM | PRACTICE | PRACTICE; transfer | RNA A6-M7 | High |
| `table` / `worksheet` | Generic table | registry | GAM | Worksheet | PRACTICE; guided_reasoning | — | High |
| `analysis_table` | Analysis grid | registry | GAM | Worksheet | PRACTICE | RNA A2, A4, A5 | High |
| `comparison_table` | Comparison grid | registry | GAM | Worksheet | PRACTICE | fixtures | High |
| `impact_table` | Impact grid | registry | GAM | Worksheet | PRACTICE | — | High |
| `classification_table` | Classification grid | registry | GAM | Worksheet | PRACTICE | RNA A1 | High |
| `reference_table` | Reference | registry | GAM | Worksheet | READ; criteria_exposition, explanation | — | High |
| `decision_table` | Decision grid | registry | GAM | Worksheet | PRACTICE; guided_practice, guided_reasoning, evaluative_judgement | RNA A6 | High |
| `rubric` | Rubric | registry | GAM | EVALUATE | EVALUATE; evaluative_judgement, verification | — | High |
| `consolidation_summary` | Consolidation | registry | GAM | REFLECT | REFLECT; reflection, transfer | — | High |
| `strategy` / `strategy_options` | Strategy menu | registry | GAM | Strategy UI | REFLECT | kitchen-sink | High |
| `support_note` / `support` / `support_notes` | Support | registry | Activity / GAM | Support aside | NOTE | Marx fixtures | High |
| `materials` / `metadata` / `production` | Meta / bags | registry | Page | Meta fold | NOTE | — | High |
| `video` | Video | registry | GAM | WATCH | WATCH | — | High |

**Out-of-registry but used** (dead/partial signals): `planning_table` (RNA A3; worksheet path in `app.js`), `reflection_prompt`, `worked_analytic_pass`, `discussion_prompts` (remap→prompt_set), `evaluation_checklist` (remap→checklist), `data_table`, US `modeling_note`.

Schema material_type is largely **open vocabulary** (`design-page.schema.vNext.json`); registry is authoritative for beats.

### 2.7 Assessment types

| Value | Concept | Defined In | Produced By | Consumed By | Example | Confidence |
| ----- | ------- | ---------- | ----------- | ----------- | ------- | ---------- |
| `mcq` | Assessment strategy | Brief / step-patterns | Design Assessment | Item generation | Default | High |
| `short_answer` | same | same | same | same | High |
| `essay` | same | same | same | same | High |
| `problem` | same | same | → short_answer map | High |
| `case_study` | same | same | → essay map | High |
| `mixed` | same | same | all_formats_mix | High |
| `single_answer_mcq` / `multiple_answer_mcq` / `true_false` / … | Item / response formats | Generate Assessment Items | Assessment step | Assessment render | High |

### 2.8 Other relevant classifications

| Value / field | Concept | Defined In | Notes | Confidence |
| ------------- | ------- | ---------- | ----- | ---------- |
| `phase_type` | Learning-sequence phase | LS timeline / schema | Open string (build, apply, orient, …) — **not** `learning_phase` | Medium |
| `cognitive_level` on LOs | Bloom input | LO artefacts | Maps to episode archetype | High |
| Cognition fields | Reasoning prompts | Activity schema | `reasoning_orientation`, `self_explanation_prompt`, `source_to_application_prompt`, `uncertainty_tension_prompt`, `prior_knowledge_activation`, `argument_structure_hint`, `conceptual_contrast_prompt`, … — **open strings** | High |
| Manifestation buckets | STUDY/DO/CHECK/REFLECT/TRANSFER | `ld-instructional-manifestation-render.js` | Key lists for instructional grammar | High |
| Role families | GAM purpose→canonical key | `page-role-registry.js` | Assembly / fidelity | High |

---

## 3. Activity Identity Signal Map

| Signal | Stage | Explicit or Implicit | Example Values | Used Downstream? |
| ------ | ----- | -------------------- | -------------- | ---------------- |
| LO `cognitive_level` | LO design | Explicit | understand, apply, analyse, evaluate | → episode archetype mapping |
| `episode_plan.archetype` | Episode Plan / page | Explicit | understand, apply, analyse, evaluate | Planning, framing prompts; **weak** in renderer UI |
| `beats[].function` | Episode Plan / page | Explicit | explanation, worked_thinking, … | **Yes** — beat-first render + Sprint 62 labels |
| `required_materials[].instructional_archetype` | DLA | Explicit (optional) | mechanism_explanation, … | **GAM yes**; **renderer no** |
| `required_materials[].archetype_plan` | DLA | Explicit (optional) | start/outcome/… | **GAM yes**; **renderer no** |
| `material_type` | GAM / materials[] | Explicit | classification_table, analysis_table, … | **Yes** — primary renderer branch |
| `activity_interaction_type` | DLA / page | Explicit (when set) | sequencing, ranking, … | Workbook / specialised UI |
| `learner_task` | DLA | Implicit (prose) | “Complete the analysis table…” | Framing; Sprint 62 goal-shaped gate |
| `expected_output` | DLA | Implicit (prose) | “Completed analysis table…” | Success looks like / Output |
| Cognition fields | DLA | Explicit fields / implicit meaning | reasoning_orientation, … | Manifestation framing |
| `assessment_type` / item types | Assessment | Explicit | mcq, essay | Assessment section only |
| `activity_archetype` | Some pages | Semi-explicit | understand… | Parallel Bloom label; inconsistent presence |
| Material combinations | Assemble / page | Implicit | scenario + decision_table + template | Strong learner-visible family signal |
| Text classifiers | Renderer fallback | Implicit | BEAT_RULES regex | Fallback only |

---

## 4. Known Activity Families

RNA A1–A6 are **test cases** against this inventory, not definitions.

| Family | Evidence | Source fields | Representative fixtures | Likely cognitive operation | Confidence |
| ------ | -------- | ------------- | ----------------------- | -------------------------- | ---------- |
| Classification | `classification_table` registry type; interaction type `classification`; RNA A1 materials | material_type, learner_task | `rna-hcv-assembled-vnext-materials-page.json` A1 | Assign instances to categories | **Strongly inferred** (material) / Medium (interaction enum) |
| Causal / mechanism analysis | Instructional `mechanism_explanation` + plan keys; analysis_table; worked_example | instructional_archetype, material_type | Enzymes mechanism tests; RNA A2 (materials only — **no** instructional_archetype on RNA fixture) | Trace cause→effect chains | **Explicit** (instructional) / Strongly inferred (RNA materials) |
| Process modelling / walkthrough | Instructional `process_walkthrough`; planning_table (out-of-registry); scenario | instructional_archetype; material_type | Enzymes process tests; RNA A3 | Stage-ordered procedure on evidence | **Explicit** (instructional) / Strongly inferred (RNA A3) |
| Systems / mental model | Instructional `mental_model_building`; modelling_note | instructional_archetype; material_type | Thermostat tests; RNA A4 | Assemble system + contrast states | **Explicit** (instructional) / Strongly inferred (RNA A4) |
| Comparative analysis | `comparison_table`; analysis_table “comparing…” tasks | material_type; learner_task | RNA A5; Marx comparison activities | Compare entities on criteria | **Strongly inferred** |
| Evaluation & judgement | Episode `evaluate`; instructional `evaluation_judgement`; decision_table; template; worked_judgement beat | archetype + instructional_archetype + materials | RNA A6; evaluative fixtures | Weigh criteria → justified judgement | **Explicit** (both layers) when instructional_archetype present; otherwise strongly inferred |
| Guided practice / independent performance | Beat functions + task_cards | beats, material_type | Episode templates | Perform with scaffolding | Explicit as **beats**, not activity family |
| Transfer / application extension | Beat `transfer`; transfer_prompt | beats, material_type | RNA A6-M7 | Apply elsewhere | Explicit as **beat/material** |
| Sequencing / ranking | `activity_interaction_type` | interaction enum | Workbook sequencing fixtures | Order / prioritise | **Explicit** (interaction) |
| Assessment (MCQ/essay/…) | assessment_type | assessment enums | Kitchen-sink assessment | Test knowledge | **Explicit** but separate track |
| Prediction→observation→revision | Transition chain T3 | beats | population contract | Hypothesis testing | Explicit as **chain**, sparse in fixtures |
| Reflection / consolidation | reflection beat; consolidation_summary; cognition fields | beats, materials, fields | templates / cognition packs | Metacognition | Mixed |
| Argumentation / diagnosis / design / rehearsal | Mostly prose LOs / docs candidates | — | Sparse | Various | **Weakly inferred** / docs-only |

---

## 5. Renderer Manifestation Matrix

| Activity Signal | Renderer Behaviour | Location | Learner-Visible Difference |
| --------------- | ------------------ | -------- | -------------------------- |
| `beats[].function` | Beat sections + order; Sprint 62 learner labels | `app.js` beat-first render; `learnerFacingEpisodeFunctionLabel` | Phase headings (Understand / See it modelled / …) |
| `material_type` = checklist | Checkbox / checklist block | `app.js` checklist render | Checklist UI |
| `material_type` = scenario* | Scenario cards | `renderScenarioBlocks` | Scenario cards / stages |
| `material_type` = task_card* | Task card grid | `renderTaskCardBlocks` | Card layout |
| `material_type` = *table / worksheet / planning_table | Worksheet table scroll | `renderOrderedWorksheetBlock` | Tables (type mostly same UI family) |
| `material_type` = template* | Template block | template render path | Dashed template UI |
| `material_type` = worked_example / modelling_note / sample_output | Worked / model blocks | EXAMPLE paths | Modelled reasoning presentation |
| `material_type` = prompt_set* | Prompt set | prompt render | Prompt list |
| `material_type` = transfer_prompt | Practice material in transfer beat | beat + material | Transfer prompt body |
| Pedagogical beat (READ/EXAMPLE/…) | Icons / role classes | registry + `utilityMaterialTypeFromKeyHint` | Iconography |
| Goal-shaped `learner_task` | “Your goal” vs “What to do” | `isGoalShapedLearnerTask` / `buildLearnerJourneyFrameHtml` | Opening label only |
| Checklist / expected_output | “Success looks like”; Output dedupe | `buildLearnerJourneyFrameHtml` | Frame success block |
| Instructional grammar path | STUDY / DO / CHECK sections | `ld-instructional-manifestation-render.js` | Section grammar |
| `page_profile` learner vs design | Manifestation vs legacy | page render entry | Layout grammar |
| `activity_interaction_type` sequencing | Timeline / ordering UI | workbook / specialised paths | Interaction modality |
| Assessment item types | MCQ / options / keys | assessment section render | Assessment UI |
| `instructional_archetype` | **None found** | manifestation render | **No learner-visible difference** |
| `episode_plan.archetype` alone | Framing prompt hints only | workflow framing text | Weak / indirect |

**Differentiation class**

| Class | Dominant? |
| ----- | --------- |
| Material-type differentiation | **Yes** (primary) |
| Episode-beat differentiation | **Yes** (structure + labels) |
| Activity-level differentiation | **Weak** (no activity-type enum; archetype rarely drives UI) |
| Purely visual differentiation | Icons, badges, CSS roles |

---

## 6. Cross-Layer Trace

Legend: **✓** present · **~** partial / shortened · **✗** absent / flattened · **→** handoff

### 6.1 Classification (RNA A1 as test case)

```text
source / LO verbs          → classify / identify (implicit in brief/LO; not typed)
→ DLA                      → learner_task inventory prose; materials specified by type
→ instructional_archetype  → ✗ not present on RNA A1 materials
→ GAM                      → bodies for text / worked_example / sample_output / classification_table / checklist
→ episode plan             → archetype=understand; beats=explanation→worked_thinking→guided_practice→verification
                              (~ flattened vs full understand template)
→ learning sequence        → (page-level; not family-specific)
→ design page              → materials[] + episode_plan attached
→ renderer                 → classification_table → PRACTICE worksheet; beat labels Understand/See it modelled/Your turn/Check your work
```

**Flatten point:** Cognitive “classification” is carried by **material_type + task prose**, not by instructional_archetype or a unique beat sequence (same shortened beat list as A2 causal analysis).

### 6.2 Causal analysis (RNA A2 + mechanism_explanation SoT)

```text
source                     → analyse / causal verbs
→ DLA                      → learner_task goal-shaped; analysis_table specified
→ instructional_archetype  → ✓ available in production SoT (mechanism_explanation) but ✗ not on RNA fixture
→ GAM                      → RULES.mechanism_explanation when archetype present; else generic material body
→ episode plan             → archetype=analyse; beats same shortened list as A1
→ design page              → materials + episode_plan
→ renderer                 → analysis_table worksheet; Sprint 62 Frame (Your goal + Success looks like)
                              instructional_archetype ✗ not read
```

**Flatten point:** Even when DLA/GAM carry `mechanism_explanation`, **renderer ignores it**. Fixture without instructional_archetype still “looks like” causal analysis via table + worked example only.

### 6.3 Process modelling (RNA A3 + process_walkthrough SoT)

```text
source                     → plan / respond / process
→ DLA                      → scenario + planning_table (+ checklist)
→ instructional_archetype  → ✓ process_walkthrough in SoT; ✗ not on RNA A3
→ GAM                      → RULES.process_walkthrough when present
→ episode plan             → archetype=apply; shortened beats
→ design page              → planning_table material (⚠ not in beat registry)
→ renderer                 → planning_table treated as worksheet branch; diagnostics may warn unassigned
```

**Flatten point:** `planning_table` is a **fixture/render path without registry membership**; process identity is material-inferred. Instructional archetype (when present) stops at GAM.

### 6.4 Systems analysis (RNA A4 + mental_model_building SoT)

```text
source                     → systems / evasion / model
→ DLA                      → modelling_note + scenario + analysis_table
→ instructional_archetype  → ✓ mental_model_building in SoT; ✗ not on RNA A4
→ GAM                      → RULES.mental_model_building when present
→ episode plan             → archetype=analyse; beats include worked_thinking…
→ design page              → modelling_note typed
→ renderer                 → modelling_note as EXAMPLE; no system/contrast plan surfacing
```

**Flatten point:** Plan fields (`system`, `governing_constraint`, `contrast`) never become learner-visible structure unless authored into body text by GAM.

### 6.5 Evaluation and judgement (RNA A6 + evaluation_judgement SoT)

```text
source                     → evaluate / prioritise / judge
→ DLA                      → inventory learner_task; decision_table + template + transfer_prompt
→ instructional_archetype  → ✓ evaluation_judgement in SoT; ✗ not on RNA A6 materials
→ GAM                      → RULES.evaluation_judgement when present (worked_example / template guidance)
→ episode plan             → archetype=evaluate; beats include worked_judgement + transfer + verification
→ design page              → evaluative material set
→ renderer                 → decision_table + template + transfer; labels See it modelled / Apply elsewhere / Check your work
                              criteria/tradeoffs/judgement_focus ✗ not structured in UI from archetype_plan
```

**Flatten point:** Episode archetype `evaluate` and beat `worked_judgement` survive; rich judgement **plan** does not reach renderer. Inventory-style learner_task blocks Sprint 62 “Your goal” (documented A6 boundary).

---

## 7. Inconsistencies and Dead Signals

| Issue | Evidence |
| ----- | -------- |
| No single activity-type enum | No `activity_kind`; pedagogic `activity_type` absent |
| `activity_type` name collision | Means assessment strategy in step-patterns, not pedagogic family |
| Instructional archetypes unused by renderer | No hits in `ld-instructional-manifestation-render.js` |
| Docs inventory ≫ production allowlist | Sprint 59 framework lists ~13 candidates; `ALLOWED` has 4 |
| Alias collisions | `evaluation` / `worked_judgement` docs aliases vs `evaluation_judgement`; `evaluative_judgement` beat |
| Episode templates vs fixture beats | Full V1 sequences rarely emitted; RNA A1/A2 share identical shortened beat lists despite different archetypes |
| Material types out of registry | `planning_table`, `reflection_prompt`, `worked_analytic_pass` used but not in `MATERIAL_BEAT_REGISTRY` |
| Schema open vocabulary vs registry | Material types open in schema; beats closed in registry |
| `learning_phase` absent | Closest: `phase_type` (open), beat functions |
| `guided_judgement` label without FunctionEnum | Labels map includes value not in `FUNCTION_SPECS` |
| Prompt vocabulary may exceed renderer | Cognition fields + instructional plans richer than learner UI structure |
| Renderer invents presentation structure | Sprint 62 labels / Frame are presentation-only; cognitive family still inferred from materials |
| Upstream distinctions flattened | instructional_archetype + archetype_plan stop at GAM |
| Overlapping concepts | material_type vs instructional_archetype vs episode archetype vs beat function vs pedagogical beat — four layers, easy to conflate |
| Assessment track parallel | `assessment_type` orthogonal to pedagogic identity |

---

## 8. Conclusions

### 1. Does PRISM currently have an activity-type system?

**No single system.** It has **multiple overlapping type systems**: episode archetypes, instructional archetypes, beat functions, material types, interaction types, and assessment types.

### 2. Is it centralised or distributed?

**Distributed.** Strongest closed allowlists live in:

- `lib/ld-instructional-archetype.js` (instructional)
- `lib/episode-plan-v1-*.js` + `episode-plan-population-contract.js` (episode + functions)
- `lib/beat-material-registry.js` (materials → pedagogical beats)

There is no unified activity-family SoT.

### 3. Which distinctions are already explicit?

- Episode archetypes (4)
- Instructional archetypes + plan structures (4 + PLAN_KEYS)
- Beat functions (24) + transition chains
- Material types (50 registry + aliases)
- Activity interaction types (7 documented)
- Assessment strategies / item formats

### 4. Which distinctions are only inferable?

- Classification / comparative / causal **families** when instructional_archetype is absent (common in assembled fixtures)
- Cognitive operations implied by learner_task / expected_output prose
- “Process modelling” via `planning_table` + scenario without registry/archetype
- Many Sprint 59 deferred instructional IDs (docs-only)

### 5. Which distinctions reach the renderer?

- **Yes:** material_type, beats[].function (incl. Sprint 62 labels), pedagogical beats, interaction_type (specialised), assessment item types, framing/cognition field text, learner_task/expected_output presentation
- **No (or negligible):** instructional_archetype, archetype_plan structured fields, full episode-archetype template differences when beats are shortened

### 6. Where does activity identity become flattened?

Primary flatten points:

1. **After GAM:** instructional_archetype / archetype_plan do not enter manifestation/render.  
2. **At episode emission:** shortened beat lists make different episode archetypes look alike (RNA A1 vs A2).  
3. **At material UI:** many table types share one worksheet renderer — family difference is content/columns, not component grammar.  
4. **At presentation:** Sprint 62 improves navigation labels but cannot invent missing cognitive contracts.

### 7. Is there enough existing information to support differentiated manifestation experiments without schema redesign?

**Yes, cautiously — for experiments that recombine existing signals:**

- Use **material_type + beat.function + episode.archetype + existing framing fields** already on the page.
- Optionally surface **already-authored** checklist / expected_output / cognition prose (Sprint 62 style: no invented meaning).
- Do **not** assume instructional_archetype is available on all pages (often absent on assembled fixtures).
- Do **not** treat RNA provisional patterns as the type system; they are **illustrative** of inferred families.

A full Cognitive Activity Manifestation Catalogue is **justified as a Sprint 63 next discovery artefact**, provided it:

- maps **existing** signals → candidate manifestation patterns;
- marks confidence (explicit / inferred);
- keeps activity purpose ≠ cognitive operation ≠ episode structure ≠ instructional archetype ≠ material type ≠ renderer component distinct;
- does **not** prematurely propose schema redesign.

---

## Appendix A — Production allowlists (copy-ready)

**Instructional:** `mechanism_explanation` | `process_walkthrough` | `mental_model_building` | `evaluation_judgement`

**Episode:** `understand` | `apply` | `analyse` | `evaluate`

**Beat functions (24):**  
`orientation` | `framing` | `activation` | `explanation` | `example` | `non_example` | `misconception_confrontation` | `criteria_exposition` | `criteria_construction` | `perspective_construction` | `worked_thinking` | `worked_judgement` | `guided_inquiry` | `guided_reasoning` | `guided_practice` | `independent_performance` | `evaluative_judgement` | `verification` | `revision` | `reflection` | `transfer` | `prediction` | `observation` | `transition`

**Pedagogical beats:** `READ` | `EXAMPLE` | `CHECK` | `DISCUSS` | `CREATE` | `PRACTICE` | `EVALUATE` | `REFLECT` | `NOTE` | `WATCH`

## Appendix B — Primary evidence files

| Role | Path |
| ---- | ---- |
| Instructional SoT | `lib/ld-instructional-archetype.js` |
| DLA archetype guidance | `lib/ld-dla-page-enrich-contract.js` |
| Episode templates | `lib/episode-plan-v1-templates.js` |
| FunctionEnum | `lib/episode-plan-population-contract.js` |
| Episode validation | `lib/episode-plan-v1-validation.js` |
| Material↔beat registry | `lib/beat-material-registry.js` |
| Text beat fallback | `lib/utility-pedagogical-beats.js` |
| Manifestation grammar | `lib/ld-instructional-manifestation-render.js` |
| Material remap | `lib/page-render-normalize.js` |
| Renderer | `app.js` (material/beat/journey presentation) |
| Docs inventory | `docs/development/sprints/2026-07-14-sprint-59-instructional-content-richness-audit/instructional-archetype-framework.md` |
| RNA test fixture | `tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json` |

## Appendix C — Vocabulary count summary

| Layer | Distinct production values |
| ----- | -------------------------- |
| Episode archetypes | 4 |
| Instructional archetypes | 4 |
| Beat functions | 24 |
| Pedagogical beats | 10 |
| Material types (registry) | 50 |
| Activity interaction types | 7 |
| Assessment strategy types | 6 |
| Docs-only instructional candidates | ~13 |
| **Distinct vocabulary systems** | **≥ 8** (plus open-string cognition / phase fields) |
