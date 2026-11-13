/**
 * Expository structured materials: scaffold field names must not appear as
 * learner-facing headings; authored content and genuine labels remain.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");
const structured = require("../lib/learner-renderer-vnext/expository-structured-materials.js");

function pageWithSections(sections) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "What Makes a Claim True?",
    activities: [],
    sections: sections,
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

function assertNotChromeHeading(fragment, label) {
  const pattern = new RegExp(
    "<(?:strong|h3|h4|dt|th)[^>]*>\\s*" +
      label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "\\s*</",
    "i"
  );
  assert.doesNotMatch(fragment, pattern, "scaffold chrome published: " + label);
}

test("introduction and closing prose render without schema-field labels", () => {
  const page = pageWithSections([
    {
      section_id: "S2",
      title: "Evidence and inference",
      exposition: "Sources establish different things.",
      materials: [
        {
          material_id: "XM-S2-01",
          kind: "supporting explanation",
          title: "Evidence and inference",
          body: {
            introduction:
              "The distinction between evidence and inference becomes clearer when each source is considered separately.",
            conceptual_distinction:
              "An observation or record provides information. An interpretation assigns meaning to it.",
            closing:
              "Evidence may support, challenge or leave open a proposition."
          }
        }
      ]
    }
  ]);
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const block = article(String(rendered.html || ""), "XM-S2-01");
  ["Introduction", "Conceptual distinction", "Closing"].forEach(function (label) {
    assertNotChromeHeading(block, label);
  });
  const text = visible(block);
  assert.match(text, /distinction between evidence and inference/i);
  assert.match(text, /observation or record provides information/i);
  assert.match(text, /support, challenge or leave open/i);
  // Content appears once each.
  assert.equal(
    (text.match(/distinction between evidence and inference/gi) || []).length,
    1
  );
  assert.equal((text.match(/support, challenge or leave open/gi) || []).length, 1);
});

test("heading values promote to real headings; comparison categories remain", () => {
  const page = pageWithSections([
    {
      section_id: "S4",
      title: "Philosophical approaches",
      exposition: "Three approaches consider different questions about truth.",
      materials: [
        {
          material_id: "XM-S4-01",
          kind: "philosophical comparison",
          title: "Three approaches to truth",
          body: {
            introduction:
              "The philosophical approaches below consider different questions about truth.",
            distinction_from_investigation: {
              heading:
                "A theory of truth is not the same as an investigative procedure",
              theory_of_truth:
                "A philosophical theory of truth addresses what truth is.",
              investigative_procedure:
                "An investigative procedure gathers or evaluates evidence.",
              relationship:
                "Investigative procedures help establish whether a belief is justified."
            },
            closing:
              "The three approaches offer different philosophical perspectives on the same disputed proposition."
          }
        }
      ]
    }
  ]);
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const block = article(String(rendered.html || ""), "XM-S4-01");
  ["Introduction", "Heading", "Relationship", "Closing", "Conceptual distinction"].forEach(
    function (label) {
      assertNotChromeHeading(block, label);
    }
  );
  assert.match(
    block,
    /<h4[^>]*>\s*A theory of truth is not the same as an investigative procedure\s*<\/h4>/i
  );
  assert.match(block, /<dt[^>]*>\s*Theory of truth\s*<\/dt>/i);
  assert.match(block, /<dt[^>]*>\s*Investigative procedure\s*<\/dt>/i);
  const text = visible(block);
  assert.match(text, /philosophical approaches below consider different questions/i);
  assert.match(text, /belief is justified/i);
  assert.match(text, /different philosophical perspectives/i);
  assert.doesNotMatch(block, /<h4[^>]*>\s*Distinction from investigation\s*<\/h4>/i);
});

test("table with complementary explanation keeps table labels and omits scaffold chrome", () => {
  const page = pageWithSections([
    {
      section_id: "S3",
      title: "Evidence kinds",
      exposition: "Compare source types carefully.",
      materials: [
        {
          material_id: "XM-S3-01",
          kind: "evidence comparison table",
          title: "What each source establishes",
          body: {
            introduction: "Read across the rows before drawing a conclusion.",
            columns: ["Source", "What it establishes", "What it does not establish"],
            rows: [
              {
                Source: "Door record at 17:21",
                "What it establishes": "An electronic access event at the Archive Room door.",
                "What it does not establish": "Who was in the wider corridor."
              },
              {
                Source: "Elias Reed note ~17:25",
                "What it establishes": "A written observation near that time.",
                "What it does not establish": "That the door record is false."
              }
            ],
            closing: "The sources constrain different parts of the claim."
          }
        }
      ]
    }
  ]);
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const html = String(rendered.html || "");
  const block = article(html, "XM-S3-01");
  assert.match(block, /<th[^>]*>\s*Source\s*<\/th>/i);
  assert.match(block, /<th[^>]*>\s*What it establishes\s*<\/th>/i);
  assert.match(visible(block), /Door record at 17:21/);
  assert.match(visible(block), /Elias Reed note/);
  assert.match(visible(block), /Read across the rows/);
  assert.match(visible(block), /constrain different parts of the claim/);
  assertNotChromeHeading(block, "Introduction");
  assertNotChromeHeading(block, "Closing");
  // Reading order: intro prose before table, closing after.
  const introHtmlAt = block.indexOf("Read across the rows");
  const tableAt = block.indexOf("<table");
  const closingHtmlAt = block.indexOf("constrain different parts");
  assert.ok(introHtmlAt >= 0 && tableAt >= 0 && closingHtmlAt >= 0);
  assert.ok(introHtmlAt < tableAt, "introduction should precede the table");
  assert.ok(tableAt < closingHtmlAt, "closing should follow the table");
});

test("accessible reading order keeps prose and comparison semantics", () => {
  const built = structured.buildExpositionStructuredMaterial(
    {
      material_id: "XM-ORDER-01",
      section_id: "S1",
      kind: "supporting explanation",
      body: {
        introduction: "First the framing.",
        conceptual_distinction: "Then the distinction.",
        closing: "Finally the carry-forward."
      }
    },
    "S1",
    0
  );
  const html = structured.renderExpositionStructuredMaterial(built);
  assert.ok(html);
  const text = visible(html);
  assert.ok(text.indexOf("First the framing") < text.indexOf("Then the distinction"));
  assert.ok(text.indexOf("Then the distinction") < text.indexOf("Finally the carry-forward"));
  assert.doesNotMatch(html, /<dt[^>]*>\s*Introduction\s*<\/dt>/i);
  assert.doesNotMatch(html, /<dt[^>]*>\s*Closing\s*<\/dt>/i);
});
