/**
 * Climate misconception discussion page — typed activity materials renderer hotfix.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-climate-misconception-discussion-page.json"
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function sectionScope(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : html;
}

function cardBodies(html) {
  return [...html.matchAll(/<article class="util-task-card">([\s\S]*?)<\/article>/gi)].map((m) => m[1]);
}

const api = loadPrismTestApi();
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

test("climate misconception page: task cards split into grid", () => {
  const r = api.buildUtilityStructuredHtmlForTest(fixture);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const activities = sectionScope(html, "Learning activities");
  const cards = cardBodies(activities);
  assert.ok(cards.length >= 10, "expected at least 10 task cards, got " + cards.length);
  const coldCard = cards.find((body) => /Cold winters disprove global warming/i.test(body));
  const modelsCard = cards.find((body) => /Climate models are unreliable/i.test(body));
  assert.ok(coldCard, "Cold winters claim should appear in its own card");
  assert.ok(modelsCard, "Climate models claim should appear in a separate card");
  assert.notEqual(coldCard, modelsCard);
  assert.match(activities, /util-card-grid/);
});

test("climate misconception page: typed materials and output block", () => {
  const r = api.buildUtilityStructuredHtmlForTest(fixture);
  const html = String(r.html || "");
  const activities = sectionScope(html, "Learning activities");
  assert.match(activities, /util-template-block/);
  assert.match(activities, /util-template-note-line|util-worksheet-line/);
  assert.match(activities, /util-prompt-set/);
  assert.match(activities, /util-checklist-block/);
  assert.match(activities, /util-checkbox-list/);
  const outputMatch = activities.match(/<div class="util-output-block util-material-role-deliverable">([\s\S]*?)<\/div>/i);
  assert.ok(outputMatch, "expected util-output-block div");
  const outputHtml = outputMatch[1];
  assert.match(outputHtml, /<ul\b/);
  assert.match(outputHtml, /completed analysis template/i);
  assert.doesNotMatch(outputHtml, /<p>\s*-\s+A completed analysis/i);
});

test("climate misconception page: true/false layout without revealed answers", () => {
  const r = api.buildUtilityStructuredHtmlForTest(fixture);
  const html = String(r.html || "");
  const assessment = sectionScope(html, "Formative assessment");
  assert.match(assessment, /util-true-false-options/);
  assert.match(assessment, />\s*True\s*</);
  assert.match(assessment, />\s*False\s*</);
  assert.match(assessment, /Cold winters in one region/i);
  assert.match(assessment, /Climate models are unreliable/i);
  assert.doesNotMatch(assessment, /<h[345][^>]*>\s*Proposition\s*</i);
  assert.doesNotMatch(assessment, /Correct answer/i);
});
