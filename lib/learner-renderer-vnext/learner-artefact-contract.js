/**
 * Sprint 95 M3 — explicit learner artefact produce/reference contract.
 *
 * Drafts remain resource-private. Only declared artefacts may be resolved
 * for read-only reference by another resource. C5/C6 are not hard-coded.
 */
"use strict";

var createLearnerDraftStorage = require("./learner-draft-storage").createLearnerDraftStorage;
var constants = require("./learner-draft-constants");
var artefactProducers = require("./learner-artefact-producers");

var ARTEFACT_USAGE_REFERENCE = "reference";

function asText(value) {
  return value == null ? "" : String(value).trim();
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

/**
 * @param {object|null|undefined} input
 * @returns {{ produces: object[], references: object[], conflicts: object[] }}
 */
function normalizeArtefactContract(input) {
  var src = input && typeof input === "object" ? input : {};
  var produces = [];
  var references = [];
  var conflicts = [];
  var produceExact = Object.create(null);
  var produceIdentity = Object.create(null);
  var referenceExact = Object.create(null);

  (Array.isArray(src.produces) ? src.produces : []).forEach(function (row) {
    if (!row || typeof row !== "object") return;
    var artefactId = asText(row.artefactId || row.artefact_id);
    var commissionId = asText(
      row.commissionId || row.commission_id || row.producerCommissionId
    );
    var workspaceId = asText(row.workspaceId || row.workspace_id);
    if (!artefactId || !commissionId || !workspaceId) return;
    var identityKey = artefactId + "\0" + commissionId;
    var exactKey = identityKey + "\0" + workspaceId;
    if (produceExact[exactKey]) return;
    if (produceIdentity[identityKey] && produceIdentity[identityKey] !== workspaceId) {
      conflicts.push({
        code: "conflicting_produce_workspace",
        artefactId: artefactId,
        commissionId: commissionId,
        workspaceId: workspaceId,
        existingWorkspaceId: produceIdentity[identityKey],
        message:
          "Artefact " +
          artefactId +
          " for commission " +
          commissionId +
          " declares conflicting workspace ids (" +
          produceIdentity[identityKey] +
          " vs " +
          workspaceId +
          "). Keeping the first declaration."
      });
      return;
    }
    produceExact[exactKey] = true;
    produceIdentity[identityKey] = workspaceId;
    produces.push({
      artefactId: artefactId,
      commissionId: commissionId,
      workspaceId: workspaceId,
      label: asText(row.label) || "Learner artefact",
      pageKey: asText(row.pageKey || row.page_key)
    });
  });

  (Array.isArray(src.references) ? src.references : []).forEach(function (row) {
    if (!row || typeof row !== "object") return;
    var artefactId = asText(row.artefactId || row.artefact_id);
    var commissionId = asText(
      row.commissionId || row.commission_id || row.consumerCommissionId
    );
    if (!artefactId || !commissionId) return;
    var usage = asText(row.usage || ARTEFACT_USAGE_REFERENCE).toLowerCase() || ARTEFACT_USAGE_REFERENCE;
    var exactKey = artefactId + "\0" + commissionId + "\0" + usage;
    if (referenceExact[exactKey]) return;
    referenceExact[exactKey] = true;
    references.push({
      artefactId: artefactId,
      commissionId: commissionId,
      usage: usage,
      label: asText(row.label) || "Earlier learner response",
      missingMessage: asText(row.missingMessage || row.missing_message),
      standaloneFallback: asText(row.standaloneFallback || row.standalone_fallback)
    });
  });

  return { produces: produces, references: references, conflicts: conflicts };
}

function findProduceDeclaration(contract, artefactId) {
  var id = asText(artefactId);
  var rows = normalizeArtefactContract(contract).produces;
  for (var i = 0; i < rows.length; i += 1) {
    if (rows[i].artefactId === id) return rows[i];
  }
  return null;
}

function listReferencesForCommission(contract, commissionId) {
  var id = asText(commissionId);
  return normalizeArtefactContract(contract).references.filter(function (row) {
    return row.commissionId === id && row.usage === ARTEFACT_USAGE_REFERENCE;
  });
}

function listProducesForCommission(contract, commissionId) {
  var id = asText(commissionId);
  return normalizeArtefactContract(contract).produces.filter(function (row) {
    return row.commissionId === id;
  });
}

function extractTextFromWorkspaceState(state) {
  if (!state || typeof state !== "object") return "";
  if (state.kind === "text_entry" && state.value && typeof state.value === "object") {
    return asText(state.value.text);
  }
  return "";
}

/**
 * Resolve a declared artefact from the producer's saved draft.
 * Undeclared workspaces are never returned even if present in storage.
 *
 * @param {{
 *   contract: object,
 *   artefactId: string,
 *   resources?: Array<{commissionId:string, pageKey?:string}>,
 *   storage?: object,
 *   producerPageKey?: string
 * }} options
 */
function resolveArtefactReference(options) {
  var opts = options && typeof options === "object" ? options : {};
  var artefactId = asText(opts.artefactId);
  var produce = findProduceDeclaration(opts.contract, artefactId);
  if (!produce) {
    return {
      ok: false,
      status: "undeclared",
      artefactId: artefactId,
      text: "",
      label: "",
      reason: "No produce declaration for artefact."
    };
  }

  var pageKey = asText(opts.producerPageKey) || asText(produce.pageKey);
  if (!pageKey && Array.isArray(opts.resources)) {
    for (var i = 0; i < opts.resources.length; i += 1) {
      var row = opts.resources[i];
      if (row && asText(row.commissionId) === produce.commissionId) {
        pageKey = asText(row.pageKey);
        break;
      }
    }
  }
  if (!pageKey) {
    return {
      ok: false,
      status: "missing",
      artefactId: produce.artefactId,
      commissionId: produce.commissionId,
      workspaceId: produce.workspaceId,
      text: "",
      label: produce.label,
      reason: "Producer page key is unavailable."
    };
  }

  var storageFactory = require("./learner-draft-storage");
  var storageBackend;
  if (Object.prototype.hasOwnProperty.call(opts, "storage") && opts.storage != null) {
    storageBackend = opts.storage;
  } else {
    storageBackend = storageFactory.resolveDefaultBrowserStorage();
  }
  var storage = storageFactory.createLearnerDraftStorage(storageBackend);

  var loaded = storage.loadLearnerDraft(pageKey);
  if (!loaded.ok || !loaded.envelope || typeof loaded.envelope !== "object") {
    return {
      ok: false,
      status: loaded.unavailable ? "unavailable" : "missing",
      artefactId: produce.artefactId,
      commissionId: produce.commissionId,
      workspaceId: produce.workspaceId,
      pageKey: pageKey,
      text: "",
      label: produce.label,
      savedAt: "",
      reason: "Producer draft is not available."
    };
  }

  var workspaces =
    loaded.envelope.workspaces && typeof loaded.envelope.workspaces === "object"
      ? loaded.envelope.workspaces
      : {};
  // Only the declared workspace id may be read.
  if (!Object.prototype.hasOwnProperty.call(workspaces, produce.workspaceId)) {
    return {
      ok: false,
      status: "missing",
      artefactId: produce.artefactId,
      commissionId: produce.commissionId,
      workspaceId: produce.workspaceId,
      pageKey: pageKey,
      text: "",
      label: produce.label,
      savedAt: asText(loaded.envelope.savedAt),
      reason: "Declared workspace has no saved response."
    };
  }

  var text = extractTextFromWorkspaceState(workspaces[produce.workspaceId]);
  if (!text) {
    return {
      ok: false,
      status: "missing",
      artefactId: produce.artefactId,
      commissionId: produce.commissionId,
      workspaceId: produce.workspaceId,
      pageKey: pageKey,
      text: "",
      label: produce.label,
      savedAt: asText(loaded.envelope.savedAt),
      reason: "Declared workspace is empty."
    };
  }

  return {
    ok: true,
    status: "resolved",
    artefactId: produce.artefactId,
    commissionId: produce.commissionId,
    workspaceId: produce.workspaceId,
    pageKey: pageKey,
    text: text,
    label: produce.label,
    savedAt: asText(loaded.envelope.savedAt),
    // Reserved for later versioning/snapshots without changing call sites.
    revision: null
  };
}

function titleMapFromResources(resources) {
  var map = Object.create(null);
  (Array.isArray(resources) ? resources : []).forEach(function (row) {
    if (!row || typeof row !== "object") return;
    var id = asText(row.commissionId || row.commission_id);
    var title = asText(row.title);
    if (id && title) map[id] = title;
  });
  return map;
}

function formatQuotedTitleList(titles) {
  var unique = [];
  var seen = Object.create(null);
  (Array.isArray(titles) ? titles : []).forEach(function (value) {
    var title = asText(value);
    if (!title || seen[title]) return;
    seen[title] = true;
    unique.push(title);
  });
  if (!unique.length) return "";
  if (unique.length === 1) return "'" + unique[0] + "'";
  if (unique.length === 2) return "'" + unique[0] + "' and '" + unique[1] + "'";
  return (
    unique
      .slice(0, -1)
      .map(function (title) {
        return "'" + title + "'";
      })
      .join(", ") +
    ", and '" +
    unique[unique.length - 1] +
    "'"
  );
}

function listConsumerTitlesForArtefact(contract, artefactId, titleByCommission) {
  var id = asText(artefactId);
  var titles = [];
  normalizeArtefactContract(contract).references.forEach(function (ref) {
    if (ref.artefactId !== id) return;
    var title = titleByCommission && titleByCommission[ref.commissionId];
    if (title) titles.push(title);
  });
  return titles;
}

/**
 * Concise producer signpost naming later resources that declare a reference
 * to this commission's artefacts. Titles only — no internal ids.
 */
function journalArtefactIdSet(journalSpec) {
  var ids = Object.create(null);
  var entries =
    journalSpec && typeof journalSpec === "object" && Array.isArray(journalSpec.entries)
      ? journalSpec.entries
      : [];
  entries.forEach(function (entry) {
    var id = asText(entry && (entry.artefact_id || entry.artefactId));
    if (id) ids[id] = true;
  });
  return ids;
}

function commissionProducesJournalListedArtefact(contract, commissionId, journalSpec) {
  var journalIds = journalArtefactIdSet(journalSpec);
  var produces = listProducesForCommission(contract, commissionId);
  var i = 0;
  for (; i < produces.length; i += 1) {
    if (produces[i] && journalIds[produces[i].artefactId]) return true;
  }
  return false;
}

function buildProducerSignpostHtml(contract, commissionId, resources, options) {
  var produces = listProducesForCommission(contract, commissionId);
  if (!produces.length) return "";
  var opts = options && typeof options === "object" ? options : {};
  var titleByCommission = titleMapFromResources(resources);
  var consumerTitles = [];
  produces.forEach(function (row) {
    listConsumerTitlesForArtefact(contract, row.artefactId, titleByCommission).forEach(
      function (title) {
        consumerTitles.push(title);
      }
    );
  });
  var listed = formatQuotedTitleList(consumerTitles);
  var journalListed = commissionProducesJournalListedArtefact(
    contract,
    commissionId,
    opts.journalSpec
  );
  var message = "";
  if (listed && journalListed) {
    message =
      "Saved work on this device can appear for reference in " +
      listed +
      " and the Learning Journal.";
  } else if (listed) {
    message = "Saved work on this device can appear for reference in " + listed + ".";
  } else if (journalListed) {
    message = "Saved work on this device can appear in the Learning Journal.";
  } else {
    message = "Saved work on this device can appear for reference in later activities.";
  }
  return (
    '<aside class="lj-artefact-signpost" data-lj-artefact-signpost="producer" aria-label="Saved work">' +
    "<p>" +
    escapeHtml(message) +
    "</p>" +
    '<details class="lj-artefact-signpost__more">' +
    "<summary>About saving and backup</summary>" +
    "<p>Work is saved in this browser on this device and is not pasted automatically into later answer fields. Copy or keep your own backup if you need it elsewhere.</p>" +
    "</details>" +
    "</aside>"
  );
}

/**
 * Production / authoring descriptions that must not become learner-facing Journal headings.
 * Journal entry titles already supply the learner-facing heading.
 */
function isProductionArtefactDescription(text) {
  var value = asText(text);
  if (!value) return false;
  if (/\bC\d{2}\.E\d+\b/i.test(value)) return true;
  if (
    /\b(unrestricted prose|baseline artefact|journalable|elicitation|response[_ ]workspace|preserved verbatim|artefact identifier|constructed_performance)\b/i.test(
      value
    )
  ) {
    return true;
  }
  // Long authoring intentions are not short display labels.
  if (value.length > 80) return true;
  return false;
}

/**
 * Read-only Learning Journal artefact body for one entry (S97-T-004).
 * Uses the same resolveArtefactReference statuses; journal copy is distinct
 * from constituent consumer-reference chrome.
 *
 * The Journal entry title (outside this panel) is the learner-facing heading.
 * Produce labels / response_workspace.intention stay internal metadata.
 *
 * @param {object} resolution
 * @param {{ producerTitle?: string, entryTitle?: string }=} options
 */
function renderJournalArtefactHtml(resolution, options) {
  var resolved = resolution && typeof resolution === "object" ? resolution : {};
  var opts = options && typeof options === "object" ? options : {};
  var producerTitle = asText(opts.producerTitle);
  var entryTitle = asText(opts.entryTitle);
  var rawLabel = asText(resolved.label);
  // Prefer the Journal entry title for accessibility; never surface production descriptions.
  var accessibleLabel =
    entryTitle ||
    (!isProductionArtefactDescription(rawLabel) ? rawLabel : "") ||
    "Your work";
  var artefactId = asText(resolved.artefactId);
  var status = asText(resolved.status) || "missing";

  if (resolved.ok && status === "resolved" && asText(resolved.text)) {
    var fromNote = producerTitle
      ? "From '" + producerTitle + "'. Saved in this Learning Journey on this device."
      : "Saved in this Learning Journey on this device.";
    return (
      '<div class="lj-shell-journal__artefact lj-shell-journal__artefact--resolved" data-lj-journal-artefact-status="resolved"' +
      (artefactId ? ' data-lj-journal-artefact-id="' + escapeAttr(artefactId) + '"' : "") +
      ">" +
      '<p class="lj-shell-journal__artefact-note">' +
      escapeHtml(fromNote) +
      "</p>" +
      '<div class="lj-shell-journal__artefact-body" tabindex="0" role="region" aria-label="' +
      escapeAttr(accessibleLabel) +
      '">' +
      '<pre class="lj-shell-journal__artefact-text">' +
      escapeHtml(resolved.text) +
      "</pre>" +
      "</div>" +
      "</div>"
    );
  }

  var message = "";
  var statusAttr = status;
  if (status === "undeclared") {
    message =
      "This journal entry refers to learner work that is not declared for this journey, so nothing can be shown here.";
  } else if (status === "unavailable") {
    statusAttr = "unavailable";
    message =
      "Saving is not available in this browser right now, so your work for this entry cannot be shown. Keep your own copy if you need it.";
  } else if (!asText(artefactId)) {
    statusAttr = "missing";
    message = "This journal entry does not identify any learner work to show.";
  } else {
    statusAttr = "missing";
    message = producerTitle
      ? "Your work from '" +
        producerTitle +
        "' is not available yet. Complete that resource and save your draft in this Learning Journey so it can appear here."
      : "Your work for this entry is not available yet. Complete that resource and save your draft in this Learning Journey so it can appear here.";
  }

  return (
    '<div class="lj-shell-journal__artefact lj-shell-journal__artefact--' +
    escapeAttr(statusAttr) +
    '" data-lj-journal-artefact-status="' +
    escapeAttr(statusAttr) +
    '"' +
    (artefactId ? ' data-lj-journal-artefact-id="' + escapeAttr(artefactId) + '"' : "") +
    ">" +
    '<p class="lj-shell-journal__artefact-missing">' +
    escapeHtml(message) +
    "</p>" +
    "</div>"
  );
}

/**
 * Resolve journal entries against declared producers and return display rows.
 * Eligibility is produce-declaration based (consumers optional).
 *
 * @param {{
 *   journalSpec?: {entries?: object[]},
 *   entries?: object[],
 *   contract: object,
 *   resources?: object[],
 *   storage?: object
 * }} options
 */
function resolveLearningJournalEntries(options) {
  var opts = options && typeof options === "object" ? options : {};
  var titleByCommission = titleMapFromResources(opts.resources);
  var rawEntries = Array.isArray(opts.entries)
    ? opts.entries
    : opts.journalSpec && Array.isArray(opts.journalSpec.entries)
      ? opts.journalSpec.entries
      : [];
  return rawEntries.map(function (row, index) {
    var entryId =
      asText(row && (row.entry_id || row.entryId)) ||
      "journal-entry-" + String(index + 1);
    var artefactId = asText(row && (row.artefact_id || row.artefactId));
    var resolveOpts = {
      contract: opts.contract,
      artefactId: artefactId,
      resources: opts.resources
    };
    if (Object.prototype.hasOwnProperty.call(opts, "storage") && opts.storage != null) {
      resolveOpts.storage = opts.storage;
    }
    var resolution = artefactId
      ? resolveArtefactReference(resolveOpts)
      : {
          ok: false,
          status: "missing",
          artefactId: "",
          text: "",
          label: "",
          reason: "Journal entry has no artefact_id."
        };
    var produce = findProduceDeclaration(opts.contract, artefactId);
    var producerTitle = produce ? titleByCommission[produce.commissionId] || "" : "";
    var entryTitle = asText(row && row.title);
    return {
      entryId: entryId,
      artefactId: artefactId,
      entryTitle: entryTitle,
      resolution: resolution,
      producerTitle: producerTitle,
      html: renderJournalArtefactHtml(resolution, {
        producerTitle: producerTitle,
        entryTitle: entryTitle
      })
    };
  });
}

/**
 * Replace placeholder artefact regions in a mounted Learning Journal view.
 * Safe to call on each journal mount so saved-draft changes appear without
 * regenerating constituent resources.
 */
function populateLearningJournal(root, options) {
  var opts = options && typeof options === "object" ? options : {};
  if (!root || typeof root.querySelector !== "function") {
    return { ok: false, reason: "missing-root", populated: 0, entries: [] };
  }
  var rows = resolveLearningJournalEntries(opts);
  var populated = 0;
  var entryNodes =
    typeof root.querySelectorAll === "function"
      ? root.querySelectorAll("[data-lj-journal-entry]")
      : [];
  rows.forEach(function (row) {
    var entryNode = null;
    for (var i = 0; i < entryNodes.length; i += 1) {
      if (asText(entryNodes[i].getAttribute("data-lj-journal-entry")) === row.entryId) {
        entryNode = entryNodes[i];
        break;
      }
    }
    if (!entryNode || typeof entryNode.querySelector !== "function") return;
    var slot = entryNode.querySelector(".lj-shell-journal__artefact");
    if (!slot || !slot.parentNode) return;
    if (typeof slot.insertAdjacentHTML === "function") {
      slot.insertAdjacentHTML("afterend", row.html);
      slot.parentNode.removeChild(slot);
    } else {
      var wrap =
        typeof document !== "undefined" && document.createElement
          ? document.createElement("div")
          : root.ownerDocument && root.ownerDocument.createElement
            ? root.ownerDocument.createElement("div")
            : null;
      if (!wrap) {
        slot.innerHTML = row.html;
        populated += 1;
        return;
      }
      wrap.innerHTML = row.html;
      var next = wrap.firstChild;
      if (next) slot.parentNode.replaceChild(next, slot);
    }
    populated += 1;
  });
  return {
    ok: true,
    populated: populated,
    entries: rows.map(function (row) {
      return {
        entryId: row.entryId,
        artefactId: row.artefactId,
        status: row.resolution && row.resolution.status,
        ok: !!(row.resolution && row.resolution.ok)
      };
    })
  };
}

/** Journey-scoped acknowledgement — separate from constituent draft envelopes. */
var JOURNAL_ACK_STORAGE_KEY_PREFIX = "prism:lj-journal:ack:";
var JOURNAL_ACK_SCHEMA_VERSION = 1;

/**
 * S97-AD-008 — deterministic learner-visible content normalisation for fingerprints.
 * Newlines unified; ends trimmed. Empty → no fingerprint / no notification.
 */
function normalizeJournalContentForFingerprint(text) {
  var raw = String(text == null ? "" : text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (typeof raw.normalize === "function") {
    try {
      raw = raw.normalize("NFC");
    } catch (_err) {}
  }
  return raw.trim();
}

function hashJournalContent(normalized) {
  // FNV-1a 32-bit — stable across browsers without crypto dependency.
  var hash = 0x811c9dc5;
  for (var i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return ("00000000" + (hash >>> 0).toString(16)).slice(-8);
}

function fingerprintJournalContent(text) {
  var normalized = normalizeJournalContentForFingerprint(text);
  if (!normalized) return "";
  return "v1:" + hashJournalContent(normalized) + ":" + String(normalized.length);
}

function journalAckStorageKey(journeyKey) {
  return JOURNAL_ACK_STORAGE_KEY_PREFIX + asText(journeyKey);
}

function resolveJournalAckStorage(options) {
  var opts = options && typeof options === "object" ? options : {};
  if (Object.prototype.hasOwnProperty.call(opts, "ackStorage") && opts.ackStorage != null) {
    return opts.ackStorage;
  }
  var storageFactory = require("./learner-draft-storage");
  if (Object.prototype.hasOwnProperty.call(opts, "storage") && opts.storage != null) {
    // Draft storage backend (getItem/setItem) — acknowledgement uses the same
    // browser store surface but a distinct key prefix.
    return opts.storage;
  }
  return storageFactory.resolveDefaultBrowserStorage();
}

function readJournalAckRecord(journeyKey, ackStorage) {
  var key = journalAckStorageKey(journeyKey);
  if (!asText(journeyKey) || !ackStorage || typeof ackStorage.getItem !== "function") {
    return { schemaVersion: JOURNAL_ACK_SCHEMA_VERSION, journeyKey: asText(journeyKey), fingerprints: {} };
  }
  try {
    var raw = ackStorage.getItem(key);
    if (!raw) {
      return {
        schemaVersion: JOURNAL_ACK_SCHEMA_VERSION,
        journeyKey: asText(journeyKey),
        fingerprints: {}
      };
    }
    var parsed = JSON.parse(raw);
    var fingerprints =
      parsed && parsed.fingerprints && typeof parsed.fingerprints === "object"
        ? parsed.fingerprints
        : {};
    var clean = Object.create(null);
    Object.keys(fingerprints).forEach(function (entryId) {
      var fp = asText(fingerprints[entryId]);
      if (entryId && fp) clean[entryId] = fp;
    });
    return {
      schemaVersion: JOURNAL_ACK_SCHEMA_VERSION,
      journeyKey: asText(journeyKey),
      fingerprints: clean
    };
  } catch (_err) {
    return {
      schemaVersion: JOURNAL_ACK_SCHEMA_VERSION,
      journeyKey: asText(journeyKey),
      fingerprints: {}
    };
  }
}

function writeJournalAckRecord(journeyKey, fingerprints, ackStorage) {
  var key = journalAckStorageKey(journeyKey);
  if (!asText(journeyKey) || !ackStorage || typeof ackStorage.setItem !== "function") {
    return { ok: false, reason: "ack-storage-unavailable" };
  }
  var clean = Object.create(null);
  Object.keys(fingerprints || {}).forEach(function (entryId) {
    var fp = asText(fingerprints[entryId]);
    if (entryId && fp) clean[entryId] = fp;
  });
  var payload = {
    schemaVersion: JOURNAL_ACK_SCHEMA_VERSION,
    journeyKey: asText(journeyKey),
    fingerprints: clean
  };
  try {
    ackStorage.setItem(key, JSON.stringify(payload));
    return { ok: true, record: payload };
  } catch (_err) {
    return { ok: false, reason: "ack-storage-write-failed" };
  }
}

/**
 * Build current fingerprints for resolved, non-empty journal artefacts.
 */
function collectJournalContentFingerprints(options) {
  var rows = resolveLearningJournalEntries(options);
  var fingerprints = Object.create(null);
  var resolvedEntryIds = [];
  rows.forEach(function (row) {
    var text =
      row &&
      row.resolution &&
      row.resolution.ok &&
      row.resolution.status === "resolved"
        ? row.resolution.text
        : "";
    var fp = fingerprintJournalContent(text);
    if (!fp) return;
    fingerprints[row.entryId] = fp;
    resolvedEntryIds.push(row.entryId);
  });
  return {
    fingerprints: fingerprints,
    resolvedEntryIds: resolvedEntryIds,
    rows: rows
  };
}

/**
 * Count journal entries whose current content fingerprint differs from the
 * journey-scoped acknowledgement map. Empty/unsaved/undeclared work never counts.
 */
function evaluateJournalNotifications(options) {
  var opts = options && typeof options === "object" ? options : {};
  var journeyKey = asText(opts.journeyKey);
  var collected = collectJournalContentFingerprints(opts);
  var ack = readJournalAckRecord(journeyKey, resolveJournalAckStorage(opts));
  var unacknowledgedEntryIds = [];
  Object.keys(collected.fingerprints).forEach(function (entryId) {
    var current = collected.fingerprints[entryId];
    var acknowledged = asText(ack.fingerprints[entryId]);
    if (current && current !== acknowledged) {
      unacknowledgedEntryIds.push(entryId);
    }
  });
  return {
    ok: true,
    journeyKey: journeyKey,
    count: unacknowledgedEntryIds.length,
    unacknowledgedEntryIds: unacknowledgedEntryIds,
    fingerprints: collected.fingerprints,
    acknowledgedFingerprints: ack.fingerprints
  };
}

/**
 * Persist acknowledgement of the currently displayed journal content state.
 */
function acknowledgeJournalNotifications(options) {
  var opts = options && typeof options === "object" ? options : {};
  var journeyKey = asText(opts.journeyKey);
  var collected = collectJournalContentFingerprints(opts);
  var written = writeJournalAckRecord(
    journeyKey,
    collected.fingerprints,
    resolveJournalAckStorage(opts)
  );
  return {
    ok: !!written.ok,
    reason: written.reason || "",
    journeyKey: journeyKey,
    fingerprints: collected.fingerprints,
    count: 0
  };
}

/**
 * Stable journey key for acknowledgement isolation (assembled Learning Journey).
 */
function buildLearningJourneyNotificationKey(page, options) {
  var opts = options && typeof options === "object" ? options : {};
  if (asText(opts.journeyKey)) return asText(opts.journeyKey);
  var meta = page && page.metadata && typeof page.metadata === "object" ? page.metadata : {};
  var workflowId = asText(meta.workflow_id || meta.workflowId);
  var pageId = asText(meta.page_id || meta.pageId);
  if (workflowId || pageId) {
    return "lj:" + (workflowId || "workflow") + ":" + (pageId || "page");
  }
  var title = asText(page && page.title) || "learning-journey";
  var slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  var commissionIds = [];
  (Array.isArray(page && page.commissions) ? page.commissions : []).forEach(function (row) {
    var id = asText(row && (row.commission_id || row.commissionId));
    if (id) commissionIds.push(id);
  });
  commissionIds.sort();
  return "lj:title:" + (slug || "journey") + ":" + commissionIds.join(",");
}

/**
 * Render a read-only reference region (or missing-input notice).
 * Intentionally not a landmark; not editable; no workspace adapters.
 *
 * @param {object} resolution
 * @param {object} referenceDecl
 * @param {{ producerTitle?: string, produceLabel?: string }=} options
 */
function renderArtefactReferenceHtml(resolution, referenceDecl, options) {
  var ref = referenceDecl && typeof referenceDecl === "object" ? referenceDecl : {};
  var resolved = resolution && typeof resolution === "object" ? resolution : {};
  var opts = options && typeof options === "object" ? options : {};
  var producerTitle = asText(opts.producerTitle);
  var produceLabel = asText(opts.produceLabel);
  var resolvedLabel = asText(resolved.label);
  var refLabel = asText(ref.label);
  // Consumer reference chrome prefers the authored reference label. Produce
  // labels remain fallback only (and skip production-metadata descriptions).
  var label =
    refLabel ||
    (!isProductionArtefactDescription(produceLabel) ? produceLabel : "") ||
    (!isProductionArtefactDescription(resolvedLabel) ? resolvedLabel : "") ||
    "Earlier learner response";
  var artefactId = asText(resolved.artefactId || ref.artefactId);
  var regionId =
    "lj-artefact-ref-" +
    String(artefactId || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  if (resolved.ok && resolved.status === "resolved" && asText(resolved.text)) {
    var resolvedNote = producerTitle
      ? "From '" + producerTitle + "'. Available here for reference (read-only)."
      : "Available here for reference (read-only).";
    return (
      '<section class="lj-artefact-ref" data-lj-artefact-ref="' +
      escapeAttr(artefactId) +
      '" data-lj-artefact-status="resolved" aria-labelledby="' +
      escapeAttr(regionId) +
      '-label">' +
      '<h3 class="lj-artefact-ref__label" id="' +
      escapeAttr(regionId) +
      '-label">' +
      escapeHtml(label) +
      "</h3>" +
      '<p class="lj-artefact-ref__note">' +
      escapeHtml(resolvedNote) +
      "</p>" +
      '<div class="lj-artefact-ref__body" tabindex="0" role="region" aria-label="' +
      escapeAttr(label) +
      '">' +
      '<pre class="lj-artefact-ref__text">' +
      escapeHtml(resolved.text) +
      "</pre>" +
      "</div>" +
      "</section>"
    );
  }

  var missing = asText(ref.missingMessage);
  if (!missing) {
    missing = producerTitle
      ? "Your work from '" +
        producerTitle +
        "' is not available yet. Complete that resource and save your draft in this Learning Journey so it can appear here, or continue with the activities below."
      : "Your earlier response is not available yet. Complete that experience first, or continue with the activities below.";
  }
  var fallback = asText(ref.standaloneFallback);
  if (resolved.status === "unavailable") {
    fallback =
      "Saving is not available in this browser right now. Keep your own copy of that earlier work if you need it here.";
  }
  return (
    '<section class="lj-artefact-ref lj-artefact-ref--missing" data-lj-artefact-ref="' +
    escapeAttr(artefactId) +
    '" data-lj-artefact-status="missing" aria-labelledby="' +
    escapeAttr(regionId) +
    '-label">' +
    '<h3 class="lj-artefact-ref__label" id="' +
    escapeAttr(regionId) +
    '-label">' +
    escapeHtml(label) +
    "</h3>" +
    '<p class="lj-artefact-ref__missing">' +
    escapeHtml(missing) +
    "</p>" +
    (fallback
      ? '<p class="lj-artefact-ref__fallback">' + escapeHtml(fallback) + "</p>"
      : "") +
    "</section>"
  );
}

function createArtefactHostElement(root) {
  if (typeof document !== "undefined" && document.createElement) {
    return document.createElement("div");
  }
  if (root && root.ownerDocument && root.ownerDocument.createElement) {
    return root.ownerDocument.createElement("div");
  }
  return null;
}

function insertNodeAfter(anchor, node) {
  if (!anchor || !anchor.parentNode || !node) return false;
  if (typeof anchor.parentNode.insertBefore !== "function") return false;
  if (anchor.nextSibling) {
    anchor.parentNode.insertBefore(node, anchor.nextSibling);
  } else if (typeof anchor.parentNode.appendChild === "function") {
    anchor.parentNode.appendChild(node);
  } else {
    return false;
  }
  return true;
}

/**
 * Place earlier-response panels in the component's pedagogical opening —
 * after overview/orientation and learning outcomes where present, and never
 * above internal navigation (.util-journey-nav) or editorial opening image.
 */
function resolveArtefactHostInsertion(root) {
  if (!root || typeof root.querySelector !== "function") {
    return { mode: "append", reason: "missing-root" };
  }
  var knowledgeSummary = root.querySelector(
    '[data-orientation-type="knowledge_summary"]'
  );
  if (knowledgeSummary) {
    return {
      mode: "after",
      anchor: knowledgeSummary,
      reason: "knowledge_summary"
    };
  }
  var learningOutcomes = root.querySelector(
    '[data-orientation-type="learning_outcomes"]'
  );
  if (learningOutcomes) {
    return {
      mode: "after",
      anchor: learningOutcomes,
      reason: "learning_outcomes"
    };
  }
  var orientation = root.querySelector('[data-region="orientation"]');
  if (orientation) {
    return {
      mode: "after",
      anchor: orientation,
      reason: "orientation"
    };
  }
  var assessmentBriefing =
    root.querySelector('[data-region="assessment-orientation"]') ||
    root.querySelector("#journey-assessment-briefing");
  if (assessmentBriefing) {
    return {
      mode: "after",
      anchor: assessmentBriefing,
      reason: "assessment_orientation"
    };
  }
  var editorialOpening = root.querySelector('[data-region="editorial-opening"]');
  if (editorialOpening) {
    return {
      mode: "after",
      anchor: editorialOpening,
      reason: "editorial_opening"
    };
  }
  var journeyNav = root.querySelector(".util-journey-nav");
  if (journeyNav) {
    return {
      mode: "after",
      anchor: journeyNav,
      reason: "journey_nav"
    };
  }
  var beforeAnchor =
    root.querySelector('[data-region="activities"]') ||
    root.querySelector('[data-region="exposition"]') ||
    root.querySelector('[data-region="assessment-intro"]') ||
    root.querySelector(".util-learner-draft-controls");
  if (beforeAnchor) {
    return { mode: "before", anchor: beforeAnchor, reason: "activities_or_draft" };
  }
  var pageHeader = root.querySelector(".util-page-header");
  if (pageHeader) {
    return { mode: "after", anchor: pageHeader, reason: "page_header" };
  }
  if (root.firstChild) {
    return { mode: "before", anchor: root.firstChild, reason: "first_child" };
  }
  return { mode: "append", reason: "empty_root" };
}

function insertArtefactHost(root, host) {
  var point = resolveArtefactHostInsertion(root);
  if (point.mode === "after" && insertNodeAfter(point.anchor, host)) {
    return point;
  }
  if (
    point.mode === "before" &&
    point.anchor &&
    point.anchor.parentNode &&
    typeof point.anchor.parentNode.insertBefore === "function"
  ) {
    point.anchor.parentNode.insertBefore(host, point.anchor);
    return point;
  }
  if (typeof root.insertBefore === "function" && root.firstChild) {
    root.insertBefore(host, root.firstChild);
    return { mode: "before", anchor: root.firstChild, reason: "first_child_fallback" };
  }
  if (typeof root.appendChild === "function") {
    root.appendChild(host);
    return { mode: "append", reason: point.reason || "append" };
  }
  return { mode: "failed", reason: "no-insert" };
}

/**
 * Insert reference regions and producer/consumer signposting into a mounted
 * renderer root for the active commission.
 * Safe to call repeatedly; replaces any prior injected regions.
 */
function injectArtefactReferences(root, options) {
  var opts = options && typeof options === "object" ? options : {};
  if (!root || !root.querySelector) {
    return { ok: false, reason: "missing-root", injected: 0 };
  }

  var existing = root.querySelectorAll("[data-lj-artefact-ref-host]");
  for (var e = 0; e < existing.length; e += 1) {
    if (existing[e].parentNode) existing[e].parentNode.removeChild(existing[e]);
  }

  var commissionId = asText(opts.commissionId);
  var refs = listReferencesForCommission(opts.contract, commissionId);
  var produces = listProducesForCommission(opts.contract, commissionId);
  var titleByCommission = titleMapFromResources(opts.resources);
  var resolutions = [];
  var htmlParts = [];

  refs.forEach(function (ref) {
    var resolveOpts = {
      contract: opts.contract,
      artefactId: ref.artefactId,
      resources: opts.resources,
      producerPageKey: opts.producerPageKey
    };
    if (Object.prototype.hasOwnProperty.call(opts, "storage") && opts.storage != null) {
      resolveOpts.storage = opts.storage;
    }
    var resolution = resolveArtefactReference(resolveOpts);
    resolutions.push(resolution);
    var produce = findProduceDeclaration(opts.contract, ref.artefactId);
    htmlParts.push(
      renderArtefactReferenceHtml(resolution, ref, {
        producerTitle: produce ? titleByCommission[produce.commissionId] || "" : "",
        produceLabel: produce ? produce.label : ""
      })
    );
  });

  var includeProducerSignpost = opts.includeProducerSignpost !== false;
  var producerSignpost = includeProducerSignpost
    ? buildProducerSignpostHtml(
        opts.contract,
        commissionId,
        opts.resources,
        { journalSpec: opts.journalSpec }
      )
    : "";
  if (producerSignpost) htmlParts.push(producerSignpost);

  if (!htmlParts.length) {
    var emptyGuidance = applyContextualHandoffGuidance(root, {
      contract: opts.contract,
      commissionId: commissionId,
      journalSpec: opts.journalSpec,
      deliveryContext: "unified"
    });
    return {
      ok: true,
      injected: 0,
      resolutions: [],
      guidance: emptyGuidance,
      producer: produces.length > 0,
      consumer: refs.length > 0
    };
  }

  var host = createArtefactHostElement(root);
  if (!host) {
    return { ok: false, reason: "missing-document", injected: 0 };
  }
  host.setAttribute("data-lj-artefact-ref-host", "true");
  host.className = "lj-artefact-ref-host";
  host.innerHTML = htmlParts.join("");
  var insertion = insertArtefactHost(root, host);

  var guidance = applyContextualHandoffGuidance(root, {
    contract: opts.contract,
    commissionId: commissionId,
    journalSpec: opts.journalSpec,
    deliveryContext: "unified"
  });

  return {
    ok: true,
    injected: refs.length,
    resolutions: resolutions,
    guidance: guidance,
    producer: produces.length > 0,
    consumer: refs.length > 0,
    signposted: Boolean(producerSignpost),
    insertionReason: insertion && insertion.reason ? insertion.reason : ""
  };
}

/**
 * Map known system-owned standalone assessment-output help onto the unified
 * retention help. Does not rewrite arbitrary authored educational prose.
 * Prefer applyContextualHandoffGuidance on [data-assessment-output-help].
 */
function rewriteHandoffMechanicsText(text, options) {
  var assessmentOutput = require("./assessment-output.js");
  var opts = options && typeof options === "object" ? options : {};
  var out = String(text == null ? "" : text);
  if (!out) return out;
  var standaloneHelp = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  if (out.replace(/\s+/g, " ").trim() === standaloneHelp.replace(/\s+/g, " ").trim()) {
    return assessmentOutput.buildAssessmentOutputRetentionHelp({
      deliveryContext: "unified",
      isProducer: !!opts.isProducer,
      journalListed: !!opts.journalListed
    });
  }
  return out;
}

/**
 * Shared decision for unified retention help. Wording comes only from
 * assessment-output.buildAssessmentOutputRetentionHelp.
 */
function resolveContextualHandoffHelp(options) {
  var assessmentOutput = require("./assessment-output.js");
  var opts = options && typeof options === "object" ? options : {};
  if (asText(opts.deliveryContext) !== "unified") {
    return { ok: true, skipped: "not-unified", helpText: "", refs: [], produces: [] };
  }
  var commissionId = asText(opts.commissionId);
  var refs = listReferencesForCommission(opts.contract, commissionId);
  var produces = listProducesForCommission(opts.contract, commissionId);
  if (!refs.length && !produces.length) {
    return {
      ok: true,
      skipped: "no-artefact-relationship",
      helpText: "",
      refs: refs,
      produces: produces,
      journalListed: false
    };
  }
  var journalListed = commissionProducesJournalListedArtefact(
    opts.contract,
    commissionId,
    opts.journalSpec
  );
  return {
    ok: true,
    helpText: assessmentOutput.buildAssessmentOutputRetentionHelp({
      deliveryContext: "unified",
      isProducer: produces.length > 0,
      journalListed: journalListed
    }),
    refs: refs,
    produces: produces,
    journalListed: journalListed
  };
}

/**
 * Apply delivery-owned retention guidance to system-owned assessment-output
 * help nodes only. Does not search or rewrite authored educational prose.
 *
 * Standalone publishing does not call this with deliveryContext "unified".
 */
function applyContextualHandoffGuidance(root, options) {
  var opts = options && typeof options === "object" ? options : {};
  if (!root) {
    return { ok: false, reason: "missing-root", rewritten: 0 };
  }
  var decided = resolveContextualHandoffHelp(opts);
  if (decided.skipped) {
    return { ok: true, rewritten: 0, skipped: decided.skipped };
  }
  if (typeof root.querySelectorAll !== "function") {
    return { ok: false, reason: "missing-root", rewritten: 0 };
  }

  var helpText = decided.helpText;
  var nodes = root.querySelectorAll("[data-assessment-output-help]");
  var rewritten = 0;
  var i = 0;
  for (; i < nodes.length; i += 1) {
    var node = nodes[i];
    if (!node) continue;
    var before = String(node.textContent || "");
    if (before === helpText) {
      if (node.setAttribute) node.setAttribute("data-assessment-output-delivery", "unified");
      continue;
    }
    node.textContent = helpText;
    if (node.setAttribute) node.setAttribute("data-assessment-output-delivery", "unified");
    rewritten += 1;
  }

  return {
    ok: true,
    rewritten: rewritten,
    consumer: decided.refs.length > 0,
    producer: decided.produces.length > 0,
    journalListed: !!decided.journalListed,
    systemOwnedOnly: true
  };
}

/**
 * Static-HTML counterpart of applyContextualHandoffGuidance for unified package
 * assembly. Rewrites only [data-assessment-output-help] system nodes; leaves
 * authored educational prose untouched. Runtime mount remains a fallback.
 */
function applyContextualHandoffGuidanceToHtml(html, options) {
  var opts = options && typeof options === "object" ? options : {};
  var source = String(html == null ? "" : html);
  if (!source) {
    return { ok: false, reason: "missing-html", rewritten: 0, html: source };
  }
  var decided = resolveContextualHandoffHelp(opts);
  if (decided.skipped) {
    return {
      ok: true,
      rewritten: 0,
      skipped: decided.skipped,
      html: source
    };
  }

  var helpText = decided.helpText;
  var escapedHelp = escapeHtml(helpText);
  var rewritten = 0;
  var out = source.replace(
    /<(p|div|span)\b([^>]*\bdata-assessment-output-help\b[^>]*)>([\s\S]*?)<\/\1>/gi,
    function (_match, tag, attrs) {
      rewritten += 1;
      var nextAttrs = String(attrs || "");
      if (/\bdata-assessment-output-delivery\s*=/.test(nextAttrs)) {
        nextAttrs = nextAttrs.replace(
          /\bdata-assessment-output-delivery\s*=\s*(["'])[\s\S]*?\1/i,
          "data-assessment-output-delivery=$1unified$1"
        );
      } else {
        nextAttrs += ' data-assessment-output-delivery="unified"';
      }
      return "<" + tag + nextAttrs + ">" + escapedHelp + "</" + tag + ">";
    }
  );

  return {
    ok: true,
    rewritten: rewritten,
    consumer: decided.refs.length > 0,
    producer: decided.produces.length > 0,
    journalListed: !!decided.journalListed,
    systemOwnedOnly: true,
    html: out
  };
}

/**
 * Propose a produce/reference contract from an existing Learning Journey design page
 * and hydrated constituent Assessment Pack source pages.
 *
 * Does not invent educational content. Reports gaps when constructed workspaces or
 * dependency links cannot be derived from stored metadata.
 *
 * @param {{
 *   page?: object,
 *   constituents?: Array<{commissionId?:string, productId?:string, sourcePage?:object, title?:string}>,
 *   producerCommissionId?: string,
 *   consumerCommissionId?: string
 * }} input
 */
function proposeArtefactContractFromLearningJourney(input) {
  var src = input && typeof input === "object" ? input : {};
  var page = src.page && typeof src.page === "object" ? src.page : null;
  var constituents = Array.isArray(src.constituents) ? src.constituents : [];
  var gaps = [];
  var byCommission = Object.create(null);

  constituents.forEach(function (row) {
    if (!row || typeof row !== "object") return;
    var cid = asText(row.commissionId || row.commission_id);
    if (!cid) return;
    byCommission[cid] = {
      commissionId: cid,
      productId: asText(row.productId || row.product_id),
      title: asText(row.title),
      sourcePage: row.sourcePage || null
    };
  });

  var commissions = Array.isArray(page && page.commissions) ? page.commissions.slice() : [];
  commissions.sort(function (a, b) {
    return (Number(a && a.order) || 0) - (Number(b && b.order) || 0);
  });

  function constructedWorkspaces(sourcePage) {
    return artefactProducers.discoverConstructedTextProducers(sourcePage).map(function (row) {
      return {
        elicitationId: row.elicitationId,
        workspaceId: row.workspaceId,
        label: row.label,
        responseKind: row.responseKind,
        source: row.source
      };
    });
  }

  function referencedCommissionIds(commission) {
    var deps = asText(commission && commission.dependencies);
    if (!deps) return [];
    var found = [];
    Object.keys(byCommission).forEach(function (cid) {
      if (cid === asText(commission.commission_id || commission.commissionId)) return;
      var re = new RegExp("(?:^|[^a-z0-9_])" + cid.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:[^a-z0-9_]|$)", "i");
      if (re.test(deps)) found.push(cid);
    });
    return found;
  }

  // Consumers that may reference an earlier constructed-text artefact when
  // commission.dependencies explicitly names the producer. Order alone is not enough.
  // Sprint 103: Learning Journey four-product family + legacy Interactive.
  var supportedArtefactConsumerProducts = {
    assessment_pack: true,
    interactive: true,
    practice: true,
    expository: true,
    situated_task: true
  };

  var forcedProducer = asText(src.producerCommissionId || src.producer_commission_id);
  var forcedConsumer = asText(src.consumerCommissionId || src.consumer_commission_id);
  var pairs = [];
  var orderByCommission = Object.create(null);
  commissions.forEach(function (commission) {
    var cid = asText(commission && (commission.commission_id || commission.commissionId));
    if (!cid) return;
    orderByCommission[cid] = Number(commission && commission.order);
  });

  function resolveCommissionProductId(commissionId) {
    var meta = byCommission[commissionId];
    if (meta && meta.productId) return meta.productId;
    for (var i = 0; i < commissions.length; i += 1) {
      var c = commissions[i];
      if (asText(c.commission_id || c.commissionId) === commissionId) {
        return asText(c.product_id || c.productId);
      }
    }
    return "";
  }

  function producerPrecedesConsumer(producerId, consumerId) {
    var producerOrder = orderByCommission[producerId];
    var consumerOrder = orderByCommission[consumerId];
    if (!isFinite(producerOrder) || !isFinite(consumerOrder)) return true;
    return producerOrder < consumerOrder;
  }

  var artefactIdRe = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/;
  var designConflicts = [];

  function isIndependentAssessmentPackConsumer(consumerMeta) {
    var sp = consumerMeta && consumerMeta.sourcePage;
    var ae = sp && typeof sp === "object" ? sp.assessment_evidence : null;
    var lc = ae && typeof ae === "object" ? ae.learner_context : null;
    return !!(lc && lc.depends_on_prior_work === false);
  }

  function readExplicitCommissionArtefactReferences(commission) {
    if (!commission || typeof commission !== "object") {
      return { explicit: false, refs: [] };
    }
    var hasSnake = Object.prototype.hasOwnProperty.call(commission, "artefact_references");
    var hasCamel = Object.prototype.hasOwnProperty.call(commission, "artefactReferences");
    if (!hasSnake && !hasCamel) return { explicit: false, refs: [] };
    var raw = hasSnake ? commission.artefact_references : commission.artefactReferences;
    if (!Array.isArray(raw)) return { explicit: false, refs: [] };
    return {
      explicit: true,
      refs: raw.map(asText).filter(Boolean)
    };
  }

  function formatProducerRemediation(producerProduct, producerId, elicitationId) {
    var prod = asText(producerProduct).toLowerCase();
    var eid = asText(elicitationId);
    if (prod === "situated_task") {
      return (
        "On Situated Task " +
        producerId +
        ", add artefact: { elicitation_id: \"" +
        eid +
        "\", response_kind: \"constructed_text\" } to the matching situated_learning.record.entries[] item and republish."
      );
    }
    if (prod === "expository") {
      return (
        "On Expository " +
        producerId +
        ", declare { elicitation_id: \"" +
        eid +
        "\", response_kind: \"constructed_text\" } in page-root learner_artefacts.produces[] and republish."
      );
    }
    if (prod === "practice" || prod === "interactive") {
      return (
        "On " +
        (prod === "practice" ? "Practice " : "Interactive ") +
        producerId +
        ", bind response_fulfilment.artefact_elicitation_id: \"" +
        eid +
        "\" (or page-root learner_artefacts.produces[]) for constructed text and republish."
      );
    }
    if (prod === "assessment_pack") {
      return (
        "On Assessment Pack " +
        producerId +
        ", ensure a constructed_performance elicitation with elicitation_id \"" +
        eid +
        "\" is declared and republish."
      );
    }
    return (
      "Ensure producer " +
      producerId +
      " declares a constructed-text learner artefact with elicitation_id \"" +
      eid +
      "\" and republish."
    );
  }

  if (forcedProducer && forcedConsumer) {
    pairs.push({ producerId: forcedProducer, consumerId: forcedConsumer, source: "explicit" });
  } else {
    commissions.forEach(function (commission) {
      var consumerId = asText(commission && (commission.commission_id || commission.commissionId));
      if (!consumerId) return;
      var consumerProduct = asText(
        resolveCommissionProductId(consumerId) ||
          commission.product_id ||
          commission.productId
      ).toLowerCase();
      if (!supportedArtefactConsumerProducts[consumerProduct]) return;
      var consumerMeta = byCommission[consumerId];
      var isIndependentAp = isIndependentAssessmentPackConsumer(consumerMeta);
      var explicitRefs = readExplicitCommissionArtefactReferences(commission);

      if (explicitRefs.explicit) {
        if (!explicitRefs.refs.length) return;
        // Safeguard 1: explicit Assessment Pack independence vs explicit non-empty artefact_references
        // is a contradictory design contract — fail closed, never silently expose or silently discard.
        if (isIndependentAp) {
          var conflictRow = {
            code: "conflicting_independent_assessment_artefact_reference",
            blocking: true,
            commissionId: consumerId,
            consumerCommissionId: consumerId,
            artefactIds: explicitRefs.refs.slice(),
            message:
              "Contradictory design contract on Assessment Pack " +
              consumerId +
              ": assessment_evidence.learner_context.depends_on_prior_work is false (independent assessment), " +
              "but the commission explicitly declares artefact_references [" +
              explicitRefs.refs.join(", ") +
              "]. Resolve before publishing: either clear artefact_references to [] if this assessment is independent, " +
              "or set learner_context.depends_on_prior_work: true with bring_forward on " +
              consumerId +
              " if prior learner work is genuinely required."
          };
          designConflicts.push(conflictRow);
          gaps.push(conflictRow);
          return;
        }
        explicitRefs.refs.forEach(function (refStr) {
          var refMatch = artefactIdRe.exec(refStr);
          if (!refMatch) {
            gaps.push({
              code: "explicit_artefact_reference_invalid",
              blocking: true,
              commissionId: consumerId,
              consumerCommissionId: consumerId,
              artefactId: refStr,
              message:
                "Commission " +
                consumerId +
                " declares invalid artefact_references entry \"" +
                refStr +
                "\". Update artefact_references to use exact {commission_id}.{elicitation_id}."
            });
            return;
          }
          var producerId = refMatch[1];
          var elicitationId = refMatch[2];
          var producerMeta = byCommission[producerId];
          var producerProduct =
            asText(producerMeta && producerMeta.productId) || resolveCommissionProductId(producerId);
          if (!producerPrecedesConsumer(producerId, consumerId) || producerId === consumerId) {
            gaps.push({
              code: "explicit_artefact_reference_order_invalid",
              blocking: true,
              commissionId: consumerId,
              producerCommissionId: producerId,
              consumerCommissionId: consumerId,
              artefactId: refStr,
              message:
                "Commission " +
                consumerId +
                " explicitly references " +
                refStr +
                ", but producer " +
                producerId +
                " does not precede " +
                consumerId +
                " in journey order. Correct artefact_references or commission order."
            });
            return;
          }
          if (!producerMeta) {
            gaps.push({
              code: "explicit_artefact_reference_producer_missing",
              blocking: true,
              commissionId: producerId,
              producerCommissionId: producerId,
              consumerCommissionId: consumerId,
              artefactId: refStr,
              message:
                "Consumer " +
                consumerId +
                " requires artefact " +
                refStr +
                ", but producer commission " +
                producerId +
                " is not among prepared constituents. Prepare and publish " +
                producerId +
                " before assembling."
            });
            return;
          }
          if (!producerMeta.sourcePage) {
            gaps.push({
              code: "missing_producer_source_page",
              blocking: true,
              commissionId: producerId,
              producerCommissionId: producerId,
              consumerCommissionId: consumerId,
              artefactId: refStr,
              message:
                "Consumer " +
                consumerId +
                " requires artefact " +
                refStr +
                ", but producer " +
                producerId +
                " lacks a hydrated sourcePage."
            });
            return;
          }
          var producerWorkspaces = constructedWorkspaces(producerMeta.sourcePage);
          var matchedWs = null;
          for (var pw = 0; pw < producerWorkspaces.length; pw += 1) {
            if (producerWorkspaces[pw].elicitationId === elicitationId) {
              matchedWs = producerWorkspaces[pw];
              break;
            }
          }
          if (!matchedWs) {
            gaps.push({
              code: "explicit_artefact_reference_unresolved",
              blocking: true,
              commissionId: producerId,
              producerCommissionId: producerId,
              consumerCommissionId: consumerId,
              artefactId: refStr,
              elicitationId: elicitationId,
              productId: producerProduct,
              message:
                "Consumer " +
                consumerId +
                " requires artefact " +
                refStr +
                ", but producer " +
                producerId +
                " does not declare constructed-text elicitation \"" +
                elicitationId +
                "\". " +
                formatProducerRemediation(producerProduct, producerId, elicitationId)
            });
            return;
          }
          pairs.push({
            producerId: producerId,
            consumerId: consumerId,
            source: "artefact_references",
            artefactId: refStr,
            elicitationId: elicitationId,
            workspace: matchedWs,
            consumerProduct: consumerProduct,
            producerProduct: producerProduct
          });
        });
        return;
      }

      // Compatibility path for legacy / already-assembled journeys without commission.artefact_references.
      referencedCommissionIds(commission).forEach(function (producerId) {
        var producerMeta = byCommission[producerId];
        var producerProduct = resolveCommissionProductId(producerId);
        // Producer must expose at least one declared constructed-text artefact.
        if (!producerMeta && !producerProduct) return;
        // Independent Assessment Pack compatibility guard (F02): do not auto-infer artefact
        // references from conceptual dependencies when depends_on_prior_work is explicitly false.
        if (isIndependentAp) {
          gaps.push({
            code: "assessment_pack_independent_dependency_skipped",
            blocking: false,
            commissionId: consumerId,
            producerCommissionId: producerId,
            consumerCommissionId: consumerId,
            message:
              "Skipped auto-inferring artefact reference from conceptual dependency " +
              producerId +
              " into independent Assessment Pack " +
              consumerId +
              " because learner_context.depends_on_prior_work is false."
          });
          return;
        }
        if (producerMeta && producerMeta.sourcePage) {
          var producerWorkspaces = constructedWorkspaces(producerMeta.sourcePage);
          if (!producerWorkspaces.length) {
            gaps.push({
              code: "no_constructed_workspace",
              commissionId: producerId,
              productId: producerProduct,
              message:
                "Producer commission " +
                producerId +
                " is named by dependencies but declares no constructed-text learner artefact."
            });
            return;
          }
        }
        if (!producerPrecedesConsumer(producerId, consumerId)) {
          gaps.push({
            code: "producer_does_not_precede_consumer",
            producerId: producerId,
            consumerId: consumerId,
            message:
              "Commission " +
              consumerId +
              " dependencies name " +
              producerId +
              ", but " +
              producerId +
              " does not precede " +
              consumerId +
              " in journey order. Cross-resource persistence was not created from that dependency."
          });
          return;
        }
        pairs.push({
          producerId: producerId,
          consumerId: consumerId,
          source: "dependencies",
          consumerProduct: consumerProduct,
          producerProduct: producerProduct
        });
      });
    });
  }

  if (!pairs.length) {
    gaps.push({
      code: "no_producer_consumer_pair",
      message:
        "No produce→reference pair could be derived from commission.artefact_references or commission.dependencies. Supported consumers are Practice, Expository, Assessment Pack, Situated Task, and legacy Interactive when referencing an earlier commission that declares a constructed-text learner artefact. Confirm artefact_references / dependencies, or pass producerCommissionId and consumerCommissionId explicitly. An enabled learning_journey.journal may still declare journal-only producers when their elicitations exist."
    });
  }

  var produces = [];
  var references = [];
  var seenProduceArtefactIds = Object.create(null);
  var journalDeclaredProduceCount = 0;

  function pushProduceDeclaration(row) {
    var artefactId = asText(row && row.artefactId);
    if (!artefactId || seenProduceArtefactIds[artefactId]) return false;
    seenProduceArtefactIds[artefactId] = true;
    produces.push({
      artefactId: artefactId,
      commissionId: asText(row.commissionId),
      workspaceId: asText(row.workspaceId),
      label: asText(row.label) || "Learner constructed response"
    });
    return true;
  }

  pairs.forEach(function (pair) {
    var producer = byCommission[pair.producerId];
    var consumer = byCommission[pair.consumerId];
    if (!producer || !producer.sourcePage) {
      gaps.push({
        code: "missing_producer_source_page",
        blocking: pair.source === "artefact_references",
        commissionId: pair.producerId,
        consumerCommissionId: pair.consumerId,
        message: "Producer commission " + pair.producerId + " lacks a hydrated sourcePage."
      });
      return;
    }
    if (!consumer) {
      gaps.push({
        code: "missing_consumer_constituent",
        blocking: pair.source === "artefact_references",
        commissionId: pair.consumerId,
        message: "Consumer commission " + pair.consumerId + " is not among prepared constituents."
      });
      return;
    }
    var primary = pair.workspace || null;
    if (!primary) {
      var workspaces = constructedWorkspaces(producer.sourcePage);
      if (!workspaces.length) {
        gaps.push({
          code: "no_constructed_workspace",
          commissionId: pair.producerId,
          message:
            "Producer " +
            pair.producerId +
            " has no declared constructed-text learner artefact from which to derive a workspaceId."
        });
        return;
      }
      // Prefer a single primary constructed workspace (first constructed elicitation).
      primary = workspaces[0];
      if (workspaces.length > 1) {
        gaps.push({
          code: "multiple_constructed_workspaces",
          commissionId: pair.producerId,
          message:
            "Producer has multiple constructed workspaces; using the first (" +
            primary.workspaceId +
            "). Confirm before relying on handoff.",
          workspaceIds: workspaces.map(function (w) {
            return w.workspaceId;
          })
        });
      }
    }
    var artefactId = pair.artefactId || pair.producerId + "." + primary.elicitationId;
    pushProduceDeclaration({
      artefactId: artefactId,
      commissionId: pair.producerId,
      workspaceId: primary.workspaceId,
      label: primary.label
    });
    references.push({
      artefactId: artefactId,
      commissionId: pair.consumerId,
      usage: ARTEFACT_USAGE_REFERENCE,
      label: "Your earlier response",
      missingMessage:
        "Your earlier response is not available yet. Complete that experience first, or continue with the activities below.",
      standaloneFallback:
        "If you are working outside the journey, keep a copy of your earlier response yourself."
    });
  });

  // Journal-only producers (S97-AD-012): an enabled learning_journey.journal may
  // declare produces[] for referenced constructed-text artefacts even when no
  // later commission consumes them. Never invent elicitations/workspaces.
  var journal =
    page &&
    page.learning_journey &&
    typeof page.learning_journey === "object" &&
    page.learning_journey.journal &&
    typeof page.learning_journey.journal === "object"
      ? page.learning_journey.journal
      : null;
  if (journal && journal.enabled === true) {
    var journalEntries = Array.isArray(journal.entries) ? journal.entries : [];
    journalEntries.forEach(function (entry, index) {
      if (!entry || typeof entry !== "object") return;
      var artefactId = asText(entry.artefact_id || entry.artefactId);
      var entryId =
        asText(entry.entry_id || entry.entryId) || "journal-entry-" + String(index + 1);
      if (!artefactId) {
        gaps.push({
          code: "journal_entry_missing_artefact_id",
          blocking: true,
          entryId: entryId,
          message:
            "Journal entry " +
            entryId +
            " is missing artefact_id. Add artefact_id using {commission_id}.{elicitation_id}."
        });
        return;
      }
      var match = artefactIdRe.exec(artefactId);
      if (!match) {
        gaps.push({
          code: "journal_artefact_id_invalid",
          blocking: true,
          entryId: entryId,
          artefactId: artefactId,
          message:
            "Journal entry " +
            entryId +
            " artefact_id \"" +
            artefactId +
            "\" must use {commission_id}.{elicitation_id}; left undeclared."
        });
        return;
      }
      var producerId = match[1];
      var elicitationId = match[2];
      var producer = byCommission[producerId];
      if (!producer) {
        gaps.push({
          code: "journal_producer_constituent_missing",
          blocking: true,
          entryId: entryId,
          artefactId: artefactId,
          commissionId: producerId,
          producerCommissionId: producerId,
          message:
            "Journal entry " +
            entryId +
            " (" +
            artefactId +
            ") references commission " +
            producerId +
            ", but that constituent is not among prepared resources. Prepare and publish " +
            producerId +
            " before assembling."
        });
        return;
      }
      var producerProduct =
        asText(producer.productId) || resolveCommissionProductId(producerId);
      if (!producer.sourcePage) {
        gaps.push({
          code: "missing_producer_source_page",
          blocking: true,
          entryId: entryId,
          artefactId: artefactId,
          commissionId: producerId,
          producerCommissionId: producerId,
          message:
            "Journal entry " +
            entryId +
            " (" +
            artefactId +
            ") producer commission " +
            producerId +
            " lacks a hydrated sourcePage."
        });
        return;
      }
      var workspaces = constructedWorkspaces(producer.sourcePage);
      var matched = null;
      var w;
      for (w = 0; w < workspaces.length; w += 1) {
        if (workspaces[w].elicitationId === elicitationId) {
          matched = workspaces[w];
          break;
        }
      }
      if (!matched) {
        var limitationCode = "journal_producer_elicitation_missing";
        var limitationMessage =
          "Journal entry " +
          entryId +
          " (" +
          artefactId +
          ") does not match a declared constructed-text learner artefact on producer " +
          producerId +
          ". " +
          formatProducerRemediation(producerProduct, producerId, elicitationId);
        gaps.push({
          code: limitationCode,
          blocking: true,
          entryId: entryId,
          artefactId: artefactId,
          commissionId: producerId,
          producerCommissionId: producerId,
          elicitationId: elicitationId,
          productId: producerProduct,
          message: limitationMessage
        });
        return;
      }
      if (
        pushProduceDeclaration({
          artefactId: artefactId,
          commissionId: producerId,
          workspaceId: matched.workspaceId,
          label: matched.label
        })
      ) {
        journalDeclaredProduceCount += 1;
      }
    });
  }

  var contract = normalizeArtefactContract({ produces: produces, references: references });
  var allConflicts = (contract.conflicts || []).slice();
  if (Array.isArray(contract.conflicts) && contract.conflicts.length) {
    contract.conflicts.forEach(function (conflict) {
      gaps.push(Object.assign({ blocking: true }, conflict));
    });
  }
  designConflicts.forEach(function (conflict) {
    allConflicts.push(conflict);
  });
  var blockingGaps = gaps.filter(function (gap) {
    return !!(gap && gap.blocking === true);
  });
  var hasConsumerHandoff = contract.references.length > 0;
  var hasProduces = contract.produces.length > 0;
  // Journal-only producers are a valid contract even without consumer references,
  // but any unresolved Journal entry, explicit artefact_reference, or design conflict fails closed.
  var ok = !blockingGaps.length && hasProduces && (hasConsumerHandoff || journalDeclaredProduceCount > 0);
  return {
    ok: ok,
    contract: {
      produces: contract.produces,
      references: contract.references
    },
    gaps: gaps,
    blockingGaps: blockingGaps,
    pairs: pairs,
    journalDeclaredProduceCount: journalDeclaredProduceCount,
    conflicts: allConflicts
  };
}

module.exports = {
  ARTEFACT_USAGE_REFERENCE: ARTEFACT_USAGE_REFERENCE,
  STORAGE_KEY_PREFIX_DRAFT: constants.STORAGE_KEY_PREFIX,
  normalizeArtefactContract: normalizeArtefactContract,
  findProduceDeclaration: findProduceDeclaration,
  listReferencesForCommission: listReferencesForCommission,
  listProducesForCommission: listProducesForCommission,
  resolveArtefactReference: resolveArtefactReference,
  renderArtefactReferenceHtml: renderArtefactReferenceHtml,
  injectArtefactReferences: injectArtefactReferences,
  resolveArtefactHostInsertion: resolveArtefactHostInsertion,
  renderJournalArtefactHtml: renderJournalArtefactHtml,
  resolveLearningJournalEntries: resolveLearningJournalEntries,
  populateLearningJournal: populateLearningJournal,
  JOURNAL_ACK_STORAGE_KEY_PREFIX: JOURNAL_ACK_STORAGE_KEY_PREFIX,
  normalizeJournalContentForFingerprint: normalizeJournalContentForFingerprint,
  fingerprintJournalContent: fingerprintJournalContent,
  collectJournalContentFingerprints: collectJournalContentFingerprints,
  evaluateJournalNotifications: evaluateJournalNotifications,
  acknowledgeJournalNotifications: acknowledgeJournalNotifications,
  buildLearningJourneyNotificationKey: buildLearningJourneyNotificationKey,
  applyContextualHandoffGuidance: applyContextualHandoffGuidance,
  applyContextualHandoffGuidanceToHtml: applyContextualHandoffGuidanceToHtml,
  rewriteHandoffMechanicsText: rewriteHandoffMechanicsText,
  extractTextFromWorkspaceState: extractTextFromWorkspaceState,
  buildProducerSignpostHtml: buildProducerSignpostHtml,
  formatQuotedTitleList: formatQuotedTitleList,
  proposeArtefactContractFromLearningJourney: proposeArtefactContractFromLearningJourney,
  discoverConstructedTextProducers: artefactProducers.discoverConstructedTextProducers,
  constructedTextWorkspaceId: artefactProducers.constructedTextWorkspaceId,
  RESPONSE_KIND_CONSTRUCTED_TEXT: artefactProducers.RESPONSE_KIND_CONSTRUCTED_TEXT
};
