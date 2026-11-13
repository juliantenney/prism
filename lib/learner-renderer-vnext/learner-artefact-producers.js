/**
 * Shared, product-family-independent discovery of explicitly declared
 * learner-authored artefacts that persist as constructed text.
 *
 * Draft storage remains page-private. Only declared producers may be exposed
 * through the artefact contract (Journal, cross-resource reference, etc.).
 */
"use strict";

var RESPONSE_KIND_CONSTRUCTED_TEXT = "constructed_text";
var WORKSPACE_PREFIX_LEARNER = "learner-constructed-";
var WORKSPACE_PREFIX_ASSESSMENT = "assessment-constructed-";

function asText(value) {
  return value == null ? "" : String(value).trim();
}

function constructedTextWorkspaceId(elicitationId) {
  var id = asText(elicitationId);
  return id ? WORKSPACE_PREFIX_LEARNER + id : "";
}

function assessmentConstructedWorkspaceId(elicitationId) {
  var id = asText(elicitationId);
  return id ? WORKSPACE_PREFIX_ASSESSMENT + id : "";
}

function isConstructedTextKind(value) {
  var kind = asText(value).toLowerCase();
  return !kind || kind === RESPONSE_KIND_CONSTRUCTED_TEXT;
}

function pushProducer(out, seen, row) {
  if (!row || typeof row !== "object") return;
  var elicitationId = asText(row.elicitationId || row.elicitation_id);
  var workspaceId = asText(row.workspaceId || row.workspace_id);
  if (!elicitationId || !workspaceId) return;
  if (seen[elicitationId]) return;
  seen[elicitationId] = true;
  out.push({
    elicitationId: elicitationId,
    workspaceId: workspaceId,
    label: asText(row.label) || "Learner constructed response",
    responseKind: RESPONSE_KIND_CONSTRUCTED_TEXT,
    source: asText(row.source) || "declared",
    prompt: asText(row.prompt)
  });
}

/**
 * Explicit page-level declarations (any product family).
 * Shape: learner_artefacts.produces[] with elicitation_id + response_kind constructed_text.
 */
function discoverDeclaredPageProducers(sourcePage) {
  var out = [];
  var seen = Object.create(null);
  var root =
    sourcePage &&
    sourcePage.learner_artefacts &&
    typeof sourcePage.learner_artefacts === "object" &&
    !Array.isArray(sourcePage.learner_artefacts)
      ? sourcePage.learner_artefacts
      : null;
  var rows = root && Array.isArray(root.produces) ? root.produces : [];
  rows.forEach(function (row) {
    if (!row || typeof row !== "object") return;
    if (!isConstructedTextKind(row.response_kind || row.responseKind)) return;
    var elicitationId = asText(row.elicitation_id || row.elicitationId);
    if (!elicitationId) return;
    var workspaceId =
      asText(row.workspace_id || row.workspaceId) || constructedTextWorkspaceId(elicitationId);
    pushProducer(out, seen, {
      elicitationId: elicitationId,
      workspaceId: workspaceId,
      label: asText(row.label) || asText(row.title) || "Learner constructed response",
      prompt: asText(row.prompt),
      source: "learner_artefacts"
    });
  });
  return out;
}

/**
 * Assessment Pack constructed_performance elicitations (existing contract).
 */
function discoverAssessmentPackProducers(sourcePage) {
  var out = [];
  var seen = Object.create(null);
  var evidence = sourcePage && sourcePage.assessment_evidence;
  var elicitations = evidence && Array.isArray(evidence.elicitations) ? evidence.elicitations : [];
  elicitations.forEach(function (el) {
    if (!el || typeof el !== "object") return;
    var kind = asText(el.delivery && el.delivery.kind).toLowerCase();
    if (kind !== "constructed_performance") return;
    var elicitationId = asText(el.elicitation_id || el.elicitationId || "response");
    if (!elicitationId) return;
    var prompt = el.delivery && el.delivery.prompt;
    var promptTitle =
      prompt && typeof prompt === "object" && !Array.isArray(prompt)
        ? asText(prompt.title)
        : "";
    var promptText =
      typeof prompt === "string"
        ? asText(prompt)
        : prompt && typeof prompt === "object"
          ? asText(prompt.task || prompt.body || prompt.text)
          : "";
    var contributionTitle = asText(
      el.artefact_contribution &&
        (el.artefact_contribution.artefact_title || el.artefact_contribution.title)
    );
    var label =
      promptTitle ||
      contributionTitle ||
      asText(el.journalable_display_label) ||
      "Learner constructed response";
    pushProducer(out, seen, {
      elicitationId: elicitationId,
      workspaceId: assessmentConstructedWorkspaceId(elicitationId),
      label: label,
      prompt: promptText,
      source: "assessment_constructed_performance"
    });
  });
  return out;
}

