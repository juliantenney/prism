/**
 * Sprint 75 — Retire Authoring "Learning object" presentation/output mode (S75-D12).
 *
 * Distinct from C-06 Create first-class outputs and Prompt Studio #outputType.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");
const pageFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-csv-worksheet-page.json"
);

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
      toggle() {}
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

function loadPrismTestApi(options) {
  const opts = options && typeof options === "object" ? options : {};
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };

  if (opts.withRender) {
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
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(manifestJson)
        });
      }
      const disk = resolveRepoFileFromUrl(u);
      if (disk && fs.existsSync(disk)) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(fs.readFileSync(disk, "utf8"))
        });
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
      },
      WorkflowGenerationContext: sandbox.WorkflowGenerationContext,
      fetch: sandbox.fetch
    };
    sandbox.document = documentStub;
    sandbox.window = windowStub;
    windowStub.window = windowStub;
    vm.createContext(sandbox);
    runPrismLibScriptsInSandbox(sandbox, repoRoot);
    injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
    vm.runInContext(source, sandbox, { filename: "app.js" });
  } else {
    const documentStub = { readyState: "loading", addEventListener: () => {} };
    sandbox.document = documentStub;
    sandbox.window = { document: documentStub };
    sandbox.window.window = sandbox.window;
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: "app.js" });
  }

  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source };
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const { source: appSource } = loadPrismTestApi();

test("A: Learning object is no longer an Authoring output/presentation option", () => {
  assert.doesNotMatch(indexHtml, /Learning object HTML/i);
  assert.doesNotMatch(indexHtml, /value="learning_object"/);
  assert.doesNotMatch(indexHtml, /id="utilitiesPresentationMode"/);
});

test("B: Redundant presentation-mode control is gone (was sole remaining mode after LO removal)", () => {
  assert.doesNotMatch(indexHtml, /Presentation mode/i);
  assert.doesNotMatch(indexHtml, /Single page HTML/);
  assert.match(indexHtml, /id="utilitiesOutputFormat"/);
  assert.match(indexHtml, /<option value="html" selected>HTML<\/option>/);
});

test("C: Learning-object-only state/handler/branch code is removed", () => {
  assert.doesNotMatch(appSource, /utilitiesPresentationMode/);
  assert.doesNotMatch(appSource, /buildUtilityLearningObjectHtml/);
  assert.doesNotMatch(appSource, /presentationMode\s*===\s*["']learning_object["']/);
  assert.doesNotMatch(appSource, /data-lo-screen/);
  assert.doesNotMatch(appSource, /lo-shell/);
});

test("D: Authoring assembly still works", () => {
  const { api } = loadPrismTestApi({ withRender: true });
  const { renderUtilityPageHtmlForTest } = require("./prism-vm-lib-bootstrap.js");
  assert.equal(typeof api.runUtilityPageExportPipelineForTest, "function");
  assert.equal(typeof api.resolvePageForRenderOrAssembly, "function");
  assert.match(appSource, /function handleUtilitiesAssembleFromCurrentWorkflowRun/);
  assert.match(indexHtml, /Assemble From Current Workflow Run/);
  const page = JSON.parse(fs.readFileSync(pageFixturePath, "utf8"));
  const rendered = renderUtilityPageHtmlForTest(api, page, {
    applyCompositionValidation: false,
    skipWorkflowAssembly: true
  });
  assert.ok(rendered && !rendered.error, rendered && rendered.error);
  assert.match(String(rendered.html || ""), /<!doctype html>/i);
  assert.doesNotMatch(String(rendered.html || ""), /data-lo-screen|lo-shell/i);
});

test("E: Preview HTML remains available", () => {
  assert.match(indexHtml, /id="utilitiesGenerateBtn"/);
  assert.match(indexHtml, />Preview HTML</);
  assert.match(appSource, /function handleUtilitiesGenerate/);
});

test("F: normal HTML rendering/export remains available", () => {
  assert.match(indexHtml, /id="utilitiesDownloadHtmlBtn"/);
  assert.match(appSource, /function triggerHtmlDownload/);
  assert.match(appSource, /function runUtilityPageExportPipeline/);
});

test("G: learner-package behaviour remains unchanged", () => {
  assert.match(indexHtml, /id="utilitiesDownloadPackageBtn"/);
  assert.match(indexHtml, /learner package/i);
  assert.match(appSource, /function handleUtilitiesDownloadLearnerPackage/);
  assert.match(appSource, /buildLearnerPackage/);
});

test("H: Open in New Tab remains available", () => {
  assert.match(indexHtml, /id="utilitiesOpenTabBtn"/);
  assert.match(indexHtml, /Open in New Tab/);
  assert.match(appSource, /function handleUtilitiesOpenInNewTab/);
});

test("I: C-01/C-02 Authoring context/provenance behaviour remains intact", () => {
  assert.match(indexHtml, /id="utilitiesWorkflowContext"/);
  assert.match(indexHtml, /id="utilitiesSelectedWorkflowLabel"/);
  assert.match(indexHtml, /id="utilitiesAssembledFromLabel"/);
  assert.match(indexHtml, /id="utilitiesWorkflowMismatchWarning"/);
  assert.match(appSource, /function refreshUtilitiesWorkflowContextUI/);
  assert.match(appSource, /function extractAssembledWorkflowProvenanceFromPage/);
});

test("J: Prompt Studio #outputType remains unchanged", () => {
  assert.match(indexHtml, /id="outputType"/);
  assert.match(indexHtml, /id="outputTypeGroup"/);
  const ps = indexHtml.match(/<select[^>]*id="outputType"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(ps);
  assert.match(ps[1], /value="text"/);
  assert.match(ps[1], /value="image"/);
  assert.match(ps[1], /value="code"/);
  assert.match(ps[1], /value="structured"/);
  assert.doesNotMatch(ps[1], /learning_object|self_study_resource|workshop/);
});

test("K: C-06 first-class Create output selector remains unchanged", () => {
  assert.match(indexHtml, /id="wfLdCreateOutputType"/);
  assert.match(indexHtml, /What are you creating\?/);
  assert.match(indexHtml, /value="self_study_resource"/);
  assert.match(indexHtml, /value="workshop"/);
  const createSelect = indexHtml.match(
    /<select[^>]*id="wfLdCreateOutputType"[^>]*>([\s\S]*?)<\/select>/
  );
  assert.ok(createSelect);
  assert.doesNotMatch(createSelect[1], /learning_object/);
});
