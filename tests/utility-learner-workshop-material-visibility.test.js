/**
 * Learner workshop pages: internal token sanitisation and facilitator-material visibility.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const workshopVisibilityFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-learner-visibility-page.json"
);
const marxWorkedExampleFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "confidence-interval-a2-multitable-page.json"
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function renderPageFixture(api, fixturePath) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return { html: String(r.html || ""), parsed };
}

const api = loadPrismTestApi();

test("utilityRenderMarkdownInline: worksheet blanks never leak @@PRISMBLANK tokens", () => {
  const html = api.utilityRenderMarkdownInlineForTest("Your answer: _____");
  assert.doesNotMatch(html, /@@PRISMBLANK/i);
  assert.match(html, /util-worksheet-blank/);
  assert.match(html, /_____/);
});

test("utilityRenderMarkdownBlock: table cells with blanks render safe blanks", () => {
  const md = "| Year | CPI |\n| --- | --- |\n| 2021 | _____ |";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.doesNotMatch(html, /@@PRISMBLANK/i);
  assert.match(html, /util-worksheet-blank|_____/);
});

test("utilitySanitizeLeakedInternalRenderTokens: strips leaked internal placeholders", () => {
  const cleaned = api.utilitySanitizeLeakedInternalRenderTokensForTest(
    "<p>Rate @@PRISMBLANK0@@</p>"
  );
  assert.doesNotMatch(cleaned, /@@PRISMBLANK/i);
  assert.match(cleaned, /util-worksheet-blank/);
});

test("resolveLearnerWorkshopMaterialVisibilityPolicy: learner classroom workshop suppresses facilitator materials", () => {
  const policy = api.resolveLearnerWorkshopMaterialVisibilityPolicyForTest(
    {
      page_profile: "learner",
      constraints_applied: {
        delivery_mode: "live_workshop",
        learning_environments: ["classroom"]
      }
    },
    {}
  );
  assert.equal(policy.suppressFacilitatorMaterials, true);
  assert.equal(policy.isLearnerWorkshopPage, true);
});

test("resolveLearnerWorkshopMaterialVisibilityPolicy: facilitator profile does not suppress", () => {
  const policy = api.resolveLearnerWorkshopMaterialVisibilityPolicyForTest(
    {
      page_profile: "facilitator",
      constraints_applied: { delivery_mode: "live_workshop" }
    },
    {}
  );
  assert.equal(policy.suppressFacilitatorMaterials, false);
});

test("learner workshop page: hides sample_output and answer_key but keeps worked_example", () => {
  const { html } = renderPageFixture(api, workshopVisibilityFixturePath);
  assert.doesNotMatch(html, /@@PRISMBLANK/i);
  assert.doesNotMatch(html, /Sample Answer/i);
  assert.doesNotMatch(html, /Facilitator checking/i);
  assert.doesNotMatch(html, /answer_key/i);
  assert.match(html, /util-worked-example/i);
  assert.match(html, /Identify the base-year/i);
  assert.match(html, /Your calculation/i);
});

test("async learner page: sample_output materials still render when not workshop-suppressed", () => {
  const page = {
    artifact_type: "page",
    title: "Self-study probe",
    page_profile: "learner",
    constraints_applied: { delivery_mode: "async", learning_environments: ["online"] },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Practice",
            learner_task: "Complete the row.",
            materials: {
              sample_output: "Inflation rate = 5% using the base-year method."
            }
          }
        ]
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /Rate = 5%/i);
  assert.match(html, /Sample output/i);
});

test("self-directed learner page: worked examples still render (CI golden)", () => {
  const { html } = renderPageFixture(api, marxWorkedExampleFixturePath);
  assert.doesNotMatch(html, /@@PRISMBLANK/i);
  assert.match(html, /util-worked-example|Worked example|worked example/i);
});
