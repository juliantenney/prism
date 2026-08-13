/**
 * Sprint 76 T-029 — Design Page capture must enforce Graphics generate-row SHAPE.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const assemble = require(path.join(repoRoot, "lib/page-vnext-assemble.js"));
const vpc = require(path.join(repoRoot, "lib/visual-planning-contract.js"));
const planner = require(path.join(repoRoot, "lib/prism-visual-jobs-planner.js"));
const compiler = require(path.join(repoRoot, "lib/prism-image-brief-compiler.js"));

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
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

function errorText(check) {
  return (check.errors || []).join("; ");
}

const dpPartial = loadFixture("dp-partial.json");
const dpGenerate = loadFixture("dp-partial-generate-valid.json");
const epShell = loadFixture("ep-shell.json");
const dlaPartial = loadFixture("dla-partial.json");
const gamPartial = loadFixture("gam-partial.json");

test("T-029 negative: generate row missing rationale fails Design Page capture", () => {
  const api = loadPrismTestApi();
  const bad = clone(dpGenerate);
  delete bad.visual_affordances[0].rationale;
  const check = api.validateDesignPagePartialPageCapture(bad);
  assert.equal(check.ok, false);
  assert.match(errorText(check), /visual_affordances\[0\]: rationale is required/);
});

test("T-029 negative: generate row missing learner_stage fails Design Page capture", () => {
  const api = loadPrismTestApi();
  const bad = clone(dpGenerate);
  delete bad.visual_affordances[0].learner_stage;
  const check = api.validateDesignPagePartialPageCapture(bad);
  assert.equal(check.ok, false);
  assert.match(errorText(check), /learner_stage must be pre_classification \| post_reasoning/);
});

test("T-029 negative: generate row missing evidence_anchors fails Design Page capture", () => {
  const api = loadPrismTestApi();
  const bad = clone(dpGenerate);
  delete bad.visual_affordances[0].evidence_anchors;
  const check = api.validateDesignPagePartialPageCapture(bad);
  assert.equal(check.ok, false);
  assert.match(errorText(check), /evidence_anchors array is required for generate/);
});

test("T-029 negative: generate row with invalid evidence_anchors syntax fails Design Page capture", () => {
  const api = loadPrismTestApi();
  const bad = clone(dpGenerate);
  bad.visual_affordances[0].evidence_anchors = ["Imperial Expansion"];
  const check = api.validateDesignPagePartialPageCapture(bad);
  assert.equal(check.ok, false);
  assert.match(errorText(check), /anchor must use activity_id\.path or page_synthesis\.field form/);
});

test("T-029 positive: Design Page partial without VA keys remains valid", () => {
  const api = loadPrismTestApi();
  const check = api.validateDesignPagePartialPageCapture(dpPartial);
  assert.equal(check.ok, true, errorText(check));
});

test("T-029 positive: empty visual_affordances[] with schema 38.4 remains valid", () => {
  const api = loadPrismTestApi();
  const empty = clone(dpPartial);
  empty.visual_affordance_schema_version = "38.4";
  empty.activities_visual_review = [];
  empty.visual_affordances = [];
  const check = api.validateDesignPagePartialPageCapture(empty);
  assert.equal(check.ok, true, errorText(check));
});

test("T-029 positive: valid generate row passes Design Page capture without activities[]", () => {
  const api = loadPrismTestApi();
  assert.equal(Object.prototype.hasOwnProperty.call(dpGenerate, "activities"), false);
  const check = api.validateDesignPagePartialPageCapture(dpGenerate);
  assert.equal(check.ok, true, errorText(check));
  const shape = vpc.validateVisualPlanningCaptureShape(dpGenerate);
  assert.equal(shape.valid, true, JSON.stringify(shape.errors));
});

test("T-029 E2E: valid generate capture → assemble → contract valid → job → brief", () => {
  const api = loadPrismTestApi();
  const capture = api.validateDesignPagePartialPageCapture(dpGenerate);
  assert.equal(capture.ok, true, errorText(capture));

  const assembled = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dlaPartial,
    gam: gamPartial,
    design_page: dpGenerate
  });
  assert.equal(assembled.ok, true, (assembled.errors || []).join("; "));
  assert.ok(Array.isArray(assembled.page.visual_affordances));
  assert.equal(assembled.page.visual_affordances[0].affordance_id, "va-A1-generate-01");
  assert.equal(assembled.page.visual_affordances[0].rationale, dpGenerate.visual_affordances[0].rationale);

  const contract = vpc.validateVisualPlanningContract(assembled.page);
  assert.equal(contract.valid, true, JSON.stringify(contract.errors));

  const planned = planner.planPrismVisualJobs(assembled.page);
  assert.equal(planned.valid, true, JSON.stringify(planned.errors));
  assert.ok(planned.jobs.length >= 1);

  const briefs = compiler.compilePrismImageBriefs(planned);
  assert.equal(briefs.valid, true, JSON.stringify(briefs.errors));
  assert.ok(briefs.briefs.length >= 1);
});
