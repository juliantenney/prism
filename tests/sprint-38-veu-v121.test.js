/**
 * Sprint 38-8 — VEU v1.2.1 authoritative affordance prompt patch (contract tests).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const s38 = require(path.join(__dirname, "..", "lib", "sprint38-visual-affordances.js"));
const records = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "sprint-38", "affordance-records.json"),
    "utf8"
  )
);

const utilDir = path.join(__dirname, "..", "utilities", "visual-enhancement-utility");
const v12Path = path.join(utilDir, "visual-enhancement-utility-v1.2.json");
const v121Path = path.join(utilDir, "visual-enhancement-utility-v1.2.1.json");

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

const v12 = JSON.parse(fs.readFileSync(v12Path, "utf8"));
const v121 = JSON.parse(fs.readFileSync(v121Path, "utf8"));

const step1_121 = s38.getVeuStepPrompt(v121, "step_create_html_package");
const step2_121 = s38.getVeuStepPrompt(v121, "step_generate_image");
const step1_12 = s38.getVeuStepPrompt(v12, "step_create_html_package");

test("v1.2 export unchanged (byte-stable reference)", () => {
  const expected = sha256(v12Path);
  assert.ok(expected.length === 64);
  assert.match(v12.workflows[0].name, /v1\.2$/);
  assert.doesNotMatch(step1_12, /SPRINT 38 VISUAL AFFORDANCE HANDOVER/);
});

test("v1.2.1 topology unchanged (two steps, same canonical ids)", () => {
  assert.equal(v121.workflows[0].steps.length, 2);
  assert.equal(
    v121.workflows[0].steps[0].canonical_step_id,
    "step_create_html_package"
  );
  assert.equal(v121.workflows[0].steps[1].canonical_step_id, "step_generate_image");
  assert.equal(v121.workflows[0].workflowInputs.length, 1);
  assert.equal(v121.workflows[0].workflowInputs[0], "HTML learner page");
});

test("v1.2.1 Step 1: operating modes documented", () => {
  assert.match(step1_121, /handover_mode.*legacy.*hybrid.*authoritative/i);
  assert.match(step1_121, /LEGACY/);
  assert.match(step1_121, /HYBRID/);
  assert.match(step1_121, /AUTHORITATIVE/);
});

test("v1.2.1 Step 1: authoritative generate consumes Sprint 38 fields", () => {
  const fields = [
    "purpose",
    "preferred_representation",
    "pedagogical_added_value",
    "reasoning_supported",
    "representation_avoid",
    "allowed_claims",
    "disallowed_claims",
    "must_show",
    "must_not_show",
    "source_basis",
    "requires_exact_data_match",
    "caption_intent"
  ];
  fields.forEach((f) => assert.match(step1_121, new RegExp(f)));
});

test("v1.2.1 Step 1: reject and defer ledgers", () => {
  assert.match(step1_121, /rejected_affordances/);
  assert.match(step1_121, /deferred_affordances/);
  assert.match(step1_121, /Do not promote visual_decision: reject to generate/i);
  assert.match(step1_121, /VISUAL_DECISION: defer/i);
  assert.match(step1_121, /VISUAL_DECISION: reject/i);
});

test("v1.2.1 Step 1: pedagogical added-value guidance (38-6)", () => {
  assert.match(step1_121, /PEDAGOGICAL ADDED VALUE/i);
  assert.match(step1_121, /Generate the pedagogical support, not merely the visual structure/i);
  assert.match(step1_121, /blank worksheet/i);
});

test("v1.2.1 Step 1: quantitative fidelity", () => {
  assert.match(step1_121, /requires_exact_data_match is true/);
  assert.match(step1_121, /No invented values, trends, interval endpoints/i);
  assert.match(step1_121, /source_basis and allowed_claims/);
});

test("v1.2.1 Step 1: accessibility caption and alt derivation", () => {
  assert.match(step1_121, /figcaption: use caption_intent/);
  assert.match(step1_121, /must_not_show and spoiler_boundary/);
  assert.match(step1_121, /Do not use alt_text_intent/);
});

test("v1.2.1 Step 1: legacy fallback preserves v1.2 inference", () => {
  assert.match(step1_121, /visual_affordances\[\] missing or empty/);
  assert.match(step1_121, /PEDAGOGICAL SIGNIFICANCE/);
});

test("v1.2.1 Step 2: authoritative queue consumption", () => {
  assert.match(step2_121, /requires_exact_data_match/);
  assert.match(step2_121, /representation_avoid/);
  assert.match(step2_121, /disallowed_claims/);
  assert.match(step2_121, /must_not_show/);
  assert.match(step2_121, /spoiler_boundary/);
});

test("handover mode: legacy when no affordances", () => {
  assert.equal(s38.detectVisualAffordanceHandoverMode({}), "legacy");
  assert.equal(
    s38.detectVisualAffordanceHandoverMode({ visual_affordances: [] }),
    "legacy"
  );
});

test("handover mode: authoritative for valid full handover", () => {
  const page = {
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [
      {
        activity_id: "A2",
        activity_visual_value: { decision: "high", rationale: "Test." }
      }
    ],
    visual_affordances: [records.inflation_a2_generate, records.inflation_a5_reject]
  };
  assert.equal(s38.detectVisualAffordanceHandoverMode(page), "authoritative");
});

test("handover mode: hybrid when affordances present but invalid generate", () => {
  const page = {
    visual_affordances: [records.topic_only_invalid]
  };
  assert.equal(s38.detectVisualAffordanceHandoverMode(page), "hybrid");
});

test("handover mode: hybrid when partial handover (no schema version)", () => {
  const page = {
    visual_affordances: [records.inflation_a2_generate]
  };
  assert.equal(s38.detectVisualAffordanceHandoverMode(page), "hybrid");
});

test("authoritative generate record validates for VEU consumption", () => {
  const result = s38.validatePageVisualAffordances({
    visual_affordances: [records.ci_a4_generate]
  });
  assert.equal(result.valid, true);
  assert.equal(result.validRecords[0].requires_exact_data_match, true);
  assert.ok(result.validRecords[0].caption_intent);
});

test("loadVeuBundle returns v1.2.1 workflow", () => {
  const bundle = s38.loadVeuBundle("1.2.1");
  assert.ok(bundle);
  assert.match(bundle.workflows[0].name, /v1\.2\.1/);
});
