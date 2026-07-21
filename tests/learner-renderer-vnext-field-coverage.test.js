"use strict";

/**
 * Sprint 67 — learner-facing field coverage and beat-level instruction rendering.
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

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
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
  sandbox.document = documentStub;
  sandbox.window = windowStubFrom(documentStub, sandbox);
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  injectLearnerRendererVNextInSandbox(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function windowStubFrom(documentStub, sandbox) {
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
  windowStub.window = windowStub;
  sandbox.window = windowStub;
  return windowStub;
}

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function renderVnextExport(api) {
  const result = api.renderLearnerPageForTest(loadFixture(), {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

function renderLegacyExport(api) {
  const result = api.renderLearnerPageForTest(loadFixture(), {
    rendererVersion: "legacy",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

function extractActivityHtml(html, activityId) {
  const start = html.indexOf(`data-activity-id="${activityId}"`);
  assert.ok(start >= 0, `missing activity ${activityId}`);
  const nextIds = ["A1", "A2", "A3", "A4", "A5"].filter((id) => id !== activityId);
  const nextStart = nextIds
    .map((id) => html.indexOf(`data-activity-id="${id}"`))
    .filter((position) => position > start)
    .sort((left, right) => left - right)[0];
  return nextStart >= 0 ? html.slice(start, nextStart) : html.slice(start);
}

function beatStream(html, beatFunction) {
  const marker = `data-beat-function="${beatFunction}"`;
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = html.lastIndexOf('<section class="util-beat-section"', start);
  const nextBeat = html.indexOf('<section class="util-beat-section"', start + marker.length);
  return html.slice(sectionStart, nextBeat >= 0 ? nextBeat : html.length);
}

test("field coverage: all learning outcomes rendered", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.match(html, /Learning outcomes/);
  assert.match(html, /LO1/);
  assert.match(html, /LO5/);
  assert.match(html, /heteroscedasticity and distinguish it from homoscedasticity/i);
});

test("field coverage: each activity appears in journey navigation", () => {
  const html = renderVnextExport(loadPrismTestApi());
  ["A1", "A2", "A3", "A4", "A5"].forEach((activityId) => {
    assert.match(html, new RegExp(`href="#activity-${activityId}"`));
  });
  assert.doesNotMatch(html, /href="#journey-activities"/);
});

test("field coverage: learner-task instructions render exactly once", () => {
  const { buildPageModel } = require("../lib/learner-renderer-vnext");
  const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
  const modelResult = buildPageModel(loadFixture());
  assert.equal(modelResult.ok, true);
  const html = renderPage(modelResult.model);

  modelResult.model.activities.forEach((activity) => {
    const activityHtml = extractActivityHtml(html, activity.id);
    activity.beats.forEach((beat) => {
      beat.instructions.forEach((instruction) => {
        const marker = `data-source-step-number="${instruction.sourceStepNumber}"`;
        const matches = activityHtml.match(new RegExp(marker, "g")) || [];
        assert.equal(
          matches.length,
          1,
          `${activity.id} step ${instruction.sourceStepNumber} must appear once`
        );
      });
    });
  });
});

test("field coverage: instructions appear before their paired material in check beat", () => {
  const { buildPageModel } = require("../lib/learner-renderer-vnext");
  const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
  const modelResult = buildPageModel(loadFixture());
  const html = renderPage(modelResult.model);
  const a1 = extractActivityHtml(html, "A1");
  const checkBeat = beatStream(a1, "check_understanding");
  assert.ok(checkBeat);

  const pairs = [
    { step: "2", material: "A1-M2" },
    { step: "3", material: "A1-M3" },
    { step: "4", material: "A1-M4" }
  ];
  pairs.forEach(({ step, material }) => {
    const stepPos = checkBeat.indexOf(`data-source-step-number="${step}"`);
    const materialPos = checkBeat.indexOf(`data-material-id="${material}"`);
    assert.ok(stepPos >= 0 && materialPos >= 0);
    assert.ok(stepPos < materialPos, `Step ${step} must precede ${material}`);
  });

  const step5 = checkBeat.indexOf('data-source-step-number="5"');
  const expected = checkBeat.indexOf("util-expected-output");
  assert.ok(step5 >= 0 && expected >= 0);
  assert.ok(step5 < expected, "Final instruction must precede expected output");
});

test("field coverage: pedagogical prompt labels and semantic types retained", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.match(html, /How would you explain to a fellow economics student/);
  assert.match(html, /data-source-field="self_explanation_prompt"/);
  assert.match(html, /Focus on the spread of errors/);
  assert.match(html, /data-source-field="reasoning_orientation"/);
});

test("field coverage: sequence progression guidance rendered", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.match(html, /How this lesson progresses/);
  assert.match(html, /Conceptual foundations precede interpretation/i);
});

test("field coverage: assessment feedback available", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.match(html, /util-assessment-feedback/);
  assert.match(html, /Check answer/);
  assert.match(html, /Correct answer:/);
  assert.match(html, /changing residual variance/i);
});

test("field coverage: transfer prompt appears once in Activity 3 Check moment", () => {
  const html = renderVnextExport(loadPrismTestApi());
  const a3 = extractActivityHtml(html, "A3");
  const checkStart = a3.indexOf('data-composition-moment="check"');
  const checkHtml = checkStart >= 0 ? a3.slice(checkStart) : "";
  assert.equal((checkHtml.match(/data-source-field="transfer_or_application_task"/g) || []).length, 1);
  assert.equal((a3.match(/Identify another economic variable pair/gi) || []).length, 1);
});

test("field coverage: duplicate orientation headings removed", () => {
  const { buildPageModel } = require("../lib/learner-renderer-vnext");
  const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
  const modelResult = buildPageModel(loadFixture());
  const html = renderPage(modelResult.model);
  const orient = html.slice(html.indexOf('data-region="orientation"'));
  const overviewSection = orient.slice(
    orient.indexOf('data-orientation-type="overview"'),
    orient.indexOf('data-orientation-type="learning_purpose"')
  );
  assert.equal((overviewSection.match(/>\s*Overview\s*</gi) || []).length, 1);
});

test("field coverage: study tips duplicate heading removed", () => {
  const html = renderVnextExport(loadPrismTestApi());
  const tips = html.slice(html.indexOf('data-region="study-tips"'));
  assert.equal((tips.match(/>\s*Study tips\s*</gi) || []).length, 1);
});

test("field coverage: prose-width CSS included in export shell", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.match(html, /--learner-reading-width:70ch/);
  assert.match(html, /\.util-prose-measure\{max-width:var\(--learner-reading-width\)/);
});

test("field coverage: orientation beat suppression is deterministic by beat-owned content", () => {
  const { buildPageModel } = require("../lib/learner-renderer-vnext");
  const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
  const modelResult = buildPageModel(loadFixture());
  const html = renderPage(modelResult.model);

  const a1 = extractActivityHtml(html, "A1");
  const a2 = extractActivityHtml(html, "A2");
  const a3 = extractActivityHtml(html, "A3");
  const a4 = extractActivityHtml(html, "A4");

  assert.match(a1, /data-beat-function="orientation"/);
  assert.match(a2, /data-beat-function="orientation"/);
  assert.doesNotMatch(a3, /data-beat-function="orientation"/);
  assert.doesNotMatch(a4, /data-beat-function="orientation"/);

  assert.doesNotMatch(html, /<section class="util-beat-section"[^>]*>\s*<h3 class="util-beat-heading"[^>]*>\s*<\/h3>/);
});

test("field coverage: all 24 material wrappers remain present", () => {
  const html = renderVnextExport(loadPrismTestApi());
  const materialIds = [...html.matchAll(/data-material-id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(materialIds).size, 24);
  assert.ok(materialIds.length >= 24, "table workspaces may repeat reference material wrappers");
});

test("field coverage: all five assessment items remain present", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.equal((html.match(/util-assessment-item--formative/g) || []).length, 5);
});

test("field coverage: mapped learning outcomes shown at activity level", () => {
  const html = renderVnextExport(loadPrismTestApi());
  assert.match(extractActivityHtml(html, "A1"), /Supports LO1/);
});

test("field coverage: vNext marker retained and legacy unchanged", () => {
  const api = loadPrismTestApi();
  const vnext = renderVnextExport(api);
  const legacy = renderLegacyExport(api);
  assert.match(vnext, /data-renderer="vnext"/);
  assert.doesNotMatch(legacy, /data-renderer="vnext"/);
  assert.doesNotMatch(legacy, /util-vnext-activity/);
});
