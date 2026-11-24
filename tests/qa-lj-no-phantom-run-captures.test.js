const test = require("node:test");
const assert = require("node:assert/strict");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const bindMod = require("../lib/commission-native-lo-bind.js");
const intakeMod = require("../lib/first-class-commission-intake.js");
const listPresentationMod = require("../lib/workflow-list-presentation.js");
const epDlaMod = require("../lib/episode-plan-dla-integration.js");
const pageShellMod = require("../lib/page-shell-create.js");

const SHARED_CORPUS = "Shared authoritative dataset: ice cream sales vs drowning (r = 0.87).";

function makePracticeAndExpositoryPage() {
  const c1Spec =
    "Practice job: spot confounding variables.\n\n" +
    bindMod.wrapComponentLearningOutcomes({
      learning_outcomes: [
        {
          statement: "Identify plausible confounding variables in observational claims.",
          related_concepts: ["correlation", "confounding"],
          cognitive_level: "analyse"
        }
      ],
      learner_level: "undergraduate",
      scope: "component"
    });
  const c2Spec =
    "Expository job: explain correlation vs causation.\n\n" +
    bindMod.wrapComponentLearningOutcomes({
      learning_outcomes: [
        {
          statement: "Distinguish correlation from causation.",
          related_concepts: ["correlation", "causation"],
          cognitive_level: "understand"
        }
      ],
      learner_level: "undergraduate",
      scope: "component"
    });

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Correlation and Causation",
    activities: [],
    shared_authoritative_material: { status: "generated", content: SHARED_CORPUS },
    sections: [
      { section_id: "journey_intro", title: "Introduction", order: 1, exposition: "Intro." },
      { section_id: "exp_1", title: "Spotting Confounders", order: 2, exposition: "Exp 1." },
      { section_id: "exp_2", title: "Why Correlation Isn't Causation", order: 3, exposition: "Exp 2." }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Spotting Confounders",
        product_id: "practice",
        status: "supported",
        specification_text: c1Spec,
        journey_context_text: "First experience."
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Why Correlation Isn't Causation",
        product_id: "expository",
        status: "supported",
        specification_text: c2Spec,
        journey_context_text: "Second experience."
      }
    ],
    learning_journey: {
      design_intent: "Causal reasoning.",
      continuity: "Shared dataset.",
      journal: { enabled: false, title: "Your Learning Journal", entries: [] }
    },
    assembly_state: { calls_model: true }
  };
}

function createMemoryCatalogueBackend() {
  const map = new Map();
  return {
    get: async (key) => (map.has(key) ? map.get(key) : null),
    set: async (key, val) => {
      map.set(key, val);
    },
    remove: async (key) => {
      map.delete(key);
    },
    clear: async () => {
      map.clear();
    }
  };
}

function loadRunHarness(sharedBackend, sharedRunStore) {
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  const backend = sharedBackend || createMemoryCatalogueBackend();
  catalogueStore.setStorageBackend(backend);

  let uuidCounter = 0;
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
      "lib/first-class-workflow-family.js",
      "lib/commission-native-lo-bind.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-workflow-hierarchy.js",
      "lib/workflow-artefact-json-strict.js",
      "lib/episode-plan-v1-vocabulary.js",
      "lib/episode-plan-v1-validation.js",
      "lib/episode-plan-population-contract.js",
      "lib/episode-plan-v1-templates.js",
      "lib/episode-plan-dla-integration.js",
      "lib/page-shell-create.js"
    ]
  });

  loaded.window.Utils = loaded.window.Utils || {};
  loaded.window.Utils.uuid = function () {
    uuidCounter += 1;
    return "wf-qa-" + String(uuidCounter).padStart(3, "0") + "-" + Math.random().toString(36).slice(2, 7);
  };
  loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  }
  loaded.window.PRISM_EPISODE_PLAN_DLA_INTEGRATION = epDlaMod;
  loaded.sandbox.PRISM_EPISODE_PLAN_DLA_INTEGRATION = epDlaMod;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_EPISODE_PLAN_DLA_INTEGRATION = epDlaMod;
  }
  loaded.window.PRISM_PAGE_SHELL_CREATE = pageShellMod;
  loaded.sandbox.PRISM_PAGE_SHELL_CREATE = pageShellMod;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_PAGE_SHELL_CREATE = pageShellMod;
  }
  loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  }
  const resourcesStub = { deleteResourcesForWorkflow: async () => ({ ok: true }) };
  loaded.window.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  loaded.sandbox.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  }
  loaded.window.confirm = () => true;
  loaded.sandbox.confirm = () => true;

  if (sharedRunStore && typeof loaded.api.saveWorkflowRunStateStoreForTest === "function") {
    loaded.api.saveWorkflowRunStateStoreForTest(JSON.parse(JSON.stringify(sharedRunStore)));
  }

  return { loaded, api: loaded.api, catalogueStore, backend };
}

