/**
 * Sprint 27 track 27-4b — assessment semantics topology (Design Feedback, step order).
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
const rnaFixturePath = path.join(
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

function resolveLdBrief(api, ldBriefConfig, brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    selectedDomains: ["learning-design"]
  });
  const resolved = api.resolveWorkflowBriefFactors(
    api.normalizeWorkflowBriefConfig(ldBriefConfig),
    explicit,
    {},
    {},
    brief
  ).resolved;
  return { explicit, resolved };
}

const api = loadPrismTestApi();
const ldWorkflowPolicy = extractLdWorkflowPolicy(fs.readFileSync(ldPatternsPath, "utf8"));
const ldBriefConfig = extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"));
const rnaFixture = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));

const P27_02 = {
  goal:
    "Design a 60-minute seminar on ocean acidification for undergraduate marine science students. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout — tutor will debrief.",
  inputs:
    "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
  desiredOutputs: "Learner handout page plus facilitator session notes.",
  startingArtefact: "generate_from_topic"
};

const P27_03 = {
  goal:
    "Create a peer instruction session on stoichiometry: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Emphasise pair discussion before confirming solutions.",
  inputs: "First-year chemistry; 90-minute lab session.",
  desiredOutputs: "Learner-facing session page with activities and MCQ check.",
  startingArtefact: "generate_from_topic"
};

const P27_04 = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
  inputs: "Uploaded lecture transcript on climate change science.",
  desiredOutputs: "Learner page for workshop discussion and formative check.",
  startingArtefact: "provided_source_content"
};

/** Deliberately wrong order (GAI before DLA) to exercise 27-4b reorder guard. */
const DISCUSSION_CHAIN_WRONG_ORDER = {
  steps: [
    { title: "Normalize Content", role: "" },
    { title: "Model Knowledge", role: "" },
    { title: "Define Learning Outcomes", role: "" },
    { title: "Generate Assessment Items", role: "" },
    { title: "Design Learning Activities", role: "" },
    { title: "Generate Activity Materials", role: "" },
    { title: "Design Page", role: "" }
  ]
};

function topologyForBrief(brief) {
  const { explicit, resolved } = resolveLdBrief(api, ldBriefConfig, brief);
  const out = applyLdHeuristics(api, ldWorkflowPolicy, DISCUSSION_CHAIN_WRONG_ORDER, {
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    explicitBriefFactors: explicit,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: brief.startingArtefact || "generate_from_topic",
        design_scope: "session",
        delivery_context: "in_person"
      },
      resolved
    )
  });
  return { titles: stepTitles(out), explicit, resolved };
}

test("27-4b P27-02: Design Feedback included; DLA → GAM → GAI → Design Feedback → CLS → Design Page", () => {
  const { titles, resolved } = topologyForBrief(P27_02);
  assert.equal(resolved.design_feedback_required, true);
  assert.ok(indexOfTitle(titles, "Design Feedback") !== -1, titles.join(" -> "));
  const dla = indexOfTitle(titles, "Design Learning Activities");
  const gam = indexOfTitle(titles, "Generate Activity Materials");
  const gai = indexOfTitle(titles, "Generate Assessment Items");
  const feedback = indexOfTitle(titles, "Design Feedback");
  const cls = indexOfTitle(titles, "Construct Learning Sequence");
  const page = indexOfTitle(titles, "Design Page");
  assert.ok(dla !== -1 && gam !== -1 && gai !== -1);
  assert.ok(dla < gam, "DLA should precede GAM");
  assert.ok(gam < gai, "GAM should precede GAI");
  assert.ok(gai < feedback, "Design Feedback should follow Generate Assessment Items");
  assert.ok(feedback < cls, "Construct Learning Sequence should follow Design Feedback");
  assert.ok(cls < page, "Design Page should remain last");
  assert.equal(indexOfTitle(titles, "Design Assessment"), -1);
});

test("27-4b P27-03: peer-instruction workflow keeps activity-before-assessment order", () => {
  const { titles } = topologyForBrief(P27_03);
  const dla = indexOfTitle(titles, "Design Learning Activities");
  const gai = indexOfTitle(titles, "Generate Assessment Items");
  assert.ok(dla !== -1 && gai !== -1);
  assert.ok(dla < gai, "DLA should precede GAI");
  assert.equal(indexOfTitle(titles, "Design Assessment"), -1);
});

test("27-4b P27-04: hidden-answer diagnostic workshop includes Design Feedback", () => {
  const { titles, resolved } = topologyForBrief(P27_04);
  assert.equal(resolved.learner_answer_visibility, "hidden_until_reveal");
  assert.equal(resolved.assessment_interaction_mode, "diagnostic_misconception");
  assert.ok(indexOfTitle(titles, "Design Feedback") !== -1, titles.join(" -> "));
  const dla = indexOfTitle(titles, "Design Learning Activities");
  const gai = indexOfTitle(titles, "Generate Assessment Items");
  assert.ok(dla < gai, "activities should precede assessment items");
});

test("27-4b regression: RNA sparse brief unchanged — no Design Feedback or Design Assessment", () => {
  const brief = rnaFixture.brief;
  const { explicit, resolved } = resolveLdBrief(api, ldBriefConfig, brief);
  const out = applyLdHeuristics(api, ldWorkflowPolicy, {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Generate Assessment Items", role: "" },
      { title: "Design Page", role: "" }
    ]
  }, {
    goal: brief.goal,
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    explicitBriefFactors: explicit,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: "provided_source_content",
        delivery_context: "self_directed",
        design_scope: "session"
      },
      resolved
    )
  });
  const titles = stepTitles(out);
  assert.equal(indexOfTitle(titles, "Design Feedback"), -1);
  assert.equal(indexOfTitle(titles, "Design Assessment"), -1);
  for (const stepName of rnaFixture.expect.stepsInclude) {
    assert.ok(indexOfTitle(titles, stepName) !== -1, stepName);
  }
});

test("27-4b regression: lean MCQ-only brief omits Design Feedback", () => {
  const goal = "Create a short formative assessment with ten MCQs for tutors to print.";
  const { explicit, resolved } = resolveLdBrief(api, ldBriefConfig, {
    goal,
    inputs: "",
    desiredOutputs: "",
    startingArtefact: "generate_from_topic"
  });
  const out = applyLdHeuristics(
    api,
    ldWorkflowPolicy,
    { steps: [{ title: "Generate Assessment Items", role: "" }, { title: "Design Page", role: "" }] },
    {
      goal,
      inputs: "",
      explicitBriefFactors: explicit,
      resolvedBriefFactors: Object.assign(
        { design_scope: "single_activity", input_strategy: "generate_from_topic" },
        resolved
      )
    }
  );
  const titles = stepTitles(out);
  assert.equal(indexOfTitle(titles, "Design Feedback"), -1);
  assert.equal(indexOfTitle(titles, "Design Learning Activities"), -1);
});
