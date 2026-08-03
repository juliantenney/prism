"use strict";

/**
 * Standalone vNext export must embed draft-persistence API and boot it in order.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");
const embed = require("../lib/learner-renderer-vnext-standalone-embed.js");
const {
  renderLearnerPageHtml,
  learnerDraftConstants
} = require("../lib/learner-renderer-vnext");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const heteroFixture = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

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

function loadPrismTestApi() {
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
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, sandbox };
}

function composeStandaloneExport(page) {
  const { api } = loadPrismTestApi();
  const result = api.renderLearnerPageForTest(page, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(String(key), String(value));
    },
    removeItem: (key) => {
      map.delete(String(key));
    },
    _map: map
  };
}

function unavailableStorage() {
  return null;
}

function createElement(tagName) {
  const node = {
    tagName: String(tagName || "").toUpperCase(),
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    textContent: "",
    value: "",
    checked: false,
    hidden: false,
    disabled: false,
    ownerDocument: null,
    classList: {
      _classes: Object.create(null),
      contains(name) {
        return Boolean(this._classes[name]);
      },
      add(name) {
        this._classes[name] = true;
        node.className = Object.keys(this._classes).join(" ");
      }
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name)
        ? this.attributes[name]
        : null;
    },
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === "class") {
        this.className = String(value);
        this.classList._classes = Object.create(null);
        String(value)
          .split(/\s+/)
          .filter(Boolean)
          .forEach((cls) => {
            this.classList._classes[cls] = true;
          });
      }
      if (name === "checked") this.checked = true;
    },
    removeAttribute(name) {
      delete this.attributes[name];
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(this.attributes, name);
    },
    appendChild(child) {
      if (child.parentNode) {
        const siblings = child.parentNode.children;
        const index = siblings.indexOf(child);
        if (index >= 0) siblings.splice(index, 1);
      }
      child.parentNode = this;
      this.children.push(child);
      return child;
    },
    insertBefore(newNode, referenceNode) {
      if (newNode.parentNode) {
        const from = newNode.parentNode.children;
        const idx = from.indexOf(newNode);
        if (idx >= 0) from.splice(idx, 1);
      }
      newNode.parentNode = this;
      const index = this.children.indexOf(referenceNode);
      if (index < 0) this.children.push(newNode);
      else this.children.splice(index, 0, newNode);
      return newNode;
    },
    contains(other) {
      if (other === this) return true;
      return this.children.some((child) => child === other || child.contains(other));
    },
    matches(selector) {
      return matchesSelector(this, selector);
    },
    closest(selector) {
      let current = this;
      while (current) {
        if (matchesSelector(current, selector)) return current;
        current = current.parentNode;
      }
      return null;
    },
    querySelector(selector) {
      return queryAll(this, selector)[0] || null;
    },
    querySelectorAll(selector) {
      return queryAll(this, selector);
    },
    addEventListener(type, handler) {
      if (!this._listeners) this._listeners = [];
      this._listeners.push({ type, handler });
    },
    dispatchEvent(event) {
      let current = this;
      while (current) {
        (current._listeners || [])
          .filter((entry) => entry.type === event.type)
          .forEach((entry) => entry.handler(event));
        if (!event.bubbles) break;
        current = current.parentNode;
      }
      return true;
    }
  };
  return node;
}

function matchesSelector(node, selector) {
  let rest = String(selector || "").trim();
  if (!rest) return false;
  if (rest[0] === "#") {
    return node.getAttribute("id") === rest.slice(1);
  }
  const tagMatch = rest.match(/^([a-zA-Z0-9:-]+)/);
  if (tagMatch && !rest.startsWith(".") && !rest.startsWith("[")) {
    if (node.tagName !== tagMatch[1].toUpperCase()) return false;
    rest = rest.slice(tagMatch[1].length);
  }
  while (rest.length) {
    if (rest[0] === ".") {
      const cls = rest.slice(1).match(/^[a-zA-Z0-9_-]+/);
      if (!cls || !node.classList.contains(cls[0])) return false;
      rest = rest.slice(1 + cls[0].length);
      continue;
    }
    if (rest[0] === "[") {
      const attr = rest.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]/);
      if (!attr) return false;
      const value = node.getAttribute(attr[1]);
      if (attr[2] == null) {
        if (value == null) return false;
      } else if (value !== attr[2]) {
        return false;
      }
      rest = rest.slice(attr[0].length);
      continue;
    }
    return false;
  }
  return true;
}

function queryAll(root, selector) {
  const parts = String(selector)
    .split(/\s+/)
    .filter(Boolean);
  let current = [root];
  parts.forEach((part) => {
    const next = [];
    current.forEach((node) => {
      walk(node, (child) => {
        if (child !== node && matchesSelector(child, part)) next.push(child);
      });
    });
    current = next;
  });
  return current;
}

function walk(node, visit) {
  visit(node);
  (node.children || []).forEach((child) => walk(child, visit));
}

function parseAttrs(text) {
  const attrs = Object.create(null);
  const re = /([a-zA-Z0-9:_-]+)(?:=(?:"([^"]*)"|'([^']*)'))?/g;
  let match;
  while ((match = re.exec(text || ""))) {
    attrs[match[1]] = match[2] != null ? match[2] : match[3] != null ? match[3] : "";
  }
  return attrs;
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseHtmlFragment(html, documentRef) {
  const root = createElement("div");
  root.ownerDocument = documentRef;
  const stack = [root];
  const tokenRe =
    /<!--[\s\S]*?-->|<script\b[^>]*>([\s\S]*?)<\/script>|<(\/?)([a-zA-Z0-9:-]+)([^>]*)>|([^<]+)/g;
  let match;
  while ((match = tokenRe.exec(html))) {
    if (match[1] != null && match[2] == null && match[3] == null) {
      const script = createElement("script");
      script.ownerDocument = documentRef;
      script.textContent = match[1];
      const openTag = match[0].match(/^<script\b([^>]*)>/i);
      if (openTag) {
        const attrs = parseAttrs(openTag[1] || "");
        Object.keys(attrs).forEach((key) => script.setAttribute(key, decodeEntities(attrs[key])));
      }
      stack[stack.length - 1].appendChild(script);
      continue;
    }
    if (match[5] != null) {
      stack[stack.length - 1].textContent += match[5];
      continue;
    }
    const closing = Boolean(match[2]);
    const tag = String(match[3] || "").toLowerCase();
    const attrText = match[4] || "";
    if (closing) {
      if (stack.length > 1) stack.pop();
      continue;
    }
    const node = createElement(tag);
    node.ownerDocument = documentRef;
    const attrs = parseAttrs(attrText);
    Object.keys(attrs).forEach((key) => {
      if (key === "disabled") node.disabled = true;
      if (key === "hidden") node.hidden = true;
      node.setAttribute(key, decodeEntities(attrs[key]));
    });
    stack[stack.length - 1].appendChild(node);
    const voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1 };
    if (!voidTags[tag] && !/\/\s*$/.test(attrText)) stack.push(node);
  }
  return root;
}

function mountMainFromStandalone(html) {
  const documentNode = createElement("document");
  documentNode.createElement = function (tag) {
    const node = createElement(tag);
    node.ownerDocument = documentNode;
    return node;
  };
  documentNode.body = createElement("body");
  documentNode.body.ownerDocument = documentNode;
  const parsed = parseHtmlFragment(html, documentNode);
  const main =
    parsed.querySelector("main.util-learner-renderer-vnext") ||
    queryAll(parsed, "main.util-learner-renderer-vnext")[0];
  assert.ok(main, "standalone export must include vNext main");
  main.ownerDocument = documentNode;
  documentNode.body.appendChild(main);
  documentNode.querySelector = function (selector) {
    return documentNode.body.querySelector(selector);
  };
  documentNode.querySelectorAll = function (selector) {
    return documentNode.body.querySelectorAll(selector);
  };
  documentNode.addEventListener = function () {};
  documentNode.readyState = "complete";
  return { document: documentNode, root: main };
}

function loadExportRuntimeApi() {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout
  };
  const windowStub = {};
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(embed.getExportRuntimeSource(), sandbox, {
    filename: "learner-renderer-vnext-export-runtime.js"
  });
  assert.ok(sandbox.window.PRISM_LEARNER_RENDERER_VNEXT);
  assert.equal(
    typeof sandbox.window.PRISM_LEARNER_RENDERER_VNEXT.initializeLearnerDraftPersistence,
    "function"
  );
  return sandbox.window.PRISM_LEARNER_RENDERER_VNEXT;
}

function initFromStandalone(html, options) {
  const runtimeApi = loadExportRuntimeApi();
  const mounted = mountMainFromStandalone(html);
  const hasStorageOption = options && Object.prototype.hasOwnProperty.call(options, "storage");
  const storage = hasStorageOption ? options.storage : memoryStorage();
  const confirmCalls = [];
  const api = runtimeApi.initializeLearnerDraftPersistence(mounted.root, {
    storage: storage,
    debounceMs: options && options.debounceMs != null ? options.debounceMs : 0,
    confirm: function (message) {
      confirmCalls.push(message);
      return options && Object.prototype.hasOwnProperty.call(options, "confirmResult")
        ? options.confirmResult
        : true;
    }
  });
  return {
    root: mounted.root,
    document: mounted.document,
    storage: storage,
    api: api,
    confirmCalls: confirmCalls,
    runtimeApi: runtimeApi
  };
}

function emitInput(root, selector, value) {
  const input = root.querySelector(selector);
  assert.ok(input, selector);
  input.value = value;
  const event = { type: "input", bubbles: true, target: input };
  (root._listeners || [])
    .filter((entry) => entry.type === "input")
    .forEach((entry) => entry.handler(event));
}

function emitCheckboxChange(root, selector, checked) {
  const input = root.querySelector(selector);
  assert.ok(input, selector);
  input.checked = Boolean(checked);
  const event = { type: "change", bubbles: true, target: input };
  (root._listeners || [])
    .filter((entry) => entry.type === "change")
    .forEach((entry) => entry.handler(event));
}

function renderGuidedChecklistFragment() {
  const material = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M3",
      material_type: "checklist",
      title: "Response quality review",
      body_format: "json",
      body: {
        review_mode: "guided_criteria",
        criteria: [
          {
            statement: "Have you described how each genome type produces mRNA?",
            why_it_matters: "Core discrimination.",
            features: [
              {
                expected: "Each genome type is linked to an mRNA production route",
                repair: "Add one sentence per genome type."
              }
            ],
            confirmation_label: "My response now meets this criterion"
          },
          {
            statement: "Have you avoided treating all RNA genomes as interchangeable?",
            features: [
              {
                expected: "At least one explicit contrast",
                repair: "Add a contrast sentence."
              }
            ]
          }
        ]
      }
    },
    0
  );
  const checkMoment = {
    kind: "check",
    items: [{ kind: "material", material: material }],
    workspaces: []
  };
  return renderPage(
    {
      title: "Guided review persistence page",
      header: { description: "", durationMinutes: null },
      orientationSections: [],
      activities: [
        {
          id: "A1",
          title: "Genome mapping",
          durationMinutes: null,
          grouping: "",
          mappedOutcomes: [],
          preamble: "",
          reasoningOrientation: "",
          beats: [],
          compositionMoments: null
        }
      ],
      assessment: { items: [] },
      studyTips: ""
    },
    {
      compositionMode: "moments",
      activityComposition: {
        A1: {
          orientMoment: null,
          learnMoment: null,
          doMoment: null,
          checkMoment: checkMoment,
          renderPath: "moments",
          omitBeatFunctions: [],
          suppressBeatContent: {},
          suppressFraming: true
        }
      },
      persistenceIdentity: {
        pageKey: "guided-review-persistence-fixture",
        storageKey: "learner-renderer-vnext:draft:guided-review-persistence-fixture"
      }
    }
  );
}

test("standalone export embeds persistence API implementation exactly once", () => {
  const html = composeStandaloneExport(loadJson(heteroFixture));
  assert.match(html, /data-prism-vnext-export-runtime="true"/);
  assert.match(html, /function initializeLearnerDraftPersistence\s*\(/);
  assert.match(html, /api\.initializeLearnerDraftPersistence\(root\)/);
  assert.equal(
    (html.match(/data-prism-vnext-export-runtime="true"/g) || []).length,
    1
  );
  assert.doesNotMatch(html, /<script[^>]+src=["'][^"']+["']/i);
});

test("standalone export defines API before draft boot call", () => {
  const html = composeStandaloneExport(loadJson(heteroFixture));
  const apiIdx = html.indexOf("function initializeLearnerDraftPersistence");
  const bootIdx = html.indexOf("api.initializeLearnerDraftPersistence(root)");
  assert.ok(apiIdx >= 0, "API implementation missing");
  assert.ok(bootIdx >= 0, "boot call missing");
  assert.ok(apiIdx < bootIdx, "API must precede boot call");
  const markerIdx = html.indexOf('data-prism-vnext-export-runtime="true"');
  assert.ok(markerIdx >= 0 && markerIdx < bootIdx);
});

test("standalone export-runtime source boots and restores text drafts", () => {
  const html = composeStandaloneExport(loadJson(heteroFixture));
  const session = initFromStandalone(html, { debounceMs: 0 });
  const textarea = session.root.querySelector("textarea.util-learner-workspace__input");
  assert.ok(textarea, "expected text workspace");
  emitInput(session.root, "#" + textarea.getAttribute("id"), "portable draft text");
  session.api.flushPendingSave();
  assert.equal(session.api.getStatus(), learnerDraftConstants.STATUS.SAVED);

  const reloaded = initFromStandalone(html, { storage: session.storage, debounceMs: 0 });
  const restored = reloaded.root.querySelector("#" + textarea.getAttribute("id"));
  assert.equal(restored.value, "portable draft text");
  assert.equal(reloaded.api.getStatus(), learnerDraftConstants.STATUS.RESTORED);
});

test("standalone export-runtime restores table-entry drafts", () => {
  const html = composeStandaloneExport(loadJson(heteroFixture));
  const session = initFromStandalone(html, { debounceMs: 0 });
  const tableInput = session.root.querySelector(".util-learner-table-workspace__input");
  assert.ok(tableInput, "expected table workspace");
  emitInput(session.root, "#" + tableInput.getAttribute("id"), "cell-value");
  session.api.flushPendingSave();

  const reloaded = initFromStandalone(html, { storage: session.storage, debounceMs: 0 });
  assert.equal(
    reloaded.root.querySelector("#" + tableInput.getAttribute("id")).value,
    "cell-value"
  );
});

test("standalone export-runtime restores guided-review checklist checkboxes", () => {
  const fragment = renderGuidedChecklistFragment();
  const html = embed.injectStandaloneVnextExportRuntime(
    "<!doctype html><html><body>" + fragment + "</body></html>"
  );
  assert.match(html, /data-guided-review="true"/);
  assert.match(html, /data-workspace-kind="checklist_entry"/);
  assert.match(html, /function initializeLearnerDraftPersistence\s*\(/);

  const session = initFromStandalone(html, { debounceMs: 0 });
  const checkbox = session.root.querySelector('input[type="checkbox"][data-checklist-item-id]');
  assert.ok(checkbox, "expected guided checklist checkbox");
  emitCheckboxChange(session.root, "#" + checkbox.getAttribute("id"), true);
  session.api.flushPendingSave();
  assert.equal(checkbox.checked, true);

  const reloaded = initFromStandalone(html, { storage: session.storage, debounceMs: 0 });
  const restored = reloaded.root.querySelector("#" + checkbox.getAttribute("id"));
  assert.equal(restored.checked, true);
  assert.equal(reloaded.api.getStatus(), learnerDraftConstants.STATUS.RESTORED);
});

test("standalone clear saved responses clears storage and UI", () => {
  const html = composeStandaloneExport(loadJson(heteroFixture));
  const session = initFromStandalone(html, { debounceMs: 0, confirmResult: true });
  const textarea = session.root.querySelector("textarea.util-learner-workspace__input");
  emitInput(session.root, "#" + textarea.getAttribute("id"), "to-clear");
  session.api.flushPendingSave();
  assert.equal(session.api.clearDraft().ok, true);
  assert.equal(textarea.value, "");
  assert.equal(session.api.getStatus(), learnerDraftConstants.STATUS.NOT_SAVED);
  assert.equal(session.storage._map.size, 0);
});

test("standalone storage unavailability degrades without throwing", () => {
  const html = composeStandaloneExport(loadJson(heteroFixture));
  const session = initFromStandalone(html, {
    debounceMs: 0,
    storage: unavailableStorage()
  });
  assert.equal(session.api.getStatus(), learnerDraftConstants.STATUS.UNAVAILABLE);
  const textarea = session.root.querySelector("textarea.util-learner-workspace__input");
  assert.doesNotThrow(() => {
    emitInput(session.root, "#" + textarea.getAttribute("id"), "unsaved");
    session.api.flushPendingSave();
  });
  assert.equal(session.api.getStatus(), learnerDraftConstants.STATUS.UNAVAILABLE);
  assert.equal(
    session.root.querySelector("[data-learner-draft-status]").textContent,
    learnerDraftConstants.STATUS.UNAVAILABLE
  );
});

test("injectStandaloneVnextExportRuntime is idempotent", () => {
  const fragment = renderLearnerPageHtml(loadJson(heteroFixture), {
    compositionMode: "moments"
  }).html;
  const once = embed.injectStandaloneVnextExportRuntime(
    "<!doctype html><html><body>" + fragment + "</body></html>"
  );
  const twice = embed.injectStandaloneVnextExportRuntime(once);
  assert.equal(twice, once);
  assert.equal((once.match(/data-prism-vnext-export-runtime="true"/g) || []).length, 1);
});
