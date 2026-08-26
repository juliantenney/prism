/**
 * S72 — DLA optional evidence upload guidance (run-mode step instruction).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const patternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const OPTIONAL_EVIDENCE_GUIDANCE =
  "Optional: If you want the activities in this resource to use specific evidence or source material, upload it with this prompt.";

const OLD_GUIDANCE = "attach them when running this prompt in Copilot";

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function extractDlaRunnerInstructions(md) {
  const sectionIdx = md.indexOf("## 5. Design Learning Activities");
  assert.ok(sectionIdx !== -1);
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", sectionIdx));
  const close = md.indexOf("```", fence + 7);
  const block = JSON.parse(md.slice(fence + 7, close).trim());
  return block.runnerInstructions;
}

function seedDlaCatalog(api) {
  api.setWorkflowStepPatternCatalogForTest([
    {
      title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities",
      promptFactory: {
        runnerInstructions: {
          what_this_step_does:
            "This step designs runnable learning activities linked directly to outcomes.",
          what_to_expect: OPTIONAL_EVIDENCE_GUIDANCE,
          what_to_check:
            "Activities that require supporting evidence set evidence_decision.required true with inspectable providers distinct from teaching text."
        }
      }
    }
  ]);
}

const dlaStep = {
  title: "Design Learning Activities",
  canonical_step_id: "step_design_learning_activities",
  outputName: "page"
};

test("Run guidance text for DLA uses the short optional evidence instruction", () => {
  const api = loadPrismTestApi();
  seedDlaCatalog(api);
  const text = api.getWorkflowRunStepGuidanceTextForTest(dlaStep);
  assert.equal(text, OPTIONAL_EVIDENCE_GUIDANCE);
});

test("domain pack: DLA runnerInstructions.what_to_expect advertises optional evidence upload", () => {
  const ri = extractDlaRunnerInstructions(fs.readFileSync(patternsPath, "utf8"));
  assert.match(String(ri.what_to_expect || ""), /Optional: Upload subject-specific evidence/i);
  assert.match(String(ri.what_to_expect || ""), /clearly identified simulated examples \(default\)/i);
  assert.doesNotMatch(String(ri.what_to_expect || ""), new RegExp(OLD_GUIDANCE, "i"));
});

test("non-DLA step does not get DLA-specific run guidance", () => {
  const api = loadPrismTestApi();
  const step = {
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials",
    outputName: "page"
  };
  const text = api.getWorkflowRunStepGuidanceTextForTest(step);
  assert.equal(text, "");
});

test("buildWorkflowStepRunSummaryText: DLA run summary is operator-facing (no evidence/paste dump)", () => {
  const api = loadPrismTestApi();
  seedDlaCatalog(api);
  const wf = { pageEnrichmentV2: true, partialPageOutputs: true };
  const summary = api.buildWorkflowStepRunSummaryText(dlaStep, wf, true);
  assert.equal(summary, "Designs the learning activities for this resource.");
  assert.doesNotMatch(summary, /Optional: Upload subject-specific evidence/i);
  assert.doesNotMatch(summary, /Paste the result back into PRISM/i);
  assert.doesNotMatch(summary, /Sprint|vNext|pipeline/i);
});

test("buildWorkflowStepRunSummaryText: non-DLA step does not include optional evidence guidance", () => {
  const api = loadPrismTestApi();
  api.setWorkflowStepPatternCatalogForTest([
    {
      title: "Generate Activity Materials",
      canonical_step_id: "step_generate_activity_materials",
      promptFactory: {
        runnerInstructions: {
          what_this_step_does: "Generate materials for activities.",
          what_to_expect: "Materials bodies for each required_materials row.",
          what_to_check: "Every required material is populated."
        }
      }
    }
  ]);
  const step = {
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials",
    outputName: "page"
  };
  const summary = api.buildWorkflowStepRunSummaryText(step, {}, true);
  assert.doesNotMatch(summary, /Optional: Upload subject-specific evidence/i);
});

test("buildWorkflowStepInstructions: Copilot copy still includes What to expect for DLA unchanged", () => {
  const api = loadPrismTestApi();
  seedDlaCatalog(api);
  api.setWorkflowsForTest([
    {
      id: "wf-dla",
      name: "DLA test",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      steps: [dlaStep]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-dla");
  const instr = api.buildWorkflowStepInstructions(dlaStep, 0, null);
  assert.match(
    instr,
    /What to expect: Optional: If you want the activities in this resource to use specific evidence or source material, upload it with this prompt\./i
  );
  assert.equal(
    (
      instr.match(
        /Optional: If you want the activities in this resource to use specific evidence or source material, upload it with this prompt\./g
      ) || []
    ).length,
    1
  );
});
