/**
 * Sprint 70 E4/E5 — Export UI integration + Open in New Tab regression guards.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fflate = require("fflate");

const lp = require("../lib/learner-package.js");
const zipApi = require("../lib/learner-package-zip.js");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const indexHtmlPath = path.join(repoRoot, "index.html");
const appJsPath = path.join(repoRoot, "app.js");

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const appJs = fs.readFileSync(appJsPath, "utf8");

const TINY_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);
const TINY_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(TINY_PNG_BYTES).toString("base64");

function createElementStub(id) {
  const hidden = new Set();
  const attrs = new Map();
  const listeners = new Map();
  const stub = {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    srcdoc: "",
    className: "",
    classList: {
      add: (...names) => names.forEach((n) => hidden.add(n)),
      remove: (...names) => names.forEach((n) => hidden.delete(n)),
      contains: (name) => hidden.has(name),
      toggle: (name, force) => {
        if (force === true) hidden.add(name);
        else if (force === false) hidden.delete(name);
        else if (hidden.has(name)) hidden.delete(name);
        else hidden.add(name);
        return hidden.has(name);
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: (k, v) => attrs.set(k, String(v)),
    getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null),
    removeAttribute: (k) => attrs.delete(k),
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener: () => {},
    focus: () => {},
    click: function () {
      if (stub.disabled) return;
      const fns = listeners.get("click") || [];
      fns.forEach((fn) => fn({ preventDefault: () => {}, currentTarget: stub, target: stub }));
    },
    querySelectorAll: () => [],
    dispatchEvent: () => true
  };
  stub._listeners = listeners;
  return stub;
}

function loadPrismTestApiForDownloadUi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const labelById = {
    utilitiesDownloadHtmlBtn: "HTML only (.html)",
    utilitiesDownloadPackageBtn: "Learner package (.zip)"
  };
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: (tag) => {
      const el = createElementStub("dynamic-" + tag);
      if (tag === "a") {
        el.click = function () {};
      }
      return el;
    },
    getElementById: (id) => {
      if (!elementStore.has(id)) {
        const el = createElementStub(id);
        if (labelById[id]) el.textContent = labelById[id];
        elementStore.set(id, el);
      }
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("query"),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    fflate: require("fflate"),
    Blob: function Blob() {},
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    navigator: { clipboard: { writeText: (text) => Promise.resolve(text) } },
    _: { debounce: (fn) => fn },
    document: documentStub,
    localStorage: { getItem: () => null, setItem: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    open: () => ({ document: { open: () => {}, write: () => {}, close: () => {} } }),
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: sandbox.localStorage,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    },
    navigator: sandbox.navigator
  };
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(
    "if (typeof PRISM_LEARNER_PACKAGE !== 'undefined') window.PRISM_LEARNER_PACKAGE = PRISM_LEARNER_PACKAGE;\n" +
      "if (typeof PRISM_LEARNER_PACKAGE_ZIP !== 'undefined') window.PRISM_LEARNER_PACKAGE_ZIP = PRISM_LEARNER_PACKAGE_ZIP;",
    sandbox
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  api.cacheElementsForTest();
  api.attachEventListenersForTest();
  return { api, elements: elementStore, sandbox };
}

test("E4: rendered Utilities markup exposes both visible download actions", () => {
  assert.match(indexHtml, /class="utilities-download-actions"/);
  assert.match(indexHtml, /id="utilitiesDownloadHtmlBtn"/);
  assert.match(indexHtml, /id="utilitiesDownloadPackageBtn"/);
  assert.match(indexHtml, /HTML only \(\.html\)/);
  assert.match(indexHtml, /Learner package \(\.zip\)/);
  assert.doesNotMatch(indexHtml, /id="utilitiesDownloadMenu"/);
  assert.doesNotMatch(indexHtml, /id="utilitiesDownloadBtn"/);
  assert.match(indexHtml, /lib\/learner-package\.js/);
  assert.match(indexHtml, /lib\/learner-package-zip\.js/);
  assert.match(indexHtml, /app\.js\?v=20260810-s75-d12-1/);
});

test("E4: both download buttons are always present in the live control state", () => {
  const { api } = loadPrismTestApiForDownloadUi();
  const state = api.getUtilitiesDownloadControlsStateForTest();
  assert.match(state.htmlLabel, /HTML only \(\.html\)/);
  assert.match(state.packageLabel, /Learner package \(\.zip\)/);
  api.setUtilitiesLastHtmlForTest("<html><body>ok</body></html>");
  api.setUtilitiesDownloadControlsDisabledForTest(false);
  const enabled = api.getUtilitiesDownloadControlsStateForTest();
  assert.equal(enabled.htmlDisabled, false);
  assert.equal(enabled.packageDisabled, false);
  api.setUtilitiesDownloadControlsDisabledForTest(true);
  const disabled = api.getUtilitiesDownloadControlsStateForTest();
  assert.equal(disabled.htmlDisabled, true);
  assert.equal(disabled.packageDisabled, true);
});

test("E4: HTML only button triggers HTML download path", () => {
  const { api } = loadPrismTestApiForDownloadUi();
  api.clearUtilitiesDownloadTestLogForTest();
  api.setUtilitiesLastHtmlForTest("<html><body>ok</body></html>");
  api.setUtilitiesDownloadControlsDisabledForTest(false);
  api.clickUtilitiesDownloadHtmlBtnForTest();
  const log = api.getUtilitiesDownloadTestLogForTest();
  assert.equal(log.length, 1);
  assert.equal(log[0], "html");
});

test("E4: Learner package button triggers ZIP download path", () => {
  const { api } = loadPrismTestApiForDownloadUi();
  api.clearUtilitiesDownloadTestLogForTest();
  api.setUtilitiesLastHtmlForTest(
    '<html><body><img src="' + TINY_PNG_DATA_URL + '"></body></html>'
  );
  api.setUtilitiesDownloadControlsDisabledForTest(false);
  api.clickUtilitiesDownloadPackageBtnForTest();
  const log = api.getUtilitiesDownloadTestLogForTest();
  assert.equal(log.length, 1);
  assert.equal(log[0], "zip");
});

test("E4: package path remains available with zero attached assets", () => {
  assert.match(appJs, /handleUtilitiesDownloadLearnerPackage/);
  assert.doesNotMatch(
    appJs,
    /handleUtilitiesDownloadLearnerPackage[\s\S]{0,500}assets\.length\s*===\s*0[\s\S]{0,80}return/
  );
});

test("E4: learner package build does not mutate canonical sources", () => {
  const manifest = {
    assets: [
      {
        brief_id: "b1",
        scope: "activity",
        activity_id: "a1",
        visual_slot: "materials-entry",
        mime_type: "image/png",
        render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
      }
    ]
  };
  const before = JSON.stringify(manifest);
  const html =
    '<html><body><img src="' + TINY_PNG_DATA_URL + '"></body></html>';
  const built = lp.buildLearnerPackage({
    html,
    visualAssetManifest: manifest,
    pageSlug: "roman-roads"
  });
  assert.equal(built.ok, true);
  assert.equal(JSON.stringify(manifest), before);
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const entries = fflate.unzipSync(zipped.bytes);
  assert.ok(entries["learner-page.html"]);
  assert.ok(entries["assets/activity-a1-materials-entry.png"]);
});

test("E4 regression: preview srcdoc preserves inline data/blob/remote image sources", () => {
  const { api } = loadPrismTestApiForDownloadUi();
  const data = TINY_PNG_DATA_URL;
  const blob = "blob:http://localhost/roman-roads-preview";
  const remote = "https://example.com/roman-roads.png";
  const html =
    '<html><body><figure class="util-visual-asset">' +
    '<img class="util-visual-asset-image" src="' +
    data +
    '" alt="data"></figure>' +
    '<figure class="util-visual-asset">' +
    '<img class="util-visual-asset-image" src="' +
    blob +
    '" alt="blob"></figure>' +
    '<figure class="util-visual-asset">' +
    '<img class="util-visual-asset-image" src="' +
    remote +
    '" alt="remote"></figure>' +
    "</body></html>";
  api.applyUtilityPreviewHtmlForTest(html, { manifestAssetCount: 1, previewRevision: 1, reason: "regression-guard" });
  const srcdoc = String(api.getUtilitiesPreviewSrcdocForTest() || "");
  assert.match(srcdoc, new RegExp('src="' + data.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"'));
  assert.match(srcdoc, /src="blob:http:\/\/localhost\/roman-roads-preview"/);
  assert.match(srcdoc, /src="https:\/\/example\.com\/roman-roads\.png"/);
  assert.doesNotMatch(srcdoc, /src="assets\//);
});

test("E5: Open in New Tab path remains session HTML (unchanged)", () => {
  assert.match(appJs, /function handleUtilitiesOpenInNewTab\(\)/);
  assert.match(
    appJs,
    /function handleUtilitiesOpenInNewTab\(\)[\s\S]*?utilityEnhanceExportHtmlWithMathJax\(htmlText\)/
  );
  assert.doesNotMatch(
    appJs,
    /function handleUtilitiesOpenInNewTab\(\)[\s\S]*?buildLearnerPackage/
  );
});
