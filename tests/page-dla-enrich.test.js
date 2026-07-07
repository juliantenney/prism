/**
 * Sprint 56F Phase 3 — DLA enrich-in-place tests.
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
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));
const strictJson = require(path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"));

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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js",
      "lib/episode-plan-population-contract.js"
    ])
  );
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

function buildPageShellFromLo(lo, options) {
  const episodePlans = buildEpisodePlansFromLo(lo);
  return shellCreate.createPageShellFromEpisodePlan(
    episodePlans,
    Object.assign({ learning_outcomes: lo }, options || {})
  );
}

function buildTestWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-dla-test",
      goal: "Inflation learning page",
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "episode_plans",
          canonical_step_id: "step_design_episode_plan"
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "learning_activities",
          canonical_step_id: "step_design_learning_activities",
          override_prompt_body: "Enrich the upstream vNext page shell with DLA-owned activity fields."
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

const api = loadPrismTestApi();
const PLACEHOLDER = shellCreate.SHELL_DLA_PLACEHOLDER;

let shellBaseline;
let enrichedPage;

test("setup: build page shell baseline", () => {
  shellBaseline = buildPageShellFromLo(SAMPLE_LO, {
    title: "Inflation page",
    audience: "Year 12 learners"
  });
  const check = shellCreate.validatePageShellAgainstVNextSchema(shellBaseline);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("DLA accepts a vNext page shell as input", () => {
  assert.doesNotThrow(() => {
    enrichedPage = dlaEnrich.enrichPageWithDla(shellBaseline);
  });
  assert.equal(enrichedPage.artifact_type, "page");
  assert.equal(enrichedPage.schema_version, "2.0.0");
});

test("DLA returns a full vNext page, not a standalone DLA object", () => {
  assert.ok(enrichedPage);
  assert.equal(enrichedPage.artifact_type, "page");
  assert.equal("learning_activities" in enrichedPage, false);
  assert.ok(Array.isArray(enrichedPage.activities));
  assert.ok(Array.isArray(enrichedPage.learning_outcomes));
});

test("DLA replaces learner_task, expected_output, and activity_preamble", () => {
  enrichedPage.activities.forEach((activity) => {
    assert.notEqual(activity.learner_task, PLACEHOLDER);
    assert.notEqual(activity.expected_output, PLACEHOLDER);
    assert.notEqual(activity.activity_preamble, PLACEHOLDER);
  });
});

test("no placeholder em dash remains in required DLA fields", () => {
  const check = dlaEnrich.validateDlaEnrichedPage(enrichedPage, shellBaseline);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  enrichedPage.activities.forEach((activity) => {
    dlaEnrich.DLA_REQUIRED_STRING_FIELDS.forEach((field) => {
      assert.equal(dlaEnrich.isShellPlaceholder(activity[field]), false, field);
    });
  });
});

test("DLA populates required_materials[] from episode plan beats", () => {
  enrichedPage.activities.forEach((activity) => {
    const beatCount = activity.episode_plan.beats.length;
    assert.ok(activity.required_materials.length > 0);
    assert.ok(activity.required_materials.length <= beatCount + 3);
    activity.required_materials.forEach((row) => {
      assert.ok(row.material_id);
      assert.ok(row.material_type || row.type);
      assert.ok(row.purpose);
    });
  });
});

test("required material IDs are stable and activity-scoped", () => {
  enrichedPage.activities.forEach((activity) => {
    const aid = activity.activity_id;
    const ids = activity.required_materials.map((row) => row.material_id);
    assert.ok(ids.every((id) => String(id).startsWith(aid + "-M")));
    assert.equal(new Set(ids).size, ids.length);
  });
});

test("materials[] remains empty", () => {
  enrichedPage.activities.forEach((activity) => {
    assert.deepEqual(activity.materials, []);
  });
});

test("no materials[].body is written", () => {
  enrichedPage.activities.forEach((activity) => {
    (activity.materials || []).forEach((material) => {
      assert.equal("body" in material && material.body, undefined);
    });
  });
});

test("page_synthesis remains {}", () => {
  assert.deepEqual(enrichedPage.page_synthesis, {});
});

test("no sections[] are written", () => {
  assert.equal("sections" in enrichedPage, false);
});

test('assembly_state.current_stage becomes "dla"', () => {
  assert.equal(enrichedPage.assembly_state.current_stage, "dla");
});

test('assembly_state.enriched_by includes "episode_plan" and "dla"', () => {
  assert.deepEqual(enrichedPage.assembly_state.enriched_by, ["episode_plan", "dla"]);
});

test("activity IDs and order are preserved", () => {
  assert.deepEqual(
    shellBaseline.activities.map((row) => row.activity_id),
    enrichedPage.activities.map((row) => row.activity_id)
  );
});

test("legacy DLA path still works when pageEnrichmentV2 is explicitly disabled", () => {
  const wf = buildTestWorkflow({ pageEnrichmentV2: false });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveDesignLearningActivitiesCaptureJson(wf);
  assert.equal(json, "");
  const epJson = api.deriveDesignEpisodePlanCaptureJson(wf);
  assert.ok(epJson);
  const parsed = JSON.parse(epJson);
  assert.ok(Array.isArray(parsed.episode_plans));
});

test("DLA copy prompt expects page input and page output under v2", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const dlaStep = wf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  const instr = api.buildWorkflowStepInstructions(dlaStep, 2, null);
  assert.match(instr, /STEP 3 OUTPUT: page/i);
  assert.match(instr, /enrich-in-place|Sprint 56F DLA/i);
  assert.match(instr, /Upstream page shell/i);
  assert.match(instr, /Do NOT emit a standalone learning_activities/i);
  assert.match(instr, /"artifact_type":\s*"page"|schema_version.*2\.0\.0/i);
});

test("DLA bindings use page artefact from Design Episode Plan", () => {
  const wf = buildTestWorkflow();
  const bindings = api.ensureEpisodePlanInputBindingsForSteps(wf.steps, wf);
  const dla = bindings.find((s) => s.id === "dla_step");
  const epBinding = (dla.inputBindings || []).find((b) => b.sourceStepId === "ep_step");
  assert.ok(epBinding);
  assert.equal(epBinding.artifactName, "page");
});

test("deriveDesignLearningActivitiesCaptureJson emits DLA-enriched vNext page", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveDesignLearningActivitiesCaptureJson(wf);
  assert.ok(json);
  const page = JSON.parse(json);
  const check = api.validateDlaOrPageCapture(page, buildPageShellFromLo(SAMPLE_LO));
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(page.assembly_state.current_stage, "dla");
});

test("enriched page still renders through Phase 8 adapter", () => {
  const normalized = api.normalizePageForRenderForTest(enrichedPage);
  assert.equal(normalized.__prismRenderNormalized, true);
  const renderResult = api.buildUtilityStructuredHtmlForTest(normalized, {
    applyCompositionValidation: false
  });
  assert.ok(renderResult && !renderResult.error, renderResult && renderResult.error);
  const html = String(renderResult.html || "");
  assert.ok(html.length > 0);
  assert.match(html, /Inflation page|Learning Activities/i);
});

test("Copilot-style bad DLA page fails validation", () => {
  const bad = Object.assign({}, enrichedPage, {
    activities: enrichedPage.activities.map((activity, index) =>
      index === 0
        ? Object.assign({}, activity, {
            learner_task: PLACEHOLDER,
            materials: [{ material_id: "X1", material_type: "text", title: "x", body: "forbidden" }]
          })
        : activity
    )
  });
  const check = dlaEnrich.validateDlaEnrichedPage(bad, shellBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /learner_task/.test(err)));
  assert.ok(check.errors.some((err) => /body forbidden/.test(err)));
});

test("normalizeDlaCaptureToPage merges legacy learning_activities rows into page shell", () => {
  const legacyRows = enrichedPage.activities.map((activity) =>
    Object.assign({}, activity, { materials: [] })
  );
  const merged = dlaEnrich.normalizeDlaCaptureToPage(shellBaseline, {
    activities: legacyRows
  });
  assert.ok(merged);
  assert.equal(merged.artifact_type, "page");
  const check = dlaEnrich.validateDlaEnrichedPage(merged, shellBaseline);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});
