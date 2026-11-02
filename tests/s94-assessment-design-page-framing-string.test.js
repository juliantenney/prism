/**
 * Assessment Pack Design Page: framing must be one learner-facing string.
 * Copilot may emit an object; capture-time repair converts readable prose
 * without inventing wording or weakening the validator.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const canonical = require("../lib/assessment-pack-canonical.js");
const family = require("../lib/first-class-workflow-family.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const PURPOSE =
  "This check asks you to make an independent judgement from the evidence already in view.";
const CONTEXT =
  "Bring forward your own earlier comparison. Do not treat a previous recommendation as given.";

function designPage(overrides) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      product_id: "assessment_pack",
      page_kind: "assessment",
      title: "Independent evidence-informed judgement",
      activities: [],
      attempt_instructions: "Read the scenario, then record your judgement.",
      assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
    },
    overrides || {}
  );
}

function assessmentWorkflow() {
  return {
    id: "wf-ap-framing",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    steps: [
      {
        id: "step-dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

function loadApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/assessment-component-forms.js",
      "lib/assessment-pack-canonical.js",
      "lib/assessment-pack-publish.js",
      "lib/first-class-workflow-family.js"
    ]
  });
  loaded.window.PRISM_ASSESSMENT_PACK_CANONICAL = canonical;
  return loaded.api;
}

test("unrepaired object framing fails the reported Design Page capture error", () => {
  const api = loadApi();
  const check = api.validateAssessmentDesignPageCapture(
    designPage({
      framing: {
        purpose: PURPOSE,
        context: CONTEXT
      }
    })
  );
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some(function (err) {
      return /framing must be a string/.test(err);
    }),
    check.errors.join("; ")
  );
});

test("repair converts a structured framing object to one string and the capture then validates", () => {
  const page = designPage({
    framing: {
      purpose: PURPOSE,
      context: CONTEXT
    }
  });
  const repaired = canonical.repairAssessmentDesignPageLearnerFacingStrings(page);
  assert.equal(repaired.repairApplied, true);
  assert.equal(typeof repaired.page.framing, "string");
  assert.match(repaired.page.framing, /independent judgement/);
  assert.match(repaired.page.framing, /earlier comparison/);
  assert.equal(repaired.page.framing.indexOf("[object Object]"), -1);
  const api = loadApi();
  const check = api.validateAssessmentDesignPageCapture(repaired.page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("capture persist path writes converted framing so the existing paste can be accepted", () => {
  const api = loadApi();
  const wf = assessmentWorkflow();
  const raw = JSON.stringify(
    designPage({
      framing: {
        purpose: PURPOSE,
        context: CONTEXT
      }
    })
  );
  const stamped = api.stampAssessmentDesignPageLearnerStringRepairRaw(raw, wf.steps[0], wf);
  assert.notEqual(stamped, raw);
  const parsed = JSON.parse(stamped);
  assert.equal(typeof parsed.framing, "string");
  assert.match(parsed.framing, /independent judgement/);
  const check = api.validateAssessmentDesignPageCapture(parsed);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  const strict = api.validateStrictJsonWorkflowRunStepCapture
    ? api.validateStrictJsonWorkflowRunStepCapture(stamped, wf.steps[0], wf)
    : api.validatePartialPageCaptureForStep(parsed, wf.steps[0], wf);
  assert.equal(strict.ok, true, strict.errors && strict.errors.join("; "));
});

test("metadata-only framing objects are not invented into prose and still fail", () => {
  const page = designPage({
    framing: { decision: "generate", skip_reason: "text-only check" }
  });
  const repaired = canonical.repairAssessmentDesignPageLearnerFacingStrings(page);
  assert.equal(repaired.repairApplied, false);
  assert.equal(typeof repaired.page.framing, "object");
  const api = loadApi();
  const check = api.validateAssessmentDesignPageCapture(repaired.page);
  assert.equal(check.ok, false);
  assert.match(check.errors.join("; "), /framing must be a string/);
});

test("Design Page generation contract types framing as one string", () => {
  const api = loadApi();
  const wf = assessmentWorkflow();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const live = api.buildWorkflowStepInstructions(wf.steps[0], 5, null);
  assert.match(live, /optional framing as one string/);
  assert.match(live, /Do not emit framing as an object or array/);
  const design = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Independent evidence-informed judgement",
    startingPoint: "topic"
  }).steps.find(function (step) {
    return String(step.canonical_step_id || "") === "step_design_page";
  });
  assert.ok(design);
  assert.match(design.promptBody, /Optional top-level framing is the same kind of field: one learner-facing string/);
});
