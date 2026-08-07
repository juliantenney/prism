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

  var CONTRACT_VERSION = "58-DLA-PARTIAL-3";

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
      "### PRE-DESIGN: attachment inventory and evidence roles (do this first)",
      "Before designing any activity, inspect material attached or introduced in this Copilot conversation:",
      "1) Decide for each attachment whether it is supporting knowledge, learner evidence, or both.",
      "2) Inventory the source units actually available (titles, documents, sections, datasets, passages, or other identifiable units).",
      "3) Only then design activities. Do not invent related but unattached works. Do not reconstruct unavailable sources from model memory.",
      "4) If learner-evidence material is present, optionally record that decision on the page as generation_notes.learner_evidence_attachments { present: true, role: \"learner_evidence\"|\"supporting_knowledge\"|\"both\", inventoried_units: [\"...\"] } — DLA-local, optional, backward-compatible; omit when no learner-evidence attachments apply.",
      "",
      "### Evidence-decision planning order (every activity — before finalising learner_task / required_materials)",
      "1) Determine what the learner must produce.",
      "2) Determine whether that production requires inspecting evidence (observations, quotations, data, cases, images, source properties such as imagery/tone/structure/form, or supplied examples used as evidence).",
      "3) If yes: set evidence_decision.required true; create at least one genuine evidence provider (not teaching text alone; not a response scaffold alone); list it in provider_material_ids; keep teaching and response scaffolds separate; attach evidence_requirement only to provider row(s).",
      "4) If no: set required false; ensure learner_task, expected_output, evidence_use_prompt, and checklist/workspace specs do not require quotations, source examples, observations, data, cases, images, or other inspectable evidence.",
      "5) Internal consistency check before emit: no required:false activity may ask learners to analyse, interpret, compare, classify, or evaluate supplied examples/source properties; no required:true activity may lack a genuine provider.",
      "",
      "### Resource-level source-use commitment",
      "When attachments are intended as learner evidence:",
      "- Make that material central to activities whose disciplinary purpose is to analyse, interpret, compare, classify, evaluate, or draw conclusions about it.",
      "- Use provenance conversation_attachment for those providers; name inventoried units in purpose/specification/processing_notes.",
      "- Do not avoid source use by substituting thematic summaries, generic simulations, teaching-only examples, pre-interpreted observations, or generated viewpoints without underlying source evidence.",
      "- Orientation/prerequisite teaching may remain source-free.",
      "- system_generated_simulation remains valid for genuinely different evidential needs or when no suitable source material is available.",
      "- Mixed evaluation: attached source excerpts and generated viewpoints must be separate providers with honest provenance; provider_material_ids lists both.",
      "- If no learner-evidence material is available: continue with normal system-generated evidence decisions; do not fail ordinary workflows; do not invent primary/copyrighted/proprietary source content; do not force irrelevant attachments into activities.",
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
      "- include required_materials where applicable",
      "- each activities[] row must include evidence_decision { required, reason, provider_material_ids[] }",
      "- optional only on evidence-provider required_materials[] rows: evidence_requirement object for evidence-dependent reasoning tasks",
      "- optional generation_notes.learner_evidence_attachments when learner-evidence attachments were inventoried (see PRE-DESIGN)",
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
      "Evidence-centred requirement semantics (optional, backward-compatible on required_materials[] rows):",
      '- Use evidence_requirement only when the learner must inspect evidence to complete the task (interpret/diagnose/analyse/compare/evaluate/justify from observations).',
      '- evidence_requirement.kind: "learner_evidence"',
      "- evidence_requirement.purpose: why this evidence is needed for the task",
      "- evidence_requirement.learner_action: what the learner must do with the evidence",
      "- evidence_requirement.observable_features: non-empty string array of particulars learners must inspect",
      "- Optional refinements when needed: minimum_suitable_form, processing_notes, provenance, disclosure_constraint, evidence_layout, fixed_observation_fields, learner_response_fields.",
      "- Evidence providers supply observations/data/cases/source extracts. Response scaffolds (analysis_table, decision_table, comparison_table, template, etc.) organise learner analysis.",
      "- Referencing or recording evidence in a scaffold does NOT make that scaffold an evidence provider.",
      '- Attach evidence_requirement only to evidence-provider material(s) named in evidence_decision.provider_material_ids.',
      "- Prefer a separate evidence provider plus an ordinary response scaffold when evidence has already been supplied elsewhere.",
      "- Source preference: when authoritative source material is available in this Copilot conversation and the activity requires reasoning about properties of that material (wording, structure, form, values, visual features, claims, provenance), use provenance conversation_attachment. Do not substitute system_generated_simulation, thematic summaries, explanatory teaching, or pre-interpreted observations for that source-bound need.",
      "- system_generated_simulation remains valid when no suitable source-bound material is available, or when the required evidence is legitimately generated (simulated dataset, case, experimental observation, scenario).",
      "- Provider-role closure: a material whose primary purpose is teaching/explaining a concept must not carry evidence_requirement unless it also supplies clearly distinguished, directly inspectable evidence. For evidence_layout separate_provider, keep teaching text, evidence provider, and response scaffold as distinct rows.",
      "- Resource-level consistency: once conversation_attachment evidence is established for named source material, later evidence-dependent activities concerning that same material should continue with conversation_attachment unless DLA states an explicit pedagogical reason why generated evidence is necessary.",
      '- Use evidence_layout: "combined_evidence_workspace" only when that SAME material genuinely contains both fixed evidence columns and learner-editable response columns, is listed in provider_material_ids, and both fixed_observation_fields and learner_response_fields are non-empty string arrays naming those columns (cell values remain blank for learners).',
      "- For conversation_attachment combined_evidence_workspace rows: fixed_observation_fields must name the source-native evidence field(s) learners will inspect (quotation, extract, value, observation, clause, or equivalent)—not only poem/title/category/source-name labels. Include that evidence content field in the declaration so GAM does not have to infer it.",
      "- Do not attach combined_evidence_workspace to a response scaffold when a separate provider already fulfils the evidence requirement.",
      '- Controlled provenance values: "system_generated_simulation" (generated instructional evidence requiring simulation honesty) or "conversation_attachment" (authoritative primary/source material available in the current Copilot conversation).',
      "- Canonical source-bound provenance is conversation_attachment only in this architecture (files attached in Copilot; Prism has no upload UI or persisted source store). Do not invent parallel author_supplied_source semantics here.",
      "- Infer evidence dependency from current learner-production obligations: learner_task, expected_output, evidence_use_prompt, and response/workspace/checklist specifications that require source use—not from isolated keywords alone.",
      "- activity_preamble, intellectual_coherence_bridge, general rationale, and references to evidence used in later activities may provide soft context but must not independently make an activity evidence-dependent.",
      "- Activities that require learners to interpret language, form, structure, imagery, tone, data, cases, observations, supplied examples used as evidence, or other source properties, or that require supporting evidence for claims, must set evidence_decision.required true.",
      "- Also treat as evidence-dependent: identifying examples/observations from a named source; classifying quotation or source-evidence details; claims that must be supported by a text, dataset, case, image, or other supplied material.",
      "- Do not mark ordinary conceptual explanation or contextual preparation activities as evidence-required merely because they mention examples, prepare learners for later evidence use, or abstractly compare/classify taught concepts.",
      "- For conversation_attachment providers: name the actual available source unit/excerpt required in purpose, specification, or processing_notes; keep selections proportionate to duration; require directly inspectable excerpts/quotations/values—not summary packs, thematic summaries, or extract references alone.",
      "- When an activity needs both authoritative source evidence and generated cases/viewpoints, use separate provider materials with honest provenance; list both in evidence_decision.provider_material_ids.",
      "- Evaluative activities may reuse a bounded set of exact evidence encountered earlier; they must not receive a completed interpretation or preferred conclusion.",
      "- Supporting-knowledge attachments may inform teaching specs without becoming evidence_requirement providers.",
      "- Keep evidence requirements proportionate to duration, prerequisite knowledge, and cognitive load.",
      "- Do not generate final evidence bodies here; GAM fulfils required materials.",
      "- If evidence_decision.required is true, provider_material_ids must reference required_materials rows that include evidence_requirement (one-to-one agreement).",
      "- When evidence_decision.required is true, any pre-task teaching, worked_example, or modelling_note must not analyse the focal evidence provider, answer the focal learner task, state a preferred mechanism/option/interpretation, or provide the provisional/final judgement learners must derive.",
      "- A pre-task worked example may remain if it uses a distinct analogous case, demonstrates only the reasoning procedure, or models one reasoning step without resolving the focal question.",
      "- Known boundary: Prism cannot read Copilot attachment bytes and does not persist uploads; exact excerpt-to-file verification is out of scope. Absence of attachments must not fail ordinary workflows.",
      "",
      "### FINAL PRE-EMIT AUDIT (internal — do not write prose outside the JSON)",
      "Before emitting JSON, audit silently:",
      "- If learner evidence was attached, which activities use it with conversation_attachment providers?",
      "- Do all analytical/comparative/evaluative activities about that material have conversation_attachment providers (not summaries/simulations alone)?",
      "- Does every required:false activity avoid source-dependent learner production?",
      "- Are only genuinely available/inventoried source units named?",
      "- Are mixed-provenance materials separated into distinct providers?",
      "Fix inconsistencies before emit. Do not add audit prose outside the required JSON artefact.",
      "",
      "### FINAL PER-ACTIVITY EVIDENCE-DECISION CONSISTENCY AUDIT (after drafting each activity — before emit)",
      "After drafting each activity — not only during earlier Evidence-decision planning — cross-check evidence_decision.required against learner_task, expected_output, evidence_use_prompt, and evidence-dependent required_materials instructions:",
      "1) If evidence_decision.required is false:",
      "   - provider_material_ids must be empty;",
      "   - no required_materials row may carry evidence_requirement;",
      "   - learner_task, expected_output, evidence_use_prompt, and relevant material purpose/specification must not ask the learner to analyse or inspect supplied evidence, quote or cite supplied sources, use examples as evidence, or interpret supplied texts, data, cases, or observations as evidence.",
      "2) If learner_task, expected_output, evidence_use_prompt, or evidence-dependent material instructions DO require inspection or use of supplied evidence:",
      "   - evidence_decision.required must be true;",
      "   - at least one genuine evidence provider material must exist;",
      "   - provider_material_ids must list those providers correctly;",
      "   - each listed provider row must include an explicit evidence_requirement.",
      "3) Perform this consistency audit after drafting the activity. Do not emit an activity where required:false contradicts evidence-dependent learner production wording.",
      "",
      "Invalid / valid contrast (domain-neutral):",
      "INVALID — must not emit:",
      '- evidence_decision.required: false',
      '- learner_task: "Analyse the supplied case evidence and support your judgement with examples."',
      "VALID options:",
      "A) Set evidence_decision.required true; add a genuine evidence provider with evidence_requirement; list its material_id in provider_material_ids; OR",
      "B) Rewrite learner_task / expected_output / evidence_use_prompt / material instructions so no supplied evidence must be inspected or used.",
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
      '"evidence_decision": { "required": true, "reason": "Learner must inspect observable evidence before judging.", "provider_material_ids": ["A1-M1"] },',
      '"required_materials": [',
      "  {",
      '    "material_id": "A1-M1",',
      '    "material_type": "scenario",',
      '    "purpose": "Provide contrastive evidence cases for diagnosis.",',
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
      "]",
      "  }",
      "]",
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
