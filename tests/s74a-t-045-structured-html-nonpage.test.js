"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");

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

function loadApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("S74A-T-045: slide_deck still renders via structured HTML", () => {
  const api = loadApi();
  const slide = {
    artifact_type: "slide_deck",
    title: "Deck",
    slides: [{ title: "One", bullets: ["a", "b"] }]
  };
  const plan = {
    artefactType: "slide_deck",
    rendererType: "slides",
    rendererVariant: "slide_deck",
    renderHints: {
      renderConfig: {
        labels: { slides: "Slides" },
        omitIfMissing: [],
        sectionOrder: ["slides"],
        grouping: "document_sections",
        itemKeyMap: {}
      }
    }
  };
  const r = api.runUtilityRendererByPlanForTest(plan, slide, "deck", {});
  assert.ok(r && !r.error, r && r.error);
  assert.match(String(r.html || ""), /<!doctype html>/i);
  assert.match(String(r.html || ""), /Deck|One|Slides/i);
});

test("S74A-T-045: structured HTML rejects learner page artefacts", () => {
  const api = loadApi();
  const plan = {
    artefactType: "page",
    rendererType: "document",
    rendererVariant: "generic_document",
    renderHints: {
      renderConfig: {
        labels: {},
        omitIfMissing: [],
        sectionOrder: ["sections"],
        grouping: "document_sections",
        itemKeyMap: {}
      }
    }
  };
  const r = api.runUtilityRendererByPlanForTest(plan, { artifact_type: "page", title: "P" }, "p", {});
  assert.ok(r && r.error);
  assert.match(String(r.error), /vNext export path/i);
});
