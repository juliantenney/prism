/**
 * S78-T-020 — Final workflow Continue to Authoring CTA placement and enablement.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const styleCssPath = path.join(repoRoot, "style.css");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source };
}

function html() {
  return fs.readFileSync(indexHtmlPath, "utf8");
}

function css() {
  return fs.readFileSync(styleCssPath, "utf8");
}

function buttonsCluster(markup) {
  const start = markup.indexOf('<div id="workflowRunButtons" class="workflow-run-buttons">');
  assert.ok(start > 0, "run buttons cluster exists");
  return markup.slice(start, markup.indexOf("</div>", start));
}

function createStepFnBody(source) {
  const start = source.indexOf("function createWorkflowStepElement");
  const end = source.indexOf("function gatherWorkflowDetailFormData()");
  assert.ok(start > 0 && end > start, "createWorkflowStepElement body");
  return source.slice(start, end);
}

function updateRunViewBody(source) {
  const start = source.indexOf("function updateWorkflowRunView");
  const end = source.indexOf("function setWorkflowMode(");
  assert.ok(start > 0 && end > start, "updateWorkflowRunView body");
  return source.slice(start, end);
}

function continueHandlerBody(source) {
  const start = source.indexOf("function handleContinueToAuthoring");
  assert.ok(start > 0, "handleContinueToAuthoring exists");
  return source.slice(start, start + 2500);
}

function designPageStep(id) {
  return {
    id: id || "s-final",
    title: "Design Page",
    outputName: "page",
    canonical_step_id: "step_design_page"
  };
}

function dlaStep(id) {
  return {
    id: id || "s-dla",
    title: "Design Learning Activities",
    outputName: "page",
    canonical_step_id: "step_design_learning_activities"
  };
}

test("R1: non-final step retains Previous/Next behaviour", () => {
  const { api, source } = loadPrismTestApi();
  const markup = html();
  const buttons = buttonsCluster(markup);
  const view = updateRunViewBody(source);
  assert.match(buttons, /id="workflowPrevStepBtn"/);
  assert.match(buttons, /id="workflowNextStepBtn"/);
  assert.match(view, /els\.workflowPrevStepBtn\.disabled\s*=\s*idx\s*===\s*0/);
  assert.match(view, /setWorkflowRunNextButtonHidden\(isFinalStep\)/);
  assert.match(view, /resolveWorkflowRunNextStepDisabledReason\(/);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 8), false);
  assert.equal(api.resolveWorkflowRunNextStepDisabledReason({}, "s1", {}, null, 0, 8), "");
  assert.equal(
    api.resolveWorkflowRunNextStepDisabledReason(designPageStep("s1"), "s1", {}, null, 0, 8),
    "Paste a valid result for this step before continuing."
  );
});

test("R2: final step does not show normal Next", () => {
  const { source } = loadPrismTestApi();
  const view = updateRunViewBody(source);
  assert.match(view, /setWorkflowRunNextButtonHidden\(isFinalStep\)/);
  assert.match(view, /if \(isFinalStep\) \{\s*els\.workflowNextStepBtn\.disabled = true;/);
  assert.match(css(), /\.hidden\s*\{\s*display:\s*none;/);
});

test("R3: final step shows Continue to Authoring below result/status area", () => {
  const { source } = loadPrismTestApi();
  const markup = html();
  const createBody = createStepFnBody(source);
  const buttons = buttonsCluster(markup);
  assert.doesNotMatch(buttons, /id="workflowContinueToAuthoringBtn"/);
  assert.match(markup, /id="workflowRunContinueHost"/);
  assert.match(markup, /id="workflowContinueToAuthoringBtn"/);
  assert.match(createBody, /data-role", "run-step-continue"/);
  const statusIdx = createBody.indexOf('data-role", "run-step-output-status"');
  const continueIdx = createBody.indexOf('li.appendChild(runContinue)');
  const notesIdx = createBody.indexOf("li.appendChild(userNotesWrap)");
  assert.ok(statusIdx > 0 && notesIdx > statusIdx, "status lives in paste wrap");
  assert.ok(continueIdx > notesIdx, "Continue host is after paste/status wrap");
  assert.match(source, /continueTarget\.appendChild\(els\.workflowRunContinueHost\)/);
  assert.match(css(), /\.workflow-detail\.run-mode\s+\.workflow-step-run-continue\s*\{[\s\S]*display:\s*block/);
  assert.doesNotMatch(css(), /\.workflow-step-run-continue[\s\S]{0,200}position:\s*absolute/);
});

test("R4: incomplete final step → CTA unavailable/disabled", () => {
  const { api, source } = loadPrismTestApi();
  const view = updateRunViewBody(source);
  const step = designPageStep("s8");
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(step, "s8", {}, null, 7, 8), false);
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(step, "s8", {}, null), false);
  assert.match(view, /els\.workflowContinueToAuthoringBtn\.disabled = !continueEnabled/);
});

test("R5: complete final step → CTA enabled", () => {
  const { api } = loadPrismTestApi();
  const step = designPageStep("s8");
  api.setWorkflowRunCapturedOutputsForTest({
    s8: JSON.stringify({ artifact_type: "page", schema_version: "2.0.0" })
  });
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(step, "s8", {}, null), true);
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(step, "s8", {}, null, 7, 8), true);
});

test("R6: enabled CTA invokes canonical Continue-to-Authoring transition", () => {
  const { source } = loadPrismTestApi();
  const handler = continueHandlerBody(source);
  assert.match(
    source,
    /workflowContinueToAuthoringBtn\.addEventListener\("click", handleContinueToAuthoring\)/
  );
  assert.match(handler, /isWorkflowRunContinueToAuthoringEnabled\(/);
  assert.match(handler, /switchTab\("utilities"\)/);
  assert.match(handler, /refreshUtilitiesWorkflowContextUI\(\)/);
  assert.doesNotMatch(handler, /selectedWorkflowId\s*=\s*null/);
  assert.doesNotMatch(handler, /clearWorkflowRunCaptureState/);
});

test("R7: Previous still works on the final step", () => {
  const { source } = loadPrismTestApi();
  const view = updateRunViewBody(source);
  const markup = html();
  assert.match(buttonsCluster(markup), /id="workflowPrevStepBtn"/);
  assert.match(view, /els\.workflowPrevStepBtn\.disabled\s*=\s*idx\s*===\s*0/);
  assert.doesNotMatch(view, /workflowPrevStepBtn\.disabled\s*=\s*isFinalStep/);
  assert.match(source, /els\.workflowPrevStepBtn\.addEventListener\("click"/);
});

test("R8: workflows with different step counts still identify the final step", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.isWorkflowRunAtFinalStep(7, 8), true);
  assert.equal(api.isWorkflowRunAtFinalStep(6, 8), false);
  assert.equal(api.isWorkflowRunAtFinalStep(2, 3), true);
  assert.equal(api.isWorkflowRunAtFinalStep(1, 3), false);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 1), true);
  assert.equal(api.isWorkflowRunAtFinalStep(4, 5), true);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 0), false);
  const step = designPageStep("last");
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(step, "last", {}, null, 2, 3), false);
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(step, "last", {}, null, 1, 3), false);
  api.setWorkflowRunCapturedOutputsForTest({
    last: JSON.stringify({ artifact_type: "page", schema_version: "2.0.0" })
  });
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(step, "last", {}, null, 2, 3), true);
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(step, "last", {}, null, 1, 3), false);
});

test("R9: GAM verification sub-phase/navigation behaviour is unaffected", () => {
  const { source } = loadPrismTestApi();
  const createBody = createStepFnBody(source);
  assert.match(source, /function isGamMaterialGenerationStep\s*\(/);
  assert.match(createBody, /data-role", "run-step-suitability-review-wrap"/);
  assert.match(
    createBody,
    /if \(isWorkflowStepGenerateActivityMaterials\(buildWorkflowStepRecognitionContext\(step, \{\}\)\)\) \{\s*li\.appendChild\(suitabilityWrap\);/
  );
  assert.match(source, /gamMaterialsVerificationBlocksAdvance\(/);
});

test("R10: DLA/GAM intermediate workflow completion is unaffected", () => {
  const { api, source } = loadPrismTestApi();
  const view = updateRunViewBody(source);
  const dla = dlaStep("dla_step");
  assert.equal(api.isWorkflowRunContinueToAuthoringEnabled(dla, "dla_step", {}, null, 4, 8), false);
  assert.equal(
    api.resolveWorkflowRunNextStepDisabledReason(dla, "dla_step", {}, null, 4, 8),
    "Paste a valid result for this step before continuing."
  );
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify({ artifact_type: "page", schema_version: "2.0.0" })
  });
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(dla, "dla_step", {}, null), true);
  assert.equal(api.resolveWorkflowRunNextStepDisabledReason(dla, "dla_step", {}, null, 4, 8), "");
  assert.equal(api.resolveWorkflowRunNextStepDisabledReason(dla, "dla_step", {}, null, 7, 8), "This is the final step.");
  assert.match(view, /if \(isFinalStep\) \{/);
  assert.doesNotMatch(view, /isWorkflowRunAuthoringReady\(state\.selectedWorkflowId/);
  assert.match(source, /function isWorkflowRunAuthoringReady\s*\(/);
});

test("Continue button remains a named, non-absolutely-positioned control", () => {
  const markup = html();
  const styles = css();
  assert.match(markup, /aria-label="Continue to Authoring"/);
  assert.match(markup, /type="button"/);
  assert.match(styles, /\.workflow-step-run-continue\s*\{[\s\S]*margin:\s*12px 0 0;/);
  assert.doesNotMatch(styles, /#workflowContinueToAuthoringBtn[\s\S]{0,120}position:\s*absolute/);
});
