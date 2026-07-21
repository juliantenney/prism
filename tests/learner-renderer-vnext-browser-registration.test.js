"use strict";

/**
 * Sprint 67 — browser runtime registration for learner renderer vNext (S67-BL-006A).
 * Exercises lib/learner-renderer-vnext-browser.js without test-only Node injection.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  LEARNER_RENDERER_VNEXT_BROWSER_LIB,
  wireBrowserGlobalThis,
  loadLearnerRendererVNextBrowserInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const browserBundlePath = path.join(repoRoot, LEARNER_RENDERER_VNEXT_BROWSER_LIB);
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const VNEXT_ONLY_MARKERS = Object.freeze([
  'class="util-learner-page',
  'data-renderer="vnext"',
  "util-learner-renderer-vnext",
  "util-vnext-activity",
  "data-material-id="
]);

const LEGACY_RENDERER_ONLY_MARKERS = Object.freeze([
  "util-journey-compass-header",
  'id="activity-1"',
  "util-journey-compass__title"
]);

const FORBIDDEN_ARCHITECTURE_TOKENS = Object.freeze([
  "scoreClauseForBeat",
  "scoreMaterialForBeat",
  "chooseSinkBeatIndex",
  "earliestStepMention",
  "resolveBeatMaterialPlan",
  "orderedMaterialKeysRendered",
  "checklistRendered",
  "insertExpectedOutputGuidanceBeforeChecklist"
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

function createBrowserSandbox() {
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
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  return sandbox;
}

function loadProductionBrowserRuntime() {
  const sandbox = createBrowserSandbox();
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API after production script order.");
  return { api, sandbox };
}

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function renderViaPublicEntry(api, fixture, options) {
  const result = api.renderLearnerPageForTest(fixture, options);
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

test("browser registration: production bundle exposes PRISM_LEARNER_RENDERER_VNEXT", () => {
  const sandbox = createBrowserSandbox();
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  assert.ok(
    sandbox.window.PRISM_LEARNER_RENDERER_VNEXT,
    "Expected window.PRISM_LEARNER_RENDERER_VNEXT after loading browser bundle."
  );
});

test("browser registration: renderLearnerPageHtml API is available", () => {
  const sandbox = createBrowserSandbox();
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  assert.equal(
    typeof sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml,
    "function"
  );
});

test("browser registration: bundle loads before app.js without test injection", () => {
  const { api, sandbox } = loadProductionBrowserRuntime();
  assert.ok(sandbox.window.PRISM_LEARNER_RENDERER_VNEXT);
  assert.equal(typeof api.renderLearnerPageForTest, "function");
  const html = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "vnext" });
  VNEXT_ONLY_MARKERS.forEach((marker) => {
    assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("browser registration: default pipeline uses vNext export shell", () => {
  const { api } = loadProductionBrowserRuntime();
  const html = renderViaPublicEntry(api, loadFixture());
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /data-renderer="vnext"/);
});

test("browser registration: explicit legacy matches baseline", () => {
  const { api } = loadProductionBrowserRuntime();
  const fixture = loadFixture();
  const baseline = api.buildUtilityStructuredHtmlForTest(fixture, ["sections"], {
    applyCompositionValidation: false,
    rendererVersion: "legacy"
  });
  assert.ok(baseline && !baseline.error, baseline && baseline.error);
  const legacy = api.renderLearnerPageForTest(fixture, { rendererVersion: "legacy" });
  assert.equal(String(legacy.html || ""), String(baseline.html || ""));
});

test("browser registration: vnext and legacy paths stay exclusive", () => {
  const { api } = loadProductionBrowserRuntime();
  const vnextHtml = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "vnext" });
  const legacyHtml = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "legacy" });
  LEGACY_RENDERER_ONLY_MARKERS.forEach((marker) => {
    assert.equal(vnextHtml.includes(marker), false, `vNext must not include ${marker}`);
  });
  VNEXT_ONLY_MARKERS.forEach((marker) => {
    assert.equal(legacyHtml.includes(marker), false, `Legacy must not include ${marker}`);
  });
});

test("browser registration: vnext validation failure does not fall back to legacy", () => {
  const { api } = loadProductionBrowserRuntime();
  const broken = loadFixture();
  broken.activities = [];
  const result = api.renderLearnerPageForTest(broken, { rendererVersion: "vnext" });
  assert.ok(result && result.error, "Expected vNext validation error.");
  assert.equal(result.html, undefined);
});

test("browser registration: bundle is loaded before selector can invoke vnext", () => {
  const sandbox = createBrowserSandbox();
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  assert.equal(sandbox.window.PRISM_LEARNER_RENDERER_VNEXT, undefined);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  assert.ok(sandbox.window.PRISM_LEARNER_RENDERER_VNEXT);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const result = sandbox.window.__PRISM_TEST_API.renderLearnerPageForTest(loadFixture(), {
    rendererVersion: "vnext"
  });
  assert.ok(result && !result.error, result && result.error);
  assert.match(String(result.html || ""), /data-renderer="vnext"/);
});

test("browser registration: direct and browser bundle outputs agree", () => {
  const sandbox = createBrowserSandbox();
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  const fixture = loadFixture();
  const browserDirect = sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(fixture);
  assert.ok(browserDirect && !browserDirect.error, browserDirect && browserDirect.error);

  const nodeDirect = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml(
    fixture
  );
  assert.equal(String(browserDirect.html || ""), String(nodeDirect.html || ""));
});

test("browser registration: bundle excludes legacy planner architecture", () => {
  const source = fs.readFileSync(browserBundlePath, "utf8");
  assert.doesNotMatch(source, /ld-beat-assignment-compose/);
  FORBIDDEN_ARCHITECTURE_TOKENS.forEach((token) => {
    assert.equal(source.includes(token), false, `Forbidden architecture token in bundle: ${token}`);
  });
});

test("browser registration: index.html includes bundle before app.js", () => {
  const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const bundlePos = indexHtml.indexOf(LEARNER_RENDERER_VNEXT_BROWSER_LIB);
  const appPos = indexHtml.indexOf("app.js");
  assert.ok(bundlePos >= 0, "index.html must load learner-renderer-vnext-browser.js.");
  assert.ok(appPos >= 0, "index.html must load app.js.");
  assert.ok(bundlePos < appPos, "Browser bundle must load before app.js.");
});
