/**
 * PB-S-007 — minimal vm harness for utility page render smoke tests.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  loadPrismAppJsTestApi,
  injectLearnerRendererVNextInSandbox,
  installVnextPageShapeCompatForTests
} = require("./prism-vm-lib-bootstrap.js");

function loadUtilityPageRenderTestApi(options) {
  const opts = options && typeof options === "object" ? options : {};
  const repoRoot = opts.repoRoot || path.resolve(__dirname, "..");
  if (opts.preloadVmScript) {
    const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
    const sandbox = {
      console,
      setTimeout,
      clearTimeout,
      Promise,
      _: { debounce: (fn) => fn }
    };
    const elementStore = new Map();
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
    injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
    vm.runInContext(fs.readFileSync(opts.preloadVmScript, "utf8"), sandbox, {
      filename: path.basename(opts.preloadVmScript)
    });
    vm.runInContext(source, sandbox, { filename: "app.js" });
    const api = sandbox.window.__PRISM_TEST_API;
    installVnextPageShapeCompatForTests(api);
    return { api, sandbox, repoRoot };
  }
  const loaded = loadPrismAppJsTestApi(Object.assign({ repoRoot: repoRoot }, opts.loadOptions || {}));
  installVnextPageShapeCompatForTests(loaded.api);
  return { api: loaded.api, sandbox: loaded.sandbox, repoRoot: repoRoot };
}

function loadPageFixture(repoRoot, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function renderPageHtml(api, page, sectionOrder, renderOpts) {
  const r = sectionOrder
    ? api.buildUtilityStructuredHtmlForTest(page, sectionOrder, renderOpts)
    : api.buildUtilityStructuredHtmlForTest(page, renderOpts);
  if (!r || r.error) {
    throw new Error(r && r.error ? String(r.error) : "buildUtilityStructuredHtmlForTest failed");
  }
  return String(r.html || "");
}

module.exports = {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
};
