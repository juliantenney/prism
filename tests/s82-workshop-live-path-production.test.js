"use strict";

/**
 * S82 — Workshop live-path production regressions (authority flow, not injected fixtures).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox,
  patchDlaEnrichBridgeForTests,
  wirePageVnextAssembleForTests
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-assemble");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const assemble = require(path.join(repoRoot, "lib", "page-vnext-assemble.js"));
const renderPage = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "render-page.js"
)).renderPage;
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;

const WORKSHOP_GOAL =
  "Create a 90 minute workshop on constructive feedback for university colleagues.";

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => ({
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
      getAttribute() { return null; },
      addEventListener() {},
      removeEventListener() {},
      focus() {},
      click() {}
    }),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, documentStub.createElement());
      return elementStore.get(id);
    },
    querySelector: () => documentStub.createElement(),
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
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
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
      "lib/page-vnext-assemble.js",
      "lib/ld-dla-page-enrich-contract.js",
      "lib/page-dla-enrich.js"
    ])
  );
  if (sandbox.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT) {
    windowStub.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = sandbox.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT;
  }
  patchDlaEnrichBridgeForTests(dlaEnrich);
  windowStub.PRISM_PAGE_DLA_ENRICH = dlaEnrich;
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function buildWorkshopWorkflow(id) {
  return {
    id: id || "wf-s82-workshop-live",
    name: "Constructive Feedback Workshop",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: WORKSHOP_GOAL,
      session_materials: ["page"]
    },
    workflowBriefResolution: {
      resolvedFactors: {
        delivery_context: "in_person",
        delivery_mode: "live_workshop",
        duration_minutes: 90,
        session_materials: ["page"],
        page_profile: "learner"
      }
    },
    steps: [
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
        canonical_step_id: "step_generate_activity_materials"
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence"
      }
    ]
  };
}

function buildSelfStudyWorkflow() {
  return {
    id: "wf-s82-self-study-live",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      goal: "Create a 60 minute self study resource on educational psychology.",
      session_materials: ["page"]
    },
    workflowBriefResolution: {
      resolvedFactors: {
        delivery_context: "self_directed",
        delivery_mode: "async",
        duration_minutes: 60,
        session_materials: ["page"]
      }
    },
    steps: [
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      }
    ]
  };
}

function setCaptures(api, wf, map) {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const serialized = {};
  Object.keys(map).forEach((stepId) => {
    serialized[stepId] =
      typeof map[stepId] === "string" ? map[stepId] : JSON.stringify(map[stepId], null, 2);
  });
  api.setWorkflowRunCaptureMapsForTest(serialized, Object.assign({}, serialized));
}

function minimalDlaMissingGrouping() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A1",
        title: "Observation or Interpretation?",
        activity_preamble: "Effective feedback starts with a reliable account of what happened.",
        intellectual_coherence_bridge:
          "The workshop enquiry begins by distinguishing observation from interpretation.",
        reasoning_orientation: "Attend to what a statement actually claims.",
        learner_task: "Work through each supplied statement and classify it.",
        expected_output: "Accurate classifications supported by wording.",
        task_material_decision: { separate_inputs_required: false, task_input_material_ids: [] },
        required_materials: [],
        evidence_decision: {
          required: false,
          reason: "No inspectable particulars required.",
          provider_material_ids: []
        }
      }
    ]
  };
}

function workshopDlaWithGrouping() {
  const base = JSON.parse(JSON.stringify(loadFixture("dla-partial.json")));
  base.activities.forEach(function (activity, index) {
    activity.grouping = index === 0 ? "pair" : "small_group";
    if (index === 0) {
      activity.learner_task =
        "With a partner, compare inflation drivers using the evidence supplied.";
    } else {
      activity.learner_task =
        "In your small group, apply CPI calculations to the scenario and compare approaches.";
    }
    activity.intellectual_coherence_bridge =
      activity.intellectual_coherence_bridge || "Carry prior reasoning into this activity.";
    activity.reasoning_orientation =
      activity.reasoning_orientation || "Work with your group using the supplied materials.";
  });
  return base;
}

function gamPartialForRender() {
  const gam = JSON.parse(JSON.stringify(loadFixture("gam-partial.json")));
  gam.activities.forEach((activity) => {
    (activity.materials || []).forEach((material) => {
      if (String(material.material_type || "") === "template") {
        material.material_type = "text";
      }
    });
  });
  return gam;
}

function lsCapture(totalMinutes, timelineMinutes) {
  const timeline = timelineMinutes.map(function (minutes, index) {
    return { activity_id: "A" + (index + 1), duration_minutes: minutes };
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "learning_sequence", enriched_by: ["learning_sequence"] },
    learning_sequence: {
      total_duration_minutes: totalMinutes,
      ordered_activity_ids: timeline.map((row) => row.activity_id),
      timeline: timeline
    }
  };
}

test("A: S75-D22 workshop goal without page token resolves facilitatedDelivery true", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkshopWorkflow();
  const step = wf.steps.find((row) => row.id === "dla_step");
  const prodCtx = api.buildWorkflowStepPromptAugmentContextFromStep(step, wf);
  assert.doesNotMatch(prodCtx.workflowGoal, /\b(page|handout)\b/i);
  assert.equal(api.resolveFacilitatedDeliveryForWorkflow(wf, prodCtx), true);
  const slot = api.buildDlaCanonicalSlotContext(prodCtx, wf);
  assert.equal(slot.facilitatedDelivery, true);
  const contract = dlaContract.assembleDlaCanonicalContract(slot).text;
  assert.match(contract, /each activities\[\] row MUST include grouping/i);
});

test("A: DLA accept validation rejects missing grouping on production Workshop path", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkshopWorkflow();
  const step = wf.steps.find((row) => row.id === "dla_step");
  const capture = minimalDlaMissingGrouping();
  const check = api.validateDlaOrPageCapture(capture, null, wf, step);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /grouping required for facilitated delivery/.test(e)));
});

test("A: self-study workflow keeps facilitatedDelivery false", () => {
  const api = loadPrismTestApi();
  const wf = buildSelfStudyWorkflow();
  const step = wf.steps[0];
  const prodCtx = api.buildWorkflowStepPromptAugmentContextFromStep(step, wf);
  assert.equal(api.resolveFacilitatedDeliveryForWorkflow(wf, prodCtx), false);
  assert.equal(api.buildDlaCanonicalSlotContext(prodCtx, wf).facilitatedDelivery, false);
});

test("B: resolvePageForRenderOrAssembly stamps delivery metadata and session labels render", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkshopWorkflow();
  const epShell = loadFixture("ep-shell.json");
  const dla = workshopDlaWithGrouping();
  const gam = gamPartialForRender();
  setCaptures(api, wf, { ep_step: epShell, dla_step: dla, gam_step: gam });

  const resolved = api.resolvePageForRenderOrAssembly(epShell, wf, {});
  assert.equal(resolved.constraints_applied.delivery_mode, "live_workshop");
  assert.equal(resolved.constraints_applied.delivery_context, "in_person");
  assert.equal(resolved.activities[0].grouping, "pair");

  resolved.learning_outcomes = [{ id: "LO1", statement: "Give constructive feedback." }];
  resolved.page_synthesis = { overview: { body: "Workshop overview.", format: "markdown" } };
  resolved.learning_sequence = {
    navigation_guidance: {
      progression_logic: "The session moves from observation through dialogue."
    }
  };

  const built = buildPageModel(resolved);
  assert.equal(built.ok, true, built.errors && built.errors.join("; "));
  assert.equal(built.model.sessionFraming.kind, "facilitated_session");
  const html = renderPage(built.model);
  assert.match(html, /util-badge-group/);
  assert.match(html, /By the end of this session/);
  assert.doesNotMatch(html, /By the end of this lesson/);
});

test("C: LS capture at 60 min rejected when effective workflow duration is 90", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkshopWorkflow();
  const capture = lsCapture(60, [10, 10, 15, 12, 13]);
  const step = wf.steps.find((row) => row.id === "ls_step");
  const check = api.validateLearningSequencePartialPageCapture(
    capture,
    api.buildLearningSequencePartialValidationOptions(wf)
  );
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) =>
      /must match authoritative effective workflow duration \(90 min\)/.test(e)
    )
  );
});

test("C: compliant 90-minute LS capture is accepted", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkshopWorkflow();
  const capture = lsCapture(90, [18, 18, 18, 18, 18]);
  const check = api.validateLearningSequencePartialPageCapture(
    capture,
    api.buildLearningSequencePartialValidationOptions(wf)
  );
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("C: LS capture rejects total/timeline internal mismatch", () => {
  const api = loadPrismTestApi();
  const wf = buildWorkshopWorkflow();
  const capture = lsCapture(90, [10, 10, 15, 12, 13]);
  const check = api.validateLearningSequencePartialPageCapture(
    capture,
    api.buildLearningSequencePartialValidationOptions(wf)
  );
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /must equal sum of timeline activity durations/.test(e)));
});

test("C: LS timeline durations still project onto activities at assembly", () => {
  const epShell = loadFixture("ep-shell.json");
  const dla = workshopDlaWithGrouping();
  const gam = gamPartialForRender();
  const ls = lsCapture(90, [18, 18, 18, 18, 18]);
  ls.learning_sequence.timeline = [
    { activity_id: "A1", duration_minutes: 18 },
    { activity_id: "A2", duration_minutes: 18 }
  ];
  ls.learning_sequence.total_duration_minutes = 36;
  ls.learning_sequence.ordered_activity_ids = ["A1", "A2"];

  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: epShell,
    dla: dla,
    gam: gam,
    learning_sequence: ls
  });
  assert.equal(result.ok, true);
  assert.equal(result.page.activities[0].duration_minutes, 18);
  assert.equal(result.page.activities[1].duration_minutes, 18);
});
