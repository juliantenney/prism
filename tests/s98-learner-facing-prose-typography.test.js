/**
 * Sprint 98 — global ban on discretionary inline emphasis in continuous
 * learner-facing prose. Shared contract must reach representative routes.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const typography = require("../lib/ld-learner-facing-prose-typography.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");
const assembler = require("../lib/gam-canonical-assembler.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const MARKER = /LD-LEARNER-FACING-PROSE-TYPOGRAPHY \(auto-applied\)/i;
const BAN = /must not use discretionary inline bold, italic or underline/i;
const PRESERVE = /Preserve legitimate structural and semantic formatting/i;
const LABEL_OK = /\*\*Label:\*\*/;

function boot() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-learner-facing-prose-typography.js",
      "lib/ld-gam-instructional-depth.js",
      "lib/ld-materials-copy.js",
      "lib/first-class-workflow-family.js",
      "lib/gam-canonical-assembler.js",
      "lib/ld-gam-page-enrich-contract.js"
    ]
  });
}

function augment(api, product, step) {
  return api.applyWorkflowStepRuntimePromptAugmentations(
    "Generate learner-facing content.\n",
    step,
    {
      product: product,
      variant: product === "interactive" ? "self_study" : undefined,
      goal: "Teach a concept.",
      desiredOutputs: "Learner resource",
      selectedDomains: ["learning-design"]
    }
  );
}

test("shared typography contract prohibits discretionary emphasis and preserves structural formatting", () => {
  const block = typography.buildLearnerFacingProseTypographyPromptBlock();
  assert.match(block, MARKER);
  assert.match(block, BAN);
  assert.match(block, PRESERVE);
  assert.match(block, /headings and section titles/i);
  assert.match(block, LABEL_OK);
  assert.match(block, /mathematical notation/i);
  assert.match(block, /Global PRISM editorial standard/i);
  assert.doesNotMatch(block, /Ordinary inline emphasis in pedagogical prose remains valid/i);
});

test("contradictory GAM contract wording no longer permits discretionary prose emphasis", () => {
  const block = gamContract.buildGamPageEnrichContractBlock();
  assert.match(block, /\*\*Label:\*\*/);
  assert.match(block, /LD-LEARNER-FACING-PROSE-TYPOGRAPHY/);
  assert.doesNotMatch(block, /Ordinary inline emphasis in pedagogical prose remains valid/i);
});

test("Interactive, Learning Journey, Expository, Assessment and Situated routes receive the shared rule", () => {
  const { api } = boot();
  const gamStep = {
    canonical_step_id: "step_generate_activity_materials",
    canonical_title: "Generate Activity Materials",
    title: "Generate Activity Materials"
  };
  const designStep = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const feedbackStep = {
    canonical_step_id: "step_design_feedback",
    canonical_title: "Design Feedback",
    title: "Design Feedback"
  };

  const interactive = augment(api, "interactive", gamStep);
  const journey = augment(api, "learning_journey", designStep);
  const expository = augment(api, "expository", gamStep);
  const assessment = augment(api, "assessment_pack", feedbackStep);
  const situated = augment(api, "situated_task", designStep);

  [interactive, journey, expository, assessment, situated].forEach((text) => {
    assert.match(text, MARKER);
    assert.match(text, BAN);
    assert.match(text, PRESERVE);
  });
});

test("marker is deduped on repeated application", () => {
  const once = typography.applyLearnerFacingProseTypographyContractToDraft("Draft body.", {});
  const twice = typography.applyLearnerFacingProseTypographyContractToDraft(once, {});
  assert.equal((twice.match(/LD-LEARNER-FACING-PROSE-TYPOGRAPHY \(auto-applied\)/gi) || []).length, 1);
});

test("GAM canonical assembler Copy V2 brief includes typography and no longer blesses prose bold", () => {
  const result = assembler.assembleCopyV2({
    profile: "copy_v2_partial",
    partialMode: true,
    includeCopyMath: false,
    includePipelineClose: false,
    stepTitle: "Generate Activity Materials",
    stepIndex: 2,
    notes: "",
    dlaPage: {
      artifact_type: "page",
      schema_version: "2.0.0",
      activities: [
        {
          activity_id: "A1",
          required_materials: [{ material_id: "A1-M1", material_type: "text" }]
        }
      ]
    }
  });
  const text = String(result && result.text || "");
  assert.match(text, MARKER);
  assert.match(text, BAN);
  assert.doesNotMatch(text, /Ordinary inline bold emphasis in prose is fine/i);
  assert.match(text, /\*\*Label:\*\*/);
});
