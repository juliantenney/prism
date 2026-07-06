/**
 * Sprint 56C Wave 1 Phase 2B — domain-surface ownership-residue gate validation (Design Page).
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

const DOMAIN_OWNERSHIP_RESIDUE = [
  /LD-JOURNEY-ASSIMILATION/i,
  /LD-SELF-DIRECTED-RHETORIC/i,
  /LD-AUTHORIAL-EXPOSITION/i,
  /wrapper prose/i,
  /substantive (session )?overview/i,
  /Sprint 38 visual affordance contract/i,
  /per Sprint 38 runtime/i
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
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Learner page",
    desiredOutputs: "Learner-facing page",
    workflowOutputSpec: { goal: "Learner page" }
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", step, wf)
    .trim();
}

test("56C W1 P2B: domain §13 surfaces exclude ownership residue", () => {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const factory = extractDesignPagePromptFactory(md);
  const surfaces = [
    factory.defaultPromptNotes,
    factory.promptTemplate,
    factory.runnerInstructions.what_to_check
  ];
  for (const text of surfaces) {
    for (const pattern of DOMAIN_OWNERSHIP_RESIDUE) {
      assert.doesNotMatch(text, pattern, `unexpected residue ${pattern} in domain surface`);
    }
  }
  assert.match(factory.defaultPromptNotes, /Transport-first/i);
  assert.match(factory.defaultPromptNotes, /LD-GUIDED-LEARNING-SCAFFOLD compose preservation/i);
  assert.match(factory.promptTemplate, /transport slots/i);
  assert.match(factory.promptTemplate, /thin assembly-coherence/i);
});

test("56C W1 P2B: domain §13 retains preservation and transport obligations", () => {
  const factory = extractDesignPagePromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  assert.match(factory.defaultPromptNotes, /LD-DESIGN-PAGE-COMPOSE-CONTRACT/i);
  assert.match(factory.defaultPromptNotes, /LD-MATERIALS-COPY/i);
  assert.match(factory.defaultPromptNotes, /LD-TABLE-FIDELITY/i);
  assert.match(factory.promptTemplate, /never excuse material-body loss/i);
  assert.match(factory.runnerInstructions.what_to_check, /verbatim materials preservation/i);
  assert.match(factory.defaultOutputStructure.keys.join(","), /episode_plans/);
});

test("56C W1 P2B: brevity params not mapped to step_design_page", () => {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const block = JSON.parse(
    md
      .slice(md.indexOf("### Workflow Brief Config"))
      .match(/```json\s*([\s\S]*?)\s*```/)[1]
      .trim()
  );
  const config = block.workflowBriefConfig;
  function mappingTargetsForFactor(factorId) {
    const rule = (config.mappingRules || []).find((r) => r.factor === factorId);
    return rule && Array.isArray(rule.mapsTo) ? rule.mapsTo : [];
  }
  ["tone_style", "depth_level", "compact_vs_detailed"].forEach((factorId) => {
    const targets = mappingTargetsForFactor(factorId);
    assert.ok(!targets.some((t) => /stepParams\.step_design_page\./.test(t)), factorId);
    assert.ok(!targets.some((t) => /workflow\.workflowOutputSpec\.constraints\./.test(t)), factorId);
  });
  const toneControl = (config.stepParameterControls || []).find(
    (c) => c.key === "tone_style" && c.canonicalStepId === "step_design_page"
  );
  const depthControl = (config.stepParameterControls || []).find(
    (c) => c.key === "depth_level" && c.canonicalStepId === "step_design_page"
  );
  assert.equal(toneControl, undefined);
  assert.equal(depthControl, undefined);
});

test("56C W1 P2B: design_page refinement profile excludes brevity factors", () => {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const block = JSON.parse(
    md
      .slice(md.indexOf("### Workflow Brief Config"))
      .match(/```json\s*([\s\S]*?)\s*```/)[1]
      .trim()
  );
  const profile = block.workflowBriefConfig.stepRefinementProfiles.design_page;
  const optional = (profile.tiers.optional || []).map((r) => r.factorId);
  assert.ok(optional.includes("page_profile"));
  assert.ok(!optional.includes("tone_style"));
  assert.ok(!optional.includes("depth_level"));
  assert.ok(!optional.includes("compact_vs_detailed"));
});

test("56C W1 P2B: runtime Design Page prompt excludes domain-pack wrapper residue", () => {
  const api = loadPrismTestApi();
  const prompt = designPageAugmentedPrompt(api);
  for (const pattern of DOMAIN_OWNERSHIP_RESIDUE) {
    assert.doesNotMatch(prompt, pattern, `runtime residue: ${pattern}`);
  }
  assert.match(prompt, /Material preservation overrides page optimisation/i);
});

test("56C W1 P2B: Phase 2A lib contract gates still hold", () => {
  const api = loadPrismTestApi();
  const prompt = designPageAugmentedPrompt(api);
  assert.match(prompt, /TRANSPORT VS ARCHIVAL FIELDS/i);
  assert.doesNotMatch(prompt, /is authorable/i);
});
