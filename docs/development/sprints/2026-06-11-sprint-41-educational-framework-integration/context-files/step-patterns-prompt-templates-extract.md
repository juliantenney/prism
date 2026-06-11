# Sprint 41 extract — LD step promptTemplate sections

Source: `domains/learning-design/domain-learning-design-step-patterns.md` (full file ~3.5k lines; not copied in full)

Complete Prompt Factory blocks for framework integration review:

## 5. Design Learning Activities

### Type
Generation

### Input
learning_outcomes, episode_plans (and optionally knowledge_model or learning_content)

### Output
learning_activities

### Purpose
- Populate learning_activities obligations from upstream episode_plans
- Enable learners to achieve outcomes through populated beat obligations

### Blended / HE Guidance
- Respect resolved workflow constraints: `design_scope`, `delivery_pattern`, `learning_environments`
- Design activities that are valid for each selected environment
- Keep this step focused on activity design; do not generate full material content here

### Aliases
- Generate Learning Activities
- Create Learning Activities
- Design Activities

### Prompt Factory
```json

{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, episode_plans (required — authoritative archetype and ordered instructional-function beats from upstream Episode Plan), and optionally knowledge_model or learning_content.\n\nTask:\nPopulate executable learning_activities from upstream episode_plans. This step is an obligation population step — translate each episode_plan beat into activity fields and required_materials obligations. It is not a learning-design, sequencing, archetype-selection, or session-arc step. Do not replan beats, archetypes, function sequences, or cross-activity session arc.\n\nInstructions:\n- Every activity must be implementation-ready with explicit learner_task, observable expected_output, required_materials, grouping, and duration_minutes\n- Consume episode_plans beat order and archetype as fixed — populate obligations per beat; do not reconstruct function_sequence or infer primary_archetype from LO alone\n- Learner-facing fields may use limited Markdown: ##/### headings, lists, **bold**, simple pipe tables, --- rules\n- Canonical contracts: LD-TABLE-FIDELITY (table types → pipe tables in GAM); LD-MATERIALS-COPY (specify types/requirements only; GAM authors bodies); LD-MATH-RENDER (TeX \\(...\\) / \\[...\\] only); LD-SELF-DIRECTED-RHETORIC when self_directed\n- Omit facilitator_moves and failure_mode for self_directed learner-page workflows\n- Use workflow constraints when present: design_scope, delivery_pattern, learning_environments\n- Define required_materials as material_id, type, purpose, specification — not full material bodies\n- Use KM/LO affordances to enrich specification wording only — not to replan beats or archetypes\n- Avoid LO→task shells; use KM definitions/processes/misconceptions in specs where relevant beats require them\n- If design_scope is single_activity, produce one focused activity unless clearly justified\n- Do not produce discussion-only, facilitator-redesign, or delivery-impossible activities\n- Apply step notes when provided: {{stepNotes}}\n\nObligation population gates (38S — mandatory BEFORE learner_task or required_materials; upstream episode_plans owns archetype and beat order — populate, do not replan; internal reasoning only):\n- IFP-04 POPULATION INFERENCE: INF-01 infer from LO/brief + existing KM only; INF-02 no invented domain facts except brief/minimal scenario constants; INF-03 criteria operational; INF-04 strategy menu 3–6 neutral not pre-ranked; INF-05 exemplar models reasoning not single answer; INF-06 scenario numerics illustrative; Evaluate archetype specs: 3–5 criteria, ≥2 perspectives, ≥2 trade-off prompts, worked judgement weak vs strong (strong ≠ expected_output), Transfer with same criteria; forbid pre-written learner memo in consolidation_summary, pre-ranked strategy, session summary as Evaluate teaching; INF-EVAL-01 (38L-4): KM-T05 household budget inflation workbook → fourth Evaluate LO = household strategy judgement (38I-4 A4); KM-T08 policy communication = macro context only — not primary Evaluate driver\n- IFP-05 ANTI-SHELL: shell = preamble + single learner_task + thin materials without beat obligations — FAIL; AS-01 every Required beat has required_materials entry; AS-02 learner_task ≥2 teach/model segments before perform; AS-03 ≥1 teaching-depth spec (worked_example, modelling_note, text exposition, scenario narrative); AS-04 Verification ≥4 check items specified; AS-05 expected_output = observable evidence not topic coverage; AS-06 Evaluate EV-SHELL-01..07; AS-FAIL-01 <80% beat functions populated; AS-FAIL-02 learner_task dominates without Worked thinking/Explanation; AS-FAIL-03 materials only for DLA-WB checklist without beat map; AS-FAIL-04 capstone Evaluate with consolidation_summary+prompt_set only; AS-FAIL-05 Apply without Worked thinking when KM-T03 fired; AS-FAIL-06 (38L-4 R5): Evaluate with guided judgement but missing independent judgement template/task_cards OR verification checklist OR transfer_prompt — add missing obligation rows before emit\n- IFP-06 ANTI-SPOILER: allow worked/modelling/criteria teaching specs; forbid completed learner memo in consolidation_summary when learner must write; sample_output not copy target; SP-01..04 scaffold-only specs when learner-production required (GAM realises in §6)\n- OBLIGATION POPULATION (38S — authoritative beat→obligation contract; merges IFP-09/10 + DLA-WB-26..31): For every Required beat from episode_plans, each required_materials row MUST include depth_floor: L3 plus content obligations — not type-only specs; apply FUNCTION_SPECS + 38K-2 five-dimension sufficiency; GAM-PRES realises bodies. Gates when function Required (cognition fields alone FAIL): G1 Verification (DLA-WB-26 / 38L-2 R1) → every activity MUST list type checklist with purpose verification/self-check/rubric; depth_floor L3: ≥4 criteria-linked check items + repair/revise if any fail; table completion alone does NOT satisfy verification (AS-04, EMIT-FAIL-04); G2 Transfer → transfer_prompt row when Transfer Required; G3 Independent judgement (Evaluate / DLA-WB-28) → template|task_cards separate from consolidation_summary; expected_output names memo artefact; scaffold only per IFP-06; G4 Worked analytic pass (Analyse / DLA-WB-27 / 38L-2 R6) → worked_example|modelling_note with purpose worked analytic pass BEFORE analysis_table; fact→analytical lens→mechanism→draft cell walkthrough; analysis_table spec requires ≥1 exemplar row or hint column; G5 Guided judgement → analysis_table|decision_table|comparison_table with ≥1 partial exemplar row or hint column + scoring guide. Evaluate completion pack (DLA-WB-31 / 38L-4 — EV-CAP-03/04, INF-EVAL-01): criteria exposition (≥3 dimensions) + scenario (≥2 perspectives) + worked judgement weak vs strong + guided table + independent judgement + checklist + transfer_prompt — consolidation_summary alone does NOT satisfy Evaluate; EV-CAP-04: guided judgement alone CANNOT terminate Evaluate; independent judgement + verification + transfer Materials required. Apply (DLA-WB-23): when archetype=Apply and KM-T03 (process ≥3 steps) list worked_example with stepped think-aloud before independent practice. Depth discipline (DLA-WB-30 / 38L-2 R2): every R-function Material specification includes depth_floor: L3 content obligations — thin type-only specs are depth FAIL. Anti-emission (DLA-WB-29 / EMIT-FAIL-01..04): transfer_or_application_task without transfer_prompt; verification implied only by complete the table; consolidation_summary as sole Evaluate capstone evidence; prompt_set substituting for checklist — add Materials before JSON emit (do not replan beats)\nSelf-study workbook contract (DLA-WB — when delivery_context is self_directed AND brief/desired outputs imply ~60-minute learner workbook or learner page). Types/purposes only — GAM authors bodies (LD-MATERIALS-COPY). Mandatory rows as explicit required_materials JSON when applied — delivery_notes alone insufficient:\n- DLA-WB-01: delivery_notes: resource_intent self_study_workbook, session_duration_target_minutes (~60), consolidation_requirement, workbook_contract_applied: true\n- DLA-WB-02: Every activity maps ≥1 learning outcome ID; final capstone maps ≥3 distinct outcome IDs when ≥3 outcomes available\n- DLA-WB-03: Sum of activity duration_minutes across the session must be 50–70 unless delivery_notes documents an explicit brief exception\n- DLA-WB-04/17: solo-completable — individual grouping; omit facilitator_moves/failure_mode\n- DLA-WB-06: session MUST NOT be table-only — ≥2 type families; *_table activities need ≥1 non-table type\n- DLA-WB-06a (38F-2 mandatory row — V-01): When workbook_contract_applied is true, the session MUST include ≥1 explicit required_materials row whose type is a table/reference family token: classification_table | comparison_table | analysis_table | impact_table | reference_table | data_table | decision_table | planning_table — on a practice-oriented activity (typically second activity), NOT on the capstone alone (DLA-WB-16); specification must describe learner-work columns to complete with judgement/rating cells left for the learner; must coexist with DLA-WB-08 worked_example/sample_output rows and DLA-WB-12 consolidation_summary; do not omit tables because worked/consolidation mandatory rows were added (38E-10 regression guard)\n- DLA-WB-07/10/11: ≥1 text exposition (type text, purpose explanatory teaching); ≥2 activities with practice-oriented material purpose; ≥2 activities with task_cards, prompt_set, and/or checklist\n- DLA-WB-08 (mandatory required_materials row): ≥1 early-session activity (typically first or second) MUST list explicit required_materials with type worked_example AND type sample_output (preferred pair on same or adjacent teach activity); if sample_output omitted, list type modelling_note with think-aloud/decision-criteria specification; each row specification must require stepped expert completion with visible intermediate results before learner parallel task; learner_task must instruct learner to study worked example/sample before practice; capstone integrative template, ranking template, or practice blank worksheet does NOT satisfy DLA-WB-08\n- DLA-WB-12 (mandatory required_materials row): delivery_notes must include consolidation_requirement AND final capstone activity MUST list required_materials type consolidation_summary with specification requiring learner-facing session closure body (≥80 words, ≥3 key ideas summarised — what to remember, not new teaching); optional prompt_set with reflection purpose may supplement but does NOT replace consolidation_summary; capstone template or prompt_set alone does NOT satisfy DLA-WB-12\n- DLA-WB-13/05/16: last integrative capstone expected_output = synthesis artefact (plan, memo) — not reproduce all prior tables; capstone maps ≥3 outcomes when ≥3 exist; capstone must NOT enumerate all prior *_table types as primary deliverables\n- DLA-WB-15: When activity_interaction_type is ranking or learner_task requires compare/rank — specification must require learner-generated ranking and justification; forbid pre-supplied effectiveness or rating scores; expected_output must mention justification\n- DLA-WB-18 (38F-2 mandatory row — V-05 scenario): When learner_task, activity_preamble, required_materials purpose/specification, or expected_output references cases, scenarios, households, personas, dilemmas, or named narratives — same activity_id MUST include distinct required_materials row with type scenario (specification: ≥2 cases with specific names, numbers, or context); task_cards, prompt_set, or activity prose MUST NOT be the sole carrier of case/household narrative bodies; embedding ≥2 household/case narratives only inside task_cards is contract FAIL (38E-10); prefer pairing scenario with analysis_table or comparison_table per DLA-WB-06a\n- DLA-WB-19: non-empty expected_output with observable completion evidence\n- DLA-WB-22 (38J-3 Evaluate): when archetype=Evaluate include criteria, scenario, worked judgement, guided table, independent judgement, checklist, transfer — EV-CAP-01/02/03\n\nConstraints:\n- Activity pattern mix: {{option:activity_pattern_mix}}\n- Grouping preference: {{option:grouping_preference}}\n- Difficulty level: {{option:difficulty_level}}\n- Coverage breadth: {{option:coverage_breadth}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return JSON: activities, outcome_alignment, delivery_notes\n- delivery_notes object when workbook applies: resource_intent, session_duration_target_minutes (50–70), consolidation_requirement, workbook_contract_applied\n- When workbook_contract_applied: (1) DLA-WB-08: ≥1 early activity with worked_example + sample_output (or modelling_note); (2) DLA-WB-12: final activity consolidation_summary; (3) DLA-WB-06a: ≥1 practice activity with table/reference type (classification_table, comparison_table, analysis_table, impact_table, reference_table, data_table, decision_table, or planning_table); (4) DLA-WB-18: ≥1 activity with type scenario when session uses household/case/scenario language — rows (1)–(2) and (3)–(4) must all coexist — do not drop worked/consolidation to add table/scenario; (5)–(8) OBLIGATION POPULATION (38S) G1–G5 + DLA-WB-26..31 depth_floor L3 — see gates above; PRE-EMIT GATE: add missing required_materials before emit if (5)–(8) or EMIT-FAIL-01..04 fail (do not replan beats or archetypes)\n- activities[]: activity_id, title, grouping, duration_minutes, mapped_learning_outcomes, required_materials[{ material_id, type, purpose, specification }], learner_task, expected_output, failure_mode, facilitator_moves, activity_preamble (required when self_directed/learner page), optional activity_interaction_type, support_note, cognition-orientation fields (prior_knowledge_activation, reasoning_orientation, self_explanation_prompt, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt)\n- required_materials types: task_cards | prompt_set | scenario | checklist | template | sample_output | worked_example | modelling_note | consolidation_summary | transfer_prompt | text | classification_table | comparison_table | analysis_table | impact_table | reference_table | data_table | decision_table | planning_table\n- Return only the JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "38S final: DLA is obligation population only — consume upstream episode_plans (archetype + beat order); do not replan beats, archetypes, or session arc. Populate required_materials per OBLIGATION POPULATION (38S) gates before learner_task. Self_directed: activity_preamble every activity; LD-SELF-DIRECTED-RHETORIC at runtime. DLA specifies material types/requirements; GAM authors bodies (LD-MATERIALS-COPY). Table specs: column/row intent (LD-TABLE-FIDELITY). IFP-06 anti-spoiler: scaffold-only specs when learner-production required. Workbook (~60 min, 38F-2): DLA-WB block — mandatory rows DLA-WB-08, DLA-WB-12, DLA-WB-06a, DLA-WB-18 coexist. Maths: LD-MATH-RENDER at runtime. Post-capture validators enforce obligation rows — add missing Materials before emit, do not replan upstream plan.",
  "runnerInstructions": {
    "what_this_step_does": "This step designs runnable learning activities linked directly to outcomes."
  },
  "defaultOutputStructure": {
    "keys": [
      "activities",
      "outcome_alignment",
      "delivery_notes"
    ]
  },
  "userOptions": [
    {
      "id": "activity_pattern_mix",
      "label": "Activity pattern mix",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "guided",
          "label": "Guided",
          "promptInstruction": "Prioritize guided, tutor-led activity patterns."
        },
        {
          "value": "balanced",
          "label": "Balanced",
          "promptInstruction": "Use a balanced mix of guided and applied/collaborative patterns."
        },
        {
          "value": "applied_collaborative",
          "label": "Applied collaborative",
          "promptInstruction": "Prioritize applied, collaborative activity patterns."
        }
      ]
    },
    {
      "id": "grouping_preference",
      "label": "Grouping preference",
      "type": "select",
      "default": "mixed",
      "choices": [
        {
          "value": "mixed",
          "label": "Mixed",
          "promptInstruction": "Use a balanced mix of grouping modes across activities."
        },
        {
          "value": "individual",
          "label": "Individual",
          "promptInstruction": "Prioritize individually completed activities."
        },
        {
          "value": "pair",
          "label": "Pair",
          "promptInstruction": "Prioritize pair-based activities."
        },
        {
          "value": "small_group",
          "label": "Small group",
          "promptInstruction": "Prioritize small-group activities."
        },
        {
          "value": "whole_group",
          "label": "Whole group",
          "promptInstruction": "Prioritize whole-group activity formats."
        }
      ]
    },
    {
      "id": "difficulty_level",
      "label": "Difficulty level",
      "type": "select",
      "default": "moderate",
      "choices": [
        {
          "value": "introductory",
          "label": "Introductory",
          "promptInstruction": "Set activity challenge at an introductory level."
        },
        {
          "value": "moderate",
          "label": "Moderate",
          "promptInstruction": "Set activity challenge at a moderate level."
        },
        {
          "value": "advanced",
          "label": "Advanced",
          "promptInstruction": "Set activity challenge at an advanced level."
        }
      ]
    },
    {
      "id": "coverage_breadth",
      "label": "Coverage breadth",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "narrow",
          "label": "Narrow (key outcomes only)",
          "promptInstruction": "Focus activity coverage on a narrower set of key outcomes."
        },
        {
          "value": "balanced",
          "label": "Balanced",
          "promptInstruction": "Use balanced coverage across the intended outcomes."
        },
        {
          "value": "broad",
          "label": "Broad coverage",
          "promptInstruction": "Use broad coverage across outcomes where feasible."
        }
      ]
    }
  ]
}
```

