/**
 * Sprint 93 — exploratory constructed responses use their authored reflection.
 * Evaluative responses keep the argument-review controls.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const REFLECTION =
  "Your learning goal is a starting point, not a commitment you cannot change. As you review what you have written, consider whether it communicates both what you hope to achieve and why that matters to you.";
const REVISION =
  "If you wish, adjust your statement so it better reflects what you want to achieve or why you want to pursue it.";

function page(elicitations) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Planning My Learning Journey",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "What the learner states they want from the next piece of learning.",
        stop_rationale: "A short stop to gather the brief before anyone designs the next learning.",
        forward_intent: "The learner leaves with a brief they can copy."
      },
      learner_context: { depends_on_prior_work: false },
      elicitations: elicitations,
      pack_forward_orientation: "The brief is yours to edit and copy."
    }
  };
}

function exploratory() {
  return {
    elicitation_id: "learning_goal",
    order: 1,
    evidence_ask: "Elicit the learner's stated learning goal.",
    epistemic_class: "non_determinate",
    delivery: {
      kind: "constructed_performance",
      prompt: "What do you want this learning to help you do, and why does that matter to you?",
      response_workspace: { intention: "A short statement in the learner's own words" }
    },
    formative_return: {
      materials: [{ material_id: "learning_goal_reflection", body: REFLECTION }],
      forward_orientation: "Your words will appear in the Learning goal section of your commissioning brief.",
      revision: { offered: true, prompt: REVISION }
    }
  };
}

function evaluative() {
  return {
    elicitation_id: "E6",
    order: 1,
    evidence_ask: "Elicit a methodological judgement of a causal claim.",
    epistemic_class: "non_determinate",
    delivery: {
      kind: "constructed_performance",
      prompt: "Write a reasoned methodological judgement of the causal claim.",
      response_workspace: { intention: "A sustained written judgement" }
    },
    formative_return: {
      materials: [
        {
          material_id: "c1",
          title: "Self-evaluation: accuracy and restraint of the causal conclusion",
          body: "Have you avoided claiming that the improvement alone establishes a programme effect?"
        },
        {
          material_id: "c2",
          title: "Self-evaluation: plausible rival explanations",
          body: "Have you explained how a rival explanation could influence the scores?"
        },
        {
          material_id: "revise",
          title: "Identify one weakness and revise",
          body: "Return to your written judgement and select one weakness revealed by the criteria."
        }
      ],
      forward_orientation: "Use the uncertainty that remains to consider what additional evidence would matter.",
      revision: {
        offered: true,
        prompt:
          "Identify one weakness in your methodological judgement using the self-evaluation criteria."
      }
    }
  };
}

function htmlFor(elicitation) {
  const rendered = renderLearnerPageHtml(page([elicitation]), { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  return rendered.html.split("<script>")[0];
}

test("a learning-needs inquiry uses the authored reflection and does not demand an argument critique", () => {
  const html = htmlFor(exploratory());
  assert.match(html, /What do you want this learning to help you do/);
  assert.match(html, /Your learning goal is a starting point/);
  assert.match(html, /If you wish, adjust your statement/);
  assert.match(html, /Return to your response/);
  assert.equal(html.indexOf("Compare your work with these criteria"), -1);
  assert.equal(html.indexOf("What is the most important weakness you identified in your argument?"), -1);
  assert.equal(html.indexOf("Revise your written judgement"), -1);
  assert.equal(html.indexOf("weakest part"), -1);
});

test("an evaluative constructed response keeps criteria comparison and argument revision", () => {
  const html = htmlFor(evaluative());
  assert.match(html, /Compare your work with these criteria/);
  assert.match(html, /Identify one weakness and revise/);
  assert.match(html, /What is the most important weakness you identified in your argument\?/);
  assert.match(html, /Revise your written judgement/);
  assert.equal(
    html.indexOf("Identify one weakness in your methodological judgement using the self-evaluation criteria"),
    -1
  );
});
