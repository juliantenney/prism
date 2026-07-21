"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);
const outPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-07-17-sprint-67-learner-renderer-vnext",
  "artefacts",
  "heteroscedasticity-vnext-icons-export.html"
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

const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
const api = sandbox.window.__PRISM_TEST_API;
const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
const result = api.renderLearnerPageForTest(page, { applyCompositionValidation: false });
if (!result || result.error) {
  console.error(result && result.error);
  process.exit(1);
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, String(result.html || ""), "utf8");
console.log("Wrote " + path.relative(repoRoot, outPath));
