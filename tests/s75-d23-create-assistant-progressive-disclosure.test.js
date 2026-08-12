/**
 * Sprint 75 — S75-D23 Workflow Design Assistant progressive disclosure.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");

function createElementStub(tagName = "div") {
  const classSet = new Set();
  const attrs = Object.create(null);
  const children = [];
  return {
    tagName: String(tagName).toUpperCase(),
    value: "",
    disabled: false,
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
    appendChild(child) {
      children.push(child);
      return child;
    },
    setAttribute(name, value) {
      attrs[String(name)] = String(value);
      this[name] = value;
    },
    removeAttribute(name) {
      delete attrs[String(name)];
      delete this[name];
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name))
        ? attrs[String(name)]
        : null;
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, String(name));
    },
    focus() {},
    click() {
      this.__clicked = true;
    },
    scrollIntoView() {},
    closest() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    insertBefore(newNode) {
      children.push(newNode);
      return newNode;
    },
    querySelector() {
      return createElementStub("div");
    },
    querySelectorAll() {
      return [];
    }
  };
}

function loadPrism() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const elementStore = new Map();
  const ensure = (id) => {
    if (!elementStore.has(id)) {
      elementStore.set(id, createElementStub(id === "wfDesignAnswer" ? "textarea" : "div"));
    }
    return elementStore.get(id);
  };
  [
    "wfDesignStartBtn",
    "wfDesignApiKeyRequiredBtn",
    "wfDesignStatus",
    "wfDesignLog",
    "wfDesignAnswerGroup",
    "wfDesignAnswer",
    "wfDesignSendBtn",
    "apiKeyFile",
    "apiKeyStatus",
    "apiKeyControls",
    "apiKeyHelperText",
    "apiSettings",
    "prismStatusDetails",
    "prismStatusToggle",
    "prismStatusPanel",
    "prismStatusKeyChip",
    "prismStatusKeyText",
    "prismStatusCostChip",
    "prismStatusCostText",
    "prismStatusStorageChip",
    "prismStatusStorageText",
    "prismStatusStorageDetail"
  ].forEach((id) => ensure(id));

  // Initial resting markup semantics.
  ensure("wfDesignStartBtn").disabled = true;
  ensure("wfDesignStatus").setAttribute("hidden", "hidden");
  ensure("wfDesignStatus").classList.add("hidden");
  ensure("wfDesignLog").setAttribute("hidden", "hidden");
  ensure("wfDesignLog").classList.add("hidden");
  ensure("wfDesignAnswerGroup").setAttribute("hidden", "hidden");
  ensure("wfDesignAnswerGroup").classList.add("hidden");
  ensure("prismStatusDetails").open = false;
  ensure("prismStatusPanel").hidden = true;
  ensure("prismStatusToggle").setAttribute("aria-expanded", "false");
  ensure("prismStatusKeyText").textContent = "Not loaded";
  ensure("prismStatusCostText").textContent = "$0.00";
  ensure("prismStatusStorageText").textContent = "Storage health: estimate unavailable";

  const documentStub = {
    readyState: "loading",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
    getElementById: (id) => ensure(id),
    querySelector: (sel) => {
      if (sel === ".api-key-loader") return ensure("prismStatusDetails");
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
  return { api, source, ensure };
}

function isHidden(el) {
  return !!(el && (el.classList.contains("hidden") || el.hasAttribute("hidden")));
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

test("A: No API key — Design disabled; API key required visible; old prose absent", () => {
  const { api, ensure } = loadPrism();
  api.setOpenAiApiKeyForTest(null);
  assert.equal(ensure("wfDesignStartBtn").disabled, true);
  assert.equal(isHidden(ensure("wfDesignApiKeyRequiredBtn")), false);
  assert.doesNotMatch(
    indexHtml,
    /An OpenAI API key is needed to generate the workflow\. You can fill in the brief first/
  );
  assert.doesNotMatch(indexHtml, /id="wfDesignApiKeyHint"/);
  assert.match(indexHtml, /id="wfDesignApiKeyRequiredBtn"/);
  assert.match(indexHtml, /id="wfDesignStartBtn"[^>]*\bdisabled\b/);
});

test("B: API key present — Design enabled; API key required absent; no key-success chrome", () => {
  const { api, ensure, source } = loadPrism();
  api.setOpenAiApiKeyForTest("sk-test-key");
  assert.equal(ensure("wfDesignStartBtn").disabled, false);
  assert.equal(isHidden(ensure("wfDesignApiKeyRequiredBtn")), true);
  assert.doesNotMatch(
    source,
    /wfDesignApiKeyRequiredBtn[\s\S]{0,160}(API key loaded|Configured|✓)/
  );
  // No resting "Ready" reassurance for key presence.
  assert.notEqual(String(ensure("wfDesignStatus").textContent || ""), "Ready");
  assert.notEqual(String(ensure("wfDesignStatus").textContent || ""), "API key loaded");
});

test("C: Resting assistant hides Idle, answer UI, and empty log", () => {
  const { api, ensure } = loadPrism();
  api.setOpenAiApiKeyForTest("sk-test-key");
  api.setWorkflowDomainSuggestionPendingForTest(null);
  api.setWorkflowBriefElicitationForTest(null);
  api.setWorkflowDesignStatusBadgeForTest("", "");
  assert.equal(isHidden(ensure("wfDesignStatus")), true);
  assert.notEqual(String(ensure("wfDesignStatus").textContent || ""), "Idle");
  assert.equal(isHidden(ensure("wfDesignAnswerGroup")), true);
  assert.equal(isHidden(ensure("wfDesignLog")), true);
  assert.match(indexHtml, /id="wfDesignAnswerGroup"[^>]*\bhidden\b/);
});

test("D: API key required invokes revealOpenAiApiKeyEntry with direct file picker", () => {
  const { api, source, ensure } = loadPrism();
  api.setOpenAiApiKeyForTest(null);
  assert.match(source, /handleWorkflowDesignApiKeyRequiredClick[\s\S]{0,220}revealOpenAiApiKeyEntry\(\{\s*silent:\s*true/);
  assert.equal(ensure("prismStatusDetails").open, false);
  ensure("apiKeyFile").__clicked = false;
  assert.equal(api.handleWorkflowDesignApiKeyRequiredClickForTest(), false);
  assert.equal(ensure("apiKeyFile").__clicked, true);
  assert.equal(ensure("prismStatusDetails").open, false);
  assert.match(source, /triggerOpenAiApiKeyFilePicker/);
  assert.match(source, /els\.apiKeyFile\.focus/);
  assert.match(source, /openPrismStatusDisclosure/);
});

test("E: Assistant asking a question reveals answer controls", () => {
  const { api, ensure } = loadPrism();
  api.setOpenAiApiKeyForTest("sk-test");
  assert.equal(api.isWorkflowDesignAssistantAwaitingAnswer(), false);
  assert.equal(isHidden(ensure("wfDesignAnswerGroup")), true);
  api.setWorkflowDomainSuggestionPendingForTest({ name: "demo" });
  assert.equal(api.isWorkflowDesignAssistantAwaitingAnswer(), true);
  assert.equal(isHidden(ensure("wfDesignAnswerGroup")), false);
  api.setWorkflowDomainSuggestionPendingForTest(null);
  api.setWorkflowBriefElicitationForTest({
    queue: [{ id: "audience" }],
    index: 0,
    stage: "pre_generation"
  });
  assert.equal(api.isWorkflowDesignAssistantAwaitingAnswer(), true);
  assert.equal(isHidden(ensure("wfDesignAnswerGroup")), false);
});

test("F: Submitting an answer still uses handleWorkflowAnswer", () => {
  const { source } = loadPrism();
  assert.match(source, /function handleWorkflowAnswer\s*\(/);
  assert.match(source, /wfDesignSendBtn\.addEventListener\("click",\s*handleWorkflowAnswer\)/);
  assert.match(source, /appendWorkflowDesignLog\("user",\s*raw\)/);
});

test("G: Meaningful active statuses remain available", () => {
  const { api, ensure, source } = loadPrism();
  api.setOpenAiApiKeyForTest("sk-test");
  api.setWorkflowDesignStatusBadgeForTest("Designing…", "badge badge-success");
  assert.equal(ensure("wfDesignStatus").textContent, "Designing…");
  assert.equal(isHidden(ensure("wfDesignStatus")), false);
  api.setWorkflowDesignStatusBadgeForTest("Needs essentials", "badge badge-muted");
  assert.equal(ensure("wfDesignStatus").textContent, "Needs essentials");
  assert.match(source, /setWorkflowDesignStatusBadge\("Refining quality"/);
  assert.match(source, /setWorkflowDesignStatusBadge\("Confirm inferred"/);
});

test("H: Neighbouring Create contracts remain intact in markup/source", () => {
  const { source } = loadPrism();
  assert.match(source, /ensureCreateWorkflowApiKeyPrerequisite/);
  assert.match(source, /S75-D22|ONE WORKFLOW → ONE PRODUCT/);
  assert.match(indexHtml, /id="wfLdCreateOutputType"/);
  assert.match(indexHtml, /app\.js\?v=20260812-s75-ps-progressive/);
});
