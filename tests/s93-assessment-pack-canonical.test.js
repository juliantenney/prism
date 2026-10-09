/**
 * Sprint 93 Gate 10 Slice 1 — Assessment Pack authoring route and canonical validation.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");
const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");

const STAGE_TITLES = [
  "Interpret Evidence Purpose",
  "Design Evidence Elicitation",
  "Author Formative Return",
  "Design Page"
];

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

function determinateItem() {
  return {
    item_id: "q1",
    order: 1,
    form: "single_answer_mcq",
    prompt: { stem: "Which statement is a prior?", options: [{ key: "a", text: "Belief before evidence" }] },
    judgement: { correct_answer: "a", auto_checkable: true },
    feedback_note: "A prior is the belief held before the new evidence."
  };
}

function determinateElicitation() {
  return {
    elicitation_id: "e1",
    order: 1,
    evidence_ask: "Identify a prior probability.",
    epistemic_class: "determinate",
    delivery: { kind: "auto_checkable_items", items: [determinateItem()] },
    formative_return: {
      materials: [{ material_id: "m1", body: "A prior is the belief held before the new evidence." }],
      forward_orientation: "Concentrate on how priors change when evidence arrives."
    }
  };
}

function constructedElicitation() {
  return {
    elicitation_id: "e2",
    order: 1,
    evidence_ask: "Explain whether the study design can support a causal claim.",
    epistemic_class: "non_determinate",
    stimulus: "A short observational vignette.",
    delivery: {
      kind: "constructed_performance",
      prompt: "Write the causal judgement in your own words.",
      response_workspace: { intention: "Sustained written judgement" }
    },
    formative_return: {
      materials: [
        {
          material_id: "m2",
          body: "Compare your reasons with the criteria. More than one careful conclusion can remain open."
        }
      ],
      forward_orientation: "Use this to see the strength and limit of your causal reasoning."
    }
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

test("Assessment Pack routes through the four-stage authoring sequence", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Clinical study design",
    startingPoint: "topic"
  });
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  assert.equal(built.identity.product, "assessment_pack");
  assert.equal(family.promptRouteForWorkflow({ product: "assessment_pack" }), "assessment");
  const titles = built.titles;
  assert.deepEqual(titles.slice(3), STAGE_TITLES);
  assert.deepEqual(
    built.steps.slice(3).map(function (step) {
      return step.outputName;
    }),
    [
      "assessment_evidence_purpose",
      "assessment_evidence_elicitation",
      "assessment_formative_return",
      "page"
    ]
  );
  assert.equal(titles.indexOf("Plan Assessment Evidence"), -1);
  assert.equal(titles.indexOf("Author Assessment Components"), -1);
  const purpose = built.steps[3].promptBody;
  const elicitation = built.steps[4].promptBody;
  const formative = built.steps[5].promptBody;
  const design = built.steps[6].promptBody;
  assert.match(purpose, /Do not return elicitations/);
  assert.match(elicitation, /Epistemic class is frozen/);
  assert.match(elicitation, /Do not return formative_return/);
  assert.match(elicitation, /delivery\.items/);
  assert.match(elicitation, /Do not put form, prompt, or judgement directly on delivery/);
  assert.match(formative, /Do not change it/);
  assert.match(formative, /Do not store that note as formative_return\.feedback_note/);
  assert.match(design, /product_id "assessment_pack"/);
  assert.match(design, /Do not invent evidence purpose/);
  assert.match(design, /delivery\.items\[\]/);
  assert.match(purpose, /runtime AI/);
  assert.match(formative, /does not control the learner/);
  assert.match(purpose, /entry_assumptions/);
  assert.match(elicitation, /not shown to the learner on a determinate unit or on a constructed unit/);
  assert.match(elicitation, /not shown to the learner/);
  assert.match(purpose, /not shown to the learner/);
  assert.match(design, /entry_assumptions/);
  assert.match(design, /evidence_ask/);
  assert.match(design, /design metadata/);
});

test("a canonical determinate page is accepted and a constructed page is accepted", () => {
  const determinate = canonical.validateAssessmentPackCanonicalPage(pageWith(evidence()));
  assert.equal(determinate.ok, true, JSON.stringify(determinate.errors));
  const constructed = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        purpose: Object.assign(purposeBody(), { role: "R2" }),
        elicitations: [constructedElicitation()]
      })
    )
  );
  assert.equal(constructed.ok, true, JSON.stringify(constructed.errors));
});

test("canonical validation rejects incomplete, dishonest, and summative payloads", () => {
  const missing = canonical.validateAssessmentPackCanonicalPage(pageWith(evidence({ elicitations: [] })));
  assert.equal(missing.ok, false);
  assert.ok(codes(missing).indexOf("elicitations_required") !== -1);

  const badClass = pageWith(evidence());
  badClass.assessment_evidence.elicitations[0].epistemic_class = "mixed";
  const classified = canonical.validateAssessmentPackCanonicalPage(badClass);
  assert.ok(codes(classified).indexOf("epistemic_class_invalid") !== -1);

  const unscored = pageWith(evidence());
  delete unscored.assessment_evidence.elicitations[0].delivery.items[0].judgement;
  const noKey = canonical.validateAssessmentPackCanonicalPage(unscored);
  assert.ok(codes(noKey).indexOf("determinate_judgement_missing") !== -1);

  const markedEssay = pageWith(
    evidence({
      elicitations: [
        Object.assign(constructedElicitation(), {
          delivery: {
            kind: "constructed_performance",
            prompt: "Explain the claim.",
            response_workspace: { intention: "Written judgement" },
            judgement: { correct_answer: "only one verdict" }
          }
        })
      ]
    })
  );
  const dishonest = canonical.validateAssessmentPackCanonicalPage(markedEssay);
  assert.ok(codes(dishonest).indexOf("non_determinate_runtime_judgement") !== -1);

  const bareReturn = pageWith(evidence({ elicitations: [constructedElicitation()] }));
  bareReturn.assessment_evidence.elicitations[0].formative_return.materials = [];
  const thin = canonical.validateAssessmentPackCanonicalPage(bareReturn);
  assert.ok(codes(thin).indexOf("self_evaluation_materials_required") !== -1);

  const noForward = pageWith(evidence());
  delete noForward.assessment_evidence.pack_forward_orientation;
  const forward = canonical.validateAssessmentPackCanonicalPage(noForward);
  assert.ok(codes(forward).indexOf("pack_forward_orientation_required") !== -1);

  const graded = pageWith(evidence());
  graded.assessment_evidence.grade = "A";
  const summative = canonical.validateAssessmentPackCanonicalPage(graded);
  assert.ok(codes(summative).indexOf("summative_semantics") !== -1);

  const active = pageWith(evidence());
  active.activities = [{ activity_id: "A1" }];
  const activities = canonical.validateAssessmentPackCanonicalPage(active);
  assert.ok(codes(activities).indexOf("activities_must_be_empty") !== -1);
});

test("commissioning bring-forward is required when declared and preserved on the page", () => {
  const purpose = {
    artifact_type: "assessment_evidence_purpose",
    purpose: purposeBody(),
    learner_context: { depends_on_prior_work: true, bring_forward: [] }
  };
  const missing = canonical.validateEvidencePurposeArtefact(purpose);
  assert.equal(missing.ok, false);
  assert.ok(codes(missing).indexOf("bring_forward_required") !== -1);

  purpose.learner_context.bring_forward = [
    { what: "The learner's earlier causal sketch", how_used: "The checkpoint asks them to extend that sketch." }
  ];
  const accepted = canonical.validateEvidencePurposeArtefact(purpose);
  assert.equal(accepted.ok, true, JSON.stringify(accepted.errors));

  const page = pageWith(
    evidence({
      learner_context: purpose.learner_context,
      purpose: Object.assign(purposeBody(), { role: "R2" }),
      elicitations: [constructedElicitation()]
    })
  );
  const published = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(published.ok, true, JSON.stringify(published.errors));
  assert.equal(
    page.assessment_evidence.learner_context.bring_forward[0].what,
    "The learner's earlier causal sketch"
  );
});

test("formative return cannot reopen a frozen epistemic class", () => {
  const elicitation = {
    artifact_type: "assessment_evidence_elicitation",
    purpose: purposeBody(),
    learner_context: { depends_on_prior_work: false },
    elicitations: [
      {
        elicitation_id: "e2",
        order: 1,
        evidence_ask: constructedElicitation().evidence_ask,
        epistemic_class: "non_determinate",
        delivery: constructedElicitation().delivery
      }
    ]
  };
  const designed = canonical.validateElicitationArtefact(elicitation);
  assert.equal(designed.ok, true, JSON.stringify(designed.errors));

  const tooEarly = JSON.parse(JSON.stringify(elicitation));
  tooEarly.elicitations[0].formative_return = constructedElicitation().formative_return;
  const early = canonical.validateElicitationArtefact(tooEarly);
  assert.ok(codes(early).indexOf("formative_return_too_early") !== -1);

  const returned = {
    artifact_type: "assessment_formative_return",
    purpose: purposeBody(),
    learner_context: { depends_on_prior_work: false },
    pack_forward_orientation: "See what this performance shows about the reasoning.",
    elicitations: [Object.assign(constructedElicitation(), { epistemic_class: "determinate" })]
  };
  const reopened = canonical.validateFormativeReturnArtefact(returned, elicitation);
  assert.equal(reopened.ok, false);
  assert.ok(codes(reopened).indexOf("epistemic_class_reopened") !== -1);
});

function flatDeterminate(id, form, prompt, judgement, note) {
  return {
    elicitation_id: id,
    order: Number(String(id).replace(/\D/g, "")) || 1,
    evidence_ask: "Show the named distinction.",
    epistemic_class: "determinate",
    delivery: {
      kind: "auto_checkable_items",
      form: form,
      prompt: prompt,
      judgement: judgement
    },
    formative_return: {
      feedback_note: note,
      forward_orientation: "Use this result to choose what to look at next."
    }
  };
}

test("flat determinate delivery is rejected until the bounded lift restores items and feedback", () => {
  const page = pageWith(
    evidence({
      elicitations: [
        flatDeterminate(
          "e1",
          "single_answer_mcq",
          { stem: "Pick one.", options: [{ key: "a", text: "Alpha" }, { key: "b", text: "Beta" }] },
          { correct_answer: "a" },
          "Alpha names the concept."
        ),
        flatDeterminate(
          "e2",
          "multiple_answer_mcq",
          { stem: "Pick both.", options: [{ key: "a", text: "One" }, { key: "b", text: "Two" }] },
          { correct_answers: ["a", "b"] },
          "Both features belong."
        ),
        flatDeterminate(
          "e3",
          "ordering",
          { stem: "Order the steps.", items: [{ id: "s2", text: "Second" }, { id: "s1", text: "First" }] },
          { correct_order: ["s1", "s2"] },
          "First comes before second because the second depends on it."
        ),
        flatDeterminate(
          "e4",
          "classification",
          {
            stem: "Classify the item.",
            categories: [{ id: "c1", label: "Design" }],
            items: [{ id: "i1", text: "Cohort" }]
          },
          { assignments: { i1: "c1" } },
          "A cohort is a design, not a result."
        ),
        flatDeterminate(
          "e5",
          "matching",
          {
            stem: "Match the pair.",
            left: [{ id: "l1", text: "Prior" }],
            right: [{ id: "r1", text: "Belief before evidence" }]
          },
          { pairs: { l1: "r1" } },
          "A prior is the belief held before the evidence."
        ),
        constructedElicitation()
      ]
    })
  );

  const raw = canonical.validateAssessmentPackCanonicalPage(page);
  assert.equal(raw.ok, false);
  assert.equal(codes(raw).filter(function (code) { return code === "determinate_judgement_missing"; }).length, 5);
  assert.equal(codes(raw).filter(function (code) { return code === "explanatory_feedback_required"; }).length, 5);
  assert.equal(page.assessment_evidence.elicitations[0].delivery.items, undefined);

  const lifted = canonical.normalizeAssessmentPackCanonicalPage(page);
  assert.equal(lifted.normalizations.length, 5);
  const checked = canonical.validateAssessmentPackCanonicalPage(lifted.page);
  assert.equal(checked.ok, true, JSON.stringify(checked.errors));
  assert.equal(lifted.page.assessment_evidence.elicitations[0].delivery.items[0].form, "single_answer_mcq");
  assert.equal(lifted.page.assessment_evidence.elicitations[0].delivery.items[0].feedback_note, "Alpha names the concept.");
  assert.equal(lifted.page.assessment_evidence.elicitations[0].delivery.items[0].judgement.auto_checkable, true);
  assert.equal(lifted.page.assessment_evidence.elicitations[0].delivery.form, undefined);
  assert.equal(lifted.page.assessment_evidence.elicitations[5].delivery.kind, "constructed_performance");
  assert.equal(lifted.page.assessment_evidence.elicitations[5].delivery.items, undefined);
  assert.equal(page.assessment_evidence.elicitations[0].formative_return.feedback_note, "Alpha names the concept.");

  const published = publish.resolveAssessmentPackPublishPage({ page: page });
  assert.equal(published.ok, true, published.message);
  assert.equal(published.page.assessment_evidence.elicitations[4].delivery.items[0].form, "matching");

  const unanswered = pageWith(
    evidence({
      elicitations: [
        flatDeterminate(
          "e1",
          "single_answer_mcq",
          { stem: "Pick one.", options: [{ key: "a", text: "Alpha" }] },
          {},
          "Alpha names the concept."
        )
      ]
    })
  );
  const unansweredLift = canonical.normalizeAssessmentPackCanonicalPage(unanswered);
  const unansweredCheck = canonical.validateAssessmentPackCanonicalPage(unansweredLift.page);
  assert.equal(unansweredCheck.ok, false);
  assert.ok(codes(unansweredCheck).indexOf("determinate_judgement_missing") !== -1);
  assert.equal(unansweredLift.page.assessment_evidence.elicitations[0].delivery.items[0].judgement.correct_answer, undefined);

  const silent = pageWith(
    evidence({
      elicitations: [
        flatDeterminate(
          "e1",
          "single_answer_mcq",
          { stem: "Pick one.", options: [{ key: "a", text: "Alpha" }] },
          { correct_answer: "a" },
          ""
        )
      ]
    })
  );
  const silentLift = canonical.normalizeAssessmentPackCanonicalPage(silent);
  const silentCheck = canonical.validateAssessmentPackCanonicalPage(silentLift.page);
  assert.equal(silentCheck.ok, false);
  assert.ok(codes(silentCheck).indexOf("explanatory_feedback_required") !== -1);
  assert.equal(silentLift.page.assessment_evidence.elicitations[0].delivery.items[0].feedback_note, undefined);
});

test("structured learner prose renders from semantic keys and unreadable objects fail closed", () => {
  const readable = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        learner_context: {
          depends_on_prior_work: false,
          entry_assumptions: [
            { assumption: "You can distinguish an observed change from a causal claim." },
            { statement: "You have met the main threats to internal validity." }
          ]
        },
        elicitations: [
          Object.assign(constructedElicitation(), {
            delivery: {
              kind: "constructed_performance",
              prompt: { stem: "Write a methodological judgement of the service's causal claim." },
              response_workspace: {
                intention: "Provide a substantial, editable text workspace in which the learner can draft a methodological judgement."
              }
            }
          })
        ]
      })
    )
  );
  assert.equal(readable.ok, true, JSON.stringify(readable.errors));

  const assumptions = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        learner_context: {
          depends_on_prior_work: false,
          entry_assumptions: [{ rationale: "This stop exists so the designer can inspect grasp." }]
        }
      })
    )
  );
  assert.equal(assumptions.ok, false);
  assert.ok(codes(assumptions).indexOf("learner_prose_unreadable") !== -1);
  assert.match(JSON.stringify(assumptions.errors), /entry_assumptions\[0\]/);

  const prompt = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [
          Object.assign(constructedElicitation(), {
            delivery: {
              kind: "constructed_performance",
              prompt: { task: "Elicit an independently constructed methodological judgement." },
              response_workspace: { intention: "Sustained written judgement" }
            }
          })
        ]
      })
    )
  );
  assert.equal(prompt.ok, false);
  assert.ok(codes(prompt).indexOf("learner_prose_unreadable") !== -1);
  assert.match(JSON.stringify(prompt.errors), /delivery\.prompt/);
});

const E6_PROMPT = {
  title: "Your methodological judgement",
  context:
    "A community rehabilitation service introduced a 12-week balance-training programme for older adults at risk of falling. Balance scores improved between baseline and follow-up, and the service concluded that the programme caused the improvement. Participants were not randomly allocated, there was no concurrent comparison group, some participants withdrew, and other changes occurred during the study period. No further numerical results or details about recruitment, withdrawal or concurrent treatments are available.",
  task:
    "Write a reasoned methodological judgement for the rehabilitation service. Evaluate how far its causal claim is justified by the available evidence. Identify and prioritise the rival explanations you consider most consequential, explaining how they could account for the observed improvement. Propose a stronger evaluation design that would be feasible in this clinical setting, and justify how its comparison strategy and methodological safeguards would address the important threats you identified. Explain what uncertainty would remain even if your proposed design were implemented, distinguishing internal-validity limitations from questions about applicability to other populations or settings.",
  response_expectation:
    "Develop a coherent, justified argument rather than a list of methodological terms. You may recommend an experimental or a carefully designed quasi-experimental approach, provided you explain its suitability and limitations. Where the scenario does not supply information, identify the uncertainty rather than inventing study findings.",
  suggested_length: "Approximately 300–450 words, or an equivalently developed response.",
  indicative_time: "8–9 minutes"
};

test("the stored E6 constructed prompt maps and an altered key set does not", () => {
  const stored = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [
          Object.assign(constructedElicitation(), {
            elicitation_id: "E6",
            evidence_ask:
              "Elicit an independently constructed, integrated methodological judgement evaluating the service's causal claim.",
            delivery: {
              kind: "constructed_performance",
              prompt: E6_PROMPT,
              response_workspace: {
                intention:
                  "Provide a substantial, editable text workspace in which the learner can draft a methodological judgement, retain the response for self-evaluation, and revise or extend it after inspecting authored criteria.",
                response_type: "extended_text",
                learner_control: ["Compose an independent methodological judgement."],
                automatic_judgement: false,
                runtime_ai: false,
                scoring: false,
                submission_gate: false
              }
            }
          })
        ]
      })
    )
  );
  assert.equal(stored.ok, true, JSON.stringify(stored.errors));

  const extra = canonical.validateAssessmentPackCanonicalPage(
    pageWith(
      evidence({
        elicitations: [
          Object.assign(constructedElicitation(), {
            delivery: {
              kind: "constructed_performance",
              prompt: Object.assign({ author_note: "Do not show this design note." }, E6_PROMPT),
              response_workspace: { intention: "Sustained written judgement" }
            }
          })
        ]
      })
    )
  );
  assert.equal(extra.ok, false);
  assert.ok(codes(extra).indexOf("learner_prose_unreadable") !== -1);
});
