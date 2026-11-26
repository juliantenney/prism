/**
 * Targeted regression tests for C3 Expository structured-material defects:
 * 1. Canonical scatterplot contract: XM prompt & capture validation require
 *    inline observations[] and reject relational data_reference/column_index
 *    specs (XM-SCATTER-01) and raw <svg> (XM-SVG-01); canonical XM1 renders
 *    deterministic SVG + semantic table + clean numerical_summary display.
 * 2. Embedded Expository formative checks: single_selection (XM2/XM5/XM7) and
 *    classification (XM9) reuse assessment-interactive + assessment-runtime,
 *    hide answers/feedback until checked, expose zero internal IDs/config
 *    metadata, and reject unsupported/malformed check shapes (XM-CHECK-01).
 * 3. Table row_header_column_index alias & numerical_summary: XM8 comparison_table
 *    and XM1 paired_observations render <th scope="row">, suppress technical
 *    config keys, and display numerical_summary without "Symbol".
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const expositoryPrompts = require("../lib/expository-sibling-prompts.js");
const expositoryContracts = require("../lib/expository-contracts.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const sectionNav = require("../lib/learner-renderer-vnext/sequential-section-nav.js");

const C3_DATASET_A_OBS = [
  { label: "A1", x: 12, y: 0.8 },
  { label: "A2", x: 14, y: 1.6 },
  { label: "A3", x: 16, y: 1.2 },
  { label: "A4", x: 18, y: 2.4 },
  { label: "A5", x: 20, y: 1.9 },
  { label: "A6", x: 22, y: 3.1 },
  { label: "A7", x: 24, y: 2.6 },
  { label: "A8", x: 26, y: 3.8 },
  { label: "A9", x: 28, y: 3.2 },
  { label: "A10", x: 30, y: 4.4 }
];

function buildCanonicalC3Page() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "Does investment cause economic growth?",
    audience: "First-year undergraduate economics students.",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Familiar evidence, a different question",
        order: 1,
        exposition: "Examine the regional investment observations.\n\n[[material:M1]]\n\n[[material:M2]]",
        materials: [
          {
            material_id: "XM1",
            commission_id: "M1",
            section_id: "S1",
            kind: "Statistical evidence display with accessible equivalent",
            body: {
              heading: "Regional investment and economic growth",
              introduction: "Each observation represents one of ten fictional regions.",
              scatterplot: {
                title: "Private-sector investment and regional economic growth",
                x_axis: {
                  label: "Private-sector investment (% of regional GVA)",
                  scale: "linear",
                  minimum: 10,
                  maximum: 32,
                  tick_interval: 2
                },
                y_axis: {
                  label: "Annual real GVA growth (%)",
                  scale: "linear",
                  minimum: 0,
                  maximum: 5,
                  tick_interval: 1
                },
                observations: C3_DATASET_A_OBS,
                show_point_labels: true,
                accessible_description: "Scatterplot of private-sector investment and annual real GVA growth for regions A1 to A10."
              },
              paired_observations: {
                caption: "Investment and economic growth in ten fictional regions",
                columns: ["Region", "Investment (%)", "Growth (%)"],
                rows: C3_DATASET_A_OBS.map((o) => [o.label, o.x, o.y]),
                row_header_column_index: 0,
                numerical_summary_reference: "numerical_summary"
              },
              numerical_summary: {
                statistic: "Pearson correlation coefficient",
                symbol: "r",
                value: 0.93,
                display: "Pearson r = 0.93"
              },
              source_note: "Synthetic observations constructed for educational purposes."
            }
          },
          {
            material_id: "XM2",
            commission_id: "M2",
            section_id: "S1",
            kind: "Guided discrimination with explanatory feedback",
            body: {
              heading: "Description or causal claim?",
              question: "Which statement goes beyond describing the observations?",
              response_type: "single_selection",
              options: [
                { option_id: "A", text: "Regions with higher private-sector investment generally have faster economic growth." },
                { option_id: "B", text: "Higher private-sector investment causes faster regional economic growth." }
              ],
              correct_option_id: "B",
              feedback: [
                { option_id: "A", text: "This describes how the two measured variables tend to vary together." },
                { option_id: "B", text: "This asserts that investment influences growth beyond the observations alone." }
              ],
              feedback_control_label: "Check your reasoning"
            }
          }
        ]
      },
      {
        section_id: "S5",
        title: "Three explanations, one body of evidence",
        order: 2,
        exposition: "Compare the three mechanisms.\n\n[[material:M8]]\n\n[[material:M9]]",
        materials: [
          {
            material_id: "XM8",
            commission_id: "M8",
            section_id: "S5",
            kind: "Comparative representation of causal explanations",
            body: {
              heading: "Three possible explanations for the same association",
              comparison_table: {
                caption: "Comparing the proposed directions of causal influence",
                columns: ["Explanation", "Proposed direction of influence", "How the positive association could arise"],
                rows: [
                  ["Direct causation", "Investment could increase productive capacity.", "Regions with higher investment could grow faster."],
                  ["Reverse causality", "Stronger economic growth could encourage investment.", "Faster-growing regions could attract investment."],
                  ["Confounding", "Workforce skills could attract investment and support growth.", "Both variables could be higher in skilled regions."]
                ],
                row_header_column_index: 0
              },
              closing: "All three explanations are compatible with the observed positive association."
            }
          },
          {
            material_id: "XM9",
            commission_id: "M9",
            section_id: "S5",
            kind: "Integrated guided discrimination with explanatory feedback",
            body: {
              heading: "Distinguishing observations from causal explanations",
              instruction: "For each statement, identify what kind of account it gives of the relationship.",
              response_type: "classification",
              response_categories: [
                { category_id: "observation", label: "Description of an observed association" },
                { category_id: "investment_to_growth", label: "Proposed investment-to-growth mechanism" },
                { category_id: "growth_to_investment", label: "Proposed growth-to-investment mechanism" },
                { category_id: "common_influence", label: "Proposed common influence on investment and growth" }
              ],
              statements: [
                {
                  statement_id: "1",
                  text: "Across the ten regions, those with higher investment generally have faster growth.",
                  correct_category_id: "observation",
                  feedback: "This describes the observed statistical pattern."
                },
                {
                  statement_id: "2",
                  text: "Businesses in faster-growing regions may respond by investing in additional equipment.",
                  correct_category_id: "growth_to_investment",
                  feedback: "This proposes reverse causality from growth to investment."
                },
                {
                  statement_id: "3",
                  text: "A skilled workforce may attract investment while also supporting faster growth.",
                  correct_category_id: "common_influence",
                  feedback: "Workforce skills act as a potential common cause."
                },
                {
                  statement_id: "4",
                  text: "Investment in facilities could increase output and contribute to growth.",
                  correct_category_id: "investment_to_growth",
                  feedback: "This proposes direct causation from investment to growth."
                }
              ],
              feedback_control_label: "Check your classifications"
            }
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["expository_journey_plan", "expository_development", "expository_materials", "design_page"]
    }
  };
}

test("1. XM generation prompt documents canonical scatterplot schema and embedded single_selection/classification check contracts", () => {
  const xmPrompt = expositoryPrompts.TEMPLATES.expository_materials;
  assert.match(xmPrompt, /body\.scatterplot/);
  assert.match(xmPrompt, /XM-SCATTER-01/);
  assert.match(xmPrompt, /data_reference\/column_index/);
  assert.match(xmPrompt, /"single_selection"/);
  assert.match(xmPrompt, /"classification"/);
  assert.match(xmPrompt, /XM-CHECK-01/);

  const xdPrompt = expositoryPrompts.TEMPLATES.expository_development;
  assert.match(xdPrompt, /single_selection or classification/);
});

test("2. XM capture validation rejects C3 relational data_reference/column_index scatterplot (XM-SCATTER-01) and accepts canonical inline observations[]", () => {
  const failingC3Xm = {
    artifact_type: "expository_materials",
    materials: [
      {
        material_id: "XM1",
        commission_id: "M1",
        section_id: "S1",
        kind: "Statistical evidence display",
        body: {
          scatterplot: {
            title: "Private-sector investment and regional economic growth",
            chart_type: "scatter",
            data_reference: "paired_observations",
            x_axis: { label: "Investment (%)", column_index: 1, minimum: 10, maximum: 32, tick_interval: 2 },
            y_axis: { label: "Growth (%)", column_index: 2, minimum: 0, maximum: 5, tick_interval: 1 },
            observation_identifier_column_index: 0,
            show_regression_line: false,
            show_causal_arrows: false
          }
        }
      }
    ]
  };
  const badRes = expositoryContracts.validateExpositoryArtefactShape(failingC3Xm, "expository_materials");
  assert.equal(badRes.ok, false, "Relational data_reference/column_index scatterplot must fail XM validation");
  assert.ok(
    badRes.errors.some((e) => e.includes("XM-SCATTER-01") && e.includes("data_reference/column_index")),
    "Expected actionable XM-SCATTER-01 diagnostic, got: " + JSON.stringify(badRes.errors)
  );

  const page = buildCanonicalC3Page();
  const validXm = {
    artifact_type: "expository_materials",
    materials: page.sections.flatMap((s) => s.materials)
  };
  const goodRes = expositoryContracts.validateExpositoryArtefactShape(validXm, "expository_materials");
  assert.equal(goodRes.ok, true, "Canonical C3 XM must pass validation: " + JSON.stringify(goodRes.errors));
});

test("3. XM capture validation rejects unsupported or malformed embedded formative checks (XM-CHECK-01)", () => {
  const unsupportedCheck = {
    artifact_type: "expository_materials",
    materials: [
      {
        material_id: "XM2",
        commission_id: "M2",
        section_id: "S1",
        kind: "Guided check",
        body: {
          heading: "Unsupported check",
          response_type: "free_matrix_drag",
          question: "Sort these"
        }
      }
    ]
  };
  const badType = expositoryContracts.validateExpositoryArtefactShape(unsupportedCheck, "expository_materials");
  assert.equal(badType.ok, false);
  assert.ok(badType.errors.some((e) => e.includes("XM-CHECK-01")));

  const mismatchedKey = {
    artifact_type: "expository_materials",
    materials: [
      {
        material_id: "XM9",
        commission_id: "M9",
        section_id: "S5",
        kind: "Classification",
        body: {
          instruction: "Classify each statement.",
          response_type: "classification",
          response_categories: [
            { category_id: "obs", label: "Observation" },
            { category_id: "cause", label: "Cause" }
          ],
          statements: [
            { statement_id: "1", text: "Statement 1", correct_category_id: "nonexistent", feedback: "Note." }
          ]
        }
      }
    ]
  };
  const badKey = expositoryContracts.validateExpositoryArtefactShape(mismatchedKey, "expository_materials");
  assert.equal(badKey.ok, false);
  assert.ok(badKey.errors.some((e) => e.includes("XM-CHECK-01")));
});

test("4. Canonical C3 Expository renders native scatterplot, semantic <th scope='row'> tables, clean numerical_summary, and interactive single_selection + classification checks without leaking internal metadata", () => {
  const page = buildCanonicalC3Page();
  const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  const html = rendered.html;

  // Defect 1: Native scatterplot SVG rendered with 10 points & labels, zero technical config chrome
  const svgMatches = html.match(/<svg\b[^>]*class="util-scatterplot-svg"[\s\S]*?<\/svg>/g) || [];
  assert.equal(svgMatches.length, 1, "XM1 must render 1 native scatterplot SVG");
  assert.equal((svgMatches[0].match(/class="util-scatterplot-point"/g) || []).length, 10);
  assert.doesNotMatch(html, /Column index|Observation identifier column index|Show regression line|Show causal arrows/);

  // Defect 2: XM9 classification renders dropdowns with all 4 readable category labels, no blank cells, no snake_case IDs exposed in visible text
  assert.match(html, /data-assessment-form="classification"/);
  assert.match(html, />Description of an observed association</);
  assert.match(html, />Proposed investment-to-growth mechanism</);
  assert.match(html, />Proposed growth-to-investment mechanism</);
  assert.match(html, />Proposed common influence on investment and growth</);
  assert.match(html, />Check your classifications</);
  assert.doesNotMatch(html, /<td>\s*<\/td>/, "Must not render blank table cells");

  // Defect 3: XM2 single_selection renders radio controls with custom check button, without visibly exposing option IDs, correct_option_id, or Feedback control label
  assert.match(html, /data-assessment-form="single_answer_mcq"/);
  assert.match(html, />Check your reasoning</);
  assert.doesNotMatch(html, /Correct option id|Option id|Feedback control label/i);

  // Defect 4: XM1 and XM8 tables render <th scope="row"> for row_header_column_index: 0, suppress Row header column index, and render Pearson r = 0.93 cleanly without "Symbol"
  assert.match(html, /<th scope="row">A1<\/th>/, "XM1 paired_observations must render <th scope=\"row\">");
  assert.match(html, /<th scope="row">Direct causation<\/th>/, "XM8 comparison_table must render <th scope=\"row\">");
  assert.doesNotMatch(html, /Row header column index/i);
  assert.match(html, /Pearson r = 0\.93/);
  assert.doesNotMatch(html, /<strong>Symbol<\/strong>/i);

  // Runtime script included for interactive checks, while nav does NOT invent a phantom Self assessment destination
  assert.match(html, /<script>[\s\S]*data-assessment-check[\s\S]*<\/script>/);
  const built = buildPageModel(page);
  const prepared = sectionNav.prepareJourneySectionMarkers(html, built.model);
  const navItems = sectionNav.buildSectionNavItems(prepared, built.model);
  assert.ok(!navItems.some((i) => i.id === "journey-assessment"), "Embedded Expository checks must not create a #journey-assessment nav section");
});
