"use strict";

/**
 * Sprint 68 IMP-013 — semantic beat-function → composition-moment mapping.
 *
 * Inventory sources:
 * - lib/learner-renderer-vnext/archetype-rules.js (vNext production archetypes)
 * - tests/fixtures/page-render/*.json (heteroscedasticity, kitchen-sink, rna, marx)
 * - docs episode-plan artefacts (extended episode-plan vocabulary)
 *
 * Fallback policy:
 * - Primary signal: beat.learnerRole from the canonical page model.
 * - Secondary signal: beat.sourceFunction when role alone is ambiguous.
 * - Unmapped sourceFunction values classify as "learn" only when they appear
 *   explanatory; otherwise they follow DO/CHECK heuristics below.
 * - Beats with no learner-facing content are not assigned to any moment.
 */

/** @type {Object.<string, "orient"|"learn"|"do"|"check">} */
var SOURCE_FUNCTION_MOMENT_MAP = Object.freeze({
  // Orient — activation / framing
  orientation: "orient",
  orient: "orient",
  framing: "orient",
  activation: "orient",
  transition: "orient",

  // Learn — exposition / modelling
  explanation: "learn",
  worked_thinking: "learn",
  worked_example: "learn",
  example: "learn",
  non_example: "learn",
  criteria_exposition: "learn",
  misconception_confrontation: "learn",
  comparison: "learn",
  perspective_construction: "learn",
  worked_judgement: "learn",

  // Do — application / production
  application: "do",
  analysis: "do",
  practice: "do",
  guided_practice: "do",
  guided_inquiry: "do",
  guided_reasoning: "do",
  independent_performance: "do",
  criteria_construction: "do",
  evaluation: "do",

  // Check — verification / consolidation / transfer
  check: "check",
  check_understanding: "check",
  feedback: "check",
  synthesis: "check",
  verification: "check",
  reflection: "check",
  revision: "check",
  transfer: "check",
  evaluative_judgement: "check",

  // Do — inquiry / judgement (learner performs reasoning)
  investigation: "do",
  judgement: "do"
});

/** @type {Object.<string, "orient"|"learn"|"do"|"check">} */
var LEARNER_ROLE_MOMENT_MAP = Object.freeze({
  reflect: "orient",
  explain: "learn",
  model: "learn",
  practise: "do",
  check: "check",
  transfer: "check"
});

/** Material types that belong in Check moments when present on a split beat. */
var CHECK_MATERIAL_TYPES = Object.freeze({
  sample_output: true,
  checklist: true,
  consolidation_summary: true,
  transfer_prompt: true
});

/** Material types that scaffold learner production in Do moments. */
var TASK_MATERIAL_TYPES = Object.freeze({
  scenario: true,
  analysis_table: true,
  decision_table: true,
  comparison_table: true,
  classification_table: true,
  planning_table: true,
  template: true,
  prompt_set: true,
  worked_example: true
});

var VERIFY_INSTRUCTION_PATTERN =
  /^(Compare|Verify|Check|Use the checklist|Complete the self-check|Complete the .*verification checklist|Revise|Review your|Self-check|Consolidate)/i;

var TASK_INSTRUCTION_PATTERN =
  /^(Write|Complete the prompt set|Complete the analysis|Complete the decision|Work through|Produce|Draft|Fill in|Enter|Analyse|Analyze|Apply|Decide|Identify|Study|Read the|Use the response template|Put (?:these|the|them) in order|Arrange|Sequence|Rank|Prioriti[sz]e)/i;

/**
 * @param {import("./types").LearnerInstruction} instruction
 * @returns {"task"|"verify"|"neutral"}
 */
function classifyInstructionIntent(instruction) {
  var text = String((instruction && instruction.text) || "").trim();
  if (!text) return "neutral";
  if (VERIFY_INSTRUCTION_PATTERN.test(text)) return "verify";
  if (TASK_INSTRUCTION_PATTERN.test(text)) return "task";
  return "neutral";
}

/**
 * @param {import("./types").LearnerMaterial} material
 * @returns {"check"|"task"|"learn"}
 */
function classifyMaterialPlacement(material) {
  var type = String((material && material.type) || "").trim();
  if (CHECK_MATERIAL_TYPES[type]) return "check";
  if (TASK_MATERIAL_TYPES[type]) return "task";
  return "learn";
}

/**
 * Resolve the default composition moment for one beat.
 *
 * @param {import("./types").LearnerBeat} beat
 * @returns {"orient"|"learn"|"do"|"check"|null}
 */
