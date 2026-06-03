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
  assert.doesNotMatch(html, /util-worksheet-blank[^>]*>_{3,}/);
});

test("utilityRenderMarkdownBlock: table cells with blanks render safe blanks", () => {
  const md = "| Year | CPI |\n| --- | --- |\n| 2021 | _____ |";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.doesNotMatch(html, /@@PRISMBLANK/i);
  assert.match(html, /util-worksheet-blank/);
  assert.doesNotMatch(html, /<td>[\s\S]*util-worksheet-blank[\s\S]*_{4,}/i);
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
  assert.equal(policy.allowLearnerIntellectualSupports, true);
});

test("utilityClassifyLearnerWorkshopMaterialRole: learner-supportive vs facilitator-only", () => {
  const classify = api.utilityClassifyLearnerWorkshopMaterialRoleForTest;
  assert.equal(classify("template", "| Year | CPI |"), "learner_supportive");
  assert.equal(classify("task_cards", []), "learner_supportive");
  assert.equal(classify("worked_example", "**Step 1:**"), "learner_supportive");
  assert.equal(classify("sample_output", "Rate = 5%"), "answer_revealing");
  assert.equal(classify("M2_sample_output", "checking"), "answer_revealing");
  assert.equal(classify("facilitator_notes", "Circulate"), "facilitator_only");
  assert.equal(
    classify("content", "### Sample Answer\n\nInflation = 5%"),
    "answer_revealing"
  );
});

test("utilityShouldSuppressLearnerWorkshopMaterial: templates allowed, answers blocked", () => {
  const shouldSuppress = api.utilityShouldSuppressLearnerWorkshopMaterialForTest;
  const workshopOpts = { suppressFacilitatorMaterials: true };
  assert.equal(shouldSuppress("template", "Fill the row.", workshopOpts), false);
  assert.equal(shouldSuppress("analysis_template", "## Table", workshopOpts), false);
  assert.equal(shouldSuppress("sample_output", "5%", workshopOpts), true);
  assert.equal(shouldSuppress("answer_key", "A1: B", workshopOpts), true);
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

test("learner workshop page: Sprint 37 intellectual supports render, spoilers hidden", () => {
  const page = {
    artifact_type: "page",
    title: "Inflation workshop — intellectual supports",
    page_profile: "learner",
    constraints_applied: {
      delivery_mode: "live_workshop",
      learning_environments: ["classroom"]
    },
    sections: [
      {
        section_id: "overview",
        heading: "Overview",
        content:
          "You will distinguish price level changes from one-off shocks, then compare measures."
      },
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Define inflation",
            activity_preamble:
              "This step establishes a working definition you will reuse when comparing measures.",
            intellectual_coherence_bridge:
              "You carry forward the definition move; the next step tests it against CPI and GDP deflator.",
            uncertainty_tension_prompt:
              "It is easy to treat any price rise as inflation — decide what counts as a general rise.",
            reasoning_orientation:
              "Compare measures by what each includes, not by which headline number sounds larger.",
            learner_task: "Write a one-sentence definition of inflation.",
            support_note: "Check your thinking: a single sale is not inflation.",
            materials: {
              template:
                "Write a one-sentence definition of inflation.\n\n- ________\n- ________",
              sample_output: "### Sample Answer\n\nInflation is a general rise in prices.",
              worked_example: "**Step 1:** Identify the base-year price level."
            }
          }
        ]
      },
      {
        section_id: "study_tips",
        heading: "Study tips",
        content:
          "- Name the distinction you can now judge reliably.\n- Where else would comparing price indexes matter?"
      }
    ]
  };
  const r = api.buildUtilityStructuredHtmlForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /util-activity-preamble/);
  assert.match(html, /Connection to previous activity/i);
  assert.match(html, /How to think/i);
  assert.match(html, /util-cognition--uncertainty/);
  assert.match(html, /util-response-lines/);
  assert.match(html, /util-worked-example/i);
  assert.match(html, /Study tips/i);
  assert.match(html, /distinction you can now judge/i);
  assert.doesNotMatch(html, /Sample Answer/i);
  assert.doesNotMatch(html, /Facilitator checking/i);
});

test("sanitizeSelfDirectedLearnerPageActivityRows: preserves framing on learner workshop pages", () => {
  const page = {
    page_profile: "learner",
    constraints_applied: {
      delivery_mode: "live_workshop",
      learning_environments: ["classroom"]
    },
    sections: [
      {
        section_id: "learning_activities",
        content: [
          {
            activity_id: "A1",
            activity_preamble: "Orienting preamble for the workshop step.",
            facilitator_moves: "Ask pairs to report back.",
            reasoning_orientation: "Compare by coverage, not headline size."
          }
        ]
      }
    ]
  };
  const result = api.sanitizeSelfDirectedLearnerPageActivityRowsForTest(page, {
    pageProfile: "learner"
  });
  assert.equal(result.sanitized, false);
  assert.equal(result.page.sections[0].content[0].activity_preamble, "Orienting preamble for the workshop step.");
  assert.equal(
    result.page.sections[0].content[0].reasoning_orientation,
    "Compare by coverage, not headline size."
  );
  assert.equal(result.page.sections[0].content[0].facilitator_moves, "Ask pairs to report back.");
});
