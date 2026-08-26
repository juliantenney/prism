/**
 * S79-T-006 — Deterministic integration + compatibility isolation + pre-emit ownership.
 *
 * Hardens live canonical GAM routing after T-005. No semantic prompt retune.
 * Does not perform T-008 retirement.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));

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
      id: "wf-s79-t006-gam",
      goal: "S79 T-006 integration",
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

test("S79-T-006: PRISM_GAM_CANONICAL_ASSEMBLER is bootstrap exposure, not a feature flag", () => {
  assert.ok(assembler);
  assert.equal(assembler.LIVE_PRODUCTION, true);
  assert.equal(typeof assembler.LIVE_PRODUCTION, "boolean");
  // Live routing uses module presence, not LIVE_PRODUCTION value.
  assert.equal(api.isGamCanonicalAssemblerLiveEnabled(), true);
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSrc, /resolveGamCanonicalAssemblerLib/);
  assert.doesNotMatch(appSrc, /LIVE_PRODUCTION\s*===/);
  assert.doesNotMatch(appSrc, /\.LIVE_PRODUCTION\s*\?/);
  assert.doesNotMatch(appSrc, /workflowOutputSpec\.gamCanonicalAssembler/);
  assert.ok(assembler.GATE_TEXT_SSOT);
  assert.equal(
    assembler.GATE_TEXT_SSOT.constantName,
    "GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE"
  );
  assert.equal(assembler.GATE_TEXT_SSOT.insertionOwner, "buildSectionPreEmitGate");
});

test("S79-T-006: live Copy and Studio use canonical assembly (not TEMPORARY FALLBACK)", () => {
  assert.equal(api.isGamCanonicalAssemblerLiveEnabled(), true);
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const liveCopy = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const liveStudio = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );
  const goldenCopy = fs.readFileSync(
    path.join(FIXTURE_DIR, "run-copy-partial-baseline.txt"),
    "utf8"
  );
  const goldenStudio = fs.readFileSync(
    path.join(FIXTURE_DIR, "studio-partial-baseline.txt"),
    "utf8"
  );
  assert.equal(liveCopy, goldenCopy, "live Copy must remain on canonical path == T-002 golden");
  assert.equal(liveStudio, goldenStudio, "live Studio must remain on canonical graft == T-002 golden");
  // Direct canonical entry also available.
  assert.equal(typeof api.buildLiveGamV2CopyPromptViaCanonicalAssembler, "function");
  const direct = api.buildLiveGamV2CopyPromptViaCanonicalAssembler(
    gamStep,
    2,
    null,
    wf,
    "page"
  );
  assert.equal(direct, goldenCopy);
});

test("S79-T-006: singular pre-emit gate text SSOT + single live insertion", () => {
  const ssot = gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE;
  assert.match(ssot, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/);
  const fromAssembler = assembler.buildSectionPreEmitGate({});
  assert.equal(fromAssembler, ssot);
  const fromLiveResolver = api.resolveGamFinalSilentPreEmitConsistencyGate();
  assert.equal(fromLiveResolver, ssot);

  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const liveCopy = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const liveStudio = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );
  assert.equal(
    (liveCopy.match(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/gi) || []).length,
    1,
    "Copy gate once"
  );
  assert.equal(
    (liveStudio.match(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/gi) || []).length,
    1,
    "Studio gate once"
  );
  assert.ok(liveCopy.includes(ssot));
  assert.ok(liveStudio.includes(ssot));
  // Gate not displaced by post-assembly math/archetype relative to completion override.
  assert.ok(assembler.assertGateBeforeCompletionOverride(liveCopy));
});

test("S79-T-006: Copy protected ordering on live path", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const text = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const pos = (needle) => text.indexOf(needle);
  const contractPos = pos("### Sprint 58 vNext GAM partial-page contract");
  const commissionPos = pos("### AUTHORITATIVE DLA MATERIAL COMMISSION");
  const briefPos = pos("Material authoring guidance (Sprint 56F v2");
  const gatePos = pos("FINAL SILENT PRE-EMIT CONSISTENCY CHECK");
  const completionPos = pos("GAM completion override");
  const verbatimPos = pos("Use the exact literal line below, verbatim:");
  const footerPos = verbatimPos >= 0 ? text.indexOf("STEP 3 OUTPUT: page", verbatimPos) : -1;
  const mathPos = pos("LD-MATH-RENDER (auto-applied):");
  const pipelinePos = pos("Pipeline completion rule:");
  assert.ok(contractPos >= 0 && commissionPos > contractPos);
  assert.ok(briefPos > commissionPos);
  assert.ok(gatePos >= 0 && completionPos > gatePos);
  assert.ok(footerPos > completionPos);
  assert.ok(mathPos > footerPos);
  assert.ok(pipelinePos > mathPos);
});

test("S79-T-006: Studio scaffolds remain before canonical graft", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const augFn = appSrc.match(
    /function applyWorkflowStepRuntimePromptAugmentations[\s\S]*?return String\(draft \|\| ""\)\.trim\(\);\r?\n  \}/
  );
  assert.ok(augFn);
  const body = augFn[0];
  assert.match(body, /applyLdTableFidelityContractToDraft/);
  assert.match(body, /applyLdMaterialsCopyContractToDraft/);
  assert.match(body, /applyMathSafeOutputContractToDraft/);
  assert.match(body, /applyGamPageEnrichPromptBlockToDraft/);
  assert.ok(
    body.lastIndexOf("applyGamPageEnrichPromptBlockToDraft") >
      body.lastIndexOf("applyMathSafeOutputContractToDraft")
  );
  // Graft delegates to canonical applyGamStudioGraft.
  assert.match(appSrc, /asm\.applyGamStudioGraft/);
});

test("S79-T-006: TEMPORARY FALLBACK retired — fail-closed is the miss path", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.doesNotMatch(appSrc, /TEMPORARY FALLBACK/);
  assert.match(appSrc, /requireGamCanonicalAssemblerLib/);
  assert.match(appSrc, /Canonical GAM assembler unavailable/);
  // Assembler is present → live enabled.
  assert.equal(api.resolveGamCanonicalAssemblerLib(), assembler);
  assert.equal(api.isGamCanonicalAssemblerLiveEnabled(), true);
});

test("S79-T-006: compatibility modules isolated from canonical assembler", () => {
  const assemblerSrc = fs.readFileSync(
    path.join(repoRoot, "lib", "gam-canonical-assembler.js"),
    "utf8"
  );
  assert.doesNotMatch(assemblerSrc, /gam-output-format/);
  assert.doesNotMatch(assemblerSrc, /page-gam-materials-preserve/);
  assert.doesNotMatch(assemblerSrc, /require\(["'].*gam-output-format/);
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "gam-output-format.js")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "page-gam-materials-preserve.js")));
  const pack = require(path.join(repoRoot, "lib", "gam-output-format.js"));
  assert.ok(pack && typeof pack === "object");
  const preserve = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));
  assert.ok(preserve && typeof preserve === "object");
});

test("S79-T-006: policy-ingress seam remains behaviour-neutral", () => {
  const withPolicy = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: "Generate Activity Materials",
    outputName: "page",
    workflowSteps: buildGamWorkflow().steps,
    policyIngress: { source: "hypothetical", settingsEffective: true, foo: 1 },
    adapters: {
      buildOutputContractAndShape: () => api.buildGamV2CopilotSchemaInstructions()
    }
  });
  const without = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: "Generate Activity Materials",
    outputName: "page",
    workflowSteps: buildGamWorkflow().steps,
    adapters: {
      buildOutputContractAndShape: () => api.buildGamV2CopilotSchemaInstructions()
    }
  });
  assert.equal(withPolicy.text, without.text);
  assert.equal(withPolicy.policyIngress.settingsEffective, false);
  assert.equal(assembler.NEUTRAL_POLICY_INGRESS.settingsEffective, false);
});

test("S79-T-006: workspace authoring rules remain in canonical normative core", () => {
  const contract = api.buildGamV2CopilotSchemaInstructions();
  assert.match(contract, /S78-T-042 structured workspace fidelity/i);
  assert.match(contract, /\*\*Label:\*\*/);
  assert.match(contract, /blank learner/i);
  const brief = assembler.buildSectionAuthoringBrief({
    adapters: {
      buildPreEmitGate: () => assembler.buildSectionPreEmitGate({})
    }
  });
  assert.match(brief, /S78-T-042/);
  assert.match(brief, /\*\*Label:\*\*/);
});
