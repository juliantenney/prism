/**
 * Assessment step assembly — resolved brief must produce Generate Assessment Items.
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

const MARX_GOAL_WITH_COUNT =
  "Create a self study resource about Karl Marx with 10 formative assessment questions.";
const MARX_GOAL_VAGUE_ASSESSMENT =
  "Create a self study resource about Karl Marx with formative assessment questions.";
const PAGE_ONLY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases and core concepts. No quiz or assessment.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const SELF_STUDY_PAGE_CHAIN = {
  steps: [
    { title: "Model Knowledge", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Design Learning Activities", role: "" },
    { title: "Generate Activity Materials", role: "" },
    { title: "Construct Learning Sequence", role: "" },
    { title: "Design Page", role: "" }
  ]
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
  const documentStub = { readyState: "loading", addEventListener: () => {} };
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

function assembleWorkflow(brief, resolvedOverride) {
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
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  const resolvedFactors = Object.assign(
    {
      session_materials: ["page"],
      delivery_context: "self_directed",
      design_scope: "session"
    },
    resolved,
    resolvedOverride || {}
  );
  const topo = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(SELF_STUDY_PAGE_CHAIN)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: ldWorkflowPolicy,
    stepPatternCatalog: [],
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    explicitBriefFactors: explicit,
    resolvedBriefFactors: resolvedFactors
  });
  return { explicit, resolved: resolvedFactors, titles: stepTitles(topo) };
}

test("Marx self-study: 10 formative assessment questions → Generate Assessment Items present", () => {
  const { resolved, titles } = assembleWorkflow({
    goal: MARX_GOAL_WITH_COUNT,
    desiredOutputs: "Learner-facing page",
    selectedDomains: ["learning-design"]
  });
  assert.equal(resolved.assessment_required, true);
  assert.ok(Number(resolved.assessment_total_items) > 0);
  assert.notEqual(indexOfTitle(titles, "Generate Assessment Items"), -1, titles.join(" → "));
  assert.notEqual(indexOfTitle(titles, "Design Page"), -1);
});

test("brief with formative assessment questions → assessment step present", () => {
  const { resolved, titles } = assembleWorkflow({
    goal: MARX_GOAL_VAGUE_ASSESSMENT,
    desiredOutputs: "Learner page.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(resolved.assessment_required, true);
  assert.notEqual(indexOfTitle(titles, "Generate Assessment Items"), -1, titles.join(" → "));
});

test("resolved assessment_required without goal keywords still includes assessment step", () => {
  const { titles } = assembleWorkflow(
    {
      goal:
        "Create a self-directed learning page on Karl Marx covering life phases and application of core concepts.",
      desiredOutputs: "Learner-facing page",
      selectedDomains: ["learning-design"]
    },
    {
      assessment_required: true,
      assessment_total_items: 10,
      assessment_strategy: "formative",
      assessment_type: "mixed"
    }
  );
  assert.notEqual(indexOfTitle(titles, "Generate Assessment Items"), -1, titles.join(" → "));
});

test("non-assessment learner page: no Generate Assessment Items", () => {
  const { resolved, titles } = assembleWorkflow(PAGE_ONLY_BRIEF);
  assert.equal(resolved.assessment_required, false);
  assert.equal(indexOfTitle(titles, "Generate Assessment Items"), -1, titles.join(" → "));
});

test("assessment-first retrieval quiz page workflow still includes Generate Assessment Items", () => {
  const brief = {
    goal:
      "Create a self-study revision page on photosynthesis with a 10-item MCQ quiz. Show answers at the end.",
    desiredOutputs: "Self-study revision page.",
    selectedDomains: ["learning-design"]
  };
  const { resolved, titles } = assembleWorkflow(brief);
  assert.equal(resolved.assessment_required, true);
  assert.notEqual(indexOfTitle(titles, "Generate Assessment Items"), -1, titles.join(" → "));
});
