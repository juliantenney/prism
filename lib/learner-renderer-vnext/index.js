/**
 * Learner renderer vNext public boundary.
 *
 * Production selection uses rendererVersion: "legacy" | "vnext" (default vnext)
 * via the Utilities page export entry point.
 */
"use strict";

var buildPageModel = require("./build-page-model").buildPageModel;
var buildComposedPageModel =
  require("./compose-page-model").buildComposedPageModel;
var buildActivityCompositionMap =
  require("./compose-page-model").buildActivityCompositionMap;
var validateInput = require("./validate-input").validateInput;
var validatePageModel = require("./validate-model").validatePageModel;
var hasLearnerFacingContent =
  require("./build-beat-model").hasLearnerFacingContent;
var ARCHETYPE_RULES = require("./archetype-rules").ARCHETYPE_RULES;
var LEARNER_LABELS = require("./labels").LEARNER_LABELS;
var DEFAULT_COMPOSITION_MODE =
  require("./render-learner-page").DEFAULT_COMPOSITION_MODE;
var normalizeRendererVersion =
  require("./render-learner-page").normalizeRendererVersion;
var normalizeCompositionMode =
  require("./render-learner-page").normalizeCompositionMode;
var renderLearnerPageHtml =
  require("./render-learner-page").renderLearnerPageHtml;
var getLearnerIconPresentationCss =
  require("./learner-icon-renderer").getLearnerIconPresentationCss;
var learnerIconRegistry = require("./learner-icon-registry");
var buildLearnerDraftPageIdentity =
  require("./learner-draft-page-key").buildLearnerDraftPageIdentity;
var initializeLearnerDraftPersistence =
  require("./learner-draft-persistence").initializeLearnerDraftPersistence;
var createLearnerDraftStorage =
  require("./learner-draft-storage").createLearnerDraftStorage;
var learnerDraftConstants = require("./learner-draft-constants");
var learnerDraftAdapters = require("./learner-draft-adapters");
var learnerDraftEnvelope = require("./learner-draft-envelope");
var buildCorpusManifest = require("./certification-corpus").buildCorpusManifest;
var CERTIFICATION_CORPUS = require("./certification-corpus").CERTIFICATION_CORPUS;
var runLearnerRendererCertification =
  require("./certify-learner-renderer").runLearnerRendererCertification;
var getDiagnosticCatalog =
  require("./certification-diagnostics-catalog").getDiagnosticCatalog;

module.exports = {
  buildPageModel: buildPageModel,
  buildComposedPageModel: buildComposedPageModel,
  buildActivityCompositionMap: buildActivityCompositionMap,
  validateInput: validateInput,
  validatePageModel: validatePageModel,
  hasLearnerFacingContent: hasLearnerFacingContent,
  ARCHETYPE_RULES: ARCHETYPE_RULES,
  LEARNER_LABELS: LEARNER_LABELS,
  DEFAULT_COMPOSITION_MODE: DEFAULT_COMPOSITION_MODE,
  normalizeRendererVersion: normalizeRendererVersion,
  normalizeCompositionMode: normalizeCompositionMode,
  renderLearnerPageHtml: renderLearnerPageHtml,
  getLearnerIconPresentationCss: getLearnerIconPresentationCss,
  learnerIconRegistry: learnerIconRegistry,
  buildLearnerDraftPageIdentity: buildLearnerDraftPageIdentity,
  initializeLearnerDraftPersistence: initializeLearnerDraftPersistence,
  createLearnerDraftStorage: createLearnerDraftStorage,
  learnerDraftConstants: learnerDraftConstants,
  learnerDraftAdapters: learnerDraftAdapters,
  learnerDraftEnvelope: learnerDraftEnvelope,
  buildCorpusManifest: buildCorpusManifest,
  CERTIFICATION_CORPUS: CERTIFICATION_CORPUS,
  runLearnerRendererCertification: runLearnerRendererCertification,
  getDiagnosticCatalog: getDiagnosticCatalog
};
