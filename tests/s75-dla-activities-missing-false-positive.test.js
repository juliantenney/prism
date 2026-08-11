/**
 * Sprint 75 — DLA partial-page activities[] false-positive validation fix (S75-D16).
 *
 * Run paste → parse → resolve → partial validator must not report activities[] missing
 * when activities are present under canonical or tolerated capture shapes.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(repoRoot, "tests", "fixtures", "page-assemble");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
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
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
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
      "lib/ld-activity-title-contract.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js",
      "lib/ld-gam-page-enrich-contract.js",
      "lib/page-gam-enrich.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildWorkflow() {
  return {
    id: "wf-s75-dla-activities",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      }
    ]
  };
}

function buildSuppliedStyleActivity(id, title) {
  const titles = {
    A1: "Map inflation cause chains",
    A2: "Apply CPI scenario maths",
    A3: "Compare policy transmission paths",
    A4: "Evaluate stabilisation trade-offs",
    A5: "Interpret shadow price (lambda)"
  };
  return {
    activity_id: id,
    title: title || titles[id] || "Compare inflation drivers",
    learner_task: "Complete the conceptual task for " + id + ".",
    expected_output: "A concise written response for " + id + ".",
    activity_preamble: "Orient yourself to the materials before responding.",
    required_materials: [
      {
        material_id: id + "-M1",
        material_type: "text",
        purpose: "Instructional support"
      }
    ],
    evidence_decision: {
      required: false,
      reason: "Conceptual task without supplied evidence inspection.",
      provider_material_ids: []
    },
    materials: []
  };
}

function buildSuppliedStyleDlaPage(activityCount) {
  const count = typeof activityCount === "number" ? activityCount : 1;
  const activities = [];
  for (let i = 0; i < count; i += 1) {
    activities.push(buildSuppliedStyleActivity("A" + (i + 1)));
  }
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: {
      current_stage: "dla",
      enriched_by: ["dla"]
    },
    activities
  };
}

function lagrangianA5Activity() {
  return {
    activity_id: "A5",
    title: "Interpret shadow price (lambda)",
    grouping: "individual",
    duration_minutes: 20,
    learner_task:
      "Review the explanatory material on shadow prices and lambda; compare weak and strong interpretation examples; write a short interpretation summary explaining the economic meaning.",
    expected_output:
      "A concise conceptual explanation of the shadow price (lambda) and its economic meaning.",
    activity_preamble: "Use the explanatory text and sample outputs before writing your summary.",
    intellectual_coherence_bridge:
      "You have modelled constrained optimisation; now consolidate what lambda means economically.",
    evidence_decision: {
      required: false,
      reason:
        "The task requires conceptual explanation rather than interpretation of supplied evidence.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A5-M1",
        material_type: "text",
        purpose: "Explanatory text on shadow price and lambda",
        specification: "Conceptual explanation of the shadow price (lambda)."
      }
    ],
    materials: []
  };
}

function buildRunLi(stepId, jsonText) {
  const textarea = createElementStub();
  textarea.value = String(jsonText || "");
  const output = createElementStub();
  output.value = "page";
  const statusEl = createElementStub();
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
        if (selector === '[data-role="run-step-output-status"]') return statusEl;
        return null;
      }
    },
    textarea
  };
}

test("A: supplied-style partial DLA page with top-level activities[] passes", () => {
  const page = buildSuppliedStyleDlaPage(5);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("A2: learning_activities wrapper on v2 page resolves to activities[]", () => {
  const activity = buildSuppliedStyleActivity("A1");
  const wrapped = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    learning_activities: { activities: [activity] }
  };
  const check = dlaEnrich.validateDlaPartialPageCapture(wrapped);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("A3: nested page wrapper resolves activities[]", () => {
  const inner = buildSuppliedStyleDlaPage(2);
  const wrapped = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: inner.assembly_state,
    page: inner
  };
  delete wrapped.activities;
  const check = dlaEnrich.validateDlaPartialPageCapture(wrapped);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("B: parse → strict validator production path preserves activities[]", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const step = wf.steps.find((row) => row.id === "dla_step");
  const page = buildSuppliedStyleDlaPage(3);
  const wrapped = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: page.assembly_state,
    learning_activities: { activities: page.activities }
  };
  const raw = JSON.stringify(wrapped, null, 2);
  const parsed = api.parsePageArtefactCaptureForStorage(raw);
  assert.equal(parsed.ok, true, parsed.message || "");
  assert.ok(
    Array.isArray(wrapped.learning_activities.activities) &&
      wrapped.learning_activities.activities.length === 3
  );
  const strict = api.validateStrictJsonWorkflowRunStepCaptureForTest(raw, step, wf);
  assert.equal(strict.ok, true, (strict.errors || []).join("; "));
});

test("C: missing activities genuinely fails", () => {
  const page = buildSuppliedStyleDlaPage(1);
  delete page.activities;
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /partial DLA page must include activities/i);
});

test("C2: null, empty, and object activities genuinely fail", () => {
  const base = buildSuppliedStyleDlaPage(1);
  for (const activities of [null, [], {}]) {
    const page = Object.assign({}, base, { activities });
    const check = dlaEnrich.validateDlaPartialPageCapture(page);
    assert.equal(check.ok, false, JSON.stringify(activities));
    assert.match((check.errors || []).join("; "), /partial DLA page must include activities/i);
  }
});

test("D: malformed activities genuinely fail", () => {
  const page = buildSuppliedStyleDlaPage(1);
  page.activities = [{ learner_task: "missing activity_id" }];
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match((check.errors || []).join("; "), /activity_id required/i);

  page.activities = ["not-an-object"];
  const badShape = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(badShape.ok, false);
  assert.match((badShape.errors || []).join("; "), /must be an object/i);
});

test("E: A5-style evidence_decision instructional case remains valid", () => {
  const page = buildSuppliedStyleDlaPage(4);
  page.activities.push(lagrangianA5Activity());
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("F: successful DLA paste sync clears strict validation and enables advance", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow();
  const epShell = loadFixture("ep-shell.json");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  api.setWorkflowRunCapturedOutputsForTest({ ep_step: JSON.stringify(epShell, null, 2) });
  api.setWorkflowRunCapturedOutputsRawForTest({ ep_step: JSON.stringify(epShell, null, 2) });

  const page = buildSuppliedStyleDlaPage(2);
  const raw = JSON.stringify(page, null, 2);
  const step = wf.steps.find((row) => row.id === "dla_step");
  const { li, textarea } = buildRunLi("dla_step", raw);
  api.syncWorkflowRunCapturedOutputToState(li);

  assert.ok(String(textarea.value || "").trim().length > 0);
  assert.ok(
    api.isWorkflowRunStepCaptureReadyForAdvance(step, "dla_step", wf, li),
    "advance should be allowed after valid DLA capture"
  );
  const storedRaw = api.getWorkflowRunCapturedOutputsRawForTest().dla_step || "";
  assert.ok(storedRaw.includes('"activities"'));
  assert.ok(storedRaw.includes('"activity_id"'));
});
