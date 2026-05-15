/**
 * Sprint 19 Slice 19-2 — Learning Design planning adequacy.
 * Uses existing Research adequacy interpreter; LD pack policy only.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "workflow-brief-ld-adequacy");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function loadFixture(fileName) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, fileName), "utf8"));
}

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  assert.ok(idx !== -1, `LD pack should contain ${heading}`);
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
  return api;
}

function resolveLdBriefPass(api, briefConfig, base) {
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
  return {
    config,
    explicit,
    validated,
    resolved
  };
}

function designFromModelSteps(modelSteps) {
  const steps = Array.isArray(modelSteps) ? modelSteps : [];
  return {
    summary: "",
    steps: JSON.parse(JSON.stringify(steps))
  };
}

function evaluateLdPlanningAdequacy(api, config, pass, base, fixture) {
  const resolvedFactors =
    fixture.resolvedFactorsForAdequacy && typeof fixture.resolvedFactorsForAdequacy === "object"
      ? fixture.resolvedFactorsForAdequacy
      : pass.resolved.resolved;
  const design = designFromModelSteps(fixture.modelSteps);
  const stepTitles = design.steps.map((s) => String(s.title || ""));
  const ctx = api.buildWorkflowRefinementContext({
    brief: base,
    config,
    resolvedFactors,
    resolvedSources: pass.resolved.sources,
    explicitValues: pass.validated.explicitValues,
    inferredValues: pass.validated.inferredValues,
    missingFactorIds: [],
    design: { summary: "", steps: design.steps },
    heuristics: {
      stepTitles,
      hasGenerateResearchContent: false,
      hasDesignPage: stepTitles.some((t) => /design page/i.test(t)),
      hasValidateResearchOutput: stepTitles.some((t) =>
        /validate learning design/i.test(t)
      )
    },
    meta: { domainId: "learning-design", fixtureId: fixture.caseId || "" }
  });
  return {
    ctx,
    design,
    stepTitles,
    adequacy: api.evaluateWorkflowBriefPlanningAdequacyChecks(config, ctx)
  };
}

function buildLdPlanningDisclosures(api, briefConfig, fixture, options) {
  const opts = options && typeof options === "object" ? options : {};
  const base = api.buildWorkflowDesignBase(fixture.baseInput);
  const pass = resolveLdBriefPass(api, briefConfig, base);
  const resolvedFactors =
    fixture.resolvedFactorsForAdequacy && typeof fixture.resolvedFactorsForAdequacy === "object"
      ? fixture.resolvedFactorsForAdequacy
      : pass.resolved.resolved;

  let resolvedState = {
    initialBrief: base,
    inferredFactors: pass.validated.inferredValues || {},
    resolvedSources: pass.resolved.sources,
    resolvedFactors,
    missing: []
  };
  resolvedState = api.attachWorkflowBriefPlanningToResolvedState(
    pass.config,
    resolvedState,
    pass.validated,
    pass.resolved.missing
  );

  if (opts.withPostDesignAdequacy) {
    const design = designFromModelSteps(fixture.modelSteps);
    resolvedState = api.applyWorkflowBriefPlanningAdequacyAfterDesign(
      pass.config,
      resolvedState,
      base,
      design,
      { explicitValues: pass.validated.explicitValues }
    );
  }
  return resolvedState.planningDisclosures || [];
}

function adequacyIds(adequacy) {
  return (adequacy || []).map((row) => String(row.id || "").trim()).filter(Boolean);
}

function assertAdequacyIncludes(adequacy, id, label) {
  assert.ok(
    adequacyIds(adequacy).includes(id),
    `${label}: expected planning adequacy id ${id}`
  );
}

function assertAdequacyExcludes(adequacy, id, label) {
  assert.equal(
    adequacyIds(adequacy).includes(id),
    false,
    `${label}: must not include planning adequacy id ${id}`
  );
}

const api = loadPrismTestApi();
const maxAdequacyRows =
  api.WORKFLOW_BRIEF_PLANNING_ADEQUACY_MAX_ROWS != null
    ? api.WORKFLOW_BRIEF_PLANNING_ADEQUACY_MAX_ROWS
    : 3;

const ldMd = fs.readFileSync(ldPatternsPath, "utf8");
const ldBriefConfig = extractJsonBlockAfterHeading(
  ldMd,
  "### Workflow Brief Config"
).workflowBriefConfig;
const l1 = loadFixture("L1-generate-without-source.json");
const l2 = loadFixture("L2-scope-step-mismatch.json");
const l3 = loadFixture("L3-assessment-generate-step-missing.json");
const l4 = loadFixture("L4-coherent-no-false-positives.json");
const l5 = loadFixture("L5-page-profile-facilitator-mismatch.json");

test("L1: ld_generate_without_source", () => {
  const base = api.buildWorkflowDesignBase(l1.baseInput);
  const pass = resolveLdBriefPass(api, ldBriefConfig, base);
  const { adequacy } = evaluateLdPlanningAdequacy(api, pass.config, pass, base, l1);

  assertAdequacyIncludes(adequacy, "ld_generate_without_source", "L1");
  assert.ok(adequacy.length <= maxAdequacyRows, "L1: adequacy cap");
  const row = adequacy.find((r) => r.id === "ld_generate_without_source");
  assert.equal(row.category, "planning_adequacy");
  assert.equal(row.severity, "recommendation");
  assert.equal(row.source, "planningAdequacyChecks");
  assert.ok(String(row.message || "").trim(), "L1: message present");
  assert.ok(String(row.action || "").trim(), "L1: action present");
});

test("L2: ld_scope_step_mismatch", () => {
  const base = api.buildWorkflowDesignBase(l2.baseInput);
  const pass = resolveLdBriefPass(api, ldBriefConfig, base);
  const { adequacy, design } = evaluateLdPlanningAdequacy(api, pass.config, pass, base, l2);

  assert.ok(design.steps.length >= 8, "L2: fixture should have at least 8 steps");
  assertAdequacyIncludes(adequacy, "ld_scope_step_mismatch", "L2");
  assert.ok(adequacy.length <= maxAdequacyRows, "L2: adequacy cap");
});

test("L3: ld_assessment_generate_step_missing", () => {
  const base = api.buildWorkflowDesignBase(l3.baseInput);
  const pass = resolveLdBriefPass(api, ldBriefConfig, base);
  const { adequacy, stepTitles } = evaluateLdPlanningAdequacy(api, pass.config, pass, base, l3);

  assert.equal(
    stepTitles.some((t) => /generate assessment items/i.test(t)),
    false,
    "L3: plan should lack Generate Assessment Items"
  );
  assertAdequacyIncludes(adequacy, "ld_assessment_generate_step_missing", "L3");
  assert.ok(adequacy.length <= maxAdequacyRows, "L3: adequacy cap");
});

test("L4: no false positives on coherent source-provided workflow", () => {
  const base = api.buildWorkflowDesignBase(l4.baseInput);
  const pass = resolveLdBriefPass(api, ldBriefConfig, base);
  const { adequacy } = evaluateLdPlanningAdequacy(api, pass.config, pass, base, l4);

  assert.equal(adequacy.length, 0, "L4: no planning adequacy rows");
  assertAdequacyExcludes(adequacy, "ld_generate_without_source", "L4");
  assertAdequacyExcludes(adequacy, "ld_scope_step_mismatch", "L4");
  assertAdequacyExcludes(adequacy, "ld_assessment_generate_step_missing", "L4");
});

test("L5: ld_page_profile_facilitator_mismatch (optional rule)", () => {
  const base = api.buildWorkflowDesignBase(l5.baseInput);
  const pass = resolveLdBriefPass(api, ldBriefConfig, base);
  const { adequacy } = evaluateLdPlanningAdequacy(api, pass.config, pass, base, l5);

  assertAdequacyIncludes(adequacy, "ld_page_profile_facilitator_mismatch", "L5");
  assert.ok(adequacy.length <= maxAdequacyRows, "L5: adequacy cap");
});

test("LD essentials missing suppress planning_adequacy", () => {
  const base = api.buildWorkflowDesignBase({
    name: "Sparse",
    designIntent: "A session on topic.",
    audience: "",
    scopeScale: "",
    inputs: "",
    startingArtefact: "",
    desiredOutputs: "",
    scopeConstraints: "",
    selectedDomains: ["learning-design"]
  });
  const pass = resolveLdBriefPass(api, ldBriefConfig, base);
  assert.ok(pass.resolved.missing.length > 0, "essentials should be missing");

  const { adequacy } = evaluateLdPlanningAdequacy(api, pass.config, pass, base, {
    caseId: "missing-essentials",
    modelSteps: l1.modelSteps,
    resolvedFactorsForAdequacy: {}
  });
  assert.equal(adequacy.length, 0);
});

test("LD post-synthesis planning disclosures include planning_adequacy", () => {
  const disclosures = buildLdPlanningDisclosures(api, ldBriefConfig, l3, {
    withPostDesignAdequacy: true
  });
  const adequacyRows = disclosures.filter((row) => row.category === "planning_adequacy");
  assert.ok(adequacyRows.length >= 1, "planning panel should show adequacy");
  assert.ok(adequacyRows.length <= maxAdequacyRows, "adequacy cap in panel");
  assert.ok(
    adequacyRows.some((row) => row.id === "ld_assessment_generate_step_missing"),
    "L3 Slice 2: assessment step missing disclosure"
  );
});

test("LD pack declares four structural adequacy rules", () => {
  const ids = (ldBriefConfig.planningAdequacyChecks || []).map((c) => c.id);
  assert.deepEqual(ids, [
    "ld_generate_without_source",
    "ld_scope_step_mismatch",
    "ld_assessment_generate_step_missing",
    "ld_page_profile_facilitator_mismatch"
  ]);
});
