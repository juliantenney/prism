"use strict";

var constants = require("./learner-draft-constants");
var envelopeHelpers = require("./learner-draft-envelope");
var storageFactory = require("./learner-draft-storage");
var adapters = require("./learner-draft-adapters");

function queryAll(root, selector) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
}

function findWorkspaceElements(root) {
  return queryAll(root, "[data-workspace-kind]").filter(function (node) {
    var kind = String(node.getAttribute("data-workspace-kind") || "");
    return constants.SUPPORTED_KINDS.indexOf(kind) >= 0;
  });
}

function ensureControls(root) {
  var existing = root.querySelector("[data-learner-draft-controls]");
  if (existing) return existing;

  var controls = root.ownerDocument
    ? root.ownerDocument.createElement("div")
    : null;
  if (!controls) return null;

  controls.className = "util-learner-draft-controls";
  controls.setAttribute("data-learner-draft-controls", "true");
  controls.innerHTML =
    '<p class="util-learner-draft-status" aria-live="polite" data-learner-draft-status>' +
    constants.STATUS.NOT_SAVED +
    "</p>" +
    '<button type="button" class="util-learner-draft-clear" data-learner-draft-clear ' +
    'aria-label="Clear saved responses for this page">Clear saved responses</button>';

  var activities = root.querySelector('[data-region="activities"]');
  if (activities && activities.parentNode === root) {
    root.insertBefore(controls, activities);
  } else if (root.firstChild) {
    root.insertBefore(controls, root.firstChild);
  } else {
    root.appendChild(controls);
  }
  return controls;
}

function setStatus(root, message) {
  var status = root.querySelector("[data-learner-draft-status]");
  if (!status) return;
  status.textContent = String(message || "");
}

/**
 * Idempotent page-level learner draft persistence initialiser.
 *
 * @param {Element} root
 * @param {{
 *   pageKey?: string,
 *   storage?: object,
 *   debounceMs?: number,
 *   confirm?: Function,
 *   document?: Document,
 *   now?: Function
 * }} [options]
 */
