/**
 * Sprint 56F Phase 2 — Episode Plan page shell creation tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));
const strictJson = require(path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"));

const FROZEN_LO = require(path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-frozen-learning-outcomes.json"
));

const SAMPLE_LO = {
  learning_outcomes: [
    { id: "LO1", cognitive_level: "understand", statement: "Explain inflation drivers." },
    { id: "LO2", cognitive_level: "apply", statement: "Apply CPI calculations." }
  ]
};

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  windowStub.PRISM_EPISODE_PLAN_V1_TEMPLATES = templates;
  windowStub.PRISM_EPISODE_PLAN_DLA_INTEGRATION = integration;
  windowStub.PRISM_EPISODE_PLAN_V1_VALIDATION = validation;
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat(["lib/page-shell-create.js"]));
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"), "utf8"),
    sandbox,
    { filename: "ld-design-page-compose-contract.js" }
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return api;
}

function buildEpisodePlansFromLo(lo) {
  return integration.deriveEpisodePlansFromLearningOutcomes(lo);
}

function buildTestWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-shell-test",
      goal: "Inflation learning page",
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "episode_plans",
          canonical_step_id: "step_design_episode_plan",
          override_prompt_body: "Derive the Sprint 56F page shell from learning_outcomes."
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "learning_activities",
          canonical_step_id: "step_design_learning_activities"
        }
      ]
    },
    overrides || {}
  );
}

function setupWorkflowCaptures(api, wf, lo) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(lo, null, 2)
  });
}

function createShellFromLo(lo, options) {
  const episodePlans = buildEpisodePlansFromLo(lo);
  return shellCreate.createPageShellFromEpisodePlan(episodePlans, Object.assign({ learning_outcomes: lo }, options || {}));
}

const api = loadPrismTestApi();

test("Episode Plan output can create a valid vNext page shell", () => {
  const shell = createShellFromLo(SAMPLE_LO, { title: "Inflation page", audience: "Year 12 learners" });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("shell has schema_version 2.0.0", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.equal(shell.schema_version, "2.0.0");
});

test("shell has required top-level fields", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  [
    "artifact_type",
    "schema_version",
    "title",
    "audience",
    "page_profile",
    "assembly_state",
    "page_synthesis",
    "activities",
    "learning_outcomes",
    "episode_plans",
    "source_artefacts",
    "generation_notes"
  ].forEach((key) => {
    assert.ok(key in shell, "missing " + key);
  });
  assert.equal(shell.artifact_type, "page");
});

test("shell has empty page_synthesis object", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.deepEqual(shell.page_synthesis, {});
});

test("shell has top-level activities[]", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.ok(Array.isArray(shell.activities));
  assert.equal(shell.activities.length, SAMPLE_LO.learning_outcomes.length);
});

test("each activity has stable activity_id", () => {
  const shell = createShellFromLo(FROZEN_LO, {
    title: "38L depth page",
    audience: "Learners"
  });
  assert.equal(shell.activities.length, 4);
  assert.deepEqual(
    shell.activities.map((row) => row.activity_id),
    ["A1", "A2", "A3", "A4"]
  );
  assert.deepEqual(
    shell.episode_plans.map((row) => row.activity_id),
    ["A1", "A2", "A3", "A4"]
  );
});

test("each activity has empty required_materials and materials arrays", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  shell.activities.forEach((activity) => {
    assert.deepEqual(activity.required_materials, []);
    assert.deepEqual(activity.materials, []);
  });
});

test("no sections[] are written on the shell", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.equal("sections" in shell, false);
});

test("no DLA cognition fields are invented on shell activities", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.equal(shellCreate.shellHasInventedDlaFields(shell), false);
  shell.activities.forEach((activity) => {
    shellCreate.DLA_COGNITION_FIELDS.forEach((field) => {
      assert.equal(field in activity, false, "unexpected DLA field " + field);
    });
  });
});

test("no GAM material bodies are invented on shell activities", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.equal(shellCreate.shellHasInventedGamMaterials(shell), false);
});

test("existing legacy Episode Plan output still works when v2 is explicitly disabled", () => {
  const wf = buildTestWorkflow({ pageEnrichmentV2: false });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveDesignEpisodePlanCaptureJson(wf);
  assert.ok(json);
  const parsed = JSON.parse(json);
  assert.ok(Array.isArray(parsed.episode_plans));
  assert.equal(parsed.artifact_type, undefined);
  assert.equal(parsed.schema_version, undefined);
  const gate = validation.validateEpisodePlansContainerV1(parsed);
  assert.equal(gate.ok, true, gate.errors && gate.errors.join("; "));
});

test("deriveDesignEpisodePlanCaptureJson emits vNext page shell for EP workflows by default", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveDesignEpisodePlanCaptureJson(wf);
  assert.ok(json);
  const shell = JSON.parse(json);
  const check = api.validateEpisodePlanOrPageShellCapture(shell);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(shell.schema_version, "2.0.0");
  assert.ok(Array.isArray(shell.episode_plans) && shell.episode_plans.length > 0);
});

test("EP copy prompt requests STEP N OUTPUT: page and vNext shell when LO available", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const epStep = wf.steps.find((s) => s.canonical_step_id === "step_design_episode_plan");
  const instr = api.buildWorkflowStepInstructions(epStep, 1, null);
  assert.match(instr, /STEP 2 OUTPUT: page/);
  assert.match(instr, /schema_version.*2\.0\.0|Sprint 56F vNext page shell/i);
  assert.match(instr, /"artifact_type":\s*"page"|artifact_type "page"/i);
});

test("DLA bindings use page artefact from Design Episode Plan under Sprint 56F", () => {
  const wf = buildTestWorkflow();
  const bindings = api.ensureEpisodePlanInputBindingsForSteps(wf.steps, wf);
  const dla = bindings.find((s) => s.id === "dla_step");
  const epBinding = (dla.inputBindings || []).find((b) => b.sourceStepId === "ep_step");
  assert.ok(epBinding);
  assert.equal(epBinding.artifactName, "page");
});

test("deriveDesignEpisodePlanCaptureJson emits vNext page shell when pageEnrichmentV2 is enabled", () => {
  const wf = buildTestWorkflow({ pageEnrichmentV2: true });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveDesignEpisodePlanCaptureJson(wf);
  assert.ok(json);
  const shell = JSON.parse(json);
  const check = api.validateEpisodePlanOrPageShellCapture(shell);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(shell.schema_version, "2.0.0");
  assert.ok(Array.isArray(shell.episode_plans) && shell.episode_plans.length > 0);
});

test("page shell episode_plans remain extractable for legacy DLA upstream resolution", () => {
  const wf = buildTestWorkflow({ pageEnrichmentV2: true });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const shellJson = api.deriveDesignEpisodePlanCaptureJson(wf);
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(SAMPLE_LO, null, 2),
    ep_step: shellJson
  });
  const upstream = api.resolveEpisodePlansForDlaPopulation({ workflow: wf });
  assert.ok(upstream && Array.isArray(upstream.episode_plans));
  assert.equal(upstream.episode_plans.length, SAMPLE_LO.learning_outcomes.length);
});

test("shell renders through Phase 8 adapter without renderer crash", () => {
  const shell = createShellFromLo(SAMPLE_LO, {
    title: "Renderer shell smoke test",
    audience: "Learners"
  });
  const normalized = api.normalizePageForRenderForTest(shell);
  assert.equal(normalized.__prismRenderNormalized, true);
  const renderResult = api.buildUtilityStructuredHtmlForTest(normalized, {
    applyCompositionValidation: false
  });
  assert.ok(renderResult && !renderResult.error, renderResult && renderResult.error);
  const html = String(renderResult.html || "");
  assert.ok(html.length > 0);
  assert.match(html, /Renderer shell smoke test|Learning Activities/i);
});

test("createPageShellFromEpisodePlan does not mutate episode plan input", () => {
  const episodePlans = buildEpisodePlansFromLo(SAMPLE_LO);
  const before = JSON.stringify(episodePlans);
  createShellFromLo(SAMPLE_LO);
  assert.equal(JSON.stringify(episodePlans), before);
});

const PLACEHOLDER = shellCreate.SHELL_DLA_PLACEHOLDER;

function buildMinimalValidShell(overrides) {
  const shell = createShellFromLo(SAMPLE_LO, {
    title: "Canonical shell test",
    audience: "Learners"
  });
  return Object.assign({}, shell, overrides || {});
}

test("realistic Copilot-style vNext page shell with object page_profile validates", () => {
  const shell = buildMinimalValidShell({
    page_profile: { profile_type: "learner" },
    source_artefacts: [
      {
        artefact_type: "learning_outcomes",
        source_label: "Learning Outcomes",
        role: "structural"
      }
    ],
    activities: shellCreate.createPageShellFromEpisodePlan(buildEpisodePlansFromLo(SAMPLE_LO), {
      learning_outcomes: SAMPLE_LO
    }).activities.map((activity) =>
      Object.assign({}, activity, {
        learner_task: PLACEHOLDER,
        expected_output: PLACEHOLDER,
        activity_preamble: PLACEHOLDER
      })
    )
  });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.deepEqual(shell.page_profile, { profile_type: "learner" });
});

test("string page_profile fails validation", () => {
  const shell = buildMinimalValidShell({ page_profile: "learner" });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /page_profile must be an object/.test(err)));
});

test("structured source_artefacts[] validates", () => {
  const shell = buildMinimalValidShell({
    source_artefacts: [
      {
        artefact_type: "learning_outcomes",
        source_label: "Learning Outcomes",
        role: "structural"
      }
    ]
  });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("string-array source_artefacts fails validation", () => {
  const shell = buildMinimalValidShell({ source_artefacts: ["learning_outcomes"] });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /source_artefacts\[0\] must be a structured object/.test(err)));
});

test("empty learner_task and expected_output fail validation", () => {
  const shell = buildMinimalValidShell();
  shell.activities = shell.activities.map((activity, index) =>
    index === 0
      ? Object.assign({}, activity, { learner_task: "", expected_output: "" })
      : activity
  );
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /learner_task/.test(err)));
  assert.ok(check.errors.some((err) => /expected_output/.test(err)));
});

test('placeholder em dash values pass validation', () => {
  const shell = buildMinimalValidShell();
  shell.activities.forEach((activity) => {
    activity.learner_task = PLACEHOLDER;
    activity.expected_output = PLACEHOLDER;
    activity.activity_preamble = PLACEHOLDER;
  });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(shellCreate.isValidShellPlaceholder(PLACEHOLDER), true);
});

test("internally derived shell uses canonical page_profile object shape", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.equal(typeof shell.page_profile, "object");
  assert.equal(Array.isArray(shell.page_profile), false);
  assert.equal(shell.page_profile.profile_type, "learner");
});

test("internally derived shell uses structured source_artefacts metadata", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  assert.deepEqual(shell.source_artefacts, [
    {
      artefact_type: "learning_outcomes",
      source_label: "Learning Outcomes",
      role: "structural"
    }
  ]);
});

test("internally derived shell uses em dash placeholders on all DLA shell fields", () => {
  const shell = createShellFromLo(SAMPLE_LO);
  shell.activities.forEach((activity) => {
    assert.equal(activity.learner_task, PLACEHOLDER);
    assert.equal(activity.expected_output, PLACEHOLDER);
    assert.equal(activity.activity_preamble, PLACEHOLDER);
  });
});

test("EP copy prompt includes canonical page_profile and source_artefacts examples", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const epStep = wf.steps.find((s) => s.canonical_step_id === "step_design_episode_plan");
  const instr = api.buildWorkflowStepInstructions(epStep, 1, null);
  assert.match(instr, /Canonical shape examples/i);
  assert.match(instr, /"page_profile":\s*\{\s*"profile_type":\s*"learner"\s*\}/);
  assert.match(instr, /"title":\s*"Learner-facing page title"/);
  assert.match(instr, /"audience":\s*"Learners"/);
  assert.match(instr, /"learning_outcomes":\s*\[/);
  assert.match(instr, /"generation_notes":\s*\{/);
  assert.match(instr, /"validation":\s*\{/);
  assert.match(instr, /"artefact_type":\s*"learning_outcomes"/);
  assert.match(instr, /"source_label":\s*"Learning Outcomes"/);
  assert.match(instr, /source_artefacts: \["learning_outcomes"\] \(string array\)/i);
  assert.match(instr, /page_profile: "learner" \(string\)/i);
});

test("EP copy prompt does not append legacy episode_plans strict JSON contract under v2", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const epStep = wf.steps.find((s) => s.canonical_step_id === "step_design_episode_plan");
  const instr = api.buildWorkflowStepInstructions(epStep, 1, null);
  assert.doesNotMatch(instr, /JSON top-level key: episode_plans/i);
  assert.doesNotMatch(instr, /episode_plans root object/i);
});

test("Copilot-style bad shell fails validateEpisodePlanOrPageShellCapture", () => {
  const badShell = buildMinimalValidShell({
    page_profile: "learner",
    source_artefacts: ["learning_outcomes"],
    activities: buildMinimalValidShell().activities.map((activity) =>
      Object.assign({}, activity, {
        learner_task: "",
        expected_output: "",
        activity_preamble: PLACEHOLDER
      })
    )
  });
  const check = api.validateEpisodePlanOrPageShellCapture(badShell);
  assert.equal(check.ok, false);
  assert.ok(check.errors.length >= 3);
});
