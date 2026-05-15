/**
 * Sprint 20 Slice 20-1 — Settings discoverability helpers.
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

test("stepHasBriefMappingTargets detects stepParams mappings", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  assert.equal(
    api.stepHasBriefMappingTargets("step_design_page", config),
    true
  );
  assert.equal(
    api.stepHasBriefMappingTargets("step_normalize_content", config),
    false
  );
});

test("resolvePlanningAdequacySettingsNavigationTarget maps LD adequacy ids", () => {
  const api = loadPrismTestApi();
  const pageTarget = api.resolvePlanningAdequacySettingsNavigationTarget({
    id: "ld_page_profile_facilitator_mismatch"
  });
  assert.equal(pageTarget && pageTarget.canonicalStepId, "step_design_page");
  const assessmentTarget = api.resolvePlanningAdequacySettingsNavigationTarget({
    id: "ld_assessment_generate_step_missing"
  });
  assert.equal(assessmentTarget && assessmentTarget.canonicalStepId, "step_generate_assessment_items");
  assert.equal(
    api.resolvePlanningAdequacySettingsNavigationTarget({ id: "ld_scope_step_mismatch" }),
    null
  );
});

test("resolvePlanningAdequacySettingsNavigationTarget infers from action copy", () => {
  const api = loadPrismTestApi();
  const target = api.resolvePlanningAdequacySettingsNavigationTarget({
    action: "Set page profile to facilitator in step Settings"
  });
  assert.equal(target && target.canonicalStepId, "step_design_page");
});

test("isWorkflowStepConfigurableInSettings uses catalog simple mode", () => {
  const api = loadPrismTestApi();
  const catalog = [
    {
      title: "Design Page",
      canonicalStepId: "step_design_page",
      promptFactory: {
        configurationMode: "simple",
        userOptions: [{ id: "page_profile", label: "Page profile", type: "select", choices: [] }]
      }
    }
  ];
  assert.equal(
    api.isWorkflowStepConfigurableInSettings(
      { title: "Design Page", canonical_step_id: "step_design_page" },
      catalog,
      null
    ),
    true
  );
});

test("buildWorkflowStepSettingsSummaryText includes mapped resolved factors", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const resolvedState = {
    resolvedFactors: {
      page_profile: "learner",
      tone_style: "academic"
    },
    mappedBindings: {
      stepParamPatch: {
        step_design_page: {
          page_profile: "learner"
        }
      }
    }
  };
  const summary = api.buildWorkflowStepSettingsSummaryText(
    { title: "Design Page", canonical_step_id: "step_design_page", notes: "" },
    [
      {
        title: "Design Page",
        canonicalStepId: "step_design_page",
        promptFactory: { configurationMode: "simple", userOptions: [{ id: "page_profile" }] }
      }
    ],
    resolvedState,
    config
  );
  assert.match(summary, /Page profile:\s*learner/i);
});

test("buildWorkflowBriefPlanningNoticeRows returns disclosures from resolved state", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const rows = api.buildWorkflowBriefPlanningNoticeRows(config, {
    planningDisclosures: [
      {
        id: "ld_page_profile_facilitator_mismatch",
        category: "planning_adequacy",
        message: "Facilitator brief vs learner page profile.",
        action: "Set page profile to facilitator in the brief or step Settings."
      }
    ]
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, "ld_page_profile_facilitator_mismatch");
});
