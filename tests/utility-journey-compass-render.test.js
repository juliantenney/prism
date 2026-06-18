/**
 * Sprint 49-6 / 49-6b — per-activity journey compass renderer.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxBenchmarkPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-15-sprint-44",
  "benchmark-corpus",
  "marx",
  "page.json"
);
const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-self-study-page.json");

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
const marxBenchmark = JSON.parse(fs.readFileSync(marxBenchmarkPath, "utf8"));
const marxFixture = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));

function renderPage(page) {
  const result = api.runUtilityPageExportPipelineForTest(page, {
    applyCompositionValidation: false
  });
  assert.equal(result.error, null, result.error || "render failed");
  return result.html;
}

function bodyHtml(html) {
  return String(html || "").split('<details class="util-meta"')[0];
}

function activityCompassAsides(html) {
  return bodyHtml(html).match(/<aside class="util-journey-compass[\s\S]*?<\/aside>/gi) || [];
}

test("49-6b: page header and activity progress render when overview and activities exist", () => {
  const html = renderPage(marxBenchmark);
  assert.match(html, /util-journey-compass-header/);
  assert.match(html, /util-instructional-activity/);
  assert.match(html, /util-activity-progress/);
  assert.match(html, /util-page-export--with-compass/);
});

test("49-6b: page header includes governing inquiry from overview", () => {
  const compass = buildCompass(marxBenchmark);
  assert.match(compass.governing_inquiry, /explores whether Karl Marx/i);
  const html = renderPage(marxBenchmark);
  const header = html.match(/<section class="util-journey-compass-header"[\s\S]*?<\/section>/i);
  assert.ok(header);
  assert.match(header[0], /explores whether Karl Marx/i);
});

test("49-6b: each activity row includes progression label", () => {
  const compass = buildCompass(marxBenchmark);
  assert.equal(compass.steps.length, 4);
  const html = renderPage(marxBenchmark);
  assert.match(html, /A1 — Core Marxist Concepts in Action/);
  assert.match(html, /A4 — Was Marx Right\? Final Evaluation/);
  assert.match(html, /Step 1 of 4/);
  assert.match(html, /Step 4 of 4/);
});

test("49-6b: activity and material content remains in util-task-block column", () => {
  const html = renderPage(marxBenchmark);
  const body = bodyHtml(html);
  assert.match(body, /util-task-block/);
  assert.match(body, /Key Marxist Concepts Explained/);
  assert.match(body, /Surplus Value/);
  assert.match(body, /What to do/);
});

test("49-6b: SP-01 text material body stays in activity column, not compass", () => {
  const html = renderPage(marxBenchmark);
  const asides = activityCompassAsides(html).join("");
  const body = bodyHtml(html);
  const expositionSnippet = "Capitalism is an economic system based on private ownership";
  assert.match(body, new RegExp(expositionSnippet.slice(0, 40)));
  assert.doesNotMatch(asides, new RegExp(expositionSnippet.slice(0, 40)));
});

test("49-6b: transfer and consolidation render in instructional sections not compass", () => {
  const compass = buildCompass(marxBenchmark);
  const a4 = compass.steps.find((s) => s.activity_id === "A4");
  assert.ok(a4);
  assert.equal((a4.signals || []).length, 0, "Sprint 50: compass signals stripped");
  const html = renderPage(marxBenchmark);
  assert.doesNotMatch(html, /Transfer task in activity materials/);
  assert.doesNotMatch(html, /data-compass-signal="transfer_prompt_pointer"/i);
});

test("49-6b: responsive wrapper classes are present in export CSS", () => {
  const html = renderPage(marxBenchmark);
  assert.match(
    html,
    /@media \(max-width:720px\)\{\.util-activity-row\.util-page-columns\{grid-template-columns:1fr/
  );
});

test("49-6b: instructional grammar renders Orient and Think on self-study fixture", () => {
  const html = renderPage(marxFixture);
  const body = bodyHtml(html);
  assert.match(body, /Why this activity/);
  assert.match(body, /How to approach this/);
  assert.doesNotMatch(body, /util-pel-reasoning-cue"><strong>How to think:/);
});

test("49-6b: activity progress precedes instructional sections in each article", () => {
  const html = renderPage(marxBenchmark);
  const articles = bodyHtml(html).match(/<article class="util-task-block[^"]*">[\s\S]*?<\/article>/gi);
  assert.ok(articles && articles.length >= 4, "expected activity articles");
  articles.forEach((article) => {
    const progressIdx = article.indexOf("util-activity-progress");
    const orientIdx = article.indexOf("util-instructional-orient");
    if (progressIdx >= 0 && orientIdx >= 0) {
      assert.ok(progressIdx < orientIdx, "progress before first instructional section");
    }
    assert.match(article, /util-instructional-heading/);
  });
  assert.match(html, /id="util-journey-compass-heading"/);
});

test("49-6b: title fallback when overview missing", () => {
  const page = JSON.parse(JSON.stringify(marxBenchmark));
  page.sections = page.sections.filter((s) => s.section_id !== "overview");
  const compass = buildCompass(page);
  assert.match(compass.governing_inquiry, /Was Marx Right/i);
});

function buildCompass(page) {
  return api.buildJourneyCompassFromPageForTest(page);
}
