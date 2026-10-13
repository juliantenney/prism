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

  var ASSESSMENT_PACK_STEPS = [
    {
      title: "Interpret Evidence Purpose",
      canonical_step_id: "step_interpret_evidence_purpose",
      outputName: "assessment_evidence_purpose"
    },
    {
      title: "Design Evidence Elicitation",
      canonical_step_id: "step_design_evidence_elicitation",
      outputName: "assessment_evidence_elicitation"
    },
    {
      title: "Author Formative Return",
      canonical_step_id: "step_author_formative_return",
      outputName: "assessment_formative_return"
    },
    {
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page"
    }
  ];

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
      r === "situated_task_page" ||
      r === "assessment_pack"
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

  /**
   * The educator's focus is the commission. A structured artefact is requested
   * only when that text asks for one. Learning Journey wording is added only
   * when the commission itself is a Learning Journey commissioning brief.
   */
  function outputCommission(packNote) {
    var lower = String(packNote || "").toLowerCase();
    var journeyBrief = /learning journey/.test(lower) && /commissioning brief|commission brief/.test(lower);
    var structuredArtefact =
      journeyBrief ||
      /structured learner-owned artefact/.test(lower) ||
      /structured learner-owned artifact/.test(lower) ||
      /handoff brief/.test(lower);
    return { journeyBrief: journeyBrief, structuredArtefact: structuredArtefact };
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
        ? "Assessment intent: pretest_diagnostic. The learner is asking what to concentrate on before or instead of assuming the material has been studied. Recommendations later are advisory. The pack does not control the learner's subsequent pathway. Do not design skips, locks, routes, or remediation loops."
        : "Assessment intent: formative_check. The learner is asking how well they understand this. The pack can show an evidence profile. The pack does not control the learner's subsequent pathway. Do not design skips, locks, routes, or remediation loops.";
    var countLine = evidence.countMode === "exact"
      ? "Component count: exactly " +
        evidence.componentCount +
        ". Honour this number when the elicitation is a set of determinate auto-checkable items. Do not treat a small number as if it were broad evidence. Do not split one constructed performance into that count."
      : "Component count: PRISM decides. Choose the smallest reasonable number of determinate items that provides the requested depth of useful formative evidence across these learning outcomes. Do not use a fixed count per outcome, a multiple of the number of outcomes, or fixed counts for Quick, Standard, or Thorough. A single constructed performance is not expanded to meet a count.";
    var depthLine =
      evidence.assessmentDepth === "quick"
        ? "Assessment depth: quick. Seek useful evidence while keeping the pack light. Sparse evidence is acceptable and must stay honest."
        : evidence.assessmentDepth === "thorough"
        ? "Assessment depth: thorough. Seek broader evidence and, where it adds real information, repeated or contrasting opportunities. Do not add components only to raise the count."
        : "Assessment depth: standard. Seek enough varied evidence for a useful formative picture without making the pack longer than the evidence needs.";
    var boundary = [
      "Assessment Pack is formative only. It does not award grades, pass/fail gates, or certification.",
      "Do not introduce runtime AI or automatic judgement of non-determinate learner responses.",
      "Distinguish formative state inspection (R1) from formative capability evidence (R2). role is R1, R2, or R1_and_R2.",
      "Epistemic class is determinate or non_determinate. Do not use mixed as a unit class."
    ];
    var commission = outputCommission(packNote);
    var outputAlways =
      "Structured learner output is optional. Read the grounding context. When it asks the learner to produce a structured artefact they can review, edit, and copy, design this pack backwards from that artefact. When it does not, omit output_specification. Do not emit an empty object. Do not use the action label \"Summarise this assessment\".";
    var purposeOutput = commission.structuredArtefact
      ? [
          "The artefact is the point of this pack. In forward_intent, name its title, who it is for, what the learner will be able to copy, and the learner-facing action that assembles it.",
          "Design the evidence so the later questions collect what that artefact must contain. Do not plan an unrelated check and attach an artefact afterwards.",
          "Do not return output_specification at this stage.",
          commission.journeyBrief
            ? "This commission is a Learning Journey commissioning brief of stated requirements. role is R1. It records what the learner says they need. It is not capability evidence. Do not use R2 for a self-reported goal, confidence, experience, priority, or preference."
            : "Where the artefact needs reasoning this page cannot perform, forward_intent describes a handoff brief of the learner's own words. Do not promise interpretation, diagnosis, or synthesis."
        ].join(" ")
      : "";
    var elicitationOutput = commission.structuredArtefact
      ? [
          "Design the elicitations backwards from the artefact. Each part of the artefact must be supplied by a learner response you author here. Do not design a different set of questions and leave the artefact to be attached later.",
          "Prefer constructed_performance for personal goals, priorities, context, constraints, preferences, and open questions. Use a determinate form only where the subject matter has a defensible answer key. Do not turn self-reported confidence into demonstrated competence. Do not add determinate items only to satisfy a component count.",
          "Author one constructed elicitation for each distinct statement the artefact will quote. Do not collapse those statements into one essay.",
          "The published page can copy response_text, selected options, and a check result of Correct or Not quite plus the authored feedback note. It cannot interpret, diagnose, or synthesise. Where further reasoning is needed, these elicitations are a handoff brief.",
          "Do not return output_specification at this stage. Choose stable elicitation_id values that Design Page can cite.",
          commission.journeyBrief
            ? "Put order, evidence_ask, epistemic_class, and delivery on the elicitation itself. Do not nest them inside evidence_ask. evidence_ask is one string. delivery.prompt is a different string, the learner-facing question. response_workspace.intention is a string such as a short statement in the learner's own words, not the token response_text."
            : "",
          commission.journeyBrief
            ? "This commission is a Learning Journey commissioning brief. The learner will copy the assembled text into an existing Learning Journey workflow as the specification. This page does not submit that workflow. Collect these as separate constructed performances. Each is non_determinate, uses delivery.kind \"constructed_performance\", has a numeric order, a learner-facing delivery.prompt string, and response_workspace.intention as a non-empty string. Do not put these statements in auto_checkable_items, and do not give them form, items, judgement, or auto_checkable. Each uses response_text and has no answer key and no check_result: their learning goal; relevant experience and starting point, as context and as prior experience in the learner's own report; priorities they want to address; available time and practical constraints, including preferences; and open questions. Do not score these statements."
            : "Keep learner-facing tasks in the language of this commission. Do not insert Learning Journey wording unless the commission is about commissioning a Learning Journey."
        ].join(" ")
      : "";
    var formativeOutput = commission.structuredArtefact
      ? [
          "Self-evaluation materials help the learner review what they wrote. They must not claim this page has interpreted, diagnosed, or synthesised those words.",
          "Forward orientation stays advisory. It does not promise a plan, a diagnosis, or a design this page cannot write.",
          "Do not return output_specification at this stage.",
          commission.journeyBrief
            ? "For the commissioning brief, do not tell the learner that this page has commissioned a Learning Journey. The brief is their words, ready to copy."
            : ""
        ]
          .filter(Boolean)
          .join(" ")
      : "";
    var designOutput = commission.structuredArtefact
      ? [
          "Emit assessment_evidence.output_specification. It maps elicitations already designed. Do not invent an elicitation, prompt, option, key, or feedback note to fill a gap.",
          "Closed fields only: specification_id, artefact_title, audience, purpose, action_label, missing_response_text, sections.",
          "Each section has section_id, order as a unique number, heading, and contributions. Contribution order is the array order. Do not put an order field on a contribution. Elicitations and sections still have their own numeric order fields. Copy each elicitation.order number through unchanged. The field name is order.",
          "Each contribution has contribution_id, label, elicitation_id, and response_part. Add item_id only when response_part is selected_options or check_result.",
          "response_part is one of selected_options, check_result, response_text, identified_weakness.",
          "elicitation_id must be an elicitation on this page. For a determinate item, item_id must be that item. Do not put item_id on a constructed response.",
          "check_result is allowed only on a determinate item. It may later repeat Correct or Not quite and that item's authored feedback note. It must not add a diagnosis, a score, or a synthesis.",
          "identified_weakness is allowed only when that elicitation has revision.offered true.",
          "missing_response_text is the sentence shown when the learner has not answered. It acknowledges the gap, for example \"Not stated.\" It does not invent an answer, comment on quality, or propose a remediation.",
          "action_label is the learner-facing assembly action. It must not be \"Summarise this assessment\".",
          "Learner-facing artefact_title, audience, purpose, headings, labels, and action_label follow this commission. Do not insert Learning Journey wording unless this commission is about commissioning a Learning Journey.",
          "Do not add score, grade, proficiency, category, chart, or inferred-gap fields.",
          commission.journeyBrief
            ? "For this Learning Journey commissioning brief, copy each elicitation's numeric order, evidence_ask string, epistemic_class, delivery.kind \"constructed_performance\", delivery.prompt string, and response_workspace.intention string unchanged. Do not move delivery inside evidence_ask. A constructed elicitation is incomplete without those fields. Do not recast a stated requirement as an auto-checkable item. Use response_text for every contribution and do not use check_result. Suitable learner-facing copy for this commission: specification_id \"journey-commissioning-brief\"; artefact_title \"Learning Journey commissioning brief\"; audience \"The person commissioning this learner's Learning Journey\"; purpose \"State the learner's goals, context, constraints, priorities, and open questions for a Learning Journey commission.\"; action_label \"Prepare commissioning brief\"; missing_response_text \"Not stated.\". Sections in order: intended learning goals; context and prior experience, including prior experience labelled as self-reported; constraints and preferences; learner-identified priorities; unanswered questions or missing information. The assembled brief is suitable to paste as specification text. The page does not write that field."
            : ""
        ]
          .filter(Boolean)
          .join(" ")
      : "This commission does not ask for a structured learner-owned artefact. Omit output_specification.";
    var purpose = [
      "You are interpreting the evidence purpose of an Assessment Pack. Do not write finished questions, stems, options, tasks, or formative-return materials.",
      intentLine,
      depthLine,
      "Depth is the ambition of the evidence, not difficulty, a Bloom level, a mastery standard, or a required number of questions per outcome.",
      "Use the Learning Outcomes produced by Define Learning Outcomes in this workflow. They are authoritative. Do not replace them.",
      "Extent: " + evidence.extent + ".",
      countLine,
      mixLine,
      "Consider, without equal quotas: whether each relevant outcome is probed; how many meaningful opportunities address it; whether a further opportunity adds new evidence or only repeats; whether a component can inform more than one outcome; the requested depth; and learner burden.",
      "Record count_basis (why a determinate count was chosen, including whether the author fixed it) and evidence_rationale (how the distribution serves the requested depth) inside purpose or notes you hand forward. Do not return finished questions.",
      "Determinate delivery may later use only these forms:",
      affordances,
      evidence.difficulty && evidence.difficulty !== "not specified" ? "Difficulty: " + evidence.difficulty + "." : "",
      evidence.feedbackTiming === "end_of_pack"
        ? "Feedback timing: end_of_pack. Withhold determinate judgement and the learner-facing note until the pack is finished. Do not design a later item that depends on an earlier one having been marked."
        : "Feedback timing: per_component. Determinate judgement and the learner-facing note are revealed after each item is checked.",
      "Optional weighting: " + (evidence.weighting ? "include a weight on each planned determinate component" : "do not assign weights") + ".",
      "Bind commissioning. If this pack depends on prior learner work, set learner_context.depends_on_prior_work true and bring_forward as [{what, how_used}], both strings written to the learner. Otherwise set depends_on_prior_work false. entry_assumptions, when needed, are short design records of what the pack assumes about the learner. They are not shown to the learner. Learner-facing prerequisites and orientation belong in Design Page sections exposition.",
      "purpose requires role, visibility_claim, stop_rationale, and forward_intent.",
      "Grounding context: " + (packNote || "(none)"),
      outputAlways,
      purposeOutput,
      boundary.join(" "),
      "Return JSON only with artifact_type \"assessment_evidence_purpose\", purpose, and learner_context. Do not return elicitations or formative return."
    ]
      .filter(function (line) {
        return !!line;
      })
      .join("\n");
    var exactAuthor = commission.journeyBrief
      ? "This commission collects stated requirements. Author no determinate items. Do not use delivery.kind \"auto_checkable_items\". Do not record planned_component_forms. Every elicitation is constructed_performance."
      : evidence.componentCount
      ? "Author exactly " +
        evidence.componentCount +
        " determinate items when delivery.kind is auto_checkable_items. Match planned_component_forms exactly. Do not rebalance the mix."
      : "Author the determinate items specified by planned_component_forms. Do not rebalance the mix.";
    var elicitation = [
      "You are designing Assessment Pack elicitation and freezing epistemic class. Consume the evidence-purpose artefact. Do not change purpose, role, or learner_context. Do not author formative-return materials.",
      exactAuthor,
      "Supported determinate forms only: " + supported.join(", ") + ". Use them inside delivery.kind \"auto_checkable_items\".",
      "Put every determinate item in delivery.items. Each item is { item_id, order, form, prompt, judgement, auto_checkable: true }. Do not put form, prompt, or judgement directly on delivery.",
      "A non-determinate unit uses delivery.kind \"constructed_performance\" with prompt and response_workspace.intention. Do not put that performance through auto_checkable items. Do not add judgement, scores, or runtime marking.",
      "Each elicitation needs elicitation_id, order, evidence_ask, epistemic_class (determinate or non_determinate), and delivery. Epistemic class is frozen at this stage.",
      "evidence_ask records the educational performance for the design. It is not shown to the learner on a determinate unit or on a constructed unit. Determinate questions are the item prompt stems. Write those stems to the learner.",
      "For a constructed unit, delivery.prompt is the learner-facing task: a string, a single {stem: string}, or {title, context, task, response_expectation, suggested_length, indicative_time} with every value a non-empty string. The learner also sees instructions and stimulus when they are present. Do not write a direction to the author or to PRISM.",
      "response_workspace.intention names the kind of response for implementation, such as a sustained written judgement. It is not shown to the learner. Do not write an instruction to provide a workspace. response_workspace.guidance, if present, is a short note to the learner about how to respond.",
      "Record planned_component_forms for determinate items. Counts must use only supported forms.",
      "Do not copy learning-outcome statements into this artefact. mapped_learning_outcome_ids holds ids only.",
      "single_answer_mcq: prompt.stem; prompt.options as [{key, text}]; judgement.correct_answer is the one option key. auto_checkable true.",
      "multiple_answer_mcq: prompt.stem; prompt.options as [{key, text}]; judgement.correct_answers is the array of correct option keys. auto_checkable true.",
      "ordering: prompt.stem; prompt.items as [{id, text}] in the initial display order, which must not be the correct order; judgement.correct_order is the authoritative id sequence. auto_checkable true.",
      "classification: prompt.stem; prompt.categories as [{id, label}]; prompt.items as [{id, text}]; judgement.assignments is an object of item id to category id. auto_checkable true.",
      "matching: prompt.stem; prompt.left and prompt.right as [{id, text}]; order prompt.right independently of the correct pairs; judgement.pairs is an object of left id to right id. auto_checkable true.",
      "Do not put keys, correct orders, assignments, or pairs in learner-facing prompt text.",
      "representation is null when a determinate item does not need a visual stimulus. The first implemented kind remains data_figure. authoritative_data must be exact. must_not_show must not appear in labels or alt text. Do not add decorative graphics.",
      "ordering: a later feedback note must explain why that sequence makes conceptual sense. Do not merely restate the order.",
      "classification: a later feedback note reinforces the distinction that makes the categories meaningful. Do not merely name which item belongs where.",
      "Before returning a determinate item, check the keyed answer against only the scenario, stimulus, stem, options, and statements the learner can see. Consider whether a reasonable informed learner could justify another option, category, order, or pair. For a multiple-answer item, check an omitted option the visible evidence also supports and a selected option the visible evidence does not support. Where that ambiguity is material, revise the stem, the statement, the options, or the category boundaries so one key is defensible, or recast the performance as non-determinate. Do not return a confident key while another answer remains equally defensible. A stem that asks for the most justified or best supported conclusion may keep one key when the other options are less defensible on the visible evidence. Record the check as key_defence on the item with learner_evidence, resolution unambiguous or most_justified, and alternatives whose status is less_defensible. Do not use equally_defensible, omitted_but_defensible, included_without_support, or resolution unresolved. A hedged statement assigned to either side of a nested category boundary, such as claim and overclaim, stays ambiguous until the statement or the categories are revised.",
      "matching: a later feedback note explains the relationship the pairs represent. Do not merely restate the pairs.",
      "Do not write author or stage directions such as 'After the attempt', 'reinforce', or 'connect the prior'.",
      "Grounding context: " + (packNote || "(none)"),
      outputAlways,
      elicitationOutput,
      boundary.join(" "),
      "Return JSON only with artifact_type \"assessment_evidence_elicitation\", purpose, learner_context, and elicitations[]. Do not return formative_return."
    ].join("\n");
    var formative = [
      "You are authoring formative return for an Assessment Pack. The epistemic class on each elicitation is frozen. Do not change it. Do not invent a new evidence purpose or a new performance.",
      "Determinate units need explanatory feedback in formative_return.materials as { material_id, body }, or as feedback_note on each object in delivery.items. Do not store that note as formative_return.feedback_note. feedback_note addresses the learner and explains the concept, relationship, distinction, or reason. Do not write only 'correct' or a bare key.",
      "Keep explanatory feedback on the same key as the elicitation. Do not name a different option or category as the answer. Do not introduce quantities, events, or assumptions the learner cannot see. If an item was revised, revise the feedback to match.",
      "Non-determinate units need formative_return.materials sufficient for self-evaluation. A model answer is not mandatory. Do not add a correct key, score, or runtime judgement.",
      "Every unit needs formative_return.forward_orientation as one learner-facing string. The artefact needs pack_forward_orientation as one learner-facing string. Do not wrap either value in an object. Forward meaning is advisory. It does not control the learner's pathway.",
      "Optional revision is { offered: boolean, prompt?: string } on formative_return. Do not make revision a grade.",
      "Preserve bring_forward and entry_assumptions from the purpose artefact.",
      "Grounding context: " + (packNote || "(none)"),
      outputAlways,
      formativeOutput,
      boundary.join(" "),
      "Return JSON only with artifact_type \"assessment_formative_return\", purpose, learner_context, elicitations[] including formative_return, and pack_forward_orientation."
    ].join("\n");
    var design = [
      "You are synthesising the Assessment Pack Design Page. Stages 1–3 are your only semantic input.",
      "Return JSON only with artifact_type \"page\", schema_version \"2.0.0\", product_id \"assessment_pack\", page_kind \"assessment\", title, activities [], assessment_evidence, and editorial_opening_image.",
      "assessment_evidence carries purpose, learner_context, elicitations (evidence_ask, epistemic_class, delivery, formative_return), and pack_forward_orientation. pack_forward_orientation stays one learner-facing string. Include output_specification only when these instructions tell you to emit it.",
      "You may organise learner-facing sections for orientation. activities must be exactly []. Do not copy Interactive learning activities into that array, and do not place elicitations, questions, keys, or feedback there.",
      "Do not invent evidence purpose, elicitation, epistemic class, formative return, or bring-forward. Do not rewrite prompts, options, keys, judgement data, or feedback notes.",
      "Copy determinate delivery as delivery.kind \"auto_checkable_items\" with delivery.items[]. Do not place form, prompt, or judgement directly on delivery. Keep explanatory feedback on item.feedback_note or in formative_return.materials. Do not move it to formative_return.feedback_note.",
      "purpose.visibility_claim, stop_rationale, forward_intent, entry_assumptions, and evidence_ask are design metadata. They are not the learner introduction. Learner-facing orientation and prerequisites belong in sections exposition. Learner-visible prior work belongs in bring_forward. Learner-facing attempt guidance belongs in top-level attempt_instructions. That field must be one string. Several instructions are paragraphs or numbered lines inside that string. Do not use an array. Determinate questions are item prompt stems. A constructed task is delivery.prompt.",
      "Do not invent a stimulus. Do not add a knowledge summary, study tips, or a closing section.",
      "Editorial opening image. Always emit editorial_opening_image at page root as a decision. generate and skip are both legitimate. Image generation is not mandatory, and an image is not required for every assessment.",
      "An editorial opening image serves contextual, atmospheric or orienting purposes. It does not need to convey instructional content. It is not an assessment stimulus, and it is separate from any component representation or instructional data figure.",
      "A short, text-based formative assessment is not automatically a reason to skip an editorial image. Consider whether a restrained, relevant visual could establish the professional setting or subject without revealing answers or directing learner judgements.",
      "For generate, emit {\"decision\":\"generate\",\"subject\":\"...\",\"context\":\"...\",\"caption_intent\":\"...\",\"alt_text\":\"...\",\"detailed_description\":\"...\"}. The image establishes context, atmosphere or relevance.",
      "Do not reveal correct answers, answer sequences, classifications, matches, or other judgement information. Do not imply that a learner has achieved a level of competence. Do not present inferred learner needs, diagnoses, or personal characteristics as facts. Do not embed essential instructions or evidence that are unavailable elsewhere in accessible text.",
      "For an R1 reflective assessment, a contextual or evocative image may be appropriate. It must not pre-empt or dictate the learner's responses. For an R2 assessment, it must not provide clues to assessed items.",
      "For skip, emit {\"decision\":\"skip\",\"skip_reason\":\"...\"} with a short reason when no meaningful contextual image can be commissioned, not merely because the assessment questions are text-based.",
      "An unfulfilled opening image is not a placeholder. Do not emit an empty image slot or the image brief as learner-facing text.",
      "delivery_preferences.feedback_timing may repeat the already chosen per_component or end_of_pack preference. It is not a new educational decision.",
      "Grounding context: " + (packNote || "(none)"),
      outputAlways,
      designOutput,
      intentLine,
      boundary.join(" ")
    ].join("\n");
    return { purpose: purpose, elicitation: elicitation, formative: formative, design: design };
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
    var commission = outputCommission(focus);
    var promptByOutput = {
      assessment_evidence_purpose: prompts.purpose,
      assessment_evidence_elicitation: prompts.elicitation,
      assessment_formative_return: prompts.formative,
      page: prompts.design
    };
    var assessmentSteps = ASSESSMENT_PACK_STEPS.map(function (row) {
      return assessmentStage(
        row.title,
        row.title === "Design Page"
          ? "Synthesise the completed Assessment Pack. Do not invent purpose, elicitation, epistemic class, or formative return. " +
            (commission.structuredArtefact
              ? "Emit output_specification mapped only to the elicitations already designed."
              : "Omit output_specification.")
          : row.title === "Interpret Evidence Purpose"
          ? "Establish why this formative stop exists and what it makes visible. Bind bring-forward or entry assumptions. Do not write items." +
            (commission.structuredArtefact
              ? " Name the requested artefact in forward_intent. Do not write the specification object."
              : "")
          : row.title === "Design Evidence Elicitation"
          ? "Design the evidence-bearing performance and freeze determinate or non-determinate class. Do not author formative return." +
            (commission.structuredArtefact
              ? " When an artefact was requested, design the performances that collect what it must quote."
              : "")
          : "Author the smallest sufficient formative return and forward orientation. Do not reopen epistemic class." +
            (commission.structuredArtefact
              ? " Do not claim the page will interpret or synthesise the artefact."
              : ""),
        row.canonical_step_id,
        row.outputName,
        promptByOutput[row.outputName]
      );
    });
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
    ASSESSMENT_PACK_TITLES: ASSESSMENT_PACK_STEPS.map(function (row) {
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
