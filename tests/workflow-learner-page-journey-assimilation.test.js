/**
 * Sprint 42 Slice 42-6 — Design Page journey assimilation contract.
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

test("42-6: self-study Design Page includes journey assimilation contract", () => {
  const prompt = designPagePrompt(MARX_SELF_STUDY_BRIEF);
  const idx = prompt.indexOf("LD-JOURNEY-ASSIMILATION-CONTRACT (auto-applied):");
  const journeyBlock = idx >= 0 ? prompt.slice(idx) : prompt;
  assert.match(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i);
  assert.match(journeyBlock, /UPSTREAM SIGNALS/i);
  assert.match(journeyBlock, /transition_to_next/i);
  assert.match(journeyBlock, /Question → Investigation → Evidence → Judgement/i);
  assert.match(journeyBlock, /wrapper\/page-level prose/i);
  assert.match(journeyBlock, /LD-AUTHORIAL-EXPOSITION PRESERVATION BOUNDARY/i);
  assert.doesNotMatch(
    journeyBlock,
    /wrapper prose \(overview, learning_purpose, knowledge_summary, study_tips, activity_preamble, intellectual_coherence_bridge\)/i
  );
  assert.doesNotMatch(journeyBlock, /inform preamble\/bridge phrasing/i);
});

test("42-6: self-study Design Page retains authorial exposition contract", () => {
  const prompt = designPagePrompt(MARX_SELF_STUDY_BRIEF);
  assert.match(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /RHETORICAL ROLE SEPARATION/i);
  assert.match(prompt, /Activity field preservation/i);
});

test("42-6: facilitator-only Design Page excludes journey assimilation", () => {
  const prompt = designPagePrompt(FACILITATOR_ONLY_BRIEF);
  assert.doesNotMatch(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT/i);
});

test("42-6: applyLdJourneyAssimilationContractToDraft is idempotent", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Page",
    stepCanonicalStepId: "step_design_page",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const once = api.applyLdJourneyAssimilationContractToDraft("Base\n", ctx);
  const twice = api.applyLdJourneyAssimilationContractToDraft(once, ctx);
  assert.equal(once, twice);
});

test("42-6: domain pack Design Page template references journey assimilation and LC/KM", () => {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const dpSection = md.slice(md.indexOf("## 13. Design Page"));
  const factory = JSON.parse(
    dpSection.match(/### Prompt Factory\s*```json\s*([\s\S]*?)\s*```/)[1].trim()
  );
  assert.match(dpSection, /LD-JOURNEY-ASSIMILATION/);
  assert.match(dpSection, /learning_content, knowledge_model/);
  assert.match(factory.promptTemplate, /LD-JOURNEY-ASSIMILATION/);
  assert.match(factory.defaultPromptNotes, /LD-JOURNEY-ASSIMILATION/);
});

test("42-6: preservation repair still restores activity_preamble after compose path", () => {
  const upstream = {
    activities: [
      {
        activity_id: "LO1",
        activity_preamble: "This activity builds foundational understanding.",
        intellectual_coherence_bridge: "Carry the distinction forward.",
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
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_SELF_STUDY_BRIEF);
  const out = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamLearningActivities: upstream,
    resolvedFactors: resolved,
    explicitBriefFactors: explicit,
    workflowBriefConfig: ldBriefConfig,
    base: MARX_SELF_STUDY_BRIEF,
    pageProfile: "learner"
  });
  assert.match(
    String(out.sections[0].content[0].activity_preamble || ""),
    /foundational understanding/i
  );
  assert.match(
    String(out.sections[0].content[0].intellectual_coherence_bridge || ""),
    /Carry the distinction/i
  );
});

