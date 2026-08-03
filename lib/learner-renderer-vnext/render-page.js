"use strict";

var html = require("./render-html-utils");
var renderActivity = require("./render-activity").renderActivity;
var renderVisualAffordance =
  require("./render-visual-affordance").renderVisualAffordanceHook;
var learnerIcons = require("./learner-icon-renderer");
var iconRegistry = require("./learner-icon-registry");
var getOrderingRuntimeScript =
  require("./ordering-runtime").getOrderingRuntimeScript;
var getAssessmentRuntimeScript =
  require("./assessment-runtime").getAssessmentRuntimeScript;
var getGuidedReviewRuntimeScript =
  require("./guided-review-runtime").getGuidedReviewRuntimeScript;
var getLearnerDraftRuntimeScript =
  require("./learner-draft-runtime").getLearnerDraftRuntimeScript;
var assessmentInteractive = require("./assessment-interactive");
var SUPPORTED_VISUAL_SLOTS = {
  "activity-after-header": true,
  "materials-entry": true,
  "materials-card-grid-after": true,
  "materials-table-pair-between": true,
  "assessment-before-checkpoint": true,
  "knowledge-summary-after-content": true
};

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

function renderOrientationSection(section, visualOptions, model) {
  var semanticKey =
    iconRegistry.semanticKeyForOrientationType(section.type) || "section.overview";
  var afterHook = "";
  if (
    section &&
    section.type === "knowledge_summary" &&
    model &&
    model.visualAffordanceAfterKnowledgeSummary
  ) {
    afterHook = renderVisualAffordance(model.visualAffordanceAfterKnowledgeSummary, visualOptions);
  }
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
    "</div>" +
    afterHook +
    "</section>"
  );
}

