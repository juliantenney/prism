"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..");
const { renderLearnerPageHtml } = require(path.join(REPO_ROOT, "lib", "learner-renderer-vnext", "index.js"));
const { shouldDeferMaterialToCheck, buildPostAttemptContext } = require(path.join(
  REPO_ROOT,
  "lib",
  "learner-renderer-vnext",
  "compose-generic-moments.js"
));
const { buildSequenceContext } = require(path.join(
  REPO_ROOT,
  "lib",
  "learner-renderer-vnext",
  "compose-sequence-context.js"
));

function buildM6C1EvaluatePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    title: "Diagnose a questionnaire item",
    audience: "First-year social science students",
    page_profile: { profile_type: "learner", learning_time_minutes: 5 },
    learning_outcomes: [
      {
        outcome_id: "LO1",
        statement: "Identify a consequential flaw in a questionnaire item and justify a revision."
      }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { function: "framing" },
            { function: "evaluative_judgement" },
            { function: "verification" }
          ]
        }
      }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "Diagnose and revise one questionnaire item",
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { function: "framing" },
            { function: "evaluative_judgement" },
            { function: "verification" }
          ]
        },
        activity_preamble:
          "Inspect the draft questionnaire item below and judge whether it will yield clear evidence.",
        learner_task:
          "1. Inspect the draft questionnaire item and research context.\n2. Write a concise diagnosis of the main flaw and propose a revised wording with a brief justification.\n3. After completing your independent attempt, compare your diagnosis with the explanatory feedback and refine your response if needed.",
        expected_output:
          "A concise diagnosis naming the principal wording flaw, its likely effect on respondents, and a justified revised item.",
        task_material_decision: {
          separate_inputs_required: true,
          task_input_material_ids: ["A1-M1"]
        },
        evidence_decision: {
          required: true,
          reason: "Learners must inspect the exact draft item wording before diagnosing its flaw.",
          provider_material_ids: ["A1-M1"]
        },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "scenario",
            purpose: "Supply the unannotated draft questionnaire item for independent diagnosis.",
            specification:
              "Present the fictional research context and exact item wording. Keep the evidence unannotated and available before the independent attempt. Do not disclose any diagnosis, preferred interpretation or illustrative revision until the learner has attempted the evaluation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide the exact draft item wording to evaluate.",
              learner_action: "Inspect the draft wording and diagnose its principal flaw.",
              observable_features: ["double-barrelled phrasing", "presupposition"],
              provenance: "system_generated_simulation",
              evidence_layout: "separate_provider",
              disclosure_constraint:
                "Keep the evidence unannotated and available before the independent attempt. Do not disclose any diagnosis, preferred interpretation or illustrative revision until the learner has attempted the evaluation."
            }
          },
          {
            material_id: "A1-M2",
            material_type: "template",
            purpose: "Single editable constructed response workspace for E1.",
            specification: "One editable field labelled 'Your diagnosis and revised item'.",
            response_fields: [
              { label: "Your diagnosis and revised item", input_modality: "text" }
            ],
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose",
              artefact_elicitation_id: "E1",
              allows_partial_exemplar: false
            }
          },
          {
            material_id: "A1-M3",
            material_type: "sample_output",
            purpose: "Post-attempt explanatory feedback and improvement guidance.",
            specification:
              "Reveal after the learner has completed their independent evaluation. Explain why the item is double-barrelled and show an illustrative revision."
          }
        ],
        materials: [
          {
            material_id: "A1-M1",
            material_type: "scenario",
            title: "Draft questionnaire item",
            body: "**Research objective:** Investigate recent participation in organised student clubs.\n\n**Draft item:** *\"How satisfied are you with the accessibility and quality of extracurricular activities at your university?\"*\n\nOptions: Very dissatisfied; Dissatisfied; Neither satisfied nor dissatisfied; Satisfied; Very satisfied."
          },
          {
            material_id: "A1-M2",
            material_type: "template",
            title: "Your response",
            body: "**Your diagnosis and revised item:**\nWrite your diagnosis, its likely effect on respondents, and your revised wording."
          },
          {
            material_id: "A1-M3",
            material_type: "sample_output",
            title: "Explanatory feedback",
            body: "The item is double-barrelled: it combines accessibility and quality into a single satisfaction rating, forcing respondents who experience high quality but poor accessibility to give an ambiguous answer."
          }
        ]
      }
    ],
    learning_sequence: {
      timeline: [
        {
          activity_id: "A1",
          purpose: "Independent diagnosis followed by feedback-informed refinement.",
          learner_study_flow: [
            { step: 1, disclosure: "available_before_attempt", material_ids: ["A1-M1"] },
            { step: 2, disclosure: "initial_attempt", material_ids: ["A1-M1", "A1-M2"] },
            { step: 3, disclosure: "post_attempt", material_ids: ["A1-M3"] },
            {
              step: 4,
              disclosure: "reconsideration",
              material_ids: ["A1-M2"],
              reuse_existing_response: true
            }
          ]
        }
      ]
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"]
    }
  };
}

