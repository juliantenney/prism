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

function optionRecords(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map(function (option, index) {
        if (option && typeof option === "object") {
          var key = String(option.key || option.id || option.value || "").trim();
          var text = String(option.text || option.label || option.value || option.prompt || "").trim();
          if (!key) key = text || "option-" + String(index + 1);
          if (!text) text = key;
          return { key: key, text: text };
        }
        var plain = String(option == null ? "" : option).trim();
        if (!plain || plain === "[object Object]") return null;
        return { key: plain, text: plain };
      })
      .filter(Boolean);
  }
  if (raw && typeof raw === "object") {
    return Object.keys(raw)
      .sort()
      .map(function (key) {
        var text = String(raw[key] == null ? "" : raw[key]).trim();
        return text ? { key: String(key), text: text } : null;
      })
      .filter(Boolean);
  }
  return [];
}

function normalizeOptions(raw) {
  return optionRecords(raw).map(function (option) {
    return option.text;
  });
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
    (item &&
      (item.feedback_note || item.explanation_or_rationale || item.explanation)) ||
      ""
  ).trim();
}

function resolveItemId(item, index) {
  var explicit = String((item && (item.item_id || item.id)) || "").trim();
  if (explicit) return slugify(explicit);
  return "assessment-item-" + String(index + 1);
}

function isEvaluableMcq(item) {
  var records = optionRecords(item && item.options);
  var correct = resolveCorrectAnswer(item);
  if (!records.length || !correct) return false;
  return records.some(function (option) {
    return option.key === correct || option.text === correct || option.text.toLowerCase() === correct.toLowerCase();
  });
}

function canRenderInteractive(item) {
  var type = String((item && item.item_type) || "").toLowerCase();
  if (type === "short_answer" || type === "open_response" || type === "short_constructed_response") return false;
  if (
    type === "multiple_answer_mcq" ||
    type === "ordering" ||
    type === "classification" ||
    type === "matching"
  ) {
    return true;
  }
  return isEvaluableMcq(item);
}

function synthesizeTrueFalseOptions(item) {
  var type = String((item && item.item_type) || "").toLowerCase();
  if (type !== "true_false" && type !== "true-false") return normalizeOptions(item && item.options);
  var options = normalizeOptions(item && item.options);
  if (options.length) return options;
  return ["True", "False"];
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

function outcomeAttribute(item) {
  var ids = html.arrayOrEmpty(item && item.mapped_learning_outcomes).map(String).filter(Boolean);
  if (!ids.length) return "";
  return ' data-assessment-outcomes="' + html.escapeAttribute(ids.join("|")) + '"';
}

function itemArticleOpen(item, index, form) {
  var itemId = resolveItemId(item, index);
  var rationale = resolveRationale(item);
  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--formative util-assessment-item--interactive" data-assessment-mode="interactive" data-assessment-form="' +
    html.escapeAttribute(form) +
    '" data-workspace-kind="assessment_selection" data-workspace-id="assessment-' +
    html.escapeAttribute(itemId) +
    '" data-assessment-item-id="' +
    html.escapeAttribute(itemId) +
    '"' +
    outcomeAttribute(item) +
    (rationale ? ' data-assessment-rationale="' + html.escapeAttribute(rationale) + '"' : "") +
    ">" +
    '<header class="util-assessment-item-header">' +
    learnerIcons.renderAssessmentItemTitle(index + 1) +
    "</header><div class=\"util-assessment-item-body\">"
  );
}

function itemArticleClose() {
  return (
    '<button type="button" class="util-assessment-check" data-assessment-check>Check answer</button>' +
    '<div class="util-assessment-result" data-assessment-result aria-live="polite" hidden></div>' +
    "</div></article>"
  );
}

