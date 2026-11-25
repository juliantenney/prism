"use strict";

var assert = require("assert");
var path = require("path");

var practiceContracts = require(path.join(__dirname, "..", "lib", "ld-practice-presentation-contracts.js"));
var gamEnrich = require(path.join(__dirname, "..", "lib", "page-gam-enrich.js"));
var assembler = require(path.join(__dirname, "..", "lib", "page-vnext-assemble.js"));
var renderer = require(path.join(__dirname, "..", "lib", "learner-renderer-vnext", "index.js"));

var TEMP_OBSERVATIONS = [
  { label: "Month 1", x: 0, y: 180 },
  { label: "Month 2", x: 5, y: 145 },
  { label: "Month 3", x: 10, y: 120 },
  { label: "Month 4", x: 15, y: 105 },
  { label: "Month 5", x: 20, y: 100 },
  { label: "Month 6", x: 25, y: 105 },
  { label: "Month 7", x: 30, y: 120 },
  { label: "Month 8", x: 35, y: 145 },
  { label: "Month 9", x: 40, y: 180 }
];

var RETAILER_OBSERVATIONS = [
  { label: "R1", x: 1, y: 18 },
  { label: "R2", x: 2, y: 21 },
  { label: "R3", x: 3, y: 25 },
  { label: "R4", x: 4, y: 27 },
  { label: "R5", x: 5, y: 32 },
  { label: "R6", x: 6, y: 35 },
  { label: "R7", x: 7, y: 38 },
  { label: "R8", x: 8, y: 42 },
  { label: "R9", x: 9, y: 45 },
  { label: "R10", x: 10, y: 15 }
];

function buildDlaBaselinePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Interpreting contrasting statistical relationships",
    assembly_state: {
      current_stage: "dla",
      enriched_by: ["episode_plan", "dla"]
    },
    activities: [
      {
        activity_id: "A1",
        title: "Interpret two bivariate datasets",
        activity_type: "practice_task",
        learner_task: "Examine both datasets and interpret each relationship.",
        expected_output: "Two concise evidence-grounded interpretations.",
        episode_plan: {
          archetype: "analyse",
          beats: [
            { function: "explanation" },
            { function: "guided_inquiry" },
            { function: "verification" }
          ]
        },
        required_materials: [
          { material_id: "A1-M1", material_type: "data_table", title: "Temperature and household energy expenditure" },
          { material_id: "A1-M2", material_type: "template", title: "Interpret temperature and energy expenditure" },
          { material_id: "A1-M3", material_type: "data_table", title: "Advertising expenditure and sales revenue" },
          { material_id: "A1-M4", material_type: "template", title: "Interpret advertising and sales" }
        ],
        materials: []
      }
    ]
  };
}

