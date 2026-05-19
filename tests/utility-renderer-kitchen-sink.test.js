/**
 * Sprint 26 — synthetic renderer kitchen sink fixture (smoke + coverage anchors).
 * Does not validate composition closure (see utility-page-composition-closure.test.js).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "renderer-kitchen-sink-page.json");

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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function renderKitchenSink(api) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return { parsed, html: String(r.html || "") };
}

const api = loadPrismTestApi();

test("kitchen sink fixture: parses and declares synthetic renderer stress", () => {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  assert.equal(parsed.artifact_type, "page");
  assert.equal(parsed.source_artefacts && parsed.source_artefacts.synthetic_fixture, true);
  assert.ok(Array.isArray(parsed.sections) && parsed.sections.length >= 8);
});

test("kitchen sink fixture: renders HTML without error", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /PRISM renderer kitchen sink/i);
  assert.match(html, /<h1>/);
});

test("kitchen sink fixture: all activity titles present (KS-A1–KS-A4)", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /Pattern showcase/i);
  assert.match(html, /Edge cases/i);
  assert.match(html, /Density and print stress/i);
  assert.match(html, /Minimal activity row/i);
  assert.ok((html.match(/util-task-block/gi) || []).length >= 4);
});

test("kitchen sink fixture: core material patterns present", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-task-card/);
  assert.match(html, /util-scenario-card/);
  assert.match(html, /util-prompt-set/);
  assert.match(html, /util-checkbox-list/);
  assert.match(html, /util-template-block/);
  assert.match(html, /<table>/);
  assert.match(html, /util-output-block/);
  assert.match(html, /util-support-note/);
});

test("kitchen sink fixture: study tips and assessment sections distinguish icons", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-section-icon--study-tips/);
  assert.match(html, /Study tips/i);
  assert.match(html, /Formative assessment check/i);
});

test("kitchen sink fixture: metadata fold and generation_notes", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /<details class="util-meta"/);
  assert.match(html, /Synthetic renderer stress fixture/i);
});

test("kitchen sink fixture: unknown material key does not break render", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /experimental_unknown_key|Unknown material shape/i);
});

test("kitchen sink fixture (26-2): tables wrapped for horizontal scroll", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /<div class="util-table-scroll">/);
});

test("kitchen sink fixture (26-2): presentation CSS includes print break rules", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /@media print/);
  assert.match(html, /break-inside:avoid-page/);
  assert.match(html, /article\.util-task-block\{break-inside:avoid-page/);
});

test("kitchen sink fixture (26-3): no object Object leakage", () => {
  const { html } = renderKitchenSink(api);
  assert.doesNotMatch(html, /\[object Object\]/i);
});

test("kitchen sink fixture (26-3): metadata section folded into util-meta only", () => {
  const { html } = renderKitchenSink(api);
  const bodyBeforeMeta = html.split('<details class="util-meta"')[0];
  assert.doesNotMatch(bodyBeforeMeta, /<h2[^>]*>\s*Production Metadata/i);
  assert.match(html, /util-meta-section/);
  assert.match(html, /renderer-kitchen-sink-page|fixture_id/i);
});

test("kitchen sink fixture (26-3): checklist distinct from prompt set", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-checklist-block/);
  assert.match(html, /util-checklist-icon/);
  assert.match(html, /util-prompt-set/);
});

test("kitchen sink fixture (26-3): no hardcoded worksheet instruction", () => {
  const { html } = renderKitchenSink(api);
  assert.doesNotMatch(html, /Use this table to record your group/i);
});

test("kitchen sink fixture (26-3): unknown material uses generic icon heading", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /util-generic-material-icon/);
  assert.match(html, /Unknown material shape/i);
});

test("kitchen sink fixture (26-3): session timeline renders safely", () => {
  const { html } = renderKitchenSink(api);
  assert.match(html, /Session timeline/i);
  assert.match(html, /util-session-step/);
  assert.match(html, /Complete pattern showcase materials/i);
});
