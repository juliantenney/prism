/**
 * Sprint 56F Phase 6 — Learning Sequence enrich-in-place tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const strictJson = require(path.join(repoRoot, "lib", "workflow-artefact-json-strict.js"));

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
  windowStub.PRISM_WORKFLOW_ARTEFACT_JSON_STRICT = strictJson;
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

function buildV2Workflow(overrides) {
  return Object.assign(
    {
      id: "wf-ls-v2",
      pageEnrichmentV2: true,
      steps: [
        { id: "lo_step", title: "Define Learning Outcomes", outputName: "learning_outcomes", canonical_step_id: "step_define_learning_outcomes" },
        { id: "ep_step", title: "Design Episode Plan", outputName: "episode_plans", canonical_step_id: "step_design_episode_plan" },
        { id: "dla_step", title: "Design Learning Activities", outputName: "learning_activities", canonical_step_id: "step_design_learning_activities" },
        { id: "gam_step", title: "Generate Activity Materials", outputName: "activity_materials", canonical_step_id: "step_generate_activity_materials" },
        { id: "ls_step", title: "Construct Learning Sequence", outputName: "learning_sequence", canonical_step_id: "step_construct_learning_sequence" }
      ]
    },
    overrides || {}
  );
}

function buildGamPageFixture() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Inflation Learning Page",
    audience: "Undergraduate learners",
    page_profile: { profile_type: "learner" },
    assembly_state: { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] },
    page_synthesis: {},
    activities: [
      {
        activity_id: "A1",
        title: "Activity one",
        learner_task: "Explain inflation drivers using provided evidence.",
        expected_output: "A 150 word explanation.",
        activity_preamble: "Read and annotate the short passage.",
        required_materials: [{ material_id: "A1-M1", material_type: "text", specification: "Provide concept explanation." }],
        materials: [{ material_id: "A1-M1", material_type: "text", title: "Inflation explainer", body: "Inflation is a sustained increase in prices.", body_format: "markdown" }]
      },
      {
        activity_id: "A2",
        title: "Activity two",
        learner_task: "Apply inflation concepts to a policy scenario.",
        expected_output: "A concise policy recommendation.",
        activity_preamble: "Review the scenario and identify key constraints.",
        required_materials: [{ material_id: "A2-M1", material_type: "worked_example", specification: "Show reasoning sequence." }],
        materials: [{ material_id: "A2-M1", material_type: "worked_example", title: "Policy reasoning model", body: "Step 1: identify evidence. Step 2: evaluate options.", body_format: "markdown" }]
      }
    ],
    learning_outcomes: [{ outcome_id: "LO1", statement: "Explain and apply inflation concepts." }],
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

function buildLearningSequenceEnrichedPageFixture() {
  const page = buildGamPageFixture();
  page.learning_sequence = {
    ordered_activity_ids: ["A1", "A2"],
    sequence_title: "Inflation sequence",
    total_duration_minutes: 35,
    timeline: [
      {
        activity_id: "A1",
        phase_type: "concept_build",
        start_minute: 0,
        duration_minutes: 15,
        transition_to_next: "Move from concept explanation to application."
      },
      {
        activity_id: "A2",
        phase_type: "application",
        start_minute: 15,
        duration_minutes: 20,
        transition_to_next: "Close with a concise policy recommendation."
      }
    ]
  };
  page.assembly_state = { current_stage: "learning_sequence", enriched_by: ["episode_plan", "dla", "gam", "learning_sequence"] };
  return page;
}

const api = loadPrismTestApi();

test("v2 normalization sets Learning Sequence outputName to page", () => {
  const wf = buildV2Workflow();
  const normalized = api.normalizeWorkflowForV1(wf, []);
  const ls = normalized.steps.find((s) => s.id === "ls_step");
  assert.ok(ls);
  assert.equal(ls.outputName, "page");
});

test("LS v2 bindings include page input from GAM", () => {
  const wf = api.normalizeWorkflowForV1(buildV2Workflow(), []);
  const steps = api.ensureLearningSequencePageInputBindingsForSteps(wf.steps, wf);
  const ls = steps.find((s) => s.id === "ls_step");
  assert.ok(ls);
  const binding = (ls.inputBindings || []).find((b) => b.sourceStepId === "gam_step");
  assert.ok(binding);
  assert.equal(binding.artifactName, "page");
});

test("LS v2 prompt is full-page in/full-page out and excludes legacy omission logic", () => {
  const wf = api.normalizeWorkflowForV1(buildV2Workflow(), []);
  const lsStep = wf.steps.find((s) => s.id === "ls_step");
  const gamPage = buildGamPageFixture();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    gam_step: JSON.stringify(gamPage, null, 2)
  });
  const instr = api.buildWorkflowStepInstructions(lsStep, 4, null);
  assert.match(instr, /STEP 5 OUTPUT: page/i);
  assert.match(instr, /Learning Sequence enrich-in-place/i);
  assert.match(instr, /Upstream GAM page/i);
  assert.match(instr, /modify only learning_sequence and assembly_state/i);
  assert.match(instr, /Do not rewrite.*materials|Do not rewrite.*learning_outcomes/i);
  assert.match(instr, /activities\.length.*unchanged/i);
  assert.doesNotMatch(instr, /omit an activity|merge it with another activity/i);
});

test("strict JSON contract routing bypasses legacy LS strict block in v2", () => {
  const wf = api.normalizeWorkflowForV1(buildV2Workflow(), []);
  api.setWorkflowsForTest([wf]);
  const out = api.applyStrictJsonArtefactContractToDraftForTest("Base draft", {
    stepOutputName: "page",
    stepCanonicalStepId: "step_construct_learning_sequence",
    stepTitle: "Construct Learning Sequence",
    workflowId: wf.id
  });
  assert.equal(out, "Base draft");
});

test("LS v2 capture validation accepts page artefact output", () => {
  const wf = api.normalizeWorkflowForV1(buildV2Workflow(), []);
  const lsStep = wf.steps.find((s) => s.id === "ls_step");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    gam_step: JSON.stringify(buildGamPageFixture(), null, 2)
  });
  const raw = JSON.stringify(buildLearningSequenceEnrichedPageFixture(), null, 2);
  const check = api.validateStrictJsonWorkflowRunStepCaptureForTest(raw, lsStep, wf);
  assert.equal(check.ok, true, check.message || (check.errors || []).join("; "));
});

test("LS v2 capture validation rejects activity order drift", () => {
  const wf = api.normalizeWorkflowForV1(buildV2Workflow(), []);
  const lsStep = wf.steps.find((s) => s.id === "ls_step");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    gam_step: JSON.stringify(buildGamPageFixture(), null, 2)
  });
  const bad = buildLearningSequenceEnrichedPageFixture();
  bad.activities = [bad.activities[1], bad.activities[0]];
  bad.learning_sequence.ordered_activity_ids = ["A2", "A1"];
  const check = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(bad, null, 2),
    lsStep,
    wf
  );
  assert.equal(check.ok, false);
  assert.match(String(check.message || (check.errors || []).join("; ")), /activity_id order changed|activities\.length changed/i);
});


test("renderer continues to consume learning_sequence from v2 page", () => {
  const page = buildLearningSequenceEnrichedPageFixture();
  const sections = api.getPageSectionsForRenderForTest(page);
  const ls = sections.find((s) => s.section_id === "learning_sequence");
  assert.ok(ls);
  assert.equal(ls.content.sequence_title, "Inflation sequence");
  const rendered = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    applyCompositionValidation: false
  });
  const html = String(rendered.html || "");
  assert.match(html, /Session timeline/i);
  assert.match(html, /Activity one/i);
});