function initializeLearnerDraftPersistence(root, options) {
  if (!root) {
    return { ok: false, reason: "missing-root" };
  }
  if (root.__prismDraftPersistence) {
    return root.__prismDraftPersistence;
  }

  var opts = options || {};
  var diagnostics = [];
  var pageKey = String(opts.pageKey || root.getAttribute("data-persistence-page-key") || "").trim();
  if (!pageKey) {
    diagnostics.push({
      code: constants.DIAGNOSTIC.UNSTABLE_PERSISTENCE_PAGE_IDENTITY,
      message: "Learner draft initialisation is missing a page key."
    });
  }

  if (root.getAttribute("data-persistence-identity-unstable") === "true") {
    diagnostics.push({
      code: constants.DIAGNOSTIC.UNSTABLE_PERSISTENCE_PAGE_IDENTITY,
      message: "Learner draft page identity is unstable."
    });
  }

  var storageBackend = Object.prototype.hasOwnProperty.call(opts, "storage")
    ? opts.storage
    : storageFactory.resolveDefaultBrowserStorage();
  var storage = storageFactory.createLearnerDraftStorage(storageBackend);
  var debounceMs =
    Number.isFinite(opts.debounceMs) && opts.debounceMs >= 0
      ? Number(opts.debounceMs)
      : constants.DEFAULT_SAVE_DEBOUNCE_MS;
  var confirmFn =
    typeof opts.confirm === "function"
      ? opts.confirm
      : function (message) {
          if (typeof window !== "undefined" && typeof window.confirm === "function") {
            return window.confirm(message);
          }
          return false;
        };

  ensureControls(root);
  var dirty = false;
  var timer = null;
  var lastStatus = constants.STATUS.NOT_SAVED;
  var restored = false;

  function collectEnvelope() {
    var draft = envelopeHelpers.createEmptyEnvelope(pageKey);
    findWorkspaceElements(root).forEach(function (workspace) {
      var workspaceId = String(workspace.getAttribute("data-workspace-id") || "").trim();
      if (!workspaceId) return;
      var serialized = adapters.serializeWorkspaceState(workspace);
      if (!serialized.ok) {
        diagnostics.push(serialized.diagnostic);
        return;
      }
      draft.workspaces[workspaceId] = serialized.state;
    });
    return draft;
  }

  function persistNow(statusOnSuccess) {
    if (!storage.available) {
      lastStatus = constants.STATUS.UNAVAILABLE;
      setStatus(root, lastStatus);
      return { ok: false, unavailable: true };
    }
    setStatus(root, constants.STATUS.SAVING);
    var draft = collectEnvelope();
    var result = storage.saveLearnerDraft(pageKey, draft);
    diagnostics = diagnostics.concat(result.diagnostics || []);
    if (!result.ok) {
      lastStatus = constants.STATUS.UNABLE;
      setStatus(root, lastStatus);
      return result;
    }
    dirty = false;
    lastStatus = statusOnSuccess || constants.STATUS.SAVED;
    setStatus(root, lastStatus);
    return result;
  }

  function scheduleSave() {
    dirty = true;
    if (!storage.available) {
      lastStatus = constants.STATUS.UNAVAILABLE;
      setStatus(root, lastStatus);
      return;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      timer = null;
      persistNow(constants.STATUS.SAVED);
    }, debounceMs);
  }

  function flushPendingSave() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!dirty) return { ok: true, skipped: true };
    return persistNow(constants.STATUS.SAVED);
  }

  function restoreFromStorage() {
    if (!storage.available) {
      lastStatus = constants.STATUS.UNAVAILABLE;
      setStatus(root, lastStatus);
      return { ok: false, unavailable: true };
    }
    var loaded = storage.loadLearnerDraft(pageKey);
    diagnostics = diagnostics.concat(loaded.diagnostics || []);
    if (!loaded.ok) {
      if (loaded.unavailable) {
        lastStatus = constants.STATUS.UNAVAILABLE;
      } else if (
        (loaded.diagnostics || []).some(function (row) {
          return row.code === constants.DIAGNOSTIC.UNSUPPORTED_DRAFT_SCHEMA_VERSION;
        })
      ) {
        lastStatus = constants.STATUS.NOT_SAVED;
      } else {
        lastStatus = constants.STATUS.NOT_SAVED;
      }
      setStatus(root, lastStatus);
      return loaded;
    }
    if (!loaded.envelope) {
      lastStatus = constants.STATUS.NOT_SAVED;
      setStatus(root, lastStatus);
      return loaded;
    }

    var known = Object.create(null);
    findWorkspaceElements(root).forEach(function (workspace) {
      var workspaceId = String(workspace.getAttribute("data-workspace-id") || "").trim();
      if (workspaceId) known[workspaceId] = workspace;
    });

    var workspaces = loaded.envelope.workspaces || {};
    var anyRestored = false;
    Object.keys(workspaces).forEach(function (workspaceId) {
      var workspace = known[workspaceId];
      if (!workspace) {
        diagnostics.push({
          code: constants.DIAGNOSTIC.STALE_PERSISTED_WORKSPACE,
          message: "Ignoring persisted workspace that is not present on the page."
        });
        return;
      }
      var state = workspaces[workspaceId];
      var result = adapters.restoreWorkspaceState(workspace, state, { silent: true });
      diagnostics = diagnostics.concat(result.diagnostics || []);
      if (result.ok) anyRestored = true;
    });

    restored = anyRestored;
    lastStatus = anyRestored ? constants.STATUS.RESTORED : constants.STATUS.NOT_SAVED;
    setStatus(root, lastStatus);
    return { ok: true, restored: anyRestored, diagnostics: diagnostics };
  }

  function clearDraft() {
    var confirmed = confirmFn(
      "Clear saved responses for this page? This removes the draft saved on this device."
    );
    if (!confirmed) {
      return { ok: false, cancelled: true };
    }
    findWorkspaceElements(root).forEach(function (workspace) {
      adapters.clearWorkspaceState(workspace, { silent: true });
    });
    var deleted = storage.deleteLearnerDraft(pageKey);
    diagnostics = diagnostics.concat(deleted.diagnostics || []);
    dirty = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!deleted.ok) {
      lastStatus = constants.STATUS.UNABLE;
      setStatus(root, lastStatus);
      return deleted;
    }
    lastStatus = constants.STATUS.NOT_SAVED;
    setStatus(root, lastStatus);
    return { ok: true };
  }

  function onInput(event) {
    var target = event.target;
    if (!target || !target.closest) return;
    if (
      target.matches("textarea.util-learner-workspace__input") ||
      target.matches("input.util-learner-table-workspace__input")
    ) {
      scheduleSave();
    }
  }

  function onOrderingChange() {
    scheduleSave();
  }

  function onClearClick(event) {
    var btn = event.target && event.target.closest
      ? event.target.closest("[data-learner-draft-clear]")
      : null;
    if (!btn || !root.contains(btn)) return;
    clearDraft();
  }

  function onVisibilityChange() {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      flushPendingSave();
    }
  }

  function onPageHide() {
    flushPendingSave();
  }

  root.addEventListener("input", onInput, true);
  root.addEventListener("prism:learner-workspace-change", onOrderingChange);
  root.addEventListener("click", onClearClick);
  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("pagehide", onPageHide);
  }

  restoreFromStorage();

  var api = {
    ok: true,
    pageKey: pageKey,
    diagnostics: diagnostics,
    getDiagnostics: function () {
      return diagnostics.slice();
    },
    isDirty: function () {
      return dirty;
    },
    getStatus: function () {
      return lastStatus;
    },
    wasRestored: function () {
      return restored;
    },
    scheduleSave: scheduleSave,
    flushPendingSave: flushPendingSave,
    persistNow: persistNow,
    restoreFromStorage: restoreFromStorage,
    clearDraft: clearDraft,
    collectEnvelope: collectEnvelope,
    storageAvailable: storage.available,
    debounceMs: debounceMs
  };

  root.__prismDraftPersistence = api;
  return api;
}

module.exports = {
  initializeLearnerDraftPersistence: initializeLearnerDraftPersistence,
  findWorkspaceElements: findWorkspaceElements,
  ensureControls: ensureControls
};
