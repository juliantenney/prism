/**
 * Self-directed learner-page formatting — bullets, tables, readings, headings.
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

const MARX_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

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
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function marxResolvedFactors() {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_BRIEF.goal,
    MARX_BRIEF.inputs
  );
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, inferred, MARX_BRIEF)
    .resolved;
}

test("renderer: learning purpose bullets strip embedded list markers", () => {
  const html = api.utilityRenderPageSectionsForTest(
    [
      {
        section_id: "learning_purpose",
        heading: "Learning Purpose",
        content: {
          outcomes: [
            "- Identify key stages in Marx's life.",
            "* Connect biography to theoretical development.",
            "• Apply core concepts to a short scenario."
          ]
        }
      }
    ],
    {}
  );
  assert.match(html, /<ul>/);
  assert.match(html, /Identify key stages/i);
  assert.doesNotMatch(html, /<li>\s*-\s*Identify/i);
  assert.doesNotMatch(html, /<li>\s*\*\s*Connect/i);
  assert.doesNotMatch(html, /<li>\s*•\s*Apply/i);
});

test("utilityNormalizeEmbeddedListItemText: strips repeated markers", () => {
  assert.equal(api.utilityNormalizeEmbeddedListItemText("- Identify key stages"), "Identify key stages");
  assert.equal(api.utilityNormalizeEmbeddedListItemText("1. First item"), "First item");
});

test("GAM prompt: table row adequacy scaffold for self-directed learner page", () => {
  const resolved = marxResolvedFactors();
  resolved.delivery_context = "self_directed";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    "Generate activity materials.\n",
    ctx
  );
  assert.match(prompt, /table row adequacy \(auto-applied\)/i);
  assert.match(prompt, /never a single blank row when multiple learner responses/i);
  assert.match(prompt, /one row per expected match/i);
});

test("evaluateTableRowAdequacyForLearnerTask: mapping table with four events needs four rows", () => {
  const task =
    "Match each of the four life events below to the idea it best illustrates in the Event → Idea table.";
  const inadequate = api.evaluateTableRowAdequacyForLearnerTask(
    {
      columns: ["Event", "Idea"],
      rows: [{ Event: "Exile in London", Idea: "" }]
    },
    task
  );
  assert.equal(inadequate.minimumRows, 4);
  assert.equal(inadequate.adequate, false);
  const adequate = api.evaluateTableRowAdequacyForLearnerTask(
    {
      columns: ["Event", "Idea"],
      rows: [
        { Event: "Exile", Idea: "" },
        { Event: "Paris", Idea: "" },
        { Event: "Manifesto", Idea: "" },
        { Event: "Capital", Idea: "" }
      ]
    },
    task
  );
  assert.equal(adequate.adequate, true);
});

test("GAM prompt: reading sufficiency scaffold for self-directed learner page", () => {
  const resolved = marxResolvedFactors();
  resolved.delivery_context = "self_directed";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    "Generate activity materials.\n",
    ctx
  );
  assert.match(prompt, /reading sufficiency \(auto-applied\)/i);
  assert.match(prompt, /substantial enough for independent study/i);
});

test("evaluateSelfDirectedSourceReadingSufficiency: Marx-style reading supports multiple activities", () => {
  const reading = [
    "Karl Marx was born in Trier in 1818 and studied law and philosophy before turning to radical journalism.",
    "Early articles criticised censorship and introduced readers to Hegelian ideas about history and social change.",
    "Exile in Paris and London exposed him to industrial capitalism, factory conditions, and socialist thinkers such as Engels.",
    "The Communist Manifesto (1848) argued that class struggle drives history and that workers must organise collectively.",
    "Das Kapital analysed exploitation, surplus value, commodity fetishism, and the long-term dynamics of capitalist accumulation.",
    "Marx's concept of alienation describes how workers become estranged from labour, its products, and their own potential.",
    "Historical materialism holds that economic structures shape politics, culture, and institutions rather than the reverse.",
    "Key life phases—student years, journalism, exile, collaborative writing, and late revision of Capital—help explain shifts in emphasis across his works.",
    "Learners can use this overview to compare texts, map events to ideas, and apply concepts such as class struggle to brief scenarios."
  ].join(" ");
  const evalResult = api.evaluateSelfDirectedSourceReadingSufficiency(reading, 4);
  assert.ok(evalResult.wordCount >= evalResult.minimumWords);
  assert.equal(evalResult.sufficient, true);
  const thin = api.evaluateSelfDirectedSourceReadingSufficiency("Marx wrote about capitalism.", 4);
  assert.equal(thin.sufficient, false);
});

test("renderer: generic Text heading suppressed when inner util-card-subheading exists", () => {
  const rendered =
    '<div class="util-structured-block"><h5 class="util-card-subheading">Key Life Events</h5><p>Content.</p></div>';
  assert.equal(
    api.utilityMaterialHeadingRedundantWithInner("Text", rendered),
    true
  );
  assert.equal(
    api.utilityMaterialHeadingRedundantWithInner("Support Text", rendered),
    true
  );
  assert.equal(
    api.utilityMaterialHeadingRedundantWithInner("Factory Scenario", rendered),
    false
  );
});

test("GAM prompt: material scaffolds omitted for facilitated delivery", () => {
  const resolved = marxResolvedFactors();
  resolved.delivery_context = "in_person";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    "Generate activity materials.\n",
    ctx
  );
  assert.doesNotMatch(prompt, /table row adequacy \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /reading sufficiency \(auto-applied\)/i);
});
