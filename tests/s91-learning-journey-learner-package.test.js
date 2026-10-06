/**
 * Sprint 91 — Learning Journey final learner-package assembly.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const ljPackage = require("../lib/learning-journey-learner-package.js");
const status = require("../lib/learning-journey-commission-production-status.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");

const STATUS = status.STATUS;

function journeyPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Credibility Journey",
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
        section_id: "exp_3",
        title: "Learn to Investigate Beyond the Source",
        order: 4,
        exposition: "Practise looking beyond the immediate source."
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
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Learn to Investigate Beyond the Source",
        product_id: "interactive",
        status: "supported",
        specification_text: "SPEC_C3"
      }
    ],
    learning_journey: { design_intent: "test", continuity: "test" },
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"], calls_model: true }
  };
}

function pngBytes() {
  // Minimal valid-enough byte payload for packaging tests (not decoded as image here).
  return new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
}

function makeConstituentPackage(label, mediaName) {
  const basename = String(mediaName || "hero") + ".png";
  return {
    html:
      "<!DOCTYPE html><html><body><h1>" +
      label +
      '</h1><img src="assets/' +
      basename +
      '" alt="' +
      label +
      '"></body></html>',
    assets: [
      {
        path: "assets/" + basename,
        bytes: pngBytes(),
        mime: "image/png",
        brief_id: "brief-" + label + "-" + mediaName
      }
    ],
    metadata: {
      package_kind: "learner_package",
      schema_version: "70.export",
      html_entry: "learner-page.html",
      asset_count: 1,
      title: label
    }
  };
}

function unzipEntries(bytes) {
  const files = fflate.unzipSync(bytes);
  const out = {};
  Object.keys(files).forEach((path) => {
    out[path] = files[path];
  });
  return out;
}

test("1. complete 3-commission Journey assembles ZIP with home + nested packages", () => {
  const page = journeyPage();
  const constituents = [
    { commissionId: "c1", learnerPackage: makeConstituentPackage("C1", "hero") },
    { commissionId: "c2", learnerPackage: makeConstituentPackage("C2", "hero") },
    { commissionId: "c3", learnerPackage: makeConstituentPackage("C3", "diagram") }
  ];
  const assembled = ljPackage.assembleLearningJourneyLearnerPackage({
    page,
    constituents,
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const entries = unzipEntries(assembled.bytes);
  assert.ok(entries["index.html"]);
  assert.ok(entries["c1/index.html"]);
  assert.ok(entries["c2/index.html"]);
  assert.ok(entries["c3/index.html"]);
  assert.ok(entries["c1/media/hero.png"]);
  assert.ok(entries["c2/media/hero.png"]);
  assert.ok(entries["c3/media/diagram.png"] || Object.keys(entries).some((p) => p.startsWith("c3/media/")));

  const home = fflate.strFromU8(entries["index.html"]);
  assert.match(home, /Credibility Journey/);
  assert.match(home, /You will build and defend a credibility judgement/);
  assert.match(home, /Start by noticing and questioning your first reaction/);
  assert.match(home, /href="c1\/index\.html"/);
  assert.match(home, /href="c2\/index\.html"/);
  assert.match(home, /href="c3\/index\.html"/);
  assert.doesNotMatch(home, /Create Interactive|Authoring view|commission constituent/i);

  const c1Html = fflate.strFromU8(entries["c1/index.html"]);
  assert.match(c1Html, /media\/hero\.png/);
  assert.doesNotMatch(c1Html, /assets\/hero\.png/);
});

test("7/8. Journey Home order follows commission/section order, not workflow-list order", () => {
  const page = journeyPage();
  // Deliberately reverse commission array order vs educational order values.
  page.commissions = [page.commissions[2], page.commissions[0], page.commissions[1]];
  const home = ljPackage.buildLearningJourneyHomeHtml(page);
  assert.equal(home.ok, true);
  const c1 = home.html.indexOf('href="c1/index.html"');
  const c2 = home.html.indexOf('href="c2/index.html"');
  const c3 = home.html.indexOf('href="c3/index.html"');
  assert.ok(c1 > 0 && c2 > c1 && c3 > c2);
});

test("preflight blockers: Production / Authoring / missing / ambiguous / unsupported", () => {
  const page = journeyPage();
  page.commissions[2].status = "unsupported";
  page.commissions[2].product_id = "";

  const workflows = [
    { id: "wf-lj", product: "learning_journey", steps: [] },
    {
      id: "wf-c1",
      product: "interactive",
      sourceWorkflowId: "wf-lj",
      sourceCommissionId: "c1",
      steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }]
    },
    {
      id: "wf-c2a",
      product: "expository",
      sourceWorkflowId: "wf-lj",
      sourceCommissionId: "c2",
      steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }]
    },
    {
      id: "wf-c2b",
      product: "expository",
      sourceWorkflowId: "wf-lj",
      sourceCommissionId: "c2",
      steps: [{ id: "dp", title: "Design Page", canonical_step_id: "step_design_page" }]
    }
  ];

  const runStateByWorkflowId = {
    "wf-c1": {
      // Design page present but no graphics evidence → authoring/production depending on assess
      capturedOutputs: { dp: JSON.stringify({ artifact_type: "page", title: "C1", activities: [] }) }
    }
  };

  const preflight = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows,
    runStateByWorkflowId,
    productAcceptsCommission: () => true,
    visualJobsWorkspaceMod: {
      buildVisualJobsWorkspaceState() {
        return {
          compilerResult: { briefs: [{ brief_id: "b1" }] },
          assetsByBriefId: {}
        };
      }
    }
  });
  assert.equal(preflight.ok, false);
  const reasons = preflight.blockers.map((b) => b.reason + "|" + b.commissionId).join(" || ");
  assert.match(reasons, /c3/i);
  assert.match(reasons, /Unsupported/i);
  assert.match(reasons, /c2/i);
  assert.match(reasons, /Ambiguous/i);
  // c1 has a page but required graphics incomplete → Authoring (or Production if page evidence rejected)
  assert.ok(
    preflight.blockers.some((b) => b.commissionId === "c1"),
    reasons
  );
});

test("preflight: missing constituent blocks export", () => {
  const page = journeyPage();
  const preflight = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }],
    runStateByWorkflowId: {},
    productAcceptsCommission: () => true
  });
  assert.equal(preflight.ok, false);
  assert.ok(preflight.blockers.every((b) => /Missing constituent|not yet produced/i.test(b.reason)));
});

test("15. identical constituent media filenames remain isolated under cN/media", () => {
  const page = journeyPage();
  const assembled = ljPackage.assembleLearningJourneyLearnerPackage({
    page,
    constituents: [
      { commissionId: "c1", learnerPackage: makeConstituentPackage("C1", "hero") },
      { commissionId: "c2", learnerPackage: makeConstituentPackage("C2", "hero") },
      { commissionId: "c3", learnerPackage: makeConstituentPackage("C3", "hero") }
    ],
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const entries = unzipEntries(assembled.bytes);
  assert.ok(entries["c1/media/hero.png"]);
  assert.ok(entries["c2/media/hero.png"]);
  assert.ok(entries["c3/media/hero.png"]);
});

test("17. constituent LearnerPackage builder is reused (standalone export still works)", () => {
  const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const built = learnerPackage.buildLearnerPackage({
    html: '<html><body><img src="' + dataUrl + '" alt="x"></body></html>',
    visualAssetManifest: {
      assets: [
        {
          brief_id: "b1",
          visual_slot: "materials-entry",
          scope: "page",
          mime_type: "image/png",
          data_url: dataUrl,
          render_source: { kind: "data_url", value: dataUrl }
        }
      ]
    },
    pageSlug: "standalone"
  });
  assert.equal(built.ok, true, built.error && built.error.message);
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const entries = unzipEntries(zipped.bytes);
  assert.ok(entries["learner-page.html"]);
  assert.ok(Object.keys(entries).some((p) => p.startsWith("assets/")));
});

test("assemble fails closed when a required commission package is omitted", () => {
  const page = journeyPage();
  const assembled = ljPackage.assembleLearningJourneyLearnerPackage({
    page,
    constituents: [
      { commissionId: "c1", learnerPackage: makeConstituentPackage("C1", "hero") },
      { commissionId: "c2", learnerPackage: makeConstituentPackage("C2", "hero") }
    ],
    fflate
  });
  assert.equal(assembled.ok, false);
  assert.equal(assembled.error.code, "missing_constituent_packages");
});

test("Production status Complete semantics are reused by preflight (status module STATUS)", () => {
  assert.equal(STATUS.COMPLETE, "complete");
  assert.equal(STATUS.AUTHORING, "authoring");
  assert.equal(STATUS.PRODUCTION, "production");
  assert.equal(STATUS.UNSUPPORTED, "unsupported");
  assert.equal(STATUS.AMBIGUOUS, "ambiguous");
});

test("REGRESSION: package preflight uses same prepare boundary as LJ Preview (not lightweight store)", async () => {
  // Live failure shape: Preview Complete after async hydrate/assemble/owner-store,
  // while package preflight previously reloaded lightweight runstate and reported Authoring.
  const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
  const family = require("../lib/first-class-workflow-family.js");
  const visualJobs = require("../lib/utilities-visual-jobs-workspace.js");
  const workflowResources = require("../lib/prism-workflow-resources.js");
  const fs = require("node:fs");
  const path = require("node:path");

  workflowResources.resetStorageBackendForTests();

  const ROMAN_ROADS_PAGE = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures", "page-assemble", "roman-roads-visual-jobs-valid.json"),
      "utf8"
    )
  );
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
    workflow_id: "wf-c1-pkg",
    slot_key: "workflow_run_capture:step-dp-1:final",
    mime_type: "application/json",
    text_payload: JSON.stringify(ROMAN_ROADS_PAGE)
  });
  assert.equal(textPut.ok, true, textPut.code || "");
  for (let i = 0; i < briefs.length; i += 1) {
    const put = await workflowResources.putBinaryResource({
      workflow_id: "wf-c1-pkg",
      affordance_id: briefs[i].affordance_id,
      brief_id: briefs[i].brief_id,
      mime_type: "image/png",
      payload_blob: pngBlob(),
      byte_size: TINY_PNG_BYTES.length
    });
    assert.equal(put.ok, true, put.code || "");
  }

  const page = journeyPage();
  // Single supported commission for a focused prepare/preflight identity check.
  page.commissions = [page.commissions[0]];
  page.commissions[0].product_id = "expository";

  const { api, window, sandbox } = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/learning-journey-learner-package.js",
      "lib/prism-workflow-resources.js"
    ]
  });
  if (window) {
    window.PRISM_WORKFLOW_RESOURCES = workflowResources;
    window.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    window.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
    window.PRISM_LEARNING_JOURNEY_LEARNER_PACKAGE = ljPackage;
  }
  if (sandbox) {
    sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
    sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    sandbox.PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS = status;
    sandbox.PRISM_LEARNING_JOURNEY_LEARNER_PACKAGE = ljPackage;
  }

  const workflows = [
    { id: "wf-lj", name: "LJTest", product: "learning_journey", steps: [] },
    {
      id: "wf-c1-pkg",
      name: "Challenge Your First Impression",
      product: "expository",
      sourceWorkflowId: "wf-lj",
      sourceCommissionId: "c1",
      steps: [
        {
          id: "step-dp-1",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          outputName: "page"
        }
      ]
    }
  ];
  api.setWorkflowsForTest(workflows);
  api.setSelectedWorkflowIdForTest("wf-lj");

  const lightweightRunState = {
    "wf-c1-pkg": {
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

  // Lightweight alone: graphics incomplete / unhydrated → Authoring (the live false reject).
  const lightweightPreflight = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows,
    runStateByWorkflowId: lightweightRunState,
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs,
    preparationPath: "lightweight_runstate_only"
  });
  assert.equal(lightweightPreflight.ok, false);
  assert.equal(lightweightPreflight.blockers[0].commissionId, "c1");
  assert.match(lightweightPreflight.blockers[0].reason, /Authoring/i);
  assert.equal(
    lightweightPreflight.derivation.byCommissionId.c1.status,
    STATUS.AUTHORING
  );

  // Shared prepare boundary (same as LJ Preview).
  const prepared = await api.prepareLearningJourneyPreviewProductionByCommissionIdForTest(
    page,
    "wf-lj",
    {
      visualJobsWorkspaceMod: visualJobs,
      runStateByWorkflowId: lightweightRunState,
      workflows,
      diagnosticsPath: "package_preflight_prepare_async_owner_store_hydrate"
    }
  );
  assert.equal(prepared.c1.status, STATUS.COMPLETE, prepared.c1.graphicsReason || prepared.c1.status);
  assert.ok(prepared.runStateByWorkflowId);
  const preparedRecord = prepared.runStateByWorkflowId["wf-c1-pkg"];
  assert.ok(preparedRecord, "prepared runState must include constituent workflow");
  // Preparation must hydrate capture body + owner-store image refs (lightweight had neither).
  assert.ok(
    String((preparedRecord.capturedOutputs && preparedRecord.capturedOutputs["step-dp-1"]) || "").trim(),
    "capture body must be hydrated into prepared runState"
  );
  assert.ok(
    Array.isArray(preparedRecord.workflowResourceRefs) &&
      preparedRecord.workflowResourceRefs.length === 4,
    "owner-store image refs must be recovered into prepared runState"
  );
  assert.equal(
    prepared.preparationPath,
    "package_preflight_prepare_async_owner_store_hydrate"
  );

  // Package preflight consumes the SAME prepared runState → Complete / ready.
  const packagePreflight = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows,
    runStateByWorkflowId: prepared.runStateByWorkflowId,
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs,
    preparationPath: prepared.preparationPath,
    hydrateTrace: prepared.hydrateTrace
  });
  assert.equal(packagePreflight.ok, true, JSON.stringify(packagePreflight.blockers));
  assert.equal(packagePreflight.derivation.byCommissionId.c1.status, STATUS.COMPLETE);
  assert.equal(packagePreflight.derivation.byCommissionId.c1.status, prepared.c1.status);
  assert.equal(packagePreflight.readyCommissions.length, 1);
  assert.equal(packagePreflight.readyCommissions[0].commissionId, "c1");

  const diagRow = packagePreflight.preparationDiagnostics.commissions.find(
    (row) => row.commissionId === "c1"
  );
  assert.ok(diagRow);
  assert.equal(diagRow.constituentWorkflowId, "wf-c1-pkg");
  assert.equal(diagRow.preparationPath, "package_preflight_prepare_async_owner_store_hydrate");
  assert.equal(diagRow.productionStatus, STATUS.COMPLETE);
  assert.equal(diagRow.requiredGraphicsCount, 4);
  assert.equal(diagRow.attachedGraphicsCount, 4);
  assert.equal(diagRow.outstandingGraphicsCount, 0);
  assert.ok(
    diagRow.graphicsPageSource === "resolvePageForRenderOrAssembly" ||
      diagRow.graphicsPageSource === "authoritative_assembled_page" ||
      diagRow.graphicsPageSource === "design_page_capture",
    "graphics page source: " + diagRow.graphicsPageSource
  );
  assert.equal(diagRow.durableImageResourceCount, 4);

  workflowResources.resetStorageBackendForTests();
});
