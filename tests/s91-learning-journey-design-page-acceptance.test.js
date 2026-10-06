/**
 * Sprint 91 — Learning Journey Step 5 final capture acceptance (shared page contract).
 *
 * GPT emits ordinary artifact_type "page" with product_id learning_journey.
 * LJ acceptance reuses the shared page parser, then applies LJ semantic validation.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function buildLjWorkflow() {
  const built = family.buildFirstClassWorkflowFamily({
    product: "learning_journey",
    focus: "Online credibility judgements",
    learningTime: "90 minutes",
    duration: "1 day",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  return {
    id: "wf-lj-accept",
    product: "learning_journey",
    name: "LJ accept",
    steps: built.steps.map((step, index) =>
      Object.assign({}, step, { id: "lj-acc-" + (index + 1) })
    )
  };
}

function buildInteractiveWorkflow() {
  const built = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(built.ok, true);
  return {
    id: "wf-int-accept",
    product: "interactive",
    name: "Interactive accept",
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: built.steps.map((step, index) =>
      Object.assign({}, step, { id: "int-acc-" + (index + 1) })
    )
  };
}

test("valid GPT Learning Journey Step 5 page passes the live Run acceptance path", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/learning-journey-design-page.js"]
  });
  assert.equal(typeof api.parseWorkflowRunPageStructureCaptureForStorage, "function");

  const wf = buildLjWorkflow();
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  assert.ok(designStep);
  assert.equal(designStep.outputName, "learning_journey_page");

  const fixture = design.buildLearningJourneyDesignPageFixture({
    title: "Judging the Credibility of Online Information"
  });
  assert.equal(fixture.ok, true);
  assert.equal(fixture.page.artifact_type, "page");
  assert.equal(fixture.page.product_id, "learning_journey");
  assert.equal(fixture.page.assembly_state.calls_model, true);

  const raw =
    "```json\n" +
    JSON.stringify(fixture.page, null, 2) +
    "\n```\nSTEP 5 OUTPUT: learning_journey_page";

  const accepted = api.parseWorkflowRunPageStructureCaptureForStorage(raw, designStep, wf);
  assert.equal(accepted.ok, true, accepted.message || (accepted.errors || []).join("; "));
  assert.equal(accepted.parsed.artifact_type, "page");
  assert.equal(accepted.parsed.schema_version, "2.0.0");
  assert.equal(accepted.parsed.product_id, "learning_journey");
  assert.equal(accepted.parsed.assembly_state.calls_model, true);
  assert.ok(Array.isArray(accepted.parsed.sections));
  assert.ok(Array.isArray(accepted.parsed.commissions));
  assert.equal(design.validateLearningJourneyDesignPage(accepted.parsed).ok, true);

  const stored = JSON.parse(accepted.json);
  assert.equal(stored.artifact_type, "page");
  assert.equal(stored.product_id, "learning_journey");
  assert.equal(stored.commissions.length, fixture.page.commissions.length);
  assert.doesNotMatch(accepted.json, /"page_synthesis"/);

  // Shared page parser accepts artifact_type page (including LJ pages as bare pages).
  const generic = api.parsePageArtefactCaptureForStorage(JSON.stringify(fixture.page));
  assert.equal(generic.ok, true);
  assert.equal(generic.parsed.artifact_type, "page");

  // Allowlist for LJ Design Page step includes shared page artifact type.
  const allowed = api.workflowRunCaptureAllowedArtifactTypes(designStep);
  assert.ok(allowed.includes("page"));
  assert.ok(allowed.includes("learning_journey_page"));
});

test("Interactive Design Page still requires artifact_type page on the same acceptance boundary", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/learning-journey-design-page.js"]
  });
  const wf = buildInteractiveWorkflow();
  const designStep = wf.steps.find((s) => s.title === "Design Page");
  assert.ok(designStep);

  const interactivePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Bayes",
    page_synthesis: { overview: { body: "Overview" } },
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [],
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"] }
  };
  const accepted = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(interactivePage),
    designStep,
    wf
  );
  assert.equal(accepted.ok, true);
  assert.equal(accepted.parsed.artifact_type, "page");

  const missingType = Object.assign({}, interactivePage);
  delete missingType.artifact_type;
  const rejected = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(missingType),
    designStep,
    wf
  );
  assert.equal(rejected.ok, false);
  assert.match(String(rejected.message || ""), /artifact_type "page"/);
});

test("invalid Learning Journey shapes remain rejected on the live acceptance path", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/learning-journey-design-page.js"]
  });
  const wf = buildLjWorkflow();
  const designStep = wf.steps.find((s) => s.title === "Design Page");

  const obsolete = {
    artifact_type: "learning_journey_page",
    schema_version: "1.0.0",
    title: "Obsolete",
    rationale: { markdown: "x" },
    journey: { markdown: "y" },
    elements: { markdown: "z" },
    assembly_state: { calls_model: true }
  };
  const rejectedObsolete = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(obsolete),
    designStep,
    wf
  );
  assert.equal(rejectedObsolete.ok, false);

  const wrapper = {
    learning_journey_page: {
      title: "Wrapped",
      page_synthesis: { overview: { body: "x" } },
      visual_affordances: [],
      assembly_state: { current_stage: "design_page", calls_model: true }
    }
  };
  const rejectedWrapper = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(wrapper),
    designStep,
    wf
  );
  assert.equal(rejectedWrapper.ok, false);

  const interactiveMasquerade = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Not LJ",
    page_synthesis: {},
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [],
    assembly_state: { current_stage: "design_page", calls_model: true }
  };
  const rejectedInteractive = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(interactiveMasquerade),
    designStep,
    wf
  );
  assert.equal(rejectedInteractive.ok, false);

  const callsModelFalse = design.buildLearningJourneyDesignPageFixture({
    title: "LJ"
  }).page;
  callsModelFalse.assembly_state.calls_model = false;
  const rejectedFalse = api.parseWorkflowRunPageStructureCaptureForStorage(
    JSON.stringify(callsModelFalse),
    designStep,
    wf
  );
  assert.equal(rejectedFalse.ok, false);
});
