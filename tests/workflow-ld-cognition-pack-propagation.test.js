/**
 * Sprint 28-5a — cognition packs + lean-path preservation (topology trace only).
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

function hasTitle(titles, name) {
  return titles.some((t) => t.toLowerCase() === String(name).toLowerCase());
}

const api = loadPrismTestApi();
const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldWorkflowPolicy = extractLdWorkflowPolicy(ldMd);
const ldBriefConfig = api.normalizeWorkflowBriefConfig(extractWorkflowBriefConfig(ldMd));

function resolveAndApply(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: ["learning-design"]
  });
  const { resolved } = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    {},
    brief
  );
  const packs = api.resolvePedagogicCognitionPackIds(ldBriefConfig, resolved, explicit, brief);
  const cognitionIntent = api.hasPedagogicCognitionIntent(resolved, explicit, brief, ldBriefConfig);
  const topo = api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(TOPOLOGY_SEED)), {
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
        delivery_context: "in_person"
      },
      resolved
    )
  });
  return { explicit, resolved, packs, cognitionIntent, titles: stepTitles(topo) };
}

test("28-5a: peer instruction resolves peer_instruction_pack", () => {
  const { packs, cognitionIntent } = resolveAndApply({
    goal:
      "Peer instruction on stoichiometry: predict individually, discuss in pairs, revise answers. Include 6 MCQs.",
    selectedDomains: ["learning-design"]
  });
  assert.ok(packs.includes("peer_instruction_pack"));
  assert.equal(cognitionIntent, true);
});

test("28-5a: transcript brief resolves transcript_transformation_pack", () => {
  const { packs } = resolveAndApply({
    goal:
      "Using the provided lecture transcript, create learning activities and a short formative assessment on RNA viruses.",
    desiredOutputs: "Learning activities and short formative assessment.",
    startingArtefact: "provided_source_content",
    selectedDomains: ["learning-design"]
  });
  assert.ok(packs.includes("transcript_transformation_pack"));
});

test("28-5a: cognition intent preserves Design Learning Activities on MCQ+peer brief", () => {
  const { titles, cognitionIntent } = resolveAndApply({
    goal:
      "Create a peer instruction session with 6 MCQs. Students discuss in pairs then revise answers.",
    desiredOutputs: "Learner page with MCQs.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(cognitionIntent, true);
  assert.ok(hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
  assert.ok(hasTitle(titles, "Generate Activity Materials"), titles.join(" | "));
});

test("28-5a: retrieval quiz stays lean without cognition packs", () => {
  const { packs, cognitionIntent, titles } = resolveAndApply({
    goal:
      "Create a self-study revision page on photosynthesis with a 10-item MCQ quiz. Show answers at the end.",
    desiredOutputs: "Self-study revision page with MCQ and answer reveal.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(packs.length, 0);
  assert.equal(cognitionIntent, false);
  assert.ok(!hasTitle(titles, "Design Learning Activities"), titles.join(" | "));
});

test("28-5a: hasPedagogicCognitionIntent matches factor or pack", () => {
  const explicit = { reasoning_revision_required: true };
  const resolved = { reasoning_revision_required: true };
  assert.equal(
    api.hasPedagogicCognitionIntent(resolved, explicit, {}, ldBriefConfig),
    true
  );
  assert.equal(
    api.hasPedagogicCognitionIntent({}, {}, { goal: "10-item MCQ quiz" }, ldBriefConfig),
    false
  );
});
