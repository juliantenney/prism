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

function canonicalizeJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createElementStub(tagName = "div") {
  const classSet = new Set();
  return {
    tagName: String(tagName).toUpperCase(),
    value: "",
    checked: false,
    disabled: false,
    innerHTML: "",
    textContent: "",
    className: "",
    classList: {
      add: (...names) => {
        names.forEach((n) => classSet.add(String(n)));
      },
      remove: (...names) => {
        names.forEach((n) => classSet.delete(String(n)));
      },
      contains: (name) => classSet.has(String(name)),
      toggle: (name, force) => {
        const key = String(name);
        if (force === true) {
          classSet.add(key);
          return true;
        }
        if (force === false) {
          classSet.delete(key);
          return false;
        }
        if (classSet.has(key)) {
          classSet.delete(key);
          return false;
        }
        classSet.add(key);
        return true;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild(child) {
      this.children.push(child);
      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((c) => c !== child);
      return child;
    },
    setAttribute(name, value) {
      this[name] = value;
    },
    removeAttribute(name) {
      delete this[name];
    },
    getAttribute(name) {
      return this[name];
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: {
      debounce: (fn) => fn
    }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tagName) => createElementStub(tagName),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    body: {
      appendChild: () => {},
      removeChild: () => {}
    }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn
    },
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

test("PE-normalise-minimal: normalizeWorkflowForV1 preserves required normalized subset", async () => {
  const fixture = loadFixture("pe-normalise-minimal.json");
  const { api } = loadPrismTestApi();
  await flushAsync();
  await flushAsync();
  const warnings = [];
  const normalized = api.normalizeWorkflowForV1(fixture.inputWorkflow, warnings);
  const normalizedCanonical = canonicalizeJson(normalized);

  assert.equal(normalizedCanonical.id, fixture.expectedSubset.id);
  assert.deepEqual(normalizedCanonical.selectedDomains, fixture.expectedSubset.selectedDomains);
  assert.deepEqual(normalizedCanonical.workflowInputs, fixture.expectedSubset.workflowInputs);
  assert.deepEqual(normalizedCanonical.workflowOutputs, fixture.expectedSubset.workflowOutputs);
  assert.equal(normalizedCanonical.workflowOutputSpec.goal, fixture.expectedSubset.workflowOutputSpec.goal);
  assert.equal(
    normalizedCanonical.workflowOutputSpec.constraints,
    fixture.expectedSubset.workflowOutputSpec.constraints
  );
  assert.equal(normalizedCanonical.steps[0].id, fixture.expectedSubset.steps[0].id);
  assert.equal(normalizedCanonical.steps[0].outputName, fixture.expectedSubset.steps[0].outputName);
  fixture.expectedRemovedTopLevelKeys.forEach((k) => {
    assert.equal(Object.prototype.hasOwnProperty.call(normalizedCanonical, k), false, `expected key removed: ${k}`);
  });
});

test("PE-export-workflow-only: buildWorkflowBundle keeps workflow shape and ids", async () => {
  const fixture = loadFixture("pe-export-workflow-only.json");
  const { api } = loadPrismTestApi();
  await flushAsync();
  await flushAsync();

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
  await flushAsync();
  await flushAsync();

  api.setWorkflowsForTest([]);
  api.importWorkflowsAndPrompts(fixture.bundleObjectWorkflows, [], { newerWins: true });
  await flushAsync();
  await flushAsync();
  api.importWorkflowsAndPrompts(fixture.arrayPayloadWorkflows, [], { newerWins: true });
  await flushAsync();
  await flushAsync();

  const imported = canonicalizeJson(api.getWorkflowsForTest());
  const ids = imported.map((wf) => wf && wf.id).filter(Boolean);
  fixture.expectedIdsPresent.forEach((id) => {
    assert.ok(ids.includes(id), `missing imported workflow id: ${id}`);
  });
});

test("PE-conflict-newerWins: updatedAt precedence keeps newer workflow", async () => {
  const fixture = loadFixture("pe-conflict-newerWins.json");
  const { api } = loadPrismTestApi();
  await flushAsync();
  await flushAsync();

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
