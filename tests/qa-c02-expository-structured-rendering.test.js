"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const fflate = require("fflate");

const vnext = require("../lib/learner-renderer-vnext/index.js");
const artefactProducers = require("../lib/learner-renderer-vnext/learner-artefact-producers.js");
const learnerPackage = require("../lib/learner-package.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");

const repoRoot = path.resolve(__dirname, "..");
const runtimeScript = fs.readFileSync(
  path.join(repoRoot, "lib", "learner-renderer-vnext-browser.js"),
  "utf8"
);

function buildC02AssembledPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "What does a causal claim actually mean?",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    activities: [],
    expository_journey: {
      journey_intent: "Move learners from describing relationships to recognising causal commitments.",
      learning_outcomes: [
        {
          ref: "LO1",
          statement: "Explain how a causal claim about an economic relationship goes beyond a descriptive statement of statistical association."
        },
        {
          ref: "LO2",
          statement: "Reformulate an unsupported economic causal claim as an appropriately qualified conclusion justified by the available observations."
        }
      ]
    },
    learner_artefacts: {
      produces: [
        {
          elicitation_id: "E1",
          response_kind: "constructed_text",
          label: "Distinguishing association from causation",
          prompt:
            "Write a short paragraph explaining why the causal claim goes beyond the available evidence. Include a reformulated conclusion that accurately describes what the observations support."
        }
      ]
    },
    sections: [
      {
        section_id: "S1",
        title: "One relationship, two different claims",
        order: 1,
        exposition:
          "Consider the relationship between education and earnings. The scatterplot shows that people with more years of education generally have higher earnings.",
        materials: [
          {
            material_id: "M01",
            commission_id: "XM01",
            section_id: "S1",
            kind: "Empirical scatterplot with accessible data table",
            body: {
              title: "Education and annual earnings",
              context: "Eight illustrative employed adults observed during the same year.",
              source_note:
                "These data have been constructed for educational purposes and are not findings from an actual economic study.",
              scatterplot: {
                title: "Education and annual earnings",
                x_axis: {
                  label: "Completed years of formal education (years)",
                  minimum: 10,
                  maximum: 19,
                  tick_interval: 1,
                  scale: "linear"
                },
                y_axis: {
                  label: "Annual gross employment earnings (thousands of GBP)",
                  minimum: 0,
                  maximum: 50,
                  tick_interval: 10,
                  scale: "linear"
                },
                observations: [
                  { person: "P01", x: 11, y: 22 },
                  { person: "P02", x: 12, y: 26 },
                  { person: "P03", x: 13, y: 24 },
                  { person: "P04", x: 14, y: 32 },
                  { person: "P05", x: 15, y: 30 },
                  { person: "P06", x: 16, y: 38 },
                  { person: "P07", x: 17, y: 36 },
                  { person: "P08", x: 18, y: 44 }
                ],
                caption:
                  "Each point represents one person. Its position records their completed years of formal education and annual gross employment earnings.",
                accessible_description:
                  "Scatterplot of completed years of formal education against annual gross employment earnings for eight illustrative employed adults. The observations generally rise from left to right, with some variation between individuals. The accompanying table provides all eight observations."
              },
              table: {
                caption:
                  "Completed years of formal education and annual gross employment earnings for eight illustrative employed adults observed during the same year.",
                columns: [
                  "Person",
                  "Completed years of formal education (years)",
                  "Annual gross employment earnings (thousands of GBP)"
                ],
                rows: [
                  ["P01", 11, 22],
                  ["P02", 12, 26],
                  ["P03", 13, 24],
                  ["P04", 14, 32],
                  ["P05", 15, 30],
                  ["P06", 16, 38],
                  ["P07", 17, 36],
                  ["P08", 18, 44]
                ]
              }
            }
          }
        ]
      },
      {
        section_id: "S4",
        title: "Matching the conclusion to the evidence",
        order: 4,
        exposition: "Consider the relationship between household disposable income and consumption expenditure.",
        materials: [
          {
            material_id: "M03",
            commission_id: "XM03",
            section_id: "S4",
            kind: "Accessible economic evidence table",
            body: {
              title: "Household disposable income and consumption expenditure",
              context: "Eight illustrative households observed during the same month.",
              table: {
                caption:
                  "Monthly household disposable income and monthly household consumption expenditure for eight illustrative households.",
                columns: [
                  "Household",
                  "Monthly household disposable income (GBP)",
                  "Monthly household consumption expenditure (GBP)"
                ],
                rows: [
                  ["H01", 1500, 1400],
                  ["H02", 2000, 1900]
                ]
              },
              source_note: "Illustrative data constructed for educational purposes."
            }
          }
        ]
      },
      {
        section_id: "S5",
        title: "Putting the distinction into your own words",
        order: 5,
        exposition:
          "Suppose someone uses these observations to claim: Increasing the retail price of the product causes the weekly quantity sold to decrease.\n\nWrite a short paragraph explaining why the causal claim goes beyond the available evidence. Include a reformulated conclusion that accurately describes what the observations support.\n\nComplete your own explanation before considering the feedback.",
        materials: [
          {
            material_id: "M04",
            commission_id: "XM04",
            section_id: "S5",
            kind: "Economic evidence scatterplot and accessible data table",
            body: {
              title: "Product prices and weekly sales",
              context:
                "Seven illustrative retail outlets selling the same packaged product during the same week.",
              source_note:
                "These observations have been constructed for educational purposes and are not findings from an actual economic study.",
              scatterplot: {
                title: "Product prices and weekly sales",
                x_axis: {
                  label: "Retail price per item (GBP)",
                  minimum: 1.5,
                  maximum: 5.5,
                  tick_interval: 0.5,
                  scale: "linear"
                },
                y_axis: {
                  label: "Weekly quantity sold (items)",
                  minimum: 0,
                  maximum: 140,
                  tick_interval: 20,
                  scale: "linear"
                },
                observations: [
                  { outlet: "R01", x: 2, y: 120 },
                  { outlet: "R02", x: 2.5, y: 110 },
                  { outlet: "R03", x: 3, y: 115 },
                  { outlet: "R04", x: 3.5, y: 95 },
                  { outlet: "R05", x: 4, y: 85 },
                  { outlet: "R06", x: 4.5, y: 90 },
                  { outlet: "R07", x: 5, y: 75 }
                ],
                caption:
                  "Each point represents one retail outlet, positioned according to its retail price per item and the quantity sold during the week.",
                accessible_description:
                  "Scatterplot containing seven observations of retail price per item in GBP and weekly quantity sold in items. Each observation represents a different retail outlet selling the same packaged product during the same week. The accompanying table provides the exact coordinates of all seven points."
              },
              table: {
                caption:
                  "Retail price per item and weekly quantity sold at seven illustrative retail outlets selling the same packaged product during the same week.",
                columns: [
                  "Retail outlet",
                  "Retail price per item (GBP)",
                  "Weekly quantity sold (items)"
                ],
                rows: [
                  ["R01", 2, 120],
                  ["R02", 2.5, 110],
                  ["R03", 3, 115],
                  ["R04", 3.5, 95],
                  ["R05", 4, 85],
                  ["R06", 4.5, 90],
                  ["R07", 5, 75]
                ]
              }
            }
          },
          {
            material_id: "M05",
            commission_id: "XM05",
            section_id: "S5",
            kind: "Learner-authored explanatory text elicitation",
            body: {
              heading: "Your explanation",
              response_field: {
                label: "Your explanation and reformulated conclusion",
                type: "open_text",
                initial_value: "",
                response_extent: "A short paragraph or equivalent concise explanation.",
                prompt_reference: {
                  section_id: "S5",
                  source_field: "exposition",
                  authored_prompt:
                    "Write a short paragraph explaining why the causal claim goes beyond the available evidence."
                },
                associated_evidence: {
                  material_id: "M04",
                  title: "Product prices and weekly sales"
                }
              },
              completion_control: {
                label: "Compare your explanation with the feedback",
                associated_feedback_material: "M06"
              }
            },
            formal_notes: {
              elicitation_id: "E1",
              journal_artefact_id: "C02.E1"
            }
          }
        ]
      },
      {
        section_id: "S6",
        title: "What we can conclude, and what remains open",
        order: 6,
        exposition:
          "### Comparing your explanation\n\nThe observations show that retail outlets charging higher prices generally sell fewer items during the week.\n\n### Why a strong association is not enough\n\nEven if the observations followed a perfectly straight downward-sloping line, they would still describe differences between outlets.\n\n### From describing relationships to investigating causes\n\nThis leaves an important question: if an observed relationship does not necessarily establish the causal explanation we initially propose, what other explanations might account for it? In Why might two economic variables be related?, you will investigate how different causal explanations can be consistent with the same observed association.",
        materials: [
          {
            material_id: "M06",
            commission_id: "XM06",
            section_id: "S6",
            kind: "Post-attempt explanatory feedback disclosure",
            body: {
              disclosure_label: "Compare your explanation with the feedback",
              feedback_content: {
                source_artifact: "expository_development",
                section_id: "S6",
                source_field: "exposition",
                rendering_mode:
                  "Use the complete authored exposition once, as the disclosed feedback and consolidation.",
                blocks: [
                  {
                    heading: "Comparing your explanation",
                    paragraphs: [
                      "The observations show that retail outlets charging higher prices generally sell fewer items during the week."
                    ]
                  },
                  {
                    heading: "Why a strong association is not enough",
                    paragraphs: [
                      "Even if the observations followed a perfectly straight downward-sloping line, they would still describe differences between outlets."
                    ]
                  },
                  {
                    heading: "From describing relationships to investigating causes",
                    paragraphs: [
                      "This leaves an important question: if an observed relationship does not necessarily establish the causal explanation we initially propose, what other explanations might account for it? In Why might two economic variables be related?, you will investigate how different causal explanations can be consistent with the same observed association."
                    ]
                  }
                ]
              },
              comparison_context: {
                learner_response: {
                  label: "Your explanation",
                  source_material: "M05",
                  source_elicitation: "E1",
                  display: "The learner's own initial explanation, without alteration or automated annotation."
                },
                original_evidence: {
                  title: "Product prices and weekly sales",
                  source_material: "M04",
                  display: "The original scatterplot and accessible data table, retained or made available for reference."
                }
              }
            },
            formal_notes: {
              associated_elicitation: "E1",
              associated_response_material: "M05",
              assembly_requirement:
                "Render the S6 exposition through this disclosure material once only. Do not additionally render the same exposition as unrestricted section content."
            }
          }
        ]
      }
    ]
  };
}

