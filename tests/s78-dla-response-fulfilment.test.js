/**
 * S78-T-005 — DLA response fulfilment binding (S78-WS-1).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const fulfilment = require(path.join(repoRoot, "lib", "dla-production-fulfilment.js"));
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function activityShell(overrides) {
  return Object.assign(
    {
      activity_id: "A1",
      title: "Compare entity dimensions",
      learner_task:
        "1. Study the reference summary.\n2. Review the worked pattern.\n3. Enter your responses into a comparison table for Entity A and Entity B across the listed dimensions.",
      expected_output:
        "A completed comparison table with justified contrasts between Entity A and Entity B.",
      activity_preamble: "Use the commissioned materials to complete this activity.",
      intellectual_coherence_bridge:
        "You have studied the reference pattern; now compare the entities in tabular form.",
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      evidence_decision: {
        required: false,
        reason: "Production does not require inspectable particulars as grounds.",
        provider_material_ids: []
      },
      materials: []
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

function diagnosticReviewChecklist(materialId, coversIds) {
  return {
    material_id: materialId,
    material_type: "checklist",
    purpose: "Post-attempt diagnostic review of the completed comparison.",
    specification: "Three criteria on contrast quality, justification completeness and coherence.",
    diagnostic_review: {
      covers_response_material_ids: coversIds.slice()
    }
  };
}

function staticOnlyMaterials() {
  return [
    {
      material_id: "A1-M1",
      material_type: "text",
      purpose: "Introduce the comparison dimensions.",
      specification: "Short exposition of the dimensions without pre-filled learner answers."
    },
    {
      material_id: "A1-M2",
      material_type: "explanatory_note",
      purpose: "Clarify how to read the comparison structure.",
      specification: "One note on row/column meaning; no learner completion cells."
    },
    {
      material_id: "A1-M3",
      material_type: "checklist",
      purpose: "Self-check the completed comparison.",
      specification: "Three criteria on contrast quality and justification completeness."
    }
  ];
}

function workspaceRow(id) {
  return {
    material_id: id,
    material_type: "comparison_table",
    purpose: "Record learner comparisons across the listed dimensions.",
    specification:
      "Three data rows for Entity A and Entity B; learner-completion cells blank; one fixed exemplar row permitted.",
    response_fulfilment: {
      kind: "learner_workspace",
      response_kind: "table_compare",
      binds_production_steps: [3],
      allows_partial_exemplar: true
    }
  };
}

test("contract: live version 78-DLA-WS-1 includes response_fulfilment commissioning", () => {
  const text = dlaContract.assembleDlaCanonicalContract().text;
  assert.equal(dlaContract.CONTRACT_VERSION, "78-DLA-WS-3");
  assert.match(text, /S78-WS-1 response fulfilment binding/i);
  assert.match(text, /response_fulfilment\.response_kind/i);
  assert.match(text, /table_compare \| table_complete/i);
});

test("R2 negative: table production with static-only materials fails closed", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: staticOnlyMaterials()
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(
    (check.errors || []).some((e) => /S78_WS_UNBOUND_PRODUCTION/.test(e)),
    check.errors.join("; ")
  );
  assert.ok((check.errors || []).some((e) => /response_kind=table_compare/.test(e)));
});

test("R1 positive: valid comparison_table workspace passes", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        staticOnlyMaterials()[0],
        workspaceRow("A1-W1"),
        diagnosticReviewChecklist("A1-M3", ["A1-W1"])
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("R3 negative: incompatible response_fulfilment on text material", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          purpose: "Claimed workspace via text.",
          specification: "Pipe table embedded in prose.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_compare"
          }
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS_INCOMPATIBLE_TYPE/.test(e)));
});

test("R6 display-only reference table without production passes", () => {
  const page = buildPartialPage(
    activityShell({
      learner_task:
        "1. Study the reference comparison table.\n2. Use the checklist to verify your understanding of the dimensions.",
      expected_output: "Demonstrated understanding of the reference dimensions.",
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "reference_table",
          purpose: "Display the dimension schema for study.",
          specification: "Fixed reference table with column headers only; no learner production."
        },
        {
          material_id: "A1-M2",
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

test("supporting materials plus distinct workspace passes", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: staticOnlyMaterials().slice(0, 2).concat([
        workspaceRow("A1-W1"),
        diagnosticReviewChecklist("A1-M3", ["A1-W1"])
      ])
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("partial exemplar workspace passes when response_fulfilment valid", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        {
          material_id: "A1-W1",
          material_type: "comparison_table",
          purpose: "Learner comparison workspace with one model row.",
          specification:
            "Row 1 fixed exemplar for Entity A/B; rows 2-3 blank learner-completion cells.",
          response_fulfilment: {
            kind: "learner_workspace",
            response_kind: "table_compare",
            allows_partial_exemplar: true
          }
        },
        diagnosticReviewChecklist("A1-C1", ["A1-W1"])
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("classifier: T-001 exhibit step maps to table_compare", () => {
  const result = fulfilment.classifyLearnerProductionSteps(
    activityShell().learner_task,
    activityShell().expected_output
  );
  assert.ok(result.productionKinds.includes("table_compare"));
  const studySteps = result.steps.filter((s) => s.stepNumber <= 2);
  assert.equal(studySteps.every((s) => !s.responseKind), true);
});

test("shape validation rejects invalid response_fulfilment kind", () => {
  const errors = [];
  fulfilment.validateResponseFulfilmentShape(
    { kind: "workspace", response_kind: "table_compare" },
    "test.response_fulfilment",
    errors
  );
  assert.ok(errors.length > 0);
});
