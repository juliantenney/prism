/**
 * Sprint 101E — Practice selection layout: coherent headings, no Question 15x.
 * Fixtures mirror C3 "Evaluate what multiplier solutions establish" (ZIP 5).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const assessmentInteractive = require("../lib/learner-renderer-vnext/assessment-interactive.js");

function claimSelection(id, title, prompt, correct) {
  return {
    material_id: id,
    material_type: "selection",
    activity_id: "A1",
    title: title,
    body_format: "markdown",
    body: "Choose the judgement that best describes the inference. Check your answer after selecting.",
    selection: {
      form: "single_select",
      prompt: prompt,
      options: [
        { key: "supported", text: "Supported by the stated evidence" },
        { key: "overreach", text: "Conclusion goes beyond the evidence" },
        { key: "insufficient", text: "Insufficient information to judge" }
      ],
      correct_answer: correct,
      feedback: "Explanatory feedback for " + title + "."
    }
  };
}

function c3A1Page() {
  const materials = [
    {
      material_id: "A1-M1",
      material_type: "scenario",
      activity_id: "A1",
      title: "Three mathematical claims to evaluate",
      body_format: "markdown",
      body: "### Claim 1\n\nEvidence and conclusion for evaluation."
    },
    claimSelection(
      "A1-M2",
      "Judge Claim 1",
      "Does Claim 1's conclusion follow from the evidence under the stated regularity condition?",
      "supported"
    ),
    claimSelection(
      "A1-M3",
      "Judge Claim 2",
      "Does Claim 2's conclusion follow from its stated evidence?",
      "overreach"
    ),
    claimSelection(
      "A1-M4",
      "Judge Claim 3",
      "Does Claim 3's conclusion follow from the calculation alone?",
      "overreach"
    ),
    {
      material_id: "A1-M5",
      material_type: "template",
      activity_id: "A1",
      title: "Identify the missing justification",
      body_format: "markdown",
      body: "**Missing justification:**\n\n"
    },
    {
      material_id: "A1-M7",
      material_type: "checklist",
      activity_id: "A1",
      title: "Review the quality of your judgements",
      body_format: "json",
      body: {
        review_mode: "guided_criteria",
        criteria: [
          {
            statement: "Have you distinguished candidates from extrema?",
            why_it_matters: "Logical scope matters.",
            features: [
              { expected: "I judged Claim 1 as candidate identification.", repair: "Re-read Claim 1." }
            ]
          },
          {
            statement: "Have you identified unsupported inferences?",
            why_it_matters: "Truth is not proof.",
            features: [
              { expected: "I named the missing step.", repair: "Name the inference." }
            ]
          }
        ]
      },
      diagnostic_review: {
        covers_response_material_ids: ["A1-M2", "A1-M3", "A1-M4", "A1-M5"]
      }
    }
  ];

  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Evaluate what multiplier solutions establish",
    product_id: "practice",
    page_kind: "practice",
    page_synthesis: {
      overview: { body: "Practice claim judgements.", format: "markdown" }
    },
    activities: [
      {
        activity_id: "A1",
        title: "What do multiplier equations prove?",
        learner_task: "Judge the three claims.",
        expected_output: "Three judgements and a short explanation.",
        activity_preamble: "Use earlier distinctions.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        },
        required_materials: materials.map((m) => ({
          material_id: m.material_id,
          material_type: m.material_type,
          purpose: "Task material",
          specification: "As authored",
          ...(m.diagnostic_review ? { diagnostic_review: m.diagnostic_review } : {}),
          ...(m.material_type === "selection"
            ? {
                response_fulfilment: {
                  kind: "learner_workspace",
                  response_kind: "selection_choose",
                  binds_production_steps: [1]
                }
              }
            : {}),
          ...(m.material_type === "template"
            ? {
                response_fields: [{ label: "Missing justification", input_modality: "text" }],
                response_fulfilment: {
                  kind: "learner_workspace",
                  response_kind: "text_compose",
                  binds_production_steps: [2]
                }
              }
            : {})
        })),
        materials: materials
      }
    ],
    learning_outcomes: [
      { outcome_id: "LO1", statement: "Evaluate multiplier claims." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { id: "orient", function: "framing" },
            { id: "model", function: "worked_thinking" },
            { id: "do", function: "guided_practice" },
            { id: "check", function: "verification" }
          ]
        }
      }
    ],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "design_page"]
    }
  };
}

function renderMomentsHtml(page) {
  const rendered = renderLearnerPageHtml(page, {
    includeRuntimeScripts: true,
    compositionMode: "moments"
  });
  assert.equal(rendered.error, null, rendered.error);
  assert.ok(rendered.html);
  return rendered.html;
}

test("101E layout: Practice selections use material titles, not Question 15x", () => {
  const html = renderMomentsHtml(c3A1Page());

  assert.doesNotMatch(html, /Question\s+15\d/);
  assert.doesNotMatch(html, /util-semantic-icon__label">Question\s+\d+/);
  assert.match(html, /util-practice-selection__title">Judge Claim 1</);
  assert.match(html, /util-practice-selection__title">Judge Claim 2</);
  assert.match(html, /util-practice-selection__title">Judge Claim 3</);
  assert.match(html, /Does Claim 1&#39;s conclusion follow/);
  assert.match(html, /Does Claim 2&#39;s conclusion follow/);
  assert.match(html, /Does Claim 3&#39;s conclusion follow/);
});

test("101E layout: covered selection shells are not orphaned from controls", () => {
  const html = renderMomentsHtml(c3A1Page());

  // Title-only response-composed shells for selection must not appear.
  assert.doesNotMatch(
    html,
    /data-material-type="selection"[^>]*data-response-composed="true"[^>]*>\s*<p class="util-material-heading/
  );

  // Each selection unit keeps title + legend + radios together.
  assert.ok((html.match(/data-practice-selection="true"/g) || []).length >= 3);
  assert.ok((html.match(/type="radio"/g) || []).length >= 9);
  assert.match(html, /data-assessment-check/);
  assert.match(html, /data-guided-review="true"|guided_criteria|Review the quality/);
});

test("101E layout: Assessment Pack still uses Question N when no heading", () => {
  const item = {
    id: "ap-1",
    item_type: "single_answer_mcq",
    stem: "Which option is correct?",
    options: [
      { key: "a", text: "A" },
      { key: "b", text: "B" }
    ],
    correct_answer: "a",
    feedback_note: "A is correct."
  };
  const html = assessmentInteractive.renderAssessmentItem(item, 0);
  assert.match(html, /Question 1/);
  assert.doesNotMatch(html, /util-practice-selection__title/);
});

test("101E layout: Assessment Pack honours explicit heading when provided", () => {
  const item = {
    id: "ap-2",
    item_type: "single_answer_mcq",
    heading: "Item set stem",
    stem: "Choose one.",
    options: [
      { key: "a", text: "A" },
      { key: "b", text: "B" }
    ],
    correct_answer: "b",
    feedback_note: "B."
  };
  const html = assessmentInteractive.renderAssessmentItem(item, 4);
  assert.match(html, /Item set stem/);
  assert.doesNotMatch(html, /Question 5/);
});

test("101E layout: packaged learner HTML fails closed only on invalid selection, not layout", () => {
  const rendered = renderLearnerPageHtml(c3A1Page(), {
    includeRuntimeScripts: true,
    compositionMode: "moments"
  });
  assert.equal(rendered.error, null, rendered.error);
  assert.ok(rendered.html);
  assert.doesNotMatch(rendered.html, /Question\s+15\d/);
  assert.match(rendered.html, /Judge Claim 1/);
});
