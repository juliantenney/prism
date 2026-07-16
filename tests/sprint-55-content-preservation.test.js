/**
 * Sprint 55 — DLA/GAM content preservation on Design Page compose and render.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-beat-render-page.json");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
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
  const extraLibs = [
    "lib/ld-instructional-manifestation-render.js",
    "lib/page-gam-materials-preserve.js",
    "lib/page-activity-field-preserve.js"
  ];
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat(extraLibs));
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("field preserve: repairs compressed learner_task from upstream DLA", () => {
  const api = loadPrismTestApi();
  const upstream = {
    activities: [
      {
        activity_id: "A1",
        title: "Test",
        learner_task:
          "1. Read the explanatory text carefully.\n2. Study the worked example noting each reasoning step.\n3. Write a brief explanation applying the method.",
        expected_output: "A short written explanation revised using the checklist.",
        activity_preamble:
          "Before you judge whether a framework fits the evidence, you need to understand what it claims and what would count as support or challenge. This activity builds that foundation through guided reading and modelling.",
        reasoning_orientation: "Trace claim, evidence, and implication — not plot summary."
      }
    ]
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Test",
            learner_task: "Read and write.",
            expected_output: "An answer.",
            activity_preamble: "Read the text.",
            reasoning_orientation: "Think carefully."
          }
        ]
      }
    ]
  };
  const result = api.repairLearnerPageCompositionFromUpstream(page, upstream);
  assert.ok(result.framingFieldsMerged >= 3);
  const row = page.sections[0].content[0];
  assert.match(String(row.learner_task), /worked example/i);
  assert.match(String(row.activity_preamble), /foundation through guided reading/i);
  assert.match(String(row.reasoning_orientation), /claim, evidence, and implication/i);
});

test("field closure: flags missing upstream learner fields on composed page", () => {
  const api = loadPrismTestApi();
  const upstream = {
    activities: [
      {
        activity_id: "A1",
        learner_task: "Complete the table.",
        self_explanation_prompt: "Explain your reasoning before checking the model row."
      }
    ]
  };
  const page = {
    artifact_type: "page",
    sections: [
      {
        section_id: "learning_activities",
        content: [{ activity_id: "A1", learner_task: "Complete the table." }]
      }
    ]
  };
  const validation = api.validatePageActivityFieldClosureFromLib(page, upstream);
  assert.equal(validation.outcome, "fail");
  assert.match(validation.messages.join("\n"), /self_explanation_prompt/i);
});

test("renderer: beat-first activity still renders expected_output check section", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const a1 = html.match(
    /Historical Materialism and Capitalism[\s\S]*?(?=Surplus Value and Exploitation|Is Marx Still Relevant|$)/i
  );
  assert.ok(a1, "expected A1 block");
  // Sprint 62: expected_output may be promoted into Success looks like (no trailing Output duplicate).
  assert.match(
    a1[0],
    /util-output-block|util-check-expected-output|util-activity-success-looks-like|revised using the checklist/i
  );
  assert.match(a1[0], /revised using the checklist/i);
});

test("renderer: self_explanation_prompt renders without pre-check co-requisites", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    title: "Field render probe",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [
          {
            activity_id: "A1",
            title: "Probe",
            learner_task: "Write a short answer.",
            self_explanation_prompt:
              "Before you continue, explain in your own words why the distinction matters for your analysis.",
            materials: { text: "### Core idea\n\nExplanatory teaching text for the probe activity." }
          }
        ]
      }
    ]
  };
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /Explain before you check/i);
  assert.match(html, /explain in your own words why the distinction matters/i);
});

test("compose contract: learner_task listed in field preservation ids", () => {
  const block = fs.readFileSync(
    path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"),
    "utf8"
  );
  assert.match(block, /activity_preamble, learner_task,/);
  assert.match(block, /learner_task, expected_output, and support_note/);
});

test("preamble exposition contract: targets 50-120 word orientation prose", () => {
  const block = fs.readFileSync(
    path.join(repoRoot, "lib", "ld-activity-preamble-exposition.js"),
    "utf8"
  );
  assert.match(block, /50–120 words/);
  assert.match(block, /textbook or workbook/i);
});
