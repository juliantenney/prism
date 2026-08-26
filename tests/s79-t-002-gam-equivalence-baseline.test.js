/**
 * S79-T-002 — Canonical GAM section inventory + equivalence baseline harness.
 *
 * DESIGN + TESTS ONLY. Does not switch production assembly paths.
 * Captures current live Run/Copy and Studio assembled GAM prompts for later
 * OLD-vs-TARGET comparison (T-003/T-004).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const FIXTURE_DIR = path.join(__dirname, "fixtures", "s79-t-002");
const GOLDEN_DIR = FIXTURE_DIR;
const UPDATE = process.env.UPDATE_S79_BASELINES === "1";

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
  return sandbox.window.__PRISM_TEST_API;
}

function sha256(text) {
  return crypto.createHash("sha256").update(String(text || ""), "utf8").digest("hex");
}

function buildGamWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-s79-t002-gam",
      goal: "S79 T-002 baseline",
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

function assertSharedNormativeMarkers(text, label) {
  assert.match(text, /### Sprint 58 vNext GAM partial-page contract/i, label + ": contract");
  assert.match(text, /Canonical GAM partial shape/i, label + ": shape");
  assert.match(text, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i, label + ": gate");
  assert.match(text, /S78-D04 page learner-resource closure/i, label + ": closure");
  assert.match(text, /S78-T-041 transfer_prompt/i, label + ": transfer");
  assert.match(text, /S78-T-042 structured workspace fidelity/i, label + ": workspace");
  assert.match(text, /S78-DP/i, label + ": disciplinary");
  assert.equal(
    (text.match(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/gi) || []).length,
    1,
    label + ": gate once"
  );
}

function writeOrCompareGolden(name, text) {
  const file = path.join(GOLDEN_DIR, name);
  if (UPDATE || !fs.existsSync(file)) {
    fs.writeFileSync(file, text, "utf8");
    return { wrote: true, hash: sha256(text) };
  }
  const expected = fs.readFileSync(file, "utf8");
  assert.equal(
    text,
    expected,
    name + " differs from committed baseline (set UPDATE_S79_BASELINES=1 to refresh intentionally)"
  );
  return { wrote: false, hash: sha256(text) };
}

function extractBetween(text, startRe, endRe) {
  const start = text.search(startRe);
  if (start < 0) return "";
  const rest = text.slice(start);
  const endRel = endRe ? rest.slice(1).search(endRe) : -1;
  if (endRel < 0) return rest;
  return rest.slice(0, endRel + 1);
}

const api = loadPrismTestApi();

test("S79-T-002: Run/Copy V2 partial assembled prompt baseline is stable", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const copyPrompt = api.buildWorkflowStepInstructions(gamStep, 2, null);
  assert.ok(copyPrompt && copyPrompt.length > 500, "Copy prompt non-empty");
  assertSharedNormativeMarkers(copyPrompt, "Copy");
  assert.match(copyPrompt, /Material authoring guidance \(Sprint 56F v2/i);
  assert.match(copyPrompt, /GAM completion override/i);
  assert.match(copyPrompt, /STEP 3 OUTPUT: page/);
  assert.match(copyPrompt, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.match(copyPrompt, /A1-M1/);
  assert.match(copyPrompt, /practice_independence/i);
  assert.match(copyPrompt, /response_fulfilment/i);
  // Ordering: gate before completion override
  const gateIdx = copyPrompt.search(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i);
  const completionIdx = copyPrompt.search(/GAM completion override/i);
  assert.ok(completionIdx > gateIdx, "gate before completion override");
  // Post-assembly: pipeline completion directive appended last.
  assert.match(copyPrompt, /Pipeline completion rule:/i);
  const result = writeOrCompareGolden("run-copy-partial-baseline.txt", copyPrompt);
  assert.equal(result.hash.length, 64);
});

test("S79-T-002: Studio runtime-augmented prompt baseline is stable", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const studioPrompt = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );
  assert.ok(studioPrompt && studioPrompt.length > 400, "Studio prompt non-empty");
  assertSharedNormativeMarkers(studioPrompt, "Studio");
  assert.match(studioPrompt, /STUDIO_LIBRARY_BODY/);
  // Partial mode: Studio graft does NOT inject AUTHORITATIVE commission (path-specific).
  assert.doesNotMatch(
    studioPrompt,
    /AUTHORITATIVE DLA MATERIAL COMMISSION/i,
    "Studio partial path must not silently invent commission embed (current live behaviour)"
  );
  const result = writeOrCompareGolden("studio-partial-baseline.txt", studioPrompt);
  assert.equal(result.hash.length, 64);
});

test("S79-T-002: live API contract+shape+gate are stable and shared by Copy/Studio injectors", () => {
  // Use live API builders (VM/app path). Direct Node require of ld-gam-page-enrich-contract
  // can diverge when guided-review-generation-contract resolves differently — record that
  // as inventory evidence, do not silently unify in T-002.
  const fromApi = api.buildGamV2CopilotSchemaInstructions();
  const gate = api.resolveGamFinalSilentPreEmitConsistencyGate();
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(fromApi, /### Sprint 58 vNext GAM partial-page contract/i);
  assert.match(fromApi, /Canonical GAM partial shape/i);
  assert.equal(typeof gate, "string");
  assert.match(gate, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i);
  assert.ok(brief.trim().endsWith(String(gate).trim()));
  assert.equal(gate, gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE);
  writeOrCompareGolden("shared-live-contract-shape.txt", fromApi);
  writeOrCompareGolden("shared-pre-emit-gate.txt", gate);

  const nodeDirect = gamContract.buildGamPageEnrichContractBlock();
  const guidedDrift =
    nodeDirect.includes("hard maximum 5") && !fromApi.includes("hard maximum 5");
  writeOrCompareGolden(
    "guided-review-bootstrap-note.json",
    JSON.stringify(
      {
        finding: guidedDrift
          ? "SUSPECTED DRIFT / REQUIRES DECISION — Node require() contract includes full guided-review lines; live VM/app builder uses fallback guided-review stub unless guided-review-generation-contract is bootstrapped"
          : "BYTE-IDENTICAL guided-review surface across Node require and live API",
        node_has_hard_maximum_5: nodeDirect.includes("hard maximum 5"),
        live_api_has_hard_maximum_5: fromApi.includes("hard maximum 5")
      },
      null,
      2
    ) + "\n"
  );
});

test("S79-T-002: Run/Copy vs Studio equivalence classification markers", () => {
  const wf = buildGamWorkflow();
  setup(api, wf);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const copyPrompt = api.buildWorkflowStepInstructions(gamStep, 2, null);
  const studioPrompt = api.applyWorkflowStepRuntimePromptAugmentations(
    String(gamStep.override_prompt_body || ""),
    gamStep,
    wf
  );

  const liveContractShape = api.buildGamV2CopilotSchemaInstructions();
  const gate = api.resolveGamFinalSilentPreEmitConsistencyGate();

  assert.ok(copyPrompt.includes(liveContractShape));
  assert.ok(studioPrompt.includes(liveContractShape));
  assert.ok(copyPrompt.includes(gate));
  assert.ok(studioPrompt.includes(gate));

  // Path-specific by design (current live):
  assert.match(copyPrompt, /GAM completion override/i);
  assert.doesNotMatch(studioPrompt, /GAM completion override/i);
  assert.match(copyPrompt, /Material authoring guidance \(Sprint 56F v2/i);
  assert.doesNotMatch(studioPrompt, /Material authoring guidance \(Sprint 56F v2/i);
  assert.match(copyPrompt, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  assert.doesNotMatch(studioPrompt, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);

  // Studio may include shared L4 runtime contracts not injected on V2 Copy bypass path.
  // Record presence as classification evidence (do not "fix" in T-002).
  const studioHasMaterialsCopy = /LD-MATERIALS-COPY/i.test(studioPrompt);
  const copyHasMaterialsCopy = /LD-MATERIALS-COPY/i.test(copyPrompt);
  const studioHasTableFidelity = /LD-TABLE-FIDELITY/i.test(studioPrompt);
  const copyHasTableFidelity = /LD-TABLE-FIDELITY/i.test(copyPrompt);
  const studioHasArchetype = /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/i.test(studioPrompt);
  const copyHasArchetype = /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/i.test(copyPrompt);
  const classification = {
    live_contract_shape_gate: "BYTE-IDENTICAL (shared live API builders on both paths)",
    authoritative_commission_partial: "PATH-SPECIFIC BY DESIGN (Copy yes / Studio no in partial mode)",
    gam_completion_override: "PATH-SPECIFIC BY DESIGN (Copy only)",
    authoring_brief: "PATH-SPECIFIC BY DESIGN (Copy only)",
    pipeline_framing_and_footer: "PATH-SPECIFIC BY DESIGN (Copy/Run instructions wrapper)",
    materials_copy_marker: {
      studio: studioHasMaterialsCopy,
      copy: copyHasMaterialsCopy,
      class:
        studioHasMaterialsCopy !== copyHasMaterialsCopy
          ? "SUSPECTED DRIFT / REQUIRES DECISION"
          : "BYTE-IDENTICAL OR BOTH ABSENT"
    },
    table_fidelity_marker: {
      studio: studioHasTableFidelity,
      copy: copyHasTableFidelity,
      class:
        studioHasTableFidelity !== copyHasTableFidelity
          ? "SUSPECTED DRIFT / REQUIRES DECISION"
          : "BYTE-IDENTICAL OR BOTH ABSENT"
    },
    archetype_routing_marker: {
      studio: studioHasArchetype,
      copy: copyHasArchetype,
      class:
        studioHasArchetype === copyHasArchetype
          ? "BOTH PRESENT OR BOTH ABSENT (post T-029/archetype delivery fix)"
          : "SUSPECTED DRIFT / REQUIRES DECISION"
    },
    t004_whole_prompt_byte_identity: "NOT REQUIRED — path-specific framing is legitimate",
    t004_narrow_byte_identity_boundary:
      "live buildGamV2CopilotSchemaInstructions() + GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE + protected ordering (gate before completion override on Copy)"
  };
  writeOrCompareGolden(
    "equivalence-classification.json",
    JSON.stringify(classification, null, 2) + "\n"
  );
});

test("S79-T-002: commission projection includes WS2/OPS when bindings present", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(dlaCommission);
  assert.match(section, /AUTHORITATIVE DLA MATERIAL COMMISSION/);
  assert.match(section, /A1-M1/);
  assert.match(section, /A2-M1/);
  // WS2 / OPS blocks are conditional on page bindings; presence recorded for baseline.
  const hasWs2 = /S78-WS-2 MODEL-PRACTICE-INDEPENDENCE/i.test(section);
  const hasOps = /S78-OPERATIONAL-SUITABILITY/i.test(section);
  assert.equal(hasWs2, true, "fixture includes practice_independence → WS2 block expected");
  assert.equal(hasOps, true, "fixture obligated materials → OPS authoring block expected");
  writeOrCompareGolden("authoritative-commission-section.txt", section);
});

test("S79-T-002: non-partial enrich-in-place embed path still available", () => {
  const wf = buildGamWorkflow({
    partialPageOutputs: false,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: false }
  });
  setup(api, wf);
  const embed = api.buildUpstreamDlaPageEmbedSectionForGamCopy(wf);
  assert.match(embed, /### Upstream DLA page/i);
  assert.match(embed, /Activity count invariant/i);
  assert.doesNotMatch(embed, /AUTHORITATIVE DLA MATERIAL COMMISSION/i);
  writeOrCompareGolden("upstream-dla-embed-nonpartial.txt", embed);
});

test("S79-T-002: production paths unchanged — no gamCanonicalAssembler flag introduced", () => {
  const appSrc = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  // S79-T-005 routes live assembly through the canonical module without a product feature flag.
  assert.doesNotMatch(appSrc, /gamCanonicalAssembler\s*[:=]/);
  assert.doesNotMatch(appSrc, /workflowOutputSpec\.gamCanonicalAssembler/);
  assert.match(appSrc, /function buildGamV2CopyMaterialAuthoringBrief/);
  assert.match(appSrc, /function applyGamPageEnrichPromptBlockToDraft/);
  assert.match(appSrc, /function buildWorkflowStepInstructions/);
});
