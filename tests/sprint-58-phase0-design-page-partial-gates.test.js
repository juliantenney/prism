/**
 * Sprint 58 Phase 0 — Design Page partial contract gate tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const COMPOSE_MARKER = /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i;
const PARTIAL_MARKER = /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i;

function loadPrismTestApi(extraLibs) {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, extraLibs);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function designPagePrompt(api, wf) {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page",
    outputName: "page"
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", step, wf, {})
    .trim();
}

test("Phase 0: partial mode injects partial contract and excludes compose contract", () => {
  const api = loadPrismTestApi(["lib/ld-design-page-partial-contract.js"]);
  const prompt = designPagePrompt(api, {
    id: "wf-partial-dp",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "dp",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page"
      }
    ]
  });
  assert.match(prompt, PARTIAL_MARKER);
  assert.match(prompt, /page_synthesis\.knowledge_summary is mandatory/i);
  assert.match(prompt, /sections\[\] is optional/i);
  assert.doesNotMatch(prompt, COMPOSE_MARKER);
  assert.match(prompt, /resolving activity_materials from chat/i);
  assert.doesNotMatch(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \| L0/i);
});

test("Phase 0: rollback v2 mode retains compose contract and excludes partial contract", () => {
  const api = loadPrismTestApi(["lib/ld-design-page-partial-contract.js"]);
  const prompt = designPagePrompt(api, {
    id: "wf-rollback-dp",
    pageEnrichmentV2: true,
    partialPageOutputs: false,
    steps: [
      {
        id: "ep",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dp",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page"
      }
    ]
  });
  assert.match(prompt, COMPOSE_MARKER);
  assert.doesNotMatch(prompt, PARTIAL_MARKER);
});

test("Phase 0: legacy mode retains compose contract and excludes partial contract", () => {
  const api = loadPrismTestApi(["lib/ld-design-page-partial-contract.js"]);
  const prompt = designPagePrompt(api, {
    id: "wf-legacy-dp",
    pageEnrichmentV2: false,
    partialPageOutputs: false,
    steps: [{ id: "dp", title: "Design Page", outputName: "page" }]
  });
  assert.match(prompt, COMPOSE_MARKER);
  assert.doesNotMatch(prompt, PARTIAL_MARKER);
});

test("Phase 0: partial contract lib shape", () => {
  const partial = require(path.join(repoRoot, "lib", "ld-design-page-partial-contract.js"));
  assert.equal(partial.MODULE_ID, "LD-DESIGN-PAGE-PARTIAL-CONTRACT");
  const block = partial.buildDesignPagePartialContractBlock();
  assert.match(block, /page_synthesis/);
  assert.match(block, /sections\[\] is optional/i);
  assert.match(block, /page_synthesis\.knowledge_summary is mandatory/i);
});