test("Commission-native Practice Step 1 (Design Episode Plan) is NEVER auto-populated in Run mode, and uses AI-authored prompt without deterministic derivation", async () => {
  const page = makePracticeAndExpositoryPage();
  const { loaded, api } = loadRunHarness();

  const ljWf = {
    id: "wf-lj-1",
    name: "Correlation and Causation",
    product: "learning_journey",
    steps: [{ id: "lj-s5", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }],
    workflowBriefResolution: {
      initialBrief: { product: "learning_journey", sourceContext: SHARED_CORPUS },
      resolvedFactors: { product: "learning_journey", source_context: SHARED_CORPUS }
    },
    artefacts: SHARED_CORPUS
  };

  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-1");
  api.setLearningJourneyCommissioningPreviewContextForTest({ page, sourceWorkflowId: "wf-lj-1" });

  const batchRes = await api.handleLearningJourneyBatchCreateComponentsActionForTest({
    page,
    sourceWorkflowId: "wf-lj-1"
  });
  assert.equal(batchRes.ok, true);
  const practiceWf = batchRes.created.find((c) => c.commissionId === "c1").workflow;
  assert.equal(practiceWf.steps.length, 5);
  const step1 = practiceWf.steps[0];
  assert.equal(step1.title, "Design Episode Plan");

  api.setSelectedWorkflowIdForTest(practiceWf.id);

  // 1. Practice Episode Plan is AI-authored (S104-D02): deterministic shell derivation returns empty;
  //    Copy prompt resolves Practice AI-authored Episode Plan instructions instead.
  const derivedShell = api.deriveDesignEpisodePlanCaptureJson(practiceWf);
  assert.equal(derivedShell, "", "Practice Episode Plan must not deterministically instantiate archetype templates");
  const resolvedPrompt = api.resolveStepPromptText(step1, practiceWf);
  assert.equal(resolvedPrompt.sourceType, "practice_episode_plan");
  assert.match(resolvedPrompt.text, /AUTHORITATIVE COMMISSIONED LEARNING OUTCOMES/);

  // 2. Simulate Run mode viewing Step 1 of the unstarted Practice workflow
  const doc = loaded.window.document;
  const runBtn = doc.getElementById("workflowModeRunBtn");
  const wfDetail = doc.getElementById("workflowDetail");
  if (runBtn && runBtn.classList) runBtn.classList.add("active");
  if (wfDetail && wfDetail.classList) wfDetail.classList.add("run-mode");

  const outArea = { value: "" };
  const fakeLi = {
    getAttribute: (name) => (name === "data-step-id" ? step1.id : ""),
    querySelector: (sel) => (sel === '[data-field="runStepOutput"]' ? outArea : null)
  };

  api.maybeAutoPopulateDesignEpisodePlanRunCaptureForTest(fakeLi, practiceWf, step1);

  // Step 1 textarea MUST remain empty — commission-native LO binding must NOT populate or persist a capture
  assert.equal(outArea.value, "", "Step 1 textarea must stay empty on unstarted commission-native Practice workflow");

  // Run state store must have NO captured output for practiceWf
  const runStore =
    typeof api.loadWorkflowRunStateStoreForTest === "function"
      ? api.loadWorkflowRunStateStoreForTest()
      : {};
  const rec = runStore[practiceWf.id] || {};
  const capturedKeys = Object.keys(rec.capturedOutputs || {}).filter((k) =>
    String(rec.capturedOutputs[k] || "").trim()
  );
  assert.equal(capturedKeys.length, 0, "unstarted Practice workflow must have zero persisted captures");

  // Workflow list status must be No data (not Incomplete)
  const status = listPresentationMod.deriveWorkflowListAuthoringStatus(practiceWf, rec);
  assert.equal(status.label, "No data", "unstarted Practice workflow must show No data");
});

