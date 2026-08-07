/**
 * Sprint 56C Wave 1 Phase 2A — contract ownership-residue gate validation (Design Page).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const partial = require("../lib/ld-design-page-partial-contract.js");
const materialsCopy = require("../lib/ld-materials-copy.js");
const guidedScaffold = require("../lib/ld-guided-learning-scaffold.js");

const OWNERSHIP_RESIDUE_PATTERNS = [
  /is authorable/i,
  /authored only here/i,
  /interpret, connect, and explain materials/i,
  /substantive session overview/i,
  /synthesis prose/i,
  /LD-JOURNEY-ASSIMILATION/i,
  /LD-AUTHORIAL-EXPOSITION/i,
  /LD-SELF-DIRECTED-RHETORIC/i,
  /additive page-root metadata only/i,
  /visual_affordance descriptions/i,
  /source_basis paths in visual_affordances/i
];

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
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Learner page" }
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", step, wf)
    .trim();
}

function buildDesignPagePartialEmbed() {
  return partial.buildDesignPagePartialContractBlock();
}

test("56C W1 P2A: partial contract excludes ownership residue", () => {
  const text = buildDesignPagePartialEmbed();
  for (const pattern of OWNERSHIP_RESIDUE_PATTERNS) {
    assert.doesNotMatch(text, pattern, `unexpected residue: ${pattern}`);
  }
  assert.match(text, /page_synthesis\.knowledge_summary is mandatory/i);
  assert.match(text, /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT/i);
  assert.match(text, /Materials and activities are already hydrated upstream/i);
});

test("56C W1 P2A: materials-copy preserve role excludes ownership residue", () => {
  const text = materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "preserve",
    includeMarker: false
  });
  for (const pattern of OWNERSHIP_RESIDUE_PATTERNS) {
    assert.doesNotMatch(text, pattern, `unexpected residue: ${pattern}`);
  }
  assert.match(text, /wrapper transport slots/i);
});

test("56C W1 P2A: guided scaffold DLA path excludes compose preservation slice", () => {
  const text = guidedScaffold.buildLdGuidedLearningScaffoldPromptBlock({
    includeCompose: false,
    composeOnly: false
  });
  assert.doesNotMatch(text, /LD-AUTHORIAL-EXPOSITION/i);
  assert.doesNotMatch(text, /COMPOSE PRESERVATION/i);
  assert.doesNotMatch(text, /LD-DESIGN-PAGE-COMPOSE field preservation boundaries/i);
});

test("56C W1 P2A: runtime Design Page partial prompt retains upstream materials guard", () => {
  const api = loadPrismTestApi();
  const prompt = designPageAugmentedPrompt(api);
  assert.match(prompt, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /Materials and activities are already hydrated upstream/i);
  assert.match(prompt, /activities\[\] regeneration/i);
});

test("56C W1 P2A: Phase 1 augment gates still hold", () => {
  const api = loadPrismTestApi();
  const prompt = designPageAugmentedPrompt(api);
  assert.doesNotMatch(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
});
