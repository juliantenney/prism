"use strict";

/**
 * Practice Do selection workspaces — reuse Assessment Pack interactive markup /
 * runtime (`assessment_selection`) so determinate check + draft persistence work.
 */

var html = require("./render-html-utils");
var types = require("./response-part-types");
var assessmentInteractive = require("./assessment-interactive");

function resolvePracticeHeading(workspace, stem) {
  var label = String(
    (workspace && (workspace.responseLabel || workspace.label || workspace.materialTitle)) || ""
  ).trim();
  if (!label) return "";
  if (/^your decision$/i.test(label)) return "";
  // Avoid duplicating the fieldset legend when title and prompt are identical.
  if (stem && label.toLowerCase() === String(stem).trim().toLowerCase()) return "";
  return label;
}

function assessmentItemFromWorkspace(workspace) {
  var selection = (workspace && workspace.selection) || {};
  var form = String(selection.form || workspace.capability || "");
  var itemId = String(workspace.workspaceId || workspace.responsePartId || "selection");
  var stem = String(workspace.prompt || selection.prompt || workspace.label || "").trim();
  var rationale = String(selection.rationale || "").trim();
  var heading = resolvePracticeHeading(workspace, stem);

  if (form === types.SURFACE_KIND.MATCHING) {
    return {
      id: itemId,
      item_id: itemId,
      item_type: "matching",
      form: "matching",
      heading: heading,
      stem: stem,
      prompt: {
        left: Array.isArray(selection.left) ? selection.left : [],
        right: Array.isArray(selection.right) ? selection.right : []
      },
      judgement: {
        pairs: selection.pairs && typeof selection.pairs === "object" ? selection.pairs : {}
      },
      feedback_note: rationale,
      explanation: rationale
    };
  }

  if (form === types.SURFACE_KIND.MULTI_SELECT) {
    return {
      id: itemId,
      item_id: itemId,
      item_type: "multiple_answer_mcq",
      form: "multiple_answer_mcq",
      heading: heading,
      stem: stem,
      options: Array.isArray(selection.options) ? selection.options : [],
      correct_answers: Array.isArray(selection.correctAnswers)
        ? selection.correctAnswers
        : [],
      judgement: {
        correct_answers: Array.isArray(selection.correctAnswers)
          ? selection.correctAnswers
          : []
      },
      feedback_note: rationale,
      explanation: rationale
    };
  }

  return {
    id: itemId,
    item_id: itemId,
    item_type: "single_answer_mcq",
    form: "single_answer_mcq",
    heading: heading,
    stem: stem,
    options: Array.isArray(selection.options) ? selection.options : [],
    correct_answer: String(selection.correctAnswer || ""),
    correct_answer_text: String(selection.correctAnswer || ""),
    feedback_note: rationale,
    explanation: rationale
  };
}

function renderPracticeHeadingHtml(item) {
  var heading = String((item && (item.heading || item.item_heading || item.title)) || "").trim();
  if (!heading) return "";
  return (
    '<header class="util-assessment-item-header">' +
    '<h3 class="util-assessment-title util-practice-selection__title">' +
    html.escapeHtml(heading) +
    "</h3></header>"
  );
}

function renderNonDeterminateSingle(item, index) {
  var options = Array.isArray(item.options) ? item.options : [];
  var optionRows = options
    .map(function (option, optionIndex) {
      var key =
        option && typeof option === "object"
          ? String(option.key || option.id || option.text || optionIndex + 1)
          : String(option);
      var text =
        option && typeof option === "object"
          ? String(option.text || option.label || key)
          : String(option);
      return { key: key, text: text };
    })
    .filter(function (row) {
      return row.text;
    });
  if (!optionRows.length) return "";
  var itemId = assessmentInteractive.resolveItemId(item, index);
  var groupName = "practice-selection-" + itemId;
  var optionsHtml = optionRows
    .map(function (option, optionIndex) {
      var optionId = "practice-" + itemId + "-opt-" + String(optionIndex + 1);
      return (
        '<div class="util-assessment-option">' +
        '<input type="radio" class="util-assessment-option__input" id="' +
        html.escapeAttribute(optionId) +
        '" name="' +
        html.escapeAttribute(groupName) +
        '" value="' +
        html.escapeAttribute(option.key) +
        '" data-assessment-option="' +
        html.escapeAttribute(option.key) +
        '">' +
        '<label class="util-assessment-option__label" for="' +
        html.escapeAttribute(optionId) +
        '">' +
        html.renderMarkdownInline(option.text) +
        "</label></div>"
      );
    })
    .join("");
  var stem = assessmentInteractive.resolveStem(item);
  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--formative util-assessment-item--interactive util-practice-selection" data-assessment-mode="interactive" data-assessment-form="single_answer_mcq" data-workspace-kind="assessment_selection" data-workspace-id="assessment-' +
    html.escapeAttribute(itemId) +
    '" data-assessment-item-id="' +
    html.escapeAttribute(itemId) +
    '" data-practice-selection="true" data-practice-determinate="false">' +
    renderPracticeHeadingHtml(item) +
    '<div class="util-assessment-item-body">' +
    '<fieldset class="util-assessment-fieldset"><legend class="util-assessment-legend">' +
    html.renderMarkdownInline(stem) +
    "</legend>" +
    '<div class="util-assessment-choices">' +
    optionsHtml +
    "</div></fieldset>" +
    '<p class="util-practice-selection__note">Select an option. Use <strong>Check your work</strong> for criterion-based review of your overall reasoning.</p>' +
    "</div></article>"
  );
}

