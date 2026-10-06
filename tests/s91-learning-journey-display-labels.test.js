/**
 * Sprint 91 — Learning Journey proposed-workflow display names and purposes.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");

const EXPECTED_DISPLAY = [
  {
    title: "Requirements",
    purpose:
      "Establish the learning need, intended learning, learner context and constraints that the journey must satisfy.",
    outputName: "learning_requirements",
    canonical_step_id: "step_journey_requirements"
  },
  {
    title: "Progression",
    purpose:
      "Design how the learning should develop over time within the available learning time and duration.",
    outputName: "learning_progression",
    canonical_step_id: "step_journey_progression"
  },
  {
    title: "Elements",
    purpose:
      "Identify the coherent, learner-manageable educational jobs needed to realise that progression.",
    outputName: "learning_elements",
    canonical_step_id: "step_journey_elements"
  },
  {
    title: "Commissioning",
    purpose:
      "Translate those educational jobs into appropriately bounded learner experiences for PRISM products, preserving unsupported needs explicitly.",
    outputName: "learning_commissions",
    canonical_step_id: "step_journey_commissioning"
  },
  {
    title: "Design Page",
    purpose:
      "Synthesise the established Learning Journey reasoning into the structured Learning Journey Design Page artefact.",
    outputName: "learning_journey_page",
    canonical_step_id: "step_design_page"
  }
];

test("Learning Journey proposed stages expose intended display names and purposes", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Online credibility judgements",
    learningTime: "90 minutes",
    duration: "1 day",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  assert.deepEqual(
    built.steps.map((s) => s.title),
    EXPECTED_DISPLAY.map((row) => row.title)
  );
  built.steps.forEach((step, index) => {
    const expected = EXPECTED_DISPLAY[index];
    assert.equal(String(step.role || "").trim(), expected.purpose);
    assert.ok(String(step.role || "").trim().length > 0, expected.title + " purpose populated");
  });
});

test("Learning Journey Design Page stage metadata has no stale Interactive page language", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Online credibility judgements",
    learningTime: "90 minutes",
    duration: "1 day",
    startingArtefact: "generate_from_topic"
  });
  const design = built.steps.find((s) => s.title === "Design Page");
  assert.ok(design);
  const purpose = String(design.role || "");
  assert.doesNotMatch(purpose, /page_synthesis/i);
  assert.doesNotMatch(purpose, /activities\[\]/);
  assert.doesNotMatch(purpose, /materials\[\]/);
  assert.doesNotMatch(purpose, /partial v2/i);
  assert.doesNotMatch(purpose, /final page hydration/i);
  assert.match(purpose, /structured Learning Journey Design Page/i);
  assert.match(purpose, /established Learning Journey reasoning/i);
});

test("internal Learning Journey stage and capture identities remain unchanged", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Online credibility judgements",
    learningTime: "90 minutes",
    duration: "1 day",
    startingArtefact: "generate_from_topic"
  });
  assert.deepEqual(
    built.steps.map((s) => s.outputName),
    EXPECTED_DISPLAY.map((row) => row.outputName)
  );
  assert.deepEqual(
    built.steps.map((s) => s.canonical_step_id),
    EXPECTED_DISPLAY.map((row) => row.canonical_step_id)
  );
  assert.equal(built.identity.product, "learning_journey");
  assert.equal(built.identity.ldCreateOutputType, "learning_journey");
});

test("Interactive Design Page display metadata is unaffected", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(interactive.ok, true);
  assert.ok(interactive.titles.indexOf("Design Page") !== -1);
  assert.ok(interactive.titles.indexOf("Design Learning Activities") !== -1);
  assert.deepEqual(interactive.titles, family.INTERACTIVE_TITLES);
});
