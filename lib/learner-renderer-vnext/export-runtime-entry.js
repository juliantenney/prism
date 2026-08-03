"use strict";

/**
 * Standalone export runtime entry for learner-renderer vNext.
 * Persistence/API surface only — used by portable HTML exports.
 * Bundled by scripts/build-learner-renderer-vnext-browser.js.
 */
var initializeLearnerDraftPersistence =
  require("./learner-draft-persistence").initializeLearnerDraftPersistence;
var createLearnerDraftStorage =
  require("./learner-draft-storage").createLearnerDraftStorage;
var learnerDraftConstants = require("./learner-draft-constants");
var learnerDraftAdapters = require("./learner-draft-adapters");
var learnerDraftEnvelope = require("./learner-draft-envelope");
var learnerDraftPageKey = require("./learner-draft-page-key");

module.exports = {
  initializeLearnerDraftPersistence: initializeLearnerDraftPersistence,
  createLearnerDraftStorage: createLearnerDraftStorage,
  learnerDraftConstants: learnerDraftConstants,
  learnerDraftAdapters: learnerDraftAdapters,
  learnerDraftEnvelope: learnerDraftEnvelope,
  buildLearnerDraftPageIdentity: learnerDraftPageKey.buildLearnerDraftPageIdentity,
  attachLearnerPageIdentityFromWorkflow:
    learnerDraftPageKey.attachLearnerPageIdentityFromWorkflow
};
