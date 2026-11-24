const test = require("node:test");
const assert = require("node:assert/strict");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const familyMod = require("../lib/first-class-workflow-family.js");
const bindMod = require("../lib/commission-native-lo-bind.js");
const intakeMod = require("../lib/first-class-commission-intake.js");
const designMod = require("../lib/learning-journey-design-page.js");
const statusMod = require("../lib/learning-journey-commission-production-status.js");

const SHARED_CORPUS = [
  "Correlation and Causation — Shared Authoritative Dataset.",
  "Ice cream sales and drowning incidents rise together in summer (r = 0.87).",
  "Confounding variable: ambient temperature."
].join("\n");

const EXPECTED_COMMISSION_NATIVE_PIPELINES = {
  practice: [
    "Design Episode Plan",
    "Design Learning Activities",
    "Generate Activity Materials",
    "Construct Learning Sequence",
    "Design Page"
  ],
  expository: [
    "Expository Journey Plan",
    "Expository Development",
    "Expository Materials",
    "Design Page"
  ],
  assessment_pack: [
    "Interpret Evidence Purpose",
    "Design Evidence Elicitation",
    "Author Formative Return",
    "Design Page"
  ],
  situated_task: [
    "Situation",
    "Activity",
    "Support",
    "Learning Return",
    "Design Page"
  ]
};

function makeFourProductPage(options) {
  const opts = options || {};
  const loObj = (stmt) => ({
    learning_outcomes: [
      {
        statement: stmt,
        related_concepts: ["correlation", "causation", "confounding"],
        cognitive_level: "analyse"
      }
    ],
    learner_level: "undergraduate",
    scope: "component"
  });

  // Cover canonical object, top-level array, wrapper alias, and structured commission property
  const c1Spec =
    "Practice job: spot confounding variables in headlines.\n\n" +
    bindMod.wrapComponentLearningOutcomes(
      loObj("Identify plausible confounding variables in observational claims.")
    );
  const c2Spec =
    "Expository job: explain why correlation does not imply causation.\n\n" +
    bindMod.COMPONENT_BEGIN +
    "\n" +
    JSON.stringify([
      {
        statement: "Explain three mechanisms linking correlated variables without direct causation.",
        related_concepts: ["confounding", "reverse causation"],
        cognitive_level: "understand"
      }
    ]) +
    "\n" +
    bindMod.COMPONENT_END;
  const c3Spec =
    "Assessment job: evaluate a media claim using evidence.\n\n" +
    bindMod.COMPONENT_BEGIN +
    "\n" +
    JSON.stringify({
      component_learning_outcomes: [
        {
          outcome: "Evaluate whether observational evidence supports a causal claim.",
          related_concepts: ["causal inference"],
          cognitive_level: "evaluate"
        }
      ]
    }) +
    "\n" +
    bindMod.COMPONENT_END;
  const c4Spec = "Situated task job: audit a workplace dashboard correlation.";

  const commissions = [
    {
      commission_id: "c1",
      section_id: "exp_1",
      order: 1,
      title: "Spotting Confounders",
      product_id: "practice",
      status: "supported",
      specification_text: c1Spec,
      journey_context_text: "Opening practice experience in Correlation and Causation."
    },
    {
      commission_id: "c2",
      section_id: "exp_2",
      order: 2,
      title: "Why Correlation Isn't Causation",
      product_id: "expository",
      status: "supported",
      specification_text: c2Spec,
      journey_context_text: "Builds on c1 headline confounder spotting."
    },
    {
      commission_id: "c3",
      section_id: "exp_3",
      order: 3,
      title: "Evaluating Causal Claims",
      product_id: "assessment_pack",
      status: "supported",
      specification_text: c3Spec,
      journey_context_text: "Assesses distinctions established in c1 and c2."
    },
    {
      commission_id: "c4",
      section_id: "exp_4",
      order: 4,
      title: "Dashboard Correlation Audit",
      product_id: "situated_task",
      status: "supported",
      specification_text: c4Spec,
      component_learning_outcomes: loObj("Audit a workplace metric correlation for causal validity."),
      journey_context_text: "Applies c1-c3 reasoning to a real workplace dashboard."
    }
  ];

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Correlation and Causation",
    activities: [],
    shared_authoritative_material: {
      status: "generated",
      content: SHARED_CORPUS
    },
    sections: [
      { section_id: "journey_intro", title: "Introduction", order: 1, exposition: "Welcome." },
      { section_id: "exp_1", title: "Spotting Confounders", order: 2, exposition: "Exp 1." },
      { section_id: "exp_2", title: "Why Correlation Isn't Causation", order: 3, exposition: "Exp 2." },
      { section_id: "exp_3", title: "Evaluating Causal Claims", order: 4, exposition: "Exp 3." },
      { section_id: "exp_4", title: "Dashboard Correlation Audit", order: 5, exposition: "Exp 4." }
    ],
    commissions,
    learning_journey: {
      design_intent: "Build causal reasoning.",
      continuity: "Shared ice-cream/temperature dataset across all four experiences.",
      journal: {
        enabled: true,
        title: "Your Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial confounder note",
            framing: "Capture your first confounder.",
            artefact_id: "c1.confounder_note"
          }
        ]
      }
    },
    assembly_state: { calls_model: true },
    ...(opts.extraPageFields || {})
  };
}

