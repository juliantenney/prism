"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const vnext = require("../lib/learner-renderer-vnext");
const iconRegistry = require("../lib/learner-renderer-vnext/learner-icon-registry");
const learnerIcons = require("../lib/learner-renderer-vnext/learner-icon-renderer");
const {
  discoverVisualAffordanceHooks
} = require("../lib/learner-renderer-vnext/discover-visual-affordance-hooks");
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

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function renderVnextHtml(page, options) {
  const rendered = vnext.renderLearnerPageHtml(page, options);
  assert.equal(rendered.error, null, rendered.error || "render failed");
  return String(rendered.html || "");
}

function renderBeatsHtml(page) {
  return renderVnextHtml(page, { compositionMode: "beats" });
}

function countMatches(html, pattern) {
  return (String(html || "").match(pattern) || []).length;
}

test("icon registry: all supported semantic keys resolve deterministically", () => {
  const keys = iconRegistry.listSupportedSemanticKeys();
  assert.ok(keys.length >= 20);
  keys.forEach(function (key) {
    const resolved = iconRegistry.getLearnerIcon(key);
    assert.ok(resolved, "missing icon for " + key);
    assert.ok(resolved.iconKey, "missing iconKey for " + key);
  });
  assert.equal(iconRegistry.getLearnerIcon("section.unknown_type"), null);
});

test("icon registry: material types map from model type names only", () => {
  assert.equal(iconRegistry.semanticKeyForMaterialType("worked_example"), "material.worked_example");
  assert.equal(iconRegistry.semanticKeyForPromptField("self_explanation_prompt"), "guidance.self_explanation");
  assert.equal(iconRegistry.semanticKeyForOrientationType("overview"), "section.overview");
});

test("icon renderer: emits aria-hidden lucide svg inside util-semantic-icon", () => {
  const fragment = learnerIcons.renderSemanticIcon("section.overview");
  assert.match(fragment, /<span class="util-semantic-icon" aria-hidden="true">/);
  assert.match(fragment, /<svg[^>]*aria-hidden="true"/);
  assert.match(fragment, /util-lucide-icon/);
});

test("vNext html: page-level section icons render with visible labels", () => {
  const html = renderVnextHtml(loadFixture());
  assert.match(html, /util-section-heading util-icon-heading[\s\S]*Overview/);
  assert.match(html, /util-section-heading util-icon-heading[\s\S]*Learning outcomes/);
  assert.match(html, /util-section-heading util-icon-heading[\s\S]*How this lesson progresses/);
  assert.match(html, /util-section-heading util-icon-heading[\s\S]*Self assessment/);
  assert.match(html, /util-section-heading util-icon-heading[\s\S]*Study tips/);
});

test("vNext html: guidance and beat icons render from semantic types", () => {
  const momentsHtml = renderVnextHtml(loadFixture());
  assert.match(
    momentsHtml,
    /data-source-field="reasoning_orientation"[\s\S]*Focus on the spread of errors/
  );
  assert.match(
    momentsHtml,
    /data-source-field="self_explanation_prompt"[\s\S]*How would you explain/
  );

  const beatsHtml = renderBeatsHtml(loadFixture());
  assert.match(
    beatsHtml,
    /data-guidance-type="reasoning_orientation"[\s\S]*util-guidance-label util-icon-heading[\s\S]*How to think/
  );
  assert.match(beatsHtml, /util-beat-heading util-icon-heading[\s\S]*Reflect/);
  assert.match(beatsHtml, /util-beat-instruction util-icon-heading/);
});

test("vNext html: material and expected output icons render", () => {
  const html = renderVnextHtml(loadFixture());
  assert.match(html, /util-material-heading util-icon-heading[\s\S]*Worked example/i);
  assert.match(html, /util-composition-subheading[\s\S]*What to produce/);
});

test("vNext html: assessment feedback summary retains visible label with icon", () => {
  const html = renderVnextHtml(loadFixture());
  assert.match(html, /util-assessment-feedback[\s\S]*<summary>[\s\S]*Check answer/);
  assert.match(html, /util-assessment-title util-icon-heading[\s\S]*Question 1/);
  assert.doesNotMatch(html, /util-assessment-number/);
});

test("vNext html: no duplicate visible labels from icon pattern", () => {
  const html = renderVnextHtml(loadFixture());
  assert.equal(countMatches(html, />Learning outcomes</g), 1);
  assert.equal(countMatches(html, />Study tips</g), 1);
});

test("vNext export shell: standalone document includes icon css", () => {
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
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  const result = api.renderLearnerPageForTest(loadFixture(), { rendererVersion: "vnext" });
  assert.ok(result && result.html);
  assert.match(String(result.html), /util-semantic-icon/);
  assert.match(String(result.html), /\.util-lucide-icon/);
  assert.match(String(result.html), /#journey-orient/);
});

test("visual affordance hooks unchanged after icon restoration", () => {
  const html = renderVnextHtml(loadFixture());
  const hooks = discoverVisualAffordanceHooks(html);
  assert.ok(hooks.length >= 2);
  hooks.forEach(function (hook) {
    assert.match(hook.raw, /hidden/);
    assert.match(hook.raw, /aria-hidden="true"/);
    assert.doesNotMatch(hook.raw, /util-semantic-icon/);
  });
  assert.equal(countMatches(html, /<div class="util-visual-affordance /g), hooks.length);
});

test("legacy renderer unchanged for inflation workshop icons baseline", () => {
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
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  const inflationPath = path.join(
    repoRoot,
    "tests",
    "fixtures",
    "page-render",
    "ld-inflation-workshop-page-full.json"
  );
  const page = JSON.parse(fs.readFileSync(inflationPath, "utf8"));
  const legacy = api.buildUtilityStructuredHtmlForTest(page, undefined, { rendererVersion: "legacy" });
  assert.ok(legacy && !legacy.error);
  const html = String(legacy.html || "");
  assert.match(html, /util-lucide-icon/);
  assert.doesNotMatch(html, /util-semantic-icon/);
});
