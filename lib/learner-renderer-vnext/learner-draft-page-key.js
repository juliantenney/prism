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
 * Default resource id for the primary assembled learner page within a workflow.
 * Stable across title/activity churn; scoped by workflow_id in the draft key.
 */
var DEFAULT_LEARNER_PAGE_RESOURCE_ID = "learner-page";

/**
 * Stamp workflow-backed persistence identity onto a page model.
 *
 * Earliest authoritative layer: when a page is resolved/assembled under a known
 * workflow, identity must come from that workflow — not from title/activity fallback.
 * Does not overwrite existing workflow/page ids. No-ops when workflow id is absent.
 *
 * @param {Object} sourcePage
 * @param {Object|null|undefined} workflow
 * @returns {Object} the same page object (mutated) or the original value
 */
function attachLearnerPageIdentityFromWorkflow(sourcePage, workflow) {
  if (!sourcePage || typeof sourcePage !== "object" || Array.isArray(sourcePage)) {
    return sourcePage;
  }
  var wf = workflow && typeof workflow === "object" && !Array.isArray(workflow) ? workflow : null;
  var workflowId = firstNonEmpty([
    wf && wf.id,
    wf && wf.workflow_id,
    wf && wf.workflowId
  ]);
  if (!workflowId) return sourcePage;

  var page = sourcePage;
  if (!page.metadata || typeof page.metadata !== "object" || Array.isArray(page.metadata)) {
    page.metadata = {};
  }

  var existingWorkflowId = firstNonEmpty([
    page.metadata.workflow_id,
    page.metadata.workflowId,
    page.workflow_id,
    page.workflowId
  ]);
  if (!existingWorkflowId) {
    page.workflow_id = workflowId;
    page.metadata.workflow_id = workflowId;
  }

  var existingPageId = firstNonEmpty([
    page.metadata.page_id,
    page.metadata.pageId,
    page.metadata.lesson_id,
    page.metadata.lessonId,
    page.page_id,
    page.pageId
  ]);
  if (!existingPageId) {
    page.page_id = DEFAULT_LEARNER_PAGE_RESOURCE_ID;
    page.metadata.page_id = DEFAULT_LEARNER_PAGE_RESOURCE_ID;
  }

  var workflowName = firstNonEmpty([wf && wf.name, wf && wf.title]);
  if (workflowName && !firstNonEmpty([page.metadata.workflow_name, page.metadata.workflowName])) {
    page.metadata.workflow_name = workflowName;
  }
  var workflowSlug = firstNonEmpty([wf && wf.slug, wf && wf.workflow_slug, wf && wf.workflowSlug]);
  if (workflowSlug && !firstNonEmpty([page.metadata.workflow_slug, page.metadata.workflowSlug])) {
    page.metadata.workflow_slug = workflowSlug;
  }

  var resolution =
    wf &&
    wf.workflowBriefResolution &&
    typeof wf.workflowBriefResolution === "object" &&
    !Array.isArray(wf.workflowBriefResolution)
      ? wf.workflowBriefResolution
      : null;
  var resolvedFactors =
    resolution &&
    resolution.resolvedFactors &&
    typeof resolution.resolvedFactors === "object" &&
    !Array.isArray(resolution.resolvedFactors)
      ? resolution.resolvedFactors
      : null;
  if (resolvedFactors) {
    if (
      !page.constraints_applied ||
      typeof page.constraints_applied !== "object" ||
      Array.isArray(page.constraints_applied)
    ) {
      page.constraints_applied = {};
    }
    var deliveryMode = firstNonEmpty([resolvedFactors.delivery_mode]);
    var deliveryContext = firstNonEmpty([resolvedFactors.delivery_context]);
    if (deliveryMode && !firstNonEmpty([page.constraints_applied.delivery_mode])) {
      page.constraints_applied.delivery_mode = deliveryMode;
    }
    if (deliveryContext && !firstNonEmpty([page.constraints_applied.delivery_context])) {
      page.constraints_applied.delivery_context = deliveryContext;
    }
  }

  return page;
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
  DEFAULT_LEARNER_PAGE_RESOURCE_ID: DEFAULT_LEARNER_PAGE_RESOURCE_ID,
  attachLearnerPageIdentityFromWorkflow: attachLearnerPageIdentityFromWorkflow,
  buildLearnerDraftPageIdentity: buildLearnerDraftPageIdentity,
  migrateLearnerDraft: migrateLearnerDraft
};
