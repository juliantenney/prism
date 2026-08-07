/**
 * Sprint 41 Slice 5 — delivery-mode independent learner-page pedagogic framing.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, injectLearnerRendererVNextInSandbox, renderUtilityPageHtmlForTest } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

const WORKSHOP_LEARNER_HANDOUT_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

const FACILITATOR_ONLY_BRIEF = {
  goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
  inputs: "Face-to-face classroom with tutor facilitation",
  desiredOutputs: "Facilitator guide and slide deck",
  selectedDomains: ["learning-design"]
};

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function resolveBrief(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  ).resolved;
}

function buildCtx(brief, resolved, stepId, stepTitle) {
  return {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowInputs: brief.inputs || "",
    stepCanonicalStepId: stepId,
    stepCanonicalTitle: stepTitle,
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

test("41-5: learner handout brief triggers pedagogic framing scaffold", () => {
  const resolved = resolveBrief(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const base = {
    goal: WORKSHOP_LEARNER_HANDOUT_BRIEF.goal,
    desiredOutputs: WORKSHOP_LEARNER_HANDOUT_BRIEF.desiredOutputs
  };
  const ctx = buildCtx(
    WORKSHOP_LEARNER_HANDOUT_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assert.equal(
    api.shouldApplyLearnerPagePedagogicFramingScaffold(ctx, resolved, base),
    true
  );
  assert.equal(api.isFacilitatedLearnerPageFramingContext(ctx, resolved, base), true);
});

test("41-5: facilitator-only brief does not trigger pedagogic framing scaffold", () => {
  const resolved = resolveBrief(FACILITATOR_ONLY_BRIEF);
  const base = {
    goal: FACILITATOR_ONLY_BRIEF.goal,
    desiredOutputs: FACILITATOR_ONLY_BRIEF.desiredOutputs
  };
  const ctx = buildCtx(
    FACILITATOR_ONLY_BRIEF,
    resolved,
    "step_design_learning_activities",
    "Design Learning Activities"
  );
  assert.equal(
    api.shouldApplyLearnerPagePedagogicFramingScaffold(ctx, resolved, base),
    false
  );
});

test("41-5: workshop learner handout Design Page partial path excludes authorial exposition", () => {
  const resolved = resolveBrief(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: WORKSHOP_LEARNER_HANDOUT_BRIEF.goal,
    desiredOutputs: WORKSHOP_LEARNER_HANDOUT_BRIEF.desiredOutputs,
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: WORKSHOP_LEARNER_HANDOUT_BRIEF.goal },
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applyWorkflowStepRuntimePromptAugmentations(
    "Assemble learner page.\n",
    step,
    wf
  );
  assert.match(prompt, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT/i);
});

test("41-5: workshop learner page renders upstream framing fields in HTML", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Climate misconception workshop — learner handout",
    page_profile: { profile_type: "learner" },
    constraints_applied: {
      delivery_mode: "live_workshop",
      learning_environments: ["classroom"]
    },
    assembly_state: {
      enriched_by: ["design_page"],
      current_stage: "design_page"
    },
    activities: [
      {
        activity_id: "A1",
        title: "Misconception discussion",
        activity_preamble: "Before you classify claims, note what would make each sound persuasive.",
        intellectual_frame: "You are evaluating evidence quality, not debating opinions.",
        reasoning_orientation: "Separate weather anecdotes from climate trend evidence.",
        self_explanation_prompt: "State one criterion you used before checking the template.",
        conceptual_contrast_prompt: "Contrast weather variability with long-term climate change.",
        learner_task: "Complete the analysis template for one claim.",
        expected_output: "A completed analysis template for one claim.",
        facilitator_moves: "Allow 8 minutes then ask pairs to compare classifications.",
        episode_plan: {
          archetype: "understand",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "verification" }
          ]
        },
        materials: []
      }
    ]
  };
  const r = renderUtilityPageHtmlForTest(api, page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /util-activity-preamble/);
  assert.match(html, /Before you classify claims/);
  assert.match(html, /Misconception discussion/);
  assert.match(html, /Complete the analysis template/);
  assert.doesNotMatch(html, /Allow 8 minutes/i);
});
