/**
 * Sprint 105 — Complete 6-section Economics C1 ("Reading relationships in economic data")
 * end-to-end regression fixture & verification:
 * - S1: Opening expectation framing (prose)
 * - S2 (M01): Top-level scatterplot (Dataset A, A1–A10) + accessible_table + point labels + alternative_text
 * - S3 (M02 + Figure 1): Pearson correlation scale with attached image & construction-prose suppression
 * - S4 (M03): Multi-part comparative material with nested initial_evidence.scatterplot (Dataset B, B1–B10),
 *             accessible_table, successive expenditure changes, r = -0.94 reveal, and comparison tables
 * - S5 (M04): Multi-part comparative material with nested initial_evidence.scatterplot (I1–I6),
 *             accessible_table, successive-differences & relative-position comparison, and r = 0.49 table
 * - S6 (M05): Comparative statistical interpretation table + terminal synthesis
 *
 * Verifies preview HTML and ZIP export parity across all 6 sections.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const handoff = require("../lib/expository-xm-illustration-handoff.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");

const TINY_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);
const TINY_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(TINY_PNG_BYTES).toString("base64");

const C1_CONSTRUCTION_SPEC =
  "Construct a clean horizontal number line with equally spaced reference ticks at -1, -0.5, 0, +0.5 and +1. " +
  "Position zero exactly halfway between the endpoints. Place a diamond marker at the precise position corresponding to 0.93. " +
  "Maintain sufficient spacing, legible typography and strong foreground-background contrast. " +
  "Do not introduce coloured strength bands, additional examples, decorative statistical symbols or arbitrary classification boundaries. " +
  "Preserve the existing textual equivalent from M02.";

function buildCompleteC1EconomicsPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "Reading relationships in economic data",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "What relationship would you expect?",
        exposition:
          "Economists frequently want to understand how two quantities vary together. Consider ten fictional regions measured over the same calendar year.",
        materials: []
      },
      {
        section_id: "S2",
        title: "Reading a scatterplot as economic evidence",
        exposition:
          "A scatterplot displays each region as one point positioned by investment on the horizontal axis and real GVA growth on the vertical axis.",
        materials: [
          {
            material_id: "M01",
            kind: "Scatterplot with accessible paired-observation evidence",
            title: "Regional investment and economic growth",
            body: {
              title: "Regional investment and economic growth",
              context:
                "Each observation represents one of ten fictional regions measured over the same calendar year.",
              scatterplot: {
                dataset_id: "A",
                x_axis: {
                  label: "Investment (% of regional gross value added)",
                  minimum: 10,
                  maximum: 32,
                  tick_interval: 2
                },
                y_axis: {
                  label: "Annual real gross value added growth (%)",
                  minimum: 0,
                  maximum: 5,
                  tick_interval: 1
                },
                observations: [
                  { id: "A1", x: 12, y: 0.8 },
                  { id: "A2", x: 14, y: 1.6 },
                  { id: "A3", x: 16, y: 1.2 },
                  { id: "A4", x: 18, y: 2.4 },
                  { id: "A5", x: 20, y: 1.9 },
                  { id: "A6", x: 22, y: 3.1 },
                  { id: "A7", x: 24, y: 2.6 },
                  { id: "A8", x: 26, y: 3.8 },
                  { id: "A9", x: 28, y: 3.2 },
                  { id: "A10", x: 30, y: 4.4 }
                ],
                point_style: {
                  shape: "circle",
                  contrast: "high",
                  connect_points: false,
                  show_fitted_line: false,
                  show_observation_labels: true
                },
                alternative_text:
                  "Scatterplot of ten fictional regions showing investment (% of regional gross value added) on the horizontal axis and annual real gross value added growth (%) on the vertical axis. All paired values are available in the accompanying data table."
              },
              accessible_table: {
                caption: "Regional investment and economic growth observations, ordered by investment",
                columns: [
                  "Region",
                  "Investment (% of regional gross value added)",
                  "Annual real gross value added growth (%)"
                ],
                rows: [
                  ["A1", 12, 0.8],
                  ["A2", 14, 1.6],
                  ["A3", 16, 1.2],
                  ["A4", 18, 2.4],
                  ["A5", 20, 1.9],
                  ["A6", 22, 3.1],
                  ["A7", 24, 2.6],
                  ["A8", 26, 3.8],
                  ["A9", 28, 3.2],
                  ["A10", 30, 4.4]
                ],
                row_header_column: 0,
                navigation_text:
                  "The rows are ordered from lowest to highest investment. Read across each row for the paired growth rate."
              }
            }
          }
        ]
      },
      {
        section_id: "S3",
        title: "What does Pearson correlation tell us?",
        exposition:
          "Pearson correlation measures the direction and strength of linear association between two quantitative variables. For the ten regional observations, r = 0.93.",
        materials: [
          {
            material_id: "M02",
            kind: "Annotated correlation scale",
            title: "Interpreting the Pearson correlation coefficient",
            body: {
              title: "Interpreting the Pearson correlation coefficient",
              caption:
                "Direction depends on which side of zero the coefficient lies. Linear strength depends on its distance from zero."
            }
          }
        ]
      },
      {
        section_id: "S4",
        title: "A negative relationship can be strong",
        exposition:
          "Consider borrowing costs and household expenditure on durable goods across ten fictional regional credit markets. Their Pearson correlation coefficient is r = -0.94.",
        materials: [
          {
            material_id: "M03",
            kind: "Contrasting economic scatterplots with accessible comparison",
            title: "Comparing two economic relationships",
            body: {
              title: "Comparing two economic relationships",
              initial_evidence: {
                title: "Borrowing costs and household durable-goods expenditure",
                description:
                  "The observations represent ten fictional regional credit markets measured over the same calendar year.",
                scatterplot: {
                  dataset_id: "B",
                  x_axis: {
                    label: "Average annual interest rate on new consumer loans (%)",
                    definition:
                      "Borrowing cost measured as the average annual interest rate on new consumer loans.",
                    minimum: 2,
                    maximum: 13,
                    tick_interval: 1
                  },
                  y_axis: {
                    label: "Annual household durable-goods expenditure (£ per household)",
                    definition:
                      "Annual household spending on durable goods in pounds per household.",
                    minimum: 1500,
                    maximum: 3500,
                    tick_interval: 500
                  },
                  observations: [
                    { id: "B1", x: 3, y: 3400 },
                    { id: "B2", x: 4, y: 3000 },
                    { id: "B3", x: 5, y: 3200 },
                    { id: "B4", x: 6, y: 2700 },
                    { id: "B5", x: 7, y: 2900 },
                    { id: "B6", x: 8, y: 2300 },
                    { id: "B7", x: 9, y: 2500 },
                    { id: "B8", x: 10, y: 2000 },
                    { id: "B9", x: 11, y: 2200 },
                    { id: "B10", x: 12, y: 1700 }
                  ],
                  point_style: {
                    shape: "circle",
                    contrast: "high",
                    connect_points: false,
                    show_fitted_line: false,
                    show_observation_labels: true
                  },
                  alternative_text:
                    "Scatterplot showing average annual interest rates on new consumer loans as percentages on the horizontal axis and annual household durable-goods expenditure in pounds per household on the vertical axis. Each of the ten labelled points represents one fictional regional credit market. All paired values are available in the accompanying data table."
                },
                accessible_table: {
                  caption:
                    "Borrowing costs and household expenditure observations, ordered by borrowing cost",
                  columns: [
                    "Market",
                    "Borrowing cost (%)",
                    "Annual household durable-goods expenditure (£ per household)"
                  ],
                  rows: [
                    ["B1", 3, 3400],
                    ["B2", 4, 3000],
                    ["B3", 5, 3200],
                    ["B4", 6, 2700],
                    ["B5", 7, 2900],
                    ["B6", 8, 2300],
                    ["B7", 9, 2500],
                    ["B8", 10, 2000],
                    ["B9", 11, 2200],
                    ["B10", 12, 1700]
                  ],
                  row_header_column: 0,
                  navigation_text:
                    "The rows are ordered from lowest to highest borrowing cost. Each row gives the borrowing cost and expenditure for the same regional credit market."
                },
                comparing_expenditure_across_borrowing_costs: {
                  title: "Comparing expenditure across borrowing costs",
                  summary:
                    "Borrowing costs increase by one percentage point between successive rows. The corresponding expenditure values are shown below in the same order.",
                  ordered_expenditure_values: {
                    title: "Ordered expenditure values",
                    unit: "£ per household",
                    values: [3400, 3000, 3200, 2700, 2900, 2300, 2500, 2000, 2200, 1700]
                  },
                  successive_expenditure_changes: {
                    title: "Successive expenditure changes",
                    caption: "Differences in expenditure between markets ordered by borrowing cost",
                    columns: [
                      "Markets compared",
                      "Difference in expenditure (£ per household)"
                    ],
                    rows: [
                      ["B1 to B2", -400],
                      ["B2 to B3", 200],
                      ["B3 to B4", -500],
                      ["B4 to B5", 200],
                      ["B5 to B6", -600],
                      ["B6 to B7", 200],
                      ["B7 to B8", -500],
                      ["B8 to B9", 200],
                      ["B9 to B10", -500]
                    ]
                  },
                  qualification:
                    "The differences are between regional credit markets, not changes over time within a market."
                }
              },
              pearson_correlation_reveal: {
                title: "Pearson correlation for borrowing costs and expenditure",
                coefficient: -0.94,
                display: "r = -0.94",
                summary:
                  "Markets with higher borrowing costs generally have lower household durable-goods expenditure. The negative coefficient corresponds to this downward tendency."
              },
              comparing_the_two_coefficients: {
                title: "Comparing the two coefficients",
                datasets: [
                  {
                    title: "Regional investment and economic growth",
                    dataset_id: "A",
                    scatterplot_reference: "M01.body.scatterplot",
                    accessible_table_reference: "M01.body.accessible_table",
                    coefficient: 0.93,
                    coefficient_display: "r = 0.93"
                  },
                  {
                    title: "Borrowing costs and household durable-goods expenditure",
                    dataset_id: "B",
                    scatterplot_reference: "M03.body.initial_evidence.scatterplot",
                    accessible_table_reference: "M03.body.initial_evidence.accessible_table",
                    coefficient: -0.94,
                    coefficient_display: "r = -0.94"
                  }
                ],
                comparison_table: {
                  caption: "Pearson correlation coefficients for the two economic relationships",
                  columns: ["Relationship", "Pearson correlation"],
                  rows: [
                    ["Regional investment and economic growth", 0.93],
                    ["Borrowing costs and household durable-goods expenditure", -0.94]
                  ]
                },
                note:
                  "The plots use different variables and measurement scales. Their slope steepness cannot be compared as a measure of linear strength."
              },
              synthesis: {
                title: "A negative relationship can be strong",
                comparison_table: {
                  caption: "Comparing direction and linear strength",
                  columns: [
                    "Relationship",
                    "Pearson correlation",
                    "Direction",
                    "Absolute magnitude"
                  ],
                  rows: [
                    ["Regional investment and economic growth", 0.93, "Positive", 0.93],
                    [
                      "Borrowing costs and household durable-goods expenditure",
                      -0.94,
                      "Negative",
                      0.94
                    ]
                  ]
                },
                accessible_distribution_comparison:
                  "The regional investment observations follow an upward-sloping, approximately straight-line pattern. The borrowing-cost observations follow a downward-sloping, approximately straight-line pattern.",
                summary:
                  "The signs differ, but the magnitudes are almost identical. Both relationships exhibit strong linear association.",
                qualification: "Neither coefficient establishes a causal relationship."
              }
            }
          }
        ]
      },
      {
        section_id: "S5",
        title: "Recognising a weaker linear association",
        exposition:
          "Consider a supplementary synthetic illustration containing six observations of X and Y (r = 0.49), compared with regional investment (r = 0.93).",
        materials: [
          {
            material_id: "M04",
            kind: "Comparative scatterplot illustration with accessible paired observations",
            title: "Comparing linear associations",
            body: {
              title: "Comparing linear associations",
              initial_evidence: {
                title: "Supplementary synthetic illustration",
                description:
                  "These six paired observations are constructed to illustrate a statistical relationship between two generic quantitative variables. They are separate from the economic datasets.",
                scatterplot: {
                  x_axis: {
                    label: "Variable X (unitless)",
                    minimum: 0,
                    maximum: 7,
                    tick_interval: 1
                  },
                  y_axis: {
                    label: "Variable Y (unitless)",
                    minimum: 0,
                    maximum: 7,
                    tick_interval: 1
                  },
                  observations: [
                    { id: "I1", x: 1, y: 3 },
                    { id: "I2", x: 2, y: 1 },
                    { id: "I3", x: 3, y: 5 },
                    { id: "I4", x: 4, y: 2 },
                    { id: "I5", x: 5, y: 6 },
                    { id: "I6", x: 6, y: 4 }
                  ],
                  point_style: {
                    shape: "circle",
                    contrast: "high",
                    connect_points: false,
                    show_fitted_line: false,
                    show_observation_labels: true
                  },
                  alternative_text:
                    "Scatterplot of six synthetic paired observations. The horizontal axis represents unitless variable X and the vertical axis represents unitless variable Y. Each labelled point represents one paired observation. All values are available in the accompanying data table."
                },
                accessible_table: {
                  caption: "Supplementary synthetic observations, ordered by variable X",
                  columns: ["Observation", "Variable X (unitless)", "Variable Y (unitless)"],
                  rows: [
                    ["I1", 1, 3],
                    ["I2", 2, 1],
                    ["I3", 3, 5],
                    ["I4", 4, 2],
                    ["I5", 5, 6],
                    ["I6", 6, 4]
                  ],
                  row_header_column: 0,
                  navigation_text:
                    "The observations are ordered by increasing X. Read across each row to identify the paired Y value."
                }
              },
              comparison: {
                title: "Regional investment and the supplementary illustration",
                datasets: [
                  {
                    title: "Regional investment and economic growth",
                    dataset_id: "A",
                    scatterplot_reference: "M01.body.scatterplot",
                    accessible_table_reference: "M01.body.accessible_table",
                    coefficient: 0.93,
                    coefficient_display: "r = 0.93"
                  },
                  {
                    title: "Supplementary synthetic illustration",
                    scatterplot_reference: "M04.body.initial_evidence.scatterplot",
                    accessible_table_reference: "M04.body.initial_evidence.accessible_table"
                  }
                ],
                comparing_successive_observations: {
                  title: "Comparing successive observations",
                  summary:
                    "In each dataset, the horizontal-axis values increase by equal amounts between successive observations. The following descriptions give the corresponding vertical-axis values and their successive differences.",
                  series: [
                    {
                      title: "Regional investment and economic growth",
                      horizontal_variable: "Investment (% of regional gross value added)",
                      horizontal_step: "2 percentage points",
                      vertical_variable: "Annual real gross value added growth (%)",
                      ordered_values: [0.8, 1.6, 1.2, 2.4, 1.9, 3.1, 2.6, 3.8, 3.2, 4.4],
                      successive_differences: [0.8, -0.4, 1.2, -0.5, 1.2, -0.5, 1.2, -0.6, 1.2],
                      difference_unit: "percentage points"
                    },
                    {
                      title: "Supplementary synthetic illustration",
                      horizontal_variable: "Variable X (unitless)",
                      horizontal_step: "1 unit",
                      vertical_variable: "Variable Y (unitless)",
                      ordered_values: [3, 1, 5, 2, 6, 4],
                      successive_differences: [-2, 4, -3, 4, -2],
                      difference_unit: "unitless"
                    }
                  ],
                  comparing_the_positions_of_observations_within_each_distribution: {
                    title: "Comparing the positions of observations within each distribution",
                    summary:
                      "The following values describe the vertical position of each observation within its own dataset's observed vertical range. Zero represents the lowest observed value and 100 represents the highest.",
                    series: [
                      {
                        title: "Regional investment and economic growth",
                        observation_ids: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
                        relative_vertical_positions: [0, 22.2, 11.1, 44.4, 30.6, 63.9, 50, 83.3, 66.7, 100]
                      },
                      {
                        title: "Supplementary synthetic illustration",
                        observation_ids: ["I1", "I2", "I3", "I4", "I5", "I6"],
                        relative_vertical_positions: [40, 0, 80, 20, 100, 60]
                      }
                    ],
                    qualification:
                      "These are relative positions within each dataset, not additional observations or correlation coefficients."
                  },
                  comparison_guidance:
                    "Consider how consistently the vertical values progress across the ordered observations."
                },
                summary:
                  "Compare how consistently the observations follow a straight-line pattern, rather than comparing the steepness of the two plots."
              },
              synthesis: {
                title: "Recognising a weaker linear association",
                coefficient_comparison: {
                  caption: "Direction and magnitude of the two positive coefficients",
                  columns: [
                    "Relationship",
                    "Pearson correlation",
                    "Direction",
                    "Absolute magnitude"
                  ],
                  rows: [
                    ["Regional investment and economic growth", 0.93, "Positive", 0.93],
                    ["Supplementary synthetic illustration", 0.49, "Positive", 0.49]
                  ]
                },
                accessible_distribution_comparison:
                  "Both distributions exhibit an overall upward tendency, but the supplementary distribution follows a linear pattern less consistently.",
                summary:
                  "The supplementary coefficient of 0.49 has the same positive sign as 0.93, but a smaller absolute magnitude.",
                qualification:
                  "This is a relative comparison between the supplied distributions, not a universal numerical boundary."
              }
            }
          }
        ]
      },
      {
        section_id: "S6",
        title: "Putting graphical and numerical evidence together",
        exposition:
          "A systematic interpretation brings together the context of the observations, the distribution of paired measurements and the Pearson correlation coefficient.",
        materials: [
          {
            material_id: "M05",
            kind: "Comparative statistical interpretation table",
            title: "Comparing the three relationships",
            body: {
              title: "Comparing the three relationships",
              summary:
                "The three examples separate the direction of a relationship from its linear strength.",
              table: {
                caption: "Graphical and numerical interpretations of the three relationships",
                columns: [
                  "Relationship",
                  "Pearson correlation",
                  "Direction",
                  "Relative linear strength",
                  "Form"
                ],
                rows: [
                  [
                    "Regional investment and economic growth",
                    0.93,
                    "Positive",
                    "Relatively strong",
                    "Approximately linear"
                  ],
                  [
                    "Borrowing costs and household durable-goods expenditure",
                    -0.94,
                    "Negative",
                    "Similarly strong",
                    "Approximately linear"
                  ],
                  [
                    "Supplementary synthetic illustration",
                    0.49,
                    "Positive",
                    "Weaker than the regional investment example",
                    "More dispersed positive linear tendency"
                  ]
                ]
              },
              qualification:
                "Pearson correlation summarises linear association, and none of these coefficients establishes causation."
            }
          }
        ]
      }
    ],
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [
      {
        affordance_id: "va-s3-correlation-scale-01",
        scope: "section",
        section_id: "S3",
        visual_decision: "generate",
        visual_slot: "section-after-content",
        tier: "essential",
        purpose: "data_pattern_reading",
        preferred_representation: "number_line_segments",
        subject: "Pearson correlation scale with regional investment coefficient",
        context: "Visual brief: horizontal correlation scale from -1 to +1 with 0.93 marked.",
        evidence_anchors: ["S3.materials.M02"],
        rationale: "Makes sign and magnitude of Pearson correlation perceptually inspectable.",
        reasoning_supported: "Reading direction and distance from zero on the correlation scale.",
        learner_stage: "post_reasoning",
        anti_spoiler: false,
        representation_avoid: ["generic_infographic"],
        canonical_discipline_note: "Show only -1, -0.5, 0, +0.5, +1 and 0.93.",
        requires_exact_data_match: true,
        must_show: ["-1", "-0.5", "0", "+0.5", "+1", "0.93"],
        must_not_show: ["Coloured strength bands"],
        allowed_claims: ["0.93 indicates a strong positive linear association."],
        disallowed_claims: ["Investment causes growth."],
        source_basis: "S3.materials.M02",
        caption_intent:
          "The sign of Pearson correlation indicates direction; distance from zero indicates linear strength.",
        alt_text:
          "Pearson correlation scale from -1 to +1, with zero at the centre. Linear strength increases towards either endpoint. The regional investment coefficient of 0.93 is marked near +1.",
        detailed_description: C1_CONSTRUCTION_SPEC,
        discipline_risk_level: "high"
      }
    ],
    page_synthesis: {},
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

function attachedS3Asset() {
  return {
    brief_id: "vb-38-4-va-s3-correlation-scale-01-section-s3-section-after-content",
    affordance_id: "va-s3-correlation-scale-01",
    scope: "section",
    section_id: "S3",
    activity_id: "",
    visual_slot: "section-after-content",
    mime_type: "image/png",
    subject: "Pearson correlation scale with regional investment coefficient",
    caption_intent:
      "The sign of Pearson correlation indicates direction; distance from zero indicates linear strength.",
    alt_text:
      "Pearson correlation scale from -1 to +1, with zero at the centre. Linear strength increases towards either endpoint. The regional investment coefficient of 0.93 is marked near +1.",
    detailed_description: C1_CONSTRUCTION_SPEC,
    render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
  };
}

function sectionSlice(html, sectionId) {
  const start = html.indexOf('id="exposition-' + sectionId + '"');
  assert.notEqual(start, -1, "Missing section " + sectionId);
  const next = html.indexOf('<section class="util-exposition-section"', start + 10);
  return next !== -1 ? html.slice(start, next) : html.slice(start);
}

function assertAllSixSectionsValid(html, label) {
  // 1. All 6 sections exist
  ["S1", "S2", "S3", "S4", "S5", "S6"].forEach(function (sid) {
    assert.ok(html.includes('id="exposition-' + sid + '"'), label + ": missing " + sid);
  });

  // 2. S2 (M01): SVG scatterplot + point labels + <desc> + accessible data table
  const s2 = sectionSlice(html, "S2");
  assert.match(s2, /data-scatterplot-figure="true"/, label + " S2 scatterplot figure");
  assert.match(s2, /<svg\b[^>]*role="img"/, label + " S2 SVG");
  assert.match(s2, /data-point-label="A1"[^>]*data-x="12"[^>]*data-y="0\.8"/, label + " S2 A1");
  assert.match(s2, /data-point-label="A10"[^>]*data-x="30"[^>]*data-y="4\.4"/, label + " S2 A10");
  assert.match(s2, /class="util-scatterplot-point-label"[^>]*>A1<\/text>/, label + " S2 point labels");
  assert.match(s2, /<desc\b[^>]*>Scatterplot of ten fictional regions/, label + " S2 SVG desc");
  assert.match(s2, /<table class="util-exposition-structured-table">/, label + " S2 accessible table");
  assert.match(s2, /<th scope="row">A1<\/th>/, label + " S2 table row header");
  assert.match(s2, /The rows are ordered from lowest to highest investment/, label + " S2 nav text");

  // 3. S3 (M02 + Figure 1): attached correlation scale without construction prose
  const s3 = sectionSlice(html, "S3");
  assert.match(s3, /<strong>Figure 1\.<\/strong>/, label + " S3 Figure 1");
  assert.match(s3, /The sign of Pearson correlation indicates direction/, label + " S3 caption");
  assert.match(s3, /Direction depends on which side of zero the coefficient lies/, label + " S3 M02 text");
  assert.doesNotMatch(s3, /Construct a clean horizontal number line/i, label + " S3 no construction prose");
  assert.doesNotMatch(s3, /util-visual-asset-detailed-description/, label + " S3 no leaked detailed desc");

  // 4. S4 (M03): nested scatterplot realised as SVG + semantic tables + staged sequence + zero raw spec chrome
  const s4 = sectionSlice(html, "S4");
  assert.match(s4, /data-scatterplot-figure="true"/, label + " S4 scatterplot figure");
  assert.match(s4, /<svg\b[^>]*role="img"/, label + " S4 SVG");
  assert.match(s4, /data-point-label="B1"[^>]*data-x="3"[^>]*data-y="3400"/, label + " S4 B1");
  assert.match(s4, /data-point-label="B10"[^>]*data-x="12"[^>]*data-y="1700"/, label + " S4 B10");
  assert.match(s4, /class="util-scatterplot-point-label"[^>]*>B1<\/text>/, label + " S4 point labels");
  assert.match(s4, /Average annual interest rate on new consumer loans \(%\)/, label + " S4 X axis");
  assert.match(s4, /Annual household durable-goods expenditure \(£ per household\)/, label + " S4 Y axis");
  assert.match(s4, /<desc\b[^>]*>Scatterplot showing average annual interest rates/, label + " S4 SVG desc");
  assert.match(s4, /<th scope="row">B1<\/th>/, label + " S4 accessible table row header");
  assert.match(s4, /<caption>Comparing direction and linear strength<\/caption>/, label + " S4 comparison table");
  assert.doesNotMatch(s4, /<h4>Scatterplot<\/h4>/i, label + " S4 no raw Scatterplot heading");
  assert.doesNotMatch(s4, /<h4>X axis<\/h4>|<h4>Y axis<\/h4>/i, label + " S4 no raw axis headings");
  assert.doesNotMatch(s4, /<dt>Tick interval<\/dt>|<dt>Minimum<\/dt>|<dt>Maximum<\/dt>/i, label + " S4 no raw axis dl");
  assert.doesNotMatch(s4, /<h4>Point style<\/h4>|Show fitted line|Show observation labels/i, label + " S4 no point style dump");
  assert.doesNotMatch(s4, /Dataset id|Row header column|Scatterplot reference|Accessible table reference/i, label + " S4 no schema mechanics");
  assert.doesNotMatch(s4, /M01\.body\.scatterplot|M03\.body\.initial_evidence\.scatterplot/i, label + " S4 no internal paths");
  assert.doesNotMatch(s4, /<ul>\s*<li>\s*<ul>/i, label + " S4 no nested-list table fallback");
  // S4 structured-comparison semantic cleanliness (no schema-derived labels or duplicate manifest table)
  assert.match(s4, /class="util-exposition-value-sequence">3400, 3000, 3200, 2700, 2900, 2300, 2500, 2000, 2200, 1700 \(£ per household\)<\/p>/, label + " S4 compact value sequence");
  assert.match(s4, /class="util-exposition-metric"><strong>r = -0\.94<\/strong><\/p>/, label + " S4 formatted metric");
  assert.match(s4, /<caption>Pearson correlation coefficients for the two economic relationships<\/caption>/, label + " S4 comparison table preserved");
  assert.doesNotMatch(s4, /<th[^>]*>Title<\/th>|<th[^>]*>Coefficient display<\/th>/i, label + " S4 no duplicate cross-ref manifest table");
  assert.doesNotMatch(s4, /<dt>Coefficient<\/dt>|<dt>Display<\/dt>/i, label + " S4 no raw metric dl");
  assert.doesNotMatch(s4, /<strong>Unit<\/strong>|<h4>Values<\/h4>/i, label + " S4 no raw Unit/Values labels");
  assert.doesNotMatch(s4, /<strong>Accessible distribution comparison<\/strong>|<strong>Qualification<\/strong>/i, label + " S4 no schema prose labels");
  // Staged instructional order preserved: scatterplot -> r = -0.94 reveal -> comparison -> synthesis
  const s4PlotPos = s4.indexOf('data-scatterplot-figure="true"');
  const s4RevealPos = s4.indexOf("Pearson correlation for borrowing costs and expenditure");
  const s4ComparePos = s4.indexOf("Comparing the two coefficients");
  const s4SynthPos = s4.indexOf("Comparing direction and linear strength");
  assert.ok(
    s4PlotPos > 0 && s4RevealPos > s4PlotPos && s4ComparePos > s4RevealPos && s4SynthPos > s4ComparePos,
    label + " S4 staged instructional order preserved"
  );

  // 5. S5 (M04): nested scatterplot realised as SVG + semantic tables + staged sequence + zero raw spec chrome
  const s5 = sectionSlice(html, "S5");
  assert.match(s5, /data-scatterplot-figure="true"/, label + " S5 scatterplot figure");
  assert.match(s5, /<svg\b[^>]*role="img"/, label + " S5 SVG");
  assert.match(s5, /data-point-label="I1"[^>]*data-x="1"[^>]*data-y="3"/, label + " S5 I1");
  assert.match(s5, /data-point-label="I6"[^>]*data-x="6"[^>]*data-y="4"/, label + " S5 I6");
  assert.match(s5, /class="util-scatterplot-point-label"[^>]*>I1<\/text>/, label + " S5 point labels");
  assert.match(s5, /Variable X \(unitless\)/, label + " S5 X axis");
  assert.match(s5, /Variable Y \(unitless\)/, label + " S5 Y axis");
  assert.match(s5, /<desc\b[^>]*>Scatterplot of six synthetic paired observations/, label + " S5 SVG desc");
  assert.match(s5, /<th scope="row">I1<\/th>/, label + " S5 accessible table row header");
  assert.match(s5, /<caption>Direction and magnitude of the two positive coefficients<\/caption>/, label + " S5 comparison table");
  assert.doesNotMatch(s5, /<h4>Scatterplot<\/h4>|<h4>X axis<\/h4>|<h4>Y axis<\/h4>|<h4>Point style<\/h4>/i, label + " S5 no raw spec dump");
  assert.doesNotMatch(s5, /Dataset id|Row header column|Scatterplot reference|Accessible table reference/i, label + " S5 no schema mechanics");
  assert.doesNotMatch(s5, /M01\.body\.scatterplot|M04\.body\.initial_evidence\.scatterplot/i, label + " S5 no internal paths");
  assert.doesNotMatch(s5, /<ul>\s*<li>\s*<ul>/i, label + " S5 no nested-list table fallback");
  // S5 structured-comparison semantic cleanliness (aligned tables, no incomplete manifest block, no schema field exposure)
  assert.match(s5, /<th scope="col">Step<\/th><th scope="col">Annual real gross value added growth \(%\)<\/th><th scope="col">Change to next \(percentage points\)<\/th>/, label + " S5 successive-diff table A");
  assert.match(s5, /<th scope="col">Step<\/th><th scope="col">Variable Y \(unitless\)<\/th><th scope="col">Change to next \(unitless\)<\/th>/, label + " S5 successive-diff table I");
  assert.match(s5, /<th scope="row">1<\/th><td>0\.8<\/td><td>0\.8<\/td>/, label + " S5 successive-diff row 1");
  assert.match(s5, /<th scope="row">10<\/th><td>4\.4<\/td><td>—<\/td>/, label + " S5 successive-diff final row");
  assert.match(s5, /<th scope="col">Observation<\/th><th scope="col">Relative vertical position<\/th>/, label + " S5 relative-position table headers");
  assert.match(s5, /<th scope="row">A1<\/th><td>0<\/td>/, label + " S5 A1 relative position paired");
  assert.match(s5, /<th scope="row">A10<\/th><td>100<\/td>/, label + " S5 A10 relative position paired");
  assert.match(s5, /<th scope="row">I1<\/th><td>40<\/td>/, label + " S5 I1 relative position paired");
  assert.match(s5, /<th scope="row">I6<\/th><td>60<\/td>/, label + " S5 I6 relative position paired");
  assert.doesNotMatch(s5, /<dt>Title<\/dt>|<dt>Coefficient<\/dt>|<dt>Coefficient display<\/dt>/i, label + " S5 no incomplete cross-ref manifest block");
  assert.doesNotMatch(s5, /<h4>Series<\/h4>|<h4>Observation ids<\/h4>|<h4>Ordered values<\/h4>|<h4>Successive differences<\/h4>|<h4>Relative vertical positions<\/h4>/i, label + " S5 no schema-derived headings");
  assert.doesNotMatch(s5, /<strong>Horizontal variable<\/strong>|<strong>Horizontal step<\/strong>|<strong>Vertical variable<\/strong>|<strong>Difference unit<\/strong>/i, label + " S5 no schema metadata labels");
  assert.doesNotMatch(s5, /<strong>Accessible distribution comparison<\/strong>|<strong>Comparison guidance<\/strong>|<strong>Qualification<\/strong>/i, label + " S5 no schema prose labels");
  assert.doesNotMatch(s5, /<h4>Coefficient comparison<\/h4>/i, label + " S5 no redundant schema heading above captioned table");
  const s5PlotPos = s5.indexOf('data-scatterplot-figure="true"');
  const s5ComparePos = s5.indexOf("Regional investment and the supplementary illustration");
  const s5SynthPos = s5.indexOf("Direction and magnitude of the two positive coefficients");
  assert.ok(
    s5PlotPos > 0 && s5ComparePos > s5PlotPos && s5SynthPos > s5ComparePos,
    label + " S5 staged instructional order preserved"
  );

  // 6. S6 (M05): comparative summary table intact
  const s6 = sectionSlice(html, "S6");
  assert.match(s6, /data-material-type="expository_structured_table"/, label + " S6 summary table");
  assert.match(s6, /<caption>Graphical and numerical interpretations of the three relationships<\/caption>/, label + " S6 caption");
  assert.match(s6, /0\.93/);
  assert.match(s6, /-0\.94/);
  assert.match(s6, /0\.49/);
}

test("complete 6-section Economics C1 renders all 3 scatterplots natively, suppresses raw spec chrome, and preserves preview/ZIP parity", () => {
  const page = buildCompleteC1EconomicsPage();
  const asset = attachedS3Asset();

  // None of M01, M03, M04 should be misclassified as unrealised external illustrations
  page.sections.forEach(function (sec) {
    (sec.materials || []).forEach(function (mat) {
      if (mat.material_id === "M01" || mat.material_id === "M03" || mat.material_id === "M04") {
        assert.equal(
          handoff.isUnrealizedIllustrationSpecification(mat),
          false,
          mat.material_id + " is natively rendered and must not be an unrealised external illustration"
        );
      }
    });
  });

  // Preview render
  const rendered = renderLearnerPageHtml(page, {
    compositionMode: "moments",
    visualAssets: { assets: [asset] }
  });
  assert.equal(rendered.error, null);
  const previewHtml = String(rendered.html || "");
  assertAllSixSectionsValid(previewHtml, "preview");

  // All 3 scatterplots present across the page with unique SVG title IDs
  const svgTitles = previewHtml.match(/<title id="scatterplot-title-[^"]+">/g) || [];
  assert.equal(svgTitles.length, 3, "Expected exactly 3 scatterplot SVG figures across S2, S4, S5");
  assert.equal(new Set(svgTitles).size, 3, "Each scatterplot SVG title id must be unique");

  // Exported ZIP parity
  const built = learnerPackage.buildLearnerPackage({
    html: previewHtml,
    visualAssetManifest: { assets: [asset] },
    title: "Reading relationships in economic data"
  });
  assert.equal(built.ok, true, JSON.stringify(built.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  const packagedHtml = fflate.strFromU8(entries["learner-page.html"]);
  assertAllSixSectionsValid(packagedHtml, "zip-export");
  assert.match(packagedHtml, /src="assets\/section-after-content\.png"/);
});
