"use strict";

/**
 * Browser registration entry for learner renderer vNext.
 * Bundled by scripts/build-learner-renderer-vnext-browser.js.
 */
var api = require("./render-learner-page");
var assessmentEvidenceHydration = require("./assessment-evidence-hydration");
var learnerIconRenderer = require("./learner-icon-renderer");
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
var resourceLifecycle = require("./resource-lifecycle");
var assessmentRuntime = require("./assessment-runtime");
var guidedReviewRuntime = require("./guided-review-runtime");
var assessmentOutput = require("./assessment-output");
var learnerArtefactContract = require("./learner-artefact-contract");
var orderingRuntime = require("./ordering-runtime");
var mathEntryRuntime = require("./math-entry-runtime");
var revisionCriterionRuntime = require("./revision-criterion-runtime");
var sequentialSectionNav = require("./sequential-section-nav");

module.exports = Object.assign({}, api, {
  getLearnerIconPresentationCss: learnerIconRenderer.getLearnerIconPresentationCss,
  learnerIconRegistry: learnerIconRegistry,
  validateAssessmentPackStructuredStimuli:
    assessmentEvidenceHydration.validateAssessmentPackStructuredStimuli,
  formatStructuredStimulusCaptureErrors:
    assessmentEvidenceHydration.formatStructuredStimulusCaptureErrors,
  attachLearnerPageIdentityFromWorkflow: attachLearnerPageIdentityFromWorkflow,
  buildLearnerDraftPageIdentity: buildLearnerDraftPageIdentity,
  initializeLearnerDraftPersistence: initializeLearnerDraftPersistence,
  disposeLearnerDraftPersistence: disposeLearnerDraftPersistence,
  createLearnerDraftStorage: createLearnerDraftStorage,
  learnerDraftConstants: learnerDraftConstants,
  learnerDraftAdapters: learnerDraftAdapters,
  learnerDraftEnvelope: learnerDraftEnvelope,
  renderLearnerResourceFragment: resourceLifecycle.renderLearnerResourceFragment,
  mountLearnerResource: resourceLifecycle.mountLearnerResource,
  unmountLearnerResource: resourceLifecycle.unmountLearnerResource,
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
  enhanceFragmentWithSectionNavigation:
    sequentialSectionNav.enhanceFragmentWithSectionNavigation,
  buildSectionNavItems: sequentialSectionNav.buildSectionNavItems,
  prepareJourneySectionMarkers: sequentialSectionNav.prepareJourneySectionMarkers,
  renderSequentialSectionNavHtml: sequentialSectionNav.renderSequentialSectionNavHtml,
  installSequentialSectionNav: sequentialSectionNav.installSequentialSectionNav,
  disposeSequentialSectionNav: sequentialSectionNav.disposeSequentialSectionNav,
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
});

