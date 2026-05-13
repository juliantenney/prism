const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "workflow-persistence-pass2");
const appJsPath = path.join(repoRoot, "app.js");

function loadFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, fileName), "utf8"));
}

function flushAsync(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    createElement: () => ({ click: () => {} }),
    body: {
      appendChild: () => {},
      removeChild: () => {}
    }
  };
  const windowStub = {
    document: documentStub,
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    URL: {
      createObjectURL: () => "blob:test",
      revokeObjectURL: () => {}
    },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };

  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });

  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API to be exposed");
  assert.equal(typeof api.normalizeWorkflowForV1, "function");
  assert.equal(typeof api.buildWorkflowBundle, "function");
  assert.equal(typeof api.importWorkflowsAndPrompts, "function");
  assert.equal(typeof api.setWorkflowsForTest, "function");
  assert.equal(typeof api.getWorkflowsForTest, "function");
  assert.equal(typeof api.setPromptsForTest, "function");
  return { api, sandbox };
}

test("PE-normalise-minimal: normalizeWorkflowForV1 preserves required normalized subset", () => {
  const fixture = loadFixture("pe-normalise-minimal.json");
  const { api } = loadPrismTestApi();
  const warnings = [];
  const normalized = api.normalizeWorkflowForV1(fixture.inputWorkflow, warnings);

  assert.equal(normalized.id, fixture.expectedSubset.id);
  assert.deepEqual(normalized.selectedDomains, fixture.expectedSubset.selectedDomains);
  assert.deepEqual(normalized.workflowInputs, fixture.expectedSubset.workflowInputs);
  assert.deepEqual(normalized.workflowOutputs, fixture.expectedSubset.workflowOutputs);
  assert.equal(normalized.workflowOutputSpec.goal, fixture.expectedSubset.workflowOutputSpec.goal);
  assert.equal(
    normalized.workflowOutputSpec.constraints,
    fixture.expectedSubset.workflowOutputSpec.constraints
  );
  assert.equal(normalized.steps[0].id, fixture.expectedSubset.steps[0].id);
  assert.equal(normalized.steps[0].outputName, fixture.expectedSubset.steps[0].outputName);
  fixture.expectedRemovedTopLevelKeys.forEach((k) => {
    assert.equal(Object.prototype.hasOwnProperty.call(normalized, k), false, `expected key removed: ${k}`);
  });
});

test("PE-export-workflow-only: buildWorkflowBundle keeps workflow shape and ids", () => {
  const fixture = loadFixture("pe-export-workflow-only.json");
  const { api } = loadPrismTestApi();

  api.setPromptsForTest(fixture.statePrompts);
  const bundle = api.buildWorkflowBundle(fixture.workflowsInput);

  assert.equal(bundle.version, fixture.expectedSubset.version);
  assert.equal(bundle.workflows.length, fixture.expectedSubset.workflowsLength);
  assert.equal(bundle.workflows[0].id, fixture.expectedSubset.firstWorkflowId);
  assert.equal(bundle.prompts.length, fixture.expectedSubset.promptsLength);
});

test("PE-import-workflow-array-object: importWorkflowsAndPrompts merges workflow arrays deterministically", async () => {
  const fixture = loadFixture("pe-import-workflow-array-object.json");
  const { api } = loadPrismTestApi();

  api.setWorkflowsForTest([]);
  api.importWorkflowsAndPrompts(fixture.bundleObjectWorkflows, [], { newerWins: true });
  await flushAsync();
  await flushAsync();
  api.importWorkflowsAndPrompts(fixture.arrayPayloadWorkflows, [], { newerWins: true });
  await flushAsync();
  await flushAsync();

  const imported = api.getWorkflowsForTest();
  const ids = imported.map((wf) => wf && wf.id).filter(Boolean);
  fixture.expectedIdsPresent.forEach((id) => {
    assert.ok(ids.includes(id), `missing imported workflow id: ${id}`);
  });
});

test("PE-conflict-newerWins: updatedAt precedence keeps newer workflow", async () => {
  const fixture = loadFixture("pe-conflict-newerWins.json");
  const { api } = loadPrismTestApi();

  api.setWorkflowsForTest(fixture.existingWorkflows);
  api.importWorkflowsAndPrompts([fixture.incomingOlder], [], { newerWins: true });
  await flushAsync();
  await flushAsync();
  let workflows = api.getWorkflowsForTest();
  assert.equal(workflows.length, 1);
  assert.equal(workflows[0].name, fixture.expectedAfterOlderImport.name);
  assert.equal(workflows[0].updatedAt, fixture.expectedAfterOlderImport.updatedAt);

  api.importWorkflowsAndPrompts([fixture.incomingNewer], [], { newerWins: true });
  await flushAsync();
  await flushAsync();
  workflows = api.getWorkflowsForTest();
  assert.equal(workflows.length, 1);
  assert.equal(workflows[0].name, fixture.expectedAfterNewerImport.name);
  assert.equal(workflows[0].updatedAt, fixture.expectedAfterNewerImport.updatedAt);
});
