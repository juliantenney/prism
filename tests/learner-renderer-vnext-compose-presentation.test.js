"use strict";

/**
 * Sprint 68 — S68-IMP-005 composition moment presentation CSS.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const COMPOSITION_CSS_MARKERS = Object.freeze([
  ".util-learner-renderer-vnext .util-composition-moment{",
  ".util-learner-renderer-vnext .util-composition-moment-heading{",
  ".util-learner-renderer-vnext .util-composition-moment--orient",
  ".util-learner-renderer-vnext .util-composition-study-phase",
  ".util-learner-renderer-vnext .util-composition-moment .util-beat-instruction{border-left:0",
  ".util-learner-renderer-vnext .util-composition-learn-item--definition",
  ".util-learner-renderer-vnext .util-composition-moment--do",
  ".util-learner-renderer-vnext .util-composition-expected-output{",
  ".util-learner-renderer-vnext .util-learner-workspace{",
  ".util-learner-renderer-vnext .util-learner-workspace__input{",
  ".util-learner-renderer-vnext .util-composition-check-guidance{",
  ".util-learner-renderer-vnext .util-composition-reveal summary{",
  ".util-learner-renderer-vnext .util-composition-reveal__body{",
  "@media (max-width:720px){.util-learner-renderer-vnext .util-composition-moment",
  "@media print{.util-learner-renderer-vnext .util-composition-reveal"
]);

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
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
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

function stripStyleBlocks(html) {
  return String(html || "").replace(/<style>[\s\S]*?<\/style>/gi, "");
}

test("export shell includes scoped composition moment presentation CSS", () => {
  const api = loadPrismTestApi();
  const result = api.renderLearnerPageForTest(loadFixture(), {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  const html = String(result.html || "");

  for (const marker of COMPOSITION_CSS_MARKERS) {
    assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(html, /\.util-learner-renderer-vnext \.util-beat-instruction\{[^}]*border-left:3px solid #cbd5e1/);
  assert.match(
    html,
    /\.util-learner-renderer-vnext \.util-composition-moment \.util-beat-instruction\{border-left:0/
  );
});

test("moments mode A1 HTML structure is unchanged by presentation pass", () => {
  const sourcePage = loadFixture();
  const html = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(html, "A1");

  assert.match(a1Html, /data-composition-moment="orient"/);
  assert.match(a1Html, /data-composition-moment="learn"/);
  assert.match(a1Html, /data-composition-moment="do"/);
  assert.match(a1Html, /data-composition-moment="check"/);
  assert.equal((a1Html.match(/data-composition-moment="/g) || []).length, 4);
  assert.doesNotMatch(a1Html, /data-beat-function="/);

  assert.match(a1Html, /util-composition-moment-heading/);
  assert.match(a1Html, /util-composition-learn-item--definition/);
  assert.match(a1Html, /util-composition-expected-output/);
  assert.match(a1Html, /util-learner-workspace__input/);
  assert.match(a1Html, /util-composition-check-guidance/);
  assert.match(a1Html, /<details[^>]*data-reveal-mode="details"(?![^>]*\bopen\b)/);
});

test("beats mode A1 markup is unchanged by presentation pass", () => {
  const sourcePage = loadFixture();
  const first = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html,
    "A1"
  );
  const second = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html,
    "A1"
  );

  assert.equal(first, second);
  assert.doesNotMatch(first, /util-composition-moment/);
  assert.match(first, /data-beat-function="orientation"/);
  assert.match(first, /data-beat-function="explanation"/);
  assert.match(first, /data-beat-function="check_understanding"/);
});

test("moments and beats fragment HTML differ only by composition structure, not authored text loss", () => {
  const sourcePage = loadFixture();
  const beatsHtml = stripStyleBlocks(
    extractActivityHtml(renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html, "A1")
  );
  const momentsHtml = stripStyleBlocks(
    extractActivityHtml(renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html, "A1")
  );

  assert.notEqual(beatsHtml, momentsHtml);
  assert.match(momentsHtml, /Study the explanatory text introducing residuals/i);
  assert.match(momentsHtml, /Compare the sample response with the explanation/i);
  assert.match(momentsHtml, /Write a brief explanation distinguishing homoscedasticity/i);
  assert.match(beatsHtml, /Study the explanatory text introducing residuals/i);
  assert.match(beatsHtml, /Compare the sample response with the explanation/i);
  assert.match(beatsHtml, /Write a brief explanation distinguishing homoscedasticity/i);
});
