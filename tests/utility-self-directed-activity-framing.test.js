/**
 * Self-directed learner-page activity framing — DLA scaffold + renderer passthrough.
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
  "page-render",
  "self-directed-activity-framing-page.json"
);
const docPath = path.join(
  repoRoot,
  "docs",
  "development",
  "hotfix-self-directed-activity-framing.md"
);

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function dlaDraftWithMarxBrief() {
  const briefCtx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    inputs: MARX_SELF_STUDY_BRIEF.inputs,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowOutputSpec: {
      goal: MARX_SELF_STUDY_BRIEF.goal,
      desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs
    }
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_SELF_STUDY_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_SELF_STUDY_BRIEF.goal,
    MARX_SELF_STUDY_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_SELF_STUDY_BRIEF
  );
  resolved.session_materials = ["page"];
  const ctx = Object.assign({}, briefCtx, {
    workflowBriefResolution: { resolvedFactors: resolved }
  });
  return api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(
      "Design executable learning activities.\n",
      ctx
    ),
    ctx
  );
}

function renderFramingFixture() {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

test("investigation doc exists for self-directed activity framing", () => {
  assert.ok(fs.existsSync(docPath));
  const text = fs.readFileSync(docPath, "utf8");
  assert.match(text, /activity framing|Sprint 28/i);
  assert.match(text, /Generation remains authoritative|generation-level/i);
});

test("DLA scaffold: self-directed learner-page activity framing rules present", () => {
  const augmented = dlaDraftWithMarxBrief();
  assert.match(augmented, /learner-page activity framing \(auto-applied\)/i);
  assert.match(augmented, /activity_preamble/i);
  assert.match(augmented, /prior_knowledge_activation|reasoning_orientation/i);
  assert.match(augmented, /self_explanation_prompt/i);
  assert.match(augmented, /do not repeat the activity title/i);
  assert.match(augmented, /output contract \(learner-facing page/i);
});

test("renderer: activity_preamble appears before What to do", () => {
  const html = renderFramingFixture();
  const a2 = html.match(/Linking Experience to Theory[\s\S]*?(?=Comparing Marx|$)/i);
  assert.ok(a2, "A2 activity scope");
  const preambleIdx = a2[0].indexOf("util-activity-preamble");
  const taskIdx = a2[0].indexOf("What to do");
  assert.ok(preambleIdx !== -1, "expected util-activity-preamble");
  assert.ok(taskIdx !== -1, "expected What to do heading");
  assert.ok(preambleIdx < taskIdx, "preamble must precede task instructions");
  assert.match(a2[0], /political exile might shape someone/i);
});

test("renderer: cognition-oriented fields render without cognition-heavy brief", () => {
  const html = renderFramingFixture();
  const a3 = html.match(/Comparing Marx[\s\S]*?$/i);
  assert.ok(a3, "A3 activity scope");
  assert.match(a3[0], /util-cognition--explain/);
  assert.match(a3[0], /self_explanation_prompt|data-cognition-field="self_explanation_prompt"/);
  assert.match(a3[0], /How to think:/);
});

test("renderer: preamble wording is concise in fixture", () => {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const activities = parsed.sections[0].content;
  activities.forEach((act) => {
    const text = String(act.activity_preamble || "");
    const words = text.split(/\s+/).filter(Boolean);
    assert.ok(words.length <= 45, `preamble too long (${words.length} words)`);
  });
});

test("renderer 30-1b: study_orientation and intellectual_frame on A2 before What to do", () => {
  const html = renderFramingFixture();
  const a2 = html.match(/Linking Experience to Theory[\s\S]*?(?=Comparing Marx|$)/i);
  assert.ok(a2, "A2 activity scope");
  assert.match(a2[0], /Study orientation:/i);
  assert.match(a2[0], /Intellectual frame:/i);
  assert.match(a2[0], /life phases to comparing texts/i);
  assert.match(a2[0], /thinking like a historian/i);
  const orientIdx = a2[0].indexOf("Study orientation:");
  const taskIdx = a2[0].indexOf("What to do");
  assert.ok(orientIdx !== -1 && taskIdx !== -1);
  assert.ok(orientIdx < taskIdx);
});

test("renderer 30-2r: PEL reasoning fields on A3 before What to do", () => {
  const html = renderFramingFixture();
  const a3 = html.match(/Comparing Marx[\s\S]*?$/i);
  assert.ok(a3, "A3 activity scope");
  assert.match(a3[0], /Disciplinary lens:/i);
  assert.match(a3[0], /Using evidence:/i);
  assert.match(a3[0], /Structuring your response:/i);
  assert.match(a3[0], /Key distinction:/i);
  assert.match(a3[0], /Cite a phrase from each excerpt/i);
  assert.match(a3[0], /revolutionary programme with systematic critique/i);
  const evidenceIdx = a3[0].indexOf("Using evidence:");
  const taskIdx = a3[0].indexOf("What to do");
  assert.ok(evidenceIdx !== -1 && taskIdx !== -1);
  assert.ok(evidenceIdx < taskIdx);
});

test("renderer 30-1b: intellectual_coherence_bridge on A3 before What to do", () => {
  const html = renderFramingFixture();
  const a3 = html.match(/Comparing Marx[\s\S]*?$/i);
  assert.ok(a3, "A3 activity scope");
  assert.match(a3[0], /Connection to previous activity:/i);
  assert.match(a3[0], /cause–effect links you traced/i);
  const bridgeIdx = a3[0].indexOf("Connection to previous activity:");
  const taskIdx = a3[0].indexOf("What to do");
  assert.ok(bridgeIdx !== -1 && taskIdx !== -1);
  assert.ok(bridgeIdx < taskIdx);
  assert.doesNotMatch(a3[0], /Study orientation:/i);
});

test("slice 31-2: framing rail wraps preamble before primary task", () => {
  const html = renderFramingFixture();
  const a2 = html.match(/Linking Experience to Theory[\s\S]*?(?=Comparing Marx|$)/i);
  assert.ok(a2, "A2 activity scope");
  assert.match(a2[0], /util-activity-framing/);
  assert.match(a2[0], /util-activity-task--primary/);
  const framingIdx = a2[0].indexOf("util-activity-framing");
  const taskIdx = a2[0].indexOf("util-activity-task--primary");
  assert.ok(framingIdx !== -1 && taskIdx !== -1);
  assert.ok(framingIdx < taskIdx);
  assert.match(a2[0], /Study orientation:/i);
  assert.match(a2[0], /Intellectual frame:/i);
});

test("slice 31-5: framing fixture keeps distinct orientation and reasoning cues", () => {
  const html = renderFramingFixture();
  const a2 = html.match(/Linking Experience to Theory[\s\S]*?(?=Comparing Marx|$)/i);
  assert.ok(a2);
  assert.match(a2[0], /Study orientation:/i);
  assert.match(a2[0], /Intellectual frame:/i);
  assert.match(a2[0], /political exile might shape someone/i);
  const a3 = html.match(/Comparing Marx[\s\S]*?$/i);
  assert.ok(a3);
  assert.match(a3[0], /How to think:/i);
  assert.match(a3[0], /Using evidence:/i);
  assert.match(a3[0], /Key distinction:/i);
});

test("slice 31-2: reasoning cues remain before primary task on A3", () => {
  const html = renderFramingFixture();
  const a3 = html.match(/Comparing Marx[\s\S]*?$/i);
  assert.ok(a3, "A3 activity scope");
  assert.match(a3[0], /How to think:/i);
  assert.match(a3[0], /util-pel-reasoning-cue/);
  const thinkIdx = a3[0].indexOf("How to think:");
  const taskIdx = a3[0].indexOf("util-activity-task--primary");
  assert.ok(thinkIdx !== -1 && taskIdx !== -1);
  assert.ok(thinkIdx < taskIdx);
});

test("41-5: DLA scaffold applies learner-page framing for in-person learner page delivery", () => {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_SELF_STUDY_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_SELF_STUDY_BRIEF.goal,
    MARX_SELF_STUDY_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_SELF_STUDY_BRIEF
  );
  resolved.delivery_context = "in_person";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const augmented = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(
      "Design executable learning activities.\n",
      ctx
    ),
    ctx
  );
  assert.match(augmented, /learner-page activity framing \(auto-applied\)/i);
  assert.match(augmented, /output contract \(learner-facing page/i);
  assert.doesNotMatch(augmented, /self-directed learner-page material shape \(auto-applied\)/i);
});
