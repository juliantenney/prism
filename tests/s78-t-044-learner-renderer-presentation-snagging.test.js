"use strict";

/**
 * S78-T-044 — Final learner-renderer presentation snagging.
 * A: guided-review look-for A/B keys without browser list markers.
 * B: Orient→A1 separator CSS (same convention as activity+activity).
 * D: workshop grouping badge live path when grouping is populated.
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
const owenFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
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

function extractLookForSection(htmlText) {
  const match = htmlText.match(
    /<div class="util-guided-review__look-for">[\s\S]*?<\/div>\s*(?=<div class="util-guided-review__missing">)/
  );
  return match ? match[0] : "";
}

/** Guided checklist requires ≥2 criteria (parseGuidedChecklist MIN_GUIDED_CRITERIA). */
function guidedPayloadWithFeatures() {
  return {
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you identified both choice variables?",
        why_it_matters: "Separate identification is required for a well-posed problem.",
        features: [
          {
            expected: "Both choice variables are identified separately.",
            repair: "Name each choice variable on its own."
          },
          {
            expected: "Each variable is connected to the economic quantity it represents.",
            repair: "Link each variable to the quantity it stands for."
          }
        ],
        confirmation_label: "My response now meets this criterion"
      },
      {
        statement: "Have you avoided collapsing the two variables?",
        why_it_matters: "Collapsed variables hide the constrained optimisation structure.",
        features: [
          {
            expected: "The two choice variables remain distinct throughout the response.",
            repair: "Keep each variable named separately in the formulation."
          }
        ],
        confirmation_label: "My response now meets this criterion"
      }
    ]
  };
}

function pageWithGuidedReviewFeatures() {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  const checklist = page.activities[0].materials.find((row) => row.material_id === "A1-M4");
  checklist.body = guidedPayloadWithFeatures();
  return page;
}

function pageWithWorkshopGrouping(grouping) {
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  page.activities[0].grouping = grouping;
  return page;
}

test("live vNext export CSS: guided-review look-for suppresses list markers", () => {
  const { api } = loadPrismTestApi();
  const htmlText = renderVnextExport(api, pageWithGuidedReviewFeatures());
  assert.match(
    htmlText,
    /\.util-learner-renderer-vnext \.util-guided-review__look-for ul\{list-style:none;padding-left:0;margin-left:0\}/
  );
  // Ordinary vNext lists retain default marker padding.
  assert.match(
    htmlText,
    /\.util-learner-renderer-vnext ul,\.util-learner-renderer-vnext ol\{margin:0 0 var\(--learner-space-3\);padding-left:1\.25rem\}/
  );
});

test("live vNext export: guided-review look-for has A/B keys without ol or numeric prefixes", () => {
  const { api } = loadPrismTestApi();
  const htmlText = renderVnextExport(api, pageWithGuidedReviewFeatures());
  const lookFor = extractLookForSection(htmlText);
  assert.ok(lookFor, "expected look-for section");
  assert.match(lookFor, /util-guided-review__feature-key">A\./);
  assert.match(lookFor, /util-guided-review__feature-key">B\./);
  assert.match(lookFor, /<ul>/);
  assert.doesNotMatch(lookFor, /<ol\b/);
  assert.doesNotMatch(lookFor, />\s*1\.\s*A\./);
  assert.doesNotMatch(htmlText, /1\.\s*<span class="util-guided-review__feature-key">A\./);
});

test("live vNext export CSS: Orient→A1 uses same border convention as activity siblings", () => {
  const { api } = loadPrismTestApi();
  const htmlText = renderVnextExport(api, pageWithGuidedReviewFeatures());
  assert.match(
    htmlText,
    /\.util-learner-renderer-vnext \.util-activity\+\.util-activity\{margin-top:4rem;padding-top:3rem;border-top:1px solid #e5e7eb\}/
  );
  assert.match(
    htmlText,
    /\.util-learner-renderer-vnext \.util-page-orientation\+\.util-learning-activities>\.util-activity:first-child\{margin-top:4rem;padding-top:3rem;border-top:1px solid #e5e7eb\}/
  );
  assert.match(htmlText, /class="util-page-orientation"/);
  assert.match(htmlText, /class="util-learning-activities"/);
  assert.match(htmlText, /data-activity-id="A1"/);
});

test("live vNext export: workshop grouping tokens render as grouping badges", () => {
  const { api } = loadPrismTestApi();
  const smallGroupHtml = renderVnextExport(api, pageWithWorkshopGrouping("small_group"));
  assert.match(smallGroupHtml, /class="util-badge util-badge-group">small_group</);
  const pairHtml = renderVnextExport(api, pageWithWorkshopGrouping("pair"));
  assert.match(pairHtml, /class="util-badge util-badge-group">pair</);
  const pairsHtml = renderVnextExport(api, pageWithWorkshopGrouping("pairs"));
  assert.match(pairsHtml, /class="util-badge util-badge-group">pairs</);
});

test("empty grouping does not render a grouping badge element", () => {
  const { api } = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(owenFixturePath, "utf8"));
  page.activities[0].grouping = "";
  const htmlText = renderVnextExport(api, page);
  assert.doesNotMatch(htmlText, /class="util-badge util-badge-group"/);
  assert.doesNotMatch(htmlText, /class="util-badge util-badge-group">Individual</i);
});
