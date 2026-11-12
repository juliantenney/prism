/**
 * Learning Journey → Assessment Pack Create handoff: authoring focus/grounding
 * must carry specification_text (not only commission.title) so authentic-performance
 * fidelity and outputCommission see the substantive commission.
 *
 * Does not regenerate live C05 artefacts.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const design = require("../lib/learning-journey-design-page.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const C05_TITLE = "The Committee Recommendation";
const C05_SPEC = [
  "Learners must produce an independent committee recommendation that selects and justifies one of four institutional options,",
  "interprets the quantitative findings, integrates conflicting operational and stakeholder evidence, acknowledges uncertainty,",
  "compares a plausible alternative, and proposes feasible conditions.",
  "They then complete a six-criterion self-review of their own recommendation covering accuracy, critical appraisal, integration,",
  "stakeholder evaluation, proportionality and uncertainty, with optional concise revision.",
  "Short determinate formative checks may support the reasoning, but the independent recommendation and self-review are required learner performances.",
  "Learners should be able to copy their recommendation for later reuse in the journey."
].join(" ");

const DETERMINATE_TITLE = "Prior Probability Check";
const DETERMINATE_SPEC =
  "Check how well the learner can identify a prior probability before new evidence. Use short auto-checkable items only.";

function buildPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Learning Journey: Evidence Under Uncertainty",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "Judge an institutional recommendation under uncertainty."
      },
      {
        section_id: "exp_c05",
        title: C05_TITLE,
        order: 2,
        exposition: "Produce and review an independent committee recommendation."
      },
      {
        section_id: "exp_det",
        title: DETERMINATE_TITLE,
        order: 3,
        exposition: "A short determinate formative check."
      }
    ],
    commissions: [
      {
        commission_id: "c05",
        section_id: "exp_c05",
        order: 1,
        title: C05_TITLE,
        product_id: "assessment_pack",
        status: "supported",
        specification_text: C05_SPEC,
        journey_context_text:
          "Bring forward the learner's earlier judgement and confidence from preceding activities without assuming automatic cross-resource state transfer.",
        dependencies: "c04"
      },
      {
        commission_id: "c_det",
        section_id: "exp_det",
        order: 2,
        title: DETERMINATE_TITLE,
        product_id: "assessment_pack",
        status: "supported",
        specification_text: DETERMINATE_SPEC,
        journey_context_text: "No authentic extended performance is required.",
        dependencies: ""
      }
    ],
    learning_journey: {
      design_intent: "Evidence-informed institutional judgement",
      continuity: "Northbridge SSI scenario continuity."
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
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  catalogueStore.resetStorageBackendForTests();
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/prism-workflow-catalogue-store.js",
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
  const intakeApi = require("../lib/first-class-commission-intake.js");
  if (loaded.sandbox) loaded.sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.window) loaded.window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  if (loaded.sandbox && loaded.sandbox.globalThis) {
    loaded.sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
  }
  if (loaded.window) loaded.window.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  if (loaded.sandbox) {
    loaded.sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    if (loaded.sandbox.globalThis) {
      loaded.sandbox.globalThis.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
    }
  }
  return loaded;
}

async function awaitMaybe(value) {
  if (value && typeof value.then === "function") return value;
  return value;
}

function assessmentStageBodies(intake) {
  const steps = (intake && intake.family && intake.family.steps) || [];
  const byTitle = {};
  steps.forEach(function (step) {
    const title = String((step && step.title) || "");
    if (
      title === "Interpret Evidence Purpose" ||
      title === "Design Evidence Elicitation" ||
      title === "Author Formative Return" ||
      title === "Design Page"
    ) {
      byTitle[title] = String((step && step.promptBody) || "");
    }
  });
  return byTitle;
}

test("C05-style LJ Assessment Pack Create exposes specification in grounding and activates output detection", async () => {
  const { api } = loadApi();
  const page = buildPage();
  assert.equal(design.validateLearningJourneyDesignPage(page).ok, true);

  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-c05"
  });

  const result = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c05",
      sectionId: "exp_c05",
      productId: "assessment_pack",
      sourceWorkflowId: "wf-lj-c05"
    })
  );

  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.productId, "assessment_pack");
  assert.ok(result.workflow);
  assert.equal(result.workflow.name, C05_TITLE);
  assert.equal(result.intake.createSeed.focus, C05_SPEC);
  assert.equal(result.intake.createSeed.displayName, C05_TITLE);
  assert.equal(result.intake.envelope.specificationText, C05_SPEC);

  const bodies = assessmentStageBodies(result.intake);
  assert.ok(bodies["Interpret Evidence Purpose"]);
  assert.ok(bodies["Design Evidence Elicitation"]);
  assert.ok(bodies["Author Formative Return"]);
  assert.ok(bodies["Design Page"]);

  Object.keys(bodies).forEach(function (title) {
    const body = bodies[title];
    assert.match(body, new RegExp("Grounding context: " + C05_SPEC.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(body, /Commissioned authentic performance fidelity/);
    assert.match(body, /independent committee recommendation/);
    assert.match(body, /six-criterion self-review/);
    assert.match(body, /copy their recommendation/);
  });

  assert.match(bodies["Design Page"], /Emit assessment_evidence\.output_specification/);
  assert.equal(
    bodies["Design Page"].indexOf("This commission does not ask for a structured learner-owned artefact"),
    -1
  );
  assert.match(
    bodies["Design Page"],
    /Preserve every non_determinate constructed_performance elicitation/
  );
  // Synthesis-only boundary preserved.
  assert.match(bodies["Design Page"], /Stages 1–3 are your only semantic input/);
  assert.match(bodies["Design Page"], /Do not invent evidence purpose, elicitation, epistemic class/);
});

test("determinate-only LJ Assessment Pack Create keeps omit-output path and short display name", async () => {
  const { api } = loadApi();
  const page = buildPage();
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-det"
  });

  const result = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c_det",
      sectionId: "exp_det",
      productId: "assessment_pack",
      sourceWorkflowId: "wf-lj-det"
    })
  );

  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.workflow.name, DETERMINATE_TITLE);
  assert.equal(result.intake.createSeed.focus, DETERMINATE_SPEC);
  assert.equal(result.intake.createSeed.displayName, DETERMINATE_TITLE);

  const bodies = assessmentStageBodies(result.intake);
  Object.keys(bodies).forEach(function (title) {
    const body = bodies[title];
    assert.match(body, /Do not invent constructed performances the commission does not require/);
    assert.match(body, /auto-checkable items only/);
    assert.equal(body.indexOf("committee recommendation"), -1);
    assert.equal(body.indexOf("six-criterion"), -1);
  });
  assert.match(bodies["Design Page"], /omit output_specification/i);
  assert.match(
    bodies["Design Page"],
    /This commission does not ask for a structured learner-owned artefact/
  );
  assert.equal(bodies["Design Page"].indexOf("Emit assessment_evidence.output_specification"), -1);
});

test("Interactive LJ Create still uses commission title as focus", async () => {
  const { api } = loadApi();
  const page = buildPage();
  page.commissions.push({
    commission_id: "c_int",
    section_id: "exp_c05",
    order: 3,
    title: "Challenge First Impressions",
    product_id: "interactive",
    status: "supported",
    specification_text: "AUTHORITATIVE_INTERACTIVE_SPEC — consequential learner action.",
    journey_context_text: "Interactive journey context.",
    dependencies: ""
  });
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-int"
  });

  const result = await awaitMaybe(
    api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
      commissionId: "c_int",
      productId: "interactive",
      sourceWorkflowId: "wf-lj-int"
    })
  );

  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.workflow.name, "Challenge First Impressions");
  assert.equal(result.intake.createSeed.focus, "Challenge First Impressions");
  assert.equal(result.intake.createSeed.displayName == null, true);
  assert.equal(
    result.intake.envelope.specificationText,
    "AUTHORITATIVE_INTERACTIVE_SPEC — consequential learner action."
  );
});
