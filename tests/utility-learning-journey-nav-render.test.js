/**
 * Sprint 55 — Learning Journey ribbon helpers (pure helper coverage).
 * Page-export Legacy journey-nav cases removed after S74A-T-045 (pages always vNext).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
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
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("learning journey nav labels: strip LO prefixes and shorten", () => {
  const api = loadPrismTestApi();
  const normalize = api.utilityNormalizeJourneyNavLabelForTest;
  assert.equal(
    normalize("LO1 — Defining Digital Accessibility in Practice"),
    "Defining Accessibility"
  );
  assert.equal(normalize("LO2 — Analysing Barriers and User Impact"), "Barriers & Impact");
  assert.equal(normalize("LO3 — Applying POUR to Evaluate a Resource"), "POUR Evaluation");
  assert.equal(normalize("LO4 — Improving an Accessible Document"), "Improve Document");
  assert.equal(normalize("LO5 — Adapting Teaching for Accessibility"), "Teaching Accessibly");
  assert.equal(normalize("A1 — First step"), "First step");
  assert.equal(normalize("Activity 1: Warm up"), "Warm up");
});

test("learning journey nav labels: two-line display formatting", () => {
  const api = loadPrismTestApi();
  const format = api.utilityFormatJourneyNavLabelDisplayForTest;
  assert.equal(format("Orient"), "Orient");
  assert.equal(format("Defining Accessibility"), "Defining<br>Accessibility");
  assert.equal(format("Barriers & Impact"), "Barriers &amp;<br>Impact");
  assert.equal(format("POUR Evaluation"), "POUR<br>Evaluation");
  assert.equal(format("Improve Document"), "Improve<br>Document");
  assert.equal(format("Teaching Accessibly"), "Teaching<br>Accessibly");
});

test("learning journey structural progress: section-based scale", () => {
  const api = loadPrismTestApi();
  const progress = api.utilityComputeJourneyStructuralProgressForTest;
  assert.equal(progress(0, 0, 4), 0);
  assert.ok(Math.abs(progress(0, 0.5, 4) - 50 / 3) < 1e-9);
  assert.ok(Math.abs(progress(1, 0, 4) - 100 / 3) < 1e-9);
  assert.equal(progress(3, 0, 4), 100);
  assert.ok(Math.abs(progress(1, 0.5, 4) - 50) < 1e-9);
  assert.equal(progress(2, 1, 4), 100);
});

test("learning journey layout: compact up to 8 items, scroll beyond", () => {
  const api = loadPrismTestApi();
  const layout = api.utilityLearningJourneyNavLayoutClassForTest;
  assert.equal(layout(4), " util-journey-nav--compact");
  assert.equal(layout(8), " util-journey-nav--compact");
  assert.equal(layout(9), " util-journey-nav--scroll");
});

test("learning journey arrows: compact layout only", () => {
  const api = loadPrismTestApi();
  const render = api.utilityRenderLearningJourneyNavHtmlForTest;
  const compact = render([
    { id: "journey-orient", label: "Orient" },
    { id: "activity-1", label: "Defining Accessibility" },
    { id: "activity-2", label: "Barriers & Impact" },
    { id: "activity-3", label: "POUR Evaluation" }
  ]);
  assert.match(compact, /util-journey-nav--compact/);
  assert.equal((compact.match(/util-journey-arrow/g) || []).length, 3);
  assert.doesNotMatch(compact, /util-journey-arrow[^<]*<\/span>\s*<\/div>/);
  assert.match(compact, /util-journey-arrow" aria-hidden="true">→<\/span><a class="util-journey-link"/);

  const scrollItems = [];
  for (let i = 0; i < 9; i += 1) {
    scrollItems.push({ id: "activity-" + i, label: "Step " + i });
  }
  const scroll = render(scrollItems);
  assert.match(scroll, /util-journey-nav--scroll/);
  assert.doesNotMatch(scroll, /util-journey-arrow/);
  assert.doesNotMatch(scroll, /util-journey-overflow-cue/);
  assert.doesNotMatch(scroll, /Scroll →/);
});
