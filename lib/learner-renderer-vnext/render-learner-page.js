"use strict";

var buildPageModel = require("./build-page-model").buildPageModel;
var buildComposedPageModel =
  require("./compose-page-model").buildComposedPageModel;
var buildActivityCompositionMap =
  require("./compose-page-model").buildActivityCompositionMap;
var renderPage = require("./render-page").renderPage;
var DEFAULT_COMPOSITION_MODE =
  require("./composition-config").DEFAULT_COMPOSITION_MODE;
var formatGroupedModelErrors =
  require("./archetype-diagnostics").formatGroupedModelErrors;
var buildLearnerDraftPageIdentity =
  require("./learner-draft-page-key").buildLearnerDraftPageIdentity;
var selectionMaterialContract = require("../selection-material-contract.js");
var svgStimulusSecurity = require("../svg-stimulus-security.js");

/**
 * Resolve the learner renderer version from an options value.
 * Sole renderer is vNext (S74A-D02 / S74A-T-045); only "vnext" (or empty) is accepted.
 * @returns {"vnext"}
 */
function normalizeRendererVersion(value) {
  if (value == null || value === "") return "vnext";
  var version = String(value).trim();
  if (version === "vnext") return "vnext";
  throw new Error("Unsupported learner renderer version: " + version);
}

/**
 * Resolve composition mode. Default is composed moments rendering.
 * @returns {"beats"|"moments"}
 */
function normalizeCompositionMode(value) {
  if (value == null || value === "") {
    return DEFAULT_COMPOSITION_MODE;
  }
  if (value === "beats") return "beats";
  if (value === "moments") return "moments";
  throw new Error("Unsupported learner composition mode: " + value);
}

function formatModelErrors(errors, diagnostics) {
  if (!Array.isArray(errors) || !errors.length) {
    return "Learner page model validation failed.";
  }
  if (diagnostics && Array.isArray(diagnostics.archetypeInspection)) {
    return formatGroupedModelErrors(errors, diagnostics.archetypeInspection);
  }
  return errors
    .map(function (err) {
      if (!err || typeof err !== "object") return String(err);
      var path = err.path != null && String(err.path).trim() ? String(err.path).trim() + ": " : "";
      var message = err.message != null ? String(err.message) : String(err);
      return path + message;
    })
    .join("; ");
}

/**
 * Build and validate the canonical vNext page model, then render HTML.
 * Does not invoke the legacy renderer or fall back on validation failure.
 *
 * @param {object} sourcePage
 * @param {{ compositionMode?: "beats"|"moments", activityIds?: string[], visualAssets?: object|null }=} options
 * @returns {{ html: string|null, error: string|null, modelResult: object, composedResult?: object }}
 */
function renderLearnerPageHtml(sourcePage, options) {
  var opts = options && typeof options === "object" ? options : {};
  // Fail closed before packaging/publication: invalid selection materials must not
  // become learner-facing "Selection form must be…" notes.
  if (opts.allowInvalidSelection !== true) {
    var selectionGate =
      selectionMaterialContract &&
      typeof selectionMaterialContract.validatePageSelectionMaterials === "function"
        ? selectionMaterialContract.validatePageSelectionMaterials(sourcePage)
        : { ok: true, errors: [] };
    if (!selectionGate.ok) {
      return {
        html: null,
        error: (selectionGate.errors || []).join("; "),
        modelResult: { ok: false, errors: selectionGate.errors, diagnostics: selectionGate.diagnostics }
      };
    }
  }
  var svgGate =
    svgStimulusSecurity && typeof svgStimulusSecurity.validatePageInlineSvgStimuli === "function"
      ? svgStimulusSecurity.validatePageInlineSvgStimuli(sourcePage)
      : { ok: true, errors: [], diagnostics: [] };
  if (!svgGate.ok) {
    return {
      html: null,
      error: (svgGate.errors || []).join("; "),
      modelResult: { ok: false, errors: svgGate.errors, diagnostics: svgGate.diagnostics }
    };
  }
  var result = buildPageModel(sourcePage);
  if (!result.ok) {
    return {
      html: null,
      error: formatModelErrors(result.errors, result.diagnostics),
      modelResult: result
    };
  }

  var compositionMode = normalizeCompositionMode(opts.compositionMode);
  var renderOptions = {
    persistenceIdentity: buildLearnerDraftPageIdentity(sourcePage),
    visualAssets: opts.visualAssets || null,
    sourcePage: sourcePage,
    rootTag: opts.rootTag,
    includeRuntimeScripts: opts.includeRuntimeScripts,
    anchorDiagnostics: []
  };

  if (compositionMode === "moments") {
    var composedResult = buildComposedPageModel(result, sourcePage, opts);
    if (!composedResult.ok) {
      return {
        html: null,
        error: formatModelErrors(composedResult.errors, result.diagnostics),
        modelResult: result,
        composedResult: composedResult
      };
    }
    renderOptions.composed = composedResult.composed;
    renderOptions.activityComposition = buildActivityCompositionMap(
      composedResult.composed
    );
    renderOptions.compositionMode = compositionMode;
    renderOptions.compositionDiagnostics = composedResult.diagnostics || null;
    var momentsHtml = renderPage(result.model, renderOptions);
    if (renderOptions.anchorDiagnostics.length && Array.isArray(result.warnings)) {
      renderOptions.anchorDiagnostics.forEach(function (diag) {
        result.warnings.push(diag);
      });
    }
    return {
      html: momentsHtml,
      error: null,
      modelResult: result,
      composedResult: composedResult,
      visualAssetDiagnostics: renderOptions.visualAssetDiagnostics || null,
      anchorDiagnostics: renderOptions.anchorDiagnostics.slice()
    };
  }

  var beatsHtml = renderPage(result.model, renderOptions);
  if (renderOptions.anchorDiagnostics.length && Array.isArray(result.warnings)) {
    renderOptions.anchorDiagnostics.forEach(function (diag) {
      result.warnings.push(diag);
    });
  }
  return {
    html: beatsHtml,
    error: null,
    modelResult: result,
    visualAssetDiagnostics: renderOptions.visualAssetDiagnostics || null,
    anchorDiagnostics: renderOptions.anchorDiagnostics.slice()
  };
}

module.exports = {
  DEFAULT_COMPOSITION_MODE: DEFAULT_COMPOSITION_MODE,
  normalizeRendererVersion: normalizeRendererVersion,
  normalizeCompositionMode: normalizeCompositionMode,
  formatModelErrors: formatModelErrors,
  renderLearnerPageHtml: renderLearnerPageHtml
};
