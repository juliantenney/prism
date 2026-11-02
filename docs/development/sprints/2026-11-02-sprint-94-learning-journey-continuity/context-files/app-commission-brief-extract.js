/**
 * Sprint 94 context snapshot — bounded extract from app.js (2026-11-02).
 * Not live source. Live paths: app.js composeSituatedTaskOriginalBrief (~5561),
 * materializeWorkflowPromptTemplateTokens ORIGINAL_BRIEF (~6629),
 * applyAcceptedCommissionIntake (~24297).
 *
 * Finding at open: ORIGINAL_BRIEF is composed for Learning Journey and Situated Task only.
 * Interactive / Expository / Assessment Pack receive "".
 */
function composeSituatedTaskOriginalBrief(wf) {
  var seed =
    (wf &&
      wf.workflowBriefResolution &&
      wf.workflowBriefResolution.resolvedFactors &&
      typeof wf.workflowBriefResolution.resolvedFactors === "object" &&
      wf.workflowBriefResolution.resolvedFactors) ||
    {};
  var initial =
    (wf &&
      wf.workflowBriefResolution &&
      wf.workflowBriefResolution.initialBrief &&
      typeof wf.workflowBriefResolution.initialBrief === "object" &&
      wf.workflowBriefResolution.initialBrief) ||
    {};
  var commissionSpec = String(
    seed.commission_specification || initial.commissionSpecification || ""
  ).trim();
  var journeyContext = String(
    seed.journey_context || initial.journeyContextText || ""
  ).trim();
  var commissionDependencies = String(
    seed.commission_dependencies ||
      seed.dependencies ||
      initial.dependencies ||
      initial.commissionDependencies ||
      ""
  ).trim();
  var hasCommissionContext = !!(
    commissionSpec ||
    journeyContext ||
    commissionDependencies
  );
  if (String(seed.original_brief || "").trim() && !hasCommissionContext) {
    return String(seed.original_brief).trim();
  }
  var parts = [];
  var focus = String(seed.topic || initial.topic || initial.designIntent || wf.goal || "").trim();
  if (focus) parts.push("PURPOSE / FOCUS\n" + focus);
  var audience = String(
    seed.audience ||
      (wf.workflowOutputSpec && wf.workflowOutputSpec.audience) ||
      initial.audience ||
      ""
  ).trim();
  if (audience) parts.push("LEARNERS / AUDIENCE\n" + audience);
  var source = String(seed.source_context || initial.inputs || "").trim();
  if (source) parts.push("SOURCE / CONTEXT MATERIAL\n" + source);
  var constraints = String(
    seed.constraints || initial.scopeConstraints || wf.scopeAndConstraints || ""
  ).trim();
  if (constraints) parts.push("CONSTRAINTS / ADDITIONAL CONTEXT\n" + constraints);
  if (commissionSpec) {
    parts.push("COMMISSION SPECIFICATION\n" + commissionSpec);
  }
  if (journeyContext) {
    parts.push("LEARNING JOURNEY CONTEXT\n" + journeyContext);
  }
  if (commissionDependencies) {
    parts.push(
      "EDUCATIONAL DEPENDENCIES (prior experience handoff)\n" +
        commissionDependencies +
        "\n\nThese declare intentional educational dependencies on learner work from earlier Learning Journey experiences when this Situated Task was commissioned. Honour them: identify what prior learner artefact must be brought forward and how it is used. Do not recreate or independently determine work the journey assigns to the earlier experience. PRISM does not transfer the learner's prior responses automatically — the learner-facing design must make the handoff intelligible."
    );
  }
  if (parts.length) return parts.join("\n\n");
  return String(seed.original_brief || "").trim();
}

// materializeWorkflowPromptTemplateTokens (excerpt)
// ORIGINAL_BRIEF: isLearningJourneyWorkflow(wf)
//   ? composeLearningJourneyOriginalBrief(wf)
//   : isSituatedTaskWorkflow(wf) || workflowRecordIsSituatedTask(wf)
//     ? composeSituatedTaskOriginalBrief(wf)
//     : ""

function applyAcceptedCommissionIntake(intakeResult) {
  if (!intakeResult || !intakeResult.ok || !intakeResult.accepted || !intakeResult.family) {
    return { ok: false, code: (intakeResult && intakeResult.code) || "commission_not_accepted" };
  }
  var family = intakeResult.family;
  var seed = intakeResult.createSeed || {};
  var envelope = intakeResult.envelope || {};
  var focus = String(seed.focus || "").trim();
  if (!focus) return { ok: false, code: "focus_required" };
  return {
    ok: true,
    note: "Full function stores commissionSpecification, journeyContextText, dependencies on initialBrief and deliverySeed; sourceMaterial is specificationText only."
  };
}
