"use strict";

/**
 * Sprint 92 Gate 8 Slice 5 — deterministic Situated record-entry → text_entry workspaces.
 *
 * Maps situated_learning.record.entries to shared WorkspaceRequirement rows.
 * Optional placement.after_section_id splits embedded vs consolidated presentation.
 * No educational decisions; no Interactive activities[]; no persistence concepts.
 */

var types = require("./response-part-types");
var workspaceFromResponsePart =
  require("./learner-surface-registry").workspaceFromResponsePart;

var WORKSPACE_OWNER_ID = "situated-record";

function asText(value) {
  return String(value == null ? "" : value).trim();
}

function readRecordEntries(sourcePage) {
  var sl =
    sourcePage &&
    sourcePage.situated_learning &&
    typeof sourcePage.situated_learning === "object" &&
    !Array.isArray(sourcePage.situated_learning)
      ? sourcePage.situated_learning
      : null;
  var record = sl && sl.record && typeof sl.record === "object" && !Array.isArray(sl.record) ? sl.record : null;
  if (!record || !Array.isArray(record.entries)) return [];
  return record.entries.slice();
}

function normalizeEntries(sourcePage) {
  return readRecordEntries(sourcePage)
    .map(function (entry, index) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      var entryId = asText(entry.entry_id);
      if (!entryId) return null;
      var label = asText(entry.label);
      if (!label) return null;
      var prompt = asText(entry.prompt);
      var order =
        typeof entry.order === "number" && Number.isFinite(entry.order)
          ? entry.order
          : index + 1;
      var afterSectionId = "";
      if (
        entry.placement &&
        typeof entry.placement === "object" &&
        !Array.isArray(entry.placement)
      ) {
        afterSectionId = asText(entry.placement.after_section_id);
      }
      return {
        entry_id: entryId,
        order: order,
        label: label,
        prompt: prompt,
        after_section_id: afterSectionId
      };
    })
    .filter(Boolean)
    .sort(function (a, b) {
      if (a.order !== b.order) return a.order - b.order;
      return a.entry_id < b.entry_id ? -1 : a.entry_id > b.entry_id ? 1 : 0;
    });
}

function workspaceFromNormalizedEntry(entry) {
  var part = {
    responsePartId: entry.entry_id,
    sourceKind: types.SOURCE_KIND.SITUATED_RECORD_ENTRY,
    sourceId: entry.entry_id,
    label: entry.label,
    prompt: entry.prompt || entry.label,
    guidance: "",
    surfaceKind: types.SURFACE_KIND.TEXT_ENTRY,
    inputModality: types.INPUT_MODALITY.TEXT,
    order: entry.order,
    rows: 5,
    provenance: {
      ownerKind: "situated_record",
      entryId: entry.entry_id,
      afterSectionId: entry.after_section_id || ""
    }
  };
  var mapped = workspaceFromResponsePart(part, { activityId: WORKSPACE_OWNER_ID });
  if (mapped && mapped.ok && mapped.workspace) {
    return mapped.workspace;
  }
  return null;
}

/**
 * @param {Object} sourcePage
 * @returns {import("./types").WorkspaceRequirement[]}
 */
function composeSituatedRecordWorkspaces(sourcePage) {
  var workspaces = [];
  normalizeEntries(sourcePage).forEach(function (entry) {
    var workspace = workspaceFromNormalizedEntry(entry);
    if (workspace) workspaces.push(workspace);
  });
  return workspaces;
}

/**
 * Split record workspaces by optional placement.after_section_id.
 * Preserves canonical entry order within each bucket.
 *
 * @param {Object} sourcePage
 * @returns {{ bySectionId: Object.<string, import("./types").WorkspaceRequirement[]>, unplaced: import("./types").WorkspaceRequirement[] }}
 */
function composeSituatedRecordWorkspacePlacement(sourcePage) {
  var bySectionId = Object.create(null);
  var unplaced = [];
  normalizeEntries(sourcePage).forEach(function (entry) {
    var workspace = workspaceFromNormalizedEntry(entry);
    if (!workspace) return;
    if (entry.after_section_id) {
      if (!bySectionId[entry.after_section_id]) {
        bySectionId[entry.after_section_id] = [];
      }
      bySectionId[entry.after_section_id].push(workspace);
    } else {
      unplaced.push(workspace);
    }
  });
  return { bySectionId: bySectionId, unplaced: unplaced };
}

module.exports = {
  WORKSPACE_OWNER_ID: WORKSPACE_OWNER_ID,
  composeSituatedRecordWorkspaces: composeSituatedRecordWorkspaces,
  composeSituatedRecordWorkspacePlacement: composeSituatedRecordWorkspacePlacement,
  readRecordEntries: readRecordEntries
};
