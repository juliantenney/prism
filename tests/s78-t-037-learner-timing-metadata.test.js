"use strict";

/**
 * S78-T-037 — Learner timing metadata: LS timeline → activity projection
 * and vNext header fallback.
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
const { buildPageModel } = require("../lib/learner-renderer-vnext");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const LAGRANGIAN_TIMELINE_DURATIONS = Object.freeze({
  A1: 8,
  A2: 14,
  A3: 16,
  A4: 11,
  A5: 11
});

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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api };
}

function loadHeteroscedasticityPage() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function stripActivityDurations(page) {
  (page.activities || []).forEach((activity) => {
    delete activity.duration_minutes;
    delete activity.durationMinutes;
  });
  return page;
}

function applyLagrangianTimingShape(page) {
  stripActivityDurations(page);
  page.learning_sequence = page.learning_sequence || {};
  page.learning_sequence.total_duration_minutes = 60;
  page.learning_sequence.timeline = ["A1", "A2", "A3", "A4", "A5"].map((activityId) => ({
    activity_id: activityId,
    duration_minutes: LAGRANGIAN_TIMELINE_DURATIONS[activityId]
  }));
  return page;
}

function renderVnextExport(api, fixture) {
  const result = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

function activityHtml(html, activityId) {
  const start = html.indexOf(`data-activity-id="${activityId}"`);
  assert.ok(start >= 0, `missing activity ${activityId}`);
  const articleStart = html.lastIndexOf("<article", start);
  const next = html.indexOf("<article", articleStart + 1);
  return next >= 0 ? html.slice(articleStart, next) : html.slice(articleStart);
}

test("Lagrangian-shaped page: timeline durations reach vNext activity models", () => {
  const page = applyLagrangianTimingShape(loadHeteroscedasticityPage());
  const result = buildPageModel(page);
  assert.equal(result.ok, true);
  const byId = Object.fromEntries(
    result.model.activities.map((activity) => [activity.id, activity.durationMinutes])
  );
  assert.deepEqual(byId, {
    A1: 8,
    A2: 14,
    A3: 16,
    A4: 11,
    A5: 11
  });
  assert.equal(result.model.header.durationMinutes, 60);
  assert.equal(
    page.activities.find((row) => row.activity_id === "A1").duration_minutes,
    undefined,
    "renderer projection must not mutate the source page"
  );
});

test("Lagrangian-shaped page: live vNext export shows 60 min header and activity badges", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, applyLagrangianTimingShape(loadHeteroscedasticityPage()));
  const headerIntro = html.match(/<div class="util-learning-header__intro">[\s\S]*?<\/div>/);
  assert.ok(headerIntro);
  assert.match(
    headerIntro[0],
    /class="util-learning-header__duration">60 mins\.<\/span>/
  );
  Object.keys(LAGRANGIAN_TIMELINE_DURATIONS).forEach((activityId) => {
    const minutes = LAGRANGIAN_TIMELINE_DURATIONS[activityId];
    assert.match(
      activityHtml(html, activityId),
      new RegExp(`class="util-badge util-badge-time">${minutes} min</span>`)
    );
  });
});

test("explicit activities[].duration_minutes wins over timeline projection on export", () => {
  const { api } = loadPrismTestApi();
  const page = applyLagrangianTimingShape(loadHeteroscedasticityPage());
  page.activities.find((row) => row.activity_id === "A1").duration_minutes = 99;
  const html = renderVnextExport(api, page);
  assert.match(activityHtml(html, "A1"), /class="util-badge util-badge-time">99 min<\/span>/);
  assert.match(activityHtml(html, "A2"), /class="util-badge util-badge-time">14 min<\/span>/);
});

test("learning_sequence.total_duration_minutes supplies header when activity durations unavailable", () => {
  const { api } = loadPrismTestApi();
  const page = stripActivityDurations(loadHeteroscedasticityPage());
  page.learning_sequence = page.learning_sequence || {};
  page.learning_sequence.total_duration_minutes = 60;
  (page.learning_sequence.timeline || []).forEach((entry) => {
    delete entry.duration_minutes;
  });
  const html = renderVnextExport(api, page);
  const headerIntro = html.match(/<div class="util-learning-header__intro">[\s\S]*?<\/div>/);
  assert.ok(headerIntro);
  assert.match(
    headerIntro[0],
    /class="util-learning-header__duration">60 mins\.<\/span>/
  );
  assert.doesNotMatch(html, /class="util-badge util-badge-time"/);
});

test("no timing is invented when neither activity nor Learning Sequence timing exists", () => {
  const { api } = loadPrismTestApi();
  const page = stripActivityDurations(loadHeteroscedasticityPage());
  if (page.learning_sequence) {
    delete page.learning_sequence.total_duration_minutes;
    (page.learning_sequence.timeline || []).forEach((entry) => {
      delete entry.duration_minutes;
    });
  }
  const html = renderVnextExport(api, page);
  const headerIntro = html.match(/<div class="util-learning-header__intro">[\s\S]*?<\/div>/);
  assert.ok(headerIntro);
  assert.doesNotMatch(headerIntro[0], /util-learning-header__duration/);
  assert.doesNotMatch(headerIntro[0], /\d+\s*mins?\./i);
  assert.doesNotMatch(html, /class="util-badge util-badge-time"/);
});
