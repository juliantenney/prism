/**
 * Sprint 20 Slice 20-2 — Workflow brief provenance view model.
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

test("formatWorkflowBriefFactorDisplayLabel uses pack label", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const label = api.formatWorkflowBriefFactorDisplayLabel(config, "page_profile");
  assert.equal(label, "Page profile");
});

test("formatWorkflowBriefFactorDisplayValue avoids JSON for arrays", () => {
  const api = loadPrismTestApi();
  assert.equal(api.formatWorkflowBriefFactorDisplayValue(["a", "b"]), "a, b");
  assert.equal(api.formatWorkflowBriefFactorDisplayValue({ x: 1 }), "");
});

test("buildWorkflowBriefProvenanceViewModel groups factors by source", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const model = api.buildWorkflowBriefProvenanceViewModel(
    config,
    {
      resolvedFactors: {
        topic: "Ethics",
        page_profile: "learner",
        design_scope: "session"
      },
      resolvedSources: {
        topic: "explicit",
        page_profile: "inferred",
        design_scope: "default"
      },
      mappedBindings: { mapped: [] }
    },
    null,
    {}
  );
  const explicit = model.groups.find((g) => g.source === "explicit");
  const inferred = model.groups.find((g) => g.source === "inferred");
  const defaults = model.groups.find((g) => g.source === "default");
  assert.equal(explicit.factors.length, 1);
  assert.equal(explicit.factors[0].value, "Ethics");
  assert.equal(inferred.factors.length, 1);
  assert.equal(inferred.factors[0].id, "page_profile");
  assert.equal(defaults.factors.length, 1);
});

test("buildWorkflowBriefStepRelevanceIndex maps page_profile to design page step", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const resolvedState = {
    resolvedFactors: { page_profile: "learner" },
    mappedBindings: {
      mapped: [
        {
          factor: "page_profile",
          target: "stepParams.step_design_page.page_profile",
          value: "learner"
        }
      ]
    }
  };
  const design = {
    steps: [{ title: "Design Page", canonical_step_id: "step_design_page" }]
  };
  const index = api.buildWorkflowBriefStepRelevanceIndex(config, resolvedState, design, []);
  assert.equal(index.stepRelevance.length, 1);
  assert.equal(index.stepRelevance[0].canonicalStepId, "step_design_page");
  assert.equal(index.stepRelevance[0].factors[0].id, "page_profile");
  assert.ok(index.stepRelevance[0].factors[0].paramKeys.includes("page_profile"));
});

test("step relevance omits steps not in design", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const resolvedState = {
    mappedBindings: {
      mapped: [
        {
          factor: "page_profile",
          target: "stepParams.step_design_page.page_profile",
          value: "learner"
        }
      ]
    }
  };
  const design = { steps: [{ title: "Define Learning Outcomes" }] };
  const index = api.buildWorkflowBriefStepRelevanceIndex(config, resolvedState, design, []);
  assert.equal(index.stepRelevance.length, 0);
});

test("workflow-level mappings separated from step relevance", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const resolvedState = {
    resolvedFactors: { input_strategy: "generate_from_topic" },
    mappedBindings: {
      mapped: [
        {
          factor: "input_strategy",
          target: "workflow.workflowOutputSpec.constraints.input_strategy",
          value: "generate_from_topic"
        }
      ]
    }
  };
  const index = api.buildWorkflowBriefStepRelevanceIndex(config, resolvedState, { steps: [] }, []);
  assert.equal(index.stepRelevance.length, 0);
  const model = api.buildWorkflowBriefProvenanceViewModel(config, resolvedState, { steps: [] }, {});
  assert.equal(model.workflowLevel.length, 1);
  assert.equal(model.workflowLevel[0].id, "input_strategy");
});

test("rejected inference rows pass through view model", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const model = api.buildWorkflowBriefProvenanceViewModel(
    config,
    {
      resolvedFactors: {},
      resolvedSources: {},
      rejectedInference: [
        {
          factorId: "input_strategy",
          value: "provided_source_content",
          message: "Blocked unsafe inference"
        }
      ],
      mappedBindings: { mapped: [] }
    },
    null,
    {}
  );
  assert.equal(model.rejected.length, 1);
  assert.match(model.rejected[0].message, /Blocked/);
});

test("formatWorkflowBriefPlanningNoticesLines unchanged for tests", () => {
  const api = loadPrismTestApi();
  const config = loadLdWorkflowBriefConfig();
  const lines = api.formatWorkflowBriefPlanningNoticesLines(config, {
    planningDisclosures: [
      {
        category: "planning_adequacy",
        message: "Test adequacy message",
        action: "Review plan"
      }
    ]
  });
  assert.ok(lines.some((l) => l.indexOf("Planning notices:") !== -1));
  assert.ok(lines.some((l) => l.indexOf("Test adequacy message") !== -1));
});
