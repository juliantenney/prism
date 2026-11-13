/**
 * Final Run stage keeps Next visible; click must not advance past the workflow.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source };
}

function updateRunViewBody(source) {
  const start = source.indexOf("function updateWorkflowRunView");
  const end = source.indexOf("function setWorkflowMode(");
  assert.ok(start > 0 && end > start, "updateWorkflowRunView body");
  return source.slice(start, end);
}

function nextClickHandlerBody(source) {
  const start = source.indexOf('workflowNextStepBtn.addEventListener("click"');
  assert.ok(start > 0, "Next click handler");
  const end = source.indexOf("if (els.workflowModeRunBtn)", start);
  assert.ok(end > start, "Next click handler end");
  return source.slice(start, end);
}

test("Next button markup is present in the Run cluster", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="workflowNextStepBtn"/);
  assert.match(html, /id="workflowPrevStepBtn"/);
});

test("updateWorkflowRunView always shows Next, including on the final stage", () => {
  const { api, source } = loadPrismTestApi();
  const view = updateRunViewBody(source);
  assert.match(view, /setWorkflowRunNextButtonHidden\(false\)/);
  assert.doesNotMatch(view, /setWorkflowRunNextButtonHidden\(isFinalStep\)/);
  assert.match(view, /resolveWorkflowRunNextStepDisabledReason\(/);
  assert.equal(api.isWorkflowRunAtFinalStep(1, 2), true);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 2), false);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 1), true);
});

test("final-stage Next is disabled safely for multi-step and single-step workflows", () => {
  const { api } = loadPrismTestApi();
  assert.equal(
    api.resolveWorkflowRunNextStepDisabledReason({}, "s2", {}, null, 1, 2),
    "This is the final step."
  );
  assert.equal(
    api.resolveWorkflowRunNextStepDisabledReason({}, "only", {}, null, 0, 1),
    "This is the final step."
  );
  assert.equal(
    api.resolveWorkflowRunNextStepDisabledReason({}, "s1", {}, null, 0, 2),
    ""
  );
});

test("Next click handler does not advance beyond the final stage", () => {
  const { source } = loadPrismTestApi();
  const handler = nextClickHandlerBody(source);
  assert.match(handler, /isWorkflowRunAtFinalStep\(idx, liSteps\.length\)/);
  assert.match(handler, /updateWorkflowRunView\(\);\s*return;/);
  const guardIdx = handler.indexOf("isWorkflowRunAtFinalStep(idx, liSteps.length)");
  const advanceIdx = handler.indexOf("currentWorkflowRunIndex += 1");
  assert.ok(guardIdx > 0 && advanceIdx > guardIdx, "final-stage guard precedes index advance");
});
