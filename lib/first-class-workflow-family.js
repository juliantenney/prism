/**
 * Sprint 88 — documented first-class workflow families.
 * Local instantiation only. Does not call a model and does not rewrite stored graphs.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var LD_SELF_STUDY = "self_study_resource";
  var LD_WORKSHOP = "workshop";
  var LD_EXPOSITORY = "expository_resource";
  var LD_ASSESSMENT_PACK = "assessment_pack";
  var LD_LEARNING_JOURNEY = "learning_journey";
  var LD_SITUATED_TASK = "situated_task";

  var INTERACTIVE_TITLES = [
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Design Episode Plan",
    "Design Learning Activities",
    "Generate Activity Materials",
    "Construct Learning Sequence",
    "Design Page"
  ];

  var EXPOSITORY_TITLES = [
    "Generate Learning Content",
    "Model Knowledge",
    "Define Learning Outcomes",
    "Expository Journey Plan",
    "Expository Development",
    "Expository Materials",
    "Design Page"
  ];

  var LEARNING_JOURNEY_STEPS = [
    {
      title: "Requirements",
      role:
        "Establish the learning need, intended learning, learner context and constraints that the journey must satisfy.",
      outputName: "learning_requirements",
      canonical_step_id: "step_journey_requirements"
    },
    {
      title: "Progression",
      role:
        "Design how the learning should develop over time within the available learning time and duration.",
      outputName: "learning_progression",
      canonical_step_id: "step_journey_progression"
    },
    {
      title: "Elements",
      role:
        "Identify the coherent, learner-manageable educational jobs needed to realise that progression.",
      outputName: "learning_elements",
      canonical_step_id: "step_journey_elements"
    },
    {
      title: "Commissioning",
      role:
        "Translate those educational jobs into appropriately bounded learner experiences for PRISM products, preserving unsupported needs explicitly.",
      outputName: "learning_commissions",
      canonical_step_id: "step_journey_commissioning"
    },
    {
      title: "Design Page",
      role:
        "Synthesise the established Learning Journey reasoning into the structured Learning Journey Design Page artefact.",
      outputName: "learning_journey_page",
      canonical_step_id: "step_design_page"
    }
  ];

  var ASSESSMENT_PACK_TITLES = ["Plan Assessment Evidence", "Author Assessment Components"];

  var SITUATED_TASK_STEPS = [
    {
      title: "Situation",
      role:
        "Establish why situated activity is educationally warranted and what authentic circumstances the design must work within.",
      outputName: "situated_situation",
      canonical_step_id: "step_situated_situation"
    },
    {
      title: "Activity",
      role: "Design the substantive purposeful activity the learner will actually undertake.",
      outputName: "situated_activity",
      canonical_step_id: "step_situated_activity"
    },
    {
      title: "Support",
      role:
        "Determine what support enables productive action without PRISM taking over the substantive learning.",
      outputName: "situated_support",
      canonical_step_id: "step_situated_support"
    },
    {
      title: "Learning Return",
      role:
        "Determine what must survive the experience educationally and how subsequent learning will use it.",
      outputName: "situated_learning_return",
      canonical_step_id: "step_situated_learning_return"
    },
    {
      title: "Design Page",
      role:
        "Synthesise the established Situated Task reasoning into the structured Design Page artefact.",
      outputName: "situated_task_page",
      canonical_step_id: "step_design_page"
    }
  ];

  /**
   * First-class products. Custom, Research, and unknown workflows are not members.
   * Create choices are declarations of these products (Workshop is an Interactive
   * variant, not a separate product). Learning Journey is optional orchestration.
   * acceptsCommission is family-declared and not implied by first-class status alone.
   */
  var FIRST_CLASS_PRODUCTS = [
    {
      id: "interactive",
      label: "Interactive",
      promptRoute: "interactive",
      publishRoute: "learner_page",
      acceptsCommission: true
    },
    {
      id: "expository",
      label: "Expository",
      promptRoute: "expository",
      publishRoute: "expository_page",
      acceptsCommission: true
    },
    {
      id: "assessment_pack",
      label: "Assessment Pack",
      promptRoute: "assessment",
      publishRoute: "assessment_pack",
      parameterHook: "assessment_pack",
      acceptsProductOutputFrom: ["interactive", "expository"],
      acceptsCommission: true
    },
    {
      id: "learning_journey",
      label: "Learning Journey",
      promptRoute: "learning_journey",
      publishRoute: "learning_journey_page"
    },
    {
      id: "situated_task",
      label: "Situated Task",
      promptRoute: "situated_task",
      publishRoute: "situated_task_page",
      acceptsCommission: true
    }
  ];

  var CREATE_DECLARATIONS = [
    {
      value: LD_SELF_STUDY,
      label: "Self-study resource",
      product: "interactive",
      variant: "self_study"
    },
    {
      value: LD_WORKSHOP,
      label: "Workshop",
      product: "interactive",
      variant: "workshop"
    },
    {
      value: LD_EXPOSITORY,
      label: "Expository Resource",
      product: "expository",
      variant: ""
    },
    {
      value: LD_ASSESSMENT_PACK,
      label: "Assessment Pack",
      product: "assessment_pack",
      variant: "",
      parameterHook: "assessment_pack"
    },
    {
      value: LD_LEARNING_JOURNEY,
      label: "Learning Journey",
      product: "learning_journey",
      variant: "",
      parameterHook: "learning_journey"
    },
    {
      value: LD_SITUATED_TASK,
      label: "Situated Task",
      product: "situated_task",
      variant: ""
    }
  ];

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function productRecord(productId) {
    var id = asTrimmed(productId);
    var i;
    for (i = 0; i < FIRST_CLASS_PRODUCTS.length; i += 1) {
      if (FIRST_CLASS_PRODUCTS[i].id === id) return FIRST_CLASS_PRODUCTS[i];
    }
    return null;
  }

  function listFirstClassProducts() {
    return cloneJson(FIRST_CLASS_PRODUCTS);
  }

  function listCreateDeclarations() {
    return cloneJson(CREATE_DECLARATIONS);
  }

  function createDeclarationForValue(raw) {
    var value = asTrimmed(raw);
    var i;
    for (i = 0; i < CREATE_DECLARATIONS.length; i += 1) {
      if (CREATE_DECLARATIONS[i].value === value) return cloneJson(CREATE_DECLARATIONS[i]);
    }
    return null;
  }

  function promptRouteForWorkflow(workflow) {
    var identity = readFirstClassIdentity(workflow);
    var record = productRecord(identity && identity.product);
    return record ? record.promptRoute : "generic";
  }

  function publishRouteForWorkflow(workflow) {
    var identity = readFirstClassIdentity(workflow);
    var record = productRecord(identity && identity.product);
    return record ? record.publishRoute : "";
  }

  /**
   * Page-based LearnerPackage publish routes share the authoritative assembled-page
   * → shared renderer → LearnerPackage path (no product-specific ZIP builder).
   */
  function isPageBasedLearnerPublishRoute(route) {
    var r = asTrimmed(route);
    return (
      r === "learner_page" ||
      r === "expository_page" ||
      r === "situated_task_page"
    );
  }

  var INTERACTIVE_MIDDLE = [
    "Design Episode Plan",
    "Design Learning Activities",
    "Generate Activity Materials",
    "Construct Learning Sequence"
  ];

  function asTrimmed(value) {
    return String(value == null ? "" : value).trim();
  }

  function mirrorLdCreateOutputType(identity) {
    if (!identity || identity.product === "expository") return LD_EXPOSITORY;
    if (identity.product === "assessment_pack") return LD_ASSESSMENT_PACK;
    if (identity.product === "learning_journey") return LD_LEARNING_JOURNEY;
    if (identity.product === "situated_task") return LD_SITUATED_TASK;
    if (identity.variant === "workshop") return LD_WORKSHOP;
    if (identity.variant === "self_study") return LD_SELF_STUDY;
    return "";
  }

  function identityFromLdCreateOutputType(kind) {
    var normalized = asTrimmed(kind);
    if (normalized === LD_SELF_STUDY) {
      return { product: "interactive", variant: "self_study" };
    }
    if (normalized === LD_WORKSHOP) {
      return { product: "interactive", variant: "workshop" };
    }
    if (normalized === LD_EXPOSITORY) {
      return { product: "expository", variant: "" };
    }
    if (normalized === LD_ASSESSMENT_PACK) {
      return { product: "assessment_pack", variant: "" };
    }
    if (normalized === LD_LEARNING_JOURNEY) {
      return { product: "learning_journey", variant: "" };
    }
    if (normalized === LD_SITUATED_TASK) {
      return { product: "situated_task", variant: "" };
    }
    return null;
  }

  /**
   * Read identity without mutating the workflow.
   * Stored product/variant/startingPoint win. Otherwise map legacy ldCreateOutputType.
   * Absent legacy type does not invent a product.
   */
  function readFirstClassIdentity(workflow) {
    var wf = workflow && typeof workflow === "object" ? workflow : {};
    var product = asTrimmed(wf.product);
    if (productRecord(product)) {
      return {
        product: product,
        variant: product === "interactive" ? asTrimmed(wf.variant) : "",
        startingPoint: asTrimmed(wf.startingPoint),
        ldCreateOutputType: asTrimmed(wf.ldCreateOutputType),
        source: "stored"
      };
    }
    var fromLegacy = identityFromLdCreateOutputType(wf.ldCreateOutputType);
    if (!fromLegacy) {
      return {
        product: "",
        variant: "",
        startingPoint: "",
        ldCreateOutputType: asTrimmed(wf.ldCreateOutputType),
        source: "unknown"
      };
    }
    return {
      product: fromLegacy.product,
      variant: fromLegacy.variant,
      startingPoint: asTrimmed(wf.startingPoint),
      ldCreateOutputType: asTrimmed(wf.ldCreateOutputType),
      source: "legacy_ldCreateOutputType"
    };
  }

  function normalizeStartingPoint(raw) {
    var value = asTrimmed(raw);
    if (value === "topic" || value === "generate_from_topic") return "topic";
    if (value === "product_output") return "product_output";
    if (
      value === "authoritative_source" ||
      value === "provided_source_content" ||
      value === "mixed"
    ) {
      return "authoritative_source";
    }
    return "";
  }

  function normalizeComponentCount(value) {
    var n = Number(value);
    if (!isFinite(n)) return null;
    n = Math.round(n);
    if (n < 1) return null;
    return n;
  }

  function deliverySeedForIdentity(identity) {
    if (!identity) return {};
    if (identity.product === "learning_journey") {
      return {
        delivery_context: "self_directed",
        delivery_mode: "async",
        delivery_pattern: "mostly_online",
        page_profile: "author",
        activities_required: false,
        materials_required: false,
        design_scope: "journey",
        session_materials: ["page"]
      };
    }
    if (identity.product === "situated_task") {
      return {
        delivery_context: "self_directed",
        delivery_mode: "async",
        delivery_pattern: "mostly_online",
        page_profile: "learner",
        activities_required: false,
        materials_required: false,
        design_scope: "session",
        session_materials: ["page"]
      };
    }
    if (identity.product === "expository") {
      return {
        delivery_context: "self_directed",
        delivery_mode: "async",
        delivery_pattern: "mostly_online",
        page_profile: "learner",
        activities_required: false,
        materials_required: false,
        design_scope: "session",
        session_materials: ["page"]
      };
    }
    if (identity.variant === "workshop") {
      return {
        delivery_mode: "live_workshop",
        delivery_context: "in_person",
        delivery_pattern: "face_to_face",
        learning_environments: ["classroom"],
        design_scope: "session",
        session_materials: ["page"]
      };
    }
    return {
      delivery_context: "self_directed",
      delivery_mode: "async",
      delivery_pattern: "mostly_online",
      page_profile: "learner",
      design_scope: "session",
      session_materials: ["page"]
    };
  }

  function normalizeLearningOutcomesSnapshot(value) {
    if (!value) return null;
    if (Array.isArray(value) && value.length) return { learning_outcomes: value };
    if (typeof value === "object" && Array.isArray(value.learning_outcomes) && value.learning_outcomes.length) {
      return { learning_outcomes: value.learning_outcomes };
    }
    return null;
  }

  function assessmentFormsApi() {
    if (typeof require === "function") {
      try {
        return require("./assessment-component-forms.js");
      } catch (e) {}
    }
    var host = typeof globalThis !== "undefined" ? globalThis : this;
    return host && host.PRISM_ASSESSMENT_COMPONENT_FORMS ? host.PRISM_ASSESSMENT_COMPONENT_FORMS : null;
  }

  function resolveAssessmentIntent(opts) {
    var explicit = asTrimmed(opts.assessmentIntent || opts.intent);
    if (explicit === "pretest_diagnostic" || explicit === "formative_check") return explicit;
    if (opts.diagnosticIntent) return "pretest_diagnostic";
    return "formative_check";
  }

  function resolveAssessmentDepth(opts) {
    var value = asTrimmed(opts.assessmentDepth || opts.depth);
    if (value === "quick" || value === "thorough" || value === "standard") return value;
    return "standard";
  }

  function resolveFeedbackTiming(opts) {
    var value = asTrimmed(opts.feedbackTiming);
    if (value === "end_of_pack") return "end_of_pack";
    return "per_component";
  }

  function buildAssessmentPackPrompts(evidence, packNote) {
    var forms = assessmentFormsApi();
    var supported = forms ? forms.SUPPORTED_FORMS : [];
    var affordances = supported
      .map(function (form) {
        return "- " + form + ": " + (forms.AFFORDANCES[form] || "");
      })
      .join("\n");
    var mixLine =
      "Component mix: PRISM decides. Choose only from the supported forms. Choose a form because that interaction elicits the required evidence, not to create variety.";
    var intentLine =
      evidence.assessmentIntent === "pretest_diagnostic"
        ? "Assessment intent: pretest_diagnostic. The learner is asking what to concentrate on before or instead of assuming the material has been studied. Recommendations later are advisory. Do not design skips, locks, routes, or remediation loops."
        : "Assessment intent: formative_check. The learner is asking how well they understand this. The pack checks responses and can show an evidence profile. Do not design skips, locks, routes, or remediation loops.";
    var countLine = evidence.countMode === "exact"
      ? "Component count: exactly " +
        evidence.componentCount +
        ". Honour this number. Design the strongest sensible evidence plan within it. Do not treat a small number as if it were broad evidence."
      : "Component count: PRISM decides. Choose the smallest reasonable number of components that provides the requested depth of useful formative evidence across these learning outcomes. Do not use a fixed count per outcome, a multiple of the number of outcomes, or fixed counts for Quick, Standard, or Thorough.";
    var depthLine =
      evidence.assessmentDepth === "quick"
        ? "Assessment depth: quick. Seek useful evidence while keeping the pack light. Sparse evidence is acceptable and must stay honest."
        : evidence.assessmentDepth === "thorough"
        ? "Assessment depth: thorough. Seek broader evidence and, where it adds real information, repeated or contrasting opportunities. Do not add components only to raise the count."
        : "Assessment depth: standard. Seek enough varied evidence for a useful formative picture without making the pack longer than the evidence needs.";
    var plan = [
      "You are planning an Assessment Pack. This stage is assessment design. Do not write finished questions, stems, options, or tasks.",
      "Assessment Pack is a formative product. It gathers interpretable evidence, supports deterministic checking, and can later recommend what the learner should concentrate on. It does not control the learner's subsequent pathway.",
      intentLine,
      depthLine,
      "Depth is the ambition of the evidence, not difficulty, a Bloom level, a mastery standard, or a required number of questions per outcome.",
      "Use the Learning Outcomes produced by Define Learning Outcomes in this workflow. They are authoritative. Do not replace them.",
      "Extent: " + evidence.extent + ".",
      countLine,
      mixLine,
      "Consider, without equal quotas: whether each relevant outcome is probed; how many meaningful opportunities address it; whether a further opportunity adds new evidence or only repeats; whether a component can inform more than one outcome; the requested depth; and learner burden.",
      "Record planned_component_count, count_basis (why that count was chosen, including whether the author fixed it), and evidence_rationale (how the distribution serves the requested depth).",
      "Supported component forms, and only these forms:",
      affordances,
      evidence.difficulty && evidence.difficulty !== "not specified" ? "Difficulty: " + evidence.difficulty + "." : "",
      evidence.feedbackTiming === "end_of_pack"
        ? "Feedback timing: end_of_pack. Withhold judgement and the learner-facing note until the pack is finished. Do not design a later component that depends on an earlier one having been marked."
        : "Feedback timing: per_component. Judgement and the learner-facing note are revealed after each component is checked.",
      "Optional weighting: " + (evidence.weighting ? "include a weight on each planned component" : "do not assign weights") + ".",
      "Grounding context: " + (packNote || "(none)"),
      "Return JSON only with artifact_type \"evidence_plan\". Include outcome_coverage, planned_component_count, count_basis, evidence_rationale, planned_component_forms (array of {form, count, outcome_ids}), and judgement_means. Counts in planned_component_forms must sum to planned_component_count and must use only supported forms. Do not return finished questions."
    ]
      .filter(function (line) {
        return !!line;
      })
      .join("\n");
    var authorCount = evidence.componentCount
      ? "Author exactly " +
        evidence.componentCount +
        " components. Match planned_component_forms exactly. Do not rebalance the mix."
      : "Author the components specified by planned_component_forms. Do not rebalance the mix.";
    var author = [
      "You are authoring Assessment Pack components from an evidence plan. Do not change the learning outcomes or the evidence plan.",
      authorCount,
      "Supported forms only: " + supported.join(", ") + ". Do not author short constructed responses, essays, numeric entry, or forms outside that list.",
      "Each component needs: id; form; mapped_learning_outcomes (outcome ids only); prompt; judgement; feedback_note; representation.",
      "Do not copy learning-outcome statements into this artefact. Record only the outcome ids. Assembly reads the statements from the Learning Outcomes artefact.",
      "feedback_note is published to the learner after they check. Address the learner directly. For every form it must explain the concept, relationship, distinction, or reason. Do not write only 'correct', 'incorrect', or a bare answer, order, classification, or pair list.",
      "single_answer_mcq: feedback_note explains why the correct interpretation is the one that fits.",
      "multiple_answer_mcq: feedback_note explains the set, including why a missing correct choice or an extra incorrect choice matters.",
      "ordering: feedback_note explains why that sequence makes conceptual sense. Do not merely restate the order.",
      "classification: feedback_note reinforces the distinction that makes the categories meaningful. Do not merely name which item belongs where.",
      "matching: feedback_note explains the relationship the pairs represent. Do not merely restate the pairs.",
      "Do not write author or stage directions such as 'After the attempt', 'reinforce', or 'connect the prior'.",
      "single_answer_mcq: prompt.stem; prompt.options as [{key, text}]; judgement.correct_answer is the one option key. auto_checkable true.",
      "multiple_answer_mcq: prompt.stem; prompt.options as [{key, text}]; judgement.correct_answers is the array of correct option keys. auto_checkable true.",
      "ordering: prompt.stem; prompt.items as [{id, text}] in the initial display order, which must not be the correct order; judgement.correct_order is the authoritative id sequence. auto_checkable true.",
      "classification: prompt.stem; prompt.categories as [{id, label}]; prompt.items as [{id, text}]; judgement.assignments is an object of item id to category id. auto_checkable true.",
      "matching: prompt.stem; prompt.left and prompt.right as [{id, text}]; order prompt.right independently of the correct pairs; judgement.pairs is an object of left id to right id. auto_checkable true.",
      "Do not put keys, correct orders, assignments, or pairs in learner-facing prompt text.",
      "representation is null when the component does not need a visual stimulus. The first implemented kind remains data_figure. authoritative_data must be exact. must_not_show must not appear in labels or alt text. Do not add decorative graphics.",
      "Return JSON only with artifact_type \"assessment_pack\", evidence_plan_ref including assessment_intent, and components[]. mapped_learning_outcomes on each component holds ids only."
    ].join("\n");
    var design = [
      "You are designing the learner-facing presentation of a completed Assessment Pack.",
      "The assessment_pack artefact is your only semantic input.",
      intentLine,
      "Write a concise learner-facing title. You may write concise attempt_instructions. You may write a short learner-facing framing sentence for this intent.",
      "Do not write raw configuration such as 'Purpose: formative'. Do not write 'Self assessment'.",
      "Do not rewrite prompts, options, keys, judgement data, feedback notes, or representation commissions.",
      "Do not invent a stimulus. Do not add a knowledge summary, study tips, or a closing section.",
      "Return JSON only with artifact_type \"assessment_design_page\", title, attempt_instructions, framing, and assessment_intent. Do not return the components."
    ].join("\n");
    return { plan: plan, author: author, design: design };
  }

  function assessmentStage(title, role, canonicalStepId, outputName, promptBody) {
    return {
      title: title,
      role: role,
      canonical_step_id: canonicalStepId,
      outputName: outputName,
      promptBody: promptBody
    };
  }

  function upstreamLearningDesignSteps(includeNormalize) {
    var titles = [
      "Generate Learning Content",
      "Model Knowledge",
      "Define Learning Outcomes"
    ];
    if (includeNormalize) titles.unshift("Normalize Content");
    return titles.map(function (title) {
      return { title: title, role: "" };
    });
  }

  function findTerminalProductStep(workflow) {
    var steps = workflow && Array.isArray(workflow.steps) ? workflow.steps : [];
    var i;
    for (i = 0; i < steps.length; i += 1) {
      var step = steps[i];
      var cid = asTrimmed(step && (step.canonical_step_id || step.canonicalStepId)).toLowerCase();
      var title = asTrimmed(step && step.title).toLowerCase();
      if (cid === "step_design_page" || title === "design page") return step;
    }
    return null;
  }

  /**
   * A completed Interactive or Expository product output is the Design Page capture.
   * Internal stages such as Learning Outcomes are not the selectable input.
   */
  function readFirstClassProductOutput(workflow, capturedOutputs) {
    var identity = readFirstClassIdentity(workflow);
    var assessment = productRecord("assessment_pack");
    var accepted =
      assessment && Array.isArray(assessment.acceptsProductOutputFrom)
        ? assessment.acceptsProductOutputFrom
        : [];
    if (!identity || accepted.indexOf(identity.product) === -1) {
      return { ok: false, code: "not_first_class_product" };
    }
    var step = findTerminalProductStep(workflow);
    if (!step || !step.id) return { ok: false, code: "no_product_output" };
    var map = capturedOutputs && typeof capturedOutputs === "object" ? capturedOutputs : {};
    var text = asTrimmed(map[String(step.id)]);
    if (!text) return { ok: false, code: "no_product_output" };
    return {
      ok: true,
      product: identity.product,
      workflowId: asTrimmed(workflow.id),
      stepId: String(step.id),
      sourceText: text
    };
  }

  function buildAssessmentPackFamily(opts, focus) {
    var sourceWorkflowId = asTrimmed(opts.sourceWorkflowId);
    var requestedStart = normalizeStartingPoint(opts.startingPoint || opts.startingArtefact);
    var intent = resolveAssessmentIntent(opts);
    var weighting = !!opts.weighting;
    var componentCount = normalizeComponentCount(opts.componentCount);
    var forms = assessmentFormsApi();
    var requestedMode = asTrimmed(opts.componentCountMode);
    var countMode = requestedMode === "auto" || requestedMode === "exact" ? requestedMode : "";
    if (!countMode) countMode = componentCount != null ? "exact" : "auto";
    if (countMode === "exact" && componentCount == null) {
      return { ok: false, code: "component_count_required" };
    }
    if (countMode !== "exact") {
      componentCount = null;
      countMode = "auto";
    }
    var assessmentDepth = resolveAssessmentDepth(opts);
    var feedbackTiming = resolveFeedbackTiming(opts);
    var evidence = {
      assessmentIntent: intent,
      assessmentDepth: assessmentDepth,
      countMode: countMode,
      extent: asTrimmed(opts.extent || opts.scopeScale) || "a short pack",
      difficulty: asTrimmed(opts.difficulty) || "not specified",
      componentCount: componentCount,
      componentMix: "prism_decides",
      responseForms: forms ? forms.SUPPORTED_FORMS.slice() : [],
      feedbackTiming: feedbackTiming,
      feedbackPosture: asTrimmed(opts.feedbackPosture) || "after_attempt",
      weighting: weighting
    };
    if (!focus) return { ok: false, code: "focus_required" };
    var startingPoint = "topic";
    var prefix = upstreamLearningDesignSteps(false);
    if (requestedStart === "authoritative_source" || requestedStart === "product_output") {
      startingPoint = requestedStart;
      prefix = upstreamLearningDesignSteps(true);
    }
    var prompts = buildAssessmentPackPrompts(evidence, focus);
    var assessmentSteps = [
      assessmentStage(
        ASSESSMENT_PACK_TITLES[0],
        "Design the evidence by which intended learning could be judged. Do not write questions.",
        "step_plan_assessment_evidence",
        "evidence_plan",
        prompts.plan
      ),
      assessmentStage(
        ASSESSMENT_PACK_TITLES[1],
        "Author the learner-facing components that elicit the planned evidence.",
        "step_author_assessment_components",
        "assessment_pack",
        prompts.author
      ),
      assessmentStage(
        "Design Page",
        "Present the completed Assessment Pack. Do not rewrite its components or invent stimuli.",
        "step_design_page",
        "assessment_design_page",
        prompts.design
      )
    ];
    var steps = prefix.concat(assessmentSteps);
    var identity = {
      product: "assessment_pack",
      variant: "",
      startingPoint: startingPoint,
      ldCreateOutputType: LD_ASSESSMENT_PACK
    };
    if (startingPoint === "product_output" && sourceWorkflowId) identity.sourceWorkflowId = sourceWorkflowId;
    if (startingPoint === "product_output" && asTrimmed(opts.sourceProduct)) {
      identity.sourceProduct = asTrimmed(opts.sourceProduct);
    }
    return {
      ok: true,
      callsModel: false,
      identity: identity,
      steps: steps,
      titles: steps.map(function (step) { return step.title; }),
      deliverySeed: {
        assessment_intent: intent,
        assessment_depth: assessmentDepth,
        assessment_purpose: "formative",
        diagnostic_intent: intent === "pretest_diagnostic",
        component_count_mode: countMode,
        component_mix: "prism_decides",
        weighting: weighting,
        target_component_count: componentCount,
        feedback_timing: feedbackTiming,
        topic: focus
      },
      interactiveMiddle: INTERACTIVE_MIDDLE.slice()
    };
  }

  function buildLearningJourneyFamily(opts, focus) {
    if (!focus) return { ok: false, code: "focus_required" };
    var startingPoint = normalizeStartingPoint(opts.startingPoint || opts.startingArtefact) || "topic";
    var learningTime = asTrimmed(opts.learningTime);
    var duration = asTrimmed(opts.duration);
    var audience = asTrimmed(opts.audience || opts.learnerAudience);
    var sourceContext = asTrimmed(opts.sourceContext || opts.inputs);
    var constraints = asTrimmed(opts.constraints || opts.scopeConstraints);
    var originalBriefParts = [];
    originalBriefParts.push("PURPOSE / FOCUS\n" + focus);
    if (audience) originalBriefParts.push("LEARNERS / AUDIENCE\n" + audience);
    if (learningTime) originalBriefParts.push("LEARNING TIME\n" + learningTime);
    if (duration) originalBriefParts.push("DURATION\n" + duration);
    if (sourceContext) originalBriefParts.push("BODY OF KNOWLEDGE / SOURCE MATERIAL\n" + sourceContext);
    if (constraints) originalBriefParts.push("CONSTRAINTS / ADDITIONAL CONTEXT\n" + constraints);
    var originalBrief = originalBriefParts.join("\n\n");
    var steps = LEARNING_JOURNEY_STEPS.map(function (row) {
      return {
        title: row.title,
        role: row.role || "",
        outputName: row.outputName,
        canonical_step_id: row.canonical_step_id
      };
    });
    var identity = {
      product: "learning_journey",
      variant: "",
      startingPoint: startingPoint,
      ldCreateOutputType: LD_LEARNING_JOURNEY
    };
    var deliverySeed = deliverySeedForIdentity(identity);
    deliverySeed.topic = focus;
    if (audience) deliverySeed.audience = audience;
    if (learningTime) deliverySeed.learning_time = learningTime;
    if (duration) deliverySeed.duration = duration;
    if (sourceContext) deliverySeed.source_context = sourceContext;
    if (constraints) deliverySeed.constraints = constraints;
    deliverySeed.original_brief = originalBrief;
    return {
      ok: true,
      callsModel: false,
      identity: identity,
      steps: steps,
      titles: steps.map(function (step) {
        return step.title;
      }),
      deliverySeed: deliverySeed,
      interactiveMiddle: []
    };
  }

  function buildSituatedTaskFamily(opts, focus) {
    if (!focus) return { ok: false, code: "focus_required" };
    var startingPoint = normalizeStartingPoint(opts.startingPoint || opts.startingArtefact) || "topic";
    var audience = asTrimmed(opts.audience || opts.learnerAudience);
    var sourceContext = asTrimmed(opts.sourceContext || opts.inputs);
    var constraints = asTrimmed(opts.constraints || opts.scopeConstraints);
    var originalBriefParts = [];
    originalBriefParts.push("PURPOSE / FOCUS\n" + focus);
    if (audience) originalBriefParts.push("LEARNERS / AUDIENCE\n" + audience);
    if (sourceContext) originalBriefParts.push("SOURCE / CONTEXT MATERIAL\n" + sourceContext);
    if (constraints) originalBriefParts.push("CONSTRAINTS / ADDITIONAL CONTEXT\n" + constraints);
    var originalBrief = originalBriefParts.join("\n\n");
    var steps = SITUATED_TASK_STEPS.map(function (row) {
      return {
        title: row.title,
        role: row.role || "",
        outputName: row.outputName,
        canonical_step_id: row.canonical_step_id
      };
    });
    var identity = {
      product: "situated_task",
      variant: "",
      startingPoint: startingPoint,
      ldCreateOutputType: LD_SITUATED_TASK
    };
    var deliverySeed = deliverySeedForIdentity(identity);
    deliverySeed.topic = focus;
    if (audience) deliverySeed.audience = audience;
    if (sourceContext) deliverySeed.source_context = sourceContext;
    if (constraints) deliverySeed.constraints = constraints;
    deliverySeed.original_brief = originalBrief;
    return {
      ok: true,
      callsModel: false,
      identity: identity,
      steps: steps,
      titles: steps.map(function (step) {
        return step.title;
      }),
      deliverySeed: deliverySeed,
      interactiveMiddle: []
    };
  }

  function buildFirstClassWorkflowFamily(input) {
    var opts = input && typeof input === "object" ? input : {};
    var fromType = identityFromLdCreateOutputType(opts.ldCreateOutputType);
    var product = asTrimmed(opts.product) || (fromType && fromType.product) || "";
    var variant = asTrimmed(opts.variant);
    if (!variant && fromType) variant = fromType.variant;
    var startingPoint = normalizeStartingPoint(opts.startingPoint || opts.startingArtefact);
    var focus = asTrimmed(opts.focus);

    if (product === "assessment_pack") {
      return buildAssessmentPackFamily(opts, focus);
    }
    if (product === "learning_journey") {
      return buildLearningJourneyFamily(opts, focus);
    }
    if (product === "situated_task") {
      return buildSituatedTaskFamily(opts, focus);
    }
    if (product !== "interactive" && product !== "expository") {
      return { ok: false, code: "unknown_product" };
    }
    if (product === "interactive" && variant !== "self_study" && variant !== "workshop") {
      return { ok: false, code: "variant_required" };
    }
    if (product === "expository") variant = "";
    if (!focus) return { ok: false, code: "focus_required" };
    if (!startingPoint) return { ok: false, code: "starting_point_required" };

    var identity = {
      product: product,
      variant: variant,
      startingPoint: startingPoint
    };
    identity.ldCreateOutputType = mirrorLdCreateOutputType(identity);

    var titles = product === "expository" ? EXPOSITORY_TITLES.slice() : INTERACTIVE_TITLES.slice();
    if (startingPoint === "authoritative_source") {
      titles.unshift("Normalize Content");
    }
    var steps = titles.map(function (title) {
      return { title: title, role: "" };
    });
    var deliverySeed = deliverySeedForIdentity(identity);
    deliverySeed.topic = focus;
    if (opts.learnerLevel) deliverySeed.learner_level = asTrimmed(opts.learnerLevel);
    if (opts.audience) deliverySeed.audience = asTrimmed(opts.audience);
    if (opts.scopeScale) deliverySeed.scope_scale = asTrimmed(opts.scopeScale);

    return {
      ok: true,
      callsModel: false,
      identity: identity,
      steps: steps,
      titles: titles,
      deliverySeed: deliverySeed,
      interactiveMiddle: INTERACTIVE_MIDDLE.slice()
    };
  }

  function productAcceptsCommission(productId) {
    var record = productRecord(productId);
    return !!(record && record.acceptsCommission === true);
  }

  return {
    LD_SELF_STUDY: LD_SELF_STUDY,
    LD_WORKSHOP: LD_WORKSHOP,
    LD_EXPOSITORY: LD_EXPOSITORY,
    LD_ASSESSMENT_PACK: LD_ASSESSMENT_PACK,
    LD_LEARNING_JOURNEY: LD_LEARNING_JOURNEY,
    LD_SITUATED_TASK: LD_SITUATED_TASK,
    INTERACTIVE_TITLES: INTERACTIVE_TITLES.slice(),
    EXPOSITORY_TITLES: EXPOSITORY_TITLES.slice(),
    LEARNING_JOURNEY_TITLES: LEARNING_JOURNEY_STEPS.map(function (row) {
      return row.title;
    }),
    SITUATED_TASK_TITLES: SITUATED_TASK_STEPS.map(function (row) {
      return row.title;
    }),

    readFirstClassIdentity: readFirstClassIdentity,
    listFirstClassProducts: listFirstClassProducts,
    listCreateDeclarations: listCreateDeclarations,
    createDeclarationForValue: createDeclarationForValue,
    promptRouteForWorkflow: promptRouteForWorkflow,
    publishRouteForWorkflow: publishRouteForWorkflow,
    isPageBasedLearnerPublishRoute: isPageBasedLearnerPublishRoute,
    productAcceptsCommission: productAcceptsCommission,
    normalizeLearningOutcomesSnapshot: normalizeLearningOutcomesSnapshot,
    readFirstClassProductOutput: readFirstClassProductOutput,
    buildFirstClassWorkflowFamily: buildFirstClassWorkflowFamily,
    normalizeStartingPoint: normalizeStartingPoint
  };
});