function renderNonDeterminateMulti(item, index) {
  var options = Array.isArray(item.options) ? item.options : [];
  var optionRows = options
    .map(function (option, optionIndex) {
      var key =
        option && typeof option === "object"
          ? String(option.key || option.id || option.text || optionIndex + 1)
          : String(option);
      var text =
        option && typeof option === "object"
          ? String(option.text || option.label || key)
          : String(option);
      return { key: key, text: text };
    })
    .filter(function (row) {
      return row.text;
    });
  if (!optionRows.length) return "";
  var itemId = assessmentInteractive.resolveItemId(item, index);
  var stem = assessmentInteractive.resolveStem(item);
  var optionsHtml = optionRows
    .map(function (option, optionIndex) {
      var optionId = "practice-" + itemId + "-multi-" + String(optionIndex + 1);
      return (
        '<div class="util-assessment-option">' +
        '<input type="checkbox" class="util-assessment-option__input" id="' +
        html.escapeAttribute(optionId) +
        '" value="' +
        html.escapeAttribute(option.key) +
        '" data-assessment-option="' +
        html.escapeAttribute(option.key) +
        '">' +
        '<label class="util-assessment-option__label" for="' +
        html.escapeAttribute(optionId) +
        '">' +
        html.renderMarkdownInline(option.text) +
        "</label></div>"
      );
    })
    .join("");
  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--formative util-assessment-item--interactive util-practice-selection" data-assessment-mode="interactive" data-assessment-form="multiple_answer_mcq" data-workspace-kind="assessment_selection" data-workspace-id="assessment-' +
    html.escapeAttribute(itemId) +
    '" data-assessment-item-id="' +
    html.escapeAttribute(itemId) +
    '" data-practice-selection="true" data-practice-determinate="false">' +
    renderPracticeHeadingHtml(item) +
    '<div class="util-assessment-item-body">' +
    '<fieldset class="util-assessment-fieldset"><legend class="util-assessment-legend">' +
    html.renderMarkdownInline(stem) +
    "</legend>" +
    '<div class="util-assessment-choices">' +
    optionsHtml +
    "</div></fieldset>" +
    '<p class="util-practice-selection__note">Select all that apply. Use <strong>Check your work</strong> for criterion-based review of your overall reasoning.</p>' +
    "</div></article>"
  );
}

/**
 * @param {object} workspace
 * @param {number} [index]
 * @returns {string}
 */
function renderSelectionWorkspace(workspace, index) {
  if (!workspace || !workspace.selection) return "";
  var item = assessmentItemFromWorkspace(workspace);
  var selection = workspace.selection;
  var determinate = !!selection.determinate;
  var form = String(selection.form || workspace.capability || "");
  // Prefer an explicit local ordinal (1-based within the activity selection group)
  // over the composition order bucket (historically 150+), which leaked as
  // learner-facing "Question 151".
  var idx = Number.isFinite(Number(index)) ? Number(index) : 0;
  if (idx >= 150) idx = 0;

  var inner = "";
  if (!determinate && form === types.SURFACE_KIND.SINGLE_SELECT) {
    inner = renderNonDeterminateSingle(item, idx);
  } else if (!determinate && form === types.SURFACE_KIND.MULTI_SELECT) {
    inner = renderNonDeterminateMulti(item, idx);
  } else if (!determinate && form === types.SURFACE_KIND.MATCHING) {
    // Matching without pairs: still render interactive selects via static-safe path.
    inner = assessmentInteractive.renderAssessmentItem(item, idx);
  } else {
    inner = assessmentInteractive.renderAssessmentItem(item, idx);
  }

  if (!inner) return "";

  // Tag Practice framing without breaking assessment_selection draft contract.
  // Match the class token carefully — util-practice-selection__title must not
  // short-circuit tagging of the interactive article.
  if (inner.indexOf('data-practice-selection="') === -1) {
    inner = inner.replace(
      /class="util-task-block util-assessment-item(?![^\"]*\butil-practice-selection\b)/,
      'class="util-task-block util-assessment-item util-practice-selection'
    );
    inner = inner.replace(
      "data-workspace-kind=\"assessment_selection\"",
      'data-workspace-kind="assessment_selection" data-practice-selection="true" data-practice-determinate="' +
        (determinate ? "true" : "false") +
        '"'
    );
  }

  var guidance = String(workspace.guidance || "").trim();
  var guidanceHtml = guidance
    ? '<p class="util-learner-workspace__note">' + html.escapeHtml(guidance) + "</p>"
    : "";

  return (
    '<div class="util-practice-selection-workspace util-prose-measure" data-workspace-capability="' +
    html.escapeAttribute(String(workspace.capability || form)) +
    '" data-response-part-id="' +
    html.escapeAttribute(String(workspace.responsePartId || "")) +
    '" data-workspace-step="' +
    html.escapeAttribute(String(workspace.sourceStepNumber || 0)) +
    '">' +
    inner +
    guidanceHtml +
    "</div>"
  );
}

module.exports = {
  renderSelectionWorkspace: renderSelectionWorkspace,
  assessmentItemFromWorkspace: assessmentItemFromWorkspace
};
