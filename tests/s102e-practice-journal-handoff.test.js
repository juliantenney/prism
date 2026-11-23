/**
 * Sprint 102E — Practice response_fulfilment → Learning Journal handoff.
 *
 * Commissioned Practice journal entries (C02.E1–E5) must bind onto
 * learner-constructed-{E*} workspaces. Practice was previously excluded from
 * the shared artefact-producer instruction and DLA learner-facing copy gate.
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
const {
  constructedTextWorkspaceId
} = require("../lib/learner-renderer-vnext/learner-artefact-producers");
const { createLearnerDraftStorage } = require("../lib/learner-renderer-vnext/learner-draft-storage");
const envelope = require("../lib/learner-renderer-vnext/learner-draft-envelope");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const E_IDS = ["E1", "E2", "E3", "E4", "E5"];

function defaultEpisodePlan() {
  return {
    archetype: "apply",
    beats: [
      { function: "orientation" },
      { function: "framing" },
      { function: "activation" },
      { function: "criteria_exposition" },
      { function: "worked_thinking" },
      { function: "guided_practice" },
      { function: "independent_performance" },
      { function: "verification" },
      { function: "revision" },
      { function: "reflection" },
      { function: "transfer" },
      { function: "transition" }
    ]
  };
}

function journeyPageWithPracticeJournal() {
  const built = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Feedback judgements journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro."
      },
      {
        section_id: "exp_1",
        title: "Expository briefing",
        order: 2,
        exposition: "Read the briefing."
      },
      {
        section_id: "exp_2",
        title: "Practice feedback judgements",
        order: 3,
        exposition: "Practise criterion-referenced feedback."
      }
    ],
    commissions: [
      {
        commission_id: "C01",
        section_id: "exp_1",
        order: 1,
        title: "Expository briefing",
        product_id: "expository",
        status: "supported",
        specification_text: "Commission an Expository Resource with no journal producers.",
        journey_context_text: "Opening briefing.",
        dependencies: ""
      },
      {
        commission_id: "C02",
        section_id: "exp_2",
        order: 2,
        title: "Practice feedback judgements",
        product_id: "practice",
        status: "supported",
        specification_text:
          "Commission a Practice resource whose constructed responses feed the Learning Journal.",
        journey_context_text: "Practice contributions retained for journal visibility.",
        dependencies: "C01"
      }
    ]
  });
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  built.page.learning_journey.journal = {
    enabled: true,
    title: "My Learning Journal",
    entries: E_IDS.map(function (eid, index) {
      return {
        entry_id: "j-" + eid,
        order: index + 1,
        title: "Journal " + eid,
        framing: "Revisit your Practice response " + eid + ".",
        artefact_id: "C02." + eid
      };
    })
  };
  return built.page;
}

function practicePageWithFulfilmentBindings() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    title: "Practice feedback judgements",
    activities: E_IDS.map(function (eid, index) {
      var activityId = "A" + String(index + 1);
      var materialId = activityId + "-M1";
      return {
        activity_id: activityId,
        title: "Judgement " + eid,
        learner_task: "1. Study the examples.\n2. Write your constructed response for " + eid + ".",
        expected_output: "A constructed judgement.",
        episode_plan: defaultEpisodePlan(),
        required_materials: [
          {
            material_id: materialId,
            material_type: "prompt_set",
            title: "Response " + eid,
            purpose: "Capture journal contribution " + eid,
            specification: "Learner writes a constructed response.",
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose",
              artefact_elicitation_id: eid
            }
          }
        ],
        materials: [
          {
            material_id: materialId,
            material_type: "prompt_set",
            activity_id: activityId,
            title: eid + " — Write your judgement",
            body_format: "markdown",
            body:
              "### Your Learning Journal response: " +
              eid +
              "\n\nWrite a short evaluative judgement.\n\n1. Your analysis"
          }
        ]
      };
    })
  };
}

function loadApi() {
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  catalogueStore.resetStorageBackendForTests();
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/ld-practice-presentation-contracts.js"
    ]
  });
  if (loaded.window && loaded.window.Utils && !loaded.window.Utils.uuid) {
    loaded.window.Utils.uuid = function () {
      return "wf-test-" + String(Date.now()) + "-" + String(Math.random()).slice(2, 8);
    };
  }
  if (loaded.sandbox) {
    loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
    loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  }
  if (loaded.window) {
    loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
    loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  }
  return loaded;
}

function dlaCopyContext(wf) {
  const step = (wf.steps || []).find(function (row) {
    return String(row.title || "") === "Design Learning Activities";
  });
  assert.ok(step, "missing Design Learning Activities");
  return {
    workflowGoal: "Practice feedback judgements",
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

test("Practice commission intake carries required learner artefacts into deliverySeed", () => {
  const page = journeyPageWithPracticeJournal();
  const commission = ljDesign.resolveCommissionFromPage(page, "C02");
  const env = ljDesign.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj"
  });
  assert.equal(env.sourceCommissionId, "C02");
  assert.equal(env.requiredLearnerArtefacts.length, 5);
  assert.equal(env.requiredLearnerArtefacts[0].elicitationId, "E1");
  assert.equal(env.requiredLearnerArtefacts[4].elicitationId, "E5");
  assert.equal(env.requiredLearnerArtefacts[0].artefactId, "C02.E1");

  const result = intake.intakeCommission(env);
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.family.deliverySeed.required_learner_artefacts.length, 5);
  assert.equal(result.family.deliverySeed.required_learner_artefacts[0].elicitationId, "E1");
  assert.equal(result.family.deliverySeed.required_learner_artefacts[4].elicitationId, "E5");
});

test("Practice DLA prompt includes SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT", () => {
  const { api } = loadApi();
  const required = E_IDS.map(function (eid) {
    return {
      elicitationId: eid,
      artefactId: "C02." + eid,
      title: "Journal " + eid
    };
  });
  const wf = {
    id: "wf-practice-journal",
    product: "practice",
    pageEnrichmentV2: true,
    steps: [
      {
        id: "dla",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities",
        outputName: "page"
      }
    ],
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Practice feedback judgements",
        commission_specification: "Practise criterion-referenced feedback.",
        journey_context: "Journal-bound Practice.",
        source_journey_workflow_id: "wf-lj",
        source_commission_id: "C02",
        required_learner_artefacts: required
      },
      initialBrief: {
        topic: "Practice feedback judgements",
        product: "practice",
        commissionSpecification: "Practise criterion-referenced feedback.",
        requiredLearnerArtefacts: required
      }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  assert.equal(
    api.isCommissionLearnerFacingCopyStep(wf.steps[0], wf),
    true
  );
  const instruction = api.composeCommissionedLearnerArtefactProducerInstruction(wf);
  assert.match(instruction, /SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT/);
  assert.match(instruction, /artefact_elicitation_id/);
  assert.match(instruction, /elicitation_id "E1"/);
  assert.match(instruction, /elicitation_id "E5"/);
  assert.match(instruction, /learner-constructed-\{elicitation_id\}/);

  const prompt = api.assembleLiveDlaCanonicalPrompt(dlaCopyContext(wf), wf);
  assert.match(prompt, /SHARED LEARNER ARTEFACT PRODUCER REQUIREMENT/);
  assert.match(prompt, /elicitation_id "E3"/);
});

test("standalone Practice without commission artefacts stays free of producer requirement", () => {
  const { api } = loadApi();
  const wf = {
    id: "wf-practice-standalone",
    product: "practice",
    pageEnrichmentV2: true,
    steps: [
      {
        id: "dla",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities",
        outputName: "page"
      }
    ],
    workflowBriefResolution: {
      resolvedFactors: { topic: "Standalone practice" },
      initialBrief: { topic: "Standalone practice", product: "practice" }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  assert.equal(api.composeCommissionedLearnerArtefactProducerInstruction(wf), "");
  assert.equal(api.isCommissionLearnerFacingCopyStep(wf.steps[0], wf), false);
});

test("Practice fulfilment bindings render learner-constructed workspaces and resolve into Journal", () => {
  const practicePage = practicePageWithFulfilmentBindings();
  const producers = discoverConstructedTextProducers(practicePage);
  assert.equal(producers.length, 5);
  E_IDS.forEach(function (eid, index) {
    assert.equal(producers[index].elicitationId, eid);
    assert.equal(producers[index].workspaceId, constructedTextWorkspaceId(eid));
    assert.equal(producers[index].source, "interactive_response_fulfilment");
  });

  const rendered = renderLearnerPageHtml(practicePage);
  assert.ok(!rendered.error, rendered.error && rendered.error.message);
  E_IDS.forEach(function (eid) {
    assert.match(
      rendered.html,
      new RegExp('data-workspace-id="learner-constructed-' + eid + '"')
    );
  });
  assert.doesNotMatch(rendered.html, /data-workspace-id="learner-workspace-a1"/);

  const proposal = proposeArtefactContractFromLearningJourney({
    page: journeyPageWithPracticeJournal(),
    constituents: [
      {
        commissionId: "C02",
        productId: "practice",
        title: "Practice feedback judgements",
        sourcePage: practicePage,
        pageKey: "page-c02"
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces.length, 5);
  assert.equal(proposal.contract.produces[0].artefactId, "C02.E1");
  assert.equal(proposal.contract.produces[4].artefactId, "C02.E5");
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
  const draft = envelope.createEmptyEnvelope("page-c02");
  E_IDS.forEach(function (eid, index) {
    draft.workspaces[constructedTextWorkspaceId(eid)] = envelope.createWorkspaceState(
      "text_entry",
      {
        text: "Practice response text for " + eid + " #" + String(index + 1)
      }
    );
  });
  assert.equal(draftApi.saveLearnerDraft("page-c02", draft).ok, true);

  E_IDS.forEach(function (eid) {
    const resolved = resolveArtefactReference({
      contract: proposal.contract,
      artefactId: "C02." + eid,
      resources: [
        {
          commissionId: "C02",
          pageKey: "page-c02",
          title: "Practice feedback judgements"
        }
      ],
      storage
    });
    assert.equal(resolved.ok, true, JSON.stringify(resolved));
    assert.match(resolved.text, new RegExp("Practice response text for " + eid));
  });

  // Persist across reopen: same storage backend, fresh draft API / resolve.
  const reopenedApi = createLearnerDraftStorage(storage);
  const loaded = reopenedApi.loadLearnerDraft("page-c02");
  assert.equal(loaded.ok, true, JSON.stringify(loaded));
  assert.ok(loaded.envelope && loaded.envelope.workspaces);
  assert.ok(loaded.envelope.workspaces["learner-constructed-E3"]);
  const again = resolveArtefactReference({
    contract: proposal.contract,
    artefactId: "C02.E3",
    resources: [
      {
        commissionId: "C02",
        pageKey: "page-c02",
        title: "Practice feedback judgements"
      }
    ],
    storage
  });
  assert.equal(again.ok, true, JSON.stringify(again));
  assert.match(again.text, /Practice response text for E3/);
});
