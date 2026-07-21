"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  loadLearnerRendererVNextBrowserInSandbox
} = require(path.join(repoRoot, "tests", "prism-vm-lib-bootstrap.js"));

const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const outPath = path.join(__dirname, "heteroscedasticity-vnext-export-shell.html");

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
sandbox.document = documentStub;
sandbox.window = {
  document: documentStub,
  addEventListener() {},
  removeEventListener() {},
  location: { hash: "", pathname: "/" },
  _: sandbox._,
  Utils: { debounce: (fn) => fn },
  localStorage: { getItem: () => null, setItem() {} },
  URL: { createObjectURL: () => "blob:", revokeObjectURL() {} },
  Blob: function Blob() {},
  Library: {
    importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
    getAllPrompts: () => Promise.resolve([])
  }
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
  filename: "app.js"
});

const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const result = sandbox.window.__PRISM_TEST_API.renderLearnerPageForTest(fixture, {
  rendererVersion: "vnext",
  applyCompositionValidation: false
});
if (result.error) throw new Error(result.error);
const html = String(result.html || "");
fs.writeFileSync(outPath, html);

console.log(
  JSON.stringify(
    {
      outPath,
      bytes: html.length,
      doctype: /^<!doctype html>/i.test(html),
      vnextMarker: html.includes('data-renderer="vnext"'),
      vnextActivity: html.includes("util-vnext-activity"),
      journeyNav: html.includes("util-journey-nav"),
      stickyHeader: html.includes("util-learning-header__title"),
      cssInHead: /<head>[\s\S]*<style>[\s\S]*<\/style>/.test(html),
      navTargets: ["journey-orient", "journey-activities", "journey-assessment", "journey-study-tips"].map(
        (id) => html.includes(`id="${id}"`)
      )
    },
    null,
    2
  )
);
