/**
 * Negative assessment intent — extract + topology respect for explicit opt-out.
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

const BAYESIAN_NO_ASSESSMENT = {
  goal:
    "Create a short undergraduate teaching page explaining Bayesian inference with one worked example. No quiz or assessment.",
  inputs: "",
  desiredOutputs: "Undergraduate teaching page with one worked example.",
  selectedDomains: ["learning-design"]
};

const RETRIEVAL_QUIZ = {
  goal:
    "Create a self-study revision page on photosynthesis with a 10-item MCQ quiz. Show answers at the end.",
  inputs: "",
  desiredOutputs: "Self-study revision page.",
  selectedDomains: ["learning-design"]
};

const TUTOR_LED = {
  goal:
    "Design a 60-minute seminar on climate misconceptions. Small groups discuss scenario questions using task cards and prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout. The tutor will debrief answers after group discussion. Include facilitator notes and delayed feedback guidance.",
  inputs:
    "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
  desiredOutputs: "Learner handout page plus facilitator session notes.",
  selectedDomains: ["learning-design"]
};

const TRANSCRIPT_SOURCE = {
  goal:
    "Using the provided lecture transcript, create learning activities and a short formative assessment on RNA viruses.",
  inputs: "",
  desiredOutputs: "Learning activities and short formative assessment.",
  selectedDomains: ["learning-design"]
};

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
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
  assert.ok(api);
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

function pipeline(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: brief.selectedDomains || ["learning-design"]
  });
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs || ""
  );
  const { resolved, sources } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  const topo = api.applyWorkflowDesignHeuristics(
    {
      steps: [
        { title: "Normalize Content", role: "" },
        { title: "Model Knowledge", role: "" },
        { title: "Define Learning Outcomes", role: "" },
        { title: "Generate Assessment Items", role: "" },
        { title: "Design Page", role: "" }
      ]
    },
    {
      selectedDomains: ["general", "learning-design"],
      workflowPolicy: ldWorkflowPolicy,
      stepPatternCatalog: [],
      goal: brief.goal,
      inputs: brief.inputs || "",
      desiredOutputs: brief.desiredOutputs || "",
      startingArtefact: brief.startingArtefact || "",
      explicitBriefFactors: explicit,
      resolvedBriefFactors: Object.assign({ session_materials: ["page"] }, resolved)
    }
  );
  return { explicit, resolved, sources, titles: stepTitles(topo) };
}

test("negative intent: Bayesian teaching page opts out of assessment", () => {
  const { explicit, resolved, sources, titles } = pipeline(BAYESIAN_NO_ASSESSMENT);
  assert.equal(explicit.assessment_required, false);
  assert.equal(resolved.assessment_required, false);
  assert.equal(sources.assessment_required, "explicit");
  assert.equal(explicit.include_answers, false);
  assert.equal(indexOfTitle(titles, "Generate Assessment Items"), -1, titles.join(" -> "));
});

test("negative intent phrases set assessment_required false", () => {
  const cases = [
    "Create a teaching page only. No quiz.",
    "Explain the topic without assessment.",
    "Build a handout. Do not include a quiz.",
    "Short page for revision. No questions.",
    "Create a teaching page only for self-study."
  ];
  cases.forEach((goal) => {
    const explicit = api.extractWorkflowBriefExplicitFactors({
      goal,
      selectedDomains: ["learning-design"]
    });
    assert.equal(explicit.assessment_required, false, goal);
  });
});

test("negative intent does not suppress formative assessment or practice questions", () => {
  const { explicit: exTranscript, resolved: resTranscript } = pipeline(TRANSCRIPT_SOURCE);
  assert.equal(exTranscript.assessment_required, true);
  assert.equal(resTranscript.assessment_required, true);

  const explicitPractice = api.extractWorkflowBriefExplicitFactors({
    goal:
      "Design a seminar with scenario questions for discussion, then five practice questions for self-check.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicitPractice.assessment_required, true);

  const { explicit: exTutor, resolved: resTutor } = pipeline(TUTOR_LED);
  assert.equal(exTutor.assessment_required, true);
  assert.equal(resTutor.assessment_required, true);
  assert.ok(indexOfTitle(pipeline(TUTOR_LED).titles, "Generate Assessment Items") !== -1);
});

test("negative intent: retrieval quiz brief still requires assessment", () => {
  const { explicit, resolved, titles } = pipeline(RETRIEVAL_QUIZ);
  assert.equal(explicit.assessment_required, true);
  assert.equal(resolved.assessment_required, true);
  assert.ok(indexOfTitle(titles, "Generate Assessment Items") !== -1);
});

test("negative intent: worked example alone does not force assessment", () => {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal:
      "Create a teaching page on Bayes with one worked example for undergraduates. No quiz or assessment.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicit.assessment_required, false);
});
