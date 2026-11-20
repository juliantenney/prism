/**
 * Sprint 101F — Practice workload proportion: DLA/GAM gates + slot leak closed.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const { loadPrismAppJsTestApi, DEFAULT_LIBS } = require("./prism-vm-lib-bootstrap.js");

function boot() {
  return loadPrismAppJsTestApi({ libs: DEFAULT_LIBS.slice() });
}

function practiceWf() {
  return {
    product: "practice",
    startingPoint: "generate_from_topic",
    goal: "Practice claim evaluation for multipliers",
    desiredOutputs: "Practice learner page with activities and materials",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    duration: "12 minutes"
  };
}

function interactiveWf() {
  return {
    product: "interactive",
    variant: "self_study",
    startingPoint: "generate_from_topic",
    goal: "Interactive self-study learner page",
    desiredOutputs: "Learner-facing interactive page with knowledge summary",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    duration: "60 minutes"
  };
}

function dlaStep() {
  return {
    canonical_step_id: "step_design_learning_activities",
    canonical_title: "Design Learning Activities",
    title: "Design Learning Activities"
  };
}

function gamStep() {
  return {
    canonical_step_id: "step_generate_activity_materials",
    canonical_title: "Generate Activity Materials",
    title: "Generate Activity Materials"
  };
}

test("101F: Practice presentation version and workload economy markers", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /101[FG]-/);
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");
  const dp = practiceContracts.buildPracticePresentationContractBlock("design_page");

  assert.match(dla, /Practice workload economy/);
  assert.match(dla, /Minimise typing, not thinking|minimise typing, not thinking/i);
  assert.match(dla, /Improved mathematical defence/);
  assert.match(dla, /Proportionate criteria/);
  assert.match(dla, /typically 2–3/);
  assert.match(gam, /Do not invent transfer_prompt/);
  assert.match(gam, /Practice workload economy/);
  assert.match(gam, /hard max 4/);
  assert.match(dp, /retain concise, skippable Overview/i);
  assert.match(dp, /Knowledge summary/);
  assert.doesNotMatch(dp, /Knowledge summary.*NOT mandatory/i);
});

test("101F: DLA assemble with practiceProduct softens mandates; Interactive defaults retained", () => {
  const practice = dlaContract.assembleDlaCanonicalContract({ practiceProduct: true });
  const interactive = dlaContract.assembleDlaCanonicalContract({ practiceProduct: false });

  assert.match(practice.text, /Practice workload gate/);
  assert.match(practice.text, /Practice-gated/);
  assert.match(practice.text, /do NOT mandate a checklist for every production activity/i);
  assert.match(practice.text, /do NOT mandate a culminating transfer/i);
  assert.match(practice.text, /intellectual_coherence_bridge \(Practice-gated\): optional/i);
  assert.match(practice.text, /ONE integrated template\/text field|ONE integrated/i);
  assert.match(practice.text, /DR-1 \/ S78-WS-3 closure \(Practice-gated\)/);

  assert.doesNotMatch(interactive.text, /Practice workload gate/);
  assert.doesNotMatch(interactive.text, /Practice-gated/);
  assert.match(
    interactive.text,
    /S78-WS-3 diagnostic review: when an activity requires substantive independent learner production/
  );
  assert.match(
    interactive.text,
    /intellectual_coherence_bridge REQUIRED on every activity including A1/
  );
  assert.match(
    interactive.text,
    /DR-1 \/ S78-WS-3 closure: when substantive independent learner production exists/
  );
});

test("101F: buildDlaCanonicalSlotContext blocks guided-learning/workbook for Practice", () => {
  const { api } = boot();
  const practiceCtx = {
    workflowGoal: practiceWf().goal,
    desiredOutputs: practiceWf().desiredOutputs,
    ...dlaStep()
  };
  const interactiveCtx = {
    workflowGoal: interactiveWf().goal,
    desiredOutputs: interactiveWf().desiredOutputs,
    ...dlaStep()
  };

  const practiceSlot = api.buildDlaCanonicalSlotContext(practiceCtx, practiceWf());
  assert.equal(practiceSlot.practiceProduct, true);
  assert.equal(practiceSlot.workbookOverlay, false);
  assert.equal(String(practiceSlot.overlayText || "").trim(), "");
  assert.doesNotMatch(
    String(practiceSlot.productionSlot || ""),
    /LD-GUIDED-LEARNING-SCAFFOLD|guided-learning scaffold|self_explanation_prompt 35/i
  );
  assert.doesNotMatch(
    String(practiceSlot.productionSlot || ""),
    /DLA-WB-01|workbook_contract_applied/
  );

  const interactiveSlot = api.buildDlaCanonicalSlotContext(interactiveCtx, interactiveWf());
  assert.equal(interactiveSlot.practiceProduct, false);
  // Interactive learner-page framing should still be able to enable workbook overlay.
  assert.equal(interactiveSlot.workbookOverlay, true);
  assert.match(String(interactiveSlot.overlayText || ""), /DLA-WB-01|self_study_workbook|workbook/i);
  assert.match(
    String(interactiveSlot.productionSlot || ""),
    /LD-GUIDED-LEARNING-SCAFFOLD|Learner-page|intellectual_coherence_bridge/i
  );
});

test("101F: Practice DLA runtime prompt has gated shared contract + Practice overlay", () => {
  const { api } = boot();
  const practiceDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Practice learning activities.\n",
    dlaStep(),
    practiceWf(),
    {}
  );
  assert.match(practiceDla, /Practice workload gate|Practice-gated/);
  assert.match(practiceDla, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.match(practiceDla, /Practice workload economy/);
  assert.match(practiceDla, /Improved mathematical defence/);
  assert.doesNotMatch(practiceDla, /DLA-WB-01/);
  assert.doesNotMatch(
    practiceDla,
    /intellectual_coherence_bridge REQUIRED on every activity including A1/
  );

  const interactiveDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Interactive learning activities.\n",
    dlaStep(),
    interactiveWf(),
    {}
  );
  assert.doesNotMatch(interactiveDla, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.doesNotMatch(interactiveDla, /Practice workload economy/);
  assert.match(
    interactiveDla,
    /intellectual_coherence_bridge REQUIRED on every activity including A1/
  );
});

test("101F: Practice GAM runtime stays economical; does not invent uncommissioned transfer", () => {
  const { api } = boot();
  const practiceGam = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate Practice materials.\n",
    gamStep(),
    practiceWf(),
    {}
  );
  assert.match(practiceGam, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.match(practiceGam, /Do not invent transfer_prompt/);
  assert.match(practiceGam, /Practice workload economy/);
  assert.match(practiceGam, /selection/);
  assert.match(practiceGam, /hard max 4|typically 2–3/);

  const interactiveGam = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate Interactive materials.\n",
    gamStep(),
    interactiveWf(),
    {}
  );
  assert.doesNotMatch(interactiveGam, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.doesNotMatch(interactiveGam, /Practice workload economy/);
});

test("101F: Assessment Pack route unchanged by Practice workload gates", () => {
  const { api } = boot();
  const assessmentWf = {
    product: "assessment_pack",
    startingPoint: "generate_from_topic",
    goal: "Assessment pack",
    desiredOutputs: "Assessment evidence page",
    selectedDomains: ["learning-design"]
  };
  const draft = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design assessment.\n",
    {
      canonical_step_id: "step_design_assessment",
      canonical_title: "Design Assessment",
      title: "Design Assessment"
    },
    assessmentWf,
    {}
  );
  assert.doesNotMatch(draft, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.doesNotMatch(draft, /Practice workload economy/);
  assert.doesNotMatch(draft, /Practice workload gate/);
});

test("101F: A4-style integrated defence example is present for Practice authors", () => {
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /A4-style economy/i);
  assert.match(dla, /Improved mathematical defence/);
  assert.match(dla, /My initial judgement/);
  assert.match(dla, /Peer feedback/);
  assert.match(dla, /single coherent explanation/);
});

test("101F: Practice DLA capture does not fail-closed without diagnostic_review; Interactive still does", () => {
  const pageDla = require("../lib/page-dla-enrich.js");
  const diagnostic = require("../lib/dla-diagnostic-review.js");

  const activity = {
    activity_id: "A2",
    title: "Apply the method independently",
    learner_task:
      "1. Study the reference summary.\n2. Review the worked pattern.\n3. Enter your responses into a comparison table for Entity A and Entity B across the listed dimensions.",
    expected_output:
      "A completed comparison table with justified contrasts between Entity A and Entity B.",
    activity_preamble: "Apply the method to the supplied problem.",
    intellectual_coherence_bridge: "Build on the prior modelled method with an independent attempt.",
    task_material_decision: {
      separate_inputs_required: true,
      task_input_material_ids: ["A2-M1"]
    },
    evidence_decision: {
      required: false,
      reason: "Procedural operand; no evidence inference required.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A2-M1",
        material_type: "scenario",
        purpose: "Supply the independent problem instance.",
        specification: "One distinct problem statement without the target solution."
      },
      {
        material_id: "A2-W1",
        material_type: "comparison_table",
        purpose: "Record learner comparisons across the listed dimensions.",
        specification: "Editable comparison table; learners complete all substantive cells.",
        response_fulfilment: {
          kind: "learner_workspace",
          response_kind: "table_compare",
          binds_production_steps: [3]
        }
      }
    ]
  };

  assert.equal(diagnostic.activityRequiresDiagnosticReview(activity), true);
  assert.equal(
    diagnostic.activityRequiresDiagnosticReview(activity, { practiceProduct: true }),
    false
  );

  const practicePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [JSON.parse(JSON.stringify(activity))]
  };
  const practiceCapture = pageDla.validateDlaPartialPageCapture(practicePage);
  assert.equal(
    practiceCapture.ok,
    true,
    JSON.stringify(practiceCapture.errors || [], null, 2)
  );
  assert.equal(
    (practiceCapture.errors || []).some((e) => /S78_DR_MISSING_REVIEW/.test(e)),
    false
  );

  const interactivePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    page_kind: "interactive",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [JSON.parse(JSON.stringify(activity))]
  };
  const interactiveCapture = pageDla.validateDlaPartialPageCapture(interactivePage);
  assert.equal(interactiveCapture.ok, false);
  assert.ok(
    (interactiveCapture.errors || []).some((e) => /S78_DR_MISSING_REVIEW/.test(e)),
    JSON.stringify(interactiveCapture.errors || [], null, 2)
  );
});
