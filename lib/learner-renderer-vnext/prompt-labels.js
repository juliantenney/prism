"use strict";

var PROMPT_FIELD_LABELS = Object.freeze({
  reasoning_orientation: "How to think",
  self_explanation_prompt: "Explain it to yourself",
  conceptual_contrast_prompt: "Compare the ideas",
  transfer_or_application_task: "Apply elsewhere",
  intellectual_coherence_bridge: "Connect your learning",
  argument_structure_hint: "Structure your response"
});

function labelForPromptField(sourceField) {
  var field = String(sourceField || "").trim();
  return PROMPT_FIELD_LABELS[field] || "Guidance";
}

function cssClassSuffixForPromptField(sourceField) {
  return String(sourceField || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = {
  PROMPT_FIELD_LABELS: PROMPT_FIELD_LABELS,
  labelForPromptField: labelForPromptField,
  cssClassSuffixForPromptField: cssClassSuffixForPromptField
};