test("C02 Defect 1: M01 and M04 render as deterministic inline SVG scatterplots with accessible tables and zero spec leakage", () => {
  const page = buildC02AssembledPage();
  const rendered = vnext.renderLearnerPageHtml(page, { pageKey: "qa-c02-test" });
  assert.ok(rendered && rendered.html, rendered && rendered.error);
  const html = rendered.html;

  // Both M01 and M04 use expository_structured_scatterplot (not expository_structured_table)
  assert.match(html, /data-material-id="M01"[^>]*data-material-type="expository_structured_scatterplot"/);
  assert.match(html, /data-material-id="M04"[^>]*data-material-type="expository_structured_scatterplot"/);

  // M01 has 8 plotted points (P01..P08) and M04 has 7 plotted points (R01..R07)
  const m01Block = html.slice(html.indexOf('data-material-id="M01"'), html.indexOf('id="exposition-S4"'));
  const m04Block = html.slice(html.indexOf('data-material-id="M04"'), html.indexOf('data-material-id="M05"'));

  assert.equal((m01Block.match(/<circle\b/g) || []).length, 8);
  assert.equal((m04Block.match(/<circle\b/g) || []).length, 7);
  assert.doesNotMatch(m01Block, /<polyline\b|<path\b/i);
  assert.doesNotMatch(m04Block, /<polyline\b|<path\b/i);

  // Axis labels, exact coordinates, and accessible tables preserved
  assert.match(m01Block, /Completed years of formal education \(years\)/);
  assert.match(m01Block, /Annual gross employment earnings \(thousands of GBP\)/);
  assert.match(m01Block, /<table\b/);
  assert.match(m01Block, /P01/);
  assert.match(m01Block, /P08/);

  assert.match(m04Block, /Retail price per item \(GBP\)/);
  assert.match(m04Block, /Weekly quantity sold \(items\)/);
  assert.match(m04Block, /<table\b/);
  assert.match(m04Block, /R01/);
  assert.match(m04Block, /R07/);

  // Accessible descriptions live in <desc> ONCE (not duplicated as visible prose) and preserve pedagogical neutrality
  assert.equal((m01Block.match(/The observations generally rise from left to right/g) || []).length, 1);
  assert.equal((m04Block.match(/The accompanying table provides the exact coordinates of all seven points/g) || []).length, 1);
  assert.doesNotMatch(m04Block, /negative association|downward/i);

  // Zero plotting specification metadata leakage
  for (const forbidden of ["Tick Interval", "X Axis", "Y Axis", "tick_interval", "Accessible Description", "scale"]) {
    assert.equal(m01Block.includes(forbidden), false, "M01 must not leak " + forbidden);
    assert.equal(m04Block.includes(forbidden), false, "M04 must not leak " + forbidden);
  }
});

