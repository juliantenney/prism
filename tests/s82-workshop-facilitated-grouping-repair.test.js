"use strict";

/**
 * S82 — Workshop first-class repair: facilitated DLA grouping + session framing labels.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const facilitatedDelivery = require(path.join(repoRoot, "lib", "dla-facilitated-delivery.js"));
const sessionFraming = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "resolve-session-framing.js"
));
const buildPageModel = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "build-page-model.js"
)).buildPageModel;
const renderPage = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "render-page.js"
)).renderPage;

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
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

function minimalFacilitatedActivity(overrides) {
  return Object.assign(
    {
      activity_id: "A1",
      title: "Compare indicators",
      grouping: "small_group",
      learner_task:
        "In your small group, compare the CPI and GDP deflator using the task cards, then agree one defensible difference.",
      expected_output: "A group comparison note citing one indicator-specific difference.",
      activity_preamble: "Different inflation measures capture different baskets and purposes.",
      intellectual_coherence_bridge: "The overview established inflation as a measurement problem.",
      reasoning_orientation: "Compare measures on coverage and purpose before judging which difference matters.",
      task_material_decision: { separate_inputs_required: false, task_input_material_ids: [] },
      required_materials: [],
      evidence_decision: { required: false, reason: "No inspectable particulars required.", provider_material_ids: [] }
    },
    overrides || {}
  );
}

function buildPartialPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [activity]
  };
}

test("facilitated DLA contract requires grouping in §10 output", () => {
  const text = dlaContract.assembleDlaCanonicalContract({
    facilitatedDelivery: true,
    includeExamples: true
  }).text;
  assert.match(text, /each activities\[\] row MUST include grouping/i);
  assert.match(text, /participant-facing orchestration consistent with grouping/i);
  assert.match(text, /facilitator_moves alone is insufficient/i);
});

test("self-directed DLA contract does not require grouping in §10 output", () => {
  const text = dlaContract.assembleDlaCanonicalContract({
    facilitatedDelivery: false,
    includeExamples: true
  }).text;
  assert.doesNotMatch(text, /Facilitated session required activity-row fields/i);
});

test("facilitated capture validation rejects missing grouping", () => {
  const page = buildPartialPage(
    minimalFacilitatedActivity({
      grouping: ""
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { facilitatedDelivery: true });
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /grouping required for facilitated delivery/.test(e)));
});

test("facilitated capture validation rejects collaborative grouping without participant orchestration", () => {
  const page = buildPartialPage(
    minimalFacilitatedActivity({
      grouping: "pair",
      learner_task: "Inspect each statement and classify it using the criteria table."
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { facilitatedDelivery: true });
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /participant-facing orchestration consistent with grouping "pair"/.test(e))
  );
});

test("facilitated capture accepts individual grouping without collaborative wording", () => {
  const page = buildPartialPage(
    minimalFacilitatedActivity({
      grouping: "individual",
      learner_task: "Inspect each statement and classify it using the criteria table."
    })
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { facilitatedDelivery: true });
  assert.equal(check.ok, true, check.errors.join("; "));
});

test("self-directed capture does not require grouping", () => {
  const page = buildPartialPage(
    minimalFacilitatedActivity({
      grouping: undefined
    })
  );
  delete page.activities[0].grouping;
  const check = dlaEnrich.validateDlaPartialPageCapture(page, { facilitatedDelivery: false });
  assert.equal(check.ok, true, check.errors.join("; "));
});

test("grouping on workshop page renders util-badge-group and session labels", () => {
  const page = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests", "fixtures", "page-render", "owen-a1-assembled-shape.json"),
      "utf8"
    )
  );
  page.constraints_applied = { delivery_mode: "live_workshop" };
  page.learning_sequence = Object.assign({}, page.learning_sequence || {}, {
    navigation_guidance: {
      progression_logic:
        "The session moves from orientation through guided practice to independent response."
    }
  });
  page.activities[0].grouping = "small_group";
  page.activities[0].learner_task =
    "In your small group, study the explanatory material and worked example. Then agree one paragraph explaining how personal experience can shape literary representation.";

  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true, JSON.stringify(modelResult.errors));
  assert.equal(modelResult.model.activities[0].grouping, "small_group");
  assert.equal(modelResult.model.sessionFraming.kind, "facilitated_session");

  const html = renderPage(modelResult.model);
  assert.match(html, /class="util-badge util-badge-group">small_group</);
  assert.match(html, /By the end of this session, you should be able to:/);
  assert.match(html, /How this session progresses/);
  assert.doesNotMatch(html, /By the end of this lesson, you should be able to:/);
  assert.doesNotMatch(html, /How this lesson progresses/);
});

test("self-study page keeps lesson labels", () => {
  const page = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests", "fixtures", "page-render", "owen-a1-assembled-shape.json"),
      "utf8"
    )
  );
  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true);
  assert.equal(modelResult.model.sessionFraming.kind, "self_study");
  const html = renderPage(modelResult.model);
  assert.match(html, /By the end of this lesson, you should be able to:/);
  assert.doesNotMatch(html, /By the end of this session, you should be able to:/);
});

test("DLA contract does not add duration_minutes to required output", () => {
  const facilitated = dlaContract.assembleDlaCanonicalContract({
    facilitatedDelivery: true
  }).text;
  const selfDirected = dlaContract.assembleDlaCanonicalContract({
    facilitatedDelivery: false
  }).text;
  assert.doesNotMatch(facilitated, /each activities\[\] row MUST include duration_minutes/i);
  assert.doesNotMatch(selfDirected, /each activities\[\] row MUST include duration_minutes/i);
});

test("buildDlaCanonicalSlotContext passes facilitatedDelivery for workshop workflows", () => {
  const api = loadPrismTestApi();
  const wf = {
    workflowBriefResolution: {
      resolvedFactors: {
        delivery_context: "in_person",
        delivery_mode: "live_workshop",
        session_materials: ["page"]
      }
    },
    workflowOutputSpec: {
      goal: "Create a workshop on feedback skills.",
      session_materials: ["page"]
    }
  };
  const ctx = api.buildDlaCanonicalSlotContext(
    {
      stepCanonicalStepId: "step_design_learning_activities",
      workflowGoal: wf.workflowOutputSpec.goal,
      desiredOutputs: "learner page"
    },
    wf
  );
  assert.equal(ctx.facilitatedDelivery, true);
  const assembled = dlaContract.assembleDlaCanonicalContract(ctx);
  assert.match(assembled.text, /Facilitated session delivery/i);
});

test("duration diagnostic: commissioned 90 resolves before Learning Sequence", () => {
  const api = loadPrismTestApi();
  const wf = {
    workflowBriefResolution: {
      resolvedFactors: {
        delivery_context: "in_person",
        delivery_mode: "live_workshop",
        duration_minutes: 90
      }
    }
  };
  assert.equal(api.resolveCommissionedWorkflowDurationMinutes(wf), 90);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), 90);
  api.setWorkflowAdjustmentParameterValue(wf, "duration_minutes", 60);
  assert.equal(api.resolveEffectiveWorkflowDurationMinutes(wf), 60);
  assert.equal(api.resolveCommissionedWorkflowDurationMinutes(wf), 90);
});

test("learnerTaskExpressesGroupingOrchestration covers pair and whole_group tokens", () => {
  assert.equal(
    facilitatedDelivery.learnerTaskExpressesGroupingOrchestration(
      "pair",
      "With a partner, compare your classifications before you revise."
    ),
    true
  );
  assert.equal(
    facilitatedDelivery.learnerTaskExpressesGroupingOrchestration(
      "whole_group",
      "Share one conclusion with the whole group when prompted."
    ),
    true
  );
});

test("session framing reads constraints_applied.delivery_mode live_workshop", () => {
  const framing = sessionFraming.resolveSessionFramingFromPage({
    constraints_applied: { delivery_mode: "live_workshop" }
  });
  assert.equal(framing.kind, "facilitated_session");
  assert.match(framing.outcomesIntro, /session/);
});
