/**
 * Sprint 101E — Practice progressive interaction design guidance.
 * Heuristic only; grounded in existing response surfaces; Practice-route only.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const { loadPrismAppJsTestApi, DEFAULT_LIBS } = require("./prism-vm-lib-bootstrap.js");

function boot() {
  return loadPrismAppJsTestApi({ libs: DEFAULT_LIBS.slice() });
}

function practiceWf() {
  return {
    product: "practice",
    startingPoint: "generate_from_topic",
    goal: "Practice progressive interaction",
    desiredOutputs: "Practice learner page",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true }
  };
}

function interactiveWf() {
  return {
    product: "interactive",
    variant: "self_study",
    startingPoint: "generate_from_topic",
    goal: "Interactive learner page",
    desiredOutputs: "Learner-facing page",
    selectedDomains: ["learning-design"],
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true }
  };
}

test("101E progressive: contract version and heuristic markers", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /104M3-PRACTICE-RECONCILED-V1/);
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /Progressive interaction demand/);
  assert.match(dla, /NOT a mandatory five-stage template/i);
  assert.match(dla, /Minimise unnecessary typing/i);
  assert.match(dla, /table_entry/);
  assert.match(dla, /input_modality "text" \| "math"/);
  assert.match(dla, /ordering \/ sequencing \/ ranking/i);
  assert.match(dla, /single_select/);
  assert.match(dla, /multi_select/);
  assert.match(dla, /diagnostic_review/);
  assert.match(dla, /Do NOT request dropdown-in-cell/i);
  assert.match(dla, /criterion-based self-evaluation/i);
  assert.match(dla, /Check your work/);
  assert.doesNotMatch(dla, /mandatory five-stage template must be followed/i);
});

test("101E progressive: stage scoping — DLA gets repertoire; DP does not redesign interactions", () => {
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");
  const ls = practiceContracts.buildPracticePresentationContractBlock("learning_sequence");
  const dp = practiceContracts.buildPracticePresentationContractBlock("design_page");
  const ep = practiceContracts.buildPracticePresentationContractBlock("episode_plan");

  assert.match(dla, /Design Learning Activities \(Practice\)/);
  assert.match(dla, /Supported learner response repertoire/);
  assert.doesNotMatch(dla, /Design Page \(Practice\)/);

  assert.match(gam, /Generate Activity Materials \(Practice\)/);
  assert.match(gam, /Honour DLA-commissioned response surfaces/);
  assert.match(gam, /Do not invent dropdown/);
  assert.doesNotMatch(gam, /Progressive interaction demand/);

  assert.match(ls, /rising demand|confidence-building/i);
  assert.doesNotMatch(ls, /Supported learner response repertoire/);

  assert.match(ep, /rising intellectual demand/i);
  assert.doesNotMatch(ep, /Supported learner response repertoire/);

  assert.match(dp, /page_kind "practice"/);
  assert.match(dp, /Do not redesign activity interaction surfaces/);
  assert.doesNotMatch(dp, /Supported learner response repertoire/);
  assert.doesNotMatch(dp, /Progressive interaction demand/);
});

test("101E progressive: Practice DLA runtime receives progressive guidance; Interactive does not", () => {
  const { api } = boot();
  const practiceDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Practice learning activities.\n",
    {
      canonical_step_id: "step_design_learning_activities",
      canonical_title: "Design Learning Activities",
      title: "Design Learning Activities"
    },
    practiceWf(),
    {}
  );
  assert.match(practiceDla, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.match(practiceDla, /Progressive interaction demand/);
  assert.match(practiceDla, /Supported learner response repertoire/);
  assert.match(practiceDla, /table_entry/);
  assert.doesNotMatch(practiceDla, /Design Page \(Practice\)/);

  const practiceGam = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate Practice materials.\n",
    {
      canonical_step_id: "step_generate_activity_materials",
      canonical_title: "Generate Activity Materials",
      title: "Generate Activity Materials"
    },
    practiceWf(),
    {}
  );
  assert.match(practiceGam, /Honour DLA-commissioned response surfaces/);
  assert.doesNotMatch(practiceGam, /Progressive interaction demand/);

  const interactiveDla = api.applyWorkflowStepRuntimePromptAugmentations(
    "Design Interactive learning activities.\n",
    {
      canonical_step_id: "step_design_learning_activities",
      canonical_title: "Design Learning Activities",
      title: "Design Learning Activities"
    },
    interactiveWf(),
    {}
  );
  assert.doesNotMatch(interactiveDla, /LD-PRACTICE-PRESENTATION-CONTRACTS \(auto-applied\)/i);
  assert.doesNotMatch(interactiveDla, /Progressive interaction demand/);
  assert.doesNotMatch(
    interactiveDla,
    /101G-CONTROL-LED-JUSTIFICATION|101F-PRACTICE-WORKLOAD|101E-PRACTICE-SELECTION-PAYLOAD/
  );
  assert.doesNotMatch(interactiveDla, /101E-PRACTICE-PROGRESSIVE/);
});

test("101E progressive: Practice promptRoute preserved; full block still available", () => {
  const family = require("../lib/first-class-workflow-family.js");
  assert.equal(
    family.promptRouteForWorkflow({ product: "practice", startingPoint: "generate_from_topic" }),
    "practice"
  );
  const all = practiceContracts.buildPracticePresentationContractBlock("all");
  assert.match(all, /Design Learning Activities \(Practice\)/);
  assert.match(all, /Generate Activity Materials \(Practice\)/);
  assert.match(all, /Design Page \(Practice\)/);
  assert.match(all, /Never thin Interactive contracts/);
});
