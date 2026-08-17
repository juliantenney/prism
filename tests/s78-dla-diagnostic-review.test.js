/**
 * S78-T-022 — DLA activity-level diagnostic review binding (S78-WS-3).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const diagnosticReview = require(path.join(repoRoot, "lib", "dla-diagnostic-review.js"));
const independence = require(path.join(repoRoot, "lib", "dla-practice-independence.js"));
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function diagnosticReviewChecklist(materialId, coversIds, spec) {
  return {
    material_id: materialId,
    material_type: "checklist",
    purpose: "Post-attempt diagnostic review of the learner's independent production.",
    specification:
      spec ||
      "Three criteria on derivation structure, calculation accuracy and interpretation coherence.",
    diagnostic_review: {
      covers_response_material_ids: coversIds.slice()
    }
  };
}

function activityShell(overrides) {
  return Object.assign(
    {
      activity_id: "A2",
      title: "Apply the method independently",
      learner_task:
        "1. Study the reference summary.\n2. Review the worked pattern.\n3. Enter your responses into a comparison table for Entity A and Entity B across the listed dimensions.",
      expected_output:
        "A completed comparison table with justified contrasts between Entity A and Entity B.",
      activity_preamble: "Apply the method to the supplied problem.",
      intellectual_coherence_bridge: "Build on the prior modelled method with an independent attempt.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A2-M1"]
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

function productionMaterials(workspaceId) {
  return [
    {
      material_id: "A2-M1",
      material_type: "scenario",
      purpose: "Supply the independent problem instance.",
      specification: "One distinct problem statement without the target solution."
    },
    {
      material_id: workspaceId || "A2-W1",
      material_type: "comparison_table",
      purpose: "Record learner comparisons across the listed dimensions.",
      specification: "Editable comparison table; learners complete all substantive cells.",
      response_fulfilment: {
        kind: "learner_workspace",
        response_kind: "table_compare",
        binds_production_steps: [3]
      }
    },
    diagnosticReviewChecklist("A2-C1", [workspaceId || "A2-W1"])
  ];
}

test("contract: live version 78-DLA-WS-3 includes diagnostic_review commissioning", () => {
  const text = dlaContract.assembleDlaCanonicalContract().text;
  assert.equal(dlaContract.CONTRACT_VERSION, "78-DLA-WS-3");
  assert.match(text, /S78-WS-3 diagnostic review/i);
  assert.match(text, /diagnostic_review\.covers_response_material_ids/i);
});

test("S78-T-022: §10 output surface includes DR-1 closure and checklist item 6", () => {
  const output = dlaContract.assembleDlaCanonicalContract().sections.output;
  assert.match(output, /DR-1 \/ S78-WS-3 closure/i);
  assert.match(output, /diagnostic_review whose covers_response_material_ids lists every response_fulfilment/i);
  assert.match(output, /6\. DR-1 closure: triggered activities have exactly one diagnostic_review checklist/i);
});

test("G1 replaced: workbook overlay uses S78-WS-3 not DLA-WB-26 every-activity MUST", () => {
  const text = dlaContract.buildDlaWorkbookOverlayBlock();
  assert.match(text, /G1 Diagnostic review \(S78-WS-3\)/i);
  assert.doesNotMatch(text, /every activity MUST list type checklist with purpose verification/i);
});

test("trigger: substantive independent production requires review", () => {
  const activity = activityShell({ required_materials: productionMaterials() });
  assert.equal(diagnosticReview.activityRequiresDiagnosticReview(activity), true);
});

test("trigger: guided-only practice does not require review", () => {
  const activity = activityShell({
    learner_task:
      "1. Study the worked example.\n2. Complete the guided practice table using the supplied hints.",
    required_materials: [
      {
        material_id: "A2-W1",
        material_type: "template",
        purpose: "Guided practice workspace.",
        specification: "Scaffolded table with hint rows.",
        response_fulfilment: {
          kind: "learner_workspace",
          response_kind: "table_complete"
        }
      }
    ]
  });
  assert.equal(diagnosticReview.activityRequiresDiagnosticReview(activity), false);
  assert.equal(typeof independence.isGuidedOnlyActivity, "function");
});

test("R1: substantive single independent response with exactly one review passes", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: productionMaterials()
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R1 fail: substantive production without diagnostic review fails closed", () => {
  const materials = productionMaterials();
  materials.pop();
  const page = buildPartialPage(
    activityShell({
      required_materials: materials
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_DR_MISSING_REVIEW/.test(e)));
});

test("R2: compound production with one review covering all fulfilment ids passes", () => {
  const page = buildPartialPage(
    activityShell({
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      learner_task:
        "Derive the first-order conditions. Complete the comparison table. Write your interpretation.",
      expected_output:
        "Derivations, a completed comparison table and a short written interpretation.",
      required_materials: [
        {
          material_id: "A2-W1",
          material_type: "analysis_table",
          purpose: "Record derivations.",
          specification: "Editable derivation workspace.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_complete",
            binds_production_steps: [1]
          }
        },
        {
          material_id: "A2-W2",
          material_type: "comparison_table",
          purpose: "Compare outcomes.",
          specification: "Editable comparison table.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_compare",
            binds_production_steps: [2]
          }
        },
        {
          material_id: "A2-W3",
          material_type: "task_card",
          purpose: "Written interpretation surface.",
          specification: "Free-text response area.",
          response_fulfilment: {
            kind: "learner_text_production",
            response_kind: "text_compose",
            binds_production_steps: [3]
          }
        },
        diagnosticReviewChecklist("A2-C1", ["A2-W1", "A2-W2", "A2-W3"])
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R3 fail: several response fields with fragmented reviews fails", () => {
  const page = buildPartialPage(
    activityShell({
      learner_task:
        "1. Complete the analysis table.\n2. Write your interpretation.",
      expected_output: "Completed table and written interpretation.",
      required_materials: [
        {
          material_id: "A2-W1",
          material_type: "analysis_table",
          purpose: "Analysis workspace.",
          specification: "Editable table.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_complete",
            binds_production_steps: [1]
          }
        },
        {
          material_id: "A2-W2",
          material_type: "task_card",
          purpose: "Interpretation surface.",
          specification: "Free-text response.",
          response_fulfilment: {
            kind: "learner_text_production",
            response_kind: "text_compose",
            binds_production_steps: [2]
          }
        },
        diagnosticReviewChecklist("A2-C1", ["A2-W1"]),
        diagnosticReviewChecklist("A2-C2", ["A2-W2"])
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_DR_DUPLICATE_REVIEW/.test(e)));
});

test("R4: guided-only practice passes without automatic review", () => {
  const page = buildPartialPage(
    activityShell({
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      learner_task:
        "1. Study the worked example.\n2. Complete the guided practice table using the supplied hints.",
      expected_output: "A partially scaffolded guided practice table.",
      required_materials: [
        {
          material_id: "A2-W1",
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
});

test("R5: model-only study passes without review", () => {
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
          material_id: "A2-M2",
          material_type: "worked_example",
          purpose: "Model the method.",
          specification: "Fully worked example for study only."
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R6: explanation/read-only passes without review", () => {
  const page = buildPartialPage(
    activityShell({
      learner_task:
        "1. Study the reference comparison table.\n2. Use the checklist to verify your understanding of the dimensions.",
      expected_output: "Demonstrated understanding of the reference dimensions.",
      required_materials: [
        {
          material_id: "A2-M1",
          material_type: "reference_table",
          purpose: "Display the dimension schema for study.",
          specification: "Fixed reference table; no learner production."
        },
        {
          material_id: "A2-M2",
          material_type: "checklist",
          purpose: "Verify comprehension of the reference table.",
          specification: "Three comprehension checks on dimension meaning."
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R14/R15 fail: coverage mismatch and wrong host", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        productionMaterials()[1],
        {
          material_id: "A2-C1",
          material_type: "text",
          purpose: "Invalid diagnostic host.",
          specification: "Should be checklist.",
          diagnostic_review: {
            covers_response_material_ids: ["A2-W1"]
          }
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_DR_WRONG_HOST/.test(e)));
});

test("R14 fail: coverage mismatch on single review", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        productionMaterials()[1],
        diagnosticReviewChecklist("A2-C1", ["A2-MISSING"])
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(
    (check.errors || []).some(
      (e) => /S78_DR_COVERAGE_MISMATCH|S78_DR_UNKNOWN_ID/.test(e)
    )
  );
});

test("T-023 projection preserves diagnostic_review on checklist rows", () => {
  const appSource = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  assert.match(appSource, /copyOwnFieldIfPresent\(rm, row, "diagnostic_review"\)/);
});