---

---

## 6. Generate Activity Materials

### Type
Generation

### Input
learning_activities, optional knowledge_model, optional normalized_content

### Output
activity_materials, session_materials

### Purpose
- Generate complete, usable teaching materials from activity material specifications
- Ensure each activity has delivery-ready artefacts with no placeholders (runtime: LD-MATERIALS-COPY)
- Primary author of table-shaped `activity_materials` content (runtime: LD-TABLE-FIDELITY)

### Blended / HE Guidance
- Treat `learning_environments` as a multi-select constraint (array semantics)
- Generate environment-appropriate materials:
  - classroom -> slides, handouts, facilitation prompts
  - vle -> structured VLE-ready sections and activity instructions
  - xerte -> structured learning object content
- Regression guards:
  - do not generate `learning_object_set` unless environments include `xerte`
  - do not generate `vle_structure` unless environments include `vle`

### Aliases
- Create Activity Materials
- Build Activity Materials
- Produce Workshop Materials

### Prompt Factory
```json

{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "structureStyle": "text_structured",
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "text",
  "defaultPromptNotes": "Realise DLA required_materials per GAM-PRES (38J-4 — DLA decides, GAM realises): order/membership GAM-PRES-01/02; types GAM-PRES-03; depth GAM-PRES-08/09 (38L-3); Evaluate trio GAM-PRES-10 + EV-GAM-FAIL-07 (38L-4). Self_directed: LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-SELF-DIRECTED-RHETORIC, LD-MATH-RENDER at runtime. Workbook (38F-2/38E-9): GAM-WB-38F-01 pipe tables; GAM-WB-02/06 per PRES-08; GAM-WB-06b (38H-2). FAIL: F1–F9, AP-01/05, DEPTH-COLLAPSE (GAM-PRES-09).",
  "runnerInstructions": {
    "what_this_step_does": "This step realises full delivery-ready material content for each activity requirement."
  },
  "promptTemplate": "Context:\nYou are provided with learning_activities containing required_materials specifications (and optionally knowledge_model, normalized_content, workflow brief, or session context).\n\nRole:\nYou generate delivery-ready materials from activity specifications (learner-facing when delivery_context is self_directed).\n\nTask:\nRealise all required_materials as activity_materials for immediate delivery.\n\nInstructions:\n- Treat learning_activities as the source of truth; do not redesign activities or change structure\n- Anchor on required_materials, learner_task, and expected_output; use grouping, duration_minutes, mapped_learning_outcomes, and facilitator_moves for fit\n- Keep Activity ID and Material labels exact for downstream merge\n\nCanonical contracts (runtime modules; obey all): LD-TABLE-FIDELITY, LD-MATERIALS-COPY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC when self_directed.\n\n- Produce actual delivery content for each required_material; do not restate the specification only\n- Keep each material aligned to the activity intent and outcome alignment\n- Do not assume a specific output medium (for example, document, slides, or platform export package)\n- For display-oriented learner-facing text, use only this Markdown subset: ##/### headings, - bullet lists, 1. numbered lists, **bold**, simple pipe tables, and --- horizontal rules\n- Do not rely on blank-space alignment for table rendering\n\nInstructional function preservation (GAM-PRES — 38J-4; realisation only — DLA decides, GAM realises; do NOT select archetypes, replan IFP, or redesign pedagogy):\n- GAM-PRES-00: learning_activities + required_materials purpose/specification + learner_task are authoritative; realise what DLA specified — expand bodies, do not second-guess archetype or function plan\n- GAM-PRES-01 FUNCTION ORDER: emit Material blocks in exact DLA required_materials array order within each activity; when specification names instructional functions (criteria exposition, perspective building, worked thinking, worked judgement, guided judgement, independent judgement, verification, transfer), preserve that teaching→practice sequence — never reorder so practice/reflection Materials precede teaching Materials DLA placed earlier; segmented learner_task teaching blocks must appear in earlier Material bodies, performance blocks in later Materials\n- GAM-PRES-02 NO COLLAPSE: one distinct full Material body per DLA required_materials row — never merge rows; forbidden collapse patterns: (a) single prompt_set or consolidation_summary replacing criteria+worked judgement+guided+independent sequence; (b) consolidation_summary absorbing exposition assigned to text, worked_example, modelling_note, scenario, rubric, checklist, transfer_prompt, or independent judgement template; (c) task_cards-only body when DLA listed scenario+table+worked materials; (d) reflection_prompt or thin prompt_set substituting for verification checklist, transfer_prompt, worked analytic pass, or independent judgement template when DLA listed those functions (DEPTH-COLLAPSE-01..04)\n- GAM-PRES-03 FUNCTION REALISATION (map DLA types to learner-facing moves — do not replan): text/modelling_note → explanation, criteria exposition, perspective building, worked judgement contrast; worked_example → example, worked thinking, stepped expert reasoning; misconception_note → misconception challenge; exemplar/comparison_pair → non-example contrast; scenario → case narratives and perspectives; template / partial decision_table|comparison_table|analysis_table → guided practice or guided judgement with learner-empty cells; task_cards|prompt_set with perform verbs → independent practice or independent judgement prompts; checklist|retrieval_check → verification; transfer_prompt → transfer; consolidation_summary → reflection/closure scaffold only (GAM-WB-06b) — realise each with substantive depth, not specification restatement; type labels per GAM-PRES-03 (GAM-WB-11..19 authoritative map — template, sample_output, checklist, rubric, misconception_note, *_table companion, task_cards, prompt_set, reflection_prompt optional)\n- GAM-PRES-04 ANTI-SHELL PRESERVATION: when DLA lists ≥2 teaching-depth materials (worked_example, modelling_note, text exposition, scenario narrative, rubric criteria teaching), realise ALL with full bodies — do not reduce episode to imperative task_cards + thin checklist; AS-GAM-FAIL-01 DLA lists worked_example|modelling_note but GAM emits template-only or prompt-only; AS-GAM-FAIL-02 DLA lists ≥3 distinct material types but GAM merges into ≤2 Materials; AS-GAM-FAIL-03 Evaluate-shaped DLA specs (perspectives+criteria+judgement) realised as consolidation_summary+prompt_set only\n- GAM-PRES-05 ANTI-SPOILER PRESERVATION (extend 38H-2 / GAM-WB-06b): honour DLA specification phrases scaffold-only, not for copying, weak vs strong exemplar; worked_example and modelling_note teach reasoning quality — bodies must NOT match expected_output learner deliverable; sample_output annotated exemplar must not be copy-paste target when DLA spec says independent practice/judgement planned; forbid pre-ranked strategy recommendation or pre-filled judgement cells when DLA expects learner ranking; consolidation_summary scaffold-only when learner-production required — never completed learner memo\n- GAM-PRES-06 EVALUATE PRESERVATION (38I-4 A4 benchmark — when DLA purpose/specification indicates Evaluate functions): realise ALL listed moves — perspectives: scenario or text ≥2 competing viewpoints (≥40 words each when scenario); criteria: rubric|modelling_note|text ≥3 operational dimensions; worked judgement: worked_example OR modelling_note with explicit weak vs strong contrast (weak slogan + stronger criteria-led reasoning, strong must NOT equal expected_output); guided judgement: decision_table|comparison_table|analysis_table with partial learner cells + justification prompts; independent judgement: template|task_cards memo scaffold (structure/sentence starters — not completed memo); verification: checklist ≥4 criteria-linked checkpoints; transfer: transfer_prompt ≥80 words learner-own-context; consolidation_summary scaffold-only — never sole Evaluate vehicle; EV-GAM-FAIL-01..05 mirror EV-SHELL-01..05 at realisation (criteria/perspectives/worked judgement/guided partial missing); EV-GAM-FAIL-06 transfer absent when DLA listed transfer_prompt or transfer function\n- GAM-PRES-07: Read DLA specification depth cues — expand to learner-usable bodies; Evaluate criteria exposition ≥3 dimensions; Evaluate scenario perspectives ≥2; worked judgement teaching ≥120 words combined when both weak and strong required; do not compress teaching to meet duration — realise fully per LD-MATERIALS-COPY; text exposition ≥120 words linking ≥2 ideas outside table cells when DLA lists text\n- GAM-PRES-08 DEPTH-SHAPED BODIES (38L-3 R2/R3 — honour DLA depth_floor L3 and purpose function names; 38K-2 sufficiency): When DLA specification includes depth_floor L3 or purpose names verification|worked analytic pass|independent judgement|transfer|guided judgement — emit function-shaped bodies not specification echo: (V1) verification checklist → ≥4 pass-fail or keyed-check items linked to activity learning + explicit repair-if-fail instruction — NOT a single reflective question or prompt_set substituting for checklist; verification materials should confirm understanding, reasoning quality, interpretation, or judgement quality where appropriate, not merely task completion; (A1) worked analytic pass worked_example|modelling_note → ≥1 fully modelled walkthrough: evidence fact → analytical lens → reasoning steps → draft matrix cell → conclusion (≥120 words); criteria application visible; NOT empty analysis_table or inquiry-only prompt_set replacing modelling; (E1) independent judgement template|task_cards → memo scaffold with labelled sections + sentence starters + word band — learner-empty; NOT completed memo; NOT consolidation_summary substitute; (E2) Evaluate verification checklist → rubric self-audit ≥4 criteria-linked checkpoints; (T1) transfer_prompt → ≥80 words with ≥2 own-context application prompts — NOT transfer only inside consolidation_summary; (G1) guided judgement|analysis table → ≥1 exemplar row with justification OR scoring guide + empty learner rows; L3 spec with restatement-only body = DEPTH-FAIL; GAM-WB-01/02/06 depth floors authoritative here (exposition ≥120w; worked_example|sample_output|modelling_note full bodies; consolidation_summary ≥80 words per GAM-WB-06b when required)\n- GAM-PRES-09 ANTI-DEPTH-COLLAPSE (38L-3 R1/R5/R6): When DLA lists checklist|transfer_prompt|template|worked analytic pass Material — forbidden: DEPTH-COLLAPSE-01 verification → reflection_prompt|open question only; DEPTH-COLLAPSE-02 transfer_prompt → consolidation reflection only; DEPTH-COLLAPSE-03 worked analytic pass → prompt_set without modelled walkthrough; DEPTH-COLLAPSE-04 independent judgement → discussion prompt_set without memo structure; DEPTH-COLLAPSE-05 merging checklist+template+transfer_prompt into consolidation_summary; triggers contract FAIL (F9); workbook FAIL taxonomy (authoritative — F1–F9): (F1) consolidation_summary missing when required; (F2) prompt_set-only closure; (F3) worked_example|sample_output|modelling_note body missing; (F4) template-only worked obligation; (F5) scenario only in task_cards (GAM-WB-10/AP-04); (F6) missing pipe table (GAM-WB-38F-01); (F7) spoiler consolidation (GAM-WB-06b); (F9) DEPTH-COLLAPSE-01..05. MIX: GAM-WB-MIX-01 table-only invalid (AP-01); MIX-03 prompt_set-only capstone closure = FAIL; MIX-04 template-only worked_example FAIL; MIX-05 retrieval needs learner-check; MIX-06 capstone weight limit. AP: AP-01 table-only; AP-02 reference-dump capstone; AP-03 pre-filled ratings; AP-04 scenario without Material body; AP-05 spoiler consolidation\n- GAM-PRES-10 EVALUATE COMPLETION TERMINATION (38L-4 R5): When DLA lists Evaluate closure trio (template|task_cards independent judgement + checklist verification + transfer_prompt) — all three MUST be realised as separate Materials with full GAM-PRES-08 bodies; guided judgement table alone is insufficient for Evaluate activity completion; consolidation_summary must NOT substitute any trio member; EV-GAM-FAIL-07 guided-only Evaluate (guided table present but independent memo scaffold OR verification checklist OR transfer_prompt missing or absorbed) = contract FAIL\n\nUsability requirements:\n- Materials must be complete enough to use without major rewriting\n- Materials must be clearly labelled and easy to read\n- Use learner-facing wording unless the brief is facilitated\n- Do not return plans about materials; return the materials themselves\n- Outputs must not include phrases like \"should include\", \"describe\", or \"specification\". These indicate incomplete material generation.\n- If some details are unspecified, make only the assumptions necessary to produce complete and usable material bodies\n\nSelf-study workbook genre contract (GAM-WB — apply when delivery_context is self_directed AND upstream learning_activities or delivery_notes indicate a self-study workbook, e.g. delivery_notes.workbook_contract_applied, resource_intent self_study_workbook, or multi-activity learner workbook arc). GAM-WB function enforcement (38E-9): realise every DLA worked_example, sample_output, modelling_note, and consolidation_summary row as labelled Material bodies — delivery_notes.consolidation_requirement alone still requires Material: consolidation_summary. Realise DLA required_materials only — do not redesign activities. Obey LD-MATERIALS-COPY and LD-TABLE-FIDELITY — do not weaken them:\n- GAM-WB core: Design Page cannot compose workbook genres GAM never authored — if a genre is absent from your Material: output, downstream cannot invent it\n- GAM-WB-00: Realise 100% of DLA required_materials entries with substantive Content bodies — never restate type/purpose/specification only; forbidden placeholder labels (AP-11 pattern)\n- Table-only workbook is contractually invalid (AP-01 / GAM-WB-MIX-01): session MUST include ≥1 non-table Material type (scenario, text, task_cards, prompt_set, checklist, template, sample_output, worked_example, consolidation_summary, transfer_prompt, rubric, etc.)\n- GAM-WB-02 (38E-9 mandatory): worked_example|sample_output|modelling_note per GAM-PRES-08 — full Content for each; missing body = contract FAIL (F3/F4)\n- GAM-WB-06 (38E-9 mandatory + 38H-2): consolidation_summary per GAM-PRES-08; consolidation_summary ≥80 words; capstone prompt_set alone does NOT satisfy; missing when required = contract FAIL (F1)\n- GAM-WB-06b (38H-2, learner-production required): consolidation_summary = reflective scaffolding only — sentence starters, criteria comparison, self-check prompts; FORBID model essays, past-tense summaries (e.g. \"you have learned\"), completed learner responses; ≥80 words; violating scaffold-only = contract FAIL (F7)\n- GAM-WB-38F-01 (38F-2 — V-01 table realisation): when DLA required_materials lists any *_table, reference_table, data_table, decision_table, or planning_table — emit Material: <material_id> (<exact DLA type>) with LD-TABLE-FIDELITY pipe-table Content supporting learner_task; learner rank/rate/judgement cells empty where learner decides (AP-03); table is companion/support material, not the whole workbook; must coexist in session with Material bodies for worked_example, sample_output, and consolidation_summary when DLA listed them — missing pipe table when DLA listed table type = contract FAIL\n- GAM-WB-10 / AP-04 (38F-2 — V-05 scenario): when DLA lists type scenario OR learner_task/preamble uses case/scenario/household/persona language — MUST emit Material: <material_id> (scenario) with ≥2 named cases (≥40 words each); task_cards may reference scenario for imperative steps but MUST NOT replace scenario Material — embedding ≥2 household/case narratives only inside task_cards when DLA listed scenario or WB-18 applies = V-05 FAIL (F5)\n- Workbook contract FAIL: see GAM-PRES-09 fail taxonomy (F1–F9, MIX, AP-01..05)\n\nScope boundaries:\n- Generate activity materials (and session-level materials only when clearly required by the brief/context)\n- Do not perform final platform/export packaging in this step\n\nOutput organisation:\n- Organise content with clear sections using this exact structure for every generated material:\n\nActivity: <activity title>\nActivity ID: <activity_id>\nMapped outcomes: <comma-separated outcomes>\n\nMaterial: <material_id> (<type>)\nPurpose: <instructional purpose>\nContent:\n<full usable material content>\n\nMaterial type labelling (38E-9): use exact DLA types in the Material line — e.g. Material: M2 (worked_example), Material: M3 (sample_output), Material: M4 (modelling_note), Material: M10 (consolidation_summary) — do not relabel consolidation_summary as prompt_set or worked genres as template\n\nWhen delivery_context is self_directed: omit Facilitator use (LD-SELF-DIRECTED-RHETORIC). When facilitated: after Content add Facilitator use: <facilitation note>\n\n---\n\n- Repeat for all required materials across activities\n- Keep IDs and schema field names as structured labels (for example Activity ID, Material) rather than replacing them with freeform Markdown\n- Return only the final organised materials content."
}
```

