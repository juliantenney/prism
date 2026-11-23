/**
 * Workflow-scoped learner runtime clear (draft envelopes + journal acknowledgements).
 * Used by Clear run data so authored designs remain while learner responses reset.
 */
"use strict";

var constants = require("./learner-draft-constants");
var storageFactory = require("./learner-draft-storage");
var pageKeyMod = require("./learner-draft-page-key");

// Keep in sync with learner-artefact-contract.JOURNAL_ACK_STORAGE_KEY_PREFIX
var JOURNAL_ACK_STORAGE_KEY_PREFIX = "prism:lj-journal:ack:";

function asText(value) {
  return value == null ? "" : String(value).trim();
}

function slugWorkflowId(workflowId) {
  return pageKeyMod.slugPart(workflowId);
}

/**
 * Storage key prefix for draft envelopes belonging to one workflow.
 * pageKey form: v{n}::{workflowSlug}::{pageId}::...
 */
function learnerDraftStorageKeyPrefixForWorkflow(workflowId) {
  var slug = slugWorkflowId(workflowId);
  if (!slug || slug === "na") return "";
  return (
    constants.STORAGE_KEY_PREFIX +
    "v" +
    String(constants.DRAFT_SCHEMA_VERSION) +
    "::" +
    slug +
    "::"
  );
}

function listStorageKeys(backend) {
  var keys = [];
  if (!backend) return keys;
  if (typeof backend.keys === "function") {
    try {
      var listed = backend.keys();
      if (Array.isArray(listed)) return listed.map(String);
    } catch (_err) {}
  }
  if (typeof backend.length === "number" && typeof backend.key === "function") {
    var i = 0;
    for (; i < backend.length; i += 1) {
      try {
        var k = backend.key(i);
        if (k != null) keys.push(String(k));
      } catch (_err2) {}
    }
    return keys;
  }
  // Test harness often wraps a plain bag as { getItem, setItem, removeItem, storage }.
  if (backend.storage && typeof backend.storage === "object" && !Array.isArray(backend.storage)) {
    return Object.keys(backend.storage).map(String);
  }
  if (typeof Map !== "undefined" && backend instanceof Map) {
    backend.forEach(function (_value, key) {
      keys.push(String(key));
    });
    return keys;
  }
  Object.keys(backend).forEach(function (key) {
    if (
      key === "getItem" ||
      key === "setItem" ||
      key === "removeItem" ||
      key === "key" ||
      key === "length" ||
      key === "keys" ||
      key === "storage" ||
      key === "clear"
    ) {
      return;
    }
    keys.push(String(key));
  });
  return keys;
}

function deleteKeysWithPrefix(backend, prefix) {
  var deleted = [];
  var failed = [];
  var needle = asText(prefix);
  if (!needle || !backend || typeof backend.removeItem !== "function") {
    return { ok: false, deleted: deleted, failed: failed, reason: "unavailable" };
  }
  listStorageKeys(backend).forEach(function (key) {
    if (String(key).indexOf(needle) !== 0) return;
    try {
      backend.removeItem(key);
      deleted.push(key);
    } catch (_err) {
      failed.push(key);
    }
  });
  return { ok: failed.length === 0, deleted: deleted, failed: failed };
}

/**
 * Delete all learner draft envelopes whose pageKey is scoped to workflowId.
 */
function deleteLearnerDraftsForWorkflow(workflowId, options) {
  var opts = options && typeof options === "object" ? options : {};
  var wid = asText(workflowId);
  var prefix = learnerDraftStorageKeyPrefixForWorkflow(wid);
  if (!wid || !prefix) {
    return { ok: false, deleted: [], failed: [], reason: "missing-workflow" };
  }
  var backend =
    Object.prototype.hasOwnProperty.call(opts, "storage") && opts.storage != null
      ? opts.storage
      : storageFactory.resolveDefaultBrowserStorage();
  return deleteKeysWithPrefix(backend, prefix);
}

/**
 * Delete Learning Journal acknowledgement records that include this workflow id.
 * Ack keys: prism:lj-journal:ack:{journeyKey}; journey keys often embed workflow id.
 */
