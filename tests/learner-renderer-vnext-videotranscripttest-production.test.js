"use strict";

/**
 * Sprint 68 IMP-014B production path — VideoTranscriptTest workflow render diagnostics.
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
const {
  WORKFLOW_ID,
  WORKFLOW_NAME,
  readVideoTranscriptTestPage
} = require("./videotranscripttest-workflow-fixture.js");

const repoRoot = path.resolve(__dirname, "..");
const browserBundlePath = path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js");
const sourceRulesPath = path.join(repoRoot, "lib", "learner-renderer-vnext", "archetype-rules.js");
const heteroFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const kitchenSinkPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "learner-renderer-kitchen-sink-page.json"
);

const EPISODE_PLAN_V1_VARIANT_IDS = Object.freeze([
  "understand-explain-model-practise-verify",
  "understand-explain-model-verify",
  "analyse-explain-model-practise-verify",
  "analyse-model-practise-verify",
  "analyse-explain-practise-verify",
  "apply-explain-practise-verify",
  "evaluate-explain-judgement-practise-transfer-verify",
  "evaluate-explain-model-practise-transfer-verify"
]);

const JOURNEY_COMPRESSED_VARIANT_IDS = Object.freeze([
  "understand-orient-explain-check",
  "apply-orient-practise-feedback",
  "analyse-orient-investigate-synthesise",
  "evaluate-orient-judge-reflect"
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
  var source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  var sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  var elementStore = new Map();
  var documentStub = {
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
  var windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/prism/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, copyText: () => Promise.resolve(true) },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () =>
        Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, sandbox: sandbox };
}

function loadBrowserBundleApi() {
  var sandbox = { console, setTimeout, clearTimeout, Promise };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(browserBundlePath, "utf8"), sandbox, {
    filename: browserBundlePath
  });
  return sandbox.PRISM_LEARNER_RENDERER_VNEXT;
}

function buildUnknownSequencePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Unknown sequence diagnostic page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "X1",
        title: "Invalid beat sequence",
        learner_task: "Do one thing.",
        expected_output: "One output.",
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "explanation" }, { function: "transfer" }, { function: "verification" }]
        },
        materials: [
          {
            material_id: "X1-M1",
            material_type: "text",
            title: "Text",
            body_format: "markdown",
            body: "Body"
          },
          {
            material_id: "X1-M2",
            material_type: "checklist",
            title: "Checklist",
            body_format: "markdown",
            body: "- One"
          }
        ]
      }
    ]
  };
}

test("production: browser bundle is rebuilt and includes episode-plan-v1 variant IDs", () => {
  var source = fs.readFileSync(sourceRulesPath, "utf8");
  var bundle = fs.readFileSync(browserBundlePath, "utf8");
  EPISODE_PLAN_V1_VARIANT_IDS.concat(JOURNEY_COMPRESSED_VARIANT_IDS).forEach(function (variantId) {
    assert.match(source, new RegExp('"' + variantId + '"'));
    assert.match(
      bundle,
      new RegExp('"' + variantId + '"'),
      "Stale browser bundle missing variant: " + variantId
    );
  });
});

test("production: browser bundle and Node renderLearnerPageHtml agree for heteroscedasticity", () => {
  var fixture = JSON.parse(fs.readFileSync(heteroFixturePath, "utf8"));
  var nodeLib = require("../lib/learner-renderer-vnext/render-learner-page");
  var browserLib = loadBrowserBundleApi();
  var nodeResult = nodeLib.renderLearnerPageHtml(fixture);
  var browserResult = browserLib.renderLearnerPageHtml(fixture);
  assert.equal(nodeResult.error, null, nodeResult.error);
  assert.equal(browserResult.error, null, browserResult.error);
  assert.equal(String(browserResult.html || ""), String(nodeResult.html || ""));
});

test("production: unknown beat sequence fails with grouped primary diagnostic and cascade summary", () => {
  var buildPageModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
  var page = buildUnknownSequencePage();
  var result = buildPageModel(page);
  assert.equal(result.ok, false);
  assert.ok(result.diagnostics && result.diagnostics.cascadeSummary);
  assert.ok(result.diagnostics.cascadeSummary.X1);
  assert.equal(result.diagnostics.cascadeSummary.X1.primaryCode, "UNKNOWN_ARCHETYPE_VARIANT");
  assert.ok(result.diagnostics.cascadeSummary.X1.consequenceCounts.materials >= 1);
  assert.ok(result.diagnostics.cascadeSummary.X1.consequenceCounts.taskSteps >= 1);
  assert.ok(result.diagnostics.cascadeSummary.X1.consequenceCounts.expectedOutputs >= 1);

  var renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;
  var rendered = renderPage(page);
  assert.ok(rendered.error);
  assert.match(rendered.error, /Activity X1 failed page-model construction/);
  assert.match(rendered.error, /UNKNOWN_ARCHETYPE_VARIANT/);
  assert.match(rendered.error, /Consequences:/);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "UNASSIGNED_MATERIAL" && error.cascadeOf === "UNKNOWN_ARCHETYPE_VARIANT";
    })
  );
});

test("production: heteroscedasticity golden page still renders unchanged through Node", () => {
  var renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;
  var fixture = JSON.parse(fs.readFileSync(heteroFixturePath, "utf8"));
  var result = renderPage(fixture);
  assert.equal(result.error, null, result.error);
  assert.ok(result.html && result.html.length > 1000);
});

test("production: kitchen sink page still renders unchanged through Node", () => {
  var renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;
  var fixture = JSON.parse(fs.readFileSync(kitchenSinkPath, "utf8"));
  var result = renderPage(fixture);
  assert.equal(result.error, null, result.error);
  assert.ok(result.html && result.html.length > 1000);
});

test(
  "production: VideoTranscriptTest authoritative page resolves archetypes and renders",
  () => {
    var loaded = readVideoTranscriptTestPage();
    assert.equal(String(loaded.provenance.workflow_id), WORKFLOW_ID);
    assert.equal(String(loaded.provenance.workflow_name || ""), WORKFLOW_NAME);

    var inspectActivitiesArchetypes =
      require("../lib/learner-renderer-vnext/archetype-diagnostics").inspectActivitiesArchetypes;
    var inspections = inspectActivitiesArchetypes(loaded.page.activities || []);
    assert.equal(inspections.length, loaded.page.activities.length);
    inspections.forEach(function (row) {
      assert.equal(row.match, true, row.activityId + " " + (row.noMatchReason || ""));
    });

    var buildPageModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
    var modelResult = buildPageModel(loaded.page);
    assert.equal(modelResult.ok, true, modelResult.errors.map((e) => e.code).join(", "));
    assert.deepEqual(modelResult.diagnostics.cascadeSummary, {});

    var { api } = loadPrismTestApi();
    var nodeLib = require("../lib/learner-renderer-vnext/render-learner-page");
    var exportResult = api.renderLearnerPageForTest(loaded.page, {
      rendererVersion: "vnext",
      applyCompositionValidation: false
    });
    assert.equal(exportResult.error, null, exportResult.error);
    assert.ok(exportResult.html && exportResult.html.length > 1000);

    var browserLib = loadBrowserBundleApi();
    var nodeResult = nodeLib.renderLearnerPageHtml(loaded.page);
    var browserResult = browserLib.renderLearnerPageHtml(loaded.page);
    assert.equal(nodeResult.error, null, nodeResult.error);
    assert.equal(browserResult.error, null, browserResult.error);
    assert.equal(String(browserResult.html || ""), String(nodeResult.html || ""));
  }
);