function renderInteractiveAssessmentItem(item, index) {
  var records = optionRecords(item && item.options);
  var correct = resolveCorrectAnswer(item);
  var matched = null;
  var i;
  for (i = 0; i < records.length; i += 1) {
    if (
      records[i].key === correct ||
      records[i].text === correct ||
      records[i].text.toLowerCase() === correct.toLowerCase()
    ) {
      matched = records[i];
      break;
    }
  }
  var stem = resolveStem(item);
  if (!stem || !records.length || !matched) {
    return renderStaticAssessmentItem(item, index);
  }
  var itemId = resolveItemId(item, index);
  var groupName = "assessment-group-" + itemId;
  var optionsHtml = records
    .map(function (option, optionIndex) {
      var optionId = "assessment-" + itemId + "-opt-" + String(optionIndex + 1);
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
  return (
    itemArticleOpen(item, index, "single_answer_mcq") +
    '<fieldset class="util-assessment-fieldset"><legend class="util-assessment-legend">' +
    html.renderMarkdownInline(stem) +
    "</legend>" +
    renderStimulus(item) +
    '<div class="util-assessment-choices">' +
    optionsHtml +
    '</div></fieldset>' +
    itemArticleClose()
  ).replace(
    "<article ",
    '<article data-assessment-correct="' + html.escapeAttribute(matched.key) + '" '
  );
}

function renderMultipleAnswerItem(item, index) {
  var records = optionRecords(item && item.options);
  var stem = resolveStem(item);
  var correct = html.arrayOrEmpty(item && (item.correct_answers || (item.judgement && item.judgement.correct_answers)));
  if (!stem || !records.length || !correct.length) return renderStaticAssessmentItem(item, index);
  var itemId = resolveItemId(item, index);
  var optionsHtml = records
    .map(function (option, optionIndex) {
      var optionId = "assessment-" + itemId + "-multi-" + String(optionIndex + 1);
      return (
        '<div class="util-assessment-option"><input type="checkbox" id="' +
        html.escapeAttribute(optionId) +
        '" value="' +
        html.escapeAttribute(option.key) +
        '" data-assessment-option="' +
        html.escapeAttribute(option.key) +
        '"><label for="' +
        html.escapeAttribute(optionId) +
        '">' +
        html.renderMarkdownInline(option.text) +
        "</label></div>"
      );
    })
    .join("");
  return (
    itemArticleOpen(item, index, "multiple_answer_mcq").replace(
      "<article ",
      '<article data-assessment-correct-set="' + html.escapeAttribute(correct.map(String).join("|")) + '" '
    ) +
    "<p>" +
    html.renderMarkdownInline(stem) +
    "</p>" +
    renderStimulus(item) +
    optionsHtml +
    itemArticleClose()
  );
}

function renderOrderingItem(item, index) {
  var prompt = item && item.prompt && typeof item.prompt === "object" ? item.prompt : {};
  var elements = html.arrayOrEmpty(prompt.items);
  var order = html.arrayOrEmpty(
    (item.judgement && item.judgement.correct_order) || item.correct_order
  );
  var stem = resolveStem(item);
  if (!stem || !elements.length || !order.length) return renderStaticAssessmentItem(item, index);
  var list = elements
    .map(function (element, elementIndex) {
      var id = String(element.id || "").trim();
      var text = String(element.text || "");
      var position = String(elementIndex + 1);
      var plain = text.replace(/<[^>]+>/g, "");
      var upDisabled = elementIndex === 0 ? " disabled" : "";
      var downDisabled = elementIndex === elements.length - 1 ? " disabled" : "";
      return (
        '<li class="util-assessment-order-row" data-assessment-element-id="' +
        html.escapeAttribute(id) +
        '"><span class="util-assessment-order-moves">' +
        '<button type="button" class="util-assessment-move" data-assessment-move="up"' +
        upDisabled +
        ' aria-label="' +
        html.escapeAttribute("Move " + plain + " up") +
        '">\u2191</button>' +
        '<button type="button" class="util-assessment-move" data-assessment-move="down"' +
        downDisabled +
        ' aria-label="' +
        html.escapeAttribute("Move " + plain + " down") +
        '">\u2193</button></span><span class="util-assessment-order-body"><span class="util-assessment-order-position" data-assessment-position>' +
        html.escapeHtml(position) +
        '</span><span class="util-assessment-order-text">' +
        html.renderMarkdownInline(text) +
        "</span></span></li>"
      );
    })
    .join("");
  return (
    itemArticleOpen(item, index, "ordering").replace(
      "<article ",
      '<article data-assessment-correct-order="' + html.escapeAttribute(order.map(String).join("|")) + '" '
    ) +
    "<p>" +
    html.renderMarkdownInline(stem) +
    "</p>" +
    renderStimulus(item) +
    '<ol class="util-assessment-order" data-assessment-order>' +
    list +
    "</ol>" +
    itemArticleClose()
  );
}

function renderClassificationItem(item, index) {
  var prompt = item && item.prompt && typeof item.prompt === "object" ? item.prompt : {};
  var categories = html.arrayOrEmpty(prompt.categories);
  var elements = html.arrayOrEmpty(prompt.items);
  var assignments =
    item.judgement && item.judgement.assignments && typeof item.judgement.assignments === "object"
      ? item.judgement.assignments
      : {};
  var stem = resolveStem(item);
  if (!stem || !categories.length || !elements.length) return renderStaticAssessmentItem(item, index);
  var options = categories
    .map(function (category) {
      return (
        '<option value="' +
        html.escapeAttribute(String(category.id || "")) +
        '">' +
        html.escapeHtml(String(category.label || category.id || "")) +
        "</option>"
      );
    })
    .join("");
  var rows = elements
    .map(function (element) {
      var subjectId = String(element.id || "");
      var selectId = "assessment-class-" + html.escapeAttribute(subjectId);
      return (
        '<div class="util-assessment-classify-row">' +
        '<label class="util-assessment-classify-item" for="' +
        selectId +
        '">' +
        html.renderMarkdownInline(String(element.text || "")) +
        '</label><select id="' +
        selectId +
        '" class="util-assessment-select" data-assessment-assignment data-assessment-subject="' +
        html.escapeAttribute(subjectId) +
        '"><option value="">Select a category</option>' +
        options +
        "</select></div>"
      );
    })
    .join("");
  var pairs = Object.keys(assignments)
    .map(function (key) {
      return String(key) + ":" + String(assignments[key]);
    })
    .join("|");
  return (
    itemArticleOpen(item, index, "classification").replace(
      "<article ",
      '<article data-assessment-correct-map="' + html.escapeAttribute(pairs) + '" '
    ) +
    "<p>" +
    html.renderMarkdownInline(stem) +
    "</p>" +
    renderStimulus(item) +
    '<div class="util-assessment-classify">' +
    rows +
    "</div>" +
    itemArticleClose()
  );
}

function renderMatchingItem(item, index) {
  var prompt = item && item.prompt && typeof item.prompt === "object" ? item.prompt : {};
  var left = html.arrayOrEmpty(prompt.left);
  var right = html.arrayOrEmpty(prompt.right);
  var pairs =
    item.judgement && item.judgement.pairs && typeof item.judgement.pairs === "object"
      ? item.judgement.pairs
      : {};
  var stem = resolveStem(item);
  if (!stem || !left.length || !right.length) return renderStaticAssessmentItem(item, index);
  var options = right
    .map(function (row) {
      return (
        '<option value="' +
        html.escapeAttribute(String(row.id || "")) +
        '">' +
        html.escapeHtml(String(row.text || "")) +
        "</option>"
      );
    })
    .join("");
  var rows = left
    .map(function (row) {
      var subjectId = String(row.id || "");
      var selectId = "assessment-match-" + html.escapeAttribute(subjectId);
      return (
        '<div class="util-assessment-match-row">' +
        '<label class="util-assessment-response-label" for="' +
        selectId +
        '">' +
        html.renderMarkdownInline(String(row.text || "")) +
        '</label><select id="' +
        selectId +
        '" class="util-assessment-select" data-assessment-pair data-assessment-subject="' +
        html.escapeAttribute(subjectId) +
        '"><option value="">Choose a match</option>' +
        options +
        "</select></div>"
      );
    })
    .join("");
  var encoded = Object.keys(pairs)
    .map(function (key) {
      return String(key) + ":" + String(pairs[key]);
    })
    .join("|");
  return (
    itemArticleOpen(item, index, "matching").replace(
      "<article ",
      '<article data-assessment-correct-map="' + html.escapeAttribute(encoded) + '" '
    ) +
    "<p>" +
    html.renderMarkdownInline(stem) +
    "</p>" +
    renderStimulus(item) +
    '<div class="util-assessment-match">' +
    rows +
    "</div>" +
    itemArticleClose()
  );
}

function renderAssessmentItem(item, index) {
  var type = String((item && item.item_type) || (item && item.form) || "").toLowerCase();
  if (type === "short_constructed_response" || type === "short_answer" || type === "open_response") {
    return renderShortConstructedResponse(item, index);
  }
  if (type === "multiple_answer_mcq") return renderMultipleAnswerItem(item, index);
  if (type === "ordering") return renderOrderingItem(item, index);
  if (type === "classification") return renderClassificationItem(item, index);
  if (type === "matching") return renderMatchingItem(item, index);
  if (canRenderInteractive(item)) {
    return renderInteractiveAssessmentItem(item, index);
  }
  return renderStaticAssessmentItem(item, index);
}

function renderStimulus(item) {
  var representation = item && item.representation;
  var media = representation && representation.media;
  var markup = media && media.format === "svg" ? String(media.markup || "") : "";
  if (!markup || markup.indexOf("<script") !== -1) return "";
  var alt = String((representation && representation.alt_text) || "").trim();
  return (
    '<figure class="util-assessment-stimulus" data-assessment-stimulus="' +
    html.escapeAttribute(String((representation && representation.component_id) || (item && item.id) || "")) +
    '">' +
    markup +
    (alt
      ? '<figcaption class="util-assessment-stimulus-alt">' + html.escapeHtml(alt) + "</figcaption>"
      : "") +
    "</figure>"
  );
}

function renderShortConstructedResponse(item, index) {
  var stem = resolveStem(item);
  var stimulus = renderStimulus(item);
  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--constructed" data-assessment-mode="constructed" data-auto-checkable="false">' +
    '<header class="util-assessment-item-header">' +
    learnerIcons.renderAssessmentItemTitle(index + 1) +
    "</header>" +
    '<div class="util-assessment-item-body">' +
    (stem
      ? '<p class="util-assessment-statement">' + html.renderMarkdownInline(stem) + "</p>"
      : "") +
    stimulus +
    '<label class="util-assessment-response-label">Your answer<textarea class="util-assessment-response" data-assessment-response rows="4"></textarea></label>' +
    "</div></article>"
  );
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
