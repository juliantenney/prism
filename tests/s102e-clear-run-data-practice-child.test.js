/**
 * Sprint 102E — Clear run data must empty Step 1 (and all steps) on a
 * commissioned Practice child, and stale in-flight saves must not restore
 * cleared captureRefs / stepCompleted via ABSENT≠DELETE merge.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const workflowResources = require("../lib/prism-workflow-resources.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

const STEP1 = "step-design-episode-plan";
const STEP2 = "step-design-learning-activities";
const STEP3 = "step-generate-assessment";
const STEP4 = "step-assemble-page";
const STEP5 = "step-verify-gam";

const EPISODE_PLAN_JSON = JSON.stringify({
  artifact_type: "page",
  schema_version: "2.0.0",
  title: "Comparing, judging and refining feedback",
  assembly_state: { current_stage: "episode_plan", enriched_by: ["episode_plan"] },
  episode_plans: [{ archetype: "apply", beats: [] }]
});

function createElementStub(tagName) {
  const tag = String(tagName || "div").toUpperCase();
  const el = {
    tagName: tag,
    value: "",
    textContent: "",
    innerHTML: "",
    open: false,
    returnValue: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
    }
  };
  return el;
}

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
      }
    }
  };
}

function practiceChildSteps() {
  return [
    {
      id: STEP1,
      title: "Design Episode Plan",
      canonical_step_id: "step_design_episode_plan",
      outputName: "page"
    },
    {
      id: STEP2,
      title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities",
      outputName: "page"
    },
    {
      id: STEP3,
      title: "Generate Assessment Items",
      canonical_step_id: "step_generate_assessment_items",
      outputName: "page"
    },
    {
      id: STEP4,
      title: "Assemble Learner Page",
      canonical_step_id: "step_assemble_learner_page",
      outputName: "page"
    },
    {
      id: STEP5,
      title: "Verify GAM Suitability",
      canonical_step_id: "step_verify_gam",
      outputName: "page"
    }
  ];
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const { storage, localStorage } = makeStorage(opts.seedStorage);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  [
    "clearWorkflowRunDataConfirmDialog",
    "clearWorkflowRunDataConfirmTitle",
    "clearWorkflowRunDataConfirmBody",
    "clearWorkflowRunDataConfirmCancel",
    "clearWorkflowRunDataConfirmSubmit",
    "workflowSteps",
    "toast"
  ].forEach((id) => {
    elementStore.set(id, createElementStub(id === "clearWorkflowRunDataConfirmDialog" ? "dialog" : "div"));
  });

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-test" },
    localStorage,
    confirm: () => false,
    URL: {
      createObjectURL: () => "blob:test",
      revokeObjectURL() {}
    },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    },
    __PRISM_TEST_HARNESS__: true
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  workflowResources.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage, elementStore, windowStub };
}

function buildFamily() {
  const parent = {
    id: "wf-lj-parent",
    name: "Feedback judgements journey",
    product: "learning_journey",
    steps: [{ id: "lj-s1", title: "Design Learning Journey" }]
  };
  const practice = {
    id: "wf-practice-c02",
    name: "Comparing, judging and refining feedback",
    product: "practice",
    sourceWorkflowId: parent.id,
    sourceCommissionId: "C02",
    steps: practiceChildSteps()
  };
  const sibling = {
    id: "wf-expository-c01",
    name: "Expository briefing",
    product: "expository",
    sourceWorkflowId: parent.id,
    sourceCommissionId: "C01",
    steps: [{ id: "ex-s1", title: "Design Episode Plan" }]
  };
  return { parent, practice, sibling };
}

function populatedRunRecord(workflowId) {
  return {
    captureRefs: {
      [STEP1]: { final: { resource_id: "rc-1" }, raw: { resource_id: "rc-1" } },
      [STEP2]: { final: { resource_id: "rc-2" }, raw: { resource_id: "rc-2" } },
      [STEP3]: { final: { resource_id: "rc-3" }, raw: { resource_id: "rc-3" } },
      [STEP4]: { final: { resource_id: "rc-4" }, raw: { resource_id: "rc-4" } },
      [STEP5]: { final: { resource_id: "rc-5" }, raw: { resource_id: "rc-5" } }
    },
    stepCompleted: {
      [STEP1]: true,
      [STEP2]: true,
      [STEP3]: true,
      [STEP4]: true,
      [STEP5]: true
    },
    capturedOutputs: {},
    capturedOutputsRaw: {},
    runIndex: 2
  };
}

test("Clear run data empties Practice child Step 1–5 and keeps commission identity", async () => {
  const { parent, practice, sibling } = buildFamily();
  const siblingRun = {
    captureRefs: {
      "ex-s1": { final: { resource_id: "rc-sib" }, raw: { resource_id: "rc-sib" } }
    },
    stepCompleted: { "ex-s1": true },
    capturedOutputs: {},
    capturedOutputsRaw: {}
  };
  const { api, storage } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([parent, practice, sibling]),
      [RUNKEY]: JSON.stringify({
        [practice.id]: populatedRunRecord(practice.id),
        [sibling.id]: siblingRun
      })
    }
  });

  api.setWorkflowsForTest([
    JSON.parse(JSON.stringify(parent)),
    JSON.parse(JSON.stringify(practice)),
    JSON.parse(JSON.stringify(sibling))
  ]);
  api.setSelectedWorkflowIdForTest(practice.id);
  api.setWorkflowRunCapturedOutputsForTest({
    [STEP1]: EPISODE_PLAN_JSON,
    [STEP2]: '{"artifact_type":"page","title":"activities"}',
    [STEP3]: '{"artifact_type":"page","title":"assessment"}',
    [STEP4]: '{"artifact_type":"page","title":"assembled"}',
    [STEP5]: '{"artifact_type":"page","title":"verified"}'
  });
  api.setWorkflowRunCaptureRefsForTest(populatedRunRecord(practice.id).captureRefs);
  api.setWorkflowRunStepCompletedForTest(populatedRunRecord(practice.id).stepCompleted);

  const put1 = await workflowResources.putTextResource({
    workflow_id: practice.id,
    slot_key: "run_capture:" + STEP1 + ":final",
    mime_type: "application/json",
    text_payload: EPISODE_PLAN_JSON
  });
  assert.equal(put1.ok, true);

  await api.executeClearWorkflowRunDataForTest(practice.id);

  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
  assert.equal(Object.keys(api.getWorkflowRunCaptureRefsForTest()).length, 0);
  assert.equal(Object.keys(api.getWorkflowRunStepCompletedForTest()).length, 0);
  assert.equal(api.isWorkflowRunStepCompletedForTest(STEP1), false);
  assert.equal(api.isWorkflowRunStepCompletedForTest(STEP5), false);

  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(runStore[practice.id], undefined);
  assert.ok(runStore[sibling.id]);
  assert.equal(runStore[sibling.id].stepCompleted["ex-s1"], true);

  const workflows = api.getWorkflowsForTest();
  const clearedPractice = workflows.find((w) => w.id === practice.id);
  assert.ok(clearedPractice);
  assert.equal(clearedPractice.name, "Comparing, judging and refining feedback");
  assert.equal(clearedPractice.product, "practice");
  assert.equal(clearedPractice.sourceWorkflowId, parent.id);
  assert.equal(clearedPractice.sourceCommissionId, "C02");
  assert.equal(clearedPractice.steps.length, 5);
  assert.equal(clearedPractice.steps[0].id, STEP1);
  assert.equal(clearedPractice.steps[0].title, "Design Episode Plan");

  const parentStill = workflows.find((w) => w.id === parent.id);
  const siblingStill = workflows.find((w) => w.id === sibling.id);
  assert.ok(parentStill);
  assert.ok(siblingStill);
  assert.equal(siblingStill.sourceCommissionId, "C01");
});

test("Stale capture persist after Clear cannot restore Step 1 output or toast success", async () => {
  const { parent, practice, sibling } = buildFamily();
  const { api, storage } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([parent, practice, sibling]),
      [RUNKEY]: JSON.stringify({
        [practice.id]: populatedRunRecord(practice.id)
      })
    }
  });

  api.setWorkflowsForTest([
    JSON.parse(JSON.stringify(parent)),
    JSON.parse(JSON.stringify(practice)),
    JSON.parse(JSON.stringify(sibling))
  ]);
  api.setSelectedWorkflowIdForTest(practice.id);
  api.setWorkflowRunCapturedOutputsForTest({ [STEP1]: EPISODE_PLAN_JSON });
  api.setWorkflowRunCaptureRefsForTest({
    [STEP1]: { final: { resource_id: "rc-stale" }, raw: { resource_id: "rc-stale" } }
  });
  api.setWorkflowRunStepCompletedForTest({ [STEP1]: true });

  const epochBefore = api.getWorkflowRunClearEpochForTest(practice.id);
  assert.equal(epochBefore, 0);

  // Simulate an in-flight persist that closed over pre-clear payloads + epoch.
  const staleEpoch = epochBefore;
  const stalePersist = api.enqueueWorkflowRunCapturePersistForTest(
    practice.id,
    STEP1,
    function () {
      return api
        .persistWorkflowRunCapturePayloadForStepForTest(
          practice.id,
          STEP1,
          EPISODE_PLAN_JSON,
          EPISODE_PLAN_JSON,
          { clearEpoch: staleEpoch }
        )
        .then(function (payloadPersist) {
          return api.persistWorkflowRunStateForWorkflowForTest(practice.id, {
            source: "stale_clear_race",
            observedStepId: STEP1,
            clearEpoch: staleEpoch
          }).then(function (runstateResult) {
            return {
              payloadPersist: payloadPersist,
              runstateResult: runstateResult
            };
          });
        });
    }
  );

  await api.executeClearWorkflowRunDataForTest(practice.id);

  const staleOutcome = await stalePersist;
  assert.ok(
    (staleOutcome && staleOutcome.abandoned) ||
      (staleOutcome &&
        staleOutcome.payloadPersist &&
        staleOutcome.payloadPersist.abandoned) ||
      (staleOutcome &&
        staleOutcome.runstateResult &&
        staleOutcome.runstateResult.abandoned),
    "stale persist must abandon after clear"
  );

  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
  assert.equal(Object.keys(api.getWorkflowRunCaptureRefsForTest()).length, 0);

  // Late merge-style persist without clearEpoch must also abandon if epoch moved
  // during the call (simulates ABSENT≠DELETE race against pre-clear existing).
  const late = await api.persistWorkflowRunStateForWorkflowForTest(practice.id, {
    source: "post_clear_autosave",
    toastType: "",
    touchUpdatedAt: false,
    clearEpoch: staleEpoch
  });
  assert.equal(late.abandoned, true);

  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(runStore[practice.id], undefined);

  // Refresh / reselect must not restore Step 1.
  api.restoreWorkflowRunStateForWorkflowForTest(practice.id);
  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
  assert.equal(Object.keys(api.getWorkflowRunCaptureRefsForTest()).length, 0);
});

test("Clear run data bumps epoch before purge so enqueue work is abandoned", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  const start = source.indexOf("function executeClearWorkflowRunData");
  const end = source.indexOf("\n  function requestClearWorkflowRunDataConfirmation", start);
  const body = source.slice(start, end > 0 ? end : start + 1600);
  const bumpAt = body.indexOf("bumpWorkflowRunClearEpoch");
  const purgeAt = body.indexOf("deleteRunCaptureTextResourcesForWorkflow");
  assert.ok(bumpAt > 0, "must bump clear epoch");
  assert.ok(purgeAt > bumpAt, "epoch bump must precede run-capture purge");
  assert.match(body, /invalidateWorkflowRunCapturePersistChains/);
  assert.match(body, /clearUnsavedWorkflowRunCapture/);
});
