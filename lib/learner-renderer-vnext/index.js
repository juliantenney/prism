/**
 * Learner renderer vNext public boundary.
 *
 * Definitive sole learner-page renderer (S74A-D02). Authoring page export is
 * unconditional through this module / generated browser artefact.
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
var formatModelErrors = require("./render-learner-page").formatModelErrors;
var assessmentEvidenceHydration = require("./assessment-evidence-hydration");
var getLearnerIconPresentationCss =
  require("./learner-icon-renderer").getLearnerIconPresentationCss;
var learnerIconRegistry = require("./learner-icon-registry");
var learnerDraftPageKey = require("./learner-draft-page-key");
var attachLearnerPageIdentityFromWorkflow =
  learnerDraftPageKey.attachLearnerPageIdentityFromWorkflow;
var buildLearnerDraftPageIdentity = learnerDraftPageKey.buildLearnerDraftPageIdentity;
var initializeLearnerDraftPersistence =
  require("./learner-draft-persistence").initializeLearnerDraftPersistence;
var disposeLearnerDraftPersistence =
  require("./learner-draft-persistence").disposeLearnerDraftPersistence;
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
var resourceLifecycle = require("./resource-lifecycle");
var assessmentRuntime = require("./assessment-runtime");
var guidedReviewRuntime = require("./guided-review-runtime");
var assessmentOutput = require("./assessment-output");
var learnerArtefactContract = require("./learner-artefact-contract");
var orderingRuntime = require("./ordering-runtime");
var mathEntryRuntime = require("./math-entry-runtime");
var revisionCriterionRuntime = require("./revision-criterion-runtime");

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
  formatModelErrors: formatModelErrors,
  validateAssessmentPackStructuredStimuli:
    assessmentEvidenceHydration.validateAssessmentPackStructuredStimuli,
  formatStructuredStimulusCaptureErrors:
    assessmentEvidenceHydration.formatStructuredStimulusCaptureErrors,
  getLearnerIconPresentationCss: getLearnerIconPresentationCss,
  learnerIconRegistry: learnerIconRegistry,
  attachLearnerPageIdentityFromWorkflow: attachLearnerPageIdentityFromWorkflow,
  buildLearnerDraftPageIdentity: buildLearnerDraftPageIdentity,
  initializeLearnerDraftPersistence: initializeLearnerDraftPersistence,
  disposeLearnerDraftPersistence: disposeLearnerDraftPersistence,
  createLearnerDraftStorage: createLearnerDraftStorage,
  learnerDraftConstants: learnerDraftConstants,
  learnerDraftAdapters: learnerDraftAdapters,
  learnerDraftEnvelope: learnerDraftEnvelope,
  buildCorpusManifest: buildCorpusManifest,
  CERTIFICATION_CORPUS: CERTIFICATION_CORPUS,
  runLearnerRendererCertification: runLearnerRendererCertification,
  getDiagnosticCatalog: getDiagnosticCatalog,
  renderLearnerResourceFragment: resourceLifecycle.renderLearnerResourceFragment,
  mountLearnerResource: resourceLifecycle.mountLearnerResource,
  unmountLearnerResource: resourceLifecycle.unmountLearnerResource,
  enhanceFragmentWithSectionNavigation:
    resourceLifecycle.enhanceFragmentWithSectionNavigation,
  installSequentialSectionNav: resourceLifecycle.installSequentialSectionNav,
  disposeSequentialSectionNav: resourceLifecycle.disposeSequentialSectionNav,
  installAssessmentRuntime: assessmentRuntime.installAssessmentRuntime,
  disposeAssessmentRuntime: assessmentRuntime.disposeAssessmentRuntime,
  installGuidedReviewRuntime: guidedReviewRuntime.installGuidedReviewRuntime,
  disposeGuidedReviewRuntime: guidedReviewRuntime.disposeGuidedReviewRuntime,
  installAssessmentOutput: assessmentOutput.installAssessmentOutput,
  disposeAssessmentOutput: assessmentOutput.disposeAssessmentOutput,
  installOrderingRuntime: orderingRuntime.installOrderingRuntime,
  disposeOrderingRuntime: orderingRuntime.disposeOrderingRuntime,
  installMathEntryRuntime: mathEntryRuntime.installMathEntryRuntime,
  disposeMathEntryRuntime: mathEntryRuntime.disposeMathEntryRuntime,
  installRevisionCriterionRuntime: revisionCriterionRuntime.installRevisionCriterionRuntime,
  disposeRevisionCriterionRuntime: revisionCriterionRuntime.disposeRevisionCriterionRuntime,
  normalizeArtefactContract: learnerArtefactContract.normalizeArtefactContract,
  resolveArtefactReference: learnerArtefactContract.resolveArtefactReference,
  renderArtefactReferenceHtml: learnerArtefactContract.renderArtefactReferenceHtml,
  injectArtefactReferences: learnerArtefactContract.injectArtefactReferences,
  renderJournalArtefactHtml: learnerArtefactContract.renderJournalArtefactHtml,
  resolveLearningJournalEntries: learnerArtefactContract.resolveLearningJournalEntries,
  populateLearningJournal: learnerArtefactContract.populateLearningJournal,
  fingerprintJournalContent: learnerArtefactContract.fingerprintJournalContent,
  evaluateJournalNotifications: learnerArtefactContract.evaluateJournalNotifications,
  acknowledgeJournalNotifications: learnerArtefactContract.acknowledgeJournalNotifications,
  buildLearningJourneyNotificationKey:
    learnerArtefactContract.buildLearningJourneyNotificationKey,
  applyContextualHandoffGuidance: learnerArtefactContract.applyContextualHandoffGuidance,
  listReferencesForCommission: learnerArtefactContract.listReferencesForCommission,
  listProducesForCommission: learnerArtefactContract.listProducesForCommission,
  proposeArtefactContractFromLearningJourney:
    learnerArtefactContract.proposeArtefactContractFromLearningJourney,
  discoverConstructedTextProducers:
    learnerArtefactContract.discoverConstructedTextProducers,
  constructedTextWorkspaceId: learnerArtefactContract.constructedTextWorkspaceId,
  RESPONSE_KIND_CONSTRUCTED_TEXT: learnerArtefactContract.RESPONSE_KIND_CONSTRUCTED_TEXT
};
