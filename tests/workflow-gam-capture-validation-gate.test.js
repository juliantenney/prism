/**
 * Sprint 44 Slice 1 — tiered GAM capture validation gate (workflow run-mode).
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
const marxProceduralDlaPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief",
  "marx-dla-procedural-output.json"
);
const gamMarxLeakPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief",
  "gam-marx-facilitator-leak.txt"
);

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const FACILITATOR_ONLY_BRIEF = {
  goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
  inputs: "Face-to-face classroom with tutor facilitation",
  desiredOutputs: "Facilitator guide and slide deck",
  selectedDomains: ["learning-design"]
};

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
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

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function resolveBrief(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, inferred, brief)
    .resolved;
}

function marxGamContext(resolved) {
  const factors = Object.assign({}, resolved);
  factors.delivery_context = "self_directed";
  factors.session_materials = ["page"];
  return {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: factors }
  };
}

function setupMarxWorkflowWithDlaCapture() {
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  api.setWorkflowsForTest([
    {
      id: "wf-marx-gam-gate",
      steps: [
        {
          id: "dla-step",
          title: "Design Learning Activities",
          canonical_step_id: "step_design_learning_activities",
          outputName: "learning_activities"
        },
        {
          id: "gam-step",
          title: "Generate Activity Materials",
          canonical_step_id: "step_generate_activity_materials",
          outputName: "activity_materials"
        }
      ]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-marx-gam-gate");
  api.setWorkflowRunCapturedOutputsForTest({
    "dla-step": JSON.stringify(procedural, null, 2)
  });
  return procedural;
}

const VALID_TWO_MATERIAL_PACK =
  "Activity: A1\nActivity ID: A1\n\n" +
  "Material: M1 (template)\nPurpose: Timeline scaffold\nContent:\n" +
  "A".repeat(120) +
  "\n---\n" +
  "Activity: A2\nActivity ID: A2\n\n" +
  "Material: M2 (text)\nPurpose: Orienting extracts\nContent:\n" +
  "B".repeat(120) +
  "\n---\n";

test("scope: self-directed learner-page GAM context runs validation", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  assert.equal(api.isWorkflowStepGenerateActivityMaterials(ctx), true);
  assert.equal(api.shouldSanitizeSelfDirectedGamMaterialsOutput(ctx), true);
});

test("scope: facilitator-only brief skips GAM capture validation", () => {
  const resolved = resolveBrief(FACILITATOR_ONLY_BRIEF);
  const ctx = {
    workflowGoal: FACILITATOR_ONLY_BRIEF.goal,
    desiredOutputs: FACILITATOR_ONLY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  assert.equal(api.shouldSanitizeSelfDirectedGamMaterialsOutput(ctx), false);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.applyGamPackTextValidationToCapture('{"pack":{"activities":[]}}', ctx, "gam-step", '{"pack":{}}');
  assert.equal(api.getWorkflowRunGamFormatValidationForTest("gam-step"), "");
});

test("applyGamPackTextValidationToCapture: JSON stub sets blocking validation", () => {
  setupMarxWorkflowWithDlaCapture();
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  const stub = JSON.stringify({ pack: { activities: [{ activity_id: "A1" }] } });
  api.applyGamPackTextValidationToCapture(stub, ctx, "gam-step", stub);
  assert.match(api.getWorkflowRunGamFormatValidationForTest("gam-step"), /GAM-FMT-01/);
});

test("applyGamPackTextValidationToCapture: JSON stub clears step completed", () => {
  setupMarxWorkflowWithDlaCapture();
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  const stub = JSON.stringify({ pack: { activities: [{ activity_id: "A1" }] } });
  api.setWorkflowRunStepCompletedForTest({ "gam-step": true });
  assert.equal(api.isWorkflowRunStepCompletedForTest("gam-step"), true);
  api.applyGamPackTextValidationToCapture(stub, ctx, "gam-step", stub);
  assert.equal(api.isWorkflowRunStepCompletedForTest("gam-step"), false);
  assert.match(api.getWorkflowRunGamFormatValidationForTest("gam-step"), /GAM-FMT-01/);
});

test("applyGamPackTextValidationToCapture: thin bodies set warnings only", () => {
  setupMarxWorkflowWithDlaCapture();
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  const thinOnly =
    "Activity: A1\nActivity ID: A1\n\nMaterial: M1 (checklist)\nPurpose: check\nContent:\nShort\n---\n" +
    "Activity: A2\nActivity ID: A2\n\nMaterial: M2 (checklist)\nPurpose: check\nContent:\nAlso short\n---\n";
  api.applyGamPackTextValidationToCapture(thinOnly, ctx, "gam-step", thinOnly);
  assert.equal(api.getWorkflowRunGamFormatValidationForTest("gam-step"), "");
  assert.match(api.getWorkflowRunGamFormatWarningsForTest("gam-step"), /GAM-FMT-04/);
});

test("applyGamPackTextValidationToCapture: valid upstream coverage passes", () => {
  setupMarxWorkflowWithDlaCapture();
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  api.applyGamPackTextValidationToCapture(VALID_TWO_MATERIAL_PACK, ctx, "gam-step", VALID_TWO_MATERIAL_PACK);
  assert.equal(api.getWorkflowRunGamFormatValidationForTest("gam-step"), "");
  assert.equal(api.getWorkflowRunGamFormatWarningsForTest("gam-step"), "");
});

test("applyGamPackTextValidationToCapture: empty capture clears validation slots", () => {
  setupMarxWorkflowWithDlaCapture();
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  api.applyGamPackTextValidationToCapture("", ctx, "gam-step", "");
  assert.equal(api.getWorkflowRunGamFormatValidationForTest("gam-step"), "");
  assert.equal(api.getWorkflowRunGamFormatWarningsForTest("gam-step"), "");
});

test("sanitize-before-validate: validator receives sanitized text without facilitator blocks", () => {
  setupMarxWorkflowWithDlaCapture();
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxGamContext(resolved);
  const raw = fs.readFileSync(gamMarxLeakPath, "utf8");
  const sanitized = api.sanitizeSelfDirectedGamMaterialsOutput(raw, ctx);
  assert.equal(sanitized.sanitized, true);
  assert.doesNotMatch(sanitized.text, /Facilitator use:/i);
  api.applyGamPackTextValidationToCapture(sanitized.text, ctx, "gam-step", raw);
  const blocking = api.getWorkflowRunGamFormatValidationForTest("gam-step");
  assert.doesNotMatch(blocking, /Facilitator use/i);
});

test("resolveGamOutputFormatLib exposes tiered capture gate", () => {
  const lib = api.resolveGamOutputFormatLib();
  assert.ok(lib);
  assert.equal(typeof lib.validateGamPackTextCaptureGate, "function");
});