/**
 * Situated Task record entries explicitly marked as learner artefacts.
 */
function discoverSituatedRecordProducers(sourcePage) {
  var out = [];
  var seen = Object.create(null);
  var sl =
    sourcePage &&
    sourcePage.situated_learning &&
    typeof sourcePage.situated_learning === "object" &&
    !Array.isArray(sourcePage.situated_learning)
      ? sourcePage.situated_learning
      : null;
  var record = sl && sl.record && typeof sl.record === "object" && !Array.isArray(sl.record) ? sl.record : null;
  var entries = record && Array.isArray(record.entries) ? record.entries : [];
  entries.forEach(function (entry) {
    if (!entry || typeof entry !== "object") return;
    var artefact =
      entry.artefact && typeof entry.artefact === "object" && !Array.isArray(entry.artefact)
        ? entry.artefact
        : null;
    if (!artefact) return;
    if (!isConstructedTextKind(artefact.response_kind || artefact.responseKind)) return;
    var elicitationId = asText(
      artefact.elicitation_id || artefact.elicitationId || entry.entry_id || entry.entryId
    );
    if (!elicitationId) return;
    pushProducer(out, seen, {
      elicitationId: elicitationId,
      workspaceId: constructedTextWorkspaceId(elicitationId),
      label: asText(artefact.label) || asText(entry.label) || "Learner constructed response",
      prompt: asText(artefact.prompt) || asText(entry.prompt),
      source: "situated_record_artefact"
    });
  });
  return out;
}

/**
 * Interactive required_materials response_fulfilment bindings for text_compose.
 * Only when artefact_elicitation_id is explicitly declared.
 */
function discoverInteractiveFulfilmentProducers(sourcePage) {
  var out = [];
  var seen = Object.create(null);
  var activities = Array.isArray(sourcePage && sourcePage.activities) ? sourcePage.activities : [];
  activities.forEach(function (activity) {
    if (!activity || typeof activity !== "object") return;
    var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
    required.forEach(function (material) {
      if (!material || typeof material !== "object") return;
      var fulfilment =
        material.response_fulfilment &&
        typeof material.response_fulfilment === "object" &&
        !Array.isArray(material.response_fulfilment)
          ? material.response_fulfilment
          : null;
      if (!fulfilment) return;
      var elicitationId = asText(
        fulfilment.artefact_elicitation_id || fulfilment.artefactElicitationId
      );
      if (!elicitationId) return;
      var responseKind = asText(fulfilment.response_kind || fulfilment.responseKind).toLowerCase();
      if (responseKind && responseKind !== "text_compose" && responseKind !== RESPONSE_KIND_CONSTRUCTED_TEXT) {
        return;
      }
      if (!isConstructedTextKind(fulfilment.artefact_response_kind || fulfilment.artefactResponseKind)) {
        return;
      }
      pushProducer(out, seen, {
        elicitationId: elicitationId,
        workspaceId: constructedTextWorkspaceId(elicitationId),
        label:
          asText(fulfilment.artefact_label || fulfilment.artefactLabel) ||
          asText(material.title) ||
          "Learner constructed response",
        prompt: asText(fulfilment.artefact_prompt || fulfilment.artefactPrompt),
        source: "interactive_response_fulfilment"
      });
    });
  });
  return out;
}

