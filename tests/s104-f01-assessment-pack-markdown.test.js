/**
 * Sprint 104 F01 — Assessment Pack prose that carries Markdown headings and pipe tables must
 * render semantically (existing renderMarkdownBlock), not as literal "###" / "|---|" text.
 * Plain prose, mathematical notation, accessibility landmarks and the response workspace are
 * unchanged. Works from stored captures (render-time only; no regeneration).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const TABLE_MD =
  "| | Disease present | Disease absent |\n" +
  "|---|---|---|\n" +
  "| Test positive | 90 | 20 |\n" +
  "| Test negative | 10 | 80 |";

const STIMULUS_MD =
  "### Study results\n\n" +
  "A screening test was evaluated in 200 people.\n\n" +
  TABLE_MD +
  "\n\nSensitivity is $\\frac{TP}{TP+FN}$.";

function purpose() {
  return {
    role: "R2",
    visibility_claim: "Whether the learner can interpret diagnostic test results.",
    stop_rationale: "A formative stop.",
    forward_intent: "Carry the interpretation forward."
  };
}

function packPage(elicitationOverrides, packOverrides) {
  const elicitation = Object.assign(
    {
      elicitation_id: "E1",
      order: 1,
      evidence_ask: "Interpret the test results.",
      epistemic_class: "non_determinate",
      instructions: "Read the results, then respond.",
      stimulus: STIMULUS_MD,
      delivery: {
        kind: "constructed_performance",
        prompt: {
          title: "Interpret the results",
          context: "You are reviewing a screening programme.",
          task: "Explain what the sensitivity tells you.",
          response_expectation: "A short explanation.",
          suggested_length: "About 100 words.",
          indicative_time: "5 minutes."
        },
        response_workspace: { intention: "Written explanation", guidance: "Use the table." }
      },
      formative_return: {
        materials: [
          {
            material_id: "criteria-1",
            body: "#### Compare your answer\n\n" + TABLE_MD.replace("90", "95")
          }
        ],
        forward_orientation: "Take your interpretation forward."
      }
    },
    elicitationOverrides || {}
  );
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Diagnostic tests",
    activities: [],
    attempt_instructions: "Read, then respond.",
    assessment_evidence: Object.assign(
      {
        purpose: purpose(),
        learner_context: { depends_on_prior_work: false, bring_forward: [], entry_assumptions: [] },
        elicitations: [elicitation],
        pack_forward_orientation: "Carry this forward."
      },
      packOverrides || {}
    )
  };
}

function render(page) {
  const result = renderLearnerPageHtml(page, { includeRuntimeScripts: false });
  assert.equal(result.error, null, result.error);
  return result.html;
}

function region(html, name) {
  const start = html.indexOf('data-region="' + name + '"');
  if (start < 0) return "";
  return html.slice(start, start + 6000);
}

test("stimulus: Markdown heading and pipe table render as a semantic heading and table", () => {
  const html = render(packPage());
  const stimulus = region(html, "assessment-stimulus");
  assert.ok(stimulus, "stimulus region present");
  assert.match(stimulus, /<h3 class="util-md-heading[^>]*>Study results<\/h3>/);
  assert.match(stimulus, /<table>[\s\S]*<th>Disease present<\/th>[\s\S]*<td>90<\/td>/);
  assert.doesNotMatch(html, /###\s*Study results/);
  assert.doesNotMatch(html, /\|\s*-{3}\s*\|/, "no literal table divider remains");
  assert.doesNotMatch(html, /\|\s*Test positive\s*\|/);
  assert.match(stimulus, /A screening test was evaluated in 200 people\./);
});

test("stimulus: mathematical notation is preserved", () => {
  const html = render(packPage());
  assert.ok(html.includes("\\(\\frac{TP}{TP+FN}\\)"), "inline math delimiters retained");
});

test("formative material: heading and table in a criteria body render semantically", () => {
  const html = render(packPage());
  const formative = region(html, "formative-return");
  assert.ok(formative, "formative return present");
  assert.match(formative, /<h3 class="util-md-heading[^>]*>Compare your answer<\/h3>/);
  assert.match(formative, /<td>95<\/td>/);
  assert.doesNotMatch(html, /####\s*Compare your answer/);
});

test("instruction paragraphs and pack forward text with Markdown headings render semantically", () => {
  const html = render(
    packPage(
      { instructions: "## Before you start\n\nRead the table carefully." },
      { pack_forward_orientation: "### Next steps\n\nCarry this forward." }
    )
  );
  assert.match(html, /<h3 class="util-md-heading[^>]*>Before you start<\/h3>/);
  assert.match(html, /<h3 class="util-md-heading[^>]*>Next steps<\/h3>/);
  assert.doesNotMatch(html, /##\s*Before you start/);
  assert.doesNotMatch(html, /###\s*Next steps/);
});

test("divider-less pipe tables (existing Assessment Pack evidence form) render as tables", () => {
  const html = render(
    packPage({
      stimulus: "Results:\n\n| Group | Count |\n| A | 12 |\n| B | 15 |"
    })
  );
  assert.match(region(html, "assessment-stimulus"), /<table>[\s\S]*<th>Group<\/th>[\s\S]*<td>12<\/td>/);
});

test("plain prose without Markdown structure is unchanged (line breaks kept, text escaped)", () => {
  const html = render(
    packPage({
      stimulus: "Group A: 10 people <b>improved</b>\nGroup B: 12 people improved\n\nSecond paragraph about the study."
    })
  );
  const stimulus = (html.match(/<section[^>]*data-region="assessment-stimulus"[^>]*>[\s\S]*?<\/section>/) || [""])[0];
  assert.ok(stimulus, "prose stimulus section present");
  assert.match(stimulus, /<p>Group A: 10 people &lt;b&gt;improved&lt;\/b&gt;<br>Group B: 12 people improved<\/p>/);
  assert.match(stimulus, /<p>Second paragraph about the study\.<\/p>/);
  assert.doesNotMatch(stimulus, /util-md-heading|<table/);
});

test("response workspace, labels and landmarks are unchanged", () => {
  const html = render(packPage());
  assert.match(html, /<textarea[^>]*id="assessment-constructed-E1"/);
  assert.match(html, /<label[^>]*for="assessment-constructed-E1">Your response<\/label>/);
  assert.match(html, /data-region="assessment-stimulus"/);
  assert.match(html, /data-region="formative-return"/);
  assert.equal((html.match(/<textarea\b/g) || []).length, 1);
});

test("raw HTML in Markdown-structured prose is escaped", () => {
  const html = render(
    packPage({ stimulus: "### Title <script>alert(1)</script>\n\n" + TABLE_MD })
  );
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
});
