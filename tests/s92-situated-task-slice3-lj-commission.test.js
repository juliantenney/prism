/**
 * Sprint 92 Gate 8 Slice 3 — Learning Journey commissioning for Situated Task.
 *
 * Proves: supported allow-list, prompt discriminator, shared intake → ordinary
 * Situated workflow + provenance, derived production status, Preview Create,
 * no historical unsupported auto-reclassification, LJ remains noncommissionable.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const intake = require("../lib/first-class-commission-intake.js");
const design = require("../lib/learning-journey-design-page.js");
const status = require("../lib/learning-journey-commission-production-status.js");
const prompts = require("../lib/learning-journey-sibling-prompts.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const STATUS = status.STATUS;
const SITUATED_TITLES = family.SITUATED_TASK_TITLES
  ? family.SITUATED_TASK_TITLES.slice()
  : ["Situation", "Activity", "Support", "Learning Return", "Design Page"];

const SPEC_SITUATED = [
  "Commission title: Observe a workplace practice",
  "Product type: Situated Task",
  "Educational job: Carry out purposeful observation in an authentic workplace context.",
  "Learner experience required: Prepare, bound, support, record, and reconnect the situated activity.",
  "Approximate learner time: 90 minutes"
].join("\n");

const JOURNEY_CONTEXT = [
  "LEARNING PROGRESSION",
  "Phase 3 — Practise in context",
  "Earlier interactive comparison informs what to notice on site."
].join("\n");

function situatedPage(extraCommissions) {
  const commissions = [
    {
      commission_id: "c-sit-1",
      section_id: "exp_sit",
      order: 1,
      title: "Observe a workplace practice",
      product_id: "situated_task",
      status: "supported",
      specification_text: SPEC_SITUATED,
      journey_context_text: JOURNEY_CONTEXT,
      dependencies: "c1"
    },
    {
      commission_id: "c-unsup",
      section_id: "exp_other",
      order: 2,
      title: "Legacy external experience",
      product_id: "",
      status: "unsupported",
      specification_text: "HISTORICAL_UNSUPPORTED_MUST_STAY_UNSUPPORTED",
      journey_context_text: "legacy"
    }
  ];
  if (Array.isArray(extraCommissions)) {
    extraCommissions.forEach(function (row) {
      commissions.push(row);
    });
  }
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Situated commissioning journey",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "You will learn in context."
      },
      {
        section_id: "exp_sit",
        title: "Observe a workplace practice",
        order: 2,
        exposition: "Carry out purposeful observation on site."
      },
      {
        section_id: "exp_other",
        title: "Legacy external experience",
        order: 3,
        exposition: "An experience PRISM cannot manufacture."
      }
    ],
    commissions: commissions,
    learning_journey: {
      design_intent: "Prove Situated Task commissioning.",
      continuity: JOURNEY_CONTEXT
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

function situatedWorkflow(id, provenance) {
  return {
    id: id,
    name: "Observe a workplace practice",
    product: "situated_task",
    sourceWorkflowId: provenance && provenance.sourceWorkflowId,
    sourceCommissionId: provenance && provenance.sourceCommissionId,
    steps: [
      { id: "s1", title: "Situation", canonical_step_id: "step_situation" },
      { id: "s2", title: "Activity", canonical_step_id: "step_activity" },
      { id: "s3", title: "Support", canonical_step_id: "step_support" },
      { id: "s4", title: "Learning Return", canonical_step_id: "step_learning_return" },
      {
        id: "step-dp-1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "situated_task_page"
      }
    ]
  };
}

function situatedDesignPageJson(options) {
  var opts = options && typeof options === "object" ? options : {};
  var page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Observe a workplace practice",
    activities: [],
    sections: [
      {
        section_id: "sit_intro",
        title: "Prepare",
        order: 1,
        exposition: "Prepare for the situated activity."
      }
    ],
    situated_learning: {
      situation: "Workplace observation context.",
      activity: "Observe and record consequential practice.",
      support: "Boundaries and attention cues.",
      learning_return: "Reconnect observations to the journey."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"]
    }
  };
  if (opts.withGenerateAffordance) {
    page.visual_affordances = [
      {
        affordance_id: "va-sit-generate-01",
        visual_decision: "generate",
        purpose: "action_support",
        warrant: "Support noticing in context",
        section_id: "sit_intro"
      }
    ];
  }
  return page;
}

function mockVisualJobsWorkspace(briefs) {
  var rows = Array.isArray(briefs) ? briefs : [];
  return {
    assessRequiredGraphicsJobsFromPage: function (_page, attachmentEvidence) {
      var evidence =
        attachmentEvidence && typeof attachmentEvidence === "object" ? attachmentEvidence : {};
      var refs = Array.isArray(evidence.workflowResourceRefs)
        ? evidence.workflowResourceRefs
        : [];
      if (!rows.length) {
        return {
          ok: true,
          determinable: true,
          complete: true,
          zeroRequired: true,
          requiredCount: 0,
          attachedCount: 0,
          generateCount: 0,
          workspaceStatus: "zero_generate_jobs",
          briefs: [],
          reason: "zero_required_graphics_jobs"
        };
      }
      var attached = 0;
      rows.forEach(function (brief) {
        var covered = refs.some(function (ref) {
          if (!ref || !brief) return false;
          if (String(ref.lifecycle_state || "active") !== "active") return false;
          if (!String(ref.resource_id || "").trim()) return false;
          return (
            String(ref.affordance_id || "") === String(brief.affordance_id || "") ||
            String(ref.brief_id || "") === String(brief.brief_id || "")
          );
        });
        if (covered) attached += 1;
      });
      return {
        ok: true,
        determinable: true,
        complete: attached >= rows.length,
        zeroRequired: false,
        requiredCount: rows.length,
        attachedCount: attached,
        generateCount: rows.length,
        workspaceStatus: "success",
        briefs: rows.slice(),
        reason:
          attached >= rows.length
            ? "all_required_graphics_complete"
            : "required_graphics_outstanding"
      };
    }
  };
}

function loadApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js"
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
  return loaded;
}

test("1. Learning Journey supported-product contract includes situated_task", () => {
  assert.ok(design.SUPPORTED_PRODUCT_IDS.indexOf("situated_task") !== -1);
  assert.ok(design.SUPPORTED_PRODUCT_IDS.indexOf("interactive") !== -1);
  assert.ok(design.SUPPORTED_PRODUCT_IDS.indexOf("expository") !== -1);
  assert.ok(design.SUPPORTED_PRODUCT_IDS.indexOf("assessment_pack") !== -1);
  assert.equal(design.productLabelForId("situated_task"), "Situated Task");
  assert.equal(design.createActionLabelForProduct("situated_task"), "Create Situated Task");
});

test("2. LJ prompt guidance contains Situated Task centre-of-gravity discriminator", () => {
  const body = prompts.TEMPLATES.learning_commissions;
  assert.match(
    body,
    /carrying out purposeful activity in an authentic or situated context is itself the principal learning vehicle/i
  );
  assert.match(body, /CENTRE OF GRAVITY/);
  assert.match(body, /facilitated workshop reasoning remains Interactive/);
  assert.match(body, /generic ["']go away and do X["'] instructions are not sufficient for Situated Task/);
  const designPrompt = design.buildLearningJourneyDesignPagePrompt();
  assert.match(designPrompt, /situated_task/);
});

test("3–4. Valid Situated commission is supported; existing product IDs unchanged", () => {
  const page = situatedPage();
  const gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, true, (gate.errors || []).join(", "));
  const commission = design.resolveCommissionFromPage(page, "c-sit-1");
  assert.equal(commission.product_id, "situated_task");
  assert.equal(commission.status, "supported");
  assert.equal(family.productAcceptsCommission("situated_task"), true);
  assert.equal(family.productAcceptsCommission("interactive"), true);
  assert.equal(family.productAcceptsCommission("expository"), true);
  assert.equal(family.productAcceptsCommission("assessment_pack"), true);
  assert.equal(family.productAcceptsCommission("learning_journey"), false);
});

test("5–8. Shared intake accepts situated_task; creates ordinary pipeline; provenance survives; no auto-run", () => {
  const page = situatedPage();
  const commission = design.resolveCommissionFromPage(page, "c-sit-1");
  const envelope = design.commissionToIntakeEnvelope(commission, page, {
    sourceJourneyWorkflowId: "wf-lj-sit",
    focus: commission.title
  });
  assert.equal(envelope.productId, "situated_task");
  assert.equal(envelope.specificationText, SPEC_SITUATED);
  assert.equal(envelope.journeyContextText, JOURNEY_CONTEXT);
  assert.equal(envelope.sourceCommissionId, "c-sit-1");
  assert.equal(envelope.sourceJourneyWorkflowId, "wf-lj-sit");

  const result = intake.intakeCommission(envelope);
  assert.equal(result.ok, true);
  assert.equal(result.accepted, true);
  assert.equal(result.unsupported, false);
  assert.equal(result.productId, "situated_task");
  assert.equal(result.productLabel, "Situated Task");
  assert.equal(result.family.identity.product, "situated_task");
  assert.equal(result.family.identity.sourceWorkflowId, "wf-lj-sit");
  assert.equal(result.family.identity.sourceCommissionId, "c-sit-1");
  assert.deepEqual(result.family.titles, SITUATED_TITLES);
  assert.equal(result.family.deliverySeed.commission_specification, SPEC_SITUATED);
  assert.equal(result.family.deliverySeed.journey_context, JOURNEY_CONTEXT);
  assert.equal(result.family.callsModel, false);
  assert.doesNotMatch(result.family.titles.join("|"), /Journey /i);

  // Shared intake only builds family seed — it does not start a Run.
  const intakeSource = fs.readFileSync(
    path.join(__dirname, "..", "lib/first-class-commission-intake.js"),
    "utf8"
  );
  assert.doesNotMatch(intakeSource, /startRun|autoRun|runWorkflow|handleStartRun/i);
});

test("6–7. Preview create produces ordinary Situated workflow with provenance", () => {
  const { api } = loadApi();
  const page = situatedPage();
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-sit-create"
  });

  const result = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c-sit-1",
    sectionId: "exp_sit",
    productId: "situated_task",
    sourceWorkflowId: "wf-lj-sit-create"
  });

  assert.equal(result.ok, true, result.code || "");
  assert.equal(result.productId, "situated_task");
  assert.ok(result.workflow, "expected created workflow");
  assert.equal(result.workflow.product, "situated_task");
  assert.equal(result.workflow.sourceWorkflowId, "wf-lj-sit-create");
  assert.equal(result.workflow.sourceCommissionId, "c-sit-1");
  assert.equal(result.intake.envelope.specificationText, SPEC_SITUATED);
  assert.equal(result.intake.envelope.journeyContextText, JOURNEY_CONTEXT);
  assert.deepEqual(result.intake.family.titles, SITUATED_TITLES);

  // Provenance stays on workflow / brief / intake — Design Page contract forbids embedding it.
  const situatedDpSource = fs.readFileSync(
    path.join(__dirname, "..", "lib/situated-task-design-page.js"),
    "utf8"
  );
  assert.match(
    situatedDpSource,
    /sourceWorkflowId \/ sourceCommissionId \/ commission provenance/
  );
  assert.equal(
    result.intake.family.identity.sourceWorkflowId,
    "wf-lj-sit-create"
  );
  assert.equal(result.intake.family.identity.sourceCommissionId, "c-sit-1");
});

test("9–14. Child discovery + derived production status for Situated Task", () => {
  const page = situatedPage();
  const ljId = "wf-lj-status";

  const none = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: ljId,
    page: page,
    workflows: [],
    runStateByWorkflowId: {},
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(none.byCommissionId["c-sit-1"].status, STATUS.NOT_COMMISSIONED);
  assert.equal(none.byCommissionId["c-sit-1"].action, "create");

  const child = situatedWorkflow("wf-sit-1", {
    sourceWorkflowId: ljId,
    sourceCommissionId: "c-sit-1"
  });
  const matches = status.findConstituentWorkflows([child], ljId, "c-sit-1");
  assert.equal(matches.length, 1);
  assert.equal(matches[0].id, "wf-sit-1");

  const production = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: ljId,
    page: page,
    workflows: [child],
    runStateByWorkflowId: { "wf-sit-1": {} },
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(production.byCommissionId["c-sit-1"].status, STATUS.PRODUCTION);

  const zeroGraphicsPage = JSON.stringify(situatedDesignPageJson({}));
  const completeZero = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: ljId,
    page: page,
    workflows: [child],
    runStateByWorkflowId: {
      "wf-sit-1": { capturedOutputs: { "step-dp-1": zeroGraphicsPage }, workflowResourceRefs: [] }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([])
  });
  assert.equal(completeZero.byCommissionId["c-sit-1"].status, STATUS.COMPLETE);
  assert.equal(completeZero.byCommissionId["c-sit-1"].zeroRequiredGraphics, true);

  const withVa = JSON.stringify(situatedDesignPageJson({ withGenerateAffordance: true }));
  const authoring = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: ljId,
    page: page,
    workflows: [child],
    runStateByWorkflowId: {
      "wf-sit-1": { capturedOutputs: { "step-dp-1": withVa }, workflowResourceRefs: [] }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([
      { affordance_id: "va-sit-generate-01", brief_id: "brief-sit-1" }
    ])
  });
  assert.equal(authoring.byCommissionId["c-sit-1"].status, STATUS.AUTHORING);

  const completeGraphics = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: ljId,
    page: page,
    workflows: [child],
    runStateByWorkflowId: {
      "wf-sit-1": {
        capturedOutputs: { "step-dp-1": withVa },
        workflowResourceRefs: [
          {
            affordance_id: "va-sit-generate-01",
            brief_id: "brief-sit-1",
            lifecycle_state: "active",
            resource_id: "res-sit-1"
          }
        ]
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([
      { affordance_id: "va-sit-generate-01", brief_id: "brief-sit-1" }
    ])
  });
  assert.equal(completeGraphics.byCommissionId["c-sit-1"].status, STATUS.COMPLETE);
});

test("15–16. Unsupported commissions remain unsupported; no historical auto-reclassification", () => {
  const page = situatedPage();
  const unsupported = design.resolveCommissionFromPage(page, "c-unsup");
  assert.equal(unsupported.status, "unsupported");
  assert.equal(unsupported.product_id, "");
  const envelope = design.commissionToIntakeEnvelope(unsupported, page, {
    sourceJourneyWorkflowId: "wf-lj"
  });
  assert.equal(envelope.status, "unsupported");
  assert.equal(envelope.productId, "");
  assert.match(envelope.specificationText, /HISTORICAL_UNSUPPORTED/);

  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [],
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(derived.byCommissionId["c-unsup"].status, STATUS.UNSUPPORTED);

  // Saved unsupported row must not be rewritten to situated_task by validation/support.
  const gate = design.validateLearningJourneyDesignPage(page);
  assert.equal(gate.ok, true);
  assert.equal(page.commissions[1].product_id, "");
  assert.equal(page.commissions[1].status, "unsupported");
  assert.notEqual(page.commissions[1].product_id, "situated_task");
});

test("17. Interactive / Expository / Assessment Pack commissioning regressions remain green", () => {
  const interactive = intake.intakeCommission({
    productId: "interactive",
    specificationText: SPEC_SITUATED,
    focus: "Interactive still works"
  });
  assert.equal(interactive.ok, true);
  assert.equal(interactive.family.identity.product, "interactive");

  const expository = intake.intakeCommission({
    productId: "expository",
    specificationText: SPEC_SITUATED,
    focus: "Expository still works"
  });
  assert.equal(expository.ok, true);
  assert.equal(expository.family.identity.product, "expository");

  const assessment = intake.intakeCommission({
    productId: "assessment_pack",
    specificationText: SPEC_SITUATED,
    focus: "Assessment still works"
  });
  assert.equal(assessment.ok, true);
  assert.equal(assessment.family.identity.product, "assessment_pack");
});

test("18. Learning Journey remains noncommissionable", () => {
  assert.equal(family.productAcceptsCommission("learning_journey"), false);
  const result = intake.intakeCommission({
    productId: "learning_journey",
    specificationText: SPEC_SITUATED,
    focus: "Must not initialise"
  });
  assert.equal(result.ok, false);
  assert.equal(result.unsupported, true);
  assert.equal(result.code, "product_not_commissionable");
});

test("Preview UI exposes Situated Task Create for supported uncommissioned commission", () => {
  const page = situatedPage();
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj-ui",
    page: page,
    workflows: [],
    productAcceptsCommission: family.productAcceptsCommission
  });
  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj-ui",
    productionByCommissionId: derived.byCommissionId
  });
  assert.match(preview.html, /Situated Task/);
  assert.match(
    preview.html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c-sit-1"[^>]*data-lj-product-id="situated_task"/
  );
  assert.match(preview.html, /Create Situated Task/);
  assert.match(preview.html, /Unsupported in PRISM/);
});
