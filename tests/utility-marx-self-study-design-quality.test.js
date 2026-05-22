/**
 * Marx self-study — design quality layer attribution (read-only).
 * Documents that pedagogy issues originate upstream of the renderer, not from hidden fields.
 *
 * Proposed fix target: DLA self-directed material-shape prompt scaffold (see investigation doc).
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
  assert.ok(idx !== -1);
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "marx-self-study-design-quality-page.json"
);
const investigationDoc = path.join(
  repoRoot,
  "docs",
  "development",
  "hotfix-marx-self-study-design-quality-investigation.md"
);

const MARX_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links between experience and theory, comparison of The Communist Manifesto and Das Kapital, and application of core concepts to a factory scenario.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

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

function renderDesignQualityPage(api) {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

test("investigation doc exists for Marx self-study design quality", () => {
  assert.ok(fs.existsSync(investigationDoc));
  const text = fs.readFileSync(investigationDoc, "utf8");
  assert.match(text, /Activity generation \(DLA\)/i);
  assert.match(text, /Renderer.*Not at fault/i);
});

test("Marx design-quality fixture: renderer shows upstream materials (not hidden fields)", () => {
  const html = renderDesignQualityPage(api);
  const a2 = html.match(/Linking Experience[\s\S]*?(?=Comparing Marx|$)/i);
  assert.ok(a2, "activity A2 scope");
  assert.match(a2[0], /util-task-card/, "task_cards render");
  assert.match(a2[0], /util-table-scroll/, "cause-effect table renders");
  assert.match(a2[0], /Cause–Effect Table|Cause Effect Table/i);

  const a3 = html.match(/Comparing Marx[\s\S]*?(?=Explaining Marx|$)/i);
  assert.ok(a3, "activity A3 scope");
  assert.match(a3[0], /Communist Manifesto/);
  assert.match(a3[0], /Das Kapital/);
  assert.doesNotMatch(
    a3[0],
    /util-material-card[\s\S]*What is the Communist Manifesto/i,
    "no orienting work-intro block in fixture (upstream gap)"
  );

  const a4 = html.match(/Explaining Marx[\s\S]*?$/i);
  assert.ok(a4, "activity A4 scope");
  assert.match(a4[0], /util-checkbox-list|util-checklist-block/);
  assert.match(a4[0], /Identify capitalism/);
  assert.match(a4[0], /Factory Scenario/i);
});

test("Marx design-quality fixture: no cognition blocks when upstream omits cognition fields", () => {
  const html = renderDesignQualityPage(api);
  assert.doesNotMatch(html, /<div class="util-cognition\b/);
  assert.doesNotMatch(html, /data-cognition-field=/);
});

test("Marx-like brief: self-directed delivery is inferable from LD brief config", () => {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_BRIEF.goal,
    MARX_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_BRIEF
  );
  assert.equal(resolved.delivery_context, "self_directed");
});

test("Marx-like brief: cognition pack may be inactive without explicit engagement cues", () => {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_BRIEF.goal,
    MARX_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_BRIEF
  );
  const packs = api.resolvePedagogicCognitionPackIds(
    ldBriefConfig,
    resolved,
    explicit,
    MARX_BRIEF
  );
  const hasSelfStudyPack = packs.indexOf("self_study_cognition_pack") !== -1;
  assert.equal(hasSelfStudyPack, false, "Marx brief lacks explicit cognition engagement cues");
  assert.notEqual(resolved.cognitive_engagement_required, true);
  assert.notEqual(resolved.adaptive_scaffolding_required, true);
});

test("DLA prompt scaffold: self-directed material-shape rules for Marx-like learner-page DLA", () => {
  const briefCtx = {
    workflowGoal: MARX_BRIEF.goal,
    inputs: MARX_BRIEF.inputs,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowOutputSpec: { goal: MARX_BRIEF.goal, desiredOutputs: MARX_BRIEF.desiredOutputs }
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_BRIEF.goal,
    MARX_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_BRIEF
  );
  resolved.session_materials = ["page"];

  const baseDraft = "Design executable learning activities.\n";
  const ctx = Object.assign({}, briefCtx, {
    workflowBriefResolution: { resolvedFactors: resolved }
  });
  const augmented = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(baseDraft, ctx),
    ctx
  );

  assert.match(augmented, /self-directed learner-page material shape \(auto-applied\)/i);
  assert.match(augmented, /integrated template or analysis_table/i);
  assert.match(augmented, /orienting text or sample_output/i);
  assert.match(augmented, /numbered learner_task sub-steps/i);
  assert.match(augmented, /roughly four meaningful items/i);
});

test("DLA prompt scaffold: material-shape rules omitted for facilitated delivery", () => {
  const briefCtx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities"
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_BRIEF.goal,
    MARX_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_BRIEF
  );
  resolved.delivery_context = "in_person";
  resolved.session_materials = ["page"];

  const ctx = Object.assign({}, briefCtx, {
    workflowBriefResolution: { resolvedFactors: resolved }
  });
  const augmented = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(
      "Design executable learning activities.\n",
      ctx
    ),
    ctx
  );

  assert.doesNotMatch(augmented, /self-directed learner-page material shape/i);
});

test("DLA prompt scaffold: material-shape rules omitted for GAM step", () => {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_BRIEF.goal,
    MARX_BRIEF.inputs
  );
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_BRIEF
  );
  resolved.session_materials = ["page"];

  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const augmented = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(
      "Generate activity materials.\n",
      ctx
    ),
    ctx
  );

  assert.doesNotMatch(augmented, /self-directed learner-page material shape/i);
});
