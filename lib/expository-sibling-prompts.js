/**
 * Sprint 85 WP3 — Expository sibling pedagogical prompt bodies.
 * Pedagogically independent of Interactive EP/DLA/GAM prompts.
 * Interactive pack promptTemplate strings must remain unmodified.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrismExpositorySiblingPrompts = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /**
   * Which established domain guidance each Expository stage consumes and why.
   * Packs are not duplicated — General + selected-domain prompt-rules
   * reach stages via WorkflowGenerationContext + runtime guidance injection
   * (Expository-filtered composition; Interactive activity rhetoric excluded).
   */
  var DOMAIN_GUIDANCE_CONSUMPTION = {
    generate_learning_content: {
      consumes: ["general", "selected_domain"],
      why:
        "GLC must ground explanatory richness in source and obey domain instructional grounding / structured-output rules."
    },
    define_learning_outcomes: {
      consumes: ["general", "selected_domain"],
      why:
        "LO must stay artefact-aware and domain-consistent while expressing understanding-oriented targets without Interactive evidence obligations."
    },
    model_knowledge: {
      consumes: ["general", "selected_domain"],
      why:
        "Shared MK step; domain grounding still applies. No Expository-specific template (S84: no material MK difference)."
    },
    expository_journey_plan: {
      consumes: ["general", "selected_domain"],
      why:
        "EJP allocates explanatory attention and journey structure; domain principles shape what counts as coherent progressive understanding in the subject."
    },
    expository_development: {
      consumes: ["general", "selected_domain"],
      why:
        "XD chooses section-level explanations and commissions; domain rules constrain claim warrant, representation honesty, and instructional depth."
    },
    expository_materials: {
      consumes: ["general", "selected_domain"],
      why:
        "XM realises commissioned bodies with source/formal fidelity; domain prompt rules govern grounding and consistency."
    },
    design_page: {
      consumes: ["general", "selected_domain"],
      why:
        "Design Page transports thin orientation/synthesis; domain clarity/output-purpose rules prevent silent redesign."
    }
  };

  var FENCE =
    "Output requirements (strict — fenced JSON block only):\n" +
    "- Return exactly one markdown fenced JSON block opened with ```json and closed with ```\n" +
    "- Pretty-print JSON with 2-space indentation and line breaks\n" +
    "- Do NOT emit minified single-line JSON\n" +
    "- Do NOT include prose, headings, or commentary before the fenced block\n";

  var JUDGEMENT_ELABORATION =
    "Judgement rule (not a checklist): for each idea, ask which kind of elaboration — if any — will make this particular thing intelligible to this particular audience. Include only what earns its place. Do not systematically add examples, non-examples, misconceptions, analogies, evidence, applications, boundary cases, graphics, or reflection prompts in every section.";

  var GLC = [
    "Context:",
    "You may be provided with topic, audience, level, optional source_material / normalized_content, and Expository Resource intent.",
    "",
    "Task:",
    "Generate or extend teaching-ready learning_content as the explanatory richness spine for an Expository Resource (reading/viewing intellectual chapter).",
    "",
    "Authority:",
    "- Prefer provided source / normalized_content as factual base; do not invent unsupported claims.",
    "- Develop rich explanatory raw material that downstream Model Knowledge, Learning Outcomes, Expository Journey Plan, and Expository Development can draw on.",
    "- You do NOT design the final learner-facing chapter journey (section order, whole-resource progression, or extent allocation) — that is owned later by Expository Journey Plan.",
    "- Preserve useful explanatory possibilities when present in source or naturally warranted by the topic. A repertoire exists (explanation, example/non-example, case, evidence, comparison, application, analogy, misconception, boundary case, worked demonstration, relationship, source-grounded context) — use it selectively.",
    "- " + JUDGEMENT_ELABORATION,
    "- Avoid generic content inflation and filler summaries.",
    "- Do NOT design Interactive activities, workspaces, evidence production, learner_task, or expected_output.",
    "",
    "Instructions:",
    "- Organise clear sections as teaching-ready raw material (not as the final Expository Journey Plan).",
    "- State a governing question or central inquiry in the title or first section when possible.",
    "- Adapt depth and terminology to audience/level.",
    "- Apply step notes when provided: {{stepNotes}}",
    "",
    FENCE,
    "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: learning_content",
    "- JSON top-level keys: title (string), sections (array of {title, content}), key_concepts (array of strings), examples (array of {title, description}; may be empty when none are warranted)",
    "- sections: ordered teaching-ready material — not Normalize-style source-cleaning headings and not the final chapter plan",
    "- Return the fenced block first, then the single STEP N OUTPUT footer line."
  ].join("\n");

  var LO = [
    "Context:",
    "You are designing learning outcomes for an Expository Resource from a structured knowledge_model (and learning_content context when present).",
    "",
    "Task:",
    "Generate clear, observable learning outcomes that state the intended understanding / competence the chapter aims at.",
    "",
    "Expository orientation:",
    "- Outcomes target what learners should understand, discriminate, relate, qualify, or be able to use intellectually after reading/viewing.",
    "- Use precise, assessable language where possible, but do NOT require Interactive evidence production, artefacts to submit, workspace behaviour, or activity performance merely because Interactive LO prompting sometimes does.",
    "- Prefer understanding/competence wording appropriate to exposition (explain, distinguish, relate, justify, apply conceptually) over production-obliged workshop tasks.",
    "- Do NOT design exposition sections, journey order, or material commissions.",
    "",
    "Instructions:",
    "- Align each outcome to knowledge_model concepts",
    "- Set cognitive demand to learner level, scope, and cognitive emphasis",
    "- Balanced coverage without redundancy; keep outcomes realistically achievable for the stated Scale/scope",
    "- Keep outcomes grounded in MK / source / learning_content when present; do not invent unsupported targets",
    "",
    "Constraints:",
    "- Learner level: {{option:learnerLevel}}",
    "- Number of outcomes: {{option:numberOfOutcomes}}",
    "- Cognitive emphasis: {{option:cognitiveEmphasis}}",
    "- Scope: {{option:scope}}",
    "- Step notes: {{stepNotes}}",
    "",
    FENCE,
    "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: learning_outcomes",
    "- JSON top-level keys: learning_outcomes (required array), plus optional learner_level, scope, alignment_notes",
    "- Each learning_outcomes entry must include statement, related_concepts, cognitive_level, and notes where needed",
    "- Return the fenced block first, then the single STEP N OUTPUT footer line."
  ].join("\n");

  var EJP = [
    "Context:",
    "You are planning an Expository Journey Plan for a reading/viewing Expository Resource.",
    "Authoritative inputs (use all that are present): learning_outcomes, knowledge_model, learning_content (explanatory richness spine — do not plan from MK/LO alone when learning_content is available), audience, and Scale/scope (extent).",
    "",
    "North star:",
    "Progressively construct a coherent mental model — connected, discriminating, qualified, usable understanding.",
    "",
    "Governing question (must answer):",
    "What intellectual journey will allow this audience to construct the understanding represented by these Learning Outcomes?",
    "",
    "You own:",
    "- Ordered learner-facing exposition sections as the primary structure",
    "- Progressive construction of understanding (not a table of contents; not Interactive episode beats; not writing the full exposition)",
    "- Whole-resource relationships: dependency, contrast, recurrence, qualification, synthesis, representation needs",
    "- Allocation of explanatory attention under available content extent",
    "",
    "Extent (planning constraint — S85-D05):",
    "- Scope / scale expresses desired content extent. Use any provided extent / words-equivalent / reading-time / qualitative hint as an approximate planning constraint on coverage, emphasis, depth, elaboration, and representation — not as an instruction to produce N words of prose.",
    "- Decide what conceptual territory can be treated adequately; relative section emphasis; where deeper explanation is warranted; how much elaboration is affordable; where a representation or synthesis move deserves scarce attention.",
    "- A shorter resource must make different intellectual choices from a longer one where appropriate — not merely request shorter paragraphs.",
    "- Word count is not a prose quota. Do not pad or truncate. Diagrams, tables, equations, worked examples and cases also consume learner attention.",
    "- Preserve qualitative scope meaning when no numeric intent was supplied; do not invent false precision.",
    "",
    "Reason about (as judgements, not a fixed sequence template):",
    "- conceptual dependency and learner prior knowledge",
    "- explanatory leverage and cognitive difficulty",
    "- productive contrast and progressive integration",
    "- connections, recurrence, qualification, synthesis",
    "- appropriate representation only where it earns its place",
    "- available content extent",
    "",
    JUDGEMENT_ELABORATION,
    "",
    "Field guidance:",
    "- elaboration_intentions[] and representation_needs[] are selective planning labels for what this section may need — leave empty when none are warranted; do not populate a full repertoire on every section.",
    "- connections[] / synthesis should make whole-resource relationships explicit so later Development can keep one intellectual journey.",
    "",
    "Must not:",
    "- Emit Interactive activity beats, workspaces, evidence requirements, learner_task, expected_output, or material bodies",
    "- Reduce the plan to headings/topic coverage of LOs or MK concept lists",
    "- Impose a fixed universal pedagogical sequence template",
    "- Write the full chapter prose (that is later Development/Materials work)",
    "",
    "Step notes: {{stepNotes}}",
    "",
    FENCE,
    "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: expository_journey_plan",
    "- artifact_type must be \"expository_journey_plan\"",
    "- Include: title, audience, journey_intent, optional extent {scope_text, words_equivalent?, reading_minutes?, interpretation, qualitative_hint}, ordered sections[]",
    "- Each section: section_id, title, purpose, knowledge_focus, conceptual_move, dependencies[], lo_refs[], elaboration_intentions[], representation_needs[], connections[], synthesis, order",
    "- sections[] order is the authoritative intellectual journey",
    "- Return the fenced block first, then the single STEP N OUTPUT footer line."
  ].join("\n");

  var XD = [
    "Context:",
    "You are developing each section of an Expository Journey Plan without replanning the whole-resource journey.",
    "Authoritative inputs: expository_journey_plan (authoritative for section order, conceptual moves, connections, extent allocation), learning_outcomes, learning_content (explanatory richness spine — prefer over MK alone), knowledge_model as needed, audience, and expository_extent / EJP extent implications.",
    "",
    "You own:",
    "- Per-section design rationale (explanation_intent) describing what that section's explanation must accomplish and how",
    "- Per-section learner-facing exposition that realises that intent",
    "- Local continuity: how this section continues, qualifies, or prepares the next conceptual move in the EJP journey",
    "- Selective pedagogical elaboration and material commissions only where a supporting artefact adds value beyond ordinary prose",
    "- Optional invitations to think/inspect/compare/predict/reflect only when they genuinely serve understanding — not required evidence and not a per-section habit",
    "",
    "explanation_intent vs exposition (hard distinction):",
    "- explanation_intent is authorial/design rationale for the instructor/authoring pipeline. It is NOT learner-facing prose.",
    "- exposition IS the actual learner-facing explanatory content for the section. Address the learner directly.",
    "- Do NOT write exposition as authorial directives such as \"Open by...\", \"Establish...\", \"Show that...\", \"Develop...\", \"Extend...\", or \"Return to...\".",
    "- exposition must actually execute the section's explanation_intent (realise the intended conceptual move in prose).",
    "- Do NOT copy explanation_intent into exposition. Do NOT leave exposition empty.",
    "",
    "Authority / governance for exposition:",
    "- Prefer learning_content as the explanatory-richness spine over MK labels alone.",
    "- EJP governs section purpose, conceptual move, order, dependencies, connections, emphasis, recurrence, and the overall intellectual journey — do not independently replan.",
    "- MK supplies conceptual structure; LO supplies intended understanding; audience governs assumed knowledge, terminology, and explanatory level.",
    "- Inherit EJP / expository_extent allocation: relative emphasis and affordable elaboration. Do not expand resource scope.",
    "",
    "Continuity in exposition:",
    "- Sections must read as parts of one developing explanation, not independent mini-essays.",
    "- Enact relevant continuity_hooks and EJP relationships naturally in the prose.",
    "- Refer back/forward where pedagogically useful without mechanical \"previous section / next section\" boilerplate.",
    "- Preserve deliberate recurrence and refinement planned by EJP (for example an evidence→action relationship that returns later with richer judgement).",
    "",
    "Richness:",
    "- Write sufficiently rich explanation rather than merely restating MK/LO.",
    "- Use definitions, distinctions, examples, qualifications, mechanisms, comparisons, and consequences in prose where they are the appropriate means of explanation.",
    "- Do not commission ordinary explanatory work into XM merely to keep exposition thin.",
    "",
    JUDGEMENT_ELABORATION,
    "",
    "Narrative continuity (required reading of EJP):",
    "- Treat journey_intent, section order, dependencies[], connections[], and synthesis as binding whole-resource context.",
    "- For each section, explanation_intent, exposition, and continuity_hooks must make sense as part of that one journey (relationship to preceding and following conceptual moves).",
    "- Do not optimise a section in isolation if that would break recurrence, qualification, or synthesis planned by EJP.",
    "",
    "Authority boundaries:",
    "- Preserve EJP authority over whole-resource progression, section order, and extent allocation. Do not independently replan or expand resource scope.",
    "- Do NOT create required learner evidence, workspaces, diagnostic review, learner_task, expected_output, or Interactive activity semantics.",
    "- Ground exposition and commissions in learning_content / LO / MK; do not invent unsupported content.",
    "",
    "Commissioning (XM boundary):",
    "- Emit materials_commission[] only for genuinely useful supporting intellectual artefacts whose form adds value beyond ordinary prose.",
    "- XM materials support the exposition; they do not substitute for it.",
    "- Empty commissions are valid when the exposition needs no separate supporting artefact.",
    "- Each commission: commission_id, section_id, kind (free pedagogical label), intent, constraints (including extent/attention notes when relevant).",
    "",
    "Step notes: {{stepNotes}}",
    "",
    FENCE,
    "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: expository_development",
    "- artifact_type must be \"expository_development\"",
    "- sections[] must match EJP section_ids; each with explanation_intent, exposition (required non-empty learner-facing prose), invitations_to_think[] (optional; often empty), continuity_hooks[], materials_commission[] (may be empty)",
    "- Return the fenced block first, then the single STEP N OUTPUT footer line."
  ].join("\n");

  var XM = [
    "Context:",
    "You realise Expository Materials commissioned by Expository Development.",
    "Authoritative inputs: expository_development commissions (authoritative), learning_content / source material for grounding and formal fidelity, and EJP/XD extent implications carried in commission constraints.",
    "",
    "You own:",
    "- Actual intellectual material bodies with sufficient substance to support the commissioned explanation",
    "",
    "Commission lock (hard):",
    "- Realise each commission 1:1 — do not invent, delete, merge, or reassign commissions",
    "- Stay within EJP/XD extent allocation — do not independently expand resource scope or add uncommissioned elaborations",
    "- Do not mechanically pad or truncate to hit a word target",
    "",
    "Must not:",
    "- Invent uncommissioned pedagogical structure",
    "- Add Interactive activities, workspaces, evidence production, learner_task, or expected_output",
    "- Violate source / formal / attachment authority in learning_content or supplied source",
    "",
    "Quality:",
    "- Produce the kind of body the commission requires",
    "- Preserve grounding, formal fidelity, and recurrence consistency with the journey",
    "- Prefer learning_content / source wording and distinctions over compressed MK labels alone",
    "",
    "Step notes: {{stepNotes}}",
    "",
    FENCE,
    "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: expository_materials",
    "- artifact_type must be \"expository_materials\"",
    "- materials[] rows: material_id, commission_id, section_id, kind, body, optional formal_notes",
    "- Return the fenced block first, then the single STEP N OUTPUT footer line."
  ].join("\n");

  var DP = [
    "PRIMARY IDENTITY — EXPOSITORY DESIGN PAGE (THIN ORIENTATION / SYNTHESIS TRANSPORT)",
    "",
    "Design Page for an Expository Resource owns resource-level presentation: learner-facing title, thin orientation/synthesis transport, and optional visual planning.",
    "PRISM assembles ordered exposition sections + materials deterministically from EJP/XD/XM captures.",
    "",
    "Upstream state (already captured — do not regenerate):",
    "- Ordered sections and commissions from Expository Journey Plan / Development",
    "- Material bodies from Expository Materials",
    "- Learning outcomes / learning content as conversation context",
    "",
    "You own:",
    "- title — concise publication-quality resource title",
    "- page_synthesis.overview / learning_purpose / knowledge_summary as thin transport/orientation (not a chapter rewrite)",
    "- page_synthesis.closing_paragraph — brief learner-facing closure after the authored exposition (optional; omit when nothing useful)",
    "- Optional visual planning for section-level or page-level figures when warranted by upstream substance",
    "- assembly_state.current_stage design_page; enriched_by includes design_page",
    "",
    "closing_paragraph rules:",
    "- One short paragraph stating what the learner should carry away from this resource",
    "- Integrate only ideas already explained upstream; provide experiential closure",
    "- Must not introduce new substantive claims, mechanisms, or topics",
    "- Must not create activities, tasks, checklists, study advice, reflection prompts, or evidence obligations",
    "- Must not become another exposition section or Interactive study_tips",
    "- Omit the field entirely when a useful close cannot be written faithfully",
    "",
    "Must not:",
    "- Become a final unrestricted coherence rewrite of section/material bodies",
    "- Repair weak EJP/XD/XM output by re-authoring exposition",
    "- Invent Interactive activities, workspaces, evidence chores, or activity-scoped visual rows for non-existent activities",
    "- Emit activities[] or regenerate materials[]",
    "- Invent fake activity_id values or map sections onto pretend activities",
    "- Alias closing_paragraph to study_tips or emit study_tips for Expository",
    "",
    "Narrative continuity:",
    "- Orient the learner to the whole authored journey already planned and realised upstream; do not invent a new structure",
    "- Keep synthesis faithful to upstream intellectual arc",
    "",
    "Required envelope:",
    "- artifact_type: \"page\"",
    "- schema_version: \"2.0.0\"",
    "- assembly_state.current_stage: \"design_page\"",
    "- assembly_state.enriched_by includes \"design_page\"",
    "",
    "Visual planning (optional but fail-closed when present — same graphics quality contract as Interactive, section-scoped):",
    "- When any visual planning is authored, set visual_affordance_schema_version: \"38.4\".",
    "- activities_visual_review must be [] (Expository has no Interactive activities).",
    "- visual_affordances may be [] when no figure is warranted.",
    "- Every visual_affordances[] row requires: affordance_id, scope, rationale, subject, context, evidence_anchors[], visual_decision.",
    "- Allowed scopes: \"section\" (preferred for exposition figures) or \"page\" (Knowledge Summary only).",
    "- Section scope requires section_id matching an upstream exposition section (e.g. \"S5\"); do NOT set activity_id.",
    "- Page scope requires region: \"knowledge_summary\"; do NOT set activity_id or section_id.",
    "- evidence_anchors must be canonical dotted strings: section_id.path (e.g. \"S5.purpose\", \"S5.synthesis\", \"S1.knowledge_focus\", \"S5.materials.feedback_loop\") and/or page_synthesis.field (overview|knowledge_summary|learning_purpose|closing_paragraph).",
    "- Forbidden evidence anchors: free-text labels, bare \"S1-S5\" ranges without dotted paths, activity_id paths, or inventing A1/A2 activity anchors.",
    "- generate rows must include the shared graphics fields: visual_slot, tier (essential|valuable), purpose, preferred_representation, reasoning_supported, learner_stage (pre_classification|post_reasoning), anti_spoiler (boolean), spoiler_boundary when anti_spoiler is true, representation_avoid[], canonical_discipline_note, requires_exact_data_match (boolean), must_show[], must_not_show[], allowed_claims[], disallowed_claims[], source_basis, caption_intent, alt_text, detailed_description, discipline_risk_level (low|medium|high).",
    "- For section generate rows use visual_slot: \"section-after-content\". For page Knowledge Summary generate rows use \"knowledge-summary-after-content\".",
    "- purpose / preferred_representation use the shared controlled vocabularies (purpose includes synthesis/mechanism; preferred_representation includes process, causal_chain, concept_map, annotated_system, …).",
    "- representation_avoid (generate only): use ONLY the shared Sprint 38 closed vocabulary — exactly these tokens when needed: summary_table, filled_worksheet, stock_photography, generic_infographic, unsupported_causal_arrow, numeric_claim_without_source, topic_hero_image, assessment_answer_visual, author_portrait_collage, duplicate_mechanism_and_evidence, linear_timeline, hierarchical_org_chart. Never invent free-form phrases (e.g. decorative_equation, unlabelled_chart, new worked example). Omit a token when it does not apply; do not invent near-synonyms.",
    "- learner_stage keeps the shared graphics vocabulary: pre_classification = before the figure-supported claim is resolved; post_reasoning = consolidating after section reasoning (e.g. S5 synthesis diagram).",
    "- Do not emit topic-only rows (missing purpose/representation, or rationale that only says \"illustrate the topic\").",
    "- Example section generate row shape (illustrative): {\"affordance_id\":\"va-S5-feedback-loop-01\",\"scope\":\"section\",\"section_id\":\"S5\",\"visual_decision\":\"generate\",\"visual_slot\":\"section-after-content\",\"tier\":\"essential\",\"purpose\":\"synthesis\",\"preferred_representation\":\"process\",\"subject\":\"Integrating feedback-loop diagram\",\"context\":\"Visual brief: synthesise the closed feedback loop across upstream sections so learners can see how earlier moves integrate; preserve claim bounds from S5 substance.\",\"evidence_anchors\":[\"S1.purpose\",\"S2.knowledge_focus\",\"S3.synthesis\",\"S4.purpose\",\"S5.synthesis\"],\"rationale\":\"Makes the integrative feedback loop inspectable at the journey synthesis point without inventing activities.\",\"reasoning_supported\":\"Learners integrate prior section moves into one closed loop.\",\"learner_stage\":\"post_reasoning\",\"anti_spoiler\":false,\"representation_avoid\":[\"generic_infographic\",\"topic_hero_image\"],\"canonical_discipline_note\":\"Show only relationships warranted by upstream sections.\",\"requires_exact_data_match\":false,\"must_show\":[\"closed feedback loop\",\"labelled stage nodes from S1–S5\"],\"must_not_show\":[\"unsupported causal shortcuts\",\"activity worksheets\"],\"allowed_claims\":[\"Earlier sections contribute distinct moves that integrate in S5.\"],\"disallowed_claims\":[\"Claims absent from upstream substance.\"],\"source_basis\":\"S1.purpose; S5.synthesis\",\"caption_intent\":\"Synthesis feedback loop across the expository journey.\",\"alt_text\":\"Feedback-loop diagram integrating S1–S5 moves; detailed description follows.\",\"detailed_description\":\"A closed process loop links the ordered section moves into one integrative cycle. Each node names a warranted stage from the upstream journey; arrows show return paths without inventing new mechanisms.\",\"discipline_risk_level\":\"medium\"}.",
    "",
    "Step notes: {{stepNotes}}",
    "",
    FENCE,
    "- After the closing ``` fence, emit exactly one plain-text runner footer line: STEP N OUTPUT: page",
    "- Return partial page JSON with title, page_synthesis{} (overview, learning_purpose, knowledge_summary, optional closing_paragraph), assembly_state{}; when visual planning is present include visual_affordance_schema_version, activities_visual_review:[], and visual_affordances[] matching the section/page contract above — never activities[]",
    "- Return the fenced block first, then the single STEP N OUTPUT footer line."
  ].join("\n");

  var TEMPLATES = {
    generate_learning_content: GLC,
    define_learning_outcomes: LO,
    expository_journey_plan: EJP,
    expository_development: XD,
    expository_materials: XM,
    design_page: DP
  };

  var CANONICAL_TO_STAGE = {
    step_generate_learning_content: "generate_learning_content",
    step_define_learning_outcomes: "define_learning_outcomes",
    step_expository_journey_plan: "expository_journey_plan",
    step_expository_development: "expository_development",
    step_expository_materials: "expository_materials",
    step_design_page: "design_page"
  };

  function resolveStageFromStepIdentity(stepOrCfg) {
    var src = stepOrCfg && typeof stepOrCfg === "object" ? stepOrCfg : {};
    var canonical = String(
      src.canonical_step_id || src.canonicalStepId || src.stepCanonicalStepId || ""
    )
      .trim()
      .toLowerCase();
    if (CANONICAL_TO_STAGE[canonical]) return CANONICAL_TO_STAGE[canonical];
    var outputName = String(src.outputName || src.stepOutputName || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    if (TEMPLATES[outputName]) return outputName;
    if (outputName === "learning_content") return "generate_learning_content";
    if (outputName === "learning_outcomes") return "define_learning_outcomes";
    if (outputName === "page") return "design_page";
    var title = String(src.title || src.stepTitle || src.stepCanonicalTitle || "")
      .trim()
      .toLowerCase();
    if (title.indexOf("generate learning content") !== -1) return "generate_learning_content";
    if (title.indexOf("learning outcome") !== -1) return "define_learning_outcomes";
    if (title.indexOf("expository journey") !== -1) return "expository_journey_plan";
    if (title.indexOf("expository development") !== -1) return "expository_development";
    if (title.indexOf("expository material") !== -1) return "expository_materials";
    if (title.indexOf("design page") !== -1) return "design_page";
    return "";
  }

  function resolveTemplate(stageOrStep) {
    var stage =
      typeof stageOrStep === "string"
        ? String(stageOrStep).trim().toLowerCase()
        : resolveStageFromStepIdentity(stageOrStep);
    if (!stage) return "";
    return String(TEMPLATES[stage] || "").trim();
  }

  function assertNoInteractiveSemantics(templateText) {
    var t = String(templateText || "");
    var forbidRe =
      /\b(learner_task|expected_output|evidence_decision|response_fulfilment|guided_practice|independent_performance)\b/gi;
    var hits = [];
    var match;
    while ((match = forbidRe.exec(t))) {
      var start = Math.max(0, match.index - 100);
      var span = t.slice(start, match.index + match[0].length + 40);
      if (
        /do not|must not|without|avoid|not require|not create|not invent|forbidden|invent interactive/i.test(
          span
        )
      ) {
        continue;
      }
      hits.push(span);
    }
    return { ok: hits.length === 0, hits: hits };
  }

  return {
    DOMAIN_GUIDANCE_CONSUMPTION: DOMAIN_GUIDANCE_CONSUMPTION,
    TEMPLATES: TEMPLATES,
    CANONICAL_TO_STAGE: CANONICAL_TO_STAGE,
    resolveStageFromStepIdentity: resolveStageFromStepIdentity,
    resolveTemplate: resolveTemplate,
    assertNoInteractiveSemantics: assertNoInteractiveSemantics,
    JUDGEMENT_ELABORATION: JUDGEMENT_ELABORATION
  };
});

