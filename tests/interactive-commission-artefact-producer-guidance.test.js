/**
 * Commission → Interactive generation: required constructed-text artefact
 * identities from the Learning Journey Journal must reach DLA guidance.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ljDesign = require("../lib/learning-journey-design-page.js");
const intake = require("../lib/first-class-commission-intake.js");
const {
  proposeArtefactContractFromLearningJourney,
  resolveArtefactReference,
  renderLearnerPageHtml,
  discoverConstructedTextProducers
} = require("../lib/learner-renderer-vnext");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function journeyPageWithJournalProducer(commissionId, elicitationId) {
  const artefactId = commissionId + "." + elicitationId;
  const built = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Artefact producer journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro."
      },
      {
        section_id: "exp_1",
        title: "Opening judgement",
        order: 2,
        exposition: "Write an initial judgement."
      },
      {
        section_id: "exp_2",
        title: "Later stop",
        order: 3,
        exposition: "Continue."
      }
    ],
    commissions: [
      {
        commission_id: commissionId,
        section_id: "exp_1",
        order: 1,
        title: "Opening judgement",
        product_id: "interactive",
        status: "supported",
        specification_text:
          "Commission an Interactive Resource in which learners write an initial constructed judgement.",
        journey_context_text: "Opening contribution retained for later developmental visibility.",
        dependencies: ""
      },
      {
        commission_id: "c_later",
        section_id: "exp_2",
        order: 2,
        title: "Later stop",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "Later Assessment Pack.",
        dependencies: ""
      }
    ]
  });
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  built.page.learning_journey.journal = {
    enabled: true,
    title: "My Learning Journal",
    entries: [
      {
        entry_id: "j1",
        order: 1,
        title: "Initial judgement",
        framing: "Revisit your first written position.",
        artefact_id: artefactId
      }
    ]
  };
  return built.page;
}

function journeyPageWithoutJournal(commissionId) {
  const built = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "No journal producer journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro."
      },
      {
        section_id: "exp_1",
        title: "Practice",
        order: 2,
        exposition: "Practice without journal capture."
      }
    ],
    commissions: [
      {
        commission_id: commissionId,
        section_id: "exp_1",
        order: 1,
        title: "Practice",
        product_id: "interactive",
        status: "supported",
        specification_text: "Commission an Interactive Resource for practice.",
        dependencies: ""
      }
    ]
  });
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  return built.page;
}

function loadApi() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-dla-page-enrich-contract.js",
      "lib/first-class-commission-intake.js",
      "lib/expository-sibling-prompts.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/situated-task-design-page.js",
      "lib/learning-journey-sibling-prompts.js",
      "lib/learning-journey-design-page.js"
    ]
  });
}

function enableInteractiveDlaV2(wf) {
  wf.pageEnrichmentV2 = true;
  wf.partialPageOutputs = true;
  wf.workflowOutputSpec = Object.assign({}, wf.workflowOutputSpec || {}, {
    pageEnrichmentV2: true,
    partialPageOutputs: true
  });
  return wf;
}

function dlaCopyContext(wf) {
  const step = (wf.steps || []).find(function (row) {
    return String(row.title || "") === "Design Learning Activities";
  });
  assert.ok(step, "missing Design Learning Activities");
  return {
    workflowGoal: "Interactive practice",
    desiredOutputs: "page",
    stepCanonicalStepId: "step_design_learning_activities",
    stepCanonicalTitle: "Design Learning Activities",
    stepTitle: "Design Learning Activities",
    step: Object.assign({}, step, {
      canonical_step_id: "step_design_learning_activities",
      canonicalStepId: "step_design_learning_activities",
      outputName: "page"
    })
  };
}

test("journal producer elicitation reaches commission intake envelope exactly", () => {
  const page = journeyPageWithJournalProducer("cx", "E1");
  const commission = ljDesign.resolveCommissionFromPage(page, "cx");
  const envelope = ljDesign.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj"
  });
  assert.equal(envelope.sourceCommissionId, "cx");
  assert.equal(envelope.requiredLearnerArtefacts.length, 1);
  assert.equal(envelope.requiredLearnerArtefacts[0].elicitationId, "E1");
  assert.equal(envelope.requiredLearnerArtefacts[0].artefactId, "cx.E1");
  assert.equal(envelope.requiredLearnerArtefacts[0].responseKind, "constructed_text");
});

test("intake persists required learner artefacts on deliverySeed", () => {
  const page = journeyPageWithJournalProducer("cx", "E1");
  const commission = ljDesign.resolveCommissionFromPage(page, "cx");
  const envelope = ljDesign.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj"
  });
  const result = intake.intakeCommission(envelope);
  assert.equal(result.ok, true);
  assert.equal(result.family.deliverySeed.required_learner_artefacts.length, 1);
  assert.equal(result.family.deliverySeed.required_learner_artefacts[0].elicitationId, "E1");
  assert.equal(result.createSeed.requiredLearnerArtefacts[0].artefactId, "cx.E1");
});

test("Interactive DLA prompt requires artefact_elicitation_id when commission needs a producer", () => {
  const { api } = loadApi();
  const page = journeyPageWithJournalProducer("cx", "E1");
  const commission = ljDesign.resolveCommissionFromPage(page, "cx");
  const envelope = ljDesign.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj"
  });
  const result = intake.intakeCommission(envelope);
  assert.equal(result.ok, true);
  const wf = enableInteractiveDlaV2({
    id: "wf-interactive-artefact-required",
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "cx",
    steps: (result.family.steps || []).map(function (row, i) {
      return Object.assign({}, row, { id: "s" + i });
    }),
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, {
        topic: "Opening judgement"
      }),
      initialBrief: {
        topic: "Opening judgement",
        product: "interactive",
        commissionSpecification: envelope.specificationText,
        journeyContextText: envelope.journeyContextText,
        requiredLearnerArtefacts: envelope.requiredLearnerArtefacts.slice()
      }
    }
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const prompt = api.assembleLiveDlaCanonicalPrompt(dlaCopyContext(wf), wf);
  assert.match(prompt, /SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT/);
  assert.match(prompt, /artefact_elicitation_id/);
  assert.match(prompt, /elicitation_id "E1"/);
  assert.match(prompt, /artefact cx\.E1/);
  assert.doesNotMatch(prompt, /Slippery Case/i);
});

test("Interactive DLA prompt does not invent artefact producers when journal does not require them", () => {
  const { api } = loadApi();
  const page = journeyPageWithoutJournal("cx");
  const commission = ljDesign.resolveCommissionFromPage(page, "cx");
  const envelope = ljDesign.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj"
  });
  assert.equal(envelope.requiredLearnerArtefacts.length, 0);
  const result = intake.intakeCommission(envelope);
  assert.equal(result.ok, true);
  const wf = enableInteractiveDlaV2({
    id: "wf-interactive-artefact-absent",
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "cx",
    steps: (result.family.steps || []).map(function (row, i) {
      return Object.assign({}, row, { id: "s" + i });
    }),
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, {
        topic: "Practice"
      }),
      initialBrief: {
        topic: "Practice",
        product: "interactive",
        commissionSpecification: envelope.specificationText,
        requiredLearnerArtefacts: []
      }
    }
  });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const instruction = api.composeCommissionedLearnerArtefactProducerInstruction(wf);
  assert.equal(instruction, "");
  const prompt = api.assembleLiveDlaCanonicalPrompt(dlaCopyContext(wf), wf);
  assert.doesNotMatch(prompt, /SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT/);
});

test("DLA fulfilment binding and Design Page learner_artefacts both resolve into Journal", () => {
  // Path A: DLA-authored response_fulfilment.artefact_elicitation_id (discovery).
  const fulfilmentPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Opening judgement",
    activities: [
      {
        activity_id: "A1",
        title: "Initial judgement",
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "task_card",
            title: "Write your judgement",
            purpose: "Capture the initial judgement",
            specification: "Learner writes a constructed judgement.",
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose",
              artefact_elicitation_id: "E1"
            }
          }
        ],
        materials: []
      }
    ]
  };
  const fulfilmentProducers = discoverConstructedTextProducers(fulfilmentPage);
  assert.equal(fulfilmentProducers.length, 1);
  assert.equal(fulfilmentProducers[0].elicitationId, "E1");
  assert.equal(fulfilmentProducers[0].workspaceId, "learner-constructed-E1");
  assert.equal(fulfilmentProducers[0].source, "interactive_response_fulfilment");

  // Path B: page-root learner_artefacts.produces (renderable capture surface).
  const artefactsPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Opening judgement",
    activities: [],
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Initial judgement",
          prompt: "Write your initial judgement."
        }
      ]
    }
  };
  const rendered = renderLearnerPageHtml(artefactsPage);
  assert.ok(!rendered.error, rendered.error && rendered.error.message);
  assert.match(rendered.html, /data-workspace-id="learner-constructed-E1"/);
  assert.match(rendered.html, /data-workspace-kind="text_entry"/);

  const proposal = proposeArtefactContractFromLearningJourney({
    page: journeyPageWithJournalProducer("cx", "E1"),
    constituents: [
      {
        commissionId: "cx",
        productId: "interactive",
        title: "Opening judgement",
        sourcePage: artefactsPage,
        pageKey: "page-cx"
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces[0].artefactId, "cx.E1");
  assert.equal(proposal.contract.produces[0].workspaceId, "learner-constructed-E1");

  const storage = {
    _map: new Map(),
    getItem(key) {
      return this._map.has(key) ? this._map.get(key) : null;
    },
    setItem(key, value) {
      this._map.set(String(key), String(value));
    },
    removeItem(key) {
      this._map.delete(String(key));
    }
  };
  const draftApi = createLearnerDraftStorage(storage);
  const draft = envelope.createEmptyEnvelope("page-cx");
  draft.workspaces["learner-constructed-E1"] = envelope.createWorkspaceState("text_entry", {
    text: "Authentic learner judgement text."
  });
  assert.equal(draftApi.saveLearnerDraft("page-cx", draft).ok, true);
  const resolved = resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "cx.E1",
    resources: [{ commissionId: "cx", pageKey: "page-cx", title: "Opening judgement" }],
    storage
  });
  assert.equal(resolved.ok, true);
  assert.equal(resolved.text, "Authentic learner judgement text.");
});