test("Parent LJ, sibling, and deleted component captures do NOT leak into recreated component workflows (across switching and refresh)", async () => {
  const page = makePracticeAndExpositoryPage();
  const { api, catalogueStore, backend } = loadRunHarness();

  const ljWf = {
    id: "wf-lj-iso",
    name: "Correlation and Causation",
    product: "learning_journey",
    steps: [{ id: "lj-s5", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }],
    workflowBriefResolution: {
      initialBrief: { product: "learning_journey", sourceContext: SHARED_CORPUS },
      resolvedFactors: { product: "learning_journey", source_context: SHARED_CORPUS }
    },
    artefacts: SHARED_CORPUS
  };

  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-iso");
  api.setLearningJourneyCommissioningPreviewContextForTest({ page, sourceWorkflowId: "wf-lj-iso" });

  // Create c1 (Practice) and c2 (Expository)
  const batchRes = await api.handleLearningJourneyBatchCreateComponentsActionForTest({
    page,
    sourceWorkflowId: "wf-lj-iso"
  });
  assert.equal(batchRes.ok, true);
  const c1Orig = batchRes.created.find((c) => c.commissionId === "c1").workflow;
  const c2Orig = batchRes.created.find((c) => c.commissionId === "c2").workflow;

  // Seed distinctive run captures on parent LJ, sibling c2, AND c1Orig before deleting c1Orig
  const PARENT_MARKER = JSON.stringify({
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "PARENT_DISTINCTIVE_MARKER_991"
  });
  const SIBLING_MARKER = "SIBLING_DISTINCTIVE_MARKER_882";
  const DELETED_C1_MARKER = "DELETED_C1_MARKER_773";

  const seededRunStore = {
    [ljWf.id]: {
      capturedOutputs: { "lj-s5": PARENT_MARKER },
      capturedOutputsRaw: { "lj-s5": PARENT_MARKER },
      stepCompleted: { "lj-s5": true }
    },
    [c2Orig.id]: {
      capturedOutputs: { [c2Orig.steps[0].id]: SIBLING_MARKER },
      capturedOutputsRaw: { [c2Orig.steps[0].id]: SIBLING_MARKER },
      stepCompleted: { [c2Orig.steps[0].id]: true }
    },
    [c1Orig.id]: {
      capturedOutputs: { [c1Orig.steps[0].id]: DELETED_C1_MARKER },
      capturedOutputsRaw: { [c1Orig.steps[0].id]: DELETED_C1_MARKER },
      stepCompleted: { [c1Orig.steps[0].id]: true }
    }
  };
  api.saveWorkflowRunStateStoreForTest(seededRunStore);

  // Delete c1Orig via handleDeleteWorkflow
  api.setSelectedWorkflowIdForTest(c1Orig.id);
  await api.handleDeleteWorkflowForTest();

  const storeAfterDelete = api.loadWorkflowRunStateStoreForTest();
  assert.equal(storeAfterDelete[c1Orig.id], undefined, "deleted component run state must be removed");
  assert.equal(
    storeAfterDelete[ljWf.id].capturedOutputs["lj-s5"],
    PARENT_MARKER,
    "parent LJ run state must remain intact after component deletion"
  );
  assert.equal(
    storeAfterDelete[c2Orig.id].capturedOutputs[c2Orig.steps[0].id],
    SIBLING_MARKER,
    "sibling run state must remain intact after component deletion"
  );

  // Simulate browser refresh with the persisted catalogue and run store
  const persistedJson = await catalogueStore.readCatalogueJson();
  const persistedWorkflows = persistedJson ? JSON.parse(persistedJson) : api.getWorkflowsForTest();
  const refreshed = loadRunHarness(backend, storeAfterDelete);
  refreshed.api.setWorkflowsForTest(persistedWorkflows);
  refreshed.api.setSelectedWorkflowIdForTest(ljWf.id);
  refreshed.api.setLearningJourneyCommissioningPreviewContextForTest({
    page,
    sourceWorkflowId: ljWf.id
  });

  // Recreate c1 via individual creation (also exercises immediate selectWorkflow -> Run mode)
  const recreated = refreshed.api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "practice",
    sourceWorkflowId: ljWf.id
  });
  assert.equal(recreated.ok, true);
  const c1New = recreated.workflow;
  assert.notEqual(c1New.id, c1Orig.id, "recreated workflow must have a fresh id");
  assert.equal(c1New.sourceCommissionId, "c1");
  assert.equal(c1New.steps.length, 5);
  assert.equal(c1New.steps[0].title, "Design Episode Plan");
  assert.equal(c1New.workflowBriefResolution.resolvedFactors.source_context, SHARED_CORPUS);
  assert.equal(c1New.workflowBriefResolution.resolvedFactors.commission_native_lo_bound, true);

  // Verify zero leakage into c1New from parent, sibling, or deleted c1Orig
  const finalRunStore = refreshed.api.loadWorkflowRunStateStoreForTest();
  const c1NewRec = finalRunStore[c1New.id] || {};
  const c1NewSerialized = JSON.stringify(c1NewRec);
  assert.ok(!c1NewSerialized.includes("PARENT_DISTINCTIVE_MARKER_991"));
  assert.ok(!c1NewSerialized.includes("SIBLING_DISTINCTIVE_MARKER_882"));
  assert.ok(!c1NewSerialized.includes("DELETED_C1_MARKER_773"));
  assert.equal(
    Object.keys(c1NewRec.capturedOutputs || {}).filter((k) => String(c1NewRec.capturedOutputs[k] || "").trim()).length,
    0,
    "recreated component must start with zero executable step captures"
  );
  const c1NewStatus = listPresentationMod.deriveWorkflowListAuthoringStatus(c1New, c1NewRec);
  assert.equal(c1NewStatus.label, "No data", "recreated component must show No data");

  // Parent and sibling captures are still intact
  assert.equal(finalRunStore[ljWf.id].capturedOutputs["lj-s5"], PARENT_MARKER);
  assert.equal(finalRunStore[c2Orig.id].capturedOutputs[c2Orig.steps[0].id], SIBLING_MARKER);
});
