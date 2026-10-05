/**
 * Sprint 70 Slice 1D — Design Page prompt smoke (PB-S-007; frozen byte/VA-runtime asserts removed).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractDesignPagePromptFactory(md) {
  const dpSection = md.slice(md.indexOf("## 13. Design Page"));
  const match = dpSection.match(/### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(match, "Design Page prompt factory JSON not found");
  return JSON.parse(match[1].trim());
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, ["lib/ld-design-page-partial-contract.js"]);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function buildPartialDesignPageWorkflow(api) {
  return {
    id: "wf-dp-live-unification",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "dp_step",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

function liveDesignPageInstructions(api, wf) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const step = wf.steps[0];
  return api.buildWorkflowStepInstructions(step, 0, null);
}

const api = loadPrismTestApi();

test("Slice 1D: domain pack declares partial synthesis and visual planning", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.promptTemplate, /PARTIAL PAGE SYNTHESIS/i);
  assert.match(factory.promptTemplate, /visual_affordances/i);
  assert.match(factory.promptTemplate, /LD-DESIGN-PAGE-PARTIAL-CONTRACT/i);
});

test("Slice 1D: Sprint 38 VA authoring block is available from test API", () => {
  const block = api.buildSprint38VisualAffordanceDesignPagePromptBlock();
  assert.match(block, /visual affordance authoring contract/i);
  assert.match(block, /visual_decision/i);
  assert.match(block, /additive page-root metadata only/i);
});

test("Slice 1D: live Copy instructions include Design Page partial mode and synthesis", () => {
  const wf = buildPartialDesignPageWorkflow(api);
  const instr = liveDesignPageInstructions(api, wf);
  assert.match(instr, /Design Page partial output mode/i);
  assert.match(instr, /page_synthesis/i);
  assert.match(instr, /visual_affordances/i);
  assert.doesNotMatch(instr, /omit visual_affordances/i);
});

test("Slice 1D: runtime augmentation applies L7 maths contract on Design Page", () => {
  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Page partial.",
    { canonical_step_id: "step_design_page", title: "Design Page" },
    buildPartialDesignPageWorkflow(api),
    {}
  );
  assert.match(augmented, /LD-MATH-RENDER \(auto-applied\)/i);
});

test("Slice 2A: domain pack requires learner-facing title and orientation hygiene", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.promptTemplate, /learner-facing title/i);
  assert.match(factory.promptTemplate, /Orientation body hygiene|Do not begin those bodies with ## Welcome/i);
});
