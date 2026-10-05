/**
 * Sprint 56 DLA-05 — SSOT rationalisation guards (emitted DLA Copy prompt).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const RNA_HCV_BRIEF = {
  goal:
    "Create a self-directed learning page on RNA virus genome organisation, replication, HCV mechanisms, and transmission strategies.",
  inputs: "Undergraduate biomedical students (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const SPRINT_56_BASELINE_CHARS = 49949;
/** DLA-07 core ~31,769; post-stabilisation target ≤32k — see SPRINT-56-DLA-STABILISATION-PASS.md */
const SPRINT_56_TARGET_MAX_CHARS = 36000;

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function extractDlaPromptFactory(md) {
  const sectionIdx = md.indexOf("## 5. Design Learning Activities");
  const fence = md.indexOf("```json", md.indexOf("### Prompt Factory", sectionIdx));
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function emitRnaHcvDlaCorePrompt(api) {
  const ldBriefConfig = api.normalizeWorkflowBriefConfig(
    extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
  );
  const explicit = api.extractWorkflowBriefExplicitFactors(RNA_HCV_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    RNA_HCV_BRIEF.goal,
    RNA_HCV_BRIEF.inputs
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    RNA_HCV_BRIEF
  ).resolved;
  const wf = {
    goal: RNA_HCV_BRIEF.goal,
    desiredOutputs: RNA_HCV_BRIEF.desiredOutputs,
    workflowOutputs: ["Learner-facing page"],
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const step = {
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities"
  };
  const dlaPromptFactory = extractDlaPromptFactory(fs.readFileSync(ldPatternsPath, "utf8"));
  const seeded = api.buildSeededStepPromptForWorkflowStep({
    workflowGoal: RNA_HCV_BRIEF.goal,
    workflowOutputs: wf.workflowOutputs,
    workflowOutputSpec: { goal: RNA_HCV_BRIEF.goal, desiredOutputs: RNA_HCV_BRIEF.desiredOutputs },
    step,
    matchedPattern: { promptFactory: dlaPromptFactory }
  });
  return api.applyWorkflowStepRuntimePromptAugmentations(seeded, step, wf, {});
}

function countMarker(prompt, marker) {
  const re = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return (prompt.match(re) || []).length;
}

test("Sprint 56 DLA-05: emitted core prompt within ≤32k budget", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.ok(
    prompt.length <= SPRINT_56_TARGET_MAX_CHARS,
    `expected ≤${SPRINT_56_TARGET_MAX_CHARS} chars, got ${prompt.length} (baseline ${SPRINT_56_BASELINE_CHARS})`
  );
});

test("Sprint 56 DLA-05: deprecated scaffold authorities absent from DLA prompt", () => {
  const api = loadPrismTestApi();
  const prompt = emitRnaHcvDlaCorePrompt(api);
  assert.doesNotMatch(prompt, /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-COGNITION-ORIENTATION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /Learner-page activity framing \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /PRE-EMIT CHECKLIST \(before returning activities JSON\)/i);
});

test("Sprint 56 DLA-05: lib FIELD_WORD_RANGES aligned to SSOT", () => {
  const sandbox = {};
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, ["lib/ld-guided-learning-scaffold.js"]);
  const ranges = sandbox.PRISM_LD_GUIDED_LEARNING_SCAFFOLD.FIELD_WORD_RANGES;
  assert.equal(ranges.self_explanation_prompt.min, 35);
  assert.equal(ranges.transfer_or_application_task.min, 35);
  assert.equal(ranges.transfer_or_application_task.max, 80);
});
