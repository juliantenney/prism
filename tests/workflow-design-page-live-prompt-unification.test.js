/**
 * Sprint 70 Slice 1D — live workflow-run Design Page prompt path unification.
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

const VA_MARKER = /Sprint 38 visual affordance authoring contract \(auto-applied\)/i;
const PARTIAL_MARKER = /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i;
const INVENTED_SCHEMA_PATTERNS = [
  /\b"action"\s*:\s*"generate"/i,
  /\b"visual_type"\s*:/i,
  /\bvisual_need\b/i,
  /\brecommendation\b.*visual/i
];
const OMIT_VA_PATTERNS = [
  /omit visual_affordance_schema_version/i,
  /omit visual_affordances/i,
  /do not generate, infer, author, or specify VA rows on Design Page/i
];

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

function buildPartialDesignPageWorkflow(api, stepOverrides) {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Sprint 70 partial Design Page",
    step: {
      title: "Design Page",
      canonical_step_id: "step_design_page",
      inputBindings: []
    },
    matchedPattern: { promptFactory: factory }
  });
  const wf = {
    id: "wf-s70-dp-live",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    goal: "Learner page",
    desiredOutputs: "page",
    steps: [
      { id: "ep", title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan" },
      { id: "dla", title: "Design Learning Activities", outputName: "page", canonical_step_id: "step_design_learning_activities" },
      { id: "gam", title: "Generate Activity Materials", outputName: "page", canonical_step_id: "step_generate_activity_materials" },
      { id: "ls", title: "Construct Learning Sequence", outputName: "page", canonical_step_id: "step_construct_learning_sequence" },
      Object.assign(
        {
          id: "dp",
          title: "Design Page",
          outputName: "page",
          canonical_step_id: "step_design_page",
          override_prompt_body: seeded,
          prompt_source_type: "local_override"
        },
        stepOverrides || {}
      )
    ]
  };
  return api.normalizeWorkflowForV1(wf, []);
}

function promptFactoryDesignPagePrompt(api, wf) {
  const step = wf.steps.find((s) => s.canonical_step_id === "step_design_page");
  const resolved = api.resolveStepPromptText(step, wf);
  return String(resolved.text || "").trim();
}

function liveDesignPageInstructions(api, wf) {
  const step = wf.steps.find((s) => s.canonical_step_id === "step_design_page");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return api.buildWorkflowStepInstructions(step, wf.steps.length - 1, null);
}

function extractVisualAffordanceAuthoringBlock(text) {
  const marker = "Sprint 38 visual affordance authoring contract (auto-applied):";
  const start = String(text || "").indexOf(marker);
  assert.ok(start >= 0, "Sprint 38 VA authoring block missing");
  const tail = text.slice(start);
  const nextContract = tail.search(/\n\n[A-Z][^\n]{10,} \(auto-applied\):/);
  return nextContract > 0 ? tail.slice(0, nextContract).trim() : tail.trim();
}

test("Slice 1D: live buildWorkflowStepInstructions includes authoritative VA contract once", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialDesignPageWorkflow(api);
  const instr = liveDesignPageInstructions(api, wf);

  assert.match(instr, VA_MARKER);
  assert.match(instr, /visual_affordance_schema_version/i);
  assert.match(instr, /visual_decision/i);
  assert.match(instr, /subject/i);
  assert.match(instr, /context/i);
  assert.match(instr, /knowledge-summary-after-content/i);
  assert.match(instr, PARTIAL_MARKER);
  assert.match(instr, /partial page artefact/i);
  assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(instr), 1);

  for (const pattern of OMIT_VA_PATTERNS) {
    assert.doesNotMatch(instr, pattern, `contradictory omit instruction: ${pattern}`);
  }
  for (const pattern of INVENTED_SCHEMA_PATTERNS) {
    assert.doesNotMatch(instr, pattern, `invented schema hint: ${pattern}`);
  }
});

test("Slice 1D: live path and Prompt Factory path share the same VA authoring block", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialDesignPageWorkflow(api);
  const factoryPrompt = promptFactoryDesignPagePrompt(api, wf);
  const livePrompt = liveDesignPageInstructions(api, wf);

  assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(factoryPrompt), 1);
  assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(livePrompt), 1);

  const canonicalBlock = api.buildSprint38VisualAffordanceDesignPagePromptBlock().trim();
  assert.ok(factoryPrompt.includes(canonicalBlock.slice(0, 120)));
  assert.ok(livePrompt.includes(canonicalBlock.slice(0, 120)));

  const factoryVa = extractVisualAffordanceAuthoringBlock(factoryPrompt);
  const liveVa = extractVisualAffordanceAuthoringBlock(livePrompt);
  assert.equal(factoryVa, liveVa);
});

test("Slice 1D: stale override omit clauses are neutralised before VA contract append", () => {
  const api = loadPrismTestApi();
  const staleOverride =
    "Design Page partial.\n- Visual affordance metadata: omit visual_affordance_schema_version, activities_visual_review, and visual_affordances unless upstream provides them.\n";
  const stripped = api.stripContradictoryDesignPageVisualAffordanceOmitClauses(staleOverride);
  assert.doesNotMatch(stripped, /omit visual_affordance_schema_version/i);

  const augmented = api.applyWorkflowStepRuntimePromptAugmentations(
    staleOverride,
    { canonical_step_id: "step_design_page", title: "Design Page" },
    { pageEnrichmentV2: true, partialPageOutputs: true },
    {}
  );
  assert.match(augmented, VA_MARKER);
  assert.doesNotMatch(augmented, /omit visual_affordance_schema_version/i);
});

test("Slice 1D: prompt assembly metrics — factory vs live", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialDesignPageWorkflow(api);
  const factoryPrompt = promptFactoryDesignPagePrompt(api, wf);
  const livePrompt = liveDesignPageInstructions(api, wf);

  assert.ok(factoryPrompt.length > 5000, "factory prompt should include augmented contracts");
  assert.ok(livePrompt.length > factoryPrompt.length, "live instructions wrap core prompt");
  assert.ok(api.sprint38VisualAffordanceMarkerPresent(factoryPrompt));
  assert.ok(api.sprint38VisualAffordanceMarkerPresent(livePrompt));
  assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(factoryPrompt), 1);
  assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(livePrompt), 1);
});

test("Slice 2A: factory and live prompts require learner-facing title and orientation hygiene", () => {
  const api = loadPrismTestApi();
  const wf = buildPartialDesignPageWorkflow(api);
  const factoryPrompt = promptFactoryDesignPagePrompt(api, wf);
  const livePrompt = liveDesignPageInstructions(api, wf);
  for (const prompt of [factoryPrompt, livePrompt]) {
    assert.match(prompt, /concise publication-quality resource title/i);
    assert.match(prompt, /Do not copy the original request\/brief as the title/i);
    assert.match(prompt, /Do not begin those bodies with ## Welcome/i);
    assert.match(prompt, VA_MARKER);
    assert.equal(api.countSprint38VisualAffordanceAuthoringBlocks(prompt), 1);
    assert.doesNotMatch(prompt, /Do not emit title, audience/i);
  }
  assert.match(livePrompt, /Author a concise learner-facing title/i);
  assert.match(livePrompt, /Orientation bodies must not repeat renderer-owned headings/i);
});
