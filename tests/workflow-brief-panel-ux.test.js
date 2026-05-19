/**
 * Sprint 20 Slice 20-3 — resolved brief panel UX helpers.
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

function extractJsonBlockAfterHeading(md, heading) {
  const idx = md.indexOf(heading);
  assert.ok(idx !== -1, `LD pack should contain ${heading}`);
  const fence = md.indexOf("```json", idx);
  assert.ok(fence !== -1, `json fence after ${heading}`);
  const close = md.indexOf("```", fence + 7);
  assert.ok(close !== -1);
  return JSON.parse(md.slice(fence + 7, close).trim());
}

function loadLdWorkflowBriefConfig() {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  const block = extractJsonBlockAfterHeading(md, "### Workflow Brief Config");
  return block.workflowBriefConfig;
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
  return api;
}

test("buildWorkflowBriefResolvedStatusStrip dedupes summary counts", () => {
  const api = loadPrismTestApi();
  const strip = api.buildWorkflowBriefResolvedStatusStrip(
    {
      resolvedFactors: { topic: "Ethics", page_profile: "learner" },
      resolvedSources: { topic: "explicit", page_profile: "inferred" },
      mappedBindings: { mapped: [{ factor: "topic", target: "x" }] }
    },
    {
      summary: {
        resolvedCount: 2,
        mappedCount: 1,
        missingCount: 0,
        warningCount: 0,
        sourceCounts: { explicit: 1, elicited: 0, inferred: 1, default: 0 }
      }
    }
  );
  assert.match(strip, /2 resolved/);
  assert.match(strip, /1 mapped/);
  assert.match(strip, /1 explicit/);
  assert.match(strip, /1 inferred/);
  assert.match(strip, /essentials complete/);
  assert.doesNotMatch(strip, /Asked factors/);
});

test("classifyWorkflowBriefPlanningNoticeRow tiers safety and actionable", () => {
  const api = loadPrismTestApi();
  assert.equal(
    api.classifyWorkflowBriefPlanningNoticeRow({
      category: "missing_essential",
      message: "Need audience"
    }),
    "safety"
  );
  assert.equal(
    api.classifyWorkflowBriefPlanningNoticeRow({
      category: "planning_adequacy",
      message: "Check page profile",
      action: "Review page profile in Settings",
      id: "ld_page_profile_facilitator_mismatch"
    }),
    "actionable"
  );
  assert.equal(
    api.classifyWorkflowBriefPlanningNoticeRow({
      category: "planning_adequacy",
      message: "Optional note only"
    }),
    "informational"
  );
});

test("buildWorkflowBriefResolvedFactorsCompactGroups groups by source and mapped", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const groups = api.buildWorkflowBriefResolvedFactorsCompactGroups(config, {
    resolvedFactors: {
      topic: "Ethics",
      page_profile: "learner",
      design_scope: "session",
      mystery_factor: "x"
    },
    resolvedSources: {
      topic: "explicit",
      page_profile: "inferred",
      design_scope: "default",
      mystery_factor: "recommended"
    },
    mappedBindings: {
      mapped: [
        { factor: "topic", target: "workflow.workflowOutputSpec.constraints.topic", value: "Ethics" },
        { factor: "design_scope", target: "workflow.workflowOutputSpec.constraints.design_scope", value: "session" }
      ]
    }
  });
  const explicit = groups.find((g) => g.id === "explicit");
  const inferred = groups.find((g) => g.id === "inferred");
  const defaults = groups.find((g) => g.id === "default");
  const mapped = groups.find((g) => g.id === "mapped");
  const resolved = groups.find((g) => g.id === "resolved");
  assert.ok(explicit);
  assert.equal(explicit.factors[0].label, "Topic");
  assert.equal(explicit.factors[0].value, "Ethics");
  assert.equal(explicit.factors[0].mapped, true);
  assert.ok(inferred);
  assert.equal(inferred.factors[0].id, "page_profile");
  assert.ok(defaults);
  assert.ok(mapped);
  assert.equal(mapped.factors.length, 2);
  assert.ok(
    !String(mapped.factors[0].label || "").includes("workflow.workflowOutputSpec"),
    "mapped group hides technical paths"
  );
  assert.ok(resolved);
  assert.equal(resolved.factors[0].id, "mystery_factor");
});

test("appendWorkflowBriefPlanningNoticesUi is available for resolved brief panel", () => {
  const api = loadPrismTestApi();
  assert.equal(typeof api.appendWorkflowBriefPlanningNoticesUi, "function");
});

test("renderWorkflowBriefResolvedPanel path does not block when planning notices present", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const resolvedState = {
    resolvedFactors: { topic: "Inflation", design_scope: "session" },
    resolvedSources: { topic: "explicit", design_scope: "default" },
    mappedBindings: { mapped: [{ factor: "topic", target: "workflow.workflowOutputSpec.constraints.topic", value: "Inflation" }] },
    planningDisclosures: [
      {
        id: "topic_scope_under_specified",
        message: "Topic may be broad for analysis steps.",
        category: "planning_adequacy",
        action: "Add sector or timeframe to the brief."
      }
    ],
    briefConfig: config
  };
  const rows = api.buildWorkflowBriefPlanningNoticeRows(config, resolvedState);
  assert.ok(rows.length >= 1);
  const strip = api.buildWorkflowBriefResolvedStatusStrip(
    resolvedState,
    api.buildWorkflowBriefProvenanceViewModel(config, resolvedState, null, {})
  );
  assert.match(strip, /essentials complete/);
});

test("buildWorkflowBriefResolvedStatusStrip unchanged when compact groups exist", () => {
  const api = loadPrismTestApi();
  const resolvedState = {
    resolvedFactors: { topic: "Ethics", page_profile: "learner" },
    resolvedSources: { topic: "explicit", page_profile: "inferred" },
    mappedBindings: { mapped: [{ factor: "topic", target: "x", value: "Ethics" }] }
  };
  const model = api.buildWorkflowBriefProvenanceViewModel(
    loadLdWorkflowBriefConfig(),
    resolvedState,
    null,
    {}
  );
  const strip = api.buildWorkflowBriefResolvedStatusStrip(resolvedState, model);
  assert.match(strip, /2 resolved/);
  assert.match(strip, /1 mapped/);
  assert.match(strip, /1 explicit/);
  assert.match(strip, /1 inferred/);
});

test("sortWorkflowBriefPlanningNoticeRows puts actionable before informational", () => {
  const api = loadPrismTestApi();
  const sorted = api.sortWorkflowBriefPlanningNoticeRows([
    { category: "planning_adequacy", message: "Info only" },
    {
      category: "planning_adequacy",
      message: "Add assessment step",
      action: "Open assessment settings",
      id: "ld_assessment_generate_step_missing"
    }
  ]);
  assert.equal(sorted[0].id, "ld_assessment_generate_step_missing");
  assert.equal(sorted[1].message, "Info only");
});
