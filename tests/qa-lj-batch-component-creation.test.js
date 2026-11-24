/**
 * QA authoring improvement — Batch creation of Learning Journey component workflows.
 *
 * Covers:
 * - Full batch creation from unstarted Learning Journey
 * - Remaining batch creation from partially authored Learning Journey (1 of 6 -> remaining 5)
 * - Preservation of existing component identities and run data
 * - Idempotency, duplicate prevention, and re-entrancy guard
 * - Preservation of commission order, parent-child links, shared source, LOs, and artefact contracts
 * - Partial failure preservation + accurate reporting + clean retry without duplicates
 * - Unsupported commissions excluded from created count and not treated as created
 * - Button labels, counts, and visibility across states (including non-LJ hidden)
 * - Existing individual creation behaviour preserved
 * - Single final navigation (My Workflows, parent expanded, first newly created selected)
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const SHARED_CORPUS = [
  "Illustrative economic evidence corpus (fictional — not real economic data).",
  "Dataset 1: Regional policy index and annual output growth (2015–2024).",
  "Preserve exact units and progressive-disclosure constraints across all commissions."
].join("\n");

function makeComponentLoBlock(statement) {
  return [
    "<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>",
    JSON.stringify({
      learning_outcomes: [
        {
          statement,
          related_concepts: ["correlation", "causation"],
          cognitive_level: "analyse",
          notes: ""
        }
      ],
      learner_level: "undergraduate",
      scope: "component",
      alignment_notes: "Aligned to journey outcomes."
    }),
    "<<<COMPONENT_LEARNING_OUTCOMES_END>>>"
  ].join("\n");
}

function buildSixCommissionJourneyPage(options) {
  const opts = options && typeof options === "object" ? options : {};
  const commissions = [
    {
      commission_id: "C01",
      section_id: "exp_1",
      order: 1,
      title: "Spotting Patterns vs Causes",
      product_id: "practice",
      status: "supported",
      specification_text:
        "Approximate learner time: 15 minutes. Learners inspect early regional series and record an initial judgement (E1).\n" +
        makeComponentLoBlock("Distinguish observed correlation from causal claims in panel data."),
      journey_context_text: "Opening commission using Dataset 1.",
      dependencies: ""
    },
    {
      commission_id: "C02",
      section_id: "exp_2",
      order: 2,
      title: "Why Associations Mislead",
      product_id: "expository",
      status: "supported",
      specification_text:
        "Approximate learner time: 15 minutes. Explain confounding, reverse causality, and omitted variables.\n" +
        makeComponentLoBlock("Explain three mechanisms by which correlation arises without causation."),
      journey_context_text:
        "Established scenario facts: fictional regional economic panels. Preceding activity: C01 asked learners for an initial judgement. Bring-forward: learners revisit their C01 judgement.",
      dependencies: "C01"
    },
    {
      commission_id: "C03",
      section_id: "exp_3",
      order: 3,
      title: "Diagnosing Confounders",
      product_id: "practice",
      status: "supported",
      specification_text:
        "Approximate learner time: 15 minutes. Diagnose candidate confounders across Datasets 4–6.\n" +
        makeComponentLoBlock("Diagnose plausible confounders in regional economic panels."),
      journey_context_text:
        "Established scenario facts: fictional regional economic panels. Preceding activity: C02 explained confounding mechanisms.",
      dependencies: "C01, C02"
    },
    {
      commission_id: "C04",
      section_id: "exp_4",
      order: 4,
      title: "Applying Causal Checks in Context",
      product_id: "situated_task",
      status: "supported",
      specification_text:
        "Approximate learner time: 15 minutes. Evaluate a real workplace or news claim for confounding and record a brief critique (E1).\n" +
        makeComponentLoBlock("Evaluate an everyday policy claim for causal validity."),
      journey_context_text:
        "Established scenario facts: fictional regional economic panels. Preceding activity: C03 diagnosed confounders.",
      dependencies: "C03"
    },
    {
      commission_id: "C05",
      section_id: "exp_5",
      order: 5,
      title: "Weighing Competing Explanations",
      product_id: "practice",
      status: "supported",
      specification_text:
        "Approximate learner time: 15 minutes. Compare competing causal models across Datasets 7–8.\n" +
        makeComponentLoBlock("Compare competing causal models using economic evidence."),
      journey_context_text:
        "Established scenario facts: fictional regional economic panels. Preceding activity: C04 evaluated a policy claim.",
      dependencies: "C03, C04"
    },
    {
      commission_id: "C06",
      section_id: "exp_6",
      order: 6,
      title: "Independent Causal Judgement",
      product_id: "assessment_pack",
      status: "supported",
      specification_text:
        "Approximate learner time: 15 minutes. Produce an independent evaluative judgement on Dataset 9 (E1).\n" +
        makeComponentLoBlock("Construct a justified causal judgement from multi-panel evidence."),
      journey_context_text:
        "Established scenario facts: fictional regional economic panels. Preceding activity: C01–C05 built causal reasoning. Bring-forward: learners revisit their C01 judgement and C04 critique.",
      dependencies: "C01, C04, C05"
    }
  ];

  const sections = [
    {
      section_id: "journey_intro",
      title: "Correlation and Causation",
      order: 1,
      exposition: "Explore how correlation differs from causation."
    }
  ].concat(
    commissions.map((c, i) => ({
      section_id: c.section_id,
      title: c.title,
      order: i + 2,
      exposition: "Framing for " + c.title
    }))
  );

  if (opts.includeUnsupported) {
    sections.push({
      section_id: "exp_7",
      title: "Live Seminar Debate",
      order: sections.length + 1,
      exposition: "Facilitated live seminar."
    });
    commissions.push({
      commission_id: "C07",
      section_id: "exp_7",
      order: 7,
      title: "Live Seminar Debate",
      product_id: "",
      status: "unsupported",
      specification_text: "Unsupported live seminar debate.",
      journey_context_text: "Established scenario facts: fictional regional economic panels.",
      dependencies: "C06"
    });
  }

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Correlation and Causation",
    shared_authoritative_material: { status: "generated", content: SHARED_CORPUS },
    activities: [],
    sections,
    commissions,
    learning_journey: {
      design_intent: "90-minute Learning Journey on correlation and causation.",
      continuity: "Shared economic evidence corpus.",
      journal: {
        enabled: true,
        title: "Your Learning Journal",
        entries: [
          {
            entry_id: "j1",
            order: 1,
            title: "Initial judgement",
            framing: "Your opening judgement.",
            artefact_id: "C01.E1"
          },
          {
            entry_id: "j2",
            order: 2,
            title: "Situated critique",
            framing: "Your contextual critique.",
            artefact_id: "C04.E1"
          },
          {
            entry_id: "j3",
            order: 3,
            title: "Final judgement",
            framing: "Your final causal judgement.",
            artefact_id: "C06.E1"
          }
        ]
      }
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
}

function makeParentWorkflow(id) {
  return {
    id,
    name: "Correlation and Causation",
    product: "learning_journey",
    steps: [{ id: "s5", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }],
    workflowBriefResolution: {
      initialBrief: { product: "learning_journey", sourceContext: SHARED_CORPUS },
      resolvedFactors: { product: "learning_journey", source_context: SHARED_CORPUS }
    },
    artefacts: SHARED_CORPUS
  };
}

function loadBatchHarness() {
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  catalogueStore.resetStorageBackendForTests();
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
      "lib/learning-journey-workflow-hierarchy.js"
    ]
  });
  loaded.window.Utils = loaded.window.Utils || {};
  loaded.window.Utils.uuid = function () {
    uuidCounter += 1;
    return "wf-child-" + String(uuidCounter).padStart(3, "0");
  };
  const intakeApi = require("../lib/first-class-commission-intake.js");
  loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  }
  loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  }

  // Wire element stubs for the batch bar so syncUtilitiesLjCommissionBatchBar updates them.
  const doc = loaded.window.document;
  const barEl = doc.getElementById("utilitiesLjCommissionBatchBar");
  const statusEl = doc.getElementById("utilitiesLjCommissionBatchStatus");
  const btnEl = doc.getElementById("utilitiesLjCommissionBatchBtn");
  const hiddenSet = new Set(["hidden"]);
  const btnHiddenSet = new Set(["hidden"]);
  barEl.classList = {
    add(c) { hiddenSet.add(c); },
    remove(c) { hiddenSet.delete(c); },
    contains(c) { return hiddenSet.has(c); },
    toggle(c, force) {
      if (force === undefined) {
        if (hiddenSet.has(c)) hiddenSet.delete(c);
        else hiddenSet.add(c);
      } else if (force) hiddenSet.add(c);
      else hiddenSet.delete(c);
    }
  };
  btnEl.classList = {
    add(c) { btnHiddenSet.add(c); },
    remove(c) { btnHiddenSet.delete(c); },
    contains(c) { return btnHiddenSet.has(c); },
    toggle(c, force) {
      if (force === undefined) {
        if (btnHiddenSet.has(c)) btnHiddenSet.delete(c);
        else btnHiddenSet.add(c);
      } else if (force) btnHiddenSet.add(c);
      else btnHiddenSet.delete(c);
    }
  };

  return {
    api: loaded.api,
    catalogueStore,
    barEl,
    statusEl,
    btnEl,
    loaded
  };
}

test("unstarted Learning Journey: labels, creates all 6 in order, preserves metadata, single final nav", async () => {
  const { api, barEl, statusEl, btnEl } = loadBatchHarness();
  const parent = makeParentWorkflow("wf-lj-unstarted");
  const page = buildSixCommissionJourneyPage();
  api.setWorkflowsForTest([parent]);
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);

  // Before creation: 0 of 6, button "Create all components (6)"
  const before = api.syncUtilitiesLjCommissionBatchBarForTest();
  assert.equal(before.applicable, true);
  assert.equal(before.createdCount, 0);
  assert.equal(before.remainingCount, 6);
  assert.equal(barEl.classList.contains("hidden"), false);
  assert.equal(statusEl.textContent, "0 of 6 components created");
  assert.equal(btnEl.classList.contains("hidden"), false);
  assert.equal(btnEl.textContent, "Create all components (6)");

  const outcome = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(outcome.ok, true);
  assert.equal(outcome.code, "batch_created");
  assert.equal(outcome.created.length, 6);
  assert.deepEqual(
    Array.from(outcome.created, (c) => c.commissionId),
    ["C01", "C02", "C03", "C04", "C05", "C06"]
  );

  // Verify parent-child links, shared source, LOs, and artefact contracts on created workflows.
  const allWfs = Array.from(api.getWorkflowsForTest());
  const children = allWfs.filter((w) => w.sourceWorkflowId === parent.id);
  assert.equal(children.length, 6);
  assert.deepEqual(
    children.map((w) => w.sourceCommissionId),
    ["C01", "C02", "C03", "C04", "C05", "C06"]
  );
  assert.deepEqual(
    children.map((w) => w.product),
    ["practice", "expository", "practice", "situated_task", "practice", "assessment_pack"]
  );
  for (const child of children) {
    assert.equal(child.workflowBriefResolution.resolvedFactors.source_context, SHARED_CORPUS);
    assert.ok(
      child.workflowBriefResolution.resolvedFactors.commissioned_learning_outcomes ||
        child.authoritativeLearningOutcomes,
      "Expected commissioned learning outcomes preserved on " + child.sourceCommissionId
    );
  }
  const c01Child = children.find((w) => w.sourceCommissionId === "C01");
  assert.ok(
    Array.isArray(c01Child.workflowBriefResolution.initialBrief.requiredLearnerArtefacts) &&
      c01Child.workflowBriefResolution.initialBrief.requiredLearnerArtefacts.length >= 1,
    "Expected C01 journal artefact contract preserved"
  );

  // Single final navigation: parent expanded + first newly created (C01) selected.
  const expanded = api.getLearningJourneyListExpandedByIdForTest();
  assert.equal(expanded[parent.id], true);
  assert.equal(api.getSelectedWorkflowIdForTest(), outcome.created[0].workflowId);
  assert.equal(outcome.firstCreatedWorkflowId, c01Child.id);

  // Returning to parent Authoring shows "All 6 components created" with no button.
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);
  const after = api.syncUtilitiesLjCommissionBatchBarForTest();
  assert.equal(after.createdCount, 6);
  assert.equal(after.remainingCount, 0);
  assert.equal(statusEl.textContent, "All 6 components created");
  assert.equal(btnEl.classList.contains("hidden"), true);
});

test("partially authored Learning Journey (1 of 6): creates remaining 5, preserves C01, selects C02", async () => {
  const { api, statusEl, btnEl } = loadBatchHarness();
  const parent = makeParentWorkflow("wf-lj-partial");
  const existingC01 = {
    id: "wf-existing-c01",
    name: "Spotting Patterns vs Causes",
    product: "practice",
    sourceWorkflowId: parent.id,
    sourceCommissionId: "C01",
    steps: [{ id: "step-c01-1", title: "Step 1", outputName: "draft" }],
    customRunMarker: "KEEP_EXISTING_RUN_STATE"
  };
  const page = buildSixCommissionJourneyPage();
  api.setWorkflowsForTest([parent, existingC01]);
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);

  const before = api.syncUtilitiesLjCommissionBatchBarForTest();
  assert.equal(before.createdCount, 1);
  assert.equal(before.remainingCount, 5);
  assert.equal(statusEl.textContent, "1 of 6 components created");
  assert.equal(btnEl.textContent, "Create remaining components (5)");

  const outcome = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(outcome.ok, true);
  assert.equal(outcome.created.length, 5);
  assert.deepEqual(
    Array.from(outcome.created, (c) => c.commissionId),
    ["C02", "C03", "C04", "C05", "C06"]
  );

  // C01 identity and state untouched; no duplicate C01.
  const allWfs = api.getWorkflowsForTest();
  const c01Matches = allWfs.filter((w) => w.sourceCommissionId === "C01");
  assert.equal(c01Matches.length, 1);
  assert.equal(c01Matches[0].id, "wf-existing-c01");
  assert.equal(c01Matches[0].customRunMarker, "KEEP_EXISTING_RUN_STATE");

  // Parent expanded and C02 (first newly created) selected.
  assert.equal(api.getLearningJourneyListExpandedByIdForTest()[parent.id], true);
  const c02Child = allWfs.find((w) => w.sourceCommissionId === "C02");
  assert.equal(api.getSelectedWorkflowIdForTest(), c02Child.id);
  assert.equal(outcome.firstCreatedWorkflowId, c02Child.id);

  // Idempotency: re-invoking batch creation creates 0 duplicates.
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);
  const repeat = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(repeat.ok, true);
  assert.equal(repeat.code, "nothing_to_create");
  assert.equal(repeat.created.length, 0);
  assert.equal(
    api.getWorkflowsForTest().filter((w) => w.sourceWorkflowId === parent.id).length,
    6
  );
});

test("partial failure preserves created workflows, reports failure, and retry succeeds without duplicates", async () => {
  const { api, catalogueStore, statusEl, btnEl } = loadBatchHarness();
  const parent = makeParentWorkflow("wf-lj-retry");
  const page = buildSixCommissionJourneyPage();
  api.setWorkflowsForTest([parent]);
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);

  // Fail persistence on the 3rd save call (C03) once, then allow all subsequent saves.
  const origWrite = catalogueStore.writeCatalogueJson;
  let saveCalls = 0;
  catalogueStore.writeCatalogueJson = function () {
    saveCalls += 1;
    if (saveCalls === 3) {
      return Promise.resolve({ ok: false, reason: "quota_exceeded", quota: true });
    }
    return origWrite.apply(this, arguments);
  };

  const firstRun = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(firstRun.ok, false);
  assert.equal(firstRun.partial, true);
  assert.equal(firstRun.code, "batch_partial_failure");
  assert.equal(firstRun.created.length, 5);
  assert.equal(firstRun.failed.length, 1);
  assert.equal(firstRun.failed[0].commissionId, "C03");

  // Restore persistence and verify bar offers retry for the 1 remaining component.
  catalogueStore.writeCatalogueJson = origWrite;
  const midSummary = api.syncUtilitiesLjCommissionBatchBarForTest();
  assert.equal(midSummary.createdCount, 5);
  assert.equal(midSummary.remainingCount, 1);
  assert.equal(statusEl.textContent, "5 of 6 components created");
  assert.equal(btnEl.textContent, "Create remaining components (1)");

  // Retry creates only C03, selects it, and leaves exactly 6 children total.
  const retryRun = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(retryRun.ok, true);
  assert.equal(retryRun.created.length, 1);
  assert.equal(retryRun.created[0].commissionId, "C03");
  assert.equal(
    api.getWorkflowsForTest().filter((w) => w.sourceWorkflowId === parent.id).length,
    6
  );
  assert.equal(api.getSelectedWorkflowIdForTest(), retryRun.created[0].workflowId);
});

test("unsupported commissions are not silently treated as created and bar hides for non-LJ", async () => {
  const { api, barEl, statusEl, btnEl } = loadBatchHarness();
  const parent = makeParentWorkflow("wf-lj-unsupported");
  const page = buildSixCommissionJourneyPage({ includeUnsupported: true });
  api.setWorkflowsForTest([parent]);
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);

  const before = api.syncUtilitiesLjCommissionBatchBarForTest();
  assert.equal(before.totalSupported, 6);
  assert.equal(before.unsupportedCount, 1);
  assert.match(statusEl.textContent, /0 of 6 components created \(1 unsupported\)/);
  assert.equal(btnEl.textContent, "Create all components (6)");

  const outcome = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(outcome.ok, true);
  assert.equal(outcome.created.length, 6);
  assert.equal(outcome.unsupportedCount, 1);
  assert.equal(
    api.getWorkflowsForTest().some((w) => w.sourceCommissionId === "C07"),
    false
  );

  // Non-LJ preview hides the commissioning bar completely.
  api.setLearningJourneyCommissioningPreviewContextForTest(null);
  assert.equal(barEl.classList.contains("hidden"), true);
});

test("existing individual component creation action continues to work unchanged", async () => {
  const { api } = loadBatchHarness();
  const parent = makeParentWorkflow("wf-lj-single");
  const page = buildSixCommissionJourneyPage();
  api.setWorkflowsForTest([parent]);
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);

  const single = await api.handleLearningJourneyPreviewCreateProductActionForTest({
    commissionId: "C01",
    sectionId: "exp_1",
    productId: "practice",
    sourceWorkflowId: parent.id
  });
  assert.equal(single.ok, true);
  assert.equal(single.commissionId, "C01");
  assert.equal(single.workflow.sourceCommissionId, "C01");
  assert.equal(single.workflow.sourceWorkflowId, parent.id);
  assert.equal(api.getSelectedWorkflowIdForTest(), single.workflow.id);
});

test("re-entrancy guard blocks overlapping batch activation while creation is in progress", async () => {
  const { api, catalogueStore, btnEl } = loadBatchHarness();
  const parent = makeParentWorkflow("wf-lj-reentrancy");
  const page = buildSixCommissionJourneyPage();
  api.setWorkflowsForTest([parent]);
  api.activateLearningJourneyCommissioningPreviewForTest(page, parent.id);

  const origWrite = catalogueStore.writeCatalogueJson;
  let releaseFirst;
  let intercepted = false;
  catalogueStore.writeCatalogueJson = function () {
    if (!intercepted) {
      intercepted = true;
      return new Promise((resolve) => {
        releaseFirst = () => resolve(origWrite.apply(catalogueStore, arguments));
      });
    }
    return origWrite.apply(this, arguments);
  };

  const firstPromise = api.handleLearningJourneyBatchCreateComponentsActionForTest();
  // Button is disabled while in progress and overlapping call is rejected immediately.
  assert.equal(btnEl.disabled, true);
  const overlapping = await api.handleLearningJourneyBatchCreateComponentsActionForTest();
  assert.equal(overlapping.ok, false);
  assert.equal(overlapping.code, "batch_in_progress");

  releaseFirst();
  const finished = await firstPromise;
  catalogueStore.writeCatalogueJson = origWrite;
  assert.equal(finished.ok, true);
  assert.equal(finished.created.length, 6);
  assert.equal(
    api.getWorkflowsForTest().filter((w) => w.sourceWorkflowId === parent.id).length,
    6
  );
});
