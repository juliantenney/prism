/**
 * Sprint 93 — Assessment Pack output specification, slice 1.
 * Validator acceptance and rejection, and omission of the legacy summary control.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const canonical = require("../lib/assessment-pack-canonical.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

function codes(result) {
  return result.errors.map(function (error) {
    return error.code;
  });
}

function purposeBody() {
  return {
    role: "R1",
    visibility_claim: "Which prior concepts still need attention.",
    stop_rationale: "A short stop before the next study block.",
    forward_intent: "Show the learner what to concentrate on next."
  };
}

function determinateElicitation() {
  return {
    elicitation_id: "e1",
    order: 1,
    evidence_ask: "Identify a prior probability.",
    epistemic_class: "determinate",
    delivery: {
      kind: "auto_checkable_items",
      items: [
        {
          item_id: "q1",
          order: 1,
          form: "single_answer_mcq",
          prompt: { stem: "Which statement is a prior?", options: [{ key: "a", text: "Belief before evidence" }] },
          judgement: { correct_answer: "a", auto_checkable: true },
          feedback_note: "A prior is the belief held before the new evidence."
        }
      ]
    },
    formative_return: {
      materials: [{ material_id: "m1", body: "A prior is the belief held before the new evidence." }],
      forward_orientation: "Concentrate on how priors change when evidence arrives."
    }
  };
}

function constructedElicitation(id, order, offered) {
  var formative = {
    materials: [
      {
        material_id: id + "-material",
        body: "Compare your own statement with the question. This is not a mark."
      }
    ],
    forward_orientation: "Use what you wrote as your own statement of this point."
  };
  if (offered) formative.revision = { offered: true, prompt: "Name one change you would make." };
  return {
    elicitation_id: id,
    order: order,
    evidence_ask: "State " + id + " in your own words.",
    epistemic_class: "non_determinate",
    delivery: {
      kind: "constructed_performance",
      prompt: "Write " + id + ".",
      response_workspace: { intention: "A short written statement" }
    },
    formative_return: formative
  };
}

function pageWith(evidence) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "A formative check",
    activities: [],
    sections: [],
    assessment_evidence: evidence
  };
}

function evidence(overrides) {
  return Object.assign(
    {
      purpose: purposeBody(),
      learner_context: { depends_on_prior_work: false },
      elicitations: [determinateElicitation()],
      pack_forward_orientation: "Use the result to choose what to study next. It does not unlock or block a path."
    },
    overrides || {}
  );
}

function briefSpecification() {
  return {
    specification_id: "journey-commissioning-brief",
    artefact_title: "Learning Journey commissioning brief",
    audience: "The person commissioning this learner's Learning Journey",
    purpose: "State the learner's goals, context, constraints, priorities, and open questions.",
    action_label: "Prepare commissioning brief",
    missing_response_text: "Not stated.",
    sections: [
      {
        section_id: "goals",
        order: 1,
        heading: "Intended learning goals",
        contributions: [
          {
            contribution_id: "goals-text",
            label: "Goals",
            elicitation_id: "goals",
            response_part: "response_text"
          }
        ]
      },
      {
        section_id: "context",
        order: 2,
        heading: "Context and prior experience",
        contributions: [
          {
            contribution_id: "context-text",
            label: "Context",
            elicitation_id: "context",
            response_part: "response_text"
          },
          {
            contribution_id: "prior-experience-text",
            label: "Prior experience (self-reported)",
            elicitation_id: "prior_experience",
            response_part: "response_text"
          }
        ]
      }
    ]
  };
}

test("a page without output_specification remains valid", () => {
  const result = canonical.validateAssessmentPackCanonicalPage(pageWith(evidence()));
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test("a commissioning brief and a determinate evidence record are accepted", () => {
  const brief = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [
          constructedElicitation("goals", 1),
          constructedElicitation("context", 2),
          constructedElicitation("prior_experience", 3)
        ],
        output_specification: briefSpecification()
      })
    )
  );
  assert.equal(brief.ok, true, JSON.stringify(brief.errors));

  const record = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [determinateElicitation(), constructedElicitation("E6", 2, true)],
        output_specification: {
          specification_id: "evidence-record",
          artefact_title: "Formative evidence record",
          audience: "The learner",
          purpose: "Record the checked responses and the current written judgement.",
          action_label: "Review your evidence",
          missing_response_text: "Not yet answered.",
          sections: [
            {
              section_id: "checks",
              order: 2,
              heading: "Checked responses",
              contributions: [
                {
                  contribution_id: "q1-selection",
                  label: "Your selection",
                  elicitation_id: "e1",
                  item_id: "q1",
                  response_part: "selected_options"
                },
                {
                  contribution_id: "q1-check",
                  label: "Check",
                  elicitation_id: "e1",
                  item_id: "q1",
                  response_part: "check_result"
                }
              ]
            },
            {
              section_id: "judgement",
              order: 1,
              heading: "Your grade is not a score here",
              contributions: [
                {
                  contribution_id: "judgement-text",
                  label: "Your methodological judgement",
                  elicitation_id: "E6",
                  response_part: "response_text"
                },
                {
                  contribution_id: "judgement-weakness",
                  label: "Weakness you identified",
                  elicitation_id: "E6",
                  response_part: "identified_weakness"
                }
              ]
            }
          ]
        }
      })
    )
  );
  assert.equal(record.ok, true, JSON.stringify(record.errors));
});

test("the same response may appear in two sections", () => {
  const result = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [constructedElicitation("goals", 1)],
        output_specification: {
          specification_id: "repeated-source",
          artefact_title: "Brief",
          audience: "A commissioner",
          purpose: "Repeat the stated goal in two sections.",
          action_label: "Prepare brief",
          missing_response_text: "Not stated.",
          sections: [
            {
              section_id: "one",
              order: 1,
              heading: "Goals",
              contributions: [
                {
                  contribution_id: "goals-a",
                  label: "Goals",
                  elicitation_id: "goals",
                  response_part: "response_text"
                }
              ]
            },
            {
              section_id: "two",
              order: 2,
              heading: "Goals again",
              contributions: [
                {
                  contribution_id: "goals-b",
                  label: "Goals",
                  elicitation_id: "goals",
                  response_part: "response_text"
                }
              ]
            }
          ]
        }
      })
    )
  );
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test("empty, malformed, duplicate, and unsupported specifications fail closed", () => {
  function reject(specification) {
    return canonical.validateAssessmentPackCanonicalPage(
      pageWith(evidence({ output_specification: specification }))
    );
  }

  assert.ok(codes(reject(null)).indexOf("output_specification_invalid") !== -1);
  assert.ok(codes(reject({})).indexOf("output_specification_field_required") !== -1);
  assert.ok(codes(reject({})).indexOf("output_specification_sections_required") !== -1);

  const duplicateIds = reject({
    specification_id: "dup",
    artefact_title: "Record",
    audience: "Learner",
    purpose: "Record the check.",
    action_label: "Review evidence",
    missing_response_text: "Not yet answered.",
    sections: [
      {
        section_id: "checks",
        order: 1,
        heading: "Checks",
        contributions: [
          {
            contribution_id: "same",
            label: "Selection",
            elicitation_id: "e1",
            item_id: "q1",
            response_part: "selected_options"
          },
          {
            contribution_id: "same-again",
            label: "Selection again",
            elicitation_id: "e1",
            item_id: "q1",
            response_part: "selected_options"
          }
        ]
      },
      {
        section_id: "checks",
        order: 1,
        heading: "Checks again",
        contributions: [
          {
            contribution_id: "same",
            label: "Selection",
            elicitation_id: "e1",
            item_id: "q1",
            response_part: "selected_options"
          }
        ]
      }
    ]
  });
  assert.ok(codes(duplicateIds).indexOf("output_duplicate_id") !== -1);
  assert.ok(codes(duplicateIds).indexOf("output_duplicate_order") !== -1);
  assert.ok(codes(duplicateIds).indexOf("output_duplicate_source") !== -1);

  const badRefs = reject({
    specification_id: "refs",
    artefact_title: "Record",
    audience: "Learner",
    purpose: "Record the check.",
    action_label: "Summarise this assessment",
    missing_response_text: "Not yet answered.",
    score: 1,
    sections: [
      {
        section_id: "bad",
        order: 1,
        heading: "Bad references",
        contributions: [
          {
            contribution_id: "missing-elicitation",
            label: "Missing",
            elicitation_id: "no-such",
            response_part: "response_text"
          },
          {
            contribution_id: "missing-item",
            label: "Missing item",
            elicitation_id: "e1",
            response_part: "selected_options"
          },
          {
            contribution_id: "unknown-item",
            label: "Unknown item",
            elicitation_id: "e1",
            item_id: "no-item",
            response_part: "check_result"
          },
          {
            contribution_id: "text-on-item",
            label: "Wrong part",
            elicitation_id: "e1",
            item_id: "q1",
            response_part: "response_text"
          },
          {
            contribution_id: "ordered",
            order: 1,
            label: "Ordered",
            elicitation_id: "e1",
            item_id: "q1",
            response_part: "selected_options"
          }
        ]
      }
    ]
  });
  const badCodes = codes(badRefs);
  assert.ok(badCodes.indexOf("output_elicitation_unknown") !== -1);
  assert.ok(badCodes.indexOf("output_item_required") !== -1);
  assert.ok(badCodes.indexOf("output_item_unknown") !== -1);
  assert.ok(badCodes.indexOf("output_response_part_incompatible") !== -1);
  assert.ok(badCodes.indexOf("output_unsupported_key") !== -1);
  assert.ok(badCodes.indexOf("output_action_label_legacy") !== -1);
  assert.equal(badCodes.indexOf("output_response_part_invalid"), -1);
});

test("check_result and item_id are rejected on constructed responses", () => {
  const result = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [constructedElicitation("E6", 1, false)],
        output_specification: {
          specification_id: "constructed-limits",
          artefact_title: "Judgement",
          audience: "Learner",
          purpose: "Quote the written judgement.",
          action_label: "Review your judgement",
          missing_response_text: "Not yet answered.",
          sections: [
            {
              section_id: "judgement",
              order: 1,
              heading: "Judgement",
              contributions: [
                {
                  contribution_id: "checked-writing",
                  label: "Check",
                  elicitation_id: "E6",
                  item_id: "E6",
                  response_part: "check_result"
                },
                {
                  contribution_id: "weakness",
                  label: "Weakness",
                  elicitation_id: "E6",
                  response_part: "identified_weakness"
                },
                {
                  contribution_id: "not-a-part",
                  label: "Other",
                  elicitation_id: "E6",
                  response_part: "quality_judgement"
                }
              ]
            }
          ]
        }
      })
    )
  );
  const found = codes(result);
  assert.equal(result.ok, false);
  assert.ok(found.indexOf("output_item_forbidden") !== -1);
  assert.ok(found.indexOf("output_response_part_incompatible") !== -1);
  assert.ok(found.indexOf("output_response_part_invalid") !== -1);
});

test("an Assessment Pack page does not emit the legacy summary control", () => {
  const withoutSpec = renderLearnerPageHtml(pageWith(evidence()), { compositionMode: "beats" });
  assert.equal(withoutSpec.error, null, String(withoutSpec.error || ""));
  assert.equal(withoutSpec.html.indexOf("Summarise this assessment"), -1);
  assert.equal(withoutSpec.html.indexOf("data-assessment-review>"), -1);
  assert.equal(withoutSpec.html.indexOf("data-assessment-summary hidden"), -1);

  const endOfPack = renderLearnerPageHtml(
    pageWith(evidence({ delivery_preferences: { feedback_timing: "end_of_pack" } })),
    { compositionMode: "beats" }
  );
  assert.equal(endOfPack.error, null, String(endOfPack.error || ""));
  assert.match(endOfPack.html, /Finish assessment/);
  assert.equal(endOfPack.html.indexOf("Summarise this assessment"), -1);
  assert.equal(endOfPack.html.indexOf("data-assessment-summary hidden"), -1);

  const withSpec = renderLearnerPageHtml(
    pageWith(
      evidence({
        elicitations: [constructedElicitation("goals", 1)],
        output_specification: {
          specification_id: "brief",
          artefact_title: "Brief",
          audience: "A commissioner",
          purpose: "State the goal.",
          action_label: "Prepare commissioning brief",
          missing_response_text: "Not stated.",
          sections: [
            {
              section_id: "goals",
              order: 1,
              heading: "Goals",
              contributions: [
                {
                  contribution_id: "goals-text",
                  label: "Goals",
                  elicitation_id: "goals",
                  response_part: "response_text"
                }
              ]
            }
          ]
        }
      })
    ),
    { compositionMode: "beats" }
  );
  assert.equal(withSpec.error, null, String(withSpec.error || ""));
  assert.equal(withSpec.html.indexOf("Summarise this assessment"), -1);
  assert.match(withSpec.html, /Prepare commissioning brief/);
  assert.match(withSpec.html, /data-assessment-assemble="true"/);
  assert.match(withSpec.html, /Replace with current responses/);
});

test("a legacy self-study assessment still emits its learning-outcome summary", () => {
  const html = renderPage({
    title: "Self-study check",
    pageKind: "interactive",
    header: {},
    orientationSections: [],
    expositionSections: [],
    closingParagraph: "",
    learningOutcomes: [{ id: "LO1", statement: "Identify a prior." }],
    activities: [],
    assessmentPack: null,
    assessment: {
      sectionHeading: "What this assessment checks",
      intent: "formative_check",
      feedbackTiming: "per_component",
      outcomes: [{ id: "LO1", statement: "Identify a prior." }],
      items: [
        {
          item_id: "q1",
          item_type: "single_answer_mcq",
          stem: "Which statement is a prior?",
          options: [
            { key: "a", text: "Belief before evidence" },
            { key: "b", text: "The new data" }
          ],
          correct_answer: "a",
          feedback_note: "A prior is the earlier belief.",
          mapped_learning_outcomes: ["LO1"]
        }
      ]
    },
    studyTips: ""
  });
  assert.match(html, /Summarise this assessment/);
  assert.match(html, /data-assessment-review/);
  assert.match(html, /data-assessment-outcome-index/);
  assert.equal(html.indexOf('data-assessment-product="assessment_pack"'), -1);
});
