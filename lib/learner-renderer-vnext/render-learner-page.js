"use strict";

var buildPageModel = require("./build-page-model").buildPageModel;
var renderPage = require("./render-page").renderPage;

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

function formatModelErrors(errors) {
  if (!Array.isArray(errors) || !errors.length) {
    return "Learner page model validation failed.";
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
 * @returns {{ html: string|null, error: string|null, modelResult: object }}
 */
function renderLearnerPageHtml(sourcePage) {
  var result = buildPageModel(sourcePage);
  if (!result.ok) {
    return {
      html: null,
      error: formatModelErrors(result.errors),
      modelResult: result
    };
  }
  return {
    html: renderPage(result.model),
    error: null,
    modelResult: result
  };
}

module.exports = {
  normalizeRendererVersion: normalizeRendererVersion,
  renderLearnerPageHtml: renderLearnerPageHtml
};
