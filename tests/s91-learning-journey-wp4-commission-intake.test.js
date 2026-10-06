/**
 * Sprint 91 WP4 — Shared commission intake → Interactive first proof.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const intake = require("../lib/first-class-commission-intake.js");

const SPEC = [
  "Commission title: Compare contested sources",
  "Product type: Interactive Resource",
  "Educational job: Practise comparing contested sources with consequential learner action.",
  "Learner experience required: Side-by-side comparison with feedback.",
  "Approximate learner time: 35 minutes"
].join("\n");

const JOURNEY_CONTEXT = [
  "LEARNING PROGRESSION",
  "JOURNEY STRUCTURE",
  "A single continuous Learning Journey.",
  "Phase 2 — Compare sources"
].join("\n");

const INTERACTIVE_TITLES = family.INTERACTIVE_TITLES.slice();

test("Interactive is accepted because family declares acceptsCommission", () => {
  assert.equal(family.productAcceptsCommission("interactive"), true);
  assert.equal(intake.productAcceptsCommission("interactive"), true);
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Online credibility judgements",
    journeyContextText: JOURNEY_CONTEXT,
    sourceJourneyWorkflowId: "wf-lj-1"
  });
  assert.equal(result.ok, true);
  assert.equal(result.accepted, true);
  assert.equal(result.unsupported, false);
  assert.equal(result.productId, "interactive");
});

test("Learning Journey is not commissionable", () => {
  assert.equal(family.productAcceptsCommission("learning_journey"), false);
  const result = intake.intakeCommission({
    productId: "learning_journey",
    specificationText: SPEC,
    focus: "Should not initialise"
  });
  assert.equal(result.ok, false);
  assert.equal(result.accepted, false);
  assert.equal(result.unsupported, true);
  assert.equal(result.code, "product_not_commissionable");
  assert.equal(result.specificationText, SPEC);
});

test("unknown product is unsupported", () => {
  const result = intake.intakeCommission({
    productId: "situated_task",
    specificationText: SPEC
  });
  assert.equal(result.ok, false);
  assert.equal(result.unsupported, true);
  assert.equal(result.code, "unknown_product");
  assert.equal(result.specificationText, SPEC);
});

test("unsupported intake preserves authoritative specification", () => {
  const result = intake.intakeCommission({
    productId: "learning_journey",
    specificationText: SPEC,
    journeyContextText: JOURNEY_CONTEXT
  });
  assert.equal(result.ok, false);
  assert.equal(result.unsupported, true);
  assert.equal(result.code, "product_not_commissionable");
  assert.equal(result.specificationText, SPEC);
  assert.equal(result.envelope.specificationText, SPEC);
  assert.equal(result.envelope.journeyContextText, JOURNEY_CONTEXT);
});

test("accepted Interactive intake preserves commission specification and Journey context", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Compare contested sources",
    journeyContextText: JOURNEY_CONTEXT,
    constraints: "90-minute envelope",
    sourceJourneyWorkflowId: "wf-lj-1",
    sourceCommissionId: "author-supplied-c1"
  });
  assert.equal(result.ok, true);
  assert.equal(result.specificationText, SPEC);
  assert.equal(result.envelope.journeyContextText, JOURNEY_CONTEXT);
  assert.equal(result.family.deliverySeed.commission_specification, SPEC);
  assert.equal(result.family.deliverySeed.journey_context, JOURNEY_CONTEXT);
  assert.match(result.createSeed.inputs, /COMMISSION SPECIFICATION/);
  assert.match(result.createSeed.inputs, /Compare contested sources/);
  assert.equal(result.createSeed.sourceMaterial, SPEC);
  assert.equal(result.createSeed.journeyContextText, JOURNEY_CONTEXT);
});

test("commission intake constructs Interactive through existing first-class family path", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Compare contested sources"
  });
  assert.equal(result.ok, true);
  assert.equal(result.family.callsModel, false);
  assert.equal(result.family.identity.product, "interactive");
  assert.equal(result.family.identity.variant, "self_study");
  assert.ok(Array.isArray(result.family.steps));
  assert.ok(result.family.steps.length >= INTERACTIVE_TITLES.length);
});

test("resulting product identity is interactive", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Credibility comparison"
  });
  assert.equal(result.family.identity.product, "interactive");
  assert.notEqual(result.family.identity.product, "learning_journey");
});

test("resulting stage topology is predetermined Interactive topology", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Credibility comparison"
  });
  assert.deepEqual(result.family.titles, INTERACTIVE_TITLES);
  const direct = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Credibility comparison",
    startingArtefact: "generate_from_topic"
  });
  assert.deepEqual(result.family.titles, direct.titles);
});

test("commission input does not splice Learning Journey stages into Interactive", () => {
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Credibility comparison",
    journeyContextText: "Journey Requirements\nJourney Progression\nJourney Elements"
  });
  const titles = result.family.titles.join(" | ");
  assert.equal(titles.includes("Journey Requirements"), false);
  assert.equal(titles.includes("Journey Progression"), false);
  assert.equal(titles.includes("Journey Elements"), false);
  assert.equal(titles.includes("Journey Commissioning"), false);
  assert.ok(result.family.titles.indexOf("Design Learning Activities") !== -1);
});

test("direct Interactive Create remains unchanged", () => {
  const direct = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic",
    audience: "students"
  });
  assert.equal(direct.ok, true);
  assert.equal(direct.identity.product, "interactive");
  assert.deepEqual(direct.titles, INTERACTIVE_TITLES);
  assert.equal(direct.deliverySeed.topic, "Bayes");
  assert.equal(direct.deliverySeed.audience, "students");
  assert.equal(direct.deliverySeed.commission_specification, undefined);
});

test("no semantic parsing of Learning Journey commissioning prose is introduced", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "lib/first-class-commission-intake.js"),
    "utf8"
  );
  assert.doesNotMatch(source, /UNSUPPORTED COMMISSIONS/);
  assert.doesNotMatch(source, /Commission title:/);
  assert.doesNotMatch(source, /matchAll\s*\(/);
  assert.doesNotMatch(source, /split\s*\(\s*\/#{2,}/);
  // Envelope uses author-supplied specificationText only.
  const result = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC + "\n\n## Another heading that must not be split",
    focus: "Keep whole specification"
  });
  assert.equal(result.envelope.specificationText.includes("Another heading"), true);
  assert.equal(result.family.deliverySeed.commission_specification, result.envelope.specificationText);
});

test("Expository and Assessment Pack accept commissions for Learning Journey commissioning", () => {
  assert.equal(family.productAcceptsCommission("expository"), true);
  assert.equal(family.productAcceptsCommission("assessment_pack"), true);
  const expository = intake.intakeCommission({ productId: "expository", specificationText: SPEC, focus: "Cues" });
  assert.equal(expository.ok, true);
  assert.equal(expository.accepted, true);
  assert.equal(expository.family.identity.product, "expository");
  const assessment = intake.intakeCommission({
    productId: "assessment_pack",
    specificationText: SPEC,
    focus: "Defend"
  });
  assert.equal(assessment.ok, true);
  assert.equal(assessment.accepted, true);
  assert.equal(assessment.family.identity.product, "assessment_pack");
});

test("provenance fields are retained when supplied and optional when absent", () => {
  const withProv = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Credibility",
    sourceJourneyWorkflowId: "wf-lj-9",
    sourceCommissionId: "c-author-1"
  });
  assert.equal(withProv.family.identity.sourceWorkflowId, "wf-lj-9");
  assert.equal(withProv.createSeed.sourceCommissionId, "c-author-1");
  const without = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC,
    focus: "Credibility"
  });
  assert.equal(without.ok, true);
  assert.equal(without.family.identity.sourceWorkflowId, undefined);
  assert.equal(without.createSeed.sourceCommissionId, "");
});

test("manual Commission Intake UI is removed; shared programmatic intake path remains", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.doesNotMatch(appSource, /mountLearningJourneyCommissionIntakePanel/);
  assert.doesNotMatch(appSource, /handleLearningJourneyCommissionIntakeSubmit/);
  assert.doesNotMatch(appSource, /Commission intake \(alpha\)/);
  assert.doesNotMatch(appSource, /ljCommissionIntakePanel/);
  assert.doesNotMatch(appSource, /Initialise Interactive from commission/);
  assert.match(appSource, /applyAcceptedCommissionIntake/);
  assert.match(appSource, /initialiseFirstClassProductFromLearningJourneyCommission/);
  assert.match(appSource, /intakeCommission/);
  const designSource = fs.readFileSync(
    path.join(__dirname, "..", "lib/learning-journey-design-page.js"),
    "utf8"
  );
  assert.match(designSource, /commissionToIntakeEnvelope/);
  assert.match(designSource, /resolveCommissionFromPage/);
  assert.doesNotMatch(designSource, /intakeCommission|UNSUPPORTED COMMISSIONS|matchAll\s*\(/);
});

test("commission sidecar maps to shared intake envelope without inventing product for unsupported", () => {
  const design = require("../lib/learning-journey-design-page.js");
  const fixture = design.buildLearningJourneyDesignPageFixture({ title: "LJ" });
  const unsupported = design.resolveCommissionFromPage(fixture.page, "c2");
  const envelope = design.commissionToIntakeEnvelope(unsupported, fixture.page, {
    sourceJourneyWorkflowId: "wf-lj-1"
  });
  assert.equal(envelope.status, "unsupported");
  assert.equal(envelope.productId, "");
  assert.ok(envelope.specificationText);
  assert.ok(envelope.journeyContextText);
  assert.equal(envelope.sourceCommissionId, "c2");
  assert.equal(envelope.sectionId, "exp_2");
});

