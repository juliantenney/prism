/**
 * Sprint 99 M3-2 — Expository Academic Plain English reaches sibling prompts
 * without Interactive GAM layer-purpose / depth contracts.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const sibling = require("../lib/expository-sibling-prompts.js");
const depth = require("../lib/ld-gam-instructional-depth.js");
const typography = require("../lib/ld-learner-facing-prose-typography.js");

function boot() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-self-directed-rhetoric.js",
      "lib/ld-gam-instructional-depth.js",
      "lib/ld-materials-copy.js",
      "lib/ld-table-fidelity.js",
      "lib/ld-learner-facing-prose-typography.js",
      "lib/first-class-workflow-family.js",
      "lib/expository-sibling-prompts.js"
    ]
  });
}

test("Expository sibling GLC/XD/XM include Expository Academic Plain English", () => {
  const marker = sibling.ACADEMIC_PLAIN_ENGLISH_MARKER;
  assert.match(marker, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);

  const glc = sibling.resolveTemplate({ canonical_step_id: "step_generate_learning_content" });
  const xd = sibling.resolveTemplate({ canonical_step_id: "step_expository_development" });
  const xm = sibling.resolveTemplate({ canonical_step_id: "step_expository_materials" });

  for (const body of [glc, xd, xm]) {
    assert.match(body, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);
    assert.match(
      body,
      /clearest language appropriate to the learner's level/i
    );
    assert.match(body, /LD-LEARNER-FACING-PROSE-TYPOGRAPHY/i);
    assert.match(body, /productive conceptual reinforcement/i);
    assert.doesNotMatch(body, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);
    assert.doesNotMatch(body, /INSTRUCTIONAL LAYER PURPOSES/i);
    assert.doesNotMatch(body, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/i);
    assert.doesNotMatch(body, /attempt-before-scaffold|Learn\s*→\s*Do\s*→\s*Check/i);
  }
});

test("EJP and Design Page do not unnecessarily duplicate the Expository APE block", () => {
  const ejp = sibling.resolveTemplate({ canonical_step_id: "step_expository_journey_plan" });
  const dp = sibling.resolveTemplate({ canonical_step_id: "step_design_page" });
  assert.doesNotMatch(ejp, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);
  assert.doesNotMatch(dp, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);
});

test("Expository runtime augmentation still excludes Interactive GAM APE while keeping typography", () => {
  const { api } = boot();
  const xdAug = api.applyWorkflowStepRuntimePromptAugmentations(
    sibling.resolveTemplate({ canonical_step_id: "step_expository_development" }),
    {
      canonical_step_id: "step_expository_development",
      canonical_title: "Expository Development",
      title: "Expository Development"
    },
    {
      product: "expository",
      goal: "Explain a concept.",
      desiredOutputs: "Expository resource",
      selectedDomains: ["learning-design"]
    }
  );
  assert.match(xdAug, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);
  assert.match(xdAug, typography.markerRegex());
  assert.doesNotMatch(xdAug, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(xdAug, /ACADEMIC PLAIN ENGLISH \(Interactive materials generation\)/i);
  assert.doesNotMatch(xdAug, /INSTRUCTIONAL LAYER PURPOSES/i);

  const xmAug = api.applyWorkflowStepRuntimePromptAugmentations(
    sibling.resolveTemplate({ canonical_step_id: "step_expository_materials" }),
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
  assert.match(xmAug, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);
  assert.match(xmAug, typography.markerRegex());
  assert.doesNotMatch(xmAug, depth.markerRegex());
});

test("Interactive GAM path still receives Interactive APE, not Expository APE marker as owner", () => {
  const { api } = boot();
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
  assert.doesNotMatch(interactiveGam, /ACADEMIC PLAIN ENGLISH \(Expository generation\)/i);
});
