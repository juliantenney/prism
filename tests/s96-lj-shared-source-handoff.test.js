/**
 * Phase 1 — Learning Journey authoritative shared-source handoff to constituents.
 *
 * Parent LJ persists source_context; commission intake stamps it onto each
 * constituent workflowBriefResolution so prompts can preserve exact values.
 * Does not enable Normalize Content or redesign LJ Create.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const design = require("../lib/learning-journey-design-page.js");
const intake = require("../lib/first-class-commission-intake.js");
const family = require("../lib/first-class-workflow-family.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const TABLET_DATASET = [
  "Illustrative laboratory dataset (fictional — not real experimental evidence).",
  "Experiment: soluble tablet dissolution time",
  "Cool water (20°C): 82, 79, 85, 81, 83, 80 seconds",
  "Warm water (40°C): 43, 46, 44, 42, 45, 44 seconds",
  "Conditions: identical tablets, water volume and agitation"
].join("\n");

const SPEC_C1 =
  "Educational job: Help learners compare cool-water and warm-water dissolution times from the shared laboratory dataset. Do not invent replacement timings.";
const SPEC_C2 =
  "Educational job: Explain what the shared dissolution dataset shows about temperature and dissolution rate. Preserve the supplied timings exactly.";
const JOURNEY_C1 = "Opening experience. Later components reuse the same laboratory dataset.";
const JOURNEY_C2 =
  "Builds on the opening comparison. Preserve the established laboratory dataset values.";

function loadApi() {
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  catalogueStore.resetStorageBackendForTests();
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js"
    ]
  });
  if (loaded.window && loaded.window.Utils && !loaded.window.Utils.uuid) {
    loaded.window.Utils.uuid = function () {
      return "wf-test-" + String(Date.now()) + "-" + String(Math.random()).slice(2, 8);
    };
  }
  const intakeApi = require("../lib/first-class-commission-intake.js");
  if (loaded.sandbox) loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.window) loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  }
  if (loaded.window) loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox) {
    loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    if (loaded.sandbox.globalThis) {
      loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    }
  }
  return loaded;
}

async function awaitMaybe(value) {
  if (value && typeof value.then === "function") return value;
  return value;
}

function buildPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Tablet Dissolution Investigation",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Investigate how water temperature affects tablet dissolution."
      },
      {
        section_id: "exp_1",
        title: "Compare dissolution times",
        order: 2,
        exposition: "Compare cool and warm water timings."
      },
      {
        section_id: "exp_2",
        title: "Explain the temperature effect",
        order: 3,
        exposition: "Explain what the dataset shows."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Compare dissolution times",
        product_id: "interactive",
        status: "supported",
        specification_text: SPEC_C1,
        journey_context_text: JOURNEY_C1,
        dependencies: ""
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Explain the temperature effect",
        product_id: "expository",
        status: "supported",
        specification_text: SPEC_C2,
        journey_context_text: JOURNEY_C2,
        dependencies: "c1"
      }
    ],
    learning_journey: {
      design_intent: "Use one shared illustrative dataset across components.",
      continuity: JOURNEY_C1
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "learning_requirements",
        "learning_progression",
        "learning_elements",
        "learning_commissions",
        "design_page"
      ],
      calls_model: true
    }
  };
}

function parentJourneyWorkflow(id, sourceContext) {
  return {
    id: id,
    name: "Tablet Dissolution Journey",
    product: "learning_journey",
    artefacts: sourceContext || "",
    workflowBriefResolution: {
      initialBrief: {
        topic: "Tablet dissolution",
        inputs: sourceContext || "",
        sourceContext: sourceContext || "",
        startingArtefact: sourceContext ? "provided_source_content" : "generate_from_topic"
      },
      resolvedFactors: {
        topic: "Tablet dissolution",
        source_context: sourceContext || "",
        original_brief: sourceContext
          ? "PURPOSE / FOCUS\nTablet dissolution\n\nBODY OF KNOWLEDGE / SOURCE MATERIAL\n" +
            sourceContext
          : "PURPOSE / FOCUS\nTablet dissolution"
      }
    }
  };
}

function assertExactDataset(text) {
  const body = String(text || "");
  assert.match(body, /Cool water \(20°C\): 82, 79, 85, 81, 83, 80 seconds/);
  assert.match(body, /Warm water \(40°C\): 43, 46, 44, 42, 45, 44 seconds/);
  assert.match(body, /identical tablets, water volume and agitation/);
}

test("intakeCommission persists sourceContext on deliverySeed without changing topology", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC_C1,
    focus: "Compare dissolution times",
    journeyContextText: JOURNEY_C1,
    sourceContext: TABLET_DATASET,
    sourceJourneyWorkflowId: "wf-lj-tablet",
    sourceCommissionId: "c1"
  });
  assert.equal(result.ok, true);
  assert.equal(result.family.deliverySeed.source_context, TABLET_DATASET);
  assert.equal(result.family.deliverySeed.commission_specification, SPEC_C1);
  assert.notEqual(result.family.deliverySeed.source_context, SPEC_C1);
  assert.equal(result.createSeed.sourceContext, TABLET_DATASET);
  assert.equal(result.createSeed.sourceMaterial, TABLET_DATASET);
  assert.match(result.createSeed.inputs, /SOURCE CONTEXT/);
  assert.match(result.createSeed.inputs, /82, 79, 85, 81, 83, 80/);
  assert.deepEqual(result.family.titles, family.INTERACTIVE_TITLES.slice());
  assert.equal(result.family.titles.indexOf("Normalize Content"), -1);
});

test("intake without sourceContext leaves shared source empty and keeps prior sourceMaterial behaviour", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC_C1,
    focus: "Compare dissolution times"
  });
  assert.equal(result.ok, true);
  assert.equal(result.family.deliverySeed.source_context, undefined);
  assert.equal(result.createSeed.sourceContext, "");
  assert.equal(result.createSeed.sourceMaterial, SPEC_C1);
  assert.doesNotMatch(result.createSeed.inputs, /SOURCE CONTEXT/);
});

test("commissionToIntakeEnvelope accepts opts.sourceContext without touching specification fields", () => {
  const page = buildPage();
  const commission = design.resolveCommissionFromPage(page, "c1");
  const envelope = design.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj-tablet",
    focus: commission.title,
    sourceContext: TABLET_DATASET
  });
  assert.equal(envelope.sourceContext, TABLET_DATASET);
  assert.equal(envelope.specificationText, SPEC_C1);
  assert.equal(envelope.journeyContextText, JOURNEY_C1);
  assert.doesNotMatch(envelope.specificationText, /82, 79, 85/);
  assert.doesNotMatch(envelope.journeyContextText, /82, 79, 85/);
});

test("two commissions inherit the exact parent dataset and preserve instruction", async () => {
  const { api } = loadApi();
  const page = buildPage();
  const parentId = "wf-lj-tablet-parent";
  api.setWorkflowsForTest([parentJourneyWorkflow(parentId, TABLET_DATASET)]);
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: parentId
  });

  assert.equal(api.readLearningJourneyAuthoritativeSourceContext(parentId), TABLET_DATASET);

  const first = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c1",
      sectionId: "exp_1",
      productId: "interactive",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(first.ok, true, first.code || "");
  assert.ok(first.workflow);

  const second = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c2",
      sectionId: "exp_2",
      productId: "expository",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(second.ok, true, second.code || "");
  assert.ok(second.workflow);

  const workflows = api.getWorkflowsForTest();
  const c1 = workflows.find(function (wf) {
    return wf && wf.sourceCommissionId === "c1";
  });
  const c2 = workflows.find(function (wf) {
    return wf && wf.sourceCommissionId === "c2";
  });
  assert.ok(c1 && c2, "expected two constituent workflows");
  assert.equal(c1.product, "interactive");
  assert.equal(c2.product, "expository");

  [c1, c2].forEach(function (wf) {
    const seed = wf.workflowBriefResolution.resolvedFactors;
    const initial = wf.workflowBriefResolution.initialBrief;
    assert.equal(seed.source_context, TABLET_DATASET);
    assert.equal(initial.sourceContext, TABLET_DATASET);
    assert.equal(seed.commission_specification.indexOf("82, 79, 85"), -1);
    assert.equal(String(seed.journey_context || "").indexOf("82, 79, 85"), -1);
    assert.equal(wf.startingPoint, "topic");
    assert.equal(
      (wf.steps || []).some(function (step) {
        return String(step.title || "") === "Normalize Content";
      }),
      false
    );

    const brief = api.composeCommissionedOriginalBrief(wf);
    assertExactDataset(brief);
    assert.match(brief, /AUTHORITATIVE SHARED SOURCE MATERIAL/);
    assert.match(brief, /Do not invent replacement or approximate values/);
    assert.match(brief, /only as required by COMMISSION SPECIFICATION/);
    assert.match(brief, /COMMISSION SPECIFICATION/);
  });
});

test("shared source survives save/reload-shaped reconstitution", async () => {
  const { api } = loadApi();
  const page = buildPage();
  const parentId = "wf-lj-tablet-reload";
  api.setWorkflowsForTest([parentJourneyWorkflow(parentId, TABLET_DATASET)]);
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: parentId
  });

  const created = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c1",
      sectionId: "exp_1",
      productId: "interactive",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(created.ok, true, created.code || "");

  // Simulate reload: only durable workflow fields remain.
  const saved = JSON.parse(JSON.stringify(created.workflow));
  api.setWorkflowsForTest([parentJourneyWorkflow(parentId, TABLET_DATASET), saved]);
  api.setSelectedWorkflowIdForTest(saved.id);

  const reloaded = api.getWorkflowsForTest().find(function (wf) {
    return wf && wf.id === saved.id;
  });
  assert.ok(reloaded);
  assert.equal(reloaded.workflowBriefResolution.resolvedFactors.source_context, TABLET_DATASET);

  const brief = api.composeCommissionedOriginalBrief(reloaded);
  assertExactDataset(brief);
  assert.match(brief, /AUTHORITATIVE SHARED SOURCE MATERIAL/);

  const honour = String(brief);
  // Honour block is attached at resolveStepPromptText time; brief itself carries preserve text.
  assert.match(honour, /Do not invent replacement or approximate values/);
});

test("commissions without parent shared material behave as before", async () => {
  const { api } = loadApi();
  const page = buildPage();
  const parentId = "wf-lj-no-shared";
  api.setWorkflowsForTest([parentJourneyWorkflow(parentId, "")]);
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: parentId
  });

  const created = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c1",
      sectionId: "exp_1",
      productId: "interactive",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(created.ok, true, created.code || "");
  const wf = created.workflow;
  assert.equal(String(wf.workflowBriefResolution.resolvedFactors.source_context || ""), "");
  assert.equal(String(wf.workflowBriefResolution.initialBrief.sourceContext || ""), "");
  assert.equal(wf.workflowBriefResolution.resolvedFactors.commission_specification, SPEC_C1);

  const brief = api.composeCommissionedOriginalBrief(wf);
  assert.doesNotMatch(brief, /SOURCE \/ CONTEXT MATERIAL/);
  assert.doesNotMatch(brief, /AUTHORITATIVE SHARED SOURCE MATERIAL/);
  assert.doesNotMatch(brief, /82, 79, 85, 81, 83, 80/);
  assert.match(brief, /COMMISSION SPECIFICATION/);
  assert.match(brief, /LEARNING JOURNEY CONTEXT/);
});

test("generation prompt delivery includes shared source for earliest Interactive stage", async () => {
  const { api } = loadApi();
  const page = buildPage();
  const parentId = "wf-lj-tablet-prompt";
  api.setWorkflowsForTest([parentJourneyWorkflow(parentId, TABLET_DATASET)]);
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: parentId
  });
  const created = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c1",
      sectionId: "exp_1",
      productId: "interactive",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(created.ok, true, created.code || "");
  const wf = created.workflow;
  const glc = (wf.steps || []).find(function (step) {
    return String(step.title || "") === "Generate Learning Content";
  });
  assert.ok(glc);
  const live = Object.assign({}, glc, {
    prompt_source_type: "local_override",
    override_prompt_body: "Generate teaching-ready learning_content from topic and audience."
  });
  const resolved = api.resolveStepPromptText(live, wf);
  assert.ok(resolved && resolved.text);
  assertExactDataset(resolved.text);
  assert.match(resolved.text, /AUTHORITATIVE SHARED SOURCE MATERIAL/);
  assert.match(resolved.text, /Authoritative shared source/);
  assert.match(resolved.text, /COMMISSION SPECIFICATION/);
});
