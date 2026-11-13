/**
 * Production-only structured-material fields must not appear as learner-facing
 * headings. Educational comparison content and accessibility semantics remain.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const structured = require("../lib/learner-renderer-vnext/expository-structured-materials.js");
const sibling = require("../lib/expository-sibling-prompts.js");

const PRODUCTION_CHROME = [
  "Format",
  "Representations",
  "Interpretive statement",
  "Representation type",
  "Compact visual label",
  "Comparison focus",
  "Column headers"
];

function pageWithMaterial(body, kind) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "From Gradients to Equations",
    activities: [],
    sections: [
      {
        section_id: "S5",
        title: "Equivalent constraint representations",
        exposition:
          "The same feasible rectangle can be written with different constraint functions.",
        materials: [
          {
            material_id: "XM-S5-01",
            kind: kind || "equivalent-constraint comparison",
            title: "The same rectangle, two multiplier values",
            body: body
          }
        ]
      }
    ],
    page_synthesis: {},
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

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const at = html.indexOf(marker);
  assert.ok(at >= 0, "missing " + materialId);
  const open = html.lastIndexOf("<article", at);
  const end = html.indexOf("</article>", at);
  return html.slice(open, end + "</article>".length);
}

function visible(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertChromeAbsent(fragment) {
  PRODUCTION_CHROME.forEach(function (label) {
    const pattern = new RegExp(
      "<(?:strong|h4|dt|th)[^>]*>\\s*" +
        label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
        "\\s*</",
      "i"
    );
    assert.doesNotMatch(fragment, pattern, "production chrome published: " + label);
  });
}

test("production chrome keys are classified without suppressing educational labels", () => {
  assert.equal(structured.isRepresentationOmissionKey("format"), true);
  assert.equal(structured.isUnlabeledStructureKey("representations"), true);
  assert.equal(structured.isUnlabeledProseKey("interpretive_statement"), true);
  assert.equal(structured.isUnlabeledProseKey("introduction"), true);
  assert.equal(structured.isUnlabeledProseKey("closing"), true);
  assert.equal(structured.isUnlabeledProseKey("conceptual_distinction"), true);
  assert.equal(structured.isUnlabeledProseKey("relationship"), true);
  assert.equal(structured.isPromotedHeadingKey("heading"), true);
  assert.equal(structured.isRepresentationOmissionKey("constraint_function"), false);
  assert.equal(structured.isUnlabeledProseKey("constraint_function"), false);
  assert.equal(structured.isUnlabeledProseKey("theory_of_truth"), false);
  assert.equal(structured.humanizeKey("constraint_function"), "Constraint function");
});

test("C3-style comparison suppresses Format/Representations/Interpretive statement chrome", () => {
  const page = pageWithMaterial({
    title: "The same rectangle, two multiplier values",
    format:
      "A two-column mathematical comparison identifying quantities that change with the constraint representation and quantities that remain unchanged.",
    representations: {
      simplified_perimeter_constraint: {
        constraint_function: "g(x,y)=x+y",
        constraint_level: "c=10",
        constraint_equation: "x+y=10",
        constraint_gradient: "grad g=(1,1)",
        objective_gradient_at_candidate: "grad A(5,5)=(5,5)",
        multiplier_equation: "(5,5)=lambda(1,1)",
        multiplier_value: "lambda=5",
        verified_vector_equality: "(5,5)=5(1,1)"
      },
      original_perimeter_constraint: {
        constraint_function: "g(x,y)=2x+2y",
        constraint_level: "c=20",
        constraint_equation: "2x+2y=20",
        constraint_gradient: "grad g=(2,2)",
        objective_gradient_at_candidate: "grad A(5,5)=(5,5)",
        multiplier_equation: "(5,5)=lambda(2,2)",
        multiplier_value: "lambda=5/2",
        verified_vector_equality: "(5,5)=(5/2)(2,2)"
      }
    },
    interpretive_statement:
      "The numerical value of lambda depends on the representation of the constraint. It is the scalar relating the gradients for that representation, not an invariant numerical property of the rectangle."
  });
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const html = String(rendered.html || "");
  const block = article(html, "XM-S5-01");
  assertChromeAbsent(block);
  assert.doesNotMatch(visible(block), /\bFormat\b/);
  assert.doesNotMatch(visible(block), /\bRepresentations\b/);
  assert.doesNotMatch(visible(block), /Interpretive statement/i);

  assert.match(block, /Constraint function/);
  assert.match(block, /Multiplier value/);
  assert.match(visible(block), /g\(x,y\)=x\+y/);
  assert.match(visible(block), /g\(x,y\)=2x\+2y/);
  assert.match(visible(block), /lambda=5/);
  assert.match(visible(block), /lambda=5\/2/);
  assert.match(
    visible(block),
    /numerical value of lambda depends on the representation of the constraint/
  );
  assert.doesNotMatch(
    visible(block),
    /A two-column mathematical comparison identifying quantities/
  );
});

test("legitimate mathematical comparison table headings remain visible", () => {
  const page = pageWithMaterial(
    {
      title: "Diagnosing errors in the multiplier calculation",
      columns: [
        "Error category",
        "Affected stage",
        "Representative error",
        "Why incorrect",
        "Correction"
      ],
      rows: [
        {
          "Error category": "Conceptual error",
          "Affected stage": "Checking feasibility",
          "Representative error": "Selecting (6,6) because its area is 36.",
          "Why incorrect": "Perimeter 24 violates the fixed-perimeter restriction.",
          Correction: "Compare only feasible rectangles with x+y=10."
        }
      ]
    },
    "mathematical error-diagnosis matrix"
  );
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const block = article(String(rendered.html || ""), "XM-S5-01");
  assert.match(block, /<th[^>]*>\s*Error category\s*<\/th>/i);
  assert.match(block, /<th[^>]*>\s*Correction\s*<\/th>/i);
  assert.match(visible(block), /Selecting \(6,6\)/);
  assert.match(visible(block), /Compare only feasible rectangles/);
  assertChromeAbsent(block);
});

test("XD EQ8 consolidation guidance discourages restating completed materials", () => {
  const xd = sibling.resolveTemplate("expository_development");
  assert.match(xd, /Final section consolidation \(EQ8\)/i);
  assert.match(xd, /Recurrence should serve a new explanatory purpose/i);
  assert.match(xd, /error-diagnosis table/i);
  assert.match(xd, /one purposeful synthesis and a clear endpoint/i);
});

test("XM and DP guidance cover structured chrome and equation\/unknown counts", () => {
  const xm = sibling.resolveTemplate("expository_materials");
  const xd = sibling.resolveTemplate("expository_development");
  const dp = sibling.resolveTemplate("design_page");
  assert.match(xm, /Do not use production descriptors such as format, representations, or interpretive_statement/i);
  assert.match(
    xm,
    /Structured supporting fields around a table[\s\S]*significance, limits or implications/i
  );
  assert.match(
    xm,
    /introduction, closing, conceptual_distinction, heading or relationship/i
  );
  assert.match(
    xd,
    /Structured supporting fields around a table[\s\S]*significance, limits or implications/i
  );
  assert.match(dp, /three equations in the three unknowns/i);
  assert.match(dp, /Do not treat λ as outside the unknown count/i);
});

test("table text equivalents keep interpretive surplus without restating rows", () => {
  const built = structured.buildExpositionStructuredMaterial(
    {
      material_id: "XM-SURPLUS-01",
      section_id: "S7",
      kind: "comparison table",
      body: {
        title: "Mitigation strategies",
        columns: ["Intervention", "Trade-off"],
        rows: [
          {
            Intervention: "Street trees and vegetation",
            "Trade-off": "Depends on water and maintenance."
          },
          {
            Intervention: "Green roofs",
            "Trade-off": "Benefits differ from street-level shade."
          }
        ],
        text_equivalent:
          "Street trees and vegetation cool through shade and evapotranspiration, but need water and care. Green roofs modify roof energy transfers differently from street trees. Each strategy should be judged against its intended thermal outcome."
      }
    },
    "S7",
    0
  );
  const html = structured.renderExpositionStructuredMaterial(built);
  const accessibleMatch = html.match(
    /data-field="accessible-description"[^>]*>([\s\S]*?)<\/div>/
  );
  assert.ok(accessibleMatch, "expected accessible-description field");
  const accessible = visible(accessibleMatch[1]);
  assert.match(accessible, /Each strategy should be judged against its intended thermal outcome/);
  assert.doesNotMatch(accessible, /Street trees and vegetation cool through shade/);
  assert.doesNotMatch(accessible, /Green roofs modify roof energy transfers/);
  assert.match(html, /<th[^>]*>\s*Intervention\s*<\/th>/i);
});
