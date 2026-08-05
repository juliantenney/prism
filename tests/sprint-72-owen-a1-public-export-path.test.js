"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  loadLearnerRendererVNextBrowserInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const fixturePath = path.join(__dirname, "fixtures", "page-render", "owen-a1-assembled-shape.json");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {}
  };
}

function loadAppWithBrowserBundle() {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = {
    console,
    setTimeout: function () { return 0; },
    clearTimeout: function () {},
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "loading",
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(appSource, sandbox, { filename: "app.js" });
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
    if (depth === 0) return source.slice(openTagStart, tagRe.lastIndex);
  }
  return "";
}

test("S72-T-073 public export path: Owen A1 renders orient-learn-do-check with one textarea and no production instruction in Learn", () => {
  const api = loadAppWithBrowserBundle();
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = api.renderLearnerPageForTest(parsed, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");
  const a1Html = extractActivityHtml(html, "A1");
  assert.ok(a1Html, "A1 block missing from public export path");

  const orientIdx = a1Html.indexOf('data-composition-moment="orient"');
  const learnIdx = a1Html.indexOf('data-composition-moment="learn"');
  const doIdx = a1Html.indexOf('data-composition-moment="do"');
  const checkIdx = a1Html.indexOf('data-composition-moment="check"');
  assert.ok(orientIdx >= 0 && learnIdx > orientIdx && doIdx > learnIdx && checkIdx > doIdx);

  const doSection = a1Html.slice(doIdx, checkIdx);
  const learnSection = a1Html.slice(learnIdx, doIdx);
  assert.equal((doSection.match(/data-workspace-capability="text_entry"/g) || []).length, 1);
  assert.equal((a1Html.match(/<textarea\b/g) || []).length, 1);
  assert.doesNotMatch(learnSection, /Then write a short paragraph/i);
});
