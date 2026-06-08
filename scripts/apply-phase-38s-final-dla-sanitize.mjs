/**
 * Sprint 38S Final DLA Architecture Sanitisation (Phases A–E).
 * Rewrites pack §5 promptTemplate + defaultPromptNotes only.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const mdPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const NEW_PROMPT_TEMPLATE = `Context:
You are provided with learning_outcomes, episode_plans (required — authoritative archetype and ordered instructional-function beats from upstream Episode Plan), and optionally knowledge_model or learning_content.

Task:
Populate executable learning_activities from upstream episode_plans. This step is an obligation population step — translate each episode_plan beat into activity fields and required_materials obligations. It is not a learning-design, sequencing, archetype-selection, or session-arc step. Do not replan beats, archetypes, function sequences, or cross-activity session arc.

Instructions:
- Every activity must be implementation-ready with explicit learner_task, observable expected_output, required_materials, grouping, and duration_minutes
- Consume episode_plans beat order and archetype as fixed — populate obligations per beat; do not reconstruct function_sequence or infer primary_archetype from LO alone
- Learner-facing fields may use limited Markdown: ##/### headings, lists, **bold**, simple pipe tables, --- rules
- Canonical contracts: LD-TABLE-FIDELITY (table types → pipe tables in GAM); LD-MATERIALS-COPY (specify types/requirements only; GAM authors bodies); LD-MATH-RENDER (TeX \\(...\\) / \\[...\\] only); LD-SELF-DIRECTED-RHETORIC when self_directed
- Omit facilitator_moves and failure_mode for self_directed learner-page workflows
- Use workflow constraints when present: design_scope, delivery_pattern, learning_environments
- Define required_materials as material_id, type, purpose, specification — not full material bodies
- Use KM/LO affordances to enrich specification wording only — not to replan beats or archetypes
- Avoid LO→task shells; use KM definitions/processes/misconceptions in specs where relevant beats require them
- If design_scope is single_activity, produce one focused activity unless clearly justified
- Do not produce discussion-only, facilitator-redesign, or delivery-impossible activities
- Apply step notes when provided: {{stepNotes}}

Obligation population gates (38S — mandatory BEFORE learner_task or required_materials; upstream episode_plans owns archetype and beat order — populate, do not replan; internal reasoning only):
- IFP-04 POPULATION INFERENCE: INF-01 infer from LO/brief + existing KM only; INF-02 no invented domain facts except brief/minimal scenario constants; INF-03 criteria operational; INF-04 strategy menu 3–6 neutral not pre-ranked; INF-05 exemplar models reasoning not single answer; INF-06 scenario numerics illustrative; Evaluate archetype specs: 3–5 criteria, ≥2 perspectives, ≥2 trade-off prompts, worked judgement weak vs strong (strong ≠ expected_output), Transfer with same criteria; forbid pre-written learner memo in consolidation_summary, pre-ranked strategy, session summary as Evaluate teaching; INF-EVAL-01 (38L-4): KM-T05 household budget inflation workbook → fourth Evaluate LO = household strategy judgement (38I-4 A4); KM-T08 policy communication = macro context only — not primary Evaluate driver
- IFP-05 ANTI-SHELL: shell = preamble + single learner_task + thin materials without beat obligations — FAIL; AS-01 every Required beat has required_materials entry; AS-02 learner_task ≥2 teach/model segments before perform; AS-03 ≥1 teaching-depth spec (worked_example, modelling_note, text exposition, scenario narrative); AS-04 Verification ≥4 check items specified; AS-05 expected_output = observable evidence not topic coverage; AS-06 Evaluate EV-SHELL-01..07; AS-FAIL-01 <80% beat functions populated; AS-FAIL-02 learner_task dominates without Worked thinking/Explanation; AS-FAIL-03 materials only for DLA-WB checklist without beat map; AS-FAIL-04 capstone Evaluate with consolidation_summary+prompt_set only; AS-FAIL-05 Apply without Worked thinking when KM-T03 fired; AS-FAIL-06 (38L-4 R5): Evaluate with guided judgement but missing independent judgement template/task_cards OR verification checklist OR transfer_prompt — add missing obligation rows before emit
- IFP-06 ANTI-SPOILER: allow worked/modelling/criteria teaching specs; forbid completed learner memo in consolidation_summary when learner must write; sample_output not copy target; SP-01..04 scaffold-only specs when learner-production required (GAM realises in §6)
- OBLIGATION POPULATION (38S — authoritative beat→obligation contract; merges IFP-09/10 + DLA-WB-26..31): For every Required beat from episode_plans, each required_materials row MUST include depth_floor: L3 plus content obligations — not type-only specs; apply FUNCTION_SPECS + 38K-2 five-dimension sufficiency; GAM-PRES realises bodies. Gates when function Required (cognition fields alone FAIL): G1 Verification (DLA-WB-26 / 38L-2 R1) → every activity MUST list type checklist with purpose verification/self-check/rubric; depth_floor L3: ≥4 criteria-linked check items + repair/revise if any fail; table completion alone does NOT satisfy verification (AS-04, EMIT-FAIL-04); G2 Transfer → transfer_prompt row when Transfer Required; G3 Independent judgement (Evaluate / DLA-WB-28) → template|task_cards separate from consolidation_summary; expected_output names memo artefact; scaffold only per IFP-06; G4 Worked analytic pass (Analyse / DLA-WB-27 / 38L-2 R6) → worked_example|modelling_note with purpose worked analytic pass BEFORE analysis_table; fact→analytical lens→mechanism→draft cell walkthrough; analysis_table spec requires ≥1 exemplar row or hint column; G5 Guided judgement → analysis_table|decision_table|comparison_table with ≥1 partial exemplar row or hint column + scoring guide. Evaluate completion pack (DLA-WB-31 / 38L-4 — EV-CAP-03/04, INF-EVAL-01): criteria exposition (≥3 dimensions) + scenario (≥2 perspectives) + worked judgement weak vs strong + guided table + independent judgement + checklist + transfer_prompt — consolidation_summary alone does NOT satisfy Evaluate; EV-CAP-04: guided judgement alone CANNOT terminate Evaluate; independent judgement + verification + transfer Materials required. Apply (DLA-WB-23): when archetype=Apply and KM-T03 (process ≥3 steps) list worked_example with stepped think-aloud before independent practice. Depth discipline (DLA-WB-30 / 38L-2 R2): every R-function Material specification includes depth_floor: L3 content obligations — thin type-only specs are depth FAIL. Anti-emission (DLA-WB-29 / EMIT-FAIL-01..04): transfer_or_application_task without transfer_prompt; verification implied only by complete the table; consolidation_summary as sole Evaluate capstone evidence; prompt_set substituting for checklist — add Materials before JSON emit (do not replan beats)
Self-study workbook contract (DLA-WB — when delivery_context is self_directed AND brief/desired outputs imply ~60-minute learner workbook or learner page). Types/purposes only — GAM authors bodies (LD-MATERIALS-COPY). Mandatory rows as explicit required_materials JSON when applied — delivery_notes alone insufficient:
- DLA-WB-01: delivery_notes: resource_intent self_study_workbook, session_duration_target_minutes (~60), consolidation_requirement, workbook_contract_applied: true
- DLA-WB-02: Every activity maps ≥1 learning outcome ID; final capstone maps ≥3 distinct outcome IDs when ≥3 outcomes available
- DLA-WB-03: Sum of activity duration_minutes across the session must be 50–70 unless delivery_notes documents an explicit brief exception
- DLA-WB-04/17: solo-completable — individual grouping; omit facilitator_moves/failure_mode
- DLA-WB-06: session MUST NOT be table-only — ≥2 type families; *_table activities need ≥1 non-table type
- DLA-WB-06a (38F-2 mandatory row — V-01): When workbook_contract_applied is true, the session MUST include ≥1 explicit required_materials row whose type is a table/reference family token: classification_table | comparison_table | analysis_table | impact_table | reference_table | data_table | decision_table | planning_table — on a practice-oriented activity (typically second activity), NOT on the capstone alone (DLA-WB-16); specification must describe learner-work columns to complete with judgement/rating cells left for the learner; must coexist with DLA-WB-08 worked_example/sample_output rows and DLA-WB-12 consolidation_summary; do not omit tables because worked/consolidation mandatory rows were added (38E-10 regression guard)
- DLA-WB-07/10/11: ≥1 text exposition (type text, purpose explanatory teaching); ≥2 activities with practice-oriented material purpose; ≥2 activities with task_cards, prompt_set, and/or checklist
- DLA-WB-08 (mandatory required_materials row): ≥1 early-session activity (typically first or second) MUST list explicit required_materials with type worked_example AND type sample_output (preferred pair on same or adjacent teach activity); if sample_output omitted, list type modelling_note with think-aloud/decision-criteria specification; each row specification must require stepped expert completion with visible intermediate results before learner parallel task; learner_task must instruct learner to study worked example/sample before practice; capstone integrative template, ranking template, or practice blank worksheet does NOT satisfy DLA-WB-08
- DLA-WB-12 (mandatory required_materials row): delivery_notes must include consolidation_requirement AND final capstone activity MUST list required_materials type consolidation_summary with specification requiring learner-facing session closure body (≥80 words, ≥3 key ideas summarised — what to remember, not new teaching); optional prompt_set with reflection purpose may supplement but does NOT replace consolidation_summary; capstone template or prompt_set alone does NOT satisfy DLA-WB-12
- DLA-WB-13/05/16: last integrative capstone expected_output = synthesis artefact (plan, memo) — not reproduce all prior tables; capstone maps ≥3 outcomes when ≥3 exist; capstone must NOT enumerate all prior *_table types as primary deliverables
- DLA-WB-15: When activity_interaction_type is ranking or learner_task requires compare/rank — specification must require learner-generated ranking and justification; forbid pre-supplied effectiveness or rating scores; expected_output must mention justification
- DLA-WB-18 (38F-2 mandatory row — V-05 scenario): When learner_task, activity_preamble, required_materials purpose/specification, or expected_output references cases, scenarios, households, personas, dilemmas, or named narratives — same activity_id MUST include distinct required_materials row with type scenario (specification: ≥2 cases with specific names, numbers, or context); task_cards, prompt_set, or activity prose MUST NOT be the sole carrier of case/household narrative bodies; embedding ≥2 household/case narratives only inside task_cards is contract FAIL (38E-10); prefer pairing scenario with analysis_table or comparison_table per DLA-WB-06a
- DLA-WB-19: non-empty expected_output with observable completion evidence
- DLA-WB-22 (38J-3 Evaluate): when archetype=Evaluate include criteria, scenario, worked judgement, guided table, independent judgement, checklist, transfer — EV-CAP-01/02/03

Constraints:
- Activity pattern mix: {{option:activity_pattern_mix}}
- Grouping preference: {{option:grouping_preference}}
- Difficulty level: {{option:difficulty_level}}
- Coverage breadth: {{option:coverage_breadth}}

Output:
- Return output as {{preferredOutputFormat}}
- Return JSON: activities, outcome_alignment, delivery_notes
- delivery_notes object when workbook applies: resource_intent, session_duration_target_minutes (50–70), consolidation_requirement, workbook_contract_applied
- When workbook_contract_applied: (1) DLA-WB-08: ≥1 early activity with worked_example + sample_output (or modelling_note); (2) DLA-WB-12: final activity consolidation_summary; (3) DLA-WB-06a: ≥1 practice activity with table/reference type (classification_table, comparison_table, analysis_table, impact_table, reference_table, data_table, decision_table, or planning_table); (4) DLA-WB-18: ≥1 activity with type scenario when session uses household/case/scenario language — rows (1)–(2) and (3)–(4) must all coexist — do not drop worked/consolidation to add table/scenario; (5)–(8) OBLIGATION POPULATION (38S) G1–G5 + DLA-WB-26..31 depth_floor L3 — see gates above; PRE-EMIT GATE: add missing required_materials before emit if (5)–(8) or EMIT-FAIL-01..04 fail (do not replan beats or archetypes)
- activities[]: activity_id, title, grouping, duration_minutes, mapped_learning_outcomes, required_materials[{ material_id, type, purpose, specification }], learner_task, expected_output, failure_mode, facilitator_moves, activity_preamble (required when self_directed/learner page), optional activity_interaction_type, support_note, cognition-orientation fields (prior_knowledge_activation, reasoning_orientation, self_explanation_prompt, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt)
- required_materials types: task_cards | prompt_set | scenario | checklist | template | sample_output | worked_example | modelling_note | consolidation_summary | transfer_prompt | text | classification_table | comparison_table | analysis_table | impact_table | reference_table | data_table | decision_table | planning_table
- Return only the JSON.`;

const NEW_DEFAULT_PROMPT_NOTES = `38S final: DLA is obligation population only — consume upstream episode_plans (archetype + beat order); do not replan beats, archetypes, or session arc. Populate required_materials per OBLIGATION POPULATION (38S) gates before learner_task. Self_directed: activity_preamble every activity; LD-SELF-DIRECTED-RHETORIC at runtime. DLA specifies material types/requirements; GAM authors bodies (LD-MATERIALS-COPY). Table specs: column/row intent (LD-TABLE-FIDELITY). IFP-06 anti-spoiler: scaffold-only specs when learner-production required. Workbook (~60 min, 38F-2): DLA-WB block — mandatory rows DLA-WB-08, DLA-WB-12, DLA-WB-06a, DLA-WB-18 coexist. Maths: LD-MATH-RENDER at runtime. Post-capture validators enforce obligation rows — add missing Materials before emit, do not replan upstream plan.`;

function extractDlaFactory(md) {
  const heading = "## 5. Design Learning Activities";
  const idx = md.indexOf(heading);
  if (idx === -1) throw new Error("DLA section not found");
  const rest = md.slice(idx);
  const pfIdx = rest.indexOf("### Prompt Factory");
  const jstart = rest.indexOf("```json", pfIdx);
  const jend = rest.indexOf("```", jstart + 7);
  return {
    jstart: idx + jstart,
    jend: idx + jend,
    factory: JSON.parse(rest.slice(jstart + 7, jend).trim())
  };
}

let md = fs.readFileSync(mdPath, "utf8");
const metrics = { phase: "38S-final-DLA", timestamp: new Date().toISOString() };

const { factory, jstart, jend } = extractDlaFactory(md);
metrics.dlaPromptBefore = factory.promptTemplate.length;
metrics.dlaNotesBefore = (factory.defaultPromptNotes || "").length;
metrics.dlaPromptBaseline38S = 24826;
metrics.dlaNotesBaseline38S = 2293;

factory.promptTemplate = NEW_PROMPT_TEMPLATE;
factory.defaultPromptNotes = NEW_DEFAULT_PROMPT_NOTES;

metrics.dlaPromptAfter = factory.promptTemplate.length;
metrics.dlaNotesAfter = factory.defaultPromptNotes.length;
metrics.dlaPromptDeltaFromBaseline = metrics.dlaPromptAfter - metrics.dlaPromptBaseline38S;
metrics.dlaNotesDeltaFromBaseline = metrics.dlaNotesAfter - metrics.dlaNotesBaseline38S;

const t = factory.promptTemplate;
const checks = {
  populationFirstContext: /episode_plans \(required/.test(t),
  populationFirstTask: /obligation population step/.test(t),
  noReplanFunctionSequence: !/replan function_sequence/i.test(t),
  noIFP09DepthFloors: !/IFP-09 DEPTH FLOORS/i.test(t),
  noIFP10Closure: !/IFP-10 CLOSURE EMISSION/i.test(t),
  hasObligationPopulation: /OBLIGATION POPULATION \(38S/i.test(t),
  noDlaWb25: !/DLA-WB-25/i.test(t),
  noDlaWb26Standalone: !/DLA-WB-26 \(38L-2/i.test(t),
  hasIFP04: /IFP-04 POPULATION INFERENCE/i.test(t),
  hasIFP05: /IFP-05 ANTI-SHELL/i.test(t),
  hasIFP06: /IFP-06 ANTI-SPOILER/i.test(t),
  hasPreEmitGate: /PRE-EMIT GATE/i.test(t),
  noReplanBeforeJson: !/replan IFP-04/i.test(t),
  targetSize14to16k: metrics.dlaPromptAfter >= 14000 && metrics.dlaPromptAfter <= 17000
};
metrics.targetPackChars = "14000-17000";
metrics.checks = checks;

const failed = Object.entries(checks)
  .filter(([k, v]) => !v && k !== "targetSize14to16k")
  .map(([k]) => k);
if (failed.length) {
  throw new Error("Sanitisation checks failed: " + failed.join(", "));
}

const newJson = JSON.stringify(factory, null, 2);
md = md.slice(0, jstart + 7) + "\n\n" + newJson + "\n" + md.slice(jend);
md = md.replace(
  "### Input\nlearning_outcomes (and optionally knowledge_model or learning_content)",
  "### Input\nlearning_outcomes, episode_plans (and optionally knowledge_model or learning_content)"
);

fs.writeFileSync(mdPath, md, "utf8");
fs.writeFileSync(
  path.join(
    repoRoot,
    "docs/development/sprints/2026-06-06-sprint-38s-episode-plan-v1-implementation/artefacts/EV-38S-final-dla-prompt-metrics.json"
  ),
  JSON.stringify(metrics, null, 2),
  "utf8"
);

console.log(JSON.stringify(metrics, null, 2));
