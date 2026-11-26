/**
 * Sprint 101D/E — Practice-owned instructional and presentation contracts.
 *
 * Applied only when promptRoute === "practice". Must not alter Interactive
 * promptRoute contracts. Reuses shared page/activity machinery conceptually;
 * this module owns Practice furniture rules, progressive interaction design,
 * discipline-first effort allocation, and learner-facing language guidance.
 *
 * Interaction guidance is grounded in currently supported learner surfaces:
 * text_entry / template fields (text|math), table_entry (editable short cells),
 * ordering/sequencing/ranking, selection (single_select / multi_select / matching),
 * checklist diagnostic review, prompt_set/task_card.
 * Do not invent dropdown-in-cell or other unsupported in-table widgets.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_PRACTICE_PRESENTATION_CONTRACTS = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-PRACTICE-PRESENTATION-CONTRACTS";
  var MARKER = "LD-PRACTICE-PRESENTATION-CONTRACTS (auto-applied)";
  var CONTRACT_VERSION = "104M3-PRACTICE-RECONCILED-V1";

  var STAGES = {
    episode_plan: "episode_plan",
    dla: "dla",
    gam: "gam",
    learning_sequence: "learning_sequence",
    design_page: "design_page",
    all: "all"
  };

  function normalizeStage(stage) {
    var token = String(stage == null ? "" : stage)
      .trim()
      .toLowerCase();
    if (!token || token === "all") return STAGES.all;
    if (token === "episode_plan" || token === "ep" || token === "design_episode_plan") {
      return STAGES.episode_plan;
    }
    if (token === "dla" || token === "design_learning_activities") return STAGES.dla;
    if (token === "gam" || token === "generate_activity_materials") return STAGES.gam;
    if (token === "learning_sequence" || token === "cls" || token === "construct_learning_sequence") {
      return STAGES.learning_sequence;
    }
    if (token === "design_page" || token === "dp") return STAGES.design_page;
    return STAGES.all;
  }

  function sharedPreambleLines() {
    return [
      MARKER,
      "module: " + MODULE_ID,
      "version: " + CONTRACT_VERSION,
      "",
      "Practice is a distinct Learning Journey-commissioned product.",
      "Retain Interactive's pedagogical sophistication (scaffolding, feedback, revision, maths, purposeful setup, Check your work, success criteria, hints, worked/model responses, criterion-based self-evaluation) with a lighter, task-led presentation.",
      "",
      "Discipline-first principle:",
      "Learners should spend their effort doing the discipline (operating, deciding, constructing, diagnosing), not describing how they would do the discipline.",
      "Do not reduce intellectual demand. Reduce unnecessary writing.",
      "Prefer control-led disciplinary decisions with one concise independent justification over extended typed explanations of work learners could perform through controls.",
      "Prefer mathematical construction (input_modality math), short structured table cells, ordering, and compact labelled fields over essay boxes that ask learners to narrate procedures they should instead perform.",
      "Reserve substantial free-text for moments where authored explanation or justification is itself the learning outcome.",
      "",
      "Design grammar (flexible — not a fixed template):",
      "Conceptual hook → purposeful setup → meaningful learner activity → feedback and improvement → progression or transfer.",
      "",
      "Do NOT impose a universal attempt-before-explanation rule.",
      "Essential orientation, representations, examples or prerequisite explanation may precede an attempt when they support the activity.",
      "Hints, worked solutions and answer-bearing feedback should be placed or revealed according to instructional purpose.",
      "",
      "Learning Journey context:",
      "- When the commission states that a preceding Expository (or other) component established foundations, do not re-teach those foundations unnecessarily.",
      "- Preserve commission outcomes, disciplinary accuracy, task scope and workload.",
      "- Different Practice commissions (e.g. formulation, critical evaluation, transfer) should yield meaningfully different activity designs — not one fixed control sequence."
    ];
  }

  function learnerFacingLanguageLines() {
    return [
      "Learner-facing language (Practice — DLA and GAM):",
      "- learner_task, activity_preamble, and any learner-visible production briefing (including learner-facing expected_output / What to produce) must be clear, direct, actionable instructions a learner can follow without instructional-design jargon.",
      "- Internal design specifications (commission mapping, quality thresholds for authors, LO warrants) may use precise design vocabulary — do NOT paste those sentences into learner-facing fields.",
      "- Bad (design-spec voice): \"A concise, evidence-based judgement that distinguishes feasibility and constrained stationarity from an established extremum, identifies an unsupported inference where present, and specifies the kind of further justification needed without repeating the earlier algebra.\"",
      "- Better (learner voice): \"Explain what the multiplier equations tell us — and what they don't. Identify what the evidence establishes, where an argument goes too far, and what further justification is needed. You don't need to repeat the calculations.\"",
      "- Keep mathematical precision and disciplinary terms when they are necessary for the task.",
      "- Do not simplify the mathematics itself; simplify only the instructional packaging so learners know what to do."
    ];
  }

  function checkYourWorkLines() {
    return [
      "Check your work (Practice — preserve educational value; keep feedback coherent and proportionate):",
      "- Collective feedback economy: treat worked responses, explanatory feedback, review criteria, and repair guidance as parts of one coherent feedback experience within the authoritative component duration — not as independent content obligations to be maximised separately.",
      "- Complement rather than duplicate: each feedback mechanism must perform a distinct educational job. When a worked response already models the reasoning, do not restate the same explanation in a separate explanatory essay and again across overlapping checklist criteria and repair guidance. Let worked responses exemplify defensible reasoning, explanatory notes target specific misconceptions not obvious from the specimen alone, and review criteria focus learners on the essential diagnostic checks and concrete repairs.",
      "- Select feedback mechanisms by educational purpose rather than habit, while preserving meaningful independent attempts, actionable feedback, and purposeful opportunities for improvement — without imposing fixed word limits, criterion counts, duration tiers, or rigid activity structures.",
      "- Retain criterion-based diagnostic_review / guided checklist self-evaluation, worked or model responses, hints, success criteria, and revision after feedback when they match the authored pedagogical function.",
      "- Proportionate criteria: match criteria count and structure to the selected pedagogical function without arbitrary minimum criterion counts (typically 1–3 focused criteria when warranted; hard max 4 on a single checklist). Do not impose minimum-count floors regardless of complexity.",
      "- Avoid repeated criteria that assess essentially the same distinction across checklist items.",
      "- Do not mandate a checklist on every production activity when determinate selections already check the discrimination and no open production needs self-evaluation.",
      "- Distinguish: (1) what the learner produced or decided; (2) which decision or inference needs attention; (3) what makes the overall response defensible; (4) opportunity to revise when revision is warranted.",
      "- Hybrid control+justification tasks: check selections with existing answer keys/rationale; review the concise justification with a small number of focused criteria that target the explanatory relationship (not restating each selected label).",
      "- Do not replace criterion-based guided review with simplistic right/wrong marking for open production or unrestricted mathematical explanations.",
      "- Do not expose answer keys before a meaningful attempt.",
      "- Selection materials (type \"selection\") support determinate Check answer when a correct key is defined, with explanatory rationale — this can carry the decision chain; use guided review for the associated justification when open production exists.",
      "- Where judgement admits multiple defensible answers, omit the correct key and rely on checklist / diagnostic_review rather than inventing a forced single choice.",
      "- Note: determinate auto-check of typed table/text cells is not a Practice workspace feature; ordering may offer exact-sequence check when commissioned."
    ];
  }

  function controlLedJustificationLines() {
    return [
      "Optional Practice pattern — control-led reasoning with concise justification:",
      "Minimise typing, not thinking. When compound reasoning is warranted, prefer structured disciplinary decisions plus one short independent justification over extended typed explanations of work learners could perform through controls.",
      "",
      "When a compound reasoning task is appropriate, DLA may commission:",
      "- A small set of connected decisions using supported native selection controls (single_select / multi_select / matching).",
      "- Decisions that collectively establish a meaningful chain of reasoning (not isolated recall items).",
      "- ONE concise independent justification (template/text field) when explaining or defending the judgement is educationally important.",
      "- Feedback that addresses specific misconceptions or incorrect relationships among the decisions.",
      "- A purposeful opportunity to reconsider the relevant decision or justification when revision is warranted — not a mandatory extra writing exercise.",
      "",
      "Avoid commissioning an extended written response when the same disciplinary performance can be elicited through structured decisions and a short justification.",
      "Do not impose this pattern universally or as a fixed activity blueprint. Independent extended writing, multi-field proofs, lean direct-task exercises, or sustained professional communication remain valid whenever the commission and authored Episode Plan require them.",
      "",
      "Justification field rules (when used):",
      "- Ask for a specific explanatory relationship, inference, or defence — not a restatement of the selected option labels.",
      "- Keep the justification visually and instructionally associated with the control cluster it defends.",
      "- Do not add extra written fields, reflection questions, or revision exercises that the Episode Plan does not require.",
      "",
      "Hybrid feedback (when used):",
      "- Structured decisions: retain determinate Check answer / diagnostic feedback when a correct key is defined.",
      "- Concise justification: use function-proportionate criterion-based self-review (no arbitrary minimum criterion count; hard max 4) rather than pretending unrestricted mathematical explanations can be marked by simple answer matching."
    ];
  }

  function workloadEconomyLines() {
    return [
      "Practice workload economy (minimise typing, not thinking — fulfil the Episode Plan rather than enlarging it):",
      "- Use control-led + concise-justification patterns when they best serve compound reasoning, without forcing a fixed template across activities.",
      "- Prefer one coherent response surface when several requirements concern the same judgement.",
      "- Use selection clusters for a decision chain when appropriate; commission one short prose field when explanation/justification is itself needed as learning evidence.",
      "- Do not commission separate textareas for every subclaim, review stage, evidence bullet, peer message and transfer by default.",
      "- Do not automatically commission transfer_prompt, peer-feedback composition, or a full revision triad unless the commission specification, authored Episode Plan beats, or mapped LOs require them.",
      "- Substantial writing, multi-field proofs, revision and transfer remain valid when the commission or LO genuinely requires them.",
      "- Do not impose rigid numerical quotas on controls, textareas, materials, or activity counts."
    ];
  }

  function supportedRepertoireLines() {
    return [
      "Supported learner response repertoire (use only these — do not invent controls):",
      "- Structured tables (comparison_table, analysis_table, decision_table, classification_table, planning_table, data_table, impact_table) with blank learner cells via table_entry — cells are short editable textareas, not dropdown widgets.",
      "- Templates / structured workspaces with ordered **Label:** response fields; optional response_fields[].input_modality \"text\" | \"math\" (MathLive) per field.",
      "- Ordering / sequencing / ranking workspaces where activity_interaction_type supports them.",
      "- Selection materials (material type \"selection\") for structured decisions:",
      "  - selection.form \"single_select\" — native radio group with accessible labels; optional correct_answer + feedback for determinate check.",
      "  - selection.form \"multi_select\" — native checkboxes; optional correct_answers[] + feedback.",
      "  - selection.form \"matching\" — labelled native <select> pairs (left/right + optional pairs map); no drag-and-drop.",
      "  - Compose several selection materials with math/text fields and a checklist in one activity for coherent compound reasoning.",
      "- prompt_set / task_card for concise prompts and micro-decisions when free-text micro-responses are still appropriate.",
      "- checklist with diagnostic_review for criterion-based self-evaluation (Check your work / success criteria).",
      "- Ordinary text_compose / text_entry when learner-authored articulation is itself essential.",
      "- Compound tasks: several coordinated materials/steps inside one activity (e.g. select feasibility → select stationarity → select what evidence establishes → brief math justification → checklist review).",
      "Do NOT request dropdown-in-cell, checkbox-in-cell, or other unsupported in-table widgets. Prefer selection materials, short structured cells, labelled template fields, ordering, and checklists instead."
    ];
  }

  function progressiveDemandLines() {
    return [
      "Progressive interaction demand (design heuristic — NOT a mandatory five-stage template):",
      "Prefer sequences that generally move from lower-friction participation toward more independent intellectual work, when that serves the commission.",
      "Illustrative progression (select by intellectual operation, not fixed order):",
      "1. Recognise / discriminate — selection materials (single_select / multi_select / matching) or short structured table/template judgements; ordering when sequence is the evidence.",
      "2. Apply / connect — short inputs, math-labelled fields, ordering, compact table completion.",
      "3. Construct / diagnose — coordinated table or template fields, mathematical construction (input_modality math), error identification against a worked specimen.",
      "4. Synthesise / evaluate — comparative/decision selections or tables, multi-field templates, brief justification only where articulation is essential.",
      "5. Review / improve — checklist diagnostic_review, Check your work, success criteria, feedback, revision opportunity.",
      "A sophisticated single judgement may belong late; a hard diagnostic may belong early. Match the control to the intellectual operation.",
      "Minimise unnecessary typing: prefer selection controls for the decision chain, structured cells, labelled short fields, ordering and math construction — then one concise justification when defence of the reasoning matters.",
      "Do the discipline first: when the LO is formulate/solve/classify/diagnose, commission surfaces that make the learner perform that operation — not write a paragraph about how they would perform it.",
      "Reserve substantial free-text for moments where authored explanation/justification is itself the learning.",
      "Do not replace meaningful mathematical construction or explanation with superficial guessing items or selections that give away the complete explanation.",
      "Do not turn every reasoning step into a separate long text area.",
      "Do not use Assessment Pack region markup; commission Practice selection materials (type \"selection\") on the activity Do path."
    ];
  }

  function episodePlanLines() {
    return [
      "Episode Planning (Practice):",
      "- Design a coherent practice progression in response to the commission's purpose, authoritative learning outcomes, authoritative duration (when supplied), prior learning, and journey context.",
      "- Decide activity granularity pedagogically: one cohesive activity may address multiple compatible outcomes (mapped_learning_outcome_ids / learning_outcome_ids) when a unified learner sequence serves them best, or distinct activities may separate genuinely distinct operations — never discard, omit, or rewrite authoritative outcomes.",
      "- Select a frozen V1 archetype (understand | apply | analyse | evaluate) and a grammar-legal FunctionEnum beat sequence for each activity; compact, lean beat progressions with rising intellectual demand are valid when prior learning and journey context make foundational reteaching unnecessary.",
      "- Prefer activity beats that support rising intellectual demand and control-led compound decisions with concise justification where defence matters — without imposing duration tiers, activity quotas, beat-count targets, or mandatory Interactive Orient→Teach→Consolidate ceremony.",
      "- For evaluate activities (including evaluative refinement of an existing learner response such as strengthening an earlier judgement), satisfy evaluate's required evaluative_core group with a genuine evaluative beat — most naturally expressing the learner's defended or refined judgement directly as evaluative_judgement (or using evaluative_judgement before independent_performance when a distinct second production is warranted) — rather than pairing criteria_exposition/guided_reasoning with independent_performance alone or adding unnecessary beats/activities solely to satisfy validation.",
      "- Proportion feedback and review beats as one coherent improvement experience within the authoritative duration rather than stacking redundant feedback layers.",
      "- Preserve beat grammar legality and explicit outcome mappings cleanly so downstream DLA, GAM, and assembly stages can enrich the authored Episode Plan faithfully."
    ];
  }

  function dlaLines() {
    return [
      "Design Learning Activities (Practice):",
      "- Fulfil the authored Episode Plan without enlarging it.",
      "- Required: unambiguous learner_task and expected_output.",
      "- Conditional on authored Episode Plan pedagogical functions: activity_preamble, cognition/scaffold fields, hints, worked examples on distinct operands, intellectual_coherence_bridge, revision prompts, criterion self-review, and dedicated materials.",
      "- Permit valid activities without dedicated materials (required_materials: []) when the authored task and pedagogical functions do not require separate materials.",
      "- Preserve material obligations arising from selected beats, evidence providers, or learner response surfaces without imposing unconditional material-count floors.",
      "- Do not require Interactive mandatory bridge-every-activity ceremony or dense table-led defaults.",
      "- Commission response surfaces from the supported repertoire only when needed; bind load-bearing production via response_fulfilment on operational surfaces.",
      "- Discrete mathematical/disciplinary judgements: prefer material_type \"selection\" with response_fulfilment { kind: \"learner_workspace\", response_kind: \"selection_choose\" } when structured selection serves the task (rather than an analysis_table or long prose), paired with a concise justification field only if explanation is part of the outcome.",
      "- Optional checklist diagnostic_review and feedback materials: select feedback mechanisms by educational purpose so worked responses, explanatory feedback, review criteria, and repair guidance complement rather than duplicate one another within the authoritative duration. Commission checklist diagnostic_review only when open production warrants criterion-based self-evaluation; match focused criteria to the pedagogical function (no arbitrary minimum criterion count; hard max 4).",
      "- Ordinary tables and extended text areas remain valid wherever they genuinely support open construction, multi-field proofs, or free-text evaluation that is itself the LO — do not convert substantial proof/revision work into superficial MCQ, and do not use selections that give away the complete explanation.",
      "- Preserve discovery-sequence protections: do not reveal answer-key particulars before independent production when learners must establish them.",
      "- Preserve outcome coverage across multi-outcome activities (every mapped LO addressed) and artefact continuity when commissioned."
    ]
      .concat([""])
      .concat(controlLedJustificationLines())
      .concat([""])
      .concat(workloadEconomyLines())
      .concat([""])
      .concat(learnerFacingLanguageLines())
      .concat([""])
      .concat(checkYourWorkLines())
      .concat([""])
      .concat(supportedRepertoireLines())
      .concat([""])
      .concat(progressiveDemandLines());
  }

  function gamLines() {
    return [
      "Generate Activity Materials (Practice):",
      "- Honour DLA-commissioned response surfaces exactly (material_type, response_fulfilment, response_fields / input_modality, table family).",
      "- When an upstream DLA Practice activity has required_materials: [], emit materials: [] for that activity — do not invent uncommissioned materials.",
      "- When DLA commissions a control-led + concise-justification structure, realise the validated selection materials and exactly the commissioned justification template field(s). Do not invent transfer_prompt, peer-feedback workspaces, reflection packs, or additional textareas that DLA did not commission.",
      "- Generate commissioned stimulus, model/worked example, and substantive feedback/check materials so that worked responses, explanatory notes, review criteria, and repair guidance collectively form one coherent, non-duplicative feedback experience within the authoritative duration.",
      "- Prefer reveal-after / post-attempt placement for answer-bearing model solutions.",
      "- For table_entry surfaces: author blank learner cells meant for short structured responses (values, labels, brief judgements) — not essay-length cells for every column.",
      "- For templates: emit **Label:** sections matching commissioned response_fields only; preserve input_modality math vs text; do not reinterpret modality; do not expand one commissioned explanation into several overlapping labels.",
      "- Concise justification realisation: one clearly associated writing field; prompt must target a specific explanatory relationship, inference or defence — not \"restate your selections\". Keep the field title/placement instructionally connected to the preceding controls.",
      "- Support MathJax/TeX prose and MathLive math-entry response modalities where the task needs them.",
      "- Compose multi-part activities from existing materials (selection, prompt_set, tables, templates, checklist, worked_example, sample_output) rather than inventing new interaction widgets.",
      "- For selection materials: REQUIRED sibling field selection { form, prompt, options|left/right } — this is not optional prose. Markdown body may hold a short stem only.",
      "- FORBIDDEN for selection: encoding Form: single_select / lettered option lists / <details> correct answers solely in body Markdown. That shape fails GAM validation (GAM-SEL-01) and cannot render native controls.",
      "- Selection GAM shape (illustrative single_select): { \"material_type\": \"selection\", \"title\": \"…\", \"body_format\": \"markdown\", \"body\": \"optional stem\", \"selection\": { \"form\": \"single_select\", \"prompt\": \"Does C2's stated evidence justify its conclusion?\", \"options\": [{ \"key\": \"supported\", \"text\": \"Supported\" }, { \"key\": \"unsupported\", \"text\": \"Unsupported inference\" }, { \"key\": \"incomplete\", \"text\": \"Incomplete argument\" }], \"correct_answer\": \"unsupported\", \"feedback\": \"…\" } }.",
      "- For deterministic scatterplots on Practice materials (e.g. data_table): emit a structured sibling scatterplot object alongside body_format \"markdown\" (holding context prose, accessible Markdown data table, summary statistics, and source note) — or body_format \"json\" with { title, context, scatterplot, table, source_note }. Required scatterplot fields: { title, x_axis: { label, unit?, scale, minimum, maximum, tick_interval }, y_axis: { label, unit?, scale, minimum, maximum, tick_interval }, observations: [{ label, x, y }] (or series: [{ label, points: [{ id, x, y }] }]), show_point_labels?: boolean, caption?, accessible_description }.",
      "- Preserve exact observations, axis variables, units, ranges, observation identifiers (set show_point_labels: true when learners must identify observations by ID such as R1–R10), accessible data tables, and neutral non-spoiling accessible_description. Never add fitted lines or answer-bearing point highlighting, and do not commission external image generation for deterministic statistical graphics.",
      "- FORBIDDEN in Markdown material bodies: raw <svg>, <canvas>, or HTML chart markup and ASCII/text-art plots (GAM-SVG-01), or fenced ```json scatterplot specifications embedded inside Markdown body (GAM-SCATTER-02). Both fail GAM validation and leak raw text on publication; always place the structured scatterplot in the sibling \"scatterplot\" object.",
      "- When DLA commissions selection_choose, author one selection material per commissioned judgement (or matching when pairs are the evidence). Keep any brief justification as the commissioned template field(s) only — do not expand every judgement into a long table cell or extra prose field.",
      "- Selection feedback: retain correct keys and misconception-aware rationale for structured decisions.",
      "- Guided-review checklists: when DLA commissions diagnostic_review, emit function-proportionate criteria (typically 1–3 focused criteria; hard max 4; no arbitrary minimum criterion count) aimed at the justification relationship and consequential gaps — not one criterion per selected option label and not repeating explanations already covered by worked responses; each criterion needs concrete expected/repair pairs that add distinct diagnostic value.",
      "- Realise learner-facing task prose, prompts, and criterion feature text in clear actionable language (see learner-facing language rules) — not instructional-design specification voice.",
      "- Omit filler exposition rows, unconditional ### Page learner-resource closure blocks, and ceremonial study-tip packs unless explicitly commissioned.",
      "- Do not invent dropdown/checkbox-in-cell markup or unsupported schema fields; do not weaken GAM-SEL validation."
    ]
      .concat([""])
      .concat(controlLedJustificationLines())
      .concat([""])
      .concat(workloadEconomyLines())
      .concat([""])
      .concat(learnerFacingLanguageLines())
      .concat([""])
      .concat(checkYourWorkLines());
  }

  function learningSequenceLines() {
    return [
      "Learning Sequence (Practice):",
      "- Preserve the authored Episode Plan's activity structure, activity_id order, and beat progression — do not invent extra activities, consolidation stops, or timing expansion.",
      "- Preserve the authoritative commissioned workflow duration exactly (total_duration_minutes and sum of timeline activity durations match the authoritative duration without inflating).",
      "- Learner-facing timing policy: keep exact allocated/activity minutes in structured fields only. In learner-facing prose (overview, preambles, task instructions, feedback), do NOT present internal allocations as fixed pace targets, do NOT compute bespoke duration ranges, do NOT expose routine activity- or step-level timings, and do NOT imply that taking longer constitutes underperformance; PRISM's shared presentation layer renders indicative component durations deterministically.",
      "- Provide coherent sequencing metadata for progression between activities, matching upstream pedagogical order (including prediction/attempt-before-feedback where authored) without flattening rising demand.",
      "- Avoid decorative transition furniture and generic study tips."
    ];
  }

  function designPageLines() {
    return [
      "Design Page (Practice):",
      '- Emit artifact_type "page", schema_version "2.0.0", product_id "practice", page_kind "practice".',
      "- Title required.",
      "- Purpose-driven page_synthesis furniture: every page_synthesis element (overview, learning_purpose, knowledge_summary, study_tips) is optional and purpose-driven for Practice — omit any element when prior learning, journey framing, or the activity apparatus already provides sufficient entry. page_synthesis: {} or partial omissions are valid.",
      "- Do not change learner-facing learning outcomes or enlarge the Episode Plan structure.",
      "- study_tips / knowledge_summary / closing essays: omit by default unless genuinely warranted by the Practice commission (or transported from an explicit GAM closure block).",
      "- Essential working knowledge may also appear as compact apparatus adjacent to activities when needed at the point of use.",
      "- editorial_opening_image: REQUIRED at page root for every newly authored Practice Design Page. Always emit decision \"generate\" with the complete editorial image specification (subject, context, caption_intent, alt_text \"\", detailed_description; decorative and text-free, no overlays, labels, titles, slogans, banners, or spoilers). Do not use decision \"skip\" and do not omit editorial_opening_image. Never place editorial_opening_image inside visual_affordances[].",
      "- visual_affordances / activities_visual_review / visual_affordance_schema_version: use the shared Sprint 38 visual-affordance authoring contract (auto-applied on Design Page). Do not invent slots, decisions, or field shapes.",
      "- Allowed visual_slot values only (generate): activity-after-header | materials-entry | materials-card-grid-after | materials-table-pair-between | assessment-before-checkpoint | knowledge-summary-after-content | section-after-content. Never invent slots such as materials-after-feedback.",
      "- Page-scoped rows (including skip/defer): always emit region \"knowledge_summary\". Prefer empty visual_affordances [] over a page-scoped row that omits region.",
      "- Prefer purposeful conceptual/mathematical imagery when warranted; emit visual_affordances [] when none are justified. Empty instructional visual_affordances is valid.",
      "- Do not redesign activity interaction surfaces or alter activities/materials/episode_plans/learning_sequence here."
    ];
  }

  function stageBodyLines(stage) {
    var normalized = normalizeStage(stage);
    if (normalized === STAGES.episode_plan) return episodePlanLines();
    if (normalized === STAGES.dla) return dlaLines();
    if (normalized === STAGES.gam) return gamLines();
    if (normalized === STAGES.learning_sequence) return learningSequenceLines();
    if (normalized === STAGES.design_page) return designPageLines();
    return []
      .concat(episodePlanLines())
      .concat([""])
      .concat(dlaLines())
      .concat([""])
      .concat(gamLines())
      .concat([""])
      .concat(learningSequenceLines())
      .concat([""])
      .concat(designPageLines());
  }

  /**
   * @param {string} [stage] episode_plan | dla | gam | learning_sequence | design_page | all
   */
  function buildPracticePresentationContractBlock(stage) {
    return sharedPreambleLines()
      .concat([""])
      .concat(stageBodyLines(stage))
      .concat(["", "Never thin Interactive contracts. These rules apply only to Practice workflows."])
      .join("\n");
  }

  function buildCanonicalPracticeDesignPageShapeSnippet() {
    return [
      "Canonical Practice Design Page shape (illustrative — page_synthesis entries are optional/purpose-driven; editorial_opening_image is required with decision \"generate\"):",
      "{",
      '  "artifact_type": "page",',
      '  "schema_version": "2.0.0",',
      '  "product_id": "practice",',
      '  "page_kind": "practice",',
      '  "title": "…",',
      '  "page_synthesis": {},',
      '  "visual_affordance_schema_version": "38.4",',
      '  "activities_visual_review": [],',
      '  "visual_affordances": [],',
      '  "editorial_opening_image": { "decision": "generate", "subject": "…", "context": "…", "caption_intent": "…", "alt_text": "", "detailed_description": "…" },',
      '  "assembly_state": { "current_stage": "design_page", "enriched_by": ["design_page"], "calls_model": true }',
      "}",
      "Always emit editorial_opening_image at page root with decision \"generate\" (subject, context, caption_intent, alt_text \"\", detailed_description; decorative, text-free, non-spoiling). Do not use \"skip\" and do not omit it. When commissioning generate/defer/skip instructional rows in visual_affordances[], follow the auto-applied Sprint 38 visual affordance authoring contract exactly (decision-specific fields, recognised slots only)."
    ].join("\n");
  }

  /**
   * Resolve which Practice contract stage to inject for a runtime step context.
   * @param {object} context enrichDla / workflow step augment context
   * @param {{ isDesignEpisodePlan?: Function, isDesignLearningActivities?: Function, isGenerateActivityMaterials?: Function, isConstructLearningSequence?: Function, isDesignPage?: Function }} detectors
   */
  function resolvePracticeContractStage(context, detectors) {
    var d = detectors && typeof detectors === "object" ? detectors : {};
    if (typeof d.isDesignPage === "function" && d.isDesignPage(context)) return STAGES.design_page;
    if (typeof d.isGenerateActivityMaterials === "function" && d.isGenerateActivityMaterials(context)) {
      return STAGES.gam;
    }
    if (typeof d.isDesignLearningActivities === "function" && d.isDesignLearningActivities(context)) {
      return STAGES.dla;
    }
    if (typeof d.isConstructLearningSequence === "function" && d.isConstructLearningSequence(context)) {
      return STAGES.learning_sequence;
    }
    if (typeof d.isDesignEpisodePlan === "function" && d.isDesignEpisodePlan(context)) {
      return STAGES.episode_plan;
    }
    return STAGES.all;
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    CONTRACT_VERSION: CONTRACT_VERSION,
    STAGES: STAGES,
    normalizeStage: normalizeStage,
    resolvePracticeContractStage: resolvePracticeContractStage,
    buildPracticePresentationContractBlock: buildPracticePresentationContractBlock,
    buildCanonicalPracticeDesignPageShapeSnippet: buildCanonicalPracticeDesignPageShapeSnippet
  };
});
