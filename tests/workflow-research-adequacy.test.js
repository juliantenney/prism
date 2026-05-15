/**
 * Sprint 18 — Research planning adequacy.
 * Slice 1: evaluator + S7/S1/S3 checks.
 * Slice 2: Planning-panel disclosure integration (post-synthesis surfacing).
 * Slice 3C: checks A/B + S8/S9 (runtime predicates in 3C-1).
 * Does not modify S1–S6 sparse-brief golden semantics.
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
  assert.equal(typeof api.buildWorkflowRefinementContext, "function");
  assert.equal(typeof api.evaluateWorkflowBriefPlanningAdequacyChecks, "function");
  assert.equal(typeof api.applyWorkflowDesignHeuristics, "function");
  assert.equal(typeof api.attachWorkflowBriefPlanningToResolvedState, "function");
  assert.equal(typeof api.applyWorkflowBriefPlanningAdequacyAfterDesign, "function");
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
  return {
    config,
    explicit,
    validated,
    resolved
  };
}

function applyResearchHeuristics(api, policy, pass, base, resolvedFactors) {
  return api.applyWorkflowDesignHeuristics(JSON.parse(JSON.stringify(MODEL_STEP_CHAIN)), {
    selectedDomains: ["general", "research"],
    workflowPolicy: policy,
    stepPatternCatalog: [],
    resolvedBriefFactors: resolvedFactors,
    explicitBriefFactors: pass.explicit,
    goal: base.designIntent || base.goal,
    inputs: base.inputs,
    desiredOutputs: base.desiredOutputs,
    startingArtefact: base.startingArtefact
  });
}

function evaluatePlanningAdequacy(api, config, pass, base, options) {
  const opts = options && typeof options === "object" ? options : {};
  const resolvedFactors =
    opts.resolvedFactors && typeof opts.resolvedFactors === "object"
      ? opts.resolvedFactors
      : pass.resolved.resolved;
  const missingFactorIds = Array.isArray(opts.missingFactorIds)
    ? opts.missingFactorIds
    : pass.resolved.missing.map((f) => f.id);
  const design = applyResearchHeuristics(api, opts.workflowPolicy, pass, base, resolvedFactors);
  const stepTitles = design.steps.map((s) => String(s.title || ""));
  const ctx = api.buildWorkflowRefinementContext({
    brief: base,
    config,
    resolvedFactors,
    resolvedSources: pass.resolved.sources,
    explicitValues: pass.validated.explicitValues,
    inferredValues: pass.validated.inferredValues,
    missingFactorIds,
    design: { summary: "", steps: design.steps },
    heuristics: {
      stepTitles,
      hasGenerateResearchContent: stepTitles.some((t) =>
        /generate research content/i.test(t)
      ),
      hasDesignPage: stepTitles.some((t) => /design page/i.test(t)),
      hasValidateResearchOutput: stepTitles.some((t) =>
        /validate research output/i.test(t)
      )
    },
    meta: { domainId: "research", fixtureId: opts.fixtureId || "" }
  });
  return {
    ctx,
    design,
    stepTitles,
    adequacy: api.evaluateWorkflowBriefPlanningAdequacyChecks(config, ctx)
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

function buildResolvedPlanningDisclosures(api, briefConfig, policy, fixture, options) {
  const opts = options && typeof options === "object" ? options : {};
  const base = api.buildWorkflowDesignBase(fixture.baseInput);
  const pass = resolveResearchBriefPass(api, briefConfig, base);
  const resolvedFactors =
    opts.resolvedFactors && typeof opts.resolvedFactors === "object"
      ? opts.resolvedFactors
      : pass.resolved.resolved;
  const missingFactorIds = Array.isArray(opts.missingFactorIds)
    ? opts.missingFactorIds
    : pass.resolved.missing.map((f) => f.id);

  let resolvedState = {
    initialBrief: base,
    inferredFactors: pass.validated.inferredValues || {},
    resolvedSources: pass.resolved.sources,
    resolvedFactors,
    missing: missingFactorIds
  };
  resolvedState = api.attachWorkflowBriefPlanningToResolvedState(
    pass.config,
    resolvedState,
    pass.validated,
    pass.resolved.missing
  );

  if (opts.withPostDesignAdequacy) {
    const design = applyResearchHeuristics(api, policy, pass, base, resolvedFactors);
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

function hasPlanningAdequacyCategory(disclosures) {
  return (disclosures || []).some((row) => row.category === "planning_adequacy");
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
const s7 = loadFixture("S7-topic-sufficiency-smoke.json");
const s8 = loadFixture("S8-evidence-language-generate-from-topic.json");
const s9 = loadFixture("S9-concise-depth-heavy-plan.json");
const s1 = loadFixture("S1-topic-only.json");
const s2 = loadFixture("S2-upload-language-no-inputs.json");
const s3 = loadFixture("S3-explicit-source-and-audience.json");
const s4 = loadFixture("S4-mixed-analysis-briefing.json");
const s6 = loadFixture("S6-minimal-ambiguous.json");

test("S7: post-elicitation essentials and generate_from_topic", () => {
  const base = api.buildWorkflowDesignBase(s7.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const exp = s7.expectedCurrent;
  const resolvedFactors = exp.resolvedFactorsForAdequacy;

  assert.deepEqual(exp.missingFactorIdsForAdequacy, []);
  assert.equal(resolvedFactors.input_strategy, "generate_from_topic");
  assert.equal(resolvedFactors.audience, "Executive leadership");
  assert.equal(resolvedFactors.objective_type, "briefing");
  assert.equal(resolvedFactors.output_depth, "standard");

  const { stepTitles, adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    resolvedFactors,
    missingFactorIds: [],
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s7.caseId
  });

  const hasAnalysisStep = stepTitles.some((t) => {
    const lower = t.toLowerCase();
    return lower === "conduct thematic analysis" || lower === "build evidence map";
  });
  assert.ok(hasAnalysisStep, "S7: heuristic plan should include analysis steps");

  assert.ok(adequacy.length >= 1, "S7: expected at least one planning adequacy row");
  assert.ok(
    adequacy.length <= maxAdequacyRows,
    `S7: adequacy rows must not exceed cap of ${maxAdequacyRows}`
  );
  assertAdequacyIncludes(adequacy, "topic_scope_under_specified", "S7");
  assertAdequacyIncludes(
    adequacy,
    "evidence_language_generate_from_topic_mismatch",
    "S7"
  );
  const topicRow = adequacy.find((row) => row.id === "topic_scope_under_specified");
  assert.ok(topicRow, "S7: topic_scope row should exist");
  assert.equal(topicRow.category, "planning_adequacy");
  assert.equal(topicRow.severity, "recommendation");
  assert.equal(topicRow.source, "planningAdequacyChecks");
  assert.ok(String(topicRow.message || "").trim(), "S7: adequacy message should be present");
  assert.ok(String(topicRow.action || "").trim(), "S7: adequacy action should be present");
  assertAdequacyExcludes(adequacy, "plan_heavy_for_output_depth", "S7");

  const expHeuristics = s7.expectedCurrent.heuristics;
  assert.equal(
    stepTitles.some((t) => /generate research content/i.test(t)),
    expHeuristics.hasGenerateResearchContent,
    "S7: hasGenerateResearchContent"
  );
  assert.equal(
    stepTitles.some((t) => /design page/i.test(t)),
    expHeuristics.hasDesignPage,
    "S7: hasDesignPage"
  );
});

test("S1 negative: missing essentials suppress planning_adequacy", () => {
  const base = api.buildWorkflowDesignBase(s1.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  assert.ok(pass.resolved.missing.length > 0, "S1: essentials should remain missing");

  const { adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s1.caseId
  });
  assert.equal(adequacy.length, 0);
  assert.equal(
    adequacy.some((row) => row.category === "planning_adequacy"),
    false
  );
});

test("S3 negative: provided_source_content does not trigger topic-scope adequacy", () => {
  const base = api.buildWorkflowDesignBase(s3.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  assert.equal(pass.resolved.resolved.input_strategy, "provided_source_content");

  const { adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s3.caseId
  });
  assert.equal(adequacy.length, 0);
});

test("S7 Slice 2: post-synthesis planning disclosures include planning_adequacy", () => {
  const disclosures = buildResolvedPlanningDisclosures(
    api,
    researchBriefConfig,
    researchWorkflowPolicy,
    s7,
    {
      resolvedFactors: s7.expectedCurrent.resolvedFactorsForAdequacy,
      missingFactorIds: [],
      withPostDesignAdequacy: true
    }
  );
  assert.ok(hasPlanningAdequacyCategory(disclosures), "S7: planning panel should show adequacy");
  const adequacyRows = disclosures.filter((row) => row.category === "planning_adequacy");
  assert.ok(adequacyRows.length >= 1);
  assert.ok(adequacyRows.length <= maxAdequacyRows);
  assert.ok(
    adequacyRows.some((row) => row.id === "topic_scope_under_specified"),
    "S7 Slice 2: topic_scope disclosure"
  );
  const topicRow =
    adequacyRows.find((row) => row.id === "topic_scope_under_specified") || adequacyRows[0];
  assert.match(
    String(topicRow.message || ""),
    /analysis steps|thematic analysis|evidence map/i,
    "S7: adequacy message should reference analysis-oriented planning"
  );
  assert.ok(String(topicRow.action || "").trim(), "S7: adequacy action should be present");
});

test("S8: evidence_language_generate_from_topic_mismatch", () => {
  const base = api.buildWorkflowDesignBase(s8.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const resolvedFactors = s8.expectedCurrent.resolvedFactorsForAdequacy;

  const { adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    resolvedFactors,
    missingFactorIds: [],
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s8.caseId
  });

  assertAdequacyIncludes(
    adequacy,
    "evidence_language_generate_from_topic_mismatch",
    "S8"
  );
  assert.ok(adequacy.length <= maxAdequacyRows, "S8: adequacy cap");
  const row = adequacy.find(
    (r) => r.id === "evidence_language_generate_from_topic_mismatch"
  );
  assert.match(
    String(row.message || ""),
    /evidence|source-material|source material|generate from a topic/i,
    "S8: message should describe evidence vs topic generation"
  );
});

test("S9: plan_heavy_for_output_depth", () => {
  const base = api.buildWorkflowDesignBase(s9.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const resolvedFactors = s9.expectedCurrent.resolvedFactorsForAdequacy;

  const { stepTitles, adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    resolvedFactors,
    missingFactorIds: [],
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s9.caseId
  });

  assert.ok(stepTitles.length >= 7, "S9: heuristic plan should be relatively heavy");
  assertAdequacyIncludes(adequacy, "plan_heavy_for_output_depth", "S9");
  assertAdequacyExcludes(adequacy, "evidence_language_generate_from_topic_mismatch", "S9");
  assert.ok(adequacy.length <= maxAdequacyRows, "S9: adequacy cap");
  const row = adequacy.find((r) => r.id === "plan_heavy_for_output_depth");
  assert.match(
    String(row.message || ""),
    /concise|heavy|analysis|synthesis/i,
    "S9: message should describe concise vs heavy plan"
  );
});

test("S3 negative: evidence_language does not fire for provided_source_content", () => {
  const base = api.buildWorkflowDesignBase(s3.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const resolvedFactors = Object.assign({}, pass.resolved.resolved, {
    output_depth: "standard"
  });

  const { adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    resolvedFactors,
    missingFactorIds: [],
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s3.caseId
  });

  assertAdequacyExcludes(
    adequacy,
    "evidence_language_generate_from_topic_mismatch",
    "S3"
  );
});

test("S7 negative: plan_heavy does not fire when output_depth is standard", () => {
  const base = api.buildWorkflowDesignBase(s7.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const resolvedFactors = Object.assign({}, s7.expectedCurrent.resolvedFactorsForAdequacy, {
    output_depth: "standard"
  });

  const { adequacy } = evaluatePlanningAdequacy(api, pass.config, pass, base, {
    resolvedFactors,
    missingFactorIds: [],
    workflowPolicy: researchWorkflowPolicy,
    fixtureId: s7.caseId
  });

  assertAdequacyExcludes(adequacy, "plan_heavy_for_output_depth", "S7 standard depth");
  assertAdequacyIncludes(adequacy, "topic_scope_under_specified", "S7 standard depth");
});

test("S1/S2/S3/S4/S6 Slice 2: pre-design planning disclosures omit planning_adequacy", () => {
  [
    { fixture: s1, label: "S1" },
    { fixture: s2, label: "S2" },
    { fixture: s3, label: "S3" },
    { fixture: s4, label: "S4" },
    { fixture: s6, label: "S6" }
  ].forEach(({ fixture, label }) => {
    const disclosures = buildResolvedPlanningDisclosures(
      api,
      researchBriefConfig,
      researchWorkflowPolicy,
      fixture,
      { withPostDesignAdequacy: false }
    );
    assert.equal(
      hasPlanningAdequacyCategory(disclosures),
      false,
      `${label}: attachWorkflowBriefPlanningToResolvedState alone must not emit planning_adequacy`
    );
  });
});

test("S3 Slice 2: post-design merge still omits planning_adequacy for provided_source_content", () => {
  const base = api.buildWorkflowDesignBase(s3.baseInput);
  const pass = resolveResearchBriefPass(api, researchBriefConfig, base);
  const resolvedFactors = Object.assign({}, pass.resolved.resolved, {
    output_depth: "standard"
  });
  const disclosures = buildResolvedPlanningDisclosures(
    api,
    researchBriefConfig,
    researchWorkflowPolicy,
    s3,
    {
      resolvedFactors,
      missingFactorIds: [],
      withPostDesignAdequacy: true
    }
  );
  assert.equal(
    hasPlanningAdequacyCategory(disclosures),
    false,
    "S3: provided_source_content must not trigger topic-scope adequacy"
  );
});
