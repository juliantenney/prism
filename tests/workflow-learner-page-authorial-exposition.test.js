/**
 * Sprint 42 Slice 42-2 — Design Page authorial exposition contract.
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

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const WORKSHOP_LEARNER_HANDOUT_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
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
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  ).resolved;
}

function designPagePrompt(brief) {
  const resolved = resolveBrief(brief);
  const ctx = {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    stepCanonicalTitle: "Design Page",
    stepCanonicalStepId: "step_design_page",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  return api.applyLdDesignPageComposeContractToDraft("Assemble learner page.\n", ctx);
}

function designPageRuntimePrompt(brief) {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowOutputSpec: { goal: brief.goal }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble learner page.\n",
    step,
    wf
  );
}

test("56C: Design Page compose path excludes authorial exposition injection", () => {
  const prompt = designPagePrompt(MARX_SELF_STUDY_BRIEF);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION/i);
  assert.match(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
});

test("56C: workshop learner handout Design Page excludes authorial exposition injection", () => {
  const prompt = designPagePrompt(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT/i);
});

test("56C: all Design Page briefs exclude authorial exposition on runtime path", () => {
  for (const brief of [
    MARX_SELF_STUDY_BRIEF,
    WORKSHOP_LEARNER_HANDOUT_BRIEF,
    FACILITATOR_ONLY_BRIEF
  ]) {
    const prompt = designPageRuntimePrompt(brief);
    assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT/i);
  }
});

test("42-2: preservation repair still restores activity_preamble after compose path", () => {
  const upstream = {
    activities: [
      {
        activity_id: "LO1",
        activity_preamble: "This activity builds foundational understanding.",
        reasoning_orientation: "Separate anecdotes from trend evidence.",
        learner_task: "Study the example."
      }
    ]
  };
  const page = {
    artifact_type: "page",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        content: [{ activity_id: "LO1", learner_task: "Study the example." }]
      }
    ]
  };
  const resolved = resolveBrief(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const explicit = api.extractWorkflowBriefExplicitFactors(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: WORKSHOP_LEARNER_HANDOUT_BRIEF,
    pageProfile: "learner"
  });
  assert.match(
    String(out.sections[0].content[0].activity_preamble || ""),
    /foundational understanding/i
  );
});

test("42-2: applyLdAuthorialExpositionContractToDraft is idempotent", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Page",
    stepCanonicalStepId: "step_design_page",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const once = api.applyLdAuthorialExpositionContractToDraft("Base\n", ctx);
  const twice = api.applyLdAuthorialExpositionContractToDraft(once, ctx);
  assert.equal(once, twice);
});
