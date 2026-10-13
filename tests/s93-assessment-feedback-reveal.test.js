/**
 * Assessment Pack formative feedback stays hidden until the learner checks
 * a valid response, or deliberately opens self-review guidance.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

const ANSWER = "The most justified interpretation is B.";
const ILLUSTRATIVE = "An illustrative response would name the missing comparison and stop there.";

function item(id, form, prompt, judgement, note) {
  return {
    item_id: id,
    order: 1,
    form: form,
    prompt: prompt,
    judgement: Object.assign({ auto_checkable: true }, judgement),
    feedback_note: note
  };
}

function elicitation(id, order, epistemic, delivery, materials) {
  return {
    elicitation_id: id,
    order: order,
    evidence_ask: "Show what you can already do with the claim.",
    epistemic_class: epistemic,
    delivery: delivery,
    formative_return: {
      materials: materials,
      forward_orientation: "Use what you noticed in the next task.",
      revision:
        epistemic === "non_determinate"
          ? { offered: true, prompt: "Revise one sentence if the criteria show a gap." }
          : undefined
    }
  };
}

function page() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Spotting Weak Evidence: A Practical Assessment of Workplace Claims",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Whether the learner can judge a workplace claim.",
        stop_rationale: "A short formative stop.",
        forward_intent: "Show what to look for next."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Carry the judgement into the next task.",
      elicitations: [
        elicitation(
          "q1",
          1,
          "determinate",
          {
            kind: "auto_checkable_items",
            items: [
              item(
                "q1",
                "classification",
                {
                  stem: "Classify each claim.",
                  categories: [
                    { id: "weak", label: "Weak evidence" },
                    { id: "strong", label: "Stronger evidence" }
                  ],
                  items: [{ id: "c1", text: "One colleague's impression" }]
                },
                { assignments: { c1: "weak" } },
                "One impression is weak evidence."
              )
            ]
          },
          [{ material_id: "q1-note", body: "Classification feedback stays with the check." }]
        ),
        elicitation(
          "q2",
          2,
          "determinate",
          {
            kind: "auto_checkable_items",
            items: [
              item(
                "q2",
                "single_answer_mcq",
                {
                  stem: "Which interpretation is most justified?",
                  options: [
                    { key: "A", text: "The claim is proven." },
                    { key: "B", text: "The claim is only weakly supported." }
                  ]
                },
                { correct_answer: "B" },
                ANSWER
              )
            ]
          },
          [{ material_id: "q2-note", body: ANSWER }]
        ),
        elicitation(
          "q3",
          3,
          "determinate",
          {
            kind: "auto_checkable_items",
            items: [
              item(
                "q3",
                "multiple_answer_mcq",
                {
                  stem: "Select every weak feature.",
                  options: [
                    { key: "a", text: "A single anecdote" },
                    { key: "b", text: "A comparison group" }
                  ]
                },
                { correct_answers: ["a"] },
                "A single anecdote is weak evidence."
              )
            ]
          },
          [{ material_id: "q3-note", body: "Multiple-answer feedback stays with the check." }]
        ),
        elicitation(
          "q6",
          4,
          "non_determinate",
          {
            kind: "constructed_performance",
            prompt: "Write your own judgement of the workplace claim.",
            response_workspace: {
              intention: "A written judgement",
              guidance: "Name the claim and the limit of the evidence."
            }
          },
          [
            {
              material_id: "criteria",
              title: "Self-evaluation",
              body: "Compare your reasons with the claim and the evidence you can point to."
            },
            {
              material_id: "illustration",
              title: "Illustrative response",
              body: ILLUSTRATIVE
            }
          ]
        )
      ]
    }
  };
}

function withoutConcealedFeedback(html) {
  return String(html || "")
    .replace(/<section hidden data-assessment-explanation="true"[\s\S]*?<\/section>/g, "")
    .replace(/<div id="[^"]+" class="util-assessment-review-region"[\s\S]*$/g, "")
    .replace(/\sdata-assessment-rationale="[^"]*"/g, "");
}

test("determinate explanations and constructed review guidance are hidden on first render", () => {
  const result = renderLearnerPageHtml(page());
  assert.equal(result.error, null, result.error);
  const html = result.html.split("<script>")[0];
  assert.match(html, /data-assessment-form="classification"/);
  assert.match(html, /data-assessment-form="single_answer_mcq"/);
  assert.match(html, /data-assessment-form="multiple_answer_mcq"/);
  assert.match(html, /data-assessment-correct="B"/);
  assert.match(html, /<section hidden data-assessment-explanation="true"/);
  assert.match(html, /data-assessment-rationale="The most justified interpretation is B\."/);
  assert.match(html, /<section hidden data-assessment-explanation="true"[\s\S]*The most justified interpretation is B\./);
  assert.match(html, /data-assessment-result aria-live="polite" hidden><\/div>/);
  assert.doesNotMatch(withoutConcealedFeedback(html), new RegExp(ANSWER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(withoutConcealedFeedback(html), /One impression is weak evidence/);
  assert.doesNotMatch(withoutConcealedFeedback(html), /A single anecdote is weak evidence/);

  const constructed = html.slice(html.indexOf('data-assessment-mode="constructed"'));
  assert.match(constructed, /Review your response/);
  assert.match(constructed, /aria-expanded="false"/);
  assert.match(constructed, /data-assessment-review-region hidden/);
  assert.match(constructed, /Illustrative response/);
  assert.match(constructed, new RegExp(ILLUSTRATIVE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(withoutConcealedFeedback(html), new RegExp(ILLUSTRATIVE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(constructed, /data-assessment-check/);
  assert.match(constructed, /Your response is not marked correct or incorrect/);
});
