/**
 * S78-T-012 — GAM operand-aware model/practice independence authoring (S78-WS-2).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const gamWs2 = require(path.join(repoRoot, "lib", "gam-practice-independence-prompt.js"));
const patternLib = require(path.join(repoRoot, "lib", "instructional-pattern-prompt.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

function lagrangianShapedPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    activities: [
      {
        activity_id: "A3",
        required_materials: [
          {
            material_id: "A3-M1",
            material_type: "scenario",
            purpose: "Provide the utility-maximisation problem to be solved.",
            specification: "One introductory utility-maximisation instance."
          },
          {
            material_id: "A3-M2",
            material_type: "worked_example",
            purpose: "Model the solution method on a distinct instance.",
            specification: "Worked example on a different optimisation instance from A3-M1.",
            practice_independence: {
              attempt_operand_material_ids: ["A3-M1"]
            }
          },
          {
            material_id: "A3-M3",
            material_type: "analysis_table",
            purpose: "Learner workspace.",
            specification: "Editable table; learners complete substantive entries.",
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "table_complete"
            }
          }
        ]
      }
    ]
  };
}

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

test("G1: bound model commission produces distinct-operand authoring block", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(lagrangianShapedPage());
  assert.match(section, /S78-WS-2 MODEL-PRACTICE-INDEPENDENCE \(auto-applied\)/);
  assert.match(section, /A3-M2 \(worked_example\)/);
  assert.match(section, /A3-M1 \(scenario\)/);
  assert.match(section, /LEARNER-OWNED/i);
  assert.match(section, /DISTINCT comparable operand/i);
  assert.match(section, /MUST NOT copy, restate, solve, answer/i);
});

test("G2: block requires same target method/capability demonstration", () => {
  const block = gamWs2.buildS78Ws2OperandAwareAuthoringBlock(lagrangianShapedPage());
  assert.match(block, /same target method\/capability/i);
  assert.match(block, /near-transfer instance/i);
});

test("G3: bridge transfers method not attempt answer", () => {
  const block = gamWs2.buildS78Ws2OperandAwareAuthoringBlock(lagrangianShapedPage());
  assert.match(block, /Bridge.*transfer method/i);
  assert.match(block, /not the attempt's answer/i);
  const sp06 = patternLib.buildSp06PromptBlock();
  assert.match(sp06, /S78-WS-2 MODEL-PRACTICE-INDEPENDENCE/);
  assert.match(sp06, /Bridge transfers method only/i);
});

test("G4: page without practice_independence emits no WS2 block", () => {
  const page = {
    activities: [
      {
        activity_id: "A1",
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "worked_example",
            purpose: "Model only.",
            specification: "Study-only worked example."
          }
        ]
      }
    ]
  };
  assert.equal(gamWs2.buildS78Ws2OperandAwareAuthoringBlock(page), "");
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(page);
  assert.doesNotMatch(section, /S78-WS-2 MODEL-PRACTICE-INDEPENDENCE/);
});

test("G5: guided-only page without binding has no WS2 block", () => {
  const page = {
    activities: [
      {
        activity_id: "A2",
        required_materials: [
          { material_id: "A2-M1", material_type: "scenario", purpose: "Operand.", specification: "Problem." },
          { material_id: "A2-M2", material_type: "worked_example", purpose: "Model.", specification: "Distinct intro." },
          {
            material_id: "A2-M3",
            material_type: "template",
            purpose: "Guided workspace.",
            specification: "Partial scaffold.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_complete" }
          }
        ]
      }
    ]
  };
  assert.equal(gamWs2.collectPracticeIndependenceBindingsFromPage(page).length, 0);
});

test("G6: one model bound to multiple attempt operand ids", () => {
  const page = {
    activities: [
      {
        activity_id: "A2",
        required_materials: [
          { material_id: "A2-M1", material_type: "task_card", purpose: "Problems set A.", specification: "Set A." },
          { material_id: "A2-M4", material_type: "scenario", purpose: "Problems set B.", specification: "Set B." },
          {
            material_id: "A2-M2",
            material_type: "modelling_note",
            purpose: "Process model.",
            specification: "Process on distinct reference instance.",
            practice_independence: {
              attempt_operand_material_ids: ["A2-M1", "A2-M4"]
            }
          }
        ]
      }
    ]
  };
  const block = gamWs2.buildS78Ws2OperandAwareAuthoringBlock(page);
  assert.match(block, /A2-M1 \(task_card\)/);
  assert.match(block, /A2-M4 \(scenario\)/);
  assert.match(block, /do not disclose or complete those operands/i);
});

test("G7: WS2 block preserves response_fulfilment coexistence language", () => {
  const block = gamWs2.buildS78Ws2OperandAwareAuthoringBlock(lagrangianShapedPage());
  assert.match(block, /preserve response_fulfilment blank cells/i);
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(lagrangianShapedPage());
  assert.match(section, /"response_fulfilment"/);
  assert.match(section, /"practice_independence"/);
});

test("G8: Lagrangian-shaped binding in assembled commission section", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(lagrangianShapedPage());
  assert.match(section, /different near-transfer instance/i);
  assert.match(section, /same target method\/capability on a DISTINCT comparable operand/i);
  assert.match(section, /do not disclose or complete those operands/i);
});

test("GAM contract mentions practice_independence authoring rule", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /practice_independence is present on worked_example or modelling_note/i);
  assert.match(block, /distinct operand instance/i);
});

test("projection preserves practice_independence in authoritative commission JSON", () => {
  const payload = api.projectGamAuthoritativeDlaCommissionFromPage(lagrangianShapedPage());
  const modelRow = payload.activities[0].required_materials.find((r) => r.material_id === "A3-M2");
  assert.deepEqual(modelRow.practice_independence, {
    attempt_operand_material_ids: ["A3-M1"]
  });
});

test("assembled GAM prompt verification: six salience points present locally", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(lagrangianShapedPage());
  assert.match(section, /worked_example/, "model material type visible in commission");
  assert.match(section, /A3-M2/, "model material id");
  assert.match(section, /A3-M1/, "attempt operand id");
  assert.match(section, /DISTINCT comparable operand/i, "distinct operand requirement");
  assert.match(section, /same target method\/capability/i, "method continuity");
  assert.match(section, /MUST NOT copy, restate, solve, answer/i, "no attempt disclosure");
  assert.match(section, /response_fulfilment blank cells/i, "learner workspace preserved");
});

test("WS2 block is not duplicated on re-apply", () => {
  const page = lagrangianShapedPage();
  const once = gamWs2.applyS78Ws2PracticeIndependenceBlockToDraft("BASE", page);
  const twice = gamWs2.applyS78Ws2PracticeIndependenceBlockToDraft(once, page);
  assert.equal(once, twice);
  assert.equal((once.match(/S78-WS-2 MODEL-PRACTICE-INDEPENDENCE/gi) || []).length, 1);
});

test("prompt size: WS2 block remains bounded", () => {
  const block = gamWs2.buildS78Ws2OperandAwareAuthoringBlock(lagrangianShapedPage());
  assert.ok(block.length > 200);
  assert.ok(block.length < 2000, "WS2 block unexpectedly large: " + block.length);
});
