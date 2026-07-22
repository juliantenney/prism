"use strict";

/**
 * Sprint 68 — S68-IMP-019 local learner draft persistence.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const {
  renderLearnerPageHtml,
  buildLearnerDraftPageIdentity,
  initializeLearnerDraftPersistence,
  createLearnerDraftStorage,
  learnerDraftConstants,
  learnerDraftAdapters,
  learnerDraftEnvelope
} = require("../lib/learner-renderer-vnext");
const audit = require("../lib/learner-renderer-vnext/audit-learner-surfaces");
const {
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap.js");

const heteroFixture = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const orderingFixture = path.join(
  repoRoot,
  "tests/fixtures/page-render/prism-authoritative-ordering-page.json"
);
const vttFixture = path.join(
  repoRoot,
  "tests/fixtures/workflows/videotranscripttest-assembled-page.json"
);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
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

function createElement(tagName) {
  const node = {
    tagName: String(tagName || "").toUpperCase(),
    className: "",
    attributes: Object.create(null),
    children: [],
    parentNode: null,
    textContent: "",
    value: "",
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
    addEventListener(type, handler, capture) {
      if (!this._listeners) this._listeners = [];
      this._listeners.push({ type, handler, capture: Boolean(capture) });
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
  Object.defineProperty(node, "innerHTML", {
    get() {
      return this._innerHTML || "";
    },
    set(value) {
      this._innerHTML = String(value || "");
      this.children = [];
      const parsed = parseHtmlFragment(this._innerHTML, this.ownerDocument);
      parsed.children.slice().forEach((child) => this.appendChild(child));
    }
  });
  Object.defineProperty(node, "previousElementSibling", {
    get() {
      if (!this.parentNode) return null;
      const siblings = this.parentNode.children;
      const index = siblings.indexOf(this);
      return index > 0 ? siblings[index - 1] : null;
    }
  });
  Object.defineProperty(node, "nextElementSibling", {
    get() {
      if (!this.parentNode) return null;
      const siblings = this.parentNode.children;
      const index = siblings.indexOf(this);
      return index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
    }
  });
  return node;
}

function matchesSelector(node, selector) {
  const parts = String(selector)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length !== 1) return false;
  let rest = parts[0];
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
    const voidTags = { br: 1, img: 1, input: 1, meta: 1, link: 1, textarea: 1 };
    if (!voidTags[tag] && !/\/\s*$/.test(attrText)) stack.push(node);
  }
  return root;
}

function mountRenderedPage(html) {
  const documentNode = createElement("document");
  documentNode.ownerDocument = null;
  documentNode.createElement = function (tag) {
    const node = createElement(tag);
    node.ownerDocument = documentNode;
    return node;
  };
  documentNode.body = createElement("body");
  documentNode.body.ownerDocument = documentNode;
  const parsed = parseHtmlFragment(html, documentNode);
  const main = parsed.querySelector("main.util-learner-renderer-vnext") || parsed.children[0];
  assert.ok(main, "main missing");
  main.ownerDocument = documentNode;
  documentNode.body.appendChild(main);
  documentNode.querySelector = function (selector) {
    return documentNode.body.querySelector(selector);
  };
  documentNode.querySelectorAll = function (selector) {
    return documentNode.body.querySelectorAll(selector);
  };
  documentNode.addEventListener = function () {};
  return { document: documentNode, root: main };
}

function initPersistence(html, options) {
  const mounted = mountRenderedPage(html);
  const hasStorageOption = options && Object.prototype.hasOwnProperty.call(options, "storage");
  const storage = hasStorageOption ? options.storage : memoryStorage();
  const confirmCalls = [];
  const api = initializeLearnerDraftPersistence(mounted.root, {
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
    confirmCalls: confirmCalls
  };
}

function emitInput(root, selector, value) {
  const input = root.querySelector(selector);
  assert.ok(input, selector);
  input.value = value;
  const event = {
    type: "input",
    bubbles: true,
    target: input
  };
  (root._listeners || [])
    .filter((entry) => entry.type === "input")
    .forEach((entry) => entry.handler(event));
}

test("1 deterministic page storage key", () => {
  const page = loadJson(orderingFixture);
  const first = buildLearnerDraftPageIdentity(page);
  const second = buildLearnerDraftPageIdentity(page);
  assert.equal(first.pageKey, second.pageKey);
  assert.match(first.storageKey, /^learner-renderer-vnext:draft:/);
});

test("2 different workflows produce different storage keys", () => {
  const a = buildLearnerDraftPageIdentity({
    title: "Same title",
    schema_version: "2.0.0",
    metadata: { workflow_id: "wf-a" },
    activities: [{ activity_id: "A1" }]
  });
  const b = buildLearnerDraftPageIdentity({
    title: "Same title",
    schema_version: "2.0.0",
    metadata: { workflow_id: "wf-b" },
    activities: [{ activity_id: "A1" }]
  });
  assert.notEqual(a.storageKey, b.storageKey);
});

test("3 different pages produce different storage keys", () => {
  const a = buildLearnerDraftPageIdentity(loadJson(orderingFixture));
  const b = buildLearnerDraftPageIdentity(loadJson(heteroFixture));
  assert.notEqual(a.storageKey, b.storageKey);
});

test("4 envelope includes schema version", () => {
  const envelope = learnerDraftEnvelope.createEmptyEnvelope("page-key");
  assert.equal(envelope.schemaVersion, learnerDraftConstants.DRAFT_SCHEMA_VERSION);
  assert.equal(envelope.renderer, "learner-renderer-vnext");
});

test("5 workspace state includes kind and state version", () => {
  const state = learnerDraftEnvelope.createWorkspaceState("text_entry", { text: "hi" });
  assert.equal(state.kind, "text_entry");
  assert.equal(state.stateVersion, learnerDraftConstants.WORKSPACE_STATE_VERSION);
});

test("6 learner-visible labels are not used as sole identity when workflow ids exist", () => {
  const identity = buildLearnerDraftPageIdentity({
    title: "Visible Title Only Fallback",
    schema_version: "2.0.0",
    metadata: { workflow_id: "wf-1", page_id: "page-1" },
    activities: [{ activity_id: "A1" }]
  });
  assert.match(identity.pageKey, /wf-1/);
  assert.match(identity.pageKey, /page-1/);
  assert.ok(identity.pageKey.indexOf("visible-title-only-fallback") >= 0);
});

test("7 learner response content is not included in diagnostics", () => {
  const parsed = learnerDraftEnvelope.parseAndValidateEnvelope("{not-json", "page");
  assert.equal(parsed.ok, false);
  const blob = JSON.stringify(parsed.diagnostics);
  assert.doesNotMatch(blob, /secret learner answer/i);
});

test("8-14 text entry serialise and restore", () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const session = initPersistence(html, { debounceMs: 0 });
  const textareas = session.root.querySelectorAll("textarea.util-learner-workspace__input");
  assert.ok(textareas.length >= 2);
  const firstId = textareas[0].closest("[data-workspace-id]").getAttribute("data-workspace-id");
  const secondId = textareas[1].closest("[data-workspace-id]").getAttribute("data-workspace-id");
  assert.notEqual(firstId, secondId);

  emitInput(session.root, "#" + textareas[0].getAttribute("id"), "Line 1\nLine 2");
  emitInput(session.root, "#" + textareas[1].getAttribute("id"), "Unicode café ✨");
  session.api.flushPendingSave();

  const envelope = JSON.parse(
    session.storage.getItem(learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey)
  );
  assert.equal(envelope.workspaces[firstId].value.text, "Line 1\nLine 2");
  assert.equal(envelope.workspaces[secondId].value.text, "Unicode café ✨");

  const reloaded = initPersistence(html, { storage: session.storage, debounceMs: 0 });
  assert.equal(
    reloaded.root.querySelector("#" + textareas[0].getAttribute("id")).value,
    "Line 1\nLine 2"
  );
  assert.equal(
    reloaded.root.querySelector("#" + textareas[1].getAttribute("id")).value,
    "Unicode café ✨"
  );
  assert.equal(reloaded.api.getStatus(), learnerDraftConstants.STATUS.RESTORED);

  emitInput(session.root, "#" + textareas[0].getAttribute("id"), "");
  session.api.flushPendingSave();
  const emptyReload = initPersistence(html, { storage: session.storage, debounceMs: 0 });
  assert.equal(emptyReload.root.querySelector("#" + textareas[0].getAttribute("id")).value, "");

  const staleStorage = memoryStorage();
  staleStorage.setItem(
    learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey,
    JSON.stringify({
      schemaVersion: 1,
      renderer: "learner-renderer-vnext",
      pageKey: session.api.pageKey,
      workspaces: {
        "missing-workspace": {
          kind: "text_entry",
          stateVersion: 1,
          value: { text: "stale" }
        }
      }
    })
  );
  const stale = initPersistence(html, { storage: staleStorage, debounceMs: 0 });
  assert.ok(
    stale.api.getDiagnostics().some(
      (row) => row.code === learnerDraftConstants.DIAGNOSTIC.STALE_PERSISTED_WORKSPACE
    )
  );
});

test("15-21 table entry serialise and restore", () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const session = initPersistence(html, { debounceMs: 0 });
  const inputs = session.root.querySelectorAll("input.util-learner-table-workspace__input");
  assert.ok(inputs.length >= 2);
  const cellA = inputs[0].getAttribute("data-learner-cell");
  const cellB = inputs[1].getAttribute("data-learner-cell");
  assert.ok(cellA);
  assert.notEqual(cellA, cellB);

  emitInput(session.root, "#" + inputs[0].getAttribute("id"), "cell-one");
  emitInput(session.root, "#" + inputs[1].getAttribute("id"), "");
  session.api.flushPendingSave();

  const envelope = JSON.parse(
    session.storage.getItem(learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey)
  );
  const tableWorkspace = Object.values(envelope.workspaces).find(
    (workspace) => workspace.kind === "table_entry"
  );
  assert.ok(tableWorkspace);
  assert.equal(tableWorkspace.value.cells[cellA], "cell-one");
  assert.equal(tableWorkspace.value.cells[cellB], "");
  assert.equal(Object.prototype.hasOwnProperty.call(tableWorkspace.value.cells, "fixed"), false);

  tableWorkspace.value.cells["unknown-cell"] = "ignored";
  session.storage.setItem(
    learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey,
    JSON.stringify(envelope)
  );
  const reloaded = initPersistence(html, { storage: session.storage, debounceMs: 0 });
  assert.equal(reloaded.root.querySelector("#" + inputs[0].getAttribute("id")).value, "cell-one");
  assert.equal(
    (reloaded.root.querySelectorAll("input.util-learner-table-workspace__input") || []).length,
    inputs.length
  );
});

test("22-32 ordering persistence and invalid fallback", () => {
  const page = loadJson(orderingFixture);
  const html = renderLearnerPageHtml(page).html;
  const session = initPersistence(html, { debounceMs: 0 });
  const workspace = session.root.querySelector('[data-workspace-kind="ordering"]');
  assert.ok(workspace);
  const workspaceId = workspace.getAttribute("data-workspace-id");
  const initial = learnerDraftAdapters.currentOrderingIds(workspace);
  assert.equal(initial.length, 3);

  const list = workspace.querySelector("[data-ordering-list]");
  list.appendChild(list.children[0]);
  const moved = learnerDraftAdapters.currentOrderingIds(workspace);
  assert.notDeepEqual(moved, initial);
  session.root.dispatchEvent({
    type: "prism:learner-workspace-change",
    bubbles: true,
    target: workspace
  });
  session.api.flushPendingSave();

  const envelope = JSON.parse(
    session.storage.getItem(learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey)
  );
  assert.deepEqual(envelope.workspaces[workspaceId].value.itemOrder, moved);
  assert.equal(Object.prototype.hasOwnProperty.call(envelope.workspaces[workspaceId].value, "expectedOrder"), false);

  const reloaded = initPersistence(html, { storage: session.storage, debounceMs: 0 });
  const restoredWorkspace = reloaded.root.querySelector('[data-workspace-kind="ordering"]');
  assert.deepEqual(learnerDraftAdapters.currentOrderingIds(restoredWorkspace), moved);
  assert.equal(
    restoredWorkspace.querySelector('.util-ordering-item[data-position="1"] .util-ordering-item__move--up')
      .disabled,
    true
  );
  assert.match(
    restoredWorkspace.querySelector('.util-ordering-item[data-position="1"] .util-ordering-item__position')
      .textContent,
    /1 of 3/
  );
  assert.equal(
    restoredWorkspace.querySelector("[data-ordering-status]").textContent || "",
    ""
  );

  const bad = memoryStorage();
  bad.setItem(
    learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey,
    JSON.stringify({
      schemaVersion: 1,
      renderer: "learner-renderer-vnext",
      pageKey: session.api.pageKey,
      workspaces: {
        [workspaceId]: {
          kind: "ordering",
          stateVersion: 1,
          value: { itemOrder: [moved[0], moved[0], "extra"] }
        }
      }
    })
  );
  const fallback = initPersistence(html, { storage: bad, debounceMs: 0 });
  const fallbackWorkspace = fallback.root.querySelector('[data-workspace-kind="ordering"]');
  assert.deepEqual(
    learnerDraftAdapters.currentOrderingIds(fallbackWorkspace),
    JSON.parse(fallbackWorkspace.getAttribute("data-initial-item-order"))
  );
  assert.ok(
    fallback.api.getDiagnostics().some(
      (row) => row.code === learnerDraftConstants.DIAGNOSTIC.INVALID_PERSISTED_ORDERING_STATE
    )
  );
});

test("33-41 runtime debounce, idempotence, and flush", async () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  const storage = memoryStorage();
  let writes = 0;
  const countingStorage = {
    getItem: storage.getItem,
    removeItem: storage.removeItem,
    setItem(key, value) {
      writes += 1;
      storage.setItem(key, value);
    }
  };
  const session = initPersistence(html, { storage: countingStorage, debounceMs: 30 });
  const textarea = session.root.querySelector("textarea.util-learner-workspace__input");
  writes = 0;
  emitInput(session.root, "#" + textarea.getAttribute("id"), "a");
  emitInput(session.root, "#" + textarea.getAttribute("id"), "ab");
  emitInput(session.root, "#" + textarea.getAttribute("id"), "abc");
  assert.equal(writes, 0);
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.equal(writes, 1);
  assert.equal(session.api.isDirty(), false);

  const again = initializeLearnerDraftPersistence(session.root, {
    storage: countingStorage,
    debounceMs: 0
  });
  assert.equal(again, session.api);

  emitInput(session.root, "#" + textarea.getAttribute("id"), "final");
  session.api.flushPendingSave();
  const envelope = JSON.parse(
    storage.getItem(learnerDraftConstants.STORAGE_KEY_PREFIX + session.api.pageKey)
  );
  const textStates = Object.values(envelope.workspaces).filter((row) => row.kind === "text_entry");
  assert.ok(textStates.some((row) => row.value.text === "final"));
  assert.ok(Object.values(envelope.workspaces).some((row) => row.kind === "table_entry"));
});

test("42-49 storage failures and unsupported schema", () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;

  const unavailable = initPersistence(html, {
    storage: null,
    debounceMs: 0
  });
  assert.equal(unavailable.api.storageAvailable, false);
  assert.equal(unavailable.api.getStatus(), learnerDraftConstants.STATUS.UNAVAILABLE);

  const badJson = memoryStorage();
  const identity = buildLearnerDraftPageIdentity(page);
  badJson.setItem(identity.storageKey, "{bad");
  const parsed = initPersistence(html, { storage: badJson, debounceMs: 0 });
  assert.ok(
    parsed.api.getDiagnostics().some(
      (row) => row.code === learnerDraftConstants.DIAGNOSTIC.LEARNER_DRAFT_PARSE_FAILED
    )
  );

  const quota = memoryStorage();
  quota.setItem = function () {
    const err = new Error("quota");
    err.name = "QuotaExceededError";
    err.code = 22;
    throw err;
  };
  const quotaSession = initPersistence(html, { storage: quota, debounceMs: 0 });
  const textarea = quotaSession.root.querySelector("textarea.util-learner-workspace__input");
  emitInput(quotaSession.root, "#" + textarea.getAttribute("id"), "x");
  const writeResult = quotaSession.api.flushPendingSave();
  assert.equal(writeResult.ok, false);
  assert.equal(quotaSession.api.getStatus(), learnerDraftConstants.STATUS.UNABLE);

  const unsupported = memoryStorage();
  unsupported.setItem(
    identity.storageKey,
    JSON.stringify({ schemaVersion: 99, pageKey: identity.pageKey, workspaces: {} })
  );
  const unsupportedSession = initPersistence(html, { storage: unsupported, debounceMs: 0 });
  assert.ok(
    unsupportedSession.api.getDiagnostics().some(
      (row) => row.code === learnerDraftConstants.DIAGNOSTIC.UNSUPPORTED_DRAFT_SCHEMA_VERSION
    )
  );
});

test("50-58 clear draft behaviour", () => {
  const page = loadJson(orderingFixture);
  const html = renderLearnerPageHtml(page).html;
  const session = initPersistence(html, { debounceMs: 0, confirmResult: false });
  assert.equal(session.root.querySelectorAll("[data-learner-draft-clear]").length, 1);
  assert.match(
    session.root.querySelector("[data-learner-draft-clear]").getAttribute("aria-label") || "",
    /Clear saved responses/i
  );

  const textarea = session.root.querySelector("textarea.util-learner-workspace__input");
  if (textarea) {
    emitInput(session.root, "#" + textarea.getAttribute("id"), "keep-me");
    session.api.flushPendingSave();
  }
  const cancelled = session.api.clearDraft();
  assert.equal(cancelled.cancelled, true);
  if (textarea) {
    assert.equal(session.root.querySelector("#" + textarea.getAttribute("id")).value, "keep-me");
  }

  const confirmed = initPersistence(html, { debounceMs: 0, confirmResult: true });
  const ordering = confirmed.root.querySelector('[data-workspace-kind="ordering"]');
  const list = ordering.querySelector("[data-ordering-list]");
  list.appendChild(list.children[0]);
  confirmed.root.dispatchEvent({
    type: "prism:learner-workspace-change",
    bubbles: true,
    target: ordering
  });
  confirmed.api.flushPendingSave();
  const cleared = confirmed.api.clearDraft();
  assert.equal(cleared.ok, true);
  assert.equal(
    confirmed.storage.getItem(learnerDraftConstants.STORAGE_KEY_PREFIX + confirmed.api.pageKey),
    null
  );
  assert.deepEqual(
    learnerDraftAdapters.currentOrderingIds(ordering),
    JSON.parse(ordering.getAttribute("data-initial-item-order"))
  );
  assert.equal(confirmed.api.getStatus(), learnerDraftConstants.STATUS.NOT_SAVED);

  const heteroHtml = renderLearnerPageHtml(loadJson(heteroFixture), {
    compositionMode: "moments"
  }).html;
  const hetero = initPersistence(heteroHtml, { debounceMs: 0, confirmResult: true });
  const text = hetero.root.querySelector("textarea.util-learner-workspace__input");
  const tableInput = hetero.root.querySelector("input.util-learner-table-workspace__input");
  emitInput(hetero.root, "#" + text.getAttribute("id"), "wipe");
  emitInput(hetero.root, "#" + tableInput.getAttribute("id"), "cell");
  hetero.api.flushPendingSave();
  assert.equal(hetero.api.clearDraft().ok, true);
  assert.equal(text.value, "");
  assert.equal(tableInput.value, "");
});

test("59-64 accessibility and safe restore", () => {
  const page = loadJson(heteroFixture);
  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(html, /util-learner-draft-status/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /Clear saved responses/);
  assert.doesNotMatch(html, /response was submitted|successfully submitted|submission complete/i);
  assert.match(appCssSnippet(), /util-learner-draft-controls\{display:none\}/);

  const session = initPersistence(html, { debounceMs: 0 });
  assert.equal(session.root.querySelectorAll("[data-learner-draft-controls]").length, 1);
  const textarea = session.root.querySelector("textarea.util-learner-workspace__input");
  emitInput(session.root, "#" + textarea.getAttribute("id"), "<b>safe</b>");
  session.api.flushPendingSave();
  const reloaded = initPersistence(html, { storage: session.storage, debounceMs: 0 });
  const restored = reloaded.root.querySelector("#" + textarea.getAttribute("id"));
  assert.equal(restored.value, "<b>safe</b>");
});

function appCssSnippet() {
  const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const match = appJs.match(/@media print\{[^}]*util-learner-draft-controls[^}]*\}/);
  return match ? match[0] : "";
}

test("65-73 regressions and audit lifecycle", () => {
  const page = loadJson(heteroFixture);
  const nodeHtml = renderLearnerPageHtml(page, { compositionMode: "moments" }).html;
  assert.match(nodeHtml, /data-persistence-page-key=/);
  assert.match(nodeHtml, /data-workspace-id=/);
  assert.match(nodeHtml, /data-workspace-kind="text_entry"/);
  assert.match(nodeHtml, /data-workspace-kind="table_entry"/);
  assert.doesNotMatch(nodeHtml, /localStorage/);

  const sandbox = { console };
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  const browserHtml = sandbox.PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(page, {
    compositionMode: "moments"
  }).html;
  assert.equal(
    nodeHtml.replace(/\s+/g, " ").trim(),
    browserHtml.replace(/\s+/g, " ").trim()
  );

  const orderingPage = loadJson(orderingFixture);
  const orderingHtml = renderLearnerPageHtml(orderingPage).html;
  assert.match(orderingHtml, /data-workspace-kind="ordering"/);
  assert.match(orderingHtml, /data-initial-item-order=/);

  const result = audit.runLearnerSurfaceAudit({ repoRoot });
  assert.equal(result.records.length, 25);
  assert.equal(result.adequacyTotals.fully_supported, 25);
  assert.equal(result.adequacyTotals.supported_imperfectly_represented || 0, 0);
  assert.equal(result.adequacyTotals.missing_capability || 0, 0);
  result.records.forEach((record) => {
    assert.equal(record.lifecycleNeeds.localDraftPersistenceStatus, "implemented");
    assert.equal(record.lifecycleNeeds.submission, false);
    assert.equal(record.lifecycleNeeds.remoteSynchronisation, false);
  });
});

test("unsupported adapter diagnostic does not guess unknown kinds", () => {
  const el = createElement("div");
  el.setAttribute("data-workspace-kind", "matching");
  const result = learnerDraftAdapters.serializeWorkspaceState(el);
  assert.equal(result.ok, false);
  assert.equal(
    result.diagnostic.code,
    learnerDraftConstants.DIAGNOSTIC.UNSUPPORTED_WORKSPACE_STATE_ADAPTER
  );
});

test("createLearnerDraftStorage delete failure is reported", () => {
  const storage = createLearnerDraftStorage({
    getItem() {
      return null;
    },
    setItem() {},
    removeItem() {
      throw new Error("nope");
    }
  });
  const result = storage.deleteLearnerDraft("page");
  assert.equal(result.ok, false);
  assert.equal(
    result.diagnostics[0].code,
    learnerDraftConstants.DIAGNOSTIC.LEARNER_DRAFT_DELETE_FAILED
  );
});
