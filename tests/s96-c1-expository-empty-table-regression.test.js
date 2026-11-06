/**
 * C1 Expository empty-table regression — Understanding Experimental Evidence.
 *
 * Assembled tables use natural-language headings that do not token-match every
 * row key (for example "What this means" against meaning). Exact and unique
 * prefix/suffix matches stay in place. Unmatched columns are filled only when
 * the unused data keys line up one-to-one, excluding metadata such as
 * relationship_label. Abbreviated headings remain covered separately.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const learnerPackage = require("../lib/learner-package.js");

const VARIABLES_TITLE = "The three roles of experimental variables";
const STATEMENTS_TITLE = "Three kinds of scientific statement";
const RAW_DATA_TITLE = "Recorded dissolution times";

const ASSEMBLED_VARIABLES_BODY = {
  title: VARIABLES_TITLE,
  representation_type: "Three-row relationship matrix",
  columns: [
    "Variable role",
    "What this means",
    "In the soluble-tablet investigation"
  ],
  rows: [
    {
      variable_role: "Independent variable",
      meaning: "The factor deliberately changed between experimental conditions.",
      investigation_example:
        "Water temperature: 20 C in Condition A and 40 C in Condition B.",
      relationship_label: "What changes"
    },
    {
      variable_role: "Dependent variable",
      meaning: "The outcome measured in each trial.",
      investigation_example: "Dissolution time, recorded in seconds (s).",
      relationship_label: "What is measured"
    },
    {
      variable_role: "Intended controlled variables",
      meaning:
        "Features the procedure seeks to keep consistent so that the intended comparison is more interpretable.",
      investigation_example:
        "Tablet product and nominal size; 200 mL of water; the same type of vessel; no deliberate stirring.",
      relationship_label: "What is intended to stay consistent"
    }
  ],
  repetition_note: "Each independent trial uses a fresh tablet and fresh water."
};

const ASSEMBLED_STATEMENTS_BODY = {
  title: STATEMENTS_TITLE,
  representation_type: "Three-category comparison",
  columns: [
    "Statement type",
    "What the statement does",
    "Example or formulation",
    "Evidential status"
  ],
  rows: [
    {
      statement_type: "Observation",
      function: "Reports something directly recorded.",
      example: "In Condition B, Trial 5 had a recorded dissolution time of 70 s.",
      evidential_status: "Directly checkable against the raw-data table."
    },
    {
      statement_type: "Prediction",
      function: "Expresses a provisional expectation about what might happen.",
      example:
        "I predict that the two temperature conditions may produce different dissolution times.",
      evidential_status:
        "An expectation to reconsider when the evidence is examined; not a finding."
    },
    {
      statement_type: "Explanation",
      function: "Proposes a possible reason for an observation or pattern.",
      example: "Water temperature may influence dissolution time.",
      evidential_status:
        "A possible explanation requiring evaluation; not an established causal conclusion."
    }
  ]
};

const ASSEMBLED_VARIABLES_MARKERS = [
  "Independent variable",
  "The factor deliberately changed between experimental conditions.",
  "Water temperature: 20 C in Condition A and 40 C in Condition B.",
  "Dependent variable",
  "The outcome measured in each trial.",
  "Dissolution time, recorded in seconds (s).",
  "Intended controlled variables",
  "Tablet product and nominal size; 200 mL of water; the same type of vessel; no deliberate stirring."
];

const ASSEMBLED_STATEMENTS_MARKERS = [
  "Observation",
  "Reports something directly recorded.",
  "In Condition B, Trial 5 had a recorded dissolution time of 70 s.",
  "Directly checkable against the raw-data table.",
  "Prediction",
  "Expresses a provisional expectation about what might happen.",
  "Explanation",
  "Proposes a possible reason for an observation or pattern.",
  "Water temperature may influence dissolution time.",
  "A possible explanation requiring evaluation; not an established causal conclusion."
];

const RAW_DATA_BODY = {
  title: RAW_DATA_TITLE,
  columns: ["Trial", "Condition", "Dissolution time (s)"],
  rows: [
    {
      trial: "1",
      condition: "A",
      dissolution_time_s: "93",
      relationship_label: "What changes"
    },
    {
      trial: "5",
      condition: "B",
      dissolution_time_s: "70",
      relationship_label: "What is measured"
    }
  ]
};

const VARIABLES_BODY = {
  title: VARIABLES_TITLE,
  columns: ["Role", "Meaning", "Example", "Relationship"],
  rows: [
    {
      variable_role: "Independent variable",
      meaning: "What the experimenter changes deliberately.",
      investigation_example: "Temperature of the water bath.",
      relationship_label: "The factor under experimental control."
    },
    {
      variable_role: "Dependent variable",
      meaning: "What is measured as the outcome.",
      investigation_example: "Time taken for the tablet to dissolve.",
      relationship_label: "The observed effect."
    },
    {
      variable_role: "Control variable",
      meaning: "What is held constant for a fair test.",
      investigation_example: "Mass of each tablet.",
      relationship_label: "The background conditions kept the same."
    }
  ]
};

const STATEMENTS_BODY = {
  title: STATEMENTS_TITLE,
  columns: [
    { key: "statement_type", label: "Type" },
    { key: "function", label: "Function" },
    { key: "example", label: "Example" },
    { key: "evidential_status", label: "Status" }
  ],
  rows: [
    {
      statement_type: "Observation",
      function: "Records what was measured.",
      example: "The tablet dissolved in 93 seconds.",
      evidential_status: "Directly supported by the data."
    },
    {
      statement_type: "Explanation",
      function: "Accounts for the observed pattern.",
      example: "Warmer water increases collision rate.",
      evidential_status: "Interpretive; requires evaluation against alternatives."
    },
    {
      statement_type: "Prediction",
      function: "Projects a testable expectation.",
      example: "Cooler water will increase dissolution time.",
      evidential_status: "Not yet evidenced; awaits further measurement."
    }
  ]
};

const VARIABLES_MARKERS = [
  "Independent variable",
  "What the experimenter changes deliberately.",
  "Temperature of the water bath.",
  "The factor under experimental control.",
  "Dependent variable",
  "Control variable",
  "Mass of each tablet."
];

const STATEMENTS_MARKERS = [
  "Observation",
  "Records what was measured.",
  "The tablet dissolved in 93 seconds.",
  "Directly supported by the data.",
  "Warmer water increases collision rate.",
  "Interpretive; requires evaluation against alternatives.",
  "Prediction"
];

function c1Page(bodies) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Understanding Experimental Evidence",
    product_id: "expository",
    expository_journey: { purpose: "experimental evidence" },
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Variables and statements",
        exposition:
          "Experimental evidence depends on clear variables and carefully judged statements.",
        order: 1,
        materials: bodies.map(function (body, index) {
          return {
            material_id: "XM-MAT-C1-" + (index + 1),
            commission_id: "COMM-C1-" + (index + 1),
            section_id: "S1",
            kind: "comparison_table",
            title: body.title,
            body: body
          };
        })
      }
    ],
    page_synthesis: {
      overview: "Overview of experimental evidence for the soluble-tablet investigation.",
      study_tips: "Revisit the variable roles before judging statements.",
      closing_paragraph: "Carry forward the distinction between observation and explanation."
    },
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials"
      ]
    }
  };
}

function assertNoEmptyTableCells(html, label) {
  const tables =
    String(html).match(
      /<table class="util-exposition-structured-table"[\s\S]*?<\/table>/gi
    ) || [];
  assert.ok(tables.length >= 1, label + ": expected expository structured tables");
  tables.forEach(function (table, index) {
    assert.doesNotMatch(
      table,
      /<td>\s*<\/td>/,
      label + ": table " + index + " has empty explanatory cells"
    );
  });
}

function assertMarkers(html, markers, label) {
  markers.forEach(function (marker) {
    assert.match(
      html,
      new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      label + ": missing " + marker
    );
  });
}

test("assembled C1 variables table keeps natural-language headings and explanatory cells", () => {
  const page = c1Page([ASSEMBLED_VARIABLES_BODY]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const mat = model.model.expositionSections[0].materials[0];
  assert.equal(mat.type, "expository_structured_table");
  assert.deepEqual(mat.columns, [
    "Variable role",
    "What this means",
    "In the soluble-tablet investigation"
  ]);
  assert.deepEqual(mat.rows[0], [
    "Independent variable",
    "The factor deliberately changed between experimental conditions.",
    "Water temperature: 20 C in Condition A and 40 C in Condition B."
  ]);
  assert.equal(mat.rows[0].indexOf("What changes"), -1);

  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assertMarkers(html, ASSEMBLED_VARIABLES_MARKERS, "assembled-variables");
  assert.doesNotMatch(html, /What changes/);
  assert.doesNotMatch(html, /What is measured/);
  assertNoEmptyTableCells(html, "assembled-variables");

  const pkg = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: []
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || {}));
  const packaged = String(pkg.package && pkg.package.html ? pkg.package.html : "");
  assertMarkers(packaged, ASSEMBLED_VARIABLES_MARKERS, "assembled-variables-package");
  assertNoEmptyTableCells(packaged, "assembled-variables-package");
});

test("assembled C1 scientific-statement table fills the unmatched function column", () => {
  const page = c1Page([ASSEMBLED_STATEMENTS_BODY]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const mat = model.model.expositionSections[0].materials[0];
  assert.equal(mat.type, "expository_structured_table");
  assert.deepEqual(mat.columns, [
    "Statement type",
    "What the statement does",
    "Example or formulation",
    "Evidential status"
  ]);
  assert.deepEqual(mat.rows[0], [
    "Observation",
    "Reports something directly recorded.",
    "In Condition B, Trial 5 had a recorded dissolution time of 70 s.",
    "Directly checkable against the raw-data table."
  ]);

  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assertMarkers(html, ASSEMBLED_STATEMENTS_MARKERS, "assembled-statements");
  assertNoEmptyTableCells(html, "assembled-statements");

  const pkg = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: []
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || {}));
  const packaged = String(pkg.package && pkg.package.html ? pkg.package.html : "");
  assertMarkers(packaged, ASSEMBLED_STATEMENTS_MARKERS, "assembled-statements-package");
  assertNoEmptyTableCells(packaged, "assembled-statements-package");
});

test("canonical raw-data table keeps exact column alignment and ignores relationship_label", () => {
  const page = c1Page([RAW_DATA_BODY]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const mat = model.model.expositionSections[0].materials[0];
  assert.deepEqual(mat.columns, ["Trial", "Condition", "Dissolution time (s)"]);
  assert.deepEqual(mat.rows, [
    ["1", "A", "93"],
    ["5", "B", "70"]
  ]);

  const rendered = renderLearnerPageHtml(page);
  const html = String(rendered.html || "");
  assert.match(html, new RegExp(RAW_DATA_TITLE));
  assert.match(html, /<td>1<\/td><td>A<\/td><td>93<\/td>/);
  assert.match(html, /<td>5<\/td><td>B<\/td><td>70<\/td>/);
  assert.doesNotMatch(html, /What changes/);
  assert.doesNotMatch(html, /What is measured/);
  assertNoEmptyTableCells(html, "raw-data");
});

test("ambiguous unused keys are not guessed into unmatched columns", () => {
  const page = c1Page([
    {
      title: "Ambiguous comparison",
      columns: ["Variable role", "First unexplained heading", "Second unexplained heading"],
      rows: [
        {
          variable_role: "Independent variable",
          meaning: "Changed deliberately.",
          investigation_example: "Water temperature.",
          qualification: "Controls are imperfect."
        }
      ]
    }
  ]);
  const model = buildPageModel(page);
  const mat = model.model.expositionSections[0].materials[0];
  assert.deepEqual(mat.rows[0], ["Independent variable", "", ""]);
  const html = String(renderLearnerPageHtml(page).html || "");
  assert.doesNotMatch(html, /Changed deliberately/);
  assert.doesNotMatch(html, /Water temperature/);
  assert.doesNotMatch(html, /Controls are imperfect/);
});

test("C1 variables table retains explanatory cells in packaged HTML", () => {
  const page = c1Page([VARIABLES_BODY]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const mat = model.model.expositionSections[0].materials[0];
  assert.equal(mat.type, "expository_structured_table");
  assert.equal(mat.publicationFailure || "", "");

  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, new RegExp(VARIABLES_TITLE));
  assertMarkers(html, VARIABLES_MARKERS, "variables-render");
  assertNoEmptyTableCells(html, "variables-render");

  const pkg = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: []
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || {}));
  const packaged = String(pkg.package && pkg.package.html ? pkg.package.html : "");
  assertMarkers(packaged, VARIABLES_MARKERS, "variables-package");
  assertNoEmptyTableCells(packaged, "variables-package");
});

test("C1 scientific-statement table retains explanatory cells in packaged HTML", () => {
  const page = c1Page([STATEMENTS_BODY]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const mat = model.model.expositionSections[0].materials[0];
  assert.equal(mat.type, "expository_structured_table");
  assert.equal(mat.publicationFailure || "", "");

  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, new RegExp(STATEMENTS_TITLE));
  assertMarkers(html, STATEMENTS_MARKERS, "statements-render");
  assertNoEmptyTableCells(html, "statements-render");

  const pkg = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: []
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || {}));
  const packaged = String(pkg.package && pkg.package.html ? pkg.package.html : "");
  assertMarkers(packaged, STATEMENTS_MARKERS, "statements-package");
  assertNoEmptyTableCells(packaged, "statements-package");
});

test("both C1 table structures retain content together in one packaged page", () => {
  const page = c1Page([VARIABLES_BODY, STATEMENTS_BODY]);
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assertMarkers(html, VARIABLES_MARKERS.concat(STATEMENTS_MARKERS), "combined-render");
  assertNoEmptyTableCells(html, "combined-render");

  const pkg = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: []
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || {}));
  const packaged = String(pkg.package && pkg.package.html ? pkg.package.html : "");
  assertMarkers(
    packaged,
    VARIABLES_MARKERS.concat(STATEMENTS_MARKERS),
    "combined-package"
  );
  assertNoEmptyTableCells(packaged, "combined-package");
});
