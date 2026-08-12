"use strict";

/**
 * Sprint 75 — Prompt Studio saved-prompt persistence alignment.
 *
 * Locks the contract that standalone Prompt Studio saves through the authoritative
 * Prompt Library persistence API (library.js), not a parallel store.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
const librarySource = fs.readFileSync(path.join(repoRoot, "library.js"), "utf8");

const LS_KEY = "promptRefiner.prompts";

function bootLibrary() {
  const store = Object.create(null);
  const localStorage = {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    }
  };

  const sandbox = {
    window: {},
    localStorage,
    indexedDB: undefined
  };
  sandbox.window = sandbox;
  sandbox.window.Utils = {
    uuid() {
      return "test-uuid-" + String(Math.random()).slice(2);
    }
  };

  vm.runInContext(librarySource, vm.createContext(sandbox), { filename: "library.js" });
  return { Library: sandbox.window.Library, localStorage, store };
}

function extractFunctionBody(source, name) {
  const start = source.indexOf("function " + name);
  assert.ok(start >= 0, name + " should exist");
  const brace = source.indexOf("{", start);
  let depth = 0;
  for (let i = brace; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error("Could not extract " + name);
}

test("standalone Prompt Studio save wires to Library.savePrompt", () => {
  assert.match(appSource, /function handleSaveRefinedToLibrary/);
  assert.match(appSource, /els\.saveToLibraryBtn\.addEventListener\("click", handleSaveRefinedToLibrary\)/);
  assert.match(appSource, /window\.Library\s*\n?\s*\.savePrompt\(promptAssetDraft\)/);

  const handler = extractFunctionBody(appSource, "handleSaveRefinedToLibrary");
  const workflowBranch = handler.slice(0, handler.indexOf("var promptAssetDraft"));
  assert.match(workflowBranch, /saveWorkflows\(\)/);
  assert.doesNotMatch(workflowBranch, /Library\.savePrompt/);
});

test("Prompt Studio standalone save always creates via Library.savePrompt", () => {
  const handler = extractFunctionBody(appSource, "handleSaveRefinedToLibrary");
  const standalone = handler.slice(handler.indexOf("var promptAssetDraft"));
  assert.match(standalone, /window\.Library\s*\n?\s*\.savePrompt\(promptAssetDraft\)/);
  assert.doesNotMatch(standalone, /Library\.updatePrompt/);
  assert.doesNotMatch(standalone, /promptAssetDraft\.id\s*=/);
});

test("Library.savePrompt is authoritative create path with identity, timestamps, and reload", async () => {
  const { Library, store } = bootLibrary();

  const saved = await Library.savePrompt({
    title: "Pasted prompt",
    body: "Do the thing.",
    source: "manual",
    notes: "",
    tags: ["demo"]
  });

  assert.ok(saved.id, "savePrompt assigns id");
  assert.equal(saved.title, "Pasted prompt");
  assert.equal(saved.body, "Do the thing.");
  assert.equal(saved.source, "manual");
  assert.equal(typeof saved.createdAt, "number");
  assert.equal(typeof saved.updatedAt, "number");
  assert.equal(saved.usageCount, 0);
  assert.ok(Array.isArray(saved.versions) && saved.versions.length === 1);
  assert.equal(saved.versions[0].body, "Do the thing.");

  const reloaded = await Library.getAllPrompts();
  assert.equal(reloaded.length, 1);
  assert.equal(reloaded[0].id, saved.id);

  const raw = store[LS_KEY];
  assert.ok(raw, "persists to promptRefiner.prompts localStorage fallback");
  const parsed = JSON.parse(raw);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].id, saved.id);
});

test("Library.updatePrompt preserves identity and appends version on body change", async () => {
  const { Library } = bootLibrary();
  const created = await Library.savePrompt({
    title: "Original",
    body: "v1",
    source: "refined"
  });

  const updated = await Library.updatePrompt({
    id: created.id,
    title: "Renamed",
    body: "v2"
  });

  assert.equal(updated.id, created.id);
  assert.equal(updated.createdAt, created.createdAt);
  assert.ok(updated.updatedAt >= created.updatedAt);
  assert.equal(updated.title, "Renamed");
  assert.equal(updated.body, "v2");
  assert.equal(updated.versions.length, 2);
});

test("exported prompts participate in importPromptsFromEntries roundtrip", async () => {
  const { Library } = bootLibrary();
  const saved = await Library.savePrompt({
    title: "Export me",
    body: "Body text",
    source: "manual",
    tags: ["x"]
  });

  const exported = await Library.exportPrompts([saved.id]);
  assert.equal(exported.length, 1);

  await Library.deletePrompt(saved.id);
  assert.equal((await Library.getAllPrompts()).length, 0);

  const summary = await Library.importPromptsFromEntries(exported);
  assert.equal(summary.added, 1);
  const restored = await Library.getAllPrompts();
  assert.equal(restored.length, 1);
  assert.equal(restored[0].id, saved.id);
  assert.equal(restored[0].body, "Body text");
});

test("handleSaveRefinedToLibrary post-save refresh uses in-memory state + renderLibraryList", () => {
  const handler = extractFunctionBody(appSource, "handleSaveRefinedToLibrary");
  assert.match(handler, /state\.prompts\.push\(saved\)/);
  assert.match(handler, /selectPrompt\(saved\.id\)/);
  assert.match(handler, /renderLibraryList\(\)/);
  assert.match(handler, /refreshWorkflowPromptOptions\(\)/);
});

test("init hydrates library via loadLibrary -> Library.getAllPrompts", () => {
  assert.match(appSource, /function loadLibrary/);
  assert.match(appSource, /window\.Library\.getAllPrompts\(\)/);
  assert.match(appSource, /loadLibrary\(\)/);
});
