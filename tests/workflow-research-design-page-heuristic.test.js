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
  assert.equal(
    titles.filter((t) => t.toLowerCase() === "validate research output").length,
    0,
    "default briefing brief must not retain Validate"
  );
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
  assert.equal(titles.filter((t) => t === "validate research output").length, 0);
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

test("Research page-delivery cues without resolved objective_type: Design Page appended without default Validate", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Conduct Thematic Analysis", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: { input_strategy: "provided_source_content" },
    explicitBriefFactors: {},
    goal: "Improve literacy using scalable digital feedback; deliver structured html-ready export for institutional leaders.",
    inputs: "uploaded sector pdf notes",
    desiredOutputs: "Readable structured page for utilities",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || ""));
  assert.equal(
    titles.filter((t) => t.toLowerCase() === "validate research output").length,
    0,
    "page delivery without validation intent must not add Validate"
  );
  assert.ok(titles.includes("Design Page"), "expected Design Page when page-delivery cues present");
  assert.equal(titles[titles.length - 1], "Design Page", "Design Page must be terminal");
  assert.equal(
    out.steps.filter((s) => String(s.title || "").toLowerCase() === "design page").length,
    1,
    "must not insert duplicate Design Page"
  );
  const dp = out.steps[out.steps.length - 1];
  assert.equal(String(dp.outputName || "").trim(), "page", "Design Page outputName from pack dependencies");
});

test("Research briefing chain + page brief without objective_type: Design Page appended (Sprint 15 chain shape)", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Build Literature Matrix", role: "" },
      { title: "Generate Briefing Note", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: { input_strategy: "provided_source_content" },
    explicitBriefFactors: {},
    goal:
      "Produce a structured html-ready briefing page as the final deliverable; Utilities rendering and export for stakeholders.",
    inputs: "uploaded sector sources",
    desiredOutputs: "Page artefact suitable for export",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || ""));
  assert.equal(
    titles.filter((t) => t.toLowerCase() === "validate research output").length,
    0,
    "no default Validate for this brief"
  );
  assert.ok(titles.includes("Design Page"), "expected Design Page for briefing + page-delivery brief");
  assert.equal(titles[titles.length - 1], "Design Page", "Design Page must be terminal");
  assert.equal(
    out.steps.filter((s) => String(s.title || "").toLowerCase() === "design page").length,
    1,
    "single Design Page"
  );
  const dp = out.steps[out.steps.length - 1];
  assert.equal(String(dp.outputName || "").trim(), "page");
});

test("Research objective_type questions with briefing + page cues still appends Design Page", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Build Literature Matrix", role: "" },
      { title: "Generate Briefing Note", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: { objective_type: "questions", input_strategy: "provided_source_content" },
    explicitBriefFactors: {},
    goal: "Structured html-ready briefing page for utilities export.",
    inputs: "notes",
    desiredOutputs: "",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || "").toLowerCase());
  assert.ok(titles.includes("design page"), "briefing+page cues override questions-only objective guard");
  assert.equal(titles[titles.length - 1], "design page");
});

test("Research briefing: non-delivery explicit session_materials must not strip Design Page", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Build Literature Matrix", role: "" },
      { title: "Generate Briefing Note", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: {
      objective_type: "briefing",
      input_strategy: "provided_source_content"
    },
    explicitBriefFactors: {
      session_materials: ["references"]
    },
    goal:
      "HTML-ready briefing page for Utilities rendering and export; final `page` artefact for stakeholders.",
    inputs: "uploaded sector sources",
    desiredOutputs: "Export-ready page",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || "").toLowerCase());
  assert.ok(
    titles.includes("design page"),
    "Design Page must survive heuristics when raw session_materials has no normalized delivery keys"
  );
  assert.equal(titles[titles.length - 1], "design page", "Design Page must remain terminal");
});

