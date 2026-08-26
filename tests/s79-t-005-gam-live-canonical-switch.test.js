/**
 * S79-T-005 — Atomic live-path switch to canonical GAM assembly.
 * Proves LIVE production prompts match committed T-002 goldens and that
 * reachable Studio scaffolds remain in the live chain.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const FIXTURE_DIR = path.join(__dirname, "fixtures", "s79-t-002");
const dlaCommission = JSON.parse(
  fs.readFileSync(path.join(FIXTURE_DIR, "dla-commission-baseline.json"), "utf8")
);

function sha256(text) {
  return crypto.createHash("sha256").update(String(text || ""), "utf8").digest("hex");
}

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
    assembler: sandbox.window.PRISM_GAM_CANONICAL_ASSEMBLER || sandbox.PRISM_GAM_CANONICAL_ASSEMBLER
  };
}

function buildGamWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-s79-t005-gam",
      goal: "S79 T-005 live switch",
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

test("S79-T-005: live canonical assembler is enabled (no product feature flag)", () => {
  assert.ok(assembler, "PRISM_GAM_CANONICAL_ASSEMBLER bootstrapped");
  assert.equal(assembler.LIVE_PRODUCTION, true);
  assert.equal(api.isGamCanonicalAssemblerLiveEnabled(), true);
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSrc, /buildLiveGamV2CopyPromptViaCanonicalAssembler/);
  assert.match(appSrc, /applyGamStudioGraft/);
  assert.doesNotMatch(appSrc, /workflowOutputSpec\.gamCanonicalAssembler/);
  assert.doesNotMatch(appSrc, /gamCanonicalAssembler\s*[:=]/);
});

test("S79-T-005: LIVE Copy after switch == T-002 Copy golden (byte)", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const liveCopy = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const golden = fs.readFileSync(path.join(FIXTURE_DIR, "run-copy-partial-baseline.txt"), "utf8");
  assert.equal(liveCopy, golden);
  assert.equal(sha256(liveCopy), sha256(golden));
  assert.equal(liveCopy.length, 31989);
  assert.match(liveCopy, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.match(liveCopy, /GAM completion override/i);
  assert.match(liveCopy, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i);
  assert.ok(
    liveCopy.indexOf("FINAL SILENT PRE-EMIT CONSISTENCY CHECK") <
      liveCopy.indexOf("GAM completion override")
  );
});

test("S79-T-005: LIVE Studio after switch == T-002 Studio golden (byte)", () => {
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
  assert.equal(sha256(liveStudio), sha256(golden));
  assert.equal(liveStudio.length, 20333);
  assert.doesNotMatch(liveStudio, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.doesNotMatch(liveStudio, /GAM completion override/i);
  assert.match(liveStudio, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i);
});

test("S79-T-005: Copy and Studio remain path-specific after atomic switch", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const liveCopy = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const liveStudio = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );
  assert.notEqual(liveCopy, liveStudio);
});

test("S79-T-005: Studio live chain still invokes full pre-graft scaffold functions", () => {
  // Prove the live Studio entry still calls the full augmentation pipeline before graft,
  // not EQF+math-only defaults from assembleStudioV2.
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const augFn = appSrc.match(
    /function applyWorkflowStepRuntimePromptAugmentations[\s\S]*?return String\(draft \|\| ""\)\.trim\(\);\r?\n  \}/
  );
  assert.ok(augFn, "augmentation function present");
  const body = augFn[0];
  assert.match(body, /applyEducationalQualityFrameworkPromptBlockToDraft/);
  assert.match(body, /applyLdTableFidelityContractToDraft/);
  assert.match(body, /applyLdMaterialsCopyContractToDraft/);
  assert.match(body, /applyLdInstructionalArchetypeRoutingToDraft/);
  assert.match(body, /applyMathSafeOutputContractToDraft/);
  assert.match(body, /applyGamPageEnrichPromptBlockToDraft/);
  // Graft is last among these applies.
  assert.ok(
    body.lastIndexOf("applyGamPageEnrichPromptBlockToDraft") >
      body.lastIndexOf("applyMathSafeOutputContractToDraft")
  );
});

test("S79-T-005: Studio scaffold branch — table fidelity injects when self-directed gate true", () => {
  const wf = buildGamWorkflow({
    goal: "self-directed independent study learner page materials",
    desiredOutputs: "self-directed learner materials workbook"
  });
  // Force scaffold gate if API exposes it; otherwise exercise apply path with enriched context.
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const ctx = {
    stepCanonicalStepId: "step_generate_activity_materials",
    stepTitle: "Generate Activity Materials",
    stepCanonicalTitle: "Generate Activity Materials",
    stepOutputName: "page",
    workflowGoal: "self-directed independent study learner page",
    desiredOutputs: "self-directed learner materials"
  };
  let draft = "STUDIO_LIBRARY_BODY: branch coverage for table fidelity.";
  draft = api.applyLdTableFidelityContractToDraft(draft, ctx);
  draft = api.applyLdMaterialsCopyContractToDraft(draft, ctx);
  draft = api.applyEducationalQualityFrameworkPromptBlockToDraft(draft, ctx);
  draft = api.applyMathSafeOutputContractToDraft(draft, ctx);
  draft = api.applyGamPageEnrichPromptBlockToDraftForTest(draft, ctx, wf);

  assert.match(draft, /### Sprint 58 vNext GAM partial-page contract/i);
  assert.match(draft, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i);
  // When gate opens, table/materials markers appear; when not, graft still present.
  const tableApplied = /LD-TABLE-FIDELITY \(auto-applied\)/i.test(draft);
  const materialsApplied = /LD-MATERIALS-COPY/i.test(draft);
  if (api.shouldApplySelfDirectedLearnerPageGamMaterialScaffold(ctx, {}, {
    goal: ctx.workflowGoal,
    desiredOutputs: ctx.desiredOutputs
  })) {
    assert.equal(tableApplied, true, "table fidelity must inject when scaffold gate true");
  } else {
    // Gate false for this brief — still prove graft via canonical path and no crash.
    assert.equal(typeof draft, "string");
  }
  assert.doesNotMatch(draft, /GAM completion override/i);
});

test("S79-T-005: guided-review live surface unchanged (no new drift)", () => {
  const live = api.buildGamV2CopilotSchemaInstructions();
  const nodeContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
  const nodeDirect = nodeContract.buildGamPageEnrichContractBlock();
  // Pre-existing: Node require may include full guided-review; live VM uses fallback.
  assert.equal(live.includes("hard maximum 5"), false);
  assert.equal(nodeDirect.includes("hard maximum 5"), true);
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const liveCopy = api.buildWorkflowStepInstructions(gamStep, 2, null);
  assert.equal(liveCopy.includes("hard maximum 5"), false);
  assert.ok(liveCopy.includes(live));
});

test("S79-T-005: temporary fallback retired by T-008 (fail-closed remains)", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.doesNotMatch(appSrc, /TEMPORARY FALLBACK/);
  assert.match(appSrc, /Canonical GAM assembler unavailable/);
  assert.match(appSrc, /function buildGamV2CopyMaterialAuthoringBrief/);
});
