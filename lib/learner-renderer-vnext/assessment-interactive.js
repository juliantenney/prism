"use strict";

/**
 * Interactive formative assessment (MCQ) rendering for learner-renderer-vnext.
 *
 * Interactive when options + evaluable correct answer are present.
 * Otherwise falls back to static stem/options/disclosure.
 */

var html = require("./render-html-utils");
var learnerIcons = require("./learner-icon-renderer");

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function normalizeOptions(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map(function (option) {
        return String(option == null ? "" : option).trim();
      })
      .filter(Boolean);
  }
  if (raw && typeof raw === "object") {
    return Object.keys(raw)
      .sort()
      .map(function (key) {
        return String(raw[key] == null ? "" : raw[key]).trim();
      })
      .filter(Boolean);
  }
  return [];
}

function resolveStem(item) {
  return String(
    (item &&
      (item.stem ||
        item.question ||
        item.prompt ||
        item.text ||
        item.statement ||
        item.proposition)) ||
      ""
  ).trim();
}

function resolveCorrectAnswer(item) {
  return String(
    (item && (item.correct_answer_text || item.correct_answer || item.true_false_answer)) ||
      ""
  ).trim();
}

function resolveRationale(item) {
  return String(
    (item && (item.explanation_or_rationale || item.explanation)) || ""
  ).trim();
}

function resolveItemId(item, index) {
  var explicit = String((item && (item.item_id || item.id)) || "").trim();
  if (explicit) return slugify(explicit);
  return "assessment-item-" + String(index + 1);
}

function isEvaluableMcq(item) {
  var options = normalizeOptions(item && item.options);
  var correct = resolveCorrectAnswer(item);
  if (!options.length || !correct) return false;
  var type = String((item && item.item_type) || "").toLowerCase();
  if (type === "short_answer" || type === "open_response") return false;
  return options.some(function (option) {
    return option === correct || option.toLowerCase() === correct.toLowerCase();
  });
}

function synthesizeTrueFalseOptions(item) {
  var type = String((item && item.item_type) || "").toLowerCase();
  if (type !== "true_false" && type !== "true-false") return normalizeOptions(item && item.options);
  var options = normalizeOptions(item && item.options);
  if (options.length) return options;
  return ["True", "False"];
}

function canRenderInteractive(item) {
  var type = String((item && item.item_type) || "").toLowerCase();
  if (type === "short_answer" || type === "open_response") return false;
  var options =
    type === "true_false" || type === "true-false"
      ? synthesizeTrueFalseOptions(item)
      : normalizeOptions(item && item.options);
  var correct = resolveCorrectAnswer(item);
  if (!options.length || !correct) return false;
  var normalizedCorrect = correct.toLowerCase();
  if (type === "true_false" || type === "true-false") {
    if (/^(true|t|yes)$/i.test(correct)) correct = "True";
    else if (/^(false|f|no)$/i.test(correct)) correct = "False";
    normalizedCorrect = correct.toLowerCase();
  }
  return options.some(function (option) {
    return option === correct || option.toLowerCase() === normalizedCorrect;
  });
}

function matchCorrectOption(options, correctRaw) {
  var correct = String(correctRaw || "").trim();
  if (/^(true|t|yes)$/i.test(correct)) correct = "True";
  if (/^(false|f|no)$/i.test(correct)) correct = "False";
  for (var i = 0; i < options.length; i += 1) {
    if (options[i] === correct || options[i].toLowerCase() === correct.toLowerCase()) {
      return options[i];
    }
  }
  return "";
}

function renderStaticAssessmentFeedback(item) {
  var correct = resolveCorrectAnswer(item);
  var rationale = resolveRationale(item);
  var relatedOutcomes = html
    .arrayOrEmpty(item && item.related_learning_outcomes)
    .map(String)
    .filter(Boolean);
  if (!correct && !rationale && !relatedOutcomes.length) return "";

  var parts = [];
  if (correct) {
    parts.push(
      "<p><strong>Correct answer:</strong> " +
        html.renderMarkdownInline(correct) +
        "</p>"
    );
  }
  if (rationale) {
    parts.push(
      '<p class="util-assessment-rationale">' +
        html.renderMarkdownInline(rationale) +
        "</p>"
    );
  }
  if (relatedOutcomes.length) {
    parts.push(
      "<p><strong>Related outcomes:</strong> " +
        html.escapeHtml(relatedOutcomes.join(", ")) +
        "</p>"
    );
  }

  return (
    '<details class="util-assessment-feedback util-prose-measure">' +
    learnerIcons.renderAssessmentFeedbackSummary() +
    parts.join("") +
    "</details>"
  );
}

