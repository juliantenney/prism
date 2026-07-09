/**
 * Sprint 58 Phase 3A — partial prompt contracts and no-upstream-injection tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

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
    getAttribute() { return null; },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js",
      "lib/ld-gam-page-enrich-contract.js",
      "lib/ld-gai-page-enrich-contract.js",
      "lib/page-gam-enrich.js",
      "lib/page-vnext-assemble.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildWorkflow(partialPageOutputs) {
  return {
    id: partialPageOutputs ? "wf-partial-injection-off" : "wf-legacy-injection-on",
    pageEnrichmentV2: true,
    partialPageOutputs: !!partialPageOutputs,
    steps: [
      { id: "ep_step", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities",
        override_prompt_body: "Populate DLA-owned instructional fields as JSON.",
        inputBindings: [{ kind: "internal", sourceStepId: "ep_step", artifactName: "page" }]
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials",
        override_prompt_body: "Populate GAM materials for each activity.",
        inputBindings: [{ kind: "internal", sourceStepId: "dla_step", artifactName: "page" }]
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence",
        override_prompt_body: "Produce sequence metadata JSON.",
        inputBindings: [{ kind: "internal", sourceStepId: "gam_step", artifactName: "page" }]
      },
      {
        id: "da_step",
        title: "Design Assessment",
        outputName: "page",
        canonical_step_id: "step_design_assessment",
        override_prompt_body: "Generate assessment blueprint payload.",
        inputBindings: [{ kind: "internal", sourceStepId: "ls_step", artifactName: "page" }]
      },
      {
        id: "gai_step",
        title: "Generate Assessment Items",
        outputName: "page",
        canonical_step_id: "step_generate_assessment_items",
        override_prompt_body: "Generate assessment_check payload.",
        inputBindings: [{ kind: "internal", sourceStepId: "da_step", artifactName: "page" }]
      },
      {
        id: "dp_step",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page",
        override_prompt_body: "Produce page synthesis and sections JSON.",
        inputBindings: [{ kind: "internal", sourceStepId: "gai_step", artifactName: "page" }]
      }
    ]
  };
}

function setup(api, wf) {
  const epShell = loadFixture("ep-shell.json");
  const dlaPartial = loadFixture("dla-partial.json");
  const gamPartial = loadFixture("gam-partial.json");
  const lsPartial = loadFixture("ls-partial.json");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ep_step: JSON.stringify(epShell, null, 2),
    dla_step: JSON.stringify(dlaPartial, null, 2),
    gam_step: JSON.stringify(gamPartial, null, 2),
    ls_step: JSON.stringify(lsPartial, null, 2),
    da_step: JSON.stringify({
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { enriched_by: ["assessment_design"], current_stage: "assessment_design" },
      assessment_blueprint: { total_items: 2 }
    }, null, 2),
    gai_step: JSON.stringify({
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { enriched_by: ["assessment_items"], current_stage: "assessment_items" },
      assessment_check: { items: [{ item_id: "Q1", stem: "Question" }] }
    }, null, 2)
  });
}

test("partial mode prompts use partial contracts and omit upstream JSON bodies", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow(true);
  setup(api, wf);
  const byId = Object.fromEntries(wf.steps.map((s) => [s.id, s]));

  const epInstr = api.buildWorkflowStepInstructions(byId.ep_step, 0, null);
  assert.match(epInstr, /Deterministic step \(Sprint 56F\)/i);
  assert.match(epInstr, /Copilot output contract:/i);
  assert.match(epInstr, /STEP 1 OUTPUT: page/i);

  const dlaInstr = api.buildWorkflowStepInstructions(byId.dla_step, 1, null);
  assert.match(dlaInstr, /DLA partial-page contract/i);
  assert.doesNotMatch(dlaInstr, /### Upstream page shell/i);
  assert.doesNotMatch(dlaInstr, /```json[\s\S]*"title":\s*"Inflation/i);
  assert.match(dlaInstr, /Input artefacts for this step/i);
  assert.match(dlaInstr, /binding bodies are intentionally omitted/i);

  const gamInstr = api.buildWorkflowStepInstructions(byId.gam_step, 2, null);
  assert.match(gamInstr, /GAM partial-page contract/i);
  assert.doesNotMatch(gamInstr, /### Upstream DLA page/i);
  assert.doesNotMatch(gamInstr, /```json[\s\S]*learner_task/i);

  const lsInstr = api.buildWorkflowStepInstructions(byId.ls_step, 3, null);
  assert.match(lsInstr, /partial page artefact only/i);
  assert.match(lsInstr, /assembly_state\.current_stage "learning_sequence"/i);
  assert.doesNotMatch(lsInstr, /### Upstream GAM page/i);
  assert.doesNotMatch(lsInstr, /```json[\s\S]*"materials"/i);

  const dpInstr = api.buildWorkflowStepInstructions(byId.dp_step, 4, null);
  assert.match(dpInstr, /partial page artefact only/i);
  assert.match(dpInstr, /assembly_state\.current_stage "design_page"/i);
  assert.doesNotMatch(dpInstr, /### Upstream Learning Sequence page/i);
  assert.doesNotMatch(dpInstr, /```json[\s\S]*"learning_sequence"/i);

  const daInstr = api.buildWorkflowStepInstructions(byId.da_step, 4, null);
  assert.match(daInstr, /Design Assessment partial output mode/i);
  assert.match(daInstr, /binding bodies are intentionally omitted/i);
  assert.doesNotMatch(daInstr, /```json[\s\S]*"activities"/i);

  const gaiInstr = api.buildWorkflowStepInstructions(byId.gai_step, 5, null);
  assert.match(gaiInstr, /Generate Assessment Items output mode/i);
  assert.match(gaiInstr, /GAI partial-page contract/i);
  assert.match(gaiInstr, /assessment_check/i);
  assert.match(gaiInstr, /Do not emit standalone assessment_items JSON/i);
  assert.match(gaiInstr, /Conflict override: if any inherited pack text says to output standalone assessment_items/i);
  assert.match(gaiInstr, /binding bodies are intentionally omitted/i);
  assert.doesNotMatch(gaiInstr, /```json[\s\S]*"assessment_blueprint"/i);
  assert.doesNotMatch(gaiInstr, /Return a JSON object containing:\s*\n\s*-\s*items:/i);
});

test("legacy mode keeps upstream injection behaviour", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkflow(false);
  setup(api, wf);
  const byId = Object.fromEntries(wf.steps.map((s) => [s.id, s]));

  const dlaInstr = api.buildWorkflowStepInstructions(byId.dla_step, 1, null);
  assert.match(dlaInstr, /### Upstream page shell/i);

  const gamInstr = api.buildWorkflowStepInstructions(byId.gam_step, 2, null);
  assert.match(gamInstr, /### Upstream DLA page/i);

  const lsInstr = api.buildWorkflowStepInstructions(byId.ls_step, 3, null);
  assert.match(lsInstr, /### Upstream GAM page/i);

  const dpInstr = api.buildWorkflowStepInstructions(byId.dp_step, 4, null);
  assert.match(dpInstr, /### Upstream Learning Sequence page/i);

  const daInstr = api.buildWorkflowStepInstructions(byId.da_step, 4, null);
  assert.doesNotMatch(daInstr, /partial output mode/i);

  const gaiInstr = api.buildWorkflowStepInstructions(byId.gai_step, 5, null);
  assert.match(gaiInstr, /Generate Assessment Items output mode/i);
});
