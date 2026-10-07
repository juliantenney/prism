/**
 * Sprint 92 Gate 8 Slice 1 — Situated Task sibling prompt bodies.
 * Product-specific predetermined pipeline: Situation → Activity → Support → Learning Return → Design Page.
 * Grounded in S92-D02–D08. Continuous conversation across all five stages.
 */

(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PrismSituatedTaskSiblingPrompts = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var RUNNER_FOOTER = function (stepN, outputName) {
    return [
      "",
      "Finish the artefact in your main answer; do not include the machine artefact name inside that body.",
      "Authoritative completion override: even if any copied core prompt text says 'return only' the artefact body, you must still append the runner completion footer line after the artefact.",
      "At the end of your answer, restate the final output on a separate line, prefixed with 'STEP N OUTPUT:'.",
      "After the artefact content is complete, exit any markdown or fenced code output and place the completion line as plain conversational text outside the artefact block. The STEP line is a runner status/footer only, not part of the markdown artefact body.",
      "Do not emit any placeholder footer form. Use the exact literal line below, verbatim:",
      "STEP " + stepN + " OUTPUT: " + outputName,
      "Pipeline completion rule: after you emit the required artefact and the exact runner footer line, stop immediately. Do not ask follow-up questions and do not offer optional next steps."
    ].join("\n");
  };

  var TEMPLATES = {
    situation:
      "{{ORIGINAL_BRIEF}}\n\nYou are establishing the Situation for a Situated Task.\n\nA Situated Task enables learning through purposeful activity undertaken by the learner in an authentic or situated context, where carrying out the activity itself is the principal learning vehicle.\n\nYour job at this stage is to determine WHY situated activity is educationally warranted here and what authentic circumstances the design must work within.\n\nDo not write the learner-facing task yet.\nDo not invent Interactive activities, Expository exposition sections, or Assessment Pack components.\nDo not design the Design Page JSON yet.\n\nCORE QUESTION\n\nWhat learning needs to happen through action, and in what real circumstances will that action occur?\n\nREASON ABOUT\n\n1. INTENDED LEARNING\nWhat capability, understanding or change is this Situated Task intended to develop?\n\n2. LEARNER AND CONTEXT\nWhat is educationally significant about these learners and the setting in which they will act?\n\n3. AUTHENTIC / SITUATED OPPORTUNITY\nWhat real opportunity for purposeful action exists (investigation, observation, evidence gathering, bounded testing, workplace enquiry, field/studio activity, appropriate practice, or similar)?\n\n4. PEOPLE, PRACTICES, RESOURCES, EVIDENCE\nWhat people, practices, resources or evidence are potentially involved?\n\n5. CONSTRAINTS\nWhat practical, ethical, access, authority, privacy or other constraints already shape what is possible?\n\n6. PRECEDING / SUBSEQUENT LEARNING AND EDUCATIONAL HANDOFFS\nWhere COMMISSION SPECIFICATION, LEARNING JOURNEY CONTEXT, or EDUCATIONAL DEPENDENCIES are present in the brief, treat explicit dependencies on earlier Learning Journey experiences as authoritative educational handoffs.\n- Identify what prior learner artefact/input the later experience requires (e.g. investigation question and plan designed previously).\n- Determine what THIS Situated Task must establish itself versus what must be brought forward from the earlier experience.\n- Do not absorb or redo learning work the journey assigns to the earlier experience merely to make this product locally self-contained.\n- Do not assume PRISM can access the learner's prior responses at runtime — there is no automatic learner-state transfer.\nWhere no such commission/journey dependency is present (standalone creation), this product must establish everything the learner needs to undertake it.\nWhere subsequent learning is indicated, note what this experience must prepare for reconnection.\n\n7. PRINCIPAL LEARNING VEHICLE\nWhy is carrying out the activity itself the appropriate principal learning vehicle here?\n\nPRODUCT-BOUNDARY CHALLENGE\n\nDo not dutifully manufacture a Situated Task when the educational centre of gravity properly belongs to a sibling product:\n- substantive learning principally through explanation / representation → Expository;\n- learning principally mediated by a deliberately designed / facilitated experience → Interactive;\n- principal job is eliciting interpretable evidence of capability → Assessment Pack.\n\nIf the brief is a mismatch, state that clearly and stop short of inventing a situated product.\n\nOUTPUT\n\nProduce a self-contained document headed:\n\nSITUATION\n\nIt must be sufficiently explicit that the next stage can design the Activity without repeating this analysis.\n\nDo not produce the Activity, Support, Learning Return or Design Page." +
      RUNNER_FOOTER(1, "situated_situation"),

    activity:
      "You are designing the Activity for a Situated Task.\n\nYou have been given an authoritative SITUATION produced earlier in this same continuous conversation.\n\nTreat that Situation as authoritative. Do not silently replace or redo its decisions.\n\nYour job at this stage is to design the substantive purposeful activity the learner will actually undertake.\n\nCORE QUESTION\n\nWhat should the learner actually undertake so that doing it develops the intended learning?\n\nRESOLVE\n\n1. SUBSTANTIVE LEARNER ACTION\nWhat must the learner actually do in THIS experience?\n\n2. CONTEXT\nIn what authentic or situated circumstances does this happen?\n\n3. SCOPE\nWhat bounds keep the activity purposeful and feasible?\n\n4. LEARNER AGENCY\nWhat meaningful decisions, encounters, observations or judgements remain with the learner?\n\n5. PARTICIPATION / ENCOUNTERS\nWhere relevant, who or what does the learner encounter?\n\n6. EFFORT / STOPPING\nWhere relevant, what effort is expected and what useful stopping conditions apply?\n\n7. LEARNER-OWNED WORK\nExplicitly identify what substantive work must remain learner-owned so PRISM does not take over the learning.\n\n8. EXPLICIT PRIOR-EXPERIENCE HANDOFF (when Situation / commission context declares one)\nIf an earlier Learning Journey experience owns designing a required artefact (question, plan, etc.), design THIS activity as carrying out / using that prior work — not as redesigning it. State what the learner must bring forward. Do not invent runtime transfer of prior responses.\n\nDo not introduce fixed activity subtypes.\nDo not script away the authentic decisions, encounters, observations or variation through which learning is intended to occur.\nDo not design Support controls first and squeeze an activity into them.\nDo not produce Design Page JSON.\n\nOUTPUT\n\nProduce a self-contained document headed:\n\nACTIVITY\n\nIt must be sufficiently explicit that Support and Learning Return can be designed from it." +
      RUNNER_FOOTER(2, "situated_activity"),

    support:
      "You are designing the Support for a Situated Task.\n\nYou have been given authoritative SITUATION and ACTIVITY reasoning earlier in this same continuous conversation.\n\nTreat those as authoritative. Do not redesign the Activity.\n\nYour job at this stage is to determine what support enables the learner to undertake the activity productively without PRISM taking over the substantive learning.\n\nCORE QUESTION\n\nWhat support does this learner need to act productively in this context without PRISM taking over the substantive learning?\n\nRESOLVE ONLY WHAT IS EDUCATIONALLY RELEVANT\n\nConsider, where relevant:\n- scaffolding;\n- boundaries;\n- attention (what is worth noticing);\n- context fit;\n- social configuration;\n- practical / ethical / access / authority / privacy constraints;\n- adaptation where circumstances may materially vary.\n\nDo not require adaptation or social participation where they are not educationally relevant.\nDo not turn every consideration into a mandatory schema field — reason only about what this Activity needs.\nDo not invent Interactive worksheets that replace the situated doing.\nDo not produce Design Page JSON.\n\nOUTPUT\n\nProduce a self-contained document headed:\n\nSUPPORT\n\nState clearly which forms of support are required and which are intentionally absent." +
      RUNNER_FOOTER(3, "situated_support"),

    learning_return:
      "You are designing the Learning Return for a Situated Task.\n\nYou have been given authoritative SITUATION, ACTIVITY and SUPPORT reasoning earlier in this same continuous conversation.\n\nTreat those as authoritative.\n\nYour job at this stage is to determine what should survive the situated experience educationally and how subsequent learning will use it.\n\nCORE QUESTION\n\nWhat must survive the experience, and how will subsequent learning use it?\n\nRESOLVE\n\n1. CONSEQUENTIAL RECORD / TRACE\nWhat observations, findings, evidence, attempts, artefacts, decisions, reflections, limitations, departures or other material are educationally consequential?\n\n2. DISTINCTIONS\nWhat distinctions are worth preserving where useful?\n\n3. RECORDING DEPTH\nHow much recording is proportionate to the educational need?\n\n4. RECONNECTION DESTINATION\nWhere does that learning/record go next (interpretation, reflection, discussion, comparison, decision, further activity, assessment, or other subsequent learning)?\n\n5. LATER USE\nHow will subsequent learning use what survives?\n\nRecord is an educational concept, not a persistence implementation. Do not specify localStorage, forms, uploads, LMS storage, account storage or any delivery mechanism.\n\nDo not create recording requirements without an educational reason for retaining the material.\nDo not produce Design Page JSON yet.\n\nOUTPUT\n\nProduce a self-contained document headed:\n\nLEARNING RETURN\n\nIt must be sufficiently explicit that Stage 5 can synthesise the Design Page without inventing reconnection." +
      RUNNER_FOOTER(4, "situated_learning_return"),

    design_page: ""
  };

  var CANONICAL_TO_STAGE = {
    step_situated_situation: "situation",
    step_situated_activity: "activity",
    step_situated_support: "support",
    step_situated_learning_return: "learning_return",
    step_design_page: "design_page"
  };

  function resolveDesignPagePromptBody() {
    var roots = [];
    if (typeof globalThis !== "undefined") roots.push(globalThis);
    if (typeof window !== "undefined") roots.push(window);
    var i;
    for (i = 0; i < roots.length; i += 1) {
      if (
        roots[i] &&
        roots[i].PRISM_SITUATED_TASK_DESIGN_PAGE &&
        typeof roots[i].PRISM_SITUATED_TASK_DESIGN_PAGE.buildSituatedTaskDesignPagePrompt ===
          "function"
      ) {
        return String(
          roots[i].PRISM_SITUATED_TASK_DESIGN_PAGE.buildSituatedTaskDesignPagePrompt() || ""
        ).trim();
      }
    }
    if (typeof require === "function") {
      try {
        var mod = require("./situated-task-design-page.js");
        if (mod && typeof mod.buildSituatedTaskDesignPagePrompt === "function") {
          return String(mod.buildSituatedTaskDesignPagePrompt() || "").trim();
        }
      } catch (_err) {}
    }
    return "";
  }

  function resolveStageFromStepIdentity(src) {
    src = src && typeof src === "object" ? src : {};
    var canonical = String(src.canonical_step_id || src.canonicalStepId || "")
      .trim()
      .toLowerCase();
    if (CANONICAL_TO_STAGE[canonical]) return CANONICAL_TO_STAGE[canonical];
    var outputName = String(src.outputName || src.output_name || "")
      .trim()
      .toLowerCase();
    if (outputName === "situated_situation") return "situation";
    if (outputName === "situated_activity") return "activity";
    if (outputName === "situated_support") return "support";
    if (outputName === "situated_learning_return") return "learning_return";
    if (outputName === "situated_task_page" || outputName === "page") return "design_page";
    var title = String(src.title || src.stepTitle || "")
      .trim()
      .toLowerCase();
    if (title === "situation") return "situation";
    if (title === "activity") return "activity";
    if (title === "support") return "support";
    if (title === "learning return" || title === "learning_return") return "learning_return";
    if (title.indexOf("design page") !== -1) return "design_page";
    return "";
  }

  function resolveTemplate(stageOrStep) {
    var stage =
      typeof stageOrStep === "string"
        ? String(stageOrStep).trim().toLowerCase()
        : resolveStageFromStepIdentity(stageOrStep);
    if (!stage) return "";
    if (stage === "design_page") {
      var designPageBody = resolveDesignPagePromptBody();
      if (designPageBody) return designPageBody;
    }
    return String(TEMPLATES[stage] || "").trim();
  }

  return {
    TEMPLATES: TEMPLATES,
    CANONICAL_TO_STAGE: CANONICAL_TO_STAGE,
    resolveStageFromStepIdentity: resolveStageFromStepIdentity,
    resolveTemplate: resolveTemplate
  };
});
