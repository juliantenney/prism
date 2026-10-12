/**
 * Sprint 93 — the Planning My Learning Journey capture stores pack forward
 * orientation as an object. Publication reads its learner-facing sentences.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const LEARNER_MESSAGE =
  "You have had an opportunity to reflect on your learning goal, starting point, priorities, practical constraints, learning preferences and open questions. Your responses are your own account of what you want from learning. They have not been scored, interpreted or used to diagnose your learning needs. You can now bring them together into a commissioning brief for your review.";
const REVIEW_GUIDANCE =
  "Before copying, read through your brief and consider whether it represents what you want a future Learning Journey to take into account. You can change any section, add detail or leave information as 'Not stated'. There is no required level of detail and no correctness judgement.";
const NEXT_USE =
  "You can paste your commissioning brief into PRISM's Learning Journey workflow. There, AI-assisted design can use your stated goals, experiences, priorities, circumstances and preferences to propose a learning experience. The proposal is something you can review and revise, not a definitive judgement about your learning needs.";
const LEARNER_AGENCY =
  "The commissioning brief belongs to the learner. Preparing or copying it does not commit the learner to a particular learning pathway, imply that a Learning Journey has already been commissioned, or require acceptance of a future proposal.";
const COMPLETION_MESSAGE =
  "Your commissioning brief is ready for you to review, edit and copy. It records what you have chosen to say about your learning intentions and circumstances, and you remain free to change it.";

function capturedForward() {
  return {
    title: "Your Learning Journey commissioning brief",
    learner_message: LEARNER_MESSAGE,
    primary_action: {
      label: "Prepare commissioning brief",
      description:
        "Assemble your written responses into a document titled 'My Learning Journey commissioning brief', with six clearly labelled sections. Each section contains your corresponding response exactly as written. Any unanswered section displays 'Not stated'.",
      result: "An editable, copyable commissioning brief containing the learner's stated requirements.",
      requirements: [
        "Include the document title 'My Learning Journey commissioning brief'.",
        "Include Learning goal, Starting point, Priorities, Practical constraints, Learning preferences and Open questions in that order.",
        "Populate each section directly from its corresponding constructed response.",
        "Preserve the learner's wording without automatic interpretation, summarisation or diagnosis.",
        "Insert 'Not stated' for every unanswered or empty response.",
        "Allow the learner to prepare the brief even when some or all responses are blank.",
        "Display the assembled brief in an editable text area or equivalent interface.",
        "Do not automatically overwrite edits made to the assembled brief."
      ]
    },
    secondary_action: {
      label: "Copy commissioning brief",
      description: "Copy the complete current version of the assembled brief, including any edits made after preparation.",
      requirements: [
        "Copy the document title and all six labelled sections.",
        "Use the current edited document rather than regenerating the original responses.",
        "Preserve learner-authored wording and any 'Not stated' placeholders that remain.",
        "Do not automatically submit the brief to another workflow."
      ]
    },
    review_guidance: REVIEW_GUIDANCE,
    next_use: NEXT_USE,
    learner_agency: LEARNER_AGENCY,
    completion_message: COMPLETION_MESSAGE
  };
}

function pageWith(forward) {
  const evidence = {
    purpose: {
      role: "R1",
      visibility_claim: "What the learner states they want from the next piece of learning.",
      stop_rationale: "A short stop to gather the brief before anyone designs the next learning.",
      forward_intent: "The learner leaves with a brief they can copy."
    },
    learner_context: { depends_on_prior_work: false },
    elicitations: [
      {
        elicitation_id: "learning_goal",
        order: 1,
        evidence_ask: "State the learning goal.",
        epistemic_class: "non_determinate",
        delivery: {
          kind: "constructed_performance",
          prompt: "What do you want this learning to help you do?",
          response_workspace: { intention: "A short statement in the learner's own words" }
        },
        formative_return: {
          materials: [
            {
              material_id: "learning_goal_reflection",
              body: "Your learning goal is a starting point, not a commitment you cannot change."
            }
          ],
          forward_orientation:
            "Your words will appear in the Learning goal section of your commissioning brief."
        }
      }
    ],
    output_specification: {
      specification_id: "journey-commissioning-brief",
      artefact_title: "My Learning Journey commissioning brief",
      audience: "The learner and the person supporting the commissioning of their Learning Journey.",
      purpose: "Record the learner's stated requirements for a proposed Learning Journey.",
      action_label: "Prepare commissioning brief",
      missing_response_text: "Not stated",
      sections: [
        {
          section_id: "brief_learning_goal",
          order: 1,
          heading: "Learning goal",
          contributions: [
            {
              contribution_id: "learning_goal_response",
              label: "My learning goal and why it matters",
              elicitation_id: "learning_goal",
              response_part: "response_text"
            }
          ]
        }
      ]
    }
  };
  if (forward !== undefined) evidence.pack_forward_orientation = forward;
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Planning My Learning Journey",
    activities: [],
    sections: [],
    assessment_evidence: evidence
  };
}

function codes(result) {
  return result.errors.map(function (error) {
    return error.code;
  });
}

test("the captured Planning forward object assembles and previews its learner sentences", () => {
  const page = pageWith(capturedForward());
  const validated = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(validated.ok, true, JSON.stringify(validated.errors));
  const assembled = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(assembled.ok, true, assembled && assembled.message);
  const rendered = renderLearnerPageHtml(assembled.page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /What to take forward/);
  assert.match(rendered.html, /You have had an opportunity to reflect on your learning goal/);
  assert.match(rendered.html, /Before copying, read through your brief/);
  assert.match(rendered.html, /You can paste your commissioning brief/);
  assert.match(rendered.html, /The commissioning brief belongs to the learner/);
  assert.match(rendered.html, /Your commissioning brief is ready for you to review/);
  assert.match(rendered.html, /data-assessment-assemble="true"/);
  assert.equal(rendered.html.indexOf("Display the assembled brief in an editable text area"), -1);
  assert.equal(rendered.html.indexOf("Summarise this assessment"), -1);
});

test("a string pack forward still publishes and a missing or unreadable one is rejected", () => {
  const sentence = "Use the result to choose what to study next. It does not unlock or block a path.";
  const asString = canonical.validateAssessmentPackCanonicalPage(pageWith(sentence));
  assert.equal(asString.ok, true, JSON.stringify(asString.errors));
  const rendered = renderLearnerPageHtml(pageWith(sentence), { compositionMode: "beats" });
  assert.match(rendered.html, /Use the result to choose what to study next/);

  [undefined, "", "   ", {}, { title: "Your Learning Journey commissioning brief" }, { primary_action: { label: "Prepare" } }].forEach(
    function (value) {
      const result = canonical.validateAssessmentPackCanonicalPage(pageWith(value));
      assert.equal(result.ok, false, JSON.stringify(value));
      assert.ok(codes(result).indexOf("pack_forward_orientation_required") !== -1, JSON.stringify(value));
    }
  );
  const removed = pageWith("kept");
  delete removed.assessment_evidence.pack_forward_orientation;
  const missing = canonical.validateAssessmentPackCanonicalPage(removed);
  assert.ok(codes(missing).indexOf("pack_forward_orientation_required") !== -1);
});
