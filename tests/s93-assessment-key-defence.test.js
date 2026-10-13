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
  assert.match(formativePrompt, /Keep explanatory feedback on the same key as the elicitation/);
  assert.match(designPrompt, /Do not rewrite prompts, options, keys/);
  assert.equal(designPrompt.indexOf("key_defence"), -1);
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
