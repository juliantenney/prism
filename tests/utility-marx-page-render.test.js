/**
 * Hotfix regression tests — Marx self-study renderer/material presentation.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-self-study-page.json");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
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
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
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

function renderMarxPage(api) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

const api = loadPrismTestApi();

test("Marx knowledge summary: concept blocks without nested heading stacks in list items", () => {
  const html = renderMarxPage(api);
  const ks = html.match(/Key Knowledge Summary[\s\S]*?(?=<h2|$)/i);
  assert.ok(ks, "expected knowledge summary section");
  assert.match(ks[0], /util-knowledge-summary/);
  assert.match(ks[0], /util-definition-list/);
  assert.match(ks[0], /Karl Marx/);
  assert.match(ks[0], /Class Struggle/);
  assert.match(ks[0], /util-concept-relationships/);
  assert.doesNotMatch(ks[0], /<li>\s*<h3>/i, "concepts must not render as heading stacks inside <li>");
  assert.doesNotMatch(ks[0], /<h3>\s*Definition\s*<\/h3>/i);
});

test("slice 31-3: Marx knowledge summary preserves concept order", () => {
  const html = renderMarxPage(api);
  const ks = html.match(/Key Knowledge Summary[\s\S]*?(?=<h2|$)/i);
  assert.ok(ks);
  const marxIdx = ks[0].indexOf("Karl Marx");
  const classIdx = ks[0].indexOf("Class Struggle");
  const histIdx = ks[0].indexOf("Historical Materialism");
  const alienIdx = ks[0].indexOf("Alienation");
  assert.ok(marxIdx < classIdx && classIdx < histIdx && histIdx < alienIdx);
});

test("Marx checklist material: renders util-checkbox-list, not loose paragraphs only", () => {
  const html = renderMarxPage(api);
  const activity = html.match(/Explaining Marx[\s\S]*?(?=<article class="util-task-block"|$)/i);
  assert.ok(activity, "expected core concepts activity");
  assert.match(activity[0], /util-checklist-block/);
  assert.match(activity[0], /util-checkbox-list/);
  assert.match(activity[0], /Identify capitalism/);
  assert.doesNotMatch(
    activity[0],
    /<div class="util-checklist-block">[\s\S]*<p>Identify capitalism<\/p>/i,
    "checklist items should not be plain paragraphs inside checklist block"
  );
});

test("Marx checklist: markdown heading lines are not checkbox items", () => {
  const html = renderMarxPage(api);
  const activity = html.match(/Explaining Marx[\s\S]*?(?=<article class="util-task-block"|$)/i);
  assert.ok(activity, "expected core concepts activity");
  const checklist = activity[0].match(/<ul class="util-checkbox-list"[^>]*>[\s\S]*?<\/ul>/i);
  assert.ok(checklist, "expected util-checkbox-list ul element");
  assert.doesNotMatch(checklist[0], /##\s*Checklist/i, "heading line must not appear inside checkbox list");
  assert.doesNotMatch(checklist[0], />#+\s*Checklist</i);
  assert.match(checklist[0], /Identify capitalism/);
  assert.match(checklist[0], /Provide final judgement/i);
});

test("Marx comparison prompts: no markdown separator artefact in output", () => {
  const html = renderMarxPage(api);
  assert.doesNotMatch(html, /---\s*-\s*Key Difference:/i);
  assert.match(html, /Key Difference:/i);
  assert.match(html, /Second Difference:/i);
  assert.match(html, /Similarity:/i);
});

test("slice 31-5: Marx page preserves primary task and knowledge summary wrappers", () => {
  const html = renderMarxPage(api);
  assert.match(html, /util-activity-task--primary/);
  assert.match(html, /util-knowledge-summary/);
  assert.match(html, /util-materials-stack/);
  const core = html.match(/Explaining Marx[\s\S]*?(?=<article class="util-task-block"|$)/i);
  assert.ok(core);
  assert.match(core[0], /What to do/);
  assert.match(core[0], /Identify capitalism/);
});

test("slice 31-4: Marx materials stack and prompt/table presentation tiers", () => {
  const html = renderMarxPage(api);
  const core = html.match(/Explaining Marx[\s\S]*?(?=<article class="util-task-block"|$)/i);
  assert.ok(core, "expected core concepts activity");
  assert.match(core[0], /util-materials-stack/);
  assert.match(html, /What is the purpose of each work/);
  assert.match(html, /util-table-scroll/);
  assert.doesNotMatch(html, /---\s*-\s*Key Difference:/i);
});

test("Marx materials: suppress redundant generic headings when inner title exists", () => {
  const html = renderMarxPage(api);
  assert.doesNotMatch(
    html,
    /Summary Text[\s\S]{0,120}util-card-subheading[\s\S]{0,80}Factory Scenario/i,
    "expected inner Factory Scenario title without redundant Summary Text label"
  );
});

test("slice 31-1: Marx learner page — no audience or production metadata in main body", () => {
  const html = renderMarxPage(api);
  const body = html.split('<details class="util-meta"')[0];
  assert.doesNotMatch(body, /<strong>Audience:<\/strong>/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Source Artefacts/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Generation Notes/i);
});

test("slice 31-2: Marx learner page — framing rail and primary task without facilitator leakage", () => {
  const html = renderMarxPage(api);
  assert.match(html, /util-activity-task--primary/);
  assert.doesNotMatch(html, /Facilitator use:/i);
  assert.doesNotMatch(html, /Teacher notes:/i);
  const activity = html.match(/Explaining Marx[\s\S]*?(?=<article class="util-task-block"|$)/i);
  assert.ok(activity, "expected core concepts activity");
  if (/util-activity-framing/.test(activity[0])) {
    assert.match(activity[0], /util-activity-framing/);
  }
  assert.match(activity[0], /What to do/i);
});

test("slice 31-1: Marx live JSON — production keys only in util-meta when present", () => {
  const livePath = path.join(
    repoRoot,
    "docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/marx-page.json"
  );
  const parsed = JSON.parse(fs.readFileSync(livePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /<details class="util-meta"/);
  const body = html.split('<details class="util-meta"')[0];
  assert.doesNotMatch(body, /<h2[^>]*>\s*Source Artefacts/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Generation Notes/i);
  assert.doesNotMatch(body, /<strong>Audience:<\/strong>/i);
  assert.match(html, /About this page/);
});
