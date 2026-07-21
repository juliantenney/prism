"use strict";

/**
 * Verify Utilities browser export path with rendererVersion: "vnext".
 * Run: node docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/artefacts/verify-browser-export-vnext.js
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  wireBrowserGlobalThis,
  loadLearnerRendererVNextBrowserInSandbox
} = require("../../../../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const outPath = path.join(__dirname, "heteroscedasticity-vnext-browser-export.html");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

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

function loadBrowserApp() {
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
    URL: { createObjectURL: () => "", revokeObjectURL() {} },
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
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "workflowGenerationContext.js"), "utf8"),
    sandbox,
    { filename: "workflowGenerationContext.js" }
  );
  windowStub.WorkflowGenerationContext = sandbox.WorkflowGenerationContext;
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return sandbox.window.__PRISM_TEST_API;
}

async function main() {
  const api = loadBrowserApp();
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  // Same pipeline entry as handleUtilitiesGenerate after catalog resolution:
  // renderUtilitiesArtefactHtmlAsync → runUtilityPageExportPipeline(..., { rendererVersion })
  const rendered = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  if (!rendered || rendered.error) {
    throw new Error((rendered && rendered.error) || "Render failed");
  }
  const html = String(rendered.html || "");
  fs.writeFileSync(
    outPath,
    "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>vNext browser export</title></head><body>" +
      html +
      "</body></html>",
    "utf8"
  );
  console.log(
    JSON.stringify(
      {
        path: outPath,
        hasVnextMarker: html.includes('data-renderer="vnext"'),
        hasLegacyJourneyNav: html.includes("util-journey-nav"),
        materialCount: (html.match(/data-material-id="/g) || []).length,
        activityOrder: [...html.matchAll(/data-activity-id="(A\d)"/g)].map((m) => m[1])
      },
      null,
      2
    )
  );
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
