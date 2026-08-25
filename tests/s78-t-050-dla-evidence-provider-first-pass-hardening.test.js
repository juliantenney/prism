/**
 * S78-T-050 — Harden DLA evidence-provider first-pass consistency (final silent P02 emit gate).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const pageDlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const { applyS76CommissionShape } = require("./s76-dla-commission-shape.js");
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

const GATE_HEADING = /FINAL SILENT PRE-EMIT CHECK \(P02\)/i;
const SILENT =
  /silently re-verify|Correct any inconsistency before emission|do not output checking or reasoning/i;
const NO_VISIBLE_REASONING = /do not output checking or reasoning/i;

test("T-050 DLA contract still contains canonical P02 invariant", () => {
  const output = dlaContract.assembleDlaCanonicalContract().sections.output;
  assert.match(output, /P02 provider-row closure \(evidence_requirement\)/i);
  assert.match(
    output,
    /every material_id in evidence_decision\.provider_material_ids MUST identify a required_materials\[\] row carrying a complete evidence_requirement/i
  );
  assert.match(
    output,
    /1\. P02 closure: for every provider_material_id, the matching required_materials\[\] row contains complete evidence_requirement/i
  );
});

test("T-050 assembled contract contains final silent pre-emit verification", () => {
  const assembled = dlaContract.assembleDlaCanonicalContract();
  const output = assembled.sections.output;
  assert.match(output, GATE_HEADING);
  assert.match(output, SILENT);
  assert.match(output, NO_VISIBLE_REASONING);
  assert.equal(
    output.trim().endsWith(String(dlaContract.DLA_P02_FINAL_SILENT_PRE_EMIT_GATE || "").trim()),
    true,
    "gate must be the final lines of the output section"
  );
});

test("T-050 gate covers every evidence-provider material reference via P02 invariant", () => {
  const gate = dlaContract.DLA_P02_FINAL_SILENT_PRE_EMIT_GATE;
  assert.match(gate, /provider_material_id/i);
  assert.match(gate, /evidence_requirement/i);
  assert.match(gate, /task_input_material_ids/i);
  assert.match(gate, /P02 provider-row closure invariant/i);
  assert.doesNotMatch(gate, /Hydrology|A5-M5|drainage|precipitation/i);
});

test("T-050 gate requires correction before emission and forbids visible reasoning", () => {
  const gate = dlaContract.DLA_P02_FINAL_SILENT_PRE_EMIT_GATE;
  assert.match(gate, /Correct any inconsistency before emission/i);
  assert.match(gate, /Emit only the corrected artefact/i);
  assert.match(gate, /do not output checking or reasoning/i);
  assert.doesNotMatch(gate, /show your (work|reasoning)|chain.of.thought|explain your check/i);
});

test("T-050 live assembled DLA prompt includes the final gate near emission", () => {
  assert.equal(typeof api.assembleLiveDlaCanonicalPrompt, "function");
  const live = api.assembleLiveDlaCanonicalPrompt({}, { dlaCanonicalAssembler: true });
  assert.match(live, /## 1\. DLA ROLE AND AUTHORITY/);
  assert.match(live, GATE_HEADING);
  assert.match(live, /Correct any inconsistency before emission/i);
  const gateIdx = live.search(GATE_HEADING);
  const checklistIdx = live.search(/Pre-output deterministic capture checks/i);
  const examplesIdx = live.search(/## \d+\. ILLUSTRATIVE|## \d+\. EXAMPLES|Illustrative miniature/i);
  assert.ok(checklistIdx >= 0, "checklist present");
  assert.ok(gateIdx > checklistIdx, "final gate after checklist");
  if (examplesIdx >= 0) {
    assert.ok(gateIdx < examplesIdx, "final gate before examples section");
  }
});

test("T-050 live Copilot schema path includes the final gate", () => {
  assert.equal(typeof api.buildDlaV2CopilotSchemaInstructions, "function");
  const wf = {
    schema_version: "2.0.0",
    workflowOutputSpec: { partialPageOutputs: true, pageEnrichmentV2: true },
    dlaCanonicalAssembler: true
  };
  const schemaInstr = api.buildDlaV2CopilotSchemaInstructions(wf, {
    canonical_step_id: "step_design_learning_activities",
    title: "Design Learning Activities",
    outputName: "page"
  });
  assert.match(schemaInstr, GATE_HEADING);
  assert.match(schemaInstr, /do not output checking or reasoning/i);
  assert.match(schemaInstr, /Correct any inconsistency before emission/i);
});

test("T-050 validator behaviour unchanged for missing evidence_requirement", () => {
  const activity = applyS76CommissionShape(
    {
      activity_id: "A1",
      title: "Evidence activity",
      grouping: "individual",
      duration_minutes: 15,
      learning_outcome_ids: ["LO1"],
      learner_task: "Inspect the cases and justify a conclusion.",
      expected_output: "A justified conclusion with cited features.",
      activity_preamble: "Inspect observations before judging.",
      intellectual_coherence_bridge:
        "You have the page orientation; now complete this activity's production.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-M1"]
      },
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "scenario",
          purpose: "Provide inspectable cases.",
          specification: "Two short cases with observable features."
        }
      ],
      evidence_decision: {
        required: true,
        reason: "Learner must inspect particulars.",
        provider_material_ids: ["A1-M1"]
      },
      materials: [],
      episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
    },
    { fillBridge: true }
  );
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Test page",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Interpret evidence." }],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: activity.episode_plan
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    activities: [activity],
    source_artefacts: [],
    generation_notes: {}
  };
  const check = pageDlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) =>
      /provider material_id A1-M1 must include evidence_requirement/i.test(e)
    )
  );
  assert.ok(check.errors.every((e) => !/FINAL SILENT PRE-EMIT/i.test(String(e))));
});

test("T-050 domain-general: no Hydrology-specific wording in gate or output section", () => {
  const assembled = dlaContract.assembleDlaCanonicalContract().text;
  assert.doesNotMatch(assembled, /Hydrology|A5-M5|drainage-basin|precipitation as basin/i);
  assert.match(assembled, GATE_HEADING);
});
