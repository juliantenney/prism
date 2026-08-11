/**
 * Sprint 75 — S75-D24: Remove user-facing Resolved workflow brief panel;
 * keep resolution engine + assistant elicitation.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const researchPatternsPath = path.join(
  repoRoot,
  "domains",
  "research",
  "domain-research-step-patterns.md"
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
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source };
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const { api, source } = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);
const researchBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(researchPatternsPath, "utf8"))
);

test("A: Resolved workflow brief panel absent from normal Create UI", () => {
  assert.doesNotMatch(indexHtml, /id="wfBriefResolvedDetails"/);
  assert.doesNotMatch(indexHtml, /id="wfBriefResolvedSummary"/);
  assert.doesNotMatch(indexHtml, /id="wfBriefResolvedContent"/);
  assert.doesNotMatch(indexHtml, /Resolved workflow brief/);
  assert.match(source, /S75-D24/);
  assert.match(source, /function renderWorkflowBriefResolvedPanel/);
  assert.match(source, /User-facing "Resolved workflow brief" panel removed from Create/);
});

test("B: Internal resolution state still produced", () => {
  const brief = {
    designIntent: "Create a self-study resource: Managing Risk for programme managers",
    goal: "Create a self-study resource: Managing Risk for programme managers",
    audience: "programme managers",
    scopeScale: "60 minutes",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: "self_study_resource"
  };
  let explicit = api.extractWorkflowBriefExplicitFactors(brief);
  explicit = api.mergeLdCreateOutputTypeIntoExplicitFactors(explicit, brief.ldCreateOutputType);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    [brief.designIntent, ""].join("\n"),
    [brief.audience, brief.scopeScale].join("\n")
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  assert.ok(resolved && typeof resolved === "object");
  assert.ok(resolved.resolved && typeof resolved.resolved === "object");
  assert.ok(resolved.sources && typeof resolved.sources === "object");
  assert.ok(Array.isArray(resolved.missing));
});

test("C: Explicit/inferred/defaulted factor data still available internally", () => {
  const brief = {
    designIntent: "Create a workshop: climate misconceptions for undergraduates",
    goal: "Create a workshop: climate misconceptions for undergraduates",
    audience: "undergraduate students",
    scopeScale: "90-minute workshop",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: "workshop"
  };
  let explicit = api.mergeLdCreateOutputTypeIntoExplicitFactors(
    api.extractWorkflowBriefExplicitFactors(brief),
    brief.ldCreateOutputType
  );
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    [brief.designIntent, ""].join("\n"),
    [brief.audience, brief.scopeScale, brief.startingArtefact].join("\n")
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  assert.ok(Object.keys(resolved.resolved).length > 0);
  const sourceValues = Object.values(resolved.sources || {});
  assert.ok(sourceValues.some((s) => /explicit|inferred|default|elicited/i.test(String(s))));
  // Helpers that formerly fed the panel remain exported.
  assert.equal(typeof api.buildWorkflowBriefProvenanceViewModel, "function");
  assert.equal(typeof api.buildWorkflowBriefResolvedStatusStrip, "function");
  assert.equal(typeof api.appendWorkflowBriefPlanningNoticesUi, "function");
});

test("D: Missing learner_level — unresolved internally; assistant question path intact", () => {
  const brief = {
    designIntent: "Create a self-study resource: RNA virus overview",
    goal: "Create a self-study resource: RNA virus overview",
    // No audience cue that would infer learner_level.
    audience: "",
    scopeScale: "45 minutes",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: "self_study_resource"
  };
  let explicit = api.mergeLdCreateOutputTypeIntoExplicitFactors(
    api.extractWorkflowBriefExplicitFactors(brief),
    brief.ldCreateOutputType
  );
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    [brief.designIntent, ""].join("\n"),
    [brief.scopeScale, brief.startingArtefact].join("\n")
  );
  const firstPass = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  const missingIds = (firstPass.missing || []).map((f) =>
    f && typeof f === "object" ? String(f.id || "") : String(f || "")
  );
  assert.ok(
    missingIds.includes("learner_level") || !firstPass.resolved.learner_level,
    "learner_level should remain unresolved without audience cues"
  );
  if (missingIds.includes("learner_level")) {
    const factor = firstPass.missing.find(
      (f) => f && (f.id === "learner_level" || f === "learner_level")
    );
    const factorObj =
      factor && typeof factor === "object"
        ? factor
        : (ldBriefConfig.requiredFactors || []).find((f) => f && f.id === "learner_level");
    const q = api.buildWorkflowBriefQuestionText(factorObj);
    assert.match(q, /learner level/i);
    assert.doesNotMatch(q, /Required factor not resolved/i);
  } else {
    // If inference filled it from elsewhere, still ensure question helper is natural language.
    const factorObj = (ldBriefConfig.requiredFactors || []).find(
      (f) => f && f.id === "learner_level"
    );
    assert.match(api.buildWorkflowBriefQuestionText(factorObj), /learner level/i);
  }
  // Answer UI still gated by elicitation awaiting (D23).
  assert.match(source, /isWorkflowDesignAssistantAwaitingAnswer/);
  assert.match(source, /Needs essentials/);
  assert.match(source, /buildWorkflowBriefQuestionText\(queue\[0\]\)/);
});

test("E: Non-blocking inferred/defaulted factors retained; no user-facing debug panel", () => {
  assert.doesNotMatch(indexHtml, /7 assumptions|View assumptions|Brief resolved/);
  assert.doesNotMatch(indexHtml, /explicit\/inferred\/defaulted/i);
  const brief = {
    designIntent: "Create a self-study resource: photosynthesis for year 10",
    goal: "Create a self-study resource: photosynthesis for year 10",
    audience: "year 10 students",
    scopeScale: "45 minutes",
    startingArtefact: "generate_from_topic",
    selectedDomains: ["learning-design"],
    ldCreateOutputType: "self_study_resource"
  };
  let explicit = api.mergeLdCreateOutputTypeIntoExplicitFactors(
    api.extractWorkflowBriefExplicitFactors(brief),
    brief.ldCreateOutputType
  );
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    [brief.designIntent, ""].join("\n"),
    [brief.audience, brief.scopeScale].join("\n")
  );
  const resolved = api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  assert.ok(resolved.resolved.delivery_context || resolved.resolved.page_profile);
  // No-op renderer must not throw.
  assert.doesNotThrow(() => api.renderWorkflowBriefResolvedPanel(resolved));
});

test("F: Proposed workflow path still continues after required elicitation (source contract)", () => {
  assert.match(source, /continueWorkflowDesignGeneration/);
  assert.match(source, /state\.workflowBriefElicitation\s*=\s*\{/);
  assert.match(source, /stage:\s*"required"/);
  assert.match(source, /firstPass\.missing\.length/);
});

test("G: D22 Create simplification remains intact", () => {
  assert.match(indexHtml, /What are you creating\?/);
  assert.match(source, /S75-D22/);
  assert.match(indexHtml, /id="wfLdCreateOutputType"/);
  assert.equal(api.LD_CREATE_OUTPUT_TYPE_CHOICES.length, 2);
  assert.match(source, /setWorkflowFactoryFormGroupHidden\(els\.wfDesignDesiredOutputsGroup, isLd\)/);
});

test("H: D23 progressive-disclosure behaviour remains intact", () => {
  assert.match(indexHtml, /id="wfDesignApiKeyRequiredBtn"/);
  assert.match(indexHtml, /id="wfDesignAnswerGroup"[^>]*\bhidden\b/);
  assert.match(source, /syncWorkflowFactoryDesignAssistantChrome/);
  assert.match(source, /S75-D23/);
});

test("I: Research unresolved-factor elicitation still works", () => {
  const brief = {
    designIntent: "Look into remote assessment policy",
    goal: "Look into remote assessment policy",
    desiredOutputs: "",
    audience: "",
    selectedDomains: ["research"]
  };
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    researchBriefConfig,
    [brief.designIntent, ""].join("\n"),
    ""
  );
  const resolved = api.resolveWorkflowBriefFactors(
    researchBriefConfig,
    explicit,
    {},
    inferred,
    brief
  );
  assert.ok(Array.isArray(resolved.missing));
  // objective_type remains a required Research product signal when unresolved.
  const missingIds = (resolved.missing || []).map((f) =>
    f && typeof f === "object" ? String(f.id || "") : String(f || "")
  );
  if (missingIds.includes("objective_type")) {
    const factorObj = (researchBriefConfig.requiredFactors || []).find(
      (f) => f && f.id === "objective_type"
    );
    const q = api.buildWorkflowBriefQuestionText(factorObj);
    assert.ok(q.length > 0);
    assert.doesNotMatch(q, /Required factor not resolved/i);
  } else {
    assert.ok(
      resolved.resolved.objective_type,
      "objective_type either missing for elicitation or resolved"
    );
  }
});

test("J: Factor-resolution helpers and panel UX helpers remain green", () => {
  assert.equal(typeof api.resolveWorkflowBriefFactors, "function");
  assert.equal(typeof api.buildWorkflowBriefQuestionText, "function");
  assert.equal(typeof api.buildWorkflowBriefPlanningNoticeRows, "function");
  assert.equal(typeof api.buildWorkflowBriefProvenanceViewModel, "function");
  // Historical panel UX suite helpers still callable.
  const strip = api.buildWorkflowBriefResolvedStatusStrip(
    {
      resolvedFactors: { topic: "Ethics" },
      resolvedSources: { topic: "explicit" },
      mappedBindings: { mapped: [] }
    },
    { summary: { resolvedCount: 1, mappedCount: 0, missingCount: 0, warningCount: 0, sourceCounts: { explicit: 1 } } }
  );
  assert.match(strip, /resolved|Ethics|explicit/i);
});
