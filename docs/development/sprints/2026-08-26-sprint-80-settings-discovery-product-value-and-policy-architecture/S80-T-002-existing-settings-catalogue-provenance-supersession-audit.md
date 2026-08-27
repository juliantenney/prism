# S80-T-002 — Existing Settings catalogue + provenance + supersession audit

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator-reviewed 2026-08-26)  
**Mode:** Investigation / discovery only — **no production Settings behaviour change**  
**Predecessor:** [S80-T-001](S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md) — COMPLETE / ACCEPTED  
**Next task:** S80-T-003 — Settings product value, catalogue philosophy and UX framing

---

## 0. Method and evidence standard

Dimensions kept separate:

| Dimension | Meaning |
| --------- | ------- |
| **Declared** | Present in pack `workflowParameterControls` / `stepParameterControls` |
| **Rendered** | Aggregated into unified Settings UI when step included |
| **Persisted** | Written to `[PRISM_STEP_PARAMS]` via Settings sync |
| **Read** | Code parses the param block or factor |
| **Causally effective** | Changing the value can alter current live Create / Studio / Run behaviour |

Classifications:

**Implementation status:** `ACTIVE_CURRENT_VALUE` · `ACTIVE_ONLY_AT_CREATE/RESOLVE` · `STUDIO_ONLY_OR_REBAKE_DEPENDENT` · `PERSISTED_BUT_RUNTIME_INERT` · `PARTIALLY_ACTIVE` · `UNCLEAR`

**Product classification:** `GENUINE_USER_POLICY` · `USEFUL_EXPLICIT_OVERRIDE` · `DERIVED_OR_INFERABLE` · `SUPERSEDED` · `REDUNDANT` · `REMOVE_CANDIDATE` · `UNCLEAR`

Confidence: **H**igh / **M**edium / **L**ow.

Machine extract of declarations: [`_t002-inventory-raw.json`](_t002-inventory-raw.json).

---

## 1. Inventory totals

| Layer | Count |
| ----- | ----- |
| Workflow-level controls (LD pack) | **4** |
| Step-level controls (LD pack) | **37** |
| **Total declared Settings controls** | **41** |
| Episode Plan step Settings | **0** (intentional) |
| Research pack Settings controls (prior diagnostic) | **0** |

### By canonical step

| Canonical step | n |
| -------------- | - |
| `step_design_page` | 2 |
| `step_design_assessment` | 7 |
| `step_generate_assessment_items` | 10 |
| `step_normalize_content` | 3 |
| `step_model_knowledge` | 3 |
| `step_define_learning_outcomes` | 4 |
| `step_design_learning_activities` | 4 |
| `step_generate_activity_materials` | 1 |
| `step_construct_learning_sequence` | 3 |

### Typical learner-page visible (~21)

When a standard LD learner-page graph includes Workflow + MK + LO + DLA + GAM + LS + Design Page (and **excludes** Normalize / Assessment):

| Layer | n |
| ----- | - |
| Workflow | 4 |
| Model Knowledge | 3 |
| Learning Outcomes | 4 |
| DLA | 4 |
| GAM | 1 |
| Learning Sequence | 3 |
| Design Page | 2 |
| **Total** | **21** |

Badge source: `countUnifiedWorkflowVisibleParameterControls` (`app.js`) — counts **visible declarations for included steps**, not proven causal levers.

---

## 2. `[PRISM_STEP_PARAMS]` topology

| Question | Finding |
| -------- | ------- |
| What is it? | Line-oriented `key=value` block between `[PRISM_STEP_PARAMS]` and `[/PRISM_STEP_PARAMS]` |
| Writers | `upsertWorkflowStepParamBlock`; `syncUnifiedWorkflowSettingsToStepNotes` (Settings UI); Prompt Studio option save paths; Create/resolve `stepParamPatch` via mappingRules |
| Readers | `parseWorkflowStepParamBlock` → `readWorkflowParamsObject` (workflow.notes) / `readWorkflowStepParamsObject` (step.notes); Studio option prefill; Settings summary; brief relevance indexes |
| Workflow.notes vs step.notes | **Different scopes, same encoding.** Workflow-level Settings keys live in **workflow.notes**; step Settings keys live in **that step’s notes**. |
| Is it runtime authority? | **Mixture.** It is durable UI/state transport. Live **Run/Copy** for V2 DLA/GAM is **not** generally driven by re-reading these notes; authority is usually frozen `resolvedFactors` / constraints / baked `override_prompt_body` / canonical assemblers. Studio **can** re-read notes and re-bake. |
| `PRISM_PARAMS` | **No** production tag in current `app.js` (0 hits). Historical/informal name only. |

