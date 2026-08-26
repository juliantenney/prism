/**
 * S79-T-003 — Off-path canonical GAM assembler equivalence vs T-002 OLD baselines.
 *
 * Does NOT switch production. Compares TARGET (lib/gam-canonical-assembler.js)
 * to committed T-002 goldens / live OLD builders at the appropriate boundary.
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

function loadPrismTestApiWithAssembler() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const assemblerSrc = fs.readFileSync(
    path.join(repoRoot, "lib", "gam-canonical-assembler.js"),
    "utf8"
  );
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
  vm.runInContext(assemblerSrc, sandbox, { filename: "lib/gam-canonical-assembler.js" });
  if (sandbox.PRISM_GAM_CANONICAL_ASSEMBLER) {
    sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER = sandbox.PRISM_GAM_CANONICAL_ASSEMBLER;
  }
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    assembler: sandbox.PRISM_GAM_CANONICAL_ASSEMBLER || sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER,
    sandbox
  };
}

function buildGamWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-s79-t003-gam",
      goal: "S79 T-003 equivalence",
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

function liveContractAdapters(api) {
  return {
    buildOutputContractAndShape: () => api.buildGamV2CopilotSchemaInstructions(),
    buildPreEmitGate: () => api.resolveGamFinalSilentPreEmitConsistencyGate(),
    buildAuthoringBrief: () => api.buildGamV2CopyMaterialAuthoringBrief(),
    buildCommissionSection: (page) =>
      api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(page)
  };
}

const loaded = loadPrismTestApiWithAssembler();
const api = loaded.api;
const assembler = loaded.assembler;

test("S79-T-003: assembler module loads with LIVE_PRODUCTION marker", () => {
  assert.ok(assembler, "assembler present in VM");
  // After S79-T-005 the assembler is live; marker remains true.
  assert.equal(assembler.LIVE_PRODUCTION, true);
  assert.match(assembler.ASSEMBLER_VERSION, /S79-T-00[3568]/);
  assert.equal(assembler.PROFILES.COPY_V2_PARTIAL, "copy_v2_partial");
  assert.equal(assembler.PROFILES.STUDIO_V2_PARTIAL, "studio_v2_partial");
});

test("S79-T-003: policy-ingress seam is behaviour-neutral", () => {
  const a = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: "Generate Activity Materials",
    outputName: "page",
    workflowSteps: buildGamWorkflow().steps,
    adapters: liveContractAdapters(api),
    policyIngress: { hypotheticalFutureSetting: true, source: "test" }
  });
  const b = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: "Generate Activity Materials",
    outputName: "page",
    workflowSteps: buildGamWorkflow().steps,
    adapters: liveContractAdapters(api)
  });
  assert.equal(a.text, b.text, "policyIngress must not alter assembled text");
  assert.equal(a.policyIngress.settingsEffective, false);
});

test("S79-T-003: TARGET shared normative core equals live OLD (contract+shape+gate)", () => {
  const liveContract = api.buildGamV2CopilotSchemaInstructions();
  const liveGate = api.resolveGamFinalSilentPreEmitConsistencyGate();
  const targetContract = assembler.buildSectionOutputContract({
    adapters: liveContractAdapters(api)
  });
  const targetGate = assembler.buildSectionPreEmitGate({
    adapters: liveContractAdapters(api)
  });
  assert.equal(targetContract, liveContract);
  assert.equal(targetGate, liveGate);
  assert.equal(
    targetContract,
    fs.readFileSync(path.join(FIXTURE_DIR, "shared-live-contract-shape.txt"), "utf8")
  );
  assert.equal(
    targetGate,
    fs.readFileSync(path.join(FIXTURE_DIR, "shared-pre-emit-gate.txt"), "utf8")
  );
});

test("S79-T-003: TARGET commission equals T-002 commission golden", () => {
  const section = assembler.buildSectionCommission({
    dlaPage: dlaCommission,
    adapters: liveContractAdapters(api)
  });
  const golden = fs.readFileSync(
    path.join(FIXTURE_DIR, "authoritative-commission-section.txt"),
    "utf8"
  );
  assert.equal(section, golden);
  assert.match(section, /practice_independence/i);
  assert.match(section, /S78-OPERATIONAL-SUITABILITY/i);
});

test("S79-T-003: TARGET Copy V2 partial whole-prompt equals T-002 OLD golden", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const oldCopy = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const golden = fs.readFileSync(path.join(FIXTURE_DIR, "run-copy-partial-baseline.txt"), "utf8");
  assert.equal(oldCopy, golden, "OLD live still matches committed T-002 golden");

  const target = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: gamStep.title,
    outputName: "page",
    workflowSteps: wf.steps,
    adapters: liveContractAdapters(api)
  });
  assert.equal(
    target.text,
    golden,
    "TARGET Copy must byte-match T-002 run-copy-partial-baseline.txt"
  );
  assert.equal(assembler.assertGateBeforeCompletionOverride(target.text), true);
});

test("S79-T-003: TARGET Studio V2 partial whole-prompt equals T-002 OLD golden", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const oldStudio = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );
  const golden = fs.readFileSync(path.join(FIXTURE_DIR, "studio-partial-baseline.txt"), "utf8");
  assert.equal(oldStudio, golden, "OLD live still matches committed T-002 Studio golden");

  const target = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.STUDIO_V2_PARTIAL,
    libraryBody: String(gamStep.override_prompt_body || ""),
    stepTitle: gamStep.title,
    // Live Studio scaffolds except GAM graft; TARGET owns the graft.
    adapters: Object.assign(liveContractAdapters(api), {
      applyStudioRuntimeScaffolds(body) {
        let draft = String(body || "").trim();
        const ctx = {
          stepCanonicalStepId: "step_generate_activity_materials",
          stepTitle: gamStep.title,
          stepCanonicalTitle: gamStep.title,
          stepOutputName: "page"
        };
        draft = api.applyEducationalQualityFrameworkPromptBlockToDraft(draft, ctx);
        draft = api.applyMathSafeOutputContractToDraft(draft, ctx);
        return draft;
      }
    })
  });
  assert.equal(
    target.text,
    golden,
    "TARGET Studio must byte-match T-002 studio-partial-baseline.txt"
  );
  assert.doesNotMatch(target.text, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.doesNotMatch(target.text, /GAM completion override/i);
});

test("S79-T-003: high-salience Copy ordering protected on TARGET", () => {
  const target = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: "Generate Activity Materials",
    outputName: "page",
    workflowSteps: buildGamWorkflow().steps,
    adapters: liveContractAdapters(api)
  });
  const text = target.text;
  assert.ok(text.length > 500, "TARGET Copy text present");
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
  assert.ok(contractPos >= 0, "contract present");
  assert.ok(commissionPos > contractPos, "schema before commission");
  assert.ok(briefPos > commissionPos, "commission before authoring brief");
  assert.ok(gatePos >= 0 && completionPos > gatePos, "gate before completion override");
  assert.ok(footerPos > completionPos, "completion override before literal footer");
  assert.ok(mathPos > footerPos, "math after footer");
  assert.ok(pipelinePos > mathPos, "pipeline completion last among protected markers");
});

test("S79-T-003: path-specific differences remain path-specific", () => {
  const wf = buildGamWorkflow();
  const copy = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.COPY_V2_PARTIAL,
    dlaPage: dlaCommission,
    stepIndex: 2,
    stepTitle: "Generate Activity Materials",
    outputName: "page",
    workflowSteps: wf.steps,
    adapters: liveContractAdapters(api)
  }).text;
  const studio = assembler.assembleGamCanonicalPrompt({
    profile: assembler.PROFILES.STUDIO_V2_PARTIAL,
    libraryBody: "STUDIO_LIBRARY_BODY: Populate materials from DLA required_materials.",
    adapters: Object.assign(liveContractAdapters(api), {
      applyStudioRuntimeScaffolds(body) {
        let draft = String(body || "").trim();
        const ctx = {
          stepCanonicalStepId: "step_generate_activity_materials",
          stepTitle: "Generate Activity Materials"
        };
        draft = api.applyEducationalQualityFrameworkPromptBlockToDraft(draft, ctx);
        draft = api.applyMathSafeOutputContractToDraft(draft, ctx);
        return draft;
      }
    })
  }).text;
  assert.notEqual(copy, studio);
  assert.match(copy, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.doesNotMatch(studio, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.match(copy, /GAM completion override/i);
  assert.doesNotMatch(studio, /GAM completion override/i);
});

test("S79-T-003: assembler API remains available for direct TARGET invocation", () => {
  assert.equal(typeof assembler.assembleGamCanonicalPrompt, "function");
  assert.equal(typeof assembler.applyGamStudioGraft, "function");
  assert.equal(assembler.LIVE_PRODUCTION, true);
  // Live production switch is covered by S79-T-005; this suite keeps TARGET API checks.
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSrc, /resolveGamCanonicalAssemblerLib/);
  assert.match(appSrc, /buildLiveGamV2CopyPromptViaCanonicalAssembler/);
});

test("S79-T-003: guided-review drift preserved (live fallback via adapters)", () => {
  const live = api.buildGamV2CopilotSchemaInstructions();
  const nodeContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
  const nodeDirect = nodeContract.buildGamPageEnrichContractBlock();
  assert.equal(live.includes("hard maximum 5"), false);
  assert.equal(nodeDirect.includes("hard maximum 5"), true);
  const targetViaLive = assembler.buildSectionOutputContract({
    adapters: liveContractAdapters(api)
  });
  assert.equal(targetViaLive.includes("hard maximum 5"), false);
  assert.equal(targetViaLive, live);
});

test("S79-T-003: compatibility paths untouched (pack-text + materials-preserve still present)", () => {
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "gam-output-format.js")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "page-gam-materials-preserve.js")));
  const pack = fs.readFileSync(path.join(repoRoot, "lib", "gam-output-format.js"), "utf8");
  const preserve = fs.readFileSync(
    path.join(repoRoot, "lib", "page-gam-materials-preserve.js"),
    "utf8"
  );
  assert.match(pack, /pack/i);
  assert.match(preserve, /preserve/i);
  const assemblerSrc = fs.readFileSync(
    path.join(repoRoot, "lib", "gam-canonical-assembler.js"),
    "utf8"
  );
  assert.doesNotMatch(assemblerSrc, /gam-output-format/);
  assert.doesNotMatch(assemblerSrc, /page-gam-materials-preserve/);
});
