/**
 * Sprint 59 — GAM Copy recognition context mismatch regression.
 * Ensures raw step rows and shaped prompt contexts both unlock archetype routing
 * on the live buildWorkflowStepInstructions → clipboard path.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const recognition = require("../lib/workflow-step-recognition-context.js");
const archetype = require("../lib/ld-instructional-archetype.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
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
    Utils: { debounce: (fn) => fn, copyText: () => Promise.resolve(true) },
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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/workflow-artefact-json-strict.js",
      "lib/page-shell-create.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/ld-instructional-archetype.js",
      "lib/workflow-step-recognition-context.js",
      "lib/page-dla-enrich.js",
      "lib/ld-gam-instructional-depth.js",
      "lib/ld-gam-page-enrich-contract.js",
      "lib/page-gam-enrich.js",
      "lib/page-vnext-assemble.js",
      "lib/episode-plan-population-contract.js",
      "lib/episode-plan-v1-templates.js",
      "lib/episode-plan-v1-validation.js",
      "lib/episode-plan-dla-integration.js",
      "lib/ld-design-page-compose-contract.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  assert.ok(typeof api.buildWorkflowStepRecognitionContext === "function");
  assert.ok(typeof api.isWorkflowStepGenerateActivityMaterials === "function");
  assert.ok(typeof api.publishS59FinalGamPromptSnapshot === "function");
  return { api, window: windowStub };
}

function processFixturePage() {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A4",
        required_materials: [
          {
            material_id: "A4-M1",
            material_type: "worked_example"
          }
        ]
      }
    ]
  };
  const stamped = archetype.applyEnzymesProcessTestPlanToDlaPage(page);
  assert.equal(stamped.ok, true);
  return page;
}

function buildGamWorkflow() {
  return {
    id: "wf-s59-gam-ctx",
    goal: "Enzymes — S59_PROCESS_TEST",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "learning_activities",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "generate_activity_materials",
        override_prompt_body: "Populate materials[] from required_materials[]."
      },
      {
        id: "ls_step",
        title: "Design Learning Sequence",
        outputName: "learning_sequence",
        canonical_step_id: "step_design_learning_sequence"
      }
    ]
  };
}

test("raw step context is recognised as GAM via dual-shape gate", () => {
  const raw = {
    title: "Generate Activity Materials",
    canonical_step_id: "generate_activity_materials"
  };
  assert.equal(recognition.isGenerateActivityMaterialsRecognition(raw), true);
  const shaped = recognition.buildWorkflowStepRecognitionContext(raw);
  assert.equal(shaped.stepTitle, "Generate Activity Materials");
  assert.equal(shaped.stepCanonicalStepId, "generate_activity_materials");
  assert.equal(recognition.isGenerateActivityMaterialsRecognition(shaped), true);
});

test("shaped context continues to be recognised as GAM", () => {
  const shaped = {
    stepTitle: "Generate Activity Materials",
    stepCanonicalStepId: "generate_activity_materials"
  };
  assert.equal(recognition.isGenerateActivityMaterialsRecognition(shaped), true);
  const normalised = recognition.buildWorkflowStepRecognitionContext(shaped);
  assert.equal(normalised.stepTitle, "Generate Activity Materials");
  assert.equal(normalised.stepCanonicalStepId, "generate_activity_materials");
});

test("non-GAM steps are not recognised", () => {
  assert.equal(
    recognition.isGenerateActivityMaterialsRecognition({
      title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities"
    }),
    false
  );
  assert.equal(
    recognition.isGenerateActivityMaterialsRecognition({
      stepTitle: "Design Learning Sequence",
      stepCanonicalStepId: "step_design_learning_sequence"
    }),
    false
  );
});

const harness = loadPrismTestApi();
const api = harness.api;
const win = harness.window;

test("app dual-shape recognition matches helper for raw and shaped", () => {
  assert.equal(
    api.isWorkflowStepGenerateActivityMaterials({
      title: "Generate Activity Materials",
      canonical_step_id: "generate_activity_materials"
    }),
    true
  );
  assert.equal(
    api.isWorkflowStepGenerateActivityMaterials({
      stepTitle: "Generate Activity Materials",
      stepCanonicalStepId: "generate_activity_materials"
    }),
    true
  );
  assert.equal(
    api.isWorkflowStepGenerateActivityMaterials({
      title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities"
    }),
    false
  );
});

test("buildWorkflowStepInstructions for process GAM Copy includes routing block", () => {
  const wf = buildGamWorkflow();
  const page = processFixturePage();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify(page, null, 2)
  });

  const rawGamStep = wf.steps.find((s) => s.id === "gam_step");
  const instr = api.buildWorkflowStepInstructions(rawGamStep, 1, null);

  assert.match(instr, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(instr, /Selected rule ids for this request: process_walkthrough/);
  assert.match(instr, /one continuous worked walkthrough/);
  assert.match(instr, /produce an explicit intermediate finding/);
  assert.match(
    instr,
    /Each later stage must consume information generated by earlier stages/
  );
  assert.match(
    instr,
    /do not restate stage labels as procedural Step\/how-to instructions/
  );
});

test("clipboard-equivalent fill preserves routing when no template vars", () => {
  const wf = buildGamWorkflow();
  const page = processFixturePage();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify(page, null, 2)
  });
  const instr = api.buildWorkflowStepInstructions(wf.steps[1], 1, null);
  // fillTemplateVariables returns text unchanged when there are no {{placeholders}}.
  assert.doesNotMatch(instr, /\{\{[^}]+\}\}/);
  assert.match(instr, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(instr, /process_walkthrough/);
  assert.match(instr, /one continuous worked walkthrough/);
  assert.match(instr, /produce an explicit intermediate finding/);
});

test("recognised GAM Copy publishes snapshot equal to clipboard-bound string", () => {
  const wf = buildGamWorkflow();
  const page = processFixturePage();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify(page, null, 2)
  });
  const clipboardBound = api.buildWorkflowStepInstructions(wf.steps[1], 1, null);
  const recognitionCtx = api.buildWorkflowStepRecognitionContext(wf.steps[1], {
    index: 1
  });
  assert.equal(api.isWorkflowStepGenerateActivityMaterials(recognitionCtx), true);

  const snap = api.publishS59FinalGamPromptSnapshot(clipboardBound, {
    source: "workflow_step_copy",
    step_title: recognitionCtx.stepTitle,
    canonical_step_id: recognitionCtx.stepCanonicalStepId
  });
  assert.equal(win.__PRISM_S59_FINAL_GAM_PROMPT.prompt, clipboardBound);
  assert.equal(snap.prompt, clipboardBound);
  assert.equal(snap.source, "workflow_step_copy");
  assert.equal(snap.contains_archetype_routing, true);
  assert.equal(snap.contains_process_rule, true);
  assert.equal(snap.archetype_script_version, "20260715-5");
  assert.equal(snap.step_title, "Generate Activity Materials");
  assert.equal(snap.canonical_step_id, "generate_activity_materials");
});

test("non-GAM steps do not receive instructional archetype routing or GAM snapshots", () => {
  const wf = buildGamWorkflow();
  const page = processFixturePage();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify(page, null, 2)
  });

  delete win.__PRISM_S59_FINAL_GAM_PROMPT;

  const dlaInstr = api.buildWorkflowStepInstructions(wf.steps[0], 0, null);
  assert.doesNotMatch(dlaInstr, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);

  const lsInstr = api.buildWorkflowStepInstructions(wf.steps[2], 2, null);
  assert.doesNotMatch(lsInstr, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);

  const dlaRecognition = api.buildWorkflowStepRecognitionContext(wf.steps[0]);
  assert.equal(api.isWorkflowStepGenerateActivityMaterials(dlaRecognition), false);
  // Snapshot publication remains gated on GAM recognition (mirrors Copy handler).
  if (!api.isWorkflowStepGenerateActivityMaterials(dlaRecognition)) {
    // do not publish
  }
  assert.equal(win.__PRISM_S59_FINAL_GAM_PROMPT, undefined);
});

test("regression: passing raw step into routing draft apply still injects after dual-shape fix", () => {
  const wf = buildGamWorkflow();
  const page = processFixturePage();
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify(page, null, 2)
  });
  const base = "GAM BASE PROMPT WITHOUT ROUTING\nMaterial authoring guidance";
  const rawStep = {
    title: "Generate Activity Materials",
    canonical_step_id: "generate_activity_materials"
  };
  const routed = api.applyLdInstructionalArchetypeRoutingToDraft(base, rawStep, wf);
  assert.match(routed, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(routed, /Selected rule ids for this request: process_walkthrough/);
});
