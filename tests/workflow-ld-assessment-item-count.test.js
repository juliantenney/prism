/**
 * Assessment item-count extract, resolve precedence, and post-gen elicitation gating.
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

const P27_02_GOAL =
  "Design a 60-minute seminar on ocean acidification for undergraduate marine science students. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout — tutor will debrief.";

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

const api = loadPrismTestApi();
const ldBriefConfig = extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"));
const normalizedLdConfig = api.normalizeWorkflowBriefConfig(ldBriefConfig);

function extractAndResolve(brief) {
  const base = {
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "generate_from_topic",
    selectedDomains: ["learning-design"]
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(base);
  const pack = api.resolveWorkflowBriefFactors(
    normalizedLdConfig,
    explicit,
    brief.elicited || {},
    {},
    base
  );
  return { explicit, resolved: pack.resolved, sources: pack.sources, base };
}

function postGenQueueIds(resolved, sources, base, elicitedValues) {
  const design = {
    steps: [
      {
        title: "Generate Assessment Items",
        canonical_step_id: "step_generate_assessment_items"
      }
    ]
  };
  const queue = api.getAssessmentPostGenerationElicitationQueue(
    normalizedLdConfig,
    base,
    resolved,
    elicitedValues || {},
    sources,
    design
  );
  return queue.map((f) => String(f.id || ""));
}

test("extract: 5-item formative check (P27-02 style)", () => {
  const { explicit, resolved, sources } = extractAndResolve({
    goal: P27_02_GOAL,
    desiredOutputs: "Learner handout page."
  });
  assert.equal(explicit.assessment_total_items, 5);
  assert.equal(resolved.assessment_total_items, 5);
  assert.equal(sources.assessment_total_items, "explicit");
});

test("extract: 5 item formative check (spaced)", () => {
  const { explicit, sources } = extractAndResolve({
    goal: "Design a session. Students complete a 5 item formative check at the end."
  });
  assert.equal(explicit.assessment_total_items, 5);
  assert.equal(sources.assessment_total_items, "explicit");
});

test("extract: 5-item knowledge check", () => {
  const { explicit } = extractAndResolve({
    goal: "Build a workshop and include a 5-item knowledge check before debrief."
  });
  assert.equal(explicit.assessment_total_items, 5);
});

test("extract: 5-item assessment check", () => {
  const { explicit } = extractAndResolve({
    goal: "Finish with a 5-item assessment check on the core ideas."
  });
  assert.equal(explicit.assessment_total_items, 5);
});

test("extract: 5-item quiz", () => {
  const { explicit } = extractAndResolve({
    goal: "End the lesson with a short 5-item quiz."
  });
  assert.equal(explicit.assessment_total_items, 5);
});

test("extract: write 5 formative questions (legacy pattern)", () => {
  const { explicit } = extractAndResolve({
    goal: "Write 5 formative questions on photosynthesis."
  });
  assert.equal(explicit.assessment_total_items, 5);
});

test("extract: 10 MCQs (legacy pattern)", () => {
  const { explicit } = extractAndResolve({
    goal: "Create a page with 10 MCQs for revision."
  });
  assert.equal(explicit.assessment_total_items, 10);
});

test("extract: 8 assessment items (legacy pattern)", () => {
  const { explicit } = extractAndResolve({
    goal: "Generate 8 assessment items on climate policy."
  });
  assert.equal(explicit.assessment_total_items, 8);
});

test("extract: 60-minute seminar does not set item count", () => {
  const { explicit, resolved } = extractAndResolve({
    goal: P27_02_GOAL.replace("complete a 5-item formative check.", "run a 60-minute seminar only.")
  });
  assert.equal(explicit.assessment_total_items, undefined);
  assert.notEqual(resolved.assessment_total_items, 60);
});

test("post-gen queue excludes assessment_total_items when explicit count extracted", () => {
  const brief = { goal: P27_02_GOAL, desiredOutputs: "Learner page." };
  const { explicit, resolved, sources, base } = extractAndResolve(brief);
  assert.equal(sources.assessment_total_items, "explicit");
  const ids = postGenQueueIds(resolved, sources, base);
  assert.equal(ids.includes("assessment_total_items"), false);
});

test("post-gen queue includes assessment_total_items when only default count", () => {
  const brief = {
    goal: "Design a seminar on climate misconceptions with an assessment section at the end.",
    desiredOutputs: "Learner page."
  };
  const { explicit, resolved, sources, base } = extractAndResolve(brief);
  assert.equal(explicit.assessment_total_items, undefined);
  assert.equal(resolved.assessment_total_items, 10);
  assert.equal(sources.assessment_total_items, "default");
  const ids = postGenQueueIds(resolved, sources, base);
  assert.equal(ids.includes("assessment_total_items"), true);
});

test("resolve: explicit brief count wins over later elicited answer", () => {
  const pack = api.resolveWorkflowBriefFactors(
    normalizedLdConfig,
    { assessment_total_items: 5, assessment_required: true },
    { assessment_total_items: 8 },
    {},
    { goal: "Workshop with 5-item formative check.", selectedDomains: ["learning-design"] }
  );
  assert.equal(pack.resolved.assessment_total_items, 5);
  assert.equal(pack.sources.assessment_total_items, "explicit");
});

test("resolve: elicited count applies when brief has no explicit count", () => {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: "Design a seminar on climate misconceptions with an assessment section.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicit.assessment_total_items, undefined);
  const pack = api.resolveWorkflowBriefFactors(
    normalizedLdConfig,
    explicit,
    { assessment_total_items: 8 },
    {},
    { goal: "Design a seminar on climate misconceptions.", selectedDomains: ["learning-design"] }
  );
  assert.equal(pack.resolved.assessment_total_items, 8);
  assert.equal(pack.sources.assessment_total_items, "elicited");
});

test("mapping: assessment_total_items maps to Generate Assessment Items number_of_items", () => {
  const mapped = api.applyWorkflowBriefMappings(normalizedLdConfig, {
    assessment_total_items: 5,
    assessment_type: "mcq",
    assessment_required: true
  });
  const gen = mapped.stepParamPatch.step_generate_assessment_items;
  assert.ok(gen);
  assert.equal(gen.number_of_items, 5);
});

const MARX_GOAL_WITH_COUNT =
  "Create a self study resource about Karl Marx with 10 formative assessment questions.";
const MARX_GOAL_VAGUE_COUNT =
  "Create a self study resource about Karl Marx with formative assessment questions.";

function assessmentItemCountQuestionInQueue(queue) {
  const factor = (queue || []).find((f) => f && f.id === "assessment_total_items");
  if (!factor) return "";
  return String(factor.question || factor.questionText || "");
}

test("extract: 10 formative assessment questions (Marx-style brief)", () => {
  const { explicit } = extractAndResolve({ goal: MARX_GOAL_WITH_COUNT });
  assert.equal(explicit.assessment_total_items, 10);
});

test("post-gen queue: Marx brief with 10 formative assessment questions omits item-count ask", () => {
  const brief = { goal: MARX_GOAL_WITH_COUNT, desiredOutputs: "Learner page." };
  const { resolved, sources, base } = extractAndResolve(brief);
  assert.equal(resolved.assessment_total_items, 10);
  const ids = postGenQueueIds(resolved, sources, base);
  assert.equal(ids.includes("assessment_total_items"), false);
  const question = assessmentItemCountQuestionInQueue(
    api.getAssessmentPostGenerationElicitationQueue(
      normalizedLdConfig,
      base,
      resolved,
      {},
      sources,
      {
        steps: [
          {
            title: "Generate Assessment Items",
            canonical_step_id: "step_generate_assessment_items"
          }
        ]
      }
    )
  );
  assert.equal(question, "");
});

test("post-gen queue: Marx brief without item count may ask for assessment_total_items", () => {
  const brief = { goal: MARX_GOAL_VAGUE_COUNT, desiredOutputs: "Learner page." };
  const { explicit, resolved, sources, base } = extractAndResolve(brief);
  assert.equal(explicit.assessment_total_items, undefined);
  assert.equal(resolved.assessment_total_items, 10);
  assert.equal(sources.assessment_total_items, "default");
  const queue = api.getAssessmentPostGenerationElicitationQueue(
    normalizedLdConfig,
    base,
    resolved,
    {},
    sources,
    {
      steps: [
        {
          title: "Generate Assessment Items",
          canonical_step_id: "step_generate_assessment_items"
        }
      ]
    }
  );
  assert.equal(
    queue.some((f) => f && f.id === "assessment_total_items"),
    true
  );
  assert.match(assessmentItemCountQuestionInQueue(queue), /how many assessment items/i);
});

test("post-gen queue: mapped number_of_items suppresses assessment_total_items ask", () => {
  const brief = { goal: MARX_GOAL_VAGUE_COUNT, desiredOutputs: "Learner page." };
  const { resolved, sources, base } = extractAndResolve(brief);
  const mapped = api.applyWorkflowBriefMappings(normalizedLdConfig, {
    assessment_total_items: 6,
    assessment_required: true
  });
  assert.equal(mapped.stepParamPatch.step_generate_assessment_items.number_of_items, 6);
  const resolvedWithStepCount = Object.assign({}, resolved, {
    assessment_total_items: 10,
    number_of_items: 6
  });
  const ids = postGenQueueIds(resolvedWithStepCount, sources, base);
  assert.equal(ids.includes("assessment_total_items"), false);
});

test("post-gen queue: elicited item count still suppresses repeat ask", () => {
  const brief = { goal: MARX_GOAL_VAGUE_COUNT, desiredOutputs: "Learner page." };
  const { resolved, sources, base } = extractAndResolve(brief);
  const ids = postGenQueueIds(resolved, sources, base, { assessment_total_items: 8 });
  assert.equal(ids.includes("assessment_total_items"), false);
});
