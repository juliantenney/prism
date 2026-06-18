/**
 * Sprint 49 — LD-COGNITION-ORIENTATION DLA activity-row authoring contract.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const cognitionOrientation = require("../lib/ld-cognition-orientation.js");

test("LD-COGNITION-ORIENTATION: module metadata and mandatory field set", () => {
  assert.equal(cognitionOrientation.MODULE_ID, "LD-COGNITION-ORIENTATION");
  assert.match(cognitionOrientation.MARKER, /LD-COGNITION-ORIENTATION-CONTRACT/);
  assert.ok(cognitionOrientation.MANDATORY_COGNITION_FIELD_IDS.includes("reasoning_orientation"));
  assert.ok(cognitionOrientation.MANDATORY_COGNITION_FIELD_IDS.includes("self_explanation_prompt"));
  assert.ok(cognitionOrientation.MANDATORY_COGNITION_FIELD_IDS.includes("conceptual_contrast_prompt"));
  assert.equal(cognitionOrientation.MANDATORY_COGNITION_FIELD_IDS.length, 7);
});

test("LD-COGNITION-ORIENTATION: requires at least one cognition-orientation field per activity", () => {
  const block = cognitionOrientation.buildLdCognitionOrientationPromptBlock();
  assert.match(block, /MANDATORY PER ACTIVITY/i);
  assert.match(block, /at least one non-empty field from/i);
  assert.match(block, /reasoning_orientation/);
  assert.match(block, /self_explanation_prompt/);
});

test("LD-COGNITION-ORIENTATION: distinguishes activity-row fields from materials", () => {
  const block = cognitionOrientation.buildLdCognitionOrientationPromptBlock();
  assert.match(block, /JSON keys on each activity/i);
  assert.match(block, /not required_materials specifications/i);
  assert.match(block, /not GAM material bodies/i);
  assert.match(block, /NOT ALLOWED: cognition cues only inside required_materials/i);
});

test("LD-COGNITION-ORIENTATION: includes pre-emit checklist", () => {
  const block = cognitionOrientation.buildLdCognitionOrientationPromptBlock();
  assert.match(block, /PRE-EMIT CHECKLIST/i);
  assert.match(block, /activity_preamble is present and non-empty/i);
  assert.match(block, /at least one cognition-orientation field from the mandatory set/i);
});

test("LD-COGNITION-ORIENTATION: does not instruct cognition inside material bodies", () => {
  const block = cognitionOrientation.buildLdCognitionOrientationPromptBlock();
  assert.match(block, /NOT ALLOWED: cognition cues only inside required_materials/i);
  assert.match(block, /GAM text Content bodies/i);
  assert.doesNotMatch(block, /append Cognition cues sections inside text Content/i);
  assert.doesNotMatch(block, /Material: \.\.\. \(text\)/i);
});

test("LD-COGNITION-ORIENTATION: does not duplicate pedagogic cognition pack semantics", () => {
  const block = cognitionOrientation.buildLdCognitionOrientationPromptBlock();
  assert.match(block, /Does not replace pedagogic cognition pack fields/i);
  assert.match(block, /misconception_claim/);
  assert.match(block, /reasoning_revision_prompt/);
  assert.doesNotMatch(block, /peer_instruction_pack/i);
  assert.doesNotMatch(block, /Cognition cues:/i);
});

test("LD-COGNITION-ORIENTATION: evaluateActivityCognitionOrientationEvidence", () => {
  const missing = cognitionOrientation.evaluateActivityCognitionOrientationEvidence({
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Why this matters.",
        learner_task: "Do the task."
      },
      {
        activity_id: "A2",
        activity_preamble: "Another preamble.",
        reasoning_orientation: "Trace claim and evidence before judging."
      }
    ]
  });
  assert.equal(missing.cognitionFieldCount, 1);
  assert.equal(missing.meetsMandatoryCognitionCoverage, false);

  const ok = cognitionOrientation.evaluateActivityCognitionOrientationEvidence({
    activities: [
      {
        activity_id: "A1",
        self_explanation_prompt: "Explain your contrast before checking."
      }
    ]
  });
  assert.equal(ok.meetsMandatoryCognitionCoverage, true);
});

test("LD-COGNITION-ORIENTATION: cognitionOrientationAlreadyPresent", () => {
  assert.equal(cognitionOrientation.cognitionOrientationAlreadyPresent(""), false);
  assert.equal(
    cognitionOrientation.cognitionOrientationAlreadyPresent(
      "LD-COGNITION-ORIENTATION-CONTRACT (auto-applied):\n"
    ),
    true
  );
});
