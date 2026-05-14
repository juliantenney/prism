const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function flushAsync(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      toggle: () => false
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
  assert.equal(typeof api.buildWorkflowSearchHaystack, "function");
  assert.equal(typeof api.applyWorkflowListFilters, "function");
  return { api };
}

test("buildWorkflowSearchHaystack includes name, spec fields, inputs, outputs, steps, tags, notes", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  await flushAsync();
  const hay = api.buildWorkflowSearchHaystack({
    name: "Alpha",
    workflowOutputSpec: { goal: "Learn X", constraints: "Short", audience: "Beginners" },
    artefacts: "PDF doc",
    workflowInputs: ["slide", "brief"],
    workflowOutputs: ["page"],
    steps: [{ title: "Draft it" }, { title: "Review" }],
    tags: ["onboarding", "HR"],
    notes: "Internal only"
  });
  assert.ok(hay.includes("alpha"));
  assert.ok(hay.includes("learn x"));
  assert.ok(hay.includes("short"));
  assert.ok(hay.includes("beginners"));
  assert.ok(hay.includes("pdf doc"));
  assert.ok(hay.includes("slide"));
  assert.ok(hay.includes("brief"));
  assert.ok(hay.includes("page"));
  assert.ok(hay.includes("draft it"));
  assert.ok(hay.includes("review"));
  assert.ok(hay.includes("onboarding"));
  assert.ok(hay.includes("hr"));
  assert.ok(hay.includes("internal only"));
});

test("applyWorkflowListFilters: search, tag substring all-match, sort", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  await flushAsync();
  const wfs = [
    {
      id: "a",
      name: "Zebra",
      updatedAt: 100,
      createdAt: 50,
      steps: [{ title: "One" }],
      tags: ["alpha-team"],
      notes: "",
      workflowOutputSpec: { goal: "hidden-goal-x", audience: "", constraints: "" },
      artefacts: "",
      workflowInputs: [],
      workflowOutputs: []
    },
    {
      id: "b",
      name: "Mango",
      updatedAt: 200,
      createdAt: 300,
      steps: [{ title: "Two" }, { title: "Three" }],
      tags: ["beta"],
      notes: "secret lemon",
      workflowOutputSpec: { goal: "", audience: "", constraints: "" },
      artefacts: "",
      workflowInputs: [],
      workflowOutputs: []
    }
  ];

  var byQuery = api.applyWorkflowListFilters(wfs, { query: "lemon", tag: [], sort: "updatedDesc" });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, "b");

  var byTag = api.applyWorkflowListFilters(wfs, {
    query: "",
    tag: ["alpha", "team"],
    sort: "nameAsc"
  });
  assert.equal(byTag.length, 1);
  assert.equal(byTag[0].id, "a");

  var bySteps = api.applyWorkflowListFilters(wfs, { query: "", tag: [], sort: "stepsDesc" });
  assert.equal(bySteps[0].id, "b");
  assert.equal(bySteps[1].id, "a");
});
