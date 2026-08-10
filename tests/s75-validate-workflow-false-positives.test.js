/**
 * Sprint 75 — My Workflows Edit validateWorkflow false-positive stabilisation (S75-D05).
 *
 * Align runnable-prompt and same/later binding rules with current Run semantics.
 * Keep genuine empty/missing-source/custom dependency warnings.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "educational-psychology-post-s68",
  "workflow.json"
);

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
  assert.equal(typeof api.validateWorkflow, "function");
  assert.equal(typeof api.resolveStepPromptText, "function");
  assert.equal(typeof api.isWorkflowStepRunnablePromptConfiguration, "function");
  return { api, source };
}

function pageEnrichmentWf(steps) {
  return {
    id: "wf-test",
    name: "Test LD",
    workflowOutputSpec: {
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    steps: steps || []
  };
}

function hasPromptWarning(warnings, stepIndex1Based) {
  const needle = "Step " + stepIndex1Based + " has no runnable prompt configured";
  return warnings.some((w) => String(w).indexOf(needle) === 0);
}

function hasSameLaterWarning(warnings, stepIndex1Based) {
  return warnings.some(
    (w) => String(w) === "Step " + stepIndex1Based + " depends on same/later step."
  );
}

function hasMissingSourceWarning(warnings, stepIndex1Based) {
  return warnings.some(
    (w) => String(w) === "Step " + stepIndex1Based + " references missing source step."
  );
}

test("conventional runnable local prompt → no prompt warning", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([
    {
      id: "s1",
      title: "Generate Learning Content",
      canonical_step_id: "step_generate_learning_content",
      prompt_source_type: "local_override",
      override_prompt_body: "Return learning_content JSON.",
      outputName: "learning_content",
      inputBindings: []
    }
  ]);
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasPromptWarning(warnings, 1), false);
  assert.equal(api.isWorkflowStepRunnablePromptConfiguration(wf.steps[0], wf), true);
});

test("Design Episode Plan v2_locked empty text → no prompt warning", () => {
  const { api } = loadPrismTestApi();
  const ep = {
    id: "ep1",
    title: "Design Episode Plan",
    canonical_step_id: "step_design_episode_plan",
    prompt_source_type: "local_override",
    override_prompt_body: "",
    outputName: "page",
    inputBindings: []
  };
  const wf = pageEnrichmentWf([ep]);
  const resolved = api.resolveStepPromptText(ep, wf);
  assert.equal(resolved.sourceType, "v2_locked");
  assert.equal(String(resolved.text || "").trim(), "");
  assert.equal(api.isWorkflowStepRunnablePromptConfiguration(ep, wf, resolved), true);
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasPromptWarning(warnings, 1), false);
});

test("Generate Assessment Items v2_locked → no prompt warning", () => {
  const { api } = loadPrismTestApi();
  const gai = {
    id: "gai1",
    title: "Generate Assessment Items",
    canonical_step_id: "step_generate_assessment_items",
    prompt_source_type: "local_override",
    override_prompt_body: "",
    outputName: "page",
    inputBindings: []
  };
  const wf = pageEnrichmentWf([gai]);
  const resolved = api.resolveStepPromptText(gai, wf);
  assert.equal(resolved.sourceType, "v2_locked");
  assert.equal(api.isWorkflowStepRunnablePromptConfiguration(gai, wf, resolved), true);
  assert.equal(hasPromptWarning(api.validateWorkflow(wf), 1), false);
});

test("empty custom step → prompt warning remains", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([
    {
      id: "c1",
      title: "My Custom Step",
      prompt_source_type: "local_override",
      override_prompt_body: "",
      outputName: "custom_out",
      inputBindings: []
    }
  ]);
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasPromptWarning(warnings, 1), true);
  assert.equal(api.isWorkflowStepRunnablePromptConfiguration(wf.steps[0], wf), false);
});

test("missing library prompt body → prompt warning remains", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([
    {
      id: "lib1",
      title: "Library Step",
      prompt_source_type: "library_prompt",
      promptId: "does-not-exist-prompt-id-s75",
      override_prompt_body: "",
      outputName: "lib_out",
      inputBindings: []
    }
  ]);
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasPromptWarning(warnings, 1), true);
  assert.match(
    String(warnings.find((w) => hasPromptWarning([w], 1)) || ""),
    /Library prompt selected|could not be resolved|No prompt/i
  );
});

test("valid shared-page self/later binding → no same/later warning", () => {
  const { api } = loadPrismTestApi();
  const epId = "ep-shared";
  const clsId = "cls-later";
  const wf = pageEnrichmentWf([
    {
      id: epId,
      title: "Design Episode Plan",
      canonical_step_id: "step_design_episode_plan",
      prompt_source_type: "local_override",
      override_prompt_body: "",
      outputName: "page",
      inputBindings: [
        {
          kind: "internal",
          artifactName: "page",
          sourceStepId: epId
        },
        {
          kind: "internal",
          artifactName: "page",
          sourceStepId: clsId
        }
      ]
    },
    {
      id: clsId,
      title: "Construct Learning Sequence",
      canonical_step_id: "step_construct_learning_sequence",
      prompt_source_type: "local_override",
      override_prompt_body: "Build learning_sequence.",
      outputName: "page",
      inputBindings: []
    }
  ]);
  assert.equal(
    api.isSharedPageEnrichmentInputBinding(
      wf.steps[0],
      wf.steps[0],
      wf.steps[0].inputBindings[0],
      wf
    ),
    true
  );
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasSameLaterWarning(warnings, 1), false);
  assert.equal(hasPromptWarning(warnings, 1), false);
});

test("representative Educational Psychology fixture → no known false-positive set", () => {
  const { api } = loadPrismTestApi();
  const wf = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  assert.equal(wf.workflowOutputSpec.pageEnrichmentV2, true);
  const warnings = api.validateWorkflow(wf);
  const falsePositives = warnings.filter((w) => {
    const s = String(w);
    return (
      /has no runnable prompt configured/.test(s) ||
      /depends on same\/later step/.test(s)
    );
  });
  assert.equal(
    falsePositives.length,
    0,
    "Unexpected false-positive warnings: " + JSON.stringify(falsePositives)
  );
  // This fixture has no genuine validation issues under the current model.
  assert.equal(warnings.length, 0, "Unexpected warnings: " + JSON.stringify(warnings));
});

test("missing source binding → warning remains", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([
    {
      id: "s1",
      title: "Model Knowledge",
      canonical_step_id: "step_model_knowledge",
      prompt_source_type: "local_override",
      override_prompt_body: "Model knowledge.",
      outputName: "knowledge_model",
      inputBindings: [
        {
          kind: "internal",
          artifactName: "learning_content",
          sourceStepId: "missing-step-id"
        }
      ]
    }
  ]);
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasMissingSourceWarning(warnings, 1), true);
});

test("genuinely invalid custom same/later dependency → warning remains", () => {
  const { api } = loadPrismTestApi();
  const wf = pageEnrichmentWf([
    {
      id: "early",
      title: "Custom Consumer",
      prompt_source_type: "local_override",
      override_prompt_body: "Consume upstream.",
      outputName: "custom_a",
      inputBindings: [
        {
          kind: "internal",
          artifactName: "custom_b",
          sourceStepId: "later"
        }
      ]
    },
    {
      id: "later",
      title: "Custom Producer",
      prompt_source_type: "local_override",
      override_prompt_body: "Produce custom_b.",
      outputName: "custom_b",
      inputBindings: []
    }
  ]);
  const warnings = api.validateWorkflow(wf);
  assert.equal(hasSameLaterWarning(warnings, 1), true);
});

test("Run Copy uses shared runnable predicate with validateWorkflow", () => {
  const { source } = loadPrismTestApi();
  assert.match(
    source,
    /isWorkflowStepRunnablePromptConfiguration\(effectiveStep,\s*liveWf,\s*resolved\)/
  );
  assert.match(
    source,
    /isWorkflowStepRunnablePromptConfiguration\(s,\s*wf,\s*promptResolved\)/
  );
});