---

---

## 7. Design Assessment

### Type
Generation

### Input
learning_outcomes, knowledge_model, or learning_content

### Output
assessment_blueprint

### Purpose
- Define how learning will be assessed
- Ensure valid evidence of learning

### Aliases
- Design Assessment Blueprint
- Generate Assessment
- Create Assessment Plan
- Generate multiple-choice questions
- Generate MCQs
- Generate quiz questions

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "allowWorkflowGoalContext": false,
  "promptScope": "step_only",
  "structureStyle": "schema_structured",
  "defaultPromptStrategy": "default_template",
  "promptTemplate": "Context:\nYou are provided with learning_outcomes and optional supporting artefacts such as knowledge_model or learning_content.\n\nTask:\nDesign an assessment_blueprint that defines how the outcomes will be assessed.\n\nInstructions:\n- Align the blueprint to all provided learning outcomes\n- Question strategy: {{option:activity_type}}\n- Feedback display mode: {{option:feedback_display}}\n- Difficulty profile: {{option:difficulty_profile}}\n- Coverage scope: {{option:coverage_scope}}\n- Total required items/questions: {{option:total_items}}\n- Treat feedback_display as prompt-shaping guidance only; do not require or invent new output schema fields in this step\n- Design should reflect the selected question strategy\n- Define coverage_map so outcomes are covered appropriately across topics/tasks\n- Ensure coverage_map item counts sum exactly to total_items\n- Define difficulty_profile.item_counts with concrete numeric counts using ONLY these keys: recall, comprehension, application, analysis\n- Do NOT use alternative difficulty buckets such as easy/moderate/hard in item_counts\n- Ensure recall + comprehension + application + analysis counts sum exactly to total_items\n- Include marking intent/rationale suitable for downstream item generation and feedback steps\n- Keep output grounded in provided artefacts only\n- Do not generate assessment items in this step\n- Apply step notes if provided: {{stepNotes}}\n\nOutput requirements:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing: assessment_blueprint, coverage_map, difficulty_profile, design_rationale\n- assessment_blueprint must include total_items\n- difficulty_profile must include item_counts as concrete numbers with keys recall, comprehension, application, analysis\n- Return only JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Design assessment artefacts aligned to learning outcomes with valid coverage and clear marking intent.",
  "defaultOutputStructure": {
    "keys": [
      "assessment_blueprint",
      "coverage_map",
      "difficulty_profile",
      "design_rationale"
    ]
  },
  "userOptions": [
    {
      "id": "activity_type",
      "label": "Question strategy",
      "type": "select",
      "default": "mcq",
      "choices": [
        {
          "value": "mcq",
          "label": "Selected response",
          "promptInstruction": "Design the blueprint for selected-response assessment items."
        },
        {
          "value": "short_answer",
          "label": "Short written response",
          "promptInstruction": "Design the blueprint for short written-response assessment items."
        },
        {
          "value": "essay",
          "label": "Extended response",
          "promptInstruction": "Design the blueprint for extended written-response assessment items."
        },
        {
          "value": "problem",
          "label": "Problem-solving response",
          "promptInstruction": "Design the blueprint for problem-solving response assessment items."
        },
        {
          "value": "case_study",
          "label": "Scenario-based response",
          "promptInstruction": "Design the blueprint for scenario-based response assessment items."
        },
        {
          "value": "mixed",
          "label": "Mixed response types",
          "promptInstruction": "Design the blueprint for a mixed response-type assessment set."
        }
      ]
    },
    {
      "id": "feedback_display",
      "label": "Feedback display",
      "type": "select",
      "default": "answer_grid_end",
      "choices": [
        {
          "value": "none",
          "label": "None",
          "promptInstruction": "Do not plan learner-facing feedback/answer display beyond core assessment prompts."
        },
        {
          "value": "answer_grid_end",
          "label": "Answer grid at end",
          "promptInstruction": "Plan for answers to be presented as an answer grid at the end."
        },
        {
          "value": "answers_explanations",
          "label": "Answers + explanations",
          "promptInstruction": "Plan for answers to be presented with concise explanations."
        },
        {
          "value": "reflection_then_answers",
          "label": "Reflection first, answers after",
          "promptInstruction": "Plan for a reflection-first flow, with answers shown after reflection."
        }
      ]
    },
    {
      "id": "difficulty_profile",
      "label": "Difficulty profile",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "foundation_heavy",
          "label": "Mostly foundational items",
          "promptInstruction": "Set overall assessment difficulty toward foundational items."
        },
        {
          "value": "balanced",
          "label": "Balanced mix",
          "promptInstruction": "Set overall assessment difficulty to a balanced mix."
        },
        {
          "value": "higher_order_heavy",
          "label": "Mostly higher-order items",
          "promptInstruction": "Set overall assessment difficulty toward higher-order items."
        }
      ]
    },
    {
      "id": "coverage_scope",
      "label": "Coverage scope",
      "type": "select",
      "default": "balanced",
      "choices": [
        {
          "value": "selected_themes",
          "label": "Selected themes",
          "promptInstruction": "Focus assessment blueprint coverage on selected high-priority themes."
        },
        {
          "value": "balanced",
          "label": "Balanced",
          "promptInstruction": "Use balanced topic coverage in the assessment blueprint."
        },
        {
          "value": "broad_coverage",
          "label": "Broad coverage",
          "promptInstruction": "Use broad topic coverage across outcomes where feasible."
        }
      ]
    },
    {
      "id": "total_items",
      "label": "Total assessment items",
      "type": "number",
      "default": 10,
      "promptInstructionTemplate": "Set total assessment items to exactly {{value}}."
    }
  ]
}
```

---

---

## 8. Design Feedback

### Type
Generation

### Input
assessment_items (optionally with knowledge_model)

### Output
feedback_pack

### Purpose
- Provide explanations and guidance
- Address misconceptions
- Support improvement

### Aliases
- Generate Feedback
- Create Feedback Pack
- Build Feedback
- Generate feedback pack for MCQs
- Generate feedback pack

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "inputPriority": {
    "primary": "assessment_items",
    "secondary": "knowledge_model"
  },
  "inputArtefactSchemas": [
    {
      "type": "assessment_items",
      "artefact": "assessment_items",
      "schema": {
        "items": [
          {
            "item_id": "string",
            "item_type": "string",
            "topic": "string",
            "related_learning_outcomes": "array",
            "stem_or_prompt": "string",
            "response_structure": "object",
            "answer_or_guidance": "string",
            "explanation_or_rationale": "string",
            "integration_type": "string"
          }
        ],
        "difficulty_distribution": "object",
        "answer_key": "object",
        "explanations": "object"
      }
    },
    {
      "type": "assessment_items",
      "artefact": "mcqs",
      "schema": {
        "items": [
          {
            "item_id": "string",
            "item_type": "string",
            "topic": "string",
            "related_learning_outcomes": "array",
            "stem_or_prompt": "string",
            "response_structure": "object",
            "answer_or_guidance": "string",
            "explanation_or_rationale": "string",
            "integration_type": "string"
          }
        ],
        "difficulty_distribution": "object",
        "answer_key": "object",
        "explanations": "object"
      }
    }
  ],
  "promptTemplate": "Context:\nYou are provided with assessment_items and a knowledge_model.\n\nTask:\nGenerate a feedback_pack that gives useful learning feedback aligned to the assessment content.\n\nInstructions:\n- Use assessment_items as the primary input to produce per-item and aggregate feedback\n- Use the item structure as provided by the assessment type (mcq, essay, short_answer, problem, case_study, or mixed)\n- Do not assume MCQ-only fields when items are not MCQs\n- Use knowledge_model as a secondary reference for conceptual accuracy and misconception diagnosis\n- Assume each input item includes core fields such as item_id, topic, related_learning_outcomes, and explanation_or_rationale, plus type-specific fields\n- For each item, provide concise correctness rationale and actionable guidance\n- Where relevant, explain likely misconceptions and how to correct them\n- Keep feedback clear, supportive, and instructionally useful\n- Do not ask for or redefine input structure; use provided artefact schemas\n- Assessment semantics (when present in workflow constraints, scope/constraints text, or step notes): honour feedback_timing, assessment_interaction_mode, learner_answer_visibility, tutor_answer_artefact, peer_instruction_phase, and misconception_assessment_link when provided\n- Treat assessment_items answer_key, correct_answer, true_false_answer, and explanation_or_rationale as authoritative; do not remove or contradict answer data from upstream items\n- When feedback_timing is after_peer_discussion, end_of_session_reveal, or tutor_led_reveal_only, produce facilitator/tutor reveal guidance: when to share answers, how to debrief after discussion or at session end, and what to withhold on learner-facing handouts until reveal\n- When feedback_timing = tutor_led_reveal_only, emphasise tutor-led debrief moves and post-submission correction; do not assume learners have already seen correct answers inline\n- When learner_answer_visibility is hidden_until_reveal or tutor_only, structure feedback_pack for delayed reveal (attempt/discussion/check first, answers and rationales for tutor use later)\n- When assessment_interaction_mode = discussion_oriented, include sense-making and discussion prompts in misconception_guidance and next_steps before answer confirmation\n- When assessment_interaction_mode = diagnostic_misconception or misconception_assessment_link = true, tie misconception_guidance to specific false claims, proposition wording, or activity/task-card themes reflected in assessment_items\n- When peer_instruction_phase is set (e.g. think_pair_share, small_group_discussion_then_check), next_steps should follow individual attempt -> pair/small-group discussion -> reveal/confirm sequence\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return a JSON object containing feedback_items, misconception_guidance, and next_steps\n- Return only the JSON.",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Generate actionable feedback/guidance aligned with assessment outputs; when feedback_timing is delayed or tutor-led, include facilitator reveal/debrief guidance while preserving upstream answer data. For mathematical notation in feedback text, use only \\(...\\) inline and \\[...\\] block delimiters; never $...$/$$...$$, code wrappers, or HTML-escaped delimiters.",
  "defaultOutputStructure": {
    "keys": ["feedback_items", "misconception_guidance", "next_steps"]
  }
}
```