**Do not decide future persistence architecture here (T-005).**

---

## 3. Create vs Settings vs Studio vs Run (cross-cutting)

```text
Create / brief resolve
  → resolvedFactors + mappingRules → workflowOutputSpec.constraints
    and/or stepParamPatch into [PRISM_STEP_PARAMS]
  → may seed baked override_prompt_body

My Workflows Settings
  → render pack controls → sync → [PRISM_STEP_PARAMS] in notes → Save workflow JSON
  → does NOT reliably re-resolve brief factors or re-bake Run bodies

Prompt Studio (step “Settings…” / workflow-step mode)
  → reads step params / userOptions
  → applyWorkflowStepPromptDefaults: {{option:*}} substitution + promptInstruction*
  → can rewrite draft / local override

Run / Copy
  → buildWorkflowStepInstructions + resolveStepPromptText
  → V2 DLA/GAM: canonical assemblers + frozen factors / scaffolds
  → pack body often cleared (DLA) or assembler-owned (GAM)
  → Settings notes frequently NOT re-interpreted
```

---

## 4. Complete per-setting ledger

Abbreviations: **Impl** = implementation status; **Prod** = product classification; **Conf** = confidence.

### 4.1 Workflow-level (4)

| key | label | type / options | persist | writers | readers | Create | Settings-after | Studio | Run/Copy | intended rationale | architectural decision | CURRENT owner | superseding arch | Impl | Prod | Conf |
| --- | ----- | -------------- | ------- | ------- | ------- | ------ | -------------- | ------ | -------- | ------------------ | ---------------------- | ------------- | ---------------- | ---- | ---- | ---- |
| `delivery_context` | Delivery context | select: in_person, online_sync, online_async, blended, **self_directed** | workflow.notes `[PRISM_STEP_PARAMS]` | Settings sync; Create heuristics/mappingRules | brief resolve → `constraints.delivery_context`; many scaffold gates read **resolvedFactors** | **Yes** (factors/scaffolds) | Persist yes; **re-resolve no** (typical) | Indirect if factors already set | Uses **frozen** factors for self-directed scaffolds / rhetoric | Pedagogic delivery mode without long interview | Cross-stage delivery policy | **Author policy** interpreted by workflow/runtime scaffolds + stages | PEL/self-directed scaffolds contextualise delivery; Settings edit alone weak | `ACTIVE_ONLY_AT_CREATE/RESOLVE` (+ residue) | `GENUINE_USER_POLICY` | H |
| `design_scope` | Design scope | select: single_activity, session, sequence, module | workflow.notes | Settings; mappingRules | constraints / brief | Yes | Persist; weak re-apply | Weak | Frozen constraints residue | Bound design breadth | Session vs module breadth | Author / Create resolve | Stage graphs still infer topology | `ACTIVE_ONLY_AT_CREATE/RESOLVE` | `GENUINE_USER_POLICY` | H |
| `input_strategy` | Input strategy | select: generate_from_topic, provided_source_content, mixed | workflow.notes | Settings; Create heuristics | constraints; topology (MK inclusion) | Yes | Persist; weak re-apply | Weak | Frozen residue | Topic vs uploaded source | Source topology policy | Author / Create | Source honesty contracts | `ACTIVE_ONLY_AT_CREATE/RESOLVE` | `GENUINE_USER_POLICY` | H |
| `duration_minutes` | Session duration (minutes) | number 10–480; default 60 | workflow.notes; also maps to LS stepParams | Settings; mappingRules | constraints; LS duration default | Yes | Persist; LS may stay stale until re-run | If LS rebake | Frozen / LS artefact | Session timing budget | Timing allocation policy | Author + **Learning Sequence** interpretation | Timing projection (S78-T-037) reads artefacts more than live Settings | `PARTIALLY_ACTIVE` | `GENUINE_USER_POLICY` | H |

Declaration: `domains/learning-design/domain-learning-design-step-patterns.md` → `workflowBriefConfig.workflowParameterControls`. All `elicitation: settings-only`.

---

### 4.2 Model Knowledge (3) — `step_model_knowledge`

