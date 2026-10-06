/**
 * Sprint 91 — Direct constituent-product initialisation from Learning Journey Preview.
 *
 * Preview buttons carry identity only. Authoritative commission body is resolved
 * from the Learning Journey page/state and fed through shared commission intake.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const design = require("../lib/learning-journey-design-page.js");
const intake = require("../lib/first-class-commission-intake.js");
const family = require("../lib/first-class-workflow-family.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const SPEC_C1 =
  "AUTHORITATIVE_C1_SPEC — Challenge first impressions with consequential learner action.";
const JOURNEY_C1 = "AUTHORITATIVE_C1_JOURNEY_CONTEXT — earlier judgements remain available.";

function buildLiveLikePage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Judging the Credibility of Online Information",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Build and defend a credibility judgement."
      },
      {
        section_id: "exp_1",
        title: "Challenge Your First Impression",
        order: 2,
        exposition: "Notice and question your first reaction."
      },
      {
        section_id: "exp_4",
        title: "Conduct and Weigh a Credibility Investigation",
        order: 3,
        exposition: "Carry out a fuller investigation."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Challenge Your First Impression",
        product_id: "interactive",
        status: "supported",
        specification_text: SPEC_C1,
        journey_context_text: JOURNEY_C1,
        dependencies: "none"
      },
      {
        commission_id: "c4",
        section_id: "exp_4",
        order: 2,
        title: "Conduct and Weigh a Credibility Investigation",
        product_id: "",
        status: "unsupported",
        specification_text: "UNSUPPORTED_SPEC_MUST_NOT_CREATE",
        journey_context_text: "unsupported journey",
        dependencies: "c1"
      }
    ],
    learning_journey: {
      design_intent: "Author intent",
      continuity: JOURNEY_C1
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "learning_requirements",
        "learning_progression",
        "learning_elements",
        "learning_commissions",
        "design_page"
      ],
      calls_model: true
    }
  };
}

function loadApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js"
    ]
  });
  if (loaded.window && loaded.window.Utils && !loaded.window.Utils.uuid) {
    loaded.window.Utils.uuid = function () {
      return "wf-test-" + String(Date.now()) + "-" + String(Math.random()).slice(2, 8);
    };
  }
  // Ensure commission intake is visible to app.js resolvers in the vm sandbox.
  const intakeApi = require("../lib/first-class-commission-intake.js");
  if (loaded.sandbox) loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.window) loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  }
  return loaded;
}

test("valid LJ Preview create-product action resolves authoritative commission and reuses shared intake", () => {
  const { api } = loadApi();
  const page = buildLiveLikePage();
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);

  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-source-1"
  });

  const resolved = api.resolveAuthoritativeLearningJourneyPageForCommissionForTest(
    "wf-lj-source-1",
    "c1"
  );
  assert.equal(resolved.ok, true);
  assert.equal(resolved.page.commissions[0].specification_text, SPEC_C1);

  const commission = design.resolveCommissionFromPage(resolved.page, "c1");
  const envelope = design.commissionToIntakeEnvelope(commission, resolved.page, {
    sourceJourneyWorkflowId: "wf-lj-source-1",
    focus: commission.title
  });
  assert.equal(envelope.specificationText, SPEC_C1);
  assert.equal(envelope.journeyContextText, JOURNEY_C1);
  assert.equal(envelope.sourceCommissionId, "c1");
  assert.equal(envelope.productId, "interactive");

  const intakeResult = intake.intakeCommission(envelope, {
    ldCreateOutputType: "self_study_resource"
  });
  assert.equal(intakeResult.ok, true);
  assert.equal(intakeResult.accepted, true);
  assert.equal(intakeResult.family.identity.product, "interactive");
  assert.equal(intakeResult.family.identity.sourceWorkflowId, "wf-lj-source-1");
  assert.equal(intakeResult.family.identity.sourceCommissionId, "c1");
  assert.match(intakeResult.createSeed.inputs, /AUTHORITATIVE_C1_SPEC/);
});

test("supported Interactive commission creates ordinary Interactive workflow seeded from authoritative page", () => {
  const { api } = loadApi();
  const page = buildLiveLikePage();
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-source-2"
  });

  const beforeCount = (api.getWorkflowsForTest ? api.getWorkflowsForTest() : []).length;
  const result = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "interactive",
    sourceWorkflowId: "wf-lj-source-2"
  });

  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.productId, "interactive");
  assert.equal(result.sourceJourneyWorkflowId, "wf-lj-source-2");
  assert.equal(result.sourceCommissionId, "c1");
  assert.ok(result.workflow, "expected created workflow");
  assert.equal(result.workflow.product, "interactive");
  assert.equal(result.workflow.sourceWorkflowId, "wf-lj-source-2");
  assert.equal(result.workflow.sourceCommissionId, "c1");
  assert.match(String(result.workflow.name || ""), /Challenge Your First Impression/i);

  const brief = result.intake && result.intake.envelope;
  assert.equal(brief.specificationText, SPEC_C1);
  assert.equal(brief.journeyContextText, JOURNEY_C1);
  assert.doesNotMatch(JSON.stringify(result.workflow), /data-lj-product-id/);

  if (typeof api.getWorkflowsForTest === "function") {
    assert.ok(api.getWorkflowsForTest().length >= beforeCount + 1);
  }

  // Create seed / design state holds authoritative specification (not HTML).
  assert.match(
    String(
      (result.intake &&
        result.intake.createSeed &&
        result.intake.createSeed.sourceMaterial) ||
        ""
    ),
    /AUTHORITATIVE_C1_SPEC/
  );
});

test("product mismatch / unknown / unsupported / non-commissionable actions fail safely", () => {
  const { api, sandbox } = loadApi();
  const page = buildLiveLikePage();
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-source-3"
  });

  const mismatch = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "expository",
    sourceWorkflowId: "wf-lj-source-3"
  });
  assert.equal(mismatch.ok, false);
  assert.equal(mismatch.code, "product_identity_mismatch");

  const unknown = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c-missing",
    productId: "interactive",
    sourceWorkflowId: "wf-lj-source-3"
  });
  assert.equal(unknown.ok, false);
  assert.ok(
    unknown.code === "commission_not_found" ||
      unknown.code === "learning_journey_page_unavailable"
  );

  const unsupported = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c4",
    sectionId: "exp_4",
    productId: "",
    sourceWorkflowId: "wf-lj-source-3"
  });
  assert.equal(unsupported.ok, false);
  assert.equal(unsupported.code, "commission_unsupported");

  const familyApi =
    sandbox.window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY || sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY;
  const original = familyApi.productAcceptsCommission.bind(familyApi);
  familyApi.productAcceptsCommission = function (productId) {
    if (String(productId || "") === "interactive") return false;
    return original(productId);
  };
  const blocked = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "interactive",
    sourceWorkflowId: "wf-lj-source-3"
  });
  familyApi.productAcceptsCommission = original;
  assert.equal(blocked.ok, false);
  assert.equal(blocked.code, "product_not_commissionable");
});

test("commission body is not taken from HTML attributes; Preview export still omits specs", () => {
  const { api } = loadApi();
  const page = buildLiveLikePage();
  const rendered = api.runUtilityPageExportPipelineForTest(page, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.equal(rendered.error, null);
  assert.match(rendered.html, /data-lj-commission-id="c1"/);
  assert.doesNotMatch(rendered.html, /AUTHORITATIVE_C1_SPEC/);
  assert.doesNotMatch(rendered.html, /specification_text=/);

  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-source-4"
  });
  const result = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    // Deliberately omit substantive commission fields — only identity hints.
    productId: "interactive",
    sourceWorkflowId: "wf-lj-source-4"
  });
  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.intake.envelope.specificationText, SPEC_C1);
});

test("ordinary direct first-class workflow creation remains unaffected", () => {
  const direct = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.equal(direct.ok, true);
  assert.equal(direct.identity.product, "interactive");
  assert.equal(direct.identity.sourceWorkflowId, undefined);
  assert.equal(direct.identity.sourceCommissionId, undefined);
  assert.ok(direct.titles.indexOf("Design Learning Activities") !== -1);

  const commissioned = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC_C1,
    focus: "Challenge Your First Impression",
    sourceJourneyWorkflowId: "wf-lj-x",
    sourceCommissionId: "c1"
  });
  assert.equal(commissioned.ok, true);
  assert.deepEqual(commissioned.family.titles, direct.titles);
});
