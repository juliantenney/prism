/**
 * Sprint 104 — Restored progressive Learning Journey workload-fidelity prompts
 * and Stage 4 advisory workload feasibility warnings with full lifecycle hygiene
 * (Stage 5 consistency, edits, upstream invalidation, reload, and clear-run).
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ljAssemble = require("../lib/learning-journey-assemble.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPrompts = require("../lib/learning-journey-sibling-prompts.js");
const ljShared = require("../lib/learning-journey-shared-source.js");
const workloadEstimator = require("../lib/workload-feasibility-estimator.js");
const ljWorkloadAdapter = require("../lib/learning-journey-workload-feasibility-adapter.js");
const { loadPrismAppJsTestApi, createPrismVmElementStub } = require("./prism-vm-lib-bootstrap.js");

const economicsStage4Fixture = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "s105-economics-stage4-commissions.json"),
    "utf8"
  )
);

function loadHarness() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/learning-journey-assemble.js",
      "lib/learning-journey-shared-source.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-sibling-prompts.js",
      "lib/workload-feasibility-estimator.js",
      "lib/learning-journey-workload-feasibility-adapter.js"
    ]
  });
  const host = loaded.window || loaded.sandbox;
  if (host) {
    host.PRISM_LEARNING_JOURNEY_ASSEMBLE = ljAssemble;
    host.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = ljShared;
    host.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = ljDesign;
    host.PrismLearningJourneySiblingPrompts = ljPrompts;
    host.PrismWorkloadFeasibilityEstimator = workloadEstimator;
    host.PrismLearningJourneyWorkloadFeasibilityAdapter = ljWorkloadAdapter;
  }
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_ASSEMBLE = ljAssemble;
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_SHARED_SOURCE = ljShared;
    loaded.sandbox.globalThis.PRISM_LEARNING_JOURNEY_DESIGN_PAGE = ljDesign;
    loaded.sandbox.globalThis.PrismLearningJourneySiblingPrompts = ljPrompts;
    loaded.sandbox.globalThis.PrismWorkloadFeasibilityEstimator = workloadEstimator;
    loaded.sandbox.globalThis.PrismLearningJourneyWorkloadFeasibilityAdapter = ljWorkloadAdapter;
  }
  return loaded;
}

function makeStepLi(step, initialValue) {
  const ta = createPrismVmElementStub();
  ta.value = initialValue || "";
  const statusEl = createPrismVmElementStub();
  const outName = createPrismVmElementStub();
  outName.value = step.outputName || "";
  const li = createPrismVmElementStub();
  let workloadNote = null;
  const attrs = { "data-step-id": step.id };
  const queryMap = {
    '[data-field="runStepOutput"]': ta,
    '[data-role="run-step-output-status"]': statusEl,
    '[data-field="outputName"]': outName
  };
  li.getAttribute = (k) => (Object.prototype.hasOwnProperty.call(attrs, k) ? attrs[k] : null);
  li.setAttribute = (k, v) => {
    attrs[k] = String(v);
  };
  li.appendChild = (node) => {
    if (
      node &&
      ((node.getAttribute && node.getAttribute("data-role") === "workload-feasibility-warning") ||
        (typeof node.className === "string" &&
          node.className.includes("workflow-run-workload-feasibility-warning")))
    ) {
      workloadNote = node;
    }
    return node;
  };
  li.querySelector = (sel) => {
    if (sel === '[data-role="workload-feasibility-warning"]') return workloadNote;
    return Object.prototype.hasOwnProperty.call(queryMap, sel) ? queryMap[sel] : null;
  };
  return {
    li,
    ta,
    statusEl,
    getWorkloadNote: () => workloadNote
  };
}

function makeProgressiveWorkflow(id, totalMinutes) {
  const mins = totalMinutes || 40;
  return {
    id,
    name: "Workload Fidelity Progressive Test Journey",
    product: "learning_journey",
    progressive_capture_version: ljAssemble.PROGRESSIVE_CAPTURE_VERSION,
    outputSpec: {
      partialPageOutputs: true,
      progressiveCaptureVersion: ljAssemble.PROGRESSIVE_CAPTURE_VERSION
    },
    steps: [
      {
        id: "s1",
        title: "Requirements",
        outputName: "learning_requirements",
        canonical_step_id: "step_journey_requirements"
      },
      {
        id: "s2",
        title: "Progression",
        outputName: "learning_progression",
        canonical_step_id: "step_journey_progression"
      },
      {
        id: "s3",
        title: "Elements",
        outputName: "learning_elements",
        canonical_step_id: "step_journey_elements"
      },
      {
        id: "s4",
        title: "Commissioning",
        outputName: "learning_commissions",
        canonical_step_id: "step_journey_commissioning"
      },
      {
        id: "s5",
        title: "Design Page",
        outputName: "learning_journey_page",
        canonical_step_id: "step_design_page"
      }
    ],
    workflowBriefResolution: {
      initialBrief: {
        product: "learning_journey",
        duration_minutes: mins,
        allocated_minutes: mins
      },
      resolvedFactors: {
        duration_contract_version: "s104_m1",
        progressive_capture_version: ljAssemble.PROGRESSIVE_CAPTURE_VERSION,
        duration_minutes: mins,
        allocated_minutes: mins,
        journey_allocated_minutes: mins
      }
    },
    deliverySeed: {
      duration_contract_version: "s104_m1",
      progressive_capture_version: ljAssemble.PROGRESSIVE_CAPTURE_VERSION
    }
  };
}

function makeStages(opts) {
  const o = opts || {};
  const total = o.totalMinutes || 40;
  const c1Mins = o.c1Mins != null ? o.c1Mins : 32;
  const c2Mins = o.c2Mins != null ? o.c2Mins : 8;
  const c2Spec =
    o.c2Spec ||
    "Introduce 2 unfamiliar datasets and require learners to write a 250-300 word analytical recommendation defending their judgement, interpret criterion-referenced feedback, and then revise their response. Declare elicitation_id E1.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Evaluate competing economic explanations using unfamiliar data.\",\"related_concepts\":[\"Causal inference\"],\"cognitive_level\":\"evaluate\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>";
  const stage1 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_requirements",
    journey_allocated_minutes: total,
    learning_outcomes: {
      learning_outcomes: [
        {
          statement: "Distinguish observed statistical association from causal claims.",
          related_concepts: ["Association", "Causation"],
          cognitive_level: "analyse"
        },
        {
          statement: "Evaluate competing economic explanations using unfamiliar data.",
          related_concepts: ["Causal inference"],
          cognitive_level: "evaluate"
        }
      ],
      learner_level: "First-year undergraduate"
    },
    learner_profile: "Introductory economics undergraduates.",
    purpose: "Develop proportionate causal reasoning from economic evidence.",
    body_of_knowledge: ["Association vs causation", "Alternative explanations"]
  };
  const stage2 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_progression",
    journey_structure: { mode: "single", rationale: "Single focused arc." },
    developmental_phases: [
      {
        phase_id: "P1",
        title: "Grounding and Applied Judgement",
        purpose: "Move from conceptual grounding to applied judgement.",
        indicative_minutes: total,
        scaffolding_and_evidence: "Worked grounding followed by practice.",
        dependencies: []
      }
    ],
    developmental_arc: "Grounding then applied judgement."
  };
  const stage3 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_elements",
    elements: [
      {
        element_id: "E1",
        phase_id: "P1",
        title: "Core grounding",
        educational_job: "Explain core concepts with worked examples.",
        knowledge_focus: "Association and causation.",
        indicative_minutes: c1Mins,
        scaffolding_and_feedback: "Worked contrasts.",
        dependencies: []
      },
      {
        element_id: "E2",
        phase_id: "P1",
        title: "Applied judgement",
        educational_job: "Apply causal reasoning to economic evidence.",
        knowledge_focus: "Competing explanations.",
        indicative_minutes: c2Mins,
        scaffolding_and_feedback: "Criterion feedback.",
        dependencies: ["E1"],
        journal_producer_candidate: true
      }
    ]
  };
  const stage4 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_commissions",
    shared_authoritative_material: { status: "none", content: "" },
    commissions: [
      {
        commission_id: "comm_1",
        section_id: "exp_1",
        order: 1,
        title: "Foundations of association and causation",
        product_id: "expository",
        status: "supported",
        allocated_minutes: c1Mins,
        specification_text:
          "Explain association versus causation with concise worked contrasts and brief embedded checks with explanatory feedback.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Distinguish observed statistical association from causal claims.\",\"related_concepts\":[\"Association\",\"Causation\"],\"cognitive_level\":\"analyse\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>",
        journey_context_text: "Opening commission. No recurring scenario.",
        dependencies: "",
        element_ids: ["E1"],
        relevant_journey_outcome_numbers: [1]
      },
      {
        commission_id: "comm_2",
        section_id: "exp_2",
        order: 2,
        title: "Evaluating competing economic explanations",
        product_id: "practice",
        status: "supported",
        allocated_minutes: c2Mins,
        specification_text: c2Spec,
        journey_context_text:
          "No recurring scenario. Commission comm_1 established the distinction between statistical association and causal claims.",
        dependencies: "comm_1",
        element_ids: ["E2"],
        relevant_journey_outcome_numbers: [2]
      }
    ],
    continuity: "Moves from conceptual grounding in comm_1 to applied judgement in comm_2.",
    journal: {
      enabled: false,
      decision_basis: "Single brief practice artefact does not require a multi-entry Journal."
    }
  };
  const stage5 = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Association and Causal Judgement",
    editorial_opening_image: {
      decision: "skip",
      skip_reason: "Direct entry into economic evidence without decorative cover art."
    },
    sections: [
      {
        section_id: "journey_intro",
        title: "Overview",
        order: 1,
        exposition: "A focused introduction to distinguishing association from causation."
      },
      {
        section_id: "exp_1",
        title: "Foundations of association and causation",
        order: 2,
        exposition: "Establish core concepts before applied judgement."
      },
      {
        section_id: "exp_2",
        title: "Evaluating competing economic explanations",
        order: 3,
        exposition: "Apply causal reasoning to economic evidence."
      }
    ],
    learning_journey: {
      design_intent: "Build clear causal reasoning proportionate to available study time."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
  return { stage1, stage2, stage3, stage4, stage5 };
}

test("1. Progressive LJ Stage 1-4 prompts restore S104 M4 workload-fidelity and effort-reconciliation requirements", () => {
  const p1 = ljPrompts.PROGRESSIVE_TEMPLATES.learning_requirements;
  const p2 = ljPrompts.PROGRESSIVE_TEMPLATES.learning_progression;
  const p3 = ljPrompts.PROGRESSIVE_TEMPLATES.learning_elements;
  const p4 = ljPrompts.PROGRESSIVE_TEMPLATES.learning_commissions;

  // Stage 1: complete learner effort + infeasibility surfacing without mutating outcomes/time
  assert.match(p1, /Account for complete learner effort \(reading\/evidence inspection, reasoning, response construction, and feedback engagement\)/i);
  assert.match(p1, /surface that infeasibility and trade-off transparently in constraints_and_tradeoffs/i);
  assert.match(p1, /Do NOT sequence phases\/weeks\/lessons, decompose into learning elements, or commission PRISM products/i);

  // Stage 2: cross-journey distribution, familiar vs unfamiliar evidence, beyond arithmetic
  assert.match(p2, /Distribute pedagogical functions across the journey/i);
  assert.match(p2, /prior-learning activation, evidence inspection \(charging familiar revisiting more lightly than unfamiliar first-pass material\), reasoning, response construction, and feedback engagement/i);
  assert.match(p2, /arithmetic reconciliation alone is insufficient/i);
  assert.match(p2, /Do NOT decompose into individual learning elements or commission PRISM products/i);

  // Stage 3: distinct non-redundant jobs + complete learner effort & achievability
  assert.match(p3, /builds on settled prior learning and familiar evidence/i);
  assert.match(p3, /prior-learning activation, distinguishing first-pass unfamiliar evidence inspection from revisiting familiar material, reasoning, practice\/response construction, and feedback\/revision engagement/i);
  assert.match(p3, /Arithmetic reconciliation alone is insufficient: verify that each element's scope is realistically achievable/i);
  assert.match(p3, /Do NOT select PRISM products or author full commission specifications yet/i);

  // Stage 4: all 5 required workload dimensions + mandatory pre-finalisation achievability verification
  assert.match(p4, /prior-learning activation/i);
  assert.match(p4, /unfamiliar vs familiar evidence inspection/i);
  assert.match(p4, /reasoning and decision-making/i);
  assert.match(p4, /response construction/i);
  assert.match(p4, /feedback engagement and revision/i);
  assert.match(p4, /Before finalising commissions\[\], verify the educational achievability of EVERY commission within its allocated_minutes — arithmetic reconciliation with journey_allocated_minutes alone is insufficient/i);
  assert.match(p4, /reconcile scope, staging, feedback\/revision load, or time allocation across commissions within the authoritative upstream constraints/i);
  assert.match(p4, /preserving educational purpose, intellectual demand, and meaningful learner performance/i);
  assert.match(p4, /Do not apply fixed duration tiers, forced product quotas, arbitrary outcome caps, arbitrary activity counts, arbitrary word-count limits, or rigid timing formulae/i);
  assert.match(p4, /surface that tension and its specific cause explicitly in feasibility_note/i);

  // No new schema keys added to Stage 4 allowed-key contract
  assert.doesNotMatch(p4, /"estimated_workload"/i);
  assert.doesNotMatch(p4, /"workload_warnings"/i);
});

test("2. Stage 4 surfaces non-blocking workload warnings before Stage 5 and matches Stage 5 assembled Design Page diagnostics", () => {
  const { api } = loadHarness();
  const wf = makeProgressiveWorkflow("wf-s104-s4-warn", 40);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const { stage1, stage2, stage3, stage4, stage5 } = makeStages();
  const lis = wf.steps.map((s) => makeStepLi(s, ""));
  const syncStep = (idx, obj) => {
    lis[idx].ta.value = JSON.stringify(obj, null, 2);
    api.syncWorkflowRunCapturedOutputToState(lis[idx].li, { source: "test_paste" });
  };

  syncStep(0, stage1);
  syncStep(1, stage2);
  syncStep(2, stage3);
  syncStep(3, stage4);

  // Stage 4 MUST remain accepted (advisory, non-blocking) while surfacing warnings before Stage 5 exists
  assert.equal(
    api.workflowRunStepHasBlockingCaptureErrors("s4"),
    false,
    "Stage 4 overload warnings must stay advisory, not blocking"
  );
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(wf.steps[3], "s4", wf, lis[3].li), true);
  assert.equal(api.isWorkflowRunStepCompletedForTest("s5"), false, "Stage 5 has not been generated yet");

  const s4WarnText = String(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4") || "");
  assert.ok(s4WarnText.length > 0, "Stage 4 must surface workload feasibility warnings immediately on capture");
  assert.match(s4WarnText, /Workload feasibility \(advisory, commission\): Evaluating competing economic explanations has an allocated duration of 8 minutes/i);
  assert.match(s4WarnText, /Workload feasibility \(advisory, journey\)/i);
  assert.match(lis[3].statusEl.textContent, /\(with warnings\)/i);
  assert.ok(lis[3].getWorkloadNote(), "Stage 4 UI must render advisory warning banner");
  assert.equal(lis[3].getWorkloadNote().hidden, false);
  assert.equal(lis[3].getWorkloadNote().textContent, s4WarnText);

  // Now capture Stage 5 and verify Stage 5 assembled Design Page diagnostics are identical & unduplicated
  syncStep(4, stage5);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s5"), false);
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(wf.steps[4], "s5", wf, lis[4].li), true);
  const s5WarnText = String(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5") || "");
  assert.equal(
    s5WarnText,
    s4WarnText,
    "Stage 5 assembled Design Page warnings must stay consistent with Stage 4 without drift or duplication"
  );
  // Ensure no duplicate commission warning line inside Stage 4 or Stage 5
  const s4Matches = s4WarnText.match(/Workload feasibility \(advisory, commission\):/g) || [];
  assert.equal(s4Matches.length, 1);
});

test("3. Real Economics Stage 4 fixture surfaces C2, C5, and C8 advisory warnings at Stage 4 capture without blocking acceptance", () => {
  const { api } = loadHarness();
  const wf = makeProgressiveWorkflow("wf-econ-s4-live-fixture", 90);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const econStage1 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_requirements",
    journey_allocated_minutes: 90,
    learning_outcomes: {
      learning_outcomes: [
        { statement: "Interpret bivariate economic data accurately.", cognitive_level: "apply" },
        { statement: "Recognise limitations of correlation.", cognitive_level: "analyse" },
        { statement: "Distinguish association from causation.", cognitive_level: "analyse" },
        { statement: "Construct competing causal explanations.", cognitive_level: "analyse" },
        { statement: "Evaluate causal claims using additional evidence.", cognitive_level: "evaluate" }
      ]
    },
    learner_profile: "First-year undergraduate economics students.",
    purpose: "Develop causal reasoning from economic evidence.",
    body_of_knowledge: ["Correlation", "Causation", "Confounding", "Reverse causality"]
  };
  const econStage2 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_progression",
    journey_structure: { mode: "single", rationale: "Single two-week arc." },
    developmental_phases: [
      {
        phase_id: "P1",
        title: "Full Economics Arc",
        purpose: "Build statistical and causal judgement.",
        indicative_minutes: 90,
        scaffolding_and_evidence: "Progressive scaffolding across shared datasets.",
        dependencies: []
      }
    ],
    developmental_arc: "Statistical interpretation to independent causal judgement."
  };
  const econStage3 = {
    artifact_type: "learning_journey_stage",
    schema_version: "1.0.0",
    stage: "learning_elements",
    elements: economicsStage4Fixture.commissions.map((c, idx) => ({
      element_id: c.element_ids[0],
      phase_id: "P1",
      title: c.title,
      educational_job: "Realise " + c.title,
      knowledge_focus: "Economics causal reasoning.",
      indicative_minutes: c.allocated_minutes,
      scaffolding_and_feedback: "Proportionate feedback.",
      dependencies: idx === 0 ? [] : [economicsStage4Fixture.commissions[idx - 1].element_ids[0]]
    }))
  };

  const gate = api.parseAndValidateProgressiveLearningJourneyStageCapture(
    JSON.stringify(economicsStage4Fixture),
    wf.steps[3],
    wf,
    {
      captures: {
        s1: JSON.stringify(econStage1),
        s2: JSON.stringify(econStage2),
        s3: JSON.stringify(econStage3)
      }
    }
  );
  assert.equal(gate.ok, true, "Economics Stage 4 must remain accepted (warnings advisory only)");
  // S104 final workload policy: C2 (11–24 vs 10 min / upper 15), C5 (9–21 vs 8 min / upper 12),
  // and C8 (10–23 vs 8 min / upper 12) sit at or below their shared upper indicative boundary,
  // so marginal overload warnings are appropriately suppressed while underlying estimates remain preserved.
  assert.equal(gate.warnings.length, 0, "Marginal overloads within shared indicative tolerance are suppressed");
});

test("4. Warning lifecycle stays accurate across Stage 4 edits, invalid/empty paste, upstream invalidation, reload, and clear-run", async () => {
  const { api } = loadHarness();
  const wf = makeProgressiveWorkflow("wf-s104-lifecycle", 40);
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  // Start with overloaded Stage 4 (c1=32, c2=8) and valid Stage 5
  const initial = makeStages({ totalMinutes: 40, c1Mins: 32, c2Mins: 8 });
  const lis = wf.steps.map((s) => makeStepLi(s, ""));
  const syncStep = (idx, objOrText) => {
    lis[idx].ta.value =
      typeof objOrText === "string" ? objOrText : JSON.stringify(objOrText, null, 2);
    api.syncWorkflowRunCapturedOutputToState(lis[idx].li, { source: "test_paste" });
  };

  syncStep(0, initial.stage1);
  syncStep(1, initial.stage2);
  syncStep(2, initial.stage3);
  syncStep(3, initial.stage4);
  syncStep(4, initial.stage5);

  const initialS4Warn = String(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4") || "");
  const initialS5Warn = String(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5") || "");
  assert.ok(initialS4Warn.length > 0 && initialS5Warn === initialS4Warn);

  // (a) Reload / hydration restores identical Stage 4 & Stage 5 warnings without duplication,
  //     and corrupted upstream capture on reload clears Stage 4 & Stage 5 warnings cleanly.
  const persistedCaptures = {
    s1: JSON.stringify(initial.stage1, null, 2),
    s2: JSON.stringify(initial.stage2, null, 2),
    s3: JSON.stringify(initial.stage3, null, 2),
    s4: JSON.stringify(initial.stage4, null, 2),
    s5: JSON.stringify(initial.stage5, null, 2)
  };
  api.saveWorkflowRunStateStoreForTest({
    [wf.id]: {
      capturedOutputs: persistedCaptures,
      capturedOutputsRaw: persistedCaptures,
      stepCompleted: { s1: true, s2: true, s3: true, s4: true, s5: true }
    }
  });
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), initialS4Warn);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), initialS5Warn);
  const reval = api.revalidateProgressiveLearningJourneyCapturesAfterHydration(wf.id, {
    captures: persistedCaptures,
    capturesRaw: persistedCaptures
  });
  assert.equal(reval.ok, true);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), initialS4Warn);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), initialS5Warn);

  // Corrupted upstream Stage 3 on hydration must clear Stage 4 & Stage 5 warnings (no stale warnings)
  const corruptedCaptures = Object.assign({}, persistedCaptures, {
    s3: JSON.stringify({
      artifact_type: "learning_journey_stage",
      schema_version: "1.0.0",
      stage: "learning_elements",
      elements: []
    })
  });
  const revalCorrupt = api.revalidateProgressiveLearningJourneyCapturesAfterHydration(wf.id, {
    captures: corruptedCaptures,
    capturesRaw: corruptedCaptures
  });
  assert.equal(revalCorrupt.ok, false);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), "");
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), "");

  // Restore clean valid captures before edit tests
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), initialS4Warn);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), initialS5Warn);

  // (b) Edit Stage 4 to resolve overload (reconcile scope to bounded selected-response check in 8 min,
  //     keeping total 40 min). Must immediately clear Stage 4 warning AND invalidate Stage 5 warning
  //     without consulting stale deliverySeed durations.
  const reconciled = makeStages({
    totalMinutes: 40,
    c1Mins: 32,
    c2Mins: 8,
    c2Spec:
      "Create an eight-minute practice activity revisiting familiar evidence with concise selected-response questions and immediate explanatory feedback.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Evaluate competing economic explanations using unfamiliar data.\",\"related_concepts\":[\"Causal inference\"],\"cognitive_level\":\"evaluate\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>"
  });
  syncStep(3, reconciled.stage4);
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s4"), false);
  assert.equal(
    api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"),
    "",
    "Reconciling Stage 4 overload must clear Stage 4 warning immediately"
  );
  assert.equal(
    api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"),
    "",
    "Editing Stage 4 must clear invalidated Stage 5 warning immediately"
  );
  assert.equal(lis[3].getWorkloadNote().hidden, true);

  // Also test rebalancing durations across commissions so stale
  // deliverySeed.commissioned_component_durations.comm_2 (8 min) is NEVER reused:
  // (1) Heavy comm_2 reallocated from 8 -> 30 min immediately updates warning copy to "allocated 30 minutes".
  const reallocatedHeavy = makeStages({ totalMinutes: 40, c1Mins: 10, c2Mins: 30 });
  syncStep(2, reallocatedHeavy.stage3);
  syncStep(3, makeStages({ totalMinutes: 40, c1Mins: 32, c2Mins: 8 }).stage4);
  assert.match(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), /allocated duration of 8 minutes/);
  syncStep(3, reallocatedHeavy.stage4);
  assert.match(
    api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"),
    /allocated duration of 30 minutes/,
    "Increasing comm_2 from 8 to 30 min in Stage 4 must use the new 30-min allocation, not stale deliverySeed 8 min"
  );
  // (2) Moderate constructed-response + evaluation comm_2 (~10-22 min) warns at 5 min (upper boundary 7) and clears cleanly when reallocated to 20 min.
  const moderateSpec =
    "Revisiting the familiar dataset from comm_1, learners construct two distinct alternative causal explanations in a written response, evaluate which assumption each depends on, and inspect criterion-referenced feedback.\n<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>\n{\"learning_outcomes\":[{\"statement\":\"Evaluate competing economic explanations using unfamiliar data.\",\"related_concepts\":[\"Causal inference\"],\"cognitive_level\":\"evaluate\"}]}\n<<<COMPONENT_LEARNING_OUTCOMES_END>>>";
  syncStep(3, makeStages({ totalMinutes: 40, c1Mins: 35, c2Mins: 5, c2Spec: moderateSpec }).stage4);
  assert.match(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), /allocated duration of 5 minutes/);
  syncStep(3, makeStages({ totalMinutes: 40, c1Mins: 20, c2Mins: 20, c2Spec: moderateSpec }).stage4);
  assert.equal(
    api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"),
    "",
    "Reallocating moderate comm_2 from 5 to 20 min must clear the Stage 4 warning cleanly"
  );

  // (c) Re-paste tight Stage 4, then paste invalid JSON -> must clear warning (no stale warning alongside error)
  syncStep(3, initial.stage4);
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"));
  syncStep(3, "{ invalid json");
  assert.equal(api.workflowRunStepHasBlockingCaptureErrors("s4"), true);
  assert.equal(
    api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"),
    "",
    "Invalid Stage 4 capture must not leave stale workload warnings behind"
  );

  // (d) Re-paste tight Stage 4 + Stage 5, then edit Stage 1 -> upstream invalidation clears both s4 & s5 warnings
  syncStep(3, initial.stage4);
  syncStep(4, initial.stage5);
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"));
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"));
  const editedStage1 = Object.assign({}, initial.stage1, {
    purpose: "Develop sharp, time-proportionate causal judgement in introductory economics."
  });
  syncStep(0, editedStage1);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), "");
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), "");

  // (e) Re-populate all 5 stages, then Clear run data -> clears all warnings, and reload stays clean
  syncStep(1, initial.stage2);
  syncStep(2, initial.stage3);
  syncStep(3, initial.stage4);
  syncStep(4, initial.stage5);
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"));
  assert.ok(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"));
  await api.executeClearWorkflowRunData(wf.id);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), "");
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), "");
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s4"), "");
  assert.equal(api.getWorkflowRunWorkloadFeasibilityWarningsForTest("s5"), "");
});
