/**
 * Sprint 69 Phase 5B — heteroscedasticity positive producer regression.
 *
 * Exact source that failed MIXED_EPISODE_PLAN_VOCABULARY after compatibility
 * removal: tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json
 * (certification corpus / primary golden page fixture).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const vocabulary = require("../lib/episode-plan-v1-vocabulary.js");
const grammar = require("../lib/episode-plan-v1-archetype-grammar.js");
const {
  buildPageModel,
  renderLearnerPageHtml,
  validatePageModel
} = require("../lib/learner-renderer-vnext");
const {
  loadLearnerRendererVNextBrowserInSandbox,
  wireBrowserGlobalThis
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const FIXTURE_REL =
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json";
const fixturePath = path.join(repoRoot, FIXTURE_REL);

const EXPECTED_SEQUENCES = Object.freeze({
  A1: {
    archetype: "understand",
    beats: Object.freeze(["orientation", "explanation", "verification"])
  },
  A2: {
    archetype: "analyse",
    beats: Object.freeze([
      "orientation",
      "worked_thinking",
      "guided_practice",
      "verification"
    ])
  },
  A3: {
    archetype: "apply",
    beats: Object.freeze([
      "orientation",
      "worked_thinking",
      "guided_practice",
      "reflection"
    ])
  },
  A4: {
    archetype: "understand",
    beats: Object.freeze([
      "orientation",
      "explanation",
      "guided_practice",
      "verification"
    ])
  },
  A5: {
    archetype: "evaluate",
    beats: Object.freeze([
      "orientation",
      "worked_judgement",
      "guided_practice",
      "reflection"
    ])
  }
});

const LEGACY_EPISODE_PLAN_VALUES = Object.freeze([
  "check_understanding",
  "analysis",
  "practice",
  "application",
  "comparison",
  "evaluation",
  "worked_example"
]);

function loadPage() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function sequenceOf(activity) {
  const beats =
    activity &&
    activity.episode_plan &&
    Array.isArray(activity.episode_plan.beats)
      ? activity.episode_plan.beats
      : [];
  return beats.map(function (beat) {
    return String((beat && beat.function) || "").trim();
  });
}

function createBrowserSandbox() {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  function el() {
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
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => el(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, el());
      return elementStore.get(id);
    },
    querySelector: () => el(),
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
    Blob: function Blob() {}
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  return sandbox;
}

test("hetero producer emits canonical FunctionEnum for all five activities", () => {
  const page = loadPage();
  assert.equal(page.activities.length, 5);
  page.activities.forEach(function (activity) {
    const expected = EXPECTED_SEQUENCES[activity.activity_id];
    assert.ok(expected, activity.activity_id);
    assert.equal(activity.episode_plan.archetype, expected.archetype);
    assert.deepEqual(sequenceOf(activity), expected.beats.slice());
    sequenceOf(activity).forEach(function (fn) {
      assert.equal(vocabulary.FUNCTION_ENUM_SET[fn], true, fn);
      assert.equal(LEGACY_EPISODE_PLAN_VALUES.includes(fn), false, fn);
    });
  });

  (page.episode_plans || []).forEach(function (row) {
    const expected = EXPECTED_SEQUENCES[row.activity_id];
    assert.deepEqual(sequenceOf(row), expected.beats.slice());
  });
});

test("hetero activities pass shared grammar and canonical-grammar route", () => {
  const page = loadPage();
  page.activities.forEach(function (activity) {
    const seq = sequenceOf(activity);
    const grammarResult = grammar.validateSequenceAgainstGrammar(
      activity.episode_plan.archetype,
      seq
    );
    assert.equal(grammarResult.valid, true, activity.activity_id);
  });

  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors));
  assert.equal(model.diagnostics.archetypeInspection.length, 5);
  model.diagnostics.archetypeInspection.forEach(function (insp) {
    assert.equal(insp.validationRoute, "canonical-grammar");
    assert.equal(insp.runtimeAuthority, "shared-archetype-grammar");
    assert.deepEqual(
      insp.normalizedBeatSequence,
      EXPECTED_SEQUENCES[insp.activityId].beats.slice()
    );
  });
});

test("hetero page-model construction and exactly-once assignment succeed", () => {
  const page = loadPage();
  const built = buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.errors));
  const closure = validatePageModel(page, built.model);
  assert.deepEqual(closure.errors, []);
});

test("hetero Node and browser rendering succeed with matching routes", () => {
  const page = loadPage();
  const node = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(node.error, null);
  assert.ok(node.html && node.html.length > 1000);
  assert.match(node.html, /data-renderer="vnext"/);
  assert.equal(
    node.modelResult.diagnostics.archetypeInspection.every(function (insp) {
      return insp.validationRoute === "canonical-grammar";
    }),
    true
  );

  const sandbox = createBrowserSandbox();
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  const browserApi = sandbox.window.PRISM_LEARNER_RENDERER_VNEXT;
  assert.ok(browserApi && typeof browserApi.renderLearnerPageHtml === "function");
  const browser = browserApi.renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.equal(browser.error, null);
  assert.ok(browser.html && browser.html.length > 1000);
  assert.deepEqual(
    node.modelResult.diagnostics.archetypeInspection.map(function (row) {
      return row.validationRoute + ":" + row.normalizedBeatSequence.join(">");
    }),
    browser.modelResult.diagnostics.archetypeInspection.map(function (row) {
      return row.validationRoute + ":" + row.normalizedBeatSequence.join(">");
    })
  );
});

test("reintroducing legacy Episode Plan values fails closed on hetero source", () => {
  LEGACY_EPISODE_PLAN_VALUES.forEach(function (legacy) {
    const page = loadPage();
    const activity = page.activities[0];
    activity.episode_plan.beats[activity.episode_plan.beats.length - 1] = {
      function: legacy
    };
    const built = buildPageModel(page);
    assert.equal(built.ok, false, legacy);
    assert.ok(
      built.errors.some(function (row) {
        return (
          row.code === "MIXED_EPISODE_PLAN_VOCABULARY" ||
          row.code === "UNKNOWN_EPISODE_PLAN_BEAT"
        );
      }),
      legacy + " errors=" + JSON.stringify(built.errors)
    );
  });
});
