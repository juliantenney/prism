/**
 * Sprint 27-1 read-only probe — factor extract + heuristic topology (not a test).
 * Run: node docs/development/sprints/2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/27-1-extraction-probe.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function loadApi() {
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  const parsed = JSON.parse(md.slice(fence + 7, close).trim());
  return parsed.workflowPolicy;
}

function topo(api, wp, brief, resolvedExtra) {
  const ex = api.extractWorkflowBriefExplicitFactors(brief);
  const thin = {
    steps: [
      { title: "Normalize Content" },
      { title: "Model Knowledge" },
      { title: "Define Learning Outcomes" },
      { title: "Generate Assessment Items" },
      { title: "Design Page" }
    ]
  };
  const hints = {
    goal: brief.goal || "",
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    explicitBriefFactors: ex,
    resolvedBriefFactors: Object.assign({ session_materials: ["page"] }, ex, resolvedExtra || {})
  };
  const out = api.applyWorkflowDesignHeuristics(thin, {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: wp,
    stepPatternCatalog: [],
    ...hints
  });
  return { extract: ex, steps: (out.steps || []).map((s) => s.title) };
}

const api = loadApi();
const wp = extractLdWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));

const cases = [
  {
    id: "RNA",
    brief: {
      goal:
        "Create a one hour follow up session for individual to build on the knowledge they gained in the lecture. Include some short learning activities and a short formative assessment.",
      inputs: "Uploaded lecture transcript on RNA viruses and hepatitis C (HCV).",
      desiredOutputs: "Learner-facing page with activities and formative check.",
      startingArtefact: "provided_source_content",
      selectedDomains: ["learning-design"]
    },
    resolved: {
      input_strategy: "provided_source_content",
      delivery_context: "self_directed",
      design_scope: "session"
    }
  },
  {
    id: "Inflation",
    brief: {
      goal:
        "Design a 60-minute workshop on inflation for undergraduate students with activities and formative assessment questions.",
      inputs:
        "Include group discussion, a short case study, and facilitator pacing notes for a single session.",
      desiredOutputs: "learner-facing page",
      selectedDomains: ["learning-design"]
    },
    resolved: {
      topic: "inflation",
      design_scope: "session",
      session_materials: ["page"],
      input_strategy: "generate_from_topic",
      delivery_pattern: "face_to_face"
    }
  },
  {
    id: "Climate-hide-answers",
    brief: {
      goal:
        "Design a misconception discussion workshop on climate change. Include task cards and true/false formative check. Do not reveal correct answers on the student handout.",
      inputs: "Uploaded lecture transcript.",
      desiredOutputs: "learner page",
      selectedDomains: ["learning-design"]
    },
    resolved: {
      session_materials: ["page"],
      input_strategy: "provided_source_content",
      design_scope: "session"
    }
  }
];

const report = cases.map((c) => {
  const r = topo(api, wp, c.brief, c.resolved);
  return { id: c.id, ...r };
});

console.log(JSON.stringify(report, null, 2));
