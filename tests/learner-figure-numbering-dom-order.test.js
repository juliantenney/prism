"use strict";

/**
 * Regression: figure numbers must follow final assembled DOM order
 * (knowledge-summary before activities), not component invocation order.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const vnext = require("../lib/learner-renderer-vnext");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function activity(id) {
  return {
    activity_id: id,
    title: "Activity " + id,
    learner_task: "Complete the task for " + id + ".",
    expected_output: "A short written response.",
    activity_preamble: "Prepare for " + id + ".",
    required_materials: [
      {
        material_id: id + "-M1",
        type: "text",
        purpose: "Explain",
        specification: "depth_floor:L3"
      }
    ],
    materials: [
      {
        material_id: id + "-M1",
        material_type: "text",
        activity_id: id,
        title: "Text",
        body_format: "markdown",
        body: "Explanatory body for " + id + "."
      }
    ],
    episode_plan: {
      archetype: "understand",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "explanation" },
        { function: "example" },
        { function: "non_example" },
        { function: "misconception_confrontation" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "reflection" },
        { function: "transition" }
      ]
    },
    learning_outcome_ids: ["LO1"],
    mapped_learning_outcomes: ["LO1"],
    grouping: "individual",
    duration_minutes: 10,
    reasoning_orientation: "Focus on relationships."
  };
}

function figureAsset(affordanceId, slot, activityId, label) {
  return {
    asset_id: "asset-" + affordanceId,
    brief_id: "brief-" + affordanceId,
    affordance_id: affordanceId,
    scope: activityId ? "activity" : "page",
    activity_id: activityId,
    visual_slot: slot,
    alt_text: label + "; detailed description follows.",
    detailed_description: label + " detailed instructional description for regression.",
    render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
  };
}

test("figure numbering follows final DOM order: KS then activity figures", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Figure order regression",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: {
      overview: { format: "markdown", body: "Overview body." },
      learning_purpose: { format: "markdown", body: "Purpose body." },
      knowledge_summary: { format: "markdown", body: "Knowledge summary body." },
      study_tips: { format: "markdown", body: "Study tips body." }
    },
    activities: [activity("A1"), activity("A3"), activity("A4")],
    learning_outcomes: [{ outcome_id: "LO1", statement: "Describe a concept." }],
    learning_sequence: {
      sequence_type: "self_directed",
      ordered_activity_ids: ["A1", "A3", "A4"],
      total_duration_minutes: 30
    },
    visual_affordance_schema_version: "38.4",
    visual_affordances: [
      {
        affordance_id: "va-page-ks",
        scope: "page",
        region: "knowledge_summary",
        visual_decision: "generate",
        visual_slot: "knowledge-summary-after-content",
        subject: "Knowledge summary concept map"
      },
      {
        affordance_id: "va-a1-classification",
        scope: "activity",
        activity_id: "A1",
        visual_decision: "generate",
        visual_slot: "materials-entry",
        subject: "Classification figure"
      },
      {
        affordance_id: "va-a3-entry",
        scope: "activity",
        activity_id: "A3",
        visual_decision: "generate",
        visual_slot: "materials-entry",
        subject: "Entry figure"
      },
      {
        affordance_id: "va-a4-replication",
        scope: "activity",
        activity_id: "A4",
        visual_decision: "generate",
        visual_slot: "materials-entry",
        subject: "Replication figure"
      }
    ]
  };

  const manifest = {
    assets: [
      figureAsset(
        "va-page-ks",
        "knowledge-summary-after-content",
        undefined,
        "Knowledge summary concept map"
      ),
      figureAsset("va-a1-classification", "materials-entry", "A1", "Classification figure"),
      figureAsset("va-a3-entry", "materials-entry", "A3", "Entry figure"),
      figureAsset("va-a4-replication", "materials-entry", "A4", "Replication figure")
    ]
  };

  const rendered = vnext.renderLearnerPageHtml(page, { visualAssets: manifest });
  assert.equal(rendered.error, null, rendered.error || "render failed");
  const html = rendered.html;

  const figureLabels = [];
  const re = /data-figure-number="(\d+)"[\s\S]*?<strong>Figure (\d+)\.<\/strong>\s*([^<]+)/g;
  let match;
  while ((match = re.exec(html))) {
    figureLabels.push({
      dataNumber: match[1],
      labelNumber: match[2],
      descriptionStart: match[3].trim()
    });
  }

  assert.equal(figureLabels.length, 4, "expected four substantive figures");
  assert.deepEqual(
    figureLabels.map((f) => f.dataNumber),
    ["1", "2", "3", "4"]
  );
  assert.deepEqual(
    figureLabels.map((f) => f.labelNumber),
    ["1", "2", "3", "4"]
  );
  assert.match(figureLabels[0].descriptionStart, /Knowledge summary concept map/i);
  assert.match(figureLabels[1].descriptionStart, /Classification figure/i);
  assert.match(figureLabels[2].descriptionStart, /Entry figure/i);
  assert.match(figureLabels[3].descriptionStart, /Replication figure/i);

  // Stable description ids and aria-describedby remain intact.
  assert.match(html, /aria-describedby="figure-description-asset-va-page-ks"/);
  assert.match(html, /id="figure-description-asset-va-page-ks"/);

  // Visible labels appear in reading order: Figure 1 before Figure 2 before Figure 3.
  const i1 = html.indexOf("<strong>Figure 1.</strong>");
  const i2 = html.indexOf("<strong>Figure 2.</strong>");
  const i3 = html.indexOf("<strong>Figure 3.</strong>");
  const i4 = html.indexOf("<strong>Figure 4.</strong>");
  assert.ok(i1 >= 0 && i2 > i1 && i3 > i2 && i4 > i3);

  // Knowledge-summary region precedes activities region in final HTML.
  const ksIdx = html.indexOf('data-visual-slot="knowledge-summary-after-content"');
  const actsIdx = html.indexOf('data-region="activities"');
  assert.ok(ksIdx >= 0 && actsIdx > ksIdx);
  assert.ok(html.indexOf('data-figure-number="1"') < actsIdx);
});
