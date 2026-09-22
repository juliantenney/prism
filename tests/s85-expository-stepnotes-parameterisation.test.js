/**
 * Sprint 85 — Expository Copy must not prompt for internal template tokens (stepNotes).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("module");

const sibling = require("../lib/expository-sibling-prompts.js");
const contracts = require("../lib/expository-contracts.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function loadPrismTestApi() {
  const requireFromApp = createRequire(appJsPath);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    require: requireFromApp,
    module: { exports: {} },
    exports: {},
    __dirname: repoRoot,
    __filename: appJsPath
  };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = sandbox;
  windowStub.window = windowStub;
  windowStub.PrismExpositorySiblingPrompts = sibling;
  windowStub.PrismExpositoryContracts = contracts;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const api = loadPrismTestApi();

function makeExpositorySteps() {
  return [
    {
      id: "glc1",
      title: "Generate Learning Content",
      canonical_step_id: "step_generate_learning_content",
      outputName: "learning_content",
      prompt_source_type: "local_override",
      override_prompt_body: "stale interactive body with {{stepNotes}}",
      notes: "",
      inputBindings: []
    },
    {
      id: "mk1",
      title: "Model Knowledge",
      canonical_step_id: "step_model_knowledge",
      outputName: "knowledge_model",
      prompt_source_type: "local_override",
      override_prompt_body: "MK body",
      notes: "",
      inputBindings: []
    },
    {
      id: "lo1",
      title: "Define Learning Outcomes",
      canonical_step_id: "step_define_learning_outcomes",
      outputName: "learning_outcomes",
      prompt_source_type: "local_override",
      override_prompt_body: "stale with {{option:learnerLevel}} and {{stepNotes}}",
      notes: "",
      inputBindings: []
    },
    {
      id: "ejp1",
      title: "Expository Journey Plan",
      canonical_step_id: "step_expository_journey_plan",
      outputName: "expository_journey_plan",
      prompt_source_type: "local_override",
      override_prompt_body: "",
      notes: "",
      inputBindings: []
    },
    {
      id: "xd1",
      title: "Expository Development",
      canonical_step_id: "step_expository_development",
      outputName: "expository_development",
      prompt_source_type: "local_override",
      override_prompt_body: "",
      notes: "",
      inputBindings: []
    },
    {
      id: "xm1",
      title: "Expository Materials",
      canonical_step_id: "step_expository_materials",
      outputName: "expository_materials",
      prompt_source_type: "local_override",
      override_prompt_body: "",
      notes: "",
      inputBindings: []
    },
    {
      id: "dp1",
      title: "Design Page",
      canonical_step_id: "step_design_page",
      outputName: "page",
      prompt_source_type: "local_override",
      override_prompt_body: "",
      notes: "",
      inputBindings: []
    }
  ];
}

function makeExpositoryWf(steps) {
  return {
    id: "wf-expo-stepnotes",
    name: "Expository stepNotes regression",
    ldCreateOutputType: api.LD_CREATE_OUTPUT_TYPE_EXPOSITORY,
    workflowOutputSpec: { pageEnrichmentV2: true, partialPageOutputs: true },
    steps: steps || makeExpositorySteps()
  };
}

const INTERNAL_TOKEN_RE =
  /\{\{\s*(stepNotes|preferredOutputFormat|stepTitle|stepOutputName|inputArtefactTypes|option:[^}]+)\s*\}\}/i;

test("fresh Expository GLC materialised prompt has no unresolved stepNotes token", () => {
  const wf = makeExpositoryWf();
  const glc = wf.steps[0];
  const resolved = api.resolveStepPromptText(glc, wf);
  const body = String((resolved && resolved.text) || "");
  assert.ok(body.length > 100, "expected materialised GLC sibling body");
  assert.match(body, /explanatory richness spine/i);
  assert.doesNotMatch(body, /\{\{\s*stepNotes\s*\}\}/i);
  const unresolved = api.extractTemplateVariables(body);
  assert.equal(
    unresolved.filter((n) => /stepNotes|option:/i.test(n)).length,
    0,
    "unresolved internal tokens: " + unresolved.join(", ")
  );
});

test("all seven Expository steps materialise without internal template placeholders", () => {
  const wf = makeExpositoryWf();
  const report = [];
  wf.steps.forEach((step) => {
    const title = String(step.title || "");
    // MK is shared Interactive-style body (no Expository sibling) — still must not
    // leave internal tokens if present in override.
    let body = "";
    if (String(step.canonical_step_id || "").indexOf("step_model_knowledge") !== -1) {
      body = api.materializeWorkflowPromptTemplateTokens(
        String(step.override_prompt_body || ""),
        step,
        wf
      );
    } else {
      const resolved = api.resolveStepPromptText(step, wf);
      body = String((resolved && resolved.text) || "");
    }
    const hits = api.extractTemplateVariables(body).filter((n) =>
      /^(stepNotes|preferredOutputFormat|stepTitle|stepOutputName|inputArtefactTypes|option:)/i.test(
        n
      )
    );
    if (INTERNAL_TOKEN_RE.test(body) || hits.length) {
      report.push(title + ": " + hits.join(", "));
    }
  });
  assert.deepEqual(report, [], report.join(" | ") || "ok");
});

test("materialize clears stepNotes and leaves empty-line note clauses stripped", () => {
  const raw = sibling.resolveTemplate("generate_learning_content");
  assert.match(raw, /\{\{\s*stepNotes\s*\}\}/);
  const out = api.materializeWorkflowPromptTemplateTokens(
    raw,
    {
      title: "Generate Learning Content",
      canonical_step_id: "step_generate_learning_content",
      outputName: "learning_content",
      notes: ""
    },
    makeExpositoryWf()
  );
  assert.doesNotMatch(out, /\{\{\s*stepNotes\s*\}\}/);
  assert.doesNotMatch(out, /^-\s*Apply step notes when provided:\s*$/m);
});

test("Interactive GLC pack template still contains stepNotes token at source (baseline unchanged)", () => {
  const text = fs.readFileSync(
    path.join(repoRoot, "domains/learning-design/domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const glcIdx = text.indexOf("## 2. Generate Learning Content");
  const mkIdx = text.indexOf("## 3. Model Knowledge");
  const chunk = text.slice(glcIdx, mkIdx);
  assert.match(chunk, /\{\{stepNotes\}\}/);
});
