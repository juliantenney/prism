/**
 * Sprint 75 — Run UX simplification (S75-D08).
 *
 * Run-only descriptions, read-only Instructions prose, top execution bar,
 * simplified paste placeholder, friendly gating copy.
 * Pack runnerInstructions / Copy payload unchanged.
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

const CANONICAL_DESCRIPTIONS = {
  step_normalize_content: "Cleans and organises your source material for later steps.",
  step_generate_learning_content: "Creates learning content from your topic or source material.",
  step_model_knowledge: "Organises the key concepts and relationships in the content.",
  step_define_learning_outcomes: "Defines clear learning outcomes for the resource.",
  step_design_episode_plan: "Creates a structured learning plan from the learning outcomes.",
  step_design_learning_activities: "Designs the learning activities for this resource.",
  step_generate_activity_materials: "Creates the learning materials for each activity.",
  step_construct_learning_sequence: "Orders the activities into a clear learning sequence.",
  step_design_page: "Adds the learner-facing page title and framing text.",
  step_design_assessment: "Plans how learning will be assessed.",
  step_generate_assessment_items: "Creates the assessment questions or items."
};

test("A: canonical LD steps receive simple Run-only descriptions", () => {
  const { api } = loadPrismTestApi();
  Object.keys(CANONICAL_DESCRIPTIONS).forEach((id) => {
    const step = { title: id, canonical_step_id: id };
    assert.equal(api.getWorkflowRunUiStepDescription(step), CANONICAL_DESCRIPTIONS[id]);
    assert.equal(api.buildWorkflowStepRunSummaryText(step, {}, true), CANONICAL_DESCRIPTIONS[id]);
  });
});

test("B: representative Run descriptions omit Sprint/vNext/pipeline leakage", () => {
  const { api } = loadPrismTestApi();
  const leak = /Sprint\s*56|vNext|V1|page shell|pipeline|downstream|deterministic|partial page|artefact|artifact|schema|contract/i;
  Object.keys(CANONICAL_DESCRIPTIONS).forEach((id) => {
    const text = api.buildWorkflowStepRunSummaryText({ canonical_step_id: id }, {}, true);
    assert.doesNotMatch(text, leak, id);
  });
  assert.doesNotMatch(
    api.buildWorkflowStepRunSummaryText(
      { title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan" },
      { workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true } },
      true
    ),
    /Paste the result back into PRISM/i
  );
});

test("C: copied prompt still receives existing runner guidance unchanged", () => {
  const { api } = loadPrismTestApi();
  const technical =
    "This step derives the Sprint 56F vNext page shell and frozen Episode Plan V1 from learning outcomes for downstream enrichment.";
  api.setWorkflowStepPatternCatalogForTest([
    {
      title: "Design Episode Plan",
      canonical_step_id: "step_design_episode_plan",
      promptFactory: {
        runnerInstructions: { what_this_step_does: technical }
      }
    }
  ]);
  api.setWorkflowsForTest([
    {
      id: "wf-ep",
      name: "EP",
      steps: [
        {
          id: "ep1",
          title: "Design Episode Plan",
          canonical_step_id: "step_design_episode_plan",
          outputName: "page",
          prompt_source_type: "local_override",
          override_prompt_body: "EP body"
        }
      ]
    }
  ]);
  const copied = api.buildWorkflowStepInstructions(
    {
      id: "ep1",
      title: "Design Episode Plan",
      canonical_step_id: "step_design_episode_plan",
      outputName: "page",
      prompt_source_type: "local_override",
      override_prompt_body: "EP body"
    },
    null
  );
  assert.match(copied, /Runner guidance:/);
  assert.match(copied, /Sprint 56F vNext page shell/);
  assert.equal(
    api.getRunnerInstructionsForStepForTest({
      title: "Design Episode Plan",
      canonical_step_id: "step_design_episode_plan"
    }).what_this_step_does,
    technical
  );
  assert.equal(
    api.buildWorkflowStepRunSummaryText(
      { title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan" },
      {},
      true
    ),
    CANONICAL_DESCRIPTIONS.step_design_episode_plan
  );
});

test("D/E/F/G: Instructions prose rules in Run (source contract)", () => {
  const { source } = loadPrismTestApi();
  assert.match(source, /data-role="run-instructions-prose"/);
  assert.match(source, /showRunInstructions\s*=\s*isRun\s*&&\s*!!notesMeaningful/);
  assert.match(source, /notesAreaEl\.classList\.toggle\("hidden",\s*isRun\)/);
  assert.match(source, /instructionsLabelEl\.classList\.toggle\("hidden",\s*isRun\)/);
  assert.match(source, /runInstructionsProseEl\.textContent\s*=\s*notesMeaningful/);
  assert.match(source, /stripWorkflowStepParamBlock/);
  assert.doesNotMatch(source, /PRISM_STEP_PARAMS.*run-instructions-prose/);
});

test("H/J: paste visibility and simplified placeholder", () => {
  const { source } = loadPrismTestApi();
  assert.match(
    source,
    /shouldShowRunOutput\s*=\s*[\s\S]*?isWorkflowStepPageStructureProducer\(stepForRun/
  );
  assert.match(source, /Paste the result from your AI chat here\./);
  assert.doesNotMatch(
    source,
    /Paste the structured page result here\. Raw JSON is accepted/
  );
  assert.doesNotMatch(source, /learner-resource pipeline/);
  assert.doesNotMatch(source, /Paste this step's partial page update/);
});

test("I: capture gating helpers still block page producers without capture", () => {
  const { api } = loadPrismTestApi();
  const ep = {
    id: "ep1",
    title: "Design Episode Plan",
    canonical_step_id: "step_design_episode_plan",
    outputName: "page"
  };
  const wf = {
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: [ep]
  };
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(ep, "ep1", wf, null), false);
  assert.match(
    api.resolveWorkflowRunNextStepDisabledReason(ep, "ep1", wf, null, 0, 2),
    /Paste a valid result for this step before continuing/
  );
});

test("K/L: one Step N of M heading; Prev/Copy/Next share top bar", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const css = fs.readFileSync(styleCssPath, "utf8");
  const controlsStart = html.indexOf('class="workflow-run-controls"');
  const stepsList = html.indexOf('id="workflowSteps"');
  const copyBar = html.indexOf('id="workflowRunCopyBtn"');
  const prev = html.indexOf('id="workflowPrevStepBtn"');
  const next = html.indexOf('id="workflowNextStepBtn"');
  assert.ok(controlsStart > 0 && controlsStart < stepsList, "controls above step list");
  assert.ok(prev > controlsStart && copyBar > prev && next > copyBar && next < stepsList);
  assert.match(html, /id="workflowRunStatus"/);
  assert.equal((html.match(/id="workflowPrevStepBtn"/g) || []).length, 1);
  assert.equal((html.match(/id="workflowNextStepBtn"/g) || []).length, 1);
  assert.equal((html.match(/id="workflowRunCopyBtn"/g) || []).length, 1);
  assert.match(css, /\.workflow-detail\.run-mode\s+\.workflow-step-header\s*\{[\s\S]*?display:\s*none/);
  const { source } = loadPrismTestApi();
  assert.match(
    source,
    /"Step "\s*\+\s*displayIndex\s*\+\s*" of "\s*\+\s*displayTotal\s*\+\s*" \\u2014 "/
  );
});

test("M/N/O: first-step Previous, gated Next, Continue to Authoring preserved", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const { api, source } = loadPrismTestApi();
  assert.match(source, /els\.workflowPrevStepBtn\.disabled\s*=\s*idx\s*===\s*0/);
  assert.match(source, /resolveWorkflowRunNextStepDisabledReason\(/);
  assert.match(html, /Continue to Authoring/);
  assert.equal(api.isWorkflowRunAtFinalStep(7, 8), true);
  assert.equal(api.isWorkflowRunAtFinalStep(0, 8), false);
});

test("P: custom workflows get safe non-technical fallback", () => {
  const { api } = loadPrismTestApi();
  assert.equal(
    api.getWorkflowRunUiStepDescription({ title: "Write Board Report", roleLabel: "" }),
    "Complete \u201cWrite Board Report\u201d."
  );
  assert.equal(
    api.getWorkflowRunUiStepDescription({
      title: "Custom",
      roleLabel: "Summarise findings for the board"
    }),
    "Summarise findings for the board"
  );
  assert.doesNotMatch(
    api.getWorkflowRunUiStepDescription({ title: "Odd Step", roleLabel: "" }),
    /workflow artefacts|pipeline|downstream/i
  );
});

test("Q: Edit Instructions editing path still uses notes textarea (source)", () => {
  const { source } = loadPrismTestApi();
  assert.match(source, /data-field="notes"/);
  assert.match(source, /Guidance for running this step/);
  assert.match(source, /instructionsLabelEl\.textContent\s*=\s*"Instructions"/);
});
