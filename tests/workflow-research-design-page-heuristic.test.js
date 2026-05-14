const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const researchPatternsPath = path.join(
  repoRoot,
  "domains",
  "research",
  "domain-research-step-patterns.md"
);

function flushAsync(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractResearchWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1, "research pack should contain Workflow Policy section");
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  const raw = md.slice(fence + 7, close).trim();
  const parsed = JSON.parse(raw);
  return parsed.workflowPolicy;
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
  assert.ok(api, "Expected __PRISM_TEST_API");
  assert.equal(typeof api.applyWorkflowDesignHeuristics, "function");
  return { api, sandbox };
}

test("Research briefing chain: heuristics append Design Page last with valid depends_on", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Build Evidence Map", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Generate Research Summary", role: "" },
      { title: "Generate Briefing Note", role: "" },
      { title: "Validate Research Output", role: "" },
      { title: "Format Final Output", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: { objective_type: "briefing", input_strategy: "provided_source_content" },
    explicitBriefFactors: {},
    goal: "Briefing from uploaded notes",
    inputs: "pdf article uploaded",
    desiredOutputs: "",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || ""));
  assert.ok(titles.includes("Design Page"), "expected Design Page in ordered steps");
  assert.equal(titles[titles.length - 1], "Design Page", "Design Page must be terminal");
  const dp = out.steps[out.steps.length - 1];
  assert.ok(Array.isArray(dp.depends_on) && dp.depends_on.length, "Design Page should have depends_on");
  const lastIdx = out.steps.length - 1;
  dp.depends_on.forEach((d) => {
    assert.ok(d >= 1 && d <= lastIdx, "depends_on must reference upstream 1-based indices before terminal");
  });
});

test("Research questions-only objective: no Design Page appended", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Build Evidence Map", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Generate Research Questions", role: "" },
      { title: "Validate Research Output", role: "" },
      { title: "Format Final Output", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: { objective_type: "questions" },
    explicitBriefFactors: {},
    goal: "",
    inputs: "",
    desiredOutputs: "",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || "").toLowerCase());
  assert.equal(titles.filter((t) => t === "design page").length, 0);
});

test("Research Design Page: duplicate not inserted when model already emitted Design Page", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Build Evidence Map", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Generate Research Summary", role: "" },
      { title: "Generate Briefing Note", role: "" },
      { title: "Validate Research Output", role: "" },
      { title: "Format Final Output", role: "" },
      { title: "Design Page", role: "" },
      { title: "Design Page", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: { objective_type: "briefing", input_strategy: "provided_source_content" },
    explicitBriefFactors: {},
    goal: "Briefing from uploaded notes",
    inputs: "pdf article uploaded",
    desiredOutputs: "",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  assert.equal(
    out.steps.filter((s) => String(s.title || "").toLowerCase() === "design page").length,
    1
  );
});