function renderStaticAssessmentItem(item, index) {
  var stem = resolveStem(item);
  var options = normalizeOptions(item && item.options);
  var bodyParts = [];

  if (stem) {
    bodyParts.push(
      '<div class="util-assessment-prompt util-prose-measure"><p class="util-assessment-statement">' +
        html.renderMarkdownInline(stem) +
        "</p></div>"
    );
  }
  if (options.length) {
    bodyParts.push(
      '<div class="util-assessment-choices"><ul class="util-assessment-options">' +
        options
          .map(function (option) {
            return "<li>" + html.renderMarkdownInline(option) + "</li>";
          })
          .join("") +
        "</ul></div>"
    );
  }

  var feedback = renderStaticAssessmentFeedback(item);
  if (feedback) bodyParts.push(feedback);

  var body = bodyParts.join("");
  if (!body) return "";

  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--formative util-assessment-item--static" data-assessment-mode="static">' +
    '<header class="util-assessment-item-header">' +
    learnerIcons.renderAssessmentItemTitle(index + 1) +
    "</header>" +
    '<div class="util-assessment-item-body">' +
    body +
    "</div></article>"
  );
}

function renderInteractiveAssessmentItem(item, index) {
  var itemId = resolveItemId(item, index);
  var workspaceId = "assessment-" + itemId;
  var stem = resolveStem(item);
  var type = String((item && item.item_type) || "").toLowerCase();
  var options =
    type === "true_false" || type === "true-false"
      ? synthesizeTrueFalseOptions(item)
      : normalizeOptions(item && item.options);
  var correct = matchCorrectOption(options, resolveCorrectAnswer(item));
  var rationale = resolveRationale(item);
  var groupName = "assessment-group-" + itemId;
  var legendId = workspaceId + "-legend";

  if (!stem || !options.length || !correct) {
    return renderStaticAssessmentItem(item, index);
  }

  var optionsHtml = options
    .map(function (option, optionIndex) {
      var optionId = workspaceId + "-opt-" + String(optionIndex + 1);
      return (
        '<div class="util-assessment-option">' +
        '<input type="radio" class="util-assessment-option__input" id="' +
        html.escapeAttribute(optionId) +
        '" name="' +
        html.escapeAttribute(groupName) +
        '" value="' +
        html.escapeAttribute(option) +
        '" data-assessment-option="' +
        html.escapeAttribute(option) +
        '">' +
        '<label class="util-assessment-option__label" for="' +
        html.escapeAttribute(optionId) +
        '">' +
        html.renderMarkdownInline(option) +
        "</label></div>"
      );
    })
    .join("");

  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--formative util-assessment-item--interactive" data-assessment-mode="interactive" data-workspace-kind="assessment_selection" data-workspace-capability="assessment_selection" data-workspace-id="' +
    html.escapeAttribute(workspaceId) +
    '" data-assessment-item-id="' +
    html.escapeAttribute(itemId) +
    '" data-assessment-correct="' +
    html.escapeAttribute(correct) +
    '"' +
    (rationale
      ? ' data-assessment-rationale="' + html.escapeAttribute(rationale) + '"'
      : "") +
    ">" +
    '<header class="util-assessment-item-header">' +
    learnerIcons.renderAssessmentItemTitle(index + 1) +
    "</header>" +
    '<div class="util-assessment-item-body">' +
    '<fieldset class="util-assessment-fieldset">' +
    '<legend class="util-assessment-legend" id="' +
    html.escapeAttribute(legendId) +
    '">' +
    html.renderMarkdownInline(stem) +
    "</legend>" +
    '<div class="util-assessment-choices" role="presentation">' +
    optionsHtml +
    "</div>" +
    '<button type="button" class="util-assessment-check" data-assessment-check>Check answer</button>' +
    '<div class="util-assessment-result" data-assessment-result aria-live="polite" hidden></div>' +
    "</fieldset>" +
    "</div></article>"
  );
}

function renderAssessmentItem(item, index) {
  if (canRenderInteractive(item)) {
    return renderInteractiveAssessmentItem(item, index);
  }
  return renderStaticAssessmentItem(item, index);
}

module.exports = {
  normalizeOptions: normalizeOptions,
  resolveStem: resolveStem,
  resolveCorrectAnswer: resolveCorrectAnswer,
  resolveItemId: resolveItemId,
  canRenderInteractive: canRenderInteractive,
  renderAssessmentItem: renderAssessmentItem,
  renderStaticAssessmentItem: renderStaticAssessmentItem,
  renderInteractiveAssessmentItem: renderInteractiveAssessmentItem
};
