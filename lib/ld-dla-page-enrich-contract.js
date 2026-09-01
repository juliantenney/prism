/**
 * Sprint 58 Phase 3A — DLA partial page output contract.
 * Sprint 60 Phase A — Priority-1 instructional archetype planning guidance (production).
 * DLA-ACTIVITY-TITLE-1 — final learner-facing activities[].title ownership.
 */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (root) {
  "use strict";

  var CONTRACT_VERSION = "78-DLA-WS-3";

  /**
   * S78-T-050 — ultra-short final silent P02 emit gate.
   * Reinforces the existing §10 P02 provider-row closure invariant; does not redefine it.
   */
  var DLA_P02_FINAL_SILENT_PRE_EMIT_GATE = [
    "FINAL SILENT PRE-EMIT CHECK (P02):",
    "Immediately before returning JSON, silently re-verify the P02 provider-row closure invariant stated above (every evidence_decision.provider_material_id → matching required_materials[] row with complete evidence_requirement; providers ⊆ task_input_material_ids when required is true). Correct any inconsistency before emission. Emit only the corrected artefact — do not output checking or reasoning."
  ].join("\n");
  // Fallback only when parse-material cannot be required (browser before vNext load).
  // Must match lib/learner-renderer-vnext/parse-material.js MATERIAL_RENDERER_TYPES.
  var FALLBACK_PRESENTATION_MATERIAL_TYPES = Object.freeze([
    "text",
    "worked_example",
    "sample_output",
    "checklist",
    "analysis_table",
    "scenario",
    "decision_table",
    "modelling_note",
    "prompt_set",
    "comparison_table",
    "classification_table",
    "planning_table",
    "reference_table",
    "data_table",
    "impact_table",
    "template",
    "task_card",
    "transfer_prompt",
    "consolidation_summary"
  ]);

  function resolveTitleContract() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./ld-activity-title-contract.js");
      } catch (_) {}
    }
    var scope =
      root ||
      (typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : {});
    return scope.PRISM_LD_ACTIVITY_TITLE_CONTRACT || null;
  }

  function listDlaPresentationMaterialTypes() {
    if (typeof require === "function") {
      try {
        var parseMaterial = require("./learner-renderer-vnext/parse-material.js");
        if (parseMaterial && Array.isArray(parseMaterial.MATERIAL_RENDERER_TYPES)) {
          return parseMaterial.MATERIAL_RENDERER_TYPES.slice();
        }
      } catch (_err) {}
    }
    var scope =
      root ||
      (typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : {});
    var vnext = scope.PRISM_LEARNER_RENDERER_VNEXT;
    if (vnext && Array.isArray(vnext.MATERIAL_RENDERER_TYPES)) {
      return vnext.MATERIAL_RENDERER_TYPES.slice();
    }
    return FALLBACK_PRESENTATION_MATERIAL_TYPES.slice();
  }

  function buildDlaMaterialTypePresentationVocabularyBlock() {
    var tokens = listDlaPresentationMaterialTypes();
    return [
      "material_type is a presentation/rendering token, not a pedagogical or semantic label.",
      "Every required_materials[].material_type MUST be one of these supported presentation tokens: " +
        tokens.join(" | ") +
        ".",
      "Do not invent semantic type names such as comparison_examples, explanation, practice_problems, worked_process, problem_set, solution_framework, process_reference, interpretation_cases, or concept_explanation.",
      "Put the pedagogical job in purpose, specification, and instructional_archetype / archetype_plan. Choose the closest supported presentation form.",
      'Examples: mechanism explanation → material_type "text" plus mechanism_explanation archetype; worked process → "worked_example"; practice problems → "prompt_set"; solution framework → "template".'
    ].join("\n");
  }

  function activityTitleGuidanceBlock() {
    var titleMod = resolveTitleContract();
    if (titleMod && typeof titleMod.buildDlaActivityTitleGuidance === "function") {
      return titleMod.buildDlaActivityTitleGuidance();
    }
    return [
      "Learner-facing activity title (required on every activities[] row):",
      "- Emit activities[].title as the final concise name for the designed activity.",
      "- Normally use 3–7 words; prefer no more than 45 characters; never exceed 60 characters.",
      "- Name the actual topic, action, or learning experience — not the mapped learning-outcome statement.",
      "- Remain meaningful when heard without surrounding visual context.",
      "- Retain necessary disciplinary terminology.",
      "- Be distinct from every sibling activity title in this resource.",
      "- Create semantic distinctness rather than appending A1, A2, or other internal activity IDs.",
      "- Do not include internal activity IDs in learner-facing titles (as standalone tokens or uniqueness suffixes).",
      "- Do not truncate with terminal ellipses (... or …).",
      '- Do not use generic labels such as "Activity A1".',
      "- This title replaces any provisional Episode Plan shell title and must not be regenerated downstream."
    ].join("\n");
  }

  function buildInstructionalArchetypePlanningGuidance() {
    return [
      "Instructional archetype planning on required_materials (Sprint 60 production — Priority 1, extended Sprint 61-E01):",
      "",
      "Authoritative source of truth (per material row):",
      "- instructional_archetype",
      "- archetype_plan",
      "",
      "When a material’s pedagogical job genuinely matches one of the supported Priority-1 archetypes,",
      "emit instructional_archetype and a complete archetype_plan on that required_materials row:",
      "",
      "1) mechanism_explanation — teach how/why an effect is transmitted (intervening causal process)",
      "   archetype_plan must include:",
      '   - start (non-empty string)',
      '   - outcome (non-empty string)',
      "   - required_links (non-empty string array; each link is an intervening process step)",
      "",
      "2) process_walkthrough — teach an ordered expert process (physical, cognitive, or institutional)",
      "   archetype_plan must include:",
      '   - process_goal (non-empty string)',
      "   - stages (non-empty string array; at least two stages)",
      "",
      "3) mental_model_building — help the learner assemble a durable working model of a system",
      "   archetype_plan must include exactly this shape (planning skeleton only — not learner body):",
      '   - system (non-empty string)',
      "   - key_relationships (non-empty string array)",
      '   - governing_constraint (non-empty string)',
      "   - contrast: { state_a, state_b } (both non-empty strings)",
      "   Do NOT emit parts, predicted_effect, or System:/Relationships: rubric headings as plan fields.",
      "",
      "4) evaluation_judgement — help the learner apply explicit criteria to relevant evidence,",
      "   consider trade-offs or limitations, and reach a justified conclusion",
      "   Select evaluation_judgement only when the learner must apply explicit criteria to evidence,",
      "   consider limitations or trade-offs, and reach or defend a justified conclusion.",
      "   archetype_plan must include:",
      '   - question (non-empty string)',
      "   - criteria (non-empty string array; at least two criteria)",
      "   - evidence (non-empty string array; at least one entry)",
      "   - tradeoffs (non-empty string array; at least one limitation or trade-off)",
      '   - judgement_focus (non-empty string)',
      "   Do NOT select evaluation_judgement merely because:",
      "   - the activity asks a question;",
      "   - the learner must explain a concept;",
      "   - the learner must compare two items descriptively;",
      "   - the learner must list advantages and disadvantages;",
      "   - the activity uses an Evaluate learning-function label but does not require evidence-based judgement.",
      "   Do not confuse evaluation_judgement with mechanism_explanation (causal transmission),",
      "   process_walkthrough (ordered expert stages without criteria weighing),",
      "   or mental_model_building (durable system model + contrast states).",
      "",
      "Selection rules:",
      "- Choose the archetype per material (not once for the whole page).",
      "- A page may contain multiple materials using different Priority-1 archetypes.",
      "- Emit archetype fields only when the material’s pedagogical purpose genuinely matches.",
      "- Ordinary materials must omit instructional_archetype and archetype_plan.",
      "- material_type is presentation format; instructional_archetype is pedagogical function — keep them independent.",
      "- Do not invent unknown instructional_archetype values (supported Priority-1 IDs only in this contract).",
      "- Do not use workflow goal/title tokens or sprint test tokens as the selection signal;",
      "  selection is expressed only on required_materials rows."
    ].join("\n");
  }

  /**
   * Canonical assembler (Sprint 77). Phase D: sole live DLA normative authority
   * (Sprint 76 dual builders and dlaCanonicalAssembler rollback retired).
   */
  var DLA_CANONICAL_SECTION_IDS = [
    "role",
    "inputs",
    "sources",
    "production",
    "task_inputs",
    "commissioning",
    "evidence",
    "providers",
    "overlay",
    "output",
    "examples"
  ];

  var DLA_CANONICAL_SECTION_HEADINGS = {
    role: "## 1. DLA ROLE AND AUTHORITY",
    inputs: "## 2. INPUTS AND INHERITED DESIGN",
    sources: "## 3. SOURCES AND ATTACHMENTS",
    production: "## 4. LEARNER PRODUCTION",
    task_inputs: "## 5. TASK INPUTS",
    commissioning: "## 6. MATERIAL COMMISSIONING",
    evidence: "## 7. EVIDENCE DECISION",
    providers: "## 8. PROVIDER AUTHORING",
    overlay: "## 9. DOMAIN / WORKBOOK OVERLAY",
    output: "## 10. OUTPUT CONTRACT AND SHAPE",
    examples: "## 11. ILLUSTRATIVE EXAMPLES"
  };

  function normalizeDlaAssembleCtx(ctx) {
    var c = ctx && typeof ctx === "object" ? ctx : {};
    var overlayOn = c.workbookOverlay === true;
    var overlayText = String(c.overlayText || "").trim();
    return {
      workbookOverlay: overlayOn,
      overlayText: overlayOn ? overlayText : "",
      includeExamples: c.includeExamples !== false,
      productionSlot: String(c.productionSlot || "").trim(),
      commissioningSlot: String(c.commissioningSlot || "").trim(),
      outputSlot: String(c.outputSlot || "").trim()
    };
  }

  function withHeading(id, body) {
    var heading = DLA_CANONICAL_SECTION_HEADINGS[id];
    var text = String(body || "").replace(/^\n+|\n+$/g, "");
    return text ? heading + "\n\n" + text : heading;
  }

  function buildDlaSectionRole() {
    return withHeading(
      "role",
      [
        "DLA commissions learner activities and required materials on a partial v2 page artefact for DLA-owned fields only.",
        "Episode Plan owns the inherited instructional plan: mapped learning outcomes as given, beat order, and page-level archetypes. Do not replan those.",
        "DLA owns learner production design for those mapped outcomes (expected_output and learner_task).",
        "GAM owns material bodies and executability. Do not write materials[].body or any GAM material body content.",
        "Do not return a full-page replay. Do not emit standalone learning_activities artefacts."
      ].join("\n")
    );
  }

  function buildDlaSectionInputs() {
    return withHeading(
      "inputs",
      [
        "You are provided with learning_outcomes and episode_plans (authoritative ordered instructional-function beats from upstream Episode Plan), and optionally knowledge_model or learning_content.",
        "Consume mapped learning outcomes and episode_plans beat order as given. Populate obligations per beat; do not reconstruct function_sequence or infer primary_archetype from LO alone.",
        "Do not replan beats, page-level archetypes, function sequences, or cross-activity session arc."
      ].join("\n")
    );
  }

  function buildDlaSectionSources() {
    return withHeading(
      "sources",
      [
        "Before designing activities, inspect material attached or introduced in this Copilot conversation. Classify each attachment as supporting knowledge, learner evidence, or both. Inventory the source units actually available (titles, documents, sections, datasets, passages, or other identifiable units). Do not invent related but unattached works. Do not reconstruct unavailable sources from model memory.",
        "If attachments are learner evidence, make that material central to activities whose disciplinary purpose is to analyse, interpret, compare, classify, evaluate, or draw conclusions about it. Use provenance conversation_attachment; name inventoried units in purpose, specification, or processing_notes; require directly inspectable excerpts, quotations, or values—not summary packs, thematic summaries, or extract references alone. Do not substitute generic simulations, teaching-only examples, pre-interpreted observations, or generated viewpoints without underlying source evidence. Later evidence-dependent activities concerning that same material should continue with conversation_attachment unless DLA states an explicit pedagogical reason why generated evidence is necessary.",
        "Orientation/prerequisite teaching may remain source-free. Supporting-knowledge attachments may inform teaching specs without becoming evidence_requirement providers. system_generated_simulation remains valid for genuinely different evidential needs or when no suitable source material is available. Mixed attached excerpts and generated viewpoints must be separate providers with honest provenance; provider_material_ids lists both.",
        "If no learner-evidence material is available: continue with normal system-generated evidence decisions; do not fail ordinary workflows; do not invent primary/copyrighted/proprietary source content; do not force irrelevant attachments into activities. Known boundary: Prism cannot read Copilot attachment bytes and does not persist uploads; exact excerpt-to-file verification is out of scope.",
        "If learner-evidence material is present, optionally record generation_notes.learner_evidence_attachments { present: true, role: \"learner_evidence\"|\"supporting_knowledge\"|\"both\", inventoried_units: [\"...\"] } — DLA-local, optional, backward-compatible; omit when no learner-evidence attachments apply."
      ].join("\n")
    );
  }

  function buildDlaSectionProduction(ctx) {
    ctx = normalizeDlaAssembleCtx(ctx);
    var parts = [
      "Define the learner production obligation (expected_output and learner_task intent). Completing it must require every load-bearing operation needed to demonstrate the mapped LO. A supporting check must not substitute for the operation the mapped LO requires. If completed perfectly, would the work demonstrate every load-bearing mapped-LO operation? If not, redesign production before commissioning materials.",
      "expected_output is quality-threshold prose describing what good evidence of the production looks like — not completion labels.",
      "S78-WS-1 response fulfilment binding: every load-bearing learner production obligation must be explicitly bound to ≥1 commissioned learner response surface in required_materials[] via structured response_fulfilment on a row whose material_type can render an operational input surface for that production (table_entry, text_entry, or existing ordering workspace). Study/read/verify/checklist-only steps are not load-bearing production.",
      "S78-WS-2 model/practice independence: when a worked_example or modelling_note supports a subsequent independent procedural attempt on a task operand, the model row MUST carry practice_independence.attempt_operand_material_ids and its specification MUST require a distinct model operand that does not disclose or substantially complete the bound attempt operand(s). Guided-practice-only steps do not trigger this binding.",
      "S78-WS-3 diagnostic review: when an activity requires substantive independent learner production (load-bearing productionKinds and not guided-only), commission exactly one checklist row with diagnostic_review.covers_response_material_ids equal to every response_fulfilment material_id on the activity; 3–4 diagnostic criteria in specification (hard max 5). Study/read/model-only and guided-only activities do not trigger this requirement.",
      "S78-DP disciplinary warrant: learner_task, expected_output, activity_preamble, and required_materials specifications must not commission a stronger disciplinary conclusion than the mapped LO, taught model class, and intended assumptions warrant. Commission the learner operation at accurate strength (derive/solve/verify candidate or feasible results; interpret within stated conditions) rather than unscoped establishment language when sufficiency or generality is not taught. For interpretive productions, one short scope bound is enough — do not force legalistic caveats on every activity. Omit advanced theory freely; do not upgrade the strength of what remains.",
      "S78-T-041 culminating transfer production: where pedagogically appropriate to the learning design, the culminating/final activity MUST commission a compact learner-facing transfer/application production that requires the learner to use the page's core learning in a meaningfully changed or less familiar surface context. Prefer required_materials type transfer_prompt (optionally paired with transfer_or_application_task). The transfer must require learner production (identify, formulate, apply, interpret, or produce a response) — not mere reading, recap, or generic reflection. It must not introduce new teaching required to complete the task; must honour S78-DP and taught model-class boundaries; and must remain distinct from page_synthesis.study_tips / page learner-resource closure (consolidation only). Do not treat Study tips as the transfer task. Omit transfer only when the episode design has no transfer/application intent.",
      "intellectual_coherence_bridge REQUIRED on every activity including A1: concise cumulative-sequence prose distinct from activity_preamble. A1 connects page orientation/learning purpose/prior knowledge to the first activity (no preceding-activity reference). A2+ carries prior learning, reasoning, evidence, production or capability into the current demand. Forbid scheduling-only or Activity-N-follows-Activity-M text.",
      "Include DLA-owned instructional fields such as learner_task, expected_output, activity_preamble, intellectual_coherence_bridge, and DLA-owned cognition/scaffold fields (reasoning_orientation, self_explanation_prompt, etc.).",
      "",
      activityTitleGuidanceBlock()
    ];
    if (ctx.productionSlot) parts.push("", ctx.productionSlot);
    return withHeading("production", parts.join("\n"));
  }

  function buildDlaSectionTaskInputs() {
    return withHeading(
      "task_inputs",
      "Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. An operand may also be an already-formed object or state this activity’s operation acts on when the system must supply it. Recording work in a workspace does not make the workspace the operand. The learner’s own prior-activity product is not a new GAM commission. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent."
    );
  }

  function buildDlaSectionCommissioning(ctx) {
    ctx = normalizeDlaAssembleCtx(ctx);
    var parts = [
      "Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). Include any pedagogically chosen method, condition, assumption, boundary, or exclusion the commissioned operation depends on. If omitting it would permit an operand that requires a different operation or untaught reasoning, the specification is insufficient. State bounds for this commissioned operation only. specification must not be only the material_type token.",
      "S78-DP (commissioning): keep purpose/specification claim strength matched to the taught model class and LO — do not commission necessary or intermediate results as unrestricted established conclusions; for interpretation rows, bind scope to stated scenario/conditions when the reading is conditional.",
      "S78-T-041 (commissioning): on the culminating/final activity, when transfer/application is pedagogically appropriate, include exactly one transfer_prompt required_materials row. purpose must describe learner application/production on a changed context; specification must require a short production task (changed surface, same core learning) without a worked answer and without new teaching. transfer_prompt is not consolidation_summary, not Study tips, and not a second worked example. Earlier non-culminating activities may omit transfer_prompt when transfer is not required by their episode beats.",
      "S78-T-042 (commissioning) structured learner workspace fidelity: when a required material is intended as a structured learner-response workspace (stepped solution/derivation scaffold, multi-field response form, labelled working sequence, or similar), commission material_type template (or an appropriate table-family type when the learner genuinely completes rows/columns). purpose must name the operational response surface; specification MUST require a parseable structured body shape — not a sequence of standalone bold prose labels that merely describe where responses ought to go. For template: specification MUST require successive sections authored as **Label:** (bold label with trailing colon) so each label binds to a learner response location in order. For comparison/diagnostic/completion tables: keep table-family material_type and blank learner cells — do not convert genuine tables into templates. Do not commission text/worked_example/sample_output as the sole carrier of a multi-field response workspace. Editable mathematical input remains a separate parked capability; for derivation/solution sequences, still commission template (or blank table) so the pedagogical order is preserved as labelled response prompts, without claiming a symbolic maths editor.",
      buildDlaMaterialTypePresentationVocabularyBlock(),
      "Do not generate final evidence bodies here; GAM fulfils required materials. Do not write materials[].body.",
      "",
      "Response fulfilment commissioning (S78-WS-1 — optional object on learner-response required_materials[] rows only, parallel to evidence_requirement):",
      '- response_fulfilment.kind: required literal "learner_workspace" or "learner_text_production".',
      "- response_fulfilment.response_kind: required semantic production surface — table_compare | table_complete | table_decide | table_classify | table_plan | text_compose.",
      "- response_fulfilment.binds_production_steps: optional 1-based learner_task step numbers this row fulfils.",
      "- response_fulfilment.allows_partial_exemplar: optional boolean (default true for table kinds) — documents partial fixed/model rows permitted for GAM.",
      "- response_kind is authoritative; material_type must be from the allowed presentation set for that kind (comparison_table for table_compare; analysis_table/decision_table/classification_table/planning_table/data_table/impact_table/comparison_table/template for table_complete; prompt_set/template/task_card for text_compose).",
      "- Teaching/display rows (text, explanatory_note, checklist, worked_example, sample_output, reference_table) must NOT carry response_fulfilment for table-class production. A display/reference table is not editable merely because it is a table.",
      "- For rows with response_fulfilment: specification must state learner-completion bounds (columns/rows learners fill, partial exemplar rules, exclusions); purpose must describe the operational response surface — not exposition/checking alone.",
      "",
      "Model/practice independence commissioning (S78-WS-2 — optional object on worked_example|modelling_note rows only, required when model + independent attempt operand coexist):",
      "- practice_independence.attempt_operand_material_ids: non-empty array of material_id strings for task operand rows (scenario, task_card, etc.) supplying the independent attempt; must not include the model row id.",
      "- Model specification MUST state the demonstrated instance is distinct from every bound attempt operand and MUST NOT include those operands' target solution or complete load-bearing reasoning path.",
      "- Each bound operand specification MUST define a distinct near-transfer instance from the model.",
      "- Omit practice_independence when no independent attempt is commissioned, when only guided-practice scaffolding applies, or on non-model rows.",
      "",
      "Diagnostic review commissioning (S78-WS-3 — optional object on checklist rows only; required when substantive independent production exists):",
      "- diagnostic_review.covers_response_material_ids: non-empty array of material_id strings; set MUST equal every required_materials[] row carrying response_fulfilment on this activity.",
      "- Exactly one checklist row per triggered activity may carry diagnostic_review.",
      "- Checklist specification MUST name 3–4 diagnostic quality dimensions covering the bound production (hard max 5); must support criterion-specific correction — not generic tick-box completion.",
      "- Checklist rows MUST NOT carry response_fulfilment.",
      "- Do NOT write learner-facing criterion questions, why-it-matters prose, feature lists, or repair actions — GAM owns those.",
      "- Omit diagnostic_review when no substantive independent production is commissioned or when only guided-practice scaffolding applies.",
      "",
      buildInstructionalArchetypePlanningGuidance()
    ];
    if (ctx.commissioningSlot) parts.push("", ctx.commissioningSlot);
    return withHeading("commissioning", parts.join("\n"));
  }

  function buildDlaSectionEvidence() {
    return withHeading(
      "evidence",
      [
        "Independently decide whether any task input functions as particulars-as-grounds. DLA owns evidence_decision.required. true means the learner cannot complete this activity’s production without inspecting particulars (observations, values, extracts, features, conditions, cases-as-data) as grounds for inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation. false means that epistemic use is not required: it does not mean no materials, no operands, and no generated practice. Procedural operands may be task inputs (task_material_decision true) with required: false. Provenance is not this boolean. Correct evidence classification does not by itself make the production sufficient for the mapped LO. Decide from the production’s epistemic role — not from nouns, activity_preamble, intellectual_coherence_bridge, or later-activity mentions.",
        "If evidence_decision.required is true: list those task-input rows in provider_material_ids and attach evidence_requirement on those rows. If false: omit providers and evidence_requirement.",
        "Listing a task input does not set evidence_decision.required; P01 and P02 remain independent."
      ].join("\n")
    );
  }

  function buildDlaSectionProviders() {
    return withHeading(
      "providers",
      [
        "Evidence-provider authoring (only when evidence_decision.required is true):",
        '- evidence_requirement.kind: required literal "learner_evidence".',
        "- evidence_requirement.purpose: required non-empty string — this evidence row’s job as inspectable grounds for the learner (not the same field as required_materials[].purpose).",
        "- evidence_requirement.learner_action: what the learner must do with the particulars.",
        "- evidence_requirement.observable_features: non-empty string array of particulars learners must inspect.",
        "- When evidence_decision.required is true, any pre-task teaching, worked_example, or modelling_note must not analyse the focal evidence provider, answer the focal learner task, state a preferred mechanism/option/interpretation, or provide the provisional/final judgement learners must derive. A pre-task worked example may remain if it uses a distinct analogous case, demonstrates only the reasoning procedure, or models one reasoning step without resolving the focal question.",
        '- Provenance: "system_generated_simulation" (generated instructional evidence requiring simulation honesty) or "conversation_attachment" (authoritative primary/source material available in the current Copilot conversation).',
        "- Teaching or explanatory material is not a provider unless it also supplies clearly distinguished, directly inspectable evidence. Recording evidence in a response scaffold (analysis_table, decision_table, comparison_table, template, etc.) does not make that scaffold the evidence provider. Prefer a separate evidence provider plus an ordinary response scaffold.",
        "- evidence_layout separate_provider: keep teaching text, evidence provider, and response scaffold as distinct rows. Use combined_evidence_workspace only when that SAME listed material genuinely contains both fixed evidence columns and learner-editable response columns, and both fixed_observation_fields and learner_response_fields are non-empty string arrays naming those columns (cell values remain blank for learners). For conversation_attachment combined_evidence_workspace rows: fixed_observation_fields must name the source-native evidence field(s) learners will inspect (quotation, extract, value, observation, clause, or equivalent)—not only poem/title/category/source-name labels."
      ].join("\n")
    );
  }

  function buildDlaSectionOverlay(ctx) {
    ctx = normalizeDlaAssembleCtx(ctx);
    return withHeading("overlay", ctx.overlayText || "");
  }

  function buildDlaSectionOutput(ctx) {
    ctx = normalizeDlaAssembleCtx(ctx);
    var parts = [
      "Output a partial v2 page artefact for DLA-owned fields only.",
      "",
      "Required top-level envelope:",
      '- artifact_type: "page"',
      '- schema_version: "2.0.0"',
      '- assembly_state.current_stage: "dla"',
      '- assembly_state.enriched_by must include "dla"',
      "",
      "Required payload field names:",
      "- activities[] (DLA-owned subset only)",
      "- each activities[] row must include activity_id",
      "- each activities[] row must include title",
      "- learner_task, expected_output, activity_preamble, intellectual_coherence_bridge",
      "- DLA-owned cognition/scaffold fields (reasoning_orientation, self_explanation_prompt, etc.)",
      "- each activities[] row must include task_material_decision { separate_inputs_required, task_input_material_ids[] }",
      "- required_materials must be an array on every activity (empty allowed when separate_inputs_required is false)",
      "- every required_materials[] row must include material_id, material_type, non-empty purpose and specification",
      "- each activities[] row must include evidence_decision { required, reason, provider_material_ids[] }",
      "- P02 provider-row closure (evidence_requirement): when evidence_decision.required is true, every material_id in evidence_decision.provider_material_ids MUST identify a required_materials[] row carrying a complete evidence_requirement; each such provider row MUST also appear in task_material_decision.task_input_material_ids",
      "- evidence_requirement MUST NOT appear on required_materials[] rows not listed in provider_material_ids; when evidence_decision.required is false, omit evidence_requirement on all rows",
      "- each evidence_requirement MUST include: kind (literal \"learner_evidence\"), purpose (non-empty string), learner_action (non-empty string), observable_features (non-empty string array)",
      "- optional on evidence_requirement when used: provenance, evidence_layout, disclosure_constraint, minimum_suitable_form, processing_notes (non-empty strings if present); combined_evidence_workspace also requires fixed_observation_fields and learner_response_fields as non-empty string arrays",
      "- optional only on learner-response required_materials[] rows: response_fulfilment { kind, response_kind, binds_production_steps?, allows_partial_exemplar? }",
      "- optional only on template required_materials[] rows: response_fields[] { label (required non-empty string), input_modality? (\"text\" | \"math\"; omit = text) } — one entry per commissioned structured response field; labels must match the **Label:** sections GAM will author in order; DLA is the sole authority for input modality; GAM must not reinterpret modality",
      "- optional only on worked_example|modelling_note rows when paired with independent attempt: practice_independence { attempt_operand_material_ids[] }",
      "- optional only on checklist rows when substantive independent production exists: diagnostic_review { covers_response_material_ids[] }",
      "- optional generation_notes.learner_evidence_attachments when learner-evidence attachments were inventoried",
      "",
      "MP-1 / S78-WS-2 closure: when worked_example or modelling_note supports a subsequent independent procedural attempt, that model row MUST carry practice_independence listing every attempt operand material_id; model specification MUST require a distinct operand instance and forbid completing the bound attempt.",
      "",
      "DR-1 / S78-WS-3 closure: when substantive independent learner production exists, exactly one checklist row MUST carry diagnostic_review whose covers_response_material_ids lists every response_fulfilment material_id on the activity.",
      "",
      "Pre-output deterministic capture checks (verify internally before returning JSON):",
      "1. P02 closure: for every provider_material_id, the matching required_materials[] row contains complete evidence_requirement.",
      "2. Provider ids ⊆ task_input_material_ids when evidence_decision.required is true.",
      "3. Load-bearing production bound via response_fulfilment on an operational learner-response row (see §4).",
      "4. No evidence_requirement on non-provider rows; provider_material_ids empty when evidence_decision.required is false.",
      "5. MP-1 closure: model→independent-attempt pairs have practice_independence binding to attempt operand row(s); model spec requires distinct unsolved operand.",
      "6. DR-1 closure: triggered activities have exactly one diagnostic_review checklist covering all response_fulfilment material_ids.",
      "",
      "Explicitly forbidden:",
      "- full-page replay",
      "- shell fields: page-level title, audience, page_profile, learning_outcomes, episode_plans",
      "  (page-level title is not activities[].title — activity titles are required DLA-owned fields)",
      "- materials[].body or any GAM material body content",
      "- page_synthesis",
      "- learning_sequence / assessment_check",
      "- preserving, reconstructing, or copy-forwarding non-DLA stage fields"
    ];
    if (ctx.outputSlot) parts.push("", ctx.outputSlot);
    // S78-T-050: final gate after optional outputSlot so it sits at the end of §10, nearest emission.
    parts.push("", DLA_P02_FINAL_SILENT_PRE_EMIT_GATE);
    return withHeading("output", parts.join("\n"));
  }

  function buildDlaSectionExamples(ctx) {
    ctx = normalizeDlaAssembleCtx(ctx);
    if (!ctx.includeExamples) return withHeading("examples", "");
    return withHeading(
      "examples",
      [
        "Illustrative miniature only — follows rules already stated above. Use material_type (not type) on required_materials rows.",
        "",
        "{",
        '  "activity_id": "A1",',
        '  "title": "Map inflation cause chains",',
        '  "intellectual_coherence_bridge": "The page enquiry established inflation as a measurement problem. This first activity uses that orientation to map cause chains from supplied cases.",',
        '  "learner_task": "Substantive learner-facing task prose tied to the LO and episode beats.",',
        '  "expected_output": "Quality-threshold prose describing what good evidence looks like.",',
        '  "task_material_decision": { "separate_inputs_required": true, "task_input_material_ids": ["A1-M1"] },',
        '  "required_materials": [',
        "    {",
        '      "material_id": "A1-M1",',
        '      "material_type": "scenario",',
        '      "purpose": "Provide contrastive evidence cases for diagnosis.",',
        '      "specification": "Two short contrastive cases with observable measurements; do not state the conclusion.",',
        '      "evidence_requirement": {',
        '        "kind": "learner_evidence",',
        '        "purpose": "Provide inspectable observations needed for diagnosis.",',
        '        "learner_action": "Inspect the observations and justify the likely diagnosis.",',
        '        "observable_features": ["pattern in observed values", "contrast between two cases"],',
        '        "provenance": "system_generated_simulation",',
        '        "evidence_layout": "separate_provider"',
        "      }",
        "    }",
        "  ],",
        '  "evidence_decision": { "required": true, "reason": "Learner must inspect observable evidence before judging.", "provider_material_ids": ["A1-M1"] }',
        "}",
        "",
        "Contrast: practice operands remain in task_input_material_ids with evidence_decision.required false and no evidence_requirement."
      ].join("\n")
    );
  }

  /**
   * Default session duration the workbook contract assumed as a hardcoded
   * literal before S80-S6. Retained as the default so callers that supply no
   * duration receive byte-identical contract text.
   */
  var DLA_WORKBOOK_DEFAULT_DURATION_MINUTES = 60;

  /**
   * Tolerance either side of the session duration target for DLA-WB-03.
   *
   * ±10 is not a new rule: the pre-S80-S6 contract paired a ~60 target with a
   * 50–70 sum band, so ±10 is the band the contract has always expressed. It
   * reproduces "50–70" exactly at 60, which is what keeps the default text
   * byte-identical. A proportional band would not.
   */
  var DLA_WORKBOOK_DURATION_BAND_TOLERANCE_MINUTES = 10;

  /**
   * Lower bound floor for the band. Without it a 10-minute run would emit a
   * lower bound of 0, which states no constraint at all.
   */
  var DLA_WORKBOOK_DURATION_BAND_FLOOR_MINUTES = 5;

  function resolveDlaWorkbookDurationTarget(options) {
    var raw = options && typeof options === "object" ? options.durationMinutes : null;
    var minutes = Number(raw);
    if (raw == null || raw === "" || !isFinite(minutes) || minutes <= 0) {
      minutes = DLA_WORKBOOK_DEFAULT_DURATION_MINUTES;
    }
    minutes = Math.round(minutes);
    var tolerance = DLA_WORKBOOK_DURATION_BAND_TOLERANCE_MINUTES;
    return {
      target: minutes,
      bandLow: Math.max(DLA_WORKBOOK_DURATION_BAND_FLOOR_MINUTES, minutes - tolerance),
      bandHigh: minutes + tolerance
    };
  }

  /**
   * §9 workbook overlay.
   *
   * `options.durationMinutes` is the effective authoritative session duration
   * for the run (S80-S6 §4/§5). It is consumed as a *target and band* only:
   * this contract tells DLA what total it is designing against, while Learning
   * Sequence remains the stage that allocates minutes across activities.
   * Omitting it preserves the historical 60-minute contract text exactly.
   */
  function buildDlaWorkbookOverlayBlock(options) {
    var duration = resolveDlaWorkbookDurationTarget(options);
    return [
      "Domain / workbook overlay (subordinate). Apply when delivery_context is self_directed AND the brief implies a ~" +
        duration.target +
        "-minute learner workbook or learner page. Do not replace learner production, task-input, commissioning, or evidence decisions in §§4–8. Types/purposes only — GAM authors bodies.",
      "",
      "OBLIGATION POPULATION (38S) — populate, do not replan beats or page-level archetypes:",
      "- IFP-04 POPULATION INFERENCE: INF-01 infer from LO/brief + existing KM only; INF-02 no invented domain facts except brief/minimal scenario constants; INF-03 criteria operational; INF-04 strategy menu 3–6 neutral not pre-ranked; INF-05 exemplar models reasoning not single answer; INF-06 scenario numerics illustrative; Evaluate archetype specs: 3–5 criteria, ≥2 perspectives, ≥2 trade-off prompts, worked judgement weak vs strong (strong ≠ expected_output), Transfer with same criteria; forbid pre-written learner memo in consolidation_summary, pre-ranked strategy, session summary as Evaluate teaching; INF-EVAL-01: KM-T05 household budget inflation workbook → fourth Evaluate LO = household strategy judgement; KM-T08 policy communication = macro context only — not primary Evaluate driver.",
      "- IFP-05 ANTI-SHELL: shell = preamble + single learner_task + thin materials without beat obligations — FAIL; AS-01 every Required beat has required_materials entry; AS-02 learner_task ≥2 teach/model segments before perform; AS-03 ≥1 teaching-depth spec (worked_example, modelling_note, text exposition, scenario narrative); AS-04 Verification ≥4 check items specified; AS-06 Evaluate EV-SHELL-01..07; AS-FAIL-01 <80% beat functions populated; AS-FAIL-02 learner_task dominates without Worked thinking/Explanation; AS-FAIL-03 materials only for DLA-WB checklist without beat map; AS-FAIL-04 capstone Evaluate with consolidation_summary+prompt_set only; AS-FAIL-05 Apply without Worked thinking when KM-T03 fired; AS-FAIL-06 Evaluate with guided judgement but missing independent judgement template/task_cards OR verification checklist OR transfer_prompt — add missing obligation rows before emit.",
      "- IFP-06 ANTI-SPOILER: allow worked/modelling/criteria teaching specs; forbid completed learner memo in consolidation_summary when learner must write; sample_output not copy target; SP-01..04 scaffold-only specs when learner-production required.",
      "",
      "G-gates when function Required (cognition fields alone FAIL):",
      "- G1 Diagnostic review (S78-WS-3): when an activity requires substantive independent learner production, exactly one checklist row MUST carry diagnostic_review.covers_response_material_ids listing every response_fulfilment material_id; 3–4 diagnostic criteria in specification (hard max 5); table completion alone does NOT satisfy diagnostic review.",
      "- G2 Transfer → transfer_prompt row when Transfer Required. S78-T-041: self-study culminating/final activity also commissions compact transfer_prompt production when pedagogically appropriate, even when Study tips / page closure is present (closure ≠ transfer).",
      "- G3 Independent judgement (Evaluate / DLA-WB-28) → template|task_cards separate from consolidation_summary; expected_output names memo artefact; scaffold only per IFP-06.",
      "- G4 Worked analytic pass (Analyse / DLA-WB-27) → worked_example|modelling_note with purpose worked analytic pass BEFORE analysis_table; fact→analytical lens→mechanism→draft cell walkthrough; analysis_table spec requires ≥1 exemplar row or hint column.",
      "- G5 Guided judgement → analysis_table|decision_table|comparison_table with ≥1 partial exemplar row or hint column + scoring guide.",
      "- Evaluate completion pack (DLA-WB-31): criteria exposition (≥3 dimensions) + scenario (≥2 perspectives) + worked judgement weak vs strong + guided table + independent judgement + checklist + transfer_prompt — consolidation_summary alone does NOT satisfy Evaluate. Guided judgement alone CANNOT terminate Evaluate.",
      "- Apply (DLA-WB-23): when archetype=Apply and KM-T03 (process ≥3 steps) list worked_example with stepped think-aloud before independent practice.",
      "- Depth discipline (DLA-WB-30): every R-function Material specification includes depth_floor: L3 content obligations — thin type-only specs are depth FAIL.",
      "- Anti-emission (DLA-WB-29): transfer_or_application_task without transfer_prompt; verification implied only by complete the table; consolidation_summary as sole Evaluate capstone evidence; prompt_set substituting for checklist — add Materials before JSON emit (do not replan beats).",
      "- PRE-EMIT GATE: before JSON emit, add missing obligation rows when G-gates/DLA-WB apply (do not replan beats or page-level archetypes).",
      "",
      "Self-study workbook contract (DLA-WB) — mandatory rows as explicit required_materials when applied:",
      "- DLA-WB-01: resource_intent self_study_workbook, session_duration_target_minutes (~" +
        duration.target +
        "), consolidation_requirement, workbook_contract_applied: true (optional generation_notes only if already valid on the page schema; do not invent new top-level output keys).",
      "- DLA-WB-02: Every activity maps ≥1 learning outcome ID; final capstone maps ≥3 distinct outcome IDs when ≥3 outcomes available.",
      "- DLA-WB-03: Sum of activity duration_minutes " +
        duration.bandLow +
        "–" +
        duration.bandHigh +
        " unless an explicit brief exception is recorded.",
      "- DLA-WB-04/17: solo-completable — individual grouping; omit facilitator_moves/failure_mode.",
      "- DLA-WB-06: session MUST NOT be table-only — ≥2 type families; *_table activities need ≥1 non-table type.",
      "- DLA-WB-06a: ≥1 explicit required_materials row whose type is a table/reference family token on a practice-oriented activity (not capstone alone); specification describes learner-work columns; coexist with DLA-WB-08 and DLA-WB-12.",
      "- DLA-WB-07/10/11: ≥1 text exposition; ≥2 activities with practice-oriented material purpose; ≥2 activities with task_cards, prompt_set, and/or checklist.",
      "- DLA-WB-08: ≥1 early-session activity MUST list worked_example AND sample_output (or modelling_note); stepped expert completion; learner_task instructs study before practice; capstone template does NOT satisfy.",
      "- DLA-WB-12: final capstone MUST list consolidation_summary (≥80 words, ≥3 key ideas); prompt_set does NOT replace it.",
      "- DLA-WB-13/05/16: last integrative capstone expected_output = synthesis artefact; capstone maps ≥3 outcomes when ≥3 exist; must NOT enumerate all prior *_table types as primary deliverables.",
      "- DLA-WB-15: ranking/compare tasks require learner-generated ranking and justification; forbid pre-supplied scores.",
      "- DLA-WB-18: when case/scenario/household language is used, same activity_id MUST include type scenario (≥2 named cases); task_cards MUST NOT be the sole carrier.",
      "- DLA-WB-22: when archetype=Evaluate include criteria, scenario, worked judgement, guided table, independent judgement, checklist, transfer.",
      "",
      "Activity pattern mix, grouping, difficulty, and coverage breadth follow the workflow step options when present."
    ].join("\n");
  }

  function assembleDlaCanonicalContract(ctx) {
    var n = normalizeDlaAssembleCtx(ctx);
    var sections = {
      role: buildDlaSectionRole(),
      inputs: buildDlaSectionInputs(),
      sources: buildDlaSectionSources(),
      production: buildDlaSectionProduction(n),
      task_inputs: buildDlaSectionTaskInputs(),
      commissioning: buildDlaSectionCommissioning(n),
      evidence: buildDlaSectionEvidence(),
      providers: buildDlaSectionProviders(),
      overlay: buildDlaSectionOverlay(n),
      output: buildDlaSectionOutput(n),
      examples: buildDlaSectionExamples(n)
    };
    var text = DLA_CANONICAL_SECTION_IDS.map(function (id) {
      return sections[id];
    }).join("\n\n");
    return {
      text: text,
      sections: sections,
      sectionOrder: DLA_CANONICAL_SECTION_IDS.slice(),
      headings: DLA_CANONICAL_SECTION_HEADINGS,
      version: CONTRACT_VERSION,
      multiplicity: 1,
      liveProduction: false
    };
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    DLA_P02_FINAL_SILENT_PRE_EMIT_GATE: DLA_P02_FINAL_SILENT_PRE_EMIT_GATE,
    buildInstructionalArchetypePlanningGuidance: buildInstructionalArchetypePlanningGuidance,
    DLA_CANONICAL_SECTION_IDS: DLA_CANONICAL_SECTION_IDS,
    DLA_CANONICAL_SECTION_HEADINGS: DLA_CANONICAL_SECTION_HEADINGS,
    assembleDlaCanonicalContract: assembleDlaCanonicalContract,
    listDlaPresentationMaterialTypes: listDlaPresentationMaterialTypes,
    buildDlaMaterialTypePresentationVocabularyBlock: buildDlaMaterialTypePresentationVocabularyBlock,
    buildDlaWorkbookOverlayBlock: buildDlaWorkbookOverlayBlock,
    resolveDlaWorkbookDurationTarget: resolveDlaWorkbookDurationTarget,
    buildDlaSectionRole: buildDlaSectionRole,
    buildDlaSectionInputs: buildDlaSectionInputs,
    buildDlaSectionSources: buildDlaSectionSources,
    buildDlaSectionProduction: buildDlaSectionProduction,
    buildDlaSectionTaskInputs: buildDlaSectionTaskInputs,
    buildDlaSectionCommissioning: buildDlaSectionCommissioning,
    buildDlaSectionEvidence: buildDlaSectionEvidence,
    buildDlaSectionProviders: buildDlaSectionProviders,
    buildDlaSectionOverlay: buildDlaSectionOverlay,
    buildDlaSectionOutput: buildDlaSectionOutput,
    buildDlaSectionExamples: buildDlaSectionExamples
  };
});
