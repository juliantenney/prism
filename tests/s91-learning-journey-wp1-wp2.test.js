/**
 * Sprint 91 WP1/WP2 — Learning Journey first-class registration, pipeline, prompts.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const sibling = require("../lib/learning-journey-sibling-prompts.js");
const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const authenticated = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "..",
      "docs/development/sprints/2026-10-06-sprint-91-learning-journey-first-class-implementation/JOURNEY-PROTOTYPE-AUTHENTICATED-EXPORT.json"
    ),
    "utf8"
  )
);

const LJ_TITLES = [
  "Requirements",
  "Progression",
  "Elements",
  "Commissioning",
  "Design Page"
];

const LJ_OUTPUTS = [
  "learning_requirements",
  "learning_progression",
  "learning_elements",
  "learning_commissions",
  "learning_journey_page"
];

test("learning_journey is registered as a first-class product", () => {
  const ids = family.listFirstClassProducts().map((row) => row.id);
  assert.ok(ids.indexOf("learning_journey") !== -1);
  assert.ok(ids.indexOf("interactive") !== -1);
  assert.ok(ids.indexOf("expository") !== -1);
  assert.ok(ids.indexOf("assessment_pack") !== -1);
  assert.equal(ids.length, 4);
});

test("Learning Journey Create declaration exists and maps to learning_journey", () => {
  const row = family.createDeclarationForValue("learning_journey");
  assert.ok(row);
  assert.equal(row.product, "learning_journey");
  assert.equal(row.parameterHook, "learning_journey");
  const declared = family.listCreateDeclarations().map((d) => d.value);
  assert.ok(declared.indexOf("learning_journey") !== -1);
});

test("Create markup includes learning_journey with family declarations", () => {
  const declared = family.listCreateDeclarations();
  const select = indexHtml.match(/<select[^>]*id="wfLdCreateOutputType"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(select);
  const options = [];
  const re = /<option value="([^"]*)">/g;
  let match;
  while ((match = re.exec(select[1]))) options.push(match[1]);
  assert.deepEqual(
    options.filter((value) => value),
    declared.map((row) => row.value)
  );
});

test("predetermined Learning Journey stage order and capture identities", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Online credibility judgements",
    learningTime: "90 minutes",
    duration: "1 day",
    audience: "university students",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  assert.equal(built.callsModel, false);
  assert.equal(built.identity.product, "learning_journey");
  assert.equal(built.identity.ldCreateOutputType, "learning_journey");
  assert.deepEqual(built.titles, LJ_TITLES);
  assert.deepEqual(
    built.steps.map((s) => s.outputName),
    LJ_OUTPUTS
  );
  assert.equal(built.deliverySeed.learning_time, "90 minutes");
  assert.equal(built.deliverySeed.duration, "1 day");
  assert.match(built.deliverySeed.original_brief, /LEARNING TIME/);
  assert.match(built.deliverySeed.original_brief, /DURATION/);
});

test("authenticated Learning Journey prompts match export top-level bodies", () => {
  const byTitle = {};
  authenticated.prompts.forEach((p) => {
    byTitle[p.title] = p.body;
  });
  assert.equal(sibling.TEMPLATES.learning_requirements, byTitle.JourneyRequirements);
  assert.equal(sibling.TEMPLATES.learning_progression, byTitle.JourneyProgression);
  assert.equal(sibling.TEMPLATES.learning_elements, byTitle.JourneyElements);
  assert.equal(sibling.TEMPLATES.learning_commissions, byTitle.JourneyCommissioning);
  const historical = authenticated.prompts.find((p) => p.title === "JourneyRequirements").versions[0]
    .body;
  assert.notEqual(sibling.TEMPLATES.learning_requirements, historical);
});

test("LJ sibling routing resolves by title and outputName", () => {
  assert.equal(
    sibling.resolveStageFromStepIdentity({ title: "Requirements" }),
    "learning_requirements"
  );
  assert.equal(
    sibling.resolveStageFromStepIdentity({ title: "Journey Requirements" }),
    "learning_requirements"
  );
  assert.equal(
    sibling.resolveStageFromStepIdentity({ outputName: "learning_commissions" }),
    "learning_commissions"
  );
  assert.equal(
    sibling.resolveStageFromStepIdentity({ title: "JourneyCommission" }),
    "learning_commissions"
  );
  assert.equal(
    sibling.resolveStageFromStepIdentity({ title: "Commissioning" }),
    "learning_commissions"
  );
  assert.ok(sibling.resolveTemplate("learning_requirements").indexOf("LEARNING REQUIREMENTS") !== -1);
});

test("prompt and publish routes for learning_journey do not fall through to interactive", () => {
  assert.equal(family.promptRouteForWorkflow({ product: "learning_journey" }), "learning_journey");
  assert.equal(family.publishRouteForWorkflow({ product: "learning_journey" }), "learning_journey_page");
  assert.equal(family.promptRouteForWorkflow({ product: "interactive" }), "interactive");
  assert.match(appSource, /learning_journey_sibling/);
  assert.match(appSource, /resolveLearningJourneySiblingPromptBodyForStep/);
  assert.match(appSource, /promptRoute === "learning_journey"/);
});

test("Interactive accepts commissions; Learning Journey does not", () => {
  const interactive = family.listFirstClassProducts().find((row) => row.id === "interactive");
  const journey = family.listFirstClassProducts().find((row) => row.id === "learning_journey");
  assert.equal(interactive.acceptsCommission, true);
  assert.equal(journey.acceptsCommission, undefined);
  assert.equal(family.productAcceptsCommission("interactive"), true);
  assert.equal(family.productAcceptsCommission("learning_journey"), false);
});

test("existing Interactive / Expository / Assessment pipelines remain intact", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const expository = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  const assessment = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Bayes",
    startingPoint: "topic"
  });
  assert.equal(interactive.identity.product, "interactive");
  assert.ok(interactive.titles.indexOf("Design Learning Activities") !== -1);
  assert.equal(expository.identity.product, "expository");
  assert.ok(expository.titles.indexOf("Expository Journey Plan") !== -1);
  assert.equal(assessment.identity.product, "assessment_pack");
  assert.ok(assessment.titles.indexOf("Plan Assessment Evidence") !== -1);
});
