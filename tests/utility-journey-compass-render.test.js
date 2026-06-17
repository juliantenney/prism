/**
 * Sprint 49-6 — journey compass renderer scaffold (two-column salience).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

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

function compassAside(html) {
  const match = html.match(/<aside class="util-journey-compass"[\s\S]*?<\/aside>/i);
  return match ? match[0] : "";
}

test("49-6: compass renders when overview and activities exist", () => {
  const html = renderPage(marxBenchmark);
  assert.match(html, /util-page-columns/);
  assert.match(html, /util-journey-compass/);
  assert.match(html, /util-page-resource/);
  assert.match(html, /util-page-export--with-compass/);
});

test("49-6: compass includes governing inquiry from overview", () => {
  const compass = buildCompass(marxBenchmark);
  assert.match(compass.governing_inquiry, /explores whether Karl Marx/i);
  const html = renderPage(marxBenchmark);
  assert.match(compassAside(html), /explores whether Karl Marx/i);
});

test("49-6: compass includes activity progression steps", () => {
  const compass = buildCompass(marxBenchmark);
  assert.equal(compass.steps.length, 4);
  assert.equal(compass.steps[0].activity_id, "A1");
  assert.match(compass.steps[3].title, /Final Evaluation/i);
  const html = renderPage(marxBenchmark);
  assert.match(compassAside(html), /A1 — Core Marxist Concepts in Action/);
  assert.match(compassAside(html), /A4 — Was Marx Right\? Final Evaluation/);
});

test("49-6: existing activity and material content remains in main column", () => {
  const html = renderPage(marxBenchmark);
  const mainMatch = html.match(/<main class="util-page-resource"[\s\S]*<\/main>/i);
  assert.ok(mainMatch, "main resource column expected");
  const main = mainMatch[0];
  assert.match(main, /util-task-block/);
  assert.match(main, /Key Marxist Concepts Explained/);
  assert.match(main, /Surplus Value/);
  assert.match(main, /What to do/);
});

test("49-6: SP-01 text material body stays in resource column, not compass", () => {
  const html = renderPage(marxBenchmark);
  const aside = compassAside(html);
  const mainMatch = html.match(/<main class="util-page-resource"[\s\S]*<\/main>/i);
  const main = mainMatch[0];
  const expositionSnippet = "Capitalism is an economic system based on private ownership";
  assert.match(main, new RegExp(expositionSnippet.slice(0, 40)));
  assert.doesNotMatch(aside, new RegExp(expositionSnippet.slice(0, 40)));
});

test("49-6: transfer and consolidation produce short compass pointers only", () => {
  const compass = buildCompass(marxBenchmark);
  const a4 = compass.steps.find((s) => s.activity_id === "A4");
  assert.ok(a4);
  const transfer = a4.signals.find((s) => s.kind === "transfer_prompt_pointer");
  const close = a4.signals.find((s) => s.kind === "consolidation_pointer");
  assert.ok(transfer);
  assert.ok(close);
  assert.equal(transfer.text, "Transfer task in activity materials");
  assert.equal(close.text, "Consolidation summary in activity materials");
  const html = renderPage(marxBenchmark);
  const aside = compassAside(html);
  assert.match(aside, /Transfer task in activity materials/);
  assert.doesNotMatch(aside, /ride-sharing, food delivery/i);
  assert.doesNotMatch(aside, /What does Marx explain \*\*most effectively\*\*/i);
});

test("49-6: responsive wrapper classes are present in export CSS", () => {
  const html = renderPage(marxBenchmark);
  assert.match(html, /@media \(max-width:720px\)\{\.util-page-columns\{grid-template-columns:1fr/);
});

test("49-6: util-pel cues still render in activity framing when fields exist", () => {
  const html = renderPage(marxFixture);
  assert.match(html, /util-pel-reasoning-cue/);
  assert.match(html, /util-activity-framing/);
  assert.match(html, /How to think:/i);
});

test("49-6: compass appears before main content in DOM order", () => {
  const html = renderPage(marxBenchmark);
  const columnsIdx = html.indexOf("util-page-columns");
  const asideIdx = html.indexOf("util-journey-compass");
  const mainIdx = html.indexOf('id="util-page-resource-main"');
  assert.ok(columnsIdx >= 0 && asideIdx > columnsIdx && mainIdx > asideIdx);
  assert.match(html, /role="complementary"/);
  assert.match(html, /id="util-journey-compass-heading"/);
});

test("49-6: title fallback when overview missing", () => {
  const page = JSON.parse(JSON.stringify(marxBenchmark));
  page.sections = page.sections.filter((s) => s.section_id !== "overview");
  const compass = buildCompass(page);
  assert.match(compass.governing_inquiry, /Was Marx Right/i);
});

function buildCompass(page) {
  return api.buildJourneyCompassFromPageForTest(page);
}
