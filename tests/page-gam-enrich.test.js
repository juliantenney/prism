/**
 * Sprint 56F Phase 4 — GAM enrich-in-place tests.
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
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
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
      "lib/ld-gam-page-enrich-contract.js",
      "lib/page-gam-enrich.js",
      "lib/page-vnext-assemble.js",
      "lib/episode-plan-v1-vocabulary.js",
      "lib/episode-plan-population-contract.js"
    ])
  );
  patchDlaEnrichBridgeForTests(dlaEnrich);
  windowStub.PRISM_PAGE_SHELL_CREATE = shellCreate;
  windowStub.PRISM_PAGE_DLA_ENRICH = dlaEnrich;
  windowStub.PRISM_PAGE_GAM_ENRICH = gamEnrich;
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

function buildDlaEnrichedPage(lo) {
  const shell = buildPageShellFromLo(lo, {
    title: "Inflation page",
    audience: "Year 12 learners"
  });
  return dlaEnrich.enrichPageWithDla(shell);
}

function buildTestWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-gam-test",
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
          canonical_step_id: "step_design_learning_activities"
        },
        {
          id: "gam_step",
          title: "Generate Activity Materials",
          outputName: "page",
          canonical_step_id: "step_generate_activity_materials",
          override_prompt_body: "Populate materials[] from required_materials[] on the upstream DLA page."
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

function extractUpstreamDlaPageEmbedJson(promptText) {
  const text = String(promptText || "");
  const marker = "### Upstream DLA page";
  const markerIdx = text.indexOf(marker);
  if (markerIdx < 0) return null;
  const fencedIdx = text.indexOf("```json", markerIdx);
  if (fencedIdx < 0) return null;
  const afterFence = text.slice(fencedIdx + "```json".length);
  const endFenceIdx = afterFence.indexOf("```");
  if (endFenceIdx < 0) return null;
  const jsonText = afterFence.slice(0, endFenceIdx).trim();
  if (!jsonText) return null;
  try {
    return JSON.parse(jsonText);
  } catch (_) {
    return null;
  }
}

function buildDlaPageFixtureWithFullActivityFields() {
  const page = buildDlaEnrichedPage(SAMPLE_LO);
  page.activities = [
    {
      activity_id: "A1",
      title: "Strategic Role of HR",
      grouping: "pairs",
      duration_minutes: 10,
      mapped_learning_outcomes: ["LO1"],
      activity_preamble: "Read and compare strategic HR approaches.",
      learner_task: "Compare two strategic HR approaches in context.",
      expected_output: "A short comparison with justified implications.",
      reasoning_orientation: "Relate strategic intent to workforce outcomes.",
      required_materials: [
        { material_id: "A1-M1", material_type: "text", purpose: "Concept grounding", specification: "Define strategic HR in HE context." },
        { material_id: "A1-M2", material_type: "worked_example", purpose: "Reasoning model", specification: "Show strategic HR reasoning chain." }
      ],
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      evidence_decision: {
        required: false,
        reason: "Conceptual comparison from teaching materials.",
        provider_material_ids: []
      },
      materials: [],
      episode_plan: {
        archetype: "understand",
        beats: [{ function: "orient", note: "orient learners" }]
      }
    }
  ];
  page.learning_outcomes = [{ id: "LO1", cognitive_level: "understand", statement: "Explain strategic HR." }];
  page.episode_plans = [
    {
      activity_id: "A1",
      mapped_learning_outcome_ids: ["LO1"],
      episode_plan_id: "EP-A1",
      episode_plan: { archetype: "understand", beats: [{ function: "orient", note: "orient learners" }] }
    }
  ];
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  return page;
}

const api = loadPrismTestApi();

let dlaBaseline;
let gamEnrichedPage;

test("setup: build DLA-enriched baseline", () => {
  dlaBaseline = buildDlaEnrichedPage(SAMPLE_LO);
  const check = dlaEnrich.validateDlaEnrichedPage(dlaBaseline, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(dlaBaseline.assembly_state.current_stage, "dla");
  assert.ok(gamEnrich.GAM_DLA_OWNED_JSON_FIELDS.includes("task_material_decision"));
  assert.ok(gamEnrich.GAM_DLA_OWNED_JSON_FIELDS.includes("evidence_decision"));
});

test("GAM v2 copy brief enforces canonical hydrated material rows", () => {
  const wf = buildTestWorkflow({ partialPageOutputs: true, pageEnrichmentV2: true });
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const brief = api.buildWorkflowStepInstructions(
    {
      id: "gam_step_brief_probe",
      title: "Generate Activity Materials",
      outputName: "page",
      canonical_step_id: "step_generate_activity_materials"
    },
    3,
    null
  );
  assert.match(brief, /exactly one hydrated material object per required_materials\.material_id/i);
  assert.match(brief, /material_id, material_type, title, body_format, body/i);
  assert.match(brief, /activity_id \(or parent_activity_id\)/i);
  assert.match(brief, /no missing IDs, no duplicates, no orphan materials/i);
  assert.match(brief, /treat specification as binding content bounds/i);
  assert.match(brief, /Realised particulars must support the commissioned learner operation within those bounds/i);
  assert.match(brief, /do not substitute a different method or extra unstated reasoning/i);
  assert.match(brief, /do not invent pedagogical constraints the commission omits/i);
  assert.doesNotMatch(brief, /task_material_decision/);
  assert.doesNotMatch(brief, /Lagrangian/);
  assert.doesNotMatch(brief, /FINAL PRE-EMIT AUDIT/i);
  assert.match(brief, /do not leave generation_notes\.validation material_coverage\/self_containment\/activity_coverage in pending\/shell-only states/i);
});

test("GAM accepts a DLA-enriched vNext page as input", () => {
  assert.doesNotThrow(() => {
    gamEnrichedPage = gamEnrich.enrichPageWithGam(dlaBaseline);
  });
  assert.equal(gamEnrichedPage.artifact_type, "page");
  assert.equal(gamEnrichedPage.schema_version, "2.0.0");
});

test("GAM returns a full vNext page object, not a standalone materials artefact", () => {
  assert.ok(gamEnrichedPage);
  assert.equal(gamEnrichedPage.artifact_type, "page");
  assert.equal("activity_materials" in gamEnrichedPage, false);
  assert.ok(Array.isArray(gamEnrichedPage.activities));
  assert.ok(Array.isArray(gamEnrichedPage.learning_outcomes));
});

test("every required_material gets a matching material entry", () => {
  gamEnrichedPage.activities.forEach((activity) => {
    const requiredIds = activity.required_materials.map((row) => row.material_id);
    const materialIds = activity.materials.map((row) => row.material_id);
    assert.equal(requiredIds.length, materialIds.length);
    requiredIds.forEach((id) => {
      assert.ok(materialIds.includes(id), "missing material for " + id);
    });
  });
});

test("material IDs are preserved exactly from required_materials", () => {
  gamEnrichedPage.activities.forEach((activity, index) => {
    const baseline = dlaBaseline.activities[index];
    const requiredIds = baseline.required_materials.map((row) => row.material_id);
    const materialIds = activity.materials.map((row) => row.material_id);
    assert.deepEqual(materialIds, requiredIds);
  });
});

test("material titles are present", () => {
  gamEnrichedPage.activities.forEach((activity) => {
    activity.materials.forEach((material) => {
      assert.ok(material.title && String(material.title).trim().length > 0);
    });
  });
});

test("material bodies are present", () => {
  gamEnrichedPage.activities.forEach((activity) => {
    activity.materials.forEach((material) => {
      assert.ok(material.body && String(material.body).trim().length > 0);
    });
  });
});

test('material body_format is "markdown"', () => {
  gamEnrichedPage.activities.forEach((activity) => {
    activity.materials.forEach((material) => {
      assert.equal(material.body_format, "markdown");
    });
  });
});

test("DLA-owned activity fields remain unchanged", () => {
  gamEnrichedPage.activities.forEach((activity, index) => {
    const baseline = dlaBaseline.activities[index];
    assert.equal(
      gamEnrich.activitiesMatchExceptMaterials(baseline, activity),
      true,
      "activity " + activity.activity_id
    );
  });
});

test("required_materials[] remain unchanged", () => {
  gamEnrichedPage.activities.forEach((activity, index) => {
    assert.deepEqual(activity.required_materials, dlaBaseline.activities[index].required_materials);
  });
});

test("page_synthesis remains {}", () => {
  assert.deepEqual(gamEnrichedPage.page_synthesis, {});
});

test("no sections[] are written", () => {
  assert.equal("sections" in gamEnrichedPage, false);
});

test('assembly_state.current_stage becomes "gam"', () => {
  assert.equal(gamEnrichedPage.assembly_state.current_stage, "gam");
});

test('assembly_state.enriched_by includes episode_plan, dla, and gam', () => {
  assert.deepEqual(gamEnrichedPage.assembly_state.enriched_by, ["episode_plan", "dla", "gam"]);
});

test("activity IDs are preserved", () => {
  assert.deepEqual(
    dlaBaseline.activities.map((row) => row.activity_id),
    gamEnrichedPage.activities.map((row) => row.activity_id)
  );
});

test("activity order is preserved", () => {
  assert.deepEqual(
    dlaBaseline.activities.map((row) => row.activity_id),
    gamEnrichedPage.activities.map((row) => row.activity_id)
  );
});

test("GAM-enriched page renders through Phase 8 adapter with authored materials", () => {
  const renderResult = renderUtilityPageHtmlForTest(api, gamEnrichedPage);
  assert.ok(renderResult && !renderResult.error, renderResult && renderResult.error);
  const html = String(renderResult.html || "");
  assert.ok(html.length > 0);
  const firstMaterial = gamEnrichedPage.activities[0].materials[0];
  assert.ok(firstMaterial && firstMaterial.title);
  assert.match(html, new RegExp(firstMaterial.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("GAM v2 derive path is disabled when workflow flag is set false", () => {
  const wf = buildLegacyEpisodePlanWorkflow({ id: "wf-gam-legacy" });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const json = api.deriveGenerateActivityMaterialsCaptureJson(wf);
  assert.equal(String(json || "").trim(), "");
});

test("GAM copy prompt expects page input and page output under v2", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const instr = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(instr, /STEP 4 OUTPUT: page/i);
  assert.match(instr, /Sprint 58 GAM partial output mode|partial page artefact/i);
  assert.match(instr, /Upstream binding bodies are intentionally omitted/i);
  assert.match(instr, /Required payload: activities\[\] containing activity_id and materials\[\] only/i);
  assert.match(instr, /Material authoring guidance \(Sprint 56F v2/i);
  assert.doesNotMatch(instr, /Realise all required_materials as activity_materials/i);
  assert.doesNotMatch(instr, /Treat learning_activities as the source of truth/i);
  assert.doesNotMatch(instr, /Here is the core prompt for this step:/i);
  assert.doesNotMatch(instr, /Material:\s*<material_id>/i);
  assert.doesNotMatch(instr, /Content:\s*\n<full usable material content>/i);
});

test("GAM v2 copy prompt suppresses legacy catalog output-shape instructions", () => {
  const wf = buildTestWorkflow({
    steps: buildTestWorkflow().steps.map((row) =>
      row.id === "gam_step"
        ? Object.assign({}, row, {
            override_prompt_body:
              "Context:\nYou are provided with learning_activities containing required_materials.\n\nTask:\nRealise all required_materials as activity_materials for immediate delivery.\n\nInstructions:\n- Treat learning_activities as the source of truth\n\nOutput organisation:\nActivity ID: <activity_id>\nMaterial: <material_id> (<type>)\nContent:\n<full usable material content>"
          })
        : row
    )
  });
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const instr = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(instr, /Material authoring guidance \(Sprint 56F v2/i);
  assert.doesNotMatch(instr, /Realise all required_materials as activity_materials/i);
  assert.doesNotMatch(instr, /Treat learning_activities as the source of truth/i);
  assert.doesNotMatch(instr, /Material:\s*<material_id>/i);
  assert.doesNotMatch(instr, /Here is the core prompt for this step:/i);
});

test("GAM regression fixture enforces partial-mode upstream omission with copy-forward guidance", () => {
  const wf = buildTestWorkflow();
  const dlaFixture = buildDlaPageFixtureWithFullActivityFields();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    lo_step: JSON.stringify(SAMPLE_LO, null, 2),
    dla_step: JSON.stringify(dlaFixture, null, 2)
  });
  const gamStep = wf.steps.find((s) => s.canonical_step_id === "step_generate_activity_materials");
  const instr = api.buildWorkflowStepInstructions(gamStep, 3, null);
  assert.match(instr, /Upstream binding bodies are intentionally omitted/i);
  assert.match(instr, /Do not reconstruct or preserve non-owned stage fields/i);
  assert.equal(extractUpstreamDlaPageEmbedJson(instr), null);
});

test("GAM bindings use page artefact from Design Learning Activities", () => {
  const wf = buildTestWorkflow();
  const bindings = api.ensureGamPageInputBindingsForSteps(wf.steps, wf);
  const gam = bindings.find((s) => s.id === "gam_step");
  const dlaBinding = (gam.inputBindings || []).find((b) => b.sourceStepId === "dla_step");
  assert.ok(dlaBinding);
  assert.equal(dlaBinding.artifactName, "page");
});

test("deriveGenerateActivityMaterialsCaptureJson emits GAM-enriched vNext page", () => {
  const wf = buildTestWorkflow();
  setupWorkflowCaptures(api, wf, SAMPLE_LO);
  const dlaJson = api.deriveDesignLearningActivitiesCaptureJson(wf);
  assert.ok(dlaJson);
  const dlaBaselineFromDerive = JSON.parse(dlaJson);
  const json = api.deriveGenerateActivityMaterialsCaptureJson(wf);
  assert.ok(json);
  const page = JSON.parse(json);
  const check = gamEnrich.validateGamEnrichedPage(page, dlaBaselineFromDerive);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(page.assembly_state.current_stage, "gam");
});

test("validateGamEnrichedPage rejects material without matching required_material", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].materials.push({
    material_id: "ORPHAN-M99",
    material_type: "text",
    title: "Orphan",
    body: "Should fail",
    body_format: "markdown"
  });
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /no matching required_material|count must match/i.test(err)));
});

test("validateGamEnrichedPage rejects empty material body", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].materials[0].body = "   ";
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /body required/i.test(err)));
});

function buildDlaBaselineWithFullEpisodePlans() {
  const page = buildDlaEnrichedPage(SAMPLE_LO);
  page.episode_plans = page.episode_plans.map((row, index) =>
    Object.assign({}, row, {
      activity_id: row.activity_id || "A" + (index + 1),
      mapped_learning_outcome_ids: [SAMPLE_LO.learning_outcomes[index].id],
      episode_plan_id: "EP-" + (index + 1),
      episode_plan: {
        archetype: row.episode_plan.archetype,
        beats: row.episode_plan.beats.map((beat) => Object.assign({}, beat, { note: "full-beat" }))
      }
    })
  );
  return page;
}

function buildTruncatedGamCapture(baseline, materialsOverride) {
  function defaultMaterials(activity) {
    return activity.required_materials.map((req, index) => ({
      material_id: req.material_id,
      material_type: req.material_type || req.type || "text",
      title: "Authored " + (index + 1),
      body: "Authored body " + (index + 1),
      body_format: "markdown"
    }));
  }
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Truncated title",
    audience: "Truncated audience",
    page_profile: { profile_type: "facilitator" },
    assembly_state: { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] },
    page_synthesis: {},
    learning_outcomes: [{ outcome_id: "X", statement: "Truncated LO" }],
    episode_plans: baseline.episode_plans.map((row) => ({ activity_id: row.mapped_learning_outcome_ids[0] })),
    activities: baseline.activities.map((activity, index) =>
      Object.assign({}, activity, {
        learner_task: "Short task",
        expected_output: "Short output",
        activity_preamble: "Short preamble",
        reasoning_orientation: "Short reasoning",
        self_explanation_prompt: "Short prompt",
        materials: materialsOverride
          ? materialsOverride(activity, index)
          : defaultMaterials(activity)
      })
    )
  };
}

test("top-level episode_plans[] preserved with nested episode_plan objects", () => {
  const baseline = buildDlaBaselineWithFullEpisodePlans();
  const capture = buildTruncatedGamCapture(baseline);
  const merged = gamEnrich.normalizeGamCaptureToPage(baseline, capture);
  assert.ok(merged);
  assert.deepEqual(merged.episode_plans, baseline.episode_plans);
  assert.ok(merged.episode_plans[0].episode_plan);
  assert.ok(merged.episode_plans[0].episode_plan.beats.length > 0);
  const check = gamEnrich.validateGamEnrichedPage(merged, baseline);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("shortened learner_task is rejected if baseline had longer text", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  const original = bad.activities[0].learner_task;
  bad.activities[0].learner_task = original.slice(0, Math.max(1, original.length - 20));
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /learner_task.*shortened/i.test(err)));
});

test("shortened expected_output is rejected if baseline had longer text", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  const original = bad.activities[0].expected_output;
  bad.activities[0].expected_output = original.slice(0, Math.max(1, original.length - 15));
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /expected_output.*shortened/i.test(err)));
});

test("shortened activity_preamble is rejected", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].activity_preamble = "Too short.";
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /activity_preamble.*shortened|activity_preamble must match/i.test(err)));
});

test("cognition/scaffold field drift is rejected", () => {
  const bad = JSON.parse(JSON.stringify(gamEnrichedPage));
  bad.activities[0].reasoning_orientation = "Rewritten shorter cognition.";
  bad.activities[0].scaffold_hint_sequence = ["Only one hint"];
  const check = gamEnrich.validateGamEnrichedPage(bad, dlaBaseline);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /reasoning_orientation|scaffold_hint_sequence/i.test(err)));
});

test("normalizeGamCaptureToPage merges only materials[] from capture onto baseline page", () => {
  const baseline = buildDlaBaselineWithFullEpisodePlans();
  const longTask = baseline.activities[0].learner_task;
  const capture = buildTruncatedGamCapture(baseline, (activity) =>
    activity.required_materials.map((req, index) => ({
      material_id: req.material_id,
      material_type: req.material_type || "text",
      title: "Capture title " + (index + 1),
      body: "Capture body " + (index + 1),
      body_format: "markdown"
    }))
  );
  const merged = gamEnrich.normalizeGamCaptureToPage(baseline, capture);
  assert.ok(merged);
  assert.equal(merged.activities[0].learner_task, longTask);
  assert.equal(merged.activities[0].expected_output, baseline.activities[0].expected_output);
  assert.equal(merged.activities[0].activity_preamble, baseline.activities[0].activity_preamble);
  assert.equal(merged.activities[0].reasoning_orientation, baseline.activities[0].reasoning_orientation);
  assert.deepEqual(merged.episode_plans, baseline.episode_plans);
  assert.ok(merged.activities[0].materials.every((row) => /^Capture body/.test(row.body)));
});

test("Copilot-authored GAM capture cannot overwrite DLA-owned fields", () => {
  const baseline = buildDlaBaselineWithFullEpisodePlans();
  const capture = buildTruncatedGamCapture(baseline);
  const merged = gamEnrich.normalizeGamCaptureToPage(baseline, capture);
  assert.ok(merged);
  baseline.activities.forEach((baseActivity, index) => {
    const mergedActivity = merged.activities[index];
    gamEnrich.GAM_DLA_OWNED_STRING_FIELDS.forEach((field) => {
      if (field in baseActivity) {
        assert.equal(mergedActivity[field], baseActivity[field], field);
      }
    });
    assert.deepEqual(mergedActivity.required_materials, baseActivity.required_materials);
    assert.deepEqual(mergedActivity.episode_plan, baseActivity.episode_plan);
  });
});

test("rendered HTML shorter than JSON is renderer presentation, not GAM mutation", () => {
  const renderResult = renderUtilityPageHtmlForTest(api, gamEnrichedPage);
  const html = String(renderResult.html || "");
  const jsonTask = gamEnrichedPage.activities[0].learner_task;
  const jsonPreamble = gamEnrichedPage.activities[0].activity_preamble;
  assert.ok(jsonTask.length > 40);
  assert.ok(jsonPreamble.length > 10);
  assert.equal(gamEnrichedPage.activities[0].learner_task, dlaBaseline.activities[0].learner_task);
  if (!html.includes(jsonTask)) {
    assert.ok(
      html.includes(jsonPreamble) || html.includes(gamEnrichedPage.activities[0].reasoning_orientation),
      "renderer uses manifestation grammar sections rather than dumping full learner_task verbatim"
    );
  }
});

function guidedCriteriaPayload(overrides) {
  return Object.assign(
    {
      review_mode: "guided_criteria",
      criteria: [
        {
          statement: "Have you described how each genome type produces mRNA?",
          why_it_matters: "Genome-to-mRNA mapping is the core discrimination in this task.",
          features: [
            {
              expected: "Each genome type is linked to an mRNA production route",
              repair: "Add one sentence per genome type naming how mRNA is produced."
            },
            {
              expected: "Positive-sense, negative-sense, and dsRNA are treated distinctly",
              repair: "Separate the three routes instead of collapsing them into one process."
            }
          ],
          confirmation_label: "My response now meets this criterion"
        },
        {
          statement: "Have you avoided treating all RNA genomes as interchangeable?",
          why_it_matters: "Interchangeable treatment hides the diagnostic differences learners must use.",
          features: [
            {
              expected: "At least one explicit contrast between genome types",
              repair: "Add a contrast sentence that names how two genome types differ in mRNA production."
            }
          ]
        },
        {
          statement: "Have you connected genome type to a practical implication for the activity?",
          features: [
            {
              expected: "One consequence for detection, infection, or laboratory practice",
              repair: "State one practical consequence that follows from the genome-to-mRNA route."
            }
          ]
        }
      ]
    },
    overrides || {}
  );
}

function buildGamPartialCaptureWithMaterial(material) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A1",
        materials: [
          Object.assign(
            {
              material_id: "A1-M4",
              material_type: "checklist",
              activity_id: "A1",
              title: "Response quality review"
            },
            material
          )
        ]
      }
    ]
  };
}

test("GAM partial capture accepts guided-review checklist JSON body (object form)", () => {
  const page = buildGamPartialCaptureWithMaterial({
    body_format: "json",
    body: guidedCriteriaPayload()
  });
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("GAM partial capture accepts guided-review checklist JSON body (JSON string form)", () => {
  const page = buildGamPartialCaptureWithMaterial({
    body_format: "json",
    body: JSON.stringify(guidedCriteriaPayload())
  });
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("GAM partial capture still accepts legacy markdown checklist", () => {
  const page = buildGamPartialCaptureWithMaterial({
    body_format: "markdown",
    body: "- Criterion one is clear\n- Criterion two is actionable\n\nIf any check is not met, revise and retry."
  });
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("GAM partial capture rejects malformed guided criteria with field-specific errors", () => {
  const page = buildGamPartialCaptureWithMaterial({
    body_format: "json",
    body: {
      review_mode: "guided_criteria",
      criteria: [
        {
          statement: "",
          features: [{ expected: "", repair: "fix me" }]
        },
        {
          statement: "Second criterion",
          features: []
        }
      ]
    }
  });
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((err) => /criteria\[0\]\.statement required/i.test(err)),
    check.errors.join("; ")
  );
  assert.ok(
    check.errors.some((err) => /criteria\[0\]\.features\[0\]\.expected required/i.test(err)),
    check.errors.join("; ")
  );
  assert.ok(
    check.errors.some((err) => /criteria\[1\]\.features must include at least one item/i.test(err)),
    check.errors.join("; ")
  );
});

test("GAM partial capture rejects JSON body_format on non-checklist materials", () => {
  const page = buildGamPartialCaptureWithMaterial({
    material_type: "text",
    body_format: "json",
    body: guidedCriteriaPayload()
  });
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((err) => /body required/i.test(err)), check.errors.join("; "));
  assert.ok(
    check.errors.some((err) => /body_format must be "markdown"/i.test(err)),
    check.errors.join("; ")
  );
});

test("validateGamEnrichedPage accepts guided-review checklist JSON body", () => {
  const page = JSON.parse(JSON.stringify(gamEnrichedPage));
  const checklist = page.activities[0].materials.find(
    (row) => String(row.material_type || "").toLowerCase() === "checklist"
  );
  assert.ok(checklist, "fixture should include a checklist material");
  checklist.body_format = "json";
  checklist.body = guidedCriteriaPayload();
  const check = gamEnrich.validateGamEnrichedPage(page, dlaBaseline);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});
