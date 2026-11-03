/**
 * Assessment Pack structured delivery.stimulus requires evidence[].qualification.
 * Generation prompt, early capture validation, hydration aliases, and diagnostic formatting.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const hydration = require("../lib/learner-renderer-vnext/assessment-evidence-hydration.js");
const {
  renderLearnerPageHtml,
  formatModelErrors
} = require("../lib/learner-renderer-vnext");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function purpose() {
  return {
    role: "R2",
    visibility_claim: "Whether the learner can justify a recommendation from incomplete evidence.",
    stop_rationale: "A formative stop while alternatives are still in view.",
    forward_intent: "Carry the justified recommendation into later self-evaluation."
  };
}

function evidenceItem(id, overrides) {
  return Object.assign(
    {
      id: id,
      heading: id + " heading",
      information: id + " information about the local situation."
    },
    overrides || {}
  );
}

function structuredStimulus(evidenceOverrides) {
  return {
    title: "Independent evidence-informed judgement",
    scenario:
      "A local authority must decide how to manage traffic around a primary school during arrival and departure.",
    alternatives: [
      {
        id: "A",
        label: "A: Maintain existing traffic arrangements",
        description: "Leave current access and parking arrangements unchanged."
      },
      {
        id: "B",
        label: "B: Temporarily restrict vehicle access",
        description: "Close selected streets to through traffic at peak school times."
      }
    ],
    evidence: evidenceOverrides,
    evidence_boundary:
      "The evidence does not determine a single correct option. Justify a recommendation from the particulars supplied."
  };
}

function c5LikeEvidence(qualificationMode) {
  var rows = ["EV1", "EV2", "EV3", "EV4", "EV5"].map(function (id, index) {
    if (qualificationMode === "missing") {
      return evidenceItem(id);
    }
    if (qualificationMode === "empty") {
      return evidenceItem(id, { qualification: "" });
    }
    if (qualificationMode === "alias") {
      return evidenceItem(id, {
        caveat: "Caveat for " + id + ": this source alone does not measure collision risk."
      });
    }
    return evidenceItem(id, {
      qualification:
        "Qualification for " +
        id +
        ": this particular source has a sampling or transfer limit that the learner must weigh."
    });
  });
  return rows;
}

function pageWithStimulus(stimulus) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Independent judgement",
    activities: [],
    attempt_instructions: "Read the case, then record your recommendation.",
    assessment_evidence: {
      purpose: purpose(),
      learner_context: {
        depends_on_prior_work: false,
        bring_forward: [],
        entry_assumptions: []
      },
      elicitations: [
        {
          elicitation_id: "E1",
          order: 1,
          evidence_ask: "Recommend and justify one traffic-management option from the supplied evidence.",
          epistemic_class: "non_determinate",
          instructions: "Use only the scenario, alternatives and evidence below.",
          delivery: {
            kind: "constructed_performance",
            stimulus: stimulus,
            prompt: {
              title: "Independent judgement",
              context: "You are advising the local authority.",
              task: "Recommend one alternative and justify it from the evidence.",
              response_expectation: "A reasoned recommendation with explicit use of the evidence.",
              suggested_length: "About 250 words.",
              indicative_time: "25 minutes."
            },
            response_workspace: {
              intention: "Sustained written judgement",
              guidance: "Name the option and the evidence that most supports it."
            }
          },
          formative_return: {
            materials: [
              {
                material_id: "criteria-1",
                body: "Did you weigh supporting and qualifying information for the option you chose?"
              }
            ],
            forward_orientation: "Take the justified recommendation into later review of your reasoning."
          }
        }
      ],
      pack_forward_orientation: "Carry the justified recommendation forward as your current independent judgement."
    }
  };
}

function pageWithoutStructuredStimulus() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Causal judgement",
    activities: [],
    assessment_evidence: {
      purpose: purpose(),
      learner_context: {
        depends_on_prior_work: false,
        bring_forward: [],
        entry_assumptions: []
      },
      elicitations: [
        {
          elicitation_id: "e2",
          order: 1,
          evidence_ask: "Explain whether the study design can support a causal claim.",
          instructions: "Write from the vignette, not from a memorised definition.",
          stimulus: "A short observational vignette.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write the causal judgement in your own words.",
            response_workspace: {
              intention: "Sustained written judgement",
              guidance: "Name the design and the claim it can and cannot support."
            }
          },
          formative_return: {
            materials: [{ material_id: "criteria", body: "Compare your reasons with the criteria." }],
            forward_orientation: "Use this to see the strength and limit of your causal reasoning."
          }
        }
      ],
      pack_forward_orientation: "Hand this judgement to the next study block as your current reasoning."
    }
  };
}

function stageElicitation(stimulus) {
  return {
    artifact_type: "assessment_evidence_elicitation",
    purpose: purpose(),
    learner_context: {
      depends_on_prior_work: false,
      bring_forward: [],
      entry_assumptions: []
    },
    elicitations: [
      {
        elicitation_id: "E1",
        order: 1,
        evidence_ask: "Recommend one option from the supplied evidence.",
        epistemic_class: "non_determinate",
        delivery: {
          kind: "constructed_performance",
          stimulus: stimulus,
          prompt: "Write your recommendation.",
          response_workspace: { intention: "Sustained written judgement" }
        }
      }
    ]
  };
}

test("generation prompt requires evidence-specific qualification on structured delivery.stimulus", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Independent evidence-informed judgement",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true, built.code || "build failed");
  const elicitationPrompt = built.steps.find(function (step) {
    return step.outputName === "assessment_evidence_elicitation";
  }).promptBody;
  assert.match(elicitationPrompt, /structured delivery\.stimulus/i);
  assert.match(elicitationPrompt, /qualification/);
  assert.match(elicitationPrompt, /does and does not establish/i);
  assert.match(elicitationPrompt, /generic filler/i);
  assert.match(elicitationPrompt, /omit structured delivery\.stimulus entirely/i);
  const designPrompt = built.steps.find(function (step) {
    return step.outputName === "page";
  }).promptBody;
  assert.match(designPrompt, /Do not invent a stimulus/);
});

test("C5-like five evidence items missing qualification fail hydration and render with distinct paths", () => {
  const page = pageWithStimulus(structuredStimulus(c5LikeEvidence("missing")));
  const checked = hydration.validateAssessmentPackStructuredStimuli(page);
  assert.equal(checked.ok, false);
  assert.equal(checked.errors.length, 5);
  checked.errors.forEach(function (error, index) {
    assert.equal(error.code, "assessment_stimulus_invalid");
    assert.match(String(error.path), new RegExp("evidence\\[" + index + "\\]\\.qualification"));
    assert.match(String(error.message), /qualification/i);
  });

  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.html, null);
  const message = String(rendered.error || "");
  assert.match(message, /assessment_evidence\.elicitations\[0\]\.delivery\.stimulus\.evidence\[0\]\.qualification/);
  assert.match(message, /evidence\[4\]\.qualification/);
  assert.ok(
    message.indexOf("Each evidence item needs a qualification.") !==
      message.lastIndexOf("Each evidence item needs a qualification."),
    "expected repeated messages to remain distinguishable by path"
  );
  assert.match(message, /evidence\[0\]\.qualification: Each evidence item needs a qualification/);
});

test("empty-string qualifications fail the same contract", () => {
  const page = pageWithStimulus(structuredStimulus(c5LikeEvidence("empty")));
  const checked = hydration.validateAssessmentPackStructuredStimuli(page);
  assert.equal(checked.ok, false);
  assert.equal(checked.errors.length, 5);
  assert.ok(
    checked.errors.every(function (error) {
      return /qualification/i.test(String(error.path || ""));
    })
  );
});

test("valid evidence-specific qualifications hydrate and render", () => {
  const page = pageWithStimulus(structuredStimulus(c5LikeEvidence("valid")));
  const checked = hydration.validateAssessmentPackStructuredStimuli(page);
  assert.equal(checked.ok, true, JSON.stringify(checked.errors));
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /Qualification for EV1/);
  assert.match(rendered.html, /Qualification for EV5/);
});

test("hydration aliases caveat, limitation, and note satisfy qualification", () => {
  const aliased = pageWithStimulus(structuredStimulus(c5LikeEvidence("alias")));
  assert.equal(hydration.validateAssessmentPackStructuredStimuli(aliased).ok, true);

  const limitation = pageWithStimulus(
    structuredStimulus([
      evidenceItem("EV1", {
        limitation: "Records cover injury collisions only, not near-misses."
      })
    ])
  );
  assert.equal(hydration.validateAssessmentPackStructuredStimuli(limitation).ok, true);

  const note = pageWithStimulus(
    structuredStimulus([
      evidenceItem("EV1", {
        note: "The note addresses one route rather than the full network effect."
      })
    ])
  );
  assert.equal(hydration.validateAssessmentPackStructuredStimuli(note).ok, true);

  const rendered = renderLearnerPageHtml(aliased);
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /Caveat for EV1/);
});

test("Assessment Pack without structured evidence stimulus remains valid", () => {
  const page = pageWithoutStructuredStimulus();
  const checked = hydration.validateAssessmentPackStructuredStimuli(page);
  assert.equal(checked.ok, true, JSON.stringify(checked.errors));
  const rendered = renderLearnerPageHtml(page);
  assert.equal(rendered.error, null, rendered.error);
  assert.match(rendered.html, /A short observational vignette/);
  assert.doesNotMatch(rendered.html, /data-stimulus-kind="structured"/);
});

test("early authoring capture reports evidence paths before preview", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  const workflow = {
    id: "qual-capture",
    name: "Qualification capture",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-elicit",
        title: "Design Evidence Elicitation",
        canonical_step_id: "step_design_evidence_elicitation",
        outputName: "assessment_evidence_elicitation"
      },
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const missingStage = stageElicitation(structuredStimulus(c5LikeEvidence("missing")));
  const rejected = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(missingStage),
    workflow.steps[0],
    workflow
  );
  assert.equal(rejected.ok, false);
  assert.match(String(rejected.message || ""), /elicitations\[0\]\.delivery\.stimulus\.evidence\[0\]\.qualification/);
  assert.match(String(rejected.message || ""), /evidence\[4\]\.qualification/);

  const missingPage = pageWithStimulus(structuredStimulus(c5LikeEvidence("missing")));
  const pageRejected = api.validateAssessmentDesignPageCapture(missingPage);
  assert.equal(pageRejected.ok, false);
  assert.ok(
    (pageRejected.errors || []).some(function (row) {
      return /evidence\[0\]\.qualification/i.test(String(row));
    }),
    JSON.stringify(pageRejected.errors)
  );

  const validStage = stageElicitation(structuredStimulus(c5LikeEvidence("valid")));
  const accepted = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(validStage),
    workflow.steps[0],
    workflow
  );
  assert.equal(accepted.ok, true, accepted.message);
});

test("formatModelErrors includes paths so identical messages are distinguishable", () => {
  const formatted = formatModelErrors([
    {
      code: "assessment_stimulus_invalid",
      message: "Each evidence item needs a qualification.",
      path: "assessment_evidence.elicitations[0].delivery.stimulus.evidence[0].qualification"
    },
    {
      code: "assessment_stimulus_invalid",
      message: "Each evidence item needs a qualification.",
      path: "assessment_evidence.elicitations[0].delivery.stimulus.evidence[1].qualification"
    }
  ]);
  assert.match(formatted, /evidence\[0\]\.qualification: Each evidence item needs a qualification/);
  assert.match(formatted, /evidence\[1\]\.qualification: Each evidence item needs a qualification/);
});

function countMatches(text, pattern) {
  const re = new RegExp(pattern, "g");
  const matches = String(text || "").match(re);
  return matches ? matches.length : 0;
}

function assessmentPackWorkflowWithSteps(steps) {
  return {
    id: "qual-final-prompt",
    name: "Qualification final prompt",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: steps
  };
}

test("stale local_override Design Evidence Elicitation final Copy/Run prompt injects qualification contract", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  const staleBody =
    "You are designing Assessment Pack elicitation. Author the constructed performance. Return JSON only with artifact_type \"assessment_evidence_elicitation\".";
  assert.doesNotMatch(staleBody, /heading, information, qualification/);
  const workflow = assessmentPackWorkflowWithSteps([
    {
      id: "step-elicit",
      title: "Design Evidence Elicitation",
      canonical_step_id: "step_design_evidence_elicitation",
      outputName: "assessment_evidence_elicitation",
      prompt_source_type: "local_override",
      override_prompt_body: staleBody
    }
  ]);
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const resolved = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.equal(resolved.sourceType, "local_override");
  assert.match(String(resolved.text || ""), /heading, information, qualification/);
  assert.match(String(resolved.text || ""), /does and does not establish/i);
  assert.match(String(resolved.text || ""), /generic filler/i);
  assert.match(String(resolved.text || ""), /key_defence/);

  const finalPrompt = api.buildWorkflowStepInstructions(workflow.steps[0], 1, null);
  assert.match(finalPrompt, /heading, information, qualification/);
  assert.match(finalPrompt, /does and does not establish/i);
  assert.match(finalPrompt, /evidence-specific|specific to its evidence item/i);
  assert.match(finalPrompt, /key_defence/);
  assert.equal(workflow.steps[0].prompt_source_type, "local_override");
  assert.equal(workflow.steps[0].override_prompt_body, staleBody);
});

test("seeded elicitation prompt already containing the contract is not duplicated", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Independent evidence-informed judgement",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true, built.code || "build failed");
  const seeded = built.steps.find(function (step) {
    return step.outputName === "assessment_evidence_elicitation";
  }).promptBody;
  assert.match(seeded, /heading, information, qualification/);
  const beforeCount = countMatches(seeded, "heading, information, qualification");
  assert.equal(beforeCount, 1);

  const workflow = assessmentPackWorkflowWithSteps([
    {
      id: "step-elicit",
      title: "Design Evidence Elicitation",
      canonical_step_id: "step_design_evidence_elicitation",
      outputName: "assessment_evidence_elicitation",
      prompt_source_type: "local_override",
      override_prompt_body: seeded
    }
  ]);
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const once = api.resolveStepPromptText(workflow.steps[0], workflow);
  const twice = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.equal(countMatches(once.text, "heading, information, qualification"), 1);
  assert.equal(countMatches(twice.text, "heading, information, qualification"), 1);
  assert.equal(String(once.text || ""), String(twice.text || ""));
});

test("unrelated Assessment Pack steps do not receive the qualification elicitation inject", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  const formativeBody = "Author formative return. Return JSON only.";
  const purposeBody = "Interpret the evidence purpose. Return JSON only.";
  const workflow = assessmentPackWorkflowWithSteps([
    {
      id: "step-purpose",
      title: "Interpret Evidence Purpose",
      canonical_step_id: "step_interpret_evidence_purpose",
      outputName: "assessment_evidence_purpose",
      prompt_source_type: "local_override",
      override_prompt_body: purposeBody
    },
    {
      id: "step-formative",
      title: "Author Formative Return",
      canonical_step_id: "step_author_formative_return",
      outputName: "assessment_formative_return",
      prompt_source_type: "local_override",
      override_prompt_body: formativeBody
    }
  ]);
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const purpose = api.resolveStepPromptText(workflow.steps[0], workflow);
  const formative = api.resolveStepPromptText(workflow.steps[1], workflow);
  assert.doesNotMatch(String(purpose.text || ""), /heading, information, qualification/);
  assert.doesNotMatch(String(formative.text || ""), /heading, information, qualification/);
  assert.match(String(formative.text || ""), /Keep explanatory feedback on the same key/);
});

test("interactive workflows are unchanged by the Assessment Pack qualification ensure", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  const body = "Design an Interactive activity. Return JSON only.";
  const workflow = {
    id: "interactive-control",
    name: "Interactive control",
    product: "interactive",
    ldCreateOutputType: "self_study_resource",
    steps: [
      {
        id: "step-dla",
        title: "Design Learning Activities",
        canonical_step_id: "step_design_evidence_elicitation",
        outputName: "assessment_evidence_elicitation",
        prompt_source_type: "local_override",
        override_prompt_body: body
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const resolved = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.doesNotMatch(String(resolved.text || ""), /heading, information, qualification/);
  assert.doesNotMatch(String(resolved.text || ""), /key_defence/);
});
