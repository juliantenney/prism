/**
 * Sprint 27 track 27-4a — assessment semantics extract + resolve (elicitation only).
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

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  assert.ok(idx !== -1, "LD pack should contain Workflow Brief Config section");
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  const parsed = JSON.parse(md.slice(fence + 7, close).trim());
  return parsed.workflowBriefConfig;
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

const api = loadPrismTestApi();
const ldBriefConfig = extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"));
const normalizedLdConfig = api.normalizeWorkflowBriefConfig(ldBriefConfig);

const P27_02 = {
  goal:
    "Design a 60-minute seminar on ocean acidification for undergraduate marine science students. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout — tutor will debrief.",
  inputs:
    "Include facilitator notes with pacing for discussion, scenario prompts, and debrief guidance for the formative check.",
  desiredOutputs: "Learner handout page plus facilitator session notes.",
  startingArtefact: "generate_from_topic",
  selectedDomains: ["learning-design"]
};

const P27_03 = {
  goal:
    "Create a peer instruction session on stoichiometry: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Emphasise pair discussion before confirming solutions.",
  inputs: "First-year chemistry; 90-minute lab session.",
  desiredOutputs: "Learner-facing session page with activities and MCQ check.",
  startingArtefact: "generate_from_topic",
  selectedDomains: ["learning-design"]
};

const P27_04 = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — learners should not see correct answers on the handout.",
  inputs: "Uploaded lecture transcript on climate change science.",
  desiredOutputs: "Learner page for workshop discussion and formative check.",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

function extractBrief(brief) {
  return api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    designIntent: brief.designIntent || "",
    inputs: brief.inputs,
    desiredOutputs: brief.desiredOutputs,
    startingArtefact: brief.startingArtefact,
    selectedDomains: brief.selectedDomains
  });
}

function resolveExplicit(explicit, baseBrief) {
  return api.resolveWorkflowBriefFactors(
    normalizedLdConfig,
    explicit,
    {},
    {},
    baseBrief || {}
  ).resolved;
}

test("27-4a: negation-safe hide-answer phrases do not set include_answers true", () => {
  const phrases = [
    "Do not reveal correct answers on the student handout.",
    "Learners should not see answers until the tutor debrief.",
    "Students should not see the correct answers on the handout."
  ];
  phrases.forEach((goal) => {
    const factors = extractBrief({ goal, selectedDomains: ["learning-design"] });
    assert.notEqual(factors.include_answers, true, goal);
    assert.equal(factors.learner_answer_visibility, "hidden_until_reveal", goal);
  });
});

test("27-4a: positive include-answer cues still set include_answers when not negated", () => {
  const factors = extractBrief({
    goal: "Create a quiz with model answers and brief feedback for tutors.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(factors.include_answers, true);
});

test("27-4a: LD brief config includes Sprint 27 semantic optional factors", () => {
  const ids = (normalizedLdConfig.optionalFactors || []).map((f) => f.id);
  [
    "feedback_timing",
    "assessment_interaction_mode",
    "learner_answer_visibility",
    "peer_instruction_phase",
    "misconception_assessment_link",
    "design_feedback_required"
  ].forEach((id) => assert.ok(ids.includes(id), id));
  const ordered =
    normalizedLdConfig.intentClasses &&
    normalizedLdConfig.intentClasses.assessment_pack &&
    normalizedLdConfig.intentClasses.assessment_pack.elicitation &&
    normalizedLdConfig.intentClasses.assessment_pack.elicitation.orderedFactors;
  assert.ok(Array.isArray(ordered));
  assert.ok(ordered.includes("feedback_timing"));
  assert.ok(ordered.includes("learner_answer_visibility"));
  assert.ok(ordered.includes("assessment_interaction_mode"));
});

test("27-4a: activity cues — task cards and misconception discussion set activities_required", () => {
  const factors = extractBrief({
    goal: "Run a misconception discussion workshop with task cards and peer instruction segments.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(factors.activities_required, true);
});

test("27-4a: P27-02 probe brief — hidden visibility, delayed timing, no include_answers", () => {
  const explicit = extractBrief(P27_02);
  assert.notEqual(explicit.include_answers, true);
  assert.equal(explicit.learner_answer_visibility, "hidden_until_reveal");
  assert.equal(explicit.feedback_timing, "tutor_led_reveal_only");
  assert.equal(explicit.assessment_interaction_mode, "discussion_oriented");
  const resolved = resolveExplicit(explicit, P27_02);
  assert.equal(resolved.design_feedback_required, true);
});

test("27-4a: P27-03 probe brief — peer_instruction_phase and learner page_profile", () => {
  const explicit = extractBrief(P27_03);
  assert.equal(explicit.peer_instruction_phase, "think_pair_share");
  assert.equal(explicit.activities_required, true);
  assert.equal(explicit.assessment_total_items, 6);
  assert.equal(explicit.page_profile, "learner");
});

test("27-4a: P27-04 probe brief — diagnostic mode and hidden learner visibility", () => {
  const explicit = extractBrief(P27_04);
  assert.notEqual(explicit.include_answers, true);
  assert.equal(explicit.learner_answer_visibility, "hidden_until_reveal");
  assert.equal(explicit.assessment_interaction_mode, "diagnostic_misconception");
  assert.equal(explicit.misconception_assessment_link, true);
  assert.equal(explicit.activities_required, true);
  const resolved = resolveExplicit(explicit, P27_04);
  assert.equal(resolved.misconception_assessment_link, true);
});

test("27-4a: post-gen assessment_pack queue includes new semantic factors", () => {
  const design = {
    steps: [
      { title: "Normalize Content", canonicalStepId: "normalize_content" },
      { title: "Generate Assessment Items", canonicalStepId: "generate_assessment_items" }
    ]
  };
  const resolved = { assessment_required: true, assessment_type: "mcq", assessment_total_items: 5 };
  const queue = api.getAssessmentPostGenerationElicitationQueue(
    normalizedLdConfig,
    P27_02,
    resolved,
    {},
    {},
    design
  );
  const queuedIds = queue.map((f) => f.id);
  assert.ok(queuedIds.includes("feedback_timing"));
  assert.ok(queuedIds.includes("learner_answer_visibility"));
  assert.ok(queuedIds.includes("assessment_interaction_mode"));
});
