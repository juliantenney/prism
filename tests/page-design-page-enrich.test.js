/**
 * Sprint 56F Phase 7 — Design Page v2 enrich-in-place tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const strictJson = require(path.join(path.resolve(__dirname, ".."), "lib", "workflow-artefact-json-strict.js"));

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

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
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-shell-create.js",
      "lib/page-render-normalize.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildWorkflow(overrides) {
  return Object.assign(
    {
      id: "wf-dp-v2",
      pageEnrichmentV2: true,
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes", canonical_step_id: "step_define_learning_outcomes" },
        { id: "ep_step", title: "Design Episode Plan", outputName: "episode_plans", canonical_step_id: "step_design_episode_plan" },
        { id: "dla_step", title: "Design Learning Activities", outputName: "learning_activities", canonical_step_id: "step_design_learning_activities" },
        { id: "gam_step", title: "Generate Activity Materials", outputName: "activity_materials", canonical_step_id: "step_generate_activity_materials" },
        { id: "ls_step", title: "Construct Learning Sequence", outputName: "learning_sequence", canonical_step_id: "step_construct_learning_sequence" },
        { id: "dp_step", title: "Design Page", outputName: "page", canonical_step_id: "step_design_page" }
      ]
    },
    overrides || {}
  );
}

function buildLearningSequencePageFixture() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Labour and Markets",
    audience: "Undergraduate learners",
    page_profile: { profile_type: "learner" },
    assembly_state: { current_stage: "learning_sequence", enriched_by: ["episode_plan", "dla", "gam", "learning_sequence"] },
    page_synthesis: {},
    activities: [
      {
        activity_id: "A1",
        title: "Concept framing",
        learner_task: "Summarise the core concept and relation.",
        expected_output: "A concise concept summary.",
        activity_preamble: "Read the model and identify key relations.",
        required_materials: [{ material_id: "A1-M1", material_type: "text", specification: "Explain concepts." }],
        materials: [{ material_id: "A1-M1", material_type: "text", title: "Concept model", body: "A model for concept framing.", body_format: "markdown" }]
      },
      {
        activity_id: "A2",
        title: "Applied interpretation",
        learner_task: "Apply concept to case evidence.",
        expected_output: "A justified interpretation.",
        activity_preamble: "Use evidence from the case extract.",
        required_materials: [{ material_id: "A2-M1", material_type: "worked_example", specification: "Reason through evidence." }],
        materials: [{ material_id: "A2-M1", material_type: "worked_example", title: "Interpretation model", body: "Step through claim, evidence, warrant.", body_format: "markdown" }]
      }
    ],
    learning_sequence: {
      ordered_activity_ids: ["A1", "A2"],
      sequence_title: "Seminar flow",
      total_duration_minutes: 40,
      timeline: [
        { activity_id: "A1", phase_type: "orient", start_minute: 0, duration_minutes: 18, transition_to_next: "Move to applied interpretation." },
        { activity_id: "A2", phase_type: "apply", start_minute: 18, duration_minutes: 22, transition_to_next: "Close and review." }
      ]
    },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Explain and apply core concept." }],
    episode_plans: [
      { activity_id: "A1", episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] } },
      { activity_id: "A2", episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] } }
    ],
    source_artefacts: [{ artefact_type: "episode_plans", source_label: "EP", role: "structural" }],
    generation_notes: {
      validation: {
        activity_coverage: "full",
        material_coverage: "full",
        episode_plan_attachment: "full",
        self_containment: "yes",
        schema_compliance: "2.0.0",
        known_issues: []
      }
    }
  };
}

function buildDesignPageV2CaptureFixture() {
  const page = buildLearningSequencePageFixture();
  page.assembly_state = {
    current_stage: "design_page",
    enriched_by: ["episode_plan", "dla", "gam", "learning_sequence", "design_page"]
  };
  page.page_synthesis = {
    overview: {
      body: "This page guides concept framing and applied interpretation.",
      format: "markdown"
    }
  };
  return page;
}

const api = loadPrismTestApi();

test("Design Page output remains page in v2 normalization", () => {
  const wf = api.normalizeWorkflowForV1(buildWorkflow(), []);
  const dp = wf.steps.find((s) => s.id === "dp_step");
  assert.ok(dp);
  assert.equal(dp.outputName, "page");
});

test("Design Page v2 gets page binding from Learning Sequence", () => {
  const wf = api.normalizeWorkflowForV1(buildWorkflow(), []);
  const steps = api.ensureDesignPageV2PageInputBindingsForSteps(wf.steps, wf);
  const dp = steps.find((s) => s.id === "dp_step");
  assert.ok(dp);
  const lsPageBinding = (dp.inputBindings || []).find(
    (b) => b.kind === "internal" && b.sourceStepId === "ls_step" && b.artifactName === "page"
  );
  assert.ok(lsPageBinding);
});

test("Design Page v2 prompt uses LS page embed and v2 additive contract", () => {
  const wf = api.normalizeWorkflowForV1(buildWorkflow(), []);
  const dpStep = wf.steps.find((s) => s.id === "dp_step");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ls_step: JSON.stringify(buildLearningSequencePageFixture(), null, 2)
  });
  const instr = api.buildWorkflowStepInstructions(dpStep, 5, null);
  assert.match(instr, /STEP 6 OUTPUT: page/i);
  assert.match(instr, /Design Page enrich-in-place/i);
  assert.match(instr, /Upstream Learning Sequence page/i);
  assert.match(instr, /modify only Design Page owned presentation\/layout fields and assembly_state/i);
  assert.match(instr, /Do not regenerate activities, materials, learning_outcomes, episode_plans, or learning_sequence/i);
  assert.doesNotMatch(instr, /### Upstream artefacts \(authoritative — prior step outputs in this conversation\)/i);
});

test("Design Page v2 bypasses legacy strict JSON contract augmentation", () => {
  const wf = api.normalizeWorkflowForV1(buildWorkflow(), []);
  api.setWorkflowsForTest([wf]);
  const out = api.applyStrictJsonArtefactContractToDraftForTest("Base draft", {
    stepOutputName: "page",
    stepCanonicalStepId: "step_design_page",
    stepTitle: "Design Page",
    workflowId: wf.id
  });
  assert.equal(out, "Base draft");
});

test("Design Page v2 validation route accepts page artefact capture", () => {
  const wf = api.normalizeWorkflowForV1(buildWorkflow(), []);
  const dpStep = wf.steps.find((s) => s.id === "dp_step");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    ls_step: JSON.stringify(buildLearningSequencePageFixture(), null, 2)
  });
  const check = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(buildDesignPageV2CaptureFixture(), null, 2),
    dpStep,
    wf
  );
  assert.equal(check.ok, true, check.message || (check.errors || []).join("; "));
});

test("Renderer regression: Design Page v2 page still renders LS + GAM activity content", () => {
  const page = buildDesignPageV2CaptureFixture();
  const sections = api.getPageSectionsForRenderForTest(page);
  const ls = sections.find((s) => s.section_id === "learning_sequence");
  assert.ok(ls);
  const rendered = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    applyCompositionValidation: false
  });
  const html = String(rendered.html || "");
  assert.match(html, /Session timeline/i);
  assert.match(html, /Concept framing/i);
  assert.match(html, /Applied interpretation/i);
});
