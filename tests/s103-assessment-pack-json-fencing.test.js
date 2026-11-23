/**
 * Sprint 103 — Assessment Pack Step 1 JSON fencing:
 * presentation contract is mandatory; parser still accepts valid unfenced JSON.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const canonical = require("../lib/assessment-pack-canonical.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function purposeObject() {
  return {
    artifact_type: "assessment_evidence_purpose",
    purpose: {
      role: "R1",
      visibility_claim: "Which prior concepts still need attention.",
      stop_rationale: "A short stop before the next study block.",
      forward_intent: "Show the learner what to concentrate on next."
    },
    learner_context: { depends_on_prior_work: false }
  };
}

function purposeJson() {
  return JSON.stringify(purposeObject(), null, 2);
}

function assessmentPackWorkflow() {
  const built = family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: "Evidence judgement",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true, JSON.stringify(built));
  const steps = (built.steps || []).map(function (step, index) {
    return Object.assign({}, step, {
      id: step.id || "ap-step-" + index
    });
  });
  return {
    id: "wf-ap-fencing",
    product: "assessment_pack",
    steps: steps,
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, built.deliverySeed || {}, {
        topic: "Evidence judgement"
      }),
      initialBrief: { topic: "Evidence judgement", product: "assessment_pack" }
    }
  };
}

test("Assessment Pack Step 1 prompt requires fenced JSON and receives OUTPUT PRESENTATION", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/workflow-artefact-json-strict.js", "lib/first-class-workflow-family.js"]
  });
  const wf = assessmentPackWorkflow();
  const purposeStep = wf.steps.find((s) => s.outputName === "assessment_evidence_purpose");
  assert.ok(purposeStep, "purpose step present");

  assert.equal(
    api.workflowStepRequiresJsonOutputPresentationForTest(purposeStep, wf, purposeStep.promptBody),
    true
  );

  const prompt = api.applyWorkflowStepRuntimePromptAugmentations(
    purposeStep.promptBody,
    purposeStep,
    wf,
    {}
  );
  assert.match(prompt, /OUTPUT PRESENTATION REQUIREMENT/);
  assert.match(prompt, /ordinary Markdown fenced code block/i);
  assert.match(prompt, /fenced ```json block/i);
  assert.doesNotMatch(prompt, /Return JSON only/);
  assert.equal((prompt.match(/OUTPUT PRESENTATION REQUIREMENT/g) || []).length, 1);
});

test("Assessment Pack elicitation and formative also require fenced JSON presentation", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/workflow-artefact-json-strict.js", "lib/first-class-workflow-family.js"]
  });
  const wf = assessmentPackWorkflow();
  ["assessment_evidence_elicitation", "assessment_formative_return"].forEach((oname) => {
    const step = wf.steps.find((s) => s.outputName === oname);
    assert.ok(step, oname);
    assert.equal(api.workflowStepRequiresJsonOutputPresentationForTest(step, wf, ""), true);
    const prompt = api.applyWorkflowStepRuntimePromptAugmentations(step.promptBody, step, wf, {});
    assert.match(prompt, /OUTPUT PRESENTATION REQUIREMENT/, oname);
    assert.match(prompt, /fenced ```json block/i, oname);
  });
});

test("fenced Step 1 JSON parses, validates, and resolves for Step 2 handoff", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/workflow-artefact-json-strict.js",
      "lib/first-class-workflow-family.js",
      "lib/assessment-pack-canonical.js"
    ]
  });
  const wf = assessmentPackWorkflow();
  const purposeStep = wf.steps.find((s) => s.outputName === "assessment_evidence_purpose");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const fenced =
    "```json\n" +
    purposeJson() +
    "\n```\nSTEP 1 OUTPUT: assessment_evidence_purpose";
  const advance = api.evaluateWorkflowRunStepCaptureForAdvance(purposeStep, fenced);
  assert.equal(advance.ok, true, JSON.stringify(advance));
  assert.equal(advance.artifactType, "assessment_evidence_purpose");

  api.setWorkflowRunCapturedOutputsForTest({
    [purposeStep.id]: fenced
  });
  const upstream = api.resolveUpstreamWorkflowArtefactFromCaptures("assessment_evidence_purpose", {
    workflow: wf
  });
  assert.ok(upstream && typeof upstream === "object");
  assert.equal(upstream.artifact_type, "assessment_evidence_purpose");
  const validated = canonical.validateEvidencePurposeArtefact(upstream);
  assert.equal(validated.ok, true, JSON.stringify(validated.errors || validated));
});

test("valid unfenced Step 1 JSON is still accepted for handoff continuity", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/workflow-artefact-json-strict.js",
      "lib/first-class-workflow-family.js",
      "lib/assessment-pack-canonical.js"
    ]
  });
  const wf = assessmentPackWorkflow();
  const purposeStep = wf.steps.find((s) => s.outputName === "assessment_evidence_purpose");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const unfenced = purposeJson() + "\nSTEP 1 OUTPUT: assessment_evidence_purpose";
  const advance = api.evaluateWorkflowRunStepCaptureForAdvance(purposeStep, unfenced);
  assert.equal(advance.ok, true, JSON.stringify(advance));
  assert.equal(advance.artifactType, "assessment_evidence_purpose");

  api.setWorkflowRunCapturedOutputsForTest({
    [purposeStep.id]: unfenced
  });
  const upstream = api.resolveUpstreamWorkflowArtefactFromCaptures("assessment_evidence_purpose", {
    workflow: wf
  });
  assert.ok(upstream);
  assert.equal(upstream.artifact_type, "assessment_evidence_purpose");
  assert.equal(canonical.validateEvidencePurposeArtefact(upstream).ok, true);
});

test("malformed Step 1 output does not parse into a purpose artefact for Step 2", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/workflow-artefact-json-strict.js", "lib/first-class-workflow-family.js"]
  });
  const wf = assessmentPackWorkflow();
  const purposeStep = wf.steps.find((s) => s.outputName === "assessment_evidence_purpose");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);

  const malformed =
    "Here is the purpose.\n{ artifact_type: 'assessment_evidence_purpose', broken\nSTEP 1 OUTPUT: assessment_evidence_purpose";
  const advance = api.evaluateWorkflowRunStepCaptureForAdvance(purposeStep, malformed);
  // Untyped / unparsed captures are not treated as a matched purpose artefact.
  assert.notEqual(advance.code, "matched");

  api.setWorkflowRunCapturedOutputsForTest({
    [purposeStep.id]: malformed
  });
  const upstream = api.resolveUpstreamWorkflowArtefactFromCaptures("assessment_evidence_purpose", {
    workflow: wf
  });
  assert.equal(upstream, null);
});
