/**
 * Sprint 75 — C-03 persistent lightweight Run execution orientation (S75-D06).
 *
 * Presentation only: teaches fresh AI chat per workflow run + same chat across steps.
 * No first-use state, dismiss, prompt, or capture changes.
 */

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

function orientationBlockFromHtml(html) {
  const start = html.indexOf('id="workflowRunOrientation"');
  assert.ok(start > 0, "Expected #workflowRunOrientation in index.html");
  const slice = html.slice(start, start + 900);
  return slice;
}

test("Run orientation exists in markup with required wording", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const block = orientationBlockFromHtml(html);
  assert.match(block, /Start a fresh AI chat for this workflow run/i);
  assert.match(block, /Copy each step into the same chat/i);
  assert.match(block, /work through the steps in order/i);
  assert.match(block, /Paste results back into PRISM only when the step\s+asks you to/i);
  assert.doesNotMatch(block, /\bCopilot\b/);
  assert.doesNotMatch(block, /\bChatGPT\b/);
  assert.doesNotMatch(block, /new chat for each step/i);
  assert.doesNotMatch(block, /every step.*paste/i);
  assert.doesNotMatch(block, /always paste/i);
  assert.equal((block.match(/<p\b/g) || []).length, 1);
});

test("orientation is CSS-visible in Run mode only (not Edit/Settings primary)", () => {
  const css = fs.readFileSync(styleCssPath, "utf8");
  assert.match(css, /\.workflow-run-orientation\s*\{[\s\S]*?display:\s*none/);
  assert.match(
    css,
    /\.workflow-detail\.run-mode\s+\.workflow-run-orientation\s*\{[\s\S]*?display:\s*block/
  );
  // Verbose workflow-run-summary dump stays hidden in Run mode.
  assert.match(
    css,
    /\.workflow-detail\.run-mode\s+\.workflow-run-summary[\s\S]*?display:\s*none/
  );
  // Settings hides the steps section that hosts orientation.
  assert.match(
    css,
    /\.workflow-detail\.settings-mode[\s\S]*?\.workflow-steps-section\s*\{[\s\S]*?display:\s*none/
  );
});

test("orientation sits in steps section before step list (before Copy interaction)", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const stepsSection = html.indexOf('class="workflow-steps-section"');
  const orientation = html.indexOf('id="workflowRunOrientation"');
  const stepsList = html.indexOf('id="workflowSteps"');
  assert.ok(stepsSection > 0 && orientation > stepsSection);
  assert.ok(orientation < stepsList);
});

test("Copy payload generation path unchanged (buildWorkflowStepInstructions still used)", () => {
  const { source } = loadPrismTestApi();
  assert.match(source, /textToCopy = buildWorkflowStepInstructions\(/);
  assert.match(source, /function buildWorkflowStepInstructions\s*\(/);
  assert.match(source, /showToast\("Step instructions copied to clipboard\."/);
});

test("Run capture / Next gating helpers remain available and unchanged in role", () => {
  const { api, source } = loadPrismTestApi();
  assert.equal(typeof api.resolveWorkflowRunNextStepDisabledReason, "function");
  assert.equal(typeof api.workflowStepProducesStoredArtefact, "function");
  assert.match(source, /function isWorkflowRunStepCaptureReadyForAdvance\s*\(/);
  assert.match(source, /Paste a valid result for this step before continuing/);
});

test("Continue to Authoring from S75-D04 remains unchanged", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="workflowContinueToAuthoringBtn"/);
  assert.match(html, /Continue to Authoring/);
  const { api, source } = loadPrismTestApi();
  assert.equal(api.isWorkflowRunAtFinalStep(2, 3), true);
  assert.match(source, /function handleContinueToAuthoring\s*\(/);
  assert.match(source, /switchTab\("utilities"\)/);
});

test("no C-03 onboarding persistence / dismiss controls introduced", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const block = orientationBlockFromHtml(html);
  assert.doesNotMatch(block, /dismiss|don't show|do not show|got it|acknowledge/i);
  const { source } = loadPrismTestApi();
  assert.doesNotMatch(source, /workflowRunOrientationDismiss|firstRunOrientation|runOrientationSeen/i);
});

test("custom/generic Run shell still hosts orientation without replacing Instructions", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="workflowRunOrientation"/);
  const { source } = loadPrismTestApi();
  assert.match(source, /textContent = "Instructions"/);
  assert.match(source, /placeholder = "Guidance for running this step"/);
});