/**
 * Discover all constructed-text artefact producers declared on a Design Page.
 * Order: explicit learner_artefacts, Assessment Pack elicitations, Situated
 * artefact entries, Interactive fulfilment bindings. First declaration wins
 * per elicitation_id.
 *
 * @param {object|null|undefined} sourcePage
 * @returns {Array<{elicitationId:string, workspaceId:string, label:string, responseKind:string, source:string, prompt:string}>}
 */
function discoverConstructedTextProducers(sourcePage) {
  var out = [];
  var seen = Object.create(null);
  if (!sourcePage || typeof sourcePage !== "object") return out;

  function merge(rows) {
    (Array.isArray(rows) ? rows : []).forEach(function (row) {
      pushProducer(out, seen, row);
    });
  }

  merge(discoverDeclaredPageProducers(sourcePage));
  merge(discoverAssessmentPackProducers(sourcePage));
  merge(discoverSituatedRecordProducers(sourcePage));
  merge(discoverInteractiveFulfilmentProducers(sourcePage));
  return out;
}

function findConstructedTextProducer(sourcePage, elicitationId) {
  var id = asText(elicitationId);
  if (!id) return null;
  var rows = discoverConstructedTextProducers(sourcePage);
  for (var i = 0; i < rows.length; i += 1) {
    if (rows[i].elicitationId === id) return rows[i];
  }
  return null;
}

var INLINE_BINDABLE_MATERIAL_TYPES = {
  template: true,
  prompt_set: true,
  task_card: true,
  transfer_prompt: true
};

/**
 * Elicitation ids already hosted inside an activity material surface via
 * response_fulfilment.artefact_elicitation_id (and a matching renderable
 * material). These must not also emit a page-level journey artefact region.
 *
 * @param {object|null|undefined} sourcePage
 * @returns {Object.<string, true>}
 */
function listInlineBoundArtefactElicitationIds(sourcePage) {
  var placed = Object.create(null);
  var activities = Array.isArray(sourcePage && sourcePage.activities) ? sourcePage.activities : [];
  activities.forEach(function (activity) {
    if (!activity || typeof activity !== "object") return;
    var materialIds = Object.create(null);
    var materials = Array.isArray(activity.materials) ? activity.materials : [];
    materials.forEach(function (material) {
      if (!material || typeof material !== "object") return;
      var materialId = asText(material.id || material.material_id || material.materialId);
      if (!materialId) return;
      var type = asText(material.type || material.material_type || material.materialType).toLowerCase();
      if (INLINE_BINDABLE_MATERIAL_TYPES[type]) materialIds[materialId] = true;
    });
    var required = Array.isArray(activity.required_materials) ? activity.required_materials : [];
    required.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var fulfilment =
        row.response_fulfilment &&
        typeof row.response_fulfilment === "object" &&
        !Array.isArray(row.response_fulfilment)
          ? row.response_fulfilment
          : null;
      if (!fulfilment) return;
      var elicitationId = asText(
        fulfilment.artefact_elicitation_id || fulfilment.artefactElicitationId
      );
      if (!elicitationId) return;
      var materialId = asText(row.material_id || row.materialId);
      if (!materialId || !materialIds[materialId]) return;
      placed[elicitationId] = true;
    });
  });
  return placed;
}

/**
 * Workspace requirements for page-level learner artefact producers that are
 * not already bound into an activity elicitation surface. Situated and
 * Assessment Pack render through their own pipelines.
 *
 * Placement rule: fulfilment-bound activity materials own the elicitation
 * point; page-level workspaces are only for genuinely unplaced producers
 * (declaration-only pages, or missing/ambiguous activity association).
 *
 * @param {object|null|undefined} sourcePage
 * @returns {import("./types").WorkspaceRequirement[]}
 */
