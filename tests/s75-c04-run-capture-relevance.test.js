/**
 * Sprint 75 — C-04 Run capture relevance (S75-D07).
 *
 * Paste/capture UI only for page-structure producers.
 * Empty Instructions hidden in Run. C-03 compact one-line guidance.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");

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

function pageEnrichmentWf(steps) {
  return {
    id: "wf-c04",
    name: "C04 LD",
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: steps || []
  };
}

function step(partial) {
  return Object.assign(
    {
      id: "s-" + Math.random().toString(16).slice(2, 8),
      prompt_source_type: "local_override",
      override_prompt_body: "Body",
      inputBindings: []
    },
    partial
  );
}

test("C-04 visibility: early LD steps are not page-structure producers", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([]);
  const early = [
    step({ title: "Normalize Content", canonical_step_id: "step_normalize_content", outputName: "normalized_content" }),
    step({ title: "Generate Learning Content", canonical_step_id: "step_generate_learning_content", outputName: "learning_content" }),
    step({ title: "Model Knowledge", canonical_step_id: "step_model_knowledge", outputName: "knowledge_model" }),
    step({ title: "Define Learning Outcomes", canonical_step_id: "step_define_learning_outcomes", outputName: "learning_outcomes" })
  ];
  early.forEach((s) => {
    assert.equal(api.isWorkflowStepPageStructureProducer(s, wf), false, s.title);
    assert.equal(api.workflowStepProducesStoredArtefact(s, wf), true, s.title + " can still store");
  });
});

test("C-04 visibility: page pipeline steps are page-structure producers", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([]);
  const pipeline = [
    step({ title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan", outputName: "page" }),
    step({ title: "Design Learning Activities", canonical_step_id: "step_design_learning_activities", outputName: "page" }),
    step({ title: "Generate Activity Materials", canonical_step_id: "step_generate_activity_materials", outputName: "page" }),
    step({ title: "Construct Learning Sequence", canonical_step_id: "step_construct_learning_sequence", outputName: "page" }),
    step({ title: "Design Assessment", canonical_step_id: "step_design_assessment", outputName: "page" }),
    step({ title: "Generate Assessment Items", canonical_step_id: "step_generate_assessment_items", outputName: "page" }),
    step({ title: "Design Page", canonical_step_id: "step_design_page", outputName: "page" })
  ];
  pipeline.forEach((s) => {
    assert.equal(api.isWorkflowStepPageStructureProducer(s, wf), true, s.title);
  });
});

test("Define Learning Outcomes: Next remains available without capture", () => {
  const { api } = loadPrismTestApi();
  const lo = step({
    id: "lo1",
    title: "Define Learning Outcomes",
    canonical_step_id: "step_define_learning_outcomes",
    outputName: "learning_outcomes"
  });
  const wf = pageEnrichmentWf([lo]);
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(lo, "lo1", wf, null), true);
  assert.equal(api.resolveWorkflowRunNextStepDisabledReason(lo, "lo1", wf, null, 0, 2), "");
});

test("Design Episode Plan: capture gate preserved", () => {
  const { api } = loadPrismTestApi();
  const ep = step({
    id: "ep1",
    title: "Design Episode Plan",
    canonical_step_id: "step_design_episode_plan",
    outputName: "page"
  });
  const wf = pageEnrichmentWf([ep]);
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(ep, "ep1", wf, null), false);
  assert.match(
    api.resolveWorkflowRunNextStepDisabledReason(ep, "ep1", wf, null, 0, 2),
    /Paste a valid result/
  );
});

test("custom non-page outputName is not a page-structure producer; custom page is", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([]);
  const report = step({ title: "Custom Report", canonical_step_id: "", outputName: "report" });
  const pageCustom = step({ title: "Custom Page Step", canonical_step_id: "", outputName: "page" });
  assert.equal(api.isWorkflowStepPageStructureProducer(report, wf), false);
  assert.equal(api.workflowStepProducesStoredArtefact(report, wf), true);
  assert.equal(api.isWorkflowStepPageStructureProducer(pageCustom, wf), true);
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(pageCustom, pageCustom.id, wf, null), false);
});

test("Run UI uses page-structure producer for paste visibility, not can-store predicate", () => {
  const { source } = loadPrismTestApi();
  assert.match(
    source,
    /shouldShowRunOutput\s*=\s*[\s\S]*?isWorkflowStepPageStructureProducer\(stepForRun/
  );
  assert.doesNotMatch(
    source,
    /shouldShowRunOutput\s*=\s*isRun\s*&&\s*workflowStepProducesStoredArtefact/
  );
  assert.match(source, /Paste the result back into PRISM/);
  assert.doesNotMatch(
    source,
    /Paste this step's generated artefact into Step output\. PRISM stores step outputs/
  );
});

test("runner summary uses Run-only descriptions without paste duplication", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([]);
  const glc = step({
    title: "Generate Learning Content",
    canonical_step_id: "step_generate_learning_content",
    outputName: "learning_content"
  });
  const ep = step({
    title: "Design Episode Plan",
    canonical_step_id: "step_design_episode_plan",
    outputName: "page"
  });
  const earlySummary = api.buildWorkflowStepRunSummaryText(glc, wf, true);
  const epSummary = api.buildWorkflowStepRunSummaryText(ep, wf, true);
  assert.match(earlySummary, /Creates learning content from your topic or source material/);
  assert.match(epSummary, /Creates a structured learning plan from the learning outcomes/);
  assert.doesNotMatch(earlySummary, /Paste the result back into PRISM/i);
  assert.doesNotMatch(epSummary, /Paste the result back into PRISM/i);
  assert.doesNotMatch(epSummary, /pipeline|vNext|Sprint 56/i);
});

test("empty Instructions hidden in Run; meaningful notes preserved as read-only prose", () => {
  const { source } = loadPrismTestApi();
  assert.match(source, /showRunInstructions\s*=\s*isRun\s*&&\s*!!notesMeaningful/);
  assert.match(source, /notesAreaEl\.classList\.toggle\("hidden",\s*isRun\)/);
  assert.match(source, /data-role="run-instructions-prose"/);
});

test("C-03 compact one-line wording; not duplicated as per-step paste instruction", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const start = html.indexOf('id="workflowRunOrientation"');
  const block = html.slice(start, start + 700);
  assert.match(
    block,
    /Start a fresh AI chat for this workflow run\. Copy each step into the same chat and\s+work through the steps in order\. Paste results back into PRISM only when the step\s+asks you to\./
  );
  assert.doesNotMatch(block, /workflow-run-orientation-note/);
  assert.equal((block.match(/<p\b/g) || []).length, 1);
});
