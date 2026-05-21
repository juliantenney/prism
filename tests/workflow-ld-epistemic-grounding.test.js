/**
 * Epistemic grounding — input_strategy must not false-positive on pedagogical "notes";
 * Model Knowledge workflows must retain Generate Learning Content when no source is provided.
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

const CLIMATE_SEMINAR_GOAL =
  "Design a 60-minute seminar on climate misconceptions. Small groups discuss scenario questions using task cards and prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout. The tutor will debrief answers after group discussion. Include facilitator notes and delayed feedback guidance.";

const P27_04 = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
  inputs: "Uploaded lecture transcript on climate change science.",
  desiredOutputs: "Learner page for workshop discussion and formative check.",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {}
  };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);
const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));

function extractBrief(brief) {
  return api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: brief.selectedDomains || ["learning-design"]
  });
}

function resolveBrief(brief, explicit) {
  const inf = api.applyWorkflowBriefInferenceRules(ldBriefConfig, brief.goal, brief.inputs || "");
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, inf, brief).resolved;
}

function applyTopology(brief, explicit, resolved) {
  const seed = {
    steps: [
      { title: "Define Learning Outcomes", role: "" },
      { title: "Generate Assessment Items", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Design Page", role: "" }
    ]
  };
  return api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(seed)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: ldWorkflowPolicy,
    stepPatternCatalog: [],
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    explicitBriefFactors: explicit,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        assessment_required: true,
        activities_required: true,
        delivery_context: "in_person",
        design_scope: "session",
        duration_minutes: 60
      },
      resolved
    )
  });
}

test("climate seminar manual brief: facilitator notes must not imply provided_source_content", () => {
  const brief = {
    goal: CLIMATE_SEMINAR_GOAL,
    inputs: "",
    desiredOutputs: "Learner handout page plus facilitator session notes.",
    selectedDomains: ["learning-design"]
  };
  const explicit = extractBrief(brief);
  assert.notEqual(explicit.input_strategy, "provided_source_content");
  const resolved = resolveBrief(brief, explicit);
  assert.notEqual(resolved.input_strategy, "provided_source_content");
});

test("climate seminar manual brief: Generate Learning Content precedes Model Knowledge", () => {
  const brief = {
    goal: CLIMATE_SEMINAR_GOAL,
    inputs: "",
    desiredOutputs: "Learner handout page plus facilitator session notes.",
    selectedDomains: ["learning-design"]
  };
  const explicit = extractBrief(brief);
  const resolved = resolveBrief(brief, explicit);
  const topo = applyTopology(brief, explicit, resolved);
  const titles = stepTitles(topo);
  const glc = indexOfTitle(titles, "Generate Learning Content");
  const mk = indexOfTitle(titles, "Model Knowledge");
  assert.ok(glc !== -1, "expected Generate Learning Content in: " + titles.join(" -> "));
  assert.ok(mk !== -1, "expected Model Knowledge in: " + titles.join(" -> "));
  assert.ok(glc < mk, titles.join(" -> "));
});

test("Include facilitator notes alone must not set provided_source_content", () => {
  const explicit = extractBrief({
    goal: "Design a workshop. Include facilitator notes and delayed feedback guidance.",
    inputs: "",
    selectedDomains: ["learning-design"]
  });
  assert.notEqual(explicit.input_strategy, "provided_source_content");
});

test("non-empty inputs with facilitation/pacing only must not set provided_source_content", () => {
  const brief = {
    goal: "Design a 60-minute seminar on climate misconceptions.",
    inputs: "Include facilitator notes with pacing for discussion and debrief guidance.",
    desiredOutputs: "Learner handout page.",
    selectedDomains: ["learning-design"]
  };
  const explicit = extractBrief(brief);
  assert.notEqual(explicit.input_strategy, "provided_source_content");
  const resolved = resolveBrief(brief, explicit);
  assert.notEqual(resolved.input_strategy, "provided_source_content");
  const inf = api.applyWorkflowBriefInferenceRules(ldBriefConfig, brief.goal, brief.inputs);
  assert.notEqual(inf.input_strategy, "provided_source_content");
});

test("transcript/upload brief still resolves provided_source_content", () => {
  const explicit = extractBrief(P27_04);
  assert.equal(explicit.input_strategy, "provided_source_content");
  const resolved = resolveBrief(P27_04, explicit);
  assert.equal(resolved.input_strategy, "provided_source_content");
});

test("provided_source_content with real upload may omit Generate Learning Content", () => {
  const brief = P27_04;
  const explicit = extractBrief(brief);
  const resolved = resolveBrief(brief, explicit);
  const topo = applyTopology(brief, explicit, resolved);
  const titles = stepTitles(topo);
  assert.equal(explicit.input_strategy, "provided_source_content");
  assert.equal(indexOfTitle(titles, "Generate Learning Content"), -1);
  assert.ok(indexOfTitle(titles, "Model Knowledge") !== -1);
});

test("generate_from_topic starting artefact wins over notes in inputs inference", () => {
  const brief = {
    goal: "Design a seminar on climate misconceptions.",
    inputs: "Session notes for facilitators only.",
    desiredOutputs: "Learner page.",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"]
  };
  const explicit = extractBrief(brief);
  assert.equal(explicit.input_strategy, "generate_from_topic");
  const resolved = resolveBrief(brief, explicit);
  assert.equal(resolved.input_strategy, "generate_from_topic");
});
