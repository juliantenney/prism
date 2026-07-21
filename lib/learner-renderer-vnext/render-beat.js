"use strict";

var html = require("./render-html-utils");
var renderMaterial = require("./render-material").renderMaterial;
var promptLabels = require("./prompt-labels");
var buildBeatContentSequence =
  require("./build-beat-content-sequence").buildBeatContentSequence;
var renderVisualAffordance =
  require("./render-visual-affordance").renderVisualAffordanceHook;
var learnerIcons = require("./learner-icon-renderer");

function hasRenderableContent(beat) {
  if (!beat || typeof beat !== "object") return false;
  var sequence = html.arrayOrEmpty(beat.contentSequence);
  if (sequence.length) return true;
  return (
    html.arrayOrEmpty(beat.instructions).length > 0 ||
    html.arrayOrEmpty(beat.prompts).length > 0 ||
    html.arrayOrEmpty(beat.materials).length > 0 ||
    beat.expectedOutput !== null
  );
}

function renderInstruction(instruction) {
  return learnerIcons.renderInstructionBlock(instruction);
}

function normalizeLabelToken(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function shouldRenderPromptLabel(promptLabel, beatLabel) {
  if (!String(promptLabel || "").trim()) return false;
  if (!String(beatLabel || "").trim()) return true;
  return normalizeLabelToken(promptLabel) !== normalizeLabelToken(beatLabel);
}

function renderPrompt(prompt, beat) {
  var sourceField = String(prompt.sourceField || "").trim();
  var suffix = promptLabels.cssClassSuffixForPromptField(sourceField);
  var promptLabel = promptLabels.labelForPromptField(sourceField);
  var labelHtml = shouldRenderPromptLabel(promptLabel, beat && beat.learnerLabel)
    ? learnerIcons.renderGuidanceLabel(promptLabel, sourceField)
    : "";
  return (
    '<div class="util-pedagogical-guidance util-pedagogical-guidance--' +
    html.escapeAttribute(suffix) +
    ' util-prose-measure" data-guidance-type="' +
    html.escapeAttribute(sourceField) +
    '">' +
    labelHtml +
    '<div class="util-guidance-body">' +
    html.renderMarkdownBlock(prompt.text) +
    "</div></div>"
  );
}

function renderExpectedOutput(expectedOutput) {
  if (!expectedOutput) return "";
  var body =
    html.renderMarkdownBlock(expectedOutput.text) ||
    html.renderPlainText(expectedOutput.text);
  return (
    '<div class="util-output-block util-expected-output util-prose-measure">' +
    learnerIcons.renderExpectedOutputHeading() +
    body +
    "</div>"
  );
}

function renderContentItem(item, beat) {
  if (!item || !item.kind) return "";
  var beforeHook = item.visualAffordanceBefore
    ? renderVisualAffordance(item.visualAffordanceBefore)
    : "";
  var afterHook = item.visualAffordanceAfter
    ? renderVisualAffordance(item.visualAffordanceAfter)
    : "";
  var body = "";

  if (item.kind === "instruction" && item.instruction) {
    body = renderInstruction(item.instruction);
  } else if (item.kind === "prompt" && item.prompt) {
    body = renderPrompt(item.prompt, beat);
  } else if (item.kind === "material" && item.material) {
    body = renderMaterial(item.material);
  } else if (item.kind === "expectedOutput" && item.expectedOutput) {
    body = renderExpectedOutput(item.expectedOutput);
  }

  if (!body) return beforeHook + afterHook;
  return beforeHook + body + afterHook;
}

function renderContentSequence(beat) {
  var sequence = html.arrayOrEmpty(beat.contentSequence);
  if (!sequence.length) {
    sequence = buildBeatContentSequence(beat);
  }
  return sequence
    .map(function (item) {
      return renderContentItem(item, beat);
    })
    .join("");
}

/**
 * Render one canonical LearnerBeat. Model-provided arrays retain their order.
 *
 * @param {import("./types").LearnerBeat} beat
 * @returns {string}
 */
function renderBeat(beat) {
  if (!hasRenderableContent(beat)) return "";
  var contentStream = renderContentSequence(beat);
  if (!String(contentStream || "").trim()) return "";

  return (
    '<section class="util-beat-section" data-beat-function="' +
    html.escapeAttribute(beat.sourceFunction) +
    '" data-learner-role="' +
    html.escapeAttribute(beat.learnerRole) +
    '">' +
    learnerIcons.renderBeatHeading(beat.learnerLabel, beat.learnerRole) +
    '<div class="util-beat-stream">' +
    contentStream +
    "</div></section>"
  );
}

module.exports = {
  hasRenderableContent: hasRenderableContent,
  renderBeat: renderBeat
};
