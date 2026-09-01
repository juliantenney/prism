/**
 * Semantic learner input modality — Gate 1 commissioning and composition.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const responseFields = require(path.join(repoRoot, "lib", "dla-response-fields.js"));
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const gamAssembler = require(path.join(repoRoot, "lib", "gam-canonical-assembler.js"));
const collectResponseParts = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "compose-response-parts.js"
));
const learnerSurfaceRegistry = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "learner-surface-registry.js"
));
const types = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "response-part-types.js"
));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function activityShell(overrides) {
  return Object.assign(
    {
      activity_id: "A3",
      title: "Derive the constrained optimum",
      learner_task:
        "1. Study the model.\n2. Use the response template to record your derivation steps.",
      expected_output: "A stepped derivation with Lagrangian, FOCs, and interpretation.",
      activity_preamble: "Apply the Lagrange method to the commissioned case.",
      intellectual_coherence_bridge: "You have seen the setup; now derive the conditions.",
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      evidence_decision: {
        required: false,
        reason: "No inspectable evidence provider required.",
        provider_material_ids: []
      },
      required_materials: [],
      materials: []
    },
    overrides || {}
  );
}

function templateMaterialRow(materialId) {
  return {
    material_id: materialId,
    material_type: "template",
    purpose: "Structured derivation workspace.",
    specification:
      "Author successive **Label:** sections for each ordered working step; blank learner response after each label.",
    response_fulfilment: {
      kind: "learner_text_production",
      response_kind: "text_compose"
    },
    response_fields: [
      { label: "Explanation", input_modality: "text" },
      { label: "Lagrangian", input_modality: "math" },
      { label: "First-order condition with respect to x", input_modality: "math" },
      { label: "Interpretation", input_modality: "text" }
    ]
  };
}

function templateCommissionRows(materialId) {
  return [
    templateMaterialRow(materialId),
    {
      material_id: "A3-M2",
      material_type: "checklist",
      purpose: "Diagnostic review of the derivation workspace.",
      specification: "Three criteria on setup, derivation steps, and interpretation quality.",
      diagnostic_review: {
        covers_response_material_ids: [materialId]
      }
    }
  ];
}

function templateBody() {
  return [
    "**Explanation:**",
    "Explain the setup briefly.",
    "",
    "**Lagrangian:**",
    "Record the Lagrangian.",
    "",
    "**First-order condition with respect to x:**",
    "Record the FOC for x.",
    "",
    "**Interpretation:**",
    "Interpret the result."
  ].join("\n");
}

function buildPartialPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [clone(activity)]
  };
}

function collectTemplateParts(activity, materialBody) {
  const materialId = "A3-M1";
  return collectResponseParts.collectResponseParts({
    activityId: activity.activity_id,
    momentKind: "do",
    items: [
      {
        kind: "material",
        material: {
          id: materialId,
          type: "template",
          body: materialBody
        }
      }
    ],
    taskSteps: [],
    expectedOutput: null,
    modelActivity: {
      sourceActivity: activity
    }
  });
}

test("A: DLA accepts mixed response_fields modalities on template row", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: templateCommissionRows("A3-M1")
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("B: invalid input_modality is rejected at DLA capture", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: templateCommissionRows("A3-M1").map(function (row) {
        if (row.material_id !== "A3-M1") return row;
        const next = clone(row);
        next.response_fields[1].input_modality = "latex";
        return next;
      })
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match(check.errors.join("\n"), /input_modality must be "text" or "math"/i);
});

test("C: omitted input_modality defaults to text at composition", () => {
  const row = clone(templateMaterialRow("A3-M1"));
  delete row.response_fields[0].input_modality;
  const collected = collectTemplateParts(
    activityShell({ required_materials: [row] }),
    templateBody()
  );
  const explanation = collected.parts.find((part) => part.label === "Explanation");
  assert.ok(explanation);
  assert.equal(explanation.inputModality, "text");
});

test("D: GAM commission projection preserves DLA response_fields", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: templateCommissionRows("A3-M1")
    })
  );
  const ctx = gamAssembler.createGamAssemblyContext({ dlaPage: page });
  const section = gamAssembler.buildSectionCommission(ctx);
  assert.match(section, /"response_fields"/);
  assert.match(section, /"input_modality": "math"/);
  assert.match(section, /"label": "Lagrangian"/);
});

test("E: composed response parts receive commissioned modalities", () => {
  const collected = collectTemplateParts(
    activityShell({ required_materials: templateCommissionRows("A3-M1") }),
    templateBody()
  );
  const byLabel = Object.create(null);
  collected.parts.forEach(function (part) {
    byLabel[part.label] = part;
  });
  assert.equal(byLabel.Explanation.inputModality, "text");
  assert.equal(byLabel.Lagrangian.inputModality, "math");
  assert.equal(
    byLabel["First-order condition with respect to x"].inputModality,
    "math"
  );
  assert.equal(byLabel.Interpretation.inputModality, "text");
});

test("F: template without response_fields keeps text modality and text_entry surface", () => {
  const row = templateMaterialRow("A3-M1");
  delete row.response_fields;
  const collected = collectTemplateParts(
    activityShell({ required_materials: [row] }),
    templateBody()
  );
  collected.parts.forEach(function (part) {
    assert.equal(part.inputModality, "text");
    assert.equal(part.surfaceKind, types.SURFACE_KIND.TEXT_ENTRY);
    const mapped = learnerSurfaceRegistry.workspaceFromResponsePart(part);
    assert.equal(mapped.ok, true);
    assert.equal(mapped.workspace.capability, "text_entry");
  });
});

test("G: identity mismatch defaults to text and emits diagnostics", () => {
  const row = templateMaterialRow("A3-M1");
  row.response_fields.push({ label: "Ghost section", input_modality: "math" });
  const collected = collectTemplateParts(
    activityShell({ required_materials: [row] }),
    templateBody()
  );
  const ghostPart = collected.parts.find((part) => part.label === "Ghost section");
  assert.equal(ghostPart, undefined);
  assert.ok(
    collected.diagnostics.some(
      (d) => d.code === "COMMISSIONED_RESPONSE_FIELD_UNMATCHED" && d.label === "Ghost section"
    )
  );

  const bodyWithRenamed = templateBody().replace(
    "**Lagrangian:**",
    "**Lagrangian (renamed):**"
  );
  const renamedCollected = collectTemplateParts(
    activityShell({ required_materials: [row] }),
    bodyWithRenamed
  );
  const renamed = renamedCollected.parts.find(
    (part) => part.label === "Lagrangian (renamed)"
  );
  assert.equal(renamed.inputModality, "text");
  assert.ok(
    renamedCollected.diagnostics.some(
      (d) => d.code === "RESPONSE_FIELD_LABEL_MISMATCH" && d.label === "Lagrangian (renamed)"
    )
  );
});

test("H: legacy fixture without response_fields validates unchanged", () => {
  const page = buildPartialPage(
    activityShell({
      required_materials: [
        {
          material_id: "A3-M1",
          material_type: "template",
          purpose: "Structured derivation workspace.",
          specification: "Author successive **Label:** sections for each ordered working step.",
          response_fulfilment: {
            kind: "learner_text_production",
            response_kind: "text_compose"
          }
        },
        {
          material_id: "A3-M2",
          material_type: "checklist",
          purpose: "Diagnostic review of the derivation workspace.",
          specification: "Three criteria on setup, derivation steps, and interpretation quality.",
          diagnostic_review: {
            covers_response_material_ids: ["A3-M1"]
          }
        }
      ]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("DLA contract documents optional response_fields commissioning", () => {
  const contract = dlaContract.assembleDlaCanonicalContract().text;
  assert.match(contract, /response_fields/);
  assert.match(contract, /input_modality/);
});

test("response_fields rejected on non-template material rows", () => {
  const row = templateMaterialRow("A3-M1");
  row.material_type = "text";
  const page = buildPartialPage(
    activityShell({
      required_materials: [row, templateCommissionRows("A3-M1")[1]]
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match(check.errors.join("\n"), /only supported on template/i);
});

test("duplicate response_fields labels fail capture", () => {
  const row = templateMaterialRow("A3-M1");
  row.response_fields.push({ label: "Lagrangian", input_modality: "text" });
  responseFields.validateResponseFieldsShape(
    row.response_fields,
    "response_fields",
    [],
    row
  );
  const errors = [];
  responseFields.validateResponseFieldsShape(row.response_fields, "response_fields", errors, row);
  assert.ok(errors.some((e) => /duplicates an earlier response_fields label/i.test(e)));
});
