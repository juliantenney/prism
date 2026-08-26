/**
 * S79-T-008 — Mandatory temporary rollback / legacy retirement.
 *
 * Proves OLD GAM production fallback is gone; fail-closed when assembler missing;
 * live output still matches T-002 goldens; compatibility retained.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const FIXTURE_DIR = path.join(__dirname, "fixtures", "s79-t-002");
const dlaCommission = JSON.parse(
  fs.readFileSync(path.join(FIXTURE_DIR, "dla-commission-baseline.json"), "utf8")
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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
    localStorage: { getItem: () => null, setItem() {} },
    _: sandbox._,
    Utils: { debounce: (fn) => fn }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    assembler: sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER || sandbox.PRISM_GAM_CANONICAL_ASSEMBLER,
    sandbox
  };
}

function buildGamWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-s79-t008-gam",
      goal: "S79 T-008 retirement",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      workflowOutputSpec: {
        pageEnrichmentV2: true,
        partialPageOutputs: true
      },
      steps: [
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "page",
          canonical_step_id: "step_design_episode_plan"
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "page",
          canonical_step_id: "step_design_learning_activities"
        },
        {
          id: "gam_step",
          title: "Generate Activity Materials",
          outputName: "page",
          canonical_step_id: "step_generate_activity_materials",
          override_prompt_body: "STUDIO_LIBRARY_BODY: Populate materials from DLA required_materials."
        }
      ]
    },
    overrides || {}
  );
}

function setup(api, wf) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  if (typeof api.setWorkflowRunCapturedOutputsForTest === "function") {
    api.setWorkflowRunCapturedOutputsForTest({
      dla_step: JSON.stringify(dlaCommission, null, 2)
    });
  }
}

const loaded = loadPrismTestApi();
const api = loaded.api;
const assembler = loaded.assembler;

test("S79-T-008: no TEMPORARY FALLBACK markers remain in app.js", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.doesNotMatch(appSrc, /TEMPORARY FALLBACK/);
  assert.doesNotMatch(appSrc, /retire S79-T-008/);
  assert.match(appSrc, /requireGamCanonicalAssemblerLib/);
  assert.match(appSrc, /Canonical GAM assembler unavailable/);
});

test("S79-T-008: missing assembler fails closed (Copy + Studio)", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(
    appSrc,
    /if \(isGamPageEnrichmentV2CopyStep\(step, wfForChain\)\) \{\s*return buildLiveGamV2CopyPromptViaCanonicalAssembler/s
  );
  assert.doesNotMatch(
    appSrc,
    /if \(canonicalCopyPrompt\) \{\s*return canonicalCopyPrompt;\s*\}/
  );

  const stripped = loadPrismTestApi();
  // Null out all bootstrap roots — delete alone can miss linked window/globalThis aliases.
  stripped.sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER = undefined;
  stripped.sandbox.PRISM_GAM_CANONICAL_ASSEMBLER = undefined;
  if (stripped.sandbox.globalThis && stripped.sandbox.globalThis !== stripped.sandbox) {
    stripped.sandbox.globalThis.PRISM_GAM_CANONICAL_ASSEMBLER = undefined;
  }
  assert.equal(stripped.api.resolveGamCanonicalAssemblerLib(), null);
  assert.equal(stripped.api.isGamCanonicalAssemblerLiveEnabled(), false);
  assert.throws(
    () => stripped.api.requireGamCanonicalAssemblerLib(),
    /Canonical GAM assembler unavailable/
  );
  const wf = buildGamWorkflow();
  setup(stripped.api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  assert.throws(
    () => stripped.api.buildWorkflowStepInstructions(gamStep, 2, null),
    /Canonical GAM assembler unavailable/
  );
  assert.throws(
    () =>
      stripped.api.applyGamPageEnrichPromptBlockToDraftForTest(
        "STUDIO_BODY",
        {
          stepCanonicalStepId: "step_generate_activity_materials",
          stepCanonicalTitle: "Generate Activity Materials",
          stepTitle: "Generate Activity Materials"
        },
        wf
      ),
    /Canonical GAM assembler unavailable/
  );
});

test("S79-T-008: Studio graft has no OLD append fallback body", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const fnStart = appSrc.indexOf("function applyGamPageEnrichPromptBlockToDraft");
  assert.ok(fnStart > 0);
  const fnSlice = appSrc.slice(fnStart, fnStart + 2200);
  assert.match(fnSlice, /requireGamCanonicalAssemblerLib/);
  assert.match(fnSlice, /applyGamStudioGraft/);
  assert.doesNotMatch(fnSlice, /buildGamPageEnrichContractBlock/);
  assert.doesNotMatch(fnSlice, /appendParts\.push\(gate\)/);
});

test("S79-T-008: LIVE Copy still byte-matches T-002 golden", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const live = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const golden = fs.readFileSync(path.join(FIXTURE_DIR, "run-copy-partial-baseline.txt"), "utf8");
  assert.equal(live, golden);
});

test("S79-T-008: LIVE Studio still byte-matches T-002 golden", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const liveStudio = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );
  const golden = fs.readFileSync(path.join(FIXTURE_DIR, "studio-partial-baseline.txt"), "utf8");
  assert.equal(liveStudio, golden);
});

test("S79-T-008: thin wrappers delegate to canonical assembler", () => {
  assert.ok(assembler);
  const briefLive = api.buildGamV2CopyMaterialAuthoringBrief();
  const briefAsm = assembler.buildSectionAuthoringBrief({
    partialMode: true,
    pageEnrichmentV2: true
  });
  assert.equal(briefLive, briefAsm);
  const commissionLive = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(dlaCommission);
  const commissionAsm = assembler.buildSectionCommission({
    dlaPage: dlaCommission,
    partialMode: true,
    pageEnrichmentV2: true
  });
  assert.equal(commissionLive, commissionAsm);
});

test("S79-T-008: PRISM_GAM_CANONICAL_ASSEMBLER remains bootstrap exposure (not feature flag)", () => {
  assert.ok(assembler);
  assert.equal(assembler.LIVE_PRODUCTION, true);
  assert.match(String(assembler.ASSEMBLER_VERSION || ""), /S79-T-008/);
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.doesNotMatch(appSrc, /gamCanonicalAssembler\s*[=:]/);
  assert.doesNotMatch(appSrc, /workflowOutputSpec\.gamCanonicalAssembler/);
});

test("S79-T-008: genuine compatibility modules retained", () => {
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "gam-output-format.js")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "page-gam-materials-preserve.js")));
  const asmSrc = fs.readFileSync(path.join(repoRoot, "lib", "gam-canonical-assembler.js"), "utf8");
  assert.doesNotMatch(asmSrc, /gam-output-format/);
  assert.doesNotMatch(asmSrc, /page-gam-materials-preserve/);
});

test("S79-T-008: path wrappers retained (Copy archetype/math/pipeline; Studio scaffolds)", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSrc, /applyLdInstructionalArchetypeRoutingToDraft/);
  assert.match(appSrc, /applyMathSafeOutputContractToDraft/);
  assert.match(appSrc, /getPipelineExecutionCompletionDirective/);
  assert.match(appSrc, /applyEducationalQualityFrameworkPromptBlockToDraft/);
  assert.match(appSrc, /applyLdTableFidelityContractToDraft/);
  assert.match(appSrc, /applyLdMaterialsCopyContractToDraft/);
  const body = appSrc.slice(
    appSrc.indexOf("function applyWorkflowStepRuntimePromptAugmentations"),
    appSrc.indexOf("function applySelfDirectedLearnerPageStepScaffoldsToDraft")
  );
  assert.ok(
    body.lastIndexOf("applyGamPageEnrichPromptBlockToDraft") >
      body.lastIndexOf("applyMathSafeOutputContractToDraft")
  );
});
