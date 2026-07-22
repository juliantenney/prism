"use strict";

var constants = require("./learner-draft-constants");

function firstNonEmpty(values) {
  for (var i = 0; i < values.length; i += 1) {
    var text = String(values[i] == null ? "" : values[i]).trim();
    if (text) return text;
  }
  return "";
}

function slugPart(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9._:-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "na"
  );
}

/**
 * Build a deterministic page identity for local draft isolation.
 *
 * Hierarchy: workflowId → page/lesson id → schema version → ordered activity ids → title.
 * Does not hash visible prose bodies. Does not use rendered HTML.
 *
 * @param {Object} sourcePage
 * @returns {{
 *   pageKey: string,
 *   storageKey: string,
 *   unstable: boolean,
 *   components: Object,
 *   diagnostic: Object|null
 * }}
 */
function buildLearnerDraftPageIdentity(sourcePage) {
  var page = sourcePage && typeof sourcePage === "object" ? sourcePage : {};
  var metadata = page.metadata && typeof page.metadata === "object" ? page.metadata : {};
  var workflowId = firstNonEmpty([
    metadata.workflow_id,
    metadata.workflowId,
    page.workflow_id,
    page.workflowId
  ]);
  var pageId = firstNonEmpty([
    metadata.page_id,
    metadata.pageId,
    metadata.lesson_id,
    metadata.lessonId,
    page.page_id,
    page.pageId
  ]);
  var schemaVersion = firstNonEmpty([page.schema_version, page.schemaVersion, "unknown"]);
  var title = firstNonEmpty([page.title]);
  var activityIds = (Array.isArray(page.activities) ? page.activities : [])
    .map(function (activity) {
      return String((activity && activity.activity_id) || "").trim();
    })
    .filter(Boolean)
    .join(",");

  var unstable = !workflowId && !pageId;
  var diagnostic = null;
  if (unstable) {
    diagnostic = {
      code: constants.DIAGNOSTIC.UNSTABLE_PERSISTENCE_PAGE_IDENTITY,
      message:
        "Draft page identity falls back to title and activity membership because workflow/page ids are absent."
    };
  }

  var components = {
    workflowId: workflowId || "no-workflow",
    pageId: pageId || "no-page-id",
    schemaVersion: schemaVersion,
    activityIds: activityIds || "no-activities",
    title: title || "untitled"
  };

  var pageKey = [
    "v" + String(constants.DRAFT_SCHEMA_VERSION),
    slugPart(components.workflowId),
    slugPart(components.pageId),
    slugPart(components.schemaVersion),
    slugPart(components.activityIds),
    slugPart(components.title)
  ].join("::");

  return {
    pageKey: pageKey,
    storageKey: constants.STORAGE_KEY_PREFIX + pageKey,
    unstable: unstable,
    components: components,
    diagnostic: diagnostic
  };
}

function migrateLearnerDraft(envelope) {
  // Future migrations land here. Version 1 is accepted as-is.
  return {
    ok: true,
    envelope: envelope,
    migrated: false
  };
}

module.exports = {
  buildLearnerDraftPageIdentity: buildLearnerDraftPageIdentity,
  migrateLearnerDraft: migrateLearnerDraft
};
