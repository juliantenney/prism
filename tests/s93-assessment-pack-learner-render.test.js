/**
 * Sprint 93 Gate 10 Slice 2 — Assessment Pack learner rendering.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

function purpose(role) {
  return {
    role: role,
    visibility_claim:
      role === "R2"
        ? "Whether the learner can defend a causal judgement."
        : "Which prior concepts still need attention.",
    stop_rationale: "A short formative stop before the next study block.",
    forward_intent: "Show the learner what to concentrate on next."
  };
}

function page(evidence) {
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
      purpose: purpose("R1"),
      learner_context: {
        depends_on_prior_work: true,
        entry_assumptions: ["You have met the idea of a prior."],
        bring_forward: [
          {
            what: "Your earlier note on observational studies.",
            how_used: "Use that note as the case you inspect here."
          }
        ]
      },
      elicitations: [],
      pack_forward_orientation:
        "Carry the result into the next study block. It does not unlock or block a path."
    },
    overrides || {}
  );
}

function render(source) {
  return renderLearnerPageHtml(source, { compositionMode: "beats" });
}

test("canonical assessment evidence hydrates into learner HTML", () => {
  const result = render(
    page(
      evidence({
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
                    options: [
                      { key: "a", text: "Belief before evidence" },
                      { key: "b", text: "The new data" }
                    ]
                  },
                  judgement: { correct_answer: "a", auto_checkable: true },
                  feedback_note: "A prior is the belief held before the new evidence."
                }
              ]
            },
            formative_return: {
              materials: [
                {
                  material_id: "m1",
                  body: "A prior is the belief held before the new evidence."
                }
              ],
              forward_orientation: "Concentrate on how priors change when evidence arrives."
            }
          }
        ]
      })
    )
  );
  assert.equal(result.error, null);
  assert.match(result.html, /What to bring with you/);
  assert.match(result.html, /Your earlier note on observational studies/);
  assert.match(result.html, /Use that note as the case you inspect here/);
  assert.match(result.html, /Which statement is a prior/);
  assert.doesNotMatch(result.html, /Before you begin/);
  assert.doesNotMatch(result.html, /You have met the idea of a prior/);
  assert.doesNotMatch(result.html, /Identify a prior probability/);
  assert.match(result.html, /data-assessment-form="single_answer_mcq"/);
  assert.match(result.html, /data-assessment-check/);
  assert.match(result.html, /What to take forward/);
  assert.match(result.html, /Carry the result into the next study block/);
  assert.doesNotMatch(result.html, /Formative state inspection/);
  assert.doesNotMatch(result.html, /Formative capability evidence/);
  assert.doesNotMatch(result.html, /Which prior concepts still need attention/);
  assert.doesNotMatch(result.html, /What this stop assumes/);
  assert.doesNotMatch(result.html, /\[object Object\]/);
});

test("each supported determinate interaction still checks", () => {
  const result = render(
    page(
      evidence({
        learner_context: { depends_on_prior_work: false },
        elicitations: [
          {
            elicitation_id: "forms",
            order: 1,
            evidence_ask: "Work through each closed check.",
            epistemic_class: "determinate",
            delivery: {
              kind: "auto_checkable_items",
              items: [
                {
                  item_id: "single",
                  order: 1,
                  form: "single_answer_mcq",
                  prompt: {
                    stem: "Pick one.",
                    options: [
                      { key: "a", text: "Alpha" },
                      { key: "b", text: "Beta" }
                    ]
                  },
                  judgement: { correct_answer: "a", auto_checkable: true },
                  feedback_note: "Alpha is the named choice."
                },
                {
                  item_id: "multi",
                  order: 2,
                  form: "multiple_answer_mcq",
                  prompt: {
                    stem: "Pick both.",
                    options: [
                      { key: "a", text: "One" },
                      { key: "b", text: "Two" }
                    ]
                  },
                  judgement: { correct_answers: ["a", "b"], auto_checkable: true },
                  feedback_note: "Both belong."
                },
                {
                  item_id: "order",
                  order: 3,
                  form: "ordering",
                  prompt: {
                    stem: "Order the steps.",
                    items: [
                      { id: "s2", text: "Second" },
                      { id: "s1", text: "First" }
                    ]
                  },
                  judgement: { correct_order: ["s1", "s2"], auto_checkable: true },
                  feedback_note: "First comes before second."
                },
                {
                  item_id: "class",
                  order: 4,
                  form: "classification",
                  prompt: {
                    stem: "Classify the item.",
                    categories: [{ id: "c1", label: "Design" }],
                    items: [{ id: "i1", text: "Cohort" }]
                  },
                  judgement: { assignments: { i1: "c1" }, auto_checkable: true },
                  feedback_note: "A cohort is a design."
                },
                {
                  item_id: "match",
                  order: 5,
                  form: "matching",
                  prompt: {
                    stem: "Match the pair.",
                    left: [{ id: "l1", text: "Prior" }],
                    right: [{ id: "r1", text: "Belief before evidence" }]
                  },
                  judgement: { pairs: { l1: "r1" }, auto_checkable: true },
                  feedback_note: "A prior is that belief."
                }
              ]
            },
            formative_return: {
              materials: [{ material_id: "guide", body: "Use the check result to see what still needs attention." }],
              forward_orientation: "Take the checked result into the next block."
            }
          }
        ]
      })
    )
  );
  assert.equal(result.error, null);
  assert.match(result.html, /data-assessment-form="single_answer_mcq"/);
  assert.match(result.html, /data-assessment-correct="a"/);
  assert.match(result.html, /data-assessment-form="multiple_answer_mcq"/);
  assert.match(result.html, /data-assessment-correct-set="a\|b"/);
  assert.match(result.html, /data-assessment-form="ordering"/);
  assert.match(result.html, /data-assessment-correct-order="s1\|s2"/);
  assert.match(result.html, /data-assessment-form="classification"/);
  assert.match(result.html, /data-assessment-correct-map="i1:c1"/);
  assert.match(result.html, /data-assessment-form="matching"/);
  assert.match(result.html, /data-assessment-correct-map="l1:r1"/);
  assert.equal((result.html.match(/data-assessment-check>/g) || []).length, 5);
});

test("constructed performance is a written response without automated judgement", () => {
  const result = render(
    page(
      evidence({
        purpose: purpose("R2"),
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
              materials: [
                {
                  material_id: "criteria",
                  title: "Self-evaluation",
                  body: "Compare your reasons with the criteria. More than one careful conclusion can remain open."
                }
              ],
              forward_orientation: "Use this to see the strength and limit of your causal reasoning.",
              revision: { offered: true, prompt: "Revise the sentence that states the claim." }
            }
          }
        ],
        pack_forward_orientation: "Hand this judgement to the next study block as your current reasoning."
      })
    )
  );
  assert.equal(result.error, null);
  const html = result.html;
  assert.match(html, /A short observational vignette/);
  assert.match(html, /Write the causal judgement in your own words/);
  assert.match(html, /data-workspace-kind="text_entry"/);
  assert.match(html, /Your response/);
  assert.match(html, /Name the design and the claim it can and cannot support/);
  assert.match(html, /<textarea /);
  assert.match(html, /data-assessment-judgement="none"/);
  assert.match(html, /data-auto-checkable="false"/);
  assert.match(html, /Compare your reasons with the criteria/);
  assert.match(html, /Your response is not marked correct or incorrect/);
  assert.match(html, /Revise the sentence that states the claim/);
  assert.match(html, /Hand this judgement to the next study block/);
  assert.match(html, /Your earlier note on observational studies/);
  assert.doesNotMatch(html, /Formative capability evidence/);
  assert.doesNotMatch(html, /Sustained written judgement/);
  assert.doesNotMatch(html, /Explain whether the study design can support a causal claim/);
  assert.doesNotMatch(html, /Whether the learner can defend a causal judgement/);
  assert.doesNotMatch(html, /This stop/);
  assert.doesNotMatch(html.split("<script>")[0], /data-assessment-check[>= ]/);
  assert.doesNotMatch(html, /data-assessment-correct=/);
  assert.doesNotMatch(html, /\bgrade\b/i);
  assert.doesNotMatch(html, /pass\/fail/i);
});

test("invalid canonical payloads do not render a learner page", () => {
  const missing = render(page(evidence({ elicitations: [] })));
  assert.equal(missing.html, null);
  assert.match(missing.error, /At least one elicitation is required/);

  const graded = render(
    page(
      evidence({
        learner_context: { depends_on_prior_work: false },
        grade: "A",
        elicitations: [
          {
            elicitation_id: "e1",
            order: 1,
            evidence_ask: "Identify a prior.",
            epistemic_class: "determinate",
            delivery: {
              kind: "auto_checkable_items",
              items: [
                {
                  item_id: "q1",
                  order: 1,
                  form: "single_answer_mcq",
                  prompt: {
                    stem: "Which is a prior?",
                    options: [{ key: "a", text: "Belief" }]
                  },
                  judgement: { correct_answer: "a", auto_checkable: true },
                  feedback_note: "Held before the evidence."
                }
              ]
            },
            formative_return: {
              materials: [{ material_id: "m1", body: "Held before the evidence." }],
              forward_orientation: "Look at the next idea."
            }
          }
        ]
      })
    )
  );
  assert.equal(graded.html, null);
  assert.match(graded.error, /formative only/i);
});

test("existing assessment-check rendering still checks a closed item", () => {
  const result = render({
    artifact_type: "page",
    schema_version: "2.0.0",
    page_kind: "assessment",
    title: "Existing check",
    activities: [],
    assessment_check: {
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
          feedback_note: "A prior is held before the evidence."
        }
      ]
    }
  });
  assert.equal(result.error, null);
  assert.equal(result.modelResult.model.assessmentPack, null);
  assert.match(result.html, /data-assessment-form="single_answer_mcq"/);
  assert.match(result.html, /data-assessment-correct="a"/);
  assert.match(result.html, /data-assessment-check/);
  assert.doesNotMatch(result.html, /data-assessment-product="assessment_pack"/);
  assert.doesNotMatch(result.html, /data-workspace-kind="text_entry"/);
});

test("causal-evidence field shapes do not leak objects or design-only prose", () => {
  const source = page(
    evidence({
      purpose: {
        role: "R1_and_R2",
        visibility_claim:
          "This formative Assessment Pack makes visible both the learner's current grasp of causal-inference principles. Determinate evidence reveals recognition. Non-determinate evidence reveals integrated judgement.",
        stop_rationale:
          "A combination of determinate checks and a substantial written methodological judgement reveals both conceptual application and integrated causal reasoning.",
        forward_intent:
          "Learners should leave with a clearer account of the strengths and limitations of their causal reasoning."
      },
      learner_context: {
        depends_on_prior_work: true,
        entry_assumptions: [
          { assumption: "You can distinguish an observed change from a causal claim." },
          { statement: "You have met history, maturation, and selection as threats to internal validity." }
        ],
        bring_forward: [
          {
            what: "Your notes on Campbell and Stanley.",
            how_used: "Use them when you judge the rehabilitation service's claim."
          }
        ]
      },
      elicitations: [
        {
          elicitation_id: "change",
          order: 1,
          evidence_ask:
            "Discriminate between an observed improvement and a justified causal claim.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "q1",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "Which interpretation is most defensible from the information provided?",
                  options: [
                    { key: "a", text: "The programme caused the improvement." },
                    { key: "b", text: "The design cannot establish the counterfactual." }
                  ]
                },
                judgement: { correct_answer: "b", auto_checkable: true },
                feedback_note:
                  "Carry the distinction between observed change and causal attribution into your judgement."
              }
            ]
          },
          formative_return: {
            materials: [
              {
                material_id: "note",
                title: "Why the comparison matters",
                body: "A restrained conclusion can recognise promising improvement without presenting its cause as established.",
                attention: "explanatory_feedback"
              }
            ],
            forward_orientation: "Keep this distinction in the written judgement."
          }
        },
        {
          elicitation_id: "judgement",
          order: 2,
          evidence_ask:
            "Elicit an independently constructed, integrated methodological judgement evaluating the service's causal claim.",
          epistemic_class: "non_determinate",
          instructions: "Use the rehabilitation study as the case.",
          stimulus:
            "Participants' balance scores improved, with no random allocation and no concurrent comparison group.",
          delivery: {
            kind: "constructed_performance",
            prompt: {
              stem: "Write a methodological judgement of the service's causal claim."
            },
            response_workspace: {
              intention:
                "Provide a substantial, editable text workspace in which the learner can draft a methodological judgement.",
              guidance: "Name the design and the claim it can and cannot support."
            }
          },
          formative_return: {
            materials: [
              {
                material_id: "criteria",
                title: "Self-evaluation: accuracy and restraint of the causal conclusion",
                body: "Have you explained why the absence of a credible counterfactual limits attribution?",
                attention: "criteria"
              }
            ],
            forward_orientation:
              "Compare your original and revised judgements and notice whether the revision improved the causal conclusion.",
            revision: {
              offered: true,
              prompt:
                "Identify one weakness in your methodological judgement using the self-evaluation criteria."
            }
          }
        }
      ],
      pack_forward_orientation:
        "The strength of a causal claim must be proportionate to the design and evidence supporting it."
    })
  );
  source.sections = [
    {
      section_id: "situation",
      title: "The situation",
      exposition:
        "A community rehabilitation service introduced a 12-week balance-training programme. Your task is to examine what can legitimately be inferred."
    }
  ];
  const result = render(source);
  assert.equal(result.error, null, result.error);
  const html = result.html;
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.match(html, /Your task is to examine what can legitimately be inferred/);
  assert.match(html, /What to bring with you/);
  assert.match(html, /Your notes on Campbell and Stanley/);
  assert.match(html, /Which interpretation is most defensible/);
  assert.doesNotMatch(html, /Before you begin/);
  assert.doesNotMatch(html, /You can distinguish an observed change from a causal claim/);
  assert.doesNotMatch(html, /You have met history, maturation, and selection/);
  assert.doesNotMatch(html, /Discriminate between an observed improvement and a justified causal claim/);
  assert.match(html, /Carry the distinction between observed change and causal attribution/);
  assert.match(html, /Why the comparison matters/);
  assert.doesNotMatch(html, /explanatory_feedback/);
  assert.match(html, /Write a methodological judgement of the service/);
  assert.match(html, /Your response/);
  assert.match(html, /Name the design and the claim it can and cannot support/);
  assert.match(html, /data-workspace-kind="text_entry"/);
  assert.match(html, /data-assessment-judgement="none"/);
  assert.match(html, /Self-evaluation: accuracy and restraint of the causal conclusion/);
  assert.match(html, /Have you explained why the absence of a credible counterfactual/);
  assert.match(html, /Identify one weakness in your methodological judgement/);
  assert.match(html, /What to take forward/);
  assert.match(html, /proportionate to the design and evidence supporting it/);
  assert.doesNotMatch(html, /Elicit an independently constructed/);
  assert.doesNotMatch(html, /Provide a substantial, editable text workspace/);
  assert.doesNotMatch(html, /learner's current grasp/);
  assert.doesNotMatch(html, /Determinate evidence reveals/);
  assert.doesNotMatch(html, /Non-determinate evidence reveals/);
  assert.doesNotMatch(html, /What this stop assumes/);
  assert.doesNotMatch(html, /This stop/);
  assert.doesNotMatch(html, /Formative state inspection/);
});

test("unreadable learner objects produce no assessment HTML", () => {
  const assumptions = render(
    page(
      evidence({
        learner_context: {
          depends_on_prior_work: false,
          entry_assumptions: [{ rationale: "Inspect the learner's current grasp before the next block." }]
        },
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
                    options: [
                      { key: "a", text: "Belief before evidence" },
                      { key: "b", text: "The new data" }
                    ]
                  },
                  judgement: { correct_answer: "a", auto_checkable: true },
                  feedback_note: "A prior is held before the evidence."
                }
              ]
            },
            formative_return: {
              forward_orientation: "Carry the result forward."
            }
          }
        ]
      })
    )
  );
  assert.equal(assumptions.html, null);
  assert.match(assumptions.error, /without text, body, statement, stem, or assumption/);
  assert.equal(assumptions.modelResult.errors[0].code, "learner_prose_unreadable");
  assert.match(assumptions.modelResult.errors[0].path, /entry_assumptions\[0\]/);

  const constructed = render(
    page(
      evidence({
        learner_context: { depends_on_prior_work: false, entry_assumptions: [] },
        elicitations: [
          {
            elicitation_id: "judgement",
            order: 1,
            evidence_ask: "Explain the claim in your own words.",
            epistemic_class: "non_determinate",
            delivery: {
              kind: "constructed_performance",
              prompt: { task: "Elicit an independently constructed methodological judgement." },
              response_workspace: {
                intention: "Sustained written judgement"
              }
            },
            formative_return: {
              materials: [
                {
                  material_id: "criteria",
                  body: "Compare your reasons with the criteria."
                }
              ],
              forward_orientation: "Use this to see the strength of your reasoning."
            }
          }
        ]
      })
    )
  );
  assert.equal(constructed.html, null);
  assert.match(constructed.error, /without text, body, statement, stem, or assumption/);
  assert.ok(
    constructed.modelResult.errors.some(function (error) {
      return error.code === "learner_prose_unreadable" && /delivery\.prompt/.test(error.path || "");
    })
  );
});

test("stored E6 constructed prompt renders the learner task and withholds the workspace specification", () => {
  const result = render(
    page(
      evidence({
        learner_context: { depends_on_prior_work: false },
        elicitations: [
          {
            elicitation_id: "E6",
            order: 6,
            evidence_ask:
              "Elicit an independently constructed, integrated methodological judgement evaluating the service's causal claim, prioritising plausible rival explanations, proposing a stronger feasible design, and recognising remaining uncertainty.",
            epistemic_class: "non_determinate",
            delivery: {
              kind: "constructed_performance",
              prompt: {
                title: "Your methodological judgement",
                context:
                  "A community rehabilitation service introduced a 12-week balance-training programme for older adults at risk of falling. Balance scores improved between baseline and follow-up, and the service concluded that the programme caused the improvement.",
                task:
                  "Write a reasoned methodological judgement for the rehabilitation service. Evaluate how far its causal claim is justified by the available evidence.",
                response_expectation:
                  "Develop a coherent, justified argument rather than a list of methodological terms. Where the scenario does not supply information, identify the uncertainty rather than inventing study findings.",
                suggested_length: "Approximately 300–450 words, or an equivalently developed response.",
                indicative_time: "8–9 minutes"
              },
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
            },
            formative_return: {
              materials: [
                {
                  material_id: "criteria",
                  title: "Self-evaluation: accuracy and restraint of the causal conclusion",
                  body: "Have you explained why the absence of a credible counterfactual limits attribution?"
                }
              ],
              forward_orientation: "Notice whether the revision improved the causal conclusion.",
              revision: {
                offered: true,
                prompt: "Identify one weakness in your methodological judgement using the self-evaluation criteria."
              }
            }
          }
        ]
      })
    )
  );
  assert.equal(result.error, null, result.error);
  const html = result.html;
  assert.match(html, /Your methodological judgement/);
  assert.match(html, /12-week balance-training programme/);
  assert.match(html, /Write a reasoned methodological judgement for the rehabilitation service/);
  assert.match(html, /Develop a coherent, justified argument/);
  assert.match(html, /Approximately 300–450 words/);
  assert.match(html, /8–9 minutes/);
  assert.match(html, /Your response/);
  assert.match(html, /<textarea /);
  assert.match(html, /data-assessment-judgement="none"/);
  assert.match(html, /Self-evaluation: accuracy and restraint/);
  assert.match(html, /Identify one weakness in your methodological judgement/);
  assert.doesNotMatch(html, /\[object Object\]/);
  assert.doesNotMatch(html, /Elicit an independently constructed/);
  assert.doesNotMatch(html, /Provide a substantial, editable text workspace/);
  assert.doesNotMatch(html, /Compose an independent methodological judgement/);
  assert.doesNotMatch(html, /extended_text/);
});

test("published causal-inference design records stay off the learner page", () => {
  function closed(id, order, ask, stem, feedback) {
    return {
      elicitation_id: id,
      order: order,
      evidence_ask: ask,
      epistemic_class: "determinate",
      delivery: {
        kind: "auto_checkable_items",
        items: [
          {
            item_id: id + "-q",
            order: 1,
            form: "single_answer_mcq",
            prompt: {
              stem: stem,
              options: [
                { key: "a", text: "The programme caused the improvement." },
                { key: "b", text: "The design cannot establish the counterfactual." }
              ]
            },
            judgement: { correct_answer: "b", auto_checkable: true },
            feedback_note: feedback
          }
        ]
      },
      formative_return: {
        forward_orientation: "Keep this distinction in the written judgement."
      }
    };
  }
  const source = page(
    evidence({
      learner_context: {
        depends_on_prior_work: false,
        entry_assumptions: [
          "The learner is studying Research Methods at postgraduate level in Sports and Exercise Medicine.",
          "The learner has introductory knowledge of clinical research designs.",
          "The learner has not necessarily completed an earlier PRISM resource.",
          "Recognition of methodological terminology does not necessarily demonstrate integrated causal reasoning.",
          "The learner can review and revise their own reasoning using explicit criteria.",
          "The activity is completed independently in a browser."
        ]
      },
      elicitations: [
        closed(
          "e1",
          1,
          "Discriminate between an observed improvement and a justified causal claim, recognising the absence of a credible counterfactual in the reported single-group before-and-after design.",
          "Which interpretation is most defensible from the information provided?",
          "Carry the distinction between observed change and causal attribution into your judgement of the service's claim."
        ),
        closed(
          "e2",
          2,
          "Identify multiple plausible rival explanations for improvement in the rehabilitation study and distinguish those explanations from unsupported assertions that the intervention necessarily caused or failed to cause the outcome.",
          "Which of the following could plausibly contribute to the observed improvement independently of a beneficial effect of the balance-training programme?",
          "When you construct your methodological judgement, move beyond naming threats."
        ),
        closed(
          "e3",
          3,
          "Distinguish the mechanisms of history, maturation, testing effects, regression to the mean, selection bias and attrition by classifying clinically plausible research circumstances.",
          "Classify each according to the methodological concern it most directly illustrates.",
          "Use these distinctions to select the most plausible threats in the service's actual design."
        ),
        closed(
          "e4",
          4,
          "Interpret the contribution of an appropriate concurrent comparison group to causal inference, recognising that the relevant evidence concerns comparative change rather than improvement in the intervention group alone.",
          "What is the strongest methodological reason for including this comparison group?",
          "In your design proposal, identify the comparison condition and explain why it would provide a more credible counterfactual."
        ),
        closed(
          "e5",
          5,
          "Recognise multiple defensible methodological safeguards and residual limitations when strengthening a clinical intervention evaluation, including the distinct concerns of internal and external validity.",
          "Which methodological judgements are defensible?",
          "Choose a design you can justify in the community rehabilitation context."
        ),
        {
          elicitation_id: "E6",
          order: 6,
          evidence_ask:
            "Elicit an independently constructed, integrated methodological judgement evaluating the service's causal claim.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: {
              title: "Your methodological judgement",
              context:
                "Participants were not randomly allocated, there was no concurrent comparison group, some participants withdrew, and other changes occurred during the study period.",
              task: "Write a reasoned methodological judgement for the rehabilitation service.",
              response_expectation:
                "Develop a coherent, justified argument rather than a list of methodological terms.",
              suggested_length: "Approximately 300–450 words, or an equivalently developed response.",
              indicative_time: "8–9 minutes"
            },
            response_workspace: { intention: "Sustained written judgement" }
          },
          formative_return: {
            materials: [
              {
                material_id: "criteria",
                title: "Self-evaluation: accuracy and restraint of the causal conclusion",
                body: "Have you explained why the absence of a credible counterfactual limits attribution?"
              }
            ],
            forward_orientation:
              "The strength of a causal claim must be proportionate to the design and evidence supporting it.",
            revision: {
              offered: true,
              prompt: "Identify one weakness in your methodological judgement using the self-evaluation criteria."
            }
          }
        }
      ]
    })
  );
  source.sections = [
    {
      section_id: "situation",
      title: "The situation",
      exposition:
        "Your task is to examine what can legitimately be inferred from this evidence."
    }
  ];
  const result = render(source);
  assert.equal(result.error, null, result.error);
  const html = result.html;
  assert.match(html, /Your task is to examine what can legitimately be inferred/);
  assert.match(html, /Which interpretation is most defensible from the information provided/);
  assert.match(html, /Carry the distinction between observed change and causal attribution/);
  assert.match(html, /could plausibly contribute to the observed improvement/);
  assert.match(html, /Classify each according to the methodological concern/);
  assert.match(html, /strongest methodological reason for including this comparison group/);
  assert.match(html, /Which methodological judgements are defensible/);
  assert.match(html, /data-assessment-check/);
  assert.match(html, /Your methodological judgement/);
  assert.match(html, /Write a reasoned methodological judgement for the rehabilitation service/);
  assert.match(html, /Self-evaluation: accuracy and restraint of the causal conclusion/);
  assert.match(html, /Identify one weakness in your methodological judgement/);
  assert.match(html, /proportionate to the design and evidence supporting it/);
  [
    "The learner is studying Research Methods",
    "The learner has introductory knowledge of clinical research designs",
    "The learner has not necessarily completed an earlier PRISM resource",
    "does not necessarily demonstrate integrated causal reasoning",
    "The learner can review and revise",
    "The activity is completed independently in a browser",
    "Discriminate between an observed improvement and a justified causal claim",
    "Identify multiple plausible rival explanations",
    "Distinguish the mechanisms of history, maturation",
    "Interpret the contribution of an appropriate concurrent comparison group",
    "Recognise multiple defensible methodological safeguards",
    "Elicit an independently constructed",
    "Before you begin"
  ].forEach(function (phrase) {
    assert.equal(html.includes(phrase), false, phrase);
  });
});
