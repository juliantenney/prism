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
