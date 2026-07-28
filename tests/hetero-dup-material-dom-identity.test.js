"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  DEFAULT_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");
const renderer = require("../lib/learner-renderer-vnext/index.js");

const repoRoot = path.resolve(__dirname, "..");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "hetero-dup-investigation-source.json"
);
const EXPECTED_FIXTURE_SHA256 =
  "df7cc025ece109280c46e0422a9e3cb99e34c945929dba92b80987eb678e62f5";
const SECTION_ORDER = [
  "overview",
  "learning_purpose",
  "knowledge_summary",
  "learning_activities",
  "learning_sequence",
  "activity_materials",
  "assessment_check",
  "support_notes",
  "study_tips"
];
const DUPLICATE_IDS = ["A2-M3", "A3-M2", "A4-M3", "A5-M2", "A6-M2"];

function loadFixture() {
  const raw = fs.readFileSync(fixturePath, "utf8");
  const sha256 = crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  assert.equal(
    sha256,
    EXPECTED_FIXTURE_SHA256,
    "Fixture hash mismatch; aborting because payload is not the pasted source of truth."
  );
  return { raw, json: JSON.parse(raw), sha256 };
}

function countOccurrences(haystack, needle) {
  return (
    String(haystack || "").match(
      new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")
    ) || []
  ).length;
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
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
  const appJsPath = path.join(repoRoot, "app.js");
  const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
  const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));
  function resolveRepoFileFromUrl(url) {
    const normalized = String(url || "").replace(/\\/g, "/");
    const marker = "domains/";
    const pos = normalized.indexOf(marker);
    if (pos === -1) return null;
    return path.join(repoRoot, normalized.slice(pos).replace(/\//g, path.sep));
  }
  sandbox.fetch = function fetchImpl(url) {
    const u = String(url || "");
    if (u.includes("domain-manifest.json")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(manifestJson) });
    }
    const disk = resolveRepoFileFromUrl(u);
    if (disk && fs.existsSync(disk)) {
      return Promise.resolve({ ok: true, text: () => Promise.resolve(fs.readFileSync(disk, "utf8")) });
    }
    return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve("") });
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(wgcPath, "utf8"), sandbox, {
    filename: "workflowGenerationContext.js"
  });
  sandbox.WorkflowGenerationContext = sandbox.window.WorkflowGenerationContext;
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, DEFAULT_LIBS);
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("hash-locked fixture: duplicate table material IDs are single-instance markers", () => {
  const { json } = loadFixture();

  const modelResult = renderer.buildPageModel(json, { strict: true });
  assert.ok(modelResult && modelResult.ok, JSON.stringify(modelResult && modelResult.errors));

  const composedResult = renderer.buildComposedPageModel(modelResult, json);
  assert.ok(composedResult && composedResult.ok, JSON.stringify(composedResult && composedResult.errors));
  assert.equal(composedResult.diagnostics.beatsFallbackActivityCount, 0);

  const byActivity = Object.create(null);
  (composedResult.composed.activities || []).forEach((activity) => {
    byActivity[activity.id] = activity;
  });

  const expectedByActivity = {
    A2: "A2-M3",
    A3: "A3-M2",
    A4: "A4-M3",
    A5: "A5-M2",
    A6: "A6-M2"
  };
  Object.keys(expectedByActivity).forEach((activityId) => {
    const activity = byActivity[activityId];
    assert.ok(activity, `Missing composed activity ${activityId}`);
    const doMoment = (activity.moments || []).find((moment) => moment.kind === "do");
    assert.ok(doMoment, `Missing do moment for ${activityId}`);
    const materialItem = (doMoment.items || []).find(
      (item) => item.kind === "material" && item.material && item.material.id === expectedByActivity[activityId]
    );
    assert.ok(materialItem, `Missing ${expectedByActivity[activityId]} in ${activityId} do moment`);
    assert.equal(materialItem.tableWorkspace, true, `${expectedByActivity[activityId]} should route to table workspace`);
  });
});

test("hash-locked Utilities pipeline: no duplicate DOM material identity", async () => {
  const { raw, json } = loadFixture();
  const api = loadPrismTestApi();
  const seed = JSON.parse(raw);
  const rendered = api.runUtilityPageExportPipelineForTest(seed, {
    sectionOrder: SECTION_ORDER,
    presentationMode: "single_page",
    rendererVersion: "vnext",
    applyCompositionValidation: true
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);

  const html = String(rendered.html || "");
  assert.ok(html.length > 0, "HTML output is empty.");
  assert.equal(countOccurrences(html, 'data-render-path="beats-fallback"'), 0);
  ["A1", "A2", "A3", "A4", "A5", "A6"].forEach((id) => {
    assert.match(html, new RegExp(`data-activity-id="${id}"`, "i"));
  });
  assert.doesNotMatch(html, /Material matches more than one beat rule:/i);

  DUPLICATE_IDS.forEach((id) => {
    assert.equal(
      countOccurrences(html, `data-material-id="${id}"`),
      1,
      `${id} must have exactly one material identity marker`
    );
    assert.equal(
      countOccurrences(html, `data-material-source-id="${id}"`),
      1,
      `${id} must keep exactly one table workspace source marker`
    );
    assert.match(
      html,
      new RegExp(
        `<section class="util-composition-moment[^"]*--do[\\s\\S]*?data-material-id="${id}"`,
        "i"
      ),
      `${id} should render in a do-moment section`
    );
  });

  // Learner behavior guardrails.
  assert.ok(
    countOccurrences(html, 'data-workspace-kind="table_entry"') >= DUPLICATE_IDS.length,
    "table_entry workspaces should still render"
  );
  assert.match(html, /## Overview|Overview/i);
  assert.match(html, /## Learning Purpose|Learning Purpose/i);
  assert.match(html, /## Knowledge Summary|Knowledge Summary/i);
  assert.match(html, /## Study Tips|Study Tips/i);
  void json;
});
