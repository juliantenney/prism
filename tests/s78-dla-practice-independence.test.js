/**
 * S78-T-011 — DLA model/practice independence binding (S78-WS-2).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const independence = require(path.join(repoRoot, "lib", "dla-practice-independence.js"));
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function activityShell(overrides) {
  return Object.assign(
    {
      activity_id: "A3",
      title: "Solve a constrained optimisation problem",
      learner_task:
        "Derive the first-order conditions from the supplied problem. Solve the resulting equations and record each stage in the workspace.",
      expected_output:
        "Correct first-order conditions, algebraic solution steps and a feasible optimal solution.",
      activity_preamble: "Apply the Lagrangian method to a new problem instance.",
      intellectual_coherence_bridge:
        "Having studied the method on a distinct example, apply it to the supplied operand.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A3-M1"]
      },
      evidence_decision: {
        required: false,
        reason: "Procedural operand; no evidence inference required.",
        provider_material_ids: []
      }
    },
    overrides || {}
  );
}

function buildPartialPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [clone(activity)]
  };
}

function validNearTransferMaterials() {
  return [
    {
      material_id: "A3-M1",
      material_type: "scenario",
      purpose: "Provide the utility-maximisation problem to be solved independently.",
      specification:
        "One distinct introductory utility-maximisation instance; objective and budget constraint only; no solution."
    },
    {
      material_id: "A3-M2",
      material_type: "worked_example",
      purpose: "Model the solution method on a comparable but distinct instance.",
      specification:
        "Fully worked example on a different optimisation instance from A3-M1; stop before revealing A3-M1 target values; near-transfer comparable structure.",
      practice_independence: {
        attempt_operand_material_ids: ["A3-M1"]
      }
    },
    {
      material_id: "A3-M3",
      material_type: "analysis_table",
      purpose: "Workspace for recording derivations and solutions.",
      specification: "Editable table; learners complete all substantive entries.",
      response_fulfilment: {
        kind: "learner_workspace",
        response_kind: "table_complete",
        binds_production_steps: [1]
      }
    },
    {
      material_id: "A3-M4",
      material_type: "checklist",
      purpose: "Post-attempt diagnostic review of the independent solution.",
      specification:
        "Three criteria on derivation structure, algebraic solution steps and feasibility of the optimum.",
      diagnostic_review: {
        covers_response_material_ids: ["A3-M3"]
      }
    }
  ];
}

test("contract: live version 78-DLA-WS-3 includes practice_independence commissioning", () => {
  const text = dlaContract.assembleDlaCanonicalContract().text;
  assert.equal(dlaContract.CONTRACT_VERSION, "78-DLA-WS-3");
  assert.match(text, /S78-WS-2 model\/practice independence/i);
  assert.match(text, /practice_independence\.attempt_operand_material_ids/i);
});

test("S78-T-011: §10 output surface includes MP-1 closure and checklist item 5", () => {
  const output = dlaContract.assembleDlaCanonicalContract().sections.output;
  assert.match(output, /MP-1 \/ S78-WS-2 closure/i);
  assert.match(output, /practice_independence listing every attempt operand material_id/i);
  assert.match(output, /5\. MP-1 closure: model→independent-attempt pairs have practice_independence/i);
});

test("R1: valid near-transfer commission passes", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: validNearTransferMaterials()
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R2b: examine-prefixed task with bound workspace still requires binding", () => {
  const page = buildPartialPage(
    activityShell({
      learner_task:
        "Examine the supplied utility-maximisation problem. Derive the first-order conditions, solve the equations and record each stage in the workspace.",
      required_materials: (function () {
        const materials = validNearTransferMaterials();
        delete materials[1].practice_independence;
        return materials;
      })()
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS2_MISSING_BINDING/.test(e)));
});

test("R2: model plus independent attempt without binding fails closed", () => {
  const materials = validNearTransferMaterials();
  delete materials[1].practice_independence;
  const page = buildPartialPage(
    activityShell({
      required_materials: materials
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(
    (check.errors || []).some((e) => /S78_WS2_MISSING_BINDING/.test(e)),
    check.errors.join("; ")
  );
  assert.ok((check.errors || []).some((e) => /A3-M2/.test(e)));
});

test("R4: guided practice without independent binding passes", () => {
  const page = buildPartialPage(
    activityShell({
      learner_task:
        "1. Study the worked example.\n2. Complete the guided practice table using the supplied hints.",
      expected_output: "A partially scaffolded guided practice table with learner entries where indicated.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A3-M1"]
      },
      required_materials: [
        {
          material_id: "A3-M1",
          material_type: "scenario",
          purpose: "Operand for guided practice.",
          specification: "Problem statement for scaffolded practice."
        },
        {
          material_id: "A3-M2",
          material_type: "worked_example",
          purpose: "Model the method on a distinct introductory instance.",
          specification: "Worked example on a distinct instance; no practice_independence when guided-only."
        },
        {
          material_id: "A3-M3",
          material_type: "template",
          purpose: "Guided practice workspace.",
          specification: "Table with fixed hint rows and blank learner cells.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_complete",
            allows_partial_exemplar: true
          }
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
  assert.equal(independence.activityRequiresPracticeIndependence(page.activities[0]), false);
});

test("R5: model only without independent attempt passes", () => {
  const page = buildPartialPage(
    activityShell({
      learner_task: "Study the worked example and summarise the method stages.",
      expected_output: "A concise summary of the method stages.",
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [
        {
          material_id: "A3-M2",
          material_type: "worked_example",
          purpose: "Demonstrate the method.",
          specification: "Fully worked example; study-only activity."
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R6: independent task without model passes", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        validNearTransferMaterials()[0],
        validNearTransferMaterials()[2]
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R7: one model bound to task_card with multiple practice problems passes", () => {
  const page = buildPartialPage(
    activityShell({
      activity_id: "A2",
      learner_task:
        "For each supplied optimisation problem, construct the corresponding Lagrangian function and identify the role of the multiplier.",
      expected_output: "Correctly constructed Lagrangian functions for each problem.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A2-M1"]
      },
      required_materials: [
        {
          material_id: "A2-M1",
          material_type: "task_card",
          purpose: "Provide three distinct optimisation problems.",
          specification: "Three simple equality-constrained problems; no solutions."
        },
        {
          material_id: "A2-M2",
          material_type: "worked_example",
          purpose: "Model Lagrangian construction on a distinct introductory example.",
          specification:
            "One worked introductory example distinct from all A2-M1 problems; stop before solving first-order conditions.",
          practice_independence: {
            attempt_operand_material_ids: ["A2-M1"]
          }
        },
        {
          material_id: "A2-M3",
          material_type: "template",
          purpose: "Record constructed Lagrangians.",
          specification: "Editable table; learners complete all response fields.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_complete",
            binds_production_steps: [1]
          }
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R8: Lagrangian-shaped commission with modelling_note and scenario passes", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        validNearTransferMaterials()[0],
        {
          material_id: "A3-M2",
          material_type: "modelling_note",
          purpose: "Summarise the solution process without solving the attempt operand.",
          specification:
            "Process stages only on a distinct reference instance; must not solve or disclose A3-M1 target solution.",
          practice_independence: {
            attempt_operand_material_ids: ["A3-M1"]
          }
        },
        validNearTransferMaterials()[2]
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("empty attempt_operand_material_ids fails shape validation", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        validNearTransferMaterials()[0],
        {
          material_id: "A3-M2",
          material_type: "worked_example",
          purpose: "Model row.",
          specification: "Distinct instance specification.",
          practice_independence: {
            attempt_operand_material_ids: []
          }
        },
        validNearTransferMaterials()[2]
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS2_INVALID_SHAPE/.test(e)));
});

test("unknown operand id fails closure validation", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        validNearTransferMaterials()[0],
        {
          material_id: "A3-M2",
          material_type: "worked_example",
          purpose: "Model row.",
          specification: "Distinct instance specification.",
          practice_independence: {
            attempt_operand_material_ids: ["A3-M9"]
          }
        },
        validNearTransferMaterials()[2]
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS2_OPERAND_CLOSURE/.test(e)));
  assert.ok((check.errors || []).some((e) => /A3-M9/.test(e)));
});

test("self-binding fails closure validation", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        validNearTransferMaterials()[0],
        {
          material_id: "A3-M2",
          material_type: "worked_example",
          purpose: "Model row.",
          specification: "Distinct instance specification.",
          practice_independence: {
            attempt_operand_material_ids: ["A3-M2"]
          }
        },
        validNearTransferMaterials()[2]
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS2_OPERAND_CLOSURE/.test(e)));
});

test("practice_independence on non-model row is forbidden", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        {
          material_id: "A3-M1",
          material_type: "scenario",
          purpose: "Operand.",
          specification: "Problem statement.",
          practice_independence: {
            attempt_operand_material_ids: ["A3-M1"]
          }
        },
        validNearTransferMaterials()[1],
        validNearTransferMaterials()[2]
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS2_FORBIDDEN_ON_ROW/.test(e)));
});

test("T-023 projection preserves practice_independence on model rows", () => {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSource, /copyOwnFieldIfPresent\(rm, row, "practice_independence"\)/);
  assert.match(appSource, /Honour practice_independence when present on model rows/);
});

test("prompt size delta remains bounded after WS2 addition", () => {
  const text = dlaContract.assembleDlaCanonicalContract().text;
  assert.ok(text.length >= 24800, "canonical contract unexpectedly small: " + text.length);
  assert.ok(text.length <= 26400, "canonical contract grew too large: " + text.length);
});
