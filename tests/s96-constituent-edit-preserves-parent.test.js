/**
 * Edit → Save must not detach a Learning Journey constituent from its parent.
 *
 * gatherWorkflowDetailFormData only collects DOM-editable fields; without an
 * explicit carry-forward, handleSaveWorkflow replaced the stored record and
 * dropped sourceWorkflowId / sourceCommissionId / product.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
const hierarchy = require("../lib/learning-journey-workflow-hierarchy.js");
const intake = require("../lib/first-class-commission-intake.js");
const design = require("../lib/learning-journey-design-page.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function makeStorage(seed) {
  const storage = Object.assign({}, seed || {});
  return {
    storage,
    localStorage: {
      getItem(k) {
        return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
      },
      setItem(k, v) {
        storage[k] = String(v);
      },
      removeItem(k) {
        delete storage[k];
      },
      key(i) {
        return Object.keys(storage)[i] || null;
      },
      get length() {
        return Object.keys(storage).length;
      }
    }
  };
}

function buildPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "STEM – Making Sense of Experimental Data",
    activities: [],
    sections: [
      {
        section_id: "exp_2",
        title: "Understanding Descriptive Statistics",
        order: 1,
        exposition: "C2"
      }
    ],
    commissions: [
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 1,
        title: "Understanding Descriptive Statistics",
        product_id: "expository",
        status: "supported",
        specification_text: "C2 SPEC — descriptive statistics.",
        journey_context_text: "Builds on C1.",
        dependencies: "c1"
      }
    ],
    learning_journey: {
      design_intent: "Author intent",
      continuity: "Shared continuity"
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
}

function parentJourney(id) {
  return {
    id: id,
    name: "STEM – Making Sense of Experimental Data",
    product: "learning_journey",
    selectedDomains: ["learning-design"],
    steps: [{ id: "dp", title: "Design Page", outputName: "design_page" }],
    createdAt: 1,
    updatedAt: 1
  };
}

function loadApi() {
  const { storage, localStorage } = makeStorage();
  catalogueStore.resetStorageBackendForTests();
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/learning-journey-workflow-hierarchy.js"
    ]
  });
  loaded.window.localStorage = localStorage;
  if (loaded.sandbox) loaded.sandbox.localStorage = localStorage;
  loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox) {
    loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    if (loaded.sandbox.globalThis) {
      loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    }
  }
  if (loaded.window.Utils && !loaded.window.Utils.uuid) {
    let n = 0;
    loaded.window.Utils.uuid = function () {
      return "wf-test-" + String(++n);
    };
  }
  if (loaded.sandbox) loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
  if (loaded.window) loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intake;
  }
  return { api: loaded.api, storage, loaded };
}

async function awaitMaybe(value) {
  if (value && typeof value.then === "function") return value;
  return value;
}

function assertNestedUnderParent(workflows, parentId, constituentId) {
  const built = hierarchy.buildLearningJourneyWorkflowListRows(workflows, workflows, {
    expandedById: { [parentId]: true }
  });
  assert.equal(
    !!built.childWorkflowIds[constituentId],
    true,
    "constituent must be classified as a nested child"
  );
  assert.equal(built.childWorkflowIds[constituentId], parentId);
  const parentRow = (built.rows || []).find(function (row) {
    return row && row.type === "lj_parent" && row.workflow && row.workflow.id === parentId;
  });
  assert.ok(parentRow, "parent remains a Learning Journey list parent");
  assert.equal(
    (parentRow.children || []).some(function (child) {
      return child && child.id === constituentId;
    }),
    true,
    "constituent must remain nested under parent"
  );
  assert.equal(
    (built.rows || []).some(function (row) {
      return (
        row &&
        row.type === "standalone" &&
        row.workflow &&
        row.workflow.id === constituentId
      );
    }),
    false,
    "constituent must not appear as a top-level standalone workflow"
  );
}

function seedStepEditor(doc, stepsRoot, step) {
  const li = doc.createElement("li");
  li.className = "workflow-step";
  li.classList = {
    contains(name) {
      return name === "workflow-step";
    },
    add() {},
    remove() {},
    toggle() {
      return false;
    }
  };
  const stepId = String((step && step.id) || "step-1");
  li.setAttribute("data-step-id", stepId);
  li.__workflowStepId = stepId;
  const title = doc.createElement("input");
  title.setAttribute("data-field", "title");
  title.value = String((step && step.title) || "Expository");
  const ai = doc.createElement("textarea");
  ai.setAttribute("data-field", "additionalInstruction");
  ai.value = String((step && step.additional_instruction) || "test");
  const output = doc.createElement("input");
  output.setAttribute("data-field", "outputName");
  output.value = String((step && step.outputName) || "page");
  li.querySelector = function (sel) {
    if (String(sel).indexOf("title") !== -1) return title;
    if (String(sel).indexOf("additionalInstruction") !== -1) return ai;
    if (String(sel).indexOf("outputName") !== -1) return output;
    return null;
  };
  li.children = [title, ai, output];
  stepsRoot.children = [li];
  stepsRoot.appendChild(li);
  return ai;
}

test("carryForward copies LJ provenance onto gather draft missing those fields", () => {
  const { api } = loadApi();
  const existing = {
    id: "wf-c2",
    name: "Understanding Descriptive Statistics",
    product: "expository",
    startingPoint: "topic",
    sourceWorkflowId: "wf-lj-parent",
    sourceCommissionId: "c2",
    authoritativeLearningOutcomes: { outcomes: ["o1"] },
    scopeAndConstraints: "scope_scale: short"
  };
  const draft = {
    id: "wf-c2",
    name: "Understanding Descriptive Statistics",
    selectedDomains: ["learning-design"],
    steps: [{ id: "s1", title: "Expository", additional_instruction: "test" }]
  };
  api.carryForwardWorkflowProvenanceFieldsFromExistingForTest(existing, draft);
  assert.equal(draft.sourceWorkflowId, "wf-lj-parent");
  assert.equal(draft.sourceCommissionId, "c2");
  assert.equal(draft.product, "expository");
  assert.equal(draft.startingPoint, "topic");
  assert.equal(draft.scopeAndConstraints, "scope_scale: short");
  assert.equal(JSON.stringify(draft.authoritativeLearningOutcomes), JSON.stringify({ outcomes: ["o1"] }));
});

test("handleSaveWorkflow preserves parent association when editing a step instruction", async () => {
  const parentId = "wf-lj-save-handler";
  const constituentId = "wf-c2-save-handler";
  const { api, loaded } = loadApi();
  const c2 = {
    id: constituentId,
    name: "Understanding Descriptive Statistics",
    product: "expository",
    startingPoint: "topic",
    sourceWorkflowId: parentId,
    sourceCommissionId: "c2",
    selectedDomains: ["learning-design"],
    artefacts: "",
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: { audience: "", goal: "stats", constraints: "" },
    steps: [
      {
        id: "step-1",
        title: "Expository Materials",
        prompt_source_type: "none",
        prompt_source: "none",
        promptId: "",
        override_prompt_body: "",
        inputKind: "text",
        outputName: "page",
        notes: "",
        inputBindings: [],
        additional_instruction: ""
      }
    ],
    createdAt: 10,
    updatedAt: 10
  };

  api.setWorkflowsForTest([parentJourney(parentId), c2]);
  api.setSelectedWorkflowIdForTest(constituentId);
  api.selectWorkflowForTest(constituentId);

  const nameInput = loaded.window.document.getElementById("workflowName");
  assert.ok(nameInput, "expected workflowName input");
  nameInput.value = c2.name;

  const stepsRoot = loaded.window.document.getElementById("workflowSteps");
  assert.ok(stepsRoot, "expected workflowSteps container");
  seedStepEditor(loaded.window.document, stepsRoot, {
    id: "step-1",
    title: "Expository Materials",
    outputName: "page",
    additional_instruction: "test"
  });

  const gathered = api.gatherWorkflowDetailFormDataForTest();
  assert.equal(gathered.sourceWorkflowId, undefined);
  assert.equal(gathered.sourceCommissionId, undefined);
  assert.equal(gathered.product, undefined);
  assert.equal(String((gathered.steps[0] && gathered.steps[0].additional_instruction) || ""), "test");

  api.handleSaveWorkflowForTest();
  await awaitMaybe(api.saveWorkflowsForTest());

  const saved = api.getWorkflowsForTest().find((wf) => wf && wf.id === constituentId);
  assert.ok(saved);
  assert.equal(saved.sourceWorkflowId, parentId);
  assert.equal(saved.sourceCommissionId, "c2");
  assert.equal(saved.product, "expository");
  assert.equal(String((saved.steps[0] && saved.steps[0].additional_instruction) || ""), "test");
  assertNestedUnderParent(api.getWorkflowsForTest(), parentId, constituentId);
});

test("commissioned constituent edit persists nesting through IndexedDB reload", async () => {
  const parentId = "wf-lj-stem-parent";
  const { api, loaded } = loadApi();
  assert.equal(design.validateLearningJourneyDesignPage(buildPage()).ok, true);

  api.setWorkflowsForTest([parentJourney(parentId)]);
  await awaitMaybe(api.saveWorkflowsForTest());
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: buildPage(),
    sourceWorkflowId: parentId
  });

  const created = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c2",
      sectionId: "exp_2",
      productId: "expository",
      sourceWorkflowId: parentId
    })
  );
  assert.equal(created.ok, true, created.code || "");
  const constituentId = created.workflow.id;
  assert.equal(created.workflow.sourceWorkflowId, parentId);
  assert.equal(created.workflow.sourceCommissionId, "c2");

  api.setSelectedWorkflowIdForTest(constituentId);
  api.selectWorkflowForTest(constituentId);
  const nameEl = loaded.window.document.getElementById("workflowName");
  if (nameEl) nameEl.value = String(created.workflow.name || "Understanding Descriptive Statistics");

  const firstStep = (created.workflow.steps || [])[0] || { id: "step-1", title: "Expository" };
  const stepsRoot = loaded.window.document.getElementById("workflowSteps");
  assert.ok(stepsRoot);
  seedStepEditor(loaded.window.document, stepsRoot, {
    id: firstStep.id,
    title: firstStep.title,
    outputName: firstStep.outputName || "page",
    additional_instruction: "test"
  });

  api.handleSaveWorkflowForTest();
  await awaitMaybe(api.saveWorkflowsForTest());

  const afterSave = api.getWorkflowsForTest().find((wf) => wf && wf.id === constituentId);
  assert.equal(afterSave.sourceWorkflowId, parentId);
  assert.equal(afterSave.sourceCommissionId, "c2");
  assert.equal(String((afterSave.steps[0] && afterSave.steps[0].additional_instruction) || ""), "test");
  assertNestedUnderParent(api.getWorkflowsForTest(), parentId, constituentId);

  const idbRaw = await catalogueStore.readCatalogueJson();
  assert.ok(idbRaw, "expected durable IndexedDB catalogue after save");
  const idbC2 = JSON.parse(idbRaw).find((wf) => wf && wf.id === constituentId);
  assert.ok(idbC2);
  assert.equal(idbC2.sourceWorkflowId, parentId);
  assert.equal(idbC2.sourceCommissionId, "c2");
  assert.equal(String((idbC2.steps[0] && idbC2.steps[0].additional_instruction) || ""), "test");

  api.setWorkflowsForTest([]);
  await api.loadWorkflowsForTest();
  const reloaded = api.getWorkflowsForTest().find((wf) => wf && wf.id === constituentId);
  assert.ok(reloaded);
  assert.equal(reloaded.sourceWorkflowId, parentId);
  assert.equal(reloaded.sourceCommissionId, "c2");
  assert.equal(String((reloaded.steps[0] && reloaded.steps[0].additional_instruction) || ""), "test");
  assertNestedUnderParent(api.getWorkflowsForTest(), parentId, constituentId);
});
