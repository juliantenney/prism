/**
 * Conflicting Evidence Clinical Reasoning Lab — brief resolver precedence regression.
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
  "workflow-brief-ld-clinical-reasoning",
  "conflicting-evidence-clinical-reasoning-lab.json"
);

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
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function resolvePipeline(api, config, brief) {
  const base = {
    goal: brief.goal,
    designIntent: brief.designIntent || "",
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    scopeConstraints: brief.scopeConstraints || "",
    audience: brief.audience || "",
    scopeScale: brief.scopeScale || "",
    startingArtefact: brief.startingArtefact || "generate_from_topic",
    selectedDomains: ["learning-design"]
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(base);
  const inferred = api.applyWorkflowBriefInferenceRules(
    config,
    [base.designIntent, base.goal, base.desiredOutputs].join("\n"),
    [base.inputs, base.scopeConstraints, base.audience, base.scopeScale].join("\n")
  );
  const validated = api.applyWorkflowBriefValidationRules(config, base, explicit, inferred);
  const pack = api.resolveWorkflowBriefFactors(
    config,
    validated.explicitValues,
    {},
    validated.inferredValues,
    base
  );
  return {
    base,
    explicit: validated.explicitValues,
    inferred: validated.inferredValues,
    resolved: pack.resolved
  };
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);
const CLINICAL_LAB = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const ASSESSMENT_FIRST = {
  goal: "Create a 20-item MCQ quiz on respiratory infections for first-year undergraduates.",
  desiredOutputs: "Assessment pack with answer key.",
  selectedDomains: ["learning-design"]
};

test("clinical lab brief: seminar/dialogic precedence over assessment-centric defaults", () => {
  const { resolved } = resolvePipeline(api, ldBriefConfig, CLINICAL_LAB);
  const topic = String(resolved.topic || "").toLowerCase();
  assert.match(topic, /antibiotic|prescribing|diagnostic uncertainty|respiratory infection/);
  assert.doesNotMatch(topic, /util-cognition|renderer|activity rows|semantic blocks/);
  assert.equal(resolved.delivery_mode, "seminar");
  assert.equal(resolved.cognitive_engagement_required, true);
  assert.equal(resolved.misconception_reconciliation_required, true);
  assert.equal(resolved.productive_uncertainty_required, true);
  assert.equal(resolved.reasoning_revision_required, true);
  assert.notEqual(resolved.page_profile, "assessment");
  assert.notEqual(resolved.design_scope, "single_activity");
  assert.equal(resolved.assessment_required, true);
  if (resolved.assessment_type) {
    assert.notEqual(resolved.assessment_type, "mcq");
  }
  if (resolved.assessment_total_items != null && resolved.assessment_total_items !== "") {
    assert.ok(Number(resolved.assessment_total_items) <= 6);
  }
});

test("clinical lab: polluted goal tail does not become topic", () => {
  const polluted = {
    goal:
      "Conflicting Evidence Clinical Reasoning Lab on antibiotic prescribing and diagnostic uncertainty. Verify the renderer produces visible util-cognition semantic blocks on activity rows.",
    desiredOutputs: "Learner page",
    selectedDomains: ["learning-design"]
  };
  const { explicit } = resolvePipeline(api, ldBriefConfig, polluted);
  const topic = String(explicit.topic || "").toLowerCase();
  assert.match(topic, /antibiotic|prescribing|diagnostic uncertainty/);
  assert.doesNotMatch(topic, /util-cognition|renderer|activity rows/);
});

test("assessment-first brief: still resolves to assessment profile with MCQ and high item count", () => {
  const { resolved } = resolvePipeline(api, ldBriefConfig, ASSESSMENT_FIRST);
  assert.equal(resolved.page_profile, "assessment");
  assert.equal(resolved.assessment_required, true);
  assert.equal(resolved.assessment_type, "mcq");
  assert.equal(Number(resolved.assessment_total_items), 20);
});
