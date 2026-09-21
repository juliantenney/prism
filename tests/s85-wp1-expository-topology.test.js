/**
 * Sprint 85 WP1 — Expository Resource topology construction.
 * Selecting expository_resource must yield EJP→XD→XM path and bypass EP/DLA/GAM/LS.
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

function extractWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
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
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const api = loadPrismTestApi();
const workflowPolicy = extractWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));

function titlesOf(design) {
  return (design.steps || []).map((s) => String(s.title || "").trim());
}

test("WP1: Expository Product constructs EJP/XD/XM topology and bypasses Interactive middle", () => {
  assert.ok(workflowPolicy.canonicalSteps.includes("Expository Journey Plan"));
  assert.ok(workflowPolicy.canonicalSteps.includes("Expository Development"));
  assert.ok(workflowPolicy.canonicalSteps.includes("Expository Materials"));

  const parsed = {
    status: "complete",
    summary: "draft",
    steps: [
      { title: "Generate Learning Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Episode Plan", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
      { title: "Construct Learning Sequence", role: "" },
      { title: "Design Page", role: "" }
    ]
  };

  const out = api.applyWorkflowDesignHeuristics(parsed, {
    goal: "Create an Expository Resource: Photosynthesis for year 10",
    inputs: "",
    desiredOutputs: "",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: {
      delivery_context: "self_directed",
      delivery_mode: "async",
      session_materials: ["page"],
      page_profile: "learner",
      activities_required: false,
      input_strategy: "generate_from_topic"
    },
    explicitBriefFactors: {
      session_materials: ["page"],
      activities_required: false
    }
  });

  const titles = titlesOf(out);
  assert.ok(titles.includes("Generate Learning Content"));
  assert.ok(titles.includes("Model Knowledge"));
  assert.ok(titles.includes("Define Learning Outcomes"));
  assert.ok(titles.includes("Expository Journey Plan"));
  assert.ok(titles.includes("Expository Development"));
  assert.ok(titles.includes("Expository Materials"));
  assert.ok(titles.includes("Design Page"));
  assert.ok(!titles.includes("Design Episode Plan"));
  assert.ok(!titles.includes("Design Learning Activities"));
  assert.ok(!titles.includes("Generate Activity Materials"));
  assert.ok(!titles.includes("Construct Learning Sequence"));

  const ejp = titles.indexOf("Expository Journey Plan");
  const xd = titles.indexOf("Expository Development");
  const xm = titles.indexOf("Expository Materials");
  const dp = titles.indexOf("Design Page");
  assert.ok(ejp < xd && xd < xm && xm < dp);
});

test("WP1: Self-study topology is unaffected by Expository registration", () => {
  const parsed = {
    status: "complete",
    summary: "draft",
    steps: [
      { title: "Generate Learning Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Design Episode Plan", role: "" },
      { title: "Design Learning Activities", role: "" },
      { title: "Generate Activity Materials", role: "" },
      { title: "Construct Learning Sequence", role: "" },
      { title: "Design Page", role: "" }
    ]
  };
  const out = api.applyWorkflowDesignHeuristics(parsed, {
    goal: "Create a self-study resource: Photosynthesis",
    inputs: "",
    desiredOutputs: "",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_SELF_STUDY,
    workflowPolicy,
    stepPatternCatalog: [],
    resolvedBriefFactors: {
      delivery_context: "self_directed",
      delivery_mode: "async",
      session_materials: ["page"],
      page_profile: "learner",
      activities_required: true,
      input_strategy: "generate_from_topic"
    },
    explicitBriefFactors: {
      session_materials: ["page"],
      activities_required: true
    }
  });
  const titles = titlesOf(out);
  assert.ok(titles.includes("Design Learning Activities"));
  assert.ok(!titles.includes("Expository Journey Plan"));
});
