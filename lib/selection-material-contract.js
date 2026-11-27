/**
 * Practice selection materials: structured sibling `selection` payload contract,
 * packaging/authoring validation, and deterministic markdown→structured repair.
 *
 * Renderer expects selection.{form,prompt,options|left/right[,correct_*]}.
 * Markdown-only "Form: single_select" bodies are invalid for publication.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_SELECTION_MATERIAL_CONTRACT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "SELECTION-MATERIAL-CONTRACT";
  var CONTRACT_VERSION = "101E-SELECTION-PAYLOAD-V1";

  function getNormalizeSelectionModule() {
    if (typeof require === "function") {
      try {
        return require("./learner-renderer-vnext/normalize-selection.js");
      } catch (_err) {}
    }
    if (typeof globalThis !== "undefined" && globalThis.PRISM_NORMALIZE_SELECTION) {
      return globalThis.PRISM_NORMALIZE_SELECTION;
    }
    return null;
  }

  function getNormalizeSelectionSemantics() {
    var mod = getNormalizeSelectionModule();
    return mod && typeof mod.normalizeSelectionSemantics === "function"
      ? mod.normalizeSelectionSemantics
      : null;
  }

  function getExpandFlattenedSingleSelect() {
    var mod = getNormalizeSelectionModule();
    return mod && typeof mod.expandFlattenedSingleSelectSelection === "function"
      ? mod.expandFlattenedSingleSelectSelection
      : null;
  }

  /**
   * Expand one selection material that flattened several decisions into one options[].
   * Returns [material] when no split is required.
   */
  function expandSelectionMaterialDecisions(material) {
    if (!material || typeof material !== "object") return [material];
    if (!hasStructuredSelection(material)) return [material];
    // Explicit clusters are consumed item-by-item at composition time; the material
    // is never manufactured into several materials.
    if (isSelectionCluster(material.selection)) return [material];
    var expand = getExpandFlattenedSingleSelect();
    if (!expand) return [material];
    var rows = expand(material.selection);
    if (!Array.isArray(rows) || rows.length < 2) return [material];
    var baseId = String(material.material_id || material.id || "selection").trim() || "selection";
    return rows.map(function (selectionRow, index) {
      var stem = String((selectionRow && (selectionRow.label || selectionRow.prompt)) || "").trim();
      return Object.assign({}, material, {
        material_id: baseId + "-q" + String(index + 1),
        id: baseId + "-q" + String(index + 1),
        title: stem || String(material.title || "").trim() || "Question " + String(index + 1),
        selection: selectionRow,
        body: stem || material.body
      });
    });
  }

  function isSelectionMaterialType(value) {
    return String(value == null ? "" : value)
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_") === "selection";
  }

  function hasStructuredSelection(material) {
    return !!(material && material.selection && typeof material.selection === "object");
  }

  /** True when the selection carries an explicit items[] cluster (or declares contract v2). */
  function isSelectionCluster(selection) {
    var mod = getNormalizeSelectionModule();
    if (!mod || !selection || typeof selection !== "object") return false;
    return mod.hasSelectionItems(selection) || mod.isStrictSelectionCluster(selection);
  }

  function itemFormOf(mod, item, clusterSelection) {
    var raw = (item && (item.form || item.surfaceKind || item.item_type)) || clusterSelection.form || "";
    return mod.resolveForm(raw);
  }

  var RESPONSE_ITEM_ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
  var RESPONSE_ITEM_FORMS = ["single_select", "multi_select", "matching"];

  /**
   * DLA declaration check for a required_materials[] row (selection cluster contract v2).
   * Every selection_choose row must declare contract_version 2 and the response_items[]
   * { item_id, form } it owes; other response kinds must not carry them.
   * Pushes human-readable errors; no prose is inspected.
   */
  function validateDlaSelectionResponseFulfilment(requiredRow, rowPath, errors) {
    var mod = getNormalizeSelectionModule();
    var rf = requiredRow && requiredRow.response_fulfilment;
    if (!rf || typeof rf !== "object" || Array.isArray(rf)) return;
    var version = mod ? mod.SELECTION_CLUSTER_CONTRACT_VERSION : 2;
    var path = rowPath + ".response_fulfilment";
    var isSelection = String(rf.response_kind || "").trim() === "selection_choose";
    var hasItems = Object.prototype.hasOwnProperty.call(rf, "response_items");
    var hasVersion = Object.prototype.hasOwnProperty.call(rf, "contract_version");
    if (!isSelection) {
      if (hasItems) errors.push(path + ".response_items is only valid for response_kind selection_choose");
      if (hasVersion) errors.push(path + ".contract_version is only valid for response_kind selection_choose");
      return;
    }
    // Legacy compatibility: stored captures carry no declaration. The DLA prompt contract
    // requires it for newly authored selection_choose rows; the validator checks the
    // declaration whenever one is present but never retrofits it onto legacy rows.
    if (!hasVersion && !hasItems) return;
    if (!hasVersion || Number(rf.contract_version) !== version) {
      errors.push(
        path + ".contract_version must be " + version + " when response_items are declared (selection cluster contract)"
      );
    }
    if (!Array.isArray(rf.response_items) || !rf.response_items.length) {
      errors.push(path + ".response_items must be a non-empty array of { item_id, form } for selection_choose");
      return;
    }
    var seen = {};
    rf.response_items.forEach(function (item, index) {
      var itemPath = path + ".response_items[" + index + "]";
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        errors.push(itemPath + " must be an object { item_id, form }");
        return;
      }
      Object.keys(item).forEach(function (key) {
        if (key !== "item_id" && key !== "form") {
          errors.push(itemPath + ' has unsupported key "' + key + '" (allowed: item_id, form)');
        }
      });
      var id = typeof item.item_id === "string" ? item.item_id.trim() : "";
      if (!id || !RESPONSE_ITEM_ID_RE.test(id)) {
        errors.push(itemPath + ".item_id must be a stable identifier (letters, digits, _ or -)");
      } else {
        var slug = id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (seen[slug]) errors.push(itemPath + ".item_id duplicates another response item (" + id + ")");
        seen[slug] = true;
      }
      if (RESPONSE_ITEM_FORMS.indexOf(String(item.form || "")) === -1) {
        errors.push(itemPath + ".form must be single_select, multi_select or matching");
      }
    });
  }

  /**
   * Structural correspondence between a DLA-commissioned row and its GAM material.
   * Applies only when the DLA row explicitly declares selection cluster contract v2;
   * identity (item_id) and form are compared, never prose.
   *
   * @returns {object[]} diagnostics
   */
  function validateSelectionClusterCorrespondence(requiredRow, material) {
    var mod = getNormalizeSelectionModule();
    var diagnostics = [];
    var rf = requiredRow && requiredRow.response_fulfilment;
    if (!mod || !rf || typeof rf !== "object") return diagnostics;
    if (Number(rf.contract_version) !== mod.SELECTION_CLUSTER_CONTRACT_VERSION) return diagnostics;
    if (!Array.isArray(rf.response_items)) return diagnostics;
    var mid = String((material && material.material_id) || (requiredRow && requiredRow.material_id) || "");
    var selection = material && material.selection && typeof material.selection === "object" ? material.selection : null;
    var strict = !!selection && mod.isStrictSelectionCluster(selection);
    var rawItems = selection && Array.isArray(selection.items) ? selection.items : [];
    var authored = {};
    rawItems.forEach(function (item) {
      var id = item && typeof item === "object" ? String(item.item_id == null ? "" : item.item_id).trim() : "";
      if (id) authored[id] = item;
    });
    if (!strict) {
      diagnostics.push({
        code: "SELECTION_CLUSTER_CONTRACT_REQUIRED",
        message:
          "DLA declares selection cluster contract v2 for " +
          mid +
          "; the selection must set contract_version: " +
          mod.SELECTION_CLUSTER_CONTRACT_VERSION +
          " and author selection.items[].",
        materialId: mid
      });
    }
    var declared = {};
    rf.response_items.forEach(function (declaredItem) {
      var id = String((declaredItem && declaredItem.item_id) || "").trim();
      if (!id) return;
      declared[id] = declaredItem;
      if (!authored[id]) {
        diagnostics.push({
          code: "SELECTION_RESPONSE_ITEM_MISSING",
          message:
            "DLA-declared response item \"" + id + "\" has no selection.items[] entry in " + mid + ".",
          materialId: mid,
          itemId: id
        });
        return;
      }
      var declaredForm = mod.resolveForm(declaredItem.form || "");
      var actualForm = itemFormOf(mod, authored[id], selection);
      if (declaredForm && actualForm && declaredForm !== actualForm) {
        diagnostics.push({
          code: "SELECTION_RESPONSE_ITEM_FORM_MISMATCH",
          message:
            "Response item \"" + id + "\" is declared " + declaredForm + " but authored as " + actualForm + ".",
          materialId: mid,
          itemId: id
        });
      }
    });
    Object.keys(authored).forEach(function (id) {
      if (declared[id]) return;
      diagnostics.push({
        code: "SELECTION_RESPONSE_ITEM_UNDECLARED",
        message:
          "selection.items[] entry \"" + id + "\" in " + mid + " is not declared in the DLA response_items.",
        materialId: mid,
        itemId: id
      });
    });
    return diagnostics;
  }

  /**
   * All structural diagnostics for one selection material (cluster-aware).
   * `requiredRow` (optional) is the DLA-commissioned row for the same material_id.
   *
   * @returns {object[]}
   */
  function selectionMaterialDiagnostics(material, requiredRow) {
    var mod = getNormalizeSelectionModule();
    var mid = String((material && material.material_id) || "");
    if (!mod) return [];
    var selection = material && material.selection;
    if (selection && typeof selection === "object" && isSelectionCluster(selection)) {
      var cluster = mod.resolveSelectionCluster(selection, { materialId: mid });
      return (cluster.diagnostics || []).concat(
        validateSelectionClusterCorrespondence(requiredRow, material)
      );
    }
    var normalize = getNormalizeSelectionSemantics();
    var out = [];
    if (normalize && selection && typeof selection === "object") {
      var result = normalize(
        { selection: selection, title: material.title, body: material.body },
        { materialId: mid }
      );
      if (!result.ok) out = (result.diagnostics || []).slice();
    }
    return out.concat(validateSelectionClusterCorrespondence(requiredRow, material));
  }

  /**
   * Parse GAM markdown-only selection bodies (C3 failure shape) into a structured
   * selection object. Does not mutate; returns null when the body is not repairable.
   *
   * @param {string} body
   * @returns {{ selection: object, body: string }|null}
   */
  function hydrateSelectionFromMarkdownBody(body) {
    var text = String(body == null ? "" : body).replace(/\r\n/g, "\n").trim();
    if (!text) return null;

    var formMatch = text.match(/\bForm:\s*(single_select|multi_select|matching)\b/i);
    if (!formMatch) return null;
    var form = String(formMatch[1]).toLowerCase();

    var detailsMatch = text.match(/<details[\s\S]*?<\/details>/i);
    var detailsBlock = detailsMatch ? detailsMatch[0] : "";
    var withoutDetails = detailsMatch ? text.slice(0, detailsMatch.index).trim() : text;

    var optionLines = [];
    var optionRe = /^[-*]\s*(?:([A-Za-z0-9]+)[.)]\s*)?(.+?)\s*$/gm;
    var m;
    while ((m = optionRe.exec(withoutDetails)) !== null) {
      var key = String(m[1] || "").trim();
      var label = String(m[2] || "").trim();
      if (!label) continue;
      if (!key) key = label;
      optionLines.push({ key: key, text: label });
    }
    if (form !== "matching" && optionLines.length < 2) return null;

    var promptSource = withoutDetails
      .replace(/\bForm:\s*(single_select|multi_select|matching)\b[^\n]*/gi, "")
      .replace(/^[-*]\s*(?:[A-Za-z0-9]+[.)]\s*)?.+$/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (!promptSource) promptSource = "Choose one response.";

    var correctAnswer = "";
    var feedback = "";
    if (detailsBlock) {
      var correctMatch = detailsBlock.match(
        /Correct answer:\s*([A-Za-z0-9]+)(?:[.)]\s*([^\n<]+))?/i
      );
      if (correctMatch) {
        correctAnswer = String(correctMatch[1] || "").trim();
      }
      var afterCorrect = detailsBlock
        .replace(/<summary[\s\S]*?<\/summary>/i, "")
        .replace(/Correct answer:\s*[^\n<]+/i, "")
        .replace(/<\/?details[^>]*>/gi, "")
        .trim();
      feedback = afterCorrect;
    }

    var selection = {
      form: form,
      prompt: promptSource,
      options: optionLines
    };
    if (correctAnswer) selection.correct_answer = correctAnswer;
    if (feedback) selection.feedback = feedback;

    return {
      selection: selection,
      body: promptSource
    };
  }

  /**
   * Attach a structured selection payload to a material when missing but recoverable.
   * @param {object} material
   * @returns {{ ok: boolean, material: object, repaired: boolean, error?: string }}
   */
  function repairSelectionMaterial(material) {
    if (!material || typeof material !== "object") {
      return { ok: false, material: material, repaired: false, error: "material required" };
    }
    if (!isSelectionMaterialType(material.material_type || material.type)) {
      return { ok: true, material: material, repaired: false };
    }
    if (hasStructuredSelection(material) && isSelectionCluster(material.selection)) {
      var clusterDiagnostics = selectionMaterialDiagnostics(material, null);
      if (!clusterDiagnostics.length) return { ok: true, material: material, repaired: false };
      return {
        ok: false,
        material: material,
        repaired: false,
        error:
          "Selection cluster " +
          String(material.material_id || "?") +
          " is invalid: " +
          String((clusterDiagnostics[0] && clusterDiagnostics[0].message) || "invalid cluster")
      };
    }
    if (hasStructuredSelection(material)) {
      var normalize = getNormalizeSelectionSemantics();
      if (normalize) {
        var existing = normalize(
          { selection: material.selection, title: material.title },
          { materialId: String(material.material_id || "") }
        );
        if (existing.ok) return { ok: true, material: material, repaired: false };
      }
    }

    var hydrated = hydrateSelectionFromMarkdownBody(material.body);
    if (!hydrated) {
      return {
        ok: false,
        material: material,
        repaired: false,
        error:
          "Selection material " +
          String(material.material_id || "?") +
          " lacks a structured selection object and Markdown body is not repairable."
      };
    }

    var next = Object.assign({}, material, {
      selection: hydrated.selection,
      body: hydrated.body,
      body_format: material.body_format || "markdown"
    });
    var normalizeFn = getNormalizeSelectionSemantics();
    if (normalizeFn) {
      var check = normalizeFn(
        { selection: next.selection, title: next.title },
        { materialId: String(next.material_id || "") }
      );
      if (!check.ok) {
        var diag =
          (check.diagnostics && check.diagnostics[0] && check.diagnostics[0].message) ||
          "hydrated selection failed validation";
        return { ok: false, material: material, repaired: false, error: diag };
      }
    }
    return { ok: true, material: next, repaired: true };
  }

  /**
   * Deep-clone repair of all selection materials on a page (activities[].materials[]).
   * @param {object} page
   * @returns {{ ok: boolean, page: object, repairedIds: string[], errors: string[] }}
   */
  function repairPageSelectionMaterials(page) {
    if (!page || typeof page !== "object") {
      return { ok: false, page: page, repairedIds: [], errors: ["page required"] };
    }
    var out = JSON.parse(JSON.stringify(page));
    var repairedIds = [];
    var errors = [];
    (out.activities || []).forEach(function (activity) {
      if (!activity || !Array.isArray(activity.materials)) return;
      var nextMaterials = [];
      activity.materials.forEach(function (material) {
        if (!isSelectionMaterialType(material && material.material_type)) {
          nextMaterials.push(material);
          return;
        }
        var result = repairSelectionMaterial(material);
        if (!result.ok) {
          errors.push(result.error || "selection repair failed");
          nextMaterials.push(material);
          return;
        }
        if (result.repaired) repairedIds.push(String(material.material_id || ""));
        var expanded = expandSelectionMaterialDecisions(result.material);
        if (expanded.length > 1) {
          repairedIds.push(String(material.material_id || ""));
        }
        nextMaterials = nextMaterials.concat(expanded);
      });
      activity.materials = nextMaterials;
    });
    return { ok: errors.length === 0, page: out, repairedIds: repairedIds, errors: errors };
  }

  /**
   * Authoring/packaging diagnostics for selection materials.
   * @param {object} page
   * @returns {{ ok: boolean, errors: string[], diagnostics: object[] }}
   */
  function validatePageSelectionMaterials(page) {
    var errors = [];
    var diagnostics = [];
    var normalize = getNormalizeSelectionSemantics();
    (page && page.activities ? page.activities : []).forEach(function (activity, aIndex) {
      if (!activity || !Array.isArray(activity.materials)) return;
      activity.materials.forEach(function (material, mIndex) {
        if (!isSelectionMaterialType(material && material.material_type)) return;
        var mid = String((material && material.material_id) || "");
        var path =
          "activities[" + aIndex + "].materials[" + mIndex + "]" + (mid ? " (" + mid + ")" : "");
        if (!hasStructuredSelection(material)) {
          var msg =
            path +
            ": GAM-SEL-01 selection materials require a sibling selection object " +
            "{ form: single_select|multi_select|matching, prompt, options[] } " +
            '(or left/right for matching). Do not encode the interactive form only as Markdown "Form:" prose.';
          errors.push(msg);
          diagnostics.push({
            code: "GAM-SEL-01",
            message: msg,
            materialId: mid,
            activityId: String((activity && activity.activity_id) || "")
          });
          return;
        }
        if (!normalize) return;
        // Cluster-aware: every authored item must be independently valid, and (only when
        // DLA declared contract v2) item identity must correspond to the declaration.
        // Legacy captures without declarations are never rejected for lacking them.
        selectionMaterialDiagnostics(material, requiredRowFor(activity, mid)).forEach(function (d) {
          var line =
            path +
            ": " +
            String((d && d.code) || "SELECTION_INVALID") +
            " — " +
            String((d && d.message) || "invalid selection payload");
          errors.push(line);
          diagnostics.push(
            Object.assign({}, d || {}, {
              materialId: mid,
              activityId: String((activity && activity.activity_id) || "")
            })
          );
        });
      });
    });
    return { ok: errors.length === 0, errors: errors, diagnostics: diagnostics };
  }

  function requiredRowFor(activity, materialId) {
    var rows = activity && Array.isArray(activity.required_materials) ? activity.required_materials : [];
    for (var i = 0; i < rows.length; i += 1) {
      if (rows[i] && String(rows[i].material_id || "") === String(materialId || "")) return rows[i];
    }
    return null;
  }

  function formatSelectionMaterialError(material, activityIndex, materialIndex, diagnostic) {
    var mid = String((material && material.material_id) || "");
    var path =
      "activities[" +
      activityIndex +
      "].materials[" +
      materialIndex +
      "]" +
      (mid ? " (" + mid + ")" : "");
    if (!diagnostic) {
      return (
        path +
        ": GAM-SEL-01 selection materials require a sibling selection object " +
        "{ form, prompt, options|left/right }."
      );
    }
    return (
      path +
      ": " +
      String(diagnostic.code || "SELECTION_INVALID") +
      " — " +
      String(diagnostic.message || "invalid selection payload")
    );
  }

  /**
   * Push GAM enrich validation errors for one material row.
   */
  function pushSelectionMaterialErrors(material, activityIndex, materialIndex, errors, requiredRow) {
    if (!isSelectionMaterialType(material && material.material_type)) return;
    if (!hasStructuredSelection(material)) {
      errors.push(formatSelectionMaterialError(material, activityIndex, materialIndex, null));
      return;
    }
    if (!getNormalizeSelectionSemantics()) return;
    selectionMaterialDiagnostics(material, requiredRow || null).forEach(function (d) {
      errors.push(formatSelectionMaterialError(material, activityIndex, materialIndex, d));
    });
  }

  return {
    MODULE_ID: MODULE_ID,
    CONTRACT_VERSION: CONTRACT_VERSION,
    isSelectionMaterialType: isSelectionMaterialType,
    hasStructuredSelection: hasStructuredSelection,
    hydrateSelectionFromMarkdownBody: hydrateSelectionFromMarkdownBody,
    expandSelectionMaterialDecisions: expandSelectionMaterialDecisions,
    repairSelectionMaterial: repairSelectionMaterial,
    repairPageSelectionMaterials: repairPageSelectionMaterials,
    validatePageSelectionMaterials: validatePageSelectionMaterials,
    pushSelectionMaterialErrors: pushSelectionMaterialErrors,
    isSelectionCluster: isSelectionCluster,
    selectionMaterialDiagnostics: selectionMaterialDiagnostics,
    validateSelectionClusterCorrespondence: validateSelectionClusterCorrespondence,
    validateDlaSelectionResponseFulfilment: validateDlaSelectionResponseFulfilment
  };
});
