/**
 * Sprint 95 M3 — explicit learner artefact produce/reference contract.
 *
 * Drafts remain resource-private. Only declared artefacts may be resolved
 * for read-only reference by another resource. C5/C6 are not hard-coded.
 */
"use strict";

var createLearnerDraftStorage = require("./learner-draft-storage").createLearnerDraftStorage;
var constants = require("./learner-draft-constants");

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

/**
 * Render a read-only reference region (or missing-input notice).
 * Intentionally not a landmark; not editable; no workspace adapters.
 */
function renderArtefactReferenceHtml(resolution, referenceDecl) {
  var ref = referenceDecl && typeof referenceDecl === "object" ? referenceDecl : {};
  var resolved = resolution && typeof resolution === "object" ? resolution : {};
  var label = asText(ref.label) || asText(resolved.label) || "Earlier learner response";
  var artefactId = asText(resolved.artefactId || ref.artefactId);
  var regionId =
    "lj-artefact-ref-" +
    String(artefactId || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  if (resolved.ok && resolved.status === "resolved" && asText(resolved.text)) {
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
      '<p class="lj-artefact-ref__note">Available here for reference (read-only). Edit it in the experience that produced it.</p>' +
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

  var missing =
    asText(ref.missingMessage) ||
    "Your earlier response is not available yet. Complete that experience first, or continue with the activities below.";
  var fallback = asText(ref.standaloneFallback);
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

/**
 * Insert reference regions into a mounted renderer root for the active commission.
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
  if (!refs.length) {
    var producerOnlyGuidance = applyContextualHandoffGuidance(root, {
      contract: opts.contract,
      commissionId: commissionId,
      resolutions: [],
      deliveryContext: "unified"
    });
    return {
      ok: true,
      injected: 0,
      resolutions: [],
      guidance: producerOnlyGuidance
    };
  }

  var host = null;
  if (typeof document !== "undefined" && document.createElement) {
    host = document.createElement("div");
  } else if (root.ownerDocument && root.ownerDocument.createElement) {
    host = root.ownerDocument.createElement("div");
  }
  if (!host) {
    return { ok: false, reason: "missing-document", injected: 0 };
  }
  host.setAttribute("data-lj-artefact-ref-host", "true");
  host.className = "lj-artefact-ref-host";

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
    htmlParts.push(renderArtefactReferenceHtml(resolution, ref));
  });
  host.innerHTML = htmlParts.join("");

  var anchor =
    root.querySelector('[data-region="activities"]') ||
    root.querySelector(".util-learner-draft-controls") ||
    root.firstChild;
  if (anchor && anchor.parentNode === root) {
    root.insertBefore(host, anchor);
  } else if (typeof root.insertBefore === "function" && root.firstChild) {
    root.insertBefore(host, root.firstChild);
  } else if (typeof root.appendChild === "function") {
    root.appendChild(host);
  }

  var guidance = applyContextualHandoffGuidance(root, {
    contract: opts.contract,
    commissionId: commissionId,
    resolutions: resolutions,
    deliveryContext: "unified"
  });

  return {
    ok: true,
    injected: refs.length,
    resolutions: resolutions,
    guidance: guidance
  };
}

/**
 * Delivery-mechanics sentences that contradict unified artefact handoff.
 * Educational task wording is preserved; only availability/transfer claims are removed
 * or rewritten when a declared artefact relationship exists for this commission.
 */
var HANDOFF_MECHANICS_SENTENCE_PATTERNS = [
  /Your response will not automatically transfer between learning products\.?/gi,
  /Your earlier response is not transferred automatically into this resource\.?/gi,
  /PRISM does not automatically transfer[^.?!]*[.?!]/gi,
  /[^.?!]*are not transferred automatically between learning resources\.?/gi,
  /[^.?!]*responses? (?:are|is) not transferred automatically[^.?!]*[.?!]/gi,
  /Earlier work is not transferred automatically\.?/gi,
  /Save or copy your completed response somewhere you can retrieve it\.?/gi,
  /Begin by retrieving your retained response from activity\s+[A-Za-z0-9_-]+\.?/gi
];

function rewriteHandoffMechanicsText(text, options) {
  var opts = options && typeof options === "object" ? options : {};
  var out = String(text == null ? "" : text);
  if (!out) return out;
  var hasResolved =
    Array.isArray(opts.resolutions) &&
    opts.resolutions.some(function (row) {
      return row && row.ok && row.status === "resolved" && asText(row.text);
    });

  if (hasResolved) {
    out = out.replace(
      /If you completed the earlier[^.?!]*,\s*retrieve your saved response and keep it available\.?/gi,
      "Use your earlier response shown above."
    );
    out = out.replace(
      /retrieve your saved response and keep it available\.?/gi,
      "use your earlier response shown above."
    );
    out = out.replace(
      /Keep it available throughout\.?/gi,
      "Refer to it as you work through the activities."
    );
  }

  HANDOFF_MECHANICS_SENTENCE_PATTERNS.forEach(function (re) {
    out = out.replace(re, " ");
  });

  return out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}

function walkTextNodes(root, visit) {
  if (!root || typeof visit !== "function") return;
  var doc = root.ownerDocument || (typeof document !== "undefined" ? document : null);
  if (!doc || typeof doc.createTreeWalker !== "function") {
    // jsdom / limited environments: recurse element textContent children.
    function walk(node) {
      if (!node) return;
      if (node.nodeType === 3) {
        visit(node);
        return;
      }
      if (node.nodeType !== 1) return;
      var tag = String(node.tagName || "").toLowerCase();
      if (tag === "script" || tag === "style" || tag === "pre") return;
      if (node.getAttribute && node.getAttribute("data-lj-artefact-ref-host")) return;
      var child = node.firstChild;
      while (child) {
        var next = child.nextSibling;
        walk(child);
        child = next;
      }
    }
    walk(root);
    return;
  }
  var walker = doc.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */, null);
  var node = walker.nextNode();
  while (node) {
    var parent = node.parentNode;
    var skip = false;
    while (parent && parent !== root) {
      if (parent.nodeType === 1) {
        var tagName = String(parent.tagName || "").toLowerCase();
        if (
          tagName === "script" ||
          tagName === "style" ||
          tagName === "pre" ||
          (parent.getAttribute && parent.getAttribute("data-lj-artefact-ref-host"))
        ) {
          skip = true;
          break;
        }
      }
      parent = parent.parentNode;
    }
    var next = walker.nextNode();
    if (!skip) visit(node);
    node = next;
  }
}

/**
 * When a commission participates in an explicit artefact contract, neutralize
 * delivery-mechanics prose that contradicts automatic handoff (unified) while
 * leaving educational task wording intact.
 *
 * Standalone publishing does not call this with deliveryContext "unified".
 */
function applyContextualHandoffGuidance(root, options) {
  var opts = options && typeof options === "object" ? options : {};
  if (!root || !root.querySelector) {
    return { ok: false, reason: "missing-root", rewritten: 0 };
  }
  if (asText(opts.deliveryContext) !== "unified") {
    return { ok: true, rewritten: 0, skipped: "not-unified" };
  }

  var commissionId = asText(opts.commissionId);
  var refs = listReferencesForCommission(opts.contract, commissionId);
  var produces = listProducesForCommission(opts.contract, commissionId);
  if (!refs.length && !produces.length) {
    return { ok: true, rewritten: 0, skipped: "no-artefact-relationship" };
  }

  var rewritten = 0;
  walkTextNodes(root, function (textNode) {
    var before = String(textNode.nodeValue || "");
    if (!before || !/[A-Za-z]/.test(before)) return;
    if (
      !/transfer|retriev|save or copy|keep it available|retained response/i.test(before)
    ) {
      return;
    }
    var after = rewriteHandoffMechanicsText(before, {
      resolutions: opts.resolutions
    });
    if (after !== before.trim() && after !== before) {
      textNode.nodeValue = after;
      rewritten += 1;
    } else if (after !== before) {
      textNode.nodeValue = after;
      rewritten += 1;
    }
  });

  return {
    ok: true,
    rewritten: rewritten,
    consumer: refs.length > 0,
    producer: produces.length > 0
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
    var out = [];
    var evidence = sourcePage && sourcePage.assessment_evidence;
    var elicitations = evidence && Array.isArray(evidence.elicitations) ? evidence.elicitations : [];
    elicitations.forEach(function (el) {
      if (!el || typeof el !== "object") return;
      var kind = asText(el.delivery && el.delivery.kind).toLowerCase();
      if (kind !== "constructed_performance") return;
      var elicitationId = asText(el.elicitation_id || el.elicitationId || "response");
      var workspaceId = "assessment-constructed-" + elicitationId;
      var label =
        asText(el.delivery && el.delivery.response_workspace && el.delivery.response_workspace.intention) ||
        asText(el.evidence_ask) ||
        asText(el.delivery && el.delivery.prompt) ||
        "Learner constructed response";
      out.push({
        elicitationId: elicitationId,
        workspaceId: workspaceId,
        label: label
      });
    });
    return out;
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

  // Consumers that may reference an earlier Assessment Pack constructed artefact
  // when commission.dependencies explicitly names the producer. Order alone is not enough.
  var supportedArtefactConsumerProducts = {
    assessment_pack: true,
    interactive: true
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

  if (forcedProducer && forcedConsumer) {
    pairs.push({ producerId: forcedProducer, consumerId: forcedConsumer, source: "explicit" });
  } else {
    commissions.forEach(function (commission) {
      var consumerId = asText(commission && (commission.commission_id || commission.commissionId));
      if (!consumerId) return;
      var consumerProduct =
        resolveCommissionProductId(consumerId) ||
        asText(commission.product_id || commission.productId);
      if (!supportedArtefactConsumerProducts[consumerProduct]) return;
      referencedCommissionIds(commission).forEach(function (producerId) {
        var producerProduct = resolveCommissionProductId(producerId);
        // Producer must be an Assessment Pack — workspace ids come from constructed elicitations.
        if (producerProduct && producerProduct !== "assessment_pack") return;
        if (!producerProduct && !byCommission[producerId]) return;
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
          consumerProduct: consumerProduct
        });
      });
    });
  }

  if (!pairs.length) {
    gaps.push({
      code: "no_producer_consumer_pair",
      message:
        "No produce→reference pair could be derived from commission.dependencies. Supported consumers are Assessment Pack and Interactive when dependencies explicitly name an earlier Assessment Pack commission. Confirm stored dependencies name earlier commission ids, or pass producerCommissionId and consumerCommissionId explicitly."
    });
    return { ok: false, contract: { produces: [], references: [] }, gaps: gaps, pairs: pairs };
  }

  var produces = [];
  var references = [];

  pairs.forEach(function (pair) {
    var producer = byCommission[pair.producerId];
    var consumer = byCommission[pair.consumerId];
    if (!producer || !producer.sourcePage) {
      gaps.push({
        code: "missing_producer_source_page",
        commissionId: pair.producerId,
        message: "Producer commission lacks a hydrated sourcePage."
      });
      return;
    }
    if (!consumer) {
      gaps.push({
        code: "missing_consumer_constituent",
        commissionId: pair.consumerId,
        message: "Consumer commission is not among prepared constituents."
      });
      return;
    }
    var workspaces = constructedWorkspaces(producer.sourcePage);
    if (!workspaces.length) {
      gaps.push({
        code: "no_constructed_workspace",
        commissionId: pair.producerId,
        message:
          "Producer Assessment Pack has no constructed_performance elicitation from which to derive a workspaceId."
      });
      return;
    }
    // Prefer a single primary constructed workspace (first constructed elicitation).
    var primary = workspaces[0];
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
    var artefactId = pair.producerId + "." + primary.elicitationId;
    produces.push({
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

  var contract = normalizeArtefactContract({ produces: produces, references: references });
  if (Array.isArray(contract.conflicts) && contract.conflicts.length) {
    contract.conflicts.forEach(function (conflict) {
      gaps.push(conflict);
    });
  }
  return {
    ok: contract.produces.length > 0 && contract.references.length > 0,
    contract: {
      produces: contract.produces,
      references: contract.references
    },
    gaps: gaps,
    pairs: pairs,
    conflicts: contract.conflicts || []
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
  applyContextualHandoffGuidance: applyContextualHandoffGuidance,
  rewriteHandoffMechanicsText: rewriteHandoffMechanicsText,
  extractTextFromWorkspaceState: extractTextFromWorkspaceState,
  proposeArtefactContractFromLearningJourney: proposeArtefactContractFromLearningJourney
};
