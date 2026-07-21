"use strict";

/**
 * Browser registration entry for learner renderer vNext.
 * Bundled by scripts/build-learner-renderer-vnext-browser.js.
 */
var api = require("./render-learner-page");
var learnerIconRenderer = require("./learner-icon-renderer");
var learnerIconRegistry = require("./learner-icon-registry");

module.exports = Object.assign({}, api, {
  getLearnerIconPresentationCss: learnerIconRenderer.getLearnerIconPresentationCss,
  learnerIconRegistry: learnerIconRegistry
});
