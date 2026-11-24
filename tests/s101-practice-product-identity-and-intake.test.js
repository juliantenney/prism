/**
 * Sprint 101D — Practice product identity, intake, LJ support, renderer pageKind.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const intake = require("../lib/first-class-commission-intake.js");
const designPage = require("../lib/learning-journey-design-page.js");
const buildPageModel = require("../lib/learner-renderer-vnext/build-page-model.js");
const practiceContracts = require("../lib/ld-practice-presentation-contracts.js");
const siblingPrompts = require("../lib/learning-journey-sibling-prompts.js");

const SPEC = [
  "Learning job: Develop gradient/feasibility judgements through practice.",
  "Learner actions: Classify points, compute directional derivatives, revise after feedback.",
  "Explanation licence: point-of-need apparatus only.",
  "Time envelope: 30 minutes."
].join("\n");

test("Practice is a first-class commissionable product with own promptRoute", () => {
  assert.equal(family.productAcceptsCommission("practice"), true);
  assert.equal(intake.productAcceptsCommission("practice"), true);
  const products = family.listFirstClassProducts();
  const row = products.find((p) => p && p.id === "practice");
  assert.ok(row);
  assert.equal(row.promptRoute, "practice");
  assert.equal(row.publishRoute, "learner_page");
  assert.equal(row.acceptsCommission, true);
});

test("Practice is not offered as a Create-menu declaration", () => {
  const decls = family.listCreateDeclarations();
  assert.equal(
    decls.some((d) => d && (d.product === "practice" || d.value === "practice")),
    false
  );
});

test("Practice intake builds Practice identity with Interactive stage topology", () => {
  const result = intake.intakeCommission({
    productId: "practice",
    specificationText: SPEC,
    focus: "Seeing gradients practice",
    journeyContextText: "Prior: Why the constraint matters.",
    sourceJourneyWorkflowId: "wf-lj-new",
    sourceCommissionId: "c-practice-1"
  });
  assert.equal(result.ok, true);
  assert.equal(result.accepted, true);
  assert.equal(result.productId, "practice");
  assert.equal(result.family.identity.product, "practice");
  assert.equal(result.family.identity.variant, "");
  assert.equal(result.family.identity.ldCreateOutputType, family.LD_PRACTICE);
  assert.deepEqual(
    result.family.titles.filter((t) => t !== "Normalize Content"),
    family.INTERACTIVE_TITLES
  );
  assert.equal(result.family.deliverySeed.page_kind, "practice");
  assert.equal(result.family.deliverySeed.commission_specification, SPEC);
  assert.match(String(result.family.deliverySeed.journey_context || ""), /constraint matters/i);
});

test("Practice intake does not inherit Interactive self_study variant from default create type", () => {
  const built = family.buildFirstClassWorkflowFamily({
    product: "practice",
    ldCreateOutputType: "self_study_resource",
    focus: "Practice focus",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  assert.equal(built.identity.product, "practice");
  assert.equal(built.identity.variant, "");
});

test("Interactive intake remains unchanged", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Interactive focus"
  });
  assert.equal(result.ok, true);
  assert.equal(result.family.identity.product, "interactive");
  assert.equal(result.family.identity.variant, "self_study");
});

test("unknown products still fail closed", () => {
  const result = intake.intakeCommission({
    productId: "not_a_product",
    specificationText: SPEC
  });
  assert.equal(result.ok, false);
  assert.equal(result.code, "unknown_product");
});

test("LJ Design Page supports practice product_id", () => {
  assert.ok(designPage.SUPPORTED_PRODUCT_IDS.includes("practice"));
  assert.equal(designPage.productAcceptsCommission("practice"), true);
  const prompt = designPage.buildLearningJourneyDesignPagePrompt();
  assert.match(String(prompt), /practice/);
  assert.match(String(prompt), /Prefer product_id "practice"/i);
  assert.match(String(prompt), /do not select product_id "interactive"/i);
});

test("LJ commissioning sibling prompt prefers Practice for activity", () => {
  const body = siblingPrompts.TEMPLATES.learning_commissions;
  assert.match(body, /1\. PRACTICE/);
  assert.match(body, /prefer Practice over Interactive/i);
  assert.match(body, /Do not commission Interactive on new journeys/i);
  assert.match(body, /CENTRE OF GRAVITY/);
});

test("Practice presentation contracts expose Practice DP shape", () => {
  const block = practiceContracts.buildPracticePresentationContractBlock();
  assert.match(block, /page_kind "practice"/);
  assert.match(block, /Purpose-driven editorial furniture/i);
  assert.match(block, /page_synthesis: \{\} or partial omissions are valid/i);
  assert.match(block, /Do NOT impose a universal attempt-before-explanation rule/);
  const shape = practiceContracts.buildCanonicalPracticeDesignPageShapeSnippet();
  assert.match(shape, /"product_id": "practice"/);
});

test("renderer recognises Practice pages and does not treat Interactive as Practice", () => {
  const practicePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "practice",
    page_kind: "practice",
    title: "Practice stop"
  };
  const interactivePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: "Interactive resource"
  };
  assert.equal(buildPageModel.isPracticeLearnerPage(practicePage), true);
  assert.equal(buildPageModel.isPracticeLearnerPage(interactivePage), false);
  // pageKind discrimination mirrors product markers used by buildPageModel.
  assert.equal(
    buildPageModel.isPracticeLearnerPage(practicePage)
      ? "practice"
      : buildPageModel.isExpositoryLearnerPage(practicePage)
        ? "expository"
        : "interactive",
    "practice"
  );
});

test("promptRouteForWorkflow returns practice for Practice workflows", () => {
  assert.equal(
    family.promptRouteForWorkflow({ product: "practice", startingPoint: "generate_from_topic" }),
    "practice"
  );
  assert.equal(
    family.promptRouteForWorkflow({
      product: "interactive",
      variant: "self_study",
      startingPoint: "generate_from_topic"
    }),
    "interactive"
  );
});
