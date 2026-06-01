/**
 * Learner-resource workflow brief resolution — self-directed defaults vs facilitated.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

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

const TRANSCRIPT_SELF_STUDY_BRIEF = {
  goal:
    "create a one hour self-study session for undergraduate students based on uploaded transcript",
  inputs: "Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).",
  desiredOutputs: "Learner-facing page",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

const WORKSHOP_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

const GENERIC_LEARNER_PAGE_BRIEF = {
  goal: "Create a learner-facing page on photosynthesis with short learning activities.",
  inputs: "",
  desiredOutputs: "Learner-facing page",
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function resolveBrief(api, config, brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(config, brief.goal, brief.inputs);
  return api.resolveWorkflowBriefFactors(config, explicit, {}, inferred, brief).resolved;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

test("transcript self-study brief: async self-directed delivery, not classroom F2F", () => {
  const resolved = resolveBrief(api, ldBriefConfig, TRANSCRIPT_SELF_STUDY_BRIEF);
  assert.equal(resolved.input_strategy, "provided_source_content");
  assert.equal(resolved.delivery_mode, "async");
  assert.equal(resolved.delivery_context, "self_directed");
  assert.notEqual(resolved.delivery_pattern, "face_to_face");
  assert.equal(resolved.delivery_pattern, "mostly_online");
  const envs = Array.isArray(resolved.learning_environments)
    ? resolved.learning_environments
    : [resolved.learning_environments];
  assert.ok(!envs.includes("classroom"), "classroom should not be default for self-study transcript page");
  assert.match(String(resolved.topic || ""), /RNA viruses|hepatitis C/i);
  assert.doesNotMatch(String(resolved.topic || "").toLowerCase(), /^(the )?uploaded transcript$/);
});

test("Marx self-study page brief remains self_directed with non-classroom delivery", () => {
  const resolved = resolveBrief(api, ldBriefConfig, MARX_SELF_STUDY_BRIEF);
  assert.equal(resolved.delivery_context, "self_directed");
  assert.notEqual(resolved.delivery_pattern, "face_to_face");
  const envs = Array.isArray(resolved.learning_environments)
    ? resolved.learning_environments
    : [resolved.learning_environments];
  assert.ok(!envs.includes("classroom"));
});

test("workshop brief: keeps facilitated delivery defaults", () => {
  const resolved = resolveBrief(api, ldBriefConfig, WORKSHOP_BRIEF);
  assert.notEqual(resolved.delivery_context, "self_directed");
  assert.equal(resolved.delivery_mode, "live_workshop");
  assert.equal(resolved.delivery_pattern, "face_to_face");
  const envs = Array.isArray(resolved.learning_environments)
    ? resolved.learning_environments
    : [resolved.learning_environments];
  assert.ok(envs.includes("classroom"));
});

test("generic learner-facing page brief leans self-directed without classroom default", () => {
  const resolved = resolveBrief(api, ldBriefConfig, GENERIC_LEARNER_PAGE_BRIEF);
  assert.equal(resolved.delivery_context, "self_directed");
  assert.equal(resolved.delivery_mode, "async");
  assert.notEqual(resolved.delivery_pattern, "face_to_face");
  const envs = Array.isArray(resolved.learning_environments)
    ? resolved.learning_environments
    : [resolved.learning_environments];
  assert.ok(!envs.includes("classroom"));
});