function makeParentWorkflow(id) {
  return {
    id,
    name: "Correlation and Causation",
    product: "learning_journey",
    steps: [
      { id: "s5", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
    ],
    workflowBriefResolution: {
      initialBrief: { product: "learning_journey", sourceContext: SHARED_CORPUS },
      resolvedFactors: { product: "learning_journey", source_context: SHARED_CORPUS }
    },
    artefacts: SHARED_CORPUS
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

function loadHarness(sharedBackend) {
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
      "lib/workflow-artefact-json-strict.js"
    ]
  });
  loaded.window.Utils = loaded.window.Utils || {};
  loaded.window.Utils.uuid = function () {
    uuidCounter += 1;
    return "wf-child-" + String(uuidCounter).padStart(3, "0") + "-" + Date.now();
  };
  loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeMod;
  }
  loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  }
  // Stub workflow resources deletion so handleDeleteWorkflow succeeds cleanly in VM tests.
  const resourcesStub = {
    deleteResourcesForWorkflow: async () => ({ ok: true })
  };
  loaded.window.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  loaded.sandbox.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_RESOURCES = resourcesStub;
  }
  // Auto-confirm delete dialog in VM tests.
  loaded.window.confirm = () => true;
  loaded.sandbox.confirm = () => true;
  return { loaded, api: loaded.api, catalogueStore, backend };
}

test("All four products produce commission-native pipelines via both batch and individual creation", async () => {
  const page = makeFourProductPage();

  // 1. Batch creation
  {
    const { api } = loadHarness();
    const ljWf = makeParentWorkflow("wf-lj-batch");
    api.setWorkflowsForTest([ljWf]);
    api.setSelectedWorkflowIdForTest("wf-lj-batch");
    api.setLearningJourneyCommissioningPreviewContextForTest({
      page,
      sourceWorkflowId: "wf-lj-batch"
    });

    const batchRes = await api.handleLearningJourneyBatchCreateComponentsActionForTest({
      page,
      sourceWorkflowId: "wf-lj-batch"
    });
    assert.equal(batchRes.ok, true);
    assert.equal(batchRes.created.length, 4);

    for (const item of batchRes.created) {
      const titles = Array.from(item.workflow.steps, (s) => String(s.title));
      assert.deepEqual(
        titles,
        EXPECTED_COMMISSION_NATIVE_PIPELINES[item.productId],
        `batch ${item.productId} must use commission-native pipeline`
      );
      assert.equal(
        item.workflow.workflowBriefResolution.resolvedFactors.commission_native_lo_bound,
        true,
        `batch ${item.productId} must carry commission_native_lo_bound`
      );
      assert.ok(
        item.workflow.workflowBriefResolution.resolvedFactors.commissioned_learning_outcomes
          .learning_outcomes.length >= 1,
        `batch ${item.productId} must carry authoritative commissioned LOs`
      );
      assert.equal(
        item.workflow.workflowBriefResolution.resolvedFactors.source_context,
        SHARED_CORPUS,
        `batch ${item.productId} must preserve shared source_context`
      );
    }
    const c1Wf = batchRes.created.find((c) => c.commissionId === "c1").workflow;
    assert.deepEqual(
      Array.from(
        c1Wf.workflowBriefResolution.resolvedFactors.required_learner_artefacts || [],
        (a) => a.artefactId
      ),
      ["c1.confounder_note"]
    );
  }

  // 2. Individual creation
  {
    const { api } = loadHarness();
    const ljWf = makeParentWorkflow("wf-lj-indiv");
    api.setWorkflowsForTest([ljWf]);
    api.setSelectedWorkflowIdForTest("wf-lj-indiv");
    api.setLearningJourneyCommissioningPreviewContextForTest({
      page,
      sourceWorkflowId: "wf-lj-indiv"
    });

    for (const commission of page.commissions) {
      const res = await api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
        commissionId: commission.commission_id,
        sectionId: commission.section_id,
        productId: commission.product_id,
        sourceWorkflowId: "wf-lj-indiv"
      });
      assert.equal(res.ok, true, `individual create failed for ${commission.product_id}`);
      const titles = Array.from(res.workflow.steps, (s) => String(s.title));
      assert.deepEqual(
        titles,
        EXPECTED_COMMISSION_NATIVE_PIPELINES[commission.product_id],
        `individual ${commission.product_id} must use commission-native pipeline`
      );
      assert.equal(
        res.workflow.workflowBriefResolution.resolvedFactors.commission_native_lo_bound,
        true
      );
    }
    await new Promise((r) => setTimeout(r, 25));
  }
});

