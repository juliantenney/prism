"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const renderMaterial = require("../lib/learner-renderer-vnext/render-material").renderMaterial;
const tableParse = require("../lib/learner-renderer-vnext/table-material-parse");
const completionTable = require("../lib/learner-renderer-vnext/completion-table-workspace");
const classifyActivityBeats =
  require("../lib/learner-renderer-vnext/compose-moment-classification").classifyActivityBeats;
const normalizePageForRender =
  require("../lib/page-render-normalize").normalizePageForRender;

function pageWithMaterial(material) {
  return {
    schema_version: "2.0.0",
    title: "Phase5 table worksheet page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "A1",
        learner_task: "",
        expected_output: "",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "explanation" },
            { function: "worked_thinking" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        materials: [material]
      }
    ]
  };
}

test("phase5 table: explicit subtypes resolve to canonical table families", () => {
  const cases = [
    {
      subtype: "reference_table",
      content:
        "| Criterion | Description |\n| --- | --- |\n| Evidence | Uses direct quotation |"
    },
    {
      subtype: "data_table",
      content:
        "| Variable | Value |\n| --- | --- |\n| CPI | 5.4 |\n| Core CPI | 4.1 |"
    },
    {
      subtype: "impact_table",
      content:
        "| Group | Impact |\n| --- | --- |\n| Renters | Higher costs |\n| Savers | Mixed |"
    }
  ];
  cases.forEach(function (entry, index) {
    const source = {
      material_id: "A1-M" + index,
      material_type: "table",
      subtype: entry.subtype,
      content: entry.content
    };
    const model = parseMaterial.buildMaterialModel(source, index);
    assert.equal(model.type, entry.subtype);
    assert.equal(model.authoredType, "table");
    assert.match(model.body, /\| --- \|/);
  });
});

test("phase5 table: static populated and editable blank policies are preserved", () => {
  const staticMaterial = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M1",
      material_type: "table",
      subtype: "reference_table",
      content:
        "| Item | Meaning |\n| --- | --- |\n| Elasticity | Responsiveness to price change |"
    },
    0
  );
  assert.equal(completionTable.shouldComposeTableWorkspaceMaterial(staticMaterial), false);

  const editableMaterial = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M2",
      material_type: "table",
      editable: true,
      rows: [
        { Variable: "CPI", Value: "" },
        { Variable: "PPI", Value: "" }
      ],
      columns: ["Variable", "Value"]
    },
    1
  );
  assert.equal(editableMaterial.type, "data_table");
  assert.equal(completionTable.shouldComposeTableWorkspaceMaterial(editableMaterial), true);
  const extracted = tableParse.extractTableFromMaterial(editableMaterial);
  assert.equal(extracted.header[1], "Value");
  assert.equal(extracted.rows.length, 2);
  assert.equal(extracted.rows[1][0], "PPI");
  assert.equal(extracted.rows[1][1], "");
});

test("phase5 table: ambiguous generic table payload is rejected clearly", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "table",
    content: "| Left | Right |\n| --- | --- |\n| A | B |"
  });
  const result = vnext.buildPageModel(page);
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "AMBIGUOUS_MATERIAL_TYPE";
    })
  );
});

test("phase5 table: malformed structured table payload fails INVALID_MATERIAL_PAYLOAD", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "table",
    content: { rows: { bad: true }, columns: ["A", "B"] }
  });
  const result = vnext.buildPageModel(page);
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "INVALID_MATERIAL_PAYLOAD";
    })
  );
});

test("phase5 worksheet: template payload resolves to canonical template", () => {
  const source = {
    material_id: "A1-M1",
    material_type: "worksheet",
    content: {
      sections: [
        { heading: "Claim", items: ["State your claim"] },
        { heading: "Evidence", items: ["Add one quotation"] }
      ]
    }
  };
  const model = parseMaterial.buildMaterialModel(source, 0);
  assert.equal(model.type, "template");
  assert.equal(model.authoredType, "worksheet");
  assert.match(model.body, /### Claim/);
  assert.match(renderMaterial(model), /data-material-type="template"/);
});

test("phase5 worksheet: editable table payload resolves to data_table with workspace behavior", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "worksheet",
    editable: true,
    rows: [
      { Case: "A", Decision: "" },
      { Case: "B", Decision: "" }
    ],
    columns: ["Case", "Decision"]
  });
  const result = vnext.buildPageModel(page);
  assert.equal(result.ok, true);
  const material = result.model.activities[0].beats[0].materials[0];
  assert.equal(material.type, "data_table");
  assert.equal(completionTable.shouldComposeTableWorkspaceMaterial(material), true);
  const moments = classifyActivityBeats(result.model.activities[0]);
  assert.equal(moments.doBeats.length >= 1, true);
});

test("phase5 worksheet: structural container expands child materials in normalisation layer", () => {
  const page = {
    schema_version: "2.0.0",
    title: "wrapper",
    activities: [
      {
        activity_id: "A1",
        materials: [
          {
            type: "worksheet",
            content: {
              materials: [
                {
                  type: "comparison_table",
                  content: "| A | B |\n| --- | --- |\n| 1 | 2 |"
                },
                {
                  type: "prompt_set",
                  content: { prompts: ["Compare both cases.", "State one difference."] }
                }
              ]
            }
          }
        ]
      }
    ]
  };
  const normalized = normalizePageForRender(page);
  const materials = normalized.activities[0].materials;
  const sequence = materials._render_sequence.map(function (entry) {
    return entry.material_type;
  });
  assert.deepEqual(sequence, ["comparison_table", "prompt_set"]);
  assert.equal(Object.keys(materials).some(function (key) {
    return key === "worksheet";
  }), false);
});

test("phase5 worksheet: ambiguous and malformed worksheet payloads fail clearly", () => {
  const ambiguous = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M1",
      material_type: "worksheet",
      content: { foo: "bar" }
    })
  );
  assert.equal(ambiguous.ok, false);
  assert.ok(
    ambiguous.errors.some(function (error) {
      return error.code === "AMBIGUOUS_MATERIAL_TYPE";
    })
  );

  const malformed = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M2",
      material_type: "worksheet",
      editable: true,
      content: { rows: { nope: true } }
    })
  );
  assert.equal(malformed.ok, false);
  assert.ok(
    malformed.errors.some(function (error) {
      return error.code === "INVALID_MATERIAL_PAYLOAD";
    })
  );
});
