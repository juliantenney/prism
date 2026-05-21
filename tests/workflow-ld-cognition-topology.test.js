/**
 * Sprint 28-5b — cognition-aware orchestration topology preservation.
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

const TOPOLOGY_SEED = {
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

function extractLdWorkflowPolicy(md) {
  const idx = md.indexOf("### Workflow Policy");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowPolicy;
}

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

function stepTitles(out) {
  return (out.steps || []).map((s) => String(s.title || "").trim());
}

function indexOfTitle(titles, name) {
  return titles.findIndex((t) => t.toLowerCase() === String(name).toLowerCase());
}

function hasTitle(titles, name) {
  return indexOfTitle(titles, name) !== -1;
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);
const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));
const rnaFixture = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));

function topologyForBrief(brief, seed) {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: ["learning-design"]
  });
  const { resolved } = api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, {}, brief);
  const packs = api.resolvePedagogicCognitionPackIds(ldBriefConfig, resolved, explicit, brief);
  const orch = api.resolvePedagogicCognitionOrchestrationSemantics(
    packs,
    resolved,
    explicit,
    brief
  );
  const topo = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(seed || TOPOLOGY_SEED)), {
    selectedDomains: ["general", "learning-design"],
    workflowPolicy: ldWorkflowPolicy,
    workflowBriefConfig: ldBriefConfig,
    stepPatternCatalog: [],
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    explicitBriefFactors: explicit,
    resolvedBriefFactors: Object.assign(
      {
        session_materials: ["page"],
        input_strategy: resolved.input_strategy || brief.startingArtefact || "generate_from_topic",
        design_scope: "session",
        delivery_context: brief.delivery_context || "in_person"
      },
      resolved
    )
  });
  return {
    explicit,
    resolved,
    packs,
    orch,
    titles: stepTitles(topo)
  };
}

test("28-5b: orchestration semantics for peer_instruction_pack", () => {
  const { packs, orch } = topologyForBrief({
    goal:
      "Peer instruction: predict individually, discuss in pairs, revise answers. Include 6 MCQs.",
    selectedDomains: ["learning-design"]
  });
  assert.ok(packs.includes("peer_instruction_pack"));
  assert.equal(orch.cognitionTopologyRequired, true);
  assert.equal(orch.preserveLearningActivityChain, true);
  assert.equal(orch.cognitionAwareAssessmentFlow, true);
  assert.ok(orch.preservedCognitionStages.includes("Design Learning Activities"));
});

test("28-5b: peer MCQ brief preserves DLA before GAI and activity steps", () => {
  const { titles, orch } = topologyForBrief({
    goal:
      "Create a peer instruction session with 6 MCQs. Students discuss in pairs then revise answers.",
    desiredOutputs: "Learner page with MCQs.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(orch.cognitionTopologyRequired, true);
  assert.ok(hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
  assert.ok(hasTitle(titles, "Generate Activity Materials"), titles.join(" | "));
  const dla = indexOfTitle(titles, "Design Learning Activities");
  const gai = indexOfTitle(titles, "Generate Assessment Items");
  assert.ok(dla !== -1 && gai !== -1);
  assert.ok(dla < gai, "DLA should precede GAI when cognition-aware flow");
});

test("28-5b: misconception workshop preserves GAM and CLS", () => {
  const { titles, packs, orch } = topologyForBrief({
    goal:
      "Misconception discussion workshop on climate myths and false claims. Groups confront ideas with evidence, then a diagnostic check.",
    inputs: "Uploaded lecture transcript on climate science.",
    desiredOutputs: "Learner workshop page.",
    startingArtefact: "provided_source_content",
    selectedDomains: ["learning-design"]
  });
  assert.ok(
    packs.includes("misconception_repair_pack") || packs.includes("transcript_transformation_pack")
  );
  assert.equal(orch.preserveLearningActivityChain, true);
  assert.ok(hasTitle(titles, "Generate Activity Materials"), titles.join(" | "));
  assert.ok(hasTitle(titles, "Construct Learning Sequence"), titles.join(" | "));
});

test("28-5b: transcript transformation preserves activity chain (not assessment-only)", () => {
  const { titles, packs } = topologyForBrief({
    goal:
      "Using the provided lecture transcript, create learning activities and a short formative assessment on RNA viruses.",
    desiredOutputs: "Learning activities and formative assessment.",
    startingArtefact: "provided_source_content",
    selectedDomains: ["learning-design"]
  });
  assert.ok(packs.includes("transcript_transformation_pack"));
  assert.ok(hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
  assert.ok(hasTitle(titles, "Generate Activity Materials"), titles.join(" | "));
});

test("28-5b: RNA sparse fixture with cognition factors keeps full activity chain", () => {
  const brief = Object.assign({}, rnaFixture.brief, {
    goal:
      rnaFixture.brief.goal +
      " Include dialogic learning activities with misconception confrontation and evidence."
  });
  const { titles, packs } = topologyForBrief(brief, {
    steps: [
      { title: "Normalize Content", role: "" },
      { title: "Model Knowledge", role: "" },
      { title: "Define Learning Outcomes", role: "" },
      { title: "Generate Assessment Items", role: "" },
      { title: "Design Page", role: "" }
    ]
  });
  assert.ok(packs.length > 0);
  assert.ok(hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
});

test("28-5b: retrieval quiz stays lean without cognition topology", () => {
  const { titles, packs, orch } = topologyForBrief({
    goal:
      "Create a self-study revision page on photosynthesis with a 10-item MCQ quiz. Show answers at the end.",
    desiredOutputs: "Self-study revision page with MCQ and answer reveal.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(packs.length, 0);
  assert.equal(orch.cognitionTopologyRequired, false);
  assert.ok(!hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
});

test("28-5b: self_study_cognition_pack preserves activity stage", () => {
  const { titles, packs, orch } = topologyForBrief({
    goal:
      "Asynchronous CPD self-study resource with step-by-step hints if learners struggle. Include cognitive engagement in the learning process.",
    desiredOutputs: "Self-study page.",
    delivery_context: "self_directed",
    selectedDomains: ["learning-design"]
  });
  assert.ok(packs.includes("self_study_cognition_pack"));
  assert.equal(orch.preserveLearningActivityChain, true);
  assert.ok(hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
});

test("28-5b regression: P27-03 peer brief still DLA before GAI", () => {
  const { titles } = topologyForBrief({
    goal:
      "Create a peer instruction session on stoichiometry: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts.",
    inputs: "First-year chemistry; 90-minute lab session.",
    desiredOutputs: "Learner-facing session page with activities and MCQ check.",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"]
  });
  const dla = indexOfTitle(titles, "Design Learning Activities");
  const gai = indexOfTitle(titles, "Generate Assessment Items");
  assert.ok(dla < gai);
});
