/**
 * Sprint 56C Wave 2 — thin assembly-coherence bridge runtime gates (Design Page).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

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

const api = loadPrismTestApi();

const LD_BRIEF = MARX_SELF_STUDY_BRIEF;

function applyRuntimePrompt(baseDraft, stepId, stepTitle) {
  const step = {
    canonical_step_id: stepId,
    canonical_title: stepTitle,
    title: stepTitle
  };
  const wf = {
    goal: LD_BRIEF.goal,
    desiredOutputs: LD_BRIEF.desiredOutputs,
    workflowOutputSpec: { goal: LD_BRIEF.goal }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(baseDraft, step, wf);
}

function designPageAugmentedPrompt() {
  return applyRuntimePrompt(
    "Assemble learner page.\n",
    "step_design_page",
    "Design Page"
  ).trim();
}

test("56C W2: Design Page runtime includes LD-THIN-ASSEMBLY-COHERENCE-CONTRACT", () => {
  const prompt = designPageAugmentedPrompt();
  assert.match(prompt, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i);
});

test("56C W2: thin bridge appears after LD-DESIGN-PAGE-COMPOSE-CONTRACT", () => {
  const prompt = designPageAugmentedPrompt();
  const composeIdx = prompt.search(/LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  const bridgeIdx = prompt.search(/LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i);
  assert.ok(composeIdx >= 0, "compose contract must be present");
  assert.ok(bridgeIdx >= 0, "thin bridge contract must be present");
  assert.ok(composeIdx < bridgeIdx, "compose must precede thin bridge");
});

test("56C W2: thin bridge is Design Page only", () => {
  const dlaPrompt = applyRuntimePrompt(
    "Design activities.\n",
    "step_design_learning_activities",
    "Design Learning Activities"
  ).trim();
  const gamPrompt = applyRuntimePrompt(
    "Generate materials.\n",
    "step_generate_activity_materials",
    "Generate Activity Materials"
  ).trim();
  assert.doesNotMatch(dlaPrompt, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(gamPrompt, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i);
});

test("56C W2: thin bridge injection is idempotent", () => {
  const once = designPageAugmentedPrompt();
  const twice = api.applyWorkflowStepRuntimePromptAugmentations(
    once,
    {
      canonical_step_id: "step_design_page",
      canonical_title: "Design Page",
      title: "Design Page"
    },
    {
      goal: LD_BRIEF.goal,
      desiredOutputs: LD_BRIEF.desiredOutputs,
      workflowOutputSpec: { goal: LD_BRIEF.goal }
    }
  ).trim();
  const markerCount = (twice.match(/LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/gi) || [])
    .length;
  assert.equal(markerCount, 1);
});

test("56C W2: Design Page still excludes Wave 1 removed ownership layers", () => {
  const prompt = designPageAugmentedPrompt();
  assert.doesNotMatch(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i);
  assert.doesNotMatch(
    prompt,
    /Sprint 38 visual affordance authoring contract \(auto-applied\)/i
  );
});

test("56C W2: Design Page retains compose and F40 preservation obligations", () => {
  const prompt = designPageAugmentedPrompt();
  assert.match(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /Material preservation overrides page optimisation/i);
});

test("56C W2.3C: compose runtime points to thin bridge without duplicating bridge prose", () => {
  const prompt = designPageAugmentedPrompt();
  assert.match(prompt, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /wrapper-gap fallback obey appended LD-THIN-ASSEMBLY-COHERENCE-CONTRACT only/i);
  const composeStart = prompt.indexOf("LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied)");
  const bridgeStart = prompt.indexOf("LD-THIN-ASSEMBLY-COHERENCE-CONTRACT (auto-applied)");
  const composeSlice = prompt.slice(composeStart, bridgeStart);
  assert.doesNotMatch(composeSlice, /WRAPPER SLOT DISCIPLINE/i);
  assert.doesNotMatch(composeSlice, /FORBIDDEN transition glue/i);
  assert.doesNotMatch(composeSlice, /≤ 80 words per affected section/i);
});

test("56C W2.3C: R-40/R-44/R-45/R-47 merged under thin bridge only on DP runtime", () => {
  const prompt = designPageAugmentedPrompt();
  const bridgeStart = prompt.indexOf("LD-THIN-ASSEMBLY-COHERENCE-CONTRACT (auto-applied)");
  const bridgeSlice = prompt.slice(bridgeStart);
  assert.match(bridgeSlice, /Clusters: assembly-coherence \(R-40, R-44, R-45, R-47\)/i);
  assert.match(bridgeSlice, /WRAPPER SLOT DISCIPLINE \(R-44 \/ R-47\)/i);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i);
});

test("56C W2.3C: domain §13 recognises thin bridge as Layer 3 authority", () => {
  const domainPath = path.join(
    repoRoot,
    "domains",
    "learning-design",
    "domain-learning-design-step-patterns.md"
  );
  const domainText = fs.readFileSync(domainPath, "utf8");
  const section13 = domainText.slice(domainText.indexOf("## 13. Design Page"));
  assert.match(section13, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT at runtime is the sole Layer 3 authority/i);
  assert.match(section13, /wrapper-gap fallback for overview\/learning_purpose only when upstream body absent/i);
  assert.match(section13, /minimal and capped/i);
  assert.match(section13, /R-40\/R-44\/R-45\/R-47 merged/i);
  assert.match(section13, /removed authorial\/journey\/rhetoric modules are not current DP authorities/i);
  assert.doesNotMatch(section13, /LD-AUTHORIAL-EXPOSITION-CONTRACT/i);
  assert.doesNotMatch(section13, /LD-JOURNEY-ASSIMILATION-CONTRACT/i);
});

test("56C W2.5: domain §13 R-83 delimiter excludes payload optimisation mandate", () => {
  const domainPath = path.join(
    repoRoot,
    "domains",
    "learning-design",
    "domain-learning-design-step-patterns.md"
  );
  const domainText = fs.readFileSync(domainPath, "utf8");
  const section13 = domainText.slice(domainText.indexOf("## 13. Design Page"));
  const factoryMatch = section13.match(/### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/);
  assert.ok(factoryMatch, "Design Page prompt factory JSON");
  const factory = JSON.parse(factoryMatch[1].trim());
  assert.match(factory.defaultPromptNotes, /R-83 readable assembly \(guardrail\)/i);
  assert.match(factory.defaultPromptNotes, /forbids condensation/i);
  assert.match(factory.runnerInstructions.what_this_step_does, /archival copy-only payloads/i);
  assert.match(factory.promptTemplate, /READABLE ASSEMBLY \(R-83 guardrail/i);
  assert.match(factory.promptTemplate, /wrapper\/container structure only/i);
  assert.match(factory.promptTemplate, /forbids condensation/i);
  assert.match(factory.promptTemplate, /readability rewriting/i);
  assert.match(factory.promptTemplate, /self-contained page container/i);
  assert.doesNotMatch(factory.promptTemplate, /Assemble one readable, self-contained page/i);
  assert.doesNotMatch(section13, /### Purpose[\s\S]*?readable page artefact/i);
});

test("56C W2.5: runtime R-83 delimiter present; bridge does not absorb R-83 generative prose", () => {
  const prompt = designPageAugmentedPrompt();
  assert.match(prompt, /READABLE ASSEMBLY \(R-83 guardrail/i);
  assert.match(prompt, /forbids condensation/i);
  assert.match(prompt, /Material preservation overrides page optimisation/i);
  const bridgeStart = prompt.indexOf("LD-THIN-ASSEMBLY-COHERENCE-CONTRACT (auto-applied)");
  const bridgeSlice = prompt.slice(bridgeStart);
  assert.doesNotMatch(bridgeSlice, /READABLE ASSEMBLY \(R-83/i);
  assert.doesNotMatch(bridgeSlice, /R-83 guardrail/i);
});
