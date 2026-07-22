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

/**
 * Resolve the learner renderer version from an options value.
 * Default is vnext; only "legacy" and "vnext" are supported.
 * @returns {"legacy" | "vnext"}
 */
function normalizeRendererVersion(value) {
  if (value == null || value === "") return "vnext";
  var version = String(value).trim();
  if (version === "legacy") return "legacy";
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
      return err && err.message ? String(err.message) : String(err);
    })
    .join("; ");
}

/**
 * Build and validate the canonical vNext page model, then render HTML.
 * Does not invoke the legacy renderer or fall back on validation failure.
 *
 * @param {object} sourcePage
 * @param {{ compositionMode?: "beats"|"moments", activityIds?: string[] }=} options
 * @returns {{ html: string|null, error: string|null, modelResult: object, composedResult?: object }}
 */
function renderLearnerPageHtml(sourcePage, options) {
  var opts = options && typeof options === "object" ? options : {};
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
    persistenceIdentity: buildLearnerDraftPageIdentity(sourcePage)
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
    return {
      html: renderPage(result.model, renderOptions),
      error: null,
      modelResult: result,
      composedResult: composedResult
    };
  }

  return {
    html: renderPage(result.model, renderOptions),
    error: null,
    modelResult: result
  };
}

module.exports = {
  DEFAULT_COMPOSITION_MODE: DEFAULT_COMPOSITION_MODE,
  normalizeRendererVersion: normalizeRendererVersion,
  normalizeCompositionMode: normalizeCompositionMode,
  renderLearnerPageHtml: renderLearnerPageHtml
};