test("C02 Defect 2: M05 and M06 render via learner-facing response and feedback disclosure components with zero metadata leakage", () => {
  const page = buildC02AssembledPage();
  const rendered = vnext.renderLearnerPageHtml(page, { pageKey: "qa-c02-test" });
  const html = rendered.html;

  assert.match(html, /data-material-id="M05"[^>]*data-material-type="expository_response_elicitation"/);
  assert.match(html, /data-material-id="M06"[^>]*data-material-type="expository_feedback_disclosure"/);

  // Zero internal specification keys or values leaked anywhere in rendered HTML
  const leakedTokens = [
    "open_text",
    "prompt_reference",
    "Prompt Reference",
    "Source Field",
    "source_field",
    "Associated Evidence",
    "associated_evidence",
    "Completion Control",
    "Associated Feedback Material",
    "associated_feedback_material",
    "expository_development",
    "Source Artifact",
    "source_artifact",
    "Rendering Mode",
    "rendering_mode",
    "Use the complete authored exposition once",
    "Comparison Context",
    "Source Material",
    "Source Elicitation",
    "without alteration or automated annotation"
  ];
  for (const token of leakedTokens) {
    assert.equal(html.includes(token), false, "Rendered HTML must not leak metadata token: " + token);
  }
});

test("C02 Defect 3: E1 is placed once in S5 before S6, feedback/consolidation is deduplicated in S6 disclosure, intellectual close is final, and persistence + journal contract are preserved", () => {
  const page = buildC02AssembledPage();
  const rendered = vnext.renderLearnerPageHtml(page, { pageKey: "qa-c02-test" });
  const html = rendered.html;

  // E1 workspace appears EXACTLY ONCE, inside S5, BEFORE S6, with canonical workspace id
  const e1Matches = html.match(/data-workspace-id="learner-constructed-E1"/g) || [];
  assert.equal(e1Matches.length, 1, "E1 workspace must render exactly once");
  assert.equal(html.includes('data-region="learner-artefacts"'), false, "No trailing duplicate learner-artefacts region");

  const posS5 = html.indexOf('id="exposition-S5"');
  const posM04 = html.indexOf('data-material-id="M04"');
  const posE1 = html.indexOf('data-workspace-id="learner-constructed-E1"');
  const posS6 = html.indexOf('id="exposition-S6"');
  const posM06 = html.indexOf('data-material-id="M06"');
  const posClose = html.indexOf("In Why might two economic variables be related?");

  assert.ok(posS5 > 0 && posM04 > posS5 && posE1 > posM04 && posS6 > posE1 && posM06 > posS6 && posClose > posM06);

  // Feedback and consolidation blocks appear EXACTLY ONCE (inside M06 <details>, not duplicated in raw S6 exposition)
  assert.equal((html.match(/Comparing your explanation/g) || []).length, 1);
  assert.equal((html.match(/Why a strong association is not enough/g) || []).length, 1);
  assert.equal((html.match(/From describing relationships to investigating causes/g) || []).length, 1);
  assert.equal((html.match(/In Why might two economic variables be related\?/g) || []).length, 1);
  assert.match(html, /<details[^>]*data-feedback-disclosure="true"[^>]*><summary[^>]*>Compare your explanation with the feedback<\/summary>/);

  // Persistence & Learning Journey journal artefact discovery preserved
  assert.match(html, /data-learner-draft-controls="true"/);
  const producers = artefactProducers.discoverConstructedTextProducers(page);
  assert.equal(producers.length, 1);
  assert.equal(producers[0].elicitationId, "E1");
  assert.equal(producers[0].workspaceId, "learner-constructed-E1");
});

