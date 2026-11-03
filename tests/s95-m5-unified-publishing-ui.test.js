/**
 * Sprint 95 M5 / Sprint 96 — author-facing Learning Journey publishing UI.
 * Sprint 96: separate Unified control removed; ZIP/Journey is the sole LJ download.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const ljDesign = require("../lib/learning-journey-design-page.js");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");

function createElementStub(id) {
  const classes = new Set();
  const attrs = new Map();
  const listeners = new Map();
  const stub = {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: true,
    className: "",
    title: "",
    classList: {
      add: (...names) => names.forEach((n) => classes.add(n)),
      remove: (...names) => names.forEach((n) => classes.delete(n)),
      contains: (name) => classes.has(name),
      toggle: (name, force) => {
        if (force === true) classes.add(name);
        else if (force === false) classes.delete(name);
        else if (classes.has(name)) classes.delete(name);
        else classes.add(name);
        return classes.has(name);
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: (k, v) => attrs.set(k, String(v)),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
    hasAttribute: (k) => attrs.has(k),
    removeAttribute: (k) => attrs.delete(k),
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener: () => {},
    focus: () => {},
    click: function () {
      if (stub.disabled) return;
      const fns = listeners.get("click") || [];
      fns.forEach((fn) => fn({ preventDefault: () => {}, currentTarget: stub, target: stub }));
    },
    querySelectorAll: () => [],
    dispatchEvent: () => true
  };
  if (id === "utilitiesDownloadPackageBtn") {
    stub.textContent = "ZIP";
    stub.title = "Download Resource";
    stub.setAttribute("aria-label", "Download Resource");
  }
  if (id === "utilitiesDownloadHtmlBtn") {
    stub.textContent = "HTML";
    stub.setAttribute("aria-label", "HTML only (.html)");
  }
  return stub;
}

function loadPrismUi() {
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tag) => createElementStub("dynamic-" + tag),
    getElementById: (id) => {
      // Mirror production markup: separate Unified control removed (S96-D14).
      if (id === "utilitiesDownloadUnifiedJourneyBtn") return null;
      if (!elementStore.has(id)) elementStore.set(id, createElementStub(id));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("query"),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    fflate: require("fflate"),
    Blob: function Blob() {},
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    _: { debounce: (fn) => fn },
    document: documentStub,
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: sandbox.localStorage,
    URL: sandbox.URL,
    Blob: sandbox.Blob,
    fflate: sandbox.fflate,
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  api.cacheElementsForTest();
  api.attachEventListenersForTest();
  return { api, elements: elementStore };
}

test("M5/S96: index.html exposes a single package download control (no separate Unified button)", () => {
  assert.match(indexHtml, /id="utilitiesDownloadPackageBtn"/);
  assert.doesNotMatch(indexHtml, /utilitiesDownloadUnifiedJourneyBtn/);
  assert.doesNotMatch(indexHtml, /Download Unified Learning Journey/);
});

test("M5/S96: Learning Journey ZIP routes to unified packaging without console-only APIs", () => {
  assert.match(
    appJs,
    /isLearningJourneyCommissioningPreviewActive\(\)[\s\S]{0,220}handleLearningJourneyUnifiedShellPackageDownload\(\)/
  );
  assert.match(appJs, /Building Learning Journey package/);
  assert.match(appJs, /Learning Journey package downloaded\./);
  assert.match(appJs, /handleLearningJourneyUnifiedShellPackageDownloadForTest/);
  assert.match(appJs, /handleLearningJourneyLearnerPackageDownloadForTest/);
});

test("M5/S96: package control is labelled Download Learning Journey only in LJ preview", () => {
  const { api } = loadPrismUi();
  const before = api.getUtilitiesDownloadControlsStateForTest();
  assert.equal(before.unifiedHidden, true);
  assert.equal(before.unifiedControlPresent, false);
  assert.match(before.packageAriaLabel, /Download Resource/i);

  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "M5 publishing journey",
    sections: [
      {
        section_id: "journey_intro",
        title: "About",
        order: 1,
        exposition: "Intro."
      },
      {
        section_id: "exp_1",
        title: "Stop one",
        order: 2,
        exposition: "Body."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Stop one",
        product_id: "assessment_pack",
        status: "supported",
        specification_text: "A"
      }
    ]
  });
  assert.equal(journey.ok, true, (journey.errors || []).join("; "));

  const active = api.activateLearningJourneyCommissioningPreviewForTest(
    journey.page,
    "wf-m5-lj"
  );
  assert.equal(active, true);
  api.setUtilitiesDownloadControlsDisabledForTest(false);
  const shown = api.getUtilitiesDownloadControlsStateForTest();
  assert.equal(shown.unifiedHidden, true);
  assert.match(shown.packageAriaLabel, /^Download Learning Journey$/i);
  assert.equal(shown.packageLabel, "Journey");

  api.activateLearningJourneyCommissioningPreviewForTest(null);
  const hidden = api.getUtilitiesDownloadControlsStateForTest();
  assert.match(hidden.packageAriaLabel, /Download Resource/i);
  assert.equal(hidden.packageLabel, "ZIP");
});
