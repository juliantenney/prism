"use strict";

/**
 * Build a synthetic vNext sequential-nav QA fixture for browser validation.
 * Includes a structural journey-activities container that also carries
 * data-journey-section, matching production markup.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("../../prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "../../..");
const appJsPath = path.join(repoRoot, "app.js");
const outDir = path.join(repoRoot, "tests", "fixtures", "sequential-nav-qa");
const outPath = path.join(outDir, "sequential-nav-qa.html");

const TITLE_60_A = "Interpreting Osmosis Data Tables With Careful Method Notes!!";
const TITLE_60_B = "Applying Ohms Law Across Mixed Series Parallel Circuit Case!";
const TITLE_60_C = "Evaluating Provenance Claims Using Competing Source Accounts";

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

function loadApi() {
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
  return sandbox.window.__PRISM_TEST_API;
}

function sectionBlock(id, title, index, total) {
  return (
    '<div id="' +
    id +
    '" data-journey-section="true" style="min-height:70vh;padding:2rem 0;border-bottom:1px solid #e5e7eb;">' +
    '<h2 class="util-activity-title" style="margin:0 0 1rem;">' +
    title +
    "</h2>" +
    "<p>Section " +
    (index + 1) +
    " of " +
    total +
    ". Scroll to exercise sequential navigation. Title length: " +
    title.length +
    ".</p>" +
    "<p>" +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(8) +
    "</p></div>"
  );
}

function main() {
  const api = loadApi();
  // Canonical destinations: Orient + 5 activities + Study tips = 7
  // (no assessment). Structural journey-activities also has data-journey-section.
  const items = [
    { id: "journey-orient", label: "Orient", title: "Orient" },
    { id: "activity-A1", label: TITLE_60_A, title: TITLE_60_A },
    { id: "activity-A2", label: "Evidence or Interpretation?", title: "Evidence or Interpretation?" },
    { id: "activity-A3", label: TITLE_60_B, title: TITLE_60_B },
    { id: "activity-A4", label: "Evaluating Provenance", title: "Evaluating Provenance" },
    { id: "activity-A5", label: TITLE_60_C, title: TITLE_60_C },
    { id: "journey-study-tips", label: "Study tips", title: "Study tips" }
  ];
  const navHtml = api.utilityRenderVnextSequentialJourneyNavHtmlForTest(items, {
    currentIndex: 0
  });
  const scriptHtml = api.utilityBuildVnextSequentialJourneyNavScriptForTest();
  const shell = api.composeStandaloneVnextLearnerExportForTest(
    '<div class="util-learner-page util-learner-renderer-vnext"></div>',
    {
      model: {
        activities: [
          { id: "A1", title: "One" },
          { id: "A2", title: "Two" }
        ]
      }
    }
  );
  const styleMatch = shell.match(/<style>([\s\S]*?)<\/style>/i);
  const css = styleMatch ? styleMatch[1] : "";

  const orient = sectionBlock(items[0].id, items[0].title, 0, items.length);
  const activities = items
    .slice(1, 6)
    .map((item, i) => sectionBlock(item.id, item.title, i + 1, items.length))
    .join("\n");
  const studyTips = sectionBlock(items[6].id, items[6].title, 6, items.length);

  const html = [
    "<!doctype html>",
    '<html lang="en"><head><meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    "<title>Sequential nav QA fixture</title>",
    "<style>" + css + "</style>",
    "</head>",
    '<body class="util-page-export util-page-export--vnext util-page-export--with-learning-header util-page-export--with-journey-nav">',
    '<header class="util-learning-header"><div class="util-learning-header__intro">',
    '<h1 class="util-learning-header__title">Sequential Navigation QA</h1>',
    '<p class="util-learning-header__subtitle">Canonical 7 destinations with structural activities container <span class="util-learning-header__duration">7 sections</span></p>',
    "</div></header>",
    navHtml,
    '<div class="util-learner-page util-learner-renderer-vnext">',
    orient,
    '<section id="journey-activities" class="util-learning-activities" data-region="activities" data-journey-section="true">',
    activities,
    "</section>",
    studyTips,
    "</div>",
    scriptHtml,
    "</body></html>"
  ].join("\n");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  console.log("Wrote " + outPath);
  console.log("Canonical destinations:", items.length);
  console.log("Title lengths:", TITLE_60_A.length, TITLE_60_B.length, TITLE_60_C.length);
}

main();
