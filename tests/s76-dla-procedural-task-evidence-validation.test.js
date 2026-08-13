/**
 * Sprint 76 — DLA evidence_decision: procedural task inputs vs learner evidence.
 *
 * Ordinary supplied practice inputs must not force evidence_decision.required=true.
 * Genuine observation/source/data interpretation tasks must still fail when required:false.
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
    learning_outcomes: [{ outcome_id: "LO1", statement: "Apply constrained optimisation." }],
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

function lagrangianMaterials() {
  return [
    {
      material_id: "A2-M1",
      material_type: "worked_example",
      purpose: "Worked Lagrangian construction",
      specification: "Step-by-step construction from objective and constraint."
    },
    {
      material_id: "A2-M2",
      material_type: "analysis_table",
      purpose: "Guided construction table",
      specification: "Rows for objective, constraint, Lagrangian terms and practice problems."
    },
    {
      material_id: "A2-M3",
      material_type: "checklist",
      purpose: "Self-check",
      specification:
        "Terms are correctly formed; multipliers align with constraints; construction matches optimisation statement."
    }
  ];
}

function baseActivity(learnerTask, expectedOutput, extra) {
  return Object.assign(
    {
      activity_id: "A2",
      title: "Build the Lagrangian",
      grouping: "individual",
      duration_minutes: 25,
      learning_outcome_ids: ["LO1"],
      learner_task: learnerTask,
      expected_output: expectedOutput,
      activity_preamble: "Use the worked example and table before attempting new problems.",
      intellectual_coherence_bridge: "You have seen the setup; now build the Lagrangian yourself.",
      evidence_decision: {
        required: false,
        reason:
          "Learners construct expressions from provided optimisation statements rather than interpret evidence.",
        provider_material_ids: []
      },
      required_materials: lagrangianMaterials(),
      materials: [],
      episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] }
    },
    extra || {}
  );
}

function validateActivity(activity) {
  return dlaEnrich.validateDlaEnrichedPage(buildMinimalPage(activity), null);
}

function assertPassesEvidenceCheck(check, label) {
  assert.equal(check.ok, true, label + ": " + (check.errors || []).join("; "));
  assert.equal(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    false,
    label
  );
}

function assertFailsEvidenceCheck(check, label) {
  assert.equal(check.ok, false, label);
  assert.ok(
    (check.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
    label + " should contradict evidence-dependent wording"
  );
}

test("S76 A2 Lagrangian Build activity passes with evidence_decision.required false", () => {
  const check = validateActivity(
    baseActivity(
      "Study the worked example, compare the optimisation statement with the completed Lagrangian, complete the guided construction table for new examples, and review against the checklist.",
      "Correctly constructed Lagrangians for each practice problem."
    )
  );
  assertPassesEvidenceCheck(check, "A2 Lagrangian");
});

test("EXACT live A2 wording passes paste-path validateDlaEnrichedPage with required:false", () => {
  const activity = baseActivity(
    "1. Study the worked example showing how a Lagrangian is constructed.\n2. Compare the original optimisation statement with the completed Lagrangian.\n3. Complete the guided construction table for new examples.\n4. Review your work against the verification checklist.",
    "A correctly constructed Lagrangian for each practice problem, with accurate inclusion of the objective function, the constraint term, and the multiplier, demonstrating a clear understanding of how the expression is assembled."
  );
  const page = buildMinimalPage(activity);
  // activities[1] shape: pad with a preceding activity so index matches live error.
  page.activities = [
    {
      activity_id: "A1",
      title: "Orient",
      grouping: "individual",
      duration_minutes: 10,
      learning_outcome_ids: ["LO1"],
      learner_task: "Review the explanatory overview.",
      expected_output: "Brief notes.",
      activity_preamble: "Read the overview.",
      intellectual_coherence_bridge: "Orientation before construction.",
      evidence_decision: {
        required: false,
        reason: "Conceptual orientation.",
        provider_material_ids: []
      },
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          purpose: "Overview",
          specification: "Explanatory overview."
        }
      ],
      materials: [],
      episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
    },
    activity
  ];
  page.episode_plans = [
    {
      activity_id: "A1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan_id: "EP-A1",
      episode_plan: page.activities[0].episode_plan
    },
    {
      activity_id: "A2",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan_id: "EP-A2",
      episode_plan: activity.episode_plan
    }
  ];
  const enriched = dlaEnrich.validateDlaEnrichedPage(page, null);
  assertPassesEvidenceCheck(enriched, "exact A2 enriched");
  assert.equal(
    (enriched.errors || []).some((e) => /activities\[1\].*evidence-dependent/i.test(e)),
    false
  );
  const partial = dlaEnrich.validateDlaPartialPageCapture(page, { baseline: null });
  assertPassesEvidenceCheck(partial, "exact A2 partial/Next-equivalent");
});

test("EXACT live A2 still passes when checklist mentions mathematical expression structure", () => {
  const activity = baseActivity(
    "1. Study the worked example showing how a Lagrangian is constructed.\n2. Compare the original optimisation statement with the completed Lagrangian.\n3. Complete the guided construction table for new examples.\n4. Review your work against the verification checklist.",
    "A correctly constructed Lagrangian for each practice problem, with accurate inclusion of the objective function, the constraint term, and the multiplier, demonstrating a clear understanding of how the expression is assembled.",
    {
      required_materials: [
        {
          material_id: "A2-M1",
          material_type: "worked_example",
          purpose: "Worked Lagrangian construction",
          specification: "Step-by-step construction from objective and constraint."
        },
        {
          material_id: "A2-M2",
          material_type: "analysis_table",
          purpose: "Guided construction table",
          specification:
            "Rows for objective, constraint, Lagrangian terms and practice problems."
        },
        {
          material_id: "A2-M3",
          material_type: "checklist",
          purpose: "Self-check",
          specification:
            "Check the structure of the Lagrangian expression against the optimisation statement; multipliers align with constraints."
        }
      ]
    }
  );
  assertPassesEvidenceCheck(validateActivity(activity), "A2 with mathematical structure checklist");
});

test("Literary imagery/tone/structure with required:false still fails after structure narrowing", () => {
  assertFailsEvidenceCheck(
    validateActivity(
      baseActivity(
        "Analyse imagery, tone and structure using the provided examples and explain how they shape meaning.",
        "An analysis that refers to imagery, tone and structure in the provided examples."
      )
    ),
    "literary structure still evidence-dependent"
  );
});

test("PASS 1: construct expression from supplied objective and constraint", () => {
  assertPassesEvidenceCheck(
    validateActivity(
      baseActivity(
        "Construct the Lagrangian from the supplied objective function and constraint for each practice problem.",
        "Correctly constructed Lagrangians."
      )
    ),
    "construct from supplied objective"
  );
});

test("PASS 2: solve supplied equation using taught procedure", () => {
  assertPassesEvidenceCheck(
    validateActivity(
      baseActivity(
        "Solve each supplied practice problem using the taught Lagrangian construction procedure.",
        "Correct Lagrangians for each problem."
      )
    ),
    "solve supplied problem"
  );
});

test("PASS 3: complete practice table for new examples", () => {
  assertPassesEvidenceCheck(
    validateActivity(
      baseActivity(
        "Complete the guided construction table for new examples and review against the checklist.",
        "Completed table entries and constructed Lagrangians."
      )
    ),
    "practice table new examples"
  );
});

test("PASS 4: apply worked method to new practice problem", () => {
  assertPassesEvidenceCheck(
    validateActivity(
      baseActivity(
        "Apply the worked example method to each new practice problem and write the Lagrangian.",
        "Correct Lagrangians for each practice problem."
      )
    ),
    "apply worked method"
  );
});

test("PASS 5: compare problem statement with completed transformation", () => {
  assertPassesEvidenceCheck(
    validateActivity(
      baseActivity(
        "Using the provided examples, compare the optimisation statement with the completed Lagrangian before applying the method to new practice problems.",
        "Correctly constructed Lagrangians."
      )
    ),
    "compare statement with completed transformation"
  );
});

test("FAIL 6: analyse supplied observations to infer conclusion", () => {
  assertFailsEvidenceCheck(
    validateActivity(
      baseActivity(
        "Analyse the supplied observations to infer which mechanism best explains the outcome.",
        "An inference supported by the observations."
      )
    ),
    "analyse observations"
  );
});

test("FAIL 7: evaluate claim using supplied data", () => {
  assertFailsEvidenceCheck(
    validateActivity(
      baseActivity(
        "Evaluate the claim using the supplied data and determine which explanation is best supported.",
        "A supported evaluation."
      )
    ),
    "evaluate with data"
  );
});

test("FAIL 8: interpret historical source excerpt", () => {
  assertFailsEvidenceCheck(
    validateActivity(
      baseActivity(
        "Interpret the historical source excerpt and explain its significance.",
        "An interpretation of the source excerpt."
      )
    ),
    "historical source excerpt"
  );
});

test("FAIL 9: compare cases as evidential support", () => {
  assertFailsEvidenceCheck(
    validateActivity(
      baseActivity(
        "Compare the cases as evidential support for your judgement about the best explanation.",
        "A judgement supported by the cases."
      )
    ),
    "cases as evidential support"
  );
});

test("FAIL 10: quotations and source properties for justification", () => {
  assertFailsEvidenceCheck(
    validateActivity(
      baseActivity(
        "Use the quotations and source properties to justify your interpretation.",
        "A justified interpretation."
      )
    ),
    "quotations justify"
  );
});