function composeDeclaredLearnerArtefactWorkspaces(sourcePage) {
  var productId = asText(sourcePage && sourcePage.product_id).toLowerCase();
  // Assessment Pack and Situated Task already render their capture surfaces.
  if (productId === "assessment_pack" || productId === "situated_task") return [];
  if (sourcePage && sourcePage.assessment_evidence) return [];
  if (
    sourcePage &&
    sourcePage.situated_learning &&
    typeof sourcePage.situated_learning === "object" &&
    !Array.isArray(sourcePage.situated_learning)
  ) {
    return [];
  }

  var producers = discoverDeclaredPageProducers(sourcePage);
  var fulfilmentProducers = discoverInteractiveFulfilmentProducers(sourcePage);
  var inlineBound = listInlineBoundArtefactElicitationIds(sourcePage);
  var seen = Object.create(null);
  var rows = [];

  function consider(row) {
    if (!row || !row.elicitationId) return;
    if (inlineBound[row.elicitationId]) return;
    if (seen[row.elicitationId]) return;
    seen[row.elicitationId] = true;
    rows.push(row);
  }

  producers.forEach(consider);
  // Fulfilment-only declarations still need a capturable surface when their
  // bound material is absent from activity.materials (generation gap).
  fulfilmentProducers.forEach(consider);

  return rows.map(function (row, index) {
    return {
      mode: "inline",
      capability: "text_entry",
      sourceStepNumber: index + 1,
      instruction: row.prompt || row.label,
      responseLabel: row.label || "Record your response",
      prompt: row.prompt || "",
      responsePartId: row.elicitationId,
      sourceKind: "learner_artefact",
      sourceId: row.elicitationId,
      order: index + 1,
      rows: 8,
      persistenceAvailable: true,
      guidance: "Your draft is saved on this device when possible. It is not submitted.",
      workspaceId: row.workspaceId,
      artefactElicitationId: row.elicitationId
    };
  });
}

/**
 * @param {object|null|undefined} sourcePage
 * @returns {{ workspaces: import("./types").WorkspaceRequirement[], placement: "page-level"|"unplaced-fallback"|"none", diagnostics: object[] }}
 */
function composeDeclaredLearnerArtefactPlacement(sourcePage) {
  var workspaces = composeDeclaredLearnerArtefactWorkspaces(sourcePage);
  if (!workspaces.length) {
    return { workspaces: [], placement: "none", diagnostics: [] };
  }
  var activities = Array.isArray(sourcePage && sourcePage.activities) ? sourcePage.activities : [];
  var hasActivities = activities.some(function (activity) {
    return activity && typeof activity === "object";
  });
  if (!hasActivities) {
    return { workspaces: workspaces, placement: "page-level", diagnostics: [] };
  }
  var diagnostics = workspaces.map(function (workspace) {
    return {
      code: "LEARNER_ARTEFACT_UNPLACED_FALLBACK",
      message:
        "Learner artefact elicitation " +
        String(workspace.artefactElicitationId || workspace.responsePartId || "") +
        " is declared but not bound to an activity material via response_fulfilment.artefact_elicitation_id; rendering after the activity sequence.",
      elicitationId: String(workspace.artefactElicitationId || workspace.responsePartId || "")
    };
  });
  return {
    workspaces: workspaces,
    placement: "unplaced-fallback",
    diagnostics: diagnostics
  };
}

module.exports = {
  RESPONSE_KIND_CONSTRUCTED_TEXT: RESPONSE_KIND_CONSTRUCTED_TEXT,
  WORKSPACE_PREFIX_LEARNER: WORKSPACE_PREFIX_LEARNER,
  WORKSPACE_PREFIX_ASSESSMENT: WORKSPACE_PREFIX_ASSESSMENT,
  constructedTextWorkspaceId: constructedTextWorkspaceId,
  assessmentConstructedWorkspaceId: assessmentConstructedWorkspaceId,
  discoverConstructedTextProducers: discoverConstructedTextProducers,
  discoverDeclaredPageProducers: discoverDeclaredPageProducers,
  discoverAssessmentPackProducers: discoverAssessmentPackProducers,
  discoverSituatedRecordProducers: discoverSituatedRecordProducers,
  discoverInteractiveFulfilmentProducers: discoverInteractiveFulfilmentProducers,
  findConstructedTextProducer: findConstructedTextProducer,
  listInlineBoundArtefactElicitationIds: listInlineBoundArtefactElicitationIds,
  composeDeclaredLearnerArtefactWorkspaces: composeDeclaredLearnerArtefactWorkspaces,
  composeDeclaredLearnerArtefactPlacement: composeDeclaredLearnerArtefactPlacement
};
