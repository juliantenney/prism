"use strict";

var constants = require("./learner-draft-constants");
var envelope = require("./learner-draft-envelope");

/**
 * @param {{ getItem?: Function, setItem?: Function, removeItem?: Function }|null} storage
 */
function createLearnerDraftStorage(storage) {
  var backend = storage || null;
  var available = Boolean(
    backend &&
      typeof backend.getItem === "function" &&
      typeof backend.setItem === "function" &&
      typeof backend.removeItem === "function"
  );

  function loadLearnerDraft(pageKey) {
    var diagnostics = [];
    if (!available) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.LEARNER_DRAFT_READ_FAILED,
        message: "Learner draft storage is unavailable."
      });
      return { ok: false, envelope: null, diagnostics: diagnostics, unavailable: true };
    }
    var storageKey = constants.STORAGE_KEY_PREFIX + String(pageKey || "");
    try {
      var raw = backend.getItem(storageKey);
      return envelope.parseAndValidateEnvelope(raw, pageKey);
    } catch (_err) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.LEARNER_DRAFT_READ_FAILED,
        message: "Learner draft storage read failed."
      });
      return { ok: false, envelope: null, diagnostics: diagnostics };
    }
  }

  function saveLearnerDraft(pageKey, draftEnvelope) {
    var diagnostics = [];
    if (!available) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.LEARNER_DRAFT_WRITE_FAILED,
        message: "Learner draft storage is unavailable."
      });
      return { ok: false, diagnostics: diagnostics, unavailable: true };
    }
    var storageKey = constants.STORAGE_KEY_PREFIX + String(pageKey || "");
    try {
      var payload = Object.assign({}, draftEnvelope || {}, {
        savedAt: new Date().toISOString(),
        pageKey: String(pageKey || "")
      });
      backend.setItem(storageKey, JSON.stringify(payload));
      return { ok: true, diagnostics: diagnostics, envelope: payload };
    } catch (err) {
      var code = constants.DIAGNOSTIC.LEARNER_DRAFT_WRITE_FAILED;
      var message = "Learner draft storage write failed.";
      if (err && (err.name === "QuotaExceededError" || err.code === 22 || err.code === 1014)) {
        message = "Learner draft storage quota was exceeded.";
      }
      diagnostics.push({ code: code, message: message });
      return { ok: false, diagnostics: diagnostics };
    }
  }

  function deleteLearnerDraft(pageKey) {
    var diagnostics = [];
    if (!available) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.LEARNER_DRAFT_DELETE_FAILED,
        message: "Learner draft storage is unavailable."
      });
      return { ok: false, diagnostics: diagnostics, unavailable: true };
    }
    var storageKey = constants.STORAGE_KEY_PREFIX + String(pageKey || "");
    try {
      backend.removeItem(storageKey);
      return { ok: true, diagnostics: diagnostics };
    } catch (_err) {
      diagnostics.push({
        code: constants.DIAGNOSTIC.LEARNER_DRAFT_DELETE_FAILED,
        message: "Learner draft storage delete failed."
      });
      return { ok: false, diagnostics: diagnostics };
    }
  }

  return {
    available: available,
    loadLearnerDraft: loadLearnerDraft,
    saveLearnerDraft: saveLearnerDraft,
    deleteLearnerDraft: deleteLearnerDraft
  };
}

function resolveDefaultBrowserStorage() {
  try {
    if (typeof localStorage === "undefined" || !localStorage) return null;
    var probeKey = constants.STORAGE_KEY_PREFIX + "__probe__";
    localStorage.setItem(probeKey, "1");
    localStorage.removeItem(probeKey);
    return localStorage;
  } catch (_err) {
    return null;
  }
}

module.exports = {
  createLearnerDraftStorage: createLearnerDraftStorage,
  resolveDefaultBrowserStorage: resolveDefaultBrowserStorage
};
