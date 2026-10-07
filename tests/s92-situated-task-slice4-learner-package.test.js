/**
 * Sprint 92 Gate 8 Slice 4 — Situated Task learner package + LJ package inclusion.
 *
 * Proves shared page-based publish path for situated_task_page and Complete
 * Situated constituents nested under Learning Journey cN/ without redesign.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");
const fs = require("node:fs");
const path = require("node:path");

const family = require("../lib/first-class-workflow-family.js");
const situated = require("../lib/situated-task-design-page.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const status = require("../lib/learning-journey-commission-production-status.js");
const visualJobs = require("../lib/utilities-visual-jobs-workspace.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const STATUS = status.STATUS;

const TINY_PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function unzipEntries(bytes) {
  const files = fflate.unzipSync(bytes);
  const out = {};
  Object.keys(files).forEach((p) => {
    out[p] = files[p];
  });
  return out;
}

function baseSituatedPage(overrides) {
  const fixture = situated.buildSituatedTaskDesignPageFixture(
    Object.assign(
      {
        title: "Observe a workplace practice"
      },
      overrides || {}
    )
  );
  assert.equal(fixture.ok, true, (fixture.errors || []).join("; "));
  return fixture.page;
}

function pageWithTeX() {
  const page = baseSituatedPage({
    title: "Notice quadratic features"
  });
  page.sections[0].exposition =
    "While observing, notice features of \\(x^2\\) in the authentic setting.";
  page.sections[1].exposition =
    "Retain what the quadratic pattern $$a x^2 + b x + c$$ helps you see next.";
  return page;
}

function pageWithRequiredGraphic() {
  return baseSituatedPage({
    title: "Observe with support figure",
    withActionSupportVisual: true
  });
}

function mockZeroGraphicsWorkspace() {
  return {
    assessRequiredGraphicsJobsFromPage: function () {
      return {
        ok: true,
        determinable: true,
        complete: true,
        zeroRequired: true,
        requiredCount: 0,
        attachedCount: 0,
        generateCount: 0,
        briefs: [],
        reason: "zero_required_graphics_jobs"
      };
    }
  };
}

function mockGraphicsWorkspace(briefs, attachedCount) {
  const rows = Array.isArray(briefs) ? briefs : [];
  const attached = Math.max(0, Math.min(attachedCount, rows.length));
  return {
    assessRequiredGraphicsJobsFromPage: function () {
      return {
        ok: true,
        determinable: true,
        complete: attached >= rows.length,
        zeroRequired: rows.length === 0,
        requiredCount: rows.length,
        attachedCount: attached,
        generateCount: rows.length,
        briefs: rows.slice(),
        reason:
          rows.length === 0
            ? "zero_required_graphics_jobs"
            : attached >= rows.length
              ? "all_required_graphics_complete"
              : "required_graphics_outstanding"
      };
    }
  };
}

function journeyWithSituated(extraCommissions) {
  const commissions = [
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
      commission_id: "c3",
      section_id: "exp_sit",
      order: 2,
      title: "Observe a workplace practice",
      product_id: "situated_task",
      status: "supported",
      specification_text: "SPEC_SITUATED"
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
    title: "Credibility Journey with Situated Task",
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "About this journey",
        order: 1,
        exposition: "You will build judgement and then practise in context."
      },
      {
        section_id: "exp_1",
        title: "Challenge Your First Impression",
        order: 2,
        exposition: "Start by noticing and questioning your first reaction."
      },
      {
        section_id: "exp_sit",
        title: "Observe a workplace practice",
        order: 3,
        exposition: "Carry out purposeful observation on site."
      }
    ],
    commissions: commissions,
    learning_journey: { design_intent: "test", continuity: "test" },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: ["design_page"],
      calls_model: true
    }
  };
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
        bytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]),
        mime: "image/png",
        brief_id: "brief-" + label
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

function loadExportApi() {
  return loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/situated-task-design-page.js",
      "lib/learner-package.js",
      "lib/learner-package-zip.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/learning-journey-learner-package.js"
    ]
  });
}

function renderSituatedHtml(page) {
  const { api } = loadExportApi();
  const rendered = api.runUtilityPageExportPipelineForTest(page, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.equal(rendered.error, null, rendered.error || "");
  assert.ok(rendered.html, "expected learner HTML");
  return rendered.html;
}

test("1. situated_task has a functioning page-based learner publish route", () => {
  assert.equal(family.publishRouteForWorkflow({ product: "situated_task" }), "situated_task_page");
  assert.equal(family.isPageBasedLearnerPublishRoute("situated_task_page"), true);
  assert.equal(family.isPageBasedLearnerPublishRoute("learner_page"), true);
  assert.equal(family.isPageBasedLearnerPublishRoute("expository_page"), true);
  assert.equal(family.isPageBasedLearnerPublishRoute("assessment_pack"), false);
  assert.equal(family.isPageBasedLearnerPublishRoute("learning_journey_page"), false);
});

test("2–5. Authoritative Situated page → learner HTML; sections ordered; no metadata dump; activities []", () => {
  const page = baseSituatedPage();
  assert.equal(Array.isArray(page.activities) && page.activities.length === 0, true);
  assert.ok(page.situated_learning);

  const html = renderSituatedHtml(page);
  assert.match(html, /Observe a workplace practice/);
  const firstIdx = html.indexOf(page.sections[0].title);
  const secondIdx = html.indexOf(page.sections[1].title);
  assert.ok(firstIdx > 0, "first section title missing");
  assert.ok(secondIdx > firstIdx, "sections must render in order");
  assert.doesNotMatch(html, /situated_learning/);
  assert.doesNotMatch(html, /learning_intent|activity_rationale/);
  assert.doesNotMatch(html, /data-input-modality=["']math["']/);
  // Slice 5: default fixture commissions embedded record entries via shared text_entry.
  assert.match(html, /data-workspace-kind=["']text_entry["']/);
  assert.match(html, /<textarea\b/i);
  // Must not invent a Situated-specific persistence subsystem.
  assert.doesNotMatch(html, /data-learner-record|prism-record-persist/i);
});

test("6. No-graphics Situated package succeeds when otherwise ready", () => {
  const page = baseSituatedPage();
  const html = renderSituatedHtml(page);
  const graphics = visualJobs.assessRequiredGraphicsJobsFromPage(page, {
    workflowResourceRefs: []
  });
  assert.equal(graphics.determinable, true);
  assert.equal(graphics.complete, true);
  assert.equal(graphics.zeroRequired || graphics.requiredCount === 0, true);

  const built = learnerPackage.buildLearnerPackage({
    html: html,
    title: page.title,
    pageSlug: "situated-no-graphics"
  });
  assert.equal(built.ok, true, built.error && built.error.message);
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const entries = unzipEntries(zipped.bytes);
  assert.ok(entries["learner-page.html"]);
});

test("7. Required unsatisfied graphic prevents Complete / package-ready semantics", () => {
  const page = pageWithRequiredGraphic();
  const graphics = visualJobs.assessRequiredGraphicsJobsFromPage(page, {
    workflowResourceRefs: []
  });
  assert.equal(graphics.determinable, true);
  assert.equal(graphics.complete, false);
  assert.ok(graphics.requiredCount >= 1);

  const ljPage = journeyWithSituated();
  ljPage.commissions = [ljPage.commissions[1]];
  const child = {
    id: "wf-sit",
    product: "situated_task",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c3",
    steps: [
      {
        id: "dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "situated_task_page"
      }
    ]
  };
  const derived = status.deriveLearningJourneyCommissionProductionStatuses({
    page: ljPage,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }, child],
    runStateByWorkflowId: {
      "wf-sit": {
        capturedOutputs: { dp: JSON.stringify(page) },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs
  });
  assert.equal(derived.byCommissionId.c3.status, STATUS.AUTHORING);

  const preflight = ljPackage.preflightLearningJourneyLearnerPackage({
    page: ljPage,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }, child],
    runStateByWorkflowId: {
      "wf-sit": {
        capturedOutputs: { dp: JSON.stringify(page) },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs
  });
  assert.equal(preflight.ok, false);
  assert.match(preflight.blockers[0].reason, /Authoring/i);
});

test("8. Satisfied graphic is included with valid relative media reference", () => {
  const page = pageWithRequiredGraphic();
  const assessed = visualJobs.assessRequiredGraphicsJobsFromPage(page, {
    workflowResourceRefs: []
  });
  assert.ok(assessed.briefs && assessed.briefs.length >= 1);
  const brief = assessed.briefs[0];
  const html =
    '<!DOCTYPE html><html><body><h1>Observe</h1><img src="' +
    TINY_PNG_DATA_URL +
    '" alt="aid" data-brief-id="' +
    String(brief.brief_id || "b1") +
    '"></body></html>';
  const built = learnerPackage.buildLearnerPackage({
    html: html,
    title: page.title,
    pageSlug: "situated-with-graphic",
    visualAssetManifest: {
      assets: [
        {
          brief_id: brief.brief_id || "b1",
          affordance_id: brief.affordance_id,
          visual_slot: "section-after-content",
          scope: "section",
          mime_type: "image/png",
          data_url: TINY_PNG_DATA_URL,
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        }
      ]
    }
  });
  assert.equal(built.ok, true, built.error && built.error.message);
  assert.match(built.package.html, /src="assets\//);
  assert.doesNotMatch(built.package.html, /data:image\/png;base64/);
  assert.ok(built.package.assets.some((a) => String(a.path || "").startsWith("assets/")));
});

test("9. Supported TeX survives into the existing maths render/package path", () => {
  const page = pageWithTeX();
  const { api } = loadExportApi();
  const rendered = api.runUtilityPageExportPipelineForTest(page, {
    skipWorkflowAssembly: true,
    applyCompositionValidation: false
  });
  assert.equal(rendered.error, null, rendered.error || "");
  assert.match(rendered.html, /x\^2|\\\(|math-tex|MathJax|mjx|katex/i);
  const enhanced =
    typeof api.utilityEnhanceExportHtmlWithMathJaxForTest === "function"
      ? api.utilityEnhanceExportHtmlWithMathJaxForTest(rendered.html)
      : rendered.html;
  assert.equal(learnerPackage.pageHtmlNeedsMathJaxForPackage(enhanced), true);
  // Explicit empty asset list must fail closed (do not silently omit Maths runtime).
  const withoutAssets = learnerPackage.buildLearnerPackage({
    html: enhanced,
    title: page.title,
    pageSlug: "situated-tex",
    mathJaxPackageAssets: []
  });
  assert.equal(withoutAssets.ok, false);
  assert.match(String(withoutAssets.error && withoutAssets.error.code), /mathjax/i);
});

test("10. No Situated-specific Record persistence subsystem is invented", () => {
  // External-recording page: no embedded workspaces.
  const externalOnly = baseSituatedPage({ recordEntries: null });
  const externalHtml = renderSituatedHtml(externalOnly);
  assert.doesNotMatch(externalHtml, /<textarea\b/i);
  assert.doesNotMatch(externalHtml, /data-workspace-kind=["']text_entry["']/);

  // Embedded recording reuses shared text_entry — not a new persistence product.
  const withEntries = baseSituatedPage();
  const html = renderSituatedHtml(withEntries);
  assert.match(html, /data-workspace-kind=["']text_entry["']/);
  assert.doesNotMatch(html, /data-input-modality=["']math["']/);
  assert.doesNotMatch(html, /data-learner-record|prism-record-persist|multipart\/form-data/i);
  assert.equal(Object.prototype.hasOwnProperty.call(withEntries, "localStorage"), false);
  assert.equal(
    Object.prototype.hasOwnProperty.call(withEntries.situated_learning.record, "localStorage"),
    false
  );
  const source = fs.readFileSync(
    path.join(__dirname, "..", "lib/situated-task-design-page.js"),
    "utf8"
  );
  assert.match(source, /persistence \/ storage \/ localStorage/);
});

test("11–14. LJ package routing recognises Complete situated_task; Production/Authoring block; Complete passes", () => {
  const page = journeyWithSituated();
  page.commissions = [page.commissions[1]];
  const child = {
    id: "wf-sit",
    product: "situated_task",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c3",
    steps: [
      {
        id: "dp",
        title: "Design Page",
        canonical_step_id: "step_design_page",
        outputName: "situated_task_page"
      }
    ]
  };
  const situatedPage = baseSituatedPage();

  const production = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }, child],
    runStateByWorkflowId: { "wf-sit": {} },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockZeroGraphicsWorkspace()
  });
  assert.equal(production.ok, false);
  assert.match(production.blockers[0].reason, /Production/i);

  const authoring = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }, child],
    runStateByWorkflowId: {
      "wf-sit": {
        capturedOutputs: { dp: JSON.stringify(pageWithRequiredGraphic()) },
        workflowResourceRefs: []
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: visualJobs
  });
  assert.equal(authoring.ok, false);
  assert.match(authoring.blockers[0].reason, /Authoring/i);

  const complete = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }, child],
    runStateByWorkflowId: {
      "wf-sit": {
        capturedOutputs: { dp: JSON.stringify(situatedPage) },
        authoritativeAssembledPage: situatedPage
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockZeroGraphicsWorkspace()
  });
  assert.equal(complete.ok, true, JSON.stringify(complete.blockers));
  assert.equal(complete.readyCommissions[0].commissionId, "c3");
  assert.equal(complete.derivation.byCommissionId.c3.productId, "situated_task");
});

test("15–17. Situated constituent nests under cN/; media local; Journey Home links in LJ order", () => {
  const page = journeyWithSituated();
  const assembled = ljPackage.assembleLearningJourneyLearnerPackage({
    page,
    constituents: [
      { commissionId: "c1", learnerPackage: makeConstituentPackage("Interactive", "hero") },
      {
        commissionId: "c3",
        learnerPackage: makeConstituentPackage("Situated", "action-aid")
      }
    ],
    fflate
  });
  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const entries = unzipEntries(assembled.bytes);
  assert.ok(entries["index.html"]);
  assert.ok(entries["c1/index.html"]);
  assert.ok(entries["c3/index.html"]);
  assert.ok(entries["c3/media/action-aid.png"] || Object.keys(entries).some((p) => p.startsWith("c3/media/")));
  assert.ok(!Object.keys(entries).some((p) => p === "media/action-aid.png"));

  const home = fflate.strFromU8(entries["index.html"]);
  const interactiveLink = home.indexOf('href="c1/index.html"');
  const situatedLink = home.indexOf('href="c3/index.html"');
  assert.ok(interactiveLink > 0);
  assert.ok(situatedLink > interactiveLink, "Journey Home must follow canonical commission order");
  assert.match(home, /Observe a workplace practice/);
});

test("18–19. Interactive/Expository still package; unsupported remains blocking", () => {
  const page = journeyWithSituated([
    {
      commission_id: "c4",
      section_id: "exp_sit",
      order: 3,
      title: "Legacy unsupported",
      product_id: "",
      status: "unsupported",
      specification_text: "UNSUPPORTED"
    }
  ]);
  page.sections.push({
    section_id: "exp_2",
    title: "Build a Better Basis",
    order: 4,
    exposition: "Expository experience."
  });
  // Keep unsupported on its own section for clarity
  page.commissions[2].section_id = "exp_2";

  const preflight = ljPackage.preflightLearningJourneyLearnerPackage({
    page,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }],
    runStateByWorkflowId: {},
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockZeroGraphicsWorkspace()
  });
  assert.equal(preflight.ok, false);
  assert.ok(preflight.blockers.some((b) => b.commissionId === "c4"));
  assert.match(
    preflight.blockers.find((b) => b.commissionId === "c4").reason,
    /Unsupported/i
  );

  const interactiveOnly = journeyWithSituated();
  interactiveOnly.commissions = [interactiveOnly.commissions[0]];
  const interactiveChild = {
    id: "wf-c1",
    product: "interactive",
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c1",
    steps: [
      { id: "dp", title: "Design Page", canonical_step_id: "step_design_page", outputName: "page" }
    ]
  };
  const interactivePage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Interactive",
    activities: [],
    sections: [{ section_id: "s1", title: "S1", order: 1, exposition: "Hello" }],
    assembly_state: { current_stage: "design_page", enriched_by: ["design_page"], calls_model: true }
  };
  const interactiveReady = ljPackage.preflightLearningJourneyLearnerPackage({
    page: interactiveOnly,
    learningJourneyWorkflowId: "wf-lj",
    workflows: [{ id: "wf-lj", product: "learning_journey", steps: [] }, interactiveChild],
    runStateByWorkflowId: {
      "wf-c1": {
        capturedOutputs: { dp: JSON.stringify(interactivePage) },
        authoritativeAssembledPage: interactivePage
      }
    },
    productAcceptsCommission: family.productAcceptsCommission,
    visualJobsWorkspaceMod: mockZeroGraphicsWorkspace()
  });
  assert.equal(interactiveReady.ok, true, JSON.stringify(interactiveReady.blockers));
});

test("20. Package preparation uses enriched run-state path (Sprint 91 regression guard)", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSource, /prepareLearningJourneyPreviewProductionByCommissionId/);
  assert.match(
    appSource,
    /package_preflight_prepare_async_owner_store_hydrate/
  );
  assert.match(appSource, /situated_task_page/);
  assert.match(appSource, /isPageBasedLearnerPublishRoute/);
  const ljSource = fs.readFileSync(
    path.join(__dirname, "..", "lib/learning-journey-learner-package.js"),
    "utf8"
  );
  assert.match(
    ljSource,
    /Callers must supply the SAME prepared runStateByWorkflowId as LJ Preview/
  );
});

test("Constituent builder accepts ordinary Situated Task workflow via shared page path", async () => {
  const page = baseSituatedPage();
  const { api, window, sandbox } = loadExportApi();
  if (window) {
    window.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = family;
    window.PRISM_SITUATED_TASK_DESIGN_PAGE = situated;
    window.PRISM_LEARNER_PACKAGE = learnerPackage;
    window.PRISM_LEARNER_PACKAGE_ZIP = learnerPackageZip;
    window.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
  }
  if (sandbox) {
    sandbox.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = family;
    sandbox.PRISM_SITUATED_TASK_DESIGN_PAGE = situated;
    sandbox.PRISM_LEARNER_PACKAGE = learnerPackage;
    sandbox.PRISM_LEARNER_PACKAGE_ZIP = learnerPackageZip;
    sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    if (sandbox.globalThis) {
      sandbox.globalThis.PRISM_SITUATED_TASK_DESIGN_PAGE = situated;
      sandbox.globalThis.PRISM_FIRST_CLASS_WORKFLOW_FAMILY = family;
      sandbox.globalThis.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = visualJobs;
    }
  }

  const workflows = [
    {
      id: "wf-sit-pkg",
      name: "Observe a workplace practice",
      product: "situated_task",
      steps: [
        {
          id: "dp",
          title: "Design Page",
          canonical_step_id: "step_design_page",
          outputName: "situated_task_page"
        }
      ]
    }
  ];
  api.setWorkflowsForTest(workflows);
  const built = await api.buildConstituentLearnerPackageModelForTest("wf-sit-pkg", {
    workflows,
    runStateByWorkflowId: {
      "wf-sit-pkg": {
        capturedOutputs: { dp: JSON.stringify(page) },
        authoritativeAssembledPage: page,
        authoritativePageSource: "resolvePageForRenderOrAssembly"
      }
    }
  });
  assert.equal(built.ok, true, (built.error && built.error.message) || built.code || "");
  assert.ok(built.package);
  assert.ok(String(built.package.html || "").includes("What you will do"));
  assert.match(String(built.package.html || ""), /data-workspace-kind=["']text_entry["']/);
  assert.doesNotMatch(String(built.package.html || ""), /situated_learning|learning_intent/);
});
