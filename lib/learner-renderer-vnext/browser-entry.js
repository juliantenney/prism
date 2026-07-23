"use strict";

/**
 * Browser registration entry for learner renderer vNext.
 * Bundled by scripts/build-learner-renderer-vnext-browser.js.
 */
var api = require("./render-learner-page");
var learnerIconRenderer = require("./learner-icon-renderer");
var learnerIconRegistry = require("./learner-icon-registry");
var learnerDraftPageKey = require("./learner-draft-page-key");
var attachLearnerPageIdentityFromWorkflow =
  learnerDraftPageKey.attachLearnerPageIdentityFromWorkflow;
var buildLearnerDraftPageIdentity = learnerDraftPageKey.buildLearnerDraftPageIdentity;
var initializeLearnerDraftPersistence =
  require("./learner-draft-persistence").initializeLearnerDraftPersistence;
var createLearnerDraftStorage =
  require("./learner-draft-storage").createLearnerDraftStorage;
var learnerDraftConstants = require("./learner-draft-constants");
var learnerDraftAdapters = require("./learner-draft-adapters");
var learnerDraftEnvelope = require("./learner-draft-envelope");

module.exports = Object.assign({}, api, {
  getLearnerIconPresentationCss: learnerIconRenderer.getLearnerIconPresentationCss,
  learnerIconRegistry: learnerIconRegistry,
  attachLearnerPageIdentityFromWorkflow: attachLearnerPageIdentityFromWorkflow,
  buildLearnerDraftPageIdentity: buildLearnerDraftPageIdentity,
  initializeLearnerDraftPersistence: initializeLearnerDraftPersistence,
  createLearnerDraftStorage: createLearnerDraftStorage,
  learnerDraftConstants: learnerDraftConstants,
  learnerDraftAdapters: learnerDraftAdapters,
  learnerDraftEnvelope: learnerDraftEnvelope
});