test("1. Evaluate (framing -> evaluative_judgement -> verification) places A1-M1 evidence in Do before A1-M2 workspace and defers A1-M3 to Check", () => {
  const page = buildM6C1EvaluatePage();
  const rendered = renderLearnerPageHtml(page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  const html = rendered.html;

  const evidencePos = html.indexOf('data-material-id="A1-M1"');
  // The fully consumed template's title-only shell is suppressed (F12); its response
  // workspace (bound to elicitation E1) is the rendered A1-M2 surface.
  const templatePos = html.indexOf('data-response-part-id="E1"');
  const checkHeadingPos = html.indexOf('id="learner-check-a1-heading"');
  const feedbackPos = html.indexOf('data-material-id="A1-M3"');

  assert.ok(evidencePos >= 0, "A1-M1 questionnaire evidence must render");
  assert.ok(templatePos >= 0, "A1-M2 constructed response template must render");
  assert.ok(checkHeadingPos >= 0, "Check your response heading must render");
  assert.ok(feedbackPos >= 0, "A1-M3 explanatory feedback must render");

  assert.ok(
    evidencePos < templatePos,
    "A1-M1 inspectable evidence must appear before the A1-M2 learner workspace during independent performance"
  );
  assert.ok(
    templatePos < checkHeadingPos,
    "A1-M2 learner workspace must appear in Do before Check your response"
  );
  assert.ok(
    checkHeadingPos < feedbackPos,
    "A1-M3 post-attempt explanatory feedback must appear inside Check your response"
  );

  // Confirm A1-M2 is the SOLE editable textarea (no redundant fallback expected_output workspace!)
  const textareaMatches = html.match(/<textarea\b/gi) || [];
  assert.equal(
    textareaMatches.length,
    1,
    "Explicitly fulfilled A1-M2 template must suppress any redundant auto-generated expected_output textarea"
  );
  assert.doesNotMatch(
    html,
    /data-source-id="expected_output"/,
    "No fallback expected_output response surface should be generated when A1-M2 fulfils E1"
  );

  // Confirm A1-M3 is collapsed inside Check your response
  const checkSlice = html.slice(checkHeadingPos);
  assert.match(checkSlice, /<details class="util-composition-reveal[\s\S]*data-material-id="A1-M3"/);
});

test("2. Explicit pre-attempt learning_sequence availability and feedback-prohibition clauses prevent false deferral of data_table/text evidence providers", () => {
  const sourcePage = {
    learning_sequence: {
      timeline: [
        {
          activity_id: "A1",
          learner_study_flow: [
            { step: 1, disclosure: "initial_attempt", material_ids: ["A1-M1", "A1-M2"] },
            { step: 2, disclosure: "post_attempt", material_ids: ["A1-M3"] }
          ]
        }
      ]
    }
  };
  const seqCtx = buildSequenceContext(sourcePage);
  const modelActivity = {
    id: "A1",
    sourceActivity: {
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "data_table",
          purpose: "Initial survey dataset available before independent analysis.",
          specification:
            "Keep the evidence unannotated and available before the independent attempt. Do not disclose any diagnosis, preferred interpretation or illustrative revision until after your initial attempt."
        },
        {
          material_id: "A1-M3",
          material_type: "data_table",
          purpose: "Supplementary sensitivity comparison disclosed after your initial attempt."
        }
      ]
    }
  };
  const deferCtx = buildPostAttemptContext(modelActivity, seqCtx);

  assert.equal(
    shouldDeferMaterialToCheck({ id: "A1-M1", type: "data_table", title: "Survey data", body: "| A | B |\n|---|---|\n| 1 | 2 |" }, deferCtx),
    false,
    "Pre-attempt evidence provider with prohibition clause must NOT defer to Check"
  );
  assert.equal(
    shouldDeferMaterialToCheck({ id: "A1-M3", type: "data_table", title: "Sensitivity table", body: "| A | B |\n|---|---|\n| 1 | 2 |" }, deferCtx),
    true,
    "Post-attempt supplementary evidence MUST still defer to Check"
  );
});
