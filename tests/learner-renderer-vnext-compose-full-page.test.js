"use strict";

/**
 * Sprint 68 — S68-IMP-011 full-page moments mode integration tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  wireBrowserGlobalThis,
  loadLearnerRendererVNextBrowserInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const {
  renderLearnerPageHtml,
  DEFAULT_COMPOSITION_MODE,
  normalizeCompositionMode
} = require("../lib/learner-renderer-vnext");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const EXPECTED_ACTIVITY_ORDER = ["A1", "A2", "A3", "A4", "A5"];
const EXPECTED_MOMENT_KINDS = ["orient", "learn", "do", "check"];

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
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
  sandbox.document = documentStub;
  sandbox.window = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
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
  sandbox.window.window = sandbox.window;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";

  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";

  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function collectIds(html) {
  return [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

function extractMomentHtml(activityHtml, momentKind) {
  const source = String(activityHtml || "");
  const marker = `data-composition-moment="${momentKind}"`;
  const start = source.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = source.lastIndexOf("<section", start);
  const nextMoment = source.indexOf('data-composition-moment="', start + marker.length);
  return source.slice(sectionStart, nextMoment >= 0 ? nextMoment : source.length);
}

function renderDefaultMomentsPage() {
  const sourcePage = loadFixture();
  const rendered = renderLearnerPageHtml(sourcePage);
  assert.equal(rendered.error, null);
  assert.ok(rendered.html);
  return rendered.html;
}

function renderBeatsPage() {
  const sourcePage = loadFixture();
  const rendered = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" });
  assert.equal(rendered.error, null);
  assert.ok(rendered.html);
  return rendered.html;
}

test("configuration: DEFAULT_COMPOSITION_MODE is moments", () => {
  assert.equal(DEFAULT_COMPOSITION_MODE, "moments");
  assert.equal(normalizeCompositionMode(undefined), "moments");
});

test("application wiring: default preview/export uses moments mode", () => {
  const api = loadPrismTestApi();
  const fixture = loadFixture();
  const defaultResult = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  const beatsResult = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false,
    compositionMode: "beats"
  });

  assert.ok(defaultResult && !defaultResult.error);
  assert.ok(beatsResult && !beatsResult.error);
  assert.notEqual(defaultResult.html, beatsResult.html);
  assert.match(defaultResult.html, /data-composition-mode="moments"/);
  assert.doesNotMatch(defaultResult.html, /data-beat-function="/);
  assert.match(beatsResult.html, /data-beat-function="/);
  assert.doesNotMatch(beatsResult.html, /data-composition-mode="moments"/);
});

test("application wiring: browser bundle default matches node default", () => {
  const api = loadPrismTestApi();
  const fixture = loadFixture();
  const appHtml = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  }).html;
  const nodeHtml = renderDefaultMomentsPage();
  assert.ok(appHtml.includes('data-composition-mode="moments"'));
  assert.ok(nodeHtml.includes('data-composition-mode="moments"'));
});

test("full page: five activities each render four composed moments", () => {
  const html = renderDefaultMomentsPage();

  assert.match(html, /data-composition-mode="moments"/);
  assert.equal((html.match(/data-composition-moment="/g) || []).length, 20);
  assert.doesNotMatch(html, /data-beat-function="/);

  EXPECTED_ACTIVITY_ORDER.forEach((activityId) => {
    const activityHtml = extractActivityHtml(html, activityId);
    assert.ok(activityHtml, activityId + " missing");
    const kinds = [...activityHtml.matchAll(/data-composition-moment="([^"]+)"/g)].map(
      (match) => match[1]
    );
    assert.deepEqual(kinds, EXPECTED_MOMENT_KINDS, activityId);
  });
});

test("full page: learner surface inventory matches composed page", () => {
  const html = renderDefaultMomentsPage();

  assert.equal((html.match(/data-workspace-kind="table_entry"/g) || []).length, 3);
  assert.equal((html.match(/data-workspace-capability="text_entry"/g) || []).length, 3);
  assert.equal((html.match(/util-learner-workspace__input/g) || []).length, 3);
  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 29);

  const learnHtml = EXPECTED_ACTIVITY_ORDER.map((activityId) =>
    extractMomentHtml(extractActivityHtml(html, activityId), "learn")
  ).join("");
  assert.doesNotMatch(learnHtml, /data-workspace-kind="table_entry"/);
  assert.doesNotMatch(learnHtml, /data-workspace-capability="text_entry"/);

  const a5Html = extractActivityHtml(html, "A5");
  const tablePos = a5Html.indexOf('data-workspace-kind="table_entry"');
  const textPos = a5Html.indexOf('data-workspace-capability="text_entry"');
  assert.ok(tablePos >= 0 && textPos >= 0);
  assert.ok(tablePos < textPos, "A5 table_entry must precede text_entry");
});

test("full page: accessibility ids are unique and table headers resolve", () => {
  const html = renderDefaultMomentsPage();
  const ids = collectIds(html);
  const uniqueIds = new Set(ids);
  assert.equal(ids.length, uniqueIds.size, "duplicate id attributes on full page");

  const labelledByMatches = [
    ...html.matchAll(/aria-labelledby="([^"]+)"/g),
    ...html.matchAll(/headers="([^"]+)"/g)
  ];
  labelledByMatches.forEach((match) => {
    match[1].split(/\s+/).filter(Boolean).forEach((id) => {
      assert.ok(uniqueIds.has(id), "missing referenced id: " + id);
    });
  });

  assert.match(html, /Write your justified recommendation/);
  assert.match(html, /Explain the chain of effects/);
});

test("legacy compatibility: explicit beats mode remains available", () => {
  const html = renderBeatsPage();
  assert.doesNotMatch(html, /data-composition-mode="moments"/);
  assert.match(html, /data-beat-function="/);
  assert.doesNotMatch(html, /data-composition-moment="/);
});

test("regression: default output is deterministic", () => {
  const first = renderDefaultMomentsPage();
  const second = renderDefaultMomentsPage();
  assert.equal(first, second);
});