test("Standalone product pipelines remain unchanged", () => {
  const standaloneInteractive = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: familyMod.LD_SELF_STUDY || "self_study_resource",
    focus: "Standalone topic",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(standaloneInteractive.ok, true);
  assert.equal(standaloneInteractive.steps.length, 8);
  assert.equal(standaloneInteractive.titles[0], "Generate Learning Content");

  const standaloneExpository = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: familyMod.LD_EXPOSITORY || "expository_resource",
    focus: "Standalone expository",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(standaloneExpository.ok, true);
  assert.equal(standaloneExpository.steps.length, 7);
  assert.equal(standaloneExpository.titles[0], "Generate Learning Content");

  const standaloneAp = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: familyMod.LD_ASSESSMENT_PACK || "assessment_pack",
    focus: "Standalone assessment",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(standaloneAp.ok, true);
  assert.equal(standaloneAp.steps.length, 7);
  assert.equal(standaloneAp.titles[0], "Generate Learning Content");

  const standaloneSituated = familyMod.buildFirstClassWorkflowFamily({
    ldCreateOutputType: familyMod.LD_SITUATED_TASK || "situated_task",
    focus: "Standalone situated",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(standaloneSituated.ok, true);
  assert.equal(standaloneSituated.steps.length, 5);
  assert.equal(standaloneSituated.titles[0], "Situation");
});

test("Deletion of a commissioned component immediately reconciles controls, batch count, refresh state, and allows clean recreation without duplicating or disturbing siblings", async () => {
  const page = makeFourProductPage();
  const { api, catalogueStore, backend } = loadHarness();
  const ljWf = makeParentWorkflow("wf-lj-life");
  api.setWorkflowsForTest([ljWf]);
  api.setSelectedWorkflowIdForTest("wf-lj-life");
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page,
    sourceWorkflowId: "wf-lj-life"
  });

  // Step 1: Create all 4 components
  const batchRes = await api.handleLearningJourneyBatchCreateComponentsActionForTest({
    page,
    sourceWorkflowId: "wf-lj-life"
  });
  assert.equal(batchRes.ok, true, "batchRes failed: " + JSON.stringify(batchRes));
  assert.equal(batchRes.created.length, 4);

  const c1Orig = batchRes.created.find((c) => c.commissionId === "c1").workflow;
  const c2Orig = batchRes.created.find((c) => c.commissionId === "c2").workflow;
  const c3Orig = batchRes.created.find((c) => c.commissionId === "c3").workflow;
  const c4Orig = batchRes.created.find((c) => c.commissionId === "c4").workflow;

  // Duplicate prevention before deletion
  const dupAttempt = await api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "practice",
    sourceWorkflowId: "wf-lj-life"
  });
  assert.equal(dupAttempt.ok, false);
  assert.equal(dupAttempt.code, "commission_already_commissioned");

  // Simulate cached Authoring preview HTML on the parent Learning Journey
  api.setUtilitiesLastHtmlForTest("<html>stale preview with Open Practice</html>");

  // Step 2: Delete c1 (Practice) via handleDeleteWorkflow
  api.setSelectedWorkflowIdForTest(c1Orig.id);
  await api.handleDeleteWorkflowForTest();

  // Cached preview HTML must be invalidated immediately so Authoring re-renders fresh state
  assert.equal(api.getUtilitiesLastHtmlForTest(), "");

  // Batch summary immediately reflects 3 of 4 created and 1 remaining (c1)
  const summaryAfterDelete = api.computeLearningJourneyBatchCommissionSummaryForTest(
    page,
    "wf-lj-life"
  );
  assert.equal(summaryAfterDelete.createdCount, 3);
  assert.equal(summaryAfterDelete.remainingCount, 1);
  assert.equal(summaryAfterDelete.showButton, true);
  assert.equal(summaryAfterDelete.buttonLabel, "Create remaining components (1)");
  assert.equal(summaryAfterDelete.outstandingCommissions[0].commission_id, "c1");

  // Individual preview status for c1 is back to not_commissioned -> Create Practice button rendered
  const derivedAfterDelete = statusMod.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj-life",
    page,
    workflows: api.getWorkflowsForTest(),
    productAcceptsCommission: (pid) => familyMod.productAcceptsCommission(pid)
  });
  assert.equal(derivedAfterDelete.byCommissionId.c1.status, statusMod.STATUS.NOT_COMMISSIONED);
  assert.equal(derivedAfterDelete.byCommissionId.c2.status, statusMod.STATUS.PRODUCTION);
  const previewAfterDelete = designMod.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj-life",
    productionByCommissionId: derivedAfterDelete.byCommissionId
  });
  assert.equal(previewAfterDelete.ok, true);
  assert.match(
    previewAfterDelete.html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"/
  );
  assert.match(
    previewAfterDelete.html,
    /data-lj-action="open-product"[^>]*data-lj-commission-id="c2"/
  );

  // Sibling identities remain intact
  const currentWorkflows = api.getWorkflowsForTest();
  assert.ok(currentWorkflows.some((w) => w.id === c2Orig.id));
  assert.ok(currentWorkflows.some((w) => w.id === c3Orig.id));
  assert.ok(currentWorkflows.some((w) => w.id === c4Orig.id));
  assert.ok(!currentWorkflows.some((w) => w.id === c1Orig.id));

  // Step 3: Reconciliation after simulated browser refresh (fresh harness reading persisted catalogue)
  const persistedJson = await catalogueStore.readCatalogueJson();
  const persistedWorkflows = persistedJson ? JSON.parse(persistedJson) : currentWorkflows;
  const refreshed = loadHarness(backend);
  refreshed.api.setWorkflowsForTest(persistedWorkflows);
  const summaryAfterRefresh = refreshed.api.computeLearningJourneyBatchCommissionSummaryForTest(
    page,
    "wf-lj-life"
  );
  assert.equal(summaryAfterRefresh.createdCount, 3);
  assert.equal(summaryAfterRefresh.remainingCount, 1);

  // Step 4: Recreate c1 via batch creation ("Create remaining components (1)")
  refreshed.api.setSelectedWorkflowIdForTest("wf-lj-life");
  refreshed.api.setLearningJourneyCommissioningPreviewContextForTest({
    page,
    sourceWorkflowId: "wf-lj-life"
  });
  const recreateRes = await refreshed.api.handleLearningJourneyBatchCreateComponentsActionForTest({
    page,
    sourceWorkflowId: "wf-lj-life"
  });
  assert.equal(recreateRes.ok, true);
  assert.equal(recreateRes.created.length, 1);
  assert.equal(recreateRes.created[0].commissionId, "c1");

  const c1Recreated = recreateRes.created[0].workflow;
  assert.notEqual(c1Recreated.id, c1Orig.id, "recreated workflow gets a fresh workflow id");
  assert.deepEqual(
    Array.from(c1Recreated.steps, (s) => String(s.title)),
    EXPECTED_COMMISSION_NATIVE_PIPELINES.practice,
    "recreated Practice workflow must use 5-step commission-native pipeline"
  );
  assert.equal(
    c1Recreated.workflowBriefResolution.resolvedFactors.source_context,
    SHARED_CORPUS,
    "recreated workflow preserves shared material"
  );
  assert.equal(
    c1Recreated.workflowBriefResolution.resolvedFactors.commission_native_lo_bound,
    true,
    "recreated workflow preserves commissioned learning outcomes"
  );
  assert.deepEqual(
    Array.from(
      c1Recreated.workflowBriefResolution.resolvedFactors.required_learner_artefacts || [],
      (a) => a.artefactId
    ),
    ["c1.confounder_note"],
    "recreated workflow preserves learner artefact contracts"
  );
  // Unaffected siblings still have their original IDs
  const finalWorkflows = refreshed.api.getWorkflowsForTest();
  assert.equal(finalWorkflows.filter((w) => w.sourceWorkflowId === "wf-lj-life").length, 4);
  assert.ok(finalWorkflows.some((w) => w.id === c2Orig.id));
  assert.ok(finalWorkflows.some((w) => w.id === c3Orig.id));
  assert.ok(finalWorkflows.some((w) => w.id === c4Orig.id));
});
