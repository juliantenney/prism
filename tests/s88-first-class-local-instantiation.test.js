/**
 * Sprint 88 — local first-class workflow instantiation.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

const INTERACTIVE = [
  "Generate Learning Content",
  "Model Knowledge",
  "Define Learning Outcomes",
  "Design Episode Plan",
  "Design Learning Activities",
  "Generate Activity Materials",
  "Construct Learning Sequence",
  "Design Page"
];
const EXPOSITORY = [
  "Generate Learning Content",
  "Model Knowledge",
  "Define Learning Outcomes",
  "Expository Journey Plan",
  "Expository Development",
  "Expository Materials",
  "Design Page"
];

function titles(built) {
  return built.titles.slice();
}

test("A: Self-study topic create is the documented Interactive family", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes theorem",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  assert.equal(built.identity.product, "interactive");
  assert.equal(built.identity.variant, "self_study");
  assert.equal(built.identity.startingPoint, "topic");
  assert.deepEqual(titles(built), INTERACTIVE);
  assert.equal(built.deliverySeed.topic, "Bayes theorem");
});

test("B: Self-study authoritative source prefixes Normalize Content", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes theorem",
    startingArtefact: "provided_source_content"
  });
  assert.deepEqual(titles(built), ["Normalize Content"].concat(INTERACTIVE));
  assert.equal(built.identity.startingPoint, "authoritative_source");
});

test("C: Workshop topic uses the Interactive family and Workshop delivery seed", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "workshop",
    focus: "Peer instruction",
    startingPoint: "topic"
  });
  assert.deepEqual(titles(built), INTERACTIVE);
  assert.equal(built.identity.variant, "workshop");
  assert.equal(built.deliverySeed.delivery_mode, "live_workshop");
  assert.equal(built.deliverySeed.delivery_context, "in_person");
  assert.equal(built.deliverySeed.delivery_pattern, "face_to_face");
  assert.deepEqual(built.deliverySeed.learning_environments, ["classroom"]);
});

test("D: Expository topic create is the documented Expository family", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Photosynthesis",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.identity.product, "expository");
  assert.equal(built.identity.variant, "");
  assert.deepEqual(titles(built), EXPOSITORY);
  INTERACTIVE.slice(3, 7).forEach(function (title) {
    assert.equal(titles(built).includes(title), false);
  });
});

test("E: Expository authoritative source prefixes Normalize and has no Interactive middle", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "expository",
    focus: "Photosynthesis",
    startingPoint: "authoritative_source"
  });
  assert.deepEqual(titles(built), ["Normalize Content"].concat(EXPOSITORY));
  ["Design Episode Plan", "Design Learning Activities", "Generate Activity Materials", "Construct Learning Sequence"].forEach(
    function (title) {
      assert.equal(titles(built).includes(title), false, title);
    }
  );
});

test("F/G: family builder does not call a model and records callsModel false", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Topic text already supplied",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.callsModel, false);
  assert.equal(built.deliverySeed.topic, "Topic text already supplied");
  const start = appSource.indexOf("function handleStartWorkflowDesign");
  const local = appSource.indexOf("applyLocalFirstClassWorkflowDesign(", start);
  const removed = appSource.indexOf("Model-designed workflow topology has been removed", start);
  const designFn = appSource.indexOf("function callOpenAIForWorkflowDesign");
  assert.ok(local > start);
  assert.ok(removed > local);
  assert.equal(designFn, -1);
});

test("H: quiz, slides, VLE, rubric, and QA wording does not add residual stages", () => {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Create a quiz with slides, a VLE, a marking rubric, and QA review",
    startingArtefact: "generate_from_topic"
  });
  const residual = [
    "Generate Assessment Items",
    "Design Assessment",
    "Design Feedback",
    "Generate Slide Deck",
    "Generate VLE Structure",
    "Generate Learning Object Set",
    "Design Marking Rubric",
    "Validate Learning Design",
    "Revise Assessment Based on QA"
  ];
  residual.forEach(function (title) {
    assert.equal(titles(built).includes(title), false, title);
  });
  assert.deepEqual(titles(built), INTERACTIVE);
});

test("I: reading legacy identity does not rebuild or strip a saved graph", () => {
  const saved = {
    id: "old",
    ldCreateOutputType: "workshop",
    steps: [{ title: "Generate Slide Deck" }, { title: "Design Assessment" }]
  };
  const before = JSON.stringify(saved);
  const identity = family.readFirstClassIdentity(saved);
  assert.equal(JSON.stringify(saved), before);
  assert.equal(identity.product, "interactive");
  assert.equal(identity.variant, "workshop");
  assert.equal(identity.source, "legacy_ldCreateOutputType");
  const unknown = family.readFirstClassIdentity({ id: "plain", steps: [{ title: "Custom step" }] });
  assert.equal(unknown.product, "");
  assert.equal(unknown.source, "unknown");
  const loadStart = appSource.indexOf("function loadWorkflows(");
  const loadEnd = appSource.indexOf("function saveWorkflows(", loadStart);
  const loadBody = appSource.slice(loadStart, loadEnd);
  assert.equal(loadBody.includes("buildFirstClassWorkflowFamily"), false);
  assert.equal(loadBody.includes("applyLocalFirstClassWorkflowDesign"), false);
});

test("J: Research is not a normal first-class local create", () => {
  const helper = appSource.slice(
    appSource.indexOf("function isNormalFirstClassLearningDesignCreate"),
    appSource.indexOf("function applyLocalFirstClassWorkflowDesign")
  );
  assert.match(helper, /learning-design/);
  assert.match(helper, /research/);
  assert.match(helper, /if \(!hasLearningDesign \|\| hasResearch\) return false/);
});
