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

  var CONTRACT_VERSION = "76-DLA-PARTIAL-6";

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

  function buildDlaPageEnrichContractBlock() {
    return [
      "",
      "### Sprint 58 vNext DLA partial-page contract (required)",
      "",
      "### Attachment inventory and source-use (before designing activities)",
      "Before designing activities, inspect material attached or introduced in this Copilot conversation. Classify each attachment as supporting knowledge, learner evidence, or both. Inventory the source units actually available (titles, documents, sections, datasets, passages, or other identifiable units). Do not invent related but unattached works. Do not reconstruct unavailable sources from model memory.",
      "If attachments are learner evidence, make that material central to activities whose disciplinary purpose is to analyse, interpret, compare, classify, evaluate, or draw conclusions about it. Use provenance conversation_attachment; name inventoried units in purpose, specification, or processing_notes; require directly inspectable excerpts, quotations, or values—not summary packs, thematic summaries, or extract references alone. Do not substitute generic simulations, teaching-only examples, pre-interpreted observations, or generated viewpoints without underlying source evidence. Later evidence-dependent activities concerning that same material should continue with conversation_attachment unless DLA states an explicit pedagogical reason why generated evidence is necessary.",
      "Orientation/prerequisite teaching may remain source-free. Supporting-knowledge attachments may inform teaching specs without becoming evidence_requirement providers. system_generated_simulation remains valid for genuinely different evidential needs or when no suitable source material is available. Mixed attached excerpts and generated viewpoints must be separate providers with honest provenance; provider_material_ids lists both.",
      "If no learner-evidence material is available: continue with normal system-generated evidence decisions; do not fail ordinary workflows; do not invent primary/copyrighted/proprietary source content; do not force irrelevant attachments into activities. Known boundary: Prism cannot read Copilot attachment bytes and does not persist uploads; exact excerpt-to-file verification is out of scope.",
      "If learner-evidence material is present, optionally record generation_notes.learner_evidence_attachments { present: true, role: \"learner_evidence\"|\"supporting_knowledge\"|\"both\", inventoried_units: [\"...\"] } — DLA-local, optional, backward-compatible; omit when no learner-evidence attachments apply.",
      "",
      "### Activity commissioning order (every activity)",
      "1) Define the learner production obligation (expected_output and learner_task intent).",
      "2) Decide whether separate task operands/stimuli are required. A task input is the particular content upon which the learner performs the required operation (solve, calculate, classify, diagnose, analyse, compare, interpret, evaluate, transform, or construct from supplied particulars) when not already fully contained in learner_task. Set task_material_decision. If separate_inputs_required is true, commission those operands in required_materials and list only their material_ids in task_input_material_ids. If false, ids must be empty; teaching/model/workspace/scaffold may still be commissioned. Roles (not type-absolute): operand/stimulus = problem, case, data, values, source, passage, object or other particulars acted upon; model = shows how; workspace = place/structure to record or manipulate, including blank tables; scaffold = prompts, supports or checks. Used during the activity ≠ automatically a task input. Absence test: if removing it leaves the learner without the particulars needed to operate, it is a task input; if they lose only an example of how, a place to write, guidance, or a checklist, it is not. Listing a task input does not set evidence_decision.required; P01 and P02 remain independent.",
      "3) Commission every required material. required_materials must be an array. For every row: non-empty purpose (the job of this material) and non-empty specification (binding GAM bounds: content, load-bearing count/variation/constraints/exclusions; not body prose). specification must not be only the material_type token.",
      "4) Independently decide whether any task input functions as particulars-as-grounds. DLA owns evidence_decision.required. true means the learner cannot complete this activity’s production without inspecting particulars (observations, values, extracts, features, conditions, cases-as-data) as grounds for inference, interpretation-from-particulars, comparison-as-evaluation, diagnosis, or substantiation. false means that epistemic use is not required: it does not mean no materials, no operands, and no generated practice. Procedural operands may be task inputs (task_material_decision true) with required: false. Provenance is not this boolean. Correct evidence classification does not by itself make the production sufficient for the mapped LO. Decide from the production’s epistemic role — not from nouns, activity_preamble, intellectual_coherence_bridge, or later-activity mentions.",
      "5) If evidence_decision.required is true: list those task-input rows in provider_material_ids and attach evidence_requirement on those rows. If false: omit providers and evidence_requirement.",
      "",
      "Output a partial v2 page artefact for DLA-owned fields only.",
      "Do not return a full-page replay. Do not emit standalone learning_activities artefacts.",
      "",
      "Required top-level envelope:",
      '- artifact_type: "page"',
      '- schema_version: "2.0.0"',
      "- assembly_state.current_stage: \"dla\"",
      '- assembly_state.enriched_by must include "dla"',
      "",
      "Required payload:",
      "- activities[] (DLA-owned subset only)",
      "- each activities[] row must include activity_id",
      "- each activities[] row must include title (final learner-facing activity name — replaces Episode Plan provisional title)",
      '- include DLA-owned instructional fields such as learner_task, expected_output, activity_preamble, intellectual_coherence_bridge',
      "- DLA-owned cognition/scaffold fields (reasoning_orientation, self_explanation_prompt, etc.)",
      "- intellectual_coherence_bridge REQUIRED on every activity including A1: concise cumulative-sequence prose distinct from activity_preamble. A1 connects page orientation/learning purpose/prior knowledge to the first activity (no preceding-activity reference). A2+ carries prior learning, reasoning, evidence, production or capability into the current demand. Forbid scheduling-only or Activity-N-follows-Activity-M text.",
      "- each activities[] row must include task_material_decision { separate_inputs_required, task_input_material_ids[] }",
      "- required_materials must be an array on every activity (empty allowed when separate_inputs_required is false)",
      "- every required_materials[] row must include non-empty purpose and specification (specification must not be only the material_type token)",
      "- each activities[] row must include evidence_decision { required, reason, provider_material_ids[] }",
      "- optional only on evidence-provider required_materials[] rows: evidence_requirement object for evidence-dependent reasoning tasks",
      "- optional generation_notes.learner_evidence_attachments when learner-evidence attachments were inventoried (see attachment inventory and source-use)",
      "",
      activityTitleGuidanceBlock(),
      "",
      "Verification checklist diagnostic specification (when required_materials includes type checklist):",
      "- Specify 3–4 diagnostic review criteria (hard maximum 5) in the checklist specification.",
      "- Each criterion must align with the activity task, expected_output, and mapped learning outcome(s).",
      "- Each criterion must name a meaningful dimension of response quality and the response features learners should examine.",
      "- Specifications must support criterion-specific correction (not generic tick-box completion).",
      "- Do NOT write learner-facing criterion questions, why-it-matters prose, feature lists, or repair actions — GAM owns those.",
      "",
      "Evidence-provider authoring (only when evidence_decision.required is true):",
      "- evidence_requirement.learner_action: what the learner must do with the particulars.",
      "- evidence_requirement.observable_features: non-empty string array of particulars learners must inspect.",
      "- When evidence_decision.required is true, any pre-task teaching, worked_example, or modelling_note must not analyse the focal evidence provider, answer the focal learner task, state a preferred mechanism/option/interpretation, or provide the provisional/final judgement learners must derive. A pre-task worked example may remain if it uses a distinct analogous case, demonstrates only the reasoning procedure, or models one reasoning step without resolving the focal question.",
      '- Provenance: "system_generated_simulation" (generated instructional evidence requiring simulation honesty) or "conversation_attachment" (authoritative primary/source material available in the current Copilot conversation).',
      "- Teaching or explanatory material is not a provider unless it also supplies clearly distinguished, directly inspectable evidence. Recording evidence in a response scaffold (analysis_table, decision_table, comparison_table, template, etc.) does not make that scaffold the evidence provider. Prefer a separate evidence provider plus an ordinary response scaffold.",
      "- evidence_layout separate_provider: keep teaching text, evidence provider, and response scaffold as distinct rows. Use combined_evidence_workspace only when that SAME listed material genuinely contains both fixed evidence columns and learner-editable response columns, and both fixed_observation_fields and learner_response_fields are non-empty string arrays naming those columns (cell values remain blank for learners). For conversation_attachment combined_evidence_workspace rows: fixed_observation_fields must name the source-native evidence field(s) learners will inspect (quotation, extract, value, observation, clause, or equivalent)—not only poem/title/category/source-name labels.",
      "- Do not generate final evidence bodies here; GAM fulfils required materials.",
      "",
      "Explicitly forbidden:",
      "- full-page replay",
      "- shell fields: page-level title, audience, page_profile, learning_outcomes, episode_plans",
      "  (page-level title is not activities[].title — activity titles are required DLA-owned fields)",
      "- materials[].body or any GAM material body content",
      "- page_synthesis",
      "- learning_sequence / assessment_check",
      "- preserving, reconstructing, or copy-forwarding non-DLA stage fields",
      "",
      "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
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

  function buildCanonicalDlaPageShapeSnippet() {
    return [
      "Canonical DLA partial activity shape (required fields per activity):",
      "",
      '"artifact_type": "page"',
      '"schema_version": "2.0.0"',
      '"assembly_state": { "current_stage": "dla", "enriched_by": ["dla"] }',
      "// Optional when learner-evidence attachments were inventoried:",
      '"generation_notes": { "learner_evidence_attachments": { "present": true, "role": "learner_evidence", "inventoried_units": ["Unit title A", "Unit title B"] } },',
      '"activities": [',
      "  {",
      '    "activity_id": "A1",',
      '    "title": "Map inflation cause chains",',
      '"learner_task": "Substantive learner-facing task prose tied to the LO and episode beats."',
      '"expected_output": "Quality-threshold prose describing what good evidence looks like."',
      '"activity_preamble": "Learner-facing orientation for this activity."',
      '"task_material_decision": { "separate_inputs_required": true, "task_input_material_ids": ["A1-M1"] },',
      '"required_materials": [',
      "  {",
      '    "material_id": "A1-M1",',
      '    "material_type": "scenario",',
      '    "purpose": "Provide contrastive evidence cases for diagnosis.",',
      '    "specification": "Two short contrastive cases with observable measurements; do not state the conclusion.",',
      '    "instructional_function": "guided_reasoning",',
      '    "plan_beat_index": 3,',
      '    "evidence_requirement": {',
      '      "kind": "learner_evidence",',
      '      "purpose": "Provide inspectable observations needed for diagnosis.",',
      '      "learner_action": "Inspect the observations and justify the likely diagnosis.",',
      '      "observable_features": ["pattern in observed values", "contrast between two cases"],',
      '      "minimum_suitable_form": "compact comparison table",',
      '      "processing_notes": "For system_generated_simulation, keep to a short learner-ready table; for conversation_attachment, require attributed inspectable excerpts—not summary/reference packs.",',
      '      "provenance": "system_generated_simulation",',
      '      "disclosure_constraint": "Do not state the intended conclusion before learner response.",',
      '      "evidence_layout": "separate_provider"',
      "    }",
      "  }",
      "],",
      '"evidence_decision": { "required": true, "reason": "Learner must inspect observable evidence before judging.", "provider_material_ids": ["A1-M1"] }',
      "  }",
      "]",
      "",
      "Contrast: practice operands remain in task_input_material_ids with evidence_decision.required false and no evidence_requirement.",
      "",
      activityTitleGuidanceBlock(),
      "",
      buildInstructionalArchetypePlanningGuidance(),
      "",
      "Forbidden in DLA partial:",
      "- full page shell fields (page-level title, audience, page_profile, learning_outcomes, episode_plans)",
      "- omitting activities[].title",
      "- materials[].body",
      "- page_synthesis",
      "- learning_sequence",
      "- full-page replay"
    ].join("\n");
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    buildDlaPageEnrichContractBlock: buildDlaPageEnrichContractBlock,
    buildCanonicalDlaPageShapeSnippet: buildCanonicalDlaPageShapeSnippet,
    buildInstructionalArchetypePlanningGuidance: buildInstructionalArchetypePlanningGuidance
  };
});
