"use strict";

/**
 * S78-T-039 — Guided-review "What to look for" feature-list enumeration fix.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const html = require("../lib/learner-renderer-vnext/render-html-utils");
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

function guidedPayloadWithFeatures() {
  return {
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you described how each genome type produces mRNA?",
        why_it_matters: "Genome-to-mRNA mapping is the core discrimination in this task.",
        features: [
          {
            expected: "Alpha feature: each genome type is linked to an mRNA production route",
            repair: "Add one sentence per genome type naming how mRNA is produced."
          },
          {
            expected: "Beta feature: positive-sense, negative-sense, and dsRNA are treated distinctly",
            repair: "Separate the three routes instead of collapsing them into one process."
          },
          {
            expected: "Gamma feature: at least one explicit contrast between genome types",
            repair: "Add a contrast sentence that names how two genome types differ in mRNA production."
          }
        ],
        confirmation_label: "My response now meets this criterion"
      },
      {
        statement: "Have you avoided treating all RNA genomes as interchangeable?",
        why_it_matters: "Interchangeable treatment hides the diagnostic differences learners must use.",
        features: [
          {
            expected: "Delta feature: at least one explicit contrast between genome types",
            repair: "Add a contrast sentence that names how two genome types differ in mRNA production."
          }
        ],
        confirmation_label: "My response now meets this criterion"
      }
    ]
  };
}

function guidedMaterial(payload) {
  return parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M4",
      material_type: "checklist",
      title: "Response quality review",
      body_format: "json",
      body: payload
    },
    0
  );
}

function extractLookForSection(htmlText) {
  const match = htmlText.match(
    /<div class="util-guided-review__look-for">[\s\S]*?<\/div>\s*(?=<div class="util-guided-review__missing">)/
  );
  return match ? match[0] : "";
}

function extractMissingSection(htmlText) {
  const match = htmlText.match(
    /<div class="util-guided-review__missing">[\s\S]*?<\/ul>\s*<\/div>/
  );
  return match ? match[0] : "";
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

function pageWithGuidedReviewFeatures() {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const checklist = page.activities[0].materials.find((row) => row.material_id === "A1-M4");
  checklist.body = guidedPayloadWithFeatures();
  return page;
}

test("guided review look-for: renders A/B/C feature keys without ordered-list numbering", () => {
  const htmlText = renderMaterial(guidedMaterial(guidedPayloadWithFeatures()), { activityId: "A1" });
  const lookFor = extractLookForSection(htmlText);
  assert.ok(lookFor, "expected look-for section");
  assert.match(lookFor, /util-guided-review__feature-key">A\./);
  assert.match(lookFor, /util-guided-review__feature-key">B\./);
  assert.match(lookFor, /util-guided-review__feature-key">C\./);
  assert.match(lookFor, /<ul>/);
  assert.doesNotMatch(lookFor, /<ol\b/);
  assert.doesNotMatch(lookFor, />\s*1\.\s*A\./);
  assert.doesNotMatch(lookFor, />\s*2\.\s*B\./);
  assert.doesNotMatch(htmlText, /1\.\s*<span class="util-guided-review__feature-key">A\./);
});

test("guided review look-for: preserves feature order", () => {
  const htmlText = renderMaterial(guidedMaterial(guidedPayloadWithFeatures()), { activityId: "A1" });
  const lookFor = extractLookForSection(htmlText);
  const alphaPos = lookFor.indexOf("Alpha feature:");
  const betaPos = lookFor.indexOf("Beta feature:");
  const gammaPos = lookFor.indexOf("Gamma feature:");
  assert.ok(alphaPos >= 0 && betaPos > alphaPos && gammaPos > betaPos);
});

test("guided review missing guidance: Missing A/B repair labels unchanged", () => {
  const htmlText = renderMaterial(guidedMaterial(guidedPayloadWithFeatures()), { activityId: "A1" });
  const missing = extractMissingSection(htmlText);
  assert.ok(missing, "expected missing section");
  assert.match(missing, /util-guided-review__feature-key">Missing A:/);
  assert.match(missing, /util-guided-review__feature-key">Missing B:/);
  assert.match(missing, /util-guided-review__feature-key">Missing C:/);
  assert.match(missing, /<ul>/);
});

test("ordinary markdown ordered lists still render as ordered lists", () => {
  const block = html.renderMarkdownBlock("1. First ordered item\n2. Second ordered item");
  assert.match(block, /<ol>/);
  assert.match(block, /First ordered item/);
  assert.match(block, /Second ordered item/);
});

test("live vNext export: guided-review look-for uses A/B keys without numeric prefixes", () => {
  const { api } = loadPrismTestApi();
  const htmlText = renderVnextExport(api, pageWithGuidedReviewFeatures());
  assert.match(htmlText, /data-guided-review="true"/);
  const lookFor = extractLookForSection(htmlText);
  assert.ok(lookFor, "expected look-for section in export HTML");
  assert.match(lookFor, /util-guided-review__feature-key">A\./);
  assert.match(lookFor, /util-guided-review__feature-key">B\./);
  assert.match(lookFor, /util-guided-review__feature-key">C\./);
  assert.match(lookFor, /<ul>/);
  assert.doesNotMatch(lookFor, /<ol\b/);
  assert.doesNotMatch(htmlText, /1\.\s*<span class="util-guided-review__feature-key">A\./);
  assert.match(extractMissingSection(htmlText), /Missing A:/);
});
