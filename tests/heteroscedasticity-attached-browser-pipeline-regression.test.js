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
const {
  buildCanonicalFunctionEnumVariant
} = require("../lib/learner-renderer-vnext/archetype-canonical-binding.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-attached-source-of-truth.json"
);
const EXPECTED_FIXTURE_SHA256 =
  "0245f9ae3616d1a114e9bd557fa064f6db62dbb0d8cae2f44bfbb4afb8155348";
const CATALOG_PAGE_SECTION_ORDER = [
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
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "__PRISM_TEST_API unavailable");
  return { api, sandbox };
}

function loadFixtureRawAndJson() {
  const raw = fs.readFileSync(fixturePath, "utf8");
  const sha256 = crypto.createHash("sha256").update(raw, "utf8").digest("hex");
  return { raw, sha256, json: JSON.parse(raw) };
}

function materialRuleTrace(activity, materialId) {
  const beats = (((activity || {}).episode_plan || {}).beats || []).map((row) =>
    String((row && row.function) || "").trim().toLowerCase().replace(/[\s-]+/g, "_")
  );
  const variant = buildCanonicalFunctionEnumVariant(
    (((activity || {}).episode_plan || {}).archetype || ""),
    beats,
    { id: "trace-variant" }
  );
  const material = (activity.materials || []).find((row) => row.material_id === materialId);
  const type = String((material && (material.material_type || material.type)) || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  const ruleResults = variant.beats.map((rule) => ({
    beat: rule.sourceFunction,
    predicate: rule.materialTypes.indexOf(type) !== -1
  }));
  return {
    materialId: materialId,
    materialType: type,
    candidateBeats: ruleResults.filter((row) => row.predicate).map((row) => row.beat),
    ruleResults: ruleResults
  };
}

function countOccurrences(haystack, needle) {
  return (String(haystack || "").match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || [])
    .length;
}

test("attached heteroscedasticity fixture: browser preview pipeline keeps unique beat ownership", async () => {
  const { raw, sha256, json } = loadFixtureRawAndJson();
  assert.equal(sha256, EXPECTED_FIXTURE_SHA256, "Fixture hash mismatch; refusing non-source-of-truth payload.");
  assert.match(raw, /"material_id": "A4-M2"/);
  assert.match(raw, /"material_id": "A6-M3"/);
  assert.equal(Array.isArray(json.activities) ? json.activities.length : 0, 6);

  const activityA4 = json.activities.find((a) => a.activity_id === "A4");
  const activityA6 = json.activities.find((a) => a.activity_id === "A6");
  assert.ok(activityA4, "A4 missing");
  assert.ok(activityA6, "A6 missing");

  const traceA4 = materialRuleTrace(activityA4, "A4-M2");
  const traceA6 = materialRuleTrace(activityA6, "A6-M3");
  assert.equal(traceA4.candidateBeats.length, 1, JSON.stringify(traceA4, null, 2));
  assert.equal(traceA6.candidateBeats.length, 1, JSON.stringify(traceA6, null, 2));

  const { api } = loadPrismTestApi();
  const seed = JSON.parse(raw);
  const rendered = api.runUtilityPageExportPipelineForTest(seed, {
    sectionOrder: CATALOG_PAGE_SECTION_ORDER,
    rendererVersion: "vnext",
    applyCompositionValidation: true
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  const html = String(rendered.html || "");
  assert.ok(html.length > 0, "HTML output empty");
  assert.doesNotMatch(html, /Material matches more than one beat rule: A4-M2/i);
  assert.doesNotMatch(html, /Material matches more than one beat rule: A6-M3/i);

  assert.equal(countOccurrences(html, 'data-material-id="A4-M2"'), 1, "A4-M2 must render exactly once");
  assert.equal(countOccurrences(html, 'data-material-id="A6-M3"'), 1, "A6-M3 must render exactly once");
  ["A1", "A2", "A3", "A4", "A5", "A6"].forEach((id) => {
    assert.match(html, new RegExp(`data-activity-id="${id}"`, "i"));
  });
  assert.match(html, /Orient/i);
});
