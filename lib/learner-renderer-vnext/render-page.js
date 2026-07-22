"use strict";

var html = require("./render-html-utils");
var renderActivity = require("./render-activity").renderActivity;
var renderVisualAffordance =
  require("./render-visual-affordance").renderVisualAffordanceHook;
var learnerIcons = require("./learner-icon-renderer");
var iconRegistry = require("./learner-icon-registry");
var getOrderingRuntimeScript =
  require("./ordering-runtime").getOrderingRuntimeScript;
var getLearnerDraftRuntimeScript =
  require("./learner-draft-runtime").getLearnerDraftRuntimeScript;

function hasOrientationType(sections, type) {
  return html.arrayOrEmpty(sections).some(function (section) {
    return section.type === type;
  });
}

function renderMarkdownRegion(text) {
  return html.renderMarkdownBlock(text) || html.renderPlainText(text);
}

function renderHeader(model) {
  var description = String((model.header && model.header.description) || "").trim();
  var showDescription =
    description && !hasOrientationType(model.orientationSections, "overview");
  var duration =
    model.header && model.header.durationMinutes != null
      ? '<p class="util-page-duration" data-duration-minutes="' +
        html.escapeAttribute(model.header.durationMinutes) +
        '">' +
        html.escapeHtml(model.header.durationMinutes) +
        " minutes</p>"
      : "";

  return (
    '<header class="util-page-header util-learning-header">' +
    "<h1>" +
    html.escapeHtml(model.title) +
    "</h1>" +
    (showDescription
      ? '<div class="util-page-description util-prose-measure">' +
        renderMarkdownRegion(description) +
        "</div>"
      : "") +
    duration +
    "</header>"
  );
}

function renderOrientationSection(section) {
  var semanticKey =
    iconRegistry.semanticKeyForOrientationType(section.type) || "section.overview";
  return (
    '<section class="util-orientation-section util-' +
    html.escapeAttribute(section.type) +
    '" data-orientation-type="' +
    html.escapeAttribute(section.type) +
    '">' +
    learnerIcons.renderSectionHeading(section.title, semanticKey) +
    '<div class="util-orientation-content util-' +
    html.escapeAttribute(section.type) +
    '__content util-prose-measure">' +
    renderMarkdownRegion(section.content) +
    "</div></section>"
  );
}

function renderOrientationRegion(model) {
  var innerParts = html.arrayOrEmpty(model.orientationSections).map(renderOrientationSection);

  var outcomesHtml = renderLearningOutcomes(model.learningOutcomes);
  if (outcomesHtml) innerParts.push(outcomesHtml);

  var progressionHtml = renderProgressionGuidance(model.progressionGuidance);
  if (progressionHtml) innerParts.push(progressionHtml);

  if (!innerParts.length) return "";

  return (
    '<section class="util-page-orientation" data-region="orientation">' +
    '<div id="journey-orient">' +
    innerParts.join("") +
    "</div></section>"
  );
}

function renderLearningOutcomes(outcomes) {
  var rows = html.arrayOrEmpty(outcomes).filter(function (outcome) {
    return outcome && outcome.statement;
  });
  if (!rows.length) return "";

  var items = rows
    .map(function (outcome, index) {
      return (
        "<li>" +
        html.renderMarkdownInline(outcome.statement) +
        ' <span class="util-outcome-id">(' +
        html.escapeHtml(outcome.id || String(index + 1)) +
        ")</span></li>"
      );
    })
    .join("");

  return (
    '<section class="util-orientation-section util-learning-outcomes" data-orientation-type="learning_outcomes">' +
    learnerIcons.renderSectionHeading("Learning outcomes", "section.learning_outcomes") +
    '<div class="util-orientation-content util-learning-outcomes__content util-prose-measure">' +
    '<p>By the end of this lesson, you should be able to:</p>' +
    "<ol>" +
    items +
    "</ol></div></section>"
  );
}

function renderProgressionGuidance(text) {
  var guidance = String(text || "").trim();
  if (!guidance) return "";
  return (
    '<section class="util-orientation-section util-progression-guidance" data-orientation-type="progression_guidance">' +
    learnerIcons.renderSectionHeading("How this lesson progresses", "section.progression") +
    '<div class="util-orientation-content util-progression-guidance__content util-prose-measure">' +
    "<p>" +
    html.escapeHtml(guidance) +
    "</p></div></section>"
  );
}

function renderAssessmentFeedback(item) {
  var correct =
    String(
      (item && (item.correct_answer_text || item.correct_answer)) || ""
    ).trim() || "";
  var rationale = String(
    (item && (item.explanation_or_rationale || item.explanation)) || ""
  ).trim();
  var relatedOutcomes = html.arrayOrEmpty(item && item.related_learning_outcomes)
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

function renderAssessmentItem(item, index) {
  var stem = String(
    (item && (item.stem || item.question || item.prompt || item.text)) || ""
  ).trim();
  var options = html.arrayOrEmpty(item && item.options);
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
            return "<li>" + html.renderMarkdownInline(String(option || "")) + "</li>";
          })
          .join("") +
        "</ul></div>"
    );
  }

  var feedback = renderAssessmentFeedback(item);
  if (feedback) bodyParts.push(feedback);

  var body = bodyParts.join("");
  if (!body) return "";

  var number = index + 1;
  return (
    '<article class="util-task-block util-assessment-item util-assessment-item--formative">' +
    '<header class="util-assessment-item-header">' +
    learnerIcons.renderAssessmentItemTitle(number) +
    "</header>" +
    '<div class="util-assessment-item-body">' +
    body +
    "</div></article>"
  );
}

