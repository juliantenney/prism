/**
 * Sprint 75 — C-01/C-02 Run → Authoring handoff and provenance clarity.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
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

test("final Run step exposes Continue to Authoring; mid-run does not (index rule)", () => {
  const { api, source } = loadPrismTestApi();
  assert.equal(api.isWorkflowRunAtFinalStep(0, 3), false);
  assert.equal(api.isWorkflowRunAtFinalStep(1, 3), false);
  assert.equal(api.isWorkflowRunAtFinalStep(2, 3), true);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 1), true);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 0), false);
  assert.match(source, /setWorkflowContinueToAuthoringVisible\(isWorkflowRunAtFinalStep\(idx, total\)\)/);
  assert.match(source, /function handleContinueToAuthoring\s*\(/);
  assert.match(source, /switchTab\("utilities"\)/);
});

test("Continue to Authoring UI is present; non-final path keeps Next semantics", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="workflowContinueToAuthoringBtn"/);
  assert.match(html, /Continue to Authoring/);
  assert.match(html, /id="workflowNextStepBtn"/);
  const { api } = loadPrismTestApi();
  assert.equal(
    api.resolveWorkflowRunNextStepDisabledReason({}, "s1", {}, null, 2, 3),
    "This is the final step."
  );
  assert.equal(api.resolveWorkflowRunNextStepDisabledReason({}, "s1", {}, null, 0, 3), "");
});

test("handoff navigates via switchTab utilities and does not clear selection in handler", () => {
  const { source } = loadPrismTestApi();
  const start = source.indexOf("function handleContinueToAuthoring");
  assert.ok(start > 0);
  const body = source.slice(start, start + 500);
  assert.match(body, /switchTab\("utilities"\)/);
  assert.doesNotMatch(body, /selectedWorkflowId\s*=\s*null/);
  assert.doesNotMatch(body, /clearWorkflowRunCaptureState/);
  assert.doesNotMatch(body, /handleUtilitiesAssembleFromCurrentWorkflowRun/);
});

test("Authoring surfaces selected and assembled-from context elements", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="utilitiesWorkflowContext"/);
  assert.match(html, /id="utilitiesSelectedWorkflowLabel"/);
  assert.match(html, /id="utilitiesAssembledFromLabel"/);
  assert.match(html, /id="utilitiesWorkflowMismatchWarning"/);
  assert.match(html, /role="status"/);
});

test("provenance extraction and selected-workflow labels", () => {
  const { api } = loadPrismTestApi();
  const withMeta = api.extractAssembledWorkflowProvenanceFromPage({
    artifact_type: "page",
    workflow_id: "wf-a",
    metadata: { workflow_id: "wf-a", workflow_name: "Programme Manager CPD" }
  });
  assert.equal(withMeta.workflowId, "wf-a");
  assert.equal(withMeta.workflowName, "Programme Manager CPD");

  const empty = api.extractAssembledWorkflowProvenanceFromPage({
    artifact_type: "page",
    title: "No ids"
  });
  assert.equal(empty.workflowId, "");
  assert.equal(empty.workflowName, "");

  const names = {
    "wf-a": "Programme Manager CPD",
    "wf-b": "Induction Module"
  };
  const resolve = (id) => names[id] || "";

  const selectedOnly = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "wf-a",
    selectedWorkflowName: "Programme Manager CPD",
    assembledWorkflowId: "",
    hasAuthoringContent: false,
    resolveWorkflowName: resolve
  });
  assert.match(selectedOnly.selectedLabel, /Current workflow: Programme Manager CPD/);
  assert.match(selectedOnly.selectedLabel, /Assemble From Current Workflow Run/);
  assert.equal(selectedOnly.hasAssembledProvenance, false);
  assert.equal(selectedOnly.mismatch, false);
});

test("same workflow → no mismatch; different → warning without destructive side effects", () => {
  const { api, source } = loadPrismTestApi();
  const resolve = (id) => (id === "wf-a" ? "Alpha" : id === "wf-b" ? "Beta" : "");

  const same = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "wf-a",
    selectedWorkflowName: "Alpha",
    assembledWorkflowId: "wf-a",
    assembledWorkflowName: "Alpha",
    hasAuthoringContent: true,
    resolveWorkflowName: resolve
  });
  assert.equal(same.mismatch, false);
  assert.equal(same.assembledFromLabel, "Assembled from: Alpha");
  assert.equal(same.mismatchMessage, "");

  const mismatch = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "wf-b",
    selectedWorkflowName: "Beta",
    assembledWorkflowId: "wf-a",
    assembledWorkflowName: "Alpha",
    hasAuthoringContent: true,
    resolveWorkflowName: resolve
  });
  assert.equal(mismatch.mismatch, true);
  assert.match(mismatch.mismatchMessage, /assembled from "Alpha"/);
  assert.match(mismatch.mismatchMessage, /selected workflow is "Beta"/);
  assert.match(mismatch.mismatchMessage, /Assemble again/);

  assert.doesNotMatch(source, /selectWorkflow\([^)]*\).*clearUtilities|clearUtilities.*selectWorkflow/);
  const refreshStart = source.indexOf("function refreshUtilitiesWorkflowContextUI");
  const refreshBody = source.slice(refreshStart, refreshStart + 1800);
  assert.doesNotMatch(refreshBody, /handleUtilitiesClear/);
  assert.doesNotMatch(refreshBody, /handleUtilitiesAssembleFromCurrentWorkflowRun/);
  assert.doesNotMatch(refreshBody, /selectedWorkflowId\s*=/);
});

test("missing provenance does not claim mismatch; deleted workflow lookup is graceful", () => {
  const { api } = loadPrismTestApi();
  const noProv = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "wf-b",
    selectedWorkflowName: "Beta",
    assembledWorkflowId: "",
    assembledWorkflowName: "",
    hasAuthoringContent: true,
    resolveWorkflowName: () => ""
  });
  assert.equal(noProv.hasAssembledProvenance, false);
  assert.equal(noProv.mismatch, false);
  assert.equal(noProv.assembledFromLabel, "");

  const orphan = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "wf-b",
    selectedWorkflowName: "Beta",
    assembledWorkflowId: "wf-gone",
    assembledWorkflowName: "Archived Course",
    hasAuthoringContent: true,
    resolveWorkflowName: () => ""
  });
  assert.equal(orphan.mismatch, true);
  assert.equal(orphan.assembledDisplayName, "Archived Course");
  assert.match(orphan.assembledFromLabel, /Archived Course/);

  const orphanNoName = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "wf-b",
    selectedWorkflowName: "Beta",
    assembledWorkflowId: "wf-gone",
    assembledWorkflowName: "",
    hasAuthoringContent: true,
    resolveWorkflowName: () => ""
  });
  assert.equal(orphanNoName.assembledDisplayName, "Unknown workflow");

  const parsed = api.parseUtilitiesJsonInputForProvenance(
    JSON.stringify({ artifact_type: "page", title: "pasted" })
  );
  assert.equal(parsed.hasJson, true);
  assert.equal(parsed.provenance.workflowId, "");
});

test("no selected workflow orientation is safe", () => {
  const { api } = loadPrismTestApi();
  const empty = api.buildAuthoringWorkflowContextModel({
    selectedWorkflowId: "",
    assembledWorkflowId: "",
    hasAuthoringContent: false,
    resolveWorkflowName: () => ""
  });
  assert.match(empty.selectedLabel, /No workflow selected/);
  assert.equal(empty.mismatch, false);
});