function buildStructuredC02GamPartial() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: {
      current_stage: "gam",
      enriched_by: ["gam"]
    },
    activities: [
      {
        activity_id: "A1",
        materials: [
          {
            material_id: "A1-M1",
            material_type: "data_table",
            activity_id: "A1",
            title: "Temperature and household energy expenditure",
            body_format: "markdown",
            body: [
              "Nine fictional monthly observations. Each pair represents average outdoor temperature in degrees Celsius and monthly household energy expenditure in pounds sterling.",
              "",
              "### Observed values",
              "",
              "| Average outdoor temperature (°C) | Monthly household energy expenditure (£) |",
              "| ---: | ---: |",
              "| 0 | 180 |",
              "| 5 | 145 |",
              "| 10 | 120 |",
              "| 15 | 105 |",
              "| 20 | 100 |",
              "| 25 | 105 |",
              "| 30 | 120 |",
              "| 35 | 145 |",
              "| 40 | 180 |",
              "",
              "Pearson correlation coefficient: \\(r = 0.00\\).",
              "",
              "Source: Shared Synthetic Economic Evidence Corpus — Dataset C."
            ].join("\n"),
            scatterplot: {
              title: "Average outdoor temperature and monthly household energy expenditure",
              x_axis: {
                label: "Average outdoor temperature",
                unit: "°C",
                scale: "linear",
                minimum: 0,
                maximum: 40,
                tick_interval: 5
              },
              y_axis: {
                label: "Monthly household energy expenditure",
                unit: "£",
                scale: "linear",
                minimum: 0,
                maximum: 200,
                tick_interval: 40
              },
              observations: TEMP_OBSERVATIONS,
              caption: "Nine fictional monthly observations of temperature and household energy expenditure.",
              accessible_description:
                "Scatterplot of nine monthly observations. All plotted values are provided in the accompanying data table."
            }
          },
          {
            material_id: "A1-M2",
            material_type: "template",
            activity_id: "A1",
            title: "Interpret temperature and energy expenditure",
            body_format: "markdown",
            body: "**Temperature and energy expenditure interpretation:**\n\nDescribe how monthly household energy expenditure varies across the observed temperature range."
          },
          {
            material_id: "A1-M3",
            material_type: "data_table",
            activity_id: "A1",
            title: "Advertising expenditure and sales revenue",
            body_format: "markdown",
            body: [
              "Ten fictional small retailers in the same broad retail sector, observed during the same month.",
              "",
              "### Observed values",
              "",
              "| Retailer | Monthly advertising expenditure (£ thousands) | Monthly sales revenue (£ thousands) |",
              "| --- | ---: | ---: |",
              "| R1 | 1 | 18 |",
              "| R2 | 2 | 21 |",
              "| R3 | 3 | 25 |",
              "| R4 | 4 | 27 |",
              "| R5 | 5 | 32 |",
              "| R6 | 6 | 35 |",
              "| R7 | 7 | 38 |",
              "| R8 | 8 | 42 |",
              "| R9 | 9 | 45 |",
              "| R10 | 10 | 15 |",
              "",
              "Pearson correlation coefficient for all ten retailers: \\(r = 0.47\\).",
              "",
              "Source: Shared Synthetic Economic Evidence Corpus — Dataset D."
            ].join("\n"),
            scatterplot: {
              title: "Monthly advertising expenditure and monthly sales revenue",
              x_axis: {
                label: "Monthly advertising expenditure (£ thousands)",
                scale: "linear",
                minimum: 0,
                maximum: 10,
                tick_interval: 1
              },
              y_axis: {
                label: "Monthly sales revenue (£ thousands)",
                scale: "linear",
                minimum: 0,
                maximum: 50,
                tick_interval: 10
              },
              show_point_labels: true,
              observations: RETAILER_OBSERVATIONS,
              caption: "Ten fictional small retailers observed during the same month.",
              accessible_description:
                "Scatterplot of ten retailer observations labelled R1 to R10. All plotted values and retailer identifiers are provided in the accompanying data table."
            }
          },
          {
            material_id: "A1-M4",
            material_type: "template",
            activity_id: "A1",
            title: "Interpret advertising and sales",
            body_format: "markdown",
            body: "**Advertising and sales interpretation:**\n\nWrite one coherent paragraph interpreting the relationship between advertising expenditure and sales revenue across the ten retailers."
          }
        ]
      }
    ]
  };
}