function renderOrientationRegion(model, visualOptions) {
  var innerParts = html.arrayOrEmpty(model.orientationSections).map(function (section) {
    return renderOrientationSection(section, visualOptions, model);
  });

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

function renderAssessmentItem(item, index) {
  return assessmentInteractive.renderAssessmentItem(item, index);
}

function renderAssessment(assessment, assessmentHook, renderOptions) {
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

  var hookHtml = assessmentHook ? renderVisualAffordance(assessmentHook, renderOptions) : "";

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

function pushUniqueWarning(store, warning) {
  var key = [warning.code, warning.brief_id || "", warning.affordance_id || "", warning.visual_slot || ""].join("|");
  if (store._keys[key]) return;
  store._keys[key] = true;
  store.items.push(warning);
}

function buildVisualAssetResolver(manifest, diagnostics, model) {
  var assets = manifest && Array.isArray(manifest.assets) ? manifest.assets : [];
  if (!assets.length) return null;
  var byAffordance = Object.create(null);
  var bySlot = Object.create(null);
  var activityIds = Object.create(null);
  html.arrayOrEmpty(model && model.activities).forEach(function (activity) {
    activityIds[String(activity.id || "").trim()] = true;
  });
  assets.forEach(function (asset) {
    if (!asset || typeof asset !== "object") return;
    var affordanceId = String(asset.affordance_id || "").trim();
    if (affordanceId) {
      if (!byAffordance[affordanceId]) byAffordance[affordanceId] = [];
      byAffordance[affordanceId].push(asset);
    }
    var key = [
      String(asset.scope || "").trim(),
      String(asset.activity_id || "").trim(),
      String(asset.visual_slot || "").trim()
    ].join("|");
    if (!bySlot[key]) bySlot[key] = [];
    bySlot[key].push(asset);

    if (String(asset.scope || "") === "activity" && asset.activity_id && !activityIds[String(asset.activity_id)]) {
      pushUniqueWarning(diagnostics.warnings, {
        code: "VAR_ASSET_ACTIVITY_NOT_FOUND",
        brief_id: String(asset.brief_id || ""),
        affordance_id: String(asset.affordance_id || ""),
        activity_id: String(asset.activity_id || "")
      });
    }
    if (asset.visual_slot && !SUPPORTED_VISUAL_SLOTS[String(asset.visual_slot)]) {
      pushUniqueWarning(diagnostics.warnings, {
        code: "VAR_ASSET_SLOT_UNSUPPORTED",
        brief_id: String(asset.brief_id || ""),
        affordance_id: String(asset.affordance_id || ""),
        visual_slot: String(asset.visual_slot || "")
      });
    }
  });
  return function resolveVisualAsset(hook) {
    if (!hook || typeof hook !== "object") return null;
    var slot = String(hook.slot || "");
    if (slot && !SUPPORTED_VISUAL_SLOTS[slot]) {
      pushUniqueWarning(diagnostics.warnings, {
        code: "VAR_ASSET_SLOT_UNSUPPORTED",
        visual_slot: slot,
        affordance_id: String(hook.affordanceId || "")
      });
      return null;
    }
    var affordanceId = String(hook.affordanceId || "").trim();
    if (affordanceId && byAffordance[affordanceId] && byAffordance[affordanceId].length) {
      if (byAffordance[affordanceId].length > 1) {
        pushUniqueWarning(diagnostics.warnings, {
          code: "VAR_ASSET_MATCH_AMBIGUOUS",
          affordance_id: affordanceId
        });
        return null;
      }
      return byAffordance[affordanceId][0];
    }
    var slotKey = [
      String(hook.activityId ? "activity" : "page"),
      String(hook.activityId || "").trim(),
      String(hook.slot || "").trim()
    ].join("|");
    var candidates = bySlot[slotKey] || [];
    if (candidates.length > 1) {
      pushUniqueWarning(diagnostics.warnings, {
        code: "VAR_ASSET_MATCH_AMBIGUOUS",
        visual_slot: String(hook.slot || ""),
        activity_id: String(hook.activityId || "")
      });
      return null;
    }
    return candidates.length ? candidates[0] : null;
  };
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
  var visualAssetDiagnostics = {
    warnings: { _keys: Object.create(null), items: [] },
    placements: []
  };
  var visualAssetResolver = buildVisualAssetResolver(
    options.visualAssets,
    visualAssetDiagnostics,
    model
  );
  var visualAssetOptions = {
    resolveVisualAsset: visualAssetResolver,
    figureCounter: { value: 0 },
    registerVisualAssetPlacement: function (placement) {
      visualAssetDiagnostics.placements.push(placement);
    },
    registerVisualAssetWarning: function (warning) {
      pushUniqueWarning(visualAssetDiagnostics.warnings, warning);
    }
  };

  // Render regions in final learner-facing DOM order so figure numbering matches
  // reading order (orientation/knowledge-summary before activities before assessment).
  var headerHtml = renderHeader(model);
  var orientationHtml = renderOrientationRegion(model, visualAssetOptions);
  var activities = html.arrayOrEmpty(model.activities).map(function (activity) {
    return renderActivity(activity, activityComposition[activity.id] || null, visualAssetOptions);
  }).join("");
  var activityRegion = activities
    ? '<section class="util-learning-activities" data-region="activities">' +
      activities +
      "</section>"
    : "";
  var assessmentHtml = renderAssessment(
    model.assessment,
    model.visualAffordanceBeforeAssessment,
    visualAssetOptions
  );
  var studyTipsHtml = renderStudyTips(model.studyTips);

  var body = html.joinHtml([
    headerHtml,
    orientationHtml,
    activityRegion,
    assessmentHtml,
    studyTipsHtml
  ]);

  var orderingScript =
    body.indexOf('data-workspace-kind="ordering"') >= 0
      ? "<script>" + getOrderingRuntimeScript() + "</script>"
      : "";

  var assessmentScript =
    body.indexOf('data-workspace-kind="assessment_selection"') >= 0
      ? "<script>" + getAssessmentRuntimeScript() + "</script>"
      : "";

  var guidedReviewScript =
    body.indexOf('data-guided-review="true"') >= 0
      ? "<script>" + getGuidedReviewRuntimeScript() + "</script>"
      : "";

  var hasLearnerWorkspace =
    body.indexOf('data-workspace-kind="text_entry"') >= 0 ||
    body.indexOf('data-workspace-kind="table_entry"') >= 0 ||
    body.indexOf('data-workspace-kind="ordering"') >= 0 ||
    body.indexOf('data-workspace-kind="assessment_selection"') >= 0 ||
    body.indexOf('data-workspace-kind="checklist_entry"') >= 0;
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

  if (options && typeof options === "object") {
    var manifestAssets =
      options.visualAssets && Array.isArray(options.visualAssets.assets)
        ? options.visualAssets.assets
        : [];
    var placedByBriefId = Object.create(null);
    visualAssetDiagnostics.placements.forEach(function (placement) {
      var briefId = String((placement && placement.brief_id) || "").trim();
      if (briefId) placedByBriefId[briefId] = true;
    });
    var unmatched = [];
    manifestAssets.forEach(function (asset) {
      if (!asset || typeof asset !== "object") return;
      var briefId = String(asset.brief_id || "").trim();
      if (briefId && !placedByBriefId[briefId]) {
        unmatched.push({
          code: "VAR_ASSET_UNPLACED",
          brief_id: briefId,
          affordance_id: String(asset.affordance_id || ""),
          activity_id: String(asset.activity_id || ""),
          visual_slot: String(asset.visual_slot || "")
        });
      }
    });
    unmatched.forEach(function (warning) {
      pushUniqueWarning(visualAssetDiagnostics.warnings, warning);
    });
    options.visualAssetDiagnostics = {
      warnings: visualAssetDiagnostics.warnings.items,
      placements: visualAssetDiagnostics.placements,
      suppliedAssetCount: manifestAssets.length,
      matchedAssetCount: visualAssetDiagnostics.placements.length,
      unmatchedAssets: unmatched
    };
  }

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
    assessmentScript +
    guidedReviewScript +
    draftScript +
    "</main>"
  );
}

module.exports = {
  renderPage: renderPage
};
