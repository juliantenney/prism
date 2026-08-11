/**
 * Sprint 75 — S75-D26 compact persistent PRISM status / API disclosure.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const styleCssPath = path.join(repoRoot, "style.css");

function createElementStub(tagName = "div") {
  const classSet = new Set();
  const attrs = Object.create(null);
  const children = [];
  const el = {
    tagName: String(tagName).toUpperCase(),
    value: "",
    disabled: false,
    open: false,
    hidden: false,
    innerHTML: "",
    textContent: "",
    className: "",
    children,
    classList: {
      add: (...names) => names.forEach((n) => classSet.add(String(n))),
      remove: (...names) => names.forEach((n) => classSet.delete(String(n))),
      contains: (name) => classSet.has(String(name)),
      toggle: (name, force) => {
        const key = String(name);
        if (force === true) {
          classSet.add(key);
          return true;
        }
        if (force === false) {
          classSet.delete(key);
          return false;
        }
        if (classSet.has(key)) {
          classSet.delete(key);
          return false;
        }
        classSet.add(key);
        return true;
      }
    },
    removeAttribute(name) {
      delete attrs[String(name)];
      if (String(name) === "hidden") {
        this.hidden = false;
        return;
      }
      delete this[name];
    },
    setAttribute(name, value) {
      attrs[String(name)] = String(value);
      if (String(name) === "hidden") {
        this.hidden = true;
        return;
      }
      this[name] = value;
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name))
        ? attrs[String(name)]
        : null;
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name));
    },
    focus() {
      el.__focused = true;
    },
    click() {
      el.__clicked = true;
    },
    scrollIntoView() {
      el.__scrolled = true;
    },
    closest(sel) {
      if (sel === ".api-key-loader") return el.__loader || null;
      return null;
    },
    addEventListener(type, fn) {
      if (!el.__listeners) el.__listeners = Object.create(null);
      if (!el.__listeners[type]) el.__listeners[type] = [];
      el.__listeners[type].push(fn);
    },
    removeEventListener() {},
    insertBefore(newNode, refNode) {
      const idx = refNode ? children.indexOf(refNode) : -1;
      if (idx >= 0) children.splice(idx, 0, newNode);
      else children.push(newNode);
      if (newNode) newNode.parentNode = el;
      return newNode;
    },
    appendChild(child) {
      children.push(child);
      if (child) child.parentNode = el;
      return child;
    },
    querySelector() {
      return createElementStub("div");
    },
    querySelectorAll() {
      return [];
    }
  };
  return el;
}

function loadPrism() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const ensure = (id) => {
    if (!elementStore.has(id)) {
      const tag =
        id === "apiKeyFile"
          ? "input"
          : id === "prismStatusToggle" || id === "prismStatusKeyLoadBtn"
            ? "button"
            : "div";
      elementStore.set(id, createElementStub(tag));
    }
    return elementStore.get(id);
  };
  [
    "prismStatusDetails",
    "prismStatusBar",
    "prismStatusToggle",
    "prismStatusPanel",
    "prismStatusKeyChip",
    "prismStatusKeyLoadBtn",
    "prismStatusKeyText",
    "prismStatusCostChip",
    "prismStatusCostText",
    "prismStatusStorageChip",
    "prismStatusStorageText",
    "prismStatusStorageDetail",
    "apiKeyFile",
    "apiKeyStatus",
    "apiKeyControls",
    "apiKeyHelperText",
    "apiSettings",
    "tokenUsage",
    "creativitySelect",
    "responseDetailSelect",
    "wfDesignStartBtn",
    "wfDesignApiKeyRequiredBtn"
  ].forEach((id) => ensure(id));

  const details = ensure("prismStatusDetails");
  details.open = false;
  details.classList.add("api-key-loader");
  details.classList.add("prism-status");
  ensure("apiKeyFile").__loader = details;
  ensure("apiKeyStatus").parentNode = ensure("apiKeyControls");
  ensure("prismStatusKeyLoadBtn").textContent = "Not loaded";
  ensure("prismStatusKeyLoadBtn").setAttribute("aria-label", "Load API key");
  ensure("prismStatusKeyText").textContent = "Loaded";
  ensure("prismStatusKeyText").hidden = true;
  ensure("prismStatusKeyText").setAttribute("hidden", "hidden");
  ensure("prismStatusCostText").textContent = "$0.00";
  ensure("prismStatusStorageText").textContent = "Storage health: estimate unavailable";
  ensure("prismStatusPanel").hidden = true;
  ensure("prismStatusPanel").setAttribute("hidden", "hidden");
  ensure("prismStatusToggle").setAttribute("aria-expanded", "false");
  ensure("prismStatusToggle").setAttribute(
    "aria-label",
    "Show API and storage details"
  );
  ensure("prismStatusToggle").setAttribute("aria-controls", "prismStatusPanel");

  const storageBlocks = [1, 2, 3, 4].map((n) => {
    const block = createElementStub("span");
    block.setAttribute("data-storage-block", String(n));
    return block;
  });
  ensure("prismStatusStorageChip").querySelectorAll = (sel) => {
    if (String(sel).includes("data-storage-block")) return storageBlocks;
    return [];
  };
  ensure("prismStatusStorageChip").__blocks = storageBlocks;

  const documentStub = {
    readyState: "loading",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
    getElementById: (id) => ensure(id),
    querySelector: (sel) => {
      if (sel === ".api-key-loader") return details;
      if (sel === ".api-key-controls") return ensure("apiKeyControls");
      return null;
    },
    querySelectorAll: () => []
  };
  const windowStub = { document: documentStub };
  documentStub.defaultView = windowStub;
  windowStub.window = windowStub;
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    document: documentStub,
    window: windowStub
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  api.refreshWorkflowFactoryDesignAssistantElsForTest();
  return { api, source, ensure, details, storageBlocks };
}

function litCount(blocks) {
  return blocks.filter((b) => b.classList.contains("is-lit")).length;
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const styleCss = fs.readFileSync(styleCssPath, "utf8");

test("A: Markup uses button disclosure with preserved API hooks", () => {
  assert.match(
    indexHtml,
    /<div class="api-key-loader prism-status" id="prismStatusDetails">/
  );
  assert.match(indexHtml, /id="prismStatusToggle"/);
  assert.match(indexHtml, /aria-controls="prismStatusPanel"/);
  assert.match(indexHtml, /API key:/);
  assert.match(indexHtml, /Session cost:/);
  assert.match(indexHtml, /Storage health:/);
  assert.match(indexHtml, /id="prismStatusKeyLoadBtn"/);
  assert.match(indexHtml, /aria-label="Load API key"/);
  assert.match(indexHtml, /id="prismStatusKeyText"/);
  assert.match(indexHtml, /id="prismStatusCostText"/);
  assert.match(indexHtml, /data-storage-block="4"/);
  assert.match(indexHtml, /id="apiKeyFile"/);
  assert.match(indexHtml, /class="api-key-controls"/);
  assert.match(indexHtml, /id="creativitySelect"/);
  assert.match(indexHtml, /id="responseDetailSelect"/);
  assert.match(indexHtml, /id="tokenUsage"/);
  assert.match(indexHtml, /id="prismStatusApiScopeHelper"/);
  assert.match(
    indexHtml,
    /Creativity and Response Detail apply to PRISM API calls[\s\S]*do not control My Workflows Run/
  );
  assert.match(indexHtml, /app\.js\?v=20260811-s75-rename/);
  assert.match(styleCss, /\.api-key-loader\.prism-status/);
  assert.doesNotMatch(indexHtml, /<details[\s\S]*id="prismStatusDetails"/);
  assert.doesNotMatch(indexHtml, /id="prismStatusSummary"/);
  assert.doesNotMatch(indexHtml, />Key</);
  assert.doesNotMatch(indexHtml, /Storage OK/);
});

test("B: Collapsed key chip reflects Loaded / Not loaded without colour alone", () => {
  const { api, ensure } = loadPrism();
  api.setOpenAiApiKeyForTest(null);
  assert.equal(ensure("prismStatusKeyLoadBtn").hidden, false);
  assert.equal(ensure("prismStatusKeyLoadBtn").textContent, "Not loaded");
  assert.equal(ensure("prismStatusKeyLoadBtn").getAttribute("aria-label"), "Load API key");
  assert.equal(ensure("prismStatusKeyText").hidden, true);
  assert.equal(ensure("prismStatusKeyChip").classList.contains("is-missing"), true);
  assert.equal(ensure("prismStatusKeyChip").classList.contains("is-loaded"), false);
  api.setOpenAiApiKeyForTest("sk-test");
  assert.equal(ensure("prismStatusKeyLoadBtn").hidden, true);
  assert.equal(ensure("prismStatusKeyText").hidden, false);
  assert.equal(ensure("prismStatusKeyText").textContent, "Loaded");
  assert.equal(ensure("prismStatusKeyChip").classList.contains("is-loaded"), true);
  assert.equal(ensure("prismStatusKeyChip").classList.contains("is-missing"), false);
});

test("C: Not-loaded load action invokes #apiKeyFile without expanding disclosure", () => {
  assert.match(
    indexHtml,
    /id="prismStatusKeyLoadBtn"[\s\S]*aria-label="Load API key"/
  );
  assert.match(
    indexHtml,
    /<button[\s\S]*id="prismStatusToggle"[\s\S]*aria-expanded="false"/
  );
  const { api, ensure, source } = loadPrism();
  api.setOpenAiApiKeyForTest(null);
  assert.equal(api.isPrismStatusExpandedForTest(), false);
  ensure("apiKeyFile").__clicked = false;
  assert.equal(
    api.triggerOpenAiApiKeyFilePickerForTest({ expandOnFailure: false }),
    true
  );
  assert.equal(ensure("apiKeyFile").__clicked, true);
  assert.equal(api.isPrismStatusExpandedForTest(), false);
  assert.match(source, /bindPrismStatusKeyLoadControl/);
  assert.match(source, /triggerOpenAiApiKeyFilePicker/);
  api.togglePrismStatusDisclosureForTest();
  assert.equal(api.isPrismStatusExpandedForTest(), true);
  api.togglePrismStatusDisclosureForTest();
  assert.equal(api.isPrismStatusExpandedForTest(), false);
});

test("D: revealOpenAiApiKeyEntry prefers direct #apiKeyFile activation", () => {
  const { api, ensure, details } = loadPrism();
  api.setOpenAiApiKeyForTest(null);
  assert.equal(details.open, false);
  ensure("apiKeyFile").__clicked = false;
  assert.equal(api.revealOpenAiApiKeyEntryForTest({ silent: true }), false);
  assert.equal(ensure("apiKeyFile").__clicked, true);
  assert.equal(details.open, false);
  assert.equal(api.isPrismStatusExpandedForTest(), false);
  assert.equal(ensure("apiKeyControls").classList.contains("hidden"), false);
});

test("D2: Loaded status is informational; disclosure toggle still works", () => {
  const { api, ensure } = loadPrism();
  api.setOpenAiApiKeyForTest("sk-test");
  assert.equal(ensure("prismStatusKeyLoadBtn").hidden, true);
  assert.equal(ensure("prismStatusKeyText").textContent, "Loaded");
  assert.equal(api.isPrismStatusExpandedForTest(), false);
  api.togglePrismStatusDisclosureForTest();
  assert.equal(api.isPrismStatusExpandedForTest(), true);
  assert.equal(ensure("prismStatusToggle").getAttribute("aria-expanded"), "true");
});

test("E: Expanded controls remain the existing API settings surface", () => {
  assert.match(indexHtml, /id="apiKeyFile"/);
  assert.match(indexHtml, /id="apiKeyStatus"/);
  assert.match(indexHtml, /id="apiKeyHelperText"/);
  assert.match(indexHtml, /id="creativitySelect"/);
  assert.match(indexHtml, /id="responseDetailSelect"/);
  assert.match(indexHtml, /id="tokenUsage"/);
  assert.match(indexHtml, /id="apiSettings"/);
  assert.match(indexHtml, /id="prismStatusStorageDetail"/);
});

test("F: Cost chip derives from state.tokenUsage.sessionCost and labels page-load scope", () => {
  const { api, ensure } = loadPrism();
  api.setTokenUsageSessionCostForTest(0);
  assert.equal(ensure("prismStatusCostText").textContent, "$0.00");
  api.setTokenUsageSessionCostForTest(0.024);
  assert.equal(ensure("prismStatusCostText").textContent, "$0.024");
  const title = ensure("prismStatusCostChip").getAttribute("title") || "";
  assert.match(title, /page load/i);
  assert.match(title, /Not persisted/i);
  assert.match(title, /Does not include external Copilot/i);
  assert.equal(api.getTokenUsageForTest().sessionCost, 0.024);
});

test("G: Storage blocks map to <75%, 75–95%, >95%; never four lit", () => {
  const { api, ensure, storageBlocks, source } = loadPrism();

  const healthy = api.classifyBrowserStorageHealthForTest({
    usageRatio: 0.74,
    remaining: 100,
    usage: 74,
    quota: 100
  });
  assert.equal(healthy.litBlocks, 1);
  assert.equal(healthy.label, "Storage health: healthy");

  const gettingFullLow = api.classifyBrowserStorageHealthForTest({
    usageRatio: 0.75,
    remaining: 25,
    usage: 75,
    quota: 100
  });
  assert.equal(gettingFullLow.litBlocks, 2);
  assert.equal(gettingFullLow.label, "Storage health: getting full");

  const gettingFullHigh = api.classifyBrowserStorageHealthForTest({
    usageRatio: 0.95,
    remaining: 5,
    usage: 95,
    quota: 100
  });
  assert.equal(gettingFullHigh.litBlocks, 2);

  const critical = api.classifyBrowserStorageHealthForTest({
    usageRatio: 0.951,
    remaining: 4,
    usage: 95.1,
    quota: 100
  });
  assert.equal(critical.litBlocks, 3);
  assert.equal(critical.label, "Storage health: critically constrained");

  api.renderPrismStatusStorageChipForTest({
    usageRatio: 0.5,
    remaining: 50,
    usage: 50 * 1024 * 1024,
    quota: 100 * 1024 * 1024
  });
  assert.equal(litCount(storageBlocks), 1);
  assert.equal(ensure("prismStatusStorageText").textContent, "Storage health: healthy");
  assert.equal(
    ensure("prismStatusStorageChip").getAttribute("aria-label"),
    "Storage health: healthy"
  );

  api.renderPrismStatusStorageChipForTest({
    usageRatio: 0.8,
    remaining: 20,
    usage: 80 * 1024 * 1024,
    quota: 100 * 1024 * 1024
  });
  assert.equal(litCount(storageBlocks), 2);

  api.renderPrismStatusStorageChipForTest({
    usageRatio: 0.99,
    remaining: 1,
    usage: 99 * 1024 * 1024,
    quota: 100 * 1024 * 1024
  });
  assert.equal(litCount(storageBlocks), 3);
  assert.equal(storageBlocks[3].classList.contains("is-lit"), false);

  assert.ok(healthy.litBlocks !== 4 && critical.litBlocks !== 4);
  assert.match(source, /Math\.min\(3,/);
  assert.match(source, /usageRatio > 0\.95/);
  assert.match(source, /usageRatio >= 0\.75/);
  // Write-protection thresholds remain separate.
  assert.match(source, /usageRatio >= 0\.85 \|\| estimate\.remaining <= 20 \* 1024 \* 1024/);
  assert.doesNotMatch(indexHtml, /Storage OK/);
});

test("H: Accessibility — toggle disclosure and text storage state", () => {
  assert.match(indexHtml, /id="prismStatusToggle"[\s\S]*aria-expanded="false"/);
  assert.match(indexHtml, /aria-controls="prismStatusPanel"/);
  assert.match(indexHtml, /role="img"/);
  assert.match(indexHtml, /id="prismStatusStorageText"/);
  assert.match(indexHtml, /Session cost:/);
  assert.match(indexHtml, /aria-label="Storage health: estimate unavailable"/);
  const { api, ensure } = loadPrism();
  api.setPrismStatusExpandedForTest(true);
  assert.equal(ensure("prismStatusToggle").getAttribute("aria-expanded"), "true");
  assert.match(
    ensure("prismStatusToggle").getAttribute("aria-label") || "",
    /Hide API and storage details/
  );
});

test("I: Create D23/C-05 hooks remain wired; key load enables Design", () => {
  const { api, source, ensure } = loadPrism();
  assert.equal(typeof api.revealOpenAiApiKeyEntryForTest, "function");
  assert.equal(typeof api.openPrismStatusDisclosureForTest, "function");
  assert.equal(typeof api.triggerOpenAiApiKeyFilePickerForTest, "function");
  assert.match(source, /openPrismStatusDisclosure\(\)/);
  assert.match(indexHtml, /id="wfDesignApiKeyRequiredBtn"/);
  assert.match(source, /els\.wfDesignStartBtn\.disabled\s*=\s*!hasKey/);
  api.setOpenAiApiKeyForTest(null);
  assert.equal(ensure("wfDesignStartBtn").disabled, true);
  api.setOpenAiApiKeyForTest("sk-after-load");
  assert.equal(ensure("wfDesignStartBtn").disabled, false);
});
