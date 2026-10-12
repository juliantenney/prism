/**
 * ZIP export must follow the Authoring page that is currently assembled.
 * A previously previewed Learning Journey must not stay the export target.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const design = require("../lib/learning-journey-design-page.js");
const status = require("../lib/learning-journey-commission-production-status.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const family = require("../lib/first-class-workflow-family.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");

const EXPOSITORY_TITLE =
  "Choosing a Clinical Study Design: Questions, Evidence and Trade-offs";

function jazzJourneyPage() {
  const commissions = [];
  let n;
  for (n = 1; n <= 12; n += 1) {
    commissions.push({
      commission_id: "c" + n,
      section_id: "exp_" + n,
      order: n,
      title: "Commission " + n,
      product_id: "expository_resource",
      status: "supported",
      specification_text: "Commission " + n
    });
  }
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Jazz Learning Journey",
    activities: [],
    sections: [],
    commissions: commissions,
    learning_journey: { design_intent: "test", continuity: "test" }
  };
}

function expositoryPage() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository_resource",
    page_kind: "expository",
    title: EXPOSITORY_TITLE,
    activities: [
      {
        activity_id: "study-design",
        title: EXPOSITORY_TITLE,
        beats: []
      }
    ],
    sections: []
  };
}

function expositoryHtml() {
  return (
    "<!DOCTYPE html><html><body><h1>" +
    EXPOSITORY_TITLE +
    "</h1></body></html>"
  );
}

function installApis(loaded) {
  const packaged = Object.assign({}, learnerPackage, {
    buildLearnerPackage: function (input) {
      packaged.seenHtml = input && input.html;
      return learnerPackage.buildLearnerPackage(input);
    }
  });
  const bindings = {
    PRISM_LEARNING_JOURNEY_DESIGN_PAGE: design,
    PRISM_LEARNING_JOURNEY_COMMISSION_PRODUCTION_STATUS: status,
    PRISM_LEARNING_JOURNEY_LEARNER_PACKAGE: ljPackage,
    PRISM_FIRST_CLASS_WORKFLOW_FAMILY: family,
    PRISM_LEARNER_PACKAGE: packaged,
    PRISM_LEARNER_PACKAGE_ZIP: learnerPackageZip
  };
  Object.keys(bindings).forEach(function (key) {
    loaded.sandbox[key] = bindings[key];
    loaded.window[key] = bindings[key];
  });
  loaded.packaged = packaged;
  loaded.sandbox.URL = loaded.window.URL;
  loaded.sandbox.Blob = function Blob(parts, options) {
    this.parts = parts;
    this.options = options;
  };
}

function load() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/learning-journey-commission-production-status.js",
      "lib/learning-journey-learner-package.js",
      "lib/learner-package.js",
      "lib/learner-package-zip.js"
    ],
    skipLearnerRendererVNextInject: true,
    skipGamCanonicalAssemblerInject: true
  });
  installApis(loaded);
  loaded.api.setWorkflowsForTest([
    {
      id: "wf-jazz",
      name: "Jazz Learning Journey",
      product: "learning_journey",
      ldCreateOutputType: "learning_journey",
      steps: [{ id: "step-dp", title: "Design Page", canonical_step_id: "step_design_page" }]
    },
    {
      id: "wf-expo",
      name: "RichardPearsonExpo",
      product: "expository_resource",
      ldCreateOutputType: "expository_resource",
      steps: [{ id: "step-dp", title: "Design Page", canonical_step_id: "step_design_page" }]
    }
  ]);
  return loaded;
}

function rememberJazz(api) {
  api.setSelectedWorkflowIdForTest("wf-jazz");
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: jazzJourneyPage(),
    sourceWorkflowId: "wf-jazz",
    updatedAt: 1
  });
  api.setUtilitiesOutputWorkspaceForTest({
    assembledPageSnapshot: jazzJourneyPage(),
    activeView: "learner_page"
  });
}

test("Learning Journey then Expository ZIP uses the Expository page", async () => {
  const loaded = load();
  const api = loaded.api;
  rememberJazz(api);
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), true);

  api.selectWorkflowForTest("wf-expo");
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), false);
  assert.ok(api.getLearningJourneyCommissioningPreviewContextForTest());

  api.selectWorkflowForTest("wf-jazz");
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), true);

  api.selectWorkflowForTest("wf-expo");

  const page = expositoryPage();
  api.setUtilitiesOutputWorkspaceForTest({
    assembledPageSnapshot: page,
    activeView: "learner_page"
  });
  api.setUtilitiesLastHtmlForTest(expositoryHtml());
  api.setLearningJourneyCommissioningPreviewContextForTest({
    page: jazzJourneyPage(),
    sourceWorkflowId: "wf-jazz",
    updatedAt: 1
  });
  assert.equal(
    api.isLearningJourneyCommissioningPreviewActiveForTest(),
    false,
    "stale journey context must not win over the assembled Expository page"
  );

  api.clearUtilitiesDownloadTestLogForTest();
  const zipResult = await api.handleUtilitiesDownloadLearnerPackageForTest();
  assert.equal(zipResult && zipResult.ok, true, JSON.stringify(zipResult));
  assert.deepEqual(Array.from(api.getUtilitiesDownloadTestLogForTest()), ["zip"]);
  assert.match(String(loaded.packaged.seenHtml || ""), new RegExp(EXPOSITORY_TITLE));
  assert.equal(String(loaded.packaged.seenHtml || "").indexOf("Missing constituent"), -1);
  assert.equal(String(loaded.packaged.seenHtml || "").indexOf("commission_id"), -1);
});

test("Expository HTML and ZIP exports use the same active page", async () => {
  const loaded = load();
  const api = loaded.api;
  rememberJazz(api);
  api.setSelectedWorkflowIdForTest("wf-expo");
  api.setUtilitiesOutputWorkspaceForTest({
    assembledPageSnapshot: expositoryPage(),
    activeView: "learner_page"
  });
  api.setUtilitiesLastHtmlForTest(expositoryHtml());

  api.clearUtilitiesDownloadTestLogForTest();
  await api.handleUtilitiesDownloadHtmlForTest();
  const zipResult = await api.handleUtilitiesDownloadLearnerPackageForTest();
  assert.equal(zipResult && zipResult.ok, true, JSON.stringify(zipResult));
  assert.deepEqual(Array.from(api.getUtilitiesDownloadTestLogForTest()), ["html", "zip"]);
  assert.match(String(loaded.packaged.seenHtml || ""), new RegExp(EXPOSITORY_TITLE));
  assert.equal(String(loaded.packaged.seenHtml || "").indexOf("Jazz Learning Journey"), -1);
});

test("Learning Journey ZIP still reports genuinely missing constituents", async () => {
  const loaded = load();
  const api = loaded.api;
  rememberJazz(api);
  api.clearUtilitiesDownloadTestLogForTest();
  const result = await api.handleUtilitiesDownloadLearnerPackageForTest();
  assert.equal(result && result.ok, false);
  assert.equal(result.code, "not_ready");
  const ids = (result.blockers || []).map(function (row) {
    return row.commissionId;
  });
  assert.ok(ids.indexOf("c1") !== -1);
  assert.ok(ids.indexOf("c12") !== -1);
  assert.match(
    (result.blockers || []).map(function (row) {
      return row.reason;
    }).join(" "),
    /Missing constituent workflow/
  );
  assert.deepEqual(Array.from(api.getUtilitiesDownloadTestLogForTest()), []);
});
