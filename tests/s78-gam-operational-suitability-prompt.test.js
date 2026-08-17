/**
 * S78-T-015 — GAM operational suitability authoring salience (prompt-contract tests).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const opsLib = require(path.join(repoRoot, "lib", "gam-operational-suitability-prompt.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));
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

function determinateQuantPage() {
  return {
    activities: [
      {
        activity_id: "A1",
        learner_task: "1. Solve the constrained allocation problem.\n2. Verify your candidate optimum.",
        expected_output: "Identification of optimal resource values.",
        task_material_decision: { task_input_material_ids: ["A1-M1"] },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "scenario",
            purpose: "Supply the allocation problem instance.",
            specification: "One self-contained constrained allocation instance."
          },
          {
            material_id: "A1-M2",
            material_type: "worked_example",
            purpose: "Complete worked solution on a reference instance.",
            specification: "Complete worked solution demonstrating the method."
          }
        ]
      }
    ]
  };
}

function candidate1ShapedPage() {
  return {
    activities: [
      {
        activity_id: "A4",
        learner_task:
          "1. Study the worked method.\n2. Solve the independent constrained allocation problem.\n3. Verify your optimum.",
        expected_output: "Candidate optimum values for the independent instance.",
        task_material_decision: { task_input_material_ids: ["A4-M2"] },
        required_materials: [
          {
            material_id: "A4-M1",
            material_type: "worked_example",
            purpose: "Model complete worked solution.",
            specification: "Complete worked solution on a distinct reference instance.",
            practice_independence: { attempt_operand_material_ids: ["A4-M2"] }
          },
          {
            material_id: "A4-M2",
            material_type: "task_card",
            purpose: "Independent practice operand.",
            specification: "Distinct instance for learner solve/verify."
          },
          {
            material_id: "A4-M3",
            material_type: "analysis_table",
            purpose: "Learner workspace.",
            specification: "Editable table for learner entries.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_complete" }
          }
        ]
      }
    ]
  };
}

function openHumanitiesPage() {
  return {
    activities: [
      {
        activity_id: "H1",
        learner_task: "1. Read the passage.\n2. Write an interpretive response.",
        expected_output: "Open-ended interpretive analysis; multiple defensible readings are valid.",
        task_material_decision: { task_input_material_ids: ["H1-M1"] },
        required_materials: [
          {
            material_id: "H1-M1",
            material_type: "scenario",
            purpose: "Literary passage for interpretation.",
            specification: "Short passage with ambiguous symbolism."
          }
        ]
      }
    ]
  };
}

function deliberateInsufficiencyPage() {
  return {
    activities: [
      {
        activity_id: "D1",
        learner_task: "1. Diagnose what information is missing from the brief.",
        expected_output: "List of missing information required before a decision can be made.",
        task_material_decision: { task_input_material_ids: ["D1-M1"] },
        required_materials: [
          {
            material_id: "D1-M1",
            material_type: "task_card",
            purpose: "Deliberately incomplete decision brief.",
            specification: "Brief missing cost and capacity figures by design."
          }
        ]
      }
    ]
  };
}

test("R1: valid determinate learner operand requires achievable particulars", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(determinateQuantPage());
  assert.match(block, /mutually consistent and sufficient/i);
  assert.match(block, /A1-M1 \(scenario\)/);
  assert.match(block, /expected_output actually achievable/i);
});

test("R2: contradictory particulars explicitly forbidden", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(determinateQuantPage());
  assert.match(block, /do not emit contradictory or underdetermined particulars/i);
  assert.match(block, /mutually consistent/i);
});

test("R3: insufficient particulars forbidden when determinate result required", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(determinateQuantPage());
  assert.match(block, /enough coherent information/i);
  assert.match(block, /sufficient for the commissioned action\/result/i);
  assert.doesNotMatch(block, /open-ended\/interpretive/i);
});

test("R4: complete worked model must reach promised result", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(determinateQuantPage());
  assert.match(block, /complete worked\/model result/i);
  assert.match(block, /reach the complete result promised/i);
  assert.match(block, /do not stop at partial intermediate steps/i);
});

test("R5: incomplete worked model explicitly non-compliant", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(determinateQuantPage());
  assert.match(block, /If purpose\/specification promises a complete worked result, reach that promised result/i);
});

test("R6: open-ended commission does not impose uniqueness", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(openHumanitiesPage());
  assert.match(block, /open-ended\/interpretive; do not impose spurious uniqueness/i);
  assert.match(block, /Preserve intentional open-endedness/i);
});

test("R7: deliberate ambiguity/insufficiency preserved", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(deliberateInsufficiencyPage());
  assert.match(block, /missing\/insufficient information the object of learning/i);
  assert.match(block, /preserve intentional gaps/i);
  assert.equal(opsLib.activityCommissionMode(deliberateInsufficiencyPage().activities[0]), "deliberate_insufficiency");
});

test("R8: WS2 independence block coexists with suitability block", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(candidate1ShapedPage());
  assert.match(section, /S78-WS-2 MODEL-PRACTICE-INDEPENDENCE/);
  assert.match(section, /S78-OPERATIONAL-SUITABILITY/);
  assert.match(section, /do not disclose or complete those operands/i);
  assert.match(section, /do not pre-solve/i);
});

test("R9: WS1 response_fulfilment coexistence preserved", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(candidate1ShapedPage());
  assert.match(section, /"response_fulfilment"/);
  assert.match(section, /preserve response_fulfilment blank cells/i);
});

test("R10: Candidate-1-shaped commission without domain-specific production logic", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(candidate1ShapedPage());
  const source = fs.readFileSync(path.join(repoRoot, "lib", "gam-operational-suitability-prompt.js"), "utf8");
  assert.doesNotMatch(source, /Lagrangian|multiplier|\u03bb|FOC|optimi[sz]ation/i);
  assert.match(section, /A4-M2 \(task_card\)/);
  assert.match(section, /A4-M1 \(worked_example\)/);
  assert.match(section, /contradictory or underdetermined particulars/i);
  assert.match(section, /complete worked\/model result/i);
});

test("cross-disciplinary: programming task commission triggers operand suitability", () => {
  const page = {
    activities: [
      {
        activity_id: "P1",
        learner_task: "1. Implement the function described.\n2. Run the supplied tests.",
        expected_output: "Working implementation passing supplied tests.",
        task_material_decision: { task_input_material_ids: ["P1-M1"] },
        required_materials: [
          {
            material_id: "P1-M1",
            material_type: "task_card",
            purpose: "Programming specification and starter tests.",
            specification: "Function signature, behaviour spec, and unit tests."
          }
        ]
      }
    ]
  };
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(page);
  assert.match(block, /P1-M1 \(task_card\)/);
  assert.match(block, /learner operand/i);
});

test("cross-disciplinary: data task with table production", () => {
  const page = {
    activities: [
      {
        activity_id: "DT1",
        learner_task: "1. Complete the analysis table using the dataset summary.",
        expected_output: "Completed analysis table with computed metrics.",
        task_material_decision: { task_input_material_ids: ["DT1-M1"] },
        required_materials: [
          {
            material_id: "DT1-M1",
            material_type: "scenario",
            purpose: "Dataset summary for analysis.",
            specification: "Tabular summary with column definitions."
          },
          {
            material_id: "DT1-M2",
            material_type: "analysis_table",
            purpose: "Learner workspace.",
            specification: "Blank metric cells.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_complete" }
          }
        ]
      }
    ]
  };
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(page);
  assert.match(block, /DT1-M1 \(scenario\)/);
  assert.doesNotMatch(block, /DT1-M2/);
});

test("page without load-bearing production emits no suitability block", () => {
  const page = {
    activities: [
      {
        activity_id: "S1",
        learner_task: "1. Read the overview.\n2. Review the glossary.",
        expected_output: "Familiarity with terminology.",
        required_materials: [
          {
            material_id: "S1-M1",
            material_type: "text",
            purpose: "Overview reading.",
            specification: "Short glossary-led overview."
          }
        ]
      }
    ]
  };
  assert.equal(opsLib.buildOperationalSuitabilityAuthoringBlock(page), "");
});

test("GAM contract references operational suitability block", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /S78-OPERATIONAL-SUITABILITY block when injected/i);
});

test("assembled prompt verification: Candidate-1-shaped salience points", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(candidate1ShapedPage());
  assert.match(section, /A4-M1/, "material id visible");
  assert.match(section, /complete worked\/model result/i, "model role");
  assert.match(section, /A4-M2/, "operand id");
  assert.match(section, /mutually consistent and sufficient/i, "consistency");
  assert.match(section, /expected_output actually achievable/i, "sufficiency/answerability");
  assert.match(section, /do not pre-solve/i, "learner ownership");
  assert.match(section, /S78-WS-2/, "WS2 independence");
});

test("assembled prompt verification: open-ended does not demand unique answer", () => {
  const section = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(openHumanitiesPage());
  assert.match(section, /do not impose spurious uniqueness/i);
  assert.doesNotMatch(section, /reach the complete result promised by purpose/i);
});

test("block is not duplicated on re-apply", () => {
  const page = determinateQuantPage();
  const once = opsLib.applyOperationalSuitabilityBlockToDraft("BASE", page);
  const twice = opsLib.applyOperationalSuitabilityBlockToDraft(once, page);
  assert.equal(once, twice);
  assert.equal((once.match(/S78-OPERATIONAL-SUITABILITY/gi) || []).length, 1);
});

test("prompt size: suitability block remains bounded", () => {
  const block = opsLib.buildOperationalSuitabilityAuthoringBlock(candidate1ShapedPage());
  assert.ok(block.length > 200);
  assert.ok(block.length < 2500, "ops block unexpectedly large: " + block.length);
});

test("prompt size: commission section net increase is bounded", () => {
  const page = candidate1ShapedPage();
  const payload = api.projectGamAuthoritativeDlaCommissionFromPage(page);
  const jsonOnly = "\n```json\n" + JSON.stringify(payload, null, 2) + "\n```";
  const full = api.buildAuthoritativeDlaMaterialCommissionSectionFromPage(page);
  const netIncrease = full.length - jsonOnly.length;
  assert.ok(netIncrease > 400, "expected injected blocks");
  assert.ok(netIncrease < 4500, "commission section growth unexpectedly large: " + netIncrease);
});

test("Case 1 brief cross-references local suitability block", () => {
  const brief = api.buildGamV2CopyMaterialAuthoringBrief();
  assert.match(brief, /S78-OPERATIONAL-SUITABILITY \(auto-applied\)/);
  assert.match(brief, /enough coherent information for that operation to be carried out/i);
});

test("trigger is commission-led via production classifier not verb taxonomy", () => {
  const page = {
    activities: [
      {
        activity_id: "X1",
        learner_task: "1. Complete the comparison table.",
        expected_output: "Completed comparison table.",
        required_materials: [
          {
            material_id: "X1-M1",
            material_type: "scenario",
            purpose: "Cases to compare.",
            specification: "Two cases."
          }
        ]
      }
    ]
  };
  assert.ok(opsLib.activityHasLoadBearingProduction(page.activities[0]));
  assert.ok(opsLib.activityRequiresOperationalSuitability(page.activities[0], page.activities[0].required_materials));
  const source = fs.readFileSync(path.join(repoRoot, "lib", "gam-operational-suitability-prompt.js"), "utf8");
  assert.doesNotMatch(source, /\bsolve\b.*trigger|\bverb list\b/i);
});

function obligationIds(page) {
  return opsLib.collectSuitabilityObligationsFromPage(page).map((row) => row.material_id);
}

function candidate5ShapedPage() {
  return {
    activities: [
      {
        activity_id: "A1",
        learner_task:
          "Read the optimisation situations. Classify each as constrained or unconstrained.",
        expected_output: "Correct classification of each situation.",
        task_material_decision: { task_input_material_ids: ["A1-M1"] },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "scenario",
            purpose: "Provide optimisation situations that learners classify.",
            specification: "Several situations."
          },
          {
            material_id: "A1-M2",
            material_type: "prompt_set",
            purpose: "Learner response surface.",
            specification: "Text-composition workspace.",
            response_fulfilment: { kind: "learner_text_production", response_kind: "text_compose" }
          },
          {
            material_id: "A1-M3",
            material_type: "checklist",
            purpose: "Diagnostic review.",
            specification: "Criteria checklist."
          }
        ]
      },
      {
        activity_id: "A2",
        learner_task:
          "Study the worked example. Then construct a Lagrangian from the independent problem.",
        expected_output: "A correctly constructed Lagrangian.",
        task_material_decision: { task_input_material_ids: ["A2-M2"] },
        required_materials: [
          {
            material_id: "A2-M1",
            material_type: "worked_example",
            purpose: "Model construction of a Lagrangian.",
            specification:
              "One modelled example showing construction; stop before solving first-order conditions.",
            practice_independence: { attempt_operand_material_ids: ["A2-M2"] }
          },
          {
            material_id: "A2-M2",
            material_type: "task_card",
            purpose: "Independent constrained optimisation problem.",
            specification: "Objective and constraint only."
          },
          {
            material_id: "A2-M3",
            material_type: "template",
            purpose: "Learner workspace.",
            specification: "Editable completion table.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_complete" }
          },
          {
            material_id: "A2-M4",
            material_type: "checklist",
            purpose: "Diagnostic review.",
            specification: "Criteria checklist."
          }
        ]
      },
      {
        activity_id: "A3",
        learner_task:
          "Examine the solved example. Derive and solve the first-order conditions for the independent problem.",
        expected_output: "Optimal values of the decision variables.",
        task_material_decision: { task_input_material_ids: ["A3-M2"] },
        required_materials: [
          {
            material_id: "A3-M1",
            material_type: "worked_example",
            purpose: "Distinct solved example for deriving and solving first-order conditions.",
            specification: "Solved modelling path including verification.",
            practice_independence: { attempt_operand_material_ids: ["A3-M2"] }
          },
          {
            material_id: "A3-M2",
            material_type: "scenario",
            purpose: "Independent constrained optimisation problem that learners must solve.",
            specification: "One problem instance."
          },
          {
            material_id: "A3-M3",
            material_type: "analysis_table",
            purpose: "Learner workspace.",
            specification: "Editable table.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_complete" }
          }
        ]
      },
      {
        activity_id: "A4",
        learner_task:
          "Explain what the multiplier indicates about relaxing the constraint, using the solved optimisation outcome.",
        expected_output: "A written explanation of the shadow-price interpretation.",
        task_material_decision: { task_input_material_ids: ["A4-M1"] },
        required_materials: [
          {
            material_id: "A4-M1",
            material_type: "scenario",
            purpose: "Solved optimisation outcome for interpretation.",
            specification: "Final values and multiplier; no interpretation."
          },
          {
            material_id: "A4-M2",
            material_type: "prompt_set",
            purpose: "Learner text-production response surface.",
            specification: "Workspace for interpretation; no model answers.",
            response_fulfilment: { kind: "learner_text_production", response_kind: "text_compose" }
          },
          {
            material_id: "A4-M3",
            material_type: "checklist",
            purpose: "Diagnostic review.",
            specification: "Criteria checklist."
          }
        ]
      },
      {
        activity_id: "A5",
        learner_task:
          "Read the explanation of shadow price and interpret the supplied multiplier-value cases in the comparison workspace.",
        expected_output: "A comparison of what different multiplier values imply.",
        task_material_decision: { task_input_material_ids: ["A5-M2"] },
        required_materials: [
          {
            material_id: "A5-M1",
            material_type: "text",
            purpose: "Introduce shadow price.",
            specification: "Explanatory text."
          },
          {
            material_id: "A5-M2",
            material_type: "scenario",
            purpose: "Generated multiplier-value cases that learners must interpret.",
            specification: "Several cases."
          },
          {
            material_id: "A5-M3",
            material_type: "comparison_table",
            purpose: "Learner comparison workspace.",
            specification: "Editable comparison table.",
            response_fulfilment: { kind: "learner_workspace", response_kind: "table_compare" }
          }
        ]
      }
    ]
  };
}

test("binding R1: task_input included when learner_task begins Examine/Study/Review", () => {
  const page = {
    activities: [
      {
        activity_id: "A3",
        learner_task:
          "Examine the supplied utility-maximisation problem. Derive the first-order conditions, solve the resulting equations and determine the optimal values of the decision variables.",
        expected_output:
          "A correct sequence of first-order conditions, accurate algebraic solution steps and a feasible optimal solution that satisfies the original constraint.",
        task_material_decision: { task_input_material_ids: ["A3-M1"] },
        required_materials: [
          {
            material_id: "A3-M1",
            material_type: "scenario",
            purpose: "Provide the utility-maximisation problem to be solved.",
            specification: "One introductory utility-maximisation problem."
          }
        ]
      }
    ]
  };
  assert.deepEqual(obligationIds(page), ["A3-M1"]);
});

test("binding R2: classification scenario task input included", () => {
  assert.ok(obligationIds(candidate5ShapedPage()).includes("A1-M1"));
});

test("binding R3: independent mathematical operand included", () => {
  const ids = obligationIds(candidate5ShapedPage());
  assert.ok(ids.includes("A2-M2"));
  assert.ok(ids.includes("A3-M2"));
});

test("binding R4: programming/debug task input included", () => {
  const page = {
    activities: [
      {
        activity_id: "P1",
        learner_task: "Review the starter code. Debug the supplied function so the listed tests pass.",
        expected_output: "Corrected function satisfying the supplied tests.",
        task_material_decision: { task_input_material_ids: ["P1-M1"] },
        required_materials: [
          {
            material_id: "P1-M1",
            material_type: "task_card",
            purpose: "Starter function and failing tests.",
            specification: "One function plus three unit tests."
          }
        ]
      }
    ]
  };
  assert.deepEqual(obligationIds(page), ["P1-M1"]);
});

test("binding R5: data-analysis task input included", () => {
  const page = {
    activities: [
      {
        activity_id: "DA1",
        learner_task: "Review the dataset summary. Calculate the requested totals from the supplied table.",
        expected_output: "Named totals implied by the table.",
        task_material_decision: { task_input_material_ids: ["DA1-M1"] },
        required_materials: [
          {
            material_id: "DA1-M1",
            material_type: "scenario",
            purpose: "Data table for the commissioned totals.",
            specification: "Table containing the variables named in expected_output."
          }
        ]
      }
    ]
  };
  assert.deepEqual(obligationIds(page), ["DA1-M1"]);
});

test("binding R6: humanities source/case task input included", () => {
  assert.deepEqual(obligationIds(openHumanitiesPage()), ["H1-M1"]);
});

test("binding R7: response_fulfilment-only surface excluded", () => {
  const ids = obligationIds(candidate5ShapedPage());
  assert.equal(ids.includes("A1-M2"), false);
  assert.equal(ids.includes("A2-M3"), false);
  assert.equal(ids.includes("A3-M3"), false);
  assert.equal(ids.includes("A4-M2"), false);
  assert.equal(ids.includes("A5-M3"), false);
});

test("binding R8: prompt_set excluded when only a response surface", () => {
  const page = {
    activities: [
      {
        activity_id: "X1",
        learner_task: "Explain the result using the supplied scenario.",
        expected_output: "A written explanation.",
        required_materials: [
          {
            material_id: "X1-M1",
            material_type: "prompt_set",
            purpose: "Learner response surface.",
            specification: "Text workspace.",
            response_fulfilment: { kind: "learner_text_production", response_kind: "text_compose" }
          }
        ]
      }
    ]
  };
  assert.deepEqual(obligationIds(page), []);
});

test("binding R9: operand IN and response surface OUT", () => {
  const ids = obligationIds(candidate1ShapedPage());
  assert.ok(ids.includes("A4-M2"));
  assert.equal(ids.includes("A4-M3"), false);
});

test("binding R10: practice_independence attempt operand not lost behind study prefix", () => {
  const page = {
    activities: [
      {
        activity_id: "A2",
        learner_task: "Study the worked method. Solve the independent constrained allocation problem.",
        expected_output: "Candidate optimum values.",
        required_materials: [
          {
            material_id: "A2-M1",
            material_type: "worked_example",
            purpose: "Model complete worked solution.",
            specification: "Complete worked solution on a distinct reference instance.",
            practice_independence: { attempt_operand_material_ids: ["A2-M2"] }
          },
          {
            material_id: "A2-M2",
            material_type: "task_card",
            purpose: "Independent practice operand.",
            specification: "Distinct instance for learner solve/verify."
          }
        ]
      }
    ]
  };
  assert.deepEqual(obligationIds(page).sort(), ["A2-M1", "A2-M2"]);
});

test("binding R11: complete model included when commission metadata indicates complete result", () => {
  const ids = obligationIds(determinateQuantPage());
  assert.ok(ids.includes("A1-M2"));
  const roles = opsLib.collectSuitabilityObligationsFromPage(determinateQuantPage());
  assert.equal(roles.find((row) => row.material_id === "A1-M2").role, "model_complete");
  assert.ok(obligationIds(candidate5ShapedPage()).includes("A3-M1"));
});

test("binding R12: partial demo model not forced into complete-model review", () => {
  const ids = obligationIds(candidate5ShapedPage());
  assert.equal(ids.includes("A2-M1"), false);
  const page = {
    activities: [
      {
        activity_id: "A1",
        learner_task: "1. Solve the constrained allocation problem.",
        expected_output: "Identification of optimal resource values.",
        task_material_decision: { task_input_material_ids: ["A1-M3"] },
        required_materials: [
          {
            material_id: "A1-M2",
            material_type: "worked_example",
            purpose: "Demonstration of the method on a reference instance.",
            specification: "Show the method on a distinct instance; do not finish the learner's work."
          },
          {
            material_id: "A1-M3",
            material_type: "scenario",
            purpose: "Supply the allocation problem instance.",
            specification: "One self-contained constrained allocation instance."
          }
        ]
      }
    ]
  };
  const rows = opsLib.collectSuitabilityObligationsFromPage(page);
  const model = rows.find((row) => row.material_id === "A1-M2");
  assert.ok(model);
  assert.equal(model.role, "model_demonstration");
});

test("binding R13: explanatory/reference-only text remains OUT", () => {
  const ids = obligationIds(candidate5ShapedPage());
  assert.equal(ids.includes("A5-M1"), false);
});

test("binding R14: diagnostic checklist remains OUT", () => {
  const ids = obligationIds(candidate5ShapedPage());
  ["A1-M3", "A2-M4", "A4-M3"].forEach(function (id) {
    assert.equal(ids.includes(id), false, "checklist " + id + " should be excluded");
  });
});

test("binding R15: zero-obligation page still bypasses review", () => {
  const page = {
    activities: [
      {
        activity_id: "S1",
        learner_task: "1. Read the overview.\n2. Review the glossary.",
        expected_output: "Familiarity with terminology.",
        required_materials: [
          {
            material_id: "S1-M1",
            material_type: "text",
            purpose: "Overview reading.",
            specification: "Short glossary-led overview."
          }
        ]
      }
    ]
  };
  assert.deepEqual(obligationIds(page), []);
});

test("binding R16: exact review-id gate still works after collector change", () => {
  const reviewLib = require(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"));
  const dla = candidate5ShapedPage();
  const gam = {
    activities: [
      {
        activity_id: "A1",
        materials: [{ material_id: "A1-M1", body: "Situations body." }]
      },
      {
        activity_id: "A2",
        materials: [{ material_id: "A2-M2", body: "Operand body." }]
      },
      {
        activity_id: "A3",
        materials: [
          { material_id: "A3-M1", body: "Model body." },
          { material_id: "A3-M2", body: "Operand body." }
        ]
      },
      {
        activity_id: "A4",
        materials: [{ material_id: "A4-M1", body: "Scenario body." }]
      },
      {
        activity_id: "A5",
        materials: [{ material_id: "A5-M2", body: "Cases body." }]
      }
    ]
  };
  const obligations = reviewLib.collectObligations(dla);
  const ids = obligations.map((row) => row.material_id).sort();
  assert.deepEqual(ids, ["A1-M1", "A2-M2", "A3-M1", "A3-M2", "A4-M1", "A5-M2"]);
  const review = JSON.stringify(
    {
      artifact_type: "gam_operational_suitability_review",
      schema_version: "1.0.0",
      gam_fingerprint: reviewLib.fingerprintGamMaterials(dla, gam),
      verdicts: obligations.map(function (row) {
        return {
          activity_id: row.activity_id,
          material_id: row.material_id,
          suitable: true,
          failure_class: "none",
          reason: ""
        };
      })
    },
    null,
    2
  );
  assert.equal(reviewLib.evaluateReviewGate(dla, gam, review).accepted, true);
});

test("binding R17: stale fingerprint behaviour preserved after collector change", () => {
  const reviewLib = require(path.join(repoRoot, "lib", "gam-operational-suitability-review.js"));
  const dla = candidate5ShapedPage();
  const gam = {
    activities: dla.activities.map(function (activity) {
      return {
        activity_id: activity.activity_id,
        materials: opsLib
          .collectSuitabilityObligationsFromPage({ activities: [activity] })
          .map(function (row) {
            return { material_id: row.material_id, body: "Initial body for " + row.material_id };
          })
      };
    })
  };
  const review = JSON.stringify(
    {
      artifact_type: "gam_operational_suitability_review",
      schema_version: "1.0.0",
      gam_fingerprint: reviewLib.fingerprintGamMaterials(dla, gam),
      verdicts: reviewLib.collectObligations(dla).map(function (row) {
        return {
          activity_id: row.activity_id,
          material_id: row.material_id,
          suitable: true,
          failure_class: "none",
          reason: ""
        };
      })
    },
    null,
    2
  );
  const changed = JSON.parse(JSON.stringify(gam));
  changed.activities[0].materials[0].body += "\nRegenerated.";
  assert.equal(reviewLib.evaluateReviewGate(dla, changed, review).accepted, false);
});

test("binding R18: Candidate-5-shaped fixture excludes response surface and broadens operands", () => {
  const beforeConceptual = ["A4-M1", "A4-M2"];
  const ids = obligationIds(candidate5ShapedPage()).sort();
  assert.notDeepEqual(ids, beforeConceptual.sort());
  assert.ok(ids.includes("A1-M1"));
  assert.ok(ids.includes("A2-M2"));
  assert.ok(ids.includes("A3-M1"));
  assert.ok(ids.includes("A3-M2"));
  assert.ok(ids.includes("A4-M1"));
  assert.ok(ids.includes("A5-M2"));
  assert.equal(ids.includes("A4-M2"), false);
  assert.equal(ids.includes("A2-M1"), false);
});
