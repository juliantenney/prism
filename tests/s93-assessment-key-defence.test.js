/**
 * Determinate answer keys must be defensible from the learner-visible evidence
 * before an Assessment Pack elicitation is accepted or a learner page is published.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");
const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const HEDGED =
  "The new process is likely to be a useful improvement for the service.";
const RECORDED =
  "The service log records that the new process was introduced.";
const SCENARIO =
  "A service log records that a new process was introduced. It does not report an evaluation of the process.";

function codes(result) {
  return (result.errors || []).map(function (error) {
    return error.code || error;
  });
}

function purpose() {
  return {
    role: "R2",
    visibility_claim: "Whether the learner can keep a claim within the evidence that is actually available.",
    stop_rationale: "A short formative stop while the evidence is still incomplete.",
    forward_intent: "Show which distinction still needs attention."
  };
}

function forward() {
  return "Use the result to decide what to examine next. It does not unlock or block a path.";
}

function classificationItem(statement, categoryId, note) {
  return {
    item_id: "q1",
    order: 1,
    form: "classification",
    prompt: {
      stem: "Classify each statement using only the service log.",
      categories: [
        { id: "observation", label: "Observation" },
        { id: "claim", label: "Claim" },
        { id: "overclaim", label: "Overclaim" }
      ],
      items: [{ id: "s5", text: statement }]
    },
    judgement: { assignments: { s5: categoryId }, auto_checkable: true },
    auto_checkable: true,
    feedback_note: note
  };
}

function elicitation(id, item, extra) {
  return Object.assign(
    {
      elicitation_id: id,
      order: 1,
      evidence_ask: "Judge the statement from the service log.",
      epistemic_class: "determinate",
      stimulus: SCENARIO,
      delivery: { kind: "auto_checkable_items", items: [item] },
      formative_return: {
        materials: [{ material_id: id + "-m", body: item.feedback_note }],
        forward_orientation: "Look again at what the service log actually records."
      }
    },
    extra || {}
  );
}

function page(elicitations) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Evidence and claims",
    activities: [],
    sections: [],
    attempt_instructions: "Use only the service log.",
    assessment_evidence: {
      purpose: purpose(),
      learner_context: { depends_on_prior_work: false },
      elicitations: elicitations,
      pack_forward_orientation: forward()
    }
  };
}

function ambiguousClassification() {
  return classificationItem(
    HEDGED,
    "claim",
    "The pilot showed a 20% improvement, so this is a claim."
  );
}

function correctedClassification() {
  return classificationItem(
    RECORDED,
    "observation",
    "This statement is an observation. The service log records that the new process was introduced."
  );
}

function contestedSingle() {
  return {
    item_id: "q2",
    order: 1,
    form: "single_answer_mcq",
    prompt: {
      stem: "The note says the waiting time increased. Which reading follows?",
      options: [
        { key: "a", text: "The waiting time increased." },
        { key: "b", text: "The service improved." }
      ]
    },
    judgement: { correct_answer: "a", auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence: "The note says the waiting time increased.",
      resolution: "unambiguous",
      alternatives: [
        {
          id: "b",
          status: "equally_defensible",
          reason: "The note says the waiting time increased."
        }
      ]
    },
    feedback_note: "The note says the waiting time increased."
  };
}

function defendedSingle() {
  return {
    item_id: "q2",
    order: 1,
    form: "single_answer_mcq",
    prompt: {
      stem: "The note says the waiting time increased. Which reading follows?",
      options: [
        { key: "a", text: "The waiting time increased." },
        { key: "b", text: "The note was filed on a Monday." }
      ]
    },
    judgement: { correct_answer: "a", auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence: "The note says the waiting time increased.",
      resolution: "unambiguous",
      alternatives: [
        {
          id: "b",
          status: "less_defensible",
          reason: "The note says the waiting time increased."
        }
      ]
    },
    feedback_note: "The correct answer is A. The note says the waiting time increased."
  };
}

function incompleteMultiple() {
  return {
    item_id: "q3",
    order: 1,
    form: "multiple_answer_mcq",
    prompt: {
      stem: "The note says the waiting time increased and the queue was recorded. Select every statement the note supports.",
      options: [
        { key: "a", text: "The waiting time increased." },
        { key: "b", text: "The queue was recorded." },
        { key: "c", text: "The staff were praised." }
      ]
    },
    judgement: { correct_answers: ["a"], auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence: "The note says the waiting time increased and the queue was recorded.",
      resolution: "unambiguous",
      alternatives: [
        {
          id: "b",
          status: "omitted_but_defensible",
          reason: "The note says the waiting time increased and the queue was recorded."
        }
      ]
    },
    feedback_note: "The note says the waiting time increased."
  };
}

function completeMultiple() {
  return {
    item_id: "q3",
    order: 1,
    form: "multiple_answer_mcq",
    prompt: {
      stem: "The note says the waiting time increased and the queue was recorded. Select every statement the note supports.",
      options: [
        { key: "a", text: "The waiting time increased." },
        { key: "b", text: "The queue was recorded." },
        { key: "c", text: "The staff were praised." }
      ]
    },
    judgement: { correct_answers: ["a", "b"], auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence: "The note says the waiting time increased and the queue was recorded.",
      resolution: "unambiguous",
      alternatives: [
        {
          id: "c",
          status: "less_defensible",
          reason: "The note says the waiting time increased and the queue was recorded."
        }
      ]
    },
    feedback_note:
      "The note says the waiting time increased and the queue was recorded. Praise for the staff is not in the note."
  };
}

function mostJustified() {
  return {
    item_id: "q4",
    order: 1,
    form: "single_answer_mcq",
    prompt: {
      stem: "The note says only that one colleague expected a benefit. Which conclusion is most justified?",
      options: [
        { key: "a", text: "A benefit is possible, and it has not been shown." },
        { key: "b", text: "The benefit has been proven." }
      ]
    },
    judgement: { correct_answer: "a", auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence: "The note says only that one colleague expected a benefit.",
      resolution: "most_justified",
      alternatives: [
        {
          id: "b",
          status: "less_defensible",
          reason: "The note says only that one colleague expected a benefit."
        }
      ]
    },
    feedback_note:
      "The most justified conclusion is A. The note says only that one colleague expected a benefit."
  };
}

function stageElicitation(item) {
  const row = elicitation("e1", item);
  delete row.formative_return;
  return {
    artifact_type: "assessment_evidence_elicitation",
    purpose: purpose(),
    learner_context: { depends_on_prior_work: false },
    elicitations: [row]
  };
}

test("elicitation requires a defence of determinate keys and formative feedback must match", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Workplace claims",
    startingPoint: "topic"
  });
  const elicitationPrompt = built.steps[4].promptBody;
  const formativePrompt = built.steps[5].promptBody;
  const designPrompt = built.steps[6].promptBody;
  assert.match(elicitationPrompt, /key_defence/);
  assert.match(elicitationPrompt, /equally defensible/);
  assert.match(elicitationPrompt, /omitted option the visible evidence also supports/);
  assert.match(elicitationPrompt, /nested category boundary/);
  assert.match(elicitationPrompt, /most justified or best supported conclusion/);
  assert.match(elicitationPrompt, /Supported and Unsupported/);
  assert.match(elicitationPrompt, /unresolved uncontrolled factors/);
  assert.match(formativePrompt, /Keep explanatory feedback on the same key as the elicitation/);
  assert.match(designPrompt, /Do not rewrite prompts, options, keys/);
  assert.equal(designPrompt.indexOf("key_defence"), -1);
});

test("C3-style hedged Supported limitation fails capture until the statement is unambiguous", () => {
  const hedged =
    "The survey found a difference in reported good concentration between the groups, but factors such as sleep, motivation, workload or study environment might also help explain it.";
  const clear =
    "The survey found a difference in reported good concentration between the groups. Sleep, motivation, workload and study environment were not controlled, so alternative explanations remain unresolved.";

  function limitationItem(statement) {
    return {
      item_id: "item_04",
      order: 1,
      form: "classification",
      prompt: {
        stem: "Classify this candidate interpretation of the observational survey.",
        categories: [
          { id: "supported", label: "Supported" },
          { id: "misleading", label: "Misleading" },
          { id: "unsupported", label: "Unsupported" }
        ],
        items: [{ id: "statement_04", text: statement }]
      },
      judgement: { assignments: { statement_04: "supported" }, auto_checkable: true },
      auto_checkable: true,
      key_defence: {
        learner_evidence:
          "The survey reports a group difference and identifies uncontrolled factors. The statement must not invite a soft causal reading.",
        resolution: "unambiguous",
        alternatives: [
          {
            category_id: "misleading",
            status: "less_defensible",
            reason: "The intended reading preserves the observed difference and unresolved limitations."
          },
          {
            category_id: "unsupported",
            status: "less_defensible",
            reason: "The study account supports the unresolved-limitation reading."
          }
        ]
      },
      feedback_note: "The study supports the observed difference and unresolved alternative explanations."
    };
  }

  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/assessment-component-forms.js", "lib/assessment-pack-canonical.js"]
  });
  const workflow = {
    id: "c3-statement-04",
    name: "C3 statement 04",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-elicit",
        title: "Design Evidence Elicitation",
        canonical_step_id: "step_design_evidence_elicitation",
        outputName: "assessment_evidence_elicitation",
        prompt_source_type: "local_override",
        override_prompt_body: "Author the determinate items. Return JSON only."
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const step = workflow.steps[0];
  const live = api.buildWorkflowStepInstructions(step, 1, null);
  assert.match(live, /Supported and Unsupported/);
  assert.match(live, /unresolved uncontrolled factors/);

  function elicitationArtefact(statement) {
    return {
      artifact_type: "assessment_evidence_elicitation",
      purpose: purpose(),
      learner_context: { depends_on_prior_work: false },
      elicitations: [
        elicitation("e0", limitationItem(clear)),
        elicitation("e1", limitationItem(clear)),
        elicitation("e2", limitationItem(clear)),
        elicitation("e3", limitationItem(statement))
      ]
    };
  }

  const rejected = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(elicitationArtefact(hedged)),
    step,
    workflow
  );
  assert.equal(rejected.ok, false);
  assert.match(String(rejected.message || ""), /statement_04/);
  assert.match(String(rejected.message || ""), /hedged statement|defensible/);

  const accepted = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(elicitationArtefact(clear)),
    step,
    workflow
  );
  assert.equal(accepted.ok, true, JSON.stringify(accepted));
});

test("a hedged classification on a nested category boundary is rejected until the statement is revised", () => {
  const ambiguous = page([elicitation("e1", ambiguousClassification())]);
  const checked = canonical.validateAssessmentPackCanonicalPage(ambiguous);
  assert.equal(checked.ok, false);
  assert.ok(codes(checked).indexOf("answer_key_ambiguous") !== -1);
  assert.ok(codes(checked).indexOf("answer_key_invented_evidence") !== -1);

  const swapped = page([
    elicitation("e1", classificationItem(HEDGED, "overclaim", "This statement is an overclaim."))
  ]);
  const stillAmbiguous = canonical.validateAssessmentPackCanonicalPage(swapped);
  assert.ok(codes(stillAmbiguous).indexOf("answer_key_ambiguous") !== -1);

  const staged = canonical.validateElicitationArtefact(stageElicitation(ambiguousClassification()));
  assert.equal(staged.ok, false);
  assert.ok(codes(staged).indexOf("answer_key_ambiguous") !== -1);

  const revised = canonical.validateElicitationArtefact(stageElicitation(correctedClassification()));
  assert.equal(revised.ok, true, JSON.stringify(revised.errors));
});

test("a single-answer item with two defensible options is rejected until the distractor is revised", () => {
  const contested = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e2", contestedSingle())])
  );
  assert.ok(codes(contested).indexOf("answer_key_ambiguous") !== -1);
  const defended = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e2", defendedSingle())])
  );
  assert.equal(defended.ok, true, JSON.stringify(defended.errors));
});

test("a multiple-answer item that omits a defensible option is rejected until the key includes it", () => {
  const omitted = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e3", incompleteMultiple())])
  );
  assert.ok(codes(omitted).indexOf("answer_key_ambiguous") !== -1);
  const included = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e3", completeMultiple())])
  );
  assert.equal(included.ok, true, JSON.stringify(included.errors));
});

function mostUsefulEvidence() {
  return {
    item_id: "d5",
    order: 1,
    form: "single_answer_mcq",
    prompt: {
      stem: "Which additional evidence would be most useful for evaluating that specific claim?",
      options: [
        { key: "a", text: "How long the meeting lasted." },
        { key: "b", text: "Who chaired the meeting." },
        { key: "c", text: "A comparison of the outcome before and after the process." }
      ]
    },
    judgement: { correct_answer: "c", auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence:
        "The claim is about the effect of the process. A comparison of the outcome before and after the process bears on that claim more directly than the other options.",
      resolution: "most_justified",
      alternatives: [
        {
          id: "a",
          status: "less_defensible",
          reason: "How long the meeting lasted does not evaluate the specific claim."
        },
        {
          id: "b",
          status: "less_defensible",
          reason: "Who chaired the meeting does not evaluate the specific claim."
        }
      ]
    },
    feedback_note:
      "The correct answer is C. A comparison of the outcome before and after the process is the evidence that bears on the claim."
  };
}

test("an evidenced item is accepted, including a most-justified conclusion", () => {
  const clear = canonical.validateAssessmentPackCanonicalPage(
    page([
      elicitation("e1", correctedClassification()),
      elicitation("e4", mostJustified())
    ])
  );
  assert.equal(clear.ok, true, JSON.stringify(clear.errors));
  const labelled = canonical.reviewDeterminateKeys(
    page([elicitation("e4", mostJustified())])
  );
  assert.equal(labelled.ok, true, JSON.stringify(labelled.errors));
});

test("comparative best-answer keys pass and most_justified does not excuse an unresolved key", () => {
  const useful = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e5", mostUsefulEvidence())])
  );
  assert.equal(useful.ok, true, JSON.stringify(useful.errors));

  const conclusion = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e4", mostJustified())])
  );
  assert.equal(conclusion.ok, true, JSON.stringify(conclusion.errors));

  const action = mostJustified();
  action.prompt.stem = "Which evidence-gathering action is most appropriate here?";
  const appropriate = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e6", action)])
  );
  assert.equal(appropriate.ok, true, JSON.stringify(appropriate.errors));

  const tied = mostUsefulEvidence();
  tied.key_defence.alternatives[0].status = "equally_defensible";
  const ambiguous = canonical.validateAssessmentPackCanonicalPage(page([elicitation("e5", tied)]));
  assert.equal(ambiguous.ok, false);
  assert.ok(codes(ambiguous).indexOf("answer_key_ambiguous") !== -1);

  const bypass = {
    item_id: "q9",
    order: 1,
    form: "single_answer_mcq",
    prompt: {
      stem: "Which statement does the service log record?",
      options: [
        { key: "a", text: "The process was introduced." },
        { key: "b", text: "The process improved the service." }
      ]
    },
    judgement: { correct_answer: "a", auto_checkable: true },
    auto_checkable: true,
    key_defence: {
      learner_evidence: "The service log records that the new process was introduced.",
      resolution: "most_justified",
      alternatives: [
        {
          id: "b",
          status: "less_defensible",
          reason: "The service log records that the new process was introduced."
        }
      ]
    },
    feedback_note: "The service log records that the new process was introduced."
  };
  const nonComparative = canonical.validateAssessmentPackCanonicalPage(
    page([elicitation("e9", bypass)])
  );
  assert.equal(nonComparative.ok, false);
  assert.match(
    nonComparative.errors.map(function (error) { return error.message; }).join(" "),
    /comparative stem/
  );

  const hedged = classificationItem(
    HEDGED,
    "claim",
    "This statement is a claim because it evaluates the process."
  );
  hedged.prompt.stem = "Which category is most useful for this statement?";
  hedged.key_defence = {
    learner_evidence: "The statement evaluates the process.",
    resolution: "most_justified",
    alternatives: [
      {
        id: "overclaim",
        status: "less_defensible",
        reason: "The new process is likely to be a useful improvement for the service."
      }
    ]
  };
  const escape = canonical.validateAssessmentPackCanonicalPage(page([elicitation("e1", hedged)]));
  assert.equal(escape.ok, false);
  assert.ok(codes(escape).indexOf("answer_key_ambiguous") !== -1);
});

test("flagged determinate items are corrected before a learner page is published", () => {
  const ambiguous = page([
    elicitation("e1", ambiguousClassification()),
    elicitation("e2", contestedSingle()),
    elicitation("e3", incompleteMultiple())
  ]);
  const blocked = publish.resolveAssessmentPackPublishPage({ page: ambiguous });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.code, "assessment_evidence_invalid");
  const blockedRender = renderLearnerPageHtml(ambiguous);
  assert.equal(blockedRender.html, null);

  const corrected = page([
    elicitation("e1", correctedClassification()),
    elicitation("e2", defendedSingle()),
    elicitation("e3", completeMultiple()),
    elicitation("e4", mostJustified())
  ]);
  const published = publish.resolveAssessmentPackPublishPage({ page: corrected });
  assert.equal(published.ok, true, published.message || JSON.stringify(published.errors));
  const rendered = renderLearnerPageHtml(published.page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /The service log records that the new process was introduced/);
  assert.match(html, /This statement is an observation/);
  assert.match(html, /s5:observation/);
  assert.match(html, /Which conclusion is most justified/);
  assert.doesNotMatch(html, /likely to be a useful improvement/);
  assert.doesNotMatch(html, /20%/);
  assert.match(html, /data-assessment-correct-set="a\|b"|data-assessment-correct-set="b\|a"/);
});

test("a stored elicitation prompt and a captured stage output apply the same check", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/assessment-component-forms.js", "lib/assessment-pack-canonical.js"]
  });
  const workflow = {
    id: "key-defence",
    name: "Key defence",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-elicit",
        title: "Design Evidence Elicitation",
        canonical_step_id: "step_design_evidence_elicitation",
        outputName: "assessment_evidence_elicitation",
        prompt_source_type: "local_override",
        override_prompt_body: "Author the determinate items. Return JSON only."
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const live = api.buildWorkflowStepInstructions(workflow.steps[0], 1, null);
  assert.match(live, /key_defence/);
  assert.match(live, /nested category boundary/);

  const step = workflow.steps[0];
  const wf = { product: "assessment_pack" };
  const rejected = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(stageElicitation(ambiguousClassification())),
    step,
    wf
  );
  assert.equal(rejected.ok, false);
  assert.match(String(rejected.message || ""), /hedged statement|defensible/);

  const accepted = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(stageElicitation(correctedClassification())),
    step,
    wf
  );
  assert.equal(accepted.ok, true, JSON.stringify(accepted));

  const designRejected = api.validateAssessmentDesignPageCapture(
    page([elicitation("e1", ambiguousClassification())])
  );
  assert.equal(designRejected.ok, false);
  assert.match(designRejected.errors.join(" "), /hedged statement/);
  const designAccepted = api.validateAssessmentDesignPageCapture(
    page([elicitation("e1", correctedClassification())])
  );
  assert.equal(designAccepted.ok, true, designAccepted.errors.join("; "));
});

function countMatches(text, pattern) {
  const matches = String(text || "").match(new RegExp(pattern, "g"));
  return matches ? matches.length : 0;
}

function assessmentPackElicitationWorkflow(overrideBody) {
  return {
    id: "key-defence-copy",
    name: "Key defence copy",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-elicit",
        title: "Design Evidence Elicitation",
        canonical_step_id: "step_design_evidence_elicitation",
        outputName: "assessment_evidence_elicitation",
        prompt_source_type: "local_override",
        override_prompt_body: overrideBody
      }
    ]
  };
}

const LEGACY_KEY_DEFENCE_ELICITATION =
  "Before returning a determinate item, check the keyed answer against only the scenario, stimulus, stem, options, and statements the learner can see. Consider whether a reasonable informed learner could justify another option, category, order, or pair. For a multiple-answer item, check an omitted option the visible evidence also supports and a selected option the visible evidence does not support. Where that ambiguity is material, revise the stem, the statement, the options, or the category boundaries so one key is defensible, or recast the performance as non-determinate. Do not return a confident key while another answer remains equally defensible. A stem that asks for the most justified or best supported conclusion may keep one key when the other options are less defensible on the visible evidence. Record the check as key_defence on the item with learner_evidence, resolution unambiguous or most_justified, and alternatives whose status is less_defensible. Do not use equally_defensible, omitted_but_defensible, included_without_support, or resolution unresolved. A hedged statement assigned to either side of a nested category boundary, such as claim and overclaim, stays ambiguous until the statement or the categories are revised.";

test("stale local_override with legacy key_defence receives Supported/Unsupported guidance on Copy", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/assessment-component-forms.js", "lib/assessment-pack-canonical.js"]
  });
  const staleBody =
    "You are designing Assessment Pack elicitation.\n" +
    LEGACY_KEY_DEFENCE_ELICITATION +
    "\nReturn JSON only.";
  assert.match(staleBody, /key_defence/);
  assert.doesNotMatch(staleBody, /Supported and Unsupported/);
  assert.doesNotMatch(staleBody, /unresolved uncontrolled factors/);

  const workflow = assessmentPackElicitationWorkflow(staleBody);
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const resolved = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.match(String(resolved.text || ""), /Supported and Unsupported/);
  assert.match(String(resolved.text || ""), /unresolved uncontrolled factors/);
  assert.equal(countMatches(resolved.text, "key_defence"), 1);
  assert.equal(countMatches(resolved.text, "Supported and Unsupported"), 1);

  const finalPrompt = api.buildWorkflowStepInstructions(workflow.steps[0], 1, null);
  assert.match(finalPrompt, /Supported and Unsupported/);
  assert.match(finalPrompt, /unresolved uncontrolled factors/);
  assert.equal(countMatches(finalPrompt, "Supported and Unsupported"), 1);
  assert.equal(workflow.steps[0].override_prompt_body, staleBody);
});

test("incomplete key_defence body without exact legacy paragraph still receives hedge guidance once", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/assessment-component-forms.js", "lib/assessment-pack-canonical.js"]
  });
  const incompleteBody =
    "Author determinate items. Record the check as key_defence on the item. A hedged statement on a nested category boundary stays ambiguous. Return JSON only.";
  assert.match(incompleteBody, /key_defence/);
  assert.doesNotMatch(incompleteBody, /Supported and Unsupported/);

  const workflow = assessmentPackElicitationWorkflow(incompleteBody);
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const once = api.resolveStepPromptText(workflow.steps[0], workflow);
  const twice = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.match(String(once.text || ""), /Supported and Unsupported/);
  assert.match(String(once.text || ""), /unresolved uncontrolled factors/);
  assert.equal(countMatches(once.text, "Supported and Unsupported"), 1);
  assert.equal(countMatches(twice.text, "Supported and Unsupported"), 1);
  assert.equal(String(once.text || ""), String(twice.text || ""));

  const finalOnce = api.buildWorkflowStepInstructions(workflow.steps[0], 1, null);
  const finalTwice = api.buildWorkflowStepInstructions(workflow.steps[0], 1, null);
  assert.equal(countMatches(finalOnce, "Supported and Unsupported"), 1);
  assert.equal(countMatches(finalTwice, "Supported and Unsupported"), 1);
});

test("seeded elicitation prompt with Supported/Unsupported guidance is not duplicated on Copy", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Workplace claims",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true, built.code || "build failed");
  const seeded = built.steps.find(function (step) {
    return step.outputName === "assessment_evidence_elicitation";
  }).promptBody;
  assert.match(seeded, /Supported and Unsupported/);
  assert.match(seeded, /unresolved uncontrolled factors/);
  assert.equal(countMatches(seeded, "Supported and Unsupported"), 1);

  const workflow = assessmentPackElicitationWorkflow(seeded);
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);

  const once = api.resolveStepPromptText(workflow.steps[0], workflow);
  const twice = api.resolveStepPromptText(workflow.steps[0], workflow);
  assert.equal(countMatches(once.text, "Supported and Unsupported"), 1);
  assert.equal(countMatches(twice.text, "Supported and Unsupported"), 1);
  assert.equal(countMatches(once.text, "unresolved uncontrolled factors"), 1);
  assert.equal(String(once.text || ""), String(twice.text || ""));

  const finalPrompt = api.buildWorkflowStepInstructions(workflow.steps[0], 1, null);
  assert.equal(countMatches(finalPrompt, "Supported and Unsupported"), 1);
  assert.equal(countMatches(finalPrompt, "unresolved uncontrolled factors"), 1);
});
