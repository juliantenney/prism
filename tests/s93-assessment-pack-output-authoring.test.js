/**
 * Sprint 93 Slice 4 — Assessment Pack Design Page authoring of output_specification.
 * Prompt tests inspect the four existing stage prompts. The page fixture is the
 * contract's commissioning brief, not a live model response.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");
const canonical = require("../lib/assessment-pack-canonical.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");

const BRIEF_FOCUS = [
  "Learning Journey commissioning brief.",
  "The learner should leave with a structured brief they can copy into the existing Learning Journey workflow as the specification.",
  "Collect their learning goal, relevant experience and starting point, priorities they want to address, available time and practical constraints, and preferences and open questions.",
  "The page copies their words. It does not design the journey."
].join(" ");

const FORMATIVE_FOCUS = "Check how well the learner can identify a prior probability before new evidence.";

function build(focus) {
  return family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: focus,
    startingPoint: "topic"
  });
}

function stages(built) {
  return {
    purpose: built.steps[3],
    elicitation: built.steps[4],
    formative: built.steps[5],
    design: built.steps[6]
  };
}

function constructed(id, order, ask, prompt) {
  return {
    elicitation_id: id,
    order: order,
    evidence_ask: ask,
    epistemic_class: "non_determinate",
    delivery: {
      kind: "constructed_performance",
      prompt: prompt,
      response_workspace: { intention: "A short statement in the learner's own words" }
    },
    formative_return: {
      materials: [
        {
          material_id: id + "-review",
          body: "Read what you wrote and check that it says what you mean. This page copies your words and does not interpret them."
        }
      ],
      forward_orientation: "You can edit the assembled brief before you copy it."
    }
  };
}

function contribution(id, label, elicitationId) {
  return {
    contribution_id: id,
    label: label,
    elicitation_id: elicitationId,
    response_part: "response_text"
  };
}

function commissioningBriefPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Learning Journey commissioning brief",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "What the learner states they need from the next piece of learning.",
        stop_rationale: "A short stop to gather the brief before anyone designs the next learning.",
        forward_intent: "The learner leaves with a brief they can copy. The page does not design the journey."
      },
      learner_context: { depends_on_prior_work: false },
      elicitations: [
        constructed("goals", 1, "State the learning goal.", "What do you want this learning to help you do?"),
        constructed("context", 2, "State the starting point.", "What is your starting point for this learning?"),
        constructed(
          "prior_experience",
          3,
          "Report relevant experience.",
          "What relevant experience do you already have?"
        ),
        constructed(
          "constraints",
          4,
          "State time, constraints, and preferences.",
          "What time, practical constraints, and preferences should shape this learning?"
        ),
        constructed("priorities", 5, "State priorities.", "Which priorities do you want this learning to address?"),
        constructed("open_questions", 6, "State open questions.", "What open questions should the next design know about?")
      ],
      pack_forward_orientation: "The brief is yours to edit and copy. It does not design the next piece of learning.",
      output_specification: {
        specification_id: "journey-commissioning-brief",
        artefact_title: "Learning Journey commissioning brief",
        audience: "The person commissioning this learner's Learning Journey",
        purpose:
          "State the learner's goals, context, constraints, priorities, and open questions for a Learning Journey commission.",
        action_label: "Prepare commissioning brief",
        missing_response_text: "Not stated.",
        sections: [
          {
            section_id: "goals",
            order: 1,
            heading: "Intended learning goals",
            contributions: [contribution("goals-text", "Goals", "goals")]
          },
          {
            section_id: "context",
            order: 2,
            heading: "Context and prior experience",
            contributions: [
              contribution("context-text", "Context", "context"),
              contribution("prior-experience-text", "Prior experience (self-reported)", "prior_experience")
            ]
          },
          {
            section_id: "constraints",
            order: 3,
            heading: "Constraints and preferences",
            contributions: [contribution("constraints-text", "Constraints and preferences", "constraints")]
          },
          {
            section_id: "priorities",
            order: 4,
            heading: "Learner-identified priorities",
            contributions: [contribution("priorities-text", "Priorities", "priorities")]
          },
          {
            section_id: "open-questions",
            order: 5,
            heading: "Unanswered questions or missing information",
            contributions: [contribution("open-questions-text", "Open questions", "open_questions")]
          }
        ]
      }
    }
  };
}

function formativePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "A formative check",
    activities: [],
    sections: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Which prior concepts still need attention.",
        stop_rationale: "A short stop before the next study block.",
        forward_intent: "Show the learner what to concentrate on next."
      },
      learner_context: { depends_on_prior_work: false },
      elicitations: [
        {
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
                prompt: {
                  stem: "Which statement is a prior?",
                  options: [{ key: "a", text: "Belief before evidence" }]
                },
                judgement: { correct_answer: "a", auto_checkable: true },
                feedback_note: "A prior is the belief held before the new evidence."
              }
            ]
          },
          formative_return: {
            materials: [{ material_id: "m1", body: "A prior is the belief held before the new evidence." }],
            forward_orientation: "Concentrate on how priors change when evidence arrives."
          }
        }
      ],
      pack_forward_orientation: "Use the result to choose what to study next. It does not unlock or block a path."
    }
  };
}

test("a commissioning-brief commission designs the questions and tells Design Page to emit the specification", () => {
  const built = build(BRIEF_FOCUS);
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  const step = stages(built);
  assert.deepEqual(
    [step.purpose.title, step.elicitation.title, step.formative.title, step.design.title],
    ["Interpret Evidence Purpose", "Design Evidence Elicitation", "Author Formative Return", "Design Page"]
  );
  [step.purpose, step.elicitation, step.formative, step.design].forEach(function (stage) {
    assert.match(stage.promptBody, /design this pack backwards from that artefact/);
    assert.equal(stage.promptBody.indexOf(BRIEF_FOCUS) !== -1, true);
  });
  assert.match(step.purpose.promptBody, /role is R1/);
  assert.match(step.purpose.promptBody, /Do not return output_specification at this stage/);
  assert.match(step.purpose.role, /Name the requested artefact in forward_intent/);
  assert.match(step.elicitation.promptBody, /Do not design a different set of questions and leave the artefact to be attached later/);
  assert.match(step.elicitation.promptBody, /their learning goal/);
  assert.match(step.elicitation.promptBody, /relevant experience and starting point/);
  assert.match(step.elicitation.promptBody, /priorities they want to address/);
  assert.match(step.elicitation.promptBody, /available time and practical constraints/);
  assert.match(step.elicitation.promptBody, /open questions/);
  assert.match(step.elicitation.promptBody, /constructed_performance/);
  assert.match(step.elicitation.promptBody, /no answer key and no check_result/);
  assert.match(step.elicitation.promptBody, /Do not nest them inside evidence_ask/);
  assert.match(step.elicitation.promptBody, /Author no determinate items/);
  assert.match(step.elicitation.promptBody, /Do not use delivery\.kind "auto_checkable_items"/);
  assert.match(step.design.promptBody, /Do not recast a stated requirement as an auto-checkable item/);
  assert.match(step.elicitation.promptBody, /Do not turn self-reported confidence into demonstrated competence/);
  assert.match(step.elicitation.role, /design the performances that collect what it must quote/);
  assert.match(step.formative.promptBody, /must not claim this page has interpreted, diagnosed, or synthesised/);
  assert.match(step.design.promptBody, /Emit assessment_evidence\.output_specification/);
  assert.match(step.design.promptBody, /specification_id, artefact_title, audience, purpose, action_label, missing_response_text, sections/);
  assert.match(step.design.promptBody, /item_id only when response_part is selected_options or check_result/);
  assert.match(step.design.promptBody, /selected_options, check_result, response_text, identified_weakness/);
  assert.match(step.design.promptBody, /acknowledges the gap/);
  assert.match(step.design.promptBody, /Not stated\./);
  assert.match(step.design.promptBody, /Prepare commissioning brief/);
  assert.match(step.design.promptBody, /journey-commissioning-brief/);
  assert.match(step.design.promptBody, /does not write that field/);
  assert.match(step.design.promptBody, /Copy each elicitation\.order number through unchanged/);
  assert.match(step.design.role, /Emit output_specification mapped only to the elicitations already designed/);
  assert.equal(step.design.promptBody.indexOf("Summarise this assessment") !== -1, true);
  assert.match(step.design.promptBody, /must not be "Summarise this assessment"/);
});

test("Design Page guidance requires attempt_instructions as one string", () => {
  [FORMATIVE_FOCUS, BRIEF_FOCUS].forEach(function (focus) {
    const design = stages(build(focus)).design.promptBody;
    assert.match(design, /top-level attempt_instructions/);
    assert.match(design, /That field must be one string/);
    assert.match(design, /Do not use an array/);
    assert.equal(design.indexOf('"attempt_instructions": ['), -1);
    assert.equal(design.indexOf("attempt_instructions\": ["), -1);
  });
  const built = build(FORMATIVE_FOCUS);
  built.steps.forEach(function (step) {
    const body = String(step.promptBody || "");
    assert.equal(body.indexOf("attempt_instructions\": ["), -1);
    assert.equal(body.indexOf('"attempt_instructions": ['), -1);
  });
});

test("a conventional formative commission omits the specification and does not use the brief", () => {
  const built = build(FORMATIVE_FOCUS);
  const step = stages(built);
  assert.match(step.design.promptBody, /omit output_specification/i);
  assert.match(step.design.promptBody, /This commission does not ask for a structured learner-owned artefact/);
  assert.equal(step.design.promptBody.indexOf("Emit assessment_evidence.output_specification"), -1);
  assert.equal(step.design.promptBody.indexOf("journey-commissioning-brief"), -1);
  assert.equal(step.design.promptBody.indexOf("Prepare commissioning brief"), -1);
  assert.equal(step.design.promptBody.indexOf("Learning Journey"), -1);
  assert.equal(step.elicitation.promptBody.indexOf("their learning goal"), -1);
  assert.equal(step.elicitation.promptBody.indexOf("Learning Journey"), -1);
  assert.match(step.elicitation.promptBody, /Author the determinate items specified by planned_component_forms/);
  assert.match(step.elicitation.promptBody, /delivery\.items/);
  assert.match(step.elicitation.promptBody, /Do not put form, prompt, or judgement directly on delivery/);
  assert.match(step.design.promptBody, /Do not invent evidence purpose/);
  assert.match(step.design.role, /Omit output_specification/);
  assert.equal(step.purpose.promptBody.indexOf("Do not return output_specification at this stage"), -1);
});

test("the commissioning-brief page passes the canonical validator and renders the assembly action", () => {
  const page = commissioningBriefPage();
  const validated = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(validated.ok, true, JSON.stringify(validated.errors));
  const rendered = renderLearnerPageHtml(page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  const html = rendered.html;
  assert.match(html, /Prepare commissioning brief/);
  assert.match(html, /data-assessment-assemble="true"/);
  assert.match(html, /What do you want this learning to help you do\?/);
  assert.match(html, /What relevant experience do you already have\?/);
  assert.match(html, /Which priorities do you want this learning to address\?/);
  assert.match(html, /What time, practical constraints, and preferences should shape this learning\?/);
  assert.match(html, /What open questions should the next design know about\?/);
  assert.equal(html.indexOf("Summarise this assessment"), -1);
  page.assessment_evidence.output_specification.sections[0].contributions[0].elicitation_id = "missing";
  const broken = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(broken.ok, false);
  assert.ok(broken.errors.some(function (error) { return error.code === "output_elicitation_unknown"; }));
});

test("a conventional formative page remains valid without an output specification", () => {
  const page = formativePage();
  assert.equal(Object.prototype.hasOwnProperty.call(page.assessment_evidence, "output_specification"), false);
  const validated = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(validated.ok, true, JSON.stringify(validated.errors));
  const rendered = renderLearnerPageHtml(page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, rendered.error);
  assert.equal(rendered.html.indexOf('data-assessment-assemble="true"'), -1);
  assert.equal(rendered.html.indexOf("Summarise this assessment"), -1);
  assert.match(rendered.html, /Which statement is a prior\?/);
});
