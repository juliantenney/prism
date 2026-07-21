"use strict";

var registry = require("./learner-icon-registry");
var html = require("./render-html-utils");

var _renderer = null;

function getPedagogicalIconModule() {
  try {
    return require("../utility-pedagogical-icons");
  } catch (err) {
    var g =
      typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : null;
    return g && g.PRISM_UTILITY_PEDAGOGICAL_ICONS ? g.PRISM_UTILITY_PEDAGOGICAL_ICONS : null;
  }
}

function iconRenderer() {
  if (_renderer) return _renderer;
  var mod = getPedagogicalIconModule();
  if (!mod || typeof mod.createRenderer !== "function") return null;
  _renderer = mod.createRenderer(html.escapeHtml);
  return _renderer;
}

function renderSemanticIconSvg(semanticKey, options) {
  var icon = registry.getLearnerIcon(semanticKey);
  if (!icon) return "";
  var icons = iconRenderer();
  if (!icons) return "";
  var opts = options && typeof options === "object" ? options : {};
  var modifier =
    opts.modifierClass ||
    (String(semanticKey || "").indexOf("section.") === 0
      ? registry.modifierClassForSemanticKey(semanticKey)
      : registry.modifierClassForMaterialType(opts.materialType || ""));
  var extraClass = ["util-semantic-icon__svg", modifier, String(opts.extraClass || "").trim()]
    .filter(Boolean)
    .join(" ");
  return icons.renderIconHtml(icon.iconKey, {
    size: opts.size || "md",
    className: extraClass
  });
}

function renderSemanticIcon(semanticKey, options) {
  var svg = renderSemanticIconSvg(semanticKey, options);
  if (!svg) return "";
  return '<span class="util-semantic-icon" aria-hidden="true">' + svg + "</span>";
}

function renderLabeledText(labelHtml, semanticKey, options) {
  var icon = renderSemanticIcon(semanticKey, options);
  if (!icon) return String(labelHtml || "");
  var opts = options && typeof options === "object" ? options : {};
  var labelTag = opts.blockLabel ? "div" : "span";
  return (
    icon +
    "<" +
    labelTag +
    ' class="util-semantic-icon__label">' +
    labelHtml +
    "</" +
    labelTag +
    ">"
  );
}

function renderSectionHeading(title, semanticKey) {
  var text = html.escapeHtml(String(title || ""));
  return (
    '<h2 class="util-section-heading util-icon-heading">' +
    renderLabeledText(text, semanticKey, { size: "md" }) +
    "</h2>"
  );
}

function renderMaterialHeading(title, materialType) {
  var text = html.escapeHtml(String(title || ""));
  if (!text) return "";
  var semanticKey = registry.semanticKeyForMaterialType(materialType);
  return (
    '<h4 class="util-material-heading util-icon-heading">' +
    renderLabeledText(text, semanticKey, {
      size: "md",
      materialType: materialType
    }) +
    "</h4>"
  );
}

function renderGuidanceLabel(label, sourceField) {
  var semanticKey = registry.semanticKeyForPromptField(sourceField);
  return (
    '<p class="util-guidance-label util-icon-heading">' +
    renderLabeledText(html.escapeHtml(String(label || "")), semanticKey, { size: "sm" }) +
    "</p>"
  );
}

function renderBeatHeading(label, learnerRole) {
  var text = html.escapeHtml(String(label || ""));
  var semanticKey = registry.semanticKeyForLearnerRole(learnerRole) || "learner.reflect";
  return (
    '<h3 class="util-beat-heading util-icon-heading">' +
    renderLabeledText(text, semanticKey, { size: "sm" }) +
    "</h3>"
  );
}

function renderInstructionBlock(instruction) {
  return (
    '<div class="util-beat-instruction util-icon-heading util-prose-measure" data-source-step-number="' +
    html.escapeAttribute(instruction.sourceStepNumber) +
    '">' +
    renderLabeledText(
      "<p>" + html.escapeHtml(instruction.text) + "</p>",
      "learner.instruction",
      { size: "sm" }
    ) +
    "</div>"
  );
}

function renderExpectedOutputHeading() {
  return (
    '<h4 class="util-material-heading util-icon-heading">' +
    renderLabeledText(html.escapeHtml("Expected output"), "learner.expected_output", {
      size: "md"
    }) +
    "</h4>"
  );
}

function renderAssessmentSectionHeading() {
  return renderSectionHeading("Self assessment", "section.assessment");
}

function renderAssessmentItemTitle(number) {
  return (
    '<h3 class="util-assessment-title util-icon-heading">' +
    renderLabeledText(
      html.escapeHtml("Question " + String(number)),
      "assessment.question",
      { size: "sm" }
    ) +
    "</h3>"
  );
}

function renderAssessmentFeedbackSummary() {
  return (
    "<summary>" +
    renderLabeledText(html.escapeHtml("Check answer"), "assessment.feedback", { size: "sm" }) +
    "</summary>"
  );
}

function getLearnerIconPresentationCss() {
  var mod = getPedagogicalIconModule();
  var base = mod && typeof mod.getIconPresentationCss === "function" ? mod.getIconPresentationCss() : "";
  return (
    base +
    ".util-semantic-icon{display:inline-flex;flex:0 0 auto;align-items:center;justify-content:center;line-height:1}" +
    ".util-icon-heading{display:flex;align-items:flex-start;gap:.55rem}" +
    ".util-icon-heading>.util-semantic-icon{margin-top:.15em;flex-shrink:0}" +
    ".util-icon-heading>.util-semantic-icon__label{flex:1;min-width:0}" +
    ".util-section-heading.util-icon-heading{align-items:center}" +
    ".util-section-heading .util-semantic-icon{margin-top:0}" +
    ".util-guidance-label.util-icon-heading{margin:0 0 6px;align-items:center}" +
    ".util-beat-instruction.util-icon-heading>.util-semantic-icon__label p{margin:0}" +
    ".util-assessment-feedback summary.util-icon-heading,.util-assessment-feedback>summary{display:flex;align-items:center;gap:.45rem;cursor:pointer}" +
    ".util-assessment-feedback .util-semantic-icon{margin-top:0}" +
    ".util-mapped-outcomes.util-icon-heading{display:flex;align-items:flex-start;gap:.45rem;margin:0 0 10px;font-size:.875rem;color:#475569}"
  );
}

module.exports = {
  iconRenderer: iconRenderer,
  renderSemanticIcon: renderSemanticIcon,
  renderSemanticIconSvg: renderSemanticIconSvg,
  renderLabeledText: renderLabeledText,
  renderSectionHeading: renderSectionHeading,
  renderMaterialHeading: renderMaterialHeading,
  renderGuidanceLabel: renderGuidanceLabel,
  renderBeatHeading: renderBeatHeading,
  renderInstructionBlock: renderInstructionBlock,
  renderExpectedOutputHeading: renderExpectedOutputHeading,
  renderAssessmentSectionHeading: renderAssessmentSectionHeading,
  renderAssessmentItemTitle: renderAssessmentItemTitle,
  renderAssessmentFeedbackSummary: renderAssessmentFeedbackSummary,
  getLearnerIconPresentationCss: getLearnerIconPresentationCss
};
