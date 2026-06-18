/**
 * Sprint 50 Phase 2 — instructional manifestation grammar in learner-page renderer.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxFixturePath = path.join(repoRoot, "tests/fixtures/page-render/marx-self-study-page.json");
const marxRun2PagePath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/page.json"
);
const marxRun2DlaPath = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-19-sprint-49-sp-01-text-pattern/marx-run-artefacts-run2/learning_activities.json"
);

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
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();

function renderPage(parsed) {
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function activityArticleScope(html, titleFragment) {
  const escaped = titleFragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fragmentRe = new RegExp(escaped, "i");
  const articles = html.match(/<article class="util-task-block[^"]*">[\s\S]*?<\/article>/gi) || [];
  return articles.find((article) => fragmentRe.test(article)) || "";
}

function mergeMarxRun2PageWithDla() {
  const page = JSON.parse(fs.readFileSync(marxRun2PagePath, "utf8"));
  const dla = JSON.parse(fs.readFileSync(marxRun2DlaPath, "utf8"));
  api.applyPageCompositionValidationForUtilitiesPage(page, {
    upstreamLearningActivities: dla
  });
  return page;
}

test("Sprint 50 Phase 2: Marx fixture renders instructional grammar headings", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  assert.match(html, /Why this activity/);
  assert.match(html, /How to approach this/);
  assert.match(html, /Read and model/);
  assert.match(html, /What to do/);
  assert.match(html, /Check your work/);
});

test("Sprint 50 Phase 2: Study appears before Do on modelled comparison activity", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  const scope = activityArticleScope(html, "Modelled comparison row");
  assert.ok(scope, "expected A2 activity article");
  const orientIdx = scope.indexOf("Why this activity");
  const studyIdx = scope.indexOf("Read and model");
  const doIdx = scope.indexOf("What to do");
  assert.ok(orientIdx !== -1 && studyIdx !== -1 && doIdx !== -1);
  assert.ok(orientIdx < studyIdx, "Orient before Study");
  assert.ok(studyIdx < doIdx, "Study before Do");
});

test("Sprint 50 Phase 2: Check unifies checklist and expected output", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  const scope = activityArticleScope(html, "Explaining Marx");
  assert.ok(scope);
  const checkIdx = scope.indexOf("Check your work");
  assert.notEqual(checkIdx, -1);
  const afterCheck = scope.slice(checkIdx);
  assert.match(afterCheck, /util-checkbox-list|Identify capitalism/i);
  assert.match(afterCheck, /150–250 words|defensible judgement/i);
  assert.doesNotMatch(scope, /util-output-block/, "no separate Output block");
});

test("Sprint 50 Phase 2: Explain before you check when self_explanation precedes checklist", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  const scope = activityArticleScope(html, "purpose-and-difference move from the model row");
  assert.ok(scope);
  const explainIdx = scope.indexOf("util-instructional-reflect-precheck");
  const doIdx = scope.indexOf("util-instructional-section util-instructional-do");
  assert.notEqual(explainIdx, -1);
  assert.notEqual(doIdx, -1);
  assert.ok(explainIdx < doIdx, "pre-check reflect before Do");
});

test("Sprint 50 Phase 2: no duplicate util-cognition block on grammar pages", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  assert.doesNotMatch(html, /util-cognition util-material-role-thinking/);
});

test("Sprint 50 Phase 2: compass does not duplicate reasoning_orientation signals", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  assert.doesNotMatch(html, /data-compass-signal="reasoning_orientation"/i);
  assert.doesNotMatch(html, /How to think:/i);
});

test("Sprint 50 Phase 2: single-column activity layout (no side compass column)", () => {
  const html = renderPage(JSON.parse(fs.readFileSync(marxFixturePath, "utf8")));
  assert.doesNotMatch(html, /util-activity-row util-page-columns/);
  assert.match(html, /util-activity-progress|Step \d+ of \d+/);
});

test("Sprint 50 Phase 2: Marx run2 composed page renders Orient and Think", () => {
  const page = mergeMarxRun2PageWithDla();
  const html = renderPage(page);
  const scope = activityArticleScope(html, "Historical Materialism");
  assert.ok(scope);
  assert.match(scope, /Why this activity/);
  assert.match(scope, /How to approach this/);
  assert.match(scope, /Read and model/);
  const studyIdx = scope.indexOf("Read and model");
  const doIdx = scope.indexOf("What to do");
  assert.ok(studyIdx < doIdx, "Study before Do on run2 A1");
});

test("Sprint 50 Phase 2: lib partition places checklist in Check bucket", () => {
  const grammar = api.resolveLdInstructionalManifestationRenderLibForTest();
  assert.ok(grammar);
  const row = {
    activity_id: "A1",
    learner_task: "Do the task.",
    expected_output: "A written answer.",
    self_explanation_prompt: "Explain your reasoning."
  };
  const materials = {
    text: "Exposition body.",
    worked_example: "Model steps.",
    checklist: ["Item one", "Item two"],
    sample_output: "Annotated sample."
  };
  const partition = grammar.partitionActivityMaterialsForGrammar(row, materials);
  assert.ok(partition.study.text);
  assert.ok(partition.study.worked_example);
  assert.ok(partition.study.sample_output, "pre-check sample_output in Study");
  assert.ok(partition.check.checklist);
  assert.equal(partition.preCheckReflect, true);
});