---

---

## 10. Construct Learning Sequence

### Type
Synthesis

### Input
learning_activities, activity_materials, assessments

### Output
learning_sequence

### Purpose
- Organise content and activities
- Create a coherent learning journey
- Manage progression and scaffolding

### Blended / HE Guidance
- If scope indicates module/course/programme context, produce multi-week planning outputs (`module_map`)
- Otherwise default to a standard session timeline
- Avoid module artefacts for default session workflows unless explicitly triggered

### Aliases
- Build Learning Sequence
- Sequence Learning Activities
- Organize Learning Flow

### Prompt Factory
```json
{
  "configurationMode": "simple",
  "askForCustomSchema": false,
  "structureStyle": "schema_structured",
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Return exactly one \u0060\u0060\u0060json fenced block containing the learning_sequence object. No prose before or after the block. When delivery_context is self_directed, frame timeline as independent learner progression rather than live facilitation choreography.",
  "runnerInstructions": {
    "what_this_step_does": "This step builds an ordered learning progression from activities and materials; in self-directed workflows it represents learner study flow rather than live facilitation."
  },
  "promptTemplate": "Context:\nYou are provided with learning_activities, activity_materials, and relevant assessment artefacts.\n\nTask:\nConstruct learning_sequence as a timed facilitation plan that can be delivered directly.\n\nInstructions:\n- Build a concrete session plan, not pedagogical commentary\n- Enforce total duration compliance with configured duration\n- You may only reference activities provided in input learning_activities\n- Do not invent new activities\n- Do not rename activities\n- Do not extend the activity set\n- Only include an activity if there is enough time to run it properly\n- Do not include activities just to tick a coverage box\n- Prefer fewer well-run activities over squeezing all activities into insufficient time\n- If time is too short, omit an activity or merge it with another activity\n- If provided activities are insufficient, reuse, combine, or reschedule existing activities\n- You may only reference materials explicitly defined in activity_materials\n\nMaterial usage rules:\n- When referring to materials, always use the exact material_id and material title as defined in the input artefact (for example: \"Material A1.1 - Concept Map Template\")\n- Do not paraphrase or generalise material names (for example, avoid \"the worksheet\", \"the template\", \"the handout\" unless that is the exact title)\n- All materials referenced must correspond exactly to those defined in the input artefact; do not introduce new materials or rename existing ones\n- When instructing facilitators to distribute or use materials, explicitly reference them using their identifiers\n- Where helpful, include a \"Materials used:\" line at the start of each activity block listing referenced material_id + title pairs\n\n- All materials referenced in facilitator actions must correspond exactly to required_materials defined in learning_activities\n- Do not invent new materials or rename existing ones; use the exact identifiers from activity definitions\n- When referring to materials, always include both material_id and material title (for example: \"Material A1.1 - Concept Map Template\")\n- Do not use vague references such as \"the template\" or \"the worksheet\"\n- Do not introduce new handouts, excerpts, scenarios, slides, checklists, templates, or examples unless already present in activity_materials\n- If design_scope is single_activity, do not generate a broad multi-step session timeline\n- For single_activity scope, produce a minimal one-step structure around the target activity, or state via checks/omissions that no broader sequence is required\n- For single_activity scope, avoid session/module framing unless explicitly requested\n- Include facilitator_actions and learner_actions for each timeline block\n- Include grouping and explicit transition_to_next for each block\n- Use sensible alternation between explanation, activity, and discussion\n- Ensure increasing complexity across the session\n- Include at least two plenary/synthesis moments where appropriate to session length\n- For cognitively demanding tasks (creation, evaluation, iteration, comparison), allocate sufficient time\n- Avoid placing high-complexity tasks into very short final blocks\n- If total time is constrained, reduce, merge, or simplify activities rather than compressing them unrealistically\n- Do not create zero-minute blocks\n- Do not create bookkeeping-only wrap-up steps\n- Closure must have real allocated time, or be explicitly integrated into the final meaningful block\n- Prefer one fewer activity plus a real ending over superficial full coverage\n- If closure is integrated into the final activity, state closure integration explicitly in checks\n- Optimize for learnability and depth, not just coverage\n- Keep sequence grounded in upstream artefacts and constraints\n- Do not output rationale-only prose\n- Apply step notes when provided: {{stepNotes}}\n\nOutput requirements (strict — fenced JSON block only):\n- Return exactly one markdown fenced JSON block opened with \u0060\u0060\u0060json and closed with \u0060\u0060\u0060\n- The fenced block body must be the learning_sequence root object as valid JSON\n- Do NOT include any prose, headings, commentary, or explanations before or after the fenced block\n- Do NOT return raw JSON without the \u0060\u0060\u0060json fence (unfenced JSON text is invalid)\n- Do NOT include JSON comments (no // or block comments)\n- Do NOT prefix or suffix workflow metadata (no STEP N OUTPUT lines)\n- The JSON object MUST include these top-level keys: sequence_title, total_duration_minutes, timeline, activities_used, activities_omitted, checks\n- Each timeline block must include: block_id, start_minute, duration_minutes, phase_type, activity_id (where relevant), grouping, facilitator_actions, learner_actions, transition_to_next\n- activities_used must list activity_ids used in timeline\n- activities_omitted must be an array of objects: { activity_id, reason }\n- checks must include: all_activity_ids_valid, no_new_activities_introduced, all_materials_traceable_to_activity_materials, cognitive_timing_feasible, closure_integrated, no_zero_minute_blocks, omissions_justified\n- Return only the single fenced block.",
  "defaultOutputStructure": {
    "keys": ["sequence_title", "total_duration_minutes", "timeline", "activities_used", "activities_omitted", "checks"]
  },
  "userOptions": [
    {
      "id": "duration_minutes",
      "label": "Total duration (minutes)",
      "type": "number",
      "default": 60,
      "min": 15,
      "max": 240,
      "promptInstructionTemplate": "Build the sequence to fit exactly {{value}} minutes total duration."
    },
    {
      "id": "sequencing_style",
      "label": "Sequencing style",
      "type": "select",
      "default": "progressive_scaffold",
      "choices": [
        { "value": "progressive_scaffold", "label": "Progressive scaffold", "promptInstruction": "Use a progressive scaffold sequencing style." },
        { "value": "spiral_revisit", "label": "Spiral revisit", "promptInstruction": "Use a spiral revisit sequencing style." },
        { "value": "assessment_anchored", "label": "Assessment anchored", "promptInstruction": "Use an assessment-anchored sequencing style." }
      ]
    }
  ]
}
```