function classifyBeatMoment(beat) {
  if (!beat) return null;
  var role = String(beat.learnerRole || "").trim();
  var sourceFunction = String(beat.sourceFunction || "").trim();
  var roleMoment = LEARNER_ROLE_MOMENT_MAP[role];
  var functionMoment = SOURCE_FUNCTION_MOMENT_MAP[sourceFunction];

  if (role === "reflect" && sourceFunction === "orientation") return "orient";
  if (role === "explain" && sourceFunction === "orientation") return "learn";
  if (roleMoment === "check" || functionMoment === "check") return "check";
  if (roleMoment === "transfer") return "check";
  if (roleMoment) return roleMoment;
  if (functionMoment) return functionMoment;
  return null;
}

function beatHasLearnAndTaskMaterials(beat) {
  var materials = Array.isArray(beat.materials) ? beat.materials : [];
  var hasLearn = false;
  var hasTask = false;
  materials.forEach(function (material) {
    var placement = classifyMaterialPlacement(material);
    if (placement === "check") return;
    if (placement === "task") hasTask = true;
    else hasLearn = true;
  });
  return hasLearn && hasTask;
}

/**
 * Whether a beat's instructions/materials must be split across Do and Check.
 *
 * @param {import("./types").LearnerBeat} beat
 * @returns {boolean}
 */
function beatRequiresDoCheckSplit(beat) {
  if (!beat) return false;
  var moment = classifyBeatMoment(beat);
  if (moment !== "check" && beat.learnerRole !== "practise") return false;

  var instructions = Array.isArray(beat.instructions) ? beat.instructions : [];
  var materials = Array.isArray(beat.materials) ? beat.materials : [];
  var hasTask = instructions.some(function (entry) {
    return classifyInstructionIntent(entry) === "task";
  });
  var hasVerify = instructions.some(function (entry) {
    return classifyInstructionIntent(entry) === "verify";
  });
  var hasCheckMaterials = materials.some(function (material) {
    return classifyMaterialPlacement(material) === "check";
  });
  var hasTaskMaterials = materials.some(function (material) {
    return classifyMaterialPlacement(material) === "task";
  });

  if (
    beat.sourceFunction === "check" ||
    beat.sourceFunction === "check_understanding" ||
    beat.sourceFunction === "feedback" ||
    beat.sourceFunction === "synthesis"
  ) {
    return hasTask || hasTaskMaterials;
  }
  if (beat.sourceFunction === "investigation" || beat.sourceFunction === "judgement") {
    return beatHasLearnAndTaskMaterials(beat) || hasVerify || hasCheckMaterials;
  }
  if (beat.learnerRole === "check" || beat.sourceFunction === "check_understanding") {
    return hasTask || hasTaskMaterials;
  }
  if (beat.learnerRole === "practise") {
    return hasVerify || hasCheckMaterials;
  }
  return false;
}

/**
 * Build ordered beat groups for generic composition.
 *
 * @param {import("./types").LearnerActivity} modelActivity
 * @returns {{
 *   learnBeats: import("./types").LearnerBeat[],
 *   doBeats: import("./types").LearnerBeat[],
 *   checkBeats: import("./types").LearnerBeat[],
 *   splitBeats: import("./types").LearnerBeat[]
 * }}
 */
function classifyActivityBeats(modelActivity) {
  var learnBeats = [];
  var doBeats = [];
  var checkBeats = [];
  var splitBeats = [];
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];

  beats.forEach(function (beat) {
    if (beatRequiresDoCheckSplit(beat)) {
      splitBeats.push(beat);
      return;
    }
    var moment = classifyBeatMoment(beat);
    if (moment === "learn") learnBeats.push(beat);
    else if (moment === "do") doBeats.push(beat);
    else if (moment === "check") checkBeats.push(beat);
  });

  return {
    learnBeats: learnBeats,
    doBeats: doBeats,
    checkBeats: checkBeats,
    splitBeats: splitBeats
  };
}

module.exports = {
  SOURCE_FUNCTION_MOMENT_MAP: SOURCE_FUNCTION_MOMENT_MAP,
  LEARNER_ROLE_MOMENT_MAP: LEARNER_ROLE_MOMENT_MAP,
  CHECK_MATERIAL_TYPES: CHECK_MATERIAL_TYPES,
  TASK_MATERIAL_TYPES: TASK_MATERIAL_TYPES,
  classifyInstructionIntent: classifyInstructionIntent,
  classifyMaterialPlacement: classifyMaterialPlacement,
  classifyBeatMoment: classifyBeatMoment,
  beatRequiresDoCheckSplit: beatRequiresDoCheckSplit,
  classifyActivityBeats: classifyActivityBeats
};
