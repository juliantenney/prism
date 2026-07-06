/**
 * EDUCATIONAL-QUALITY-FRAMEWORK — Sprint 41 runtime prompt contract.
 * Injects Sprint 40 Educational Quality Framework guidance into LD generation prompts.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_EDUCATIONAL_QUALITY_FRAMEWORK = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "EDUCATIONAL-QUALITY-FRAMEWORK";
  var MARKER = "EDUCATIONAL-QUALITY-FRAMEWORK (auto-applied)";

  var TARGET_CANONICAL_STEP_IDS = {
    step_construct_learning_sequence: true,
    step_design_learning_activities: true,
    step_generate_activity_materials: true,
    step_design_assessment: true,
    step_generate_assessment_items: true,
    step_design_feedback: true
  };

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " + MODULE_ID + " | Sprint 40 Educational Quality Framework (runtime prompt contract)",
    "- Learner journey: the learner journey is the primary design unit — generate a coherent learner-development journey, not disconnected content pages or activity collections.",
    "- Learner transformations: outputs should develop understanding, capability, judgement and independence.",
    "- Judgement: create opportunities to compare, evaluate, justify, critique and defend — not recall-only or completion-only tasks.",
    "- Progressive independence: move from observe / modelled support → guided practice → supported decision making → independent decision making → transfer; reduce scaffolding across the journey.",
    "- Metacognition (lightweight): include brief confidence, uncertainty, progress, decision and next-step checks — without overwhelming the content.",
    "- Learning success: make progress visible so learners can recognise what they now understand, can do, can judge, and can manage independently.",
    "- Cognitive over interface activity: optimise for cognitive activity, not more interface activity — depth of thinking beats visible interactivity."
  ];

  var MANIFESTATION_BY_STEP = {
    step_construct_learning_sequence: [
      "- Sequence: show a coherent learner-development journey — not just a list of pages or activities.",
      "- Progression: orient / modelled support → guided practice → supported decision making → independent decision making → transfer where appropriate.",
      "- Make explicit how learners move from understanding → capability → judgement → independence across the timeline.",
      "- Do not add visible activity unless it improves cognitive activity."
    ],
    step_design_learning_activities: [
      "- Activities: state or imply the developmental purpose of each activity.",
      "- Use required_materials and learner_task to support understanding, capability, judgement and/or independence.",
      "- Judgement manifestation: compare, evaluate, justify, critique, defend, choose, prioritise or decide — not surface completion only.",
      "- Across multiple activities: show progressive independence (reduced scaffolding, increased learner decision making).",
      "- Avoid activity shells where learners only complete low-value surface interactions."
    ],
    step_generate_activity_materials: [
      "- Materials: realise the cognitive purpose already specified by DLA — do not redesign pedagogy.",
      "- Preserve learner judgement opportunities; do not pre-answer comparisons, rankings, evaluations or independent decisions.",
      "- Support worked → faded → independent movement where upstream specifications require it.",
      "- Where appropriate, include lightweight prompts that help learners notice uncertainty, confidence, progress or next steps.",
      "- Do not add interaction or visible activity for its own sake."
    ],
    step_design_page: [
      "- Compose: preserve the learner journey across overview, activity preambles, learner tasks, materials and study tips.",
      "- Keep learning guidance and learning activities semantically distinct — not a literal two-column layout requirement.",
      "- Surface learning success through clear expected outputs, completion evidence and reflective closure.",
      "- Keep metacognition lightweight — do not turn it into heavy extra tasks."
    ],
    step_design_assessment: [
      "- Assessment design: gather evidence of understanding, capability, judgement and independence where outcomes support them.",
      "- Include judgement tasks where learning outcomes warrant comparison, evaluation or defence.",
      "- Prefer justification or interpretation over recall-only items where possible.",
      "- Make feedback-relevant misconceptions or weak reasoning visible in blueprint intent."
    ],
    step_generate_assessment_items: [
      "- Assessment items: gather evidence of understanding, capability, judgement and independence where outcomes support them.",
      "- Include judgement tasks where learning outcomes warrant comparison, evaluation or defence.",
      "- Prefer stems that require justification or interpretation over recall-only where possible.",
      "- Surface misconceptions or weak reasoning patterns that feedback can address."
    ],
    step_design_feedback: [
      "- Feedback: help learners see what changed in understanding, capability, judgement or independence.",
      "- Explain why reasoning is strong, weak, incomplete or uncertain — not only whether an answer is correct.",
      "- Support next-step decisions (what to revise, practise or try next).",
      "- Keep feedback concise and scalable — avoid essay-length tutor commentary per item."
    ]
  };

  function markerRegex() {
    return /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /EDUCATIONAL-QUALITY-FRAMEWORK \| Sprint 40/i;
  }

  function frameworkAlreadyPresent(text) {
    var body = String(text || "");
    return markerRegex().test(body) || moduleIdInTextRegex().test(body);
  }

  function resolveEducationalQualityFrameworkStepKey(context) {
    var ctx = context && typeof context === "object" ? context : {};
    var canonicalId = String(ctx.stepCanonicalStepId || "").toLowerCase().trim();
    if (TARGET_CANONICAL_STEP_IDS[canonicalId]) return canonicalId;
    var title = String(ctx.stepCanonicalTitle || ctx.stepTitle || "")
      .toLowerCase()
      .trim();
    if (!title) return "";
    if (title === "construct learning sequence" || title.indexOf("construct learning sequence") !== -1) {
      return "step_construct_learning_sequence";
    }
    if (title === "design learning activities" || title.indexOf("design learning activit") !== -1) {
      return "step_design_learning_activities";
    }
    if (title === "generate activity materials" || title.indexOf("generate activity material") !== -1) {
      return "step_generate_activity_materials";
    }
    if (title === "design assessment" || title.indexOf("design assessment") !== -1) {
      return "step_design_assessment";
    }
    if (title === "generate assessment items" || title.indexOf("generate assessment item") !== -1) {
      return "step_generate_assessment_items";
    }
    if (title === "design feedback" || title.indexOf("design feedback") !== -1) {
      return "step_design_feedback";
    }
    return "";
  }

  function isEducationalQualityFrameworkTargetStep(context) {
    return !!resolveEducationalQualityFrameworkStepKey(context);
  }

  function buildEducationalQualityFrameworkManifestationLines(context) {
    var stepKey = resolveEducationalQualityFrameworkStepKey(context);
    if (!stepKey || !MANIFESTATION_BY_STEP[stepKey]) return [];
    var lines = MANIFESTATION_BY_STEP[stepKey].slice();
    var ctx = context && typeof context === "object" ? context : {};
    var qualify = !!(
      ctx.dlaLearnerPageScaffoldSsot || ctx.eqfDlaLearnerPageScaffoldQualify
    );
    if (qualify && stepKey === "step_design_learning_activities") {
      lines = lines.map(function (line) {
        if (/reduced scaffolding, increased learner decision making/i.test(line)) {
          return "- Across multiple activities: progressive independence in learner_task and materials; scaffold fields follow LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT word floors.";
        }
        return line;
      });
    }
    return lines;
  }

  function qualifyCoreLineForDlaLearnerPageScaffold(line) {
    if (/reduce scaffolding across the journey/i.test(line)) {
      return "- Progressive independence: observe → guided practice → independent decision making → transfer; fade learner_task/materials support — not LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT fields (word floors).";
    }
    if (/Metacognition \(lightweight\): include brief confidence/i.test(line)) {
      return "- Metacognition (lightweight): include short confidence, uncertainty, progress, decision and next-step checks in optional fields — without shortening mandatory scaffold prose.";
    }
    return line;
  }

  function buildEducationalQualityFrameworkPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var context = opts.context && typeof opts.context === "object" ? opts.context : opts;
    var qualify = !!(
      context &&
      (context.dlaLearnerPageScaffoldSsot || context.eqfDlaLearnerPageScaffoldQualify)
    );
    var stepKey = resolveEducationalQualityFrameworkStepKey(context);
    var coreSource = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    var lines = qualify
      ? coreSource.map(qualifyCoreLineForDlaLearnerPageScaffold)
      : coreSource.slice();
    var manifestation = buildEducationalQualityFrameworkManifestationLines(context);
    if (manifestation.length) {
      lines.push("- Step manifestation (targeted guidance):");
      lines = lines.concat(manifestation);
    }
    if (qualify && stepKey === "step_design_learning_activities") {
      lines.push(
        "- DLA learner-page scaffold fields: follow LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT word floors and PRE-EMIT gate."
      );
    }
    return lines.join("\n");
  }

  function applyEducationalQualityFrameworkPromptBlockToDraft(draft, context) {
    var draftBody = String(draft || "").trim();
    if (!draftBody) return "";
    if (!isEducationalQualityFrameworkTargetStep(context)) return draftBody;
    if (frameworkAlreadyPresent(draftBody)) return draftBody;
    return (
      draftBody + buildEducationalQualityFrameworkPromptBlock({ context: context })
    ).trim();
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    TARGET_CANONICAL_STEP_IDS: TARGET_CANONICAL_STEP_IDS,
    MANIFESTATION_BY_STEP: MANIFESTATION_BY_STEP,
    resolveEducationalQualityFrameworkStepKey: resolveEducationalQualityFrameworkStepKey,
    buildEducationalQualityFrameworkManifestationLines:
      buildEducationalQualityFrameworkManifestationLines,
    buildEducationalQualityFrameworkPromptBlock: buildEducationalQualityFrameworkPromptBlock,
    applyEducationalQualityFrameworkPromptBlockToDraft:
      applyEducationalQualityFrameworkPromptBlockToDraft,
    isEducationalQualityFrameworkTargetStep: isEducationalQualityFrameworkTargetStep,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    frameworkAlreadyPresent: frameworkAlreadyPresent
  };
});
