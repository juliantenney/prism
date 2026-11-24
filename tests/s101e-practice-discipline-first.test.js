/**
 * Sprint 101E — Discipline-first Practice interactions (prompt layer).
 * Learner-facing language + honest repertoire; no new unsupported widgets.
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
    goal: "Practice discipline-first",
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

test("101E discipline-first: contract version and core markers", () => {
  assert.match(practiceContracts.CONTRACT_VERSION, /104M3-PRACTICE-RECONCILED-V1/);
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /Discipline-first principle/);
  assert.match(dla, /doing the discipline/i);
  assert.match(dla, /Reduce unnecessary writing/i);
  assert.match(dla, /Learner-facing language \(Practice/);
  assert.match(dla, /instructional-design jargon/i);
  assert.match(dla, /Explain what the multiplier equations tell us/i);
  assert.match(dla, /Check your work \(Practice/);
  assert.match(dla, /Do not replace criterion-based guided review/i);
  assert.match(dla, /Do NOT request dropdown-in-cell/i);
  assert.match(dla, /single_select/);
  assert.match(dla, /selection\.form/);
  assert.doesNotMatch(dla, /commission dropdown-in-cell widgets/i);
});

test("101E discipline-first: GAM carries learner-facing language; DP does not invent controls", () => {
  const gam = practiceContracts.buildPracticePresentationContractBlock("gam");
  const dp = practiceContracts.buildPracticePresentationContractBlock("design_page");

  assert.match(gam, /Learner-facing language \(Practice/);
  assert.match(gam, /clear actionable language/i);
  assert.match(gam, /Check your work \(Practice/);
  assert.match(gam, /Do not invent dropdown/);
  assert.doesNotMatch(gam, /Progressive interaction demand/);

  assert.match(dp, /Do not redesign activity interaction surfaces/);
  // Shared preamble may include discipline-first; DP must not carry DLA/GAM language blocks
  assert.doesNotMatch(dp, /Learner-facing language \(Practice/);
  assert.doesNotMatch(dp, /Supported learner response repertoire/);
  assert.doesNotMatch(dp, /Check your work \(Practice — preserve/);
});

test("101E discipline-first: Practice DLA/GAM receive guidance; Interactive does not", () => {
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
  assert.match(practiceDla, /Discipline-first principle/);
  assert.match(practiceDla, /Learner-facing language/);
  assert.match(practiceDla, /104M3-PRACTICE-RECONCILED-V1/);

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
  assert.match(practiceGam, /Learner-facing language/);
  assert.match(practiceGam, /Check your work \(Practice/);

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
  assert.doesNotMatch(interactiveDla, /Discipline-first principle/);
  assert.doesNotMatch(
    interactiveDla,
    /101G-CONTROL-LED-JUSTIFICATION|101F-PRACTICE-WORKLOAD|101E-PRACTICE-SELECTION-PAYLOAD/
  );
});

test("101E discipline-first: repertoire remains honest — no invented in-cell selects", () => {
  const dla = practiceContracts.buildPracticePresentationContractBlock("dla");
  assert.match(dla, /cells are short editable textareas, not dropdown widgets/i);
  assert.match(dla, /Do not use Assessment Pack region markup/i);
  assert.match(dla, /type "selection"/);
  // Must not invent a fake Practice matrix widget family in prompts
  assert.doesNotMatch(dla, /reasoning_matrix_widget/i);
  assert.doesNotMatch(dla, /dropdown_in_cell/i);
});
