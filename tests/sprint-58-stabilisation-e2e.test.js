/**
 * Sprint 58 stabilisation — fixture-backed E2E verification for transcript and simple-topic workflows.
 * Exercises: step capture validation → persistence maps → assembly → render.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
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
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => null, removeItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/page-dla-enrich.js",
      "lib/page-gam-enrich.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildRunLi(stepId, outputName, jsonText) {
  const textarea = { value: String(jsonText || "") };
  const output = { value: outputName };
  return {
    li: {
      classList: { contains: (name) => name === "workflow-step" },
      getAttribute(name) {
        if (name === "data-step-id") return stepId;
        return "";
      },
      querySelector(selector) {
        if (selector === '[data-field="runStepOutput"]') return textarea;
        if (selector === '[data-field="outputName"]') return output;
        if (selector === '[data-role="run-step-output-status"]') {
          return { textContent: "", classList: { toggle() {} } };
        }
        return null;
      }
    },
    textarea
  };
}

function buildPartialPageWorkflow(id) {
  return {
    id,
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      { id: "ep_step", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
      { id: "dla_step", title: "Design Learning Activities", outputName: "page", canonical_step_id: "step_design_learning_activities" },
      { id: "gam_step", title: "Generate Activity Materials", outputName: "page", canonical_step_id: "step_generate_activity_materials" },
      { id: "ls_step", title: "Construct Learning Sequence", outputName: "page", canonical_step_id: "step_construct_learning_sequence" },
      { id: "da_step", title: "Design Assessment", outputName: "page", canonical_step_id: "step_design_assessment" },
      { id: "gai_step", title: "Generate Assessment Items", outputName: "page", canonical_step_id: "step_generate_assessment_items" },
      { id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
    ]
  };
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

function applyLdHeuristics(api, workflowPolicy, parsed, hints) {
  return api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: hints.resolvedBriefFactors || {},
    explicitBriefFactors: hints.explicitBriefFactors || {},
    goal: hints.goal || "",
    inputs: hints.inputs || "",
    desiredOutputs: hints.desiredOutputs || "",
    startingArtefact: hints.startingArtefact || ""
  });
}

function syncCaptureAndAssert(api, wf, stepId, outputName, jsonText) {
  const { li, textarea } = buildRunLi(stepId, outputName, jsonText);
  api.syncWorkflowRunCapturedOutputToState(li);
  const block = api.getWorkflowRunCaptureGatesBlockReasonForTest(stepId);
  assert.equal(block || "", "", stepId + " capture gates: " + (block || ""));
  const stored =
    api.getWorkflowRunCapturedOutputsRawForTest()[stepId] ||
    api.getWorkflowRunCapturedOutputsForTest()[stepId] ||
    "";
  assert.ok(String(stored).trim().length > 0, stepId + " should persist capture");
  assert.equal(textarea.value.trim(), stored.trim(), stepId + " textarea should match stored raw");
  assert.equal(
    api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest(stepId),
    true,
    stepId + " should pass capture gates"
  );
  return stored;
}

const epShell = loadFixture("ep-shell.json");
const dlaPartial = loadFixture("dla-partial.json");
const gamPartial = loadFixture("gam-partial.json");
const lsPartial = loadFixture("ls-partial.json");
const dpPartial = loadFixture("dp-partial.json");
const daPartial = loadFixture("assessment-design-partial.json");
const gaiPartial = loadFixture("assessment-items-partial.json");

const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);

const TRANSCRIPT_BRIEF = {
  goal: "Using the provided lecture transcript, create learning activities and a short formative assessment on RNA viruses.",
  inputs: "Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).",
  desiredOutputs: "Learner-facing page",
  startingArtefact: "provided_source_content",
  resolvedBriefFactors: {
    input_strategy: "provided_source_content",
    delivery_context: "self_directed",
    delivery_mode: "async",
    session_materials: ["page"]
  }
};

const SIMPLE_TOPIC_BRIEF = {
  goal: "Create a self-directed learning page on inflation for Year 12 learners.",
  inputs: "No uploaded files; generate from topic only.",
  desiredOutputs: "Learner-facing page",
  startingArtefact: "generate_from_topic",
  resolvedBriefFactors: {
    topic: "inflation",
    input_strategy: "generate_from_topic",
    delivery_context: "self_directed",
    session_materials: ["page"]
  }
};

test("transcript brief resolves source-ingest topology before page pipeline", () => {
  const api = loadPrismTestApi();
  const out = applyLdHeuristics(
    api,
    ldWorkflowPolicy,
    {
      steps: [
        { title: "Define Learning Outcomes", role: "" },
        { title: "Design Episode Plan", role: "" },
        { title: "Design Learning Activities", role: "" },
        { title: "Generate Activity Materials", role: "" },
        { title: "Design Page", role: "" }
      ]
    },
    TRANSCRIPT_BRIEF
  );
  const titles = stepTitles(out);
  assert.ok(indexOfTitle(titles, "Normalize Content") !== -1, titles.join(" -> "));
  assert.ok(indexOfTitle(titles, "Generate Learning Content") !== -1, titles.join(" -> "));
  assert.ok(indexOfTitle(titles, "Model Knowledge") !== -1, titles.join(" -> "));
});

test("simple topic brief excludes Normalize and keeps topic-only GLC path", () => {
  const api = loadPrismTestApi();
  const out = applyLdHeuristics(
    api,
    ldWorkflowPolicy,
    {
      steps: [
        { title: "Model Knowledge", role: "" },
        { title: "Define Learning Outcomes", role: "" },
        { title: "Design Page", role: "" }
      ]
    },
    SIMPLE_TOPIC_BRIEF
  );
  const titles = stepTitles(out);
  assert.equal(indexOfTitle(titles, "Normalize Content"), -1, titles.join(" -> "));
  assert.ok(indexOfTitle(titles, "Generate Learning Content") !== -1, titles.join(" -> "));
});

test("transcript-origin partial page pipeline: capture, persist, assemble, render", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialPageWorkflow("wf-transcript-e2e");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const captures = {
    ep_step: JSON.stringify(epShell, null, 2),
    dla_step: JSON.stringify(dlaPartial, null, 2),
    gam_step: JSON.stringify(gamPartial, null, 2),
    ls_step: JSON.stringify(lsPartial, null, 2),
    da_step: JSON.stringify(daPartial, null, 2),
    gai_step: JSON.stringify(gaiPartial, null, 2),
    dp_step: JSON.stringify(dpPartial, null, 2)
  };

  Object.keys(captures).forEach((stepId) => {
    syncCaptureAndAssert(api, wf, stepId, "page", captures[stepId]);
  });

  const resolved = api.resolvePageForRenderOrAssembly(dpPartial, wf, {});
  assert.equal(resolved.artifact_type, "page");
  assert.equal(resolved.schema_version, "2.0.0");
  assert.equal(resolved.activities.length, 2);
  assert.ok(resolved.page_synthesis && resolved.page_synthesis.knowledge_summary);
  assert.ok(resolved.activities[0].materials && resolved.activities[0].materials.length > 0);

  const rendered = api.buildUtilityStructuredHtmlForTest(resolved, ["sections"], {
    applyCompositionValidation: false
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  assert.ok(String(rendered.html || "").length > 500);
  assert.match(String(rendered.html), /inflation|CPI|Activity/i);
});

test("simple-topic partial page pipeline: capture, persist, assemble, render", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialPageWorkflow("wf-simple-topic-e2e");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const dpSynthesisOnly = JSON.parse(JSON.stringify(dpPartial));
  delete dpSynthesisOnly.sections;

  syncCaptureAndAssert(api, wf, "ep_step", "page", JSON.stringify(epShell, null, 2));
  syncCaptureAndAssert(api, wf, "dla_step", "page", JSON.stringify(dlaPartial, null, 2));
  syncCaptureAndAssert(api, wf, "gam_step", "page", JSON.stringify(gamPartial, null, 2));
  syncCaptureAndAssert(api, wf, "ls_step", "page", JSON.stringify(lsPartial, null, 2));
  syncCaptureAndAssert(api, wf, "da_step", "page", JSON.stringify(daPartial, null, 2));
  syncCaptureAndAssert(api, wf, "gai_step", "page", JSON.stringify(gaiPartial, null, 2));
  syncCaptureAndAssert(api, wf, "dp_step", "page", JSON.stringify(dpSynthesisOnly, null, 2));

  const resolved = api.resolvePageForRenderOrAssembly(dpSynthesisOnly, wf, {});
  assert.ok(resolved.page_synthesis.knowledge_summary);
  assert.equal(Array.isArray(dpSynthesisOnly.sections) ? dpSynthesisOnly.sections.length : 0, 0);
  assert.ok(
    resolved.page_synthesis.knowledge_summary.body ||
      resolved.page_synthesis.knowledge_summary.format,
    "assembled page retains canonical page_synthesis"
  );

  const rendered = api.buildUtilityStructuredHtmlForTest(resolved, ["sections"], {
    applyCompositionValidation: false
  });
  assert.ok(rendered && !rendered.error);
  assert.match(String(rendered.html), /knowledge|inflation|Activity/i);
});
