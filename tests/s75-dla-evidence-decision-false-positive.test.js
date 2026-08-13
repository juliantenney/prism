/**
 * Sprint 75 — DLA evidence_decision false-positive validation fix (S75-D15).
 *
 * Evidence dependency refers to reliance on supplied evidence/source material,
 * not ordinary use of generated instructional explanations, examples, samples,
 * or checklists.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));

function buildMinimalPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Test page",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Interpret constrained optimisation." }],
    episode_plans: [
      {
        activity_id: activity.activity_id,
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-" + activity.activity_id,
        episode_plan: activity.episode_plan
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    activities: [activity],
    source_artefacts: [],
    generation_notes: {}
  };
}

function validateActivity(activity) {
  return dlaEnrich.validateDlaEnrichedPage(buildMinimalPage(activity), null);
}

function lagrangianA5Activity(overrides) {
  return Object.assign(
    {
      activity_id: "A5",
      title: "Interpret shadow price (lambda)",
      grouping: "individual",
      duration_minutes: 20,
      learning_outcome_ids: ["LO1"],
      learner_task:
        "Review the explanatory material on shadow prices and lambda; compare weak and strong interpretation examples; write a short interpretation summary explaining the economic meaning.",
      expected_output:
        "A concise conceptual explanation of the shadow price (lambda) and its economic meaning.",
      activity_preamble: "Use the explanatory text and sample outputs before writing your summary.",
      intellectual_coherence_bridge:
        "You have modelled constrained optimisation; now consolidate what lambda means economically.",
      evidence_decision: {
        required: false,
        reason:
          "The task requires conceptual explanation rather than interpretation of supplied evidence.",
        provider_material_ids: []
      },
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [
        {
          material_id: "A5-M1",
          material_type: "text",
          purpose: "Explanatory text on shadow price and lambda",
          specification: "Conceptual explanation of the shadow price (lambda) in constrained optimisation."
        },
        {
          material_id: "A5-M2",
          material_type: "worked_example",
          purpose: "Sample output",
          specification:
            "Modelled interpretation with weak and strong examples and supporting reasoning."
        },
        {
          material_id: "A5-M3",
          material_type: "text",
          purpose: "Consolidation summary",
          specification: "Summary of key interpretive points."
        },
        {
          material_id: "A5-M4",
          material_type: "checklist",
          purpose: "Self-check",
          specification:
            "Interpretation is conceptually accurate; comparison draws on weak and strong examples; summary is concise."
        }
      ],
      materials: [],
      episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
    },
    overrides || {}
  );
}

function baseActivity(learnerTask, expectedOutput, extra) {
  return Object.assign(
    {
      activity_id: "A1",
      title: "Activity",
      grouping: "individual",
      duration_minutes: 15,
      learning_outcome_ids: ["LO1"],
      learner_task: learnerTask,
      expected_output: expectedOutput,
      activity_preamble: "Use the teaching materials.",
      intellectual_coherence_bridge: "Bridge text is distinct from the preamble.",
      evidence_decision: {
        required: false,
        reason: "Conceptual teaching activity.",
        provider_material_ids: []
      },
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          purpose: "Teaching",
          specification: "Explanatory material."
        }
      ],
      materials: [],
      episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
    },
    extra || {}
  );
}

test("S75-D15 A: Lagrangian A5-style conceptual interpretation passes with required:false", () => {
  const check = validateActivity(lagrangianA5Activity());
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    false
  );
});

test("S75-D15 A: provided instructional examples variant passes (study provided examples)", () => {
  const check = validateActivity(
    lagrangianA5Activity({
      learner_task:
        "Review the explanatory summary, study the provided examples of weak and strong interpretations, and write your own summary."
    })
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S75-D15 B: conceptual interpret-the-meaning passes with required:false", () => {
  const check = validateActivity(
    baseActivity(
      "Interpret the economic meaning of the multiplier.",
      "A conceptual interpretation of the multiplier."
    )
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S75-D15 C: compare weak and strong sample answers passes with required:false", () => {
  const check = validateActivity(
    baseActivity(
      "Compare weak and strong sample answers and summarise the difference.",
      "A short comparison summary.",
      {
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "worked_example",
            purpose: "Sample answers",
            specification: "Contrasts weak and strong sample answers."
          }
        ]
      }
    )
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S75-D15 D: review explanatory material passes with required:false", () => {
  const check = validateActivity(
    baseActivity("Review the explanatory summary.", "Brief notes on the concept.")
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S75-D15 E: analyse supplied dataset with required:false must pass (P02 no prose fail-close)", () => {
  const check = validateActivity(
    baseActivity(
      "Analyse the supplied dataset and identify the trend.",
      "A trend statement grounded in the dataset."
    )
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    false
  );
});

test("S75-D15 F: compare provided source extracts with required:false must pass (P02 no prose fail-close)", () => {
  const check = validateActivity(
    baseActivity(
      "Compare the two provided source extracts and justify your conclusion.",
      "A justified comparison."
    )
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    false
  );
});

test("S75-D15 F: attached case evidence with required:false must pass (P02 no prose fail-close)", () => {
  const check = validateActivity(
    baseActivity(
      "Use the attached case evidence to justify your conclusion.",
      "A evidence-based justification."
    )
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    false
  );
});

test("S75-D15 G: genuine evidence-required activity passes with required:true and provider", () => {
  const check = validateActivity(
    Object.assign(baseActivity("", ""), {
      learner_task:
        "Analyse imagery, tone and structure using the provided examples and explain how they shape meaning.",
      expected_output:
        "An analysis that refers to imagery, tone and structure in the provided examples.",
      evidence_decision: {
        required: true,
        reason: "Learner must inspect poem excerpts for imagery, tone and structure.",
        provider_material_ids: ["A1-ME1"]
      },
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-ME1"]
      },
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          purpose: "Teaching overview",
          specification: "Explanatory guide."
        },
        {
          material_id: "A1-ME1",
          material_type: "scenario",
          purpose: "Attributed poem excerpts.",
          specification: "Preserve wording for imagery/tone/structure inspection.",
          evidence_requirement: {
            kind: "learner_evidence",
            purpose: "Provide inspectable poem excerpts.",
            learner_action: "Identify imagery, tone and structure before concluding.",
            observable_features: ["imagery", "tone", "structure"],
            provenance: "conversation_attachment"
          }
        }
      ],
      episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
    })
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S75-D15 H: literary imagery/tone/structure with required:false must pass (P02 no prose fail-close)", () => {
  const check = validateActivity(
    Object.assign(baseActivity("", ""), {
      learner_task:
        "Analyse imagery, tone and structure using the provided examples and explain how they shape meaning.",
      expected_output:
        "An analysis that refers to imagery, tone and structure in the provided examples.",
      evidence_decision: {
        required: false,
        reason: "Incorrectly marked non-evidence.",
        provider_material_ids: []
      },
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          purpose: "Teaching overview",
          specification: "Explanatory guide."
        },
        {
          material_id: "A1-M2",
          material_type: "analysis_table",
          purpose: "Learner workspace",
          specification: "Blank analysis rows."
        }
      ],
      episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
    })
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    false
  );
});

test("S75-D15 I: malformed evidence_decision shape validation unchanged", () => {
  const check = validateActivity(
    Object.assign(lagrangianA5Activity(), {
      evidence_decision: {
        required: false,
        provider_material_ids: []
      }
    })
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /\.reason required/.test(e)));
});
