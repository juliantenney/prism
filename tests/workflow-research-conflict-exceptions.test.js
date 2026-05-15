/**
 * Research workflow brief — objective_type mixed-signal conflict exceptions.
 * S13 positive (method language + explicit briefing deliverable); S4 regression unchanged.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "workflow-brief-research-sparse");
const appJsPath = path.join(repoRoot, "app.js");
const researchPatternsPath = path.join(
  repoRoot,
  "domains",
  "research",
  "domain-research-step-patterns.md"
);

function loadFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, fileName), "utf8"));
}

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  assert.ok(idx !== -1, `research pack should contain ${heading}`);
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1, `json fence after ${heading}`);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise
  };
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
  assert.ok(api);
  return api;
}

function resolveResearchBriefPass(api, briefConfig, base) {
  const config = api.normalizeWorkflowBriefConfig(briefConfig);
  const explicit = api.extractWorkflowBriefExplicitFactors(base);
  const ruleInferred = api.applyWorkflowBriefInferenceRules(
    config,
    [base.designIntent, base.goal, base.desiredOutputs].join("\n"),
    [base.inputs, base.scopeConstraints, base.audience, base.scopeScale].join("\n")
  );
  const validated = api.applyWorkflowBriefValidationRules(config, base, explicit, ruleInferred);
  const resolved = api.resolveWorkflowBriefFactors(
    config,
    validated.explicitValues,
    {},
    validated.inferredValues,
    base
  );
  return { config, explicit, validated, resolved };
}

const researchMd = fs.readFileSync(researchPatternsPath, "utf8");
const researchBriefConfig = extractJsonBlockAfterHeading(
  researchMd,
  "### Workflow Brief Config"
).workflowBriefConfig;
const mixedPolicy = researchBriefConfig.conflictPolicies.find(
  (p) => p && p.id === "objective_type_mixed_signals"
);

const api = loadPrismTestApi();
const s13 = loadFixture("S13-briefing-deliverable-analysis-method.json");
const s4 = loadFixture("S4-mixed-analysis-briefing.json");

test("S13: no mixed-signal conflict for briefing deliverable + analysis method language", () => {
  const base = api.buildWorkflowDesignBase(s13.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);

  assert.equal(pass.validated.disclosures.length, 0, "S13: no validation disclosures");
  assert.equal(
    pass.validated.disclosures.some((d) => d.id === "objective_type_mixed_signals"),
    false
  );
  assert.equal(pass.validated.rejectedInference.length, 0, "S13: no rejected inference");
  assert.equal(pass.resolved.resolved.objective_type, "briefing");
});

test("S13: conflict signal detection suppresses analysis when exception applies", () => {
  const base = api.buildWorkflowDesignBase(s13.baseInput);
  const detected = api.collectWorkflowBriefConflictSignalValues(mixedPolicy, base);
  assert.equal(detected.length, 1);
  assert.equal(detected[0], "briefing");
});

test("S4 regression: analysis briefing still triggers mixed-signal conflict", () => {
  const base = api.buildWorkflowDesignBase(s4.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);

  assert.ok(
    pass.validated.disclosures.some((d) => d.id === "objective_type_mixed_signals"),
    "S4: mixed-signal disclosure"
  );
  assert.ok(
    pass.validated.rejectedInference.some(
      (r) => r.factorId === "objective_type" && r.ruleId === "objective_type_mixed_signals"
    ),
    "S4: objective_type rejected by conflict"
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(pass.resolved.resolved, "objective_type"),
    false,
    "S4: objective_type not resolved while conflict active"
  );
});

test("S4 regression: conflict signals remain analysis + briefing", () => {
  const base = api.buildWorkflowDesignBase(s4.baseInput);
  const detected = api.collectWorkflowBriefConflictSignalValues(mixedPolicy, base).slice().sort();
  assert.equal(detected.length, 2);
  assert.equal(detected[0], "analysis");
  assert.equal(detected[1], "briefing");
});
