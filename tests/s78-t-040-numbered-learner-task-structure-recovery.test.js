"use strict";

/**
 * S78-T-040 — Numbered learner-task structure recovery.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { parseLearnerTask } = require("../lib/learner-renderer-vnext/parse-learner-task");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const owenFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);

const OPERATOR_SINGLE_LINE_TASK =
  "1. Inspect each supplied economic optimisation case. 2. Identify the objective, choice variables, and any equality constraint in each case. 3. Classify each case as constrained or unconstrained and justify the classification.";

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
    createElement: () => ({
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
    }),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, documentStub.createElement());
      return elementStore.get(id);
    },
    querySelector: () => documentStub.createElement(),
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

function renderVnextExport(api, fixture) {
  const result = api.renderLearnerPageForTest(fixture, {
    rendererVersion: "vnext",
    applyCompositionValidation: false
  });
  assert.ok(result && !result.error, result && result.error);
  return String(result.html || "");
}

function pageWithSingleLineNumberedTask(taskText) {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  page.activities[0].learner_task = taskText;
  return page;
}

function instructionTexts(html) {
  const blocks = html.match(/class="util-beat-instruction[\s\S]*?<\/div>/g) || [];
  return blocks.map((block) =>
    block
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

test("operator-shaped single-line numbered task parses as three steps", () => {
  const steps = parseLearnerTask(OPERATOR_SINGLE_LINE_TASK);
  assert.equal(steps.length, 3);
  assert.equal(steps[0].sourceStepNumber, 1);
  assert.match(steps[0].text, /^Inspect each supplied economic optimisation case\./);
  assert.equal(steps[1].sourceStepNumber, 2);
  assert.match(steps[1].text, /^Identify the objective, choice variables/);
  assert.equal(steps[2].sourceStepNumber, 3);
  assert.match(steps[2].text, /^Classify each case as constrained or unconstrained/);
  assert.doesNotMatch(steps[0].text, /\b2\.\s+Identify/);
  assert.doesNotMatch(steps[0].text, /\b3\.\s+Classify/);
});

test("parenthesis markers on a single line parse as three steps", () => {
  const steps = parseLearnerTask(
    "1) Inspect each supplied economic optimisation case. 2) Identify the objective. 3) Classify each case."
  );
  assert.equal(steps.length, 3);
  assert.match(steps[0].text, /^Inspect each supplied economic optimisation case\./);
  assert.match(steps[1].text, /^Identify the objective\./);
  assert.match(steps[2].text, /^Classify each case\./);
});

test("newline-separated numbered tasks remain unchanged", () => {
  const steps = parseLearnerTask(
    "1. Study the text.\n2. Then write a paragraph.\n3. Finally, apply the model."
  );
  assert.equal(steps.length, 3);
  assert.match(steps[1].text, /^Then write/);
  assert.match(steps[2].text, /^Finally/);
});

test("unnumbered Then/Finally sequential tasks remain unchanged", () => {
  const steps = parseLearnerTask(
    "Study the explanatory material and worked example. Then write a short paragraph. Finally, apply the model to Wilfred Owen."
  );
  assert.equal(steps.length, 3);
  assert.match(steps[0].text, /^Study the explanatory material/);
  assert.match(steps[1].text, /^Write a short paragraph\./);
  assert.match(steps[2].text, /^Apply the model to Wilfred Owen\./);
});

test("false positives: decimals, versions, and ordinary numeric prose stay unsplit", () => {
  assert.equal(parseLearnerTask("The growth rate is 2.5 percent per year.").length, 1);
  assert.equal(parseLearnerTask("Use version 2.0 of the dataset for calibration.").length, 1);
  assert.equal(parseLearnerTask("There are 3 items in the set and 4 in the other.").length, 1);
  assert.equal(parseLearnerTask("Refer to equation 2. For the next step, derive the result.").length, 1);
});

test("false positive: non-sequential single-line markers stay one step", () => {
  const steps = parseLearnerTask("1. Inspect each case. 4. Classify each case.");
  assert.equal(steps.length, 1);
  assert.match(steps[0].text, /4\. Classify each case\./);
});

test("non-sequential newline-separated markers keep line-start behaviour", () => {
  const steps = parseLearnerTask("1. First step.\n4. Fourth step.");
  assert.equal(steps.length, 2);
  assert.equal(steps[0].sourceStepNumber, 1);
  assert.equal(steps[1].sourceStepNumber, 4);
});

test("live vNext export renders recovered single-line steps separately", () => {
  const { api } = loadPrismTestApi();
  const html = renderVnextExport(api, pageWithSingleLineNumberedTask(OPERATOR_SINGLE_LINE_TASK));
  const instructions = instructionTexts(html);
  assert.ok(instructions.length >= 3, "expected at least three instruction blocks");
  assert.ok(
    instructions.some((text) => /Inspect each supplied economic optimisation case/i.test(text)),
    "step 1 instruction present"
  );
  assert.ok(
    instructions.some((text) => /Identify the objective, choice variables/i.test(text)),
    "step 2 instruction present"
  );
  assert.ok(
    instructions.some((text) => /Classify each case as constrained or unconstrained/i.test(text)),
    "step 3 instruction present"
  );
  const firstInstruction = instructions.find((text) =>
    /Inspect each supplied economic optimisation case/i.test(text)
  );
  assert.ok(firstInstruction, "missing first instruction");
  assert.doesNotMatch(firstInstruction, /\b2\.\s+Identify/);
  assert.doesNotMatch(firstInstruction, /\b3\.\s+Classify/);
});
