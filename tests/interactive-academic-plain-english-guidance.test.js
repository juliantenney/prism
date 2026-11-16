/**
 * Interactive generator experiment: Academic Plain English + layer-purpose
 * economy must reach the Interactive GAM path and must not alter other generators.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const depth = require("../lib/ld-gam-instructional-depth.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const expositorySibling = require("../lib/expository-sibling-prompts.js");
const situatedSibling = require("../lib/situated-task-sibling-prompts.js");

function boot() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-self-directed-rhetoric.js",
      "lib/ld-gam-instructional-depth.js",
      "lib/ld-materials-copy.js",
      "lib/ld-table-fidelity.js",
      "lib/first-class-workflow-family.js"
    ]
  });
}

test("Academic Plain English contract is GAM-only and reaches Interactive runtime augmentation", () => {
  const { api } = boot();
  const depthBlock = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(depthBlock, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);
  assert.match(depthBlock, /INSTRUCTIONAL LAYER PURPOSES/i);

  const interactiveGam = api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate activity materials for Interactive.\n",
    {
      canonical_step_id: "step_generate_activity_materials",
      canonical_title: "Generate Activity Materials",
      title: "Generate Activity Materials"
    },
    {
      product: "interactive",
      variant: "self_study",
      goal: "Create a self-directed learning page on constraints.",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    }
  );
  assert.match(interactiveGam, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/i);
  assert.match(interactiveGam, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);
  assert.match(interactiveGam, /PRODUCTIVE VS UNPRODUCTIVE REPETITION/i);
  assert.match(interactiveGam, /self-directed learner-page self-study materials \(auto-applied\)/i);
  assert.match(interactiveGam, /Academic Plain English/i);
});

test("Expository, Assessment Pack and Situated Task routes do not receive Interactive GAM economy block", () => {
  const { api } = boot();
  const expository = api.applyWorkflowStepRuntimePromptAugmentations(
    "Author Expository materials.\n",
    {
      canonical_step_id: "step_expository_materials",
      canonical_title: "Expository Materials",
      title: "Expository Materials"
    },
    {
      product: "expository",
      goal: "Explain a concept.",
      desiredOutputs: "Expository resource",
      selectedDomains: ["learning-design"]
    }
  );
  assert.doesNotMatch(expository, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(expository, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);

  const assessment = api.applyWorkflowStepRuntimePromptAugmentations(
    "Author assessment pack.\n",
    {
      canonical_step_id: "step_assessment_items",
      canonical_title: "Assessment Items",
      title: "Assessment Items"
    },
    {
      product: "assessment_pack",
      goal: "Assess understanding.",
      desiredOutputs: "Assessment pack",
      selectedDomains: ["learning-design"]
    }
  );
  assert.doesNotMatch(assessment, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(assessment, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);

  const situated = api.applyWorkflowStepRuntimePromptAugmentations(
    "Author situated task.\n",
    {
      canonical_step_id: "step_situated_activity",
      canonical_title: "Situated Activity",
      title: "Situated Activity"
    },
    {
      product: "situated_task",
      goal: "Learn through situated action.",
      desiredOutputs: "Situated task",
      selectedDomains: ["learning-design"]
    }
  );
  assert.doesNotMatch(situated, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(situated, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);
});

test("Expository and Situated Task sibling prompt modules are untouched by this experiment", () => {
  const expositoryBody = Object.keys(expositorySibling.TEMPLATES || {})
    .map((k) => String(expositorySibling.TEMPLATES[k] || ""))
    .join("\n");
  const situatedBody = Object.keys(situatedSibling.TEMPLATES || {})
    .map((k) => String(situatedSibling.TEMPLATES[k] || ""))
    .join("\n");
  assert.doesNotMatch(
    expositoryBody,
    /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i
  );
  assert.doesNotMatch(
    situatedBody,
    /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i
  );
  const gam = gamContract.buildGamPageEnrichContractBlock();
  assert.match(
    gam,
    /Academic Plain English with distinct orientation\/teaching\/instructions\/hints\/feedback purposes/i
  );
});
