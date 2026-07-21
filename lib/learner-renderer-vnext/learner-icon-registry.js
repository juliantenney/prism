"use strict";

/**
 * Central semantic icon registry for learner renderer vNext.
 * Maps typed semantic keys to legacy PEDAGOGICAL_ICONS keys (Lucide shapes).
 */

var MATERIAL_TYPE_KEYS = Object.freeze({
  text: "material.explanatory_text",
  worked_example: "material.worked_example",
  sample_output: "material.sample_response",
  checklist: "material.checklist",
  analysis_table: "material.table",
  scenario: "material.scenario",
  decision_table: "material.table",
  modelling_note: "material.reference_note",
  prompt_set: "material.prompt_set",
  comparison_table: "material.table",
  template: "material.template",
  transfer_prompt: "material.transfer_prompt",
  consolidation_summary: "material.consolidation_summary"
});

var ORIENTATION_TYPE_KEYS = Object.freeze({
  overview: "section.overview",
  learning_purpose: "section.learning_purpose",
  knowledge_summary: "section.knowledge_summary",
  learning_outcomes: "section.learning_outcomes",
  progression_guidance: "section.progression"
});

var PROMPT_FIELD_KEYS = Object.freeze({
  reasoning_orientation: "guidance.reasoning_orientation",
  self_explanation_prompt: "guidance.self_explanation",
  conceptual_contrast_prompt: "guidance.conceptual_contrast",
  transfer_or_application_task: "guidance.transfer",
  intellectual_coherence_bridge: "guidance.coherence_bridge",
  argument_structure_hint: "guidance.argument_structure"
});

var LEARNER_ROLE_KEYS = Object.freeze({
  reflect: "learner.reflect",
  explain: "learner.explain",
  model: "learner.model",
  practise: "learner.practise",
  check: "learner.check",
  transfer: "learner.transfer"
});

/** @type {Object.<string, string>} semantic key → PEDAGOGICAL_ICONS key */
var SEMANTIC_TO_ICON = Object.freeze({
  "section.overview": "OVERVIEW",
  "section.learning_purpose": "PURPOSE",
  "section.knowledge_summary": "REFLECT",
  "section.learning_outcomes": "PURPOSE",
  "section.progression": "PURPOSE",
  "section.activities": "ACTIVITIES",
  "section.assessment": "EVALUATE",
  "section.study_tips": "TIPS",

  "guidance.reasoning_orientation": "REFLECT",
  "guidance.self_explanation": "REFLECT",
  "guidance.conceptual_contrast": "REFLECT",
  "guidance.transfer": "PRACTICE",
  "guidance.coherence_bridge": "REFLECT",
  "guidance.argument_structure": "CREATE",
  "guidance.generic": "NOTE",

  "material.explanatory_text": "READ",
  "material.worked_example": "EXAMPLE",
  "material.sample_response": "EXAMPLE",
  "material.table": "TABLE",
  "material.checklist": "CHECKLIST",
  "material.template": "TEMPLATE",
  "material.scenario": "SCENARIO",
  "material.prompt_set": "DISCUSS",
  "material.reference_note": "NOTE",
  "material.transfer_prompt": "PRACTICE",
  "material.consolidation_summary": "REFLECT",
  "material.generic": "GENERIC",

  "learner.instruction": "PRACTICE",
  "learner.reflect": "REFLECT",
  "learner.explain": "READ",
  "learner.model": "EXAMPLE",
  "learner.practise": "PRACTICE",
  "learner.check": "CHECK",
  "learner.transfer": "PRACTICE",
  "learner.expected_output": "CHECK",

  "assessment.question": "EVALUATE",
  "assessment.feedback": "CHECK",
  "assessment.correct_answer": "CHECK",

  "activity.mapped_outcomes": "PURPOSE",
  "activity.preamble": "NOTE"
});

var SECTION_ICON_MODIFIER = Object.freeze({
  "section.overview": "util-section-icon--overview",
  "section.learning_purpose": "util-section-icon--learning-purpose",
  "section.knowledge_summary": "util-section-icon--knowledge-summary",
  "section.learning_outcomes": "util-section-icon--learning-purpose",
  "section.progression": "util-section-icon--learning-purpose",
  "section.activities": "util-section-icon--learning-activities",
  "section.assessment": "util-section-icon--assessment",
  "section.study_tips": "util-section-icon--study-tips"
});

var MATERIAL_ICON_MODIFIER = Object.freeze({
  text: "util-generic-material-icon",
  worked_example: "util-generic-material-icon",
  sample_output: "util-generic-material-icon",
  checklist: "util-checklist-icon",
  analysis_table: "util-table-icon",
  decision_table: "util-table-icon",
  comparison_table: "util-table-icon",
  scenario: "util-scenario-card-icon",
  prompt_set: "util-prompt-set-icon",
  template: "util-template-icon",
  transfer_prompt: "util-prompt-set-icon",
  consolidation_summary: "util-generic-material-icon",
  modelling_note: "util-support-note-icon"
});

function resolveIconKey(semanticKey) {
  var key = String(semanticKey || "").trim();
  if (!key) return null;
  return SEMANTIC_TO_ICON[key] || null;
}

function getLearnerIcon(semanticKey) {
  var iconKey = resolveIconKey(semanticKey);
  if (!iconKey) return null;
  return {
    semanticKey: semanticKey,
    iconKey: iconKey,
    modifierClass: modifierClassForSemanticKey(semanticKey)
  };
}

function semanticKeyForMaterialType(materialType) {
  return MATERIAL_TYPE_KEYS[String(materialType || "")] || "material.generic";
}

function semanticKeyForOrientationType(orientationType) {
  return ORIENTATION_TYPE_KEYS[String(orientationType || "")] || null;
}

function semanticKeyForPromptField(sourceField) {
  return PROMPT_FIELD_KEYS[String(sourceField || "")] || "guidance.generic";
}

function semanticKeyForLearnerRole(role) {
  return LEARNER_ROLE_KEYS[String(role || "")] || null;
}

function modifierClassForSemanticKey(semanticKey) {
  var key = String(semanticKey || "");
  if (SECTION_ICON_MODIFIER[key]) return SECTION_ICON_MODIFIER[key];
  return "util-generic-material-icon";
}

function modifierClassForMaterialType(materialType) {
  return MATERIAL_ICON_MODIFIER[String(materialType || "")] || "util-generic-material-icon";
}

function listSupportedSemanticKeys() {
  return Object.keys(SEMANTIC_TO_ICON);
}

module.exports = {
  SEMANTIC_TO_ICON: SEMANTIC_TO_ICON,
  MATERIAL_TYPE_KEYS: MATERIAL_TYPE_KEYS,
  ORIENTATION_TYPE_KEYS: ORIENTATION_TYPE_KEYS,
  PROMPT_FIELD_KEYS: PROMPT_FIELD_KEYS,
  LEARNER_ROLE_KEYS: LEARNER_ROLE_KEYS,
  resolveIconKey: resolveIconKey,
  getLearnerIcon: getLearnerIcon,
  semanticKeyForMaterialType: semanticKeyForMaterialType,
  semanticKeyForOrientationType: semanticKeyForOrientationType,
  semanticKeyForPromptField: semanticKeyForPromptField,
  semanticKeyForLearnerRole: semanticKeyForLearnerRole,
  modifierClassForSemanticKey: modifierClassForSemanticKey,
  modifierClassForMaterialType: modifierClassForMaterialType,
  listSupportedSemanticKeys: listSupportedSemanticKeys
};
