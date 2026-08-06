"use strict";

/**
 * Sprint 67 — learner renderer version selector (S67-BL-006).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
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
const moduleDir = path.join(repoRoot, "lib", "learner-renderer-vnext");

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
  "resolveBeatMaterialPlan",
  "insertExpectedOutputGuidanceBeforeChecklist"
]);

const EXPECTED_ACTIVITY_ORDER = Object.freeze(["A1", "A2", "A3", "A4", "A5"]);

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

function activityOrder(html) {
  return [...String(html).matchAll(/id="activity-([^"]+)"/g)].map((match) => match[1]);
}

function allMaterialIds(html) {
  return [...String(html).matchAll(/data-material-id="([^"]+)"/g)].map((match) => match[1]);
}

test("feature flag: default renderLearnerPage uses vNext output", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  const selected = api.renderLearnerPageForTest(fixture, { applyCompositionValidation: false });
  const explicit = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.equal(String(selected.html || ""), String(explicit.html || ""));
  assert.match(String(selected.html || ""), /util-page-export--vnext/);
  assert.match(String(selected.html || ""), /data-renderer="vnext"/);
});

test("feature flag: empty options object uses vNext output", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  const selected = api.renderLearnerPageForTest(fixture, {});
  const explicit = api.renderLearnerPageForTest(fixture, { rendererVersion: "vnext" });
  assert.equal(String(selected.html || ""), String(explicit.html || ""));
  VNEXT_ONLY_MARKERS.forEach((marker) => {
    assert.match(String(selected.html || ""), new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("feature flag: page export pipeline always uses vNext (legacy option ignored)", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  const forcedLegacy = api.renderLearnerPageForTest(fixture, { rendererVersion: "legacy" });
  const defaultPath = api.renderLearnerPageForTest(fixture, {});
  assert.ok(forcedLegacy && !forcedLegacy.error, forcedLegacy && forcedLegacy.error);
  assert.equal(String(forcedLegacy.html || ""), String(defaultPath.html || ""));
  VNEXT_ONLY_MARKERS.forEach((marker) => {
    assert.match(String(forcedLegacy.html || ""), new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  LEGACY_RENDERER_ONLY_MARKERS.forEach((marker) => {
    assert.equal(
      String(forcedLegacy.html || "").includes(marker),
      false,
      `Page export must not emit obsolete renderer marker: ${marker}`
    );
  });
});

test("feature flag: explicit vnext selects vNext structure", () => {
  const { api } = loadPrismTestApi();
  const html = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "vnext" });
  VNEXT_ONLY_MARKERS.forEach((marker) => {
    assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.match(html, /data-composition-mode="moments"/);
  assert.doesNotMatch(html, /data-beat-function="/);
  assert.deepEqual(activityOrder(html), EXPECTED_ACTIVITY_ORDER);
});

test("feature flag: vnext output excludes legacy renderer content", () => {
  const { api } = loadPrismTestApi();
  const html = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "vnext" });
  LEGACY_RENDERER_ONLY_MARKERS.forEach((marker) => {
    assert.equal(
      html.includes(marker),
      false,
      `vNext output must not contain legacy renderer marker: ${marker}`
    );
  });
});

test("feature flag: obsolete rendererVersion values cannot divert page export", () => {
  const { api } = loadPrismTestApi();
  const html = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "experimental" });
  VNEXT_ONLY_MARKERS.forEach((marker) => {
    assert.match(html, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.equal(typeof api.resolveLearnerRendererVersionForTest, "undefined");
});

test("feature flag: vnext path wraps canonical renderer fragment in export shell", () => {
  const { api } = loadPrismTestApi();
  const fixture = loadFixture();
  const { buildPageModel } = require("../lib/learner-renderer-vnext");
  const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
  const modelResult = buildPageModel(fixture);
  assert.equal(modelResult.ok, true);
  const directHtml = renderPage(modelResult.model);
  const entryHtml = renderViaPublicEntry(api, fixture, { rendererVersion: "vnext" });
  assert.match(entryHtml, /^<!doctype html>/i);
  assert.match(
    entryHtml,
    /<main class="util-learner-page util-page util-learner-renderer-vnext" data-renderer="vnext"(?:[^>]*) data-composition-mode="moments" data-composed-activity-count="5" data-beats-fallback-activity-count="0">/
  );
  assert.ok(entryHtml.includes('data-activity-id="A1"'));
  assert.doesNotMatch(entryHtml, /<header class="util-page-header util-learning-header"/);
  assert.ok(!entryHtml.includes(directHtml) || entryHtml.length > directHtml.length);
});

test("feature flag: vnext validation failure does not fall back to obsolete renderer", () => {
  const { api } = loadPrismTestApi();
  const broken = loadFixture();
  broken.activities = [];
  const result = api.renderLearnerPageForTest(broken, { rendererVersion: "vnext" });
  assert.ok(result && result.error, "Expected vNext model validation to fail.");
  assert.equal(result.html, undefined);
  LEGACY_RENDERER_ONLY_MARKERS.forEach((marker) => {
    assert.equal(String(result.html || "").includes(marker), false);
  });
});

test("feature flag: golden fixture subset through public vnext entry", () => {
  const { api } = loadPrismTestApi();
  const html = renderViaPublicEntry(api, loadFixture(), { rendererVersion: "vnext" });
  assert.deepEqual(activityOrder(html), EXPECTED_ACTIVITY_ORDER);

  const materialIds = allMaterialIds(html);
  const uniqueMaterialIds = [...new Set(materialIds)];
  assert.equal(uniqueMaterialIds.length, 24, "All authored materials must appear in vNext public entry output.");
  assert.ok(
    materialIds.length >= uniqueMaterialIds.length,
    "Table workspaces may repeat reference material wrappers."
  );

  const a3Html = html.slice(html.indexOf('id="activity-A3"'));
  const a4Start = a3Html.indexOf('id="activity-A4"');
  const a3Scope = a4Start >= 0 ? a3Html.slice(0, a4Start) : a3Html;
  assert.doesNotMatch(
    a3Scope,
    /data-beat-function="orientation"/,
    "A3 empty orientation must not emit a beat section."
  );

  LEGACY_RENDERER_ONLY_MARKERS.forEach((marker) => {
    assert.equal(html.includes(marker), false, `Golden vNext entry must not include ${marker}`);
  });
});

test("feature flag: selector module and vnext entry exclude legacy planner architecture", () => {
  const selectorSource = fs.readFileSync(
    path.join(moduleDir, "render-learner-page.js"),
    "utf8"
  );
  assert.doesNotMatch(selectorSource, /ld-beat-assignment-compose/);
  FORBIDDEN_ARCHITECTURE_TOKENS.forEach((token) => {
    assert.equal(selectorSource.includes(token), false, `Forbidden token in selector: ${token}`);
  });

  const rendererSource = ["render-page.js", "render-activity.js", "render-beat.js", "render-material.js"]
    .map((name) => fs.readFileSync(path.join(moduleDir, name), "utf8"))
    .join("\n");
  assert.doesNotMatch(rendererSource, /ld-beat-assignment-compose/);
  FORBIDDEN_ARCHITECTURE_TOKENS.forEach((token) => {
    assert.equal(rendererSource.includes(token), false, `Forbidden token in renderer: ${token}`);
  });
});

test("feature flag: normalizeRendererVersion defaults to vNext and rejects truthy non-vnext values", () => {
  const { normalizeRendererVersion } = require("../lib/learner-renderer-vnext/render-learner-page");
  assert.equal(normalizeRendererVersion(undefined), "vnext");
  assert.equal(normalizeRendererVersion(null), "vnext");
  assert.equal(normalizeRendererVersion(""), "vnext");
  assert.equal(normalizeRendererVersion("legacy"), "legacy");
  assert.equal(normalizeRendererVersion("vnext"), "vnext");
  assert.throws(() => normalizeRendererVersion(true), /Unsupported learner renderer version/);
  assert.throws(() => normalizeRendererVersion(1), /Unsupported learner renderer version/);
});

test("feature flag: Authoring has no learner renderer selector", () => {
  const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  assert.equal(indexHtml.includes('id="utilitiesRendererVersion"'), false);
  assert.equal(indexHtml.includes(">Learner renderer<"), false);
  assert.equal(/<option[^>]*value="legacy"/.test(indexHtml), false);
});
