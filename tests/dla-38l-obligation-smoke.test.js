/**
 * Sprint 38-L — DLA obligation smoke: prompt surface + fixture/harness artefact shape.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..");
const { validateDla38LObligations } = require(path.join(
  repoRoot,
  "lib",
  "dla-38l-obligation-check.js"
));

const DLA_MARKERS = [
  "IFP-09",
  "IFP-10",
  "DLA-WB-26",
  "DLA-WB-27",
  "DLA-WB-28",
  "DLA-WB-29",
  "DLA-WB-30",
  "DLA-WB-31",
  "transfer_prompt",
  "depth_floor"
];

function loadAugmentedDlaPrompt() {
  const md = fs.readFileSync(
    path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
    "utf8"
  );

  function createElementStub() {
    const el = {
      value: "",
      textContent: "",
      className: "",
      classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
      style: {},
      dataset: {},
      children: [],
      appendChild(child) {
        el.children.push(child);
        return child;
      },
      removeChild() {},
      setAttribute() {},
      removeAttribute() {},
      getAttribute() { return null; },
      addEventListener() {},
      removeEventListener() {},
      focus() {},
      click() {}
    };
    return el;
  }

  const sandbox = { console, setTimeout, clearTimeout, Promise, fetch: globalThis.fetch };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: createElementStub,
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
    addEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: { debounce: (fn) => fn },
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "", revokeObjectURL: () => "" },
    Blob: function Blob() {}
  };
  windowStub.window = windowStub;
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  vm.createContext(sandbox);
  for (const f of [
    "sprint38-visual-affordances.js",
    "ld-table-fidelity.js",
    "ld-materials-copy.js",
    "ld-math-render.js",
    "ld-self-directed-rhetoric.js",
    "ld-design-page-compose-contract.js"
  ]) {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, "lib", f), "utf8"), sandbox, {
      filename: f
    });
  }
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  const api = sandbox.window.__PRISM_TEST_API;

  const cfgIdx = md.indexOf("### Workflow Brief Config");
  const cfgFence = md.indexOf("```json", cfgIdx);
  const cfgClose = md.indexOf("```", cfgFence + 7);
  const wfCfg = JSON.parse(md.slice(cfgFence + 7, cfgClose).trim()).workflowBriefConfig;
  const BRIEF = {
    goal:
      "Learner self-study inflation workshop: CPI, GDP deflator, household budget scenarios (fixed- and variable-income), and household strategy evaluation under inflation.",
    inputs: "First-year undergraduate economics (self-directed study)",
    desiredOutputs: "Learner-facing page",
    selectedDomains: ["learning-design"]
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(wfCfg, BRIEF.goal, BRIEF.inputs);
  const resolved = Object.assign(
    { delivery_context: "self_directed", learning_environments: ["self_study"] },
    api.resolveWorkflowBriefFactors(wfCfg, explicit, {}, inferred, BRIEF).resolved
  );
  const wf = {
    id: "wf-38l-dla-smoke",
    goal: BRIEF.goal,
    inputs: BRIEF.inputs,
    desiredOutputs:
      "learning_content, knowledge_model, learning_outcomes, learning_activities, activity_materials, page",
    workflowOutputs: ["page", "learning_activities", "activity_materials"],
    workflowOutputSpec: { goal: BRIEF.goal, desiredOutputs: BRIEF.desiredOutputs },
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-38l-dla-smoke");

  const sectionIdx = md.indexOf("## 5. Design Learning Activities");
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", sectionIdx));
  const close = md.indexOf("```", fence + 7);
  const factory = JSON.parse(md.slice(fence + 7, close).trim());
  const step = {
    canonical_step_id: "step_design_learning_activities",
    canonical_title: "Design Learning Activities",
    title: "Design Learning Activities",
    outputName: "learning_activities"
  };
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Inflation EV-38L-AFTER",
    step,
    matchedPattern: { promptFactory: factory }
  });
  return api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
}

test("38L DLA augmented prompt surface includes mandatory pack markers", () => {
  const augmented = loadAugmentedDlaPrompt();
  assert.ok(augmented.length > 25000, "expected full pack §5 + runtime augmentations");
  for (const marker of DLA_MARKERS) {
    assert.match(augmented, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(augmented, /PRE-EMIT GATE/i);
});

test("app.js: self-directed DLA example block anti-thin 38L pointer when scaffolds apply", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSrc, /38L mandatory rows not shown in miniature example/);
  assert.match(appSrc, /"type": "checklist"/);
});

test("38L harness DLA user envelope cites IFP-10 and DLA-WB-26..31", () => {
  const harnessPath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs"
  );
  const harness = fs.readFileSync(harnessPath, "utf8");
  assert.match(harness, /IFP-10 emission gates/i);
  assert.match(harness, /DLA-WB-26/i);
  assert.match(harness, /DLA-WB-27/i);
  assert.match(harness, /DLA-WB-28\/31/i);
  assert.match(harness, /transfer_prompt/i);
  assert.match(harness, /PRISM_HARNESS_RESUME_FROM|PRISM_HARNESS_KM_ONLY/);
});

test("EV-38L-AFTER DLA fixture satisfies mandatory 38L obligation rows", () => {
  const fixturePath = path.join(
    repoRoot,
    "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-dla-learning-activities.json"
  );
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = validateDla38LObligations(parsed);
  assert.equal(result.ok, true, result.errors.join("; "));
});

test("thin DLA shell (user-reported failure pattern) fails 38L obligation check", () => {
  const thin = {
    activities: [
      {
        activity_id: "A1",
        required_materials: [
          { material_id: "M1", type: "text", purpose: "exposition", specification: "text" },
          { material_id: "M2", type: "prompt_set", purpose: "retrieval", specification: "prompts" }
        ]
      },
      {
        activity_id: "A2",
        required_materials: [
          { material_id: "M1", type: "text", purpose: "exposition", specification: "text" },
          { material_id: "M2", type: "template", purpose: "practice", specification: "table" }
        ]
      },
      {
        activity_id: "A3",
        required_materials: [
          { material_id: "M1", type: "scenario", purpose: "cases", specification: "cases" },
          { material_id: "M2", type: "template", purpose: "analysis", specification: "table" }
        ]
      },
      {
        activity_id: "A4",
        transfer_or_application_task: "Apply criteria to your household.",
        required_materials: [
          { material_id: "M1", type: "template", purpose: "capstone", specification: "memo" }
        ]
      }
    ]
  };
  const result = validateDla38LObligations(thin);
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => /DLA-WB-26/.test(e)));
  assert.ok(result.errors.some((e) => /transfer_prompt/.test(e)));
});
