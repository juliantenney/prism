/**
 * C4 Situated Task Step 5 — Visual Affordance contract & capture-time validation regression.
 *
 * Covers:
 * 1. Shared section-scoped visual-affordance guidance in lib/sprint38-visual-affordances.js
 *    reused by lib/situated-task-design-page.js (prompt + Copy instructions).
 * 2. Explicit canonical property names (affordance_id, visual_decision), closed vocabularies,
 *    and schema-valid section generate/skip examples in Situated Task Step 5 prompt.
 * 3. Preservation of separate editorial_opening_image contract where "decision" is valid.
 * 4. Strict validator (no aliases for visual_id / decision) AND immediate capture-time rejection
 *    in app.js for Situated Task Step 5 (with live pageEnrichmentV2:false / partialPageOutputs:false).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const s38 = require("../lib/sprint38-visual-affordances.js");
const design = require("../lib/situated-task-design-page.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

function buildLiveSituatedWorkflow() {
  const built = family.buildFirstClassWorkflowFamily({
    product: "situated_task",
    focus: "Conduct a structured field observation of pricing signals",
    audience: "undergraduate economics learners",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  return {
    id: "wf-c4-situated-capture",
    product: "situated_task",
    name: "C4 Situated Task",
    ldCreateOutputType: "situated_task",
    // Matches live Situated Task workflow flags (app.js clears Interactive Sprint 58 flags).
    workflowOutputSpec: { pageEnrichmentV2: false, partialPageOutputs: false },
    steps: built.steps.map((step, index) =>
      Object.assign({}, step, { id: "c4-st-" + (index + 1) })
    )
  };
}

function buildSituatedPageWithVisuals(visualAffordances, editorialOpeningImage) {
  const base = design.buildSituatedTaskDesignPageFixture({
    title: "Observe Pricing Signals in Practice"
  }).page;
  base.sections = [
    {
      section_id: "orient",
      title: "Orient to the field setting",
      order: 1,
      exposition: "Before entering the store, identify the product category and price tags to inspect."
    },
    {
      section_id: "record",
      title: "Record what you observe",
      order: 2,
      exposition: "Note reference prices, promotional framing, and any missing unit-price cues."
    }
  ];
  base.situated_learning.record.entries = [
    {
      entry_id: "obs_notes",
      order: 1,
      label: "Field observation notes",
      placement: { after_section_id: "record" }
    }
  ];
  base.visual_affordance_schema_version = "38.4";
  base.activities_visual_review = [];
  base.visual_affordances = visualAffordances;
  if (editorialOpeningImage !== undefined) {
    base.editorial_opening_image = editorialOpeningImage;
  }
  return base;
}

function canonicalGenerateAffordance(id, sectionId) {
  return {
    affordance_id: id,
    scope: "section",
    section_id: sectionId,
    visual_decision: "generate",
    visual_slot: "section-after-content",
    tier: "valuable",
    purpose: "action_support",
    preferred_representation: "process",
    subject: "Field observation checkpoint sequence",
    context:
      "Visual brief: show the ordered observation checkpoints in the retail setting so learners know what cues to inspect without revealing conclusions they must draw themselves.",
    evidence_anchors: [sectionId + ".exposition"],
    rationale:
      "Makes the sequence of field checkpoints inspectable before enactment, reducing working-memory load without doing the analysis for the learner.",
    reasoning_supported: "Learner sequences field inspection cues independently.",
    learner_stage: "pre_classification",
    anti_spoiler: true,
    spoiler_boundary: {
      hide_answers: true,
      hide_classification_keys: true,
      hide_model_solution: true,
      allow_structural_hint: true
    },
    representation_avoid: ["filled_worksheet", "generic_infographic", "topic_hero_image"],
    canonical_discipline_note: "Procedural observation checkpoints only; no conclusions.",
    requires_exact_data_match: false,
    must_show: ["ordered field checkpoints", "price-cue inspection prompts"],
    must_not_show: ["completed learner notes", "model conclusions"],
    allowed_claims: ["Ordered observation checkpoints structure field recording."],
    disallowed_claims: ["Specific pricing findings before observation."],
    source_basis: sectionId + ".exposition",
    caption_intent: "Ordered checkpoints for field pricing observation.",
    alt_text: "Ordered field observation checkpoints diagram; detailed description follows.",
    detailed_description:
      "A three-stage sequence links preparation before entering the setting, inspecting price cues, and recording observations without presenting completed findings.",
    discipline_risk_level: "low"
  };
}

test("Shared Sprint 38 section-scoped guidance is reused by Situated Task Step 5 prompt & Copy instructions", () => {
  assert.equal(typeof s38.buildSectionScopedVisualAffordanceAuthoringLines, "function");

  const prompt = design.buildSituatedTaskDesignPagePrompt();
  const copyInstructions = design.buildSituatedTaskDesignPageCopyInstructions();

  // Canonical field names & explicit prohibition of visual_id / decision inside visual_affordances[]
  assert.match(prompt, /affordance_id/);
  assert.match(prompt, /NEVER visual_id/);
  assert.match(prompt, /visual_decision/);
  assert.match(prompt, /NEVER decision/);
  assert.match(prompt, /editorial_opening_image/);

  // Closed vocabularies from Sprint 38
  assert.match(prompt, /essential \| valuable/);
  assert.match(prompt, /pre_classification \| post_reasoning/);
  assert.match(prompt, /worked_example_sufficient_first/);
  assert.match(prompt, /duplicate_existing_structure/);
  assert.match(prompt, /hide_answers, hide_classification_keys, hide_model_solution, allow_structural_hint/);

  // Separate editorial_opening_image contract preserved with "decision": "generate" | "skip"
  assert.match(prompt, /"decision":\s*"generate"/);
  assert.match(prompt, /"decision":\s*"skip"/);

  // Copy instructions also reinforce canonical keys while preserving editorial_opening_image.decision
  assert.match(copyInstructions, /affordance_id/);
  assert.match(copyInstructions, /visual_decision/);
  assert.match(copyInstructions, /NEVER visual_id or decision/);
  assert.match(copyInstructions, /editorial_opening_image.*"decision": "generate" \| "skip"/);
});

test("Concrete generate & skip JSON examples embedded in Situated Task Step 5 prompt pass validator", () => {
  const prompt = design.buildSituatedTaskDesignPagePrompt();
  const lines = prompt.split("\n").map((l) => l.trim());
  const jsonLines = lines.filter((l) => l.startsWith('{"affordance_id":'));
  assert.equal(jsonLines.length, 2, "Expected concrete generate and skip JSON examples");

  const parsedRows = jsonLines.map((l) => JSON.parse(l));
  assert.equal(parsedRows[0].visual_decision, "generate");
  assert.equal(parsedRows[1].visual_decision, "skip");

  const page = buildSituatedPageWithVisuals(parsedRows, {
    decision: "generate",
    subject: "Retail aisle setting for field observation",
    context: "Atmosphere and setting only; no findings or decisions.",
    caption_intent: "Setting for the situated field observation.",
    alt_text: "",
    detailed_description: "A calm retail aisle setting without overlays or analytical conclusions."
  });
  const check = design.validateSituatedTaskDesignPage(page);
  assert.equal(check.ok, true, "Prompt examples must validate cleanly: " + (check.errors || []).join("; "));
});

test("Validator strictly rejects C4 malformed visual_affordances (visual_id / decision) with no aliases", () => {
  const badRow1 = Object.assign({}, canonicalGenerateAffordance("va-orient-01", "orient"));
  delete badRow1.affordance_id;
  delete badRow1.visual_decision;
  badRow1.visual_id = "va-orient-01";
  badRow1.decision = "generate";

  const badRow2 = Object.assign({}, canonicalGenerateAffordance("va-record-01", "record"));
  delete badRow2.affordance_id;
  delete badRow2.visual_decision;
  badRow2.visual_id = "va-record-01";
  badRow2.decision = "generate";

  const badPage = buildSituatedPageWithVisuals([badRow1, badRow2], {
    decision: "generate",
    subject: "Retail aisle setting",
    context: "Atmosphere only.",
    caption_intent: "Opening scene.",
    alt_text: "",
    detailed_description: "A retail aisle setting without overlays."
  });

  const result = design.validateSituatedTaskDesignPage(badPage);
  assert.equal(result.ok, false);
  const joined = result.errors.join("\n");
  assert.match(joined, /visual_affordances\[0\]: affordance_id is required/);
  assert.match(joined, /visual_affordances\[0\]: visual_decision must be/);
  assert.match(joined, /visual_affordances\[1\]: affordance_id is required/);
  assert.match(joined, /visual_affordances\[1\]: visual_decision must be/);
});

test("Live Step 5 capture rejects malformed visual_affordances immediately and accepts canonical shape", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/sprint38-visual-affordances.js",
      "lib/visual-planning-contract.js",
      "lib/situated-task-design-page.js",
      "lib/situated-task-sibling-prompts.js"
    ]
  });
  const wf = buildLiveSituatedWorkflow();
  const stage5 = wf.steps[4];
  assert.equal(stage5.canonical_step_id, "step_design_page");

  const badRow = Object.assign({}, canonicalGenerateAffordance("va-orient-01", "orient"));
  delete badRow.affordance_id;
  delete badRow.visual_decision;
  badRow.visual_id = "va-orient-01";
  badRow.decision = "generate";

  const badPage = buildSituatedPageWithVisuals([badRow], {
    decision: "generate",
    subject: "Retail aisle setting",
    context: "Atmosphere only.",
    caption_intent: "Opening scene.",
    alt_text: "",
    detailed_description: "A retail aisle setting without overlays."
  });
  const badRaw = "```json\n" + JSON.stringify(badPage, null, 2) + "\n```\nSTEP 5 OUTPUT: page";

  // 1. Live paste/save strict capture check must fail immediately (not skip!)
  const strictBad = api.validateStrictJsonWorkflowRunStepCaptureForTest(badRaw, stage5, wf);
  assert.equal(strictBad.ok, false);
  assert.notEqual(strictBad.skipped, true);
  assert.match((strictBad.errors || []).join(" "), /affordance_id is required/);
  assert.match((strictBad.errors || []).join(" "), /visual_decision must be/);

  // 2. Step advance storage parser must also reject immediately
  const storageBad = api.parseWorkflowRunPageStructureCaptureForStorage(badRaw, stage5, wf);
  assert.equal(storageBad.ok, false);
  assert.match((storageBad.errors || []).join(" "), /affordance_id is required/);
  assert.match((storageBad.errors || []).join(" "), /visual_decision must be/);

  // 3. Canonical Situated Task page with valid visual_affordances + editorial_opening_image.decision passes both
  const goodPage = buildSituatedPageWithVisuals(
    [canonicalGenerateAffordance("va-orient-01", "orient")],
    {
      decision: "skip",
      skip_reason: "Field context is self-evident without an opening scene."
    }
  );
  const goodRaw = "```json\n" + JSON.stringify(goodPage, null, 2) + "\n```\nSTEP 5 OUTPUT: page";

  const strictGood = api.validateStrictJsonWorkflowRunStepCaptureForTest(goodRaw, stage5, wf);
  assert.equal(strictGood.ok, true, "Expected canonical Step 5 capture to pass: " + (strictGood.message || ""));

  const storageGood = api.parseWorkflowRunPageStructureCaptureForStorage(goodRaw, stage5, wf);
  assert.equal(storageGood.ok, true, "Expected canonical Step 5 storage parse to pass: " + (storageGood.message || ""));
});
