/**
 * Sprint 51 — GAM pedagogic richness must survive Design Page compose merge.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  applyGamMaterialsToComposedPage,
  mergeMaterialsFromGamList,
  findLearningActivitiesRows,
  shouldMergeGamBody,
  pedagogicRichnessLoss
} = require("../lib/page-gam-materials-preserve.js");

const FULL_WORKED_EXAMPLE = [
  "**Step 1:** Separate demand-led from cost-led pressures using scenario prices and wages.",
  "**Step 2:** Map which agents gain or lose under each pressure.",
  "**Step 3:** Classify with a mechanism statement, not a label alone.",
  "",
  "## What experts notice",
  "- Strong analysis names the transmission mechanism, not only demand-pull or cost-push labels.",
  "- Novices list agents without explaining how the pressure reaches prices.",
  "- Effective reasoning links evidence from the scenario to the classification move.",
  "",
  "**Bridge:** Apply the same sequence to your assigned scenario — do not copy this conclusion."
].join("\n");

const THINNED_WORKED_EXAMPLE = [
  "**Step 1:** Identify price pressures.",
  "**Step 2:** Map affected agents.",
  "",
  "## What experts notice",
  "- Names the mechanism.",
  "",
  "**Bridge:** Apply to your scenario."
].join("\n");

const FULL_SAMPLE_OUTPUT = [
  "> Parallel scenario response linking mechanism to evidence in a parallel case.",
  "",
  "## Why this works",
  "- Links concepts through a causal mechanism rather than listing definitions.",
  "- Uses scenario-specific evidence to support the analytical move, not generic claims.",
  "- Moves beyond description by explaining relationships and implications.",
  "- Explains who gains and loses through the transmission path, not agent labels alone.",
  "",
  "Use this as a quality guide, not as text to copy."
].join("\n");

const THINNED_SAMPLE_OUTPUT = [
  "> Model response.",
  "",
  "## Why this works",
  "- Links concepts.",
  "- Uses evidence.",
  "",
  "Use this as a quality guide, not as text to copy."
].join("\n");

const FULL_CHECKLIST = [
  "Use this to evaluate your evaluation report:",
  "",
  "• Have you linked each price pressure to a specific agent and mechanism?",
  "• Have you cited at least one scenario detail per major claim?",
  "• Have you addressed whether multiple causes interact?",
  "• Have you stated what remains uncertain?",
  "",
  "## Common mistakes",
  "- Label-only classification with no mechanism or evidence.",
  "- Listing affected agents without explaining how the pressure reaches them.",
  "- Generic justification that could fit any inflation case.",
  "",
  "### If any check is not met:",
  "Revise your report by (1) adding a mechanism sentence for each classification, (2) quoting one scenario detail per claim."
].join("\n");

const THINNED_CHECKLIST = [
  "• Have you identified price pressures?",
  "• Have you justified your classification?",
  "",
  "## Common mistakes",
  "- Label-only classification.",
  "",
  "### If any check is not met:",
  "Revise your work."
].join("\n");

function gamMaterial(type, content, purpose) {
  return {
    material_id: "M_test_" + type,
    type: type,
    purpose: purpose || "",
    content: content
  };
}

function pageShell(materials) {
  return {
    artifact_type: "page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning Activities",
        content: [{ activity_id: "A3", title: "Evaluate inflation", materials: materials }]
      }
    ]
  };
}

function gamShell(materials) {
  return [{ activity_id: "A3", title: "Evaluate inflation", materials: materials }];
}

test("51-3: pedagogicRichnessLoss detects thinned Why this works bullets", () => {
  assert.equal(pedagogicRichnessLoss(THINNED_SAMPLE_OUTPUT, FULL_SAMPLE_OUTPUT), true);
  assert.equal(pedagogicRichnessLoss(FULL_SAMPLE_OUTPUT, FULL_SAMPLE_OUTPUT), false);
});

test("51-3: pedagogicRichnessLoss detects thinned Common mistakes", () => {
  assert.equal(pedagogicRichnessLoss(THINNED_CHECKLIST, FULL_CHECKLIST), true);
});

test("51-3: shouldMergeGamBody prefers GAM for thinned checklist (former tier E gap)", () => {
  assert.equal(
    shouldMergeGamBody(THINNED_CHECKLIST, FULL_CHECKLIST, "checklist_evaluate", {
      tier: "B",
      minRatio: 0.99,
      markers: ["common_mistakes", "revise_if_not_met"]
    }),
    true
  );
});

test("51-3: merge restores full worked_example with What experts notice", () => {
  const merged = mergeMaterialsFromGamList(
    { worked_example: THINNED_WORKED_EXAMPLE },
    [gamMaterial("worked_example", FULL_WORKED_EXAMPLE)]
  );
  assert.equal(merged.worked_example, FULL_WORKED_EXAMPLE);
  assert.match(merged.worked_example, /## What experts notice/);
  assert.match(merged.worked_example, /transmission mechanism/);
  assert.doesNotMatch(merged.worked_example, /Have you /i);
});

test("51-3: merge restores full sample_output with Why this works", () => {
  const merged = mergeMaterialsFromGamList(
    { sample_output: THINNED_SAMPLE_OUTPUT },
    [gamMaterial("sample_output", FULL_SAMPLE_OUTPUT)]
  );
  assert.equal(merged.sample_output, FULL_SAMPLE_OUTPUT);
  assert.match(merged.sample_output, /Who gains and loses through the transmission path/i);
});

test("51-3: merge restores checklist Common mistakes and revision guidance", () => {
  const merged = mergeMaterialsFromGamList(
    { evaluation_checklist: THINNED_CHECKLIST },
    [gamMaterial("checklist", FULL_CHECKLIST, "verification evaluate")]
  );
  assert.ok(
    merged.checklist_evaluate === FULL_CHECKLIST ||
      merged.evaluation_checklist === FULL_CHECKLIST ||
      merged.checklist === FULL_CHECKLIST
  );
  const body =
    merged.checklist_evaluate || merged.evaluation_checklist || merged.checklist || "";
  assert.match(body, /## Common mistakes[\s\S]*### If any check is not met:/i);
  assert.match(body, /mechanism sentence for each classification/i);
});

test("51-3: applyGamMaterialsToComposedPage preserves Sprint 51 bodies end-to-end", () => {
  const page = pageShell({
    worked_example: THINNED_WORKED_EXAMPLE,
    sample_output: THINNED_SAMPLE_OUTPUT,
    evaluation_checklist: THINNED_CHECKLIST
  });
  const gam = gamShell([
    gamMaterial("worked_example", FULL_WORKED_EXAMPLE),
    gamMaterial("sample_output", FULL_SAMPLE_OUTPUT),
    gamMaterial("checklist", FULL_CHECKLIST, "verification evaluate")
  ]);
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const row = findLearningActivitiesRows(merged)[0];
  assert.equal(row.materials.worked_example, FULL_WORKED_EXAMPLE);
  assert.equal(row.materials.sample_output, FULL_SAMPLE_OUTPUT);
  const checklistBody =
    row.materials.checklist_evaluate ||
    row.materials.evaluation_checklist ||
    row.materials.checklist;
  assert.equal(checklistBody, FULL_CHECKLIST);
  assert.equal(merged.metadata.gam_materials_preserve_applied, true);
});

test("51-3: equal-length paraphrase still prefers authoritative GAM body", () => {
  const gamBody = "## Why this works\n- Links mechanism to evidence with scenario detail.\n- Explains relationships.";
  const pageBody = "## Why this works\n- Good structure.\n- Clear writing.";
  assert.equal(
    shouldMergeGamBody(pageBody, gamBody, "sample_output", {
      tier: "D",
      minRatio: 0.99,
      markers: ["why_this_works"]
    }),
    true
  );
});
