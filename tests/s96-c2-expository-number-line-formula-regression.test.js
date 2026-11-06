/**
 * C2 Expository defects:
 * - Annotated number-line XM commissions route through the existing image pipeline
 * - Object-valued formula fields must not render as "[object Object]"
 * - Structured formal_notes stay structured and author-only
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const fflate = require("fflate");

const handoff = require("../lib/expository-xm-illustration-handoff.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const contracts = require("../lib/expository-contracts.js");
const {
  buildExpositionStructuredMaterial,
  renderExpositionStructuredMaterial,
  renderStructuredValue
} = require("../lib/learner-renderer-vnext/expository-structured-materials.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const NUMBER_LINE_ALT =
  "Three reaction times appear at 10 s, 12 s and 14 s on a shared axis. A range indicator spans from 10 s to 14 s, a width of 4 s.";
const XM_NUMBER_LINE_AFFORDANCE_ID = "va-xm-xms301";
const XM_NUMBER_LINE_BRIEF_ID = "vb-38-4-va-xm-xms301-section-s3-section-after-content";
const NUMBER_LINE_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);
const NUMBER_LINE_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(NUMBER_LINE_PNG_BYTES).toString("base64");
const EDITORIAL_PNG_BYTES = Uint8Array.from(NUMBER_LINE_PNG_BYTES);
EDITORIAL_PNG_BYTES[40] = 0x64;
const EDITORIAL_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(EDITORIAL_PNG_BYTES).toString("base64");

function numberLineMaterial() {
  return {
    material_id: "XM-S3-01",
    section_id: "S3",
    kind: "Annotated number-line representation",
    title: "Reaction-time range on a number line",
    body: {
      title: "Reaction-time range on a number line",
      format: "Annotated number-line representation",
      observations: [
        { value: "10 s", label: "Trial A" },
        { value: "12 s", label: "Trial B" },
        { value: "14 s", label: "Trial C" }
      ],
      ticks: ["10 s", "12 s", "14 s"],
      range_indicator: {
        start: "10 s",
        end: "14 s",
        label: "Range",
        description: "Range of 4 s"
      },
      text_alternative: NUMBER_LINE_ALT
    },
    formal_notes: {
      render_as: "image",
      preserve_values: ["10 s", "12 s", "14 s", "4 s"]
    }
  };
}

function calculationMaterial() {
  return {
    material_id: "XM-S2-01",
    section_id: "S2",
    kind: "Annotated calculation sequence",
    title: "Calculating the Arithmetic Mean",
    body: {
      title: "Calculating the Arithmetic Mean",
      formula: {
        expression: "(10 + 12 + 14) / 3 = 12",
        spoken_equivalent: "ten plus twelve plus fourteen, all over three, equals twelve",
        notation: "x̄ = Σx / n"
      },
      annotations: [{ label: "Mean", description: "The arithmetic average of the three times." }]
    },
    formal_notes: {
      author_note: "Keep the mean calculation as structured educational content."
    }
  };
}

function deviationTableMaterial() {
  return {
    material_id: "XM-S2-02",
    section_id: "S2",
    kind: "Worked deviation table",
    title: "Deviations from the mean",
    body: {
      caption: "Deviations from the mean",
      columns: ["Observation", "Value", "Deviation from mean"],
      rows: [
        { Observation: "Trial A", Value: "10 s", "Deviation from mean": "−2 s" },
        { Observation: "Trial B", Value: "12 s", "Deviation from mean": "0 s" },
        { Observation: "Trial C", Value: "14 s", "Deviation from mean": "+2 s" }
      ]
    }
  };
}

function assembledMeanMaterial() {
  return {
    material_id: "XM-S2-01",
    commission_id: "XM-S2-01",
    section_id: "S2",
    kind: "Annotated calculation sequence",
    body: {
      title: "Calculating the Arithmetic Mean",
      introductory_text:
        "The mean is calculated by adding every observation and dividing by the number of observations. This worked example uses three separate illustrative measurements: 10 s, 12 s and 14 s.",
      formula: {
        expression: "x̄ = Σxᵢ / n",
        spoken_equivalent:
          "The sample mean equals the sum of the observations divided by the number of observations.",
        notation: [
          {
            symbol: "x̄",
            meaning: "The arithmetic mean of the sample.",
            pronunciation: "x-bar"
          },
          {
            symbol: "Σ",
            meaning: "Add together all the specified values.",
            pronunciation: "sum"
          },
          {
            symbol: "xᵢ",
            meaning: "An individual observation in the dataset.",
            pronunciation: "x sub i"
          },
          {
            symbol: "n",
            meaning: "The number of observations in the sample.",
            pronunciation: "n"
          }
        ]
      }
    }
  };
}

function assembledDeviationMaterial() {
  return {
    material_id: "XM-S4-01",
    commission_id: "XM-S4-01",
    section_id: "S4",
    kind: "Worked deviation table",
    body: {
      title: "Calculating Sample Standard Deviation from Deviations",
      introductory_text:
        "Sample standard deviation uses each observation's deviation from the sample mean. For the illustrative measurements 10 s, 12 s and 14 s, the mean is 12 s.",
      formula: {
        expression: "s = √[Σ(xᵢ − x̄)² / (n − 1)]",
        spoken_equivalent:
          "The sample standard deviation is the square root of the sum of squared deviations from the mean, divided by the sample size minus one.",
        symbols: [
          { symbol: "s", meaning: "Sample standard deviation" },
          { symbol: "xᵢ", meaning: "An individual observation" },
          { symbol: "x̄", meaning: "Sample mean" },
          { symbol: "Σ", meaning: "Sum of the specified values" },
          { symbol: "n", meaning: "Number of observations" },
          { symbol: "√", meaning: "Square root" }
        ]
      },
      table: {
        columns: [
          { key: "observation", heading: "Observation", unit: "s" },
          { key: "deviation", heading: "Deviation from 12 s", unit: "s" },
          { key: "squared_deviation", heading: "Squared deviation", unit: "s²" }
        ],
        rows: [
          {
            observation: "10 s",
            deviation: "10 − 12 = −2 s",
            squared_deviation: "(−2)² = 4 s²"
          },
          {
            observation: "12 s",
            deviation: "12 − 12 = 0 s",
            squared_deviation: "0² = 0 s²"
          },
          {
            observation: "14 s",
            deviation: "14 − 12 = +2 s",
            squared_deviation: "(+2)² = 4 s²"
          }
        ],
        footer: {
          label: "Sum of squared deviations",
          expression: "4 s² + 0 s² + 4 s² = 8 s²"
        }
      },
      calculation_sequence: [
        {
          step: 1,
          label: "Establish the mean",
          expression: "x̄ = 12 s",
          explanation: "Every deviation is calculated relative to the same sample mean."
        }
      ]
    }
  };
}

function assembledComparisonMaterial() {
  return {
    material_id: "XM-S5-01",
    commission_id: "XM-S5-01",
    section_id: "S5",
    kind: "Comparative statistics table",
    body: {
      title: "Three Complementary Descriptions of the Same Measurements",
      introductory_text:
        "The three descriptive statistics answer different questions about the illustrative observations 10 s, 12 s and 14 s. Reading them together gives a description of both centre and spread.",
      table: {
        columns: [
          { key: "statistic", heading: "Statistic" },
          { key: "practice_result", heading: "Practice result" },
          { key: "descriptive_question", heading: "What does it describe?" },
          { key: "calculation_basis", heading: "What information does it use?" },
          { key: "limitation", heading: "What does it not tell us?" }
        ],
        rows: [
          {
            statistic: "Arithmetic mean",
            practice_result: "12 s",
            descriptive_question: "Where is the arithmetic centre of the observations?",
            calculation_basis: "All observations, added together and divided by the sample size.",
            limitation: "It does not describe how widely the observations vary around that centre."
          },
          {
            statistic: "Range",
            practice_result: "4 s",
            descriptive_question: "How far apart are the smallest and largest observed values?",
            calculation_basis: "The minimum and maximum observations.",
            limitation:
              "It does not directly describe the positions of the observations between the extremes or guarantee limits for future observations."
          },
          {
            statistic: "Sample standard deviation",
            practice_result: "2 s",
            descriptive_question: "How much do the observations vary around their mean?",
            calculation_basis:
              "Every observation's deviation from the mean, using the sample standard-deviation calculation.",
            limitation:
              "It does not establish measurement accuracy, explain the cause of variation or directly quantify uncertainty in the mean."
          }
        ]
      },
      integrated_interpretation:
        "The illustrative observations have an arithmetic centre of 12 seconds, an observed span of 4 seconds and a sample standard deviation of 2 seconds. The mean describes centre; the range and sample standard deviation describe different aspects of spread. None of the three statistics alone provides a complete scientific explanation.",
      accessible_text_equivalent:
        "Arithmetic mean: 12 seconds. It uses all observations to describe the arithmetic centre, but does not describe spread. Range: 4 seconds. It uses the minimum and maximum to describe the observed span, but does not describe the distribution of intermediate values. Sample standard deviation: 2 seconds. It uses all observations' deviations from the mean to describe spread around the centre, but does not establish measurement accuracy or explain why variation occurred.",
      interpretive_boundary:
        "All three results refer exclusively to the separate practice dataset. They are not numerical summaries of Condition A or Condition B in the soluble-tablet investigation."
    }
  };
}

function stringEquationMaterial() {
  return {
    material_id: "XM-EQ-01",
    section_id: "S4",
    kind: "equation",
    title: "Range identity",
    body: {
      title: "Range identity",
      formula: "Range = max − min",
      caption: "Range is the difference between extremes."
    }
  };
}

function pageWith(materials, affordances) {
  const bySection = {};
  materials.forEach(function (material) {
    const sid = material.section_id;
    if (!bySection[sid]) {
      bySection[sid] = {
        section_id: sid,
        title: sid,
        exposition: "Section " + sid + " exposition.",
        materials: []
      };
    }
    bySection[sid].materials.push(material);
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Understanding Descriptive Statistics",
    activities: [],
    sections: Object.keys(bySection).map(function (key) {
      return bySection[key];
    }),
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: affordances || [],
    page_synthesis: {
      overview: "Descriptive statistics overview.",
      learning_purpose: "Read centre and spread from short data sets."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials",
        "design_page"
      ]
    }
  };
}

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, "missing material " + materialId);
  const open = html.lastIndexOf("<article", start);
  const end = html.indexOf("</article>", start);
  return html.slice(open, end + "</article>".length);
}

test("annotated number-line XM is recognised and becomes a number_line_segments image job", () => {
  const material = numberLineMaterial();
  assert.equal(handoff.isNumberLineSpecification(material), true);
  assert.equal(handoff.isUnrealizedIllustrationSpecification(material), true);

  const page = pageWith([material]);
  const defer = {
    affordance_id: "va-S3-defer-01",
    scope: "section",
    section_id: "S3",
    visual_decision: "defer",
    defer_reason: "worked_example_sufficient_first",
    subject: "Number line already in materials",
    context: "Visual brief: structured material treated as existing visual.",
    evidence_anchors: ["S3.materials.XM-S3-01"],
    rationale: "Incorrectly treats the JSON specification as a realised graphic."
  };
  page.visual_affordances = [defer];

  const conflicts = handoff.collectSuppressedUnrealizedXmGraphics(page);
  assert.equal(conflicts.length, 1);
  assert.match(conflicts[0].message, /must not suppress unrealised commissioned graphic XM-S3-01/i);

  const prepared = handoff.preparePageForXmIllustrationJobs(page);
  assert.equal(
    prepared.visual_affordances.some(function (row) {
      return row && row.visual_decision === "defer";
    }),
    false,
    "defer suppressing the number line must be removed"
  );
  const generate = prepared.visual_affordances.find(function (row) {
    return row && row.material_id === "XM-S3-01" && row.visual_decision === "generate";
  });
  assert.ok(generate);
  assert.equal(generate.preferred_representation, "number_line_segments");
  assert.equal(generate.requires_exact_data_match, true);
  assert.match(generate.must_show.join("\n"), /10 s/);
  assert.match(generate.must_show.join("\n"), /12 s/);
  assert.match(generate.must_show.join("\n"), /14 s/);
  assert.match(generate.must_show.join("\n"), /4 s/);

  const pipeline = workspace.buildVisualJobsPipelineFromPage(pageWith([material], [defer]));
  assert.equal(pipeline.plannerResult.valid, true, JSON.stringify(pipeline.plannerResult.errors));
  assert.equal(pipeline.compilerResult.valid, true, JSON.stringify(pipeline.compilerResult.errors));
  assert.equal(pipeline.plannerResult.jobs.length, 1);
  assert.equal(pipeline.plannerResult.jobs[0].preferred_representation, "number_line_segments");
  assert.equal(pipeline.plannerResult.jobs[0].requires_exact_data_match, true);
  const joined = pipeline.plannerResult.jobs[0].must_show.join("\n");
  assert.match(joined, /10 s/);
  assert.match(joined, /12 s/);
  assert.match(joined, /14 s/);
  assert.match(joined, /4 s/);
});

test("unattached number-line publishes accessible alternative, not construction fields", () => {
  const page = pageWith([numberLineMaterial(), deviationTableMaterial()]);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const numberLine = model.model.expositionSections
    .flatMap(function (section) {
      return section.materials;
    })
    .find(function (material) {
      return material.id === "XM-S3-01";
    });
  assert.equal(numberLine.type, "expository_unfulfilled_illustration");
  assert.equal(numberLine.accessibleText, NUMBER_LINE_ALT);

  const rendered = renderLearnerPageHtml(page);
  const html = String(rendered.html || "");
  const block = article(html, "XM-S3-01");
  assert.match(block, /data-illustration-status="unfulfilled"/);
  assert.match(block, /10 s, 12 s and 14 s/);
  assert.match(block, /width of 4 s/i);
  assert.doesNotMatch(block, /\[object Object\]/);
  ["Range indicator", "Start", "End", "Label", "Description"].forEach(function (label) {
    assert.equal(block.includes(">" + label + "<"), false, label);
  });

  const tableBlock = article(html, "XM-S2-02");
  assert.match(tableBlock, /<table\b/i);
  assert.match(tableBlock, /Deviation from mean/);
  assert.match(tableBlock, /−2 s/);
  assert.doesNotMatch(html, /formal_notes/);
  assert.doesNotMatch(html, /AUTHOR-ONLY|author_note|preserve_values/);
});

test("object-valued formula renders expression; structured formal_notes stay author-only", () => {
  const normalized = contracts.normalizeExpositoryMaterials({
    materials: [calculationMaterial(), stringEquationMaterial()]
  });
  assert.equal(typeof normalized.materials[0].formal_notes, "object");
  assert.equal(
    normalized.materials[0].formal_notes.author_note,
    "Keep the mean calculation as structured educational content."
  );
  assert.notEqual(normalized.materials[0].formal_notes, "[object Object]");

  const built = buildExpositionStructuredMaterial(normalized.materials[0], "S2", 0);
  assert.equal(built.type, "expository_structured_equation");
  assert.equal(built.equation, "(10 + 12 + 14) / 3 = 12");
  assert.notEqual(built.equation, "[object Object]");
  assert.ok(
    built.annotations.some(function (ann) {
      return String(ann.description || "").indexOf("ten plus twelve plus fourteen") !== -1;
    })
  );

  const html = renderExpositionStructuredMaterial(built);
  assert.match(html, /\(10 \+ 12 \+ 14\) \/ 3 = 12/);
  assert.match(html, /Spoken form/);
  assert.match(html, /Notation/);
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /author_note/);

  const stringBuilt = buildExpositionStructuredMaterial(normalized.materials[1], "S4", 1);
  assert.equal(stringBuilt.equation, "Range = max − min");
  const stringHtml = renderExpositionStructuredMaterial(stringBuilt);
  assert.match(stringHtml, /Range = max − min/);
  assert.doesNotMatch(stringHtml, /\[object Object\]/);
});

function assertNoSchemaHeadings(html) {
  assert.equal(html.includes('<th scope="col">Key</th>'), false);
  assert.equal(html.includes('<th scope="col">Heading</th>'), false);
  assert.equal(html.includes("[object Object]"), false);
}

test("assembled C2 mean notation, deviation table and comparison table render in learner HTML", () => {
  const mean = buildExpositionStructuredMaterial(assembledMeanMaterial(), "S2", 0);
  assert.equal(mean.type, "expository_structured_equation");
  assert.equal(mean.equation, "x̄ = Σxᵢ / n");
  assert.equal(
    mean.annotations.some(function (ann) {
      return ann.description === "[object Object]";
    }),
    false
  );
  ["x-bar", "sum", "x sub i", "The arithmetic mean of the sample."].forEach(function (part) {
    assert.ok(
      mean.annotations.some(function (ann) {
        return String(ann.label + " " + ann.description).indexOf(part) !== -1;
      }),
      part
    );
  });

  const deviation = buildExpositionStructuredMaterial(assembledDeviationMaterial(), "S4", 0);
  assert.equal(deviation.type, "expository_structured_equation");
  assert.equal(deviation.equation, "s = √[Σ(xᵢ − x̄)² / (n − 1)]");
  assert.deepEqual(deviation.columns, ["Observation", "Deviation from 12 s", "Squared deviation"]);
  assert.equal(deviation.rows.length, 3);
  assert.match(deviation.tableCaption, /8 s²/);

  const comparison = buildExpositionStructuredMaterial(assembledComparisonMaterial(), "S5", 0);
  assert.equal(comparison.type, "expository_structured_table");
  assert.deepEqual(comparison.columns, [
    "Statistic",
    "Practice result",
    "What does it describe?",
    "What information does it use?",
    "What does it not tell us?"
  ]);

  const symbolMap = buildExpositionStructuredMaterial(
    {
      material_id: "XM-MAP-01",
      section_id: "S2",
      kind: "equation",
      body: {
        title: "Symbol map",
        formula: {
          expression: "s²",
          notation: {
            "xᵢ": "Individual observation",
            "x̄": "Sample mean",
            "Σ": "Sum of the specified quantities",
            n: "Number of observations"
          }
        }
      }
    },
    "S2",
    1
  );
  assert.equal(symbolMap.annotations.length, 4);
  assert.equal(symbolMap.annotations[0].label, "xᵢ");
  assert.equal(symbolMap.annotations[0].description, "Individual observation");

  const page = pageWith([
    assembledMeanMaterial(),
    numberLineMaterial(),
    assembledDeviationMaterial(),
    assembledComparisonMaterial()
  ]);
  const rendered = renderLearnerPageHtml(page);
  const html = String(rendered.html || "");
  assertNoSchemaHeadings(html);

  const meanHtml = article(html, "XM-S2-01");
  assert.match(meanHtml, /x̄ = Σxᵢ \/ n/);
  assert.match(meanHtml, /Spoken form/);
  assert.match(meanHtml, /The sample mean equals the sum of the observations/);
  assert.match(meanHtml, /The arithmetic mean of the sample\. \(x-bar\)/);
  assert.match(meanHtml, /Add together all the specified values\. \(sum\)/);
  assert.match(meanHtml, /An individual observation in the dataset\. \(x sub i\)/);
  assert.match(meanHtml, /The number of observations in the sample\./);
  assertNoSchemaHeadings(meanHtml);

  const numberLineHtml = article(html, "XM-S3-01");
  assert.match(numberLineHtml, /data-illustration-status="unfulfilled"/);
  assert.match(numberLineHtml, /10 s, 12 s and 14 s/);
  assert.doesNotMatch(numberLineHtml, /\[object Object\]/);

  const deviationHtml = article(html, "XM-S4-01");
  const equationAt = deviationHtml.indexOf('data-field="equation"');
  const tableAt = deviationHtml.indexOf("<table");
  assert.ok(equationAt !== -1 && tableAt > equationAt);
  assert.match(deviationHtml, /s = √\[Σ\(xᵢ − x̄\)² \/ \(n − 1\)\]/);
  assert.match(deviationHtml, /Sample standard deviation/);
  assert.match(deviationHtml, /Deviation from 12 s/);
  assert.match(deviationHtml, /Squared deviation/);
  assert.match(deviationHtml, /10 s/);
  assert.match(deviationHtml, /10 − 12 = −2 s/);
  assert.match(deviationHtml, /\(−2\)² = 4 s²/);
  assert.match(deviationHtml, /12 − 12 = 0 s/);
  assert.match(deviationHtml, /14 − 12 = \+2 s/);
  assert.match(deviationHtml, /\(\+2\)² = 4 s²/);
  const captionAt = deviationHtml.indexOf("<caption>");
  const captionEnd = deviationHtml.indexOf("</caption>");
  const tableEnd = deviationHtml.indexOf("</table>");
  assert.ok(captionAt > tableAt && captionEnd < tableEnd);
  assert.match(deviationHtml.slice(captionAt, captionEnd), /Sum of squared deviations: 4 s² \+ 0 s² \+ 4 s² = 8 s²/);
  assert.equal((deviationHtml.match(/<table\b/g) || []).length, 1);
  assertNoSchemaHeadings(deviationHtml);

  const comparisonHtml = article(html, "XM-S5-01");
  assert.equal(comparisonHtml.includes('data-material-type="expository_structured_fallback"'), false);
  assert.equal((comparisonHtml.match(/<table\b/g) || []).length, 1);
  ["Statistic", "Practice result", "What does it describe?", "What information does it use?", "What does it not tell us?"].forEach(
    function (heading) {
      assert.ok(comparisonHtml.includes("<th scope=\"col\">" + heading + "</th>"), heading);
    }
  );
  assert.match(comparisonHtml, /Arithmetic mean/);
  assert.match(comparisonHtml, /12 s/);
  assert.match(comparisonHtml, /4 s/);
  assert.match(comparisonHtml, /2 s/);
  assertNoSchemaHeadings(comparisonHtml);
});

test("C2 comparison table is published once without interpretation-support prose", () => {
  const source = assembledComparisonMaterial();
  const bodyBefore = JSON.stringify(source.body);
  const built = buildExpositionStructuredMaterial(source, "S5", 0);
  assert.equal(built.type, "expository_structured_table");
  assert.equal(built.accessibleText, source.body.accessible_text_equivalent);
  assert.equal(JSON.stringify(source.body), bodyBefore);
  assert.equal(built.columns.length, 5);
  assert.equal(built.rows.length, 3);
  assert.equal(built.rows[0][1], "12 s");
  assert.equal(built.rows[1][1], "4 s");
  assert.equal(built.rows[2][1], "2 s");

  const rendered = renderLearnerPageHtml(pageWith([source]));
  const html = String(rendered.html || "");
  const comparison = article(html, "XM-S5-01");
  assert.equal((comparison.match(/<table\b/g) || []).length, 1);
  [
    "Statistic",
    "Practice result",
    "What does it describe?",
    "What information does it use?",
    "What does it not tell us?"
  ].forEach(function (heading) {
    assert.ok(comparison.includes('<th scope="col">' + heading + "</th>"), heading);
  });
  assert.match(comparison, /Arithmetic mean/);
  assert.match(comparison, /guarantee limits for future observations/);
  assert.match(comparison, /does not establish measurement accuracy/);
  assert.equal(comparison.includes("Introductory text"), false);
  assert.equal(comparison.includes("Integrated interpretation"), false);
  assert.equal(comparison.includes("Interpretive boundary"), false);
  assert.equal(comparison.includes("Accessible text equivalent"), false);
  assert.equal(
    comparison.includes("Reading them together gives a description of both centre and spread."),
    false
  );
  assert.equal(
    comparison.includes("None of the three statistics alone provides a complete scientific explanation."),
    false
  );
  assert.equal(comparison.includes("distribution of intermediate values"), false);
  assert.equal(comparison.includes("soluble-tablet investigation"), false);
  assert.equal(comparison.includes('data-field="accessible-description"'), false);
});

test("table companion prose that is not interpretation support still renders", () => {
  const source = {
    material_id: "XM-NOTE-01",
    section_id: "S5",
    kind: "comparison table",
    body: {
      title: "Practice units",
      note: "Record each result with its unit.",
      introductory_text: "This lead-in restates the table and should not be published.",
      table: {
        columns: [
          { key: "statistic", heading: "Statistic" },
          { key: "result", heading: "Result" }
        ],
        rows: [{ statistic: "Range", result: "4 s" }]
      }
    }
  };
  const html = renderExpositionStructuredMaterial(
    buildExpositionStructuredMaterial(source, "S5", 0)
  );
  assert.match(html, /<th scope="col">Statistic<\/th>/);
  assert.match(html, /Record each result with its unit\./);
  assert.equal(html.includes("Introductory text"), false);
  assert.equal(html.includes("This lead-in restates the table"), false);
});

test("an accessible equivalent that does not restate the table rows stays available", () => {
  const source = {
    material_id: "XM-ALT-01",
    section_id: "S5",
    kind: "comparison table",
    body: {
      title: "Practice boundary",
      accessible_text_equivalent:
        "These three results belong only to the practice set, not to either temperature condition.",
      table: {
        columns: [
          { key: "statistic", heading: "Statistic" },
          { key: "result", heading: "Result" }
        ],
        rows: [
          { statistic: "Arithmetic mean", result: "12 s" },
          { statistic: "Range", result: "4 s" }
        ]
      }
    }
  };
  const built = buildExpositionStructuredMaterial(source, "S5", 0);
  assert.equal(built.accessibleText, source.body.accessible_text_equivalent);
  const html = renderExpositionStructuredMaterial(built);
  assert.match(html, /data-field="accessible-description"/);
  assert.match(html, /practice set, not to either temperature condition/);
  assert.match(html, /<th scope="col">Result<\/th>/);
});

test("column-definition arrays are not published as learner tables", () => {
  const definitions = [
    { key: "statistic", heading: "Statistic" },
    { key: "practice_result", heading: "Practice result" },
    { key: "limitation", heading: "What does it not tell us?" }
  ];
  assert.equal(renderStructuredValue(definitions, 0), "");

  const built = buildExpositionStructuredMaterial(
    {
      material_id: "XM-SCHEMA-01",
      section_id: "S9",
      kind: "column notes",
      body: {
        title: "Hidden column schema",
        column_definitions: definitions
      }
    },
    "S9",
    0
  );
  assert.equal(built.type, "expository_structured_fallback");
  const html = renderExpositionStructuredMaterial(built);
  assertNoSchemaHeadings(html);
  assert.equal(html.includes("<table"), false);
});

function numberLineAsset(dataUrl) {
  return {
    brief_id: XM_NUMBER_LINE_BRIEF_ID,
    affordance_id: XM_NUMBER_LINE_AFFORDANCE_ID,
    scope: "section",
    section_id: "S3",
    activity_id: "",
    visual_slot: "section-after-content",
    mime_type: "image/png",
    alt_text: "Number line with observations at 10 s, 12 s and 14 s.",
    subject: "Reaction-time range on a number line",
    render_source: { kind: "data_url", value: dataUrl }
  };
}

function editorialOpeningAsset(dataUrl) {
  return {
    brief_id: "brief-editorial-opening",
    affordance_id: "va-editorial-opening",
    scope: "editorial",
    activity_id: "",
    visual_slot: "editorial-opening",
    mime_type: "image/png",
    alt_text: "Illustration of a soluble tablet dissolving in water beside a stopwatch.",
    subject: "Understanding Descriptive Statistics",
    render_source: { kind: "data_url", value: dataUrl }
  };
}

function unpreparedC2Page() {
  return pageWith([
    assembledMeanMaterial(),
    numberLineMaterial(),
    assembledDeviationMaterial(),
    assembledComparisonMaterial()
  ]);
}

test("attached XM number-line survives into learner HTML and the exported package", () => {
  const source = unpreparedC2Page();
  assert.equal(source.visual_affordances.length, 0);
  const affordancesBefore = JSON.stringify(source.visual_affordances);

  const rendered = renderLearnerPageHtml(source, {
    compositionMode: "moments",
    visualAssets: { assets: [numberLineAsset(NUMBER_LINE_PNG_DATA_URL)] }
  });
  assert.equal(rendered.error, null);
  assert.equal(JSON.stringify(source.visual_affordances), affordancesBefore);

  const html = String(rendered.html || "");
  const numberLine = article(html, "XM-S3-01");
  const s3 = rendered.modelResult.model.expositionSections.find(function (section) {
    return section.id === "S3";
  });
  assert.equal(s3.visualAffordanceAfterContent.affordanceId, XM_NUMBER_LINE_AFFORDANCE_ID);
  assert.equal(s3.visualAffordanceAfterContent.slot, "section-after-content");
  const sectionStart = html.indexOf('id="exposition-S3"');
  const sectionHtml = html.slice(sectionStart, html.indexOf("</section>", sectionStart));
  assert.match(sectionHtml, /data-visual-slot="section-after-content"/);
  assert.match(sectionHtml, /<img /);
  assert.match(numberLine, /data-representation-spec-suppressed="section-figure"/);
  assert.doesNotMatch(html, /The commissioned illustration is not yet available/);
  assert.doesNotMatch(html, /data-illustration-status="unfulfilled"/);
  assert.match(html, /10 s, 12 s and 14 s/);
  assert.match(html, /x̄ = Σxᵢ \/ n/);
  assert.match(html, /The arithmetic mean of the sample/);
  assert.match(html, /Deviation from 12 s/);
  assert.match(html, /What does it describe\?/);
  assert.doesNotMatch(html, /\[object Object\]/);
  assertNoSchemaHeadings(html);
  assert.equal((html.match(/data-visual-slot="section-after-content"/g) || []).length, 1);

  const built = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: { assets: [numberLineAsset(NUMBER_LINE_PNG_DATA_URL)] },
    title: "Understanding Descriptive Statistics"
  });
  assert.equal(built.ok, true, JSON.stringify(built.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  assert.ok(entries["learner-page.html"]);
  assert.ok(entries["assets/section-after-content.png"]);
  const packagedHtml = fflate.strFromU8(entries["learner-page.html"]);
  assert.match(packagedHtml, /src="assets\/section-after-content\.png"/);
  assert.doesNotMatch(packagedHtml, /The commissioned illustration is not yet available/);
  assert.doesNotMatch(packagedHtml, /data:image\/png;base64/);
  assert.deepEqual(
    Array.from(entries["assets/section-after-content.png"]),
    Array.from(NUMBER_LINE_PNG_BYTES)
  );
});

test("unattached XM number-line keeps the accessible alternative", () => {
  const rendered = renderLearnerPageHtml(unpreparedC2Page(), {
    compositionMode: "moments",
    visualAssets: { assets: [] }
  });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  const numberLine = article(html, "XM-S3-01");
  assert.match(numberLine, /data-illustration-status="unfulfilled"/);
  assert.match(numberLine, /The commissioned illustration is not yet available/);
  assert.match(numberLine, /10 s, 12 s and 14 s/);
  assert.equal(html.includes("util-visual-asset--section-after-content"), false);
});

test("XM illustration preparation is idempotent", () => {
  const source = unpreparedC2Page();
  const first = handoff.preparePageForXmIllustrationJobs(source);
  const second = handoff.preparePageForXmIllustrationJobs(first);
  assert.equal(source.visual_affordances.length, 0);
  assert.equal(
    first.visual_affordances.filter(function (row) {
      return row && row.affordance_id === XM_NUMBER_LINE_AFFORDANCE_ID;
    }).length,
    1
  );
  assert.equal(
    second.visual_affordances.filter(function (row) {
      return row && row.affordance_id === XM_NUMBER_LINE_AFFORDANCE_ID;
    }).length,
    1
  );
  assert.equal(first.visual_affordances.length, second.visual_affordances.length);

  const rendered = renderLearnerPageHtml(second, {
    compositionMode: "moments",
    visualAssets: { assets: [numberLineAsset(NUMBER_LINE_PNG_DATA_URL)] }
  });
  const html = String(rendered.html || "");
  assert.equal((html.match(/data-visual-slot="section-after-content"/g) || []).length, 1);
  assert.doesNotMatch(html, /The commissioned illustration is not yet available/);
});

test("editorial opening still renders beside an attached XM number line", () => {
  const rendered = renderLearnerPageHtml(unpreparedC2Page(), {
    compositionMode: "moments",
    visualAssets: {
      assets: [
        editorialOpeningAsset(EDITORIAL_PNG_DATA_URL),
        numberLineAsset(NUMBER_LINE_PNG_DATA_URL)
      ]
    }
  });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /data-region="editorial-opening"/);
  assert.match(html, /data-affordance-id="va-editorial-opening"/);
  assert.match(html, /data-visual-slot="editorial-opening"/);
  assert.match(html, /data-visual-slot="section-after-content"/);
  assert.match(html, /soluble tablet dissolving in water/);
  assert.doesNotMatch(html, /The commissioned illustration is not yet available/);

  const built = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: {
      assets: [
        editorialOpeningAsset(EDITORIAL_PNG_DATA_URL),
        numberLineAsset(NUMBER_LINE_PNG_DATA_URL)
      ]
    }
  });
  assert.equal(built.ok, true, JSON.stringify(built.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  const packagedHtml = fflate.strFromU8(entries["learner-page.html"]);
  assert.match(packagedHtml, /src="assets\/editorial-opening\.png"/);
  assert.match(packagedHtml, /src="assets\/section-after-content\.png"/);
  assert.ok(entries["assets/editorial-opening.png"]);
  assert.ok(entries["assets/section-after-content.png"]);
});

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const repoRoot = path.resolve(__dirname, "..");
  const source = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
      "lib/expository-sibling-prompts.js",
      "lib/expository-contracts.js",
      "lib/expository-xm-illustration-handoff.js",
      "lib/first-class-workflow-family.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

test("Design Page capture validation rejects defer that suppresses unrealised number-line graphic", () => {
  const api = loadPrismTestApi();
  assert.ok(typeof api.validateDesignPagePartialPageCapture === "function");

  const capture = pageWith([numberLineMaterial()], [
    {
      affordance_id: "va-S3-defer-01",
      scope: "section",
      section_id: "S3",
      visual_decision: "defer",
      defer_reason: "worked_example_sufficient_first",
      subject: "Number line already in materials",
      context: "Visual brief: defer incorrectly.",
      evidence_anchors: ["S3.materials.XM-S3-01"],
      rationale: "Structured material is not a realised graphic."
    }
  ]);
  const wf = {
    id: "wf-c2-expo",
    name: "Create an Expository Resource: Descriptive Statistics",
    product: "expository",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY
  };
  const check = api.validateDesignPagePartialPageCapture(capture, wf);
  assert.equal(check.ok, false, JSON.stringify(check.errors || []));
  assert.ok(
    (check.errors || []).some(function (err) {
      return /must not suppress unrealised commissioned graphic XM-S3-01/i.test(String(err));
    }),
    JSON.stringify(check.errors || [])
  );
});