function deleteJournalAcknowledgementsForWorkflow(workflowId, options) {
  var opts = options && typeof options === "object" ? options : {};
  var wid = asText(workflowId);
  if (!wid) {
    return { ok: false, deleted: [], failed: [], reason: "missing-workflow" };
  }
  var backend =
    Object.prototype.hasOwnProperty.call(opts, "storage") && opts.storage != null
      ? opts.storage
      : storageFactory.resolveDefaultBrowserStorage();
  if (!backend || typeof backend.removeItem !== "function") {
    return { ok: false, deleted: [], failed: [], reason: "unavailable" };
  }
  var ackPrefix = JOURNAL_ACK_STORAGE_KEY_PREFIX;
  var deleted = [];
  var failed = [];
  listStorageKeys(backend).forEach(function (key) {
    var raw = String(key || "");
    if (raw.indexOf(ackPrefix) !== 0) return;
    // Match workflow id as a delimited segment inside the journey key.
    var journeyKey = raw.slice(ackPrefix.length);
    var delimited =
      journeyKey === wid ||
      journeyKey.indexOf(":" + wid + ":") >= 0 ||
      journeyKey.indexOf(":" + wid) === journeyKey.length - (wid.length + 1) ||
      journeyKey.indexOf(wid + ":") === 0 ||
      journeyKey.indexOf("lj:" + wid + ":") === 0;
    if (!delimited) return;
    try {
      backend.removeItem(raw);
      deleted.push(raw);
    } catch (_err) {
      failed.push(raw);
    }
  });
  return { ok: failed.length === 0, deleted: deleted, failed: failed };
}

/**
 * Clear mounted draft UIs whose pageKey belongs to the workflow (same document).
 * Cancels pending saves so they cannot recreate deleted envelopes.
 */
function clearMountedLearnerDraftUisForWorkflow(workflowId, options) {
  var opts = options && typeof options === "object" ? options : {};
  var wid = asText(workflowId);
  var slug = slugWorkflowId(wid);
  var pageKeyPrefix = "v" + String(constants.DRAFT_SCHEMA_VERSION) + "::" + slug + "::";
  var doc =
    opts.document ||
    (typeof document !== "undefined" ? document : null);
  var cleared = 0;
  if (!wid || !slug || slug === "na" || !doc || typeof doc.querySelectorAll !== "function") {
    return { ok: true, cleared: 0, skipped: true };
  }
  var roots = doc.querySelectorAll(
    "main.util-learner-renderer-vnext[data-persistence-page-key], [data-persistence-page-key][data-workspace-kind], [data-persistence-page-key]"
  );
  var i = 0;
  for (; i < roots.length; i += 1) {
    var root = roots[i];
    if (!root || typeof root.getAttribute !== "function") continue;
    var pageKey = asText(root.getAttribute("data-persistence-page-key"));
    if (!pageKey || pageKey.indexOf(pageKeyPrefix) !== 0) continue;
    var handle = root.__prismDraftPersistence;
    if (handle && typeof handle.clearDraftSilent === "function") {
      handle.clearDraftSilent();
      cleared += 1;
    }
  }
  return { ok: true, cleared: cleared };
}

/**
 * Full learner-runtime clear for one workflow (storage + mounted UI).
 * Does not touch authored workflow definitions or run-capture resources.
 */
function deleteLearnerRuntimeStateForWorkflow(workflowId, options) {
  var opts = options && typeof options === "object" ? options : {};
  var drafts = deleteLearnerDraftsForWorkflow(workflowId, opts);
  var acks = deleteJournalAcknowledgementsForWorkflow(workflowId, opts);
  var mounted = clearMountedLearnerDraftUisForWorkflow(workflowId, opts);
  return {
    ok: !!(drafts.ok && acks.ok),
    drafts: drafts,
    acknowledgements: acks,
    mounted: mounted
  };
}

module.exports = {
  slugWorkflowId: slugWorkflowId,
  learnerDraftStorageKeyPrefixForWorkflow: learnerDraftStorageKeyPrefixForWorkflow,
  deleteLearnerDraftsForWorkflow: deleteLearnerDraftsForWorkflow,
  deleteJournalAcknowledgementsForWorkflow: deleteJournalAcknowledgementsForWorkflow,
  clearMountedLearnerDraftUisForWorkflow: clearMountedLearnerDraftUisForWorkflow,
  deleteLearnerRuntimeStateForWorkflow: deleteLearnerRuntimeStateForWorkflow
};
