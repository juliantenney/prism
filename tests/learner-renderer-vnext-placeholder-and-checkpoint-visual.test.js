"use strict";

/**
 * Regression: placeholder activities outside learning_sequence must not render;
 * activity-scoped assessment-before-checkpoint must emit a hook that can bind an asset.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const vnext = require("../lib/learner-renderer-vnext");

function minimalActivity(id, overrides) {
  return Object.assign(
    {
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
        },
        {
          material_id: id + "-M2",
          type: "checklist",
          purpose: "Verify",
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
        },
        {
          material_id: id + "-M2",
          material_type: "checklist",
          activity_id: id,
          title: "Checklist",
          body_format: "markdown",
          body: "- Check one?\n- Check two?"
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
    },
    overrides || {}
  );
}

function placeholderActivity(id, title) {
  return {
    activity_id: id,
    title: title,
    learner_task: "—",
    expected_output: "—",
    activity_preamble: "—",
    required_materials: [],
    materials: [],
    episode_plan: {
      archetype: "apply",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "criteria_exposition" },
        { function: "worked_thinking" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "revision" },
        { function: "reflection" },
        { function: "transfer" },
        { function: "transition" }
      ]
    },
    learning_outcome_ids: ["LO2"]
  };
}

function basePage(activities, extras) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Placeholder and checkpoint fixture",
      audience: "Learners",
      page_profile: { profile_type: "learner" },
      page_synthesis: {
        overview: { format: "markdown", body: "Overview body." },
        learning_purpose: { format: "markdown", body: "Purpose body." },
        knowledge_summary: { format: "markdown", body: "Knowledge summary body." },
        study_tips: { format: "markdown", body: "Study tips body." }
      },
      activities: activities,
      learning_outcomes: [
        { outcome_id: "LO1", statement: "Describe a concept." },
        { outcome_id: "LO2", statement: "Explain a process." }
      ],
      learning_sequence: {
        sequence_type: "self_directed",
        ordered_activity_ids: ["A1"],
        total_duration_minutes: 10
      },
      visual_affordance_schema_version: "38.4",
      visual_affordances: []
    },
    extras || {}
  );
}

test("placeholder activities outside learning_sequence are omitted", () => {
  const page = basePage([
    minimalActivity("A1"),
    placeholderActivity(
      "A2",
      "Explain how historical materialism accounts for social change..."
    ),
    placeholderActivity("A4", "Compare arguments that support Marx...")
  ]);
  const built = vnext.buildPageModel(page);
  assert.equal(built.ok, true, JSON.stringify(built.errors || [], null, 2));
  assert.deepEqual(
    built.model.activities.map(function (a) {
      return a.id;
    }),
    ["A1"]
  );
  assert.ok(
    built.warnings.some(function (w) {
      return w.code === "PLACEHOLDER_ACTIVITY_OMITTED";
    })
  );
  const html = vnext.renderLearnerPageHtml(page).html;
  assert.doesNotMatch(html, /data-activity-id="A2"/);
  assert.doesNotMatch(html, /data-activity-id="A4"/);
  assert.match(html, /data-activity-id="A1"/);
  assert.doesNotMatch(html, />\s*—\s*</);
});

test("activity-scoped assessment-before-checkpoint renders packaged asset", () => {
  const page = basePage([minimalActivity("A5")], {
    learning_sequence: {
      sequence_type: "self_directed",
      ordered_activity_ids: ["A5"],
      total_duration_minutes: 10
    },
    visual_affordances: [
      {
        affordance_id: "va-A5-judgement-framework-01",
        scope: "activity",
        activity_id: "A5",
        visual_decision: "generate",
        visual_slot: "assessment-before-checkpoint",
        subject: "Evaluating Marx's contemporary relevance",
        preferred_representation: "decision_framework"
      }
    ]
  });
  const manifest = {
    assets: [
      {
        brief_id: "brief-a5",
        affordance_id: "va-A5-judgement-framework-01",
        scope: "activity",
        activity_id: "A5",
        visual_slot: "assessment-before-checkpoint",
        alt_text: "Decision framework showing Evaluating Marx's contemporary relevance.",
        render_source: {
          kind: "path",
          value: "assets/activity-a5-assessment-before-checkpoint.png"
        }
      }
    ]
  };
  const rendered = vnext.renderLearnerPageHtml(page, { visualAssets: manifest });
  assert.equal(rendered.error, null, rendered.error || "render failed");
  assert.match(
    rendered.html,
    /data-visual-slot="assessment-before-checkpoint"/
  );
  assert.match(
    rendered.html,
    /src="assets\/activity-a5-assessment-before-checkpoint\.png"/
  );
  assert.match(rendered.html, /data-material-id="A5-M2"/);
  const checklistIdx = rendered.html.indexOf('data-material-id="A5-M2"');
  const imageIdx = rendered.html.indexOf(
    "assets/activity-a5-assessment-before-checkpoint.png"
  );
  assert.ok(imageIdx >= 0 && imageIdx < checklistIdx);
});
