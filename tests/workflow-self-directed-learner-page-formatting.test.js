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
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-table-fidelity.js"), "utf8"),
    sandbox,
    { filename: "ld-table-fidelity.js" }
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-materials-copy.js"), "utf8"),
    sandbox,
    { filename: "ld-materials-copy.js" }
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-math-render.js"), "utf8"),
    sandbox,
    { filename: "ld-math-render.js" }
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-self-directed-rhetoric.js"), "utf8"),
    sandbox,
    { filename: "ld-self-directed-rhetoric.js" }
  );
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
  assert.match(prompt, /LD-TABLE-FIDELITY \(auto-applied\)/i);
  assert.match(prompt, /LD-MATERIALS-COPY \| Layer: L4/i);
  assert.match(prompt, /Author role \(Generate Activity Materials\)/i);
  assert.doesNotMatch(prompt, /LD-MATERIALS-COPY \(auto-applied\)/i);
  assert.match(prompt, /never a single blank row when multiple learner responses/i);
  assert.match(prompt, /one row per expected match/i);
  assert.match(prompt, /complete pipe table with header row, divider row/i);
});

test("DLA prompt: LD-TABLE-FIDELITY spec role for self-directed learner page", () => {
  const resolved = marxResolvedFactors();
  resolved.delivery_context = "self_directed";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applyLdTableFidelityContractToDraft(
    "Design learning activities.\n",
    ctx
  );
  assert.match(prompt, /LD-TABLE-FIDELITY \(auto-applied\)/i);
  assert.match(prompt, /Spec role \(Design Learning Activities\)/i);
  assert.match(prompt, /pipe markdown tables in Generate Activity Materials/i);
  assert.doesNotMatch(prompt, /Author role \(Generate Activity Materials\)/i);
  assert.doesNotMatch(prompt, /Preserve role \(Design Page\)/i);
});

test("DLA prompt: table fidelity omitted for facilitated delivery", () => {
  const resolved = marxResolvedFactors();
  resolved.delivery_context = "in_person";
  resolved.session_materials = ["page"];
  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applyLdTableFidelityContractToDraft(
    "Design learning activities.\n",
    ctx
  );
  assert.doesNotMatch(prompt, /LD-TABLE-FIDELITY \(auto-applied\)/i);
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
  assert.match(prompt, /self-directed learner-page self-study materials \(auto-applied\)/i);
  assert.match(prompt, /substantial enough for independent study/i);
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

const MARX_ORDERING_TASK =
  "Arrange the key life events in chronological order in the timeline table.";

const MARX_CHRONO_EVENT_LIST = [
  "1818 — Born in Trier",
  "1835–1841 — University years in Bonn and Berlin",
  "1842–1843 — Journalism in Cologne",
  "1843–1845 — Paris exile begins",
  "1848 — Communist Manifesto published",
  "1849 — Continued political exile",
  "1867 — Das Kapital Vol. 1 published",
  "1883 — Death in London"
].join("\n");

const MARX_MIXED_EVENT_LIST = [
  "1848 — Communist Manifesto published",
  "1818 — Born in Trier",
  "1883 — Death in London",
  "1835–1841 — University years in Bonn and Berlin",
  "1867 — Das Kapital Vol. 1 published",
  "1842–1843 — Journalism in Cologne",
  "1849 — Continued political exile"
].join("\n");

test("learnerTaskRequiresChronologicalOrdering: Marx arrange task requires ordering", () => {
  assert.equal(api.learnerTaskRequiresChronologicalOrdering(MARX_ORDERING_TASK), true);
  assert.equal(
    api.learnerTaskRequiresChronologicalOrdering(
      "Read the key life events and explain which phase most shaped Marx's critique of capitalism."
    ),
    false
  );
});

test("evaluateTimelineSequencingMaterialAlignment: chronological source fails ordering task", () => {
  const bad = api.evaluateTimelineSequencingMaterialAlignment({
    activity_id: "A1",
    learner_task: MARX_ORDERING_TASK,
    materials: {
      text: { heading: "Key Life Events", content: MARX_CHRONO_EVENT_LIST }
    }
  });
  assert.equal(bad.requiresOrdering, true);
  assert.equal(bad.chronologicallyOrdered, true);
  assert.equal(bad.aligned, false);
});

test("evaluateTimelineSequencingMaterialAlignment: mixed-order source passes ordering task", () => {
  const good = api.evaluateTimelineSequencingMaterialAlignment({
    activity_id: "A1",
    learner_task: MARX_ORDERING_TASK,
    materials: {
      text: { heading: "Key Life Events", content: MARX_MIXED_EVENT_LIST }
    }
  });
  assert.equal(good.requiresOrdering, true);
  assert.equal(good.chronologicallyOrdered, false);
  assert.equal(good.aligned, true);
});

test("evaluateTimelineSequencingMaterialAlignment: chronological source allowed for interpretation task", () => {
  const ok = api.evaluateTimelineSequencingMaterialAlignment({
    activity_id: "A1",
    learner_task:
      "Read the key life events below and explain which phase most influenced Marx's later economic analysis.",
    materials: {
      text: { heading: "Key Life Events", content: MARX_CHRONO_EVENT_LIST }
    }
  });
  assert.equal(ok.requiresOrdering, false);
  assert.equal(ok.aligned, true);
});

test("DLA prompt: timeline sequencing alignment scaffold for self-directed learner page", () => {
  const resolved = marxResolvedFactors();
  const ctx = {
    workflowGoal: MARX_BRIEF.goal,
    desiredOutputs: MARX_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    "Design executable learning activities.\n",
    ctx
  );
  assert.match(prompt, /timeline sequencing alignment \(auto-applied\)/i);
  assert.match(prompt, /must not already be in chronological order/i);
  assert.match(prompt, /unordered event list for learner sequencing/i);
  assert.match(prompt, /activity_interaction_type to sequencing or ranking/i);
  assert.match(prompt, /ordering\.canonical_order/i);
  assert.match(prompt, /learner_display_order/i);
});

test("GAM prompt: timeline sequencing alignment scaffold for self-directed learner page", () => {
  const resolved = marxResolvedFactors();
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
  assert.match(prompt, /deliberately mixed or non-chronological order/i);
  assert.match(prompt, /deliberately mixed or non-chronological order/i);
  assert.match(prompt, /structured entries \(prefer item_id\/title\/instruction fields\)/i);
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
  assert.doesNotMatch(prompt, /LD-TABLE-FIDELITY \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /self-directed learner-page self-study materials \(auto-applied\)/i);
});