| key | label | type | persist | Studio mechanism | Run/Copy | decision / owner | Impl | Prod | Conf |
| --- | ----- | ---- | ------- | ---------------- | -------- | ---------------- | ---- | ---- | ---- |
| `include_relationships` | Include concept relationships | boolean | step.notes | `userOptions` + `promptInstructionWhenTrue` on Studio bake | Only if baked into override / Studio body | Optional KM richness / **Author override**; KM stage owns modelling honesty | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | H |
| `include_misconceptions` | Include misconceptions | boolean | step.notes | same | same | Optional misconception facet / Author override; source-honesty owned by KM | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | H |
| `include_processes` | Include processes/workflows | boolean (advanced) | step.notes | same | same | Optional process facet / Author override | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | H |

---

### 4.3 Normalize Content (3) — `step_normalize_content`

| key | label | type / options | Studio | Run | owner | Impl | Prod | Conf |
| --- | ----- | -------------- | ------ | --- | ----- | ---- | ---- | ---- |
| `structure_mode` | Structure mode | preserve_original_structure \| reorganise_into_sections | `{{option:structure_mode}}` in pack template | If override baked | Author normalize policy / Normalize step | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `detail_level` | Detail level | preserve_full_detail \| lightly_simplify_language | userOptions / template | If baked | Author | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `keep_examples` | Keep examples | boolean | `promptInstructionWhenTrue` | If baked | Author | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | M |

Visible only when Normalize step included (not in typical 21).

---

### 4.4 Learning Outcomes (4) — `step_define_learning_outcomes`

| key | label | type / options | Studio | Run | owner | Impl | Prod | Conf |
| --- | ----- | -------------- | ------ | --- | ----- | ---- | ---- | ---- |
| `learnerLevel` | Learner level | school…general_adult | `{{option:learnerLevel}}` | If baked | Author outcome framing; also mappable from brief `learner_level` | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` (Create may seed) | `GENUINE_USER_POLICY` | H |
| `numberOfOutcomes` | Number of outcomes | number 2–12 | `{{option:numberOfOutcomes}}` | If baked | Author quantity policy | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `GENUINE_USER_POLICY` | H |
| `cognitiveEmphasis` | Cognitive emphasis | mixed / foundational / application / analysis | `{{option:cognitiveEmphasis}}` | If baked | Author emphasis; risk of over-constraining LO quality | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `scope` | Outcome scope | lesson / module / course | `{{option:scope}}` | If baked | Author framing; overlaps `design_scope` | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `REDUNDANT` vs workflow `design_scope` (partial) / `UNCLEAR` | M |

---

### 4.5 Design Learning Activities (4) — `step_design_learning_activities`

**Critical current-path note:** Live V2 DLA clears pack body and assembles via `assembleDlaCanonicalContract` (Phase D). Studio V2 replaces draft with canonical assembler. Pack `userOptions` / `{{option:activity_pattern_mix}}` therefore **do not reach** the live model-visible DLA constitution on the canonical path.

| key | label | options | historical intent | CURRENT decision owner | superseding architecture | Impl | Prod | Conf |
| --- | ----- | ------- | ----------------- | ---------------------- | ------------------------ | ---- | ---- | ---- |
| `activity_pattern_mix` | Activity pattern mix | guided / balanced / applied_collaborative | Global activity-pattern steering | **Canonical DLA + Episode Plan beats / PEL** | Canonical DLA; EP FunctionEnum; guided-learning scaffolds | `PERSISTED_BUT_RUNTIME_INERT` (V2 canonical) | `SUPERSEDED` | H |
| `grouping_preference` | Grouping preference | mixed / individual / pair / small_group / whole_group | Global grouping micromanagement | **DLA** (delivery-aware) + **delivery_context** | Self-directed / DLA-WB individual constraints; delivery policy | `PERSISTED_BUT_RUNTIME_INERT` (V2) | `SUPERSEDED` (as global) / maybe override later | H |
| `difficulty_level` | Activity difficulty | introductory / moderate / advanced | Global challenge knob | **DLA production commissioning** + LO cognitive demand | Canonical DLA production/evidence contracts | `PERSISTED_BUT_RUNTIME_INERT` (V2) | `SUPERSEDED` | H |
| `coverage_breadth` | Coverage breadth | narrow / balanced / broad | Outcome coverage intensity | **DLA** LO-operation coverage (T-033 etc.) + design_scope | Canonical DLA coverage gates | `PERSISTED_BUT_RUNTIME_INERT` (V2) | `SUPERSEDED` | H |

**Scaffolding hypothesis check:** There is **no** Settings key named `scaffolding_level`. Closest analogues are DLA `activity_pattern_mix=guided` and LS `sequencing_style=progressive_scaffold`. Both are **stage-contextual** decisions now owned by EP/DLA/LS/PEL machinery more than a global Settings knob. Marked **SUPERSEDED** / investigate-as-override only — not “wire to activate.”

---

### 4.6 Generate Activity Materials (1) — `step_generate_activity_materials`

| key | label | options | notes | Impl | Prod | Conf |
| --- | ----- | ------- | ----- | ---- | ---- | ---- |
| `session_materials` | Session materials | page / slide_deck / page,slide_deck | Product **topology** (what artefacts to produce), not GAM pedagogical depth. Live GAM is canonical assembler; this control does not retune materials quality. Related to one-product honesty (PB-FA-008). | `PARTIALLY_ACTIVE` / `UNCLEAR` causal for slide_deck sibling | `GENUINE_USER_POLICY` (topology) **or** Create/product declaration — not GAM pedagogy | M |

CURRENT owner of materials **content:** canonical **GAM**. Owner of **whether a deck exists:** workflow/product topology (author) — Settings may be the wrong surface.

---

### 4.7 Learning Sequence (3) — `step_construct_learning_sequence`

| key | label | options | Impl | Prod | Conf |
| --- | ----- | ------- | ---- | ---- | ---- |
| `duration_minutes` | Sequence duration | number 15–240 | `PARTIALLY_ACTIVE` — Create maps from workflow duration; Settings edit needs LS re-run | `GENUINE_USER_POLICY` (duplicate of workflow duration — precedence unclear) | H |
| `sequencing_granularity` | Sequencing granularity | lightweight / standard / detailed | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `sequencing_style` | Sequencing style | progressive_scaffold / spiral_revisit / assessment_anchored | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | `USEFUL_EXPLICIT_OVERRIDE` (not global scaffolding) — **do not confuse with retired “scaffolding level”** | M |

CURRENT owner: **Learning Sequence** stage interprets timing/style; author may set budget/style policy.

---

### 4.8 Design Page (2) — `step_design_page`

| key | label | options | Impl | Prod | Conf |
| --- | ----- | ------- | ---- | ---- | ---- |
| `page_profile` | Page profile | learner / facilitator / assessment | `PARTIALLY_ACTIVE` — Create/elicited; page shell/`page_profile` object elsewhere; Settings may seed but DP contracts dominate wrapper ownership | `GENUINE_USER_POLICY` | M |
| `include_examples` | Include examples | boolean (advanced) | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` / weak vs thin-assembly rules | `USEFUL_EXPLICIT_OVERRIDE` or `UNCLEAR` | L |

