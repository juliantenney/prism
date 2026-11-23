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
        var result = normalize(
          { selection: material.selection, title: material.title, body: material.body },
          { materialId: mid }
        );
        if (result.ok) return;
        (result.diagnostics || []).forEach(function (d) {
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
  function pushSelectionMaterialErrors(material, activityIndex, materialIndex, errors) {
    if (!isSelectionMaterialType(material && material.material_type)) return;
    if (!hasStructuredSelection(material)) {
      errors.push(formatSelectionMaterialError(material, activityIndex, materialIndex, null));
      return;
    }
    var normalize = getNormalizeSelectionSemantics();
    if (!normalize) return;
    var result = normalize(
      { selection: material.selection, title: material.title, body: material.body },
      { materialId: String((material && material.material_id) || "") }
    );
    if (result.ok) return;
    (result.diagnostics || [{ code: "SELECTION_INVALID", message: "invalid selection" }]).forEach(
      function (d) {
        errors.push(formatSelectionMaterialError(material, activityIndex, materialIndex, d));
      }
    );
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
    pushSelectionMaterialErrors: pushSelectionMaterialErrors
  };
});
