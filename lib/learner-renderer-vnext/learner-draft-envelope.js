"use strict";

var constants = require("./learner-draft-constants");
var migrateLearnerDraft = require("./learner-draft-page-key").migrateLearnerDraft;

function createEmptyEnvelope(pageKey) {
  return {
    schemaVersion: constants.DRAFT_SCHEMA_VERSION,
    renderer: constants.RENDERER_ID,
    pageKey: String(pageKey || ""),
    savedAt: null,
    workspaces: {}
  };
}

function createWorkspaceState(kind, value) {
  return {
    kind: String(kind || ""),
    stateVersion: constants.WORKSPACE_STATE_VERSION,
    value: value
  };
}

/**
 * @param {*} raw
 * @param {string} expectedPageKey
 * @returns {{ ok: boolean, envelope?: Object, diagnostics: Object[] }}
 */
function parseAndValidateEnvelope(raw, expectedPageKey) {
  var diagnostics = [];
  if (raw == null || raw === "") {
    return { ok: true, envelope: null, diagnostics: diagnostics };
  }

  var parsed;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch (_err) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.LEARNER_DRAFT_PARSE_FAILED,
        message: "Stored learner draft JSON could not be parsed."
      });
      return { ok: false, diagnostics: diagnostics };
    }
  } else if (typeof raw === "object") {
    parsed = raw;
  } else {
    diagnostics.push({
      code: constants.DIAGNOSTIC.LEARNER_DRAFT_PARSE_FAILED,
      message: "Stored learner draft has an unexpected type."
    });
    return { ok: false, diagnostics: diagnostics };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.INVALID_PERSISTED_WORKSPACE_STATE,
      message: "Stored learner draft envelope is not an object."
    });
    return { ok: false, diagnostics: diagnostics };
  }

  var schemaVersion = Number(parsed.schemaVersion);
  if (schemaVersion !== constants.DRAFT_SCHEMA_VERSION) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.UNSUPPORTED_DRAFT_SCHEMA_VERSION,
      message: "Stored learner draft schema version is unsupported.",
      schemaVersion: parsed.schemaVersion
    });
    return { ok: false, envelope: parsed, diagnostics: diagnostics };
  }

  var migrated = migrateLearnerDraft(parsed);
  var envelope = migrated.envelope;
  if (String(envelope.pageKey || "") && expectedPageKey && String(envelope.pageKey) !== String(expectedPageKey)) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.STALE_PERSISTED_WORKSPACE,
      message: "Stored learner draft page key does not match the current page identity."
    });
    return { ok: false, envelope: envelope, diagnostics: diagnostics };
  }

  if (!envelope.workspaces || typeof envelope.workspaces !== "object" || Array.isArray(envelope.workspaces)) {
    envelope.workspaces = {};
  }

  return { ok: true, envelope: envelope, diagnostics: diagnostics };
}

module.exports = {
  createEmptyEnvelope: createEmptyEnvelope,
  createWorkspaceState: createWorkspaceState,
  parseAndValidateEnvelope: parseAndValidateEnvelope
};
