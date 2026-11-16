"use strict";

/**
 * Regenerate an S81 R4 preview wrapped in the full vNext learner export shell
 * (sticky journey nav + --learner-sticky-nav-height), matching the operator path.
 * Output is written under ./out/ (gitignored).
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..", "..");
const fixturePath = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const outDir = path.join(__dirname, "out");
const outPath = path.join(outDir, "heteroscedasticity-revision-reminder-shell.html");

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
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const result = api.renderLearnerPageForTest(fixture, {
  rendererVersion: "vnext",
  applyCompositionValidation: false
});
if (!result || result.error) {
  throw new Error(result && result.error ? result.error : "export failed");
}
const html = String(result.html || "");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, html);
console.log("Wrote", outPath, "bytes=", html.length);
console.log(
  "sticky token:",
  html.includes("--learner-sticky-nav-height"),
  "reminder top var:",
  /top:var\(--learner-sticky-nav-height,0px\)/.test(html),
  "journey nav:",
  html.includes("util-journey-nav")
);
