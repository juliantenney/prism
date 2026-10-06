/**
 * Sprint 91 — Learning Journey constituent production status (derived).
 *
 * Production state comes from constituent provenance + Design Page / graphics evidence.
 * It is not stored on the Learning Journey page JSON.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const status = require("../lib/learning-journey-commission-production-status.js");
const design = require("../lib/learning-journey-design-page.js");
const family = require("../lib/first-class-workflow-family.js");
const visualJobs = require("../lib/utilities-visual-jobs-workspace.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const fs = require("node:fs");
const path = require("node:path");

const STATUS = status.STATUS;
const ROMAN_ROADS_PAGE = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "page-assemble", "roman-roads-visual-jobs-valid.json"),
    "utf8"
  )
);

function liveLikeLearningJourneyPage() {
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
        exposition: "You will build and defend a credibility judgement."
      },
      {
        section_id: "exp_1",
        title: "Challenge Your First Impression",
        order: 2,
        exposition: "Start by noticing and questioning your first reaction."
      },
      {
        section_id: "exp_2",
        title: "Build a Better Basis for Judgement",
        order: 3,
        exposition: "Establish a stronger basis before investigating further."
      },
      {
        section_id: "exp_4",
        title: "Conduct and Weigh a Credibility Investigation",
        order: 4,
        exposition: "Carry out and weigh a fuller credibility investigation."
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
        specification_text: "SPEC_C1"
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Build a Better Basis for Judgement",
        product_id: "expository",
        status: "supported",
        specification_text: "SPEC_C2"
      },
      {
        commission_id: "c4",
        section_id: "exp_4",
        order: 3,
        title: "Conduct and Weigh a Credibility Investigation",
        product_id: "",
        status: "unsupported",
        specification_text: "SPEC_C4"
      }
    ],
    learning_journey: {
      design_intent: "intent",
      continuity: "continuity"
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

function interactiveWorkflow(id, provenance) {
  return {
    id: id,
    name: "Challenge Your First Impression",
    product: "interactive",
    sourceWorkflowId: provenance && provenance.sourceWorkflowId,
    sourceCommissionId: provenance && provenance.sourceCommissionId,
    steps: [
      {
        id: "step-dp-1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

function designPageJson(options) {
  var opts = options && typeof options === "object" ? options : {};
  var page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Challenge Your First Impression",
    activities: [],
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"]
    }
  };
  if (Array.isArray(opts.visual_affordances)) {
    page.visual_affordances = opts.visual_affordances;
  }
  if (opts.withGenerateAffordance) {
    page.visual_affordances = [
      {
        affordance_id: "va-c1-generate-01",
        visual_decision: "generate",
        warrant: "Needed figure"
      }
    ];
  }
  return page;
}

function mockVisualJobsWorkspace(briefs) {
  var rows = Array.isArray(briefs) ? briefs : [];
  return {
    buildVisualJobsWorkspaceState: function () {
      return {
        assembledPageSnapshot: { artifact_type: "page" },
        contractResult: { valid: true, authoritative_planning_present: true },
        plannerResult: {
          valid: true,
          diagnostics: { generate: rows.length },
          jobs: rows.slice()
        },
        compilerResult: {
          valid: true,
          briefs: rows.slice()
        },
        assetsByBriefId: {}
      };
    },
    countAuthoringGraphicsJobs: function (workspaceState) {
      var list =
        workspaceState &&
        workspaceState.compilerResult &&
        Array.isArray(workspaceState.compilerResult.briefs)
          ? workspaceState.compilerResult.briefs
          : rows;
      return list.length;
    },
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
          if (
            String(ref.affordance_id || "") === String(brief.affordance_id || "") ||
            String(ref.brief_id || "") === String(brief.brief_id || "")
          ) {
            return true;
          }
          return false;
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

function mockAssessOnlyWorkspace(result) {
  return {
    assessRequiredGraphicsJobsFromPage: function () {
      return result;
    }
  };
}

function expositoryWorkflow(id, provenance) {
  return {
    id: id,
    name: "Build a Better Basis for Judgement",
    product: "expository",
    sourceWorkflowId: provenance && provenance.sourceWorkflowId,
    sourceCommissionId: provenance && provenance.sourceCommissionId,
    steps: [
      {
        id: "step-dp-1",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "page"
      }
    ]
  };
}

function refsForBriefs(briefs, completeCount) {
  var rows = Array.isArray(briefs) ? briefs : [];
  var n = Math.max(0, Math.min(completeCount, rows.length));
  var out = [];
  var i;
  for (i = 0; i < n; i += 1) {
    out.push({
      resource_id: "res-img-" + String(i + 1),
      affordance_id: rows[i].affordance_id,
      brief_id: rows[i].brief_id,
      lifecycle_state: "active"
    });
  }
  return out;
}

test("1. no matching constituent → Create remains (not_commissioned)", () => {
  const page = liveLikeLearningJourneyPage();
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [],
    runStateByWorkflowId: {},
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.NOT_COMMISSIONED);
  assert.equal(derived.byCommissionId.c1.action, "create");

  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj",
    productionByCommissionId: derived.byCommissionId
  });
  assert.match(preview.html, /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"/);
  assert.doesNotMatch(preview.html, /data-lj-commission-id="c1"[\s\S]*Open Interactive/);
});

test("2–3. matching constituent, no Design Page → Production + Open (not Create)", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = interactiveWorkflow("wf-c1", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1"
  });
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: { "wf-c1": {} },
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.PRODUCTION);
  assert.equal(derived.byCommissionId.c1.action, "open");
  assert.equal(derived.byCommissionId.c1.openWorkflowId, "wf-c1");
  assert.equal(derived.byCommissionId.c1.statusLabel, "Production");

  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj",
    productionByCommissionId: derived.byCommissionId
  });
  assert.match(preview.html, /Current status: Production/);
  assert.match(
    preview.html,
    /data-lj-action="open-product"[^>]*data-lj-commission-id="c1"[^>]*data-lj-workflow-id="wf-c1"/
  );
  assert.match(preview.html, />Open Interactive</);
  assert.doesNotMatch(
    preview.html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"/
  );
});

test("4. Design Page exists, required graphics outstanding → Authoring", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = interactiveWorkflow("wf-c1", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1"
  });
  const designCapture = JSON.stringify(designPageJson({ withGenerateAffordance: true }));
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: {
      "wf-c1": {
        capturedOutputs: { "step-dp-1": designCapture },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([
      { affordance_id: "va-c1-generate-01", brief_id: "brief-1" }
    ])
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.AUTHORING);
  assert.equal(derived.byCommissionId.c1.hasFinalDesignPage, true);
  assert.equal(derived.byCommissionId.c1.graphicsComplete, false);
  assert.equal(derived.byCommissionId.c1.action, "open");
});

test("5. Design Page + all required graphics complete → Complete", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = interactiveWorkflow("wf-c1", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1"
  });
  const designCapture = JSON.stringify(designPageJson({ withGenerateAffordance: true }));
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: {
      "wf-c1": {
        capturedOutputs: { "step-dp-1": designCapture },
        workflowResourceRefs: [
          {
            affordance_id: "va-c1-generate-01",
            brief_id: "brief-1",
            lifecycle_state: "active",
            resource_id: "res-img-1"
          }
        ]
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([
      { affordance_id: "va-c1-generate-01", brief_id: "brief-1" }
    ])
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.COMPLETE);
  assert.equal(derived.byCommissionId.c1.graphicsComplete, true);
  assert.equal(derived.byCommissionId.c1.statusLabel, "Complete");
});

test("6. Design Page with zero required graphics jobs → Complete", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = interactiveWorkflow("wf-c1", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1"
  });
  const designCapture = JSON.stringify(designPageJson({}));
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: {
      "wf-c1": {
        capturedOutputs: { "step-dp-1": designCapture },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([])
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.COMPLETE);
  assert.equal(derived.byCommissionId.c1.zeroRequiredGraphics, true);
});

test("7–8. optional Resources / Video absence does not block Complete", () => {
  const graphics = status.assessRequiredGraphicsCompletion(
    designPageJson({ withGenerateAffordance: true }),
    {
      workflowResourceRefs: [
        {
          affordance_id: "va-c1-generate-01",
          brief_id: "brief-1",
          lifecycle_state: "active",
          resource_id: "res-img-1"
        }
        // intentionally no page_video_embed / additional resource refs
      ]
    },
    {
      visualJobsWorkspaceMod: mockVisualJobsWorkspace([
        { affordance_id: "va-c1-generate-01", brief_id: "brief-1" }
      ])
    }
  );
  assert.equal(graphics.complete, true);

  const zeroRequired = status.assessRequiredGraphicsCompletion(
    designPageJson({}),
    { workflowResourceRefs: [] },
    { visualJobsWorkspaceMod: mockVisualJobsWorkspace([]) }
  );
  assert.equal(zeroRequired.complete, true);
  assert.equal(zeroRequired.zeroRequired, true);
});

test("LIVE REGRESSION: Expository Design Page + Graphics(4) outstanding → Authoring not Complete", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = expositoryWorkflow("wf-c2-expo", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2"
  });
  const authoringWs = visualJobs.buildVisualJobsWorkspaceState(ROMAN_ROADS_PAGE, {
    activeView: "visual_jobs"
  });
  assert.equal(visualJobs.countAuthoringGraphicsJobs(authoringWs), 4);

  const assessed = visualJobs.assessRequiredGraphicsJobsFromPage(
    ROMAN_ROADS_PAGE,
    { workflowResourceRefs: [] }
  );
  assert.equal(assessed.determinable, true);
  assert.equal(assessed.requiredCount, 4);
  assert.equal(assessed.attachedCount, 0);
  assert.equal(assessed.complete, false);

  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: {
      "wf-c2-expo": {
        capturedOutputs: { "step-dp-1": JSON.stringify(ROMAN_ROADS_PAGE) },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs
  });
  assert.equal(derived.byCommissionId.c2.status, STATUS.AUTHORING);
  assert.equal(derived.byCommissionId.c2.requiredGraphicsCount, 4);
  assert.equal(derived.byCommissionId.c2.attachedGraphicsCount, 0);
  assert.notEqual(derived.byCommissionId.c2.status, STATUS.COMPLETE);

  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj",
    productionByCommissionId: derived.byCommissionId
  });
  assert.match(
    preview.html,
    /data-commission-id="c2"[\s\S]*Current status: Authoring[\s\S]*data-lj-action="open-product"[^>]*data-lj-commission-id="c2"/
  );
  assert.match(preview.html, /Open Expository/);
});

test("partial graphics completion stays Authoring; all four complete → Complete", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = expositoryWorkflow("wf-c2-expo", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2"
  });
  const briefs = visualJobs.assessRequiredGraphicsJobsFromPage(ROMAN_ROADS_PAGE, {
    workflowResourceRefs: []
  }).briefs;
  assert.equal(briefs.length, 4);

  function deriveWithCompleted(n) {
    return status.deriveLearningJourneyCommissionProductionStatuses({
      learningJourneyWorkflowId: "wf-lj",
      page: page,
      workflows: [constituent],
      runStateByWorkflowId: {
        "wf-c2-expo": {
          capturedOutputs: { "step-dp-1": JSON.stringify(ROMAN_ROADS_PAGE) },
          workflowResourceRefs: refsForBriefs(briefs, n)
        }
      },
      productAcceptsCommission: family.productAcceptsCommission,
      visualJobsWorkspaceMod: visualJobs
    });
  }

  assert.equal(deriveWithCompleted(1).byCommissionId.c2.status, STATUS.AUTHORING);
  assert.equal(deriveWithCompleted(3).byCommissionId.c2.status, STATUS.AUTHORING);
  const allDone = deriveWithCompleted(4);
  assert.equal(allDone.byCommissionId.c2.status, STATUS.COMPLETE);
  assert.equal(allDone.byCommissionId.c2.attachedGraphicsCount, 4);
});

test("indeterminate graphics state fails closed to Authoring (not Complete)", () => {
  const page = liveLikeLearningJourneyPage();
  const constituent = interactiveWorkflow("wf-c1", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1"
  });
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: {
      "wf-c1": {
        capturedOutputs: {
          "step-dp-1": JSON.stringify(designPageJson({ withGenerateAffordance: true }))
        },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockAssessOnlyWorkspace({
      ok: false,
      determinable: false,
      complete: false,
      zeroRequired: false,
      requiredCount: -1,
      attachedCount: 0,
      reason: "generate_jobs_without_briefs"
    })
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.AUTHORING);
  assert.equal(derived.byCommissionId.c1.graphicsDeterminable, false);
  assert.notEqual(derived.byCommissionId.c1.status, STATUS.COMPLETE);

  // Unhydrated Design Page body also stays Authoring.
  const unhydrated = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [constituent],
    runStateByWorkflowId: {
      "wf-c1": {
        captureRefs: {
          "step-dp-1": { final: { resource_id: "text-res-dp" } }
        },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs
  });
  assert.equal(unhydrated.byCommissionId.c1.status, STATUS.AUTHORING);
  assert.equal(unhydrated.byCommissionId.c1.hasFinalDesignPage, true);
});

test("Authoring Graphics(N) helper matches compiler briefs length", () => {
  const ws = visualJobs.buildVisualJobsWorkspaceState(ROMAN_ROADS_PAGE, {});
  assert.equal(visualJobs.countAuthoringGraphicsJobs(ws), 4);
  assert.equal(
    visualJobs.countAuthoringGraphicsJobs(ws),
    (ws.compilerResult.briefs || []).length
  );
});

test("LIVE REGRESSION: 4 attached images in owner store → Complete while LJ is current workflow", async () => {
  const workflowResources = require("../lib/prism-workflow-resources.js");
  workflowResources.resetStorageBackendForTests();

  const TINY_PNG_BYTES = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  function pngBlob() {
    return new Blob([TINY_PNG_BYTES], { type: "image/png" });
  }

  const briefs = visualJobs.assessRequiredGraphicsJobsFromPage(ROMAN_ROADS_PAGE, {
    workflowResourceRefs: []
  }).briefs;
  assert.equal(briefs.length, 4);

  // Persist four completed attachments on the CONSTITUENT workflow only.
  // Intentionally leave runstate workflowResourceRefs empty — Authoring recovers
  // from the owner store; LJ status must do the same.
  for (let i = 0; i < briefs.length; i += 1) {
    const put = await workflowResources.putBinaryResource({
      workflow_id: "wf-c2-expo",
      affordance_id: briefs[i].affordance_id,
      brief_id: briefs[i].brief_id,
      mime_type: "image/png",
      payload_blob: pngBlob(),
      byte_size: TINY_PNG_BYTES.length
    });
    assert.equal(put.ok, true, put.code || "");
  }

  // Noise: another workflow's attachments must not count.
  await workflowResources.putBinaryResource({
    workflow_id: "wf-other",
    affordance_id: briefs[0].affordance_id,
    brief_id: briefs[0].brief_id,
    mime_type: "image/png",
    payload_blob: pngBlob(),
    byte_size: TINY_PNG_BYTES.length
  });

  const { api, window, sandbox } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/prism-workflow-resources.js"
    ]
  });
  // Inject modules already required in Node — avoid re-running the browser UMD factory
  // inside the vm (it needs the full visual-planning dependency graph on window).
  if (window) {
    window.PRISM_WORKFLOW_RESOURCES = workflowResources;
    window.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    window.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
  }
  if (sandbox) {
    sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
    sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    sandbox.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
  }

  const page = liveLikeLearningJourneyPage();
  const constituent = expositoryWorkflow("wf-c2-expo", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2"
  });
  const workflows = [
    { id: "wf-lj", name: "LJTest", product: "learning_journey", steps: [] },
    constituent
  ];
  api.setWorkflowsForTest(workflows);
  // LJ is the currently selected workflow — must not read LJ's live refs.
  api.setSelectedWorkflowIdForTest("wf-lj");
  api.setWorkflowResourceRefsForTest([]);

  const runStateSeed = {
    "wf-c2-expo": {
      capturedOutputs: { "step-dp-1": JSON.stringify(ROMAN_ROADS_PAGE) },
      // Empty refs: attachments live only in the Workflow Resources owner store.
      workflowResourceRefs: []
    }
  };

  const byId = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(
    page,
    "wf-lj",
    {
      visualJobsWorkspaceMod: visualJobs,
      runStateByWorkflowId: runStateSeed,
      workflows: workflows
    }
  );
  assert.equal(byId.c2.status, STATUS.COMPLETE, byId.c2.graphicsReason || byId.c2.status);
  assert.equal(byId.c2.requiredGraphicsCount, 4);
  assert.equal(byId.c2.attachedGraphicsCount, 4);

  // Hydration recovers refs into the in-memory run record used for derivation.
  const hydrated = await api.hydrateConstituentRunRecordForProductionStatusForTest(
    "wf-c2-expo",
    {
      capturedOutputs: { "step-dp-1": JSON.stringify(ROMAN_ROADS_PAGE) },
      workflowResourceRefs: []
    }
  );
  assert.equal(hydrated.graphicsEvidenceSource, "workflow_resources_owner_store");
  assert.equal(hydrated.workflowResourceRefs.length, 4);

  // 0 attached (owner store cleared) → Authoring.
  workflowResources.resetStorageBackendForTests();
  const none = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(page, "wf-lj", {
    visualJobsWorkspaceMod: visualJobs,
    workflows: workflows,
    runStateByWorkflowId: {
      "wf-c2-expo": {
        capturedOutputs: { "step-dp-1": JSON.stringify(ROMAN_ROADS_PAGE) },
        workflowResourceRefs: []
      }
    }
  });
  assert.equal(
    none.c2.status,
    STATUS.AUTHORING,
    JSON.stringify({
      status: none.c2.status,
      action: none.c2.action,
      required: none.c2.requiredGraphicsCount,
      attached: none.c2.attachedGraphicsCount,
      reason: none.c2.graphicsReason,
      ids: none.c2.constituentWorkflowIds
    })
  );

  // 3 of 4 attached → Authoring.
  for (let i = 0; i < 3; i += 1) {
    await workflowResources.putBinaryResource({
      workflow_id: "wf-c2-expo",
      affordance_id: briefs[i].affordance_id,
      brief_id: briefs[i].brief_id,
      mime_type: "image/png",
      payload_blob: pngBlob(),
      byte_size: TINY_PNG_BYTES.length
    });
  }
  const three = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(page, "wf-lj", {
    visualJobsWorkspaceMod: visualJobs,
    workflows: workflows,
    runStateByWorkflowId: {
      "wf-c2-expo": {
        capturedOutputs: { "step-dp-1": JSON.stringify(ROMAN_ROADS_PAGE) },
        workflowResourceRefs: []
      }
    }
  });
  assert.equal(three.c2.status, STATUS.AUTHORING);
  assert.equal(three.c2.attachedGraphicsCount, 3);

  workflowResources.resetStorageBackendForTests();
});

test("LIVE ROOT CAUSE: hard-refresh captureRefs-only Design Page + owner-store images → Complete via prepare", async () => {
  // After hard refresh, S75 runstate keeps captureRefs and clears inline bodies.
  // Sync LJ Preview derivation without owner-store/capture hydrate stays Authoring
  // (design_page_body_unhydrated) even when Authoring shows Graphics(4) ✓ Image attached.
  const workflowResources = require("../lib/prism-workflow-resources.js");
  workflowResources.resetStorageBackendForTests();

  const TINY_PNG_BYTES = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  function pngBlob() {
    return new Blob([TINY_PNG_BYTES], { type: "image/png" });
  }

  const briefs = visualJobs.assessRequiredGraphicsJobsFromPage(ROMAN_ROADS_PAGE, {
    workflowResourceRefs: []
  }).briefs;
  assert.equal(briefs.length, 4);

  const textPut = await workflowResources.putTextResource({
    workflow_id: "wf-c2-expo",
    slot_key: "workflow_run_capture:step-dp-1:final",
    mime_type: "application/json",
    text_payload: JSON.stringify(ROMAN_ROADS_PAGE)
  });
  assert.equal(textPut.ok, true, textPut.code || "");

  for (let i = 0; i < briefs.length; i += 1) {
    const put = await workflowResources.putBinaryResource({
      workflow_id: "wf-c2-expo",
      affordance_id: briefs[i].affordance_id,
      // Legacy-shaped: brief_id may be absent on older persisted resources.
      brief_id: i === 0 ? "" : briefs[i].brief_id,
      mime_type: "image/png",
      payload_blob: pngBlob(),
      byte_size: TINY_PNG_BYTES.length
    });
    assert.equal(put.ok, true, put.code || "");
  }

  const { api, window, sandbox } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/prism-workflow-resources.js"
    ]
  });
  if (window) {
    window.PRISM_WORKFLOW_RESOURCES = workflowResources;
    window.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    window.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
  }
  if (sandbox) {
    sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
    sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    sandbox.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
  }

  const page = liveLikeLearningJourneyPage();
  const constituent = expositoryWorkflow("wf-c2-expo", {
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2"
  });
  const workflows = [
    { id: "wf-lj", name: "LJTest", product: "learning_journey", steps: [] },
    constituent
  ];
  api.setWorkflowsForTest(workflows);
  api.setSelectedWorkflowIdForTest("wf-lj");
  api.setWorkflowResourceRefsForTest([]);

  const hardRefreshRunState = {
    "wf-c2-expo": {
      // Hard-refresh shape: refs only, no inline Design Page body, no runstate image refs.
      captureRefs: {
        "step-dp-1": {
          final: {
            resource_id: textPut.resource_id,
            slot_key: "workflow_run_capture:step-dp-1:final"
          }
        }
      },
      workflowResourceRefs: []
    }
  };

  // Sync path without prepare: Design Page evidence exists, body unhydrated → Authoring.
  const syncDerived = api.deriveLearningJourneyPreviewProductionStatusesForTest(page, "wf-lj", {
    visualJobsWorkspaceMod: visualJobs,
    workflows: workflows,
    runStateByWorkflowId: hardRefreshRunState,
    diagnosticsPath: "test_sync_unhydrated",
    publishDiagnostics: true
  });
  assert.equal(syncDerived.byCommissionId.c2.status, STATUS.AUTHORING);
  assert.equal(syncDerived.byCommissionId.c2.graphicsReason, "design_page_body_unhydrated");
  assert.equal(syncDerived.byCommissionId.c2.diagnostics.designPageBodyHydrated, false);
  assert.equal(syncDerived.byCommissionId.c2.diagnostics.designPageEvidenceFound, true);

  // Async prepare hydrates Design Page body + owner-store images before status derivation.
  const byId = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(
    page,
    "wf-lj",
    {
      visualJobsWorkspaceMod: visualJobs,
      runStateByWorkflowId: hardRefreshRunState,
      workflows: workflows
    }
  );
  assert.equal(byId.c2.status, STATUS.COMPLETE, byId.c2.graphicsReason || byId.c2.status);
  assert.equal(byId.c2.requiredGraphicsCount, 4);
  assert.equal(byId.c2.attachedGraphicsCount, 4);
  assert.equal(byId.c2.diagnostics.designPageBodyHydrated, true);
  assert.equal(byId.c2.diagnostics.durableImageResourceCount, 4);
  assert.equal(byId.c2.diagnostics.assessor.outstanding, 0);

  const diag = api.getLastLjProductionStatusDiagnosticsForTest();
  assert.ok(diag);
  assert.equal(diag.path, "prepare_async_owner_store_hydrate");
  assert.equal(diag.ownerStoreHydrated, true);
  assert.equal(diag.sourceLearningJourneyWorkflowId, "wf-lj");
  assert.ok(Array.isArray(diag.hydrateTrace));
  assert.equal(diag.hydrateTrace[0].constituentWorkflowId, "wf-c2-expo");
  assert.equal(diag.hydrateTrace[0].runstateKeyWritten, "wf-c2-expo");
  assert.equal(diag.hydrateTrace[0].recoveredResourceCount, 4);
  assert.equal(
    diag.hydrateTrace[0].graphics.source,
    "listActiveGeneratedImageResourceRefs"
  );

  // Async Preview HTML path must surface Complete (not sync-unhydrated Authoring).
  const rendered = await api.renderUtilitiesArtefactHtmlAsyncForTest(page, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false,
    workflows: workflows,
    runStateByWorkflowId: hardRefreshRunState,
    visualJobsWorkspaceMod: visualJobs,
    workflow: { id: "wf-lj", name: "LJTest", product: "learning_journey", steps: [] }
  });
  assert.equal(rendered.error, null, rendered.error || "");
  assert.match(rendered.html, /Current status: Complete/);

  workflowResources.resetStorageBackendForTests();
});

test("LIVE ROOT CAUSE: Design Page alone yields generate_jobs_without_briefs; Authoring assemble restores briefs → Complete", async () => {
  // Authoring Graphics(N) compiles from the Assemble-merged page (EJP+XD+XM+DP).
  // LJ status previously assessed the raw Design Page capture alone → planner generate
  // count > 0 but compiler briefs [] → generate_jobs_without_briefs → stuck Authoring
  // even with 4/4 (or 2/2) durable images recovered.
  const workflowResources = require("../lib/prism-workflow-resources.js");
  const assemble = require("../lib/page-vnext-assemble.js");
  workflowResources.resetStorageBackendForTests();

  const fixturesDir = path.join(__dirname, "fixtures");
  function readJson(name) {
    return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
  }
  const ejp = readJson("s85-expository-live-ejp.json");
  const xd = readJson("s85-expository-live-xd.json");
  const xm = readJson("s85-expository-live-xm.json");
  const designPage = Object.assign({}, readJson("s85-expository-dp-raw-paste.json"), {
    artifact_type: "page",
    schema_version: "2.0.0"
  });

  // Document the live failure shape: Design Page capture alone cannot compile briefs.
  const dpAlone = visualJobs.assessRequiredGraphicsJobsFromPage(designPage, {
    workflowResourceRefs: []
  });
  assert.equal(dpAlone.reason, "generate_jobs_without_briefs");
  assert.equal(dpAlone.determinable, false);
  assert.ok(dpAlone.generateCount > 0);
  assert.equal((dpAlone.briefs || []).length, 0);

  const assembled = assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page: designPage
  });
  assert.equal(assembled.ok, true);
  const authoringBriefs = visualJobs.assessRequiredGraphicsJobsFromPage(assembled.page, {
    workflowResourceRefs: []
  });
  assert.equal(authoringBriefs.determinable, true);
  assert.ok(authoringBriefs.requiredCount >= 2);
  assert.equal(authoringBriefs.briefs.length, authoringBriefs.requiredCount);
  // Critically: required briefs must come from page compilation, not from image count.
  assert.notEqual(authoringBriefs.briefs.length, 0);

  const TINY_PNG_BYTES = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  function pngBlob() {
    return new Blob([TINY_PNG_BYTES], { type: "image/png" });
  }

  async function putText(slot, payload) {
    const put = await workflowResources.putTextResource({
      workflow_id: "wf-c2-expo",
      slot_key: slot,
      mime_type: "application/json",
      text_payload: JSON.stringify(payload)
    });
    assert.equal(put.ok, true, put.code || "");
    return put.resource_id;
  }

  const ejpRes = await putText("workflow_run_capture:step-ejp:final", ejp);
  const xdRes = await putText("workflow_run_capture:step-xd:final", xd);
  const xmRes = await putText("workflow_run_capture:step-xm:final", xm);
  const dpRes = await putText("workflow_run_capture:step-dp-1:final", designPage);

  for (let i = 0; i < authoringBriefs.briefs.length; i += 1) {
    const brief = authoringBriefs.briefs[i];
    const put = await workflowResources.putBinaryResource({
      workflow_id: "wf-c2-expo",
      affordance_id: brief.affordance_id,
      brief_id: brief.brief_id,
      mime_type: "image/png",
      payload_blob: pngBlob(),
      byte_size: TINY_PNG_BYTES.length
    });
    assert.equal(put.ok, true, put.code || "");
  }

  const { api, window, sandbox } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/page-vnext-assemble.js",
      "lib/prism-workflow-resources.js"
    ]
  });
  if (window) {
    window.PRISM_WORKFLOW_RESOURCES = workflowResources;
    window.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    window.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
    window.PRISM_PAGE_VNEXT_ASSEMBLE = assemble;
  }
  if (sandbox) {
    sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
    sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    sandbox.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
    sandbox.PRISM_PAGE_VNEXT_ASSEMBLE = assemble;
  }

  const page = liveLikeLearningJourneyPage();
  const constituent = {
    id: "wf-c2-expo",
    name: "Build a Better Basis for Judgement",
    product: "expository",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2",
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [
      {
        id: "step-ejp",
        title: "Expository Journey Plan",
        canonical_step_id: "step_expository_journey_plan"
      },
      {
        id: "step-xd",
        title: "Expository Development",
        canonical_step_id: "step_expository_development"
      },
      {
        id: "step-xm",
        title: "Expository Materials",
        canonical_step_id: "step_expository_materials"
      },
      {
        id: "step-dp-1",
        title: "Design Page",
        canonical_step_id: "step_design_page"
      }
    ]
  };
  const workflows = [
    { id: "wf-lj", name: "LJTest", product: "learning_journey", steps: [] },
    constituent
  ];
  api.setWorkflowsForTest(workflows);
  api.setSelectedWorkflowIdForTest("wf-lj");
  api.setWorkflowResourceRefsForTest([]);

  const hardRefreshRunState = {
    "wf-c2-expo": {
      captureRefs: {
        "step-ejp": { final: { resource_id: ejpRes } },
        "step-xd": { final: { resource_id: xdRes } },
        "step-xm": { final: { resource_id: xmRes } },
        "step-dp-1": { final: { resource_id: dpRes } }
      },
      workflowResourceRefs: []
    }
  };

  // Without assembly, Design Page body alone stays indeterminate Authoring.
  const syncDerived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: workflows,
    runStateByWorkflowId: {
      "wf-c2-expo": {
        capturedOutputs: { "step-dp-1": JSON.stringify(designPage) },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs
  });
  assert.equal(syncDerived.byCommissionId.c2.status, STATUS.AUTHORING);
  assert.equal(syncDerived.byCommissionId.c2.graphicsReason, "generate_jobs_without_briefs");

  const byId = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(
    page,
    "wf-lj",
    {
      visualJobsWorkspaceMod: visualJobs,
      runStateByWorkflowId: hardRefreshRunState,
      workflows: workflows
    }
  );
  assert.equal(byId.c2.status, STATUS.COMPLETE, byId.c2.graphicsReason || byId.c2.status);
  assert.equal(byId.c2.requiredGraphicsCount, authoringBriefs.requiredCount);
  assert.equal(byId.c2.attachedGraphicsCount, authoringBriefs.requiredCount);
  assert.equal(byId.c2.diagnostics.graphicsPageSource, "resolvePageForRenderOrAssembly");
  assert.equal(byId.c2.diagnostics.designPageBodyHydrated, true);
  assert.equal(byId.c2.diagnostics.assessor.outstanding, 0);
  assert.equal(byId.c2.diagnostics.assessor.reason, "all_required_graphics_complete");
  assert.ok(Array.isArray(byId.c2.diagnostics.requiredJobs));
  assert.equal(byId.c2.diagnostics.requiredJobs.length, authoringBriefs.requiredCount);

  const diag = api.getLastLjProductionStatusDiagnosticsForTest();
  assert.equal(diag.hydrateTrace[0].authoritativePageAssembled, true);
  assert.equal(diag.hydrateTrace[0].authoritativePageSource, "resolvePageForRenderOrAssembly");
  assert.equal(diag.hydrateTrace[0].recoveredResourceCount, authoringBriefs.requiredCount);

  // N-1 attached → Authoring (requirements still from assembled page, not image count).
  workflowResources.resetStorageBackendForTests();
  const ejpPartial = await putText("workflow_run_capture:step-ejp:final", ejp);
  const xdPartial = await putText("workflow_run_capture:step-xd:final", xd);
  const xmPartial = await putText("workflow_run_capture:step-xm:final", xm);
  const dpPartial = await putText("workflow_run_capture:step-dp-1:final", designPage);
  for (let i = 0; i < authoringBriefs.requiredCount - 1; i += 1) {
    const brief = authoringBriefs.briefs[i];
    await workflowResources.putBinaryResource({
      workflow_id: "wf-c2-expo",
      affordance_id: brief.affordance_id,
      brief_id: brief.brief_id,
      mime_type: "image/png",
      payload_blob: pngBlob(),
      byte_size: TINY_PNG_BYTES.length
    });
  }
  const partialFixed = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(
    page,
    "wf-lj",
    {
      visualJobsWorkspaceMod: visualJobs,
      workflows: workflows,
      runStateByWorkflowId: {
        "wf-c2-expo": {
          captureRefs: {
            "step-ejp": { final: { resource_id: ejpPartial } },
            "step-xd": { final: { resource_id: xdPartial } },
            "step-xm": { final: { resource_id: xmPartial } },
            "step-dp-1": { final: { resource_id: dpPartial } }
          },
          workflowResourceRefs: []
        }
      }
    }
  );
  assert.equal(partialFixed.c2.status, STATUS.AUTHORING);
  assert.equal(partialFixed.c2.requiredGraphicsCount, authoringBriefs.requiredCount);
  assert.equal(partialFixed.c2.attachedGraphicsCount, authoringBriefs.requiredCount - 1);

  workflowResources.resetStorageBackendForTests();
});

test("mismatched affordance/brief identity and foreign workflow refs do not count", () => {
  const briefs = visualJobs.assessRequiredGraphicsJobsFromPage(ROMAN_ROADS_PAGE, {
    workflowResourceRefs: []
  }).briefs;
  const assessed = visualJobs.assessRequiredGraphicsJobsFromPage(
    ROMAN_ROADS_PAGE,
    {
      expectedWorkflowId: "wf-c2-expo",
      workflowResourceRefs: [
        {
          resource_id: "res-wrong-affordance",
          affordance_id: "va-not-a-real-affordance",
          brief_id: "brief-not-real",
          lifecycle_state: "active",
          workflow_id: "wf-c2-expo"
        },
        {
          resource_id: "res-foreign-wf",
          affordance_id: briefs[0].affordance_id,
          brief_id: briefs[0].brief_id,
          lifecycle_state: "active",
          workflow_id: "wf-other"
        },
        {
          resource_id: "res-ok",
          affordance_id: briefs[0].affordance_id,
          brief_id: briefs[0].brief_id,
          lifecycle_state: "active",
          workflow_id: "wf-c2-expo"
        }
      ]
    }
  );
  assert.equal(assessed.requiredCount, 4);
  assert.equal(assessed.attachedCount, 1);
  assert.equal(assessed.complete, false);
});

test("9–10. discovery uses sourceWorkflowId + sourceCommissionId; other LJ/commission ignored", () => {
  const matches = status.findConstituentWorkflows(
    [
      interactiveWorkflow("wf-other-lj", {
        sourceWorkflowId: "wf-lj-OTHER",
        sourceCommissionId: "c1"
      }),
      interactiveWorkflow("wf-other-c", {
        sourceWorkflowId: "wf-lj",
        sourceCommissionId: "c2"
      }),
      interactiveWorkflow("wf-hit", {
        sourceWorkflowId: "wf-lj",
        sourceCommissionId: "c1"
      })
    ],
    "wf-lj",
    "c1"
  );
  assert.equal(matches.length, 1);
  assert.equal(matches[0].id, "wf-hit");

  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: liveLikeLearningJourneyPage(),
    workflows: [
      interactiveWorkflow("wf-other-lj", {
        sourceWorkflowId: "wf-lj-OTHER",
        sourceCommissionId: "c1"
      }),
      interactiveWorkflow("wf-other-c", {
        sourceWorkflowId: "wf-lj",
        sourceCommissionId: "c2"
      })
    ],
    runStateByWorkflowId: {},
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.NOT_COMMISSIONED);
  assert.equal(derived.byCommissionId.c1.action, "create");
  assert.equal(derived.byCommissionId.c2.status, STATUS.PRODUCTION);
});

test("11. unsupported commission remains unsupported / non-actionable", () => {
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: liveLikeLearningJourneyPage(),
    workflows: [],
    runStateByWorkflowId: {},
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(derived.byCommissionId.c4.status, STATUS.UNSUPPORTED);
  assert.equal(derived.byCommissionId.c4.action, "none");

  const preview = design.buildLearningJourneyCommissioningPreviewHtml(liveLikeLearningJourneyPage(), {
    productionByCommissionId: derived.byCommissionId
  });
  assert.match(preview.html, /data-commission-id="c4"[^>]*data-status="unsupported"/);
  assert.match(preview.html, /Unsupported in PRISM/);
  assert.doesNotMatch(preview.html, /data-lj-commission-id="c4"/);
  assert.doesNotMatch(preview.html, /Current status: Complete/);
});

test("12. acceptsCommission behaviour remains respected", () => {
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: liveLikeLearningJourneyPage(),
    workflows: [],
    runStateByWorkflowId: {},
    productAcceptsCommission: function (productId) {
      return String(productId) === "expository";
    }
  });
  assert.equal(derived.byCommissionId.c1.action, "none");
  assert.equal(derived.byCommissionId.c2.action, "create");
});

test("13. duplicate matching constituents surface as ambiguous (no silent pick for status ladder)", () => {
  const page = liveLikeLearningJourneyPage();
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: page,
    workflows: [
      interactiveWorkflow("wf-c1-a", {
        sourceWorkflowId: "wf-lj",
        sourceCommissionId: "c1"
      }),
      interactiveWorkflow("wf-c1-b", {
        sourceWorkflowId: "wf-lj",
        sourceCommissionId: "c1"
      })
    ],
    runStateByWorkflowId: {},
    productAcceptsCommission: family.productAcceptsCommission
  });
  assert.equal(derived.byCommissionId.c1.status, STATUS.AMBIGUOUS);
  assert.equal(derived.byCommissionId.c1.action, "open");
  assert.deepEqual(derived.byCommissionId.c1.constituentWorkflowIds, ["wf-c1-a", "wf-c1-b"]);
  assert.notEqual(derived.byCommissionId.c1.status, STATUS.PRODUCTION);

  const preview = design.buildLearningJourneyCommissioningPreviewHtml(page, {
    sourceWorkflowId: "wf-lj",
    productionByCommissionId: derived.byCommissionId
  });
  assert.match(preview.html, /Current status: Ambiguous/);
  assert.doesNotMatch(
    preview.html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"/
  );
  assert.match(preview.html, /data-lj-workflow-id="wf-c1-a"/);
  assert.match(preview.html, /data-lj-workflow-id="wf-c1-b"/);
});

test("14. ordinary non-Learning-Journey workflow behaviour remains unaffected", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js"
    ]
  });
  const interactivePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Bayes Interactive",
    activities: [],
    page_synthesis: {
      overview: { body: "Overview body for Bayes." }
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"]
    }
  };
  const rendered = api.runUtilityPageExportPipelineForTest(interactivePage, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.equal(!!rendered.learningJourneyCommissioningPreview, false);
  if (rendered && rendered.html) {
    assert.doesNotMatch(rendered.html, /lj-commissioning-preview/);
    assert.doesNotMatch(rendered.html, /Current status: Production/);
  }
});

test("15. existing direct commissioning remains intact; Create blocked once constituent exists", () => {
  const { api, sandbox, window } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/first-class-commission-intake.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js"
    ]
  });
  const intakeApi = require("../lib/first-class-commission-intake.js");
  const statusApi = require("../lib/learning-journey-commission-production-status.js");
  if (sandbox) {
    sandbox.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
    sandbox.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = statusApi;
  }
  if (window) {
    window.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
    window.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = statusApi;
  }
  if (sandbox && sandbox.globalThis) {
    sandbox.globalThis.PRISM_FIRST_CLASS_COMMISSION_INTAKE = intakeApi;
    sandbox.globalThis.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = statusApi;
  }
  if (window && window.Utils && !window.Utils.uuid) {
    window.Utils.uuid = function () {
      return "wf-test-" + String(Date.now()) + "-" + String(Math.random()).slice(2, 8);
    };
  }

  const page = liveLikeLearningJourneyPage();
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: page,
    sourceWorkflowId: "wf-lj-live"
  });
  api.setSelectedWorkflowIdForTest("wf-lj-live");
  api.setWorkflowsForTest([
    {
      id: "wf-lj-live",
      name: "LJTest",
      product: "learning_journey",
      steps: []
    }
  ]);

  const created = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "interactive",
    sourceWorkflowId: "wf-lj-live"
  });
  assert.equal(created.ok, true, created.code || "");
  assert.ok(created.workflow && created.workflow.id);
  assert.equal(created.workflow.sourceWorkflowId, "wf-lj-live");
  assert.equal(created.workflow.sourceCommissionId, "c1");

  const blocked = api.initialiseFirstClassProductFromLearningJourneyCommissionForTest({
    commissionId: "c1",
    sectionId: "exp_1",
    productId: "interactive",
    sourceWorkflowId: "wf-lj-live"
  });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.code, "commission_already_commissioned");

  if (typeof api.saveWorkflowRunStateStoreForTest === "function") {
    api.saveWorkflowRunStateStoreForTest({});
  }
  const rendered = api.runUtilityPageExportPipelineForTest(page, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false,
    workflow: { id: "wf-lj-live", product: "learning_journey", steps: [] }
  });
  assert.equal(rendered.error, null, rendered.error || "");
  assert.match(rendered.html, /Current status: Production/);
  assert.match(rendered.html, /Open Interactive/);
  assert.doesNotMatch(
    rendered.html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c1"/
  );
  // Uncommissioned supported commission still Create.
  assert.match(
    rendered.html,
    /data-lj-action="create-product"[^>]*data-lj-commission-id="c2"/
  );
});

test("Open action uses ordinary workflow selection", () => {
  const { api } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js"
    ]
  });
  api.setWorkflowsForTest([
    interactiveWorkflow("wf-c1-open", {
      sourceWorkflowId: "wf-lj",
      sourceCommissionId: "c1"
    }),
    { id: "wf-lj", name: "LJ", product: "learning_journey", steps: [] }
  ]);
  api.setSelectedWorkflowIdForTest("wf-lj");
  const opened = api.handleLearningJourneyPreviewOpenProductActionForTest({
    workflowId: "wf-c1-open",
    commissionId: "c1",
    sourceWorkflowId: "wf-lj",
    productId: "interactive"
  });
  assert.equal(opened.ok, true, opened.code || "");
  assert.equal(opened.workflowId, "wf-c1-open");
});

test("countCompleteSupportedCommissions aggregates reusable Complete results", () => {
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    learningJourneyWorkflowId: "wf-lj",
    page: liveLikeLearningJourneyPage(),
    workflows: [
      interactiveWorkflow("wf-c1", {
        sourceWorkflowId: "wf-lj",
        sourceCommissionId: "c1"
      })
    ],
    runStateByWorkflowId: {
      "wf-c1": {
        capturedOutputs: { "step-dp-1": JSON.stringify(designPageJson({})) },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockVisualJobsWorkspace([])
  });
  const counts = status.countCompleteSupportedCommissions(derived);
  assert.equal(counts.complete, 1);
  assert.equal(counts.supported, 2);
});
