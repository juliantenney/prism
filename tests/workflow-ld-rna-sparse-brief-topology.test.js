/**
 * LD sparse-brief topology — RNA/HCV follow-up session (Sprint 26 Track A).
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
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief-ld-sparse",
  "rna-virus-activities-formative.json"
);

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  assert.ok(idx !== -1, "LD pack should contain Workflow Policy section");
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  const parsed = JSON.parse(md.slice(fence + 7, close).trim());
  return parsed.workflowPolicy;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
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

function applyLdHeuristics(api, workflowPolicy, parsed, hints) {
  return api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(parsed)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: hints.resolvedBriefFactors || {},
    explicitBriefFactors: hints.explicitBriefFactors || {},
    goal: hints.goal || "",
    inputs: hints.inputs || "",
    desiredOutputs: hints.desiredOutputs || "",
    startingArtefact: hints.startingArtefact || ""
  });
}

const api = loadPrismTestApi();
const ldWorkflowPolicy = extractLdWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));
const rnaFixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const THIN_MODEL_CHAIN = {
  steps: [
    { title: "Normalize Content", role: "" },
    { title: "Model Knowledge", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Generate Assessment Items", role: "" },
    { title: "Design Page", role: "" }
  ]
};

test("LD RNA sparse brief: extract sets activities_required and assessment_required", () => {
  const brief = rnaFixture.brief;
  const factors = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    selectedDomains: ["learning-design"]
  });
  assert.equal(factors.activities_required, true);
  assert.equal(factors.assessment_required, true);
  assert.equal(factors.materials_required, true);
});

test("LD RNA sparse brief: heuristics restore activity and materials steps", () => {
  const brief = rnaFixture.brief;
  const factors = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    selectedDomains: ["learning-design"]
  });
  const out = applyLdHeuristics(api, ldWorkflowPolicy, THIN_MODEL_CHAIN, {
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    explicitBriefFactors: factors,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: "provided_source_content",
        delivery_context: "self_directed",
        design_scope: "session"
      },
      factors
    )
  });
  const titles = stepTitles(out);
  for (const stepName of rnaFixture.expect.stepsInclude) {
    assert.ok(
      indexOfTitle(titles, stepName) !== -1,
      "expected step missing: " + stepName + "; got: " + titles.join(" -> ")
    );
  }
  const dloIdx = indexOfTitle(titles, "Define Learning Outcomes");
  const dlaIdx = indexOfTitle(titles, "Design Learning Activities");
  const gamIdx = indexOfTitle(titles, "Generate Activity Materials");
  const gaiIdx = indexOfTitle(titles, "Generate Assessment Items");
  const dpIdx = indexOfTitle(titles, "Design Page");
  assert.ok(dloIdx < dlaIdx, "outcomes should precede activities");
  assert.ok(dlaIdx < gamIdx, "activities should precede materials");
  assert.ok(gamIdx < gaiIdx, "materials should precede assessment items");
  assert.ok(gaiIdx < dpIdx, "assessment should precede Design Page");
});

test("LD formative assessment only: lean path omits activity chain", () => {
  const goal = "Create a short formative assessment with ten MCQs for tutors to print.";
  const factors = api.extractWorkflowBriefExplicitFactors({
    goal,
    inputs: "",
    selectedDomains: ["learning-design"]
  });
  assert.equal(factors.activities_required, undefined);
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Generate Assessment Items", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal,
    inputs: "",
    explicitBriefFactors: factors,
    resolvedBriefFactors: Object.assign(
      { design_scope: "single_activity", input_strategy: "generate_from_topic" },
      factors
    )
  });
  const titles = stepTitles(out);
  assert.equal(indexOfTitle(titles, "Design Learning Activities"), -1);
  assert.equal(indexOfTitle(titles, "Generate Activity Materials"), -1);
  assert.ok(indexOfTitle(titles, "Generate Assessment Items") !== -1);
  assert.equal(indexOfTitle(titles, "Normalize Content"), -1);
});

test("LD sparse topic generation: prefers GLC -> MK -> DLO without Normalize", () => {
  const out = applyLdHeuristics(api, ldWorkflowPolicy, THIN_MODEL_CHAIN, {
    goal: "Design a topic-led workshop on RNA viruses with activities for undergraduate learners.",
    inputs: "",
    desiredOutputs: "learner-facing page",
    startingArtefact: "generate_from_topic",
    resolvedBriefFactors: {
      topic: "rna viruses",
      design_scope: "session",
      delivery_context: "self_directed",
      session_materials: ["page"],
      input_strategy: "generate_from_topic"
    }
  });
  const titles = stepTitles(out);
  const glcIdx = indexOfTitle(titles, "Generate Learning Content");
  const mkIdx = indexOfTitle(titles, "Model Knowledge");
  const dloIdx = indexOfTitle(titles, "Define Learning Outcomes");
  assert.equal(indexOfTitle(titles, "Normalize Content"), -1);
  assert.equal(indexOfTitle(titles, "Generate VLE Structure"), -1);
  assert.ok(glcIdx !== -1 && mkIdx !== -1 && dloIdx !== -1, "expected GLC, MK and DLO");
  assert.ok(glcIdx < mkIdx, "Generate Learning Content should precede Model Knowledge");
  assert.ok(mkIdx < dloIdx, "Model Knowledge should precede Define Learning Outcomes");
});

test("LD self-study with activities: keeps activity chain (style not existence)", () => {
  const goal =
    "Design self-study revision from the lecture transcript with short learning activities and a learner page.";
  const factors = api.extractWorkflowBriefExplicitFactors({
    goal,
    inputs: "Uploaded lecture transcript.",
    desiredOutputs: "learner page",
    startingArtefact: "provided_source_content",
    selectedDomains: ["learning-design"]
  });
  assert.equal(factors.activities_required, true);
  const out = applyLdHeuristics(api, ldWorkflowPolicy, THIN_MODEL_CHAIN, {
    goal,
    inputs: "Uploaded lecture transcript.",
    desiredOutputs: "learner page",
    startingArtefact: "provided_source_content",
    explicitBriefFactors: factors,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: "provided_source_content",
        delivery_context: "self_directed"
      },
      factors
    )
  });
  const titles = stepTitles(out);
  assert.ok(indexOfTitle(titles, "Design Learning Activities") !== -1);
  assert.ok(indexOfTitle(titles, "Generate Activity Materials") !== -1);
});
