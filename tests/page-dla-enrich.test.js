/**
 * Sprint 56F Phase 3 — DLA enrich-in-place tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS, injectLearnerRendererVNextInSandbox, patchDlaEnrichBridgeForTests, buildLegacyEpisodePlanWorkflow, renderUtilityPageHtmlForTest } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const { applyS76CommissionShape } = require("./s76-dla-commission-shape.js");
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
      "lib/ld-activity-title-contract.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js",
      "lib/episode-plan-v1-vocabulary.js",
      "lib/episode-plan-population-contract.js"
    ])
  );
  if (sandbox.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT) {
    windowStub.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = sandbox.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT;
  }
  patchDlaEnrichBridgeForTests(dlaEnrich);
  windowStub.PRISM_PAGE_SHELL_CREATE = shellCreate;
  windowStub.PRISM_PAGE_DLA_ENRICH = dlaEnrich;
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
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
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes" },
        {
          id: "ep_step",
          title: "Design Episode Plan",
          outputName: "page",
          canonical_step_id: "step_design_episode_plan"
        },
        {
          id: "dla_step",
          title: "Design Learning Activities",
          outputName: "page",
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
      assert.ok(String(row.specification || "").trim());
    });
    assert.ok(activity.task_material_decision);
    assert.equal(typeof activity.task_material_decision.separate_inputs_required, "boolean");
    assert.ok(Array.isArray(activity.task_material_decision.task_input_material_ids));
    if (activity.task_material_decision.separate_inputs_required) {
      assert.ok(activity.task_material_decision.task_input_material_ids.length >= 1);
    } else {
      assert.deepEqual(activity.task_material_decision.task_input_material_ids, []);
    }
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
  const wf = buildLegacyEpisodePlanWorkflow({ id: "wf-dla-legacy" });
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
  assert.match(instr, /partial page artefact|Sprint 58 DLA partial|Do NOT emit a standalone learning_activities/i);
  assert.match(instr, /Upstream binding bodies are intentionally omitted|intellectual_coherence_bridge/i);
});

test("S77 Gate B: DLA canonical contract injected once on Copy; task_material_decision present", () => {
  const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
  const assembled = dlaContract.assembleDlaCanonicalContract();
  assert.match(assembled.sections.task_inputs, /task_material_decision/);
  assert.match(assembled.sections.examples, /task_material_decision/);
  const appSrc = fs.readFileSync(appJsPath, "utf8");
  assert.match(appSrc, /assembleDlaCanonicalContract/);
  assert.match(appSrc, /requireLdDlaPageEnrichContractLib/);
  assert.doesNotMatch(appSrc, /isDlaCanonicalAssemblerEnabled/);
  assert.doesNotMatch(appSrc, /buildDlaPageEnrichContractBlock\(\)/);
  assert.doesNotMatch(appSrc, /buildCanonicalDlaPageShapeSnippet\(\)/);
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const dlaStep = wf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  const instr = api.buildWorkflowStepInstructions(dlaStep, 2, null);
  assert.equal((instr.split("## 1. DLA ROLE AND AUTHORITY").length - 1), 1);
  assert.doesNotMatch(instr, /### Sprint 58 vNext DLA partial-page contract/);
  assert.match(
    api.LEARNER_PAGE_DLA_ACTIVITIES_SCHEMA_OUTPUT_LINE,
    /task_material_decision\{ separate_inputs_required, task_input_material_ids\[\] \}/
  );
});

test("S77 Studio: canonical heading once; no legacy Sprint 58 pair", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const dlaStep = wf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  const studio = api.applyWorkflowStepRuntimePromptAugmentations(
    "DLA pack body for studio assembly.",
    dlaStep,
    wf
  );
  assert.equal((studio.split("## 1. DLA ROLE AND AUTHORITY").length - 1), 1);
  assert.doesNotMatch(studio, /### Sprint 58 vNext DLA partial-page contract/);
  assert.doesNotMatch(studio, /Canonical DLA partial activity shape/);
});

test("Phase D: dlaCanonicalAssembler false no longer restores Sprint 76 dual contract+shape", () => {
  const wf = buildTestWorkflow({
    dlaCanonicalAssembler: false,
    workflowOutputSpec: {
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      dlaCanonicalAssembler: false
    }
  });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const dlaStep = wf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  const instr = api.buildWorkflowStepInstructions(dlaStep, 2, null);
  assert.equal((instr.split("## 1. DLA ROLE AND AUTHORITY").length - 1), 1);
  assert.doesNotMatch(instr, /### Sprint 58 vNext DLA partial-page contract/);
  assert.equal(typeof api.isDlaCanonicalAssemblerEnabled, "undefined");
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
  const renderResult = renderUtilityPageHtmlForTest(api, enrichedPage);
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

test("repairDlaPartialShellPlaceholderFields replaces copy-forwarded em dash preambles", () => {
  const partial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: shellBaseline.activities.map((activity) =>
      applyS76CommissionShape({
        activity_id: activity.activity_id,
        title: activity.title || "Activity " + activity.activity_id,
        learner_task: "Substantive learner task for " + activity.activity_id + ".",
        expected_output: "Substantive expected output for " + activity.activity_id + ".",
        activity_preamble: PLACEHOLDER,
        required_materials: [{ material_id: activity.activity_id + "-M1", material_type: "text", purpose: "Support" }],
        materials: [],
        evidence_decision: {
          required: false,
          reason: "No evidence inspection required.",
          provider_material_ids: []
        }
      })
    )
  };
  const before = dlaEnrich.validateDlaPartialPageCapture(partial, { baseline: shellBaseline });
  assert.equal(before.ok, false);
  assert.ok(
    before.errors.some((err) => /activity_preamble must be enriched when present/.test(err))
  );

  const repaired = dlaEnrich.repairDlaPartialShellPlaceholderFields(partial, {
    baseline: shellBaseline
  });
  assert.equal(repaired.repairApplied, true);
  assert.ok(repaired.repairs.length > 0);
  repaired.page.activities.forEach((activity) => {
    assert.notEqual(activity.activity_preamble, PLACEHOLDER);
    assert.equal(dlaEnrich.isShellPlaceholder(activity.activity_preamble), false);
  });

  const after = dlaEnrich.validateDlaPartialPageCapture(repaired.page, { baseline: shellBaseline });
  assert.equal(after.ok, true, after.errors && after.errors.join("; "));
});

test("repairDlaPartialShellPlaceholderFields preserves enriched preamble prose", () => {
  const preamble = "Orient yourself to the comparison sequence before you begin.";
  const partial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A1",
        title: "Map inflation cause chains",
        learner_task: "Compare inflation drivers.",
        expected_output: "A comparison paragraph.",
        activity_preamble: preamble,
        required_materials: [{ material_id: "A1-M1", material_type: "text", purpose: "Support" }],
        materials: [],
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        evidence_decision: {
          required: false,
          reason: "No evidence inspection required.",
          provider_material_ids: []
        }
      }
    ]
  };
  const repaired = dlaEnrich.repairDlaPartialShellPlaceholderFields(partial, {
    baseline: shellBaseline
  });
  assert.equal(repaired.repairApplied, false);
  assert.equal(repaired.page.activities[0].activity_preamble, preamble);
});
