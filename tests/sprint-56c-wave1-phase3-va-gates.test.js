/**
 * Sprint 56C Wave 1 Phase 3 — VA residue gate validation (Design Page).
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

const VA_MANDATE_PATTERNS = [
  /visual_affordance_schema_version.*38\.4/i,
  /activities_visual_review\[\]/i,
  /visual_affordances\[\]/i
];

const RUNTIME_ONLY_VA_PATTERNS = [
  /sprint 38 visual affordance authoring contract \(auto-applied\)/i,
  /Page root \(mandatory\): visual_affordance_schema_version/i
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
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function designPageAugmentedPrompt(api) {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowName: "Learner page",
    step: {
      title: "Design Page",
      canonical_step_id: "step_design_page",
      inputBindings: []
    },
    matchedPattern: { promptFactory: factory }
  });
  return api
    .applyWorkflowStepRuntimePromptAugmentations(
      seeded,
      { canonical_step_id: "step_design_page", title: "Design Page" },
      { goal: "Learner page", desiredOutputs: "Learner-facing page" }
    )
    .trim();
}

test("Slice1: defaultOutputStructure includes mandatory VA keys", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const keys = factory.defaultOutputStructure.keys;
  assert.ok(keys.includes("page_synthesis"));
  assert.ok(keys.includes("assembly_state"));
  assert.ok(keys.includes("visual_affordance_schema_version"));
  assert.ok(keys.includes("activities_visual_review"));
  assert.ok(keys.includes("visual_affordances"));
});

test("Slice1: domain template mandates authoritative VA output lines", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const surfaces = [
    factory.promptTemplate,
    factory.defaultPromptNotes,
    factory.runnerInstructions.what_to_check
  ];
  for (const text of surfaces) {
    for (const pattern of VA_MANDATE_PATTERNS) {
      assert.match(text, pattern, `missing VA mandate: ${pattern}`);
    }
  }
  assert.match(factory.promptTemplate, /authoritative visual planning/i);
  assert.match(factory.promptTemplate, /No downstream prompt may invent visual purpose/i);
  assert.match(factory.promptTemplate, /evidence_anchors/i);
});

test("Slice1: runtime Design Page prompt includes VA authoring contract", () => {
  const api = loadPrismTestApi();
  const prompt = designPageAugmentedPrompt(api);
  for (const pattern of VA_MANDATE_PATTERNS) {
    assert.match(prompt, pattern, `runtime VA requirement missing: ${pattern}`);
  }
  for (const pattern of RUNTIME_ONLY_VA_PATTERNS) {
    assert.match(prompt, pattern, `runtime VA requirement missing: ${pattern}`);
  }
  assert.match(prompt, /Material preservation overrides page optimisation/i);
});

test("Slice1: post-compose VA processing validates and normalizes authoritative rows", () => {
  const api = loadPrismTestApi();
  const page = {
    artifact_type: "page",
    title: "Transport VA",
    visual_affordances: [{ affordance_id: "va-upstream-01", activity_id: "A1" }]
  };
  const next = api.applySprint38VisualAffordancesToComposedPage(page, { strictValidation: true });
  assert.equal(next.visual_affordance_schema_version, "38.4");
  assert.equal(Array.isArray(next.visual_affordances), true);
});

test("56C W1 P3: compose pipeline does not inject schema 38.4", () => {
  const api = loadPrismTestApi();
  const inflationPagePath = path.join(
    repoRoot,
    "tests",
    "fixtures",
    "page-render",
    "inflation-workshop-page.json"
  );
  if (!fs.existsSync(inflationPagePath)) {
    return;
  }
  const base = JSON.parse(fs.readFileSync(inflationPagePath, "utf8"));
  delete base.visual_affordance_schema_version;
  delete base.activities_visual_review;
  delete base.visual_affordances;
  const upstream = base.sections.find((s) => s.section_id === "learning_activities").content;
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(base, {
    upstreamLearningActivities: upstream
  });
  assert.equal(next.visual_affordance_schema_version, undefined);
  assert.equal(next.activities_visual_review, undefined);
  assert.equal(next.visual_affordances, undefined);
});

test("56C W1 P3: Phase 2 transport/preservation gates still hold", () => {
  const api = loadPrismTestApi();
  const prompt = designPageAugmentedPrompt(api);
  assert.match(prompt, /TRANSPORT VS ARCHIVAL FIELDS/i);
  assert.doesNotMatch(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i);
});
