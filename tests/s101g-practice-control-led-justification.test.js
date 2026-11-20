/**
 * Sprint 101G — Practice prefers control-led reasoning + concise justification.
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
    goal: "Practice transfer between equivalent constraints",
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

test("101G: Practice contract version marks control-led justification", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /101G-CONTROL-LED-JUSTIFICATION/);
});

test("101G: Practice DLA guidance prefers control-led reasoning with concise justification", () => {
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /control-led reasoning with concise justification/i);
  assert.match(dla, /Minimise typing, not thinking/i);
  assert.match(dla, /ONE concise independent justification/i);
  assert.match(dla, /connected decisions|decision chain|connected selection/i);
  assert.match(dla, /not a restatement of (the )?selected/i);
  assert.match(dla, /A2-style/i);
  assert.match(dla, /A3-style/i);
  assert.match(dla, /inverse change in the multiplier/i);
  assert.match(dla, /constrained extrema disappear/i);
  assert.match(dla, /Do not impose this pattern universally/i);
  assert.match(dla, /Practice workload economy/);
  assert.match(dla, /typically 2–3/);
  assert.match(dla, /hard max 4/);
});

test("101G: Practice DLA assemble gate encodes preferred hybrid pattern", () => {
  const practice = dlaContract.assembleDlaCanonicalContract({ practiceProduct: true });
  const interactive = dlaContract.assembleDlaCanonicalContract({ practiceProduct: false });

  assert.match(practice.text, /control-led reasoning with one concise independent justification/i);
  assert.match(practice.text, /Preferred compound pattern \(Sprint 101G\)/i);
  assert.match(practice.text, /ONE concise independent template\/text justification field/i);
  assert.match(practice.text, /specific explanatory relationship/i);
  assert.match(practice.text, /not a restatement of selected labels/i);
  assert.match(practice.text, /Practice workload gate/);
  assert.match(practice.text, /do NOT mandate a checklist for every production activity/i);
  assert.match(practice.text, /do NOT mandate a culminating transfer/i);

  assert.doesNotMatch(interactive.text, /Sprint 101G/);
  assert.doesNotMatch(interactive.text, /control-led reasoning with one concise/);
  assert.doesNotMatch(interactive.text, /Practice workload gate/);
});

test("101G: GAM preserves commissioned control-plus-justification and does not invent writing", () => {
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");
  assert.match(gam, /control-led \+ concise-justification structure|Realise the preferred control-led/i);
  assert.match(gam, /exactly the commissioned justification template field/i);
  assert.match(gam, /Do not invent transfer_prompt/);
  assert.match(gam, /additional textareas that DLA did not commission/i);
  assert.match(gam, /not \"restate your selections\"|not a restatement/i);
  assert.match(gam, /GAM-SEL-01/);
  assert.match(gam, /do not weaken GAM-SEL validation/i);
  assert.match(gam, /criterion-based self-review|focused criteria/i);
});

test("101G: EP hints at control-led compound decisions", () => {
  const ep = practiceContracts.buildPracticePresentationContractBlock("episode_plan");
  assert.match(ep, /control-led compound decisions/i);
  assert.match(ep, /concise justification/i);
});

test("101G: Runtime Practice prompts carry pattern; Interactive and Assessment Pack unaffected", () => {
  const { api } = boot();

  const practiceDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Practice learning activities.\n",
    dlaStep(),
    practiceWf(),
    {}
  );
  assert.match(practiceDla, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.match(practiceDla, /control-led reasoning with concise justification/i);
  assert.match(practiceDla, /Practice workload gate|Preferred compound pattern \(Sprint 101G\)/);
  assert.match(practiceDla, /do NOT mandate a culminating transfer/i);

  const practiceGam = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate Practice materials.\n",
    gamStep(),
    practiceWf(),
    {}
  );
  assert.match(practiceGam, /Do not invent transfer_prompt/);
  assert.match(practiceGam, /concise justification/i);
  assert.match(practiceGam, /GAM-SEL-01/);

  const interactiveDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Interactive learning activities.\n",
    dlaStep(),
    interactiveWf(),
    {}
  );
  assert.doesNotMatch(interactiveDla, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.doesNotMatch(interactiveDla, /Sprint 101G/);
  assert.doesNotMatch(interactiveDla, /control-led reasoning with concise justification/i);

  const assessmentDraft = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design assessment.\n",
    {
      canonical_step_id: "step_design_assessment",
      canonical_title: "Design Assessment",
      title: "Design Assessment"
    },
    {
      product: "assessment_pack",
      startingPoint: "generate_from_topic",
      goal: "Assessment pack",
      desiredOutputs: "Assessment evidence page",
      selectedDomains: ["learning-design"]
    },
    {}
  );
  assert.doesNotMatch(assessmentDraft, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.doesNotMatch(assessmentDraft, /control-led reasoning/);
  assert.doesNotMatch(assessmentDraft, /Practice workload economy/);
});

test("101G: Structured selection validation markers remain intact in Practice GAM contract", () => {
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");
  assert.match(gam, /REQUIRED sibling field selection/);
  assert.match(gam, /FORBIDDEN for selection/);
  assert.match(gam, /GAM-SEL-01/);
  assert.match(gam, /material_type\": \"selection\"|material_type \"selection\"/);
  assert.match(gam, /single_select/);
  assert.match(gam, /correct_answer/);
});

test("101G: Sprint 101F workload safeguards remain active", () => {
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  const practice = dlaContract.assembleDlaCanonicalContract({ practiceProduct: true });

  assert.match(dla, /Practice workload economy/);
  assert.match(dla, /Do not automatically commission transfer_prompt/i);
  assert.match(dla, /hard max 4/);
  assert.match(practice.text, /do NOT mandate a checklist for every production activity/i);
  assert.match(practice.text, /do NOT mandate a culminating transfer/i);
  assert.match(practice.text, /intellectual_coherence_bridge \(Practice-gated\): optional/i);
  assert.match(practice.text, /DR-1 \/ S78-WS-3 closure \(Practice-gated\)/);
});
