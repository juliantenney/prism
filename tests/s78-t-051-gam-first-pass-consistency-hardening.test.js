/**
 * S78-T-051 — Harden GAM first-pass semantic and quantitative consistency
 * (final silent pre-emit role/status + quantitative/derived gate).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const opsReviewSrc = fs.readFileSync(
  path.join(repoRoot, "lib", "gam-operational-suitability-review.js"),
  "utf8"
);
const opsPromptSrc = fs.readFileSync(
  path.join(repoRoot, "lib", "gam-operational-suitability-prompt.js"),
  "utf8"
);
const pageGamEnrichSrc = fs.readFileSync(path.join(repoRoot, "lib", "page-gam-enrich.js"), "utf8");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
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

const GATE_HEADING = /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/i;
const ROLE_STATUS =
  /Role\/status:.*pedagogical role\/status|intended category|contrast polarity|constrained vs unconstrained/i;
const QUANT =
  /Quantitative\/derived.*silently recompute\/verify|answer-bearing particulars/i;
const QUANT_CONDITIONAL = /only when the material contains|Skip when the material is purely qualitative/i;
const CORRECT_BEFORE_EMIT = /Correct inconsistencies before emission/i;
const NO_REASONING = /do not output checking or reasoning/i;
const NO_DOMAIN = /Lagrangian|FOC|shadow price|advertising expenditure|λ\s*=\s*4|Hydrology/i;

test("T-051 canonical gate export exists with dual invariants", () => {
  const gate = gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE;
  assert.equal(typeof gate, "string");
  assert.match(gate, GATE_HEADING);
  assert.match(gate, ROLE_STATUS);
  assert.match(gate, QUANT);
  assert.match(gate, QUANT_CONDITIONAL);
  assert.match(gate, CORRECT_BEFORE_EMIT);
  assert.match(gate, NO_REASONING);
  assert.doesNotMatch(gate, NO_DOMAIN);
});

test("T-051 live GAM V2 Copy authoring brief ends with the silent pre-emit gate", () => {
  assert.equal(typeof api.buildGamV2CopyMaterialAuthoringBrief, "function");
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, GATE_HEADING);
  assert.match(brief, ROLE_STATUS);
  assert.match(brief, QUANT);
  assert.match(brief, QUANT_CONDITIONAL);
  assert.match(brief, CORRECT_BEFORE_EMIT);
  assert.match(brief, NO_REASONING);
  assert.equal(
    brief.trim().endsWith(String(gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE).trim()),
    true,
    "gate must be the final lines of the V2 Copy authoring brief"
  );
  assert.equal(
    (brief.match(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/gi) || []).length,
    1,
    "brief must contain the gate exactly once"
  );
});

test("T-051 gate requires role/status correction and forbids visible reasoning", () => {
  const gate = gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE;
  assert.match(gate, /Do not invent qualifications that flip that status/i);
  assert.match(gate, CORRECT_BEFORE_EMIT);
  assert.match(gate, /Emit only the corrected artefact/i);
  assert.match(gate, NO_REASONING);
  assert.doesNotMatch(gate, /show your (work|reasoning)|chain.of.thought|explain your check/i);
});

test("T-051 live operator Copy path includes the gate near emission", () => {
  const wf = {
    id: "wf-t051-gam",
    goal: "Test page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
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
        canonical_step_id: "step_generate_activity_materials"
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const gamStep = wf.steps[2];
  const instr = api.buildWorkflowStepInstructions(gamStep, 2, null);
  assert.match(instr, /Material authoring guidance \(Sprint 56F v2/i);
  assert.match(instr, GATE_HEADING);
  assert.match(instr, ROLE_STATUS);
  assert.match(instr, QUANT);
  assert.match(instr, CORRECT_BEFORE_EMIT);
  assert.match(instr, NO_REASONING);
  const gateIdx = instr.search(GATE_HEADING);
  const completionIdx = instr.search(/GAM completion override/i);
  assert.ok(gateIdx >= 0, "gate present");
  assert.ok(completionIdx > gateIdx, "gate before GAM completion override");
  // Soft authoring Case 1 language remains earlier; gate must not be only there.
  const inventIdx = instr.search(/do not invent pedagogical constraints the commission omits/i);
  assert.ok(inventIdx >= 0 && inventIdx < gateIdx, "gate after Case 1 soft guidance");
  assert.equal(
    (instr.match(/FINAL SILENT PRE-EMIT CONSISTENCY CHECK/gi) || []).length,
    1,
    "assembled Copy prompt must not duplicate the gate"
  );
  // Early Copilot contract may mention the STEP N OUTPUT footer line; gate must still
  // sit after Material authoring guidance (true pre-emit salience).
  const guidanceIdx = instr.search(/Material authoring guidance \(Sprint 56F v2/i);
  assert.ok(guidanceIdx >= 0 && gateIdx > guidanceIdx, "gate after authoring guidance section");
});

test("T-051 domain-general: no Lagrangian/economics-specific production wording", () => {
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  const gate = gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE;
  assert.doesNotMatch(gate, NO_DOMAIN);
  assert.doesNotMatch(brief.slice(brief.search(GATE_HEADING)), NO_DOMAIN);
});

test("T-051 existing GAM validators / OPS sources do not host the gate", () => {
  assert.doesNotMatch(opsReviewSrc, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/);
  assert.doesNotMatch(opsPromptSrc, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/);
  assert.doesNotMatch(pageGamEnrichSrc, /FINAL SILENT PRE-EMIT CONSISTENCY CHECK/);
  assert.doesNotMatch(opsReviewSrc, /S78-T-051/);
  assert.doesNotMatch(opsPromptSrc, /S78-T-051/);
  assert.doesNotMatch(pageGamEnrichSrc, /S78-T-051/);
});

test("T-051 resolver returns canonical gate for live path", () => {
  assert.equal(typeof api.resolveGamFinalSilentPreEmitConsistencyGate, "function");
  assert.equal(
    api.resolveGamFinalSilentPreEmitConsistencyGate(),
    gamContract.GAM_FINAL_SILENT_PRE_EMIT_CONSISTENCY_GATE
  );
});
