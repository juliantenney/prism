/**
 * Authoring opens on the selected workflow preview and will not replace
 * manual JSON without an explicit choice.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");
const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");
const situated = require("../lib/situated-task-design-page.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");

function simplePage(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: title,
    activities: [],
    sections: [
      {
        section_id: "s1",
        title: "Opening",
        exposition: title + " remains the learner explanation."
      }
    ]
  };
}

function learningJourneyPage(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: title,
    activities: [],
    sections: [
      {
        section_id: "exp_1",
        title: "First experience",
        exposition: "The journey introduces the first experience."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Explain the idea",
        product_id: "expository",
        status: "supported",
        specification_text: "Explain the idea."
      }
    ],
    learning_journey: {
      design_intent: "Sequence the experiences.",
      continuity: "Each step leads on."
    },
    assembly_state: { calls_model: true }
  };
}

function workflow(id, name, ldCreateOutputType) {
  return {
    id: id,
    name: name,
    ldCreateOutputType: ldCreateOutputType,
    steps: [{ id: "step-dp", title: "Design Page", canonical_step_id: "step_design_page" }]
  };
}

function load() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-workflow-family.js",
      "lib/learning-journey-design-page.js",
      "lib/situated-task-design-page.js",
      "lib/learner-package.js",
      "lib/learner-package-zip.js"
    ]
  });
  const packaged = Object.assign({}, learnerPackage, {
    buildLearnerPackage: function (input) {
      packaged.seenHtml = input && input.html;
      return learnerPackage.buildLearnerPackage(input);
    }
  });
  const bindings = {
    PRISM_FIRST_CLASS_WORKFLOW_FAMILY: family,
    PRISM_LEARNING_JOURNEY_DESIGN_PAGE: design,
    PRISM_SITUATED_TASK_DESIGN_PAGE: situated,
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
  const catalog = {
    getArtefactRenderCatalog: function () {
      return Promise.resolve([
        {
          id: "page",
          renderHints: {
            renderable: true,
            supportedFormats: ["html"],
            rendererType: "document",
            rendererVariant: "page",
            renderConfig: {
              sectionOrder: [
                "overview",
                "learning_purpose",
                "knowledge_summary",
                "learning_activities",
                "assessment_check",
                "support_notes"
              ],
              labels: {
                overview: "Overview",
                learning_purpose: "Learning Purpose",
                knowledge_summary: "Key Knowledge Summary",
                learning_activities: "Learning Activities",
                assessment_check: "Formative Assessment Check",
                support_notes: "Support Notes"
              },
              omitIfMissing: ["assessment_check", "support_notes"],
              grouping: "document_sections",
              itemKeyMap: {}
            }
          }
        }
      ]);
    }
  };
  loaded.sandbox.WorkflowGenerationContext = catalog;
  loaded.window.WorkflowGenerationContext = catalog;
  loaded.window.setTimeout = setTimeout;
  loaded.window.clearTimeout = clearTimeout;
  loaded.sandbox.PRISM_UTILITIES_VISUAL_JOBS_WORKSPACE = require("../lib/utilities-visual-jobs-workspace.js");
  return loaded;
}

function ready() {
  const loaded = load();
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(loaded);
    }, 0);
  });
}

function jsonInput(loaded) {
  return loaded.sandbox.document.getElementById("utilitiesJsonInput");
}

function selectCaptured(api, workflowId, page) {
  api.setSelectedWorkflowIdForTest(workflowId);
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(page)
  });
}

test("Authoring layout keeps JSON behind Advanced and shows resource identity", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /<summary>Advanced: Resource JSON<\/summary>/);
  assert.match(html, /<details id="utilitiesAdvancedJson"/);
  assert.doesNotMatch(html, /<details id="utilitiesAdvancedJson"[^>]*\sopen[\s>]/);
  assert.doesNotMatch(html, /The selected workflow is assembled and shown as the learner preview/);
  assert.match(html, /id="utilitiesResourceIdentityMeta"/);
  assert.match(html, /class="utilities-preview-toolbar"/);
  assert.match(html, /aria-label="Open in New Tab"/);
  assert.match(html, /aria-label="HTML only \(\.html\)"/);
  assert.match(html, /aria-label="Learner package \(\.zip\)"/);
  const advancedAt = html.indexOf("utilitiesAdvancedJson");
  const previewAt = html.indexOf("utilitiesPreviewPanel");
  const toolbarAt = html.indexOf("utilities-preview-toolbar");
  const openAt = html.indexOf("utilitiesOpenTabBtn");
  assert.ok(previewAt > 0 && previewAt < advancedAt);
  assert.ok(toolbarAt > previewAt && openAt > toolbarAt && openAt < advancedAt);
  assert.match(html, />\s*Open\s*</);
  assert.match(html, />\s*HTML\s*</);
  assert.match(html, />\s*ZIP\s*</);
  assert.match(html, /id="utilitiesEditProtection"/);
  assert.match(html, /Keep current edited artefact/);
  assert.match(html, /Discard edits and load selected workflow/);
});

test("entering Authoring assembles and previews the selected Interactive workflow once", async () => {
  const loaded = await ready();
  const api = loaded.api;
  api.setWorkflowsForTest([workflow("wf-interactive", "Clinic briefing", "self_study_resource")]);
  selectCaptured(api, "wf-interactive", simplePage("Interactive clinic briefing"));
  const result = await api.switchTabForTest("utilities");
  assert.equal(result && result.ok, true, JSON.stringify(result));
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Interactive clinic briefing/);
  assert.match(String(api.getUtilitiesLastHtmlForTest() || ""), /Interactive clinic briefing/);
  const identity = api.getUtilitiesResourceIdentityForTest();
  assert.match(identity, /Product: Interactive/);
  assert.match(identity, /Resource: Interactive clinic briefing/);
  assert.match(identity, /Preview is current for this workflow/);
  assert.equal(api.getUtilitiesAuthoringSessionForTest().status, "current");
  assert.equal(api.getUtilitiesAuthoringSessionForTest().notice, "");

  const again = await api.syncAuthoringPreviewToSelectedWorkflowForTest("enter");
  assert.equal(again && again.skipped, true);
  assert.equal(api.getUtilitiesAuthoringSessionForTest().assemblyAttempts, 1);
});

test("a clean selection change previews the newly selected workflow", async () => {
  const loaded = await ready();
  const api = loaded.api;
  api.setWorkflowsForTest([
    workflow("wf-a", "Alpha interactive", "self_study_resource"),
    workflow("wf-b", "Beta interactive", "self_study_resource")
  ]);
  selectCaptured(api, "wf-a", simplePage("First interactive page"));
  await api.switchTabForTest("utilities");

  api.setSelectedWorkflowIdForTest("wf-b");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Second interactive page"))
  });
  const switched = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(switched && switched.ok, true, JSON.stringify(switched));
  assert.match(api.getUtilitiesLastHtmlForTest(), /Second interactive page/);
  assert.equal(String(api.getUtilitiesLastHtmlForTest()).indexOf("First interactive page"), -1);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Resource: Second interactive page/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Preview is current for this workflow/);
});

test("missing, incomplete, and non-page workflows do not keep a stale preview", async () => {
  const loaded = await ready();
  const api = loaded.api;
  api.setWorkflowsForTest([
    workflow("wf-a", "Alpha interactive", "self_study_resource"),
    workflow("wf-expo", "Expo draft", "expository_resource"),
    workflow("wf-pack", "Pack draft", "assessment_pack")
  ]);
  selectCaptured(api, "wf-a", simplePage("Alpha page"));
  await api.switchTabForTest("utilities");
  assert.match(api.getUtilitiesLastHtmlForTest(), /Alpha page/);

  api.setSelectedWorkflowIdForTest("");
  const empty = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(empty && empty.empty, true);
  assert.equal(api.getUtilitiesJsonInputValueForTest(), "");
  assert.equal(String(api.getUtilitiesLastHtmlForTest() || ""), "");
  assert.match(api.getUtilitiesAuthoringNoticeForTest(), /No workflow selected/);
  assert.equal(String(api.getUtilitiesAuthoringNoticeForTest()).indexOf("Alpha page"), -1);

  selectCaptured(api, "wf-a", simplePage("Alpha page"));
  await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  api.setSelectedWorkflowIdForTest("wf-expo");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Unfinished expository page"))
  });
  const expo = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(expo && expo.ok, false);
  assert.equal(String(api.getUtilitiesLastHtmlForTest() || "").indexOf("Alpha page"), -1);
  assert.match(api.getUtilitiesAuthoringNoticeForTest(), /Could not assemble|episode plan|Journey Plan/i);
  assert.equal(api.getUtilitiesResourceIdentityForTest().indexOf("Alpha page"), -1);

  api.setSelectedWorkflowIdForTest("wf-pack");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Unfinished assessment page"))
  });
  const pack = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(pack && pack.ok, false);
  assert.match(api.getUtilitiesAuthoringNoticeForTest(), /Assessment|assemble|capture/i);
  assert.equal(String(api.getUtilitiesLastHtmlForTest() || "").indexOf("Unfinished expository page"), -1);
});

test("Learning Journey and Situated Task captures preview as those products", async () => {
  const loaded = await ready();
  const api = loaded.api;
  const situatedPage = situated.buildSituatedTaskDesignPageFixture().page;
  situatedPage.title = "Observe the clinic handover";
  api.setWorkflowsForTest([
    workflow("wf-lj", "Journey overview", "learning_journey"),
    workflow("wf-sit", "Situated observation", "situated_task")
  ]);
  selectCaptured(api, "wf-lj", learningJourneyPage("Journey of study design"));
  const journey = await api.switchTabForTest("utilities");
  assert.equal(journey && journey.ok, true, JSON.stringify(journey));
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Product: Learning Journey/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Resource: Journey of study design/);
  assert.match(String(api.getUtilitiesLastHtmlForTest() || ""), /Journey of study design/);
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), true);

  api.setSelectedWorkflowIdForTest("wf-sit");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(situatedPage)
  });
  const task = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(task && task.ok, true, JSON.stringify(task));
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Product: Situated Task/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Observe the clinic handover/);
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), false);
  assert.equal(
    String(api.getUtilitiesLastHtmlForTest() || "").indexOf("Journey of study design"),
    -1
  );
});

test("manual JSON is kept across leaving Authoring and is replaced only by an explicit choice", async () => {
  const loaded = await ready();
  const api = loaded.api;
  api.setWorkflowsForTest([
    workflow("wf-a", "Alpha interactive", "self_study_resource"),
    workflow("wf-b", "Beta interactive", "self_study_resource")
  ]);
  selectCaptured(api, "wf-a", simplePage("Alpha page"));
  await api.switchTabForTest("utilities");

  const edited = JSON.parse(api.getUtilitiesJsonInputValueForTest());
  edited.title = "Alpha page MANUAL";
  edited.sections[0].exposition = "Manual exposition stays.";
  jsonInput(loaded).value = JSON.stringify(edited, null, 2);
  api.handleUtilitiesJsonInputForTest({ inputType: "insertText" });
  assert.equal(api.getUtilitiesAuthoringSessionForTest().status, "manual");
  const reassemble = await api.handleUtilitiesAssembleFromCurrentWorkflowRunForTest();
  assert.equal(reassemble && reassemble.blocked, true);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Alpha page MANUAL/);

  await api.switchTabForTest("workflows");
  const returned = await api.switchTabForTest("utilities");
  assert.equal(returned && returned.kept, true);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Alpha page MANUAL/);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Manual exposition stays/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /manually edited/);

  const preview = await api.handleUtilitiesGenerateForTest();
  assert.equal(preview && preview.ok, true, JSON.stringify(preview));
  assert.match(String(api.getUtilitiesLastHtmlForTest() || ""), /Alpha page MANUAL/);
  assert.equal(api.getUtilitiesAuthoringSessionForTest().status, "manual");

  api.setSelectedWorkflowIdForTest("wf-b");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Beta page"))
  });
  const blocked = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(blocked && blocked.blocked, true);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Alpha page MANUAL/);
  assert.match(api.getUtilitiesEditProtectionMessageForTest(), /Keep that artefact/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Retained/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Beta interactive/);
  assert.equal(api.getUtilitiesResourceIdentityForTest().indexOf("Preview is current"), -1);

  await api.handleUtilitiesKeepEditedArtefactForTest();
  assert.equal(api.getUtilitiesAuthoringSessionForTest().pendingDecision, null);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Alpha page MANUAL/);

  api.setSelectedWorkflowIdForTest("wf-a");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Alpha page"))
  });
  const backHome = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(backHome && backHome.kept, true);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Alpha page MANUAL/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /manually edited/);

  api.setSelectedWorkflowIdForTest("wf-b");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Beta page"))
  });
  const keptOnBeta = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(keptOnBeta && keptOnBeta.kept, true);
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Alpha page MANUAL/);
  const discarded = await api.handleUtilitiesDiscardEditsAndLoadSelectedForTest();
  assert.equal(discarded && discarded.ok, true, JSON.stringify(discarded));
  assert.match(api.getUtilitiesJsonInputValueForTest(), /Beta page/);
  assert.equal(api.getUtilitiesJsonInputValueForTest().indexOf("MANUAL"), -1);
  assert.match(String(api.getUtilitiesLastHtmlForTest() || ""), /Beta page/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /Preview is current/);
});

test("a pasted artefact can be previewed without being treated as the selected workflow", async () => {
  const loaded = await ready();
  const api = loaded.api;
  api.setWorkflowsForTest([workflow("wf-a", "Alpha interactive", "self_study_resource")]);
  selectCaptured(api, "wf-a", simplePage("Alpha page"));
  await api.switchTabForTest("utilities");

  jsonInput(loaded).value = JSON.stringify(simplePage("Older pasted chapter"), null, 2);
  api.handleUtilitiesJsonInputForTest({ inputType: "insertFromPaste" });
  assert.equal(api.getUtilitiesAuthoringSessionForTest().status, "pasted");
  const preview = await api.handleUtilitiesGenerateForTest();
  assert.equal(preview && preview.ok, true, JSON.stringify(preview));
  assert.match(String(api.getUtilitiesLastHtmlForTest() || ""), /Older pasted chapter/);
  assert.match(api.getUtilitiesResourceIdentityForTest(), /deliberately loaded/);
  assert.equal(api.getUtilitiesResourceIdentityForTest().indexOf("Preview is current"), -1);
  assert.equal(api.getUtilitiesAuthoringSessionForTest().status, "pasted");
});

test("HTML and ZIP export use the automatically previewed artefact", async () => {
  const loaded = await ready();
  const api = loaded.api;
  api.setWorkflowsForTest([
    workflow("wf-lj", "Journey overview", "learning_journey"),
    workflow("wf-a", "Alpha interactive", "self_study_resource")
  ]);
  selectCaptured(api, "wf-lj", learningJourneyPage("Journey of study design"));
  await api.switchTabForTest("utilities");
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), true);

  api.setSelectedWorkflowIdForTest("wf-a");
  api.setWorkflowRunCapturedOutputsForTest({
    "step-dp": JSON.stringify(simplePage("Exported interactive page"))
  });
  const preview = await api.syncAuthoringPreviewToSelectedWorkflowForTest("selection");
  assert.equal(preview && preview.ok, true, JSON.stringify(preview));
  assert.equal(api.isLearningJourneyCommissioningPreviewActiveForTest(), false);

  api.clearUtilitiesDownloadTestLogForTest();
  await api.handleUtilitiesDownloadHtmlForTest();
  const zipResult = await api.handleUtilitiesDownloadLearnerPackageForTest();
  assert.equal(zipResult && zipResult.ok, true, JSON.stringify(zipResult));
  assert.deepEqual(Array.from(api.getUtilitiesDownloadTestLogForTest()), ["html", "zip"]);
  assert.match(String(loaded.packaged.seenHtml || ""), /Exported interactive page/);
  assert.equal(String(loaded.packaged.seenHtml || "").indexOf("Journey of study design"), -1);
});