test("Persisted-path projection: Design Page keeps heuristic outputName page after save merge + normalizeWorkflowForV1", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  assert.equal(typeof api.suggestWorkflowOutputNameForStepTitle, "function");
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Build Literature Matrix", role: "" },
      { title: "Generate Briefing Note", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: {
      objective_type: "briefing",
      input_strategy: "provided_source_content"
    },
    explicitBriefFactors: {
      session_materials: ["references"]
    },
    goal:
      "HTML-ready briefing page for Utilities rendering and export; final `page` artefact for stakeholders.",
    inputs: "uploaded sector sources",
    desiredOutputs: "Export-ready page",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const catalog = [];
  const stepsForSave = (out.steps || []).map(function (s, idx) {
    var suggested = api.suggestWorkflowOutputNameForStepTitle(String((s && s.title) || ""), catalog);
    return {
      id: "step-test-" + idx,
      title: String((s && s.title) || ""),
      outputName: String((s && s.outputName) || "").trim() || suggested
    };
  });
  const lastBeforeNorm = stepsForSave[stepsForSave.length - 1];
  assert.equal(String(lastBeforeNorm.title || "").toLowerCase(), "design page");
  assert.equal(String(lastBeforeNorm.outputName || "").trim(), "page");

  const wf = {
    selectedDomains: ["general", "research"],
    steps: stepsForSave
  };
  const normalized = api.normalizeWorkflowForV1(wf, []);
  const last = normalized.steps[normalized.steps.length - 1];
  assert.equal(String(last.title || "").toLowerCase(), "design page");
  assert.equal(String(last.outputName || "").trim(), "page");
});

test("Research pack: no Format→Design Page precedence edge (dependency topo deadlock guard)", async () => {
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const bad = (workflowPolicy.precedenceRules || []).some(
    (p) =>
      Array.isArray(p) &&
      p.length >= 2 &&
      String(p[0] || "").toLowerCase().trim() === "format final output" &&
      String(p[1] || "").toLowerCase().trim() === "design page"
  );
  assert.equal(bad, false);
});

test("Research analysis + literature matrix: Design Page survives topo pass (literature_matrix in requiresAnyOf)", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Build Literature Matrix", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: {
      objective_type: "analysis",
      input_strategy: "provided_source_content"
    },
    explicitBriefFactors: {},
    goal: "Structured html-ready export-ready comparison page from the literature matrix for utilities.",
    inputs: "uploaded papers",
    desiredOutputs: "",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || "").toLowerCase());
  assert.ok(titles.includes("design page"), "page cues + analysis objective should append Design Page");
  assert.equal(titles[titles.length - 1], "design page", "Design Page must be terminal after dependency ordering");
  const dp = out.steps[out.steps.length - 1];
  assert.equal(String(dp.outputName || "").trim(), "page");
});

test("Research briefing+page: draft with Format before synthesis steps still ends with Design Page terminal", async () => {
  const { api } = loadPrismTestApi();
  await flushAsync();
  const workflowPolicy = extractResearchWorkflowPolicy(fs.readFileSync(researchPatternsPath, "utf8"));
  const parsed = {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Extract Key Findings", role: "" },
      { title: "Build Evidence Map", role: "" },
      { title: "Conduct Thematic Analysis", role: "" },
      { title: "Format Final Output", role: "" },
      { title: "Generate Research Summary", role: "" },
      { title: "Generate Briefing Note", role: "" }
    ]
  };
  const hints = {
    selectedDomains: ["general", "research"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: {
      objective_type: "briefing",
      input_strategy: "provided_source_content"
    },
    explicitBriefFactors: {},
    goal: "HTML-ready briefing page utilities export final page artefact.",
    inputs: "pdf notes",
    desiredOutputs: "",
    startingArtefact: ""
  };
  const out = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), hints);
  const titles = out.steps.map((s) => String(s.title || "").toLowerCase());
  assert.ok(titles.includes("design page"));
  assert.equal(titles[titles.length - 1], "design page");
  assert.equal(String(out.steps[out.steps.length - 1].outputName || "").trim(), "page");
});
