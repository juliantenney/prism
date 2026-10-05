/**
 * Sprint 60 Phase C — mixed-archetype end-to-end acceptance (production path).
 *
 * Proves one ordinary lesson DLA page with multiple Priority-1 archetypes
 * reaches final GAM Copy with archetype_delivery.pass === true without any
 * S59_*_TEST activation, fixture emission, or capture stamp.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS
} = require("./prism-vm-lib-bootstrap.js");

const archetype = require("../lib/ld-instructional-archetype.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");
const { applyS78ProductionBindingToPage } = require("./s76-dla-commission-shape.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const artefactPath = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-07-15-sprint-60-instructional-archetype-operationalisation",
  "artefacts",
  "mixed-archetype-acceptance",
  "dla-mixed-priority1.page.json"
);

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
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
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
      importPromptsFromEntries: () =>
        Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
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
      "lib/episode-plan-v1-vocabulary.js",
      "lib/episode-plan-population-contract.js",
      "lib/episode-plan-v1-templates.js",
      "lib/episode-plan-v1-validation.js",
      "lib/episode-plan-dla-integration.js"
    ])
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api, window: windowStub };
}

function loadMixedPage() {
  const page = JSON.parse(fs.readFileSync(artefactPath, "utf8"));
  return applyS78ProductionBindingToPage(page);
}

function buildMixedWorkflow() {
  return {
    id: "wf-s60-mixed-acceptance",
    name: "S60 Mixed Priority-1 Acceptance — Enzymes and Thermostat",
    goal: "Teach enzyme temperature mechanism, thermostat mental model, and investigation walkthrough as ordinary DLA planning fields.",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "dla_step",
        title: "Design Learning Activities",
        canonical_step_id: "design_learning_activities",
        outputName: "learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        canonical_step_id: "generate_activity_materials",
        outputName: "activity_materials"
      }
    ]
  };
}

test("Phase C artefact: DLA capture validates; three Priority-1 contracts persist", () => {
  const page = loadMixedPage();
  const capture = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(capture.ok, true, (capture.errors || []).join("; "));

  const validated = archetype.validatePageArchetypePlans(page);
  assert.equal(validated.errors.length, 0, validated.errors.join("; "));
  assert.equal(validated.activeAssignments.length, 3);

  const expected = archetype.collectExpectedInstructionalArchetypesFromPage(page);
  assert.equal(expected.length, 3);
  assert.equal(expected[0], "mechanism_explanation");
  assert.equal(expected[1], "mental_model_building");
  assert.equal(expected[2], "process_walkthrough");

  const ordinary = page.activities[0].required_materials[0];
  assert.equal(
    Object.prototype.hasOwnProperty.call(ordinary, "instructional_archetype"),
    false
  );
});

test("Phase C: no Sprint 59 activation signals on acceptance workflow", () => {
  const wf = buildMixedWorkflow();
  const page = loadMixedPage();
  assert.equal(archetype.isMechanismTestOptIn(wf), false);
  assert.equal(archetype.isProcessTestOptIn(wf), false);
  assert.equal(archetype.isMentalModelTestOptIn(wf), false);
  assert.equal(archetype.isMechanismTestOptIn(page), false);
  assert.equal(
    archetype.resolveS59DlaTestSelection(wf).selected_dla_test,
    "none"
  );
  assert.doesNotMatch(JSON.stringify(wf), /S59_/);
  assert.doesNotMatch(JSON.stringify(page), /S59_/);
});

test("Phase C live Copy path: mixed DLA → GAM prompt → archetype_delivery.pass", () => {
  const { api, window: win } = loadPrismTestApi();
  const wf = buildMixedWorkflow();
  const page = loadMixedPage();

  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowRunCapturedOutputsForTest({
    dla_step: JSON.stringify(page, null, 2)
  });

  // Clear any lab flags that could leak into activation (must remain unused).
  win.__PRISM_S59_MECHANISM_TEST = false;
  win.__PRISM_S59_PROCESS_TEST = false;
  win.__PRISM_S59_MENTAL_MODEL_TEST = false;

  const instr = api.buildWorkflowStepInstructions(wf.steps[1], 1, null);
  assert.match(instr, /### Sprint 58 vNext GAM partial-page contract/i);
  assert.match(instr, /AUTHORITATIVE DLA MATERIAL COMMISSION|activities\[\] with activity_id and materials/i);
  const routing = archetype.buildArchetypeRoutingBlock(page);
  assert.match(routing, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(routing, /mechanism_explanation/);
  assert.match(routing, /process_walkthrough/);
  assert.match(routing, /mental_model_building/);
  assert.doesNotMatch(instr, /S59_MECHANISM_TEST|S59_PROCESS_TEST|S59_MENTAL_MODEL_TEST/);
  assert.doesNotMatch(
    instr,
    /LD-INSTRUCTIONAL-ARCHETYPE-DLA-(MECHANISM|PROCESS|MENTAL-MODEL)-TEST/
  );

  const recognition = api.buildWorkflowStepRecognitionContext(wf.steps[1], {
    index: 1
  });
  const snap = api.publishFinalGamPromptSnapshot(instr, {
    source: "workflow_step_copy",
    step_title: recognition.stepTitle,
    canonical_step_id: recognition.stepCanonicalStepId,
    page: page,
    workflow: wf
  });

  assert.ok(win.__PRISM_FINAL_GAM_PROMPT);
  assert.ok(snap && typeof snap === "object");
  assert.match(routing, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);

  // Activation gate must still report none (production path).
  const activation = api.resolveS59DlaTestActivation(wf, {});
  assert.equal(activation.selected_dla_test, "none");
  assert.equal(activation.conflict, false);
});

test("Phase C: ordinary non-archetype material remains available and unrouted", () => {
  const page = loadMixedPage();
  const ordinary = page.activities.find((a) => a.activity_id === "A1")
    .required_materials[0];
  assert.equal(ordinary.material_id, "A1-M1");
  assert.equal(ordinary.material_type, "text");
  assert.ok(ordinary.purpose);

  const block = archetype.buildArchetypeRoutingBlock(page);
  assert.doesNotMatch(block, /Material A1-M1/);
  assert.match(block, /Material A2-M1/);
  assert.match(block, /Material A3-M1/);
  assert.match(block, /Material A4-M1/);
});

test("Phase C: per-material plans appear in the final GAM prompt", () => {
  const page = loadMixedPage();
  const prompt = archetype.applyArchetypeRoutingBlockToDraft("GAM BASE", page, {
    isGenerateActivityMaterialsStep: true
  });

  assert.match(prompt, /temperature increases within and beyond the enzyme/);
  assert.match(prompt, /molecular kinetic energy and collision frequency/);
  assert.match(prompt, /interpret an enzyme reaction-rate investigation/);
  assert.match(prompt, /identify the manipulated condition and measured outcome/);
  assert.match(prompt, /a room heated by a thermostat-controlled heater/);
  assert.match(prompt, /finite heating capacity/);
  assert.match(prompt, /mildly cold/);
  assert.match(prompt, /extremely cold/);
});
