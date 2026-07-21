"use strict";

/**
 * Capture heteroscedasticity vNext export via production browser script order.
 * Run: node docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/artefacts/capture-m5-vnext-review.js
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
const outDir = __dirname;
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const appJsPath = path.join(repoRoot, "app.js");

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

function loadProductionApi() {
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function wrapDocument(title, bodyHtml) {
  return (
    "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n" +
    "<meta charset=\"utf-8\">\n" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
    "<title>" +
    title.replace(/&/g, "&amp;").replace(/</g, "&lt;") +
    "</title>\n" +
    "<style>\n" +
    "body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.5;color:#0f172a;margin:0;padding:16px;max-width:68ch;margin-inline:auto;}\n" +
    "h1,h2,h3{line-height:1.3;color:#0f172a;}\n" +
    ".util-table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;}\n" +
    "table{border-collapse:collapse;width:100%;}\n" +
    "th,td{border:1px solid #cbd5e1;padding:8px;text-align:left;vertical-align:top;}\n" +
    "th{background:#f8fafc;font-weight:600;}\n" +
    ".util-beat-section{margin:0 0 1.25rem;}\n" +
    ".util-expected-output{background:#f8fafc;border-left:3px solid #16a34a;padding:12px 14px;margin:12px 0;}\n" +
    ".util-checklist{list-style:none;padding:0;}\n" +
    ".util-checklist li{padding:6px 0;border-bottom:1px solid #e2e8f0;}\n" +
    "@media (max-width:720px){body{padding:12px;}}\n" +
    "</style>\n</head>\n<body>\n" +
    bodyHtml +
    "\n</body>\n</html>"
  );
}

function main() {
  const api = loadProductionApi();
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const vnext = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  const legacy = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "legacy",
    applyCompositionValidation: false
  });
  if (!vnext || vnext.error) {
    throw new Error("vNext render failed: " + (vnext && vnext.error));
  }
  if (!legacy || legacy.error) {
    throw new Error("Legacy render failed: " + (legacy && legacy.error));
  }

  const capture = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S67-BL-007",
    fixture: "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
    invocation: "renderLearnerPageForTest(fixture, { rendererVersion: 'vnext', applyCompositionValidation: false })",
    browser_path:
      "index.html script order: learner-renderer-vnext-browser.js → app.js → runUtilityPageExportPipeline",
    runtime: "Node vm sandbox mirroring production browser bundle registration (S67-EV-06 path)",
    node_version: process.version,
    vnext_markers: {
      util_learner_page: String(vnext.html).includes("util-learner-page"),
      data_renderer_vnext: String(vnext.html).includes('data-renderer="vnext"')
    },
    legacy_markers_absent_in_vnext: {
      util_journey_nav: !String(vnext.html).includes("util-journey-nav"),
      data_journey_section: !String(vnext.html).includes('data-journey-section="true"')
    }
  };

  fs.writeFileSync(path.join(outDir, "heteroscedasticity-vnext-review.capture.json"), JSON.stringify(capture, null, 2));
  fs.writeFileSync(path.join(outDir, "heteroscedasticity-vnext-review.html"), wrapDocument(fixture.title, vnext.html));
  fs.writeFileSync(path.join(outDir, "heteroscedasticity-legacy-review.html"), wrapDocument(fixture.title + " (legacy)", legacy.html));
  console.log("Wrote review artefacts to", outDir);
}

main();