CURRENT owner of learner-facing page composition: **Design Page** + deterministic assemble; Settings must not fight thin-assembly.

---

### 4.9 Design Assessment (7) — `step_design_assessment`

| key | label | notes | Impl | Prod | Conf |
| --- | ----- | ----- | ---- | ---- | ---- |
| `activity_type` | Question strategy | elicited; `{{option:activity_type}}` in blueprint template | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` (+ Create seed) | `GENUINE_USER_POLICY` (assessment workflows) | H |
| `total_items` | Total assessment items | `{{option:total_items}}` | same | `GENUINE_USER_POLICY` | H |
| `coverage_scope` | Coverage scope | template option | same | `GENUINE_USER_POLICY` | H |
| `difficulty_profile` | Difficulty profile | template option (values differ from Gen Items twin) | same | `GENUINE_USER_POLICY` | H |
| `cognitive_demand` | Cognitive demand profile | advanced | same | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `assessment_cadence` | Assessment cadence | advanced | same | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `feedback_display` | Feedback display | prompt-shaping; not Design Feedback step | same | `USEFUL_EXPLICIT_OVERRIDE` | M |

Not in typical learner-page 21. CURRENT owner: **Design Assessment** stage + author policy for assessment product.

---

### 4.10 Generate Assessment Items (10) — `step_generate_assessment_items`

| key | label | Impl | Prod | Conf |
| --- | ----- | ---- | ---- | ---- |
| `number_of_items` | Number of items | `STUDIO_ONLY_OR_REBAKE_DEPENDENT` (inherits DA total by design) | `GENUINE_USER_POLICY` / twin of `total_items` → `REDUNDANT` risk | H |
| `response_formats` | Allowed response formats | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `difficulty_profile` | Difficulty profile | Studio/rebake; **value set differs** from DA twin | `GENUINE_USER_POLICY` + consistency debt | H |
| `coverage_mode` | Coverage mode | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `composition_mode` | Composition mode | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `stimulus_mode` | Stimulus mode | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `scenario_scope` | Stimulus scope | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `cognitive_emphasis` | Cognitive emphasis | Studio/rebake; overlaps LO/DA cognitive knobs | `REDUNDANT` / `UNCLEAR` | M |
| `feedback_mode` | Item feedback mode | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |
| `question_style_mix` | Response mode mix | Studio/rebake | `USEFUL_EXPLICIT_OVERRIDE` | M |

CURRENT owner: **Generate Assessment Items** (+ inheritance from DA). Dense catalogue is assessment-product oriented.

---

## 5. Implementation-status summary

| Status | Controls (representative) |
| ------ | ------------------------- |
| `ACTIVE_ONLY_AT_CREATE/RESOLVE` | Workflow `delivery_context`, `design_scope`, `input_strategy` (live effect via frozen factors) |
| `PARTIALLY_ACTIVE` | Workflow/LS `duration_minutes`; `page_profile`; `session_materials` |
| `STUDIO_ONLY_OR_REBAKE_DEPENDENT` | MK include_*; Normalize; LO options; Assessment families; LS style/granularity |
| `PERSISTED_BUT_RUNTIME_INERT` | **All four DLA Settings on live V2 canonical path** |
| `UNCLEAR` | Exact slide_deck topology causality from `session_materials` without fresh behavioural probe |

**None** of the 41 are proven `ACTIVE_CURRENT_VALUE` for “edit Settings → Save → Run immediately changes instructions” on the modern V2 learner-page path.

---

## 6. Product-classification summary

| Prod class | Examples |
| ---------- | -------- |
| `GENUINE_USER_POLICY` | delivery_context, design_scope, input_strategy, duration; LO count/level; assessment totals/strategy; (topology) session_materials |
| `USEFUL_EXPLICIT_OVERRIDE` | MK include_*; Normalize modes; LO cognitiveEmphasis; LS granularity/style; many assessment advanced knobs; DP include_examples (weak) |
| `DERIVED_OR_INFERABLE` | Much of grouping/difficulty/coverage once delivery_context + LOs + EP exist |
| `SUPERSEDED` | DLA activity_pattern_mix, grouping_preference, difficulty_level, coverage_breadth (as global Settings vs canonical DLA/EP/PEL) |
| `REDUNDANT` | LO `scope` vs workflow design_scope; dual duration; DA↔Gen Items twins; cognitive knobs repeated |
| `REMOVE_CANDIDATE` | Inert-after-Settings-only DLA globals if product rejects overrides; any control that cannot state a consequence contract |
| `UNCLEAR` | session_materials surface; DP include_examples value |

---

## 7. Current decision-owner map

| Decision family | CURRENT owner |
| --------------- | ------------- |
| Delivery mode / self-directed framing | Author policy → **workflow/runtime scaffolds** reading **resolvedFactors** |
| Design breadth / input topology | Author → Create resolve / graph |
| Session timing budget | Author → **Learning Sequence** (+ duration fields on artefacts) |
| Knowledge facet richness | Author override → **Model Knowledge** prompt (Studio/bake) |
| Outcome count/level | Author → **LO** step (Studio/bake) |
| Instructional journey / beats / scaffolding pattern | **Episode Plan** + **PEL** / guided-learning — **not** Settings |
| Activity production / evidence / independence | **Canonical DLA** |
| Materials realisation | **Canonical GAM** |
| Page wrapper / visual planning | **Design Page** |
| Assessment blueprint/items | **DA / GAI** stages (+ author assessment policy) |
| Presentation profile | Author + Design Page / shell |

---

## 8. Superseded-control findings

1. **DLA global pedagogical knobs** (`activity_pattern_mix`, `grouping_preference`, `difficulty_level`, `coverage_breadth`): historically Prompt Factory `userOptions`; now **overridden** by singular canonical DLA constitution on live V2 paths. Product value as Settings is **doubtful**; may be SUPERSEDED entirely or demoted to rare explicit overrides with stage interpretation.  
2. **“Scaffolding level” analogue:** no exact key; `progressive_scaffold` is an **LS sequencing style**, and `guided` is a **DLA pattern mix** — both better as stage policy than global Settings. PEL/guided-learning scaffolds contextualise support.  
3. **Repeated cognitive/difficulty knobs** across LO / DLA / DA / GAI create competing authority without a typed policy model.

---

## 9–12. Candidate buckets (for T-003 — not final)

### Genuine-user-policy candidates

`delivery_context`, `design_scope`, `input_strategy`, `duration_minutes` (single SoT needed), LO `numberOfOutcomes` / `learnerLevel`, assessment strategy/totals (when assessment product), possibly product topology (`session_materials` / page vs deck) if relocated honestly.

### Explicit-override candidates

MK include_*; Normalize structure/detail/examples; LS granularity/style; selected assessment advanced knobs; carefully bounded DP include_examples.

### Derived / inferable candidates

DLA grouping/difficulty/coverage/pattern once delivery + EP + LOs known; many cognitive emphases.

### Remove / redundant candidates

Inert DLA Settings on V2; duplicate duration; duplicate difficulty/cognitive across stages; Settings that only exist to restate Create factors.

### Unclear / further evidence

`session_materials` causal path; whether any Settings→Run path was recently repaired (static evidence says no); Research domain (0 controls).

---

## 13–15. Persistence, path behaviour, provenance

Covered in §§2–3. Historical thesis (S21–22 / S75 / PB-FA-005): avoid long elicitation; PRISM defaults; post-create tune. **Catalogue exposure outran Run authority.** Post S77–79 + DLA Phase D, stage assemblers further reduced the legitimacy of pedagogical micromanagement Settings.

---

## 16. Architectural contradictions / competing authority

1. UI promise (“Tune…”) vs Run ignoring notes.  
2. DLA Settings still declared/rendered while canonical DLA ignores them.  
3. Workflow duration vs LS duration dual SoT.  
4. DA vs Gen Items parallel difficulty/coverage keys with **different option enums**.  
5. Step header “Settings…” (Prompt Studio) vs My Workflows Settings tab.  
6. Frozen `resolvedFactors` vs editable Settings notes divergence after creation.

---

## 17. Missing-policy observations (for T-003 only)

- Author need for **honest “apply policy / re-resolve / re-bake”** action may be stronger than new knobs.  
- **Generate Learning Content** still has no Settings (prior likely gap) — only revisit after authority model.  
- Episode Plan Settings still **not justified**.  
- Possible missing **product topology / one-product** declaration (related to `session_materials` / PB-FA-008) — not a DLA/GAM pedagogy knob.  
- Do **not** invent new pedagogical intensity Settings.

---

## 18. Files / history inspected

- `domains/learning-design/domain-learning-design-step-patterns.md` (controls, userOptions, mappingRules, templates)  
- `app.js` (`parse`/`upsert`/`syncUnified`/`countUnified`/`applyWorkflowStepPromptDefaults`/`resolvedFactors` scaffolds)  
- `docs/architecture/workflow-settings-catalogue-effectiveness-diagnostic.md`  
- `docs/backlog/PRODUCT-BACKLOG.md` (PB-FA-005)  
- S80-T-001; Sprint 21/22/75 references via prior diagnostic  
- Canonical DLA/GAM ownership (post Phase D / S79) as protected context  

---

## 19. Files changed (this task)

- This record: `S80-T-002-existing-settings-catalogue-provenance-supersession-audit.md`  
- `_t002-inventory-raw.json` (machine extract)  
- Sprint pointers updated for T-001 COMPLETE / T-002 current (STATUS, START-HERE, PLAN, HANDOVER, briefing, README, NEXT-SPRINT)

No production Settings behaviour code changed.

---

## 20. Acceptance assessment

| Criterion | Status |
| --------- | ------ |
| Complete declared catalogue inventoried | **MET** (4 + 37) |
| Persistence topology for `[PRISM_STEP_PARAMS]` documented | **MET** |
| Create / Settings / Studio / Run distinctions documented | **MET** |
| Dual classification (impl vs product) applied | **MET** |
| Current decision owners identified | **MET** |
| Supersession audit (incl. scaffolding analogues) | **MET** |
| No activation / no T-003 product choice | **MET** |
| Fresh behavioural “change one setting → Run diff” probes | **Not run** — static evidence; residual UNCLEAR noted |

---

## 21. Exact next task

Operator review of this ledger → mark S80-T-002 **ACCEPTED** in STATUS → begin **S80-T-003** (product-value and catalogue decision analysis).  

**Do not** choose A/B/C/D here. **Do not** implement or activate controls.
