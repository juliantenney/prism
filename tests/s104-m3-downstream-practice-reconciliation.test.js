/**
 * Sprint 104 Milestone 3 — Downstream Practice Contract Reconciliation Tests
 *
 * Verifies:
 * 1. Lean AI-authored Practice Episode Plan (including an activity without dedicated
 *    materials, omitted preamble/bridge/cognition, omitted/skipped editorial opening,
 *    and empty page_synthesis) progresses end-to-end through DLA -> GAM ->
 *    Learning Sequence -> Design Page -> assembleVNextPageFromPartials ->
 *    buildPageModel -> renderLearnerPageHtml -> buildLearnerPackage without
 *    artificial expansion or render failure.
 * 2. Richer AI-authored multi-LO / multi-beat Practice Episode Plan progresses end-to-end
 *    with multi-LO outcome parity, preserved beat-derived materials, hybrid
 *    selection + concise justification, 1-to-2 criterion diagnostic_review without
 *    arbitrary 3-criterion floors, no unconditional GAM closure pack, preserved
 *    Learning Sequence structure/duration, and purpose-driven Design Page output.
 * 3. Contract & Interactive non-regression guards stay intact.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const pageDla = require("../lib/page-dla-enrich.js");
const pageGam = require("../lib/page-gam-enrich.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const gamAssembler = require("../lib/gam-canonical-assembler.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const guidedReviewContract = require("../lib/guided-review-generation-contract.js");
const guidedScaffold = require("../lib/ld-guided-learning-scaffold.js");
const populationContract = require("../lib/episode-plan-population-contract.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const assembleVNext = require("../lib/page-vnext-assemble.js");
const buildPageModel = require("../lib/learner-renderer-vnext/build-page-model.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const learnerPackage = require("../lib/learner-package.js");
const editorialOpening = require("../lib/expository-editorial-opening.js");
const { loadPrismAppJsTestApi, DEFAULT_LIBS } = require("./prism-vm-lib-bootstrap.js");

function boot() {
  return loadPrismAppJsTestApi({ libs: DEFAULT_LIBS.slice() });
}

function makePracticeWorkflow(durationMinutes) {
  return {
    id: "wf-s104-m3-practice",
    product: "practice",
    startingPoint: "generate_from_topic",
    goal: "Practice downstream contract reconciliation",
    desiredOutputs: "Practice learner page",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    durationMinutes: durationMinutes,
    workflowOutputSpec: {
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      duration_minutes: durationMinutes
    }
  };
}

function makePracticeEpStep() {
  return {
    id: "step_ep",
    canonical_step_id: "step_design_episode_plan",
    canonical_title: "Design Episode Plan",
    title: "Design Episode Plan",
    outputName: "page"
  };
}

function makePracticeDlaStep() {
  return {
    id: "step_dla",
    canonical_step_id: "step_design_learning_activities",
    canonical_title: "Design Learning Activities",
    title: "Design Learning Activities",
    outputName: "page"
  };
}

function makePracticeGamStep() {
  return {
    id: "step_gam",
    canonical_step_id: "step_generate_activity_materials",
    canonical_title: "Generate Activity Materials",
    title: "Generate Activity Materials",
    outputName: "page"
  };
}

function makePracticeLsStep() {
  return {
    id: "step_ls",
    canonical_step_id: "step_construct_learning_sequence",
    canonical_title: "Construct Learning Sequence",
    title: "Construct Learning Sequence",
    outputName: "page"
  };
}

function makePracticeDpStep() {
  return {
    id: "step_dp",
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page",
    outputName: "page"
  };
}

test("104M3 E2E (Lean Practice): zero-materials activity, omitted preamble/bridge/opening, empty page_synthesis, preserved 10-min LS", () => {
  const { api } = boot();
  const wf = makePracticeWorkflow(10);

  // 1. Lean AI-authored Episode Plan shell (still carrying upstream shell "—" placeholders on optional fields)
  const epShell = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Linear constraint check — Practice",
    audience: "First-year economics undergraduates",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    learning_outcomes: [
      {
        id: "LO1",
        statement: "Verify whether a candidate bundle satisfies linear resource constraints."
      }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        archetype: "apply",
        beats: [
          { beat_id: "B1", function: "explanation" },
          { beat_id: "B2", function: "independent_performance" },
          { beat_id: "B3", function: "verification" }
        ]
      }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "Verify bundle feasibility directly",
        duration_minutes: 10,
        mapped_learning_outcomes: ["LO1"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { beat_id: "B1", function: "explanation" },
            { beat_id: "B2", function: "independent_performance" },
            { beat_id: "B3", function: "verification" }
          ]
        },
        learner_task: "—",
        expected_output: "—",
        activity_preamble: "—",
        intellectual_coherence_bridge: "—",
        reasoning_orientation: "—",
        required_materials: [],
        materials: []
      }
    ],
    assembly_state: {
      current_stage: "episode_plan",
      enriched_by: ["episode_plan"],
      calls_model: true
    }
  };

  // 2. Lean DLA partial capture: no dedicated materials required; omits preamble, bridge, and uncommissioned cognition fields
  const dlaPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    activities: [
      {
        activity_id: "A1",
        title: "Verify bundle feasibility directly",
        learner_task:
          "1. Test each candidate bundle (3, 4) and (5, 2) against the resource inequality 2x + 3y <= 16.\n2. Record which bundle satisfies the constraint and compute the slack or shortfall.\n3. Verify your arithmetic by substituting your chosen numbers back into 2x + 3y.",
        expected_output:
          "Exact inequality checks for both bundles identifying the feasible bundle and its numeric slack.",
        task_material_decision: {
          separate_inputs_required: false,
          reason: "Direct algebraic constraints and candidate bundles are stated cleanly in the task.",
          task_input_material_ids: []
        },
        evidence_decision: {
          required: false,
          reason: "Algebraic substitution check; no external evidence dossier needed.",
          provider_material_ids: []
        },
        required_materials: []
      }
    ],
    assembly_state: {
      current_stage: "dla",
      enriched_by: ["episode_plan", "dla"],
      calls_model: true
    }
  };

  // Validate Practice DLA partial capture & full enriched DLA check
  const repairedPartial = pageDla.repairDlaPartialShellPlaceholderFields(dlaPartial, {
    baseline: epShell,
    practiceProduct: true
  }).page;
  const dlaPartialCheck = pageDla.validateDlaPartialPageCapture(repairedPartial, {
    baseline: epShell,
    practiceProduct: true
  });
  assert.equal(dlaPartialCheck.ok, true, (dlaPartialCheck.errors || []).join("; "));

  // Verify Interactive guided scaffold is NOT enforced/injected onto Practice DLA capture
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const practiceDlaCtx = api.buildWorkflowStepPromptAugmentContextFromStep(
    makePracticeDlaStep(),
    wf
  );
  const leanDlaCaptureRaw = JSON.stringify(repairedPartial, null, 2);
  const afterPracticeScaffoldRepair = api.applyGuidedLearningScaffoldRepairToDlaCapture(
    leanDlaCaptureRaw,
    practiceDlaCtx,
    "step_dla"
  );
  assert.equal(afterPracticeScaffoldRepair, leanDlaCaptureRaw);
  const scaffoldReport = guidedScaffold.evaluateGuidedLearningScaffoldEvidence(
    repairedPartial.activities,
    { repairOptions: { page: repairedPartial, practiceProduct: true } }
  );
  assert.equal(
    scaffoldReport.meetsGuidedLearningScaffoldQuality,
    true,
    JSON.stringify(scaffoldReport.issues || [])
  );

  // Verify population contract accepts lean self-contained Practice activity with required_materials: []
  const popCheck = populationContract.validatePopulationContract(
    epShell.activities[0].episode_plan,
    repairedPartial.activities[0],
    { practiceProduct: true }
  );
  assert.equal(popCheck.ok, true, (popCheck.errors || []).join("; "));

  // Verify DLA full-page validation passes cleanly without preamble, bridge, or materials
  const dlaEnrichedFull = Object.assign({}, epShell, {
    activities: [
      Object.assign({}, epShell.activities[0], repairedPartial.activities[0], {
        activity_preamble: undefined,
        intellectual_coherence_bridge: undefined,
        reasoning_orientation: undefined
      })
    ],
    assembly_state: repairedPartial.assembly_state
  });
  delete dlaEnrichedFull.activities[0].activity_preamble;
  delete dlaEnrichedFull.activities[0].intellectual_coherence_bridge;
  delete dlaEnrichedFull.activities[0].reasoning_orientation;
  const dlaFullCheck = pageDla.validateDlaEnrichedPage(dlaEnrichedFull, epShell);
  assert.equal(dlaFullCheck.ok, true, (dlaFullCheck.errors || []).join("; "));

  // 3. Lean GAM partial capture: materials: [] preserved without inventing closure or extra cards
  const gamPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    activities: [
      {
        activity_id: "A1",
        materials: []
      }
    ],
    assembly_state: {
      current_stage: "gam",
      enriched_by: ["episode_plan", "dla", "gam"],
      calls_model: true
    }
  };
  const gamEnriched = pageGam.enrichPageWithGam(
    Object.assign({}, dlaEnrichedFull, {
      activities: dlaEnrichedFull.activities.map((a) => Object.assign({}, a, { materials: [] }))
    }),
    { defaultLoStatement: epShell.learning_outcomes[0].statement }
  );
  const gamFullCheck = pageGam.validateGamEnrichedPage(gamEnriched, dlaEnrichedFull);
  assert.equal(gamFullCheck.ok, true, (gamFullCheck.errors || []).join("; "));
  assert.equal(gamEnriched.generation_notes.validation.material_coverage, "none_required");

  // Confirm Practice GAM prompt does NOT emit unconditional Interactive closure / depth mandates
  const gamContractText = gamContract.buildGamPageEnrichContractBlock({ practiceProduct: true });
  assert.doesNotMatch(gamContractText, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/);
  assert.doesNotMatch(gamContractText, /mandatory S78-D04 closure block/i);
  assert.match(gamContractText, /materials: \[\]/);

  // 4. Learning Sequence: preserves exact Episode Plan structure and 10-minute duration
  const validLsPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    learning_sequence: {
      ordered_activity_ids: ["A1"],
      total_duration_minutes: 10,
      timeline: [
        {
          activity_id: "A1",
          duration_minutes: 10
        }
      ],
      navigation_guidance: {
        progression_logic: "Complete the feasibility calculation and self-verify by substitution."
      }
    },
    assembly_state: {
      current_stage: "learning_sequence",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence"],
      calls_model: true
    }
  };
  const lsCheck = api.validateLearningSequencePartialPageCapture(validLsPartial, {
    effectiveDurationMinutes: 10,
    practiceProduct: true,
    baselinePage: dlaEnrichedFull
  });
  assert.equal(lsCheck.ok, true, (lsCheck.errors || []).join("; "));

  // Attempting to expand structure or inflate duration fails closed
  const expandedLsPartial = JSON.parse(JSON.stringify(validLsPartial));
  expandedLsPartial.learning_sequence.ordered_activity_ids = ["A1", "A2"];
  expandedLsPartial.learning_sequence.total_duration_minutes = 20;
  expandedLsPartial.learning_sequence.timeline.push({ activity_id: "A2", duration_minutes: 10 });
  const expandedLsCheck = api.validateLearningSequencePartialPageCapture(expandedLsPartial, {
    effectiveDurationMinutes: 10,
    practiceProduct: true,
    baselinePage: dlaEnrichedFull
  });
  assert.equal(expandedLsCheck.ok, false);
  assert.ok(
    expandedLsCheck.errors.some((e) => /ordered_activity_ids must preserve/i.test(String(e))),
    expandedLsCheck.errors.join("; ")
  );

  // 5. Design Page: empty page_synthesis: {} remains valid, while editorial_opening_image requires decision "generate"
  const dpOmittedPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Linear constraint check — Practice",
    page_synthesis: {},
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: {
          decision: "none",
          rationale: "Short algebraic verification requires no figure."
        }
      }
    ],
    visual_affordances: [],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"],
      calls_model: true
    }
  };
  const dpOmittedCheck = api.validateDesignPagePartialPageCapture(dpOmittedPartial, wf);
  assert.equal(dpOmittedCheck.ok, false, "omitted editorial_opening_image must be rejected for new Practice captures");

  const dpSkippedPartial = Object.assign({}, dpOmittedPartial, {
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "Focused 10-minute practice calculation needs direct task entry."
    }
  });
  const dpSkippedCheck = api.validateDesignPagePartialPageCapture(dpSkippedPartial, wf);
  assert.equal(dpSkippedCheck.ok, false, "skip editorial_opening_image must be rejected for new Practice captures");

  const dpGeneratedPartial = Object.assign({}, dpOmittedPartial, {
    editorial_opening_image: {
      decision: "generate",
      subject: "Everyday household budgeting and shopping choices",
      context: "Decorative, text-free opening illustration establishing an everyday economic decision context without numbers or spoilers.",
      caption_intent: "Atmospheric opening for linear budget constraint practice.",
      alt_text: "",
      detailed_description: "A calm, contemporary text-free illustration of a bright kitchen table with groceries and an unmarked notebook in natural light. No numbers, equations, labels, or overlays appear."
    }
  });
  const dpGeneratedCheck = api.validateDesignPagePartialPageCapture(dpGeneratedPartial, wf);
  assert.equal(dpGeneratedCheck.ok, true, (dpGeneratedCheck.errors || []).join("; "));

  // 6. Full vNext Assembly -> Model -> Render -> Package (backward compatibility with existing captured Practice omitting editorial_opening_image)
  const assembled = assembleVNext.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: repairedPartial,
    gam: gamPartial,
    learning_sequence: validLsPartial,
    design_page: dpOmittedPartial
  });
  assert.equal(assembled.ok, true);
  // Upstream "—" placeholders must not survive onto omitted Practice activity fields
  assert.equal(assembled.page.activities[0].activity_preamble, undefined);
  assert.equal(assembled.page.activities[0].intellectual_coherence_bridge, undefined);
  assert.equal(assembled.page.activities[0].reasoning_orientation, undefined);
  assert.equal(assembled.page.activities[0].duration_minutes, 10);
  assert.equal(editorialOpening.buildEditorialOpeningBrief(assembled.page), null);

  const modelRes = buildPageModel.buildPageModel(assembled.page);
  assert.equal(modelRes.ok, true, JSON.stringify(modelRes.errors || [], null, 2));
  assert.equal(modelRes.model.pageKind, "practice");
  assert.equal(modelRes.model.header.durationMinutes, 10);
  assert.equal(modelRes.model.orientationSections.length, 0);
  assert.equal(modelRes.model.studyTips, "");
  assert.equal(modelRes.model.editorialOpening, null);

  const rendered = renderLearnerPageHtml(assembled.page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.ok(rendered.html);
  assert.match(rendered.html, /Verify bundle feasibility directly/);
  assert.match(rendered.html, /10 minutes/);
  assert.doesNotMatch(rendered.html, /Knowledge summary/i);
  assert.doesNotMatch(rendered.html, /Study tips/i);
  assert.doesNotMatch(rendered.html, /<div class="util-editorial-opening"/);
  assert.doesNotMatch(rendered.html, />\s*—\s*</);

  const pkg = learnerPackage.buildLearnerPackage({
    html: rendered.html,
    title: assembled.page.title,
    pageSlug: "linear-constraint-check-practice"
  });
  assert.equal(pkg.ok, true, JSON.stringify(pkg.error || pkg, null, 2));
});

test("104M3 E2E (Richer Practice): multi-LO fallback parity, selected material beats, 1-2 criterion guided review, purposeful KS", () => {
  const { api } = boot();
  const wf = makePracticeWorkflow(18);

  // Verify multi-LO fallback prose addresses ALL mapped outcomes rather than only the first
  const multiLoShell = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Diagnosing multiplier claims — Practice",
    audience: "Intermediate microeconomics learners",
    learning_outcomes: [
      { id: "LO1", statement: "Identify whether a constrained optimum is established from first-order conditions." },
      { id: "LO2", statement: "Diagnose unsupported boundary or sign inferences in a candidate economic claim." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        archetype: "evaluate",
        beats: [
          { beat_id: "B1", function: "worked_thinking" },
          { beat_id: "B2", function: "independent_performance" },
          { beat_id: "B3", function: "verification" }
        ]
      }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "Audit the candidate multiplier argument",
        duration_minutes: 18,
        mapped_learning_outcomes: ["LO1", "LO2"],
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { beat_id: "B1", function: "worked_thinking" },
            { beat_id: "B2", function: "independent_performance" },
            { beat_id: "B3", function: "verification" }
          ]
        },
        learner_task: "—",
        expected_output: "—"
      }
    ],
    assembly_state: {
      current_stage: "episode_plan",
      enriched_by: ["episode_plan"],
      calls_model: true
    }
  };

  const fallbackEnriched = pageDla.enrichPageWithDla(multiLoShell, { practiceProduct: true });
  const fallbackActivity = fallbackEnriched.activities[0];
  assert.match(fallbackActivity.learner_task, /constrained optimum is established/i);
  assert.match(fallbackActivity.learner_task, /unsupported boundary or sign inferences/i);
  assert.match(fallbackActivity.expected_output, /constrained optimum is established/i);
  assert.match(fallbackActivity.expected_output, /unsupported boundary or sign inferences/i);
  // Material obligations from worked_thinking (worked_example) & verification (checklist) preserved
  assert.ok(
    fallbackActivity.required_materials.some((m) => m.type === "worked_example"),
    "worked_thinking beat must retain worked_example material obligation"
  );
  assert.ok(
    fallbackActivity.required_materials.some((m) => m.type === "checklist"),
    "verification beat must retain checklist material obligation"
  );

  // Now simulate model-authored rich DLA + GAM partials using 1-to-2 focused checklist criteria
  const richDlaPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    activities: [
      {
        activity_id: "A1",
        title: "Audit the candidate multiplier argument",
        learner_task:
          "1. Inspect the worked comparison on Problem X (distinct from Problem Y) to see how stationarity differs from sufficiency.\n2. Select whether Claim Y establishes an interior maximum.\n3. Write a concise justification stating what the first-order condition establishes and what boundary or second-order check is missing.\n4. Review your justification with the two verification criteria.",
        expected_output:
          "Selected classification for Claim Y plus a concise mathematical defence linking stationarity to the missing sufficiency check.",
        task_material_decision: {
          separate_inputs_required: true,
          reason: "Worked contrast on Problem X and structured Claim Y decision surface support the evaluation.",
          task_input_material_ids: ["A1-M1", "A1-M2", "A1-M3"]
        },
        evidence_decision: {
          required: false,
          reason: "Self-contained mathematical claim evaluation.",
          provider_material_ids: []
        },
        required_materials: [
          {
            material_id: "A1-M1",
            type: "worked_example",
            purpose: "modelling",
            specification: "Worked contrast on Problem X showing interior stationary point failing second-order sufficiency.",
            practice_independence: {
              attempt_operand_material_ids: ["A1-M2"]
            }
          },
          {
            material_id: "A1-M2",
            type: "selection",
            purpose: "response",
            specification: "Structured single_select decision evaluating whether Claim Y establishes a constrained maximum.",
            response_fulfilment: {
              kind: "learner_workspace",
              response_kind: "selection_choose"
            }
          },
          {
            material_id: "A1-M3",
            type: "template",
            purpose: "response",
            specification: "One concise Defence field explaining what Claim Y establishes and what remains unproven.",
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose"
            },
            response_fields: [{ label: "Defence", input_modality: "text" }]
          },
          {
            material_id: "A1-M4",
            type: "checklist",
            purpose: "feedback",
            specification: "Two-criterion diagnostic_review targeting stationarity vs sufficiency and boundary scope.",
            diagnostic_review: {
              covers_response_material_ids: ["A1-M3"]
            }
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "dla",
      enriched_by: ["episode_plan", "dla"],
      calls_model: true
    }
  };

  const dlaCheck = pageDla.validateDlaPartialPageCapture(richDlaPartial, {
    baseline: multiLoShell,
    practiceProduct: true
  });
  assert.equal(dlaCheck.ok, true, (dlaCheck.errors || []).join("; "));

  // Practice guided-review contract accepts BOTH 1-criterion and 2-criterion checklists cleanly
  const twoCriterionChecklistBody = {
    review_mode: "guided_criteria",
    criteria: [
      {
        statement: "Have you distinguished candidate stationarity from constrained optimality?",
        why_it_matters:
          "Collapsing stationary candidates into proven maxima leads to selecting boundary points or saddle candidates by mistake.",
        features: [
          {
            expected: "Stationary points from multiplier equations are framed as candidates only.",
            repair:
              "Qualify your opening claim so first-order multiplier satisfaction establishes a candidate rather than a proven maximum."
          }
        ],
        confirmation_label: "My defence distinguishes stationarity from sufficiency"
      },
      {
        statement: "Have you identified the missing sufficiency or boundary verification in Claim Y?",
        why_it_matters:
          "Without naming which bordered-Hessian curvature or boundary check is missing, the critique does not tell a reader how to complete the proof.",
        features: [
          {
            expected: "The exact missing second-order curvature or boundary check for Claim Y is named.",
            repair:
              "Specify the missing bordered-Hessian or feasible-boundary comparison needed before concluding Problem Y achieves a maximum."
          }
        ],
        confirmation_label: "My defence specifies the missing verification check"
      }
    ]
  };
  const oneCriterionChecklistBody = {
    review_mode: "guided_criteria",
    criteria: [twoCriterionChecklistBody.criteria[0]]
  };

  const practice2Check = guidedReviewContract.diagnoseGuidedReviewGenerationQuality(
    twoCriterionChecklistBody,
    { practiceProduct: true }
  );
  assert.equal(practice2Check.ok, true, JSON.stringify(practice2Check));
  assert.equal(practice2Check.diagnostics.length, 0);

  const practice1Check = guidedReviewContract.diagnoseGuidedReviewGenerationQuality(
    oneCriterionChecklistBody,
    { practiceProduct: true }
  );
  assert.equal(practice1Check.ok, true, JSON.stringify(practice1Check));
  assert.equal(practice1Check.diagnostics.length, 0);

  // Interactive STILL guards 3-4 criteria depth when practiceProduct is omitted/false
  const interactive1Check = guidedReviewContract.diagnoseGuidedReviewGenerationQuality(
    oneCriterionChecklistBody
  );
  assert.ok(
    interactive1Check.diagnostics.some((w) => w.code === "GUIDED_REVIEW_FEATURE_DEPTH_THIN"),
    "Interactive 1-criterion guided review must remain flagged as thin"
  );

  const richGamPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    activities: [
      {
        activity_id: "A1",
        materials: [
          {
            material_id: "A1-M1",
            material_type: "worked_example",
            title: "Worked example: Problem X",
            body_format: "markdown",
            body: "For Problem X, setting the gradient to zero yields a stationary saddle candidate at (1, 1); checking the constraint boundary at (4, 0) reveals a strictly higher objective."
          },
          {
            material_id: "A1-M2",
            material_type: "selection",
            title: "Does Claim Y establish an interior maximum?",
            body_format: "markdown",
            body: "Evaluate Claim Y: since the multiplier equations hold at (2, 3), Claim Y asserts (2, 3) must maximise the objective.",
            selection: {
              form: "single_select",
              prompt: "What does Claim Y actually establish?",
              options: [
                { key: "established", text: "It establishes a strict constrained maximum." },
                { key: "candidate_only", text: "It establishes a candidate stationary point only; sufficiency or boundary checks remain missing." },
                { key: "infeasible", text: "The point fails the equality constraint." }
              ],
              correct_answer: "candidate_only",
              feedback: "First-order conditions identify a feasible stationary candidate; establishing a maximum still requires curvature or boundary verification."
            }
          },
          {
            material_id: "A1-M3",
            material_type: "template",
            title: "Concise mathematical defence",
            body_format: "markdown",
            body: "**Defence:** Explain what the multiplier equations establish for Problem Y and what further condition would turn the candidate into an established maximum."
          },
          {
            material_id: "A1-M4",
            material_type: "checklist",
            title: "Check your mathematical defence",
            body_format: "structured_checklist",
            body: twoCriterionChecklistBody
          }
        ]
      }
    ],
    assembly_state: {
      current_stage: "gam",
      enriched_by: ["episode_plan", "dla", "gam"],
      calls_model: true
    }
  };

  const richLsPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    learning_sequence: {
      ordered_activity_ids: ["A1"],
      total_duration_minutes: 18,
      timeline: [{ activity_id: "A1", duration_minutes: 18 }]
    },
    assembly_state: {
      current_stage: "learning_sequence",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence"],
      calls_model: true
    }
  };

  const richDpPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Diagnosing multiplier claims — Practice",
    page_synthesis: {
      knowledge_summary: {
        body: "First-order Lagrange conditions locate feasible stationary candidates; establishing an extremum additionally requires curvature or boundary verification.",
        format: "markdown"
      }
    },
    editorial_opening_image: {
      decision: "generate",
      subject: "Geometric contour curves meeting a budget line without numerical labels",
      context: "Establish mathematical atmosphere showing tangency versus boundary crossing.",
      caption_intent: "Decorative mathematical framing — no solutions shown.",
      alt_text: "",
      detailed_description: "A clean decorative mathematical illustration of smooth level curves and a straight constraint boundary in warm muted tones, text-free without numbers or labels."
    },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [
      {
        activity_id: "A1",
        activity_visual_value: {
          decision: "none",
          rationale: "Problem structure is conveyed directly through the worked contrast and controls."
        }
      }
    ],
    visual_affordances: [],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"],
      calls_model: true
    }
  };

  assert.equal(
    api.validateLearningSequencePartialPageCapture(richLsPartial, {
      effectiveDurationMinutes: 18,
      practiceProduct: true,
      baselinePage: multiLoShell
    }).ok,
    true
  );
  assert.equal(api.validateDesignPagePartialPageCapture(richDpPartial, wf).ok, true);

  const assembled = assembleVNext.assembleVNextPageFromPartials({
    episode_plan: multiLoShell,
    dla: richDlaPartial,
    gam: richGamPartial,
    learning_sequence: richLsPartial,
    design_page: richDpPartial
  });
  assert.equal(assembled.ok, true);

  const modelRes = buildPageModel.buildPageModel(assembled.page);
  assert.equal(modelRes.ok, true, JSON.stringify(modelRes.errors || [], null, 2));
  assert.equal(modelRes.model.header.durationMinutes, 18);
  assert.ok(modelRes.model.editorialOpening);
  assert.equal(
    modelRes.model.orientationSections.map((s) => s.type).join(","),
    "knowledge_summary"
  );
  assert.equal(modelRes.model.studyTips, "");

  const rendered = renderLearnerPageHtml(assembled.page, { includeRuntimeScripts: true });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.match(rendered.html, /What does Claim Y actually establish\?/);
  assert.match(
    rendered.html,
    /Have you distinguished candidate stationarity from constrained optimality\?/
  );
  assert.match(
    rendered.html,
    /Have you identified the missing sufficiency or boundary verification in Claim Y\?/
  );
  assert.match(rendered.html, /18 minutes/);
  assert.match(rendered.html, /Knowledge summary/);
  assert.doesNotMatch(rendered.html, /Study tips/);
});

test("104M3 Contract & Interactive Guard: Practice exemplars removed; Interactive strictness untouched", () => {
  const { api } = boot();
  const practiceAll = practiceContracts.buildPracticePresentationContractBlock("all");
  assert.doesNotMatch(practiceAll, /A2-style|A3-style|A4-style|Improved mathematical defence/);
  assert.doesNotMatch(practiceAll, /typically 2–3/);

  // Interactive DLA contract remains unchanged
  const interactiveDlaText = dlaContract.assembleDlaCanonicalContract({ practiceProduct: false }).text;
  assert.match(interactiveDlaText, /intellectual_coherence_bridge REQUIRED on every activity including A1/);
  assert.doesNotMatch(interactiveDlaText, /Practice workload gate/);

  // Interactive GAM contract remains unchanged
  const interactiveGamText = gamContract.buildGamPageEnrichContractBlock();
  assert.match(interactiveGamText, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/);
  assert.match(interactiveGamText, /### Page learner-resource closure/);
  const interactiveAssembled = gamAssembler.assembleGamCanonicalPrompt({
    profile: gamAssembler.PROFILES.STUDIO_V2_PARTIAL,
    partialMode: true,
    practiceProduct: false,
    stepTitle: "Generate Activity Materials",
    stepIndex: 3,
    outputName: "page",
    adapters: {
      buildOutputContractAndShape: () => interactiveGamText
    }
  });
  assert.match(interactiveAssembled.text, /S78-D04 page learner-resource closure/);

  // Interactive page with missing materials / bridge / preamble still fails DLA validation
  const interactiveEmptyPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    page_kind: "interactive",
    activities: [
      {
        activity_id: "A1",
        title: "Explore concept",
        episode_plan: {
          archetype: "understand",
          beats: [{ beat_id: "B1", function: "independent_performance" }]
        },
        learner_task: "Examine the prompt and write a short reflection.",
        expected_output: "A short written reflection.",
        required_materials: []
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] }
  };
  const interactiveCheck = pageDla.validateDlaEnrichedPage(interactiveEmptyPage);
  assert.equal(interactiveCheck.ok, false);
  assert.ok(
    interactiveCheck.errors.some((e) => /activity_preamble/i.test(String(e))) &&
      interactiveCheck.errors.some((e) =>
        /required_materials required when episode_plan has beats|required_materials must contain at least 1/i.test(
          String(e)
        )
      ),
    (interactiveCheck.errors || []).join("; ")
  );

  // Interactive population contract still rejects self-contained activity with required_materials: []
  const interactivePop = populationContract.validatePopulationContract(
    interactiveEmptyPage.activities[0].episode_plan,
    interactiveEmptyPage.activities[0]
  );
  assert.equal(interactivePop.ok, false);

  // Interactive guided scaffold gate remains active for Interactive DLA captures
  const interactiveScaffoldEvidence = guidedScaffold.evaluateGuidedLearningScaffoldEvidence(
    interactiveEmptyPage.activities,
    { repairOptions: { page: interactiveEmptyPage } }
  );
  assert.equal(interactiveScaffoldEvidence.meetsGuidedLearningScaffoldQuality, false);
  const interactiveIssueFields =
    (interactiveScaffoldEvidence.issues[0] && interactiveScaffoldEvidence.issues[0].fields) || [];
  assert.ok(interactiveIssueFields.includes("activity_preamble"));
  assert.ok(interactiveIssueFields.includes("intellectual_coherence_bridge"));

  const interactiveWf = {
    id: "wf-s104-m3-interactive",
    product: "interactive",
    variant: "self_study",
    startingPoint: "generate_from_topic",
    goal: "Create an Interactive self-study learner page",
    desiredOutputs: "Learner-facing self-study page",
    selectedDomains: ["learning-design"],
    steps: [makePracticeDlaStep()]
  };
  api.setWorkflowsForTest([interactiveWf]);
  api.setSelectedWorkflowIdForTest(interactiveWf.id);
  const interactiveDlaCtx = api.buildWorkflowStepPromptAugmentContextFromStep(
    makePracticeDlaStep(),
    interactiveWf
  );
  const repairedInteractiveScaffold = api.applyGuidedLearningScaffoldRepairToDlaCapture(
    JSON.stringify(
      Object.assign({}, interactiveEmptyPage, {
        activities: [
          Object.assign({}, interactiveEmptyPage.activities[0], {
            activity_preamble: "Short.",
            intellectual_coherence_bridge: "Next."
          })
        ]
      }),
      null,
      2
    ),
    interactiveDlaCtx,
    "step_dla"
  );
  const repairedInteractiveParsed = JSON.parse(repairedInteractiveScaffold);
  assert.ok(
    String(repairedInteractiveParsed.activities[0].activity_preamble || "").split(/\s+/).length > 10,
    "Interactive scaffold repair must still expand terse Interactive preambles"
  );
});

test("Fractional timeline activity durations (2.5 + 2.5 = 5 min) reconcile accurately across validation, assembly, rendering, and workload estimation while rejecting genuine mismatches", () => {
  const { api } = boot();
  const interactiveWorkload = require("../lib/interactive-workload-feasibility-adapter");

  const twoActivityBaseline = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Retrieving the principles of statistical and causal reasoning",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    learning_outcomes: [
      { id: "LO1", statement: "Interpret statistical association and sensitivity comparisons accurately." },
      { id: "LO2", statement: "Distinguish statistical association from competing causal explanations." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO2"],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" },
            { function: "transition" }
          ]
        }
      }
    ],
    activities: [
      {
        activity_id: "A1",
        title: "Interpreting statistical evidence cases",
        mapped_learning_outcomes: ["LO1"],
        activity_preamble: "Retrieve key principles for reading economic relationships.",
        intellectual_coherence_bridge: "Connect prior statistical reasoning to three short cases.",
        reasoning_orientation: "Attend to direction, strength, and outlier sensitivity.",
        learner_task: "Select the warranted interpretation for each of the three cases.",
        expected_output: "Three selected interpretations.",
        materials: [{ material_id: "A1-M1", type: "worked_example", title: "Case summaries", content: "Three compact cases." }],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      },
      {
        activity_id: "A2",
        title: "Classifying causal reasoning cases",
        mapped_learning_outcomes: ["LO2"],
        activity_preamble: "Retrieve distinctions between association and competing causal explanations.",
        intellectual_coherence_bridge: "Move from statistical patterns to causal claims.",
        reasoning_orientation: "Distinguish direct causation, reverse causality, and confounding.",
        learner_task: "Select the warranted conclusion and classify the alternative explanations.",
        expected_output: "Three selected classifications.",
        materials: [{ material_id: "A2-M1", type: "worked_example", title: "Causal cases", content: "Three short causal cases." }],
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "activation" },
            { function: "explanation" },
            { function: "independent_performance" },
            { function: "verification" },
            { function: "transition" }
          ]
        }
      }
    ],
    assembly_state: {
      current_stage: "gam",
      enriched_by: ["episode_plan", "dla", "gam"]
    }
  };

  const validFractionalLs = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: {
      current_stage: "learning_sequence",
      enriched_by: ["learning_sequence"]
    },
    learning_sequence: {
      total_duration_minutes: 5,
      ordered_activity_ids: ["A1", "A2"],
      timeline: [
        {
          activity_id: "A1",
          duration_minutes: 2.5,
          start_seconds: 0,
          end_seconds: 150
        },
        {
          activity_id: "A2",
          duration_minutes: 2.5,
          start_seconds: 150,
          end_seconds: 300
        }
      ]
    }
  };

  // 1. Live C6 case: two 2.5-minute activities in a 5-minute commission must pass cleanly
  const okCheck = api.validateLearningSequencePartialPageCapture(validFractionalLs, {
    effectiveDurationMinutes: 5,
    practiceProduct: true,
    baselinePage: twoActivityBaseline
  });
  assert.equal(okCheck.ok, true, "2.5 + 2.5 = 5 must pass: " + (okCheck.errors || []).join("; "));

  // 2. Genuinely mismatched fractional timeline sum (2.5 + 2.4 = 4.9 vs 5) must fail
  const underSumLs = JSON.parse(JSON.stringify(validFractionalLs));
  underSumLs.learning_sequence.timeline[1].duration_minutes = 2.4;
  const underCheck = api.validateLearningSequencePartialPageCapture(underSumLs, {
    effectiveDurationMinutes: 5,
    practiceProduct: true,
    baselinePage: twoActivityBaseline
  });
  assert.equal(underCheck.ok, false);
  assert.ok(
    underCheck.errors.some((e) => /total_duration_minutes \(5\) must equal sum of timeline activity durations \(4\.9\)/.test(e)),
    "Expected exact fractional mismatch error (5 vs 4.9), got: " + underCheck.errors.join("; ")
  );

  // 3. Genuinely mismatched fractional timeline sum (2.5 + 2.6 = 5.1 vs 5) must fail
  const overSumLs = JSON.parse(JSON.stringify(validFractionalLs));
  overSumLs.learning_sequence.timeline[1].duration_minutes = 2.6;
  const overCheck = api.validateLearningSequencePartialPageCapture(overSumLs, {
    effectiveDurationMinutes: 5,
    practiceProduct: true,
    baselinePage: twoActivityBaseline
  });
  assert.equal(overCheck.ok, false);
  assert.ok(
    overCheck.errors.some((e) => /total_duration_minutes \(5\) must equal sum of timeline activity durations \(5\.1\)/.test(e)),
    "Expected exact fractional mismatch error (5 vs 5.1), got: " + overCheck.errors.join("; ")
  );

  // 4. Internally consistent 5.5 min against authoritative 5 min must fail
  const authMismatchLs = JSON.parse(JSON.stringify(validFractionalLs));
  authMismatchLs.learning_sequence.total_duration_minutes = 5.5;
  authMismatchLs.learning_sequence.timeline[1].duration_minutes = 3;
  const authCheck = api.validateLearningSequencePartialPageCapture(authMismatchLs, {
    effectiveDurationMinutes: 5,
    practiceProduct: true,
    baselinePage: twoActivityBaseline
  });
  assert.equal(authCheck.ok, false);
  assert.ok(
    authCheck.errors.some((e) => /learning_sequence total duration \(5\.5 min\) must match authoritative effective workflow duration \(5 min\)/.test(e)),
    "Expected authoritative duration mismatch error, got: " + authCheck.errors.join("; ")
  );

  // 5. Assembly & renderer preserve 2.5 per activity and 5 total without rounding 2.5 -> 3
  const assembled = assembleVNext.assembleVNextPageFromPartials({
    episode_plan: twoActivityBaseline,
    dla: twoActivityBaseline,
    gam: twoActivityBaseline,
    learning_sequence: validFractionalLs
  });
  assert.equal(assembled.ok, true, "Assembly must succeed: " + (assembled.errors || []).join("; "));
  assert.equal(assembled.page.activities[0].duration_minutes, 2.5);
  assert.equal(assembled.page.activities[1].duration_minutes, 2.5);

  const built = buildPageModel.buildPageModel(assembled.page);
  assert.equal(built.ok, true, JSON.stringify(built.errors || [], null, 2));
  assert.equal(built.model.activities[0].durationMinutes, 2.5);
  assert.equal(built.model.activities[1].durationMinutes, 2.5);
  assert.equal(built.model.header.durationMinutes, 5);

  const rendered = renderLearnerPageHtml(assembled.page, { includeRuntimeScripts: false });
  assert.equal(rendered.error, null, String(rendered.error || ""));
  assert.match(rendered.html, /2\.5 min/);
  assert.match(rendered.html, /5 minutes/);

  // 6. Workload feasibility adapter preserves 2.5 per activity and 5 total (not 3 + 3 = 6)
  const workload = interactiveWorkload.assessInteractivePageWorkload(
    assembled.page,
    twoActivityBaseline,
    { effectiveDurationMinutes: 5 }
  );
  assert.equal(workload.findings[0].input.declaredDurationMinutes, 2.5);
  assert.equal(workload.findings[1].input.declaredDurationMinutes, 2.5);
  assert.equal(workload.authoritativeDurationMinutes, 5);
});