test("C02 Surface consistency: standalone export package and unified Learning Journey shell preserve inline SVG scatterplots, E1 placement, and M06 disclosure", () => {
  const page = buildC02AssembledPage();
  const rendered = vnext.renderLearnerPageHtml(page, { pageKey: "v1::qa-c02::c2" });
  const standalone = learnerPackage.buildLearnerPackage({
    html: "<!doctype html><html><head><title>C02</title></head><body>" + rendered.html + "</body></html>",
    title: page.title,
    repoRoot
  });
  assert.equal(standalone.ok, true, standalone.error && standalone.error.message);
  assert.equal((standalone.package.html.match(/<svg[^>]*util-scatterplot-svg/g) || []).length, 2);
  assert.equal((standalone.package.html.match(/data-workspace-id="learner-constructed-E1"/g) || []).length, 1);

  const journey = ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Correlation and Causation",
    sections: [
      { section_id: "journey_intro", title: "Overview", order: 1, exposition: "Intro." },
      { section_id: "s2", title: page.title, order: 2, exposition: "C02." }
    ],
    commissions: [
      {
        commission_id: "c2",
        section_id: "s2",
        order: 2,
        title: page.title,
        product_id: "expository",
        status: "supported",
        specification_text: "C02"
      }
    ]
  });
  assert.equal(journey.ok, true);
  const unified = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "c2",
        title: page.title,
        productId: "expository",
        fragmentHtml: rendered.html
      }
    ],
    fflate,
    runtimeScript
  });
  assert.equal(unified.ok, true, unified.error && unified.error.message);
  const files = fflate.unzipSync(unified.bytes);
  const unifiedHtml = Buffer.from(files["index.html"]).toString("utf8");
  assert.equal((unifiedHtml.match(/<svg[^>]*util-scatterplot-svg/g) || []).length, 2);
  assert.equal((unifiedHtml.match(/data-workspace-id="learner-constructed-E1"/g) || []).length, 1);
  assert.equal((unifiedHtml.match(/In Why might two economic variables be related\?/g) || []).length, 1);
});