---

---

## 13. Design Page

### Type
Assembly

### Input
learning_outcomes, learning_activities, activity_materials, optional learning_sequence, optional assessment_items, optional feedback_pack, optional marking_rubric, optional assessment_blueprint

### Output
page

### Purpose
- Assemble one profile-aware readable page artefact from upstream artefacts
- Keep output directly usable for HTML/VLE rendering
- Preserve explicit component, quantity, and exclusion constraints without redesigning pedagogy

### Aliases
- Build Page
- Create Readable Page
- Create Moodle Page Content

### Prompt Factory
```json
{
  "configurationMode": "none",
  "askForCustomSchema": false,
  "defaultPromptStrategy": "default_template",
  "preferredOutputFormat": "json",
  "defaultPromptNotes": "Assemble one profile-aware self-contained page; strict JSON sections[] (section_id, heading, content). Canonical section_ids when applicable: overview, learning_purpose, knowledge_summary, learning_activities, assessment_check, support_notes. Learner page_profile: LD-SELF-DIRECTED-RHETORIC at runtime for overview/learning_purpose journey and verbatim activity orientation fields. MATERIALS FIDELITY (hard): obey LD-DESIGN-PAGE-COMPOSE-CONTRACT at runtime — copy activity.materials.* verbatim; visual affordances additive page-root only; forbidden placeholders e.g. Set of scenarios; 38H-3 table-adjunct fidelity / DP-TABLE-ADJ-01 in compose contract. Visual affordances: Sprint 38 runtime contract (schema 38.4). Activity membership and assessment preservation: LD-DESIGN-PAGE-COMPOSE-CONTRACT. Maths: LD-MATH-RENDER at runtime.",
  "runnerInstructions": {
    "what_this_step_does": "This step assembles a profile-aware readable page for HTML/VLE use from existing artefacts.",
    "what_to_check": "sections[] with section_id, heading, content; canonical section_ids when applicable; learning_activities.content array with predictable keys; structured activity.materials objects (not labels-only); assessment_check.content.items when assessment_items provided; LD-DESIGN-PAGE-COMPOSE-CONTRACT governs verbatim materials preservation and activity membership (U \\ X) ⊆ C with activities_omitted[] authority; page root visual_affordance_schema_version 38.4, activities_visual_review[], visual_affordances[] per Sprint 38 runtime; generation_notes.limitations when hard constraints unmet; learner-facing text excludes internal enum values."
  },
  "defaultOutputStructure": {
    "keys": ["artifact_type", "title", "audience", "page_profile", "sections", "visual_affordance_schema_version", "activities_visual_review", "visual_affordances", "source_artefacts", "constraints_applied", "generation_notes"]
  },
  "userOptions": [
    {
      "id": "page_profile",
      "label": "Page profile",
      "type": "select",
      "default": "learner",
      "choices": [
        { "value": "learner", "label": "Learner", "promptInstruction": "Set page_profile to learner and prioritise substantive session overview (overview/learning_purpose) plus full learner tasks and complete activity materials — never summary-only or placeholder-only materials." },
        { "value": "facilitator", "label": "Facilitator", "promptInstruction": "Set page_profile to facilitator and prioritise run guidance and facilitation/logistics support." },
        { "value": "assessment", "label": "Assessment", "promptInstruction": "Set page_profile to assessment and preserve structured item schema integrity." }
      ]
    },
    {
      "id": "include_answers",
      "label": "Include answers",
      "type": "boolean",
      "default": false,
      "promptInstructionWhenTrue": "Include answer-bearing fields where appropriate.",
      "promptInstructionWhenFalse": "Exclude answer-bearing fields from learner-visible sections."
    },
    {
      "id": "include_marking_guidance",
      "label": "Include marking guidance",
      "type": "boolean",
      "default": false,
      "promptInstructionWhenTrue": "Include marking guidance when supported by upstream artefacts.",
      "promptInstructionWhenFalse": "Do not include marking guidance."
    },
    {
      "id": "include_feedback_guidance",
      "label": "Include feedback guidance",
      "type": "boolean",
      "default": false,
      "promptInstructionWhenTrue": "Include feedback guidance when supported by upstream artefacts.",
      "promptInstructionWhenFalse": "Do not include feedback guidance."
    }
  ],
  "promptTemplate": "Context:\nYou are provided with learning_outcomes, learning_activities, activity_materials, and may also receive learning_sequence, assessment_items, feedback_pack, marking_rubric, and assessment_blueprint.\n\nTask:\nAssemble one readable, self-contained page artefact with artifact_type = page.\n\nInstructions:\n- This is a read-only composition step; do not redesign pedagogy\n- Readable page assembly applies to section structure, headings, ordering, and wrapper prose only — not to rewriting activity.materials.* bodies\n- Treat explicit user requirements from workflow goal, desired outputs, and step notes as hard constraints\n- Hard constraints include requested component types, requested quantities, and explicit exclusions\n- Set page_profile using the configured option: {{option:page_profile}}\n- Include audience as provided or infer a coherent audience from context\n- Preserve explicit numeric requests for components unless impossible from available artefacts\n- Ground all sections in provided upstream artefacts only\n- Exclude unsupported/fabricated content\n- The final page JSON must be self-contained for downstream rendering; do not rely on external chat context at render time\n- Canonical contracts (runtime modules; obey all): LD-MATERIALS-COPY (preserve — merge activity_materials per activity_id into activity.materials; no placeholder-only catalogue; PREC-02 overrides overview thinning); LD-TABLE-FIDELITY (preserve — copy full upstream table material bodies into materials.<table_key>: pipe block AND table-adjunct instructional prose in the same field per 38H-3; no comma-row or Headers/Rows flattening; do not reduce to pipe-only); LD-MATH-RENDER / Math notation output contract (renderer-supported TeX delimiters only — inline \\(...\\), block \\[...\\]; not $...$, $$...$$, code spans/fences for equations); LD-SELF-DIRECTED-RHETORIC when page_profile is learner (overview/learning_purpose/study_tips and verbatim activity orientation fields — not materials bodies)\n- Do not output labels-only references to upstream artefacts where usable content is available\n- Use meaningful section headings; avoid schema-style labels in learner-facing content (for example: Heading, Materials, Material Id)\n- Keep section ordering coherent: pre-activity context, learning purpose/outcomes, learning activities, assessment/check, support notes as applicable\n- For page_profile = assessment, preserve structured assessment item schema integrity; do not flatten items into prose\n- If learning_activities are present, include a Learning Activities section with one entry per upstream activity_id (full membership unless user requests subset or generation_notes.activities_omitted[] records intentional omission)\n- learning_activities.content MUST be an array of activity objects (not alternate wrappers)\n- Each activity: title, timing/duration, learner_task/instructions, expected_output, activity-linked materials as structured objects, cognition fields when present upstream\n- materials MUST use named fields (e.g. materials.analysis_table, materials.scenarios); do not flatten into bullet strings or markdown blobs; do not place raw markdown tables inside bullet-list strings\n- When activity_materials are provided, merge all blocks per activity_id per LD-MATERIALS-COPY preserve — copy learner-facing delivery content verbatim into activity.materials.*. Do not paraphrase, shorten, simplify, summarise, compress, convert, or rewrite material bodies. Do not shorten activity.materials.* content. If a hard output limit prevents full preservation, keep the full upstream material body where possible and record the limitation in generation_notes.limitations rather than silently compressing it. materials.<table_key> values: LD-TABLE-FIDELITY preserve requires the full field verbatim including table-adjunct prose (38H-3 / DP-TABLE-ADJ-01)\n- ACTIVITY MEMBERSHIP: every upstream activity_id must appear unless listed in generation_notes.activities_omitted[] with activity_id, title, reason, authority; learning_sequence order/timing only; activity_materials enrich only\n- If learning_sequence is present, use for order/timing only; do not drop activities absent from sequence rows\n- If assessment_items are present, include a clearly named Formative Assessment Check section containing actual questions/items from assessment_items (not summary-only prose)\n- For MCQ items include stem and options; include correct answer only when include_answers is true; include feedback/explanation only when include_feedback_guidance is true\n- If answers/feedback are not enabled, render questions only\n- assessment_check.content MUST be an object with an items array\n- Include answer-bearing fields only when include_answers is true\n- Include marking guidance only when include_marking_guidance is true and upstream artefacts support it\n- Include feedback guidance only when include_feedback_guidance is true and upstream artefacts support it\n- Do not dump raw JSON structures\n- MATERIALS FIDELITY: visual_affordances[] are additive page-root metadata only; Sprint 38 must not replace or summarise learning_activities.content[].materials; merge upstream materials with concrete scenarios, tables, and worked content verbatim — do not collapse material bodies to revision-note summaries; FORBIDDEN inflation-collapse substitutes: full exposition → one key-point line (e.g. \"Inflation is a sustained increase…\"); worked example with steps → outcome only (e.g. \"Year 1 basket = £100; Year 2 basket = £105; same money buys less\"); classification reasoning → arrow label (e.g. \"Demand exceeds supply → demand-pull inflation\"); calculation worked example → formula plus final result only; analytic worked example → one-sentence effect summary; recommendation template → section-label chain only (e.g. \"Context → Evaluation → Decision → Justification\"); transfer prompt → label-only instruction (e.g. \"Apply to real-world inflation\"); DP-TABLE-ADJ-01 (38H-3): when upstream table Material Content includes pipe rows plus instructional prose (*Instructions:*, completion guidance, interpretation prompts), emit both in activity.materials.<table_key> — table and guidance are one learner-facing instructional unit; forbidden placeholder-only labels without full content in the same field: \"Set of scenarios\", \"Set of short scenarios\", \"Calculation table\", \"Model showing\", \"Table linking\", \"See provided scenarios\", \"Scenario set describing\", \"Table with basket items\"; representation_avoid and duplicate worksheet/table rules apply to generated figures only — not to page materials\n- VISUAL AFFORDANCES: mandatory page-root metadata only — full Sprint 38 generate/defer/reject rules, schema 38.4 field set, and examples in runtime Sprint 38 visual affordance contract\n- If any hard constraint cannot be fully met, record it explicitly in generation_notes.limitations\n- Apply step notes when provided: {{stepNotes}}\n\nOutput:\n- Return output as {{preferredOutputFormat}}\n- Return JSON only\n- Return a JSON object with:\n  - artifact_type (must be page)\n  - title\n  - audience\n  - page_profile (must be one of: learner, facilitator, assessment)\n  - sections (must be an array of section objects with meaningful headings and self-contained content)\n  - source_artefacts\n  - constraints_applied\n  - visual_affordance_schema_version (required; must be \"38.4\")\n  - activities_visual_review (required array; emit [] when no rows)\n  - visual_affordances (required array; emit [] when no decisions; generate/defer/reject per Sprint 38)\n  - generation_notes\n- For learner profile, include at minimum substantive pre-activity context/content, learner-purpose/outcome framing, rich learning activities, and learner tasks/instructions\n- For learner profile with learning_activities present, include a Learning Activities section carrying usable activity-linked content, not labels-only references\n- For learner profile with learning_sequence present, preserve sequence order/timing within the activity flow\n- For learner profile with assessment_items present, include a Formative Assessment Check section with actual item content\n- For facilitator profile, include at minimum run/session guidance and sequencing/logistics/facilitation notes\n- For assessment profile, include at minimum a structured questions/items section; do not flatten questions into narrative prose\n- Record each intentional activity omission in generation_notes.activities_omitted[] as {activity_id, title, reason, authority} where authority is user_constraint | duration_constraint | explicit_exclusion; mirror each omission in generation_notes.limitations\n- Include generation_notes.limitations when hard constraints cannot be fully satisfied or when any activity is omitted\n- Before returning JSON, validate: learning_activities.content is an array containing every upstream activity_id unless listed in generation_notes.activities_omitted[]; (U \\ X) ⊆ C for composed section activity ids; each activity.materials is an object; assessment_check.content is an object with items array; learner-facing text does not leak internal enum values (for example selected_response_only)\n- Return only the JSON."
}
```

---

---
