/**
 * Authoring export controls: HTML/ZIP/Open labels, auto filenames, no format/filename fields.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fflate = require("fflate");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const learnerPackage = require("../lib/learner-package.js");
const ljUnified = require("../lib/learning-journey-unified-shell.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");

function createElementStub(id) {
  const hidden = new Set();
  const attrs = new Map();
  const stub = {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    hidden: false,
    classList: {
      add: (...names) => names.forEach((n) => hidden.add(n)),
      remove: (...names) => names.forEach((n) => hidden.delete(n)),
      contains: (name) => hidden.has(name),
      toggle: (name, force) => {
        if (force === true) hidden.add(name);
        else if (force === false) hidden.delete(name);
        else if (hidden.has(name)) hidden.delete(name);
        else hidden.add(name);
        return hidden.has(name);
      }
    },
    setAttribute: (k, v) => attrs.set(k, String(v)),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
    hasAttribute: (k) => attrs.has(k),
    removeAttribute: (k) => attrs.delete(k),
    addEventListener: () => {},
    appendChild: () => {},
    removeChild: () => {},
    click: () => {}
  };
  if (id === "utilitiesDownloadPackageBtn") {
    stub.textContent = "ZIP";
    stub.title = "Download ZIP";
    stub.setAttribute("aria-label", "Download ZIP");
  }
  if (id === "utilitiesDownloadHtmlBtn") {
    stub.textContent = "HTML";
    stub.title = "Download HTML";
    stub.setAttribute("aria-label", "Download HTML");
  }
  if (id === "utilitiesOpenTabBtn") {
    stub.textContent = "Open";
    stub.title = "Open in New Tab";
    stub.setAttribute("aria-label", "Open in New Tab");
  }
  return stub;
}

function loadUi() {
  const elementStore = new Map();
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    createElement: (tag) => createElementStub("dynamic-" + tag),
    getElementById: (id) => {
      if (id === "utilitiesDownloadUnifiedJourneyBtn") return null;
      if (id === "utilitiesFileName") return null;
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
    fflate,
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
  if (typeof api.syncUtilitiesUnifiedJourneyDownloadControlForTest === "function") {
    api.syncUtilitiesUnifiedJourneyDownloadControlForTest();
  }
  return api;
}

test("Authoring export UI removes filename field and keeps Open/HTML/ZIP; JSON stays Advanced-only", () => {
  assert.doesNotMatch(indexHtml, /id="utilitiesOutputFormat"/);
  assert.doesNotMatch(indexHtml, /Output format/);
  assert.doesNotMatch(indexHtml, /utilities-export-filename-row/);
  assert.doesNotMatch(indexHtml, /id="utilitiesFileName"/);
  assert.doesNotMatch(indexHtml, /File name \(optional\)/);
  assert.match(indexHtml, /id="utilitiesOpenTabBtn"/);
  assert.match(indexHtml, /id="utilitiesDownloadHtmlBtn"/);
  assert.match(indexHtml, /id="utilitiesDownloadPackageBtn"/);
  assert.match(indexHtml, />\s*Open\s*</);
  assert.match(indexHtml, />\s*HTML\s*</);
  assert.match(indexHtml, />\s*ZIP\s*</);

  const advancedStart = indexHtml.indexOf('id="utilitiesAdvancedJson"');
  const advancedEnd = indexHtml.indexOf("</details>", advancedStart);
  assert.ok(advancedStart >= 0 && advancedEnd > advancedStart);
  const advancedBlock = indexHtml.slice(advancedStart, advancedEnd);
  assert.match(advancedBlock, /utilitiesJsonInput/);
  assert.doesNotMatch(advancedBlock, /utilitiesFileName/);
  assert.doesNotMatch(advancedBlock, /utilitiesOutputFormat/);
  const pipelineHostAt = indexHtml.indexOf('id="utilitiesPipelineDetailsHost"');
  assert.ok(pipelineHostAt > advancedEnd, "Pipeline details host sits below Advanced JSON");
});

test("HTML and ZIP export buttons use consistent labels for all products", () => {
  const api = loadUi();
  api.setUtilitiesDownloadControlsDisabledForTest(false);
  const state = api.getUtilitiesDownloadControlsStateForTest();
  assert.equal(state.htmlLabel, "HTML");
  assert.equal(state.packageLabel, "ZIP");
  assert.match(state.packageTitle, /^Download ZIP$/i);
  assert.match(state.packageAriaLabel, /^Download ZIP$/i);
});

test("ordinary resource titles derive HTML and ZIP filenames automatically", () => {
  const api = loadUi();
  assert.equal(
    api.getUtilityOutputBaseNameForTest({ title: "The Committee Recommendation" }, ""),
    "the-committee-recommendation"
  );
  assert.equal(
    api.getUtilityHtmlDownloadNameForTest("the-committee-recommendation"),
    "the-committee-recommendation.html"
  );
  assert.equal(
    api.getUtilityLearnerPackageZipNameForTest("the-committee-recommendation"),
    "the-committee-recommendation.zip"
  );
  assert.equal(
    api.getUtilityJsonDownloadNameForTest("the-committee-recommendation"),
    "the-committee-recommendation.json"
  );

  api.setUtilitiesAssembledPageSnapshotForTest({
    artifact_type: "page",
    title: "When the Evidence Changes"
  });
  assert.equal(api.resolveUtilitiesDownloadBaseNameForTest(), "when-the-evidence-changes");
  assert.equal(
    api.getUtilityHtmlDownloadNameForTest(api.resolveUtilitiesDownloadBaseNameForTest()),
    "when-the-evidence-changes.html"
  );
  // Former optional override must not exist / must not change derivation.
  api.setUtilitiesFileNameForTest(" Committee Recommendation ");
  assert.equal(api.resolveUtilitiesDownloadBaseNameForTest(), "when-the-evidence-changes");
  assert.equal(api.getUtilitiesFileNameForTest(), "");
});

test("parent Learning Journey title drives journey ZIP filename", () => {
  assert.equal(
    ljUnified.buildLearningJourneyZipBasename("The Decision That Went Wrong"),
    "the-decision-that-went-wrong.zip"
  );
  assert.equal(
    ljUnified.buildLearningJourneyZipBasename("Learning Journey: The Decision That Went Wrong"),
    "the-decision-that-went-wrong.zip"
  );
  assert.equal(
    ljPackage.buildLearningJourneyZipBasename("The Decision That Went Wrong"),
    "the-decision-that-went-wrong.zip"
  );
});

test("export filename stem sanitises punctuation, length, and empty titles", () => {
  assert.equal(
    learnerPackage.sanitizeExportFilenameStem("Hello, World!!! / Evidence?"),
    "hello-world-evidence"
  );
  assert.equal(learnerPackage.sanitizeExportFilenameStem("   "), "");
  assert.equal(learnerPackage.sanitizeExportFilenameStem("---"), "");

  const long =
    "This Is An Extremely Long Resource Title That Should Be Truncated At A Sensible Word Boundary Before Eighty Characters Are Exceeded Completely";
  const stem = learnerPackage.sanitizeExportFilenameStem(long, 80);
  assert.ok(stem.length <= 80);
  assert.doesNotMatch(stem, /-$/);
  assert.match(stem, /^this-is-an-extremely-long-resource-title/);

  const api = loadUi();
  assert.equal(api.getUtilityOutputBaseNameForTest({ title: "" }, ""), "artifact");
  assert.equal(api.getUtilityOutputBaseNameForTest({ title: "???" }, "ignored"), "artifact");
  assert.equal(
    api.getUtilityOutputBaseNameForTest({ title: "", artifact_type: "page" }, ""),
    "page"
  );
  assert.equal(api.sanitizeUtilitiesExportFilenameStemForTest(""), "");
  assert.equal(api.getUtilityHtmlDownloadNameForTest(""), "rendered-output.html");
  assert.equal(api.getUtilityLearnerPackageZipNameForTest(""), "rendered-output.zip");
  assert.equal(api.getUtilityJsonDownloadNameForTest(""), "rendered-output.json");
  assert.equal(ljUnified.buildLearningJourneyZipBasename(""), "learning-journey.zip");
});
