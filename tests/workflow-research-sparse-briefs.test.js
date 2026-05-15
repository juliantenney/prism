/**
 * Sprint 17 — Research sparse-brief golden fixtures.
 * Pins CURRENT factor extraction, resolution, and design heuristics only.
 * expectedCurrent in fixtures; desiredFuture is documentation-only (not asserted).
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

const FIXTURE_FILES = [
  "S1-topic-only.json",
  "S2-upload-language-no-inputs.json",
  "S3-explicit-source-and-audience.json",
  "S4-mixed-analysis-briefing.json",
  "S5-html-ready-page-delivery.json",
  "S6-minimal-ambiguous.json"
];

const MODEL_STEP_CHAIN = {
  steps: [
    { title: "Normalize Content", role: "" },
    { title: "Extract Key Findings", role: "" },
    { title: "Build Evidence Map", role: "" },
    { title: "Conduct Thematic Analysis", role: "" },
    { title: "Generate Research Summary", role: "" },
    { title: "Generate Briefing Note", role: "" },
    { title: "Format Final Output", role: "" }
  ]
};

function loadFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, fileName), "utf8"));
}

function canonicalizeJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function assertSubset(actual, expected, label) {
  const canonicalActual = canonicalizeJson(actual);
  Object.keys(expected).forEach((key) => {
    assert.ok(
      Object.prototype.hasOwnProperty.call(canonicalActual, key),
      `${label}: missing key "${key}"`
    );
    assert.deepEqual(canonicalActual[key], expected[key], `${label}: value mismatch for "${key}"`);
  });
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
  assert.ok(api, "Expected __PRISM_TEST_API");
  assert.equal(typeof api.buildWorkflowDesignBase, "function");
  assert.equal(typeof api.extractWorkflowBriefExplicitFactors, "function");
  assert.equal(typeof api.normalizeWorkflowBriefConfig, "function");
  assert.equal(typeof api.applyWorkflowBriefInferenceRules, "function");
  assert.equal(typeof api.applyWorkflowBriefValidationRules, "function");
  assert.equal(typeof api.resolveWorkflowBriefFactors, "function");
  assert.equal(typeof api.applyWorkflowDesignHeuristics, "function");
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
  const inferred = Object.assign({}, ruleInferred);
  const validated = api.applyWorkflowBriefValidationRules(config, base, explicit, inferred);
  const resolved = api.resolveWorkflowBriefFactors(
    config,
    validated.explicitValues,
    {},
    validated.inferredValues,
    base
  );
  const resolvedState = api.attachWorkflowBriefPlanningToResolvedState(
    config,
    {
      resolvedFactors: resolved.resolved,
      missing: resolved.missing.map((f) => f.id)
    },
    validated,
    resolved.missing
  );
  return {
    config,
    explicit,
    ruleInferred,
    inferred,
    validated,
    resolved,
    planning: resolvedState
  };
}

const researchMd = fs.readFileSync(researchPatternsPath, "utf8");
const researchBriefConfig = extractJsonBlockAfterHeading(
  researchMd,
  "### Workflow Brief Config"
).workflowBriefConfig;
const researchWorkflowPolicy = extractJsonBlockAfterHeading(
  researchMd,
  "### Workflow Policy"
).workflowPolicy;

const api = loadPrismTestApi();
const fixtures = FIXTURE_FILES.map(loadFixture);

test("sparse Research brief fixtures: expectedCurrent is separate from desiredFuture", () => {
  fixtures.forEach((fixture) => {
    assert.ok(fixture.expectedCurrent, `${fixture.caseId}: expectedCurrent required`);
    assert.ok(fixture.desiredFuture, `${fixture.caseId}: desiredFuture documents future intent only`);
    assert.ok(
      !Object.prototype.hasOwnProperty.call(fixture, "expected"),
      `${fixture.caseId}: use expectedCurrent not expected`
    );
  });
});

test("extractWorkflowBriefExplicitFactors matches expectedCurrent.explicitSubset", () => {
  fixtures.forEach((fixture) => {
    const base = api.buildWorkflowDesignBase(fixture.baseInput);
    const actual = api.extractWorkflowBriefExplicitFactors(base);
    assertSubset(
      actual,
      fixture.expectedCurrent.explicitSubset,
      `${fixture.caseId} explicitSubset`
    );
  });
});

test("applyWorkflowBriefInferenceRules matches expectedCurrent.ruleInferred", () => {
  fixtures.forEach((fixture) => {
    const base = api.buildWorkflowDesignBase(fixture.baseInput);
    const config = api.normalizeWorkflowBriefConfig(researchBriefConfig);
    const actual = api.applyWorkflowBriefInferenceRules(
      config,
      [base.designIntent, base.goal, base.desiredOutputs].join("\n"),
      [base.inputs, base.scopeConstraints, base.audience, base.scopeScale].join("\n")
    );
    assert.deepEqual(
      canonicalizeJson(actual),
      canonicalizeJson(fixture.expectedCurrent.ruleInferred),
      `${fixture.caseId} ruleInferred`
    );
  });
});

test("resolveWorkflowBriefFactors matches expectedCurrent resolution snapshot", () => {
  fixtures.forEach((fixture) => {
    const base = api.buildWorkflowDesignBase(fixture.baseInput);
    const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
    const exp = fixture.expectedCurrent;

    assert.deepEqual(
      canonicalizeJson(pass.resolved.resolved),
      canonicalizeJson(exp.resolvedFactors),
      `${fixture.caseId} resolvedFactors`
    );
    assert.deepEqual(
      canonicalizeJson(pass.resolved.sources),
      canonicalizeJson(exp.resolvedSources),
      `${fixture.caseId} resolvedSources`
    );
    assert.deepEqual(
      canonicalizeJson(pass.resolved.missing.map((f) => f.id).sort()),
      canonicalizeJson(exp.missingFactorIds.slice().sort()),
      `${fixture.caseId} missingFactorIds`
    );
    assert.equal(
      pass.resolved.missing.length > 0,
      exp.elicitationRequired,
      `${fixture.caseId} elicitationRequired`
    );
    if (Array.isArray(exp.validationDisclosures)) {
      assert.deepEqual(
        canonicalizeJson(pass.validated.disclosures),
        canonicalizeJson(exp.validationDisclosures),
        `${fixture.caseId} validationDisclosures`
      );
    }
    if (Array.isArray(exp.rejectedInference)) {
      assert.deepEqual(
        canonicalizeJson(pass.validated.rejectedInference),
        canonicalizeJson(exp.rejectedInference),
        `${fixture.caseId} rejectedInference`
      );
    }
    if (Array.isArray(exp.planningDisclosureCategories)) {
      const categories = (pass.planning.planningDisclosures || []).map((row) =>
        String(row.category || "")
      );
      assert.deepEqual(
        canonicalizeJson(categories),
        canonicalizeJson(exp.planningDisclosureCategories),
        `${fixture.caseId} planningDisclosureCategories`
      );
    }
  });
});

test("applyWorkflowDesignHeuristics matches expectedCurrent.heuristics snapshot", () => {
  fixtures.forEach((fixture) => {
    const base = api.buildWorkflowDesignBase(fixture.baseInput);
    const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
    const hints = {
      selectedDomains: ["general", "research"],
      workflowPolicy: researchWorkflowPolicy,
      stepPatternCatalog: [],
      resolvedBriefFactors: pass.resolved.resolved,
      explicitBriefFactors: pass.explicit,
      goal: base.designIntent || base.goal,
      inputs: base.inputs,
      desiredOutputs: base.desiredOutputs,
      startingArtefact: base.startingArtefact
    };
    const out = api.applyWorkflowDesignHeuristics(
      JSON.parse(JSON.stringify(MODEL_STEP_CHAIN)),
      hints
    );
    const titles = canonicalizeJson(out.steps.map((s) => String(s.title || "")));
    const exp = fixture.expectedCurrent.heuristics;

    assert.deepEqual(
      titles,
      canonicalizeJson(exp.stepTitles),
      `${fixture.caseId} heuristic stepTitles`
    );
    assert.equal(
      titles.some((t) => t.toLowerCase() === "design page"),
      exp.hasDesignPage,
      `${fixture.caseId} hasDesignPage`
    );
    assert.equal(
      titles.some((t) => t.toLowerCase() === "validate research output"),
      exp.hasValidateResearchOutput,
      `${fixture.caseId} hasValidateResearchOutput`
    );
    assert.equal(
      titles.some((t) => t.toLowerCase() === "generate research content"),
      exp.hasGenerateResearchContent,
      `${fixture.caseId} hasGenerateResearchContent`
    );
  });
});

test("S13 golden: method-language briefing deliverable resolution snapshot", () => {
  const s13 = loadFixture("S13-briefing-deliverable-analysis-method.json");
  const base = api.buildWorkflowDesignBase(s13.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const exp = s13.expectedCurrent;

  assertSubset(pass.resolved.resolved, exp.resolvedFactors, "S13 resolvedFactors");
  assert.equal(pass.validated.disclosures.length, exp.validationDisclosures.length);
  assert.equal(pass.validated.rejectedInference.length, exp.rejectedInference.length);
  const categories = (pass.planning.planningDisclosures || []).map((row) =>
    String(row.category || "")
  );
  assert.equal(categories.length, exp.planningDisclosureCategories.length);
  exp.planningDisclosureCategories.forEach((cat, i) => {
    assert.equal(categories[i], cat, `S13 planning category index ${i}`);
  });
  assert.equal(
    categories.some((c) => c === "conflicting_intent"),
    false,
    "S13: no conflicting_intent"
  );
});
