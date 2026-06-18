/**
 * Sprint 28-5c — typed DLA/GAM cognition generation contracts (bounded).
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

const PEER_GOAL =
  "Peer instruction session: individual answer, pair discussion, then revise answers after discussion.";

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
const rnaFixture = JSON.parse(fs.readFileSync(rnaFixturePath, "utf8"));

function resolveContext(brief) {
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
  const contract = api.resolvePedagogicCognitionContractRequirements(
    packs,
    resolved,
    explicit,
    ldBriefConfig,
    brief
  );
  return { explicit, resolved, packs, contract };
}

test("28-5c: no cognition packs → null contract", () => {
  const { contract } = resolveContext({
    goal: rnaFixture.brief.goal,
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"]
  });
  assert.equal(contract, null);
});

test("28-5c: peer_instruction_pack → peer revision fields", () => {
  const { contract, packs } = resolveContext({
    goal: PEER_GOAL,
    selectedDomains: ["learning-design"]
  });
  assert.ok(packs.includes("peer_instruction_pack"));
  assert.ok(contract.dlaFieldIds.includes("reasoning_revision_prompt"));
  assert.ok(contract.dlaFieldIds.includes("initial_position_prompt"));
  assert.ok(contract.dlaFieldIds.includes("revision_trigger"));
});

test("28-5c: misconception_repair_pack → reconciliation fields", () => {
  const { contract } = resolveContext({
    goal:
      "Confront the common misconception with evidence and reconcile student understanding before assessment.",
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract.dlaFieldIds.includes("misconception_claim"));
  assert.ok(contract.dlaFieldIds.includes("reconciliation_prompt"));
  assert.ok(contract.dlaFieldIds.includes("evidence_contrast"));
});

test("28-5c: transcript_transformation_pack → transformation fields", () => {
  const { contract } = resolveContext({
    goal: "Transform the provided transcript into applied learning tasks.",
    startingArtefact: "provided_source_content",
    desiredOutputs: "learning activities and materials",
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract.dlaFieldIds.includes("transformation_activity"));
  assert.ok(contract.dlaFieldIds.includes("source_to_application_prompt"));
});

test("28-5c: self_study_cognition_pack → self-study cognition fields", () => {
  const { contract } = resolveContext({
    goal:
      "Self-study CPD resource with structured cognitive engagement and self-explanation prompts.",
    delivery_context: "self_directed",
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract.dlaFieldIds.includes("self_explanation_prompt"));
  assert.ok(contract.dlaFieldIds.includes("transfer_or_application_task"));
});

test("28-5c: adaptive_scaffolding_required → scaffold_hint_sequence", () => {
  const explicit = {
    adaptive_scaffolding_required: true,
    cognitive_engagement_required: true
  };
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    {},
    { goal: "Self-study module with hints.", selectedDomains: ["learning-design"] }
  ).resolved;
  const packs = api.resolvePedagogicCognitionPackIds(ldBriefConfig, resolved, explicit, {
    goal: "Self-study module with hints."
  });
  const contract = api.resolvePedagogicCognitionContractRequirements(
    packs,
    resolved,
    explicit,
    ldBriefConfig,
    { goal: "Self-study module with hints." }
  );
  assert.ok(contract.dlaFieldIds.includes("scaffold_hint_sequence"));
});

test("28-5c: productive_uncertainty_required → uncertainty_tension_prompt", () => {
  const { contract } = resolveContext({
    goal: "Explore competing evidence, uncertainty, and competing explanations in class.",
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract);
  assert.ok(contract.dlaFieldIds.includes("uncertainty_tension_prompt"));
});

test("28-5c: DLA contract satisfaction detects present and missing fields", () => {
  const { contract } = resolveContext({
    goal: PEER_GOAL,
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract);
  const partial = {
    activities: [
      {
        activity_id: "a1",
        initial_position_prompt: "State your prediction.",
        revision_trigger: "After pair discussion"
      }
    ]
  };
  const partialEval = api.evaluatePedagogicCognitionContractSatisfaction(
    partial,
    contract,
    "dla"
  );
  assert.equal(partialEval.satisfied, false);
  assert.ok(partialEval.missingFields.includes("reasoning_revision_prompt"));

  const full = {
    activities: [
      {
        activity_id: "a1",
        initial_position_prompt: "State your prediction.",
        reasoning_revision_prompt: "Revise your answer using pair evidence.",
        revision_trigger: "After pair discussion"
      }
    ]
  };
  const fullEval = api.evaluatePedagogicCognitionContractSatisfaction(full, contract, "dla");
  assert.equal(fullEval.satisfied, true);
  assert.ok(fullEval.generatedFields.includes("reasoning_revision_prompt"));
});

test("28-5c: GAM text contract detects cognition cue sections", () => {
  const { contract } = resolveContext({
    goal: PEER_GOAL,
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract);
  const block = api.buildPedagogicCognitionContractPromptBlock("gam", contract);
  assert.match(block, /Cognition cues/i);
  const gamText = [
    "Activity: Peer predict",
    "Cognition cues",
    "Initial position: Write your first prediction.",
    "Reasoning revision: Update your explanation.",
    "Revision trigger: After pair discussion."
  ].join("\n");
  const evalResult = api.evaluatePedagogicCognitionContractSatisfaction(
    gamText,
    contract,
    "gam"
  );
  assert.equal(evalResult.satisfied, true);
});

test("49-2: GAM cognition contract excludes Material: ... (text) from cognition-cue requirement", () => {
  const { contract } = resolveContext({
    goal: PEER_GOAL,
    selectedDomains: ["learning-design"]
  });
  assert.ok(contract);
  const block = api.buildPedagogicCognitionContractPromptBlock("gam", contract);
  assert.match(block, /non-text activity material block/i);
  assert.match(block, /except Material: \.\.\. \(text\)/i);
  assert.match(block, /exposition-only/i);
  assert.match(block, /do NOT append Cognition cues sections or orientation metadata inside text Content/i);
  assert.doesNotMatch(block, /For each activity material block, add a learner-facing Cognition cues/i);
});

test("49 C3: cognition labels inside Material: ... (text) do not satisfy GAM cognition coverage", () => {
  const { contract } = resolveContext({
    goal: PEER_GOAL,
    selectedDomains: ["learning-design"]
  });
  const gamText = [
    "Activity: Peer predict",
    "Activity ID: A1",
    "",
    "Material: M1 (text)",
    "Purpose: exposition",
    "Content:",
    "Cognition cues",
    "Initial position: Write your first prediction inside exposition.",
    "Reasoning revision: Update your explanation after discussion.",
    "Revision trigger: After pair discussion.",
    "---"
  ].join("\n");
  const evalResult = api.evaluatePedagogicCognitionContractSatisfaction(
    gamText,
    contract,
    "gam"
  );
  assert.equal(evalResult.satisfied, false);
  assert.ok(evalResult.missingFields.includes("Initial position"));
  assert.ok(evalResult.missingFields.includes("Reasoning revision"));
});

test("49 C3: cognition cues on non-text materials satisfy GAM cognition coverage", () => {
  const { contract } = resolveContext({
    goal: PEER_GOAL,
    selectedDomains: ["learning-design"]
  });
  const gamText = [
    "Activity: Peer predict",
    "Activity ID: A1",
    "",
    "Material: M1 (text)",
    "Purpose: exposition",
    "Content:",
    "Substantive connective exposition only — no cognition cue appendages.",
    "---",
    "Material: M2 (checklist)",
    "Purpose: verification",
    "Content:",
    "Cognition cues",
    "Initial position: Write your first prediction.",
    "Reasoning revision: Update your explanation.",
    "Revision trigger: After pair discussion.",
    "---"
  ].join("\n");
  const evalResult = api.evaluatePedagogicCognitionContractSatisfaction(
    gamText,
    contract,
    "gam"
  );
  assert.equal(evalResult.satisfied, true);
});

test("28-5c: DLA prompt scaffold appends contract block when packs active", () => {
  const ctx = {
    stepCanonicalStepId: "step_design_learning_activities",
    stepCanonicalTitle: "Design Learning Activities",
    workflowGoal: PEER_GOAL,
    workflowOutputSpec: { goal: PEER_GOAL }
  };
  const draft = api.applyPedagogicCognitionContractScaffoldToDraft(
    "Design activities JSON output.",
    ctx
  );
  assert.match(draft, /Pedagogic cognition contract \(auto-applied\)/i);
  assert.match(draft, /reasoning_revision_prompt/);
});

test("28-5c: lean RNA brief scaffold unchanged without cognition packs", () => {
  const ctx = {
    stepCanonicalStepId: "step_design_learning_activities",
    stepCanonicalTitle: "Design Learning Activities",
    workflowGoal: rnaFixture.brief.goal,
    workflowOutputSpec: { goal: rnaFixture.brief.goal }
  };
  const draft = api.applyPedagogicCognitionContractScaffoldToDraft(
    "Design activities JSON output.",
    ctx
  );
  assert.equal(draft, "Design activities JSON output.");
});
