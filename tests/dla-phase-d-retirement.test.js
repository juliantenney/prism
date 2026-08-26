/**
 * DLA Phase D — temporary rollback / obsolete dual-builder retirement.
 *
 * Proves: no production rollback selector; canonical-only Copy/Studio;
 * fail-closed when assembler missing; pre-delete baselines unchanged.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const FIXTURE_DIR = path.join(__dirname, "fixtures", "dla-phase-d");
const meta = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, "baseline-meta.json"), "utf8"));

function sha(s) {
  return crypto.createHash("sha256").update(String(s || ""), "utf8").digest("hex");
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
    sandbox
  };
}

function buildDlaWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-dla-phase-d",
      goal: "Phase D retirement",
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
        }
      ]
    },
    overrides || {}
  );
}

const loaded = loadPrismTestApi();
const api = loaded.api;
const dla = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

test("Phase D: production has no rollback selector or OLD dual inject", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.doesNotMatch(appSrc, /function isDlaCanonicalAssemblerEnabled/);
  assert.doesNotMatch(appSrc, /dlaCanonicalAssembler/);
  assert.doesNotMatch(appSrc, /buildDlaPageEnrichContractBlock/);
  assert.doesNotMatch(appSrc, /buildCanonicalDlaPageShapeSnippet/);
  assert.match(appSrc, /requireLdDlaPageEnrichContractLib/);
  assert.match(appSrc, /Canonical DLA assembler unavailable/);
  assert.equal(typeof dla.buildDlaPageEnrichContractBlock, "undefined");
  assert.equal(typeof dla.buildCanonicalDlaPageShapeSnippet, "undefined");
});

test("Phase D: missing assembler fails closed (Copy + Studio)", () => {
  const stripped = loadPrismTestApi();
  stripped.sandbox.window.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = undefined;
  stripped.sandbox.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = undefined;
  if (stripped.sandbox.globalThis && stripped.sandbox.globalThis !== stripped.sandbox) {
    stripped.sandbox.globalThis.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = undefined;
  }
  assert.equal(stripped.api.resolveLdDlaPageEnrichContractLib(), null);
  assert.throws(
    () => stripped.api.requireLdDlaPageEnrichContractLib(),
    /Canonical DLA assembler unavailable/
  );
  const wf = buildDlaWorkflow();
  stripped.api.setWorkflowsForTest([wf]);
  stripped.api.setSelectedWorkflowIdForTest(wf.id);
  const dlaStep = wf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  assert.throws(
    () => stripped.api.buildWorkflowStepInstructions(dlaStep, 2, null),
    /Canonical DLA assembler unavailable/
  );
  assert.throws(
    () =>
      stripped.api.applyWorkflowStepRuntimePromptAugmentations(
        "DLA pack body for studio assembly.",
        dlaStep,
        wf
      ),
    /Canonical DLA assembler unavailable/
  );
});

test("Phase D: pre-delete canonical bare/slotted byte-identity", () => {
  const bare = dla.assembleDlaCanonicalContract().text;
  const slotted = dla.assembleDlaCanonicalContract({
    workbookOverlay: true,
    overlayText: dla.buildDlaWorkbookOverlayBlock(),
    includeExamples: true,
    productionSlot: "PHASE-D-PROD-SLOT",
    commissioningSlot: "PHASE-D-COMM-SLOT",
    outputSlot: "PHASE-D-OUT-SLOT"
  }).text;
  assert.equal(bare, fs.readFileSync(path.join(FIXTURE_DIR, "canonical-bare.txt"), "utf8"));
  assert.equal(slotted, fs.readFileSync(path.join(FIXTURE_DIR, "canonical-slotted.txt"), "utf8"));
  assert.equal(sha(bare), meta.sha256.canonicalBare);
  assert.equal(sha(slotted), meta.sha256.canonicalSlotted);
  assert.equal(bare.length, meta.lengths.canonicalBare);
});

test("Phase D: live Copy/Studio/assemble match pre-delete baselines", () => {
  const wf = buildDlaWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const dlaStep = wf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  const copyInstr = api.buildWorkflowStepInstructions(dlaStep, 2, null);
  const studio = api.applyWorkflowStepRuntimePromptAugmentations(
    "DLA pack body for studio assembly.",
    dlaStep,
    wf
  );
  const liveAssemble = api.assembleLiveDlaCanonicalPrompt({}, {});
  assert.equal(copyInstr, fs.readFileSync(path.join(FIXTURE_DIR, "live-copy-instructions.txt"), "utf8"));
  assert.equal(studio, fs.readFileSync(path.join(FIXTURE_DIR, "live-studio-augment.txt"), "utf8"));
  assert.equal(liveAssemble, fs.readFileSync(path.join(FIXTURE_DIR, "live-assemble.txt"), "utf8"));
  assert.equal(sha(copyInstr), meta.sha256.liveCopy);
  assert.equal(sha(studio), meta.sha256.liveStudio);
  assert.equal(sha(liveAssemble), meta.sha256.liveAssemble);
  assert.equal((copyInstr.split("## 1. DLA ROLE AND AUTHORITY").length - 1), 1);
  assert.equal((studio.split("## 1. DLA ROLE AND AUTHORITY").length - 1), 1);
  assert.doesNotMatch(copyInstr, /### Sprint 58 vNext DLA partial-page contract/);
  assert.doesNotMatch(studio, /### Sprint 58 vNext DLA partial-page contract/);
});

test("Phase D: genuine product modules remain", () => {
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "page-dla-enrich.js")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "dla-practice-independence.js")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "dla-production-fulfilment.js")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib", "dla-diagnostic-review.js")));
  assert.equal(typeof dla.assembleDlaCanonicalContract, "function");
  assert.equal(typeof dla.buildDlaWorkbookOverlayBlock, "function");
  assert.equal(typeof dla.buildInstructionalArchetypePlanningGuidance, "function");
});
