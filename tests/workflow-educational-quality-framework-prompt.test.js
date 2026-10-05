/**
 * Sprint 41 — Educational Quality Framework prompt contract (PB-S-007 smoke).
 * Runtime wiring may change; lib module identity and apply helper remain the signal.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const eqfLib = require("../lib/educational-quality-framework-prompt.js");

const EQF_MARKER = /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i;

function stepContext(stepId, stepTitle) {
  return {
    stepCanonicalStepId: stepId,
    stepCanonicalTitle: stepTitle,
    stepTitle: stepTitle
  };
}

function assertEqfCoreContent(prompt) {
  assert.match(prompt, EQF_MARKER);
  assert.match(prompt, /learner journey is the primary design unit/i);
  assert.match(prompt, /judgement/i);
  assert.match(prompt, /independence/i);
}

test("41-1: lib module exports marker and apply helper", () => {
  assert.equal(eqfLib.MODULE_ID, "EDUCATIONAL-QUALITY-FRAMEWORK");
  assert.match(eqfLib.MARKER, EQF_MARKER);
  const block = eqfLib.buildEducationalQualityFrameworkPromptBlock();
  assertEqfCoreContent(block);
});

test("41-1: target steps receive EQF when applied via lib helper", () => {
  for (const stepId of [
    "step_design_learning_activities",
    "step_construct_learning_sequence",
    "step_design_assessment",
    "step_design_feedback"
  ]) {
    const ctx = stepContext(stepId, stepId);
    const prompt = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft("Draft.\n", ctx);
    assert.match(prompt, EQF_MARKER, stepId);
  }
});

test("56C: Design Page is not an EQF runtime target step", () => {
  const dpCtx = stepContext("step_design_page", "Design Page");
  const dlaCtx = stepContext("step_design_learning_activities", "Design Learning Activities");
  assert.equal(eqfLib.isEducationalQualityFrameworkTargetStep(dpCtx), false);
  assert.equal(eqfLib.isEducationalQualityFrameworkTargetStep(dlaCtx), true);
  assert.equal(eqfLib.buildEducationalQualityFrameworkManifestationLines(dpCtx).length, 0);
  assert.ok(eqfLib.buildEducationalQualityFrameworkManifestationLines(dlaCtx).length > 0);
});

test("41-1: non-target step Model Knowledge does not receive EQF marker", () => {
  const ctx = stepContext("step_model_knowledge", "Model Knowledge");
  const prompt = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft("Model the knowledge.\n", ctx);
  assert.doesNotMatch(prompt, EQF_MARKER);
});

test("41-1: EQF marker is not duplicated on second apply", () => {
  const ctx = stepContext("step_design_learning_activities", "Design Learning Activities");
  const once = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft("Draft.\n", ctx);
  const twice = eqfLib.applyEducationalQualityFrameworkPromptBlockToDraft(once, ctx);
  const hits = twice.match(/EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/gi);
  assert.equal(hits && hits.length, 1);
});

test("41-2: manifestation lines are step-specific", () => {
  const dlaCtx = stepContext("step_design_learning_activities", "Design Learning Activities");
  const seqCtx = stepContext("step_construct_learning_sequence", "Construct Learning Sequence");
  const dlaLines = eqfLib.buildEducationalQualityFrameworkManifestationLines(dlaCtx);
  const seqLines = eqfLib.buildEducationalQualityFrameworkManifestationLines(seqCtx);
  assert.ok(dlaLines.some((line) => /developmental purpose/i.test(line)));
  assert.ok(seqLines.some((line) => /learner-development journey/i.test(line)));
  assert.notDeepEqual(dlaLines, seqLines);
  assert.equal(eqfLib.buildEducationalQualityFrameworkManifestationLines({}).length, 0);
});
