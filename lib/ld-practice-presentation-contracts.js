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
  var CONTRACT_VERSION = "101G-CONTROL-LED-JUSTIFICATION-V1";

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
      "Check your work (Practice — preserve educational value; keep review proportionate):",
      "- Retain criterion-based diagnostic_review / guided checklist self-evaluation, worked or model responses, hints, success criteria, and revision after feedback when they help learners improve.",
      "- Proportionate criteria: use enough distinct criteria to surface consequential gaps (typically 2–3; hard max 4 on a single checklist). Do not require four or more criteria on every activity regardless of complexity.",
      "- Avoid repeated criteria that assess essentially the same mathematical distinction (e.g. restating \"stationarity ≠ extremum\" across multiple checklist items).",
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
      "Preferred Practice pattern — control-led reasoning with concise justification (Sprint 101G):",
      "Minimise typing, not thinking. Prefer structured disciplinary decisions plus one short independent justification over extended typed explanations of work learners could perform through controls.",
      "",
      "When a compound reasoning task is appropriate, DLA should preferentially commission:",
      "- A small set of connected decisions using supported native selection controls (single_select / multi_select / matching).",
      "- Decisions that collectively establish a meaningful chain of reasoning (not isolated recall items).",
      "- ONE concise independent justification (template/text field) when explaining or defending the judgement is educationally important.",
      "- Feedback that addresses specific misconceptions or incorrect relationships among the decisions.",
      "- A purposeful opportunity to reconsider the relevant decision or justification when revision is warranted — not a mandatory extra writing exercise.",
      "",
      "Avoid commissioning an extended written response when the same disciplinary performance can be elicited through structured decisions and a short justification.",
      "Do not impose this pattern universally. Independent extended writing, multi-field proofs, or sustained professional communication remain appropriate when producing that sustained argument is itself the learning outcome.",
      "",
      "Justification field rules:",
      "- Ask for a specific explanatory relationship, inference, or defence — not a restatement of the selected option labels.",
      "- Keep the justification visually and instructionally associated with the control cluster it defends.",
      "- Do not add extra written fields, reflection questions, or revision exercises that the pattern does not require.",
      "",
      "Hybrid feedback:",
      "- Structured decisions: retain determinate Check answer / diagnostic feedback when a correct key is defined.",
      "- Concise justification: use proportionate criterion-based self-review (typically 2–3 focused criteria; hard max 4) rather than pretending unrestricted mathematical explanations can be marked by simple answer matching.",
      "",
      "Illustrative design exemplars (not hard-coded mathematical templates — adapt to the commission):",
      "- A2-style (rescale / multiplier under equivalent constraint): controls establish how the constraint gradient changes under a rescaling, how the multiplier changes under ∇f=λ∇g, and application of that relationship to a supplied multiplier; concise justification asks why scaling the constraint gradient requires an inverse change in the multiplier.",
      "- A3-style (regularity failure): controls establish that a constructed constraint gradient vanishes on the feasible set, that the usual regularity condition fails, and that extrema remain because the feasible set and objective are unchanged; concise justification asks why failure of the multiplier condition does not mean the constrained extrema disappear.",
      "- A4-style economy (claim defence after prior selections): prefer earlier selection judgements plus ONE integrated template field (e.g. **Improved mathematical defence:**) in which the learner writes a single coherent explanation that identifies the unsupported inference, states what the evidence establishes, and revises the claim — instead of separate fields for \"My initial judgement\", \"Where the claim goes too far\", \"What establishes the extrema\", \"What the cubic shows\", \"Improved claim\", \"Evidence that changed my view\", \"Peer feedback\" and \"Transfer response\" — with optional proportionate checklist and sample_output feedback."
    ];
  }

  function workloadEconomyLines() {
    return [
      "Practice workload economy (Sprint 101F/101G — minimise typing, not thinking):",
      "- Prefer the control-led + concise-justification pattern (above) for compound disciplinary reasoning.",
      "- Prefer one coherent response surface when several requirements concern the same mathematical judgement.",
      "- Use selection clusters for the decision chain; commission one short prose field when explanation/justification is itself needed as learning evidence.",
      "- Do not commission separate textareas for every subclaim, review stage, evidence bullet, peer message and transfer by default.",
      "- Do not automatically commission transfer_prompt, peer-feedback composition, or a full revision triad unless the commission specification or mapped LOs explicitly require them.",
      "- Substantial writing, multi-field proofs, revision and transfer remain valid when the commission or LO genuinely requires them.",
      "- Do not impose rigid numerical quotas on controls, textareas or activity counts."
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
      "- Plan a coherent practice progression for the commission — one substantial activity or several connected activities.",
      "- Prefer activity beats that support control-led compound decisions with an optional concise justification where defence of the judgement matters — without forcing a fixed control taxonomy.",
      "- Sketch rising intellectual demand across the stop(s) using the progressive-interaction heuristic above.",
      "- Do not import standalone Interactive self-study ceremony (mandatory Orient→Teach→Consolidate furniture).",
      "- Preserve beat structure only as needed for valid page assembly and clear activity ordering."
    ];
  }

  function dlaLines() {
    return [
      "Design Learning Activities (Practice):",
      "- Required: unambiguous learner_task, consequential response surface(s), expected production characteristics.",
      "- Optional when justified: purposeful activity_preamble, cognitive scaffolds, hints, worked examples on distinct operands, intellectual_coherence_bridge, revision prompts, criterion self-review.",
      "- Do not require Interactive mandatory bridge-every-activity ceremony or dense table-led defaults.",
      "- Commission response surfaces from the supported repertoire only; bind load-bearing production via response_fulfilment on operational surfaces.",
      "- Discrete mathematical judgements (claim validity, feasibility, stationarity, what evidence establishes, regularity, multiplier relationships): prefer material_type \"selection\" with response_fulfilment { kind: \"learner_workspace\", response_kind: \"selection_choose\" } — one single_select (or matching) per claim/decision — rather than an analysis_table whose cells are free-text essay boxes for every micro-judgement.",
      "- Preferred compound pattern: scenario/task evidence provider → connected selection rows (decision chain) with selection_choose fulfilment → ONE concise independent justification template field covering the explanatory relationship → sample_output / selection feedback → optional checklist diagnostic_review (2–3 distinct criteria) covering the selection (+ justification) material_ids → purposeful revision only when warranted.",
      "- Prefer imaginative composition of existing surfaces inside coherent tasks: e.g. several selection materials for low-friction decisions → optional math field → brief justification → compact checklist; a decision/classification table with short cells; a template that sequences prediction → math field → brief justification; ordering then a compact checklist.",
      "- Ordinary tables and extended text areas remain valid wherever they genuinely support open construction, multi-field proofs, or free-text evaluation that is itself the LO — do not convert substantial proof/revision work into superficial MCQ, and do not use selections that give away the complete explanation.",
      "- Preserve discovery-sequence protections: do not reveal answer-key particulars before independent production when learners must establish them.",
      "- Preserve Check your work, diagnostic checklist criteria, hints, worked/model responses, feedback on reasoning, and revision opportunities when instructionally justified — keep them proportionate (see Check your work / preferred pattern)."
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
      "- Realise the preferred control-led + concise-justification structure when DLA commissions it: validated selection materials for the decision chain, then exactly the commissioned justification template field(s).",
      "- Do not invent transfer_prompt, peer-feedback workspaces, extra revision triad fields, reflection questions, or additional textareas that DLA did not commission.",
      "- Generate stimulus, necessary model/worked example, and substantive feedback/check materials.",
      "- Prefer reveal-after / post-attempt placement for answer-bearing model solutions.",
      "- For table_entry surfaces: author blank learner cells meant for short structured responses (values, labels, brief judgements) — not essay-length cells for every column.",
      "- For templates: emit **Label:** sections matching commissioned response_fields only; preserve input_modality math vs text; do not reinterpret modality; do not expand one commissioned explanation into several overlapping labels.",
      "- Concise justification realisation: one clearly associated writing field; prompt must target a specific explanatory relationship, inference or defence — not \"restate your selections\". Keep the field title/placement instructionally connected to the preceding controls.",
      "- Support MathJax/TeX prose and MathLive math-entry response modalities where the task needs them.",
      "- Compose multi-part activities from existing materials (selection, prompt_set, tables, templates, checklist, worked_example, sample_output) rather than inventing new interaction widgets.",
      "- For selection materials: REQUIRED sibling field selection { form, prompt, options|left/right } — this is not optional prose. Markdown body may hold a short stem only.",
      "- FORBIDDEN for selection: encoding Form: single_select / lettered option lists / <details> correct answers solely in body Markdown. That shape fails GAM validation (GAM-SEL-01) and cannot render native controls.",
      "- Selection GAM shape (illustrative single_select): { \"material_type\": \"selection\", \"title\": \"…\", \"body_format\": \"markdown\", \"body\": \"optional stem\", \"selection\": { \"form\": \"single_select\", \"prompt\": \"Does C2's stated evidence justify its conclusion?\", \"options\": [{ \"key\": \"supported\", \"text\": \"Supported\" }, { \"key\": \"unsupported\", \"text\": \"Unsupported inference\" }, { \"key\": \"incomplete\", \"text\": \"Incomplete argument\" }], \"correct_answer\": \"unsupported\", \"feedback\": \"…\" } }.",
      "- When DLA commissions selection_choose, author one selection material per commissioned judgement (or matching when pairs are the evidence). Keep any brief justification as the commissioned template field(s) only — do not expand every judgement into a long table cell or extra prose field.",
      "- Selection feedback: retain correct keys and misconception-aware rationale for structured decisions.",
      "- Guided-review checklists: when DLA commissions diagnostic_review for a hybrid task, emit a small number of focused criteria (typically 2–3; hard max 4) aimed at the justification relationship and consequential gaps — not one criterion per selected option label; each criterion needs concrete expected/repair pairs.",
      "- Realise learner-facing task prose, prompts, and criterion feature text in clear actionable language (see learner-facing language rules) — not instructional-design specification voice.",
      "- Omit filler exposition rows and ceremonial study-tip packs.",
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
      "- Provide coherent sequencing metadata for progression between activities.",
      "- Prefer an order that supports rising demand and early confidence-building when multiple activities exist — without imposing a mandatory control template.",
      "- Avoid decorative transition furniture and generic study tips."
    ];
  }

  function designPageLines() {
    return [
      "Design Page (Practice):",
      '- Emit artifact_type "page", schema_version "2.0.0", product_id "practice", page_kind "practice".',
      "- Title required.",
      "- page_synthesis orientation: retain concise, skippable Overview, Learning purpose and Knowledge summary so learners can re-enter after a break. Keep them lean. Do not remove these orientation fields to save workload — economy belongs in response production, not in deleting orientation.",
      "- Do not change learner-facing learning outcomes as part of workload economy.",
      "- Study tips / closing essays: omit by default.",
      "- Essential working knowledge may also appear as compact apparatus adjacent to activities when needed at the point of use.",
      "- editorial_opening_image: REQUIRED on every Practice Design Page. Always emit editorial_opening_image at page root with decision \"generate\" and a suitable brief (subject, context, caption_intent, alt_text \"\", detailed_description). It establishes context and visual identity for the Practice stop as a whole — decorative and text-free; no overlays, labels, titles, slogans or banners; do not reveal worked solutions, classifications, or answers learners must develop. Do not use decision \"skip\". Do not omit the field. Do not place it in visual_affordances[].",
      "- visual_affordances / activities_visual_review / visual_affordance_schema_version: use the shared Sprint 38 visual-affordance authoring contract (auto-applied on Design Page). Do not invent slots, decisions, or field shapes.",
      "- Allowed visual_slot values only (generate): activity-after-header | materials-entry | materials-card-grid-after | materials-table-pair-between | assessment-before-checkpoint | knowledge-summary-after-content | section-after-content. Never invent slots such as materials-after-feedback.",
      "- Page-scoped rows (including skip/defer): always emit region \"knowledge_summary\". Prefer empty visual_affordances [] over a page-scoped row that omits region.",
      "- Prefer purposeful conceptual/mathematical imagery when warranted; emit visual_affordances [] when none are justified. Empty instructional visual_affordances is valid and does not remove the required editorial opening image.",
      "- Do not redesign activity interaction surfaces here — DLA/GAM already own response commissioning."
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
      "Canonical Practice Design Page shape (illustrative — visual planning envelope required even when empty):",
      "{",
      '  "artifact_type": "page",',
      '  "schema_version": "2.0.0",',
      '  "product_id": "practice",',
      '  "page_kind": "practice",',
      '  "title": "…",',
      '  "page_synthesis": {',
      '    "overview": { "body": "Concise skippable orientation.", "format": "markdown" },',
      '    "learning_purpose": { "body": "Concise purpose.", "format": "markdown" },',
      '    "knowledge_summary": { "body": "Concise working knowledge for re-entry.", "format": "markdown" }',
      "  },",
      '  "visual_affordance_schema_version": "38.4",',
      '  "activities_visual_review": [],',
      '  "visual_affordances": [],',
      '  "editorial_opening_image": { "decision": "generate", "subject": "…", "context": "…", "caption_intent": "…", "alt_text": "", "detailed_description": "…" },',
      '  "assembly_state": { "current_stage": "design_page", "enriched_by": ["design_page"], "calls_model": true }',
      "}",
      "When commissioning generate/defer/skip instructional rows, follow the auto-applied Sprint 38 visual affordance authoring contract exactly (decision-specific fields, recognised slots only). The editorial opening image remains a separate required page-root generate decision."
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