function runTests() {
  var passed = 0;
  function test(name, fn) {
    fn();
    passed += 1;
    console.log("PASS:", name);
  }

  test("1. Practice GAM contract documents structured scatterplot spec and forbids raw SVG in Markdown", function () {
    var gamText = practiceContracts.buildPracticePresentationContractBlock("gam");
    assert.ok(gamText.indexOf("scatterplot") !== -1, "GAM contract must document structured scatterplot");
    assert.ok(gamText.indexOf("GAM-SVG-01") !== -1, "GAM contract must cite GAM-SVG-01 raw SVG prohibition");
    assert.ok(gamText.indexOf("show_point_labels") !== -1, "GAM contract must document show_point_labels");
    assert.ok(gamText.indexOf("external image generation") !== -1, "GAM contract must exclude external image generation for deterministic graphics");
  });

  test("2. GAM capture validation rejects raw <svg> embedded in Markdown body (GAM-SVG-01)", function () {
    var badGam = buildStructuredC02GamPartial();
    delete badGam.activities[0].materials[0].scatterplot;
    badGam.activities[0].materials[0].body +=
      '\n\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 360"><circle cx="80" cy="55" r="5.5"/></svg>';
    var res = gamEnrich.validateGamPartialPageCapture(badGam);
    assert.strictEqual(res.ok, false, "Raw <svg> in Markdown must fail GAM capture");
    assert.ok(
      res.errors.some(function (e) { return e.indexOf("GAM-SVG-01") !== -1; }),
      "Expected GAM-SVG-01 error, got: " + JSON.stringify(res.errors)
    );
  });

  test("3. GAM capture validation rejects malformed structured scatterplot specs (GAM-SCATTER-01)", function () {
    var badGam = buildStructuredC02GamPartial();
    badGam.activities[0].materials[0].scatterplot = {
      x_axis: { label: "" },
      y_axis: { label: "Y" },
      observations: [{ x: 1, y: 2 }]
    };
    var res = gamEnrich.validateGamPartialPageCapture(badGam);
    assert.strictEqual(res.ok, false, "Invalid scatterplot spec must fail GAM capture");
    assert.ok(
      res.errors.some(function (e) { return e.indexOf("GAM-SCATTER-01") !== -1; }),
      "Expected GAM-SCATTER-01 error, got: " + JSON.stringify(res.errors)
    );
  });

  test("4. Structured C02 GAM passes capture, survives partial assembly, and renders both scatterplots accurately", function () {
    var gamPartial = buildStructuredC02GamPartial();
    var gamCheck = gamEnrich.validateGamPartialPageCapture(gamPartial);
    assert.strictEqual(gamCheck.ok, true, "Structured C02 GAM must pass capture: " + JSON.stringify(gamCheck.errors));

    var assembled = assembler.assembleVNextPageFromPartials({ episode_plan: buildDlaBaselinePage(), dla: buildDlaBaselinePage(), gam: gamPartial }).page;
    var assembledM1 = assembled.activities[0].materials[0];
    var assembledM3 = assembled.activities[0].materials[2];
    assert.strictEqual(assembledM1.scatterplot.observations.length, 9, "A1-M1 must preserve 9 observations after assembly");
    assert.strictEqual(assembledM3.scatterplot.observations.length, 10, "A1-M3 must preserve 10 observations after assembly");
    assert.strictEqual(assembledM3.scatterplot.show_point_labels, true, "A1-M3 must preserve show_point_labels after assembly");

    var rendered = renderer.renderLearnerPageHtml(assembled);
    assert.strictEqual(rendered.error, null, "renderLearnerPageHtml must succeed: " + rendered.error);
    var html = rendered.html;

    // Never expose raw escaped SVG markup as text
    assert.strictEqual(html.indexOf("&lt;svg"), -1, "Published HTML must not expose escaped <svg> text");

    // Exactly two inline deterministic scatterplot SVGs
    var svgMatches = html.match(/<svg\b[^>]*class="util-scatterplot-svg"[\s\S]*?<\/svg>/g) || [];
    assert.strictEqual(svgMatches.length, 2, "Expected exactly 2 inline scatterplot SVGs");

    var m1Svg = svgMatches[0];
    var m3Svg = svgMatches[1];

    // Verify A1-M1: 9 exact temperature observations, axis labels with units, neutral desc, no fitted line or highlighting
    var m1Circles = m1Svg.match(/<circle\b[^>]*class="util-scatterplot-point"[^>]*>/g) || [];
    assert.strictEqual(m1Circles.length, 9, "A1-M1 must plot exactly 9 temperature observations");
    TEMP_OBSERVATIONS.forEach(function (pt) {
      assert.ok(
        m1Svg.indexOf('data-x="' + pt.x + '" data-y="' + pt.y + '"') !== -1,
        "A1-M1 must plot exact point (" + pt.x + ", " + pt.y + ")"
      );
    });
    assert.ok(m1Svg.indexOf("Average outdoor temperature (°C)") !== -1, "A1-M1 must include x-axis variable and unit");
    assert.ok(m1Svg.indexOf("Monthly household energy expenditure (£)") !== -1, "A1-M1 must include y-axis variable and unit");
    assert.ok(m1Svg.indexOf("Scatterplot of nine monthly observations.") !== -1, "A1-M1 must preserve neutral <desc>");
    assert.strictEqual(m1Svg.indexOf("<path"), -1, "A1-M1 must have no fitted line or curve path");
    assert.strictEqual(m1Svg.indexOf("<polyline"), -1, "A1-M1 must have no connecting polyline");
    assert.strictEqual((m1Svg.match(/fill="#1f4e79"/g) || []).length, 9, "All 9 A1-M1 points must share uniform neutral styling");

    // Verify A1-M3: 10 exact retailer observations R1-R10, visible neutral labels, no fitted line or outlier highlighting
    var m3Circles = m3Svg.match(/<circle\b[^>]*class="util-scatterplot-point"[^>]*>/g) || [];
    assert.strictEqual(m3Circles.length, 10, "A1-M3 must plot exactly 10 retailer observations");
    RETAILER_OBSERVATIONS.forEach(function (pt) {
      assert.ok(
        m3Svg.indexOf('data-point-label="' + pt.label + '" data-x="' + pt.x + '" data-y="' + pt.y + '"') !== -1,
        "A1-M3 must plot exact retailer " + pt.label + " (" + pt.x + ", " + pt.y + ")"
      );
      assert.ok(
        m3Svg.indexOf(">" + pt.label + "</text>") !== -1,
        "A1-M3 must render visible retailer identifier " + pt.label
      );
    });
    assert.ok(m3Svg.indexOf("Monthly advertising expenditure (£ thousands)") !== -1, "A1-M3 must include x-axis variable and unit");
    assert.ok(m3Svg.indexOf("Monthly sales revenue (£ thousands)") !== -1, "A1-M3 must include y-axis variable and unit");
    assert.ok(m3Svg.indexOf("Scatterplot of ten retailer observations labelled R1 to R10.") !== -1, "A1-M3 must preserve neutral <desc>");
    assert.strictEqual(m3Svg.indexOf("<path"), -1, "A1-M3 must have no fitted line path");
    assert.strictEqual(m3Svg.indexOf("<polyline"), -1, "A1-M3 must have no connecting polyline");
    assert.strictEqual((m3Svg.match(/fill="#1f4e79"/g) || []).length, 10, "All 10 A1-M3 points (including R10) must share uniform neutral styling");

    // Accessible data tables preserved alongside scatterplots
    assert.ok(html.indexOf("<td>180</td>") !== -1, "A1-M1 accessible data table must be preserved");
    assert.ok(html.indexOf("<td>R10</td>") !== -1, "A1-M3 accessible data table must preserve R10");
  });

  test("5. Body-format JSON structured scatterplot renders cleanly without dumping raw JSON", function () {
    var gamPartial = buildStructuredC02GamPartial();
    gamPartial.activities[0].materials[0] = {
      material_id: "A1-M1",
      material_type: "data_table",
      activity_id: "A1",
      title: "Temperature and household energy expenditure",
      body_format: "json",
      body: {
        title: "Temperature and household energy expenditure",
        introduction: "Nine fictional monthly observations.",
        scatterplot: {
          title: "Average outdoor temperature and monthly household energy expenditure",
          x_axis: { label: "Average outdoor temperature (°C)", minimum: 0, maximum: 40, tick_interval: 5 },
          y_axis: { label: "Monthly household energy expenditure (£)", minimum: 0, maximum: 200, tick_interval: 40 },
          observations: TEMP_OBSERVATIONS,
          accessible_description: "Scatterplot of nine monthly observations."
        },
        table: {
          caption: "Observed values",
          columns: ["Average outdoor temperature (°C)", "Monthly household energy expenditure (£)"],
          rows: TEMP_OBSERVATIONS.map(function (pt) { return [pt.x, pt.y]; })
        },
        source_note: "Source: Shared Synthetic Economic Evidence Corpus — Dataset C."
      }
    };
    var gamCheck = gamEnrich.validateGamPartialPageCapture(gamPartial);
    assert.strictEqual(gamCheck.ok, true, "JSON-body structured scatterplot must pass GAM capture: " + JSON.stringify(gamCheck.errors));

    var assembled = assembler.assembleVNextPageFromPartials({ episode_plan: buildDlaBaselinePage(), dla: buildDlaBaselinePage(), gam: gamPartial }).page;
    var html = renderer.renderLearnerPageHtml(assembled).html;
    assert.strictEqual(html.indexOf("&quot;observations&quot;"), -1, "Must not dump raw JSON body into HTML");
    assert.ok(html.indexOf('class="util-scatterplot-svg"') !== -1, "JSON-body scatterplot must render SVG");
    assert.ok(html.indexOf("Observed values") !== -1, "JSON-body table caption must render");
  });

  test("6. Plain Markdown data_table without structured scatterplot does not heuristically synthesize an SVG", function () {
    var gamPartial = buildStructuredC02GamPartial();
    delete gamPartial.activities[0].materials[0].scatterplot;
    delete gamPartial.activities[0].materials[2].scatterplot;
    var assembled = assembler.assembleVNextPageFromPartials({ episode_plan: buildDlaBaselinePage(), dla: buildDlaBaselinePage(), gam: gamPartial }).page;
    var html = renderer.renderLearnerPageHtml(assembled).html;
    assert.strictEqual(html.indexOf("util-scatterplot-svg"), -1, "Must not heuristically extract scatterplots from Markdown tables");
    assert.ok(html.indexOf("<td>180</td>") !== -1, "Markdown data table still renders cleanly");
  });

  console.log("ALL PASSED (" + passed + " tests)");
}

runTests();
