"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const styleCssPath = path.join(repoRoot, "style.css");
const RUNKEY = "promptr.workflows.runstate.v1";

function loadPrismTestApi(seedStorage) {
  const storage = Object.assign({}, seedStorage || {});
  const localStorage = {
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
      const keys = Object.keys(storage);
      return i >= 0 && i < keys.length ? keys[i] : null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => []
  };
  const windowStub = { document: documentStub, localStorage };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, storage };
}

function buildWorkflow(id) {
  return {
    id,
    name: "WF " + id,
    steps: [
      {
        id: "step-dla",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_learning_activities",
        outputName: "page"
      },
      {
        id: "step-page",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

test("DLA run guidance text is shown only for DLA steps", () => {
  const { api } = loadPrismTestApi();
  const dlaText = api.getWorkflowRunStepGuidanceTextForTest({
    id: "x",
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities"
  });
  assert.equal(
    dlaText,
    "Optional: If you want the activities in this resource to use specific evidence or source material, upload it with this prompt."
  );
  const nonDlaText = api.getWorkflowRunStepGuidanceTextForTest({
    id: "y",
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials"
  });
  assert.equal(nonDlaText, "");
});

test("Continue to Authoring readiness uses persisted Design Page state", () => {
  const { api, storage } = loadPrismTestApi();
  api.setWorkflowsForTest([buildWorkflow("wf-a"), buildWorkflow("wf-b")]);
  api.setSelectedWorkflowIdForTest("wf-a");

  assert.equal(api.isWorkflowRunAuthoringReadyForTest("wf-a"), false);

  api.setWorkflowRunCaptureRefsForTest({
    "step-page": { final: { resource_id: "wr-design-page-final" } }
  });
  api.persistWorkflowRunStateForWorkflowForTest("wf-a", { source: "test" });

  assert.equal(api.isWorkflowRunAuthoringReadyForTest("wf-a"), true);
  assert.equal(api.isWorkflowRunAuthoringReadyForTest("wf-b"), false);

  const rawStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.ok(rawStore["wf-a"], "wf-a runstate persisted");
  assert.equal(
    String(rawStore["wf-a"].captureRefs["step-page"].final.resource_id),
    "wr-design-page-final"
  );
});

test("legacy persisted Design Page capture also enables readiness", () => {
  const wf = buildWorkflow("wf-legacy");
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-legacy": {
      capturedOutputs: { "step-page": "{\"artifact_type\":\"page\"}" },
      capturedOutputsRaw: { "step-page": "{\"artifact_type\":\"page\"}" }
    }
  });
  const { api } = loadPrismTestApi(seeded);
  api.setWorkflowsForTest([wf]);
  assert.equal(api.workflowHasPersistedDesignPageResultForTest("wf-legacy"), true);
});

test("reload, switching workflows, and clear-runstate recompute authoring readiness", () => {
  const wfA = buildWorkflow("wf-ready");
  const wfB = buildWorkflow("wf-empty");
  const seeded = {};
  seeded[RUNKEY] = JSON.stringify({
    "wf-ready": {
      captureRefs: {
        "step-page": { final: { resource_id: "wr-ready" } }
      }
    }
  });
  const { api, storage } = loadPrismTestApi(seeded);
  api.setWorkflowsForTest([wfA, wfB]);

  assert.equal(api.isWorkflowRunAuthoringReadyForTest("wf-ready"), true);
  assert.equal(api.isWorkflowRunAuthoringReadyForTest("wf-empty"), false);

  api.clearPersistedWorkflowRunStateForWorkflowForTest("wf-ready");
  assert.equal(api.isWorkflowRunAuthoringReadyForTest("wf-ready"), false);
  const storeAfterClear = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(storeAfterClear["wf-ready"], undefined);
});

test("Run guidance presentation allows wrapped 2-3 line content compactly", () => {
  const css = fs.readFileSync(styleCssPath, "utf8");
  assert.match(css, /\.workflow-step-run-summary\s*\{[\s\S]*max-width:\s*72ch;/);
  assert.match(
    css,
    /\.workflow-step-run-summary\s*\[data-role="runner-summary-body"\]\s*\{[\s\S]*overflow-wrap:\s*anywhere;/
  );
  assert.match(css, /\.workflow-step-run-instructions\s*\{[\s\S]*max-width:\s*72ch;/);
});

test("Previous/Next remain grouped together; Copy is a separate step action", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const controlsStart = html.indexOf('<div id="workflowRunButtons" class="workflow-run-buttons">');
  assert.ok(controlsStart > 0, "run buttons block exists");
  const controlsEnd = html.indexOf("</div>", controlsStart);
  const controls = html.slice(controlsStart, controlsEnd);
  assert.match(controls, /id="workflowPrevStepBtn"/);
  assert.match(controls, /id="workflowNextStepBtn"/);
  assert.doesNotMatch(controls, /id="workflowRunCopyBtn"/);
  assert.match(html, /id="workflowRunCopyBtn"/);
  assert.match(html, /id="workflowRunChromePark"/);
});