function renderAssessment(assessment, assessmentHook) {
  var items = html.arrayOrEmpty(assessment && assessment.items);
  if (!items.length) return "";

  var rendered = items
    .map(function (item, index) {
      return renderAssessmentItem(item, index);
    })
    .filter(function (fragment) {
      return String(fragment || "").trim() !== "";
    });

  if (!rendered.length) return "";

  var hookHtml = assessmentHook ? renderVisualAffordance(assessmentHook) : "";

  return (
    '<section class="util-assessment-guidance util-assessment-section" data-region="assessment">' +
    learnerIcons.renderAssessmentSectionHeading() +
    hookHtml +
    '<div class="util-assessment-list">' +
    rendered.join("") +
    "</div></section>"
  );
}

function renderStudyTips(studyTips) {
  if (!String(studyTips || "").trim()) return "";
  return (
    '<aside class="util-study-tips" data-region="study-tips">' +
    learnerIcons.renderSectionHeading("Study tips", "section.study_tips") +
    '<div class="util-study-tips__content util-prose-measure">' +
    renderMarkdownRegion(studyTips) +
    "</div></aside>"
  );
}

/**
 * Render a validated LearnerPageModel in its existing activity order.
 *
 * @param {import("./types").LearnerPageModel} model
 * @param {import("./types").LearnerPageRenderOptions=} renderOptions
 * @returns {string}
 */
function renderPage(model, renderOptions) {
  var options = renderOptions && typeof renderOptions === "object" ? renderOptions : {};
  var activityComposition = options.activityComposition || Object.create(null);
  var compositionMode = String(options.compositionMode || "").trim();
  var compositionDiagnostics =
    options.compositionDiagnostics && typeof options.compositionDiagnostics === "object"
      ? options.compositionDiagnostics
      : null;
  var activities = html.arrayOrEmpty(model.activities).map(function (activity) {
    return renderActivity(activity, activityComposition[activity.id] || null);
  }).join("");
  var activityRegion = activities
    ? '<section class="util-learning-activities" data-region="activities">' +
      activities +
      "</section>"
    : "";

  var body = html.joinHtml([
    renderHeader(model),
    renderOrientationRegion(model),
    activityRegion,
    renderAssessment(model.assessment, model.visualAffordanceBeforeAssessment),
    renderStudyTips(model.studyTips)
  ]);

  var orderingScript =
    body.indexOf('data-workspace-kind="ordering"') >= 0
      ? "<script>" + getOrderingRuntimeScript() + "</script>"
      : "";

  var hasLearnerWorkspace =
    body.indexOf('data-workspace-kind="text_entry"') >= 0 ||
    body.indexOf('data-workspace-kind="table_entry"') >= 0 ||
    body.indexOf('data-workspace-kind="ordering"') >= 0;
  var draftScript = hasLearnerWorkspace
    ? "<script>" + getLearnerDraftRuntimeScript() + "</script>"
    : "";

  var persistence = options.persistenceIdentity || null;
  var persistenceAttrs = "";
  if (persistence && persistence.pageKey) {
    persistenceAttrs +=
      ' data-persistence-page-key="' +
      html.escapeAttribute(persistence.pageKey) +
      '" data-persistence-storage-key="' +
      html.escapeAttribute(persistence.storageKey || "") +
      '"';
    if (persistence.unstable) {
      persistenceAttrs += ' data-persistence-identity-unstable="true"';
    }
  }

  var draftControlsHtml = hasLearnerWorkspace
    ? '<div class="util-learner-draft-controls" data-learner-draft-controls="true">' +
      '<p class="util-learner-draft-status" aria-live="polite" data-learner-draft-status>Draft not saved</p>' +
      '<button type="button" class="util-learner-draft-clear" data-learner-draft-clear ' +
      'aria-label="Clear saved responses for this page">Clear saved responses</button>' +
      "</div>"
    : "";

  return (
    '<main class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext"' +
    persistenceAttrs +
    (compositionMode
      ? ' data-composition-mode="' + html.escapeAttribute(compositionMode) + '"'
      : "") +
    (compositionDiagnostics
      ? ' data-composed-activity-count="' +
        html.escapeAttribute(String(compositionDiagnostics.composedActivityCount || 0)) +
        '" data-beats-fallback-activity-count="' +
        html.escapeAttribute(String(compositionDiagnostics.beatsFallbackActivityCount || 0)) +
        '"'
      : "") +
    ">" +
    draftControlsHtml +
    body +
    orderingScript +
    draftScript +
    "</main>"
  );
}

module.exports = {
  renderPage: renderPage
};
